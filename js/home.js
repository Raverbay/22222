/* V44 — SHOP THE LOOK
   Keeps existing home interactions intact and adds the touch gallery.
*/
(function(){
  "use strict";

  function bootShopTheLook(){
    const root = document.querySelector("[data-lookbook]");
    const track = root && root.querySelector(".flip-look-track");
    const slides = root ? Array.from(root.querySelectorAll(".flip-look-slide")) : [];
    const prev = document.querySelector(".flip-look-prev");
    const next = document.querySelector(".flip-look-next");
    const dots = Array.from(document.querySelectorAll("[data-look-dot]"));
    const productBox = document.getElementById("lookProduct");

    if(!root || !track || !slides.length) return;

    let index = 0;
    let startX = 0;
    let deltaX = 0;
    let dragging = false;

    const products = {
      "BARROW-TEE-01": {brand:"BARROW", name:"Logo T-shirt", price:"€ 85", image:"assets/products/BARROW-TEE-01.jpg"},
      "FLI-GCDS-BAND-MAN": {brand:"GCDS", name:"Band Logo Tee", price:"€ 180", image:"assets/products/FLI-GCDS-BAND-MAN.jpg"},
      "NB9060-ERC": {brand:"NEW BALANCE", name:"9060", price:"€ 180", image:"assets/products/NB9060-ERC.jpg"},
      "BARROW-DENIM-01": {brand:"BARROW", name:"Denim", price:"€ 145", image:"assets/products/BARROW-DENIM-01.jpg"},
      "FLI-PINKO-LOVE-BAG": {brand:"PINKO", name:"Love Bag", price:"€ 465", image:"assets/products/FLI-PINKO-LOVE-BAG.jpg"},
      "NB9060-ALP": {brand:"NEW BALANCE", name:"9060", price:"€ 180", image:"assets/products/NB9060-ALP.jpg"},
      "DSQ2-PUFF-KIDS": {brand:"DSQUARED2 KIDS", name:"Puffer Jacket", price:"€ 390", image:"assets/products/DSQ2-PUFF-KIDS.jpg"},
      "DSQ2-JEANS-KIDS": {brand:"DSQUARED2 KIDS", name:"Jeans", price:"€ 190", image:"assets/products/DSQ2-JEANS-KIDS.jpg"},
      "MOSCHINO-TEDDY-TEE": {brand:"MOSCHINO", name:"Teddy Bear T-shirt", price:"€ 150", image:"assets/products/MOSCHINO-TEDDY-TEE.jpg"}
    };

    function setIndex(nextIndex){
      index = (nextIndex + slides.length) % slides.length;
      track.style.transform = "translate3d(" + (-index * 100) + "%,0,0)";
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    }

    function renderProduct(id){
      const p = products[id];
      if(!p || !productBox) return;

      productBox.innerHTML =
        '<article class="flip-look-product-card">' +
          '<img src="' + p.image + '" alt="' + p.brand + ' ' + p.name + '" onerror="this.style.visibility=\'hidden\'">' +
          '<div class="flip-look-product-meta">' +
            '<small>' + p.brand + '</small>' +
            '<strong>' + p.name + '</strong>' +
            '<span>' + p.price + '</span>' +
          '</div>' +
          '<a class="flip-look-product-link" href="product.html?id=' + encodeURIComponent(id) + '">Scopri il pezzo ↗</a>' +
        '</article>';

      productBox.scrollIntoView({behavior:"smooth", block:"nearest"});
    }

    root.addEventListener("click", function(e){
      const hotspot = e.target.closest(".flip-hotspot");
      if(hotspot){
        e.preventDefault();
        renderProduct(hotspot.dataset.productId);
      }
    });

    prev && prev.addEventListener("click", () => setIndex(index - 1));
    next && next.addEventListener("click", () => setIndex(index + 1));
    dots.forEach(dot => dot.addEventListener("click", () => setIndex(Number(dot.dataset.lookDot))));

    root.addEventListener("pointerdown", function(e){
      if(e.target.closest(".flip-hotspot,.flip-look-arrow")) return;
      dragging = true;
      startX = e.clientX;
      deltaX = 0;
      root.classList.add("is-dragging");
      if(root.setPointerCapture) root.setPointerCapture(e.pointerId);
    });

    root.addEventListener("pointermove", function(e){
      if(!dragging) return;
      deltaX = e.clientX - startX;
    });

    root.addEventListener("pointerup", function(){
      if(!dragging) return;
      dragging = false;
      root.classList.remove("is-dragging");
      if(Math.abs(deltaX) > 55) setIndex(index + (deltaX < 0 ? 1 : -1));
    });

    root.addEventListener("pointercancel", function(){
      dragging = false;
      root.classList.remove("is-dragging");
    });

    setIndex(0);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", bootShopTheLook);
  }else{
    bootShopTheLook();
  }
})();
