# Iteration 014 — dead-code (executor: cli-opencode-deepseek-v4-pro)

## Metadata
- Iteration: 14 of 20
- Angle: dead-code
- Executor: cli-opencode-deepseek-v4-pro
- Timestamp: 2026-05-22T22:14:15Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts`
  - `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts`
- Cumulative findings before this iter: 72

## Summary
Third dead-code pass after iters 2 (7 findings) and 8 (6 findings). Deep-probed the `ready()` method contract across all `EmbedderAdapter` implementations, the sidecar-worker fallback chains beyond the model/dimension defaults already covered, and the barrel index.ts export consumer graph. Found 6 novel dead-code findings: 2 P1 (both `ready()` implementations with zero production callers) and 4 P2 (unreachable defaults in sidecar-worker helpers, dead OllamaAdapter class re-exports in barrel, dead NotImplementedError barrel export). All findings verified via grep cross-referencing against production handlers.

## New Findings

### P0 — Blockers
None

### P1 — Required

**Title: SidecarClient.ready() has zero production callers**
- **Fingerprint:** `dead-code:sidecar-client:ready-zero-production-callers`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:272-279`
- **Evidence:**
  ```typescript
  async ready(): Promise<boolean> {
    try {
      await this.ensureHealthyWorker();
      return true;
    } catch {
      return false;
    }
  }
  ```
  `ensureHealthyWorker()` forks a child process as a side effect. Grep across all production handler and search files confirms `.ready()` is only called on registry adapters via `getAdapter(name).ready()` in `embedder-list.ts:77` — which returns an `OllamaAdapter`, never a `SidecarClient`. The `getEmbedderAdapter()` function returns `SidecarClient` for local providers, but callers (`reindex.ts:381`, `vector-index-queries.ts:678`) only call `.embed()`, never `.ready()`. Tests (`sidecar-hardening.vitest.ts`) are the sole callers of `SidecarClient.ready()`.
- **Reasoning:** The `EmbedderAdapter` interface requires `ready()`, and the implementation is correct, but the production code path never reaches it. The method has real side effects (spawning a worker process) which means accidental invocation in a future refactor could silently fork child processes. This is dead code with dormant blast radius.
- **Suggested remediation:** Either wire `.ready()` into a production code path (e.g., `embedder-list` handler should also probe local-sidecar providers) or document that `ready()` on SidecarClient is test-only and gate it behind an environment-aware conditional if it must stay.
- **Severity rationale:** P1 — The method has runtime side effects (fork), and the implementation is never exercised in production. If accidentally called by a future maintainer, it would silently spawn worker processes. The `EmbedderAdapter` interface contract suggests it should be called, but it isn't.

**Title: DirectProviderAdapter.ready() has zero production callers**
- **Fingerprint:** `dead-code:execution-router:directprovideradapter-ready-zero-production-callers`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:175-185`
- **Evidence:**
  ```typescript
  async ready(): Promise<boolean> {
    if (this.registryAdapter) {
      return this.registryAdapter.ready();
    }
    try {
      const provider = await this.getProvider();
      return provider.healthCheck();
    } catch {
      return false;
    }
  }
  ```
  Same grep analysis as `SidecarClient.ready()` — `DirectProviderAdapter` is returned by `getEmbedderAdapter()` for non-local providers (e.g., ollama via registry delegation), but production callers only invoke `.embed()`. The `DirectProviderAdapter` delegates `.ready()` to the registry adapter for ollama, but `embedder-list.ts:77` calls `.ready()` directly on the registry adapter, bypassing `DirectProviderAdapter` entirely. No production code calls `getEmbedderAdapter(...).ready()`.
- **Reasoning:** The `ready()` method on `DirectProviderAdapter` is dead in the production call graph. For the ollama path, `embedder-list.ts` already calls the registry adapter's `.ready()` directly, making the delegation in `DirectProviderAdapter.ready()` redundant. For non-ollama providers, `getProvider()` + `healthCheck()` is never exercised either.
- **Suggested remediation:** Same options as SidecarClient.ready(): wire into production or gate behind test conditionals. Since `embedder-list.ts` already calls `.ready()` on registry adapters, the cleanest fix is to remove the `ready()` method from the `EmbedderAdapter` interface for classes that are only used through `getEmbedderAdapter()`, or conversely wire `embedder_list` to also report readiness for sidecar-managed providers.
- **Severity rationale:** P1 — Same as SidecarClient.ready(): unexercised production code that looks like it should be called per the interface contract. The ollama delegation path is particularly misleading because the registry adapter's `ready()` is already independently exercised by `embedder-list.ts`, making `DirectProviderAdapter.ready()` a duplicate dead abstraction.

### P2 — Suggestions

**Title: getProviderName dead 'hf-local' default fallback**
- **Fingerprint:** `dead-code:sidecar-worker:unreachable-provider-default`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:50-52`
- **Evidence:**
  ```typescript
  function getProviderName(): string {
    return process.env.SPECKIT_EMBEDDER_SIDECAR_PROVIDER || 'hf-local';
  }
  ```
  The parent `SidecarClient.ensureWorker()` in `sidecar-client.ts:343` always sets `SPECKIT_EMBEDDER_SIDECAR_PROVIDER: this.provider` in the child's environment. `this.provider` comes from `SidecarClientOptions.provider`, a required `string` field. The `'hf-local'` fallback is the same dead-fallback pattern as `getModelName` (iter 2 finding 5, P1) and `getDimensions` (iter 2 finding 10, P2).
- **Reasoning:** Third instance of the same unreachable-helper-default antipattern in sidecar-worker. The parent unconditionally provides all environment values that the worker's helpers try to default. This fallback creates a false impression that `'hf-local'` is a valid default provider when in reality the parent determines the provider.
- **Suggested remediation:** Remove the `|| 'hf-local'` fallback. If the env var is somehow unset, the empty string will cause a clear downstream error rather than silently using a wrong provider.
- **Severity rationale:** P2 — Same pattern as the model/dimension dead fallbacks already identified in iter 2. Lower severity because `getProviderName()` is only called once (in `getProvider()` at line 141), and a missing provider would cause a clearer error downstream than a wrong model/dimension fallback.

**Title: handleEmbed dead '?? "document"' nullish coalescing**
- **Fingerprint:** `dead-code:sidecar-worker:unreachable-inputtype-default`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:153`
- **Evidence:**
  ```typescript
  // parseRequest (line 130): always coerces inputType
  inputType: candidate.inputType === 'query' ? 'query' : 'document',

  // handleEmbed (line 153): ?? never fires
  const inputType = request.inputType ?? 'document';
  ```
  `parseRequest()` at line 130 unconditionally sets `inputType` to either `'query'` or `'document'`. Even if the incoming JSON omits `inputType` or passes `undefined`, the ternary always produces a string value. The `?? 'document'` nullish coalescing on line 153 can never trigger because `request.inputType` is never `null` or `undefined` when `parseRequest` is the sole producer of `EmbedRequest` objects.
- **Reasoning:** Dead defensive code. The `?? 'document'` default suggests the author was uncertain whether `inputType` could be nullish, but `parseRequest` guarantees it's always a string. The dead default is harmless at runtime but misleading during code review.
- **Suggested remediation:** Remove the `?? 'document'` fallback: `const inputType = request.inputType;`. If defensive intent is valued, add a comment noting that `parseRequest` always populates this field.
- **Severity rationale:** P2 — Zero runtime cost (the nullish coalescing is fast), but dead code that misleads about where the default is applied. The real defaulting happens in `parseRequest`, not in `handleEmbed`.

**Title: OllamaAdapter + error classes in barrel with zero direct consumers**
- **Fingerprint:** `dead-code:index-barrel:ollama-adapter-classes-zero-consumers`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:37-41`
- **Evidence:**
  ```typescript
  export {
    OllamaAdapter,
    OllamaAdapterError,
    OllamaBackendUnreachableError,
    OllamaDimensionMismatchError,
    OllamaModelNotLoadedError,
  } from './adapters/ollama.js';
  ```
  The only test file that uses these classes (`embedder-ollama.vitest.ts:27`) imports directly from `'../lib/embedders/adapters/ollama.js'`, not through the barrel. No production handler, search module, or context-server imports any of these five classes. They are only used internally by the registry's `getAdapter()` function (which constructs `OllamaAdapter` internally) and thrown within `shared/embeddings/adapters/ollama.ts`.
- **Reasoning:** Five dead-class re-exports in the barrel. Each occupies one line but collectively signals a public API surface that doesn't exist for external consumers. The classes are only consumed through the registry pattern (`getAdapter`) or direct imports from the shared adapter file. The barrel re-exports have zero importers.
- **Suggested remediation:** Remove lines 37-41 from `index.ts`. The classes remain accessible via direct import from `./adapters/ollama.js` and via the shared package. If external consumers later need them through the barrel, they can be re-added.
- **Severity rationale:** P2 — Runtime zero-cost (exports only), but dead API surface that clutters IDE autocomplete and misleads consumers about available imports.

**Title: NotImplementedError barrel export with zero consumers**
- **Fingerprint:** `dead-code:index-barrel:notimplementederror-zero-consumers`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:16`
- **Evidence:**
  ```typescript
  // index.ts:16-17
  export {
    ...
    NotImplementedError,
  } from './registry.js';
  ```
  `NotImplementedError` is defined in `@spec-kit/shared/embeddings/registry.ts:83-89` and thrown internally by `getAdapter()` for unsupported backends. Zero files in the entire `system-spec-kit` skill import `NotImplementedError` — it is not caught or referenced by any handler, test, or search module. The only references are its definition and the barrel re-export.
- **Reasoning:** The class is designed to be catchable by callers of `getAdapter()` for unsupported backends, but no caller catches it. In `getAdapter()`, if a manifest has backend `'api'` or `'sentence-transformers'`, `NotImplementedError` is thrown. However, `embedder-list.ts` wraps `getAdapter(name).ready()` in `probeReady()` which has a `try/catch` that returns `false` for ALL errors — it doesn't specifically catch `NotImplementedError`. The class export in the barrel serves no consumer.
- **Suggested remediation:** Either remove `NotImplementedError` from the barrel export, or add a specific `catch` for it in `probeReady` and `embedder_list` to surface a meaningful "unsupported backend" message instead of a generic `false` readiness status.
- **Severity rationale:** P2 — Runtime zero-cost (export only), but dead API surface. The error class exists to be caught, but no one catches it by type. A missed opportunity for better error signaling.

## Convergence Signal
- New findings this iter: 6
- Cumulative finding count after iter: 78
- New-findings ratio: 0.077
- Continue / converged signal: `continue` (ratio ≤ 0.10, but this is the first dead-code iter below threshold; iter 8 was 0.13. Need 2 consecutive below 0.10 for convergence.)

## Files Touched (this iter)
- `iterations/iteration-014.md`
- `deltas/iter-014.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
