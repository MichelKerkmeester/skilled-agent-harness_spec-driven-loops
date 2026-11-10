---
title: "v4.0.0.13, Sessions That Hand Themselves Over and Every Plugin on OpenCode 1 and 2"
description: "A session near its context limit now hands itself to a fresh session in the same terminal. All 17 plugins, the agents and the commands run on OpenCode 1 and 2, with the plugins showing their effect live on OpenCode 1.19.3 and 2.0.32."
trigger_phrases:
  - "v4.0.0.13 release notes"
  - "skilled v4.0.0.13"
  - "in-session handover"
  - "opencode 1 and 2 support"
  - "session relaunch loop"
importance_tier: "normal"
contextType: "general"
---
# v4.0.0.13, Sessions That Hand Themselves Over and Every Plugin on OpenCode 1 and 2

You can now carry a long session past its context limit without closing the terminal. Near 80% of its context window a session writes a handoff note, saves continuity and ends itself. A fresh session starts in the same terminal, claims the note and continues the work. Claude, Pi, OpenCode, Codex and Hermes hand over on their own, while Cursor and Devin hand over when you run `/speckit:handoff`, which Cursor names `/speckit-handoff`.

Every plugin, agent and command now runs on OpenCode 1 and OpenCode 2 from one source. All 17 plugins load on both versions, sixteen through one shared adapter and sk-vision on its own. The agents, the commands and one `opencode.json` are shared too. One setup script installs both versions side by side and `cli-opencode` dispatches to the one it finds. All 17 plugins showed their effect live on OpenCode 1.19.3 and 2.0.32.

The rest of the release renames the framework code surface to `sk-code-skilled`, lists every setting the code reads and strengthens state and reliability.

> Spec folders: `specs/hooks/023-session-relaunch-loop` (Level 2), `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat` (Level 2), `specs/sk-code/012-sk-code-skilled-rename` (Level 2)

&nbsp;

## Why This Release

A long task used to end in auto-compaction, which squeezes the conversation into a summary and loses detail. OpenCode 2 carried a second loss: it loaded none of the framework's plugins, so moving to it meant losing the guards, the goal tracking and the advisor. Now a session near its limit writes a note that a fresh session claims. Every plugin, agent and command runs on either OpenCode version.

&nbsp;

## What's New at a Glance

- **The note holds the goal and what is left.** At 80% a hook asks the session to write the handoff note with the goal, what is done, the remaining work and anything in flight, then reminds it again 5% later if the first ask was missed.
- **A cap of ten hand-overs and a ten-minute freshness limit stop a runaway chain.** The new session also keeps your spec-folder answer, so it never asks the documentation question again.
- **A session started outside the loop keeps its place.** At 80% the hook asks it to write the same note and run `session-relaunch.cjs keep`, while on Claude Code, Pi and OpenCode a hook after each automatic summary points it back at the note.
- **Every hand-over leaves a record.** Each hand-over, kept note, claim and finish adds a line to a history you can read with the `history` command, while `/doctor:setup` shows the last one and `SESSION_RELAUNCH_NOTIFY_HOPS=1` adds a macOS notice.
- **One setup script puts both versions side by side.** It installs v1 into `~/.local` and v2 into `~/.local/opencode-v2`, then writes an `opencode2` launcher that sets `OPENCODE_DB` so v2 keeps its own database.
- **Dispatch follows the version you have installed.** `cli-opencode` asks the binary for its version, prefers `opencode2` over `opencode` unless you set `OPENCODE_BIN` and builds `run --standalone` with the variant attached as `provider/model#variant` on OpenCode 2. Your command list is unchanged at 40 commands on OpenCode 1 and 42 on OpenCode 2.
- **One default model on both versions.** An unpinned dispatch uses `llmgateway/deepseek-v4.1-flash` at `max` on both, where the default used to depend on the version.
- **`sk-code-opencode` is now `sk-code-skilled`.** The framework code surface no longer shares a name with the OpenCode runtime, so anything that matched the surface id `OPENCODE` must now match `SKILLED`.
- **`/doctor:env` now shows every setting.** `.env.example` names about 120 settings it was missing with each default and a line on what it does, `/doctor:env` shows and saves each one and the README says where to set a value on your own machine.
- **Reliability fixes across the stack.** Advisor lookups queue and give up on time, hand-off counts update under a lock, a corrupt goal record reads as no goal and a fresh worktree now installs the package trees it needs.
