---
title: "Implementation Plan: Phase 3: terminal-screen"
description: "One MIT Rust ratatui crate at `crates/bots-tui/`, one `ui` verb in the bots CLI, and a fixture-driven test seam so the three panes are provable before phases 001 and 002 ship their JSON."
trigger_phrases:
  - "terminal screen plan"
  - "bots ui plan"
  - "ratatui crate plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: terminal-screen

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Rust, 2021 edition, one binary crate |
| **Framework** | ratatui 0.30 with crossterm 0.29, no async runtime |
| **Storage** | None. Every read is one `bots ... --json` call, and the one write is `bots answer` |
| **Testing** | `cargo test` for unit, `TestBackend` render and fixture-driven integration; vitest for the `ui` verb |

### Overview
The crate lives at `crates/bots-tui/` rather than under `.skilled/`, because `.opencode/` mirrors `.skilled/` wholesale and a crate inside the skill would be duplicated into that mirror along with its build output. The binary is `bots-ui`, and `.skilled/bin/bots.cjs` gains one `ui` verb that resolves it from the repository root, execs it with `--repo` and `--skilled-tree`, and passes the exit code through. Inside the crate, `cli.rs` is the only module that spawns a process, `ui_state.rs` holds pure state with no I/O, and `keys.rs` holds one table that both binds a key and supplies the label the renderer draws, so a key cannot be bound without appearing on screen. The proof is `cargo test`: a `TestBackend` render test asserts every bound label appears in the drawn buffer, and a fixture `bots` script lets the client be tested before phases 001 and 002 ship their verbs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs ui` prints `bots: unknown verb: ui` and exits 2, the measured gap this phase closes
- [ ] `cargo --version` prints a stable toolchain, and `cargo build --release --manifest-path crates/bots-tui/Cargo.toml` exits 0 on the empty crate
- [ ] Phases 001 and 002 are closed, so `bots activity --json`, `bots inbox --json` and `bots routines --json` exist

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cargo test` in `crates/bots-tui` prints `test result: ok` for every target
- [ ] `cargo clippy --all-targets -- -D warnings` and `cargo fmt --check` exit 0
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` passes, including `cli-ui.vitest.ts`
- [ ] `diff -q .skilled/bin/bots.cjs .opencode/bin/bots.cjs` prints nothing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure state, one renderer, one process boundary.

### Key Components
- **`cli.rs`**: the only module that spawns a process. One function per surface, each returning typed rows or an error carrying the child's stderr, so no other module can reach the runtime.
- **`ui_state.rs`**: pure state with no I/O - active tab, selection, overlay, rows, status line and palette. A test drives it with a key and asserts the next state without a terminal.
- **`keys.rs`**: one table of key-to-action rows, each carrying the label the renderer draws. Binding and drawing read the same row, so REQ-010 holds by construction rather than by review.
- **`activity.rs`**: the six statuses, their markers and the mapping from the runtime's exit vocabulary. An unmapped value draws `?` with the raw value beside it.
- **`render.rs`, `render/panes.rs`, `render/overlay.rs`**: the frame, the four pane bodies and the overlay panel. They read state and write cells, nothing else.
- **`app.rs`**: the loop. It polls a key, asks `keys.rs` for the action, runs it through `cli.rs` or `ui_state.rs`, and redraws.

The module split follows openhuman-tui's source map, which keeps pure navigation state apart from the renderer and the event loop, and which is what makes a render test possible without a terminal. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/ui_state.rs:1] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:1] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/activity.rs:1] The crate adds no async runtime, because every read is one blocking `Command::output()` and openhuman's tokio dependency exists for the core it embeds, which this binary does not have. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/Cargo.toml:76-82]

### Data Flow
A key event reaches `app.rs`, which asks `keys.rs` for an action. A read action calls `cli.rs`, which spawns `node <skilled-tree>/.skilled/bin/bots.cjs <verb> --json --repo <repo>`, parses the payload into typed rows and hands them to `ui_state.rs`. A write action calls `cli.rs` once with `bots answer <item-id> <text>`. `render.rs` then draws one frame from the state. A refresh is four read calls in sequence, one per surface, and a failed call leaves the previous rows in place while its stderr goes to the status row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/bin/bots.cjs` | Owns the verb set, the usage text and the exit codes | update - add the `ui` verb | `node .skilled/bin/bots.cjs ui` exits 4 with the build command when no binary exists |
| `.opencode/bin/bots.cjs` | Byte-identical mirror of the CLI | update - copy the edited file | `diff -q .skilled/bin/bots.cjs .opencode/bin/bots.cjs` prints nothing |
| `crates/bots-tui/` | New consumer of the JSON verbs | create | `cargo test` passes |
| `bots status --json` | Producer of the header's bot count and staleness flag | unchanged | `node .skilled/bin/bots.cjs status --json` still exits 0 |
| `bots activity --json`, `bots inbox --json`, `bots routines --json` | Producers owned by phases 001 and 002 | not a consumer - this phase reads them and changes none | `rg -n 'activity|routines' .skilled/bin/bots.cjs` shows no new verb beyond `ui` |
| `bots answer` | The one write path | unchanged | `node .skilled/bin/bots.cjs answer <id> deny` still exits 0 |
| `.skilled/skills/system-skilled-bots/SKILL.md` | Names which mode owns each verb | update - one line naming `bots ui` as a status surface | `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints one line |
| `.github/workflows/bots-runtime.yml` | Runs the runtime suites on the skill's paths | update - two path entries and one `bots-tui` job | `rg -n 'bots-tui' .github/workflows/bots-runtime.yml` prints three lines |

Required inventories:
- Same-class producers: `rg -n "'  [a-z]+ " .skilled/bin/bots.cjs` lists every usage line, so a new verb cannot be added without a usage line beside it.
- Consumers of changed symbols: `rg -n 'bots.cjs' .skilled/skills/system-skilled-bots/ --glob '*.md'` names every doc that quotes the CLI.
- Matrix axes: four surfaces read (status, activity, inbox, routines) by three outcomes (exit 0 with rows, exit 0 with no rows, exit non-zero), plus the one write by three keys (`y`, `n`, `a`) and the closed-input case.
- Algorithm invariant: the binary writes only through `bots answer`, and only when a key names an answer. A closed stdin, an Esc, or a key that names no answer writes nothing.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the one `--json` contract that exists today and the three phases 001 and 002 add, plus the six openhuman design files, then confirms an empty crate builds. Implementation writes the crate's state, key table, client, renderer and overlay, then adds the `ui` verb to `bots.cjs`. Verification runs `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo test`, the runtime's `cli-ui.vitest.ts`, and one manual answer against this repository.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `keys.rs` mapping, `activity.rs` status table, `ui_state.rs` selection and overlay | `cargo test` |
| Render | every bound key appears in a `TestBackend` buffer at 80x24 and at 120x40 | `cargo test --test render_keys` |
| Integration | `cli.rs` against `tests/fixtures/bots`, a script that prints canned JSON and records its argv | `cargo test --test cli_client` |
| CLI verb | `bots ui` argv, exit passthrough and missing-binary refusal | `npm --prefix .skilled/skills/system-skilled-bots/runtime test` |
| Manual | one item answered from the screen, read back through `bots inbox` and `bots status --json` | `bots ui`, then `bots inbox` |

The fixture script is the seam that makes the phase buildable before phases 001 and 002 land: it answers `activity`, `inbox`, `routines` and `status` from files under `tests/fixtures/`, and appends each invocation's argv to a file the test reads. The render test is the mechanical proof of REQ-010, because it asserts the drawn buffer contains each label `keys.rs` binds.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Rust stable toolchain | External | Green | The crate cannot build. `cargo 1.92.0` is installed on this machine |
| ratatui 0.30, crossterm 0.29, serde, serde_json, unicode-width | External | Green | The frame cannot draw or the payload cannot be parsed |
| Phase 001's `bots activity --json` and `bots inbox --json` | Internal | Yellow | The activity and inbox panes read the fixture only |
| Phase 002's `bots routines --json` | Internal | Yellow | The routines pane reads the fixture only |
| `bots status --json` | Internal | Green | The header loses its bot count and staleness flag |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the screen writes an answer the runtime cannot read, or the crate cannot build on the pinned toolchain.
- **Procedure**: revert the commit that adds `crates/bots-tui/` and the `ui` verb. Nothing else reads either, so the runtime, the JSON verbs and the state root are unchanged by the revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 001 and 002 closed, and a stable Rust toolchain | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | The phase handoff to 004-computer-exposure |
<!-- /ANCHOR:phase-deps -->

---
