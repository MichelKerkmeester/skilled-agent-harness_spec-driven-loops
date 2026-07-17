---
title: "Feature Specification: create-generators-and-templates (017 phase 003)"
description: "The create-* generator families and their templates can still emit underscore filesystem names. This phase defines four parallel child contracts that make generated output kebab-case while preserving Python, package-directory, and tool-mandated-name exemptions."
trigger_phrases:
  - "create generators and templates naming"
  - "hyphen naming phase 003"
  - "kebab-case generator output"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/003-create-generators-and-templates"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Restructured the generator phase into four parallel Level 2 child contracts"
    next_safe_action: "Execute the selected child generator phase on the pinned worktree"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Create-* Generators and Templates

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/003-create-generators-and-templates |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Branch** | `sk-doc/0042-017-authoring` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-doc/019-hyphen-naming-convention |
| **Predecessor** | 002-root-name-consumer-migration |
| **Successor** | 004-no-new-snake-guard |
| **Handoff Criteria** | Each child proves that its generator family emits only policy-compliant filesystem names in a temporary output tree. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The create-* families are the repo's forward path for new skills, catalogs, playbooks, documents, commands, and benchmark artifacts. If their emitted directories or filenames retain snake_case, every new artifact reintroduces debt even after the consumers and guard speak kebab-case.

This phase makes emitted filesystem names kebab-case across four independent generator families. The policy boundary remains unchanged: Python script filenames, Python import-package directories, and tool-mandated names such as `SKILL.md` and `README.md` stay exempt.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-create-skill-and-packaging/` | Make skill scaffolding and packaging checks emit and enforce kebab-case names while leaving Python implementation filenames exempt. | Planned |
| 002 | `002-catalog-and-playbook-generators/` | Make feature-catalog and manual-testing-playbook output trees use hyphenated roots, categories, files, and path values while respecting phase 002 consumer tolerance. | Planned |
| 003 | `003-readme-agent-command-changelog-flowchart-diff-benchmark/` | Make the README, agent, command, changelog, flowchart, diff, and benchmark generator families emit kebab-case output paths. | Planned |
| 004 | `004-command-asset-emitters/` | Make `/create:*` workflow assets instruct and verify kebab-case output names; defer renaming the asset source files themselves. | Planned |

The four children are independent generator families and may run in parallel. Child 002 must prove compatibility with the fail-closed dual-name consumer contract from phase 002 before its generated catalog or playbook tree is accepted.
<!-- /ANCHOR:phase-map -->
