
const q = $('q'), fcat = $('fcat'), fdisp = $('fdisp'), ford = $('ford');
function pintar() {
  const t = q.value.trim().toLowerCase();
  let l = PROD.filter(p => p.nombre.toLowerCase().includes(t)
    && (!fcat.value || p.categoria === fcat.value)
    && (fdisp.value === 'todos' || (fdisp.value === 'disp' ? p.stock > 0 : p.stock === 0)));
  if (ford.value === 'asc') l.sort((a, b) => a.precio - b.precio);
  if (ford.value === 'desc') l.sort((a, b) => b.precio - a.precio);
  $('lista').innerHTML = l.map(tarjeta).join('') || '<p class="vacio">No encontramos productos con esos filtros. Prueba con otra búsqueda.</p>';
  $('cuenta').textContent = 'Mostrando ' + l.length + ' de ' + PROD.length + ' productos';
}
cargarProductos().then(d => {
  PROD = d;
  [...new Set(d.map(p => p.categoria))].forEach(c => fcat.add(new Option(c, c)));
  const inicial = new URLSearchParams(location.search).get('cat');
  if (inicial) fcat.value = inicial;
  pintar();
}).catch(e => mostrarError($('lista'), e));
[q, fcat, fdisp, ford].forEach(el => el.addEventListener('input', pintar));
