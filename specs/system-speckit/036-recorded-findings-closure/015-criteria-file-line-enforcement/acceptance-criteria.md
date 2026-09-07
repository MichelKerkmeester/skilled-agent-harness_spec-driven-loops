---
title: "Acceptance Criteria: Phase 15: criteria-file-line-enforcement"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria file line enforcement"
  - "coverage floor cutoff rollout"
  - "lifecycle activation gap"
  - "citation retrofit coverage floor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/015-criteria-file-line-enforcement"
    last_updated_at: "2026-09-07T15:05:57Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-criteria-file-line-enforcement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 15: criteria-file-line-enforcement

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/036-recorded-findings-closure/015-criteria-file-line-enforcement
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fixture packet created after the cutoff and under the floor, When `check-ac-coverage.sh` runs with the enforce switch on, Then it fails, and Given a fixture packet created on or before the cutoff, When the same run happens, Then it stays advisory | `check-ac-coverage.sh`'s `_ac_coverage_cutoff_date()` and `run_check` output against both fixtures | Met | - |
| AC-002 | REQ-002 | Given a packet whose `implementation-summary.md` carries no Status row but whose `acceptance-criteria.md` carries `**Status:** Complete`, When `_ac_lifecycle_active()` runs, Then it returns active | `check-ac-coverage.sh:69-99` (or its post-change line range) run against one of children 006-022 as the fixture | Met | - |
| AC-003 | REQ-003 | Given children 006 through 022's `acceptance-criteria.md` files, When the coverage measurement re-runs, Then at least 70 of 77 rows are covered | The re-measurement output from tasks.md T024, naming the new per-file and total counts | Met | - |
| AC-004 | REQ-004 | Given `runtime/ENV-REFERENCE.md`, When it is read after this phase closes, Then it documents `SPECKIT_AC_COVERAGE_CUTOFF` in the same table and style as the neighboring rows | `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, the new row near line 170 | Met | - |
| AC-005 | REQ-005 | Given each of children 006 through 022, When `validate.sh <folder> --strict` runs with `SPECKIT_AC_COVERAGE_ENFORCE=true`, Then it passes and the coverage rule's message shows it evaluated rather than skipped | `validate.sh` output for each of the 16 folders, individually run | Met | - |
| AC-006 | REQ-006 | Given the Manual-infeasible asymmetry between `_ac_analyze_canonical()` and `_ac_analyze_traceability()`, When the operator decision from tasks.md T002 is made, Then it is recorded with its rationale, and the retrofit in AC-003 follows it consistently | The recorded decision (in `decision-record.md` if it changes closure semantics, or in this phase's implementation-summary.md otherwise) plus a spot-check of the retrofit's citations against it | Met | - |

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

This phase is still in planning. No requirement has been implemented, so every
criterion above stays Unmet until the tasks in `tasks.md` are executed and
re-verified against the repository.
<!-- /ANCHOR:closure -->
