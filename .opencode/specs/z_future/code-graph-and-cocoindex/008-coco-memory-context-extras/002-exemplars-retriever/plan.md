---
title: "Implementation Plan: 002 Exemplars Retriever"
description: "Plan for adding Coco exemplar retrieval and separate response output."
trigger_phrases:
  - "027 011 002 plan"
importance_tier: "normal"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/008-coco-memory-context-extras/002-exemplars-retriever"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored child plan"
    next_safe_action: "Implement retriever after child 001"
    blockers: ["001-exemplars-schema"]
    key_files: ["plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-002-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 002 Exemplars Retriever

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python |
| **Framework** | Local CocoIndex MCP package |
| **Storage** | Exemplar SQLite/vec0 table from child 001 |
| **Testing** | pytest |

### Overview
Add a query-time exemplar retriever that reads from the exemplar table and emits a separate response group. The normal query result ordering remains the source of truth.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Child 001 schema contract validated.
- [ ] Query response envelope from the CocoIndex fork is known.
- [ ] Feature flag name and default-off behavior are confirmed.

### Definition of Done
- [ ] Retriever returns top-3 matches over threshold.
- [ ] Query integration preserves normal result ordering.
- [ ] Cold-start and flag-off tests pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Post-query presentation extension.

### Key Components
- **Retriever**: Queries exemplar embeddings and returns validated exemplar rows.
- **Response adapter**: Adds `exemplars` beside existing results.
- **Flag guard**: Prevents any retriever call when disabled.

### Data Flow
Coco query computes normal results first. If enabled, the retriever searches exemplar rows with the query embedding, validates identity fields, and attaches a separate exemplar group.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Query response | Returns ranked results | Add optional separate exemplar group | snapshot parity test |
| Exemplar table | Stores validated examples | Read top matches | threshold and cap tests |
| Feature flags | Gate experimental behavior | Add default-off guard | flag-off diff test |

Required inventories:
- Same-class producers: `rg -n "QueryResult|ranking|results" .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code`.
- Consumers of changed symbols: `rg -n "exemplars|query.py|protocol" .opencode/skills/mcp-coco-index`.
- Matrix axes: flag off, flag on empty bank, below threshold, above threshold, stale identity.
- Algorithm invariant: exemplar retrieval must never reorder or mutate normal results.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read child 001 schema module.
- [ ] Read Coco query response path.
- [ ] Define retriever input and output types.

### Phase 2: Core Implementation
- [ ] Implement top-k exemplar lookup.
- [ ] Implement threshold and cap behavior.
- [ ] Wire separate response group behind feature flag.

### Phase 3: Verification
- [ ] Add cold-start test.
- [ ] Add ordering parity snapshot.
- [ ] Add threshold and cap tests.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Retriever filtering and threshold behavior | pytest |
| Integration | Query response with exemplar group | pytest |
| Manual | Flag-off response comparison | CLI query fixture |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-exemplars-schema` | Child | Required | Retriever has no storage contract |
| `005-cocoindex-complete-fork` | Cross-packet | Required | Query path may differ |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Query response parity fails or exemplar group causes caller errors.
- **Procedure**: Disable the exemplar feature flag and revert the query response hook.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001-exemplars-schema ──> Retriever ──> Query hook ──> Tests
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Child 001 | Core |
| Core | Setup | Verification, child 003 |
| Verification | Core | Child 003 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Medium | 4-5 hours |
| Verification | Medium | 2 hours |
| **Total** | | **7-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Feature flag default remains false.
- [ ] Snapshot parity test exists.
- [ ] Cold-start path tested.

### Rollback Procedure
1. Set `SPECKIT_COCOINDEX_EXEMPLARS=false`.
2. Revert query response hook.
3. Keep schema table inert until follow-up cleanup.
4. Re-run query parity tests.

### Data Reversal
- **Has data migrations?** No new migration in this child.
- **Reversal procedure**: Leave existing exemplar rows untouched; this child only reads them.
<!-- /ANCHOR:enhanced-rollback -->
