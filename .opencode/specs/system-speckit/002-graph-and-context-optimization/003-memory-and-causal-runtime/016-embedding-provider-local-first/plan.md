---
title: "Implementation Plan: Embedding Provider Local-First Resolution"
description: "Reorder resolveProvider() to local-first (ollama -> hf-local; cloud opt-in/last-resort), add hf-local to the createEmbeddingsProvider hard-failure cascade, drop the dead isPlaceholderKey helper, and repair two stale embedder test fixtures surfaced by rebuilding shared/dist."
trigger_phrases:
  - "embedding local-first plan"
  - "resolveProvider reorder"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/016-embedding-provider-local-first"
    last_updated_at: "2026-06-02T21:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented + verified: 6 embedder test files green (62 passed, 0 failed)"
    next_safe_action: "Generate metadata, validate --strict, commit to main"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "embedding-localfirst-session"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Embedding Provider Local-First Resolution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (shared `@spec-kit/shared` workspace) |
| **Module** | `shared/embeddings/factory.ts` (used by mk-spec-memory + skill-advisor) |
| **Build** | `tsc --build` → `shared/dist` (gitignored); tests import dist + source |
| **Testing** | vitest via `mcp_server/vitest.config.ts` (isolated DB setup, serial) |

### Overview
`resolveProvider()` was the only one of three provider-order definitions that placed cloud above local. Make it local-first, keep cloud reachable via explicit `EMBEDDINGS_PROVIDER` or the existing hf-local→cloud creation-failure cascade, and ensure a hard hf-local failure can still cascade to cloud.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All three provider-order definitions traced; only resolveProvider non-local-first
- [x] Test isolation confirmed (vitest-setup forces throwaway DB)
- [x] Gate test identified (factory-auto-resolution + embeddings + embedder-ollama)

### Definition of Done
- [x] resolveProvider local-first; cloud opt-in/last-resort
- [x] hf-local added to hard-failure cascade trigger
- [x] dead isPlaceholderKey removed; docstring corrected
- [x] stale fixtures repaired (vec_memories_rowids)
- [x] embedder test gate green (62 passed, 0 failed)
- [ ] validate --strict 0; commit explicit paths to main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-function surgical reorder in a shared module; behavior verified by the existing embedder vitest suite (empirical gate, not just review).

### Key Components
- **resolveProvider()**: `explicit → persisted-ollama → hf-local`. Cloud branches removed from auto mode.
- **createEmbeddingsProvider()**: error-catch fallback trigger now includes `hf-local` so a hard local failure cascades via `getCascadeFallbackOrder('hf-local') = ['openai','voyage']`.
- **auto-select.ts** + **getCascadeFallbackOrder()**: unchanged (already local-first).

### Data Flow
auto mode → resolveProvider → ollama (persisted/reachable) else hf-local → on hard hf-local create failure → cascade openai→voyage (only if keys present).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `resolveProvider()` | runtime provider precedence | update → local-first | embeddings.vitest T513-01b/c/d (hf-local over cloud) |
| `createEmbeddingsProvider()` catch | hard-failure cascade | add hf-local trigger | provider-flap recovery tests pass |
| `isPlaceholderKey` | placeholder-key guard (only cloud-branch caller) | remove (dead) | no remaining refs; build clean |
| `createActiveNomicDb` / `createActiveOllamaDb` (tests) | active-ollama fixtures | add vec_memories_rowids | factory-auto-resolution + embedder-ollama green |

Inventories run:
- `rg "resolveProvider"` callers: getStartupEmbeddingDimension/Profile, getProviderInfo, createEmbeddingsProvider, validateApiKey — all consume the resolution name; none assert cloud-auto order (active).
- Order definitions: auto-select.ts (cascade), getCascadeFallbackOrder, resolveProvider — now all `ollama → hf-local → openai → voyage`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Code (done)
- [x] resolveProvider local-first
- [x] createEmbeddingsProvider hf-local cascade trigger
- [x] remove dead isPlaceholderKey + fix docstring

### Phase 2: Tests (done)
- [x] Rewrite T513-01b/c/d to assert local-first (un-skip; drop packet-id comment)
- [x] Repair stale fixtures (vec_memories_rowids)
- [x] Rebuild shared/dist; run gate → 62 passed / 0 failed

### Phase 3: Ship
- [ ] description.json + graph-metadata.json
- [ ] validate --strict → 0
- [ ] commit explicit paths to main
- [ ] (deferred) daemon recycle to deploy live — batch with pending 015 .cjs restart decision
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | resolveProvider precedence (local-first, persisted-ollama, explicit) | vitest |
| Recovery | ollama-reachability auto recovery / hf-local stay | vitest |
| Fixture | active-ollama DB completeness (vec_memories_rowids) | vitest + node:sqlite/sqlite3 |
| Isolation | throwaway DB (no production touch) | vitest-setup.ts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Pristine-vs-changed isolation confirmed via `git stash` of factory.ts (2 failures pre-existing).
- No external/network dependency; cloud probes are not exercised in auto mode.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Single-file behavioral change; rollback is a clean revert.

- **Revert**: restore `shared/embeddings/factory.ts` to the prior cloud-first `resolveProvider()` (re-add the auto-mode voyage/openai branches and `isPlaceholderKey`), then `tsc --build` to refresh `shared/dist`.
- **Tests**: re-skip or revert the rewritten `embeddings.vitest.ts` T513-01b/c/d cases if the cloud-first behavior is restored.
- **Fixtures**: the `vec_memories_rowids` fixture repair is independent of the resolver change and can stay (it corrects a genuine stale fixture); no rollback needed.
- **Runtime**: the live daemon runs on persisted ollama and loaded the pre-rebuild dist, so no live deploy is in effect; reverting does not require a daemon recycle.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Code) ──► Phase 2 (Tests) ──► Phase 3 (Ship)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Code | None | Tests |
| Tests | Code, rebuilt shared/dist | Ship |
| Ship | Tests (gate green) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Code (resolver reorder + cascade trigger + dead-helper drop) | Low | ~1 hour |
| Tests (rewrite skipped cases + repair fixtures + gate) | Med | ~2 hours |
| Ship (metadata, validate, commit) | Low | ~0.5 hour |
| **Total** | | **~3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration involved (resolver-logic change only)
- [x] No feature flag required (behavior governed by EMBEDDINGS_PROVIDER + persisted state)
- [x] Test isolation confirmed (throwaway DBs; production DB untouched)

### Rollback Procedure
1. Restore `shared/embeddings/factory.ts` to the prior cloud-first `resolveProvider()` (re-add auto-mode voyage/openai branches + `isPlaceholderKey`).
2. `tsc --build` to refresh `shared/dist`.
3. Re-run the embedder vitest gate to confirm prior behavior.
4. No daemon recycle needed — live daemon runs on persisted ollama and the pre-rebuild dist.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. The `vec_memories_rowids` fixture repair is a test-only correction and can be kept independently.
<!-- /ANCHOR:enhanced-rollback -->
