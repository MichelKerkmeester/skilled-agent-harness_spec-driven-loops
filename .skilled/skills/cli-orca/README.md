---
title: cli-orca
description: "Package index for the cli-orca skill: routes Orca-managed worktrees, terminals, the embedded browser, automations, artifacts, handoffs and the eight official Orca skills, and defers generic worktree, browser and orchestration vocabulary to its sibling owners."
trigger_phrases:
  - "cli-orca readme"
  - "orca cli skill index"
  - "official orca skills package"
importance_tier: normal
contextType: general
version: 0.1.8.0
---

# cli-orca

> Route Orca-managed work and the eight official Orca skills through one standalone skill, and keep the version-sensitive flags in the guide the running Orca binary serves.

## 1. OVERVIEW

### At a Glance

| Field | Value |
|-------|-------|
| Kind | Standalone skill (class S) |
| Routes on | Orca-qualified multi-word phrases (`orca worktree`, `orca terminal`, `orca embedded browser`) and the official skill names in an Orca context |
| Entry point | [SKILL.md](SKILL.md) |
| Defers | Generic worktrees to `sk-git`, CDP work to `mcp-chrome-devtools`, generic agentic browser work to `mcp-aside-devtools`, supervised coordination to the official `orchestration` skill |
| Package root | `.skilled/skills/cli-orca/` |

### Purpose

cli-orca owns routing for Orca-managed work: worktrees and repository state, paired terminals, the embedded browser, automations, artifacts, comments, skill sharing and full ownership handoffs. It also carries official-skill awareness, so a request that names one of the eight official Orca skills in an Orca context finds a local entry point instead of falling through.

### When to Use

Use this package when a request names an Orca-qualified surface or one of the eight official Orca skills in an Orca context.

### Core Principle

The installed Orca runtime is versioned, so the skill keeps command detail out of its own documents. It resolves one executable, loads the version-matched `orca-cli` guide from the binary and treats its local references as routing and boundary knowledge, never as a frozen command reference.

### Boundaries

What it deliberately does not own:

- Generic Git worktrees and branch work stay with `sk-git`.
- Chrome or Chromium CDP debugging stays with `mcp-chrome-devtools`, and generic agentic browser work stays with `mcp-aside-devtools`.
- Supervised multi-agent coordination stays with the official `orchestration` skill, while cli-orca keeps the lightweight terminal prompts and full handoffs.
- Ordinary shell commands with no Orca terminal involved belong to the normal coding workflow, where no skill owns them.

---

## 2. WHAT IS IN THE PACKAGE

The package is organized around the four leaf roots declared in `leaf-manifest.config.json`: `references`, `assets`, `feature-catalog` and `manual-testing-playbook`. The changelog tree sits outside the leaf roots on purpose, because it records history rather than a routing target. The tree holds one `v<version>.md` file per release, from `v0.1.0.0.md` on.

- **Skill workflow** -- `SKILL.md` holds the operating workflow, the rules and the escalation taxonomy. `graph-metadata.json` carries the advisor identity for the root, and `leaf-manifest.json` with its derived projection `leaf-aliases.json` declares the leaves the metadata gate emits.
- **Machine router** -- [`ROUTER.md`](ROUTER.md#3-machine-router) holds the intent map, resource map and loading levels for this skill.
- **Reference corpus** -- the four CLI references named by the SKILL.md reference table: `orca-cli-reference.md`, `session-and-runtime.md`, `mutation-and-browser-boundaries.md` and `troubleshooting.md`.
- **Official skills layer** -- `references/orca-skills/overview.md` with the boundary matrix and install commands, one authored reference per official skill and the flat `assets/<name>.txt` snapshots.
- **Feature catalog** -- `feature-catalog/feature-catalog.md` inventories the features behind this router. The per-area detail lives in `feature-catalog/orca-skills/official-skill-layer.md`, `feature-catalog/routing/orca-qualified-vocabulary.md`, `feature-catalog/runtime/preflight-and-resolution.md` and `feature-catalog/safety/mutation-and-ownership-boundaries.md`.
- **Manual testing playbook** -- `manual-testing-playbook/manual-testing-playbook.md` holds the live safety matrix and the routing fixtures, including the negative holdouts. The individual checks are `manual-testing-playbook/handoffs/hub-deferral-receipt.md`, `manual-testing-playbook/ownership/embedded-browser-boundary.md`, `manual-testing-playbook/ownership/official-skill-handoff.md`, `manual-testing-playbook/routing/negative-holdouts.md`, `manual-testing-playbook/routing/orca-positive-route.md`, `manual-testing-playbook/runtime/ambiguous-send-recovery.md`, `manual-testing-playbook/runtime/preflight-executable-resolution.md` and `manual-testing-playbook/runtime/runtime-stopped-recovery.md`.
- **Provenance asset** -- `assets/PROVENANCE.md` records the snapshot source, the per-skill release revisions and digests, as well as the refresh procedure.
- **Benchmark evidence** -- `benchmark/reports/` holds the extraction-routing and playbook-post-remediation reports, with `routing-replays.json` and `playbook-verdicts.json` beside them.

---

## 3. ROUTING

**The bare token warning**: a bare `orca` mention is never sufficient. The same token matches the `OpenOrca` model label, the GNOME Orca screen reader on Linux and Orca app-internal strings, so routing needs an Orca-qualified phrase or a named Orca surface.

**Positive signals** are the Orca-qualified multi-word phrases: `orca cli`, `orca worktree`, `orca terminal`, `orca browser`, `orca automation`, `orca handoff`, `orca artifacts`, `orca skills`, `orca repository` and `orca embedded browser`. Compound surfaces qualify too: `managed worktree`, `paired terminal`, `child worktree`, `$orca-cli` and `full ownership handoff`. The official skill names (`computer-use`, `linear-tickets`, `orca-cli`, `orca-emulator`, `orca-emulator-android`, `orca-linear`, `orca-per-workspace-env` and `orchestration`) route when the request places them in Orca.

**Negative holdouts** are the requests that look adjacent but belong elsewhere: generic worktree and branch work (`sk-git`), ordinary shell terminals (the normal coding workflow), Chrome or Chromium CDP work (`mcp-chrome-devtools`), generic agentic browser work (`mcp-aside-devtools`) and supervised multi-agent coordination (the official `orchestration` skill). An unrelated `OpenOrca` model label gets no Orca route at all. The manual testing playbook records these as fixtures.

The routing vocabulary and the ownership matrix are stated canonically in [SKILL.md](SKILL.md); the summaries on this page orient the reader and never override it.

Two collisions are worth keeping straight:

- `orca-linear` and `linear-tickets` are skill names, not CLI namespaces, and every command still runs as `orca linear`.
- The local `cli-external-orchestration` hub dispatches external CLI executors, which is a different thing from the official `orchestration` skill that coordinates supervised Orca workers.

---

## 4. VERIFICATION

The local gates that govern this package:

- **Root metadata gate** -- `ci-skill-root-metadata.cjs` checks class-S conformance and the freshness of the generated metadata, then regenerates the leaf manifest and aliases with `--fix`.
- **Document validator** -- `validate_document.py` per authored document checks template and prose conformance.
- **Package validator** -- `validate_skill_package.py` checks the package shape and its required documents.
- **Parent check on the hub** -- `parent-skill-check.cjs` on `mcp-tooling` is the gate that proves the hub holds eight aligned modes.

The advisor and compiled-route replays belong to the migration packet that owns them. This README and the release note were authored in the same change as the rest of the package, so nothing on this page claims a gate result of its own.
