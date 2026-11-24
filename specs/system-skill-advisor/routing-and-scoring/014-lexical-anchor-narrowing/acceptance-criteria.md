---
title: "Acceptance Criteria: Narrow the advisor shared lexical anchor"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "lexical anchor narrowing acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/014-lexical-anchor-narrowing"
    last_updated_at: "2026-11-24T13:30:00Z"
    last_updated_by: "claude"
    recent_action: "Landed candidate E as advisor 2.0.4.0"
    next_safe_action: "Find a stricter rule for the three remaining lifts that moves no pin"
    blockers:
      - "Three probe lifts remain; the stricter rules tried moved pinned rows"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-lexical-anchor-narrowing"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Narrow the advisor shared lexical anchor

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 014-lexical-anchor-narrowing
**Level:** 2
**Status:** Partial
**Date:** 2026-11-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the five probe prompts, When the advisor scores them, Then no unnamed skill reaches 0.8 and sk-prompt and system-skilled-doctor keep their lift | Landed E: parser and doctor lifts gone; container, rewrite and plan lifts remain; sk-prompt and system-skilled-doctor keep theirs | Unmet | - |
| AC-002 | REQ-002 | Given a landed rule, When the ratchet and the full suite run, Then no pinned row moves without operator approval | Final E code: suite 3,206 passed, only the known failure; ratchet unchanged | Met | - |
| AC-003 | REQ-003 | Given a landed rule, When the browser hub replay runs, Then only MBU-PB-04 fails | 55 PASS, 1 FAIL (MBU-PB-04), every row as before | Met | - |

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

AC-001 is partly met: two of five probe lifts are gone. The packet stays open for a stricter rule that moves no pin.
<!-- /ANCHOR:closure -->
