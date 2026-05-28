---
title: "Implementation Plan: 003 Exemplars Maintenance"
description: "Plan for TTL, cap, stale reconciliation, and clear operation for Coco exemplars."
trigger_phrases:
  - "027 011 003 plan"
importance_tier: "normal"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-coco-memory-context-extras/003-exemplars-maintenance"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored child plan"
    next_safe_action: "Implement maintenance after children 001 and 002"
    blockers: ["001-exemplars-schema", "002-exemplars-retriever"]
    key_files: ["plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-003-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 003 Exemplars Maintenance

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python |
| **Framework** | Local CocoIndex MCP package |
| **Storage** | Exemplar SQLite/vec0 table |
| **Testing** | pytest |

### Overview
Add maintenance utilities that keep exemplar storage bounded, fresh, and clearable. The work protects the presentation feature from stale or uncontrolled local history.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Schema child is implemented.
- [ ] Retriever identity contract is implemented.
- [ ] Clear operation surface is confirmed.

### Definition of Done
- [ ] TTL cleanup passes tests.
- [ ] Stale reconciliation passes file/range/hash tests.
- [ ] Clear operation deletes only exemplar rows.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Maintenance module with explicit destructive operation boundaries.

### Key Components
- **TTL cleanup**: Finds expired rows and removes them.
- **Cap enforcement**: Evicts oldest eligible rows beyond cap.
- **Reconciliation**: Checks file, range, and hash state.
- **Clear operation**: Deletes exemplar rows for user reset.

### Data Flow
Maintenance receives a database connection and project scope, applies cleanup policies, and reports counts for telemetry or CLI output.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Exemplar table | Stores validated examples | Delete expired or cleared rows | destructive-operation tests |
| Query-time suppression | Avoids stale output | Share reconciliation predicates | stale-row tests |
| CLI or MCP tool surface | Exposes clear action | Add `ccc_examples_clear` if required | tool registration test |

Required inventories:
- Same-class producers: `rg -n "clear|purge|ttl|expires_at" .opencode/skills/mcp-coco-index`.
- Consumers of changed symbols: `rg -n "exemplar_maintenance|ccc_examples_clear" .opencode/skills/mcp-coco-index`.
- Matrix axes: empty table, expired rows, over cap, missing file, invalid range, hash mismatch.
- Algorithm invariant: maintenance must never delete `code_chunks_vec`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read schema and retriever contracts.
- [ ] Confirm clear operation registration surface.
- [ ] Define maintenance report shape.

### Phase 2: Core Implementation
- [ ] Implement TTL cleanup.
- [ ] Implement cap enforcement.
- [ ] Implement stale reconciliation.
- [ ] Implement clear operation.

### Phase 3: Verification
- [ ] Add TTL and cap tests.
- [ ] Add stale condition tests.
- [ ] Add clear operation safety test.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Cleanup predicates and report shape | pytest |
| Integration | SQLite maintenance and clear operation | pytest |
| Manual | CLI or MCP clear invocation if exposed | Local command/tool call |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-exemplars-schema` | Child | Required | Table contract unknown |
| `002-exemplars-retriever` | Child | Required | Identity validation contract unknown |
| `001-cocoindex-complete-fork` | Cross-packet | Required | Tool surface may differ |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Maintenance deletes non-exemplar rows or clear operation is unsafe.
- **Procedure**: Disable clear registration, revert maintenance module, and restore local exemplar table from backup if needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001 schema ──> 002 retriever ──> 003 maintenance
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Children 001 and 002 | Core |
| Core | Setup | Verification |
| Verification | Core | Track A completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Medium | 4 hours |
| Verification | Medium | 2-3 hours |
| **Total** | | **7-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Clear operation test proves only exemplar rows are deleted.
- [ ] Feature remains default-off.
- [ ] Maintenance report counts are visible in tests.

### Rollback Procedure
1. Disable `ccc_examples_clear` registration.
2. Revert maintenance module.
3. Restore local exemplar rows from backup if the operation ran during testing.
4. Re-run schema and retriever tests.

### Data Reversal
- **Has data migrations?** No new migration in this child.
- **Reversal procedure**: Restore or recreate exemplar rows only when local test data matters.
<!-- /ANCHOR:enhanced-rollback -->
