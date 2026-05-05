// app.js — Spinners World client-side logic (v5: Robust Animated SVGs)
(function(){
  // --- COTTON IMAGES (Unsplash CC0) ---
  const COTTON_IMGS=[
    'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&q=80',
    'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800&q=80',
    'https://images.unsplash.com/photo-1558171813-01ed3d751672?w=800&q=80',
    'https://images.unsplash.com/photo-1596367407372-96cb88503db6?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
  ];

  // --- DARK MODE ---
  const themeToggle=document.getElementById('theme-toggle');
  const savedTheme=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  document.documentElement.setAttribute('data-theme',savedTheme);
  themeToggle.textContent=savedTheme==='dark'?'☀️':'🌙';
  themeToggle.addEventListener('click',()=>{
    const curr=document.documentElement.getAttribute('data-theme');
    const next=curr==='dark'?'light':'dark';
    document.documentElement.setAttribute('data-theme',next);
    localStorage.setItem('theme',next);
    themeToggle.textContent=next==='dark'?'☀️':'🌙';
  });

  // --- NAV ---
  const nav=document.getElementById('main-nav');
  const toggle=document.getElementById('nav-toggle');
  const links=document.getElementById('nav-links');
  window.addEventListener('scroll',()=>{nav.classList.toggle('scrolled',window.scrollY>50)},{passive:true});
  toggle.addEventListener('click',()=>{links.classList.toggle('open')});
  document.querySelectorAll('.nav-link').forEach(l=>{l.addEventListener('click',()=>{links.classList.remove('open')})});

  // --- SCROLL ANIMATIONS ---
  const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){const d=parseInt(e.target.dataset.delay||0);setTimeout(()=>e.target.classList.add('visible'),d);obs.unobserve(e.target)}})},{threshold:0.08,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('[data-animate]').forEach(el=>obs.observe(el));

  // --- ACTIVE NAV ON SCROLL ---
  const sections=document.querySelectorAll('section[id]');
  window.addEventListener('scroll',()=>{
    let cur='';const st=window.scrollY+100;
    sections.forEach(s=>{if(s.offsetTop<=st)cur=s.id});
    document.querySelectorAll('.nav-link').forEach(l=>{
      l.classList.toggle('active',l.dataset.section===cur);
    });
  },{passive:true});

  // --- CATEGORIES DATA (With Inline Animated SVGs) ---
  const CATS=[
    {
      id:'process-control',
      name:'Process Control',
      svg:'<svg class="animate-svg ani-spin" viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.35 19.43,11.03L21.54,9.37C21.73,9.22 21.78,8.97 21.65,8.79L19.65,5.33C19.5,5.15 19.3,5.08 19.11,5.15L16.63,6.15C16.11,5.75 15.55,5.43 14.93,5.18L14.55,2.54C14.5,2.33 14.3,2.17 14.07,2.17H10.07C9.84,2.17 9.65,2.33 9.6,2.54L9.22,5.18C8.6,5.43 8.04,5.75 7.53,6.15L5.04,5.15C4.86,5.08 4.65,5.15 4.53,5.33L2.53,8.79C2.4,8.97 2.45,9.22 2.64,9.37L4.75,11.03C4.71,11.35 4.68,11.67 4.68,12C4.68,12.33 4.71,12.65 4.75,12.97L2.64,14.63C2.45,14.78 2.4,15.03 2.53,15.21L4.53,18.67C4.65,18.85 4.86,18.92 5.04,18.85L7.53,17.85C8.04,18.25 8.6,18.57 9.22,18.82L9.6,21.46C9.65,21.67 9.84,21.83 10.07,21.83H14.07C14.3,21.83 14.5,21.67 14.55,21.46L14.93,18.82C15.55,18.57 16.11,18.25 16.63,17.85L19.11,18.85C19.3,18.92 19.5,18.85 19.65,18.67L21.65,15.21C21.78,15.03 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>'
    },
    {
      id:'fibers-yarns',
      name:'Fibers & Yarns',
      svg:'<svg class="animate-svg ani-float" viewBox="0 0 24 24"><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg>'
    },
    {
      id:'management',
      name:'Management',
      svg:'<svg class="animate-svg ani-float" viewBox="0 0 24 24" style="animation-delay:0.5s"><path d="M19,21H5V3H7V18H11V10H15V18H19V21Z"/></svg>'
    },
    {
      id:'maintenance',
      name:'Maintenance',
      svg:'<svg class="animate-svg ani-float" viewBox="0 0 24 24" style="animation-delay:1s"><path d="M21.71,11.29L15,4.58C14.81,4.39 14.56,4.29 14.3,4.29C14.04,4.29 13.79,4.39 13.6,4.58L12.42,5.76L13.84,7.18L13,8L11.58,6.58L10.4,7.76C10.21,7.95 10.11,8.2 10.11,8.46C10.11,8.72 10.21,8.97 10.4,9.16L17.11,15.87C17.3,16.06 17.55,16.16 17.81,16.16C18.07,16.16 18.32,16.06 18.51,15.87L19.69,14.69L18.27,13.27L19.11,12.43L20.53,13.85L21.71,12.67C21.9,12.48 22,12.23 22,11.97C22,11.71 21.9,11.46 21.71,11.27V11.29M10.05,17.22L6.34,13.5C6.15,13.31 5.9,13.21 5.64,13.21C5.38,13.21 5.13,13.31 4.94,13.5L2.29,16.15C2.1,16.34 2,16.59 2,16.85C2,17.11 2.1,17.36 2.29,17.55L6,21.26C6.19,21.45 6.44,21.55 6.7,21.55C6.96,21.55 7.21,21.45 7.4,21.26L10.05,18.61C10.24,18.42 10.34,18.17 10.34,17.91C10.34,17.65 10.24,17.4 10.05,17.21V17.22Z"/></svg>'
    },
    {
      id:'quality',
      name:'Quality',
      svg:'<svg class="animate-svg ani-pulse" viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>'
    }
  ];

  // --- RENDER CATEGORIES ---
  const catGrid=document.getElementById('categories-grid');
  CATS.forEach(c=>{
    const count=ARTICLES.filter(a=>a.category===c.id).length;
    catGrid.innerHTML+=`<div class="category-card clay-card" onclick="filterByCategory('${c.id}')">
      <div class="category-icon-container">
        ${c.svg}
      </div>
      <div class="category-name">${c.name}</div>
      <div class="category-count">${count} articles</div>
    </div>`;
  });

  // --- RENDER FEATURED ---
  const featGrid=document.getElementById('featured-grid');
  ARTICLES.slice(0,3).forEach((a,i)=>{
    const catLabel=(CATS.find(c=>c.id===a.category)||{}).name||a.category;
    const img=COTTON_IMGS[i%COTTON_IMGS.length];
    featGrid.innerHTML+=`<div class="featured-card clay-card" onclick="openArticle(${a.id})">
      <div class="card-img"><img src="${img}" alt="${a.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800&q=80'"></div>
      <div class="card-category">${catLabel}</div>
      <div class="card-title">${a.title}</div>
      <div class="card-excerpt">${a.excerpt}</div>
      <div class="card-meta"><span>${a.date}</span><span class="card-read">Read →</span></div>
    </div>`;
  });

  // --- RENDER ALL ARTICLES ---
  let currentFilter='all';
  let searchTerm='';
  function renderArticles(){
    const grid=document.getElementById('articles-grid');
    const empty=document.getElementById('articles-empty');
    grid.innerHTML='';
    const filtered=ARTICLES.filter(a=>{
      if(currentFilter!=='all'&&a.category!==currentFilter)return false;
      if(searchTerm){
        const s=searchTerm.toLowerCase();
        return a.title.toLowerCase().includes(s)||a.excerpt.toLowerCase().includes(s)||
          (a.categories||[]).some(c=>c.toLowerCase().includes(s));
      }
      return true;
    });
    if(!filtered.length){empty.style.display='block';return;}
    empty.style.display='none';
    filtered.forEach(a=>{
      const catLabel=(CATS.find(c=>c.id===a.category)||{}).name||a.category;
      grid.innerHTML+=`<div class="article-card clay-card" onclick="openArticle(${a.id})" style="padding:20px; min-height:180px">
        <div class="card-category" style="font-size:0.6rem">${catLabel}</div>
        <div class="card-title" style="font-size:0.95rem; margin-bottom:8px">${a.title}</div>
        <div class="card-excerpt" style="font-size:0.8rem; line-height:1.5">${a.excerpt}</div>
        <div class="card-meta" style="font-size:0.7rem"><span>${a.date}</span><span class="card-read">Read →</span></div>
      </div>`;
    });
  }
  renderArticles();

  // --- FILTERS ---
  document.querySelectorAll('.filter-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter=tab.dataset.filter;
      renderArticles();
    });
  });

  // --- SEARCH ---
  const searchInput=document.getElementById('article-search');
  let searchTimeout;
  searchInput.addEventListener('input',()=>{
    clearTimeout(searchTimeout);
    searchTimeout=setTimeout(()=>{searchTerm=searchInput.value;renderArticles()},200);
  });

  // --- MODAL ---
  const modal=document.getElementById('article-modal');
  const modalContent=document.getElementById('modal-content');
  window.openArticle=function(id){
    const a=ARTICLES.find(x=>x.id===id);if(!a)return;
    const catLabel=(CATS.find(c=>c.id===a.category)||{}).name||a.category;
    const paragraphs=a.content.split(/(?:\. (?=[A-Z]))/g).filter(p=>p.trim().length>20);
    const body=paragraphs.map(p=>`<p>${p.trim()}.</p>`).join('');
    modalContent.innerHTML=`
      <div class="modal-category">${catLabel}</div>
      <h1>${a.title}</h1>
      <div class="modal-meta">By Prakash CVMR · ${a.date}${a.url?` · <a href="${a.url}" target="_blank" rel="noopener" style="color:var(--green)">View original →</a>`:''}</div>
      <div class="modal-body">${body}</div>`;
    modal.classList.add('open');
    document.body.style.overflow='hidden';
  };
  function closeModal(){modal.classList.remove('open');document.body.style.overflow='';}
  document.getElementById('modal-close').addEventListener('click',closeModal);
  document.getElementById('modal-overlay').addEventListener('click',closeModal);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

  // --- FILTER BY CATEGORY (global) ---
  window.filterByCategory=function(cat){
    currentFilter=cat;
    document.querySelectorAll('.filter-tab').forEach(t=>{
      t.classList.toggle('active',t.dataset.filter===cat);
    });
    renderArticles();
    document.getElementById('articles').scrollIntoView({behavior:'smooth'});
  };

  // --- CONTACT FORM ---
  document.getElementById('contact-form').addEventListener('submit',e=>{
    e.preventDefault();
    e.target.style.display='none';
    document.getElementById('form-success').style.display='block';
  });

  // --- PARALLAX ON HERO FLOATS ---
  window.addEventListener('mousemove',e=>{
    const x=(e.clientX/window.innerWidth-.5)*20;
    const y=(e.clientY/window.innerHeight-.5)*20;
    document.querySelectorAll('.hero-float').forEach((el,i)=>{
      const f=(i+1)*0.5;
      el.style.transform=`translate(${x*f}px,${y*f}px)`;
    });
  },{passive:true});
})();
