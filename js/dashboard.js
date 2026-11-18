
const UMBRAL = 5;
cargarProductos().then(d => {
  const cats = {};
  d.forEach(p => cats[p.categoria] = (cats[p.categoria] || 0) + 1);
  const disp = d.filter(p => p.stock > 0), ago = d.length - disp.length;
  const bajo = d.filter(p => p.stock > 0 && p.stock <= UMBRAL), ok = disp.length - bajo.length;
  const valor = d.reduce((a, p) => a + p.precio * p.stock, 0);
  const k = [['📦', 'Total de productos', d.length], ['🗂️', 'Categorías', Object.keys(cats).length], ['💰', 'Valor del inventario', bs(valor)],
    ['✅', 'Con stock disponible', disp.length], ['🚫', 'Agotados', ago], ['⚠️', 'Con bajo stock (' + UMBRAL + ' o menos)', bajo.length]];
  $('kpis').innerHTML = k.map(([i, t, v]) => `<div class="kpi"><span>${i}</span><strong>${v}</strong><small>${t}</small></div>`).join('');
  const max = Math.max(...Object.values(cats));
  $('g-cat').innerHTML = Object.entries(cats).map(([c, n]) => `<div class="barra"><span>${c}</span><div><i style="width:${n / max * 100}%"></i></div><b>${n}</b></div>`).join('');
  const a = ok / d.length * 100, b = a + bajo.length / d.length * 100;
  $('donut').style.background = `conic-gradient(var(--me) 0 ${a}%, var(--am) ${a}% ${b}%, var(--ro) ${b}% 100%)`;
  $('ley').innerHTML = `<li><i style="background:var(--me)"></i>Stock normal: ${ok}</li><li><i style="background:var(--am)"></i>Bajo stock: ${bajo.length}</li><li><i style="background:var(--ro)"></i>Agotados: ${ago}</li>`;
  $('tabla').innerHTML = d.filter(p => p.stock <= UMBRAL).sort((x, y) => x.stock - y.stock)
    .map(p => `<tr><td>${p.nombre}</td><td>${p.categoria}</td><td>${p.stock}</td><td>${p.stock === 0 ? 'Agotado' : 'Bajo stock'}</td></tr>`).join('');
  $('fecha').textContent = new Date().toLocaleString('es-BO');
}).catch(e => mostrarError($('kpis'), e));
