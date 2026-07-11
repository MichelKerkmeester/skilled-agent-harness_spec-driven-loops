---
title: "Feature Specification: Phase 6 — Gate Verification & Parent Rollup"
description: "Run the full research.md Deliverable 4 gate plan (parent-hub drift guard, deterministic skill-benchmark router-replay with a fail-closed report assertion, stack-folder and alignment verifiers, and validate.sh --strict across all phases), record the evidence, and roll up the 018 parent to complete only once every gate is green."
trigger_phrases:
  - "018 phase 006 gate verification rollup"
  - "rust upgrade gate plan skill-benchmark"
  - "018 parent rollup rust"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/006-gate-verification-rollup"
    last_updated_at: "2026-07-11T08:53:41Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded this phase spec from the 018 research manifest"
    next_safe_action: "Plan and run the four gates, capture evidence, then roll up the parent"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6 — Gate Verification & Parent Rollup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Not Started |
| **Created** | 2026-07-11 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 005-touchpoints-and-multilang |
| **Successor** | done |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Rust upgrade is not "done" until every gate is green. Passing the benchmark process with exit 0 is not sufficient — the orchestrator can write a failing report and still return success, so the report must be asserted fail-closed. The parent must not be rolled up before the gates pass.

### Purpose
Run the four gates from `research.md` Deliverable 4, capture evidence, and roll up the 018 parent to complete.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Gate 1: parent-hub drift guard (`sk-code-router-sync.vitest.ts`).
- Gate 2: deterministic skill-benchmark router-replay with a fail-closed JSON assertion (verdict PASS, gateFailed false, D5 100, all scored scenarios pass).
- Gate 3: stack-folder + alignment verifiers exit 0.
- Gate 4: `validate.sh --strict` across the parent and all phase children.
- Record evidence and roll up the 018 parent (`status: complete`, `last_active_child_id`).

### Out of Scope
- Any feature edits (all live in phases 002–005); this phase only verifies and rolls up.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `implementation-summary.md` | Create | Gate evidence for this phase |
| `../graph-metadata.json` | Modify | Parent rollup: status + last_active_child_id |
| `../spec.md` | Modify | Parent phase-map status updates |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Drift guard green | Gate 1 vitest exits 0 with no orphan/missing-projection findings |
| REQ-002 | Router-replay fail-closed pass | Gate 2 report asserts verdict PASS, gateFailed false, D5 100, all scored scenarios pass |
| REQ-003 | Verifiers green | Gate 3 stack-folder + alignment verifiers exit 0; Rust folder recognized |
| REQ-004 | Strict validation | Gate 4 `validate.sh --strict` clean (Errors 0) across parent + all children |
| REQ-005 | Parent rollup | Parent marked complete only after all gates pass; union equality preserved |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four gates pass with captured evidence.
- **SC-002**: The parent is rolled up to complete with `last_active_child_id` set.
- **SC-003**: The parent-hub union equality is preserved end to end.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Treating benchmark exit 0 as the verdict | False green | Assert the report JSON fail-closed (verdict/gate/D5/scenarios) |
| Dependency | Phases 002–005 complete | Nothing to verify | Sequence 006 last |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Gate commands are fixed in `research.md` Deliverable 4.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: ../spec.md
- **Manifest**: ../001-research/research/research.md (Deliverable 4)
- **Predecessor**: ../005-touchpoints-and-multilang/
