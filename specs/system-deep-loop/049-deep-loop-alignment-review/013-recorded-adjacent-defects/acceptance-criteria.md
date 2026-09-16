---
title: "Acceptance Criteria: Phase 1: recorded-adjacent-defects"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/049-deep-loop-alignment-review/013-recorded-adjacent-defects"
    last_updated_at: "2026-09-16T06:55:32Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-14-013-recorded-adjacent-defects"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: recorded-adjacent-defects

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/049-deep-loop-alignment-review/013-recorded-adjacent-defects
**Level:** 2
**Status:** Complete
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the runtime, When the typecheck runs, Then it exits zero | the executor config carries the persona field its flag-support table declares, and a persona on another kind is rejected at parse | Met | - |
| AC-002 | REQ-002 | Given the runner, When its comments are read against the guard, Then none claims a revert the default mode does not perform | no revert claim remains; the comment describes detect, record and quarantine with restoring opt-in | Met | - |
| AC-003 | REQ-003 | Given a registry carrying a severity outside the scale, When the reducer runs, Then it names the value before dropping its findings | one line per distinct value; the pre-change module produced none on the same input | Met | - |
| AC-004 | REQ-004 | Given a rater reading the agent contract, When they look for the scale, Then the collapse rule is there in every tree | present in all six trees; mirror sync, both generator checks and the roster check green | Met | - |
| AC-005 | REQ-005 | Given every command asset, When its references are checked, Then all resolve | the checker reports references resolving across sixty-one asset files | Met | - |
| AC-006 | REQ-006 | Given a commit whose routing bytes differ from the validated tree, When it is pushed, Then the push is blocked | the check fires on the commit that broke routing and stays quiet on a clean one | Met | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
