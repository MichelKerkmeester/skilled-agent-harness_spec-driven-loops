---
title: "Implementation Summary"
description: "A Claude receiver starts on the goal command rendered from goal.md with its claim delivered as start context, a Hermes receiver binds from HERMES_SPEC_FOLDER, and the Codex seed is deferred."
trigger_phrases:
  - "goal rebind claude codex implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/027-goal-rebind-claude-and-codex"
    last_updated_at: "2026-10-25T02:00:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Built the Claude start-prompt path and the Hermes export, proved three live hops, deferred Codex"
    next_safe_action: "Start phase 28: the live proof and docs across runtimes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-27-goal-rebind-claude-and-codex"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 027-goal-rebind-claude-and-codex |
| **Completed** | 2026-10-25, uncommitted on top of 28b0d197e8 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Claude receiver of a hop that carries a goal packet now starts with the goal set from `goal.md` and the hand-over note claimed, with no keystroke from the operator. A Hermes receiver binds the same packet from its environment. Codex gets nothing in this phase, and that is a decision, not a gap in the work.

### Phase 27: goal-rebind-claude-and-codex

**Claude design decision.** The start prompt becomes `/goal <slice>`, because probe A showed that form sets the goal interactively and under `-p`, and probe B showed a start hook cannot send it interactively. A start prompt is one prompt, so the claim seed the receiver used to get as that prompt moves to start context: `skilled-loop` exports it as `SKILLED_LOOP_CLAIM_SEED`, and the existing `SessionStart` entry for `claude/compact-pointer.mjs` delivers the claim instructions for the `startup` source, with the seed's note path, spec folder and Gate 3 answer, ahead of "any work on the goal". Reusing that entry means no new hook file, no registry row and no regenerated settings. The slice is rendered at launch by `lib/goal-handover.cjs`, which checks the packet path, runs `goal.cjs packet <packet> --workspace <root>`, and returns the `chat_slice` only at `packet_budget=ok`, within 4,000 characters, as plain text. When it refuses, the start prompt stays the claim seed, the variable is absent, and the wrapper prints one `warning: the goal was not set in the relaunched session: <reason>` line for a named packet. The off switch and a hop with no packet print nothing. The hook never acts in a dispatched child (`AI_SESSION_CHILD=1`), with the switch off, or in a runtime started from the loop session's shell, because the variable carries the `SKILLED_LOOP_` prefix the nested-run check strips. See ADR-001.

**Live proof of the Claude path.** `scratch/claude-live-a/`: a sender started on the 3,990-character slice, a note was prepared, and the real wrapper, killer, hook and CLI relaunched it in a private tmux server with a private runtime directory. The receiver's transcript shows `Goal set` with a 3,990-character condition, then a `SessionStart:startup` context carrying the claim, then the `claim` and `complete` commands. The note went claimed by the receiver and done, the marker file the note's remaining work asked for exists, and `history` shows handed-over, claimed, done. This is also the captured near-limit accept run that phase 24 asked for. Two controls: with `SESSION_RELAUNCH_GOAL=0` the receiver started on the claim seed, had no goal and still claimed and completed the note; with `goal.md` grown to 4,100 characters after the note named it, the receiver also had no goal and claimed through the seed.

**Codex outcome.** Deferred, not built (ADR-002). A hop relaunches the runtime it left, so a Codex receiver only follows a Codex sender, and a Codex sender never writes a `goal_packet`: its goal store, `goals_1.sqlite` `thread_goals`, keys a goal by thread with objective text and no packet, and it held 0 rows when read. Until a Codex goal reader can match a goal to a packet, the seed instruction would never run. AC-002 is waived and AC-007 pins the reason.

**Hermes.** While the switch is on and the consumed note carries a packet, `skilled-loop` exports it as `HERMES_SPEC_FOLDER` for that hop. A hop with no packet puts back the value the wrapper first saw, or removes the variable. No other runtime gets the variable.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/goal-handover.cjs` | Created | Render the `chat_slice` for a receiver, with the packet, budget, size, markup and control-character checks, each refusal one line |
| `.skilled/bin/skilled-loop` | Modified | Build the `/goal <slice>` start prompt for a Claude hop, export `SKILLED_LOOP_CLAIM_SEED`, print the one warning, export and restore `HERMES_SPEC_FOLDER` |
| `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs` | Modified | Deliver the claim for the `startup` source under the checks above |
| `.skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` | Created | 8 tests for the helper against the real goal command |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modified | 4 tests for the start claim |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | 7 wrapper tests, the stub's recorded environment and a budget manifest for the goal notes |
| `.skilled/hooks/session-relaunch/README.md`, `tests/README.md` | Modified | The Claude and Hermes paths, the variable, the Codex limit and the new tests |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md` | Modified or created | Closure records and ADR-001, ADR-002 |
| `scratch/` | Created | The harness, three live runs (extracts, notes, panes, logs) and the gate counts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The gate was baselined first, then the tests were written ahead of each piece of code, then the code. The live hops ran against a throwaway checkout holding copies of the real hooks, wrapper and CLI, because a goal sent to a receiver in this repository would have started real work. Each run used its own tmux socket and `XDG_RUNTIME_DIR`, so shared relaunch state was never armed. The operator-approved bypass flags were not needed: the user-level Claude setting already runs without permission prompts.

Deviations. The first live attempt was discarded: the harness ran `prepare` with this session's inherited `SKILLED_LOOP_HOPS=2`, so the killer declined at the hop cap. The harness now prepares under `SKILLED_LOOP_HOPS=0`. The note in each run was prepared by running the CLI from the harness rather than by the sender model following a nudge, so the proof covers the receiver and the wrapper, and the nudge-driven path stays the playbook's CL-1. The sandbox had the user-level Claude hooks, whose repo-relative commands do not exist there, so each start also carried their "could not resolve" drift lines. The commands that run the relaunch CLI are refused to a sub-agent by the repository's guard, so the harness script ran them, against its own sandbox note and runtime directory and never this session's.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The goal command is the start prompt, and the claim becomes start context | The only path that sets the goal without the model's choice, proven interactively. See ADR-001 |
| Extend the `SessionStart` entry that runs `compact-pointer.mjs` | The event is already registered for every source, so a new hook file and registry rows would add six mirrors to maintain for one branch |
| The claim variable carries the `SKILLED_LOOP_` prefix | The existing nested-run check then drops it for a runtime started from the loop session's shell |
| One warning line only when a named packet is refused | The off switch and a hop with no packet are the normal cases, and a line on every one would be noise. The line reaches the operator's terminal as the wrapper starts the receiver |
| Codex is deferred | No producer can hand a Codex receiver a packet. See ADR-002 |
| The operator's `HERMES_SPEC_FOLDER` is restored on a hop with no goal | Leaving the previous hop's packet in the environment would bind a goal that has ended |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline: `node --test --test-reporter=tap .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs`, loop variables set, unset and foreign | 814 of 814, exit 0 in each |
| Same gate from the final state | 833 of 833, exit 0 in each. Delta +19 tests, 0 failures |
| Pi vitest relaunch suite, goal hook suites (six files), `.opencode/plugins/tests/*.test.cjs`, before and after | 52 of 52, 187 of 187 and 551 of 551, exit 0 each time. The brief expected 183 for the goal suites; the same six files reported 187 before and after |
| New tests against `git archive HEAD` | Helper suite cannot load (module missing); 3 of 4 hook tests and 5 of 7 wrapper tests fail; the other 3 pass by design as guards |
| Mutations of the final code (drop the child check, the nested drop, the switch check, the per-hop unset, the Hermes restore) | Each fails exactly one test; the unmutated copy passes 59 of 59 and 131 of 131 |
| Live Claude hops | `claude-live-a` goal set (3,990 characters), note claimed and done; `claude-live-b-switch-off` and `claude-live-c-over-budget` no goal, note claimed and done through the seed |
| `run-all-drift-guards.sh`, `check-rule-copies.test.sh`, `shellcheck .skilled/bin/skilled-loop`, `verify_alignment_drift.py --fail-on-warn` over the hooks folder and `.skilled/bin`, `node --check`, `bash -n`, `validate_document.py` on both READMEs | Exit 0 with all 4 guards PASSED and 10 non-blocking warnings, none in a changed file; exit 0; exit 0; 0 findings; clean; valid |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` | `RESULT: PASSED`, Errors: 0, Warnings: 0, after `repair-derived.cjs --apply` |
| Cleanup | Each tmux server was killed (`tmux ls` shows none on the default or the private sockets) and no Claude or wrapper process of the runs remains. The sender and receiver project logs under `~/.claude/projects` were deleted after their extracts were taken, and the raw transcripts were deleted because they hold the operator's instruction files. The throwaway checkout sat in the session scratchpad. No relaunch record was left armed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. A Claude receiver gets its claim as start context, so the model chooses to act on it. It did in all three live hops, with one model (Sonnet 5.5) on Claude Code 2.1.310. A model that skipped the context would start on the goal with the note unclaimed, and the wrapper's existing warning would still name the open note.
2. The terminal warning for a refused slice is proven by a wrapper test and not by a pane capture: the Claude TUI redrew over it in the live run.
3. A Hermes child dispatched from the receiver inherits `HERMES_SPEC_FOLDER`, since the Hermes plugin has no child marker. Binding in Hermes was proven in phase 24, and no Hermes hop was run here.
4. Codex has no goal path until a Codex goal reader can name a packet (ADR-002).
5. The sender's note was prepared by the harness and not by a sender model, so the nudge-to-prepare step is not part of this proof.
<!-- /ANCHOR:limitations -->

---
