// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Setup Orphan Line Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONTRACT TESTS
// ─────────────────────────────────────────────────────────────────────────────

const assetsPath = path.resolve(__dirname, '../../assets');
const setupYaml = fs.readFileSync(path.join(assetsPath, 'doctor-setup.yaml'), 'utf8');
const presentation = fs.readFileSync(
  path.join(assetsPath, 'doctor-setup-presentation.txt'),
  'utf8',
);

test('doctor setup prints the orphan summary as informational output', () => {
  assert.match(
    setupYaml,
    /Orphan processes \(informational, not a leg\): run node \.skilled\/commands\/doctor\/scripts\/orphan-process-check\.cjs --summary and show its line\./,
  );
  assert.match(setupYaml, /Its exit and output never change the status\./);
  assert.match(
    presentation,
    /\[orphans: N, about M MB; list them with node \.skilled\/commands\/doctor\/scripts\/orphan-process-check\.cjs --reap\]/,
  );
  assert.match(presentation, /With no orphan processes, print `orphans: none`\./);
  assert.match(presentation, /The orphan line is informational only and never changes the doctor status\./);
});
