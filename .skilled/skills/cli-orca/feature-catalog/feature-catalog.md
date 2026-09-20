---
title: "cli-orca: Feature Catalog"
description: "Current-state inventory of Orca-qualified routing, executable preflight, mutation boundaries and the official Orca skill layer for the cli-orca skill."
trigger_phrases:
  - "cli-orca feature catalog"
  - "cli-orca routing vocabulary"
  - "orca executable resolution"
  - "cli-orca safety boundaries"
  - "official orca skill layer"
last_updated: "2026-09-20"
version: 1.0.0.0
---

# cli-orca: Feature Catalog

This document is the current feature inventory for the `cli-orca` skill, a standalone router for Orca CLI work. Each entry links to a per-feature reference under `feature-catalog/`.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for the `cli-orca` routing skill. The skill routes Orca-managed worktrees, paired terminals, the embedded browser, automations, artifacts, handoffs and the eight official Orca skills, and keeps only the routing contract, the boundaries and the safety envelope local while the installed binary serves the version-matched guide.

---

## 2. ROUTING

### Orca-qualified routing vocabulary

#### Description

Routes Orca CLI work only when a request carries an Orca-qualified multi-word signal, and defers every unqualified phrase to the skill that owns it.

#### Current Reality

Activation triggers carry three signal classes. Command-family phrases pair the Orca qualifier with a surface: `orca cli`, `orca worktree`, `orca terminal`, `orca browser`, `orca automation`, `orca handoff`, `orca artifacts`, `orca skills`, `orca repository` and `orca embedded browser`. Workspace-shaped phrases carry the Orca form without the product name: `managed worktree`, `paired terminal`, `child worktree`, `$orca-cli` and `full ownership handoff`. Official skill names qualify a request when it places them in Orca. A bare `orca` mention is never sufficient, because the token also matches the `OpenOrca` model label, the GNOME Orca screen reader on Linux and Orca app-internal strings, so the router pseudocode defers when no qualified signal is present. The When NOT to Use table holds the negative holdouts: generic git worktrees belong to `sk-git`, Chrome DevTools Protocol work to `mcp-chrome-devtools`, generic agentic browser work to `mcp-aside-devtools`, supervised multi-agent coordination to the official `orchestration` skill, and an unrelated `OpenOrca` model label to no Orca route at all. Recorded replays confirm the split on both sides, and the archived blind holdout pins `managed worktree` and `paired terminal` as the narrow binding exceptions that route without naming Orca.

The routing vocabulary and the ownership split are stated canonically in [SKILL.md](../SKILL.md); this section summarizes them for feature discovery.

#### Source Files

See [`routing/orca-qualified-vocabulary.md`](routing/orca-qualified-vocabulary.md) for the signal inventory, the bare-token exclusion and the holdout set.

---

## 3. RUNTIME

### Executable resolution and versioned preflight

#### Description

Resolves exactly one Orca executable per session and captures version evidence before any version-sensitive command runs.

#### Current Reality

The resolution order is `ORCA_CLI_COMMAND` when it is set, then `orca-dev` from a development checkout that exposes `ORCA_DEV_REPO_ROOT`, then `orca-ide` on Linux outside an Orca-managed terminal, then `orca` otherwise. On Linux the bare name normally resolves to the GNOME Orca screen reader, which is why the order matters. The preflight captures `command -v`, `--version`, `--help`, `agent-context --json` and the version-matched guide through `orca skills get <name> --full`, where `agent-context --json` is a local command-registry read that is safe in headless contexts. The guide matched to the running binary is the only flag authority: a capability the installed guide does not establish is reported as unknown, and the Orca version and guide command back every flag claim. The session never falls through to another executable after a failure, because a fallthrough could silently target a different Orca build.

#### Source Files

See [`runtime/preflight-and-resolution.md`](runtime/preflight-and-resolution.md) for the resolution order, the preflight commands and the guide-authority rule.

---

## 4. SAFETY

### Mutation and ownership boundaries

#### Description

Separates read-only discovery from state-changing Orca operations and keeps sibling owners in charge of the surfaces cli-orca does not own.

#### Current Reality

Worktree create, set or remove, terminal send or close, agent launch or handoff, automation changes, browser navigation and publishing are treated as state-changing until the live guide and the requested operation prove otherwise, and mutating or destructive work requires explicit authorization. A worktree removal whose archive hook fails stays blocked, and a force flag does not bypass the failure. Read-only discovery stays free: listings, shows, reads, snapshots, `--help` and `agent-context --json`. On ownership, `sk-git` keeps generic worktree, branch and commit work, `mcp-chrome-devtools` keeps Chrome and CDP inspection, `mcp-aside-devtools` keeps generic agentic browser work, and the official `orchestration` skill keeps supervised multi-agent coordination.

#### Source Files

See [`safety/mutation-and-ownership-boundaries.md`](safety/mutation-and-ownership-boundaries.md) for the mutation list, the authorization gates and the sibling ownership split.

---

## 5. OFFICIAL SKILLS

### The official Orca skill layer

#### Description

Explains and loads the eight official Orca skills as discovery stubs that defer their flags to the running binary.

#### Current Reality

The official set is `computer-use`, `linear-tickets`, `orca-cli`, `orca-emulator`, `orca-emulator-android`, `orca-linear`, `orca-per-workspace-env` and `orchestration`. Each stub tells an agent when to engage Orca and how to load the version-matched guide from the CLI, because the real flags live in the binary. Two collisions stay explicit. `orca-linear` and `linear-tickets` are skill names rather than CLI namespaces, and every command still runs as `orca linear`. The local `cli-external-orchestration` hub is a different thing from the official `orchestration` skill: the hub dispatches external CLI executors while the official skill coordinates supervised Orca workers. The verbatim upstream wording of each stub is snapshotted as `assets/<name>.txt` with provenance in [`../assets/PROVENANCE.md`](../assets/PROVENANCE.md).

#### Source Files

See [`orca-skills/official-skill-layer.md`](orca-skills/official-skill-layer.md) for the stub-per-skill layout, the boundary matrix and the snapshot provenance.
