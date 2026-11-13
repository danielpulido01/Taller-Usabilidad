// Calcula el System Usability Scale (SUS, Brooke 1996) a partir de un CSV.
// Formato: participante,version,p1,p2,...,p10   (respuestas de 1 = Muy en desacuerdo a 5 = Muy de acuerdo)
// Uso: node scripts/sus.js estudio/resultados-sus.csv
//
// Puntaje por participante: ítems impares aportan (r - 1), ítems pares aportan (5 - r); la suma × 2.5 da 0–100.
// Interpretación (Bangor, Kortum y Miller, 2009; Sauro, 2011): 68 = promedio de la industria.
const fs = require('fs');

const archivo = process.argv[2];
if (!archivo) {
  console.error('Uso: node scripts/sus.js <archivo.csv>');
  process.exit(1);
}

const [encabezado, ...lineas] = fs.readFileSync(archivo, 'utf8').trim().split(/\r?\n/);
const columnas = encabezado.split(',').map((c) => c.trim().toLowerCase());
const indice = (nombre) => columnas.indexOf(nombre);
const items = Array.from({ length: 10 }, (_, i) => indice(`p${i + 1}`));
if (indice('version') < 0 || items.some((i) => i < 0)) {
  console.error('El CSV debe tener las columnas: participante,version,p1..p10');
  process.exit(1);
}

function puntajeSUS(respuestas) {
  const suma = respuestas.reduce((acc, r, i) => acc + (i % 2 === 0 ? r - 1 : 5 - r), 0);
  return suma * 2.5;
}

function calificacion(p) {
  if (p >= 80.3) return 'A (excelente)';
  if (p >= 68) return 'B-C (sobre el promedio)';
  if (p >= 51) return 'D (bajo el promedio)';
  return 'F (inaceptable)';
}

const porVersion = {};
for (const [n, linea] of lineas.entries()) {
  if (!linea.trim()) continue;
  const celdas = linea.split(',').map((c) => c.trim());
  const respuestas = items.map((i) => Number(celdas[i]));
  if (respuestas.some((r) => !Number.isInteger(r) || r < 1 || r > 5)) {
    console.warn(`Fila ${n + 2} ignorada: respuestas fuera del rango 1–5`);
    continue;
  }
  const version = celdas[indice('version')];
  (porVersion[version] ||= []).push(puntajeSUS(respuestas));
}

console.log('| Versión | n | SUS promedio | Mín | Máx | Calificación |');
console.log('| --- | --- | --- | --- | --- | --- |');
for (const [version, puntajes] of Object.entries(porVersion).sort()) {
  const prom = puntajes.reduce((a, b) => a + b, 0) / puntajes.length;
  console.log(
    `| ${version} | ${puntajes.length} | ${prom.toFixed(1)} | ${Math.min(...puntajes)} | ${Math.max(...puntajes)} | ${calificacion(prom)} |`
  );
}
