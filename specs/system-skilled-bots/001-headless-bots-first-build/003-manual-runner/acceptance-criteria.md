---
title: "Acceptance Criteria: Phase 3: manual-runner"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "manual runner acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/003-manual-runner"
    last_updated_at: "2026-11-22T10:48:29Z"
    last_updated_by: "scaffold"
    recent_action: "Superseded the bots answer rows after operator decision D12 and added the resume and hold rows"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-manual-runner"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: manual-runner

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 003-manual-runner
**Level:** 3
**Status:** Draft
**Date:** 2026-11-22
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-012 | Given a manual fixture bot, When `bots run <id>` runs, Then it exits 0 and `records/` under the identity folder holds one terminal record, pointing to its run folder, with the request join, honored posture, evidence locations, `null` cost when unknown and delivery `not-attempted` | Integration test T015 plus a read of the record against the phase 1 schema | Unmet | - |
| AC-002 | REQ-002 | Given a disabled bot, a paused bot, a precheck that exits non-zero and a precheck that prints `[SILENT]`, When each is run, Then none dispatches and each leaves one record whose reason names the cause | Integration test T016: no dispatch receipt exists for any of the four | Unmet | - |
| AC-003 | REQ-003 | Given a posture the executor cannot honor, including `isolation: worktree`, and a second concurrent run of one bot, When each is run, Then both are refused before dispatch with a record | Integration test T017 | Unmet | - |
| AC-004 | REQ-004 | Given a run killed with SIGKILL mid-dispatch, When the bot runs again, Then the lease is reclaimed by the pid, nonce and heartbeat rule and the killed record reads `unknown` only after the owner pid is proved gone | Integration test T018 | Unmet | - |
| AC-005 | REQ-008 | Given a stuck invocation and a run that reaches its budget, When each runs, Then `timeoutSeconds` stops the stuck one and the two records carry different classes | Integration test T019 | Unmet | - |
| AC-006 | REQ-005, REQ-006 | Given the switch files, the needs-you folder and a child with checkout write access, When the child tries to change them or create an item, Then it cannot, and no command line or environment value appears in any runner log | Tests T020 and T021: `rg -F` for the planted value prints nothing | Unmet | - |
| AC-007 | REQ-007 | Given the phase's code, When it is searched, Then no path calls `launchctl bootstrap` or writes a plist | T022: `rg -n 'launchctl\|\.plist' .skilled/skills/system-skilled-bots/ .skilled/bin/bots.cjs` prints nothing | Unmet | - |
| AC-008 | REQ-009, REQ-010, REQ-011 | Given a run that needs a human decision and a re-sent result event, When each is processed, Then the first ends with exit `awaiting-decision`, stop reason `blockedStop` and class `operator`, and the second is stored once with no second dispatch | Tests T013 and T014 | Unmet | - |
| AC-009 | REQ-005 | Given a planted key outside the allowlist and a `BOT.md` body holding a secret literal, When each is run, Then the key is absent from the child environment and the body is refused before dispatch, naming the key or prefix and never the value | Unit test T009, plus phase 2's checker importing the same predicate | Unmet | - |
| AC-010 | REQ-013 | Given each refusal fixture and one failing run, When `bots run` ends, Then every refusal exits with the refusal code, the failing run exits with the run-failure code, and a paused run records `userPaused` | Test T024 | Unmet | - |
| AC-011 | REQ-014 | Given a bot run, When its child runs `env`, Then the run marker is set to the run id, and a non-bot dispatch shows no marker | Test T025: the key is missing before the allowlist entry and set after it | Unmet | - |
| AC-012 | REQ-015 | Given two terminal runs and one needs-you item, When each is written, Then the generation stamp under `<state root>/<repository identity>/` changes after each and no temp file remains | Test T026 | Unmet | - |
| AC-013 | REQ-016, REQ-017 | Given a fixture child that prints `[NEEDS-DECISION]` and exits 0, When `bots run` ends, Then it exits with the `awaiting-decision` code, one item sits in the needs-you folder with the run id, question and prompt, and the lease is released. An empty question writes no item and is classed `author` | Tests T013, T027 and T031 | Unmet | - |
| AC-014 | REQ-018 | Given an item 8 days old and the default `needsYou.expiryDays` of 7, When `bots inbox` runs, Then the item prints as `expired`, and its file is unchanged and holds no answer | Test T028 | Unmet | - |
| AC-015 | REQ-019, REQ-020 | Given an open item, When `bots answer` runs twice with the same text and the queue is drained, Then one `resume` request exists with the item id as idempotency key, and one new run starts joined to the item with the resumed prompt and the same spec folder | None here. Operator decision D12 moved `bots answer` to phase 5, where 005 AC-010 carries it | Superseded | ADR-001 |
| AC-016 | REQ-005, REQ-019, REQ-020 | Given an open item, When `bots answer` records an answer, Then the item reads `answered`, a different second answer and an expired or unknown item exit non-zero, a planted secret in the answer is refused by key, and the built prompt holds the question, the answer and the original spec folder | None here. The answer side moved to 005 AC-010 by operator decision D12. The prompt side is AC-018 | Superseded | ADR-001 |
| AC-017 | REQ-021 | Given the repository `.gitignore`, When a run-folder path in the Skilled tree is checked, Then git reports it ignored, and fixture runs write only under the temp run-folder root | T032: `git check-ignore -v` prints the `.skilled/skills/.state/*/*` rule | Unmet | - |
| AC-018 | REQ-005, REQ-020 | Given a fixture answered item, When the runner gets a `resume` request for it by a direct call, Then a new run id starts joined to the item, the built prompt holds the question, the answer and the original spec folder, and a planted secret in the answer is refused by key | Test T029 | Unmet | - |
| AC-019 | REQ-013, REQ-022 | Given one open item for a bot, When another run of that bot starts, Then it exits with the refusal code and cause `awaiting-decision-hold` naming the item, with no dispatch receipt and no lease, and once the item is answered or past `expiresAt` the same run dispatches | Test T034 | Unmet | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** No

Nothing is built yet, so every open criterion is Unmet. The rows `bots answer` once held are Superseded, because phase 5 now owns that verb (operator decision D12).
<!-- /ANCHOR:closure -->
