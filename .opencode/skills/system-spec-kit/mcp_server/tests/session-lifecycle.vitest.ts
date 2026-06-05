// TEST: SESSION LIFECYCLE CONTRACT
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import * as workingMemory from '../lib/cognitive/working-memory';
import { resolveNoSessionAnchor, PROCESS_MEMORY_SESSION_ID } from '../handlers/memory-context';

function createDb() {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL DEFAULT 'test',
      file_path TEXT NOT NULL DEFAULT '/tmp/test.md',
      title TEXT
    );
  `);

  for (let i = 1; i <= 20; i += 1) {
    db.prepare('INSERT INTO memory_index (id, file_path, title) VALUES (?, ?, ?)').run(
      i,
      `/tmp/memory-${i}.md`,
      `Memory ${i}`
    );
  }

  workingMemory.init(db);
  return db;
}

describe('Session lifecycle contract (T027k-T027n)', () => {
  let db: Database.Database | null = null;

  afterEach(() => {
    if (db) {
      db.close();
      db = null;
    }
  });

  it('new session starts event_counter at 0', () => {
    db = createDb();
    expect(workingMemory.getSessionEventCounter('new-session')).toBe(0);
    expect(workingMemory.setAttentionScore('new-session', 1, 0.8)).toBe(true);

    const rows = workingMemory.getWorkingMemory('new-session');
    expect(rows.length).toBe(1);
    expect(rows[0].event_counter).toBe(0);
  });

  it('resume session continues event_counter and preserves working memory items', () => {
    db = createDb();

    expect(workingMemory.setAttentionScore('resume-session', 2, 0.7)).toBe(true); // 0
    expect(workingMemory.setAttentionScore('resume-session', 3, 0.6)).toBe(true); // 1

    expect(workingMemory.sessionExists('resume-session')).toBe(true);
    expect(workingMemory.getSessionEventCounter('resume-session')).toBe(1);

    expect(workingMemory.setAttentionScore('resume-session', 2, 0.9)).toBe(true); // 2
    expect(workingMemory.getSessionEventCounter('resume-session')).toBeGreaterThanOrEqual(1);

    const rows = workingMemory.getWorkingMemory('resume-session');
    const resumedRow = rows.find((row) => row.memory_id === 2);
    expect(resumedRow?.event_counter).toBe(2);

    const promptContext = workingMemory.getSessionPromptContext('resume-session', 0.05, 5);
    expect(promptContext.length).toBeGreaterThan(0);
    expect(promptContext[0].attentionScore).toBeGreaterThan(0.05);
  });
});

// B5: no-session callers with distinct governance scopes must not collapse onto
// one shared process-wide session bucket, while the unscoped single-user path
// keeps stable resume continuity.
describe('B5 no-session continuity anchor isolation', () => {
  const baseArgs = { input: 'x' } as Parameters<typeof resolveNoSessionAnchor>[0];
  let savedEnv: string | undefined;

  beforeEach(() => {
    savedEnv = process.env.SPECKIT_MEMORY_SESSION_ID;
    delete process.env.SPECKIT_MEMORY_SESSION_ID;
  });

  afterEach(() => {
    if (savedEnv === undefined) {
      delete process.env.SPECKIT_MEMORY_SESSION_ID;
    } else {
      process.env.SPECKIT_MEMORY_SESSION_ID = savedEnv;
    }
  });

  it('unscoped no-session callers share the stable process-wide anchor', () => {
    expect(resolveNoSessionAnchor({ ...baseArgs })).toBe(PROCESS_MEMORY_SESSION_ID);
    expect(resolveNoSessionAnchor({ ...baseArgs })).toBe(PROCESS_MEMORY_SESSION_ID);
  });

  it('distinct scopes derive distinct anchors (no cross-contamination)', () => {
    const userA = resolveNoSessionAnchor({ ...baseArgs, userId: 'alice' });
    const userB = resolveNoSessionAnchor({ ...baseArgs, userId: 'bob' });
    expect(userA).not.toBe(userB);
    // Scoped anchors are still distinct from the bare process-wide id.
    expect(userA).not.toBe(PROCESS_MEMORY_SESSION_ID);
    expect(userB).not.toBe(PROCESS_MEMORY_SESSION_ID);
  });

  it('identical scope derives a stable anchor (continuity preserved)', () => {
    const first = resolveNoSessionAnchor({ ...baseArgs, tenantId: 'acme', userId: 'alice' });
    const second = resolveNoSessionAnchor({ ...baseArgs, tenantId: 'acme', userId: 'alice' });
    expect(first).toBe(second);
  });

  it('explicit SPECKIT_MEMORY_SESSION_ID overrides scope derivation', () => {
    process.env.SPECKIT_MEMORY_SESSION_ID = 'env-pinned-session';
    expect(resolveNoSessionAnchor({ ...baseArgs, userId: 'alice' })).toBe('env-pinned-session');
  });
});
