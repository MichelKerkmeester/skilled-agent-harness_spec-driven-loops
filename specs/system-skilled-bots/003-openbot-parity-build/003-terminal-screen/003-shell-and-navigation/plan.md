---
title: "Implementation Plan: Phase 3: shell-and-navigation"
description: "One key table that binds and labels every key, one theme that holds the palettes and the glyphs, and one frame that composes the seven bands, so the footer, the palette and the key-label test all read the same rows and a key cannot be bound without being drawn."
trigger_phrases:
  - "shell and navigation plan"
  - "bots ui shell plan"
  - "key table plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: shell-and-navigation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Rust, 2021 edition, one package with a library and a binary target |
| **Framework** | ratatui 0.30 with crossterm 0.29, no async runtime |
| **Storage** | None. The shell reads `state.status` and opens no file |
| **Testing** | `cargo test` for unit tests and `TestBackend` render tests. No snapshot crate |

### Overview
The shell is three pieces that read each other. `keys.rs` holds one table of context, key, action and label rows, and both the footer and the palette read it, so a binding and its label cannot drift apart. `theme.rs` holds the two palettes, the glyph table with its ASCII column and the one control-character filter. `view/mod.rs` composes the seven bands and draws the too-small screen and the palette, and the three child modules draw the header, the tabs and the footer. The proof is `tests/render_keys.rs`: it iterates the table and asserts every label appears in the frame that binds it, then compares the shell bands to an expected block at 80x24 and at 120x40, skipping the body rows 004 fills.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `cargo build --manifest-path crates/bots-tui/Cargo.toml` exits 0, so phase 002's crate is in place
- [x] `bash crates/bots-tui/tests/fixtures/bots status --json | jq -e '.rows'` exits 0, so the header has a payload to read
- [x] `rg -n 'SHELL_ROWS' crates/bots-tui/src/keys.rs` prints the empty slice 002 leaves, so this phase starts from an empty shell

### Definition of Done
- [x] All acceptance criteria met
- [x] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target and no `FAILED`
- [x] `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0 and `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0
- [x] `rg -n 'env::var' crates/bots-tui/src` matches nothing outside `#[cfg(test)]` blocks, and `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One table, one frame.

### Key Components
- **`keys.rs`**: the one table. A row is a context, a key, an action and the label the renderer draws, and the footer and the palette both read the rows rather than a second list. The contexts are the key map's six, verbatim: `main`, `inbox`, `list`, `overlay`, `palette` and `too-small`. This phase fills `main`, `inbox`, `palette` and `too-small`, 004 fills `list` and 005 fills `overlay`, so REQ-010 holds by construction rather than by review. The module split follows openhuman-tui, which keeps the key map apart from the renderer and the loop. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs:351-364] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/ui-advisory.md:36]
- **`theme.rs`**: the two palettes and the glyph table. System is the default and Mono is selected by `--mono`, which the `ui` verb passes when it reads `NO_COLOR`, so the binary reads no environment variable of its own. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:62] The glyph table carries a Unicode and an ASCII column, so the approved markers and their fallback are defined once and 004's panes read them rather than keeping a second copy. `printable` lives here because the status row draws stderr before 004's panes exist, and one function with two callers beats two copies. It replaces each control character with `?`, which is the one behaviour 004 applies to the pane strings. 004's panes call it directly, and the crate holds no `sanitize.rs`. The rule is the plan's own. The nearest source is turnstone's `show_controls` [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/ui/colors.py:76-89]. The openhuman filter `safe_text`, which drops control characters, is not the model.
- **`view/mod.rs`**: the frame. It draws the header, the tabs, the rule, the body slot, the banner slot, the status row and the footer, and it owns the too-small screen and the palette panel. The body slot is where 004's panes draw and the banner slot is where 005's banner draws, so neither phase edits the band arithmetic. It is also the module root the view's children need, and the file 004 and 005 add their `mod` lines to.
- **`view/header.rs`**: the bot count, the index age, `stale_label`, the stale flag with its age, and the error state. It reads `state.status` and draws nothing else. `stale_label` is the one age formatter, so 004's panes call it rather than keeping a second copy.
- **`view/tabs.rs`**: the four tabs and the active mark. The `[` and `]` pair is the fallback for a keyboard that never delivers Alt. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/ui-advisory.md:15] The chat tab's one line naming phase 010 is 004's, drawn into the body slot.
- **`view/footer.rs`**: the status row and the key line. The key line is generated from `keys.rs`, so the footer cannot name a key the table does not bind. It draws two lines. Activity and Routines draw `Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page` over `Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit`, the inbox adds `Enter open` to line 1, and Chat draws `Alt+1..4 tabs · [ ] cycle` over the same line 2. The list labels reach the footer from 004's `list` rows, and the answer keys appear only in the overlay footers.
- **`tests/render_keys.rs`**: the key-label assertion and the two shell snapshots. It iterates the table rather than a hand-written list, and it compares the shell bands of the `TestBackend` buffer to a block held in the test file, so no snapshot file hides the cells the operator sees. The body rows are skipped, because 004 routes a pane into them and this phase's snapshots must stay green when it does.

### Data Flow
The loop hands `view::draw` a state and a frame. `view/mod.rs` reads the area, and below 24 columns or 8 rows it draws `Too small · Ctrl+D exit` and returns. Otherwise it draws the header from the status surface, the tabs from the active tab, the rule, the body slot, the banner slot, the status row from the last error, and the footer from `keys.rs`. When the palette is open it draws the panel over the body, filtered by the text the operator typed. A key reaches the reducer as `Msg::Key`. The reducer calls `keys::resolve` with the context stack and applies the action, and the next frame draws the label the same row carries.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `crates/bots-tui/src/state.rs` | Owns the pure state and the reducer | update - `on_shell_action` only. The shell reads `active_tab`, `status`, `last_error`, `now` and `palette`, and adds no field | `rg -n 'fn on_shell_action' crates/bots-tui/src/state.rs` prints one line, and `cargo test --lib state` names `palette_opens_and_closes` |
| `crates/bots-tui/src/app.rs` | Owns the loop and the event source | unchanged - the loop calls `view::draw` and the table answers the key | `cargo test --lib app` still passes |
| `bots status --json` | Producer of the header's bot count and stale flag | not a consumer - the worker reads it and the header draws `state.status` | `node .skilled/bin/bots.cjs status --json` still exits 0 and prints a `rows` key |
| `crates/bots-tui/src/view/panes.rs` | 004's pane bodies | not a consumer - 004 draws into the body slot this phase reserves | `ls crates/bots-tui/src/view/panes.rs` exits 1 until 004 lands |
| `crates/bots-tui/src/view/overlay.rs` | 005's decision and choice overlays | not a consumer - 005 draws over the frame and takes first refusal on Ctrl+C | `ls crates/bots-tui/src/view/overlay.rs` exits 1 until 005 lands |

Required inventories:
- Same-class producers: `rg -n 'label:' crates/bots-tui/src/keys.rs` lists every row that carries a drawn label, so a new binding cannot be added without one.
- Consumers of changed symbols: `rg -n 'keys::' crates/bots-tui/src` names every module that reads the table, and it must be `view/footer.rs`, `view/mod.rs` and `state.rs` only. `rg -n 'stale_label' crates/bots-tui/src` names the definition in `view/header.rs` and 004's one call in `view/panes.rs`.
- Matrix axes: three header states (`ok`, `stale`, `error`) by two sizes (80x24, 120x40), plus the too-small case at 23x8 and 24x7, plus two palettes (System, Mono) and two glyph columns (Unicode, ASCII).
- Algorithm invariant: every drawn string passes `theme::printable`, and every band's height is computed with saturating subtraction, so no area from 1x1 upward can underflow.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes, the task state and the execution waves.

Setup confirms phase 002's crate builds, the fixture answers `status --json` with a bot count and a stale flag, and the shell's files are absent. Implementation writes the key table and the theme, then the frame and its three child modules, then the palette, then the key-label test. Verification runs `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo test`, the two environment greps and `validate.sh`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:external-orchestration -->
## External orchestration

The build runs as six waves of external CLI workers. Each wave names its tasks, one executor per lane, the effort tier, how many workers run at once and the check the orchestrator runs before the next wave starts. The wave tables live in `tasks.md` under `## Execution Waves`. This section owns the executor contract they cite. The hub routes every dispatch and each mode's own `SKILL.md` owns its argv, so this section names the route and the effort, never a command line. [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:26] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:31]

### Executors and how each one expresses effort

| Executor | Model | Effort lever | `high` | `max` |
|----------|-------|--------------|--------|-------|
| `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking <tier>` | `--thinking high` | `--thinking max` |
| `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#<tier>` on the model id | upgraded to `max` | `#max` |
| `cli-mistral-vibe` | `deepseek-flash` | none. The row's `thinking` field | not available | the row's `max` |
| `cli-devin` | `deepseek-v4-1-flash-max` | the model id | not named by this packet | the id itself |
| `cli-codex` | `gpt-6-luna` | `-c model_reasoning_effort` | `high` | `xhigh`, the tier this packet uses |

Three of those levers are narrower than the table's two columns suggest, and each one is a fact from its own packet rather than a preference. `cli-mistral-vibe` has no reasoning flag at all: effort is the roster row's `thinking` field and `max` is a property of the row, so a Vibe dispatch cannot be lowered to `high`. [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89] `cli-opencode`'s `opencode-go/deepseek-v4.1-flash` route is pinned to the max thinking tier by policy, so a `#high` request is upgraded rather than honored. [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:146] `cli-devin` carries the tier in the model id and has no headless effort flag, and this packet names only the `-max` id. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156]

The other two need one fact each. `cli-pi`'s ladder folds `medium`, `high` and `xhigh` into `high` on this route and reaches `max` only at `max`, so `--thinking high` is the only way this packet asks for the middle tier. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101] `cli-codex` keeps `gpt-6-luna` and the `fast` service tier unless a task names otherwise, and `xhigh` is the tier this packet asks for when a wave reaches the last rung. [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:165]

### The parallelism rule

A lane is the unit of parallelism, and two lanes never hold the same file. The worker count is therefore the number of lanes whose file sets are disjoint, not the number of tasks in the wave.

One file binds this phase, because two tasks each hold it. `crates/bots-tui/src/keys.rs` takes `SHELL_ROWS` from T004 and the palette's rows from T010. `crates/bots-tui/src/view/mod.rs` takes the frame, the too-small screen and the palette panel from T009. `crates/bots-tui/src/state.rs` takes `on_shell_action` from T010 alone, so it binds nothing. The parallelism comes from the lanes beside that file: the three view children hold one file each, the key-label test holds its own file, and the setup probes hold none.

A module file is not compiled until `view/mod.rs` declares it, so a lane that writes one child module cannot compile alone. Its own verify is a grep on its own file, and the wave's verify is the first compile. That is why Wave 3's four lanes land together and the orchestrator compiles once.

### What every dispatch carries

The hub's own rules bind each dispatch, not only the wave table. The orchestrator reads the target mode's `SKILL.md` before composing the prompt, attaches the resolved agent persona, and sets `AI_SESSION_CHILD=1` with the shared child preamble. [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:199] Every non-interactive dispatch redirects stdin, because a run that leaves it open hangs with no output rather than failing. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:130] A `cli-pi` dispatch also passes `--offline`, and a `cli-devin` dispatch puts `--` before the prompt. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:84] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:243] A Vibe worker starts from its own scratch folder inside the worktree, passes `--add-dir` for the worktree and keeps `VIBE_HOME` outside it, as the parent's Vibe dispatch says. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "BUILD ORCHESTRATION", Vibe dispatch]

A clean-room rule binds every lane that writes `theme.rs` or a view module. Its brief carries our design files and the MIT or Apache references only, and an openhuman or tinychannels path appears in a design document as provenance, never in a worker brief. The orchestrator compares the finished theme and frame with the openhuman files by eye and records that it did, because `rg -n 'openhuman' crates/bots-tui/src` passes on a copy that carries neither the path nor the licence header.

A worker's `done` is a claim until the orchestrator runs that wave's verify commands and reads their output and exit status. A wave that fails its verify does not hand its files to the next wave.

### Fallback order when a CLI runs out of usage

A wave whose named executor runs out of usage moves down this ladder from the next rung. A wave already on the last rung stops and reports rather than dropping its tier.

| Rung | Executor | Why it sits here |
|------|----------|------------------|
| 1 | `cli-mistral-vibe` · `deepseek-flash` | The primary for every lane since 2026-11-27, on the Vibe budget, which a `402 API budget exhausted` ends [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:138]. A `429` moves the lane down too |
| 2 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` | DevPass bills per token, and this route sits under the gateway's Premium threshold, so it carries no weekly cap |
| 3 | `cli-opencode` · `opencode-go/deepseek-v4.1-flash` | The Go gateway's subsidized usage rate, and it needs its own login before it answers |
| 4 | `cli-devin` · `deepseek-v4-1-flash-max` | A weekly quota, so it is probed with a trivial read-only call before a real task is handed to it [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237] |
| 5 | `cli-codex` · `gpt-6-luna` · `xhigh` · `fast` | The most expensive reasoning on the roster, kept for last |

The effort tier survives the fall as far as each route can express it. Rung 1 is `max` only, so every lane starts there. Rung 2 carries both tiers, so a lane that falls back runs at its fallback tier. Rung 3 upgrades a `high` request to `max`, because its route is pinned there. Rungs 4 and 5 are `max` or `xhigh` only, so a `high` lane that falls past rung 2 runs at the higher tier and the orchestrator records the escalation in the wave's verify note rather than pretending the tier held.

Two rungs can refuse before they spend anything, and the ladder treats a refusal as a rung that is out of usage. `cli-mistral-vibe` refuses to load when `VIBE_SESSION=1` is set, which is the case in a Vibe-hosted orchestrator, so that orchestrator skips rung 1 and starts every lane on rung 2. [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:16] `cli-devin`'s quota banner is not proof of exhaustion, because a free-tier model still dispatches at `Pro · 0% remaining`, so rung 4 is probed rather than assumed. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237]
<!-- /ANCHOR:external-orchestration -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The key table's actions and labels, the tab cycle, the palette filter and its reducer arms, the theme's `--mono` selection, the glyph table's two columns, `printable`, and `stale_label` | `cargo test --lib keys`, `--lib theme`, `--lib header`, `--lib state` |
| Render | Every label in the table appears in the frame that binds it. The header's three states. The status row with and without an error. The too-small screen at 23x8 and 24x7. The palette's filter, Enter and Esc | `cargo test --test render_keys` |
| Snapshot | The whole shell buffer at 80x24 and at 120x40, compared to an expected block held in the test file | `cargo test --test render_keys` |
| Environment | `--mono` selects Mono and the Mono frame draws the same symbols as System | `cargo test --lib theme` |
| Gate | `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo test`, the two greps and `validate.sh` | The commands in `tasks.md` |

No test needs a tty. The frame is drawn into a `TestBackend` buffer, the state is built by hand, and the clock is a field the test sets, so every assertion reads cells rather than keystrokes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002's crate, `state.rs`, `app.rs` and `cli.rs` | Internal | Yellow | The shell has nothing to draw from, and this phase cannot start |
| `bots status --json` | Internal | Green | The header loses its bot count and stale flag. The fixture carries the payload, so the tests still run |
| Phase 001's `design/` folder | Internal | Yellow | The exact strings and the glyph table have no approved source. The advisory's UX rules fix them, and a mismatch is a Logic-Sync |
| ratatui 0.30 and crossterm 0.29 | External | Green | The frame cannot draw |
| Rust stable toolchain | External | Green | The crate cannot build |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the shell draws a frame that hides a binding, or the key table and the footer disagree about a label.
- **Procedure**: revert the commit that adds `keys.rs`, `theme.rs`, `view/` and `tests/render_keys.rs`. Phase 002's crate still builds and still draws an empty frame, and nothing outside the crate reads the shell, so the runtime, the JSON verbs and the state root are unchanged by the revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 002 closed, and a stable Rust toolchain | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | The phase handoff to 004-panes |
<!-- /ANCHOR:phase-deps -->

---
