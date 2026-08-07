---
title: "Tasks: Phase 4 — Parent-Hub Union & Drift Guard"
description: "Execution checklist for the smart_routing.md parent union edits and the drift-guard vitest."
trigger_phrases:
  - "018 phase 004 tasks"
  - "parent union drift guard tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/004-parent-union-drift-guard"
    last_updated_at: "2026-07-11T08:53:41Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded this phase task list from the 018 research manifest"
    next_safe_action: "Execute T001 (locate smart_routing.md union block)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4 — Parent-Hub Union & Drift Guard

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

- [x] T001 Locate the `smart_routing.md` RESOURCE_MAP, INTENT_SIGNALS, and overlay blocks + the parent-owned allowlist in the drift-guard vitest — machine block L308, `INTENT_SIGNALS` L319, `RESOURCE_MAP` L341, §6 overlay L193; `loadSurfaceRouter` confirmed to read `smart_routing.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add the re-prefixed RUST RESOURCE_MAP entry (code-opencode/references/rust/*) — parent `RESOURCE_MAP["RUST"]` = the three `code-opencode/references/rust/*` paths
- [x] T003 Add `code-opencode/assets/checklists/rust_checklist.md` under parent CODE_QUALITY — appended after `shell_checklist.md`, before the code-review checklist
- [x] T004 Add the parent RUST intent + human-facing overlay row — parent `RUST` `INTENT_SIGNALS` (12 kw) + §6 Language-overlay `RUST` row added
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run `npx vitest run .../sk-code-router-sync.vitest.ts`; confirm exit 0 — `vitest` reports 7/7 pass (was 1 failed with the 4-path overExtraction before this phase)
- [x] T006 Confirm parent map equals the re-prefixed child union + allowlist; no orphan Rust path — 7/7 green: `overExtraction`, `uncovered`, and `tierViolations` all empty
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Parent union + CODE_QUALITY + overlay applied — 4 `smart_routing.md` edits (T002–T004)
- [x] No `[B]` blocked tasks remaining — all T001–T006 marked `[x]`
- [x] Drift-guard vitest green — `sk-code-router-sync.vitest.ts` 7/7 pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: spec.md
- **Plan**: plan.md
- **Manifest**: ../001-research/research/research.md (Deliverable 2C + Gate 1)
<!-- /ANCHOR:cross-refs -->
