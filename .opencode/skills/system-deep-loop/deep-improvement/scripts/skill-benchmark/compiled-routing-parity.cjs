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

// Fallback compiled serving closure, used only when the promoted closure
// manifest is unreadable. Kept in sync with that manifest's hub list.
const FALLBACK_ELIGIBLE_HUBS = Object.freeze([
  'sk-code', 'system-deep-loop', 'mcp-tooling', 'cli-external-orchestration',
  'sk-prompt', 'sk-design', 'sk-doc',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

let eligibleHubsCache = null;

/**
 * The set of hubs in the compiled serving closure — the only hubs where a
 * missing compiled parity is a real gap rather than structurally `n/a`. Read
 * from the promoted closure manifest, cached, with a static fallback so an
 * unreadable manifest degrades to the known hub list instead of throwing.
 *
 * @param {string} [manifestPath] - Serving-closure manifest path (override for tests).
 * @returns {Set<string>} Hub ids eligible for compiled parity.
 */
function loadEligibleHubs(manifestPath = SERVING_CLOSURE_MANIFEST) {
  if (manifestPath === SERVING_CLOSURE_MANIFEST && eligibleHubsCache) return eligibleHubsCache;
  let hubs = FALLBACK_ELIGIBLE_HUBS;
  try {
    const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (Array.isArray(parsed.hubs) && parsed.hubs.length) hubs = parsed.hubs;
  } catch {
    // Unreadable closure manifest: fall back to the known hub list rather than
    // declaring every hub ineligible (which would mask real drift as n/a).
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
function defaultReadServingAuthority(hubId, activationRoot = ACTIVATION_ROOT) {
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(activationRoot, hubId, 'manifest.json'), 'utf8'));
    return typeof manifest.servingAuthority === 'string' ? manifest.servingAuthority : null;
  } catch {
    return null;
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
  // Lazily loaded: when parity is disabled (the default) this module is imported
  // but never touches the promoted engine, so the harness adds no hard runtime
  // dependency and stays importable where the closure is absent.
  const { compiledRoute } = require(PROMOTED_ENGINE);
  return compiledRoute(hubId, taskText);
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
 * leaves those modes declare. A target that resolves to no manifest mode is
 * collected as unresolved (a broken bridge), never silently dropped.
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
    const leaves = resolved.mode && Array.isArray(resolved.mode.leaves) ? resolved.mode.leaves : [];
    for (const leaf of leaves) resources.add(leaf);
  }
  return { observedIntents, observedResources: [...resources], unresolved };
}

/**
 * Parity holds when the frozen evaluator returns the same pass verdict for the
 * compiled-derived observed as for the legacy observed. The evaluator is the
 * sole arbiter; this only compares its two outputs.
 *
 * @param {Object} compiledResult - Frozen evaluator output for the compiled decision.
 * @param {Object} legacyResult - Frozen evaluator output for the legacy decision.
 * @returns {boolean} True when the two verdicts agree.
 */
function pariesWithLegacy(compiledResult, legacyResult) {
  return Boolean(compiledResult && compiledResult.pass) === Boolean(legacyResult && legacyResult.pass);
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
  for (const [file, expected] of Object.entries(pins)) {
    try {
      const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(scorerDir, file))).digest('hex');
      if (actual !== expected) drift.push({ file, expected, actual });
    } catch (err) {
      drift.push({ file, expected, actual: null, error: err && err.message });
    }
  }
  return { ok: drift.length === 0, drift };
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
    readServingAuthority = defaultReadServingAuthority,
    activationRoot = ACTIVATION_ROOT,
    compiledDecision = defaultCompiledDecision,
    loadModeIndex = defaultLoadModeIndex,
    evaluate = evaluateRouteGold,
  } = deps;

  const hubId = resolveHubId(skillId, skillRoot);
  const base = { scenarioId: scenario && scenario.scenarioId, hubId };

  // A non-routing scenario carries no compiled decision to compare.
  if (!scenario || scenario.classKind === 'browser') {
    return { ...base, status: PARITY_STATUS.NA, reason: 'non-routing-scenario' };
  }

  // Eligibility: a hub outside the compiled serving closure is structurally n/a
  // (informational), never scored as drift.
  if (!eligibleHubs.has(hubId)) {
    return { ...base, status: PARITY_STATUS.NA, reason: 'hub-not-compiled-eligible' };
  }

  // Vacuous-parity guard: the manifest's serving authority is the sole input.
  // Anything but `compiled` (including a missing manifest) hard-fails vacuous.
  const authority = readServingAuthority(hubId, activationRoot);
  if (authority !== 'compiled') {
    return {
      ...base,
      status: PARITY_STATUS.VACUOUS,
      servingAuthority: authority,
      reason: authority == null ? 'manifest-missing-or-unreadable' : 'serving-authority-not-compiled',
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

  // A conservative compiled defer routes nothing and hands the prompt back to
  // legacy, so the served decision IS the legacy decision — parity holds.
  if (decision.action !== 'route' || targets.length === 0) {
    return { ...base, status: PARITY_STATUS.MATCH, compiledAction: decision.action, reason: 'compiled-defers-to-legacy', compiledIntents: [] };
  }

  // Shape bridge: translate targets into the frozen evaluator's vocabulary. An
  // unresolvable target is a broken bridge, failing closed.
  const bridged = translateTargetsToObserved(targets, loadModeIndex);
  if (bridged.unresolved.length) {
    return { ...base, status: PARITY_STATUS.RESOLVER_MISSING, reason: 'unresolved-qualified-id', unresolved: bridged.unresolved };
  }

  // Delegate the verdict to the frozen evaluator for both decisions, then
  // compare only its outputs.
  const compiledObserved = { observedIntents: bridged.observedIntents, observedResources: bridged.observedResources };
  const compiledResult = evaluate({ scenario, observed: compiledObserved });
  const legacyResult = legacyObserved && legacyObserved.routeGold
    ? legacyObserved.routeGold
    : evaluate({ scenario, observed: legacyObserved || {} });

  const match = pariesWithLegacy(compiledResult, legacyResult);
  return {
    ...base,
    status: match ? PARITY_STATUS.MATCH : PARITY_STATUS.DRIFT,
    compiledAction: decision.action,
    compiledIntents: bridged.observedIntents,
    compiledPass: Boolean(compiledResult && compiledResult.pass),
    legacyPass: Boolean(legacyResult && legacyResult.pass),
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
};
