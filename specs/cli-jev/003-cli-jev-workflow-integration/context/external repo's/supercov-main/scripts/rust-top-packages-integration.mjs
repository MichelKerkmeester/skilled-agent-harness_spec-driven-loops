// What failed running the test suites of popular npm packages under Supercov,
// through the public command, each in the smallest project that shows it.
//
// - semver, js-yaml and picomatch lint before they test. ESLint read the
//   instrumented copies, and Supercov's own .supercov/*.mjs, and failed on
//   code nobody wrote. A linter or formatter now reads what the author wrote.
// - uuid compiles its TypeScript tests with tsc --strict. A wrapped assertion
//   ran in a callback, which TypeScript narrows nothing into (TS18048,
//   TS7034, TS7005), and an `asserts` signature narrowed nothing after it.
// - commander reads { stdout } from util.promisify(execFile), which resolved
//   the bare string under Supercov; chalk passes its fixtures an environment
//   of their own, which Supercov extended with the parent's CI.
// - ms runs its suite twice, and the second run's phases repeated the first's,
//   so the run could not be opened.
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repository = resolve(import.meta.dirname, '..');
const binary = resolve(repository, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const temporary = mkdtempSync(resolve(tmpdir(), 'supercov-top-packages-'));

function write(root, path, text) {
  mkdirSync(resolve(root, path, '..'), { recursive: true });
  writeFileSync(resolve(root, path), text);
}

function supercov(cwd, args) {
  const result = spawnSync(binary, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, CI: '1', NO_COLOR: '1' },
    timeout: 240_000,
  });
  return { status: result.status, output: `${result.stdout}\n${result.stderr}` };
}

function covered(cwd) {
  const summary = supercov(cwd, ['runs', 'latest']);
  assert.equal(summary.status, 0, summary.output);
  const lines = summary.output.match(/Lines\s+([\d.]+)% \((\d+)\/(\d+)\)/);
  assert.ok(lines, summary.output);
  return { covered: Number(lines[2]), total: Number(lines[3]), output: summary.output };
}

// Stand-ins for ESLint and Prettier: each walks the project the way the real
// tool does and fails on anything Supercov wrote. The preload recognises the
// tools by where their entry point lives.
const linter = (walk) => `
const fs = require('node:fs');
const path = require('node:path');
const seen = [];
const judge = (file, text) => {
  const local = path.relative(process.cwd(), file);
  seen.push(local);
  if (local.split(path.sep).includes('.supercov')) throw new Error('listed ' + local);
  if (/__supercov|__SUPERCOV|sourceMappingURL=data:/.test(text)) throw new Error('instrumented ' + file);
};
${walk}
`;

try {
  const lint = resolve(temporary, 'lint');
  write(lint, 'package.json', JSON.stringify({
    name: 'lint-fixture',
    private: true,
    scripts: {
      lint: 'node node_modules/eslint/bin/eslint.js && node node_modules/prettier/bin/prettier.cjs',
      test: 'npm run lint && node --test && node --test',
    },
  }));
  write(lint, 'lib/index.js', `'use strict';
exports.pick = function pick(value, fallback) {
  if (value && value.length > 0) return value;
  return fallback;
};
`);
  write(lint, 'lib/show.js', `process.stdout.write(JSON.stringify({ argv: process.argv.slice(2), ci: process.env.CI ?? null, own: process.env.OWN ?? null }));
`);
  write(lint, 'test/index.test.js', `'use strict';
const assert = require('node:assert/strict');
const { execFile, execFileSync } = require('node:child_process');
const { promisify } = require('node:util');
const test = require('node:test');
const { pick } = require('../lib/index.js');
const show = require('node:path').join(__dirname, '../lib/show.js');

test('picks', () => {
  assert.equal(pick('a', 'b'), 'a');
  assert.equal(pick('', 'b'), 'b');
});

test('a promisified execFile resolves stdout and stderr', async () => {
  const { stdout, stderr } = await promisify(execFile)(process.execPath, [show, 'x']);
  assert.equal(JSON.parse(stdout).argv[0], 'x');
  assert.equal(stderr, '');
});

test('a child given its own environment gets only that', () => {
  const seen = JSON.parse(execFileSync(process.execPath, [show], { env: { OWN: '1' }, encoding: 'utf8' }));
  assert.equal(seen.ci, null);
  assert.equal(seen.own, '1');
});
`);
  write(lint, 'node_modules/eslint/bin/eslint.js', linter(`
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.name === 'node_modules') continue;
    if (entry.isDirectory()) walk(file);
    else if (/\\.m?[jt]s$/.test(entry.name)) judge(file, fs.readFileSync(file, 'utf8'));
  }
};
walk(process.cwd());
if (!seen.includes(path.join('lib', 'index.js')) || !seen.includes(path.join('test', 'index.test.js'))) throw new Error('did not read ' + seen);
`));
  write(lint, 'node_modules/prettier/bin/prettier.cjs', linter(`
(async () => {
  for (const entry of await fs.promises.readdir(process.cwd(), { recursive: true })) {
    if (entry.split(path.sep).includes('node_modules') || !/\\.m?[jt]s$/.test(entry)) continue;
    judge(path.resolve(entry), await fs.promises.readFile(entry, 'utf8'));
  }
  await new Promise((done, fail) => fs.readFile('lib/index.js', 'utf8', (error, text) => {
    if (error) return fail(error);
    try { judge(path.resolve('lib/index.js'), text); done(); } catch (problem) { fail(problem); }
  }));
})().catch((error) => { console.error(error.message); process.exit(1); });
`));
  const linted = supercov(lint, ['--', 'npm', 'test']);
  assert.equal(linted.status, 0, linted.output);
  const lintCoverage = covered(lint);
  assert.ok(lintCoverage.covered > 0, lintCoverage.output);

  const typed = resolve(temporary, 'typed');
  mkdirSync(resolve(typed, 'node_modules/.bin'), { recursive: true });
  symlinkSync(resolve(repository, 'node_modules/typescript'), resolve(typed, 'node_modules/typescript'));
  symlinkSync(resolve(repository, 'node_modules/.bin/tsc'), resolve(typed, 'node_modules/.bin/tsc'));
  mkdirSync(resolve(typed, 'node_modules/@types'), { recursive: true });
  symlinkSync(resolve(repository, 'node_modules/@types/node'), resolve(typed, 'node_modules/@types/node'));
  write(typed, 'package.json', JSON.stringify({
    name: 'typed-fixture',
    private: true,
    type: 'module',
    scripts: {
      build: 'tsc -p tsconfig.json',
      pretest: 'npm run build',
      test: 'node --test "dist/test/*.test.js"',
    },
  }));
  write(typed, 'tsconfig.json', JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      rootDir: 'src',
      outDir: 'dist',
      strict: true,
      types: ['node'],
    },
    include: ['src/**/*.ts'],
  }));
  write(typed, 'src/ids.ts', `export function next(step: number): string {
  return String(1000 + step).padStart(8, '0');
}
export function find(name: string): { name: string } | undefined {
  return name ? { name } : undefined;
}
`);
  write(typed, 'src/test/ids.test.ts', `import assert from 'node:assert/strict';
import test from 'node:test';
import { find, next } from '../ids.js';

test('ids sort by creation', () => {
  let prior: string | undefined;
  for (let i = 0; i < 5; i++) {
    const id = next(i);
    if (prior !== undefined) {
      assert.ok(prior < id, \`\${prior} < \${id}\`);
    }
    prior = id;
  }
  const ids = [];
  for (let i = 0; i < 3; i++) ids.push(next(i));
  assert.deepEqual(ids, ids.slice().sort())
});

test('an asserts signature narrows what follows', () => {
  const user = find('ada');
  assert.ok(user);
  if (user.name) assert.equal(user.name.length, 3);
  const length: number = ((): number => user.name.length)();
  assert.equal(length, 3);
  // @ts-expect-error the directive stays on the line it guards
  assert.equal(user.missing, undefined);
  assert.throws(() => {
    assert.equal(user.name, 'bob');
  });
});
`);
  const built = supercov(typed, ['--', 'npm', 'test']);
  assert.equal(built.status, 0, built.output.slice(-6000));
  assert.doesNotMatch(built.output, /error TS\d+/, built.output);
  const typedCoverage = covered(typed);
  assert.ok(typedCoverage.covered > 0, typedCoverage.output);
  console.log('top package failure classes pass through the public command');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
