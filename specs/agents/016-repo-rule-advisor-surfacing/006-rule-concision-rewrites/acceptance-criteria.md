---
title: "Acceptance Criteria: Rule concision rewrites"
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
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/006-rule-concision-rewrites"
    last_updated_at: "2026-10-04T15:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Rule concision rewrites

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** agents/016-repo-rule-advisor-surfacing/006-rule-concision-rewrites
**Level:** 2
**Status:** Draft
**Date:** 2026-10-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given each rule's ledger and diff, When a second reviewer compares them, Then no imperative, test, exception, Fires-when bullet or self-check item is missing | Reviewer sign-off in `implementation-summary.md` | Unmet | - |
| AC-002 | REQ-002 | Given the rewritten corpus, When the checker runs, Then it reports 10/10 | `node check-repo-rules.cjs` output | Unmet | - |
| AC-003 | REQ-003 | Given the T003 inventory, When each referenced section is looked up after the rewrite, Then it exists with the same number | `rg` output | Unmet | - |
| AC-004 | REQ-004 | Given the before table, When the after table is measured, Then the corpus is at or below 91,028 bytes | `wc -c` output | Unmet | - |
| AC-005 | REQ-005 | Given the diff, When added lines are searched, Then no em dash or semicolon was added | `git diff` filtered to added lines | Unmet | - |
| AC-006 | REQ-007 | Given the rewritten `communication.md`, When its diff is read, Then it carries the simple-terms clause and no caveat or number rule was weakened | `git diff` of `communication.md` | Unmet | - |

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
