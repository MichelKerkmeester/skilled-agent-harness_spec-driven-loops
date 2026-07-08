import { createRequire } from 'node:module';
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { createHermeticEnv, type HermeticEnv } from '../helpers/spawn-cjs';

const nodeRequire = createRequire(import.meta.url);
const {
  deriveRejectedPatternIndex,
  filterRejectedIdeaCandidates,
  reduceResearchState,
} = nodeRequire('../../../deep-research/scripts/reduce-state.cjs') as {
  deriveRejectedPatternIndex: (eventRecords: Array<Record<string, unknown>>, options?: {
    fuzzyThreshold?: number;
  }) => {
    entries: Array<{
      id: string;
      pattern: string;
      category: string;
    }>;
    maxEntries: number;
    fuzzyThreshold: number;
    warnings: string[];
  };
  filterRejectedIdeaCandidates: (
    candidates: Array<string | Record<string, unknown>>,
    rejectedIndex: Record<string, unknown>,
    options?: { category?: string; fuzzyThreshold?: number },
  ) => {
    accepted: Array<string | Record<string, unknown>>;
    suppressed: Array<{
      candidateText: string;
      category: string;
      matchType: string;
      rejectedPattern: string;
    }>;
  };
  reduceResearchState: (specFolder: string, options?: {
    write?: boolean;
    lenient?: boolean;
    emitResourceMap?: boolean;
    requireExistingState?: boolean;
  }) => {
    registry: {
      status?: string;
      keyQuestions?: Array<{
        id: string;
        inboxId?: string | null;
        text: string;
        operatorDecision?: string;
        conflictId?: string;
      }>;
      openQuestions?: Array<{
        id: string;
        inboxId?: string | null;
        text: string;
        origin?: string;
        source?: string;
        injectedAtIteration?: number;
        promotedQuestionId?: string | null;
        operatorDecision?: string;
        conflictId?: string;
      }>;
      resolvedQuestions?: Array<{
        id: string;
        inboxId?: string | null;
        text: string;
        origin?: string;
        source?: string;
        injectedAtIteration?: number;
        promotedQuestionId?: string | null;
        operatorDecision?: string;
        conflictId?: string;
      }>;
      questionConflicts?: Array<{
        conflictId: string;
        questionId: string;
        inboxId?: string | null;
        operatorDecision: string;
        registryValue: string;
        inboxValue: string;
      }>;
      rejectedPatterns?: Array<{
        id: string;
        ideaId?: string;
        pattern: string;
        category: string;
      }>;
      minIdeaObservations?: number;
      observedIdeas?: Array<{
        id: string;
        idea: string;
        category: string;
        observationCount: number;
      }>;
      promotedIdeas?: Array<{
        id: string;
        idea: string;
        category: string;
        observationCount: number;
        rank: number;
      }>;
      suppressedIdeas?: Array<{
        id: string;
        idea: string;
        observationCount: number;
        matchType: string;
        rejectedPattern: string;
      }>;
      suppressedCandidates?: Array<{
        candidateText: string;
        category: string;
        matchType: string;
        rejectedPattern: string;
      }>;
      rejectedPatternIndex?: {
        entries: Array<Record<string, unknown>>;
        maxEntries: number;
        fuzzyThreshold: number;
      };
    };
    strategy: string;
    dashboard: string;
    hasCorruption: boolean;
  };
};

const hermeticEnvs: HermeticEnv[] = [];

function makeTempSpec(): string {
  const env = createHermeticEnv('deep-research-reducer');
  hermeticEnvs.push(env);
  const specFolder = join(env.tmpDir, 'spec');
  mkdirSync(join(specFolder, 'research'), { recursive: true });
  writeFileSync(join(specFolder, 'spec.md'), '# Test Packet\n', 'utf8');
  writeFileSync(
    join(specFolder, 'research', 'deep-research-config.json'),
    `${JSON.stringify({
      topic: 'Reducer recovery test',
      createdAt: '2026-06-19T00:00:00.000Z',
      status: 'initialized',
      maxIterations: 3,
      resource_map: { emit: false },
    }, null, 2)}\n`,
    'utf8',
  );
  writeFileSync(join(specFolder, 'research', 'deep-research-strategy.md'), strategyTemplate(), 'utf8');
  return specFolder;
}

function strategyTemplate(): string {
  return [
    '# Deep Research Strategy',
    '',
    '<!-- ANCHOR:key-questions -->',
    '## 3. KEY QUESTIONS (remaining)',
    '- [ ] What should be checked?',
    '<!-- /ANCHOR:key-questions -->',
    '',
    '<!-- ANCHOR:answered-questions -->',
    '## 6. ANSWERED QUESTIONS',
    '[None yet]',
    '<!-- /ANCHOR:answered-questions -->',
    '',
    '<!-- ANCHOR:what-worked -->',
    '## 7. WHAT WORKED',
    '[None yet]',
    '<!-- /ANCHOR:what-worked -->',
    '',
    '<!-- ANCHOR:what-failed -->',
    '## 8. WHAT FAILED',
    '[None yet]',
    '<!-- /ANCHOR:what-failed -->',
    '',
    '<!-- ANCHOR:exhausted-approaches -->',
    '## 9. EXHAUSTED APPROACHES (do not retry)',
    '[None yet]',
    '<!-- /ANCHOR:exhausted-approaches -->',
    '',
    '<!-- ANCHOR:ruled-out-directions -->',
    '## 10. RULED OUT DIRECTIONS',
    '[None yet]',
    '<!-- /ANCHOR:ruled-out-directions -->',
    '',
    '<!-- ANCHOR:carried-forward-open-questions -->',
    '## 11A. CARRIED-FORWARD OPEN QUESTIONS',
    '[None yet]',
    '<!-- /ANCHOR:carried-forward-open-questions -->',
    '',
    '<!-- ANCHOR:next-focus -->',
    '## 11. NEXT FOCUS',
    '[None yet]',
    '<!-- /ANCHOR:next-focus -->',
    '',
  ].join('\n');
}

function writeState(specFolder: string, content: string): void {
  writeFileSync(join(specFolder, 'research', 'deep-research-state.jsonl'), content, 'utf8');
}

function writeInbox(specFolder: string, records: Array<Record<string, unknown>>): void {
  writeFileSync(
    join(specFolder, 'research', 'inbox.jsonl'),
    `${records.map((record) => JSON.stringify(record)).join('\n')}\n`,
    'utf8',
  );
}

function writePriorRegistry(specFolder: string, registry: Record<string, unknown>): void {
  writeFileSync(
    join(specFolder, 'research', 'findings-registry.json'),
    `${JSON.stringify(registry, null, 2)}\n`,
    'utf8',
  );
}

function readStateRecords(specFolder: string): Array<Record<string, unknown>> {
  return readFileSync(join(specFolder, 'research', 'deep-research-state.jsonl'), 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

function expectRecoveryRefusal(action: () => void, reason: string): void {
  try {
    action();
    throw new Error('Expected recovery refusal');
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(Error);
    expect((error as { code?: string }).code).toBe('STATE_RECOVERY_REFUSED');
    expect((error as { reason?: string }).reason).toBe(reason);
  }
}

afterEach(() => {
  while (hermeticEnvs.length > 0) {
    const env = hermeticEnvs.pop();
    if (env) {
      env.cleanup();
    }
  }
});

describe('deep-research reduce-state recovery gate', () => {
  it('refuses a missing expected state log in validate-existing-state mode', () => {
    const specFolder = makeTempSpec();

    expectRecoveryRefusal(
      () => reduceResearchState(specFolder, { write: false, requireExistingState: true }),
      'missing state log',
    );
  });

  it('refuses an empty expected state log in validate-existing-state mode', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, '');

    expectRecoveryRefusal(
      () => reduceResearchState(specFolder, { write: false, requireExistingState: true }),
      'empty state log',
    );
  });

  it('refuses a corrupt expected state log in validate-existing-state mode', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, '{"type":"iteration","run":1}\nnot-json\n');

    expectRecoveryRefusal(
      () => reduceResearchState(specFolder, { write: false, requireExistingState: true }),
      'corrupt state log',
    );
  });

  it('leaves the legitimate fresh reducer path unchanged when validation is not requested', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, '');

    const result = reduceResearchState(specFolder, { write: false });

    expect(result.hasCorruption).toBe(false);
    expect(result.registry.status).toBe('INITIALIZED');
  });

  it('renders log region fields when iteration records carry byte metadata', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, `${JSON.stringify({
      type: 'iteration',
      run: 1,
      status: 'complete',
      focus: 'offset metadata',
      findingsCount: 1,
      newInfoRatio: 0.4,
      logOffset: 34,
      logSize: 211,
      logPath: '/tmp/research/deep-research-state.jsonl',
    })}\n`);

    const result = reduceResearchState(specFolder, { write: false });

    expect(result.dashboard).toContain('| # | Focus | Track | Ratio | Findings | Status | Log Offset | Log Size | Log Path |');
    expect(result.dashboard).toContain('| 1 | offset metadata | - | 0.40 | 1 | complete | 34 | 211 | /tmp/research/deep-research-state.jsonl |');
  });

  it('promotes inbox questions with provenance into registry, strategy, and dashboard output', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, `${JSON.stringify({
      type: 'iteration',
      run: 3,
      status: 'complete',
      answeredQuestions: ['Which resolved provenance path?'],
    })}\n`);
    writeInbox(specFolder, [
      {
        id: 'inbox-angle-1',
        text: 'How should provenance travel?',
        source: 'angle-bank.seed',
        origin: 'angle-bank',
        injectedAtIteration: 2,
        promotedQuestionId: 'question-angle-1',
      },
      {
        id: 'inbox-analyst-1',
        text: 'Which resolved provenance path?',
        source: 'analyst.followup',
        origin: 'analyst-strategy',
        injectedAtIteration: 1,
        promotedQuestionId: 'question-analyst-1',
      },
    ]);

    const result = reduceResearchState(specFolder, { write: false });

    expect(result.registry.openQuestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'question-angle-1',
          inboxId: 'inbox-angle-1',
          text: 'How should provenance travel?',
          origin: 'angle-bank',
          source: 'angle-bank.seed',
          injectedAtIteration: 2,
          promotedQuestionId: 'question-angle-1',
        }),
      ]),
    );
    expect(result.registry.resolvedQuestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'question-analyst-1',
          inboxId: 'inbox-analyst-1',
          text: 'Which resolved provenance path?',
          origin: 'analyst-strategy',
          source: 'analyst.followup',
          injectedAtIteration: 1,
          promotedQuestionId: 'question-analyst-1',
        }),
      ]),
    );
    expect(result.strategy).toContain('- [ ] How should provenance travel?');
    expect(result.strategy).toContain('- [x] Which resolved provenance path?');
    expect(result.dashboard).toContain('- [ ] How should provenance travel? [angle-bank]');
  });

  it('keeps registry-owned question text and emits one conflict event for disagreeing inbox input', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, `${JSON.stringify({
      type: 'iteration',
      run: 2,
      status: 'complete',
      focus: 'registry conflict',
      findingsCount: 1,
      newInfoRatio: 0.3,
    })}\n`);
    writePriorRegistry(specFolder, {
      keyQuestions: [
        {
          id: 'question-canonical-1',
          text: 'What canonical question remains?',
          origin: 'operator',
          source: 'registry',
          injectedAtIteration: 1,
          resolved: false,
        },
      ],
    });
    writeInbox(specFolder, [
      {
        id: 'inbox-conflict-1',
        text: 'What incoming question should replace it?',
        source: 'operator.note',
        origin: 'operator',
        injectedAtIteration: 2,
        promotedQuestionId: 'question-canonical-1',
      },
    ]);

    const result = reduceResearchState(specFolder, { write: true });
    const conflict = result.registry.questionConflicts?.[0];

    expect(result.registry.keyQuestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'question-canonical-1',
          text: 'What canonical question remains?',
          operatorDecision: 'needs_decision',
          conflictId: conflict?.conflictId,
        }),
      ]),
    );
    expect(conflict).toMatchObject({
      questionId: 'question-canonical-1',
      inboxId: 'inbox-conflict-1',
      operatorDecision: 'needs_decision',
      registryValue: 'What canonical question remains?',
      inboxValue: 'What incoming question should replace it?',
    });
    expect(result.strategy).toContain('- [ ] What canonical question remains?');
    expect(result.strategy).not.toContain('What incoming question should replace it?');

    reduceResearchState(specFolder, { write: true });
    const conflictEvents = readStateRecords(specFolder).filter((record) => record.event === 'question_conflict');

    expect(conflictEvents).toHaveLength(1);
    expect(conflictEvents[0]).toMatchObject({
      conflictId: conflict?.conflictId,
      questionId: 'question-canonical-1',
      inboxId: 'inbox-conflict-1',
      operatorDecision: 'needs_decision',
      registryValue: 'What canonical question remains?',
      inboxValue: 'What incoming question should replace it?',
    });
  });

  it('marks direct strategy questions as legacy imports and warns when writing', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, '');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    try {
      const result = reduceResearchState(specFolder, { write: true });

      expect(result.registry.openQuestions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: 'What should be checked?',
            origin: 'legacy-import',
            source: 'key-questions',
            injectedAtIteration: 0,
          }),
        ]),
      );
      expect(result.dashboard).toContain('- [ ] What should be checked? [legacy-import]');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('legacy-import question(s)'),
      );
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('suppresses an exact rejected next-focus candidate from reducer output', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, `${JSON.stringify({
      type: 'event',
      event: 'ideaRejected',
      mode: 'research',
      run: 1,
      pattern: 'What should be checked?',
      category: 'next-focus',
      reason: 'operator rejected this focus',
      timestamp: '2026-06-28T00:00:00.000Z',
    })}\n`);

    const result = reduceResearchState(specFolder, { write: false });

    expect(result.registry.rejectedPatterns).toEqual([
      expect.objectContaining({
        pattern: 'What should be checked?',
        category: 'next-focus',
      }),
    ]);
    expect(result.registry.suppressedCandidates).toEqual([
      expect.objectContaining({
        candidateText: 'What should be checked?',
        matchType: 'exact',
        rejectedPattern: 'What should be checked?',
      }),
    ]);
    expect(result.strategy).toContain('## 11. NEXT FOCUS\n[All tracked questions are resolved]');
    expect(result.dashboard).toContain('## Rejected Pattern Cache');
    expect(result.dashboard).toContain('What should be checked? suppressed by What should be checked?');
  });

  it('re-admits a pattern after a rejected-pattern removal event', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, [
      JSON.stringify({
        type: 'event',
        event: 'ideaRejected',
        mode: 'research',
        run: 1,
        pattern: 'What should be checked?',
        category: 'next-focus',
        timestamp: '2026-06-28T00:00:00.000Z',
      }),
      JSON.stringify({
        type: 'event',
        event: 'ideaRejectedRemoved',
        mode: 'research',
        pattern: 'What should be checked?',
        category: 'next-focus',
        timestamp: '2026-06-28T00:01:00.000Z',
      }),
      '',
    ].join('\n'));

    const result = reduceResearchState(specFolder, { write: false });

    expect(result.registry.rejectedPatterns).toEqual([]);
    expect(result.registry.suppressedCandidates).toEqual([]);
    expect(result.strategy).toContain('## 11. NEXT FOCUS\nWhat should be checked?');
  });

  it('derives a bounded rejected-pattern index and honors reset events', () => {
    const rejectionEvents = Array.from({ length: 105 }, (_unused, index) => ({
      type: 'event',
      event: 'ideaRejected',
      mode: 'research',
      pattern: `Candidate pattern ${index}`,
      category: 'ideas',
      timestamp: `2026-06-28T00:${String(index).padStart(2, '0')}:00.000Z`,
    }));

    const bounded = deriveRejectedPatternIndex(rejectionEvents);

    expect(bounded.entries).toHaveLength(100);
    expect(bounded.entries[0].pattern).toBe('Candidate pattern 5');
    expect(bounded.warnings).toHaveLength(5);

    const reset = deriveRejectedPatternIndex([
      rejectionEvents[0],
      {
        type: 'event',
        event: 'ideaRejectedReset',
        mode: 'research',
        reason: 'operator reset',
      },
    ]);

    expect(reset.entries).toHaveLength(0);
  });

  it('uses fuzzy matching only for compatible rejected-pattern categories', () => {
    const rejectedIndex = deriveRejectedPatternIndex([
      {
        type: 'event',
        event: 'ideaRejected',
        mode: 'research',
        pattern: 'Investigate cache stampede mitigation plan',
        category: 'next-focus',
      },
    ]);

    const nextFocus = filterRejectedIdeaCandidates(
      [{ text: 'Investigate cache stampede mitigation plans', category: 'next-focus' }],
      rejectedIndex,
      { category: 'next-focus' },
    );
    const recovery = filterRejectedIdeaCandidates(
      [{ text: 'Investigate cache stampede mitigation plans', category: 'recovery' }],
      rejectedIndex,
      { category: 'recovery' },
    );

    expect(nextFocus.accepted).toHaveLength(0);
    expect(nextFocus.suppressed[0]).toMatchObject({
      candidateText: 'Investigate cache stampede mitigation plans',
      category: 'next-focus',
      matchType: 'fuzzy',
      rejectedPattern: 'Investigate cache stampede mitigation plan',
    });
    expect(recovery.accepted).toHaveLength(1);
    expect(recovery.suppressed).toHaveLength(0);
  });

  it('promotes observed ideas by threshold and suppresses rejected ideas', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, [
      JSON.stringify({
        type: 'iteration',
        run: 1,
        status: 'complete',
        focus: 'resolve seed question',
        findingsCount: 1,
        newInfoRatio: 0.4,
        answeredQuestions: ['What should be checked?'],
        timestamp: '2026-06-28T00:00:00.000Z',
      }),
      JSON.stringify({
        type: 'event',
        event: 'idea_observed',
        mode: 'research',
        run: 1,
        ideaId: 'idea-cache-stampede',
        idea: 'Investigate cache stampede mitigation',
        category: 'ideas',
        source: 'iteration-001.md',
        timestamp: '2026-06-28T00:01:00.000Z',
      }),
      JSON.stringify({
        type: 'event',
        event: 'idea_observed',
        mode: 'research',
        run: 2,
        ideaId: 'idea-cache-stampede',
        idea: 'Investigate cache stampede mitigation',
        category: 'ideas',
        source: 'iteration-002.md',
        timestamp: '2026-06-28T00:02:00.000Z',
      }),
      '',
    ].join('\n'));

    const promoted = reduceResearchState(specFolder, { write: true });
    const promotionEvents = readStateRecords(specFolder).filter((record) => record.event === 'idea_promoted');

    expect(promoted.registry.minIdeaObservations).toBe(2);
    expect(promoted.registry.observedIdeas).toEqual([
      expect.objectContaining({
        id: 'idea-cache-stampede',
        idea: 'Investigate cache stampede mitigation',
        observationCount: 2,
      }),
    ]);
    expect(promoted.registry.promotedIdeas).toEqual([
      expect.objectContaining({
        id: 'idea-cache-stampede',
        idea: 'Investigate cache stampede mitigation',
        observationCount: 2,
        rank: 1,
      }),
    ]);
    expect(promoted.strategy).toContain('## 11. NEXT FOCUS\nInvestigate cache stampede mitigation');
    expect(promoted.dashboard).toContain('## Ideas Backlog');
    expect(promoted.dashboard).toContain('- Promoted ideas: 1');
    expect(promotionEvents).toHaveLength(1);
    expect(promotionEvents[0]).toMatchObject({
      event: 'idea_promoted',
      ideaId: 'idea-cache-stampede',
      observationCount: 2,
      minIdeaObservations: 2,
    });

    reduceResearchState(specFolder, { write: true });
    expect(readStateRecords(specFolder).filter((record) => record.event === 'idea_promoted')).toHaveLength(1);

    appendFileSync(
      join(specFolder, 'research', 'deep-research-state.jsonl'),
      `${JSON.stringify({
        type: 'event',
        event: 'idea_rejected',
        mode: 'research',
        run: 3,
        ideaId: 'idea-cache-stampede',
        idea: 'Investigate cache stampede mitigation',
        category: 'ideas',
        reason: 'operator rejected this direction',
        timestamp: '2026-06-28T00:03:00.000Z',
      })}\n`,
      'utf8',
    );

    const rejected = reduceResearchState(specFolder, { write: false });

    expect(rejected.registry.promotedIdeas).toEqual([]);
    expect(rejected.registry.suppressedIdeas).toEqual([
      expect.objectContaining({
        id: 'idea-cache-stampede',
        idea: 'Investigate cache stampede mitigation',
        matchType: 'id',
        rejectedPattern: 'Investigate cache stampede mitigation',
      }),
    ]);
    expect(rejected.registry.rejectedPatterns).toEqual([
      expect.objectContaining({
        ideaId: 'idea-cache-stampede',
        pattern: 'Investigate cache stampede mitigation',
        category: 'ideas',
      }),
    ]);
    expect(rejected.strategy).toContain('## 11. NEXT FOCUS\n[All tracked questions are resolved]');
    expect(rejected.dashboard).toContain('- Suppressed ideas: 1');
  });
});
