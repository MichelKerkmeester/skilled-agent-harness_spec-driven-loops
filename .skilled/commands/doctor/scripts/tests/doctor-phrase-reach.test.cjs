#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Phrase Reach Probe Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the probe as a process, so each verdict is observed through its exit code
// and output. The passing run scores the repository's own route manifest against the
// built advisor. The stale-build run uses a throwaway copy of the probe whose
// freshness library reports a stale build, so no real build is touched.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '..', 'doctor-phrase-reach.cjs');

// The probe resolves these from its own folder, so a copy placed at SCRIPT_COPY
// inside a throwaway root reads the stubs below instead of the repository.
const SCRIPT_COPY = '.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs';
const FRESHNESS_LIB = '.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs';
const BUILT_SCORER = '.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/scorer/fusion.js';

function runProbe(script, args = []) {
  return spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
}

function writeFile(root, rel, body) {
  const abs = path.join(root, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, body);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('every admitted phrase reaches its bridge on the built advisor', () => {
  const result = runProbe(SCRIPT, ['--json']);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, 'ok');
  assert.equal(report.missed, 0);
  assert.ok(report.bridges > 0);
  assert.equal(report.phrases, report.rows.length);
});

test('a stale build exits 2 and prints no reach verdict', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'doctor-phrase-reach-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeFile(root, SCRIPT_COPY, fs.readFileSync(SCRIPT, 'utf8'));
  writeFile(root, BUILT_SCORER, '');
  writeFile(root, FRESHNESS_LIB, [
    'module.exports = {',
    "  checkPackageFreshness: () => ({ status: 'stale', message: 'stub build is older than its source' }),",
    '};',
    '',
  ].join('\n'));

  const result = runProbe(path.join(root, SCRIPT_COPY));
  assert.equal(result.status, 2);
  assert.match(result.stderr, /stub build is older than its source/);
  assert.doesNotMatch(result.stdout, /STATUS=/);
});
