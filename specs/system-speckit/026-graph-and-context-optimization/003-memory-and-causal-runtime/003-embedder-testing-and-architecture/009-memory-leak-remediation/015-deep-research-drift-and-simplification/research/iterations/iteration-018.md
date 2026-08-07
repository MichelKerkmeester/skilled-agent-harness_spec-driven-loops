# Iteration 018 — refinement (executor: cli-opencode-deepseek-v4-pro)

## Metadata
- Iteration: 18 of 20
- Angle: refinement
- Executor: cli-opencode-deepseek-v4-pro
- Timestamp: 2026-05-23T00:45:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts`
- Cumulative findings before this iter: 93

## Summary
Third refinement pass on the embedder sidecar surface. Focused on error-path correctness (silently dropped worker errors, permanently cached rejected promises), type safety (premature assertions before validation, unsafe casts), naming consistency, SQL injection pattern hygiene, and observability gaps. Found 7 novel findings: 2 P1 and 5 P2. Zero overlap with prior refinement iterations (006, findings 30-36; 012, findings 61-68) or any other angle iteration.

## New Findings

### P0 — Blockers
None

### P1 — Required

**Title: Sidecar-worker error responses for pre-parse failures use id=0, silently dropped by client**
- **Fingerprint:** `refinement:sidecar-worker:error-response-id-zero-dropped-by-client`
- **File(s):**
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:207-218`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:443-444,503`
- **Evidence:**
  ```typescript
  // sidecar-worker.ts:207-218 — requestId initialized to 0
  void (async () => {
    let requestId = 0;
    try {
      const request = parseRequest(trimmed);  // may throw before extracting id
      requestId = request.id;
      await handleRequest(request);
    } catch (error: unknown) {
      writeJson({
        id: requestId,   // 0 if parseRequest threw before setting it
        type: 'error',
        message: toErrorMessage(error),
      });
    }
  })();

  // sidecar-client.ts:443-444 — nextId starts at 1, never 0
  const id = this.nextId;        // 1, 2, 3, ...
  this.nextId += 1;

  // sidecar-client.ts:503 — get(0) always returns undefined
  const pending = this.pending.get(parsed.id);
  if (!pending) {
    return;  // silently dropped
  }
  ```
- **Reasoning:** When `parseRequest()` throws before `requestId = request.id` executes (line 211), `requestId` remains 0 (line 208). The error response written at line 214 carries `id: 0`. The client's `handleResponseLine()` at line 503 calls `this.pending.get(0)`, which always returns `undefined` because `nextId` is initialized to 1 (line 214) and only increments upward. The error response is silently dropped — the client-side caller waits until timeout (30s default), receiving a misleading "request timed out" error instead of the actual worker error. This masks real failures: JSON parse errors, invalid envelope errors, and unknown request type errors from the worker are invisible to the client.
- **Suggested remediation:** Initialize `requestId` to a sentinel like `-1` and, in the catch block, check if `requestId` is still the sentinel. If so, attempt to parse the raw line for an `id` field before writing the error response. If no `id` can be recovered, skip writing the error response entirely (the client has no pending request to associate it with). Alternatively, parse the `id` from the raw JSON before the full parseRequest for safety.
- **Severity rationale:** P1 — Error responses from the worker being silently dropped means real failures manifest as timeouts with no diagnostic information. The developer sees "request timed out after 30000ms" instead of "Invalid sidecar request envelope" or "Unknown sidecar request type: X". This directly impedes debugging. The blast radius includes JSON parse failures and protocol violations — both plausible during development and configuration changes.

**Title: Cached rejected provider promise persists indefinitely in both adapter paths**
- **Fingerprint:** `refinement:embedders:cached-rejected-provider-promise-no-recovery`
- **File(s):**
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:138-149`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:187-197,30-31`
- **Evidence:**
  ```typescript
  // sidecar-worker.ts:138-149 — module-level cache
  let providerPromise: Promise<IEmbeddingProvider> | null = null;  // line 43
  async function getProvider(request: EmbedRequest): Promise<IEmbeddingProvider> {
    if (!providerPromise) {
      providerPromise = createEmbeddingsProvider({ ... });  // may reject
    }
    return providerPromise;  // rejected promise cached forever
  }

  // execution-router.ts:187-197 — instance-level cache (adapter cached at line 30)
  private providerPromise: Promise<IEmbeddingProvider> | null = null;  // line 135
  private getProvider(): Promise<IEmbeddingProvider> {
    if (!this.providerPromise) {
      this.providerPromise = createEmbeddingsProvider({ ... });  // may reject
    }
    return this.providerPromise;  // rejected promise cached forever
  }
  // execution-router.ts:30 — adapter instances cached globally
  const directAdapters = new Map<string, EmbedderAdapter>();
  ```
- **Reasoning:** Both locations lazily initialize and cache a `providerPromise`. If `createEmbeddingsProvider()` rejects (e.g., unreachable ollama server, invalid API key, network failure), the rejected promise is stored and all future calls return the same rejection. For sidecar-worker, the client detects this via failed health checks (ping returns false) and triggers a worker restart — the worker process dies, clearing the module-level cache. For DirectProviderAdapter, there is NO recovery mechanism: the adapter instance is cached indefinitely in `directAdapters` (execution-router.ts:30, set at line 226) and never evicted. If the ollama server becomes temporarily unreachable, `getProvider()` permanently returns a rejected promise for that provider/model pair until the MCP server restarts. The consumer (`runJob` in reindex.ts) calls `adapter.embed()` which propagates the cached rejection — the reindex fails and retries all fail identically.
- **Suggested remediation:** In both locations, wrap the cached promise: on resolution, return the resolved provider; on rejection, null out the cache and re-throw so the next call retries. For DirectProviderAdapter, also consider adding a `clearCache()` or `reset()` method that evicts the adapter from `directAdapters` on persistent failure. Alternatively, add a jittered retry with exponential backoff at the `getProvider` level.
- **Severity rationale:** P1 — For DirectProviderAdapter, this creates a permanent failure mode for a provider/model pair after a single transient error. The blast radius is every subsequent reindex and embed request for that provider/model. Recovery requires an MCP server restart. For sidecar-worker, the impact is mitigated by client-side health checks and worker restart, but the pattern itself (caching failure promise) is a correctness anti-pattern that should be documented or fixed.

### P2 — Suggestions

**Title: Manual SQL escaping via string replace instead of parameterized queries in writeVectorsToShard**
- **Fingerprint:** `refinement:reindex:write-vector-shard-manual-sql-escaping`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:305-306`
- **Evidence:**
  ```typescript
  // reindex.ts:298-313 — provider/model interpolated into SQL via template literal
  shard.exec(`
    CREATE TABLE IF NOT EXISTS vec_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
    INSERT OR REPLACE INTO vec_metadata (key, value) VALUES
      ('provider', '${profile.provider.replace(/'/g, "''")}'),
      ('model', '${profile.model.replace(/'/g, "''")}'),
      ('dim', '${String(profile.dim)}'),
      ('embedding_dim', '${String(profile.dim)}');
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY,
      vec BLOB NOT NULL
    );
  `);
  ```
- **Reasoning:** The function manually escapes provider and model values for SQL using `.replace(/'/g, "''")`. While this correctly prevents SQL injection for the current input, the pattern is fragile: a future developer adding a new interpolated value might forget the `.replace()`, introducing an injection vector. The `tableName` at line 309 is also interpolated but comes from `vecTableNameForDim(dim)` which guarantees a safe value. The rest of the codebase (e.g., `selectJob`, `setJobStatus`, `writeVectors`) uses parameterized queries via `db.prepare().run()` — this interpolated SQL in `writeVectorsToShard` is the sole exception to the consistent parameterized-query pattern. The function uses a separate `new Database()` connection (line 283), which means parameterized queries are possible.
- **Suggested remediation:** Split the DDL from the data insertion: execute `CREATE TABLE IF NOT EXISTS` and `INSERT OR REPLACE` separately. Use `shard.prepare('INSERT OR REPLACE INTO vec_metadata (key, value) VALUES (?, ?)').run('provider', profile.provider)` for the INSERT statements. Keep `CREATE TABLE` as exec since `tableName` is safe. This eliminates the manual escaping and aligns with the rest of the codebase.
- **Severity rationale:** P2 — The escaping is currently correct and the blast radius is bounded (provider/model names come from the EmbeddingProfile constructor, which receives controlled values). However, the pattern is a maintainability hazard: a single missed `.replace()` in a future edit introduces SQL injection. Fixing this preserves correctness and aligns with codebase conventions.

**Title: Inconsistent `dimensions` vs `dim` naming across options interface, response type, and stored field**
- **Fingerprint:** `refinement:sidecar-client:dimensions-vs-dim-naming-inconsistency`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:20-31,54-56,226,256-268`
- **Evidence:**
  ```typescript
  // sidecar-client.ts:23 — options interface uses 'dimensions'
  export interface SidecarClientOptions {
    readonly dimensions: number;
  }

  // sidecar-client.ts:54-56 — response type uses 'dimensions'
  interface SidecarEmbeddingResponse {
    readonly dimensions: number;
  }

  // sidecar-client.ts:226 — stored as 'dim' (matches EmbedderAdapter.dim)
  this.dim = options.dimensions;

  // sidecar-client.ts:256 — checked against 'this.dim'
  if (response.dimensions !== this.dim) {

  // sidecar-client.ts:264 — vector dimension check uses 'this.dim'
  if (vector.length !== this.dim) {
  ```
- **Reasoning:** The same concept (embedding vector dimension count) uses two names in the same file: `dimensions` in the public-facing `SidecarClientOptions` interface and `SidecarEmbeddingResponse` type, but `dim` for the class field (inheriting from `EmbedderAdapter.dim`). The `SidecarClient` class field `this.dim` is initialized from `options.dimensions` at line 226. A developer reading the constructor must mentally map `options.dimensions` → `this.dim`. A developer reading `embed()` must map `response.dimensions` → `this.dim`. This name inconsistency creates cognitive friction and increases the chance of a typo during refactoring. The `EmbedderAdapter` interface (canonical contract from `@spec-kit/shared`) uses `dim` — suggesting `SidecarClientOptions` should follow suit.
- **Suggested remediation:** Rename `SidecarClientOptions.dimensions` to `dim` to match `EmbedderAdapter`. Rename `SidecarEmbeddingResponse.dimensions` to `dim` for consistency within the module. This is a TypeScript-only change (field names in interfaces don't affect runtime JSON). Alternatively, if the JSON protocol contract from the worker uses `dimensions`, add a single mapping at the JSON boundary (`response.dim = response.dimensions`) and use `dim` everywhere internally.
- **Severity rationale:** P2 — Purely a naming/readability issue with zero functional impact. However, inconsistent naming within a 548-line file signals lack of a naming convention decision and adds subtle friction to every code review touching dimension-related logic.

**Title: runJob silently exits on cancellation with no log entry**
- **Fingerprint:** `refinement:reindex:runjob-cancellation-silent-exit-no-logging`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:371-374,393-394`
- **Evidence:**
  ```typescript
  // reindex.ts:371-374 — first cancellation check
  if (getCancellationStatus(db, jobId) === 'cancelled') {
    return;  // silent — no log, no status update beyond 'cancelled' already set
  }

  // reindex.ts:393-394 — second cancellation check (before completion)
  if (getCancellationStatus(db, jobId) === 'cancelled') {
    return;  // silent — job status already set to 'cancelled' by cancelJob()
  }
  ```
  Compare with the `failed` path at lines 405-416 which logs structured details:
  ```typescript
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    setJobStatus(db, jobId, 'failed', processed, message);
    logger.error('embedder reindex job failed', {
      event: 'embedder_reindex_failed',
      jobId, toName: initialJob.toName, processed, total: initialJob.total, error: message,
    });
  }
  ```
- **Reasoning:** When a reindex job is cancelled mid-execution (via `cancelJob()` setting status to `'cancelled'`), `runJob()` detects the cancellation at two checkpoints and silently returns. No log entry records the cancellation event. An operator investigating "why didn't my reindex complete?" sees a job with `status: 'cancelled'` and `processed < total` but no log entry explaining when or why. The `failed` path logs structured details via `logger.error`; the `completed` path has implicit success (status update visible via `getJobStatus`). The `cancelled` path has neither. This is a minor observability gap but makes debugging cancellation scenarios harder than necessary.
- **Suggested remediation:** Add a `logger.info('embedder reindex job cancelled', { event: 'embedder_reindex_cancelled', jobId, toName: initialJob.toName, processed, total: initialJob.total })` at both cancellation return sites. Keep it at `info` level since cancellation is an intentional operation, not an error.
- **Severity rationale:** P2 — Cancellation is an explicit, user-requested operation and typically non-problematic. But the asymmetry in logging (failed logs, cancelled silences) creates a debugging blind spot that's trivially fixed.

**Title: sendRequest resolves pending promise with unsafe `value as T` type assertion**
- **Fingerprint:** `refinement:sidecar-client:sendrequest-resolve-unsafe-cast`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:457-458`
- **Evidence:**
  ```typescript
  // sidecar-client.ts:457-458 — resolve closure casts unknown to T
  this.pending.set(id, {
    resolve: (value: unknown) => resolve(value as T),
    reject,
    timer,
  });
  ```
  The `PendingRequest` interface (line 45-49) types `resolve` as `(value: unknown) => void`. The `sendRequest` method's `resolve` callback receives `unknown` and casts it to `T extends SidecarResponse`. This cast is unsafe: `value` is resolved by `handleResponseLine` at line 518 (`pending.resolve(response)`) where `response` is already cast via `parsed as SidecarResponse` (line 513). However, the `resolve` line at 458 provides NO runtime validation — the caller (`embed()` at line 248) expects a `SidecarEmbeddingResponse` with `vectors: number[][]` and `dimensions: number`. If `handleResponseLine` were ever modified to resolve with a different shape (e.g., a PongResponse mistakenly routed to an embed caller), the `as T` cast would silently coerce at compile time while producing a runtime TypeError in `embed()`.
- **Reasoning:** This is the mirror of finding 62 (unsafe assertion in `handleResponseLine`). While `handleResponseLine` does the initial cast, this second cast at the promise resolution boundary similarly suppresses TypeScript's type checking. The two casts compound: a malformed response passes through `parsed as SidecarResponse` (finding 62), then through `resolve(value as T)` (this finding), reaching the caller with no validation at either boundary. The structural validation in `embed()` at lines 256-268 is the sole defense, and it only validates dimensions — not that `vectors` is actually `number[][]`.
- **Suggested remediation:** Either: (a) remove the cast and type `PendingRequest.resolve` as `(response: SidecarResponse) => void` with `sendRequest<T>` narrowing at call sites, or (b) add a runtime discriminator check in `handleResponseLine` that validates `response.type === 'embedding'` before resolving embed-specific requests, matching the generic parameter `T`. The second approach complements finding 62's proposed fix.
- **Severity rationale:** P2 — The cast is currently harmless because both sides are our code and `handleResponseLine` resolves exactly what `sendRequest<T>` expects. However, the pattern violates TypeScript's type-narrowing contract and would silently mask type errors during protocol evolution. Trivial to fix alongside finding 62.

**Title: parseRequest uses premature type assertion before runtime validation**
- **Fingerprint:** `refinement:sidecar-worker:parserequest-premature-type-assertion-before-validation`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:106,109,111-112,119`
- **Evidence:**
  ```typescript
  // sidecar-worker.ts:106 — assertion applied BEFORE any validation
  const parsed = JSON.parse(line) as Partial<WorkerRequest>;
  // Validation starts at line 107:
  if (!parsed || typeof parsed !== 'object' || typeof parsed.id !== 'number' || typeof parsed.type !== 'string') {
    throw new Error('Invalid sidecar request envelope');
  }
  // Lines 111-112 and 119 — further assertions on already-asserted value
  return parsed as PingRequest | ShutdownRequest;
  const candidate = parsed as Partial<EmbedRequest>;
  ```
- **Reasoning:** The function applies `as Partial<WorkerRequest>` on the `any` result from `JSON.parse` at line 106, BEFORE any validation occurs. If a future developer removes or weakens one of the validation checks at lines 107-109, TypeScript won't catch the gap because `parsed` is already typed as `Partial<WorkerRequest>` — the compiler trusts the assertion. The proper TypeScript pattern is: `JSON.parse(line)` → `unknown`, validate with type guards, THEN narrow. This pattern ensures that removing a validation causes a compile error at the next usage site. The repeated assertions (`as PingRequest | ShutdownRequest` at line 112, `as Partial<EmbedRequest>` at line 119) are necessary because of the premature assertion — each sub-branch re-narrows from the overly-broad `Partial<WorkerRequest>`. Using `unknown` → validate → narrow would eliminate these redundant casts.
- **Suggested remediation:** Change line 106 to: `const parsed: unknown = JSON.parse(line);` (or `JSON.parse(line) as unknown`). Then use explicit type guards: `if (typeof parsed !== 'object' || parsed === null) throw ...`. Extract `const id = (parsed as Record<string, unknown>).id;` only after validation. This makes the validation the single gatekeeper and eliminates the need for subsequent `as` casts.
- **Severity rationale:** P2 — The function is currently correct (all validations are present and complete). However, the pattern is a maintainability anti-pattern: premature type assertion suppresses the compiler's ability to enforce validation completeness. Easy to fix with zero behavioral change.

## Convergence Signal
- New findings this iter: 7
- Cumulative finding count after iter: 100
- New-findings ratio: 0.070
- Continue / converged signal: `continue` (ratio ≤ 0.10, but only the first refinement iteration at or below threshold; the prior refinement iteration 012 had ratio 0.118 > 0.10, so two consecutive convergence-criterion passes have not yet been met)

## Files Touched (this iter)
- `iterations/iteration-018.md`
- `deltas/iter-018.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
