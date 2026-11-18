
let D = [];
function pintar() {
  const c = getCarrito().filter(i => D.some(p => p.id === i.id));
  if (!c.length) {
    $('items').innerHTML = '<p class="vacio">Tu carrito está vacío. <a href="productos.html">Elige tus bolsitas</a></p>';
    $('resumen').hidden = true; return;
  }
  $('resumen').hidden = false;
  let total = 0;
  $('items').innerHTML = c.map(i => {
    const p = D.find(x => x.id === i.id), s = p.precio * i.cant; total += s;
    return `<div class="fila"><img src="${p.imagen}" alt="${p.nombre}"><div><h3>${p.nombre}</h3><small>${bs(p.precio)} c/u</small></div>
      <div class="cant"><button data-m="${p.id}" aria-label="Quitar una unidad">−</button><b>${i.cant}</b><button data-p="${p.id}" aria-label="Agregar una unidad">+</button></div>
      <strong>${bs(s)}</strong><button class="x2" data-q="${p.id}" aria-label="Eliminar ${p.nombre}">✕</button></div>`;
  }).join('');
  $('total').textContent = bs(total);
}
function cambiar(id, fn) {
  let c = getCarrito();
  const i = c.find(x => x.id === id), p = D.find(x => x.id === id);
  if (!i) return;
  fn(i, p);
  c = c.filter(x => x.cant > 0);
  setCarrito(c); pintar();
}
$('items').addEventListener('click', e => {
  const m = e.target.closest('[data-m]'), a = e.target.closest('[data-p]'), q = e.target.closest('[data-q]');
  if (m) cambiar(Number(m.dataset.m), i => i.cant--);
  if (a) cambiar(Number(a.dataset.p), (i, p) => { if (i.cant < p.stock) i.cant++; else aviso('No hay más stock de este producto'); });
  if (q) cambiar(Number(q.dataset.q), i => i.cant = 0);
});
$('vaciar').addEventListener('click', () => { setCarrito([]); pintar(); });
$('comprar').addEventListener('click', () => { setCarrito([]); pintar(); aviso('¡Pedido simulado enviado! Gracias por tu compra.'); });
cargarProductos().then(d => { D = d; PROD = d; pintar(); }).catch(e => mostrarError($('items'), e));
