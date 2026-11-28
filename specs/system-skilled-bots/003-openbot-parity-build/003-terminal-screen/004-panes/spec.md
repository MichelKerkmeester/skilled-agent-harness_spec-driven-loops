---
title: "Feature Specification: Phase 4: panes"
description: "The four pane bodies of `bots ui` - activity, inbox, routines and the chat placeholder - each drawing loading, empty, rows, error and stale from one `Remote<T>`, with the sanitizer and the glyph table 003's `theme.rs` owns, a selection held by each pane's row key, and a 2,000-row draw that visits only the rows its body holds."
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
| **Handoff Criteria** | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test panes` prints `test result: ok`, including one buffer snapshot per pane per state at 80x24 and 120x40 and the 2,000-row draw visiting at most the body height |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Terminal screen children: UX, architecture, shell, panes, answer flow, hardening specification.

**Scope Boundary**: The four pane bodies, the pending-approval banner row, the display-width clip they need and the `list` rows in `keys.rs` that name the keys each pane binds. Activity, inbox, routines and the chat placeholder draw from the `Remote<T>` each surface already holds, and every drawn string passes through the sanitizer `theme.rs` owns before it reaches a cell. The frame, the header, the tab bar, the footer, the status row, the palette, the too-small screen, the glyph table and the sanitizer are 003's, and 003 fills `SHELL_ROWS` in `keys.rs`. The overlay, the free-text entry and the in-flight lock are 005's, and 005 fills the `Overlay` rows. The banner row is this child's, because the frames that hold an open inbox item draw it and this child's snapshot gate must go green before 005 starts. The crate, the terminal guard, the worker thread, `cli.rs`, the fixture, `state.rs` and the `ui` verb are 002's, and this child adds the reducer arms that move the selection.

**Dependencies**:
- 002's `state.rs`, which holds `Remote<T>{rows, last_ok_at, error, in_flight, generation}` and one `PaneView<K>` per pane, and 002's `model.rs`, which holds the serde types the panes read. This child adds `on_list_action`, `reconcile_selection` and `clamp_scroll` and no other line of `state.rs`.
- 002's fixture at `.skilled/crates/bots-tui/tests/fixtures/bots`, the only payload source in tests.
- 002's `tests/common/frames.rs`, the frame loader that reads a frame from `design/mockups.md` by heading and size, so every snapshot compares the buffer to the approved frame rather than to a block typed from the output.
- 003's `src/view/mod.rs` view root, which declares the module this child adds. 003's `theme.rs`, which owns the palette, the glyph table and the sanitizer this child calls, and 003's `view/header.rs`, which owns `stale_label`.
- Phase 001's `bots activity --json` and `bots inbox --json`, and phase 002's `bots routines --json`, whose shapes the panes draw unchanged.

**Deliverables**:
- `.skilled/crates/bots-tui/src/view/panes.rs`, the four pane bodies, the five state lines, the display-width clip and the wide-layout detail column.
- `.skilled/crates/bots-tui/src/view/banner.rs`, the pending-approval row above the body.
- `.skilled/crates/bots-tui/src/view/mod.rs`, one `mod panes;` line and one `mod banner;` line beside the modules 003 declares, and the banner slot call.
- `.skilled/crates/bots-tui/src/keys.rs`, the `list` rows: Up, Down, PgUp and PgDn on every data pane, and Enter on the inbox only.
- `.skilled/crates/bots-tui/src/state.rs`, `on_list_action`, `reconcile_selection` and `clamp_scroll`, which move each pane's `PaneView` and fall to the nearest surviving row.
- `.skilled/crates/bots-tui/tests/panes.rs`, one buffer snapshot per pane per state at both sizes, the reorder test, the sanitizer test and the 2,000-row count test.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shell 003 lands draws a header, a tab bar, a footer and an empty body. Nothing fills that body, so the three surfaces the runtime already answers as JSON stay unread, and the fourth tab has no line to explain why it is empty. Two faults in the pre-expansion phase make the body unsafe to fill as written: a row selected by its index moves under the operator when the 5-second poll reorders the list, and a bot id or a question carrying a control character moves the cursor and corrupts the frame. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md, section "6. DEFECTS THE EXPANSION FIXES"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md, section "6. DEFECTS THE EXPANSION FIXES"] [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/ui/colors.py:76-89]

### Purpose
Four pane bodies that draw every state of every surface from the JSON the runtime already prints, and never draw a byte the runtime did not mean as text.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/crates/bots-tui
ls: .skilled/crates/bots-tui: No such file or directory
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
- Draw the activity pane from `bots activity --json`: the groups in the order the payload carries them, each with its title, and each row with its marker, its label and its bot id. The marker is the one `theme.rs` returns for the row's state, so the eight glyphs have one owner. A group with no rows is not drawn.
- Draw the inbox pane from `bots inbox --json`: every open and expired item, open first, each with its bot id and its question. An open item draws `!` in the gutter and the word `open`. An expired item draws no glyph, the word `expired`, dimmed and carries no answer key. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/glyph-table.md:60]
- Draw the routines pane from the `routines` array `bots routines --json` returns: the bot id, the four-part routine sentence and the routine's state, with an empty line that says what a routine is.
- Draw the chat placeholder as one line naming phase 010, holding no state.
- Draw the pending-approval banner row above the body from the open item count, naming the inbox tab key rather than `Ctrl+P` and leave the row blank when no item is open.
- Draw five states per data pane - loading, empty, rows, error and stale - from the one `Remote<T>` each surface holds, keeping the rows of the last successful read through an error.
- Clip by display width in `view/panes.rs`, and route every drawn string through the sanitizer `theme.rs` owns, so no runtime string reaches a cell unfiltered.
- Hold each pane's selection as its row key, as `design/architecture.md` section 1.4 names, so a poll that reorders rows keeps the selection on the same item, and fall to the nearest surviving row when the item leaves the payload.
- Bind the list keys as `list` rows in `keys.rs`: Up, Down, PgUp and PgDn on all three data panes, and Enter on the inbox only, so the footer 003 draws names them from one table rather than a second list.
- Draw the selected row's detail as a right column at 120 columns or wider, drawing a grant's kind and rung only when the item carries them. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/decision-record.md:47]
- Hold the 2,000-row draw to at most the body height's rows visited at 120x40, with the 16 ms timing as an ignored local check.

### Out of Scope
- The frame, the header, the tab bar, the footer, the status row, the palette, the help screen and the too-small screen - 003 owns them, and this child draws only the body it is handed.
- The glyph table with its Unicode and ASCII columns, the palette and the sanitizer - 003's `theme.rs` owns them, and this child calls them rather than keeping a second copy.
- The decision and choice overlays, the free-text entry, the in-flight lock and the refusal display - 005 owns them.
- The crate, the terminal guard, the worker thread, `cli.rs`, the fixture and the `ui` verb - 002 owns them, and this child edits only the movement arms in `state.rs`.
- The `main`, `inbox`, `palette`, `too-small` and `overlay` rows of `keys.rs` - 003 and 005 own them, and this child adds the `list` rows alone.
- `insta` as a dependency - the operator refused it, so every snapshot compares the ratatui `TestBackend` buffer to the frame `design/mockups.md` draws, cell for cell, and no stored snapshot file hides the cells. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/decision-record.md:45]
- Mouse support, a theme picker, a demo binary and a bench flag - the parent rules each out.
- Any change to `bots activity`, `bots inbox` or `bots routines` - phases 001 and 002 own those verbs, and this child reads them unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/crates/bots-tui/src/view/panes.rs` | Create | The four pane bodies, the five state lines, the display-width clip and the wide-layout detail column |
| `.skilled/crates/bots-tui/src/view/banner.rs` | Create | The pending-approval row: the open item count, the inbox tab key label read from `keys.rs` and the hidden state |
| `.skilled/crates/bots-tui/src/view/mod.rs` | Modify | One `mod panes;` line and one `mod banner;` line beside the modules 003 declares, and the banner slot call |
| `.skilled/crates/bots-tui/src/keys.rs` | Modify | The `list` rows: Up, Down, PgUp and PgDn on every data pane, and Enter on the inbox only |
| `.skilled/crates/bots-tui/src/state.rs` | Modify | The `on_list_action`, `reconcile_selection` and `clamp_scroll` bodies |
| `.skilled/crates/bots-tui/tests/panes.rs` | Create | One buffer snapshot per pane per state at both sizes, the reorder test, the sanitizer test and the 2,000-row count test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files. REQ-003 keeps its parent id and its parent wording, so a citation from another phase still resolves. REQ-010 is not restated here: the parent carries it on 003 and 005, and this child adds only the `list` rows REQ-026 names.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-003 | The binary reads only through `bots ... --json` and writes only through `bots answer --scope once\|deny --repo <repo> -- <item-id> <text>`. `cli.rs` takes the program and its arguments from its caller, defaulting to `node` plus `<skilled-tree>/.skilled/bin/bots.cjs`, so every read is one `<program> <verb> --json --repo <repo>` call and the tests point it at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")`, which resolves from the crate directory cargo runs tests in. The binary opens no file under the state root. |
| REQ-016 | The activity pane draws the groups `bots activity --json` returns in the order the payload carries them, each with its title, and each row with its marker, its label and its bot id. A group with no rows is not drawn. The seven group ids draw the markers `theme.rs` holds - `·` working, `✓` done, `✗` failed, `!` needs_you, `–` stopped, `○` scheduled and `↻` recurring - and an eighth, `?`, covers a value the table does not name, drawn with the raw value beside it. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:28-39] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/activity.rs:6-34] |
| REQ-017 | The inbox pane lists every open and expired item `bots inbox --json` returns, open first, each with its bot id and its question. An open item draws `!` in the gutter and the word `open`. An expired item draws no glyph, the word `expired`, dimmed and carries no answer key, because it cannot be answered. An item whose `state` is neither `open` nor `expired` draws like an expired one: dimmed, its raw state word in the state column and no answer key, so a state the pane does not name can never be answered. An empty inbox draws one line saying nothing waits. A row whose id has a mark in `state.answered` draws a blank gutter and its outcome word in the state column, dimmed, is not counted in the title's open count and draws the same word as its `state` in the detail column, as frame 27 does. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/glyph-table.md, section "4. THE INBOX DOES NOT USE THESE GLYPHS"] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/needs-you/board.tsx:161] |
| REQ-018 | The routines pane draws the rows in the `routines` array `bots routines --json` returns: the bot id, the four-part routine sentence and the routine's state. An empty list draws one line saying what a routine is, never a blank body. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/routines/routines-list.tsx:226-232] |
| REQ-019 | The chat tab draws one line naming phase 010 and `bots chat`, and holds no state, so Alt+1..4 does not renumber when that phase lands. |
| REQ-020 | Each of the three data panes draws the four states the parent names - loading, empty, error and stale - plus the rows state that carries the payload, so five drawn states in all. Loading draws a named line, never a blank body. Empty draws a line saying what the surface would hold. Error keeps the rows of the last successful read and draws the first stderr line in the body when there are none. The stale state draws the label `stale_label` returns, which 003's `view/header.rs` owns and the header draws too, so the age format has one owner and one test. |
| REQ-021 | Every drawn runtime string passes through the sanitizer `theme.rs` owns, which replaces each control character with `?` and keeps ordinary Unicode, so a control character in a bot id or a question cannot move the cursor. `clip` in `view/panes.rs` truncates by display width so a long question cannot push the footer off screen. A cut string ends with `…` inside the width, or with `...` under the `--ascii` flag, so a clipped question never draws as if it were complete. The cut never splits a double-width cell. `clip` is written fresh. The crate holds one sanitizer, so a pane keeps no second copy. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/ui/colors.py:52-59] |
| REQ-022 | Selection is the pane's row key: `ItemId` for the inbox, `BotId` for routines, `ActivityKey` for activity, never a row index, so a poll that reorders rows keeps the selection on the same item. When the selected item leaves the payload the selection falls to the nearest surviving row rather than pointing at whatever row took its place, and an empty list leaves no selection. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/key-map.md:106] |
| REQ-023 | The panes draw every row's state through the `marker(state, glyphs)` function `theme.rs` owns, so the eight glyphs and their ASCII column have one owner and one test. Meaning is always in the glyph and the label, never in colour alone. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-024 | At 120 columns or wider the selected row's detail draws as a right column beside the list, and it draws a grant's kind and rung only when the item carries them, drawing nothing where they are absent. Below 120 columns the body is one column and the detail lives in the overlay 005 draws. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/decision-record.md:47] |
| REQ-025 | The pane draw returns the number of rows it visited, and 2,000 activity rows at 120x40 visit at most the body height, so the cost of a large payload is the clip and not the cell count. The 16 ms wall-clock check is an ignored test the operator runs locally, so a loaded runner cannot fail the gate. |
| REQ-026 | The pane footer line names the list keys the active pane binds, generated from the `list` rows in `keys.rs`: Up, Down, PgUp and PgDn on all three data panes, and Enter on the inbox only. Activity and Routines draw `Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page` on line 1, the inbox adds `· Enter open`, and Chat draws `Alt+1..4 tabs · [ ] cycle`. Every pane draws `Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit` on line 2, and the answer keys appear only in the overlay footers. |
| REQ-027 | When `bots inbox --json` reports at least one open item, the banner row above the body reads `! <n> pending approval · <inbox tab key> → inbox` when n is 1 and `! <n> pending approvals · <inbox tab key> → inbox` otherwise, where the key label is the key `keys.rs` binds to the inbox tab, drawn as `Alt+2`. With no open item the row is blank, and the row stays blank until the first inbox read succeeds. The row is this child's because the frames that hold an open item draw it, so the snapshot gate does not wait on 005. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test panes` prints `test result: ok` and names one snapshot per pane per state at 80x24 and at 120x40, sixteen per size, each comparing every cell to the frame `design/mockups.md` draws.
- **SC-002**: `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test panes -- budget` prints `test result: ok` and names `two_thousand_rows_visit_at_most_the_body_height`, and `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test panes -- budget --ignored` names `two_thousand_rows_draw_under_16ms`.
- **SC-003**: `rg -n 'openhuman' .skilled/crates/bots-tui/src` prints only comment lines, and `rg -n 'insta' .skilled/crates/bots-tui/Cargo.toml` prints nothing.
- **SC-004**: `cargo clippy --manifest-path .skilled/crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0 and `cargo fmt --manifest-path .skilled/crates/bots-tui/Cargo.toml --check` exits 0.
- **SC-005**: `rg -n 'Command::new' .skilled/crates/bots-tui/src` prints only `cli.rs`, so no pane spawns a process of its own.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 002's `state.rs` holding `Remote<T>` and one `PaneView<K>` per pane | The panes have no state to draw, and a selection by index reintroduces the reorder defect | The reorder test in `tests/panes.rs` is the gate: it drives two polls with the rows reversed and fails if the selection moves, so a state that selects by index cannot pass |
| Dependency | 002's fixture carrying the four payloads | No pane is testable before phases 001 and 002 land their verbs | Every pane test reads the fixture, so the payload shape is proven in one place and a phase that changes a payload updates the fixture in the same change |
| Dependency | 003's `src/view/mod.rs` view root | The `mod panes;` line has nowhere to land | The task names the file 003 creates and the build is the check, so a missing view root fails at `cargo build` rather than at review |
| Risk | A wall-clock budget fails for the machine rather than the code | A flaky gate on a loaded runner | The gate is a count of the rows the draw visited, and the 16 ms timing is an ignored test the operator runs locally |
| Risk | A control character reaches a cell through a path that skips the sanitizer | A corrupted frame, and a bot id that can move the cursor | One test asserts the buffer holds `?[2J` and no control byte for a bot id carrying `\u{1b}[2J`, and `test ! -e .skilled/crates/bots-tui/src/sanitize.rs` proves the crate holds one sanitizer rather than two |
| Risk | A pane maps a state to a glyph of its own | Two tables drift, and the ASCII column stops reaching the buffer | The pane calls `theme::marker` and a test asserts the ASCII column reaches the buffer, so a second table fails by name |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: 2,000 activity rows at 120x40 visit at most the body height's rows, so the draw's cost is the clip and not the payload's length.
- **NFR-P02**: A pane draws only the rows that fit its body, so the cost of a 2,000-row payload is the clip, not the cell count.

### Security
- **NFR-S01**: No pane spawns a process, opens a file or reads an environment variable. `rg -n 'Command::new' .skilled/crates/bots-tui/src` matches only `cli.rs`.
- **NFR-S02**: Every runtime string passes through the sanitizer `theme.rs` owns before it reaches a cell, so a payload cannot write a terminal escape.

### Reliability
- **NFR-R01**: An error keeps the rows of the last successful read, so one failed poll never empties the screen.
- **NFR-R02**: A selection whose item leaves the payload falls to the nearest surviving row, so no key acts on a row the operator did not choose.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `bots activity --json` returns `{"version":1,"groups":[]}`, `bots inbox --json` returns `{"version":1,"items":[]}` and `bots routines --json` returns `{"version":1,"routines":[]}`. Each pane draws its empty line and exits the draw without a panic.
- Maximum input: 2,000 activity rows at 120x40 visit at most the body height's rows, and a question longer than the body width is clipped by display width rather than wrapped past the footer, ending with `…`, or `...` under `--ascii`.
- Failure path: a read that exits non-zero with stderr keeps the previous rows, draws the first stderr line in the body when there are none, and sets the stale label. A payload that does not parse draws the error state rather than a panic.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two files created and two modified, roughly 500 lines of Rust across the panes, the `list` key rows and the tests |
| Risk | 8/25 | No auth, no network and no persistence, with one row-count assertion and one cross-child seam into 002's state |
| Research | 6/20 | The payload shapes are fixed by phases 001 and 002, and the layout follows four design sources already read |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Who owns the glyph table? Decision: 003's `theme.rs`, which carries the Unicode and ASCII columns and the `--ascii` flag. This child calls `marker(state, glyphs)` and keeps no second table, so the eight glyphs have one owner and one test.
- Who owns the sanitizer? Decision: 003's `theme.rs`, one behaviour that replaces each control character with `?`. This child routes every drawn string through it and keeps no second copy, so the status row and the panes cannot disagree about what a control character draws as.
- Which file is the view root? Decision: `.skilled/crates/bots-tui/src/view/mod.rs`, which 003 creates and this child adds one `mod panes;` line to.
- Who draws the stale text? Decision: 003's `view/header.rs` owns `stale_label` and the header draws it. This child's stale state calls it, so the age format has one owner and one test.
- Is the 16 ms budget a hard gate? Decision: no. The gate is the count of rows the draw visited, and the 16 ms timing is an ignored test the operator runs locally, so a loaded runner cannot fail it.
- Does the inbox pane need a second snapshot for an expired row? Decision: no. The inbox's one rows frame carries an open and an expired item, and a separate assertion proves the expired row carries no answer key.
- How many snapshots does the table hold? Decision: one per pane per state, sixteen per size and thirty-two in all, because the inventory gives each data pane five states and a frame for each.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`, whose Phase Documentation Map names this child's scope and exit
- **Parent Goal**: `../goal.md`, whose binding row for `004-panes` makes this packet's `goal.md` authoritative for it
- **Parent Decisions**: `../decision-record.md`, whose Q005 carries the glyph set and Q006 refuses `insta`
- **Sibling children**: `001-ux-and-component-map/` for the mockups and the key map, `002-architecture-and-contracts/` for the crate and the fixture, `003-shell-and-navigation/` for the frame, the glyph table and the sanitizer, `005-answer-flow/` for the overlay, `006-hardening-and-proof/` for the gates
- **Design sources**: `../context/`, gitignored, holding the openhuman-tui, OpenBot, OpenMausBot, rakazo and turnstone files this child reads for shape and copies no code from. Rebuilt from section 2 of `research/context-manifest.md`
- **Pre-expansion documents**: `../context/legacy-003/`, gitignored, holding the phase 003 tasks and criteria this child inherits
