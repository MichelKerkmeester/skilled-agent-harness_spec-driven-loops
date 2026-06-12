// ────────────────────────────────────────────────────────────────
// MODULE: DB Lock
// ────────────────────────────────────────────────────────────────
// @public — scripts should import from here, not lib/ internals.
// Single-writer lock for any standalone process that opens the
// canonical memory database read-write. Acquire BEFORE the
// better-sqlite3 open; a refusal means a live daemon (or another
// maintenance script) owns the database — route the work through MCP
// or stop the daemon first, never open a second writer.

export {
  acquire_db_instance_lock,
  acquireDbInstanceLock,
  release_db_instance_lock,
  releaseDbInstanceLock,
  release_db_instance_locks,
  releaseDbInstanceLocks,
  held_db_instance_lock,
  heldDbInstanceLock,
  DB_LOCK_DISABLE_ENV,
  type DbInstanceLockHandle,
  type AcquireDbInstanceLockOptions,
} from '../lib/search/db-instance-lock.js';
export { VectorIndexError, VectorIndexErrorCode } from '../lib/search/vector-index-types.js';
