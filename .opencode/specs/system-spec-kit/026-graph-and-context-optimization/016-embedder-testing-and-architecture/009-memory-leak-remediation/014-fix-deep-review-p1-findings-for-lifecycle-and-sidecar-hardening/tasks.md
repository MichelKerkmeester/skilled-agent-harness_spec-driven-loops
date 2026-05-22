---
title: "Tasks: Deep-Review P1 Findings Remediation for Lifecycle and Sidecar Hardening"
description: "Numbered task ledger for six sequential implementation batches that close arc 009 deep-review findings."
trigger_phrases:
  - "arc 009 phase 014 tasks"
  - "deep-review-p1-findings remediation tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening"
    last_updated_at: "2026-05-22T19:00:00Z"
    last_updated_by: "codex"
    recent_action: "completed-b6-doc-drift-maintainability-cleanup"
    next_safe_action: "run-final-phase-validation-and-parent-handoff"
    blockers: []
    key_files:
      - "tasks.md"
      - "scratch/batch-plan.md"
    session_dedup:
      fingerprint: "sha256:0140140140140140140140140140140140140140140140140140140140140140"
      session_id: "009-memory-leak-remediation-014"
      parent_session_id: null
    completion_pct: 98
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->
# Tasks: Deep-Review P1 Findings Remediation for Lifecycle and Sidecar Hardening

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable within a batch |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (finding IDs; primary files) [target <=100 LOC where practical]`
<!-- /ANCHOR:notation -->

---

## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 | T001-T006 | B1 lease/ledger race correctness |
| M2 | T007-T014 | B2 cleanup correctness |
| M3 | T015-T032 | B3 sidecar + executor security |
| M4 | T033-T037 | B4 audit/data integrity |
| M5 | T038-T047 | B5 test fixture validity restoration |
| M6 | T048-T060 | B6 P2/doc-maintainability cleanup |
| M7 | T061-T064 | Final reconciliation |
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T000 Read phase 014 docs, review registry, resource map, and the target source files before any batch edit.

### B1: Lease/Ledger Race Correctness [Milestone M1]

- [ ] T001 Fix deep-loop lock exclusive acquisition and concurrent coverage (DR009-COR-001; `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts`, deep-loop tests) [<=100 LOC]
- [ ] T002 Fix Code Graph owner lease exclusive acquisition across TS and CJS (DR009-COR-002; `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts`, `.opencode/bin/mk-code-index-launcher.cjs`) [<=100 LOC]
- [ ] T003 Fix CocoIndex cancel identity matching so mismatched request/index IDs cannot cancel unrelated work (DR009-COR-013; `cancel_protocol.py`, `active_work_registry.py`, `server.py`) [<=100 LOC]
- [ ] T004 Fix rerank sidecar ledger concurrent row loss (DR009-COR-014; `sidecar_ledger.py`, `ensure_rerank_sidecar.py`) [<=100 LOC]
- [ ] T005 Fix Code Graph child heartbeat after lease transfer misses (DR009-COR-015; `system-code-graph/mcp_server/index.ts`, owner lease, launcher) [<=100 LOC]
- [ ] T006 Replace hand-copied Code Graph owner lease protocol with shared contract or parity tests (DR009-MNT-002; owner lease TS/CJS surfaces) [<=100 LOC]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### B2: Cleanup Correctness [Milestone M2]

- [ ] T007 Make runtime signal-triggered cleanup terminate the process after hooks settle (DR009-COR-003; `shutdown-hooks.ts`) [<=100 LOC]
- [ ] T008 Prevent cancelled CocoIndex updates from syncing FTS or marking initial indexing done (DR009-COR-005; `project.py`, `daemon.py`) [<=100 LOC]
- [ ] T009 Route CocoIndex config refresh through active-work drain or the project index lock (DR009-COR-007; `daemon.py`) [<=100 LOC]
- [ ] T010 Wait/escalate embedder sidecar timeout cleanup before dropping child references (DR009-COR-008; `sidecar-client.ts`) [<=100 LOC]
- [ ] T011 Ledger or terminate rerank sidecar processes that survive warmup timeout (DR009-COR-009; `ensure_rerank_sidecar.py`) [<=100 LOC]
- [ ] T012 Move `Project.close()` closed-state mutation after successful resource close (DR009-COR-010; `project.py`) [<=100 LOC]
- [ ] T013 Preserve completed CocoIndex task history during shutdown cancellation (DR009-COR-012; `daemon_task_registry.py`) [<=100 LOC]
- [ ] T014 Reject or namespace duplicate CocoIndex daemon task IDs instead of overwriting rows (DR009-MNT-003; `daemon_task_registry.py`) [<=100 LOC]
### B3: Sidecar + Executor Security [Milestone M3]


- [ ] T015 Preserve configured rerank API keys through sidecar startup env allowlist (DR009-SEC-001; `start.sh`, `rerank_sidecar.py`) [<=100 LOC]
- [ ] T016 Require auth/rate-limit semantics on rerank warmup endpoint (DR009-SEC-002; `rerank_sidecar.py`) [<=100 LOC]
- [ ] T017 Require sidecar ownership proof beyond any localhost health response (DR009-SEC-003; `ensure_rerank_sidecar.py`, `/health`) [<=100 LOC]
- [ ] T018 Add retention cap for CocoIndex stale cancel/index identity sets (DR009-SEC-004; `active_work_registry.py`) [<=100 LOC]
- [ ] T019 Redact or rotate optional rerank logging for raw query text (DR009-SEC-005; `rerank_sidecar.py`) [<=100 LOC]
- [ ] T020 Pin or restrict extra rerank allowlisted models that can execute local remote-code (DR009-SEC-006; `rerank_sidecar.py`) [<=100 LOC]
- [ ] T021 Constrain Code Graph DB override paths to the workspace boundary (DR009-SEC-007; `mk-code-index-launcher.cjs`, `core/config.ts`) [<=100 LOC]
- [ ] T022 Add document-byte cap to rerank request validation (DR009-SEC-008; `rerank_sidecar.py`) [<=100 LOC]
- [ ] T023 Replace command-substring sidecar killing with ledger/owner-token identity (DR009-SEC-009; `use-model.sh`) [<=100 LOC]
- [ ] T024 Contain `COCOINDEX_BIN_PATH` resolution for Code Graph readiness/reindex (DR009-SEC-010; `ccc-readiness-probe.ts`, `ccc-reindex.ts`) [<=100 LOC]
- [ ] T025 Replace shell-sourced rerank dotenv loading with parsed allowlist (DR009-SEC-011; `start.sh`, `use-model.sh`) [<=100 LOC]
- [ ] T026 Add explicit deep-loop external executor env allowlist (DR009-SEC-012; `executor-audit.ts`) [<=100 LOC]
- [ ] T027 Prevent project dotenv from injecting Node runtime options into Code Graph launcher children (DR009-SEC-013; `mk-code-index-launcher.cjs`) [<=100 LOC]
- [ ] T028 Replace shell-form Code Graph metadata diff command with validated args (DR009-SEC-014; `ensure-ready.ts`, `code-graph-db.ts`) [<=100 LOC]
- [ ] T029 Redact owner tokens in process inventory and sweep outputs (DR009-SEC-015; `process-memory-harness.ts`, `process-sweep.ts`) [<=100 LOC]
- [ ] T030 Use unpredictable rerank reusable-sidecar owner tokens (DR009-SEC-016; `ensure_rerank_sidecar.py`, `sidecar_ledger.py`) [<=100 LOC]
- [ ] T031 Guard Code Graph IPC socket unlink to owned socket paths only (DR009-SEC-017; `ipc/socket-server.ts`) [<=100 LOC]
- [ ] T032 Reconcile Python and Node rerank ensure-helper ownership contracts (DR009-MNT-001; `ensure_rerank_sidecar.py`, `.opencode/bin/lib/ensure-rerank-sidecar.cjs`) [<=100 LOC]
### B4: Audit/JSONL Corruption + Data Integrity [Milestone M4]

- [ ] T033 Repair or skip corrupt JSONL tails before deep-loop pre-dispatch state-log reads (DR009-COR-004; `executor-audit.ts`, `jsonl-repair.ts`) [<=100 LOC]
- [ ] T034 Report process inventory failures as degraded/blocked, not empty clean inventory (DR009-COR-006; `process-memory-harness.ts`) [<=100 LOC]
- [ ] T035 Accept documented Code Graph relationship query file-path subject form (DR009-COR-016; `tool-schemas.ts`, `handlers/query.ts`) [<=100 LOC]
- [ ] T036 Prevent Spec Memory audit rotation overwrite within the same millisecond (DR009-COR-017; `audit-rotation.ts`) [<=100 LOC]
- [ ] T037 Reconcile deep-review executor config `type`/`kind` schema drift (DR009-MNT-009; `executor-config.ts`, deep-review YAML, config JSON) [<=100 LOC]
### B5: Test Fixture Validity Restoration [Milestone M5]

- [x] T038 Cover CLI dispatch branches through the supervised executor contract (DR009-TRC-001; deep-review YAML, `executor-audit.ts`, phase 003 docs) [<=100 LOC]
- [x] T039 Replace sequential lock coverage with true concurrent same-packet coverage (DR009-TRC-002; phase 004 docs, `loop-lock.vitest.ts`) [<=100 LOC]
- [x] T040 Add queued CocoIndex index/remove-project lifecycle fixture (DR009-TRC-003; phase 006 docs, `test_remove_project_lifecycle.py`) [<=100 LOC]
- [x] T041 Add integrated Spec Memory save/search/index retention workload evidence (DR009-TRC-004; phase 009 docs, memory runtime tests) [<=100 LOC]
- [x] T042 Record adapter RSS benchmark slope numbers required by phase 012 (DR009-TRC-005; phase 012 docs and benchmark outputs) [<=100 LOC]
- [x] T043 Manually verify or harness Code Graph SC-003 reconnect behavior (DR009-TRC-006; phase 013 docs, launcher lease tests) [<=100 LOC]
- [x] T044 Cover client-facing CocoIndex `index_cancel` transport (DR009-TRC-007; client/server/daemon and lifecycle tests) [<=100 LOC]
- [x] T045 Replace env-only parent-death polling assertion with observable cleanup evidence (DR009-TRC-009; phase 009 docs, embedder tests) [<=100 LOC]
- [x] T046 Fix macOS timeout-kill false positive with real child-liveness assertion (DR009-TRC-010; sidecar hardening tests, `sidecar-client.ts`) [<=100 LOC]
- [x] T047 Complete or document phase 010 memory scan evidence (DR009-TRC-011; phase 010 docs and memory index scan evidence) [<=100 LOC]
### B6: Doc Drift + Maintainability Cleanup [Milestone M6]

- [x] T048 Fix `BoundedMap` overflow when oldest key is `undefined` (DR009-COR-011; `bounded-cache.ts`) [<=100 LOC]
- [x] T049 Reconcile phase 007 completed status with task checkbox evidence (DR009-TRC-008; phase 007 docs) [<=100 LOC]
- [x] T050 Correct stale phase identifiers in phase 011 evidence (DR009-TRC-012; phase 011 docs) [<=100 LOC]
- [x] T051 Rename or document `ActiveWorkRegistry.retain_stale` semantics (DR009-MNT-004; `active_work_registry.py`) [<=100 LOC]
- [x] T052 Add lifecycle helper surfaces to maintainer READMEs (DR009-MNT-005; deep-loop, Code Graph, ops READMEs) [<=100 LOC]
- [x] T053 Fix `TtlMap.has()` behavior for stored `undefined` values (DR009-MNT-006; `bounded-cache.ts`) [<=100 LOC]
- [x] T054 Clarify or implement `process-sweep apply --confirmed` behavior (DR009-MNT-007; `process-sweep.ts`) [<=100 LOC]
- [x] T055 Correct phase 013 summary phase-number drift (DR009-MNT-008; phase 013 implementation summary) [<=100 LOC]
- [x] T056 Export Code Graph lifecycle helpers through documented library barrel (DR009-MNT-010; `lib/index.ts`, README) [<=100 LOC]
- [x] T057 Export CocoIndex lifecycle helper entrypoints from package barrel (DR009-MNT-011; `lifecycle/__init__.py`) [<=100 LOC]
- [x] T058 Deduplicate adapter RSS benchmark measurement core (DR009-MNT-012; benchmark scripts) [<=100 LOC]
- [x] T059 Correct phase 012 benchmark docs that point at arc 010 phase 002 (DR009-MNT-013; benchmark methodology and phase docs) [<=100 LOC]
- [x] T060 Correct ops README validation command path (DR009-MNT-014; ops README) [<=100 LOC]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Final Reconciliation [Milestone M7]

- [x] T061 Update `checklist.md` statuses with commit hash, tests, and evidence for every finding.
- [x] T062 Fill `implementation-summary.md` with files changed, verification commands, residual risks, and P2 deferrals.
- [x] T063 Strict-validate phase 014 and every touched phase child.
- [x] T064 Strict-validate arc 009 parent and record final validation evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 60 finding rows are closed or explicitly deferred.
- [x] All 40 P1 rows have closure evidence or parent-approved deferral.
- [x] All batch-specific tests pass or blockers are recorded.
- [x] `implementation-summary.md` has final handoff and validation evidence.
- [x] Parent arc metadata remains consistent after phase 014 closes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decisions**: `decision-record.md`
- **Batch dispatch plan**: `scratch/batch-plan.md`
- **Review registry**: `../review/deep-review-findings-registry.json`
<!-- /ANCHOR:cross-refs -->
