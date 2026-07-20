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
const DEBUG_FLAG = 'SPECKIT_COMPILED_ROUTING_DEBUG';

// Per-hub default-on cohort. Ships empty and stays empty until the staged
// cutover adds hubs one at a time, so an unset flag resolves to legacy for
// every hub — byte-identical to the bi-state default this replaces.
const DEFAULT_ON_HUBS = new Set();

// Emit-only diagnostic. Gated behind an explicit debug flag and written to
// stderr, so it never reaches stdout (the routing channel) or the TUI.
function breadcrumb(message) {
  if (process.env[DEBUG_FLAG]) {
    process.stderr.write(`[compiled-routing] ${message}\n`);
  }
}

// Tri-state parse of the runtime flag:
//   'force-on'     '1'                    serve compiled where a hub is eligible
//   'force-legacy' '0' | 'false' | 'off'  explicit fleet-wide kill-switch
//   'default'      unset                  per-hub cohort decides (empty => legacy)
//   'invalid'      anything else          fail closed to legacy with a breadcrumb
function parseFlagMode(raw) {
  if (raw === undefined || raw === '') return 'default';
  if (raw === '1') return 'force-on';
  if (raw === '0' || raw === 'false' || raw === 'off') return 'force-legacy';
  return 'invalid';
}

// Whether the flag permits compiled serving for this hub. The manifest
// serving-authority gate in resolveRoute still applies on top of this, so a
// permitted hub without a compiled manifest still routes legacy.
function flagPermitsCompiled(hubId) {
  const mode = parseFlagMode(process.env[FLAG]);
  if (mode === 'force-on') return true;
  if (mode === 'default') return DEFAULT_ON_HUBS.has(hubId);
  if (mode === 'invalid') {
    breadcrumb(`ignoring invalid ${FLAG}=${JSON.stringify(process.env[FLAG])}; serving legacy`);
    return false;
  }
  return false; // force-legacy
}

// Retained export: true only when the operator forced the flag on, which is the
// exact bi-state meaning callers of this predicate relied on before tri-state.
function flagEnabled() {
  return parseFlagMode(process.env[FLAG]) === 'force-on';
}

function servingAuthority(hubId) {
  const manifest = path.join(ACTIVATION_ROOT, hubId, 'manifest.json');
  if (!fs.existsSync(manifest)) return 'legacy';
  try {
    return JSON.parse(fs.readFileSync(manifest, 'utf8')).servingAuthority || 'legacy';
  } catch {
    return 'legacy';
  }
}

// Returns a normalized compiled decision when this hub is served by the compiled
// contract and the flag is on; otherwise null (use legacy routing). Fails safe:
// any error resolving the compiled route returns null rather than throwing into
// a routing hot path.
function resolveRoute(hubId, taskText) {
  if (!flagPermitsCompiled(hubId)) return null;
  if (servingAuthority(hubId) !== 'compiled') return null;
  try {
    return compiledRoute(hubId, taskText);
  } catch (err) {
    breadcrumb(`resolveRoute fell back to legacy for hub=${hubId}: ${err && err.message}`);
    return null;
  }
}

module.exports = {
  resolveRoute,
  servingAuthority,
  flagEnabled,
  flagPermitsCompiled,
  parseFlagMode,
  DEFAULT_ON_HUBS,
  FLAG,
  DEBUG_FLAG,
  ACTIVATION_ROOT,
};

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
