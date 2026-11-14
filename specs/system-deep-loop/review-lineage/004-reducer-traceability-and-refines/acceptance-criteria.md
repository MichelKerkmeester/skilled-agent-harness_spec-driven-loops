---
title: "Acceptance Criteria: Correct deep-review reducer dead ends and refinement counting"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "reducer traceability and refines acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/review-lineage/004-reducer-traceability-and-refines"
    last_updated_at: "2026-11-14T17:20:00Z"
    last_updated_by: "planner"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Build the planned reducer change and tests"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planner-004-reducer-traceability-and-refines"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Correct deep-review reducer dead ends and refinement counting

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 004-reducer-traceability-and-refines
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an iteration with a `Traceability Checks` section and no `Dead Ends` section, When the reducer regenerates the strategy, Then no `checklist_evidence`, `feature_catalog_code`, `agent_cross_runtime` or `playbook_capability` line appears as BLOCKED | `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-traceability-and-refines.test.cjs` case `traceability checks do not become blocked dead ends` passes | Unmet | - |
| AC-002 | REQ-002 | Given an iteration with an explicit `Dead Ends` entry, When the reducer regenerates the strategy, Then that entry prints as `### ... -- BLOCKED` | The same test case asserts the explicit dead-end entry is present | Unmet | - |
| AC-003 | REQ-003 | Given a run with `R1-P2-001` and a later `findingDetails` row that names `refines: "R1-P2-001"` with a new title, When the registry is built, Then `openFindingsCount` is 1, `lastSeen` is the later run, the title is the refinement title, and one refinement transition is present | `node --test` case `a refines row folds into its target` passes and prints `# fail 0` in the summary | Unmet | - |
| AC-004 | REQ-003 | Given the same folded finding, When the churn buckets are read, Then `severityChanged` holds no entry and `persistentSameSeverity` holds the finding | The refines case asserts both bucket results | Unmet | - |
| AC-005 | REQ-004 | Given a run that reuses `R1-P2-001` with different content and no `refines`, When the registry is built, Then both findings remain open and `openFindingsCount` is 2 | `node --test` case `an id reuse without refines keeps both findings` passes | Unmet | - |
| AC-006 | REQ-005 | Given a `refines` value that names no registry entry, When the registry is built, Then the finding is inserted through the ordinary path and the reducer does not throw | The refines case includes the unknown-target fallback assertion | Unmet | - |
| AC-007 | REQ-006 | Given the iteration prompt template, When a reader opens it, Then one line says `refines` is for an existing finding and is omitted for a new finding | `rg -n "refines" .skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` prints one line | Unmet | - |
| AC-008 | REQ-001 | Given the packet's final tree, When strict validation runs, Then the folder passes | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/review-lineage/004-reducer-traceability-and-refines --strict` prints `RESULT: PASSED` | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

The packet is a plan. AC-001, AC-003, AC-005 and AC-007 stay unmet until the builder writes the reducer change, the tests and the prompt line.
<!-- /ANCHOR:closure -->
