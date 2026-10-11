#!/usr/bin/env node
/**
 * Standing proof that each command-line entry point refuses a misspelled flag instead of
 * ignoring it.
 *
 * An unknown argument that is silently dropped turns a typo into a different run: "--chek"
 * renders screenshots where the caller asked for a coverage check, and a misspelled "--extra"
 * lets a corpus check pass while the directory it was pointed at goes unread. Each case asks
 * one script for the refusal, requires the message to name the flag it refused, and checks
 * the side effect that must not have happened.
 */

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { spawnSync } = require('node:child_process');

// The test file sits three levels below the skill root: tests, scripts, the chart packet.
const SKILL = path.resolve(__dirname, '..', '..', '..');
const RENDER_SCREENSHOTS = path.join(SKILL, 'shared', 'scripts', 'render-screenshots.cjs');
const CHECK_CORPUS = path.join(SKILL, 'sk-design-chart', 'scripts', 'check-corpus.cjs');
const CHECK_DIAGRAM_CORPUS = path.join(SKILL, 'sk-design-diagram', 'scripts', 'check-diagram-corpus.cjs');

// A misspelled flag must be answered before any real work starts, so the spawn budget only has
// to cover a usage error; the generous bound is there so a script that ignores the flag and
// runs its full check fails on the assertions rather than on the clock.
const SPAWN_TIMEOUT_MS = 120000;

function runScript(script, args) {
  const result = spawnSync(process.execPath, [script, ...args], {
    encoding: 'utf8',
    timeout: SPAWN_TIMEOUT_MS,
  });
  const output = `${result.stdout || ''}${result.stderr || ''}${result.error ? result.error.message : ''}`;
  return { status: result.status, output };
}

function filesEndingWith(root, suffix) {
  const found = [];
  (function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(suffix)) found.push(full);
    }
  })(root);
  return found;
}

test('render-screenshots.cjs refuses a misspelled --check and captures no screenshots', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'typo-flags-'));
  try {
    const assets = path.join(directory, 'assets');
    const out = path.join(directory, 'out');
    fs.mkdirSync(assets);
    fs.mkdirSync(out);
    fs.writeFileSync(path.join(assets, 'page.html'), '<!doctype html><title>x</title><p>x</p>', 'utf8');

    const { status, output } = runScript(RENDER_SCREENSHOTS, [assets, out, '--chek']);
    assert.equal(status, 2, `expected a usage error naming --chek, got exit ${status}:\n${output}`);
    assert.ok(output.includes('--chek'), `the usage error does not name the flag it refused:\n${output}`);
    const captured = filesEndingWith(out, '.png');
    assert.deepEqual(captured, [],
      `a refused flag still left screenshots behind:\n  ${captured.join('\n  ')}`);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('check-corpus.cjs refuses a misspelled flag instead of running the check', () => {
  const { status, output } = runScript(CHECK_CORPUS, ['--bogus-xyz']);
  assert.equal(status, 2, `expected a usage error naming --bogus-xyz, got exit ${status}:\n${output}`);
  assert.ok(output.includes('--bogus-xyz'), `the usage error does not name the flag it refused:\n${output}`);
});

test('check-diagram-corpus.cjs refuses a misspelled --extra instead of running the check', () => {
  const { status, output } = runScript(CHECK_DIAGRAM_CORPUS, ['--exta', '/nonexistent']);
  assert.equal(status, 2, `expected a usage error naming --exta, got exit ${status}:\n${output}`);
  assert.ok(output.includes('--exta'), `the usage error does not name the flag it refused:\n${output}`);
});
