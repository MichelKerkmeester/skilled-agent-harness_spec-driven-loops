---
title: Orca CLI Reference
description: Version-matched command and backend reference for the Orca workflow packet.
version: 1.0.0.0
trigger_phrases:
  - "orca command reference"
  - "orca agent-context"
  - "orca worktree commands"
  - "orca terminal commands"
importance_tier: important
contextType: general
---

# Orca CLI Reference

This reference is a version-matched operating aid, not a replacement for the installed guide. Resolve the executable first and reload the guide when the Orca version changes.

## 1. Resolution and discovery

```bash
command -v orca
orca --version
orca --help
orca agent-context --json
orca skills get orca-cli --full
```

The official resolution order is `ORCA_CLI_COMMAND`, `orca-dev` in a development checkout, Linux `orca-ide` outside a managed terminal, then `orca`. Once selected, do not fall through to another executable after an execution error.

The installed baseline inspected for this packet was `/usr/local/bin/orca`, version `1.4.205`. The baseline is evidence for this packet, not a promise that future versions expose the same flags.

## 2. Observed command families

The 1.4.205 local command registry exposed command families for:

- Runtime startup and status, agent context, accounts, and skills.
- Hosts and environments, including runtime and project-host setup.
- Repositories, projects, and worktrees.
- Files and terminals.
- Scheduled automations.
- Agent orchestration and structured sessions.
- Artifacts, comments, and skill sharing.
- Orca's embedded browser and its session-scoped browser operations.

Use the installed guide and `agent-context --json` as the authoritative command inventory. Do not infer a missing command from this list.

## 3. Worktrees and repositories

Representative guide commands:

```text
orca repo list --json
orca repo show --repo id:<repoId> --json
orca repo add --path /abs/repo --json
orca worktree current --json
orca worktree list --repo id:<repoId> --json
orca worktree show --worktree <selector> --json
orca worktree create --name independent-task --no-parent --json
orca worktree create --name task --agent codex --prompt "hi" --json
orca worktree set --worktree active --comment "checkpoint" --json
orca worktree rm --worktree id:<repoId>::<worktreePath> --force --json
```

Worktree ids are full `<repoId>::<worktreePath>` addresses. Independent top-level work should use `--no-parent` and should not be based on the current feature branch unless the user asks for stacked work. Agent-first creation is preferred when the built-in launcher is sufficient.

Worktree removal is safety-gated. `worktree rm --run-hooks` blocks on an archive-hook failure with `worktree_archive_hook_failed`; `--force` does not bypass the failure. The failed-hook override requires the documented override together with the hook flag and must be reported.

## 4. Terminals and agent sessions

Representative guide commands:

```text
orca terminal list --worktree id:<repoId>::<worktreePath> --json
orca terminal show --terminal <handle> --json
orca terminal read --terminal <handle> --json
orca terminal send --terminal <handle> --text "continue" --enter --json
orca terminal send --terminal <handle> --text "continue" --enter --wait-submit 10 --json
orca terminal wait --terminal <handle> --for tui-idle --timeout-ms 300000 --json
orca terminal close --terminal <handle> --json
```

A text-plus-Enter send produces additive receipt stages. `input_accepted` proves the request was accepted. `turn_started` proves the agent turn began. `--wait-submit` observes the same accepted request and does not resend it. On an ambiguous transport error, replay the exact command with the reported retry request id. A bulk close is `unverifiable` unless the host confirms every PTY stopped.

A full handoff transfers ownership and stops the original agent. The receiving worktree id and accepted prompt receipt are the completion proof. Full handoffs do not use orchestration task creation, dispatch injection, or wait-for-completion commands.

## 5. Browser and conditional references

The embedded browser is scoped to an Orca worktree. The matching browser reference defines the supported command names, typed tab operations, snapshot refs, page affinity, waits, and recoveries. Load it only when driving a browser tab:

```bash
orca skills get orca-cli --reference references/browser.md
```

The automation reference is required before creating, editing, running, or inspecting schedules:

```bash
orca skills get orca-cli --reference references/automations.md
```

The publishing reference is required before sharing or revoking artifacts or skills:

```bash
orca skills get orca-cli --reference references/publishing.md
```

## 6. Backend boundary

The inspected 1.4.205 command registry contained no command named `mcp` and no dedicated Orca browser automation family beyond the generic browser/session commands. Official documentation may describe Orca app integrations, but this packet does not register or claim a native MCP surface without a separate live callable inspection.
