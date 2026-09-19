(async()=>{
  const products=(await FLIPCO.load()).filter(p=>FLIPCO.stock(p)>0||p.available===true);
  const esc=FLIPCO.esc;
  const selectionIds=['NB9060-ERC','FLI-GCDS-BAND-MAN','DSQ2-PUFF-KIDS','FLI-PINKO-LOVE-BAG'];
  const selection=selectionIds.map(id=>products.find(p=>p.id===id)).filter(Boolean);
  const money=p=>FLIPCO.money(p.price);
  const img=p=>p.image||`assets/products/${p.art||'nb-9060-erc.svg'}`;
  const sale=p=>p.compareAt&&Number(p.compareAt)>Number(p.price);
  const fallback=p=>`assets/products/${p.art||'nb-9060-erc.svg'}`;

  const selectionViewport=document.querySelector('#selectionViewport');
  const selectionIndex=document.querySelector('#selectionIndex');
  const selectionProgress=document.querySelector('#selectionProgress');

  function selectionCard(p,i){
    return `<a class="c514-card" href="product.html?id=${encodeURIComponent(p.id)}">
      <div class="c514-image">
        <img src="${esc(img(p))}" alt="${esc(p.brand)} ${esc(p.name)}" loading="${i<2?'eager':'lazy'}" decoding="async" onerror="this.onerror=null;this.src='${esc(fallback(p))}'">
      </div>
      <div class="c514-meta">
        <div><small>${esc(p.brand)} · ${esc(p.category)}</small><strong>${esc(p.name)}</strong></div>
        <span class="c514-price">${sale(p)?`<del>${money({price:p.compareAt})}</del> `:''}${money(p)}</span>
      </div>
    </a>`;
  }

  function allCard(p,i){
    return `<a class="c514-product" href="product.html?id=${encodeURIComponent(p.id)}">
      <div class="c514-product-image">
        <img src="${esc(img(p))}" alt="${esc(p.brand)} ${esc(p.name)}" loading="${i<4?'eager':'lazy'}" decoding="async" onerror="this.onerror=null;this.src='${esc(fallback(p))}'">
      </div>
      <div class="c514-product-meta">
        <div><small>${esc(p.brand)} · ${esc(p.category)}</small><b>${esc(p.name)}</b></div>
        <span class="c514-product-price">${sale(p)?`<del>${money({price:p.compareAt})}</del> `:''}${money(p)}</span>
      </div>
      <div class="c514-product-foot"><span>${esc(p.color||'')}</span><span>VEDI ↗</span></div>
    </a>`;
  }

  if(selectionViewport){
    selectionViewport.innerHTML=selection.map(selectionCard).join('');
    const cards=()=>Array.from(selectionViewport.querySelectorAll('.c514-card'));
    const update=()=>{
      const items=cards(); if(!items.length)return;
      const center=selectionViewport.scrollLeft+selectionViewport.clientWidth*.2;
      let active=0,best=Infinity;
      items.forEach((el,i)=>{const d=Math.abs(el.offsetLeft-center);if(d<best){best=d;active=i;}});
      if(selectionIndex)selectionIndex.textContent=`${String(active+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
      if(selectionProgress)selectionProgress.style.width=`${((active+1)/items.length)*100}%`;
    };
    const move=dir=>{
      const items=cards(); if(!items.length)return;
      const current=items.reduce((best,el,i)=>Math.abs(el.offsetLeft-selectionViewport.scrollLeft)<Math.abs(items[best].offsetLeft-selectionViewport.scrollLeft)?i:best,0);
      const target=Math.max(0,Math.min(items.length-1,current+dir));
      selectionViewport.scrollTo({left:items[target].offsetLeft,behavior:'smooth'});
    };
    document.querySelector('#selectionPrev')?.addEventListener('click',()=>move(-1));
    document.querySelector('#selectionNext')?.addEventListener('click',()=>move(1));
    selectionViewport.addEventListener('scroll',update,{passive:true});
    window.addEventListener('resize',update);
    update();
  }

  const all=document.querySelector('#allProducts');
  if(all){
    all.innerHTML=products.map(allCard).join('');
    document.querySelector('#allCount').textContent=`${String(products.length).padStart(2,'0')} PEZZI`;
  }
})();