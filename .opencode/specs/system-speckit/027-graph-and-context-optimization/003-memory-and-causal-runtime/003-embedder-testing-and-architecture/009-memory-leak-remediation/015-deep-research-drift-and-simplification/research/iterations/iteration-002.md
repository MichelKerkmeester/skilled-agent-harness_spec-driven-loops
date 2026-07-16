# Iteration 002 — dead-code (executor: cli-opencode-deepseek-v4-pro)

## Metadata
- Iteration: 2 of 20
- Angle: dead-code
- Executor: cli-opencode-deepseek-v4-pro
- Timestamp: 2026-05-22T23:30:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
- Cumulative findings before this iter: 4

## Summary
Reviewed the primary sidecar files (548+229+254+299+519 LOC) for unreachable branches, unused exports, test-only API surfaces, and dead fallback chains. Found 7 dead-code issues: 2 P1 (unreachable fallback chain in sidecar-worker model-name resolution, test-only production export in execution-router) and 5 P2 (unused type exports, test-only function exports, unreachable dimension fallback, and unused named module.exports). All findings are novel — no overlap with prior drift iteration.

## New Findings

### P0 — Blockers
None

### P1 — Required

**Title: Unreachable model-name fallback chain in sidecar-worker getModelName**
- **Fingerprint:** `dead-code:sidecar-worker:unreachable-model-fallback-chain`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:54-59`
- **Evidence:**
  ```typescript
  function getModelName(requestModel: string): string {
    return requestModel
      || process.env.SPECKIT_EMBEDDER_SIDECAR_MODEL
      || process.env.HF_EMBEDDINGS_MODEL
      || 'BAAI/bge-base-en-v1.5';
  }
  ```
  The parent `SidecarClient` always passes `model: this.name` in its embed request (sidecar-client.ts:251) AND always sets `SPECKIT_EMBEDDER_SIDECAR_MODEL` in the child's environment (sidecar-client.ts:344). The `HF_EMBEDDINGS_MODEL` env var check and the hardcoded `'BAAI/bge-base-en-v1.5'` default are **permanently unreachable**.
- **Reasoning:** This creates a false impression of configurability. A developer reading `getModelName` would assume the model name can come from `HF_EMBEDDINGS_MODEL` or a hardcoded default, but neither path is ever taken because the parent process always provides the model both in the environment and the request payload. The dead fallbacks are misleading during debugging and code review.
- **Suggested remediation:** Remove the `HF_EMBEDDINGS_MODEL` and hardcoded default fallbacks. Keep only `requestModel || SPECKIT_EMBEDDER_SIDECAR_MODEL`. If the intent is defense-in-depth, add a comment explaining that the parent always provides these values.
- **Severity rationale:** P1 — Misleading fallback chain that actively deceives maintainers about where the model name can originate. Could lead to wasted debugging time or incorrect configuration attempts.

**Title: Test-only production export __embedderExecutionRouterTestables**
- **Fingerprint:** `dead-code:execution-router:test-harness-exports`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:247-254`
- **Evidence:**
  ```typescript
  export const __embedderExecutionRouterTestables = {
    resolveExecutionPolicy,
    shouldUseSidecar,
    clear(): void {
      directAdapters.clear();
      sidecarClients.clear();
    },
  };
  ```
  This export is only imported by `tests/embedder-sidecar.vitest.ts:12`. The `clear()` method resets internal module state (the `directAdapters` and `sidecarClients` Maps) for test isolation. No production code imports this export.
- **Reasoning:** The dunder-prefix `__` convention signals test-only intent, but the export is still part of the production module's public API surface. The `clear()` function mutates module-level state that should never be touched outside tests. This is dead code in production and a maintenance hazard — it ships a mutation surface designed exclusively for test teardown.
- **Suggested remediation:** Move test-only state isolation into the test file via a module-level reset pattern (e.g., `vi.resetModules()` or a `createFreshRouter()` factory), or gate the export behind `process.env.NODE_ENV === 'test'`.
- **Severity rationale:** P1 — Production module exports a mutation surface with no production callers. The `clear()` method can destroy running sidecar/direct-adapter state if called accidentally, and the dunder name pattern is a convention that doesn't prevent misuse.

### P2 — Suggestions

**Title: Unused export EmbedderSidecarInputType with zero external consumers**
- **Fingerprint:** `dead-code:sidecar-client:unused-embedder-input-type-export`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:18`
- **Evidence:**
  ```typescript
  export type EmbedderSidecarInputType = 'document' | 'query';
  ```
  This type is only referenced within the same file at line 42 (`SidecarEmbedOptions` interface). No other file in the codebase imports `EmbedderSidecarInputType`. A grep across the skill directory confirms zero external consumers.
- **Reasoning:** Exporting an internal type that no one imports is dead API surface. It misleads consumers into thinking this is a public contract when it's actually an implementation detail. The type duplicates `EmbedderExecutionInputType` in execution-router.ts (line 19), which is also unused externally.
- **Suggested remediation:** Remove the `export` keyword, making the type private to the module. If the type is needed externally, document which consumers use it.
- **Severity rationale:** P2 — Zero-cost at runtime (type erasure), but dead API surface creates confusion and maintenance overhead.

**Title: Unused type exports EmbedderExecutionPolicy and EmbedderExecutionInputType**
- **Fingerprint:** `dead-code:execution-router:unused-policy-type-exports`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:18-19`
- **Evidence:**
  ```typescript
  export type EmbedderExecutionPolicy = 'auto' | 'direct' | 'sidecar';
  export type EmbedderExecutionInputType = 'document' | 'query';
  ```
  Both types are only used within `execution-router.ts` itself (lines 22, 57). No external file imports either type.
- **Reasoning:** These types appear to be part of the public API but have zero external consumers. `EmbedderExecutionInputType` duplicates the same concept as `EmbedderSidecarInputType` in sidecar-client.ts. Exporting unused types adds noise to IDE autocomplete and creates the impression of a broader public contract than actually exists.
- **Suggested remediation:** Remove the `export` keyword from both types. If they were intended for future public API surface, document that intent with a comment.
- **Severity rationale:** P2 — Zero-cost at runtime but dead type exports clutter the public API surface and duplicate concepts across files.

**Title: buildSidecarEnv exported solely for test consumption**
- **Fingerprint:** `dead-code:sidecar-client:test-only-buildsidecarenv-export`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:183-195`
- **Evidence:**
  ```typescript
  export function buildSidecarEnv(
    parentEnv: NodeJS.ProcessEnv,
    explicitAllowlist: readonly string[] = [],
  ): NodeJS.ProcessEnv { ... }
  ```
  This function is called from within `sidecar-client.ts` at line 342 (the `SidecarClient.ensureWorker` method). The only external consumer is `tests/embedders/sidecar-hardening.vitest.ts:74`. No production module imports `buildSidecarEnv`.
- **Reasoning:** The function is only exported so tests can verify environment variable filtering behavior independently of the full `SidecarClient` lifecycle. While testability is valuable, exporting internal helpers for test-only access adds dead API surface to production modules. The behavior could instead be tested through `SidecarClient` integration tests.
- **Suggested remediation:** Either make `buildSidecarEnv` private (remove `export`) and test env filtering indirectly through `SidecarClient` behavior, or gate with `process.env.VITEST` / `import.meta.vitest` conditional export.
- **Severity rationale:** P2 — The function is used by tests and has value, but the export itself is dead in production. Low risk but adds to the public API surface.

**Title: Unreachable dimension fallback in sidecar-worker getDimensions**
- **Fingerprint:** `dead-code:sidecar-worker:unreachable-dimensions-fallback`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:61-68`
- **Evidence:**
  ```typescript
  function getDimensions(requestDimensions: number): number {
    if (Number.isInteger(requestDimensions) && requestDimensions > 0) {
      return requestDimensions;
    }
    const envDimensions = Number.parseInt(process.env.SPECKIT_EMBEDDER_SIDECAR_DIMENSIONS || '', 10);
    return Number.isInteger(envDimensions) && envDimensions > 0 ? envDimensions : 768;
  }
  ```
  The parent `SidecarClient` always passes `dimensions: this.dim` (sidecar-client.ts:253), where `this.dim = options.dimensions` from the constructor. `options.dimensions` is a required `number` field in `SidecarClientOptions`. The parent also sets `SPECKIT_EMBEDDER_SIDECAR_DIMENSIONS` in the child's environment (sidecar-client.ts:345). The env fallback and hardcoded `768` are unreachable.
- **Reasoning:** Same pattern as the model-name dead fallback (P1), but less severe because dimensions are less likely to be misconfigured and the fallback is less misleading. Still, dead code that creates a false impression of flexibility.
- **Suggested remediation:** Remove the `SPECKIT_EMBEDDER_SIDECAR_DIMENSIONS` env fallback and the `768` default. The `requestDimensions` parameter is always a valid positive integer from the parent.
- **Severity rationale:** P2 — Unreachable code branch, lower severity than the model-name equivalent because dimensions are less configuration-sensitive.

**Title: Unused named exports in ensure-rerank-sidecar.cjs module.exports**
- **Fingerprint:** `dead-code:ensure-rerank-sidecar:unused-named-exports`
- **File(s):** `.opencode/bin/lib/ensure-rerank-sidecar.cjs:289-298`
- **Evidence:**
  ```javascript
  module.exports = {
    DEFAULT_HEALTH_TIMEOUT_MS,
    DEFAULT_PORT,
    START_SCRIPT_PATH,
    ensureRerankSidecar,
    healthPayload,
    isHealthy,
    waitForHealthy,
    canonicalConfigHash,
    loadOrCreateOwnerToken,
  };
  ```
  Both production consumers (`mk-spec-memory-launcher.cjs:12`) and test consumers (`ensure-rerank-sidecar.vitest.ts:5`) only destructure `ensureRerankSidecar`:
  ```javascript
  const { ensureRerankSidecar } = require('./lib/ensure-rerank-sidecar.cjs');
  ```
  No consumer imports `START_SCRIPT_PATH`, `DEFAULT_HEALTH_TIMEOUT_MS`, or `DEFAULT_PORT` individually.
- **Reasoning:** These exports serve no external consumer. `START_SCRIPT_PATH` is particularly misleading because the `ensureRerankSidecar` function computes its own `startScriptPath` from `sidecarSkillPath` (line 225), never using the module-level constant. `healthPayload`, `isHealthy`, `waitForHealthy`, `canonicalConfigHash`, and `loadOrCreateOwnerToken` are only consumed via the `deps` injection pattern inside `ensureRerankSidecar`, not as standalone imports.
- **Suggested remediation:** Export only `ensureRerankSidecar` from the module. Internal helpers can be exposed via the `deps` injection pattern already used for testing, or extracted to a separate module if they need standalone consumption.
- **Severity rationale:** P2 — Unused exports in a CommonJS module. The `START_SCRIPT_PATH` export is particularly dead since the function body ignores the module-level constant.

## Convergence Signal
- New findings this iter: 7
- Cumulative finding count after iter: 11
- New-findings ratio: 0.64
- Continue / converged signal: `continue` (ratio > 0.10; this is only the first dead-code pass)

## Files Touched (this iter)
- `iterations/iteration-002.md`
- `deltas/iter-002.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
