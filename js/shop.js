(async()=>{
  const all = (await FLIPCO.load()).filter(p => FLIPCO.stock(p) > 0 || p.available === true);
  const e = FLIPCO.esc;
  const grid = document.querySelector('#productGrid');

  const audienceOrder = ['all','Uomo','Donna','Kids'];

  const categoryOrder = [
    ['all','TUTTO'],
    ['apparel','ABBIGLIAMENTO'],
    ['sneaker','SNEAKERS'],
    ['bag','BORSE'],
    ['accessory','ACCESSORI'],
    ['swimwear','COSTUMI']
  ];

  // Subcategories are intentionally derived from the current catalog.
  // When a new product arrives, add its id here rather than creating
  // empty categories in the storefront.
  const subcategoryMap = {
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
    'FLI-PINKO-LOVE-BAG':'Shoulder Bags',
    'FLI-BOMBER-BASEBALL-PROPAGANDA':'Giacche',
    'FLI-SPRYGROUND-BOXER':'Costumi',
    'FLI-BARROW-SOCKS-KIDS':'Calze'
  };

  const subcategoryFor = p => subcategoryMap[p.id] || (
    p.type === 'sneaker' ? 'Sneakers' :
    p.type === 'bag' ? 'Borse' :
    p.type === 'accessory' ? 'Accessori' :
    p.type === 'swimwear' ? 'Costumi' :
    'Abbigliamento'
  );

  let params = new URLSearchParams(location.search);
  let audience = params.get('audience') || 'all';
  // Backward compatibility with the old shop URLs.
  if (['Uomo','Donna','Kids'].includes(params.get('category'))) audience = params.get('category');

  let state = {
    audience,
    category: params.get('type') || 'all',
    subcategory: params.get('subcategory') || 'all',
    brand: params.get('brand') || 'all',
    price: params.get('price') || 'all'
  };

  const card = p => `
    <a class="shop-card" href="product.html?id=${encodeURIComponent(p.id)}">
      <div class="shop-img">
        <img src="${e(p.image || `assets/products/${p.art || ''}`)}"
             alt="${e(p.brand)} ${e(p.name)}"
             loading="lazy"
             onerror="this.onerror=null;this.src='assets/products/${e(p.art || 'nb-9060-erc.svg')}'">
        <span>${e(p.badge || 'SELECTED')}</span>
        ${p.compareAt && Number(p.compareAt) > Number(p.price) ? '<i class="sale-dot">SALE</i>' : ''}
      </div>
      <div class="shop-meta">
        <div>
          <small>${e(p.brand)} · ${e(subcategoryFor(p))}</small>
          <b>${e(p.name)}</b>
        </div>
        <strong>${p.compareAt && Number(p.compareAt) > Number(p.price) ? `<del>${FLIPCO.money(p.compareAt)}</del> ` : ''}${FLIPCO.money(p.price)}</strong>
      </div>
    </a>`;

  const matchesAudience = (p, a) => {
    if(a === 'all') return true;
    if(p.audience === a || p.category === a) return true;
    // Unisex adult accessories belong to Uomo and Donna, never Kids.
    if(p.audience === 'Unisex' && (a === 'Uomo' || a === 'Donna')) return true;
    return false;
  };

  const renderAudience = () => {
    const el = document.querySelector('#shopAudience');
    el.innerHTML = audienceOrder.map(a => `
      <button type="button" data-audience="${a}" class="${state.audience === a ? 'active' : ''}">
        ${a === 'all' ? 'ALL' : a.toUpperCase()}
      </button>
    `).join('');
  };

  const availableForAudience = () => all.filter(p => matchesAudience(p, state.audience));

  const renderCategories = () => {
    const base = availableForAudience();
    const valid = categoryOrder.filter(([key]) => key === 'all' || base.some(p => p.type === key));
    const el = document.querySelector('#shopCategories');

    if(!valid.some(([key]) => key === state.category)) state.category = 'all';

    el.innerHTML = valid.map(([key,label]) => `
      <button type="button" data-category="${key}" class="${state.category === key ? 'active' : ''}">
        ${label}
      </button>
    `).join('');
  };

  const renderSubcategories = () => {
    const base = availableForAudience().filter(p => state.category === 'all' || p.type === state.category);
    const subs = [...new Set(base.map(subcategoryFor))];

    const row = document.querySelector('#shopSubcategoryRow');
    const el = document.querySelector('#shopSubcategories');

    if(!subs.length){
      row.hidden = true;
      state.subcategory = 'all';
      return;
    }

    row.hidden = false;
    if(state.subcategory !== 'all' && !subs.includes(state.subcategory)) state.subcategory = 'all';

    el.innerHTML = [
      `<button type="button" data-subcategory="all" class="${state.subcategory === 'all' ? 'active' : ''}">TUTTE</button>`,
      ...subs.map(s => `<button type="button" data-subcategory="${e(s)}" class="${state.subcategory === s ? 'active' : ''}">${e(s.toUpperCase())}</button>`)
    ].join('');
  };

  const renderBrands = () => {
    const base = availableForAudience().filter(p => state.category === 'all' || p.type === state.category);
    const brands = [...new Set(base.map(p => p.brand))].sort((a,b)=>a.localeCompare(b,'it'));
    const el = document.querySelector('#shopBrands');

    if(state.brand !== 'all' && !brands.includes(state.brand)) state.brand = 'all';

    el.innerHTML = [
      `<button type="button" data-brand="all" class="${state.brand === 'all' ? 'active' : ''}">Tutti</button>`,
      ...brands.map(b => `<button type="button" data-brand="${e(b)}" class="${state.brand === b ? 'active' : ''}">${e(b)}</button>`)
    ].join('');
  };

  const renderPrices = () => {
    document.querySelectorAll('[data-price]').forEach(b =>
      b.classList.toggle('active', b.dataset.price === state.price)
    );
  };

  const filtered = () => {
    let ps = all.filter(p => matchesAudience(p, state.audience));

    if(state.category !== 'all') ps = ps.filter(p => p.type === state.category);
    if(state.subcategory !== 'all') ps = ps.filter(p => subcategoryFor(p) === state.subcategory);
    if(state.brand !== 'all') ps = ps.filter(p => p.brand === state.brand);

    if(state.price !== 'all'){
      const [min,max] = state.price.split('-').map(Number);
      ps = ps.filter(p => Number(p.price) >= min && Number(p.price) <= max);
    }

    return ps;
  };

  const syncUrl = () => {
    const q = new URLSearchParams();
    if(state.audience !== 'all') q.set('audience',state.audience);
    if(state.category !== 'all') q.set('type',state.category);
    if(state.subcategory !== 'all') q.set('subcategory',state.subcategory);
    if(state.brand !== 'all') q.set('brand',state.brand);
    if(state.price !== 'all') q.set('price',state.price);
    history.replaceState({},'', `shop.html${q.toString() ? '?' + q.toString() : ''}`);
  };

  const render = () => {
    renderAudience();
    renderCategories();
    renderSubcategories();
    renderBrands();
    renderPrices();

    const ps = filtered();
    grid.innerHTML = ps.map(card).join('') ||
      '<div class="empty-grid"><strong>Nessun prodotto in questa selezione.</strong><span>Prova un’altra categoria o guarda la selezione completa.</span></div>';

    document.querySelector('#shopCount').textContent = String(ps.length).padStart(2,'0') + ' PIECES';
    syncUrl();
  };

  document.querySelector('#shopAudience').addEventListener('click', ev => {
    const b = ev.target.closest('[data-audience]');
    if(!b) return;
    state.audience = b.dataset.audience;
    state.category = 'all';
    state.subcategory = 'all';
    state.brand = 'all';
    render();
  });

  document.querySelector('#shopCategories').addEventListener('click', ev => {
    const b = ev.target.closest('[data-category]');
    if(!b) return;
    state.category = b.dataset.category;
    state.subcategory = 'all';
    state.brand = 'all';
    render();
  });

  document.querySelector('#shopSubcategories').addEventListener('click', ev => {
    const b = ev.target.closest('[data-subcategory]');
    if(!b) return;
    state.subcategory = b.dataset.subcategory;
    render();
  });

  document.querySelector('#shopBrands').addEventListener('click', ev => {
    const b = ev.target.closest('[data-brand]');
    if(!b) return;
    state.brand = b.dataset.brand;
    render();
  });

  document.querySelector('#shopPrices').addEventListener('click', ev => {
    const b = ev.target.closest('[data-price]');
    if(!b) return;
    state.price = b.dataset.price;
    render();
  });

  document.querySelector('#clearFilter').addEventListener('click', () => {
    state = {audience:'all',category:'all',subcategory:'all',brand:'all',price:'all'};
    history.replaceState({},'', 'shop.html');
    render();
  });

  render();
})();
