/* FLIP&CO — canonical data layer */
window.FLIPCO = window.FLIPCO || {};

const FLIPCO = window.FLIPCO;

FLIPCO._cache = null;

FLIPCO.load = async () => {
  if (FLIPCO._cache) return FLIPCO._cache;
  try {
    const response = await fetch('data/products.json?v=52.6', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Products HTTP ${response.status}`);
    const data = await response.json();
    FLIPCO._cache = data.products || [];
    return FLIPCO._cache;
  } catch (error) {
    console.warn('Flip&Co: catalog unavailable.', error);
    FLIPCO._cache = [];
    return FLIPCO._cache;
  }
};

FLIPCO.money = value =>
  new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(Number(value) || 0);

FLIPCO.stock = product =>
  Object.values(product?.stock || {}).reduce((sum, value) => sum + Number(value || 0), 0);

FLIPCO.usable = product => FLIPCO.stock(product) > 0 || product?.available === true;

FLIPCO.esc = value =>
  String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

FLIPCO.param = key => new URLSearchParams(window.location.search).get(key) || '';
