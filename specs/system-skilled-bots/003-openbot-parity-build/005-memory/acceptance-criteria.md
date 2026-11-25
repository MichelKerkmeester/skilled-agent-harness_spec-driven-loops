---
title: "Acceptance Criteria: Phase 5: memory"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "bot memory files acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/005-memory"
    last_updated_at: "2026-11-25T07:13:41Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-memory"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: memory

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/005-memory
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a state root with no memory folder, When `bots remember "the sales sheet is Q3"` runs, Then `memory/shared.md` holds one `general` entry dated today with the OS user as its actor and `bots remember` as its source, and the verb exits 0 | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/memory.vitest.ts -t "shared append"` prints one passing test | Unmet | - |
| AC-002 | REQ-002 | Given a bot id, When `bots remember "the sales sheet is Q3" --bot <id>` runs, Then the entry lands in `<stateRoot>/<identityKey>/memory/<id>.md` and the shared file is unchanged | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/memory.vitest.ts -t "per-bot append"` prints one passing test | Unmet | - |
| AC-003 | REQ-003 | Given a file at 60 entries or 3,600 bytes, When another append runs, Then it prints `bots: memory-full: <path> (<n> entries, <b> bytes)`, exits 1, and the file's bytes are unchanged | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/memory.vitest.ts -t "bound"` prints one passing test | Unmet | - |
| AC-004 | REQ-004 | Given a file holding two entries, When `bots remember --list` runs, Then it prints both with their index, type, date, actor, source and text, then the path with its entry and byte counts, and the file is not rewritten | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/memory.vitest.ts -t "list"` prints one passing test | Unmet | - |
| AC-005 | REQ-005 | Given a file holding two entries, When `bots remember --forget 1` runs, Then the first entry is gone and the second keeps its text, and `--forget 99` exits 2 with `bots: memory-entry-unknown: 99` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/memory.vitest.ts -t "forget"` prints one passing test | Unmet | - |
| AC-006 | REQ-006 | Given one entry in each file, When `buildBotPrompt` runs, Then the shared entry precedes the bot's entry, both sit between the decision rule and the body, and with both files empty the prompt equals today's string byte for byte | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/dispatch.vitest.ts -t "memory"` prints one passing test | Unmet | - |
| AC-007 | REQ-007 | Given a clean run whose answer holds `[REMEMBER] user Prefers ISO dates.`, When the run ends, Then one open `memory-proposal` item carries that type and fact, the run's exit is `completed`, an answer holding both markers parks the run instead, and a failed run writes no item | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/runner.vitest.ts -t "remember"` prints one passing test | Unmet | - |
| AC-008 | REQ-008 | Given an open `memory-proposal` item, When `bots answer <item-id> confirm` runs, Then the fact is appended to the proposing bot's file with the operator as actor and `bot:<bot-id>` as source, no resume request is queued, and `reject` appends nothing | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "proposal"` prints one passing test | Unmet | - |
| AC-009 | REQ-009 | Given an open `memory-proposal` item for a bot, When `holdForBot` and `itemAwaitingResume` run for that bot, Then both return null and the bot's next run is not refused | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/needs-you.vitest.ts -t "proposal"` prints one passing test | Unmet | - |
| AC-010 | REQ-010 | Given a BOT.md carrying `memory: false`, When the prompt is built, Then neither file's entries appear, and `memory: maybe` is refused as `memory-invalid` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/definition.vitest.ts -t "memory"` prints one passing test | Unmet | - |
| AC-011 | REQ-011 | Given a memory file holding a literal of a known secret, When the run reaches the secret check, Then it is refused as `body-secret` naming the memory file and the key, and the value appears in no record | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/runner.vitest.ts -t "memory secret"` prints one passing test | Unmet | - |
| AC-012 | REQ-012 | Given a fresh state root, When the first append runs, Then the memory folder is 0700 and the file 0600, and `bots remember x --bot ../etc` exits 2 with `bots: --bot takes a bot id` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/memory.vitest.ts -t "owner-only"` prints one passing test | Unmet | - |

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

AC-001 is unmet, and no code has been written yet, so every criterion is open.
<!-- /ANCHOR:closure -->
