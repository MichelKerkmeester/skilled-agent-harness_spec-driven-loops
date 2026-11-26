---
title: "Goal: Phase 3: shell-and-navigation"
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
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/003-shell-and-navigation"
    last_updated_at: "2026-11-25T22:10:00Z"
    last_updated_by: "spec-authoring"
    recent_action: "Authored the durable directive and its six completion criteria"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w4-003-shell-and-navigation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: shell-and-navigation

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Deliver the shell of `bots-ui` - one key table that binds and labels every key, a header, a tab bar, a footer and a status row generated from that table, a palette that is also help, the too-small screen and the Mono palette - so every binding is drawn on screen and the tab bar is reachable on a keyboard that never delivers Alt.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The palette lives in `view/mod.rs`, because `view/overlay.rs` belongs to 005 and the palette is the shell's own panel rather than a decision or choice overlay. |
| D2 | `theme.rs` holds the one glyph table, with a Unicode and an ASCII column, and 004's panes read it rather than keeping a second copy, so the approved markers and their fallback are defined once. |
| D3 | `theme::printable` is the one control-character filter, replacing each control character with `?`, because the status row draws stderr before 004's panes exist, and 004's panes call it directly rather than stripping them a second way. The crate holds no `sanitize.rs`. |
| D4 | The shell snapshots compare the shell bands of the `TestBackend` buffer to an expected block held in the test file, so a change to the shell shows as a diff of drawn cells and no snapshot file hides them. The body rows are skipped, because 004 fills them. |
| D5 | `view/mod.rs` is the shell's module root and the file 004 and 005 add their `mod` lines to, so it is a binding file and no two lanes hold it at once. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` prints `test result: ok` and names `every_bound_label_is_drawn`, `shell_snapshot_80x24` and `shell_snapshot_120x40`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib keys` prints `test result: ok` and names `alt_2_selects_inbox`, `bracket_right_cycles_forward`, `ctrl_p_opens_palette`, `ctrl_d_quits` and `ctrl_c_quits_and_emits_no_answer`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib theme` prints `test result: ok` and names `mono_resets_every_colour`, `mono_draws_the_same_symbols`, `ascii_glyphs_are_ascii`, `every_marker_has_an_ascii_counterpart` and `marker_draws_one_glyph_per_state`.
- [ ] `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0 and `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] `rg -n 'env::var' crates/bots-tui/src` matches nothing outside `#[cfg(test)]` blocks, and `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/003-shell-and-navigation --strict` prints `RESULT: PASSED`.
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
| Packet authored | Done | `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` carry no unfilled token |
| Key table | Pending | `ls crates/bots-tui/src/keys.rs` exits 1 |
| Theme and glyph table | Pending | `ls crates/bots-tui/src/theme.rs` exits 1 |
| Shell frame | Pending | `ls crates/bots-tui/src/view` exits 1 |
| Key-label test and snapshots | Pending | `ls crates/bots-tui/tests/render_keys.rs` exits 1 |
| Review 1 fixes applied | Done | U1-P0-1, U1-P0-2, U1-P1-3, U1-P1-9, U1-P1-10 and U1-P1-11 applied here. The rest of `research/ui-review-1.md` belongs to 001, 002, 004, 005, 006 and the parent |
| Review 2 fixes applied | Done | N-P1-1, N-P1-2, N-P1-3, N-P1-4, N-P1-11, N-P1-14, N-P1-16 and N-P2-19 applied here, with the footer ruling. The rest of `research/ui-review-2.md` belongs to 001, 002, 004, 005, 006 and the parent |
| Integration wave applied | Done | `design/architecture.md` section 6.3, `design/state-machines.md` section 6.6 and `design/contracts.md` section 12.5 applied: `SHELL_ROWS` replaces the created table, `theme.rs` and `view/mod.rs` are 002's stubs, `state.rs` gains `on_shell_action`, the `lib.rs` row and T012 are gone because 002 owns the flags, the header reads `updatedAt`, and the palette's Enter, Esc and Ctrl+C rule is REQ-015's. R12's clean-room rule is in `plan.md` |

### Deviations and findings

| Item | Note |
|------|------|
| `view/mod.rs` is named here and not in the parent's file table | The parent lists the view's children - `header.rs`, `tabs.rs`, `footer.rs`, `panes.rs`, `overlay.rs` - and a directory module needs a root. The shell frame lives there, so this child names it rather than leaving the frame homeless. |
| The legacy "no environment variable" rule holds | The pre-expansion checklist said the binary reads no environment variable at all, and the approved Mono decision keeps it that way: the `ui` verb reads `NO_COLOR` and passes `--mono`, and passes `--ascii` when asked, so `theme.rs` reads no environment variable and the check is `rg -n 'env::var' crates/bots-tui/src` matching nothing outside `#[cfg(test)]` blocks. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/decision-record.md:48] |
| The status row cannot wait for 004's panes | The status row draws stderr, which is runtime text, so the control-character rule lands in `theme::printable` here, replacing each control character with `?`, and 004's panes call it directly. The crate holds no `sanitize.rs`. |
| The too-small line is our own wording | The reference's own resize line is its text, so this screen draws `Too small · Ctrl+D exit`, which reuses the key map's `Ctrl+D exit` label and fits whole at 23 columns. 001's mockups carry the reference's string and are amended to this wording by 001's own fix pass. |
| The glyph table is defined here and drawn by 004 | The approved markers and their ASCII fallback are one table, and the shell draws three of them - the stale flag, the banner's `!` and the focus mark - so the table lands with the shell rather than with the panes. 004's panes read it rather than keeping a second copy. |
| `stale_label` is 003's, not 004's | The header draws the age, so the formatter lives in `view/header.rs` and 004's panes call it. 004 cannot edit `header.rs`, so a formatter it owned would leave the header's own test waiting on another child. |
| The chat line is 004's | The tab bar draws the tab and its active mark. The one line naming phase 010 is a body line, drawn into the body slot 004 owns. |
| R8's frame loader does not reach the shell snapshots | No approved frame draws an empty body, because every frame in `design/mockups.md` fills the body with a pane. The two shell snapshots therefore keep the expected block in the test file, as D4 says, and compare only the shell bands, skipping the body rows 004 fills. 002's `tests/common/frames.rs` loader serves 004's pane snapshots and 005's end-to-end frame |
| The hand proof is not a criterion | Every criterion above runs without a tty. The frame is drawn into a `TestBackend` buffer and the clock is a field the test sets, so no criterion waits on a keystroke. |
| The shell snapshots skip the body rows | F-006, first alternative taken: `shell_snapshot_80x24` and `shell_snapshot_120x40` compare only the shell bands and skip the body rows 004 fills, and AC-013 no longer asks for an empty body row. The second alternative, a named modify right for 004 on the three tests, was not needed. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| `marker` is named here | F-047: T005 writes `marker(state, ascii)` and its test `marker_draws_one_glyph_per_state` asserts one glyph and one ASCII character per row state, so 004 calls a function this phase owns and tests. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The palette Enter rule is defined | F-070: REQ-015 now says a label that covers several rows contributes one row and Enter runs the action of the first row in `keys::rows()` order that carries it, so Enter is never undefined. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The prose rules were applied | O-021 and O-022: every semicolon outside code was split into two sentences and every serial comma before a final `and` was dropped, across this child's documents. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
<!-- /ANCHOR:log -->
