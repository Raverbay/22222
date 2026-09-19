(()=>{
const esc=window.FLIPCO?.esc||((s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
const live=p=>{try{return FLIPCO.stock(p)>0||p.available===true}catch{return !!p?.available}};
const fallback=p=>p?.art?`assets/products/${esc(p.art)}`:'';
const src=p=>p?.image||fallback(p);
const img=(p,alt='')=>`<img src="${esc(src(p))}" alt="${esc(alt||`${p?.brand||''} ${p?.name||''}`)}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${fallback(p)}'>`;
async function boot(){
 const products=await FLIPCO.load(); if(!products.length)return; const available=products.filter(live);
 const grid=document.querySelector('#fxEditGrid'),count=document.querySelector('#fxEditCount');
 const curated=['NB9060-ERC','FLI-GCDS-BAND-MAN','DSQ2-PUFF-KIDS','FLI-PINKO-LOVE-BAG'].map(id=>products.find(p=>p.id===id)).filter(Boolean).filter(live);
 const card=(p,i)=>`<a class="f29-product-card" href="product.html?id=${encodeURIComponent(p.id)}"><div class="f29-product-image">${img(p)}</div><div class="f29-product-meta"><small>${esc(p.brand)} · ${esc(p.category)}</small><b>${esc(p.name)}</b><span>${p.compareAt&&Number(p.compareAt)>Number(p.price)?`<del>${FLIPCO.money(p.compareAt)}</del> `:''}${FLIPCO.money(p.price)}</span><div class="f29-product-status">${esc(p.badge||'SELECTED')}</div></div></a>`;
 const render=arr=>{if(grid)grid.innerHTML=arr.map(card).join('');if(count)count.textContent=`${String(arr.length).padStart(2,'0')} PIECES / CURATED`};render(curated);
 
 const showcaseGrid=document.querySelector('#flipShowcaseGrid');
 const showcaseCount=document.querySelector('#flipShowcaseCount');
 const showcaseIds=['NB9060-ERC','FLI-GCDS-BAND-MAN','BARROW-TEE-01','MOSCHINO-TEDDY-TEE','FLI-940-MLB-YANKEES'];
 const showcaseData=showcaseIds.map(id=>products.find(p=>p.id===id)).filter(Boolean).filter(live);
 const showcaseCard=p=>`<a class="f52-showcase-card" href="product.html?id=${encodeURIComponent(p.id)}"><div class="f52-showcase-media">${img(p)}${p.badge?`<span class="f52-showcase-badge">${esc(p.badge)}</span>`:''}</div><div class="f52-showcase-meta"><small>${esc(p.brand)} · ${esc(p.category)}</small><strong>${esc(p.name)}</strong><span>${p.compareAt&&Number(p.compareAt)>Number(p.price)?`<del>${FLIPCO.money(p.compareAt)}</del> `:''}${FLIPCO.money(p.price)}</span></div></a>`;
 if(showcaseGrid){
  showcaseGrid.innerHTML=showcaseData.map(showcaseCard).join('');
  if(showcaseCount) showcaseCount.textContent=`01 / ${String(showcaseData.length).padStart(2,'0')}`;
 }

const homePieces=document.querySelector('#homePiecesGrid');
 const homePieceIds=['NB9060-ERC','NB9060-ALP','BARROW-TEE-01','BARROW-HOODIE-01','BARROW-DENIM-01','MOSCHINO-TEDDY-TEE','DSQ2-JEANS-KIDS','FLI-940-MLB-YANKEES'];
 const pieceCard=p=>`<a class="f51-piece" href="product.html?id=${encodeURIComponent(p.id)}"><div class="f51-piece-media">${img(p)}${p.badge?`<span class="f51-piece-badge">${esc(p.badge)}</span>`:''}</div><div class="f51-piece-info"><small>${esc(p.brand)} · ${esc(p.category)}</small><strong>${esc(p.name)}</strong><span>${p.compareAt&&Number(p.compareAt)>Number(p.price)?`<del>${FLIPCO.money(p.compareAt)}</del> `:''}${FLIPCO.money(p.price)}</span><i class="f51-piece-arrow">↗</i></div></a>`;
 const homePiecesData=homePieceIds.map(id=>products.find(p=>p.id===id)).filter(Boolean).filter(live);
 if(homePieces){
  homePieces.innerHTML=homePiecesData.map(pieceCard).join('');
  const viewport=homePieces.closest('.f51-pieces-viewport');
  const prev=document.querySelector('.f51-pieces-prev');
  const next=document.querySelector('.f51-pieces-next');
  const progress=document.querySelector('#homePiecesProgress');
  const progressBar=document.querySelector('#homePiecesProgressBar');
  const cards=()=>Array.from(homePieces.querySelectorAll('.f51-piece'));
  const updatePiecesProgress=()=>{
   if(!viewport)return;
   const items=cards(); if(!items.length)return;
   const center=viewport.scrollLeft+viewport.clientWidth*.18;
   let active=0,best=Infinity;
   items.forEach((el,i)=>{const d=Math.abs(el.offsetLeft-center);if(d<best){best=d;active=i;}});
   if(progress)progress.textContent=`${String(active+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
   if(progressBar)progressBar.style.width=`${((active+1)/items.length)*100}%`;
  };
  const movePieces=(dir)=>{
   const items=cards(); if(!viewport||!items.length)return;
   const current=items.reduce((best,el,i)=>Math.abs(el.offsetLeft-viewport.scrollLeft)<Math.abs(items[best].offsetLeft-viewport.scrollLeft)?i:best,0);
   const target=Math.max(0,Math.min(items.length-1,current+dir));
   viewport.scrollTo({left:items[target].offsetLeft,behavior:'smooth'});
  };
  prev?.addEventListener('click',()=>movePieces(-1));
  next?.addEventListener('click',()=>movePieces(1));
  viewport?.addEventListener('scroll',updatePiecesProgress,{passive:true});
  window.addEventListener('resize',updatePiecesProgress);
  updatePiecesProgress();
 }

 const state={audience:null,need:null},result=document.querySelector('#finderResult');
 const audienceMatch=(p,a)=>{const c=String(p.category||'').toLowerCase(), q=a.toLowerCase(); return c===q||(c==='unisex'&&(q==='uomo'||q==='donna'))};
 const find=()=>available.filter(p=>{if(!state.audience||!state.need)return false;if(!audienceMatch(p,state.audience))return false;return state.need==='all'||String(p.type||'').toLowerCase()===state.need});
 const finder=()=>{if(!result)return;const n=Number(!!state.audience)+Number(!!state.need);result.classList.toggle('is-ready',n===2);result.querySelector('small').textContent=`${n} / 2`;if(n<2){result.querySelector('strong').textContent=n===1?'Perfetto. Ora scegli cosa cerchi.':'Completa le due scelte.';result.querySelector('#finderSelection')?.replaceChildren();return}const arr=find();result.querySelector('strong').textContent=arr.length?`Ecco cosa abbiamo scelto per te.`:'Non lo vediamo nell’Online Edit. Il team può cercarlo in store.';const sel=result.querySelector('#finderSelection');if(sel){sel.innerHTML=arr.length?`<div class="f29-finder-picked">${arr.slice(0,6).map(card).join('')}</div><a class="f29-finder-more" href="#edit">VIEW THE FULL EDIT ↘</a>`:`<div class="f29-finder-empty">Prova un'altra combinazione oppure chiedi al team Flip&Co.</div>`;}setTimeout(()=>result.scrollIntoView({behavior:'smooth',block:'start'}),80)};
 document.querySelectorAll('[data-finder] button').forEach(b=>b.addEventListener('click',()=>{const g=b.closest('[data-finder]').dataset.finder;state[g]=b.dataset.value;b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));finder()}));
 finder();
 // hero showcase — editorial campaign rotation
 const heroSlides=[
  {image:'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=88',brand:'FLIP&CO',name:'THE EDIT',price:'CAGLIARI',link:'shop.html'},
  {image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=88',brand:'CAGLIARI / ITALIA',name:'NEW SEASON',price:'NEW SEASON',link:'collections.html'}
 ];
 let hi=0;
 const himg=document.querySelector('#heroImg'),hbrand=document.querySelector('#heroBrand'),hname=document.querySelector('#heroName'),hprice=document.querySelector('#heroPrice'),hlink=document.querySelector('#heroLink'),hidx=document.querySelector('#heroIndex'),dots=[...document.querySelectorAll('.f29-showcase-controls i')];
 const paint=()=>{const p=heroSlides[hi];if(!p)return;himg.style.opacity='0';setTimeout(()=>{himg.src=p.image;himg.alt=`${p.brand} ${p.name}`;himg.onerror=()=>{};himg.style.objectPosition=hi===1?'center 22%':'center center';hbrand.textContent=p.brand;hname.textContent=p.name;hprice.textContent=p.price;hlink.href=p.link;hidx.textContent=`0${hi+1} / 0${heroSlides.length}`;dots.forEach((d,i)=>d.classList.toggle('active',i===hi));himg.style.opacity='1'},180)};
 const next=()=>{hi=(hi+1)%heroSlides.length;paint()},prev=()=>{hi=(hi-1+heroSlides.length)%heroSlides.length;paint()};
 document.querySelector('#heroNext')?.addEventListener('click',next);document.querySelector('#heroPrev')?.addEventListener('click',prev);paint();
 let timer=setInterval(next,5600);document.querySelector('#heroShowcase')?.addEventListener('mouseenter',()=>clearInterval(timer));document.querySelector('#heroShowcase')?.addEventListener('mouseleave',()=>timer=setInterval(next,5600));
}
boot();
})();


/* V44 — Shop the Look: touch/drag + real catalog data */
(function(){
  "use strict";
  function bootShopTheLook(){
    const root=document.querySelector("[data-lookbook]");
    const track=root?.querySelector(".flip-look-track");
    const slides=root?[...root.querySelectorAll(".flip-look-slide")]:[];
    const dots=[...document.querySelectorAll("[data-look-dot]")];
    const prev=document.querySelector(".flip-look-prev");
    const next=document.querySelector(".flip-look-next");
    const box=document.querySelector("#lookProduct");
    if(!root||!track||!slides.length)return;

    let index=0,startX=0,deltaX=0,dragging=false;

    const fallback=p=>p?.art?`assets/products/${p.art}`:"";
    const esc=window.FLIPCO?.esc||((s)=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])));
    const money=window.FLIPCO?.money||(v=>`€ ${Number(v||0).toFixed(0)}`);
    let catalog=[];

    const loadCatalog=async()=>{
      try{
        catalog=window.FLIPCO?await FLIPCO.load():[];
      }catch(e){catalog=[]}
    };
    const productById=id=>catalog.find(p=>p.id===id);

    function setIndex(n){
      index=(n+slides.length)%slides.length;
      track.style.transform=`translate3d(${-index*100}%,0,0)`;
      slides.forEach((s,i)=>s.classList.toggle("is-active",i===index));
      dots.forEach((d,i)=>d.classList.toggle("is-active",i===index));
    }

    function renderProduct(id){
      const p=productById(id);
      if(!box||!p)return;
      const art=fallback(p);
      const image=p.image||art;
      const sale=p.compareAt&&Number(p.compareAt)>Number(p.price)
        ?`<del>${esc(money(p.compareAt))}</del> ${esc(money(p.price))}`
        :esc(money(p.price));
      box.innerHTML=`<article class="flip-look-product-card">
        <img src="${esc(image)}" alt="${esc(`${p.brand||""} ${p.name||""}`)}" loading="lazy" onerror="this.onerror=null;this.src='${esc(art)}'">
        <div class="flip-look-product-meta">
          <small>${esc(p.brand||"FLIP&CO")} · ${esc(p.category||"SELECTED")}</small>
          <strong>${esc(p.name||"Selected piece")}</strong>
          <span>${sale}</span>
        </div>
        <a class="flip-look-product-link" href="product.html?id=${encodeURIComponent(p.id)}">Scopri il pezzo ↗</a>
      </article>`;
    }

    root.addEventListener("click",e=>{
      const hotspot=e.target.closest(".flip-hotspot");
      if(hotspot){
        e.preventDefault();
        e.stopPropagation();
        renderProduct(hotspot.dataset.productId);
      }
    });

    prev?.addEventListener("click",e=>{e.preventDefault();setIndex(index-1)});
    next?.addEventListener("click",e=>{e.preventDefault();setIndex(index+1)});
    dots.forEach(d=>d.addEventListener("click",()=>setIndex(Number(d.dataset.lookDot))));

    root.addEventListener("pointerdown",e=>{
      if(e.target.closest(".flip-hotspot,.flip-look-arrow"))return;
      dragging=true;startX=e.clientX;deltaX=0;
      root.classList.add("is-dragging");
      try{root.setPointerCapture(e.pointerId)}catch{}
    });
    root.addEventListener("pointermove",e=>{
      if(dragging)deltaX=e.clientX-startX;
    });
    const endDrag=()=>{
      if(!dragging)return;
      dragging=false;root.classList.remove("is-dragging");
      if(Math.abs(deltaX)>55)setIndex(index+(deltaX<0?1:-1));
    };
    root.addEventListener("pointerup",endDrag);
    root.addEventListener("pointercancel",endDrag);
    root.addEventListener("lostpointercapture",endDrag);

    setIndex(0);
    loadCatalog();
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bootShopTheLook);
  else bootShopTheLook();
})();
