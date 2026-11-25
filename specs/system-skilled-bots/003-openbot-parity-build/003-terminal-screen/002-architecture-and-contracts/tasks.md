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
- [ ] T006 Create the crate skeleton: the library root with one `pub mod` line per module, the binary that calls it, and one stub file per module (`$CRATE/src/lib.rs`, `$CRATE/src/main.rs`, `$CRATE/src/model.rs`, `$CRATE/src/cli.rs`, `$CRATE/src/state.rs`, `$CRATE/src/event.rs`, `$CRATE/src/data.rs`, `$CRATE/src/terminal.rs`, `$CRATE/src/app.rs`). Verify: `cargo build --release --manifest-path $CRATE/Cargo.toml` exits 0, `ls $CRATE/target/release/bots-ui` prints the path, and `cargo test --manifest-path $CRATE/Cargo.toml --lib` exits 0.
- [ ] T007 Commit the resolved dependency graph (`$CRATE/Cargo.lock`). Verify: `git ls-files $CRATE/Cargo.lock` prints the path and `rg -c 'name = "ratatui"' $CRATE/Cargo.lock` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T008 Write the model: serde types with a default for every optional key, and an unknown state kept as `Unknown(raw)` (`$CRATE/src/model.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib model` prints `test result: ok` and names `missing_key_takes_default` and `unknown_state_keeps_raw`.
- [ ] T009 Write the CLI client, the only module that spawns a process, taking the program and its arguments from its caller, defaulting to `node` plus `<skilled-tree>/.skilled/bin/bots.cjs`, and running every child with stdin null and no `--as` (`$CRATE/src/cli.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib cli` prints `test result: ok` and names `program_defaults_to_node_and_bots_cjs`, `answer_argv_carries_scope`, `child_stdin_is_null` and `argv_never_carries_as`.
- [ ] T010 Write the fixture script that answers `status`, `activity`, `inbox` and `routines` with the payloads phases 001 and 002 of the parent build ship, its `status --json` carrying the `lastRun.branch` and `lastRun.worktreePath` keys 004 adds, and records its argv, committed mode 0755 (`$CRATE/tests/fixtures/bots`). Verify: `bash $CRATE/tests/fixtures/bots status --json | jq -e '.rows'` exits 0, `bash $CRATE/tests/fixtures/bots status --json | jq -e '.rows[0].lastRun | has("branch") and has("worktreePath")'` exits 0, `bash $CRATE/tests/fixtures/bots activity --json | jq -e '.groups'` exits 0, `bash $CRATE/tests/fixtures/bots inbox --json | jq -e '.items'` exits 0, `bash $CRATE/tests/fixtures/bots routines --json | jq -e 'type == "array"'` exits 0, and `git ls-files -s $CRATE/tests/fixtures/bots` prints `100755`.
- [ ] T011 Write the client's integration test against the fixture: the four reads, the one write and a non-zero exit (`$CRATE/tests/cli_client.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test cli_client` prints `test result: ok` and names `non_zero_exit_carries_stderr`, and the fixture's argv log carries `answer <id> hold --scope once` and `answer <id> deny --scope deny`. The test builds the fixture path from `env!("CARGO_MANIFEST_DIR")`, so it resolves from the crate directory cargo runs tests in.
- [ ] T012 Write the pure reducer `update(state, msg) -> Vec<Effect>` with the effects `Fetch` and `Answer { id, text, scope }`, a `Remote<T>` per surface and an `Option<ItemId>` selection (`$CRATE/src/state.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib state` prints `test result: ok` and names `esc_produces_no_answer_effect`, `selection_is_an_item_id`, `refresh_issues_at_most_three_fetches`, `in_flight_surface_is_not_fetched_twice` and `failed_fetch_keeps_rows`.
- [ ] T013 Write the event source the caller supplies, yielding a key, a resize and a closed input (`$CRATE/src/event.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib event` prints `test result: ok` and names `closed_input_is_one_event`.
- [ ] T014 Write the worker thread and the generation-tagged channel, so no process is spawned on the loop thread and a stale result is dropped (`$CRATE/src/data.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib data` prints `test result: ok` and names `stale_generation_is_dropped` and `loop_thread_spawns_nothing`.
- [ ] T015 Write the terminal guard: raw mode and the alternate screen on, one restore on `Drop`, and a restore chained in front of the process panic hook (`$CRATE/src/terminal.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib terminal` prints `test result: ok` and names `restore_runs_on_exit` and `restore_runs_on_panic`.
- [ ] T016 Write the loop: take an event from the source, reduce it, hand the effects to the worker, and draw one empty frame (`$CRATE/src/app.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib app` prints `test result: ok` and names `closed_input_writes_nothing` and `empty_frame_draws`.
- [ ] T017 Complete the library root: argument parsing, the guard, the loop entry, then reduce the binary to a call into it (`$CRATE/src/lib.rs`, `$CRATE/src/main.rs`). Verify: `cargo build --release --manifest-path $CRATE/Cargo.toml` exits 0 and `cargo test --manifest-path $CRATE/Cargo.toml --lib` prints `test result: ok`.
- [ ] T018 Add the `ui` verb: usage line, verb spec, binary resolution, exec, exit passthrough, the `--mono` and `--ascii` pass-through and the two refusals (`.skilled/bin/bots.cjs`). Verify: `T=$(mktemp -d); $BOTS ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-unavailable`; `mkdir -p "$T/crates/bots-tui"; $BOTS ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-not-built` with `build it with cargo build --release --manifest-path crates/bots-tui/Cargo.toml`. The `--mono` and `--ascii` pass-through is proven by T019's vitest case, which reads the stub's recorded argv rather than a binary that prints nothing.
- [ ] T019 Write the verb's tests: argv, exit passthrough, the `--mono` pass-through under `NO_COLOR`, the `--ascii` pass-through, the `ui-unavailable` refusal for an absent crate and the `ui-not-built` refusal for an absent binary, each against a temp `--skilled-tree` and a stub binary named by `BOTS_UI_BIN` (`.skilled/skills/system-skilled-bots/runtime/tests/cli-ui.vitest.ts`). Verify: `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-ui.vitest.ts` prints `cli-ui.vitest.ts` and no `failed`.
- [ ] T020 Add the `bots-tui` job, its pinned toolchain and the two path entries (`.github/workflows/bots-runtime.yml`). Verify: `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` prints one line and `rg -c -e "- 'crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml` prints 2, `rg -n 'dtolnay/rust-toolchain@1.92.0' .github/workflows/bots-runtime.yml` prints the toolchain step with `clippy` and `rustfmt`, `rg -n 'dtolnay/rust-toolchain@stable' .github/workflows/bots-runtime.yml` prints nothing, and `rg -n 'cargo test' .github/workflows/bots-runtime.yml` prints the test step.
- [ ] T028 Copy 001's four design documents into the crate unchanged (`$CRATE/design/mockups.md`, `$CRATE/design/key-map.md`, `$CRATE/design/glyph-table.md`, `$CRATE/design/component-inventory.md`). Verify: `ls $CRATE/design` prints the four names and `diff -r specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design $CRATE/design` prints nothing.
- [ ] T029 Install the signal handler: `SIGTERM` and `SIGHUP` run the same restore the guard's `Drop` runs, so a killed process leaves a usable terminal (`$CRATE/src/terminal.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib terminal` prints `test result: ok` and names `restore_runs_on_signal`, which raises the signal through the handler and asserts the restore ran.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Run the formatter check (`$CRATE`). Verify: `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0.
- [ ] T022 Run the linter with warnings denied (`$CRATE`). Verify: `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] T023 Run the crate suite (`$CRATE`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target and no `FAILED`.
- [ ] T024 Run the runtime suite, including the new verb tests (`.skilled/skills/system-skilled-bots/runtime`). Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`.
- [ ] T025 Prove no openhuman code was copied (`$CRATE`). Verify: `rg -n 'openhuman' $CRATE/src` prints only comment lines, and `rg -n 'GNU GENERAL PUBLIC LICENSE' $CRATE/src $CRATE/Cargo.toml $CRATE/Cargo.lock` prints nothing, so the licence-header grep covers the code and the manifest rather than the design folder, which names the reference and its licence on purpose.
- [ ] T026 Prove the two refusals and the exit passthrough from the CLI, which is the handoff evidence 003 needs (`.skilled/bin/bots.cjs`). Verify: `T=$(mktemp -d); $BOTS ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-unavailable`; `mkdir -p "$T/crates/bots-tui"; $BOTS ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-not-built`; `BOTS_UI_BIN=/bin/true $BOTS ui --repo .` exits 0, and `BOTS_UI_BIN=/bin/false $BOTS ui --repo .` exits 1.
- [ ] T027 Validate the packet (`specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:waves -->
## Waves

The build runs as eight waves. A lane is the unit of parallelism and two lanes never hold the same file, so a wave's worker count is the number of lanes whose file sets are disjoint. `plan.md` §External orchestration holds the executor table, the tier rule, the parallelism rule and the fallback ladder; this section applies them to these task ids.

The fallback ladder is the same for every wave: `cli-pi`, then `cli-opencode`, then `cli-mistral-vibe`, then `cli-devin`, then `cli-codex`, keeping the wave's effort tier. A Vibe-hosted orchestrator skips the `cli-mistral-vibe` rung, because that mode refuses to load when `VIBE_SESSION=1` is set. Each wave's **Fallback** line names the rung its executor moves to first.

### Wave 1 - Setup probes and the manifest

| Lane | Tasks | Executor · model · effort | Files held |
|------|-------|---------------------------|------------|
| A | T001, T002, T003 | `cli-mistral-vibe` · `deepseek-flash` · row `max` | none; three read-only probes |
| B | T004, T005 | `cli-mistral-vibe` · `deepseek-flash` · row `max` | `crates/bots-tui/Cargo.toml`, `.gitignore` |

**Workers:** 2. **Verify:** `cargo metadata --manifest-path crates/bots-tui/Cargo.toml --no-deps --format-version 1` exits 0 and prints `"name":"bots-tui"`; `git check-ignore -v crates/bots-tui/target/release/bots-ui` prints the `/crates/bots-tui/target/` line; `node .skilled/bin/bots.cjs ui` still exits 2. **Fallback:** `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max`, because a Vibe row cannot be lowered below `max` and the replacement must not be either.

### Wave 2 - Crate skeleton

| Lane | Tasks | Executor · model · effort | Files held |
|------|-------|---------------------------|------------|
| A | T006, T007 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max` | `crates/bots-tui/src/lib.rs`, `crates/bots-tui/src/main.rs`, the seven module stubs, `crates/bots-tui/Cargo.lock` |

**Workers:** 1, because the lane writes the library root every later module task is declared from. **Verify:** `cargo build --release --manifest-path crates/bots-tui/Cargo.toml` exits 0; `ls crates/bots-tui/target/release/bots-ui` prints the path; `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib` exits 0; `git ls-files crates/bots-tui/Cargo.lock` prints the path. **Fallback:** `cli-opencode` · `opencode-go/deepseek-v4.1-flash` · `#max`.

### Wave 3 - The dependency-free modules, the fixture and the design copy

| Lane | Tasks | Executor · model · effort | Files held |
|------|-------|---------------------------|------------|
| A | T008 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `crates/bots-tui/src/model.rs` |
| B | T013 | `cli-mistral-vibe` · `deepseek-flash` · row `max` | `crates/bots-tui/src/event.rs` |
| C | T015 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max` | `crates/bots-tui/src/terminal.rs` |
| D | T010 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `crates/bots-tui/tests/fixtures/bots` |
| E | T028 | `cli-mistral-vibe` · `deepseek-flash` · row `max` | `crates/bots-tui/design/` |

**Workers:** 5. Lane A is `high` because the model mirrors a payload the fixture already fixes; lane C is `max` because the guard and the panic hook are the two places a mistake costs a terminal; lane E is a copy, so it takes the cheapest rung. **Verify:** `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib model` names `unknown_state_keeps_raw`; `--lib event` names `closed_input_is_one_event`; `--lib terminal` names `restore_runs_on_exit` and `restore_runs_on_panic`; the five `jq` checks on the fixture exit 0 and `git ls-files -s crates/bots-tui/tests/fixtures/bots` prints `100755`; `diff -r specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design crates/bots-tui/design` prints nothing. **Fallback:** lane A and lane D to `cli-opencode` · `#max`, lane B to `cli-pi` · `--thinking max`, lane C to `cli-opencode` · `#max`, lane E to `cli-pi` · `--thinking max`.

### Wave 4 - The process boundary, the reducer and the signal path

| Lane | Tasks | Executor · model · effort | Files held |
|------|-------|---------------------------|------------|
| A | T009 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max` | `crates/bots-tui/src/cli.rs` |
| B | T012 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max` | `crates/bots-tui/src/state.rs` |
| C | T029 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max` | `crates/bots-tui/src/terminal.rs` |

**Workers:** 3, all `max` because each is a seam every later child reads through: `cli.rs` is the only process boundary, `state.rs` is the only place an answer is decided, and the signal handler is the second place a mistake costs a terminal. Lane C follows wave 3's lane C on the same file, so the two never run at once. **Verify:** `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib cli` names `program_defaults_to_node_and_bots_cjs`; `--lib state` names `esc_produces_no_answer_effect`; `--lib terminal` names `restore_runs_on_signal`. **Fallback:** `cli-opencode` · `opencode-go/deepseek-v4.1-flash` · `#max`.

### Wave 5 - The worker data layer and the client test

| Lane | Tasks | Executor · model · effort | Files held |
|------|-------|---------------------------|------------|
| A | T014 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max` | `crates/bots-tui/src/data.rs` |
| B | T011 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `crates/bots-tui/tests/cli_client.rs` |

**Workers:** 2. Lane A is `max` because the generation channel is the fix for the measured freeze; lane B is `high` because it mirrors the fixture's argv log. **Verify:** `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib data` names `stale_generation_is_dropped` and `loop_thread_spawns_nothing`; `--test cli_client` prints `test result: ok` and the argv log carries the four reads and the one write. **Fallback:** `cli-opencode` · `#max` for lane A, `cli-opencode` · `#max` for lane B.

### Wave 6 - The loop

| Lane | Tasks | Executor · model · effort | Files held |
|------|-------|---------------------------|------------|
| A | T016 | `cli-codex` · `gpt-6-luna` · `-c model_reasoning_effort="xhigh"` · `-c service_tier="fast"` | `crates/bots-tui/src/app.rs` |

**Workers:** 1. This is the packet's hardest task: the loop is where a closed input must write nothing, where a stale generation must be dropped, and where the empty frame is drawn, so it takes the highest tier the roster offers. **Verify:** `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib app` prints `test result: ok` and names `closed_input_writes_nothing` and `empty_frame_draws`. **Fallback:** `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max`, then `cli-opencode` · `#max`, then `cli-devin` · `deepseek-v4-1-flash-max` after a read-only probe.

### Wave 7 - The library root, the verb, the verb tests and the CI job

| Lane | Tasks | Executor · model · effort | Files held |
|------|-------|---------------------------|------------|
| A | T017 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max` | `crates/bots-tui/src/lib.rs`, `crates/bots-tui/src/main.rs` |
| B | T018 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max` | `.skilled/bin/bots.cjs` |
| C | T019 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `.skilled/skills/system-skilled-bots/runtime/tests/cli-ui.vitest.ts` |
| D | T020 | `cli-mistral-vibe` · `deepseek-flash` · row `max` | `.github/workflows/bots-runtime.yml` |

**Workers:** 4. Lane C is written against REQ-001's wording rather than against lane B's code, so the two run at once and the wave's verify is what proves they agree. **Verify:** `cargo build --release --manifest-path crates/bots-tui/Cargo.toml` exits 0; `T=$(mktemp -d); node .skilled/bin/bots.cjs ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-unavailable`, and the same command after `mkdir -p "$T/crates/bots-tui"` exits 4 and prints `ui-not-built`; the `--mono` and `--ascii` pass-through is proven by `cli-ui.vitest.ts`, which reads the stub's recorded argv; `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-ui.vitest.ts` prints no `failed`; `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` prints one line and `rg -c -e "- 'crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml` prints 2, and `rg -n 'dtolnay/rust-toolchain@1.92.0' .github/workflows/bots-runtime.yml` prints the toolchain step. **Fallback:** lanes A and B to `cli-opencode` · `#max`, lane C to `cli-opencode` · `#max`, lane D to `cli-pi` · `--thinking max`.

### Wave 8 - Verification gates

| Lane | Tasks | Executor · model · effort | Files held |
|------|-------|---------------------------|------------|
| Orchestrator | T021, T022, T023, T024, T025, T026, T027 | none; the orchestrator runs them itself | none |

**Workers:** 0. Every task in this wave is a command whose output the orchestrator reads, so no worker is dispatched and no file is written. **Verify:** `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0; `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0; `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target; `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints no `failed`; `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines; `diff -r specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design crates/bots-tui/design` prints nothing; the two refusals exit 4 and the `BOTS_UI_BIN` passthrough exits 0 and 1; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts --strict` prints `RESULT: PASSED`. **Fallback:** none. A gate that fails is repaired in the wave that owns the file, not re-dispatched to another executor.
<!-- /ANCHOR:waves -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every wave's verify step was run and its output read
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target, `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` prints one line and `rg -c -e "- 'crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml` prints 2, and `diff -r specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design crates/bots-tui/design` prints nothing
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

- [ ] CHK-030 [P0] `rg -n 'env::var' crates/bots-tui/src` matches nothing outside `#[cfg(test)]` blocks, so the shipped binary reads no environment variable of its own; `std::env::args` is the one `std::env` call, for argument parsing.
- [ ] CHK-031 [P0] `rg -n 'read_to_string|File::open|fs::read' crates/bots-tui/src` matches nothing outside `#[cfg(test)]` blocks, so the shipped binary opens no state file; the one test that reads the fixture's argv log is a `#[cfg(test)]` module in `src/app.rs`.
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
