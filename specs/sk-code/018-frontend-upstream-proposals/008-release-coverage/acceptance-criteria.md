---
title: "Acceptance Criteria: Phase 8: release-coverage"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "release coverage acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-frontend-upstream-proposals/008-release-coverage"
    last_updated_at: "2026-11-03T20:09:16Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: release-coverage

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `sk-code/018-frontend-upstream-proposals/008-release-coverage`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the harness tests, When `node --test .skilled/commands/assets/local-skilled-alignment/tests/` runs, Then it reports `fail 0`, with release-coverage cases for a pass, a missing release-notes id, numeric version order, a missing README id and a missing notes folder | 39 tests, 39 pass, 0 fail | Met | - |
| AC-002 | REQ-002 | Given this branch's scope, When the check runs before and after the fold, Then it prints `MISSING` lines and exits 1 before, and `STATUS=OK` and exits 0 after | `scratch/release-check-before.txt`: 6 MISSING, exit 1; `scratch/release-check-after.txt`: STATUS=OK, exit 0 | Met | - |
| AC-003 | REQ-003 | Given v4.0.1.0, When `validate_document.py` runs, Then it reports 0 issues and the notes name `sk-code-frontend`, the five-pass check and `sk-design-fundamentals` | `validate_document.py`: 0 issues; the coverage check finds every id | Met | - |
| AC-004 | REQ-004 | Given the root README, When the reference and count checkers run, Then both exit 0 and the mcp-figma, sk-design-fundamentals and Spec Kit entries describe what shipped | `check_readme_references.py` and `check_derived_readme_counts.py` exit 0 | Met | - |
| AC-005 | REQ-005 | Given the packet, When `validate.sh --strict --recursive` runs on the parent, Then every folder prints `RESULT: PASSED` | Validator output at phase close | Met | - |

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

Every criterion is met with evidence observed from the final state.
<!-- /ANCHOR:closure -->
