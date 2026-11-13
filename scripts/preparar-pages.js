// Prepara la carpeta _site/ para publicar v1 y v2 en GitHub Pages (URL pública que Maze puede abrir).
// Si la variable de entorno MAZE_SNIPPET existe, inserta el snippet de Maze justo después de <head>
// en cada página (requisito de Maze para obtener mapas de calor, clics y rutas).
// Uso local:  node scripts/preparar-pages.js   →  _site/index.html, _site/v1/, _site/v2/
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const salida = path.join(raiz, '_site');
const snippet = (process.env.MAZE_SNIPPET || '').trim();

fs.rmSync(salida, { recursive: true, force: true });

for (const version of ['v1', 'v2']) {
  const origen = path.join(raiz, 'app', version);
  const destino = path.join(salida, version);
  fs.cpSync(origen, destino, { recursive: true });

  if (snippet) {
    for (const archivo of fs.readdirSync(destino).filter((f) => f.endsWith('.html'))) {
      const ruta = path.join(destino, archivo);
      const html = fs.readFileSync(ruta, 'utf8');
      if (!html.includes('<head>')) throw new Error(`No se encontró <head> en ${version}/${archivo}`);
      fs.writeFileSync(ruta, html.replace('<head>', `<head>\n${snippet}\n`));
    }
  }
}

fs.writeFileSync(
  path.join(salida, 'index.html'),
  `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>UniCursos · Taller de usabilidad</title>
  <style>
    body { font-family: system-ui, sans-serif; font-size: 16px; line-height: 1.5; max-width: 640px; margin: 40px auto; padding: 0 16px; color: #1f2937; }
    a { color: #1d4ed8; }
  </style>
</head>
<body>
  <h1>UniCursos · Taller de usabilidad</h1>
  <p>Aplicación de ejemplo del taller de Aseguramiento de la Calidad del Software.</p>
  <ul>
    <li><a href="v1/">Versión 1</a></li>
    <li><a href="v2/">Versión 2</a></li>
  </ul>
</body>
</html>
`
);

console.log(`Sitio generado en ${salida} ${snippet ? '(con snippet de Maze)' : '(sin snippet de Maze)'}`);
