# VIB-HK-026 procedure: the manual relaunch hop runs from the operator terminal

The shared conversation runner cannot drive this hop. Run these steps in a terminal in the
repository root with `MISTRAL_API_KEY` exported and a `vibe` binary on `PATH`.

## Why the runner cannot drive it

1. The hop starts with `skilled-loop vibe`, which owns the terminal across both halves: it exits
   the sender session, consumes the pending record and launches the fresh session
   (`.skilled/bin/skilled-loop:1378` builds the seed, `:835` `build_manual_command_template`
   prints the command the operator runs). The runner's turns can send text, restart the same
   session with `vibe --resume`, or compact; none of them runs a shell command between sessions.
2. The claim seed names the note by absolute path
   (`[session-relaunch] claim and continue handoff <path>`, `relaunch-core.cjs:50`, and
   `parseClaimSeed` refuses a relative path at `:131`). A turn's `send` is a static string the
   runner types verbatim, so it cannot carry the note path a run creates.
3. Vibe has no hook that expands a claim seed (Claude's `context-nudge.mjs:111` and Codex's
   `shared.mjs:104` expand it; the Vibe tier carries the claim in the seed by decision), and the
   runner starts its subject in a scratch project outside the checkout, where no
   `.skilled/hooks/session-relaunch` tree exists.

The preflight turn's check records both facts: `no-relaunch-cli-in-project` and
`no-vibe-claim-seed-part`.

## Manual steps

1. Start the loop: `bash .skilled/bin/skilled-loop vibe`.
2. Confirm the session starts in the repository root and that `SKILLED_LOOP_RUNTIME` is `vibe`.
3. Work in the session until a handoff is wanted, then run `/speckit-handoff` in the Vibe session.
4. Let the handoff command write the note and run `prepare --runtime vibe`; copy the prepare line
   it prints.
5. Confirm the prepare line says the handoff is prepared, that nothing ends this session, and that
   the operator must exit and run the claim command the wrapper prints.
6. Exit the Vibe session normally (`/exit` or Ctrl-D) and return to the shell that runs the wrapper.
7. Watch the wrapper consume the pending record and print one `skilled-loop vibe "<seed>"` claim
   command; copy it.
8. Run the printed claim command from the same terminal.
9. In the fresh Vibe session, confirm the receiver claims the note, reads its Goal and Remaining
   work sections, and continues the work.
10. Run `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs history` and confirm one
    `claimed` line whose runtime column is `vibe`.
11. Record the prepare line, the exit, the relaunch command, the claim output and the history line
    beside this file as `hop-record.md`.

This procedure continues the one phase 019 wrote in
`specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/019-vibe-relaunch-command-tier/scratch/manual-hop/procedure.md`,
which left the interactive half unrun; its two open decisions (no turn-start claim part, no
`VIBE_SPEC_FOLDER` export from the wrapper) stay open until an operator records the hop.

## What a passing record shows

- The note under `.skilled/skills/.state/session-relaunch/handoffs/` carries
  `status: claimed`, `claimed_at` and `claimed_by` in its frontmatter.
- `session-relaunch.cjs history` prints one `claimed` line for the note whose runtime is `vibe`.
- The fresh session's first turn carries the claim's output, which is the note body and the
  `Goal packet:` line when the note names a packet.
