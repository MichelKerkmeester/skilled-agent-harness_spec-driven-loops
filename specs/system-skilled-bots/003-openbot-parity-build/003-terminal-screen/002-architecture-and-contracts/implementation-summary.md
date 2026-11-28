---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "architecture and contracts implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts"
    last_updated_at: "2026-11-25T20:22:33Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-architecture-and-contracts"
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
| **Spec Folder** | 002-architecture-and-contracts |
| **Completed** | 2026-11-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`node .skilled/bin/bots.cjs ui` now starts a real terminal screen binary, and a checkout without one gets a refusal that names the build command. Behind the verb sits the `bots-tui` crate, which builds, passes 65 tests and draws one empty frame. Every later terminal-screen child adds a body to it rather than a skeleton.

### Phase 2: architecture-and-contracts

The crate freezes every shared type and signature `design/architecture.md` names, so later children fill function bodies and key rows without touching `lib.rs`. The loop takes events from a source you supply, so a closed input, an Esc, a paste or a signal is a lib test rather than a keystroke. One worker thread runs every `bots` call, and the loop thread never starts a process. Answers go ahead of queued reads, and a read past its 10 second deadline is killed. The terminal guard restores raw mode, the alternate screen, bracketed paste and the cursor on exit, on panic and on SIGTERM, SIGHUP or SIGINT. The fake `bots` CLI under `tests/fixtures/` is the only payload source in tests.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/crates/bots-tui/Cargo.toml`, `Cargo.lock` | Created | MIT manifest with the `bots-ui` binary beside the library, and the pinned graph with one ratatui and one crossterm |
| `.skilled/crates/bots-tui/src/lib.rs`, `main.rs` | Created | Every `pub mod` line, `CONTRACT`, the argument parser with `--mono`, `--ascii` and `--version`, and the production entry |
| `.skilled/crates/bots-tui/src/state.rs` | Created | Every shared type, the pure reducer and empty stubs for the seven functions 003, 004 and 005 own |
| `.skilled/crates/bots-tui/src/model.rs` | Created | The payload types with serde defaults, `Unknown(raw)` states and the hand-written `parse_utc` |
| `.skilled/crates/bots-tui/src/keys.rs` | Created | The key table types, `resolve` and `palette_entries`, with the three row slices empty |
| `.skilled/crates/bots-tui/src/cli.rs` | Created | The only module that spawns: argv, reads with pipe readers and a kill deadline, the answer call, the failure lines |
| `.skilled/crates/bots-tui/src/data.rs` | Created | The worker thread, answer-first order and the shutdown rule |
| `.skilled/crates/bots-tui/src/event.rs` | Created | `EventSource`, `TerminalEvents`, `ScriptedEvents`, the crossterm mapping with a paste as one message, the signal read |
| `.skilled/crates/bots-tui/src/terminal.rs` | Created | The guard behind a `Modes` seam, the chained panic hook and the flag-only signal handler |
| `.skilled/crates/bots-tui/src/app.rs` | Created | The drain-then-draw loop, effect hand-off, shutdown and exit codes |
| `.skilled/crates/bots-tui/src/theme.rs`, `src/view/mod.rs` | Created | The stubs 003 fills: the theme flags and the empty frame |
| `.skilled/crates/bots-tui/tests/fixtures/bots`, `tests/fixtures/payloads/` | Created | The fake CLI with its six scenarios, mode 0755, and the four sample payloads copied unchanged |
| `.skilled/crates/bots-tui/tests/common/`, `tests/cli_client.rs` | Created | The frame loader, the fixture helper and the client's integration tests |
| `.skilled/crates/bots-tui/design/` | Created | 001's four documents plus `architecture.md` and `contracts.md`, copied unchanged |
| `.skilled/bin/bots.cjs` | Modified | The `ui` verb with its three refusals and two display flags, and `routines --json` printing `version` from the shared constant |
| `.skilled/skills/system-skilled-bots/runtime/lib/contract.ts` | Created | `PAYLOAD_CONTRACT`, the one payload contract number |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-ui.vitest.ts` | Created | The verb's eight tests against a stub binary |
| `.github/workflows/bots-runtime.yml` | Modified | The path entries and the `bots-tui` job |
| `.gitignore` | Modified | Ignores `/.skilled/crates/bots-tui/target` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every file was written by a `cli-mistral-vibe` worker on `deepseek-flash`, in seven internal waves, and every wave's verify ran in the worktree before the next one started. Wave 1 ran eight workers at once: the manifest, the ignore line, `contract.ts`, the verb, its tests, the CI job, the design copy and the fixture. Wave 2 wrote the skeleton holding every frozen type and signature, and moved `routines --json` onto the constant. Wave 3 ran six workers on keys, model, cli, state, event and terminal. Wave 4 ran three on data, the shared helpers and the client test. Wave 5 ran the loop and the library root together, and wave 6 added the signal handler. Each parallel crate worker built and tested through a lane runner that copied the last verified crate and laid only that worker's own file over it. So no worker saw a sibling's half-written file. No worker failed its verify, so no retry or `cli-pi` fallback was used. The gates in wave 7 were run by the orchestrator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The skeleton wrote every frozen type and signature before any module body | `event.rs` emits `Msg` from `state.rs`, and `cli.rs` returns `Read` and `ReadError` from it, so the wave table's order could not compile lane by lane. With the vocabulary frozen first, each module task still owns exactly one file, as D1 asks |
| `runtime/lib/contract.ts` was created and the `ui` and `routines` verbs read it | REQ-001 names the constant and its file, but Files to Change omits it. `status.ts` belongs to unit 004 in this wave, so `status.ts`, `activity.ts` and the inbox verb in `bots.cjs` still print a literal `1` |
| The two packet design path entries sit under the `push` trigger only | AC-009 counts exactly 2 such entries. This repository lands work by pushing to `main` and `skilled/**`, so `push` is where a design-only edit most needs the diff check |
| The CI job runs on `ubuntu-latest` | The crate is Unix-only and ships for macOS and Linux. The Linux runner proves it and costs less |
| `App` carries a lifetime, `App<'t, B>` | `app::run` takes `&mut Terminal<B>` as the architecture fixes, so an App that holds that borrow needs the lifetime |
| `cli::read` and `cli::answer` take a cancel flag | The worker kills a running read and stops waiting on a running answer at quit, and the flag is how it reaches a call already underway |
| The guard records mode changes through a `Modes` trait | Raw mode fails without a tty, so the restore tests record calls instead of touching a terminal |
| Every payload struct takes a serde default for every key | A missing key never fails the whole read, so a runtime that drops an optional field still draws |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cargo fmt --check`, `cargo clippy --locked --all-targets -- -D warnings` | Both exit 0 |
| `cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml` | lib 57 passed, bin 0, `cli_client` 8 passed, doc 0. No `FAILED`, and it names `paste_is_one_event` |
| `cargo build --release`, then `bots-ui --version` | `Finished`, then `bots-ui 0.1.0 contract 1` |
| `bots ui` refusals against a temp `--skilled-tree` | `ui-unavailable` exit 4, then `ui-not-built` exit 4 |
| `bots ui --skilled-tree .` against the real binary with no tty | The contract check passed and the binary reported `the terminal did not open`, exit 1 |
| `npx vitest run tests/cli-ui.vitest.ts -t "^bots ui "` | `Tests  8 passed (8)` |
| Runtime `npm test` and `npm run typecheck` | 40 files, 464 passed, typecheck 0. The floor was 39 files and 456 passed, so the delta is the new file and its 8 tests |
| Design and payload diffs | All print nothing |
| Clean-room comparison | The orchestrator compared `terminal.rs` with the openhuman guard by eye. The only shared shape is the std `take_hook` and `set_hook` idiom. No function was copied |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **AC-015's literal grep matches `--ascii`.** `rg -n '\-\-as' .skilled/crates/bots-tui/src` also prints the three `src/lib.rs` lines that parse and print the required `--ascii` flag. `rg -n -e '--as\b' .skilled/crates/bots-tui/src` prints only test lines.
2. **The payload constant is not wired everywhere.** `status.ts`, `activity.ts` and the inbox verb still print a literal `version: 1`. The doc-alignment unit can move them onto `PAYLOAD_CONTRACT` once unit 004 has merged `status.ts`.
3. **The identity filter is not built.** `contracts.md` section 2 keeps only rows whose `identity` matches the checkout. No task here builds it, so it falls to the pane work.
4. **The quit-path answer test is not written.** `quit_does_not_wait_for_answer` from `architecture.md` section 2.5 is in no task of this child. `shutdown_drops_queued_reads` covers the read half of the rule.
5. **The design path entries miss pull requests.** A pull request that edits only a packet design copy does not run the `bots-tui` job. A push does.
<!-- /ANCHOR:limitations -->
