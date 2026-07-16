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
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/017-graph-metadata-child-drift-audit-and-harden"
    last_updated_at: "2026-07-06T12:51:15.752Z"
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

- [x] T001 Exported the on-disk child-name set from `is-phase-parent.ts` as `listDerivedChildNames()`, mirroring the graph-metadata writer's enumeration (not `countPhaseChildren`; see implementation-summary)
- [x] T002 [P] Confirmed the child-set definition: the writer's name-only `^\d{3}(?:[-_].+)?$`, NOT "must hold spec.md/description.json" (that stricter rule false-positives on real metadata-less children, e.g. `026/007`'s `031`)
- [x] T003 [P] Repo-wide audit run via a standalone scanner (21 drifted parents); the durable repo-wide mechanism is the per-parent `GRAPH_METADATA_CHILD_DRIFT` rule under recursive `validate.sh`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Ran the repo-wide audit: 21 drifted parents, split into genuine "missing" drift (`sk-design` 009, `system-deep-loop` 036/037, `barter`, `skilled-agent-orchestration` 124/125) and metadata-less-folder false positives
- [x] T005 Overlap-checked the drifted parents; every genuine drift is owned by a concurrent session, another phase, or another project
- [ ] T006 [DEFERRED] Backfill has no safe targets now: `sk-design/009` (active session), `system-deep-loop/036,037` (phase 053 + concurrent), `barter` (other project), `skilled-agent-orchestration/124,125` (hot). The check surfaces each for reconciliation when its owner releases it
- [x] T007 Added the `children_ids`-vs-on-disk drift comparison as the `GRAPH_METADATA_CHILD_DRIFT` registry rule, advisory-by-default under `--strict`, enforce behind `SPECKIT_CHILD_DRIFT_ENFORCE`
- [x] T008 RED/GREEN test written and passing 8/8, including two default-path (orchestrator) integration cases
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 [DEFERRED WITH T006] Cannot confirm zero drift while the backfill is deferred; `sk-design`'s `009` stays unlisted until the active 009 session ships that folder's own metadata
- [x] T010 `validate.sh --strict` confirmed: the check fires in the default path, adds zero warnings advisory, warns under enforce, and does not false-positive on `026/007` or clean parents
- [x] T011 `decision-record.md` documents the severity/flag decision; `implementation-summary.md` records the audit numbers, the definition correction, and the deferred backfill
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
