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

Two shell variables shorten the commands below. Set them once per shell:

```bash
CRATE=crates/bots-tui
BOTS="node .skilled/bin/bots.cjs"
```
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the measured gap before any edit (`.skilled/bin/bots.cjs`). Verify: `$BOTS ui` prints `bots: unknown verb: ui` and exits 2.
- [ ] T002 Confirm the toolchain (none). Verify: `cargo --version` prints a stable version and exits 0.
- [ ] T003 Read the one JSON surface that exists and record its shape as the fixture baseline (`.skilled/skills/system-skilled-bots/runtime/lib/status.ts`). Verify: `$BOTS status --json` exits 0 and prints a `rows` key.
- [ ] T004 Read the six openhuman design files and record the layout and key decisions in the crate README (`$CRATE/README.md`). Verify: `rg -n "Char\('1'\) if alt|Char\('p'\)" specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs` prints the tab and palette lines.
- [ ] T005 Create the crate manifest with `license = "MIT"` and the binary name (`$CRATE/Cargo.toml`). Verify: `cargo metadata --manifest-path $CRATE/Cargo.toml --no-deps --format-version 1` exits 0 and prints `"name":"bots-tui"`.
- [ ] T006 Create the empty binary and confirm it builds (`$CRATE/src/main.rs`). Verify: `cargo build --release --manifest-path $CRATE/Cargo.toml` exits 0 and `ls $CRATE/target/release/bots-ui` prints the path.
- [ ] T007 Ignore the crate's build output (`.gitignore`). Verify: `git check-ignore -v $CRATE/target/release/bots-ui` prints the `/crates/bots-tui/target/` line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T008 Write the six statuses, their markers and the runtime-value mapping (`$CRATE/src/activity.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib activity` prints `test result: ok` and the test names all six markers.
- [ ] T009 Write the key table, each row carrying the label the renderer draws (`$CRATE/src/keys.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib keys` prints `test result: ok` and a test asserts every action has a non-empty label.
- [ ] T010 Write the pure state: tab, selection, overlay, rows, status line and palette (`$CRATE/src/ui_state.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib ui_state` prints `test result: ok`.
- [ ] T011 Write the CLI client, the only module that spawns a process (`$CRATE/src/cli.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test cli_client` prints `test result: ok`.
- [ ] T012 Write the fixture script that answers four verbs and records its argv (`$CRATE/tests/fixtures/bots`). Verify: `bash $CRATE/tests/fixtures/bots status --json` prints a JSON object with a `rows` key and exits 0.
- [ ] T013 Write the frame: header, tab bar, body, banner, input and footer (`$CRATE/src/render.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` prints `test result: ok`.
- [ ] T014 Write the four pane bodies, the chat one drawing a single line naming phase 010 (`$CRATE/src/render/panes.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` prints `test result: ok` and the test names each pane.
- [ ] T015 Write the overlay panel with its numbered choices (`$CRATE/src/render/overlay.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` prints `test result: ok` and the test asserts `1 approve once`, `2 approve always`, `n deny` and `Esc close`.
- [ ] T016 Write the loop: poll a key, map it, run it, redraw (`$CRATE/src/app.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib app` prints `test result: ok`.
- [ ] T017 Write the entry point with terminal restore and a panic hook (`$CRATE/src/main.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib main` prints `test result: ok` and the panic test asserts the restore ran.
- [ ] T018 Add the `ui` verb: usage line, verb spec, binary resolution, exec and exit passthrough (`.skilled/bin/bots.cjs`). Verify: `$BOTS ui` exits 4 and prints `build it with cargo build --release --manifest-path crates/bots-tui/Cargo.toml`.
- [ ] T019 Mirror the edited CLI (`.opencode/bin/bots.cjs`). Verify: `diff -q .skilled/bin/bots.cjs .opencode/bin/bots.cjs` prints nothing.
- [ ] T020 Write the verb's tests: argv, exit passthrough and missing-binary refusal (`.skilled/skills/system-skilled-bots/runtime/tests/cli-ui.vitest.ts`). Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- cli-ui` prints `cli-ui.vitest.ts` and no `failed`.
- [ ] T021 Name the verb as a status surface in one line (`.skilled/skills/system-skilled-bots/SKILL.md`). Verify: `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints one line.
- [ ] T022 Mirror the hub line (`.opencode/skills/system-skilled-bots/SKILL.md`). Verify: `diff -q .skilled/skills/system-skilled-bots/SKILL.md .opencode/skills/system-skilled-bots/SKILL.md` prints nothing.
- [ ] T023 Write the crate README: build, run, keys and the design reference (`$CRATE/README.md`). Verify: `rg -n 'openhuman' $CRATE/README.md` prints one line and `rg -n 'no code' $CRATE/README.md` prints one line.
- [ ] T024 Add the `bots-tui` job and the two path entries (`.github/workflows/bots-runtime.yml`). Verify: `rg -n 'bots-tui' .github/workflows/bots-runtime.yml` prints three lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T025 Run the formatter check (`$CRATE`). Verify: `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0.
- [ ] T026 Run the linter with warnings denied (`$CRATE`). Verify: `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] T027 Run the crate suite (`$CRATE`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target and no `FAILED`.
- [ ] T028 Run the runtime suite, including the new verb tests (`.skilled/skills/system-skilled-bots/runtime`). Verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`.
- [ ] T029 Prove no openhuman code was copied (`$CRATE`). Verify: `rg -n 'openhuman' $CRATE/src` prints only comment lines, and `rg -c 'GNU GENERAL PUBLIC LICENSE' $CRATE` prints nothing.
- [ ] T030 Prove the answer path by hand (`$CRATE`). Verify: with one open item, `bots ui` then `n` in the overlay, then `$BOTS inbox` no longer lists that item and `$BOTS status --json` carries no `needs-you` row for it.
- [ ] T031 Prove the closed-input rule (`$CRATE`). Verify: `printf '' | $CRATE/target/release/bots-ui --repo . --skilled-tree .` exits 0 and `$BOTS inbox --json` still lists the item as open.
- [ ] T032 Validate the packet (`specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `cargo test` in `$CRATE` prints `test result: ok` for every target, and `diff -q .skilled/bin/bots.cjs .opencode/bin/bots.cjs` prints nothing
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
- [ ] CHK-022 [P1] `cargo test --manifest-path $CRATE/Cargo.toml --test cli_client` covers the four reads, the one write, a non-zero exit and closed input.
- [ ] CHK-023 [P1] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` passes, including `cli-ui.vitest.ts`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] `rg -n 'env::var|std::env' $CRATE/src` matches nothing, so the binary reads no environment variable of its own.
- [ ] CHK-031 [P0] `rg -n 'read_to_string|File::open|fs::read' $CRATE/src` matches nothing, so the binary opens no state file.
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
