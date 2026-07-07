---
title: "Tasks: Migration From system-speckit"
description: "Task Format: T### [P?] Description (batch)"
trigger_phrases:
  - "tasks"
  - "migration"
  - "skill-advisor"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/000-migration-from-system-speckit"
    last_updated_at: "2026-07-07T15:10:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Marked all tasks complete after verification pass and gap fixes"
    next_safe_action: "None required; packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-07-07-skill-advisor-extraction"
      parent_session_id: null
    completion_pct: 97
    open_questions: []
    answered_questions: []
---
# Tasks: Migration From system-speckit

<!-- SPECKIT_LEVEL: 3 -->
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

**Task Format**: `T### [P?] Description (batch)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Author spec.md with the full migration manifest
- [x] T002 Author plan.md, tasks.md, checklist.md, decision-record.md
- [x] T003 Generate description.json + graph-metadata.json for this tracking folder
- [x] T004 Scoped commit of the tracking folder (explicit paths, never `git add -A`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Batch 2a: 026 primary hub extraction

- [x] T005 `git mv` the 6 direct children of `026/002-spec-kit-internals/002-skill-advisor/` to `system-skill-advisor/001-006`
- [x] T006 Rewrite cross-references (`children_ids`, `packet_pointer`, `Branch:` frontmatter) for the moved subtree
- [x] T007 Regenerate `description.json` + `graph-metadata.json` for `system-skill-advisor/001-006` and their nested children
- [x] T008 Reconcile `026/002-spec-kit-internals/` `children_ids` (drop `002-skill-advisor`)
- [x] T009 `validate.sh --strict --recursive` on `system-skill-advisor/001-006`

### Batch 2b: Scattered leaves + embedder-stack cluster

- [x] T010 Re-read `003-advisor-adjacent-116-realignment` and `006-shared-embedder-logic-with-spec-memory` spec.md content to confirm filing decisions
- [x] T011 Append 4 hardening leaves into `system-skill-advisor/004-skill-advisor-production-hardening/` as `005-008`
- [x] T012 Append affordance-evidence leaf into `system-skill-advisor/003-skill-advisor-routing-engine/` as `006`
- [x] T013 Merge 3 embedder-stack folders into new `system-skill-advisor/007-skill-advisor-embedder-stack/`
- [x] T014 Reconcile the 5-6 source parents in 026 this touches
- [x] T015 `validate.sh --strict --recursive` on `026/` and `system-skill-advisor/003, 004, 007`

### Batch 2c: 027 content extraction

- [x] T016 `git mv` `027/.../003-skill-advisor-cli/` to `system-skill-advisor/008-skill-advisor-cli/`
- [x] T017 Extract 8 advisor-only items from `027/003-advisor-and-codegraph/` into `system-skill-advisor/009-advisor-and-codegraph-migrated-items/`
- [x] T018 `git mv` `027/.../021-system-skill-advisor` to `system-skill-advisor/010-skill-advisor-frontmatter-alignment/`
- [x] T019 Renumber `027/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph`'s remaining children `001-004`, update parent spec.md prose
- [x] T020 Reconcile `027/004-shared-infrastructure/001-mcp-to-cli-tool-transition/` and `027/000-release-cleanup/009-skill-frontmatter-alignment/` (contiguous renumber, 20+ siblings)
- [x] T021 `validate.sh --strict --recursive` on `027/` and `system-skill-advisor/008-010`

### Batch 2d: 028 hub + destination renumber

- [x] T022 `git mv` `028/002-skill-advisor/` to `system-skill-advisor/011-skill-advisor-phase-parent/`
- [x] T023 Renumber `028`'s remaining top-level children `003→002, 004→003, 005→004, 006→005`
- [x] T024 Rename `system-skill-advisor/001-skill-advisor-tuning/` to `012-skill-advisor-tuning/`, fix all `001`-referencing metadata fields to `012`
- [x] T025 `validate.sh --strict --recursive` on `028/` and `system-skill-advisor/011-012`

### Batch 2e: Destination track finalization

- [x] T026 Rewrite `system-skill-advisor/spec.md` (track root) to narrate the full 001-012 history
- [x] T027 Write `system-skill-advisor/context-index.md` documenting the 6 left-in-place shared/joint items
- [x] T028 Regenerate `system-skill-advisor/description.json` + `graph-metadata.json` for the full 001-012 children set
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T029 `validate.sh --strict --recursive` clean on `system-skill-advisor/`, `026/`, `027/`, `028/`
- [x] T030 Repo-wide `rg` for every old path fragment returns zero live hits
- [ ] T031 Scoped `memory_index_scan` per moved path (never full-tree) - DEFERRED: daemon-contention class of follow-up, matches existing pending reindex work already tracked in the 028 handover; not blocking
- [x] T032 Update this packet's own `implementation-summary.md` with final state and evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (except T031, explicitly deferred with documented reason)
- [x] No `[B]` blocked tasks remaining
- [x] `validate.sh --strict --recursive` clean on every touched folder (0 hard errors beyond documented, unfixable track-root and pre-existing content-quality debt)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
