#!/usr/bin/env node
'use strict';

// Catches the one compiled-routing failure that actually recurs: a hub's routing
// inputs get edited, nobody re-mints, the activation manifest silently goes stale,
// and that hub quietly falls back to legacy routing. Nothing errors, nothing logs,
// and the hub keeps answering — just not from the compiled policy anyone believes
// is serving. It has bitten repeatedly, each time discovered by accident.
//
// The freshness comparison already exists in the manifest library; this only gives
// it an exit code so a gate can use it.
//
// Two divergences are reported, because they fail differently:
//
//   stale manifest  — the runtime manifest no longer matches what the hub's current
//                     inputs compile to. That hub is serving legacy right now.
//   authored drift  — the promoted runtime manifest and its authored counterpart
//                     disagree. Serving is fine; reproducing it from source is not,
//                     because a rebuild would reinstate the authored copy.
//
// Usage:
//   compiled-route-guard.cjs              report and exit non-zero on any staleness
//   compiled-route-guard.cjs --warn-only  report but always exit 0
//   compiled-route-guard.cjs --json       machine-readable report

const fs = require('fs');
const path = require('path');

const layout = require('./lib/compiled-route-layout.cjs');
const { checkCanonicalManifestFreshness } = require('./lib/compiled-route-manifest.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const RUNTIME_ROOT = path.join(REPO_ROOT, '.opencode', 'bin', 'lib', 'compiled-routing');
const AUTHORED_ROOT = path.join(
  REPO_ROOT,
  '.opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program',
);
const SKILLS_ROOT = path.join(REPO_ROOT, '.opencode', 'skills');

const HUBS = [
  'cli-external-orchestration',
  'mcp-tooling',
  'sk-code',
  'sk-design',
  'sk-doc',
  'sk-prompt',
  'system-deep-loop',
];

function manifestPathIn(root, hubId) {
  try {
    return path.join(layout.activationRootFor(root), hubId, 'manifest.json');
  } catch {
    return null;
  }
}

// Byte comparison is deliberate: these are generated artifacts that are supposed to
// be copies of each other, so any difference at all means a rebuild would change
// what is being served.
function authoredDrift(hubId) {
  const runtimeManifest = manifestPathIn(RUNTIME_ROOT, hubId);
  const authoredManifest = manifestPathIn(AUTHORED_ROOT, hubId);
  if (!runtimeManifest || !authoredManifest) return null;
  if (!fs.existsSync(runtimeManifest) || !fs.existsSync(authoredManifest)) return null;
  return fs.readFileSync(runtimeManifest).equals(fs.readFileSync(authoredManifest))
    ? null
    : 'authored-drift';
}

function inspect(hubId) {
  const skillRoot = path.join(SKILLS_ROOT, hubId);
  let freshness;
  try {
    freshness = checkCanonicalManifestFreshness({ hubId, skillRoot });
  } catch (error) {
    return { hubId, ok: false, reason: 'inspect-failed', detail: error && error.message };
  }
  if (!freshness.manifestValid) {
    return { hubId, ok: false, reason: freshness.causeCode || 'invalid-manifest' };
  }
  if (!freshness.fresh) {
    // A hub whose inputs no longer compile cannot be re-minted at all, which is a
    // different problem from an input edit that simply needs a refresh.
    const reason = freshness.causeCode === 'compile-error' ? 'inputs-do-not-compile' : 'stale-manifest';
    return { hubId, ok: false, reason };
  }
  const drift = authoredDrift(hubId);
  if (drift) return { hubId, ok: false, reason: drift };
  return { hubId, ok: true, reason: 'fresh' };
}

function main() {
  const args = process.argv.slice(2);
  const warnOnly = args.includes('--warn-only');
  const asJson = args.includes('--json');

  const results = HUBS.map(inspect);
  const failures = results.filter((r) => !r.ok);

  if (asJson) {
    process.stdout.write(`${JSON.stringify({ results, failures: failures.length }, null, 2)}\n`);
  } else {
    for (const r of results) {
      process.stdout.write(`  ${r.hubId.padEnd(28)}${r.ok ? 'fresh' : r.reason}${r.detail ? ` (${r.detail})` : ''}\n`);
    }
    if (failures.length === 0) {
      process.stdout.write('\nAll hubs fresh: serving matches inputs, and the runtime matches its source.\n');
    } else {
      process.stdout.write(`\n${failures.length} hub(s) need attention.\n`);
      const stale = failures.filter((f) => f.reason === 'stale-manifest');
      if (stale.length > 0) {
        process.stdout.write(`Re-mint: ${stale.map((f) => f.hubId).join(', ')}\n`);
      }
      const drifted = failures.filter((f) => f.reason === 'authored-drift');
      if (drifted.length > 0) {
        process.stdout.write(`Runtime differs from its authored source (a rebuild would revert it): ${drifted.map((f) => f.hubId).join(', ')}\n`);
      }
      const broken = failures.filter((f) => f.reason === 'inputs-do-not-compile');
      if (broken.length > 0) {
        process.stdout.write(`Routing inputs do not compile, so these cannot be re-minted yet: ${broken.map((f) => f.hubId).join(', ')}\n`);
      }
    }
  }

  process.exit(warnOnly || failures.length === 0 ? 0 : 1);
}

if (require.main === module) main();

module.exports = { inspect, HUBS };
