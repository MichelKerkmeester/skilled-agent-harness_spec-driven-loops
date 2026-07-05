# Deep Review Findings — Iteration 7

**Review scope:** Edge cases + adversarial sweep  
**Focus:** References accuracy, graph-metadata.json, signal handling, version drift  
**Cumulative findings:** F-001 through F-026 (0 P0 / 13 P1 / 11 P2)  
**New findings this iteration:** F-027 through F-030 (0 P0 / 2 P1 / 2 P2)

---

## F-027: state_format.md documents non-existent PostDispatchValidateInput field (P1)

**File:** `.opencode/skills/deep-loop-runtime/references/state_format.md`  
**Line:** 129-136  
**Evidence:**

The reference documents this interface:

```typescript
type PostDispatchValidateInput = {
  iterationFile: string;
  stateLogPath: string;
  deltaPath?: string;
  recipeConfig?: PostDispatchRecipeConfig;
  executorKind?: ExecutorKind;
};
```

However, the actual implementation in `lib/deep-loop/post-dispatch-validate.ts` (lines 16-31) defines:

```typescript
export type PostDispatchValidateInput = {
  iterationFile: string;
  stateLogPath: string;
  previousStateLogSize: number;        // ← missing from docs
  requiredJsonlFields: string[];       // ← missing from docs
  executorKind?: ExecutorKind;
  deltaFilePath?: string;              // ← docs call this deltaPath
  recipeConfig?: PostDispatchRecipeConfig;
};
```

**Impact:** The reference is missing two required fields (`previousStateLogSize`, `requiredJsonlFields`) and has the wrong name for `deltaFilePath` (docs say `deltaPath`). This misleads consumers about the actual contract.

**Recommendation:** Update `state_format.md` §5 to match the actual interface definition in `post-dispatch-validate.ts`.

---

## F-028: state_format.md omits acquiredAtIso from LoopLockData (P1)

**File:** `.opencode/skills/deep-loop-runtime/references/state_format.md`  
**Line:** 94-101  
**Evidence:**

The reference documents this serialized lock file mapping:

| JSON field | Runtime field | Meaning |
|---|---|---|
| `owner_pid` | `ownerPid` | Process id that owns the lock. |
| `executor_kind` | `executorKind` | Executor associated with the writer. |
| `session_id` | `sessionId` | Loop session namespace. |
| `acquired_at_iso` | `acquiredAtIso` | Acquisition timestamp. |
| `last_heartbeat_iso` | `lastHeartbeatIso` | Last heartbeat timestamp. |
| `ttl_ms` | `ttlMs` | Lock TTL in milliseconds. |

However, the actual `LoopLockData` interface in `lib/deep-loop/loop-lock.ts` (lines 10-17) defines:

```typescript
export interface LoopLockData {
  ownerPid: number;
  startedAtIso: string;      // ← docs call this acquiredAtIso
  ttlMs: number;
  lastHeartbeatIso: string;
  packetId: string;          // ← missing from docs entirely
  runtimeKind: ExecutorKind | 'main';  // ← docs call this executorKind
}
```

The serialized form (lines 33-40) uses `started_at_iso`, not `acquired_at_iso`, and includes `packet_id` which is not documented.

**Impact:** The reference field names don't match the actual implementation, and the `packetId` field is completely missing. This breaks consumer expectations about lock file structure.

**Recommendation:** Update `state_format.md` §4 to match the actual `LoopLockData` interface and `SerializedLoopLockData` type in `loop-lock.ts`.

---

## F-029: Scripts lack explicit SIGTERM/SIGINT handlers (P2)

**File:** `.opencode/skills/deep-loop-runtime/scripts/*.cjs`  
**Lines:** All four scripts (convergence.cjs, upsert.cjs, query.cjs, status.cjs)  
**Evidence:**

All four scripts follow this pattern:
1. Parse args
2. Import TypeScript libraries
3. Open DB via `getDb()`
4. Execute operation
5. Close DB in `finally` block
6. Exit with appropriate code

None of the scripts register explicit `process.on('SIGTERM', ...)` or `process.on('SIGINT', ...)` handlers. If a script receives a termination signal while the DB is open, the `finally` block may not execute, potentially leaving SQLite handles open.

**Impact:** In normal operation, the `finally` block ensures DB closure. However, signal handling is a best practice for long-running processes or when graceful shutdown is required. The current implementation relies on Node.js default behavior, which may not guarantee cleanup on all signals.

**Recommendation:** Consider adding signal handlers to ensure DB closure on SIGTERM/SIGINT, or document that the scripts are expected to be short-lived and signal-safe by virtue of their execution model.

---

## F-030: Post-dispatch validate TODO comment is outdated (P2)

**File:** `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`  
**Line:** 371  
**Evidence:**

```typescript
return /TODO|NotImplementedError|pass\s+#\s*placeholder|\[\.\.\. truncated|\.\.\. rest of|\.\.\. more/i.test(code);
```

The comment references TODO as a pattern to detect placeholder code. This is a legitimate heuristic for the validator's purpose, but the presence of "TODO" in the regex suggests this was added as a temporary measure and may need refinement.

**Impact:** Low. The regex serves its purpose (detecting incomplete implementation), but the TODO pattern may catch legitimate TODO comments in production code that are not actually placeholders.

**Recommendation:** Either (a) remove TODO from the regex if it's too broad, or (b) document why TODO is considered a placeholder signal in the validator context.

---

## Summary

**Iteration 7 findings:** 4 total (0 P0 / 2 P1 / 2 P2)

- **F-027 (P1):** `state_format.md` documents non-existent `PostDispatchValidateInput` fields and has wrong field names
- **F-028 (P1):** `state_format.md` omits `packetId` and uses wrong field name for `startedAtIso` in lock data
- **F-029 (P2):** Scripts lack explicit SIGTERM/SIGINT handlers for graceful DB closure
- **F-030 (P2):** Post-dispatch validate TODO pattern in placeholder detection regex may be overbroad

**Convergence status:** 2 iterations with low-severity findings (all P1/P2). The documentation inaccuracies in `state_format.md` should be corrected, but they do not affect runtime behavior. The signal handling gap is a hardening opportunity rather than a correctness issue.

**Cumulative status:** 0 P0 / 15 P1 / 13 P2 across 7 iterations. The codebase is converging with only documentation and hardening gaps remaining.
