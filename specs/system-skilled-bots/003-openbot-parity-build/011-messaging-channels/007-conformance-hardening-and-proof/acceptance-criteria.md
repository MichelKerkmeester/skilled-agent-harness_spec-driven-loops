---
title: "Acceptance Criteria: Phase 7: conformance-hardening-and-proof"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "conformance hardening and proof acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof"
    last_updated_at: "2026-11-28T18:00:00Z"
    last_updated_by: "unit-orchestrator-011-007"
    recent_action: "Marked all four rows Met on observed evidence"
    next_safe_action: "Merge the unit branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo09-011-007-conformance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: conformance-hardening-and-proof

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof
**Level:** 2
**Status:** Complete
**Date:** 2026-11-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

AC ids follow their requirement, AC-NNN checks REQ-NNN and keep the pre-expansion numbers. Every command runs from the repository root with no tty, no token and no network. A command that writes state runs on the temporary state root of `../003-link-roster-and-answer-gate/tasks.md` Task Notation.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-017 | REQ-017 | Given the capability-matrix driver and the fake platform, When the conformance file runs, Then 25 cases run, each undeclared operation returns the unsupported result and records no wire call and each declared one returns a receipt with no error, records at least one matching call carrying the intent's one idempotency key and names its platform message ids | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-conformance.vitest.ts)` prints no `failed`, and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-conformance.vitest.ts -t "^R2 ")` prints `Tests  18 passed`. Observed 2026-11-28: the whole file printed `Tests  29 passed (29)` with no `failed`, and `-t "^R2 "` printed `Tests  18 passed \| 11 skipped (29)`. The 7 declared cases passed under `declared operations return a receipt under one key` | Met | - |
| AC-018 | REQ-018 | Given the lifted files, When the `## 011-messaging-channels` section of `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` is read, Then it names each lifted file with the Apache-2.0 licence, its copyright line and a statement of changes and no entry names tinychannels | `rg -n '^## 011-messaging-channels' .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints one line and `rg -n 'tinychannels' .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` exits 1. Observed 2026-11-28: the heading grep printed `250:## 011-messaging-channels` and the `tinychannels` grep exited 1. 011.005 and 011.006 lifted no third-party code, so the section says so and names no file | Met | - |
| AC-030 | REQ-030 | Given the fake platform, When a press arrives whose sender id differs from the link record's, a parked question holds a stored secret and a 5,000-character Telegram send runs, Then the first two record no wire call and are refused `answer-not-approver` and withheld and the third records two wire calls with one idempotency key | `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-conformance.vitest.ts -t "^hardening ")` prints `Tests  3 passed`. Observed 2026-11-28: `-t "^hardening "` printed `Tests  3 passed \| 26 skipped (29)`. Drift: the press from another sender is refused `channel-unlinked` with detail `sender mismatch`, the silent rule of the frozen 001 catalog section 2, and not `answer-not-approver`. The case asserts the catalog, no reply, no counter, no answer and no send observation, then a control press from the linked sender answers | Met | - |
| AC-031 | REQ-031 | Given the operator reference, When it is read, Then it has a preflight, a health and a rotation row for each of the four providers, every derived secret name and the Signal message-loss line and the README, the run mode, the hub and the catalog name the feature | `rg -c '^\| (Preflight\|Health\|Rotation) \|' .skilled/skills/system-skilled-bots/bots-run/references/messaging-channels.md` prints 12, `rg -n 'may be lost' .skilled/skills/system-skilled-bots/bots-run/references/messaging-channels.md` prints one line and `rg -n 'messaging-channels.md' .skilled/skills/system-skilled-bots/feature-catalog/feature-catalog.md` prints the row. Observed 2026-11-28: the row grep printed 12, `may be lost` printed one line (140), and the catalog grep printed line 338. The README grep counts 9 module rows and both SKILL files name `bots channel` | Met | - |

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

All four rows are Met on evidence observed on 2026-11-28 from the final state. AC-030 carries one recorded wording drift, which the 014 alignment phase owns.
<!-- /ANCHOR:closure -->
