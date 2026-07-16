---
title: "Tasks: Reindex the renamed system-deep-loop 036 router-replay-surface-slice-sync and 037 scenario-loader-code-surface-sync folders and repoint their stale copied metadata identifiers and inbound references [template:level_1/tasks.md]"
description: "Nine tasks across Setup, Implementation and Verification: overlap-check, regenerate both folders' metadata, fix internal and inbound references, then grep-verify zero remaining old-slug matches."
trigger_phrases:
  - "deep-loop 036 037 reindex tasks"
  - "stale identifier fix tasks"
  - "harness dependencies repoint tasks"
  - "router-replay rename tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/019-deep-loop-036-037-reindex"
    last_updated_at: "2026-07-06T08:49:49.047Z"
    last_updated_by: "michel-kerkmeester"
    recent_action: "Authored Level 1 tasks for the deep-loop 036/037 folder-rename reindex"
    next_safe_action: "Author implementation-summary.md for this phase"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/036-router-replay-surface-slice-sync/description.json"
      - ".opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync/description.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/053-deep-loop-036-037-reindex"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Reindex the renamed system-deep-loop 036 router-replay-surface-slice-sync and 037 scenario-loader-code-surface-sync folders and repoint their stale copied metadata identifiers and inbound references

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

- [x] T001 Confirmed via `git status`: 036/037 are the operator's own uncommitted rename (old `037-router-replay`/`038-scenario-loader` deleted, new folders untracked), not a concurrent edit
- [x] T002 [P] Confirmed the stale IDs: `036`'s metadata said `037-router-replay`/specId 037; `037`'s said `038-scenario-loader`/specId 038
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Regenerated `description.json` for `036`: specFolder/specId now `036`, folderSlug corrected
- [x] T004 Regenerated `description.json` for `037`: specFolder/specId now `037`, folderSlug corrected
- [x] T005 Regenerated `graph-metadata.json` for both; `status: complete` and `importance_tier: high` preserved, and `last_updated_at` pinned to `last_save_at` to clear CONTINUITY_FRESHNESS
- [x] T006 Fixed the old-slug references inside `036`'s five docs
- [x] T007 Fixed the old-slug references inside `037`'s five docs
- [x] T008 Repointed both "Harness dependencies" bullets to the new `036`/`037` slugs (021 tracked; 022 is the concurrent session's untracked file, fixed in the working tree, left for that session to commit)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Grep confirmed zero remaining old-slug matches in both folders and the inbound files; both folders validate `--strict` 0/0; `implementation-summary.md` updated
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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
