import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as handler from '../handlers/memory-triggers';
import * as core from '../core';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as evalLogger from '../lib/eval/eval-logger';
import * as workingMemory from '../lib/cognitive/working-memory';
import * as attentionDecay from '../lib/cognitive/attention-decay';
import * as coActivation from '../lib/cognitive/co-activation';
import * as sessionManager from '../lib/session/session-manager';
import * as vectorIndexStore from '../lib/search/vector-index-store';
import * as semanticTriggerMatcher from '../lib/triggers/semantic-trigger-matcher';
import type { TriggerMatch, TriggerMatchWithStats } from '../lib/parsing/trigger-matcher';
import type { SemanticMatch, SemanticTriggerCacheEntry } from '../lib/triggers/semantic-trigger-matcher';

type TriggerResponse = Awaited<ReturnType<typeof handler.handleMemoryMatchTriggers>>;
type AttentionDb = NonNullable<ReturnType<typeof attentionDecay.getDb>>;

function parseEnvelope(response: TriggerResponse): Record<string, unknown> {
  return JSON.parse(response.content[0].text) as Record<string, unknown>;
}

function getRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : {};
}

function getArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function buildTriggerMatch(overrides: Partial<TriggerMatch> = {}): TriggerMatch {
  return {
    memoryId: 1,
    specFolder: 'specs/hybrid',
    filePath: '/tmp/hybrid.md',
    title: 'Hybrid memory',
    matchedPhrases: ['hybrid'],
    importanceWeight: 0.8,
    ...overrides,
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

function buildSemanticMatch(overrides: Partial<SemanticMatch> = {}): SemanticMatch {
  return {
    memoryId: 701,
    specFolder: 'specs/hybrid',
    filePath: '/tmp/semantic.md',
    title: 'Semantic memory',
    importanceWeight: 0.7,
    matchedPhrases: ['save current state'],
    score: 0.73,
    source: 'semantic-trigger-shadow',
    ...overrides,
  };
}

function stubSemanticLookup(matches: SemanticMatch[]): void {
  vi.spyOn(vectorIndexStore, 'initialize_db').mockReturnValue({ prepare: vi.fn() } as never);
  vi.spyOn(semanticTriggerMatcher, 'lookupCachedQueryEmbedding').mockReturnValue(new Float32Array([1, 0, 0]));
  vi.spyOn(semanticTriggerMatcher, 'loadSemanticTriggerCache').mockReturnValue([
    {
      memoryId: matches[0]?.memoryId ?? 701,
      specFolder: 'specs/hybrid',
      filePath: '/tmp/semantic.md',
      title: 'Semantic memory',
      importanceWeight: 0.7,
      phrase: 'save current state',
      phraseHash: 'hash',
      embedding: new Float32Array([1, 0, 0]),
    } satisfies SemanticTriggerCacheEntry,
  ]);
  vi.spyOn(semanticTriggerMatcher, 'matchSemanticTriggers').mockReturnValue(matches);
}

function stubCognitive(attentionRows: Array<{ id: number; attention_score: number }>): void {
  vi.spyOn(workingMemory, 'isEnabled').mockReturnValue(true);
  vi.spyOn(workingMemory, 'batchUpdateScores').mockReturnValue(0);
  vi.spyOn(workingMemory, 'setAttentionScore').mockReturnValue(true);
  vi.spyOn(workingMemory, 'getSessionMemories').mockReturnValue(attentionRows);
  vi.spyOn(attentionDecay, 'activateMemory').mockReturnValue(false);
  vi.spyOn(attentionDecay, 'getDb').mockReturnValue({
    prepare: vi.fn(() => ({ get: vi.fn(() => undefined) })),
  } as unknown as AttentionDb);
  vi.spyOn(coActivation, 'isEnabled').mockReturnValue(false);
  vi.spyOn(sessionManager, 'resolveTrustedSession').mockReturnValue({
    requestedSessionId: 'session-1',
    effectiveSessionId: 'session-1',
    trusted: true,
  });
}

describe('hybrid trigger handler', () => {
  let previousFlag: string | undefined;
  let previousMode: string | undefined;

  beforeEach(() => {
    previousFlag = process.env.SPECKIT_SEMANTIC_TRIGGERS;
    previousMode = process.env.SPECKIT_SEMANTIC_TRIGGERS_MODE;
    delete process.env.SPECKIT_SEMANTIC_TRIGGERS;
    delete process.env.SPECKIT_SEMANTIC_TRIGGERS_MODE;
    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
    vi.spyOn(evalLogger, 'logSearchQuery').mockReturnValue({ queryId: 61, evalRunId: 62 });
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

  it('short-circuits semantic lookup for an exact lexical command', async () => {
    process.env.SPECKIT_SEMANTIC_TRIGGERS = 'true';
    process.env.SPECKIT_SEMANTIC_TRIGGERS_MODE = 'union';
    vi.spyOn(triggerMatcher, 'matchTriggerPhrasesWithStats').mockReturnValue(
      buildTriggerMatchResult([buildTriggerMatch({ memoryId: 101, matchedPhrases: ['/memory:save'] })]),
    );
    const lookupSpy = vi.spyOn(semanticTriggerMatcher, 'lookupCachedQueryEmbedding');
    const cacheSpy = vi.spyOn(semanticTriggerMatcher, 'loadSemanticTriggerCache');
    const matcherSpy = vi.spyOn(semanticTriggerMatcher, 'matchSemanticTriggers');

    const response = await handler.handleMemoryMatchTriggers({ prompt: '/memory:save', include_cognitive: false });
    const payload = parseEnvelope(response);
    const data = getRecord(payload.data);
    const meta = getRecord(payload.meta);
    const results = getArray(data.results).map(getRecord);

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ memoryId: 101, matchedPhrases: ['/memory:save'] });
    expect(results[0].matchSource).toBeUndefined();
    expect(getRecord(meta.semanticTriggerUnion)).toMatchObject({
      status: 'skipped_strong_lexical_command',
      lexicalCount: 1,
      semanticCount: 0,
      addedCount: 0,
    });
    expect(lookupSpy).not.toHaveBeenCalled();
    expect(cacheSpy).not.toHaveBeenCalled();
    expect(matcherSpy).not.toHaveBeenCalled();
  });

  it('returns a semantic-only union hit with reduced cognitive activation', async () => {
    process.env.SPECKIT_SEMANTIC_TRIGGERS = 'true';
    process.env.SPECKIT_SEMANTIC_TRIGGERS_MODE = 'union';
    vi.spyOn(triggerMatcher, 'matchTriggerPhrasesWithStats').mockReturnValue(buildTriggerMatchResult([]));
    stubSemanticLookup([buildSemanticMatch({ score: 0.73 })]);
    stubCognitive([{ id: 701, attention_score: 0.73 }]);

    const response = await handler.handleMemoryMatchTriggers({
      prompt: 'save this session for later',
      include_cognitive: true,
      session_id: 'session-1',
    });
    const payload = parseEnvelope(response);
    const data = getRecord(payload.data);
    const meta = getRecord(payload.meta);
    const results = getArray(data.results).map(getRecord);

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      memoryId: 701,
      matchedPhrases: ['save current state'],
      matchSource: 'semantic',
      semanticScore: 0.73,
      attentionScore: 0.73,
    });
    expect(workingMemory.setAttentionScore).toHaveBeenCalledWith('session-1', 701, 0.73);
    expect(getRecord(meta.semanticTriggerUnion)).toMatchObject({
      status: 'computed',
      lexicalCount: 0,
      semanticCount: 1,
      addedCount: 1,
      topScore: 0.73,
    });
  });

  it('activates lexical hits at full attention and caps semantic hits', async () => {
    process.env.SPECKIT_SEMANTIC_TRIGGERS = 'true';
    process.env.SPECKIT_SEMANTIC_TRIGGERS_MODE = 'union';
    vi.spyOn(triggerMatcher, 'matchTriggerPhrasesWithStats').mockReturnValue(
      buildTriggerMatchResult([buildTriggerMatch({ memoryId: 201, matchedPhrases: ['context'] })]),
    );
    stubSemanticLookup([buildSemanticMatch({ memoryId: 202, score: 0.91 })]);
    stubCognitive([
      { id: 201, attention_score: 1.0 },
      { id: 202, attention_score: 0.85 },
    ]);

    const response = await handler.handleMemoryMatchTriggers({
      prompt: 'please keep this context',
      limit: 3,
      include_cognitive: true,
      session_id: 'session-1',
    });
    const payload = parseEnvelope(response);
    const data = getRecord(payload.data);
    const results = getArray(data.results).map(getRecord);

    expect(results.map((result) => result.memoryId)).toEqual([201, 202]);
    expect(results[0]).toMatchObject({ matchSource: 'lexical', attentionScore: 1.0 });
    expect(results[1]).toMatchObject({ matchSource: 'semantic', semanticScore: 0.91, attentionScore: 0.85 });
    expect(workingMemory.setAttentionScore).toHaveBeenCalledWith('session-1', 201, 1.0);
    expect(workingMemory.setAttentionScore).toHaveBeenCalledWith('session-1', 202, 0.85);
  });

  it('over-fetches semantic candidates before scope filtering for a scoped query', async () => {
    // Regression: scope filtering must run over a candidate pool wider than `limit`,
    // otherwise in-scope matches ranked below out-of-scope ones are starved. The
    // matcher must receive an over-fetch `max`, mirroring the lexical limit*2 path.
    process.env.SPECKIT_SEMANTIC_TRIGGERS = 'true';
    process.env.SPECKIT_SEMANTIC_TRIGGERS_MODE = 'union';
    vi.spyOn(triggerMatcher, 'matchTriggerPhrasesWithStats').mockReturnValue(buildTriggerMatchResult([]));
    stubSemanticLookup([buildSemanticMatch({ score: 0.73 })]);
    stubCognitive([{ id: 701, attention_score: 0.73 }]);
    const matcherSpy = vi.spyOn(semanticTriggerMatcher, 'matchSemanticTriggers');

    const limit = 3;
    await handler.handleMemoryMatchTriggers({
      prompt: 'save this session for later',
      limit,
      specFolder: 'specs/hybrid',
      include_cognitive: true,
      session_id: 'session-1',
    });

    expect(matcherSpy).toHaveBeenCalledTimes(1);
    const options = matcherSpy.mock.calls[0][2];
    expect(options?.max).toBeGreaterThan(limit);
  });
});
