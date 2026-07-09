---
title: "Feature Specification: 101/004 Deep AI Council Playbook Graph Coverage"
description: "Add 8 functional council-graph integration scenarios (DAC-019..DAC-026) to the deep-ai-council manual testing playbook so the shipped 003 graph surface has operator-driven validation coverage."
trigger_phrases:
  - "deep-ai-council playbook graph"
  - "council graph playbook"
  - "DAC-019"
  - "DAC-026"
  - "council_graph integration scenarios"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/005-deep-multi-ai-council-skill/004-deep-ai-council-playbook-graph-coverage"
    last_updated_at: "2026-05-11T07:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Audited 101 packet + identified zero functional graph coverage in playbook"
    next_safe_action: "Rename DAC-011 file, update root playbook, author 8 graph scenarios"
    blockers: []
    key_files:
      - .opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md
      - .opencode/skills/deep-ai-council/manual_testing_playbook/05--scope-boundaries/
      - .opencode/skills/deep-ai-council/manual_testing_playbook/08--council-graph-integration/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-004-playbook-graph-coverage"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "DAC-011 stays as a textual boundary scenario; new DAC-019..DAC-026 cover functional graph behavior."
      - "New scenarios live under a new 08--council-graph-integration/ category."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 101/004 Deep AI Council Playbook Graph Coverage

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-11 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (101 phase parent) |
| **Phase** | 4 of 4 |
| **Predecessor** | `003-deep-ai-council-graph-support` |
| **Successor** | None |
| **Handoff Criteria** | Phase 003 graph implementation complete and exposing `council_graph_*` MCP tools; this phase adds operator playbook coverage matching that surface |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 003 of `101-deep-multi-ai-council-skill` shipped a dedicated council graph (4 MCP tools, 8 node kinds, 10 relation kinds, 5 query modes, 3 convergence buckets) backed by `council-graph.sqlite` and verified by `tests/council-graph.vitest.ts`. The manual testing playbook was not updated to match: the entire shipped surface is exercised by zero operator-driven scenarios; the only mention of `council_graph_*` in the playbook tree is one textual line in DAC-011. The DAC-011 scenario file is also still named `001-graph-support-explicitly-out-of-scope.md` even though its content was rewritten in-place to "Graph support stays derived and scoped".

### Purpose
Bring the playbook back into alignment with the shipped graph surface by renaming the stale DAC-011 file, refreshing root playbook header metadata, adding `council-graph.vitest.ts` to the automated cross-reference, and authoring 8 new scenarios (DAC-019..DAC-026) under a new `08--council-graph-integration/` category that 1:1-mirror the shipped MCP tool behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename `05--scope-boundaries/001-graph-support-explicitly-out-of-scope.md` → `...-derived-and-scoped.md` and add forward-pointer to DAC-019..DAC-026.
- Update root `manual_testing_playbook.md` (count `18`→`26`, categories `7`→`8`, coverage note date, TOC, new §16, §11 path fix, §14 cross-ref row, §15 catalog rows).
- Create `08--council-graph-integration/` with 8 scenario files DAC-019..DAC-026.
- Run sk-doc validators + strict spec validation as evidence.

### Out of Scope
- Modifying any 101-* spec packet — they are complete and pass strict validation.
- Touching council_graph_* MCP code — the implementation is correct; only test coverage at the operator-playbook layer is missing.
- Adding feature catalog packages — pre-existing TODO from packet 002, separate workstream.
- Adding new automated vitest tests — `tests/council-graph.vitest.ts` already covers 6 of these behaviors at the test layer.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-ai-council/manual_testing_playbook/05--scope-boundaries/001-graph-support-explicitly-out-of-scope.md` | Rename + Modify | Rename to `001-graph-support-derived-and-scoped.md`; add §3 forward-pointer to DAC-019..DAC-026 |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md` | Modify | §1 OVERVIEW count + coverage note, canonical artifacts list, TOC, §11 DAC-011 path fix, new §16, §14 cross-ref row, §15 catalog rows |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/08--council-graph-integration/001-council-graph-upsert-idempotency-and-self-loop-rejection.md` | Create | DAC-019 |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/08--council-graph-integration/002-council-graph-upsert-empty-input-no-op-success.md` | Create | DAC-020 |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/08--council-graph-integration/003-council-graph-query-hostile-metadata-redaction.md` | Create | DAC-021 |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/08--council-graph-integration/004-council-graph-query-five-modes-prompt-safe-context.md` | Create | DAC-022 |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/08--council-graph-integration/005-council-graph-convergence-three-state-decision-matrix.md` | Create | DAC-023 |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/08--council-graph-integration/006-council-graph-status-recovery-payload-and-readiness.md` | Create | DAC-024 |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/08--council-graph-integration/007-council-graph-derived-projection-rebuilds-from-artifacts.md` | Create | DAC-025 |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/08--council-graph-integration/008-council-graph-tools-registered-separately-from-deep-loop.md` | Create | DAC-026 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 4 MCP tools (`council_graph_upsert/query/status/convergence`) have at least one operator scenario | `rg -l 'council_graph_(upsert\|query\|status\|convergence)' 08--council-graph-integration/` returns ≥4 files |
| REQ-002 | Each of the 5 query modes covered by at least one scenario | DAC-022 enumerates `unresolved_disagreements`, `evidence_chain`, `decision_support`, `convergence_blockers`, `hot_nodes` |
| REQ-003 | Each of the 3 convergence decision buckets covered | DAC-023 exercises `STOP_ALLOWED`, `CONTINUE`, `STOP_BLOCKED` |
| REQ-004 | Stale DAC-011 filename repaired | File `001-graph-support-explicitly-out-of-scope.md` no longer exists; `001-graph-support-derived-and-scoped.md` exists; root playbook §11/§15 reference the new path |
| REQ-005 | Root playbook header metadata current | §1 OVERVIEW reads "26 deterministic scenarios across 8 categories"; coverage note dated 2026-05-11 |
| REQ-006 | `tests/council-graph.vitest.ts` listed in §14 AUTOMATED TEST CROSS-REFERENCE | Grep finds row mapping the test file to DAC-019..DAC-024 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Each new scenario file passes `sk-doc/scripts/validate_document.py` | Exit 0 for each |
| REQ-008 | Strict spec validation passes for packet 103 | `validate.sh --strict` exit 0 |
| REQ-009 | Stale-vocab sweep is clean | `rg -l 'explicitly-out-of-scope' .opencode/skills/deep-ai-council/` returns 0 files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Operator running the new DAC-019..DAC-026 scenarios validates every behavior gated by Phase 003 checklist items CHK-020..CHK-028.
- **SC-002**: Future graph regressions are catchable from the playbook surface alone (without requiring code reads), because each scenario names the exact MCP tool call and expected response shape.
- **SC-003**: Playbook header metadata, count, and cross-reference tables match the on-disk scenario set.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 shipped surface | None (already complete) | Reference `references/graph_support.md` + `handlers/council-graph/*.ts` as anchors |
| Risk | New scenarios drift from actual tool behavior over time | Medium | Anchor each scenario to `tests/council-graph.vitest.ts` test names so test renames trigger playbook updates |
| Risk | sk-doc validator rejects new files | Low | Author files using the proven `07--writer-library-contract/001` template structure |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Plan was approved by user via /remote-control before execution.
<!-- /ANCHOR:questions -->
