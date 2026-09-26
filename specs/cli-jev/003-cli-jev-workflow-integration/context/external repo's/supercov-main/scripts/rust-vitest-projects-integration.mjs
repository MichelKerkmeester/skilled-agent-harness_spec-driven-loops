import assert from 'node:assert/strict';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repository = resolve(import.meta.dirname, '..');
const binary = resolve(
  repository,
  `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`,
);
const root = mkdtempSync(resolve(tmpdir(), 'supercov-vitest-projects-'));
const chrome =
  process.env.SUPERCOV_TEST_CHROME ??
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined);
function write(path, source) {
  writeFileSync(resolve(root, path), source);
}
function query(command, request) {
  const result = spawnSync(binary, [command], {
    cwd: repository,
    encoding: 'utf8',
    input: JSON.stringify(request),
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const value = JSON.parse(result.stdout.trim().split('\n').at(-1));
  // What the wrapped command printed, kept off the value's own fields so that
  // comparing it or printing it as JSON is unchanged. Without it a suite that
  // failed under Supercov reported only its exit code: a flaky browser test
  // and a broken one looked the same, and telling them apart took a rerun.
  Object.defineProperty(value, 'output', { value: tail(`${result.stdout}${result.stderr}`) });
  return value;
}

// The end of what a command printed, where the failure is, bounded so an
// assertion message stays readable.
function tail(text, lines = 200) {
  return text.trimEnd().split('\n').slice(-lines).join('\n');
}
try {
  mkdirSync(resolve(root, 'src'));
  mkdirSync(resolve(root, 'tests'));
  symlinkSync(
    resolve(repository, 'node_modules'),
    resolve(root, 'node_modules'),
    'dir',
  );
  write(
    'package.json',
    JSON.stringify({
      name: 'vitest-projects-regression',
      private: true,
      type: 'module',
      scripts: { test: 'vitest run' },
    }),
  );
  write(
    'src/permission.js',
    `export const label = String('Ready');
export function permission(enabled) { return enabled ? label : 'Disabled'; }\n`,
  );
  write('tests/setup.js', 'globalThis.fixtureSetup = true;\n');
  write(
    'tests/permission.test.js',
    `import {expect, test} from 'vitest';
import {permission} from '@app/permission';
test('enabled', () => { expect(globalThis.fixtureSetup).toBe(true); expect(permission(true)).toBe('Ready'); });
test('disabled', () => expect(permission(false)).toBe('Disabled'));\n`,
  );
  const common = `resolve:{alias:{'@app/permission':new URL('./src/permission.js', import.meta.url).pathname}}`;
  const browser = `browser:{enabled:true,headless:true,provider:playwright(${chrome && existsSync(chrome) ? JSON.stringify({ launchOptions: { executablePath: chrome } }) : ''}),instances:[{browser:'chromium'}]}`;
  write(
    'vitest.node.config.js',
    `export default {${common}, test:{include:['tests/**/*.test.js'],name:'unit',setupFiles:['./tests/setup.js']}};\n`,
  );
  write(
    'vitest.browser.config.js',
    `import {playwright} from '@vitest/browser-playwright';
export default {${common}, test:{include:['tests/**/*.test.js'],name:'ui',setupFiles:['./tests/setup.js'],${browser}}};\n`,
  );
  const cases = [
    [
      'inline-extends',
      `export default {test:{projects:[{extends:'./vitest.node.config.js'}, {extends:'./vitest.browser.config.js'}]}};`,
      [],
      4,
    ],
    [
      'config-glob',
      `export default {test:{projects:['./vitest.*.config.js']}};`,
      [],
      4,
    ],
    [
      'project-selection',
      `export default {test:{projects:['./vitest.*.config.js']}};`,
      ['--project', 'ui'],
      2,
    ],
    [
      'root-inheritance',
      `import {playwright} from '@vitest/browser-playwright';
export default {${common}, test:{include:['tests/**/*.test.js'],setupFiles:['./tests/setup.js'],projects:[{extends:true,test:{name:'unit'}},{extends:true,test:{name:'ui',${browser}}}]}};`,
      [],
      4,
    ],
  ];
  for (const [name, config, flags, tests] of cases) {
    write('vitest.config.js', config);
    const command = ['npm', 'test', '--', ...flags];
    const baseline = spawnSync(command[0], command.slice(1), {
      cwd: root,
      encoding: 'utf8',
      timeout: 60000,
    });
    assert.equal(baseline.status, 0, baseline.stdout + baseline.stderr);
    const run = query('__run-js-direct', {
      root,
      command,
      runId: `projects-${name}`,
      startedAt: new Date().toISOString(),
    });
    assert.equal(run.exitCode, 0, `${JSON.stringify(run)}\n${run.output}`);
    const summary = query('__query-stored-run', {
      root,
      query: { runId: run.runId, command: 'summary', filter: 'all' },
    }).data;
    assert.equal(summary.tests, tests, name);
    assert.equal(summary.testOutcomes.failed, 0, name);
    assert.equal(summary.coverage.lines.percentage, 100, name);
    assert.equal(summary.coverage.conditionCoveragePct, 100, name);
    assert.equal(summary.valid, true, name);
    console.log(
      `[vitest-projects] ${name}: ${tests} tests; full line and condition evidence`,
    );
  }
} finally {
  if (process.env.SUPERCOV_KEEP_FIXTURE === '1')
    console.error(`[vitest-projects] retained ${root}`);
  else rmSync(root, { recursive: true, force: true });
}
