import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as handler from '../handlers/memory-triggers';
import * as core from '../core';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as evalLogger from '../lib/eval/eval-logger';
import * as semanticTriggerMatcher from '../lib/triggers/semantic-trigger-matcher';
import type { TriggerMatch, TriggerMatchWithStats } from '../lib/parsing/trigger-matcher';

type TriggerResponse = Awaited<ReturnType<typeof handler.handleMemoryMatchTriggers>>;

interface Fixture {
  prompt: string;
  memoryId: number;
  phrase: string;
}

const FIXTURES: Fixture[] = [
  { prompt: '/memory:save', memoryId: 11, phrase: '/memory:save' },
  { prompt: 'save context', memoryId: 12, phrase: 'save context' },
  { prompt: 'resume iteration', memoryId: 13, phrase: 'resume iteration' },
  { prompt: '保存上下文', memoryId: 14, phrase: '保存上下文' },
];

function parseEnvelope(response: TriggerResponse): Record<string, unknown> {
  return JSON.parse(response.content[0].text) as Record<string, unknown>;
}

function getRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : {};
}

function getArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function buildTriggerMatch(fixture: Fixture): TriggerMatch {
  return {
    memoryId: fixture.memoryId,
    specFolder: 'specs/parity',
    filePath: `/tmp/parity-${fixture.memoryId}.md`,
    title: `Parity ${fixture.memoryId}`,
    matchedPhrases: [fixture.phrase],
    importanceWeight: 0.9,
  };
}

function buildTriggerMatchResult(matches: TriggerMatch[]): TriggerMatchWithStats {
  return {
    matches,
    stats: {
      promptLength: 12,
      cacheSize: matches.length,
      matchCount: matches.length,
      totalMatchedPhrases: matches.reduce((total, match) => total + match.matchedPhrases.length, 0),
      matchTimeMs: 0,
      signals: [],
    },
  };
}

function stablePayload(payload: Record<string, unknown>): Record<string, unknown> {
  const meta = { ...getRecord(payload.meta) };
  delete meta.tokenCount;
  delete meta.latencyMs;
  return { ...payload, meta };
}

async function runFixture(fixture: Fixture): Promise<Record<string, unknown>> {
  vi.spyOn(triggerMatcher, 'matchTriggerPhrasesWithStats').mockReturnValue(
    buildTriggerMatchResult([buildTriggerMatch(fixture)]),
  );
  const response = await handler.handleMemoryMatchTriggers({ prompt: fixture.prompt, include_cognitive: false });
  return parseEnvelope(response);
}

function resultRows(payload: Record<string, unknown>): Record<string, unknown>[] {
  const data = getRecord(payload.data);
  return getArray(data.results).map(getRecord);
}

describe('lexical trigger parity', () => {
  let previousFlag: string | undefined;
  let previousMode: string | undefined;

  beforeEach(() => {
    previousFlag = process.env.SPECKIT_SEMANTIC_TRIGGERS;
    previousMode = process.env.SPECKIT_SEMANTIC_TRIGGERS_MODE;
    delete process.env.SPECKIT_SEMANTIC_TRIGGERS;
    delete process.env.SPECKIT_SEMANTIC_TRIGGERS_MODE;
    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
    vi.spyOn(evalLogger, 'logSearchQuery').mockReturnValue({ queryId: 71, evalRunId: 72 });
    vi.spyOn(evalLogger, 'logFinalResult').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (previousFlag === undefined) {
      delete process.env.SPECKIT_SEMANTIC_TRIGGERS;
    } else {
      process.env.SPECKIT_SEMANTIC_TRIGGERS = previousFlag;
    }
    if (previousMode === undefined) {
      delete process.env.SPECKIT_SEMANTIC_TRIGGERS_MODE;
    } else {
      process.env.SPECKIT_SEMANTIC_TRIGGERS_MODE = previousMode;
    }
  });

  it.each(FIXTURES)('keeps flag-off output stable for $prompt', async (fixture) => {
    const baseline = await runFixture(fixture);
    vi.restoreAllMocks();
    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
    vi.spyOn(evalLogger, 'logSearchQuery').mockReturnValue({ queryId: 71, evalRunId: 72 });
    vi.spyOn(evalLogger, 'logFinalResult').mockImplementation(() => undefined);
    process.env.SPECKIT_SEMANTIC_TRIGGERS_MODE = 'union';
    const lookupSpy = vi.spyOn(semanticTriggerMatcher, 'lookupCachedQueryEmbedding');
    const matcherSpy = vi.spyOn(semanticTriggerMatcher, 'matchSemanticTriggers');
    const repeated = await runFixture(fixture);
    const rows = resultRows(repeated);

    expect(stablePayload(repeated)).toEqual(stablePayload(baseline));
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      memoryId: fixture.memoryId,
      matchedPhrases: [fixture.phrase],
      importanceWeight: 0.9,
    });
    expect(rows[0].matchSource).toBeUndefined();
    expect(rows[0].semanticScore).toBeUndefined();
    expect(lookupSpy).not.toHaveBeenCalled();
    expect(matcherSpy).not.toHaveBeenCalled();
  });

  it.each(FIXTURES)('keeps shadow-default result rows unchanged for $prompt', async (fixture) => {
    const baseline = await runFixture(fixture);
    vi.restoreAllMocks();
    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
    vi.spyOn(evalLogger, 'logSearchQuery').mockReturnValue({ queryId: 71, evalRunId: 72 });
    vi.spyOn(evalLogger, 'logFinalResult').mockImplementation(() => undefined);
    process.env.SPECKIT_SEMANTIC_TRIGGERS = 'true';
    const shadowSpy = vi.spyOn(semanticTriggerMatcher, 'computeSemanticTriggerShadow').mockReturnValue({
      enabled: true,
      status: 'computed',
      lexicalCount: 1,
      semanticCount: 0,
      overlapCount: 0,
      topScore: null,
      latencyMs: 0,
    });
    const repeated = await runFixture(fixture);

    expect(resultRows(repeated)).toEqual(resultRows(baseline));
    expect(resultRows(repeated)[0].matchSource).toBeUndefined();
    expect(resultRows(repeated)[0].semanticScore).toBeUndefined();
    expect(shadowSpy).not.toHaveBeenCalled();
  });
});
