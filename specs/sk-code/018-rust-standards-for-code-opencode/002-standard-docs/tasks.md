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
    last_updated_at: "2026-07-11T09:32:39Z"
    last_updated_by: "claude-code"
    recent_action: "Marked all phase-002 tasks complete with authoring evidence"
    next_safe_action: "Wire Rust surface routing in code-opencode/SKILL.md (phase 003)"
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

- [x] T001 Read `research.md` Deliverables 1 + 3 and the existing `typescript`/`python` trios as structural references — agents mirrored the TS trio's frontmatter, section, and footer shape
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Author `references/rust/style_guide.md` (idioms, API design, error handling, module/workspace layout) — 1987 lines, napi/wasm/thiserror present
- [x] T003 [P] Author `references/rust/quality_standards.md` (P0/P1/P2: lint tiers, testing/parity, determinism, unsafe, supply-chain) — 1475 lines, clippy DENY list + parity + SAFETY + BTreeMap present
- [x] T004 [P] Author `references/rust/quick_reference.md` (recipes, templates, gate command sequence) — 1571 lines, boundary module template + gate sequence present
- [x] T005 Author `assets/checklists/rust_checklist.md` (P0/P1/P2 checkboxes + review-evidence template) — 1005 lines, 51 checkboxes, mirrors typescript_checklist.md
- [x] T006 Author `manual_testing_playbook/language-standards/004-rust-standards.md` (`expected_intent: RUST`) — OC-004, three expected_resources, mirrors the TS sibling
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm each file matches the Deliverable 3 section-skeleton/placement map — structure mirrors the `references/typescript/` trio and `typescript_checklist.md` siblings
- [x] T008 Confirm the four non-negotiables are present and each names its parity/interop contract — `byte-for-byte` 21–25×, `SAFETY` 5–19×, stability-contract 4–20×, `panic` 7–11× across the trio
- [x] T009 Confirm no routing/registration file was touched — `git status` shows only the five new content paths
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All five files authored — `git status` shows the five new content paths (`references/rust/` trio, `rust_checklist.md`, `004-rust-standards.md`)
- [x] No `[B]` blocked tasks remaining — all T001–T009 marked `[x]`
- [x] Conformance and non-negotiable checks pass — T007/T008 evidence above; `validate.sh --strict` Errors: 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: spec.md
- **Plan**: plan.md
- **Manifest**: ../001-research/research/research.md (Deliverables 1 + 3)
<!-- /ANCHOR:cross-refs -->
