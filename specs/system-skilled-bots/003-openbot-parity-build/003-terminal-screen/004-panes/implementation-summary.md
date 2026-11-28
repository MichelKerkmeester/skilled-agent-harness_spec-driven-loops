---
title: "Implementation Summary"
description: "The bots-ui body now draws the activity, inbox, routines and chat panes in all five states from the runtime JSON, with a selection held by row key and a pending-approval banner."
trigger_phrases:
  - "panes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes"
    last_updated_at: "2026-11-25T20:22:34Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-panes"
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
| **Spec Folder** | 004-panes |
| **Completed** | 2026-11-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`bots-ui` now fills the body the shell left empty. Each tab draws its surface from the JSON the runtime prints, in every state it can be in, and no byte the runtime did not mean as text reaches a cell.

### Phase 4: panes

You open the activity tab and see the seven groups in the order the runtime sends them, each row with its marker, its bot id, its state and when it happened. The inbox lists the open items with `!` in the gutter and the expired ones dimmed, with no key that would answer them. An answered row keeps its outcome word until the next read. The routines tab draws each routine as its four-part sentence and its state line. The chat tab names phase 010. Each data pane draws a named loading line, an empty line that says what would appear, its rows, the first stderr line when nothing was ever read and its rows under `stale 2m` when a later read fails. At 120 columns the selected row's detail sits in a right column. Up, Down, PgUp and PgDn move a selection held by the row's key, so a poll that reorders the list leaves it on the same item. The row above the status row counts the open items and names `Alt+2`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/crates/bots-tui/src/view/panes.rs` | Created | The display-width clip, the shared body frame with its detail column, the four pane bodies and the five state lines |
| `.skilled/crates/bots-tui/src/view/banner.rs` | Created | The pending-approval row, its open count and the inbox key read from the key table |
| `.skilled/crates/bots-tui/src/view/mod.rs` | Modified | `pub mod banner;` and `pub mod panes;`, and the two draw calls in the body and banner slots |
| `.skilled/crates/bots-tui/src/keys.rs` | Modified | The five `LIST_ROWS` and the `list_keys_move_the_selection` test |
| `.skilled/crates/bots-tui/src/state.rs` | Modified | `on_list_action`, `reconcile_selection` and `clamp_scroll`, plus `activity_key` and six private helpers beside them |
| `.skilled/crates/bots-tui/tests/panes.rs` | Created | The `panes` test target, which declares each test group by path |
| `.skilled/crates/bots-tui/tests/panes/*.rs` | Created | The shared frame states and corrections in `support.rs`, and the activity, inbox, routines, chat, states, wide, markers, reorder, budget, sanitize, clip and snapshot groups |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every source and test file was written by a `cli-mistral-vibe` worker on `deepseek-flash`, fifteen briefs in all. No worker failed its verify, so no retry and no `cli-pi` fallback ran. Before the first brief the orchestrator wrote one drawing spec that settles every string, column and signature, and checked it with a reference renderer that rebuilt all seventeen pane frames from the fixtures. That run found the only two mockup defects before any worker met them. Each worker built and tested through a lane runner that copied the last verified crate, laid only that worker's files over it and ran cargo with its own target folder. After each wave the orchestrator reran every verify in the worktree before the next wave opened.

| Internal wave | Briefs, run at once | Outcome |
|---------------|---------------------|---------|
| Setup probes | none. T001 to T003 are read-only probes the orchestrator ran | build exit 0, render_keys 16 passed, the three `jq -e` probes `true`, the three `rg` probes printed their lines |
| 1 | the clip with the draw seam, beside the list rows with the reducer arms | both `0`/`finished`, lib 96 passed |
| 2 | the activity pane with the test scaffolding, beside the body wiring then the banner | all `0`/`finished`, lib 98 and panes 5 passed |
| 3 | the inbox pane, beside the reorder test and the 2,000-row test | all `0`/`finished`, panes 11 passed and 1 ignored |
| 4 | the routines pane, beside the sanitizer test and the wide-cell clip test | all `0`/`finished`, panes 15 passed |
| 5 to 7 | the chat placeholder, then the five states, then the grant line with the wide test | each `0`/`finished`, panes 16, 19 and 20 passed |
| 8 | the snapshot table | `0`/`finished`, panes 53 passed and 1 ignored |
| Gates | the orchestrator ran them | see Verification |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Frame "Shell, Activity tab, rows" is compared against eleven corrected lines held in `tests/panes/support.rs` | That mockup draws `in 5h` where the fixture's next fire is 4h 45m 56s ahead and the one age formatter rounds down, and it draws its 120x40 detail column two rows low with no rule on rows 3 and 4. Every other 120x40 pane frame and the contracts' own replacement block draw it one way. The mockup is out of this child's scope and the CI diff keeps the crate copy equal to it, so the correction lives in the test and asserts the mockup still differs |
| Each test group lives in its own file under `tests/panes/`, declared by `#[path]` | An integration test file is a crate root, so plain `mod` lines would resolve beside it and cargo would build each file as its own target. One file per group let four workers write tests at once without two holding one file |
| The detail column was built with each pane body, and T011 added the grant line and its proof | Each body task compared its own rows to the frame at both sizes, so a layout error failed inside the task that owned the file to fix rather than in the snapshot task, whose retry could not touch `panes.rs` |
| `state.rs` gained `activity_key` and six private helpers beside the three arms | The key list and the display line of each pane are needed by all three arms, and the pane reads the same activity key. A copy per arm would let them drift |
| The inbox draws items in stored order | The contracts say the screen never re-sorts, and the runtime already lists open items first |
| A stale pane with no rows draws its empty lines under the stale title | The state table names no other drawing for it, and a blank body would read as a pane that never loaded |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cargo fmt --check` and `cargo clippy --locked --all-targets -- -D warnings` | Both exit 0 |
| `cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml` | lib 98 passed, bin 0, `cli_client` 8 passed, `panes` 53 passed and 1 ignored, `render_keys` 16 passed, doc 0. No `FAILED`. The floor was lib 94, `cli_client` 8 and `render_keys` 16, so the delta is four lib tests and the new target |
| `--test panes -- budget --ignored` | `two_thousand_rows_draw_under_16ms ... ok` |
| Reorder test against broken reducers | In a lane copy it failed against the stubbed reducer this child replaced and against a reconcile that keeps the row index |
| Snapshot table against a removed correction | In a lane copy `activity_rows_80x24` failed on the `in 4h` cell |
| Runtime `npm test` and `npm run typecheck` | 40 files, 480 passed, exit 0, typecheck exit 0. Equal to the floor |
| `rg -n 'Command::new' .skilled/crates/bots-tui/src` | Prints only `src/cli.rs:95` |
| `rg -n 'openhuman' .skilled/crates/bots-tui/src`, the GPL grep and `rg -n 'env::var' src/view/panes.rs` | All print nothing |
| `rg -n 'unwrap\(\)\|expect\(' src/view/panes.rs src/view/banner.rs` | `panes.rs` has none. The two in `banner.rs` sit below its `#[cfg(test)]` line |
| Clean-room comparison | The orchestrator compared `src/view/panes.rs` with the reference activity and render files by eye. The reference activity file projects tool and child runs with its own status enum and marker method, and its render file draws a chat transcript. Ours draws grouped runtime JSON through 003's glyph table. The shared facts are the glyph characters, which are that table's. No function was copied |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The activity mockup carries two defects.** `001-ux-and-component-map/design/mockups.md` frame "Shell, Activity tab, rows" draws `in 5h` and its 120x40 detail column two rows low. The crate copy must stay equal to it, so the fix belongs to the design packet. When it lands, the corrections in `tests/panes/support.rs` fail by name and are removed.
2. **The identity filter is still not built.** `design/contracts.md` section 2 drops rows whose `identity` is another checkout's. 003.002 left it to the pane work, but no task or criterion here names it, so it stays open for a later crate unit.
3. **Two literal checks match more than they mean.** `rg -n 'insta' $CRATE/tests` matches `installed`, `reinstall` and `instant` in files older than this child, and the plan's `rg -n 'theme::marker' src/view/panes.rs` finds the call as `theme.marker(`, the theme's own wrapper over the one table. `rg -nw 'insta'` prints nothing and `rg -n 'marker\(' src/view/panes.rs` prints the one call.
4. **The ASCII marker test draws at 80x40.** Eight one-row groups need sixteen list lines and the 80x24 page holds fifteen, so the test keeps every row in view by drawing taller.
<!-- /ANCHOR:limitations -->

---
