---
title: Orca Session and Runtime Boundaries
description: "Executable resolution, runtime state checks, Orca scopes, handoff ownership transfer, terminal receipts and the CLI-only MCP boundary for the cli-orca skill."
trigger_phrases:
  - "orca session"
  - "orca runtime"
  - "orca handoff receipt"
  - "orca terminal receipt"
  - "orca cli resolution"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Orca Session and Runtime Boundaries

Session contract for one Orca executable, one runtime and one handoff path. Selection, recovery and receipt rules here outrank convenience retries.

---

## 1. OVERVIEW

### Purpose

This reference fixes the session-level decisions the command reference leaves open: which executable to use, when a runtime must exist, what proves a handoff completed and what a terminal receipt does and does not prove. It also records the negative claim that the surface is CLI only.

### When to Use

- Resolving the executable for a session and deciding when the selection is final.
- Deciding whether a requested operation may run without a connected runtime.
- Distinguishing a full handoff from supervised orchestration.
- Interpreting `input_accepted`, `turn_started`, retry request ids and `unverifiable` terminal receipts.
- Answering whether this skill registers an Orca MCP backend.

### Core Principle

An execution error is terminal for the selected executable. Do not silently retry another executable because that can change the runtime, account, worktree or permission context.

---

## 2. EXECUTABLE RESOLUTION

Resolve exactly one executable for the session, in this order, and keep it for the whole task (research: research-orca-cli-surface.md §3, quoting `skill-stubs/_shared/cli-resolution.md`):

1. `ORCA_CLI_COMMAND` when it is set. Orca exports this variable for managed WSL sessions.
2. `orca-dev` in a development checkout whose session exposes `ORCA_DEV_REPO_ROOT`, built with `pnpm build:cli`.
3. `orca-ide` on Linux outside an Orca-managed terminal.
4. `orca` otherwise.

Why exactly one executable is selected per session:

- If the selected executable cannot run, report its exact error and stop. Do not fall through to another executable, which could silently target a different Orca build (guide: `skill-stubs/_shared/cli-resolution.md`).
- A different build can silently change the runtime, account, worktree or permission context under the session (routing contract: SKILL.md).
- Bare `orca` on Linux outside Orca's terminals normally resolves to the GNOME Orca screen reader and starts speech on the user's machine, which is why `orca-ide` exists as the third step (guide: `skill-stubs/_shared/cli-resolution.md`).
- Substitute the resolved executable for the `ORCA` placeholder in every command. Do not create a shell variable for it and do not run `ORCA` literally (guide: `skill-guides/orca-cli.md`).

---

## 3. RUNTIME STATE CHECKS

Run these checks before relying on any version-sensitive flag. Each proves a different thing and none proves that a runtime operation is available (reference: `references/session-and-runtime.md`).

- `<resolved> --version` prints the Orca build of the bundled CLI launcher and proves the build identity behind version-sensitive claims. The shipped guide and stub files contain no version command, so the headless Linux documentation is the source for this check (docs: `docs/reference/headless-linux-server.md`, research: research-orca-cli-surface.md §3).
- `<resolved> --help` supports read-only discovery of commands and flags the guide does not cover. It proves the surface of the selected build, not runtime availability (guide: `skill-stubs/_shared/cli-resolution.md`).
- `<resolved> agent-context --json` reads the version-matched command registry locally and works without a running Orca app, which makes it the safe headless and SSH preflight. The routing contract names it as the local registry read, and the repository source confirms the CLI serves `agent-context --json` without contacting the runtime (routing contract: SKILL.md, source: `src/cli/index.test.ts`).
- `<resolved> skills get orca-cli` reads the bundled guide locally. Command flags live in the binary so they cannot drift from the app version (docs: `docs/site/content/docs/cli/skills.mdx`).

Commands that inspect or change worktrees, terminals, agents, browser tabs, automations or publishing state may require a running connected runtime. The documented start path is `ORCA open --json` followed by a retry (guide: `skill-stubs/_shared/cli-resolution.md`). This skill treats starting or authenticating a runtime as an action to surface to the user, never as a hidden side effect of another request.

---

## 4. ORCA SCOPES

Orca scopes state across several objects. Each scope has a listing surface, or none that the sources establish.

| Scope | Listing surface | Source |
|---|---|---|
| Repositories | `repo list --json`, `repo show --repo id:<repoId> --json` | guide: `skill-guides/orca-cli.md` |
| Worktrees | `worktree list --repo id:<repoId> --json`, `worktree ps --json`, `worktree current --json`, `worktree show --worktree <selector> --json` | guide: `skill-guides/orca-cli.md` |
| Folder contexts | No listing command is documented in the sources read. Folder contexts appear as worktree parent keys such as `folder:<folderId>` for `--parent-worktree` | guide: `skill-guides/orca-cli.md` |
| Terminals | `terminal list --worktree id:<repoId>::<worktreePath> --json` | guide: `skill-guides/orca-cli.md` |
| Agent sessions | `search` runs full-text search over agent sessions indexed on one Orca host. `search --index-status --json` reports whether indexing is enabled. There is no all-computers search | guide: `skill-guides/orca-cli.md` |

A worktree address is the two-part id `<repoId>::<worktreePath>`. Copy the whole value into later commands, because a bare repo id names only the repository (guide: `skill-guides/orca-cli.md`).

---

## 5. ORCA.YAML WORKSPACE CONFIGURATION

`orca.yaml` is the workspace configuration file. Its `environmentRecipes` entries and the per-workspace lifecycle scripts under `scripts/orca-vm/` belong to the official `orca-per-workspace-env` skill. For any recipe work, load that skill and its version-matched guide instead of restating recipe flags here (research: research-official-skills.md §1.7).

One boundary matters for sessions. An `orca serve` line written inside a lifecycle script runs on the remote machine's own binary, so this session's executable-resolution rules do not apply inside those scripts (research: research-orca-cli-surface.md §3).

---

## 6. FULL HANDOFFS AND THE ORCHESTRATION BOUNDARY

A full handoff transfers ownership to another agent or worktree and stops the original agent. The handoff is done when three things are reported: the new worktree id, the receiving agent handle and the prompt's send receipt with `accepted: true`. Do not wait for the receiving agent to finish (guide: `skill-guides/orca-cli.md`).

A handoff is not supervised orchestration:

- `orca orchestration task-create` records coordinator-owned tracking state and is forbidden for full handoffs (guide: `skill-guides/orca-cli.md`).
- `orca orchestration dispatch --inject` and `orca orchestration check --wait` are likewise forbidden for full handoffs (guide: `skill-guides/orca-cli.md`).
- The official `orchestration` skill routes the handoff owner to `orca-cli` with no Run, Task or Dispatch and no completion monitoring (research: research-official-skills.md §1.8).
- Model or effort selection does not make a handoff supervised. Never substitute a non-Orca subagent tool when Orca-managed work was requested (research: research-official-skills.md §1.8).

Supervised orchestration is a different workflow. It may use task DAGs, dispatches, inboxes, replies or coordinator loops, and it applies only when the user explicitly asked for supervision (research: research-official-skills.md §1.8).

---

## 7. TERMINAL RECEIPTS AND LIVENESS

Terminal input has more than one state. A text-plus-Enter agent prompt returns a durable request id and additive stages: `input_accepted` first, then `turn_started` once the receiving agent's turn is proven (guide: `skill-guides/orca-cli.md`).

- `accepted: true` proves input acceptance, not a started turn. Use the receipt's `turn_started` stage when submission proof is needed.
- A default send observes for 0 seconds, so a receipt that stops at `input_accepted` is expected. Its warning means unproven, not failed.
- `--wait-submit <seconds>` only observes the same accepted prompt. A timeout returns queued, input-accepted truth without resending.
- Never resend on silence. After an ambiguous transport failure, repeat the exact command with the reported `--retry-request <id>`.
- An older host reports a legacy `old-host` fallback for an ordinary send and refuses `--wait-submit` or `--retry-request` before input, because it cannot provide durable replay (guide: `skill-guides/orca-cli.md`).

Waiting. Use `terminal wait --for tui-idle` with `--timeout-ms` to gate sends to agent CLIs. Send only when the result reports `wait.satisfied: true`. A timed-out wait still prints a normal result, so read `wait.satisfied` rather than the fact that something printed. On `satisfied: false`, re-run the wait once with a larger `--timeout-ms`. If it stays unsatisfied, report the work as not started and do not send (guide: `skill-guides/orca-cli.md`).

Confirmed shutdown. Close one known handle with `terminal close --terminal <handle>`. A bulk close with `terminal close --worktree <selector> --all` is successful only when the execution host confirms every PTY stopped. An `unverifiable` result means the host could not confirm every PTY. Preserve that status, do not report the processes as exited and do not retry against another host as a substitute for evidence. Use workspace Sleep when terminals and agent sessions should resume later. `terminal stop` is legacy plumbing and should not be used in new agent workflows (guide: `skill-guides/orca-cli.md`).

---

## 8. MCP BOUNDARY

The inspected 1.4.205 command registry exposed no Orca-native MCP command. The official documentation's separate MCP integration context is not a discovered CLI callable, server name, transport or schema. The surface therefore stays CLI only until a separate callable is verified (reference: `references/session-and-runtime.md`).

If a future version exposes a verified MCP surface, update the routing contract and this reference from that evidence rather than adding a speculative manual (routing contract: SKILL.md).

---

## 9. RELATED RESOURCES

| Document | Relationship |
|---|---|
| [`../SKILL.md`](../SKILL.md) | Routing contract and mutation boundary for this skill |
| [`orca-cli-reference.md`](./orca-cli-reference.md) | The commands whose selection and receipt rules this file constrains |
| [`mutation-and-browser-boundaries.md`](./mutation-and-browser-boundaries.md) | Authorization gates for the state-changing lanes above |
| [`troubleshooting.md`](./troubleshooting.md) | Recovery rows for selection and receipt failures |
