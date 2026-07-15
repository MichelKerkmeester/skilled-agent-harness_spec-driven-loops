---
title: "Implementation Plan: sk-doc subtree rollup gate"
description: "Read-only aggregation and whole-surface naming gate for the sk-doc component phases."
trigger_phrases:
  - "sk-doc skill gate plan"
  - "sk-doc naming rollup plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/007-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/007-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored sk-doc rollup gate plan"
    next_safe_action: "Collect all sibling checklist evidence"
    blockers: []
    key_files: [".opencode/skills/sk-doc/", "../003-create-packets/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-doc subtree rollup gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-doc/` and all assigned child evidence |
| **Change class** | Read-only aggregation and final naming census |
| **Execution** | After every executable sibling phase; no migration mutation |

### Overview

Collect the direct and nested checklist/report receipts, verify zero-row phase evidence, and run the final exemption-aware filesystem census. The gate reports findings and blocks on residue; it does not repair another phase's surface.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Direct phase checklists and all eleven create-packet checklists are available.
- [ ] Phase 006 changelog/version evidence is available.
- [ ] The 001 exemption set and final census command are pinned.

### Definition of Done

- [ ] Every executable child has a passing evidence row.
- [ ] Whole-surface candidate count is zero outside exemptions.
- [ ] Gate diff is documentation/evidence only.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Evidence matrix**: one row per direct and nested leaf, including zero-row phases.
- **Exemption classifier**: explicit checks for Python, package, mandated, key, and frozen classes.
- **Whole-surface census**: scan `.opencode/skills/sk-doc` and compare candidate count to the aggregate rename map.
- **Read-only gate**: report residue to the owning phase; do not mutate the surface.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Enumerate direct leaves and nested create-packet leaves.
- [ ] Collect checklist/report hashes, zero-row receipts, and changelog/version evidence.

### Phase 2: Implementation

- [ ] Perform no migration or repair in the rollup phase.
- [ ] Build the aggregate evidence table and exemption accounting.

### Phase 3: Verification

- [ ] Run the whole-surface candidate census and compare to the expected zero residue.
- [ ] Confirm no unclassified paths, stale references, or missing phase evidence remain.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Evidence matrix covering all direct/nested child checklists |
| REQ-002 | Zero-row reports for root benchmark and create-diff |
| REQ-003 | Whole `.opencode/skills/sk-doc` filesystem census |
| REQ-004 | Path-by-path exemption reconciliation |
| REQ-005 | Phase 006 release/version comparison |
| REQ-006 | Scoped diff and mutation audit |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Direct/nested sibling checklists | Evidence | Planned | Gate cannot close |
| 001 convention policy | Internal contract | Required | Whole-surface classification is ambiguous |
| Phase 006 changelog verify | Release evidence | Planned | Version/scope proof is incomplete |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A child report is missing/failed or the final census finds residue.
- **Procedure**: Keep the gate open, route the finding to its owning phase, and rerun the read-only aggregation after evidence changes; do not repair from this phase.
<!-- /ANCHOR:rollback -->
