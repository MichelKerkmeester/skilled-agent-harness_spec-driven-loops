import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SKILL_ROOT = resolve(__dirname, '..', '..', '..');
const REPO_SKILLS = resolve(SKILL_ROOT, '..', '..');
const SB = join(SKILL_ROOT, 'scripts', 'skill-benchmark');
const SKDESIGN = join(REPO_SKILLS, 'sk-design');
const FIXTURES = join(SKILL_ROOT, 'assets', 'skill_benchmark', 'fixtures');

const { routeSkillResources } = require(join(SB, 'router-replay.cjs'));
const { scoreScenario, aggregate } = require(join(SB, 'score-skill-benchmark.cjs'));
const { lintDesignToken } = require(join(SB, 'design-token-lint.cjs'));

function readJson(filePath: string): any {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function loadPair(dirName: string, id: string): { publicFixture: any; privateFixture: any } {
  const dir = join(FIXTURES, dirName);
  return {
    publicFixture: readJson(join(dir, `${id}.public.json`)),
    privateFixture: readJson(join(dir, `${id}.private.json`)),
  };
}

function loadPairs(dirName: string): Array<{ publicFixture: any; privateFixture: any }> {
  const dir = join(FIXTURES, dirName);
  return readdirSync(dir)
    .filter((name) => name.endsWith('.public.json'))
    .sort()
    .map((name) => loadPair(dirName, name.replace(/\.public\.json$/, '')));
}

function findingCodes(result: any): string[] {
  return result.findings.map((finding: any) => finding.code);
}

function expectDesignRoute(publicFixture: any, privateFixture: any): void {
  const route = routeSkillResources({ skillRoot: SKDESIGN, taskText: publicFixture.public.prompt });
  expect(route.parseable).toBe(true);
  expect(route.intents).toContain(privateFixture.expected.workflowMode);
  expect(route.resources).toContain('design-interface/SKILL.md');
  expect(route.routeTelemetry.workflowMode).toContain(privateFixture.expected.workflowMode);
}

describe('design proof token lint — dispatch fixtures', () => {
  it('accepts the faithful token and routes the prompt to sk-design', () => {
    const { publicFixture, privateFixture } = loadPair('sk-design-dispatch', 'sk_design_dispatch_faithful_001');
    expectDesignRoute(publicFixture, privateFixture);

    const lint = lintDesignToken(publicFixture);
    expect(lint.verdict).toBe('valid');
    expect(lint.findings).toEqual([]);
  });

  it('rejects a weakened token even when the route is sk-design', () => {
    const { publicFixture, privateFixture } = loadPair('sk-design-dispatch', 'sk_design_dispatch_stripped_001');
    expectDesignRoute(publicFixture, privateFixture);

    const lint = lintDesignToken(publicFixture);
    expect(lint.verdict).toBe('rejected');
    expect(findingCodes(lint)).toContain('single-use-not-true');
  });

  it('fails closed when neither the route nor the token is present', () => {
    const { publicFixture, privateFixture } = loadPair('sk-design-dispatch', 'sk_design_dispatch_neither_001');
    const route = routeSkillResources({ skillRoot: SKDESIGN, taskText: publicFixture.public.prompt });
    expect(route.parseable).toBe(true);
    expect(route.intents).toEqual([]);
    expect(route.routeTelemetry.defaultApplied).toBe(true);
    for (const forbidden of privateFixture.expected.forbiddenWorkflowModes) {
      expect(route.intents).not.toContain(forbidden);
    }

    const lint = lintDesignToken(publicFixture);
    expect(lint.verdict).toBe('rejected');
    expect(findingCodes(lint)).toContain('missing-token');
  });
});

describe('design proof token lint — route-gold guard', () => {
  it('keeps the existing sk-design hub route headline at 29 pass, 5 known gaps, 0 regressions', () => {
    const rows = loadPairs('sk-design').map(({ publicFixture, privateFixture }) => {
      const routerResult = routeSkillResources({ skillRoot: SKDESIGN, taskText: publicFixture.public.prompt });
      return scoreScenario({
        scenarioId: publicFixture.scenarioId,
        tier: publicFixture.tier,
        routerResult,
        expected: privateFixture.expected,
      });
    });

    const report = aggregate({
      skillId: 'sk-design',
      skillRoot: SKDESIGN,
      scenarioRows: rows,
      connectivity: { score: 100, gateFailed: false, findings: [] },
      traceMode: 'router',
    });

    const routeRows = report.scenarioRows.filter((row: any) => row.dims?.hubRoute?.applicable);
    const passed = routeRows.filter((row: any) => row.dims.hubRoute.pass).length;

    expect(routeRows).toHaveLength(34);
    expect(passed).toBe(29);
    expect(report.gate.hubRoute.knownGaps).toBe(5);
    expect(report.gate.hubRoute.regressions).toBe(0);
    expect(report.gate.hubRoute.failed).toBe(false);
  });
});
