---
title: "Orca-qualified routing vocabulary"
description: "Routes Orca CLI work only when a request carries an Orca-qualified multi-word signal, and defers every unqualified phrase to the skill that owns it."
trigger_phrases:
  - "orca-qualified routing vocabulary"
  - "cli-orca trigger signals"
  - "orca bare token routing"
  - "cli-orca negative holdouts"
version: 1.0.0.0
---

# Orca-qualified routing vocabulary (SKILL.md activation triggers)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The cli-orca skill activates only on a multi-word signal that qualifies a phrase with Orca or with an Orca-owned surface name. The bare token `orca` is deliberately absent from every signal, because it also matches the `OpenOrca` model family, the GNOME Orca screen reader on Linux and Orca app-internal strings, so an unqualified mention is never a routing decision.

---

## 2. HOW IT WORKS

The router pseudocode in SKILL.md starts with `signals = orca_qualified_phrases(request)` and defers when the signal set is empty, before any lane selection happens. Three signal classes carry the positive vocabulary.

Command-family phrases pair the Orca qualifier with a command surface: `orca cli`, `orca worktree`, `orca terminal`, `orca browser`, `orca automation`, `orca handoff`, `orca artifacts`, `orca skills`, `orca repository` and `orca embedded browser`. Workspace-shaped phrases describe the Orca form of a surface without the product name: `managed worktree`, `paired terminal`, `child worktree`, `$orca-cli` and `full ownership handoff`. Official skill names such as `orca-linear` or `orchestration` qualify a request when the request itself places them in Orca. The smart-routing lane table maps each command-family phrase to its lane reference, and the recovery phrases `runtime stopped`, `executable missing`, `guide mismatch` and `ambiguous result` route to troubleshooting.

The negative holdouts are the reason the vocabulary is multi-word. Generic git worktrees and branch management belong to `sk-git`, ordinary shell terminal commands to the normal coding workflow, Chrome DevTools Protocol debugging to `mcp-chrome-devtools`, generic agentic browser work to `mcp-aside-devtools`, supervised multi-agent coordination to the official `orchestration` skill, and an unrelated `OpenOrca` model label to no Orca route at all. Qualified siblings disambiguate the crowded token: `cursor worktree` routes to `cli-cursor` even though it shares the word worktree, and bare `handoff` or `full handoff` without an Orca qualifier routes to whatever continuity or dispatch context used it. Recorded replays pin both sides: the positive fixtures `orca cli` and `managed worktree` with `paired terminal` resolve to the Orca lane, while the negative fixtures for an `OpenOrca` model label and a generic git worktree defer.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-orca/SKILL.md` | Routing contract | Activation triggers, the smart-router pseudocode that defers on an empty signal set, the When NOT to Use holdout table and the NEVER rules against bare-token routing. |
| `.skilled/skills/cli-orca/graph-metadata.json` | Metadata projection | Declares the intent signals and derived trigger phrases, all multi-word and Orca-qualified, plus the domain tags that name the surfaces. |
| `.skilled/skills/cli-orca/leaf-manifest.json` | Metadata projection | Declares the leaf resources the routing contract loads per lane, including the official-skill snapshot assets. |
| `.skilled/skills/cli-orca/leaf-manifest.config.json` | Metadata projection | Configures which root directories the manifest generation covers, keeping the changelog and benchmark trees outside the routing targets. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Test harness | The advisor surface the routing vocabulary must satisfy, used by skill routing when a request resolves to a skill identity. |
| `specs/cli-orca/001-mcp-orca-cli/benchmark/reports/orca-integration/2026-09-19--orca-integration/routing-results.json` | Reference | Recorded positive and negative routing replays, including the OpenOrca deferral and the generic-git-worktree deferral. |
| `specs/cli-orca/001-mcp-orca-cli/benchmark/reports/hub-routing-archived/orca-worktree-terminal.md` | Reference | Replay fixture pinning the Orca worktree and terminal phrases to the Orca lane and away from generic owners. |
| `specs/cli-orca/001-mcp-orca-cli/benchmark/reports/hub-routing-archived/holdout-managed-workspace.md` | Reference | Blind holdout pinning `managed worktree` and `paired terminal` as the narrow binding exceptions that route without naming Orca. |
| `specs/cli-orca/002-consolidate-official-orca-skills/scratch/research-routing-boundaries.md` | Reference | Vocabulary research grounding each phrase's specificity judgment and the bare-token capture risk. |

---

## 4. SOURCE METADATA

- Group: Routing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `routing/orca-qualified-vocabulary.md`

Related references:
- [feature-catalog.md](../feature-catalog.md): the package index linking this leaf
- [../../references/orca-cli-reference.md](../../references/orca-cli-reference.md): the command families the positive signals name
