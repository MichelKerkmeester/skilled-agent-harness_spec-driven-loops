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
const temporary = mkdtempSync(resolve(tmpdir(), 'supercov-rust-tsc-'));
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
  symlinkSync(
    resolve(repository, 'node_modules/typescript'),
    resolve(project, 'node_modules/typescript'),
  );
  symlinkSync(
    resolve(repository, 'node_modules/.bin/tsc'),
    resolve(project, 'node_modules/.bin/tsc'),
  );
  writeFileSync(
    resolve(project, 'package.json'),
    JSON.stringify({
      name: 'supercov-rust-tsc-fixture',
      private: true,
      type: 'module',
      scripts: {
        build: 'tsc -p tsconfig.json',
        test: 'node --test',
      },
    }) + '\n',
  );
  writeFileSync(
    resolve(project, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        rootDir: 'src',
        outDir: 'dist',
        strict: true,
      },
      include: ['src/**/*.ts'],
    }) + '\n',
  );
  const application = [
    // An executable entry: `#!` is only legal on the first line, and
    // TypeScript reports anything else as a parse error that no directive can
    // suppress, so instrumentation must never displace it.
    '#!/usr/bin/env node',
    'export function permission(admin: boolean, owner: boolean): string {',
    '  if (admin || owner) return "allowed";',
    '  return "denied";',
    '}',
    '',
    // Instrumentation rewrites conditions into sequences the compiler cannot
    // narrow through, so strict source only survives the build because the
    // instrumented copies are exempt from type checking.
    'export function label(value?: string): string {',
    '  if (!value) {',
    '    return "none";',
    '  }',
    '  return value.trim();',
    '}',
    '',
  ].join('\n');
  writeFileSync(resolve(project, 'src/permission.ts'), application);
  const tests = [
    "import assert from 'node:assert/strict';",
    "import test from 'node:test';",
    "import { label, permission } from '../dist/permission.js';",
    'for (const [name, admin, owner, expected] of [',
    "  ['admin', true, false, 'allowed'],",
    "  ['owner', false, true, 'allowed'],",
    "  ['both', true, true, 'allowed'],",
    "  ['neither', false, false, 'denied'],",
    ']) test(name, () => assert.equal(permission(admin, owner), expected));',
    "test('narrowed', () => assert.equal(label(' hi '), 'hi'));",
    "test('missing', () => assert.equal(label(), 'none'));",
    '',
  ].join('\n');
  writeFileSync(resolve(project, 'tests/permission.test.js'), tests);

  const run = rust('__run-js-direct', {
    root: project,
    command: ['npm', 'test'],
    runId: 'rust-generic-tsc',
    startedAt: '2026-08-25T00:00:07.000Z',
  });
  assert.equal(run.exitCode, 0, run.output);
  // One call site in the table-driven loop, one per narrowing test.
  assert.equal(run.assertionCalls, 3);
  assert.equal(readFileSync(resolve(project, 'src/permission.ts'), 'utf8'), application);
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
  assert.equal(summary.data.tests, 6);
  assert.equal(summary.data.coverage.conditionCoveragePct, 100);
  assert.equal(summary.data.coverage.lines.percentage, 100);
  assert.equal(summary.data.coverage.branches.percentage, 100);
  assert.equal(summary.data.confidence.lines.asserted, 0);
  assert.equal(summary.data.confidence.assertionCoveredMcdcConditions, 0);

  // A project may intentionally compile inside its test command. With no
  // separately declared build script this is a Direct adapter run, so its
  // instrumented TypeScript still needs the generated-source type exemption.
  const directProject = resolve(temporary, 'direct-project');
  mkdirSync(resolve(directProject, 'src'), { recursive: true });
  mkdirSync(resolve(directProject, 'tests'), { recursive: true });
  mkdirSync(resolve(directProject, 'node_modules/.bin'), { recursive: true });
  symlinkSync(
    resolve(repository, 'node_modules/typescript'),
    resolve(directProject, 'node_modules/typescript'),
  );
  symlinkSync(
    resolve(repository, 'node_modules/.bin/tsc'),
    resolve(directProject, 'node_modules/.bin/tsc'),
  );
  writeFileSync(
    resolve(directProject, 'package.json'),
    JSON.stringify({
      name: 'supercov-rust-direct-tsc-fixture',
      private: true,
      type: 'module',
      scripts: {
        test: 'tsc -p tsconfig.json && node --test',
      },
    }) + '\n',
  );
  writeFileSync(
    resolve(directProject, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        rootDir: 'src',
        outDir: 'dist',
        strict: true,
      },
      include: ['src/**/*.ts'],
    }) + '\n',
  );
  writeFileSync(resolve(directProject, 'src/permission.ts'), application);
  writeFileSync(resolve(directProject, 'tests/permission.test.js'), tests);

  const directRun = rust('__run-js-direct', {
    root: directProject,
    command: ['npm', 'test'],
    runId: 'rust-direct-tsc',
    startedAt: '2026-08-25T00:00:08.000Z',
  });
  assert.equal(directRun.exitCode, 0, directRun.output);
  assert.equal(directRun.assertionCalls, 3);
  assert.equal(
    readFileSync(resolve(directProject, 'src/permission.ts'), 'utf8'),
    application,
  );
  assert.equal(directRun.metadata.timings.instrumentedBuildMs, 0);
  const directSummary = rust('__query-stored-run', {
    root: directProject,
    query: {
      runId: directRun.runId,
      filter: 'passed',
      command: 'summary',
    },
  });
  assert.equal(directSummary.data.valid, true);
  assert.equal(directSummary.data.complete, true);
  assert.equal(directSummary.data.tests, 6);
  assert.equal(directSummary.data.coverage.lines.percentage, 100);
  assert.equal(directSummary.data.coverage.branches.percentage, 100);
  console.log(
    '[rust-generic-tsc] Rust preserves strict rootDir compilation for generic and direct commands with exact Node attribution',
  );
} finally {
  if (process.env.SUPERCOV_KEEP_FIXTURE === '1')
    console.error(`[rust-generic-tsc] retained ${project}`);
  else rmSync(temporary, { recursive: true, force: true });
}
