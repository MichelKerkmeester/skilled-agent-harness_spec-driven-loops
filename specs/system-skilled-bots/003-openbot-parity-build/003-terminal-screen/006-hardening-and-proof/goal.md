---
title: "Goal: Phase 6: hardening-and-proof"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof"
    last_updated_at: "2026-11-25T22:43:40Z"
    last_updated_by: "integration-wave"
    recent_action: "Added the pseudo-terminal criterion and the clean-room read row"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w4-006-hardening-and-proof"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 6: hardening-and-proof

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove the `bots-ui` crate is formatted, lint-clean, tested, licence-clean and documented, and give a reader the one README that builds and drives it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase writes two files and repairs only what a gate names. A gate that needs a behaviour change is reported to the child that owns the module, never absorbed here. |
| D2 | The licence proof is the grep, the design-pointer check and a human read of the diff together. The grep alone is a text match, so it is never the whole proof. |
| D3 | The `bots-tui` CI job belongs to `002-architecture-and-contracts`. This phase reads it and reports a mismatch. It never edits `.github/workflows/bots-runtime.yml`. |
| D4 | The closed-input test belongs to `005-answer-flow`. The hand proof is the operator's final acceptance step after this phase, and the scripted pseudo-terminal run here proves the same path without a person. Every criterion here runs without a person, and the pseudo-terminal run opens a pseudo-terminal of its own rather than needing an interactive one. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `cargo fmt --manifest-path .skilled/crates/bots-tui/Cargo.toml --check` exits 0 and `cargo clippy --manifest-path .skilled/crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0.
- [x] `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml` prints `test result: ok` for every target and no `FAILED`.
- [x] `cargo metadata --manifest-path .skilled/crates/bots-tui/Cargo.toml --no-deps --format-version 1 | jq -r '.packages[0].license'` prints `MIT`, and `rg -n 'GNU GENERAL PUBLIC LICENSE' .skilled/crates/bots-tui/src .skilled/crates/bots-tui/Cargo.toml .skilled/crates/bots-tui/Cargo.lock` prints nothing, because `README.md` and `design/` name the reference's GPL-3.0 licence by design.
- [x] `rg -n 'openhuman' .skilled/crates/bots-tui/src` prints only comment lines, `rg -n 'no code' .skilled/crates/bots-tui/README.md` prints one line, and every `file:line` pointer in `.skilled/crates/bots-tui/design/` resolves, proven by the T018 block printing no `DANGLING` line, or naming its skip when `specs/system-skilled-bots/context` is absent.
- [x] `rg -c '^\| D[1-8] ' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/tasks.md` prints 8, and every row of the Defect Audit table prints its expected output.
- [x] `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --release --test pty_smoke` prints `test result: ok. 1 passed` and names `answers_one_item_in_a_pseudo_terminal`, so the release binary answered one item in a pseudo-terminal.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof` prints `RESULT: PASSED` |
| External orchestration waves | Done | `plan.md` section `External orchestration` names five waves over T001 through T033 |
| Defect audit table | Done | `rg -c '^\| D[1-8] ' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/tasks.md` prints 8 |
| Crate scaffolded | Done | `ls .skilled/crates/bots-tui/src` prints the twelve module entries that `002` to `005` landed |
| Toolchain | Recorded | `cargo 1.92.0`, `rustfmt 1.8.0-stable`, `clippy 0.1.92` |
| Wave 1, setup probes | Done, orchestrator shell, no worker | T001 to T004 write nothing and their verify is the probe itself, so the orchestrator ran them and read each output |
| Wave 2, gate repair | Done, orchestrator shell, no worker | `cargo fmt --check` and `cargo clippy --locked --all-targets -- -D warnings` exited 0 and every crate target printed `ok` at the start, and the runtime suite printed 43 files and 548 passed. No gate named a line, so no repair lane was dispatched |
| Orchestrator lanes, T034 and T035 | Done, `cli-mistral-vibe` `deepseek-flash` at the row's `max`, first rung | Both `0`/`finished`. T034 prints `3 passed` and T035 prints `2 passed`. Each new test failed with its fix stubbed out |
| Wave 2b, the pseudo-terminal test | Done, `cli-mistral-vibe` `deepseek-flash` at the row's `max`, first rung | `0`/`finished`. The release run printed `1 passed` three times in a row |
| Wave 3, the two documents | Done, `cli-mistral-vibe` `deepseek-flash` at the row's `max`, first rung | Both `0`/`finished`. A second one-change README brief on the same rung corrected two inaccurate lines the orchestrator's read found, the `ui` verb sentence and the `data.rs` row |
| Wave 4, verification | Done, orchestrator shell | Every gate from the final state, recorded in `implementation-summary.md` |
| Gates run | Done | `cargo fmt --check` exit 0, `cargo clippy --locked --all-targets -- -D warnings` exit 0, `cargo test --locked` lib 120, answer_flow 24, cli_client 8, end_to_end 2, panes 53 with 1 ignored, pty_smoke 1, render_keys 16, all `ok` |
| README written | Done | `.skilled/crates/bots-tui/README.md`, 176 lines, the five greps each print at least one line |
| Hub line added | Done | `rg -n 'bots ui' .skilled/skills/system-skilled-bots/SKILL.md` prints line 33 alone |
| Defect audit | Done | D1 the enum and one `KeyMatch::Digit` row in `OVERLAY_ROWS`. D2 `4` and `5`. D3 `inbox_view: PaneView<ItemId>`. D4 `data.rs:49` and only `cli.rs:95`. D5 15 calls in `view/panes.rs` and no `sanitize.rs`. D6 six lines. D7 the `scheduled` and `recurring` glyph rows. D8 the banner's two words and nothing naming `Ctrl+P` |
| Clean-room read | Done | The orchestrator read `src/terminal.rs` beside openhuman's `terminal.rs` and `src/view/overlay.rs` beside openhuman's `render/overlay.rs`. Our guard is a `Modes` trait with a static `ACTIVE` slot, a `Once` panic hook and a signal handler, where theirs is one struct that holds an alternate-screen flag and a mouse switch. Our overlay draws field lines and one status line per phase, where theirs draws clickable buttons with hit areas. Both chain the previous panic hook after the restore, which is ratatui's documented idiom. No function, name, comment or string was copied |

### Deviations and findings

| Item | Note |
|------|------|
| The parent's recursive run is not a criterion | `validate.sh --recursive --strict` on the parent fails on the five sibling scaffolds today, so it is the parent's closure step rather than this child's. This child's own `--strict` run is the criterion. |
| The licence grep is one half of the proof | A text match cannot see a paraphrased copy, so the design-pointer check and a human read of the diff sit beside it, and the log records that the three together are the evidence. The grep covers the code and the manifest and searches for the header text, because the README and `design/` name the reference's GPL-3.0 licence by design and a match there is not a failure. |
| The CI job is read, never edited | `002` owns `.github/workflows/bots-runtime.yml`. A job that runs a different gate set is reported to that child and recorded here. |
| The hand proof is the last step, not a criterion | The scripted pseudo-terminal run answers one item without a person, so the answer path is a criterion. The operator's own hand answer is the final acceptance step after this phase, and it is the only step that needs a tty. |
| The pseudo-terminal test has an author | F-049, first alternative taken: T033 and a new wave 2b write `tests/pty_smoke.rs`. It builds a temp skilled tree whose `.skilled/bin/bots.cjs` is a Node shim over the fixture, resolves the binary with `env!("CARGO_BIN_EXE_bots-ui")`, runs under `cargo test --release` and has no skip branch. REQ-022, AC-013 and the risk row follow. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| T001 reads the crate as present | F-070: T001 now confirms the crate and the gate set, and the one absent thing it names is the `pty_smoke` target this phase adds, so it agrees with the Definition of Ready. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The two orchestrator tasks override D1 | D1 says this phase adds no behaviour. The build orchestrator added T034 and T035 because the crate's frozen contract requires them and no earlier crate child built them, so this phase changed `state.rs`, `model.rs`, `app.rs` and `cli.rs`. Each change is named in `implementation-summary.md`. |
| The own identity comes from the bot row's path | `002-architecture-and-contracts/design/contracts.md` section 2 says the own identity is the one the `status --json` read reports, but that read lists every identity in the state root and carries no top-level identity. The screen takes the identity of the status bot row whose `path` equals the `--repo` checkout, compared as strings. When no row names the checkout, nothing is dropped. The inbox and routines reads are already scoped to the checkout's identity by the runtime, so an inbox item is dropped only when a status needs-you row lists its id under another identity. For 013: the contract text should say this. |
| The running answer keeps stderr as a pipe | `architecture.md` section 2.5 says an answer child already running at quit is spawned with stdout and stderr null. Stdout is now null. Stderr stays a pipe, because a refused answer's line is the child's first stderr line, as `005-answer-flow` built it. Its reader is a detached thread, so the quit never waits on it. `quit_does_not_wait_for_answer` asserts stdout null for the running child, and `quit_starts_a_queued_answer_detached` asserts both null for a child started at quit. For the top orchestrator and 013: section 2.5 contradicts the refusal line and needs one of the two rules changed. |
| The D4 check was amended | The worker thread starts through `std::thread::Builder`, so `rg -n 'thread::spawn' src/data.rs` printed nothing although the worker exists. The check now reads `rg -n 'thread::Builder'`. |
| The CI job matches | AC-012 printed one `bots-tui:` job line, `2` path entries and the three steps `cargo fmt --check`, `cargo clippy --locked ... -D warnings` and `cargo test --locked`. Plain `cargo test` there also runs `pty_smoke` in a debug build, which needs `node` on the runner. |
| The prose rules were applied | O-021 and O-022: every semicolon outside code was split into two sentences and every serial comma before a final `and` was dropped, across this child's documents. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
<!-- /ANCHOR:log -->
