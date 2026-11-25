---
title: "Goal: Phase 2: architecture-and-contracts"
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
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts"
    last_updated_at: "2026-11-25T21:58:29Z"
    last_updated_by: "review-fix-pass-2"
    recent_action: "Applied the second review findings that edit this child"
    next_safe_action: "Execute against the completion criteria"
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
# Goal: Phase 2: architecture-and-contracts

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Deliver the crate, the `ui` verb, the fixture and the CI job that the rest of Phase 3 draws into, so a later child adds a module rather than a skeleton.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The library root declares every module and one stub file per module lands with it, so each later module task owns exactly one file and the crate's module tasks run in parallel instead of serializing on `src/lib.rs`. |
| D2 | The worker thread and the generation-tagged channel land here, not with the panes, because the measured freeze is a property of the loop rather than of any pane. |
| D3 | The fixture is the only payload source in tests, and it carries the four payloads plus the `lastRun.branch` and `lastRun.worktreePath` keys 004 adds. |
| D4 | The `ui` verb reads `BOTS_UI_BIN` as a test seam only; the shipped path resolves the binary from `--skilled-tree`. |
| D5 | This child draws one empty frame and no pane, so the loop, the guard and the process boundary are proven before any surface draws into them. |
| D6 | The `ui` verb reads `NO_COLOR` and passes `--mono`, and passes `--ascii` when asked, so the binary reads no environment variable and every no-env::var check holds. |
| D7 | 001's four design documents are copied unchanged into `crates/bots-tui/design/` when the crate is created, so the mockups ship beside the code and 006's pointer check has a folder to read. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cargo build --release --manifest-path crates/bots-tui/Cargo.toml` exits 0 and `ls crates/bots-tui/target/release/bots-ui` prints `crates/bots-tui/target/release/bots-ui`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for the `lib`, `cli_client` and doc targets and no `FAILED`.
- [ ] `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0 and `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0.
- [ ] `T=$(mktemp -d); node .skilled/bin/bots.cjs ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-unavailable`; after `mkdir -p "$T/crates/bots-tui"` the same command exits 4 and prints `ui-not-built`.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-ui.vitest.ts` prints no `failed`, including the `--mono` case under `NO_COLOR`, the `--ascii` case and the `ui-contract-mismatch` case.
- [ ] `rg -n '^license' crates/bots-tui/Cargo.toml` prints `license = "MIT"`, and `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines.
- [ ] `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` prints one line and `rg -c -e "- 'crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml` prints 2, `rg -n 'dtolnay/rust-toolchain@1.92.0' .github/workflows/bots-runtime.yml` prints the toolchain step, and `rg -n -e '--locked' .github/workflows/bots-runtime.yml` prints the cargo steps.
- [ ] `ls crates/bots-tui/design` prints 001's four documents plus `architecture.md` and `contracts.md`, `diff -r -x architecture.md -x contracts.md specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design crates/bots-tui/design` prints nothing, and `diff` of each of `architecture.md` and `contracts.md` against `002-architecture-and-contracts/design/` prints nothing.
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
| Child spec, plan, tasks and acceptance criteria authored | Done | `spec.md` carries 17 requirements, `tasks.md` carries 30 tasks in 8 waves, and `acceptance-criteria.md` carries a row for every requirement |
| Crate scaffolded | Pending | `ls crates` prints `ls: crates: No such file or directory` |
| `ui` verb added | Pending | `node .skilled/bin/bots.cjs ui` prints `bots: unknown verb: ui` and exits 2 |
| Fixture committed | Pending | No `crates/bots-tui/tests/fixtures/bots` exists yet |
| Design copied | Pending | No `crates/bots-tui/design` exists yet |
| CI job added | Pending | `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` exits 1 with no match |
| Second review applied | Done | `research/ui-review-2.md` N-P1-10 and the 002 items of N-P2-22 are applied: the workflow check names the job and the two path entries rather than counting a string, the parent decisions read `Q002 to Q009`, and the `--mono` proof is the vitest case rather than a binary that prints nothing |
| Integration wave applied | Done | The rulings of the terminal screen integration wave are applied: a successful answer issues no read and the outcome word waits for the next poll, `routines --json` is an object with a `routines` array, the fixture takes its log and its scenario as leading arguments, the design folder carries six files, and the verb refuses a binary whose contract number differs |

### Deviations and findings

| Item | Note |
|------|------|
| The empty frame is the exit, not a gap | The advisory's exit for this child is "CI green on an empty frame", so the frame draws blank here and 003 adds the header and tabs without moving the loop. |
| The module map is read from 001 | The module map follows 001's component inventory rather than a second list, so a component 001 names has one home here. |
| The fixture carries 004's two keys | `lastRun.branch` and `lastRun.worktreePath` are 004's, and the fixture carries them now so the payload does not change under a later child. |
| The hand proof is not a criterion | No criterion here needs a tty. The overlay's keystrokes are 005's hand check, and this child's closed-input and Esc paths are lib tests. |
| The verb owns the display flags | `NO_COLOR` and `--ascii` are read by `bots ui`, which passes `--mono` and `--ascii` to the binary, so the binary reads no environment variable and the no-env::var checks in 002, 005 and 006 hold unchanged. |
| The design folder is copied, not authored | 001 authors the four documents and this child copies them unchanged, so a later edit is made once and copied again rather than diverging in two folders. |
| The signal path is a task, not a comment | `NFR-R01` named a signal and no task proved it, so T029 installs the `SIGTERM` and `SIGHUP` handler and `signal_becomes_terminate_event` raises the signal through it. |
| The sanitizer is 003's | The status row draws runtime text before any pane exists, so one filter with one behaviour lives in 003's `theme.rs` and 004 draws through it rather than keeping a second copy. The crate holds no `sanitize.rs`. |
| The workflow check carries `-e` | `research/ui-review-2.md` N-P1-10's second command is `rg -c "- 'crates/bots-tui/**'"`, and ripgrep reads the leading `-` as a flag, so it exits 2 with `rg: unrecognized flag -` and prints nothing. The check is applied as `rg -c -e "- 'crates/bots-tui/**'"`, which prints 2 against a workflow carrying the entry under both the `pull_request` and the `push` trigger. |
| The answer issues no read | A successful answer issues no read of its own, so the row keeps its outcome word and the answered item stays drawn until the next 5-second poll's successful inbox read. `State.answered` carries the inbox generation each mark was set at, so a read issued before the answer cannot clear it. |
| The verb checks the contract number | `bots-ui --version` prints the crate version and the contract number `design/contracts.md` fixes, and `bots ui` refuses a binary whose number differs, so a build from before a payload change cannot draw a stale contract. |
<!-- /ANCHOR:log -->
