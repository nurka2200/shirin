import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const server = spawn(process.execPath, ['server/index.js'], { cwd: rootDir, stdio: 'inherit' });
const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js'], { cwd: rootDir, stdio: 'inherit' });
let stopping = false;

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  server.kill();
  vite.kill();
  process.exitCode = exitCode;
}

for (const child of [server, vite]) {
  child.on('error', error => {
    console.error('Could not start development process:', error);
    stop(1);
  });
  child.on('exit', (code, signal) => {
    if (!stopping) stop(code ?? (signal ? 1 : 0));
  });
}

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
