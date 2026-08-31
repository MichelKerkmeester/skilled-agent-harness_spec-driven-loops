---
title: "Acceptance Criteria: Orchestrator Inline Authority"
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
    packet_pointer: "scaffold/008-orchestrator-inline-authority"
    last_updated_at: "2026-08-31T06:37:55Z"
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
# Acceptance Criteria: Let the orchestrator make small inline fixes instead of paying a fresh dispatch for a one-line change, and let a direct operator invocation satisfy the leaf caller-gate

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** agents/008-orchestrator-inline-authority
**Level:** 2
**Status:** Complete
**Date:** 2026-08-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the orchestrator, When it faces a one-line fix, Then it can apply it without a dispatch | Write capability present in all four dialects | Met | - |
| AC-002 | REQ-001 | Given a change with design content or breadth, When the orchestrator considers it, Then it still delegates | Prose bound names the threshold explicitly | Met | - |
| AC-003 | REQ-002 | Given an operator invoking the code agent directly, When it starts, Then it proceeds and states packet and frozen scope | Gate amended in all four copies | Met | - |
| AC-004 | REQ-003 | Given the dispatch protocol, When it names a subagent type, Then that type exists in this runtime | No obsolete type remains | Met | - |
| AC-005 | REQ-003 | Given the nesting examples, When they name an agent, Then it is on the roster | Phantom name renamed, examples intact | Met | - |
| AC-006 | REQ-004 | Given four independently-authored copies, When one is edited, Then all four carry the same change | Symmetry verified per edit; checker cannot prove this | Met | - |

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

AC-006 carried this packet. The roster checker validates presence and never content, so a
change applied to one runtime and missed in three would have passed every available gate — the
symmetry check is the only thing standing between this edit and three runtimes silently keeping
the old contract. AC-002 is the one to watch over time: a bounded grant is only as good as the
boundary, and prose is a weaker fence than a missing tool.
<!-- /ANCHOR:closure -->
