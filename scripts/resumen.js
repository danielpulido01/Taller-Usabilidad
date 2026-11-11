// Genera una matriz de resultados (Markdown) a partir de los reportes JSON de Playwright.
// Uso: npm run test:v1 ; npm run test:v2 ; npm run resumen
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'reportes');
const versiones = ['v1', 'v2'];
const proyectos = ['escritorio', 'movil'];
const simbolo = { expected: 'PASA', unexpected: 'FALLA', skipped: 'N/A', flaky: 'INESTABLE' };

const filas = new Map(); // id -> { titulo, archivo, resultados: { 'v1/escritorio': 'PASA' } }

function recorrer(suite, archivo, version) {
  for (const spec of suite.specs || []) {
    const id = (spec.title.match(/^U-\d+/) || [spec.title])[0];
    const fila = filas.get(id) || { titulo: spec.title.replace(/^U-\d+\s*/, ''), archivo, resultados: {} };
    for (const t of spec.tests) fila.resultados[`${version}/${t.projectName}`] = simbolo[t.status] || t.status;
    filas.set(id, fila);
  }
  for (const hija of suite.suites || []) recorrer(hija, archivo || hija.file, version);
}

const totales = {};
for (const v of versiones) {
  const archivo = path.join(dir, `resultados-${v}.json`);
  if (!fs.existsSync(archivo)) {
    console.warn(`No existe ${archivo}; ejecute primero "npm run test:${v}".`);
    continue;
  }
  const reporte = JSON.parse(fs.readFileSync(archivo, 'utf8'));
  for (const s of reporte.suites) recorrer(s, s.file, v);
  totales[v] = reporte.stats;
}

const columnas = versiones.flatMap((v) => proyectos.map((p) => `${v}/${p}`));
const lineas = [
  '# Matriz de resultados de usabilidad',
  '',
  `| ID | Criterio | ${columnas.join(' | ')} |`,
  `| --- | --- | ${columnas.map(() => '---').join(' | ')} |`,
];
for (const [id, f] of [...filas].sort()) {
  lineas.push(`| ${id} | ${f.titulo} | ${columnas.map((c) => f.resultados[c] || '-').join(' | ')} |`);
}
lineas.push('');
for (const v of Object.keys(totales)) {
  const s = totales[v];
  lineas.push(`- **${v}**: ${s.expected} pasan, ${s.unexpected} fallan, ${s.skipped} no aplican (${Math.round(s.duration / 1000)} s)`);
}

const salida = lineas.join('\n');
fs.writeFileSync(path.join(dir, 'resumen.md'), salida + '\n');
console.log(salida);
