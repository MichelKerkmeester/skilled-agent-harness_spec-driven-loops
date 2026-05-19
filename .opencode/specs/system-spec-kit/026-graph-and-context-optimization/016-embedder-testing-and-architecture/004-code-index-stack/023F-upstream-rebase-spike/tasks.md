---
title: "Tasks: 023F Upstream cocoindex-code Rebase Spike"
description: "Task tracking for upstream release sweep, local delta classification, scoped wins, verification, and commit."
trigger_phrases:
  - "023F tasks"
  - "upstream delta tasks"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023f-upstream-rebase-spike"
    last_updated_at: "2026-05-19T20:22:26Z"
    last_updated_by: "codex"
    recent_action: "Tracked 023F execution tasks"
    next_safe_action: "Commit intended 023F files once git metadata is writable"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:390967f977d1f9c9636af9f37d2620f4346f24697de7a4caaccffbf05c1da697"
      session_id: "023f-upstream-rebase-spike"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: 023F Upstream cocoindex-code Rebase Spike

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Confirm Gate 3 answer E and spec packet path.
- [x] T002 Load relevant skill workflows.
- [x] T003 [P] Query upstream release metadata.
- [x] T004 [P] Clone upstream `cocoindex-code` read-only.
- [x] T005 [P] Read local fork source and tests before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Write `research/upstream-sweep.md`.
- [x] T007 Write `research/delta-classification.md`.
- [x] T008 Write `research/dimensions-knob-removal-impact.md`.
- [x] T009 Write `research/rebase-plan.md`.
- [x] T010 Write `research/cross-packet-impact.md`.
- [x] T011 Pin `sentence-transformers==5.4.1`.
- [x] T012 Add Svelte/Vue default include patterns.
- [x] T013 Add Svelte/Vue pattern regression test.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run targeted tests.
- [x] T015 Run full pytest.
- [x] T016 Run ruff.
- [x] T017 Generate `description.json` and `graph-metadata.json`.
- [x] T018 Run strict spec validation.
- [ ] T019 Commit intended files only. Blocked: `.git` is not writable in the current sandbox.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Required code verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Research**: See `research/*.md`.
- **Verification**: See `checklist.md` and `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
