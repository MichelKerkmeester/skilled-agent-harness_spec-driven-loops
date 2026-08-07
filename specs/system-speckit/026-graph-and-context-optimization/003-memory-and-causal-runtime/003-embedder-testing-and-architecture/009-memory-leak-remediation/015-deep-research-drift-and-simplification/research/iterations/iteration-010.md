# Iteration 010 — over-engineering (executor: cli-opencode-deepseek-v4-pro)

## Metadata
- Iteration: 10 of 20
- Angle: over-engineering
- Executor: cli-opencode-deepseek-v4-pro
- Timestamp: 2026-05-22T23:58:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs`
- Cumulative findings before this iter: 51

## Summary
Second pass on the over-engineering angle across the full sidecar surface (~1,845 LOC). Iteration 4 covered 7 findings (config bloat, single-call helpers, duplicate interfaces, semantic overload, dead params, single-use classes, dual representations). This iteration goes deeper into structural over-engineering: dead conditional branches, fire-and-forget lifecycle machinery that undermines its own intent, redundant query functions, unused abstraction layers, and repeated normalization. Found 5 novel findings — 2 P1, 3 P2. Zero overlap with the 7 over-engineering findings from iteration 4 or any other angle. The new-findings ratio of 0.09 suggests the over-engineering surface is nearing saturation.

## New Findings

### P0 — Blockers
None

### P1 — Required

**Title: resolveDimensions 4-level fallback ladder with dead 3rd level**
- **Fingerprint:** `over-engineering:execution-router:resolve-dimensions-dead-branch`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:80-96`
- **Evidence:**
  ```typescript
  function resolveDimensions(provider: string, model: string, dimensions?: number): number {
    if (typeof dimensions === 'number' && Number.isInteger(dimensions) && dimensions > 0) {
      return dimensions;
    }

    const manifest = getManifest(model);
    if (manifest) {
      return manifest.dim;
    }

    const profile = getStartupEmbeddingProfile();
    if (profile.provider === provider && profile.model === model) {
      return profile.dim;  // <-- line 92
    }

    return profile.dim;    // <-- line 95: same value
  }
  ```
  The function constructs a 4-level resolution ladder: (1) explicit `dimensions` parameter, (2) manifest lookup, (3) profile match check, (4) profile fallback. But levels 3 and 4 both return `profile.dim`. The conditional on line 91 `if (profile.provider === provider && profile.model === model)` has no behavioral impact — both branches resolve to the identical value. The only thing the check achieves is making a reader pause to wonder: "is there supposed to be different behavior here?"
- **Reasoning:** This is over-engineering via gratuitous conditional complexity. The code signals to readers that profile matching matters for dimension resolution, when in practice it always falls through to the same value regardless of match. The branch was likely left behind when a previous implementation had different behavior (e.g., throwing an error or using a hardcoded default when the profile didn't match). Maintaining this dead branch adds cognitive load and creates a false impression of validation. If the intent is to assert that the profile matches, an explicit assertion or log warning would be clearer. If there's no intent, the branch should be removed and the function reduced to a 3-level ladder.
- **Suggested remediation:** Remove the dead conditional (lines 91-93). If profile-match validation is needed, replace with an explicit `console.warn` or throw. Otherwise, collapse to: `const profile = getStartupEmbeddingProfile(); return profile.dim;`.
- **Severity rationale:** P1 — A dead conditional branch in a core resolution function misleads maintainers about the function's contract. It implies dimension validation that doesn't exist. In a codebase where embedding dimension correctness is critical (wrong dims cause silent search degradation), misleading resolution logic is a maintenance hazard.

**Title: Elaborate shutdown hook machinery undermined by fire-and-forget void**
- **Fingerprint:** `over-engineering:execution-router:shutdown-hooks-fire-and-forget`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:106-123`
- **Evidence:**
  ```typescript
  let shutdownHooksRegistered = false;

  function registerShutdownHooks(): void {
    if (shutdownHooksRegistered) {
      return;
    }

    shutdownHooksRegistered = true;
    const shutdown = (): void => {
      void shutdownAllSidecars();  // <-- Promise discarded
    };
    process.once('beforeExit', shutdown);
    process.once('SIGINT', () => {
      shutdown();
      process.kill(process.pid, 'SIGINT');  // <-- immediate re-kill
    });
    process.once('SIGTERM', () => {
      shutdown();
      process.kill(process.pid, 'SIGTERM');  // <-- immediate re-kill
    });
  }
  ```
  The shutdown infrastructure spans 18 lines: a module-level boolean sentinel, 3 `process.once` signal handlers, a `shutdown` wrapper function, and self-re-kill logic. But the design is self-defeating: `shutdownAllSidecars()` returns a `Promise<void>`, and the `void` operator explicitly discards it. The SIGINT/SIGTERM handlers call `process.kill(process.pid, signal)` immediately after `shutdown()` — without awaiting the sidecar termination. Since `process.once` removes the handler after first invocation, the re-kill triggers default process exit behavior. The sidecars may not have terminated before the process exits. Even the `beforeExit` handler (which fires when the event loop empties) calls the same fire-and-forget `void shutdownAllSidecars()`.
- **Reasoning:** The shutdown system was designed for graceful cleanup — module-level guard, multiple signal hooks, child-process termination — but the implementation actively works against its own goal. The `void` + immediate `process.kill` pattern means the shutdown promise is never awaited, so sidecar processes may be orphaned. The machinery adds 18 lines of state and control flow for a feature that doesn't function as designed. This is over-engineering: the code invests in shutdown infrastructure complexity but doesn't deliver the graceful shutdown it advertises. The `beforeExit` handler is particularly misleading — it looks like cleanup-on-exit but is equally fire-and-forget.
- **Suggested remediation:** Either (a) remove the signal handlers and `beforeExit` hook entirely, letting the OS clean up child processes (they're already `detached: true` with `unref()`), or (b) make the SIGINT/SIGTERM handlers async: set an exit flag, await `shutdownAllSidecars()`, then call `process.exit()`. The current middle-ground (complex hooks that don't await) is the worst of both worlds.
- **Severity rationale:** P1 — Orphaned child processes (sidecar workers) on signal-triggered shutdown. In development environments this causes resource leaks (idle Python processes consuming RAM). In production, repeated restarts could accumulate zombie sidecars. The complexity-to-value ratio is inverted: more code, less reliability.

### P2 — Suggestions

**Title: getCancellationStatus is a column-subset duplicate of selectJob**
- **Fingerprint:** `over-engineering:reindex:getcancellationstatus-duplicates-selectjob`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:142-151, 191-194`
- **Evidence:**
  ```typescript
  // selectJob — full row fetch (line 142-151):
  function selectJob(db: Database.Database, jobId: string): ReindexJob | null {
    ensureJobTable(db);
    const row = db.prepare(`
      SELECT id, from_name, to_name, to_dim, total, processed, status, started_at, updated_at, error
      FROM embedder_jobs
      WHERE id = ?
    `).get(jobId) as JobRow | undefined;
    return row ? normalizeJob(row) : null;
  }

  // getCancellationStatus — status-only fetch (line 191-194):
  function getCancellationStatus(db: Database.Database, jobId: string): ReindexJobStatus | null {
    const row = db.prepare('SELECT status FROM embedder_jobs WHERE id = ?')
      .get(jobId) as { status?: ReindexJobStatus } | undefined;
    return row?.status ?? null;
  }
  ```
  Both functions query the same table (`embedder_jobs`) by primary key (`id`). `getCancellationStatus` exists as a lighter-weight alternative used inside `runJob`'s processing loop (called at lines 372 and 393) to check if the job was cancelled between batches. The intent is to avoid fetching all columns when only `status` is needed. However, for a single-row primary-key lookup with 9 columns, the performance difference is negligible (SQLite B-tree seek dominates; column count is irrelevant at this scale).
- **Reasoning:** Maintaining two query functions for the same row creates a synchronization burden: any schema change (add/rename/remove column) must update the `selectJob` SELECT list, the `JobRow` interface, AND `getCancellationStatus`'s result type. The micro-optimization doesn't justify the duplication. The `selectJob` function already returns a `ReindexJob` with a `status` field — `selectJob(db, jobId)?.status` would be equivalent. The 4-line helper exists to avoid calling `normalizeJob` for a status check, but `normalizeJob` is a trivial field-name mapping (O(1), 9 assignments). The abstraction adds indirection for a performance concern that doesn't materialize.
- **Suggested remediation:** Replace `getCancellationStatus(db, jobId)` calls with `selectJob(db, jobId)?.status`. Remove the `getCancellationStatus` function. If the `normalizeJob` overhead is genuinely concerning, add a `selectJobStatus(db, jobId)` that shares the same prepared statement base, but only if profiled.
- **Severity rationale:** P2 — Zero behavioral defect. The duplication is a maintenance hazard: two SELECT statements for the same row that must stay synchronized. The 4-line function is low-cost to fix.

**Title: BaseRequest interface defined but never used as standalone type**
- **Fingerprint:** `over-engineering:sidecar-worker:baserequest-unused-standalone`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:16-19`
- **Evidence:**
  ```typescript
  interface BaseRequest {
    readonly id: number;
    readonly type: string;
  }

  interface EmbedRequest extends BaseRequest {
    readonly type: 'embed';
    readonly input: string[];
    readonly model: string;
    readonly dimensions: number;
    readonly inputType?: WorkerInputType;
  }

  interface PingRequest extends BaseRequest {
    readonly type: 'ping';
  }

  interface ShutdownRequest extends BaseRequest {
    readonly type: 'shutdown';
  }

  type WorkerRequest = EmbedRequest | PingRequest | ShutdownRequest;
  ```
  `BaseRequest` is defined, extended 3 times, but never referenced directly. No type annotation uses `BaseRequest`. No type guard accepts or returns it. The `parseRequest` function validates `id` and `type` inline:
  ```typescript
  if (!parsed || typeof parsed !== 'object' || typeof parsed.id !== 'number' || typeof parsed.type !== 'string') {
    throw new Error('Invalid sidecar request envelope');
  }
  ```
  This inline check could have been a `BaseRequest` type guard, but isn't. The interface exists solely to deduplicate 2 properties (`id: number`, `type: string`) across 3 extensions — saving at most 4 lines of code (2 properties × 2 extensions that would otherwise repeat them).
- **Reasoning:** The abstraction-to-savings ratio is near 1:1 — 3 lines of interface definition to save ~4 lines of property repetition. A reader encountering `extends BaseRequest` must look up the base to understand the full shape, adding a hop. If the extensions were standalone interfaces, the full shape would be visible at the definition site. The `BaseRequest` abstraction would be justified if: (a) it was used as a type guard parameter in `parseRequest`, (b) it was exported for cross-file use, or (c) there were 5+ extensions. None of these conditions hold.
- **Suggested remediation:** Inline `id: number` and `type: string` into each of the 3 request interfaces. Remove `BaseRequest`. Net change: +2 lines of property repetition, -3 lines of interface definition. Alternatively, use `BaseRequest` in `parseRequest` as a proper type guard to earn the abstraction.
- **Severity rationale:** P2 — Trivial indirection; 3 lines of dead interface surface. No behavioral impact. Low-cost cleanup during the next simplification pass.

**Title: Triple redundant normalizeProvider calls in getEmbedderAdapter**
- **Fingerprint:** `over-engineering:execution-router:triple-normalizeprovider-calls`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:38-44, 69-78, 204-228`
- **Evidence:**
  ```typescript
  function normalizeProvider(provider: string): string {
    return provider.trim().toLowerCase();
  }

  function cacheKey(provider: string, model: string): string {
    return `${normalizeProvider(provider)}:${model}`;  // call #1
  }

  function shouldUseSidecar(provider: string): boolean {
    const policy = resolveExecutionPolicy();
    if (policy === 'direct') return false;
    if (policy === 'sidecar') return true;
    return SIDECAR_LOCAL_PROVIDERS.has(normalizeProvider(provider));  // call #2
  }

  export function getEmbedderAdapter(
    provider: string,
    model: string,
    dimensionsOverride?: number,
  ): EmbedderAdapter {
    const key = cacheKey(provider, model);     // triggers normalizeProvider #1
    const dimensions = resolveDimensions(provider, model, dimensionsOverride);

    if (shouldUseSidecar(provider)) {          // triggers normalizeProvider #2
      let client = sidecarClients.get(key);
      if (!client) {
        client = new SidecarClient({
          provider: normalizeProvider(provider),  // call #3
          model,
          dimensions,
          backend: toBackendKind(provider),
        });
        ...
      }
      return client;
    }

    let adapter = directAdapters.get(key);
    if (!adapter) {
      adapter = new DirectProviderAdapter(
        normalizeProvider(provider),  // call #3 (mutually exclusive with above)
        model,
        dimensions,
      );
      ...
    }
    return adapter;
  }
  ```
  Within a single call to `getEmbedderAdapter`, `normalizeProvider(provider)` is executed 3 times for the same input: once inside `cacheKey` (used only for string interpolation in the cache key), once inside `shouldUseSidecar` (used for a `Set.has()` lookup), and once when constructing the adapter (passed as the `provider` argument). Each helper function is designed to be self-contained — accepting a raw string and normalizing internally — but at the composition site this creates redundant work. The normalized value from `cacheKey` is computed and discarded (only the interpolated key string is kept). The normalized value from `shouldUseSidecar` is computed and discarded (only the boolean result is kept).
- **Reasoning:** Each function independently normalizing is the "clean module boundary" pattern, but when all 3 are called sequentially on the same input in the same function, the abstraction cost is 3× the work. The design assumes callers pass raw, un-normalized provider strings, but `getEmbedderAdapter` is the sole production caller of all 3 functions together. A single `const normalized = normalizeProvider(provider)` at the top of `getEmbedderAdapter` would eliminate 2 of 3 calls, and the helper functions could accept (or be refactored to accept) pre-normalized input. The current design is prematurely self-contained: each function defends against un-normalized input that, at the only call site, is already being normalized elsewhere.
- **Suggested remediation:** Normalize once at the top of `getEmbedderAdapter`: `const normalized = normalizeProvider(provider)`. Pass `normalized` to `cacheKey`, `shouldUseSidecar`, and the adapter constructors. Update `cacheKey` and `shouldUseSidecar` to accept pre-normalized input (or keep the normalization as a defensive no-op). Net reduction: 2 redundant `.trim().toLowerCase()` calls per adapter creation.
- **Severity rationale:** P2 — Performance impact is negligible (string trimming is O(n) but tiny). The finding is about design clarity: the redundant normalization pattern signals that each function is independent when in practice they're composed sequentially on the same value. During refactoring, a maintainer might change one `normalizeProvider` call without realizing two others are processing the same string.

## Convergence Signal
- New findings this iter: 5
- Cumulative finding count after iter: 56
- New-findings ratio: 0.089
- Continue / converged signal: `continue` (ratio ≤ 0.10, but this is the first over-engineering iteration with ratio ≤ 0.10; need 2 consecutive same-angle iterations ≤ 0.10 for convergence per strategy rules — iteration 4 had ratio 0.29)

## Files Touched (this iter)
- `iterations/iteration-010.md`
- `deltas/iter-010.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
