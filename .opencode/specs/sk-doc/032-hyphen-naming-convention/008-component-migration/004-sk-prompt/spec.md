---
title: "Feature Specification: sk-prompt component migration (032 phase 004)"
description: "Phase parent for the kebab-case filesystem-naming work across the sk-prompt hub, its prompt-improve and prompt-models packets, shared playbooks, benchmark artifacts, and release records. The child phases keep the rename maps, reference rewrites, verification contracts, and rollup evidence independently reviewable."
trigger_phrases:
  - "sk-prompt kebab-case migration"
  - "sk-prompt component naming phases"
  - "prompt surface hyphen naming"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the sk-prompt phase-parent map from the live surface inventory"
    next_safe_action: "Execute the selected child phase on the pinned migration worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-improve/"
      - ".opencode/skills/sk-prompt/prompt-models/"
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md"
    completion_pct: 0
    open_questions:
      - "Phase 006 execution must record the exact release version used for the changelog verification."
    answered_questions:
      - "The child phases cover only filesystem names and path-valued references, not identifiers or data keys."
      - "Python scripts, Python package directories, tool-mandated names, generated output, and frozen history remain exempt."
      - "This authoring pass changes only the child documentation under the assigned sk-prompt packet."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + child phase map only; detailed planning and verification live in the children. -->

# Feature Specification: sk-prompt component migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt |
| **Predecessor** | 003-sk-doc |
| **Successor** | 005-cli-external-orchestration |
| **Handoff Criteria** | All seven child packets have concrete scope, path evidence, and blocking checklist contracts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-prompt surface still contains underscore-separated filesystem names across the hub-level playbook, the prompt-improve and prompt-models packets, and benchmark artifacts. Those names are coupled to Markdown links, router resource maps, profile references, scenario indexes, and release records, so a directory-only rename would leave the surface internally inconsistent.

### Purpose
Define seven independently reviewable child phases that rename every in-scope sk-prompt filesystem name to kebab-case, update path-valued references, verify changelog/version evidence, and close with a scope-aware rollup gate while preserving all program exemptions.

> **Phase-parent note:** This spec.md is the only authored document at this parent level. Detailed plans, tasks, checklists, and design decisions live in the child phase folders below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The hub root and any actual `shared/` subtree under `.opencode/skills/sk-prompt`.
- Active path names and references in `prompt-improve/` and `prompt-models/`, with playbooks and benchmark trees assigned to their dedicated children.
- The root and nested `manual_testing_playbook/` trees, including category directories and scenario filenames.
- The root `benchmark/` and nested benchmark artifact trees, including authored result/profile/storage paths and generated-output classification.
- Changelog/version evidence for the hub and both workflow packets.
- A final sibling-phase aggregation and scope-aware kebab-case gate.

### Out of Scope
- Python `.py` filenames and Python import-package directories.
- `SKILL.md`, `mode-registry.json`, package manifests, and other tool-mandated names.
- Code identifiers, JSON/YAML/TOML keys, frontmatter field names, and database columns.
- Generated or lockfile output and frozen changelog/history content, except for the explicit release evidence checked by phase 006.
- Executing any rename during this authoring pass.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-prompt/` | Rename/reference update | 001 | Hub-root and shared-name boundary; exact router filenames remain unchanged |
| `.opencode/skills/sk-prompt/prompt-improve/` | Rename/reference update | 002 | Asset and reference filenames outside the dedicated playbook/benchmark children |
| `.opencode/skills/sk-prompt/prompt-models/` | Rename/reference update | 003 | Model-craft assets and references outside benchmark output |
| `.opencode/skills/sk-prompt/manual_testing_playbook/` | Rename/reference update | 004 | Hub routing scenarios and category/file names |
| `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/` | Rename/reference update | 004 | Prompt-improve scenario categories and files |
| `.opencode/skills/sk-prompt/benchmark/` and nested benchmark trees | Rename/reference update | 005 | Authored benchmark artifact names and path-valued references |
| `.opencode/skills/sk-prompt/*/changelog/` | Verification record | 006 | Changelog entry and version-bump evidence; no rename work |
| `.opencode/specs/sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt/` | Verification contract | 007 | Sibling evidence aggregation; no skill-surface mutation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently executable L2 packet. Its checklist is the blocking acceptance contract for that concern.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-hub-root-and-shared/` | Inventory the hub root and the currently absent `shared/` boundary; rename only in-scope names there while preserving exact routing contracts | Planned |
| 002 | `002-prompt-improve/` | Rename prompt-improve assets and references, then resolve all active path references outside playbook and benchmark ownership | Planned |
| 003 | `003-prompt-models/` | Rename prompt-models assets and references, preserving model/profile data keys and tool-mandated files | Planned |
| 004 | `004-manual-testing-playbook/` | Rename hub-level and prompt-improve playbook roots, category directories, scenario files, and their active references | Planned |
| 005 | `005-benchmark/` | Rename authored benchmark artifact paths, classify generated run output, and update benchmark references without changing result payload keys | Planned |
| 006 | `006-changelog-verify/` | Verify a matching rename-set changelog entry and coherent version bump for the sk-prompt surface | Planned |
| 007 | `007-skill-gate/` | Aggregate all sibling evidence and prove the sk-prompt naming surface is kebab-clean within the program boundary | Planned |

### Phase Transition Rules

- A child phase does not pass until its P0 checklist items have evidence and its P1 items are complete or explicitly deferred.
- Reference rewrites stay with the phase that owns the renamed path; delegated playbook and benchmark trees are not duplicated in phases 001–003.
- Phase 006 verifies release evidence after the path phases; phase 007 is the final subtree gate and performs no new migration work.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-hub-root-and-shared | 002-prompt-improve | Hub boundary and exact-name exemptions are recorded | Phase 001 checklist and root inventory |
| 002-prompt-improve | 003-prompt-models | Prompt-improve asset/reference map and active-link sweep are green | Phase 002 checklist and reference-resolution evidence |
| 003-prompt-models | 004-manual-testing-playbook | Prompt-models asset/reference map is green and data keys are unchanged | Phase 003 checklist and JSON/path evidence |
| 004-manual-testing-playbook | 005-benchmark | Both playbook trees retain scenario coverage and resolve their active links | Phase 004 checklist and scenario-ID parity |
| 005-benchmark | 006-changelog-verify | Benchmark path map and generated-output dispositions are recorded | Phase 005 checklist and benchmark manifest |
| 006-changelog-verify | 007-skill-gate | Changelog entry and version-bump evidence match the completed rename set | Phase 006 checklist and release metadata comparison |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- The exact release version for phase 006 remains an execution-time value; it must be recorded rather than inferred from the current prompt-models metadata mismatch.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Program spec**: See `../../spec.md` for the naming rule, exemptions, and full program map.
- **Program decisions**: See `../../001-convention-policy-and-scope/decision-record.md` for the locked exemption and verification rules.
- **Phase children**: See `001-hub-root-and-shared/` through `007-skill-gate/` for the executable child contracts.
