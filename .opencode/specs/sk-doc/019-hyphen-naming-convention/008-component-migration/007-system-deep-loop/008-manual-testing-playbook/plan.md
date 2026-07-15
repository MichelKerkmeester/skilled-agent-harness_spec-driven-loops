---
title: "Implementation Plan: system-deep-loop manual-testing-playbook names (017 phase 007/008)"
description: "Plan for renaming the root manual-testing-playbook directory, five category directories, and 19 scenario files through the frozen semantic map, then repairing benchmark and routing references while preserving scenario IDs and content."
trigger_phrases:
  - "system-deep-loop manual playbook implementation plan"
  - "deep loop scenario rename plan"
  - "manual-testing-playbook reference closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/008-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/008-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual playbook phase plan"
    next_safe_action: "Execute the root playbook rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: System-deep-loop manual-testing-playbook names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/system-deep-loop/manual_testing_playbook/` |
| **Change class** | Root scenario filesystem rename plus reference repair |
| **Execution** | Isolated worktree using the pinned BASE, scenario inventory, and frozen map |
| **Verification** | Scenario-ID/category parity, Markdown links, benchmark connectivity, and route checks |

### Overview

Rename the root playbook directory, five categories, index, and 19 scenario files as one scenario-corpus closure. Update the benchmark README and active path consumers while leaving prompts, IDs, frontmatter fields, and category semantics unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The frozen map lists the root, five categories, index, and 19 scenario files.
- [ ] BASE scenario IDs, category counts, links, and benchmark connectivity evidence are captured.
- [ ] Nested workflow-packet playbooks are excluded and their ownership is recorded.

### Definition of Done

- [ ] Root playbook names and active consumers are kebab-clean and resolvable.
- [ ] All 19 scenario IDs and categories remain discoverable with non-zero coverage.
- [ ] Benchmark/router behavior and playbook content contracts match BASE.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Corpus layer**: move the root and five category directories plus index/scenario files through a bijective map.
- **Consumer layer**: update benchmark README/runner path values, hub resource paths, and Markdown links.
- **Ownership layer**: do not move nested playbooks owned by runtime or workflow child phases.
- **Content boundary**: preserve scenario IDs, expected routes, frontmatter fields, prompt vocabulary, and benchmark keys.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the root-playbook map, BASE scenario manifest, and benchmark/router path inventory.
- [ ] Record nested playbook exclusions and all active consumers of the root corpus path.

### Phase 2: Core Implementation

- [ ] Rename the root directory, five category directories, index, and 19 scenario files.
- [ ] Update benchmark README/runner paths, hub resource references, Markdown links, and scenario indexes.
- [ ] Preserve scenario content, IDs, category meaning, tool names, keys, generated output, and nested ownership.

### Phase 3: Verification

- [ ] Compare final scenario/category inventory and IDs with BASE.
- [ ] Resolve all Markdown links and benchmark/router path values.
- [ ] Run the root benchmark connectivity and route checks with non-zero scenario discovery.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Map scan reports root, five categories, index, and 19 scenarios once. |
| Scenario parity | Compare scenario IDs, categories, expected routes, and count with BASE. |
| Reference integrity | Resolve benchmark README/runner, hub resource, index, and Markdown path references. |
| Connectivity | Run root benchmark D5/path checks and ensure the corpus is non-zero. |
| Scope safety | Confirm nested playbooks, content keys, generated reports, tool names, and frozen history were not moved. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Impact if Blocked |
|------------|------|-------------------|
| Frozen scenario map | Internal | Scenario ownership and target names cannot be proven. |
| Root benchmark consumer inventory | Sibling | The benchmark may discover zero scenarios or stale paths. |
| Workflow child boundaries | Sibling | Nested playbooks could be renamed twice or omitted. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Missing scenario, category/ID drift, zero benchmark discovery, stale link, or nested-scope leakage.
- **Procedure**: Revert only the root playbook batch, restore the scenario manifest, and rerun path/connectivity checks before retrying.
<!-- /ANCHOR:rollback -->
