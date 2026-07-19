// ───────────────────────────────────────────────────────────────
// MODULE: True-Citation Mining (session-stop glue)
// ───────────────────────────────────────────────────────────────
// Hook-side bridge for the Stage 1 true-citation emitter. The session-stop
// hook runs as a standalone process that does NOT initialize the in-memory
// vector index, so it cannot reuse the server's getDb() handle. This module
// owns the two hook-specific concerns the DB-agnostic emitter must not bake in:
//   1. opening the memory SQLite file by its resolved path, and
//   2. extracting assistant text turns from the transcript.
// It then hands both to the emitter, which mines the shown-but-unused negatives.
//
// Fully fail-safe and flag-gated: a no-op when SPECKIT_TRUE_CITATION_EMITTER is
// off, and any error is swallowed so transcript mining can never break the stop
// hook.
import Database from 'better-sqlite3';
import { getDbPath } from '../../lib/search/vector-index.js';
import { hookLog } from './shared.js';
import { parseAssistantTextTurns } from './claude-transcript.js';
import {
  emitTrueCitationsForSession,
  isTrueCitationEmitterEnabled,
  type TrueCitationEmitResult,
} from '../../lib/feedback/true-citation-emitter.js';

export interface RunTrueCitationEmitOptions {
  transcriptPath: string;
  sessionId: string;
}

/**
 * Mine the transcript for true citations and persist the used/not-used pairs.
 *
 * Returns the emit result (zeros when the flag is off, the DB is unavailable,
 * or nothing was minable). Opens a short-lived read/write SQLite connection:
 * the writes are tiny, idempotent (INSERT OR IGNORE), and isolated to the
 * shadow true_citation_events table, so opening a second connection from the
 * hook process is safe alongside the live server connection under WAL.
 */
export async function runTrueCitationEmit(
  options: RunTrueCitationEmitOptions,
): Promise<TrueCitationEmitResult> {
  const empty: TrueCitationEmitResult = { emitted: 0, used: 0, notUsed: 0 };
  if (!isTrueCitationEmitterEnabled()) return empty;

  let db: Database.Database | null = null;
  try {
    const assistantTurns = await parseAssistantTextTurns(options.transcriptPath);
    if (assistantTurns.length === 0) {
      return empty;
    }

    const dbPath = getDbPath();
    db = new Database(dbPath);

    const result = emitTrueCitationsForSession(db, assistantTurns, {
      sessionId: options.sessionId,
    });

    if (result.emitted > 0) {
      hookLog(
        'info',
        'session-stop',
        `True-citation emit: ${result.used} used + ${result.notUsed} not-used (${result.emitted} pairs)`,
      );
    }
    return result;
  } catch (err: unknown) {
    hookLog('warn', 'session-stop', `True-citation emit skipped: ${err instanceof Error ? err.message : String(err)}`);
    return empty;
  } finally {
    if (db) {
      try {
        db.close();
      } catch {
        // Best-effort close; nothing else holds this connection.
      }
    }
  }
}
