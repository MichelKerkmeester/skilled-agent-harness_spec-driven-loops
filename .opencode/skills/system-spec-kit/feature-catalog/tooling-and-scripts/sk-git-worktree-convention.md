---
title: "sk-git numbered worktree convention (wt/{NNNN}-{name})"
description: "The sk-git skill owns the numbered worktree convention: feature worktrees use a wt/{NNNN}-{name} branch under a .worktrees/{NNNN}-{name} directory, where {NNNN} is a 4-digit zero-padded global max+1 counter. Cross-reference to the sk-git skill, which owns the full mechanics."
trigger_phrases:
  - "sk-git worktree convention"
  - "wt/{NNNN}-{name} numbered worktree"
  - ".worktrees directory naming"
  - "numbered worktree branch convention"
  - "git worktree counter max plus one"
version: 3.6.0.2
---

# sk-git numbered worktree convention (wt/{NNNN}-{name})

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Spec-folder work and CLI-dispatched code work often run inside a Git worktree so the live tree is never edited directly. The `sk-git` skill owns all git/version-control intent, including the naming convention for those worktrees. This catalog entry records the convention so it is discoverable from the feature inventory and cross-references the `sk-git` skill, which owns the full create/restructure mechanics. The convention is referenced by the orchestrator dispatch contracts (for example, the checkpoint-v2 packet's per-phase cli-opencode dispatch ran inside a fresh worktree).

---

## 2. HOW IT WORKS

### Branch and directory naming

A feature worktree uses a branch named `wt/{NNNN}-{name}` checked out into a directory named `.worktrees/{NNNN}-{name}`:

- `{NNNN}` is a 4-digit zero-padded global counter computed as `max(existing NNNN under .worktrees/) + 1`; the first worktree is `0001`.
- `{name}` is a short kebab-case description (for example `wt/0001-add-oauth`, `wt/0002-login-bug`).
- The `wt/` branch prefix groups every feature-worktree branch under one folder in Git UIs.

### Relationship to ephemeral launch-wrapper worktrees

This numbered convention is distinct from the launch wrapper's ephemeral per-session worktrees, which use `work/{runtime}/{slug}` plus `.worktrees/{runtime}-{slug}`. Those are auto-managed, auto-reaped, and intentionally not numbered. The numbered `wt/{NNNN}-{name}` namespace is for deliberate feature worktrees.

### Ownership

`sk-git` owns worktree create, restructure, branch, conventional commits, PR, merge, rebase, and finish-work flows. The full mechanics (counter computation, restructure of legacy worktrees, node_modules symlink gotchas for the MCP server worktrees) live in the skill, not duplicated here, so this catalog entry stays a stable cross-reference rather than a fork that can drift.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `.opencode/skills/sk-git/SKILL.md` | Owns the numbered worktree convention (`wt/{NNNN}-{name}` branch, `.worktrees/{NNNN}-{name}` dir, 4-digit global max+1 counter) and all git-workflow mechanics |
| `.opencode/skills/sk-git/references/` | Per-flow worktree create / restructure / finish references |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-git/SKILL.md` | Reference | Convention is verified by the skill's own routing and checklist sections rather than a code test in this server |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/sk-git-worktree-convention.md`
Related references:
- [orphan-mcp-sweeper-and-launchagent-template.md](../../feature-catalog/tooling-and-scripts/orphan-mcp-sweeper-and-launchagent-template.md) — Orphan MCP sweeper and LaunchAgent template
