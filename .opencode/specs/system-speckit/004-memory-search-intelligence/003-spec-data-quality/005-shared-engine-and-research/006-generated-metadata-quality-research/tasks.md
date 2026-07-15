---
title: "Tasks: 031 Generated JSON Quality and Safety Research [template:level_2/tasks.md]"
description: "The research task list for the 10-angle read-only generated-JSON quality study, all tasks done. Covers setup, the ten gpt-5.5-fast xhigh angle seats, the skeptical cross-model verification pass and the synthesis into research.md. No generator or parser or schema or validator code modified."
trigger_phrases:
  - "generated json quality research tasks"
  - "safe regeneration research task list"
  - "10-angle read-only research tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/005-shared-engine-and-research/006-generated-metadata-quality-research"
    last_updated_at: "2026-07-04T17:12:06.026Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all research tasks done across the 10 angles"
    next_safe_action: "Operator decides which verified proposals warrant a build phase"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-22-tasks-031-generated-metadata-quality-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 031 Generated JSON Quality and Safety Research

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

**Task Format**: `T### [P?] Description (artifact)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Freeze the research question and the read-only scope (`spec.md`)
- [x] T002 Confirm the live generator, parser, schema, and validator trees as the research substrate (`spec.md`)
- [x] T003 Scope the ten angles across over-reach, exclusion, determinism, the status enum, summary drift, parent integrity, path canonicalization, the global regen, the validator, and the safe-regeneration contract
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Angle seats (10)
- [x] T004 [P] Research the generator over-reach angle, the backfill scope boundary (`research/deltas/`)
- [x] T005 [P] Research the z_future and z_* exclusion residual angle (`research/deltas/`)
- [x] T006 [P] Research the write-determinism angle, description and global-cache idempotency (`research/deltas/`)
- [x] T007 [P] Research the derived.status enum angle, the prose-admitting normalizer (`research/deltas/`)
- [x] T008 [P] Research the causal-summary drift angle, the missing source hashes (`research/deltas/`)
- [x] T009 [P] Research the parent_id and children_ids integrity angle, the merge path (`research/deltas/`)
- [x] T010 [P] Research the specFolder path-format canonicalization angle (`research/deltas/`)
- [x] T011 [P] Research the global descriptions.json regen angle, the scoped upsert (`research/deltas/`)
- [x] T012 [P] Research the first-class generated-metadata validator angle (`research/deltas/`)
- [x] T013 [P] Research the unifying safe-regeneration and identity-resolver contract angle (`research/deltas/`)

### Synthesis (1)
- [x] T014 Dedupe the 40 raw proposals and merge overlapping angles into four safety classes (`research/research.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Group the load-bearing claims into over-reach, idempotency, lineage, and contract sets
- [x] T016 Skeptically cross-check each claim with a claude pass reading the live code
- [x] T017 Downgrade the four over-claims and mark the z_future fix already-done
- [x] T018 Drop any unevidenced proposal from the synthesis
- [x] T019 Rank the 14 entries by priority and benefit over effort into `research/research.md`
- [x] T020 Confirm no generator, parser, schema, or validator code was modified
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Ranked proposal set written to research/research.md
- [x] Load-bearing claims verified by a different model
- [x] checklist.md fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Findings**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
