import assert from 'node:assert/strict';

import { findUnactionedFailures } from './unactioned-recorded-failure-audit.mjs';

// 1. An unrouted recorded failure is surfaced (the deceptive class).
assert.ok(
  findUnactionedFailures('Scenario 063 FAILED: 17 flags missing from the reference table.').length >= 1,
  'unrouted FAIL should surface',
);

// 2. A recorded failure with a remediation link nearby is cleared.
assert.equal(
  findUnactionedFailures(
    [
      'Scenario 063 FAILED: 17 flags missing from the reference table.',
      'Remediated by 004-flag-table-single-source (catalog demoted to ENV_REFERENCE pointer).',
    ].join('\n'),
  ).length,
  0,
  'routed FAIL should not surface',
);

// 3. A contradiction routed to a spec folder is cleared.
assert.equal(
  findUnactionedFailures(
    'Iteration cap contradiction: config 20 vs strategy 40. Tracked in 014-recorded-failure-closure/spec.md.',
  ).length,
  0,
  'routed contradiction should not surface',
);

// 4. Clean text raises nothing.
assert.equal(
  findUnactionedFailures('All checks passed; validation green.').length,
  0,
  'clean text yields no hits',
);

console.log('OK: unactioned-recorded-failure surfacer — 4/4 assertions passed');
