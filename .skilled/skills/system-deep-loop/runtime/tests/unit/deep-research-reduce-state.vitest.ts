// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Reduce State Tests
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { createHermeticEnv, type HermeticEnv } from '../helpers/spawn-cjs';

const nodeRequire = createRequire(import.meta.url);
const {
  buildTerminalStopState,
  deriveRejectedPatternIndex,
  filterRejectedIdeaCandidates,
  emitFanoutResourceMap,
  parseIterationFile,
  reduceResearchState,
} = nodeRequire('../../../deep-research/scripts/reduce-state.cjs') as {
  buildTerminalStopState: (records: Array<Record<string, unknown>>) => {
    stopReason: string | null;
    totalIterations: number | null;
    answeredCount: number | null;
    totalQuestions: number | null;
    timestamp: string | null;
  } | null;
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
  emitFanoutResourceMap: (specFolder: string, options?: { write?: boolean; requireExistingState?: boolean }) => {
    resourceMap: string | null;
    resourceMapPath: string;
    resourceMapSkipped: boolean;
    resourceMapSkipReason: string | null;
    deltaSourceCount: number;
  };
  reduceResearchState: (specFolder: string, options?: {
    write?: boolean;
    lenient?: boolean;
    emitResourceMap?: boolean;
    requireExistingState?: boolean;
    artifactDir?: string;
  }) => {
    registry: {
      status?: string;
      metrics?: {
        iterationsCompleted: number;
        openQuestions: number;
        resolvedQuestions: number;
        coverageBySources: Record<string, number>;
      };
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
      keyFindings?: Array<{ id: string; text: string }>;
      strategyWarnings?: string[];
    };
    strategy: string;
    dashboard: string;
    resourceMap: string | null;
    hasCorruption: boolean;
  };
  parseIterationFile: (iterationPath: string) => {
    findings: string[];
    ruledOut: string[];
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

function strategyTemplateWithoutQuestions(): string {
  return strategyTemplate().replace('- [ ] What should be checked?', '[None yet]');
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
  it('aggregates same-named lineage deltas without changing merged registry bytes', () => {
    const specFolder = makeTempSpec();
    const researchDir = join(specFolder, 'research');
    const canonicalRegistry = join(researchDir, 'findings-registry.json');
    const compatibilityRegistry = join(researchDir, 'deep-research-findings-registry.json');
    writeFileSync(
      join(researchDir, 'deep-research-config.json'),
      `${JSON.stringify({ topic: 'Fan-out resource map', resource_map: { emit: true } }, null, 2)}\n`,
      'utf8',
    );
    const registryBytes = `${JSON.stringify({ keyFindings: [{ id: 'F1', title: 'Merged finding' }] }, null, 2)}\n`;
    writeFileSync(canonicalRegistry, registryBytes, 'utf8');
    writeFileSync(compatibilityRegistry, registryBytes, 'utf8');

    for (const [label, source] of [
      ['alpha', '.skilled/skills/sk-design/sk-design-interface/SKILL.md'],
      ['beta', '.skilled/skills/sk-design/design-motion/SKILL.md'],
    ]) {
      const deltaDir = join(researchDir, 'lineages', label, 'deltas');
      mkdirSync(deltaDir, { recursive: true });
      writeFileSync(
        join(deltaDir, 'iter-001.jsonl'),
        `${JSON.stringify({ type: 'iteration', iteration: 1, sourcesQueried: [source] })}\n`,
        'utf8',
      );
    }

    const result = emitFanoutResourceMap(specFolder, { write: true });

    expect(result.resourceMapSkipped).toBe(false);
    expect(result.deltaSourceCount).toBe(2);
    expect(result.resourceMap).toContain('- **Total references**: 2');
    expect(result.resourceMap).toContain('.skilled/skills/sk-design/sk-design-interface/SKILL.md');
    expect(result.resourceMap).toContain('.skilled/skills/sk-design/design-motion/SKILL.md');
    expect(result.resourceMap).toContain('| alpha | lineages/alpha/deltas/iter-001.jsonl |');
    expect(result.resourceMap).toContain('| beta | lineages/beta/deltas/iter-001.jsonl |');
    expect(readFileSync(canonicalRegistry, 'utf8')).toBe(registryBytes);
    expect(readFileSync(compatibilityRegistry, 'utf8')).toBe(registryBytes);
  });

  it('rejects symlinked lineage delta files before reading external evidence', () => {
    const specFolder = makeTempSpec();
    const researchDir = join(specFolder, 'research');
    writeFileSync(
      join(researchDir, 'deep-research-config.json'),
      `${JSON.stringify({ topic: 'Linked delta', resource_map: { emit: true } }, null, 2)}\n`,
      'utf8',
    );
    const deltaDir = join(researchDir, 'lineages', 'alpha', 'deltas');
    mkdirSync(deltaDir, { recursive: true });
    const externalDelta = join(specFolder, 'external-delta.jsonl');
    writeFileSync(externalDelta, `${JSON.stringify({ sourcesQueried: ['outside.md'] })}\n`, 'utf8');
    symlinkSync(externalDelta, join(deltaDir, 'iter-001.jsonl'));

    expect(() => emitFanoutResourceMap(specFolder, { write: true }))
      .toThrow('lineage alpha delta source must be a real file');
  });

  it('rejects a symlinked resource-map output without changing its target', () => {
    const specFolder = makeTempSpec();
    const researchDir = join(specFolder, 'research');
    writeFileSync(
      join(researchDir, 'deep-research-config.json'),
      `${JSON.stringify({ topic: 'Linked output', resource_map: { emit: true } }, null, 2)}\n`,
      'utf8',
    );
    const deltaDir = join(researchDir, 'deltas');
    mkdirSync(deltaDir, { recursive: true });
    writeFileSync(
      join(deltaDir, 'iter-001.jsonl'),
      `${JSON.stringify({ sourcesQueried: ['inside.md'] })}\n`,
      'utf8',
    );
    const outputTarget = join(specFolder, 'outside-resource-map.md');
    writeFileSync(outputTarget, 'outside-bytes\n', 'utf8');
    symlinkSync(outputTarget, join(researchDir, 'resource-map.md'));

    expect(() => emitFanoutResourceMap(specFolder, { write: true }))
      .toThrow('resource-map output must be a real file');
    expect(readFileSync(outputTarget, 'utf8')).toBe('outside-bytes\n');
  });

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

  it('refuses a corrupt delta in validate-existing-state mode', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, `${JSON.stringify({ type: 'iteration', run: 1, status: 'complete' })}\n`);
    writeDeltaRows(specFolder, 'iter-001.jsonl', [
      { type: 'iteration', iteration: 1, run: 1, status: 'complete' },
    ]);
    appendFileSync(join(specFolder, 'research', 'deltas', 'iter-001.jsonl'), 'not-json\n', 'utf8');

    try {
      reduceResearchState(specFolder, { write: false, requireExistingState: true });
      throw new Error('Expected recovery refusal');
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
      expect((error as { code?: string }).code).toBe('STATE_RECOVERY_REFUSED');
      expect((error as { reason?: string }).reason).toBe('corrupt delta');
      expect((error as { stateLogPath?: string }).stateLogPath)
        .toBe(realpathSync(join(specFolder, 'research', 'deltas', 'iter-001.jsonl')));
      expect((error as { corruptionWarnings?: unknown[] }).corruptionWarnings).toHaveLength(1);
    }
  });

  it('drops corrupt delta rows in lenient mode while preserving valid rows', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, `${JSON.stringify({ type: 'iteration', run: 1, status: 'complete' })}\n`);
    writeDeltaRows(specFolder, 'iter-001.jsonl', [
      { type: 'iteration', iteration: 1, run: 1, status: 'complete', focus: 'valid delta' },
    ]);
    appendFileSync(join(specFolder, 'research', 'deltas', 'iter-001.jsonl'), 'not-json\n', 'utf8');
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const result = reduceResearchState(specFolder, { write: false, lenient: true });

    expect(warning).toHaveBeenCalledWith(expect.stringContaining('skipped 1 malformed delta row'));
    expect(result.dashboard).toContain('valid delta');
    expect(result.registry.metrics?.iterationsCompleted).toBe(1);
    expect(result.dashboard).not.toContain('null');
  });

  it('refuses corrupt lineage deltas when required and drops them otherwise', () => {
    const specFolder = makeTempSpec();
    const researchDir = join(specFolder, 'research');
    writeFileSync(
      join(researchDir, 'deep-research-config.json'),
      `${JSON.stringify({ topic: 'Lineage delta', resource_map: { emit: true } }, null, 2)}\n`,
      'utf8',
    );
    const deltaPath = join(researchDir, 'lineages', 'alpha', 'deltas', 'iter-001.jsonl');
    mkdirSync(dirname(deltaPath), { recursive: true });
    writeFileSync(
      deltaPath,
      `${JSON.stringify({ type: 'iteration', iteration: 1, sourcesQueried: ['valid-source.md'] })}\nnot-json\n`,
      'utf8',
    );

    try {
      emitFanoutResourceMap(specFolder, { write: true, requireExistingState: true });
      throw new Error('Expected recovery refusal');
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
      expect((error as { code?: string }).code).toBe('STATE_RECOVERY_REFUSED');
      expect((error as { reason?: string }).reason).toBe('corrupt delta');
      expect((error as { stateLogPath?: string }).stateLogPath).toBe(realpathSync(deltaPath));
    }

    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const result = emitFanoutResourceMap(specFolder, { write: false });

    expect(warning).toHaveBeenCalledWith(expect.stringContaining('lineages/alpha/deltas/iter-001.jsonl'));
    expect(result.resourceMap).toContain('valid-source.md');
    expect(result.resourceMap).not.toContain('null');
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

  it('counts duplicated iteration rows once and selects the highest run as latest', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, [
      { type: 'iteration', run: 1, status: 'complete', focus: 'first attempt', newInfoRatio: 0.2 },
      { type: 'iteration', run: 2, status: 'complete', focus: 'highest run', newInfoRatio: 0.6 },
      { type: 'iteration', run: 1, status: 'complete', focus: 'redispatched attempt', newInfoRatio: 0.4 },
    ].map((record) => JSON.stringify(record)).join('\n') + '\n');

    const result = reduceResearchState(specFolder, { write: false });

    expect(result.registry.metrics.iterationsCompleted).toBe(2);
    expect(result.registry.metrics.convergenceScore).toBe(0.6);
    expect(result.dashboard).toContain('| 2 | highest run | - | 0.60 | 0 | complete |');
    expect(result.dashboard).not.toContain('first attempt');
    expect(result.dashboard).toContain('redispatched attempt');
  });

  it('shows a landed run as error when the still-fails row follows it', () => {
    // A landed iteration that fails verification with a reason that skips the redispatch
    // still gets the workflow's error row, and the later row replaces the landed one.
    const specFolder = makeTempSpec();
    writeState(specFolder, [
      { type: 'iteration', run: 1, status: 'complete', focus: 'first', newInfoRatio: 0.4, findingsCount: 1 },
      { type: 'iteration', run: 2, status: 'complete', focus: 'landed focus', newInfoRatio: 0.3, findingsCount: 2 },
      { type: 'iteration', run: 2, status: 'error', focus: 'landed focus', newInfoRatio: 0.0, findingsCount: 0 },
    ].map((record) => JSON.stringify(record)).join('\n') + '\n');

    const result = reduceResearchState(specFolder, { write: false });

    expect(result.registry.metrics.iterationsCompleted).toBe(2);
    expect(result.registry.metrics.convergenceScore).toBe(0);
    expect(result.dashboard).toContain('| 2 | landed focus | - | 0.00 | 0 | error |');
    expect(result.dashboard).toContain('Latest iteration reported error status.');
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

  it('writes question text holding replacement patterns verbatim into the strategy', () => {
    // String.replace reads `$\``, `$&` and `$'` in a string replacement as
    // match-relative text, so a question quoting one of them would splice a
    // copy of the surrounding file into the rewritten section.
    const specFolder = makeTempSpec();
    const questionText = "Does `PluginInput.$` survive, and do $& and $' stay literal?";
    writeState(specFolder, `${JSON.stringify({ type: 'iteration', run: 1, status: 'complete' })}\n`);
    writeInbox(specFolder, [
      {
        id: 'inbox-dollar-1',
        text: questionText,
        source: 'analyst.followup',
        origin: 'analyst-strategy',
        injectedAtIteration: 1,
        promotedQuestionId: 'question-dollar-1',
      },
    ]);

    const result = reduceResearchState(specFolder, { write: false });

    expect(result.strategy).toContain(`- [ ] ${questionText}`);
    expect(result.strategy.match(/## 11\. NEXT FOCUS/g)?.length).toBe(1);
    expect(result.strategy.match(/<!-- ANCHOR:next-focus -->/g)?.length).toBe(1);
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

  // In a ledger-backed run the state log is a projection the gateway rebuilds,
  // so a row the reducer appended beside it vanished at the next append. The
  // reducer's bookkeeping rows now travel through the gateway as events.
  it('keeps the reducer conflict row in a ledger-backed run across the next gateway append', () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const repoRoot = resolve(here, '..', '..', '..', '..', '..', '..');
    const gatewayScript = resolve(here, '..', '..', 'scripts', 'append-mode-event.cjs');
    const specFolder = makeTempSpec();
    const researchDir = join(specFolder, 'research');
    const runId = 'reducer-ledger-run';
    const appendEvent = (name: string, event: Record<string, unknown>) => {
      const eventPath = join(specFolder, `${name}.json`);
      writeFileSync(eventPath, JSON.stringify(event));
      const result = spawnSync(process.execPath, [
        gatewayScript, '--mode', 'research', '--run-directory', researchDir, '--event-json', eventPath,
      ], { cwd: repoRoot, encoding: 'utf8' });
      expect(result.status, result.stdout + result.stderr).toBe(0);
    };
    const iteration = (run: number) => ({
      type: 'iteration', run, iteration: run, status: 'complete', focus: 'registry conflict',
      newInfoRatio: 0.3, ruledOut: [], sessionId: runId, lineageId: runId, timestamp: `2026-10-19T10:0${run}:00Z`,
    });

    appendEvent('open', {
      stem: 'deep_research.run_initialized',
      scope: { runId, lineageId: runId },
      data: {
        generation: 1,
        charterDigest: '1'.repeat(64),
        configDigest: '2'.repeat(64),
        executorFingerprint: '3'.repeat(64),
        replayFingerprint: '4'.repeat(64),
        maxIterations: 3,
        convergencePolicyVersion: 'convergence-policy@default',
      },
    });
    appendEvent('iteration-1', iteration(1));
    writePriorRegistry(specFolder, {
      keyQuestions: [{
        id: 'question-canonical-1',
        text: 'What canonical question remains?',
        origin: 'operator',
        source: 'registry',
        injectedAtIteration: 1,
        resolved: false,
      }],
    });
    writeInbox(specFolder, [{
      id: 'inbox-conflict-1',
      text: 'What incoming question should replace it?',
      source: 'operator.note',
      origin: 'operator',
      injectedAtIteration: 2,
      promotedQuestionId: 'question-canonical-1',
    }]);

    const result = reduceResearchState(specFolder, { write: true });
    const conflictId = result.registry.questionConflicts?.[0]?.conflictId;
    expect(conflictId).toBeTruthy();
    appendEvent('iteration-2', iteration(2));

    const conflictRows = readStateRecords(specFolder).filter((record) => record.event === 'question_conflict');
    expect(conflictRows).toHaveLength(1);
    expect(conflictRows[0]).toMatchObject({
      type: 'event',
      mode: 'research',
      conflictId,
      questionId: 'question-canonical-1',
      inboxId: 'inbox-conflict-1',
      operatorDecision: 'needs_decision',
      registryValue: 'What canonical question remains?',
      inboxValue: 'What incoming question should replace it?',
    });
    expect(readdirSync(join(researchDir, 'deep-research-ledger', 'frames'))
      .filter((name) => name.endsWith('.frame'))).toHaveLength(4);

    // A second reduce sees the projected row and records no second conflict.
    reduceResearchState(specFolder, { write: true });
    expect(readStateRecords(specFolder).filter((record) => record.event === 'question_conflict')).toHaveLength(1);
  });

  it('keeps leaf idea observations and the promotion they earn in a ledger-backed run', () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const repoRoot = resolve(here, '..', '..', '..', '..', '..', '..');
    const gatewayScript = resolve(here, '..', '..', 'scripts', 'append-mode-event.cjs');
    const specFolder = makeTempSpec();
    const researchDir = join(specFolder, 'research');
    const runId = 'idea-ledger-run';
    const appendEvent = (name: string, event: Record<string, unknown>) => {
      const eventPath = join(specFolder, `${name}.json`);
      writeFileSync(eventPath, JSON.stringify(event));
      const result = spawnSync(process.execPath, [
        gatewayScript, '--mode', 'research', '--run-directory', researchDir, '--event-json', eventPath,
      ], { cwd: repoRoot, encoding: 'utf8' });
      expect(result.status, result.stdout + result.stderr).toBe(0);
    };
    const iteration = (run: number) => ({
      type: 'iteration', run, iteration: run, status: 'complete', focus: 'idea backlog',
      newInfoRatio: 0.3, ruledOut: [], sessionId: runId, lineageId: runId, timestamp: `2026-10-19T11:0${run}:00Z`,
    });
    // The row the research agent records through the gateway, in its documented shape.
    const observation = (run: number) => ({
      type: 'event',
      event: 'idea_observed',
      mode: 'research',
      run,
      ideaId: 'idea-cache-stampede',
      idea: 'Investigate cache stampede mitigation',
      category: 'ideas',
      source: `iteration-00${run}.md`,
      timestamp: `2026-10-19T11:0${run}:30Z`,
    });
    const rowsNamed = (event: string) => readStateRecords(specFolder).filter((record) => record.event === event);

    appendEvent('open', {
      stem: 'deep_research.run_initialized',
      scope: { runId, lineageId: runId },
      data: {
        generation: 1,
        charterDigest: '1'.repeat(64),
        configDigest: '2'.repeat(64),
        executorFingerprint: '3'.repeat(64),
        replayFingerprint: '4'.repeat(64),
        maxIterations: 5,
        convergencePolicyVersion: 'convergence-policy@default',
      },
    });
    appendEvent('iteration-1', iteration(1));
    appendEvent('idea-1', observation(1));
    appendEvent('iteration-2', iteration(2));
    appendEvent('idea-2', observation(2));
    appendEvent('iteration-3', iteration(3));

    // Both observations outlive the appends after them, field for field.
    expect(rowsNamed('idea_observed')).toEqual([observation(1), observation(2)]);

    const result = reduceResearchState(specFolder, { write: true });
    expect(result.registry.promotedIdeas).toEqual([
      expect.objectContaining({ id: 'idea-cache-stampede', observationCount: 2, rank: 1 }),
    ]);
    appendEvent('iteration-4', iteration(4));

    const promotions = rowsNamed('idea_promoted');
    expect(promotions).toHaveLength(1);
    expect(promotions[0]).toMatchObject({
      type: 'event',
      mode: 'research',
      ideaId: 'idea-cache-stampede',
      idea: 'Investigate cache stampede mitigation',
      observationCount: 2,
      minIdeaObservations: 2,
      firstObservedRun: 1,
      lastObservedRun: 2,
    });
    expect(rowsNamed('idea_observed')).toHaveLength(2);
    expect(readdirSync(join(researchDir, 'deep-research-ledger', 'frames'))
      .filter((name) => name.endsWith('.frame'))).toHaveLength(8);

    // A second reduce sees the projected promotion and records no second one.
    reduceResearchState(specFolder, { write: true });
    expect(rowsNamed('idea_promoted')).toHaveLength(1);
  });

  // The pause, recovery and convergence-floor rows the workflows record, and an
  // operator's pivot override, were pinned to the legacy path, so a ledger-backed
  // run lost them at the next projection replace. Every projected row also took
  // the append time in place of its own timestamp.
  it('keeps the workflow lifecycle rows and each row\'s own timestamp in a ledger-backed run', () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const repoRoot = resolve(here, '..', '..', '..', '..', '..', '..');
    const gatewayScript = resolve(here, '..', '..', 'scripts', 'append-mode-event.cjs');
    const specFolder = makeTempSpec();
    const researchDir = join(specFolder, 'research');
    const runId = 'lifecycle-ledger-run';
    const appendEvent = (name: string, event: Record<string, unknown>) => {
      const eventPath = join(specFolder, `${name}.json`);
      writeFileSync(eventPath, JSON.stringify(event));
      const result = spawnSync(process.execPath, [
        gatewayScript, '--mode', 'research', '--run-directory', researchDir, '--event-json', eventPath,
      ], { cwd: repoRoot, encoding: 'utf8' });
      expect(result.status, result.stdout + result.stderr).toBe(0);
    };
    const iteration = (run: number) => ({
      type: 'iteration', run, iteration: run, status: 'complete', focus: 'lifecycle rows',
      newInfoRatio: 0.3, ruledOut: [], sessionId: runId, lineageId: runId, timestamp: `2026-10-19T12:0${run}:00Z`,
    });
    const lifecycleRows = [
      {
        type: 'event', event: 'min_iterations_guard_pass', mode: 'research', run: 1, iterationCount: 1,
        minIterations: 1, timestamp: '2026-10-19T12:01:10Z', sessionId: runId, generation: 1,
      },
      {
        type: 'event', event: 'stuckRecovery', mode: 'research', run: 1, stopReason: 'stuckRecovery',
        fromIteration: 1, outcome: 'recovered', timestamp: '2026-10-19T12:01:20Z', sessionId: runId, generation: 1,
      },
      {
        type: 'event', event: 'pivot_override_accepted', mode: 'research', run: 1, pivotId: 'pivot-001-a1b2',
        selectedCandidate: { id: 'candidate-2', focus: 'Transport alternatives' },
        selectedFrontier: [{ id: 'candidate-2', focus: 'Transport alternatives' }],
        previousFocus: 'lifecycle rows', saturatedDirections: ['lifecycle rows'],
        reason: 'Operator prefers the transport direction', agreementReason: 'insufficient_endorsement',
        timestamp: '2026-10-19T12:01:30Z', sessionId: runId, generation: 1,
      },
      {
        type: 'event', event: 'userPaused', mode: 'research', run: 1, stopReason: 'userPaused',
        sentinelPath: 'research/.deep-research-pause', timestamp: '2026-10-19T12:01:40Z', sessionId: runId, generation: 1,
      },
    ];

    appendEvent('open', {
      type: 'config', sessionId: runId, lineageId: runId, generation: 1, maxIterations: 4,
      topic: 'Lifecycle rows', timestamp: '2026-10-19T12:00:00Z',
    });
    appendEvent('iteration-1', iteration(1));
    lifecycleRows.forEach((row, index) => appendEvent(`lifecycle-${index}`, row));
    appendEvent('iteration-2', iteration(2));

    const records = readStateRecords(specFolder);
    for (const row of lifecycleRows) {
      expect(records.filter((record) => record.event === row.event)).toEqual([row]);
    }
    expect(records.find((record) => record.type === 'config')?.timestamp).toBe('2026-10-19T12:00:00Z');
    expect(records.filter((record) => record.type === 'iteration').map((record) => record.timestamp))
      .toEqual(['2026-10-19T12:01:00Z', '2026-10-19T12:02:00Z']);
    expect(readdirSync(join(researchDir, 'deep-research-ledger', 'frames'))
      .filter((name) => name.endsWith('.frame'))).toHaveLength(7);
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

  it('captures H3 finding headings alongside bullet findings, and excludes Ruled-Out Direction headings', () => {
    const specFolder = makeTempSpec();
    mkdirSync(join(specFolder, 'research', 'iterations'), { recursive: true });
    const iterationPath = join(specFolder, 'research', 'iterations', 'iteration-001.md');
    writeFileSync(
      iterationPath,
      [
        '# Iteration 001: H3 finding headings',
        '',
        '## Findings',
        '',
        '### F-ITER001-001 - Example structural finding (P1)',
        '',
        'Body text for the first finding.',
        '',
        '### P1: Example severity-prefixed finding',
        '',
        'Body text for the second finding.',
        '',
        '- A plain bullet finding still extracts',
        '',
        '### Ruled-Out Direction',
        '',
        'This heading must not be captured as a finding.',
        '',
        '## Ruled Out',
        '',
        '- Some ruled-out approach',
        '',
      ].join('\n'),
      'utf8',
    );

    const parsed = parseIterationFile(iterationPath);

    expect(parsed.findings).toEqual(
      expect.arrayContaining([
        'F-ITER001-001 - Example structural finding (P1)',
        'P1: Example severity-prefixed finding',
        'A plain bullet finding still extracts',
      ]),
    );
    expect(parsed.findings).not.toContain('Ruled-Out Direction');
    expect(parsed.ruledOut).toEqual(['Some ruled-out approach']);
  });

  it('writes registry outputs into an explicit artifact directory instead of the spec research folder', () => {
    const specFolder = makeTempSpec();
    const lineageDir = join(specFolder, 'research', 'lineages', 'alpha');
    mkdirSync(lineageDir, { recursive: true });
    writeFileSync(
      join(lineageDir, 'deep-research-config.json'),
      `${JSON.stringify({
        topic: 'Reducer recovery test',
        createdAt: '2026-06-19T00:00:00.000Z',
        status: 'initialized',
        maxIterations: 3,
        resource_map: { emit: false },
      }, null, 2)}\n`,
      'utf8',
    );
    writeFileSync(join(lineageDir, 'deep-research-strategy.md'), strategyTemplate(), 'utf8');
    writeFileSync(
      join(lineageDir, 'deep-research-state.jsonl'),
      `${JSON.stringify({
        type: 'iteration',
        run: 1,
        status: 'complete',
        focus: 'lineage artifact directory',
        findingsCount: 1,
        newInfoRatio: 0.4,
      })}\n`,
      'utf8',
    );

    const result = reduceResearchState(specFolder, { write: true, artifactDir: lineageDir });

    expect(result.registryPath.startsWith(lineageDir)).toBe(true);
    expect(existsSync(join(specFolder, 'research', 'findings-registry.json'))).toBe(false);
  });

  it('seeds the topic question into a lineage strategy that initialized without key questions', () => {
    const specFolder = makeTempSpec();
    const lineageDir = join(specFolder, 'research', 'lineages', 'gamma');
    mkdirSync(lineageDir, { recursive: true });
    writeFileSync(
      join(lineageDir, 'deep-research-config.json'),
      `${JSON.stringify({
        topic: 'Which seeded question should the registry carry?',
        createdAt: '2026-06-19T00:00:00.000Z',
        status: 'initialized',
        maxIterations: 3,
        resource_map: { emit: false },
      }, null, 2)}\n`,
      'utf8',
    );
    writeFileSync(join(lineageDir, 'deep-research-strategy.md'), strategyTemplateWithoutQuestions(), 'utf8');
    writeFileSync(
      join(lineageDir, 'deep-research-state.jsonl'),
      `${JSON.stringify({
        type: 'iteration',
        run: 1,
        status: 'complete',
        focus: 'seed the key question block',
        findingsCount: 1,
        newInfoRatio: 0.4,
      })}\n`,
      'utf8',
    );

    const result = reduceResearchState(specFolder, { write: true, artifactDir: lineageDir });

    expect(result.registry.openQuestions).toEqual([
      expect.objectContaining({
        text: 'Which seeded question should the registry carry?',
        origin: 'analyst-strategy',
        source: 'topic',
      }),
    ]);
    expect(result.strategy).toContain('- [ ] Which seeded question should the registry carry?');
    expect(readFileSync(join(lineageDir, 'deep-research-strategy.md'), 'utf8'))
      .toContain('- [ ] Which seeded question should the registry carry?');
  });

  it('reads key questions from a lineage strategy that omits the canonical heading ordinal', () => {
    const specFolder = makeTempSpec();
    const lineageDir = join(specFolder, 'research', 'lineages', 'delta');
    mkdirSync(lineageDir, { recursive: true });
    writeFileSync(
      join(lineageDir, 'deep-research-config.json'),
      `${JSON.stringify({
        topic: 'Leaf authored strategy',
        createdAt: '2026-06-19T00:00:00.000Z',
        status: 'initialized',
        maxIterations: 3,
        resource_map: { emit: false },
      }, null, 2)}\n`,
      'utf8',
    );
    writeFileSync(
      join(lineageDir, 'deep-research-strategy.md'),
      [
        '# Deep Research Strategy - delta',
        '',
        '## Research Topic',
        'Leaf authored strategy.',
        '',
        '## Key Questions (remaining)',
        '- [ ] Which leaf question stays open?',
        '- [x] Which leaf question is answered?',
        '',
        '## Next Focus',
        'Leaf focus',
        '',
      ].join('\n'),
      'utf8',
    );
    writeFileSync(
      join(lineageDir, 'deep-research-state.jsonl'),
      `${JSON.stringify({ type: 'iteration', run: 1, status: 'complete' })}\n`,
      'utf8',
    );

    const result = reduceResearchState(specFolder, { write: false, artifactDir: lineageDir });

    expect(result.registry.openQuestions).toEqual([
      expect.objectContaining({ text: 'Which leaf question stays open?' }),
    ]);
    expect(result.registry.resolvedQuestions).toEqual([
      expect.objectContaining({ text: 'Which leaf question is answered?' }),
    ]);
  });
});

describe('deep-research reduce-state strategy fallback', () => {
  it('keeps an anchor-less strategy file unchanged while still writing registry findings', () => {
    const specFolder = makeTempSpec();
    const researchDir = join(specFolder, 'research');
    const iterationDir = join(researchDir, 'iterations');
    mkdirSync(iterationDir, { recursive: true });
    writeFileSync(
      join(iterationDir, 'iteration-001.md'),
      [
        '# Iteration 001: list dialects',
        '',
        '## Findings',
        '',
        '1. Numbered finding survives the fallback',
        '2. Second numbered finding survives the fallback',
        '',
        '- Bulleted finding survives the fallback',
        '',
        '### F-1 - Structural finding survives the fallback',
        '',
        'Body text for the structural finding.',
        '',
      ].join('\n'),
      'utf8',
    );
    // Deliberately no trailing newline: a rewrite normalizes one in, so byte identity
    // proves the reducer left the leaf-authored bytes untouched.
    const leafStrategy = [
      '# Deep Research Strategy',
      '',
      '## 3. KEY QUESTIONS (remaining)',
      '',
      '- [ ] What should be checked?',
      '',
      '## 11. NEXT FOCUS',
      '',
      'list dialect coverage',
    ].join('\n');
    const strategyPath = join(researchDir, 'deep-research-strategy.md');
    writeFileSync(strategyPath, leafStrategy, 'utf8');
    writeState(specFolder, `${JSON.stringify({ type: 'iteration', run: 1, status: 'complete' })}\n`);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    try {
      const result = reduceResearchState(specFolder, { write: true });

      expect(result.registry.keyFindings?.length ?? 0).toBeGreaterThan(0);
      expect(result.registry.strategyWarnings).toEqual([
        expect.stringContaining('key-questions'),
      ]);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('key-questions'));
      expect(readFileSync(strategyPath, 'utf8')).toBe(leafStrategy);

      const persistedRegistry = JSON.parse(
        readFileSync(join(researchDir, 'findings-registry.json'), 'utf8'),
      ) as { keyFindings?: unknown[]; strategyWarnings?: unknown[] };
      expect(persistedRegistry.keyFindings?.length ?? 0).toBeGreaterThan(0);
      expect(persistedRegistry.strategyWarnings).toHaveLength(1);
      expect(readFileSync(join(researchDir, 'deep-research-dashboard.md'), 'utf8').length).toBeGreaterThan(0);
    } finally {
      warnSpy.mockRestore();
    }
  });
});

function writeStrategyWithQuestions(specFolder: string, questionLines: string[]): void {
  writeFileSync(
    join(specFolder, 'research', 'deep-research-strategy.md'),
    [
      '# Deep Research Strategy',
      '',
      '<!-- ANCHOR:key-questions -->',
      '## 3. KEY QUESTIONS (remaining)',
      ...questionLines,
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
    ].join('\n'),
    'utf8',
  );
}

function writeDeltaRows(specFolder: string, fileName: string, rows: Array<Record<string, unknown>>): void {
  const deltaDir = join(specFolder, 'research', 'deltas');
  mkdirSync(deltaDir, { recursive: true });
  writeFileSync(
    join(deltaDir, fileName),
    `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`,
    'utf8',
  );
}

describe('deep-research reduce-state delta iteration merge', () => {
  it('ticks only the strategy box named by the delta answeredQuestions', () => {
    const specFolder = makeTempSpec();
    writeStrategyWithQuestions(specFolder, [
      '- [ ] Which delta merge path resolves?',
      '- [ ] Which delta merge path stays open?',
    ]);
    writeState(specFolder, `${JSON.stringify({
      type: 'iteration',
      iteration: 1,
      run: 1,
      status: 'complete',
      newInfoRatio: 0.5,
      ruledOut: [],
      timestamp: '2026-06-28T00:00:00.000Z',
    })}\n`);
    writeDeltaRows(specFolder, 'iter-001.jsonl', [
      {
        type: 'iteration',
        iteration: 1,
        run: 1,
        status: 'complete',
        newInfoRatio: 0.5,
        focus: 'delta merge',
        answeredQuestions: ['Which delta merge path resolves?'],
      },
    ]);

    const result = reduceResearchState(specFolder, { write: false });

    expect(result.strategy).toContain('- [x] Which delta merge path resolves?');
    expect(result.strategy).toContain('- [ ] Which delta merge path stays open?');
    expect(result.registry.metrics?.resolvedQuestions).toBe(1);
    expect(result.registry.metrics?.openQuestions).toBe(1);
  });

  it('drops a resolved question that a later iteration lists as remaining', () => {
    const specFolder = writeResolvedQuestionLeafFixture([
      '# Iteration 002: follow up',
      '',
      '## Questions Remaining',
      '',
      '- Which delta merge path resolves?',
      '',
    ]);

    const result = reduceResearchState(specFolder, { write: false });

    expect((result.registry.carriedForwardOpenQuestions ?? []).map((question) => question.text))
      .not.toContain('Which delta merge path resolves?');
    expect(result.registry.metrics?.carriedForwardOpenQuestions).toBe(0);
    expect(sectionText(result.strategy, '## 11A. CARRIED-FORWARD OPEN QUESTIONS', '## 11. NEXT FOCUS'))
      .not.toContain('Which delta merge path resolves?');
    expect(sectionText(result.strategy, '## 11. NEXT FOCUS', '<!--'))
      .not.toContain('Which delta merge path resolves?');
  });

  it('drops a status sentence listed under Questions Remaining', () => {
    const specFolder = writeResolvedQuestionLeafFixture([
      '# Iteration 002: follow up',
      '',
      '## Questions Remaining',
      '',
      '- Iteration 1 mapped the reducer chain.',
      '',
    ]);

    const result = reduceResearchState(specFolder, { write: false });

    expect((result.registry.carriedForwardOpenQuestions ?? []).map((question) => question.text))
      .not.toContain('Iteration 1 mapped the reducer chain.');
    expect(result.registry.metrics?.carriedForwardOpenQuestions).toBe(0);
    expect(sectionText(result.strategy, '## 11A. CARRIED-FORWARD OPEN QUESTIONS', '## 11. NEXT FOCUS'))
      .not.toContain('Iteration 1 mapped the reducer chain.');
    expect(sectionText(result.strategy, '## 11. NEXT FOCUS', '<!--'))
      .not.toContain('Iteration 1 mapped the reducer chain.');
  });

  it('reads the latest leaf Recommended Next Focus and skips it when it is resolved', () => {
    const recommended = reduceResearchState(writeResolvedQuestionLeafFixture([
      '# Iteration 002: follow up',
      '',
      '## Recommended Next Focus',
      '',
      'Trace the merge writer',
      '',
    ]), { write: false });

    expect(sectionText(recommended.strategy, '## 11. NEXT FOCUS', '<!--'))
      .toContain('Trace the merge writer');

    const resolved = reduceResearchState(writeResolvedQuestionLeafFixture([
      '# Iteration 002: follow up',
      '',
      '## Recommended Next Focus',
      '',
      'Which delta merge path resolves?',
      '',
    ]), { write: false });

    expect(sectionText(resolved.strategy, '## 11. NEXT FOCUS', '<!--'))
      .not.toContain('Which delta merge path resolves?');
  });

  it('does not let a rejected pattern return through the leaf recommendation', () => {
    const specFolder = writeResolvedQuestionLeafFixture([
      '# Iteration 002: follow up',
      '',
      '## Recommended Next Focus',
      '',
      'Trace the merge writer',
      '',
    ]);
    appendFileSync(
      join(specFolder, 'research', 'deep-research-state.jsonl'),
      `${JSON.stringify({
        type: 'event',
        event: 'ideaRejected',
        mode: 'research',
        run: 1,
        pattern: 'Trace the merge writer',
        category: 'next-focus',
        reason: 'operator rejected this focus',
        timestamp: '2026-06-28T00:00:00.000Z',
      })}\n`,
      'utf8',
    );

    const result = reduceResearchState(specFolder, { write: false });

    expect(sectionText(result.strategy, '## 11. NEXT FOCUS', '<!--'))
      .not.toContain('Trace the merge writer');
  });

  it('keeps state-log status and newInfoRatio when the delta iteration row disagrees', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, `${JSON.stringify({
      type: 'iteration',
      run: 1,
      status: 'complete',
      newInfoRatio: 0.4,
    })}\n`);
    writeDeltaRows(specFolder, 'iter-001.jsonl', [
      {
        type: 'iteration',
        iteration: 1,
        run: 1,
        status: 'error',
        newInfoRatio: 0.9,
        focus: 'delta focus',
      },
    ]);

    const result = reduceResearchState(specFolder, { write: false });

    expect(result.dashboard).toContain('| 1 | delta focus | - | 0.40 | 0 | complete |');
    expect(result.dashboard).not.toContain('0.90');
    expect(result.dashboard).not.toContain('Latest iteration reported error status.');
  });

  it('emits a resource map from delta finding sources', () => {
    const specFolder = makeTempSpec();
    writeFileSync(
      join(specFolder, 'research', 'deep-research-config.json'),
      `${JSON.stringify({ topic: 'Delta sources', resource_map: { emit: true } }, null, 2)}\n`,
      'utf8',
    );
    writeState(specFolder, `${JSON.stringify({
      type: 'iteration',
      run: 1,
      status: 'complete',
      newInfoRatio: 0.5,
    })}\n`);
    writeDeltaRows(specFolder, 'iter-001.jsonl', [
      {
        type: 'iteration',
        iteration: 1,
        run: 1,
        status: 'complete',
        newInfoRatio: 0.5,
        answeredQuestions: [],
      },
      {
        type: 'finding',
        id: 'f-iter001-001',
        severity: 'P1',
        label: 'Delta source finding',
        iteration: 1,
        sources: ['src/a.ts'],
      },
    ]);

    const result = reduceResearchState(specFolder, { write: false, emitResourceMap: true });
    const resourceMap = result.resourceMap ?? '';

    expect(result.resourceMap).not.toBeNull();
    expect(resourceMap).toContain('src/a.ts');
    const totalReferences = Number(/Total references\*\*: (\d+)/.exec(resourceMap)?.[1] ?? '0');
    expect(totalReferences).toBeGreaterThan(0);
  });

  // Iteration 1 answers the first strategy question through its delta row, so the
  // registry keeps exactly one machine question open and the next-focus chain has a
  // fallback. The leaf markdown is the only input each case varies.
  function writeResolvedQuestionLeafFixture(leafLines: string[]): string {
    const specFolder = makeTempSpec();
    writeStrategyWithQuestions(specFolder, [
      '- [ ] Which delta merge path resolves?',
      '- [ ] Which delta merge path stays open?',
    ]);
    const iterationDir = join(specFolder, 'research', 'iterations');
    mkdirSync(iterationDir, { recursive: true });
    writeFileSync(join(iterationDir, 'iteration-002.md'), leafLines.join('\n'), 'utf8');
    writeState(specFolder, [
      JSON.stringify({
        type: 'iteration',
        iteration: 1,
        run: 1,
        status: 'complete',
        newInfoRatio: 0.5,
        ruledOut: [],
        timestamp: '2026-06-28T00:00:00.000Z',
      }),
      JSON.stringify({
        type: 'iteration',
        iteration: 2,
        run: 2,
        status: 'complete',
        newInfoRatio: 0.4,
        focus: 'follow up',
        timestamp: '2026-06-28T00:05:00.000Z',
      }),
      '',
    ].join('\n'));
    writeDeltaRows(specFolder, 'iter-001.jsonl', [
      {
        type: 'iteration',
        iteration: 1,
        run: 1,
        status: 'complete',
        newInfoRatio: 0.5,
        focus: 'delta merge',
        answeredQuestions: ['Which delta merge path resolves?'],
      },
    ]);
    writeDeltaRows(specFolder, 'iter-002.jsonl', [
      {
        type: 'iteration',
        iteration: 2,
        run: 2,
        status: 'complete',
        newInfoRatio: 0.4,
        focus: 'follow up',
        timestamp: '2026-06-28T00:05:00.000Z',
      },
    ]);
    return specFolder;
  }

  // Slicing to one block keeps an assertion honest: the same text sitting in a
  // neighbouring section must not satisfy it, and a missing block fails loudly
  // instead of shrinking the haystack to nothing.
  function sectionText(strategy: string, heading: string, boundary: string): string {
    const start = strategy.indexOf(heading);
    const end = start === -1 ? -1 : strategy.indexOf(boundary, start + heading.length);
    if (end === -1) {
      throw new Error(`Missing strategy block "${heading}" bounded by "${boundary}"`);
    }
    return strategy.slice(start + heading.length, end);
  }
});

describe('deep-research reduce-state state-log iteration rows', () => {
  it('resolves the single key question an iteration row names', () => {
    const specFolder = makeTempSpec();
    writeStrategyWithQuestions(specFolder, [
      '- [ ] Which file owns the stop?',
      '- [ ] Which file writes the ledger?',
    ]);
    writeState(specFolder, `${JSON.stringify({
      type: 'iteration',
      iteration: 1,
      run: 1,
      status: 'complete',
      newInfoRatio: 0.5,
      ruledOut: [],
      keyQuestions: ['Which file owns the stop?'],
      answeredQuestions: ['Which file owns the stop?'],
      timestamp: '2026-06-28T00:00:00.000Z',
    })}\n`);

    const result = reduceResearchState(specFolder, { write: false });

    expect(result.strategy).toContain('- [x] Which file owns the stop?');
    expect(result.registry.metrics?.resolvedQuestions).toBe(1);
  });

  it('counts sourcesQueried from the iteration row among the run sources', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, `${JSON.stringify({
      type: 'iteration',
      iteration: 1,
      run: 1,
      status: 'complete',
      newInfoRatio: 0.5,
      ruledOut: [],
      sourcesQueried: ['src/stop.ts:12'],
      timestamp: '2026-06-28T00:00:00.000Z',
    })}\n`);

    const result = reduceResearchState(specFolder, { write: false });

    // The reducer reports a row's sourcesQueried as a category histogram, so the
    // row is what puts a colon-bearing path in the code bucket.
    expect(result.registry.metrics?.coverageBySources).toEqual({ code: 1 });
    expect(result.dashboard).toContain('- coverageBySources: {"code":1}');
  });

  it('shows the row focusTrack and findingsCount in the dashboard', () => {
    const specFolder = makeTempSpec();
    writeState(specFolder, `${JSON.stringify({
      type: 'iteration',
      iteration: 1,
      run: 1,
      status: 'complete',
      focus: 'stop path',
      newInfoRatio: 0.5,
      ruledOut: [],
      focusTrack: 'stop-path',
      findingsCount: 4,
      timestamp: '2026-06-28T00:00:00.000Z',
    })}\n`);

    const result = reduceResearchState(specFolder, { write: false });

    expect(result.dashboard).toContain('| 1 | stop path | stop-path | 0.50 | 4 | complete |');
  });
});

describe('an extension reopens a completed run', () => {
  it('reports no terminal stop when an extended row follows synthesis_complete', () => {
    const records = [
      { type: 'iteration', run: 1, status: 'complete' },
      { type: 'iteration', run: 2, status: 'complete' },
      { type: 'event', event: 'synthesis_complete', stopReason: 'converged', totalIterations: 2, timestamp: '2026-11-17T00:00:00Z' },
      { type: 'event', event: 'extended', sessionId: 's-1', generation: 1, lineageMode: 'completed-continue', continuedFromRun: 2, timestamp: '2026-11-17T01:00:00Z' },
    ];
    // Without the extended row the same log is terminal, which proves the row is what reopens it.
    expect(buildTerminalStopState(records.slice(0, 3))).not.toBeNull();
    expect(buildTerminalStopState(records)).toBeNull();
  });
});

describe('deep-research reduce-state expansive frontier', () => {
  type FrontierNode = {
    nodeId: string;
    parentId?: string | null;
    depth: number;
    scope?: string | string[] | null;
    question?: string | null;
    status: string;
    reason?: string | null;
    iteration?: number | null;
  };
  type FrontierProjection = {
    nodes: FrontierNode[];
    stats: Record<string, number>;
    budget?: Record<string, { allotted: number; spent: number }>;
    warnings?: Array<{ file: string; line: number; raw: string; error: string }>;
  };
  type FrontierKeyQuestion = {
    text: string;
    inboxId?: string | null;
    origin?: string;
    frontierStatus?: string;
  };

  // The registry shape is declared narrow above, so the frontier projection is
  // read through a local cast instead of widening the shared declaration.
  function frontierOf(registry: unknown): FrontierProjection {
    return (registry as { frontier?: FrontierProjection }).frontier as FrontierProjection;
  }

  function keyQuestionsOf(registry: unknown): FrontierKeyQuestion[] {
    return (registry as { keyQuestions?: FrontierKeyQuestion[] }).keyQuestions ?? [];
  }

  function expansiveSpec(depthMode = 'expansive'): string {
    const specFolder = makeTempSpec();
    writeFileSync(
      join(specFolder, 'research', 'deep-research-config.json'),
      `${JSON.stringify({
        topic: 'Frontier reducer test',
        createdAt: '2026-06-19T00:00:00.000Z',
        status: 'running',
        maxIterations: 10,
        resource_map: { emit: false },
        antiConvergence: { convergenceMode: 'default', depthMode },
        expansiveDepth: {
          maxDepth: 3,
          maxChildrenPerNode: 6,
          budgetSplit: { depth1: 0.5, depth2: 0.35, depth3: 0.15 },
        },
      }, null, 2)}\n`,
      'utf8',
    );
    writeStrategyWithQuestions(specFolder, ['- [ ] What should be checked?']);
    writeInbox(specFolder, [
      {
        id: 'F-1-001',
        text: 'Which module owns admission?',
        source: 'frontier',
        origin: 'frontier',
        injectedAtIteration: 1,
      },
      {
        id: 'F-2-002',
        text: 'Which caps does admission read?',
        source: 'frontier',
        origin: 'frontier',
        injectedAtIteration: 1,
      },
    ]);
    return specFolder;
  }

  function writeNodes(specFolder: string, rows: Array<Record<string, unknown>>): void {
    writeFileSync(
      join(specFolder, 'research', 'frontier-nodes.jsonl'),
      `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`,
      'utf8',
    );
  }

  function node(
    nodeId: string,
    depth: number,
    parentId: string,
    question: string,
    status = 'open',
    extra: Record<string, unknown> = {},
  ): Record<string, unknown> {
    return {
      nodeId,
      parentId,
      depth,
      scope: 'runtime/lib',
      question,
      status,
      reason: null,
      iteration: 1,
      dedupeKey: question.toLowerCase(),
      ...extra,
    };
  }

  function twoOpen(): Array<Record<string, unknown>> {
    return [
      node('F-1-001', 1, 'root', 'Which module owns admission?'),
      node('F-2-002', 2, 'F-1-001', 'Which caps does admission read?'),
    ];
  }

  function iterationRow(
    run: number,
    focus: string,
    answeredQuestions: string[] = [],
  ): Record<string, unknown> {
    return {
      type: 'iteration',
      run,
      iteration: run,
      status: 'complete',
      focus,
      findingsCount: 1,
      newInfoRatio: 0.4,
      answeredQuestions,
      timestamp: `2026-06-19T00:${String(10 + run).padStart(2, '0')}:00.000Z`,
    };
  }

  function visit(nodeId: string, depth: number, question: string): string {
    return `Frontier node ${nodeId} (depth ${depth}, scope runtime/lib): ${question}`;
  }

  function stateOf(rows: Array<Record<string, unknown>>): string {
    return `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`;
  }

  it('keeps the frontier origin and projects the node store', () => {
    const specFolder = expansiveSpec();
    writeNodes(specFolder, twoOpen());
    writeState(specFolder, stateOf([iterationRow(1, 'What should be checked?', ['What should be checked?'])]));

    const { registry } = reduceResearchState(specFolder, { write: false });

    const keyQuestion = keyQuestionsOf(registry)
      .find((entry) => entry.text === 'Which module owns admission?');
    expect(keyQuestion?.origin).toBe('frontier');
    expect(frontierOf(registry).nodes).toHaveLength(2);
    expect(frontierOf(registry).stats.open).toBe(2);
  });

  it('rebuilds the same frontier on a second reduce', () => {
    const specFolder = expansiveSpec();
    writeNodes(specFolder, twoOpen());
    writeState(specFolder, stateOf([iterationRow(1, 'What should be checked?', ['What should be checked?'])]));

    const first = JSON.stringify(reduceResearchState(specFolder, { write: false }).registry);
    const second = JSON.stringify(reduceResearchState(specFolder, { write: false }).registry);

    expect(second).toBe(first);
  });

  it('picks the shallowest open node and a visit does not resolve it', () => {
    const specFolder = expansiveSpec();
    writeNodes(specFolder, twoOpen());
    writeState(specFolder, stateOf([
      iterationRow(1, 'What should be checked?', ['What should be checked?']),
      iterationRow(2, visit('F-1-001', 1, 'Which module owns admission?')),
    ]));

    const { registry, strategy } = reduceResearchState(specFolder, { write: false });

    const nextFocus = /<!-- ANCHOR:next-focus -->([\s\S]*?)<!-- \/ANCHOR:next-focus -->/.exec(strategy)?.[1] ?? '';
    expect(nextFocus).toContain('Frontier node F-1-001');
    expect(nextFocus).not.toMatch(/^Which module owns admission\?$/m);
    expect(registry.openQuestions?.some((question) => question.text === 'Which module owns admission?'))
      .toBe(true);
  });

  it('resolves a frontier question when its node closes exhausted, so every question can resolve', () => {
    const specFolder = expansiveSpec();
    writeNodes(specFolder, [
      ...twoOpen(),
      node('F-1-001', 1, 'root', 'Which module owns admission?', 'exhausted', {
        reason: 'no-yield',
        iteration: 2,
      }),
      node('F-2-002', 2, 'F-1-001', 'Which caps does admission read?', 'answered', { iteration: 2 }),
    ]);
    writeState(specFolder, stateOf([iterationRow(1, 'What should be checked?', ['What should be checked?'])]));

    const { registry } = reduceResearchState(specFolder, { write: false });

    expect(registry.openQuestions ?? []).toHaveLength(0);
    expect(registry.resolvedQuestions?.some((question) => question.text === 'Which module owns admission?'))
      .toBe(true);
    const closed = keyQuestionsOf(registry)
      .find((entry) => entry.text === 'Which module owns admission?');
    expect(closed?.frontierStatus).toBe('exhausted');
  });

  it('rolls an unspent depth-1 share down to depth 2', () => {
    const specFolder = expansiveSpec();
    writeNodes(specFolder, [
      node('F-1-001', 1, 'root', 'Which module owns admission?', 'answered'),
      node('F-2-002', 2, 'F-1-001', 'Which caps does admission read?'),
    ]);
    writeState(specFolder, stateOf([
      iterationRow(1, visit('F-1-001', 1, 'Which module owns admission?')),
      iterationRow(2, visit('F-1-001', 1, 'Which module owns admission?')),
      iterationRow(3, visit('F-2-002', 2, 'Which caps does admission read?')),
      iterationRow(4, visit('F-2-002', 2, 'Which caps does admission read?')),
      iterationRow(5, visit('F-2-002', 2, 'Which caps does admission read?')),
      iterationRow(6, visit('F-2-002', 2, 'Which caps does admission read?')),
      iterationRow(7, visit('F-2-002', 2, 'Which caps does admission read?')),
      iterationRow(8, visit('F-2-002', 2, 'Which caps does admission read?')),
    ]));

    const { registry } = reduceResearchState(specFolder, { write: false });
    const frontier = frontierOf(registry);

    // Depth 1 spent 2 of its 5 iterations and closed, so the unspent 3 follow the
    // depth-2 band and six visits stay inside 3.5 + 3 instead of exhausting it.
    expect(frontier.nodes.find((entry) => entry.nodeId === 'F-2-002')?.status).toBe('open');
    expect(frontier.budget?.depth2.allotted).toBe(6.5);
  });

  it('reports a torn store row instead of dropping its node silently', () => {
    const specFolder = expansiveSpec();
    writeFileSync(
      join(specFolder, 'research', 'frontier-nodes.jsonl'),
      `${JSON.stringify(node('F-1-001', 1, 'root', 'Which module owns admission?'))}\n{"nodeId":"F-2-002","dep\n`,
      'utf8',
    );
    writeState(specFolder, stateOf([]));

    const { registry } = reduceResearchState(specFolder, { write: false });
    const frontier = frontierOf(registry);

    expect(frontier.nodes.map((entry) => entry.nodeId)).toEqual(['F-1-001']);
    expect(frontier.warnings).toEqual([
      expect.objectContaining({ file: 'frontier-nodes.jsonl', line: 2 }),
    ]);
  });

  it('never rolls a share up: a spent depth-1 band closes its open node as budget-exhausted', () => {
    const specFolder = expansiveSpec();
    writeNodes(specFolder, twoOpen());
    writeState(specFolder, stateOf([
      iterationRow(1, visit('F-1-001', 1, 'Which module owns admission?')),
      iterationRow(2, visit('F-1-001', 1, 'Which module owns admission?')),
      iterationRow(3, visit('F-1-001', 1, 'Which module owns admission?')),
      iterationRow(4, visit('F-1-001', 1, 'Which module owns admission?')),
      iterationRow(5, visit('F-1-001', 1, 'Which module owns admission?')),
    ]));

    const { registry } = reduceResearchState(specFolder, { write: false });
    const frontier = frontierOf(registry);
    const spent = frontier.nodes.find((entry) => entry.nodeId === 'F-1-001');

    expect(spent?.status).toBe('exhausted');
    expect(spent?.reason).toBe('budget');
    expect(frontier.budget?.depth1.allotted).toBe(5);
  });

  // A leaf may reword its focus line, so a visit counts wherever the node marker
  // appears in it, not only when the focus starts with the dispatched line.
  it('counts a visit when the leaf rewords the focus around the node marker', () => {
    const specFolder = expansiveSpec();
    writeNodes(specFolder, twoOpen());
    const reworded = (n: number) => `Iteration ${n}: Frontier node F-1-001 (depth 1) on admission ownership`;
    writeState(specFolder, stateOf([1, 2, 3, 4, 5].map((n) => iterationRow(n, reworded(n)))));

    const { registry } = reduceResearchState(specFolder, { write: false });
    const spent = frontierOf(registry).nodes.find((entry) => entry.nodeId === 'F-1-001');

    expect(spent?.status).toBe('exhausted');
    expect(spent?.reason).toBe('budget');
  });

  // A node the store still holds open is answered once an iteration answers its
  // question. The budget must see that before it closes the band, or an answered
  // node reads as exhausted and its band's unspent share never rolls down.
  it('keeps answered nodes answered and rolls their unspent depth-1 share down', () => {
    const specFolder = expansiveSpec();
    writeNodes(specFolder, twoOpen());
    const caps = 'Which caps does admission read?';
    writeState(specFolder, stateOf([
      iterationRow(1, visit('F-1-001', 1, 'Which module owns admission?'), ['Which module owns admission?']),
      iterationRow(2, visit('F-2-002', 2, caps)),
      iterationRow(3, visit('F-2-002', 2, caps)),
      iterationRow(4, visit('F-2-002', 2, caps)),
      iterationRow(5, visit('F-2-002', 2, caps), [caps]),
    ]));

    const { registry } = reduceResearchState(specFolder, { write: false });
    const frontier = frontierOf(registry);

    expect(frontier.nodes.map((entry) => `${entry.nodeId}:${entry.status}`))
      .toEqual(['F-1-001:answered', 'F-2-002:answered']);
    expect(frontier.stats.exhausted).toBe(0);
    // Depth 1 spent 1 of its 5 and has no open node, so 4 follow depth 2.
    expect(frontier.budget?.depth2.allotted).toBe(7.5);
  });

  it('closes only the unanswered nodes of an overspent band, and still resolves their questions', () => {
    const specFolder = expansiveSpec();
    const admission = 'Which module owns admission?';
    const caps = 'Which caps does admission read?';
    const limits = 'Which limits does admission skip?';
    writeInbox(specFolder, [
      { id: 'F-1-001', text: admission, source: 'frontier', origin: 'frontier', injectedAtIteration: 1 },
      { id: 'F-2-002', text: caps, source: 'frontier', origin: 'frontier', injectedAtIteration: 1 },
      { id: 'F-2-003', text: limits, source: 'frontier', origin: 'frontier', injectedAtIteration: 1 },
    ]);
    writeNodes(specFolder, [...twoOpen(), node('F-2-003', 2, 'F-1-001', limits)]);
    writeState(specFolder, stateOf([
      iterationRow(1, visit('F-1-001', 1, admission)),
      iterationRow(2, visit('F-1-001', 1, admission)),
      iterationRow(3, visit('F-1-001', 1, admission)),
      iterationRow(4, visit('F-1-001', 1, admission)),
      iterationRow(5, visit('F-1-001', 1, admission), [admission]),
      iterationRow(6, visit('F-2-002', 2, caps)),
      iterationRow(7, visit('F-2-002', 2, caps)),
      iterationRow(8, visit('F-2-002', 2, caps)),
      iterationRow(9, visit('F-2-002', 2, caps), [caps]),
    ]));

    const { registry } = reduceResearchState(specFolder, { write: false });
    const frontier = frontierOf(registry);

    // Depth 1 spent its whole share, so nothing carries and depth 2 overspends 4 of 3.5.
    expect(frontier.budget?.depth2).toEqual({ allotted: 3.5, spent: 4 });
    expect(frontier.nodes.map((entry) => `${entry.nodeId}:${entry.status}:${entry.reason}`))
      .toEqual(['F-1-001:answered:null', 'F-2-002:answered:null', 'F-2-003:exhausted:budget']);
    const closed = keyQuestionsOf(registry).find((entry) => entry.text === limits);
    expect(closed?.frontierStatus).toBe('exhausted');
    // The close lives only in the projection, so it dates from the band's last
    // counted visit, not from the iteration the node was admitted at.
    expect(closed?.resolvedAtIteration).toBe(9);
    expect(registry.openQuestions?.some((question) => question.text === limits)).toBe(false);
  });

  // The workflow reduces with write every iteration, so a budget close must
  // survive its own write-back instead of reading back as an answer.
  function overspentDepthTwo(): { specFolder: string; limits: string } {
    const specFolder = expansiveSpec();
    const admission = 'Which module owns admission?';
    const caps = 'Which caps does admission read?';
    const limits = 'Which limits does admission skip?';
    writeInbox(specFolder, [
      { id: 'F-1-001', text: admission, source: 'frontier', origin: 'frontier', injectedAtIteration: 1 },
      { id: 'F-2-002', text: caps, source: 'frontier', origin: 'frontier', injectedAtIteration: 1 },
      { id: 'F-2-003', text: limits, source: 'frontier', origin: 'frontier', injectedAtIteration: 1 },
    ]);
    writeNodes(specFolder, [...twoOpen(), node('F-2-003', 2, 'F-1-001', limits)]);
    writeState(specFolder, stateOf([
      ...[1, 2, 3, 4].map((run) => iterationRow(run, visit('F-1-001', 1, admission))),
      iterationRow(5, visit('F-1-001', 1, admission), [admission]),
      ...[6, 7, 8].map((run) => iterationRow(run, visit('F-2-002', 2, caps))),
      iterationRow(9, visit('F-2-002', 2, caps), [caps]),
    ]));
    return { specFolder, limits };
  }

  it('keeps a budget-closed node exhausted after the reduce writes it back', () => {
    const { specFolder, limits } = overspentDepthTwo();

    reduceResearchState(specFolder, { write: true });
    const strategy = readFileSync(join(specFolder, 'research', 'deep-research-strategy.md'), 'utf8');
    const answeredSection = strategy.split('<!-- ANCHOR:answered-questions -->')[1]?.split('<!-- /ANCHOR:answered-questions -->')[0] ?? '';
    expect(answeredSection).not.toContain(limits);

    const { registry } = reduceResearchState(specFolder, { write: false });
    const frontier = frontierOf(registry);
    expect(frontier.nodes.map((entry) => `${entry.nodeId}:${entry.status}:${entry.reason}`))
      .toEqual(['F-1-001:answered:null', 'F-2-002:answered:null', 'F-2-003:exhausted:budget']);
    expect(frontier.stats.exhausted).toBe(1);
    expect(keyQuestionsOf(registry).find((entry) => entry.text === limits)?.frontierStatus).toBe('exhausted');
  });

  it('reopens a budget-closed node once an extension raises the cap', () => {
    const { specFolder, limits } = overspentDepthTwo();
    reduceResearchState(specFolder, { write: true });

    const configPath = join(specFolder, 'research', 'deep-research-config.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    writeFileSync(configPath, `${JSON.stringify({ ...config, maxIterations: 24 }, null, 2)}\n`, 'utf8');

    const { registry } = reduceResearchState(specFolder, { write: false });
    const reopened = frontierOf(registry).nodes.find((entry) => entry.nodeId === 'F-2-003');
    expect(reopened?.status).toBe('open');
    expect(registry.openQuestions?.some((question) => question.text === limits)).toBe(true);
  });

  it('renders the frontier metrics on an expansive dashboard only', () => {
    const expansiveFolder = expansiveSpec();
    writeNodes(expansiveFolder, twoOpen());
    writeState(expansiveFolder, stateOf([iterationRow(1, 'What should be checked?', ['What should be checked?'])]));

    const expansive = reduceResearchState(expansiveFolder, { write: false });
    expect(expansive.dashboard).toContain('## 6B. FRONTIER');
    expect(expansive.dashboard).toContain('- Frontier size: 2 nodes');
    expect(expansive.dashboard).toContain('- Pruned nodes: 0');
    expect(expansive.dashboard).toContain('- Revisits: ');
    expect(expansive.dashboard).toContain('- Budget depth1: ');

    const defaultFolder = expansiveSpec('default');
    writeNodes(defaultFolder, twoOpen());
    writeState(defaultFolder, stateOf([iterationRow(1, 'What should be checked?', ['What should be checked?'])]));

    const defaulted = reduceResearchState(defaultFolder, { write: false });
    expect(Object.prototype.hasOwnProperty.call(defaulted.registry, 'frontier')).toBe(false);
    expect(defaulted.dashboard).not.toContain('6B. FRONTIER');
  });
});

// The budget never counts an errored or timed-out attempt as a visit, so the
// focus pick must not either: a node whose only attempt failed still has its
// work ahead of it and must not lose its turn to a sibling.
describe('frontier focus visit counting', () => {
  const { pickFrontierFocus, frontierNodeVisits } = nodeRequire('../../../deep-research/scripts/reduce-state.cjs') as {
    pickFrontierFocus: (frontier: { nodes: Array<Record<string, unknown>> }, records: Array<Record<string, unknown>>) => string;
    frontierNodeVisits: (nodeId: string, records: Array<Record<string, unknown>>) => number;
  };
  const nodes = [
    { nodeId: 'F-1-001', depth: 1, status: 'open', iteration: 1, scope: ['runtime/lib'], question: 'Which module owns admission?' },
    { nodeId: 'F-1-002', depth: 1, status: 'open', iteration: 2, scope: ['runtime/lib'], question: 'Which module owns the stop?' },
  ];

  it('does not count a failed attempt as a visit when ranking open nodes', () => {
    const records = [
      { type: 'iteration', iteration: 3, status: 'error', focus: 'Frontier node F-1-001 (depth 1, scope runtime/lib): Which module owns admission?' },
    ];
    expect(frontierNodeVisits('F-1-001', records)).toBe(0);
    expect(pickFrontierFocus({ nodes }, records)).toMatch(/^Frontier node F-1-001 /);
  });

  it('still counts a completed attempt, so the unvisited sibling goes next', () => {
    const records = [
      { type: 'iteration', iteration: 3, status: 'complete', focus: 'Frontier node F-1-001 (depth 1, scope runtime/lib): Which module owns admission?' },
    ];
    expect(frontierNodeVisits('F-1-001', records)).toBe(1);
    expect(pickFrontierFocus({ nodes }, records)).toMatch(/^Frontier node F-1-002 /);
  });
});
