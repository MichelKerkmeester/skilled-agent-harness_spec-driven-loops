#!/usr/bin/env node
// Discover and run every Node test file in the live codebase.
//
// This exists because the repository has multiple Node test dialects and a fixed discovery
// contract is needed to keep live suites from silently falling out of the gate.
//
// Scope is the live runtime only. Vendored third-party code and archived fixtures under the
// spec tree carry their own suites with their own dependencies; running them here would fail
// for reasons that say nothing about this repository's health.
//
// Run: node .opencode/scripts/run-node-tests.mjs [--list]

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

// Live-code roots. The spec tree is excluded wholesale: everything under it that carries tests
// is either vendored external code or an archived experiment, and both fail for environmental
// reasons unrelated to the runtime being gated.
const ROOTS = ['.opencode/skills', '.opencode/scripts', '.opencode/plugins', '.opencode/bin', '.opencode/hooks'];
const EXCLUDED_SEGMENTS = new Set(['node_modules', 'external', '.worktrees', 'z_archive', 'z_future']);
const NODE_TEST_SUFFIXES = ['.test.mjs', '.test.cjs'];

function isNodeTestFile(filePath) {
  return NODE_TEST_SUFFIXES.some((suffix) => filePath.endsWith(suffix));
}

function discover(dir, found) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    if (EXCLUDED_SEGMENTS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) discover(full, found);
    else if (entry.isFile() && isNodeTestFile(entry.name)) found.push(full);
  }
  return found;
}

const all = ROOTS.flatMap((r) => discover(path.join(REPO_ROOT, r), [])).sort();

function independentGlob() {
  const output = execFileSync(
    'find',
    [
      ...ROOTS.map((root) => path.join(REPO_ROOT, root)),
      '-type', 'f',
      '(', '-name', '*.test.mjs', '-o', '-name', '*.test.cjs', ')',
    ],
    { encoding: 'utf8' },
  );
  return output
    .split('\n')
    .filter(Boolean)
    .map((filePath) => path.resolve(filePath))
    .filter((filePath) => {
      const relative = path.relative(REPO_ROOT, filePath);
      return !relative.split(path.sep).some((segment) => EXCLUDED_SEGMENTS.has(segment));
    })
    .sort();
}

const globbed = independentGlob();
const discoveredSet = new Set(all);
const globbedSet = new Set(globbed);
const missingFromRunner = globbed.filter((filePath) => !discoveredSet.has(filePath));
const extraInRunner = all.filter((filePath) => !globbedSet.has(filePath));
if (missingFromRunner.length > 0 || extraInRunner.length > 0 || all.length !== globbed.length) {
  console.error(
    `discovery canary failed: runner=${all.length} independent-glob=${globbed.length}`,
  );
  for (const filePath of missingFromRunner) console.error(`missing from runner: ${path.relative(REPO_ROOT, filePath)}`);
  for (const filePath of extraInRunner) console.error(`extra in runner: ${path.relative(REPO_ROOT, filePath)}`);
  process.exit(2);
}

// Two dialects share the extension. A vitest file hosted under `node --test` crashes on import
// and reads as a test failure, which is a lie in both directions — so partition by what the
// file actually imports rather than by what its name promises.
const isVitest = (f) => {
  try {
    return /from ['"]vitest['"]/.test(fs.readFileSync(f, 'utf8'));
  } catch {
    return false;
  }
};
const vitestFiles = all.filter(isVitest);
const nodeFiles = all.filter((f) => !vitestFiles.includes(f));

if (process.argv.includes('--list')) {
  for (const f of nodeFiles) console.log(`node:test  ${path.relative(REPO_ROOT, f)}`);
  for (const f of vitestFiles) console.log(`vitest     ${path.relative(REPO_ROOT, f)}`);
  process.exit(0);
}

if (all.length === 0) {
  console.error('no test files discovered — the discovery itself is broken, refusing to report success');
  process.exit(2);
}

let failed = false;

if (nodeFiles.length > 0) {
  const result = spawnSync('node', ['--test', ...nodeFiles], {
    cwd: REPO_ROOT,
    stdio: ['ignore', 'pipe', 'inherit'],
    encoding: 'utf8',
    timeout: 10 * 60 * 1000,
  });
  const out = result.stdout || '';
  const stat = (name) => Number((out.match(new RegExp(`^# ${name} (\\d+)`, 'm')) || [])[1] ?? NaN);
  const pass = stat('pass');
  const fail = stat('fail');
  for (const line of out.split('\n')) if (/^not ok /.test(line)) console.log(line);
  console.log(`node:test — ${nodeFiles.length} files · ${pass} pass · ${fail} fail`);
  // A run that produced no parseable summary is a broken run, not a green one.
  if (Number.isNaN(pass) || Number.isNaN(fail) || fail > 0) failed = true;
}

if (vitestFiles.length > 0) {
  const vitest = path.join(REPO_ROOT, '.opencode', 'node_modules', '.bin', 'vitest');
  if (fs.existsSync(vitest)) {
    const result = spawnSync(vitest, ['run', ...vitestFiles.map((f) => path.relative(path.join(REPO_ROOT, '.opencode'), f))], {
      cwd: path.join(REPO_ROOT, '.opencode'),
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8',
      timeout: 10 * 60 * 1000,
    });
    const out = `${result.stdout || ''}${result.stderr || ''}`;
    const m = out.match(/Tests\s+(?:(\d+) failed \| )?(\d+) passed/);
    const vFail = Number(m?.[1] ?? (result.status === 0 ? 0 : NaN));
    const vPass = Number(m?.[2] ?? NaN);
    console.log(`vitest    — ${vitestFiles.length} files · ${Number.isNaN(vPass) ? '?' : vPass} pass · ${Number.isNaN(vFail) ? '?' : vFail} fail`);
    if (Number.isNaN(vPass) || vFail > 0) failed = true;
  } else {
    // Reporting these as skipped keeps the silence visible instead of re-hiding it.
    console.log(`vitest    — ${vitestFiles.length} files SKIPPED (vitest not installed)`);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
