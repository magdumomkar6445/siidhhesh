/**
 * PolarOps — NCPOR Polar Expedition Operations System
 * Static server for the prototype. No dependencies: run with `node server.js`.
 *
 * The prototype is a single self-contained file at public/index.html.
 * All demo data lives inside that file, so this server only needs to serve it.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8'
};

function safeJoin(base, target) {
  const resolved = path.resolve(base, '.' + path.posix.normalize('/' + target));
  return resolved.startsWith(base) ? resolved : null;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, Object.assign({
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'same-origin'
  }, headers));
  res.end(body);
}

function serveFile(res, filePath) {
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      return send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    const cache = ext === '.html' ? 'no-cache' : 'public, max-age=3600';
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': stat.size,
      'Cache-Control': cache,
      'X-Content-Type-Options': 'nosniff'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, 'Method not allowed', { 'Content-Type': 'text/plain; charset=utf-8', 'Allow': 'GET, HEAD' });
  }

  const pathname = decodeURIComponent(url.parse(req.url).pathname);

  // Simple health endpoint, handy when this is run behind a reverse proxy.
  if (pathname === '/healthz') {
    return send(res, 200, JSON.stringify({ status: 'ok', app: 'polarops', uptime: process.uptime() }), {
      'Content-Type': 'application/json; charset=utf-8'
    });
  }

  const target = pathname === '/' ? '/index.html' : pathname;
  const filePath = safeJoin(PUBLIC_DIR, target);

  if (!filePath) {
    return send(res, 400, 'Bad request', { 'Content-Type': 'text/plain; charset=utf-8' });
  }

  fs.stat(filePath, (err, stat) => {
    // Single-page prototype: unknown paths fall back to index.html.
    if (err || stat.isDirectory()) {
      return serveFile(res, path.join(PUBLIC_DIR, 'index.html'));
    }
    serveFile(res, filePath);
  });
});

server.listen(PORT, HOST, () => {
  console.log('PolarOps prototype running at http://localhost:' + PORT);
  console.log('Serving ' + PUBLIC_DIR);
  console.log('Press Ctrl+C to stop.');
});
