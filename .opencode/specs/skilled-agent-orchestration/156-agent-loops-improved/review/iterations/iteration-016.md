## Dimension

traceability - test adequacy: atomic-state, loop-lock, sleep, and jsonl-repair crash/race/edge coverage

## Files Reviewed

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:1` - full implementation
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:1` - full implementation
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts:1` - full implementation
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:1` - full implementation
- `.opencode/skills/deep-loop-runtime/tests/unit/atomic-state.vitest.ts:1` - full test file
- `.opencode/skills/deep-loop-runtime/tests/unit/loop-lock.vitest.ts:1` - full test file
- `.opencode/skills/deep-loop-runtime/tests/unit/sleep.vitest.ts:1` - full test file
- `.opencode/skills/deep-loop-runtime/tests/unit/jsonl-repair.vitest.ts:1` - full test file
- `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:1` - directly coupled JSONL merge lock
- `.opencode/skills/deep-loop-runtime/tests/unit/cli-guards-writer-lock.vitest.ts:1` - directly coupled writer-lock coverage
- `.opencode/skills/deep-loop-runtime/scripts/loop-lock.cjs:1` - loop-lock CLI adapter contract
- `.opencode/skills/deep-loop-runtime/tests/unit/loop-lock-cli.vitest.ts:1` - loop-lock CLI adapter coverage
- `.opencode/commands/deep/assets/deep_research_auto.yaml:416` - appendJsonlIfChangedAtomic status-ledger call site
- `.opencode/commands/deep/assets/deep_research_auto.yaml:1143` - appendJsonlIfChangedAtomic progress call site
- `.opencode/commands/deep/assets/deep_research_auto.yaml:1356` - appendJsonlIfChangedAtomic terminal call site
- `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:100` - mergeJsonlUnderLock producer shape
- `.opencode/skills/deep-loop-runtime/feature_catalog/04--state-safety/atomic-state-serialize-diff.md:1` - coupled feature/test traceability
- `.opencode/skills/deep-loop-runtime/feature_catalog/04--state-safety/jsonl-lock-held-merge.md:1` - coupled feature/test traceability

## Findings by Severity

### P0

None.

### P1

#### R16-P1-001 - `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:370` - Corrupt existing lock files are neither reclaimable nor reported accurately

Claim: A crash or partial write that leaves an empty/malformed lock file can permanently block acquisition instead of being reclaimed or surfaced as a corrupt lock.

Why: `readLoopLock()` collapses any read/parse failure to `null` at `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:168`. `acquireLoopLockFileOnly()` then treats that as "no holder" at `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:370`, tries the fresh exclusive create path at `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:375`, and `writeLoopLockExclusive()` returns `false` on `EEXIST` at `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:195`. The caller then returns `{ acquired: false, holder: current ?? lock }` at `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:379`, where `current` is still `null` and `lock` is the attempted new owner, not the actual corrupt file. The stale-reclaim path only runs when a parsed `holder` exists at `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:383`, so malformed files have no recovery path.

Counterevidence sought: I checked the loop-lock Vitest coverage for empty, half-written, non-JSON, or unreadable existing lock files. The tests cover fresh contention at `.opencode/skills/deep-loop-runtime/tests/unit/loop-lock.vitest.ts:143`, live heartbeat/release at `.opencode/skills/deep-loop-runtime/tests/unit/loop-lock.vitest.ts:177`, TTL/dead-owner stale checks at `.opencode/skills/deep-loop-runtime/tests/unit/loop-lock.vitest.ts:225`, and dead-pid reclaim at `.opencode/skills/deep-loop-runtime/tests/unit/loop-lock.vitest.ts:234`; no test writes a corrupt lock and asserts recovery or a deterministic hard error.

Alternative explanation: This could be intentional fail-closed behavior for corrupt locks. If so, returning the attempted owner as the holder is still misleading, and the CLI status path also maps unparsable existing files to `exists: false` at `.opencode/skills/deep-loop-runtime/scripts/loop-lock.cjs:181`, so operators do not get a reliable recovery signal.

Final severity: P1.

Confidence: high.

Downgrade trigger: Downgrade if the lock contract explicitly requires malformed lock files to block forever until manual deletion and both library/CLI tests pin that fail-closed behavior with accurate holder/status reporting.

Suggested fix direction: Distinguish missing from unparsable existing locks. For unparsable files, either quarantine/reclaim after an mtime grace window using the same rename-plus-exclusive-create discipline as stale reclaim, or return an explicit corrupt-lock error with path and recovery instructions. Add Vitest cases for empty, partial JSON, and non-JSON lock files.

#### R16-P1-002 - `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:370` - Deferred writer timer flush can create an unhandled rejection

Claim: The normal debounce-driven flush path drops write failures on the floor as unhandled promise rejections, which can crash the process or hide a failed state write.

Why: `write()` schedules a debounce timer at `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:428`. When the timer fires, it calls `void drainPendingWrites()` at `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:370` without a `catch` or stored error state. Inside that async drain, `writeTextAtomic()` is called at `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:397`; `writeTextAtomic()` rethrows write/fsync/rename failures at `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:463`. A directory target, permissions error, ENOSPC, or fsync failure on the timer path therefore rejects a promise nobody observes.

Counterevidence sought: I checked `atomic-state.vitest.ts` for a deferred-writer failure path or `process.on('unhandledRejection')` assertion. The tests cover direct atomic cleanup failure at `.opencode/skills/deep-loop-runtime/tests/unit/atomic-state.vitest.ts:91`, deferred success/coalescing at `.opencode/skills/deep-loop-runtime/tests/unit/atomic-state.vitest.ts:223`, dirty-again drains at `.opencode/skills/deep-loop-runtime/tests/unit/atomic-state.vitest.ts:252`, `flushNow()` success at `.opencode/skills/deep-loop-runtime/tests/unit/atomic-state.vitest.ts:279`, and `close()` success at `.opencode/skills/deep-loop-runtime/tests/unit/atomic-state.vitest.ts:305`; none exercises automatic timer-flush failure.

Alternative explanation: Callers may usually call `flushNow()` or `close()` during orderly shutdown, where errors are awaitable. That does not cover the documented default debounce behavior, where `write()` itself returns `void` and the timer is the normal flush mechanism.

Final severity: P1.

Confidence: high.

Downgrade trigger: Downgrade if runtime callers are changed so the timer path is never used, or if the writer installs a tested error sink that makes timer failures observable and non-crashing.

Suggested fix direction: Catch timer-drain failures, store the last error on the writer, and make `flushNow()`/`close()` rethrow it; optionally expose an `onError` hook for background flush failures. Add a Vitest case that targets a directory or mocked failing `writeTextAtomic` through the debounce timer and asserts no unhandled rejection plus observable failure state.

### P2

#### R16-P2-001 - `.opencode/skills/deep-loop-runtime/tests/unit/atomic-state.vitest.ts:155` - Diff-gated JSONL append has no multi-writer coverage despite read-rewrite semantics

Why: `appendJsonlIfChangedAtomic()` reads the whole current file at `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:324`, builds `currentContent + row`, and replaces the file at `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:328`. That is safe for a single writer but can lose a row if two writers read the same old content and then race their replacements. The status-ledger call sites in `.opencode/commands/deep/assets/deep_research_auto.yaml:444`, `.opencode/commands/deep/assets/deep_research_auto.yaml:1199`, and `.opencode/commands/deep/assets/deep_research_auto.yaml:1420` currently appear single-loop-gated, so I am not escalating this as a demonstrated normal-use data loss bug. The test at `.opencode/skills/deep-loop-runtime/tests/unit/atomic-state.vitest.ts:155` only calls the helper sequentially in-process with fresh caches.

Suggested fix direction: Either document and type/name this helper as single-writer only, or protect it with a writer lock/O_APPEND-style append strategy. Add a cross-process test with two different rows and a barrier; if single-writer is the intended contract, add an assertion around the status-ledger caller/loop-lock gating instead.

#### R16-P2-002 - `.opencode/skills/deep-loop-runtime/tests/unit/jsonl-repair.vitest.ts:152` - The append-boundary "concurrent" test is sequential

Why: The test is named `keeps concurrent append records parseable at record boundaries` at `.opencode/skills/deep-loop-runtime/tests/unit/jsonl-repair.vitest.ts:152`, but it launches the left writer with `spawnSync()` at `.opencode/skills/deep-loop-runtime/tests/unit/jsonl-repair.vitest.ts:166` and only starts the right writer after the first process exits at `.opencode/skills/deep-loop-runtime/tests/unit/jsonl-repair.vitest.ts:167`. That means it does not exercise the race/record-boundary condition its title claims. The lock-held merge path does have real parallel coverage at `.opencode/skills/deep-loop-runtime/tests/unit/jsonl-repair.vitest.ts:186`, but the bare `appendJsonlRecord()` path at `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:188` is only tested sequentially.

Suggested fix direction: Use `spawn()` plus a shared barrier file or IPC start signal, wait with `Promise.all`, and increase record count/payload size enough to make interleaving failures observable. If concurrent bare append is not a supported contract, rename the test to sequential append and document that concurrent salvage must use `mergeJsonlUnderLock()`.

## Verdict

FAIL

## Notes

- `sleep.vitest.ts` covers requested sleep edge behavior reasonably well: chunking, already-aborted signals, active abort cleanup, listener cleanup per chunk, and composed signals through `AbortSignal.any`.
- `jsonl-repair.vitest.ts` has meaningful crash/tail coverage for partial-line repair and real multi-process coverage for `mergeJsonlUnderLock()`, but not for the bare append-boundary case.
- Reviewed source files read-only; only this iteration markdown and the matching delta JSONL were written.
