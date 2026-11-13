# Verified findings for phase 002-pi-bind-once

Source: `../scratch/verify-1.md` in the parent packet, written by the verifying reviewer on 2026-11-12. This file is the brief for this phase. The work package comes first, then each finding it covers.

## Work package

2. **WP2. The Pi hand-over binds once per process** (N2, N3 for Pi)
   - Files: `.skilled/hooks/goal/pi/goal-context.ts`, `.skilled/hooks/goal/pi/goal-pi.test.mjs`.
   - Must fail first: a second `session_start` with a new id binds nothing.

## Findings

**N2. Pi binds the hop's goal into every new session in the receiving process** (P2, confirmed)
- **Evidence.** The Pi guard is per session id (`goal-context.ts:101-108`). Pi 1.5.2 starts new sessions in-process: `SessionStartEvent.reason` is `"startup" | "reload" | "new" | "resume" | "fork"` (`pi-coding-agent/dist/core/extensions/types.d.ts:595-600`), and `/new` is listed in `slash-commands.js:22`. X5: a second session id in the same environment gives `{"bound":true}` with the parent packet. OpenCode guards this once per process (`handOverGoalAttempted`, `opencode-goal.js:3584-3586`). Devin and Cursor hooks have the same per-session behaviour.
- **Scenario.** The operator types `/new` or `/resume <old session with no goal>` in a hopped Pi receiver, and the hop's goal is injected on every prompt of that unrelated session.
- **Smallest fix.** In `goal-context.ts`, after the first attempt that has a session id, delete `process.env.SESSION_RELAUNCH_GOAL_PACKET`, or use a process-wide flag the way OpenCode does. Deleting the variable also closes N3 for Pi.
- **Test.** `goal-pi.test.mjs`: after the receiver binds, a `session_start` with a new id binds nothing (fails today).

**N3. The packet variable leaks into nested runtimes** (P3, inferred)
- **Evidence.** The variable has no `SKILLED_LOOP_` prefix, so `dropNestedLoop` does not strip it. The claim seed got the prefix for exactly this reason (`compact-pointer.mjs:36-38`, README:179). Only `AI_SESSION_CHILD=1` stops a bind (`goal-core.cjs:1260`; X5 `child-session`).
- **Scenario.** An `opencode run` or `pi -p` started from a receiver's tool shell without `AI_SESSION_CHILD` binds the hop's goal.
- **Smallest fix.** The N2 deletion for Pi. For OpenCode, delete the variable after the one attempt at `opencode-goal.js:3585`.
