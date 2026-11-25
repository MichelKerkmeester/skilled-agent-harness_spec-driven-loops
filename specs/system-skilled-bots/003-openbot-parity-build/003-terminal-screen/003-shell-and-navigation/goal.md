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
| D3 | `theme::safe_text` is the one control-character filter, because the status row draws stderr before 004's `sanitize.rs` exists, and 004 applies the same function to the pane strings. |
| D4 | The shell snapshots compare the `TestBackend` buffer to an expected block held in the test file, so a change to the shell shows as a diff of drawn cells and no snapshot file hides them. |
| D5 | `view/mod.rs` is the shell's module root and the file 004 and 005 add their `mod` lines to, so it is a binding file like `lib.rs` and no two lanes hold it at once. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` prints `test result: ok` and names `every_bound_label_is_drawn`, `shell_snapshot_80x24` and `shell_snapshot_120x40`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib keys` prints `test result: ok` and names `alt_2_selects_inbox`, `bracket_right_cycles_forward`, `ctrl_p_opens_palette`, `ctrl_d_quits` and `ctrl_c_quits_and_emits_no_answer`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib theme` prints `test result: ok` and names `no_color_selects_mono`, `mono_draws_the_same_symbols`, `ascii_glyphs_are_ascii` and `every_marker_has_an_ascii_counterpart`.
- [ ] `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0 and `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] `rg -n 'env::var' crates/bots-tui/src` prints only `theme.rs`, and `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines.
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

### Deviations and findings

| Item | Note |
|------|------|
| `view/mod.rs` is named here and not in the parent's file table | The parent lists the view's children - `header.rs`, `tabs.rs`, `footer.rs`, `panes.rs`, `overlay.rs` - and a directory module needs a root. The shell frame lives there, so this child names it rather than leaving the frame homeless. |
| The legacy "no environment variable" rule is narrowed | The pre-expansion checklist said the binary reads no environment variable at all, and the approved Mono-under-`NO_COLOR` decision requires one. The rule is now one variable, `NO_COLOR`, read in `theme.rs` alone. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/context/legacy-003/tasks.md:165] |
| The status row cannot wait for 004's `sanitize.rs` | The status row draws stderr, which is runtime text, so the control-character rule lands in `theme::safe_text` here and 004 applies it to the pane strings. |
| The glyph table is defined here and drawn by 004 | The approved markers and their ASCII fallback are one table, and the shell draws three of them - the stale flag, the banner's `!` and the focus mark - so the table lands with the shell rather than with the panes. |
| The hand proof is not a criterion | Every criterion above runs without a tty. The frame is drawn into a `TestBackend` buffer and the clock is a field the test sets, so no criterion waits on a keystroke. |
<!-- /ANCHOR:log -->
