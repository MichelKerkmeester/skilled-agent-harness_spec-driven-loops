---
title: "Plan: Deep-Review P1 Findings Remediation for Lifecycle and Sidecar Hardening"
description: "Level 3 architecture and batch plan for closing arc 009 deep-review findings across lifecycle correctness, sidecar security, traceability, and maintainability."
trigger_phrases:
  - "deep-review-p1-findings lifecycle sidecar hardening plan"
  - "arc 009 phase 014 plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening"
    last_updated_at: "2026-05-22T19:00:00Z"
    last_updated_by: "codex"
    recent_action: "planned-phase-014-six-batch-remediation"
    next_safe_action: "dispatch-batch-b1-lease-ledger-race-correctness"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "scratch/batch-plan.md"
    session_dedup:
      fingerprint: "sha256:0140140140140140140140140140140140140140140140140140140140140140"
      session_id: "009-memory-leak-remediation-014"
      parent_session_id: null
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Plan: Deep-Review P1 Findings Remediation for Lifecycle and Sidecar Hardening

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript/CJS, Python, shell, Markdown, JSON |
| **Framework** | Spec Kit Memory, deep-loop, CocoIndex, Code Graph, rerank sidecar |
| **Storage** | JSONL audit logs, sidecar ledgers, lock/lease files, SQLite/index paths, spec metadata |
| **Testing** | Targeted Vitest, pytest, shell tests, command smoke tests, strict spec validation |

### Overview
Phase 014 is a remediation coordinator, not an implementation patch. It decomposes the 60 active deep-review findings into six sequential cli-codex-ready batches. The batches keep highly coupled fixes together: shared lease/ledger races first, cleanup correctness second, security boundaries third, audit/data integrity fourth, test evidence fifth, and P2/doc-maintenance drift sixth.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent provided the phase folder and branch policy.
- [x] Review report, resource map, and registry were read.
- [x] Naming complies with system-spec-kit ALWAYS rule 20.
- [x] No implementation files are modified by this scaffold phase.

### Definition of Done
- [ ] All 40 P1 checklist rows are `closed` or parent-approved `deferred`.
- [ ] All 20 P2 checklist rows are `closed` or have deferral rationale.
- [ ] Batch implementation summaries include commit hash, files touched, and test evidence.
- [ ] Phase 014 and parent arc 009 strict validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential remediation batches with shared protocol decisions captured before code changes. B1 and B3 deliberately run early because they change cross-cutting primitives: lease ownership and subprocess/sidecar trust boundaries.

### Cross-Cutting Decisions
- **Shared lease helper vs per-call hardening**: B1 should prefer one lease acquisition contract or parity-backed helpers across TS and CJS so phase 004, 007, 008, and 013 cannot diverge again.
- **Environment allowlist boundary**: B3 should use explicit allowlists for deep-loop external executors, Code Graph launchers, rerank start scripts, and CocoIndex binary probes.
- **Test fixture rewrite strategy**: B5 should replace narrow synthetic fixtures with public transport, concurrency, reconnect, and measured RSS evidence where the phase spec required those behaviors.
- **P2 deferral policy**: P2 findings may be deferred, but only in `checklist.md` and `implementation-summary.md` with rationale, owner, and trigger for reopening.

### Dependency Graph

```text
B1 lease/ledger primitives
  -> B2 cleanup correctness
  -> B3 sidecar + executor security
  -> B4 audit/data integrity
  -> B5 test evidence restoration
  -> B6 P2 docs + maintainability cleanup
```

### Affected Surfaces

| Surface | Primary Findings | Verification |
|---------|------------------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/` | DR009-COR-001, DR009-COR-004, DR009-SEC-012, DR009-MNT-009 | `npm test -- --run tests/deep-loop`, targeted Vitest |
| `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/` | DR009-COR-003 | runtime shutdown hook Vitest |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/` | DR009-COR-008, DR009-TRC-009, DR009-TRC-010 | embedder sidecar Vitest |
| `.opencode/skills/system-spec-kit/mcp_server/lib/memory/` | DR009-COR-011, DR009-COR-017, DR009-MNT-006 | memory runtime/audit Vitest |
| `.opencode/skills/system-spec-kit/scripts/ops/` | DR009-COR-006, DR009-SEC-015, DR009-MNT-007, DR009-MNT-014 | ops script tests and snapshot fixture |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/` | DR009-COR-005, DR009-COR-007, DR009-COR-010, DR009-COR-012, DR009-COR-013, DR009-SEC-004, DR009-MNT-003, DR009-MNT-004, DR009-MNT-011 | targeted pytest under `tests/lifecycle` |
| `.opencode/skills/system-code-graph/` and `.opencode/bin/mk-code-index-launcher.cjs` | DR009-COR-002, DR009-COR-015, DR009-COR-016, DR009-SEC-007, DR009-SEC-010, DR009-SEC-013, DR009-SEC-014, DR009-SEC-017, DR009-MNT-002, DR009-MNT-010 | Code Graph targeted Vitest and launcher smoke tests |
| `.opencode/skills/system-rerank-sidecar/scripts/` and `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | DR009-COR-009, DR009-COR-014, DR009-SEC-001, DR009-SEC-002, DR009-SEC-003, DR009-SEC-005, DR009-SEC-006, DR009-SEC-008, DR009-SEC-009, DR009-SEC-011, DR009-SEC-016, DR009-MNT-001 | rerank sidecar pytest/shell smoke tests |
| Arc 009 phase docs | DR009-TRC-001 through DR009-TRC-012, DR009-MNT-008, DR009-MNT-013 | strict spec validation and evidence reconciliation |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### B1: Lease/Ledger Race Correctness
Findings: DR009-COR-001, DR009-COR-002, DR009-COR-013, DR009-COR-014, DR009-COR-015, DR009-MNT-002.

Goal: make lock, lease, cancel identity, sidecar ledger, and heartbeat ownership transitions exclusive and parity-tested.

### B2: Cleanup Correctness
Findings: DR009-COR-003, DR009-COR-005, DR009-COR-007, DR009-COR-008, DR009-COR-009, DR009-COR-010, DR009-COR-012, DR009-MNT-003.

Goal: ensure cancellation, refresh, signal, timeout, project-close, warmup-timeout, and duplicate-task paths cannot report success or mutate history before cleanup is actually settled.

### B3: Sidecar + Executor Security
Findings: DR009-SEC-001, DR009-SEC-002, DR009-SEC-003, DR009-SEC-004, DR009-SEC-005, DR009-SEC-006, DR009-SEC-007, DR009-SEC-008, DR009-SEC-009, DR009-SEC-010, DR009-SEC-011, DR009-SEC-012, DR009-SEC-013, DR009-SEC-014, DR009-SEC-015, DR009-SEC-016, DR009-SEC-017, DR009-MNT-001.

Goal: harden API-key propagation, auth, payload caps, command execution, dotenv/env inheritance, token generation/redaction, socket cleanup, and sidecar helper contract drift.

### B4: Audit/JSONL Corruption + Data Integrity
Findings: DR009-COR-004, DR009-COR-006, DR009-COR-016, DR009-COR-017, DR009-MNT-009.

Goal: repair corrupt JSONL tails before state-log reads, surface inventory degradation, accept documented relationship query subject forms, prevent same-ms audit rotation overwrite, and reconcile executor config schema drift.

### B5: Test Fixture Validity Restoration
Findings: DR009-TRC-001, DR009-TRC-002, DR009-TRC-003, DR009-TRC-004, DR009-TRC-005, DR009-TRC-006, DR009-TRC-007, DR009-TRC-009, DR009-TRC-010, DR009-TRC-011.

Goal: replace narrow, synthetic, or unavailable evidence with public transport, true concurrency, queued remove, integrated runtime retention, measured RSS, reconnect, parent-death, timeout-kill, and memory scan evidence.

### B6: Doc Drift + Maintainability Cleanup
Findings: DR009-COR-011, DR009-TRC-008, DR009-TRC-012, DR009-MNT-004, DR009-MNT-005, DR009-MNT-006, DR009-MNT-007, DR009-MNT-008, DR009-MNT-010, DR009-MNT-011, DR009-MNT-012, DR009-MNT-013, DR009-MNT-014.

Goal: close P2 correctness edge cases and doc/package drift, or explicitly defer low-risk advisories with rationale.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Batch | Required Tests |
|-------|----------------|
| B1 | deep-loop lock Vitest; Code Graph lease/launcher Vitest; rerank ledger pytest; CocoIndex cancel protocol pytest |
| B2 | runtime shutdown hooks Vitest; CocoIndex lifecycle pytest; embedder sidecar Vitest; rerank warmup timeout tests |
| B3 | rerank sidecar auth/payload/start tests; Code Graph launcher/readiness/reindex tests; deep-loop executor env tests; ops redaction tests |
| B4 | executor audit JSONL repair tests; process harness degraded inventory tests; Code Graph relationship query schema tests; audit rotation tests |
| B5 | public CLI/deep-review dispatch tests; true concurrent lock fixture; CocoIndex public cancel transport tests; integrated retention workload; RSS benchmark output; reconnect/manual evidence |
| B6 | strict validation for edited phase docs; package barrel/import tests; bounded-cache tests; benchmark helper tests; ops README command verification |

Every batch must also run strict validation for phase 014 and for any phase doc it touches.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Review registry | Internal review artifact | Available | Finding IDs/files cannot be trusted without it. |
| Resource map | Internal review artifact | Available | Batch ownership becomes ambiguous. |
| Node/Vitest toolchain | Local dev dependency | Expected | TS/CJS lifecycle batches cannot verify. |
| Python/pytest environments | Local dev dependency | Expected | CocoIndex and rerank sidecar batches cannot verify. |
| Parent agent commits | Workflow dependency | External | This dispatch must not commit. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A batch dispatch changes files outside its assigned scope, or validation fails and cannot be fixed within the batch.
- **Procedure**: Stop, record the failing command and modified files in the batch handoff, and let the parent decide whether to retry or re-slice the batch.
- **Scope**: Scaffold rollback is limited to this phase folder plus the two parent metadata edits.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| B1 | Scaffold docs and registry | B2-B6 |
| B2 | B1 lease/identity stability | B3-B6 |
| B3 | B2 cleanup semantics | B4-B6 |
| B4 | B3 trust-boundary updates | B5-B6 |
| B5 | B1-B4 behavior changes | B6 and final reconciliation |
| B6 | B5 evidence state | Final checklist closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Batch | Estimate | Notes |
|-------|----------|-------|
| B1 | 1 dispatch | Cross-runtime lease parity may dominate. |
| B2 | 1 dispatch | Cleanup semantics are mostly localized. |
| B3 | 1-2 dispatches | Security batch is broad; split only if validation forces it. |
| B4 | 1 dispatch | Data integrity fixes are separate from sidecar security. |
| B5 | 1 dispatch | Evidence work may be slower than code changes. |
| B6 | 1 dispatch | P2 fixes or explicit deferrals. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

If a batch fails validation, leave the working tree intact for the parent, record the failing command in `implementation-summary.md`, and do not proceed to the next batch. If a batch changes a shared helper and breaks a downstream suite, the next safe action is to patch the shared helper rather than scatter compatibility workarounds.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
B1 -> B2 -> B3 -> B4 -> B5 -> B6 -> final checklist/summary reconciliation
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

B1 is the critical path because lease and identity semantics affect later cleanup and traceability tests. B3 is second because env and sidecar security changes can affect subprocess startup for later evidence gates.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Criteria |
|-----------|---------------|
| M1 | B1 findings closed with lease/cancel/ledger tests |
| M2 | B2 cleanup findings closed with lifecycle tests |
| M3 | B3 security findings closed with containment tests |
| M4 | B4 data integrity findings closed |
| M5 | B5 traceability findings have public/concurrent/measured evidence |
| M6 | B6 P2 findings closed or explicitly deferred |
<!-- /ANCHOR:milestones -->
