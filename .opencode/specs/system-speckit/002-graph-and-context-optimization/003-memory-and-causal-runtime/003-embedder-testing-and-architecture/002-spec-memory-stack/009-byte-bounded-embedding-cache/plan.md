---
title: "Implementation Plan: Byte-Bounded Embedding Cache"
description: "Implement profile-aware cache schema migration, byte-budget LRU eviction, query-cache wiring, and full-report cache byte diagnostics."
trigger_phrases:
  - "byte-bounded embedding cache plan"
  - "profile keyed embedding cache plan"
  - "query cache wiring plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/009-byte-bounded-embedding-cache"
    last_updated_at: "2026-05-18T21:40:00Z"
    last_updated_by: "codex"
    recent_action: "Verified cache implementation"
    next_safe_action: "Commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedding-cache-byte-bounded.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0160020091111111111111111111111111111111111111111111111111111111"
      session_id: "phase-016-002-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Byte-Bounded Embedding Cache

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Spec Kit MCP server |
| **Storage** | SQLite via `better-sqlite3` |
| **Testing** | Vitest, TypeScript typecheck, strict spec validation, build |

### Overview
Move persistent embedding cache ownership into `embedding-cache.ts`: schema migration, profile/task keying, byte accounting, and LRU eviction. Then pass explicit document/query keys from save and search paths, and expose the resulting byte totals through full health reports.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research source read: deep-research-005 iteration 010 Finding 4.
- [x] Current cache, save, query, and health source files read before editing.
- [x] Files to change are frozen to packet scope.

### Definition of Done
- [x] Strict spec validation passes.
- [x] MCP server typecheck passes.
- [x] `embedding-cache-byte-bounded` Vitest target passes.
- [x] Existing `embedding-cache` Vitest target passes.
- [x] MCP server build passes.
- [x] Integration probe verifies eviction and `shrink_memory`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Cache-owner migration and budget enforcement with narrow call-site opt-in.

### Key Components
- **Embedding cache module**: owns schema, profile/key helpers, store/lookup compatibility, byte estimates, and eviction.
- **Document embedding pipeline**: computes normalized content hash, active profile key, and `input_kind='document'`.
- **Query embedding wrapper**: checks `input_kind='query'` before provider calls and stores query vectors on miss.
- **Health handler**: composes real SQLite cache bytes and profile/kind stats into full reports only.

### Data Flow
Call sites compute a content hash and active profile key, then call `lookupEmbedding()` with an input kind. Cache misses invoke the configured embedder and call `storeEmbedding()`, which writes the row and immediately runs byte-budget maintenance. `memory_health({ includeFullReport:true })` reads aggregate bytes directly from SQLite.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm Rec 4 requirements from iteration 010.
- [x] Read current source and adjacent tests.
- [x] Establish Level 1 packet.

### Phase 2: Core Implementation
- [x] Add schema migration and cache API options.
- [x] Add byte-budget eviction and `shrink_memory`.
- [x] Wire document and query cache paths.
- [x] Extend health report diagnostics.
- [x] Add tests and docs.

### Phase 3: Verification
- [x] Run strict spec validation.
- [x] Run typecheck.
- [x] Run targeted new Vitest.
- [x] Run existing cache Vitest.
- [x] Run build.
- [x] Run integration probe.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Cache schema migration, profile/kind keys, byte caps, pragma call | Vitest |
| Regression | Existing embedding cache behavior and legacy lookup compatibility | Vitest |
| Static | Type correctness and build output | TypeScript, npm build |
| Spec | Level 1 packet contract | `validate.sh --strict` |
| Integration | Fresh DB inserts over byte cap and observes eviction | Node probe |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| SQLite `ALTER TABLE` migration | Runtime | Green | Cache schema cannot evolve safely |
| `vec_metadata` active profile rows | Internal | Green | Profile key falls back to model/dim when absent |
| Vitest | Test | Green | Targeted cache tests unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Cache migration failure, query/document vector incompatibility, or unacceptable eviction behavior.
- **Procedure**: Revert scoped cache, call-site, health, test, doc, and packet changes listed in the commit handoff. Existing DBs with migrated cache rows can be cleared because `embedding_cache` is a recomputable performance cache.
<!-- /ANCHOR:rollback -->
