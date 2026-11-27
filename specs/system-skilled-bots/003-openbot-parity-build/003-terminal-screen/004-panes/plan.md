---
title: "Implementation Plan: Phase 4: panes"
description: "Fill the shell's body with four pane bodies drawn from one `Remote<T>` per surface, behind the sanitizer and glyph table 003's `theme.rs` owns, a selection held by item id, proven by buffer snapshots at both sizes and a 2,000-row frame budget."
trigger_phrases:
  - "pane states plan"
  - "activity pane plan"
  - "frame budget plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: panes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Rust 2021, one library target and one binary in `crates/bots-tui/` |
| **Framework** | ratatui 0.30 with crossterm 0.29, `unicode-width` for the clip |
| **Storage** | None. The panes read the `Remote<T>` 002's state holds and open no file |
| **Testing** | `cargo test`, asserting the ratatui `TestBackend` buffer directly, with no `insta` |

### Overview
Two new files, two edited files and one line fill the body 003 leaves empty. `view/panes.rs` draws the four pane bodies from the `Remote<T>` each surface holds, clips by display width, routes every drawn string through the sanitizer `theme.rs` owns, and draws the selected row's detail as a right column at 120 columns or wider. `keys.rs` gains the `list` rows and `state.rs` the arms that move each pane's `PaneView`, so the footer 003 draws names the keys each pane binds. `tests/panes.rs` proves it with one buffer snapshot per pane per state at 80x24 and 120x40, a reorder test, a sanitizer test and a 2,000-row draw that visits only the rows its body holds.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `cargo build --manifest-path crates/bots-tui/Cargo.toml` exits 0, so 002's crate and 003's shell exist
- [ ] `bash crates/bots-tui/tests/fixtures/bots activity --json | jq -e '.groups'` exits 0, so the fixture carries the payload the activity pane reads
- [ ] `rg -n 'Remote' crates/bots-tui/src/state.rs` prints the wrapper the panes draw from

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes` prints `test result: ok` and names one snapshot per pane per state at both sizes
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes -- budget` prints `test result: ok` and names `two_thousand_rows_visit_at_most_the_body_height`
- [ ] `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0 and `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure renderer over a remote-state wrapper. Every pane is a function from `&Remote<T>` and a selection to cells, so a test draws it without a terminal, a thread or a process.

### Key Components
- **`view/panes.rs`**: the four pane bodies, the five state lines, the display-width clip and the wide-layout detail column. It exists because the shell 003 lands draws an empty body. Every drawn string passes through the sanitizer `theme.rs` owns and every row's state through the marker function `theme.rs` owns, so the crate keeps one sanitizer and one glyph table.
- **`tests/panes.rs`**: the snapshot table, the reorder test, the sanitizer test and the row-count test. It exists because the operator refused `insta`, so the assertion compares the buffer to the frame `design/mockups.md` draws, cell for cell, rather than a stored file.

### Data Flow
`data.rs` (002) fetches one `bots <verb> --json` per surface on the worker thread and sends a generation-tagged message. `state.rs` (002) folds it into `Remote<T>{rows, last_ok_at, error, in_flight, generation}` and keeps one `PaneView<K>` per pane. `view/panes.rs` reads the `Remote<T>` for the active tab, maps each row's `state` through the marker function `theme.rs` owns, passes every string through the sanitizer `theme.rs` owns, and writes cells into the body rect 003 hands it. Nothing in the path spawns a process, opens a file or reads an environment variable.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child fixes the selection defect the parent records and consumes the sanitizer and glyph table 003 owns, so the surface inventory is part of the plan rather than an afterthought.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `crates/bots-tui/src/state.rs` | 002 owns it and holds `Remote<T>` and one `PaneView<K>` per pane | update: `on_list_action`, `reconcile_selection` and `clamp_scroll`, which move each pane's `PaneView` and fall to the nearest surviving row, with the reorder test as the gate | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes -- reorder` prints `test result: ok` |
| `crates/bots-tui/src/keys.rs` | 003 owns the table and fills `SHELL_ROWS` | update: the `list` rows, Up, Down, PgUp and PgDn on every data pane and Enter on the inbox only | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib keys` prints `test result: ok` and names `list_keys_move_the_selection` |
| `crates/bots-tui/src/view/mod.rs` | 003 owns the view root and declares the modules | update: one `mod panes;` line and one `mod banner;` line, and the banner slot call | `cargo build --manifest-path crates/bots-tui/Cargo.toml` exits 0 |
| `crates/bots-tui/src/view/banner.rs` | absent, and 005's file table used to hold it | create: the pending-approval row, from the open item count and the inbox tab key label `keys.rs` carries, so the frames that hold an open item draw without waiting on 005 | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib banner` prints `test result: ok` and names `banner_counts_open_items` and `banner_is_blank_with_none` |
| `crates/bots-tui/src/theme.rs` | 003 owns the palette, the glyph table and the sanitizer | consumer: this child calls the marker function and the sanitizer, and keeps no second copy | `rg -n 'theme::marker' crates/bots-tui/src/view/panes.rs` prints the marker call, and `test ! -e crates/bots-tui/src/sanitize.rs` exits 0 |
| `crates/bots-tui/src/view/header.rs` | 003 owns the header and `stale_label` | consumer: this child's stale state calls `stale_label` | `rg -n 'stale_label' crates/bots-tui/src/view/panes.rs` prints one call |
| `crates/bots-tui/tests/fixtures/bots` | 002 owns the only payload source in tests | not a consumer: the panes read the payloads it already carries | `bash crates/bots-tui/tests/fixtures/bots routines --json \| jq -e 'has("version") and has("routines")'` exits 0 |
| `crates/bots-tui/src/view/overlay.rs` | 005 owns the detail panel below 120 columns | not a consumer | `rg -n 'panes' crates/bots-tui/src/view/overlay.rs` prints nothing |

Required inventories:
- Same-class producers: `rg -n 'clip\(' crates/bots-tui/src` names the one clip helper, and `test ! -e crates/bots-tui/src/sanitize.rs` proves the crate holds one sanitizer rather than a second copy in this child.
- Consumers of changed symbols: `rg -n 'stale_label|marker\(|keys::rows\(\)' crates/bots-tui/src crates/bots-tui/tests` names every reader of the two symbols this child consumes and every reader of the table it adds rows to.
- Matrix axes: four panes by their five states by two sizes. Activity, inbox and routines each draw loading, empty, rows, stale and error, and the chat placeholder draws one state. That is sixteen snapshots per size and thirty-two in all, one per state the inventory lists.
- Algorithm invariant: for the sanitizer, no byte below `0x20` except `\n`, no `0x7f`, no code point in `U+0080..U+009F` and no lone surrogate reaches a cell, and the visible width of a clipped string never exceeds the rect it is drawn into.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes, the task state and the wave table.

Setup reads the fixture's four payloads and the design sources, and confirms 002's crate and 003's shell build. Implementation writes the display-width clip and the marker seam in `view/panes.rs`, then the four pane bodies, then the `list` rows in `keys.rs` and the movement arms in `state.rs`, then the wiring line in `view/mod.rs`, then the snapshot table and the three focused tests in `tests/panes.rs`. Verification runs the formatter, the linter, the crate suite, the GPL grep and the packet validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The display-width clip, the marker seam in the ASCII set, and the `list` key rows with the movement arms | `cargo test --lib` |
| Integration | One buffer snapshot per pane per state at 80x24 and 120x40, the reorder test, the sanitizer test at the pane boundary, the 2,000-row count | `cargo test --test panes`, asserting the `TestBackend` buffer directly |
| Manual | None. Every check runs without a tty, which is why the operator refused `insta` and why the snapshots assert the buffer | - |

The snapshot table is data, not sixteen hand-written tests: one row per pane and state names the frame heading and the fixture payload, and one loop loads each frame through 002's `tests/common/frames.rs` and compares every cell at both sizes. A new state is one row, and a state that stops drawing fails by name.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 002's `state.rs` with `Remote<T>` and one `PaneView<K>` per pane | Internal | Yellow | The panes have no state to draw. The reorder test fails and names the selection |
| 002's `tests/common/frames.rs` frame loader | Internal | Yellow | Every snapshot has no approved frame to compare against |
| 002's fixture carrying the four payloads | Internal | Yellow | No pane is testable, because every snapshot reads it |
| 003's `src/view/mod.rs` view root | Internal | Yellow | The `mod panes;` line has nowhere to land and `cargo build` fails |
| `ratatui` 0.30 `TestBackend` and `unicode-width` | External | Green | Both are already in 002's manifest, so this child adds no dependency |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a pane draws a control character into a cell, or the 2,000-row draw visits more rows than the body holds.
- **Procedure**: revert the one commit that adds `view/panes.rs` and its `mod panes;` line. The shell 003 lands draws an empty body again, which is the state before this child, and no other child depends on a pane body until 005 draws the overlay over it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 002's crate and fixture, 003's shell | Implementation |
| Implementation | Setup | Verification, and 005's overlay which draws over the body |
| Verification | Implementation | 006's hardening gates |
<!-- /ANCHOR:phase-deps -->

---

## External orchestration

The build runs as seven waves, one per section of the wave table in `tasks.md`. This section owns the roster, the effort levers, the parallelism rule, the fallback ladder and what every dispatch carries. `tasks.md` owns which task sits in which wave.

### The roster

Five executors are available to this packet. Each row names the model, the lever that sets effort, and the tier this packet asks for.

| Executor | Model | Effort lever | This packet asks for |
|----------|-------|--------------|----------------------|
| `cli-mistral-vibe` | `deepseek-flash` | none. The roster row's `thinking` field | the row's `max`, on every lane as the primary |
| `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking <tier>` | the lane's fallback tier: `high` for mechanical work, `max` for design work |
| `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#<tier>` on the model id | `#max` only |
| `cli-devin` | `deepseek-v4-1-flash-max` | the model id | `max`, and only after a probe |
| `cli-codex` | `gpt-6-luna` | `-c model_reasoning_effort="<tier>"` | `xhigh` with `-c service_tier="fast"` |

Three of those levers are narrower than the table suggests, and each is a fact from its own packet rather than a preference. `cli-mistral-vibe` has no reasoning flag at all: effort is the roster row's `thinking` field and `max` is a property of the row, so a Vibe dispatch cannot be lowered to `high`. [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89] `cli-opencode`'s `opencode-go/deepseek-v4.1-flash` route is pinned to the max thinking tier by policy, so a `#high` request is upgraded rather than honored. [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:146] `cli-devin` carries the tier in the model id and has no headless effort flag. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156]

The other two need one fact each. `cli-pi`'s ladder on this route is `low`, `high` and `max`, with `medium` and `xhigh` folding into `high`, so `--thinking high` is the only way this packet asks for the middle tier. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101] `cli-codex` keeps `gpt-6-luna` and the `fast` service tier unless a task names otherwise, and `xhigh` is the tier this packet asks for when a wave reaches the last rung. [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125]

### The parallelism rule

A lane is the unit of parallelism, and two lanes never hold the same file. The worker count is therefore the number of lanes whose file sets are disjoint, not the number of tasks in the wave.

`crates/bots-tui/src/view/panes.rs` is the binding file. Eight tasks edit it, so they form one serial lane by construction, and the parallelism in this packet comes from the lanes beside it: `view/mod.rs`, `keys.rs`, `state.rs` and `tests/panes.rs`. `tests/panes.rs` binds four tasks the same way. The packet is therefore two lanes wide at its widest and one lane wide for most of its length, and the wave table says so rather than inventing workers that would collide.

### The fallback order when a CLI runs out of usage

A wave whose named executor runs out of usage moves down this ladder from the next rung. A wave already on the last rung stops and reports rather than dropping its tier.

| Rung | Executor | Why it sits here |
|------|----------|------------------|
| 1 | `cli-mistral-vibe` · `deepseek-flash` | The primary for every lane since 2026-11-27, on the Vibe budget, which a `402 API budget exhausted` ends. A `429` moves the lane down too |
| 2 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` | DevPass bills per token, and this route sits under the gateway's Premium threshold, so it carries no weekly cap |
| 3 | `cli-opencode` · `opencode-go/deepseek-v4.1-flash` | The Go gateway's subsidized usage rate, and it needs its own login before it answers |
| 4 | `cli-devin` · `deepseek-v4-1-flash-max` | A weekly quota, so it is probed with a trivial read-only call before a real task is handed to it |
| 5 | `cli-codex` · `gpt-6-luna` · `xhigh` · `fast` | The most expensive reasoning on the roster, kept for last |

Rungs 1 and 3 cannot be lowered, so every lane starts at `max` on rung 1, returns to its fallback tier on rung 2 and runs at `max` again if it falls to rung 3. Past rung 2 the tier only rises. It never drops below the lane's fallback tier. That is the one asymmetry a reader should expect, and it is why the ladder is ordered by cost rather than by tier.

### What every dispatch carries

The hub's own rules bind each dispatch, not only the wave table. The orchestrator reads the target mode's `SKILL.md` before composing the prompt, attaches the resolved agent persona, and sets `AI_SESSION_CHILD=1` with the shared child preamble. [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:199] Every non-interactive dispatch redirects stdin, because a run that leaves it open hangs with no output rather than failing. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:130] A `cli-pi` dispatch also passes `--offline`, and a `cli-devin` dispatch puts `--` before the prompt. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:84] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:243] A Vibe worker starts from its own scratch folder inside the worktree, passes `--add-dir` for the worktree and keeps `VIBE_HOME` outside it, as the parent's Vibe dispatch says. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "BUILD ORCHESTRATION", Vibe dispatch] A `cli-devin` dispatch is probed first, because a quota banner alone does not prove the route is spent. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237]

A clean-room rule binds every lane that writes `view/panes.rs`. Its brief carries our design files and the MIT or Apache references only, and an openhuman or tinychannels path appears in a design document as provenance, never in a worker brief. The orchestrator compares the finished panes with the openhuman activity and render files by eye and records that it did, because `rg -n 'openhuman' crates/bots-tui/src` passes on a copy that carries neither the path nor the licence header.

A worker's `done` is a claim until the orchestrator runs that wave's verify commands and reads their output and exit status. A wave that fails its verify does not hand its files to the next wave.
