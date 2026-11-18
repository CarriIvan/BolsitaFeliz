# Bolsita Feliz - Tienda virtual multipágina

Proyecto del examen final de Diseño Web (Instituto Técnico Jesús María, Oruro).
Tecnologías: HTML5, CSS3, JavaScript y JSON.

## Cómo abrirlo
`fetch()` no funciona abriendo los archivos con doble clic. Usa un servidor local:
- Visual Studio Code: extensión **Live Server** → clic derecho en `index.html` → *Open with Live Server*.
- O en la carpeta del proyecto: `python -m http.server 8000` y abre http://localhost:8000

## Estructura
- `index.html`, `productos.html`, `nosotros.html`, `contacto.html`, `dashboard.html`, `carrito.html`, `faq.html`
- `data/productos.json`: 15 productos (id, nombre, descripcion, precio, categoria, stock, imagen, destacado)
- `css/estilos.css`: estilos de todo el sitio (Grid, Flexbox, responsive)
- `js/app.js`: funciones compartidas (fetch, cabecera, pie, tarjetas, modal de detalles, carrito, avisos)
- `js/productos.js`: búsqueda, filtro por categoría, orden por precio y disponibilidad
- `js/dashboard.js`: KPI, gráficos y tabla calculados desde el JSON
- `js/contacto.js`: validación del formulario y mensaje de confirmación
- `js/carrito.js`: agregar, quitar y totales con `localStorage`
- `img/`: logo, banner y una imagen por producto (SVG)

## Funcionamiento
1. Cada página carga `app.js`, que dibuja el menú y el pie de página.
2. Las páginas que necesitan datos llaman a `cargarProductos()`, que lee `data/productos.json` con `fetch()`.
3. Con esos datos JavaScript crea las tarjetas, aplica filtros y calcula los indicadores del dashboard.
4. El carrito guarda solo `id` y cantidad en `localStorage`; al abrir el carrito se vuelve a leer el JSON para mostrar nombres y precios.
5. Los gráficos del dashboard están hechos con HTML y CSS (barras y `conic-gradient`).
