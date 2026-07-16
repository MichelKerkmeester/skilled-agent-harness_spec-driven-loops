---
title: "Spec: Investigation P1 Fixes for Sidecar Process Ownership Lifecycle"
description: "Level 2 child phase for selected P1 lifecycle and process ownership findings F79 and F88."
trigger_phrases:
  - "arc 010 sidecar process ownership lifecycle"
  - "F79 F88 remediation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/003-fix-investigation-p1s-for-sidecar-process-ownership-lifecycle"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "scaffolded-lifecycle-p1-child"
    next_safe_action: "implement-F79-F88-lifecycle-contracts"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0100020030100020030100020030100020030100020030100020030100020030"
      session_id: "010-002-003-lifecycle"
      parent_session_id: null
    completion_pct: 0
---
# Spec: Investigation P1 Fixes for Sidecar Process Ownership Lifecycle

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 003 of 004 |
| **Predecessor** | `../002-fix-investigation-p1s-for-resource-bounds-and-input-validation/spec.md` |
| **Successor** | `../004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sidecar lifecycle selection contains explicit F88 plus the registry P1 fingerprint match F79. Together they leave process reuse and termination semantics under-specified.

### Purpose
Make lifecycle invariants explicit and tested so sidecar reuse, liveness, and termination follow one ownership contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F79: `over-engineering:sidecar-client:terminatechild-dual-promise-lifecycle`.
- F88: `security:ensure-rerank-sidecar:processliveness-incorrect-default-alive-fallthrough`.
- Evidence sources: `../../001-deep-research-drift-and-simplification/research/research.md` and `../../001-deep-research-drift-and-simplification/research/findings-registry.json`.

### Out of Scope
- P0 parser and temp-file fixes owned by child 001.
- JS/Python parity drift owned by child 004 unless it directly defines F88 behavior.
- Broad lifecycle redesign outside selected findings.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:385-408` | Modify | Simplify termination lifecycle state and remove `sleep(0)` hack if behavior permits. |
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs:178-187` | Modify | Make unknown liveness state explicit or refuse reuse on unknown. |
| `.opencode/skills/system-spec-kit/**/tests/**` | Modify/Create | Add lifecycle and liveness tests. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Lifecycle invariants are explicit and tested. | F79 and F88 checklist rows are `closed` with tests proving termination and liveness behavior. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Every consumer of sidecar lifecycle uses the same ownership/liveness contract. | Implementation summary lists the contract and any parity handoff to child 004. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `terminateChild` has a single understandable lifecycle state or documented equivalent.
- **SC-002**: Unexpected process liveness errors are not silently treated as normal healthy ownership without evidence.
- **SC-003**: Lifecycle tests cover stale, dead, unknown, and normal liveness where applicable.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fail-closed liveness breaks benign EPERM scenarios. | Reusable sidecar startup may become noisy. | Preserve explicit `EPERM` behavior while making unknown errors a separate tested state. |
| Risk | Termination simplification changes pending-request rejection order. | Existing callers may see different error timing. | Add focused tests before simplifying state. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should F88 resolve by documenting default-alive behavior or changing unknown errors to a distinct fail-closed state? Implementation must choose with test evidence.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- Unknown process ownership states fail closed unless explicitly justified.

### Reliability
- Termination is idempotent under concurrent callers.

### Maintainability
- Lifecycle state names describe ownership semantics rather than timing hacks.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Concurrent calls to terminate the same child.
- Unknown `process.kill(pid, 0)` error code.
- `EPERM` liveness result.
- Pending requests during termination.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| F79 | Small | Localized lifecycle simplification with tests. |
| F88 | Small | Liveness state handling and tests are localized. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Signal | Score | Rationale |
|--------|-------|-----------|
| Lifecycle risk | 15 | Liveness and termination semantics affect reuse. |
| File count | 5 | Two implementation surfaces plus tests. |
| Ambiguity | 5 | F88 policy choice requires evidence. |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
