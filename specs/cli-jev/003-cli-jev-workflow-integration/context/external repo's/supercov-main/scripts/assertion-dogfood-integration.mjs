// Regression cases from the Supergateway assertion-map dogfood. This fixture
// owns its test data; no application files or existing run maps are modified.
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, symlinkSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { latestRun, repository, requireSupercov, coverageQuery, executeSupercov } from './coverage-test-helpers.mjs';

const root = mkdtempSync(resolve(tmpdir(), 'supercov-dogfood-'));
const write = (file, value) => writeFileSync(resolve(root, file), typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
try {
  mkdirSync(resolve(root, 'src'));
  mkdirSync(resolve(root, 'tests'));
  mkdirSync(resolve(root, 'node_modules/.bin'), { recursive: true });
  symlinkSync(resolve(repository, 'node_modules/typescript'), resolve(root, 'node_modules/typescript'), process.platform === 'win32' ? 'junction' : 'dir');
  if (process.platform === 'win32') write('node_modules/.bin/tsc.cmd', `@node "${resolve(repository, 'node_modules/typescript/bin/tsc')}" %*\r\n`);
  else symlinkSync(resolve(repository, 'node_modules/.bin/tsc'), resolve(root, 'node_modules/.bin/tsc'));
  write('package.json', { name: 'supercov-dogfood-fixture', type: 'module', private: true, scripts: { build: 'tsc -p tsconfig.build.json', test: 'node --test tests/valueE2e.test.js' } });
  const config = { compilerOptions: { module: 'NodeNext', target: 'ES2022', outDir: 'dist', rootDir: 'src', strict: true }, include: ['src'] };
  write('tsconfig.json', config);
  write('tsconfig.build.json', { extends: './tsconfig.json' });
  write('src/types.ts', "export class Logger { value = 1; }\nconsole.log('type-only module loaded');\n");
  write('src/inline.ts', "export interface Inline { value: number }\nconsole.log('inline module loaded');\n");
  write('src/mixed.ts', 'export interface Config { value: number }\nexport const run = (n: number) => n + 1;\n');
  write('src/register.ts', "console.log('side effect retained');\n");
  write('src/value.ts', "import { Logger } from './types.js';\nimport { type Inline } from './inline.js';\nimport { run, type Config } from './mixed.js';\nimport './register.js';\nexport function value(logger: Logger): number { return run(logger.value); }\n");
  write('tests/valueE2e.test.js', "import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { value } from '../dist/value.js';\ntest('result', t => { assert.equal(value({value: 2}), 3); t.after(() => assert.equal(value({value: 3}), 4)); });\ntest.skip('disabled', () => assert.equal(value({value: 0}), 1));\n");
  const first = requireSupercov(root, ['--', 'npm', 'test']);
  assert.match(first.stdout, /side effect retained/);
  assert.doesNotMatch(first.stdout, /type-only module loaded|inline module loaded/);
  let run = latestRun(root);
  const q = (...args) => coverageQuery(root, run, ...args).data;
  const exclusions = q('assertions', 'report', '--view', 'excludedStatements', '--limit', '1000');
  assert.deepEqual(exclusions.items.map(p => [p.file, p.line]), [['src/value.ts', 1], ['src/value.ts', 2]]);
  const summary = q();
  assert.equal(summary.testKindSources.path, 2);
  assert.equal(q('assertions').summary.unobservedAssertions, 1, 'teardown assertion is observed; skipped one is not');

  const directory = resolve(root, '.supercov/runs', run);
  const mapFile = resolve(directory, 'assertions.json');
  const stateBefore = readFileSync(resolve(directory, 'assertions.state.json'));
  const original = readFileSync(mapFile);
  const before = q('assertions', 'report');
  const cachePath = resolve(directory, 'assertions.report.cache.json');
  const cachedAt = statSync(cachePath).mtimeMs;
  assert.deepEqual(q('assertions', 'report'), before, 'warm report is identical');
  assert.equal(statSync(cachePath).mtimeMs, cachedAt, 'warm queries read the cache rather than rewrite it');
  const map = JSON.parse(original);
  map.assertions[0].questions = ['new question invalidates the cached assessment'];
  writeFileSync(mapFile, JSON.stringify(map));
  const changed = q('assertions', 'report');
  assert.notEqual(changed.revision, before.revision);
  assert.equal(changed.summary.questions, before.summary.questions + 1);
  writeFileSync(resolve(directory, 'assertions.report.cache.json'), 'corrupt cache');
  assert.deepEqual(q('assertions', 'report'), changed, 'corrupt derived data is recomputed');
  writeFileSync(mapFile, original);
  assert.deepEqual(q('assertions', 'report'), before);
  assert.deepEqual(readFileSync(resolve(directory, 'assertions.state.json')), stateBefore);

  // A large individual flow is inspectable in independent complete node/edge
  // pages. These synthetic duplicate anchors exercise transport, not semantics.
  const statement = q('assertions', 'report', '--view', 'statements', '--limit', '1000').items.find(p => p.at?.text === 'return run(logger.value);');
  assert.ok(statement);
  const a = map.assertions.find(a => a.at.text.startsWith('assert.equal(value({value: 2})'));
  assert.ok(a);
  a.questions = [];
  a.flows = [{ id: 'large', basis: null, explanation: 'Fixture graph for report paging', appliesTo: [{ file: 'tests/valueE2e.test.js', name: 'result' }], questions: [], watch: [],
    nodes: Array.from({ length: 450 }, (_, i) => ({ id: `node${i}`, at: statement.at, role: 'value', meaning: 'Returns the checked value.' })),
    edges: Array.from({ length: 450 }, (_, i) => ({ from: `node${i}`, to: '$assertion', kind: 'data', basis: 'Fixture relation' })),
    countsAsAsserted: Array.from({ length: 450 }, (_, i) => `node${i}`) }];
  writeFileSync(mapFile, JSON.stringify(map));
  for (const view of ['nodes', 'edges']) {
    let offset = 0, total = 0;
    do {
      const page = q('assertion', a.id, '--flow', 'large', '--view', view, '--compact', '--offset', String(offset), '--limit', '1000');
      assert.equal(page.view, 'assertionFlow');
      assert.ok(page.items.length > 0);
      if (view === 'nodes') assert.ok(page.items.every(n => n.at.textOmitted && !('text' in n.at) && n.credit));
      total += page.items.length; offset = page.pagination.nextOffset;
    } while (offset !== null);
    assert.equal(total, 450);
  }
  writeFileSync(mapFile, original);

  config.compilerOptions.verbatimModuleSyntax = true;
  write('tsconfig.json', config);
  assert.equal(executeSupercov(root, ['runs', run, 'assertions', 'report']).status, 2, 'source/config checks still precede cache reuse');
  const second = requireSupercov(root, ['--', 'npm', 'test']);
  assert.match(second.stdout, /type-only module loaded/);
  assert.match(second.stdout, /inline module loaded/);
  run = latestRun(root);
  assert.equal(q('assertions', 'report', '--view', 'excludedStatements').items.length, 0);
  const imports = q('assertions', 'report', '--view', 'statements', '--limit', '1000').items.filter(p => p.file === 'src/value.ts' && p.line <= 4);
  assert.equal(imports.length, 4, 'empty and mixed runtime imports retain obligations');
  console.log('Assertion dogfood integration passed: compiler output, skipped/teardown evidence, cache invalidation and large-flow pagination.');
} finally {
  if (process.env.SUPERCOV_KEEP_FIXTURE === '1') console.error(`retained ${root}`);
  else rmSync(root, { recursive: true, force: true, maxRetries: 10, retryDelay: 20 });
}
