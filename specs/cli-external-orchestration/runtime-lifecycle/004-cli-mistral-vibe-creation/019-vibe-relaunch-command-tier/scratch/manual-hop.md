# Manual Vibe hop record

Status: **RUN**. One live manual hop ran on 2026-11-15 and is recorded in phase 022's
`scratch/live/VIB-HK-026/hop-record.md`; the section "Live hop" below summarizes it. The
offline record that follows was written before it.

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

## Live hop (2026-11-15)

Driven by hand in a tmux pane in the 383 worktree, `vibe 3.1.2`, `deepseek-flash`, no packet
bound. The relaunch tree is now `.skilled/hooks/session-handover`, and the CLI is
`session-handover.cjs`.

- The prepare line was `STATUS=OK RESULT=manual HANDOFF=.skilled/skills/.state/session-handover/handoffs/20261115T125127Z-BB3725D4-9E6F-4F3A-8FDF-812060E8791F.md`,
  with one printed claim command, `skilled-loop vibe "[session-handover] claim and continue handoff <absolute note path>"`.
- The exit was `/exit`. The wrapper printed no claim line, because a manual result leaves no
  pending record.
- The claim ran the printed command with `--trust` added. The fresh session claimed the note from
  the seed alone, ran `complete`, and replied `claimed`.
- `session-handover.cjs history` shows a `claimed` line and a `done` line, both with runtime `vibe`.

Two facts the offline record did not have:

- `prepare` refuses on Vibe unless `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1` or the master switch
  is set, because session handover is default-on for Claude Code only.
- The printed claim command leaves out the sender's launch flags. Without `--trust`, the receiver
  in an untrusted checkout ignores the checkout's Vibe config.

What this hop decides:

1. **Turn-start claim part: confirmed not needed.** The receiver claimed from the seed alone.
2. **`VIBE_SPEC_FOLDER` export: not needed; decided in code.** This hop bound no packet. The
   gap it left open is closed in the Vibe goal adapter instead: `renderVibeGoalSlice` in
   `.skilled/hooks/goal/vibe/goal-inject.mjs` now falls back to `SESSION_HANDOVER_GOAL_PACKET`,
   the packet `skilled-loop` exports from the claimed note, when `VIBE_SPEC_FOLDER` is unset, and
   an operator-named `VIBE_SPEC_FOLDER` still wins. The wrapper therefore needs no new export.
   `goal-vibe.test.mjs` proves it through the real `session_start` hook: with only
   `SESSION_HANDOVER_GOAL_PACKET` set, the hook returns the packet's chat slice (5 pass, 0 fail;
   the claimed-packet case fails without the fallback). A live hop with a bound packet was not
   run, because Mistral's API answered `402 API budget exhausted` on 2026-11-15.
