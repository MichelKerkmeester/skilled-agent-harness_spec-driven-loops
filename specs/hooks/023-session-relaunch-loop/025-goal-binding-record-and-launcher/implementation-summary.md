---
title: "Implementation Summary"
description: "The hand-over note records the sender goal packet, claim prints it, the launcher exports it to the receiver, and one switch turns the behavior off."
trigger_phrases:
  - "goal binding record launcher implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/025-goal-binding-record-and-launcher"
    last_updated_at: "2026-10-25T00:30:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Built the goal packet field, the claim print, the wrapper export and the switch"
    next_safe_action: "Phases 26 and 27 read the packet and bind the goal in each runtime"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-25-goal-binding-record-and-launcher"
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
| **Spec Folder** | 025-goal-binding-record-and-launcher |
| **Completed** | 2026-10-25, uncommitted on top of fc9a104eb6 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A hand-over note now records which packet goal the sending session was working under. The next session is told it at claim, and `skilled-loop` hands it to the relaunched runtime as `SESSION_RELAUNCH_GOAL_PACKET`. No runtime binds a goal here, so nothing changes for the operator until the receiving adapters read the packet.

### Phase 25: goal-binding-record-and-launcher

`prepare` and `keep` resolve the packet from the sender's runtime and write it into the note as an optional `goal_packet` line. OpenCode, Pi, Devin, Cursor and Hermes read the active record under `.skilled/skills/.state/goal/`. Claude reads the newest `goal_status` entry in its session log: a goal that is met, failed or cleared counts as none, and the packet must be the spec folder, one of its parents or a packet the goal text names, with a `goal.md` that carries the goal's first line. With no readable log, Claude falls back to the nearest packet from the spec folder upward that holds a `goal.md`, and Codex always does. A session that never had a goal leaves the field out, and a resolver that cannot read its source never fails a hand-over.

The value is checked like `spec_folder`, with one more step: the packet directory and its `goal.md` must stay inside the repository after links are followed. A bad value that the sender wrote is refused with exit 2 and a reason. `claim` ends its output with a `Goal packet:` line while the packet still holds a `goal.md`. `consume` reports `goal_packet`, and the wrapper exports it to the relaunched session and removes it from the first launch and from any hop whose note carries none. `SESSION_RELAUNCH_GOAL=0`, from the environment or `hook-flags.env`, turns all of it off.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | The packet check, the switch reader, the per-runtime resolver and the note writer |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | Resolve and write at `prepare` and `keep`, print at `claim`, report at `consume` |
| `.skilled/bin/skilled-loop` | Modified | Export `SESSION_RELAUNCH_GOAL_PACKET` and drop a stale value |
| `.skilled/commands/speckit/handoff.md` | Modified | Name the optional field and the claim line |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | 15 tests for the check, the resolver per runtime and the writer |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | 35 tests for `prepare`, `keep`, `claim` and `consume` |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | 4 wrapper tests and the stub's recorded environment |
| `.skilled/hooks/session-relaunch/README.md` | Modified | Goal Packet section, two switch rows, one troubleshooting line |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | The switch and the exported variable |
| `.env.example` | Modified | The switch and its flags-file note |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The relaunch gate was baselined first: 752 of 752 in the loop-set, loop-unset and foreign-loop environments, plus 52 of 52 in the Pi vitest file. The tests came next and ran against a `git archive HEAD` copy, where 37 of the 54 new ones fail. The other 17 pin unchanged behavior, so they pass there by design. The code and docs followed, and the gate then ran again from the final state.

No tmux hop was run by hand. The wrapper path rests on the wrapper suite, which runs the real wrapper and CLI against a stub runtime.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the separate `goal_packet` field (operator default) | `spec_folder` with a `goal.md` cannot say the sender actually had a goal, and that is the only consent signal the receiver has |
| Carry the packet path, never the goal text | The goal text is read fresh from `goal.md`, so a copy in the note would go stale |
| Keep the field optional and validated like `spec_folder` | Older notes must still claim, and a bad path must fail at prepare rather than at the receiver |
| A packet the sender wrote is kept, and only an empty field is filled | The sender's own statement stays, and it still has to pass the same check |
| With the switch off, `prepare` and `keep` write and check nothing | The off setting then leaves a note exactly as it was before this phase |
| `consume` adds `goal_packet` only when a packet is usable | Every existing consumer of its output sees the same JSON as before |
| Claude uses the session log, and Codex and a missing log use `spec_folder` | The log is the only record of a Claude goal, and the spec folder is the one signal the others have |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline: `node --test --test-reporter=tap .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` with the loop variables set, unset and foreign | 752 of 752, exit 0 in each |
| Same gate after the change | 806 of 806, exit 0 in each. Delta +54 tests, 0 failures |
| Pi vitest (`.skilled/hooks/vitest.config.ts`, `session-relaunch`) before and after | 52 of 52 both times |
| The new tests against the code before this phase | 37 of 54 fail, 17 guard tests for unchanged behavior pass |
| `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` | Exit 0, all 4 guards PASSED, 10 non-blocking warnings, none in a changed file |
| `verify_alignment_drift.py --fail-on-warn` over the hooks folder and `.skilled/bin` | 0 findings |
| `node --check` on the code and test files, `bash -n` and `shellcheck` on `skilled-loop` | Clean |
| `validate_document.py` on the README and the command | 0 issues each |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` | See the line below |

Run on the final state with `--strict`: Errors 0, Warnings 0, `RESULT: PASSED`. The AC coverage rule reports 5 of 5 criteria with evidence.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Codex has no readable goal record, so its packet comes from `spec_folder` with a `goal.md` and not from a goal the sender set.
2. The Claude log entry for a cleared goal was not observed. The resolver treats a `/goal clear` command entry as ending the goal, and that reading is inferred from the command name. A log that records a clear in another form would still read as an active goal.
3. A Claude goal set from free text that no packet carries resolves to nothing, because the log keeps the goal's text and not its packet.
4. `.skilled/hooks/hook-flags.env.example`, `.skilled/hooks/README.md` and `.skilled/commands/doctor/assets/doctor-env.yaml` list the flags-file switches by name and do not yet list `SESSION_RELAUNCH_GOAL`. They sit outside this phase's file list.
5. The tests README under `.skilled/hooks/session-relaunch/tests/` does not describe the new cases, for the same reason.
<!-- /ANCHOR:limitations -->

---
