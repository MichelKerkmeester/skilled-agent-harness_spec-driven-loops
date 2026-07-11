---
title: "Tasks: Phase 5 — Registration Touchpoints & Multi-Language Routing"
description: "Execution checklist for the six Rust registration touchpoints and the touched-language-set change."
trigger_phrases:
  - "018 phase 005 tasks"
  - "touchpoints multilang tasks rust"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/005-touchpoints-and-multilang"
    last_updated_at: "2026-07-11T08:53:41Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded this phase task list from the 018 research manifest"
    next_safe_action: "Execute T001 (locate each touchpoint's Rust-relevant block)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5 — Registration Touchpoints & Multi-Language Routing

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

- [ ] T001 Locate each touchpoint's Rust-relevant block (detection tables, language sets, fixtures)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 [P] `stack_detection.md`: add the RUST detection row
- [ ] T003 [P] `hub-router.json`: extend the code-opencode-runtime vocabulary with Rust terms
- [ ] T004 [P] `verify_stack_folders.py`: add `rust` to KNOWN_LANGUAGES
- [ ] T005 `verify_alignment_drift.py`: add `.rs -> rust` + Rust checks; update its test
- [ ] T006 `router-replay.cjs`: surface regex, OPENCODE_LANGUAGES, Rust detection + fixtures
- [ ] T007 [P] shared trio: Rust in `universal_patterns.md` + `code_organization.md`
- [ ] T008 Change first-match selection to a touched-language set; add Rust+TypeScript fixtures
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verifiers exit 0 for a `references/rust/` folder
- [ ] T010 Router-replay Rust + Rust+TypeScript fixtures select the right trios; no existing-language regression
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All six touchpoints recognize Rust
- [ ] No `[B]` blocked tasks remaining
- [ ] Touched-language set works; no regression
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: spec.md
- **Plan**: plan.md
- **Manifest**: ../001-research/research/research.md (Deliverable 2D)
<!-- /ANCHOR:cross-refs -->
