---
title: cli-orca
description: Package index for the cli-orca skill: routes Orca-managed worktrees, terminals, the embedded browser, automations, artifacts, handoffs and the eight official Orca skills, and defers generic worktree, browser and orchestration vocabulary to its sibling owners.
trigger_phrases:
  - "cli-orca readme"
  - "orca cli skill index"
  - "official orca skills package"
importance_tier: normal
contextType: general
version: 0.1.0.0
---

# cli-orca

Route Orca-managed work and the eight official Orca skills through one standalone skill, and keep the version-sensitive flags in the guide the running Orca binary serves.

## At a glance

| Field | Value |
|-------|-------|
| Kind | Standalone skill (class S) |
| Routes on | Orca-qualified multi-word phrases (`orca worktree`, `orca terminal`, `orca embedded browser`) and the official skill names in an Orca context |
| Entry point | [SKILL.md](SKILL.md) |
| Defers | Generic worktrees to `sk-git`, CDP work to `mcp-chrome-devtools`, generic agentic browser work to `mcp-aside-devtools`, supervised coordination to the official `orchestration` skill |
| Package root | `.skilled/skills/cli-orca/` |

---

## 1. OVERVIEW

cli-orca owns routing for Orca-managed work: worktrees and repository state, paired terminals, the embedded browser, automations, artifacts, comments, skill sharing and full ownership handoffs. It also carries official-skill awareness, so a request that names one of the eight official Orca skills in an Orca context finds a local entry point instead of falling through.

The installed Orca runtime is versioned, so the skill keeps command detail out of its own documents. It resolves one executable, loads the version-matched `orca-cli` guide from the binary and treats its local references as routing and boundary knowledge, never as a frozen command reference.

What it deliberately does not own: generic Git worktrees and branch work stay with `sk-git`. Chrome or Chromium CDP debugging stays with `mcp-chrome-devtools`, and generic agentic browser work stays with `mcp-aside-devtools`. Supervised multi-agent coordination stays with the official `orchestration` skill, while cli-orca keeps the lightweight terminal prompts and full handoffs. Ordinary shell commands with no Orca terminal involved belong to the normal coding workflow, where no skill owns them.

---

## 2. WHAT IS IN THE PACKAGE

The package is organized around the four leaf roots declared in `leaf-manifest.config.json`: `references`, `assets`, `feature-catalog` and `manual-testing-playbook`. The changelog tree sits outside the leaf roots on purpose, because it records history rather than a routing target.

- **Routing contract** -- `SKILL.md` holds the lane table, the phase workflow, the rules and the escalation taxonomy. `graph-metadata.json` carries the advisor identity for the root, and `leaf-manifest.json` with its derived projection `leaf-aliases.json` declares the leaves the metadata gate emits.
- **Reference corpus** -- the four CLI references named by the SKILL.md reference table: `orca-cli-reference.md`, `session-and-runtime.md`, `mutation-and-browser-boundaries.md` and `troubleshooting.md`.
- **Official skills layer** -- `references/orca-skills/overview.md` with the boundary matrix and install commands, one authored reference per official skill and the flat `assets/<name>.txt` snapshots.
- **Feature catalog** -- `feature-catalog/feature-catalog.md` inventories the features behind this router.
- **Manual testing playbook** -- `manual-testing-playbook/manual-testing-playbook.md` holds the live safety matrix and the routing fixtures, including the negative holdouts.
- **Provenance asset** -- `assets/PROVENANCE.md` records the snapshot source, the per-skill release revisions and digests, as well as the refresh procedure.

---

## 3. ROUTING

**Positive signals** are the Orca-qualified multi-word phrases: `orca cli`, `orca worktree`, `orca terminal`, `orca browser`, `orca automation`, `orca handoff`, `orca artifacts`, `orca skills`, `orca repository` and `orca embedded browser`. Compound surfaces qualify too: `managed worktree`, `paired terminal`, `child worktree`, `$orca-cli` and `full ownership handoff`. The official skill names (`computer-use`, `linear-tickets`, `orca-cli`, `orca-emulator`, `orca-emulator-android`, `orca-linear`, `orca-per-workspace-env` and `orchestration`) route when the request places them in Orca.

**The bare token warning**: a bare `orca` mention is never sufficient. The same token matches the `OpenOrca` model label, the GNOME Orca screen reader on Linux and Orca app-internal strings, so routing needs an Orca-qualified phrase or a named Orca surface.

**Negative holdouts** are the requests that look adjacent but belong elsewhere: generic worktree and branch work (`sk-git`), ordinary shell terminals (the normal coding workflow), Chrome or Chromium CDP work (`mcp-chrome-devtools`), generic agentic browser work (`mcp-aside-devtools`) and supervised multi-agent coordination (the official `orchestration` skill). An unrelated `OpenOrca` model label gets no Orca route at all. The manual testing playbook records these as fixtures.

Two collisions are worth keeping straight. `orca-linear` and `linear-tickets` are skill names, not CLI namespaces, and every command still runs as `orca linear`. The local `cli-external-orchestration` hub dispatches external CLI executors, which is a different thing from the official `orchestration` skill that coordinates supervised Orca workers.

---

## 4. VERIFICATION

The local gates that govern this package:

- **Root metadata gate** -- `ci-skill-root-metadata.cjs` checks class-S conformance and the freshness of the generated metadata, then regenerates the leaf manifest and aliases with `--fix`.
- **Document validator** -- `validate_document.py` per authored document checks template and prose conformance.
- **Package validator** -- `validate_skill_package.py` checks the package shape and its required documents.
- **Parent check on the hub** -- after the extraction, `parent-skill-check.cjs` on `mcp-tooling` is the gate that proves the hub holds nine aligned modes.

The advisor and compiled-route replays belong to the migration packet that owns them. This README and the release note were authored in the same change as the rest of the package, so nothing on this page claims a gate result of its own.
