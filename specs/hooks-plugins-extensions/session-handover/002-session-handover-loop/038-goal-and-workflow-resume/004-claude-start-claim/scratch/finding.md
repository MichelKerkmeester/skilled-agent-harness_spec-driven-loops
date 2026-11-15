# Verified findings for phase 004-claude-start-claim

Source: `../scratch/verify-1.md` in the parent packet, written by the verifying reviewer on 2026-11-12. This file is the brief for this phase. The work package comes first, then each finding it covers.

## Work package

4. **WP4. The Claude start hook with the concern off** (F5)
   - Files: `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs`, `tests/claude-adapters.test.cjs`.
   - Must fail first: concern off plus the seed variable plus `startup` emits the claim.

## Findings

### F5. Claude concern off: claim never delivered
- **Evidence.** The wrapper swaps the seed with no concern check (`skilled-loop:1019-1036`). `seeded_goal_packet` (`:360-393`) checks only the goal switch and the note. `compact-pointer.mjs:162-170` returns before the `startup` branch when the concern is off. This checkout's `.skilled/hooks/hook-flags.env:55` holds `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0`. X7: with `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` the hook exits 0 with empty stdout; with `=1` it emits 1,477 characters starting with the goal-start lead.
- **Refutation attempt.** A Claude session with the concern off cannot write a note (`prepare` refuses at `session-relaunch.cjs:504-505`), so the path needs a manual cross-runtime claim: a Pi or OpenCode note started with `claude`. That matches this operator's flags.
- **Verdict.** CONFIRMED, P2. The path is rare, but the whole hand-over is lost silently.
- **The fix.** Moving the `startup` and `SKILLED_LOOP_CLAIM_SEED` branch above the enabled check is correct and is one move in one file. The variable exists only when the wrapper has already swapped the prompt, so delivering the claim completes an action the wrapper took. The alternative, guarding the swap in the wrapper, keeps the "concern off means the hook is silent" rule but loses the native goal. Either way, README:179 must change ("only while the switch is on").
- **Tests.** `claude-adapters.test.cjs` (next to the start-claim tests at 1536-1600): concern off plus `SKILLED_LOOP_CLAIM_SEED` plus `source: startup` emits the claim (fails today).
