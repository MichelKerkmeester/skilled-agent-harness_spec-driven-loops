# Research Synthesis - codex-2

## Executive Answer

The common root cause is contract drift across independently maintained surfaces: human docs, public MCP schemas, runtime schemas, handlers, generated metadata, background processors, and fan-out orchestration. The strongest evidence is not one bad option or one stale file; it is the same failure shape repeating across memory tools, packet metadata, security fallbacks, and deep-loop runtime accounting.

Severity should be calibrated by impact class:

- P1 by default for contract drift, governed metadata loss, systemic metadata drift, memory correctness, and fan-out failure accounting.
- P0 only when governed memory scopes are real trust boundaries in a shared/multi-tenant MCP deployment.
- P2/corrected for stale claims that current evidence refutes, especially the claim that CLI fan-out is serial.

## Key Question Answers

### 1. Common Root Cause For Doc/Schema-To-Code Drift

The root cause is absence of a single enforced source of truth for tool contracts. `memory_embedding_reconcile` documents `dryRun: false`, while the live public schema and runtime schema expose `mode: "dry-run" | "apply"`, and the implementation uses `args.mode === "apply"`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:338`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:306`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:299`]

Governed ingest is the higher-impact version. Runtime allowed-parameter lists include governance fields for `memory_index_scan` and `memory_ingest_start`, but the public tool schemas hide them, and the handlers validate governance without carrying the normalized scope into scan indexing or async job processing. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:596`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:520`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:330`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:721`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:263`]

### 2. Metadata Drift Systemic-Ness

Metadata drift is systemic. The 026 integrity slices found stale root/child graph metadata, stale changelog inventory, and completed packets advertising in-progress status. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/004-026-integrity/review/lineages/codex-4/review-report.md:26`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/004-026-integrity/review/lineages/codex-1/review-report.md:23`]

The 027 launch-state slice found the same class across parent/child phase metadata, old phase numbers, draft phases marked complete, and non-executable listed children. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/review/lineages/codex-1/review-report.md:67`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/review/lineages/codex-1/review-report.md:83`]

The audit-control packet itself had a related failure: a Level 1 target missing required docs and mandatory metadata. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/review/lineages/codex-3/review-report.md:35`]

This points to a systemic metadata freshness gap, not isolated missed edits.

### 3. Memory-Correctness Real Impact

There are two impact classes.

First, entity-density cache staleness is real but bounded. The cache drives graph-channel routing, refreshes lazily on a 60 second TTL, and has an explicit invalidation API. Shared CRUD mutation hooks clear several caches but omit this one, while save and bulk-delete paths invalidate it explicitly. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:4`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:21`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:197`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:9`]

Second, atomic save has a persistent inconsistency risk. The atomic path writes a pending file, indexes prepared content, and only then promotes the pending file. In the quality-loop finalization path, DB commit happens before final file persistence and the warning explicitly says the DB row is committed while manual file recovery may be needed. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:360`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:362`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:378`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2639`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2653`]

### 4. P0 Security Severity Calibration

The bypasses are real. Community fallback runs after the governed pipeline, calls `searchCommunities` without scope, and fetches memory rows by returned member IDs. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:946`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:955`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1000`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124`]

Causal graph mutation also lacks scoped ownership in its input and storage path: it accepts raw source/target IDs, inserts them directly, defers FK checks, and deletes by edge ID. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:406`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:757`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:279`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:743`]

Calibration: keep P0 for shared daemons, multi-tenant stores, untrusted tool callers, or any deployment where tenant/user/agent scopes are security boundaries. Under a local single-user MCP model, downgrade to P1 security/correctness because there is no separate tenant adversary crossing an enforced trust boundary.

### 5. Deep-Loop Blast Radius

The current CLI fan-out implementation is concurrency-capped, so the serial-fan-out claim is stale for CLI lineages. `fanout-run.cjs` uses `runCappedPool`, and the pool starts work while `active < concurrency`; tests verify max active stays capped. [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:307`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:174`] [SOURCE: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts:102`]

The serious active defect is failure accounting. The worker returns subprocess `exitCode` inside fulfilled output. The pool summary counts success from fulfilled worker status, and `fanout-run.cjs` exits based on that summary. A CLI process that exits non-zero can therefore be counted as a successful lineage unless a different layer inspects nested output. [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:362`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:207`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:376`]

Per-lineage `iterations` is also not a loop budget in the child prompt. It only contributes to timeout calculation, while the prompt asks the child to run to convergence. [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:150`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154`] [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:142`]

## Root-Cause Grouping

| Root Cause | Evidence Family | Primary Risk |
|---|---|---|
| Contract split | Reconcile options, governed ingest schemas, dead `activeOnly` | Operator/API mismatch and silent no-op inputs |
| Metadata freshness gap | 026/027 graph metadata, changelog rollups, child phase maps, missing audit metadata | Resume/release/audit control surfaces lie |
| Incomplete mutation invariants | Entity-density invalidation, atomic save DB/file order | Stale retrieval routing and persistent inconsistency |
| Scope checks not end-to-end | Community fallback, causal link/unlink | Isolation bypass when scopes are security boundaries |
| Orchestration result mismatch | Non-zero exits nested inside fulfilled pool output | False successful fan-out review/research runs |

## Remediation Priority

1. Fix scoped security paths first if the MCP server is ever shared: apply governance filters to community fallback member fetches and add ownership/scope checks to causal link/unlink.
2. Fix fan-out failure accounting next: non-zero subprocess exits must count failed unless salvage verifies a complete terminal state and required artifacts exist.
3. Thread governed scope through `memory_index_scan`, `memory_ingest_start`, job queue state, queue processing, and `indexMemoryFile`.
4. Add contract tests comparing public tool schemas, runtime schemas, docs examples, and consumed handler/helper options.
5. Add recursive metadata freshness tests for graph metadata, description files, phase maps, changelog rollups, and implementation-summary/spec status.
6. Add entity-density invalidation to shared mutation hooks and test CRUD update/delete against routing changes.
7. Harden atomic save by making file promotion/finalization and DB commit rollback semantics explicit in tests.

## Remaining Unknowns

No blocking unknowns remain for this lineage. The only deployment-dependent uncertainty is severity labeling for security findings, and the calibration rule above resolves it by trust boundary.
