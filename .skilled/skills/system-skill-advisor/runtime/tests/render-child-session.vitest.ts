// ───────────────────────────────────────────────────────────────
// MODULE: Child Session Brief Render Tests
// ───────────────────────────────────────────────────────────────
//
// A dispatched child must not start a workflow its parent did not name, so the
// brief swaps the policy word for a marker there and nowhere else.
//
// Axes, one row each:
//   child variable: set to 1, set to another value (0), unset
//   policy: run, start, ask
//   class: read-only, not read-only (add-only)

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DIRECTIVES_LABEL,
  HYGIENE_DIRECTIVE,
  renderAdvisorBrief,
} from '../lib/render.js';

type AdvisorBriefResult = Parameters<typeof renderAdvisorBrief>[0];

function expectedBrief(summary: string): string {
  return `${summary}${DIRECTIVES_LABEL}${HYGIENE_DIRECTIVE}`;
}

// One passing recommendation isolates the label form from threshold filtering.
function advisorResult(skill: string): AdvisorBriefResult {
  return {
    status: 'ok',
    freshness: 'live',
    recommendations: [{
      skill,
      kind: 'command',
      confidence: 0.85,
      uncertainty: 0.2,
      passes_threshold: true,
    }],
    metrics: { tokenCap: 80 },
  };
}

describe('child session command brief', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('renders a start command as parent-named only', () => {
    vi.stubEnv('AI_SESSION_CHILD', '1');

    const rendered = renderAdvisorBrief(advisorResult('command-create-readme'));

    expect(rendered).toBe(expectedBrief(
      'Advisor: live; use sk-doc → /create:readme (parent-named only) 0.85/0.20 pass.',
    ));
  });

  it('renders an ask command as parent-named only', () => {
    vi.stubEnv('AI_SESSION_CHILD', '1');

    const rendered = renderAdvisorBrief(advisorResult('command-deep-research'));

    expect(rendered).toBe(expectedBrief(
      'Advisor: live; use system-deep-loop → /deep:research (parent-named only) 0.85/0.20 pass.',
    ));
  });

  it('keeps the policy word for a read-only run', () => {
    vi.stubEnv('AI_SESSION_CHILD', '1');

    const rendered = renderAdvisorBrief(advisorResult('command-doctor-git-setup'));

    expect(rendered).toBe(expectedBrief(
      'Advisor: live; use sk-git → /doctor:git setup (run) 0.85/0.20 pass.',
    ));
  });

  it('renders a run command that adds files as parent-named only', () => {
    vi.stubEnv('AI_SESSION_CHILD', '1');

    const rendered = renderAdvisorBrief(advisorResult('command-doctor-speckit'));

    expect(rendered).toBe(expectedBrief(
      'Advisor: live; use system-skilled-doctor → /doctor:speckit (parent-named only) 0.85/0.20 pass.',
    ));
  });

  it('matches the non-child render when the variable is 0', () => {
    vi.stubEnv('AI_SESSION_CHILD', '0');
    const baseline = renderAdvisorBrief(advisorResult('command-create-readme'), { childSession: false });

    const rendered = renderAdvisorBrief(advisorResult('command-create-readme'));

    expect(rendered).toBe(baseline);
    expect(rendered).toBe(expectedBrief(
      'Advisor: live; use sk-doc → /create:readme (start) 0.85/0.20 pass.',
    ));
  });

  it('matches the non-child render when the variable is unset', () => {
    vi.stubEnv('AI_SESSION_CHILD', undefined);
    const baseline = renderAdvisorBrief(advisorResult('command-deep-research'), { childSession: false });

    const rendered = renderAdvisorBrief(advisorResult('command-deep-research'));

    expect(rendered).toBe(baseline);
    expect(rendered).toBe(expectedBrief(
      'Advisor: live; use system-deep-loop → /deep:research (ask) 0.85/0.20 pass.',
    ));
  });

  it('renders a doctor bridge at the top as parent-named only', () => {
    vi.stubEnv('AI_SESSION_CHILD', '1');

    const rendered = renderAdvisorBrief(advisorResult('command-doctor-git-hooks'));

    expect(rendered).toBe(expectedBrief(
      'Advisor: live; use sk-git → /doctor:git hooks (parent-named only) 0.85/0.20 pass.',
    ));
  });
});
