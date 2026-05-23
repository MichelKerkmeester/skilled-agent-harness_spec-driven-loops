---
title: "Tasks: 116/004 — Validator v2 Enforcement"
description: "Level 3 task list for warnings-first review-depth validator enforcement."
trigger_phrases:
  - "116 validator v2 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/004-complexity-validator-v2-enforcement"
    last_updated_at: "2026-05-22T12:10:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Implemented validator v2 warnings and enforcement surface."
    next_safe_action: "Verify and handoff."
---
# Tasks: 116/004 — Validator v2 Enforcement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 Setup | T001-T004 | Read contracts |
| M2 Validator | T010-T018 | Runtime behavior |
| M3 Workflow | T020-T022 | Advisory surface |
| M4 Verification | T030-T034 | Evidence |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read Phase 001 research synthesis.
- [x] T002 Read Phase 003 schema and prompt contract.
- [x] T003 Read `post-dispatch-validate.ts`.
- [x] T004 Read workflow YAML validator sections.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Add `PostDispatchAdvisory` type.
- [x] T011 Extend `PostDispatchValidateResult` with optional warnings.
- [x] T012 Add v2 discriminator detection.
- [x] T013 Add legacy non-trivial warning heuristic.
- [x] T014 Add v2 applicability, target selection, and search coverage checks.
- [x] T015 Add ledger evidence and linked-finding checks.
- [x] T016 Add active `findingDetails` depth checks.
- [x] T017 Add state-log/delta iteration identity check.
- [x] T018 Add `DEEP_REVIEW_V2_ENFORCEMENT` rollout modes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Add v2 failure reasons to auto YAML.
- [x] T021 Add v2 failure reasons to confirm YAML.
- [x] T022 Document `schema_advisory` warning event recipe.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Evidence Capture

- [x] T030 Run validator/reducer fixture tests. [Evidence: package-local Vitest run passed 2 files, 2 tests, 4 todos]
- [x] T031 Run `post-dispatch-validate` regression tests. [Evidence: package-local Vitest passed 1 file, 14 tests]
- [x] T032 Run `prompt-pack` regression tests. [Evidence: package-local Vitest passed 1 file, 11 tests]
- [x] T033 Run strict validation for 004. [Evidence: `validate.sh .../004-validator-v2-enforcement --strict` passed]
- [x] T034 Record evidence in implementation summary and checklist. [Evidence: `implementation-summary.md` and `checklist.md` updated]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Validator fixtures pass.
- [x] Legacy validator tests pass.
- [x] Workflow advisory surface documented.
- [x] Checklist evidence is updated.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision record**: `decision-record.md`
<!-- /ANCHOR:cross-refs -->
