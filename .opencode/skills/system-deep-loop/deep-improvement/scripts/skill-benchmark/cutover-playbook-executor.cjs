#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ cutover-playbook-executor — evidence-gated compiled-routing cutover run   ║
// ║ (non-frozen sibling of the scorer trio)                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * cutover-playbook-executor.cjs — run a hub's compiled-routing scenario matrix
 * and gate each scenario on captured evidence, never on a hand-asserted verdict.
 *
 * For every compiled-routing scenario in a hub's `compiled-routing/` directory
 * this executor:
 *   1. captures the evidence contract for the routing plane the scenario names
 *      (compiledRoute, serving authority, flag state, fallback cause, manifest
 *      digest, model, reasoning effort), reading the same activation manifest the
 *      frozen parity harness reads and the same status probe 002 wires;
 *   2. runs the routing decision through BOTH the legacy router and the compiled
 *      engine — this is the scenario's command sequence, reduced to its essence;
 *   3. derives a single PASS / FAIL / SKIP verdict as a pure function of that
 *      captured evidence.
 *
 * The gate is the routing DECISION, not a resource-representation diff: the
 * compiled engine and the legacy router agree when they select the same workflow
 * modes (or when the compiled engine conservatively defers, serving the legacy
 * decision unchanged). A serving authority that is not `compiled` is a vacuous
 * result (FAIL — the plane the scenario asserts is not the one that would serve);
 * a compiled engine that names a different mode is a real drift (FAIL); a hub
 * outside the compiled serving closure is SKIP.
 *
 * Every compiled-routing scenario is critical: a non-PASS critical scenario
 * blocks the join-gate signal this executor emits for the P3 coverage-closure
 * gate, and is never silently downgraded.
 *
 * Consumes, never re-derives: the flag classifier and eligibility set from the
 * frozen-adjacent parity harness, and the fleet-effective serving status from
 * 002's status probe. It never opens the frozen loader or either other frozen
 * scorer file for write. Every external seam is an injectable dependency with a
 * production default, so the whole verdict space is exercisable from fixtures.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

const {
  classifyFlagState, loadEligibleHubs, PARITY_STATUS, ACTIVATION_ROOT, RUNTIME_ROOT,
} = require('./compiled-routing-parity.cjs');
const { routeSkillResources } = require('./router-replay.cjs');
const {
  parseScenario, VERDICT,
} = require('../../../../sk-doc/create-skill/scripts/validate-compiled-routing-scenarios.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SKILLS_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const PROMOTED_ENGINE = path.join(RUNTIME_ROOT, '011-runtime-engine', 'lib', 'compiled-route.cjs');
const STATUS_PROBE = path.resolve(__dirname, '..', '..', '..', '..', '..', 'bin', 'compiled-route-status.cjs');

// The evidence-contract field order asserted on every compiled-routing scenario.
const EVIDENCE_FIELD_ORDER = Object.freeze([
  'compiledRoute', 'servingAuthority', 'flagState', 'fallbackCause', 'manifestDigest', 'model', 'reasoningEffort',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. PRODUCTION DEPENDENCY DEFAULTS (each injectable)
// ─────────────────────────────────────────────────────────────────────────────

// Legacy router decision: the workflow-mode intents the frozen router selects.
function defaultRouteLegacy(hubId, prompt) {
  const skillRoot = path.join(SKILLS_ROOT, hubId);
  const r = routeSkillResources({ skillRoot, taskText: prompt || '' });
  return { intents: uniqueSorted(r.intents) };
}

// Compiled engine decision: lazily required so a hub with no promoted closure
// still imports this module. A throw is surfaced as a broken compiled path.
function defaultRouteCompiled(hubId, prompt) {
  const { compiledRoute } = require(PROMOTED_ENGINE);
  const decision = compiledRoute(hubId, prompt || '');
  const targets = Array.isArray(decision.targets) ? decision.targets : [];
  const intents = uniqueSorted(targets.map((t) => (t && t.workflowMode) || (typeof t === 'string' ? String(t).split('/')[1] : null)).filter(Boolean));
  return { action: decision.action, intents };
}

// The activation manifest's DECLARED serving authority — the plane the frozen
// parity harness serves against. `compiled` means the compiled engine's decision
// is the one that would serve when the flag permits it.
function defaultReadManifestAuthority(hubId, activationRoot = ACTIVATION_ROOT) {
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(activationRoot, hubId, 'manifest.json'), 'utf8'));
    return {
      servingAuthority: typeof manifest.servingAuthority === 'string' ? manifest.servingAuthority : null,
      manifestDigest: (manifest.selectedPolicy && manifest.selectedPolicy.effectivePolicyHash) || null,
    };
  } catch {
    return { servingAuthority: null, manifestDigest: null };
  }
}

// The fleet-effective status from 002's probe (flag-adjusted): its causeCode
// explains why the fleet does or does not currently serve compiled. Recorded as
// a diagnostic alongside the parity-plane gate, never the gate itself.
function defaultStatusProbe(hubId) {
  try {
    const { computeHubStatus } = require(STATUS_PROBE);
    return computeHubStatus(hubId, { probeEngine: false });
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function uniqueSorted(list) {
  return [...new Set((Array.isArray(list) ? list : []).filter(Boolean))].sort();
}

function sameSet(a, b) {
  const sa = uniqueSorted(a);
  const sb = uniqueSorted(b);
  return sa.length === sb.length && sa.every((v, i) => v === sb[i]);
}

// The seven-field evidence contract for a scenario, joining its authored plane to
// the live captured signals. `flagState` is read live from the environment (the
// same variable the runtime reads), so the record reflects the flag as it was at
// capture time, not just as authored.
function captureEvidence(scenario, manifest, flagRaw) {
  const authored = scenario.evidence || {};
  return {
    compiledRoute: authored.compiled_route || null,
    servingAuthority: manifest.servingAuthority,
    flagState: classifyFlagState(flagRaw).state,
    fallbackCause: authored.fallback_cause || null,
    manifestDigest: manifest.manifestDigest,
    model: authored.model || null,
    reasoningEffort: authored.reasoning_effort || null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gate one compiled-routing scenario on captured evidence.
 *
 * @param {Object} args - Inputs.
 * @param {string} args.hubId - Hub id.
 * @param {Object} args.scenario - Parsed scenario (from parseScenario).
 * @param {Object} [deps] - Injectable seams (each has a production default).
 * @returns {Object} Gate result: { scenarioId, verdict, critical, evidence, decision, fleetStatus, reason }.
 */
function gateScenario({ hubId, scenario }, deps = {}) {
  const {
    routeLegacy = defaultRouteLegacy,
    routeCompiled = defaultRouteCompiled,
    readManifestAuthority = defaultReadManifestAuthority,
    statusProbe = defaultStatusProbe,
    eligibleHubs = loadEligibleHubs(),
    flagRaw = process.env.SPECKIT_COMPILED_ROUTING,
  } = deps;

  const scenarioId = scenario.id || '(no id)';
  const manifest = readManifestAuthority(hubId);
  const fleetStatus = statusProbe(hubId);
  const evidence = captureEvidence(scenario, manifest, flagRaw);
  const base = { scenarioId, critical: true, evidence, fleetStatus };

  // A hub outside the compiled serving closure is structurally not-applicable.
  if (!eligibleHubs.has(hubId)) {
    return { ...base, verdict: VERDICT.SKIP, parityStatus: PARITY_STATUS.NA, reason: 'hub-not-compiled-eligible' };
  }

  // Vacuous guard: the plane the scenario asserts must be the one that serves.
  if (manifest.servingAuthority !== 'compiled') {
    return {
      ...base,
      verdict: VERDICT.FAIL,
      parityStatus: PARITY_STATUS.VACUOUS,
      reason: manifest.servingAuthority == null ? 'manifest-missing-or-unreadable' : 'serving-authority-not-compiled',
    };
  }

  // Run the decision through both engines — the scenario's command sequence.
  const legacy = routeLegacy(hubId, scenario.prompt);
  let compiled;
  try {
    compiled = routeCompiled(hubId, scenario.prompt);
  } catch (err) {
    return { ...base, verdict: VERDICT.FAIL, parityStatus: PARITY_STATUS.RESOLVER_MISSING, reason: 'compiled-engine-throw', detail: err && err.message };
  }
  if (!compiled || typeof compiled !== 'object') {
    return { ...base, verdict: VERDICT.FAIL, parityStatus: PARITY_STATUS.RESOLVER_MISSING, reason: 'compiled-decision-empty' };
  }

  const decision = { legacyIntents: legacy.intents, compiledAction: compiled.action, compiledIntents: compiled.intents };

  // Only a compiled DEFER is a true legacy fallback: the compiled plane yields and
  // legacy serves its decision unchanged, so parity holds without comparing intents.
  // clarify and reject are TERMINAL compiled decisions (the compiled plane refuses
  // to route), NOT a fallback — they must be compared against legacy below, or a
  // compiled clarify/reject that disagrees with a legacy route silently false-passes.
  if (compiled.action === 'defer') {
    return { ...base, verdict: VERDICT.PASS, parityStatus: PARITY_STATUS.MATCH, reason: 'compiled-defers-to-legacy', decision };
  }

  // The routing DECISION is the gate: same selected workflow modes == parity. A
  // terminal clarify/reject carries no intents, so it matches legacy here only when
  // legacy also routes nothing; a mismatch against a real legacy route is drift.
  if (sameSet(compiled.intents, legacy.intents)) {
    return { ...base, verdict: VERDICT.PASS, parityStatus: PARITY_STATUS.MATCH, reason: 'compiled-decision-matches-legacy', decision };
  }
  return { ...base, verdict: VERDICT.FAIL, parityStatus: PARITY_STATUS.DRIFT, reason: 'compiled-decision-differs-from-legacy', decision };
}

/**
 * Run the cutover gate over every compiled-routing scenario under a hub's
 * `compiled-routing/` directory and roll the per-scenario verdicts into one
 * join-gate signal.
 *
 * @param {Object} args - Inputs.
 * @param {string} args.hubId - Hub id.
 * @param {string} args.dir - The hub's compiled-routing scenario directory.
 * @param {Object} [deps] - Injectable seams forwarded to gateScenario.
 * @returns {Object} { hubId, scenarios, joinGate }.
 */
function runCutover({ hubId, dir }, deps = {}) {
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md').map((f) => path.join(dir, f)).sort()
    : [];
  const scenarios = [];
  for (const absPath of files) {
    const parsed = parseScenario(absPath);
    if (!parsed.ok) {
      scenarios.push({ scenarioId: null, relPath: path.basename(absPath), critical: true, verdict: VERDICT.FAIL, reason: parsed.error });
      continue;
    }
    scenarios.push({ relPath: path.basename(absPath), ...gateScenario({ hubId, scenario: parsed }, deps) });
  }

  // Join-gate: every critical compiled-routing scenario must PASS before this
  // hub's cutover proceeds. A SKIP (hub not in the closure) does not block; a
  // FAIL does, and stays legible — never silently downgraded.
  const criticalNonPass = scenarios.filter((s) => s.critical && s.verdict === VERDICT.FAIL);
  const anyPass = scenarios.some((s) => s.verdict === VERDICT.PASS);
  const joinVerdict = criticalNonPass.length > 0
    ? VERDICT.FAIL
    : (anyPass ? VERDICT.PASS : VERDICT.SKIP);

  return {
    hubId,
    scenarios,
    joinGate: {
      verdict: joinVerdict,
      blocked: criticalNonPass.length > 0,
      criticalTotal: scenarios.filter((s) => s.critical).length,
      criticalPass: scenarios.filter((s) => s.critical && s.verdict === VERDICT.PASS).length,
      criticalFail: criticalNonPass.length,
      blockingScenarioIds: criticalNonPass.map((s) => s.scenarioId),
    },
  };
}

function formatReport(report) {
  const lines = [`# Compiled-routing cutover — ${report.hubId}`, ''];
  for (const s of report.scenarios) {
    lines.push(`${s.verdict}  ${s.scenarioId || s.relPath}  (${s.reason || ''})`);
    if (s.evidence) {
      lines.push(`      evidence: ${EVIDENCE_FIELD_ORDER.map((k) => `${k}=${s.evidence[k]}`).join('  ')}`);
    }
    if (s.decision) {
      lines.push(`      decision: legacy=${JSON.stringify(s.decision.legacyIntents)} compiled=${JSON.stringify(s.decision.compiledIntents)} action=${s.decision.compiledAction}`);
    }
    if (s.fleetStatus) {
      lines.push(`      fleet: effectiveAuthority=${s.fleetStatus.servingAuthority} causeCode=${s.fleetStatus.causeCode}`);
    }
  }
  lines.push('');
  const g = report.joinGate;
  lines.push(`join-gate: verdict=${g.verdict} blocked=${g.blocked} criticalPass=${g.criticalPass}/${g.criticalTotal}${g.blockingScenarioIds.length ? ` blocking=${g.blockingScenarioIds.join(',')}` : ''}`);
  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  gateScenario,
  runCutover,
  captureEvidence,
  formatReport,
  EVIDENCE_FIELD_ORDER,
  VERDICT,
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. CLI
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  const hubId = args.hub ? String(args.hub) : null;
  const dir = args.dir
    ? path.resolve(String(args.dir))
    : (hubId ? path.join(SKILLS_ROOT, hubId, 'manual-testing-playbook', 'compiled-routing') : null);
  if (!hubId || !dir) {
    process.stderr.write('usage: cutover-playbook-executor.cjs --hub <hubId> [--dir <compiled-routing dir>] [--format json]\n');
    process.exit(2);
  }
  const report = runCutover({ hubId, dir });
  if (args.format === 'json') process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  else process.stdout.write(`${formatReport(report)}\n`);
  process.exit(report.joinGate.blocked ? 3 : 0);
}
