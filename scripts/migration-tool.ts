// scripts/migration-tool.ts
import { chromium } from "@playwright/test";
import fetch from "node-fetch";
import TurndownService from "turndown";
import { writeFile, mkdir, existsSync } from "fs";
import { join, dirname } from "path";
import { pipeline } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);

const BLOG_URL = "https://textilesworldwide.blogspot.com/";
const RSS_URL = `${BLOG_URL}feeds/posts/default?alt=rss`;

async function downloadImage(url: string, destFolder: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const urlObj = new URL(url);
    const filename = urlObj.pathname.split("/").pop() || "image.jpg";
    const destPath = join(destFolder, filename);
    await mkdir(destFolder, { recursive: true });
    await streamPipeline(response.body, writeFileSyncStream(destPath));
    return `public/images/migrated/${filename}`;
  } catch (e) {
    console.error("Image download error", e);
    return null;
  }
}

function writeFileSyncStream(path: string) {
  const fs = require("fs");
  return fs.createWriteStream(path);
}

function replaceImageUrls(html: string, downloadedMap: Record<string, string>) {
  return html.replace(/<img[^>]+src="([^"]+)"/g, (match, src) => {
    const local = downloadedMap[src];
    if (local) {
      return match.replace(src, `/${local}`);
    }
    return match;
  });
}

(async () => {
  console.log("Starting migration...");
  const rssResponse = await fetch(RSS_URL);
  const rssText = await rssResponse.text();
  const parser = new DOMParser();
  const rssDoc = parser.parseFromString(rssText, "application/xml");
  const items = Array.from(rssDoc.querySelectorAll("item"));

  const turndown = new TurndownService({ headingStyle: "atx" });
  const imgMap: Record<string, string> = {};

  for (const item of items) {
    const title = item.querySelector("title")?.textContent?.trim() || "Untitled";
    const link = item.querySelector("link")?.textContent?.trim();
    const pubDate = item.querySelector("pubDate")?.textContent?.trim() || new Date().toISOString();
    const categories = Array.from(item.querySelectorAll("category")).map(c => c.textContent?.trim() ?? "");

    if (!link) continue;
    console.log(`Processing ${title}`);
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(link);
    // Grab the article body – Blogger uses .post-body
    const html = await page.$eval('.post-body', el => el.innerHTML);
    await browser.close();

    // Download images referenced in the HTML
    const imgMatches = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)];
    for (const m of imgMatches) {
      const src = m[1];
      if (!imgMap[src]) {
        const localPath = await downloadImage(src, "public/images/migrated");
        if (localPath) imgMap[src] = localPath;
      }
    }
    const htmlWithLocalImages = replaceImageUrls(html, imgMap);

    const markdown = turndown.turndown(htmlWithLocalImages);
    const frontMatter = `---\ntitle: "${title.replace(/"/g, "\\\"")}"\ndate: "${new Date(pubDate).toISOString()}"\ncategories: [${categories.map(c => `"${c}"`).join(", ")} ]\n---\n\n`;
    const content = frontMatter + markdown;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const filePath = join("content", "posts", `${slug}.md`);
    await mkdir(dirname(filePath), { recursive: true });
    await new Promise((resolve, reject) => {
      writeFile(filePath, content, err => (err ? reject(err) : resolve(undefined)));
    });
  }
  console.log("Migration completed.");
})();
