---
title: "Feature Specification: system-deep-loop manual-testing-playbook names (032 phase 007/008)"
description: "The root system-deep-loop manual-testing-playbook tree has five underscore-bearing category directories and 20 underscore-bearing Markdown files, including its index. This phase renames the authored categories and scenarios to kebab-case and repairs playbook, benchmark, and router references while preserving scenario IDs and prompt content."
trigger_phrases:
  - "system-deep-loop manual playbook naming"
  - "deep loop playbook kebab-case"
  - "manual testing scenario path repair"
  - "system-deep-loop playbook filesystem names"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/008-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/008-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual playbook phase spec"
    next_safe_action: "Execute the root playbook rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The root playbook has five underscore-bearing category directories and 20 underscore-bearing Markdown files, representing 19 scenarios plus the index."
      - "Scenario IDs, frontmatter fields, prompt vocabulary, and JSON keys remain unchanged; only filesystem names and path-valued links move."
      - "Nested playbooks inside workflow packets are owned by their component phases, not this root-playbook child."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: System-deep-loop manual-testing-playbook names

> Phase adjacency under the system-deep-loop component parent: predecessor `007-deep-alignment`; successor `009-benchmark`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/008-manual-testing-playbook |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-deep-loop |
| **Origin** | Phase 008 of the system-deep-loop component migration under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The root manual-testing playbook is the scenario corpus used by the system-deep-loop benchmark and routing documentation. Its five categories are currently named `advisor_integration`, `improvement_lane_routing`, `mode_routing`, `runtime_and_backend`, and `state_and_convergence_discipline`; the index is `manual_testing_playbook.md`, and all 19 scenario files use underscore-separated names such as `ai_council_routing.md`, `runtime_loop_research.md`, and `hub_logic_boundary.md`.

This phase renames the root playbook directory, category directories, and scenario files to kebab-case and repairs every active reference without changing scenario IDs, category meaning, prompts, or benchmark semantics.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/skills/system-deep-loop/manual_testing_playbook/` and its five categories: `advisor_integration/`, `improvement_lane_routing/`, `mode_routing/`, `runtime_and_backend/`, and `state_and_convergence_discipline/`.
- The 20 underscore-bearing Markdown files in that tree, including `manual_testing_playbook.md`, `command_bridge_guard.md`, `mode_hint_override.md`, `runtime_loop_council.md`, and `externalized_state.md`.
- The root `benchmark/README.md`, hub/resource indexes, benchmark runner path values, and other active consumers that point at the root playbook files.
- Scenario inventory, IDs, category counts, Markdown links, and benchmark connectivity evidence.

### Out of Scope

- Nested playbooks inside `runtime/`, `deep-research/`, `deep-review/`, `deep-ai-council/`, `deep-improvement/`, or `deep-alignment/`; their component phases own them.
- Scenario content, IDs, frontmatter fields, JSON/YAML/TOML keys, code identifiers, generated benchmark reports, Python `.py` files/package directories, tool-mandated names, and frozen history.
- Changing routing rules, benchmark scoring, or the manual-testing protocol.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/manual_testing_playbook/` | Rename/reference update | Rename the root, five categories, and 19 scenario files plus the index. |
| `.opencode/skills/system-deep-loop/benchmark/README.md` | Reference update | Update the documented playbook path and benchmark corpus references. |
| Hub and benchmark path consumers | Reference update | Repair path-valued links and runner inputs without changing scenario keys or prose vocabulary. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every root playbook name is classified once | The map covers the root, five categories, index, and 19 scenario files with no unknown or duplicate target. |
| REQ-002 | Scenario coverage and identity are preserved | All 19 scenario files remain discoverable under the same category and scenario IDs after renaming. |
| REQ-003 | Active playbook consumers are repaired | Benchmark README/runner references, hub resource paths, Markdown links, and connectivity checks resolve to kebab-case paths. |
| REQ-004 | Playbook content contracts remain stable | Scenario frontmatter, prompts, expected routes, and category vocabulary are unchanged except for required filesystem path values. |
| REQ-005 | Nested ownership and exemptions are respected | Component-owned playbooks, generated reports, tool names, identifiers/keys, Python files/package directories, and frozen history are not renamed here. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case filesystem name remains in the root playbook tree.
- **SC-002**: The benchmark sees the same 19 scenario IDs and category structure through the new kebab-case paths.
- **SC-003**: All root playbook links and connectivity references resolve without changing scenario behavior.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The benchmark README and Lane C runner use the root playbook as a corpus boundary, so a directory-only rename can yield zero scenarios or a false D5 connectivity failure. Nested component playbooks share similar names but are not owned here. The phase depends on the frozen map, benchmark path inventory, and scenario-ID baseline.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must prove that nested component playbooks were excluded from this child and that the root corpus still contains a non-zero scenario set.
<!-- /ANCHOR:questions -->
