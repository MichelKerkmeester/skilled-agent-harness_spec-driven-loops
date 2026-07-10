---
title: "Implementation Plan: success-rows-missing-active-vector coverage hygiene"
description: "Plan for a low-volume detection + repair-by-re-embed hygiene pass that resets success rows missing an active vector surface to retry, reusing the 006 active-shard verification."
trigger_phrases:
  - "success vector coverage plan"
  - "missing vector hygiene implementation"
  - "vector coverage repair plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/007-success-vector-coverage-hygiene"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 1 plan for success-vector coverage hygiene"
    next_safe_action: "Implement detection + guarded repair (reset to retry), then run vitest"
    blockers: []
    key_files:
      - "mcp_server/lib/embedders/embedding-reconcile.ts"
      - "mcp_server/tests/embedding-reconcile.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-007"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: success-rows-missing-active-vector coverage hygiene

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js, MCP server) |
| **Framework** | mk-spec-memory MCP context-server + better-sqlite3 |
| **Storage** | `context-index.sqlite` (`memory_index`) + attached active vector shard (`vec_<dim>`, `vec_memories_rowids`) |
| **Testing** | Vitest (`mcp_server/tests/embedding-reconcile.vitest.ts`) |

### Overview
This adds a low-volume detection + repair hygiene pass for the inverse of the fixed backlog bug: `embedding_status='success'` rows that are missing from an active vector surface (~23 rows on the live DB, ~0.24% of success rows). Detection counts/lists them guarded by `activeShardVerified`; repair resets them to `retry` so the retry-manager re-embeds and regenerates the missing vector. It is independent of packet 006 but reuses the same active-shard verification approach, and is most naturally implemented as a sibling exported function in the reconcile lib.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified (active-shard verification, retry-manager re-embed)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..003)
- [ ] Tests passing (detection/repair/coverage/idempotency)
- [ ] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sibling helper in the reconcile lib — a `findSuccessRowsMissingActiveVector`-style detector plus a guarded repair — reusing the active-shard verification from packet 006. Final wiring (standalone function vs. folded into the reconcile result) is decided during implementation.

### Key Components
- **Detection helper** (`lib/embedders/embedding-reconcile.ts`): counts/lists `success` rows missing `vec_memories_rowids` rowid OR `vec_<dim>` id, guarded by `activeShardVerified`.
- **Guarded repair**: resets detected rows to `retry` (`retry_count=0`, `failure_reason=NULL`); dry-run default; fail closed on unverified shard.

### Data Flow
1. Resolve + verify the active shard (shared approach with 006).
2. Detect success rows missing an active vector surface.
3. Dry-run reports the count/list; apply resets them to `retry`.
4. The retry-manager subsequently re-embeds them and regenerates the missing vector.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm active-shard verification helper from packet 006 is reusable
- [ ] Confirm the detection predicate shape against `active_vec.vec_memories_rowids` and `vec_<dim>`
- [ ] Decide wiring: sibling export vs. folded result

### Phase 2: Core Implementation
- [ ] Implement detection helper (count/list, guarded by `activeShardVerified`)
- [ ] Implement guarded repair (reset to `retry`, dry-run default, fail closed)
- [ ] Wire the chosen surface into the reconcile lib

### Phase 3: Verification
- [ ] Detection counts a seeded missing-vector success row
- [ ] Apply resets it to `retry`; rows with full coverage untouched
- [ ] Idempotency (second run finds 0); documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Detection predicate, repair reset shape, fail-closed guard | Vitest |
| Integration | Seeded fixture: missing-vector success row detected + reset; covered rows untouched; idempotency | Vitest + better-sqlite3 |
| Manual | Dry-run against current DB confirms ~23-row detection | MCP / vitest fixture |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Active-shard verification (shared with 006) | Internal | Green | Cannot detect/repair safely |
| Retry-manager re-embed path | Internal | Green | Reset rows never re-embed |
| `embedding-reconcile.ts` lib (packet 006) | Internal | Green | No natural home for the sibling helper |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Detection miscounts, or repair resets rows that actually have coverage.
- **Procedure**: Revert the packet commits; repair only updates `embedding_status` to `retry` (no deletes), so any erroneous reset is re-embedded by the retry-manager and converges back to `success`.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
