# Manual Vibe hop record

Status: **BLOCKED** for the interactive half. This worker is non-interactive and has no
terminal, so it cannot start `skilled-loop vibe`, run `/speckit-handoff` inside the TUI, or
exit the session by hand. The procedure is written in `scratch/manual-hop/procedure.md` for
the operator who runs it.

## What was exercised offline

The prepare half of the command-only flow was run against a temporary note and a temporary
relaunch state directory, with the relaunch concern enabled:

```bash
SYSTEM_SESSION_RELAUNCH_ENABLED=1 XDG_RUNTIME_DIR="$state" \
  SKILLED_LOOP_ID=999999 SKILLED_LOOP_RUNTIME=vibe \
  node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs \
  prepare --handoff "$note" --session test-vibe-session --runtime vibe
```

Exit code: `0`

Prepare line:

```text
[session-relaunch] handoff prepared; nothing ends this session. Exit it and run the claim command the wrapper prints.
```

Pending record written by the run:

```json
{"version":1,"status":"pending","loopId":"999999","handoff":".../019-vibe-probe-65043.md","sessionId":"test-vibe-session","runtime":"vibe","name":null,"cwd":".../383-mistral-vibe-runtime","hops":0,"preparedAt":"2026-11-14T21:40:57.991Z","goalSwitch":true}
```

The wrapper half is covered by `skilled-loop-wrapper-launch-arguments.test.cjs`: a Vibe hop
launches `vibe "<seed>"` from the recorded cwd, replays value-taking options, never replays
the headless-only model flag, and a dispatched child gets `child-session` from the nudge
decision.

## What was not observed

- The interactive Vibe session and its `/speckit-handoff` run.
- The operator exit and the wrapper's pending-record claim command.
- The fresh Vibe session's claim, and a `claimed` line with runtime `vibe` in
  `session-relaunch.cjs history`.
- The prepare line, exit, relaunch and claim as one continuous hop in `scratch/manual-hop.md`.

## Decisions

1. **Turn-start claim part: not added.** The command-only tier carries the claim in the seed,
   as Cursor and Devin do. The manual hop did not run, so a seed-claim failure was not
   observed and there is no evidence that a hook part is needed. Revisit only if a real hop
   shows the receiver does not claim from the seed.
2. **`VIBE_SPEC_FOLDER` export: not added in this phase.** The wrapper already exports
   `SESSION_RELAUNCH_GOAL_PACKET` when a claim seed names a note with a packet, but the Vibe
   `session_start` hook reads `VIBE_SPEC_FOLDER` (`.skilled/hooks/goal/vibe/goal-inject.mjs`),
   so a relaunched Vibe session currently gets no goal slice at start. The claim seed still
   names the spec folder, so the receiver can read the packet. Whether the missing start
   slice matters is the manual hop's question; it stays open until the operator runs the
   procedure.

## To finish

Follow `scratch/manual-hop/procedure.md`, then replace this blocked record with the prepare
line, exit, relaunch, claim and history line, and confirm or revise both decisions above.
