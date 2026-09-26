import assert from 'node:assert/strict';
import {
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
const binary = resolve(repository, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const temporary = mkdtempSync(resolve(tmpdir(), 'supercov-rust-vite-playwright-'));
const project = resolve(temporary, 'project');

function rust(command, request) {
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
  mkdirSync(resolve(project, 'src'), { recursive: true });
  mkdirSync(resolve(project, 'tests'), { recursive: true });
  mkdirSync(resolve(project, 'node_modules/.bin'), { recursive: true });
  mkdirSync(resolve(project, 'node_modules/@playwright'), { recursive: true });
  for (const dependency of ['vite'])
    symlinkSync(
      resolve(repository, 'node_modules', dependency),
      resolve(project, 'node_modules', dependency),
    );
  symlinkSync(
    resolve(repository, 'node_modules/@playwright/test'),
    resolve(project, 'node_modules/@playwright/test'),
  );
  for (const binaryName of ['playwright', 'vite'])
    symlinkSync(
      resolve(repository, 'node_modules/.bin', binaryName),
      resolve(project, 'node_modules/.bin', binaryName),
    );
  writeFileSync(
    resolve(project, 'package.json'),
    JSON.stringify({
      name: 'supercov-rust-vite-playwright-fixture',
      private: true,
      type: 'module',
      scripts: {
        build: 'vite build',
        preview: 'vite preview',
        test: 'playwright test',
      },
    }) + '\n',
  );
  writeFileSync(
    resolve(project, 'playwright.config.mjs'),
    [
      'export default {',
      "  testDir: './tests',",
      '  fullyParallel: true,',
      '  workers: 2,',
      "  reporter: 'line',",
      "  use: { baseURL: 'http://127.0.0.1:41738' },",
      '  webServer: {',
      "    command: 'npm run preview -- --host 127.0.0.1 --port 41738',",
      "    url: 'http://127.0.0.1:41738',",
      '    reuseExistingServer: false,',
      '  },',
      '};',
      '',
    ].join('\n'),
  );
  writeFileSync(
    resolve(project, 'index.html'),
    '<main id="result"></main><script type="module" src="/src/app.js"></script>\n',
  );
  const application = [
    'export function permission(admin, owner) {',
    '  if (admin || owner) return "allowed";',
    '  return "denied";',
    '}',
    'const params = new URLSearchParams(location.search);',
    'const admin = params.get("admin") === "1";',
    'const owner = params.get("owner") === "1";',
    'document.querySelector("#result").textContent = permission(admin, owner);',
    '',
  ].join('\n');
  writeFileSync(resolve(project, 'src/app.js'), application);
  writeFileSync(
    resolve(project, 'tests/permission.spec.js'),
    [
      "import { expect, test } from '@playwright/test';",
      'const cases = [',
      "  ['admin', 1, 0, 'allowed'],",
      "  ['owner', 0, 1, 'allowed'],",
      "  ['both', 1, 1, 'allowed'],",
      "  ['neither', 0, 0, 'denied'],",
      '];',
      'for (const [name, admin, owner, expected] of cases) {',
      '  test(name, async ({ page }) => {',
      '    await page.goto(`/?admin=${admin}&owner=${owner}`);',
      "    await expect(page.locator('#result')).toHaveText(expected);",
      '  });',
      '}',
      '',
    ].join('\n'),
  );

  const run = rust('__run-js-direct', {
    root: project,
    command: ['npm', 'test'],
    runId: 'rust-vite-playwright',
    startedAt: '2026-08-25T00:00:04.000Z',
  });
  assert.equal(run.exitCode, 0, run.output);
  assert.equal(run.assertionCalls, 1);
  assert.equal(readFileSync(resolve(project, 'src/app.js'), 'utf8'), application);
  assert.ok(run.metadata.timings.instrumentedBuildMs > 0);
  const summary = rust('__query-stored-run', {
    root: project,
    query: {
      runId: run.runId,
      filter: 'passed',
      command: 'summary',
    },
  });
  assert.equal(summary.data.valid, true);
  assert.equal(summary.data.complete, true);
  assert.equal(summary.data.tests, 4);
  assert.equal(summary.data.coverage.conditionCoveragePct, 100);
  assert.equal(summary.data.coverage.lines.percentage, 100);
  assert.equal(summary.data.coverage.branches.percentage, 100);
  assert.deepEqual(
    summary.data.coverageByRunner.map(entry => entry.runner),
    ['playwright'],
  );
  const test = rust('__query-stored-run', {
    root: project,
    query: {
      runId: run.runId,
      filter: 'passed',
      command: 'test',
      selector: 'admin',
    },
  });
  assert.equal(test.data.tests.length, 1);
  assert.ok(
    test.data.tests[0].phases.some(
      phase => phase.operation.endsWith('Page.goto') && phase.lines > 0,
    ),
  );
  console.log(
    '[rust-vite-playwright] Rust instruments, builds, runs, attributes, and queries browser application coverage',
  );
} finally {
  if (process.env.SUPERCOV_KEEP_FIXTURE === '1')
    console.error(`[rust-vite-playwright] retained ${project}`);
  else rmSync(temporary, { recursive: true, force: true });
}
