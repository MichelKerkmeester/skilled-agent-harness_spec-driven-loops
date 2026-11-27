---
title: "Implementation Summary"
description: "The bots-ui shell now draws every key it binds from one table, with a header, a tab bar, a footer, a status row, a palette that is also help, the too-small screen and a Mono palette."
trigger_phrases:
  - "shell and navigation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/003-shell-and-navigation"
    last_updated_at: "2026-11-25T20:22:33Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-shell-and-navigation"
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
| **Spec Folder** | 003-shell-and-navigation |
| **Completed** | 2026-11-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`bots-ui` now draws a real shell instead of an empty frame. Every key it binds is drawn from the same table that binds it, so the footer and the palette can never offer a key the screen ignores. On a keyboard that never delivers Alt, `[` and `]` still reach every tab.

### Phase 3: shell-and-navigation

You open the screen and see the bot count and the index age in the header, the four tabs with the active one in brackets, a rule, the body the panes fill, the banner row, the status row and two footer lines. A failed status read keeps the last count and puts `status failed` on the right. A stale index shows `stale 2m`. The status row shows the first stderr line of the last failed call with every control character turned into `?`. Ctrl+P or `?` opens the palette, which lists every binding once, filters as you type, runs the selected row on Enter and closes on Esc or Ctrl+C. Below 24 columns or 8 rows you see `Too small · Ctrl+D exit` and nothing else. `--mono` resets every colour and `--ascii` swaps the glyph column, and neither changes a symbol a frame draws.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `crates/bots-tui/src/keys.rs` | Modified | The 29 approved shell rows in `SHELL_ROWS`, plus `PALETTE_LINES`, `row_holds`, `palette_filtered` and `palette_action` and their tests |
| `crates/bots-tui/src/theme.rs` | Modified | The System and Mono palettes, the one glyph table with its ASCII column, `marker`, `state_color`, `printable` and the focus mark and rule glyphs |
| `crates/bots-tui/src/state.rs` | Modified | `on_shell_action`: the tab arms, every palette arm and the quit a palette entry can run, with its own test module |
| `crates/bots-tui/src/view/mod.rs` | Modified | The seven bands, the too-small screen and the palette panel |
| `crates/bots-tui/src/view/header.rs` | Created | The bot count, the index age, `stale_label`, `age_label` and the right-hand flag |
| `crates/bots-tui/src/view/tabs.rs` | Created | The four tabs with the active one bracketed and reversed |
| `crates/bots-tui/src/view/footer.rs` | Created | The two key lines generated from the table and the status row |
| `crates/bots-tui/tests/render_keys.rs` | Created | The key-label test, the two shell band snapshots and the header, status row, too-small and palette render tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every source and test file was written by a `cli-mistral-vibe` worker on `deepseek-flash`, twelve briefs in all, and no worker failed its verify, so no retry and no `cli-pi` fallback ran. Each worker built and tested through a lane script that copied the last verified crate, laid only that worker's own file over it and ran cargo with its own target folder, so no worker saw a sibling's half-written file. The unit orchestrator verified each wave in the worktree itself before the next one opened.

| Internal wave | Briefs, run at once | Outcome |
|---------------|---------------------|---------|
| Setup probes | none. T001 to T003 are read-only probes the orchestrator ran | build exit 0, fixture keys present, `no test target named render_keys` |
| Tables | `SHELL_ROWS` then the palette helpers in `keys.rs`, beside `theme.rs` | all `0`/`finished`, lib 70 then 73 passed |
| Shell | `header.rs` and `tabs.rs` beside the palette helpers, then `footer.rs` beside `view/mod.rs` | all `0`/`finished`, first full compile green, lib 88 passed |
| Palette and frame tests | `on_shell_action`, the Mono frame comparison in `theme.rs` and the first twelve render tests | all `0`/`finished`, lib 92 and render_keys 12 passed |
| Palette tests | the four palette render tests beside the two reducer-driven key tests | all `0`/`finished`, lib 94 and render_keys 16 passed |
| Gates | the orchestrator ran them | see Verification |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The band modules take `theme: &Theme` as a fourth argument | The signature the architecture froze carries no options, so a band could not know Mono. Only `view/mod.rs` calls these functions, and the later lanes call `stale_label` alone |
| `stale_label` lives in `view/header.rs` and nowhere else | REQ-013, the contracts note and T006 put it there. T005 and the architecture's signature list put it in `theme.rs`, and one formatter in one place is the requirement both sides share |
| `marker` takes `&RunState` | The architecture names a `RowState` the crate never defines. `RunState` is the activity row state and holds an unknown raw value, so it is passed by reference |
| The frame stays empty until the first resize | The event source sends the size before anything else, and the earlier `empty_frame_draws` test draws a default state and expects a blank frame. The rule keeps that test true without editing `app.rs` |
| The palette's Enter runs the first row with the label that is bound where the palette was opened | One label covers several rows, and the first such row in table order can belong to another context. From the inbox, `Alt+1..4 tabs` would otherwise do nothing |
| The shell snapshots run on the Chat tab | The Chat tab binds no list keys, so its footer depends on the shell rows alone. On Activity the list rows the panes add would change footer line 1, and the panes may not edit this test file |
| The selected palette entry carries the focus mark `›` beside reverse video | The glyph table says focus is never reverse video alone. The palette frame in the mockups draws no mark |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cargo fmt --check` and `cargo clippy --locked --all-targets -- -D warnings` | Both exit 0 |
| `cargo test --locked --manifest-path crates/bots-tui/Cargo.toml` | lib 94 passed, bin 0, `cli_client` 8 passed, `render_keys` 16 passed, doc 0. No `FAILED`. The floor was lib 57 and `cli_client` 8, so the delta is 37 lib tests and the new 16-test target |
| `--lib keys`, `--lib theme`, `--lib header`, `--lib state`, `--lib args` | 18, 7, 2, 17 and 5 passed, each naming the tests the acceptance rows list |
| Runtime `npm test` and `npm run typecheck` | 40 files, 480 passed, exit 0, typecheck exit 0. Equal to the floor |
| `rg -n 'env::var' crates/bots-tui/src` and `rg -n 'openhuman' crates/bots-tui/src` | Both print nothing |
| `rg -n 'Command::new\|read_to_string\|File::open' crates/bots-tui/src/view` | Prints nothing |
| `rg -n 'unwrap\(\)\|expect\(' crates/bots-tui/src/view` | Every hit sits below the file's `#[cfg(test)]` line |
| Clean-room comparison | The orchestrator compared `theme.rs` and `view/mod.rs` with the reference theme and render files by eye. The palette struct, the glyph table and the band layout are our own shapes. The shared facts are the 24 by 8 floor the spec fixes and the usual ANSI colour names. No function was copied |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The approved palette frame draws no focus mark.** The selected palette entry carries `›` because the glyph table rules out focus by reverse video alone. A later frame test that compares the palette with mockup frame 25 cell by cell will see the mark, so the mockup needs the mark added or the rule needs an exception.
2. **T006's verify grep needed a paren.** `rg -n 'fn stale_label' src/view/header.rs` also matched the test `stale_label_formats_the_age` the same task names, so the task's verify now reads `rg -n 'fn stale_label\('`, which prints the one definition.
3. **Two key consumers sit outside the inventory.** `rg -n 'keys::' crates/bots-tui/src` also names `app.rs` and `event.rs`, which import the `Key` type the earlier crate work wrote. Neither reads the table.
4. **The setup probes ran without a worker.** The wave table names a Vibe worker for T001 to T003. They write nothing and their verify is the probe itself, so the orchestrator ran them directly.
5. **A frame test must set `state.size` to the backend size.** The frame draws blank while the size is 0x0, and its geometry follows `frame.area()` while the key context follows `state.size`. A test that sets only one of them gets its keys from one context and its frame from another. The panes, the answer flow and the hardening tests all inherit this.
<!-- /ANCHOR:limitations -->

---
