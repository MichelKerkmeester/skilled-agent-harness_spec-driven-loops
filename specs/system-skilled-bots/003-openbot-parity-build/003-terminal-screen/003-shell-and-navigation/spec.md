---
title: "Feature Specification: Phase 3: shell-and-navigation"
description: "The shell of `bots-ui`: one key table that binds and labels every key, a header, a tab bar, a footer and a status row generated from that table, a palette that is also help, the too-small screen and the Mono palette, proven by a key-label test and shell buffer snapshots at 80x24 and 120x40."
trigger_phrases:
  - "shell and navigation"
  - "phase 3 shell and navigation"
  - "bots ui shell"
  - "key label test"
  - "shell buffer snapshot"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: shell-and-navigation

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
| **Phase** | 3 of 6 |
| **Predecessor** | 002-architecture-and-contracts |
| **Successor** | 004-panes |
| **Handoff Criteria** | `cargo test --test render_keys` passes, including the key-label assertion and both shell snapshots; `cargo test --lib keys` and `cargo test --lib theme` pass; `cargo fmt --check` and `cargo clippy --all-targets -- -D warnings` exit 0 in `crates/bots-tui`. Every one of those runs without a tty |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the six Terminal screen children: the UX map, the architecture and contracts, the shell, the panes, the answer flow and the hardening proof.

**Scope Boundary**: The shell only. This phase writes the key table, the theme, the frame that composes the seven bands, the header, the tab bar, the footer with its status row, the palette and the too-small screen. It draws no pane body, no banner and no overlay, and it writes no answer.

**Dependencies**:
- Phase 002's crate, `state.rs`, `app.rs`, `cli.rs`, `model.rs` and `tests/fixtures/bots`, which this phase reads and extends but does not replace. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:250]
- `bots status --json`, which the header reads for the bot count and the stale flag. It exists today and phase 004 adds `lastRun.branch` and `lastRun.worktreePath`, which the header ignores. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:126]
- Phase 001's `design/` folder, which holds the mockups, the key map and the glyph table this phase implements. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/ui-advisory.md:25]

**Deliverables**:
- `crates/bots-tui/src/keys.rs`, `src/theme.rs`, `src/view/mod.rs`, `src/view/header.rs`, `src/view/tabs.rs` and `src/view/footer.rs`.
- `crates/bots-tui/tests/render_keys.rs`, holding the key-label assertion and the two shell snapshots.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 002 leaves an empty frame: the crate builds, the loop runs and the terminal is restored, but no key is bound and nothing on screen says which key does what. A screen whose bindings are undocumented is a screen the operator guesses at, and the pre-expansion phase 003 made that worse in two ways: it bound `1` to "pick option 1" and to "approve once", and it relied on Alt+1..4, which Terminal.app and iTerm send as `¡™£¢` unless Option is Meta. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/ui-advisory.md:14] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/ui-advisory.md:15]

### Purpose
One shell whose every binding is drawn from the same table that binds it, so a key cannot exist without a label and the tab bar is reachable on a keyboard that never delivers Alt.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls crates/bots-tui/src/keys.rs crates/bots-tui/src/theme.rs crates/bots-tui/src/view
ls: crates/bots-tui/src/keys.rs: No such file or directory
ls: crates/bots-tui/src/theme.rs: No such file or directory
ls: crates/bots-tui/src/view: No such file or directory
EXIT=1

$ rg -c 'Alt\+1|Ctrl\+P|Ctrl\+D' crates/bots-tui/src
rg: crates/bots-tui/src: IO error for operation on crates/bots-tui/src: No such file or directory (os error 2)
EXIT=2

$ rg -n 'area.width < 24' specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs
26:    if area.width < 24 || area.height < 8 {
EXIT=0
```

The first two blocks are the measured gap: the crate does not exist yet, so no key is bound and no label is drawn. The third is the one number this phase takes from the design reference, the 24-column and 8-row floor below which openhuman draws its resize line instead of a frame. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:26]
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `crates/bots-tui/src/keys.rs`: one table of context, key, action and label rows, with the Global, Tabs and Palette contexts filled, so the footer and the palette read the same rows that bind the keys.
- Add `crates/bots-tui/src/theme.rs`: the System and Mono palettes with `NO_COLOR` selecting Mono, the glyph table with its Unicode and ASCII columns, and `safe_text`.
- Add the shell frame at `crates/bots-tui/src/view/mod.rs`: header, tabs, rule, body slot, banner slot, status row and footer, the too-small screen, and the palette panel.
- Add `view/header.rs`, `view/tabs.rs` and `view/footer.rs`: the bot count and stale flag, the four tabs with the active mark, and the status row plus the key line generated from `keys.rs`.
- Add `crates/bots-tui/tests/render_keys.rs`: the key-label assertion over the table and the shell buffer snapshots at 80x24 and 120x40.

### Out of Scope
- The pane bodies - 004 draws them into the body slot this phase reserves, and it draws the status markers from the glyph table this phase defines.
- The banner, the decision and choice overlays, free-text entry and the in-flight lock - 005 owns them. This phase reserves the banner row and gives an open overlay first refusal on Ctrl+C.
- A theme picker, mouse support, a demo binary and a bench flag - the advisory skips each as a separate phase. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/ui-advisory.md:32]
- `insta` - the snapshots compare the `TestBackend` buffer to a block held in the test file, so no snapshot file hides the cells the operator sees.
- Any change to `bots status --json` - the header reads the payload as it stands.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `crates/bots-tui/src/keys.rs` | Create | `Context`, `Key`, `Action` and `Label`, and the table rows for Global, Tabs and Palette, each carrying the label the renderer draws |
| `crates/bots-tui/src/theme.rs` | Create | System and Mono palettes, `NO_COLOR` selecting Mono, the glyph table with its ASCII column, and `safe_text` |
| `crates/bots-tui/src/view/mod.rs` | Create | The shell frame: the seven bands, the too-small screen and the palette panel. It is the module root the view's children need and the file 004 and 005 add their `mod` lines to |
| `crates/bots-tui/src/view/header.rs` | Create | The bot count, the stale flag with its age, and the error state |
| `crates/bots-tui/src/view/tabs.rs` | Create | The four tabs, the active mark, and the chat tab's one line naming phase 010 |
| `crates/bots-tui/src/view/footer.rs` | Create | The status row and the key line generated from `keys.rs` |
| `crates/bots-tui/src/lib.rs` | Modify | `pub mod` lines for `keys`, `theme` and `view`, and the `--ascii` flag in the argument parsing |
| `crates/bots-tui/tests/render_keys.rs` | Create | The key-label assertion over the table, and the shell buffer snapshots at 80x24 and 120x40 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files. REQ-004 and REQ-010 are inherited from the phase parent and keep their wording, so a citation from another phase still resolves. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:176]

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-004 | The tab bar holds four tabs: Alt+1 activity, Alt+2 inbox, Alt+3 routines, Alt+4 chat, with `[` and `]` as the fallback pair. Ctrl+P opens the command palette and Ctrl+D exits. The chat tab draws one line naming phase 010 and holds no state. |
| REQ-010 | Every bound key is drawn on screen in the frame that binds it: the footer names `Alt+1..4`, `[` `]`, `Ctrl+P` and `Ctrl+D`; the inbox footer names `1-9`, `y`, `n` and `Esc`; the overlay names `1`, `n` and `Esc`. |
| REQ-012 | `keys.rs` holds one table of context, key, action and label rows, and both the footer and the palette read that table rather than a second list, so a key cannot be bound without a label. The contexts are `Global`, `Tabs`, `List`, `Palette` and `Overlay`; this phase fills `Global`, `Tabs` and `Palette`, 004 fills `List` and 005 fills `Overlay`. |
| REQ-013 | The header draws the bot count from `bots status --json`, which is the rows whose `kind` is `bot`, and the stale flag with its age read from `builtAt`. It draws three states: `ok`, `stale` and `error`, and the error state keeps the last good count rather than blanking the row. |
| REQ-014 | The status row draws the first stderr line of the last failed CLI call and is blank when no call has failed. A later success clears it. |
| REQ-015 | Ctrl+P and `?` open the palette, which lists every binding in the table with its label, filters as the operator types, runs the selected action on Enter and closes on Esc. Single-key shortcuts pause while the filter holds text, so typing a word never fires a binding. |
| REQ-016 | Below 24 columns or 8 rows the frame draws `Resize terminal · Ctrl+D exits` and nothing else, at every size down to 1x1, and never panics. |
| REQ-017 | Ctrl+C quits when no overlay is open and produces no `Answer` effect, so it never writes. 005 gives an open overlay first refusal on the key, which leaves this table row unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-018 | The shell draws the same seven bands at 80x24 and 120x40: header, tabs, rule, body, banner row, status row and footer, and the body takes the rows the other six leave. |
| REQ-019 | `theme.rs` holds the System and Mono palettes, `NO_COLOR` selects Mono, and the System and Mono frames draw the same symbols, so no meaning is carried by colour alone. |
| REQ-020 | `theme.rs` holds the glyph table with a Unicode and an ASCII column: `·` working, `✓` done, `✗` failed, `!` needs_you, `–` stopped, `○` scheduled, `↻` recurring and `?` unknown, with `* + x ! - o r ?` as the ASCII column. `--ascii` selects the ASCII column, and every Unicode marker has an ASCII counterpart. |
| REQ-021 | The status row draws the first stderr line with every control character replaced by `?`, through `theme::safe_text`, so a runtime message cannot move the cursor or corrupt the frame. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### Design references

Each layout and key requirement follows one openhuman-tui file for its shape and copies none of its code. The reference is GPL-3.0-only, so the design is read and the code is not. [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/ui-advisory.md:42]

| Requirement | Reference | What it fixes |
|-------------|-----------|---------------|
| REQ-004 | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs:351-364] | Alt+1..4 selects a tab, and Ctrl+Tab cycles |
| REQ-004 | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs:300-306] | Ctrl+P opens the command palette |
| REQ-010 | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:99] | The footer key line names every binding in one row |
| REQ-013 | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:37-42] | The header names the product and the active surface |
| REQ-016 | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:26-35] | The minimum-size screen and its one line |
| REQ-019 | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:61-82] | System and Mono palettes |
| REQ-019 | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:62] | `NO_COLOR` starts in Monochrome |
| REQ-020 | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/activity.rs:15-33] | Six statuses, their labels and their markers |
| REQ-021 | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:87-93] | Control characters are stripped from drawn text |

Two keys deviate from the reference on purpose. openhuman cycles tabs with Ctrl+Tab, and this screen cycles with `[` and `]`, because Ctrl+Tab is rarely delivered; those two rows are this phase's. openhuman denies with `Delete`, and this screen denies with `n`, because `Delete` is not drawn on every keyboard; that row is 005's to fill in the Overlay context. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app/overlays.rs:366] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/ui-advisory.md:15]
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` prints `test result: ok` and names `every_bound_label_is_drawn`, `shell_snapshot_80x24` and `shell_snapshot_120x40`.
- **SC-002**: `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib keys` prints `test result: ok` and names `alt_2_selects_inbox`, `bracket_right_cycles_forward`, `ctrl_p_opens_palette`, `ctrl_d_quits` and `ctrl_c_quits_and_emits_no_answer`.
- **SC-003**: `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib theme` prints `test result: ok` and names `no_color_selects_mono`, `mono_draws_the_same_symbols`, `ascii_glyphs_are_ascii` and `every_marker_has_an_ascii_counterpart`.
- **SC-004**: `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0 and `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0.
- **SC-005**: `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines, and `rg -n 'env::var' crates/bots-tui/src` prints only `theme.rs`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002's crate and its `state.rs` | The shell has nothing to draw from | This phase starts after 002 closes, and its first task confirms the crate builds |
| Dependency | `bots status --json` | The header loses its bot count and stale flag | The fixture carries the payload, so the header is testable without a live state root |
| Dependency | Phase 001's `design/` folder | The exact strings and the glyph table have no approved source | The advisory's UX rules fix the strings this phase asserts, and a mismatch with 001's mockups is a Logic-Sync rather than a silent choice |
| Risk | A key is bound but never drawn | The operator cannot discover it, which is the defect this phase exists to fix | The footer and the palette read the same table, and the key-label test iterates the table rather than a hand-written list |
| Risk | A snapshot test becomes a rubber stamp | A reviewer approves a diff without reading the cells | The expected block sits in the test file beside the assertion, so a change to the shell shows as a diff of drawn cells |
| Risk | The Mono palette loses meaning | A colour-blind operator or a `NO_COLOR` terminal cannot tell two states apart | The glyph and the label carry the meaning, and a test asserts the System and Mono frames draw the same symbols |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A shell frame is drawn from the state alone, with no process spawn and no file read, so a redraw costs no I/O. `rg -n 'Command::new|read_to_string|File::open' crates/bots-tui/src/view` prints nothing.
- **NFR-P02**: The palette lists every binding in one pass over the table, so its cost is the table's length and not a second scan per row.

### Security
- **NFR-S01**: The binary reads one environment variable, `NO_COLOR`, and passes none to the child it spawns. `rg -n 'env::var' crates/bots-tui/src` prints only `theme.rs`.
- **NFR-S02**: The status row draws the first stderr line with every control character replaced by `?`, so a runtime message cannot move the cursor, and no drawn string reaches the buffer unfiltered.

### Reliability
- **NFR-R01**: A failed status call never blanks the header; the last good count stays and the status row carries the error.
- **NFR-R02**: The shell draws the too-small line rather than panicking at any area from 1x1 to 23x7, and the frame arithmetic uses saturating subtraction so no band can underflow.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no bot row and no error - the header draws `bots 0` and the status row is blank.
- Maximum input: 120x40 with 500 bindings in the palette - the list scrolls and the selected row stays visible.
- Failure path: `bots status --json` exits 1 with stderr - the header keeps the last count, the status row draws the first stderr line, and the binary does not exit.
- Narrow terminal: 23x8 and 24x7 - the frame draws `Resize terminal · Ctrl+D exits` and nothing else.
- No colour: `NO_COLOR` set - the Mono palette draws the same symbols as System, so no state is lost.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Six source files and one test file in one crate, no runtime module and no new JSON contract |
| Risk | 6/25 | No auth, no persistence and no public API; the one shared contract is the key table 004 and 005 extend |
| Research | 5/20 | The design reference is read for shape only, and the advisory fixes the key map and the glyphs |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the palette's Enter run the selected action or only show it? Decision: it runs it, because the palette is the only place a binding is discoverable and a help screen that cannot act is a second key map to keep in sync.
- Does the header's age need a clock in the state? Decision: yes. `state.now` is stamped by the loop from the same clock that stamps `last_ok_at`, so the header computes the age from two fields and a test sets both.
- Where does the palette live? Decision: `view/mod.rs`, because `view/overlay.rs` belongs to 005 and the palette is the shell's own panel.
- Does the status row strip control characters before 004's `sanitize.rs` exists? Decision: yes. `theme::safe_text` is the one function, and 004's `sanitize.rs` applies it to the pane strings rather than keeping a second copy.
- Does the footer name `[` and `]` as one label or two? Decision: one label, `[ ] cycle`, because the pair is one binding and the advisory names it as a pair.
<!-- /ANCHOR:questions -->

---
