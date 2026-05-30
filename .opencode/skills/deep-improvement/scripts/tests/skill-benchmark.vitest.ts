import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SKILL_ROOT = resolve(__dirname, '..', '..');
const SB = join(SKILL_ROOT, 'scripts', 'skill-benchmark');
const REPO_SKILLS = resolve(SKILL_ROOT, '..');

// A genuinely router-less skill dir (no INTENT_SIGNALS/RESOURCE_MAP). The
// deep-improvement skill itself now HAS a router (Lane B), so it cannot serve as
// the negative fixture — build a throwaway one.
function makeRouterlessSkill(): string {
  const dir = mkdtempSync(join(tmpdir(), 'lc-norouter-'));
  writeFileSync(join(dir, 'SKILL.md'), '---\nname: throwaway\n---\n# Throwaway\nNo smart router here.\n');
  return dir;
}

// router-replay is a pure module — exercise it directly.
const { routeSkillResources, scoreIntents, selectIntents } = require(join(SB, 'router-replay.cjs'));
const { buildBannedVocab, lintFixture } = require(join(SB, 'contamination-lint.cjs'));
const { scanConnectivity } = require(join(SB, 'd5-connectivity.cjs'));
const { scoreScenario, aggregate } = require(join(SB, 'score-skill-benchmark.cjs'));
const { renderReport } = require(join(SB, 'build-report.cjs'));
const { scoreD1Inter, probeAdvisor } = require(join(SB, 'advisor-probe.cjs'));
const loopHost = require(join(SKILL_ROOT, 'scripts', 'shared', 'loop-host.cjs'));

describe('Lane C — loop-host wiring (non-regression)', () => {
  it('registers skill-benchmark as a valid mode without disturbing Lane A/B', () => {
    expect(loopHost.VALID_MODES.has('skill-benchmark')).toBe(true);
    expect(loopHost.VALID_MODES.has('agent-improvement')).toBe(true);
    expect(loopHost.VALID_MODES.has('model-benchmark')).toBe(true);
  });

  it('plans a single skill-benchmark orchestrator step', () => {
    const plan = loopHost.planInvocation('skill-benchmark', { skill: 'cli-codex', 'outputs-dir': '/tmp/x' });
    expect(plan.ok).toBe(true);
    expect(plan.steps).toHaveLength(1);
    expect(plan.steps[0].script).toBe('run-skill-benchmark.cjs');
  });

  it('fails closed when required skill-benchmark args are missing', () => {
    const plan = loopHost.planInvocation('skill-benchmark', { skill: 'cli-codex' });
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
  it('routes a REVIEW task on cli-codex to the expected resources', () => {
    const res = routeSkillResources({
      skillRoot: join(REPO_SKILLS, 'cli-codex'),
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
});

describe('Lane C — contamination linter', () => {
  it('flags a public prompt that leaks the skill name', () => {
    const vocab = buildBannedVocab({ skillRoot: join(REPO_SKILLS, 'cli-codex'), skillId: 'cli-codex' });
    const res = lintFixture({ publicText: 'use the cli-codex skill to review', bannedVocab: vocab });
    expect(res.passed).toBe(false);
    expect(res.hardLeaks.length).toBeGreaterThan(0);
  });

  it('passes a domain-language prompt with no skill identifiers', () => {
    const res = lintFixture({ publicText: 'please double check my code for bugs', bannedVocab: ['cli-codex', 'second opinion'] });
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
    const res = scanConnectivity({ skillRoot: join(REPO_SKILLS, 'cli-codex') });
    expect(res.routerParseable).toBe(true);
    // cli-codex routed paths exist, so no P0 dead-path gate.
    expect(res.deadResourcePaths).toEqual([]);
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
});

describe('Lane C — negative-activation scoring', () => {
  it('does not credit D3 for routing a resource that should be suppressed', () => {
    const routerResult = { parseable: true, intents: ['X'], resources: ['references/leak.md'], missingResources: [], scores: [] };
    const row = scoreScenario({ scenarioId: 'neg', tier: 'T3', routerResult, expected: { negativeActivation: true, resources: ['references/leak.md'] } });
    expect(row.dims.d1intra.score).toBe(0); // leaked the suppressed resource
    expect(row.dims.d3.score).toBe(0);      // D3 tracks the suppression failure, not over-routing
  });
});

describe('Lane C — malformed-fixture degradation', () => {
  it('degrades to an unparseable-fixture row instead of crashing', () => {
    const { run } = require(join(SB, 'run-skill-benchmark.cjs'));
    const fixDir = mkdtempSync(join(tmpdir(), 'lc-badfix-'));
    writeFileSync(join(fixDir, 'broken.public.json'), '{ not valid json');
    const out = mkdtempSync(join(tmpdir(), 'lc-badout-'));
    const code = run({ skill: 'cli-codex', 'outputs-dir': out, 'fixtures-dir': fixDir });
    expect(code).toBe(0); // did not crash
    const report = JSON.parse(readFileSync(join(out, 'skill-benchmark-report.json'), 'utf8'));
    const row = (report.scenarioRows || []).find((r: any) => r.firstFailingStage === 'unparseable-fixture');
    expect(row).toBeTruthy();
    expect(row.loadError).toBeTruthy();
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

describe('Lane C — end-to-end via run-skill-benchmark', () => {
  it('emits dual report artifacts for a router-bearing skill', () => {
    const out = mkdtempSync(join(tmpdir(), 'lc-e2e-'));
    execFileSync('node', [join(SB, 'run-skill-benchmark.cjs'), '--skill', 'cli-codex', '--outputs-dir', out], { encoding: 'utf8' });
    const jsonPath = join(out, 'skill-benchmark-report.json');
    const mdPath = join(out, 'skill-benchmark-report.md');
    expect(existsSync(jsonPath)).toBe(true);
    expect(existsSync(mdPath)).toBe(true);
    const report = JSON.parse(readFileSync(jsonPath, 'utf8'));
    expect(report.mode).toBe('skill-benchmark');
    expect(report.schemaVersion).toBe('skill-benchmark-report.v1');
  });
});
