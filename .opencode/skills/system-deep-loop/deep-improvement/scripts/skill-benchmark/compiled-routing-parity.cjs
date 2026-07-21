#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ compiled-routing-parity — Lane C compiled-vs-legacy parity (non-frozen)  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * compiled-routing-parity.cjs — prove the compiled routing decision matches the
 * legacy decision on a scenario, WITHOUT re-implementing any scoring judgment.
 *
 * This is a non-frozen sibling of the frozen scorer trio. It never edits those
 * files; it only re-hashes them (as a precondition), translates the compiled
 * decision into the legacy evaluator's vocabulary, and delegates the verdict to
 * the frozen `evaluateRouteGold` unchanged. Three guards keep the comparison
 * honest:
 *
 *   1. Vacuous-parity guard. The runtime flag alone is insufficient — the
 *      resolver serves compiled ONLY when the hub's activation manifest also
 *      reads `servingAuthority: compiled`. A lane that trusted the flag would
 *      read a legacy fallback as a false "parity" pass, so this reads the hub's
 *      manifest directly and hard-fails `vacuous` on anything but `compiled`.
 *   2. Shape bridge. Compiled emits qualified destination ids; the frozen
 *      evaluator reads legacy `observedResources`. The two vocabularies are
 *      incompatible without translation, so every target is resolved through the
 *      shared `qualifiedIdToLeaf` boundary before the frozen evaluator runs. A
 *      target that resolves to no manifest mode fails closed, never a silent skip.
 *      A resolved leaf is packet-qualified to match legacy's own hub-relative
 *      convention, then projected down to legacy's own observed granularity for
 *      the gold comparison -- a leaf-manifest declares a whole mode's possible
 *      leaves, legacy's replay selects a task-scoped subset of them, and an
 *      unconditional hub-level resource belongs to no packet's declaration at
 *      all -- so a compiled target's declared breadth is never mistaken for
 *      task-scoped precision, and a genuine compiled declaration gap still
 *      fails closed.
 *   3. Frozen-scorer pin. The three shared scorer files are re-hashed against
 *      pinned digests before any comparison; drift aborts before evidence is
 *      written, so a scorer edited out from under a run never produces a report.
 *
 * The parity status is one of match / drift / vacuous / n/a / resolver-missing;
 * only `match` counts as a pass and `n/a` is informational (a hub that is
 * route-gold enforced but not in the compiled serving closure). The run-level
 * verdict sub-state that these statuses roll up into lives in the orchestrator,
 * never here and never in the frozen scorer.
 *
 * Pure: given its inputs plus the on-disk manifest and compiled artifacts, it
 * makes no network call and no clock-dependent branch. Every external seam
 * (hub eligibility, manifest read, compiled decision, manifest mode index) is an
 * injectable dependency with a production default, so the whole status space is
 * exercisable from fixtures without a live fleet.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

// The shared identity contract owns the single conversion boundary from a
// compiled qualified id to the manifest mode that declares its leaves. Consumed,
// never redefined, so this harness and the drift guards agree byte for byte.
const { qualifiedIdToLeaf } = require(
  path.join(__dirname, '..', '..', '..', '..', 'sk-doc', 'create-skill', 'scripts', 'lib', 'leaf-resource-contract.cjs'),
);

// The frozen evaluator is the sole authority for legacy route-gold scoring. It
// is called, never re-implemented: this harness only feeds it a translated
// observed decision and compares its verdicts.
const { evaluateRouteGold } = require('./score-skill-benchmark.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The promoted runtime closure — what actually serves. The vacuous-parity guard
// and the compiled engine both read here, never the spec tree, so the harness
// reflects the routing the fleet would really perform.
const SKILLS_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const RUNTIME_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..', 'bin', 'lib', 'compiled-routing');
const ACTIVATION_ROOT = path.join(RUNTIME_ROOT, '010-live-activation', 'activation');
const SERVING_CLOSURE_MANIFEST = path.join(RUNTIME_ROOT, 'serving-closure.manifest.json');
const PROMOTED_ENGINE = path.join(RUNTIME_ROOT, '011-runtime-engine', 'lib', 'compiled-route.cjs');
const PROMOTED_RESOLVER = path.join(RUNTIME_ROOT, '011-runtime-engine', 'lib', 'resolve.cjs');
const PUBLIC_FRONT_DOOR = path.resolve(RUNTIME_ROOT, '..', '..', 'compiled-route.cjs');
const STATUS_PROBE = path.resolve(RUNTIME_ROOT, '..', '..', 'compiled-route-status.cjs');

// Pinned digests of the frozen scorer trio. Re-hashed before every parity run;
// any drift aborts before a report is written, so the parity baseline can never
// be scored against a scorer that changed mid-flight. These are the same digests
// the activation driver refuses to run without.
const PINNED_FROZEN_SCORER_DIGESTS = Object.freeze({
  'router-replay.cjs': 'd5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47',
  'score-skill-benchmark.cjs': 'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
  'load-playbook-scenarios.cjs': '5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029',
});

// Per-scenario parity status. Only `match` is a pass; `n/a` is informational
// (route-gold enforced but the hub is outside the compiled serving closure);
// every other value blocks once it rolls up.
const PARITY_STATUS = Object.freeze({
  MATCH: 'match',
  DRIFT: 'drift',
  VACUOUS: 'vacuous',
  NA: 'n/a',
  RESOLVER_MISSING: 'resolver-missing',
});

// Run-level verdict sub-state the orchestrator inspects before deciding the
// outer verdict. Kept distinct so drift and a structurally broken compiled path
// never collapse into one opaque BLOCKED.
const COMPILED_SUBVERDICT = Object.freeze({
  SERVING: 'compiled-serving',
  DRIFTED: 'legacy-fallback-drifted',
  BROKEN: 'broken-compiled-path',
  NA: 'n/a',
});

// The single blocking drift-gate owner. Every other consumer of this
// classification (for example a registry-drift CI workflow) reports it and
// never independently blocks, so two gates can never disagree or both abstain.
const DRIFT_GATE_OWNER = 'lane-c-compiled-parity';
const DRIFT_GATE_REPORT_ONLY_CONSUMERS = Object.freeze(['routing-registry-drift-ci']);

// Outer verdicts a compiled block is allowed to raise. A compiled drift or
// broken path takes over only a non-blocked verdict; an existing structural,
// registry, or route-gold block outranks it and stays, so those distinct causes
// never collapse into one another.
const COMPILED_OVERRIDABLE_VERDICTS = Object.freeze(new Set(['PASS', 'CONDITIONAL', 'FAIL', 'NO-SCENARIOS']));

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

let eligibleHubsCache = null;

/**
 * The set of hubs in the compiled serving closure — the only hubs where a
 * missing compiled parity is a real gap rather than structurally `n/a`. Read
 * from the promoted closure manifest, cached, with the promoted runtime's
 * exported hub map as the only fallback. No benchmark-local allowlist exists.
 *
 * @param {string} [manifestPath] - Serving-closure manifest path (override for tests).
 * @returns {Set<string>} Hub ids eligible for compiled parity.
 */
function loadEligibleHubs(manifestPath = SERVING_CLOSURE_MANIFEST) {
  if (manifestPath === SERVING_CLOSURE_MANIFEST && eligibleHubsCache) return eligibleHubsCache;
  let hubs = [];
  try {
    const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (Array.isArray(parsed.hubs) && parsed.hubs.length) hubs = parsed.hubs;
  } catch {
    try {
      const runtime = require(PROMOTED_ENGINE);
      hubs = runtime && runtime.HUB_CHILD ? Object.keys(runtime.HUB_CHILD) : [];
    } catch {
      hubs = [];
    }
  }
  const set = new Set(hubs);
  if (manifestPath === SERVING_CLOSURE_MANIFEST) eligibleHubsCache = set;
  return set;
}

/**
 * Read a hub's live serving authority straight from its activation manifest.
 * Returns 'compiled', 'legacy', or null when the manifest is missing/unreadable
 * (which the guard treats as vacuous, never a pass).
 *
 * @param {string} hubId - Hub id.
 * @param {string} [activationRoot] - Activation root (override for tests).
 * @returns {string|null} Serving authority, or null when unreadable.
 */
function runJsonChild(scriptPath, args, envOverrides = {}) {
  const parentFlag = process.env.SPECKIT_COMPILED_ROUTING;
  const result = spawnSync(
    process.execPath,
    [scriptPath, ...args],
    {
      env: { ...process.env, ...envOverrides },
      encoding: 'utf8',
      shell: false,
    },
  );
  if (process.env.SPECKIT_COMPILED_ROUTING !== parentFlag) {
    throw new Error('compiled child mutated the parent routing flag');
  }
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `child exited ${result.status}`);
  }
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error(`invalid JSON from ${path.basename(scriptPath)}`);
  }
}

/**
 * Produce the compiled routing decision for a hub + prompt through the promoted
 * runtime engine. A load or route throw is surfaced (not swallowed) so the
 * caller can classify it as a broken compiled path rather than a false pass.
 *
 * @param {string} hubId - Hub id.
 * @param {string} taskText - Scenario prompt.
 * @returns {Object} Normalized compiled decision ({ action, targets, ... }).
 */
function defaultCompiledDecision(hubId, taskText) {
  return runJsonChild(
    PUBLIC_FRONT_DOOR,
    ['--hub', hubId, '--prompt', taskText],
    { SPECKIT_COMPILED_ROUTING: '1' },
  );
}

function defaultProbeStatus(hubId) {
  return runJsonChild(
    STATUS_PROBE,
    ['--hub', hubId, '--no-probe'],
    { SPECKIT_COMPILED_ROUTING: '1' },
  );
}

const modeIndexCache = new Map();

/**
 * Build a hub's manifest mode index (workflowMode -> mode entry with its leaves)
 * from its committed leaf-manifest, keyed by hub id. A compiled target names its
 * destination hub, which may differ from the benchmarked hub (a hub legitimately
 * routes across to another hub's mode), so the index is resolved per target hub,
 * never assumed to be the benchmarked skill's. Returns an empty index when the
 * hub ships no manifest.
 *
 * @param {string} hubId - Destination hub id.
 * @returns {Object<string,Object>} workflowMode -> mode entry.
 */
function defaultLoadModeIndex(hubId) {
  if (modeIndexCache.has(hubId)) return modeIndexCache.get(hubId);
  const index = {};
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(SKILLS_ROOT, hubId, 'leaf-manifest.json'), 'utf8'));
    for (const mode of manifest.modes || []) {
      if (mode && mode.workflowMode) index[mode.workflowMode] = mode;
    }
  } catch {
    // No manifest for this hub: leave the index empty so its targets fail closed.
  }
  try {
    const registry = JSON.parse(fs.readFileSync(path.join(SKILLS_ROOT, hubId, 'mode-registry.json'), 'utf8'));
    for (const mode of registry.modes || []) {
      if (!mode || !mode.workflowMode) continue;
      index[mode.workflowMode] = { ...(index[mode.workflowMode] || {}), ...mode };
    }
  } catch {
    // A missing registry leaves the leaf-only index intact.
  }
  modeIndexCache.set(hubId, index);
  return index;
}

/**
 * Compose a compiled target's qualified id string. A target is either an
 * already-qualified string or a decomposed object; both encode the same
 * `<hub>/<workflowMode>/<packet>/<kind>/<slug>` identity.
 *
 * @param {(string|Object)} target - Compiled decision target.
 * @returns {string} Qualified id.
 */
function qualifiedIdOf(target) {
  if (typeof target === 'string') return target;
  if (target && typeof target === 'object') {
    if (typeof target.qualifiedId === 'string' && target.qualifiedId) return target.qualifiedId;
    return [target.skillId, target.workflowMode, target.packetId, target.packetKind, target.backendKind]
      .filter((segment) => segment != null && segment !== '')
      .join('/');
  }
  return String(target);
}

/**
 * Translate compiled decision targets into a legacy-shaped observed decision by
 * resolving each qualified id through the shared contract. The observed intents
 * are the resolved workflow modes; the observed resources are the manifest
 * leaves those modes declare, packet-qualified (`<packet>/<leaf>`) to match
 * legacy's own hub-relative addressing -- a leaf-manifest records leaves
 * packet-root-relative (`references/...`), but every router resource map in
 * this codebase (hub-router.json pointers, a retained smart-routing.md
 * RESOURCE_MAP) addresses the same leaf hub-relative with the packet name as a
 * literal prefix, so an unqualified leaf would never string-match legacy's own
 * observed resources or a scenario's authored gold. A target that resolves to
 * no manifest mode is collected as unresolved (a broken bridge), never
 * silently dropped.
 *
 * @param {Array<(string|Object)>} targets - Compiled decision targets.
 * @param {function(string): Object<string,Object>} loadModeIndex - hubId -> mode index.
 * @returns {{observedIntents:string[], observedResources:string[], unresolved:string[]}} Translated observed.
 */
function translateTargetsToObserved(targets, loadModeIndex) {
  const observedIntents = [];
  const seenIntent = new Set();
  const resources = new Set();
  const unresolved = [];
  const normalizedTargets = [];
  for (const target of targets || []) {
    const qualifiedId = qualifiedIdOf(target);
    // A target resolves against its own destination hub's manifest, which may
    // differ from the benchmarked hub.
    const targetHub = String(qualifiedId).split('/')[0];
    const modeIndex = (typeof loadModeIndex === 'function' ? loadModeIndex(targetHub) : loadModeIndex) || {};
    const resolved = qualifiedIdToLeaf(qualifiedId, { modeIndex });
    if (!resolved.ok) {
      unresolved.push(qualifiedId);
      continue;
    }
    if (!seenIntent.has(resolved.workflowMode)) {
      seenIntent.add(resolved.workflowMode);
      observedIntents.push(resolved.workflowMode);
    }
    normalizedTargets.push({
      hubId: resolved.hub,
      workflowMode: resolved.workflowMode,
      packetKind: resolved.mode.packetKind || resolved.kind,
    });
    const leaves = resolved.mode && Array.isArray(resolved.mode.leaves) ? resolved.mode.leaves : [];
    const packet = resolved.mode && typeof resolved.mode.packet === 'string' ? resolved.mode.packet : '';
    const packetPrefix = packet ? `${packet}/` : '';
    for (const leaf of leaves) resources.add(`${packetPrefix}${leaf}`);
  }
  return {
    observedIntents,
    observedResources: [...resources],
    unresolved,
    normalizedTargets,
  };
}

/**
 * Collect the set of packet ids a hub's mode index declares. Used to classify
 * a legacy-observed resource as packet-qualified (subject to compiled's own
 * per-target leaf declaration) versus hub-level/unconditional (belongs to no
 * packet at all, e.g. the always-loaded routing preamble) -- a distinction the
 * shared `<packet>/<leaf>` string convention makes purely lexical: a
 * packet-qualified resource's first path segment names a declared packet, a
 * hub-level resource's does not.
 *
 * @param {Map<string,Object>|Object<string,Object>} modeIndex - workflowMode -> mode entry ({ packet, ... }).
 * @returns {Set<string>} Declared packet ids.
 */
function packetIdsForModeIndex(modeIndex) {
  const ids = new Set();
  const entries = modeIndex instanceof Map ? modeIndex.values() : Object.values(modeIndex || {});
  for (const mode of entries) {
    if (mode && typeof mode.packet === 'string' && mode.packet) ids.add(mode.packet);
  }
  return ids;
}

/**
 * Project compiled's per-target leaf declaration down to legacy's own observed
 * granularity for the route-gold comparison. A leaf-manifest declares the FULL
 * leaf set a workflow mode could ever serve (mode granularity, every
 * language/surface it could ever need); legacy's own observed resources are
 * the finer, task-scoped subset the retained surface router actually replayed
 * for THIS scenario -- a layer compiled routing does not replace, so it is
 * byte-identical regardless of which engine picked the mode. An unconditional
 * hub-level resource (the always-loaded routing preamble) belongs to no
 * packet's leaf declaration at all, so it could never appear in ANY per-target
 * leaf set even when correctly declared. Comparing compiled's raw, unfiltered
 * declaration straight against a task-scoped, hub-level-inclusive gold is
 * apples-to-oranges.
 *
 * The fix is NOT to trust compiled's claim wholesale (that would make a real
 * compiled leaf-manifest gap unobservable) and NOT to trust legacy's claim
 * wholesale either (same reason, inverted): legacy's own observed set is kept
 * ONLY for the resources compiled's declared leaves confirm (packet-qualified)
 * or that sit outside any packet's declaration entirely (hub-level,
 * unconditional, hence never gated by which target was selected). A genuine
 * compiled per-target leaf gap -- a packet-qualified resource legacy selected
 * that compiled's manifest never declares for that target -- cannot survive
 * this filter, so it still fails the must-include/forbidden-prefix gold check
 * and still reports as drift.
 *
 * @param {Object} args - Projection inputs.
 * @param {string[]} args.legacyResources - Legacy's own observed resources for this scenario.
 * @param {string[]} args.compiledResources - Compiled's declared, packet-qualified resources.
 * @param {Set<string>} args.hubPacketIds - Packet ids the benchmarked hub declares.
 * @returns {string[]} Legacy's observed resources, narrowed to what compiled's declaration can support.
 */
function projectCompiledResourcesToLegacyGranularity({ legacyResources, compiledResources, hubPacketIds }) {
  const compiledSet = new Set(compiledResources || []);
  const packetIds = hubPacketIds || new Set();
  return (legacyResources || []).filter((resource) => {
    const firstSegment = String(resource).split('/')[0];
    const packetQualified = packetIds.has(firstSegment);
    return !packetQualified || compiledSet.has(resource);
  });
}

function selectionKindForTargets(targets) {
  if (!targets.length) return null;
  if (targets.length === 1) return 'single';
  // Mirrors registry-compiler.cjs's bundleKindForModes (the compiler's own
  // authority for this classification) and decision-contract.cjs's
  // assertComposition: surfaceBundle requires EXACTLY one actor-role target
  // plus one-or-more evidence-role targets. `packetKind === 'surface'` is the
  // evidence marker (PACKET_AUTHORITY); every other packetKind is actor. Any
  // other tie shape -- two-or-more actors (even alongside a surface target),
  // or evidence with no actor at all -- is orderedBundle, which carries no
  // role restriction.
  const actors = targets.filter((target) => target.packetKind !== 'surface').length;
  const evidence = targets.length - actors;
  return (actors === 1 && evidence === targets.length - 1) ? 'surfaceBundle' : 'orderedBundle';
}

function normalizeLegacyProjection(legacyObserved, hubId, loadModeIndex) {
  if (legacyObserved && legacyObserved.routingProjection) {
    return legacyObserved.routingProjection;
  }
  const telemetry = legacyObserved && legacyObserved.raw && legacyObserved.raw.routeTelemetry;
  const rawModes = telemetry && Array.isArray(telemetry.workflowMode)
    ? telemetry.workflowMode
    : (Array.isArray(legacyObserved && legacyObserved.observedIntents)
      ? legacyObserved.observedIntents
      : []);
  const index = loadModeIndex(hubId) || {};
  const targets = rawModes.map((workflowMode) => ({
    hubId,
    workflowMode,
    packetKind: index[workflowMode] && index[workflowMode].packetKind
      ? index[workflowMode].packetKind
      : 'workflow',
  }));
  const action = targets.length ? 'route' : 'defer';
  return { action, selectionKind: selectionKindForTargets(targets), targets };
}

function normalizeCompiledProjection(decision, bridged) {
  const action = decision && typeof decision.action === 'string'
    ? decision.action
    : 'defer';
  const targets = bridged ? bridged.normalizedTargets : [];
  return {
    action,
    selectionKind: action === 'route'
      ? (decision.selectionKind || selectionKindForTargets(targets))
      : null,
    targets,
  };
}

function firstProjectionDifference(legacyProjection, compiledProjection) {
  for (const field of ['action', 'selectionKind']) {
    if (legacyProjection[field] !== compiledProjection[field]) {
      return { field, legacy: legacyProjection[field], compiled: compiledProjection[field] };
    }
  }
  if (legacyProjection.targets.length !== compiledProjection.targets.length) {
    return {
      field: 'targets.length',
      legacy: legacyProjection.targets.length,
      compiled: compiledProjection.targets.length,
    };
  }
  for (let index = 0; index < legacyProjection.targets.length; index += 1) {
    for (const field of ['hubId', 'workflowMode', 'packetKind']) {
      if (legacyProjection.targets[index][field] !== compiledProjection.targets[index][field]) {
        return {
          field: `targets[${index}].${field}`,
          legacy: legacyProjection.targets[index][field],
          compiled: compiledProjection.targets[index][field],
        };
      }
    }
  }
  return null;
}

/**
 * Mirror of the runtime's tri-state flag parse. Prefers the promoted resolver's
 * own `parseFlagMode` (single source of truth) and falls back to an inline copy
 * of its documented truth table when the closure is absent, so a benchmark
 * classification can never diverge from what actually serves.
 *
 * @param {*} raw - Raw flag value.
 * @returns {string} 'force-on' | 'force-legacy' | 'default' | 'invalid'.
 */
function parseFlagModeSafe(raw) {
  try {
    const resolver = require(PROMOTED_RESOLVER);
    if (typeof resolver.parseFlagMode === 'function') return resolver.parseFlagMode(raw);
  } catch {
    // Closure absent: use the inline mirror below.
  }
  if (raw === undefined || raw === '') return 'default';
  if (raw === '1') return 'force-on';
  if (raw === '0' || raw === 'false' || raw === 'off') return 'force-legacy';
  return 'invalid';
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Re-hash the frozen scorer trio against the pinned digests. Returns the drift
 * detail so the caller can abort before any comparison runs; a missing or
 * changed scorer is drift, never silently tolerated.
 *
 * @param {Object} [opts] - Options.
 * @param {string} [opts.scorerDir] - Directory holding the frozen scorer files.
 * @param {Object<string,string>} [opts.pins] - filename -> expected digest.
 * @returns {{ok:boolean, drift:Array<{file:string, expected:string, actual:(string|null), error?:string}>}} Gate result.
 */
function assertFrozenScorerDigests({ scorerDir = __dirname, pins = PINNED_FROZEN_SCORER_DIGESTS } = {}) {
  const drift = [];
  const digests = {};
  for (const [file, expected] of Object.entries(pins)) {
    try {
      const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(scorerDir, file))).digest('hex');
      digests[file] = actual;
      if (actual !== expected) drift.push({ file, expected, actual });
    } catch (err) {
      digests[file] = null;
      drift.push({ file, expected, actual: null, error: err && err.message });
    }
  }
  return { ok: drift.length === 0, drift, digests };
}

/**
 * Classify one scenario's compiled-vs-legacy parity.
 *
 * @param {Object} args - Inputs.
 * @param {Object} args.scenario - Playbook scenario (carries prompt + gold).
 * @param {Object} args.legacyObserved - Legacy observed decision (may carry a
 *   precomputed `routeGold` from the frozen evaluator).
 * @param {string} args.skillRoot - Skill root dir.
 * @param {string} args.skillId - Skill id.
 * @param {Object} [deps] - Injectable seams (each has a production default).
 * @returns {Object} Parity result: { scenarioId, hubId, status, ... }.
 */
function compiledParity({ scenario, legacyObserved, skillRoot, skillId }, deps = {}) {
  const {
    resolveHubId = (id) => id,
    eligibleHubs = loadEligibleHubs(),
    compiledDecision = defaultCompiledDecision,
    loadModeIndex = defaultLoadModeIndex,
    evaluate = evaluateRouteGold,
  } = deps;

  const hubId = resolveHubId(skillId, skillRoot);
  const base = {
    scenarioId: scenario && scenario.scenarioId,
    hubId,
    flagForcedOn: true,
  };

  // A non-routing scenario carries no compiled decision to compare.
  if (!scenario || scenario.classKind === 'browser') {
    return { ...base, status: PARITY_STATUS.NA, reason: 'non-routing-scenario' };
  }
  if (!scenario.hasIntentGold && !scenario.hasResourceGold
      && !Array.isArray(scenario.expectedIntents)
      && !Array.isArray(scenario.expectedResources)) {
    return { ...base, status: PARITY_STATUS.NA, reason: 'route-gold-absent' };
  }

  // Eligibility: a hub outside the compiled serving closure is structurally n/a
  // (informational), never scored as drift.
  if (!eligibleHubs.has(hubId)) {
    return { ...base, status: PARITY_STATUS.NA, reason: 'hub-not-compiled-eligible' };
  }

  let statusRecord;
  try {
    if (typeof deps.statusProbe === 'function') {
      statusRecord = deps.statusProbe(hubId, skillRoot);
    } else if (typeof deps.readServingAuthority === 'function') {
      const authority = deps.readServingAuthority(hubId, deps.activationRoot || ACTIVATION_ROOT);
      statusRecord = authority == null
        ? {
          servingAuthority: 'legacy',
          causeCode: 'missing-manifest',
          manifestFreshness: { manifestValid: false, fresh: false, causeCode: 'missing-manifest' },
        }
        : {
          servingAuthority: authority,
          causeCode: authority === 'compiled' ? 'compiled-serving' : 'legacy-authority',
          manifestFreshness: { manifestValid: true, fresh: true, causeCode: 'fresh' },
        };
    } else {
      statusRecord = defaultProbeStatus(hubId);
    }
  } catch (err) {
    return {
      ...base,
      status: PARITY_STATUS.RESOLVER_MISSING,
      reason: 'status-probe-failed',
      detail: err && err.message,
    };
  }

  const freshness = statusRecord && statusRecord.manifestFreshness
    ? statusRecord.manifestFreshness
    : {};
  if (freshness.causeCode === 'missing-manifest') {
    return {
      ...base,
      status: PARITY_STATUS.NA,
      reason: 'legacy-by-construction',
      statusCauseCode: statusRecord.causeCode,
    };
  }
  if (freshness.causeCode === 'stale-manifest' || (freshness.manifestValid && !freshness.fresh)) {
    return {
      ...base,
      status: PARITY_STATUS.DRIFT,
      reason: 're-mint-required',
      statusCauseCode: freshness.causeCode,
    };
  }
  if (!freshness.manifestValid || freshness.causeCode !== 'fresh') {
    return {
      ...base,
      status: PARITY_STATUS.RESOLVER_MISSING,
      reason: 'manifest-invalid-or-unreadable',
      statusCauseCode: freshness.causeCode,
    };
  }
  if (statusRecord.causeCode === 'engine-throw') {
    return { ...base, status: PARITY_STATUS.RESOLVER_MISSING, reason: 'compiled-engine-throw' };
  }
  if (statusRecord.servingAuthority !== 'compiled') {
    return {
      ...base,
      status: PARITY_STATUS.VACUOUS,
      servingAuthority: statusRecord.servingAuthority,
      reason: statusRecord.causeCode || 'serving-authority-not-compiled',
    };
  }

  // Compiled decision: a load or route throw is a broken compiled path, not a
  // false pass and not a drift.
  let decision;
  try {
    decision = compiledDecision(hubId, scenario.prompt || '');
  } catch (err) {
    return { ...base, status: PARITY_STATUS.RESOLVER_MISSING, reason: 'compiled-engine-throw', detail: err && err.message };
  }
  if (!decision || typeof decision !== 'object') {
    return { ...base, status: PARITY_STATUS.RESOLVER_MISSING, reason: 'compiled-decision-empty' };
  }

  const targets = Array.isArray(decision.targets) ? decision.targets : [];
  if (decision.action === 'route' && targets.length === 0) {
    return { ...base, status: PARITY_STATUS.RESOLVER_MISSING, reason: 'compiled-route-without-targets' };
  }

  // Shape bridge: translate targets into the frozen evaluator's vocabulary. An
  // unresolvable target is a broken bridge, failing closed.
  const bridged = translateTargetsToObserved(targets, loadModeIndex);
  if (bridged.unresolved.length) {
    return { ...base, status: PARITY_STATUS.RESOLVER_MISSING, reason: 'unresolved-qualified-id', unresolved: bridged.unresolved };
  }

  // Both observations must independently pass the frozen route-gold evaluator,
  // then their routing-only projections must compare equal in authored order.
  //
  // Resource-granularity bridge (see projectCompiledResourcesToLegacyGranularity):
  // compiled's declared leaves are mode-wide, legacy's observed resources are
  // task-scoped. Projecting legacy's own set down to what compiled's
  // declaration can support makes the gold comparison apples-to-apples without
  // trusting compiled blindly.
  const hubModeIndex = (typeof loadModeIndex === 'function' ? loadModeIndex(hubId) : loadModeIndex) || {};
  const hubPacketIds = packetIdsForModeIndex(hubModeIndex);
  const legacyResources = (legacyObserved && legacyObserved.observedResources) || [];
  const compiledObserved = {
    observedIntents: bridged.observedIntents,
    observedResources: projectCompiledResourcesToLegacyGranularity({
      legacyResources,
      compiledResources: bridged.observedResources,
      hubPacketIds,
    }),
  };
  const compiledResult = evaluate({ scenario, observed: compiledObserved });
  const legacyResult = legacyObserved && legacyObserved.routeGold
    ? legacyObserved.routeGold
    : evaluate({ scenario, observed: legacyObserved || {} });

  const legacyProjection = normalizeLegacyProjection(legacyObserved || {}, hubId, loadModeIndex);
  const compiledProjection = normalizeCompiledProjection(decision, bridged);
  const firstDifference = firstProjectionDifference(legacyProjection, compiledProjection);
  const compiledGoldPass = Boolean(compiledResult && compiledResult.pass);
  const legacyGoldPass = Boolean(legacyResult && legacyResult.pass);
  // Parity is "compiled behaves identically to legacy" -- same routing AND the
  // same gold outcome -- decoupled from gold achievability. Both sides failing
  // the SAME pre-existing scenario-gold gap under matching routing is parity,
  // not drift; only an outcome DIFFERENCE (one side passes, the other fails)
  // is drift. The old `compiledGoldPass && legacyGoldPass` formula wrongly
  // required both to pass, so a shared, pre-existing gold gap misclassified as
  // drift even when compiled tracked legacy exactly.
  // A non-route decision (defer/clarify/reject) carries no resources by schema --
  // route-gold resources ride only on `route.targets`. When compiled and legacy
  // agree on such a non-route decision (firstDifference null), any resource gold
  // is delivered by the retained legacy surface layer (smart-routing.md), which
  // the compiled router does not replace and which the runtime reaches via the
  // legacy fallback a defer triggers; scoring that surface gold against an
  // empty-by-design decision would misread identical routing as drift. A served
  // `route` still compares gold, so a real compiled resource gap on a route drifts.
  const match = firstDifference === null
    && (decision.action !== 'route' || compiledGoldPass === legacyGoldPass);
  return {
    ...base,
    status: match ? PARITY_STATUS.MATCH : PARITY_STATUS.DRIFT,
    reason: match
      ? 'routing-parity-match'
      : (firstDifference ? 'routing-projection-mismatch' : 'route-gold-failure'),
    frontDoorOutcome: decision.action,
    compiledAction: decision.action,
    compiledIntents: bridged.observedIntents,
    compiledGoldPass,
    legacyGoldPass,
    legacyProjection,
    compiledProjection,
    firstDifference,
  };
}

/**
 * Roll per-scenario parity statuses into the run-level verdict sub-state. Broken
 * paths outrank drift, which outranks a clean compiled-serving run; a run with
 * no scored parity rows is n/a. Broken and drift both block, but stay distinct
 * in the sub-verdict so the two causes never collapse.
 *
 * @param {Array<Object>} rows - Scenario rows (each may carry `compiledParity`).
 * @returns {{subVerdict:string, blocking:boolean, scored:number, counts:Object, gate:Object}} Roll-up.
 */
function rollupCompiledParity(rows) {
  const parityRows = (rows || []).map((row) => row && row.compiledParity).filter(Boolean);
  const counts = { match: 0, drift: 0, vacuous: 0, 'n/a': 0, 'resolver-missing': 0 };
  for (const parity of parityRows) {
    if (Object.prototype.hasOwnProperty.call(counts, parity.status)) counts[parity.status] += 1;
  }

  let subVerdict;
  if (counts['resolver-missing'] > 0) subVerdict = COMPILED_SUBVERDICT.BROKEN;
  else if (counts.drift > 0 || counts.vacuous > 0) subVerdict = COMPILED_SUBVERDICT.DRIFTED;
  else if (counts.match > 0) subVerdict = COMPILED_SUBVERDICT.SERVING;
  else subVerdict = COMPILED_SUBVERDICT.NA;

  const blocking = subVerdict === COMPILED_SUBVERDICT.DRIFTED || subVerdict === COMPILED_SUBVERDICT.BROKEN;
  return {
    subVerdict,
    blocking,
    scored: parityRows.length,
    counts,
    gate: {
      owner: DRIFT_GATE_OWNER,
      isBlockingOwner: true,
      firing: blocking,
      reportOnlyConsumers: [...DRIFT_GATE_REPORT_ONLY_CONSUMERS],
    },
  };
}

/**
 * Raise the outer verdict for a compiled block, but only over a non-blocked
 * verdict. An existing structural/registry/route-gold block outranks the
 * compiled cause and is returned unchanged, keeping the two verdicts distinct
 * (the compiled cause remains legible in the sub-verdict). This is the seam the
 * orchestrator's verdict-to-exit map consults before deciding the outer verdict.
 *
 * @param {string} currentVerdict - Verdict the frozen scorer produced.
 * @param {boolean} blocking - Whether the compiled roll-up is drift/broken.
 * @returns {string} The effective outer verdict.
 */
function applyCompiledDriftVerdict(currentVerdict, blocking) {
  if (blocking && COMPILED_OVERRIDABLE_VERDICTS.has(currentVerdict)) return 'BLOCKED-BY-COMPILED-DRIFT';
  return currentVerdict;
}

/**
 * Classify the compiled-routing flag into the four benchmark-facing states the
 * matrix asserts (unset / force-legacy / force-on / invalid), mapped 1:1 from
 * the runtime tri-state parse. Never coerces one state into another; an
 * unrecognized value is a defined `invalid` outcome, not a silent 0 or 1.
 *
 * @param {*} raw - Raw SPECKIT_COMPILED_ROUTING value (undefined when unset).
 * @returns {{raw:(string|null), state:string, flagMode:string, permitsCompiledWhenEligible:boolean, note:(string|undefined)}} Flag-state record.
 */
function classifyFlagState(raw) {
  const flagMode = parseFlagModeSafe(raw);
  let state;
  if (raw === undefined || raw === null || raw === '') state = 'unset';
  else if (flagMode === 'force-on') state = 'force-on';
  else if (flagMode === 'force-legacy') state = 'force-legacy';
  else state = 'invalid';
  return {
    raw: raw === undefined ? null : raw,
    state,
    flagMode,
    // Pre-cutover the per-hub default cohort is empty, so only an explicit
    // force-on permits compiled serving; unset resolves to legacy fleet-wide.
    permitsCompiledWhenEligible: flagMode === 'force-on',
    note: state === 'invalid' ? 'unrecognized value fails closed to legacy' : undefined,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  compiledParity,
  rollupCompiledParity,
  applyCompiledDriftVerdict,
  classifyFlagState,
  assertFrozenScorerDigests,
  translateTargetsToObserved,
  packetIdsForModeIndex,
  projectCompiledResourcesToLegacyGranularity,
  normalizeLegacyProjection,
  normalizeCompiledProjection,
  firstProjectionDifference,
  selectionKindForTargets,
  runJsonChild,
  defaultCompiledDecision,
  defaultProbeStatus,
  qualifiedIdOf,
  loadEligibleHubs,
  PARITY_STATUS,
  COMPILED_SUBVERDICT,
  COMPILED_OVERRIDABLE_VERDICTS,
  PINNED_FROZEN_SCORER_DIGESTS,
  DRIFT_GATE_OWNER,
  DRIFT_GATE_REPORT_ONLY_CONSUMERS,
  RUNTIME_ROOT,
  ACTIVATION_ROOT,
  PUBLIC_FRONT_DOOR,
  STATUS_PROBE,
};
