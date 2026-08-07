# Iteration 008 — dead-code (executor: cli-opencode-deepseek-v4-pro)

## Metadata
- Iteration: 8 of 20
- Angle: dead-code
- Executor: cli-opencode-deepseek-v4-pro
- Timestamp: 2026-05-22T23:50:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts` (barrel)
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs`
- Cumulative findings before this iter: 40

## Summary
Second pass on the dead-code angle after iter 2 found 7 issues. This iteration probed deeper into the supporting files (reindex.ts, barrel index.ts, execution-router.ts), cross-reference usage patterns (grep-verified all consumer chains), and the `MOCK_SIDECAR_` env pass-through surface to identify 6 novel dead-code findings. All are P2 severity — the first pass exhausted the P1 surface. Findings focus on: no-production-caller functions/constants exported through the barrel, a test-only branch in reindex orchestration, test-only env prefix allowlisting in production code, and zero-consumer barrel type re-exports.

## New Findings

### P0 — Blockers
None

### P1 — Required
None

### P2 — Suggestions

**Title: cancelJob has zero production callers; only invoked in tests**
- **Fingerprint:** `dead-code:reindex:canceljob-zero-production-callers`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:465-479`
- **Evidence:**
  ```typescript
  export function cancelJob(jobId: string, db?: Database.Database): ReindexJob | null {
    const resolvedDb = resolveDb(db);
    ensureJobTable(resolvedDb);
    const job = selectJob(resolvedDb, jobId);
    if (!job) {
      return null;
    }
    if (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') {
      return job;
    }
    setJobStatus(resolvedDb, jobId, 'cancelled');
    return selectJob(resolvedDb, jobId);
  }
  ```
  Grep across the entire `system-spec-kit` skill confirms `cancelJob` is imported only by `tests/embedder-reindex.vitest.ts:34`. The barrel export (`index.ts:28`) re-exports it, but no production handler or MCP tool surface calls it.
- **Reasoning:** This function was presumably built for a future "cancel reindex" MCP tool that has not been wired. The dead export occupies ~15 lines and creates the impression of a supported cancellation workflow that does not exist. The `getCancellationStatus` helper (reindex.ts:191) called inside `runJob` line 372 already handles cancellation checks internally — but without a production caller for `cancelJob`, the `'cancelled'` status transition can never be initiated from outside the module.
- **Suggested remediation:** Either wire an MCP tool handler that calls `cancelJob`, or gate the export behind `process.env.VITEST` / `import.meta.vitest` conditional. If cancellation is a future feature, add a `// TODO: wire MCP cancel tool` comment and consider gating the export for now.
- **Severity rationale:** P2 — The function itself is correct and would work if called. The dead-code issue is that no production path leads to it, making the `'cancelled'` job status effectively unreachable from outside. Low risk, but misleading API surface.

**Title: ACTIVE_REINDEX_STATUSES exported from barrel but zero consumers**
- **Fingerprint:** `dead-code:reindex:active-reindex-statuses-unused-export`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:519`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:27`
- **Evidence:**
  ```typescript
  // reindex.ts:519
  export const ACTIVE_REINDEX_STATUSES = ACTIVE_JOB_STATUSES;

  // index.ts:27
  export {
    ACTIVE_REINDEX_STATUSES,
    // ...
  } from './reindex.js';
  ```
  Grep across the entire `system-spec-kit` skill for `ACTIVE_REINDEX_STATUSES` matches only its definition (`reindex.ts:519`) and barrel re-export (`index.ts:27`). Zero external imports. The private `ACTIVE_JOB_STATUSES` constant (reindex.ts:97) is used internally by `resumeReindexJobs` (line 487) and `selectActiveJob` (line 158), but the public alias is not consumed by any handler, test, or external module.
- **Reasoning:** The export was likely created as a convenience for external consumers that never materialized. The internal `ACTIVE_JOB_STATUSES` array already serves the same purpose. The public alias creates dead API surface with zero benefit.
- **Suggested remediation:** Remove `ACTIVE_REINDEX_STATUSES` from the barrel export in `index.ts`. The `ACTIVE_JOB_STATUSES` constant remains available internally in `reindex.ts`. If external consumers need it later, it can be re-exported at that time.
- **Severity rationale:** P2 — Zero-cost at runtime (a const reference), but dead API surface that clutters the barrel and suggests a public contract that doesn't exist. Zero consumers beyond the module boundary.

**Title: ReindexRuntimeOptions.autoStart = false path dead in production; only used in tests**
- **Fingerprint:** `dead-code:reindex:autostart-false-dead-production-path`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:49-52,423-455`
- **Evidence:**
  ```typescript
  // reindex.ts:49-52
  interface ReindexRuntimeOptions {
    readonly db?: Database.Database;
    readonly autoStart?: boolean;
  }

  // reindex.ts:450-452
  if (runtimeOptions.autoStart !== false) {
    enqueueJob(db, id);
  }
  ```
  The only production caller of `startReindex` is `context-server.ts` (import at line 144), which never passes a `ReindexRuntimeOptions` argument with `autoStart`. The `autoStart: false` path is used exclusively in tests (`embedder-reindex.vitest.ts` lines 94, 158, 167) to create jobs without running them, allowing assertions on `'queued'` status before manual job execution.
- **Reasoning:** The `autoStart` parameter and the `enqueueJob` conditional branch serve only test isolation. In production, `autoStart` always defaults to `true` (the `!== false` check), making the `false` branch unreachable. The `ReindexRuntimeOptions` interface and its `autoStart` field exist solely to support test-controlled job lifecycle. This adds 7 lines of dead production code.
- **Suggested remediation:** Two options: (a) Remove `autoStart` from `ReindexRuntimeOptions` and always call `enqueueJob` — tests can use `vi.mock('../embedders/reindex.js', ...)` to intercept `enqueueJob` rather than controlling it through a parameter. (b) Gate the `autoStart` field behind `process.env.VITEST` conditional type narrowing. Option (a) is preferred as it removes the test-only production code path entirely.
- **Severity rationale:** P2 — The `autoStart` parameter is a clean pattern for testability, but the `false` branch is never exercised in production. Low risk (the behavior is correct either way), but the parameter adds complexity to the public API contract for a single test consumer.

**Title: listSupportedDimensions zero production callers; only invoked by tests**
- **Fingerprint:** `dead-code:registry:listsupporteddimensions-test-only`
- **File(s):** `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts:111-120`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:15`
- **Evidence:**
  ```typescript
  // shared/embeddings/registry.ts:111-120
  export function listSupportedDimensions(): ReadonlyArray<number> {
    const dims = new Set<number>();
    for (const manifest of MANIFESTS) {
      dims.add(manifest.dim);
    }
    return [...dims].sort((a, b) => a - b);
  }
  ```
  Grep confirms `listSupportedDimensions` is imported only by `tests/embedder-registry.vitest.ts:12`. Unlike `listManifests` (used by `handlers/embedder-list.ts:12` in production), `listSupportedDimensions` has zero production consumers. The barrel `index.ts:15` re-exports it, but no handler or tool calls it.
- **Reasoning:** This is a utility function with no production call path. While `listManifests` is wired into the embedder-list MCP handler, `listSupportedDimensions` was presumably intended for a similar handler that was never built. The function is correct and well-tested, but the production code ships it without any live consumer.
- **Suggested remediation:** Either wire `listSupportedDimensions` into the embedder-list handler (augment the response with `dimensions: listSupportedDimensions()`), or gate the export behind test conditionals. If the function is intended for future use, add a `// TODO` comment documenting the planned MCP tool.
- **Severity rationale:** P2 — The function works correctly and is tested, but its export is dead in production. Low risk, but adds to the public API surface with no consumer use case.

**Title: OllamaEmbedOptions and OllamaInputType barrel exports never imported**
- **Fingerprint:** `dead-code:index-barrel:ollama-embed-options-types-unused`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:43`, `.opencode/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:20-23`
- **Evidence:**
  ```typescript
  // index.ts:43
  export type { OllamaEmbedOptions, OllamaInputType } from './adapters/ollama.js';

  // ollama.ts:20-23
  export type OllamaInputType = 'document' | 'query';
  export interface OllamaEmbedOptions {
    readonly inputType?: OllamaInputType;
  }
  ```
  Grep across the entire skill directory for `OllamaEmbedOptions` and `OllamaInputType` finds NO imports outside `ollama.ts` itself and the barrel `index.ts`. The types are used internally by the `OllamaAdapter` class (private methods `applyPrefix` and `prepareInput` at ollama.ts:231-236), but no external module imports them through the barrel. The `OllamaAdapter` class itself is used, but the embed-options types are internal implementation details with no external consumer.
- **Reasoning:** These type exports appear in the barrel as if they constitute a public API surface, but no consumer imports them. The `SidecarClient.embed()` method accepts `SidecarEmbedOptions` (sidecar-client.ts:41-43), not `OllamaEmbedOptions`. The `DirectProviderAdapter.embed()` accepts `EmbedOptions` (execution-router.ts:21-23). The ollama-specific embed options types are an implementation detail that leaked into the barrel.
- **Suggested remediation:** Remove `OllamaEmbedOptions` and `OllamaInputType` from the barrel export in `index.ts`. The types remain available internally in `ollama.ts` for the `OllamaAdapter` class. If external consumers eventually need them, they can be added back to the barrel at that time.
- **Severity rationale:** P2 — Type-only exports (zero runtime cost), but dead API surface in the barrel that misleads consumers about the ollama adapter's public contract. The barrel should only export types that have known external consumers.

**Title: MOCK_SIDECAR_ env prefix allowlisting dead in production**
- **Fingerprint:** `dead-code:sidecar-client:mock-sidecar-env-prefix-production`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:175-181`
- **Evidence:**
  ```typescript
  function isAllowedEnvKey(key: string, explicitAllowlist: readonly string[] = []): boolean {
    return ALLOWED_ENV_KEYS.has(key)
      || key.startsWith('LC_')
      || key.startsWith('SPECKIT_EMBEDDER_')
      || key.startsWith('MOCK_SIDECAR_')   // <-- test-only prefix
      || explicitAllowlist.includes(key);
  }
  ```
  The `MOCK_SIDECAR_` prefix is consumed exclusively by tests:
  - `tests/embedder-sidecar.vitest.ts:29,36,56` sets `MOCK_SIDECAR_COUNTER_PATH`, `MOCK_SIDECAR_FAIL_PING_ONCE_PATH`, `MOCK_SIDECAR_ERROR`
  - `tests/embedders/sidecar-hardening.vitest.ts:41,100` sets `MOCK_SIDECAR_ENV_OUT`
  No production code sets `MOCK_SIDECAR_` environment variables. The prefix exists only to allow test-only env vars to pass through to the mock sidecar worker process.
- **Reasoning:** The `MOCK_SIDECAR_` prefix in `isAllowedEnvKey` is a production code path that serves only test isolation. In production, the check always evaluates to `false` because no `MOCK_SIDECAR_*` env vars exist. While negligible in runtime cost (a string prefix check), it's a dead allowlisting rule that widens the attack surface of the env-variable pass-through filter without production justification. The `SPECKIT_EMBEDDER_` prefix was already flagged in iter 3 (finding id 16) as a broad allowlist injection risk; `MOCK_SIDECAR_` is an additional dead prefix with the same concern but zero production consumers.
- **Suggested remediation:** Gate the `MOCK_SIDECAR_` prefix check behind an environment-aware conditional, e.g., `|| (process.env.VITEST && key.startsWith('MOCK_SIDECAR_'))`. Alternatively, add `MOCK_SIDECAR_*` vars to the `explicitAllowlist` parameter in test call sites instead of baking the prefix into the production allowlist logic. This removes the dead production code path and narrows the allowlist surface.
- **Severity rationale:** P2 — The prefix check is dead in production (always evaluates false) and slightly widens the env-variable allowlist surface. Combined with the SPECKIT_ prefix security concern from iter 3, removing the dead MOCK_SIDECAR_ prefix reduces attack surface without impacting test coverage.

## Convergence Signal
- New findings this iter: 6
- Cumulative finding count after iter: 46
- New-findings ratio: 0.13
- Continue / converged signal: `continue` (ratio > 0.10; second dead-code pass still yielding novel findings)

## Files Touched (this iter)
- `iterations/iteration-008.md`
- `deltas/iter-008.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
