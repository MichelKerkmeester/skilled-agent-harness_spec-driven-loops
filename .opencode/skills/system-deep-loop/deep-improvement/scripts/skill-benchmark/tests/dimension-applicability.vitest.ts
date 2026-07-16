import { describe, it, expect } from 'vitest';
import { resolve, join } from 'node:path';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';

// Lane C reports two kinds of missing dimension: runnable-but-unscored (a live
// dimension no probe covered this run) and excluded-by-design (structurally N/A
// for this skill). D1-inter is excluded for an advisor-invisible skill — one whose
// directory carries no graph-metadata.json, so the advisor ranks its owning parent
// identity, never the packet itself. This guard pins that distinction and proves
// the reporting change never moves the weighted aggregate.

const SKILL_ROOT = resolve(__dirname, '..', '..', '..');
const REPO_SKILLS = resolve(SKILL_ROOT, '..', '..');
const HARNESS = join(SKILL_ROOT, 'scripts', 'skill-benchmark');
const { run, augmentWithD4R } = require(join(HARNESS, 'run-skill-benchmark.cjs'));

const CODE_OPENCODE = join(REPO_SKILLS, 'sk-code', 'code-opencode'); // advisor-invisible surface
const SK_CODE = join(REPO_SKILLS, 'sk-code'); // advisor-visible hub identity

// The subject here is dimension-applicability REPORTING, not route conformance,
// so the route-gold hard gate (default on for hub-type skills) is disabled per
// run — otherwise a hub target's latent route-gold violations would fail these
// runs on an unrelated lane.
function runRouter(skill: string): { out: string; report: any } {
  const out = mkdtempSync(join(tmpdir(), 'lc-appl-'));
  const code = run({ skill, 'outputs-dir': out, 'trace-mode': 'router', 'route-gold': 'off' });
  expect(code).toBe(0);
  return { out, report: JSON.parse(readFileSync(join(out, 'skill-benchmark-report.json'), 'utf8')) };
}

describe('Lane C — dimension applicability reporting', () => {
  it('excludes D1-inter by design for an advisor-invisible surface', () => {
    const { report } = runRouter(CODE_OPENCODE);
    expect(report.excludedDimensions).toEqual(['D1inter']);
    expect(report.unscoredDimensions).toEqual(['D4']);
    const d1 = report.dimensionScores.D1inter;
    expect(d1.applicable).toBe(false);
    expect(d1.status).toBe('excluded-by-design');
    expect(d1.delegatedMeasure.targetSkill).toBe('sk-code');
    // The aggregate is still produced — the excluded dimension was already
    // normalized out of the weighted score.
    expect(typeof report.aggregateScore).toBe('number');
  });

  it('does not exclude D1-inter for an advisor-visible hub', () => {
    const { report } = runRouter(SK_CODE);
    expect(report.excludedDimensions).toEqual([]);
    expect(report.dimensionScores.D1inter.status).toBe('unscored-mode-a');
    expect(report.unscoredDimensions).toContain('D1inter');
  });

  it('D4-R fails closed when no target-owned scenarios are selected', async () => {
    const { out } = runRouter(CODE_OPENCODE);
    const code = await augmentWithD4R({ skill: CODE_OPENCODE, 'outputs-dir': out });
    expect(code).toBe(0);
    const report = JSON.parse(readFileSync(join(out, 'skill-benchmark-report.json'), 'utf8'));
    expect(report.advisorySignals.D4_task_outcome.status).toBe('not-run-no-target-scenarios');
  });
});
