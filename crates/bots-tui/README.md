---
title: "bots-ui: the terminal screen for skilled bots"
description: "Build, run and drive the bots-ui binary that draws the bots CLI's JSON reads and answers a needs-you item."
trigger_phrases:
  - "bots-ui terminal screen"
  - "bots ui build and run"
  - "terminal screen keys and glyphs"
version: 1.0.0.0
---

# bots-ui: the terminal screen for skilled bots

---

## 1. OVERVIEW

`crates/bots-tui/` builds `bots-ui`, a Rust binary that draws the bots CLI's JSON reads and answers a needs-you item. It reads `status`, `activity`, `inbox` and `routines`, each called as `<verb> --json --repo <checkout>`, and it answers an item with `answer`.

Current state:

- The binary opens no state file and reads no environment variable of its own, so every flag comes from argv.
- The `ui` verb finds the built binary, checks that it reads the same payload contract and passes `--repo`, `--skilled-tree` and the display flags.
- Licence MIT.

---

## 2. BUILD

Run from the repository root:

```bash
cargo build --release --manifest-path crates/bots-tui/Cargo.toml
```

The binary lands at `crates/bots-tui/target/release/bots-ui`.

---

## 3. RUN

The usual way is the bots verb, from inside a checkout:

```bash
node .skilled/bin/bots.cjs ui
```

The verb refuses with `ui-unavailable` when the crate folder is missing and `ui-not-built` when the binary is missing. It passes `--mono` when `NO_COLOR` is set, and `--ascii` when you run `node .skilled/bin/bots.cjs ui --ascii`.

The binary also runs directly:

```bash
crates/bots-tui/target/release/bots-ui --repo <checkout> --skilled-tree <skilled tree> [--mono] [--ascii]
```

`bots-ui --version` prints `bots-ui <version> contract <n>`.

---

## 4. FLAGS

| Flag | What it does |
|---|---|
| `--mono` | Draws with the Mono palette and no colour. |
| `--ascii` | Draws every glyph from the ASCII set. |

---

## 5. KEYS

| Where | Key | Action |
|---|---|---|
| Main screen and inbox | `Alt+1` to `Alt+4` | Pick the Activity, Inbox, Routines or Chat tab |
| Main screen and inbox | `[` and `]` | Cycle tabs, the fallback where Alt does not reach the terminal, such as macOS Terminal |
| Main screen and inbox | `Ctrl+P` or `?` | Open the command palette |
| Main screen and inbox | `Ctrl+C` | Exit |
| Main screen and inbox | `Ctrl+D` | Exit |
| A list | `Up` and `Down` | Select the row above or below |
| A list | `PgUp` and `PgDn` | Page up or down |
| A list | `Enter` | Open the selected item, on the inbox tab |
| Command palette | `Up` and `Down` | Select the entry above or below |
| Command palette | Any printable character | Filter the list |
| Command palette | `Backspace` | Delete the last filter character |
| Command palette | `Enter` | Run the selected entry |
| Command palette | `Esc` | Close the palette |
| Command palette | `Ctrl+C` | Close the palette |
| Command palette | `Ctrl+D` | Exit |
| Answer overlay | `y` | Approve once |
| Answer overlay | `n` | Deny |
| Answer overlay | `1` to `9` | Pick a numbered option |
| Answer overlay | `t` | Start a typed answer |
| Answer overlay | Any printable character, while typing | Add it to the typed answer |
| Answer overlay | `Enter`, while typing | Send the typed answer |
| Answer overlay | `Backspace`, while typing | Delete the last character |
| Answer overlay | `Esc` | Close the overlay |
| Answer overlay | `Ctrl+C` | Close the overlay |
| Answer overlay | `Ctrl+D` | Exit |
| Too-small screen | `Ctrl+D` | Exit |

---

## 6. GLYPHS

| State | Glyph | Fallback |
|---|---|---|
| `working` | `·` | `*` |
| `done` | `✓` | `+` |
| `failed` | `✗` | `x` |
| `needs_you` | `!` | `!` |
| `stopped` | `–` | `-` |
| `scheduled` | `○` | `o` |
| `recurring` | `↻` | `r` |
| `unknown` | `?` | `?` |

---

## 7. EXIT CODES

| Code | When |
|---|---|
| `0` | `Ctrl+C` with no overlay open, `Ctrl+D` or a closed input |
| `1` | A lost thread or a terminal error |
| `101` | A panic |
| `128` plus N | Signal N: `129` SIGHUP, `130` SIGINT, `143` SIGTERM |

The `ui` verb passes the code through.

---

## 8. KEY FILES

| File | Responsibility |
|---|---|
| `src/lib.rs` | The argument parser, the version line and the run entry |
| `src/main.rs` | Passes argv in and the exit code out |
| `src/app.rs` | The loop that draws a frame and reads the next message |
| `src/state.rs` | The screen state and the key dispatch |
| `src/keys.rs` | The key table, its six contexts and the label each row draws |
| `src/theme.rs` | The System and Mono palettes and the glyph table |
| `src/model.rs` | The four payload shapes |
| `src/cli.rs` | Runs the bots verbs as child processes |
| `src/data.rs` | The worker thread that runs every read and the one write |
| `src/event.rs` | The terminal events and the clock |
| `src/terminal.rs` | The terminal guard and the signal handling |
| `src/view/` | The frame: banner, header, tabs, panes, footer and overlay |

---

## 9. VALIDATION

Run from the repository root:

```bash
cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check
cargo clippy --locked --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings
cargo test --locked --manifest-path crates/bots-tui/Cargo.toml
cargo test --locked --manifest-path crates/bots-tui/Cargo.toml --release --test pty_smoke
```

The last command runs the release binary in a pseudo-terminal and approves one item. Every test reads the fake CLI at `tests/fixtures/bots`.

---

## 10. DESIGN DOCUMENTS

- [`design/mockups.md`](design/mockups.md) holds one frame per screen state at 80x24 and 120x40.
- [`design/key-map.md`](design/key-map.md) holds every binding, its context, its action and the label the footer draws.
- [`design/glyph-table.md`](design/glyph-table.md) holds the eight glyphs, their fallback and the rule that colour is never the meaning.
- [`design/component-inventory.md`](design/component-inventory.md) holds every component, what it reads and every state it can be in.
- [`design/architecture.md`](design/architecture.md) holds the shared types, the thread model, the owner map and the layout grid.
- [`design/contracts.md`](design/contracts.md) holds the four JSON payloads, one sample and one field table per verb.

---

## 11. DESIGN REFERENCE AND LICENCE

openhuman's terminal client (licensed GPL-3.0) was read as a design reference for the screen's shape, the terminal guard, the minimum-size screen, the footer key line, the banner and the two palettes, and no code or text was copied from it. The crate is MIT.
