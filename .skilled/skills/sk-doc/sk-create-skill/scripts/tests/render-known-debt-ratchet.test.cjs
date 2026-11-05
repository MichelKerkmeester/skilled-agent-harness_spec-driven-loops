#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ render-known-debt-ratchet — the debt ledger, its exempt map and the      ║
// ║ staged sets may only shrink, never grow, so the frozen snapshot is       ║
// ║ the ceiling every live entry faces                                       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Shrinking the debt, removing an exempt doc or retiring a staged code needs no
 * snapshot change; growing any of them means editing the frozen snapshot too,
 * which a reviewer sees.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const SCRIPTS_DIR = path.resolve(__dirname, '..');
const LIVE_LEDGER = path.join(SCRIPTS_DIR, 'render-known-debt.json');
const FROZEN_LEDGER = path.join(__dirname, 'fixtures', 'render-known-debt-frozen.json');

// The staged sets live in the packager, so reading them means importing it:
// a tuple reflowed across lines still yields the same list, which a source
// scrape would miss.
const STAGED_PROBE = [
  'import json, sys',
  `sys.path.insert(0, ${JSON.stringify(SCRIPTS_DIR)})`,
  'import package_skill',
  'print(json.dumps({"stagedCodes": list(package_skill.RENDER_STAGED_CODES),',
  '  "stagedScopes": list(package_skill.RENDER_STAGED_SCOPES)}))',
].join('\n');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readLedger(absolutePath) {
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function keyList(value) {
  if (Array.isArray(value)) return value;
  return isPlainObject(value) ? Object.keys(value) : [];
}

let stagedSets = null;

// The import spawns a Python interpreter, so one read serves every test.
function readStagedSets() {
  if (stagedSets !== null) return stagedSets;
  const output = execFileSync('python3', ['-c', STAGED_PROBE], {
    cwd: SCRIPTS_DIR,
    encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  stagedSets = JSON.parse(output);
  return stagedSets;
}

function liveState() {
  const ledger = readLedger(LIVE_LEDGER);
  const staged = readStagedSets();
  return {
    debt: isPlainObject(ledger.debt) ? ledger.debt : {},
    exempt: keyList(ledger.exempt).sort(),
    stagedCodes: staged.stagedCodes,
    stagedScopes: staged.stagedScopes,
  };
}

function loadPair() {
  return { live: liveState(), frozen: readLedger(FROZEN_LEDGER) };
}

// Every way `live` has widened the debt `frozen` records; an empty list means
// the debt, the exempt map and the staged sets held steady or shrank.
// Violations are collected rather than thrown so one run names every widened
// entry instead of stopping at the first.
function ledgerViolations(live, frozen) {
  const violations = [];
  const liveDebt = isPlainObject(live.debt) ? live.debt : {};
  const frozenDebt = isPlainObject(frozen.debt) ? frozen.debt : {};
  const frozenExempt = keyList(frozen.exempt);
  const frozenCodes = keyList(frozen.stagedCodes);
  const frozenScopes = keyList(frozen.stagedScopes);

  for (const [key, entry] of Object.entries(liveDebt)) {
    if (!Object.prototype.hasOwnProperty.call(frozenDebt, key)) {
      violations.push(`${key} is a new debt key`);
      continue;
    }
    if (!isPlainObject(entry)) {
      violations.push(`${key} must be an object, got ${JSON.stringify(entry)}`);
      continue;
    }
    const ceiling = isPlainObject(frozenDebt[key]) ? frozenDebt[key] : {};
    if (!Number.isInteger(entry.findings)) {
      violations.push(`${key}.findings must be an integer, got ${JSON.stringify(entry.findings)}`);
    } else if (Number.isInteger(ceiling.findings) && entry.findings > ceiling.findings) {
      violations.push(`${key}.findings rose from ${ceiling.findings} to ${entry.findings}`);
    }
    const ceilingCodes = keyList(ceiling.codes);
    for (const code of keyList(entry.codes)) {
      if (!ceilingCodes.includes(code)) violations.push(`${key}.codes gained ${code}`);
    }
  }

  for (const key of keyList(live.exempt)) {
    if (!frozenExempt.includes(key)) violations.push(`${key} is a new exempt doc`);
  }

  for (const code of keyList(live.stagedCodes)) {
    if (!frozenCodes.includes(code)) violations.push(`stagedCodes gained ${code}`);
  }

  for (const scope of keyList(live.stagedScopes)) {
    if (!frozenScopes.includes(scope)) violations.push(`stagedScopes gained ${scope}`);
  }

  return violations;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS — the live state stays within the frozen snapshot
// ─────────────────────────────────────────────────────────────────────────────

test('the live render ledger, exempt map and staged sets hold to the frozen snapshot', () => {
  const { live, frozen } = loadPair();
  const violations = ledgerViolations(live, frozen);
  assert.deepEqual(violations, [], `the live state widened the frozen snapshot: ${JSON.stringify(violations)}`);
});

test('a debt entry the snapshot does not record is a violation', () => {
  const { live, frozen } = loadPair();
  const grown = structuredClone(live);
  grown.debt['some-skill'] = { findings: 1, codes: ['render_bare_url'] };

  const violations = ledgerViolations(grown, frozen);
  assert.ok(
    violations.includes('some-skill is a new debt key'),
    `new debt entry not reported: ${JSON.stringify(violations)}`,
  );
});

test('an exempt doc the snapshot does not record is a violation', () => {
  const { live, frozen } = loadPair();
  const grown = structuredClone(live);
  grown.exempt = [...grown.exempt, 'some-skill/assets/some-doc.md'];

  const violations = ledgerViolations(grown, frozen);
  assert.ok(
    violations.includes('some-skill/assets/some-doc.md is a new exempt doc'),
    `new exempt doc not reported: ${JSON.stringify(violations)}`,
  );
});

test('a staged code the snapshot does not record is a violation', () => {
  const { live, frozen } = loadPair();
  const grown = structuredClone(live);
  grown.stagedCodes = [...grown.stagedCodes, 'render_repeated_label'];

  const violations = ledgerViolations(grown, frozen);
  assert.ok(
    violations.includes('stagedCodes gained render_repeated_label'),
    `new staged code not reported: ${JSON.stringify(violations)}`,
  );
});

test('retiring a staged code is not a violation', () => {
  // Every stage has retired, so the test stages two codes of its own and drops one.
  const { live, frozen } = loadPair();
  const staged = ['render_bold_label_join', 'render_bare_url'];
  const ceiling = { ...structuredClone(frozen), stagedCodes: staged };
  const shrunk = { ...structuredClone(live), stagedCodes: staged.slice(1) };

  assert.deepEqual(ledgerViolations(shrunk, ceiling), []);
});
