---
title: "Feature Specification: deep-research filesystem names (032 phase 007/003)"
description: "The deep-research packet contains 13 underscore-bearing directory families and 103 underscore-bearing files across assets, catalogs, playbooks, behavior benchmarks, references, and state artifacts. This phase renames those in-scope paths to kebab-case and repairs their consumers while preserving research state schemas, Python exemptions, and the SKILL.md contract."
trigger_phrases:
  - "deep-research kebab-case migration"
  - "deep research filesystem names"
  - "research packet path repair"
  - "deep-research snake_case resources"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/007-system-deep-loop/003-deep-research"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/007-system-deep-loop/003-deep-research"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deep research phase spec"
    next_safe_action: "Execute the deep research rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The live deep-research inventory has 13 underscore-bearing directory families and 103 underscore-bearing files."
      - "SKILL.md and tool-mandated or generated names stay exact; path-valued resource references change when required."
      - "Research state and artifact keys are contracts, not filesystem names, and remain unchanged."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep-research filesystem names

> Phase adjacency under the system-deep-loop component parent: predecessor `002-runtime`; successor `004-deep-review`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/007-system-deep-loop/003-deep-research |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | deep-research |
| **Origin** | Phase 003 of the system-deep-loop component migration under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The research packet's resource router and iterative loop refer to filesystem paths throughout `feature_catalog/`, `manual_testing_playbook/`, `references/`, `assets/`, and `behavior_benchmark/`. The live tree includes directory names such as `behavior_benchmark`, `command_flow_stress_tests`, `convergence_and_recovery`, `iteration_execution_and_state_discipline`, and `synthesis_save_and_guardrails`, plus files such as `deep_research_config.json`, `deep_research_dashboard.md`, `jsonl_state_log.md`, and `state_reducer_registry.md`.

This phase renames the research packet's in-scope filesystem names to kebab-case and repairs every path-valued consumer, while preserving the research loop's convergence, state, artifact, and command contracts.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The 13 underscore-bearing directory families under `deep-research/`, including `behavior_benchmark/`, `feature_catalog/`, `manual_testing_playbook/`, `convergence_and_recovery/`, `initialization_and_state_setup/`, `pause_resume_and_fault_tolerance/`, and `state_management/`.
- The 103 underscore-bearing files across `assets/`, catalog leaves, playbook scenarios, references, behavior-benchmark material, and state documentation, including `deep_research_config.json`, `prompt_pack_iteration.md.tmpl`, `auto_mode_deep_research_kickoff.md`, and `iteration_writes_iteration_jsonl_and_strategy_update.md`.
- Research `SKILL.md`, README, resource-map strings, command/agent path consumers, relative Markdown links, test fixtures, and artifact-root references where a filesystem path changes.
- Research scenario/index counts and state artifact path evidence before and after the rename.

### Out of Scope

- The shared runtime, sibling workflow packets, root playbook, and root benchmark storage.
- `SKILL.md`, package/tool-mandated names, generated state output, Python `.py` files/package directories, code identifiers, JSON/YAML/TOML keys, frontmatter fields, and database columns.
- Changing research convergence math, JSONL event names, artifact schemas, command syntax, or source semantics.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-research/assets/` | Rename/reference update | Rename underscore-bearing config, dashboard, strategy, and prompt asset names. |
| `.opencode/skills/system-deep-loop/deep-research/feature_catalog/` | Rename/reference update | Rename the catalog root, categories, leaves, and index path values. |
| `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/` | Rename/reference update | Rename playbook categories/scenarios and preserve scenario coverage. |
| `.opencode/skills/system-deep-loop/deep-research/references/`, `SKILL.md`, and tests | Reference update | Repair resource maps, Markdown links, state paths, and test inputs. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every research candidate is classified once | The map covers all 13 directory families and 103 underscore-bearing files with no unknown or duplicate targets. |
| REQ-002 | Research path consumers are repaired | `SKILL.md` resource maps, asset loaders, Markdown links, command/agent references, and test fixtures resolve to kebab-case paths. |
| REQ-003 | Catalog and playbook discovery is preserved | The catalog index and playbook index expose the same scenario/resource set and no leaf silently downgrades or disappears. |
| REQ-004 | Research state contracts remain stable | JSONL field names, artifact schemas, convergence thresholds, event names, and command arguments match BASE evidence. |
| REQ-005 | Exemptions are respected | SKILL.md, generated state, Python files/package directories, identifiers, data keys, and frozen history retain their original names. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case filesystem name remains under `deep-research/`.
- **SC-002**: Resource routing, research state reconstruction, scenario discovery, and Markdown links resolve with BASE-equivalent semantics.
- **SC-003**: The research packet's public mode and tool contract are unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Research state paths can be assembled dynamically from iteration identifiers, and the packet's resource map mixes path strings with workflow keys. A mechanical replacement could corrupt state keys or miss dynamic artifact paths. The phase depends on the frozen map, the reference checker, and the runtime handoff; the checklist requires both static path resolution and a non-zero research fixture/scenario check.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must disposition any dynamic artifact path builder before the rename batch is accepted.
<!-- /ANCHOR:questions -->
