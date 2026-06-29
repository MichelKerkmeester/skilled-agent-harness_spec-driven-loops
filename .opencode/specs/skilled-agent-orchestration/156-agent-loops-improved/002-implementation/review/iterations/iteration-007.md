# Dimension

correctness: error handling: fail-open vs fail-closed consistency, error taxonomy

# Files Reviewed

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:1-469`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:1-585`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts:1-95`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:1-217`
- `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:1-508`
- `.opencode/skills/deep-loop-runtime/scripts/loop-lock.cjs:1-219`
- `.opencode/skills/deep-loop-runtime/tests/unit/atomic-state.vitest.ts:1-339`
- `.opencode/skills/deep-loop-runtime/tests/unit/loop-lock.vitest.ts:1-340`
- `.opencode/skills/deep-loop-runtime/tests/unit/jsonl-repair.vitest.ts:1-250`
- `.opencode/skills/deep-loop-runtime/tests/unit/sleep.vitest.ts:1-92`

# Findings by Severity

## P0

None.

## P1

### R7-P1-001 - `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:254`

`writeStateAtomic()` fails open for top-level values that `JSON.stringify` cannot represent as JSON text. The function interpolates `JSON.stringify(data, null, 2)` directly, so `undefined`, a function, or a symbol becomes the literal file body `undefined\n` instead of throwing. That violates the documented JSON state contract and leaves the next reader with an unparsable state file.

Suggested fix direction: route `writeStateAtomic()` through the existing `serializePrettyState()` guard, or add the same `typeof serialized === 'string'` check before calling `writeTextAtomic()`.

### R7-P1-002 - `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:370`

The deferred writer's timer path drops the promise returned by `drainPendingWrites()`. When the background flush hits an ordinary filesystem error such as `ENOENT`, `EACCES`, or `ENOSPC`, the rejection is unhandled because the call is `void drainPendingWrites()`. Callers using `write()` only have no catch point, so a persistence failure can surface as an unhandled rejection or process crash instead of a typed/observable write failure.

Suggested fix direction: catch and retain the async flush error in the writer, expose it through `flushNow()`/`close()`, and avoid starting fire-and-forget drains without an error sink.

### R7-P1-003 - `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:168`

Malformed or empty lock files are treated as "no parsed holder" but still block acquisition forever. `readLoopLock()` collapses parse/read failures to `null`; then `acquireLoopLockFileOnly()` tries `openSync(..., 'wx')`, receives `EEXIST`, rereads `null`, and returns `acquired:false` with the contender's own lock data as `holder`. A crash after creating the lock file but before writing JSON can therefore leave an empty lock that is never TTL-reclaimed and misreports ownership.

Suggested fix direction: distinguish missing from corrupt/unreadable lock files. For corrupt existing locks, either fail with a typed corrupt-lock error or reclaim after a bounded grace/mtime window; never substitute the candidate lock as the holder.

## P2

### R7-P2-001 - `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:324`

`appendJsonlIfChangedAtomic()` performs append-by-read-modify-replace without a writer lock. Two processes appending different rows can both read the same old content and then each rewrite the whole file, so the later rename can silently drop the earlier row. The current tests cover serial appends only; the locked merge path in `jsonl-repair.ts` shows the safer pattern already exists.

Suggested fix direction: either make this helper single-process-only in its contract and tests, or move it to a locked append/merge implementation before production callers use it for cross-process ledgers.

# Verdict

CONDITIONAL

# Notes

No P0 found. The P1s are all fail-open/fail-closed consistency defects: invalid state serialization writes bad data, background flush errors escape taxonomy, and corrupt lock files become permanent blockers instead of typed/reclaimable lock states.
