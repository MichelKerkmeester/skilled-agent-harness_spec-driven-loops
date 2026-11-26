---
title: "Implementation Plan: Phase 2: architecture-and-contracts"
description: "One MIT Rust crate at `crates/bots-tui/` with a terminal guard, a worker data layer and a CLI client, one `ui` verb in the bots CLI, one fixture-driven test seam, and one CI job, so every later terminal-screen child builds on a proven skeleton."
trigger_phrases:
  - "architecture and contracts plan"
  - "bots-tui crate plan"
  - "bots ui verb plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: architecture-and-contracts

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
| **Testing** | `cargo test` for unit and fixture-driven integration, and vitest for the `ui` verb |

### Overview
The crate lives at `crates/bots-tui/` rather than under `.skilled/`, because `.opencode/` mirrors `.skilled/` wholesale and a crate inside the skill would be duplicated into that mirror along with its build output. The binary is `bots-ui`, and `.skilled/bin/bots.cjs` gains one `ui` verb that resolves it from the repository root, execs it with `--repo` and `--skilled-tree`, and passes the exit code through. The verb also reads `NO_COLOR` and passes `--mono`, and passes `--ascii` when the caller asks, so the binary reads no environment variable of its own and the palette is chosen by a flag. Inside the crate, `lib.rs` is the library root that holds the terminal guard and the loop entry, `main.rs` is the binary that calls it, `cli.rs` is the only module that spawns a process, `state.rs` holds a pure reducer with no I/O, `data.rs` owns the worker thread and the generation-tagged channel, and `terminal.rs` owns the guard. The proof is `cargo test`: a fixture `bots` script carries the four payloads, so the client is tested without a live state root, and a lib test drives the loop with a closed input so the no-write rule is proven without a tty. 001's four design documents are copied unchanged into `crates/bots-tui/design/` when the crate is created, so the mockups ship beside the code they describe and 006's pointer check has a folder to read.

This child draws one empty frame and no pane. That is deliberate: the loop, the guard and the process boundary are the three places a mistake costs a terminal or a wrong answer, so they land and are proven before any surface draws into them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs ui` prints `bots: unknown verb: ui` and exits 2, the measured gap this child closes
- [ ] `cargo --version`, `rustc --version`, `cargo clippy --version` and `cargo fmt --version` each print a stable toolchain, so the three Definition of Done commands can run before the crate exists
- [ ] 001-ux-and-component-map is closed, so the module map follows an approved component inventory
- [ ] The four `--json` shapes are read from phases 001 and 002 of the parent build, so the fixture carries a documented payload rather than an invented one

`$CRATE` and `$BOTS` are the two shell variables `tasks.md` sets.

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target
- [ ] `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` and `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exit 0
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` passes, including `cli-ui.vitest.ts`
- [ ] `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` prints one line and `rg -c -e "- 'crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml` prints 2, the job pins `dtolnay/rust-toolchain@1.92.0`, and `rg -n -e '--locked' .github/workflows/bots-runtime.yml` prints the cargo steps
- [ ] `diff -r -x architecture.md -x contracts.md specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design crates/bots-tui/design` prints nothing, `diff` of each of `architecture.md` and `contracts.md` against `002-architecture-and-contracts/design/` prints nothing, and `diff` of each of the four payload files in `002-architecture-and-contracts/design/payloads/` against `crates/bots-tui/tests/fixtures/payloads/` prints nothing
- [ ] Docs updated (spec/plan/tasks/acceptance criteria)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure state, one renderer, one process boundary, one worker thread.

### Key Components
- **`lib.rs` and `main.rs`**: the library root and the binary. `lib.rs` parses arguments, including `--mono` and `--ascii`, holds the terminal guard, owns the loop entry and declares one `pub mod` line per module, so `cargo test --lib` reaches every module and `tests/*.rs` imports them. `main.rs` calls it and maps the result to the exit code.
- **`terminal.rs`**: the RAII guard. It enters raw mode and the alternate screen, restores on `Drop`, chains a restore in front of the process panic hook, and installs a `SIGTERM`, `SIGHUP` and `SIGINT` handler that only sets a flag, so a panic or a killed process leaves a usable terminal and a readable backtrace. The shape is openhuman's, read as design and copied as no code. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/terminal.rs:75-118]
- **`event.rs`**: the event source the caller supplies. It yields a key, a resize or a closed input, so a test drives the loop with no terminal. The reader polls every 100 ms, which is the openhuman interval. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs:113-120]
- **`state.rs`**: the pure reducer, `update(state, msg) -> Vec<Effect>`, with the effects `Fetch`, `Answer { id, text, scope }` and `Quit`. Each surface is a `Remote<T> { rows, last_ok_at, error, in_flight, generation }`, and each pane keeps a `PaneView` keyed by its row key, as `design/architecture.md` section 1.4 names, because the 5-second poll reorders rows. A test drives it with a message and asserts the next state and the effects, with no process involved.
- **`data.rs`**: the worker thread and the generation-tagged channel. One thread runs every CLI call and sends its result over one `std::sync::mpsc` channel tagged with a generation number, and the reducer drops a read whose generation is older than its surface's newest, and never drops an answer result. This is the fix for the measured freeze: `bots status --json` took 0.18 to 0.34 s, so several sequential spawns on the loop thread froze input about a second every 5 s.
- **`cli.rs`**: the only module that spawns a process. It takes the program and its arguments from its caller, defaulting to `node` plus `<skilled-tree>/.skilled/bin/bots.cjs`, so the tests point it at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")`. One function per surface, each returning typed rows or an error carrying the child's stderr, so no other module can reach the runtime.
- **`model.rs`**: serde types with a default for every optional key, and an unknown state kept as `Unknown(raw)` rather than dropped, so a runtime value added later draws instead of vanishing.
- **`app.rs`**: the loop. It takes an event from the source, asks `state.rs` for the next state and its effects, hands the effects to `data.rs`, and draws one empty frame. An Esc and a closed input are two events it can receive, so a lib test drives each path without a terminal and reads the fixture's argv log to prove neither wrote an answer.

The module split follows openhuman-tui's source map, which keeps pure navigation state apart from the renderer and the event loop, and which is what makes a test possible without a terminal. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:1] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/activity.rs:1] The crate adds no async runtime, because every read is one child the worker polls with `try_wait` and kills at its deadline, and openhuman's tokio dependency exists for the core it embeds, which this binary does not have. A blocking `Command::output()` would hold the worker past the deadline and could not be killed, so `cli.rs` spawns the child, reads its pipes on two scoped threads and polls the exit. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/Cargo.toml:76-82]

### Data Flow
A key event reaches `app.rs` from the source the caller supplies. `app.rs` asks `state.rs` for the next state and its effects. A `Fetch` effect goes to `data.rs`, which sends it to the worker thread. The worker calls `cli.rs`, which spawns `<program> <verb> --json --repo <repo>`, parses the payload into `model.rs` types and sends the result back tagged with the generation it was issued under. The reducer drops a read older than its surface's newest generation, stores a current one, and the loop redraws. An `Answer` effect goes the same way, as one `bots answer --scope once|deny --repo <repo> -- <item-id> <text>` call. A refresh is at most three reads, the inbox first because it drives the banner, and a failed call leaves the previous rows in place while its first stderr line goes to the status row. A successful answer issues no read of its own, so the row keeps its outcome word until the next poll's successful inbox read.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/bin/bots.cjs` | Owns the verb set, the usage text and the exit codes | update - add the `ui` verb, its three refusals and its two display flags | `T=$(mktemp -d); node .skilled/bin/bots.cjs ui --repo . --skilled-tree "$T"` exits 4 with `ui-unavailable`, and with `mkdir -p "$T/crates/bots-tui"` exits 4 with `ui-not-built`. The `--mono` and `--ascii` pass-through is proven by `cli-ui.vitest.ts`, which reads the stub's recorded argv |
| `crates/bots-tui/` | New consumer of the JSON verbs | create | `cargo test --manifest-path crates/bots-tui/Cargo.toml` passes |
| `crates/bots-tui/design/` | 001's four documents, authored in the packet | create - copy the four unchanged, then copy this child's `architecture.md` and `contracts.md` beside them | `diff -r -x architecture.md -x contracts.md specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design crates/bots-tui/design` prints nothing, and `diff` of each of `architecture.md` and `contracts.md` against `002-architecture-and-contracts/design/` prints nothing |
| `bots status --json` | Producer of the header's bot count and staleness flag | unchanged here, and 004 adds `lastRun.branch` and `lastRun.worktreePath`, which the header ignores and the fixture carries | `node .skilled/bin/bots.cjs status --json` still exits 0, and the count is the rows whose `kind` is `bot` |
| `bots activity --json`, `bots inbox --json`, `bots routines --json` | Producers owned by phases 001 and 002 of the parent build | not a consumer - this child reads them through the fixture and changes none | `rg -n 'activity\|routines' .skilled/bin/bots.cjs` shows no new verb beyond `ui` |
| `bots answer` | The one write path, which gains `--scope once\|deny` in phase 001 | unchanged | `rg -n "scope" .skilled/bin/bots.cjs` prints the `answer` verb's `--scope` option once packet phase 001 lands, and prints nothing before it |
| `.github/workflows/bots-runtime.yml` | Runs the runtime suites on the skill's paths | update - two path entries and one `bots-tui` job, the repository's first Rust build, with `--locked`, a release build and the design diff | `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` prints one line and `rg -c -e "- 'crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml` prints 2, and `rg -n -e '--locked' .github/workflows/bots-runtime.yml` prints the cargo steps |
| `.gitignore` | Ignores build output and packet source material | update - one line for `/crates/bots-tui/target/` | `git check-ignore -v crates/bots-tui/target/release/bots-ui` prints the `/crates/bots-tui/target/` line |

Required inventories:
- Same-class producers: `rg -n "'  [a-z]+ " .skilled/bin/bots.cjs` lists every usage line, so a new verb cannot be added without a usage line beside it.
- Consumers of changed symbols: `rg -n 'bots.cjs' .skilled/skills/system-skilled-bots/ --glob '*.md'` names every doc that quotes the CLI.
- Matrix axes: four surfaces read (status, activity, inbox, routines) by three outcomes (exit 0 with rows, exit 0 with no rows, exit non-zero), plus the one write by two keys (`y`, `n`) and the closed-input case.
- Algorithm invariant: the binary writes only through `bots answer`, and only when a key names an answer. A closed input, an Esc, or a key that names no answer writes nothing.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes, the task state and the wave table.

Setup confirms the measured gap and the toolchain, reads the four `--json` shapes, writes the manifest and the `.gitignore` line, then builds an empty crate skeleton whose library root declares every module and whose binary calls it, and copies 001's `design/` into the crate. Implementation fills the modules, the fixture, the client test, the test helpers and the loop, adds the signal handler to the guard, then adds the `ui` verb with its two display flags, its vitest suite and the CI job. Verification runs `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo test`, the runtime's `cli-ui.vitest.ts`, the GPL grep, the design copy diff and the three refusals, then validates the packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:external-orchestration -->
## External orchestration

The build runs as eight waves of external CLI workers. `tasks.md` holds the wave table: each wave names its task ids, its lanes, the executor, the model, the effort, the worker count and the check the orchestrator runs before the next wave starts. This section holds the doctrine the table applies. The hub routes every dispatch and each mode's own `SKILL.md` owns its argv, so this section names the route and the effort, never a command line. [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:16]

### Executors and how each one expresses effort

| Executor | Model | Effort lever | `high` | `max` |
|----------|-------|--------------|--------|-------|
| `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking <tier>` | `--thinking high` | `--thinking max` |
| `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#<tier>` on the model id | upgraded to `max` | `#max` |
| `cli-mistral-vibe` | `deepseek-flash` | none, the row's `thinking` field | not available | the row's `max` |
| `cli-devin` | `deepseek-v4-1-flash-max` | the model id | `deepseek-v4-1-flash-high` | `deepseek-v4-1-flash-max` |
| `cli-codex` | `gpt-6-luna` | `-c model_reasoning_effort` | `high` | `xhigh`, the tier this packet uses, because `max` is the model's ceiling |

Three of those levers are narrower than the table's two columns suggest, and each one is a fact from its own packet rather than a preference. `cli-mistral-vibe` has no reasoning flag at all: effort is the roster row's `thinking` field and `max` is a property of the row, so a Vibe dispatch cannot be lowered to `high`. [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89] `cli-opencode`'s `opencode-go/deepseek-v4.1-flash` route is pinned to the max thinking tier by policy, so a `#high` request is upgraded rather than honored. [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:146] `cli-devin` carries the tier in the model id and has no headless effort flag. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156]

The other two need one fact each. `cli-pi`'s ladder is `low`, `high` and `max`, with `medium` and `xhigh` folding into `high`, so `--thinking high` is the only way this packet asks for the middle tier. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:157] `cli-codex` keeps `gpt-6-luna` and the `fast` service tier unless a task names otherwise, sets effort with `-c model_reasoning_effort` because there is no `--reasoning-effort` flag, and `xhigh` is the tier this packet asks for on its hardest wave. [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:101] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:138]

### The tier rule

DeepSeek Flash at `high` carries a small mechanical task: an edit to a settled module, a test that mirrors an existing one, a doc line. DeepSeek Flash at `max` carries a design or tricky task: a new module, a new shared record, a seam between two phases. `gpt-6-luna` at `xhigh` on `fast` carries the hardest task and is the last fallback for every wave.

### The parallelism rule

A lane is the unit of parallelism, and two lanes never hold the same file. The worker count is therefore the number of lanes whose file sets are disjoint, not the number of tasks in the wave.

`crates/bots-tui/src/lib.rs` is the binding file, and this packet removes the serialization it would otherwise impose: T006 writes the library root with every `pub mod` line and one stub file per module, so each later module task owns exactly one file and never edits `src/lib.rs`. That is what lets the six module tasks run as six lanes instead of one. `src/lib.rs` is then held by T006 and T017 alone, and they sit in different waves. `src/main.rs` is held by the same two tasks for the same reason. T006 also writes `keys.rs`, `theme.rs` and `view/mod.rs` as compiling stubs, so 003 never edits `lib.rs`.

The dependency order inside the crate sets the rest: `model.rs` and `event.rs` and `terminal.rs` depend on nothing, `cli.rs` and `state.rs` depend on `model.rs`, `data.rs` depends on `cli.rs` and `state.rs`, and `app.rs` depends on all of them. A lane that needs a module another lane is writing waits for the next wave rather than racing it.

### What every dispatch carries

The hub's own rules bind each dispatch, not only the wave table. The orchestrator reads the target mode's `SKILL.md` before composing the prompt, attaches the resolved agent persona, and sets `AI_SESSION_CHILD=1` with the shared child preamble. [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198] The executor CLI is the HOW and never overrides this packet's workflow, so a wave's task ids, files and verify step survive a change of executor. [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:206] Every non-interactive dispatch redirects stdin, because a run that leaves it open hangs with no output rather than failing. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:130] A `cli-pi` dispatch also passes `--offline`, and a `cli-devin` dispatch puts `--` before the prompt. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:84] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:243]

One rule is the dispatch's own, not the wave table's. A worker that writes `terminal.rs`, `theme.rs`, the overlay keys or the overlay view gets this packet's design files and MIT or Apache references only. An openhuman or tinychannels path appears in a design document as provenance, never in a worker brief, because both are GPL-3.0 and a copied function carries neither the string the grep looks for nor the header the licence check reads. The orchestrator compares the finished guard and overlay with the openhuman files by eye and records that it did.

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

Two rungs can refuse before they spend anything, and the ladder treats a refusal as a rung that is out of usage. `cli-mistral-vibe` refuses to load when `VIBE_SESSION=1` is set, which is the case in a Vibe-hosted orchestrator, so that orchestrator skips rung 3 and the ladder runs 1, 2, 4, 5. [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:16] `cli-devin`'s quota banner is not proof of exhaustion, because a free-tier model still dispatches at `Pro · 0% remaining`, so rung 4 is probed rather than assumed. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237] A wave that reaches the end of the ladder without a working executor stops and reports the wave, its task ids and the last refusal rather than authoring a file by hand outside the dispatch contract.
<!-- /ANCHOR:external-orchestration -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `model.rs` defaults and `Unknown(raw)`, `cli.rs`'s default program, `state.rs`'s effects, `event.rs`'s closed input, `data.rs`'s generation drop, `terminal.rs`'s restore on exit, on panic and on a signal, and `app.rs`'s closed-input exit | `cargo test --lib` |
| Integration | `cli.rs` against `tests/fixtures/bots`, a script that prints canned JSON and records its argv | `cargo test --test cli_client` |
| CLI verb | `bots ui` argv, exit passthrough, the `--mono` and `--ascii` pass-through, the `ui-unavailable` refusal for an absent crate and the `ui-not-built` refusal for an absent binary | `npm --prefix .skilled/skills/system-skilled-bots/runtime test` |
| Gate | fmt, clippy with warnings denied, the whole crate suite, the runtime suite, the GPL grep, the design copy diff and the three refusals | the commands in `tasks.md` Phase 3 |

The fixture script is the seam that keeps the crate's tests off a live state root: it answers `activity`, `inbox`, `routines` and `status` by printing the payload file for its verb, its `status --json` carries the `lastRun.branch` and `lastRun.worktreePath` keys 004 adds, and it takes `--fixture-log <path>` and `--fixture-scenario <name>` as leading arguments, so each test passes a temp log and a scenario through the program-plus-arguments seam rather than sharing one file or one environment variable. Every payload is a file under `tests/fixtures/payloads/`, copied from `design/payloads/`, and the script prints the file for its verb, so the crate and the runtime tests read the same samples. The scenarios cover a good read, an empty payload, a read failure, a refusal by name, a slow child and a warning on stderr, and every no-write test first asserts that the same log recorded the reads. The client takes the program and its arguments, so the tests point it at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")` and the binary's default stays `node <skilled-tree>/.skilled/bin/bots.cjs`. It is also the copy of every `--json` contract the screen reads, so a phase that changes one of those payloads updates the fixture in the same change. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/acceptance-criteria.md, AC-002] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/acceptance-criteria.md, AC-007]

`tests/common/` holds the two helpers the later children share: the frame loader, which reads a frame from `design/mockups.md` by its heading and its size, and the fixture helper, which builds a `Program` with a temp log and a scenario. A snapshot therefore compares every cell against the frame the design draws rather than a block typed into the test.

No test needs a tty. The loop takes its events from a source the caller supplies, so a closed input and an Esc are two events a lib test feeds, and the guard's restore is driven through `catch_unwind` rather than a real terminal.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Rust stable toolchain | External | Green | The crate cannot build. `cargo 1.92.0` is installed on this machine |
| Rust on the CI runner | External | Yellow | The `bots-tui` job cannot build. The job pins `dtolnay/rust-toolchain@1.92.0` with the `clippy` and `rustfmt` components, so the compiler matches the one installed here, and it is the repository's first Rust build |
| ratatui 0.30, crossterm 0.29, serde, serde_json, unicode-width | External | Green | The frame cannot draw or the payload cannot be parsed |
| libc 0.2 | External | Green | The guard cannot install the `SIGTERM` and `SIGHUP` handler, so a killed process leaves the terminal in raw mode |
| 001's approved key map and component inventory | Internal | Yellow | The module map has no approved component list to follow |
| The four `--json` contracts from 001, 002 and 004 | Internal | Yellow | The client is written against the fixture only |
| `bots status --json` | Internal | Green | The header loses its bot count and staleness flag |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the crate cannot build on the pinned toolchain, or the `ui` verb starts a binary that writes an answer the runtime cannot read.
- **Procedure**: revert the commit that adds `crates/bots-tui/`, the `ui` verb, its vitest suite and the CI job. Nothing else reads either, so the runtime, the JSON verbs and the state root are unchanged by the revert, and `node .skilled/bin/bots.cjs ui` returns to `bots: unknown verb: ui` with exit 2.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 001 closed, and a stable Rust toolchain | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | The phase handoff to 003-shell-and-navigation |
<!-- /ANCHOR:phase-deps -->
