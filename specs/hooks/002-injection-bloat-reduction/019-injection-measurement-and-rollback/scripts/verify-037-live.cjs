'use strict';

const assert = require('node:assert/strict');
const { readFileSync, statSync } = require('node:fs');
const { dirname, join, resolve } = require('node:path');

const CORE_SOURCE = join(
  '.opencode',
  'skills',
  'system-spec-kit',
  'mcp-server',
  'hooks',
  'lib',
  'spec-gate',
  'spec-gate-core.mjs',
);

function workspaceRoot(start) {
  let current = resolve(start);
  for (;;) {
    try {
      if (statSync(join(current, CORE_SOURCE)).isFile()) return current;
    } catch {
      // Keep walking until the repository-owned source file is found.
    }
    const parent = dirname(current);
    if (parent === current) throw new Error(`Unable to locate ${CORE_SOURCE}`);
    current = parent;
  }
}

const source = readFileSync(join(workspaceRoot(__dirname), CORE_SOURCE), 'utf8');
const checks = {
  exported: /export function shouldSuppressGate3Delivery\s*\(/.test(source),
  calledByDeliveryObserver: /suppressionEligible\s*=\s*question\s*!==\s*null\s*&&\s*shouldSuppressGate3Delivery\s*\(/s.test(source),
  observedReceiptSeedsState: /gate3DeliveryConfirmed\(safeRequest\)[\s\S]*?GATE_3_DELIVERY_STATE\.set\(key,/s.test(source),
  readOnlyTurnStaysSilent: /state\.status === 'open' && isAnswerAttempt\(prompt\)[\s\S]*?return \{ status: state\.status === 'open' \? 'open' : 'closed', question: null \};/s.test(source),
};

for (const [name, passed] of Object.entries(checks)) {
  assert.equal(passed, true, `Gate delivery wiring check failed: ${name}`);
}

process.stdout.write(`${JSON.stringify({ status: 'pass', source: CORE_SOURCE, checks }, null, 2)}\n`);
