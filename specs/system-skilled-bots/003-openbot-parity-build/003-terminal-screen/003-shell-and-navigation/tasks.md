---
title: "Tasks: Phase 3: shell-and-navigation"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "shell and navigation tasks"
  - "bots ui shell tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: shell-and-navigation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Two shell variables shorten the commands below. Set them once per shell:

```bash
CRATE=crates/bots-tui
BOTS="node .skilled/bin/bots.cjs"
```

Every verify command runs without a tty. The frame is drawn into a ratatui `TestBackend` buffer, the state is built by hand, and the clock is a field the test sets, so no assertion waits on a keystroke.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 002's crate builds and the shell's rows are empty (`$CRATE`). Verify: `cargo build --manifest-path $CRATE/Cargo.toml` exits 0 and `rg -n 'SHELL_ROWS' $CRATE/src/keys.rs` prints the empty slice 002 leaves.
- [x] T002 Confirm the fixture answers `status --json` with a bot count and a stale flag (`$CRATE/tests/fixtures/bots`). Verify: `bash $CRATE/tests/fixtures/bots status --json | jq -e '[.rows[] | select(.kind == "bot")] | length'` prints a number and `bash $CRATE/tests/fixtures/bots status --json | jq -e 'has("stale") and has("updatedAt")'` exits 0.
- [x] T003 Confirm the library target runs and the render target does not exist yet (`$CRATE`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib` exits 0 and `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` exits non-zero and prints `no test target named`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Fill `SHELL_ROWS` in the table 002 creates - the rows for `main`, `inbox`, `palette` and `too-small`, each carrying the label the renderer draws (`$CRATE/src/keys.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib keys` prints `test result: ok` and names `every_row_has_a_label`, `alt_2_selects_inbox`, `bracket_right_cycles_forward`, `ctrl_p_opens_palette`, `ctrl_d_quits` and `ctrl_c_quits_and_emits_no_answer`.
- [x] T005 Write the theme - the System and Mono palettes, `--mono` selecting Mono, the glyph table with its ASCII column, `printable`, `stale_label` and `marker(state, ascii)` (`$CRATE/src/theme.rs`). `marker` is the one place a row state becomes a character, so 004's panes call it rather than keeping a second table. Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib theme` prints `test result: ok` and names `mono_resets_every_colour`, `ascii_glyphs_are_ascii`, `every_marker_has_an_ascii_counterpart` and `marker_draws_one_glyph_per_state`, which asserts one glyph and one ASCII character per row state.
- [x] T006 Write the header - the bot count, the index age, `stale_label`, the stale flag with its age, and the error state (`$CRATE/src/view/header.rs`). Verify: `rg -n 'fn stale_label\(' $CRATE/src/view/header.rs` prints one line, with the paren because the test this task names also starts with `fn stale_label`, and `cargo test --manifest-path $CRATE/Cargo.toml --lib header` prints `test result: ok` and names `stale_label_formats_the_age`.
- [x] T007 Write the tab bar - four tabs and the active mark (`$CRATE/src/view/tabs.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` prints `test result: ok` and names `chat_tab_carries_the_active_mark`, and `rg -n 'phase 010' $CRATE/src/view/tabs.rs` matches nothing, because 004 draws the chat line.
- [x] T008 Write the footer - the status row and the key line generated from `keys.rs`, with the inbox's `Enter open` on line 1 and the chat's line 1 holding only the tab keys (`$CRATE/src/view/footer.rs`). Verify: `rg -n 'keys::' $CRATE/src/view/footer.rs` prints the table read and `rg -n 'printable' $CRATE/src/view/footer.rs` prints the status row's filter.
- [x] T009 Write the shell frame - the seven bands, the too-small screen and the palette panel (`$CRATE/src/view/mod.rs`). Verify: `cargo build --manifest-path $CRATE/Cargo.toml` exits 0 and `rg -nF 'Too small · Ctrl+D exit' $CRATE/src/view/mod.rs` prints one line.
- [x] T010 Write `on_shell_action`: the `SelectTab`, `PrevTab` and `NextTab` arms, each calling `refresh`, then the palette's filter, its Up and Down selection, Enter and Esc, and pause the single-key shortcuts while the filter holds text (`$CRATE/src/state.rs` (`on_shell_action`), `$CRATE/src/keys.rs`, `$CRATE/src/view/mod.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib keys` names `palette_filter_pauses_shortcuts` and `palette_up_and_down_move_the_selection`, and `cargo test --manifest-path $CRATE/Cargo.toml --lib state` names `palette_opens_and_closes` and `select_tab_switches_and_refreshes`.
- [x] T011 Write the key-label test and the two shell snapshots, which compare the shell bands and skip the body rows 004 fills (`$CRATE/tests/render_keys.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` prints `test result: ok` and names `every_bound_label_is_drawn`, `shell_snapshot_80x24` and `shell_snapshot_120x40`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the formatter check (`$CRATE`). Verify: `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0.
- [x] T014 Run the linter with warnings denied (`$CRATE`). Verify: `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0.
- [x] T015 Run the crate suite (`$CRATE`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target and no `FAILED`.
- [x] T016 Prove the Mono palette loses no meaning (`$CRATE/src/theme.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib theme` names `mono_draws_the_same_symbols`.
- [x] T017 Prove the status row strips control characters (`$CRATE/tests/render_keys.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` names `status_row_strips_control_characters`.
- [x] T018 Prove the binary reads no environment variable and copies no GPL code (`$CRATE/src`). Verify: `rg -n 'env::var' $CRATE/src` matches nothing outside `#[cfg(test)]` blocks and `rg -n 'openhuman' $CRATE/src` prints only comment lines.
- [x] T019 Validate the packet (`specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/003-shell-and-navigation`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/003-shell-and-navigation --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:waves -->
## Execution Waves

Six waves. A lane is the unit of parallelism and two lanes never hold the same file, so the worker count is the number of lanes whose file sets are disjoint. The executor contract, the effort levers and the fallback ladder are in `plan.md` under `## External orchestration`. Each wave below names its starting rung and the rungs it falls to.

### Wave 1 - Setup probes

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T001, T002, T003 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `high` | none. Three read-only probes |

**Workers:** 1, because the three probes are read-only and one worker runs them in order. **Verify:** `cargo build --manifest-path $CRATE/Cargo.toml` exits 0. `bash $CRATE/tests/fixtures/bots status --json | jq -e 'has("stale") and has("updatedAt")'` exits 0. `rg -n 'SHELL_ROWS' $CRATE/src/keys.rs` prints the empty slice 002 leaves. **Fallback:** rung 2 `cli-pi` `--thinking high`, then rung 3 `cli-opencode` `#max`, then rung 4 `cli-devin` after a probe, then rung 5 `cli-codex` `xhigh`. Rung 1 is skipped in a Vibe-hosted session.

### Wave 2 - The two tables

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T004 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `$CRATE/src/keys.rs` |
| B | T005 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `$CRATE/src/theme.rs` |

**Workers:** 2. The lanes are disjoint because T004 holds `keys.rs` and T005 holds `theme.rs`. **Verify:** `cargo test --manifest-path $CRATE/Cargo.toml --lib keys` and `--lib theme` each print `test result: ok`, and `cargo build --manifest-path $CRATE/Cargo.toml` exits 0. **Fallback:** both lanes fall to rung 2 `cli-pi` `--thinking max`, then rung 3 `cli-opencode` `#max`, then rung 4 `cli-devin` after a probe, then rung 5 `cli-codex` `xhigh`.

### Wave 3 - The shell

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T009 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `$CRATE/src/view/mod.rs` |
| B | T006 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `high` | `$CRATE/src/view/header.rs` |
| C | T007 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `high` | `$CRATE/src/view/tabs.rs` |
| D | T008 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `high` | `$CRATE/src/view/footer.rs` |

**Workers:** 4. This is the packet's hardest wave: lane A owns the band arithmetic, the too-small screen and the palette panel, which are the three places a mistake draws a corrupt frame or panics on a small area, so it falls back at `max` and walks the whole ladder down to `cli-codex`. A module file is not compiled until `view/mod.rs` declares it, so lanes B and D verify with a grep on their own file, lane C's check is the render test that lands in Wave 5 and the wave's verify is the first compile. **Verify:** `cargo build --manifest-path $CRATE/Cargo.toml` exits 0. `cargo test --manifest-path $CRATE/Cargo.toml --lib` exits 0. `rg -nF 'Too small · Ctrl+D exit' $CRATE/src/view/mod.rs` prints one line. `rg -n 'fn stale_label' $CRATE/src/view/header.rs` prints one line. `rg -n 'keys::' $CRATE/src/view/footer.rs` prints the table read. **Fallback:** lane A falls to rung 2 `cli-pi` `--thinking max`, lanes B, C and D to rung 2 `cli-pi` `--thinking high`. Every lane then goes to rung 3 `cli-opencode` `#max`, rung 4 `cli-devin` after a probe and rung 5 `cli-codex` `xhigh`.

### Wave 4 - The palette

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T010 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `$CRATE/src/state.rs` (`on_shell_action`), `$CRATE/src/view/mod.rs`, `$CRATE/src/keys.rs` |

**Workers:** 1, because the lane holds `view/mod.rs`, which Wave 3's lane A wrote, `keys.rs`, which Wave 2's lane A wrote and `state.rs`, which 002 wrote. **Verify:** `cargo build --manifest-path $CRATE/Cargo.toml` exits 0. `cargo test --manifest-path $CRATE/Cargo.toml --lib keys` names `palette_filter_pauses_shortcuts`. `cargo test --manifest-path $CRATE/Cargo.toml --lib state` names `select_tab_switches_and_refreshes`. **Fallback:** rung 2 `cli-pi` `--thinking max`, then rung 3 `cli-opencode` `#max`, then rung 4 `cli-devin` after a probe, then rung 5 `cli-codex` `xhigh`.

### Wave 5 - The key-label test

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T011 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `$CRATE/tests/render_keys.rs` |

**Workers:** 1, because the wave holds one file. **Verify:** `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` prints `test result: ok` and names `every_bound_label_is_drawn`, `shell_snapshot_80x24` and `shell_snapshot_120x40`. **Fallback:** rung 2 `cli-pi` `--thinking max`, then rung 3 `cli-opencode` `#max`, then rung 4 `cli-devin` after a probe, then rung 5 `cli-codex` `xhigh`.

### Wave 6 - Verification gates

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| Orchestrator | T013, T014, T015, T016, T017, T018, T019 | none. The orchestrator runs them itself | none |

**Workers:** 0. Every gate is a command the orchestrator runs and reads, so no worker is dispatched and no `done` claim stands between the gate and its evidence. **Verify:** `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0. `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0. `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target. `rg -n 'env::var' $CRATE/src` matches nothing outside `#[cfg(test)]` blocks. `rg -n 'openhuman' $CRATE/src` prints only comment lines. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/003-shell-and-navigation --strict` prints `RESULT: PASSED`. **Fallback:** none. A failing gate is repaired in the wave that owns the file, and the gate is rerun from the final state.
<!-- /ANCHOR:waves -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target, and `cargo fmt --check` and `cargo clippy --all-targets -- -D warnings` exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, whose `## External orchestration` section owns the executor contract the waves cite
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent spec**: `../spec.md`, whose phase map fixes this child's scope and exit
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `cargo build --manifest-path $CRATE/Cargo.toml` exits 0, so phase 002's crate is in place.
- [x] CHK-002 [P0] `bash $CRATE/tests/fixtures/bots status --json | jq -e '.rows'` exits 0, so the header has a payload to read.
- [x] CHK-003 [P1] `rg -n 'SHELL_ROWS' $CRATE/src/keys.rs` prints the empty slice 002 leaves, so this phase starts from an empty shell.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0.
- [x] CHK-011 [P0] `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0.
- [x] CHK-012 [P1] `rg -n 'unwrap\(\)|expect\(' $CRATE/src/view` matches only lines inside `#[cfg(test)]` blocks, so no band arithmetic can panic on a small area.
- [x] CHK-013 [P1] `rg -n 'Command::new|read_to_string|File::open' $CRATE/src/view` matches nothing, so a redraw costs no I/O.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` prints `test result: ok` and names `every_bound_label_is_drawn`, `shell_snapshot_80x24` and `shell_snapshot_120x40`.
- [x] CHK-021 [P0] `cargo test --manifest-path $CRATE/Cargo.toml --lib keys` prints `test result: ok` and names `alt_2_selects_inbox`, `bracket_right_cycles_forward`, `ctrl_p_opens_palette`, `ctrl_d_quits` and `ctrl_c_quits_and_emits_no_answer`.
- [x] CHK-022 [P1] `cargo test --manifest-path $CRATE/Cargo.toml --lib theme` prints `test result: ok` and names `mono_resets_every_colour`, `mono_draws_the_same_symbols`, `ascii_glyphs_are_ascii` and `every_marker_has_an_ascii_counterpart`.
- [x] CHK-023 [P1] `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` names `too_small_draws_resize_line_only` and `status_row_strips_control_characters`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `rg -n 'env::var' $CRATE/src` matches nothing outside `#[cfg(test)]` blocks, so the binary reads no environment variable and no credential. The `ui` verb is where `NO_COLOR` becomes `--mono`.
- [x] CHK-031 [P0] `rg -n 'read_to_string|File::open|fs::read' $CRATE/src` matches nothing outside `#[cfg(test)]` blocks, so the shell opens no state file.
- [x] CHK-032 [P1] `rg -n 'printable' $CRATE/src/view` prints the status row's filter, so no drawn runtime string reaches the buffer unfiltered.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `rg -n 'keys.rs' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/003-shell-and-navigation/*.md` names the table in `spec.md`, `plan.md` and `tasks.md`.
- [x] CHK-041 [P1] `rg -n 'openhuman' $CRATE/src` prints only comment lines.
- [x] CHK-042 [P2] `rg -n 'Too small' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/003-shell-and-navigation/*.md` prints the line in `spec.md`, `plan.md` and `tasks.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] `git status --porcelain $CRATE/src` lists only `keys.rs`, `theme.rs`, `state.rs` and the four files under `view/`.
- [x] CHK-051 [P1] `git check-ignore -v $CRATE/target/release/bots-ui` prints the `/crates/bots-tui/target/` line.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-27
<!-- /ANCHOR:summary -->

---
