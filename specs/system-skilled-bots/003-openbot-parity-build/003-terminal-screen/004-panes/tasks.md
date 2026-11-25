---
title: "Tasks: Phase 4: panes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>. Seven waves, each naming its executor, model, effort, worker count, verify step and fallback."
trigger_phrases:
  - "pane states tasks"
  - "activity pane tasks"
  - "frame budget tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: panes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

One shell variable shortens the commands below. Set it once per shell:

```bash
CRATE=crates/bots-tui
```

Every `cargo` command names its manifest, so it runs from the repository root and needs no `cd`. Every test command runs without a tty, which is why the snapshots assert the `TestBackend` buffer directly rather than a stored file.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm 002's crate and 003's shell build, so the body this child fills exists (`$CRATE`). Verify: `cargo build --manifest-path $CRATE/Cargo.toml` exits 0 and `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` prints `test result: ok`.
- [ ] T002 Confirm the fixture carries the four payloads and the row keys the panes read (`$CRATE/tests/fixtures/bots`). Verify: `bash $CRATE/tests/fixtures/bots activity --json | jq -e '.groups[0].rows[0] | has("botId") and has("identity") and has("state") and has("at") and has("actor") and has("runId")'` exits 0, `bash $CRATE/tests/fixtures/bots inbox --json | jq -e '.items[0] | has("id") and has("botId") and has("question") and has("state") and has("options") and has("expiresAt")'` exits 0, and `bash $CRATE/tests/fixtures/bots routines --json | jq -e 'type == "array"'` exits 0.
- [ ] T003 Confirm the design references resolve and record the row shapes they fix (`specs/system-skilled-bots/context/`). Verify: `rg -n 'ACTIVITY_GROUPS' specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts` prints the seven ids, `rg -n 'nothing waiting on you' specs/system-skilled-bots/context/OpenBot-main/app/src/components/needs-you/board.tsx` prints the empty inbox line, and `rg -n 'EMPTY_BODY' specs/system-skilled-bots/context/OpenBot-main/app/src/components/routines/routines-list.tsx` prints the empty routines line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write the display-width clip, so a long question cannot push the footer off screen (`$CRATE/src/view/panes.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib panes` prints `test result: ok` and names `clips_by_display_width`.
- [ ] T005 Draw each row's state through the `marker(state, glyphs)` function `theme.rs` owns, and prove the ASCII column reaches the buffer (`$CRATE/src/view/panes.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- markers` prints `test result: ok` and names `panes_draw_the_ascii_markers`.
- [ ] T006 Write the activity pane body: the groups in payload order with their titles, each row with the marker `theme::marker` returns, its label and its bot id, and a group with no rows left out (`$CRATE/src/view/panes.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- activity` prints `test result: ok` and names `activity_groups_draw_in_payload_order`, and `-- markers` prints `test result: ok` and names `scheduled_recurring_and_unknown_carry_their_own_glyph`.
- [ ] T007 Write the inbox pane body: open items first, then expired ones dimmed and carrying no answer key, each with its bot id and its question; an open item draws `!` in the gutter and the word `open`, an expired one draws no glyph and the word `expired` (`$CRATE/src/view/panes.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- inbox` prints `test result: ok` and names `expired_item_draws_dimmed_without_answer_key`.
- [ ] T008 Write the routines pane body: the bot id, the four-part routine sentence and the state, with an empty line that says what a routine is (`$CRATE/src/view/panes.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- routines` prints `test result: ok` and names `routine_row_draws_bot_id_sentence_and_state` and `routines_empty_line_says_what_a_routine_is`.
- [ ] T009 Write the chat placeholder: one line naming phase 010 and `bots chat`, holding no state (`$CRATE/src/view/panes.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- chat` prints `test result: ok` and names `chat_placeholder_names_phase_010`.
- [ ] T010 Write the five state lines: loading, empty, rows, error and stale, with the error keeping the rows of the last successful read and the stale state drawing the label `stale_label` returns from 003's `view/header.rs` (`$CRATE/src/view/panes.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- states` prints `test result: ok` and names `loading_draws_a_named_line` and `error_keeps_rows_and_sets_stale`.
- [ ] T011 Write the wide-layout detail column: the selected row's detail as a right column at 120 columns or wider, one column below that, drawing a grant's kind and rung only when the item carries them (`$CRATE/src/view/panes.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- wide` prints `test result: ok` and names `detail_draws_as_a_right_column_at_120`.
- [ ] T012 Add the `list` rows to `keys.rs` - Up, Down, PgUp and PgDn on every data pane, and Enter on the inbox only - and the reducer arms that move `Option<ItemId>` and fall to the nearest surviving row (`$CRATE/src/keys.rs`, `$CRATE/src/state.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --lib keys` prints `test result: ok` and names `list_keys_move_the_selection`.
- [ ] T013 Declare `mod panes;` in the view root and route the body to the active pane (`$CRATE/src/view/mod.rs`). Verify: `cargo build --manifest-path $CRATE/Cargo.toml` exits 0 and `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` prints `test result: ok`.
- [ ] T014 Write the snapshot table: one row per pane and state naming the fixture payload, the expected first body line and the expected marker, drawn at 80x24 and 120x40, asserting the `TestBackend` buffer directly (`$CRATE/tests/panes.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- snapshot` prints `test result: ok` and the test names 32 cases, sixteen per size.
- [ ] T015 Write the reorder test: two polls with the rows reversed keep the selection on the same item id, and a selection whose item leaves the payload falls to the nearest surviving row (`$CRATE/tests/panes.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- reorder` prints `test result: ok` and names `selection_survives_reorder`.
- [ ] T016 Write the 2,000-row budget test: 2,000 activity rows at 120x40 draw in under 16 ms, measured around the draw call after one warm-up (`$CRATE/tests/panes.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- budget` prints `test result: ok` and names `two_thousand_rows_draw_under_16ms`.
- [ ] T017 Write the sanitizer test at the pane boundary: a bot id carrying `\u{1b}[2J` draws as `?[2J` with no control byte in the buffer (`$CRATE/tests/panes.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- sanitize` prints `test result: ok` and names `control_characters_never_reach_the_buffer`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Run the formatter check (`$CRATE`). Verify: `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0.
- [ ] T019 Run the linter with warnings denied (`$CRATE`). Verify: `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] T020 Run the crate suite (`$CRATE`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target and no `FAILED`.
- [ ] T021 Prove no openhuman code was copied and no snapshot crate was added (`$CRATE`). Verify: `rg -n 'openhuman' $CRATE/src` prints only comment lines, `rg -c 'GNU GENERAL PUBLIC LICENSE' $CRATE/src $CRATE/Cargo.toml $CRATE/Cargo.lock` prints nothing, and `rg -n 'insta' $CRATE/Cargo.toml` prints nothing.
- [ ] T022 Validate the packet (`specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:waves -->
## Waves

Seven waves. Each row names the lane, its tasks, the executor with its model and effort, the files the lane holds, and the rung the wave falls to when its executor runs out of usage. The roster, the effort levers, the parallelism rule and the fallback ladder are `plan.md`'s "External orchestration" section; this table applies them.

A lane is the unit of parallelism and two lanes never hold the same file, so the worker count is the number of lanes with disjoint file sets. `$CRATE/src/view/panes.rs` binds eight tasks and `$CRATE/tests/panes.rs` binds four, which is why most waves are one lane wide.

### Wave 1 - Setup probes

| Lane | Tasks | Executor, model, effort | Files held | Fallback |
|------|-------|-------------------------|------------|----------|
| A | T001 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | none; one build probe | rung 2, then 3 |
| B | T002 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | none; one fixture probe | rung 2, then 3 |
| C | T003 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | none; three read-only greps | rung 2, then 3 |

**Workers:** 3, because no lane writes a file. **Verify:** `cargo build --manifest-path $CRATE/Cargo.toml` exits 0; `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` prints `test result: ok`; the three `jq -e` probes on the fixture exit 0; the three `rg` probes on the design sources print their lines.

### Wave 2 - The clip and the marker seam

| Lane | Tasks | Executor, model, effort | Files held | Fallback |
|------|-------|-------------------------|------------|----------|
| A | T004, T005 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max` | `$CRATE/src/view/panes.rs` | rung 2, then 3 |

**Workers:** 1, serial inside the lane because both tasks edit `$CRATE/src/view/panes.rs`. T005 fixes the marker seam every later task draws through, so the lane takes `max`. **Verify:** `cargo test --manifest-path $CRATE/Cargo.toml --lib panes` prints `test result: ok` and names `clips_by_display_width`; `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- markers` prints `test result: ok` and names `panes_draw_the_ascii_markers`.

### Wave 3 - The four pane bodies

| Lane | Tasks | Executor, model, effort | Files held | Fallback |
|------|-------|-------------------------|------------|----------|
| A | T006, T007, T008, T009 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max` | `$CRATE/src/view/panes.rs` | rung 2, then 3 |

**Workers:** 1, serial inside the lane because all four tasks edit `$CRATE/src/view/panes.rs`. **Verify:** `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- activity`, `-- inbox`, `-- routines` and `-- chat` each print `test result: ok`, and the four named tests appear.

### Wave 4 - State lines, wide layout, the list keys and the wiring

| Lane | Tasks | Executor, model, effort | Files held | Fallback |
|------|-------|-------------------------|------------|----------|
| A | T010, T011, T012 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking max` | `$CRATE/src/view/panes.rs`, `$CRATE/src/keys.rs`, `$CRATE/src/state.rs` | rung 2, then 3 |
| B | T013 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `$CRATE/src/view/mod.rs` | rung 2 at `max`, then 3 |

**Workers:** 2, because lane B holds the view root and lane A holds the pane module, the key rows and the reducer arms. Lane B runs after wave 3, because the body it routes must exist. **Verify:** `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- states` and `-- wide` each print `test result: ok`; `cargo test --manifest-path $CRATE/Cargo.toml --lib keys` prints `test result: ok` and names `list_keys_move_the_selection`; `cargo build --manifest-path $CRATE/Cargo.toml` exits 0; `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` prints `test result: ok`.

### Wave 5 - The snapshot table

| Lane | Tasks | Executor, model, effort | Files held | Fallback |
|------|-------|-------------------------|------------|----------|
| A | T014 | `cli-pi` · `llmgateway/deepseek-v4.1-flash-1017` · `--thinking high` | `$CRATE/tests/panes.rs` | rung 2 at `max`, then 3 |

**Workers:** 1. The table is mechanical once the bodies exist, so it takes `high`. **Verify:** `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- snapshot` prints `test result: ok` and the test names 32 cases, one per pane per state at each size.

### Wave 6 - The reorder, budget and sanitizer tests

| Lane | Tasks | Executor, model, effort | Files held | Fallback |
|------|-------|-------------------------|------------|----------|
| A | T015, T016, T017 | `cli-codex` · `gpt-6-luna` · `-c model_reasoning_effort="xhigh" -c service_tier="fast"` | `$CRATE/tests/panes.rs` | rung 1 at `max` as a deliberate re-tier, then stop and report |

**Workers:** 1, serial inside the lane because all three tasks edit `$CRATE/tests/panes.rs`. This is the packet's hardest wave: a timing assertion that passes for the wrong reason and a reorder test that asserts the wrong thing both go green while proving nothing, so it takes the highest tier the roster offers. `cli-codex` is the last rung, so a spent codex re-tiers to `cli-pi` at `max` rather than dropping the tier, and a spent `cli-pi` stops the wave. **Verify:** `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- reorder`, `-- budget` and `-- sanitize` each print `test result: ok`, and the three named tests appear.

### Wave 7 - Verification gates

| Lane | Tasks | Executor, model, effort | Files held | Fallback |
|------|-------|-------------------------|------------|----------|
| Orchestrator | T018, T019, T020, T021, T022 | none, because the orchestrator runs them itself | none | none, because a failing gate is repaired before the wave is called done |

**Workers:** 0. **Verify:** `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0; `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0; `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target; `rg -n 'openhuman' $CRATE/src` prints only comment lines; `rg -n 'insta' $CRATE/Cargo.toml` prints nothing; `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:waves -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `cargo test --manifest-path $CRATE/Cargo.toml --test panes` prints `test result: ok`, including the 32 snapshots and the 2,000-row budget
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, whose "External orchestration" section owns the roster, the effort levers, the parallelism rule and the fallback ladder
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`, bound by `../goal.md`'s row for `004-panes`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `cargo build --manifest-path $CRATE/Cargo.toml` exits 0 before the first pane task starts.
- [ ] CHK-002 [P0] `bash $CRATE/tests/fixtures/bots activity --json | jq -e '.groups'` exits 0, so the activity pane has a payload.
- [ ] CHK-003 [P1] `rg -n 'Remote' $CRATE/src/state.rs` prints the wrapper the panes draw from.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] CHK-011 [P0] `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0.
- [ ] CHK-012 [P1] `rg -n 'unwrap\(\)|expect\(' $CRATE/src/view/panes.rs` matches only lines inside `#[cfg(test)]` blocks.
- [ ] CHK-013 [P1] `rg -n 'Command::new' $CRATE/src` matches only `cli.rs`, so no pane spawns a process.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] `cargo test --manifest-path $CRATE/Cargo.toml --test panes` prints `test result: ok` and names one snapshot per pane per state at both sizes.
- [ ] CHK-021 [P0] `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- budget` prints `test result: ok` and names `two_thousand_rows_draw_under_16ms`.
- [ ] CHK-022 [P1] `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- reorder` prints `test result: ok` and names `selection_survives_reorder`.
- [ ] CHK-023 [P1] `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- sanitize` prints `test result: ok` and names `control_characters_never_reach_the_buffer`.
- [ ] CHK-024 [P1] `rg -n 'insta' $CRATE/Cargo.toml $CRATE/tests` prints nothing, so every snapshot asserts the buffer directly.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] `rg -n 'env::var' $CRATE/src/view/panes.rs` matches nothing, so no pane reads an environment variable of its own.
- [ ] CHK-031 [P0] `rg -n 'read_to_string|File::open|fs::read' $CRATE/src/view/panes.rs` matches nothing, so no pane opens a state file.
- [ ] CHK-032 [P1] `test ! -e $CRATE/src/sanitize.rs` exits 0, so the crate holds one sanitizer and it is `theme.rs`'s.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `rg -n 'panes' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes/spec.md specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes/plan.md` names the module in both.
- [ ] CHK-041 [P1] `rg -n 'openhuman' $CRATE/src/view/panes.rs` prints only comment lines that name the design reference.
- [ ] CHK-042 [P2] `rg -n 'stale_label' $CRATE/src/view/panes.rs` prints the stale state's one call, so the age format has one owner.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] `git status --porcelain $CRATE` lists only `src/view/panes.rs`, `src/view/mod.rs`, `src/keys.rs`, `src/state.rs` and `tests/panes.rs` as this child's changes.
- [ ] CHK-051 [P1] `git check-ignore -v $CRATE/target/release/bots-ui` prints the `/crates/bots-tui/target/` line.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---
