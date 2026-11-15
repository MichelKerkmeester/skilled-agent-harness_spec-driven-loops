# Verified findings for phase 005-opencode-continuation-hop

Source: `../scratch/verify-1.md` in the parent packet, written by the verifying reviewer on 2026-11-12. This file is the brief for this phase. The work package comes first, then each finding it covers.

## Work package

5. **WP5. The OpenCode continuation stays off during a prepared hop** (N1, and N3 for OpenCode)
   - Files: `.skilled/hooks/goal/opencode/opencode-goal.js`, `.opencode/plugins/opencode-goal.js`, `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs`.
   - Must fail first: a pending record means `suppressed`, not `fired`.

## Findings

**N1. The OpenCode goal continuation withdraws a prepared hop** (P2 when `OPENCODE_GOAL_AUTONOMY=active`; off by default. Inferred.)
- **Evidence.** On `session.idle`, the relaunch plugin arms and starts the killer (`.opencode/plugins/session-relaunch.js:418-436`). The goal plugin, on the same event, may send `promptAsync` (`opencode-goal.js:3629-3659` and `3041-3058`), which arrives as a new user message. The relaunch plugin withdraws an arm on any new user message (`session-relaunch.js:347-365` with `withdrawArmForUserMessage` at `:256-271`). The goal plugin has no relaunch awareness (no `relaunch` or `SKILLED_LOOP` reference beyond the bind).
- **Scenario.** A sender with an active goal runs `prepare` and goes idle. The continuation fires within the killer's 3 s wait, the record is disarmed with `user-message`, the hop is lost, and the session works on near its context limit.
- **Smallest fix.** In `maybeContinueGoal`, suppress the continuation when `SKILLED_LOOP_ID` is set and the relaunch record names this session as pending or armed. Change both mirrored copies (`.skilled/hooks/goal/opencode/opencode-goal.js` and `.opencode/plugins/opencode-goal.js`).
- **Test.** In the lifecycle suite: autonomy active, a pending record for the session, `session.idle` gives `decision: suppressed` (fails today with `fired`).

**N3. The packet variable leaks into nested runtimes** (P3, inferred)
- **Evidence.** The variable has no `SKILLED_LOOP_` prefix, so `dropNestedLoop` does not strip it. The claim seed got the prefix for exactly this reason (`compact-pointer.mjs:36-38`, README:179). Only `AI_SESSION_CHILD=1` stops a bind (`goal-core.cjs:1260`; X5 `child-session`).
- **Scenario.** An `opencode run` or `pi -p` started from a receiver's tool shell without `AI_SESSION_CHILD` binds the hop's goal.
- **Smallest fix.** The N2 deletion for Pi. For OpenCode, delete the variable after the one attempt at `opencode-goal.js:3585`.
