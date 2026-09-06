---
title: "Acceptance Criteria: Docs reality alignment research"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "docs reality alignment research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/025-docs-reality-alignment-research"
    last_updated_at: "2026-09-06T08:10:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet the open criteria as the lane runs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-v4-reality-research"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Docs reality alignment research

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 025-docs-reality-alignment-research
**Level:** 2
**Status:** In Progress
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the lane launched with stop policy max-iterations, When it exits, Then ten iteration files and ten state events exist | `ls research/lineages/*/iterations | wc -l` and JSONL line count | Unmet | - |
| AC-002 | REQ-002 | Given research.md, When a finding is read, Then it cites a doc path:line and a code path:line or a command with observed output | Reproduction pass notes in research/confirmed-findings.md | Unmet | - |
| AC-003 | REQ-003 | Given a finding, When it is ranked, Then it has a severity and a one-line fix | research.md findings table | Unmet | - |
| AC-004 | REQ-004 | Given the iteration files, When their focus lines are listed, Then each of the seven angles appears at least once | `rg -n '^focus' research/lineages/*/iterations` | Unmet | - |
| AC-005 | REQ-005 | Given the confirmed table, When each row is opened, Then the cited lines show the mismatch | Session log in implementation-summary.md | Unmet | - |

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

Written when the packet is closed, not before.
<!-- /ANCHOR:closure -->
