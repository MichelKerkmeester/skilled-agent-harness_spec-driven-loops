---
title: Orca CLI Reference
description: "Version-matched command family map for the Orca CLI router. Families, representative calls, worktree addresses and JSON conventions, with the installed binary guide authoritative for flags."
trigger_phrases:
  - "orca command reference"
  - "orca command families"
  - "orca worktree commands"
  - "orca terminal commands"
  - "orca browser commands"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Orca CLI Reference

The command family map behind the cli-orca router. It records the executable resolution order, the command families the Orca surface exposes, representative calls per family, the worktree address form and the JSON conventions the receipts follow. The installed Orca binary is versioned, so the guide it serves outranks anything written here. Never infer a command or flag the installed guide does not show.

---

## 1. OVERVIEW

This reference is an operating aid, not a flag inventory. Use it to pick the right family for a request, to copy a known-good call shape and to know which claims are deliberately not established locally. The version-matched guide and the local registry read outrank this file when they disagree.

- Preparing the preflight before any version-sensitive command.
- Choosing the family and call shape a request needs.
- Checking what this reference deliberately does not claim.

Core principle: every command and flag here comes from a cited source. Where a source does not establish something, this reference says it is unknown instead of guessing.

---

## 2. RESOLUTION AND PREFLIGHT

Resolve exactly one executable per session in this order and keep it for the whole task (stub block: skill-stubs/_shared/cli-resolution.md):

1. `ORCA_CLI_COMMAND` when it is set. Orca exports it for managed WSL sessions.
2. `orca-dev` in a development checkout whose session exposes `ORCA_DEV_REPO_ROOT`.
3. `orca-ide` on Linux outside an Orca-managed terminal. Bare `orca` there normally resolves to the GNOME Orca screen reader.
4. `orca` otherwise.

`ORCA` in snapshot examples is a placeholder for the resolved executable. Substitute it before running anything and never run `ORCA` literally. If the selected executable cannot run, report its exact error and stop. Do not fall through to another executable, which could silently target a different Orca build (stub block: skill-stubs/_shared/cli-resolution.md).

Capture the resolution evidence before relying on any flag (router contract: SKILL.md):

```bash
command -v orca
orca --version
orca --help
orca agent-context --json
orca skills get orca-cli --full
```

`agent-context --json` is a local command-registry read and is safe in headless contexts (router contract: SKILL.md). If a runtime command reports Orca is not running, start it with `orca open --json` and retry (stub block: skill-stubs/_shared/cli-resolution.md). If the CLI is missing, say so explicitly instead of inspecting source files first (guide: skill-guides/orca-cli.md, loaded by `orca skills get orca-cli --full`).

The runtime-state detail, handoff receipts and session binding behind these commands live in [`session-and-runtime.md`](./session-and-runtime.md).

---

## 3. COMMAND FAMILIES

| Family | Purpose |
|---|---|
| Full handoff | A flow, not a namespace. Worktree creation plus terminal wait and send that transfer ownership to another agent and end the original agent's turn. |
| `worktree` | Orca's tracked view of a repo checkout with its metadata, terminals, browser tabs and UI state. `create`, `list`, `ps`, `current`, `show`, `set`, `rm`. |
| `repo` | Repository registration and inspection. `list`, `show`, `add`, `set-base-ref`, `search-refs`. The family is `repo`, never `repository`. |
| `terminal` | Paired terminals inside a worktree. `list`, `show`, `read`, `send`, `wait`, `create`, `split`, `rename`, `switch`, `close`. |
| `search` | Full-text search over the agent sessions indexed on one Orca host. |
| `automations` | Scheduled prompts run against either a repo-created worktree or an existing workspace. `list`, `show`, `create`, `edit`, `run`, `runs`, `remove`. |
| `artifacts` | Publish HTML or Markdown files through the signed-in account. `share`, `update`, `unshare`, `list`, `delete`. |
| `skills` | Guide loading with `get` plus publishing of installed skills with `installed` and `share`. |
| Browser | The embedded browser scoped to a worktree, driven by top-level verbs with no `browser` namespace. |
| `eval` and `exec` | Page expression evaluation and the passthrough for browser actions the typed verbs do not cover. |
| `orchestration` | Supervised multi-agent coordination. Named by the guide but forbidden for full handoffs and owned by the official orchestration skill. |

Family names and subcommand lists come from the command family inventory in the fresh research return, sourced from the guide and its conditional references (guide: skill-guides/orca-cli.md). Use the installed guide and `agent-context --json` as the authoritative command inventory and do not infer a missing command from this table.

---

## 4. REPRESENTATIVE CALLS BY FAMILY

Each call below is copied from the cited snapshot source with the resolved executable substituted for the placeholder. The installed binary guide is authoritative for flags. These lines prove intent and call shape, never the full surface.

### Worktrees and repositories

Register and inspect repositories, then create, inspect, update or remove Orca worktrees:

```text
orca repo list --json
orca repo show --repo id:<repoId> --json
orca worktree list --repo id:<repoId> --json
orca worktree show --worktree <selector> --json
orca worktree set --worktree active --comment "checkpoint" --json
orca worktree rm --worktree id:<repoId>::<worktreePath> --force --json
# Gated removal: the archive hook must pass and --force does not bypass it. Requirement: references/mutation-and-browser-boundaries.md §3; recovery: references/troubleshooting.md.
```

(guide: skill-guides/orca-cli.md)

### Terminals

Read, wait on and drive paired terminals, then close one terminal or every terminal in a workspace:

```text
orca terminal list --worktree id:<repoId>::<worktreePath> --json
orca terminal read --terminal <handle> --json
orca terminal send --terminal <handle> --text "continue" --enter --json
orca terminal wait --terminal <handle> --for tui-idle --timeout-ms 300000 --json
orca terminal close --worktree id:<repoId>::<worktreePath> --all --json
# Bulk close is destructive: it stops every terminal in that workspace and durably drops tabs, layouts and agent-resume records. Explicit authorization, then the receipt rules in references/session-and-runtime.md; see references/mutation-and-browser-boundaries.md §3.
```

(guide: skill-guides/orca-cli.md)

### Agent session search

Check that a human enabled indexing, then find an exact phrase an agent said on one host:

```text
orca search --index-status --json
orca search "exact sentence an agent said" --json
orca search "blank restore" --agent codex --since 2026-09-01T00:00:00Z --json
```

(guide: skill-guides/orca-cli.md)

### Automations

Schedule, inspect and run prompts against a repo-created worktree or an existing workspace:

```text
orca automations list --json
orca automations create --name "Daily review" --trigger daily --time 09:00 --prompt "Review open changes" --provider codex --repo id:<repoId> --json
orca automations run <automationId> --json
```

(reference: skill-guides/orca-cli/references/automations.md)

### Artifacts

List and publish self-contained HTML or Markdown files through the signed-in account:

```text
orca artifacts list --json
orca artifacts share <file> --json
```

(reference: skill-guides/orca-cli/references/publishing.md)

### Skill sharing

Load the version-matched guide, then publish only the installed skills the user named:

```text
orca skills get orca-cli --full
orca skills installed --json
orca skills share --skill <selector> --bundle-name <name> --json
```

(reference: skill-guides/orca-cli/references/publishing.md, stub: skill-stubs/orca-cli.md)

### Browser, eval and exec

Drive the embedded browser in a snapshot, interact, re-snapshot loop, evaluate page expressions and reach browser actions the typed verbs do not cover:

```text
orca goto --url <url> --json
orca snapshot --json
orca click --element <ref> --json
orca tab list --json
orca eval --expression <js> --json
orca exec --command "help" --json
```

(reference: skill-guides/orca-cli/references/browser.md)

### Full handoff flow

Transfer ownership of the work to another agent and stop:

```text
orca worktree create --name <task-name> --no-parent --agent codex --prompt "<task brief>" --json
orca terminal wait --terminal <handle> --for tui-idle --timeout-ms 60000 --json
orca terminal send --terminal <handle> --text "<task brief>" --enter --json
```

The handoff is done when the new worktree id and agent handle are reported and the send receipt shows `accepted: true`. Do not wait for the receiving agent to finish and never use `orchestration task-create`, `dispatch --inject` or `check --wait` for a full handoff (guide: skill-guides/orca-cli.md).

---

## 5. WORKTREE ADDRESSES AND CREATION

- A worktree id is the two-part address `<repoId>::<worktreePath>`, for example `repo-123::/Users/me/orca/fix-login`. Copy the whole `id` field from `worktree create --json` or `worktree list --json` into the next command. A bare repo id names only the repo, not a worktree (guide: skill-guides/orca-cli.md).
- Selectors are `id:`, `name:`, `path:`, `branch:` and `issue:`, plus `active` or `current` for the enclosing worktree. For `--parent-worktree` only, the parent context keys `folder:<folderId>` and `worktree:<repoId>::<worktreePath>` are also valid (guide: skill-guides/orca-cli.md).
- `--no-parent` marks the new worktree as independent in Orca lineage. It controls lineage only and does not choose the Git base. Independent top-level work should omit `--base-branch` so Orca uses the repo default base and must never be based on the current feature branch unless the user asked for stacked work or branch from current (guide: skill-guides/orca-cli.md).
- Agent-first creation is the preferred path. `--agent <id>` launches that agent in the first terminal and `--prompt <text>` sends its initial work, with no extra fallback shell. A bare create followed by `terminal create --command` is the anti-pattern. Known agent ids include `claude`, `codex`, `omp`, `pi` and `grok` (guide: skill-guides/orca-cli.md).
- Setup hooks are controlled with `--setup run|skip|inherit`, where `inherit` follows repo policy. `--run-hooks` is a legacy alias for `--setup run` that also reveals the worktree, as does `--activate`. `--agent` alone stays in the background (guide: skill-guides/orca-cli.md).
- When an older installed CLI rejects `--agent`, `--prompt` or `--setup`, create the worktree normally, then run `terminal create --command` and `terminal send` if a prompt is needed (guide: skill-guides/orca-cli.md).
- Removal is safety gated. A removal whose archive hook fails or cannot be verified blocks with `worktree_archive_hook_failed`. The `--force` flag does not bypass the failure. The documented failed-hook override is valid only together with the hook flag and must be reported when used (router contract: SKILL.md, research return: source inspection of the archive-hook removal gate, named by no guide or stub). [`troubleshooting.md`](./troubleshooting.md) holds the recovery.

---

## 6. JSON AND ERROR CONVENTIONS

- Prefer `--json` for agent-driven calls (stub block: skill-stubs/_shared/cli-resolution.md, guide: skill-guides/orca-cli.md).
- A text-plus-Enter agent prompt returns a durable request id with additive stages, `input_accepted` first and then `turn_started` once the agent's turn is proven. `warnings` are identical in text and JSON receipts. `accepted: true` proves input acceptance, not a started turn (guide: skill-guides/orca-cli.md).
- Waits report a `wait.satisfied` boolean. A timed-out wait still prints a normal result, so read the field rather than the fact that something printed (guide: skill-guides/orca-cli.md).
- Cursor pagination fields are `cursor`, `limit`, `oldestCursor`, `nextCursor`, `latestCursor` and `limited` (guide: skill-guides/orca-cli.md).
- Search status fields are `enabled`, `phase` and `truncated.candidates` (guide: skill-guides/orca-cli.md).
- Error codes are per family, not global. Terminal codes include `terminal_handle_stale` and the `old-host` fallback. Browser recoveries include `browser_no_tab`, `browser_stale_ref`, `browser_tab_not_found` and `browser_host_unavailable`. Publishing denials are `artifact_sharing_disabled`, `agent_skill_sharing_disabled` and `agent_skill_sharing_busy` (guide: skill-guides/orca-cli.md, references: browser.md and publishing.md). `worktree_archive_hook_failed` is recorded from source inspection only (research return).
- A zero exit status means the CLI ran without erroring, not that it wrote anything, so read the output to confirm what changed (research return: headless server reference observation).
- Deliberately absent: the snapshot documents no general exit-code taxonomy, no global error-object schema and no top-level `_meta` envelope. Only the per-family fields above are established (research return, section 6). [`troubleshooting.md`](./troubleshooting.md) maps each code to its recovery.

---

## 7. DELIBERATELY UNKNOWN HERE

- Any flag the local research could not ground is unknown here. This reference carries family purposes and representative calls only, never a flag inventory. Resolve the executable, load `orca skills get orca-cli --full` or the matching `--reference references/<file>.md` and treat the installed guide and `--help` as the only flag authority (router contract: SKILL.md).
- The Orca native MCP command: the command registry inspected for the prior Orca packet, version 1.4.205, contained no command named `mcp` and no dedicated Orca browser automation family beyond the generic browser and session commands (ancestor observation). Official documentation may describe Orca app integrations, but no native MCP surface is claimed here until a separate live callable inspection proves one (router contract: SKILL.md).
- The guide and its stub name no version flag. The preflight `--version` line is the router contract's evidence capture. The headless server reference documents `orca-ide --version` as printing the Orca build (research return, executable resolution section).

---

## 8. RELATED RESOURCES

| Document | Relationship |
|---|---|
| [`../SKILL.md`](../SKILL.md) | Router contract, loading levels and lane table for this skill |
| [`session-and-runtime.md`](./session-and-runtime.md) | Executable selection, runtime state and the receipt contract behind the calls above |
| [`mutation-and-browser-boundaries.md`](./mutation-and-browser-boundaries.md) | Authorization and mutation gates per command lane |
| [`troubleshooting.md`](./troubleshooting.md) | Fail-closed recovery for the error codes this reference shows |
