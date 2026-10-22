import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

const includeAdmin = process.argv.includes('--all') || process.argv.includes('--admin');

const services = [
  {
    name: 'BACKEND ',
    color: '\x1b[34m',
    cmd: isWindows ? 'node.exe' : 'node',
    args: ['server.js'],
    cwd: path.join(__dirname, 'backend')
  },
  {
    name: 'FRONTEND',
    color: '\x1b[32m',
    cmd: npmCmd,
    args: ['run', 'dev'],
    cwd: path.join(__dirname, 'frontend')
  }
];

if (includeAdmin) {
  services.push({
    name: 'ADMIN   ',
    color: '\x1b[35m',
    cmd: npmCmd,
    args: ['run', 'dev'],
    cwd: path.join(__dirname, 'admin')
  });
}

console.log('\x1b[1m\x1b[36m=== Starting Foodolio Development Environment ===\x1b[0m');
console.log('Backend:  http://localhost:4000');
console.log('Frontend: http://localhost:5173');
if (includeAdmin) {
  console.log('Admin:    http://localhost:5174');
}
console.log('--------------------------------------------------\n');

const children = [];

services.forEach(svc => {
  const child = spawn(svc.cmd, svc.args, {
    cwd: svc.cwd,
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: isWindows,
    env: { ...process.env, PATH: `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH}` }
  });

  child.stdout.on('data', data => {
    const lines = data.toString().trimEnd().split('\n');
    lines.forEach(line => {
      console.log(`${svc.color}[${svc.name}]\x1b[0m ${line}`);
    });
  });

  child.stderr.on('data', data => {
    const lines = data.toString().trimEnd().split('\n');
    lines.forEach(line => {
      console.error(`${svc.color}[${svc.name}]\x1b[0m \x1b[31m${line}\x1b[0m`);
    });
  });

  child.on('exit', code => {
    console.log(`${svc.color}[${svc.name}]\x1b[0m exited with code ${code}`);
  });

  children.push(child);
});

function cleanup() {
  console.log('\nShutting down all services...');
  children.forEach(child => {
    try {
      child.kill();
    } catch (e) {}
  });
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
