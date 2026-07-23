import { describe, it, expect, afterAll } from 'vitest';
import { cpSync, mkdtempSync, appendFileSync, readFileSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SKILL_ROOT = resolve(__dirname, '..', '..', '..');
const SB = join(SKILL_ROOT, 'scripts', 'skill-benchmark');
const REPO_SKILLS = resolve(SKILL_ROOT, '..', '..');
const REPO_ROOT = resolve(REPO_SKILLS, '..', '..');
const ROLLOUT_ROOT = join(
  REPO_ROOT,
  '.opencode', 'specs', 'sk-doc', '019-skill-routing-refactor', '020-router-unification-program',
  '007-unified-refactor-implementation', '006-parent-hub-rollout',
);

const parity = require(join(SB, 'compiled-routing-parity.cjs'));
const { evaluateRouteGold } = require(join(SB, 'score-skill-benchmark.cjs'));
const { renderReport } = require(join(SB, 'build-report.cjs'));
const { resolveCompiledParity } = require(join(SB, 'run-skill-benchmark.cjs'));
const { qualifiedIdToLeaf } = require(
  join(REPO_SKILLS, 'sk-doc', 'create-skill', 'scripts', 'lib', 'leaf-resource-contract.cjs'),
);

const FROZEN_TRIO = ['router-replay.cjs', 'score-skill-benchmark.cjs', 'load-playbook-scenarios.cjs'];

const tempDirs: string[] = [];
function tempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}
afterAll(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

// A minimal intent-gold scenario plus a legacy observed that the frozen
// evaluator scores as a pass — the fixed point every status fixture perturbs.
const PASS_SCENARIO = {
  scenarioId: 'T-fixture', classKind: 'routing', hasIntentGold: true,
  expectedIntents: ['quality'], source: { shape: 'generic' },
};
function legacyPassObserved() {
  const observed = { observedIntents: ['quality'], observedResources: [] };
  return { ...observed, routeGold: evaluateRouteGold({ scenario: PASS_SCENARIO, observed }) };
}
function target(workflowMode: string, packet: string, backend: string) {
  return { skillId: 'sk-code', workflowMode, packetId: packet, packetKind: 'workflow', backendKind: backend };
}

describe('compiled-routing-parity: frozen-scorer pin', () => {
  it('matches the pinned digests of the real frozen trio', () => {
    const gate = parity.assertFrozenScorerDigests({ scorerDir: SB });
    expect(gate.ok).toBe(true);
    expect(gate.drift).toEqual([]);
    expect(gate.digests).toEqual(parity.PINNED_FROZEN_SCORER_DIGESTS);
  });

  it('aborts on a seeded one-byte drift, naming the changed file', () => {
    const dir = tempDir('parity-pin-');
    for (const f of FROZEN_TRIO) cpSync(join(SB, f), join(dir, f));
    appendFileSync(join(dir, 'router-replay.cjs'), '\n// drift\n');
    const gate = parity.assertFrozenScorerDigests({ scorerDir: dir });
    expect(gate.ok).toBe(false);
    expect(gate.drift.map((d: any) => d.file)).toContain('router-replay.cjs');
  });

  it('aborts when a frozen file is missing', () => {
    const dir = tempDir('parity-pin-missing-');
    cpSync(join(SB, 'router-replay.cjs'), join(dir, 'router-replay.cjs'));
    const gate = parity.assertFrozenScorerDigests({ scorerDir: dir });
    expect(gate.ok).toBe(false);
    expect(gate.drift.length).toBeGreaterThanOrEqual(2);
  });
});

describe('compiled-routing-parity: vacuous-parity guard', () => {
  const hubs = [...parity.loadEligibleHubs()];

  it('every live hub manifest reads servingAuthority: compiled', () => {
    expect(hubs.length).toBe(7);
    for (const hub of hubs) {
      const manifest = JSON.parse(readFileSync(join(parity.ACTIVATION_ROOT, hub, 'manifest.json'), 'utf8'));
      expect(manifest.servingAuthority).toBe('compiled');
    }
  });

  it('a real compiled-serving hub is not vacuous', () => {
    for (const hub of hubs) {
      const res = parity.compiledParity(
        { scenario: PASS_SCENARIO, legacyObserved: legacyPassObserved(), skillRoot: join(REPO_SKILLS, hub), skillId: hub },
        { compiledDecision: () => ({ action: 'defer', targets: [] }) },
      );
      expect(res.status).not.toBe(parity.PARITY_STATUS.VACUOUS);
    }
  });

  it('a synthetic legacy manifest hard-fails vacuous, never match', () => {
    const res = parity.compiledParity(
      { scenario: PASS_SCENARIO, legacyObserved: legacyPassObserved(), skillRoot: join(REPO_SKILLS, 'sk-code'), skillId: 'sk-code' },
      { readServingAuthority: () => 'legacy', compiledDecision: () => ({ action: 'route', targets: [target('quality', 'code-quality', 'surface-router')] }) },
    );
    expect(res.status).toBe(parity.PARITY_STATUS.VACUOUS);
    expect(res.status).not.toBe(parity.PARITY_STATUS.MATCH);
  });

  it('a missing manifest records legacy-by-construction without a compiled failure', () => {
    const res = parity.compiledParity(
      { scenario: PASS_SCENARIO, legacyObserved: legacyPassObserved(), skillRoot: join(REPO_SKILLS, 'sk-code'), skillId: 'sk-code' },
      { readServingAuthority: () => null },
    );
    expect(res.status).toBe(parity.PARITY_STATUS.NA);
    expect(res.reason).toBe('legacy-by-construction');
  });
});

describe('compiled-routing-parity: qualifiedIdToLeaf bijection', () => {
  const manifestCache = new Map<string, Record<string, unknown>>();
  const modeIndexFor = (hub: string): Record<string, unknown> => {
    if (manifestCache.has(hub)) return manifestCache.get(hub)!;
    const idx: Record<string, unknown> = {};
    const manifestPath = join(REPO_SKILLS, hub, 'leaf-manifest.json');
    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
      for (const m of manifest.modes || []) idx[m.workflowMode] = m;
    }
    manifestCache.set(hub, idx);
    return idx;
  };

  it('every compiled route-gold targetQualifiedId resolves against its destination hub leaf-manifest', () => {
    let hubsChecked = 0;
    let idsChecked = 0;
    for (const child of readdirSync(ROLLOUT_ROOT)) {
      const goldPath = join(ROLLOUT_ROOT, child, 'compiled', 'route-gold.typed.json');
      if (!existsSync(goldPath)) continue;
      const gold = JSON.parse(readFileSync(goldPath, 'utf8'));
      hubsChecked += 1;
      for (const c of gold.cases || []) {
        for (const qid of c.targetQualifiedIds || []) {
          // A compiled target names its destination hub, which may differ from
          // the route-gold's own hub (a hub routes across to another hub's mode).
          const destinationHub = String(qid).split('/')[0];
          const resolved = qualifiedIdToLeaf(qid, { modeIndex: modeIndexFor(destinationHub) });
          expect(resolved.ok, `unresolved qualifiedId ${qid} (destination hub ${destinationHub})`).toBe(true);
          idsChecked += 1;
        }
      }
    }
    expect(hubsChecked).toBeGreaterThanOrEqual(7);
    expect(idsChecked).toBeGreaterThan(0);
  });

  it('translateTargetsToObserved resolves a target against its destination hub', () => {
    const loader = (hub: string) => (hub === 'sk-code'
      ? { quality: { workflowMode: 'quality', packet: 'code-quality', leaves: ['references/config/quick-reference.md'] } }
      : {});
    const bridged = parity.translateTargetsToObserved([target('quality', 'code-quality', 'surface-router')], loader);
    expect(bridged.unresolved).toEqual([]);
    expect(bridged.observedIntents).toContain('quality');
    // Packet-qualified (`<packet>/<leaf>`), matching legacy's own hub-relative
    // addressing -- a leaf-manifest's native packet-root-relative form would
    // never string-match legacy's observedResources or a scenario's gold.
    expect(bridged.observedResources).toContain('code-quality/references/config/quick-reference.md');
  });

  it('translateTargetsToObserved packet-qualifies leaves to match legacy addressing', () => {
    const loader = (hub: string) => (hub === 'sk-code'
      ? { 'code-webflow': { workflowMode: 'code-webflow', packet: 'code-webflow', leaves: ['references/animation/quick-start.md'] } }
      : {});
    const bridged = parity.translateTargetsToObserved(
      [target('code-webflow', 'code-webflow', 'evidence-base')], loader,
    );
    // The leaf-manifest-native (unqualified) form must NOT survive -- it is a
    // different string space than legacy's hub-relative, packet-prefixed one.
    expect(bridged.observedResources).not.toContain('references/animation/quick-start.md');
    expect(bridged.observedResources).toContain('code-webflow/references/animation/quick-start.md');
  });

  it('translateTargetsToObserved fails closed on an unknown workflow mode', () => {
    const loader = () => ({ quality: { workflowMode: 'quality', packet: 'code-quality', leaves: [] } });
    const bridged = parity.translateTargetsToObserved([target('ghost-mode', 'x', 'y')], loader);
    expect(bridged.unresolved.length).toBe(1);
    expect(bridged.observedIntents).toEqual([]);
  });
});

describe('compiled-routing-parity: flag-state matrix', () => {
  it('unset / 0 / 1 / invalid produce four distinct, correct states', () => {
    const states = {
      unset: parity.classifyFlagState(undefined),
      zero: parity.classifyFlagState('0'),
      one: parity.classifyFlagState('1'),
      invalid: parity.classifyFlagState('yes'),
    };
    expect(states.unset.state).toBe('unset');
    expect(states.zero.state).toBe('force-legacy');
    expect(states.one.state).toBe('force-on');
    expect(states.invalid.state).toBe('invalid');
    const labels = Object.values(states).map((s: any) => s.state);
    expect(new Set(labels).size).toBe(4);
    // Post-cutover both force-on and unset (default) permit compiled serving for an
    // eligible hub; only force-legacy and invalid fall back to legacy.
    expect(states.one.permitsCompiledWhenEligible).toBe(true);
    expect(states.unset.permitsCompiledWhenEligible).toBe(true);
    expect(states.zero.permitsCompiledWhenEligible).toBe(false);
    expect(states.invalid.permitsCompiledWhenEligible).toBe(false);
  });

  it('an invalid value is a defined outcome, never coerced to 0 or 1', () => {
    const two = parity.classifyFlagState('2');
    expect(two.state).toBe('invalid');
    expect(two.note).toMatch(/fails closed/);
  });
});

describe('compiled-routing-parity: verdict sub-state (no OR-collapse)', () => {
  const rowsWith = (statuses: string[]) => statuses.map((status, i) => ({ scenarioId: `S${i}`, compiledParity: { status } }));

  it('rolls up three distinct sub-verdicts', () => {
    const serving = parity.rollupCompiledParity(rowsWith(['match', 'match', 'n/a']));
    const drifted = parity.rollupCompiledParity(rowsWith(['match', 'drift']));
    const vacuousDrift = parity.rollupCompiledParity(rowsWith(['match', 'vacuous']));
    const broken = parity.rollupCompiledParity(rowsWith(['match', 'resolver-missing', 'drift']));
    expect(serving.subVerdict).toBe(parity.COMPILED_SUBVERDICT.SERVING);
    expect(drifted.subVerdict).toBe(parity.COMPILED_SUBVERDICT.DRIFTED);
    expect(vacuousDrift.subVerdict).toBe(parity.COMPILED_SUBVERDICT.DRIFTED);
    expect(broken.subVerdict).toBe(parity.COMPILED_SUBVERDICT.BROKEN);
    const distinct = new Set([serving.subVerdict, drifted.subVerdict, broken.subVerdict]);
    expect(distinct.size).toBe(3);
  });

  it('only drift and broken block; serving and n/a do not', () => {
    expect(parity.rollupCompiledParity(rowsWith(['match'])).blocking).toBe(false);
    expect(parity.rollupCompiledParity(rowsWith(['n/a'])).blocking).toBe(false);
    expect(parity.rollupCompiledParity(rowsWith(['drift'])).blocking).toBe(true);
    expect(parity.rollupCompiledParity(rowsWith(['resolver-missing'])).blocking).toBe(true);
  });

  it('raises a distinct outer verdict without collapsing route-gold into it', () => {
    // serving -> passthrough; drift/broken -> its own verdict; an existing
    // route-gold block is never overwritten. Three distinct outer verdicts.
    expect(parity.applyCompiledDriftVerdict('PASS', false)).toBe('PASS');
    expect(parity.applyCompiledDriftVerdict('PASS', true)).toBe('BLOCKED-BY-COMPILED-DRIFT');
    expect(parity.applyCompiledDriftVerdict('CONDITIONAL', true)).toBe('BLOCKED-BY-COMPILED-DRIFT');
    expect(parity.applyCompiledDriftVerdict('BLOCKED-BY-ROUTE-GOLD', true)).toBe('BLOCKED-BY-ROUTE-GOLD');
    expect(parity.applyCompiledDriftVerdict('BLOCKED-BY-STRUCTURE', true)).toBe('BLOCKED-BY-STRUCTURE');
    const outcomes = new Set([
      parity.applyCompiledDriftVerdict('PASS', false),
      parity.applyCompiledDriftVerdict('PASS', true),
      parity.applyCompiledDriftVerdict('BLOCKED-BY-ROUTE-GOLD', true),
    ]);
    expect(outcomes.size).toBe(3);
  });

  it('names exactly one blocking drift-gate owner; other consumers are report-only', () => {
    const rollup = parity.rollupCompiledParity(rowsWith(['drift']));
    expect(rollup.gate.owner).toBe(parity.DRIFT_GATE_OWNER);
    expect(rollup.gate.isBlockingOwner).toBe(true);
    expect(rollup.gate.reportOnlyConsumers.length).toBeGreaterThanOrEqual(1);
  });
});

describe('compiled-routing-parity: per-scenario status fixtures', () => {
  const skillRoot = join(REPO_SKILLS, 'sk-code');

  it('match: compiled and legacy agree under the frozen evaluator', () => {
    const res = parity.compiledParity(
      { scenario: PASS_SCENARIO, legacyObserved: legacyPassObserved(), skillRoot, skillId: 'sk-code' },
      { readServingAuthority: () => 'compiled', compiledDecision: () => ({ action: 'route', targets: [target('quality', 'code-quality', 'surface-router')] }) },
    );
    expect(res.status).toBe(parity.PARITY_STATUS.MATCH);
  });

  it('drift: compiled routes to a different mode than legacy', () => {
    const res = parity.compiledParity(
      { scenario: PASS_SCENARIO, legacyObserved: legacyPassObserved(), skillRoot, skillId: 'sk-code' },
      { readServingAuthority: () => 'compiled', compiledDecision: () => ({ action: 'route', targets: [target('code-review', 'code-review', 'review-cache')] }) },
    );
    expect(res.status).toBe(parity.PARITY_STATUS.DRIFT);
  });

  it('vacuous: manifest not serving compiled', () => {
    const res = parity.compiledParity(
      { scenario: PASS_SCENARIO, legacyObserved: legacyPassObserved(), skillRoot, skillId: 'sk-code' },
      { readServingAuthority: () => 'legacy' },
    );
    expect(res.status).toBe(parity.PARITY_STATUS.VACUOUS);
  });

  it('broken: compiled engine throws -> resolver-missing', () => {
    const res = parity.compiledParity(
      { scenario: PASS_SCENARIO, legacyObserved: legacyPassObserved(), skillRoot, skillId: 'sk-code' },
      { readServingAuthority: () => 'compiled', compiledDecision: () => { throw new Error('engine down'); } },
    );
    expect(res.status).toBe(parity.PARITY_STATUS.RESOLVER_MISSING);
  });

  it('broken: an unresolvable qualified id fails closed to resolver-missing', () => {
    const res = parity.compiledParity(
      { scenario: PASS_SCENARIO, legacyObserved: legacyPassObserved(), skillRoot, skillId: 'sk-code' },
      { readServingAuthority: () => 'compiled', compiledDecision: () => ({ action: 'route', targets: [target('ghost-mode', 'x', 'y')] }) },
    );
    expect(res.status).toBe(parity.PARITY_STATUS.RESOLVER_MISSING);
  });

  it('n/a: a hub outside the compiled serving closure is informational', () => {
    const res = parity.compiledParity(
      { scenario: PASS_SCENARIO, legacyObserved: legacyPassObserved(), skillRoot, skillId: 'not-a-hub' },
    );
    expect(res.status).toBe(parity.PARITY_STATUS.NA);
  });

  it('calls the frozen evaluator, does not re-implement it', () => {
    let calls = 0;
    const spy = (args: any) => { calls += 1; return evaluateRouteGold(args); };
    const res = parity.compiledParity(
      { scenario: PASS_SCENARIO, legacyObserved: { observedIntents: ['quality'], observedResources: [] }, skillRoot, skillId: 'sk-code' },
      { readServingAuthority: () => 'compiled', compiledDecision: () => ({ action: 'route', targets: [target('quality', 'code-quality', 'surface-router')] }), evaluate: spy },
    );
    expect(calls).toBe(2);
    expect(res.status).toBe(parity.PARITY_STATUS.MATCH);
  });

  it('stale manifest state is drift with re-mint-required', () => {
    const res = parity.compiledParity(
      { scenario: PASS_SCENARIO, legacyObserved: legacyPassObserved(), skillRoot, skillId: 'sk-code' },
      { statusProbe: () => ({
        servingAuthority: 'compiled', causeCode: 'compiled-serving',
        manifestFreshness: { manifestValid: true, fresh: false, causeCode: 'stale-manifest' },
      }) },
    );
    expect(res.status).toBe(parity.PARITY_STATUS.DRIFT);
    expect(res.reason).toBe('re-mint-required');
  });

  it('malformed manifest state is compiled breakage', () => {
    const res = parity.compiledParity(
      { scenario: PASS_SCENARIO, legacyObserved: legacyPassObserved(), skillRoot, skillId: 'sk-code' },
      { statusProbe: () => ({
        servingAuthority: 'legacy', causeCode: 'missing-manifest',
        manifestFreshness: { manifestValid: false, fresh: false, causeCode: 'invalid-manifest' },
      }) },
    );
    expect(res.status).toBe(parity.PARITY_STATUS.RESOLVER_MISSING);
    expect(res.reason).toBe('manifest-invalid-or-unreadable');
  });

  it('both sides failing the same pre-existing gold gap, under matching routing, is parity not drift', () => {
    // Parity is "compiled behaves identically to legacy" (same routing AND the
    // same gold outcome), decoupled from gold-achievability. Both compiled and
    // legacy route to 'quality' (matching projection) and both fail the SAME
    // authored gold (which expects 'code-review') -- compiled tracked legacy
    // exactly, so this is match, not drift.
    const wrongScenario = { ...PASS_SCENARIO, expectedIntents: ['code-review'] };
    const wrongLegacy = { observedIntents: ['quality'], observedResources: [] };
    const res = parity.compiledParity(
      { scenario: wrongScenario, legacyObserved: wrongLegacy, skillRoot, skillId: 'sk-code' },
      { readServingAuthority: () => 'compiled', compiledDecision: () => ({ action: 'route', targets: [target('quality', 'code-quality', 'surface-router')] }) },
    );
    expect(res.status).toBe(parity.PARITY_STATUS.MATCH);
    expect(res.compiledGoldPass).toBe(false);
    expect(res.legacyGoldPass).toBe(false);
    expect(res.firstDifference).toBeNull();
  });

  it('adversarial: a real misroute still drifts even when both sides fail gold identically', () => {
    // compiledGoldPass === legacyGoldPass (both false) alone must never be
    // sufficient for match -- firstDifference===null is a mandatory, separate
    // conjunct. Compiled routes to 'code-review'; legacy routed to 'quality';
    // neither matches the authored gold ('some-other-mode'), so the gold axis
    // trivially agrees (both fail) while the routing axis genuinely disagrees.
    const wrongScenario = { ...PASS_SCENARIO, expectedIntents: ['some-other-mode'] };
    const legacyObserved = { observedIntents: ['quality'], observedResources: [] };
    const res = parity.compiledParity(
      { scenario: wrongScenario, legacyObserved, skillRoot, skillId: 'sk-code' },
      { readServingAuthority: () => 'compiled', compiledDecision: () => ({ action: 'route', targets: [target('code-review', 'code-review', 'review-cache')] }) },
    );
    expect(res.compiledGoldPass).toBe(false);
    expect(res.legacyGoldPass).toBe(false);
    expect(res.firstDifference).not.toBeNull();
    expect(res.status).toBe(parity.PARITY_STATUS.DRIFT);
  });

  it('adversarial: a real compiled leaf-manifest gap still drifts even with apples-to-apples resource granularity', () => {
    // Targets match (both route to 'code-webflow' alone) and the resource
    // comparison is granularity-corrected, but compiled's own declared leaves
    // for that target are genuinely missing one legacy selected and gold
    // requires. The projection filter must not be able to manufacture a leaf
    // compiled never declared -- this is a real compiled-only regression, not
    // a granularity artifact, and must still fail gold and report drift.
    const scenario = {
      scenarioId: 'ADV-leaf-gap', classKind: 'routing', hasResourceGold: true,
      expectedResources: [
        'code-webflow/references/animation/quick-start.md',
        'code-webflow/references/animation/decision-matrix.md',
      ],
      forbiddenResources: [],
      source: { shape: 'sk-code' },
    };
    const legacyObserved = {
      observedIntents: ['code-webflow'],
      observedResources: [
        'code-webflow/references/animation/quick-start.md',
        'code-webflow/references/animation/decision-matrix.md',
      ],
    };
    // Compiled's manifest declares ONLY quick-start.md for code-webflow --
    // decision-matrix.md is a genuine gap, never resolvable via intersection.
    const loader = (hub: string) => (hub === 'sk-code'
      ? { 'code-webflow': { workflowMode: 'code-webflow', packet: 'code-webflow', leaves: ['references/animation/quick-start.md'] } }
      : {});
    const res = parity.compiledParity(
      { scenario, legacyObserved, skillRoot, skillId: 'sk-code' },
      {
        readServingAuthority: () => 'compiled',
        compiledDecision: () => ({ action: 'route', targets: [target('code-webflow', 'code-webflow', 'evidence-base')] }),
        loadModeIndex: loader,
      },
    );
    expect(res.firstDifference).toBeNull();
    expect(res.legacyGoldPass).toBe(true);
    expect(res.compiledGoldPass).toBe(false);
    expect(res.status).toBe(parity.PARITY_STATUS.DRIFT);
  });

  it('a coarse compiled declaration, once projected to legacy granularity, matches when compiled truly has no gap', () => {
    // The positive twin of the leaf-gap adversarial test: compiled's manifest
    // declares the FULL mode (a superset including resources this task never
    // needed), legacy's replay selected only a task-scoped subset. Once
    // projected to legacy's granularity, compiled has no real gap, so this is
    // match -- proving the fix narrows over-broad declarations rather than
    // failing them outright.
    const scenario = {
      scenarioId: 'POS-coarse', classKind: 'routing', hasResourceGold: true,
      expectedResources: ['code-webflow/references/animation/quick-start.md'],
      forbiddenResources: ['code-webflow/references/implementation/'],
      source: { shape: 'sk-code' },
    };
    const legacyObserved = {
      observedIntents: ['code-webflow'],
      observedResources: ['references/universal/code-quality-standards.md', 'code-webflow/references/animation/quick-start.md'],
    };
    // Compiled's FULL declaration for code-webflow spans far more than this
    // task needs (including a forbidden-prefixed implementation leaf).
    const loader = (hub: string) => (hub === 'sk-code'
      ? {
        'code-webflow': {
          workflowMode: 'code-webflow', packet: 'code-webflow',
          leaves: [
            'references/animation/quick-start.md',
            'references/implementation/webflow-patterns/overview-limits-and-collection-lists.md',
          ],
        },
      }
      : {});
    const res = parity.compiledParity(
      { scenario, legacyObserved, skillRoot, skillId: 'sk-code' },
      {
        readServingAuthority: () => 'compiled',
        compiledDecision: () => ({ action: 'route', targets: [target('code-webflow', 'code-webflow', 'evidence-base')] }),
        loadModeIndex: loader,
      },
    );
    expect(res.firstDifference).toBeNull();
    expect(res.legacyGoldPass).toBe(true);
    expect(res.compiledGoldPass).toBe(true);
    expect(res.status).toBe(parity.PARITY_STATUS.MATCH);
  });

  it('SD-015 clause: a matched non-route decision is parity even when a surface-layer resource gold disagrees', () => {
    // Lock-in for the SD-015 fix (commit 6ba5f2957f): a non-route decision
    // (defer/clarify/reject) carries no resources by schema -- route-gold
    // resources ride only on route.targets. Mirrors the real sk-doc SD-015 case:
    // compiled and legacy both correctly defer (firstDifference null), but
    // legacy's own resource gold reflects the retained legacy surface layer
    // (smart-routing.md) that a defer's legacy fallback reaches and the
    // compiled router never replaces. That must still be parity, not drift.
    const scenario = {
      scenarioId: 'FIX-SD015-defer-match', classKind: 'routing', hasResourceGold: true,
      expectedResources: ['code-quality/references/config/quick-reference.md'],
      source: { shape: 'generic' },
    };
    const legacyObserved = {
      observedIntents: [],
      observedResources: ['code-quality/references/config/quick-reference.md'],
    };
    const loader = () => ({ quality: { workflowMode: 'quality', packet: 'code-quality', leaves: [] } });
    const res = parity.compiledParity(
      { scenario, legacyObserved, skillRoot, skillId: 'sk-code' },
      {
        readServingAuthority: () => 'compiled',
        compiledDecision: () => ({ action: 'defer', targets: [] }),
        loadModeIndex: loader,
      },
    );
    expect(res.firstDifference).toBeNull();
    expect(res.compiledAction).toBe('defer');
    expect(res.legacyGoldPass).toBe(true);
    expect(res.compiledGoldPass).toBe(false);
    expect(res.status).toBe(parity.PARITY_STATUS.MATCH);
    expect(res.reason).toBe('routing-parity-match');
  });

  it('adversarial: the SD-015 exemption does not leak to a served route with a real compiled resource gap', () => {
    // Twin of the SD-015-match test above with exactly one axis flipped:
    // compiled SERVES the same target legacy does (action: 'route', matching
    // workflowMode) instead of deferring. `decision.action !== 'route'` is now
    // false, so the SD-015 disjunct cannot apply -- a genuine
    // compiledGoldPass/legacyGoldPass disagreement on a route compiled actually
    // serves must still drift, proving the exemption is scoped to non-route
    // decisions only and never leaks to a served route.
    const scenario = {
      scenarioId: 'FIX-SD015-route-drift', classKind: 'routing', hasResourceGold: true,
      expectedResources: ['code-quality/references/config/quick-reference.md'],
      source: { shape: 'generic' },
    };
    const legacyObserved = {
      observedIntents: ['quality'],
      observedResources: ['code-quality/references/config/quick-reference.md'],
    };
    // Compiled's manifest declares the 'quality' mode with NO leaves -- a
    // genuine compiled-only gap the granularity projection can only narrow,
    // never manufacture.
    const loader = () => ({ quality: { workflowMode: 'quality', packet: 'code-quality', leaves: [] } });
    const res = parity.compiledParity(
      { scenario, legacyObserved, skillRoot, skillId: 'sk-code' },
      {
        readServingAuthority: () => 'compiled',
        compiledDecision: () => ({ action: 'route', targets: [target('quality', 'code-quality', 'surface-router')] }),
        loadModeIndex: loader,
      },
    );
    expect(res.firstDifference).toBeNull();
    expect(res.compiledAction).toBe('route');
    expect(res.legacyGoldPass).toBe(true);
    expect(res.compiledGoldPass).toBe(false);
    expect(res.status).toBe(parity.PARITY_STATUS.DRIFT);
    expect(res.reason).toBe('route-gold-failure');
  });
});

describe('compiled-routing-parity: resource-granularity projection', () => {
  it('packetIdsForModeIndex collects declared packet ids, ignoring entries without one', () => {
    const ids = parity.packetIdsForModeIndex({ a: { packet: 'pkg-a' }, b: { packet: 'pkg-b' }, c: {} });
    expect([...ids].sort()).toEqual(['pkg-a', 'pkg-b']);
  });

  it('packetIdsForModeIndex accepts a Map-shaped mode index', () => {
    const ids = parity.packetIdsForModeIndex(new Map([['a', { packet: 'pkg-a' }]]));
    expect([...ids]).toEqual(['pkg-a']);
  });

  it('keeps hub-level (unqualified) legacy resources unconditionally', () => {
    const projected = parity.projectCompiledResourcesToLegacyGranularity({
      legacyResources: ['references/stack-detection.md', 'references/universal/code-quality-standards.md'],
      compiledResources: [],
      hubPacketIds: new Set(['code-webflow', 'code-opencode']),
    });
    expect(projected).toEqual(['references/stack-detection.md', 'references/universal/code-quality-standards.md']);
  });

  it('narrows packet-qualified legacy resources to what compiled actually declared', () => {
    const projected = parity.projectCompiledResourcesToLegacyGranularity({
      legacyResources: ['references/universal/x.md', 'code-webflow/references/a.md', 'code-webflow/references/b.md'],
      compiledResources: ['code-webflow/references/a.md'],
      hubPacketIds: new Set(['code-webflow', 'code-opencode']),
    });
    expect(projected).toEqual(['references/universal/x.md', 'code-webflow/references/a.md']);
  });

  it('drops nothing when compiled declares a superset of legacy (the healthy case)', () => {
    const projected = parity.projectCompiledResourcesToLegacyGranularity({
      legacyResources: ['code-opencode/references/typescript/quick-reference.md'],
      compiledResources: [
        'code-opencode/references/typescript/quick-reference.md',
        'code-opencode/references/python/quick-reference.md',
      ],
      hubPacketIds: new Set(['code-opencode']),
    });
    expect(projected).toEqual(['code-opencode/references/typescript/quick-reference.md']);
  });
});

describe('compiled-routing-parity: routing projection shapes', () => {
  const loader = () => ({
    quality: { workflowMode: 'quality', packetKind: 'workflow' },
    review: { workflowMode: 'review', packetKind: 'workflow' },
    docs: { workflowMode: 'docs', packetKind: 'surface' },
  });

  it('normalizes single, ordered workflow, and surface bundles without sorting', () => {
    const single = parity.normalizeLegacyProjection({ observedIntents: ['quality'] }, 'hub', loader);
    const ordered = parity.normalizeLegacyProjection({ observedIntents: ['review', 'quality'] }, 'hub', loader);
    const surface = parity.normalizeLegacyProjection({ observedIntents: ['quality', 'docs'] }, 'hub', loader);
    expect(single.selectionKind).toBe('single');
    expect(ordered.selectionKind).toBe('orderedBundle');
    expect(ordered.targets.map((item: any) => item.workflowMode)).toEqual(['review', 'quality']);
    expect(surface.selectionKind).toBe('surfaceBundle');
  });

  it('selectionKindForTargets: surfaceBundle requires exactly one actor, per decision-contract assertComposition', () => {
    // Contract (002-decision-evaluator/lib/decision-contract.cjs assertComposition):
    // surfaceBundle requires actors.length === 1 AND every other target is
    // evidence. Any other shape is orderedBundle, which carries no role
    // restriction. Mirrors registry-compiler.cjs's bundleKindForModes exactly.
    const oneActorOneEvidence = parity.selectionKindForTargets([
      { packetKind: 'workflow' }, { packetKind: 'surface' },
    ]);
    expect(oneActorOneEvidence).toBe('surfaceBundle');

    const oneActorTwoEvidence = parity.selectionKindForTargets([
      { packetKind: 'workflow' }, { packetKind: 'surface' }, { packetKind: 'surface' },
    ]);
    expect(oneActorTwoEvidence).toBe('surfaceBundle');

    // Two actors alongside evidence: NOT surfaceBundle (multi-actor ties are
    // legitimately orderedBundle) -- this was the RD-002-style bug: labeling
    // any tie containing a surface target surfaceBundle regardless of actor
    // count.
    const twoActorsOneEvidence = parity.selectionKindForTargets([
      { packetKind: 'workflow' }, { packetKind: 'workflow' }, { packetKind: 'surface' },
    ]);
    expect(twoActorsOneEvidence).toBe('orderedBundle');

    // Zero actors, only evidence: NOT surfaceBundle either (no actor at all)
    // -- the RD-001-style bug: two surface-only targets tied together were
    // also mislabeled surfaceBundle by the old "any surface present" check.
    const zeroActorsTwoEvidence = parity.selectionKindForTargets([
      { packetKind: 'surface' }, { packetKind: 'surface' },
    ]);
    expect(zeroActorsTwoEvidence).toBe('orderedBundle');
  });

  it('normalizeLegacyProjection: multi-actor and zero-actor surface ties both classify orderedBundle', () => {
    const loader = () => ({
      quality: { workflowMode: 'quality', packetKind: 'workflow' },
      'code-review': { workflowMode: 'code-review', packetKind: 'workflow' },
      'code-webflow': { workflowMode: 'code-webflow', packetKind: 'surface' },
      'code-opencode': { workflowMode: 'code-opencode', packetKind: 'surface' },
    });
    const twoActors = parity.normalizeLegacyProjection(
      { observedIntents: ['quality', 'code-review', 'code-webflow', 'code-opencode'] }, 'hub', loader,
    );
    expect(twoActors.selectionKind).toBe('orderedBundle');

    const zeroActors = parity.normalizeLegacyProjection(
      { observedIntents: ['code-webflow', 'code-opencode'] }, 'hub', loader,
    );
    expect(zeroActors.selectionKind).toBe('orderedBundle');
  });

  it('normalizes defer and reject outcomes explicitly', () => {
    const defer = parity.normalizeLegacyProjection({ observedIntents: [] }, 'hub', loader);
    const reject = parity.normalizeCompiledProjection({ action: 'reject', targets: [] }, {
      normalizedTargets: [],
    });
    expect(defer).toEqual({ action: 'defer', selectionKind: null, targets: [] });
    expect(reject).toEqual({ action: 'reject', selectionKind: null, targets: [] });
  });

  it('names the first ordered routing field that differs', () => {
    const legacy = {
      action: 'route', selectionKind: 'orderedBundle',
      targets: [
        { hubId: 'hub', workflowMode: 'review', packetKind: 'workflow' },
        { hubId: 'hub', workflowMode: 'quality', packetKind: 'workflow' },
      ],
    };
    const compiled = {
      ...legacy,
      targets: [...legacy.targets].reverse(),
    };
    expect(parity.firstProjectionDifference(legacy, compiled)).toEqual({
      field: 'targets[0].workflowMode', legacy: 'review', compiled: 'quality',
    });
  });
});

describe('compiled-routing-parity: public child path isolation', () => {
  it('forces the public front-door child on without changing the parent flag', () => {
    const before = process.env.SPECKIT_COMPILED_ROUTING;
    process.env.SPECKIT_COMPILED_ROUTING = 'parent-value';
    try {
      const decision = parity.defaultCompiledDecision('sk-code', 'quality');
      expect(['route', 'clarify', 'defer', 'reject']).toContain(decision.action);
      expect(process.env.SPECKIT_COMPILED_ROUTING).toBe('parent-value');
      expect(parity.PUBLIC_FRONT_DOOR.endsWith('.opencode/bin/compiled-route.cjs')).toBe(true);
    } finally {
      if (before === undefined) delete process.env.SPECKIT_COMPILED_ROUTING;
      else process.env.SPECKIT_COMPILED_ROUTING = before;
    }
  });
});

describe('compiled-routing-parity: render-from-JSON block', () => {
  const baseReport = {
    scoringMethod: 'mode-a-router-replay', traceMode: 'router', verdict: 'PASS', aggregateScore: 90,
    targetSkill: { id: 'sk-code', root: '/x/sk-code' }, funnel: {}, scenarioRows: [],
  };

  it('renders a populated compiledRouting block, not a placeholder', () => {
    const report = {
      ...baseReport,
      compiledRouting: {
        mode: 'on', flagState: { state: 'unset' }, flagForcedOn: true, subVerdict: 'legacy-fallback-drifted', blocking: true, scored: 3,
        counts: { match: 2, drift: 1, vacuous: 0, 'n/a': 0, 'resolver-missing': 0 },
        gate: { owner: 'lane-c-compiled-parity', isBlockingOwner: true, reportOnlyConsumers: ['routing-registry-drift-ci'] },
        eligibleRows: [{ scenarioId: 'SD-001' }], driftRows: [{ scenarioId: 'SD-001' }], breakages: [],
        frozenHashes: { before: {}, after: {}, unchanged: true },
        rows: [{ scenarioId: 'SD-001', hubId: 'sk-code', status: 'drift', frontDoorOutcome: 'route', reason: 'route-mismatch', firstDifference: { field: 'action', legacy: 'route', compiled: 'defer' } }],
      },
    };
    const md = renderReport(report);
    expect(md).toContain('## Compiled routing parity');
    expect(md).toContain('legacy-fallback-drifted');
    expect(md).toContain('blocks the run');
    expect(md).toContain('lane-c-compiled-parity');
    expect(md).toContain('SD-001');
    expect(md).toContain('child flag forced on: **yes**');
    expect(md).toContain('action');
    expect(md).toContain('Frozen scorer hashes unchanged: **yes**');
    expect(md).not.toContain('undefined');
  });

  it('omits the block entirely when no compiled parity ran (legacy shape preserved)', () => {
    const md = renderReport({ ...baseReport });
    expect(md).not.toContain('## Compiled routing parity');
  });
});

describe('compiled-routing-parity: default-off isolation', () => {
  const skillRoot = join(REPO_SKILLS, 'sk-code');

  it('defaults to off even for hubs', () => {
    expect(resolveCompiledParity({}, skillRoot)).toEqual({ mode: 'off', enabled: false });
  });

  it('explicit auto still derives eligibility from hub type', () => {
    const flatSkillRoot = join(REPO_SKILLS, 'sk-doc', 'create-agent');
    expect(resolveCompiledParity({ 'compiled-routing-parity': 'auto' }, skillRoot))
      .toEqual({ mode: 'auto', enabled: true });
    expect(resolveCompiledParity({ 'compiled-routing-parity': 'auto' }, flatSkillRoot))
      .toEqual({ mode: 'auto', enabled: false });
  });

  it('a bare --compiled-routing-parity reads on', () => {
    expect(resolveCompiledParity({ 'compiled-routing-parity': true }, skillRoot).enabled).toBe(true);
  });

  it('rejects an invalid flag value', () => {
    expect(() => resolveCompiledParity({ 'compiled-routing-parity': 'maybe' }, skillRoot)).toThrow();
  });
});
