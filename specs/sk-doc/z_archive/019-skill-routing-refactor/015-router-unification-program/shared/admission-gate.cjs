#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Admission Gate
// ───────────────────────────────────────────────────────────────
//
// Activation and the serving flip both refuse a hub whose compiled decisions do
// not satisfy the routing gold its own playbook authors. The check itself is the
// compiled-serving admission checker in the source root's bin; this module only
// runs it for one hub and turns anything short of a `pass` verdict into a throw.
//
// It replaced each hub's canary validator, which pinned and scored through
// modules retired with the benchmark lane and pinned authored sources that have
// since moved, so it could no longer pass for any hub.
//
// Usage:
//   assertAdmissionPasses(repoRoot, hubId)  -> { admissionPassed, verdict, pass }

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const SOURCE_ROOT_NAMES = ['.skilled', '.opencode'];
const CHECKER_SUBPATH = path.join('bin', 'compiled-route-admission.cjs');

function admissionCheckerPath(repoRoot) {
  for (const name of SOURCE_ROOT_NAMES) {
    const candidate = path.join(repoRoot, name, CHECKER_SUBPATH);
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error(`compiled-serving admission checker not found under ${repoRoot}`);
}

/**
 * Require one hub to pass the compiled-serving admission check.
 *
 * @param {string} repoRoot - Absolute repository root.
 * @param {string} hubId - Hub to check.
 * @returns {{admissionPassed: true, verdict: string, pass: number}} The passing result.
 */
function assertAdmissionPasses(repoRoot, hubId) {
  const checker = admissionCheckerPath(repoRoot);
  const result = spawnSync(process.execPath, [checker, '--hub', hubId, '--json'], { encoding: 'utf8' });
  let hub = null;
  try {
    hub = JSON.parse(result.stdout).hubs[0];
  } catch {
    hub = null;
  }
  if (!hub || hub.verdict !== 'pass' || result.status !== 0) {
    const reason = hub ? `verdict ${hub.verdict}` : `checker exited ${result.status}: ${(result.stderr || '').trim()}`;
    throw new Error(`${hubId} does not pass the compiled-serving admission check (${reason})`);
  }
  return { admissionPassed: true, verdict: hub.verdict, pass: hub.counts.pass };
}

module.exports = { assertAdmissionPasses };
