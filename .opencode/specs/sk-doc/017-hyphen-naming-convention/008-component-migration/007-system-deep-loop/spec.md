---
title: "Feature Specification: system-deep-loop component migration (017 phase 007)"
description: "The system-deep-loop surface contains snake_case directories and files across runtime, five workflow packets, the root manual-testing playbook, and benchmark storage. This phase parent defines eleven independently reviewable child contracts that move only in-scope filesystem names to kebab-case, repair path references, and preserve the program exemption boundary."
trigger_phrases:
  - "system-deep-loop kebab-case migration"
  - "deep loop naming phases"
  - "hyphenate system-deep-loop resources"
  - "system-deep-loop filesystem names"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored system-deep-loop phase map"
    next_safe_action: "Execute the selected system-deep-loop child phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/SKILL.md"
      - ".opencode/skills/system-deep-loop/mode-registry.json"
      - ".opencode/skills/system-deep-loop/runtime/"
      - ".opencode/skills/system-deep-loop/deep-research/"
      - ".opencode/skills/system-deep-loop/deep-review/"
      - ".opencode/skills/system-deep-loop/deep-ai-council/"
      - ".opencode/skills/system-deep-loop/deep-improvement/"
      - ".opencode/skills/system-deep-loop/deep-alignment/"
      - ".opencode/skills/system-deep-loop/manual_testing_playbook/"
      - ".opencode/skills/system-deep-loop/benchmark/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Kebab-case is the sole canonical form for in-scope filesystem names."
      - "Python .py files, Python import-package directories, tool-mandated names, generated or lockfile output, and frozen history remain exempt."
      - "Identifiers, JSON/YAML/TOML keys, frontmatter fields, and database columns are not filesystem rename targets."
      - "Each child owns its path and reference closure; phase 011 is the subtree rollup gate."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + child phase map only; detailed planning and verification live in the children. -->

# Feature Specification: system-deep-loop component migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration |
| **Predecessor** | 006-mcp-tooling |
| **Successor** | 008-system-spec-kit |
| **Handoff Criteria** | Every child has a grounded path boundary, an L2 plan, and a blocking checklist contract. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The system-deep-loop surface is a nested family rather than one flat directory. Its runtime currently contains names such as `feature_catalog`, `coverage_graph`, `prompt_rendering`, `script_entry_points`, and `state_safety`; workflow packets contain names such as `behavior_benchmark`, `manual_testing_playbook`, `deep_research_config.json`, `review_dimensions`, and `deep_ai_council_config.json`; the root playbook contains `advisor_integration` and `runtime_and_backend`; benchmark storage contains `after_d3_proxy`, `live_mode_b`, and `router_mode_a`.

This parent defines eleven independently reviewable children so each path family can be renamed with its reference closure, while `SKILL.md`, `mode-registry.json`, package/tool contracts, Python exemptions, data keys, and frozen history remain protected.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The hub root and `shared/` boundary under `.opencode/skills/system-deep-loop/`; the current root/shared inventory is already compliant, so the child verifies and records that no candidate is missed.
- The complete `runtime/`, `deep-research/`, `deep-review/`, `deep-ai-council/`, `deep-improvement/`, and `deep-alignment/` trees, with each workflow packet owning its own references, assets, catalogs, playbooks, scripts, tests, and path-valued consumers.
- The root `manual_testing_playbook/` tree and the root `benchmark/` storage labels.
- Changelog/version evidence and a final scope-aware naming gate for this entire surface.

### Out of Scope

- Python `.py` filenames and Python import-package directories.
- `SKILL.md`, `mode-registry.json`, package manifests, `tsconfig.json`, `vitest.config.*`, metadata contracts, and other tool-mandated exact names.
- Code identifiers, JSON/YAML/TOML keys, frontmatter field names, database columns, generated or lockfile output, and frozen historical changelog content.
- Executing the migration during this documentation-authoring pass.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/system-deep-loop/` | Rename/reference update | 001 | Verify the hub/shared boundary and preserve exact routing and metadata names. |
| `.opencode/skills/system-deep-loop/runtime/` | Rename/reference update | 002 | Rename runtime directories/files and repair runtime, package, test, and catalog/playbook path consumers. |
| `.opencode/skills/system-deep-loop/deep-research/` | Rename/reference update | 003 | Rename research resources and state/playbook paths without changing workflow contracts. |
| `.opencode/skills/system-deep-loop/deep-review/` | Rename/reference update | 004 | Rename review resources and state/playbook paths without changing severity or convergence contracts. |
| `.opencode/skills/system-deep-loop/deep-ai-council/` | Rename/reference update | 005 | Rename council resources, paired catalog/playbook trees, and their reference closure. |
| `.opencode/skills/system-deep-loop/deep-improvement/` | Rename/reference update | 006 | Rename improvement-lane resources, benchmark assets, and references while preserving Python boundaries. |
| `.opencode/skills/system-deep-loop/deep-alignment/` | Rename/reference update | 007 | Rename alignment resources and path-valued routing references while preserving embedded identifiers and keys. |
| `.opencode/skills/system-deep-loop/manual_testing_playbook/` | Rename/reference update | 008 | Rename the root playbook category directories and scenario filenames. |
| `.opencode/skills/system-deep-loop/benchmark/` | Rename/reference update | 009 | Rename authored benchmark storage labels and repair report/index references. |
| `.opencode/skills/system-deep-loop/changelog/` | Verification record | 010 | Confirm a rename-set entry and coherent version bump; no rename work. |
| `001-010 child reports and the full system-deep-loop tree` | Verification gate | 011 | Aggregate sibling evidence and prove the subtree is kebab-clean within the exemptions. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently executable L2 packet. Its checklist is the blocking acceptance contract for that concern.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-hub-root-and-shared/` | Verify the compliant hub/shared boundary, rename any baseline candidate if found, and protect exact routing and metadata names. | Planned |
| 002 | `002-runtime/` | Rename runtime snake_case directories/files and update package, script, test, catalog, playbook, and reference paths. | Planned |
| 003 | `003-deep-research/` | Rename deep-research resources, state/playbook categories, and path-valued references while preserving research semantics. | Planned |
| 004 | `004-deep-review/` | Rename deep-review resources, state/playbook categories, and path-valued references while preserving review semantics. | Planned |
| 005 | `005-deep-ai-council/` | Rename deep-ai-council assets and its paired feature-catalog/manual-playbook trees as one reference closure. | Planned |
| 006 | `006-deep-improvement/` | Rename deep-improvement lane resources, fixtures, profiles, playbooks, and references while preserving Python files/package directories. | Planned |
| 007 | `007-deep-alignment/` | Rename deep-alignment resources and path literals without altering embedded code identifiers, data keys, or authority names. | Planned |
| 008 | `008-manual-testing-playbook/` | Rename the root playbook directory, five category directories, scenario files, and active consumers. | Planned |
| 009 | `009-benchmark/` | Rename root benchmark storage labels and verify fixture/profile ownership and generated-report dispositions. | Planned |
| 010 | `010-changelog-verify/` | Verify the skill changelog records the complete subtree rename set and version bump; perform no renames. | Planned |
| 011 | `011-skill-gate/` | Aggregate phases 001-010 and prove no in-scope snake_case filesystem name remains in the surface. | Planned |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None blocking. Phase 010 records the execution-time release version selected for the completed subtree evidence.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Program policy**: See `../../001-convention-policy-and-scope/spec.md` and its `decision-record.md`.
- **Child phases**: See `001-hub-root-and-shared/` through `011-skill-gate/` for detailed contracts.
- **Parent packet**: See `../../spec.md` for the component-migration program map.
