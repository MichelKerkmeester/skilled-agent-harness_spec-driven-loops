# VIB-HK-026 procedure: the manual handover hop runs from a terminal

Verdict: **PASS**, recorded in `hop-record.md` from a live hop driven by hand in a tmux pane on 2026-11-15. The shared runner still has no path to this hop, so the hop is run by hand from a terminal and recorded beside this file.

## Why the runner cannot drive it

1. The hop runs two Vibe sessions in a row from one shell: `skilled-loop vibe` starts the sender, and the claim command it prints starts the receiver. The runner's turns can send text, restart the same session with `vibe --resume`, or compact. None of them runs a shell command between sessions.
2. The claim seed names the note by its absolute path (`[session-handover] claim and continue handoff <path>`). A turn's `send` is a static string the runner types verbatim, so it cannot carry the path a run creates.
3. The runner starts its subject in a scratch project outside the checkout, where no `.skilled/hooks/session-handover` tree exists.

The preflight turn's check records both facts: `no-relaunch-cli-in-project` and `no-vibe-claim-seed-part`.

## Manual steps

Run these in a terminal at the repository root, with `MISTRAL_API_KEY` exported and a `vibe` binary on `PATH`.

1. Turn session handover on for Vibe, and keep the session-start self-heal from rebuilding builds mid-test: `export SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1 SPECKIT_DIST_AUTO_REBUILD=0`. Without the first switch, `prepare` refuses, because handover is default-on for Claude Code only.
2. Start the loop: `bash .skilled/bin/skilled-loop vibe --trust`. The `--trust` flag lets an untrusted checkout load its own `.vibe/config.toml` and `.vibe/hooks.toml`.
3. Ask the session to hand itself over. Vibe has no command loader, so say it in words: `Read .skilled/commands/speckit/handoff.md and follow it now for this Vibe session.`
4. Approve its shell calls as they come. The session writes the note, runs `prepare --runtime vibe` and prints `STATUS=OK RESULT=manual` with one `skilled-loop vibe "<seed>"` claim command. Copy that command.
5. Exit the session with `/exit`. The wrapper exits too and prints no claim line, because a manual result leaves no pending record.
6. Run the copied claim command with `--trust` added after `vibe`. The printed command leaves out the sender's launch flags, and without `--trust` the receiver ignores the checkout's Vibe config.
7. In the fresh session, confirm that the receiver claims the note from the seed, reads its Goal and Remaining work sections, and continues the work.
8. Run `node .skilled/hooks/session-handover/bin/session-handover.cjs history` and confirm a `claimed` line whose runtime column is `vibe`.
9. Record the prepare line, the exit, the claim command, the claim output and the history line beside this file as `hop-record.md`.

## What a passing record shows

- The note under `.skilled/skills/.state/session-handover/handoffs/` carries `status: claimed`, `claimed_at` and `claimed_by` in its frontmatter, and `status: done` once the receiver runs `complete`.
- `session-handover.cjs history` prints a `claimed` line for the note, with runtime `vibe`.
- The fresh session's first turn carries the claim's output.

## Scope after the automatic tier

The automatic handover tier, VIB-HK-027, arrived with the merge of origin/main as `2d4fb4d0f92`, and the scenario now frames this manual tier as the fallback for a hand-typed `/speckit-handoff`. The hop recorded beside this file is that fallback: the session followed the handoff command by hand, `prepare` returned `RESULT=manual`, and the claim command was run from the shell.
