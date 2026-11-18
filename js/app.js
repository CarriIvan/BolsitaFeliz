
const $ = id => document.getElementById(id);
const bs = n => 'Bs ' + Number(n).toFixed(2);
let PROD = [];

async function cargarProductos() {
  const r = await fetch('data/productos.json');
  if (!r.ok) throw new Error('No se pudo leer productos.json (' + r.status + ')');
  return r.json();
}
function mostrarError(el, e) {
  el.innerHTML = '<p class="vacio">No se pudieron cargar los productos. Abre el sitio con un servidor local (Live Server o python -m http.server), no con doble clic.<br><small>' + e.message + '</small></p>';
}
const getCarrito = () => { try { return JSON.parse(localStorage.getItem('bf_carrito')) || []; } catch (e) { return []; } };
function setCarrito(c) { try { localStorage.setItem('bf_carrito', JSON.stringify(c)); } catch (e) {} contador(); }
function contador() {
  const e = $('cnt');
  if (e) e.textContent = getCarrito().reduce((a, i) => a + i.cant, 0);
}
function aviso(m) {
  let t = $('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = m; t.classList.add('ver');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('ver'), 2200);
}
function agregar(p) {
  const c = getCarrito(), i = c.find(x => x.id === p.id);
  if (i) { if (i.cant >= p.stock) return aviso('Ya agregaste todo el stock disponible'); i.cant++; }
  else c.push({ id: p.id, cant: 1 });
  setCarrito(c); aviso(p.nombre + ' agregado al carrito');
}
function tarjeta(p) {
  const ago = p.stock === 0, bajo = p.stock <= 5;
  return `<article class="card ${ago ? 'ago' : ''}">
    <span class="tag ${ago ? 'rojo' : bajo ? 'ama' : 'verde'}">${ago ? 'Agotado' : bajo ? 'Quedan ' + p.stock : 'Disponible'}</span>
    <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
    <div class="cb"><small>${p.categoria}</small><h3>${p.nombre}</h3><p>${p.descripcion}</p>
    <div class="pie-c"><strong>${bs(p.precio)}</strong><span>Stock: ${p.stock}</span></div>
    <div class="bts"><button class="btn sec" data-det="${p.id}">Ver detalles</button>
    <button class="btn" data-add="${p.id}" ${ago ? 'disabled' : ''}>Agregar</button></div></div></article>`;
}
function detalle(p) {
  let m = $('modal');
  if (!m) {
    m = document.createElement('div'); m.id = 'modal'; m.className = 'modal';
    m.innerHTML = '<div class="mc" role="dialog" aria-modal="true"><button class="x" aria-label="Cerrar">✕</button><div id="mcont"></div></div>';
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m || e.target.closest('.x')) m.classList.remove('ver'); });
  }
  $('mcont').innerHTML = `<img src="${p.imagen}" alt="${p.nombre}"><h2>${p.nombre}</h2><p>${p.descripcion}</p>
    <p><b>Categoría:</b> ${p.categoria}<br><b>Precio:</b> ${bs(p.precio)}<br><b>Stock:</b> ${p.stock ? p.stock + ' unidades' : 'Agotado'}</p>
    <button class="btn" data-add="${p.id}" ${p.stock ? '' : 'disabled'}>Agregar al carrito</button>`;
  m.classList.add('ver');
}
document.addEventListener('click', e => {
  const a = e.target.closest('[data-add]'), d = e.target.closest('[data-det]');
  if (a) { const p = PROD.find(x => x.id == a.dataset.add); if (p) agregar(p); }
  if (d) { const p = PROD.find(x => x.id == d.dataset.det); if (p) detalle(p); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('modal')) $('modal').classList.remove('ver'); });

/* Cabecera y pie compartidos */
const PAGS = [['index.html', 'Inicio'], ['productos.html', 'Productos'], ['nosotros.html', 'Nosotros'], ['contacto.html', 'Contacto'], ['dashboard.html', 'Dashboard'], ['faq.html', 'FAQ']];
const actual = location.pathname.split('/').pop() || 'index.html';
$('cab').innerHTML = `<header class="cab"><a class="marca" href="index.html"><img src="img/logo.svg" alt="Logo de Bolsita Feliz"><span>Bolsita Feliz</span></a>
  <button id="burger" aria-label="Abrir menú" aria-expanded="false">☰</button>
  <nav id="nav" aria-label="Principal">${PAGS.map(([h, t]) => `<a href="${h}" class="${h === actual ? 'act' : ''}">${t}</a>`).join('')}
  <a class="carro ${actual === 'carrito.html' ? 'act' : ''}" href="carrito.html">Carrito <b id="cnt">0</b></a></nav></header>`;
$('burger').addEventListener('click', e => { const o = $('nav').classList.toggle('abierto'); e.currentTarget.setAttribute('aria-expanded', o); });
$('pie').innerHTML = `<footer class="pie"><div class="wrap">
  <div><h3>Bolsita Feliz</h3><p>Bolsas de nylon para compras, regalos, basura, alimentos y envíos.</p></div>
  <div><h3>Visítanos</h3><p>Oruro, Bolivia</p><p>WhatsApp: 7000 0000</p><p>hola@bolsitafeliz.bo</p></div>
  <div><h3>Enlaces</h3><p><a href="productos.html">Catálogo</a></p><p><a href="carrito.html">Mi carrito</a></p><p><a href="faq.html">Preguntas frecuentes</a></p></div>
  <div><p>Proyecto académico del Instituto Técnico Jesús María.</p><p>© 2026 Bolsita Feliz</p></div></div></footer>`;
contador();

/* Página de inicio */
if ($('destacados')) {
  const ic = { Compras: '🛍️', Regalos: '🎁', Basura: '🗑️', Alimentos: '🥪', 'Envíos': '📦' };
  cargarProductos().then(d => {
    PROD = d;
    $('destacados').innerHTML = d.filter(p => p.destacado).map(tarjeta).join('');
    const cs = [...new Set(d.map(p => p.categoria))];
    $('categorias').innerHTML = cs.map(c => `<a class="catb" href="productos.html?cat=${encodeURIComponent(c)}"><span>${ic[c] || '👜'}</span><b>${c}</b><small>${d.filter(p => p.categoria === c).length} productos</small></a>`).join('');
  }).catch(e => mostrarError($('destacados'), e));
}
