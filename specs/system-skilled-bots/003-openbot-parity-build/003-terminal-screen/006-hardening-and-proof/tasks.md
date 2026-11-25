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

The tasks run in four waves. A wave's lanes hold disjoint files, so the worker count is the number of lanes, never the number of tasks. `plan.md`'s `External orchestration` section carries each lane's file set, the fallback ladder and the full verify step.

| Wave | Tasks | Executor, model, effort | Workers | Verify after the wave |
|------|-------|-------------------------|---------|-----------------------|
| 1 Setup probes | T001 to T004 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | 1 | The four probe commands print their expected output |
| 2 Gate repair | T005 to T008 | `cli-codex` · `gpt-6-luna` · `xhigh` · `fast` on lane A; `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` on lane B | 2 | `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings` and `cargo test` exit 0, and the runtime suite prints no `failed` |
| 3 Documents | T009 to T011 | `cli-opencode` · `opencode-go/deepseek-v4.1-flash` · `#max` on lane A; `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` on lane B | 2 | The five README greps each print one line, the hub grep prints one line, and `test -L .opencode/skills` exits 0 |
| 4 Verification | T012 to T020 | the orchestrator, no dispatch | 0 | Every gate from the final state, the licence proof, the pointer check, the eight defect checks and `RESULT: PASSED` |

A wave whose executor runs out of usage moves down the ladder in `plan.md`'s `External orchestration` section and never lowers its effort tier. A wave already on the last rung stops and reports rather than dropping its tier.

### Moved from the pre-expansion phase

The pre-expansion phase 003 carried one task list for the whole screen. These are the tasks that belong to this child, with the id each one became. The rest moved to the child that owns the surface, and the two that need a tty moved to `005-answer-flow` because the parent's handoff row names them as its exit.

| Legacy task | Intent | Now |
|-------------|--------|-----|
| T021 | Name `bots ui` as a status surface | T010 |
| T022 | Prove the hub mirror is a symlink | T011 |
| T023 | Write the crate README | T009 |
| T024 | Add the `bots-tui` CI job | `002-architecture-and-contracts`, which the parent's Files to Change table assigns `.github/workflows/bots-runtime.yml` to |
| T025 | Run the formatter check | T005, then T012 from the final state |
| T026 | Run the linter with warnings denied | T006, then T013 from the final state |
| T027 | Run the crate suite | T007, then T014 from the final state |
| T028 | Run the runtime suite | T008, then T015 from the final state |
| T029 | Prove no openhuman code was copied | T016 |
| T030 | Prove the answer path by hand | `005-answer-flow`, because the overlay needs a tty |
| T031 | Prove the closed-input rule | `005-answer-flow`, which owns the loop's closed-input test |
| T032 | Validate the packet | T020 |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Wave 1 - Setup probes

- [ ] T001 Confirm the measured gap before any edit (`$CRATE/Cargo.toml`). Verify: `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 1 and prints `manifest path ... does not exist` while the crate is absent.
- [ ] T002 Record the toolchain the gates run under (`goal.md`). Verify: `cargo fmt --version` and `cargo clippy --version` each print a version and exit 0.
- [ ] T003 Record the crate's module list as the gate's file set (`$CRATE/src`). Verify: `ls $CRATE/src` prints `app.rs`, `cli.rs`, `data.rs`, `event.rs`, `keys.rs`, `lib.rs`, `main.rs`, `model.rs`, `sanitize.rs`, `state.rs`, `terminal.rs`, `theme.rs` and `view`.
- [ ] T004 Confirm the eight defect rows the audit covers (`../spec.md`). Verify: `rg -c '^\| .*\| (002|003|004|005): ' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md` prints 8.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Wave 2 - Gate repair

- [ ] T005 Run the formatter and repair only the lines it names (`$CRATE/src`, `$CRATE/tests`). Verify: `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0.
- [ ] T006 Run the linter and repair only the lines it names (`$CRATE/src`, `$CRATE/tests`). Verify: `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] T007 Run the crate suite and repair only the test it names (`$CRATE/tests`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target and no `FAILED`.
- [ ] T008 Run the runtime suite and repair only the test it names (`.skilled/skills/system-skilled-bots/runtime/tests`). Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`.

### Wave 3 - The two documents

- [ ] T009 Write the crate README: the release build, the run command, every bound key, the eight glyphs with their ASCII fallback, the design reference and the no-code statement (`$CRATE/README.md`). Verify: `rg -n 'cargo build --release' $CRATE/README.md`, `rg -n 'Ctrl\+C' $CRATE/README.md`, `rg -n 'ASCII' $CRATE/README.md`, `rg -n 'openhuman' $CRATE/README.md` and `rg -n 'no code' $CRATE/README.md` each print at least one line.
- [ ] T010 Name `bots ui` as a status surface in one line (`.skilled/skills/system-skilled-bots/SKILL.md`). Verify: `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints one line.
- [ ] T011 Prove the hub mirror is a symlink, so the edited line lands once (`.opencode/skills`). Verify: `test -L .opencode/skills` exits 0 and `rg -n 'bots ui' .opencode/skills/system-skilled-bots/SKILL.md` prints the same one line as the `.skilled/` path.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Wave 4 - Verification from the final state

- [ ] T012 Prove the formatter gate from the final state (`$CRATE`). Verify: `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0.
- [ ] T013 Prove the linter gate from the final state (`$CRATE`). Verify: `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] T014 Prove the crate suite from the final state (`$CRATE`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target and no `FAILED`.
- [ ] T015 Prove the runtime suite from the final state (`.skilled/skills/system-skilled-bots/runtime`). Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`.
- [ ] T016 Prove the licence boundary (`$CRATE`). Verify: `cargo metadata --manifest-path $CRATE/Cargo.toml --no-deps --format-version 1 | jq -r '.packages[0].license'` prints `MIT`, `rg -n 'GNU GENERAL PUBLIC LICENSE|GPL-3' $CRATE` prints nothing, and `rg -n 'openhuman' $CRATE/src` prints only comment lines.
- [ ] T017 Prove the README's build and run commands (`$CRATE`). Verify: `cargo build --release --manifest-path $CRATE/Cargo.toml` exits 0 and `ls $CRATE/target/release/bots-ui` prints the path.
- [ ] T018 Prove every design pointer resolves (`$CRATE/design`). Verify: `rg -o --no-filename 'specs/system-skilled-bots/context/[^ :]+:[0-9]+' $CRATE/design | sort -u | while IFS=: read -r p l; do sed -n "${l}p" "$p" >/dev/null || printf 'DANGLING %s:%s\n' "$p" "$l"; done` prints nothing.
- [ ] T019 Run the eight defect checks and record each result in `goal.md` section 4 (`$CRATE`). Verify: `rg -c '^\| D[1-8] ' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/tasks.md` prints 8, and each row of the Defect Audit table below prints its expected output.
- [ ] T020 Validate this child (`specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:defect-audit -->
## Defect Audit

One row per defect the parent's §6 lists, each with the command that proves the fix is present and the output it must print. The grep proves the mechanism exists; the suite proves it behaves, so the pair is the evidence and neither alone is. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:210]

| ID | Defect | Check | Expected |
|----|--------|-------|----------|
| D1 | `1` answers two questions | `rg -n 'Overlay' $CRATE/src/keys.rs` and `rg -c "Char\('1'\)" $CRATE/src/keys.rs` | the context enum, and one digit binding |
| D2 | Alt+1..4 is unreachable on macOS | `rg -c "Char\('\[" $CRATE/src/keys.rs` and `rg -c "Char\('\]" $CRATE/src/keys.rs` | 1 and 1, the fallback pair |
| D3 | Selection by row index is unsafe | `rg -n 'ItemId' $CRATE/src/state.rs` | the selection field's type |
| D4 | Blocking spawns freeze input | `rg -n 'thread::spawn' $CRATE/src/data.rs` and `rg -n 'Command::new' $CRATE/src` | the worker line, and only `cli.rs` |
| D5 | Bot text is drawn unsanitized | `rg -n 'sanitize' $CRATE/src/view` | at least one call per pane module |
| D6 | An item with no options can only get y/n | `rg -n 'free_text' $CRATE/src/view/overlay.rs` | at least one line |
| D7 | `?` marks three different states | `rg -n 'scheduled' $CRATE/src` and `rg -n 'recurring' $CRATE/src` | one glyph row each |
| D8 | The banner names the wrong key | `rg -n 'pending approval' $CRATE/src/view` and `rg -n 'pending approval.*Ctrl\+P' $CRATE/src/view` | one banner line, and nothing naming `Ctrl+P` |
<!-- /ANCHOR:defect-audit -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings` and `cargo test` exit 0 in `$CRATE`, and `test -L .opencode/skills` exits 0
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

- [ ] CHK-001 [P0] `ls $CRATE/Cargo.toml` prints the path, so the crate `002` lands exists.
- [ ] CHK-002 [P0] `ls $CRATE/tests/fixtures/bots` prints the path, so every suite has its payload source.
- [ ] CHK-003 [P1] `rg -c 'bots-tui' .github/workflows/bots-runtime.yml` prints 3, so `002`'s job is in place to read.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0.
- [ ] CHK-011 [P0] `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] CHK-012 [P1] `rg -n 'unwrap\(\)|expect\(' $CRATE/src` matches only lines inside `#[cfg(test)]` blocks.
- [ ] CHK-013 [P1] `rg -n 'Command::new' $CRATE/src` matches only `cli.rs`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target and no `FAILED`.
- [ ] CHK-021 [P0] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`.
- [ ] CHK-022 [P0] Each of the eight Defect Audit rows prints its expected output.
- [ ] CHK-023 [P1] `cargo test --manifest-path $CRATE/Cargo.toml --doc` prints `test result: ok`, so a doc example that fails is a gate failure rather than a silent skip.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] `rg -n 'GNU GENERAL PUBLIC LICENSE|GPL-3' $CRATE` prints nothing, so no file the crate ships carries the design reference's licence.
- [ ] CHK-031 [P0] `cargo metadata --manifest-path $CRATE/Cargo.toml --no-deps --format-version 1 | jq -r '.packages[0].license'` prints `MIT`.
- [ ] CHK-032 [P1] `rg -n 'env::var' $CRATE/src` matches nothing outside `#[cfg(test)]` blocks, so the shipped binary reads no environment variable of its own.
- [ ] CHK-033 [P1] `rg -n 'read_to_string|File::open|fs::read' $CRATE/src` matches nothing outside `#[cfg(test)]` blocks, so the shipped binary opens no state file.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints one line.
- [ ] CHK-041 [P1] `rg -n 'openhuman' $CRATE/README.md` prints one line and `rg -n 'no code' $CRATE/README.md` prints one line.
- [ ] CHK-042 [P1] `rg -n 'ASCII' $CRATE/README.md` prints one line, so the fallback set is documented beside the glyphs.
- [ ] CHK-043 [P2] `rg -n 'bots ui' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/*.md` names the verb in `spec.md`, `plan.md` and `tasks.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] `git status --porcelain $CRATE` lists only source, tests, fixtures, `Cargo.toml`, `Cargo.lock`, `README.md` and `design/`, and no `target/`.
- [ ] CHK-051 [P1] `git check-ignore -v $CRATE/target/release/bots-ui` prints the `/crates/bots-tui/target/` line.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---
