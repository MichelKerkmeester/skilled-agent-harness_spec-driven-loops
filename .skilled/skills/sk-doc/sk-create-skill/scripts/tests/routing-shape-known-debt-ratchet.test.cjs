#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ routing-shape-known-debt-ratchet — the debt ledger may shrink, never     ║
// ║ grow, so the frozen snapshot is the ceiling every live entry faces        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Shrinking an entry or removing a key needs no snapshot change; growing one
 * means editing the frozen snapshot too, which a reviewer sees.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const LIVE_LEDGER = path.resolve(__dirname, '..', 'routing-shape-known-debt.json');
const FROZEN_LEDGER = path.join(__dirname, 'fixtures', 'routing-shape-known-debt-frozen.json');

const CEILING_FIELDS = ['maxSmartRoutingLines', 'maxSmartRoutingWords'];
const COUNT_FIELDS = ['lines', 'words', 'machineBlocks'];

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readLedger(absolutePath) {
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function loadPair() {
  return { live: readLedger(LIVE_LEDGER), frozen: readLedger(FROZEN_LEDGER) };
}

// Every way `live` has widened the debt `frozen` records; an empty list means
// the ledger held steady or shrank. Violations are collected rather than thrown
// so one run names every widened entry instead of stopping at the first.
function ledgerViolations(live, frozen) {
  const violations = [];
  const liveDebt = isPlainObject(live.debt) ? live.debt : {};
  const frozenDebt = isPlainObject(frozen.debt) ? frozen.debt : {};

  for (const field of CEILING_FIELDS) {
    if (!Number.isInteger(live[field])) {
      violations.push(`${field} must be an integer, got ${JSON.stringify(live[field])}`);
    } else if (Number.isInteger(frozen[field]) && live[field] > frozen[field]) {
      violations.push(`${field} rose from ${frozen[field]} to ${live[field]}`);
    }
  }

  for (const [key, entry] of Object.entries(liveDebt)) {
    if (!Object.prototype.hasOwnProperty.call(frozenDebt, key)) {
      violations.push(`${key} is a new debt key`);
      continue;
    }
    if (!isPlainObject(entry)) {
      violations.push(`${key} must be an object, got ${JSON.stringify(entry)}`);
      continue;
    }
    const ceiling = frozenDebt[key];
    for (const field of COUNT_FIELDS) {
      if (!Number.isInteger(entry[field])) {
        violations.push(`${key}.${field} must be an integer, got ${JSON.stringify(entry[field])}`);
      } else if (Number.isInteger(ceiling[field]) && entry[field] > ceiling[field]) {
        violations.push(`${key}.${field} rose from ${ceiling[field]} to ${entry[field]}`);
      }
    }
    if (!Array.isArray(entry.codes)) {
      violations.push(`${key}.codes must be an array, got ${JSON.stringify(entry.codes)}`);
      continue;
    }
    const ceilingCodes = Array.isArray(ceiling.codes) ? ceiling.codes : [];
    for (const code of entry.codes) {
      if (!ceilingCodes.includes(code)) violations.push(`${key}.codes gained ${code}`);
    }
  }

  return violations;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS — the live ledger stays within the frozen snapshot
// ─────────────────────────────────────────────────────────────────────────────

test('routing ceilings are integers no larger than the frozen snapshot', () => {
  const { live, frozen } = loadPair();
  for (const field of CEILING_FIELDS) {
    assert.ok(Number.isInteger(live[field]), `live ${field} must be an integer, got ${JSON.stringify(live[field])}`);
    assert.ok(Number.isInteger(frozen[field]), `frozen ${field} must be an integer, got ${JSON.stringify(frozen[field])}`);
    assert.ok(live[field] <= frozen[field], `live ${field} rose from ${frozen[field]} to ${live[field]}`);
  }
});

test('every live debt key is already in the frozen snapshot', () => {
  const { live, frozen } = loadPair();
  const frozenDebt = isPlainObject(frozen.debt) ? frozen.debt : {};
  for (const key of Object.keys(isPlainObject(live.debt) ? live.debt : {})) {
    assert.ok(
      Object.prototype.hasOwnProperty.call(frozenDebt, key),
      `${key} is a new debt key; the ledger may only shrink, so the frozen snapshot must not gain it`,
    );
  }
});

test('every live debt entry holds integers and codes within the frozen entry', () => {
  const { live, frozen } = loadPair();
  const liveDebt = isPlainObject(live.debt) ? live.debt : {};
  const frozenDebt = isPlainObject(frozen.debt) ? frozen.debt : {};
  for (const [key, entry] of Object.entries(liveDebt)) {
    assert.ok(isPlainObject(entry), `${key} must be an object, got ${JSON.stringify(entry)}`);
    const ceiling = frozenDebt[key];
    assert.ok(isPlainObject(ceiling), `${key} must exist in the frozen snapshot to be compared`);
    for (const field of COUNT_FIELDS) {
      assert.ok(Number.isInteger(entry[field]), `${key}.${field} must be an integer, got ${JSON.stringify(entry[field])}`);
      assert.ok(Number.isInteger(ceiling[field]), `frozen ${key}.${field} must be an integer, got ${JSON.stringify(ceiling[field])}`);
      assert.ok(entry[field] <= ceiling[field], `${key}.${field} rose from ${ceiling[field]} to ${entry[field]}`);
    }
    assert.ok(Array.isArray(entry.codes), `${key}.codes must be an array, got ${JSON.stringify(entry.codes)}`);
    const ceilingCodes = Array.isArray(ceiling.codes) ? ceiling.codes : [];
    for (const code of entry.codes) {
      assert.ok(ceilingCodes.includes(code), `${key}.codes gained ${code}, which the frozen snapshot does not record`);
    }
  }
});

test('the ratchet helper names a new key, a raised count and a new code', () => {
  const frozen = {
    maxSmartRoutingLines: 12,
    maxSmartRoutingWords: 180,
    debt: {
      alpha: { lines: 10, words: 100, machineBlocks: 0, codes: ['RS-001'] },
    },
  };
  const live = {
    maxSmartRoutingLines: 12,
    maxSmartRoutingWords: 180,
    debt: {
      alpha: { lines: 11, words: 100, machineBlocks: 0, codes: ['RS-001', 'RS-002'] },
      beta: { lines: 1, words: 1, machineBlocks: 0, codes: [] },
    },
  };

  const violations = ledgerViolations(live, frozen);
  assert.equal(violations.length, 3, `expected three violations, got ${JSON.stringify(violations)}`);
  assert.ok(violations.includes('beta is a new debt key'), `new key not reported: ${JSON.stringify(violations)}`);
  assert.ok(
    violations.includes('alpha.lines rose from 10 to 11'),
    `raised count not reported: ${JSON.stringify(violations)}`,
  );
  assert.ok(
    violations.includes('alpha.codes gained RS-002'),
    `new code not reported: ${JSON.stringify(violations)}`,
  );
});
