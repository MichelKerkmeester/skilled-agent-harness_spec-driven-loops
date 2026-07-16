---
title: "Tasks: CLI Compact Output and Shell Completion"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "005-cli-automation-compact-completion tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux/005-cli-automation-compact-completion"
    last_updated_at: "2026-06-11T01:50:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed compact output and shell completion tasks"
    next_safe_action: "Use automation-friendly CLI modes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-005-cli-automation-compact-completion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CLI Compact Output and Shell Completion

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

- [x] T001 Confirm the manifest sources (`TOOL_DEFINITIONS`, `CODE_GRAPH_TOOL_SCHEMAS`, advisor manifest) as the single source for both compact output and completion.
- [x] T002 Define the compact JSON field set (names + light metadata, no full `inputSchema`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Add `--compact`/`--names-only` list-tools mode to `spec-memory-cli.ts:463-481`.
- [x] T004 [P] Add `--compact`/`--names-only` list-tools mode to `code-index-cli.ts:542-562`.
- [x] T005 [P] Add `--compact`/`--names-only` list-tools mode to `skill-advisor-cli.ts:705-725`.
- [x] T006 Generate bash/zsh shell completion from the tool manifests.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Verify compact JSON omits the full schema and keeps 37/8/9 counts.
- [x] T008 Verify completion lists current tool names per CLI and reflects manifest changes on regeneration.
- [x] T009 Verify compact names stay consistent with the existing alias map.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
