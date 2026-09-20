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
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/009-spec-protocol-ledger-events"
    last_updated_at: "2026-09-19T11:15:31Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed every criterion with observed evidence"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 100
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

**Packet:** system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/009-spec-protocol-ledger-events
**Level:** 2
**Status:** Complete
**Date:** 2026-09-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given each of the seven legacy rows, When it goes through `append-mode-event.cjs --mode research`, Then it exits 0 | `append-mode-event-cli.vitest.ts:988` - eight CLI tests, one per row and both conflict shapes, exit 0; `--mode research` run by hand appends the check-result row | Met | - |
| AC-002 | REQ-002 | Given an accepted row, When the state log is rebuilt, Then the row reads as written, apart from the append-time timestamp | `append-mode-event-cli.vitest.ts:988` - the same eight tests read the rebuilt last state-log line back with the written fields, values and key order | Met | - |
| AC-003 | REQ-003 | Given the committed research fixtures, When they replay, Then no fingerprint or reduced state moves | `implementation-summary.md:120` - 23 committed research ledgers, 175 events, read through the runtime at `d71a52c736` and at HEAD: identical heads, event counts, stems and fold outcomes. Of 3,353 fields in a verified event, only the reader's `registryDigest` differs, which names the registry doing the read | Met | - |
| AC-004 | REQ-004 | Given the change, When the deep-loop suite runs, Then it passes, including the stem-producer and append-site checkers | `check-ledger-stem-producers.vitest.ts:128` - the whole suite passes, 2,694 tests in 154 files with 8 skipped; the stem census reports 68 registered, 56 reserved, 12 spoken and no violations; the append-site checker scans 10 sites with no violations | Met | - |
| AC-005 | REQ-005 | Given the spec-check protocol reference, When it is read, Then it names the seven stems | `spec-check-protocol.md:163` - names all seven stems | Met | - |

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

Every row is `Met` with evidence observed on 2026-09-19. No row is waived.
<!-- /ANCHOR:closure -->
