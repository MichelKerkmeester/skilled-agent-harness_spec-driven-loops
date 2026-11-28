---
title: "Implementation Summary"
description: "The terminal screen crate is gated, documented and proven end to end: a release binary answers one item in a pseudo-terminal, and the screen now drops another checkout's rows and never waits for an answer at quit."
trigger_phrases:
  - "hardening and proof implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof"
    last_updated_at: "2026-11-25T20:22:36Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-hardening-and-proof"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-hardening-and-proof |
| **Completed** | 2026-11-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `bots-ui` crate now passes its formatter, its linter at the deny level and every test target at once, and a scripted run of the release binary in a pseudo-terminal approves one inbox item. You can build and drive the screen from one README, and the screen now shows only this checkout's rows and quits without waiting for an answer.

### Phase 6: hardening-and-proof

The gates found nothing to repair, so the phase adds proof and documents. `tests/pty_smoke.rs` starts the real binary on a pseudo-terminal it opens itself, with a temp skilled tree whose `bots.cjs` is a Node shim over the fake CLI. It presses `]`, Enter and `y`, reads the drawn screen until the row says `approved`, checks the one `answer` line in the fixture log and quits with Ctrl+D.

The build orchestrator added two tasks the frozen contract required and no earlier crate child built. T034 is the identity row filter. A status read names the checkout's own identity through the bot row whose `path` is the `--repo` checkout. Every status and activity row under another identity is then dropped, and so is every inbox item a status needs-you row lists under another identity. A selection or an open overlay on a dropped row moves at once, so a foreign item can never be answered. T035 is the quit path test: the answer child now runs with stdout null, a quit returns while the child still sleeps, and an answer queued at quit starts with stdout and stderr null.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/crates/bots-tui/README.md` | Created | Build, run, flags, every bound key, the eight glyphs with their fallback, exit codes, tests, design links and the design reference with the no-code statement |
| `.skilled/crates/bots-tui/tests/pty_smoke.rs` | Created | The release binary in a pseudo-terminal against the fake CLI, approving one item |
| `.skilled/crates/bots-tui/src/model.rs` | Modified | `StatusRow` reads `path` and `itemId` |
| `.skilled/crates/bots-tui/src/state.rs` | Modified | `checkout`, `own_identity` and `foreign_items` on `State`, the `own_identity`, `learn_identity` and `keep_own_rows` functions, the reconcile after a status read and three tests |
| `.skilled/crates/bots-tui/src/app.rs` | Modified | `App::new` stores the `--repo` checkout on the state |
| `.skilled/crates/bots-tui/src/cli.rs` | Modified | The answer child's stdout is null and its unused reader thread is gone |
| `.skilled/crates/bots-tui/tests/fixtures/bots` | Modified | The `hold-answer` and `slow-hold-answer` scenarios, which log how the answer child's streams are open and sleep past the quit |
| `.skilled/crates/bots-tui/tests/answer_flow.rs` | Modified | Declares the new `quit` group |
| `.skilled/crates/bots-tui/tests/answer_flow/quit.rs` | Created | `quit_does_not_wait_for_answer` and `quit_starts_a_queued_answer_detached` |
| `.skilled/skills/system-skilled-bots/SKILL.md` | Modified | One line naming `bots ui` as a status surface |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator ran the setup probes and the starting gates itself, because they write nothing and no gate named a line. Five `cli-mistral-vibe` workers at `deepseek-flash` then ran at once on file-disjoint lanes: the identity filter, the quit path, the pseudo-terminal test, the README and the hub line. Each ended `0`/`finished`. One more one-change README brief corrected two lines the orchestrator's read found inaccurate. The orchestrator then reran every gate from the final state, stubbed each fix out to prove its test fails without it, did the clean-room read by eye and validated this folder. No fallback rung was used.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The own identity is the status bot row whose `path` equals the `--repo` checkout | The contract says the identity the status read reports, but that read lists every identity in the state root and has no top-level one. The bot row's path is the only link to this checkout in the payload, and a string compare needs no file call |
| An unknown own identity drops nothing | The fixture's paths are another machine's, so every earlier test runs with the identity unknown. A filter that dropped everything there would blank the frames that 003 to 005 approved |
| A status read refilters the rows already stored | The refresh order is inbox, activity, status, so activity and inbox land before the read that names the identity |
| An inbox item is dropped through the status needs-you rows | Inbox items carry no identity. The runtime already scopes the inbox to the checkout, so this only bites when the two reads disagree, and it gives the answer target the same rule as every other row |
| The running answer keeps stderr piped | A refused answer's line is the child's first stderr line, which `005-answer-flow` built and the merge accepted. Stdout was never read, so it is now null |
| The pseudo-terminal test uses `libc` only | A new dev-dependency would change `Cargo.lock` and break `--locked`. `posix_openpt` with `grantpt`, `unlockpt` and `ptsname` works on macOS and Linux without libutil |
| The test reads the screen through a small grid model | ratatui draws only the cells that change, so a word on the raw byte stream can be split by a cursor move. The grid replays the moves and finds whole words |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cargo fmt --manifest-path .skilled/crates/bots-tui/Cargo.toml --check` | PASS, exit 0 |
| `cargo clippy --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml --all-targets -- -D warnings` | PASS, exit 0 |
| `cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml` | PASS. lib 120 (floor 117), answer_flow 24 (floor 22), cli_client 8, end_to_end 2, panes 53 with 1 ignored, pty_smoke 1 (new), render_keys 16, doc 0 |
| `cargo test --locked ... --release --test pty_smoke` | PASS, `1 passed` naming `answers_one_item_in_a_pseudo_terminal`, three runs in a row |
| T034 tests with `keep_own_rows` stubbed | FAIL as intended: both foreign tests failed, then passed once restored |
| T035 test with the answer stdout piped again | FAIL as intended: `quit_does_not_wait_for_answer` failed on `stdout=null`, then passed once restored |
| Runtime `npm test` and `npm run typecheck` | PASS, 43 files and 548 passed, typecheck exit 0, equal to the floor |
| Licence boundary | PASS. `MIT`, no GPL header in `src`, `Cargo.toml` or `Cargo.lock`, no `openhuman` line in `src` and the clean-room read recorded |
| Design pointers | PASS. Six documents, no `DANGLING` line over 31 pointers, one `GPL-3.0` line |
| Defect audit | PASS. All eight rows, D4 on its amended check |
| `validate.sh --strict` on this folder | PASS, `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The running answer's stderr is still a pipe.** `architecture.md` section 2.5 says it is null. The refusal line needs it, so the two design rules contradict each other, and the doc alignment unit should change one of them. Nothing blocks on it, because the reader is a detached thread and the quit never waits on it.
2. **The identity filter rests on the bot row's path.** A checkout whose bots are not installed has no bot row, so its identity stays unknown and nothing is dropped. A top-level `identity` on the status payload would close that gap and is a runtime change outside this crate.
3. **The hand answer is still the operator's.** The scripted pseudo-terminal run proves the path without a person. The operator's own answer from the overlay is the acceptance step after the merge.
4. **CI runs the pseudo-terminal test in a debug build.** Plain `cargo test` includes `pty_smoke`, so the CI runner needs `node` on its path, which the hosted Ubuntu image carries.
<!-- /ANCHOR:limitations -->

---
