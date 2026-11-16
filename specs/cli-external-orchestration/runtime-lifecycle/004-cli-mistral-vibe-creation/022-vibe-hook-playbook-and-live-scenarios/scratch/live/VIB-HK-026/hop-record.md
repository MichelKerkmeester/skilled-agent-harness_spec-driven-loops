# VIB-HK-026 hop record: one live manual hop on Vibe

Verdict: **PASS**. The hop was driven by hand in a tmux pane, not run as a runner matrix row. The runner cannot run the hop (see `procedure.md`), so this record is the verdict source.

Run 2026-11-16 11:40 to 11:55 UTC in the 383 worktree at `21987239481`, on current main plus the symlink launch-check fix. Versions: `vibe 3.1.2`, GLM-5.3 Flash (the checkout config's active model), the worktree trusted with `--trust`, no packet bound, `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1`, `SPECKIT_DIST_AUTO_REBUILD=0`. The shell was a clean login shell (`env -i` plus `zsh -l`), so no `SKILLED_LOOP_*` or Claude variables reached it. This record replaces the 2026-11-15 hop, which predated the merges that changed `relaunch-core.cjs`.

## What happened, in order

1. **Sender, outside the loop.** `command vibe --trust` started the sender without the wrapper; `command` skips the `skilled-loop` shell shim. Asked to follow `.skilled/commands/speckit/handoff.md`, it resolved its session id with `uuidgen`, because `SKILLED_LOOP_ID` was empty. It wrote `20261116T114749Z-BFC9BBB5-7B32-4977-80D5-7D37104F1AB7.md` and ran `prepare --runtime vibe`. `prepare` exited 3 and printed `STATUS=OK RESULT=manual` and the claim command in its plain form, `skilled-loop vibe "[session-handover] claim and continue handoff <absolute note path>"` (`hop/sender-screen.txt`).
2. **Exit.** `/exit` ended the sender.
3. **Receiver.** `bash .skilled/bin/skilled-loop vibe --trust "[session-handover] claim and continue handoff <absolute note path>"`. The operator adds `--trust`, as the scenario says. The fresh session read the note from the seed alone, ran `session-handover.cjs claim` with a fresh id and worked through the note's carried items. It asked one question about the untracked scratch files, answered "Leave untracked". Then it ran `complete` (`hop/receiver-screen.txt`).
4. **Approvals.** Vibe's default approval agent asked before each shell call. Every approval is listed in `hop/approvals.txt`. Two of the receiver's calls changed state: `install-git-hooks.sh` and an `npm run build` of the history package. Afterwards the global hook links under `~/.config/git/hooks` were unchanged (dated 2026-10-31, pointing at the primary checkout), the tracked tree was clean, and the build output is gitignored.

## What the passing record shows

- `hop/handoff-note.md`: `status: done`, `claimed_at: 2026-11-16T11:49:05.844Z`, `claimed_by: 1b031165-1506-6603-562c-d570bd781028`, `completed_at: 2026-11-16T11:54:44.667Z`.
- `hop/history.txt`: a `claimed` line and a `done` line for the note, both with runtime `vibe`.
- The receiver's first turn carries the claim seed, and its reply begins "Handoff claimed and closed".

## The automatic route, recorded on the way

A first sender started with `bash .skilled/bin/skilled-loop vibe --trust`, as the old step 2 of `procedure.md` said. It never reached the manual tier. Under the wrapper, `prepare` armed the record, and when the turn ended the wrapper started the receiver by itself. The receiver claimed `20261116T114204Z-33acc35f-….md` 11 seconds after the hand-over (`hop/history.txt`: `handed-over` then `claimed`, runtime `vibe`; `hop/automatic-route-receiver-screen.txt`). That is the VIB-HK-027 route. The scenario contract says the manual tier runs with Vibe started outside `skilled-loop`, so step 2 of `procedure.md` now says so. That receiver did not run `complete`, so the note was closed by hand afterwards with `session-handover.cjs complete`.

## Findings

- **The switch is still required.** A Vibe hop needs `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1` before the sender starts.
- **Under the wrapper the hop is automatic.** A typed handoff inside `skilled-loop` arms the record and relaunches without `/exit` or a pasted command. Only a sender outside the wrapper gets `RESULT=manual` and a printed claim command.
- **The plain claim command omits `--trust`.** This matches the scenario contract: a sender outside the wrapper has no launch flags to replay, so the operator adds `--trust`.
