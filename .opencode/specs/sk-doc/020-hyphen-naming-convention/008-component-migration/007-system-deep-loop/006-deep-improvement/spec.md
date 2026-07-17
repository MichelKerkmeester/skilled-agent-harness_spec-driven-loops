---
title: "Feature Specification: deep-improvement filesystem names (032 phase 007/006)"
description: "The deep-improvement packet has 22 underscore-bearing directory families and 250 underscore-bearing files across three improvement lanes, benchmark assets, playbooks, references, and scripts. This phase renames the in-scope authored names to kebab-case, repairs the shared loop-host and benchmark path closure, and protects Python files, package directories, generated output, and data contracts."
trigger_phrases:
  - "deep-improvement kebab-case migration"
  - "improvement packet filesystem names"
  - "deep improvement path repair"
  - "deep-improvement snake_case resources"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/006-deep-improvement"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/006-deep-improvement"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deep improvement phase spec"
    next_safe_action: "Execute the deep improvement rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The live deep-improvement inventory has 22 underscore-bearing directory families and 250 underscore-bearing files."
      - "Python .py files and import-package directories remain exempt; .py.template assets are not Python script files and require explicit classification."
      - "The deep-improvement benchmark subtree belongs to this component; the root system-deep-loop benchmark storage belongs to phase 009."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep-improvement filesystem names

> Phase adjacency under the system-deep-loop component parent: predecessor `005-deep-ai-council`; successor `007-deep-alignment`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/006-deep-improvement |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | deep-improvement |
| **Origin** | Phase 006 of the system-deep-loop component migration under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The improvement packet multiplexes agent, model, and skill lanes through a shared loop host. Its live surface contains directory families such as `agent_improvement`, `model_benchmark`, `model_benchmark_mode`, `skill_benchmark`, `deep_loop_workflows`, `integration_scanning`, `runtime_truth`, `target_profiles`, and `sk_design_dispatch`; the asset, reference, catalog, playbook, and benchmark trees repeat those names in hundreds of files.

This phase renames every in-scope deep-improvement filesystem name to kebab-case and repairs the shared lane/benchmark reference closure without changing lane keys, evaluator schemas, Python importability, generated reports, or promotion/rollback behavior.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The 22 underscore-bearing directory families under `deep-improvement/`, including `agent_improvement/`, `behavior_benchmark/`, `deep_loop_workflows/`, `model_benchmark/`, `model_benchmark_mode/`, `skill_benchmark/`, `manual_testing_playbook/`, and `runtime_truth/`.
- The 250 underscore-bearing files across `assets/`, `references/`, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, and the component-owned `benchmark/live_mode_b/` and `benchmark/router_mode_a/` storage paths.
- Lane configs, fixture/profile path references, loop-host scripts, tests, README/resource maps, and benchmark commands where a filesystem path changes.
- Explicit classification of Python `.py` files, Python package directories, `.py.template` asset names, generated benchmark reports, lockfiles, and tool-mandated names.

### Out of Scope

- The root `.opencode/skills/system-deep-loop/benchmark/` storage boundary, which belongs to phase 009, and the root manual-testing playbook, which belongs to phase 008.
- Python `.py` filenames, Python import-package directories, generated/lockfile output, package manifests, tool-mandated names, code identifiers, JSON/YAML/TOML keys, frontmatter fields, database columns, and frozen changelog/history.
- Changing lane names, evaluator dimensions, score semantics, promotion/rollback gates, or generated report payloads.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-improvement/assets/` | Rename/reference update | Rename lane asset directories, fixture/profile names, and path-valued asset references. |
| `.opencode/skills/system-deep-loop/deep-improvement/references/`, `feature_catalog/`, and `manual_testing_playbook/` | Rename/reference update | Rename authored documentation paths and their index/link closure. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/` and tests | Rename/reference update | Rename in-scope script/resource files and repair imports, launchers, fixtures, and registries. |
| `.opencode/skills/system-deep-loop/deep-improvement/benchmark/` | Classification/reference update | Rename authored storage labels when in scope; leave generated report output under its recorded exemption. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every improvement candidate is classified once | The map covers all 22 directory families and 250 underscore-bearing files with no unknown or duplicate target. |
| REQ-002 | The three lanes retain one shared path contract | Loop-host dispatch, lane routing, evaluator references, command bridges, and registries resolve to the renamed paths without lane-key changes. |
| REQ-003 | Fixture/profile and benchmark references are repaired | Authored fixture/profile paths, benchmark commands, playbook/catalog indexes, and test inputs resolve; generated reports are explicitly dispositioned. |
| REQ-004 | Python and package exemptions are safe | `.py` scripts, Python import-package directories, and their imports remain unchanged; `.py.template` assets are treated according to their actual non-`.py` filename. |
| REQ-005 | Improvement behavior and data contracts remain stable | Score dimensions, schemas, state/event keys, and promotion/rollback behavior match BASE evidence. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case filesystem name remains under `deep-improvement/`.
- **SC-002**: All three lanes, their shared loop host, authored benchmark assets, and test/reference paths resolve with unchanged semantics.
- **SC-003**: Python/package, generated-output, tool-name, identifier/key, and frozen-history exemptions are evidenced explicitly.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This is the largest child surface and mixes executable scripts, fixture/profile data, documentation, and generated benchmark output. Renaming a Python package directory or a generated report can break imports or erase the baseline; renaming only one of the three lane views can break the shared host. The phase depends on the frozen map, generated-output manifest, and import/reference checker.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must attach the generated-output and Python/package disposition lists before the first rename batch.
<!-- /ANCHOR:questions -->
