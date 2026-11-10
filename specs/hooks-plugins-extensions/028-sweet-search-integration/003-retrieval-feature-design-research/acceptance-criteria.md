---
title: "Acceptance Criteria: 003-retrieval-feature-design-research"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "retrieval feature design acceptance"
  - "feature design criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/003-retrieval-feature-design-research"
    last_updated_at: "2026-11-09T17:02:03Z"
    last_updated_by: "scaffold"
    recent_action: "Recorded the met criteria for the finished research phase"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-retrieval-feature-design-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: 003-retrieval-feature-design-research

<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** hooks-plugins-extensions/028-sweet-search-integration/003-retrieval-feature-design-research
**Level:** 1
**Status:** Complete
**Date:** 2026-11-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `research/research.md`, When sections 4 to 8 are read, Then each of the five features has a design naming files, lines and tests, and `grep -c '\[SOURCE:' research/research.md` prints a count above zero | Five design sections; 33 tags | Met | - |
| AC-002 | REQ-002 | Given each design section, When it is read, Then it lists edge cases and a compatibility note | `research/research.md` sections 4 to 8 | Met | - |
| AC-003 | REQ-001 | Given `research/research.md` section 10, When it is read, Then it ends with an ordered build-phase task list | Section 10 task list | Met | - |
| AC-004 | REQ-001 | Given the research folder, When `ls research/iterations/*.md \| wc -l` runs, Then it prints 5 | 5 iteration files | Met | - |

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

Every criterion is met by the committed research synthesis.
<!-- /ANCHOR:closure -->
