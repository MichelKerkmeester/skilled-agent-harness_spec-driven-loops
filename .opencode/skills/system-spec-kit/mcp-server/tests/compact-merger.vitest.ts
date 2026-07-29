import { describe, expect, it, vi } from 'vitest';

import { mergeCompactBrief, type MergeInput } from '@spec-kit/shared/compact-merger';

function createInput(overrides: Partial<MergeInput> = {}): MergeInput {
  return {
    constitutional: 'Rule: preserve packet-local continuity.',
    codeGraph: 'Active file: /repo/src/session-resume.ts\nSymbol: handleSessionResume',
    sessionState: 'Next: run context-preservation scenario verification.',
    triggered: 'Triggered memory: strict session binding applies.',
    ...overrides,
  };
}

function emitCompactMergerDiagnostics(result: ReturnType<typeof mergeCompactBrief>): void {
  process.stdout.write(`${[
    '[compact-merger evidence]',
    'Rendered section headers and token estimates:',
    ...result.sections.map((section) => `- ## ${section.name} source=${section.source} tokenEstimate=${section.tokenEstimate}`),
    'MergedBrief.allocation:',
    ...result.allocation.allocations.map((allocation) => (
      `- ${allocation.name} floor=${allocation.floor} requested=${allocation.requested} granted=${allocation.granted} dropped=${allocation.dropped}`
    )),
    `MergedBrief.metadata.totalTokenEstimate=${result.metadata.totalTokenEstimate}`,
    `MergedBrief.metadata.sourceCount=${result.metadata.sourceCount}`,
    `MergedBrief.metadata.mergedAt=${result.metadata.mergedAt}`,
    `MergedBrief.metadata.mergeDurationMs=${result.metadata.mergeDurationMs}`,
    `MergedBrief.metadata.deduplicatedFiles=${result.metadata.deduplicatedFiles}`,
  ].join('\n')}\n`);
}

describe('compact merger manual scenarios 257 and 258', () => {
  it('renders all non-empty compact sections in priority order within budget', () => {
    const result = mergeCompactBrief(createInput({
      sessionState: 'Next: run context-preservation scenario verification.\nActive file: /repo/src/session-resume.ts',
    }), 4000);

    emitCompactMergerDiagnostics(result);

    expect(result.text).toContain('## Constitutional Rules');
    expect(result.text).toContain('## Active Files & Structural Context');
    expect(result.text).toContain('## Session State / Next Steps');
    expect(result.text).toContain('## Triggered Memories');
    expect(result.sections.map((section) => section.name)).toEqual([
      'Constitutional Rules',
      'Active Files & Structural Context',
      'Session State / Next Steps',
      'Triggered Memories',
    ]);
    expect(result.metadata.totalTokenEstimate).toBeLessThanOrEqual(4000);
    expect(result.metadata.sourceCount).toBe(4);
    expect(result.metadata.mergedAt).toEqual(expect.any(String));
    expect(result.metadata.deduplicatedFiles).toBe(1);
    expect(result.sections.find((section) => section.name === 'Session State / Next Steps')?.content)
      .not.toContain('/repo/src/session-resume.ts');
    expect(result.allocation.allocations.every((allocation) => (
      typeof allocation.floor === 'number'
      && typeof allocation.requested === 'number'
      && typeof allocation.granted === 'number'
      && typeof allocation.dropped === 'number'
    ))).toBe(true);
  });

  it('omits empty sources and respects tiny caller budgets', () => {
    const result = mergeCompactBrief(createInput({
      constitutional: '',
      codeGraph: '',
      triggered: '',
      sessionState: 'S'.repeat(4000),
    }), 1);

    expect(result.metadata.totalTokenEstimate).toBeLessThanOrEqual(1);
    expect(result.text).not.toContain('Constitutional Rules');
    expect(result.text).not.toContain('Triggered Memories');
    expect(result.sections.map((section) => section.name)).toEqual(['Session State / Next Steps']);
  });
});
