# Iteration 001 — correctness

## Metadata
- Iteration: 1 of 10
- Dimension: correctness
- Timestamp: 2026-05-22T16:41:18Z
- Findings this iter: 6

## Summary
Reviewed the phase `003`-`013` lifecycle surfaces with a correctness focus: deep-loop locks and JSONL repair, Spec Kit runtime shutdown hooks, process inventory/sweep helpers, CocoIndex cancel/update lifecycle, and Code Graph owner leases. The main failures are ownership primitives that use atomic replacement but not atomic acquisition, plus lifecycle paths that can turn failed or interrupted work into apparently clean state.

## New Findings

### P0 — Blockers
None

### P1 — Required

#### Deep-loop lock can be double-acquired during concurrent startup
- **Fingerprint:** `correctness:deep-loop-lock:read-then-rename-double-acquire`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts:107`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts:149`
- **Evidence:** `acquireLoopLock` reads the current holder, then unconditionally calls `writeLoopLockAtomic(lockPath, data)`. That writer creates an exclusive temp file, but the claim itself is `renameSync(tempPath, lockPath)`, which overwrites the target.
- **Reasoning:** Two review/research runners starting at the same time can both observe no lock or a stale lock, both write temp files, and both return `{ acquired: true }`; the later rename wins on disk, but the earlier process has already entered the critical section. That violates the packet-scoped single-run contract and reopens the state corruption race the phase was meant to close.
- **Suggested fix:** Make acquisition itself exclusive. Use `openSync(lockPath, 'wx')` for the no-holder path, or a compare-and-swap pattern that validates the holder identity immediately before replacement and treats an intervening live holder as `acquired: false`. Add a concurrency test with two simultaneous acquire attempts.

#### Code Graph owner lease can be double-acquired
- **Fingerprint:** `correctness:code-graph-owner-lease:read-then-rename-double-acquire`
- **File(s):** `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:97`, `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:208`, `.opencode/bin/mk-code-index-launcher.cjs:209`, `.opencode/bin/mk-code-index-launcher.cjs:267`
- **Evidence:** The TypeScript helper reads `existing` and then calls `writeOwnerLeaseAtomic(leasePath, lease)`. The launcher mirror does the same through `readOwnerLeaseFile()` followed by `writeOwnerLeaseFile()`. Both writers atomically replace the final lease file rather than atomically claiming it.
- **Reasoning:** The lease is the single-writer gate for a canonical DB directory. With two launchers racing from an absent or reclaimable owner file, both can report acquisition success before the bootstrap lock later serializes only build work. During that window, lease ownership and process messages can be inconsistent, and one launcher can proceed believing it owns the DB while another has overwritten the owner file.
- **Suggested fix:** Apply the same exclusive-acquire fix in both implementations, ideally by sharing a tiny lockfile/lease acquisition protocol. The CJS launcher needs the same semantics because it runs before the TypeScript build can be assumed.

#### Runtime signal hooks run cleanup but do not terminate the process
- **Fingerprint:** `correctness:shutdown-hooks:signals-run-hooks-without-exit`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts:119`
- **Evidence:** `installProcessHooks()` registers `process.once('SIGTERM', () => { void runShutdownHooks(); });` and the same shape for `SIGINT`, without exiting, re-sending the signal, or restoring default signal behavior.
- **Reasoning:** In Node, installing a signal listener replaces the default termination behavior for that signal. A process with registered shutdown hooks can receive `SIGTERM`, run cleanup, and then continue serving if other handles remain. That breaks operator expectations and can leave exactly the long-lived daemon state this arc is trying to bound.
- **Suggested fix:** After `runShutdownHooks()` settles, exit with the conventional signal code or restore the default handler and re-send the signal. Keep the existing reentrancy guard, but make signal-triggered shutdown terminal.

#### Pre-dispatch audit reads can crash on the corrupt JSONL tail they added
- **Fingerprint:** `correctness:deep-loop-jsonl:pre-dispatch-audit-crashes-on-corrupt-tail`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:330`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:370`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:404`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/jsonl-repair.ts:64`
- **Evidence:** `findLatestIterationRecordIndex()` and `findLatestIterationEvent()` call `JSON.parse(line)` without repair or per-line error handling. `writeFirstRecordExecutor()` and `emitDispatchFailure()` call those readers directly, while `repairJsonlTail()` is only invoked in the post-dispatch validator.
- **Reasoning:** If a previous process dies mid-append, the next dispatch may need to write `iteration_start` or `dispatch_failure` before post-dispatch validation runs. Those pre-dispatch paths can hit the corrupt tail first and throw, preventing the repair helper from ever doing the recovery it was added for.
- **Suggested fix:** Call `repairJsonlTail(stateLogPath)` before every state-log read in `executor-audit.ts`, or make the latest-record scanners skip/repair only trailing corrupt lines. Add a regression where an unterminated JSON tail exists before `writeFirstRecordExecutor()`.

#### Cancelled CocoIndex updates still sync FTS and mark initial indexing done
- **Fingerprint:** `correctness:cocoindex-project-update:cancelled-index-marked-initial-done`
- **File(s):** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:61`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:491`
- **Evidence:** `Project.update_index()` raises `asyncio.CancelledError()` when `cancel_event` is set, but its `finally` block still opens the target DB, runs `sync_fts_from_code_chunks(conn)`, clears stats, and sets `_initial_index_done = True`.
- **Reasoning:** The daemon correctly propagates cancellation from `_run_index()`, but the project-level finally block converts cancelled or failed indexing into a synchronized, initial-index-done project. Search can then proceed against partial or stale state, and callers lose the ability to distinguish "index completed" from "index was cancelled after a partial watch cycle."
- **Suggested fix:** Track successful completion separately. Run FTS sync and set `_initial_index_done` only after the update handle completes normally. On cancellation/failure, clear transient stats but leave a failure/cancel status that `wait_for_indexing_done()` and status responses can expose without pretending the initial index succeeded.

#### Process inventory failures are reported as an empty clean inventory
- **Fingerprint:** `correctness:process-memory-harness:ps-failure-reported-as-empty-inventory`
- **File(s):** `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:181`, `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:517`, `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:526`
- **Evidence:** `readCommand()` converts a failed `ps` call into a `# command_failed...` text line. `parsePsOutput()` ignores lines that do not match the process regex, and `buildHarnessSnapshot()` then emits `processCount: processes.length` with no process-inventory warning or failure state.
- **Reasoning:** In a sandbox or permission-denied host, the harness can report zero processes, zero project daemons, and zero termination candidates even though enumeration failed. Phase 010 already saw live inventory return zero rows in this sandbox; without an explicit warning, operators and benchmark scripts can mistake telemetry failure for a clean process table.
- **Suggested fix:** Add a first-class process inventory status or warning when `ps` fails, and propagate it through `HarnessSnapshot`, `process-sweep`, and benchmark gates. Treat failed enumeration as blocked/degraded, not as an empty inventory.

### P2 — Suggestions
None

## Convergence Signal
- New findings this iter: 6
- Cumulative finding count after iter: 6
- New-findings ratio: 1.00
- Continue / converged signal: `continue`

## Files Touched (this iter)
- `review/deep-review-strategy.md`
- `review/iterations/iteration-001.md`
- `review/deltas/iter-001.jsonl`
- `review/deep-review-findings-registry.json`
- `review/deep-review-state.jsonl`
- `review/deep-review-dashboard.md`
