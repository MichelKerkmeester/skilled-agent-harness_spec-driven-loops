---
title: "Tasks: Phase 5: answer-flow"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "answer flow tasks"
  - "approval overlay tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: answer-flow

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

Three shell variables shorten the commands below. Set them once per shell:

```bash
CRATE=crates/bots-tui
BOTS="node .skilled/bin/bots.cjs"
STATE=${SKILLED_BOTS_STATE_ROOT:-${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots}
```

`$STATE` is the root `userStateRoot` resolves: the pinned `SKILLED_BOTS_STATE_ROOT`, else `${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots`. The final operator acceptance step after 006 reads an answered item's file under it. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:102-108]

`$CRATE` is the package 002 creates. This child creates none of the source files 002 owns, so every task below either extends one of them or adds one of the four files it owns.

### Waves

The build runs in five waves. A wave starts only after the orchestrator has run the previous wave's verify commands and read their output. `plan.md`'s External orchestration section owns the executor, the model, the effort and the fallback order for each wave. This table owns the task ids and the file overlap that decides the worker count.

| Wave | Tasks | Files held | Workers |
|------|-------|------------|---------|
| 1 - Setup probes | T001, T002, T003, T004 | none. Four read-only probes | 0, the orchestrator runs them |
| 2 - The state and the key table | T006, T007 | `src/state.rs`, `src/keys.rs` | 2, two disjoint files |
| 3 - The overlay | T010 | `src/view/overlay.rs`, `src/view/mod.rs` | 1, one task and one `mod` line in the one view root |
| 4 - The two suites | T012, T013 | `tests/end_to_end.rs`, `tests/answer_flow.rs` | 2, two disjoint files |
| 5 - Verification gates | T014, T015, T016, T017, T018, T020 | none | 0, the orchestrator runs them |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the packet 001 surface this child consumes, before any edit (`.skilled/bin/bots.cjs`). Verify: `$BOTS inbox --json` exits 0 and prints a JSON object carrying an `items` array, and `rg -n "scope" .skilled/bin/bots.cjs` prints the `answer` option, so the read and the write both exist before this child extends them. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-003] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-010]
- [x] T002 Confirm the six files this child depends on exist (`$CRATE`). Verify: `ls $CRATE/src/model.rs $CRATE/src/state.rs $CRATE/src/keys.rs $CRATE/src/cli.rs $CRATE/src/app.rs $CRATE/tests/fixtures/bots` prints six paths, and `ls $CRATE/tests/common/frames.rs` prints the path, so 002's frame loader exists for the two suites.
- [x] T003 Read the four answer-flow design sources and confirm the deny-first order, the typing pause and the lock (`specs/system-skilled-bots/context`). Verify: `rg -n 'Deny' specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render/overlay.rs` prints the deny button line, `rg -n 'if typing' specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app/overlays.rs` prints the guard, and `rg -n 'this.saving = true' specs/system-skilled-bots/context/OpenGhost-main/approval-card.js` prints the lock.
- [x] T004 Confirm the fixture records its argv today (`$CRATE/tests/fixtures/bots`). Verify: `rg -n 'argv' $CRATE/tests/fixtures/bots` prints the log line, and `git ls-files -s $CRATE/tests/fixtures/bots` prints `100755`. Observed: the literal `rg -n 'argv'` prints nothing, because the fixture logs with `printf '%s\n' "$*"` at line 50. A live run with `--fixture-log` appended `answer --scope deny -- item-1 deny`, and `git ls-files -s` printed `100755`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add the overlay state - `Idle`, `Typing`, `Sending`, `Refused(String)` and `Gone` - the free-text buffer and the in-flight set `pending_answers` that refuses a second press, per `design/state-machines.md` section 1. Add the `Msg::Paste` arm too: in `Typing` it appends to the free-text buffer with each carriage return or line feed written as one space. Anywhere else it does nothing (`$CRATE/src/state.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib state` prints `test result: ok` and names `overlay_locks_after_first_press`, which asserts a second press returns no `Answer` effect, `overlay_transition_table`, one row per phase and key run through `update` alone, `close_while_sending_keeps_the_answer`, which asserts Esc and Ctrl+C close the overlay while the id stays in `pending_answers` and the `Answered` result still writes the status row, and `outcome_word_stays_until_the_next_poll`, which asserts a successful answer issues no read and the word clears only on the next successful inbox read.
- [x] T007 Add the overlay bindings and the label each one draws - `y`, `n`, `1` to `9`, `t`, `Esc`, `Ctrl+C` and the `Typing` phase that pauses them (`$CRATE/src/keys.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib keys` prints `test result: ok` and names `overlay_bindings_carry_labels`, which asserts every overlay row has a non-empty label, and `text_mode_pauses_every_single_key_row`, which asserts that in text mode every single-key row is paused and only `Enter`, `Backspace`, `Esc`, `Ctrl+C` and `Ctrl+D` stay live.
- [x] T008 Make a refused answer report the runtime's own first stderr line, falling back to `bots-ui: answer exited <code>` when stderr is empty, and move the one test that asserted the wrapped `bots: answer exited 4: <reason>` form (`$CRATE/src/cli.rs`). Added by the orchestrator, see the goal log. Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib cli` prints `test result: ok` and names `answer_refusal_names_the_reason` and `answer_failure_without_stderr_names_the_exit`.
- [x] T010 Draw the decision and choice overlays, the free-text line, the sending state, the refusal line, the gone state and the grant row drawn only when the item carries one, and declare the module in the view root (`$CRATE/src/view/overlay.rs`, `$CRATE/src/view/mod.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib overlay` prints `test result: ok` and names `overlay_draws_deny_first`, `overlay_labels_are_drawn`, `sending_dims_every_key`, `refused_adds_the_stderr_line`, `gone_replaces_the_choices` and `grant_row_draws_only_when_present`.
- [x] T012 Write `tests/end_to_end.rs`: `App::handle` Resize and Tick, `App::settle`, `App::draw`, and compare the buffer with frame 1 cell for cell, then a second test that sends Key Alt(2), settles, sends Key Enter and Key `y`, settles, draws and compares the buffer with frame 27 cell for cell, loading the expected frame from `design/mockups.md` by heading and size through `tests/common/frames.rs` (`$CRATE/tests/end_to_end.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test end_to_end` prints `test result: ok` and names `scripted_loop_draws_frame_one` and `scripted_answer_draws_frame_27`.
- [x] T013 Write the answer-flow suite: the argv log, the digit, Esc, the closed input, the free text, the typing pause, the leading `y`, the second press, the refusal, the gone item, the expired item, Ctrl+C, the unbound key, the refresh during sending, the reopen while in flight, the blank line, the gone-class refusal, the dash-led text and a paste of `y` and a line feed in shortcut mode and on the inbox tab (`$CRATE/tests/answer_flow.rs`). Each test passes its own temp log path through `--fixture-log` and its own `--fixture-scenario`, and every no-write test first asserts the same log recorded the reads. The overlay frames it asserts are loaded from `design/mockups.md` by heading and size through `tests/common/frames.rs`, so a frame wrong below line one fails. Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test answer_flow` prints `test result: ok` and names `argv_is_exactly_answer_id_text_scope`, `digit_picks_option_inside_overlay_only`, `esc_closes_overlay_and_writes_nothing`, `closed_input_writes_nothing`, `free_text_answer_writes_typed_line`, `typing_pauses_single_key_shortcuts`, `text_mode_accepts_a_leading_y`, `second_press_writes_nothing`, `refusal_shows_stderr_and_keeps_item`, `gone_item_disables_keys`, `expired_item_cannot_be_answered`, `ctrl_c_closes_overlay_and_writes_nothing`, `refresh_while_sending_keeps_sending`, `reopen_while_in_flight_stays_locked`, `blank_line_sends_nothing`, `gone_class_refusal_moves_to_gone`, `dash_led_text_follows_the_terminator`, `unbound_key_writes_nothing`, `review_reject_records_deny`, `item_busy_refusal_keeps_the_overlay` and `paste_never_answers`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run the formatter check (`$CRATE`). Verify: `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0.
- [x] T015 Run the linter with warnings denied (`$CRATE`). Verify: `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0.
- [x] T016 Run the crate suite (`$CRATE`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target and no `FAILED`.
- [x] T017 Prove the write path is one call in one module (`$CRATE/src`). Verify: `rg -n 'Command::new' $CRATE/src` prints only `cli.rs`, and `rg -n 'answer' $CRATE/src --glob '!cli.rs'` prints no `Command`.
- [x] T018 Prove the five no-write paths from the argv log (`$CRATE/tests/answer_flow.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test answer_flow` prints `test result: ok` and names `esc_closes_overlay_and_writes_nothing`, `closed_input_writes_nothing`, `ctrl_c_closes_overlay_and_writes_nothing`, `unbound_key_writes_nothing` and `second_press_writes_nothing`, each of which asserts the fixture recorded no `answer` argv.
- [x] T020 Validate the packet (`specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target, and `cargo test --manifest-path $CRATE/Cargo.toml --test answer_flow` names all eighteen tests T013 lists. Observed: every target ok, and the suite names all 21 tests T013 now lists
- [x] The hand proof is the final operator acceptance step after 006, so it is not a task here and does not block this packet's closure
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, whose External orchestration section owns the executor and the fallback order for each wave
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent spec**: `../spec.md`, whose REQ-003, REQ-006, REQ-010 and REQ-011 this child inherits
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

- [x] CHK-001 [P0] `$BOTS inbox --json` exits 0 and prints a JSON object carrying an `items` array, and `rg -n "scope" .skilled/bin/bots.cjs` prints the `answer` option. Observed: `inbox --json` exited 0 and printed `{"version": 1, "items": []}`, and `rg` printed the `answer` usage line with `[--scope once|deny]` at `bots.cjs:51`.
- [x] CHK-002 [P0] `ls $CRATE/src/model.rs $CRATE/src/state.rs $CRATE/src/keys.rs $CRATE/src/cli.rs $CRATE/src/app.rs $CRATE/tests/fixtures/bots` prints six paths. Observed: `ls` printed all six paths.
- [x] CHK-003 [P1] `git ls-files -s $CRATE/tests/fixtures/bots` prints `100755`. Observed: `100755 814ea3907d6`.
- [x] CHK-004 [P1] `ls $CRATE/tests/common/frames.rs` prints the path, so 002's frame loader exists for the two suites. Observed: the path printed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0. Observed: exit 0.
- [x] CHK-011 [P0] `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0. Observed: exit 0.
- [x] CHK-012 [P1] `rg -n 'unwrap\(\)|expect\(' $CRATE/src/view/overlay.rs` matches only lines inside `#[cfg(test)]` blocks. Observed: every match sits below line 212, where the `#[cfg(test)]` module starts.
- [x] CHK-013 [P1] `rg -n 'Command::new' $CRATE/src` prints only `cli.rs`. Observed: only `crates/bots-tui/src/cli.rs:95`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] `cargo test --manifest-path $CRATE/Cargo.toml --test answer_flow` prints `test result: ok` and names all twenty tests T013 lists. Observed: `test result: ok. 22 passed`, the 21 tests T013 names plus `support::flow_lands_the_reads`.
- [x] CHK-021 [P0] `cargo test --manifest-path $CRATE/Cargo.toml --lib closed_input` prints `test result: ok` and names `closed_input_writes_nothing`. Observed: `test result: ok. 2 passed`, naming `app::tests::closed_input_writes_nothing`.
- [x] CHK-022 [P1] `cargo test --manifest-path $CRATE/Cargo.toml --lib overlay` prints `test result: ok` and names the six overlay tests T010 lists. Observed: `test result: ok. 17 passed`, naming the six T010 tests and `typing_draws_the_line_and_the_cursor` and `short_body_keeps_the_head_and_status`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `rg -n 'env::var' $CRATE/src` matches nothing outside `#[cfg(test)]` blocks, so the shipped binary reads no environment variable of its own. Observed: no match.
- [x] CHK-031 [P0] `rg -n 'read_to_string|File::open|fs::read' $CRATE/src` matches nothing outside `#[cfg(test)]` blocks, so the shipped binary opens no state file. The one test that reads the fixture's argv log is a `#[cfg(test)]` module. Observed: four matches, `cli.rs:544` and `cli.rs:627` below its test module at 426, `data.rs:219` below 209 and `app.rs:190` below 174.
- [x] CHK-032 [P1] `rg -n 'theme::' $CRATE/src/view/overlay.rs` prints the call that cleans the typed line through the one sanitizer 003 owns before it is drawn. Observed: `theme::printable` at `overlay.rs:40`, `48`, `77` and five more lines, every runtime string the panel draws.
- [x] CHK-033 [P1] The answer text reaches the runtime only through `bots answer`, which refuses a secret literal before it stores the answer. Observed: the only spawn is `cli.rs:95`, and every write goes through `cli::answer`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `rg -n 'answer_flow' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow/*.md` names the suite in `spec.md`, `plan.md` and `tasks.md`. Observed: all five documents name it.
- [x] CHK-041 [P1] `rg -n 'REQ-003|REQ-006|REQ-010|REQ-011' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow/spec.md` prints the four inherited ids with the parent's wording. Observed: 8 lines carry the four ids.
- [x] CHK-042 [P2] `rg -n 'mod banner' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow` prints nothing, so no document here claims the banner row 004 owns. Observed: the literal prints five lines, the disclaimers in `spec.md` and `plan.md`, the known limitation in `implementation-summary.md` and the two check rows that quote the pattern, so no document claims the row. See AC-011.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] `git status --porcelain $CRATE` lists only source, tests, fixtures, `Cargo.toml`, `Cargo.lock` and `README.md`, and no `target/`. Observed: only `src/` and `tests/` files, no `target/`.
- [x] CHK-051 [P1] `git check-ignore -v $CRATE/target/release/bots-ui` prints the `/crates/bots-tui/target/` line. Observed: `.gitignore:63:/crates/bots-tui/target/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-28
<!-- /ANCHOR:summary -->

---
