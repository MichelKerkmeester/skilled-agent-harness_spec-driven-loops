---
title: "Implementation Plan: deep-ai-council filesystem names (020 phase 007/005)"
description: "Plan for renaming the deep-ai-council paired catalog/playbook trees, assets, and references through one semantic map, then repairing artifact, graph, script, and test path consumers without changing council contracts."
trigger_phrases:
  - "deep-ai-council implementation plan"
  - "AI council kebab-case rename plan"
  - "council paired playbook path closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/005-deep-ai-council"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/005-deep-ai-council"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored council phase plan"
    next_safe_action: "Execute the council rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep-ai-council filesystem names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/system-deep-loop/deep-ai-council/` |
| **Change class** | Paired catalog/playbook filesystem rename plus reference repair |
| **Execution** | Isolated worktree using the pinned BASE, paired map, and path checker |
| **Verification** | Paired coverage, artifact/graph resolution, council tests, links, and route parity |

### Overview

Rename the 12 council directory families and 89 underscore-bearing files with one map shared by the feature catalog and manual playbook. Update every asset, reference, graph, replay, script, and test path that names those files; leave council state keys and generated artifacts unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The frozen map covers all 12 directories and 89 files, including paired catalog/playbook rows.
- [ ] BASE council scenario/resource, artifact, graph, and test inventories are captured.
- [ ] Generated artifact and state paths are distinguished from authored resource paths.

### Definition of Done

- [ ] Paired catalog/playbook paths and all active consumers are kebab-clean and resolvable.
- [ ] Council artifact persistence, graph replay, seat/convergence behavior, and test discovery match BASE.
- [ ] Exact tool names, keys, and generated output are preserved.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Paired resource layer**: map each feature-catalog category/leaf with its manual-playbook counterpart so the two views cannot drift.
- **Council path layer**: update assets, references, README/resource indexes, scripts, tests, artifact roots, and graph/replay paths together.
- **Contract boundary**: preserve `SKILL.md`, `vitest.config.mjs`, package names, JSONL/event keys, generated artifacts, and public mode keys.
- **Parity check**: compare scenario IDs, feature leaves, and council graph/resource coverage before and after the path changes.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the paired council map, BASE manifest, and catalog/playbook/artifact inventories.
- [ ] Trace script, graph, replay, and test path builders and record generated/state dispositions.

### Phase 2: Core Implementation

- [ ] Rename council asset names, paired catalog/playbook roots/categories/leaves, and underscore-bearing reference files.
- [ ] Update README/resource maps, Markdown links, scripts, graph/replay paths, artifact roots, and tests.
- [ ] Preserve tool names, state/event keys, generated outputs, identifiers, and public command/agent contracts.

### Phase 3: Verification

- [ ] Compare paired catalog/playbook inventories and scenario IDs with BASE.
- [ ] Resolve all asset, reference, artifact, graph, replay, and test paths.
- [ ] Run council routing/convergence/persistence tests with non-zero scenario coverage.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Map scan reports 12 directory families and 89 files once, with paired rows and collision checks. |
| Paired parity | Compare feature leaves, scenario files, category indexes, and scenario IDs between catalog/playbook views. |
| Reference integrity | Resolve Markdown, asset, script, graph/replay, artifact, and test paths; search for old basenames. |
| Council parity | Run council persistence, graph, convergence, and route tests with non-zero discovery. |
| Exemption safety | Inspect tool/config names, generated artifacts, state keys, Python/package boundaries, and frozen history. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Impact if Blocked |
|------------|------|-------------------|
| Runtime path closure | Sibling | Council graph/runtime consumers may point at old runtime paths. |
| Frozen paired map | Internal | Catalog/playbook parity and target ownership cannot be proven. |
| BASE council artifact/test manifest | Internal | Persistence and scenario parity cannot be demonstrated. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Paired-tree mismatch, dangling artifact/graph path, test discovery drift, collision, or changed council state.
- **Procedure**: Revert only the council batch, restore paired indexes and the BASE manifest, then rerun the artifact/path closure before retrying.
<!-- /ANCHOR:rollback -->
