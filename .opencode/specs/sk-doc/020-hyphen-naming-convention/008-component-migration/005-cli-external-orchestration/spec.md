---
title: "Feature Specification: cli-external-orchestration component migration (032 phase 005)"
description: "Phase parent for the kebab-case migration of the cli-external-orchestration hub, its three CLI workflow components, manual-testing-playbook trees, benchmark boundary, release evidence, and final subtree gate. Children keep ownership and verification independent."
trigger_phrases:
  - "cli-external-orchestration kebab-case migration"
  - "cli external orchestration naming phases"
  - "external CLI surface hyphen naming"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored cli-external phase map"
    next_safe_action: "Execute the selected child phase"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/hub-router.json"
      - ".opencode/skills/cli-external-orchestration/mode-registry.json"
    completion_pct: 0
    open_questions:
      - "The release version for phase 007 is an execution-time value."
    answered_questions:
      - "This authoring pass changes only the assigned child documentation and removes scaffold artifacts."
      - "Python scripts and package directories, tool-mandated names, generated output, and frozen history remain exempt."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + child phase map only; detailed plans, tasks, checklists, and decisions live in the children. -->

# Feature Specification: cli-external-orchestration component migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Parent Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration |
| **Child Count** | 8 |
| **Handoff Criteria** | All child scopes, path maps, and blocking checklist contracts are authored |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The cli-external-orchestration surface contains authored snake_case names in component references/assets and across four manual-testing-playbook trees. Its hub also carries exact routing files and a currently empty benchmark boundary, so a broad filesystem sweep would risk changing tool contracts or claiming paths owned by another child phase.

This parent defines eight independently reviewable phases that migrate only in-scope filesystem names to kebab-case, preserve the 032 exemption boundary, verify release evidence, and close with a read-only subtree gate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hub-root and optional `shared/` boundary under `.opencode/skills/cli-external-orchestration/`.
- The non-playbook, non-benchmark authored paths in `cli-opencode/`, `cli-claude-code/`, and `cli-codex/`.
- The root and component `manual_testing_playbook/` trees, including category directories and scenario filenames.
- The root `benchmark/` census for authored fixtures, profiles, storage guides, and generated-output dispositions.
- Changelog/version evidence and a final scope-aware naming gate for the complete skill surface.

### Out of Scope
- Python `.py` files and Python import-package directories.
- `SKILL.md`, `mode-registry.json`, package manifests, metadata contracts, and other tool-mandated names.
- Code identifiers, JSON/YAML/TOML keys, frontmatter fields, database columns, generated output, and frozen history.
- Executing this migration during documentation authoring.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-hub-root-and-shared/` | Census the hub root and absent `shared/` boundary; protect exact routing names and delegate playbook/benchmark roots | Planned |
| 002 | `002-cli-opencode/` | Rename OpenCode references/assets and update their path-valued consumers; leave playbook/benchmark ownership separate | Planned |
| 003 | `003-cli-claude-code/` | Rename Claude Code references/assets and resolve active links within the component | Planned |
| 004 | `004-cli-codex/` | Rename Codex references/assets and resolve active links within the component | Planned |
| 005 | `005-manual-testing-playbook/` | Rename the root, OpenCode, Claude Code, and Codex playbook trees and their path references | Planned |
| 006 | `006-benchmark/` | Census benchmark artifacts, rename authored candidates if present, and classify generated output | Planned |
| 007 | `007-changelog-verify/` | Verify rename-set changelog coverage and coherent version evidence without renaming | Planned |
| 008 | `008-skill-gate/` | Aggregate child evidence and prove the full surface is kebab-clean within the exemption boundary | Planned |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

The release version and exact new changelog filenames are execution-time values for phase 007; they must be recorded from the candidate and not inferred from the current root metadata/history mismatch.
<!-- /ANCHOR:questions -->

