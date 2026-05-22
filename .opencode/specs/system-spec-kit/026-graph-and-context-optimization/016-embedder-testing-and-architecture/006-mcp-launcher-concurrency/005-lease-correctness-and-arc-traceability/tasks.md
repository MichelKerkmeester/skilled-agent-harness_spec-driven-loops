---
title: "Tasks: Lease Correctness and Arc Traceability"
description: "Task list for closing the 13 deep-review P1 findings in Phase 005."
trigger_phrases:
  - "012/005 tasks"
  - "lease correctness tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/005-lease-correctness-and-arc-traceability"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored task list"
    next_safe_action: "Complete verification tasks"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
---
# Tasks: Lease Correctness and Arc Traceability

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

- [x] T001 Confirm branch remains `main`.
- [x] T002 Read relevant spec-kit, sk-code, and cli-codex skill instructions.
- [x] T003 Inspect frozen-scope launchers, tests, docs, and child specs before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Align child status and parent invariant documentation.
- [x] T005 Add or verify strict validate evidence for 001 and 004.
- [x] T006 Correct 002 race-protection text and 003 REQ-009 coverage text.
- [x] T007 Add launcher-lease REQ anchors.
- [x] T008 Add skill-advisor spawn-twice and stale-PID coverage.
- [x] T009 Cover watcher and rebuild DB-open paths for WAL plus busy_timeout.
- [x] T010 Move affected launcher lease paths to resolved DB directories.
- [x] T011 Widen SQLite WAL fallback error matching.
- [x] T012 Add unconditional launcher cleanup on exit.
- [x] T013 Author phase 005 Level 2 docs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Generate `description.json` and `graph-metadata.json`.
- [x] T015 Run strict validate for phase 005.
- [x] T016 Run strict validate for the arc parent.
- [x] T017 Run skill-advisor typecheck.
- [x] T018 Run skill-advisor focused launcher vitest.
- [x] T019 Run code-graph launcher vitest.
- [x] T020 Run spec-kit launcher vitest.
- [x] T021 Run full skill-advisor vitest suite and record count.
- [x] T022 Stage explicit paths only and commit once on main. Evidence: main agent committed `bd8a90747` on 2026-05-18 with subject `feat(012/005): close lease correctness and traceability findings`; commit summary was 24 files changed, 1319 insertions(+), 72 deletions(-). Main agent executed the final commit after codex sandbox blocked `.git/index.lock` (worktree changes were complete; only git index write was blocked).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Verification evidence copied into `checklist.md` and `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
