import { describe, it, expect } from 'vitest';
import { resolve, join } from 'node:path';

// Deterministic coverage for the playbook-corpus path (Mode B's router-mode
// spine). No live dispatch, no network — all pure-function / filesystem.

const SKILL_ROOT = resolve(__dirname, '..', '..', '..');
const REPO_SKILLS = resolve(SKILL_ROOT, '..', '..');
const SB = join(SKILL_ROOT, 'scripts', 'skill-benchmark');
const SKCODE = join(REPO_SKILLS, 'sk-code');

const { loadPlaybookScenarios } = require(join(SB, 'load-playbook-scenarios.cjs'));
const { dispatchScenario } = require(join(SB, 'executor-dispatch.cjs'));
const { scoreScenario, aggregate, computeDivergence } = require(join(SB, 'score-skill-benchmark.cjs'));
const { parseLiveResult, extractRoutingJson, proseRoutingFallback } = require(join(SB, 'live-executor.cjs'));
const { executeBrowserScenario, verdictToDims } = require(join(SB, 'browser-executor.cjs'));
const { gradeAblation, buildSkillOffPrompt, gradeTaskOutcome, buildTaskOutcomePrompt } = require(join(SB, 'd4-ablation.cjs'));
const { generatePlaybook, analyzeCoverage, validateGenerated } = require(join(SB, 'playbook-generator.cjs'));
const { mkdtempSync } = require('node:fs');
const { tmpdir } = require('node:os');

describe('playbook parser — sk-code', () => {
  const { scenarios, shape } = loadPlaybookScenarios({ skillRoot: SKCODE });

  it('parses the sk-code playbook into 30 scenarios', () => {
    expect(shape).toBe('sk-code');
    expect(scenarios.length).toBe(30);
  });

  it('splits classKind into 23 text-runnable + 7 browser', () => {
    const browser = scenarios.filter((s: any) => s.classKind === 'browser');
    const text = scenarios.filter((s: any) => s.classKind !== 'browser');
    expect(browser.length).toBe(7);
    expect(text.length).toBe(23);
  });

  it('tags advisor-only scenarios (SA-001, RD-002) as advisor', () => {
    const adv = scenarios.filter((s: any) => s.classKind === 'advisor').map((s: any) => s.scenarioId).sort();
    expect(adv).toEqual(['RD-002', 'SA-001']);
  });

  it('captures surface + real expected-ref gold for SD-001', () => {
    const sd = scenarios.find((s: any) => s.scenarioId === 'SD-001');
    expect(sd.classKind).toBe('routing');
    expect(sd.expectedSurface).toBe('WEBFLOW');
    expect(sd.expectedResources.length).toBeGreaterThan(3);
    expect(sd.critical).toBe(true);
    expect(sd.prompt).toContain('Lenis');
  });

  it('marks UNKNOWN/disambiguation scenarios negative (SD-003)', () => {
    const sd3 = scenarios.find((s: any) => s.scenarioId === 'SD-003');
    expect(sd3.expectedSurface).toBe('UNKNOWN');
    expect(sd3.negativeActivation).toBe(true);
  });
});

describe('executor-dispatch — router branch + browser routing-out', () => {
  const { scenarios } = loadPlaybookScenarios({ skillRoot: SKCODE });

  it('routes a routing scenario through router-replay deterministically', () => {
    const cs1 = scenarios.find((s: any) => s.scenarioId === 'CS-001');
    const obs = dispatchScenario({ scenario: cs1, skillRoot: SKCODE, traceMode: 'router' });
    expect(obs.mode).toBe('router');
    expect(obs.parseable).toBe(true);
    expect(Array.isArray(obs.observedResources)).toBe(true);
  });

  it('routes browser scenarios out of the text executors', () => {
    const mr1 = scenarios.find((s: any) => s.scenarioId === 'MR-001');
    const obs = dispatchScenario({ scenario: mr1, skillRoot: SKCODE, traceMode: 'router' });
    expect(obs.mode).toBe('browser');
    expect(obs.routedOut).toBe(true);
  });
});

describe('scoreScenario — real-gold scoring + back-compat adapter', () => {
  it('scores the new {scenario, observed} shape against real expected-ref gold', () => {
    const scenario = {
      scenarioId: 'X-001', classKind: 'routing', expectedSurface: 'WEBFLOW',
      expectedResources: ['references/a.md', 'references/b.md'], negativeActivation: false,
    };
    const observed = { mode: 'router', parseable: true, observedIntents: [], observedResources: ['references/a.md'], missingResources: [] };
    const row = scoreScenario({ scenario, observed, traceMode: 'router' });
    // resourceRecall = 1/2 -> D1-intra = 0.4*1(intent n/a) + 0.6*0.5 = 0.7
    expect(row.dims.d2.score).toBeCloseTo(0.5, 5);
    expect(row.classKind).toBe('routing');
  });

  it('still accepts the legacy {routerResult, expected} shape unchanged', () => {
    const routerResult = { parseable: true, intents: ['REVIEW'], resources: ['references/a.md'], missingResources: [] };
    const row = scoreScenario({ scenarioId: 's1', tier: 'T2', routerResult, expected: { intentKeys: ['REVIEW'], resources: ['references/a.md'] } });
    expect(row.dims.d1intra.score).toBeGreaterThan(0.9);
  });
});

describe('computeDivergence — A↔B finding', () => {
  it('flags router-only and live-only resource deltas + surface disagreement', () => {
    const d = computeDivergence({
      scenarioId: 'D-1',
      routerObserved: { observedResources: ['references/a.md', 'references/b.md'], observedSurface: 'WEBFLOW' },
      liveObserved: { observedResources: ['references/b.md', 'references/c.md'], observedSurface: 'OPENCODE' },
    });
    expect(d.resourceDelta.onlyRouter).toEqual(['references/a.md']);
    expect(d.resourceDelta.onlyLive).toEqual(['references/c.md']);
    expect(d.surfaceAgree).toBe(false);
    expect(d.severity).toBe('high');
  });
});

describe('live-executor — parseLiveResult on the real event schema', () => {
  // Mirrors the validated live NDJSON: { type, part:{ tool, state:{input}, text } }.
  const ndjson = [
    JSON.stringify({ type: 'tool_use', part: { tool: 'skill', state: { status: 'completed', input: { name: 'sk-code' } } } }),
    JSON.stringify({ type: 'tool_use', part: { tool: 'glob', state: { input: { pattern: '.opencode/skills/sk-code/references/webflow/x.md' } } } }),
    JSON.stringify({ type: 'text', part: { text: 'Analysis:\n```json\n{"surface":"WEBFLOW","resources":["references/a.md"],"assets":["assets/b.js"],"agent":"none"}\n```' } }),
  ].join('\n');

  it('extracts activation, surface, stated resources, and observed reads', () => {
    const r = parseLiveResult(ndjson, { skillId: 'sk-code' });
    expect(r.mode).toBe('live');
    expect(r.activation.activated).toBe(true);
    expect(r.activation.topSkill).toBe('sk-code');
    expect(r.observedSurface).toBe('WEBFLOW');
    // References and assets are now scored on separate channels (the asset lane),
    // so a stated asset no longer counts as a routed reference (D3 waste artifact).
    expect(r.observedResources).toEqual(['references/a.md']);
    expect(r.observedAssets).toEqual(['assets/b.js']);
    expect(r.raw.observedReads).toContain('references/webflow/x.md');
  });

  it('feeds the scorer: live observed scores against gold + reports surface match', () => {
    const r = parseLiveResult(ndjson, { skillId: 'sk-code' });
    const scenario = { scenarioId: 'L-1', classKind: 'routing', expectedSurface: 'WEBFLOW', expectedResources: ['references/a.md'], negativeActivation: false };
    const row = scoreScenario({ scenario, observed: r, traceMode: 'live' });
    expect(row.surfaceMatch).toBe(true);
    expect(row.dims.d2.score).toBe(1); // recall of references/a.md = 1/1
  });

  it('degrades to unparseable when the stream is empty', () => {
    const r = parseLiveResult('', { skillId: 'sk-code' });
    expect(r.parseable).toBe(false);
    expect(r.activation.activated).toBe(false);
  });
});

describe('scoreScenario — live surface mismatch fails routing', () => {
  it('caps D1-intra and flags surface-mismatch when observed surface != expected (live)', () => {
    const scenario = { scenarioId: 'SM-1', classKind: 'routing', expectedSurface: 'WEBFLOW', expectedResources: ['references/a.md'], negativeActivation: false };
    // Wrong surface but the gold resource happens to be in the routed set:
    // without the surface gate this would pass on incidental overlap.
    const observed = { mode: 'live', parseable: true, observedSurface: 'OPENCODE', observedIntents: [], observedResources: ['references/a.md'], missingResources: [] };
    const row = scoreScenario({ scenario, observed, traceMode: 'live' });
    expect(row.surfaceMatch).toBe(false);
    expect(row.dims.d1intra.surfaceMismatch).toBe(true);
    expect(row.dims.d1intra.score).toBeLessThanOrEqual(0.25);
    expect(row.firstFailingStage).toBe('surface-mismatch');
  });

  it('router mode (no observed surface) is unaffected by the surface gate', () => {
    const scenario = { scenarioId: 'SM-2', classKind: 'routing', expectedSurface: 'WEBFLOW', expectedResources: ['references/a.md'], negativeActivation: false };
    const observed = { mode: 'router', parseable: true, observedResources: ['references/a.md'], missingResources: [] };
    const row = scoreScenario({ scenario, observed, traceMode: 'router' });
    expect(row.surfaceMatch).toBe(null);
    expect(row.dims.d1intra.surfaceMismatch).toBeUndefined();
  });
});

describe('run — honors --playbook-dir', () => {
  it('refuses an empty custom playbook instead of emitting an empty report', () => {
    const { run } = require(join(SB, 'run-skill-benchmark.cjs'));
    const emptyPlaybook = mkdtempSync(join(tmpdir(), 'skc-empty-pb-'));
    const out = mkdtempSync(join(tmpdir(), 'skc-out-'));
    expect(() => run({ skill: SKCODE, 'outputs-dir': out, 'playbook-dir': emptyPlaybook, 'trace-mode': 'router' }))
      .toThrow(/no scenarios found/);
  });
});

describe('live-executor — cross-model routing-JSON extraction', () => {
  it('parses a ```json fenced block (MiniMax style)', () => {
    const j = extractRoutingJson('text\n```json\n{"surface":"WEBFLOW","resources":["references/a.md"]}\n```');
    expect(j.surface).toBe('WEBFLOW');
  });
  it('parses a plain ``` fence with no language tag (gpt style)', () => {
    const j = extractRoutingJson('```\n{"surface":"OPENCODE","resources":[]}\n```');
    expect(j.surface).toBe('OPENCODE');
  });
  it('parses a bare brace object with no fence at all', () => {
    const j = extractRoutingJson('Answer: {"surface":"UNKNOWN","resources":["references/x.md"]} done.');
    expect(j.surface).toBe('UNKNOWN');
  });
  it('prose fallback recovers a surface keyword + paths when there is no JSON', () => {
    const j = proseRoutingFallback('I would detect the WEBFLOW surface and load references/webflow/x.md and assets/y.js.');
    expect(j.surface).toBe('WEBFLOW');
    expect(j.resources).toContain('references/webflow/x.md');
    expect(j._recovered).toBe('prose');
  });
});

describe('browser-executor — honest verdicts (no bdg in CI)', () => {
  it('maps verdicts to dims (PASS=1, FAIL=0, PARTIAL=0.5, SKIP=null)', () => {
    expect(verdictToDims('PASS').d1intra.score).toBe(1);
    expect(verdictToDims('FAIL').d1intra.score).toBe(0);
    expect(verdictToDims('PARTIAL-NEEDS-ARTIFACT').d1intra.score).toBe(0.5);
    expect(verdictToDims('SKIP-NO-BROWSER').d1intra.score).toBe(null);
  });

  it('returns a deterministic PARTIAL for CB-002 without launching a browser', () => {
    const r = executeBrowserScenario({ scenario: { scenarioId: 'CB-002' } });
    expect(r.classKind).toBe('browser');
    expect(r.browser.verdict).toBe('PARTIAL-NEEDS-ARTIFACT');
    expect(r.modeAScore).toBe(50);
  });

  it('escalates cross-browser legs for CB-001 (never silently downgrades)', () => {
    const r = executeBrowserScenario({ scenario: { scenarioId: 'CB-001' } });
    expect(r.browser.escalation).toContain('safari');
  });
});

describe('d4-ablation — usefulness delta (mock grader, deterministic)', () => {
  it('grades on/off into a normalized [0,1] D4 stamped approximate', async () => {
    const r = await gradeAblation({
      scenario: { scenarioId: 'CS-001', passCriteria: 'pass iff WEBFLOW + motion refs' },
      onText: 'detailed correct webflow + motion_dev answer', offText: 'vague answer', graderMode: 'mock',
    });
    expect(r.d4.score).toBeGreaterThanOrEqual(0);
    expect(r.d4.score).toBeLessThanOrEqual(1);
    expect(r.d4.attribution).toBe('approximate');
    expect(typeof r.d4.onScore).toBe('number');
  });

  it('builds a skill-off prompt that forbids loading any skill', () => {
    expect(buildSkillOffPrompt({ prompt: 'do X' })).toMatch(/do NOT load any skill/i);
  });
});

describe('playbook-generator — coverage + 4 gates (dry, no LLM)', () => {
  it('derives coverage targets from the sk-code router', () => {
    const cov = analyzeCoverage(SKCODE);
    expect(cov.intents.length).toBeGreaterThan(5);
    expect(cov.existingCount).toBe(30);
    expect(cov.routerParseable).toBe(true);
  });

  it('is opt-in: no staging without createMissing', async () => {
    const r = await generatePlaybook({ skillRoot: SKCODE, createMissing: false });
    expect(r.staged.length).toBe(0);
  });

  it('dry run stages scenarios + runs 4 gates and writes nothing', async () => {
    const r = await generatePlaybook({ skillRoot: SKCODE, createMissing: true, dry: true });
    expect(r.staged.length).toBeGreaterThan(0);
    expect(r.proposalDir).toBeNull();
    expect(r.staged[0].gates).toHaveProperty('contamination');
    expect(r.staged[0].gates).toHaveProperty('selfConsistency');
  });

  it('contamination gate rejects a prompt that names the skill', () => {
    const g = validateGenerated({
      skillRoot: SKCODE, skillId: 'sk-code',
      scenarioMd: 'title:\n**Exact prompt**\nPass/Fail Criteria',
      prompt: 'use the sk-code skill to do X', expectedResources: [],
      stagingDir: mkdtempSync(join(tmpdir(), 'gen-')), id: 'T-1',
    });
    expect(g.contamination).toBe(false);
  });
});

describe('aggregate — coverage + routed-out handling', () => {
  it('counts browser rows as routed-out and excludes them from the score average', () => {
    const rows = [
      { scenarioId: 'R-1', classKind: 'routing', modeAScore: 80, firstFailingStage: null, dims: { d1intra: { score: 0.8 }, d2: { score: 0.8 }, d3: { score: 0.8 }, d1inter: { score: null } } },
      { scenarioId: 'B-1', classKind: 'browser', routedOut: true, reason: 'browser harness' },
    ];
    const report = aggregate({ skillId: 'x', skillRoot: '/x', scenarioRows: rows, connectivity: { score: 90, gateFailed: false, findings: [] }, traceMode: 'router' });
    expect(report.coverage.routedOut).toBe(1);
    expect(report.coverage.scored).toBe(1);
    expect(report.coverage.browser).toBe(1);
    expect(report.aggregateScore).toBe(80); // browser row excluded from the avg
  });
});

describe('asset lane — expectedAssets scored separately from D2/D3', () => {
  it('router mode: assets are deferred (assetRecall unscored, no D2/D3 distortion)', () => {
    const scenario = { scenarioId: 'A-1', classKind: 'routing', expectedResources: ['references/a.md'], expectedAssets: ['assets/x.js'], negativeActivation: false };
    const observed = { mode: 'router', parseable: true, observedResources: ['references/a.md'], missingResources: [] };
    const row = scoreScenario({ scenario, observed, traceMode: 'router' });
    expect(row.dims.assetRecall.score).toBeNull();
    expect(row.dims.assetRecall.deferred).toBe(true);
    expect(row.dims.d2.score).toBe(1); // assets never touch D2
  });

  it('live mode: assetRecall = recall of expectedAssets in observedAssets; stated asset is not D3 waste', () => {
    const scenario = { scenarioId: 'A-2', classKind: 'routing', expectedSurface: 'WEBFLOW', expectedResources: ['references/a.md'], expectedAssets: ['assets/x.js', 'assets/y.js'], negativeActivation: false };
    const observed = { mode: 'live', parseable: true, observedSurface: 'WEBFLOW', observedResources: ['references/a.md'], observedAssets: ['assets/x.js'], missingResources: [] };
    const row = scoreScenario({ scenario, observed, traceMode: 'live' });
    expect(row.dims.assetRecall.score).toBe(0.5); // 1 of 2 expected assets
    expect(row.dims.d3.wastedCount).toBe(0); // a stated asset no longer counts as routed-reference waste
  });
});

describe('D4-R task-outcome — a separate instrument from D4 hallucination', () => {
  it('grades on/off into a normalized [0,1] delta, stamped task-outcome + approximate', async () => {
    const r = await gradeTaskOutcome({
      scenario: { scenarioId: 'LS-002', passCriteria: 'edits skill_advisor.py to add a --json-output flag' },
      onText: 'Edit skill_advisor.py: add --json-output. Verify: python3 skill_advisor.py --json-output',
      offText: 'vague answer', graderMode: 'mock',
    });
    expect(r.d4r.score).toBeGreaterThanOrEqual(0);
    expect(r.d4r.score).toBeLessThanOrEqual(1);
    expect(r.d4r.instrument).toBe('task-outcome');
    expect(r.d4r.attribution).toBe('approximate');
    expect(typeof r.d4r.onScore).toBe('number');
  });

  it('the task-outcome prompt asks for a patch plan + verification, not a routing list', () => {
    const p = buildTaskOutcomePrompt({ prompt: 'add a flag' });
    expect(p).toMatch(/implementation plan/i);
    expect(p).toMatch(/verification command/i);
    expect(p).toMatch(/not just list which docs/i);
  });
});

describe('aggregate — advisory signals are additive, not weighted', () => {
  it('surfaces D4_task_outcome + assetRecall without changing the weighted aggregate', () => {
    const rows = [
      { scenarioId: 'R-1', classKind: 'routing', modeAScore: 80, firstFailingStage: null,
        dims: { d1intra: { score: 0.8 }, d2: { score: 0.8 }, d3: { score: 0.8 }, d1inter: { score: null }, assetRecall: { score: 0.5 } },
        d4TaskOutcome: { score: 0.7 } },
    ];
    const report = aggregate({ skillId: 'x', skillRoot: '/x', scenarioRows: rows, connectivity: { score: 90, gateFailed: false, findings: [] }, traceMode: 'live' });
    expect(report.aggregateScore).toBe(80); // unchanged by the advisory signals
    expect(report.advisorySignals.D4_task_outcome.score).toBe(70);
    expect(report.advisorySignals.assetRecall.score).toBe(50);
    expect(report.dimensionScores.D4.score).toBeNull(); // hallucination D4 stays its own (unscored here)
  });
});
