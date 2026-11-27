---
title: "Goal: Phase 5: answer-flow"
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
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow"
    last_updated_at: "2026-11-25T21:21:04Z"
    last_updated_by: "review-fix-pass"
    recent_action: "Applied the first review: deny first, the t row, the grant row and the re-baselined T001"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w4-005-answer-flow"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: answer-flow

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Deliver the answer surface of `bots ui`: one overlay that answers a needs-you item from the terminal, records the scope the operator chose, and writes nothing when the operator closes it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The banner lives in `crates/bots-tui/src/view/banner.rs`, created by 004-panes, and draws its key label from `keys.rs` rather than hard-coding one. The row sits in the frames that hold an open item, so 004's snapshot gate cannot go green while the file belongs to this phase, and 004's gate is this phase's Definition of Ready. |
| D2 | The overlay captures the item id, never the row index, so a refresh that reorders rows cannot retarget an answer. |
| D3 | The in-flight lock is reducer state, not a flag on the view, so a second press produces no `Answer` effect and a test asserts that with no process involved. |
| D4 | The typing mode is the `Typing` phase, and `keys.rs` reads it as the overlay's mode, so one phase pauses every single-key binding at once and no binding can be forgotten. |
| D5 | The fixture's refusal is one scenario name, `--fixture-scenario refuse-answer-not-approver`, rather than a second script, so the refusal path and the success path share one argv log. The name follows 002's `refuse-<reason>` shape. |
| D6 | The hand check is the final operator acceptance step after 006, not a completion criterion, because a criterion that needs a tty cannot decide closure in this environment. |
| D7 | The overlay opens in shortcut mode and a drawn `t` row enters text mode, so `y` and `n` are shortcuts only outside text mode and a typed line may begin with either. |
| D8 | The overlay draws a grant's kind and rung only when the item carries them and draws no grant row otherwise, so the frame builds before packet phase 006 and lights up after it. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `argv_is_exactly_answer_id_text_scope`, and the argv it recorded for a deny is exactly `answer --scope deny --repo <repo> -- <item-id> deny`.
- [ ] The same suite names `esc_closes_overlay_and_writes_nothing`, `closed_input_writes_nothing`, `ctrl_c_closes_overlay_and_writes_nothing`, `unbound_key_writes_nothing` and `second_press_writes_nothing`, each of which asserts the fixture recorded no `answer` argv.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib overlay` prints `test result: ok` and names `grant_row_draws_only_when_present`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` names `free_text_answer_writes_typed_line`, `typing_pauses_single_key_shortcuts` and `text_mode_accepts_a_leading_y`, and the argv it recorded for the typed line `hold` is exactly `answer --scope once --repo <repo> -- <item-id> hold`.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` names `refusal_shows_stderr_and_keeps_item`, and the status row carries `bots: answer-not-approver` while the overlay and the item both stay open.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` names `gone_class_refusal_moves_to_gone`, and the overlay is gone while the status row carries the line.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib state` prints `test result: ok` and names `outcome_word_stays_until_the_next_poll`, and a successful answer issues no read of its own.
- [ ] `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0 and `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow --strict` prints `RESULT: PASSED`.
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
| Child spec authored | Done | `spec.md` carries fourteen requirements, REQ-022 the paste rule added later, four of them inherited from the parent with their ids and wording |
| Child plan authored | Done | `plan.md` carries five waves and the fallback ladder in its External orchestration section |
| Child tasks authored | Done | `tasks.md` carries sixteen tasks, each with a `Verify:` clause, grouped into five waves |
| Acceptance criteria authored | Done | `acceptance-criteria.md` carries nineteen rows, each verified by a command that needs no tty |
| Goal authored | Done | This file, from the phase-child template |
| First review applied | Done | `spec.md` REQ-010 and REQ-013 draw `n deny` before `y approve once` and bind `1-9` to options. REQ-014 adds the `t` row. REQ-019 draws the grant row only when present. T001 is re-baselined on packet phase 001 |
| Overlay drawn | Pending | No `crates/bots-tui/src/view/overlay.rs` exists yet |
| Answer suite passing | Pending | No `crates/bots-tui/tests/answer_flow.rs` exists yet |

### Deviations and findings

| Item | Note |
|------|------|
| The banner moved to 004 | The parent's Files to Change gave `view/banner.rs` to this child, and the frames that hold an open item draw the row, so 004's snapshot gate could not go green before this phase started. D1 moves the file to 004 as its REQ-027, and this phase keeps only the overlay. |
| The parent's defect table gives the banner's key fix to 003 | 003 owns the label in `keys.rs` and 004 owns the row that draws it, so the fix and the row do not collide. |
| The parent's REQ-008 and REQ-009 are not inherited | The parent's inherited table carries REQ-002, REQ-003, REQ-004, REQ-006, REQ-010 and REQ-011 only, so this child's new requirements start at REQ-012. REQ-012 records the banner's move to 004 and the overlay takes REQ-013. |
| The hand check is not a criterion | It needs a tty by design, so it is the final operator acceptance step after 006 and not a task here. Every acceptance criterion runs without one. |
| The parent's decisions bind and are not restated | The parent goal's D1 to D7 hold here. This file's D1 to D8 are local to the answer surface. |
| The refusal codes belong to other phases | `item-answered-differently` is 006's and `answer-not-approver` is 011's. This child displays whichever line the verb writes and names neither in a requirement. |
| The `t` row is this child's, its key-map row is 001's | 003's REQ-012 gives the `Overlay` context to this child, so the `keys.rs` row is written here. 001's key map gains the matching row, and the label is drawn from `keys.rs` so the two cannot disagree. |
| The sanitizer is 003's, not this child's | The typed line passes through the one sanitizer 003 owns in `theme.rs`, so this child keeps no second strip and CHK-032 greps for the call rather than for a local copy. |
| The view root is `src/view/mod.rs` | 003 creates it and this child adds one `mod` line per view module, so the crate keeps one view root. Both view tasks therefore share one lane in wave 3. |
| The fixture, `cli.rs`, `model.rs` and `app.rs` are 002's | The owner map settles the double claims, so this child extends only `state.rs`, `keys.rs` and `view/mod.rs`, and creates the two view files and the two test files. |
| D4, D5 and D6 are amended | D4 names the `Typing` phase, D5 names the `--fixture-scenario refuse-answer-not-approver` argument and D6 moves the hand proof to the final operator acceptance step after 006. |
| The outcome word has a requirement | REQ-020 carries the word the reference sweep adopts, so it stays drawn until the next successful inbox read and the screen issues no read of its own. |
| The banner moved to 004 | F-005, first alternative taken: `view/banner.rs` and its `mod` line are 004's as its REQ-027, and this child keeps only the overlay. REQ-012 records the move and AC-011 proves no document here claims the row. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The runtime decides the scope from the text | F-014: section 4.1 now says a text in the NO set records `deny` even when `--scope once` is given, and on a claimed review item `reject` forces `deny` while `confirm` forces `once`. REQ-021 and AC-020 carry it, and `review_reject_records_deny` proves a `["confirm","reject"]` item. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The refusal scenario names its reason | F-048: D5 and `plan.md` section 5 name `--fixture-scenario refuse-answer-not-approver`, AC-014 names `refuse-item-answered-differently` and `item_busy_refusal_keeps_the_overlay` proves the retryable case. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The refusal table lists the later reasons | O-016, first alternative taken: section 4.2 gained one row each for `item-busy`, `review-answer-invalid`, `memory-full`, `memory-secret`, `proposal-stale` and `secret-store-unreadable`, each with its retry class. The second alternative, rewording `refusals.md` section 1, was not needed. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| Enter opens only an open item | F-070: REQ-013 now says Enter opens the overlay only on an item whose `state` is `open`, because an expired item and an item in any other state carry no answer key. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The prose rules were applied | O-021 and O-022: every semicolon outside code was split into two sentences and every serial comma before a final `and` was dropped, across this child's documents. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
<!-- /ANCHOR:log -->
