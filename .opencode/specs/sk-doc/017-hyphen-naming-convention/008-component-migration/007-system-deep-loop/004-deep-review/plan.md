---
title: "Implementation Plan: deep-review filesystem names (017 phase 007/004)"
description: "Plan for renaming deep-review assets, catalog/playbook paths, references, and state documentation through the frozen semantic map, then repairing static and dynamic path consumers without changing review contracts."
trigger_phrases:
  - "deep-review implementation plan"
  - "deep review kebab-case rename plan"
  - "review packet reference closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/004-deep-review"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/004-deep-review"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deep review phase plan"
    next_safe_action: "Execute the deep review rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep-review filesystem names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/system-deep-loop/deep-review/` |
| **Change class** | Workflow-packet filesystem rename plus reference repair |
| **Execution** | Isolated worktree using the pinned BASE, review map, and path checker |
| **Verification** | Resource routing, state/report resolution, scenario parity, links, and review checks |

### Overview

Rename the 15 directory families and 96 underscore-bearing files in the review packet. Keep the review resource map, severity/state references, report paths, and command/agent consumers in one closure so the review workflow remains semantically identical under kebab-case names.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The frozen map covers all 15 directories and 96 files with explicit exemptions.
- [ ] BASE review resource, scenario, state, report, and convergence inventories are captured.
- [ ] Dynamic reducer/report path builders and command/agent consumers are listed.

### Definition of Done

- [ ] Review paths and active consumers are kebab-clean and resolvable.
- [ ] Catalog/playbook resource and scenario coverage matches BASE.
- [ ] Severity, convergence, state, report, and command contracts remain unchanged.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Resource layer**: rename assets, references, catalog, playbook, review-dimension, severity, and benchmark paths through a semantic map.
- **State/report layer**: update filesystem path values used by reducers, JSONL reconstruction, reports, and scenario tooling while preserving keys and event names.
- **Consumer layer**: repair `SKILL.md`, README, resource maps, command/agent references, Markdown links, and test fixtures.
- **Content boundary**: leave severity identifiers, finding IDs, YAML/JSON keys, convergence math, and generated output unchanged.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the review frozen map, BASE path manifest, resource inventory, and scenario/state baseline.
- [ ] Trace dynamic reducer, iteration, and report path builders and record every non-filesystem string disposition.

### Phase 2: Core Implementation

- [ ] Rename the review directory families and underscore-bearing asset/reference/catalog/playbook files.
- [ ] Update resource maps, indexes, Markdown links, command/agent paths, test fixtures, and state/report path values.
- [ ] Preserve tool/config names, generated state, identifiers/keys, and all program exemptions.

### Phase 3: Verification

- [ ] Resolve every old/new resource, state, reducer, and report path.
- [ ] Compare catalog leaves, playbook scenarios, review-depth rollout coverage, and finding IDs with BASE.
- [ ] Run review routing/convergence/state checks and confirm non-zero discovery with no contract drift.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Map scan reports all 15 directories and 96 files once, with exact/casefold/NFC collision checks. |
| Resource integrity | Resolve assets, references, catalog/playbook indexes, Markdown links, and command/agent paths. |
| Dynamic paths | Exercise or disposition reducer, iteration, state, and report path builders; search for stale basenames. |
| Review parity | Compare scenario/finding IDs, severity outputs, convergence decisions, and state reconstruction with BASE. |
| Exemption safety | Check tool/config names, generated state, Python/package, identifiers/keys, and frozen history. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Impact if Blocked |
|------------|------|-------------------|
| Runtime path closure | Sibling | Review consumers may point at pre-rename runtime resources. |
| Frozen review map | Internal | Source/target ownership and collision proof are unavailable. |
| BASE review/state manifest | Internal | Scenario, report, and convergence parity cannot be shown. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Missing resource, stale reducer/report path, finding or scenario drift, state mismatch, or review routing change.
- **Procedure**: Revert only the review packet batch, restore the pre-change path/state manifest, and rerun dynamic-path dispositions before retrying.
<!-- /ANCHOR:rollback -->
