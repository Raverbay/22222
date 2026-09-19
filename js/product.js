(async()=>{
 const ps=await FLIPCO.load(),id=FLIPCO.param('id'),p=ps.find(x=>x.id===id),e=FLIPCO.esc;
 if(!p){const root=document.querySelector('#pdp'); if(root) root.innerHTML='<section class="pdp-not-found wrap"><span>404 / PRODUCT</span><h1>Prodotto<br><i>non trovato.</i></h1><p>La selezione che cerchi non è disponibile in questo momento.</p><a class="pdp-v29-cta" href="shop.html">TORNA ALLO SHOP ↗</a></section>'; return;}
 document.title=`${p.brand} ${p.name} — Flip&Co`;
 const art=p.art?`assets/products/${e(p.art)}`:'';
 const main=p.image||art;
 const gallery=(Array.isArray(p.gallery)&&p.gallery.length?p.gallery:[main,art].filter(Boolean)).slice(0,4);
 const wa=`https://wa.me/393661087819?text=${encodeURIComponent(`Ciao Flip&Co, vorrei informazioni su ${p.brand} ${p.name}.`)}`;
 const sizes=Object.entries(p.stock||{});
 const related=ps.filter(x=>x.id!==p.id&&(x.brand===p.brand||x.category===p.category)&&(FLIPCO.stock(x)>0||x.available)).slice(0,4);
 document.querySelector('#pdp').innerHTML=`
 <section class="pdp-v29 pdp-v50">
  <div class="pdp-v29-gallery">
   <span class="pdp-v29-index">PRODUCT / ${e(p.id)}</span>
   <div class="pdp-v29-main"><img id="pdpMainImage" src="${e(gallery[0])}" alt="${e(p.brand)} ${e(p.name)}" onerror="this.onerror=null;this.src='${art}'"></div>
   <div class="pdp-v29-side">
    ${gallery.map((g,i)=>`<button class="pdp-gallery-thumb${i===0?' is-active':''}" type="button" data-gallery-src="${e(g)}" aria-label="Immagine ${i+1}"><img src="${e(g)}" alt="${e(p.name)} vista ${i+1}" onerror="this.style.display='none'"><span>${String(i+1).padStart(2,'0')} / ${i===0?'HERO':'DETAIL'}</span></button>`).join('')}
   </div>
  </div>
  <div class="pdp-v29-info">
   <span class="pdp-v29-kicker">${e(p.badge||'SELECTED')} · ${e(p.season||'FW26')}</span>
   <span class="pdp-v29-brand">${e(p.brand)} / ${e(p.category)}</span>
   <h1>${e(p.name)}</h1>
   <div class="pdp-v29-price">${p.compareAt&&Number(p.compareAt)>Number(p.price)?`<del>${FLIPCO.money(p.compareAt)}</del>`:''}${FLIPCO.money(p.price)}</div>
   <p class="pdp-v29-desc">${e(p.description||'Un pezzo selezionato da Flip&Co per l’Online Edit.')}</p>
   ${sizes.length?`<div class="pdp-v29-size-head"><span>SELECT SIZE</span><a href="faq.html">SIZE GUIDE ↗</a></div><div class="pdp-v29-sizes">${sizes.map(([s,n])=>`<button class="p29-size" data-size="${e(s)}" ${Number(n)<=0?'disabled':''}>${e(s)}</button>`).join('')}</div><button id="p29Add" class="pdp-v29-cta" disabled>ADD TO BAG <span>↗</span></button>`:`<div class="pdp-v29-size-head"><span>AVAILABILITY</span><span>CHECK WITH STORE</span></div><a class="pdp-v29-cta" href="${wa}" target="_blank" rel="noopener">CHECK AVAILABILITY ↗</a>`}
   <div class="pdp-v29-help"><b>NOT SURE?</b><span>Taglia, fit, abbinamento: scrivici e ti risponde il team Flip&Co.</span><a href="${wa}" target="_blank" rel="noopener">TALK TO US ON WHATSAPP ↗</a></div>
   <div class="pdp-v29-details"><details open><summary>DETAILS</summary><p>${e(p.material||'Composizione non specificata.')}<br>Fit: ${e(p.fit||'Non specificato.')}<br>Colore: ${e(p.color||'—')}</p></details><details><summary>THE ONLINE EDIT</summary><p>L’Online Edit è una selezione. In store trovi più pezzi, più taglie e altre proposte non pubblicate online.</p></details><details><summary>DELIVERY & RETURNS</summary><p>Spedizione e resi seguono le condizioni Flip&Co. Per assistenza su taglia o disponibilità puoi scriverci direttamente su WhatsApp.</p></details></div>
  </div>
 </section>
 <section class="pdp-v50-related wrap"><div class="pdp-v50-related-head"><span>COMPLETE THE LOOK</span><a href="shop.html?category=${encodeURIComponent(p.category)}">VIEW ${e(p.category)} ↗</a></div><div class="pdp-v50-related-grid">${related.map((x,i)=>`<a href="product.html?id=${encodeURIComponent(x.id)}"><div><img src="${e(x.image||`assets/products/${x.art||''}`)}" alt="${e(x.brand)} ${e(x.name)}" loading="lazy"></div><small>${e(x.brand)}</small><b>${e(x.name)}</b></a>`).join('')}</div></section>`;
 document.querySelectorAll('.pdp-gallery-thumb').forEach(btn=>btn.addEventListener('click',()=>{
   const mainImg=document.getElementById('pdpMainImage'); if(!mainImg)return;
   mainImg.src=btn.dataset.gallerySrc;
   document.querySelectorAll('.pdp-gallery-thumb').forEach(x=>x.classList.remove('is-active'));
   btn.classList.add('is-active');
 }));
 const sizesBtns=[...document.querySelectorAll('.p29-size')];
 let selected=null;
 sizesBtns.forEach(b=>b.addEventListener('click',()=>{sizesBtns.forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selected=b.dataset.size;const add=document.querySelector('#p29Add');if(add){add.disabled=false;add.onclick=()=>FLIPCO.addToCart(p.id,selected);}}));
 document.querySelector('#pdp')?.classList.add('flip-product-v49');
})();
