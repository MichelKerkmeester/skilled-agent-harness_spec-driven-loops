---
title: "Feature Specification: Phase 5: answer-flow"
description: "The answer surface of `bots ui`: the pending-approval banner, the decision and choice overlays, free-text entry for an item with no options, the in-flight lock, the refusal display and the closed-input exit, proven by an argv log rather than a keystroke."
trigger_phrases:
  - "answer flow"
  - "phase 5 answer flow"
  - "approval overlay"
  - "free-text answer"
  - "in-flight lock"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: answer-flow

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-panes |
| **Successor** | 006-hardening-and-proof |
| **Handoff Criteria** | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and the recorded argv is exactly `answer <item-id> <text> --scope once\|deny`; `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib closed_input` prints `test result: ok`; the operator answers one item from the overlay by hand and its item file reads back as answered |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Terminal screen children: UX, architecture, shell, panes, answer flow, hardening specification.

**Scope Boundary**: The one surface that writes. This child draws the pending-approval banner, opens a decision or a choice overlay over an inbox item, takes a typed line when the item has no options, locks its keys while the answer is in flight, shows a refusal in the status row, and leaves the item open when the input closes. It adds no verb, no JSON contract and no state file: every write is one `bots answer <item-id> <text> --scope once|deny` call through `cli.rs`, and every read is the `bots inbox --json` payload phase 001 ships.

**Dependencies**:
- 002-architecture-and-contracts, which creates `state.rs`, `keys.rs`, `cli.rs`, `app.rs`, `model.rs` and `tests/fixtures/bots`. This child extends all six and creates none of them.
- 004-panes, which creates the inbox pane, the `Option<ItemId>` selection and the `Remote<T>` surface this child's overlay reads. The overlay captures the item id, never the row index, because the 5-second poll reorders rows.
- 003-shell-and-navigation, which owns the status row this child writes a refusal into, and the `keys.rs` label the banner draws.
- Phase 001's `bots inbox --json` and `bots answer --scope once|deny`, which are the read and the write this child consumes unchanged. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:153] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:156]

**Deliverables**:
- `crates/bots-tui/src/view/overlay.rs`, the decision and choice overlays, the free-text line, the in-flight lock and the refusal state.
- `crates/bots-tui/src/view/banner.rs`, the pending-approval row above the input.
- `crates/bots-tui/tests/answer_flow.rs`, the argv log, the Esc close, the closed input, the free text, the lock, the refusal, the gone item, Ctrl+C and the unbound key.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The screen can draw an inbox item but cannot answer one. `bots answer` takes no `--scope`, so a denial cannot be recorded as a denial, and `bots inbox` has no JSON mode, so the overlay has no item to open. The pre-expansion phase 003 also bound `1` to two different answers and offered `y`/`n` only, which leaves an open question with no options unanswerable from the screen even though `bots answer` takes free text. [SOURCE: .skilled/bin/bots.cjs:73] [SOURCE: .skilled/bin/bots.cjs:458] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:212]

### Purpose
One overlay that answers a needs-you item from the terminal, records the scope the operator chose, and writes nothing when the operator closes it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/bots.cjs answer item-1 yes --scope once
bots: unknown option: --scope
usage: bots <verb> [id] [--repo <path>] [--skilled-tree <path>]
...
exit codes: 0 completed, 1 run failure, 2 usage, 3 recursion guard, 4 refused before dispatch, 5 awaiting decision
EXIT=2

$ node .skilled/bin/bots.cjs inbox --json
bots: inbox takes no --json
...
EXIT=2

$ ls crates
ls: crates: No such file or directory
EXIT=1
```

The first two blocks are the measured gap this child closes from its own side: `answer` accepts no `--scope`, so the screen cannot record a deny as a deny, and `inbox` answers no JSON, so the overlay has no item to open. The third is the crate: `crates/bots-tui` does not exist yet, so no overlay exists either. The verb spec at `.skilled/bin/bots.cjs:73` lists no option for `answer`, and the inbox branch at `.skilled/bin/bots.cjs:458` prints tab-separated text. [SOURCE: .skilled/bin/bots.cjs:73] [SOURCE: .skilled/bin/bots.cjs:458] [SOURCE: .skilled/bin/bots.cjs:159-164]
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Draw the pending-approval banner above the input row from the open item count, naming the inbox tab key rather than `Ctrl+P`, and leave the row blank when no item is open.
- Open a decision overlay on Enter over an inbox item, drawing `1 approve once`, `n deny` and `Esc close` with deny placed before approve, and close it on Esc without writing.
- Open a choice overlay when the item carries options, where digits `1` to `9` pick the option at that position and `n` still denies.
- Take a typed line when the item carries no options, with every single-key shortcut paused while the operator types, and send it as the answer text with `--scope once`.
- Lock every overlay key after the first press until the result returns, so a second press writes nothing.
- Show the first stderr line of a refused `bots answer` in the status row, keep the overlay open and leave the item open.
- Say an item is gone when a refresh drops it, and refuse to answer an expired item by disabling every answer key in the overlay.
- Close the overlay on Ctrl+C and write nothing, quit on Ctrl+C with no overlay open, and do nothing on an unbound key.
- Prove all of it from the fixture's argv log, so no test needs a tty.

### Out of Scope
- `bots answer --json` - the screen reads the exit code and stderr the verb already writes, and the parent spec rules the flag out. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:263]
- The `always` and `conversation` scopes - a standing grant needs a rule store no phase lands, so the overlay offers `once` and `deny` only. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:177]
- The inbox pane's rows, its loading and error states, and the selection - 004-panes owns them, and this child reads the selected item id.
- The status row's own layout and the footer's key line - 003-shell-and-navigation owns both, and this child writes one message into the row and one label into the table.
- The `grants` object and the precedence ladder - 006-approval-grants owns them, and the screen reads neither, so it never waits for 006. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:101]
- The roster check that refuses `answer-not-approver` - 011-messaging-channels owns it, and this child only displays the refusal it produces. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:208]
- `insta` - snapshot tests assert the ratatui `TestBackend` buffer directly.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `crates/bots-tui/src/view/overlay.rs` | Create | The decision and choice overlays, the free-text line, the in-flight lock and the refusal state, with a `TestBackend` unit test per state |
| `crates/bots-tui/src/view/banner.rs` | Create | The pending-approval row: the open item count, the inbox tab key label read from `keys.rs`, and the hidden state |
| `crates/bots-tui/src/state.rs` | Modify | The overlay state: idle, sending, refused and gone, the free-text buffer, and the lock that refuses a second press |
| `crates/bots-tui/src/keys.rs` | Modify | The overlay bindings and the label each one draws: `y`, `n`, `1` to `9`, `Esc`, `Ctrl+C` and the typing mode that pauses them |
| `crates/bots-tui/src/cli.rs` | Modify | The `answer` call carrying `--scope once\|deny`, and the stderr capture the status row reads |
| `crates/bots-tui/src/model.rs` | Modify | `options` on the inbox item, so the overlay can tell a choice item from a free-text one |
| `crates/bots-tui/src/app.rs` | Modify | The `Answer` effect, the lock, the refusal path and the closed-input exit |
| `crates/bots-tui/tests/fixtures/bots` | Modify | The `answer` branch, the argv log line and the refusal switch the tests drive |
| `crates/bots-tui/tests/answer_flow.rs` | Create | The argv log, the digit, the Esc close, the closed input, the free text, the typing pause, the lock, the refusal, the gone item, the expired item, Ctrl+C and the unbound key |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

REQ-003, REQ-006, REQ-010 and REQ-011 are inherited from the parent and keep their id and their wording, so a citation from another phase still resolves. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:175] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:177] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:178] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:179]

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-003 | The binary reads only through `bots ... --json` and writes only through `bots answer <item-id> <text> --scope once\|deny`. `cli.rs` takes the program and its arguments from its caller, defaulting to `node` plus `<skilled-tree>/.skilled/bin/bots.cjs`, so every read is one `<program> <verb> --json --repo <repo>` call and the tests point it at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")`, which resolves from the crate directory cargo runs tests in. The binary opens no file under the state root. |
| REQ-006 | The inbox pane lists every open and expired item from `bots inbox --json`. Digits 1 to 9 pick the option at that position, and only inside an overlay. `y` answers `approve` with `--scope once` and `n` answers `deny` with `--scope deny`, so every write is `bots answer <item-id> <text> --scope once\|deny`. Deny is `n`; no other key denies. The overlay offers no `always` and no `conversation` scope, because a standing grant needs a rule store no phase lands. |
| REQ-010 | Every bound key is drawn on screen in the frame that binds it: the footer names `Alt+1..4`, `[` `]`, `Ctrl+P` and `Ctrl+D`; the inbox footer names `1-9`, `y`, `n` and `Esc`; the overlay names `1`, `n` and `Esc`. |
| REQ-011 | When the input closes while an item is selected, the binary writes no answer and exits 0, and `bots inbox --json` still lists the item as open. The loop takes its events from a source the caller supplies, so a closed input is one event a lib test feeds without a terminal, and that test asserts the fixture recorded no `answer` argv. |
| REQ-013 | Enter over an inbox item opens the overlay, which draws its choices numbered and places deny before approve: `1 approve once`, `n deny`, `Esc close`. Esc closes the overlay and leaves the item open, and a lib test fed an Esc event proves that without a terminal. The overlay captures the item id, never the row index, so a refresh that reorders rows cannot retarget the answer. |
| REQ-014 | An item whose `options` array is empty takes a typed line. Every single-key shortcut pauses while the operator types, so a `y` or an `n` inside the line is text and not a decision, and Enter sends the line as the answer text with `--scope once`. An item that carries options keeps the digit keys and offers no free-text line. |
| REQ-015 | The overlay locks every key after the first press until the result returns. A second press while the answer is in flight writes nothing, and the overlay draws its sending state so the operator can see why the keys are dead. |
| REQ-016 | A `bots answer` that exits non-zero puts the first line of its stderr in the status row, keeps the overlay open on the same item and leaves the item open, so a refusal is visible and retryable rather than silent. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-012 | When `bots inbox --json` reports at least one open item, a banner row sits above the input reading `! <n> pending approval · <inbox tab key> → inbox` when n is 1 and `! <n> pending approvals · <inbox tab key> → inbox` otherwise, where the key label is the one `keys.rs` binds for the inbox tab. With no open item the row is blank. |
| REQ-017 | An item that a refresh no longer lists is drawn as gone: the overlay says the item is no longer open and disables every key, so no answer is written for it. An expired item stays visible in the inbox and cannot be answered, because `bots answer` would refuse it. |
| REQ-018 | Ctrl+C closes an open overlay and writes nothing; with no overlay open it quits. A key that binds no action does nothing, never a default deny, so no keystroke can deny an item the operator did not name. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok`, and the argv the fixture recorded for a deny is exactly `answer <item-id> deny --scope deny`.
- **SC-002**: The same suite proves that an Esc close, a closed input, a Ctrl+C close, an unbound key and a second press each record no `answer` argv at all.
- **SC-003**: With one open item the banner reads `! 1 pending approval · Alt+2 → inbox`, and with none the row is blank.
- **SC-004**: An item with no options answered with the typed line `hold` records `answer <item-id> hold --scope once`, and a `y` typed inside that line stays part of the text.
- **SC-005**: A refused answer puts `bots: answer-not-approver` in the status row, and the overlay and the item both stay open.
- **SC-006**: `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target, and `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0.
- **SC-007**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 002's `cli.rs`, `state.rs`, `keys.rs`, `app.rs`, `model.rs` and `tests/fixtures/bots` | High - this child creates none of them, so nothing compiles without 002 | The child's first task confirms all six exist, and the plan's Definition of Ready names 002 as closed |
| Dependency | 004's `Option<ItemId>` selection and `Remote<T>` inbox surface | High - the overlay has no item to open | The overlay reads the selected id from state, and the fixture carries an item, so the test drives the overlay with no pane drawn |
| Dependency | Phase 001's `bots inbox --json` and `bots answer --scope once\|deny` | Medium - the write records `once` for every answer, so a deny reads as an allow | The fixture carries both flags, and the argv assertion fails loudly if `--scope` is dropped |
| Risk | A second press writes a second answer | High - two answers race and one is refused `item-answered-differently` | The lock is state, not a flag on the view, so the reducer test asserts the second press produces no `Answer` effect |
| Risk | A free-text line is read as a shortcut | High - typing `n` in a line would deny the item | The typing mode pauses every single-key binding, and a test types `y` and `n` inside a line and asserts the recorded text |
| Risk | A refusal is swallowed and the overlay closes | Medium - the operator believes the item was answered | The refusal keeps the overlay open and writes the stderr line, and a test drives exit 4 through the fixture |
| Risk | The overlay answers a stale row | Medium - the 5-second poll reorders rows, so a row index points at a different item | The overlay captures the item id, and a test answers after a refresh that reorders the fixture's items |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: One overlay frame draws in under 16 ms at 120x40 with 500 inbox items, because the overlay draws the selected item and its options, never the whole list.
- **NFR-P02**: One answer spawns exactly one `bots answer` process. A refresh after the answer is the same three reads the 5-second poll already issues, so the answer adds no second fetch for a surface already in flight.

### Security
- **NFR-S01**: The answer text reaches the runtime only through `bots answer`, which refuses a secret literal before it stores the answer, so the screen adds no second path to the state root. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:1-14]
- **NFR-S02**: The typed line is stripped of control characters before it is drawn, so a pasted escape sequence cannot move the cursor or corrupt the frame. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:87-93]
- **NFR-S03**: No key denies an item the operator did not name. An unbound key and a closed input both write nothing, so a stray keystroke cannot answer.

### Reliability
- **NFR-R01**: A refused answer never closes the overlay and never drops the item, so the operator can retry or close.
- **NFR-R02**: The answer path leaves the terminal restored on every exit, including a panic during the spawn, because the guard 002 installs wraps the whole loop and this child adds no second exit path.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no open item - the banner row is blank, Enter over an empty inbox opens no overlay, and the loop draws the inbox pane's own empty message.
- Maximum input: an item with nine options - digits `1` to `9` each pick one, and a tenth option is reachable only by its text, because the overlay binds no key past `9`.
- Maximum input: a 500-character typed line - the line scrolls inside the overlay and the answer carries the whole text, because the runtime stores what it is given.
- Failure path: `bots answer` exits 4 with `bots: answer-not-approver` - the status row shows that line, the overlay stays open and the item stays open.
- Gone item: the item is answered elsewhere and the next refresh drops it - the overlay says the item is no longer open and every key is disabled.
- Expired item: the item's `state` is `expired` - it stays visible in the inbox, the overlay opens, and every answer key is disabled.
- Closed input: the input closes with an item selected - nothing is written, the binary exits 0, and the item stays open.
- Ctrl+C: with an overlay open it closes and writes nothing; with none open it quits.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two new files and seven modified ones, about 700 lines, inside a crate 002 creates |
| Risk | 10/25 | The one write path in the crate, but no auth, no migration and no shared contract change |
| Research | 6/20 | Four design sources read once; the JSON contract belongs to phase 001 |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Where does the banner live? Decision: `crates/bots-tui/src/view/banner.rs`, created here. The parent's file table names no home for it, and putting it in `view/panes.rs` would make 004 and 005 both own that file. The key label it draws comes from `keys.rs`, which 003 owns, so 003's defect fix and this child's row do not collide. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:219]
- Does the overlay offer `always`? Decision: no, for the reason the parent records: a standing grant needs a rule store no phase lands. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:264]
- What does `y` answer with? Decision: the literal text `approve` with `--scope once`, because the parent's REQ-006 says so and the runtime stores the text it is given. A choice item's digit sends the option's own text instead.
- Does a free-text answer need a scope choice? Decision: no. A typed line is an approval of what the operator wrote, so it records `once`; a denial is `n` and records `deny`.
- Is the hand check an acceptance criterion? Decision: no. It needs a tty by design, so it is a task the operator runs and the parent goal records it as not a criterion. Every acceptance criterion runs without one.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`, whose REQ-003, REQ-006, REQ-010 and REQ-011 this child inherits
- **Parent Goal**: `../goal.md`, whose binding row for this phase makes this packet's `goal.md` authoritative for it
- **Predecessor**: `../004-panes/spec.md`, which owns the inbox pane and the selection this overlay reads
- **Successor**: `../006-hardening-and-proof/spec.md`, which runs the gates over this child's files
- **Design sources**: `../context/openhuman-tui`, `../context/openghost-approval-card.js`, `../context/openghost-ask-card.js`, `../context/openmaus-ApprovalCard.tsx` and `../context/turnstone-cli.py`, read for shape only
- **Pre-expansion documents**: `../context/legacy-003/`, gitignored, which held this child's tasks and criteria before the expansion
