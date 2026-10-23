---
title: "Acceptance Criteria: Phase 2: template-and-example-defect-repair"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "template and example defect repair acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/002-template-and-example-defect-repair"
    last_updated_at: "2026-10-23T11:27:20Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: template-and-example-defect-repair

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-weak-model-spec-authoring/002-template-and-example-defect-repair
**Level:** 3
**Status:** Draft
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `known-rows.jsonl` holds 25 rows, When `tasks.md` T006 has run, Then `apply_row.py` printed `APPLIED` for each row and each row's old text is gone and its new text is present once | `grep -c '^APPLIED K-' scratch/applied.txt` prints `25` and `grep -c '^KCHECK K-.* locator=0 expected=1$' scratch/applied.txt` prints `25` | Unmet | - |
| AC-002 | REQ-002 | Given the phase 1 ledger, When `tasks.md` T012 has run, Then no known locator remains, no owner `002` row still reproduces and no owned dead file is still there | `grep -c '^K-LEFT .* [1-9][0-9]*$' scratch/recheck.txt`, `grep -c '^YES ' scratch/recheck.txt` and `grep -c '^STILL-THERE ' scratch/recheck.txt` each print `0` | Unmet | - |
| AC-003 | REQ-003 | Given the 18 example docs, When `tasks.md` T007 has run, Then each `description:` line equals its new sentence on one whole line and the leaked-text search prints nothing | T007 prints nothing, then `18 1`, then `0`. The output is saved in `goal.md` section 4 | Unmet | - |
| AC-004 | REQ-004 | Given the reader guards of `tasks.md` T008, When both exit with code 1, Then `templates/.hashes` is deleted | the guards printed `rc=1` twice and `test ! -e .skilled/skills/system-spec-kit/templates/.hashes && echo DELETED` prints `DELETED` | Unmet | - |
| AC-005 | REQ-005 | Given the phase 1 `suite-start.txt`, When `tasks.md` T014 compares the end of this phase, Then the `Test Files` lines, the `Tests` lines and the `exit=` line are identical | T014 second block prints `SUITE_MATCH` | Unmet | - |
| AC-006 | REQ-006 | Given the finished diff, When `tasks.md` T013 runs, Then no path changed that a row does not name and nothing under the three protected template folders changed | T013 last command prints `0` and the protected-folder `grep -c` prints `0` | Unmet | - |
| AC-007 | REQ-007 | Given the diff, When the frontier review in `tasks.md` T015 returns, Then each P0 and P1 finding is fixed and each P2 finding is fixed or recorded with a reason | the verify command of T015 prints `0`, and the T016 verify prints `COUNTS_MATCH` | Unmet | - |

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

The phase has not started. This statement is rewritten when the phase closes.
<!-- /ANCHOR:closure -->
