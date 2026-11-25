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

Two shell variables shorten the commands below. Set them once per shell:

```bash
CRATE=crates/bots-tui
BOTS="node .skilled/bin/bots.cjs"
STATE=${SKILLED_BOTS_STATE_ROOT:-${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots}
```

`$STATE` is the root `userStateRoot` resolves: the pinned `SKILLED_BOTS_STATE_ROOT`, else `${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:102-108]

`$CRATE` is the package 002 creates. This child creates none of its source files, so every task below either extends one of them or adds one of the two files it owns.

### Waves

The build runs in six waves. A wave starts only after the orchestrator has run the previous wave's verify commands and read their output. `plan.md`'s External orchestration section owns the executor, the model, the effort and the fallback order for each wave; this table owns the task ids and the file overlap that decides the worker count.

| Wave | Tasks | Files held | Workers |
|------|-------|------------|---------|
| 1 - Setup probes | T001, T002, T003, T004 | none; four read-only probes | 0, the orchestrator runs them |
| 2 - The item, the state and the key table | T005, T006, T007 | `src/model.rs`, `src/state.rs`, `src/keys.rs` | 3, three disjoint files |
| 3 - The write path and the fixture | T008, T009 | `src/cli.rs`, `tests/fixtures/bots` | 2, two disjoint files |
| 4 - The two views | T010, T011 | `src/view/overlay.rs`, `src/view/banner.rs`, `src/view/mod.rs` | 1, serial because both tasks add a `mod` line to the one view root |
| 5 - The loop and the integration test | T012, T013 | `src/app.rs`, `tests/answer_flow.rs` | 1, serial because the test drives the effect |
| 6 - Verification gates | T014, T015, T016, T017, T018, T020 | none | 0, the orchestrator runs them; T019 is the operator's |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the packet 001 surface this child consumes, before any edit (`.skilled/bin/bots.cjs`). Verify: `$BOTS inbox --json` exits 0 and prints a JSON object carrying an `items` array, and `rg -n "scope" .skilled/bin/bots.cjs` prints the `answer` option, so the read and the write both exist before this child extends them. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:153] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:156]
- [ ] T002 Confirm the six files this child extends exist (`$CRATE`). Verify: `ls $CRATE/src/model.rs $CRATE/src/state.rs $CRATE/src/keys.rs $CRATE/src/cli.rs $CRATE/src/app.rs $CRATE/tests/fixtures/bots` prints six paths.
- [ ] T003 Read the four answer-flow design sources and confirm the deny-first order, the typing pause and the lock (`specs/system-skilled-bots/context`). Verify: `rg -n 'Deny' specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render/overlay.rs` prints the deny button line, `rg -n 'if typing' specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app/overlays.rs` prints the guard, and `rg -n 'this.saving = true' specs/system-skilled-bots/context/OpenGhost-main/approval-card.js` prints the lock.
- [ ] T004 Confirm the fixture records its argv today (`$CRATE/tests/fixtures/bots`). Verify: `rg -n 'argv' $CRATE/tests/fixtures/bots` prints the log line, and `git ls-files -s $CRATE/tests/fixtures/bots` prints `100755`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add `options` to the inbox item, so the overlay can tell a choice item from a free-text one (`$CRATE/src/model.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib model` prints `test result: ok` and names `inbox_item_carries_options`.
- [ ] T006 Add the overlay state - `Idle`, `Sending`, `Refused(String)` and `Gone` - the free-text buffer and the lock that refuses a second press (`$CRATE/src/state.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib state` prints `test result: ok` and names `overlay_locks_after_first_press`, which asserts a second press returns no `Answer` effect.
- [ ] T007 Add the overlay bindings and the label each one draws - `y`, `n`, `1` to `9`, `t`, `Esc`, `Ctrl+C` and the typing mode that pauses them (`$CRATE/src/keys.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib keys` prints `test result: ok` and names `overlay_bindings_carry_labels`, which asserts every overlay row has a non-empty label, and `text_mode_pauses_every_single_key_row`, which asserts that in text mode every single-key row is paused and only `Enter`, `Backspace`, `Esc`, `Ctrl+C` and `Ctrl+D` stay live.
- [ ] T008 Add the `answer` call carrying `--scope once|deny` and the stderr capture the status row reads (`$CRATE/src/cli.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib cli` prints `test result: ok` and names `answer_argv_is_exactly_answer_id_text_scope`, which asserts the built argv is `answer <id> <text> --scope once` and `--scope deny` for the two scopes and carries no other argument.
- [ ] T009 Add the fixture's `answer` branch, its argv log line and the refusal switch (`$CRATE/tests/fixtures/bots`). Verify: `bash $CRATE/tests/fixtures/bots answer item-1 deny --scope deny` exits 0 and `tail -1 $CRATE/tests/fixtures/bots.argv` prints `answer item-1 deny --scope deny`, and `BOTS_FIXTURE_ANSWER_EXIT=4 bash $CRATE/tests/fixtures/bots answer item-1 deny --scope deny` exits 4 and prints `bots: answer-not-approver`.
- [ ] T010 Draw the decision and choice overlays, the free-text line, the sending state, the refusal line, the gone state and the grant row drawn only when the item carries one, and declare the module in the view root (`$CRATE/src/view/overlay.rs`, `$CRATE/src/view/mod.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib overlay` prints `test result: ok` and names `overlay_draws_deny_first`, `overlay_labels_are_drawn`, `sending_dims_every_key`, `refused_adds_the_stderr_line`, `gone_replaces_the_choices` and `grant_row_draws_only_when_present`.
- [ ] T011 Draw the banner row from the open item count and the inbox tab key label, and declare the module in the view root (`$CRATE/src/view/banner.rs`, `$CRATE/src/view/mod.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib banner` prints `test result: ok` and names `banner_counts_open_items` and `banner_is_blank_with_none`.
- [ ] T012 Run the `Answer` effect, the lock, the refusal path and the closed-input exit (`$CRATE/src/app.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib closed_input` prints `test result: ok` and names `closed_input_writes_nothing`, which asserts the loop returns 0 and the fixture recorded no `answer` argv.
- [ ] T013 Write the answer-flow suite: the argv log, the digit, Esc, the closed input, the free text, the typing pause, the leading `y`, the second press, the refusal, the gone item, the expired item, Ctrl+C and the unbound key (`$CRATE/tests/answer_flow.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test answer_flow` prints `test result: ok` and names `argv_is_exactly_answer_id_text_scope`, `digit_picks_option_inside_overlay_only`, `esc_closes_overlay_and_writes_nothing`, `closed_input_writes_nothing`, `free_text_answer_writes_typed_line`, `typing_pauses_single_key_shortcuts`, `text_mode_accepts_a_leading_y`, `second_press_writes_nothing`, `refusal_shows_stderr_and_keeps_item`, `gone_item_disables_keys`, `expired_item_cannot_be_answered`, `ctrl_c_closes_overlay_and_writes_nothing` and `unbound_key_writes_nothing`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Run the formatter check (`$CRATE`). Verify: `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0.
- [ ] T015 Run the linter with warnings denied (`$CRATE`). Verify: `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] T016 Run the crate suite (`$CRATE`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target and no `FAILED`.
- [ ] T017 Prove the write path is one call in one module (`$CRATE/src`). Verify: `rg -n 'Command::new' $CRATE/src` prints only `cli.rs`, and `rg -n 'answer' $CRATE/src --glob '!cli.rs'` prints no `Command`.
- [ ] T018 Prove the five no-write paths from the argv log (`$CRATE/tests/answer_flow.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test answer_flow` prints `test result: ok` and names `esc_closes_overlay_and_writes_nothing`, `closed_input_writes_nothing`, `ctrl_c_closes_overlay_and_writes_nothing`, `unbound_key_writes_nothing` and `second_press_writes_nothing`, each of which asserts the fixture recorded no `answer` argv.
- [ ] T019 Prove the answer path by hand (operator step, `$CRATE`). With one open item whose id is `<item-id>`, answer it `n` from the overlay in `bots ui`. This step needs a tty by design, because the overlay is driven by keystrokes no piped command delivers; it is not an acceptance criterion, and every other task here runs without one. Verify: `jq -e '.answer.text == "deny" and .answer.scope == "deny"' $STATE/*/needs-you/<item-id>.json` exits 0, because `bots inbox --json` lists only open and expired items. [SOURCE: .skilled/bin/bots.cjs:465]
- [ ] T020 Validate the packet (`specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The operator has run the hand check (T019), and its item file reads back as answered
- [ ] `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target, and `cargo test --manifest-path $CRATE/Cargo.toml --test answer_flow` names all thirteen tests T013 lists
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

- [ ] CHK-001 [P0] `$BOTS inbox --json` exits 0 and prints a JSON object carrying an `items` array, and `rg -n "scope" .skilled/bin/bots.cjs` prints the `answer` option.
- [ ] CHK-002 [P0] `ls $CRATE/src/model.rs $CRATE/src/state.rs $CRATE/src/keys.rs $CRATE/src/cli.rs $CRATE/src/app.rs $CRATE/tests/fixtures/bots` prints six paths.
- [ ] CHK-003 [P1] `git ls-files -s $CRATE/tests/fixtures/bots` prints `100755`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] CHK-011 [P0] `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0.
- [ ] CHK-012 [P1] `rg -n 'unwrap\(\)|expect\(' $CRATE/src/view/overlay.rs $CRATE/src/view/banner.rs` matches only lines inside `#[cfg(test)]` blocks.
- [ ] CHK-013 [P1] `rg -n 'Command::new' $CRATE/src` prints only `cli.rs`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] `cargo test --manifest-path $CRATE/Cargo.toml --test answer_flow` prints `test result: ok` and names all thirteen tests T013 lists.
- [ ] CHK-021 [P0] `cargo test --manifest-path $CRATE/Cargo.toml --lib closed_input` prints `test result: ok` and names `closed_input_writes_nothing`.
- [ ] CHK-022 [P1] `cargo test --manifest-path $CRATE/Cargo.toml --lib overlay` prints `test result: ok` and names the six overlay tests T010 lists.
- [ ] CHK-023 [P1] `cargo test --manifest-path $CRATE/Cargo.toml --lib banner` prints `test result: ok` and names `banner_counts_open_items` and `banner_is_blank_with_none`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] `rg -n 'env::var' $CRATE/src` matches nothing outside `#[cfg(test)]` blocks, so the shipped binary reads no environment variable of its own.
- [ ] CHK-031 [P0] `rg -n 'read_to_string|File::open|fs::read' $CRATE/src` matches nothing outside `#[cfg(test)]` blocks, so the shipped binary opens no state file; the one test that reads the fixture's argv log is a `#[cfg(test)]` module.
- [ ] CHK-032 [P1] `rg -n 'theme::' $CRATE/src/view/overlay.rs` prints the call that cleans the typed line through the one sanitizer 003 owns before it is drawn.
- [ ] CHK-033 [P1] The answer text reaches the runtime only through `bots answer`, which refuses a secret literal before it stores the answer.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `rg -n 'answer_flow' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow/*.md` names the suite in `spec.md`, `plan.md` and `tasks.md`.
- [ ] CHK-041 [P1] `rg -n 'REQ-003|REQ-006|REQ-010|REQ-011' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow/spec.md` prints the four inherited ids with the parent's wording.
- [ ] CHK-042 [P2] `rg -n 'banner.rs' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow/spec.md` prints the row that records where the banner lives.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] `git status --porcelain $CRATE` lists only source, tests, fixtures, `Cargo.toml`, `Cargo.lock` and `README.md`, and no `target/`.
- [ ] CHK-051 [P1] `git check-ignore -v $CRATE/target/release/bots-ui` prints the `/crates/bots-tui/target/` line.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---
