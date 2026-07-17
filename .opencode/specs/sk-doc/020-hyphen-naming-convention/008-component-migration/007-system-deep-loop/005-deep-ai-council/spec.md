---
title: "Feature Specification: deep-ai-council filesystem names (032 phase 007/005)"
description: "The deep-ai-council packet contains 12 underscore-bearing directory families and 89 underscore-bearing files, including paired feature-catalog and manual-playbook trees, council graph material, and assets. This phase renames those in-scope paths to kebab-case and repairs their references while preserving council artifacts, state contracts, and tool-mandated names."
trigger_phrases:
  - "deep-ai-council kebab-case migration"
  - "AI council filesystem names"
  - "council packet path repair"
  - "deep-ai-council snake_case resources"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/005-deep-ai-council"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/005-deep-ai-council"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored council phase spec"
    next_safe_action: "Execute the council rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The live deep-ai-council inventory has 12 underscore-bearing directory families and 89 underscore-bearing files."
      - "The feature_catalog and manual_testing_playbook trees are paired views of the same council surface and move under one map."
      - "SKILL.md, package/tool names, council state keys, and generated artifacts remain protected."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep-ai-council filesystem names

> Phase adjacency under the system-deep-loop component parent: predecessor `004-deep-review`; successor `006-deep-improvement`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/005-deep-ai-council |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | deep-ai-council |
| **Origin** | Phase 005 of the system-deep-loop component migration under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The council packet carries two parallel documentation surfaces: `feature_catalog/` describes council capabilities and `manual_testing_playbook/` describes their scenarios. Both contain the same underscore-separated category families, including `artifact_persistence_and_state_format`, `council_deliberation_and_seat_diversity`, `council_graph_integration`, `convergence_and_rollback`, `runtime_routing_and_rename`, and `writer_library_contract`; assets also include `deep_ai_council_config.json`, `deep_ai_council_dashboard.md`, and `prompt_pack_round.md`.

This phase moves the council packet's in-scope filesystem names to kebab-case as one paired reference closure, preserving council routing, artifact persistence, graph integration, convergence decisions, and public mode identity.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The 12 underscore-bearing directory families under `deep-ai-council/`, including the paired `feature_catalog/` and `manual_testing_playbook/` category trees, `behavior_benchmark/`, and their index files.
- The 89 underscore-bearing files across assets, catalog/playbook scenarios, references, and council benchmark material, including `deep_ai_council_config.json`, `council_graph_query_five_modes_prompt_safe_context.md`, `state_jsonl_records_council_complete_event.md`, and `runtime_agent_renamed_to_deep_ai_council.md`.
- Council `SKILL.md`, README, scripts, tests, vitest configuration, resource maps, Markdown links, artifact path values, and graph/replay references where a filesystem path changes.
- Paired catalog/playbook coverage and council scenario IDs before and after the rename.

### Out of Scope

- The shared runtime, sibling workflow packets, root playbook, and root benchmark storage.
- `SKILL.md`, `vitest.config.mjs`, package manifests, generated council artifacts, Python `.py` files/package directories, code identifiers, JSON/YAML/TOML keys, frontmatter fields, database columns, and frozen changelog/history.
- Changing council seat selection, deliberation order, convergence thresholds, artifact schemas, graph semantics, or public command/agent keys.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-ai-council/assets/` | Rename/reference update | Rename underscore-bearing council config, dashboard, strategy, and prompt assets. |
| `.opencode/skills/system-deep-loop/deep-ai-council/feature_catalog/` | Rename/reference update | Rename catalog root, paired categories, leaves, and index path values. |
| `.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/` | Rename/reference update | Rename paired playbook categories/scenarios and preserve coverage. |
| `.opencode/skills/system-deep-loop/deep-ai-council/references/`, scripts, tests, and docs | Reference update | Repair council resource paths, artifact roots, graph/replay links, and test inputs. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every council candidate is classified once | The map covers all 12 directory families and 89 underscore-bearing files with no unknown or duplicate target. |
| REQ-002 | Paired catalog and playbook trees remain aligned | Each feature leaf and manual scenario keeps its counterpart, index path, and scenario/resource relationship after renaming. |
| REQ-003 | Council path consumers are repaired | Assets, README/resource maps, scripts, tests, graph/replay references, and artifact path values resolve to kebab-case paths. |
| REQ-004 | Council behavior and state contracts remain stable | Seat identities, convergence decisions, JSONL fields, artifact schemas, graph events, and public mode keys match BASE evidence. |
| REQ-005 | Exemptions are respected | Tool/config names, generated artifacts, Python files/package directories, identifiers, data keys, and frozen history retain their original names. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case filesystem name remains under `deep-ai-council/`.
- **SC-002**: Catalog/playbook parity, resource routing, council artifact persistence, and graph replay remain intact.
- **SC-003**: The council packet retains its public mode, planning-only boundary, and convergence behavior.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The catalog and playbook duplicate a large category/leaf shape, so renaming one side without the other would create a false documentation surface. Council graph and artifact paths are also assembled in scripts and tests. The phase depends on the frozen map, paired-tree evidence, and reference checker; its checklist requires parity and non-zero council scenario coverage.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must record any generated council output or state path separately from authored resource names before applying the map.
<!-- /ANCHOR:questions -->
