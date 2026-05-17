---
title: "Spec: 010/004 skill-graph-db writer cross-wire to EmbedderAdapter layer"
description: "Refactor refreshSkillEmbeddings to use the new EmbedderAdapter layer (010/001) instead of OLD createEmbeddingsProvider factory — unblocks 010/002 jina-v3 swap execution"
trigger_phrases:
  - "010/004 writer cross-wire"
  - "skill-graph-db refresh refactor"
  - "EmbedderAdapter writer wiring"
  - "010/002 unblock"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-skill-advisor-embedder-parity/004-skill-graph-db-writer-cross-wire"
    last_updated_at: "2026-05-18T00:05:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded packet from 010/002 architecture-gap discovery"
    next_safe_action: "Read refreshSkillEmbeddings + plan refactor"
    blockers: []
    key_files: ["spec.md", ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:769"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000010004"
      session_id: "010-004-writer-cross-wire-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Dual-write (legacy + vec_<dim>) for backward compat, or single-write to vec_<dim> only?"
      - "Should the OLD createEmbeddingsProvider call be wrapped in a llama-cpp-baseline adapter for unified call surface?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 010/004 skill-graph-db Writer Cross-Wire to EmbedderAdapter Layer

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned (created 2026-05-18 from 010/002 discovery) |
| Level | 1 (single-file refactor, ~50 LOC change) |
| Priority | P1 (blocks 010/002 jina-v3 swap execution) |
| Owner | Main agent (autonomous) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem

010/001 shipped the parallel pluggable EmbedderAdapter layer (`lib/embedders/*`) mirroring mk-spec-memory 016/001-003. The READ path is wired:
- `lib/scorer/lanes/semantic-shadow.ts:72` — uses `getAdapter(active.name)` for query embeddings
- `lib/skill-graph/skill-graph-db.ts:840` — `loadSkillEmbeddings()` reads from `vec_<active.dim>` when `hasActiveEmbedderPointer()` is true

But the WRITE path was left unwired:
- `lib/skill-graph/skill-graph-db.ts:769` — `refreshSkillEmbeddings()` still calls OLD `createEmbeddingsProvider()` factory from `@spec-kit/shared/embeddings/factory.js`
- The OLD factory supports providers `voyage` / `openai` / `llama-cpp` / `hf-local` — has NO Ollama provider
- It cannot produce jina-v3 vectors (jina-v3 is Ollama-served in MANIFESTS)

This was independently surfaced by E deep-review (016/010/001/review/review-report.md):
- **P1-1** (regression-risk, iter 3): "active embedder pointer switches reads to vec tables while refresh still writes legacy embeddings"
- **P2-11** (documentation-alignment, iter 8): "docs claim env-var embedder swap but implementation only selects active embedder from vec_metadata"

010/002 (`002-jina-swap-and-reindex`) attempted the swap but was DEFERRED due to this gap — see `010/002/evidence/swap-runbook.md` and `010/002/implementation-summary.md` §"How It Was Delivered" for the discovery timeline.

### Purpose

Refactor `refreshSkillEmbeddings()` to use the new EmbedderAdapter layer when an active pointer is set. Unblocks 010/002 swap execution. Closes E review P1-1.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In scope
- `lib/skill-graph/skill-graph-db.ts:refreshSkillEmbeddings()` (line 769) — refactor to dispatch on `hasActiveEmbedderPointer()`:
  - When TRUE: use `getAdapter(active.name).embed(...)` → write to `vec_<active.dim>` table via INSERT OR REPLACE
  - When FALSE: keep existing legacy path (write to `skill_nodes.embedding` BLOB column via OLD factory) for backward compatibility
- New round-trip integration test in `tests/skill-graph/refresh-roundtrip.vitest.ts`:
  - Set active embedder → refresh → read back via `loadSkillEmbeddings` → assert dim + content match
- Update `refreshSkillEmbeddings()` JSDoc to document the dual-path behavior
- Update 010/002 `implementation-summary.md` to mark 010/004 dependency as RESOLVED
- Post-implementation deep-review (5-iter — single-commit tier per `post-implementation-deep-review.md`)

### Out of scope
- Removing the legacy path (defer to a future "legacy embedding column deprecation" packet)
- 010/002 swap execution itself (010/002 owns that; this packet just unblocks it)
- Changing the OLD createEmbeddingsProvider factory (out of bounds — it's used by other consumers)
- Adding new MANIFESTS or new embedder providers (010/001 owns that)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | When `hasActiveEmbedderPointer(db) == true`, `refreshSkillEmbeddings()` uses `getAdapter(active.name)` for embedding generation |
| R2 | When R1 applies, embeddings written to `vec_<active.dim>` table via INSERT OR REPLACE (not to legacy `skill_nodes.embedding` column) |
| R3 | When `hasActiveEmbedderPointer(db) == false`, `refreshSkillEmbeddings()` behavior is UNCHANGED from current (legacy path preserved for backward compat) |
| R4 | Round-trip integration test asserts: set pointer → refresh → load → embedding bytes match + dim matches |
| R5 | Existing vitest suite passes (regression baseline) |
| R6 | Post-implementation deep-review (5-iter cli-devin SWE-1.6) shipped with PASS or PASS-advisories verdict |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 6 requirements met
- 010/002 swap-runbook.md executable end-to-end (verified by 010/002 follow-up or this packet's smoke test)
- Strict-validate PASSED (0 errors)
- Commit message format `feat(010/004): wire skill-graph-db writer to EmbedderAdapter layer`
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Risks

- **Load-bearing refactor**: `skill-graph-db.ts:refreshSkillEmbeddings` is called during daemon startup. Mitigated by:
  - Dual-path approach (legacy path remains for FALSE branch — backward compat for fresh installs without active pointer)
  - Post-impl deep-review (5-iter) before declaring done
  - DB snapshot in 010/002 still valid (no schema migration in this packet)

- **Embedder dispatch performance**: New path goes through MANIFESTS lookup + adapter ctor on every refresh. Mitigated by:
  - Adapter instances are cheap (just an HTTP client + manifest reference)
  - Cache adapter at module-level if refresh is called repeatedly

- **Ollama dependency**: When active embedder is Ollama-backed (e.g., jina-v3), refresh requires Ollama daemon running. Mitigated by:
  - Document this dependency in runbook
  - Adapter has try/catch + structured logging on Ollama errors
  - Operator can fall back to setActiveEmbedder(db, 'embeddinggemma-300m', 768) to revert to llama-cpp path

### Dependencies

- 010/001 (pluggable layer) — SHIPPED at commit `ed5eb0e56`
- Active embedder pointer schema (`vec_metadata`) — exists from 010/001
- `getAdapter` from `lib/embedders/registry.ts` — exists from 010/001
- `vecTableNameForDim`, `ensureVecTableForDim` from `lib/embedders/schema.ts` — exist from 010/001
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: Dual-write (legacy + vec_<dim>) when pointer is set, or single-write to vec_<dim> only?
  - Default: single-write to vec_<dim> only (cleaner; reader prefers vec_<dim> when pointer set; legacy column becomes stale but harmless)
  - Alternative: dual-write for transition safety (more storage; provides rollback path if vec_<dim> table corrupted)
  - Decision: defer to implementation; bias toward single-write for cleanliness

- **Q2**: Should the OLD `createEmbeddingsProvider()` call be wrapped in a `llama-cpp-baseline` adapter for a unified call surface?
  - Default: NO — keep legacy path explicit (`if hasActiveEmbedderPointer(...) { new adapter } else { old factory }`); easier to reason about
  - Alternative: wrap in LlamaCppBaselineAdapter for unified surface
  - Decision: defer; depends on whether 010/001 adapter ctor accepts the OLD factory's output shape
<!-- /ANCHOR:questions -->
