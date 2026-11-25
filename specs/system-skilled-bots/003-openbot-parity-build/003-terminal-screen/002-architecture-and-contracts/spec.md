---
title: "Feature Specification: Phase 2: architecture-and-contracts"
description: "The crate, the terminal guard, the worker data layer, the CLI client, the fixture, the `ui` verb and the CI job every later terminal-screen child builds on, proven by a cli client test and three refusals."
trigger_phrases:
  - "architecture and contracts"
  - "phase 2 architecture and contracts"
  - "bots-tui crate"
  - "bots ui verb"
  - "terminal guard and worker data layer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts"
    last_updated_at: "2026-11-25T23:44:25Z"
    last_updated_by: "review-fix-pass-3"
    recent_action: "Applied the third review findings that edit this child"
    next_safe_action: "Work wave 1 of tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w4-003-002-architecture"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: architecture-and-contracts

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-skilled-bots/003-openbot-parity-build` |
| **Phase** | 2 of 6 |
| **Predecessor** | `001-ux-and-component-map` |
| **Successor** | `003-shell-and-navigation` |
| **Handoff Criteria** | `cargo build --release --manifest-path crates/bots-tui/Cargo.toml` exits 0, `cargo test --manifest-path crates/bots-tui/Cargo.toml --test cli_client` prints `test result: ok`, `node .skilled/bin/bots.cjs ui --repo . --skilled-tree "$T"` exits 4 with `ui-unavailable` and then, after `mkdir -p "$T/crates/bots-tui"`, exits 4 with `ui-not-built`, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-ui.vitest.ts` prints no `failed`, including the `ui-contract-mismatch` case |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Terminal screen children: UX, architecture, shell, panes, answer flow, hardening specification.

**Scope Boundary**: The crate's skeleton and its seams. This child creates `crates/bots-tui/` with its manifest, library root, binary, terminal guard, event source, pure reducer, worker data layer, CLI client and model. It creates the fixture, the payload files and the `tests/common/` helpers, and the client test that reads through them. It copies 001's four design documents and its own two design documents into the crate, and it adds the `ui` verb, that verb's vitest suite and the `bots-tui` CI job. It draws one empty frame and no pane. The header, tab bar, footer, status row, palette, too-small screen, Mono palette and the control-character filter in `theme.rs` are 003. The four pane bodies are 004. The banner, the overlays, free-text entry and the in-flight lock are 005. The README and the GPL gate are 006.

**Dependencies**:
- 001's approved key map and component inventory, because the module map below follows the component inventory rather than inventing a second one.
- The four `--json` contracts the screen reads: `bots status --json`, which exists today, and `bots activity --json`, `bots inbox --json` and `bots routines --json`, which phases 001 and 002 of the parent build add. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:152] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:153] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:173]
- A stable Rust toolchain with `clippy` and `rustfmt`. `cargo 1.92.0` is installed here, and the CI job installs its own pinned toolchain.

**Deliverables**:
- `crates/bots-tui/`, an MIT Rust crate whose binary is `bots-ui` and whose library target lets `cargo test --lib` and `tests/*.rs` reach every module.
- `crates/bots-tui/design/`, 001's four documents plus this child's `architecture.md` and `contracts.md`, copied unchanged, so the mockups ship beside the code they describe.
- The `ui` verb in `.skilled/bin/bots.cjs`, with its three refusals, its two display flags and its vitest suite.
- `crates/bots-tui/tests/fixtures/bots`, the fake CLI that prints the four payload files and takes its log and its scenario as leading arguments.
- `crates/bots-tui/tests/common/`, the frame loader and the fixture helper every later child's tests share.
- The `bots-tui` job in `.github/workflows/bots-runtime.yml`, the repository's first Rust build, with `--locked`, a release build and the design diff.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every later child of this phase draws into a crate that does not exist, and the one verb that would start it does not exist either. `node .skilled/bin/bots.cjs ui` answers `bots: unknown verb: ui` and exits 2, and `ls crates` answers `No such file or directory`, so 003, 004 and 005 have no library root to add a module to, no process boundary to read the runtime through, and no fixture to test against. [SOURCE: .skilled/bin/bots.cjs:31]

### Purpose
One crate that builds, one verb that starts it, one fixture that stands in for the runtime, and one CI job that keeps all three green.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/bots.cjs ui
bots: unknown verb: ui
usage: bots <verb> [id] [--repo <path>] [--skilled-tree <path>]
...
exit codes: 0 completed, 1 run failure, 2 usage, 3 recursion guard, 4 refused before dispatch, 5 awaiting decision
EXIT=2

$ ls crates
ls: crates: No such file or directory
EXIT=1

$ cargo --version
cargo 1.92.0 (344c4567c 2025-10-21)
EXIT=0

$ node .skilled/bin/bots.cjs status --json
{
  "indexPath": "/Users/michelkerkmeester/.local/state/system-skilled-bots/index/status.sqlite",
  "builtAt": "2026-11-25T07:15:44.421Z",
  "stale": false,
  "staleIdentities": [],
  "rows": [
    {
      "kind": "bot",
      "identity": "skilled-scratch/bots-live-consumer",
      "botId": "hello",
      "state": "ok",
...
EXIT=0
```

The first two blocks are the measured gap this child closes: no `ui` verb exists, and no `crates/` directory exists, so there is nothing to start and nothing to build. The third block is the toolchain the crate compiles on. The fourth is the one surface that already answers as data, and it is the shape `model.rs` parses first. [SOURCE: .skilled/bin/bots.cjs:48] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:103-114]
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `crates/bots-tui/`, an MIT Rust crate with a library target beside the `bots-ui` binary, whose library root declares one module per seam and whose binary calls it.
- Copy 001's `design/` into `crates/bots-tui/design/` unchanged and add this child's `architecture.md` and `contracts.md` beside it, so the crate ships the mockups, the key map, the glyph table, the component inventory and the two contracts beside the code they describe.
- Write the terminal guard: raw mode on, alternate screen on, and one restore that runs on drop, in front of the process panic hook and a SIGTERM, SIGHUP and SIGINT handler that only sets a flag, so a panic or a killed process leaves a usable terminal.
- Write the worker data layer: one thread that runs the CLI calls, one generation-tagged channel, and a loop thread that spawns no process.
- Write `cli.rs`, the only module that spawns a process, taking the program and its arguments from its caller so a test points it at the fixture.
- Write the fixture `crates/bots-tui/tests/fixtures/bots`, the payload files it prints and the `tests/common/` helpers, so every later child tests without a live state root and without a tty.
- Add the `ui` verb to `.skilled/bin/bots.cjs` with its three refusals, and the vitest suite that proves its argv, its exit passthrough, its two display flags and all three refusals. The verb reads `NO_COLOR` and passes `--mono`, and passes `--ascii` when asked, so the binary reads no environment variable of its own.
- Add the `bots-tui` CI job and the two path entries that make it run, with `--locked`, a release build and the design diff.

### Out of Scope
- The header, tab bar, footer, status row, palette, help, too-small screen and Mono palette - 003 owns them, and this child draws one empty frame.
- The activity, inbox, routines and chat-placeholder panes - 004 owns them.
- The banner, the decision and choice overlays, free-text entry and the in-flight lock - 005 owns them.
- The control-character filter - 003 owns it in `theme.rs`, because the status row draws runtime text before any pane exists, and one filter with one behaviour is what keeps the two from disagreeing. The crate holds no `sanitize.rs`.
- The crate README and the GPL grep gate - 006 owns both. This child proves the license line and the absence of copied code, and 006 repeats them as a gate.
- `bots activity --json`, `bots inbox --json` and `bots routines --json` - phases 001 and 002 of the parent build own those verbs, and this child consumes them unchanged.
- A `--json` mode on `bots answer` - the screen reads the exit code and stderr the verb already writes.
- `insta` as a dependency - Q006 refuses it, and the snapshots assert the ratatui `TestBackend` buffer directly.
- Mouse support, a theme picker, a demo binary and a bench flag - each is a separate surface no child needs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `crates/bots-tui/Cargo.toml` | Create | MIT manifest: the `bots-ui` binary beside the library target, ratatui 0.30, crossterm 0.29, serde, serde_json, unicode-width, libc |
| `crates/bots-tui/Cargo.lock` | Create | Pinned dependency graph, committed because the crate ships a binary |
| `crates/bots-tui/design/` | Create | 001's `mockups.md`, `key-map.md`, `glyph-table.md` and `component-inventory.md`, plus this child's `architecture.md` and `contracts.md`, all copied unchanged |
| `crates/bots-tui/src/lib.rs` | Create | Library root: the whole argument parser including `--mono` and `--ascii`, the terminal guard, the loop entry, and every `pub mod` line including `keys`, `theme` and `view`, whose stub files this child also creates |
| `crates/bots-tui/src/main.rs` | Create | The binary: calls the library entry point and maps its result to the exit code |
| `crates/bots-tui/src/terminal.rs` | Create | RAII guard with a restore on drop, a chained panic hook and a signal handler |
| `crates/bots-tui/src/event.rs` | Create | The event source the caller supplies, so a test drives the loop without a tty |
| `crates/bots-tui/src/state.rs` | Create | Pure reducer `update(state, msg) -> Vec<Effect>` |
| `crates/bots-tui/src/data.rs` | Create | The worker thread and the generation-tagged channel |
| `crates/bots-tui/src/cli.rs` | Create | The only module that spawns a process: program, arguments, spawn, parse, answer |
| `crates/bots-tui/src/model.rs` | Create | serde types with defaults, an unknown state kept as `Unknown(raw)` |
| `crates/bots-tui/src/app.rs` | Create | The loop: take an event, reduce it, run the effects, draw one empty frame |
| `crates/bots-tui/tests/fixtures/bots` | Create | The fake CLI: prints the payload file for its verb, takes `--fixture-log` and `--fixture-scenario` as leading arguments, committed mode 0755 |
| `crates/bots-tui/tests/common/` | Create | The frame loader that reads a frame from `design/mockups.md` by heading and size, and the helper that builds a `Program` with a temp log and a scenario |
| `crates/bots-tui/tests/cli_client.rs` | Create | Integration tests against the fixture, one per scenario |
| `.skilled/bin/bots.cjs` | Modify | The `ui` verb: usage line, verb spec, binary resolution, the contract check, exec, exit passthrough, all three refusals |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-ui.vitest.ts` | Create | The `ui` verb's tests: argv, exit passthrough, all three refusals |
| `.github/workflows/bots-runtime.yml` | Modify | Two path entries and one `bots-tui` job: `--locked`, a release build, the design diff, a named runner, cache and timeout |
| `.gitignore` | Modify | Ignore `/crates/bots-tui/target/` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files. REQ-002, REQ-003 and REQ-011 are inherited from `../spec.md` and keep that file's wording, so a citation from another phase still resolves.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node .skilled/bin/bots.cjs ui --repo <path>` execs `<skilled-tree>/crates/bots-tui/target/release/bots-ui` with `--repo <path> --skilled-tree <skilled-tree>`, inherits stdio and exits with the binary's code. It reads `NO_COLOR` and passes `--mono` when the variable is set, and passes `--ascii` when the caller asks for it, so the binary reads no environment variable of its own. `lib.rs` accepts both flags and hands them to the theme 003 lands. The crate installs as a source checkout plus `cargo build --release`, on macOS and Linux only, so a checkout with no build gets a refusal rather than a partial screen. `bots-ui --version` prints the crate version and the contract number, as `bots-ui <crate version> contract <n>`, which is the payload major `design/contracts.md` section 8 fixes, and the verb runs it before exec, refusing `ui-contract-mismatch` and exiting 4 when the number differs, so a binary built before a payload change cannot draw a stale contract. With `BOTS_UI_BIN` unset it refuses before dispatch and exits 4 in three cases. When `<skilled-tree>/crates/bots-tui` is absent it refuses `ui-unavailable` and says the screen ships only in a source checkout, naming `cargo build --release --manifest-path crates/bots-tui/Cargo.toml`. When the crate is present and the binary is absent it refuses `ui-not-built` and writes `bots: no bots-ui binary at <path>; build it with cargo build --release --manifest-path crates/bots-tui/Cargo.toml`. When the binary answers a different contract number it refuses `ui-contract-mismatch` and writes `bots: <path> speaks contract <n>, this verb speaks contract <m>. Rebuild it with cargo build --release --manifest-path crates/bots-tui/Cargo.toml`. |
| REQ-002 | `crates/bots-tui/Cargo.toml` declares `license = "MIT"`, and `rg -n 'openhuman' crates/bots-tui/src` matches only comment lines that name the design reference. No file in the crate carries a GPL header or a copied openhuman function. |
| REQ-003 | The binary reads only through `bots ... --json` and writes only through `bots answer --scope once\|deny --repo <repo> -- <item-id> <text>`. `cli.rs` takes the program and its arguments from its caller, defaulting to `node` plus `<skilled-tree>/.skilled/bin/bots.cjs`, so every read is one `<program> <verb> --json --repo <repo>` call and the tests point it at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")`, which resolves from the crate directory cargo runs tests in. The binary opens no file under the state root. |
| REQ-004 | `cargo build --release --manifest-path crates/bots-tui/Cargo.toml` exits 0 and writes `crates/bots-tui/target/release/bots-ui`, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib` exits 0, because the package carries a library target beside the binary so `tests/*.rs` can import the modules. |
| REQ-005 | The terminal is restored on exit, on panic and on a signal: raw mode off, alternate screen left, cursor shown. The guard is an RAII value whose `Drop` restores, it chains a restore in front of the process panic hook, and it installs a `SIGTERM`, `SIGHUP` and `SIGINT` handler that only sets an atomic flag, which the event source turns into a `Terminate` message, so the loop returns and the guard's `Drop` restores the terminal. |
| REQ-006 | No process is spawned on the UI thread. One worker thread runs every CLI call, answer jobs ahead of queued reads, each child under a timeout, and sends every result over one `std::sync::mpsc` channel. Each read carries its surface's generation and the reducer drops a read whose generation is older than the newest issued for that surface. An answer result is never dropped. |
| REQ-007 | The loop takes its events from a source the caller supplies, so a test feeds a key, a resize or a closed input without a terminal. A closed input is one event, and the loop returns 0 on it. |
| REQ-008 | `crates/bots-tui/tests/fixtures/bots` answers `status`, `activity`, `inbox` and `routines` by printing the payload file for its verb from `tests/fixtures/payloads/`, copied from `design/payloads/`, and its `status --json` carries the `lastRun.branch` and `lastRun.worktreePath` keys 004 adds. It takes `--fixture-log <path>` and `--fixture-scenario <name>` as leading arguments, so each test passes a temp log and a scenario through the program-plus-arguments seam rather than sharing one file or one environment variable. The scenarios cover a good read, an empty payload, a read failure, a refusal by name, a slow child and a warning on stderr. It is committed mode 0755, and it is the only payload source in tests: no test reads a live state root and no test needs a tty. Every no-write test first asserts that the same log recorded the reads. The scenario names are `ok`, the default, `empty`, `fail-<verb>`, where that verb exits 1 with `bots: index locked` and every other verb answers as `ok`, `refuse-<reason>`, where `answer` exits 4 with `bots: <reason>`, `slow`, where every call sleeps 2 seconds first so a test with a 1 second `read_timeout` sees the kill. The last is `warn`, where `inbox` exits 0 and writes `bots: item <id> did not read` to stderr. |
| REQ-009 | `.github/workflows/bots-runtime.yml` gains two path entries and one `bots-tui` job that installs a pinned toolchain with `dtolnay/rust-toolchain@1.92.0` plus the `clippy` and `rustfmt` components, then runs `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings` and `cargo test`, every one of them with `--locked`. The job also builds the release profile the `ui` verb starts, runs the `diff` checks SC-006 names that keep `crates/bots-tui/design/` equal to the packet's copies, and names its runner, its cache and its timeout. The ref is the toolchain version rather than `stable`, so a runner image change cannot move the compiler under the job. |
| REQ-010 | `model.rs` parses each payload with serde types that carry a default for every optional key, and keeps a state value the mapping does not name as `Unknown(raw)` rather than dropping the row, so a runtime value added later draws instead of vanishing. |
| REQ-011 | When the input closes while an item is selected, the binary writes no answer and exits 0, and `bots inbox --json` still lists the item as open. The loop takes its events from a source the caller supplies, so a closed input is one event a lib test feeds without a terminal, and that test asserts the fixture recorded no `answer` argv. |
| REQ-012 | `state.rs` is a pure reducer, `update(state, msg) -> Vec<Effect>`, with the effects `Fetch`, `Answer { id, text, scope }` and `Quit`. Each surface is a `Remote<T> { rows, last_ok_at, error, in_flight, generation }`, and each pane keeps its own `PaneView` keyed by the row key `design/architecture.md` names, never a row index. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-013 | The screen re-reads the inbox, the visible tab and the status on a 5-second poll and on every tab switch, issuing at most three spawns per refresh and never a second fetch for a surface already in flight. The inbox is read first because it drives the banner. A successful answer issues no read of its own: the row keeps its outcome word and the answered item stays drawn until the next poll's successful inbox read, and a read issued before the answer cannot clear the mark. |
| REQ-014 | A CLI call that exits non-zero draws the first line of its stderr in the status row and keeps the rows from the last successful call, and the header shows the age of the last good read, so a failure never blanks the screen. |
| REQ-015 | Every `bots` child `cli.rs` spawns runs with stdin null and never with `--as`, because phase 001 refuses `--as` without a tty, so a read never waits on the terminal and a write never claims an actor the screen cannot prove. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:164] |
| REQ-016 | `crates/bots-tui/design/` carries 001's four documents - `mockups.md`, `key-map.md`, `glyph-table.md` and `component-inventory.md` - plus this child's `architecture.md` and `contracts.md`, copied unchanged when the crate is created, so the mockups ship beside the code they describe and 006's pointer check has a folder to read. A later edit to one of the six is made in the packet's copy and copied again, and the `bots-tui` CI job runs the same `diff` checks, so the two copies cannot drift unnoticed. |
| REQ-017 | `crates/bots-tui/tests/common/` holds the two helpers every later child's tests share. The frame loader reads a frame from `design/mockups.md` by its heading and its size and returns the cells, so a snapshot compares every cell against the frame the design draws rather than a block typed into the test. The fixture helper builds a `Program` for the fixture with a temp log path and a scenario name, so no test shares a log or an environment variable. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cargo build --release --manifest-path crates/bots-tui/Cargo.toml` exits 0 and `ls crates/bots-tui/target/release/bots-ui` prints the path.
- **SC-002**: `cargo test --manifest-path crates/bots-tui/Cargo.toml --test cli_client` prints `test result: ok`, and the fixture's argv log carries the four reads and the one write.
- **SC-003**: `T=$(mktemp -d); node .skilled/bin/bots.cjs ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-unavailable`, and the same command after `mkdir -p "$T/crates/bots-tui"` exits 4 and prints `ui-not-built`.
- **SC-004**: `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib` prints `test result: ok` and names `restore_runs_on_panic`, `signal_becomes_terminate_event`, `closed_input_writes_nothing` and `stale_generation_is_dropped`.
- **SC-005**: `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` prints one line and `rg -c -e "- 'crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml` prints 2, and `rg -n 'dtolnay/rust-toolchain@1.92.0' .github/workflows/bots-runtime.yml` prints the toolchain step.
- **SC-006**: `ls crates/bots-tui/design` prints 001's four documents plus `architecture.md` and `contracts.md`. `diff -r -x architecture.md -x contracts.md specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design crates/bots-tui/design` prints nothing, `diff` of each of `architecture.md` and `contracts.md` against `002-architecture-and-contracts/design/` prints nothing, and `diff` of each of the four canonical payload files in `002-architecture-and-contracts/design/payloads/` against `crates/bots-tui/tests/fixtures/payloads/` prints nothing. The payload files are copied into the fixtures folder, not into `crates/bots-tui/design/`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001's approved key map and component inventory | The module map has no approved component list to follow, so this child invents a second one | The module map is read from 001's inventory, and this child starts after 001 closes |
| Dependency | The four `--json` contracts from 001, 002 and 004 | The client cannot be written against a real payload | The client is written against the fixture, which carries the documented shapes, so it is testable before those verbs land |
| Dependency | A stable Rust toolchain with `clippy` and `rustfmt` | The crate cannot build or lint | `cargo 1.92.0` is installed here, and the CI job installs its own pinned toolchain |
| Risk | A GPL-3.0 design reference invites copying | High | Clean room: a worker that writes `terminal.rs`, `theme.rs`, the overlay keys or the overlay view gets this packet's design files and MIT or Apache references only, and an openhuman or tinychannels path appears in a design document as provenance, never in a worker brief. The orchestrator compares the finished guard and overlay with the openhuman files by eye and records that it did. The crate README records the reference, and `rg -n 'openhuman' crates/bots-tui/src` must match only comment lines |
| Risk | A panic leaves the terminal in raw mode | Medium | The guard restores on drop and chains a restore in front of the panic hook, and a test drives a panic through it |
| Risk | A killed process leaves the terminal in raw mode | Medium | The handler only sets a flag. The event source turns it into a Terminate message, and the guard's Drop restores, proven by signal_becomes_terminate_event |
| Risk | A blocking spawn on the loop thread freezes input | Medium | Every call runs on the worker thread, and a test asserts the loop thread spawns nothing |
| Risk | A stale read overwrites a newer one | Medium | Every read carries its surface's generation and the reducer drops one older than the newest issued |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One refresh spawns at most three `bots` processes, and the loop thread spawns none, so a 0.18 to 0.34 s call never blocks a keypress.
- **NFR-P02**: A key event reaches the reducer within one 100 ms poll, because the reader polls at that interval and no spawn runs on its thread.

### Security
- **NFR-S01**: The binary reads no credential and adds no environment variable to the CLI it spawns; the child inherits the parent environment unchanged.
- **NFR-S02**: The answer text reaches the runtime only through `bots answer`, which already refuses a secret literal before it stores the answer. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:1-14]

### Reliability
- **NFR-R01**: The terminal is restored on every exit path, including a panic and a signal.
- **NFR-R02**: A CLI failure never blanks the screen; the rows from the last successful call stay until a later call succeeds.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no bot, no item and no routine - the frame draws empty, the loop keeps polling, and the binary exits 0 on a closed input.
- Maximum input: 2,000 activity rows - the payload parses into typed rows and the draw visits at most the body height's rows, as 004 REQ-025 proves.
- Failure path: `bots status --json` exits 1 - the first stderr line goes to the status row, the previous rows stay, and the binary does not exit.
- Closed input: the input closes with an item selected - nothing is written, the binary exits 0, and the item stays open.
- Absent binary: `bots ui` with the crate present and no built binary - exits 4 with `ui-not-built` and the build command, and starts nothing.
- Stale binary: `bots ui` with a binary whose contract number differs - exits 4 with `ui-contract-mismatch` and the rebuild command, and starts nothing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | One new crate of nine source files and two test files, one CLI verb, one CI job |
| Risk | 10/25 | No auth, no migration and no shared contract change; a new binary and a new dependency set |
| Research | 6/20 | The design references are read once; the JSON contracts belong to phases 001 and 002 of the parent build |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the crate commit a `Cargo.lock`? Decision: yes, because the crate ships a binary and a floating dependency graph would make the CI job's result depend on the day it ran.
- Does the `ui` verb read `BOTS_UI_BIN`? Decision: yes, as a test seam only. The shipped path resolves the binary from `--skilled-tree`, and the variable lets the verb's tests name a stub without building the crate.
- Does the `ui` verb check the binary's contract number? Decision: yes. `bots-ui --version` prints the crate version and the contract number `design/contracts.md` fixes, and the verb refuses a binary whose number differs, so a build from before a payload change cannot draw a stale contract.
- Does the loop need an async runtime? Decision: no. One reader thread and one worker thread over `std::sync::mpsc` carry every event, and openhuman's tokio dependency exists for the core it embeds, which this binary does not have. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/Cargo.toml:76-82]
- What does the empty frame draw? Decision: a blank frame in the terminal's own background, so 003 adds the header and tabs without moving the loop or the guard.
- Does this child own the control-character filter? Decision: no. 003 owns it in `theme.rs`, because the status row draws runtime text before any pane exists, and one filter with one behaviour is what keeps the two from disagreeing. The crate holds no `sanitize.rs`.
- Does the `ui` verb read `NO_COLOR`? Decision: yes, and it passes `--mono`. It passes `--ascii` when the caller asks. The binary reads no environment variable, so every no-env::var check holds and the palette is chosen by a flag rather than by the environment.
- Does the crate ship 001's `design/`? Decision: yes, copied unchanged into `crates/bots-tui/design/` when the crate is created, because the parent's open question puts the shipped copy beside the code and 006's pointer check reads that folder.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`, whose Phase Documentation Map names this child's scope and exit
- **Parent Goal**: `../goal.md`, whose binding row for this phase makes this packet's `goal.md` authoritative for it
- **Parent Decisions**: `../decision-record.md`, which records Q002 to Q009
- **Research**: `../research/ui-advisory.md`, whose row for this child is the scope and exit above
- **Pre-expansion documents**: `../context/legacy-003/`, gitignored, kept for reference only
- **Sibling children**: `../001-ux-and-component-map/`, `../003-shell-and-navigation/`, `../004-panes/`, `../005-answer-flow/`, `../006-hardening-and-proof/`
