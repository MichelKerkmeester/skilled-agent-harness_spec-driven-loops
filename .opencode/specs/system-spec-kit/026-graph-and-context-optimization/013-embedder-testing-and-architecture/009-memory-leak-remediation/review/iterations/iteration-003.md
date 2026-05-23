# Iteration 003 — traceability

## Metadata
- Iteration: 3 of 10
- Dimension: traceability
- Timestamp: 2026-05-22T16:53:36Z
- Findings this iter: 6

## Summary
Reviewed the phase `003`-`013` requirement tables, implementation summaries, completion claims, and the corresponding test fixtures. The main traceability gaps are completion records that claim required behavior is covered while the shipped tests exercise only a narrower path, a synthetic helper-level surrogate, or a deferred operator check.

## New Findings

### P0 — Blockers
None

### P1 — Required

#### CLI dispatch branches bypass the supervised executor contract
- **Fingerprint:** `traceability:cli-dispatch:deep-review-branches-bypass-supervisor`
- **File(s):** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/003-cli-dispatch-containment-and-recursion-guards/spec.md:119`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:704`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml:704`, `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:444`
- **Evidence:** Phase 003 requires `All deep-loop CLI dispatch paths use one supervised spawn contract`. The deep-review auto/confirm Codex branches still invoke raw `codex exec` directly, and the shared sync helper uses `spawnSync` while the real process-group supervisor lives in the separate async helper.
- **Reasoning:** This is a spec-to-code traceability miss. The phase summary says the supervised spawn path was added, but the in-scope deep-review CLI branches do not route through it, so the "all dispatch paths" claim is not proven for the review workflow itself.
- **Suggested fix:** Route every deep-review CLI executor branch through the audited supervisor, preferably the async helper where process-group cleanup matters, or narrow the Phase 003 requirement and add an explicit matrix showing which workflows remain compatibility-only.

#### Concurrent lock coverage is only sequential single-process coverage
- **Fingerprint:** `traceability:deep-loop-lock:concurrent-fixture-is-sequential`
- **File(s):** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/spec.md:126`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/tasks.md:98`, `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/loop-lock.vitest.ts:63`, `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/loop-lock.vitest.ts:111`
- **Evidence:** REQ-002 requires concurrent same-packet runs to be blocked or safely resumed, and SC-001 calls for a `concurrent run` fixture. The tests named for this behavior call `acquireLoopLock()` twice in the same process, first before the second acquire and later after a release; no worker, child process, or barrier creates simultaneous acquisition.
- **Reasoning:** A sequential second acquire proves live-holder refusal, not the race window implied by "concurrent same-packet runs." This leaves the required concurrency evidence unproven, and it lines up with the separate correctness finding that acquisition itself is not atomic.
- **Suggested fix:** Add a true concurrent fixture with two workers or child processes synchronized before acquisition. Assert exactly one acquisition succeeds, the loser observes the winner, and the on-disk holder matches the successful owner.

#### Queued CocoIndex index work has no remove-project fixture
- **Fingerprint:** `traceability:cocoindex-remove:queued-index-work-untested`
- **File(s):** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/spec.md:118`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/tasks.md:107`, `.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_remove_project_lifecycle.py:37`, `.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_remove_project_lifecycle.py:119`
- **Evidence:** REQ-001 says `remove_project` cannot close resources under active explicit, load-time, or queued index work. The lifecycle tests cover remove-during-running work, load-time task cancellation, task-registry shutdown, and post-remove reuse, but there is no fixture where an index job is queued but not yet running when remove begins.
- **Reasoning:** Queued work is a distinct lifecycle state from active explicit work. Without that fixture, the completion claim covers only part of the requirement and can miss a close-before-started-job path.
- **Suggested fix:** Add a queued-work test using a single-worker executor or daemon queue: occupy the worker, enqueue a project index job, call remove, and assert project close waits until the queued job is canceled, marked complete, or explicitly excluded.

#### Runtime retention stress coverage uses synthetic maps only
- **Fingerprint:** `traceability:spec-memory-runtime:sc001-synthetic-workload-only`
- **File(s):** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/spec.md:133`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/tasks.md:95`, `.opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts:29`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/implementation-summary.md:134`
- **Evidence:** SC-001 asks for `Stress save/search/index workloads`, pending-job caps, retry abort, lease cleanup, timer shutdown, and audit rotation cap. The stress fixture constructs local `BoundedMap` / `TtlMap` instances named `saveRouting`, `searchSessions`, and `indexJobs`, then asserts their sizes; it does not drive the memory save, search, or index runtime paths.
- **Reasoning:** Helper-level map bounds are useful unit coverage, but they are not traceable evidence that the integrated save/search/index workloads use the caps correctly. The phase tasks also leave the REQ/SC completion criteria unchecked while the implementation summary marks the phase complete.
- **Suggested fix:** Add integration-level fixtures that exercise the actual memory save/search/index handlers or their owning queues under load, then assert the configured caps and cleanup hooks through observable runtime state.

#### Adapter RSS benchmark closes without required slope numbers
- **Fingerprint:** `traceability:adapter-rss-benchmark:required-numbers-deferred`
- **File(s):** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/spec.md:122`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/spec.md:128`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/implementation-summary.md:105`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/tasks.md:93`
- **Evidence:** REQ-001 requires reproducible RSS measurement over at least 50 iterations with numbers in `implementation-summary.md`; REQ-002 requires a P2/P1 severity decision with threshold and evidence link. The implementation summary records both live attempts as blocked and says severity is `Deferred to operator-run RSS evidence. No P2 hold or P1 escalation is asserted from sandbox data.`
- **Reasoning:** A documented blocker is honest, but it does not satisfy the written acceptance criteria. The tasks file broadened completion to allow operator deferral, while the spec still requires numbers and a decision row, so the phase can be marked complete without the requirement being met.
- **Suggested fix:** Either keep the phase open until operator-run numbers are recorded, or amend the spec to make `deferred-to-operator` an explicit accepted terminal state with a follow-on owner and validation gate.

#### SC-003 reconnect success is modeled, not manually verified
- **Fingerprint:** `traceability:owner-lease:sc003-parent-disconnect-not-verified`
- **File(s):** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/spec.md:153`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/implementation-summary.md:146`, `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:265`
- **Evidence:** SC-003 requires `mk_code_index MCP reconnect succeeds repeatedly after a parent disconnect`. The implementation summary says SC-003 was verified through an isolated launcher Vitest and a documented script, and that a live MCP parent-disconnect run against the shared production DB was not performed. The test writes an artificial stale owner lease for a live PID, starts the launcher, and checks `ownerLeaseReclaimed`.
- **Reasoning:** The fixture proves the launcher can reclaim a stale-heartbeat lease, but it does not prove the parent-disconnect/reconnect lifecycle named by SC-003. The success criterion is therefore only partially covered.
- **Suggested fix:** Add a non-disruptive reconnect harness against a temp DB that starts the MCP parent, disconnects or kills the parent while leaving the child/lease condition, reconnects repeatedly, and records the exact command output in the phase summary.

### P2 — Suggestions
None

## Convergence Signal
- New findings this iter: 6
- Cumulative finding count after iter: 18
- New-findings ratio: 0.33
- Continue / converged signal: `continue`

## Files Touched (this iter)
- `iterations/iteration-003.md`
- `deltas/iter-003.jsonl`
- `deep-review-findings-registry.json`
- `deep-review-state.jsonl`
- `deep-review-dashboard.md`
