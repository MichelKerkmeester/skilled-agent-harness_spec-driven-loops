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

const engineCache = new Map();

function loadHubEngine(hubId) {
  if (engineCache.has(hubId)) return engineCache.get(hubId);
  const child = HUB_CHILD[hubId];
  if (!child) throw new Error(`unknown hub: ${hubId}`);
  const childRoot = path.join(IMPL_ROOT, child);
  // Relative requires inside these modules resolve from their own location, so
  // reusing them from here keeps the compiled contract's dependency graph intact.
  const { loadSnapshot } = require(path.join(childRoot, 'harness', 'build-artifacts.cjs'));
  const { evaluateCanary } = require(path.join(childRoot, 'lib', 'canary-router.cjs'));
  const { snapshot } = loadSnapshot();
  const engine = Object.freeze({ snapshot, evaluateCanary });
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
// serializable decision; `action` is one of route/clarify/defer/reject.
function compiledRoute(hubId, taskText) {
  const { snapshot, evaluateCanary } = loadHubEngine(hubId);
  const evaluated = evaluateCanary(snapshot, { prompt: taskText });
  const route = evaluated.decision.route || null;
  return {
    hubId,
    action: evaluated.decision.action,
    selectionKind: route ? route.selectionKind : null,
    targets: normalizeTargets(route),
    effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    generation: snapshot.policy.activationGeneration,
  };
}

module.exports = { compiledRoute, loadHubEngine, HUB_CHILD };
