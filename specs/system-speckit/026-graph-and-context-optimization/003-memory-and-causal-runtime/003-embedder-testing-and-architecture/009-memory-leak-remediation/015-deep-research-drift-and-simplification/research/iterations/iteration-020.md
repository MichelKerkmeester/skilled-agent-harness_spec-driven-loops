# Iteration 020 — dead-code (executor: cli-opencode-deepseek-v4-pro)

## Metadata
- Iteration: 20 of 20
- Angle: dead-code
- Executor: cli-opencode-deepseek-v4-pro
- Timestamp: 2026-05-23T01:10:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs`
- Cumulative findings before this iter: 104

## Summary
Fourth dead-code pass after iters 2 (7 findings), 8 (6), and 14 (6). Probed the transitive consequence of prior dead-code findings (cancelJob's zero-production-callers making its internal cancellation-polling branches dead), the barrel index.ts type-export consumer graph, and production-dead code paths gated on `:memory:` DB patterns. Found 6 novel dead-code findings: 1 P1 (dead cancellation branches inside runJob loop) and 5 P2 (4 barrel type exports with zero importers, 1 production-dead shard-write early-return). All findings verified via grep cross-referencing and import-chain analysis.

## New Findings

### P0 — Blockers
None

### P1 — Required

**Title: Dead cancellation-polling branches in reindex runJob loop**
- **Fingerprint:** `dead-code:reindex:runcancellation-check-branches-unreachable`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:372, 393`
- **Evidence:**
  ```typescript
  // line 372 — inside the while loop
  if (getCancellationStatus(db, jobId) === 'cancelled') {
    return;
  }

  // line 393 — after the while loop
  if (getCancellationStatus(db, jobId) === 'cancelled') {
    return;
  }
  ```
  `getCancellationStatus()` reads the `status` column from `embedder_jobs`. The value `'cancelled'` is set exclusively by `cancelJob()` (line 477: `setJobStatus(resolvedDb, jobId, 'cancelled')`). Per finding 41 (iter 8), `cancelJob()` has zero production callers — it is only imported by `tests/embedder-reindex.vitest.ts:34`. No production handler or MCP tool surface calls `cancelJob`. Therefore the `'cancelled'` status can never be written to the database in production, making both `=== 'cancelled'` checks permanently `false`. These are dead branches that silently degrade to no-ops.
- **Reasoning:** This is the transitive dead-code consequence of `cancelJob` having zero production callers. The cancellation-polling apparatus inside `runJob` — two guard clauses with DB round-trips — exists solely to respond to a state transition that can never occur. Each guard performs a `SELECT status FROM embedder_jobs WHERE id = ?` query, adding unnecessary database IO per batch iteration. The dead branches create a false impression that cancellation is a supported runtime concern when in fact the only cancellation flow is the test-only `cancelJob()` path.
- **Suggested remediation:** Remove both `getCancellationStatus(db, jobId) === 'cancelled'` checks and the `getCancellationStatus` helper. Since `cancelJob` will eventually be wired to an MCP tool (see finding 41 remediation), the checks can be re-added at that time. Until then, they are misleading dead code that incurs per-batch DB overhead.
- **Severity rationale:** P1 — Dead DB-query paths inside a tight reindex loop that add per-batch overhead and false complexity. The `'cancelled'` status is unreachable in production, making the entire cancellation-polling apparatus a no-op that misleads maintainers about supported runtime behavior. Combined with finding 41, this forms a complete dead feature: the cancellation entry point has no callers, and the critical path that checks for cancellation can never find it.

### P2 — Suggestions

**Title: `ActiveEmbedder` barrel type export has zero importers**
- **Fingerprint:** `dead-code:index-barrel:activeembedder-type-zero-importers`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:25`
- **Evidence:**
  ```typescript
  // index.ts:25
  export type { ActiveEmbedder } from './schema.js';
  ```
  Grep for `import.*ActiveEmbedder` across the entire `system-spec-kit` skill: zero files import the `ActiveEmbedder` type. The `getActiveEmbedder` function (exported at line 22) is used by `vector-index-store.ts`, `vector-index-queries.ts`, `embedder-list.ts`, and `reindex.ts` — but all of these import the function directly, and their return types are inferred rather than typed with `ActiveEmbedder`. The type export in the barrel serves no consumer.
- **Reasoning:** The type was likely exported for downstream consumers to type-annotate `getActiveEmbedder()` return values, but no code does so. It's a dead type export in the barrel. Unlike `EmbedderExecutionInputType` (finding 8) which was also unused, `ActiveEmbedder` carries a stronger contract implication — suggesting the embedder identity is a first-class type consumers should reference — yet no consumer does.
- **Suggested remediation:** Remove `export type { ActiveEmbedder } from './schema.js';` from `index.ts:25`. The interface remains accessible via direct import from `./schema.js` if needed.
- **Severity rationale:** P2 — Type-only export (zero runtime cost). Dead API surface that misleads consumers about the expected typing pattern. Zero importers across the entire codebase.

**Title: `ReindexJobStatus` barrel type export has zero importers**
- **Fingerprint:** `dead-code:index-barrel:reindexjobstatus-type-zero-importers`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:35`
- **Evidence:**
  ```typescript
  // index.ts:35
  export type { ReindexJob, ReindexJobStatus, StartReindexOptions } from './reindex.js';
  ```
  Grep for `import.*ReindexJobStatus` across the entire skill: zero matches. The `embedder-status.ts` handler imports `ReindexJob` (at line 15: `import type { ReindexJob } from '../lib/embedders/reindex.js'`) but does NOT import `ReindexJobStatus` — it accesses `job.status` without typing it. No other handler, test, or utility imports `ReindexJobStatus`.
- **Reasoning:** The string union type `'queued' | 'running' | 'completed' | 'failed' | 'cancelled'` has zero external consumers. It's used internally within `reindex.ts` (lines 30, 61, 93, 169, 191) but never imported through the barrel. Combined with finding 42 (`ACTIVE_REINDEX_STATUSES` has zero consumers) and finding 41 (`cancelJob` has zero production callers), this adds to a pattern of dead reindex API surface in the barrel.
- **Suggested remediation:** Remove `ReindexJobStatus` from the barrel export. It remains accessible internally in `reindex.ts`. The `ReindexJob` type keep its `status: ReindexJobStatus` field — consumers of `ReindexJob` get the status type transitively.
- **Severity rationale:** P2 — Type-only export (zero runtime cost). Dead API surface. Combined with other dead reindex barrel exports, signals that the embedder reindex barrel surface needs triage.

**Title: `StartReindexOptions` barrel type export has zero external consumers**
- **Fingerprint:** `dead-code:index-barrel:startreindexoptions-type-zero-external-consumers`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:35`
- **Evidence:**
  ```typescript
  // reindex.ts:45-47 — definition
  export interface StartReindexOptions {
    readonly toName: string;
  }

  // reindex.ts:424 — only usage
  export function startReindex(
    options: StartReindexOptions,
    runtimeOptions: ReindexRuntimeOptions = {},
  ): string { ... }

  // index.ts:35 — barrel re-export
  export type { ReindexJob, ReindexJobStatus, StartReindexOptions } from './reindex.js';
  ```
  Grep for `import.*StartReindexOptions`: zero matches. The `embedder-set.ts` handler imports `startReindex` from `'../lib/embedders/reindex.js'` (line 15) but does not import the `StartReindexOptions` type — it passes literal options objects. The type is only used as the parameter type of `startReindex()` within the same file. It is a barrel re-export with zero external consumers.
- **Reasoning:** The type was likely barrel-exported so external callers could type-annotate their reindex-start calls, but no external code does so. Like `ReindexJobStatus`, this is a dead type export that clutters the barrel. The options type has a single property `toName` — it's so simple that callers don't bother importing the type.
- **Suggested remediation:** Remove `StartReindexOptions` from the barrel export at `index.ts:35`. It remains the parameter type of `startReindex()` internally. If external consumers later need it for type annotations, it can be re-added.
- **Severity rationale:** P2 — Type-only export (zero runtime cost). Dead API surface in a barrel that already accumulates several dead reindex-related exports.

**Title: `EmbedderManifest` barrel type export has zero production consumers**
- **Fingerprint:** `dead-code:index-barrel:embeddermanifest-type-zero-production-consumers`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:9`
- **Evidence:**
  ```typescript
  // index.ts:9
  export type { BackendKind, EmbedderManifest } from './types.js';
  ```
  Grep for imports of `EmbedderManifest` from the embedders barrel: only `tests/embedder-registry.vitest.ts:14`. One additional test (`embedder-ollama.vitest.ts:28`) imports directly from `'../lib/embedders/types.js'` (not the barrel). The `BackendKind` type is imported by `embedder-list.ts:16` (production), but `EmbedderManifest` has zero production consumers through the barrel. Production handlers (`embedder-list.ts`, `embedder-set.ts`) work with manifest objects (`manifest.backend`, `manifest.dim`, `manifest.name`) without importing the `EmbedderManifest` type — they rely on inferred types from `listManifests()` and `getManifest()`.
- **Reasoning:** The barrel type export exists for a production type that no production code imports. The `BackendKind` type is the only production-consumed member of this barrel export line. `EmbedderManifest` is purely test-consumed.
- **Suggested remediation:** Either remove `EmbedderManifest` from the barrel export (keeping only `BackendKind`), or keep it if the type is expected to gain production consumers in a near-term handler pass. If kept, add a comment documenting the expected consumer.
- **Severity rationale:** P2 — Type-only export (zero runtime cost). Dead API surface with exclusively test consumers. Low urgency but adds to the overall barrel-cleanup inventory.

**Title: `writeVectorsToShard` null-databaseDir early-return dead in production**
- **Fingerprint:** `dead-code:reindex:writevectorstoshard-null-databasedir-early-return-production-dead`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:278-281`
- **Evidence:**
  ```typescript
  // reindex.ts:278-281
  const databaseDir = getDatabaseDir(db);
  if (!databaseDir) {
    return;
  }
  ```
  `getDatabaseDir()` (lines 240-247) returns `null` when the database file is `':memory:'` or when no main-database file is found. In production, the database path is always resolved to a file-backed path via `initializeDb()` which reads `MEMORY_DB_PATH` or auto-derives a profile-specific database path. `':memory:'` databases are used exclusively by tests (grep confirms ~180 test-only `:memory:` occurrences, zero production). The `if (!databaseDir) { return; }` guard silently exits `writeVectorsToShard` without writing shard vectors — a behavior that only tests exercise. In production, `databaseDir` is always non-null, making the early-return branch dead.
- **Reasoning:** Same pattern as finding 43 (`autoStart=false` dead in production). A test-only database configuration drives a production-dead code path. The `writeVectorsToShard` function is called from `runJob` (line 387) during reindex, and the early return would silently drop shard writes if triggered — but it never triggers in production because in-memory databases are test-only. The guard adds dead defensive code that could mask a real bug if `MEMORY_DB_PATH` were accidentally set to `:memory:` in production.
- **Suggested remediation:** Remove the `databaseDir` null check and early return. If defense-in-depth is desired, log a warning before returning rather than silently dropping shard writes. Alternatively, assert `databaseDir` is non-null in production (e.g., `if (!databaseDir) throw new Error('...')`).
- **Severity rationale:** P2 — Dead production path. The silent return could mask a configuration error (e.g., `MEMORY_DB_PATH=:memory:` in production would cause shard writes to be silently dropped with no log). The early-return behavior is only meaningfully exercised by tests. Combined with finding 43, this forms a recurring pattern of test-isolation parameters leaking dead production guard clauses.

## Convergence Signal
- New findings this iter: 6
- Cumulative finding count after iter: 110
- New-findings ratio: 0.055
- Continue / converged signal: `converged` (ratio ≤ 0.10; this is the second consecutive dead-code iter below the 0.10 threshold — iter 14 ratio was 0.077, iter 20 ratio is 0.055. Two consecutive below-threshold iterations for the same angle trigger convergence.)

## Files Touched (this iter)
- `iterations/iteration-020.md`
- `deltas/iter-020.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
