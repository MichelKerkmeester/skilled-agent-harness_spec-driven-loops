---
title: "Feature Specification: sk-code component migration (020 phase 008)"
description: "The sk-code family contains a hub, shared evidence, workflow modes, surface packets, playbook scenarios, and benchmark storage whose filesystem names still use snake_case. This phase defines nine independently verifiable child contracts that migrate that surface to kebab-case while preserving tool-mandated names and the program exemption boundary."
trigger_phrases:
  - "sk-code component migration"
  - "kebab-case sk-code surface"
  - "hyphenate sk-code resources"
  - "sk-code naming phases"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored sk-code phase map"
    next_safe_action: "Execute a selected sk-code child against the frozen rename map"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/SKILL.md"
      - ".opencode/skills/sk-code/mode-registry.json"
      - ".opencode/skills/sk-code/hub-router.json"
      - ".opencode/skills/sk-code/shared/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Kebab-case is the canonical filesystem-name form for the sk-code surface."
      - "Python scripts, Python import-package directories, generated output, tool-mandated names, and frozen history remain exempt."
      - "Each child owns one sk-code component or the final subtree gate and must carry its reference closure."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + child phase map only; detailed mechanics live in the children. -->

# Feature Specification: sk-code component migration
> Phase adjacency — successor `002-sk-design`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration |
| **Predecessor** | 007-shared-and-cross-cutting-closures |
| **Successor** | 009-remove-transition-aliases |
| **Handoff Criteria** | Every child has a concrete rename/reference scope and a blocking evidence contract for the subtree gate. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-code surface is a nested family rather than one flat directory: a routing hub, shared references and assets, two workflow modes, two read-only surface packets, a root manual-testing playbook, and benchmark storage all participate in path resolution. The live tree still contains snake_case directories and files such as shared/references/workflow_implement.md, code-review/manual_testing_playbook/, and benchmark/live_mode_b/.

### Purpose

Define one child contract per sk-code component so the migration can rename in-scope filesystem names and repair every path reference as dependency-closed work, with one final child proving the whole subtree is kebab-clean under the 020 exemptions.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | 001-hub-root-and-shared/ | Rename the hub's shared assets and references; preserve exact hub/tool names and shared symlink semantics. | Planned |
| 002 | 002-code-opencode/ | Rename OpenCode evidence resources, manual-playbook resources, benchmark labels, and their references; preserve Python files and package directories. | Planned |
| 003 | 003-code-quality/ | Rename quality-mode assets, playbook resources, and benchmark labels; update quality-mode path consumers. | Planned |
| 004 | 004-code-review/ | Rename review-mode assets, playbook resources, benchmark labels, and reference documents; preserve review behavior. | Planned |
| 005 | 005-code-webflow/ | Rename Webflow assets, references, playbook resources, benchmark labels, and symlink consumers; preserve browser/runtime semantics. | Planned |
| 006 | 006-manual-testing-playbook/ | Rename the hub-level playbook root, category directories, and scenario files; repair scenario and cross-surface links. | Planned |
| 007 | 007-benchmark/ | Rename tracked benchmark fixture/profile/storage directories and update benchmark command and report paths. | Planned |
| 008 | 008-changelog-verify/ | Confirm the sk-code changelog records the complete rename set and an internally consistent version bump. | Planned |
| 009 | 009-skill-gate/ | Aggregate sibling evidence and prove no in-scope snake_case filesystem name remains in the sk-code subtree. | Planned |
<!-- /ANCHOR:phase-map -->
