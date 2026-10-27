#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ ci-router-vocabulary-reach.test: the reach gate ranks the shipped fleet   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Proves the router reach check decides on the shipped fleet only. A private
 * surface an operator links into the skills root can tie or beat a shipped hub
 * on that one machine, and CI never sees it, so letting it fail the run made the
 * gate's verdict depend on what a checkout happens to link. These cases drive the
 * check against a stand-in advisor and assert three things: a private surface
 * ranked ahead of the declaring hub is a non-failing note, a private surface
 * cannot hide a shipped hub that really takes the phrase, and the private
 * surface's id never reaches the output.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS AND CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REPO = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');
const CHECK = path.join(REPO, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts', 'ci-router-vocabulary-reach.cjs');
const HUB = 'mcp-tooling';
const RIVAL = 'sk-code';
// Assembled at run time from the private-skill prefix, so this file names no
// private skill. The id only has to look like one to the check.
const PRIVATE_ID = ['local', 'fixture-surface'].join('-');
const SPAWN_TIMEOUT_MS = 300000;

assert.ok(fs.existsSync(CHECK), `reach check is missing: ${CHECK}`);

// A stand-in advisor that answers every phrase with the ranking in its scenario
// file, in the live envelope the check requires.
const FAKE_ADVISOR = `'use strict';
const fs = require('fs');
const recommendations = JSON.parse(fs.readFileSync(process.env.REACH_TEST_SCENARIO, 'utf8'));
process.stdout.write(JSON.stringify({
  data: {
    trustState: { state: 'live', generation: 7 },
    effectiveThresholds: { confidenceThreshold: 0.8 },
    recommendations,
  },
}));
`;

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEST HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function runCheck(recommendations, extraArgs = []) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'router-reach-'));
  try {
    const advisor = path.join(tmpDir, 'advisor.cjs');
    const scenario = path.join(tmpDir, 'scenario.json');
    fs.writeFileSync(advisor, FAKE_ADVISOR);
    fs.writeFileSync(scenario, JSON.stringify(recommendations));
    const env = { ...process.env, ROUTER_REACH_ADVISOR: advisor, REACH_TEST_SCENARIO: scenario };
    delete env.CI;
    return spawnSync(process.execPath, [CHECK, '--hub', HUB, ...extraArgs], {
      cwd: REPO,
      encoding: 'utf8',
      env,
      timeout: SPAWN_TIMEOUT_MS,
    });
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function detail(result) {
  return `status=${result.status} signal=${result.signal}\n${result.stdout}\n${result.stderr}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CASES
// ─────────────────────────────────────────────────────────────────────────────

// A private surface tying the declaring hub and sorted ahead of it is what an
// operator's machine produced for two shipped phrases. It is noted, not failed.
function testPrivateTieIsANote() {
  const result = runCheck([
    { skillId: PRIVATE_ID, confidence: 0.82 },
    { skillId: HUB, confidence: 0.82 },
  ]);
  assert.equal(result.status, 0, `a private tie must not fail the run\n${detail(result)}`);
  assert.match(result.stdout, /RESULT: PASSED/, detail(result));
  assert.match(result.stdout, /outranked=0,/, detail(result));
  assert.match(result.stdout, /operator-local=[1-9]\d*\n/, detail(result));
  assert.match(result.stdout, /note {7}.*operator-local=0\.8200, mcp-tooling=0\.8200/, detail(result));
  assert.ok(!result.stdout.includes(PRIVATE_ID) && !result.stderr.includes(PRIVATE_ID), `the private id leaked\n${detail(result)}`);
}

// The JSON report carries the same row kind and the same anonymity.
function testPrivateTieInJson() {
  const result = runCheck([
    { skillId: PRIVATE_ID, confidence: 0.84 },
    { skillId: HUB, confidence: 0.83 },
  ], ['--json']);
  assert.equal(result.status, 0, detail(result));
  const report = JSON.parse(result.stdout);
  const rows = report.flatMap((r) => r.unreachable);
  assert.ok(rows.length > 0 && rows.every((u) => u.kind === 'operator-local'), detail(result));
  assert.ok(!result.stdout.includes(PRIVATE_ID), `the private id leaked\n${detail(result)}`);
}

// Dropping the private surface must not hide a shipped hub that really takes
// the phrase: that is the defect the check exists to catch.
function testPrivateSurfaceCannotMaskAShippedWinner() {
  const result = runCheck([
    { skillId: PRIVATE_ID, confidence: 0.9 },
    { skillId: RIVAL, confidence: 0.85 },
    { skillId: HUB, confidence: 0.82 },
  ]);
  assert.equal(result.status, 1, `a shipped winner must still fail the run\n${detail(result)}`);
  assert.match(result.stdout, /RESULT: FAILED/, detail(result));
  assert.match(result.stdout, /outranked +\S.* sk-code=0\.8500, mcp-tooling=0\.8200/, detail(result));
  assert.ok(!result.stdout.includes(PRIVATE_ID), `the private id leaked\n${detail(result)}`);
}

// A private surface ranked behind the declaring hub changes nothing.
function testPrivateSurfaceBehindIsSilent() {
  const result = runCheck([
    { skillId: HUB, confidence: 0.9 },
    { skillId: PRIVATE_ID, confidence: 0.85 },
  ]);
  assert.equal(result.status, 0, detail(result));
  assert.match(result.stdout, /operator-local=0\n/, detail(result));
}

testPrivateTieIsANote();
testPrivateTieInJson();
testPrivateSurfaceCannotMaskAShippedWinner();
testPrivateSurfaceBehindIsSilent();

console.log('[sk-doc] router reach shipped-fleet ranking passed');
