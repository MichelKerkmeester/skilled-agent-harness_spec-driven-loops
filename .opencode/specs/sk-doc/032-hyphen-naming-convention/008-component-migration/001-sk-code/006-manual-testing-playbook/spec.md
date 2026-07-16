---
title: "Feature Specification: sk-code manual-testing-playbook tree (032 phase 008/006)"
description: "The hub-level sk-code manual-testing-playbook tree uses snake_case for its root directory, ten category directories, the root index, and scenario filenames. This phase renames that playbook tree to kebab-case and repairs every scenario, benchmark, asset, and cross-surface reference without changing scenario IDs or manual-test semantics."
trigger_phrases:
  - "sk-code manual testing playbook naming"
  - "manual-testing-playbook kebab-case"
  - "scenario file rename"
  - "sk-code playbook path migration"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/006-manual-testing-playbook"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual playbook phase spec"
    next_safe_action: "Execute the hub playbook rename closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/sk-code/manual_testing_playbook/"
      - ".opencode/skills/sk-code/benchmark/README.md"
      - ".opencode/skills/sk-code/code-webflow/assets/animation/playbook_entries.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Scenario IDs, prompts, expected outcomes, and manual-test semantics remain unchanged."
      - "The hub-level playbook root and categories are owned here; component-local playbooks remain in their component children."
      - "Python .py files, package directories, tool-mandated names, generated output, keys, identifiers, and frozen history remain exempt."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: sk-code manual-testing-playbook tree

> Phase adjacency under the sk-code component parent: predecessor 005-code-webflow; successor 007-benchmark.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/006-manual-testing-playbook |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-code |
| **Origin** | Phase 006 of the sk-code component migration under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The hub-level playbook is a routable evidence corpus with the root manual_testing_playbook/ and categories cross_browser_and_performance_gates, cross_stack_routing, design_restraint, language_sub_detection, motion_dev_and_animation_regression, plugins_and_hooks, routing_disambiguation, skill_advisor_integration, surface_detection, and tooling_and_hooks. Scenario links and benchmark documentation use those names, so a physical rename must carry the full scenario graph.

### Purpose

Rename the hub-level playbook root, category directories, index, and scenario files to kebab-case and update every link and path consumer while preserving all scenario IDs, prompts, expected resources, evidence rules, and manual-testing behavior.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The root directory manual_testing_playbook/ and root index manual_testing_playbook.md.
- All ten category directories listed in the problem statement.
- Scenario files such as cross_browser_animate.md, cwv_gates.md, gpu_compositing.md, decision_matrix_routing.md, non_webflow_plus_motion_dev.md, opencode_plus_motion_dev.md, prefers_reduced_motion.md, snippet_reuse_cross_stack.md, webflow_plus_motion_dev.md, animation_regression_baseline.md, cdn_bundle_version_pin.md, motion_api_smoke.md, post_edit_quality_router.md, mixed_marker_ambiguity.md, skcode_vs_skdoc.md, advisor_probe_battery.md, opencode_detection.md, unknown_fallback.md, webflow_detection.md, check_dist_staleness_hook.md, and comment_hygiene_hook.md.
- Scenario/index links and path values in SKILL.md, README.md, benchmark/README.md, code-webflow asset playbook entries, code-review references, and other active sk-code consumers.
- A complete map of every scenario path and category path, including any empty category directory that must be preserved or explicitly classified.

### Out of Scope

- Component-local manual-testing-playbook trees under code-opencode, code-quality, code-review, and code-webflow; those are owned by their component phases.
- Scenario IDs, frontmatter keys, category values, prompts, code identifiers, JSON/YAML/TOML keys, and manual-test content that is not a path.
- SKILL.md, README.md, Python/package, generated/lockfile, tool-mandated, and frozen names as physical names.
- Benchmark report content or benchmark storage directory renames; those are owned by 007-benchmark.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-code/manual_testing_playbook/** | Rename and reference update | Rename the root, categories, index, and scenario files. |
| .opencode/skills/sk-code/SKILL.md and README.md | Reference update | Update hub navigation and manual-playbook path literals. |
| .opencode/skills/sk-code/benchmark/README.md | Reference update | Point the benchmark corpus and commands at the renamed playbook root. |
| .opencode/skills/sk-code/code-webflow/assets/animation/playbook_entries.md and other active consumers | Reference update | Repair cross-surface scenario links without changing scenario content. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every hub playbook filesystem name has a unique kebab-case target | The map covers the root, all categories, every scenario file, and empty-directory dispositions with no unknown/collision row. |
| REQ-002 | The scenario graph remains intact | All scenario IDs are present exactly once, root/category indexes resolve, and every relative link reaches the intended scenario. |
| REQ-003 | Active sk-code consumers use the new paths | SKILL.md, README.md, benchmark README, asset entries, and cross-surface references contain no stale active playbook basename. |
| REQ-004 | Scenario semantics remain unchanged | Prompts, expected resources, evidence paths, verdict rules, and manual-testing instructions are content-equivalent apart from required path values. |
| REQ-005 | Exemptions and ownership boundaries remain explicit | Component-local playbooks, Python/package, generated, tool-mandated, key/identifier, and frozen surfaces are not renamed in this child. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The hub-level playbook tree has kebab-case filesystem names only.
- **SC-002**: All 28 scenario IDs and their category/index links remain discoverable with no loss or duplication.
- **SC-003**: Benchmark and cross-surface consumers resolve the renamed playbook tree without semantic drift.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The playbook is both documentation and benchmark input: a broken category path can reduce the benchmark corpus without an obvious runtime failure. The mitigation is scenario-ID parity, non-zero category counts, link resolution, and benchmark consumer scans. The phase depends on the component path handoffs and the frozen map; it does not rename component-local playbooks or benchmark storage.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must preserve the exact scenario corpus count recorded by phase 000 and must document any empty category directory as an explicit map disposition.
<!-- /ANCHOR:questions -->
