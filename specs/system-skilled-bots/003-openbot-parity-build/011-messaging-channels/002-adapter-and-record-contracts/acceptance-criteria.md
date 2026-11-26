---
title: "Acceptance Criteria: Phase 2: adapter-and-record-contracts"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "adapter and record contracts acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts"
    last_updated_at: "2026-11-26T06:00:00Z"
    last_updated_by: "wo-09-writer"
    recent_action: "Authored the acceptance criteria"
    next_safe_action: "Run each block and mark the rows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo09-011-002-adapter-contracts"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: adapter-and-record-contracts

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts
**Level:** 2
**Status:** Draft
**Date:** 2026-11-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Every command runs from the repository root with no tty, no token and no network, with the two variables `tasks.md` sets:

```bash
P=specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts
D=$P/design
```

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the matrix, When its rows are counted, Then eight keys and three facts each carry one value per transport and the shapes every transport implements are declared | `awk '/^## 2\. THE MATRIX/,/^Where each value/' $D/capabilities.md \| rg -c '^\| `[a-zA-Z]+` \|'` prints 11 and `rg -c '^export (type\|interface) ' $D/capabilities.md` prints 14 | Unmet | - |
| AC-002 | REQ-002 | Given every channel record, When its samples are counted and the backoff table is read, Then each carries `schemaVersion: 1` and the table holds five values with a cap of five attempts | `rg -c '"schemaVersion": 1' $D/records.md` prints 9, and `rg -c '^\{ "BACKOFF_MS": \[0, 5000, 25000, 120000, 600000\], "MAX_ATTEMPTS": 5 \}$' $D/records.md` prints 1 | Unmet | - |
| AC-003 | REQ-003 | Given the derived name table, When its rows are counted, Then each credential of each transport has one name | `rg -c '^\| `(slack\|whatsapp\|signal\|telegram)` \| `<secret>' $D/records.md` prints 8 | Unmet | - |
| AC-004 | REQ-004 | Given the inbound sequence, When it is read, Then each transport has a section and each one with an acknowledge has a policy row | `rg -c '^## [2-6]\. ' $D/inbound-sequence.md` prints 5 and `rg -c '^\| Policy \|' $D/inbound-sequence.md` prints 4 | Unmet | - |
| AC-005 | REQ-005 | Given the five rules, When the fixture is counted, Then it holds 18 undeclared and 7 declared cases | `rg -c '^\| R[1-5] \|' $D/conformance-rules.md` prints 5, and the T007 `uniq -c` prints 18 and 7 | Unmet | - |
| AC-006 | REQ-006 | Given the runbook, When it is read, Then four transports each have a preflight, a health and a rotation row | `rg -c '^\| (Preflight\|Health\|Rotation) \|' $D/operator-runbook.md` prints 12 | Unmet | - |
| AC-007 | REQ-007 | Given the contracts, When the phase's own commits and its working tree are inspected, Then no contract file changed | `git diff --name-only "$(rg -o 'base commit [0-9a-f]{40}' $P/goal.md \| cut -d' ' -f3)"..HEAD -- specs/system-skilled-bots/003-openbot-parity-build/contracts` prints nothing | Unmet | - |
| AC-008 | REQ-008 | Given the facts no reference states, When the design is searched, Then each is marked | T010 prints 2 and one line | Unmet | - |
| AC-009 | REQ-009 | Given every row above, When its Verification cell is read, Then it names a command that runs here without a tty, a token or a network | `rg -c '^\| AC-0' $P/acceptance-criteria.md` prints 9 | Unmet | - |

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

Every row is unmet until the checks are run and the rows marked with the output observed. The design is written and the checks printed their expected output on 2026-11-26, as `goal.md` section 4 records.
<!-- /ANCHOR:closure -->
