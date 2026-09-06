---
title: "Acceptance Criteria: Phase 2: readme-human-voice"
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
    packet_pointer: "scaffold/010-readme-human-voice"
    last_updated_at: "2026-09-06T17:43:46Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: readme-human-voice

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-design/018-sk-design-parent-v2/010-readme-human-voice`
**Level:** 3
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given 909 prose em-dashes in authored READMEs, When the sweep runs, Then none remain | 0 prose em-dashes across 147 files, counted per line and per table cell | Met | - |
| AC-002 | REQ-002 | Given three permitted replacements, When each dash is replaced, Then the punctuation matches the sentence rather than one blanket choice | Colon after a label or before a standalone clause, comma for a short appositive, full stop for a capitalised continuation; the first blanket-comma attempt was reverted whole | Met | - |
| AC-003 | REQ-003 | Given a sweep across 147 files, When it completes, Then no line without an em-dash was edited | Line-by-line audit against `HEAD`: 0 out-of-scope edits, 0 comma splices | Met | - |
| AC-004 | REQ-004 | Given glyphs, code and vendored text, When the sweep runs, Then all four exclusions hold | 88 whole-cell dashes, 13 code-block dashes, 377 vendored and 153 historical occurrences unchanged | Met | - |
| AC-005 | REQ-001 | Given an independent scanner, When it runs before and after, Then the em-dash finding is gone | `hvr_scan.py` on the root README: `x19 punctuation —` before, absent after; hard blockers 84 to 65 | Met | - |

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

AC-003 carried this phase, and it is the one that failed first. The opening attempt replaced every
dash with a comma, which reads as a splice wherever the following clause can stand alone, and two
repair passes then edited prose that had never carried a dash at all. Reverting all of it and
sweeping once with the right rule was cheaper than auditing what three layered passes had done.
Consciously left out: 835 semicolons the same scanner flags as hard blockers, which are a different
rule than the one this request named.
<!-- /ANCHOR:closure -->
