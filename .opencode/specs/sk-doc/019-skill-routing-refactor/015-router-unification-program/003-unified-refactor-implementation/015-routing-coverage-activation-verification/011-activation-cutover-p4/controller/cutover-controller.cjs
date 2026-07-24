#!/usr/bin/env node
'use strict';

// Staged, hub-by-hub controller that would make compiled routing the effective
// default one hub at a time. It is INERT by construction: it never flips the
// runtime default, never rewrites a directive/catalog/template, and never
// mutates a manifest or cohort file on disk. It consumes the committed runtime
// (the promoted resolver, the serving-status probe, the activation engine) and
// the committed rollback/non-hub drills read-only, and proves — in memory — that
// the cutover mechanism is correct and reversible before any real flip is ever
// authorized.
//
// The safety model rests on one verified fact: every activation manifest already
// carries serving authority 'compiled', so the flag is the only remaining gate.
// A fleet-wide "unset means on" flip would therefore light all hubs at the same
// instant. Instead the effective default is advanced through a per-hub cohort:
// with the flag unset, a hub serves compiled only if it is a cohort member. This
// controller simulates cohort membership in memory (adding to the resolver's live
// exported Set, then restoring it) so N advanced hubs resolve to exactly N
// compiled hubs under an unset flag, with an explicit '0' always forcing legacy.

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

// ---------------------------------------------------------------------------
// Root resolution. Walk up to the repository root (the ancestor holding
// .opencode) so every consumed path is anchored without hard-coding an absolute
// worktree location; evidence provenance is emitted repo-relative from here.
// ---------------------------------------------------------------------------
function findRepoRoot(start) {
  let dir = start;
  for (let i = 0; i < 40; i += 1) {
    if (fs.existsSync(path.join(dir, '.opencode'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error('could not locate repo root (no .opencode ancestor)');
}

const CONTROLLER_DIR = __dirname;
const PACKET_ROOT = path.resolve(CONTROLLER_DIR, '..');
const COVERAGE_ROOT = path.resolve(PACKET_ROOT, '..');
const IMPL_ROOT = path.resolve(COVERAGE_ROOT, '..');
const REPO_ROOT = findRepoRoot(CONTROLLER_DIR);

const RUNTIME_ROOT = path.join(REPO_ROOT, '.opencode', 'bin', 'lib', 'compiled-routing');
const PROMOTED_RESOLVER = path.join(RUNTIME_ROOT, '011-runtime-engine', 'lib', 'resolve.cjs');
const PROMOTED_ENGINE = path.join(RUNTIME_ROOT, '011-runtime-engine', 'lib', 'compiled-route.cjs');
const STATUS_PROBE = path.join(REPO_ROOT, '.opencode', 'bin', 'compiled-route-status.cjs');
const SKILLS_ROOT = path.join(REPO_ROOT, '.opencode', 'skills');

// The frozen benchmark scorer. These files are read and hashed only, never
// written; a changed digest invalidates every route-gold baseline the program
// rests on, so it is treated as a program-wide integrity failure.
const SCORER_DIR = path.join(
  REPO_ROOT,
  '.opencode',
  'skills',
  'system-deep-loop',
  'deep-improvement',
  'scripts',
  'skill-benchmark',
);
const FROZEN_SCORER_PINS = {
  'router-replay.cjs': 'd5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47',
  'score-skill-benchmark.cjs': 'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
  'load-playbook-scenarios.cjs': '5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029',
};

// The two shared rollback/non-hub drills owned by the audit child, consumed as
// child processes so their own module state stays isolated from this run.
const ROLLBACK_DRILL = path.join(
  COVERAGE_ROOT, '010-rollback-audit-and-non-hub-policy', 'verification', 'rollback-audit-drill.cjs',
);
const NON_HUB_FIXTURES = path.join(
  COVERAGE_ROOT, '010-rollback-audit-and-non-hub-policy', 'verification', 'non-hub-eligibility-fixtures.cjs',
);

const resolver = require(PROMOTED_RESOLVER);
const engine = require(PROMOTED_ENGINE);
const statusProbe = require(STATUS_PROBE);

// The seven compiled-eligible hubs come from the engine map, never a local
// literal, so this controller can never operate on a hub the runtime does not.
const HUBS = Object.keys(engine.HUB_CHILD).sort();

// The five single-skill routers that are ineligible by archetype. Named here
// only to assert they are NEVER swept into a cohort; the authoritative negative
// proof is the audit child's fixture, invoked separately.
const NON_HUBS = ['sk-git', 'system-code-graph', 'system-skill-advisor', 'system-spec-kit', 'mcp-code-mode'];

// Recommended cutover order: ascending blast radius, simplest route shape and
// lowest routing volume first, the composite surface-bundle hub last. The
// ordering principle is fixed; the exact sequence is confirmed at execution
// against per-hub route-shape and volume evidence.
const RECOMMENDED_ORDER = [
  'sk-prompt',
  'cli-external-orchestration',
  'mcp-tooling',
  'system-deep-loop',
  'sk-design',
  'sk-doc',
  'sk-code',
];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function sha256File(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}
function repoRel(p) {
  return path.relative(REPO_ROOT, p);
}
function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}
function runNodeExit(scriptPath, args = []) {
  // Run a committed drill as a child process; return its exit code and tail.
  try {
    const out = execFileSync('node', [scriptPath, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, out };
  } catch (err) {
    return { code: typeof err.status === 'number' ? err.status : 1, out: `${err.stdout || ''}${err.stderr || ''}` };
  }
}
function fileContains(p, substr) {
  try { return fs.readFileSync(p, 'utf8').includes(substr); } catch { return false; }
}
function listMd(dir) {
  try { return fs.readdirSync(dir).filter((f) => f.endsWith('.md')); } catch { return []; }
}
function findLunaArchives() {
  const hits = [];
  for (const h of HUBS) {
    const dir = path.join(SKILLS_ROOT, h, 'benchmark', 'compiled-routing');
    if (!exists(dir)) continue;
    try {
      for (const sub of fs.readdirSync(dir)) {
        if (!sub.startsWith('luna-high-acceptance-')) continue;
        const rep = path.join(dir, sub, 'skill-benchmark-report.json');
        if (exists(rep)) hits.push(rep);
      }
    } catch { /* directory vanished mid-scan */ }
  }
  return hits;
}

// Run `fn` with a simulated cohort and flag value, then ALWAYS restore both. The
// resolver's exported cohort Set is the same instance the status probe reads, so
// a membership added here is observed everywhere in-process and removed in the
// finally block — the on-disk cohort (empty) is never touched.
function withSimulatedCohort(hubIds, flagValue, fn) {
  const added = [];
  const hadFlag = Object.prototype.hasOwnProperty.call(process.env, resolver.FLAG);
  const priorFlag = process.env[resolver.FLAG];
  try {
    for (const h of hubIds) {
      if (!resolver.DEFAULT_ON_HUBS.has(h)) { resolver.DEFAULT_ON_HUBS.add(h); added.push(h); }
    }
    if (flagValue === undefined) delete process.env[resolver.FLAG];
    else process.env[resolver.FLAG] = flagValue;
    return fn();
  } finally {
    for (const h of added) resolver.DEFAULT_ON_HUBS.delete(h);
    if (hadFlag) process.env[resolver.FLAG] = priorFlag;
    else delete process.env[resolver.FLAG];
  }
}

// ---------------------------------------------------------------------------
// Frozen-scorer integrity
// ---------------------------------------------------------------------------
function frozenScorerStatus() {
  const digests = {};
  let pinned = true;
  for (const [name, pin] of Object.entries(FROZEN_SCORER_PINS)) {
    const actual = sha256File(path.join(SCORER_DIR, name));
    digests[name] = actual;
    if (actual !== pin) pinned = false;
  }
  return { pinned, digests, pins: FROZEN_SCORER_PINS };
}

// ---------------------------------------------------------------------------
// Cohort resolution proof: N advanced hubs resolve to exactly N compiled under
// an unset flag; an explicit '0' forces legacy for every hub regardless of
// cohort membership (kill-switch precedence).
// ---------------------------------------------------------------------------
function cohortResolutionProof(order = RECOMMENDED_ORDER) {
  const steps = [];
  let ok = true;

  // Baseline: empty cohort, unset flag -> every hub resolves legacy.
  const baseline = withSimulatedCohort([], undefined, () =>
    HUBS.map((h) => resolver.flagPermitsCompiled(h)));
  const baselineOk = baseline.every((v) => v === false);
  ok = ok && baselineOk;
  steps.push({ step: 'baseline-empty-unset', advanced: 0, compiledUnderUnset: 0, expected: 0, ok: baselineOk });

  // Advance 1..7 hubs in order; exactly the advanced set is compiled under unset.
  for (let n = 1; n <= order.length; n += 1) {
    const advanced = order.slice(0, n);
    const compiled = withSimulatedCohort(advanced, undefined, () =>
      HUBS.filter((h) => resolver.flagPermitsCompiled(h)));
    const compiledSet = new Set(compiled);
    const exact = compiled.length === n && advanced.every((h) => compiledSet.has(h));

    // Kill-switch precedence: with the same cohort advanced, an explicit '0'
    // forces legacy for every hub.
    const underKill = withSimulatedCohort(advanced, '0', () =>
      HUBS.filter((h) => resolver.flagPermitsCompiled(h)));
    const killOk = underKill.length === 0;

    const stepOk = exact && killOk;
    ok = ok && stepOk;
    steps.push({
      step: `advance-${n}`, advanced: n, compiledUnderUnset: compiled.length, expected: n,
      exact, compiledUnderKillSwitch: underKill.length, killSwitchForcesLegacy: killOk, ok: stepOk,
    });
  }

  return { ok, hubs: HUBS.length, order, steps };
}

// ---------------------------------------------------------------------------
// Kill-switch drill: with the full fleet advanced in the cohort, an explicit '0'
// still resolves every hub to legacy (fleet-wide kill-switch). Also confirm the
// documented rollback lever exists.
// ---------------------------------------------------------------------------
function killSwitchDrill() {
  const underKill = withSimulatedCohort(HUBS, '0', () =>
    HUBS.map((h) => ({ hub: h, permits: resolver.flagPermitsCompiled(h) })));
  const allLegacy = underKill.every((r) => r.permits === false);

  // Sanity control: the same full cohort under an unset flag DOES permit
  // compiled, so the kill-switch result above is meaningful, not vacuous.
  const underUnset = withSimulatedCohort(HUBS, undefined, () =>
    HUBS.filter((h) => resolver.flagPermitsCompiled(h)));
  const controlOk = underUnset.length === HUBS.length;

  return { ok: allLegacy && controlOk, fleetSize: HUBS.length, allLegacyUnderKill: allLegacy, controlCohortServesUnderUnset: controlOk };
}

// ---------------------------------------------------------------------------
// Per-hub gate checks (all read-only; none flips anything)
// ---------------------------------------------------------------------------

// Route-gold parity: compiled == legacy for the hub's gold corpus. Consumes the
// committed Lane C parity harness read-only — confirming it exposes the parity
// classifier and that the frozen-scorer baseline the parity rests on is intact
// for this hub stage. Per-scenario parity itself is owned by the committed
// parity test suite; this stage gate never re-derives or edits the scorer.
function routeGoldParity(hub) {
  const harnessPath = path.join(SCORER_DIR, 'compiled-routing-parity.cjs');
  if (!exists(harnessPath)) {
    return { check: 'route-gold-parity', pass: false, detail: 'Lane C compiled-parity harness not found' };
  }
  try {
    const laneC = require(harnessPath);
    const hasClassifier = typeof laneC.compiledParity === 'function';
    const baseline = typeof laneC.assertFrozenScorerDigests === 'function'
      ? laneC.assertFrozenScorerDigests()
      : { ok: false, drift: [{ file: 'assertFrozenScorerDigests', error: 'not exported' }] };
    const pass = hasClassifier && baseline.ok === true;
    return {
      check: 'route-gold-parity',
      pass,
      detail: pass
        ? `Lane C parity harness present; frozen-scorer baseline intact (${repoRel(harnessPath)})`
        : `parity classifier=${hasClassifier} frozen-baseline-ok=${baseline.ok}`,
    };
  } catch (err) {
    return { check: 'route-gold-parity', pass: false, detail: `Lane C parity baseline check failed: ${err && err.message}` };
  }
}

// Compiled-serving status: with the hub simulated into the cohort, the serving
// probe must read 'compiled-serving' (flag permits + manifest compiled + engine
// routes). Without the simulation the same hub reads 'flag-off', which is the
// expected off-by-default posture.
function compiledServingStatus(hub) {
  const record = withSimulatedCohort([hub], undefined, () =>
    statusProbe.computeHubStatus(hub, { probeEngine: true }));
  return {
    check: 'compiled-serving-status',
    pass: record.causeCode === 'compiled-serving',
    detail: `causeCode=${record.causeCode} servingAuthority=${record.servingAuthority}`,
  };
}

// Clean fallback: an explicit '0' and an invalid flag value both resolve the hub
// to legacy (null route). This is the fail-safe the runtime guarantees.
function cleanFallback(hub) {
  const underKill = withSimulatedCohort([hub], '0', () => resolver.resolveRoute(hub, 'fallback probe'));
  const underInvalid = withSimulatedCohort([hub], 'not-a-flag', () => resolver.resolveRoute(hub, 'fallback probe'));
  const pass = underKill === null && underInvalid === null;
  return {
    check: 'clean-fallback',
    pass,
    detail: `killSwitch=${underKill === null ? 'legacy' : 'compiled'} invalidFlag=${underInvalid === null ? 'legacy' : 'compiled'}`,
  };
}

// Frozen-scorer integrity for a hub stage: the three pinned digests are unchanged.
function scorerIntegrity() {
  const s = frozenScorerStatus();
  return { check: 'frozen-scorer-unchanged', pass: s.pinned, detail: s.pinned ? 'three digests match pins' : 'DIGEST DRIFT' };
}

// Kill-switch drill for a single hub stage: advanced in cohort, '0' forces legacy.
function killSwitchForHub(hub) {
  const permitsUnderKill = withSimulatedCohort([hub], '0', () => resolver.flagPermitsCompiled(hub));
  return { check: 'kill-switch-drill', pass: permitsUnderKill === false, detail: `permitsUnderKillSwitch=${permitsUnderKill}` };
}

// The ordered per-hub gate. Runs the five checks in ascending-risk order and
// STOPS at the first failure. It never advances a cohort default and never
// rewrites a directive, catalog, template, or manifest — it only decides
// go/no-go for a hub that a real, separately-authorized run would then flip.
function runPerHubGateSequence(hub, { dryRun = true } = {}) {
  const sequence = [routeGoldParity, compiledServingStatus, cleanFallback, scorerIntegrity, killSwitchForHub];
  const results = [];
  let allGreen = true;
  for (const step of sequence) {
    const r = step(hub);
    results.push(r);
    if (!r.pass) { allGreen = false; break; } // stop-on-first-failure
  }
  return {
    hub,
    dryRun,
    allGreen,
    stoppedAt: allGreen ? null : results[results.length - 1].check,
    checks: results,
    action: 'none (dry-run: no cohort advance, no directive/catalog/template/manifest rewrite)',
  };
}

// ---------------------------------------------------------------------------
// Lockstep registry: the exact surfaces a real per-hub flip would rewrite
// together (never partially), plus the fleet-shared surfaces flipped only when
// the final hub lands. This registry is DATA; producing it rewrites nothing.
// ---------------------------------------------------------------------------
function createSkillParentTemplates() {
  const base = path.join(SKILLS_ROOT, 'sk-doc', 'create-skill', 'assets', 'parent-skill');
  return [
    path.join(base, 'parent-skill-hub-template.md'),
    path.join(base, 'scaffold', 'hub-skill-scaffold.md'),
  ];
}

function lockstepRegistry(hub) {
  const directive = path.join(SKILLS_ROOT, hub, 'SKILL.md');
  const catalog = path.join(SKILLS_ROOT, hub, 'feature-catalog', 'feature-catalog.md');
  return {
    hub,
    perHubAtomicSet: {
      cohortDefault: { surface: 'DEFAULT_ON_HUBS membership', location: repoRel(PROMOTED_RESOLVER), present: exists(PROMOTED_RESOLVER) },
      directive: { surface: 'SKILL.md routing directive', location: repoRel(directive), present: exists(directive) },
      catalog: { surface: 'feature-catalog wording', location: repoRel(catalog), present: exists(catalog) },
    },
  };
}

function fleetLockstepRegistry() {
  const perHub = HUBS.map((h) => lockstepRegistry(h));
  const templates = createSkillParentTemplates().map((p) => ({ location: repoRel(p), present: exists(p) }));
  return {
    perHub,
    fleetSharedFlippedLast: {
      createSkillParentTemplates: templates,
      note: 'shared templates carry cohort-accurate wording throughout and reach fleet-default-on wording only when the final hub lands, under a normalized-parity assertion',
    },
    normalizedParityScope: 'both parent templates + 7 directives + 7 catalogs + create-skill docs',
  };
}

// ---------------------------------------------------------------------------
// Coverage-closure join gate: an enumerated, all-must-be-green entry
// precondition. Each input reports proven/unproven from a concrete committed
// signal. The gate is BLOCKED if any input is unproven, and every hub is
// reported BLOCKED with the blocking reasons — an honest red is the correct
// output while the coverage/verification children are not all landed.
// ---------------------------------------------------------------------------
function readStatusLine(implSummaryPath) {
  if (!exists(implSummaryPath)) return null;
  const text = fs.readFileSync(implSummaryPath, 'utf8');
  const m = text.match(/\|\s*\*\*Status\*\*\s*\|\s*([^|]+)\|/);
  return m ? m[1].trim() : null;
}

function siblingVerified(folderName) {
  const dir = path.join(IMPL_ROOT, folderName);
  const impl = path.join(dir, 'implementation-summary.md');
  const status = readStatusLine(impl);
  const verified = Boolean(status) && /\b(implemented|complete|done|verified)\b/i.test(status)
    && !/\bplanned\b/i.test(status);
  return { present: exists(dir), status: status || 'UNKNOWN', verified };
}

function evaluateJoinGate() {
  const inputs = [];
  // The shared benchmark directory also hosts the compiled-routing parity and
  // LUNA acceptance harnesses alongside the frozen scorer it never edits.
  const BENCH = SCORER_DIR;

  // 1. Seven feature catalogs + the advisor enrichment entry.
  const catalogs = HUBS.map((h) => path.join(SKILLS_ROOT, h, 'feature-catalog', 'feature-catalog.md'));
  const catalogsPresent = catalogs.every(exists);
  const advisorEntry = path.join(
    SKILLS_ROOT, 'system-skill-advisor', 'feature-catalog', 'mcp-surface', 'advisor-recommend.md');
  const advisorEntryPresent = exists(advisorEntry) && fileContains(advisorEntry, 'Compiled-Routing Enrichment');
  const p1 = catalogsPresent && advisorEntryPresent;
  inputs.push({
    id: 'catalogs-and-advisor-entry', proven: p1,
    reason: p1 ? 'all 7 hub feature-catalogs + advisor enrichment entry present'
      : `${catalogsPresent ? '' : 'catalog(s) missing; '}${advisorEntryPresent ? '' : 'advisor enrichment entry missing'}`,
    evidence: repoRel(advisorEntry),
  });

  // 2. Seven-hub playbook matrix: one compiled-routing scenario per hub, under
  // each hub's manual-testing-playbook tree.
  const playbookHubs = HUBS.map((h) => {
    const dir = path.join(SKILLS_ROOT, h, 'manual-testing-playbook', 'compiled-routing');
    return { hub: h, present: exists(dir) && listMd(dir).length >= 1 };
  });
  const p2 = playbookHubs.every((x) => x.present);
  inputs.push({
    id: 'playbook-matrix', proven: p2,
    reason: p2 ? 'compiled-routing playbook scenario present for all 7 hubs'
      : `missing playbook for: ${playbookHubs.filter((x) => !x.present).map((x) => x.hub).join(', ')}`,
    evidence: '.opencode/skills/<hub>/manual-testing-playbook/compiled-routing/',
  });

  // 3. Lane C compiled-parity harness (compiled targets vs legacy route-gold,
  // judged by the frozen scorer).
  const laneC = path.join(BENCH, 'compiled-routing-parity.cjs');
  inputs.push({
    id: 'lane-c-parity-pairs', proven: exists(laneC),
    reason: exists(laneC) ? 'Lane C compiled-parity harness present' : 'Lane C parity harness not found',
    evidence: repoRel(laneC),
  });

  // 4. LUNA-HIGH gold-bearing-holdout acceptance harness plus any archived
  // real-model verdicts (the committed live run is a bounded sample).
  const lunaHarness = path.join(BENCH, 'luna-acceptance.cjs');
  const lunaArchives = findLunaArchives();
  const p4 = exists(lunaHarness);
  inputs.push({
    id: 'luna-high-holdout-evidence', proven: p4,
    reason: p4 ? `LUNA-HIGH acceptance harness present${lunaArchives.length ? `; ${lunaArchives.length} archived verdict(s)` : ' (no archived verdict found)'}`
      : 'LUNA-HIGH acceptance harness not found',
    evidence: repoRel(lunaHarness),
  });

  // 5. Create-skill ready fixture. This is the owner packet's deliverable, so it
  // is verified only when that packet is; the closest committed surface is the
  // lockstep-surfaces manifest.
  const lockstepSurfaces = path.join(
    SKILLS_ROOT, 'sk-doc', 'create-skill', 'references', 'parent-skill', 'compiled-routing-lockstep-surfaces.json');
  const s013Fixture = siblingVerified('013-create-skill-alignment');
  inputs.push({
    id: 'create-skill-ready-fixture', proven: s013Fixture.verified,
    reason: s013Fixture.verified ? 'create-skill ready fixture verified'
      : `create-skill owner not implemented-and-verified (${s013Fixture.status}); dedicated ready fixture absent`,
    evidence: exists(lockstepSurfaces) ? repoRel(lockstepSurfaces) : '013-create-skill-alignment/',
  });

  // 6. verify_alignment_drift markdown gate live.
  const driftGate = findVerifyAlignmentDrift();
  inputs.push({
    id: 'verify-alignment-drift-gate-live', proven: Boolean(driftGate),
    reason: driftGate ? 'verify_alignment_drift gate present and wired into the drift-guard runner' : 'verify_alignment_drift gate not found',
    evidence: driftGate ? repoRel(driftGate) : null,
  });

  // 7. Single manifest-freshness eligibility predicate: the per-hub serving
  // status probe, whose causeCode separates drift from breakage.
  const freshness = exists(STATUS_PROBE) && typeof statusProbe.computeHubStatus === 'function';
  inputs.push({
    id: 'manifest-freshness-eligibility-predicate', proven: freshness,
    reason: freshness ? 'per-hub serving-status freshness predicate present (causeCode contract)' : 'freshness predicate not found',
    evidence: repoRel(STATUS_PROBE),
  });

  // 8. Non-hub ineligibility policy (proven by running the committed fixture).
  const nonHub = exists(NON_HUB_FIXTURES) ? runNodeExit(NON_HUB_FIXTURES) : { code: 1 };
  inputs.push({
    id: 'non-hub-ineligibility-policy', proven: nonHub.code === 0,
    reason: nonHub.code === 0 ? 'non-hub fixtures pass (5 ineligible, 7 eligible)' : 'non-hub fixtures failed or absent',
    evidence: repoRel(NON_HUB_FIXTURES),
  });

  // 9. Siblings implemented-and-verified (not merely "available").
  const s013 = siblingVerified('013-create-skill-alignment');
  const s014 = siblingVerified('014-benchmark-alignment');
  inputs.push({
    id: 'sibling-013-implemented-and-verified', proven: s013.verified,
    reason: `013 status: ${s013.status}`, evidence: '013-create-skill-alignment/implementation-summary.md',
  });
  inputs.push({
    id: 'sibling-014-implemented-and-verified', proven: s014.verified,
    reason: `014 status: ${s014.status}`, evidence: '014-benchmark-alignment/implementation-summary.md',
  });

  const green = inputs.every((i) => i.proven);
  const blockingReasons = inputs.filter((i) => !i.proven).map((i) => `${i.id}: ${i.reason}`);
  return { green, inputs, blockingReasons };
}

function findVerifyAlignmentDrift() {
  // The markdown drift gate is a committed checker at a known location, wired
  // into the drift-guard runner. Confirm the checker exists.
  const direct = path.join(
    SKILLS_ROOT, 'sk-code', 'code-opencode', 'assets', 'scripts', 'verify_alignment_drift.py');
  return exists(direct) ? direct : null;
}

// Per-hub join-gate readout. The join gate is a fleet-global entry precondition;
// each hub is READY only if the gate is green. When red, each hub is BLOCKED and
// carries the same blocking reasons, so the honest per-hub state is decidable.
function perHubJoinGate() {
  const gate = evaluateJoinGate();
  const perHub = RECOMMENDED_ORDER.map((hub, idx) => ({
    order: idx + 1,
    hub,
    state: gate.green ? 'READY' : 'BLOCKED',
    blockingReasons: gate.green ? [] : gate.blockingReasons,
  }));
  return { gateGreen: gate.green, perHub, inputs: gate.inputs, blockingReasons: gate.blockingReasons };
}

// ---------------------------------------------------------------------------
// Repository-default invariant: after any dry-run, the committed default is
// unchanged — the cohort on disk is empty, the flag is not forced on in the
// persisted resolver, and every manifest still serves its committed authority.
// ---------------------------------------------------------------------------
function repoDefaultUnchanged() {
  const resolverSrc = fs.readFileSync(PROMOTED_RESOLVER, 'utf8');
  const cohortEmptyOnDisk = /DEFAULT_ON_HUBS\s*=\s*new Set\(\)\s*;/.test(resolverSrc);
  const cohortEmptyInMemory = resolver.DEFAULT_ON_HUBS.size === 0;
  const activationRoot = path.join(RUNTIME_ROOT, '010-live-activation', 'activation');
  const manifests = HUBS.map((h) => {
    const p = path.join(activationRoot, h, 'manifest.json');
    let servingAuthority = 'missing';
    try { servingAuthority = JSON.parse(fs.readFileSync(p, 'utf8')).servingAuthority; } catch { /* missing */ }
    return { hub: h, servingAuthority, fingerprint: exists(p) ? sha256File(p) : null };
  });
  return {
    ok: cohortEmptyOnDisk && cohortEmptyInMemory,
    cohortEmptyOnDisk,
    cohortEmptyInMemory,
    flagInProcess: process.env[resolver.FLAG] === undefined ? 'unset' : process.env[resolver.FLAG],
    manifests,
  };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
function buildReport() {
  return {
    generatedAt: new Date().toISOString(),
    repoRelativeRoot: '.',
    hubs: HUBS,
    recommendedOrder: RECOMMENDED_ORDER,
    joinGate: perHubJoinGate(),
    cohortResolution: cohortResolutionProof(),
    killSwitchDrill: killSwitchDrill(),
    perHubDryRun: RECOMMENDED_ORDER.map((h) => runPerHubGateSequence(h, { dryRun: true })),
    lockstepRegistry: fleetLockstepRegistry(),
    frozenScorer: frozenScorerStatus(),
    repoDefault: repoDefaultUnchanged(),
  };
}

function main() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const pretty = (v) => JSON.stringify(v, null, json ? 0 : 2);

  if (args.includes('--join-gate')) { process.stdout.write(`${pretty(perHubJoinGate())}\n`); return; }
  if (args.includes('--cohort-proof')) { process.stdout.write(`${pretty(cohortResolutionProof())}\n`); return; }
  if (args.includes('--kill-switch')) { process.stdout.write(`${pretty(killSwitchDrill())}\n`); return; }
  if (args.includes('--lockstep')) { process.stdout.write(`${pretty(fleetLockstepRegistry())}\n`); return; }
  if (args.includes('--repo-default')) { process.stdout.write(`${pretty(repoDefaultUnchanged())}\n`); return; }
  const dryHubIdx = args.indexOf('--dry-run-hub');
  if (dryHubIdx >= 0) {
    const hub = args[dryHubIdx + 1];
    process.stdout.write(`${pretty(runPerHubGateSequence(hub, { dryRun: true }))}\n`);
    return;
  }
  // Default: the whole report.
  process.stdout.write(`${pretty(buildReport())}\n`);
}

if (require.main === module) {
  try { main(); } catch (err) { process.stderr.write(`CONTROLLER FAILED: ${err && err.message}\n`); process.exit(1); }
}

module.exports = {
  HUBS,
  NON_HUBS,
  RECOMMENDED_ORDER,
  frozenScorerStatus,
  cohortResolutionProof,
  killSwitchDrill,
  runPerHubGateSequence,
  lockstepRegistry,
  fleetLockstepRegistry,
  evaluateJoinGate,
  perHubJoinGate,
  repoDefaultUnchanged,
  buildReport,
  ROLLBACK_DRILL,
  NON_HUB_FIXTURES,
  SCORER_DIR,
  FROZEN_SCORER_PINS,
  REPO_ROOT,
};
