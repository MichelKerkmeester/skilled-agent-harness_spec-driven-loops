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
    last_updated_at: "2026-11-25T22:10:00Z"
    last_updated_by: "child-goal-authoring"
    recent_action: "Authored the phase-child directive and its seven completion criteria"
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
| D2 | The glyph table lives in `view/panes.rs`, not a module of its own, because the parent's file map gives this child three files to create and a fourth module would be a file no phase names. |
| D3 | `stale_label` lives in `view/panes.rs` and 003's header calls it, so the age format has one owner and one test rather than two. |
| D4 | The ASCII glyph set is carried and proven here. The switch that selects it shares the `NO_COLOR` mechanism `theme.rs` owns, so this child adds no second capability probe and reads no environment variable. |
| D5 | The 2,000-row budget is one test that warms up once and measures the draw call alone, so a failure names the draw rather than the fixture parse. |
| D6 | The view root is `crates/bots-tui/src/view.rs`, which 003 creates. This child adds one `mod panes;` line to it and no second root. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes` prints `test result: ok` and names one buffer snapshot per pane per state at 80x24 and at 120x40.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes -- budget` prints `test result: ok` and names `two_thousand_rows_draw_under_16ms`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes -- reorder` prints `test result: ok` and names `selection_survives_reorder`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes -- sanitize` prints `test result: ok` and names `control_characters_never_reach_the_buffer`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib panes` prints `test result: ok` and names `markers_cover_eight_states_in_both_sets`.
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
| Sanitizer written | Pending | No `crates/bots-tui/src/sanitize.rs` exists; `ls crates/bots-tui` prints `No such file or directory` |
| Pane bodies written | Pending | No `crates/bots-tui/src/view/panes.rs` exists |
| Snapshot table written | Pending | No `crates/bots-tui/tests/panes.rs` exists |
| Frame budget proven | Pending | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes -- budget` cannot run until the crate exists |

### Deviations and findings

| Item | Note |
|------|------|
| The view root is another child's file | The parent's file map names three files for this child and no view root, so the `mod panes;` line lands in `src/view.rs`, which 003 creates. The change is one line in a file another child owns, and `cargo build` is the check. |
| The selection fix straddles two children | The parent's defect table assigns the selection fix to this child while the parent's file map gives `state.rs` to 002. The reorder test is the gate: a state that selects by row index cannot pass it, so the fix lands wherever the test forces it. |
| The ASCII set ships with no switch | The operator approved the set, and this child carries and proves it. The switch shares the `NO_COLOR` mechanism `theme.rs` owns, because the binary reads no environment variable of its own and a second capability probe would duplicate 003's. |
| The parent goal's binding rows name folders | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen` reports six `missing-binding-row` findings because each row names `NNN-slug/` rather than `NNN-slug/goal.md`. That is a parent-level finding outside this child's write scope, recorded here rather than fixed here. |
| The legacy documents that move here | The legacy task is T014, the four pane bodies with the chat line naming phase 010, and T008, the six markers over the seven group ids. The legacy criteria are AC-005 for the activity markers, AC-007 for the routines row, AC-012 for the error that keeps its rows and AC-014 for the unknown state with its raw value. Each keeps its intent and takes a new id here. AC-005's `?` for scheduled and recurring becomes `○` and `↻`, which is the change operator decision Q005 approved. |
| The inbox pane reads the fixture first | `bots inbox --json` does not exist until phase 001 lands it, so the inbox pane and its empty line are proven against `tests/fixtures/bots` until then. |
<!-- /ANCHOR:log -->
