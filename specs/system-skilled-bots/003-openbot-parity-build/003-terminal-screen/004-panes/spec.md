---
title: "Feature Specification: Phase 4: panes"
description: "The four pane bodies of `bots ui` - activity, inbox, routines and the chat placeholder - each drawing loading, empty, rows, error and stale from one `Remote<T>`, with a control-character sanitizer, a selection held by item id, eight status glyphs in a Unicode and an ASCII set, and a 2,000-row frame budget."
trigger_phrases:
  - "pane states"
  - "activity pane"
  - "inbox pane"
  - "routines pane"
  - "chat placeholder"
  - "frame budget"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: panes

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
| **Phase** | 4 of 6 |
| **Predecessor** | 003-shell-and-navigation |
| **Successor** | 005-answer-flow |
| **Handoff Criteria** | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes` prints `test result: ok`, including one buffer snapshot per pane per state at 80x24 and 120x40 and the 2,000-row draw under 16 ms |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Terminal screen children: UX, architecture, shell, panes, answer flow, hardening specification.

**Scope Boundary**: The four pane bodies and the two helpers they need. Activity, inbox, routines and the chat placeholder draw from the `Remote<T>` each surface already holds, and `sanitize.rs` cleans every runtime string before it reaches a cell. The frame, the header, the tab bar, the footer, the status row, the palette and the too-small screen are 003's. The overlay, the banner, the free-text entry and the in-flight lock are 005's. The crate, the terminal guard, the worker thread, `cli.rs`, the fixture and the `ui` verb are 002's.

**Dependencies**:
- 002's `state.rs`, which holds `Remote<T>{rows, last_ok_at, error, in_flight}` and the selection, and 002's `model.rs`, which holds the serde types the panes read.
- 002's fixture at `crates/bots-tui/tests/fixtures/bots`, the only payload source in tests.
- 003's `src/view.rs` view root, which declares the module this child adds, and 003's `theme.rs`, which owns the palette and the `NO_COLOR` mechanism.
- Phase 001's `bots activity --json` and `bots inbox --json`, and phase 002's `bots routines --json`, whose shapes the panes draw unchanged.

**Deliverables**:
- `crates/bots-tui/src/sanitize.rs`, the control-character strip and the display-width clip.
- `crates/bots-tui/src/view/panes.rs`, the four pane bodies, the eight-glyph table in both sets, the five state lines and the wide-layout detail column.
- `crates/bots-tui/tests/panes.rs`, one buffer snapshot per pane per state at both sizes, the reorder test, the sanitizer test and the 2,000-row budget test.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shell 003 lands draws a header, a tab bar, a footer and an empty body. Nothing fills that body, so the three surfaces the runtime already answers as JSON stay unread, and the fourth tab has no line to explain why it is empty. Two faults in the pre-expansion phase make the body unsafe to fill as written: a row selected by its index moves under the operator when the 5-second poll reorders the list, and a bot id or a question carrying a control character moves the cursor and corrupts the frame. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:214] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:216] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:87-93]

### Purpose
Four pane bodies that draw every state of every surface from the JSON the runtime already prints, and never draw a byte the runtime did not mean as text.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls crates/bots-tui
ls: crates/bots-tui: No such file or directory
EXIT=1

$ node .skilled/bin/bots.cjs activity --json
bots: unknown verb: activity
usage: bots <verb> [id] [--repo <path>] [--skilled-tree <path>]
EXIT=2

$ node .skilled/bin/bots.cjs inbox --json
bots: inbox takes no --json
usage: bots <verb> [id] [--repo <path>] [--skilled-tree <path>]
EXIT=2

$ node .skilled/bin/bots.cjs routines --json
bots: unknown verb: routines
usage: bots <verb> [id] [--repo <path>] [--skilled-tree <path>]
EXIT=2

$ cargo --version
cargo 1.92.0 (344c4567c 2025-10-21)
```

The first block is the gap this child fills: no crate exists, so no pane body exists. The next three are the payloads the panes read, and none of them answers today, so every pane is proven against 002's fixture until phases 001 and 002 land their verbs. The last block is the toolchain the checks run on. [SOURCE: .skilled/bin/bots.cjs:31] [SOURCE: .skilled/bin/bots.cjs:142]
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Draw the activity pane from `bots activity --json`: the groups in the order the payload carries them, each with its title, and each row with its marker, its label and its bot id. A group with no rows is not drawn.
- Draw the inbox pane from `bots inbox --json`: every open and expired item, open first, each with its marker, its bot id and its question. An expired item draws dimmed and carries no answer key.
- Draw the routines pane from `bots routines --json`: the bot id, the four-part routine sentence and the routine's state, with an empty line that says what a routine is.
- Draw the chat placeholder as one line naming phase 010, holding no state.
- Draw five states per data pane - loading, empty, rows, error and stale - from the one `Remote<T>` each surface holds, keeping the rows of the last successful read through an error.
- Strip control characters and clip by display width in `sanitize.rs`, so no runtime string reaches a cell unfiltered.
- Hold the selection as `Option<ItemId>`, so a poll that reorders rows keeps the selection on the same item.
- Carry the eight status glyphs in a Unicode set and an ASCII set, and prove both.
- Draw the selected row's detail as a right column at 120 columns or wider.
- Hold the 2,000-row draw under 16 ms at 120x40.

### Out of Scope
- The frame, the header, the tab bar, the footer, the status row, the palette, the help screen and the too-small screen - 003 owns them, and this child draws only the body it is handed.
- The banner, the decision and choice overlays, the free-text entry, the in-flight lock and the refusal display - 005 owns them.
- The crate, the terminal guard, the worker thread, `cli.rs`, the fixture and the `ui` verb - 002 owns them.
- The switch that selects the ASCII glyph set - it shares the mechanism `theme.rs` uses for `NO_COLOR`, which 003 owns, and this child carries and proves the set rather than inventing a second capability probe.
- `insta` as a dependency - the operator refused it, so every snapshot asserts the ratatui `TestBackend` buffer directly. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/decision-record.md:45]
- Mouse support, a theme picker, a demo binary and a bench flag - the parent rules each out.
- Any change to `bots activity`, `bots inbox` or `bots routines` - phases 001 and 002 own those verbs, and this child reads them unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `crates/bots-tui/src/sanitize.rs` | Create | `safe_text` strips control characters and keeps ordinary Unicode; `clip` truncates by display width |
| `crates/bots-tui/src/view/panes.rs` | Create | The four pane bodies, the eight-glyph table in both sets, the five state lines, `stale_label` and the wide-layout detail column |
| `crates/bots-tui/src/view.rs` | Modify | One `mod panes;` line beside the modules 003 declares |
| `crates/bots-tui/tests/panes.rs` | Create | One buffer snapshot per pane per state at both sizes, the reorder test, the sanitizer test and the 2,000-row budget test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files. REQ-003 keeps its parent id and its parent wording, so a citation from another phase still resolves. REQ-010 is not restated here: the parent carries it on 003 and 005, and this child draws no key label of its own beyond the pane footer REQ-026 names.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-003 | The binary reads only through `bots ... --json` and writes only through `bots answer <item-id> <text> --scope once\|deny`. `cli.rs` takes the program and its arguments from its caller, defaulting to `node` plus `<skilled-tree>/.skilled/bin/bots.cjs`, so every read is one `<program> <verb> --json --repo <repo>` call and the tests point it at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")`, which resolves from the crate directory cargo runs tests in. The binary opens no file under the state root. |
| REQ-016 | The activity pane draws the groups `bots activity --json` returns in the order the payload carries them, each with its title, and each row with its marker, its label and its bot id. A group with no rows is not drawn. The seven group ids map to seven markers - `·` working, `✓` done, `✗` failed, `!` needs_you, `–` stopped, `○` scheduled and `↻` recurring - and an eighth, `?`, covers a value the table does not name, drawn with the raw value beside it. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:28-39] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/activity.rs:6-34] |
| REQ-017 | The inbox pane lists every open and expired item `bots inbox --json` returns, open first, each with its marker, its bot id and its question. An expired item draws dimmed and carries no answer key, because it cannot be answered. An empty inbox draws one line saying nothing waits. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/needs-you/board.tsx:161] |
| REQ-018 | The routines pane draws the rows `bots routines --json` returns: the bot id, the four-part routine sentence and the routine's state. An empty list draws one line saying what a routine is, never a blank body. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/routines/routines-list.tsx:226-232] |
| REQ-019 | The chat tab draws one line naming phase 010 and `bots chat`, and holds no state, so Alt+1..4 does not renumber when that phase lands. |
| REQ-020 | Each of the three data panes draws the four states the parent names - loading, empty, error and stale - plus the rows state that carries the payload, so five drawn states in all. Loading draws a named line, never a blank body. Empty draws a line saying what the surface would hold. Error keeps the rows of the last successful read and draws the first stderr line in the body when there are none. `stale_label` returns `stale <n>m` for a read older than the poll interval and `None` otherwise, and the header 003 draws calls it. |
| REQ-021 | Every drawn runtime string passes through `sanitize.rs`, which strips control characters and keeps ordinary Unicode, so a control character in a bot id or a question cannot move the cursor. The strip covers C0 controls except line feed, DEL, the C1 range and lone surrogates, and `clip` truncates by display width so a long question cannot push the footer off screen. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/ui/colors.py:52-59] |
| REQ-022 | Selection is `Option<ItemId>`, never a row index, so a poll that reorders rows keeps the selection on the same item. When the selected item leaves the payload the selection clears rather than pointing at whatever row took its place. |
| REQ-023 | The glyph table carries a Unicode set and an ASCII set behind one `marker(state, glyphs)` function. The ASCII set draws working `*`, done `+`, failed `x`, needs_you `!`, stopped `-`, scheduled `o`, recurring `r` and unknown `?`. Meaning is always in the glyph and the label, never in colour alone. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-024 | At 120 columns or wider the selected row's detail draws as a right column beside the list. Below 120 columns the body is one column and the detail lives in the overlay 005 draws. |
| REQ-025 | 2,000 activity rows draw in under 16 ms at 120x40, measured on the `TestBackend` around the draw call alone, after one warm-up draw, by one test that fails past the budget. |
| REQ-026 | The pane footer line names the list keys the active pane binds: Up, Down, PgUp and PgDn on activity, Up, Down and Enter on inbox, Up and Down on routines. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes` prints `test result: ok` and names one snapshot per pane per state at 80x24 and at 120x40.
- **SC-002**: `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes -- budget` prints `test result: ok` and names `two_thousand_rows_draw_under_16ms`.
- **SC-003**: `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines, and `rg -n 'insta' crates/bots-tui/Cargo.toml` prints nothing.
- **SC-004**: `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0 and `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0.
- **SC-005**: `rg -n 'Command::new' crates/bots-tui/src` prints only `cli.rs`, so no pane spawns a process of its own.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 002's `state.rs` holding `Remote<T>` and an `Option<ItemId>` selection | The panes have no state to draw, and a selection by index reintroduces the reorder defect | The reorder test in `tests/panes.rs` is the gate: it drives two polls with the rows reversed and fails if the selection moves, so a state that selects by index cannot pass |
| Dependency | 002's fixture carrying the four payloads | No pane is testable before phases 001 and 002 land their verbs | Every pane test reads the fixture, so the payload shape is proven in one place and a phase that changes a payload updates the fixture in the same change |
| Dependency | 003's `src/view.rs` view root | The `mod panes;` line has nowhere to land | The task names the file 003 creates and the build is the check, so a missing view root fails at `cargo build` rather than at review |
| Risk | The 16 ms budget is a wall-clock assertion, and a loaded CI runner can miss it | A flaky test that fails for the machine rather than the code | The test warms up once, measures the draw call alone rather than the fixture parse, and the budget is one frame at 60 Hz rather than a tight bound |
| Risk | A control character reaches a cell through a path that skips `sanitize.rs` | A corrupted frame, and a bot id that can move the cursor | One test asserts the buffer holds no escape byte for a bot id carrying `\u{1b}[2J`, and `rg -n 'safe_text' crates/bots-tui/src/view` proves every drawn string passes through it |
| Risk | The ASCII set ships with no switch, so it reads as dead code | A reviewer sees an unused table | The set is `pub` in the library and proven by a test, and the switch is named as 003's because it shares the `NO_COLOR` mechanism; the goal log records the deferral |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: 2,000 activity rows draw in under 16 ms at 120x40, measured around the draw call after one warm-up.
- **NFR-P02**: A pane draws only the rows that fit its body, so the cost of a 2,000-row payload is the clip, not the cell count.

### Security
- **NFR-S01**: No pane spawns a process, opens a file or reads an environment variable; `rg -n 'Command::new' crates/bots-tui/src` matches only `cli.rs`.
- **NFR-S02**: Every runtime string is stripped of control characters before it reaches a cell, so a payload cannot write a terminal escape.

### Reliability
- **NFR-R01**: An error keeps the rows of the last successful read, so one failed poll never empties the screen.
- **NFR-R02**: A selection that leaves the payload clears rather than pointing at a different item, so no key acts on a row the operator did not choose.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `bots activity --json` returns `{"groups":[]}`, `bots inbox --json` returns `{"items":[]}` and `bots routines --json` returns `[]`; each pane draws its empty line and exits the draw without a panic.
- Maximum input: 2,000 activity rows at 120x40 draw in under 16 ms, and a question longer than the body width is clipped by display width rather than wrapped past the footer.
- Failure path: a read that exits non-zero with stderr keeps the previous rows, draws the first stderr line in the body when there are none, and sets the stale label. A payload that does not parse draws the error state rather than a panic.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Three files created and one line added, roughly 600 lines of Rust across the panes, the sanitizer and the tests |
| Risk | 8/25 | No auth, no network and no persistence, with one wall-clock assertion and one cross-child seam into 002's state |
| Research | 6/20 | The payload shapes are fixed by phases 001 and 002, and the layout follows four design sources already read |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the ASCII glyph set need a runtime switch in this child? Decision: no. The set is carried and proven here, and the switch shares the mechanism `theme.rs` uses for `NO_COLOR`, which 003 owns, so a second capability probe would duplicate it.
- Which file is the view root? Decision: `crates/bots-tui/src/view.rs`, which 003 creates and this child adds one `mod panes;` line to. A `src/view/mod.rs` form would move the same line, not the module.
- Who draws the stale text? Decision: `view/panes.rs` owns `stale_label` and its test, and 003's header draws the string it returns, so the age format has one owner and one test.
- Is the 16 ms budget a hard gate? Decision: yes, as one test. It warms up once and measures the draw call alone, so a failure names the draw rather than the fixture parse.
- Does the inbox pane need a second snapshot for an expired row? Decision: no. The `rows` snapshot carries one open and one expired item, and a separate assertion proves the expired row carries no answer key.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`, whose Phase Documentation Map names this child's scope and exit
- **Parent Goal**: `../goal.md`, whose binding row for `004-panes` makes this packet's `goal.md` authoritative for it
- **Parent Decisions**: `../decision-record.md`, whose Q005 carries the glyph set and Q006 refuses `insta`
- **Sibling children**: `001-ux-and-component-map/` for the mockups and the key map, `002-architecture-and-contracts/` for the crate and the fixture, `003-shell-and-navigation/` for the frame, `005-answer-flow/` for the overlay, `006-hardening-and-proof/` for the gates
- **Design sources**: `../context/`, gitignored, holding the openhuman-tui, OpenBot, OpenMausBot, rakazo and turnstone files this child reads for shape and copies no code from
- **Pre-expansion documents**: `../context/legacy-003/`, gitignored, holding the phase 003 tasks and criteria this child inherits
