---
title: "Acceptance Criteria: Phase 1: run-recorder-and-validator"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "run recorder and validator acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/007-playbook-run-recording/001-run-recorder-and-validator"
    last_updated_at: "2026-11-22T11:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked every criterion with its evidence"
    next_safe_action: "Commit the phase on the operator's instruction"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "da5c810b-9095-42b1-8923-c83799a0919f"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: run-recorder-and-validator

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `001-run-recorder-and-validator`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-22
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a verdict CSV, When the recorder runs twice with two labels, Then both folders hold three files and the index lists the newer run first | `recorder happy path: PASS (8 assertions)` | Met | - |
| AC-002 | REQ-002 | Given an unknown id, a reasonless `FAIL` or an existing folder, When the recorder runs, Then it exits 1 and writes nothing | `recorder refusals: PASS (7 assertions)`, including `benchmark/reports` absent after the unknown-id refusal | Met | - |
| AC-003 | REQ-003 | Given a root without the marker, When the validator runs, Then it exits 1 with `RESULT_PERSISTENCE_MARKER_MISSING` | `result contract regressions: PASS (6 assertions)`. The fleet exited 1 with 11 of them before phase 2 | Met | - |
| AC-004 | REQ-004 | Given a finished fake run, When the runner ends, Then `scenario.json` names the scenario and stdout carries the recorder command | Runner test file `pass 1, fail 0` with both assertions. `recorder runner hand-off: PASS (6 assertions)`, with no absolute runner path in the three written files | Met | - |
| AC-005 | REQ-005 | Given `--coverage`, When the validator runs, Then each package reports recorded and unrecorded ids and the exit code is unchanged | Fixture case exits 0 with `recorded: 1`. `sk-git` reports `recorded=22/40` | Met | - |
| AC-006 | REQ-006 | Given the mode's docs, When they are searched, Then none says reports are hand-written or renderer-owned | An `rg` search of the mode for `by hand until`, `renderer-owned` and the retired wrapper exits 1. `validate_document.py` 0 issues on the edited docs | Met | - |

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

**Closeable:** Yes

Every criterion is met.
<!-- /ANCHOR:closure -->
