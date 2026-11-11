// UniCursos v2: lógica de la versión corregida.
const cursos = [
  { codigo: 'IS-101', nombre: 'Programación I', profesor: 'M. Rojas', cupos: 25 },
  { codigo: 'IS-205', nombre: 'Bases de Datos', profesor: 'L. Vargas', cupos: 18 },
  { codigo: 'IS-310', nombre: 'Calidad del Software', profesor: 'A. Solano', cupos: 30 },
  { codigo: 'IS-220', nombre: 'Programación Web', profesor: 'J. Mora', cupos: 20 },
  { codigo: 'IS-330', nombre: 'Interacción Humano-Computador', profesor: 'C. Jiménez', cupos: 15 },
  { codigo: 'MA-102', nombre: 'Estadística', profesor: 'R. Castro', cupos: 35 },
];
const inscritos = [];

const $ = (sel) => document.querySelector(sel);
const listaCursos = $('#lista-cursos');
const listaInscritos = $('#lista-inscritos');

function renderCursos(filtro = '') {
  const termino = filtro.trim().toLowerCase();
  const visibles = cursos.filter(
    (c) => c.nombre.toLowerCase().includes(termino) || c.codigo.toLowerCase().includes(termino)
  );
  listaCursos.innerHTML = '';
  for (const c of visibles) {
    const yaInscrito = inscritos.includes(c.codigo);
    const li = document.createElement('li');
    li.className = 'tarjeta';
    li.dataset.curso = c.codigo;
    li.innerHTML = `
      <h3>${c.nombre}</h3>
      <p>${c.codigo} · Prof. ${c.profesor} · ${c.cupos} cupos</p>
      <button type="button" class="boton inscribir" ${yaInscrito ? 'disabled' : ''}>
        ${yaInscrito ? 'Inscrito' : 'Inscribir'} <span class="sr-only">${c.nombre}</span>
      </button>`;
    li.querySelector('button').addEventListener('click', () => inscribir(c));
    listaCursos.appendChild(li);
  }
  return visibles.length;
}

function renderInscritos() {
  listaInscritos.innerHTML = '';
  $('#sin-inscritos').hidden = inscritos.length > 0;
  for (const codigo of inscritos) {
    const c = cursos.find((x) => x.codigo === codigo);
    const li = document.createElement('li');
    li.innerHTML = `<span>${c.nombre} (${c.codigo})</span>
      <button type="button" class="boton secundario retirar">Retirar <span class="sr-only">${c.nombre}</span></button>`;
    li.querySelector('button').addEventListener('click', () => retirar(c));
    listaInscritos.appendChild(li);
  }
}

function avisar(selector, texto) {
  const el = $(selector);
  el.textContent = texto;
  el.classList.add('exito');
}

function inscribir(c) {
  if (inscritos.includes(c.codigo)) return;
  inscritos.push(c.codigo);
  renderInscritos();
  renderCursos($('#buscar').value);
  avisar('#estado-inscripcion', `Se inscribió en ${c.nombre}.`);
}

function retirar(c) {
  // Prevención de errores: acción destructiva con confirmación y opción de cancelar.
  if (!window.confirm(`¿Desea retirar el curso ${c.nombre}? Podrá inscribirlo de nuevo si hay cupo.`)) {
    avisar('#estado-inscripcion', `Se canceló el retiro de ${c.nombre}.`);
    return;
  }
  inscritos.splice(inscritos.indexOf(c.codigo), 1);
  renderInscritos();
  renderCursos($('#buscar').value);
  avisar('#estado-inscripcion', `Se retiró ${c.nombre}.`);
}

$('#form-busqueda').addEventListener('submit', (e) => {
  e.preventDefault();
  const termino = $('#buscar').value;
  const n = renderCursos(termino);
  $('#estado-busqueda').textContent =
    n === 0
      ? `No se encontraron cursos para “${termino}”. Revise la ortografía o busque por código (ej. IS-101).`
      : `${n} ${n === 1 ? 'curso encontrado' : 'cursos encontrados'}${termino ? ` para “${termino}”` : ''}.`;
});

// ---- Registro con validación accesible ----
const reglas = {
  nombre: (v) => (v.trim().length >= 3 ? '' : 'Escriba su nombre completo (mínimo 3 letras).'),
  correo: (v) =>
    !v.trim()
      ? 'El correo electrónico es obligatorio.'
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? ''
        : 'El formato del correo no es válido. Ejemplo: ana.perez@correo.com',
  carrera: (v) => (v ? '' : 'Seleccione una carrera de la lista.'),
  contrasena: (v) => (v.length >= 8 ? '' : 'La contraseña debe tener al menos 8 caracteres.'),
};

function validarCampo(nombre) {
  const campo = document.getElementById(nombre);
  const error = document.getElementById(`error-${nombre}`);
  const mensaje = reglas[nombre](campo.value);
  error.textContent = mensaje;
  error.hidden = !mensaje;
  campo.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
  return !mensaje;
}

for (const nombre of Object.keys(reglas)) {
  document.getElementById(nombre).addEventListener('blur', (e) => {
    if (e.target.getAttribute('aria-invalid') === 'true') validarCampo(nombre);
  });
}

$('#mostrar-contrasena').addEventListener('click', (e) => {
  const campo = $('#contrasena');
  const mostrar = campo.type === 'password';
  campo.type = mostrar ? 'text' : 'password';
  e.currentTarget.setAttribute('aria-pressed', String(mostrar));
  e.currentTarget.textContent = mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña';
});

$('#form-registro').addEventListener('submit', (e) => {
  e.preventDefault();
  const invalidos = Object.keys(reglas).filter((n) => !validarCampo(n));
  const mensaje = $('#mensaje-registro');
  if (invalidos.length) {
    mensaje.classList.remove('exito');
    mensaje.textContent = `Revise ${invalidos.length} ${invalidos.length === 1 ? 'campo' : 'campos'} marcados en rojo.`;
    document.getElementById(invalidos[0]).focus();
    return;
  }
  avisar('#mensaje-registro', `Cuenta creada correctamente. Bienvenido(a), ${$('#nombre').value.trim()}.`);
  e.target.reset();
});

renderCursos();
renderInscritos();
