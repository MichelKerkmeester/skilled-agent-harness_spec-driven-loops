# Deep Review Strategy — p018-opus-4

Lineage: `p018-opus-4` | Session: `fanout-p018-opus-4-1781718236450-bbehhf` | Executor: cli-claude-code (claude-opus-4-8)
Target: `027/002/018-reindex-scan-responsiveness-and-cancellation` | Max iterations: 1 | Verdict: PASS

## Files Under Review

| File | Role | Reviewed |
|------|------|----------|
| `mcp_server/handlers/memory-index.ts` | Scan executor: tail-loop yields + cancel checks, `processBatches` call site, background dispatch, lease lifecycle | Yes (lines 657-783, 980-1340, 1424-1554) |
| `mcp_server/utils/batch-processor.ts` | `processBatches` early-abort (`shouldAbort` on `RetryOptions`) | Yes (full) |
| `mcp_server/lib/ops/job-store.ts` | In-process cancel `Set`, `isCancelRequestedFast`, terminal cleanup | Yes (full) |
| `mcp_server/tests/handler-memory-index-scan-jobs.vitest.ts` | Mock parity for new `isCancelRequestedFast` export | Yes (mock block) |

## Cross-Reference Status

### Core protocols
- `spec_code` (spec.md scope/REQ ↔ implementation): COVERED — all four declared file changes present and match REQ-001..REQ-004.
- `checklist_evidence` (tasks T001-T008 ↔ code/tests): COVERED for T001-T005 (code present); T006-T008 (build/test/deploy) are reviewer-unverified — sandbox blocked test execution.

### Overlay protocols
- Resource Map Coverage: N/A — no `resource-map.md` in target spec folder (`resource_map_present: false`); coverage gate skipped per contract.
- Acceptance-Coverage (`AC_COVERAGE`): advisory/INFO; Level 1 folder — exempt from the spec-folder lifecycle predicate.

## Known Context

- Live-incident remediation: a `memory_index_scan {force,background}` starved the daemon's single-thread event loop for >1h; all IPC timed out and the scan was uncancellable, forcing a SIGKILL.
- Root cause confirmed by three parallel Opus seats: the batch loop already yields (`processBatches` cooperative yield every 50); the genuine starvation was the two synchronous all-rows post-batch tail loops.
- In-tree precedent cited: `lib/embedders/reindex.ts` (yields after every batch, re-reads cancel status).
- `resource-map.md not present. Skipping coverage gate.`
- Declared out-of-scope: launcher lease-heartbeat re-election (separate supervision subsystem; documented follow-on).

## Review Boundaries

- Observation-only: no target files modified.
- Code-only: no WebFetch.
- Single iteration (maxIterations=1, fan-out lineage) covering correctness + security + spec-alignment + completeness in one pass.
- Build/test/deploy verification (T006-T008 / SC-001 / REQ-004) could not be executed: the sandbox blocked `vitest` and `validate.sh` (required approval). The 68-test-pass claim is recorded as reviewer-unverified, not refuted.
