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

// A suite whose browser never comes from Playwright's own fixtures.
//
// Test harnesses routinely launch their browser themselves: a worker-scoped
// fixture calls `chromium.launchPersistentContext` for a shared profile, or
// `chromium.launch` / `chromium.connect` and hands out `browser.newContext()`
// per test, then overrides `page` on top. None of those objects ever pass
// through the `browser`/`page` fixtures the collector wraps, so before this was
// fixed every page they opened ran unmeasured: the application executed in the
// browser, the probes fired, and the evidence was never read back. A real
// storefront suite of 68 tests reported its entire theme extension as never
// executed while 15 of those tests were clicking through it.
//
// Two things have to hold for such a suite to measure. Every test object the
// facade exports must collect, not only the one discovery happened to pick as
// "the" test export — a facade with one fixture set per surface (admin,
// storefront) otherwise leaves whole surfaces without a controller. And pages
// the suite creates outside any fixture, then closes mid-test, must be read
// before they close. Every test here drives the browser application through
// one of those shapes and nothing else, so browser coverage is 0% unless both
// hold — the assertion is the whole file at 100%, attributed per test.

const repository = resolve(import.meta.dirname, '..');
const binary = resolve(repository, `target/debug/supercov${process.platform === 'win32' ? '.exe' : ''}`);
const temporary = mkdtempSync(resolve(tmpdir(), 'supercov-rust-custom-browser-'));
const project = resolve(temporary, 'project');

function rust(command, request) {
  const result = spawnSync(binary, [command], {
    cwd: repository,
    encoding: 'utf8',
    input: JSON.stringify(request),
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const lines = result.stdout.trim().split('\n');
  return {
    ...JSON.parse(lines.at(-1)),
    diagnosticOutput: [...lines.slice(0, -1), result.stderr].filter(Boolean).join('\n'),
  };
}

try {
  mkdirSync(resolve(project, 'src'), { recursive: true });
  mkdirSync(resolve(project, 'tests'), { recursive: true });
  mkdirSync(resolve(project, 'node_modules/.bin'), { recursive: true });
  mkdirSync(resolve(project, 'node_modules/@playwright'), { recursive: true });
  mkdirSync(resolve(project, 'node_modules/@acme/browser-fixtures'), { recursive: true });
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
      name: 'supercov-rust-custom-browser-fixture',
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
      '  webServer: {',
      "    command: 'npm run preview -- --host 127.0.0.1 --port 41739',",
      "    url: 'http://127.0.0.1:41739',",
      '    reuseExistingServer: false,',
      '  },',
      '};',
      '',
    ].join('\n'),
  );
  writeFileSync(
    resolve(project, 'node_modules/@acme/browser-fixtures/package.json'),
    JSON.stringify({
      name: '@acme/browser-fixtures',
      private: true,
      type: 'module',
      exports: './index.js',
    }) + '\n',
  );
  // Three shapes real harnesses take. The first two keep the browser for the
  // worker's lifetime and mint the page themselves, overriding Playwright's
  // `page`; the third leaves `page` alone and opens its own browser inside the
  // test body.
  //
  //   persistent: `chromium.launchPersistentContext` — one context for every
  //               test in the worker, a new page per test.
  //   remote:     `chromium.launch` then a raw `browser.newContext()` per test
  //               — the Browser object never returns through the collector's
  //               proxy for the second call, so adoption has to find the
  //               context through `browser.contexts()`.
  //   standalone: the plain test, plus a helper that launches a browser,
  //               drives a page, and closes the context before returning —
  //               the page is gone before any fixture tears down, so its
  //               evidence has to be read on the way out.
  //
  // Only one of these can be the export discovery treats as the module's
  // test; the other two prove every test-shaped export is instrumented.
  writeFileSync(
    resolve(project, 'node_modules/@acme/browser-fixtures/index.js'),
    [
      "import { test as base, chromium, expect } from '@playwright/test';",
      "import { mkdtempSync } from 'node:fs';",
      "import { createServer } from 'node:http';",
      "import { tmpdir } from 'node:os';",
      "import { join } from 'node:path';",
      '',
      'export const persistentTest = base.extend({',
      '  ownContext: [',
      '    async ({}, use) => {',
      "      const context = await chromium.launchPersistentContext(mkdtempSync(join(tmpdir(), 'acme-profile-')));",
      '      await use(context);',
      '      await context.close();',
      '    },',
      "    { scope: 'worker' },",
      '  ],',
      '  page: async ({ ownContext }, use) => {',
      '    const page = await ownContext.newPage();',
      '    await use(page);',
      '    await page.close();',
      '  },',
      '});',
      '',
      'export const persistentNavigationTest = persistentTest.extend({',
      '  scopeServerUrl: [',
      '    async ({}, use) => {',
      '      const server = createServer((request, response) => {',
      "        response.setHeader('content-type', 'text/html');",
      "        if (request.url === '/outer') {",
      '          const address = server.address();',
      "          response.end(`<iframe id=inner src=\"http://localhost:${address.port}/inner\"></iframe>`);",
      '          return;',
      '        }',
      "        const scope = request.headers['x-supercov-scope'] ? 'scoped' : 'background';",
      "        response.end(`<p id=scope>${scope}</p><a id=again href=\"/inner-again\">again</a>`);",
      '      });',
      "      await new Promise((resolveListen) => server.listen(0, '0.0.0.0', resolveListen));",
      '      const address = server.address();',
      "      await use(`http://127.0.0.1:${address.port}`);",
      '      await new Promise((resolveClose, rejectClose) =>',
      '        server.close((error) => error ? rejectClose(error) : resolveClose()),',
      '      );',
      '    },',
      "    { scope: 'worker' },",
      '  ],',
      '});',
      '',
      'export const remoteTest = base.extend({',
      '  ownBrowser: [',
      '    async ({}, use) => {',
      '      const browser = await chromium.launch();',
      '      await use(browser);',
      '      await browser.close();',
      '    },',
      "    { scope: 'worker' },",
      '  ],',
      '  page: async ({ ownBrowser }, use) => {',
      '    // Reach the raw Browser the way real fixtures do: through an object',
      '    // handed out earlier, not the value the launch call returned.',
      '    const context = await ownBrowser.newContext();',
      '    const page = await context.newPage();',
      '    await use(page);',
      '    await context.close();',
      '  },',
      '});',
      '',
      'export const plainTest = base;',
      '',
      'export async function visitStandalone(url) {',
      '  const browser = await chromium.launch();',
      '  const context = await browser.newContext();',
      '  const page = await context.newPage();',
      '  await page.goto(url);',
      "  const text = await page.locator('#result').textContent();",
      '  await context.close();',
      '  await browser.close();',
      '  return text;',
      '}',
      '',
      'export { expect };',
      '',
    ].join('\n'),
  );
  writeFileSync(
    resolve(project, 'tests/persistent-navigation.spec.js'),
    [
      "import { persistentNavigationTest as test, expect } from '@acme/browser-fixtures';",
      '',
      "test('persistent cross-site iframe navigation', async ({ page, scopeServerUrl }) => {",
      "  await page.goto(`${scopeServerUrl}/outer`);",
      "  const inner = page.frameLocator('#inner');",
      "  await expect(inner.locator('#scope')).toHaveText('scoped');",
      "  await inner.locator('#again').click();",
      "  await expect(inner.locator('#scope')).toHaveText('scoped');",
      '});',
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
  const cases = [
    "  ['admin', 1, 0, 'allowed'],",
    "  ['owner', 0, 1, 'allowed'],",
    "  ['both', 1, 1, 'allowed'],",
    "  ['neither', 0, 0, 'denied'],",
  ];
  for (const [file, fixture] of [
    ['persistent.spec.js', 'persistentTest'],
    ['remote.spec.js', 'remoteTest'],
  ]) {
    writeFileSync(
      resolve(project, 'tests', file),
      [
        `import { ${fixture} as test, expect } from '@acme/browser-fixtures';`,
        'const cases = [',
        ...cases,
        '];',
        'for (const [name, admin, owner, expected] of cases) {',
        `  test(\`${fixture} \${name}\`, async ({ page }) => {`,
        "    await page.goto(`http://127.0.0.1:41739/?admin=${admin}&owner=${owner}`);",
        "    await expect(page.locator('#result')).toHaveText(expected);",
        '  });',
        '}',
        '',
      ].join('\n'),
    );
  }
  writeFileSync(
    resolve(project, 'tests/standalone.spec.js'),
    [
      "import { plainTest as test, expect, visitStandalone } from '@acme/browser-fixtures';",
      'const cases = [',
      ...cases,
      '];',
      'for (const [name, admin, owner, expected] of cases) {',
      '  test(`plainTest ${name}`, async () => {',
      '    const text = await visitStandalone(`http://127.0.0.1:41739/?admin=${admin}&owner=${owner}`);',
      '    expect(text).toBe(expected);',
      '  });',
      '}',
      '',
    ].join('\n'),
  );

  const run = rust('__run-js-direct', {
    root: project,
    command: ['npm', 'test'],
    runId: 'rust-custom-browser-playwright',
    startedAt: '2026-09-02T00:00:00.000Z',
  });
  assert.equal(run.exitCode, 0, run.diagnosticOutput);
  assert.equal(readFileSync(resolve(project, 'src/app.js'), 'utf8'), application);
  const summary = rust('__query-stored-run', {
    root: project,
    query: {
      runId: run.runId,
      filter: 'passed',
      command: 'summary',
    },
  });
  assert.equal(summary.data.valid, true, summary.diagnosticOutput);
  assert.equal(summary.data.complete, true);
  assert.equal(summary.data.tests, 13);
  // The decisive assertion: every line of the browser application ran, and
  // the collector saw it, even though no page came from Playwright's fixtures.
  assert.equal(
    summary.data.coverage.lines.percentage,
    100,
    `browser coverage from custom-launched contexts was lost: ${JSON.stringify(summary.data.coverage)}`,
  );
  assert.equal(summary.data.coverage.branches.percentage, 100);
  assert.equal(summary.data.coverage.conditionCoveragePct, 100);
  assert.deepEqual(
    summary.data.coverageByRunner.map((entry) => entry.runner),
    ['playwright'],
  );
  // Attribution is per test, not a lump at the end of the worker: for every
  // fixture shape, the one test that takes the "denied" branch is credited
  // with that line, and its siblings are not.
  for (const fixture of ['persistentTest', 'remoteTest', 'plainTest']) {
    for (const [name, expectDenied] of [['neither', true], ['admin', false]]) {
      const queried = rust('__query-stored-run', {
        root: project,
        query: {
          runId: run.runId,
          filter: 'passed',
          command: 'test',
          selector: `${fixture} ${name}`,
        },
      });
      assert.equal(queried.data.tests.length, 1, queried.diagnosticOutput);
      const [test] = queried.data.tests;
      assert.ok(
        test.totals.lines > 0,
        `${fixture} ${name}: no browser lines attributed to the test at all — its pages were never collected`,
      );
      assert.equal(
        test.lines.some((line) => line.file === 'src/app.js' && line.line === 3),
        expectDenied,
        `${fixture} ${name}: the "denied" line is ${expectDenied ? 'missing from' : 'wrongly credited to'} this test: ${JSON.stringify(test.lines)}`,
      );
    }
  }
  console.log(
    '[rust-custom-browser-playwright] contexts launched by a custom worker fixture are adopted and attributed per test',
  );
} finally {
  if (process.env.SUPERCOV_KEEP_FIXTURE === '1')
    console.error(`[rust-custom-browser-playwright] retained ${project}`);
  else rmSync(temporary, { recursive: true, force: true });
}
