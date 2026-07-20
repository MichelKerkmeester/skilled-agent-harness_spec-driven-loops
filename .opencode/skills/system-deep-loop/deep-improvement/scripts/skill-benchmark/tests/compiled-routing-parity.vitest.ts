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
  '.opencode', 'specs', 'sk-doc', '019-sk-doc-router-alignment', '020-router-unification-program',
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

  it('a missing/unreadable manifest hard-fails vacuous, never n/a', () => {
    const res = parity.compiledParity(
      { scenario: PASS_SCENARIO, legacyObserved: legacyPassObserved(), skillRoot: join(REPO_SKILLS, 'sk-code'), skillId: 'sk-code' },
      { readServingAuthority: () => null },
    );
    expect(res.status).toBe(parity.PARITY_STATUS.VACUOUS);
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
    expect(bridged.observedResources).toContain('references/config/quick-reference.md');
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
    // only an explicit force-on permits compiled serving pre-cutover
    expect(states.one.permitsCompiledWhenEligible).toBe(true);
    expect(states.unset.permitsCompiledWhenEligible).toBe(false);
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
    expect(calls).toBeGreaterThanOrEqual(1);
    expect(res.status).toBe(parity.PARITY_STATUS.MATCH);
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
        mode: 'on', flagState: { state: 'force-on' }, subVerdict: 'legacy-fallback-drifted', blocking: true, scored: 3,
        counts: { match: 2, drift: 1, vacuous: 0, 'n/a': 0, 'resolver-missing': 0 },
        gate: { owner: 'lane-c-compiled-parity', isBlockingOwner: true, reportOnlyConsumers: ['routing-registry-drift-ci'] },
        rows: [{ scenarioId: 'SD-001', hubId: 'sk-code', status: 'drift', reason: 'route-mismatch' }],
      },
    };
    const md = renderReport(report);
    expect(md).toContain('## Compiled routing parity');
    expect(md).toContain('legacy-fallback-drifted');
    expect(md).toContain('blocks the run');
    expect(md).toContain('lane-c-compiled-parity');
    expect(md).toContain('SD-001');
    expect(md).not.toContain('undefined');
  });

  it('omits the block entirely when no compiled parity ran (legacy shape preserved)', () => {
    const md = renderReport({ ...baseReport });
    expect(md).not.toContain('## Compiled routing parity');
  });
});

describe('compiled-routing-parity: default-off reversibility', () => {
  const skillRoot = join(REPO_SKILLS, 'sk-code');

  it('resolveCompiledParity defaults to off', () => {
    expect(resolveCompiledParity({}, skillRoot).enabled).toBe(false);
  });

  it('a bare --compiled-routing-parity reads on', () => {
    expect(resolveCompiledParity({ 'compiled-routing-parity': true }, skillRoot).enabled).toBe(true);
  });

  it('rejects an invalid flag value', () => {
    expect(() => resolveCompiledParity({ 'compiled-routing-parity': 'maybe' }, skillRoot)).toThrow();
  });
});
