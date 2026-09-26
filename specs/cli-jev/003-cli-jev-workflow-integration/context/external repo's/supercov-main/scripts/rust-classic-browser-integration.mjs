// A page served as plain `<script>` files, and a TypeScript Playwright config
// in a CommonJS package, both through the public command.
//
// TodoMVC's ES5 app loads its application as several classic scripts from a
// static server. Under Supercov the first failed on a runtime nothing had
// installed in the page, and the second on a helper binding the first had
// already declared in the page's shared global scope. Actual keeps
// `playwright.config.ts` in a `"type": "commonjs"` package, which Playwright
// transpiles to a module namespace; the generated wrapper spread that
// namespace and lost `testDir`, so no test was found.
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repository = resolve(import.meta.dirname, '..');
const binary = resolve(repository, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const temporary = mkdtempSync(resolve(tmpdir(), 'supercov-classic-browser-'));

function write(root, path, text) {
  mkdirSync(resolve(root, path, '..'), { recursive: true });
  writeFileSync(resolve(root, path), text);
}

function link(root) {
  mkdirSync(resolve(root, 'node_modules/@playwright'), { recursive: true });
  symlinkSync(resolve(repository, 'node_modules/@playwright/test'), resolve(root, 'node_modules/@playwright/test'), 'dir');
  symlinkSync(resolve(repository, 'node_modules/playwright'), resolve(root, 'node_modules/playwright'), 'dir');
  symlinkSync(resolve(repository, 'node_modules/playwright-core'), resolve(root, 'node_modules/playwright-core'), 'dir');
}

function supercov(cwd, args, env = {}) {
  const result = spawnSync(binary, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, CI: '1', NO_COLOR: '1', ...env },
    timeout: 240_000,
  });
  return { status: result.status, output: `${result.stdout}\n${result.stderr}` };
}

async function freePort() {
  return new Promise((done, fail) => {
    const server = createServer();
    server.unref();
    server.on('error', fail);
    server.listen(0, () => {
      const { port } = server.address();
      server.close(() => done(port));
    });
  });
}

try {
  // Classic scripts sharing one document.
  const page = resolve(temporary, 'classic');
  const port = await freePort();
  link(page);
  write(page, 'package.json', JSON.stringify({ name: 'classic', private: true }) + '\n');
  write(page, 'public/index.html', [
    '<!doctype html><html><body><input id="t"><button id="b">add</button><ul id="l"></ul>',
    '<script src="a.js"></script><script src="b.js"></script></body></html>',
    '',
  ].join('\n'));
  write(page, 'public/a.js', [
    'var app = { items: [] };',
    'function add(text) { if (text && text.trim()) { app.items.push(text.trim()); } }',
    '',
  ].join('\n'));
  write(page, 'public/b.js', [
    "document.getElementById('b').addEventListener('click', function () {",
    "  add(document.getElementById('t').value);",
    "  var list = document.getElementById('l'); list.innerHTML = '';",
    "  app.items.forEach(function (item) { var li = document.createElement('li'); li.textContent = item; list.appendChild(li); });",
    '});',
    '',
  ].join('\n'));
  write(page, 'server.cjs', [
    "const http = require('node:http'); const fs = require('node:fs'); const path = require('node:path');",
    'http.createServer((request, response) => {',
    "  const file = path.join(__dirname, 'public', request.url === '/' ? 'index.html' : request.url);",
    '  fs.readFile(file, (error, data) => {',
    '    if (error) { response.statusCode = 404; return response.end(); }',
    "    response.setHeader('content-type', file.endsWith('.js') ? 'text/javascript' : 'text/html');",
    '    response.end(data);',
    '  });',
    `}).listen(${port});`,
    '',
  ].join('\n'));
  write(page, 'playwright.config.cjs', [
    'module.exports = {',
    "  testDir: './e2e', reporter: 'line',",
    `  use: { baseURL: 'http://127.0.0.1:${port}' },`,
    `  webServer: { command: 'node server.cjs', url: 'http://127.0.0.1:${port}', reuseExistingServer: false },`,
    '};',
    '',
  ].join('\n'));
  write(page, 'e2e/todo.spec.cjs', [
    "const { test, expect } = require('@playwright/test');",
    "test('adds an item', async ({ page }) => {",
    '  const errors = [];',
    "  page.on('pageerror', (error) => errors.push(error.message));",
    "  await page.goto('/');",
    "  await page.fill('#t', ' milk ');",
    "  await page.click('#b');",
    "  await expect(page.locator('#l li')).toHaveText(['milk']);",
    '  expect(errors).toEqual([]);',
    '});',
    '',
  ].join('\n'));
  const run = supercov(page, ['--', 'node', 'node_modules/playwright/cli.js', 'test', '-c', 'playwright.config.cjs'], {
    SUPERCOV_SOURCE_ROOTS: 'public',
  });
  assert.equal(run.status, 0, run.output);
  assert.match(run.output, /1 passed/);
  for (const file of ['public/a.js', 'public/b.js']) {
    const shown = supercov(page, ['runs', 'latest', 'file', file]);
    assert.equal(shown.status, 0, shown.output);
    assert.match(shown.output, /Lines not executed\s+0/, `${file} executed in the page\n${shown.output}`);
    assert.match(shown.output, /Tests touching this file: 1/, shown.output);
  }

  // A TypeScript config in a CommonJS package.
  const interop = resolve(temporary, 'interop');
  link(interop);
  write(interop, 'package.json', JSON.stringify({ name: 'interop', private: true, type: 'commonjs' }) + '\n');
  write(interop, 'src/value.js', 'module.exports = { value: 1 };\n');
  write(interop, 'playwright.config.ts', [
    "import { defineConfig } from '@playwright/test';",
    "export default defineConfig({ testDir: './e2e', reporter: 'list', timeout: 12345 });",
    '',
  ].join('\n'));
  write(interop, 'e2e/sample.test.ts', [
    "import { test, expect } from '@playwright/test';",
    "test('a discovered test', () => { expect(1).toBe(1); });",
    '',
  ].join('\n'));
  const listed = supercov(interop, ['--', 'node', 'node_modules/playwright/cli.js', 'test', '--list']);
  assert.equal(listed.status, 0, listed.output);
  assert.match(listed.output, /Total: 1 test in 1 file/, listed.output);

  // Workers: a classic worker needs the runtime no init script can give it,
  // a test that closes its page takes its dedicated workers with it, and a
  // worker blocked in Atomics.wait must not stall the suite. The server is
  // cross-origin isolated so the page can share memory with the worker.
  const workers = resolve(temporary, 'workers');
  const workerPort = await freePort();
  link(workers);
  write(workers, 'package.json', JSON.stringify({ name: 'workers', private: true }) + '\n');
  write(workers, 'public/index.html', [
    '<!doctype html><html><body><button id="square">square</button><output id="out"></output>',
    '<button id="wake">wake</button><output id="woke"></output>',
    '<script src="page.js"></script></body></html>',
    '',
  ].join('\n'));
  write(workers, 'public/page.js', [
    "var worker = new Worker('worker.js');",
    "worker.onmessage = function (event) { document.getElementById('out').textContent = String(event.data); };",
    "document.getElementById('square').addEventListener('click', function () { worker.postMessage(7); });",
    'var shared = new Int32Array(new SharedArrayBuffer(4));',
    "var sleeper = new Worker('sleeper.js');",
    "sleeper.onmessage = function (event) { document.getElementById('woke').textContent = event.data; };",
    'sleeper.postMessage(shared);',
    "document.getElementById('wake').addEventListener('click', function () { Atomics.store(shared, 0, 1); Atomics.notify(shared, 0); });",
    '',
  ].join('\n'));
  write(workers, 'public/worker.js', 'self.onmessage = function (event) { var n = event.data; self.postMessage(n > 5 ? n * n : -1); };\n');
  write(workers, 'public/sleeper.js', [
    'self.onmessage = function (event) {',
    '  var shared = event.data;',
    '  Atomics.wait(shared, 0, 0);',
    "  self.postMessage(shared[0] === 1 ? 'awake' : 'confused');",
    '};',
    '',
  ].join('\n'));
  write(workers, 'server.cjs', [
    "const http = require('node:http'); const fs = require('node:fs'); const path = require('node:path');",
    'http.createServer((request, response) => {',
    "  const file = path.join(__dirname, 'public', request.url === '/' ? 'index.html' : request.url);",
    '  fs.readFile(file, (error, data) => {',
    '    if (error) { response.statusCode = 404; return response.end(); }',
    "    response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');",
    "    response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');",
    "    response.setHeader('content-type', file.endsWith('.js') ? 'text/javascript' : 'text/html');",
    '    response.end(data);',
    '  });',
    `}).listen(${workerPort});`,
    '',
  ].join('\n'));
  write(workers, 'playwright.config.cjs', [
    'module.exports = {',
    "  testDir: './e2e', reporter: 'line', timeout: 60000,",
    `  use: { baseURL: 'http://127.0.0.1:${workerPort}' },`,
    `  webServer: { command: 'node server.cjs', url: 'http://127.0.0.1:${workerPort}', reuseExistingServer: false },`,
    '};',
    '',
  ].join('\n'));
  write(workers, 'e2e/workers.spec.cjs', [
    "const { test, expect } = require('@playwright/test');",
    "test('a worker squares a number, and the test closes its page', async ({ page }) => {",
    "  await page.goto('/');",
    "  await page.click('#square');",
    "  await expect(page.locator('#out')).toHaveText('49');",
    '  await page.close();',
    '});',
    "test('a blocked worker wakes when the page tells it to', async ({ page }) => {",
    "  await page.goto('/');",
    "  await page.click('#wake');",
    "  await expect(page.locator('#woke')).toHaveText('awake');",
    '});',
    '',
  ].join('\n'));
  const workerRun = supercov(workers, ['--', 'node', 'node_modules/playwright/cli.js', 'test', '-c', 'playwright.config.cjs'], {
    SUPERCOV_SOURCE_ROOTS: 'public',
  });
  assert.equal(workerRun.status, 0, workerRun.output);
  assert.match(workerRun.output, /2 passed/);
  for (const file of ['public/worker.js', 'public/sleeper.js']) {
    const shown = supercov(workers, ['runs', 'latest', 'file', file]);
    assert.match(shown.output, /Lines not executed\s+0/, `${file} executed in its worker\n${shown.output}`);
  }
  // The first test closed its page with the sleeper still blocked, so what
  // it recorded is a lower bound; the second woke it and is exact.
  const summary = supercov(workers, ['runs', 'latest']);
  assert.match(summary.output, /Attribution\s+1 exact, 1 a lower bound/, summary.output);

  console.log('[classic-browser] classic scripts share a page, workers are measured without stalling the suite, and a CommonJS TypeScript config keeps its settings');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
