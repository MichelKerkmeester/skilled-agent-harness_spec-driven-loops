# Verified findings for phase 007-goal-handover-docs

Source: `../scratch/verify-1.md` in the parent packet, written by the verifying reviewer on 2026-11-12. This file is the brief for this phase. The work package comes first, then each finding it covers.

## Work package

7. **WP7. Documentation, after WP3 and WP4** (F13 second half, F5 semantics, N4, N7)
   - Files: `.skilled/hooks/session-relaunch/README.md`, `.skilled/hooks/hook-flags.env.example`.
   - No test. Review against the shipped behaviour.

## Findings

### F13. Doc drift
- CONFIRMED, P3, both halves. The `handoff.md:127` fix fits in work package WP1, the `hook-flags.env.example` row in WP7.

### F5. Claude concern off: claim never delivered
- **Evidence.** The wrapper swaps the seed with no concern check (`skilled-loop:1019-1036`). `seeded_goal_packet` (`:360-393`) checks only the goal switch and the note. `compact-pointer.mjs:162-170` returns before the `startup` branch when the concern is off. This checkout's `.skilled/hooks/hook-flags.env:55` holds `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0`. X7: with `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` the hook exits 0 with empty stdout; with `=1` it emits 1,477 characters starting with the goal-start lead.
- **Refutation attempt.** A Claude session with the concern off cannot write a note (`prepare` refuses at `session-relaunch.cjs:504-505`), so the path needs a manual cross-runtime claim: a Pi or OpenCode note started with `claude`. That matches this operator's flags.
- **Verdict.** CONFIRMED, P2. The path is rare, but the whole hand-over is lost silently.
- **The fix.** Moving the `startup` and `SKILLED_LOOP_CLAIM_SEED` branch above the enabled check is correct and is one move in one file. The variable exists only when the wrapper has already swapped the prompt, so delivering the claim completes an action the wrapper took. The alternative, guarding the swap in the wrapper, keeps the "concern off means the hook is silent" rule but loses the native goal. Either way, README:179 must change ("only while the switch is on").
- **Tests.** `claude-adapters.test.cjs` (next to the start-claim tests at 1536-1600): concern off plus `SKILLED_LOOP_CLAIM_SEED` plus `source: startup` emits the claim (fails today).

**N4. A Claude sender under an unmet native goal** (P3, inferred; no loop, the hop usually wins)
- **Evidence.** `stop-arm.mjs` and `killer.cjs` know nothing about goal state. The killer treats 3 s with no transcript change as idle (`killer.cjs:176-201`) and gives up after 30 s (`:28-29`), and a disarmed record cannot be armed again (`relaunch-core.cjs:970-971`). Real repo logs (`ae286a84`, `c7832267`, structure only) show the goal continuation as a Stop-hook block: Stop `hook_success`, then 1.4 to 2.6 s, then an `isMeta` "Stop hook feedback" entry, `goal_status met:false`, `stop_hook_summary` and `api-request`. The next transcript write came 4.8 to 12 s later. No `UserPromptSubmit` fires for the continuation, so `context-nudge`'s withdraw does not trigger.
- **Outcome.** The killer usually signals during the continuation's first API call, and the hop proceeds. The hop is lost (`killer-timeout`) only if the continuation keeps writing at gaps under 3 s for 30 s. A continuation tool call that runs longer than 3 s could be killed mid-run, and that work is not in the note.
- **Fix.** None recommended. Record it as a known race in README §3.

**N7. A phase-child goal: Claude refuses it, plugins bind it** (P3, by design)
- `goal-slice.cjs:326-329` and `goal-handover.cjs:127`. No code fix. One README line to say why the two differ.
