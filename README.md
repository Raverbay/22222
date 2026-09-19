# Flip&Co — Demo Commerce

Clean demo repository for the Flip&Co fashion e-commerce experience.

## Structure

- `index.html` — editorial homepage
- `shop.html` — Online Edit
- `collections.html` / `collection.html` — collections
- `brand.html` — brand index
- `product.html` — product detail
- `checkout.html` — demo order request
- `order-confirmation.html` — confirmation
- `faq.html`, `shipping.html`, `returns.html`, `privacy.html`, `terms.html`, `cookies.html`
- `js/` — canonical runtime modules
- `data/products.json` — catalog source
- `data/collections.json` — collection source
- `data/brands.json` — brand source
- `data/site.json` — store metadata
- `assets/` — local brand/product/store assets
- `admin/` — local demo import utility

## Runtime

The site is static and deployable on GitHub Pages or Netlify. Product data is loaded from `data/products.json`. No framework or build step is required.

## Demo behavior

Checkout is an order-request flow, not a live payment gateway. Product and editorial images may include external demo assets until replaced with the client's final photography.

## Deployment

Upload the contents of this repository root to the `Raverbay/22222` repository and hard-refresh the browser after deployment.

## QA

- JavaScript syntax checked with `node --check`
- JSON validated
- Local HTML references checked
- Duplicate legacy runtime files removed
- Header/menu layer order consolidated
- Circular mobile menu styling removed
- Cache versions aligned to V52.6
