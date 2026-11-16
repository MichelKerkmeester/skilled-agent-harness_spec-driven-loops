# VIB-HK-026 procedure: the manual handover hop runs from a terminal

Verdict: **PASS**, recorded in `hop-record.md` from a live hop driven by hand in a tmux pane on 2026-11-16, on current main. The shared runner still has no path to this hop, so the hop is run by hand from a terminal and recorded beside this file.

## Why the runner cannot drive it

1. The hop runs two Vibe sessions in a row from one shell: `skilled-loop vibe` starts the sender, and the claim command it prints starts the receiver. The runner's turns can send text, restart the same session with `vibe --resume`, or compact. None of them runs a shell command between sessions.
2. The claim seed names the note by its absolute path (`[session-handover] claim and continue handoff <path>`). A turn's `send` is a static string the runner types verbatim, so it cannot carry the path a run creates.
3. The runner starts its subject in a scratch project outside the checkout, where no `.skilled/hooks/session-handover` tree exists.

The preflight turn's check records two facts: `no-relaunch-cli-in-project`, and `automatic-tier-present`, which says the automatic part lives in the repository and so never arms a record for a scratch subject.

## Manual steps

Run these in a terminal at the repository root, with `MISTRAL_API_KEY` exported and a `vibe` binary on `PATH`.

1. Turn session handover on for Vibe, and keep the session-start self-heal from rebuilding builds mid-test: `export SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1 SPECKIT_DIST_AUTO_REBUILD=0`. Without the first switch, `prepare` refuses, because handover is default-on for Claude Code only. For the goal check, also export `VIBE_SPEC_FOLDER` naming a packet that holds a `goal.md`. In a shell that an agent session started, clear its `SKILLED_LOOP_*` variables first, or `prepare` reads the other runtime's loop.
2. Start the sender outside the loop: `command vibe --trust`. `command` skips the `skilled-loop` shell shim. The `--trust` flag lets an untrusted checkout load its own `.vibe/config.toml` and `.vibe/hooks.toml`. A sender started through `skilled-loop` takes the automatic route instead: the turn end arms the record and the wrapper starts the receiver by itself, which is VIB-HK-027's scenario.
3. Ask the session to hand itself over. Vibe has no command loader, so say it in words: `Read .skilled/commands/speckit/handoff.md and follow it now for this Vibe session.`
4. Approve its shell calls as they come. The session writes the note and runs `prepare --runtime vibe`, which exits 3 and prints `STATUS=OK RESULT=manual` and one claim command in the plain form. With a packet bound, the note gains `goal_packet`.
5. Exit the session with `/exit` and copy the claim command `prepare` printed.
6. For the goal check, `unset VIBE_SPEC_FOLDER SESSION_HANDOVER_GOAL_PACKET`, so only the claimed note can supply the packet. Run the copied claim command from the repository root with `--trust` added after `vibe`, because a sender outside the wrapper has no launch flags to replay.
7. In the fresh session, confirm that the receiver claims the note from the seed, reads its Goal and Remaining work sections, and continues the work. With a packet bound, its first input carries the packet's goal slice as hook context: search the session's journal under the Vibe home for `# Goal:`.
8. Run `node .skilled/hooks/session-handover/bin/session-handover.cjs history` and confirm a `claimed` line whose runtime column is `vibe`.
9. Record the prepare line, the exit, the claim command, the claim output and the history line beside this file as `hop-record.md`.

## What a passing record shows

- The note under `.skilled/skills/.state/session-handover/handoffs/` carries `status: claimed`, `claimed_at` and `claimed_by` in its frontmatter, and `status: done` once the receiver runs `complete`.
- `session-handover.cjs history` prints a `claimed` line for the note, with runtime `vibe`.
- The fresh session's first turn carries the claim's output.

## Scope after the automatic tier

The automatic handover tier, VIB-HK-027, arrived with the merge of origin/main as `2d4fb4d0f92`, and the scenario now frames this manual tier as the fallback for a hand-typed `/speckit-handoff`. The hop recorded beside this file is that fallback: the session followed the handoff command by hand, `prepare` returned `RESULT=manual`, and the claim command was run from the shell.
