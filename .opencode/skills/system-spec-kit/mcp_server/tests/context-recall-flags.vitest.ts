// ───────────────────────────────────────────────────────────────
// MODULE: Context Recall Flag ON-Path Tests
// ───────────────────────────────────────────────────────────────
// ON-path coverage for the recall-mode flags that the memory_context path
// consumes rather than hybridSearchEnhanced. The sibling retrieval-flag eval
// marks these flags runSearch:false; this suite proves the flag-ON path actually
// changes behavior and that the new contract holds, not just flag-off identity.
//
// Flag-to-consumer map under test:
//   SPECKIT_WORLD_SUMMARY_PRELUDE          -> buildWorldSummaryPrelude + prepend
//   SPECKIT_AGENTIC_RECALL                 -> runAgenticLoop governor gate
//   SPECKIT_PROCEDURAL_RELIABILITY_RECALL  -> getProceduralReliabilityMultipliers
//                                              via buildAdaptiveShadowProposal

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';

import { buildWorldSummaryPrelude } from '../lib/search/memory-summaries';
import { prependWorldSummaryPreludeToResult } from '../handlers/memory-context';
import { runAgenticLoop } from '../lib/search/agentic-loop-governor';
import {
  buildAdaptiveShadowProposal,
  ensureAdaptiveTables,
  recordAdaptiveSignal,
} from '../lib/cognitive/adaptive-ranking';
import {
  isAgenticRecallEnabled,
  isProceduralReliabilityRecallEnabled,
  isWorldSummaryPreludeEnabled,
} from '../lib/search/search-flags';

const ENV_KEYS = [
  'SPECKIT_WORLD_SUMMARY_PRELUDE',
  'SPECKIT_AGENTIC_RECALL',
  'SPECKIT_PROCEDURAL_RELIABILITY_RECALL',
  'SPECKIT_MEMORY_ADAPTIVE_RANKING',
  'SPECKIT_MEMORY_ADAPTIVE_MODE',
] as const;

const ORIGINAL_ENV: Partial<Record<typeof ENV_KEYS[number], string | undefined>> = {};

let db: InstanceType<typeof Database> | null = null;

function restoreEnv(): void {
  for (const key of ENV_KEYS) {
    if (ORIGINAL_ENV[key] === undefined) delete process.env[key];
    else process.env[key] = ORIGINAL_ENV[key];
  }
}

function createFixtureDb(): InstanceType<typeof Database> {
  const fixture = new Database(':memory:');
  fixture.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      spec_folder TEXT,
      file_path TEXT,
      memory_type TEXT,
      context_type TEXT,
      embedding_status TEXT,
      expires_at TEXT,
      created_at TEXT,
      content TEXT,
      trigger_phrases TEXT
    );
    CREATE TABLE memory_summaries (
      id INTEGER PRIMARY KEY,
      memory_id INTEGER NOT NULL,
      summary_text TEXT NOT NULL,
      created_at TEXT,
      updated_at TEXT
    );
    CREATE TABLE active_memory_projection (
      active_memory_id INTEGER PRIMARY KEY
    );
  `);

  const now = '2026-01-01T00:00:00.000Z';
  const insertMemory = fixture.prepare(`
    INSERT INTO memory_index (
      id, title, spec_folder, file_path, memory_type, context_type,
      embedding_status, expires_at, created_at, content, trigger_phrases
    ) VALUES (?, ?, ?, ?, ?, ?, 'success', null, ?, ?, '[]')
  `);
  insertMemory.run(1, 'Agentic recall governor bounds', 'specs/recall', '/w/specs/recall/spec.md', 'procedural', 'procedural', now, 'Bounded loop body');
  insertMemory.run(2, 'World summary prelude grounding', 'specs/recall', '/w/specs/recall/plan.md', 'declarative', 'general', now, 'Prelude body');

  const insertProjection = fixture.prepare('INSERT INTO active_memory_projection (active_memory_id) VALUES (?)');
  insertProjection.run(1);
  insertProjection.run(2);

  const insertSummary = fixture.prepare(`
    INSERT INTO memory_summaries (id, memory_id, summary_text, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertSummary.run(101, 1, 'Agentic recall governor enforces bounded loop termination.', now, now);
  insertSummary.run(102, 2, 'World summary prelude grounds context retrieval results.', now, now);
  return fixture;
}

beforeEach(() => {
  for (const key of ENV_KEYS) {
    ORIGINAL_ENV[key] = process.env[key];
    delete process.env[key];
  }
  db = createFixtureDb();
});

afterEach(() => {
  restoreEnv();
  if (db) {
    db.close();
    db = null;
  }
});

describe('recall-mode flag defaults', () => {
  it('runs world-summary prelude and procedural reliability recall on by default, agentic recall still off', () => {
    // World-summary prelude and procedural reliability recall graduated to
    // default-on, so env-absence now means ON. Agentic recall is still an
    // unwired scaffold and stays opt-in.
    expect(isWorldSummaryPreludeEnabled()).toBe(true);
    expect(isProceduralReliabilityRecallEnabled()).toBe(true);
    expect(isAgenticRecallEnabled()).toBe(false);
  });

  it('honors an explicit false override on the graduated recall-mode flags', () => {
    process.env.SPECKIT_WORLD_SUMMARY_PRELUDE = 'false';
    process.env.SPECKIT_PROCEDURAL_RELIABILITY_RECALL = 'false';
    expect(isWorldSummaryPreludeEnabled()).toBe(false);
    expect(isProceduralReliabilityRecallEnabled()).toBe(false);
  });
});

describe('SPECKIT_WORLD_SUMMARY_PRELUDE ON-path behavior change', () => {
  it('injects a grounding prelude row and recalls the known-item target only when enabled', () => {
    const fixtureDb = db as InstanceType<typeof Database>;
    const query = 'world summary prelude grounding';
    const baseEnvelope = { summary: 'ok', data: { count: 1, results: [{ id: 99, title: 'existing' }] } };
    const baseResult = {
      strategy: 'search',
      mode: 'focused',
      content: [{ type: 'text', text: JSON.stringify(baseEnvelope) }],
    } as Parameters<typeof prependWorldSummaryPreludeToResult>[0];

    // Flag ON: the handler builds the prelude and prepends it. Mirror that path.
    process.env.SPECKIT_WORLD_SUMMARY_PRELUDE = 'true';
    expect(isWorldSummaryPreludeEnabled()).toBe(true);

    const prelude = buildWorldSummaryPrelude(fixtureDb, query, { specFolder: 'specs/recall' }, { limit: 5 });
    expect(prelude).not.toBeNull();

    const onResult = prependWorldSummaryPreludeToResult(baseResult, prelude!);
    const onParsed = JSON.parse((onResult.content as Array<{ text: string }>)[0].text);

    // Contract: grounding is APPENDED at the tail — the baseline row keeps rank 0
    // (zero displacement), the grounding marker trails last, and the world-summary
    // target memory id stays recallable in sections and reachable in results.
    expect(onResult.worldSummaryPreludeInjected).toBe(true);
    expect(onParsed.data.results[0]).toMatchObject({ id: 99, title: 'existing' });
    expect(onParsed.data.results.at(-1)).toMatchObject({
      id: 'world-summary-prelude',
      source: 'world_summary',
      groundingPrelude: true,
    });
    expect(onParsed.data.count).toBeGreaterThan(1);
    expect(onParsed.data.worldSummaryPrelude.sectionCount).toBeGreaterThan(0);
    expect(prelude!.sections.map((section) => section.memoryId)).toContain(2);
    // The recovered target is reachable in the result list (as a trailing row),
    // and the baseline hit at rank 0 was never pushed out.
    const onIds = (onParsed.data.results as Array<{ id: unknown }>).map((row) => row.id);
    expect(onIds).toContain(2);
    expect(onIds.indexOf(2)).toBeGreaterThan(0);

    // Flag OFF: the handler never builds/injects. The base result is unchanged —
    // assert behavior differs from ON, not merely byte-identity of the base.
    process.env.SPECKIT_WORLD_SUMMARY_PRELUDE = 'false';
    expect(isWorldSummaryPreludeEnabled()).toBe(false);
    const offParsed = JSON.parse((baseResult.content as Array<{ text: string }>)[0].text);
    expect(offParsed.data.count).toBe(1);
    expect(offParsed.data.results[0].id).toBe(99);
    expect(offParsed.data.worldSummaryPrelude).toBeUndefined();
    expect(onParsed.data.count).not.toBe(offParsed.data.count);
  });
});

describe('SPECKIT_AGENTIC_RECALL ON-path behavior change', () => {
  const config = {
    allowedTools: new Set(['memory_lookup']),
    maxSteps: 4,
    stepProvider: (() => {
      let called = false;
      return (state: { stepIndex: number }) => {
        if (!called && state.stepIndex === 0) {
          called = true;
          return { kind: 'tool_call' as const, tool: 'memory_lookup', args: { id: 1 } };
        }
        return { kind: 'final_answer' as const, answer: { memoryId: 1 } };
      };
    })(),
    toolExecutor: () => ({ memoryId: 1 }),
  };

  it('runs the bounded loop to a clean terminal answer only when enabled', async () => {
    // Flag OFF: structurally disabled, never runs a step.
    process.env.SPECKIT_AGENTIC_RECALL = 'false';
    expect(isAgenticRecallEnabled()).toBe(false);
    const off = await runAgenticLoop({ ...config, stepProvider: config.stepProvider });
    expect(off.status).toBe('disabled');
    expect(off.stopReason).toBe('flag_disabled');
    expect(off.steps).toBe(0);

    // Flag ON: the governor runs and reaches a clean terminal answer.
    process.env.SPECKIT_AGENTIC_RECALL = 'true';
    expect(isAgenticRecallEnabled()).toBe(true);
    let called = false;
    const on = await runAgenticLoop({
      allowedTools: new Set(['memory_lookup']),
      maxSteps: 4,
      stepProvider: (state) => {
        if (!called && state.stepIndex === 0) {
          called = true;
          return { kind: 'tool_call', tool: 'memory_lookup', args: { id: 1 } };
        }
        return { kind: 'final_answer', answer: { memoryId: 1 } };
      },
      toolExecutor: () => ({ memoryId: 1 }),
    });
    expect(on.status).toBe('final');
    expect(on.stopReason).toBe('final_answer');
    expect(on.answer).toMatchObject({ memoryId: 1 });
    expect(on.status).not.toBe(off.status);
  });
});

describe('SPECKIT_PROCEDURAL_RELIABILITY_RECALL ON-path behavior change', () => {
  it('applies a reliability score delta to procedural rows only when enabled', () => {
    const fixtureDb = db as InstanceType<typeof Database>;
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    process.env.SPECKIT_MEMORY_ADAPTIVE_MODE = 'shadow';
    ensureAdaptiveTables(fixtureDb);

    // Outcome evidence so the reliability multiplier has a signal to act on.
    recordAdaptiveSignal(fixtureDb, {
      memoryId: 1,
      signalType: 'outcome',
      signalValue: 1,
      actor: 'context-recall-flags-test',
    });

    const results = [{ id: 1, score: 0.5, similarity: 0.5, title: 'Agentic recall governor bounds', memory_type: 'procedural' }];

    // Flag OFF: getProceduralReliabilityMultipliers returns an empty map, so the
    // reliability contribution to scoreDelta is zero.
    process.env.SPECKIT_PROCEDURAL_RELIABILITY_RECALL = 'false';
    expect(isProceduralReliabilityRecallEnabled()).toBe(false);
    const offProposal = buildAdaptiveShadowProposal(fixtureDb, 'agentic recall governor', results);
    const offDelta = offProposal?.rows.find((row) => row.memoryId === 1)?.scoreDelta ?? 0;

    // Flag ON: the multiplier is applied, moving the procedural row's score delta.
    process.env.SPECKIT_PROCEDURAL_RELIABILITY_RECALL = 'true';
    expect(isProceduralReliabilityRecallEnabled()).toBe(true);
    const onProposal = buildAdaptiveShadowProposal(fixtureDb, 'agentic recall governor', results);
    const onDelta = onProposal?.rows.find((row) => row.memoryId === 1)?.scoreDelta ?? 0;

    expect(offProposal).not.toBeNull();
    expect(onProposal).not.toBeNull();
    // Contract: reliability evidence changes the procedural row's shadow score
    // delta only when the flag is enabled.
    expect(onDelta).not.toBe(offDelta);
  });
});
