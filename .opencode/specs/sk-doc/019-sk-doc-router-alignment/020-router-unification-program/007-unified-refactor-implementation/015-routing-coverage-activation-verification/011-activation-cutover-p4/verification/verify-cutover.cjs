#!/usr/bin/env node
'use strict';

// Verification harness for the staged cutover controller. It proves — without
// flipping any default, rewriting any directive/catalog/template, or touching a
// manifest or the frozen scorer — that the controller behaves correctly and
// reversibly:
//   - the coverage-closure join gate runs and reports per-hub READY/BLOCKED with
//     honest blocking reasons;
//   - cohort resolution is exact (N advanced => N compiled under an unset flag)
//     and an explicit '0' forces legacy (kill-switch precedence);
//   - the per-hub gate sequence executes stop-on-first-failure and flips nothing;
//   - the '0' kill-switch forces legacy fleet-wide, and the committed rollback
//     drill restores a byte-identical prior manifest;
//   - the five non-hub archetypes stay legacy by construction;
//   - the three frozen scorer files are byte-identical before and after;
//   - the committed repository default remains off (flag unset, cohort empty,
//     manifests unchanged).
// A machine-readable evidence record with repo-relative provenance is emitted
// next to this harness.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ctrl = require('../controller/cutover-controller.cjs');

function sha256File(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}
function hashScorer() {
  const out = {};
  for (const name of Object.keys(ctrl.FROZEN_SCORER_PINS)) {
    out[name] = sha256File(path.join(ctrl.SCORER_DIR, name));
  }
  return out;
}
function scorerMatchesPins(digests) {
  return Object.entries(ctrl.FROZEN_SCORER_PINS).every(([name, pin]) => digests[name] === pin);
}
function runDrill(scriptPath) {
  try {
    const out = execFileSync('node', [scriptPath], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, tail: out.trim().split('\n').slice(-1)[0] || '' };
  } catch (err) {
    return { code: typeof err.status === 'number' ? err.status : 1, tail: `${err.stdout || ''}${err.stderr || ''}`.trim().split('\n').slice(-1)[0] || '' };
  }
}

function main() {
  const results = [];
  const rec = (label, pass, detail) => results.push({ label, pass, detail });

  // Frozen scorer digests captured before any controller work.
  const scorerBefore = hashScorer();
  rec('frozen-scorer baseline matches pins', scorerMatchesPins(scorerBefore),
    `router-replay=${scorerBefore['router-replay.cjs'].slice(0, 12)}`);

  // The join gate runs and reports per-hub READY/BLOCKED. A BLOCKED result while
  // the coverage/verification children are not all landed is the honest,
  // expected output — the check is that it RAN and reported, not that it is green.
  const jg = ctrl.perHubJoinGate();
  const blocked = jg.perHub.filter((h) => h.state === 'BLOCKED').length;
  rec('join-gate runs and reports per-hub state', Array.isArray(jg.perHub) && jg.perHub.length === 7,
    `gateGreen=${jg.gateGreen}; ${blocked}/7 BLOCKED; blockers=[${jg.blockingReasons.join(' | ')}]`);

  // Cohort resolution and kill-switch precedence.
  const cp = ctrl.cohortResolutionProof();
  rec('cohort resolution exact (N advanced => N compiled) + =0 precedence', cp.ok,
    `steps=${cp.steps.length} all-ok=${cp.ok}`);

  // Per-hub dry-run sequence executes and flips nothing.
  const dry = ctrl.RECOMMENDED_ORDER.map((h) => ctrl.runPerHubGateSequence(h, { dryRun: true }));
  const dryClean = dry.every((d) => d.dryRun === true && d.action.startsWith('none'));
  const dryGreen = dry.every((d) => d.allGreen === true);
  rec('per-hub dry-run gate sequence executes without flipping anything', dryClean,
    `hubs=${dry.length} allGreen=${dryGreen} action=none`);

  // Kill-switch drill: '0' forces legacy fleet-wide.
  const ks = ctrl.killSwitchDrill();
  rec('=0 kill-switch forces legacy fleet-wide', ks.ok,
    `allLegacyUnderKill=${ks.allLegacyUnderKill} controlServesUnderUnset=${ks.controlCohortServesUnderUnset}`);

  // Per-hub rollback restore byte-exact via the committed audit drill.
  const rb = runDrill(ctrl.ROLLBACK_DRILL);
  rec('per-hub rollback restores byte-exact prior manifest (committed drill)', rb.code === 0,
    `exit=${rb.code} :: ${rb.tail}`);

  // Non-hub archetypes stay legacy by construction via the committed fixtures.
  const nh = runDrill(ctrl.NON_HUB_FIXTURES);
  rec('five non-hub archetypes stay legacy by construction (committed fixtures)', nh.code === 0,
    `exit=${nh.code} :: ${nh.tail}`);

  // Frozen scorer byte-identical after all work.
  const scorerAfter = hashScorer();
  const scorerIdentical = Object.keys(scorerBefore).every((k) => scorerBefore[k] === scorerAfter[k])
    && scorerMatchesPins(scorerAfter);
  rec('frozen scorer byte-identical before and after', scorerIdentical, 'three digests unchanged');

  // Repository default unchanged.
  const rd = ctrl.repoDefaultUnchanged();
  rec('committed repo default unchanged (flag unset, cohort empty, manifests intact)',
    rd.ok && rd.flagInProcess === 'unset',
    `cohortEmptyOnDisk=${rd.cohortEmptyOnDisk} cohortEmptyInMemory=${rd.cohortEmptyInMemory} flag=${rd.flagInProcess}`);

  const failed = results.filter((r) => !r.pass);

  // Durable evidence with repo-relative provenance.
  const evidence = {
    generatedAt: new Date().toISOString(),
    provenance: { repoRelativeRoot: '.', harness: path.relative(ctrl.REPO_ROOT, __filename) },
    frozenScorer: { before: scorerBefore, after: scorerAfter, identical: scorerIdentical },
    joinGate: jg,
    cohortResolution: cp,
    perHubDryRun: dry,
    killSwitchDrill: ks,
    rollbackDrillExit: rb.code,
    nonHubFixturesExit: nh.code,
    repoDefault: rd,
    results,
    verdict: failed.length === 0 ? 'PASS' : 'FAIL',
  };
  const evidencePath = path.join(__dirname, 'dry-run-evidence.json');
  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);

  process.stdout.write('\nSTAGED CUTOVER CONTROLLER — DRY-RUN VERIFICATION\n');
  process.stdout.write('================================================\n');
  for (const r of results) {
    process.stdout.write(`  ${r.pass ? 'PASS' : 'FAIL'}  ${r.label}\n        ${r.detail}\n`);
  }
  process.stdout.write(`\nEvidence: ${path.relative(ctrl.REPO_ROOT, evidencePath)}\n`);
  process.stdout.write(`VERDICT: ${failed.length === 0 ? 'PASS' : 'FAIL'} (${results.length - failed.length}/${results.length})\n`);
  process.exit(failed.length === 0 ? 0 : 1);
}

if (require.main === module) {
  try { main(); } catch (err) { process.stderr.write(`VERIFY FAILED: ${err && err.stack || err}\n`); process.exit(1); }
}
