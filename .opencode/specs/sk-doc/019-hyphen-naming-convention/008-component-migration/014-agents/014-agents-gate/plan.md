---
title: "Implementation Plan: agents surface rollup gate (017 phase 014)"
description: "Implementation Plan for phase 014 of the 017 agents component migration: aggregate sibling evidence and close the whole agents naming surface."
trigger_phrases:
  - "agents surface rollup gate implementation plan"
  - "agents naming gate plan"
  - "017 phase 014 agents plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/014-agents"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/014-agents/014-agents-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored agents gate docs"
    next_safe_action: "Execute agents rollup gate"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Agents Surface Rollup Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | 014-agents sibling evidence and the three runtime agent directories |
| **Change class** | Rollup verification gate |
| **Execution** | Read-only aggregation against the pinned BASE; migration is not executed |

### Overview
The gate consumes the 13 leaf checklists, verifies the 39 expected definition paths, unions their candidate sets, and performs a whole-directory name scan. A green result requires an empty aggregate candidate set and no in-scope snake_case filesystem name outside the policy exemptions.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The 13 sibling leaf checklists exist
- [ ] The pinned BASE and the three runtime roots are available
- [ ] The parent phase map names all 13 definitions and this gate
- [ ] The kebab-case policy and exemption set are authoritative

### Definition of Done
- [ ] Every sibling P0 result is reviewed and represented in the rollup
- [ ] Exactly 39 definition paths are accounted for
- [ ] The union of sibling candidate sets is exactly ∅
- [ ] The whole agents surface is clean within the program scope
- [ ] No runtime file is modified by the gate
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The gate uses three evidence layers:

- Sibling layer: one path-level candidate record for each of the 13 leaf phases.
- Definition layer: the expected 39-path matrix across .opencode/agents, .claude/agents, and .codex/agents.
- Surface layer: a recursive filename scan over the three roots, with exemption-aware classification and explicit treatment of README.txt support files.

The blocking invariant is: every expected definition path is present exactly once, every sibling candidate set is explicit, their union is ∅, and no additional in-scope snake_case name is hidden outside the 39 definition paths.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm all 13 sibling checklists and the pinned BASE are available.
- Load the parent phase map and the policy exemption boundary.

### Phase 2: Implementation
- Build the 14-row sibling evidence matrix.
- Reconcile the 39 expected definition paths with the runtime inventory.
- Union the sibling candidate sets and record any discrepancy as a blocker.

### Phase 3: Verification
- Run the whole agents-directory filename scan.
- Confirm no in-scope snake_case filesystem name remains outside exemptions.
- Confirm the gate changed only assigned documentation and has no unassigned migration task.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Review all 13 sibling checklists and record each P0 result in the rollup matrix |
| REQ-002 | Compare the runtime inventory with the exact 39-path expected set and fail on missing or extra definitions |
| REQ-003 | Compute the union of sibling candidate sets and require ∅ |
| REQ-004 | Perform an exemption-aware recursive name scan over the three runtime roots |
| REQ-005 | Review the path-scoped diff and confirm no runtime file or content changes |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001-ai-council-verify through 013-review-verify | Internal | Required | The rollup cannot prove leaf coverage |
| 017 convention policy and exemption boundary | Internal | Required | The whole-surface scan has no authoritative scope |
| Pinned BASE inventory | Internal | Required | Counts and path evidence are not reproducible |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A sibling is missing, the 39-path inventory does not reconcile, a candidate set is non-empty, or a runtime file changes.
- **Procedure**: Mark the gate blocked, preserve the discrepancy evidence, and rerun the rollup from the pinned BASE after the responsible leaf is corrected. No runtime rollback is needed because this gate performs no migration.
<!-- /ANCHOR:rollback -->
