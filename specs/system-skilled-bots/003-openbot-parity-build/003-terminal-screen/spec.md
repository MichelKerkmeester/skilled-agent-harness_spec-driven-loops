---
title: "Feature Specification: Phase 3: terminal-screen"
description: "A Level 3 phase parent for one MIT Rust ratatui binary, `bots ui`, that draws the activity, inbox and routine surfaces from the runtime's `--json` verbs and answers a needs-you item through `bots answer`, split into six children from the UX map to the hardening proof."
trigger_phrases:
  - "terminal screen"
  - "phase 3 terminal screen"
  - "bots ui"
  - "ratatui terminal screen"
  - "terminal screen phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen"
    last_updated_at: "2026-11-25T21:12:34Z"
    last_updated_by: "review-fix-pass"
    recent_action: "Aligned REQ-010 to the key map and moved NO_COLOR to the ui verb"
    next_safe_action: "Work child 001-ux-and-component-map"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w4-003-terminal-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->
<!-- SPECKIT_LEVEL: 3 -->
# Feature Specification: Phase 3: terminal-screen

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-skilled-bots/003-openbot-parity-build` |
| **Phase** | 3 of 14 |
| **Predecessor** | `002-routine-layer` |
| **Successor** | `004-computer-exposure` |
| **Handoff Criteria** | `cargo test`, `cargo clippy --all-targets -- -D warnings` and `cargo fmt --check` pass in `crates/bots-tui`; `bots ui` opens against this repository; one needs-you item answered from the screen reads back as answered from its item file, because `bots inbox --json` lists only open and expired items. The last two need a tty by design, so they are proven by hand and never by a piped command |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The runtime answers every question an operator has as text: `bots status` prints rows, `bots inbox` prints tab-separated items, and phases 001 and 002 add `bots activity` and `bots routines` in the same shape. Reading three commands to learn what the bots did, what needs an answer and what each routine is set to is work the operator repeats every time they look. openhuman proves a terminal can draw all four surfaces from data a runtime already holds, but its client is GPL-3.0-only and cannot be lifted into this MIT tree. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:29] [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2]

### Purpose
One screen that draws activity, inbox and routines from the runtime's own JSON and answers a needs-you item without leaving the terminal.

> **Phase-parent note:** This `spec.md` is the only authored document at the parent level. The plan, tasks, acceptance criteria, decisions and continuity of each work stream live in the six child phase folders listed in the Phase Documentation Map below. The parent carries the purpose, the scope, the operator decisions and the defects the expansion fixes, so a child can be worked without reading the other five.
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
- One MIT Rust crate at `crates/bots-tui/` whose binary `bots-ui` draws four tabs, a pending-approval banner, an approval overlay and the eight status glyphs, and whose library target lets `cargo test --lib` and `tests/*.rs` reach every module.
- One `ui` verb in `.skilled/bin/bots.cjs` that resolves the built binary, execs it with `--repo` and `--skilled-tree`, inherits stdio, passes the exit code through, and refuses `ui-unavailable` when the crate is absent and `ui-not-built` when only the binary is. The verb reads `NO_COLOR` and passes `--mono`, and passes `--ascii` when asked, so the binary reads no environment variable of its own.
- The activity, inbox and routines panes, drawn from `bots activity --json`, `bots inbox --json` and `bots routines --json`, and one answer written through `bots answer` with `--scope`.
- A tracked `design/` folder holding the ASCII mockups per state at 80x24 and 120x40, the key map, the glyph table and the component inventory, written in our own words with `file:line` pointers into the reference sources.
- A `bots-tui` CI job that installs a pinned toolchain with `dtolnay/rust-toolchain@1.92.0` plus the `clippy` and `rustfmt` components, then runs `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings` and `cargo test`.
- `crates/bots-tui/tests/fixtures/bots`, the fake CLI that carries the payloads phases 001 and 002 ship and records its argv.

### Out of Scope
- The chat pane - it needs `bots chat`, which is phase 010, so the fourth tab draws one line naming that phase and holds no state.
- `bots activity --json`, `bots inbox --json` and `bots routines --json` - phases 001 and 002 own those verbs, and this phase consumes them unchanged.
- A `--json` mode on `bots answer` - the screen reads the exit code and stderr the verb already writes.
- Mouse support, a theme picker, a demo binary, a bench flag, and accessibility, themes or the test harness as separate phases - each child carries its own part of those.
- A desktop shell - the research rules it out, and openhuman's pointer hit testing is design detail this phase does not need. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:151]
- Editing a BOT.md, installing a schedule or starting a run from the screen - each is a write verb with its own confirmation rules, and none is needed to read the three surfaces.
- `insta` as a dependency - snapshot tests assert the ratatui `TestBackend` buffer directly.
- A `THIRD_PARTY_NOTICES.md` entry - no third-party code is copied, so there is nothing to notice; the design reference is recorded in the crate README instead.
- The hub's mode table, `hub-router.json`, `mode-registry.json` and `ROUTER.md` - `bots ui` is a read surface over status, not a fifth mode.

### Dependencies
- Phase 001's `bots activity --json` and `bots inbox --json`, which the activity and inbox panes read.
- Phase 002's `bots routines --json`, which the routines pane reads.
- Phase 001's `bots answer --scope once|deny` flag, which records the scope on the item's answer. Phase 006 extends that scope with `grants` and the ladder. The screen draws a grant's kind and rung only when the item carries them and draws nothing where they are absent, so it builds before 006 and lights up after it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:82]
- `bots status --json`, which exists today and which the header reads for the bot count and the index staleness flag. The count is the rows whose `kind` is `bot`, so a needs-you row never counts as a bot. Phase 004 adds `lastRun.branch` and `lastRun.worktreePath` to that payload, which the header ignores and the fixture carries. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:147]

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `crates/bots-tui/design/` | Create | 001 | Mockups per state at both sizes, the key map, the glyph table, the component inventory |
| `crates/bots-tui/Cargo.toml` | Create | 002 | MIT manifest: binary `bots-ui` beside the library target, ratatui 0.30, crossterm 0.29, serde, serde_json, unicode-width, libc |
| `crates/bots-tui/Cargo.lock` | Create | 002 | Pinned dependency graph, committed because the crate ships a binary |
| `crates/bots-tui/src/lib.rs` | Create | 002 | Library root: argument parsing, the terminal guard, the loop entry, one `pub mod` line per module |
| `crates/bots-tui/src/main.rs` | Create | 002 | The binary: calls the library entry point and maps its result to the exit code |
| `crates/bots-tui/src/app.rs` | Create | 002 | The loop: poll a key, map it to an action, run the action, redraw |
| `crates/bots-tui/src/event.rs` | Create | 002 | The event source the caller supplies, so a test drives the loop without a tty |
| `crates/bots-tui/src/state.rs` | Create | 002 | Pure reducer `update(state, msg) -> Vec<Effect>` |
| `crates/bots-tui/src/data.rs` | Create | 002 | The worker thread and the generation-tagged channel |
| `crates/bots-tui/src/cli.rs` | Create | 002 | The only module that spawns a process: program, arguments, spawn, parse, answer |
| `crates/bots-tui/src/model.rs` | Create | 002 | serde types with defaults, an unknown state kept as `Unknown(raw)` |
| `crates/bots-tui/src/terminal.rs` | Create | 002 | RAII guard with a chained panic hook |
| `crates/bots-tui/src/keys.rs` | Create | 003 | Key-to-action table and the drawn label for each binding |
| `crates/bots-tui/src/theme.rs` | Create | 003 | System and Mono palettes, Mono selected by `--mono` and the ASCII glyph set by `--ascii`; the binary reads no environment variable |
| `crates/bots-tui/src/view/header.rs` | Create | 003 | Header: bot count and the stale flag |
| `crates/bots-tui/src/view/tabs.rs` | Create | 003 | Tab bar |
| `crates/bots-tui/src/view/footer.rs` | Create | 003 | Footer generated from `keys.rs` |
| `crates/bots-tui/src/view/mod.rs` | Create | 003 | The shell frame: the seven bands, the too-small screen and the palette panel, and the module root 004 and 005 add their `mod` lines to |
| `crates/bots-tui/src/view/panes.rs` | Create | 004 | Activity, inbox, routines and chat-placeholder bodies |
| `crates/bots-tui/src/view/banner.rs` | Create | 005 | The pending-approval row: the open item count, the inbox tab key label read from `keys.rs`, and the hidden state |
| `crates/bots-tui/src/view/overlay.rs` | Create | 005 | Decision and choice overlays, free-text entry, the in-flight lock |
| `crates/bots-tui/tests/fixtures/bots` | Create | 002 | The fake CLI: canned JSON per verb, records its argv, committed mode 0755 |
| `crates/bots-tui/tests/cli_client.rs` | Create | 002 | Integration tests against the fixture |
| `crates/bots-tui/tests/render_keys.rs` | Create | 003 | `TestBackend` assertions that every bound key is drawn |
| `crates/bots-tui/tests/panes.rs` | Create | 004 | One buffer snapshot per pane per state at both sizes |
| `crates/bots-tui/tests/answer_flow.rs` | Create | 005 | The argv log, Esc and closed input |
| `crates/bots-tui/README.md` | Create | 006 | Build, run, keys, and the openhuman design reference with no code copied |
| `.skilled/bin/bots.cjs` | Modify | 002 | The `ui` verb: usage line, verb spec, binary resolution, exec, exit passthrough, both refusals |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-ui.vitest.ts` | Create | 002 | The `ui` verb's tests: argv, exit passthrough, both refusals |
| `.skilled/skills/system-skilled-bots/SKILL.md` | Modify | 006 | One line naming `bots ui` as a status surface |
| `.github/workflows/bots-runtime.yml` | Modify | 002 | Two path entries and one `bots-tui` job |
| `.gitignore` | Modify | 002 | Ignore `/crates/bots-tui/target/` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS THE CHILDREN INHERIT

These requirements hold across every child. A child that restates one keeps its id and its wording, so a citation from another phase still resolves.

| ID | Requirement | Carried by |
|----|-------------|------------|
| REQ-002 | `crates/bots-tui/Cargo.toml` declares `license = "MIT"`, and `rg -n 'openhuman' crates/bots-tui/src` matches only comment lines that name the design reference. No file in the crate carries a GPL header or a copied openhuman function. | 002, 006 |
| REQ-003 | The binary reads only through `bots ... --json` and writes only through `bots answer <item-id> <text> --scope once\|deny`. `cli.rs` takes the program and its arguments from its caller, defaulting to `node` plus `<skilled-tree>/.skilled/bin/bots.cjs`, so every read is one `<program> <verb> --json --repo <repo>` call and the tests point it at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")`, which resolves from the crate directory cargo runs tests in. The binary opens no file under the state root. | 002, 004, 005 |
| REQ-004 | The tab bar holds four tabs: Alt+1 activity, Alt+2 inbox, Alt+3 routines, Alt+4 chat, with `[` and `]` as the fallback pair. Ctrl+P opens the command palette and Ctrl+D exits. The chat tab draws one line naming phase 010 and holds no state. | 003 |
| REQ-006 | The inbox pane lists every open and expired item from `bots inbox --json`. Digits 1 to 9 pick the option at that position, and only inside an overlay. `y` answers `approve` with `--scope once` and `n` answers `deny` with `--scope deny`, so every write is `bots answer <item-id> <text> --scope once\|deny`. Deny is `n`; no other key denies. The overlay offers no `always` and no `conversation` scope, because a standing grant needs a rule store no phase lands. | 005 |
| REQ-010 | Every bound key is drawn on screen in the frame that binds it: the footer names `Alt+1..4`, `[` `]`, `Ctrl+P` and `Ctrl+D`, the inbox footer names `Enter open`, and the decision overlay names `t`, `n`, `y` and `Esc` and the choice overlay names `1-9`, `n` and `Esc`, each drawing `n deny` before any approve key. | 003, 005 |
| REQ-011 | When the input closes while an item is selected, the binary writes no answer and exits 0, and `bots inbox --json` still lists the item as open. The loop takes its events from a source the caller supplies, so a closed input is one event a lib test feeds without a terminal, and that test asserts the fixture recorded no `answer` argv. | 002, 005 |

### The fixture

`crates/bots-tui/tests/fixtures/bots` is the copy of every `--json` contract the screen reads: `activity --json` with its `groups` array, `inbox --json` with its `items` array, `routines --json` as an array, and `status --json` carrying the `lastRun.branch` and `lastRun.worktreePath` keys 004 adds. A phase that changes one of those payloads updates the fixture in the same change. It is the only payload source in tests: no test reads a live state root and no test needs a tty. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:133] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/acceptance-criteria.md:55] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/acceptance-criteria.md:62]
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:operator-decisions -->
## 5. OPERATOR DECISIONS

The operator answered these on 2026-11-25. `decision-record.md` holds each one with its verbatim answer; this table is the summary a child reads.

| ID | Decision |
|----|----------|
| Q002 | Phase 003 becomes a Level 3 phase parent with six nested children. Its plan, tasks, acceptance criteria and goal move into the children, and the pre-expansion documents stay in `context/legacy-003/`. |
| Q003 | The overlay takes a free-text answer when an item has no options, and single-key shortcuts pause while the operator types. |
| Q004 | The key map gains `[` and `]` as fallback tab keys beside Alt+1..4, and Ctrl+C closes an open overlay or quits and never writes. |
| Q005 | The six status markers gain a scheduled, a recurring and an unknown glyph, and the set carries an ASCII fallback. |
| Q006 | `insta` is not approved. Snapshot tests assert the ratatui `TestBackend` buffer directly. |
| Q007 | The four existing screenshots are linked, and openhuman's `--demo` is built locally to capture its TUI into the gitignored `context/screenshots/`. |
| Q008 | The overlay draws a grant's kind and rung only when the item carries them, and draws nothing where they are absent, so the screen builds before packet phase 006 and lights up after it. |
| Q009 | The `bots ui` verb reads `NO_COLOR` and passes `--mono`, and passes `--ascii` when asked, to the binary. The binary reads no environment variable, so every no-env::var check holds. |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:defects -->
## 6. DEFECTS THE EXPANSION FIXES

Each defect is a fault in the pre-expansion phase 003 as written. The child named in the last column owns the fix.

| Defect | Why it breaks | Fixed by |
|--------|---------------|----------|
| `1` carries two meanings | REQ-006 picks option 1 and REQ-009 binds `1` to approve once, so one key answers two questions | 005: digits pick options only inside an overlay |
| Alt+1..4 is unreliable on macOS | Terminal.app and iTerm send `¡™£¢` unless Option is Meta, and Ctrl+Tab is rarely delivered, so the tab bar can be unreachable | 003: `[` and `]` as the fallback pair |
| Selection by row index is unsafe | The 5-second poll reorders rows, so the selected row changes under the operator | 004: selection is `Option<ItemId>` |
| Blocking spawns freeze input | `bots status --json` took 0.18 to 0.34 s, so several sequential spawns on the loop thread freeze input about a second every 5 s | 002: a worker thread feeds one channel |
| Bot text is drawn unsanitized | A control character in a bot id or a question moves the cursor and corrupts the frame | 003: `theme::printable` replaces control characters |
| An item with no options can only get y/n | `bots answer` takes free text, so an open question with no options is unanswerable from the screen | 005: free-text entry |
| `?` marks three different states | Scheduled, recurring and unknown draw the same glyph, so the operator cannot tell a run that has not begun from a value the mapping does not name | 003: separate glyphs in `theme.rs`, drawn by 004 |
| The banner names the wrong key | It reads `Ctrl+P -> inbox`, which opens the palette, not the inbox tab | 003: the banner names the inbox tab key |
<!-- /ANCHOR:defects -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation detail - plan, tasks, acceptance criteria, decisions, continuity - lives inside the phase children.

| Phase | Folder | Scope | Depends on | Exit | Status |
|-------|--------|-------|------------|------|--------|
| 1 | `001-ux-and-component-map/` | ASCII mockups per state at 80x24 and 120x40, the key map, the glyph table and the component inventory, in a tracked `design/` folder in our own words with `file:line` pointers | None | The operator approves the key map, and every component lists its states | Draft |
| 2 | `002-architecture-and-contracts/` | The crate, the terminal guard, the worker data layer, `cli.rs`, the fixture, the `ui` verb and the CI job | 001 | CI green on an empty frame, the cli client test passes, and both refusals are proven | Draft |
| 3 | `003-shell-and-navigation/` | Header, tabs, footer generated from `keys.rs`, status row, palette and help, the too-small screen, the Mono palette | 002 | The key-label test passes, plus the shell buffer snapshots | Draft |
| 4 | `004-panes/` | Activity, inbox, routines and the chat placeholder, each with loading, empty, error and stale states | 002, 003 | One buffer snapshot per pane per state, and 2,000 rows drawn in under 16 ms | Draft |
| 5 | `005-answer-flow/` | Banner, decision and choice overlays, free-text entry, the in-flight lock, refusal display, closed input | 002, 004 | The argv log matches exactly, Esc and closed input write nothing, and the hand check passes | Draft |
| 6 | `006-hardening-and-proof/` | fmt, clippy, the GPL grep, the README and validate | 003, 004, 005 | Every gate passes | Draft |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-ux-and-component-map | 002-architecture-and-contracts | The key map is approved and every component lists its states | The operator's approval is recorded in 001's `decision-record.md`, and `design/` names a state for every component |
| 002-architecture-and-contracts | 003-shell-and-navigation | The crate builds, the `ui` verb resolves it, and both refusals print | `cargo build` exits 0, `cargo test --test cli_client` passes, and the two `ui` refusals exit 4 with their message |
| 003-shell-and-navigation | 004-panes | Every bound key is drawn and the shell snapshots pass | `cargo test --test render_keys` passes and the shell buffer snapshots match |
| 004-panes | 005-answer-flow | Each pane draws its four states and the frame budget holds | `cargo test --test panes` passes, including the 2,000-row timing assertion |
| 005-answer-flow | 006-hardening-and-proof | The argv log matches, Esc and closed input write nothing, and the hand check passes | `cargo test --test answer_flow` passes and the operator answers one item from the overlay by hand |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Phase 001 fixes the `bots activity --json` shape before this phase starts. Decision: the client is written against the shape phase 001 documents and the fixture carries it; the runtime is not changed to suit the screen.
- Should the fourth tab be Chat or absent? Decision: present as a placeholder, so Alt+1..4 does not renumber when phase 010 lands.
- Does `bots answer` need a `--json` mode for the screen to report the outcome? Decision: no. The screen reads the exit code and stderr, which the verb already writes.
- Should the overlay offer `always`? Decision: no. A standing grant needs a rule store that no phase lands, so the overlay offers `once` and `deny`. It returns when a later packet lands a rule store with `bots grants list|revoke`, a 30-day default expiry, a scope bound to bot plus kind, and an audit row on every grant and revoke.
- Where does the design folder live? Decision: `crates/bots-tui/design/`, so the mockups sit beside the code they describe and a reader of the crate finds them without leaving it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: the six `[0-9][0-9][0-9]-*/` folders beside this file, each with its own `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md`
- **Parent Spec**: `../spec.md`
- **Parent Goal**: `../goal.md`, whose binding row for this phase makes this packet's `goal.md` authoritative for it
- **Graph Metadata**: `graph-metadata.json` for the `derived.last_active_child_id` pointer
- **Operator answers**: `decision-record.md` for each decision above with its verbatim answer
- **Pre-expansion documents**: `context/legacy-003/`, gitignored, kept for reference only
