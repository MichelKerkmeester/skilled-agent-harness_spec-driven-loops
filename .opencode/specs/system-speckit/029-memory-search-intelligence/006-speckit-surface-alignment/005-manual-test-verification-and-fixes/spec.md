---
title: "Feature Specification: Manual Test Verification and Fixes"
description: "Record the completed manual verification arc for Fable-5-refined surface-alignment features and the defects fixed from that run."
trigger_phrases:
  - "manual test verification and fixes"
  - "Fable-5 refined manual verification"
  - "gold battery path fix"
  - "bm25 scoped fill limit regression"
  - "surface alignment remediation verification"
importance_tier: "normal"
contextType: "implementation"
parent: "../spec.md"
predecessor: "004-recorded-failure-closure"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/006-speckit-surface-alignment/005-manual-test-verification-and-fixes"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Record manual verification and shipped fixes"
    next_safe_action: "Run strict validation for the surface-alignment parent"
    blockers: []
    key_files:
      - ".opencode/specs/system-speckit/029-memory-search-intelligence/005-speckit-surface-alignment/005-manual-test-verification-and-fixes/spec.md"
      - ".opencode/specs/system-speckit/029-memory-search-intelligence/005-speckit-surface-alignment/005-manual-test-verification-and-fixes/implementation-summary.md"
      - ".opencode/specs/system-speckit/029-memory-search-intelligence/005-speckit-surface-alignment/005-manual-test-verification-and-fixes/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-test-verification-and-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Manual Test Verification and Fixes

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
| **Created** | 2026-07-05 |
| **Branch** | `origin/028`; code already committed, no git action requested |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 004-recorded-failure-closure |
| **Successor** | ../006-presentation-layer-fixes/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Fable-5-refined surface-alignment features needed a manual verification pass after documentation remediation and automated stress coverage. The run covered about 30 runnable items from a larger approximately 510-scenario manual corpus, because most scenarios require the spec-memory daemon. That verification surfaced two real defects and three temporarily blocked code-graph scenarios.

### Purpose

Record the completed manual verification arc, the shipped fixes for the gold-battery path and BM25 scoped fill-limit regression, the unblocked code-graph scenarios, the recovered spec-memory daemon behavior, and the open findings that are intentionally deferred rather than claimed fixed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Record the manual verification results: 25 PASS, 2 FAIL, 3 BLOCKED across approximately 30 runnable items.
- Record the shipped gold-battery path fix in commit `bda7f57879`.
- Record the shipped BM25 scoped fill-limit regression fix in commit `e4fcccc320`.
- Record the code-graph scan action that moved the graph from stale to fresh/ready/live and unblocked the three code-graph scenarios.
- Record the spec-memory daemon cold-start and real search-hit evidence.
- Record open/deferred findings honestly, including the lexical-overlap-quality-gate FTS5 failure.

### Out of Scope

- Editing any code, test, product, or runtime file in this documentation pass.
- Claiming the lexical-overlap-quality-gate failure is fixed.
- Claiming `exactTriggerSearch` has a scope-crowding defect; it was confirmed safe.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Level-2 specification for the verification-and-fixes arc. |
| `plan.md` | Create | Delivered plan for manual verification, fixes, daemon actions, and deferred findings. |
| `tasks.md` | Create | Completed task ledger for verification and documentation. |
| `checklist.md` | Create | Evidence checklist for result counts, fixes, and deferrals. |
| `implementation-summary.md` | Create | Summary of what was verified, fixed, unblocked, and deferred. |
| `decision-record.md` | Create | Fable-5 adjudication for the BM25 product-fix decision. |
| `description.json` | Generate | Generated description metadata for this phase. |
| `graph-metadata.json` | Generate | Generated graph metadata for this phase. |
| `../spec.md` | Modify | Add the `015` row to the parent phase documentation map. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Manual verification results are recorded. | `implementation-summary.md` records 25 PASS, 2 FAIL, 3 BLOCKED and the category breakdown. |
| REQ-002 | Gold-battery fix is recorded. | `implementation-summary.md` cites commit `bda7f57879` and `system-code-graph/mcp_server/lib/gold-query-verifier.ts`. |
| REQ-003 | BM25 scoped fill-limit fix is recorded. | `implementation-summary.md` cites commit `e4fcccc320`, `system-spec-kit/mcp_server/lib/search/hybrid-search.ts`, and the verification commands/results. |
| REQ-004 | Open/deferred findings are not overstated. | `implementation-summary.md` and `checklist.md` record the lexical-overlap-quality-gate failure as pre-existing and deferred. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The BM25 adjudication is recorded. | `decision-record.md` records Decision A, refinement A-incremental, alternatives, regression evidence, and rejection of test relaxation. |
| REQ-006 | The phase validates under the strict system-spec-kit gate. | Parent recursive strict validation returns `RESULT: PASSED`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The verification counts and category outcomes are visible and consistent across docs.
- **SC-002**: The two shipped fixes cite their commit hashes, source files, and runtime or test effects.
- **SC-003**: Deferred findings remain visible and are not reclassified as fixed.
- **SC-004**: Recursive strict validation passes for the parent packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Overstating daemon health | `memory_health` still self-reports degraded/0-memories | Record daemon search-hit recovery separately from the health-reporting/main-DB-init follow-up. |
| Risk | Treating pre-existing FTS5 failure as this phase's regression | Would misassign ownership | Record origin parity, delta 0, and defer to the FTS/016 owner. |
| Dependency | Code-graph daemon reload | Gold-battery path runtime effect waits for daemon reload | Record that source fix shipped and runtime effect is pending daemon reload. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Evidence Quality

- **NFR-E01**: Counts must include both summary totals and category-level breakdowns.
- **NFR-E02**: Fix claims must cite commits and file paths.
- **NFR-E03**: Deferrals must include the observed failure mode, baseline parity, and owner boundary.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Blocked scenario becomes runnable**: Record the action that changed the blocker state and the unblocked result.
- **Pre-existing failing test remains failing**: Record delta 0 and defer rather than claiming this phase fixed it.
- **Non-blocking flag is investigated**: Record the safety analysis and close it only if the scope-crowding risk is actually absent.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None for this phase. The lexical-overlap-quality-gate owner call remains a deferred follow-up outside this phase.
<!-- /ANCHOR:questions -->
