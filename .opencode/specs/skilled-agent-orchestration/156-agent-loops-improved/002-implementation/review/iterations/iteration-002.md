## Dimension

correctness: concurrency races, atomicity, crash-safety (temp+fsync+rename, lock heartbeat/single-flight, partial writes)

## Files Reviewed

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:1` (full file)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:1` (full file)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts:1` (full file)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:1` (full file)
- `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:363` (writer-lock contract)
- `.opencode/skills/deep-loop-runtime/scripts/loop-lock.cjs:167` (lock CLI adapter)
- `.opencode/commands/deep/assets/deep_research_auto.yaml:444` (status-ledger append caller)
- `.opencode/commands/deep/assets/deep_research_auto.yaml:1199` (status-ledger append caller)
- `.opencode/commands/deep/assets/deep_research_auto.yaml:1420` (status-ledger append caller)
- `.opencode/skills/deep-loop-runtime/tests/unit/atomic-state.vitest.ts:155` (append helper coverage)

## Findings by Severity

### P0

#### R2-P0-001 - Lock refresh can overwrite a newly reclaimed holder

- File: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:505`
- Why: `refreshLoopLock()` reads the current holder and checks only `ownerPid` at `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:505`, then blindly rewrites the lock with `writeLoopLockAtomic()` at `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:511`. A stale reclaimer can concurrently move the old lock aside at `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:230` and create a new exclusive lock at `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:240`. Interleaving: old owner reads its stale lock, new owner reclaims and acquires, old owner resumes and renames its refreshed temp file over the new lock. The CLI refresh path passes only `ownerPid` at `.opencode/skills/deep-loop-runtime/scripts/loop-lock.cjs:195`, so there is no acquisition nonce or generation to make the refresh conditional.
- Suggested fix direction: Add an acquisition nonce/generation to `LoopLockData`, return it to the holder, and require refresh/release to prove the same lock identity under a compare-and-swap style critical section. Alternatively serialize refresh and reclaim through the same writer lock so a stale owner cannot rewrite after its lock has been moved.
- Claim: A delayed heartbeat from a stale-but-still-running owner can resurrect that owner over a newer claimant, allowing two loop hosts to believe they own the same packet lock.
- Evidence refs: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:230`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:240`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:505`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:511`, `.opencode/skills/deep-loop-runtime/scripts/loop-lock.cjs:195`
- Counterevidence sought: I checked the acquire/reclaim path and CLI adapter for a lock identity token beyond PID; none is persisted or passed through refresh. Host-local single-flight is optional and the CLI acquire path calls `acquireLoopLock()` without it.
- Alternative explanation: The workflow may normally kill or abandon a stale owner before another process reclaims the lock.
- Final severity: P0
- Confidence: high
- Downgrade trigger: Downgrade only if workflow evidence proves a process whose heartbeat exceeded the stale threshold cannot ever resume and call `refreshLoopLock()`.

### P1

#### R2-P1-001 - Diff-gated JSONL append can lose concurrent rows

- File: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:324`
- Why: `appendJsonlIfChangedAtomic()` reads the entire target file at `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:324`, builds a new whole-file payload, then replaces the file with `writeTextAtomic()` at `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:328`. There is no lock or reread inside a critical section. Two processes appending different rows can both read the same prefix, both pass the fingerprint checks at `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:313` and `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:317`, and then the last rename wins, dropping the other row. The helper is used by command subprocesses for the status ledger at `.opencode/commands/deep/assets/deep_research_auto.yaml:444`, `.opencode/commands/deep/assets/deep_research_auto.yaml:1199`, and `.opencode/commands/deep/assets/deep_research_auto.yaml:1420`.
- Suggested fix direction: Put the read-last-fingerprint and append under the shared writer lock, or switch to true append semantics (`O_APPEND`) plus a locked duplicate check. Add a two-process test where both writers append distinct rows to the same ledger.
- Claim: The "append" helper is atomic as a replace, not atomic as an append; concurrent writers can silently lose a valid JSONL row.
- Evidence refs: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:313`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:317`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:324`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:328`, `.opencode/commands/deep/assets/deep_research_auto.yaml:444`, `.opencode/commands/deep/assets/deep_research_auto.yaml:1199`, `.opencode/commands/deep/assets/deep_research_auto.yaml:1420`
- Counterevidence sought: I checked the unit coverage around `.opencode/skills/deep-loop-runtime/tests/unit/atomic-state.vitest.ts:155`; it verifies duplicate suppression and changed-row appends in one process, but not concurrent writers.
- Alternative explanation: Current workflow callers may be serialized by an outer loop lock, making the helper effectively single-writer in deployed paths.
- Final severity: P1
- Confidence: med
- Downgrade trigger: Downgrade if every current and intended caller is proven to hold a mutually exclusive lock for the target ledger before calling this helper, and the helper is documented as single-writer only.

### P2

#### R2-P2-001 - JSONL merge writer omits fsync before rename

- File: `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:140`
- Why: `writeJsonlRecordsAtomic()` writes a temp file at `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:141` and renames it at `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:142`, but it never fsyncs the temp file or parent directory. The shared text writer in `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:456` does the temp write, temp fsync, rename, and parent-directory fsync sequence. A host or power crash after the merge returns can still lose the supposedly committed merged state log.
- Suggested fix direction: Reuse `writeTextAtomic()` for the JSONL merge payload, or copy its temp fsync plus parent-directory fsync sequence into `writeJsonlRecordsAtomic()`.
- Claim: The JSONL merge path is atomic against torn readers, but it does not provide the crash durability implied by the runtime's temp+fsync+rename state-safety contract.
- Evidence refs: `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:140`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:141`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:142`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:456`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:457`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:458`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:460`
- Counterevidence sought: I looked for an fsync in `writeJsonlRecordsAtomic()` and in its caller `mergeJsonlUnderLock()`; the lock protects concurrency but does not add durability.
- Alternative explanation: The intended guarantee may be process-crash safety only, not host/power-loss durability.
- Final severity: P2
- Confidence: high
- Downgrade trigger: Drop if the JSONL merge contract explicitly excludes fsync durability and only promises readers never see partial files.

## Verdict (FAIL|CONDITIONAL|PASS)

FAIL

## Notes

Iteration 1 already reported malformed lock-file recovery and locked-merge versus unlocked-append coordination, so I did not repeat those. `sleep.ts` did not produce a concrete correctness finding for this pass.
