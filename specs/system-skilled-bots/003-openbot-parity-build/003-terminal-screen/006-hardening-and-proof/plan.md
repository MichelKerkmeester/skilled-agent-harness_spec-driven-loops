---
title: "Implementation Plan: Phase 6: hardening-and-proof"
description: "Run the crate's formatter, linter, crate suite and runtime suite, prove the MIT boundary against the GPL-3.0 design reference, write the crate README and the hub line, audit the eight defects, and validate the child and the parent."
trigger_phrases:
  - "hardening and proof plan"
  - "bots ui gates plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: hardening-and-proof

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Rust 2021, ratatui 0.30, crossterm 0.29 |
| **Framework** | ratatui `TestBackend` for buffer snapshots; no async runtime |
| **Storage** | None; the crate opens no state file and reads only through `bots ... --json` |
| **Testing** | `cargo test` over the library, the binary, the integration targets and the doc examples, plus vitest for the runtime |

### Overview
This phase adds no behaviour. It runs the gates the five children before it never ran together, repairs only the lines those gates name, and writes the two documents a reader needs: the crate README and one hub line. The proof is a command per claim: three crate gates, one runtime suite, one licence grep, one pointer check and eight defect checks, each of which prints its expected output without a terminal.

The phase is deliberately the smallest in the parent. Its value is not code it writes but the fact that a green run here means the crate is formatted, lint-clean, tested, licence-clean and documented at once, rather than five separate suites each passing on its own surface.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `ls crates/bots-tui/Cargo.toml` prints the path, so the crate `002` lands exists.
- [ ] `ls crates/bots-tui/src/keys.rs crates/bots-tui/src/theme.rs` prints both, so the files the key, glyph and sanitize checks read exist, and `test ! -e crates/bots-tui/src/sanitize.rs` exits 0, so the crate holds one filter rather than two.
- [ ] `ls crates/bots-tui/tests/fixtures/bots` prints the path, so every suite has its payload source.
- [ ] `ls crates/bots-tui/design` prints `architecture.md`, `component-inventory.md`, `contracts.md`, `glyph-table.md`, `key-map.md` and `mockups.md`, so the pointer check has a folder to read rather than an absent path that reads as a pass.
- [ ] `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` prints one line and `rg -c -e "- 'crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml` prints 2, so `002`'s job is in place to read.

### Definition of Done
- [ ] `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0.
- [ ] `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target and no `FAILED`.
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test pty_smoke` prints `1 passed` and no `SKIP release-absent:` line, so the release binary answered one item in a pseudo-terminal.
- [ ] `rg -n 'GNU GENERAL PUBLIC LICENSE' crates/bots-tui/src crates/bots-tui/Cargo.toml crates/bots-tui/Cargo.lock` prints nothing, and `README.md` and `design/` name the reference's GPL-3.0 licence by design.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof --strict` prints `RESULT: PASSED`.
- [ ] The parent's `--recursive --strict` run prints `RESULT: PASSED` once the five sibling children leave Draft; that run is the parent's closure step and fails on their scaffolds today.
- [ ] Docs updated: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` agree on the gate set.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gate and document. The phase owns no component; it reads the crate, writes two files, and repairs what a gate names.

### Key Components
- **The gate runner**: the orchestrator's own shell, which runs each gate, reads its output and exit status, and records both. It is not a script the crate ships, because a committed runner would be a second place the gate set lives.
- **`crates/bots-tui/README.md`**: the one document a reader of the crate opens. It carries the build, the run, the keys, the glyphs with the ASCII fallback, and the design reference with the no-code statement.
- **The Defect Audit table in `tasks.md`**: eight rows, one per defect the expansion fixes, each with a command and its expected output. It is the hardening claim's evidence, and it lives beside the tasks that run it.

### Data Flow
The crate's modules feed the three crate gates; the runtime's tests feed the runtime suite; the design folder feeds the pointer check; the key table and the glyph table feed the README. Nothing flows back into the crate except a repair to a line a gate named, and that repair is recorded in `goal.md` when it changes behaviour.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet is a hardening pass over a crate five children wrote, so the fix surfaces are the crate's own files and the two documents that describe them.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `crates/bots-tui/src/**` | Owns the behaviour `002` to `005` wrote | Update only the file and line a gate names | `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo test` |
| `crates/bots-tui/tests/**` | Observes that behaviour through `TestBackend` and the fixture | Update only the test a suite names, and never lower an assertion | `cargo test` prints `test result: ok` for every target |
| `crates/bots-tui/tests/pty_smoke.rs` | Does not exist | Create, one scripted run of the release binary in a pseudo-terminal | `cargo test --test pty_smoke` prints `1 passed` |
| `crates/bots-tui/design/**` | Carries the mockups and the `file:line` pointers `001` wrote | Not a consumer; read-only | The pointer loop prints nothing |
| `.github/workflows/bots-runtime.yml` | Runs the gate set on CI | Not a consumer of this change; read-only, and a mismatch is reported to `002` | `rg -n '^  bots-tui:'` prints one line and `rg -c -e "- 'crates/bots-tui/\*\*'"` prints 2 |
| `.skilled/skills/system-skilled-bots/SKILL.md` | Names the verbs the skill offers | Update, one line | `rg -n 'bots ui'` prints one line, and `test -L .opencode/skills` and `test -L .opencode/bin` each exit 0 |
| `crates/bots-tui/README.md` | Does not exist | Create | The five README greps each print one line |

Required inventories:
- Same-class producers: `rg -n 'openhuman' crates/bots-tui` over `src/`, `tests/`, `design/` and `Cargo.toml`, so the licence grep covers every directory the crate ships rather than `src/` alone.
- Consumers of changed symbols: none. The phase changes no public symbol, no field and no error name, so the consumer inventory is empty by construction and the grep that proves it is `git diff --stat` over the crate.
- Matrix axes: three gates by four targets (library, binary, integration tests, doc examples) is twelve rows, and the licence grep by four directories is four rows. A gate that passes on one target and fails on another is the failure this matrix exists to catch.
- Algorithm invariant: none. The phase adds no algorithm, no parser and no path resolver, so there is no invariant to state and no adversarial case to add.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the crate's module list, the toolchain versions and the parent's eight defect rows, and confirms the measured gap. Implementation repairs what the three crate gates and the runtime suite report, then writes the crate README and the hub line. Verification reruns every gate from the final state, proves the licence boundary and the design pointers, runs the eight defect checks, and validates the child and the parent.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The reducer, the key table, the glyph mapping and the sanitizer, through the library target | `cargo test --lib` |
| Integration | The CLI client against `tests/fixtures/bots`, the buffer snapshots per pane and state, and the answer flow's argv log | `cargo test --test cli_client --test render_keys --test panes --test answer_flow` |
| Doc | Every example in a doc comment, which `cargo test` runs by default | `cargo test --doc` |
| Runtime | The `ui` verb's argv, exit passthrough and both refusals | `npm --prefix .skilled/skills/system-skilled-bots/runtime test` |
| Pseudo-terminal | The release binary against the fixture, answering one item and reading the drawn screen | `cargo test --test pty_smoke` |
| Static | Formatting, lints at the deny level, and the licence grep | `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `rg` |

Every suite reads `crates/bots-tui/tests/fixtures/bots`, and the fixture carries the four `--json` contracts the screen reads: `activity` and `inbox` from `001-activity-and-actor`, `routines` from `002-routine-layer`, and `status` from the runtime today. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:152] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:153] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:173] The chat pane's transcript is `010-conversations`' payload, which the fixture gains when that phase lands. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:129] The two refusals the answer flow draws in the status row are `006-approval-grants`' `item-answered-differently` and `011-messaging-channels`' `answer-not-approver`, and neither is a gate this phase runs. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:170] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:186]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `crates/bots-tui/` from `002-architecture-and-contracts` | Internal | Yellow | No manifest means no gate; the phase reports the absent path rather than passing a gate it could not run |
| `keys.rs` and `theme.rs` from `003-shell-and-navigation` | Internal | Yellow | The key and glyph checks have nothing to read, and the README's key list has no source |
| `theme.rs` from `003-shell-and-navigation` and `view/panes.rs` from `004-panes` | Internal | Yellow | Two of the eight defect checks cannot run |
| `view/overlay.rs` from `005-answer-flow` | Internal | Yellow | The free-text defect check cannot run |
| A stable Rust toolchain with `clippy` and `rustfmt` | External | Green | The three crate gates cannot run; the CI job installs the same components |
| `jq` for the manifest licence read | External | Green | The licence check falls back to `rg -n '^license' crates/bots-tui/Cargo.toml` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a repair changes behaviour rather than formatting, so a suite that passed before the repair fails after it, or a defect check that passed before stops passing.
- **Procedure**: revert the one repair commit, keep the README and the hub line, and record the reverted gate in `goal.md` with the file and line it named. The phase's two documents are additive, so they need no rollback of their own.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `002` to `005` landing the crate, the modules and the tests | Implementation, because a gate with no target proves nothing |
| Implementation | Setup's module list and the gate output | Verification, because the final-state run must follow the last repair |
| Verification | Implementation's repairs and the two documents | The parent's closure, because this child's `RESULT: PASSED` is the parent's last handoff row |
<!-- /ANCHOR:phase-deps -->

---

## External orchestration

The build runs as four waves. Three dispatch external CLI workers; the fourth is the orchestrator's own verification. Each wave names its task ids, its executor, its model, its effort, the files its lanes hold, how many workers run at once, and the orchestrator's verify step. The orchestrator reads every worker's output and exit status before it accepts a wave, because a worker's `done` is a claim until the wave's verify commands print what they should.

### The roster this packet may use

| Executor | Model | Effort lever | `high` | `max` |
|----------|-------|--------------|--------|-------|
| `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking <tier>` | `--thinking high` | `--thinking max` |
| `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#<tier>` on the model id | upgraded to `max` | `#max` |
| `cli-mistral-vibe` | `deepseek-flash` | none; the row's `thinking` field | not available | the row's `max` |
| `cli-devin` | `deepseek-v4-1-flash-max` | the model id | `deepseek-v4-1-flash-high` | `deepseek-v4-1-flash-max` |
| `cli-codex` | `gpt-6-luna` | `-c model_reasoning_effort` | `high` | `xhigh`, the tier this packet uses; `max` is the model's ceiling |

Three of those levers are narrower than the two columns suggest, and each is a fact from its own packet rather than a preference. `cli-mistral-vibe` has no reasoning flag at all: effort is the roster row's `thinking` field and `max` is a property of the row, so a Vibe dispatch cannot be lowered to `high`. [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89] `cli-opencode`'s `opencode-go/deepseek-v4.1-flash` route is pinned to the max thinking tier by policy, so a `#high` request is upgraded rather than honored. [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:146] `cli-devin` carries the tier in the model id and has no headless effort flag. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156]

The other two need one fact each. `cli-pi`'s ladder on this route is `low`, `high` and `max`, with `medium` and `xhigh` folding into `high`, so `--thinking high` is the only way this packet asks for the middle tier. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101] `cli-codex` keeps `gpt-6-luna` and the `fast` service tier unless a task names otherwise, and `xhigh` is the tier this packet asks for on its hardest wave. [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125]

### The parallelism rule

A lane is the unit of parallelism, and two lanes never hold the same file. The worker count is therefore the number of lanes whose file sets are disjoint, not the number of tasks in the wave.

`crates/bots-tui/src/**` and `crates/bots-tui/tests/**` are one lane by construction: a formatting repair, a lint repair and a test repair all touch the same tree, and two workers on it would race on the same file. The parallelism in this packet comes from the lanes beside that one: the runtime suite's tests, the crate README, and the hub line. `crates/bots-tui/README.md` is held by one lane alone, so the README is never written while another worker reads the key table it describes.

### The waves

#### Wave 1 - Setup probes

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T001, T002, T003, T004 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | none; four read-only probes |

**Workers:** 1, because the four probes are mechanical and one worker keeps their output in one log. **Verify:** `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 1 and prints `manifest path ... does not exist` before the crate lands; `cargo fmt --version` and `cargo clippy --version` each print a version; `ls crates/bots-tui/src` prints the twelve module entries; `rg -c '^\| .*\| (002|003|004|005): ' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md` prints 8.

#### Wave 2 - Gate repair

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T005, T006, T007 | `cli-codex` · `gpt-6-luna` · `-c model_reasoning_effort="xhigh" -c service_tier="fast"` | `crates/bots-tui/src/**`, `crates/bots-tui/tests/**` |
| B | T008 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `.skilled/skills/system-skilled-bots/runtime/tests/**` |

**Workers:** 2. This is the packet's hardest wave: a lint repair lands in a module another child owns, and the wrong fix changes behaviour that child's tests assert, so lane A takes the highest tier the roster offers. Lane A runs T005 before T006 before T007, because a formatting pass rewrites lines the linter then reads. **Verify:** `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0; `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0; `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target and no `FAILED`; `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints a `Tests` line with no `failed`.

#### Wave 3 - The two documents

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| A | T009 | `cli-opencode` · `opencode-go/deepseek-v4.1-flash` · `#max` | `crates/bots-tui/README.md` |
| B | T010, T011 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `.skilled/skills/system-skilled-bots/SKILL.md` |

**Workers:** 2. Lane A is the design-shaped task of this packet: the README has to name every binding the key table carries, the eight glyphs with their ASCII fallback, and the design reference without copying a line of it, so it takes the max tier. Lane B is one line and two symlink proofs. **Verify:** `rg -n 'cargo build --release' crates/bots-tui/README.md`, `rg -n 'Ctrl\+C' crates/bots-tui/README.md`, `rg -n 'ASCII|--ascii|--mono' crates/bots-tui/README.md`, `rg -n 'openhuman' crates/bots-tui/README.md` and `rg -n 'no code' crates/bots-tui/README.md` each print at least one line; `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints one line; `test -L .opencode/skills` and `test -L .opencode/bin` each exit 0.

#### Wave 4 - Verification from the final state

| Lane | Tasks | Executor, model, effort | Files held |
|------|-------|-------------------------|------------|
| Orchestrator | T012, T013, T014, T015, T016, T017, T018, T019, T020, T021 | none; the orchestrator runs them itself | none |

**Workers:** 0. Every task in this wave is a gate the orchestrator must read the output and exit status of, so dispatching it would put a claim between the evidence and the decision. **Verify:** `cargo fmt --check` exits 0; `cargo clippy --all-targets -- -D warnings` exits 0; `cargo test` prints `test result: ok` for every target; `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints no `failed`; `cargo metadata ... | jq -r '.packages[0].license'` prints `MIT`; `rg -n 'GNU GENERAL PUBLIC LICENSE' crates/bots-tui/src crates/bots-tui/Cargo.toml crates/bots-tui/Cargo.lock` prints nothing; `cargo build --release --manifest-path crates/bots-tui/Cargo.toml` exits 0 and `ls crates/bots-tui/target/release/bots-ui` prints the path; `ls crates/bots-tui/design` prints the six documents and the design-pointer loop prints nothing; the eight Defect Audit rows each print their expected output; `cargo test --test pty_smoke` prints `1 passed`; `validate.sh --strict` on this child prints `RESULT: PASSED`.

### What every dispatch carries

The hub's own rules bind each dispatch, not only the wave table. The orchestrator reads the target mode's `SKILL.md` before composing the prompt, attaches the resolved agent persona, and sets `AI_SESSION_CHILD=1` with the shared child preamble. [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198] Every non-interactive dispatch redirects stdin, because a run that leaves it open hangs with no output rather than failing. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:130] A `cli-pi` dispatch also passes `--offline`, a `cli-devin` dispatch puts `--` before the prompt, and a `cli-codex` dispatch passes `-c service_tier="fast"` explicitly rather than inheriting the caller's config. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:84] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:243] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:165] A `cli-mistral-vibe` dispatch runs from a scratch directory with a disposable `VIBE_HOME` that carries the repository's two roster rows, because an empty home offers one model and refuses the alias. [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:72]

A worker's `done` is a claim until the orchestrator runs that wave's verify commands and reads their output and exit status. A wave that fails its verify does not hand its files to the next wave.

### The clean-room rule

A worker that writes `terminal.rs`, `theme.rs`, the overlay keys or the overlay view gets our design files and MIT or Apache references only. The openhuman and tinychannels paths appear in design documents as provenance, never in a worker brief. The orchestrator compares the finished guard and the overlay with the openhuman files by eye and records that it did in `goal.md`, because a copied function would carry neither the `openhuman` string nor the GPL header the greps look for. The audit rows are C1 and C2 in `tasks.md`.

### Fallback order when a CLI runs out of usage

A wave whose named executor runs out of usage moves down this ladder from the next rung, and never lowers its effort tier: a `high` wave falls back to a `high` dispatch and a `max` wave to a `max` dispatch. A `high` wave that lands on `cli-mistral-vibe` runs at that row's `max`, because raising the tier is safe and lowering it is not. A wave already on the last rung stops and reports rather than dropping its tier.

| Rung | Executor | Why it sits here |
|------|----------|------------------|
| 1 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` | DevPass bills per token, and this route sits under the gateway's Premium threshold, so it carries no weekly cap |
| 2 | `cli-opencode` · `opencode-go/deepseek-v4.1-flash` | The Go gateway's subsidized usage rate, and it needs its own login before it answers |
| 3 | `cli-mistral-vibe` · `deepseek-flash` | The Vibe budget, which a `402 API budget exhausted` ends |
| 4 | `cli-devin` · `deepseek-v4-1-flash-max` | A weekly quota, so it is probed with a trivial read-only call before a wave is handed to it; a free-tier model still answers when the paid quota reads 0% |
| 5 | `cli-codex` · `gpt-6-luna` · `xhigh` · `fast` | The last rung, and the first choice for Wave 2's hardest lane; GPT models reach this packet only through `cli-codex` |

The `cli-devin` probe is one read-only call whose reply is read as text rather than as an exit code, because quota exhaustion and a lapsed credential look the same from the exit status alone. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237]

### What the orchestrator records

Each wave's verify output and exit status go into `goal.md` section 4, one row per wave, with the executor that ran it and the tier it ran at. A wave that fell back records the rung it moved to and the reason, so a later reader can tell a green run on the first rung from a green run on the last.
