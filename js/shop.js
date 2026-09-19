(async()=>{
  const products=(await FLIPCO.load()).filter(p=>FLIPCO.stock(p)>0||p.available===true);
  const $=s=>document.querySelector(s);
  const esc=FLIPCO.esc;

  const subcategoryMap={
    'NB9060-ERC':'Sneakers',
    'NB9060-ALP':'Sneakers',
    'BARROW-TEE-01':'T-shirt',
    'BARROW-HOODIE-01':'Felpe',
    'BARROW-DENIM-01':'Denim',
    'MOSCHINO-TEDDY-TEE':'T-shirt',
    'MOSCHINO-TEDDY-HOODIE':'Felpe',
    'DSQ2-PUFF-KIDS':'Piumini',
    'DSQ2-JEANS-KIDS':'Denim',
    'FLI-940-MLB-YANKEES':'Cappelli',
    'FLI-9FORTY-LAKERS':'Cappelli',
    'FLI-GCDS-BAND-MAN':'T-shirt',
    'FLI-GCDS-BERMUDA':'Shorts & Bermuda',
    'FLI-PINKO-LOVE-BAG':'Borse',
    'FLI-BOMBER-BASEBALL-PROPAGANDA':'Giacche',
    'FLI-SPRYGROUND-BOXER':'Costumi',
    'FLI-BARROW-SOCKS-KIDS':'Calze'
  };

  const sub=p=>subcategoryMap[p.id]||(
    p.type==='sneaker'?'Sneakers':
    p.type==='bag'?'Borse':
    p.type==='accessory'?'Accessori':
    p.type==='swimwear'?'Costumi':'Abbigliamento'
  );

  const categoryFor=p=>(
    p.type==='sneaker'?'Sneakers':
    p.type==='bag'?'Borse':
    p.type==='accessory'?'Accessori':
    p.type==='swimwear'?'Costumi':'Abbigliamento'
  );

  let state={
    audience:new URLSearchParams(location.search).get('audience')||'all',
    category:new URLSearchParams(location.search).get('type')||'all',
    subcategory:new URLSearchParams(location.search).get('subcategory')||'all',
    brand:new URLSearchParams(location.search).get('brand')||'all',
    price:new URLSearchParams(location.search).get('price')||'all'
  };

  const matchesAudience=(p,a)=>{
    if(a==='all') return true;
    if(p.audience===a||p.category===a) return true;
    return p.audience==='Unisex'&&(a==='Uomo'||a==='Donna');
  };

  const money=p=>FLIPCO.money(p.price);
  const img=p=>p.image||`assets/products/${p.art||'nb-9060-erc.svg'}`;

  function filtered(){
    return products.filter(p=>{
      if(!matchesAudience(p,state.audience))return false;
      if(state.category!=='all'&&categoryFor(p)!==state.category)return false;
      if(state.subcategory!=='all'&&sub(p)!==state.subcategory)return false;
      if(state.brand!=='all'&&p.brand!==state.brand)return false;
      if(state.price!=='all'){
        const [a,b]=state.price.split('-').map(Number);
        if(Number(p.price)<a||Number(p.price)>b)return false;
      }
      return true;
    });
  }

  function categories(){
    const base=products.filter(p=>matchesAudience(p,state.audience));
    const order=['all','Abbigliamento','Sneakers','Borse','Accessori','Costumi'];
    const present=[...new Set(base.map(categoryFor))];
    return order.filter(x=>x==='all'||present.includes(x));
  }

  function renderWorlds(){
    document.querySelectorAll('#worlds [data-audience]').forEach(b=>{
      b.classList.toggle('is-active',b.dataset.audience===state.audience);
    });
  }

  function renderCategories(){
    const el=$('#shopCategories');
    const cats=categories();
    if(!cats.includes(state.category))state.category='all';
    const labels={all:'TUTTO',Abbigliamento:'ABBIGLIAMENTO',Sneakers:'SNEAKERS',Borse:'BORSE',Accessori:'ACCESSORI',Costumi:'COSTUMI'};
    el.innerHTML=cats.map(c=>`<button type="button" class="${state.category===c?'is-active':''}" data-category="${esc(c)}">${labels[c]}</button>`).join('');
  }

  function renderSubcategories(){
    const el=$('#shopSubcategories');
    const base=products.filter(p=>matchesAudience(p,state.audience)&&(state.category==='all'||categoryFor(p)===state.category));
    const values=[...new Set(base.map(sub))];
    if(state.subcategory!=='all'&&!values.includes(state.subcategory))state.subcategory='all';
    if(!values.length){el.hidden=true;el.innerHTML='';return}
    el.hidden=false;
    el.innerHTML=`<button type="button" class="${state.subcategory==='all'?'is-active':''}" data-subcategory="all">TUTTE</button>`+
      values.map(v=>`<button type="button" class="${state.subcategory===v?'is-active':''}" data-subcategory="${esc(v)}">${esc(v.toUpperCase())}</button>`).join('');
  }

  function renderFilterLists(){
    const base=products.filter(p=>matchesAudience(p,state.audience)&&(state.category==='all'||categoryFor(p)===state.category));
    const brands=[...new Set(base.map(p=>p.brand))].sort((a,b)=>a.localeCompare(b));
    $('#shopBrands').innerHTML=[`<button data-brand="all" class="${state.brand==='all'?'is-active':''}">Tutti</button>`,...brands.map(b=>`<button data-brand="${esc(b)}" class="${state.brand===b?'is-active':''}">${esc(b)}</button>`)].join('');
    const prices=[['all','Tutti'],['0-100','Fino a €100'],['100-200','€100 — €200'],['200-9999','Oltre €200']];
    $('#shopPrices').innerHTML=prices.map(([v,l])=>`<button data-price="${v}" class="${state.price===v?'is-active':''}">${l}</button>`).join('');
  }

  function card(p,i){
    const sale=p.compareAt&&Number(p.compareAt)>Number(p.price);
    const availableSizes=(p.sizes||[]).filter(s=>!p.stock||p.stock[s]===undefined||Number(p.stock[s])>0);
    const quick=availableSizes.length>0;
    return `<article class="v46-card">
      <a class="v46-card-image" href="product.html?id=${encodeURIComponent(p.id)}">
        <img src="${esc(img(p))}" alt="${esc(p.brand)} ${esc(p.name)}" loading="${i<4?'eager':'lazy'}"
          onerror="this.onerror=null;this.src='assets/products/${esc(p.art||'nb-9060-erc.svg')}'">
        <span class="v46-card-no">${String(i+1).padStart(2,'0')}</span>
        ${p.badge?`<span class="v46-card-badge">${esc(p.badge)}</span>`:''}
        ${sale?`<span class="v46-card-sale">SALE</span>`:''}
        ${quick?`<button class="v46-quick-trigger" type="button" data-quick="${esc(p.id)}">+ BAG</button>`:''}
      </a>
      <div class="v46-card-meta">
        <div><small>${esc(p.brand)} · ${esc(sub(p))}</small><h2>${esc(p.name)}</h2></div>
        <strong>${sale?`<del>${money({price:p.compareAt})}</del> `:''}${money(p)}</strong>
      </div>
      <div class="v46-card-foot"><span>${esc(p.color||'')}</span><a href="product.html?id=${encodeURIComponent(p.id)}">VEDI ↗</a></div>
    </article>`;
  }

  function render(){
    renderWorlds();renderCategories();renderSubcategories();renderFilterLists();
    const list=filtered();
    const title=state.audience==='all'?'Tutto, per ora.':`${state.audience}, scelto da noi.`;
    $('#catalogTitle').textContent=title;
    $('#shopCount').textContent=String(list.length).padStart(2,'0');
    $('#productGrid').innerHTML=list.length?list.map(card).join(''):`<div class="v46-empty"><span>0 / ${state.audience.toUpperCase()}</span><h2>Qui non abbiamo<br><i>ancora niente.</i></h2><p>Prova un’altra categoria o guarda tutta la selezione.</p></div>`;
    const active=[];
    if(state.category!=='all')active.push(state.category);
    if(state.subcategory!=='all')active.push(state.subcategory);
    if(state.brand!=='all')active.push(state.brand);
    if(state.price!=='all')active.push(state.price==='0-100'?'Fino a €100':state.price==='100-200'?'€100 — €200':'Oltre €200');
    $('#activeFilters').innerHTML=active.map(x=>`<button type="button" data-clear="${esc(x)}">${esc(x)} ×</button>`).join('');
    sync();
  }

  function sync(){
    const q=new URLSearchParams();
    if(state.audience!=='all')q.set('audience',state.audience);
    if(state.category!=='all')q.set('type',state.category);
    if(state.subcategory!=='all')q.set('subcategory',state.subcategory);
    if(state.brand!=='all')q.set('brand',state.brand);
    if(state.price!=='all')q.set('price',state.price);
    history.replaceState({},'',`shop.html${q.toString()?'?'+q.toString():''}`);
  }

  // World navigation
  $('#worlds').addEventListener('click',e=>{
    const b=e.target.closest('[data-audience]');if(!b)return;
    state={audience:b.dataset.audience,category:'all',subcategory:'all',brand:'all',price:'all'};
    render();
    $('#catalogo').scrollIntoView({behavior:'smooth',block:'start'});
  });

  $('#shopCategories').addEventListener('click',e=>{
    const b=e.target.closest('[data-category]');if(!b)return;
    state.category=b.dataset.category;state.subcategory='all';state.brand='all';render();
  });

  $('#shopSubcategories').addEventListener('click',e=>{
    const b=e.target.closest('[data-subcategory]');if(!b)return;
    state.subcategory=b.dataset.subcategory;render();
  });

  $('#shopBrands').addEventListener('click',e=>{
    const b=e.target.closest('[data-brand]');if(!b)return;
    state.brand=b.dataset.brand;render();
  });

  $('#shopPrices').addEventListener('click',e=>{
    const b=e.target.closest('[data-price]');if(!b)return;
    state.price=b.dataset.price;render();
  });

  $('#activeFilters').addEventListener('click',e=>{
    const b=e.target.closest('[data-clear]');if(!b)return;
    const x=b.dataset.clear;
    if(x===state.category)state.category='all';
    else if(x===state.subcategory)state.subcategory='all';
    else if(x===state.brand)state.brand='all';
    else state.price='all';
    render();
  });

  // Drawer
  const drawer=$('#filterDrawer');
  const open=()=>{drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll')};
  const close=()=>{drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll')};
  $('#openFilters').onclick=open;$('#closeFilters').onclick=close;$('#filterBackdrop').onclick=close;
  $('#applyFilters').onclick=close;
  $('#resetFilters').onclick=()=>{state.brand='all';state.price='all';render()};

  // Quick add — intentionally stays inside Shop, without replacing the product page.
  const quick=$('#quickAdd');
  let quickProduct=null,quickSize=null;
  function closeQuick(){quick.classList.remove('open');quick.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll')}
  function openQuick(id){
    quickProduct=products.find(p=>p.id===id);if(!quickProduct)return;
    quickSize=null;
    $('#quickImage').src=img(quickProduct);$('#quickImage').alt=quickProduct.name;
    $('#quickBrand').textContent=quickProduct.brand;
    $('#quickName').textContent=quickProduct.name;
    $('#quickPrice').textContent=money(quickProduct);
    $('#quickNote').textContent=quickProduct.selectionNote||'Selezionato per l’Online Edit Flip&Co.';
    const sizes=(quickProduct.sizes||[]).filter(s=>!quickProduct.stock||quickProduct.stock[s]===undefined||Number(quickProduct.stock[s])>0);
    $('#quickSizes').innerHTML=sizes.length?sizes.map(s=>`<button type="button" data-size="${esc(s)}">${esc(s)}</button>`).join(''):'<span class="v46-no-size">Disponibilità da confermare in store.</span>';
    $('#quickSizeHint').textContent=sizes.length?'Seleziona una taglia':'Disponibilità su richiesta';
    $('#quickAddButton').disabled=!sizes.length;
    $('#quickProductLink').href=`product.html?id=${encodeURIComponent(id)}`;
    quick.classList.add('open');quick.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');
  }
  $('#productGrid').addEventListener('click',e=>{
    const b=e.target.closest('[data-quick]');if(!b)return;
    e.preventDefault();e.stopPropagation();openQuick(b.dataset.quick);
  });
  $('#quickSizes').addEventListener('click',e=>{
    const b=e.target.closest('[data-size]');if(!b)return;
    quickSize=b.dataset.size;
    document.querySelectorAll('#quickSizes [data-size]').forEach(x=>x.classList.toggle('is-active',x===b));
    $('#quickAddButton').disabled=false;
  });
  $('#quickAddButton').onclick=()=>{
    if(!quickProduct||!quickSize)return;
    FLIPCO_CART.add(quickProduct.id,quickSize,1);
    closeQuick();
    $('#cartBtn')?.click();
  };
  $('#quickClose').onclick=closeQuick;$('#quickBackdrop').onclick=closeQuick;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeQuick()});

  render();
})();