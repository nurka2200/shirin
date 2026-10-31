import { createServer } from 'node:http';
import { randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const scryptAsync = promisify(scrypt);
const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dataDir = resolve(process.env.AUTH_DATA_DIR || join(rootDir, 'server', 'data'));
const usersFile = join(dataDir, 'users.json');
const distDir = join(rootDir, 'dist');
const sessionCookie = 'nomad_session';
const sessionMaxAge = 8 * 60 * 60;
const sessions = new Map();
const limits = new Map();
const registeringEmails = new Set();
const isProduction = process.env.NODE_ENV === 'production' || process.env.npm_lifecycle_event === 'start';
const port = Number(process.env.PORT || 3001);

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function createPasswordRecord(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scryptAsync(password, salt, 64);
  return { salt, hash: hash.toString('hex') };
}

async function verifyPassword(password, record) {
  const candidate = await scryptAsync(password, record.salt, 64);
  const expected = Buffer.from(record.hash, 'hex');
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function loadUsers() {
  mkdirSync(dataDir, { recursive: true });
  if (!existsSync(usersFile)) return [];
  const users = JSON.parse(readFileSync(usersFile, 'utf8'));
  if (!Array.isArray(users)) throw new Error('User store must contain a JSON array.');
  return users;
}

function saveUsers(users) {
  const temporaryFile = `${usersFile}.${randomUUID()}.tmp`;
  writeFileSync(temporaryFile, JSON.stringify(users, null, 2), { mode: 0o600 });
  renameSync(temporaryFile, usersFile);
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function sendJson(response, status, payload, headers = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'same-origin',
    ...headers,
  });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request) {
  return new Promise((resolveBody, reject) => {
    let body = '';
    request.setEncoding('utf8');
    let tooLarge = false;
    request.on('data', chunk => {
      if (tooLarge) return;
      body += chunk;
      if (body.length > 16_384) {
        tooLarge = true;
        reject(new HttpError(413, 'Слишком большой запрос.'));
      }
    });
    request.on('end', () => {
      try {
        resolveBody(JSON.parse(body || '{}'));
      } catch {
        reject(new HttpError(400, 'Некорректный JSON.'));
      }
    });
    request.on('error', reject);
  });
}

function checkRateLimit(request, key, maxAttempts, intervalMs) {
  const now = Date.now();
  if (limits.size > 1000) {
    for (const [keyToClean, entryToClean] of limits) {
      if (entryToClean.resetAt <= now) limits.delete(keyToClean);
    }
  }
  const address = request.socket.remoteAddress || 'unknown';
  const limitKey = `${key}:${address}`;
  const entry = limits.get(limitKey);
  if (!entry || entry.resetAt <= now) {
    limits.set(limitKey, { count: 1, resetAt: now + intervalMs });
    return;
  }
  if (entry.count >= maxAttempts) {
    throw new HttpError(429, 'Слишком много попыток. Попробуйте позже.');
  }
  entry.count += 1;
}

function readSession(request) {
  const cookies = request.headers.cookie || '';
  const token = cookies.split(';').map(part => part.trim()).find(part => part.startsWith(`${sessionCookie}=`))?.slice(sessionCookie.length + 1);
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session.user;
}

function sessionCookieHeader(token) {
  const secure = isProduction ? '; Secure' : '';
  return `${sessionCookie}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${sessionMaxAge}${secure}`;
}

function clearSessionCookie() {
  const secure = isProduction ? '; Secure' : '';
  return `${sessionCookie}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`;
}

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function serveApp(response, pathname) {
  if (!existsSync(join(distDir, 'index.html'))) {
    sendJson(response, 404, { error: 'Приложение не собрано. Выполните npm run build.' });
    return;
  }
  let requestedPath;
  try {
    requestedPath = decodeURIComponent(pathname);
  } catch {
    sendJson(response, 400, { error: 'Некорректный URL.' });
    return;
  }
  const candidate = resolve(distDir, `.${requestedPath}`);
  if (candidate !== distDir && !candidate.startsWith(`${distDir}${sep}`)) {
    sendJson(response, 400, { error: 'Некорректный путь.' });
    return;
  }
  const file = existsSync(candidate) && statSync(candidate).isFile() ? candidate : join(distDir, 'index.html');
  response.writeHead(200, {
    'Content-Type': mimeTypes[extname(file)] || 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'same-origin',
  });
  response.end(readFileSync(file));
}

async function createApplicationServer() {
  const users = loadUsers();
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL);
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (Boolean(adminEmail) !== Boolean(adminPassword)) {
    throw new Error('Set both ADMIN_EMAIL and ADMIN_PASSWORD to configure the administrator.');
  }
  if (adminEmail && (!validateEmail(adminEmail) || adminPassword.length < 12 || adminPassword.length > 128)) {
    throw new Error('ADMIN_EMAIL must be valid and ADMIN_PASSWORD must contain 12 to 128 characters.');
  }
  if (adminEmail && users.some(user => user.email === adminEmail)) {
    throw new Error('The configured administrator email already exists as a regular account. Use a different ADMIN_EMAIL.');
  }
  const admin = adminEmail ? {
    id: 'admin',
    name: 'Администратор',
    email: adminEmail,
    role: 'Admin',
    password: await createPasswordRecord(adminPassword),
  } : null;
  const dummyPasswordRecord = await createPasswordRecord(randomBytes(24).toString('hex'));

  const server = createServer((request, response) => {
    const url = new URL(request.url || '/', 'http://localhost');
    if (!url.pathname.startsWith('/api/')) {
      if (isProduction && request.method === 'GET') {
        serveApp(response, url.pathname);
      } else {
        sendJson(response, 404, { error: 'Маршрут не найден.' });
      }
      return;
    }

    Promise.resolve().then(async () => {
      if (request.method === 'GET' && url.pathname === '/api/auth/me') {
        const user = readSession(request);
        if (!user) {
          sendJson(response, 401, { error: 'Войдите в аккаунт.' });
          return;
        }
        sendJson(response, 200, { user: publicUser(user) });
        return;
      }

      if (request.method === 'POST' && url.pathname === '/api/auth/register') {
        checkRateLimit(request, 'register', 5, 60 * 60 * 1000);
        const body = await readRequestBody(request);
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const email = normalizeEmail(body.email);
        const password = typeof body.password === 'string' ? body.password : '';
        if (name.length < 2 || name.length > 80 || !validateEmail(email) || password.length < 10 || password.length > 128) {
          throw new HttpError(400, 'Укажите имя, корректный email и пароль длиной от 10 до 128 символов.');
        }
        if (users.some(user => user.email === email) || admin?.email === email || registeringEmails.has(email)) {
          throw new HttpError(409, 'Этот email уже зарегистрирован.');
        }
        registeringEmails.add(email);
        let user;
        try {
          user = {
            id: randomUUID(),
            name,
            email,
            role: 'User',
            password: await createPasswordRecord(password),
          };
          saveUsers([...users, user]);
          users.push(user);
        } finally {
          registeringEmails.delete(email);
        }
        const token = randomBytes(32).toString('hex');
        sessions.set(token, { user, expiresAt: Date.now() + sessionMaxAge * 1000 });
        sendJson(response, 201, { user: publicUser(user) }, { 'Set-Cookie': sessionCookieHeader(token) });
        return;
      }

      if (request.method === 'POST' && url.pathname === '/api/auth/login') {
        checkRateLimit(request, 'login', 10, 15 * 60 * 1000);
        const body = await readRequestBody(request);
        const email = normalizeEmail(body.email);
        const password = typeof body.password === 'string' ? body.password : '';
        if (password.length > 128) throw new HttpError(401, 'Неверный email или пароль.');
        if (password.length > 128) throw new HttpError(400, 'Пароль не должен быть длиннее 128 символов.');
        const user = admin?.email === email ? admin : users.find(item => item.email === email);
        const validPassword = await verifyPassword(password, user?.password || dummyPasswordRecord);
        if (!user || !validPassword) throw new HttpError(401, 'Неверный email или пароль.');
        const token = randomBytes(32).toString('hex');
        sessions.set(token, { user, expiresAt: Date.now() + sessionMaxAge * 1000 });
        sendJson(response, 200, { user: publicUser(user) }, { 'Set-Cookie': sessionCookieHeader(token) });
        return;
      }

      if (request.method === 'POST' && url.pathname === '/api/auth/logout') {
        const user = readSession(request);
        if (user) {
          const token = (request.headers.cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${sessionCookie}=`))?.slice(sessionCookie.length + 1);
          if (token) sessions.delete(token);
        }
        sendJson(response, 200, { ok: true }, { 'Set-Cookie': clearSessionCookie() });
        return;
      }

      sendJson(response, 404, { error: 'Маршрут не найден.' });
    }).catch(error => {
      if (error instanceof HttpError) {
        sendJson(response, error.status, { error: error.message });
        return;
      }
      console.error('Authentication server error:', error);
      if (!response.headersSent) sendJson(response, 500, { error: 'Ошибка сервера. Попробуйте позже.' });
      else response.destroy(error);
    });
  });

  return { server, adminEmail };
}

const { server, adminEmail } = await createApplicationServer();
const host = process.env.HOST || (isProduction ? '0.0.0.0' : '127.0.0.1');
server.listen(port, host, () => {
  console.log(`Nomad Eats server listening on http://${host}:${port}`);
  if (adminEmail) console.log(`Administrator account configured for ${adminEmail}`);
  else console.warn('Administrator login is disabled: set ADMIN_EMAIL and ADMIN_PASSWORD.');
});
