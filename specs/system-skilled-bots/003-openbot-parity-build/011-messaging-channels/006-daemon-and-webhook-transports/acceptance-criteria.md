---
title: "Acceptance Criteria: Phase 6: daemon-and-webhook-transports"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "daemon and webhook transports acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports"
    last_updated_at: "2026-11-26T06:00:00Z"
    last_updated_by: "wo-09-writer"
    recent_action: "Authored the acceptance criteria"
    next_safe_action: "Run each block and mark the rows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo09-011-006-daemon-webhook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: daemon-and-webhook-transports

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports
**Level:** 2
**Status:** Draft
**Date:** 2026-11-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

AC ids follow their requirement, AC-NNN checks REQ-NNN and keep the pre-expansion numbers. Every command runs from the repository root with no tty, no token and no network. A command that writes state runs on the temporary state root of `../003-link-roster-and-answer-gate/tasks.md` Task Notation.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-011 | REQ-011 | Given a fake `signal-cli` daemon on a loopback port, When it pushes one message event and then the same event again, Then one request is queued and the replay adds nothing, a 2,500-character reply is sent as two `send` calls, a stream drop reconnects after 2 s and a daemon that stops answering refuses `channel-daemon-unreachable` with the entry still `queued` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-transports.vitest.ts -t "signal"` prints one passing test | Unmet | - |
| AC-012 | REQ-012 | Given the listener on a loopback port and the stored app secret, When an unsigned, a malformed and a wrongly signed body are posted, Then each answers `401` and the parser spy records no call, a body of 2 MiB plus one byte answers `413`, a signed body of two messages answers `200` only after both seen records exist, the same body posted again adds nothing and a body for another `phone_number_id` adds nothing | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-transports.vitest.ts -t "signature"` and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-transports.vitest.ts -t "whatsapp"` each print one passing test | Unmet | - |
| AC-026 | REQ-026 | Given a fake daemon whose `/api/v1/check` answers `200`, When `listen signal` starts, Then stderr starts `bots: signal ready as +` and given one that answers `503`, Then `listen` exits 4 with `channel-daemon-unreachable` and the lease file is gone | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-transports.vitest.ts -t "signal probe"` prints one passing test | Unmet | - |
| AC-027 | REQ-027 | Given all four secrets, When `listen whatsapp` starts, Then it binds `127.0.0.1` only, a `GET` with `hub.mode=subscribe` and the stored verify token echoes `hub.challenge` with `200`, a wrong token answers `403` and with the app secret missing it exits 4 with `secret-unknown` before the bind | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-transports.vitest.ts -t "handshake"` prints one passing test | Unmet | - |

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

Every row is unmet until the code lands and each command prints what its row says.
<!-- /ANCHOR:closure -->
