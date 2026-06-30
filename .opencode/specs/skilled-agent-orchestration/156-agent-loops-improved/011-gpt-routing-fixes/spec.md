---
title: "Feature Specification: GPT Routing Fixes"
description: "Implement the validator-first hardening from phase 010 research so GPT-backed deep research/review loops reject malformed iteration statuses instead of accepting fabricated or drifted state."
trigger_phrases:
  - "gpt routing fixes"
  - "deep-loop validator hardening"
  - "jsonl invalid status"
  - "011 gpt routing fixes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/011-gpt-routing-fixes"
    last_updated_at: "2026-06-30T10:05:30Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Planned implementation from 010 deep-research synthesis"
    next_safe_action: "Implement validator status-enum hardening with tests"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts"
      - ".opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts"
      - ".opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "011-gpt-routing-fixes-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should narrative file hashing be included in this patch or deferred?"
    answered_questions:
      - "First implementation scope is research/review status-enum validator hardening only."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: GPT Routing Fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-30 |
| **Branch** | `main` |
| **Parent Packet** | `skilled-agent-orchestration/156-agent-loops-improved` |
| **Predecessor** | `../010-gpt-deep-agent-routing` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase `010-gpt-deep-agent-routing` found that GPT-backed deep research/review loops can drift from the workflow contract by accepting malformed iteration state. Real archived drift included JSONL iteration records without canonical iteration files and fabricated statuses such as `complete-salvaged`. The current shared post-dispatch validator requires a `status` field but does not enforce the canonical status enum for research/review iteration records.

### Purpose

Add the smallest repo-resident validator hardening that rejects invalid research/review iteration statuses and preserves canonical iteration-file validation, making state drift visible before reducer/synthesis code accepts it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add explicit status-enum validation for deep-research and deep-review iteration records.
- Add a `jsonl_invalid_status` failure reason or equivalent diagnostic in `post-dispatch-validate.ts`.
- Update unit/integration tests that currently accept non-canonical status values.
- Preserve existing checks for canonical iteration-file existence, non-empty files, canonical JSONL type, required fields, and delta-file records.

### Out of Scope

- Host-runtime enforcement of per-agent `subagent_type` or hard deep-agent identity.
- Native-to-CLI executor flip (FIX-5), except as a documented follow-up.
- Deep-context status normalization; it currently uses `status: "evidence"` and needs separate design.
- Deep-ai-council session/topic validator design.
- Narrative markdown content-hash linkage unless implementation discovers an already-suitable helper with low risk.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Modify | Enforce allowed research/review iteration statuses and diagnostic reason. |
| `.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts` | Modify | Add valid/invalid status coverage and update stale fixtures. |
| `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts` | Modify | Update review fixture status expectations if they flow through the shared validator. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modify if needed | Surface/align new failure reason text. |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Modify if needed | Surface/align new failure reason text. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reject invalid research/review iteration statuses | Validator returns failure for `status: "continue"` or `status: "complete-salvaged"`. |
| REQ-002 | Preserve accepted canonical statuses | Validator accepts `complete`, `timeout`, `error`, `stuck`, `insight`, and `thought` when all other required outputs are valid. |
| REQ-003 | Keep existing artifact checks intact | Existing tests for missing/empty iteration file, missing fields, wrong type, and delta failures still pass. |
| REQ-004 | Update tests before completion claim | Unit/integration test suite covering post-dispatch validation passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Align YAML failure-reason documentation | Research/review YAML failure reason references include the new invalid-status reason when needed. |
| REQ-006 | Document deferrals | Plan/implementation summary state why deep-context, deep-ai-council, host-runtime identity, and CLI-prevention are deferred. |
| REQ-007 | Keep implementation minimal | No unrelated deep-loop refactors, no host-runtime changes, no broad status abstraction unless tests prove it is necessary. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Invalid iteration status values fail validation with a named diagnostic.
- **SC-002**: All six canonical research/review statuses pass validation with otherwise valid artifacts.
- **SC-003**: Deep-research and deep-review validation behavior is aligned; deep-context and deep-ai-council remain explicitly deferred.
- **SC-004**: Validation and relevant tests pass before implementation is marked complete.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing fixtures use `continue` | Tests fail after enum enforcement | Update fixtures or isolate mode-specific records with evidence. |
| Risk | Deep-context/council status shapes differ | Over-broad enum breaks other loops | Scope first patch to research/review shared validator semantics only. |
| Risk | Failure reason surfaces drift | Operators get vague schema errors | Add `jsonl_invalid_status` to union/tests and YAML references if required. |
| Dependency | Phase 010 synthesis | Provides evidence and scope | Use `../010-gpt-deep-agent-routing/research/research.md` as source of truth. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Validator hardening must remain O(1) over the last appended iteration record.
- **NFR-P02**: No additional MCP, subprocess, or broad file scan is introduced in post-dispatch validation.

### Security
- **NFR-S01**: Invalid or fabricated status values must fail closed before reducer/synthesis can treat the iteration as valid.
- **NFR-S02**: No user-provided prompt text is parsed as a command or status source.

### Reliability
- **NFR-R01**: Existing validator diagnostics remain backward compatible except for intentionally invalid status values.
- **NFR-R02**: Test coverage must catch both invalid-status rejection and valid-status acceptance.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing status: existing `jsonl_missing_fields` remains the failure.
- Non-string status: invalid status should fail with the new diagnostic.
- Unknown string status: invalid status should fail with the new diagnostic.

### Error Scenarios
- State log does not grow: existing `jsonl_not_appended` wins.
- Last record is wrong type: existing `jsonl_wrong_type` wins.
- Delta file missing/empty/missing iteration record: existing delta diagnostics win after status passes.

### State Transitions
- Partial implementation: stop before completion claim if any validator tests fail.
- Future context/council validators: defer to separate phase or subtask; do not overload this enum.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | One runtime validator plus tests and YAML reason references. |
| Risk | 11/25 | Shared runtime path affects research/review and stale fixtures. |
| Research | 4/20 | Phase 010 completed required research. |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should narrative file hash linkage be included now, or deferred until a broader integrity sidecar design exists?
- Should deep-context eventually adopt the six-status vocabulary or keep `evidence` behind a mode-specific validator?
- Should deep-ai-council gain a dedicated session/topic validator in a separate phase?
<!-- /ANCHOR:questions -->
