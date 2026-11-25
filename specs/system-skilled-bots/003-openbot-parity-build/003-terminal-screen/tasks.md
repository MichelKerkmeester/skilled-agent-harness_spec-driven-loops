---
title: "Tasks: Phase 3: terminal-screen"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "terminal screen tasks"
  - "bots ui tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: terminal-screen

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the measured gap before any edit (`.skilled/bin/bots.cjs`). Verify: `$BOTS ui` prints `bots: unknown verb: ui` and exits 2.
- [ ] T002 Confirm the toolchain (none). Verify: `cargo --version` prints a stable version and exits 0.
- [ ] T003 Read the one JSON surface that exists and record its shape as the fixture baseline (`.skilled/skills/system-skilled-bots/runtime/lib/status.ts`). Verify: `$BOTS status --json` exits 0 and prints a `rows` key.
- [ ] T004 Read the six openhuman design files and record the layout and key decisions in the crate README (`$CRATE/README.md`). Verify: `rg -n "Char\('1'\) if alt|Char\('p'\)" specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs` prints the tab and palette lines.
- [ ] T005 Create the crate manifest with `license = "MIT"` and the binary name (`$CRATE/Cargo.toml`). Verify: `cargo metadata --manifest-path $CRATE/Cargo.toml --no-deps --format-version 1` exits 0 and prints `"name":"bots-tui"`.
- [ ] T006 Create the crate skeleton - a library root that declares no module yet and a binary that calls it - and confirm it builds (`$CRATE/src/lib.rs`, `$CRATE/src/main.rs`). Verify: `cargo build --release --manifest-path $CRATE/Cargo.toml` exits 0, `ls $CRATE/target/release/bots-ui` prints the path, and `cargo test --manifest-path $CRATE/Cargo.toml --lib` exits 0.
- [ ] T007 Ignore the crate's build output (`.gitignore`). Verify: `git check-ignore -v $CRATE/target/release/bots-ui` prints the `/crates/bots-tui/target/` line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T008 Write the six markers, the seven group ids they map to and the runtime-value mapping, and declare it `pub mod` in the library root (`$CRATE/src/activity.rs`, `$CRATE/src/lib.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib activity` prints `test result: ok` and the test names all six markers and all seven ids.
- [ ] T009 Write the key table, each row carrying the label the renderer draws, and declare it `pub mod` in the library root (`$CRATE/src/keys.rs`, `$CRATE/src/lib.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib keys` prints `test result: ok` and a test asserts every action has a non-empty label.
- [ ] T010 Write the pure state: tab, selection, overlay, rows, status line and palette, and declare it `pub mod` in the library root (`$CRATE/src/ui_state.rs`, `$CRATE/src/lib.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib ui_state` prints `test result: ok`.
- [ ] T011 Write the CLI client, the only module that spawns a process, taking the program and its arguments from its caller and defaulting to `node` plus `<skilled-tree>/.skilled/bin/bots.cjs`, and declare it `pub mod` in the library root (`$CRATE/src/cli.rs`, `$CRATE/src/lib.rs`). Verify: `cargo build --manifest-path $CRATE/Cargo.toml` exits 0.
- [ ] T012 Write the fixture script that answers `status`, `activity`, `inbox` and `routines` with the payloads phases 001 and 002 ship, its `status --json` carrying the `lastRun.branch` and `lastRun.worktreePath` keys 004 adds, and records its argv, committed mode 0755, then write the client's integration test against it (`$CRATE/tests/fixtures/bots`, `$CRATE/tests/cli_client.rs`). Verify: `bash $CRATE/tests/fixtures/bots status --json | jq -e '.rows'` exits 0, `bash $CRATE/tests/fixtures/bots status --json | jq -e '.rows[0].lastRun | has("branch") and has("worktreePath")'` exits 0, `bash $CRATE/tests/fixtures/bots activity --json | jq -e '.groups'` exits 0, `bash $CRATE/tests/fixtures/bots inbox --json | jq -e '.items'` exits 0, `bash $CRATE/tests/fixtures/bots routines --json | jq -e 'type == "array"'` exits 0, `git ls-files -s $CRATE/tests/fixtures/bots` prints `100755`, and `cargo test --manifest-path $CRATE/Cargo.toml --test cli_client` prints `test result: ok`. The integration test builds the fixture path from `env!("CARGO_MANIFEST_DIR")`, so it resolves from the crate directory cargo runs tests in.
- [ ] T013 Write the frame - header, tab bar, body, banner, input and footer - declare it `pub mod` in the library root, and write the render test that imports it (`$CRATE/src/render.rs`, `$CRATE/src/lib.rs`, `$CRATE/tests/render_keys.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` prints `test result: ok`.
- [ ] T014 Write the four pane bodies, the chat one drawing a single line naming phase 010, and declare it `mod` in the renderer (`$CRATE/src/render/panes.rs`, `$CRATE/src/render.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` prints `test result: ok` and the test names each pane.
- [ ] T015 Write the overlay panel with its numbered choices, and declare it `mod` in the renderer (`$CRATE/src/render/overlay.rs`, `$CRATE/src/render.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` prints `test result: ok` and the test asserts `1 approve once`, `n deny` and `Esc close`, and asserts no `always` label.
- [ ] T016 Write the loop: poll a key, map it, run it, redraw, plus the lib test that feeds an Esc event with the overlay open and asserts it closes and the fixture recorded no `answer` argv, and declare it `pub mod` in the library root (`$CRATE/src/app.rs`, `$CRATE/src/lib.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib app` prints `test result: ok` and names `esc_closes_overlay_and_writes_nothing`.
- [ ] T017 Complete the library root: argument parsing, the terminal guard with its restore and panic hook, and the loop entry, then reduce the binary to a call into it (`$CRATE/src/lib.rs`, `$CRATE/src/main.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib restore` prints `test result: ok` and names `restore_runs_on_exit` and `restore_runs_on_panic`.
- [ ] T018 Add the `ui` verb: usage line, verb spec, binary resolution, exec, exit passthrough and the two refusals (`.skilled/bin/bots.cjs`). Verify: `T=$(mktemp -d); $BOTS ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-unavailable`; `mkdir -p "$T/crates/bots-tui"; $BOTS ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-not-built` with `build it with cargo build --release --manifest-path crates/bots-tui/Cargo.toml`.
- [ ] T019 Prove the CLI mirror is a symlink, so the edited verb lands once (`.opencode/bin`). Verify: `test -L .opencode/bin` exits 0 and `rg -c 'ui' .opencode/bin/bots.cjs` prints the same count as `.skilled/bin/bots.cjs`.
- [ ] T020 Write the verb's tests: argv, exit passthrough, the `ui-unavailable` refusal for an absent crate and the `ui-not-built` refusal for an absent binary, each against a temp `--skilled-tree` and a stub binary named by `BOTS_UI_BIN` (`.skilled/skills/system-skilled-bots/runtime/tests/cli-ui.vitest.ts`). Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- cli-ui` prints `cli-ui.vitest.ts` and no `failed`.
- [ ] T021 Name the verb as a status surface in one line (`.skilled/skills/system-skilled-bots/SKILL.md`). Verify: `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints one line.
- [ ] T022 Prove the hub mirror is a symlink, so the edited line lands once (`.opencode/skills`). Verify: `test -L .opencode/skills` exits 0 and `rg -n 'bots ui' .opencode/skills/system-skilled-bots/SKILL.md` prints the same one line as the `.skilled/` path.
- [ ] T023 Write the crate README: build, run, keys and the design reference (`$CRATE/README.md`). Verify: `rg -n 'openhuman' $CRATE/README.md` prints one line and `rg -n 'no code' $CRATE/README.md` prints one line.
- [ ] T024 Add the `bots-tui` job, its pinned toolchain and the two path entries (`.github/workflows/bots-runtime.yml`). Verify: `rg -n 'bots-tui' .github/workflows/bots-runtime.yml` prints three lines, `rg -n 'dtolnay/rust-toolchain@stable' .github/workflows/bots-runtime.yml` prints the toolchain step with `clippy` and `rustfmt`, and `rg -n 'cargo test' .github/workflows/bots-runtime.yml` prints the test step.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T025 Run the formatter check (`$CRATE`). Verify: `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0.
- [ ] T026 Run the linter with warnings denied (`$CRATE`). Verify: `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] T027 Run the crate suite (`$CRATE`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target and no `FAILED`.
- [ ] T028 Run the runtime suite, including the new verb tests (`.skilled/skills/system-skilled-bots/runtime`). Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`.
- [ ] T029 Prove no openhuman code was copied (`$CRATE`). Verify: `rg -n 'openhuman' $CRATE/src` prints only comment lines, and `rg -c 'GNU GENERAL PUBLIC LICENSE' $CRATE` prints nothing.
- [ ] T030 Prove the answer path by hand (`$CRATE`). With one open item whose id is `<item-id>`, answer it `n` from the overlay in `bots ui`. This step needs a tty by design, because the overlay is driven by keystrokes no piped command delivers; the verify command does not. The Esc half is the lib test T016 adds, so it needs no tty. Verify: `jq -e '.answer.text == "deny" and .answer.scope == "deny"' $STATE/*/needs-you/<item-id>.json` exits 0, because `bots inbox --json` lists only open and expired items. [SOURCE: .skilled/bin/bots.cjs:465]
- [ ] T031 Prove the closed-input rule with a lib test that drives the loop with a closed-input event and an item selected (`$CRATE/src/app.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib closed_input` prints `test result: ok` and names `closed_input_writes_nothing`, which asserts the loop returns 0 and the fixture recorded no `answer` argv.
- [ ] T032 Validate the packet (`specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `cargo test` in `$CRATE` prints `test result: ok` for every target, and `test -L .opencode/bin && test -L .opencode/skills` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-001 [P0] `$BOTS ui` prints `bots: unknown verb: ui` and exits 2 before the verb is added.
- [ ] CHK-002 [P0] `cargo build --release --manifest-path $CRATE/Cargo.toml` exits 0.
- [ ] CHK-003 [P1] `$BOTS status --json` exits 0 and prints a `rows` key.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] CHK-011 [P0] `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0.
- [ ] CHK-012 [P1] `rg -n 'unwrap\(\)|expect\(' $CRATE/src` matches only lines inside `#[cfg(test)]` blocks.
- [ ] CHK-013 [P1] `rg -n 'Command::new' $CRATE/src` matches only `cli.rs`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target.
- [ ] CHK-021 [P0] `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` asserts every label `keys.rs` binds appears in the drawn buffer.
- [ ] CHK-022 [P1] `cargo test --manifest-path $CRATE/Cargo.toml --test cli_client` covers the four reads, the one write and a non-zero exit, `cargo test --manifest-path $CRATE/Cargo.toml --lib closed_input` covers the closed input, and `cargo test --manifest-path $CRATE/Cargo.toml --lib esc` covers the Esc close.
- [ ] CHK-023 [P1] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` passes, including `cli-ui.vitest.ts`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] `rg -n 'env::var' $CRATE/src` matches nothing outside `#[cfg(test)]` blocks, so the shipped binary reads no environment variable of its own; `std::env::args` is the one `std::env` call, for argument parsing.
- [ ] CHK-031 [P0] `rg -n 'read_to_string|File::open|fs::read' $CRATE/src` matches nothing outside `#[cfg(test)]` blocks, so the shipped binary opens no state file; the one test that reads the fixture's argv log is a `#[cfg(test)]` module in `src/app.rs`.
- [ ] CHK-032 [P1] The answer text reaches the runtime only through `bots answer`, which refuses a secret literal before it stores the answer.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `rg -n 'bots ui' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/*.md` names the verb in `spec.md`, `plan.md` and `tasks.md`.
- [ ] CHK-041 [P1] `rg -n 'openhuman' $CRATE/README.md` names the design reference and states that no code was copied.
- [ ] CHK-042 [P2] `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints one line.
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
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---
