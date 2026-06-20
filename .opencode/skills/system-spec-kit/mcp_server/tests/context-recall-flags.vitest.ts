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

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';

import { buildWorldSummaryPrelude } from '../lib/search/memory-summaries';
import { prependWorldSummaryPreludeToResult } from '../handlers/memory-context';
import {
  isWorldSummaryPreludeEnabled,
} from '../lib/search/search-flags';

const ENV_KEYS = [
  'SPECKIT_WORLD_SUMMARY_PRELUDE',
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
  it('runs the world-summary prelude on by default', () => {
    // World-summary prelude graduated to default-on (a no-displacement append
    // grounding aid), so env-absence means ON.
    expect(isWorldSummaryPreludeEnabled()).toBe(true);
  });

  it('honors an explicit false override on the prelude', () => {
    process.env.SPECKIT_WORLD_SUMMARY_PRELUDE = 'false';
    expect(isWorldSummaryPreludeEnabled()).toBe(false);
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

