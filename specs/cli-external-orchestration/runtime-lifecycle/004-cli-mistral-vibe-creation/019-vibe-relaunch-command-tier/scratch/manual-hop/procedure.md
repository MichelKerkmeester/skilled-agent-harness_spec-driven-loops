# Manual Vibe hop procedure

Run this from the repository root in a terminal, with `MISTRAL_API_KEY` exported and a
`vibe` binary on `PATH`. Vibe is on the command-only tier: no hook arms the prepared record
and no hook ends the session, so the operator performs the exit and the claim command.

1. Start the loop: `bash .skilled/bin/skilled-loop vibe`.
2. Confirm the session starts in the repository root and that `SKILLED_LOOP_RUNTIME` is `vibe` (the wrapper exports it).
3. Work in the session until a handoff is wanted, then run `/speckit-handoff` in the Vibe session.
4. Let the handoff command write the note and run `prepare --runtime vibe`; copy the prepare line it prints.
5. Confirm the prepare line says the handoff is prepared, nothing ends this session, and the operator must exit and run the claim command the wrapper prints.
6. Exit the Vibe session normally (for example `/exit` or Ctrl-D) and return to the shell that runs the wrapper.
7. Watch the wrapper consume the pending record and print one `skilled-loop vibe "<seed>"` claim command; copy it.
8. Run the printed claim command from the same terminal.
9. In the fresh Vibe session, confirm the receiver claims the note, reads its Goal and Remaining work sections, and continues the work.
10. Run `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs history` and confirm one `claimed` line whose runtime column is `vibe`.
11. Record the prepare line, the exit, the relaunch command, the claim output and the history line in `scratch/manual-hop.md`.
12. Decide from the run whether a turn-start claim part is needed and whether `skilled-loop vibe` should export `VIBE_SPEC_FOLDER`; write both decisions in `scratch/manual-hop.md`.
