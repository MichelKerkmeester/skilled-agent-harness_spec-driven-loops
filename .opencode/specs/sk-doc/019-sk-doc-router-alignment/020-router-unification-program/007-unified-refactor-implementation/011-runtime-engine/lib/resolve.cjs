#!/usr/bin/env node
'use strict';

// Serving-authority resolver — the safety gate around the compiled engine.
//
// The compiled route is authoritative for a hub ONLY when both hold:
//   1. the runtime flag SPECKIT_COMPILED_ROUTING=1 is set (default off), and
//   2. the hub's activation manifest has serving authority flipped to 'compiled'.
//
// Otherwise `resolveRoute` returns null and the caller keeps legacy routing.
// This makes the cutover reversible two ways — unset the flag (fleet-wide) or
// flip a hub's serving authority back to 'legacy' (per hub) — and inert by
// default, so merely shipping this code changes nothing at runtime.

const fs = require('fs');
const path = require('path');
const { compiledRoute } = require('./compiled-route.cjs');

const ACTIVATION_ROOT = path.resolve(__dirname, '..', '..', '010-live-activation', 'activation');
const FLAG = 'SPECKIT_COMPILED_ROUTING';

function flagEnabled() {
  return process.env[FLAG] === '1';
}

function readManifest(hubId) {
  const manifest = path.join(ACTIVATION_ROOT, hubId, 'manifest.json');
  if (!fs.existsSync(manifest)) return null;
  try {
    return JSON.parse(fs.readFileSync(manifest, 'utf8'));
  } catch {
    return null;
  }
}

function servingAuthority(hubId) {
  const manifest = readManifest(hubId);
  return (manifest && manifest.servingAuthority) || 'legacy';
}

// Returns a normalized compiled decision when this hub is served by the compiled
// contract and the flag is on; otherwise null (use legacy routing). Fails safe:
// any error resolving the compiled route returns null rather than throwing into
// a routing hot path.
function resolveRoute(hubId, taskText) {
  if (!flagEnabled()) return null;
  const manifest = readManifest(hubId);
  if (!manifest || manifest.servingAuthority !== 'compiled') return null;
  try {
    const route = compiledRoute(hubId, taskText);
    // Serve-time identity binding: the snapshot we routed through MUST be the
    // exact generation the manifest selected. If a rollout artifact drifted after
    // the flip, the identities diverge — fail safe to legacy rather than serve an
    // unselected policy on the routing hot path.
    const selected = manifest.selectedPolicy || {};
    if (route.effectivePolicyHash !== selected.effectivePolicyHash
      || route.generation !== selected.generation) {
      return null;
    }
    return route;
  } catch {
    return null;
  }
}

module.exports = { resolveRoute, servingAuthority, flagEnabled, FLAG, ACTIVATION_ROOT };

// CLI front door: the invocable entry a compiled-serving hub's SKILL.md routing
// directive calls. Prints the compiled decision when authoritative, else a
// legacy sentinel so the caller falls back to the prose smart-router.
if (require.main === module) {
  const args = process.argv.slice(2);
  const hub = args[args.indexOf('--hub') + 1];
  const promptIdx = args.indexOf('--prompt');
  const prompt = promptIdx >= 0 ? args[promptIdx + 1] : '';
  if (!hub) {
    process.stderr.write('usage: resolve.cjs --hub <hubId> --prompt <text>\n');
    process.exit(2);
  }
  const route = resolveRoute(hub, prompt);
  process.stdout.write(`${JSON.stringify(route || { servingAuthority: 'legacy', hubId: hub })}\n`);
}
