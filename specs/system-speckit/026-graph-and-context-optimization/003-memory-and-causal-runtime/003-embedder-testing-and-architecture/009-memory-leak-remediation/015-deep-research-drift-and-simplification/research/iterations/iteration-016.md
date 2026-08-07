# Iteration 016 — over-engineering (executor: cli-opencode-deepseek-v4-pro)

## Metadata
- Iteration: 16 of 20
- Angle: over-engineering
- Executor: cli-opencode-deepseek-v4-pro
- Timestamp: 2026-05-23T00:30:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts`
- Cumulative findings before this iter: 78

## Summary
Third pass on the over-engineering angle across the full sidecar surface (~1,845 LOC + supporting schema module). Iteration 4 covered 7 findings and iteration 10 covered 5. This iteration probes supporting files (schema.ts, reindex.ts helper internals) and re-examines sidecar-client lifecycle machinery not yet scrutinized for over-engineering. Found 6 novel findings — 1 P1 (terminateChild dual-promise lifecycle over-engineering) and 5 P2 (normalizeProviderForFactory single-call, yieldToEventLoop setImmediate wrapper, setJobStatus dynamic SQL, schema single-call helper chain, sleep() single-use wrapper). Zero overlap with prior over-engineering findings from iterations 4 or 10. New-findings ratio of 0.071 marks the second consecutive over-engineering iteration ≤ 0.10, triggering convergence for this angle.

## New Findings

### P0 — Blockers
None

### P1 — Required

**Title: terminateChild over-engineered dual-promise lifecycle with sleep(0) hack**
- **Fingerprint:** `over-engineering:sidecar-client:terminatechild-dual-promise-lifecycle`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:385-408`
- **Evidence:**
  ```typescript
  private async terminateChild(child: ChildProcess): Promise<void> {
    if (this.termination) {
      await this.termination;
      return;
    }

    this.shuttingDown = true;
    this.termination = (async () => {
      signalChildProcessGroup(child, 'SIGTERM');
      const exitedAfterTerm = await waitForChildExit(child, DEFAULT_TERMINATION_GRACE_MS);
      if (!exitedAfterTerm) {
        signalChildProcessGroup(child, 'SIGKILL');
        await waitForChildExit(child, DEFAULT_TERMINATION_GRACE_MS);
      }
      this.cleanupChild(child);
      await sleep(0);   // <-- event-loop yield hack
    })();
    try {
      await this.termination;
    } finally {
      this.termination = null;
      this.shuttingDown = false;
    }
  }
  ```
  The method manages two intertwined state flags (`this.termination` and `this.shuttingDown`) to coordinate a single async lifecycle. The IIFE-assigned `this.termination` promise is: (a) created and cached for concurrency dedup, (b) immediately awaited via `try/finally`, and (c) nulled out in the finally block. The `sleep(0)` call on line 400 is an event-loop microtask yield hack — it has no semantic meaning beyond "let other promises settle." The `this.shuttingDown` flag (line 220) is independently tracked but mirrors the same lifecycle window, checked in `ensureWorker()` at line 336 and the `exit` handler at line 365. The dual-state tracking, immediate re-await of a self-assigned promise, and event-loop hack are all telltale signs of organic accretion without consolidation.
- **Reasoning:** The lifecycle management solved a real problem (concurrent termination) but accumulated scaffolding beyond what the problem requires. The IIFE assignment + immediate await + finally-null pattern is effectively: "run this once and reset when done" — which `runOnce()` or a simpler boolean gate could express in 4 lines. The `sleep(0)` hack at line 400 suggests the `cleanupChild`/`rejectAllPending` chain wasn't settling synchronously and needed a turn of the event loop. Rather than fixing the root cause (synchronous cleanup), the fix was adding an artificial yield. The `shuttingDown` flag at line 336 (`if (this.shuttingDown) { return; }` in `ensureWorker`) partially overlaps with `this.termination` check at line 315 (`if (this.termination) { await this.termination; }`) — two checks for the same lifecycle from different entry points. Over time, this pattern has become the most complex 24-line method in sidecar-client, and each line carries the cognitive cost of the dual-state coordination.
- **Suggested remediation:** Replace the dual-state pattern with a single `#termination: Promise<void> | null` and a `#shuttingDown: boolean` that is set/cleared atomically within the termination promise. Remove `sleep(0)` by ensuring `rejectAllPending` resolves synchronously (it already does — the pending map is cleared immediately). The concurrency guard at line 386-389 (await existing termination) can stay, but the try/finally wrapper can be eliminated by having the IIFE set `termination = null` and `shuttingDown = false` itself. Target: ~10 line reduction with one less state variable.
- **Severity rationale:** P1 — The dual-state lifecycle is a maintenance hazard: a future maintainer adding a third termination pathway must reconcile `this.termination`, `this.shuttingDown`, and the `child.exitCode`/`child.killed` state. The `sleep(0)` hack is an uncommented workaround whose purpose is opaque. While the code functions correctly today, the complexity-to-problem ratio is inverted — a simple "terminate and clean up" operation spans 24 lines, 2 state flags, and an event-loop hack.

### P2 — Suggestions

**Title: normalizeProviderForFactory 3-line single-call helper**
- **Fingerprint:** `over-engineering:execution-router:normalizeproviderforfactory-single-call`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:98-104`
- **Evidence:**
  ```typescript
  function normalizeProviderForFactory(provider: string): string {
    const normalized = normalizeProvider(provider);
    if (normalized === 'api') {
      return 'openai';
    }
    return normalized;
  }
  ```
  Called exactly once, from `DirectProviderAdapter.getProvider()` at line 190:
  ```typescript
  private getProvider(): Promise<IEmbeddingProvider> {
    if (!this.providerPromise) {
      this.providerPromise = createEmbeddingsProvider({
        provider: normalizeProviderForFactory(this.provider),
        ...
      });
    }
    return this.providerPromise;
  }
  ```
  The function maps one string (`api` → `openai`) and otherwise returns the input unchanged. It calls `normalizeProvider()` internally, adding yet another `normalizeProvider` invocation to the already-triple-normalization chain flagged in iteration 10 (finding `over-engineering:execution-router:triple-normalizeprovider-calls`). The mapping could be a ternary inline: `normalizeProvider(provider) === 'api' ? 'openai' : normalized`.
- **Reasoning:** A named function for a single trivial string mapping creates a cognitive hop — the reader must navigate from `getProvider()` to `normalizeProviderForFactory()` and back to understand that `api` becomes `openai`. The extraction would be justified if it were called from multiple places or encapsulated non-trivial logic, but it's a 1:1 string mapping called from exactly one site. This is the anti-pattern of extracting functions for "clarity" when the extraction obscures more than it clarifies.
- **Suggested remediation:** Inline the api→openai mapping into `DirectProviderAdapter.getProvider()`. Alternatively, fold it into the existing `normalizeProvider` function if the mapping is a general contract (i.e., `api` should always normalize to `openai`).
- **Severity rationale:** P2 — Trivial indirection, 4 lines. No behavioral impact. Low-cost cleanup, but combined with the triple-normalizeProvider finding from iteration 10, this represents a fourth redundant normalization invocation in the same call chain.

**Title: yieldToEventLoop wraps setImmediate in a promise called once**
- **Fingerprint:** `over-engineering:reindex:yieldtoeventloop-single-call-setimmediate`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:117-121,390`
- **Evidence:**
  ```typescript
  function yieldToEventLoop(): Promise<void> {
    return new Promise((resolve) => {
      setImmediate(resolve);
    });
  }
  ```
  Called exactly once in the reindex processing loop at line 390:
  ```typescript
  while (processed < initialJob.total) {
    // ... embed + write vectors ...
    processed += rows.length;
    setJobStatus(db, jobId, 'running', processed);
    await yieldToEventLoop();
  }
  ```
  The function wraps the Node.js built-in `setImmediate` in a promise. `setImmediate` already schedules a callback on the next iteration of the event loop. The inline equivalent `await new Promise(r => setImmediate(r))` is a standard one-liner. The named function adds no error handling, no timeout, no configuration — it's a pure passthrough wrapper.
- **Reasoning:** This is a "naming an idiom" extraction — the author gave a name to the promise-wrapping-setImmediate pattern. But the pattern is so standard in Node.js that the name adds more indirection than clarity. A reader encountering `await yieldToEventLoop()` must look up the definition to confirm it's just `setImmediate`. The extraction would be justified if the function had configurable behavior (e.g., `yieldToEventLoop({ priority: 'high' })`) or was called from 3+ sites. With one caller and zero configuration, it's a 4-line wrapper around a 1-line idiom.
- **Suggested remediation:** Inline `await new Promise(r => setImmediate(r))` at line 390. Remove `yieldToEventLoop()`. 4-line reduction, zero behavioral change.
- **Severity rationale:** P2 — Trivial indirection. No correctness or performance impact. The extracted function has a good name that describes intent, but the abstraction isn't earned by reuse or complexity encapsulation.

**Title: setJobStatus constructs SQL dynamically with string interpolation**
- **Fingerprint:** `over-engineering:reindex:setjobstatus-dynamic-sql-construction`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:166-189`
- **Evidence:**
  ```typescript
  function setJobStatus(db, jobId, status, processed?, error?): void {
    const processedSql = typeof processed === 'number' ? ', processed = @processed' : '';
    const errorSql = typeof error === 'string' ? ', error = @error' : '';
    db.prepare(`
      UPDATE embedder_jobs
      SET status = @status,
          updated_at = @updatedAt
          ${processedSql}
          ${errorSql}
      WHERE id = @jobId
    `).run({
      jobId, status, updatedAt: nowIso(), processed, error,
    });
  }
  ```
  The function dynamically assembles SQL by string-interpolating optional column fragments (`${processedSql}`, `${errorSql}`) based on whether `processed` or `error` arguments are provided. The `.run()` call always passes all 5 parameters (`jobId, status, updatedAt, processed, error`) regardless of which columns appear in the SQL. When `processed` is `undefined`, the parameter `@processed` doesn't appear in the SQL but is included in the bind object — better-sqlite3 silently ignores extra bound parameters. This is a "clever" pattern that trades a single flexible prepared statement against two simpler, static ones.
- **Reasoning:** The dynamic SQL construction is premature flexibility. The function has only 4 call sites (all within reindex.ts: lines 351, 369, 389, 477), and each always passes either both optional params or neither. Two fixed prepared statements — `setJobStatusSimple(db, jobId, status)` and `setJobStatusWithProgress(db, jobId, status, processed)` — would be clearer, type-safe, and eliminate the string-interpolated SQL fragments. The current design assumes callers might pass `processed` without `error` or vice versa in the future, but no such call site exists. The flexibility is unused and the dynamic SQL is a code-quality concern (string interpolation in SQL, even for column names, is fragile).
- **Suggested remediation:** Replace with two static prepared statements: one for status-only updates (`SET status, updated_at`) and one with progress fields (`SET status, updated_at, processed, error`). Callers pick the appropriate function. Alternatively, use a single static statement that always sets `processed` and `error` (passing current values for no-change updates), trading one extra write for simplicity. The SQL string interpolation is the primary concern; removing it eliminates a potential injection vector and clarifies the update contract.
- **Severity rationale:** P2 — No observable defect (better-sqlite3 silently ignores extra bind parameters), but dynamic SQL construction is a fragility magnet. A future rename or restructuring of the `embedder_jobs` table could break the string-interpolated fragments silently. The pattern also violates the principle of least surprise: a reader must trace which call sites trigger which SQL fragments.

**Title: Schema module chain of 4 single-call helpers**
- **Fingerprint:** `over-engineering:schema:single-call-helper-chain`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:49-53,70-83,85-95,111-114,116-121`
- **Evidence:**
  ```typescript
  function validateDim(dim: number): void {                          // 2 callers
    if (!Number.isInteger(dim) || dim <= 0) throw new RangeError(...);
  }

  function readActivePointerRows(db: Database): Map<string, string> { // 1 caller
    ensureVecMetadataTable(db);
    return new Map(rows.map(row => [row.key, row.value]));
  }

  function normalizeProvider(value?: string): AutoSelectedEmbedderProvider | undefined { // 1 caller
    if (value === 'voyage' || value === 'openai' || value === 'ollama' || value === 'hf-local')
      return value;
    return undefined;
  }

  function getDatabaseName(db: Database): string {                   // 1 caller
    const candidate = (db as any).name;
    return typeof candidate === 'string' && candidate.length > 0 ? candidate : ':memory:';
  }

  function resolveAutoSelectLockPath(db: Database): string {         // 1 caller
    const dbName = getDatabaseName(db);
    const digest = createHash('sha256').update(dbName).digest('hex').slice(0, 16);
    const lockDir = dbName === ':memory:' ? os.tmpdir() : path.dirname(dbName);
    return path.join(lockDir, `.active-embedder-auto-select-${digest}.lock`);
  }
  ```
  The schema module (226 LOC) contains a chain of helpers where each is called from exactly one or two sites:
  - `validateDim` — 2 callers (lines 57, 183), but used as a guard at every entry point rather than as reusable abstraction
  - `readActivePointerRows` — 1 caller (`readActiveEmbedderIfValid`, line 98)
  - `normalizeProvider` — 1 caller (`readActiveEmbedderIfValid`, line 107)
  - `getDatabaseName` — 1 caller (`resolveAutoSelectLockPath`, line 117)
  - `resolveAutoSelectLockPath` — 1 caller (`ensureActiveEmbedder`, line 152)
  
  The chain is linear: `ensureActiveEmbedder` → `resolveAutoSelectLockPath` → `getDatabaseName`. `readActiveEmbedderIfValid` → `readActivePointerRows` + `normalizeProvider`. Each link is a function called from exactly one place. Together they account for ~30 lines of single-use indirection.
- **Reasoning:** The schema module is the "cleanest" module in the sidecar surface — good naming, small functions, clear purpose. But the extraction is bottom-up decomposition for its own sake rather than for reuse. `normalizeProvider` is a 4-way string comparison called once — it's a guard that could be a simple inline conditional. `getDatabaseName` accesses a single property with a type check — 3 lines that could sit inside `resolveAutoSelectLockPath`. The `readActivePointerRows` + `normalizeProvider` pair serves `readActiveEmbedderIfValid` exclusively — they're implementation details of a single logical operation artificially split into sub-operations. This is the least egregious form of over-engineering (the extractions are clean and well-named), but the 1:1 call-site ratio means the module is ~13% indirection overhead for no reuse benefit.
- **Suggested remediation:** Inline `normalizeProvider` into `readActiveEmbedderIfValid` (the 4-way comparison reads clearer at the use site). Inline `getDatabaseName` into `resolveAutoSelectLockPath`. Keep `validateDim` (2 callers, safety-critical guard) and `resolveAutoSelectLockPath` (non-trivial path construction logic). `readActivePointerRows` is borderline — it encapsulates a SQL query pattern; consider whether the pattern merits extraction or if the SQL reads more clearly inline.
- **Severity rationale:** P2 — The helpers are well-written and correctly scoped. The over-engineering is mild: well-intentioned decomposition that overshot. No correctness impact. The remediation is cosmetic cleanup for density and readability rather than a bug fix.

**Title: sleep() single-call Promise-wrapping-setTimeout helper**
- **Fingerprint:** `over-engineering:sidecar-client:sleep-single-call-settimeout-wrapper`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:131-136,400`
- **Evidence:**
  ```typescript
  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const timer = setTimeout(resolve, ms);
      timer.unref?.();
    });
  }
  ```
  Called exactly once, from `terminateChild` at line 400:
  ```typescript
  this.cleanupChild(child);
  await sleep(0);    // <-- only call site
  ```
  The function wraps `setTimeout` in a promise and calls `unref()` to prevent the timer from keeping the event loop alive. With `ms = 0`, the timer fires on the next event loop tick — equivalent to `await new Promise(r => setImmediate(r))` but using `setTimeout` instead. The `unref()` call is pointless when `ms = 0` (the timer fires immediately and doesn't block exit). The function's general-purpose signature (accepting arbitrary milliseconds) implies it's a reusable utility, but the only caller always passes `0`.
- **Reasoning:** This is a single-use utility masquerading as a general-purpose helper. The `sleep(0)` at line 400 is already an event-loop hack (see P1 finding above). Extracting it into a named function with a general signature creates the false impression that `sleep()` is used elsewhere in the module with non-zero durations. Inlining `await new Promise(r => setTimeout(r, 0))` at the call site would make the hack's purpose (yield to let cleanup promises settle) more visible and eliminate a 5-line abstraction. Alternatively, if the event-loop yield is a genuine pattern, `setImmediate` wrapped in a promise would be the standard approach rather than `setTimeout(0)`.
- **Suggested remediation:** Inline the yield at line 400: `await new Promise(r => setImmediate(r))`. Remove the `sleep()` function. The `unref()` call is redundant for `ms=0`. If a general-purpose sleep utility is desired, move it to a shared utility module where it can serve 3+ callers.
- **Severity rationale:** P2 — Trivial indirection, 5 lines. The `sleep(0)` hack is already flagged as part of the P1 lifecycle finding. The standalone `sleep()` function is the abstraction layer around the hack; removing it collapses two over-engineering patterns at once.

## Convergence Signal
- New findings this iter: 6
- Cumulative finding count after iter: 84
- New-findings ratio: 0.071
- Continue / converged signal: `converged` — this is the second consecutive over-engineering iteration with ratio ≤ 0.10 (iteration 10: 0.089, iteration 16: 0.071). Per convergence rules, 2 consecutive same-angle iterations ≤ 0.10 triggers convergence. The over-engineering angle is saturated.

## Files Touched (this iter)
- `iterations/iteration-016.md`
- `deltas/iter-016.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
