---
title: "Cursor CLI Unique Capabilities"
description: "Cursor CLI surfaces with no sibling analog: native git worktree isolation, the cloud worker, the plugin marketplace, and MCP client support."
trigger_phrases:
  - "cursor worktree"
  - "cursor cloud worker"
  - "cursor plugin marketplace"
  - "cursor mcp client"
  - "cursor unique surfaces"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Cursor CLI Unique Capabilities

Reference for the Cursor CLI surfaces that have **no analog** in `cli-codex`, `cli-claude-code`, or `cli-opencode`. Each is documented as an opt-in escape hatch — this packet's default dispatch (`SKILL.md` §3) never invokes any of them automatically.

---

## 1. OVERVIEW

### Core Principle

Cursor CLI ships several capabilities that go beyond "run a prompt against a model": native git worktree isolation, a private cloud execution worker, a plugin marketplace, and Cursor's own subagent/skill system. None of these change `cli-cursor`'s `packetKind: "workflow"` classification (see `030-cli-cursor-creation/003-cli-cursor-skill-packet/decision-record.md` ADR-001) — the packet's default dispatch still runs locally and writes land in this repo's checkout. These surfaces are documented here as deliberate, user-invoked escape hatches.

### When to Use

- The operator explicitly wants an experiment tried in an isolated checkout without touching the current workspace
- The operator explicitly wants Cursor to run agents in a remote/cloud environment rather than locally
- The operator wants to discover or manage Cursor plugins
- A task needs an MCP server Cursor is already configured to use

---

## 2. NATIVE GIT WORKTREE ISOLATION

### What It Is

`-w` / `--worktree [name]` starts `cursor-agent` in an isolated git worktree at `~/.cursor/worktrees/<reponame>/<name>`, rather than the current working directory. `--worktree-base <branch>` sets the base ref for the new worktree. `--skip-worktree-setup` skips any setup scripts declared in `.cursor/worktrees.json`.

### Why It's Out of Scope for Orchestrated Dispatch

This repo already manages its own numbered-worktree discipline via `sk-git` (owner-scoped branches, `.worktrees/{NNNN}-{owner}-{slug}` directories). A dispatched `cursor-agent` inside a deep-loop fan-out lineage already runs inside that lineage's own isolated directory — passing `-w` on top would create a SECOND, Cursor-native worktree nested inside or alongside the first, doubling isolation in a way the runtime does not expect and has not been built to reconcile. The deep-loop executor adapter (`buildCursorLineageCommand`, added in the executor-support phase of this creation packet) never passes `-w`.

### When an Operator Might Use It Directly

```bash
# Try a risky refactor in a disposable worktree, leaving the current checkout untouched
cursor-agent -p "Attempt an aggressive refactor of the auth module" \
  -w risky-refactor --model auto --auto-review --sandbox enabled

# Base the new worktree on a specific branch
cursor-agent -p "Prototype the new caching layer" \
  -w cache-prototype --worktree-base develop --model auto
```

This is a direct, interactive/manual operator action — not something an orchestrated fan-out or automated pipeline in this repo should invoke on its own.

---

## 3. CLOUD WORKER

### What It Is

`cursor-agent worker` runs a private cloud worker that connects to Cursor's infrastructure to run agents in the operator's own environment remotely. It is infra-grade remote execution: Kubernetes-style health probes (`GET /healthz`, `/readyz`), a Prometheus `/metrics` endpoint, pool vs. shared assignment (`--pool`/`--pool-name`), labels, and `--auth-token-file` for operator-managed secret mounts.

### Why It's Out of Scope for This Packet's Runtime Wiring

This is a fundamentally different execution shape than every other capability this packet dispatches — it stands up a long-running service, not a single bounded `-p` prompt/response round-trip. Wiring it into this repo's deep-loop runtime would mean building an entirely separate execution model (service lifecycle, health checks, secret mounts) that no sibling CLI needs and that the parent packet's spec explicitly scopes out. If a future need for genuinely remote, infra-grade Cursor execution arises, that is new scope for a dedicated future packet — not a repurposing of this one's `-p` dispatch adapter.

### When an Operator Might Use It Directly

```bash
# Start a worker (operator-run, not orchestrated by this packet)
cursor-agent worker --pool my-pool --auth-token-file ~/.cursor/worker-token
```

---

## 4. PLUGIN MARKETPLACE

### What It Is

`cursor-agent plugin marketplace` manages plugins and plugin marketplaces, stored under `~/.cursor/plugins/`. This is analogous to an editor extension system, not a per-dispatch flag — it changes what capabilities are available to `cursor-agent` sessions going forward, not the current dispatch alone.

### Relevance to Orchestrated Dispatch

Plugins are a shared, persistent, operator-controlled surface (like the shared editor config — see `shared-editor-config.md`). This packet's dispatch adapter does not install, enable, or disable plugins as part of a delegation; a dispatched session simply inherits whatever plugins are already installed. If a task specifically needs marketplace management, that is an explicit operator action, not something to embed in an automated dispatch prompt.

```bash
# Operator-run: discover and manage plugins directly
cursor-agent plugin marketplace
```

---

## 5. MCP CLIENT SUPPORT

### What It Is

`cursor-agent mcp` subcommands manage MCP server connections: `login <id>`, `list`, `list-tools <id>`, `enable <id>`, `disable <id>`. Configuration lives in `.cursor/mcp.json` (project scope) or `~/.cursor/mcp.json` (user scope) — the same files the Cursor editor reads (see `shared-editor-config.md`). `--approve-mcps` auto-approves all configured servers for a single dispatch, avoiding an interactive per-server prompt.

### Relevance to Orchestrated Dispatch

Cursor CLI is an MCP **client** only — it discovers and uses already-configured MCP servers. There is no documented mode of `cursor-agent` acting as an MCP server itself. When a dispatched task genuinely needs MCP tool access and the operator's `.cursor/mcp.json` already has the right servers configured, pass `--approve-mcps` to avoid blocking on an interactive approval the unattended dispatch can never answer:

```bash
cursor-agent -p "Use the configured GitHub MCP server to list open PRs" \
  --model auto --auto-review --sandbox enabled --approve-mcps
```

Without `--approve-mcps`, an unapproved MCP server prompt behaves like any other unattended approval — nothing can answer it, and the action stalls or is silently skipped depending on the approval mode in effect.

---

## 6. SUMMARY TABLE

| Surface | Flag/subcommand | Default in this packet's dispatch | Orchestrated fan-out use |
|---|---|---|---|
| Native worktree | `-w`/`--worktree` | Never passed | Not wired — would double-isolate against the runtime's own lineage directories |
| Cloud worker | `cursor-agent worker` | Never invoked | Out of scope — different execution shape entirely |
| Plugin marketplace | `cursor-agent plugin marketplace` | Never invoked | Operator-only, persistent/shared surface |
| MCP client | `cursor-agent mcp ...` / `--approve-mcps` | `--approve-mcps` passed when a task explicitly needs MCP tools | Supported, gated by explicit task need |
