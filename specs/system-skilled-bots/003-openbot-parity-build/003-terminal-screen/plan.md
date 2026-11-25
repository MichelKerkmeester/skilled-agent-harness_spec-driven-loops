---
title: "Implementation Plan: Phase 3: terminal-screen"
description: "One MIT Rust ratatui crate at `crates/bots-tui/`, one `ui` verb in the bots CLI, and a fixture-driven test seam carrying the payloads phases 001 and 002 ship, so the three panes are provable without a live state root."
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
| **Language/Stack** | Rust, 2021 edition, one package with a library and a binary target |
| **Framework** | ratatui 0.30 with crossterm 0.29, no async runtime |
| **Storage** | None. Every read is one `bots ... --json` call, and the one write is `bots answer` |
| **Testing** | `cargo test` for unit, `TestBackend` render and fixture-driven integration; vitest for the `ui` verb |

### Overview
The crate lives at `crates/bots-tui/` rather than under `.skilled/`, because `.opencode/` mirrors `.skilled/` wholesale and a crate inside the skill would be duplicated into that mirror along with its build output. The binary is `bots-ui`, and `.skilled/bin/bots.cjs` gains one `ui` verb that resolves it from the repository root, execs it with `--repo` and `--skilled-tree`, and passes the exit code through. Inside the crate, `lib.rs` is the library root that holds the terminal guard and the loop entry, with each module task adding its own `pub mod` line, so `cargo test --lib` runs the unit tests and `tests/*.rs` imports the modules, while `main.rs` is the binary that calls it. `cli.rs` is the only module that spawns a process, `ui_state.rs` holds pure state with no I/O, and `keys.rs` holds one table that both binds a key and supplies the label the renderer draws, so a key cannot be bound without appearing on screen. The proof is `cargo test`: a `TestBackend` render test asserts every bound label appears in the drawn buffer, and a fixture `bots` script carries the payloads phases 001 and 002 ship, so the client is tested without a live state root.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `$BOTS ui` prints `bots: unknown verb: ui` and exits 2, the measured gap this phase closes
- [ ] `cargo --version`, `rustc --version`, `cargo clippy --version` and `cargo fmt --version` each print a stable toolchain, so the three Definition of Done commands can run before the crate exists
- [ ] Phases 001 and 002 are closed, so `bots activity --json`, `bots inbox --json` and `bots routines --json` exist

`$BOTS`, `$CRATE` and `$STATE` are the three shell variables `tasks.md` sets.

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cargo test` in `crates/bots-tui` prints `test result: ok` for every target
- [ ] `cargo clippy --all-targets -- -D warnings` and `cargo fmt --check` exit 0
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` passes, including `cli-ui.vitest.ts`
- [ ] `test -L .opencode/bin && test -L .opencode/skills` exits 0, so the edited CLI and hub line land once through the symlinks
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure state, one renderer, one process boundary.

### Key Components
- **`lib.rs` and `main.rs`**: the library root and the binary. `lib.rs` parses arguments, holds the terminal guard with its restore and panic hook, and owns the loop entry, and each module task adds its own `pub mod` line to it, so every one of those is reachable from `cargo test --lib` as soon as its task lands. `main.rs` calls it and maps the result to the exit code.
- **`cli.rs`**: the only module that spawns a process. It takes the program and its arguments from its caller, defaulting to `node` plus `<skilled-tree>/.skilled/bin/bots.cjs`, so the tests point it at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")`. One function per surface, each returning typed rows or an error carrying the child's stderr, so no other module can reach the runtime.
- **`ui_state.rs`**: pure state with no I/O - active tab, selection, overlay, rows, status line and palette. A test drives it with a key and asserts the next state without a terminal.
- **`keys.rs`**: one table of key-to-action rows, each carrying the label the renderer draws. Binding and drawing read the same row, so REQ-010 holds by construction rather than by review.
- **`activity.rs`**: the six markers and the seven group ids they map to, read from the `state` each row carries, plus the mapping from the runtime's exit vocabulary. `scheduled` and `recurring` share `?`. An unmapped value draws `?` with the raw value beside it.
- **`render.rs`, `render/panes.rs`, `render/overlay.rs`**: the frame, the four pane bodies and the overlay panel. They read state and write cells, nothing else.
- **`app.rs`**: the loop. It takes an event from the source the caller supplies, asks `keys.rs` for the action, runs it through `cli.rs` or `ui_state.rs`, and redraws. An Esc and a closed input are two events it can receive, so a lib test drives each path without a terminal and reads the fixture's argv log to prove neither wrote an answer.

The module split follows openhuman-tui's source map, which keeps pure navigation state apart from the renderer and the event loop, and which is what makes a render test possible without a terminal. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/ui_state.rs:1] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:1] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/activity.rs:1] The crate adds no async runtime, because every read is one blocking `Command::output()` and openhuman's tokio dependency exists for the core it embeds, which this binary does not have. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/Cargo.toml:76-82]

### Data Flow
A key event reaches `app.rs`, which asks `keys.rs` for an action. The loop takes its events from a source the caller supplies, so a test feeds a key or a closed input without a terminal. A read action calls `cli.rs`, which spawns `<program> <verb> --json --repo <repo>`, where the program and its arguments default to `node <skilled-tree>/.skilled/bin/bots.cjs` and the tests pass `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")`, then parses the payload into typed rows and hands them to `ui_state.rs`. A write action calls `cli.rs` once with `bots answer <item-id> <text> --scope once|deny`. `render.rs` then draws one frame from the state. A refresh is four read calls in sequence, one per surface, and a failed call leaves the previous rows in place while its stderr goes to the status row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/bin/bots.cjs` | Owns the verb set, the usage text and the exit codes | update - add the `ui` verb and its two refusals | `node .skilled/bin/bots.cjs ui` exits 4 with `ui-not-built` when the crate is present and the binary is absent, and with `ui-unavailable` when the crate is absent |
| `crates/bots-tui/` | New consumer of the JSON verbs | create | `cargo test` passes |
| `bots status --json` | Producer of the header's bot count and staleness flag | unchanged here; 004 adds `lastRun.branch` and `lastRun.worktreePath`, which the header ignores and the fixture carries | `node .skilled/bin/bots.cjs status --json` still exits 0, and the count is the rows whose `kind` is `bot` |
| `bots activity --json`, `bots inbox --json`, `bots routines --json` | Producers owned by phases 001 and 002 | not a consumer - this phase reads them and changes none | `rg -n 'activity|routines' .skilled/bin/bots.cjs` shows no new verb beyond `ui` |
| `bots answer` | The one write path, which gains `--scope once\|deny` in phase 001 | unchanged | `node .skilled/bin/bots.cjs answer <id> deny --scope deny` still exits 0 |
| `.skilled/skills/system-skilled-bots/SKILL.md` | Names which mode owns each verb | update - one line naming `bots ui` as a status surface | `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints one line |
| `.github/workflows/bots-runtime.yml` | Runs the runtime suites on the skill's paths | update - two path entries and one `bots-tui` job that installs a pinned toolchain with `dtolnay/rust-toolchain@stable` plus the `clippy` and `rustfmt` components, the repository's first Rust build | `rg -n 'bots-tui' .github/workflows/bots-runtime.yml` prints three lines, and `rg -n 'rust-toolchain\|cargo test' .github/workflows/bots-runtime.yml` prints the toolchain step and the test step |

Required inventories:
- Same-class producers: `rg -n "'  [a-z]+ " .skilled/bin/bots.cjs` lists every usage line, so a new verb cannot be added without a usage line beside it.
- Consumers of changed symbols: `rg -n 'bots.cjs' .skilled/skills/system-skilled-bots/ --glob '*.md'` names every doc that quotes the CLI.
- Matrix axes: four surfaces read (status, activity, inbox, routines) by three outcomes (exit 0 with rows, exit 0 with no rows, exit non-zero), plus the one write by two keys (`y`, `n`) and the closed-input case.
- Algorithm invariant: the binary writes only through `bots answer`, and only when a key names an answer. A closed input, an Esc, or a key that names no answer writes nothing.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the one `--json` contract that exists today and the three phases 001 and 002 add, plus the six openhuman design files, then confirms an empty crate builds. Implementation writes the crate's state, key table, client, renderer and overlay, each task declaring its own module in the library root, then adds the `ui` verb to `bots.cjs`. Verification runs `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo test`, the runtime's `cli-ui.vitest.ts`, and one manual answer against this repository.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:external-orchestration -->
## External orchestration

The build runs as seven waves of external CLI workers. Each wave names its tasks, one executor per lane, the effort tier, how many workers run at once, and the check the orchestrator runs before the next wave starts. The hub routes every dispatch and each mode's own `SKILL.md` owns its argv, so this section names the route and the effort, never a command line. [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:26] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:31]

### Executors and how each one expresses effort

| Executor | Model | Effort lever | `high` | `max` |
|----------|-------|--------------|--------|-------|
| `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking <tier>` | `--thinking high` | `--thinking max` |
| `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#<tier>` on the model id | upgraded to `max` | `#max` |
| `cli-mistral-vibe` | `deepseek-flash` | none; the row's `thinking` field | not available | the row's `max` |
| `cli-devin` | `deepseek-v4-1-flash-high` / `deepseek-v4-1-flash-max` | the model id | `deepseek-v4-1-flash-high` | `deepseek-v4-1-flash-max` |
| `cli-codex` | `gpt-6-luna` | `-c model_reasoning_effort` | `high` | `xhigh`, the tier this packet uses; `max` is the model's ceiling |

Three of those levers are narrower than the table's two columns suggest, and each one is a fact from its own packet rather than a preference. `cli-mistral-vibe` has no reasoning flag at all: effort is the roster row's `thinking` field and `max` is a property of the row, so a Vibe dispatch cannot be lowered to `high`. [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89] `cli-opencode`'s `opencode-go/deepseek-v4.1-flash` route is pinned to the max thinking tier by policy, so a `#high` request is upgraded rather than honored. [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:146] `cli-devin` carries the tier in the model id and has no headless effort flag. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156]

The other two need one fact each. `cli-pi`'s ladder is `low`, `high` and `max`, with `medium` and `xhigh` folding into `high`, so `--thinking high` is the only way this packet asks for the middle tier. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101] `cli-codex` keeps `gpt-6-luna` and the `fast` service tier unless a task names otherwise, and `xhigh` is the tier this packet asks for on its hardest wave. [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125]

### The parallelism rule

A lane is the unit of parallelism, and two lanes never hold the same file. The worker count is therefore the number of lanes whose file sets are disjoint, not the number of tasks in the wave.

`crates/bots-tui/src/lib.rs` is the binding file. Every module task adds its own `pub mod` line to it, so T008 through T017 form one serial lane by construction, and the parallelism in this packet comes from the lanes beside that one: the CLI verb, the CI job, the hub line, the verb tests and the crate README. `src/render.rs` binds T013, T014 and T015 the same way, and `crates/bots-tui/README.md` binds T004 to T023, so those pairs never run at once.

### The waves

#### Wave 1 - Setup probes and scaffolding

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T001, T002, T003 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | none; three read-only probes |
| B | T005, T007 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `crates/bots-tui/Cargo.toml`, `.gitignore` |
| C | T004 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `crates/bots-tui/README.md` |

**Workers:** 3. **Verify:** `cargo metadata --manifest-path crates/bots-tui/Cargo.toml --no-deps --format-version 1` exits 0 and prints `"name":"bots-tui"`; `git check-ignore -v crates/bots-tui/target/release/bots-ui` prints the `/crates/bots-tui/target/` line; `rg -n 'openhuman' crates/bots-tui/README.md` prints one line.

#### Wave 2 - Crate skeleton

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T006 | `cli-mistral-vibe` · `deepseek-flash` · row `max` | `crates/bots-tui/src/lib.rs`, `crates/bots-tui/src/main.rs` |

**Workers:** 1, because the lane holds the library root every later module task edits. **Verify:** `cargo build --release --manifest-path crates/bots-tui/Cargo.toml` exits 0; `ls crates/bots-tui/target/release/bots-ui` prints the path; `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib` exits 0.

#### Wave 3 - Pure state and the two tables

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T008, T009, T010 | `cli-opencode` · `opencode-go/deepseek-v4.1-flash` · `#max` | `src/lib.rs`, `src/activity.rs`, `src/keys.rs`, `src/ui_state.rs` |

**Workers:** 1, serial inside the lane because all three tasks add a `pub mod` line to `src/lib.rs`. **Verify:** `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib activity`, `--lib keys` and `--lib ui_state` each print `test result: ok`.

#### Wave 4 - Process boundary, verb, CI and the hub line

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T011, T012 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max` | `src/cli.rs`, `src/lib.rs`, `tests/fixtures/bots`, `tests/cli_client.rs` |
| B | T018 | `cli-mistral-vibe` · `deepseek-flash` · row `max` | `.skilled/bin/bots.cjs` |
| C | T021, T024 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `.skilled/skills/system-skilled-bots/SKILL.md`, `.github/workflows/bots-runtime.yml` |

**Workers:** 3. Lane A runs T011 before T012, because the integration test imports the client. **Verify:** `cargo test --manifest-path crates/bots-tui/Cargo.toml --test cli_client` prints `test result: ok`; `git ls-files -s crates/bots-tui/tests/fixtures/bots` prints `100755`; `T=$(mktemp -d); node .skilled/bin/bots.cjs ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-unavailable`, and the same command after `mkdir -p "$T/crates/bots-tui"` exits 4 and prints `ui-not-built`; `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints one line; `rg -c 'bots-tui' .github/workflows/bots-runtime.yml` prints 3.

#### Wave 5 - Renderer, verb tests and the crate README

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T013, T014, T015 | `cli-opencode` · `opencode-go/deepseek-v4.1-flash` · `#max` | `src/render.rs`, `src/lib.rs`, `src/render/panes.rs`, `src/render/overlay.rs`, `tests/render_keys.rs` |
| B | T020 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `.skilled/skills/system-skilled-bots/runtime/tests/cli-ui.vitest.ts` |
| C | T023 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `crates/bots-tui/README.md` |

**Workers:** 3. Lane A runs T013 first, because T014 and T015 both declare a `mod` in `src/render.rs`. **Verify:** `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` prints `test result: ok`; `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- cli-ui` prints `cli-ui.vitest.ts` and no `failed`; `rg -n 'no code' crates/bots-tui/README.md` prints one line.

#### Wave 6 - Loop and library root

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T016, T017 | `cli-codex` · `gpt-6-luna` · `-c model_reasoning_effort="xhigh" -c service_tier="fast"` | `src/app.rs`, `src/lib.rs`, `src/main.rs` |
| B | T019, T022 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | none; two symlink proofs |

**Workers:** 2. This is the packet's hardest wave: the loop, the terminal guard, the panic hook and the exit path are the four places a mistake leaves a terminal in raw mode, so it takes the highest tier the roster offers. **Verify:** `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib app` prints `test result: ok` and names `esc_closes_overlay_and_writes_nothing`; `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib restore` prints `test result: ok` and names `restore_runs_on_exit` and `restore_runs_on_panic`; `test -L .opencode/bin && test -L .opencode/skills` exits 0.

#### Wave 7 - Verification gates

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T031 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `src/app.rs` |
| Orchestrator | T025, T026, T027, T028, T029, T032 | none; the orchestrator runs them itself | none |

**Workers:** 1. T030 is the operator's, by hand, because the overlay is driven by keystrokes no piped command delivers. **Verify:** `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0; `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0; `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target; `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints no `failed`; `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines; `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib closed_input` prints `test result: ok`; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen --strict` prints `RESULT: PASSED`.

### What every dispatch carries

The hub's own rules bind each dispatch, not only the wave table. The orchestrator reads the target mode's `SKILL.md` before composing the prompt, attaches the resolved agent persona, and sets `AI_SESSION_CHILD=1` with the shared child preamble. [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:31] Every non-interactive dispatch redirects stdin, because a run that leaves it open hangs with no output rather than failing. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:130] A `cli-pi` dispatch also passes `--offline`, and a `cli-devin` dispatch puts `--` before the prompt. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:84] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:243]

A worker's `done` is a claim until the orchestrator runs that wave's verify commands and reads their output and exit status. A wave that fails its verify does not hand its files to the next wave.

### Fallback order when a CLI runs out of usage

A wave whose named executor runs out of usage moves down this ladder from the next rung, and keeps its effort tier: a `high` wave falls back to a `high` dispatch and a `max` wave to a `max` dispatch. A wave already on the last rung stops and reports rather than dropping its tier.

| Rung | Executor | Why it sits here |
|------|----------|------------------|
| 1 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` | DevPass bills per token, and this route sits under the gateway's Premium threshold, so it carries no weekly cap |
| 2 | `cli-opencode` · `opencode-go/deepseek-v4.1-flash` | The Go gateway's subsidized usage rate, and it needs its own login before it answers |
| 3 | `cli-mistral-vibe` · `deepseek-flash` | The Vibe budget, which a `402 API budget exhausted` ends |
| 4 | `cli-devin` · `deepseek-v4-1-flash-max` | A weekly quota, so it is probed with a trivial read-only call before a real task is handed to it |
| 5 | `cli-codex` · `gpt-6-luna` · `xhigh` · `fast` | The most expensive reasoning on the roster, kept for the hardest wave and for last |

Two rungs can refuse before they spend anything, and the ladder treats a refusal as a rung that is out of usage. `cli-mistral-vibe` refuses to load when `VIBE_SESSION=1` is set, which is the case in a Vibe-hosted orchestrator, so that orchestrator skips rung 3. [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67] `cli-devin`'s quota banner is not proof of exhaustion, because a free-tier model still dispatches at `Pro · 0% remaining`, so rung 4 is probed rather than assumed. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237]
<!-- /ANCHOR:external-orchestration -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `keys.rs` mapping, `activity.rs` status table, `ui_state.rs` selection and overlay, the terminal guard's restore, and the loop's closed-input exit and Esc close | `cargo test --lib` |
| Render | every bound key appears in a `TestBackend` buffer at 80x24 and at 120x40 | `cargo test --test render_keys` |
| Integration | `cli.rs` against `tests/fixtures/bots`, a script that prints canned JSON and records its argv | `cargo test --test cli_client` |
| CLI verb | `bots ui` argv, exit passthrough, the `ui-unavailable` refusal for an absent crate and the `ui-not-built` refusal for an absent binary | `npm --prefix .skilled/skills/system-skilled-bots/runtime test` |
| Manual | one item answered from the screen, read back through the item file under `$STATE` and `bots status --json`. This row needs a tty by design, because the overlay is driven by keystrokes; the Esc close is a lib test, so it needs none | `bots ui`, then `jq -e '.answer.text' $STATE/*/needs-you/<item-id>.json` |

The fixture script is the seam that keeps the crate's tests off a live state root: it answers `activity`, `inbox`, `routines` and `status` with the payloads phases 001 and 002 ship, its `status --json` carries the `lastRun.branch` and `lastRun.worktreePath` keys 004 adds, and it appends each invocation's argv to a log file the test reads. Every payload sits inline in the script, one branch per verb, so a phase that adds a key greps the script for it rather than a sibling file. The client takes the program and its arguments, so the tests point it at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")` and the binary's default stays `node <skilled-tree>/.skilled/bin/bots.cjs`. It is also the copy of every `--json` contract the screen reads, so a phase that changes one of those payloads updates the fixture in the same change. The render test is the mechanical proof of REQ-010, because it asserts the drawn buffer contains each label `keys.rs` binds.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Rust stable toolchain | External | Green | The crate cannot build. `cargo 1.92.0` is installed on this machine |
| Rust on the CI runner | External | Yellow | The `bots-tui` job cannot build. The job installs `dtolnay/rust-toolchain@stable` with the `clippy` and `rustfmt` components, and it is the repository's first Rust build |
| ratatui 0.30, crossterm 0.29, serde, serde_json, unicode-width | External | Green | The frame cannot draw or the payload cannot be parsed |
| Phase 001's `bots activity --json` and `bots inbox --json` | Internal | Yellow | The activity and inbox panes read the fixture only |
| Phase 001's `bots answer --scope once\|deny` flag | Internal | Yellow | The screen cannot record a deny as a deny, and every answer would record `once` |
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
