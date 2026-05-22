# Iteration 007 — traceability

## Metadata
- Iteration: 7 of 10
- Dimension: traceability
- Timestamp: 2026-05-22T17:24:38Z
- Findings this iter: 6

## Summary
Reviewed the second traceability pass across the arc 009 phase specs, tasks, implementation summaries, and tests, with emphasis on phases not covered deeply in iteration 003: CocoIndex cancel transport, Code Graph phase closure evidence, Spec Kit embedder sidecar hardening, final regression closure, and the Code Graph suite triage follow-on. The new findings are mostly evidence gaps: several completion claims point at helper-level or unavailable checks while the written REQ/SC language asks for client-facing behavior, parent-death behavior, or completed scan evidence.

## New Findings

### P0 — Blockers
None

### P1 — Required

#### Client-facing `index_cancel` transport is not covered
- **Fingerprint:** `traceability:cocoindex-cancel:index-cancel-client-transport-untested`
- **File(s):** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/spec.md:124`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/tasks.md:108`, `.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_cancel_protocol.py:27`, `.opencode/skills/mcp-coco-index/mcp_server/tests/lifecycle/test_remove_project_lifecycle.py:111`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py:206`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:421`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:1173`
- **Evidence:** Phase 006 requires that "Clients can cancel a specific index request without whole-daemon stop" and marks that complete. The shipped code exposes `DaemonClient.index_cancel(...)`, the MCP `index_cancel` tool, and daemon handling for `IndexCancelRequest`; the tests exercised here cover `CancelRequest`, registry status, and remove-in-progress helper paths, but not a client/server or MCP round trip through those exposed surfaces.
- **Reasoning:** The requirement is client-facing. Helper tests prove identity matching and registry behavior, but they do not prove the public client, daemon protocol encoding, server tool validation, or response mapping works for a real caller.
- **Suggested fix:** Add at least one protocol-level test that sends `IndexCancelRequest` through the daemon handler and one MCP/server test that calls `index_cancel` through the exposed tool/client path. Assert `reqId` and `indexId` cancellation both propagate to the active-work registry and return the expected status without stopping the daemon.

#### Parent-death polling is asserted by env only
- **Fingerprint:** `traceability:embedder-sidecar:parent-death-polling-untested`
- **File(s):** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/spec.md:125`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/implementation-summary.md:63`, `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts:66`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:87`
- **Evidence:** REQ-002 requires embedder sidecar calls to have "parent-death behavior"; the implementation summary claims "child-side parent-death polling." The test named for that behavior only starts a worker, reads an env file, and asserts `observed.parentPid` equals `process.pid`; it never makes the parent PID disappear or observes the worker exit through the polling loop.
- **Reasoning:** Passing the PID into the child is necessary setup, but it is not evidence that parent-death cleanup works. A broken or never-started polling loop would still pass this fixture as long as the env var is present.
- **Suggested fix:** Add a dedicated worker harness where the worker receives a fake or short-lived parent PID and exits after `parentProcessAlive()` fails. For deterministic unit coverage, inject or export the liveness check/timer behavior; for integration coverage, spawn a small parent that exits and assert the child process terminates within the documented polling window.

#### Timeout-kill fixture is a false positive on macOS
- **Fingerprint:** `traceability:embedder-sidecar:timeout-fixture-procfs-false-positive`
- **File(s):** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/implementation-summary.md:135`, `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts:92`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:371`
- **Evidence:** The phase summary records the sidecar-hardening Vitest as passing. The timeout test rejects on timeout, sleeps, then checks `existsSync(\`/proc/${info.pid}\`)` only if `getWorkerInfo()` still returns a child. This review host is Darwin and `/proc` is absent, so that assertion is false even for a live process.
- **Reasoning:** The fixture can pass without proving the worker died. That matters because REQ-002 includes timeout behavior, and the implementation path sends `SIGTERM` from a timer without waiting for exit before the test concludes.
- **Suggested fix:** Replace the `/proc` assertion with a cross-platform liveness probe, such as waiting for the child `exit` event or using `process.kill(pid, 0)` with ESRCH handling. Add a worker fixture that ignores SIGTERM if the intended contract includes escalation or confirmed termination.

#### Phase 010 closed with an available memory scan uncompleted
- **Fingerprint:** `traceability:phase010:memory-index-scan-available-not-completed`
- **File(s):** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/spec.md:140`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/tasks.md:97`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/implementation-summary.md:190`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/implementation-summary.md:205`
- **Evidence:** SC-001 requires a "memory index scan when available" and the tasks file marks SC-001 satisfied. The implementation summary says `memory_index_scan` was available, but both attempts were cancelled by the tool host and "No scan result was written."
- **Reasoning:** Recording a failed/cancelled attempt is useful, but it is not the same as satisfying a criterion that is explicitly conditional on availability. Here the condition was met: the tool was available. The scan did not complete.
- **Suggested fix:** Reopen or qualify SC-001 until a successful memory index scan result is recorded, or amend the phase spec/tasks to make "available but host-cancelled" an accepted terminal state with an explicit follow-up owner.

### P2 — Suggestions

#### Phase 007 is complete while every task checkbox is open
- **Fingerprint:** `traceability:code-graph-phase007:unchecked-tasks-after-completion`
- **File(s):** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/spec.md:45`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/tasks.md:56`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/tasks.md:89`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md:45`
- **Evidence:** Phase 007 `spec.md` is `Completed` and the implementation summary has a completed date, but the phase tasks from T001 through T012 and the completion criteria remain unchecked, including "All non-deferred P0/P1 tasks are complete" and "Validation evidence is recorded in implementation-summary.md."
- **Reasoning:** The tests and implementation summary may still be valid, but the packet-local task ledger contradicts the completed status. Future resume/review tooling uses these checkboxes as traceability evidence, so the phase currently looks unfinished despite being treated as closed.
- **Suggested fix:** Update the Phase 007 task ledger with checked items and evidence pointers, or deliberately reopen the phase status if those task claims were never verified.

#### Phase 011 evidence uses stale phase identifiers
- **Fingerprint:** `traceability:code-graph-phase011:stale-phase-identifiers`
- **File(s):** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage/tasks.md:96`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage/implementation-summary.md:104`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage/implementation-summary.md:183`
- **Evidence:** The Phase 011 task list says to update "phase 001 Completed and completion_pct 67"; the verification row cites `.../001-system-code-graph-suite-triage --strict`; and the suggested commit is `fix(010/001)`. The actual folder and spec are Phase 011.
- **Reasoning:** This is not a runtime failure, but it weakens replayability and searchability for the folded-in Code Graph triage phase. A future operator looking for Phase 011 evidence can follow the wrong phase number from the task, validation, or commit handoff text.
- **Suggested fix:** Correct the Phase 011 task, validation-evidence, and commit-handoff identifiers to `011-system-code-graph-suite-triage`, then refresh packet metadata if any description/search text was generated from the stale labels.

## Convergence Signal
- New findings this iter: 6
- Cumulative finding count after iter: 43
- New-findings ratio: 0.14
- Continue / converged signal: `continue`

## Files Touched (this iter)
- `iterations/iteration-007.md`
- `deltas/iter-007.jsonl`
- `deep-review-findings-registry.json`
- `deep-review-state.jsonl`
- `deep-review-dashboard.md`
