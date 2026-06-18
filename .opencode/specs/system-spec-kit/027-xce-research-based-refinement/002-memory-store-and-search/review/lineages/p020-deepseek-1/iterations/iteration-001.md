# Iteration 1: Full-Pass Review (Correctness + Security + Traceability + Maintainability)

## Focus

Single-iteration full pass across all four review dimensions on the four changed files:
- `maintenance-marker.ts` (new shared reference-counted module, 91 lines)
- `memory-index.ts` (refactored scan IIFE, 1587 lines)
- `retry-manager.ts` (wired embedding queue, 1141 lines)
- `maintenance-marker.vitest.ts` (new unit test, 154 lines)

## Scorecard

- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 4/4
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P1, Required

- **F001**: State inconsistency in `beginMaintenance` — module-level state (`activeCount`, `activeLabels`) is modified BEFORE `writeMarker()` is called. If `writeMarker()` throws (e.g., missing or unwritable `DATABASE_DIR`), the module state becomes inconsistent: `activeCount` is already incremented and `activeLabels` already contains the label, but no marker file exists and the caller receives an exception with no handle to call `end()`. Subsequent calls to `beginMaintenance` would compound the drift. Fix: either call `writeMarker()` before modifying state, or wrap the mutation in try/catch with rollback. `./mcp_server/lib/storage/maintenance-marker.ts:59-61`

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | `maintenance-marker.ts:58-83`, `retry-manager.ts:1012-1062`, `memory-index.ts:1488-1554` | All 4 REQ items confirmed implemented; shape contracts match spec |
| checklist_evidence | pass | hard | `tasks.md:T002-T005` | All 4 tasks present in implementation; build, unit, and existing suites pass per implementation-summary.md |

## Assessment

- New findings ratio: 1.0 (first iteration, all findings are new)
- Dimensions addressed: correctness, security, traceability, maintainability
- Novelty justification: First review pass on newly shipped code

### Correctness

- Reference-counted module logic is sound: `activeCount` tracks holders, marker file present while >=1 active, removed at 0. `end()` is properly idempotent via `ended` guard. Timer starts on first holder and stops at 0.
- Scan IIFE refactor preserves prior behavior: background scan path creates `beginMaintenance('index_scan')` in `setImmediate`, refreshes at phase boundaries, ends in `finally`. Synchronous foreground path unchanged (correct — request-response calls need no launcher protection).
- Embedding queue wiring respects empty-queue guard: `stats.queue_size === 0` returns early at `retry-manager.ts:1032-1034` before any `beginMaintenance` call. Busy ticks hold the marker from `beginMaintenance('embedding-queue')` through to the `finally`.
- Overlap scenario: scan and embedding queue can hold concurrent handles; reference counting lets both end independently without clobbering.
- The one P1 finding (F001) concerns state ordering in `beginMaintenance` — the write and the state mutation should be re-ordered or guarded.

### Security

- Embedding provider error messages sanitized via `sanitizeEmbeddingFailureMessage` before persistence/response (`retry-manager.ts:717-724, 779-785, 803`). No raw credentials or API keys leak.
- Marker file content (`childPid`, `activeUntilMs`, `labels`, `refreshedAtIso`) contains no secrets — standard process and timing metadata only.
- No new network calls, user input handling, or trust boundaries introduced. The change is purely local file I/O that the existing launcher already trusts.

### Traceability

All four spec requirements confirmed implemented:
- **REQ-001** (P0): `beginMaintenance(label) -> { refresh(), end() }` — `maintenance-marker.ts:58-83`. 180s TTL + 20s self-refresh confirmed at lines 25-26. Marker present while >=1 active, removed at 0, idempotent `end()`.
- **REQ-002** (P0): Embedding queue protected — `runBackgroundJob` calls `beginMaintenance('embedding-queue')` only after empty-queue guard (`retry-manager.ts:1032-1038`), ends in existing `finally` (`retry-manager.ts:1052-1055`).
- **REQ-003** (P1): Scan and queue overlap — reference counting confirmed via test (`maintenance-marker.vitest.ts:82-109`) and module logic (`maintenance-marker.ts:58-83`).
- **REQ-004** (P1): Idle tick never marks — empty-queue guard at `retry-manager.ts:1032-1034` returns before `beginMaintenance` is reached.

All four tasks (T002-T005) present in implementation. Build, unit tests, and deploy verification passed per `implementation-summary.md`.

### Maintainability

- Module constants well-named with TTL/refresh rationale in comments (`maintenance-marker.ts:22-26`).
- Test file covers the four lifecycle scenarios: baseline write, reference counting with overlap, idempotent `end()`, `refresh()` rewrite, multi-handle removal at 0.
- Test isolation via `__resetMaintenanceMarkerForTest()` and tmpdir-based DATABASE_DIR redirect — clean test design.
- Import style consistent with codebase (type-only imports separate, snake_case backward compat aliases).

## Ruled Out

- **marker TTL too short**: 180s TTL vs ~79s max observed synchronous phase. 2.3x margin is adequate; the 20s refresh plus explicit `refresh()` at phase boundaries provides additional headroom. Not a finding.
- **concurrent same-label beginMaintenance**: both consumers have higher-level concurrency guards (`backgroundJobRunning` in retry-manager, `acquireIndexScanLease` in memory-index). Not a finding.
- **missing end() after embedding queue start**: the `finally` block at `retry-manager.ts:1052-1062` covers all exit paths (success, error, empty queue). End is idempotent. Not a finding.
- **embedding queue gap between scan-end and queue-start**: bounded by interval period (default 5 min). Pending rows are durable in DB; if daemon is reaped during gap, next daemon picks them up. Acceptable design trade-off.

## Dead Ends

_(none — all review paths yielded findings or positive confirmation)_

## Recommended Next Focus

F001 remediation: Reorder `writeMarker()` before state mutation in `beginMaintenance`, or add try/catch with rollback.

---

```json
{"findingId":"F001","claim":"beginMaintenance modifies activeCount and activeLabels before calling writeMarker(); if writeMarker() throws, module state is inconsistent with no recovery path.","evidenceRefs":[".opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:59-61"],"counterevidenceSought":"Checked both callers (memory-index.ts background scan path, retry-manager.ts runBackgroundJob) — both are invoked post-DB-init so DATABASE_DIR exists in practice. Searched for error handling around beginMaintenance() calls — neither caller wraps in try/catch to recover from a thrown writeMarker.","alternativeExplanation":"atomicWriteFile may create parent directories internally, making the throw impossible in practice. Without reading transaction-manager.ts implementation, this cannot be confirmed and the code as written does not guarantee it.","finalSeverity":"P1","confidence":0.72,"downgradeTrigger":"If atomicWriteFile is confirmed to never throw (handles missing directories internally with mkdirSync), or if both callers add try/catch guards around beginMaintenance, downgrade to P2 (defensive-code advisory).","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Initial discovery — state mutation before fallible I/O is a latent correctness risk even if mitigated by operational preconditions."}]}
```

Review verdict: CONDITIONAL
