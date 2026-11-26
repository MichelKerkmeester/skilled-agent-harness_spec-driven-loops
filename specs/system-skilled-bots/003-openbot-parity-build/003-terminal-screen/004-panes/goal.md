---
title: "Goal: Phase 4: panes"
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
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes"
    last_updated_at: "2026-11-25T21:58:29Z"
    last_updated_by: "review-fix-pass-2"
    recent_action: "Applied the second review findings that edit this child"
    next_safe_action: "Execute against the completion criteria, starting with wave 1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w4-004-panes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: panes

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fill the body 003 leaves empty with the activity, inbox, routines and chat-placeholder panes, each drawing every state of its surface from the JSON the runtime already prints, and never draw a byte the runtime did not mean as text.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The panes draw and never fetch. `data.rs` fetches, `state.rs` folds, `view/panes.rs` writes cells, so a pane test needs no thread, no process and no terminal. |
| D2 | The glyph table lives in 003's `theme.rs`, which carries the Unicode and ASCII columns and the `--ascii` flag. This child calls `marker(state, glyphs)` and keeps no second table, so the eight glyphs have one owner and one test. |
| D3 | `stale_label` lives in 003's `view/header.rs` and the header draws it. This child's stale state calls it, so the age format has one owner and one test rather than two. |
| D4 | The ASCII glyph set is 003's, selected by the `--ascii` flag the `ui` verb passes. This child proves the pane draws the ASCII column and reads no environment variable. |
| D5 | The 2,000-row check is a count: the draw returns the rows it visited and the test asserts at most the body height. The 16 ms timing is an ignored test the operator runs locally, so a loaded runner cannot fail the gate. |
| D6 | The view root is `crates/bots-tui/src/view/mod.rs`, which 003 creates. This child adds one `mod panes;` line to it and no second root. |
| D7 | The sanitizer is 003's `theme.rs`, one behaviour that replaces each control character with `?`. This child routes every drawn string through it and keeps no second copy. |
| D8 | The `list` rows live in 003's `keys.rs` and the movement arms in 002's `state.rs`. This child adds both, so a key cannot be bound without a label and the selection moves by each pane's row key rather than by row index. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes` prints `test result: ok` and names one buffer snapshot per pane per state at 80x24 and at 120x40, sixteen per size.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes -- budget` prints `test result: ok` and names `two_thousand_rows_visit_at_most_the_body_height`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes -- reorder` prints `test result: ok` and names `selection_survives_reorder`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes -- sanitize` prints `test result: ok` and names `control_characters_never_reach_the_buffer`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes -- markers` prints `test result: ok` and names `panes_draw_the_ascii_markers`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib keys` prints `test result: ok` and names `list_keys_move_the_selection`.
- [ ] `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0 and `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes --strict` prints `RESULT: PASSED`.
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
| Packet authored | Done | `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` carry no unfilled token, and `validate.sh --strict` prints `RESULT: PASSED` |
| Waves planned | Done | `tasks.md` names seven waves, each with its executor, model, effort, worker count, verify step and fallback rung |
| First review applied | Done | `research/ui-review-1.md` U1-P1-2, U1-P1-3, U1-P1-8, U1-P1-10, U1-P2-1 and U1-P2-6 are applied: the glyph table and the sanitizer are 003's, the view root is `src/view/mod.rs`, the selection falls to the nearest row, and the snapshot table matches the inventory's five states per pane |
| Second review applied | Done | `research/ui-review-2.md` N-P0-1, N-P1-5, N-P1-10, N-P2-18 and the 002 items of N-P2-22 are applied: the `list` rows and the movement arms are this child's, REQ-026 and AC-015 name the keys each pane binds, and the licence grep is narrowed to the code and the manifest |
| Integration wave applied | Done | `design/architecture.md` section 6.4, `design/state-machines.md` section 6.6, `design/contracts.md` section 12 and `research/context-manifest.md` section 5 applied: each pane selects by its row key, `on_list_action`, `reconcile_selection` and `clamp_scroll` are named, `SHELL_ROWS` replaces the old key rows, the routines payload is an object with a `routines` array, and the design sources name how they are rebuilt. R8 makes every snapshot compare the buffer to its frame cell for cell, R12's clean-room rule is in `plan.md`, and R15 replaces the wall-clock gate with a row count |
| Pane bodies written | Pending | No `crates/bots-tui/src/view/panes.rs` exists |
| Snapshot table written | Pending | No `crates/bots-tui/tests/panes.rs` exists |
| Row count proven | Pending | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes -- budget` cannot run until the crate exists |

### Deviations and findings

| Item | Note |
|------|------|
| The view root is another child's file | The parent's file map names no view root, so the `mod panes;` line lands in `src/view/mod.rs`, which 003 creates. The change is one line in a file another child owns, and `cargo build` is the check. |
| The selection fix straddles two children | The parent's defect table assigns the selection fix to this child while the parent's file map gives `state.rs` to 002. The second review settled it: this child edits `state.rs` for the movement arms and `keys.rs` for the `list` rows, and the reorder test is the gate, so a state that selects by row index cannot pass. |
| The pane footers follow the operator's ruling | The second review's N-P1-2 and N-P1-5 disagreed about the inbox footer. The ruling wins: Activity and Routines draw `↑↓ select · PgUp/PgDn page`, the inbox adds `Enter open`, Chat draws no list key, and the answer keys appear only in the overlay footers. |
| The glyph table and the sanitizer are 003's | The first review assigns both to 003's `theme.rs`, so this child calls them and keeps no second copy. |
| The snapshot count follows the inventory | The first review found the table asserting states with no frame. 001 added the loading, stale and error frames for inbox and routines, so the table holds sixteen snapshots per size and thirty-two in all, auditable against `001-ux-and-component-map/design/mockups.md`. |
| The parent goal's binding rows resolve | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen` reports 0 findings, so the parent's binding rows resolve. |
| The legacy documents that move here | The legacy task is T014, the four pane bodies with the chat line naming phase 010. The legacy T008, the six markers over the seven group ids, moves to 003 with the glyph table. The legacy criteria are AC-005 for the activity markers, AC-007 for the routines row, AC-012 for the error that keeps its rows and AC-014 for the unknown state with its raw value. Each keeps its intent and takes a new id here. AC-005's `?` for scheduled and recurring becomes `○` and `↻`, which is the change operator decision Q005 approved. |
| The inbox pane reads the fixture first | `bots inbox --json` does not exist until phase 001 lands it, so the inbox pane and its empty line are proven against `tests/fixtures/bots` until then. |
| The banner is this child's | F-005, first alternative taken: `view/banner.rs`, its `mod banner;` line and the banner slot call moved here as REQ-027 and AC-019, so the snapshot gate goes green without 005. The second alternative, masking the banner row in the comparison, was not needed. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| `mod panes;` lands in wave 2 | F-047: T004 declares `mod panes;` and T005 opens `tests/panes.rs`, so waves 2 to 4 hold both files and every wave's verify finds its target. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| An unknown state draws like an expired one | F-070: REQ-017 now says an item whose `state` is neither `open` nor `expired` draws dimmed with its raw state word and no answer key, and AC-020 proves it. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The activity row check reads `schedule` | O-014: T002 adds `has("schedule")` to the seven row keys it checks. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The prose rules were applied | O-021 and O-022: every semicolon outside code was split into two sentences and every serial comma before a final `and` was dropped, across this child's documents. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
<!-- /ANCHOR:log -->
