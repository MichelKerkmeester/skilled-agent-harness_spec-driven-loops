---
title: "Tasks: Phase 2: architecture-and-contracts"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "architecture and contracts tasks"
  - "bots-tui crate tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: architecture-and-contracts

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

Every `Verify:` clause runs without a tty. The loop takes its events from a source the caller supplies, so a closed input and an Esc are lib tests rather than keystrokes, and the guard's restore is driven through `catch_unwind` rather than a real terminal.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the measured gap before any edit (`.skilled/bin/bots.cjs`). Verify: `$BOTS ui` prints `bots: unknown verb: ui` and exits 2.
- [ ] T002 Confirm the toolchain (none). Verify: `cargo --version` prints `cargo 1.92.0`, and `cargo clippy --version` and `cargo fmt --version` each exit 0.
- [ ] T003 Read the four `--json` shapes and record the fixture baseline (none). Verify: `$BOTS status --json` exits 0 and prints a `rows` key, and `rg -n 'REQ-002|REQ-003' specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md` prints the activity and inbox row shapes.
- [ ] T004 Create the crate manifest with `license = "MIT"`, the `bots-ui` binary, the library target and the six dependencies including `libc` (`$CRATE/Cargo.toml`). Verify: `cargo metadata --manifest-path $CRATE/Cargo.toml --no-deps --format-version 1` exits 0 and prints `"name":"bots-tui"`.
- [ ] T005 Ignore the crate's build output (`.gitignore`). Verify: `git check-ignore -v $CRATE/target/release/bots-ui` prints the `/crates/bots-tui/target/` line.
- [ ] T006 Create the crate skeleton: the library root with one `pub mod` line per module, the binary that calls it, and one stub file per module (`$CRATE/src/lib.rs`, `$CRATE/src/main.rs`, `$CRATE/src/model.rs`, `$CRATE/src/cli.rs`, `$CRATE/src/state.rs`, `$CRATE/src/event.rs`, `$CRATE/src/data.rs`, `$CRATE/src/terminal.rs`, `$CRATE/src/app.rs`, `$CRATE/src/keys.rs`, `$CRATE/src/theme.rs`, `$CRATE/src/view/mod.rs`). `keys.rs` is complete except its rows: every type in `design/architecture.md` section 1.9, `rows`, `resolve` and `palette_entries`, with `SHELL_ROWS`, `LIST_ROWS` and `OVERLAY_ROWS` empty. Verify: `cargo build --release --manifest-path $CRATE/Cargo.toml` exits 0, `ls $CRATE/target/release/bots-ui` prints the path, `cargo test --manifest-path $CRATE/Cargo.toml --lib` exits 0, and `cargo test --manifest-path $CRATE/Cargo.toml --lib keys` names `resolve_walks_the_context_stack` and `digit_row_returns_the_pressed_digit`.
- [ ] T007 Commit the resolved dependency graph (`$CRATE/Cargo.lock`). Verify: `git ls-files $CRATE/Cargo.lock` prints the path and `rg -c 'name = "ratatui"' $CRATE/Cargo.lock` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T008 Write the model: serde types with a default for every optional key, and an unknown state kept as `Unknown(raw)` (`$CRATE/src/model.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib model` prints `test result: ok` and names `missing_key_takes_default` and `unknown_state_keeps_raw`.
- [ ] T009 Write the CLI client, the only module that spawns a process, taking the program and its arguments from its caller, defaulting to `node` plus `<skilled-tree>/.skilled/bin/bots.cjs`, and running every child with stdin null and no `--as` (`$CRATE/src/cli.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib cli` prints `test result: ok` and names `program_defaults_to_node_and_bots_cjs`, `answer_argv_carries_scope`, `child_stdin_is_null` and `argv_never_carries_as`.
- [ ] T010 Write the fixture script that answers `status`, `activity`, `inbox` and `routines` by printing the files in `$CRATE/tests/fixtures/payloads/`, copied from `design/payloads/`, its `status --json` carrying the `lastRun.branch` and `lastRun.worktreePath` keys 004 adds, taking `--fixture-log <path>` and `--fixture-scenario <name>` as leading arguments, and covering a good read, an empty payload, a read failure, a refusal by name, a slow child and a warning on stderr, committed mode 0755 (`$CRATE/tests/fixtures/bots`, `$CRATE/tests/fixtures/payloads/`). Verify: `bash $CRATE/tests/fixtures/bots status --json | jq -e '.rows'` exits 0, `bash $CRATE/tests/fixtures/bots status --json | jq -e '.rows[0].lastRun | has("branch") and has("worktreePath")'` exits 0, `bash $CRATE/tests/fixtures/bots activity --json | jq -e '.groups'` exits 0, `bash $CRATE/tests/fixtures/bots inbox --json | jq -e '.items'` exits 0, `bash $CRATE/tests/fixtures/bots routines --json | jq -e '.routines | type == "array"'` exits 0, `bash $CRATE/tests/fixtures/bots --fixture-log "$(mktemp)" --fixture-scenario empty status --json | jq -e '.rows | length == 0'` exits 0, and `git ls-files -s $CRATE/tests/fixtures/bots` prints `100755`.
- [ ] T011 Write the client's integration test against the fixture: the four reads, the one write and a non-zero exit, each with its own temp log and scenario through `tests/common/` (`$CRATE/tests/cli_client.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test cli_client` prints `test result: ok` and names `non_zero_exit_carries_stderr`, and the fixture's argv log carries `answer --scope once --repo <repo> -- <id> hold` and `answer --scope deny --repo <repo> -- <id> deny`. Every no-write test first asserts that the same log recorded the reads. The test builds the fixture path from `env!("CARGO_MANIFEST_DIR")`, so it resolves from the crate directory cargo runs tests in.
- [ ] T012 Write the pure reducer `update(state, msg) -> Vec<Effect>` with the effects `Fetch`, `Answer { id, text, scope }` and `Quit`, a `Remote<T>` per surface with its generation, and a `PaneView` per pane keyed by its row key (`$CRATE/src/state.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib state` prints `test result: ok` and names `esc_produces_no_answer_effect`, `selection_is_a_row_key_per_pane`, `stale_generation_is_dropped`, `answered_issues_no_fetch`, `outcome_word_survives_an_older_read`, `refresh_issues_at_most_three_fetches`, `in_flight_surface_is_not_fetched_twice` and `failed_fetch_keeps_rows`.
- [ ] T013 Write the event source the caller supplies, yielding a key, a paste, a resize and a closed input, a bracketed paste as one `Msg::Paste` (`$CRATE/src/event.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib event` prints `test result: ok` and names `closed_input_is_one_event` and `paste_is_one_event`.
- [ ] T014 Write the worker thread and the generation-tagged channel, so no process is spawned on the loop thread, an answer jumps queued reads and a child past its timeout is killed (`$CRATE/src/data.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib data` prints `test result: ok` and names `answer_jumps_queued_reads`, `child_past_timeout_is_killed` and `loop_thread_spawns_nothing`.
- [ ] T015 Write the terminal guard: raw mode, the alternate screen and bracketed paste on, one restore on `Drop` that turns all three off, and a restore chained in front of the process panic hook (`$CRATE/src/terminal.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib terminal` prints `test result: ok` and names `restore_runs_on_exit` and `restore_runs_on_panic`.
- [ ] T016 Write the loop: take an event from the source, reduce it, hand the effects to the worker, and draw one empty frame (`$CRATE/src/app.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib app` prints `test result: ok` and names `closed_input_writes_nothing` and `empty_frame_draws`.
- [ ] T017 Complete the library root: argument parsing, the guard, the loop entry, then reduce the binary to a call into it (`$CRATE/src/lib.rs`, `$CRATE/src/main.rs`). Verify: `cargo build --release --manifest-path $CRATE/Cargo.toml` exits 0 and `cargo test --manifest-path $CRATE/Cargo.toml --lib` prints `test result: ok`, `$CRATE/target/release/bots-ui --version` prints one line ending ` contract 1`, and `cargo test --manifest-path $CRATE/Cargo.toml --lib args` names `version_flag_prints_the_contract`, `mono_flag_selects_mono` and `ascii_flag_selects_the_ascii_glyphs`.
- [ ] T018 Add the `ui` verb: usage line, verb spec, binary resolution, the contract check, exec, exit passthrough, the `--mono` and `--ascii` pass-through and the three refusals (`.skilled/bin/bots.cjs`). Verify: `T=$(mktemp -d); $BOTS ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-unavailable`. `mkdir -p "$T/crates/bots-tui"; $BOTS ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-not-built` with `build it with cargo build --release --manifest-path crates/bots-tui/Cargo.toml`. The `--mono`, `--ascii` and `ui-contract-mismatch` cases are proven by T019's vitest cases, which read the stub's recorded argv and its `--version` line rather than a binary that prints nothing.
- [ ] T019 Write the verb's tests under one `describe('bots ui')` block: argv, exit passthrough, the `--mono` pass-through under `NO_COLOR`, the `--ascii` pass-through, the `ui-unavailable` refusal for an absent crate, the `ui-not-built` refusal for an absent binary, the `ui-contract-mismatch` refusal for a stub whose `--version` names another contract number, and the exit 2 for an unknown option, each against a temp `--skilled-tree` and a stub binary named by `BOTS_UI_BIN` (`.skilled/skills/system-skilled-bots/runtime/tests/cli-ui.vitest.ts`). The eight test names are `passes the resolved repo and the skilled tree`, `passes the binary's exit code through`, `passes --mono under NO_COLOR`, `passes --ascii when asked`, `refuses ui-unavailable for an absent crate`, `refuses ui-not-built for an absent binary`, `refuses ui-contract-mismatch for another contract number` and `exits 2 on an unknown option`. Verify: `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-ui.vitest.ts -t "^bots ui " )` prints `Tests  8 passed` and no `failed`, and the whole-file run `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-ui.vitest.ts)` prints no `failed` as the second check.
- [ ] T020 Add the `bots-tui` job, its commit-pinned toolchain, the four path entries, `--locked` on `cargo clippy`, `cargo test` and `cargo build` with none on `cargo fmt --check`, a release build, the two design `diff` checks and a named runner, cache and timeout (`.github/workflows/bots-runtime.yml`). Verify: `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` prints one line, `rg -c -e "- 'crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml` prints 2, and `rg -c -e "- 'specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/00[12]-[a-z-]*/design/\*\*'" .github/workflows/bots-runtime.yml` prints 2, so an edit to a packet design copy runs the job. `rg -n 'dtolnay/rust-toolchain' .github/workflows/bots-runtime.yml` prints the toolchain step with `clippy` and `rustfmt`, and `awk '/^  bots-tui:/,0' .github/workflows/bots-runtime.yml | rg -c 'uses: [^ ]+@v[0-9]'` prints nothing and exits 1, so every action in the job is pinned by commit rather than by a tag. `rg -n 'cargo test' .github/workflows/bots-runtime.yml` prints the test step, `rg -n -e '--locked' .github/workflows/bots-runtime.yml` prints the cargo steps, `rg -n 'cargo build --release' .github/workflows/bots-runtime.yml` prints the release build, and `awk '/^  bots-tui:/,0' .github/workflows/bots-runtime.yml | rg -c 'runs-on|timeout-minutes|actions/cache'` prints 3, which holds because the `bots-tui` job is appended as the file's last job, and `awk '/^  bots-tui:/,0' .github/workflows/bots-runtime.yml | rg -c 'diff '` prints at least 2.
- [ ] T028 Copy 001's four design documents and this child's `architecture.md` and `contracts.md` into the crate unchanged (`$CRATE/design/mockups.md`, `$CRATE/design/key-map.md`, `$CRATE/design/glyph-table.md`, `$CRATE/design/component-inventory.md`, `$CRATE/design/architecture.md`, `$CRATE/design/contracts.md`). Verify: `ls $CRATE/design` prints the six names, `diff -r -x architecture.md -x contracts.md specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design $CRATE/design` prints nothing, and `diff specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md $CRATE/design/architecture.md` and the same for `contracts.md` print nothing.
- [ ] T029 Install the signal handler that sets a flag, and the event source read that turns it into `Terminate` (`$CRATE/src/terminal.rs`, `$CRATE/src/event.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib terminal` prints `test result: ok` and names `signal_becomes_terminate_event`, which raises the signal through the handler and asserts the loop returns 128 plus the signal.
- [ ] T030 Write the two test helpers every later child shares: the frame loader that reads a frame from `design/mockups.md` by its heading and its size, and the fixture helper that builds a `Program` with a temp log and a scenario (`$CRATE/tests/common/mod.rs`, `$CRATE/tests/common/frames.rs`, `$CRATE/tests/common/fixture.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test cli_client` prints `test result: ok` and names `frame_loader_reads_frame_1`, which loads frame 1 at 80x24 and asserts its first body line is `Activity · 7 groups · 10 rows`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Run the formatter check (`$CRATE`). Verify: `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0.
- [ ] T022 Run the linter with warnings denied (`$CRATE`). Verify: `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] T023 Run the crate suite (`$CRATE`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target and no `FAILED`.
- [ ] T024 Run the runtime suite, including the new verb tests (`.skilled/skills/system-skilled-bots/runtime`). Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`.
- [ ] T025 Prove no openhuman code was copied (`$CRATE`). Verify: `rg -n 'openhuman' $CRATE/src` prints only comment lines, and `rg -n 'GNU GENERAL PUBLIC LICENSE' $CRATE/src $CRATE/Cargo.toml $CRATE/Cargo.lock` prints nothing, so the licence-header grep covers the code and the manifest rather than the design folder, which names the reference and its licence on purpose.
- [ ] T026 Prove the two refusals a bare `--skilled-tree` can reach from the CLI, which is the handoff evidence 003 needs (`.skilled/bin/bots.cjs`). Verify: `T=$(mktemp -d); $BOTS ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-unavailable`. `mkdir -p "$T/crates/bots-tui"; $BOTS ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-not-built`. The exit passthrough and the `ui-contract-mismatch` refusal are proven by T019's vitest cases, whose stub answers `--version` with the verb's own contract number before it records its argv and exits 7.
- [ ] T027 Validate the packet (`specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:waves -->
## Waves

The build runs as eight waves. A lane is the unit of parallelism and two lanes never hold the same file, so a wave's worker count is the number of lanes whose file sets are disjoint. `plan.md` §External orchestration holds the executor table, the tier rule, the parallelism rule and the fallback ladder. This section applies them to these task ids.

Every lane's primary is `cli-mistral-vibe` at `deepseek-flash`, which runs at its fixed `max`. The fallback ladder is the same for every wave: `cli-mistral-vibe`, then `cli-pi`, then `cli-opencode`, then `cli-devin`, then `cli-codex`, keeping the lane's fallback tier. A Vibe-hosted orchestrator skips the `cli-mistral-vibe` rung, because that mode refuses to load when `VIBE_SESSION=1` is set, and a Vibe `429` or `402` moves the lane to `cli-pi` rather than a Vibe retry. Each wave's **Fallback** line names the rung its executor moves to first.

### Wave 1 - Setup probes and the manifest

| Lane | Tasks | Executor · model · effort | Files held |
|------|-------|---------------------------|------------|
| A | T001, T002, T003 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | none, three read-only probes |
| B | T004, T005 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `crates/bots-tui/Cargo.toml`, `.gitignore` |

**Workers:** 2. **Verify:** `cargo metadata --manifest-path crates/bots-tui/Cargo.toml --no-deps --format-version 1` exits 0 and prints `"name":"bots-tui"`. `git check-ignore -v crates/bots-tui/target/release/bots-ui` prints the `/crates/bots-tui/target/` line. `node .skilled/bin/bots.cjs ui` still exits 2. **Fallback:** `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max`, because a Vibe row cannot be lowered below `max` and the replacement must not be either.

### Wave 2 - Crate skeleton

| Lane | Tasks | Executor · model · effort | Files held |
|------|-------|---------------------------|------------|
| A | T006, T007 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `crates/bots-tui/src/lib.rs`, `crates/bots-tui/src/main.rs`, the ten module stubs, `crates/bots-tui/Cargo.lock` |

**Workers:** 1, because the lane writes the library root every later module task is declared from. **Verify:** `cargo build --release --manifest-path crates/bots-tui/Cargo.toml` exits 0. `ls crates/bots-tui/target/release/bots-ui` prints the path. `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib` exits 0. `git ls-files crates/bots-tui/Cargo.lock` prints the path. **Fallback:** `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max`.

### Wave 3 - The dependency-free modules, the fixture and the design copy

| Lane | Tasks | Executor · model · effort | Files held |
|------|-------|---------------------------|------------|
| A | T008 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `high` | `crates/bots-tui/src/model.rs` |
| B | T013 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `crates/bots-tui/src/event.rs` |
| C | T015 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `crates/bots-tui/src/terminal.rs` |
| D | T010 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `high` | `crates/bots-tui/tests/fixtures/bots`, `crates/bots-tui/tests/fixtures/payloads/` |
| E | T028 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `crates/bots-tui/design/` |

**Workers:** 5. Lane A falls back at `high` because the model mirrors a payload the fixture already fixes. Lane C falls back at `max` because the guard and the panic hook are the two places a mistake costs a terminal. Lane E is a copy, so it falls back to the cheapest rung. **Verify:** `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib model` names `unknown_state_keeps_raw`. `--lib event` names `closed_input_is_one_event`. `--lib terminal` names `restore_runs_on_exit` and `restore_runs_on_panic`. The six `jq` checks on the fixture exit 0 and `git ls-files -s crates/bots-tui/tests/fixtures/bots` prints `100755`. `ls crates/bots-tui/design` prints the six names, `diff -r -x architecture.md -x contracts.md specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design crates/bots-tui/design` prints nothing, and `diff` of each of `architecture.md` and `contracts.md` against `002-architecture-and-contracts/design/` prints nothing. **Fallback:** lanes A and D to `cli-pi` · `--thinking high`, lanes B, C and E to `cli-pi` · `--thinking max`.

### Wave 4 - The process boundary and the reducer

| Lane | Tasks | Executor · model · effort | Files held |
|------|-------|---------------------------|------------|
| A | T009 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `crates/bots-tui/src/cli.rs` |
| B | T012 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `crates/bots-tui/src/state.rs` |

**Workers:** 2, both falling back at `max` because each is a seam every later child reads through: `cli.rs` is the only process boundary and `state.rs` is the only place an answer is decided. T029 is not here: its test asserts the loop's exit code, and `app.rs` lands in wave 6. **Verify:** `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib cli` names `program_defaults_to_node_and_bots_cjs`. `--lib state` names `esc_produces_no_answer_effect` and `stale_generation_is_dropped`. **Fallback:** `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max`.

### Wave 5 - The worker data layer and the client test

| Lane | Tasks | Executor · model · effort | Files held |
|------|-------|---------------------------|------------|
| A | T014 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `crates/bots-tui/src/data.rs` |
| B | T011 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `high` | `crates/bots-tui/tests/cli_client.rs` |
| C | T030 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `high` | `crates/bots-tui/tests/common/` |

**Workers:** 3. Lane A falls back at `max` because the generation channel is the fix for the measured freeze. Lanes B and C fall back at `high` because they mirror the fixture's argv log and the frames the design already draws. Lane B declares `mod common;` and lane C writes the module it names, so the two hold different files and the wave's verify compiles both. **Verify:** `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib data` names `answer_jumps_queued_reads`, `child_past_timeout_is_killed` and `loop_thread_spawns_nothing`. `--test cli_client` prints `test result: ok`, names `frame_loader_reads_frame_1` and the argv log carries the four reads and the one write. **Fallback:** `cli-pi` · `--thinking max` for lane A, `cli-pi` · `--thinking high` for lanes B and C.

### Wave 6 - The loop and the signal path

| Lane | Tasks | Executor · model · effort | Files held |
|------|-------|---------------------------|------------|
| A | T016 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `crates/bots-tui/src/app.rs` |
| B | T029 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `crates/bots-tui/src/terminal.rs`, `crates/bots-tui/src/event.rs` |

**Workers:** 2. Lane A is the packet's hardest task: the loop is where a closed input must write nothing, where a stale generation must be dropped and where the empty frame is drawn. Vibe runs it at its fixed `max`, and `cli-codex` at `xhigh` stays its last rung. Lane B follows wave 3's lane C on the same two files, so the two never run at once, and it sits here rather than in wave 4 because its test asserts the loop's exit code and `app.rs` is lane A's. **Verify:** `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib app` prints `test result: ok` and names `closed_input_writes_nothing` and `empty_frame_draws`. `--lib terminal` names `signal_becomes_terminate_event`. **Fallback:** lane A to `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max`, then `cli-opencode` · `#max`, then `cli-devin` · `deepseek-v4-1-flash-max` after a read-only probe, then `cli-codex` · `gpt-6-luna` · `xhigh` · `fast`. Lane B to `cli-pi` · `--thinking max`.

### Wave 7 - The library root, the verb, the verb tests and the CI job

| Lane | Tasks | Executor · model · effort | Files held |
|------|-------|---------------------------|------------|
| A | T017 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `crates/bots-tui/src/lib.rs`, `crates/bots-tui/src/main.rs` |
| B | T018 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `.skilled/bin/bots.cjs` |
| C | T019 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `high` | `.skilled/skills/system-skilled-bots/runtime/tests/cli-ui.vitest.ts` |
| D | T020 | `cli-mistral-vibe` · `deepseek-flash` · `max (fixed)`, fallback at `max` | `.github/workflows/bots-runtime.yml` |

**Workers:** 4. Lane C is written against REQ-001's wording rather than against lane B's code, so the two run at once and the wave's verify is what proves they agree. **Verify:** `cargo build --release --manifest-path crates/bots-tui/Cargo.toml` exits 0. `T=$(mktemp -d); node .skilled/bin/bots.cjs ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-unavailable`, and the same command after `mkdir -p "$T/crates/bots-tui"` exits 4 and prints `ui-not-built`. The `--mono`, `--ascii` and `ui-contract-mismatch` cases are proven by `cli-ui.vitest.ts`, which reads the stub's recorded argv and its `--version` line. `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-ui.vitest.ts` prints no `failed`. `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` prints one line and `rg -c -e "- 'crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml` prints 2, `rg -n 'dtolnay/rust-toolchain@1.92.0' .github/workflows/bots-runtime.yml` prints the toolchain step, and `rg -n -e '--locked' .github/workflows/bots-runtime.yml` prints the cargo steps. **Fallback:** lanes A, B and D to `cli-pi` · `--thinking max`, lane C to `cli-pi` · `--thinking high`.

### Wave 8 - Verification gates

| Lane | Tasks | Executor · model · effort | Files held |
|------|-------|---------------------------|------------|
| Orchestrator | T021, T022, T023, T024, T025, T026, T027 | none, the orchestrator runs them itself | none |

**Workers:** 0. Every task in this wave is a command whose output the orchestrator reads, so no worker is dispatched and no file is written. **Verify:** `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0. `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0. `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target. `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints no `failed`. `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines. `ls crates/bots-tui/design` prints the six names, `diff -r -x architecture.md -x contracts.md specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design crates/bots-tui/design` prints nothing, and `diff` of each of `architecture.md` and `contracts.md` against `002-architecture-and-contracts/design/` prints nothing. The two refusals exit 4 and `npx vitest run tests/cli-ui.vitest.ts` prints no `failed`. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts --strict` prints `RESULT: PASSED`. **Fallback:** none. A gate that fails is repaired in the wave that owns the file, not re-dispatched to another executor.
<!-- /ANCHOR:waves -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every wave's verify step was run and its output read
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target, `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` prints one line and `rg -c -e "- 'crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml` prints 2, and `ls crates/bots-tui/design` prints the six names with `diff -r -x architecture.md -x contracts.md specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design crates/bots-tui/design` printing nothing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, whose §External orchestration holds the executor table and the fallback ladder
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent decisions**: See `../decision-record.md`
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

A blocked task is marked `[B]` with the reason on the same line, and the wave it belongs to does not hand its files to the next wave.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `node .skilled/bin/bots.cjs ui` prints `bots: unknown verb: ui` and exits 2 before the verb is added.
- [ ] CHK-002 [P0] `cargo build --release --manifest-path crates/bots-tui/Cargo.toml` exits 0.
- [ ] CHK-003 [P1] `node .skilled/bin/bots.cjs status --json` exits 0 and prints a `rows` key.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] CHK-011 [P0] `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0.
- [ ] CHK-012 [P1] `rg -n 'unwrap\(\)|expect\(' crates/bots-tui/src` matches only lines inside `#[cfg(test)]` blocks.
- [ ] CHK-013 [P1] `rg -n 'Command::new' crates/bots-tui/src` matches only `cli.rs`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target.
- [ ] CHK-021 [P0] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test cli_client` covers the four reads, the one write and a non-zero exit.
- [ ] CHK-022 [P1] `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib closed_input` covers the closed input, and `--lib terminal` covers the restore on exit and on panic.
- [ ] CHK-023 [P1] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` passes, including `cli-ui.vitest.ts`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] `rg -n 'env::var' crates/bots-tui/src` matches nothing outside `#[cfg(test)]` blocks, so the shipped binary reads no environment variable of its own. `std::env::args` is the one `std::env` call, for argument parsing.
- [ ] CHK-031 [P0] `rg -n 'read_to_string|File::open|fs::read' crates/bots-tui/src` matches nothing outside `#[cfg(test)]` blocks, so the shipped binary opens no state file. The one test that reads the fixture's argv log is a `#[cfg(test)]` module in `src/app.rs`.
- [ ] CHK-032 [P1] The answer text reaches the runtime only through `bots answer`, which refuses a secret literal before it stores the answer.
- [ ] CHK-033 [P1] `rg -n 'NO_COLOR' .skilled/bin/bots.cjs` prints the read that selects `--mono`, and `rg -n 'NO_COLOR' crates/bots-tui/src` prints nothing, so the palette is chosen by a flag and the binary stays environment-free.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `rg -n 'bots ui' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/*.md` names the verb in `spec.md`, `plan.md` and `tasks.md`.
- [ ] CHK-041 [P1] `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines that name the design reference.
- [ ] CHK-042 [P2] The crate README is 006's task, so this packet writes none and `ls crates/bots-tui/README.md` fails here by design.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] `git status --porcelain crates/bots-tui` lists only source, tests, fixtures, `Cargo.toml`, `Cargo.lock` and no `target/`.
- [ ] CHK-051 [P1] `git check-ignore -v crates/bots-tui/target/release/bots-ui` prints the `/crates/bots-tui/target/` line.
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
