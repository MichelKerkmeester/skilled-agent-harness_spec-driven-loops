---
title: "Tasks: Phase 2 — Author the Rust Standard Docs"
description: "Execution checklist for authoring the Rust reference trio, checklist, and playbook entry from research.md."
trigger_phrases:
  - "018 phase 002 tasks"
  - "rust standard docs checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/002-standard-docs"
    last_updated_at: "2026-07-11T08:53:41Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded this phase task list from the 018 research manifest"
    next_safe_action: "Execute T001 (author style_guide.md)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2 — Author the Rust Standard Docs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read `research.md` Deliverables 1 + 3 and the existing `typescript`/`python` trios as structural references
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 [P] Author `references/rust/style_guide.md` (idioms, API design, error handling, module/workspace layout)
- [ ] T003 [P] Author `references/rust/quality_standards.md` (P0/P1/P2: lint tiers, testing/parity, determinism, unsafe, supply-chain)
- [ ] T004 [P] Author `references/rust/quick_reference.md` (recipes, templates, gate command sequence)
- [ ] T005 Author `assets/checklists/rust_checklist.md` (P0/P1/P2 checkboxes + review-evidence template)
- [ ] T006 Author `manual_testing_playbook/language-standards/004-rust-standards.md` (`expected_intent: RUST`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Confirm each file matches the Deliverable 3 section-skeleton/placement map
- [ ] T008 Confirm the four non-negotiables are present and each names its parity/interop contract
- [ ] T009 Confirm no routing/registration file was touched
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All five files authored
- [ ] No `[B]` blocked tasks remaining
- [ ] Conformance and non-negotiable checks pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: spec.md
- **Plan**: plan.md
- **Manifest**: ../001-research/research/research.md (Deliverables 1 + 3)
<!-- /ANCHOR:cross-refs -->
