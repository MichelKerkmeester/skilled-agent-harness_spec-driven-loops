---
title: "Goal: Phase 3: chat-pane-and-proof"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "chat pane goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/010-conversations/003-chat-pane-and-proof"
    last_updated_at: "2026-11-26T01:30:00Z"
    last_updated_by: "wo-08-writer"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo08-010-003-pane"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: chat-pane-and-proof

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Replace the chat placeholder in `bots ui` with the pane the design child drew, reading and sending through the two `bots chat` calls, and prove every one of its thirteen states cell for cell at 80x24 and 120x40.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase decides no layout, label, key or call. Each comes from `../001-chat-ux-and-pane-map/design/`, and a change there is an amendment to that child. |
| D2 | The send runs on a chat worker of its own with no deadline, and quit does not wait for it. |
| D3 | The crate files are phase 003's names, `state.rs` and `view/panes.rs`, never the `ui_state.rs` and `render/panes.rs` the pre-expansion phase named. |
| D4 | The approved frames are copied into the crate as `design/chat-mockups.md`, so the screen's frame loader reads them without reaching into a spec folder. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test chat frame_` prints `test result: ok. 26 passed`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target.
- [ ] `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0.
- [ ] After a line typed in the chat tab, `node .skilled/bin/bots.cjs chat my-bot --transcript --json | jq -r '.messages[-2].text'` prints it.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/010-conversations/003-chat-pane-and-proof --strict` prints `RESULT: PASSED`.
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
| Implementation | Blocked | `test -d crates/bots-tui` exited 1 on 2026-11-26, and the key map delta is not approved |

### Deviations and findings

| Item | Note |
|------|------|
| Moved from the phase parent | REQ-008, AC-008, SC-004 and the crate tasks T022 to T026, T032 and T038 came from the pre-expansion phase with their ids. The tasks were rewritten against phase 003's file names. |
<!-- /ANCHOR:log -->
