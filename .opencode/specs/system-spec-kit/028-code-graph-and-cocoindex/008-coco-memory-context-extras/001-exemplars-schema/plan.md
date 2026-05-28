---
title: "Implementation Plan: 001 Exemplars Schema"
description: "Plan for adding Coco exemplar schema and migration support."
trigger_phrases:
  - "027 011 001 plan"
importance_tier: "normal"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/008-coco-memory-context-extras/001-exemplars-schema"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored child plan"
    next_safe_action: "Implement schema module after Phase 005 dependency"
    blockers: ["system-spec-kit/028-code-graph-and-cocoindex/005-cocoindex-complete-fork"]
    key_files: ["plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-001-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 001 Exemplars Schema

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python |
| **Framework** | Local CocoIndex MCP package |
| **Storage** | SQLite with vec0 where available |
| **Testing** | pytest |

### Overview
Add the storage foundation for Coco exemplars without touching retrieval behavior. The implementation should define an idempotent migration and a narrow schema that later children can reuse for retrieval and maintenance.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 005 complete fork dependency is available.
- [ ] Existing CocoIndex schema constants are read from the fork.
- [ ] Privacy rule is reflected in the schema design.

### Definition of Done
- [ ] Migration creates the exemplar table.
- [ ] Repeat migration is idempotent.
- [ ] pytest coverage validates schema, privacy, and failure behavior.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Small Python schema module with explicit migration helper.

### Key Components
- **Schema constants**: Table name, column names, and vector dimension binding.
- **Migration helper**: Creates `coco_query_examples_vec` without touching `code_chunks_vec`.
- **Validation helper**: Confirms required columns exist after migration.

### Data Flow
The migration receives a database connection, checks extension support, creates exemplar storage if missing, and returns a compact status object for tests and later callers.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| CocoIndex schema module | Owns code chunk table shape | Add separate exemplar schema module | pytest schema introspection |
| CocoIndex database | Stores vector rows locally | Add exemplar table only | Repeat migration test |
| Feedback comments | Stay in feedback audit data | Keep out of exemplar schema | grep and row-shape test |

Required inventories:
- Same-class producers: `rg -n "code_chunks_vec|vec0|embedding" .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code`.
- Consumers of changed symbols: `rg -n "examples_schema|coco_query_examples_vec" .opencode/skills/mcp-coco-index`.
- Matrix axes: empty database, existing database, vec0 unavailable, duplicate migration.
- Algorithm invariant: code chunk reindexing must not delete exemplar rows.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read Phase 005 fork schema and indexer code.
- [ ] Create `exemplars/` package if missing.
- [ ] Define schema constants.

### Phase 2: Core Implementation
- [ ] Implement idempotent migration helper.
- [ ] Implement post-migration schema validation helper.
- [ ] Guard against storing free-form comments.

### Phase 3: Verification
- [ ] Add pytest coverage for migration paths.
- [ ] Add privacy/schema row-shape test.
- [ ] Run child strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Schema constants and validation helper | pytest |
| Integration | SQLite migration against temp database | pytest |
| Manual | Review table separation from `code_chunks_vec` | `sqlite3` or test introspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `005-cocoindex-complete-fork` | Cross-packet | Required | Target package layout may not exist |
| vec0 extension | Runtime | Confirm during implementation | Exemplar vector table cannot be created |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Migration breaks local CocoIndex database startup or schema validation.
- **Procedure**: Disable exemplar feature flag, remove schema module changes, and drop only `coco_query_examples_vec` in local dev databases when needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 005 fork ──> Schema setup ──> Migration helper ──> Tests
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 005 fork | Core |
| Core | Setup | Verification, child 002 |
| Verification | Core | Child 002 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Medium | 3-4 hours |
| Verification | Medium | 2 hours |
| **Total** | | **6-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Exemplar feature flag remains default-off.
- [ ] Migration test confirms no writes to `code_chunks_vec`.
- [ ] Local database backup guidance documented if needed.

### Rollback Procedure
1. Disable exemplar schema call sites.
2. Revert Python schema changes.
3. Drop the exemplar table only in local development databases if created.
4. Re-run CocoIndex startup tests.

### Data Reversal
- **Has data migrations?** Yes.
- **Reversal procedure**: Drop `coco_query_examples_vec`; no production data should exist while default-off.
<!-- /ANCHOR:enhanced-rollback -->
