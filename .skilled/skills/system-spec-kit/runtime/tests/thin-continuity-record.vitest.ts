import { describe, expect, it } from 'vitest';

import {
  THIN_CONTINUITY_MAX_BYTES,
  readThinContinuityRecord,
  upsertThinContinuityInMarkdown,
  validateThinContinuityRecord,
} from '../lib/continuity/thin-continuity-record';

const VALID_FINGERPRINT = `sha256:${'a'.repeat(64)}`;

function makeFrontmatterMarkdown(): string {
  return [
    '---',
    'title: "Continuity Fixture"',
    'description: "Fixture for thin continuity tests."',
    'importance_tier: important',
    'contextType: implementation',
    '---',
    '',
    '# Continuity Fixture',
    '',
    'Body content that should survive frontmatter updates.',
    '',
  ].join('\n');
}

describe('thin continuity record', () => {
  it('writes and re-reads a normalized continuity block from markdown frontmatter', () => {
    const markdown = makeFrontmatterMarkdown();

    const writeResult = upsertThinContinuityInMarkdown(markdown, {
      packet_pointer: '026-graph-and-context-optimization/006-canonical-continuity-refactor/',
      last_updated_at: '2026-04-11T18:48:00+02:00',
      last_updated_by: 'gate-c-worker',
      recent_action: 'Completed continuity schema validation',
      next_safe_action: 'Review parity fixtures',
      blockers: ['none'],
      key_files: [
        'research//iterations/iteration-024.md',
        './scratch/resource-map/04-templates.md',
      ],
      session_dedup: {
        fingerprint: VALID_FINGERPRINT,
        session_id: 'gate-c-session-001',
        parent_session_id: 'gate-c-session-000',
      },
      completion_pct: 42,
      open_questions: ['Q10', 'q2'],
      answered_questions: ['q1'],
    });

    expect(writeResult.ok).toBe(true);
    expect(writeResult.markdown).toContain('_memory:');
    expect(writeResult.markdown).toContain('continuity:');
    expect(writeResult.markdown).toContain('Body content that should survive frontmatter updates.');

    const readResult = readThinContinuityRecord(writeResult.markdown!);
    expect(readResult.ok).toBe(true);
    expect(readResult.record).toMatchObject({
      packet_pointer: '026-graph-and-context-optimization/006-canonical-continuity-refactor',
      last_updated_at: '2026-04-11T16:48:00Z',
      last_updated_by: 'gate-c-worker',
      recent_action: 'Completed continuity schema validation',
      next_safe_action: 'Review parity fixtures',
      blockers: [],
      key_files: ['research/iterations/iteration-024.md', 'scratch/resource-map/04-templates.md'],
      completion_pct: 42,
      open_questions: ['Q2', 'Q10'],
      answered_questions: ['Q1'],
      session_dedup: {
        fingerprint: VALID_FINGERPRINT,
        session_id: 'gate-c-session-001',
        parent_session_id: 'gate-c-session-000',
      },
    });
  });

  it('rejects malformed narrative recent_action content', () => {
    const result = validateThinContinuityRecord({
      packet_pointer: '026-graph-and-context-optimization/006-canonical-continuity-refactor',
      last_updated_at: '2026-04-11T16:48:00Z',
      last_updated_by: 'gate-c-worker',
      recent_action: 'Completed iteration 24 validation design. This clarified why legacy blocks should auto-hydrate.',
      next_safe_action: 'Review parity fixtures',
      blockers: [],
      key_files: [],
      completion_pct: 10,
      open_questions: [],
      answered_questions: [],
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'MEMORY_006', field: 'recent_action' }),
      ]),
    );
  });

  it('fails budget enforcement after normalization when the fragment remains oversized', () => {
    const packetPointer = Array.from({ length: 60 }, (_, index) => `segment-${index.toString().padStart(2, '0')}-canonical-continuity`)
      .join('/');

    const result = validateThinContinuityRecord({
      packet_pointer: packetPointer,
      last_updated_at: '2026-04-11T16:48:00Z',
      last_updated_by: 'gate-c-worker',
      recent_action: 'Completed canonical continuity budget verification',
      next_safe_action: 'Review parity fixtures',
      blockers: [
        'awaiting-template-continuity-validation-pass',
        'awaiting-shadow-compare-verification-pass',
        'awaiting-integration-smoke-test-verification',
        'awaiting-parity-dashboard-refresh',
        'awaiting-post-save-fingerprint-review',
      ],
      key_files: Array.from({ length: 5 }, (_, index) => (
        `very/long/path/${index}/` +
        'phase-018-continuity/'.repeat(5) +
        `artifact-${index}.md`
      )),
      session_dedup: {
        fingerprint: VALID_FINGERPRINT,
        session_id: 'gate-c-session-001',
        parent_session_id: 'gate-c-session-000',
      },
      completion_pct: 55,
      open_questions: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12'],
      answered_questions: [],
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'MEMORY_017',
          details: expect.objectContaining({
            actualBytes: expect.any(Number),
            heaviestFields: expect.any(Array),
          }),
        }),
      ]),
    );
    expect(result.errors[0]?.details?.actualBytes as number).toBeGreaterThan(THIN_CONTINUITY_MAX_BYTES);
  });

  it('normalizes timestamps, question ids, and sentinel blockers deterministically', () => {
    const result = validateThinContinuityRecord({
      packet_pointer: '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/',
      last_updated_at: '2026-04-11T18:48:59+02:00',
      last_updated_by: 'gate-c-worker',
      recent_action: 'Completed continuity normalization pass',
      next_safe_action: 'Inspect routing audit',
      blockers: [' none ', 'N/A', ''],
      key_files: ['./templates//core/spec.md.tmpl', 'templates/core/plan.md.tmpl'],
      completion_pct: 15,
      open_questions: ['q10', 'Q2', 'Q10'],
      answered_questions: ['q1', 'Q3'],
    });

    expect(result.ok).toBe(true);
    expect(result.record).toMatchObject({
      packet_pointer: 'specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor',
      last_updated_at: '2026-04-11T16:48:59Z',
      blockers: [],
      key_files: ['templates/core/spec.md.tmpl', 'templates/core/plan.md.tmpl'],
      open_questions: ['Q2', 'Q10'],
      answered_questions: ['Q1', 'Q3'],
    });
  });

  it('replaces an existing continuity block without duplicating frontmatter keys', () => {
    const initial = upsertThinContinuityInMarkdown(makeFrontmatterMarkdown(), {
      packet_pointer: 'specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim',
      last_updated_at: '2026-04-15T07:15:00Z',
      last_updated_by: 'worker-one',
      recent_action: 'Prepared transcript prototype set',
      next_safe_action: 'Run planner comparison',
      blockers: [],
      key_files: ['implementation-summary.md'],
      completion_pct: 70,
      open_questions: ['Q1'],
      answered_questions: [],
    });

    expect(initial.ok).toBe(true);

    const replaced = upsertThinContinuityInMarkdown(initial.markdown!, {
      packet_pointer: 'specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim',
      last_updated_at: '2026-04-15T08:05:00Z',
      last_updated_by: 'worker-two',
      recent_action: 'Reviewed transcript mismatches',
      next_safe_action: 'Complete packet 015 closeout',
      blockers: [],
      key_files: ['implementation-summary.md', 'tasks.md'],
      completion_pct: 95,
      open_questions: [],
      answered_questions: [],
    });

    expect(replaced.ok).toBe(true);
    expect(replaced.markdown?.match(/continuity:/g)).toHaveLength(1);
    expect(replaced.markdown).toContain('worker-two');
    expect(replaced.markdown).not.toContain('worker-one');
    expect(replaced.markdown).toContain('Body content that should survive frontmatter updates.');

    const readBack = readThinContinuityRecord(replaced.markdown!);
    expect(readBack.ok).toBe(true);
    expect(readBack.record).toMatchObject({
      last_updated_by: 'worker-two',
      recent_action: 'Reviewed transcript mismatches',
      next_safe_action: 'Complete packet 015 closeout',
      key_files: ['implementation-summary.md', 'tasks.md'],
      completion_pct: 95,
      open_questions: [],
      answered_questions: [],
    });
  });

  // The module's YAML reader handles the continuity block's own shapes but not every
  // YAML form, so an upsert that re-serialized the whole frontmatter through it turned
  // a flow-style list into a single string. Only the _memory block may change.
  it('leaves every frontmatter line outside the _memory block byte for byte', () => {
    const markdown = [
      '---',
      'title: "Continuity Fixture"',
      'trigger_phrases: ["flow style phrase", "second phrase"]',
      'importance_tier: important',
      '_memory:',
      '  continuity:',
      '    packet_pointer: "track/old-packet"',
      '    recent_action: "Old action"',
      'completed: 2026-03-01',
      '---',
      '',
      '# Continuity Fixture',
      '',
    ].join('\n');

    const result = upsertThinContinuityInMarkdown(markdown, {
      packet_pointer: 'track/new-packet',
      last_updated_at: '2026-09-23T12:00:00Z',
      last_updated_by: 'generate-context',
      recent_action: 'Replaced the block',
      next_safe_action: 'Verify the untouched lines',
    });

    expect(result.ok).toBe(true);
    const lines = result.markdown!.split('\n');
    expect(lines.slice(0, 4)).toEqual(markdown.split('\n').slice(0, 4));
    expect(result.markdown).toContain('\ncompleted: 2026-03-01\n---\n\n# Continuity Fixture\n');
    expect(result.markdown).not.toContain('Old action');
    expect(readThinContinuityRecord(result.markdown!).record?.packet_pointer).toBe('track/new-packet');
  });
});

function makeContinuityMarkdown(fields: Record<string, string>): string {
  const continuity = {
    packet_pointer: '"track/flow-packet"',
    last_updated_at: '"2026-09-23T00:00:00Z"',
    last_updated_by: '"tester"',
    recent_action: '"Read the fixture block"',
    next_safe_action: '"Continue the fixture work"',
    blockers: '[]',
    key_files: '[]',
    completion_pct: '40',
    open_questions: '[]',
    answered_questions: '[]',
    ...fields,
  };
  return [
    '---',
    'title: "Flow Fixture"',
    '_memory:',
    '  continuity:',
    ...Object.entries(continuity).map(([key, value]) => `    ${key}: ${value}`),
    '---',
    '',
    '# Flow Fixture',
    '',
  ].join('\n');
}

describe('hand-written continuity blocks', () => {
  it('reads one-level flow lists as lists, keeping commas inside quotes', () => {
    const result = readThinContinuityRecord(makeContinuityMarkdown({
      blockers: '["Waiting on review", \'Second blocker\']',
      key_files: '["docs/a, b.md", plain.md]',
      open_questions: '[Q1, Q2]',
    }));

    expect(result.ok).toBe(true);
    expect(result.record?.blockers).toEqual(['Waiting on review', 'Second blocker']);
    expect(result.record?.key_files).toEqual(['docs/a, b.md', 'plain.md']);
    expect(result.record?.open_questions).toEqual(['Q1', 'Q2']);
  });

  it('leaves a flow list it cannot read as text, so validation still reports it', () => {
    const result = readThinContinuityRecord(makeContinuityMarkdown({ blockers: '["unclosed, "second"' }));

    expect(result.ok).toBe(false);
    expect(result.errors.map((error) => error.code)).toContain('MEMORY_008');
  });

  it.each([
    'None - the phase is closed',
    'None; nothing left to do',
    'Commit the reviewed phase',
    'Close the packet after review',
    'Hand off to the release owner',
  ])('accepts a next action that opens with a working verb: %s', (nextSafeAction) => {
    const result = readThinContinuityRecord(makeContinuityMarkdown({ next_safe_action: JSON.stringify(nextSafeAction) }));

    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it.each([
    'Replace template defaults on first save',
    'Operator decides the rollout order',
  ])('still rejects a next action that opens with a default or a noun: %s', (nextSafeAction) => {
    const result = readThinContinuityRecord(makeContinuityMarkdown({ next_safe_action: JSON.stringify(nextSafeAction) }));

    expect(result.ok).toBe(false);
    expect(result.errors.map((error) => error.code)).toContain('MEMORY_007');
  });
});
