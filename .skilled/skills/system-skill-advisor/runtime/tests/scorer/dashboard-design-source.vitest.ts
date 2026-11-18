// ───────────────────────────────────────────────────────────────────
// MODULE: Dashboard Design Source
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { scoreExplicitLane } from '../../lib/scorer/lanes/explicit.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';

const PROJECTION = createFixtureProjection([]);

function dashboardBoost(prompt: string): boolean {
  return scoreExplicitLane(prompt, PROJECTION)
    .some((entry) => entry.skillId === 'sk-code' && entry.evidence.includes('token:dashboard'));
}

// A dashboard pulled from a design tool is a design fetch, not code to write.
describe('dashboard token boost and design-tool sources', () => {
  it('skips the code boost when the dashboard comes from a design tool', () => {
    expect(dashboardBoost('get the dashboard design from figma')).toBe(false);
    expect(dashboardBoost('fetch the dashboard frame from figma')).toBe(false);
    expect(dashboardBoost('find dashboard examples on mobbin')).toBe(false);
  });

  it('keeps the boost for dashboard code work', () => {
    expect(dashboardBoost('build the admin dashboard page')).toBe(true);
    expect(dashboardBoost('fix the dashboard chart rendering bug')).toBe(true);
  });
});

function laneScore(prompt: string, skillId: string): number {
  return scoreExplicitLane(prompt, PROJECTION).find((entry) => entry.skillId === skillId)?.score ?? 0;
}

// Reading a frame out of a design tool is the MCP transport's job; building from
// that frame stays code work.
describe('design-tool reads', () => {
  it('sends a read from a design tool to the MCP transports', () => {
    for (const prompt of [
      'get the dashboard design from figma',
      'fetch the dashboard frame from figma',
      'pull the onboarding screens out of figma',
      'grab the figma frame for the partners dashboard',
    ]) {
      expect(laneScore(prompt, 'mcp-tooling'), prompt).toBeGreaterThan(laneScore(prompt, 'sk-code'));
    }
  });

  it('leaves building from a design tool with the code skill', () => {
    for (const prompt of [
      'implement the dashboard from figma',
      'build the settings page from the figma frame',
    ]) {
      expect(laneScore(prompt, 'mcp-tooling'), prompt).toBe(0);
    }
  });
});
