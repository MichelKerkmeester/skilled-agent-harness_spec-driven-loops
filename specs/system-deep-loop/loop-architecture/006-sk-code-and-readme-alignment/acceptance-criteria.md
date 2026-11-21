---
title: "Acceptance Criteria: Align system-deep-loop code with sk-code and its code-folder READMEs with the sk-doc create-readme standard"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "sk code and readme alignment acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/006-sk-code-and-readme-alignment"
    last_updated_at: "2026-11-21T18:32:25Z"
    last_updated_by: "scaffold"
    recent_action: "Marked every criterion with observed evidence"
    next_safe_action: "None; the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-sk-code-and-readme-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Align system-deep-loop code with sk-code and its code-folder READMEs with the sk-doc create-readme standard

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** system-deep-loop/loop-architecture/006-sk-code-and-readme-alignment
**Level:** 2
**Status:** Complete
**Date:** 2026-11-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final commit `fe8909a3a8e`, When `gate.sh dlh` runs, Then vitest reports 0 failed and at least 3967 passed, the three checks exit 0, parity is 18/18 and validate is 16/16 | `scratchpad/gate-dlh.log`: `3967 passed, 11 skipped, 0 failed`, `check-contract-drift exit=0`, `Tests  18 passed (18)`, `validate exit=0 passed=16 failed=0` | Met | - |
| AC-002 | REQ-002 | Given the 79 skill READMEs, When the reference and count checkers run, Then both report no failure, and the default-mode audit keeps every skill README valid | `SUMMARY files=79 pass=79 fail=0` from both checkers. `audit_readmes.py` default mode: 72 of 72 valid | Met | - |
| AC-003 | REQ-003 | Given the code diff, When non-comment lines are filtered, Then only type annotations, split literals and one unexported interface remain, and the quality gate passes | Filter output: `catch (...: unknown)`, three `denial` literal splits, `PivotSeatDispatchContext`, two `binding` types. `quality-gate.cjs` over 582 files: NO_BLOCKER_FOUND. Typecheck exit 0 | Met | - |
| AC-005 | REQ-005 | Given the 35 approved behaviour items, When each is built or rebutted, Then every built item has a fail-first test and the full gate stays green | `implementation-summary.md` behaviour fixes table: 32 built, 3 rebutted, 0 stopped. `scratchpad/gate-dlh2.log`: 4029 passed, 11 skipped, 0 failed, `check-contract-drift exit=0` | Met | - |
| AC-006 | REQ-005 | Given the 48 accepted class (c) defaults, When each is built or accepted, Then behaviour changes have fail-first tests and the gate stays green | `implementation-summary.md` undecided findings tables: 34 built, 14 accepted. `scratchpad/gate-dlh3.log`: 4039 passed, 11 skipped, 0 failed | Met | - |
| AC-004 | REQ-004 | Given `runtime/tests/_support/`, When the code-folder audit runs, Then its README exists and is valid | `audit_readmes.py --document-type code-folder`: `runtime/tests/_support/README.md` valid | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is Met with observed evidence. The behaviour-changing and undecided findings are the operator's, listed in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
