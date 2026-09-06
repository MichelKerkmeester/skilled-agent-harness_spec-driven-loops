---
title: "Acceptance Criteria: Phase 1: router-vocabulary-repair"
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
    packet_pointer: "scaffold/011-router-vocabulary-repair"
    last_updated_at: "2026-09-06T20:37:15Z"
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
# Acceptance Criteria: Phase 1: router-vocabulary-repair

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-design/018-sk-design-parent-v2/011-router-vocabulary-repair`
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
| AC-001 | REQ-001 | Given 55 keywords the router declares that the scorer never sees, When each candidate is probed rather than assumed broken, Then only the ones that genuinely fail are repaired | 9 of 14 sampled fleet orphans routed correctly without membership, so the diff is a candidate list. 11 of 15 sk-design declarations genuinely failed; 9 now reach the hub at generation 667 | Met | - |
| AC-002 | REQ-002 | Given chart vocabulary the cutover left in `sk-doc`, When it is removed, Then a data-visualisation request reaches the design hub | `data visualization`: `sk-doc=0.878` before, `sk-design=0.827` ahead of `sk-doc=0.82` after. `parallel coordinates`: `sk-doc=0.82` before, `sk-design=0.82` alongside after | Met | - |
| AC-003 | REQ-003 | Given two prior phrase sets, When they are replayed after the vocabulary change, Then neither moves | Sixteen-phrase packet set and twelve-phrase surface set both byte-identical to their recorded captures | Met | - |
| AC-004 | REQ-004 | Given phrases that remain broken, When the phase closes, Then each is named with its cause | `critique this` and `plot this` are two-word phrases below the bar regardless of membership, a length limit rather than a gap. `review this screen` loses to `sk-code`, the same pattern as the deck-review case | Met | - |

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

AC-001 carried this phase, and it nearly went the other way. The obvious move was to treat the
55-keyword gap as a defect list and sync the two vocabularies; probing a sample first showed 9 of 14
orphans routing correctly anyway, which is what stopped 44 bare common words being added to hub
selection. The uncomfortable finding is separate: every replay in this packet passed while eleven
router-declared phrases were dead, because the sixteen-phrase baseline never sampled them. A baseline
proves what it samples.
<!-- /ANCHOR:closure -->
