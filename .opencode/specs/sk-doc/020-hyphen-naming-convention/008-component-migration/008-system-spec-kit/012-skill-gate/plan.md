---
title: "Implementation Plan: System-spec-kit skill gate (032 subtree 008 phase 012)"
description: "This rollup gate aggregates phases 001-011 and verifies that the complete system-spec-kit naming surface is kebab-clean outside the declared exemption set. It adds no migration work: acceptance depends on sibling evidence, a scope-aware whole-tree scan, reference closure, and coherent release evidence."
trigger_phrases:
  - "system-spec-kit skill gate"
  - "system-spec-kit subtree naming gate"
  - "kebab-clean system-spec-kit"
  - "system-spec-kit phase 012"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/012-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned system-spec-kit gate"
    next_safe_action: "Aggregate phases 001-011 and run the scope-aware naming gate"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: System-spec-kit skill gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/system-spec-kit/` |
| **Change class** | Evidence aggregation and scope-aware naming/reference gate |
| **Execution** | Read-only rollup pinned to candidate/base; no new migration work |

### Overview
Build a sibling-status matrix for phases 001-011, replay each phase’s blocking evidence, run a complete scope-aware tree/reference census, verify the exemption ledger, and publish a fail-closed rollup result.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001-011 have authored reports, maps, and checklist evidence.
- [ ] Candidate/base SHAs and the program exemption ledger are pinned.
- [ ] The whole-tree naming and active-reference scan scope is explicit.

### Definition of Done
- [ ] Every sibling phase is accepted with no stale or contradictory status.
- [ ] Whole-tree scan has zero in-scope snake_case filesystem names and zero unknown dispositions.
- [ ] Active references resolve and phase 011 release evidence covers the subtree.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
- Treat each child checklist as a required evidence input; do not replace a missing child result with a parent inference.
- Run the whole-tree scan with explicit exclusions for Python, tool-mandated, generated/lockfile/vector/checkpoint, test-magic, and frozen-history paths.
- Separate filesystem-name findings from identifiers, keys, frontmatter values, and prose that are not path targets.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Aggregate
- Collect phase 001-011 checklist results, candidate maps, consumer ledgers, exemption ledgers, and scoped diff evidence.
- Reconcile packet paths, phase statuses, and release version evidence against the pinned candidate/base context.

### Phase 2: Whole-Surface Verification
- Scan `.opencode/skills/system-spec-kit/` recursively for filesystem names and active references that violate the program boundary.
- Compare findings with sibling ledgers; classify every residual underscore-bearing name and fail on unknown or contradictory disposition.
- Confirm the three runtime agent roots’ zero-candidate result and the phase 011 changelog/version result.

### Phase 3: Handoff
- Publish the final sibling-status matrix, scan output, unresolved-reference report, exemption ledger, and release evidence.
- Block the parent handoff until every P0/P1 checklist item and every whole-surface condition is satisfied.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Sibling matrix with phase 001-011 checklist evidence and no stale status. |
| REQ-002 | Recursive scope-aware naming census with zero in-scope candidates. |
| REQ-003 | Active reference/link/registry/manifest/runner resolution report. |
| REQ-004 | Complete exemption ledger with zero unknown entries. |
| REQ-005 | Changelog/version evidence cross-check with phase 011. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001-011 | Internal | Required | Rollup cannot accept incomplete sibling work. |
| Program exemption ledger | Policy | Required | Scan would produce false positives or miss true candidates. |
| Pinned candidate/base context | Evidence | Required | Results would not be reproducible. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

No migration rollback is applicable because phase 012 is read-only. If aggregation or scanning fails, retain all sibling artifacts, report the blocking evidence gap, and rerun the gate after the owning phase corrects its evidence; do not add ad hoc exemptions or edit source paths here.
<!-- /ANCHOR:rollback -->

