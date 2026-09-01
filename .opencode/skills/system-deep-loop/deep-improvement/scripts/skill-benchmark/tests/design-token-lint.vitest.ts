import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SKILL_ROOT = resolve(__dirname, '..', '..', '..');
const REPO_SKILLS = resolve(SKILL_ROOT, '..', '..');
const SB = join(SKILL_ROOT, 'scripts', 'skill-benchmark');
const SKDESIGN = join(REPO_SKILLS, 'sk-design');
const FIXTURES = join(SKILL_ROOT, 'assets', 'skill-benchmark', 'fixtures');

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

// sk-design was rebuilt as a standalone skill: it no longer projects a hub
// router, so no prompt can route to a workflow mode there any more. The design
// dispatch fixtures were minted against that retired hub, which makes them
// frozen evidence rather than a live route expectation — the token lint below is
// what still binds. This helper pins the retirement itself, so a sk-design that
// silently regains hub routing fails here and forces the fixtures to be revisited.
function expectNoHubRoute(publicFixture: any): void {
  const route = routeSkillResources({ skillRoot: SKDESIGN, taskText: publicFixture.public.prompt });
  expect(route.parseable).toBe(true);
  expect(route.intents).toEqual([]);
  expect(route.routeTelemetry).toMatchObject({ observed: false, reason: 'no-hub-router' });
}

describe('design proof token lint — dispatch fixtures', () => {
  it('accepts the faithful token even though sk-design no longer hub-routes', () => {
    const { publicFixture } = loadPair('sk-design-dispatch', 'sk-design-dispatch-faithful-001');
    expectNoHubRoute(publicFixture);

    const lint = lintDesignToken(publicFixture);
    expect(lint.verdict).toBe('valid');
    expect(lint.findings).toEqual([]);
  });

  it('rejects a weakened token on payload shape alone', () => {
    const { publicFixture } = loadPair('sk-design-dispatch', 'sk-design-dispatch-stripped-001');
    expectNoHubRoute(publicFixture);

    const lint = lintDesignToken(publicFixture);
    expect(lint.verdict).toBe('rejected');
    expect(findingCodes(lint)).toContain('single-use-not-true');
  });

  it('fails closed when neither the route nor the token is present', () => {
    const { publicFixture, privateFixture } = loadPair('sk-design-dispatch', 'sk-design-dispatch-neither-001');
    const route = routeSkillResources({ skillRoot: SKDESIGN, taskText: publicFixture.public.prompt });
    expect(route.parseable).toBe(true);
    expect(route.intents).toEqual([]);
    // With the hub retired there is no default mode left to apply, so the route
    // fails closed on the absent router rather than on a silent default.
    expect(route.routeTelemetry).toMatchObject({ observed: false, reason: 'no-hub-router' });
    for (const forbidden of privateFixture.expected.forbiddenWorkflowModes) {
      expect(route.intents).not.toContain(forbidden);
    }

    const lint = lintDesignToken(publicFixture);
    expect(lint.verdict).toBe('rejected');
    expect(findingCodes(lint)).toContain('missing-token');
  });
});

describe('design proof token lint — route-gold guard', () => {
  it('fails the route-gold gate loud when the hub a frozen corpus was minted against is retired', () => {
    // The sk-design corpus was minted while sk-design was a parent hub. The hub
    // was retired and the skill rebuilt as a standalone, so every route-applicable
    // row now routes nowhere. The property under test is that the gate reports
    // that as a regression instead of quietly scoring the corpus as green.
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
    expect(passed).toBe(0);
    expect(report.gate.hubRoute.knownGaps).toBe(5);
    expect(report.gate.hubRoute.regressions).toBe(29);
    expect(report.gate.hubRoute.failed).toBe(true);
    expect(report.gate.hubRoute.reason).toBe('route-gold regression');
  });
});
