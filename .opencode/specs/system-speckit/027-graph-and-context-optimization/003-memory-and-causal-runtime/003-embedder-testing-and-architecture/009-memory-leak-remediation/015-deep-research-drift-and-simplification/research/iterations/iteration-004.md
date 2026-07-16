# Iteration 004 — over-engineering (executor: cli-opencode-deepseek-v4-pro)

## Metadata
- Iteration: 4 of 20
- Angle: over-engineering
- Executor: cli-opencode-deepseek-v4-pro
- Timestamp: 2026-05-22T23:55:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
- Cumulative findings before this iter: 17

## Summary
Reviewed the full sidecar surface (sidecar-client 548 LOC, sidecar-worker 229 LOC, execution-router 254 LOC, ensure-rerank-sidecar 299 LOC, reindex 519 LOC) for over-engineering: abstractions with 1-2 callers, premature flexibility, single-use indirections, and unnecessary layering. Found 7 novel findings — 3 P1 (SidecarClientOptions config-only-for-tests, worker single-caller helper chain, duplicate single-property EmbedOptions interfaces) and 4 P2 (resolvePort semantic overload, skipIfDisabled always-true, DirectProviderAdapter single-instantiation, ReindexJob/JobRow dual representation). Zero overlap with prior drift, dead-code, or security iterations.

## New Findings

### P0 — Blockers
None

### P1 — Required

**Title: SidecarClient constructor accepts 7 optional fields serving only test consumers**
- **Fingerprint:** `over-engineering:sidecar-client:optional-config-fields-only-for-tests`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:20-31`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:211-216`
- **Evidence:**
  ```typescript
  export interface SidecarClientOptions {
    readonly provider: string;
    readonly model: string;
    readonly dimensions: number;
    readonly backend?: BackendKind;          // test only
    readonly workerPath?: string;            // test only
    readonly idleMs?: number;                // test only
    readonly pingTimeoutMs?: number;         // test only
    readonly requestTimeoutMs?: number;      // test only
    readonly envAllowlist?: readonly string[]; // test only
    readonly env?: NodeJS.ProcessEnv;        // test only
  }
  ```
  The sole production caller (execution-router.ts:211-216) passes only `provider`, `model`, `dimensions`, `backend`:
  ```typescript
  client = new SidecarClient({
    provider: normalizeProvider(provider),
    model,
    dimensions,
    backend: toBackendKind(provider),
  });
  ```
  Four test files instantiate `SidecarClient` with extra options (`workerPath`, `envAllowlist`, `env`, timeout values). Each optional field also supports a `SPECKIT_EMBEDDER_SIDECAR_*` environment variable override (sidecar-client.ts:229-233), creating a triple-layered config path (default → env var → constructor option). Seven optional fields exist for a single production caller that uses none of them.
- **Reasoning:** The constructor surface is designed as if `SidecarClientOptions` serves many diverse production callers with varying needs. In reality, the single production caller always uses the same 4 fields, and all 7 optional fields exist solely for test injection. This is premature flexibility — the config surface is 2.5× larger than production needs, and each option carries maintenance burden (documentation, default resolution, env var parsing, type safety). The triple-layered defaultValue/parsePositiveIntegerEnv/constructorOption resolution path for timeout values (sidecar-client.ts:229-233) adds 3 fallback levels for a value that production always leaves at default.
- **Suggested remediation:** Collapse `SidecarClientOptions` to the 3 required fields plus `backend`. Extend it internally or behind a test-only factory (`createSidecarClientForTest(opts)`) for test injection. If env var overrides are genuinely needed in production, keep only those and remove the constructor-level overrides.
- **Severity rationale:** P1 — The bloated config surface is a maintenance hazard: every optional field must be threaded through constructor, type definition, default resolution, and env var parsing. Adding a new production feature means navigating 7 irrelevant knobs. The risk is that future production code accidentally depends on a test-oriented option, creating a false contract.

**Title: Sidecar-worker single-caller helper function indirection chain**
- **Fingerprint:** `over-engineering:sidecar-worker:single-caller-helper-indirection`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:50-149`
- **Evidence:** Seven helper functions each called from exactly one location:
  - `getProviderName()` (line 50-52) → called only at line 141
  - `getModelName()` (line 54-59) → called only at line 142
  - `getDimensions()` (line 61-68) → called only at line 143
  - `parentProcessAlive()` (line 74-85) → called only at line 94
  - `startParentDeathPolling()` (line 87-99) → called only at line 199
  - `isStringArray()` (line 101-103) → called only at line 120
  - `toErrorMessage()` (line 70-72) → called only at line 217
  - `getProvider()` (line 138-149) → called only at line 152
  These 8 functions occupy ~55 lines and are each called from exactly one call site. The extract-then-once-call pattern adds indirection without reuse — the reader must jump from call site to definition and back to understand a linear flow.
- **Reasoning:** Extracting a function is justified by reuse (3+ callers), testability (mocking boundary), or complexity encapsulation (the extraction hides non-trivial logic). None of these hold here: each helper has exactly one caller, none are independently tested, and most are trivial (2-4 line wrappers around env reads or `Array.isArray`). The `getProviderName`/`getModelName`/`getDimensions` triplet is particularly egregious — three single-use functions that could be inlined into `getProvider` (themselves a single-use wrapper). The result is a file that reads like a bottom-up decomposition exercise rather than a purpose-built worker.
- **Suggested remediation:** Inline `getProviderName`, `getModelName`, `getDimensions`, and `isStringArray` into their single call sites. Keep `parentProcessAlive` (nontrivial logic), `startParentDeathPolling` (encapsulates lifecycle concern), and `toErrorMessage` (used at error boundary, reasonable extraction). Collapse `getProvider` into `handleEmbed` since it's only called from there. Target: ~30 line reduction.
- **Severity rationale:** P1 — Indirection without reuse makes the code harder to follow during debugging and onboarding. Each extracted function implies a reusable abstraction that doesn't exist, misleading readers about the architecture. The worker module is only 229 lines; 55 lines of single-use indirection is ~24% overhead.

**Title: Duplicate single-property EmbedOptions interfaces across two files**
- **Fingerprint:** `over-engineering:embed-options:duplicate-single-property-interfaces`
- **File(s):**
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:41-43`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:21-23`
- **Evidence:**
  ```typescript
  // sidecar-client.ts:41-43
  interface SidecarEmbedOptions {
    readonly inputType?: EmbedderSidecarInputType;
  }

  // execution-router.ts:21-23
  interface EmbedOptions {
    readonly inputType?: EmbedderExecutionInputType;
  }
  ```
  Both interfaces define an identical shape: a single optional `inputType` property typed as `'document' | 'query'`. The type aliases `EmbedderSidecarInputType` (sidecar-client.ts:18) and `EmbedderExecutionInputType` (execution-router.ts:19) duplicate the same union. Both interfaces exist only to satisfy the `EmbedderAdapter.embed()` contract (defined in `@spec-kit/shared/embeddings/adapter.js`), which likely already defines its own options type. These are local shadows of a contract that already exists upstream.
- **Reasoning:** A named interface wrapping a single optional field is over-engineering by itself — the field could be an inline optional parameter. Defining the same single-field interface independently in two files doubles the problem. If the upstream `EmbedderAdapter` already defines an options type, these two interfaces are dead-weight shadows. The `EmbedderSidecarInputType`/`EmbedderExecutionInputType` type aliases (already flagged as dead-code P2 in iteration 2) exist only to feed these interfaces. This is a layering failure: each file solved the same trivial problem independently rather than importing a shared definition.
- **Suggested remediation:** If `@spec-kit/shared/embeddings/adapter.js` exports an `EmbedOptions` type, import and use it in both files, removing both local interfaces and their type aliases. If the upstream type doesn't exist, define a single `EmbedOptions` in `adapter.ts` (the local re-export shim) and import it. If the `inputType` parameter is genuinely optional at every call site, consider removing the options object entirely and using a second optional parameter.
- **Severity rationale:** P1 — Duplicate interfaces for the same concept create drift risk (one file changes, the other doesn't) and add ~8 lines of dead type-surface. Combined with the type-alias dead-code from iteration 2, this represents a cluster of over-engineered type scaffolding around a single Boolean-like toggle.

### P2 — Suggestions

**Title: `resolvePort` function semantically overloaded to parse timeout values**
- **Fingerprint:** `over-engineering:ensure-rerank-sidecar:resolveport-used-for-timeout`
- **File(s):** `.opencode/bin/lib/ensure-rerank-sidecar.cjs:21-24,219`
- **Evidence:**
  ```javascript
  function resolvePort(value, fallback = DEFAULT_PORT) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  // Used for port (line 218):
  const port = resolvePort(options.port ?? processObj.env.RERANK_SIDECAR_PORT);

  // Also used for timeout (line 219):
  const timeoutMs = resolvePort(options.healthTimeoutMs ?? DEFAULT_HEALTH_TIMEOUT_MS, DEFAULT_HEALTH_TIMEOUT_MS);
  ```
  The function is named `resolvePort` but is reused on line 219 to parse `healthTimeoutMs` — a millisecond timeout value, not a port. The function body (parse number, validate positive, fallback) is generic enough to work for both, but the semantic conflation is misleading: a reader seeing `resolvePort(options.healthTimeoutMs, DEFAULT_HEALTH_TIMEOUT_MS)` would not immediately understand it parses a timeout.
- **Reasoning:** The function's generic behavior (validate positive integer) doesn't justify extraction — `Number.isFinite(Number(x)) && x > 0 ? x : fallback` is a one-liner. The naming misleads about intent, and the reuse across unrelated domains (network port vs millisecond timeout) suggests the author recognized the function was generic and reused it rather than creating a properly-named alternative. This is over-engineering masquerading as DRY.
- **Suggested remediation:** Rename to `resolvePositiveInt(value, fallback)` or `resolveNonZeroNumber(value, fallback)`. Alternatively, inline the one-line check at the two call sites since the extraction adds indirection without meaningful abstraction.
- **Severity rationale:** P2 — Not a correctness issue (the numeric validation is identical for both uses), but the misleading name is a readability and maintenance hazard. Low risk, easy fix.

**Title: `skipIfDisabled` parameter always `true` in single production call**
- **Fingerprint:** `over-engineering:ensure-rerank-sidecar:skipifdisabled-always-true-production`
- **File(s):** `.opencode/bin/lib/ensure-rerank-sidecar.cjs:220,230`, `.opencode/bin/mk-spec-memory-launcher.cjs:449`
- **Evidence:**
  ```javascript
  // ensure-rerank-sidecar.cjs:220
  const skipIfDisabled = options.skipIfDisabled !== false;

  // ensure-rerank-sidecar.cjs:230
  if (skipIfDisabled && !crossEncoderEnabled) {
    return { spawned: false, port, fallback: 'cross-encoder-disabled' };
  }
  ```
  The sole production caller (mk-spec-memory-launcher.cjs:449) never passes `skipIfDisabled`:
  ```javascript
  const rerankResult = await ensureRerankSidecar({
    port: startPort,
    healthTimeoutMs: startTimeout,
  });
  ```
  Only a benchmark script (`run-ab.sh`) and the original plan.md reference pass `skipIfDisabled: false`. Combined with the `crossEncoderEnabled` check on line 222, there are two mechanisms controlling the same skip decision: an opt-out parameter (always true) and an env var gate (`SPECKIT_CROSS_ENCODER`). The parameter adds a code path that production never exercises.
- **Reasoning:** The `skipIfDisabled` parameter was designed for a use case that never materialized in production. The `crossEncoderEnabled` environment variable check already gates the skip behavior. Having both mechanisms means a maintainer must understand which takes precedence and why the parameter exists. The single production call site never uses it, making it dead configuration surface.
- **Suggested remediation:** Remove `skipIfDisabled` from the options interface and the `!== false` check. The `crossEncoderEnabled` env var is sufficient to control the skip. If benchmarks need to bypass the check, they can set `SPECKIT_CROSS_ENCODER=true` instead.
- **Severity rationale:** P2 — Dead configuration option in the production path. Low risk (always true means it never changes behavior), but adds complexity to the function signature and internal branching.

**Title: `DirectProviderAdapter` 68-line class with single instantiation site and ollama delegation branch**
- **Fingerprint:** `over-engineering:execution-router:directprovideradapter-single-instantiation`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:130-198,225`
- **Evidence:**
  ```typescript
  // Single instantiation site (line 225):
  adapter = new DirectProviderAdapter(normalizeProvider(provider), model, dimensions);

  // Ollama delegation branch (lines 154-159):
  if (this.registryAdapter) {
    const adapter = this.registryAdapter as EmbedderAdapter & {
      embed: (input: ReadonlyArray<string>, opts?: EmbedOptions) => Promise<Float32Array[]>;
    };
    return adapter.embed(texts, options);
  }
  ```
  `DirectProviderAdapter` is instantiated exactly once (execution-router.ts:225) and implements `EmbedderAdapter`, which has only one other local implementor (`SidecarClient` in sidecar-client.ts). The class includes a `registryAdapter` field set only when the provider is `ollama` (line 146), used exclusively to delegate `embed()` calls. This creates two code paths (`embed()` via ollama adapter vs. direct `IEmbeddingProvider`) inside a class with a single instantiation. The `ready()` method (line 175-185) similarly branches on `registryAdapter` existence.
- **Reasoning:** The class encapsulates two behaviors (ollama delegation, direct provider) that could be resolved at the factory level (`getEmbedderAdapter`). Instead of `new DirectProviderAdapter(normalizeProvider(provider), model, dimensions)` loading an ollama adapter internally, the factory could return the ollama adapter directly when the provider is ollama, eliminating the branching class. The class adds 68 lines of abstraction (constructor, 3 methods, lazy init, type assertion) for what is essentially a function call dispatcher with two modes.
- **Suggested remediation:** Move the ollama check from `DirectProviderAdapter` constructor into `getEmbedderAdapter`: if the provider is ollama, return `getAdapter(model)` directly (wrapping if needed). The `DirectProviderAdapter` then handles only the direct `IEmbeddingProvider` path, reducing to ~40 lines with no branching.
- **Severity rationale:** P2 — The class works correctly but carries dead branching weight. The ollama delegation path is only exercised for ollama providers, yet the class structure suggests it's a general-purpose adapter with multiple backends. Refactoring would reduce ~28 lines and eliminate the type assertion.

**Title: `ReindexJob`/`JobRow` dual representation with `normalizeJob()` field-name converter**
- **Fingerprint:** `over-engineering:reindex:dual-job-row-representation`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:32-65,123-136`
- **Evidence:**
  ```typescript
  // CamelCase public interface:
  export interface ReindexJob {
    readonly id: string;
    readonly fromName: string;
    readonly toName: string;
    readonly toDim: number;
    readonly total: number;
    readonly processed: number;
    readonly status: ReindexJobStatus;
    readonly startedAt: string;
    readonly updatedAt: string;
    readonly error?: string;
  }

  // snake_case DB row interface:
  interface JobRow {
    readonly id: string;
    readonly from_name: string;
    readonly to_name: string;
    readonly to_dim: number;
    readonly total: number;
    readonly processed: number;
    readonly status: ReindexJobStatus;
    readonly started_at: string;
    readonly updated_at: string;
    readonly error: string | null;
  }

  // Converter:
  function normalizeJob(row: JobRow): ReindexJob {
    return {
      id: row.id,
      fromName: row.from_name,
      toName: row.to_name,
      toDim: row.to_dim,
      total: row.total,
      processed: row.processed,
      status: row.status,
      startedAt: row.started_at,
      updatedAt: row.updated_at,
      ...(row.error ? { error: row.error } : {}),
    };
  }
  ```
  Both interfaces represent identical data with different naming conventions. `normalizeJob()` maps between them. The converter is called at every `selectJob`/`selectActiveJob` return and in `resumeReindexJobs`. The same mapping could be achieved with SQL column aliases (`SELECT from_name AS fromName, ...`) or by dropping the `JobRow` interface entirely and using the query's return type directly.
- **Reasoning:** This is a standard pattern in some codebases, but in a module with a single table (`embedder_jobs`) and simple queries, the dual representation adds ~30 lines without value. The `JobRow` interface exists only to type the raw query results before conversion — better-sqlite3's `.get()`/`.all()` could return typed results directly via column aliases. The `error: string | null` vs `error?: string` distinction is the only semantic difference, handled by the spread conditional.
- **Suggested remediation:** Use SQL column aliases in queries (`SELECT from_name AS fromName, to_name AS toName, ...`) to return camelCase directly from the database. Remove `JobRow` interface and `normalizeJob()` function. The `error: string | null` vs `error?: string` distinction can be handled with a lightweight post-processing step or by accepting `null` in the public interface.
- **Severity rationale:** P2 — Zero behavioral impact, but adds maintenance overhead: any new field added to `ReindexJob` must be mirrored in `JobRow` and `normalizeJob()`. Risk of the two interfaces drifting if one is updated without the other.

## Convergence Signal
- New findings this iter: 7
- Cumulative finding count after iter: 24
- New-findings ratio: 0.29
- Continue / converged signal: `continue` (ratio > 0.10; this is the first over-engineering pass)

## Files Touched (this iter)
- `iterations/iteration-004.md`
- `deltas/iter-004.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
