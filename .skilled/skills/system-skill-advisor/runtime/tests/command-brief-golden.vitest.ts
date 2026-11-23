// ───────────────────────────────────────────────────────────────
// MODULE: Command Brief Golden Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderAdvisorBrief } from '../lib/render.js';

const DIRECTIVES_LABEL = '\nDirectives:';
// The advisor portion is capped at 80 tokens and the renderer estimates four
// characters per token, so a longer head has already lost the command it offered.
const HEAD_CHARACTER_CAP = 320;

type AdvisorBriefResult = Parameters<typeof renderAdvisorBrief>[0];

interface RecommendationInput {
  readonly skill: string;
  readonly kind?: 'skill' | 'command';
  readonly command?: string;
  readonly policy?: 'run' | 'start' | 'ask';
  readonly ownerSkillId?: string;
  readonly needsMode?: boolean;
  readonly typed?: true;
  readonly confidence: number;
  readonly uncertainty: number;
}

interface HeadCase {
  readonly name: string;
  readonly recommendation: RecommendationInput;
  readonly expectedHead: string;
}

const HEAD_CASES: readonly HeadCase[] = [
  {
    name: 'a documentation request names the owning skill, the command and its policy',
    recommendation: {
      skill: 'sk-doc',
      kind: 'command',
      command: '/create:readme',
      policy: 'start',
      ownerSkillId: 'sk-doc',
      confidence: 0.95,
      uncertainty: 0.12,
    },
    expectedHead: 'Advisor: live; use sk-doc → /create:readme (start) 0.95/0.12 pass.',
  },
  {
    name: 'a research hub names the deep workflow it would start',
    recommendation: {
      skill: 'system-deep-loop',
      kind: 'command',
      command: '/deep:research',
      policy: 'ask',
      ownerSkillId: 'system-deep-loop',
      confidence: 0.82,
      uncertainty: 0.16,
    },
    expectedHead: 'Advisor: live; use system-deep-loop → /deep:research (ask: A /deep:research:auto (Recommended), B /deep:research:confirm, C no loop) 0.82/0.16 pass.',
  },
  {
    name: 'a design request names the chart mode',
    recommendation: {
      skill: 'sk-design',
      kind: 'command',
      command: '/design:chart',
      policy: 'start',
      ownerSkillId: 'sk-design',
      confidence: 0.9,
      uncertainty: 0.12,
    },
    expectedHead: 'Advisor: live; use sk-design → /design:chart (start) 0.90/0.12 pass.',
  },
  {
    name: 'a doctor bridge names the owning skill and the runnable subcommand',
    recommendation: {
      skill: 'command-doctor-git-hooks',
      kind: 'command',
      command: '/doctor:git hooks',
      policy: 'ask',
      ownerSkillId: 'sk-git',
      confidence: 0.82,
      uncertainty: 0.12,
    },
    expectedHead: 'Advisor: live; use sk-git → /doctor:git hooks (ask) 0.82/0.12 pass.',
  },
  {
    name: 'a memory save names the spec workflow',
    recommendation: {
      skill: 'system-spec-kit',
      kind: 'command',
      command: '/speckit:save',
      policy: 'start',
      ownerSkillId: 'system-spec-kit',
      confidence: 0.89,
      uncertainty: 0.12,
    },
    expectedHead: 'Advisor: live; use system-spec-kit → /speckit:save (start) 0.89/0.12 pass.',
  },
  {
    name: 'a prompt rewrite names the prompt skill',
    recommendation: {
      skill: 'sk-prompt',
      kind: 'command',
      command: '/prompt:improve',
      policy: 'start',
      ownerSkillId: 'sk-prompt',
      confidence: 0.89,
      uncertainty: 0.12,
    },
    expectedHead: 'Advisor: live; use sk-prompt → /prompt:improve (start) 0.89/0.12 pass.',
  },
  {
    name: 'a row id with no fields is filled from the generated command table',
    recommendation: {
      skill: 'command-create-readme',
      kind: 'command',
      confidence: 0.91,
      uncertainty: 0.11,
    },
    expectedHead: 'Advisor: live; use sk-doc → /create:readme (start) 0.91/0.11 pass.',
  },
  {
    name: 'an id with no row keeps the plain skill head',
    recommendation: {
      skill: 'sk-review',
      confidence: 0.61,
      uncertainty: 0.28,
    },
    expectedHead: 'Advisor: live; use sk-review 0.61/0.28 pass.',
  },
  {
    name: 'a command with no known policy drops the parenthesis',
    recommendation: {
      skill: 'command-doctor-review-gate',
      kind: 'command',
      command: '/doctor:review gate',
      ownerSkillId: 'sk-code',
      confidence: 0.77,
      uncertainty: 0.2,
    },
    expectedHead: 'Advisor: live; use sk-code → /doctor:review gate 0.77/0.20 pass.',
  },
  {
    name: 'a hub that needs a mode says so instead of naming a command',
    recommendation: {
      skill: 'system-deep-loop',
      needsMode: true,
      confidence: 0.82,
      uncertainty: 0.2,
    },
    expectedHead: 'Advisor: live; use system-deep-loop (needs a mode) 0.82/0.20 pass.',
  },
  {
    name: 'a command on the hub wins over the mode flag',
    recommendation: {
      skill: 'system-deep-loop',
      kind: 'command',
      command: '/deep:review',
      policy: 'ask',
      ownerSkillId: 'system-deep-loop',
      needsMode: true,
      confidence: 0.82,
      uncertainty: 0.16,
    },
    expectedHead: 'Advisor: live; use system-deep-loop → /deep:review (ask: A /deep:review:auto (Recommended), B /deep:review:confirm, C no loop) 0.82/0.16 pass.',
  },
  {
    name: 'a typed deep-loop command with a mode suffix prints no offer options',
    recommendation: {
      skill: 'system-deep-loop',
      kind: 'command',
      command: '/deep:review',
      policy: 'ask',
      ownerSkillId: 'system-deep-loop',
      typed: true,
      confidence: 0.94,
      uncertainty: 0.12,
    },
    expectedHead: 'Advisor: live; use system-deep-loop → /deep:review (ask) 0.94/0.12 pass.',
  },
  {
    name: 'a typed research command prints no offer options',
    recommendation: {
      skill: 'system-deep-loop',
      kind: 'command',
      command: '/deep:research',
      policy: 'ask',
      ownerSkillId: 'system-deep-loop',
      typed: true,
      confidence: 0.84,
      uncertainty: 0.12,
    },
    expectedHead: 'Advisor: live; use system-deep-loop → /deep:research (ask) 0.84/0.12 pass.',
  },
];

// Every recommendation is marked as passing so each case isolates the head form
// instead of threshold filtering.
function advisorResult(recommendation: RecommendationInput): AdvisorBriefResult {
  return {
    status: 'ok',
    freshness: 'live',
    recommendations: [{ ...recommendation, passes_threshold: true }],
    metrics: { tokenCap: 80 },
  };
}

// The ambiguous branch renders only above the default token cap, so the two-sided
// case carries its own wider-capped result instead of the single-entry helper.
const AMBIGUOUS_COMMAND_RESULT: AdvisorBriefResult = {
  status: 'ok',
  freshness: 'live',
  recommendations: [
    {
      skill: 'command-doctor-git-hooks',
      kind: 'command',
      confidence: 0.82,
      uncertainty: 0.12,
      passes_threshold: true,
    },
    {
      skill: 'command-speckit-save',
      kind: 'command',
      confidence: 0.89,
      uncertainty: 0.12,
      passes_threshold: true,
    },
  ],
  ambiguous: true,
  metrics: { tokenCap: 120 },
};

function headOf(rendered: string | null): string {
  if (rendered === null) {
    throw new Error('expected a rendered brief');
  }
  return rendered.split(DIRECTIVES_LABEL)[0];
}

describe('command brief golden heads', () => {
  // The expected heads are the interactive ones, so a run inside a dispatched
  // child must not turn them into the child form.
  beforeEach(() => {
    vi.stubEnv('AI_SESSION_CHILD', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each(HEAD_CASES)('renders $name', ({ recommendation, expectedHead }) => {
    const head = headOf(renderAdvisorBrief(advisorResult(recommendation)));

    expect(head).toBe(expectedHead);
    expect(head.length).toBeLessThanOrEqual(HEAD_CHARACTER_CAP);
    expect(head).not.toContain('command-');
  });

  // A generated row can name a command the hub withheld because the prompt names
  // no single mode, so the marker wins over the row instead of printing a command
  // the reader never asked for.
  it('renders needs a mode even when the id has a command row', () => {
    const head = headOf(renderAdvisorBrief(advisorResult({
      skill: 'command-create-agent',
      needsMode: true,
      confidence: 0.95,
      uncertainty: 0.12,
    })));

    expect(head).toContain('use sk-doc (needs a mode)');
    expect(head).not.toContain('command-');
    expect(head).not.toContain('/create:agent');
  });

  // A dispatched child must not start or offer the loop, so it keeps the
  // parent-named marker and never sees the options it could act on.
  it('renders a deep-loop command in a child session without the offer options', () => {
    const head = headOf(renderAdvisorBrief(
      advisorResult(HEAD_CASES[1].recommendation),
      { childSession: true },
    ));

    expect(head).toBe('Advisor: live; use system-deep-loop → /deep:research (parent-named only) 0.82/0.16 pass.');
    expect(head).not.toContain('A /deep:research:auto');
  });

  // The offer options make the head longer, and the diagnosis companion is the
  // line a stuck run needs, so both must still fit the default cap.
  it('keeps the doctor companion beside a deep-loop offer at the default cap', () => {
    const rendered = renderAdvisorBrief({
      status: 'ok',
      freshness: 'live',
      recommendations: [
        { ...HEAD_CASES[1].recommendation, command: '/deep:review', passes_threshold: true },
        { skill: 'command-doctor-deep-loop', kind: 'command', confidence: 0.8, uncertainty: 0.2, passes_threshold: true },
      ],
      metrics: { tokenCap: 80 },
    });

    expect(headOf(rendered)).toContain('/deep:review (ask: A /deep:review:auto (Recommended), B /deep:review:confirm, C no loop)');
    expect(headOf(rendered)).toContain('\nAlso: /doctor:deep-loop');
  });

  // An ambiguous head renders each side through the same label, so the deep-loop
  // side keeps its offer options beside the partner it ties with.
  it('keeps the deep-loop offer options under an ambiguous head', () => {
    const head = headOf(renderAdvisorBrief({
      status: 'ok',
      freshness: 'live',
      recommendations: [
        { ...HEAD_CASES[1].recommendation, command: '/deep:review', confidence: 0.95, uncertainty: 0.16, passes_threshold: true },
        { skill: 'sk-code', confidence: 0.9, uncertainty: 0.12, passes_threshold: true },
      ],
      ambiguous: true,
      metrics: { tokenCap: 120 },
    }));

    expect(head).toBe('Advisor: live; ambiguous: system-deep-loop → /deep:review (ask: A /deep:review:auto (Recommended), B /deep:review:confirm, C no loop) 0.95/0.16 vs sk-code 0.90/0.12 pass.');
  });

  it('renders both command labels under an ambiguous head', () => {
    const head = headOf(renderAdvisorBrief(AMBIGUOUS_COMMAND_RESULT));

    expect(head.startsWith('Advisor: live; ambiguous: sk-git → /doctor:git hooks (ask)')).toBe(true);
    expect(head).toContain(' vs system-spec-kit → /speckit:save (start)');
    expect(head.length).toBeLessThanOrEqual(HEAD_CHARACTER_CAP);
    expect(head).not.toContain('command-');
  });
});
