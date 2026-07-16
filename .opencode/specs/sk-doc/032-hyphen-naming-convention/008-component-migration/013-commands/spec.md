---
title: "Feature Specification: commands component migration (032 phase 008/013)"
description: "The .opencode/commands surface contains namespaced command assets and loose root commands with filesystem names that do not consistently use kebab-case. This phase parent defines independent child contracts for each command namespace, loose command IDs, the shared asset closure, and the final commands-surface gate while preserving command IDs, tool-mandated names, Python files, generated output, and data keys."
trigger_phrases:
  - "commands component migration"
  - "kebab-case commands surface"
  - "hyphenate OpenCode command assets"
  - "commands subtree naming gate"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored commands phase map"
    next_safe_action: "Execute a selected commands child against the frozen rename map"
    blockers: []
    key_files:
      - ".opencode/commands/"
      - ".opencode/commands/README.txt"
      - ".opencode/commands/scripts/validate-command-references.cjs"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Kebab-case is the canonical filesystem-name form for in-scope command names and assets."
      - "Command IDs, tool-mandated names, Python files, generated output, and data keys remain exact."
      - "Each child owns one command namespace or loose surface; the final child owns only subtree evidence."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + child phase map only; detailed mechanics live in the children. -->

# Feature Specification: Commands component migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration |
| **Predecessor** | 012-sk-git |
| **Successor** | 014-agents |
| **Handoff Criteria** | Every child has a concrete commands-surface scope and a blocking evidence contract for the subtree gate. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `.opencode/commands/` surface combines seven namespaced command families, two loose root command files, shared command tooling, and asset trees. The live tree contains snake_case asset basenames such as `create_feature_catalog_auto.yaml`, `deep_ai-council_auto.yaml`, `doctor_mcp_debug.yaml`, `learn_presentation.txt`, `speckit_complete_auto.yaml`, and the loose files `agent_router.md` and `goal_opencode.md`.

### Purpose

Define one independently executable child contract per commands surface so in-scope filesystem names become kebab-case, every path and link reference follows its owner, exact command IDs and tool contracts remain stable, and the final child can prove the subtree is clean under the 032 exemption boundary.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | 001-create-namespace/ | Rename the `create` command asset files and repair command, README, and workflow pointers; preserve command IDs, YAML keys, and tool names. | Planned |
| 002 | 002-deep-namespace/ | Rename maintained `deep` command assets and legacy bodies; keep generated compiled contracts exempt and regenerate their path digests after maintained sources move. | Planned |
| 003 | 003-design-namespace/ | Rename the `design` command asset files and update every presentation/workflow pointer without changing design command IDs or configuration keys. | Planned |
| 004 | 004-doctor-namespace/ | Rename maintained `doctor` asset files and repair `_routes.yaml` targets while preserving the route manifest name and Python script exemption. | Planned |
| 005 | 005-memory-namespace/ | Rename the `memory` presentation assets and repair the memory command documentation and workflow links. | Planned |
| 006 | 006-scripts-namespace/ | Audit the command helper/fixture namespace, close any frozen-map residue, and prove its already-kebab helper files and directories remain reference-clean. | Planned |
| 007 | 007-speckit-namespace/ | Rename the `speckit` command asset files and update README, command, and workflow pointers while preserving `/speckit:*` IDs. | Planned |
| 008 | 008-loose-command-ids/ | Classify and handle the root `agent_router.md` and `goal_opencode.md` names, preserving exact public/tool command IDs where required and updating all consumers. | Planned |
| 009 | 009-command-assets/ | Reconcile every remaining command reference/asset/template filename and cross-namespace pointer against the sibling maps; no duplicate ownership or unresolved old path remains. | Planned |
| 010 | 010-commands-gate/ | Aggregate sibling evidence and prove the complete `.opencode/commands` naming surface is kebab-clean outside the program exemption set. | Planned |
<!-- /ANCHOR:phase-map -->
