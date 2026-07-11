---
title: "Tasks: Phase 3 — Surface Detection & Routing"
description: "Execution checklist for the code-opencode SKILL.md Rust routing edits."
trigger_phrases:
  - "018 phase 003 tasks"
  - "code-opencode routing tasks rust"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/003-surface-routing"
    last_updated_at: "2026-07-11T08:53:41Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded this phase task list from the 018 research manifest"
    next_safe_action: "Execute T001 (locate live SKILL.md routing lines)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3 — Surface Detection & Routing

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

- [ ] T001 Locate the live SKILL.md detection, INTENT_SIGNALS, RESOURCE_MAP, and CODE_QUALITY lines (re-anchor off the research estimates)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Add `.rs` + `Cargo.toml`/`Cargo.lock` detection after surface selection
- [ ] T003 Add the `RUST` INTENT_SIGNALS entry (keyword list from Deliverable 2B)
- [ ] T004 Add the `RUST` RESOURCE_MAP entry (references/rust/*)
- [ ] T005 Register `rust_checklist.md` under CODE_QUALITY + the human-facing reference map
- [ ] T006 Add the surface-wide Rust non-negotiable line
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Confirm every routed RUST path exists (phase 002 files)
- [ ] T008 Confirm no existing-language intent/resource regressed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Detection + RUST routing + checklist registration applied
- [ ] No `[B]` blocked tasks remaining
- [ ] No existing-language regression
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: spec.md
- **Plan**: plan.md
- **Manifest**: ../001-research/research/research.md (Deliverable 2B)
<!-- /ANCHOR:cross-refs -->
