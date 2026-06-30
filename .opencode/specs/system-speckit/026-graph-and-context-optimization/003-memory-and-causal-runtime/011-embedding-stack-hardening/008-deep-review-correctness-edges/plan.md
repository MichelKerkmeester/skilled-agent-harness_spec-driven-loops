---
title: "Implementation Plan: Deep-review correctness edges"
description: "Re-validate each deep-review correctness finding against HEAD; land confirmed isolated ones with tests; disposition the rest."
trigger_phrases:
  - "deep review correctness edges plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/008-deep-review-correctness-edges"
    last_updated_at: "2026-05-29T23:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "3 fixes landed + tested"
    next_safe_action: "Commit; then packet 009 (C3)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003182"
      session_id: "031-008-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep-review correctness edges

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server + shared); vitest |
| **Framework** | system-spec-kit memory/embedder internals |
| **Storage** | better-sqlite3 (memory_index); in-memory adapter cache |
| **Testing** | `npm run build --workspace=@spec-kit/{shared,mcp-server}`, `./node_modules/.bin/vitest run <files>` from mcp_server |

### Overview
Re-validate each finding at HEAD (the comment sweep shifted lines), apply minimal patches to the confirmed isolated ones, add a regression test per fix, and record the rationale for findings left unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Finding re-validated against HEAD (defect confirmed or refuted)
- [x] Design decision chosen for each landed fix
- [x] Test approach identified

### Definition of Done
- [x] Minimal patch + regression test per landed fix
- [x] Builds pass; the 3 suites pass
- [x] Dispositioned findings documented
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Point fixes to existing modules; no new components.

### Key Components
- **memory-retention-sweep**: `isStillExpired` predicate re-checked inside the delete tx.
- **execution-router**: dimension-aware cache invalidation on hit.
- **auto-select**: explicit-provider precedence in the bootstrap cascade.

### Data Flow
Unchanged except the corrected guards/ordering described above.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Three bug-fix findings touching memory deletion, adapter caching, and embedder selection.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runMemoryRetentionSweep` | Deletes expired rows | Add in-tx re-validation | `memory-retention-sweep.vitest.ts` (10 tests) |
| `getEmbedderAdapter` | Caches adapters by provider:model | Re-create on dim mismatch | `execution-router.vitest.ts` (14 tests) |
| `selectWithoutPersistence` | Local-first cascade | Prefer explicit provider | `embedder-auto-selection.vitest.ts` (9 tests) |
| `acquireFilesystemLock` | Cross-process serialization | Unchanged (intentional degradation) | Re-validation note |

Required inventories:
- Per-finding HEAD re-read by symbol (line numbers stale post-sweep).
- Consumers of changed symbols confirmed unaffected (cache key unchanged for teardown; predicate mirrors selectExpiredRows; cascade order only reordered).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-validate all 7 findings at HEAD; classify (land / disposition / route-to-009)

### Phase 2: Core Implementation
- [x] DR-014 fix + test
- [x] DR-013 fix + test
- [x] DR-001/015 fix + test

### Phase 3: Verification
- [x] Build both workspaces; run the 3 suites (10 + 14 + 9 pass)
- [x] Strict-validate the packet; commit
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | TOCTOU predicate | vitest |
| Regression | adapter dim invalidation; explicit-provider precedence | vitest |
| Build | both workspaces | tsc |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Deep-review report (031/review) | Internal | Green | Source of findings |
| Existing vitest harnesses | Internal | Green | Reused for regression tests |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a regression surfaces in retention/adapter/bootstrap behavior.
- **Procedure**: `git revert` the commit; each fix is independent and small. No migrations/state.
<!-- /ANCHOR:rollback -->
