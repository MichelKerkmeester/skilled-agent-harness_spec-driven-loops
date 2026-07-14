---
title: "Feature Specification: deep-review filesystem names (017 phase 007/004)"
description: "The deep-review packet contains 15 underscore-bearing directory families and 96 underscore-bearing files across review dimensions, severity, state, convergence, playbooks, and assets. This phase renames those in-scope paths to kebab-case and repairs their consumers without changing review findings, convergence, state, or tool contracts."
trigger_phrases:
  - "deep-review kebab-case migration"
  - "deep review filesystem names"
  - "review packet path repair"
  - "deep-review snake_case resources"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/004-deep-review"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/004-deep-review"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deep review phase spec"
    next_safe_action: "Execute the deep review rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The live deep-review inventory has 15 underscore-bearing directory families and 96 underscore-bearing files."
      - "SKILL.md, review_mode_contract.yaml, tool-mandated names, generated output, and frozen history stay exact."
      - "Review severity, state, JSONL, and convergence identifiers are contracts and are not filesystem rename targets."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep-review filesystem names

> Phase adjacency under the system-deep-loop component parent: predecessor `003-deep-research`; successor `005-deep-ai-council`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/004-deep-review |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | deep-review |
| **Origin** | Phase 004 of the system-deep-loop component migration under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The review packet's resource map, convergence loop, and verifier documentation span `feature_catalog/`, `manual_testing_playbook/`, `references/`, `assets/`, and `behavior_benchmark/`. The live surface contains directory families such as `review_dimensions`, `severity_system`, `review_depth_v2_rollout`, `command_flow_stress_tests`, `pause_resume_and_fault_tolerance`, and `synthesis_save_and_guardrails`, plus files such as `deep_review_config.json`, `review_mode_contract_snapshot.md`, `jsonl_reconstruction_from_review_iteration_files.md`, and `p0_override_blocks_convergence.md`.

This phase renames every in-scope review filesystem name to kebab-case and repairs all path-valued consumers while keeping severity classification, convergence behavior, state schemas, and read/write boundaries unchanged.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The 15 underscore-bearing directory families under `deep-review/`, including `behavior_benchmark/`, `feature_catalog/`, `manual_testing_playbook/`, `review_dimensions/`, `severity_system/`, `review_depth_v2_rollout/`, and `state_management/`.
- The 96 underscore-bearing files across assets, catalog leaves, playbook scenarios, convergence/state references, and benchmark material, including `deep_review_config.json`, `deep_review_dashboard.md`, `review_quality_guards_block_premature_stop.md`, and `review_iteration_writes_findings_jsonl_and_strategy_update.md`.
- Review `SKILL.md`, README, resource maps, command/agent path consumers, Markdown links, test fixtures, and the `review_mode_contract.yaml` path context where a filesystem path changes; the YAML filename itself is already compliant and remains exact.
- Scenario and finding-reference counts, state path resolution, and review-mode routing evidence.

### Out of Scope

- The shared runtime, sibling workflow packets, root playbook, and root benchmark storage.
- `SKILL.md`, generated reports/state, Python `.py` files/package directories, code identifiers, JSON/YAML/TOML keys, frontmatter fields, database columns, and frozen changelog/history.
- Changing severity weights, finding IDs, convergence math, state event names, command syntax, or verifier policy.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-review/assets/` | Rename/reference update | Rename underscore-bearing review config, dashboard, strategy, and prompt assets. |
| `.opencode/skills/system-deep-loop/deep-review/feature_catalog/` | Rename/reference update | Rename catalog root, categories, leaves, and index path values. |
| `.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/` | Rename/reference update | Rename playbook categories/scenarios and preserve scenario coverage. |
| `.opencode/skills/system-deep-loop/deep-review/references/`, `SKILL.md`, and tests | Reference update | Repair resource maps, state paths, Markdown links, and test inputs. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every review candidate is classified once | The map covers all 15 directory families and 96 underscore-bearing files with no unknown or duplicate target. |
| REQ-002 | Review path consumers are repaired | Resource maps, asset loaders, Markdown links, command/agent references, test fixtures, and state path builders resolve to kebab-case paths. |
| REQ-003 | Review catalog and playbook discovery is preserved | The same feature and scenario leaves remain discoverable, including the review-depth v2 rollout categories. |
| REQ-004 | Review contracts remain stable | Severity weights, finding IDs, JSONL field names, convergence thresholds, stop gates, and command arguments match BASE evidence. |
| REQ-005 | Exemptions are respected | Tool/config names, generated state, Python files/package directories, identifiers, data keys, and frozen history retain their original names. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case filesystem name remains under `deep-review/`.
- **SC-002**: Review resource routing, state reconstruction, scenario discovery, and Markdown links resolve with BASE-equivalent semantics.
- **SC-003**: The review packet retains its severity, convergence, read/write, and tool-surface contracts.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Review state and report paths are assembled across iteration scripts, reducers, and scenario indexes; a stale path can fail closed or silently omit findings. The packet also contains strings that look like paths beside severity and event identifiers. The phase depends on the frozen map, the reference checker, and runtime handoff, and its checklist requires non-zero scenario coverage plus state/report resolution.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Any dynamic reducer or report path must receive an explicit reference disposition before the rename batch is accepted.
<!-- /ANCHOR:questions -->
