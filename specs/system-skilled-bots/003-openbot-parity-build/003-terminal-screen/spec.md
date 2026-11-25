---
title: "Feature Specification: Phase 3: terminal-screen"
description: "A new MIT Rust ratatui binary, `bots ui`, that draws the activity, inbox and routine surfaces from the runtime's `--json` verbs and answers needs-you items through `bots answer`, following openhuman-tui's layout and keys without copying its GPL code."
trigger_phrases:
  - "terminal screen"
  - "phase 3 terminal screen"
  - "bots ui"
  - "ratatui terminal screen"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: terminal-screen

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
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 10 |
| **Predecessor** | 002-routine-layer |
| **Successor** | 004-computer-exposure |
| **Handoff Criteria** | `cargo test`, `cargo clippy --all-targets -- -D warnings` and `cargo fmt --check` pass in `crates/bots-tui`; `bots ui` opens against this repository; one needs-you item answered from the screen reads back as answered from its item file, because `bots inbox --json` lists only open and expired items. The last two need a tty by design, so they are proven by hand and never by a piped command |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat specification.

**Scope Boundary**: One new Rust binary and the one CLI verb that starts it. The binary draws three panes from JSON the runtime already writes or that phases 001 and 002 add, and answers a needs-you item through the existing `bots answer` verb. It adds no runtime module, no state file and no new JSON contract.

**Size**: L, risk medium, as the research ranks the terminal screen. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:150]

**Dependencies**:
- Phase 001's `bots activity --json` and `bots inbox --json`, which the activity and inbox panes read.
- Phase 002's `bots routines --json`, which the routines pane reads.
- `bots status --json`, which exists today and which the header reads for the bot count and the index staleness flag. The count is the rows whose `kind` is `bot`, so a needs-you row never counts as a bot. Phase 004 adds `lastRun.branch` and `lastRun.worktreePath` to that payload, which the header ignores and the fixture carries. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:147]
- Phase 001's `bots answer --scope once|deny` flag, which records the scope on the item's answer. Phase 006 extends that scope with `grants` and the ladder, and the screen reads neither, so it never waits for 006. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:81]

**Deliverables**:
- `crates/bots-tui/`, an MIT Rust crate whose binary is `bots-ui`.
- The `ui` verb in `.skilled/bin/bots.cjs`, which `.opencode/bin/` reaches through its symlink.
- A `bots-tui` CI job in `.github/workflows/bots-runtime.yml`, the repository's first Rust build.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The runtime answers every question an operator has as text: `bots status` prints rows, `bots inbox` prints tab-separated items, and phases 001 and 002 add `bots activity` and `bots routines` in the same shape. Reading three commands to learn what the bots did, what needs an answer and what each routine is set to is work the operator repeats every time they look. openhuman proves a terminal can draw all four surfaces from data a runtime already holds, but its client is GPL-3.0-only and cannot be lifted into this MIT tree. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:29] [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2]

### Purpose
One screen that draws activity, inbox and routines from the runtime's own JSON and answers a needs-you item without leaving the terminal.
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

$ node .skilled/bin/bots.cjs inbox --json
bots: inbox takes no --json
EXIT=2

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

The first two lines are the measured gap: no `ui` verb exists, and `inbox` has no JSON mode, so the screen has nothing to read for its inbox pane until phase 001 adds one. The third block is the one surface that already answers as data, and it is the shape the header reads. [SOURCE: .skilled/bin/bots.cjs:31] [SOURCE: .skilled/bin/bots.cjs:48] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:103-114]
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `ui` verb to `.skilled/bin/bots.cjs` that resolves the built binary, execs it with `--repo` and `--skilled-tree`, inherits stdio and passes the exit code through, and that refuses `ui-unavailable` when the crate is absent and `ui-not-built` when only the binary is.
- Create `crates/bots-tui/`, an MIT Rust crate whose binary `bots-ui` draws four tabs with Alt+1..4, a Ctrl+P command palette, a pending-approval banner above the input, an approval overlay with numbered choices and the six status markers. The package carries a library target beside the binary, so `cargo test --lib` runs the unit tests and `tests/*.rs` imports the modules; each module task declares its own module in the library root, so a task's tests run when that task lands rather than when the last one does.
- Draw the activity, inbox and routines panes from `bots activity --json`, `bots inbox --json` and `bots routines --json`, and answer an item through `bots answer` with `--scope`.
- Prove every bound key is drawn on screen with a render test over ratatui's `TestBackend`.
- Add a `bots-tui` CI job that installs a pinned toolchain with `dtolnay/rust-toolchain@stable` plus the `clippy` and `rustfmt` components, then runs `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings` and `cargo test`.
- Create `crates/bots-tui/tests/fixtures/bots` carrying the payloads phases 001 and 002 ship - `activity --json` with its `groups` array, `inbox --json` with its `items` array, `routines --json` as an array - plus `status --json` carrying the `lastRun.branch` and `lastRun.worktreePath` keys 004 adds, and own it as the copy of every `--json` contract the screen reads: a phase that changes one of those payloads updates the fixture in the same change. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:129] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/acceptance-criteria.md:43] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/acceptance-criteria.md:55] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/acceptance-criteria.md:56] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/acceptance-criteria.md:62]

### Out of Scope
- The chat pane - it needs `bots chat`, which is phase 010, so the fourth tab draws one line naming that phase and holds no state.
- `bots activity --json`, `bots inbox --json` and `bots routines --json` - phases 001 and 002 own those verbs, and this phase consumes them unchanged.
- A `--json` mode on `bots answer` - the screen reads the exit code and stderr the verb already writes.
- Mouse support, themes beyond the terminal default, and a desktop shell - openhuman's pointer hit testing and theme picker are design detail this phase does not need, and the research rules the desktop shell out. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:151]
- Editing a BOT.md, installing a schedule or starting a run from the screen - each is a write verb with its own confirmation rules, and none is needed to read the three surfaces.
- A `THIRD_PARTY_NOTICES.md` entry - no third-party code is copied, so there is nothing to notice; the design reference is recorded in the crate README instead.
- The hub's mode table, `hub-router.json`, `mode-registry.json` and `ROUTER.md` - `bots ui` is a read surface over status, not a fifth mode.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `crates/bots-tui/Cargo.toml` | Create | Crate manifest: MIT, binary `bots-ui` beside the auto-detected library target, ratatui 0.30, crossterm 0.29, serde, serde_json, unicode-width |
| `crates/bots-tui/Cargo.lock` | Create | Pinned dependency graph, committed because the crate ships a binary |
| `crates/bots-tui/src/lib.rs` | Create | The library root: argument parsing, the terminal guard with its restore and panic hook, and the loop entry, with each module task adding its own `pub mod` line here, so `cargo test --lib` and `tests/*.rs` both reach the crate |
| `crates/bots-tui/src/main.rs` | Create | The binary: calls the library's entry point and maps its result to the exit code |
| `crates/bots-tui/src/app.rs` | Create | The loop: poll a key, map it to an action, run the action, redraw, plus the closed-input and Esc lib tests, which read the fixture's argv log |
| `crates/bots-tui/src/ui_state.rs` | Create | Pure state: active tab, selection, overlay, rows, status line, palette |
| `crates/bots-tui/src/keys.rs` | Create | Key-to-action table and the drawn label for each binding |
| `crates/bots-tui/src/cli.rs` | Create | The `bots ... --json` client: the program and its arguments as a parameter defaulting to `node` plus `<skilled-tree>/.skilled/bin/bots.cjs`, spawn, parse, typed rows, answer |
| `crates/bots-tui/src/activity.rs` | Create | The six markers, the seven group ids they map to and the runtime-value mapping |
| `crates/bots-tui/src/render.rs` | Create | The frame: header, tab bar, body, banner, input, footer |
| `crates/bots-tui/src/render/panes.rs` | Create | The activity, inbox, routines and chat-placeholder bodies |
| `crates/bots-tui/src/render/overlay.rs` | Create | The overlay panel and its numbered choices |
| `crates/bots-tui/tests/cli_client.rs` | Create | Integration tests against the fixture `bots` script |
| `crates/bots-tui/tests/render_keys.rs` | Create | `TestBackend` assertions that every bound key is drawn |
| `crates/bots-tui/tests/fixtures/bots` | Create | The fake CLI: canned JSON per verb, records its argv. It carries the payloads phases 001 and 002 ship - `activity --json`, `inbox --json` and `routines --json` - plus `status --json` with the `lastRun.branch` and `lastRun.worktreePath` keys 004 adds, and it is the copy of every `--json` contract the screen reads, so a phase that changes one updates it in the same change. Committed mode 0755 |
| `crates/bots-tui/README.md` | Create | Build, run, keys, and the openhuman design reference with no code copied |
| `.skilled/bin/bots.cjs` | Modify | The `ui` verb: usage line, verb spec, binary resolution, exec, exit passthrough, the `ui-unavailable` and `ui-not-built` refusals |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-ui.vitest.ts` | Create | The `ui` verb's tests: argv, exit passthrough, both refusals |
| `.skilled/skills/system-skilled-bots/SKILL.md` | Modify | One line naming `bots ui` as a status surface |
| `.github/workflows/bots-runtime.yml` | Modify | Two path entries and one `bots-tui` job: a pinned `dtolnay/rust-toolchain@stable` with `clippy` and `rustfmt`, then fmt, clippy and test |
| `.gitignore` | Modify | Ignore `/crates/bots-tui/target/` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node .skilled/bin/bots.cjs ui --repo <path>` execs `<skilled-tree>/crates/bots-tui/target/release/bots-ui` with `--repo <path> --skilled-tree <skilled-tree>`, inherits stdio and exits with the binary's code. With `BOTS_UI_BIN` unset it refuses before dispatch and exits 4 in two cases. When `<skilled-tree>/crates/bots-tui` is absent it refuses `ui-unavailable` and says the screen ships only in a source checkout, naming `cargo build --release --manifest-path crates/bots-tui/Cargo.toml`. When the crate is present and the binary is absent it refuses `ui-not-built` and writes `bots: no bots-ui binary at <path>; build it with cargo build --release --manifest-path crates/bots-tui/Cargo.toml`. |
| REQ-002 | `crates/bots-tui/Cargo.toml` declares `license = "MIT"`, and `rg -n 'openhuman' crates/bots-tui/src` matches only comment lines that name the design reference. No file in the crate carries a GPL header or a copied openhuman function. |
| REQ-003 | The binary reads only through `bots ... --json` and writes only through `bots answer <item-id> <text> --scope once\|deny`. `cli.rs` takes the program and its arguments from its caller, defaulting to `node` plus `<skilled-tree>/.skilled/bin/bots.cjs`, so every read is one `<program> <verb> --json --repo <repo>` call and the tests point it at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")`, which resolves from the crate directory cargo runs tests in. The binary opens no file under the state root. |
| REQ-004 | The tab bar holds four tabs: Alt+1 activity, Alt+2 inbox, Alt+3 routines, Alt+4 chat. Ctrl+P opens the command palette and Ctrl+D exits. The chat tab draws one line naming phase 010 and holds no state. |
| REQ-005 | The activity pane draws the rows `bots activity --json` returns, keyed by the `state` each row carries, which is one of phase 001's seven group ids. Six markers cover the seven ids: `·` working, `✓` done, `✗` failed, `!` needs_you, `–` stopped, and `?` for `scheduled` and `recurring`, which share it because neither has a run yet and the reference draws no marker for a run that has not begun; each still draws its own label. The row shape is phase 001's REQ-002: `botId`, `identity`, `state`, `at`, `actor` and `runId`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:152] |
| REQ-006 | The inbox pane lists every open and expired item from `bots inbox --json`. Number keys 1 to 9 pick the option at that position when the item has options. `y` answers `approve` with `--scope once` and `n` answers `deny` with `--scope deny`, so every write is `bots answer <item-id> <text> --scope once\|deny`. Deny is `n`; no other key denies. The overlay offers no `always` and no `conversation` scope, because a standing grant needs a rule store no phase lands. |
| REQ-007 | The routines pane draws the rows `bots routines --json` returns: the bot id, the four-part routine sentence and the routine's state. |
| REQ-008 | When `bots inbox --json` reports at least one open item, a banner line sits above the input row reading `! <n> pending approval · Ctrl+P → inbox` when n is 1 and `! <n> pending approvals · Ctrl+P → inbox` otherwise. With no open item the row is blank. |
| REQ-009 | Enter over an inbox item opens the approval overlay, which draws its choices numbered: `1 approve once`, `n deny`, `Esc close`. Esc closes the overlay and leaves the item open, and a lib test fed an Esc event proves that without a terminal. |
| REQ-010 | Every bound key is drawn on screen in the frame that binds it: the footer names `Alt+1..4`, `Ctrl+P` and `Ctrl+D`; the inbox footer names `1-9`, `y`, `n` and `Esc`; the overlay names `1`, `n` and `Esc`. |
| REQ-011 | When the input closes while an item is selected, the binary writes no answer and exits 0, and `bots inbox --json` still lists the item as open. The loop takes its events from a source the caller supplies, so a closed input is one event a lib test feeds without a terminal, and that test asserts the fixture recorded no `answer` argv. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-012 | A CLI call that exits non-zero draws its stderr in the status row and keeps the rows from the last successful call. |
| REQ-013 | The screen re-reads every surface on a 5-second poll and on every tab switch. |
| REQ-014 | A runtime status value the mapping does not name draws `?` with the raw value beside it, never a blank cell. |
| REQ-015 | The terminal is restored on exit and on panic: raw mode off, alternate screen left, cursor shown. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### Design references

Each layout and key requirement follows one openhuman-tui file for its shape and copies none of its code. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:133]

| Requirement | Reference | What it fixes |
|-------------|-----------|---------------|
| REQ-004 | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs:351-364] | Alt+1..4 selects a tab, and Ctrl+Tab cycles |
| REQ-004 | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs:300-306] | Ctrl+P opens the command palette |
| REQ-005 | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/activity.rs:6-33] | Six statuses, their labels and their markers |
| REQ-006 | [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/ask-card.js:264-268] | A number key takes the choice it stands at |
| REQ-006 | [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:431-447] | `y`/`n` answer, and closed input is unanswered rather than a no |
| REQ-008 | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:221-229] | The pending-approval banner sits above the input |
| REQ-009 | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render/overlay.rs:96-109] | The approval overlay draws its choices numbered |
| REQ-009 | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app/overlays.rs:354-370] | The decision shortcut table |

One key deviates from the reference on purpose: openhuman denies with `Delete`, and this screen denies with `n`. `Delete` is not drawn on every keyboard and a terminal may not deliver it, while `n` is the turnstone key and is drawn. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app/overlays.rs:366]
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/bin/bots.cjs ui --repo .` opens a screen whose header names four tabs and whose footer names `Alt+1..4`, `Ctrl+P` and `Ctrl+D`.
- **SC-002**: With one open item, the banner reads `! 1 pending approval · Ctrl+P → inbox`, and pressing `n` in the overlay leaves that item's file carrying `answer.text` `deny` and `answer.scope` `deny`. The readback is the item file, not `bots inbox --json`, which lists only open and expired items. [SOURCE: .skilled/bin/bots.cjs:465] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:155]
- **SC-003**: `cargo test` in `crates/bots-tui` passes, including the render test that asserts every bound key appears in the drawn buffer.
- **SC-004**: `cargo clippy --all-targets -- -D warnings` and `cargo fmt --check` exit 0 in `crates/bots-tui`.
- **SC-005**: `rg -n 'openhuman' crates/bots-tui/src` matches only comment lines, and `crates/bots-tui/Cargo.toml` declares `license = "MIT"`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001's `bots activity --json` and `bots inbox --json` | The activity and inbox panes cannot be built against a real payload | The client is written against the fixture script, so both panes are testable before 001 lands; the phase starts after 001 and 002 close |
| Dependency | Phase 002's `bots routines --json` | The routines pane cannot be built against a real payload | Same fixture seam, and the pane draws whatever rows the verb returns |
| Dependency | Phase 001's `bots answer --scope once\|deny` flag | The screen cannot record a deny as a deny, and every answer would record `once` | The screen passes `--scope` on every write, so it starts after 001 closes; 001 records `once` or `deny`, and 006 extends the scope with `grants` and the ladder, which the screen reads neither of, so it never waits for 006 |
| Risk | A GPL-3.0 design reference invites copying | High | No openhuman file is opened while writing code except to read the shape; the crate README records the reference; a review step greps for openhuman identifiers and GPL headers |
| Risk | A TUI that shells out per refresh is slow on a large index | Medium | One call per surface per refresh, a 5-second interval, and the status index is already built |
| Risk | A panic leaves the terminal in raw mode | Medium | A panic hook restores the terminal, and a test drives a panic through it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: One frame draws in under 16 ms at 120x40 with 200 rows in the active pane.
- **NFR-P02**: One refresh spawns at most four `bots` processes, one per surface.

### Security
- **NFR-S01**: The binary reads no credential and adds no environment variable to the CLI it spawns; the child inherits the parent environment unchanged.
- **NFR-S02**: The answer text reaches the runtime only through `bots answer`, which already refuses a secret literal before it stores the answer. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:1-14]

### Reliability
- **NFR-R01**: A CLI failure never blanks the screen; the rows from the last successful call stay until a later call succeeds.
- **NFR-R02**: The terminal is restored on every exit path, including a panic and a signal.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no open item, no activity row and no routine row - each pane draws its own one-line empty message and the banner row is blank.
- Maximum input: 500 inbox items and 2,000 activity rows - the list scrolls, the selection stays visible, and the frame still draws under 16 ms.
- Failure path: `bots status --json` exits 1 - the status row shows its stderr, the previous rows stay, and the binary does not exit.
- Narrow terminal: under 24 columns or 8 rows, the frame draws `Resize terminal · Ctrl+D exits` and nothing else.
- Closed input: the input closes with an item selected - nothing is written, the binary exits 0, and the item stays open.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | One new crate of ten source files and about 1,800 lines, one CLI verb, one CI job |
| Risk | 12/25 | No auth, no migration and no shared contract changes; a new binary and a new dependency set |
| Research | 8/20 | The design references are read once; the JSON contracts belong to phases 001 and 002 |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Phase 001 fixes the `bots activity --json` shape before this phase starts. Decision: the client is written against the shape phase 001 documents and the fixture carries it; the runtime is not changed to suit the screen.
- Should the fourth tab be Chat or absent? Decision: present as a placeholder, so Alt+1..4 does not renumber when phase 010 lands.
- Does `bots answer` need a `--json` mode for the screen to report the outcome? Decision: no. The screen reads the exit code and stderr, which the verb already writes.
- Should the overlay offer `always`? Decision: no. A standing grant needs a rule store that no phase lands, so the overlay offers `once` and `deny`. It returns when a later packet lands a rule store with `bots grants list|revoke`, a 30-day default expiry, a scope bound to bot plus kind, and an audit row on every grant and revoke.
<!-- /ANCHOR:questions -->

---
