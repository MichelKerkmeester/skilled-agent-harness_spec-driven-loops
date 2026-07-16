---
title: "Tasks: z_future Always Ignored In Backfill [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "z future always ignored"
  - "backfill graph metadata exclusion"
  - "excluded dirs z future"
  - "backfill dist rebuild"
  - "collectSpecFolders staging skip"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/032-z-future-always-ignored"
    last_updated_at: "2026-07-04T17:12:03.578Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Edited the exclusion set and comment, rebuilt dist"
    next_safe_action: "Verify z_archive parity and a clean dry-run"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
      - ".opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: z_future Always Ignored In Backfill

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

- [x] T001 Confirm the root cause, the conditional z_future skip lets a default walk enter the staging area and throw (`.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`)
- [x] T002 [P] Confirm z_archive must stay included by default and skippable via --active-only
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add z_future to the EXCLUDED_DIRS set so the walk unconditionally prunes it (`.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`)
- [x] T004 Correct the header comment to state z_future is always skipped while z_archive stays included by default and skippable via --active-only (`.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`)
- [x] T005 Rebuild the dist via tsc from the corrected source (`.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Confirm collectSpecFolders on the specs root returns zero z_future folders and no longer throws (`.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`)
- [x] T007 Confirm z_archive parity, included by default and excluded under --active-only
- [x] T008 Confirm a default backfill dry-run exits 0 with no z_future or supported-specs-root mention (`.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js`)
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
