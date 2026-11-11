// Servidor estático mínimo (sin dependencias) para publicar la versión de la app bajo prueba.
// Uso: APP_VERSION=v1|v2 node servidor.js   (por defecto v2, puerto 4173)
const http = require('http');
const fs = require('fs');
const path = require('path');

const version = process.env.APP_VERSION === 'v1' ? 'v1' : 'v2';
const puerto = Number(process.env.PORT || 4173);
const raiz = path.join(__dirname, 'app', version);

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

http
  .createServer((req, res) => {
    const ruta = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const archivo = path.normalize(path.join(raiz, ruta === '/' ? 'index.html' : ruta));
    if (!archivo.startsWith(raiz)) {
      res.writeHead(403).end('Prohibido');
      return;
    }
    fs.readFile(archivo, (err, datos) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('No encontrado');
        return;
      }
      res.writeHead(200, { 'Content-Type': tipos[path.extname(archivo)] || 'application/octet-stream' });
      res.end(datos);
    });
  })
  .listen(puerto, () => console.log(`UniCursos ${version} en http://localhost:${puerto}`));
