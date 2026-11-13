// ───────────────────────────────────────────────────────────────
// MODULE: Command Head Length Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { COMMAND_ROWS, TRACKED_COMMANDS } from '../lib/command-attach.js';
import { renderAdvisorBrief } from '../lib/render.js';

const DIRECTIVES_LABEL = '\nDirectives:';
// The renderer caps the advisor portion at its default 80 tokens and estimates
// four characters per token, so a head over this byte budget has lost the
// command it was supposed to carry.
const HEAD_BYTE_LIMIT = 80 * 4;
// A child session replaces start and ask policies with a parent-named marker,
// so the cases pin the plain head a top-level reader receives.
const TOP_LEVEL_OPTIONS = { childSession: false } as const;

type AdvisorBriefResult = Parameters<typeof renderAdvisorBrief>[0];

interface RecommendationInput {
  readonly skill: string;
  readonly kind?: 'skill' | 'command';
  readonly command?: string;
  readonly policy?: 'run' | 'start' | 'ask';
  readonly ownerSkillId?: string;
  readonly confidence: number;
  readonly uncertainty: number;
}

interface HeadCase {
  readonly name: string;
  readonly recommendation: RecommendationInput;
  readonly command: string;
  readonly policy: string | undefined;
}

// Every tracked command renders through its owner so the head carries the
// command, the policy and the owner even where no scorer row can return it.
const TRACKED_CASES: readonly HeadCase[] = Object.entries(TRACKED_COMMANDS).map(([command, row]) => ({
  name: `tracked ${command}`,
  command,
  policy: row.policy,
  recommendation: {
    skill: row.ownerSkillId,
    kind: 'skill',
    command,
    policy: row.policy,
    ownerSkillId: row.ownerSkillId,
    confidence: 0.9,
    uncertainty: 0.1,
  },
}));

// A recommendation may carry only a row id and still fill its command, policy
// and owner from the generated table, which is the path the brief relies on.
const ROW_CASES: readonly HeadCase[] = Object.entries(COMMAND_ROWS).map(([id, row]) => ({
  name: `row ${id}`,
  command: row.command,
  policy: row.policy,
  recommendation: {
    skill: id,
    kind: 'command',
    confidence: 0.9,
    uncertainty: 0.1,
  },
}));

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

function headOf(rendered: string | null): string {
  if (rendered === null) {
    throw new Error('expected a rendered brief');
  }
  return rendered.split(DIRECTIVES_LABEL)[0];
}

function headViolations(head: string, command: string, policy: string | undefined): readonly string[] {
  const violations: string[] = [];
  const bytes = Buffer.byteLength(head, 'utf8');
  if (bytes > HEAD_BYTE_LIMIT) {
    violations.push(`${bytes} bytes over the ${HEAD_BYTE_LIMIT} byte limit`);
  }
  if (head.endsWith('...')) {
    violations.push('head ends with an ellipsis');
  }
  const commandLabel = policy === undefined ? null : `${command} (${policy})`;
  if (commandLabel === null || !head.includes(commandLabel)) {
    violations.push(`${command} (${policy ?? 'no policy'}) is missing`);
  }
  return violations;
}

describe('command head length', () => {
  it.each(TRACKED_CASES)('fits $name in the default cap', ({ recommendation, command, policy }) => {
    const head = headOf(renderAdvisorBrief(advisorResult(recommendation), TOP_LEVEL_OPTIONS));

    expect(headViolations(head, command, policy)).toEqual([]);
  });

  it.each(ROW_CASES)('fits $name in the default cap', ({ recommendation, command, policy }) => {
    const head = headOf(renderAdvisorBrief(advisorResult(recommendation), TOP_LEVEL_OPTIONS));

    expect(headViolations(head, command, policy)).toEqual([]);
  });

  it('rejects a command long enough to push the policy out of the head', () => {
    const longCommand = `/${'x'.repeat(329)}`;
    const head = headOf(renderAdvisorBrief(advisorResult({
      skill: 'sk-doc',
      kind: 'command',
      command: longCommand,
      policy: 'start',
      ownerSkillId: 'sk-doc',
      confidence: 0.9,
      uncertainty: 0.1,
    }), TOP_LEVEL_OPTIONS));

    expect(headViolations(head, longCommand, 'start')).not.toEqual([]);
  });
});
