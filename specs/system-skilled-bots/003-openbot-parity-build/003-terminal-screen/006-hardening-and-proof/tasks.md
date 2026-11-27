---
title: "Tasks: Phase 6: hardening-and-proof"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hardening and proof tasks"
  - "bots ui gates tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: hardening-and-proof

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

`$STATE` is the root `userStateRoot` resolves: the pinned `SKILLED_BOTS_STATE_ROOT`, else `${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:102-108]

### The waves

The tasks run in five waves. A wave's lanes hold disjoint files, so the worker count is the number of lanes, never the number of tasks. `plan.md`'s `External orchestration` section carries each lane's file set, the fallback ladder and the full verify step.

| Wave | Tasks | Executor, model, effort | Workers | Verify after the wave |
|------|-------|-------------------------|---------|-----------------------|
| 1 Setup probes | T001 to T004 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `high` | 1 | The four probe commands print their expected output |
| 2 Gate repair | T005 to T008 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` on lane A. `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `high` on lane B | 2 | `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings` and `cargo test` exit 0, and the runtime suite prints no `failed` |
| 2b The pseudo-terminal test | T033 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | 1 | `cargo test --release --test pty_smoke` prints `1 passed` and names `answers_one_item_in_a_pseudo_terminal` |
| 3 Documents | T009 to T011 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` on lane A. `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `high` on lane B | 2 | The five README greps each print one line, the hub grep prints one line and `test -L .opencode/skills` and `test -L .opencode/bin` each exit 0 |
| 4 Verification | T012 to T021 | the orchestrator, no dispatch | 0 | Every gate from the final state, the licence proof, the pointer check, the eight defect checks, the pseudo-terminal run and `RESULT: PASSED` |

A wave whose executor runs out of usage moves down the ladder in `plan.md`'s `External orchestration` section and never lowers its effort tier. A wave already on the last rung stops and reports rather than dropping its tier.

### Moved from the pre-expansion phase

The pre-expansion phase 003 carried one task list for the whole screen. These are the tasks that belong to this child, with the id each one became. The rest moved to the child that owns the surface, and the two that need a tty moved to `005-answer-flow` because the parent's handoff row names them as its exit.

| Legacy task | Intent | Now |
|-------------|--------|-----|
| T021 | Name `bots ui` as a status surface | T010 |
| T022 | Prove the hub mirror is a symlink | T011 |
| T019 | Prove the CLI mirror is a symlink | T011, which proves both mirrors |
| T023 | Write the crate README | T009 |
| T024 | Add the `bots-tui` CI job | `002-architecture-and-contracts`, which the parent's Files to Change table assigns `.github/workflows/bots-runtime.yml` to |
| T025 | Run the formatter check | T005, then T012 from the final state |
| T026 | Run the linter with warnings denied | T006, then T013 from the final state |
| T027 | Run the crate suite | T007, then T014 from the final state |
| T028 | Run the runtime suite | T008, then T015 from the final state |
| T029 | Prove no openhuman code was copied | T016 |
| T030 | Prove the answer path by hand | T021 for the scripted run, and the operator's final acceptance step after this phase for the hand answer |
| T031 | Prove the closed-input rule | `005-answer-flow`, which owns the loop's closed-input test |
| T032 | Validate the packet | T020 |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Wave 1 - Setup probes

- [x] T001 Confirm the crate and the gate set before any edit (`$CRATE/Cargo.toml`). Verify: `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0, so the crate 002 lands is in place, and `cargo test --manifest-path $CRATE/Cargo.toml --release --test pty_smoke` exits non-zero naming no such target, so the one target this phase adds is the only thing absent. Evidence: at the start `cargo fmt --check` exited 0, and the starting `ls crates/bots-tui/tests` listed no `pty_smoke.rs`, so the pseudo-terminal target was the one absent thing. The probe ran in the orchestrator shell, because it writes nothing.
- [x] T002 Record the toolchain the gates run under (`goal.md`). Verify: `cargo fmt --version` and `cargo clippy --version` each print a version and exit 0. Evidence: `cargo 1.92.0`, `rustfmt 1.8.0-stable` and `clippy 0.1.92`, each exit 0.
- [x] T003 Record the crate's module list as the gate's file set (`$CRATE/src`). Verify: `ls $CRATE/src` prints `app.rs`, `cli.rs`, `data.rs`, `event.rs`, `keys.rs`, `lib.rs`, `main.rs`, `model.rs`, `state.rs`, `terminal.rs`, `theme.rs` and `view`. Evidence: `ls` printed the twelve entries.
- [x] T004 Confirm the eight defect rows the audit covers (`../spec.md`). Verify: `rg -c '^\| .*\| (002|003|004|005): ' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md` prints 8. Evidence: the count printed 8.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Wave 2 - Gate repair

- [x] T005 Run the formatter and repair only the lines it names (`$CRATE/src`, `$CRATE/tests`). Verify: `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0. Evidence: the gate exited 0 at the start and from the final state, so it named no line to repair.
- [x] T006 Run the linter and repair only the lines it names (`$CRATE/src`, `$CRATE/tests`). Verify: `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0. Evidence: the gate exited 0 at the start and from the final state, so it named no line to repair.
- [x] T007 Run the crate suite and repair only the test it names (`$CRATE/tests`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target and no `FAILED`. Evidence: every target printed `test result: ok` at the start (lib 117, answer_flow 22, cli_client 8, end_to_end 2, panes 53 with 1 ignored, render_keys 16), so no test needed a repair.
- [x] T008 Run the runtime suite and repair only the test it names (`.skilled/skills/system-skilled-bots/runtime/tests`). Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`. Evidence: 43 files and 548 passed at the start and from the final state, `npm run typecheck` exit 0, so no test needed a repair.

### Added by the build orchestrator

The build orchestrator added these two tasks, because the crate's frozen contract requires them and no earlier crate child built them. They run beside Wave 2b and Wave 3, each in its own file lane.

- [x] T034 Added by the build orchestrator: the identity row filter of `002-architecture-and-contracts/design/contracts.md` section 2. The screen keeps only rows whose `identity` is the checkout's own identity and drops every other row before it reaches a pane, so a count, a selection and an answer target all name this checkout's rows. The own identity is the `identity` of the status bot row whose `path` is the checkout passed as `--repo`, and an inbox item is dropped when a status needs-you row lists its id under another identity (`$CRATE/src/state.rs`, `$CRATE/src/model.rs`, `$CRATE/src/app.rs`). Verify: `cargo test --locked --manifest-path $CRATE/Cargo.toml --lib -- foreign_ unknown_identity_keeps_every_row` prints `test result: ok. 3 passed` and names `foreign_identity_rows_reach_no_pane` and `foreign_item_cannot_be_answered`. Evidence: `3 passed`. With `keep_own_rows` stubbed to return at once, `foreign_identity_rows_reach_no_pane` and `foreign_item_cannot_be_answered` both FAILED, so the tests fail without the filter.
- [x] T035 Added by the build orchestrator: the `quit_does_not_wait_for_answer` test of `002-architecture-and-contracts/design/architecture.md` section 2.5, with the code change that test needs. The answer child is spawned with stdout null, a quit returns without the child's exit, and an answer queued at quit starts with stdout and stderr null (`$CRATE/src/cli.rs`, `$CRATE/tests/fixtures/bots`, `$CRATE/tests/answer_flow.rs`, `$CRATE/tests/answer_flow/quit.rs`). Verify: `cargo test --locked --manifest-path $CRATE/Cargo.toml --test answer_flow quit` prints `test result: ok. 2 passed` and names `quit_does_not_wait_for_answer`. Evidence: `2 passed`. With the answer child spawned with stdout piped again, `quit_does_not_wait_for_answer` FAILED on its `stdout=null` assert.

### Wave 2b - The pseudo-terminal test

- [x] T033 Write the pseudo-terminal smoke test: build a temp skilled tree whose `.skilled/bin/bots.cjs` is a small Node shim that spawns `$CRATE/tests/fixtures/bots` with the argv it is given, resolve the binary with `env!("CARGO_BIN_EXE_bots-ui")`, open a pseudo-terminal, send the keys that answer one item and read the drawn screen. The test has no skip branch, so a missing binary or a missing shim fails it rather than passing it (`$CRATE/tests/pty_smoke.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --release --test pty_smoke` prints `test result: ok. 1 passed` and names `answers_one_item_in_a_pseudo_terminal`. Evidence: the release run printed `1 passed` three times in a row (0.35 s to 0.42 s), and the debug run inside the full suite passed too.

### Wave 3 - The two documents

- [x] T009 Write the crate README: the release build, the run command, every bound key, the eight glyphs with their ASCII fallback and the two flags that select it, the design reference and the no-code statement (`$CRATE/README.md`). Verify: `rg -n 'cargo build --release' $CRATE/README.md`, `rg -n 'Ctrl\+C' $CRATE/README.md`, `rg -n 'ASCII|--ascii|--mono' $CRATE/README.md`, `rg -n 'openhuman' $CRATE/README.md` and `rg -n 'no code' $CRATE/README.md` each print at least one line. Evidence: the five greps print 1, 4, 4, 1 and 1 lines, `rg -c` gives 1 for `openhuman`, `no code` and `ASCII`, the file is 176 lines and `check_readme_references.py` prints PASS.
- [x] T010 Name `bots ui` as a status surface in one line (`.skilled/skills/system-skilled-bots/SKILL.md`). Verify: `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints one line. Evidence: the grep prints line 33 alone.
- [x] T011 Prove both hub mirrors are symlinks, so the edited line and the edited verb each land once (`.opencode/skills`, `.opencode/bin`). Verify: `test -L .opencode/skills` and `test -L .opencode/bin` each exit 0, `rg -n 'bots ui' .opencode/skills/system-skilled-bots/SKILL.md` prints the same one line as the `.skilled/` path, and `rg -c 'ui' .opencode/bin/bots.cjs` prints the same count as `.skilled/bin/bots.cjs`. Evidence: both `test -L` exit 0, the `.opencode/skills` path prints the same line 33, and both `bots.cjs` paths count 35.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Wave 4 - Verification from the final state

- [x] T012 Prove the formatter gate from the final state (`$CRATE`). Verify: `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0. Evidence: exit 0.
- [x] T013 Prove the linter gate from the final state (`$CRATE`). Verify: `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0. Evidence: exit 0.
- [x] T014 Prove the crate suite from the final state (`$CRATE`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target and no `FAILED`. Evidence: lib 120, main 0, answer_flow 24, cli_client 8, end_to_end 2, panes 53 with 1 ignored, pty_smoke 1, render_keys 16, doc 0, all `ok`, no `FAILED`.
- [x] T015 Prove the runtime suite from the final state (`.skilled/skills/system-skilled-bots/runtime`). Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`. Evidence: `Test Files 43 passed (43)`, `Tests 548 passed (548)`, exit 0, and `npm run typecheck` exit 0, equal to the floor.
- [x] T016 Prove the licence boundary (`$CRATE`). Verify: `cargo metadata --manifest-path $CRATE/Cargo.toml --no-deps --format-version 1 | jq -r '.packages[0].license'` prints `MIT`, `rg -n 'GNU GENERAL PUBLIC LICENSE' $CRATE/src $CRATE/Cargo.toml $CRATE/Cargo.lock` prints nothing, and `rg -n 'openhuman' $CRATE/src` prints only comment lines. The grep covers the code and the manifest and searches for the header text rather than the licence name, because `README.md` and `design/` name the reference's GPL-3.0 licence by design. Evidence: `MIT`, the GPL grep exit 1 with no output, and `rg -n openhuman` over `src` prints no line at all.
- [x] T017 Prove the README's build and run commands (`$CRATE`). Verify: `cargo build --release --manifest-path $CRATE/Cargo.toml` exits 0 and `ls $CRATE/target/release/bots-ui` prints the path. Evidence: the release build finished, `ls` printed the path and `bots-ui --version` printed `bots-ui 0.1.0 contract 1`.
- [x] T018 Prove every design pointer resolves, or skips by name when the gitignored reference folder is absent (`$CRATE/design`). Verify: the block below prints the six names `architecture.md`, `component-inventory.md`, `contracts.md`, `glyph-table.md`, `key-map.md` and `mockups.md` and nothing else on stdout. When `specs/system-skilled-bots/context` is present the loop prints `DANGLING <path>:<line>` for each pointer whose file is missing or too short, so any such line is a failure. When it is absent the block writes one `SKIP context-absent:` line to stderr naming how many pointers it did not check, and checks nothing else. The `ls` is the first guard, because `rg` on a missing design folder reads no input and the loop alone would pass. The loop compares the line against the file's length because `sed -n` past the end of a file exits 0. How to rebuild the folder: `research/context-manifest.md` section 3. Evidence: the six names, then no `DANGLING` line over 31 unique pointers, with the reference folder present.

  ```bash
  ls $CRATE/design
  ctx=specs/system-skilled-bots/context
  if test -d "$ctx"
  then
    rg -o --no-filename "$ctx/[^ :]+:[0-9]+" $CRATE/design | sort -u | while IFS=: read -r p l
    do
      test -f "$p" && test "$l" -le "$(awk 'END{print NR}' "$p")" || printf 'DANGLING %s:%s\n' "$p" "$l"
    done
  else
    n=$(rg -o --no-filename "$ctx/[^ :]+:[0-9]+" $CRATE/design | sort -u | wc -l | tr -d ' ')
    printf 'SKIP context-absent: %s design pointers not checked, see research/context-manifest.md\n' "$n" >&2
  fi
  ```
- [x] T019 Run the eight defect checks and record each result in `goal.md` section 4 (`$CRATE`). Verify: `rg -c '^\| D[1-8] ' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/tasks.md` prints 8, and each row of the Defect Audit table below prints its expected output. Evidence: 8 rows, each printing its expected output, recorded in `goal.md` section 4. D4 runs its amended check, see the note under the table.
- [x] T020 Validate this child (`specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof --strict` prints `RESULT: PASSED`. Evidence: `Errors: 0  Warnings: 0` and `RESULT: PASSED`.
- [x] T021 Run the scripted pseudo-terminal smoke test (`$CRATE/tests/pty_smoke.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --release --test pty_smoke` prints `test result: ok. 1 passed` and names `answers_one_item_in_a_pseudo_terminal`, so the release binary answered one item and the fixture recorded the `answer` argv. The test opens its own pseudo-terminal, so no person and no interactive terminal are needed. Evidence: `test result: ok. 1 passed` naming `answers_one_item_in_a_pseudo_terminal`, and the fixture log held the one `answer --scope once` line.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:defect-audit -->
## Defect Audit

One row per defect the parent's §6 lists, each with the command that proves the fix is present and the output it must print. The grep proves the mechanism exists. The suite proves it behaves, so the pair is the evidence and neither alone is. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:241]

| ID | Defect | Check | Expected |
|----|--------|-------|----------|
| D1 | `1` answers two questions | `rg -n 'enum Context' $CRATE/src/keys.rs` and `rg -n 'KeyMatch::Digit' $CRATE/src/keys.rs` | the context enum, and one `KeyMatch::Digit` row, inside `OVERLAY_ROWS` |
| D2 | Alt+1..4 is unreachable on macOS | `rg -c "Char\('\[" $CRATE/src/keys.rs` and `rg -c "Char\('\]" $CRATE/src/keys.rs` | at least 1 each, the fallback pair |
| D3 | Selection by row index is unsafe | `rg -n 'ItemId' $CRATE/src/state.rs` | the selection field's type |
| D4 | Blocking spawns freeze input | `rg -n 'thread::Builder' $CRATE/src/data.rs` and `rg -n 'Command::new' $CRATE/src` | the worker line, and only `cli.rs` |
| D5 | Bot text is drawn unsanitized | `rg -n 'printable' $CRATE/src/view` and `test ! -e $CRATE/src/sanitize.rs` | at least one call per pane module, and one filter rather than two |
| D6 | An item with no options can only get y/n | `rg -n 'Phase::Typing' $CRATE/src/view/overlay.rs` | at least one line |
| D7 | `?` marks three different states | `rg -n 'scheduled|recurring' $CRATE/src/theme.rs` | two glyph rows |
| D8 | The banner names the wrong key | `rg -n 'pending approval' $CRATE/src/view` and `rg -n 'pending approval.*Ctrl\+P' $CRATE/src/view` | one banner line, and nothing naming `Ctrl+P` |

The D4 check was amended during the build. The worker thread starts through `std::thread::Builder`, which names the thread, so the original `rg -n 'thread::spawn'` printed nothing although the worker exists. The amended `rg -n 'thread::Builder'` prints the worker line at `data.rs:49`.

### Clean-room audit

The clean-room rule keeps the GPL sources out of the briefs of the workers that write the matching modules. A worker that writes `terminal.rs`, `theme.rs`, the overlay keys or the overlay view gets our design files and MIT or Apache references only. The openhuman and tinychannels paths appear in design documents as provenance, never in a worker brief. The orchestrator compares the finished guard and the overlay with the openhuman files by eye and records that it did, because a copied function would carry neither the `openhuman` string nor the GPL header the greps look for.

| ID | Check | Expected |
|----|-------|----------|
| C1 | the C1 block below | comment lines only, each naming the design reference |
| C2 | `rg -c 'Clean-room read' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/goal.md` | 1, the row the orchestrator records the comparison in |

**C1**: the crate's sources name the design reference in comments only.

```bash
rg -n 'openhuman|tinychannels' $CRATE/src
```
<!-- /ANCHOR:defect-audit -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the clean-room read of the guard and the overlay is recorded in `goal.md`. The operator's hand answer stays the acceptance step after the merge
- [x] `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings` and `cargo test` exit 0 in `$CRATE`, `cargo test --release --test pty_smoke` prints `1 passed` and `test -L .opencode/skills` and `test -L .opencode/bin` each exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, whose `External orchestration` section owns the wave table's models, efforts and fallback order
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`, whose section 4 records each wave's verify output
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

- [x] CHK-001 [P0] `ls $CRATE/Cargo.toml` prints the path, so the crate `002` lands exists. Evidence: `ls` printed the path.
- [x] CHK-002 [P0] `ls $CRATE/tests/fixtures/bots` prints the path, so every suite has its payload source. Evidence: `ls` printed the path.
- [x] CHK-003 [P1] `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` prints one line and `rg -c -e "- 'crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml` prints 2, so `002`'s job is in place to read. Evidence: line 128 and `2`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0. Evidence: exit 0.
- [x] CHK-011 [P0] `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0. Evidence: exit 0.
- [x] CHK-012 [P1] `rg -n 'unwrap\(\)|expect\(' $CRATE/src` matches only lines inside `#[cfg(test)]` blocks. Evidence: every match sits after the first `#[cfg(test)]` of its file.
- [x] CHK-013 [P1] `rg -n 'Command::new' $CRATE/src` matches only `cli.rs`. Evidence: `cli.rs:95` alone.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target and no `FAILED`. Evidence: every target `ok`, no `FAILED`.
- [x] CHK-021 [P0] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`. Evidence: 43 files, 548 passed.
- [x] CHK-022 [P0] Each of the eight Defect Audit rows prints its expected output. Evidence: all eight, see `goal.md` section 4.
- [x] CHK-023 [P1] `cargo test --manifest-path $CRATE/Cargo.toml --doc` prints `test result: ok`, so a doc example that fails is a gate failure rather than a silent skip. Evidence: `test result: ok. 0 passed`.
- [x] CHK-024 [P0] `cargo test --manifest-path $CRATE/Cargo.toml --release --test pty_smoke` prints `test result: ok. 1 passed` and names `answers_one_item_in_a_pseudo_terminal`, so the release binary answered one item in a pseudo-terminal. Evidence: `1 passed` three times.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `rg -n 'GNU GENERAL PUBLIC LICENSE' $CRATE/src $CRATE/Cargo.toml $CRATE/Cargo.lock` prints nothing, so no file the crate ships that carries code carries the design reference's licence header. Evidence: no output, exit 1.
- [x] CHK-031 [P0] `cargo metadata --manifest-path $CRATE/Cargo.toml --no-deps --format-version 1 | jq -r '.packages[0].license'` prints `MIT`. Evidence: `MIT`.
- [x] CHK-032 [P1] `rg -n 'env::var' $CRATE/src` matches nothing outside `#[cfg(test)]` blocks, so the shipped binary reads no environment variable of its own. Evidence: no match outside a test block.
- [x] CHK-033 [P1] `rg -n 'read_to_string|File::open|fs::read' $CRATE/src` matches nothing outside `#[cfg(test)]` blocks, so the shipped binary opens no state file. Evidence: no match outside a test block.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints one line. Evidence: line 33 alone.
- [x] CHK-041 [P1] `rg -n 'openhuman' $CRATE/README.md` prints one line and `rg -n 'no code' $CRATE/README.md` prints one line. Evidence: one line each.
- [x] CHK-042 [P1] `rg -n 'ASCII' $CRATE/README.md` prints one line, so the fallback set is documented beside the glyphs. Evidence: one line.
- [x] CHK-043 [P2] `rg -n 'bots ui' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/*.md` names the verb in `spec.md`, `plan.md` and `tasks.md`. Evidence: `spec.md` 5, `plan.md` 3, `tasks.md` 6.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] `git status --porcelain $CRATE` lists only source, tests, fixtures, `Cargo.toml`, `Cargo.lock`, `README.md` and `design/`, and no `target/`. Evidence: only source, tests, the fixture and `README.md`, no `target/`.
- [x] CHK-051 [P1] `git check-ignore -v $CRATE/target/release/bots-ui` prints the `/crates/bots-tui/target/` line. Evidence: `.gitignore:63:/crates/bots-tui/target/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-28
<!-- /ANCHOR:summary -->

---
