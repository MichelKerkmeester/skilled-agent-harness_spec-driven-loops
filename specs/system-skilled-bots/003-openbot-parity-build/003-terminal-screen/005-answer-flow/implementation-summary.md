---
title: "Implementation Summary"
description: "bots-ui now answers a needs-you item from the terminal: one overlay records a deny as a deny, takes a typed line, locks its keys while the answer is out and writes nothing when you close it."
trigger_phrases:
  - "answer flow implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow"
    last_updated_at: "2026-11-25T20:22:35Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-answer-flow"
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
| **Spec Folder** | 005-answer-flow |
| **Completed** | 2026-11-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`bots-ui` can now answer what it shows. Enter on an open inbox item opens one panel, and the only writes it can make are `bots answer --scope once|deny --repo <repo> -- <item-id> <text>`, so a deny is recorded as a deny and a text that starts with a dash is still sent as text.

### Phase 5: answer-flow

You open an item and see its bot, its state, its age and its question, then `n deny` before `y approve once` in the footer. An item with options draws them numbered and takes `1` to `9`. An item with none takes `t`, and from then on every key is text, so a line may start with `y` or `n`. Once you press an answer key the panel says `sending…  keys locked` and every answer key is dead until the reply lands, even if you close the panel and open the item again. A refusal shows the runtime's own line, `bots: answer-not-approver` for example, in the panel and the status row, keeps the panel open on the same item and keeps your typed line for `t`. A refusal that no retry can fix, or a refresh that no longer lists the item open, turns the panel into a gone panel with only Esc, Ctrl+C and Ctrl+D live. An expired item opens straight into it. Esc, Ctrl+C, a closed input, an unbound key and a paste write nothing. A paste only ever adds text to a typed line. An item carrying a grant draws its kind and rung, and an item carrying none draws no grant row.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/crates/bots-tui/src/state.rs` | Modified | `on_overlay_action`, `reconcile_overlay`, `overlay_on_answered` and the paste arm, with the `on_overlay_action` test module |
| `.skilled/crates/bots-tui/src/keys.rs` | Modified | The ten `OVERLAY_ROWS`, in the order the footer draws them, and three key tests |
| `.skilled/crates/bots-tui/src/view/overlay.rs` | Created | The panel: the five phases, the numbered options, the grant row, the typed line with its cursor, and eight render tests |
| `.skilled/crates/bots-tui/src/view/mod.rs` | Modified | `pub mod overlay;` and the overlay call after the pane and the banner |
| `.skilled/crates/bots-tui/src/cli.rs` | Modified | A refused answer's line is the runtime's first stderr line, or `bots-ui: answer exited <code>` when stderr is empty |
| `.skilled/crates/bots-tui/tests/answer_flow.rs` and `tests/answer_flow/*.rs` | Created | The 21 answer-flow tests in four groups over one shared flow, each proven from the fake CLI's argv log |
| `.skilled/crates/bots-tui/tests/end_to_end.rs` | Created | The real loop from the fake CLI to frame 1 and, after Alt+2, Enter and `y`, to frame 27, at both sizes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ten Vibe workers on `deepseek-flash` built it in four internal waves, and every one ended `0`/`finished` on its first run, so no retry and no fallback was spent. The orchestrator ran the four setup probes itself. Wave A ran T008 then T007 in one slot, because both are lib files, beside the answer-flow scaffold. Wave B ran T006 and T010 side by side once the key table had passed. Wave C ran T012 and the four answer-flow groups, five workers at once. After each wave the orchestrator reran every verify command the tasks name and read its output, then ran the formatter, the linter, the whole crate suite and the runtime suite as the closing gate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `cli.rs` now returns the runtime's own first stderr line for a refused answer | 002 built it as `bots: answer exited 4: <reason>`, the read shape its `contracts.md` section 9 fixes for reads only, while its own architecture row says the answer call returns the stderr first line. Frame 21, REQ-016, SC-005 and AC-008 all draw `bots: answer-not-approver`. The orchestrator added T008 for it, so this is a deviation on a merged unit's file and its test, not an operator decision |
| The key table landed before the reducer | The reducer's transition table presses keys through `update`, so it reads `OVERLAY_ROWS`, and the overlay's label test does too |
| Enter on an expired, answered or in-flight item still opens the panel | REQ-017 and the state machine open an expired item in gone and an in-flight one in sending, so you see why no key acts instead of a key that does nothing |
| The panel clears the whole body, not only its own rectangle | Every overlay frame draws the body blank outside the panel at 120x40 |
| A gone choice item draws its options as one `options` line | No digit is live in gone, so the numbered lines would offer a pick that cannot happen |
| The answer suite is four group files over one shared flow | Four workers could write it at once without two holding one file, as 004 did for the panes |
| The end-to-end test reuses 004's `expected_frame` | Frame 1's two mockup defects stay corrected in one table, the one 013 is set to delete |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cargo fmt --check` | PASS, exit 0 |
| `cargo clippy --locked --all-targets -- -D warnings` | PASS, exit 0 |
| `cargo test --locked`, every target | PASS, exit 0: lib 117 (floor 98), answer_flow 22 (new), cli_client 8, end_to_end 2 (new), panes 53 with 1 ignored, render_keys 16 |
| `rg -n 'Command::new' .skilled/crates/bots-tui/src` | PASS, only `cli.rs:95` |
| Runtime `npm test` and `npm run typecheck` | PASS, 43 files and 548 tests, typecheck exit 0, both equal to the floor |
| Provenance | The finished overlay was compared by eye with openhuman's `render/overlay.rs`. It shares no buttons, hit areas, `safe_text` or selection list, only the `Block` and `Paragraph` shape the crate's own palette uses. No brief carried a GPL path |
| `validate.sh --strict` | PASS, `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two literal checks cannot pass as written.** T004's `rg -n 'argv'` prints nothing, because the fixture logs with `printf '%s\n' "$*"`. A live run with `--fixture-log` appended the argv line instead. AC-011 and CHK-042's `rg -n 'mod banner'` prints the very rows that quote the pattern, and every line it prints disclaims the banner.
2. **The fixture's busy refusal carries no id.** AC-021 names `bots: item-busy: <id>`, and the fixture's `refuse-item-busy` prints `bots: item-busy`. The test asserts what the fixture prints.
3. **The spawn line differs from the design.** `cli.rs` writes `bots-ui: answer did not start: <error>` where `design/state-machines.md` section 4.2 names `bots-ui: could not start <program>: <os error>`. No criterion reads it, so it is left for the doc alignment unit.
4. **The identity row filter is still not built.** `contracts.md` section 2 drops rows whose `identity` is another checkout's. No task of this child builds it, so it stays open for a later crate unit.
5. **The tests count differs across the documents.** `plan.md` and `tasks.md` say eighteen or twenty answer-flow tests in places, and T013 names twenty-one. T013's list is the one the suite meets.
<!-- /ANCHOR:limitations -->

---
