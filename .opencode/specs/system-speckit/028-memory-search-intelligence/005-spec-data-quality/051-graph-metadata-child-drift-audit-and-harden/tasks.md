---
title: "Tasks: Audit and harden graph-metadata.json child-drift, where a phase parent's children_ids silently lags the phase-child folders present on disk [template:level_3/tasks.md]"
description: "Eleven tasks across Setup, Implementation and Verification: export the on-disk child set, audit and backfill every drifted parent, add the drift check plus a RED/GREEN test, then re-verify repo-wide."
trigger_phrases:
  - "graph-metadata drift tasks"
  - "children_ids backfill tasks"
  - "drift check red green test"
  - "phase parent audit tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/051-graph-metadata-child-drift-audit-and-harden"
    last_updated_at: "2026-07-06T06:03:21Z"
    last_updated_by: "michel-kerkmeester"
    recent_action: "Authored Level 3 tasks for graph-metadata child-drift audit + harden"
    next_safe_action: "Author checklist.md, decision-record.md and implementation-summary.md for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata.sh"
      - ".opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts"
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/051-graph-metadata-child-drift-audit-and-harden"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Audit and harden graph-metadata.json child-drift, where a phase parent's children_ids silently lags the phase-child folders present on disk

<!-- SPECKIT_LEVEL: 3 -->

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

- [ ] T001 Export the on-disk `^[0-9]{3}-` child-name set from `countPhaseChildren` instead of just its count (`.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts`)
- [ ] T002 [P] Confirm the child-set definition against spec.md's edge cases: support folders (`research/`, `review/`, `scratch/`) excluded, numbered folder must hold `spec.md` or `description.json`
- [ ] T003 [P] Add a report-only `--audit` mode to `check-graph-metadata.sh` for the first repo-wide pass (`.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata.sh`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Run the repo-wide audit and capture every drifted parent with its before/after child counts, including `sk-design` (8 to 9) and `005-spec-data-quality` (13 to current)
- [ ] T005 Overlap-check each drifted parent against the concurrent-session dirty set (git status) before touching it; skip and note any hot parent
- [ ] T006 Backfill every non-hot drifted parent via `backfill-graph-metadata.js`, confirming only `children_ids` and the continuity fingerprint change per parent
- [ ] T007 Add the `children_ids`-vs-on-disk-children drift comparison to `check-graph-metadata.sh`, surfaced under `validate.sh --strict` per the decision-record's severity ruling
- [ ] T008 Write the RED/GREEN fixture test under `.opencode/skills/system-spec-kit/scripts/tests/`: an unlisted child folder fails the check, the same parent post-backfill passes
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Rerun the repo-wide audit and confirm zero drift, including `sk-design` `children_ids` containing `009-sk-design-claude-parity`
- [ ] T010 Run `validate.sh --strict` across the affected parents and confirm the new drift check is clean and produces no false positives on non-parent folders
- [ ] T011 Confirm `decision-record.md` documents severity and flag-vs-auto-regen with rationale, then update `implementation-summary.md` with the final audit numbers
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
