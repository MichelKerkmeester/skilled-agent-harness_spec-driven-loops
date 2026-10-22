---
title: "v4.0.0.13, Sessions That Never Run Out and Every Plugin on OpenCode 1 and 2"
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
# v4.0.0.13, Sessions That Never Run Out and Every Plugin on OpenCode 1 and 2

You can now carry a long session past its context limit without closing the terminal. The same release makes every plugin, agent and command work on OpenCode 1 and OpenCode 2.

When a session nears 80% of its context window, it writes a handoff note, saves continuity and ends itself. A fresh session starts in the same terminal, claims the note and continues the work. Claude, Pi, OpenCode, Codex and Hermes hop on their own. Cursor and Devin hop when you run `/speckit:handoff`, which Cursor names `/speckit-handoff`.

All 17 plugins run on OpenCode 1 and OpenCode 2 from one source, sixteen through a shared bridge and sk-vision on its own. The agents, the commands and one `opencode.json` are shared too. One setup script installs both versions side by side. `cli-opencode` dispatches to the one it finds.

The rest of the release renames the framework code surface to `sk-code-skilled` and strengthens state and reliability. The local embedding model now frees its memory when idle, while the ClickUp, Figma and Code Mode skills got install and safety fixes.

> Spec folders: `specs/hooks/023-session-relaunch-loop` (Level 2), `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat` (Level 2), `specs/sk-code/012-sk-code-skilled-rename` (Level 2), `specs/system-skill-advisor/037-advisor-daemon-memory` (Level 2), `specs/system-speckit/049-doctor-audit-followups` phases 032 and 033 (Level 2), `specs/mcp-tooling/023-vendored-copy-review-fixes` and `specs/mcp-tooling/024-code-mode-js-yaml-override`

&nbsp;

## Why This Release

A long task used to end in auto-compaction, which squeezes the conversation into a summary and loses detail. OpenCode 2 carried a second loss: it loaded none of the framework's plugins, so moving to it meant losing the guards, the goal tracking and the advisor.

Now a session near its limit writes a note that a fresh session claims. Every plugin, agent and command runs on either OpenCode version.

&nbsp;

## What's New at a Glance

- **A full session restarts itself.** Near 80% of its context window, a session writes a handoff note, saves continuity and ends. A fresh session in the same terminal claims the note and continues.
- **Every plugin works on OpenCode 1 and 2, side by side.** All 17 plugins showed their effect live on OpenCode 1.19.3 and 2.0.32. The plugin, hook and dual-version checks now run in CI on every pull request and push that touches their files.
- **One line in your shell turns it on.** Sourcing `.skilled/bin/skilled-loop-shell.sh` makes your runtimes start under the loop when you type their names. A project whose `.skilled` is a symlink to this checkout starts under the loop and hops on its own when it also links its five runtime folders.
- **Dispatch follows the version you have installed.** `cli-opencode` asks the binary for its version, takes `opencode2` before `opencode` unless you set `OPENCODE_BIN`, then builds `run --standalone` with the variant attached as `provider/model#variant` on OpenCode 2. The guards know `opencode2` and apply each rule to the version it was written for.
- **Every hop leaves a record.** Each hand-over, kept note, claim, finish and stalled hop adds a line to a hop history you can read with one command or in `/doctor:setup`, which also names any note nobody claimed, while `SESSION_RELAUNCH_NOTIFY_HOPS=1` adds a macOS notice on each hand-over. Thirteen situations ran live on each of Claude, Pi and OpenCode, where four faults surfaced and are now fixed.
- **Your command list stays the same.** The 12 files in `.skilled/commands/` that are not commands now use `.markdown`, so your command list is unchanged at 40 commands on OpenCode 1 and 42 on OpenCode 2. An unpinned dispatch uses `llmgateway/deepseek-v4.1-flash` at its `max` variant on both.
- **`sk-code-opencode` is now `sk-code-skilled`.** The framework code surface no longer shares a name with the OpenCode runtime. Its surface id is now `SKILLED`.
- **`/doctor:env` now sees every setting.** `.env.example` now names every setting the code reads with its default. `/doctor:env` shows and saves each one, while the README says where to set a value on your own machine.
- **State survives a rebuild.** Older research and review logs keep every row when the loop rebuilds its state, while a corrupt goal record reads as no goal. A fresh worktree now provisions the package trees it needs.
- **Advisor lookups queue and give up on time.** Hand-off counts now update under a lock, while the git pre-commit installer finds the hooks folder. The OpenCode session-cleanup guards no longer stall the event stream.
- **Local model servers free their memory.** The hf-local model server, about 470 MB, unloads after 10 minutes idle. The next launcher reaps one whose launcher died.
- **ClickUp, Figma and Code Mode are safer to install.** The ClickUp and Figma skills fix 24 review findings. A fresh Code Mode install now starts again.
