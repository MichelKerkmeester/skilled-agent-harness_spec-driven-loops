---
title: "Acceptance Criteria: Phase 9: reference-restructure"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "reference restructure acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/006-frontend-upstream-proposals/009-reference-restructure"
    last_updated_at: "2026-11-03T21:18:58Z"
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
# Acceptance Criteria: Phase 9: reference-restructure

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `009-reference-restructure`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the nine references, When the bold-label count and the text-above-rule check run, Then both print nothing | `S/final-gates.txt` layout block | Met | - |
| AC-002 | REQ-002 | Given every tracked Markdown file outside `specs/`, When `S/check-links.py .` runs, Then it prints `broken=0` | `S/final-gates.txt` link block | Met | - |
| AC-003 | REQ-003 | Given each reference, When `validate_document.py` runs on it, Then it prints VALID | `S/final-gates.txt` validator block | Met | - |
| AC-004 | REQ-004 | Given each reference, When its H2 list is read, Then the first is `## 1. OVERVIEW` with no rule item under it | `S/final-gates.txt` heading block | Met | - |
| AC-005 | REQ-005 | Given the nine references, When `grep -i angular` runs, Then it prints nothing | `S/final-gates.txt` | Met | - |
| AC-006 | REQ-006 | Given `S/rule-ids-before.txt`, When the ids are listed again, Then the only difference is `I8` | `S/final-gates.txt` id diff | Met | - |
| AC-007 | REQ-007 | Given the restructured tree, When the playbook validators, the compiled-route suites and reach on sk-code run, Then each passes | `S/final-gates.txt` gate block | Met | - |

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

Every criterion is met, with its evidence in `scratch/final-gates.txt` and `scratch/reach-final.txt`.
<!-- /ANCHOR:closure -->
