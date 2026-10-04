---
title: "Acceptance Criteria: Rule delivery instrumentation"
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
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/004-rule-delivery-instrumentation"
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
# Acceptance Criteria: Rule delivery instrumentation

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** agents/016-repo-rule-advisor-surfacing/004-rule-delivery-instrumentation
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
| AC-001 | REQ-001 | Given fixtures with distinctive marker strings, When the analyzer runs, Then no marker appears in its output | pytest privacy test | Unmet | - |
| AC-002 | REQ-002 | Given fixtures with a write before and after a `REPO RULES.md` read, When the analyzer runs, Then it reports one miss and one hit with denominator 2 | pytest | Unmet | - |
| AC-003 | REQ-003 | Given a fixture with a `Read`, a `cat` and an injection of the same rule across two windows, When the analyzer runs, Then each channel and window is counted | pytest | Unmet | - |
| AC-004 | REQ-004 | Given two rule versions in git history, When replies fall on each side, Then the split assigns them correctly | pytest with a temporary git repo | Unmet | - |
| AC-005 | REQ-005 | Given a Codex session fixture, When the analyzer runs, Then it reports a Codex row | pytest | Unmet | - |
| AC-006 | SC-001 | Given the evidence pack's window and arguments, When the analyzer runs, Then its `Read`-channel counts match | Command output compared with `prep/evidence-pack.md` §3 | Unmet | - |
| AC-007 | REQ-008 | Given phase 006 has not started, When the baseline is committed, Then `baselines/` holds the report | `git log` on `baselines/` | Unmet | - |

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
