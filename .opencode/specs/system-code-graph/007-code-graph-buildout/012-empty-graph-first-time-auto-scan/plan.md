---
title: "Implementation Plan: empty-graph first-time auto-establish"
description: "Add a scope predicate + a read-path gate so an empty graph auto-builds on first read under the default end-user scope, while a .opencode-opted-in scope keeps the manual code_graph_scan gate."
trigger_phrases:
  - "empty graph auto scan plan"
  - "code graph auto-establish plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/012-empty-graph-first-time-auto-scan"
    last_updated_at: "2026-05-29T11:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented + verified auto-establish"
    next_safe_action: "Restart the mk-code-index MCP server to load rebuilt dist"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Empty-Graph First-Time Auto-Establish

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node), standalone `mk-code-index` MCP server |
| **Framework** | MCP server + better-sqlite3 + tree-sitter |
| **Storage** | SQLite code graph + readiness marker |
| **Testing** | vitest |

### Overview
Add `isDefaultEndUserScope()` to the scope policy and a `firstTimeAutoEstablish` branch in `ensureCodeGraphReady`'s guarded-full-scan gate. When the graph is empty AND the active scope is the default end-user-code scope AND the caller opted into a guarded inline full scan, allow the establishing scan to run on the read path instead of returning `blocked`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Behavior + scope policy understood (from the 004 audit)
- [x] Gating rule agreed with operator (empty + default scope only)
- [x] Default scope config confirmed unchanged

### Definition of Done
- [x] Gate implemented; populated graphs unaffected
- [x] Tests for predicate + auto-establish + still-blocked path
- [x] tsc clean, full vitest green, alignment PASS, dist rebuilt
- [x] `validate.sh --strict` exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-path handlers call `ensureCodeGraphReady`. The guarded-full-scan gate decides whether a read may run an inline full scan; this change adds a first-time-establish allowance to that gate.

### Key Components
- **`index-scope-policy.ts`**: `isDefaultEndUserScope(policy)` — true when no `.opencode` opt-ins.
- **`ensure-ready.ts`**: `firstTimeAutoEstablish = empty && allowGuardedInlineFullScan && isDefaultEndUserScope(active)`; feeds `canRunFullScan`.

### Data Flow
read → `ensureCodeGraphReady` → (empty + default scope + guarded) → inline full scan → fresh → answer; otherwise → blocked.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `index-scope-policy.ts` | scope resolution | add `isDefaultEndUserScope` | unit tests (default true; any opt-in false) |
| `ensure-ready.ts` guarded gate | block-vs-scan decision | add first-time-establish allowance | integration tests (auto-establish + still-blocked) |
| `code_graph_query` / `code_graph_context` | guarded read callers | unchanged (already pass `allowGuardedInlineFullScan`) | full suite green |
| `detect_changes` | strict read | unchanged (no guarded opt-in) | stays blocking |
| existing guarded tests (nodeCount 1) | stale-path coverage | unchanged | pass (not empty) |

Required inventories:
- Guarded callers: `rg -n 'allowGuardedInlineFullScan' mcp_server`.
- Scope predicate consumers: `rg -n 'isDefaultEndUserScope' mcp_server`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm scope-config intent with operator + record to memory
- [x] Confirm existing guarded tests use populated graphs (unaffected)

### Phase 2: Core Implementation
- [x] Add `isDefaultEndUserScope()` predicate
- [x] Add `firstTimeAutoEstablish` to the guarded-full-scan gate

### Phase 3: Verification
- [x] Unit + integration tests; tsc; full vitest; alignment; dist rebuild
- [x] `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `isDefaultEndUserScope` (default true; skills/agents/commands/specs/plugins/list opt-in false) | vitest |
| Integration | empty+default → auto-scans (`indexFiles` called); empty+opted-in → blocks | vitest (env-stubbed) |
| Regression | populated/stale guarded path unchanged; stress blocked-contract pinned to opted-in scope | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `resolveIndexScopePolicy()` | Internal | Green | Source of the active scope the gate reads |
| Guarded full-scan path + 10s timeout | Internal | Green | Reused to run + bound the establishing scan |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Auto-establish fires when unwanted, or first-scan latency is unacceptable.
- **Procedure**: Revert the single `firstTimeAutoEstablish` commit; the predicate is inert without it. No data migration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (confirm) ──► Phase 2 (implement) ──► Phase 3 (verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hour |
| Core Implementation | Low | 1 hour |
| Verification | Low | 1 hour |
| **Total** | | **~2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Full vitest suite green before merge
- [x] Auto-establish + still-blocked tests added
- [x] Change isolated to one commit

### Rollback Procedure
1. `git revert` the auto-establish commit.
2. Re-run the code-graph vitest suite.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (no schema change; graph rebuilds on next scan)
<!-- /ANCHOR:enhanced-rollback -->
