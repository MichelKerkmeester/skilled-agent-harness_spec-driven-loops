---
title: "Implementation Plan: Skill gate (032 phase 012)"
description: "Execution plan for Skill gate in the 032 sk-design naming subtree."
trigger_phrases:
  - "skill-gate implementation plan"
  - "sk-design skill gate plan"
  - "032 skill-gate tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/012-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/012-skill-gate"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored skill gate plan"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill gate (032 phase 012)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|-------|-------|
| **Surface** | the complete `.opencode/skills/sk-design/` naming and reference surface |
| **Change class** | Verification-only gate |
| **Execution** | Pinned isolated worktree; migration execution is a later pass |

Aggregate sibling evidence and verify the complete sk-design surface is kebab-clean outside the declared exemptions, without introducing new migration work.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The live phase boundary and exemption set are recorded.
- [ ] Every phase-owned underscore path has a disposition or the phase proves it is absent.
- [ ] The source→target map, consumer inventory, and rollback route are available.

### Definition of Done
- [ ] The phase checklist is satisfied with pinned evidence.
- [ ] No stale or broken path reference remains in the phase surface.
- [ ] No semantic identifier, data key, frontmatter field, Python path, or tool-mandated name was altered.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only evidence gate over a scoped filesystem and reference inventory

### Key Components
- **Inventory**: the live the complete `.opencode/skills/sk-design/` naming and reference surface tree and its exact candidate paths.
- **Policy boundary**: kebab-case for filesystem names, except Python scripts/package directories and tool-mandated names.
- **Reference ledger**: every path-valued consumer is updated or explicitly marked unchanged.
- **SOL checklist**: blocking acceptance contract with evidence-pinned commands, counts, and clean-worktree proof.

### Data Flow
Sibling reports + complete filesystem inventory → exemption-aware reference sweep → rollup verdict.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the pinned BASE, phase boundary, and clean isolated worktree.
- [ ] Read the current phase-owned path inventory and canonical exemption policy.
- [ ] Freeze the evidence inputs before any execution.

### Phase 2: Core execution
- [ ] Load sibling checklist/evidence contracts and reject missing, stale, or contradictory phase status.
- [ ] Build the complete sk-design filesystem inventory, classify candidates using the canonical exemption set, and resolve every path-valued consumer.
- [ ] Emit a read-only rollup verdict with zero unknown candidates and no new migration edits.

### Phase 3: Verification
- [ ] Run every phase-specific checklist item with concrete path, count, or content evidence.
- [ ] Compare before/after inventories and confirm no unexpected tracked mutation.
- [ ] Record the handoff evidence for the next sibling or rollup gate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-------|-------|-------|
| Evidence aggregation | Sibling checklists and reports | All P0/P1 gates passed |
| Filesystem inventory | Complete sk-design tree | Zero in-scope snake_case names |
| Reference sweep | Markdown/data/shell consumers | Zero stale or broken paths |
| Exemption audit | Tool/Python/key boundaries | No prohibited rename |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|-------|-------|-------|-------|
| Phases 001–011 checklists | Internal | Required | Rollup cannot pass |
| Canonical exemption policy | Internal | Required | Names cannot be classified safely |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any missing, contradictory, or failed evidence in the read-only gate.
- **Procedure**: Do not repair in this phase; return the exact failing evidence to the owning sibling/coordinator and rerun after the source state changes.
<!-- /ANCHOR:rollback -->
