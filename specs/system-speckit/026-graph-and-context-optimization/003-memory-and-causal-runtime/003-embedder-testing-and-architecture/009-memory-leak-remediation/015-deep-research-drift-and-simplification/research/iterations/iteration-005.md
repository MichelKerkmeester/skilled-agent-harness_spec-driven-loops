# Iteration 005 — simplification (executor: cli-devin-swe-1.6)

## Metadata
- Iteration: 5 of 20
- Angle: simplification
- Executor: cli-devin-swe-1.6
- Timestamp: 2026-05-22T23:27:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
- Cumulative findings before this iter: 24

## Summary
Reviewed the full sidecar surface (1,845 LOC across 5 files) for simplification opportunities: duplicate code paths, single-call helpers, custom implementations replaceable with stdlib, nested control flow, and redundant defensive code. Found 5 novel findings — 2 P1 (sidecar-client 8 single-call helpers, sidecar-worker 4 single-call helpers) and 3 P2 (reindex normalizeJob/JobRow dual representation, ensure-rerank-sidecar deps injection pattern, sidecar-client responseHasId type guard). Zero overlap with prior drift, dead-code, security, or over-engineering iterations.

## New Findings

### P0 — Blockers
None

### P1 — Required

**Title: Sidecar-client 8 single-call helper functions with trivial implementations**
- **Fingerprint:** `simplification:sidecar-client:eight-single-call-helpers`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:86-195`
- **Evidence:**
  ```typescript
  // Lines 86-94: parsePositiveIntegerEnv - called only at line 229-233
  function parsePositiveIntegerEnv(name: string, fallback: number): number {
    const raw = process.env[name];
    if (raw === undefined || raw.trim().length === 0) {
      return fallback;
    }
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed >= MIN_TIMEOUT_MS ? parsed : fallback;
  }

  // Lines 96-104: defaultWorkerPath - called only at line 228
  function defaultWorkerPath(): string {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const compiled = join(currentDir, 'sidecar-worker.js');
    if (existsSync(compiled)) {
      return compiled;
    }
    return join(currentDir, 'sidecar-worker.ts');
  }

  // Lines 119-125: responseHasId - called only at line 499
  function responseHasId(value: unknown): value is { id: number } {
    return (
      typeof value === 'object'
      && value !== null
      && typeof (value as { id?: unknown }).id === 'number'
    );
  }

  // Lines 127-129: toErrorMessage - called at lines 145, 495, 517
  function toErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  // Lines 131-136: sleep - called only at line 400
  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const timer = setTimeout(resolve, ms);
      timer.unref?.();
    });
  }

  // Lines 138-152: signalChildProcessGroup - called only at line 393, 396
  function signalChildProcessGroup(child: ChildProcess, signal: NodeJS.Signals): void {
    if (child.pid && process.platform !== 'win32') {
      try {
        process.kill(-child.pid, signal);
        return;
      } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException).code !== 'ESRCH') {
          process.stderr.write(`[sidecar:${child.pid}] process-group ${signal} failed: ${toErrorMessage(error)}\n`);
        }
      }
    }
    if (!child.killed) {
      child.kill(signal);
    }
  }

  // Lines 154-173: waitForChildExit - called only at line 394, 397
  function waitForChildExit(child: ChildProcess, timeoutMs: number): Promise<boolean> {
    if (child.exitCode !== null || child.signalCode !== null) {
      return Promise.resolve(true);
    }
    return new Promise((resolve) => {
      let settled = false;
      const finish = (exited: boolean): void => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        child.off('exit', onExit);
        resolve(exited);
      };
      const onExit = (): void => finish(true);
      const timer = setTimeout(() => finish(false), timeoutMs);
      timer.unref?.();
      child.once('exit', onExit);
    });
  }

  // Lines 175-181: isAllowedEnvKey - called only at line 190
  function isAllowedEnvKey(key: string, explicitAllowlist: readonly string[] = []): boolean {
    return ALLOWED_ENV_KEYS.has(key)
      || key.startsWith('LC_')
      || key.startsWith('SPECKIT_EMBEDDER_')
      || key.startsWith('MOCK_SIDECAR_')
      || explicitAllowlist.includes(key);
  }
  ```
- **Reasoning:** Eight helper functions each have only one or two call sites within the same file. None are independently tested, and most are trivial (2-10 lines). The extraction adds indirection without reuse benefit. `parsePositiveIntegerEnv`, `defaultWorkerPath`, `responseHasId`, `isAllowedEnvKey` have exactly one call site. `toErrorMessage` has 3 call sites but is a one-liner. `sleep`, `signalChildProcessGroup`, `waitForChildExit` have 2 call sites but are only used within `terminateChild`. The result is ~110 lines of helper functions for logic that could be inlined into their call sites, reducing the file from 548 to ~438 lines (20% reduction) without losing functionality or test coverage.
- **Suggested remediation:** Inline `parsePositiveIntegerEnv`, `defaultWorkerPath`, `responseHasId`, `isAllowedEnvKey` into their single call sites. Inline `toErrorMessage` at its 3 call sites (it's a one-liner). Move `sleep`, `signalChildProcessGroup`, `waitForChildExit` into `terminateChild` as local functions since they're only used there. Keep `buildSidecarEnv` as-is since it's exported for tests (already flagged as dead-code P2 in iter 2).
- **Severity rationale:** P1 — 110 lines of single-use indirection makes the code harder to follow during debugging. Each extracted function implies a reusable abstraction that doesn't exist, misleading readers about the architecture. The simplification would reduce cognitive load and maintenance overhead without losing any functionality.

**Title: Sidecar-worker 4 single-call helper functions with trivial implementations**
- **Fingerprint:** `simplification:sidecar-worker:four-single-call-helpers`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:50-103`
- **Evidence:**
  ```typescript
  // Lines 50-52: getProviderName - called only at line 141
  function getProviderName(): string {
    return process.env.SPECKIT_EMBEDDER_SIDECAR_PROVIDER || 'hf-local';
  }

  // Lines 54-59: getModelName - called only at line 142 (dead fallbacks flagged in iter 2)
  function getModelName(requestModel: string): string {
    return requestModel
      || process.env.SPECKIT_EMBEDDER_SIDECAR_MODEL
      || process.env.HF_EMBEDDINGS_MODEL
      || 'BAAI/bge-base-en-v1.5';
  }

  // Lines 61-68: getDimensions - called only at line 143 (dead fallbacks flagged in iter 2)
  function getDimensions(requestDimensions: number): number {
    if (Number.isInteger(requestDimensions) && requestDimensions > 0) {
      return requestDimensions;
    }
    const envDimensions = Number.parseInt(process.env.SPECKIT_EMBEDDER_SIDECAR_DIMENSIONS || '', 10);
    return Number.isInteger(envDimensions) && envDimensions > 0 ? envDimensions : 768;
  }

  // Lines 101-103: isStringArray - called only at line 120
  function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === 'string');
  }
  ```
- **Reasoning:** Four helper functions each have exactly one call site within the same file. `getProviderName`, `getModelName`, `getDimensions` are only called from `getProvider` (line 141-143). `isStringArray` is only called from `parseRequest` (line 120). None are independently tested. The extraction adds indirection without reuse. Combined with the dead fallbacks already flagged in iteration 2, these functions create a false impression of modularity. The worker module is only 229 lines; these 4 functions occupy ~25 lines (11% overhead) for single-use logic.
- **Suggested remediation:** Inline `getProviderName`, `getModelName`, `getDimensions` directly into `getProvider` (line 141-143). Inline `isStringArray` directly into `parseRequest` (line 120). Keep `parentProcessAlive` (nontrivial logic) and `startParentDeathPolling` (encapsulates lifecycle concern). Keep `toErrorMessage` (used at error boundary, reasonable extraction). Target: ~20 line reduction.
- **Severity rationale:** P1 — Indirection without reuse makes the code harder to follow. The worker module is small enough that the extraction overhead is significant relative to total size. Removing these single-use helpers would improve readability without losing any functionality.

### P2 — Suggestions

**Title: Reindex normalizeJob/JobRow dual representation can be eliminated with SQL aliases**
- **Fingerprint:** `simplification:reindex:dual-job-row-representation-sql-aliases`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:32-65,123-136,142-164`
- **Evidence:**
  ```typescript
  // Lines 32-43: CamelCase public interface
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

  // Lines 54-65: snake_case DB row interface
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

  // Lines 123-136: Converter function
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

  // Lines 142-164: Usage in selectJob and selectActiveJob
  function selectJob(db: Database.Database, jobId: string): ReindexJob | null {
    ensureJobTable(db);
    const row = db.prepare(`
      SELECT id, from_name, to_name, to_dim, total, processed, status, started_at, updated_at, error
      FROM embedder_jobs
      WHERE id = ?
    `).get(jobId) as JobRow | undefined;
    return row ? normalizeJob(row) : null;
  }
  ```
- **Reasoning:** The dual representation (`ReindexJob` vs `JobRow`) and `normalizeJob` converter add ~35 lines for what is essentially a field-name mapping exercise. The same result can be achieved with SQL column aliases (`SELECT from_name AS fromName, to_name AS toName, ...`) to return camelCase directly from the database, eliminating the `JobRow` interface and `normalizeJob` function entirely. The `error: string | null` vs `error?: string` distinction can be handled by accepting `null` in the public interface or a lightweight post-processing step. This is a simplification opportunity that wasn't fully captured in the over-engineering finding (iter 4 flagged the dual representation but focused on drift risk, not the SQL alias simplification path).
- **Suggested remediation:** Use SQL column aliases in all queries to return camelCase directly: `SELECT id, from_name AS fromName, to_name AS toName, to_dim AS toDim, total, processed, status, started_at AS startedAt, updated_at AS updatedAt, error FROM embedder_jobs WHERE id = ?`. Remove `JobRow` interface and `normalizeJob` function. Change `ReindexJob.error` type to `string | null` to match the database directly.
- **Severity rationale:** P2 — Zero behavioral impact, but reduces ~35 lines of code and eliminates the maintenance burden of keeping two interfaces in sync. The SQL alias approach is standard practice and eliminates the need for a separate converter function.

**Title: Ensure-rerank-sidecar deps injection pattern adds complexity for testability**
- **Fingerprint:** `simplification:ensure-rerank-sidecar:deps-injection-complexity`
- **File(s):** `.opencode/bin/lib/ensure-rerank-sidecar.cjs:30-79,211-217`
- **Evidence:**
  ```javascript
  // Lines 30-58: healthPayload accepts deps parameter
  async function healthPayload(port, timeoutMs, deps = {}) {
    const httpModule = deps.http ?? http;
    return new Promise((resolve) => {
      const req = httpModule.get({ host: '127.0.0.1', port, path: '/health', timeout: timeoutMs }, (res) => {
        // ...
      });
    });
  }

  // Lines 60-70: isHealthy accepts deps parameter
  async function isHealthy(port, timeoutMs, deps = {}) {
    const payload = await healthPayload(port, timeoutMs, deps);
    if (!payload) return false;
    if (deps.expectedOwnerToken && payload.owner_token_sha256 !== ownerTokenDigest(deps.expectedOwnerToken)) {
      return false;
    }
    if (deps.expectedConfigHash && payload.canonical_config_hash !== deps.expectedConfigHash) {
      return false;
    }
    return true;
  }

  // Lines 72-79: waitForHealthy accepts deps parameter
  async function waitForHealthy(port, deadline, deps = {}) {
    const sleep = deps.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
    while (Date.now() < deadline) {
      if (await isHealthy(port, 2000, deps)) return true;
      await sleep(500);
    }
    return false;
  }

  // Lines 211-217: ensureRerankSidecar constructs deps object
  async function ensureRerankSidecar(options = {}) {
    const deps = options.deps ?? {};
    const fsModule = deps.fs ?? fs;
    const osModule = deps.os ?? os;
    const spawnFn = deps.spawn ?? spawn;
    const processObj = deps.process ?? process;
    const logger = deps.log ?? log;
    // ...
  }
  ```
- **Reasoning:** The deps injection pattern (`deps.http`, `deps.fs`, `deps.sleep`, etc.) is used throughout the module to enable testability. While this is a valid pattern, it adds complexity: every function must accept and thread through a `deps` parameter, and the default resolution (`deps.http ?? http`) is repeated at every call site. The pattern adds ~30 lines of parameter passing and default resolution logic. For a module with only one production entry point (`ensureRerankSidecar`), this complexity could be reduced by using a test-specific module mock (e.g., `proxyquire` or `vi.mock`) instead of manual dependency injection.
- **Suggested remediation:** Remove the deps injection pattern from internal functions (`healthPayload`, `isHealthy`, `waitForHealthy`, `loadOrCreateOwnerToken`, `readLedger`, `writeLedger`, `processLiveness`, `findReusableSidecar`). Have these functions use the native modules directly (`http`, `fs`, `os`, `process`). Use test-specific module mocking in the test file instead of manual injection. Keep the deps pattern only in `ensureRerankSidecar` if needed for integration testing, or remove entirely if tests can mock at the module level.
- **Severity rationale:** P2 — The deps pattern works correctly but adds complexity for testability. Modern test frameworks (Vitest, Jest) have built-in module mocking that makes manual dependency injection unnecessary for most cases. Removing the pattern would reduce ~30 lines of parameter passing logic.

**Title: Sidecar-client responseHasId type guard can be inlined into handleResponseLine**
- **Fingerprint:** `simplification:sidecar-client:responsehasid-type-guard-inline`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:119-125,490-506`
- **Evidence:**
  ```typescript
  // Lines 119-125: Type guard function
  function responseHasId(value: unknown): value is { id: number } {
    return (
      typeof value === 'object'
      && value !== null
      && typeof (value as { id?: unknown }).id === 'number'
    );
  }

  // Lines 490-506: Single call site
  private handleResponseLine(line: string): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch (error: unknown) {
      process.stderr.write(`[sidecar:${this.child?.pid ?? 'unknown'}] invalid json: ${toErrorMessage(error)}\n`);
      return;
    }

    if (!responseHasId(parsed)) {
      return;
    }

    const pending = this.pending.get(parsed.id);
    if (!pending) {
      return;
    }
    // ...
  }
  ```
- **Reasoning:** The `responseHasId` type guard is called only once in `handleResponseLine`. While type guards are useful for readability, this one is a simple 3-line check that could be inlined without losing clarity. The extraction adds indirection for a check that's only performed in one location. The type narrowing benefit is minimal since the code immediately uses `parsed.id` after the check.
- **Suggested remediation:** Inline the type guard check directly into `handleResponseLine`:
  ```typescript
  if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { id?: unknown }).id !== 'number') {
    return;
  }
  ```
  Remove the `responseHasId` function entirely.
- **Severity rationale:** P2 — The type guard is readable but adds unnecessary indirection for a single-use check. Inlining would reduce the file by ~7 lines and eliminate a function that has no other callers. The readability impact is minimal since the check is straightforward.

## Convergence Signal
- New findings this iter: 5
- Cumulative finding count after iter: 29
- New-findings ratio: 0.17
- Continue / converged signal: `continue` (ratio > 0.10; this is the first simplification pass)

## Files Touched (this iter)
- `iterations/iteration-005.md`
- `deltas/iter-005.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
