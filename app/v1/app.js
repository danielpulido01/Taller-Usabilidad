// UniCursos v1: lógica con defectos de usabilidad intencionales.
var cursos = [
  { codigo: 'IS-101', nombre: 'Programación I', profesor: 'M. Rojas', cupos: 25 },
  { codigo: 'IS-205', nombre: 'Bases de Datos', profesor: 'L. Vargas', cupos: 18 },
  { codigo: 'IS-310', nombre: 'Calidad del Software', profesor: 'A. Solano', cupos: 30 },
  { codigo: 'IS-220', nombre: 'Programación Web', profesor: 'J. Mora', cupos: 20 },
  { codigo: 'IS-330', nombre: 'Interacción Humano-Computador', profesor: 'C. Jiménez', cupos: 15 },
  { codigo: 'MA-102', nombre: 'Estadística', profesor: 'R. Castro', cupos: 35 },
];
var inscritos = [];

function renderCursos(filtro) {
  var t = (filtro || '').toLowerCase();
  var lista = document.getElementById('lista-cursos');
  lista.innerHTML = '';
  cursos
    .filter(function (c) { return c.nombre.toLowerCase().indexOf(t) >= 0 || c.codigo.toLowerCase().indexOf(t) >= 0; })
    .forEach(function (c) {
      var d = document.createElement('div');
      d.className = 'tarjeta';
      d.innerHTML = '<b>' + c.nombre + '</b><div class="info">' + c.codigo + ' - ' + c.profesor + ' - ' + c.cupos +
        '</div><div class="inscribir">Inscribir</div>';
      d.querySelector('.inscribir').onclick = function () { inscribir(c); };
      lista.appendChild(d);
    });
  // Defecto D-09: no se informa cuántos resultados hay ni qué hacer si no hay ninguno.
}

function renderInscritos() {
  var ul = document.getElementById('lista-inscritos');
  ul.innerHTML = '';
  inscritos.forEach(function (c) {
    var li = document.createElement('li');
    li.innerHTML = c.nombre + ' <button class="retirar">x</button>';
    // Defecto D-11: retiro inmediato, sin confirmación ni forma de deshacer.
    li.querySelector('button').onclick = function () {
      inscritos.splice(inscritos.indexOf(c), 1);
      renderInscritos();
    };
    ul.appendChild(li);
  });
}

function inscribir(c) {
  if (inscritos.indexOf(c) < 0) inscritos.push(c);
  renderInscritos();
}

document.getElementById('form-busqueda').onsubmit = function (e) {
  e.preventDefault();
  renderCursos(document.getElementById('buscar').value);
};

document.getElementById('form-registro').onsubmit = function (e) {
  e.preventDefault();
  var f = e.target;
  var msg = document.getElementById('mensaje-registro');
  var ok = f.nombre.value && f.correo.value.indexOf('@') > 0 && f.carrera.value && f.contrasena.value.length >= 8;
  if (!ok) {
    // Defecto D-03/D-04: mensaje genérico lejos del campo y se borran los datos escritos.
    msg.textContent = 'Error';
    f.reset();
    return;
  }
  // Defecto D-05: sin retroalimentación inmediata; la confirmación tarda 3 s.
  msg.textContent = '';
  setTimeout(function () { msg.style.color = 'green'; msg.textContent = 'Cuenta creada'; }, 3000);
};

// Defecto D-13: banner que aparece tarde y desplaza todo el contenido (CLS).
setTimeout(function () {
  var b = document.createElement('div');
  b.className = 'banner';
  b.textContent = '¡Matrícula abierta hasta el viernes!';
  var c = document.querySelector('.contenedor');
  c.insertBefore(b, c.firstChild);
}, 400);

renderCursos('');
