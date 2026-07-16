# Iteration 006 — Angle 6

**Angle:** Vector dual-write convergence: vec_768 BLOB table vs vec_memories vec0 — single-source-of-truth plan, divergence detection in health, migration cost.

**Summary:** The code has partial convergence tooling in memory_embedding_reconcile, but memory_health does not use the same dual-surface coverage checks. The main gap is operational: vec_768 and vec_memories are both mandatory today, while docs and health do not consistently expose that reality.

**Findings kept:** 4

## [P1][BUG] memory_health misses active vec_<dim> divergence

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:103-120 selects vec_<dim> for vector_search; .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1555-1568 verifyIntegrity only checks vec_memories; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:982-1005 reports health from verifyIntegrity; .opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:81-92 proves a success row can be missing only vec_768.
- Detail: The read path uses active_vec.vec_768 when the active embedder is non-default, but memory_health consistency only counts missing/orphaned rows against active_vec.vec_memories. A database can therefore report healthy vector consistency while active vector_search drops rows because vec_768 is incomplete.
- Fix sketch: Make memory_health or verifyIntegrity compute the same active-surface coverage as memory_embedding_reconcile, including vec_<dim>, vec_memories_rowids, and queryable vec_memories.

## [P2][REFINEMENT] Vector storage has no declared single source of truth

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:81-90 dual-writes vec_memories and vec_<dim>; .opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:4-6 says both active vector surfaces must exist; .opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:318-327 treats either missing surface as coverage loss; .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20/benchmark_report.md:31-38 records vec_memories 7771 vs vec_768 3808.
- Detail: The code treats vec_memories and vec_<dim> as co-required write targets rather than one authoritative payload plus a derived index. The benchmark already records a large historical divergence, which makes migration and repair semantics harder to reason about.
- Fix sketch: Declare one canonical embedding payload table and make the other surface a rebuildable derived index with explicit divergence health and repair.

## [P2][README-MISALIGNMENT] Shard README mislabels vec_<dim> as sqlite-vec virtual table

- Evidence: .opencode/skills/system-spec-kit/mcp_server/database/vectors/README.md:104-110 says vec_<dim> is a sqlite-vec virtual table; .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:802-808 creates vec_<dim> as CREATE TABLE with id and vec BLOB.
- Detail: The documentation describes vec_768 as the sqlite-vec index, but the implementation creates a plain BLOB table and keeps sqlite-vec behavior in vec_memories. That misstates the migration and failure model for the dual-write surfaces.
- Fix sketch: Update the shard README to describe vec_<dim> as the dimension-tagged BLOB payload table and vec_memories as the sqlite-vec vec0 query surface.

## [P2][DOC-DRIFT] Reconcile docs omit opt-in success coverage repair

- Evidence: .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:953 says memory_embedding_reconcile({ mode: "apply" }) repairs missing vectors; .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:520 defaults repairSuccessCoverage to false; .opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts:128-135 verifies apply without repairSuccessCoverage leaves success rows missing vectors untouched.
- Detail: The troubleshooting path tells operators to run apply for missing/interrupted vectors, but success rows missing an active vector surface are only reset when repairSuccessCoverage is explicitly true. This creates a false repair expectation for the exact dual-surface divergence case.
- Fix sketch: Document the dry-run coverage field and require repairSuccessCoverage:true for success-row coverage repair, or change the default if that behavior is intended.
