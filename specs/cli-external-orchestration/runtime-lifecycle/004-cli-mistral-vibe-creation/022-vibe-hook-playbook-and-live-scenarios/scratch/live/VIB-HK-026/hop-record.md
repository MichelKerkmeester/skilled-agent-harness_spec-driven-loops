# VIB-HK-026 hop record: one live manual hop on Vibe

Verdict: **PASS**, from a live hop driven by hand in a tmux pane, not from a runner matrix row. The runner cannot run the hop (see `procedure.md`), so this record is the verdict source.

Run 2026-11-15 12:48 to 12:54 UTC in the 383 worktree, `vibe 3.1.2`, `deepseek-flash`, the worktree trusted with `--trust`, no packet bound, `SPECKIT_DIST_AUTO_REBUILD=0`.

## What happened, in order

1. **First attempt, refused.** `skilled-loop vibe --trust` started the sender. It followed `.skilled/commands/speckit/handoff.md`, wrote a note and ran `prepare`, which refused: session handover is off for Vibe unless `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1` or the master switch is set. The model then started searching for the switch, so the turn was interrupted and the session exited. Its note, `20261115T124826Z-E9ECD2EB-….md`, stays open.
2. **Sender, with the switch.** `export SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1; bash .skilled/bin/skilled-loop vibe --trust`. The sender wrote `20261115T125127Z-BB3725D4-9E6F-4F3A-8FDF-812060E8791F.md` and ran `prepare --runtime vibe`, which printed `STATUS=OK RESULT=manual` and the claim command `skilled-loop vibe "[session-handover] claim and continue handoff <absolute note path>"` (`hop/sender-screen.txt`).
3. **Exit.** `/exit` ended the sender. The wrapper exited without a claim line, because a manual result leaves no pending record.
4. **Receiver.** `bash .skilled/bin/skilled-loop vibe --trust "[session-handover] claim and continue handoff <absolute note path>"`. The fresh session read the note from the seed alone, ran `session-handover.cjs claim` with a fresh `uuidgen` id, ran `complete`, and replied `claimed` (`hop/receiver-screen.txt`).
5. **Approvals.** The sessions ran under Vibe's default approval agent, so each shell call asked for permission. Every approval is listed in `hop/approvals.txt`. The claim and the `complete` call were approved once each.

## What the passing record shows

- `hop/handoff-note.md`: `status: done`, `claimed_at: 2026-11-15T12:53:25.710Z`, `claimed_by: 21D1A964-3B20-4DA4-8BDC-45A73D030F58`, `completed_at: 2026-11-15T12:53:40.814Z`.
- `hop/history.txt`: one `claimed` line and one `done` line, both with runtime `vibe`.
- The receiver's first turn carries the claim and its reply is `claimed`.

## Findings

- **The switch is required.** Since session handover became default-on for Claude Code only, a Vibe hop needs `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1` in the operator's shell before `skilled-loop vibe` starts. Without it, `prepare` refuses.
- **The printed claim command drops the sender's launch flags.** It printed `skilled-loop vibe "<seed>"` without `--trust`. Run as printed in an untrusted checkout, the receiver would ignore `.vibe/config.toml` and `.vibe/hooks.toml`, which means Vibe's default model (off the roster) and no hooks. This hop added `--trust` by hand. In `skilled-loop`, `build_manual_command_template` replays extra arguments only in hop mode.
- **No turn-start claim part is needed.** The receiver claimed from the seed alone, which confirms phase 019's decision 1. Decision 2, the `VIBE_SPEC_FOLDER` export, was not exercised, because no packet was bound.
