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
    last_updated_at: "2026-11-25T23:44:25Z"
    last_updated_by: "review-fix-pass-3"
    recent_action: "Applied the third review findings that edit this child"
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
| D4 | The `ui` verb reads `BOTS_UI_BIN` as a test seam only. The shipped path resolves the binary from `--skilled-tree`. |
| D5 | This child draws one empty frame and no pane, so the loop, the guard and the process boundary are proven before any surface draws into them. |
| D6 | The `ui` verb reads `NO_COLOR` and passes `--mono`, and passes `--ascii` when asked, so the binary reads no environment variable and every no-env::var check holds. |
| D7 | 001's four design documents are copied unchanged into `crates/bots-tui/design/` when the crate is created, so the mockups ship beside the code and 006's pointer check has a folder to read. |
| D8 | The terminal guard turns bracketed paste on when it starts and its restore turns it off with raw mode and the alternate screen. A paste reaches the reducer as one `Msg::Paste` holding the whole pasted text, never split into keys. This child's reducer arm for it does nothing, and 005 adds the one arm that appends in text mode. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cargo build --release --manifest-path crates/bots-tui/Cargo.toml` exits 0 and `ls crates/bots-tui/target/release/bots-ui` prints `crates/bots-tui/target/release/bots-ui`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for the `lib`, `cli_client` and doc targets, names `paste_is_one_event` and prints no `FAILED`. `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0 and `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0.
- [ ] `T=$(mktemp -d); node .skilled/bin/bots.cjs ui --repo . --skilled-tree "$T"` exits 4 and prints `ui-unavailable`. After `mkdir -p "$T/crates/bots-tui"` the same command exits 4 and prints `ui-not-built`.
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
| Third review applied | Done | `research/ui-review-3.md`'s P0-3, P0-4, P0-5, P0-8, P1-1 to P1-4, P1-7, P1-10, P1-11 and the P2 items that edit this child are applied. The footer gains `NotSending` and the contract number gains a value and a Rust owner. Quit never waits for an answer child, the fixture's scenario names are fixed, and the `ui` verb's exit passthrough is proven by the vitest cases rather than by `/bin/true` |

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
| The `--scope` check names its precondition | `research/ui-review-3.md` P2-9 replaces a verify that answered a live item with `rg -n "scope" .skilled/bin/bots.cjs`. That command prints nothing today, because `--scope` lands in packet phase 001, so the cell says it prints the option once phase 001 lands and prints nothing before it. |
| AC-008 joins the command blocks | `research/ui-review-3.md` P2-22 names 002's AC-003 and AC-009. AC-008 carried the same `\|` pipes in its Verification cell, so it moved into a block beside them and every one of its six `jq` checks was run against the four payload files. |
| Two review sentences were split | P0-3's footer sentence and P1-11's mitigation each carried a serial comma, which this packet's prose rules forbid. Each was split into two sentences with the same content. |
| The failed-read line is the composed line | F-039: `Remote.error` and `ReadError.line` now carry the whole `bots: <verb> --json exited <code>: <first stderr line>` shape, and section 1.7 names it. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The refusal lines are literal | F-040: REQ-001 and SC-003 carry the literal `bots: ui-unavailable: …`, `bots: ui-not-built: …` and `bots: ui-contract-mismatch: …` lines. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The activity row key is `group` and `at` | F-041: `Slot` gained `at`, the one-per-bot-per-group rule is gone and section 1.4 names the key. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The answer deadline is not a kill | F-042: section 2.5 stops waiting at 30 seconds and leaves the child running, section 2.1 names the answer-at-quit exception, and section 2.3 kills only reads. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The payload contract has one name | F-043: `PAYLOAD_CONTRACT` in `runtime/lib/contract.ts` is named as the one reader of the four payloads. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The screen keeps only its own rows | F-044: section 2 keeps only the rows whose `identity` equals the checkout's. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| `--locked` on three commands | F-045: REQ-009 and T020 put `--locked` on `cargo clippy`, `cargo test` and `cargo build` and none on `cargo fmt --check`. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The drawing signatures are frozen | F-047: section 1.13 names `header::draw`, `tabs::draw`, `footer::draw`, `stale_label`, `printable` and `marker`, so 003 and 004 fill bodies without changing a signature. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The sample set gained two rows | F-070, first alternative taken: two `nightly-report` rows were added to `design/payloads/activity.json`, one scheduled and one recurring, so the four samples are one data set at one instant. The second alternative, setting the bot to not installed, was refused because `routines.json` shows it enabled. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The CI job reads the design copies | F-070: REQ-009 and T020 name four path entries, two `crates/bots-tui/**` and two `specs/.../00[12]-*/design/**`, and pin every `uses:` line by commit. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The design diff is per file | F-077: the AFFECTED SURFACES row uses `diff -r -x architecture.md -x contracts.md` plus the two per-file diffs, so the two copies are compared without a false positive. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| Every payload check reads `version` | O-014: AC-008 checks `.version == 1` on all four payloads. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The prose rules were applied | O-021 and O-022: every semicolon outside code was split into two sentences and every serial comma before a final `and` was dropped, across this child's documents. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
<!-- /ANCHOR:log -->
