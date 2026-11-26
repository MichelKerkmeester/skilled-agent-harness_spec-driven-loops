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
| **Handoff Criteria** | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and the recorded argv is exactly `answer --scope once\|deny --repo <repo> -- <item-id> <text>`. `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib closed_input` prints `test result: ok` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Terminal screen children: UX, architecture, shell, panes, answer flow, hardening specification.

**Scope Boundary**: The one surface that writes. This child opens a decision or a choice overlay over an inbox item, takes a typed line when the item has no options, locks its keys while the answer is in flight, shows a refusal in the status row and leaves the item open when the input closes. It adds no verb, no JSON contract and no state file: every write is one `bots answer --scope once|deny --repo <repo> -- <item-id> <text>` call through `cli.rs`, and every read is the `bots inbox --json` payload phase 001 ships.

**Dependencies**:
- 002-architecture-and-contracts, which creates `state.rs`, `keys.rs`, `cli.rs`, `app.rs`, `model.rs` and `tests/fixtures/bots`. This child extends `state.rs` and `keys.rs` in the sections the owner map gives it and reads the other four.
- 004-panes, which creates the inbox pane, the `PaneView<ItemId>` selection and the `Remote<T>` surface this child's overlay reads. The overlay captures the item id, never the row index, because the 5-second poll reorders rows.
- 003-shell-and-navigation, which owns the status row this child writes a refusal into, the `view/mod.rs` root this child declares its module in, and the one sanitizer the typed line passes through.
- 004-panes, which owns the pending-approval banner row and the `keys.rs` label it draws, because the frames that hold an open item draw the row and 004's snapshot gate must go green before this child starts.
- Phase 001's `bots inbox --json` and `bots answer --scope once|deny --repo <repo> -- <item-id> <text>`, which are the read and the write this child consumes unchanged. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-003] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-010]

**Deliverables**:
- `crates/bots-tui/src/view/overlay.rs`, the decision and choice overlays, the free-text line, the in-flight lock, the refusal state and the grant row drawn only when the item carries one.
- One `mod overlay;` line in `crates/bots-tui/src/view/mod.rs`, the root 003 creates.
- `crates/bots-tui/tests/answer_flow.rs`, the argv log, the Esc close, the closed input, the free text, the lock, the refusal, the gone item, Ctrl+C and the unbound key.
- `crates/bots-tui/tests/end_to_end.rs`, the scripted loop from the fixture to frame 1.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The screen can draw an inbox item but cannot answer one. `bots answer` takes no `--scope`, so a denial cannot be recorded as a denial, and `bots inbox` has no JSON mode, so the overlay has no item to open. The pre-expansion phase 003 also bound `1` to two different answers and offered `y`/`n` only, which leaves an open question with no options unanswerable from the screen even though `bots answer` takes free text. [SOURCE: .skilled/bin/bots.cjs:73] [SOURCE: .skilled/bin/bots.cjs:458] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:248]

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

The first two blocks are the gap as it stood when this phase was measured: `answer` accepted no `--scope`, so the screen could not record a deny as a deny, and `inbox` answered no JSON, so the overlay had no item to open. Packet phase 001 closes both, and this child consumes the result rather than re-measuring it, which is why T001 confirms the 001 surface instead of the gap. The third block is the crate: `crates/bots-tui` does not exist yet, so no overlay exists either. The verb spec at `.skilled/bin/bots.cjs:73` lists no option for `answer`, and the inbox branch at `.skilled/bin/bots.cjs:458` prints tab-separated text. [SOURCE: .skilled/bin/bots.cjs:73] [SOURCE: .skilled/bin/bots.cjs:458] [SOURCE: .skilled/bin/bots.cjs:159-164]
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Open a decision overlay on Enter over an inbox item, drawing `n deny` before `y approve once`, drawing `1-9 pick` only when the item carries options, and drawing `Esc close`, and close it on Esc without writing.
- Open a choice overlay when the item carries options, where digits `1` to `9` pick the option at that position and `n` still denies.
- Take a typed line when the item carries no options: a drawn `t` row enters text mode, every single-key shortcut pauses while the operator types, and Enter sends the line as the answer text with `--scope once`.
- Draw a grant's kind and rung in the overlay only when the item carries them, and draw nothing where they are absent, so the frame builds before packet phase 006 and lights up after it.
- Lock every overlay key after the first press until the result returns, so a second press writes nothing.
- Show the first stderr line of a refused `bots answer` in the status row, keep the overlay open on the same item unless the refusal is gone-class, and leave the item open.
- Say an item is gone when a refresh drops it or lists it not open, and refuse to answer an expired item by disabling every answer key in the overlay.
- Close the overlay on Ctrl+C and write nothing, quit on Ctrl+C with no overlay open, and do nothing on an unbound key.
- Prove all of it from the fixture's argv log, so no test needs a tty.

### Out of Scope
- `bots answer --json` - the screen reads the exit code and stderr the verb already writes, and the parent spec rules the flag out. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:295]
- The `always` and `conversation` scopes - a standing grant needs a rule store no phase lands, so the overlay offers `once` and `deny` only. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:206]
- The inbox pane's rows, its loading and error states, and the selection - 004-panes owns them, and this child reads the selected item id.
- The status row's own layout and the footer's key line - 003-shell-and-navigation owns both, and this child writes one message into the row and one label into the table.
- The `grants` object and the precedence ladder - 006-approval-grants owns them. The overlay reads a grant only to draw its kind and rung when the item carries them, and draws nothing where they are absent, so it never waits for 006. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, section "In Scope"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:230]
- The roster check that refuses `answer-not-approver` - 011-messaging-channels owns it, and this child only displays the refusal it produces. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md, REQ-021]
- `insta` - snapshot tests assert the ratatui `TestBackend` buffer directly.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `crates/bots-tui/src/view/overlay.rs` | Create | The decision and choice overlays, the free-text line, the in-flight lock and the refusal state, with a `TestBackend` unit test per state |
| `crates/bots-tui/src/view/mod.rs` | Modify | One `mod overlay;` line beside the modules 003 and 004 declare, so the view root stays `src/view/mod.rs` |
| `crates/bots-tui/src/state.rs` | Modify | `on_overlay_action`, `reconcile_overlay` and `overlay_on_answered`: the phases `Idle`, `Typing`, `Sending`, `Refused` and `Gone`, the buffer, and the lock that `Sending` is |
| `crates/bots-tui/src/keys.rs` | Modify | The overlay bindings and the label each one draws: `y`, `n`, `1` to `9`, `t`, `Esc`, `Ctrl+C` and the `Typing` phase that pauses them |
| `crates/bots-tui/tests/answer_flow.rs` | Create | The argv log, the digit, the Esc close, the closed input, the free text, the typing pause, the leading `y`, the lock, the refusal, the gone item, the expired item, Ctrl+C, the unbound key, the refresh during sending, the reopen while in flight, the blank line, the gone-class refusal and the dash-led text |
| `crates/bots-tui/tests/end_to_end.rs` | Create | The scripted loop from the fixture to frame 1 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

REQ-003, REQ-006, REQ-010 and REQ-011 are inherited from the parent and keep their id and their wording, so a citation from another phase still resolves. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:204] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:206] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:207] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:208]

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-003 | The binary reads only through `bots ... --json` and writes only through `bots answer --scope once\|deny --repo <repo> -- <item-id> <text>`. `cli.rs` takes the program and its arguments from its caller, defaulting to `node` plus `<skilled-tree>/.skilled/bin/bots.cjs`, so every read is one `<program> <verb> --json --repo <repo>` call and the tests point it at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")`, which resolves from the crate directory cargo runs tests in. The binary opens no file under the state root. The two positionals follow a `--` terminator, so a text that starts with a dash is sent as text. |
| REQ-006 | The inbox pane lists every open and expired item from `bots inbox --json`. Digits 1 to 9 pick the option at that position, and only inside an overlay. `y` answers `approve` with `--scope once` and `n` answers `deny` with `--scope deny`, so every write is `bots answer --scope once\|deny --repo <repo> -- <item-id> <text>`. Deny is `n`. No other key denies. The overlay offers no `always` and no `conversation` scope, because a standing grant needs a rule store no phase lands. |
| REQ-010 | Every bound key is drawn on screen in the frame that binds it: the footer names `Alt+1..4`, `[` `]`, `Ctrl+P` and `Ctrl+D`. The inbox footer names `Enter open`. The decision overlay names `t`, `n`, `y` and `Esc` and the choice overlay names `1-9`, `n` and `Esc`, each drawing `n deny` before any approve key. |
| REQ-011 | When the input closes while an item is selected, the binary writes no answer and exits 0, and `bots inbox --json` still lists the item as open. The loop takes its events from a source the caller supplies, so a closed input is one event a lib test feeds without a terminal, and that test asserts the fixture recorded no `answer` argv. |
| REQ-013 | Enter over an inbox item whose `state` is `open` opens the overlay, because an expired item and an item in any other state carry no answer key, which draws `n deny` before any approve key, draws `1-9 pick` only when the item carries options and draws `Esc close`. A digit picks the option at that position and never approves. `y` approves once and `n` denies. Esc closes the overlay and leaves the item open, and a lib test fed an Esc event proves that without a terminal. The overlay captures the item id, never the row index, so a refresh that reorders rows cannot retarget the answer. |
| REQ-014 | An item whose `options` array is empty takes a typed line. The overlay opens in shortcut mode and draws a `t type` row. Pressing `t` enters text mode, where every single-key shortcut pauses, so a `y` or an `n` inside the line is text and not a decision, and a line may begin with either. Enter sends the line as the answer text with `--scope once`, and Backspace deletes the last character. An item that carries options keeps the digit keys and offers no free-text line. Enter on a line that is blank after trimming whitespace sends nothing and stays in text mode, because the CLI refuses blank text as a usage error. Esc in text mode closes the overlay. A refused typed line is kept, and `t` returns to it. |
| REQ-015 | The overlay locks every answer key (`t`, `y`, `n`, `1` to `9`, Enter and typing) after the first press until the result returns. A second press while the answer is in flight writes nothing, and the overlay draws its sending state so the operator can see why the keys are dead. Esc and Ctrl+C close the overlay while sending, the in-flight answer still completes, and its result reaches the status row. The reducer keeps `pending_answers`, the item ids with an answer in flight, outside the overlay, so Enter on such an item reopens the overlay in its sending state and cannot write twice. A refresh that lands while sending never moves the phase. Ctrl+D or a closed input while sending quits at once with exit 0, and the child is left to finish its write. |
| REQ-016 | A `bots answer` that exits non-zero, or that the worker stops at the child timeout, puts the first line of its stderr, or the screen's own `bots-ui:` line, in the status row. A refusal naming `item-unknown`, `item-expired` or `item-answered-differently` moves the overlay to gone, because a retry cannot succeed. Any other refusal keeps the overlay open on the same item in refused, with the keys unlocked, unless the latest inbox rows no longer list the item open, which moves it to gone. `cli.rs` extracts the reason name on the worker and the reducer classes it, so the loop never parses a message. `design/state-machines.md` section 4 is the full table. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-012 | Moved to 004-panes as REQ-027. The pending-approval banner row is 004's, because the frames that hold an open item draw it and 004's snapshot gate must go green before this child starts. This child draws no banner and declares no `mod banner;` line. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes/spec.md, REQ-027] |
| REQ-017 | An item that a refresh no longer lists, or lists in a state other than `open`, is drawn as gone, except while the overlay is sending, where the answer's own result decides. A gone overlay says the item is no longer open and disables every answer key (`t`, `y`, `n`, `1` to `9`, Enter and typing), so no answer is written for it. An expired item stays visible in the inbox and cannot be answered, because `bots answer` would refuse it. An expired item opens in `gone` and draws frame 22. |
| REQ-018 | Ctrl+C closes an open overlay and writes nothing. With no overlay open it quits. A key that binds no action does nothing, never a default deny, so no keystroke can deny an item the operator did not name. |
| REQ-019 | The overlay draws a grant's kind and rung only when the item carries them, and draws no grant row where they are absent, so the same frame builds before packet phase 006 lands `grants` and lights up after it. An item that carries a grant draws one `grant` row naming its kind and its rung. An item that carries none draws no `grant` row at all. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:230] |
| REQ-020 | A successful `bots answer` closes the overlay and marks the answered row with its outcome word, `approved`, `denied` or `answered`. The word stays drawn, and the answered item stays listed, until the first successful inbox read issued after the result lands, which is the next 5-second poll. The screen issues no read of its own on success, so the word does not flash. |
| REQ-021 | A text in the NO set records `deny` even when `--scope once` is given, and on a claimed review item `reject` forces `deny` while `confirm` forces `once`, so a refusal is never recorded as a grant. The screen sends `--scope once` on every digit pick and every typed line and relies on this rule, which `contracts/answer-seam.md` step 8 and `006-approval-grants/design/records.md` section 2.1 own. A `["confirm","reject"]` item is the case that proves it. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok`, and the argv the fixture recorded for a deny is exactly `answer --scope deny --repo <repo> -- <item-id> deny`.
- **SC-002**: The same suite proves that an Esc close, a closed input, a Ctrl+C close, an unbound key and a second press each record no `answer` argv at all.
- **SC-003**: The banner row is 004's, so this child's suite asserts no banner cell and 004's AC-019 owns the row's two states.
- **SC-004**: An item with no options answered with the typed line `hold` records `answer --scope once --repo <repo> -- <item-id> hold`, and a `y` typed inside that line stays part of the text.
- **SC-005**: A refused answer puts `bots: answer-not-approver` in the status row, and the overlay and the item both stay open.
- **SC-006**: `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target, and `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0.
- **SC-007**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow --strict` prints `RESULT: PASSED`.
- **SC-008**: An item carrying a grant draws one `grant` row naming its kind and rung, and an item carrying none draws no `grant` row, so the same frame builds before packet phase 006.
- **SC-009**: A successful answer closes the overlay, leaves the row's outcome word drawn and issues no read of its own, and the word clears only on the next successful inbox read.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 002's `cli.rs`, `state.rs`, `app.rs`, `model.rs` and fixture, and 003's `keys.rs` | High - this child creates none of them, so nothing compiles without 002 | The child's first task confirms all six exist, and the plan's Definition of Ready names 002 as closed |
| Dependency | 004's `PaneView<ItemId>` selection and `Remote<T>` inbox surface | High - the overlay has no item to open | The overlay reads the selected id from state, and the fixture carries an item, so the test drives the overlay with no pane drawn |
| Dependency | Phase 001's `bots inbox --json` and `bots answer --scope once\|deny --repo <repo> -- <item-id> <text>` | Medium - the write records `once` for every answer, so a deny reads as an allow | The fixture carries both flags, and the argv assertion fails loudly if `--scope` is dropped |
| Risk | A second press writes a second answer | High - two answers race and one is refused `item-answered-differently` | The lock is state, not a flag on the view, so the reducer test asserts the second press produces no `Answer` effect |
| Risk | A free-text line is read as a shortcut | High - typing `n` in a line would deny the item | The overlay opens in shortcut mode and `t` enters text mode, where every single-key binding pauses. A test types a line beginning `y` and asserts the recorded text |
| Risk | A refusal is swallowed and the overlay closes | Medium - the operator believes the item was answered | A refusal that is not gone-class keeps the overlay open and writes the stderr line, and a test drives exit 4 through the fixture |
| Risk | The overlay answers a stale row | Medium - the 5-second poll reorders rows, so a row index points at a different item | The overlay captures the item id, and a test answers after a refresh that reorders the fixture's items |
| Risk | The overlay requires a grant the item does not carry | High - the frame would not build before packet phase 006 lands `grants` | The grant row is drawn only when present, and a test asserts both cases |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One overlay frame draws in under 16 ms at 120x40 with 500 inbox items, because the overlay draws the selected item and its options, never the whole list.
- **NFR-P02**: One answer spawns exactly one `bots answer` process and issues no read of its own. The answered row keeps its outcome word until the next 5-second poll's successful inbox read, so the answer adds no fetch for a surface already in flight.

### Security
- **NFR-S01**: The answer text reaches the runtime only through `bots answer`, which refuses a secret literal before it stores the answer, so the screen adds no second path to the state root. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:1-14]
- **NFR-S02**: The typed line passes through the one sanitizer 003 owns in `theme.rs` before it is drawn, so a pasted escape sequence cannot move the cursor or corrupt the frame, and this child keeps no second copy of the strip. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:87-93]
- **NFR-S03**: No key denies an item the operator did not name. An unbound key and a closed input both write nothing, so a stray keystroke cannot answer.

### Reliability
- **NFR-R01**: A refused answer never drops the item, and a refusal that is not gone-class never closes the overlay, so the operator can retry or close.
- **NFR-R02**: The answer path leaves the terminal restored on every exit, including a panic during the spawn, because the guard 002 installs wraps the whole loop and this child adds no second exit path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no open item - 004's banner row is blank, Enter over an empty inbox opens no overlay and the loop draws the inbox pane's own empty message.
- Maximum input: an item with more than nine options - the overlay draws the first nine, and it draws one line naming `bots answer --scope once --repo <repo> -- <item-id> <text>` for the rest.
- Maximum input: a 500-character typed line - the line scrolls inside the overlay and the answer carries the whole text, because the runtime stores what it is given.
- Free text beginning with a shortcut letter: the operator presses `t` first, so a line reading `yes, after the freeze` is text and not an approval.
- No grant: the item carries no `grants` object - the overlay draws no `grant` row and every key still works, which is the state the frame is in until packet phase 006 lands.
- Failure path: `bots answer` exits 4 with `bots: answer-not-approver` - the status row shows that line, the overlay stays open and the item stays open.
- Gone item: the item is answered elsewhere and the next refresh drops it - the overlay says the item is no longer open and every answer key (`t`, `y`, `n`, `1` to `9`, Enter and typing) is disabled.
- Expired item: the item's `state` is `expired` - it stays visible in the inbox, the overlay opens, and every answer key is disabled.
- Closed input: the input closes with an item selected - nothing is written, the binary exits 0, and the item stays open.
- Ctrl+C: with an overlay open it closes and writes nothing. With none open it quits.
- Text that starts with a dash: the typed line `-1` follows the `--` terminator, so the CLI reads it as text and not as an option.
- Gone-class refusal: `bots answer` exits 4 naming `item-answered-differently` - the overlay moves to gone, the status row carries the line and no answer key is live.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two new files and seven modified ones, about 700 lines, inside a crate 002 creates |
| Risk | 10/25 | The one write path in the crate, but no auth, no migration and no shared contract change |
| Research | 6/20 | Four design sources read once. The JSON contract belongs to phase 001 |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Where does the banner live? Decision: `crates/bots-tui/src/view/banner.rs`, created by 004-panes. The row sits in the frames that hold an open item, so 004's snapshot gate cannot go green while the file belongs to this child, and 004's gate is this child's Definition of Ready. The key label it draws comes from `keys.rs`, which 003 owns, so 003's defect fix and 004's row do not collide. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes/spec.md, REQ-027]
- Does the overlay offer `always`? Decision: no, for the reason the parent records: a standing grant needs a rule store no phase lands. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:296]
- How does the operator start typing? Decision: a drawn `t` row enters text mode, because `y` and `n` are bound in the same overlay and a line beginning with either could otherwise never be typed. The key map row is 001's to add and the `keys.rs` row is this child's, so the two cannot disagree. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/ui-review-1.md:22]
- What does `y` answer with? Decision: the literal text `approve` with `--scope once`, because the parent's REQ-006 says so and the runtime stores the text it is given. A choice item's digit sends the option's own text instead.
- Does a free-text answer need a scope choice? Decision: no. A typed line is an approval of what the operator wrote, so it records `once`. A denial is `n` and records `deny`.
- Is the hand check an acceptance criterion? Decision: no. It needs a tty by design, so it is the final operator acceptance step after 006 and the parent goal records it as not a criterion. Every acceptance criterion runs without one.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`, whose REQ-003, REQ-006, REQ-010 and REQ-011 this child inherits
- **Parent Goal**: `../goal.md`, whose binding row for this phase makes this packet's `goal.md` authoritative for it
- **Predecessor**: `../004-panes/spec.md`, which owns the inbox pane and the selection this overlay reads
- **Successor**: `../006-hardening-and-proof/spec.md`, which runs the gates over this child's files
- **Design sources**: `../context/openhuman-tui`, `../context/openghost-approval-card.js`, `../context/openghost-ask-card.js`, `../context/openmaus-ApprovalCard.tsx` and `../context/turnstone-cli.py`, read for shape only. They are gitignored links, rebuilt from section 2 of `research/context-manifest.md`
- **Pre-expansion documents**: `../context/legacy-003/`, gitignored, which held this child's tasks and criteria before the expansion
