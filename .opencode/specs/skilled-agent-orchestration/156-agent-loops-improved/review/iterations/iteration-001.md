## Dimension

correctness: logic correctness & edge cases

## Files Reviewed

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:1` (full file)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:1` (full file)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts:1` (full file)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:1` (full file)
- `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:363` (writer-lock contract)
- `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:135` (JSONL merge caller)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:613` (JSONL append caller)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1315` (JSONL append caller)
- `.opencode/skills/deep-loop-runtime/tests/unit/loop-lock.vitest.ts:123` (lock coverage)
- `.opencode/skills/deep-loop-runtime/tests/unit/jsonl-repair.vitest.ts:88` (JSONL coverage)

## Findings by Severity

### P0

None.

### P1

#### R1-P1-001 - Malformed lock files are never reclaimed

- File: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:370`
- Why: `readLoopLock()` returns `null` for any unreadable or unparsable lock at `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:168`. `acquireLoopLockFileOnly()` then treats that as "no holder", but if the malformed lock file still exists, `writeLoopLockExclusive()` hits `EEXIST` and returns `false`; the acquire path returns `{ acquired: false, holder: current ?? lock }` at `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:379` instead of aging out or reclaiming the corrupt file. A crash between exclusive open and writing the JSON body at `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:195` can leave exactly this empty/partial lock.
- Suggested fix direction: Distinguish "missing lock" from "present but unparsable lock". For the latter, use mtime plus a grace/TTL window, then reclaim via the same rename-and-exclusive-create path used for valid stale holders.
- Claim: An empty or malformed `.deep-loop.lock` can permanently block subsequent loop acquisition.
- Evidence refs: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:168`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:195`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:370`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:379`
- Counterevidence sought: I checked the lock tests and found coverage for valid live holders, valid dead-PID holders, and TTL-expired holders, but no malformed or empty lock-file recovery case.
- Alternative explanation: The code may be intentionally fail-closed for unparsable locks to avoid deleting an unknown file.
- Final severity: P1
- Confidence: high
- Downgrade trigger: Downgrade if the lock contract explicitly requires malformed lock files to block forever until manual operator deletion.

#### R1-P1-002 - Locked JSONL merge can overwrite unlocked appends

- File: `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:188`
- Why: `appendJsonlRecord()` appends directly with `appendFileSync()` at `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:188` and does not acquire the writer lock. `mergeJsonlUnderLock()` acquires `${path}.lock`, reads the current file, then rewrites the whole JSONL file via temp+rename at `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:208`. If a plain append lands after `readJsonlRecords()` and before the rename, the merge writes a snapshot that does not include that appended record. This is plausible because salvage uses `mergeJsonlUnderLock()` for the state log while other runtime paths use the plain append helper for state-log events.
- Suggested fix direction: Make all writers to a given JSONL path share the same lock, or make merge append-only rather than read/whole-file-rewrite. At minimum, document and enforce that `appendJsonlRecord()` must not target files that can also be merged under lock.
- Claim: A state-log event can be silently lost when a locked merge races an unlocked append to the same JSONL file.
- Evidence refs: `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:188`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:208`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:213`, `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:135`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:613`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1315`
- Counterevidence sought: I checked current tests; they cover concurrent merge writers and direct appends separately, but not a merge racing with a plain append against the same file.
- Alternative explanation: The orchestrator may serialize salvage and dispatch-validation/audit appends so these helpers never run concurrently against one path.
- Final severity: P1
- Confidence: med
- Downgrade trigger: Downgrade if the workflow contract proves `mergeJsonlUnderLock()` and `appendJsonlRecord()` are never concurrent for the same state log.

### P2

None.

## Verdict (FAIL|CONDITIONAL|PASS)

CONDITIONAL

## Notes

No P0 findings found. `atomic-state.ts` and `sleep.ts` did not produce a concrete correctness finding in this pass; the actionable risks are in lock recovery and JSONL writer coordination.
