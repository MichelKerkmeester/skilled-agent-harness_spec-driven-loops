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
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/053-deep-loop-036-037-reindex"
    last_updated_at: "2026-07-06T06:03:39Z"
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

- [ ] T001 Confirm via `git status` that neither `036-router-replay-surface-slice-sync` nor `037-scenario-loader-code-surface-sync` is being actively edited by a concurrent session
- [ ] T002 [P] Confirm the exact old-slug strings currently present in each folder's `description.json`/`graph-metadata.json`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Regenerate `description.json` for `system-deep-loop/036-router-replay-surface-slice-sync` against its new path (`specFolder`/`specId: "036"`/`folderSlug`)
- [ ] T004 Regenerate `description.json` for `system-deep-loop/037-scenario-loader-code-surface-sync` against its new path (`specFolder`/`specId: "037"`/`folderSlug`)
- [ ] T005 Regenerate `graph-metadata.json` for both folders against their new paths, verifying `status: "complete"` and `importance_tier: "high"` are preserved
- [ ] T006 Fix every internal reference to the old slug inside `036`'s own five docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
- [ ] T007 Fix every internal reference to the old slug inside `037`'s own five docs
- [ ] T008 Repoint the "Harness dependencies" bullet at `124-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline/spec.md:178` and `124-sk-code-parent/022-collapse-to-four-subskills/spec.md:191` to the new `036`/`037` slugs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Grep both folders and the two inbound files for the old slugs and confirm zero remaining matches, then update `implementation-summary.md`
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
