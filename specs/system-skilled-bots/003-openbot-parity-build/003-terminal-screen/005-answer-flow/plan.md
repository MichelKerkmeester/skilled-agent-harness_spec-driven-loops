---
title: "Implementation Plan: Phase 5: answer-flow"
description: "The answer surface of `bots ui` as a pure reducer state plus one renderer: the banner row, the decision and choice overlays, the free-text line, the in-flight lock and the refusal display, proven by the fixture's argv log so no test needs a tty."
trigger_phrases:
  - "answer flow plan"
  - "approval overlay plan"
  - "answer argv log"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: answer-flow

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Rust, 2021 edition, inside the `crates/bots-tui` package 002 creates |
| **Framework** | ratatui 0.30 with crossterm 0.29, no async runtime |
| **Storage** | None. The one write is `bots answer <item-id> <text> --scope once\|deny` through `cli.rs` |
| **Testing** | `cargo test --lib` for the reducer and the two views, `cargo test --test answer_flow` for the argv log |

### Overview
The answer surface is a state machine and one renderer. `state.rs` gains the overlay state - idle, sending, refused and gone - the free-text buffer and the lock, so a second press produces no `Answer` effect and a test asserts that with no process involved. `view/overlay.rs` draws the four states and `view/banner.rs` draws the count row, both from state alone. `app.rs` runs the one `Answer` effect through `cli.rs`, which builds exactly `answer <item-id> <text> --scope once|deny` and hands back the child's stderr. The proof is the fixture's argv log: every test that must write nothing asserts the log holds no `answer` line, so Esc, a closed input, Ctrl+C, an unbound key and a second press are all provable without a terminal.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs answer item-1 yes --scope once` exits 2 and prints `bots: unknown option: --scope`, the measured gap this child closes from its own side
- [ ] `ls crates/bots-tui/src/model.rs crates/bots-tui/src/state.rs crates/bots-tui/src/keys.rs crates/bots-tui/src/cli.rs crates/bots-tui/src/app.rs crates/bots-tui/tests/fixtures/bots` prints six paths, so 002 is closed
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes` prints `test result: ok`, so 004 is closed and the inbox selection exists
- [ ] `git ls-files -s crates/bots-tui/tests/fixtures/bots` prints `100755`, so the fixture is executable before this child extends it

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names the twelve tests `tasks.md` lists
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib closed_input` prints `test result: ok` and names `closed_input_writes_nothing`
- [ ] `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0 and `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0
- [ ] `rg -n 'Command::new' crates/bots-tui/src` prints only `cli.rs`, so the one write path is one module
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure reducer, one renderer, one process boundary.

### Key Components
- **`state.rs` (modify)**: the overlay state. `Overlay { item_id, options, phase, buffer }` where `phase` is `Idle`, `Sending`, `Refused(String)` or `Gone`, plus the lock that makes a key a no-op while `phase` is `Sending`. The reducer returns `Vec<Effect>`, so a test asserts that a second press returns no `Answer` effect rather than asserting a side effect did not happen. This is the shape the parent's architecture names: `update(state, msg) -> Vec<Effect>` with `Fetch` and `Answer{id,text,scope}`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/ui-advisory.md:37]
- **`keys.rs` (modify)**: the overlay rows. Each row carries the action and the label the renderer draws, so `y`, `n`, `1` to `9`, `Esc` and `Ctrl+C` cannot be bound without appearing on screen. The typing mode is a property of the row, not a branch in the loop, so one flag pauses every single-key binding at once.
- **`cli.rs` (modify)**: the `answer` call. It builds `answer <item-id> <text> --scope <scope>` and returns the exit code with the first stderr line, so the status row reads one string and the loop never parses a message.
- **`view/overlay.rs` (create)**: the four states. `Idle` draws the numbered choices with deny first, `Sending` draws the same panel with every key dimmed, `Refused` adds the stderr line, and `Gone` replaces the choices with one line saying the item is no longer open. A free-text item draws the typed line with a cursor instead of the digits.
- **`view/banner.rs` (create)**: the count row. It reads the open item count and the inbox tab key label from `keys.rs`, and draws nothing when the count is zero.
- **`app.rs` (modify)**: the `Answer` effect. It sets `Sending`, calls `cli.rs` once, and on a non-zero exit sets `Refused` with the stderr line while leaving the item in place. A closed input returns 0 before any effect is produced.
- **`model.rs` (modify)**: `options` on the inbox item, so the overlay can tell a choice item from a free-text one without a second read.

### Data Flow
A key reaches `app.rs`, which asks `keys.rs` for an action. With no overlay open, `Enter` over the selected inbox item builds an `Overlay` from the item's id and options and produces no effect. With an overlay open, `y`, `n` or a digit produces `Answer{id, text, scope}`, and the reducer moves the phase to `Sending` in the same step, so the next key finds the lock. `app.rs` runs the effect through `cli.rs`, which spawns `<program> answer <id> <text> --scope <scope>` where the program and its arguments default to `node <skilled-tree>/.skilled/bin/bots.cjs` and the tests pass `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")`. Exit 0 closes the overlay and triggers one refresh; a non-zero exit sets `Refused` with the first stderr line and leaves the overlay open. `view/overlay.rs` and `view/banner.rs` then draw one frame from state, and neither reads a process.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `bots answer` | The one write verb, which gains `--scope once\|deny` in phase 001 | not a consumer - this child calls it and changes nothing | `node .skilled/bin/bots.cjs answer <id> deny --scope deny` still exits 0, and the fixture records the same argv |
| `bots inbox --json` | The read that carries `id`, `options`, `state` and `expiresAt` | not a consumer - this child reads it and changes nothing | `rg -n 'inbox' .skilled/bin/bots.cjs` shows no new option |
| `crates/bots-tui/src/cli.rs` | The only module that spawns a process | update - the `answer` call and the stderr capture | `rg -n 'Command::new' crates/bots-tui/src` prints only `cli.rs` |
| `crates/bots-tui/src/state.rs` | The pure reducer 002 creates | update - the overlay state, the buffer and the lock | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib state` prints `test result: ok` |
| `crates/bots-tui/src/keys.rs` | The key table 003 creates | update - the overlay rows and their labels | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib keys` prints `test result: ok` |
| `crates/bots-tui/src/app.rs` | The loop 002 creates | update - the `Answer` effect, the lock, the refusal and the closed-input exit | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib closed_input` prints `test result: ok` |
| `crates/bots-tui/tests/fixtures/bots` | The only payload source in tests | update - the `answer` branch, the argv log line and the refusal switch | `bash crates/bots-tui/tests/fixtures/bots answer item-1 deny --scope deny` exits 0 and appends one argv line |
| `crates/bots-tui/src/view/panes.rs` | The inbox pane 004 creates | not a consumer - the overlay reads the selected id, never the pane | `rg -n 'overlay' crates/bots-tui/src/view/panes.rs` prints nothing |

Required inventories:
- Same-class producers: `rg -n 'answer' crates/bots-tui/src --glob '!cli.rs'` lists every module that names the verb, so a second write path cannot appear unnoticed.
- Consumers of changed symbols: `rg -n 'Overlay|Answer' crates/bots-tui/src crates/bots-tui/tests` lists every reader of the new state and effect.
- Matrix axes: four overlay states (idle, sending, refused, gone) by two item shapes (options, no options) by five no-write keys (Esc, closed input, Ctrl+C, unbound key, second press), plus the one write by two scopes (`once`, `deny`).
- Algorithm invariant: an `Answer` effect is produced only by a key that names an answer, only while the phase is `Idle`, and only for the item id the overlay captured. Every other path produces no effect, and the argv log is the evidence.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the measured gap, confirms the six files 002 creates and the four design sources, and confirms the fixture records its argv. Implementation adds `options` to the item, the overlay state and the key rows, then the `answer` call and the fixture branch, then the two views, then the loop and the integration test. Verification runs `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, the crate suite, the one-write-path grep, the five no-write proofs and the packet validator, and the operator answers one item by hand.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:external-orchestration -->
## External orchestration

The build runs as six waves of external CLI workers. Each wave names its tasks, one executor per lane, the effort tier, how many workers run at once, and the check the orchestrator runs before the next wave starts. The hub routes every dispatch and each mode's own `SKILL.md` owns its argv, so this section names the route and the effort, never a command line. [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:24-33]

### Executors and how each one expresses effort

| Executor | Model | Effort lever | `high` | `max` |
|----------|-------|--------------|--------|-------|
| `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking <tier>` | `--thinking high` | `--thinking max` |
| `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#<tier>` on the model id | upgraded to `max` | `#max` |
| `cli-mistral-vibe` | `deepseek-flash` | none; the row's `thinking` field | not available | the row's `max` |
| `cli-devin` | `deepseek-v4-1-flash-max` | the model id | not this packet's route | `deepseek-v4-1-flash-max` |
| `cli-codex` | `gpt-6-luna` | `-c model_reasoning_effort` | `high` | `xhigh`, the tier this packet uses; `max` is the model's ceiling |

Three of those levers are narrower than the table's two columns suggest, and each one is a fact from its own packet rather than a preference. `cli-mistral-vibe` has no reasoning flag at all: effort is the roster row's `thinking` field and `max` is a property of the row, so a Vibe dispatch cannot be lowered to `high`. [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89] `cli-opencode`'s `opencode-go/deepseek-v4.1-flash` route is pinned to the max thinking tier by policy, so a `#high` request is upgraded rather than honored. [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:146] `cli-devin` carries the tier in the model id and has no headless effort flag. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156]

The other two need one fact each. `cli-pi`'s ladder is `low`, `high` and `max`, with `medium` and `xhigh` folding into `high`, so `--thinking high` is the only way this packet asks for the middle tier. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101] `cli-codex` keeps `gpt-6-luna` and the `fast` service tier unless a task names otherwise, and `xhigh` is the tier this packet asks for on its hardest wave. [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125]

### The parallelism rule

A lane is the unit of parallelism, and two lanes never hold the same file. The worker count is therefore the number of lanes whose file sets are disjoint, not the number of tasks in the wave.

This child's files are almost all disjoint, which is why three of its six waves run more than one worker. Two dependencies shape the count. `crates/bots-tui/src/app.rs` and `crates/bots-tui/tests/answer_flow.rs` form one serial lane, because the test drives the loop's `Answer` effect and cannot compile before the effect exists. `crates/bots-tui/src/state.rs` and `crates/bots-tui/src/keys.rs` are separate files but both feed `view/overlay.rs`, so the overlay waits for the wave that lands them rather than sharing it.

### The waves

#### Wave 1 - Setup probes

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| Orchestrator | T001, T002, T003, T004 | none; the orchestrator runs them itself | none; four read-only probes |

**Workers:** 0. Each task is one command whose output the orchestrator reads, so a dispatch would add a process and no judgment. **Verify:** `node .skilled/bin/bots.cjs answer item-1 yes --scope once` exits 2 and prints `bots: unknown option: --scope`; `ls crates/bots-tui/src/model.rs crates/bots-tui/src/state.rs crates/bots-tui/src/keys.rs crates/bots-tui/src/cli.rs crates/bots-tui/src/app.rs crates/bots-tui/tests/fixtures/bots` prints six paths; `rg -n 'Deny' specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render/overlay.rs` prints the deny button line; `git ls-files -s crates/bots-tui/tests/fixtures/bots` prints `100755`.

#### Wave 2 - The item, the state and the key table

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T005 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `crates/bots-tui/src/model.rs` |
| B | T006 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max` | `crates/bots-tui/src/state.rs` |
| C | T007 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `crates/bots-tui/src/keys.rs` |

**Workers:** 3, because the three files are disjoint. Lane B takes `max` because the overlay state machine and the lock are the design decision the rest of the child rests on; lanes A and C are mechanical additions. **Verify:** `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib model` prints `test result: ok` and names `inbox_item_carries_options`; `--lib state` prints `test result: ok` and names `overlay_locks_after_first_press`; `--lib keys` prints `test result: ok` and names `overlay_bindings_carry_labels`.

#### Wave 3 - The write path and the fixture

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T008 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max` | `crates/bots-tui/src/cli.rs` |
| B | T009 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `crates/bots-tui/tests/fixtures/bots` |

**Workers:** 2, because the two files are disjoint. Lane A takes `max` because the exact argv and the stderr capture are the correctness core of the packet: one extra argument and every acceptance criterion about the argv log fails. **Verify:** `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib cli` prints `test result: ok` and names `answer_argv_is_exactly_answer_id_text_scope`; `bash crates/bots-tui/tests/fixtures/bots answer item-1 deny --scope deny` exits 0 and `tail -1 crates/bots-tui/tests/fixtures/bots.argv` prints `answer item-1 deny --scope deny`; `BOTS_FIXTURE_ANSWER_EXIT=4 bash crates/bots-tui/tests/fixtures/bots answer item-1 deny --scope deny` exits 4 and prints `bots: answer-not-approver`.

#### Wave 4 - The two views

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T010 | `cli-mistral-vibe` · `deepseek-flash` · row `max` | `crates/bots-tui/src/view/overlay.rs` |
| B | T011 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `crates/bots-tui/src/view/banner.rs` |

**Workers:** 2, because the two files are disjoint and both read state that wave 2 landed. Lane A takes the Vibe lane because the overlay is the design-heavy piece: four states, a numbered list with deny first, a typed line with a cursor, and a dimmed sending panel. **Verify:** `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib overlay` prints `test result: ok` and names `overlay_draws_deny_first`, `overlay_labels_are_drawn`, `sending_dims_every_key`, `refused_adds_the_stderr_line` and `gone_replaces_the_choices`; `--lib banner` prints `test result: ok` and names `banner_counts_open_items` and `banner_is_blank_with_none`.

#### Wave 5 - The loop and the integration test

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T012, T013 | `cli-codex` · `gpt-6-luna` · `-c model_reasoning_effort="xhigh" -c service_tier="fast"` | `crates/bots-tui/src/app.rs`, `crates/bots-tui/tests/answer_flow.rs` |

**Workers:** 1, serial inside the lane, because the test drives the effect the loop adds. This is the packet's hardest wave: the lock, the refusal path, the gone item and the closed-input exit are the four places a wrong branch writes an answer nobody asked for, so it takes the highest tier the roster offers. **Verify:** `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib closed_input` prints `test result: ok` and names `closed_input_writes_nothing`; `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names all twelve tests `tasks.md` lists.

#### Wave 6 - Verification gates

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| Orchestrator | T014, T015, T016, T017, T018, T020 | none; the orchestrator runs them itself | none |
| Operator | T019 | none; the operator runs it by hand | none |

**Workers:** 0. T019 needs a tty by design, because the overlay is driven by keystrokes no piped command delivers, so it is the operator's step and not an acceptance criterion. **Verify:** `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0; `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0; `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target; `rg -n 'Command::new' crates/bots-tui/src` prints only `cli.rs`; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow --strict` prints `RESULT: PASSED`.

### What every dispatch carries

The hub's own rules bind each dispatch, not only the wave table. The orchestrator reads the target mode's `SKILL.md` before composing the prompt, attaches the resolved agent persona, and sets `AI_SESSION_CHILD=1` with the shared child preamble. [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:24-33] Every non-interactive dispatch redirects stdin, because a run that leaves it open hangs with no output rather than failing. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:130] A `cli-pi` dispatch also passes `--offline`, and a `cli-devin` dispatch puts `--` before the prompt. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:84] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:243]

A worker's `done` is a claim until the orchestrator runs that wave's verify commands and reads their output and exit status. A wave that fails its verify does not hand its files to the next wave.

### Fallback order when a CLI runs out of usage

A wave whose named executor runs out of usage moves down this ladder from the next rung, and keeps its effort tier: a `high` wave falls back to a `high` dispatch and a `max` wave to a `max` dispatch. Two rungs cannot honor `high` - `cli-opencode`'s route is pinned to `max` and `cli-mistral-vibe` has no flag - so a `high` wave that lands on either is upgraded rather than downgraded, which is the route's own property and not a choice this packet makes. A wave already on the last rung stops and reports rather than dropping its tier.

| Rung | Executor | Why it sits here |
|------|----------|------------------|
| 1 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` | DevPass bills per token, and this route sits under the gateway's Premium threshold, so it carries no weekly cap |
| 2 | `cli-opencode` · `opencode-go/deepseek-v4.1-flash` | The Go gateway's subsidized usage rate, and it needs its own login before it answers |
| 3 | `cli-mistral-vibe` · `deepseek-flash` | The Vibe budget, which a `402 API budget exhausted` ends |
| 4 | `cli-devin` · `deepseek-v4-1-flash-max` | A weekly quota, so it is probed with a trivial read-only call before a real task is handed to it |
| 5 | `cli-codex` · `gpt-6-luna` · `xhigh` · `fast` | The most expensive reasoning on the roster, kept for the hardest wave and for last |

Two rungs can refuse before they spend anything, and the ladder treats a refusal as a rung that is out of usage. `cli-mistral-vibe` refuses to load when `VIBE_SESSION=1` is set, which is the case in a Vibe-hosted orchestrator, so that orchestrator skips rung 3. [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:16] `cli-devin`'s quota banner is not proof of exhaustion, because a free-tier model still dispatches at `Pro · 0% remaining`, so rung 4 is probed rather than assumed. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237]

Wave 5 names rung 5 as its executor, so it has no rung below it. If `cli-codex` runs out, that wave stops and reports rather than dropping to a cheaper tier, because the four branches it writes are the ones that decide whether an answer is written at all.
<!-- /ANCHOR:external-orchestration -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `state.rs` overlay phases and the lock, `keys.rs` overlay rows and labels, `cli.rs` argv construction, `model.rs` options | `cargo test --lib` |
| Render | the four overlay states and the banner's two states, asserted against a `TestBackend` buffer | `cargo test --lib overlay`, `cargo test --lib banner` |
| Integration | the argv log, the Esc close, the closed input, the free text, the lock, the refusal, the gone item, Ctrl+C and the unbound key, against `tests/fixtures/bots` | `cargo test --test answer_flow` |
| Manual | one item answered from the overlay, read back through the item file under `$STATE`. This row needs a tty by design, because the overlay is driven by keystrokes; every other row needs none | `bots ui`, then `jq -e '.answer.text' $STATE/*/needs-you/<item-id>.json` |

The fixture is the seam that keeps every test off a live state root and off a tty. It answers `answer` with exit 0 and appends the argv it was given to `tests/fixtures/bots.argv`, and `BOTS_FIXTURE_ANSWER_EXIT` makes it exit with that code and print `bots: answer-not-approver`, so the refusal path is one environment variable rather than a second script. The argv log is the proof of every no-write claim: a test that must write nothing asserts the log holds no `answer` line, which is a stronger claim than asserting a state field, because it covers the process boundary too.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 002's `cli.rs`, `state.rs`, `keys.rs`, `app.rs`, `model.rs` and `tests/fixtures/bots` | Internal | Yellow | Nothing compiles. The child creates none of them, so its first task confirms all six exist |
| 004's `Option<ItemId>` selection and `Remote<T>` inbox surface | Internal | Yellow | The overlay has no item to open. The fixture carries an item, so the test drives the overlay with no pane drawn |
| Phase 001's `bots inbox --json` and `bots answer --scope once\|deny` | Internal | Yellow | The write records `once` for every answer, so a deny reads as an allow. The argv assertion fails loudly if `--scope` is dropped |
| ratatui 0.30 and crossterm 0.29 | External | Green | The overlay cannot draw and the keys cannot be read |
| Rust stable toolchain | External | Green | The crate cannot build. `cargo 1.92.0` is installed on this machine |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the overlay writes an answer the operator did not name, or a refusal closes the overlay and drops the item.
- **Procedure**: revert the commit that adds `view/overlay.rs`, `view/banner.rs` and `tests/answer_flow.rs` and the seven modified files. The crate still builds, because 002's loop and 004's panes read none of them, and the runtime is untouched by the revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 002 and 004 closed, and a stable Rust toolchain | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | The phase handoff to 006-hardening-and-proof |
<!-- /ANCHOR:phase-deps -->

---
