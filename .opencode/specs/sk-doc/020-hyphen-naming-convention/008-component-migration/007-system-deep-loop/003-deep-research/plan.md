---
title: "Implementation Plan: deep-research filesystem names (020 phase 007/003)"
description: "Plan for renaming deep-research assets, catalog/playbook paths, references, and state documentation through the frozen semantic map, then repairing every static and dynamic path consumer without changing research contracts."
trigger_phrases:
  - "deep-research implementation plan"
  - "deep research kebab-case rename plan"
  - "research packet reference closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/003-deep-research"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/003-deep-research"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deep research phase plan"
    next_safe_action: "Execute the deep research rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep-research filesystem names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/system-deep-loop/deep-research/` |
| **Change class** | Workflow-packet filesystem rename plus reference repair |
| **Execution** | Isolated worktree using the pinned BASE, research map, and path checker |
| **Verification** | Resource routing, state/artifact resolution, scenario parity, links, and research checks |

### Overview

Rename the 13 directory families and 103 underscore-bearing files in the research packet. Keep the resource map, state reconstruction, artifact paths, and command/agent consumers in the same dependency closure so the packet remains the same research workflow under kebab-case names.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The frozen map covers all 13 directories and 103 files with explicit exemptions.
- [ ] BASE research resource, scenario, state, and artifact inventories are captured.
- [ ] Dynamic artifact path builders and command/agent consumers are listed.

### Definition of Done

- [ ] Research paths and active consumers are kebab-clean and resolvable.
- [ ] Catalog/playbook resource and scenario coverage matches BASE.
- [ ] Research state, convergence, artifact, and command contracts remain unchanged.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Resource layer**: rename asset, reference, catalog, playbook, and behavior-benchmark path segments through a semantic map.
- **State layer**: update filesystem path values used by JSONL/state/artifact loaders while preserving event and schema keys.
- **Consumer layer**: repair `SKILL.md`, README, command/agent references, resource maps, Markdown links, and tests.
- **Content boundary**: do not alter research prose, frontmatter fields, identifiers, JSON keys, convergence thresholds, or generated state.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the research frozen map, BASE path manifest, resource inventory, and scenario/state baseline.
- [ ] Trace dynamic artifact/state path builders and record every unresolved or non-filesystem string disposition.

### Phase 2: Core Implementation

- [ ] Rename the research directory families and underscore-bearing asset/reference/catalog/playbook files.
- [ ] Update resource maps, indexes, Markdown links, command/agent paths, test fixtures, and artifact-root path values.
- [ ] Preserve `SKILL.md`, generated outputs, identifiers/keys, and all program exemptions.

### Phase 3: Verification

- [ ] Resolve every old/new resource and state path, including dynamic artifact paths.
- [ ] Compare catalog leaves, playbook scenarios, and behavior-benchmark IDs with BASE.
- [ ] Run research routing/state checks and confirm non-zero discovery with no contract drift.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Map scan reports all 13 directories and 103 files once, with target collision checks. |
| Resource integrity | Resolve assets, references, catalog/playbook indexes, Markdown links, and command/agent paths. |
| Dynamic paths | Exercise or disposition artifact/state path builders and confirm no stale basename remains. |
| Research parity | Compare scenario/resource IDs, state reconstruction, convergence outputs, and command behavior with BASE. |
| Exemption safety | Check SKILL.md, generated state, Python/package, identifiers/keys, tool names, and frozen history. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Impact if Blocked |
|------------|------|-------------------|
| Runtime path closure | Sibling | Research consumers may point at pre-rename runtime resources. |
| Frozen research map | Internal | Source/target ownership and collision proof are unavailable. |
| BASE state/scenario manifest | Internal | Resource and artifact parity cannot be shown. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Missing resource, stale artifact path, scenario-count drift, state mismatch, or research routing change.
- **Procedure**: Revert only the research packet batch, restore the pre-change path/state manifest, and rerun the dynamic-path disposition before retrying.
<!-- /ANCHOR:rollback -->
