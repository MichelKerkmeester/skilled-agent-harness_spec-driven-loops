#!/usr/bin/env node
'use strict';

// Runtime compiled-route engine.
//
// Routes a prompt through a hub's compiled policy using the same proven closed
// decision algebra the shadow canary validates (evaluateCanary over the hub's
// snapshot). The engine routes WITHIN a hub — it selects compiled destinations
// (modes/surfaces) when the prompt carries the policy's detector signals, and
// otherwise returns a `defer` decision (the correct conservative outcome), so a
// caller can fall back to legacy routing on ambiguous input.
//
// This module is pure and side-effect-free: it never flips serving authority
// and never edits a manifest. Whether its result is authoritative is decided by
// the resolver, which gates on the activation manifest and a runtime flag.

const fs = require('fs');
const path = require('path');

// Each hub's compiled policy + engine live in its shadow rollout child; this
// phase reuses them read-only rather than duplicating the compiled contract.
const IMPL_ROOT = path.resolve(__dirname, '..', '..');
const HUB_CHILD = Object.freeze({
  'sk-code': '006-parent-hub-rollout/001-sk-code',
  'system-deep-loop': '006-parent-hub-rollout/002-system-deep-loop',
  'mcp-tooling': '006-parent-hub-rollout/003-mcp-tooling',
  'cli-external-orchestration': '006-parent-hub-rollout/004-cli-external-orchestration',
  'sk-prompt': '006-parent-hub-rollout/005-sk-prompt',
  'sk-design': '006-parent-hub-rollout/006-sk-design',
  'sk-doc': '006-parent-hub-rollout/007-sk-doc',
});

// Process-lifetime engine cache. A hub's compiled snapshot + evaluate fn are
// loaded once and reused for the life of the process; a mid-process policy change
// is NOT picked up until the process is replaced. This is a deliberate contract,
// not a leak: it is safe because the resolver binds each served decision's identity
// (effectivePolicyHash + generation) to the activation manifest, so a snapshot that
// has drifted from the manifest fails the hub safe to legacy rather than serving a
// stale policy (see resolve.cjs). Long-running hosts pick up a new policy on restart.
const engineCache = new Map();

function loadHubEngine(hubId) {
  if (engineCache.has(hubId)) return engineCache.get(hubId);
  const child = HUB_CHILD[hubId];
  if (!child) throw new Error(`unknown hub: ${hubId}`);
  const childRoot = path.join(IMPL_ROOT, child);
  // Relative requires inside these modules resolve from their own location, so
  // reusing them from here keeps the compiled contract's dependency graph intact.
  const { loadSnapshot } = require(path.join(childRoot, 'harness', 'build-artifacts.cjs'));
  // Hubs ship one of two engine module shapes: the surfaceBundle canary-router
  // (evaluateCanary) or the plain router (evaluateRoute). Both take
  // (snapshot, input) and return a { decision } — pick whichever this hub has.
  const canaryRouter = path.join(childRoot, 'lib', 'canary-router.cjs');
  const plainRouter = path.join(childRoot, 'lib', 'router.cjs');
  const routerPath = fs.existsSync(canaryRouter) ? canaryRouter
    : (fs.existsSync(plainRouter) ? plainRouter : null);
  if (!routerPath) throw new Error(`no compiled router module for hub ${hubId}`);
  const routerMod = require(routerPath);
  // The export name varies by archetype (evaluateCanary or evaluateRoute); both
  // share the (snapshot, input) -> { decision } contract.
  const evaluate = routerMod.evaluateCanary || routerMod.evaluateRoute;
  if (typeof evaluate !== 'function') {
    throw new Error(`no evaluate function exported by ${routerPath} for hub ${hubId}`);
  }
  const { snapshot } = loadSnapshot();
  const engine = Object.freeze({ snapshot, evaluate });
  engineCache.set(hubId, engine);
  return engine;
}

function normalizeTargets(route) {
  if (!route || !Array.isArray(route.targets)) return [];
  return route.targets
    .map((t) => t.qualifiedId || t.destinationId || t.skillId || null)
    .filter(Boolean);
}

// Route `taskText` through hub `hubId`'s compiled contract. Returns a normalized,
// serializable decision as a discriminated union keyed on `action`: the route-only
// fields (`selectionKind`, `targets`) are present ONLY on a `route` decision. The
// negative decisions (clarify/defer/reject) carry no target and no selection kind,
// so a negative decision bearing a target is unrepresentable — matching the closed
// decision algebra the shadow canary validates.
function compiledRoute(hubId, taskText) {
  const { snapshot, evaluate } = loadHubEngine(hubId);
  const evaluated = evaluate(snapshot, { prompt: taskText });
  const decision = {
    hubId,
    action: evaluated.decision.action,
    effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    generation: snapshot.policy.activationGeneration,
  };
  if (decision.action === 'route') {
    const route = evaluated.decision.route || null;
    decision.selectionKind = route ? route.selectionKind : null;
    decision.targets = normalizeTargets(route);
  }
  return decision;
}

module.exports = { compiledRoute, loadHubEngine, HUB_CHILD };
