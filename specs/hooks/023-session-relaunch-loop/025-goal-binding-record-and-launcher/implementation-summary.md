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

`prepare` and `keep` resolve the packet from the sender's runtime and write it into the note as an optional `goal_packet` line. OpenCode, Pi, Devin, Cursor and Hermes read the active record under `.skilled/skills/.state/goal/`. Claude reads the newest `goal_status` entry in its session log: a goal that is met, failed or cleared counts as none, and the packet must be the spec folder, one of its parents or a packet the goal text names, with a `goal.md` that carries the goal's first line. With no readable log the goal is unproven, so Claude writes no field. Codex writes none either. A session that never had a goal leaves the field out, and a resolver that cannot read its source never fails a hand-over.

The value is checked like `spec_folder`, with one more step: the packet directory and its `goal.md` must stay inside the repository after links are followed. `claim` and `consume` apply that check before they hand a packet on. `claim` ends its output with a `Goal packet:` line while the packet still holds a `goal.md`. `consume` reports `goal_packet`, and the wrapper exports it to the relaunched session and removes it from the first launch and from any hop whose note carries none. `SESSION_RELAUNCH_GOAL=0`, from the environment or `hook-flags.env`, turns all of it off.

### Fix pass: the field only says what can be proven

A review of the first build found three defects, and this pass fixed them.

1. The field was written for senders that never had a goal. Codex always took the nearest `goal.md` from the spec folder upward, and Claude did the same when its session log was missing or unreadable. With hundreds of packets holding a `goal.md`, nearly every Codex hop claimed a goal and the receiver bound it. Both paths now answer empty. Codex keeps a goal per thread in `goals_1.sqlite` under its home, in a `thread_goals` table of thread id, objective text and status, with no packet. Every copy of that file on this machine held zero rows, and the earlier probe homes held no database, so no populated record was read and the thread id was never matched to the id a hand-over carries. That is not a record to rely on, so Codex senders get no field.
2. The field was written once and never refreshed, so a note prepared again after its goal ended still named the dead goal. `prepare` and `keep` now resolve the sender's goal on every call and write the result: the packet, a different packet, or no field. A note that already says the right thing is not rewritten.
3. Two tests did not pin what they claimed. A wrapper test now runs two hops, the first note carrying a packet and the second none, and fails when the per-hop `unset` in `skilled-loop` is removed. The `keep` step of the spec-folder worktree test now asserts exit 0 as well as the absent error text.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | The packet check, the switch reader, the per-runtime resolver and the note writer. The fix pass makes Codex and a Claude session without a log resolve to nothing, and makes the writer replace or remove the field |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | Resolve and write at `prepare` and `keep`, print at `claim`, report at `consume`. The fix pass resolves again on every call and drops the keep-what-was-written path |
| `.skilled/bin/skilled-loop` | Modified | Export `SESSION_RELAUNCH_GOAL_PACKET` and drop a stale value |
| `.skilled/commands/speckit/handoff.md` | Modified | Name the optional field and the claim line |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | 15 tests for the check, the resolver per runtime and the writer |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | 35 tests for `prepare`, `keep`, `claim` and `consume` |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | 5 wrapper tests, the stub's recorded environment and a stub option that rewrites the note on a chosen launch |
| `.skilled/hooks/session-relaunch/README.md` | Modified | Goal Packet section, two switch rows, one troubleshooting line, all updated for the fix pass |
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
| `prepare` and `keep` own the field and rewrite it on every call (replaces: a hand-written value is validated and kept) | A value written once never ended with its goal, so a note prepared again handed on a dead goal. The only party that can prove the sender's goal is the resolver, so a hand-written value cannot be trusted over it and is replaced or removed |
| With the switch off, `prepare` and `keep` write and check nothing | The off setting then leaves a note exactly as it was before this phase |
| `consume` adds `goal_packet` only when a packet is usable | Every existing consumer of its output sees the same JSON as before |
| Claude uses the session log, and Codex and a missing log write no field (replaces: they used `spec_folder`) | The log is the only record of a Claude goal. A `goal.md` in the spec folder shows a packet has a goal file and not that the sender had a goal, and the receiver reads the field as proof of one |
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

Run on the first build with `--strict`: Errors 0, Warnings 0, `RESULT: PASSED`. The AC coverage rule reported 5 of 5 criteria with evidence.

### Fix pass

| Check | Result |
|-------|--------|
| Baseline before the fix, relaunch gate with the loop variables set, unset and foreign | 806 of 806, exit 0 in each. Pi vitest 52 of 52 |
| New and rewritten tests against the code before the fix | 16 fail (4 core, 6 `prepare`, 6 `keep`). The wrapper test passes there, since the wrapper was already right |
| Wrapper negative control: the per-hop `unset` in `skilled-loop` replaced by a no-op | Only the new two-hop test fails, and the four earlier goal-packet wrapper tests stay green, which is the gap the review named. The file was restored byte for byte |
| Relaunch gate after the fix, set, unset and foreign | 814 of 814, exit 0 in each. Delta +8 tests, 0 failures. Pi vitest 52 of 52, exit 0 |
| `run-all-drift-guards.sh`, `check-rule-copies.test.sh`, `verify_alignment_drift.py --fail-on-warn` over the hooks folder | Exit 0 with all 4 guards PASSED and 10 non-blocking warnings, exit 0 with all canary cases passing, and 0 findings. `skilled-loop` was not changed, so `shellcheck` was not rerun and `bash -n` was |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Codex senders carry no goal packet. Its goal store, `goals_1.sqlite` under the Codex home, keeps the objective text and a status per thread with no packet, and no populated row was ever read, so a Codex goal cannot be matched to a packet with evidence. Matching the objective text to a `goal.md` the way the Claude path does would need a live Codex goal to read, and a check that the table's thread id equals the session id a hand-over carries.
2. The Claude log entry for a cleared goal was not observed. The resolver treats a `/goal clear` command entry as ending the goal, and that reading is inferred from the command name. A log that records a clear in another form would still read as an active goal.
3. A Claude goal set from free text that no packet carries resolves to nothing, because the log keeps the goal's text and not its packet. A Claude session whose log cannot be found or read resolves to nothing for the same reason.
4. `.skilled/hooks/hook-flags.env.example`, `.skilled/hooks/README.md` and `.skilled/commands/doctor/assets/doctor-env.yaml` list the flags-file switches by name and do not yet list `SESSION_RELAUNCH_GOAL`. They sit outside this phase's file list.
5. The tests README under `.skilled/hooks/session-relaunch/tests/` does not describe the new cases, for the same reason.
<!-- /ANCHOR:limitations -->

---
