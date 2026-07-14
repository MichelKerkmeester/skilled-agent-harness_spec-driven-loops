import { describe, it, expect, afterAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SKILL_ROOT = resolve(__dirname, '..', '..', '..');
const SB = join(SKILL_ROOT, 'scripts', 'skill-benchmark');
const REPO_SKILLS = resolve(SKILL_ROOT, '..', '..');
const SKDESIGN = join(REPO_SKILLS, 'sk-design');
const SKDESIGN_COMMAND_RECIPE_FIXTURE = join(
  SKILL_ROOT,
  'assets',
  'skill_benchmark',
  'fixtures',
  'sk_design',
  'sk_design_command_recipe_valid.private.json',
);

// A genuinely router-less skill dir (no INTENT_SIGNALS/RESOURCE_MAP). The
// deep-improvement skill itself now HAS a router (Lane B), so it cannot serve as
// the negative fixture — build a throwaway one.
function makeRouterlessSkill(): string {
  const dir = mkdtempSync(join(tmpdir(), 'lc-norouter-'));
  writeFileSync(join(dir, 'SKILL.md'), '---\nname: throwaway\n---\n# Throwaway\nNo smart router here.\n');
  return dir;
}

// A minimal skill with a parseable inline router whose one routed resource
// exists on disk — a hermetic D5-pass fixture that does not depend on any
// real skill's on-disk location staying put.
function makeConnectedSkill(): string {
  const dir = mkdtempSync(join(tmpdir(), 'lc-connected-'));
  mkdirSync(join(dir, 'references'), { recursive: true });
  writeFileSync(join(dir, 'references', 'a.md'), '# A\n');
  writeFileSync(join(dir, 'SKILL.md'), [
    '---',
    'name: connected-throwaway',
    '---',
    '# Connected Throwaway',
    '',
    '```python',
    'INTENT_SIGNALS = {',
    '    "REVIEW": {"weight": 4, "keywords": ["review"]},',
    '}',
    '',
    'RESOURCE_MAP = {',
    '    "REVIEW": ["references/a.md"],',
    '}',
    '```',
    '',
  ].join('\n'));
  return dir;
}

// router-replay is a pure module — exercise it directly.
const { routeSkillResources, scoreIntents, selectIntents, parseRouter, loadSurfaceRouter } = require(join(SB, 'router-replay.cjs'));
const { buildBannedVocab, lintFixture } = require(join(SB, 'contamination-lint.cjs'));
const { scanConnectivity, scanHubRegistry } = require(join(SB, 'd5-connectivity.cjs'));
const {
  scoreScenario,
  aggregate,
  scoreCommandRecipe,
  reduceRecipeMiss,
  RECIPE_INVALID_CAP,
} = require(join(SB, 'score-skill-benchmark.cjs'));
const { renderReport } = require(join(SB, 'build-report.cjs'));
const { loadPlaybookScenarios } = require(join(SB, 'load-playbook-scenarios.cjs'));
const { scoreD1Inter, probeAdvisor } = require(join(SB, 'advisor-probe.cjs'));
const loopHost = require(join(SKILL_ROOT, 'scripts', 'shared', 'loop-host.cjs'));

describe('Lane C — loop-host wiring (non-regression)', () => {
  it('registers skill-benchmark as a valid mode without disturbing Lane A/B', () => {
    expect(loopHost.VALID_MODES.has('skill-benchmark')).toBe(true);
    expect(loopHost.VALID_MODES.has('agent-improvement')).toBe(true);
    expect(loopHost.VALID_MODES.has('model-benchmark')).toBe(true);
  });

  it('plans a single skill-benchmark orchestrator step', () => {
    const plan = loopHost.planInvocation('skill-benchmark', { skill: 'cli-opencode', 'outputs-dir': '/tmp/x' });
    expect(plan.ok).toBe(true);
    expect(plan.steps).toHaveLength(1);
    expect(plan.steps[0].script).toBe('run-skill-benchmark.cjs');
  });

  it('fails closed when required skill-benchmark args are missing', () => {
    const plan = loopHost.planInvocation('skill-benchmark', { skill: 'cli-opencode' });
    expect(plan.ok).toBe(false);
  });

  it('keeps the Lane A default plan byte-identical (TST-1)', () => {
    const a = loopHost.planInvocation('agent-improvement', { candidate: '/c.md' });
    const def = loopHost.planInvocation('agent-improvement', { candidate: '/c.md' });
    expect(a).toEqual(def);
    expect(a.steps[0].script).toBe('score-candidate.cjs');
  });
});

describe('Lane C — router-replay (Mode A)', () => {
  it('routes a REVIEW task on cli-claude-code to the expected resources', () => {
    const res = routeSkillResources({
      skillRoot: join(REPO_SKILLS, 'cli-external-orchestration', 'cli-claude-code'),
      taskText: 'review this diff for security vulnerabilities and give a second opinion',
    });
    expect(res.parseable).toBe(true);
    expect(res.intents).toContain('REVIEW');
    expect(res.resources.length).toBeGreaterThan(0);
    expect(res.missingResources).toEqual([]);
  });

  it('selectIntents keeps near-tied intents within the ambiguity delta', () => {
    const scores = [{ intent: 'A', score: 4 }, { intent: 'B', score: 3 }, { intent: 'C', score: 1 }];
    expect(selectIntents(scores)).toEqual(['A', 'B']);
  });

  it('reports parseable:false for a skill with no INTENT_SIGNALS router', () => {
    const res = routeSkillResources({ skillRoot: makeRouterlessSkill(), taskText: 'anything' });
    expect(res.parseable).toBe(false);
  });

  it('marks an inline-router skill with routerSource:"inline"', () => {
    const skillMd = readFileSync(join(REPO_SKILLS, 'cli-external-orchestration', 'cli-opencode', 'SKILL.md'), 'utf8');
    const router = parseRouter(skillMd, join(REPO_SKILLS, 'cli-external-orchestration', 'cli-opencode'));
    expect(router.parseable).toBe(true);
    expect(router.routerSource).toBe('inline');
  });
});

describe('Lane C — reference-following router (delegated RESOURCE_MAP)', () => {
  const SKCODE = join(REPO_SKILLS, 'sk-code');

  it('parses sk-code from its referenced router doc (not inline in SKILL.md)', () => {
    const skillMd = readFileSync(join(SKCODE, 'SKILL.md'), 'utf8');
    // SKILL.md alone has no inline dicts -> unparseable without the skillRoot pointer.
    expect(parseRouter(skillMd).parseable).toBe(false);
    // With the skill root, parseRouter follows the pointer to the hub router, which
    // selects the mode (quality/code-review workflow, or a code-webflow/code-opencode surface).
    const router = parseRouter(skillMd, SKCODE);
    expect(router.parseable).toBe(true);
    expect(router.routerSource).toBe('hub-router.json');
    expect(Object.keys(router.resourceMap).length).toBeGreaterThan(0);
    // The retained surface router (shared/references/smart_routing.md) still carries
    // the per-surface RESOURCE_MAP the hub projection does not expose.
    const surface = loadSurfaceRouter(SKCODE);
    expect(surface).toBeTruthy();
    expect(Object.keys(surface.resourceMap).length).toBeGreaterThan(0);
  });

  it('routes a sk-code task to existing resources with no dead paths', () => {
    const res = routeSkillResources({ skillRoot: SKCODE, taskText: 'improve lighthouse score and core web vitals for the webflow site' });
    expect(res.parseable).toBe(true);
    // The implement/debug/verify workflow modes are dissolved into the surface
    // packets; a webflow task routes to the code-webflow surface, which carries
    // the implement doctrine via the symlinked shared workflow references.
    expect(res.intents).toContain('code-webflow');
    expect(res.resources.length).toBeGreaterThan(0);
    expect(res.missingResources).toEqual([]); // every routed path exists on disk
  });

  it('does not hard-gate sk-code and surfaces no dead resource paths (D5)', () => {
    const res = scanConnectivity({ skillRoot: SKCODE });
    expect(res.routerParseable).toBe(true);
    expect(res.gateFailed).toBe(false);
    expect(res.deadResourcePaths).toEqual([]);
    expect(res.deadIntentKeys).toEqual([]);
  });

  it('does NOT rescue a router-less skill via the reference fallback', () => {
    // A skill with no inline dicts AND no references/smart_routing.md stays unparseable.
    const res = parseRouter('---\nname: x\n---\n# x\nno router, see references/foo.md for routing\n', makeRouterlessSkill());
    expect(res.parseable).toBe(false);
  });
});

describe('Lane C — contamination linter', () => {
  it('flags a public prompt that leaks the skill name', () => {
    const vocab = buildBannedVocab({ skillRoot: join(REPO_SKILLS, 'cli-external-orchestration', 'cli-opencode'), skillId: 'cli-opencode' });
    const res = lintFixture({ publicText: 'use the cli-opencode skill to review', bannedVocab: vocab });
    expect(res.passed).toBe(false);
    expect(res.hardLeaks.length).toBeGreaterThan(0);
  });

  it('passes a domain-language prompt with no skill identifiers', () => {
    const res = lintFixture({ publicText: 'please double check my code for bugs', bannedVocab: ['cli-opencode', 'second opinion'] });
    expect(res.passed).toBe(true);
  });
});

describe('Lane C — D5 connectivity gate', () => {
  it('hard-gates a skill whose router cannot be parsed', () => {
    const res = scanConnectivity({ skillRoot: makeRouterlessSkill() });
    expect(res.gateFailed).toBe(true);
    expect(res.routerParseable).toBe(false);
  });

  it('does not hard-gate a router-bearing skill with valid paths', () => {
    const res = scanConnectivity({ skillRoot: join(REPO_SKILLS, 'cli-external-orchestration', 'cli-opencode') });
    expect(res.routerParseable).toBe(true);
    // Routed paths exist, so no P0 dead-path gate.
    expect(res.deadResourcePaths).toEqual([]);
  });
});

function makeRegistrySkill(options: { missingMode?: boolean; aliasCollision?: boolean } = {}): string {
  const dir = mkdtempSync(join(tmpdir(), 'lc-registry-'));
  mkdirSync(join(dir, 'references'));
  writeFileSync(join(dir, 'references', 'a.md'), '# A\n');
  writeFileSync(join(dir, 'SKILL.md'), [
    '---',
    'name: registry-throwaway',
    '---',
    '# Registry Throwaway',
    '',
    '```python',
    'INTENT_SIGNALS = {"REVIEW": {"weight": 4, "keywords": ["review"]}}',
    'RESOURCE_MAP = {"REVIEW": ["references/a.md"]}',
    '```',
    '',
  ].join('\n'));
  const modes = [
    {
      workflowMode: 'alpha',
      packet: 'design-alpha',
      packetSkillName: 'design-alpha',
      aliases: ['shared intent', 'alpha only'],
    },
    {
      workflowMode: 'beta',
      packet: 'design-beta',
      packetSkillName: 'design-beta',
      aliases: [options.aliasCollision ? 'shared intent' : 'beta only'],
    },
  ];
  writeFileSync(join(dir, 'mode-registry.json'), JSON.stringify({ skill: 'synthetic-design', modes }, null, 2));
  writeFileSync(join(dir, 'hub-router.json'), JSON.stringify({
    routerSignals: options.missingMode
      ? {
        alpha: { classes: ['alpha-aliases'], resources: ['design-alpha/SKILL.md'] },
      }
      : {
        alpha: { classes: ['alpha-aliases'], resources: ['design-alpha/SKILL.md'] },
        beta: { classes: ['beta-aliases'], resources: ['design-beta/SKILL.md'] },
      },
    vocabularyClasses: {
      'alpha-aliases': { keywords: ['shared intent', 'alpha only'] },
      'beta-aliases': { keywords: ['beta only'] },
    },
  }, null, 2));
  mkdirSync(join(dir, 'design-alpha'));
  writeFileSync(join(dir, 'design-alpha', 'SKILL.md'), '---\nname: design-alpha\n---\n# Alpha\n');
  if (!options.missingMode) {
    mkdirSync(join(dir, 'design-beta'));
    writeFileSync(join(dir, 'design-beta', 'SKILL.md'), '---\nname: design-beta\n---\n# Beta\n');
  }
  return dir;
}

describe('Lane C — hub registry gate', () => {
  const registryDirs: string[] = [];
  afterAll(() => {
    for (const d of registryDirs) rmSync(d, { recursive: true, force: true });
  });

  it('reports the live sk-design registry without hard-gating it', () => {
    const res = scanHubRegistry({ skillRoot: join(REPO_SKILLS, 'sk-design') });
    expect(res.registryPresent).toBe(true);
    expect(res.gateFailed).toBe(false);
    expect(res.verdict).toBeNull();
    expect(res.aliasCollisions).toEqual([]);
    expect(res.missingModes).toEqual([]);
    expect(res.deadPackets).toEqual([]);
    expect(res.packetNameMismatches).toEqual([]);
    expect(res.uncoveredIntentRate).toBeGreaterThanOrEqual(0);
    expect(res.uncoveredIntentRate).toBeLessThan(1);
    expect(res.uncoveredIntentRate).toBeGreaterThan(0.3);
    expect(res.uncoveredIntentRate).toBeLessThan(0.6);
  });

  it('hard-gates a registry with a missing mode projection', () => {
    const skillRoot = makeRegistrySkill({ missingMode: true });
    registryDirs.push(skillRoot);
    const res = scanHubRegistry({ skillRoot });
    expect(res.gateFailed).toBe(true);
    expect(res.verdict).toBe('BLOCKED-BY-REGISTRY');
    expect(res.missingModes.length).toBeGreaterThan(0);
  });

  it('hard-gates a registry with an alias collision', () => {
    const skillRoot = makeRegistrySkill({ aliasCollision: true });
    registryDirs.push(skillRoot);
    const res = scanHubRegistry({ skillRoot });
    expect(res.gateFailed).toBe(true);
    expect(res.verdict).toBe('BLOCKED-BY-REGISTRY');
    expect(res.aliasCollisions).toEqual([{ alias: 'shared intent', workflowModes: ['alpha', 'beta'] }]);
  });

  it('is a benign pass for a registry-less skill', () => {
    const skillRoot = makeRouterlessSkill();
    registryDirs.push(skillRoot);
    const res = scanHubRegistry({ skillRoot });
    expect(res.registryPresent).toBe(false);
    expect(res.score).toBe(100);
    expect(res.gateFailed).toBe(false);
    expect(res.verdict).toBeNull();
    expect(res.findings).toEqual([]);
  });
});

describe('Lane C — scorer + report render', () => {
  it('scores a scenario and renders report.md from report.json', () => {
    const routerResult = { parseable: true, intents: ['REVIEW'], resources: ['references/a.md'], missingResources: [], scores: [] };
    const row = scoreScenario({ scenarioId: 's1', tier: 'T2', routerResult, expected: { intentKeys: ['REVIEW'], resources: ['references/a.md'] } });
    expect(row.dims.d1intra.score).toBeGreaterThan(0.9);
    const report = aggregate({
      skillId: 'x', skillRoot: '/x', scenarioRows: [row],
      connectivity: { score: 90, gateFailed: false, findings: [] }, traceMode: 'router',
    });
    expect(report.verdict).toBe('PASS');
    const md = renderReport(report);
    expect(md).toContain('Skill Benchmark Report');
    expect(md).toContain('Verdict: PASS');
  });

  it('downgrades a high-scoring report to CONDITIONAL when an active P1 bottleneck is present', () => {
    const routerResult = { parseable: true, intents: ['REVIEW'], resources: ['references/a.md'], missingResources: [], scores: [] };
    const row = scoreScenario({ scenarioId: 's1', tier: 'T2', routerResult, expected: { intentKeys: ['REVIEW'], resources: ['references/a.md'] } });
    const report = aggregate({
      skillId: 'x', skillRoot: '/x', scenarioRows: [row],
      connectivity: {
        score: 90,
        gateFailed: false,
        findings: [{ class: 'funnel_attrition', severity: 'P1', stage: 'wrong-mode', detail: '1 scenario(s) first fail at stage \'wrong-mode\'' }],
      },
      traceMode: 'router',
    });
    // Same high-scoring fixture as the PASS case above -- an unconditional PASS
    // here would contradict the still-active P1 remediation the report lists.
    expect(report.aggregateScore).toBeGreaterThanOrEqual(80);
    expect(report.verdict).toBe('CONDITIONAL');
  });
});

function designRecipe(command = '/design:interface'): any {
  if (command === '/design:interface') {
    const fixture = JSON.parse(readFileSync(SKDESIGN_COMMAND_RECIPE_FIXTURE, 'utf8'));
    return JSON.parse(JSON.stringify(fixture.expected.commandRecipe));
  }

  const records = JSON.parse(readFileSync(join(SKDESIGN, 'command-metadata.json'), 'utf8'));
  const record = records.find((item: any) => item.command === command);
  return JSON.parse(JSON.stringify({
    command: record.command,
    ownerMode: record.ownerMode,
    argumentHint: record.argumentHint,
    wrapperCommand: record.command,
    argumentGrammar: record.argumentGrammar,
    workflowMode: record.ownerMode,
    routeOutcome: 'single',
    forbiddenWorkflowModes: ['audit', 'foundations', 'motion', 'md-generator'].filter((mode) => mode !== record.ownerMode),
    choreography: record.choreography,
  }));
}

describe('Lane C — commandRecipe validity lane', () => {
  const routerResult = {
    parseable: true,
    intents: ['interface'],
    resources: ['design-interface/SKILL.md'],
    missingResources: [],
    scores: [],
  };

  it('passes a valid command recipe', () => {
    const res = scoreCommandRecipe({
      expected: { skillId: 'sk-design', commandRecipe: designRecipe() },
      skillRoot: SKDESIGN,
      routerResult,
    });
    expect(res.applicable).toBe(true);
    expect(res.valid).toBe(true);
    expect(res.missReasons).toEqual([]);
  });

  it('flags an in-memory gold recipe when its argument hint drifts from live metadata', () => {
    const driftedRecipe = designRecipe();
    driftedRecipe.argumentHint = '<target> [--mode]';
    const res = scoreCommandRecipe({
      expected: { skillId: 'sk-design', commandRecipe: driftedRecipe },
      skillRoot: SKDESIGN,
      routerResult,
    });
    expect(res.applicable).toBe(true);
    expect(res.valid).toBe(false);
    expect(res.firstFailingSubcheck).toBe('metadata');
    expect(res.missReasons).toEqual(expect.arrayContaining([
      expect.objectContaining({ stage: 'metadata' }),
    ]));
  });

  it('fails metadata validity before later checks when the recipe is undefined in metadata', () => {
    const recipe = designRecipe();
    recipe.command = '/design:missing';
    recipe.wrapperCommand = '/design:missing';
    const res = scoreCommandRecipe({
      expected: { skillId: 'sk-design', commandRecipe: recipe },
      skillRoot: SKDESIGN,
      routerResult,
    });
    expect(res.valid).toBe(false);
    expect(res.firstFailingSubcheck).toBe('metadata');
    expect(res.missReasons.some((reason: any) => reason.stage === 'metadata')).toBe(true);
  });

  it('fails wrapper drift when the expected wrapper command diverges', () => {
    const recipe = designRecipe();
    recipe.wrapperCommand = '/design:audit';
    const res = scoreCommandRecipe({
      expected: { skillId: 'sk-design', commandRecipe: recipe },
      skillRoot: SKDESIGN,
      routerResult,
    });
    expect(res.valid).toBe(false);
    expect(res.firstFailingSubcheck).toBe('wrapper');
    expect(res.missReasons.some((reason: any) => reason.stage === 'wrapper')).toBe(true);
  });

  it('fails the arg fixture check when argumentGrammar drifts', () => {
    const recipe = designRecipe();
    recipe.argumentGrammar.render = '<target> --wrong';
    const res = scoreCommandRecipe({
      expected: { skillId: 'sk-design', commandRecipe: recipe },
      skillRoot: SKDESIGN,
      routerResult,
    });
    expect(res.valid).toBe(false);
    expect(res.firstFailingSubcheck).toBe('arg');
    expect(res.missReasons.some((reason: any) => reason.stage === 'arg')).toBe(true);
  });

  it('fails route/bundle when the router selected a sibling mode', () => {
    const res = scoreCommandRecipe({
      expected: { skillId: 'sk-design', commandRecipe: designRecipe() },
      skillRoot: SKDESIGN,
      routerResult: { ...routerResult, intents: ['audit'] },
    });
    expect(res.valid).toBe(false);
    expect(res.firstFailingSubcheck).toBe('route');
    expect(res.missReasons.some((reason: any) => reason.stage === 'route')).toBe(true);
  });

  it('fails choreography witness when the expected ordered steps drift', () => {
    const recipe = designRecipe();
    recipe.choreography[0].action = 'load something else';
    const res = scoreCommandRecipe({
      expected: { skillId: 'sk-design', commandRecipe: recipe },
      skillRoot: SKDESIGN,
      routerResult,
    });
    expect(res.valid).toBe(false);
    expect(res.firstFailingSubcheck).toBe('choreography');
    expect(res.missReasons.some((reason: any) => reason.stage === 'choreography')).toBe(true);
  });

  it('caps both D2 and D3 when an applicable recipe is invalid', () => {
    const recipe = designRecipe();
    recipe.argumentGrammar.render = '<target> --wrong';
    const row = scoreScenario({
      scenarioId: 'recipe-invalid',
      tier: 'T1',
      skillRoot: SKDESIGN,
      routerResult,
      expected: { skillId: 'sk-design', resources: ['design-interface/SKILL.md'], commandRecipe: recipe },
    });
    expect(row.recipeCapped).toBe(true);
    expect(row.firstFailingStage).toBe('recipe-invalid');
    expect(row.dims.d2.uncappedScore).toBe(1);
    expect(row.dims.d3.uncappedScore).toBe(1);
    expect(row.dims.d2.score).toBe(RECIPE_INVALID_CAP);
    expect(row.dims.d3.score).toBe(RECIPE_INVALID_CAP);
  });

  it('leaves no-gold scenarios uncapped and applicable:false', () => {
    const row = scoreScenario({
      scenarioId: 'recipe-no-gold',
      tier: 'T1',
      skillRoot: SKDESIGN,
      routerResult,
      expected: { skillId: 'sk-design', resources: ['design-interface/SKILL.md'] },
    });
    expect(row.dims.commandRecipe).toMatchObject({ applicable: false, valid: true });
    expect(row.recipeCapped).toBe(false);
    expect(row.dims.d2.score).toBe(1);
    expect(row.dims.d3.score).toBe(1);
    expect(row.dims.d2.recipeCapped).toBeUndefined();
    expect(row.dims.d3.recipeCapped).toBeUndefined();
  });

  it('reduces recipeMissRate and sub-check breakdown without gating the verdict', () => {
    const valid = scoreScenario({
      scenarioId: 'recipe-valid',
      tier: 'T1',
      skillRoot: SKDESIGN,
      routerResult,
      expected: { skillId: 'sk-design', resources: ['design-interface/SKILL.md'], commandRecipe: designRecipe() },
    });
    const invalidRecipe = designRecipe();
    invalidRecipe.argumentGrammar.render = '<target> --wrong';
    const invalid = scoreScenario({
      scenarioId: 'recipe-invalid',
      tier: 'T1',
      skillRoot: SKDESIGN,
      routerResult,
      expected: { skillId: 'sk-design', resources: ['design-interface/SKILL.md'], commandRecipe: invalidRecipe },
    });
    const noGold = scoreScenario({
      scenarioId: 'recipe-no-gold',
      tier: 'T1',
      skillRoot: SKDESIGN,
      routerResult,
      expected: { skillId: 'sk-design', resources: ['design-interface/SKILL.md'] },
    });
    const reduced = reduceRecipeMiss([valid, invalid, noGold]);
    expect(reduced.recipeMissRate).toMatchObject({ numerator: 1, denominator: 2, misses: 1, valid: 1, rate: 0.5 });
    expect(reduced.breakdown.arg).toMatchObject({ numerator: 1, denominator: 2, rate: 0.5 });

    const report = aggregate({
      skillId: 'sk-design',
      skillRoot: SKDESIGN,
      scenarioRows: [valid, invalid, noGold],
      connectivity: { score: 100, gateFailed: false, findings: [] },
      traceMode: 'router',
    });
    expect(report.advisorySignals.recipeMissRate.rate).toBe(0.5);
    expect(report.runQuality.recipeMissRate.rate).toBe(0.5);
    expect(report.gate.hubRoute.failed).toBe(false);
  });
});

describe('Lane C — negative-activation scoring', () => {
  it('does not credit D3 for routing a resource that should be suppressed', () => {
    const routerResult = { parseable: true, intents: ['X'], resources: ['references/webflow/leak.md'], missingResources: [], scores: [] };
    const row = scoreScenario({ scenarioId: 'neg', tier: 'T3', routerResult, expected: { negativeActivation: true, forbiddenResources: ['references/webflow/'] } });
    expect(row.dims.d1intra.score).toBe(0); // leaked a forbidden (suppressed) resource
    expect(row.dims.d3.score).toBe(0);      // D3 tracks the suppression failure, not over-routing
  });

  it('scores a suppression scenario on recall of its positive should-load set (not as a leak)', () => {
    // An UNKNOWN-stack scenario legitimately loads the universal tier while
    // forbidding a surface: routing the required resource must NOT read as a leak.
    const routerResult = { parseable: true, intents: ['X'], resources: ['references/universal/a.md'], missingResources: [], scores: [] };
    const row = scoreScenario({ scenarioId: 'neg2', tier: 'T3', routerResult, expected: { negativeActivation: true, resources: ['references/universal/a.md'], forbiddenResources: ['references/webflow/'] } });
    expect(row.dims.d1intra.score).toBe(1); // full recall of the required ref, nothing forbidden leaked
  });
});

describe('Lane C — stage-aware scoring (fitted/holdout split)', () => {
  const conn = { score: 90, gateFailed: false, findings: [] };
  const routing = (id: string, resources: string[]) => scoreScenario({
    scenarioId: id, tier: 'T2',
    routerResult: { parseable: true, intents: ['REVIEW'], resources, missingResources: [], scores: [] },
    expected: { intentKeys: ['REVIEW'], resources },
  });
  // scenario+observed shape is the only way a benchmark stage reaches the scorer.
  const staged = (id: string, stage: string, opts: any = {}) => scoreScenario({
    scenario: {
      scenarioId: id, stage, classKind: 'routing',
      expectedResources: opts.expectedResources || ['references/a.md'],
      expectedIntent: 'REVIEW',
      negativeActivation: opts.negativeActivation === true,
      forbiddenResources: opts.forbiddenResources || [],
    },
    observed: {
      mode: 'router', parseable: true,
      observedIntents: opts.observedIntents || ['REVIEW'],
      observedResources: opts.observedResources || opts.expectedResources || ['references/a.md'],
      observedSurface: null, raw: {},
    },
  });

  it('attaches row.stage — routing by default (legacy shape), holdout/negative from the scenario', () => {
    expect(routing('r', ['references/a.md']).stage).toBe('routing');
    expect(staged('h', 'holdout').stage).toBe('holdout');
    expect(staged('n', 'negative', { negativeActivation: true }).stage).toBe('negative');
  });

  it('excludes holdout from the fitted aggregate and reports a separate holdout score + gap', () => {
    const fitted = routing('f', ['references/a.md']);
    // a holdout row that generalizes worse (wrong resources, no intent recall)
    const holdout = staged('h', 'holdout', { observedResources: ['references/wrong.md'], observedIntents: [] });
    const withHoldout = aggregate({ skillId: 'x', skillRoot: '/x', scenarioRows: [fitted, holdout], connectivity: conn, traceMode: 'router' });
    const fittedOnly = aggregate({ skillId: 'x', skillRoot: '/x', scenarioRows: [fitted], connectivity: conn, traceMode: 'router' });
    // The headline aggregate is identical whether or not the holdout row is present.
    expect(withHoldout.aggregateScore).toBe(fittedOnly.aggregateScore);
    expect(withHoldout.generalization.holdoutCount).toBe(1);
    expect(withHoldout.generalization.holdoutScore).toBe(holdout.modeAScore);
    expect(withHoldout.generalization.generalizationGap).toBe(withHoldout.aggregateScore - holdout.modeAScore);
    expect(withHoldout.coverage.holdout).toBe(1);
  });

  it('is score-preserving — a stage-less row set yields the plain mean and a null holdout score', () => {
    const r1 = routing('a', ['references/a.md']);
    const r2 = routing('b', ['references/b.md']);
    const rep = aggregate({ skillId: 'x', skillRoot: '/x', scenarioRows: [r1, r2], connectivity: conn, traceMode: 'router' });
    expect(rep.aggregateScore).toBe(Math.round((r1.modeAScore + r2.modeAScore) / 2));
    expect(rep.generalization.holdoutScore).toBeNull();
    expect(rep.generalization.generalizationGap).toBeNull();
    expect(rep.coverage.holdout).toBe(0);
  });

  it('routes a stage:negative scenario through the inversion lane and counts it in coverage.negative', () => {
    const neg = staged('neg', 'negative', {
      negativeActivation: true,
      expectedResources: [],
      forbiddenResources: ['references/webflow/'],
      observedResources: ['references/webflow/leak.md'],
    });
    expect(neg.dims.d1intra.negative).toBe(true);
    expect(neg.dims.d1intra.score).toBe(0); // leaked a forbidden (suppressed) resource
    const rep = aggregate({ skillId: 'x', skillRoot: '/x', scenarioRows: [neg], connectivity: conn, traceMode: 'router' });
    expect(rep.coverage.negative).toBe(1);
    expect(rep.generalization.negativeCount).toBe(1);
  });

  it('loader honors stage: stage:negative sets negativeActivation, stage:holdout stays positive', () => {
    const dir = mkdtempSync(join(tmpdir(), 'lc-stage-'));
    const catDir = join(dir, 'cat');
    mkdirSync(catDir, { recursive: true });
    writeFileSync(join(catDir, 'neg.md'), '---\nid: NEG-001\nexpected_intent: review\nstage: negative\nexpected_resources:\n  - references/a.md\n---\nPrompt: exercise a suppression path\n');
    writeFileSync(join(catDir, 'hold.md'), '---\nid: HOLD-001\nexpected_intent: review\nstage: holdout\nexpected_resources:\n  - references/b.md\n---\nPrompt: exercise a holdout path\n');
    const { scenarios } = loadPlaybookScenarios({ playbookDir: dir });
    const neg = scenarios.find((s: any) => s.scenarioId === 'NEG-001');
    const hold = scenarios.find((s: any) => s.scenarioId === 'HOLD-001');
    expect(neg.stage).toBe('negative');
    expect(neg.negativeActivation).toBe(true);
    expect(hold.stage).toBe('holdout');
    expect(hold.negativeActivation).toBe(false);
    rmSync(dir, { recursive: true, force: true });
  });

  it('scores a positive scenario that routed nothing as a recall failure (D3 N/A, not a 31 floor)', () => {
    // A decontaminated/holdout prompt the keyword router cannot match routes
    // nothing. Efficiency must be undefined (not a full-marks salvage), so the
    // row is judged on recall alone and an outright miss scores 0.
    const row = scoreScenario({
      scenarioId: 'empty', tier: 'T2',
      routerResult: { parseable: true, intents: [], resources: [], missingResources: [], scores: [] },
      expected: { intentKeys: ['REVIEW'], resources: ['references/a.md'] },
    });
    expect(row.dims.d3.score).toBeNull();
    expect(row.dims.d3.proxy).toBe('no-routing');
    expect(row.modeAScore).toBe(0);
  });
});

describe('Lane C — malformed-fixture degradation', () => {
  it('degrades to an unparseable-fixture row instead of crashing', () => {
    const { run } = require(join(SB, 'run-skill-benchmark.cjs'));
    const fixDir = mkdtempSync(join(tmpdir(), 'lc-badfix-'));
    writeFileSync(join(fixDir, 'broken.public.json'), '{ not valid json');
    const out = mkdtempSync(join(tmpdir(), 'lc-badout-'));
    const code = run({ skill: join(REPO_SKILLS, 'cli-external-orchestration', 'cli-opencode'), 'outputs-dir': out, 'fixtures-dir': fixDir });
    expect(code).toBe(0); // did not crash
    const report = JSON.parse(readFileSync(join(out, 'skill-benchmark-report.json'), 'utf8'));
    const row = (report.scenarioRows || []).find((r: any) => r.firstFailingStage === 'unparseable-fixture');
    expect(row).toBeTruthy();
    expect(row.loadError).toBeTruthy();
  });
});

describe('Lane C — D5 gate exit code (run-skill-benchmark)', () => {
  const gateDirs: string[] = [];
  afterAll(() => {
    for (const d of gateDirs) rmSync(d, { recursive: true, force: true });
  });

  it('hard-fails the process (exit 3) on a BLOCKED-BY-STRUCTURE verdict, but still writes both reports', () => {
    const { run } = require(join(SB, 'run-skill-benchmark.cjs'));
    const skillRoot = makeRouterlessSkill();
    const out = mkdtempSync(join(tmpdir(), 'lc-d5gate-'));
    gateDirs.push(skillRoot, out);
    const code = run({ skill: skillRoot, 'outputs-dir': out });
    expect(code).toBe(3);
    const jsonPath = join(out, 'skill-benchmark-report.json');
    const mdPath = join(out, 'skill-benchmark-report.md');
    expect(existsSync(jsonPath)).toBe(true);
    expect(existsSync(mdPath)).toBe(true);
    const report = JSON.parse(readFileSync(jsonPath, 'utf8'));
    expect(report.verdict).toBe('BLOCKED-BY-STRUCTURE');
  });

  it('hard-fails the process (exit 3) on a BLOCKED-BY-REGISTRY verdict and surfaces registry findings', () => {
    const { run } = require(join(SB, 'run-skill-benchmark.cjs'));
    const skillRoot = makeRegistrySkill({ missingMode: true });
    const out = mkdtempSync(join(tmpdir(), 'lc-registrygate-'));
    gateDirs.push(skillRoot, out);
    const code = run({ skill: skillRoot, 'outputs-dir': out });
    expect(code).toBe(3);
    const report = JSON.parse(readFileSync(join(out, 'skill-benchmark-report.json'), 'utf8'));
    expect(report.verdict).toBe('BLOCKED-BY-REGISTRY');
    expect(report.bottlenecks).toEqual(expect.arrayContaining([
      expect.objectContaining({ class: 'missing_mode', severity: 'P0' }),
    ]));
  });

  it('stays exit 0 for a router-bearing skill that does not hit the D5 gate (regression guard, NO-SCENARIOS is not gated)', () => {
    const { run } = require(join(SB, 'run-skill-benchmark.cjs'));
    const skillRoot = makeConnectedSkill();
    const out = mkdtempSync(join(tmpdir(), 'lc-d5gate-ok-'));
    gateDirs.push(skillRoot, out);
    const code = run({ skill: skillRoot, 'outputs-dir': out });
    expect(code).toBe(0);
    const report = JSON.parse(readFileSync(join(out, 'skill-benchmark-report.json'), 'utf8'));
    // No manual_testing_playbook ships with the fixture, so the verdict lands on
    // NO-SCENARIOS — a documented expected-degraded result, not a D5 gate.
    expect(report.verdict).toBe('NO-SCENARIOS');
  });
});

describe('Lane C — D1-inter advisor scoring', () => {
  const probe = (recs: any[]) => ({ ok: true, recommendations: recs, topSkill: recs[0]?.skill ?? null });

  it('scores top-1 advisor selection as full credit', () => {
    const res = scoreD1Inter({ advisorResult: probe([{ skill: 'deep-improvement', confidence: 0.9 }]), expectedSkillId: 'deep-improvement', negative: false });
    expect(res.score).toBe(1);
    expect(res.rank).toBe(1);
  });

  it('rank-weights a lower advisor placement', () => {
    const res = scoreD1Inter({ advisorResult: probe([{ skill: 'a' }, { skill: 'b' }, { skill: 'deep-improvement' }]), expectedSkillId: 'deep-improvement', negative: false });
    expect(res.score).toBe(0.75); // rank 3
  });

  it('scores 0 when the expected skill is absent', () => {
    const res = scoreD1Inter({ advisorResult: probe([{ skill: 'x' }]), expectedSkillId: 'deep-improvement', negative: false });
    expect(res.score).toBe(0);
  });

  it('inverts for a negative scenario (target must NOT be recommended)', () => {
    const absent = scoreD1Inter({ advisorResult: probe([{ skill: 'x' }]), expectedSkillId: 'deep-improvement', negative: true });
    expect(absent.score).toBe(1);
    const present = scoreD1Inter({ advisorResult: probe([{ skill: 'deep-improvement' }]), expectedSkillId: 'deep-improvement', negative: true });
    expect(present.score).toBe(0);
  });

  it('returns unscored when the advisor probe failed', () => {
    const res = scoreD1Inter({ advisorResult: { ok: false, recommendations: [] }, expectedSkillId: 'deep-improvement', negative: false });
    expect(res.score).toBeNull();
    expect(res.ok).toBe(false);
  });

  it('probes the real advisor deterministically (SQLite, no LLM)', () => {
    const res = probeAdvisor({ prompt: 'evaluate and score a bounded agent definition file then propose one guarded revision' });
    // The advisor is in-repo + deterministic; it should return a ranked list.
    expect(res.ok).toBe(true);
    expect(Array.isArray(res.recommendations)).toBe(true);
  });
});

describe('Lane C — mode-precision advisory signal (non-gating)', () => {
  const { scoreModePrecision } = require(join(SB, 'advisor-probe.cjs'));
  const baseRouter = { parseable: true, intents: ['X'], resources: ['references/a.md'], missingResources: [], scores: [] };
  const baseExpected = { skillId: 'system-deep-loop', mode: 'research', intentKeys: [], resources: ['references/a.md'] };

  it('scoreModePrecision is unscored without a mode-routing probe', () => {
    const r = scoreModePrecision({ expectedMode: 'research' });
    expect(r.score).toBeNull();
    expect(r.advisory).toBe(true);
  });

  it('scoreModePrecision credits a matching advisor mode and fails a mismatch', () => {
    expect(scoreModePrecision({ modeRouting: { ok: true, mode: 'research' }, expectedMode: 'research' }).score).toBe(1);
    expect(scoreModePrecision({ modeRouting: { ok: true, mode: 'review' }, expectedMode: 'research' }).score).toBe(0);
  });

  it('attaches dims.modePrecision (unscored) without changing the skill-id-gated score', () => {
    const withRouting = scoreScenario({ scenarioId: 'm1', tier: 'T1', routerResult: baseRouter, expected: baseExpected, modeRouting: { ok: true, mode: 'research' } });
    const withoutRouting = scoreScenario({ scenarioId: 'm1', tier: 'T1', routerResult: baseRouter, expected: baseExpected });
    // Advisory mode signal must NOT move the weighted Mode A score.
    expect(withRouting.modeAScore).toBe(withoutRouting.modeAScore);
    expect(withRouting.dims.modePrecision.score).toBe(1);
    expect(withoutRouting.dims.modePrecision.score).toBeNull();
  });

  it('a wrong advisor mode does not lower the scenario score (gate stays skill-id)', () => {
    const matched = scoreScenario({ scenarioId: 'm2', tier: 'T1', routerResult: baseRouter, expected: baseExpected, modeRouting: { ok: true, mode: 'research' } });
    const mismatched = scoreScenario({ scenarioId: 'm2', tier: 'T1', routerResult: baseRouter, expected: baseExpected, modeRouting: { ok: true, mode: 'context' } });
    expect(mismatched.modeAScore).toBe(matched.modeAScore);
    expect(mismatched.dims.modePrecision.score).toBe(0);
  });

  it('aggregate surfaces modePrecision in advisorySignals, outside the weighted aggregate', () => {
    const row = scoreScenario({ scenarioId: 'm3', tier: 'T1', routerResult: baseRouter, expected: baseExpected, modeRouting: { ok: true, mode: 'research' } });
    const report = aggregate({ skillId: 'system-deep-loop', skillRoot: '/x', scenarioRows: [row], connectivity: { score: 90, gateFailed: false, findings: [] }, traceMode: 'router' });
    expect(report.advisorySignals.modePrecision.score).toBe(100);
    // The advisory signal is not listed as a weighted dimension.
    expect(report.dimensionScores.modePrecision).toBeUndefined();
  });
});

describe('Lane C — end-to-end via run-skill-benchmark', () => {
  const e2eDirs: string[] = [];
  afterAll(() => {
    for (const d of e2eDirs) rmSync(d, { recursive: true, force: true });
  });

  it('emits dual report artifacts for a router-bearing skill', () => {
    const out = mkdtempSync(join(tmpdir(), 'lc-e2e-'));
    e2eDirs.push(out);
    execFileSync('node', [join(SB, 'run-skill-benchmark.cjs'), '--skill', join(REPO_SKILLS, 'cli-external-orchestration', 'cli-opencode'), '--outputs-dir', out], { encoding: 'utf8' });
    const jsonPath = join(out, 'skill-benchmark-report.json');
    const mdPath = join(out, 'skill-benchmark-report.md');
    expect(existsSync(jsonPath)).toBe(true);
    expect(existsSync(mdPath)).toBe(true);
    const report = JSON.parse(readFileSync(jsonPath, 'utf8'));
    expect(report.mode).toBe('skill-benchmark');
    expect(report.schemaVersion).toBe('skill-benchmark-report.v1');
  });

  it('scores at least one real scenario end-to-end (deep-improvement ships a fixture)', () => {
    // cli-opencode ships no fixtures (scenarioRows === 0), so the artifact test
    // above cannot prove the scenario pipeline runs. deep-improvement ships
    // agent_improve_001, so this asserts the full lint -> route -> score path
    // actually produced a scored row.
    const out = mkdtempSync(join(tmpdir(), 'lc-e2e-scored-'));
    e2eDirs.push(out);
    const fixturesDir = join(SKILL_ROOT, 'assets', 'skill_benchmark', 'fixtures', 'deep_improvement');
    execFileSync('node', [join(SB, 'run-skill-benchmark.cjs'), '--skill', SKILL_ROOT, '--fixtures-dir', fixturesDir, '--outputs-dir', out], { encoding: 'utf8' });
    const report = JSON.parse(readFileSync(join(out, 'skill-benchmark-report.json'), 'utf8'));
    expect(Array.isArray(report.scenarioRows)).toBe(true);
    expect(report.scenarioRows.length).toBeGreaterThan(0);
    const scored = report.scenarioRows.find((r: any) => !r.loadError);
    expect(scored).toBeTruthy();
    expect(scored.dims?.d1intra).toBeTruthy();
  });
});
