
const f = $('form');
const reglas = {
  nombre: v => /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,}$/.test(v.trim()) || 'Escribe tu nombre completo (solo letras, mínimo 3).',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Escribe un correo válido, por ejemplo nombre@correo.com.',
  celular: v => /^[67]\d{7}$/.test(v.trim()) || 'Escribe 8 dígitos que empiecen con 6 o 7.',
  asunto: v => v.trim().length >= 4 || 'El asunto debe tener al menos 4 caracteres.',
  mensaje: v => v.trim().length >= 10 || 'El mensaje debe tener al menos 10 caracteres.'
};
function validar(id) {
  const r = reglas[id]($(id).value), ok = r === true;
  $(id).classList.toggle('mal', !ok);
  $('e-' + id).textContent = ok ? '' : r;
  return ok;
}
Object.keys(reglas).forEach(id => $(id).addEventListener('blur', () => validar(id)));
f.addEventListener('submit', e => {
  e.preventDefault();
  const ok = Object.keys(reglas).map(id => validar(id)).every(Boolean);
  if (!ok) { f.querySelector('.mal').focus(); return; }
  const n = $('nombre').value.trim().split(' ')[0];
  f.reset();
  $('ok').textContent = '¡Gracias, ' + n + '! Recibimos tu mensaje y te responderemos pronto.';
  $('ok').hidden = false;
});
