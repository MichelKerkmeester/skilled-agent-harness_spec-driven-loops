---
title: "Acceptance Criteria: Give the deep-research ledger its own spec-protocol events"
description: "The criteria this packet must satisfy before it may close."
trigger_phrases:
  - "spec protocol ledger events acceptance"
  - "packet 050 closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/050-spec-protocol-ledger-events"
    last_updated_at: "2026-09-19T06:36:41Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Planned the packet from the run-now precedent"
    next_safe_action: "Get the operator's go-ahead, then replay the fixtures"
    blockers:
      - "A durable ledger format change waits on the operator's go-ahead"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Which side changes: the ledger gets its own events (operator, 2026-09-19)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Give the deep-research ledger its own spec-protocol events

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/050-spec-protocol-ledger-events
**Level:** 2
**Status:** Planned
**Date:** 2026-09-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given each of the seven legacy rows, When it goes through `append-mode-event.cjs --mode research`, Then it exits 0 | A CLI test per row | Unmet | - |
| AC-002 | REQ-002 | Given an accepted row, When the state log is rebuilt, Then the row reads as written | A byte-equivalence test per row | Unmet | - |
| AC-003 | REQ-003 | Given the committed research fixtures, When they replay, Then no fingerprint or reduced state moves | Fingerprints before and after | Unmet | - |
| AC-004 | REQ-004 | Given the change, When the deep-loop suite runs, Then it passes, including the stem-producer and append-site checkers | The suite | Unmet | - |
| AC-005 | REQ-005 | Given the spec-check protocol reference, When it is read, Then it names the seven stems | The reference | Unmet | - |

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

The build has not started. It waits on the operator's go-ahead for a durable format change.
<!-- /ANCHOR:closure -->
