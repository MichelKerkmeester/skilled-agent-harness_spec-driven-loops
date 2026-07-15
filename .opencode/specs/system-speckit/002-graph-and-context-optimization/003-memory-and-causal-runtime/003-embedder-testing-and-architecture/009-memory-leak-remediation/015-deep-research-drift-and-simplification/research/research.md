---
title: "Research Report — System-Spec-Kit MCP Sidecar Investigation"
description: "20-iteration deep-research of system-spec-kit MCP server sidecar code across 6 angles (drift, dead code, security, over-engineering, simplification, refinement). Executors: cli-devin SWE-1.6 (10 iters) + cli-opencode DeepSeek-v4-pro variant=high (10 iters). Converged at iter ~9 (ratio crossed 0.10), continued to 20 for breadth + adversarial coverage."
trigger_phrases:
  - "sidecar investigation report"
  - "system-spec-kit mcp sidecar audit"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/015-deep-research-drift-and-simplification"
    last_updated_at: "2026-05-22T22:59:37.507Z"
    last_updated_by: "codex-synthesis"
    recent_action: "completed-arc-010-sidecar-investigation-20-iter-synthesis"
    next_safe_action: "plan-targeted-remediation-packets-from-p0-p1-findings"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-report-core | v1.0 -->
# Research Report — System-Spec-Kit MCP Sidecar Investigation

<!-- ANCHOR:executive-summary -->
## 1. Executive Summary

The investigation covered the system-spec-kit MCP sidecar surface, roughly 1,845 LOC across `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/`, `.opencode/bin/lib/ensure-rerank-sidecar.cjs`, and cross-skill rerank sidecar consumers. It ran 20 iterations across 6 angles with 10 cli-devin SWE-1.6 passes and 10 cli-opencode DeepSeek-v4-pro high passes, yielding 110 deduped findings: 3 P0, 39 P1, and 68 P2. The top themes were unbounded resource consumption across IPC/local HTTP boundaries, JS/Python rerank sidecar drift at the file-safety boundary, and an API/lifecycle surface that is wider than the current production caller reality.
<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:methodology -->
## 2. Methodology

- 20-iteration loop with dimension rotation across drift, dead-code, security, over-engineering, simplification, and refinement.
- Per-angle iteration counts: drift 4, dead-code 4, security 3, over-engineering 3, simplification 3, refinement 3.
- Mixed-executor strategy: 10 cli-devin SWE-1.6 iterations for cheap scan throughput, plus 10 cli-opencode DeepSeek-v4-pro high iterations for higher-reasoning depth.
- Tool budget per iteration: 12; max minutes per iteration: 25; max duration: 600 minutes.
- Findings were deduplicated by stable fingerprint using the registry field `fingerprint`.
- Convergence: the first state-log converged signal appeared at iteration 13; new-information ratio first crossed the 0.10 threshold at iteration 9 (0.098). The loop continued through iteration 20 for breadth and adversarial coverage.
<!-- /ANCHOR:methodology -->

<!-- ANCHOR:findings-by-angle -->
## 3. Findings by Angle

### drift

Total: 16 findings (P0 0, P1 9, P2 7).

Top findings:

- P1 F1: Config hash default revision drift between JS and Python implementations — .opencode/bin/lib/ensure-rerank-sidecar.cjs:136. Align the empty string handling logic between both implementations to treat empty string as "use default" consistently.
- P1 F3: Environment variable naming drift between documentation and implementation — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:229-233. Add a comment block documenting the SPECKIT_ environment variable naming convention and list all recognized SPECKIT_ prefixes in one location for maintainability.
- P1 F101: Health payload body size limit drift between JS and Python implementations — .opencode/bin/lib/ensure-rerank-sidecar.cjs:36-49. Either (a) remove the 8192 byte limit from the Python implementation to match the JavaScript behavior, or (b) add a matching size limit to the JavaScript implementation and document the maximum expected response size. Given that health check responses are typically small, removing the limit from Python is the safer choice to prevent future truncation issues.
- P1 F2: Inconsistent backend kind resolution logic between sidecar-client and execution-router — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:106-117. Move the canonical `toBackendKind` implementation to `@spec-kit/shared/embeddings/types.js` and have both files import it, removing the duplicate implementations.
- P1 F69: Missing file locking in JS ledger write vs Python atomic locking — .opencode/bin/lib/ensure-rerank-sidecar.cjs:164-170. Add file locking to the JavaScript ledger write implementation. Either (a) implement a fcntl-style lock file using `fs.openSync` with exclusive flag, or (b) use a library like `proper-lockfile` to provide cross-platform file locking. Match the Python implementation's lock file pattern (`{LEDGER_FILE_NAME}.lock`) and ensure all ledger read/write operations acquire the lock.

Themes: drift findings concentrate in sidecar-client.ts (8), ensure-rerank-sidecar.cjs (7), sidecar-worker.ts (1). Highest-priority registry items: F1, F2, F3, F37, F38, F69, F70, F101.

### dead-code

Total: 25 findings (P0 0, P1 5, P2 20).

Top findings:

- P1 F105: Dead cancellation-polling branches in reindex runJob loop — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:372,393. Remove both `getCancellationStatus(db, jobId) === 'cancelled'` checks and the `getCancellationStatus` helper. Since `cancelJob` will eventually be wired to an MCP tool (see finding 41 remediation), the checks can be re-added at that time. Until then, they are misleading dead code that incurs per-batch DB overhead.
- P1 F74: DirectProviderAdapter.ready() has zero production callers — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:175-185. Same options as SidecarClient.ready(): wire into production or gate behind test conditionals. Since `embedder-list.ts` already calls `.ready()` on registry adapters, the cleanest fix is to remove the `ready()` method from the `EmbedderAdapter` interface for classes that are only used through `getEmbedderAdapter()`, or conversely wire `embedder_list` to also report readiness for sidecar-managed providers.
- P1 F73: SidecarClient.ready() has zero production callers — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:272-279. Either wire `.ready()` into a production code path (e.g., `embedder-list` handler should also probe local-sidecar providers) or document that `ready()` on SidecarClient is test-only and gate it behind an environment-aware conditional if it must stay.
- P1 F6: Test-only production export __embedderExecutionRouterTestables — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:247-254. Move test-only state isolation into the test file via a module-level reset pattern (e.g., `vi.resetModules()` or a `createFreshRouter()` factory), or gate the export behind `process.env.NODE_ENV === 'test'`.
- P1 F5: Unreachable model-name fallback chain in sidecar-worker getModelName — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:54-59. Remove the `HF_EMBEDDINGS_MODEL` and hardcoded default fallbacks. Keep only `requestModel || SPECKIT_EMBEDDER_SIDECAR_MODEL`. If the intent is defense-in-depth, add a comment explaining that the parent always provides these values.

Themes: dead-code findings concentrate in schema.ts / registry.ts / index.ts / types.ts (8), reindex.ts (5), sidecar-worker.ts (4). Highest-priority registry items: F5, F6, F73, F74, F105.

### security

Total: 17 findings (P0 3, P1 8, P2 6).

Top findings:

- P0 F13: Predictable temp file names in ensure-rerank-sidecar ledger writes — .opencode/bin/lib/ensure-rerank-sidecar.cjs:167-169. Use `fs.mkstemp` or generate a cryptographically random suffix (e.g., `crypto.randomBytes(16).toString('hex')`) for the temp file name instead of the predictable `process.pid + Date.now()` pattern.
- P0 F12: Unbounded JSON parsing in sidecar-client stdout handler — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:476-497. Add a maximum line length limit (e.g., 1MB) to `handleStdout`. If a line exceeds the limit, reject it and terminate the child process. Also add a maximum buffer size limit to prevent unbounded memory growth.
- P0 F47: Unbounded JSON parsing in sidecar-worker stdin handler — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:105-132. Add a maximum line length limit (e.g., 1MB) before calling `JSON.parse`. If a line exceeds the limit, reject it and exit the worker process. Also add validation for the `input` array length to prevent unbounded array allocation.
- P1 F49: Environment variable leakage to child processes — .opencode/bin/lib/ensure-rerank-sidecar.cjs:252-257. Implement an allowlist pattern similar to sidecar-client's `isAllowedEnvKey` function. Only pass environment variables that the sidecar explicitly needs (e.g., PATH, HOME, TMPDIR, and RERANK_* variables).
- P1 F85: healthPayload in ensure-rerank-sidecar.cjs accumulates HTTP body unbounded — .opencode/bin/lib/ensure-rerank-sidecar.cjs:36-49. Add a maximum body size limit (e.g., 64KB) to the response accumulation. If `body.length` exceeds the limit, `req.destroy()` and resolve null. Match the Python implementation's 8192-byte read cap.

Themes: security findings concentrate in ensure-rerank-sidecar.cjs (7), sidecar-client.ts (4), sidecar-worker.ts (4). Highest-priority registry items: F12, F13, F14, F15, F47, F48, F49, F85.

### over-engineering

Total: 18 findings (P0 0, P1 6, P2 12).

Top findings:

- P1 F20: Duplicate single-property EmbedOptions interfaces across two files — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:41-43. If `@spec-kit/shared/embeddings/adapter.js` exports an `EmbedOptions` type, import and use it in both files, removing both local interfaces and their type aliases. If the upstream type doesn't exist, define a single `EmbedOptions` in `adapter.ts` (the local re-export shim) and import it. If the `inputType` parameter is genuinely optional at every call site, consider removing the options object entirely and using a second optional parameter.
- P1 F53: Elaborate shutdown hook machinery undermined by fire-and-forget void — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:106-123. Either (a) remove the signal handlers and `beforeExit` hook entirely, letting the OS clean up child processes (they're already `detached: true` with `unref()`), or (b) make the SIGINT/SIGTERM handlers async: set an exit flag, await `shutdownAllSidecars()`, then call `process.exit()`. The current middle-ground (complex hooks that don't await) is the worst of both worlds.
- P1 F52: resolveDimensions 4-level fallback ladder with dead 3rd level — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:80-96. Remove the dead conditional (lines 91-93). If profile-match validation is needed, replace with an explicit `console.warn` or throw. Otherwise, collapse to: `const profile = getStartupEmbeddingProfile(); return profile.dim;`.
- P1 F19: Sidecar-worker single-caller helper function indirection chain — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:50-149. Inline `getProviderName`, `getModelName`, `getDimensions`, and `isStringArray` into their single call sites. Keep `parentProcessAlive` (nontrivial logic), `startParentDeathPolling` (encapsulates lifecycle concern), and `toErrorMessage` (used at error boundary, reasonable extraction). Collapse `getProvider` into `handleEmbed` since it's only called from there. Target: ~30 line reduction.
- P1 F18: SidecarClient constructor accepts 7 optional fields serving only test consumers — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:20-31. Collapse `SidecarClientOptions` to the 3 required fields plus `backend`. Extend it internally or behind a test-only factory (`createSidecarClientForTest(opts)`) for test injection. If env var overrides are genuinely needed in production, keep only those and remove the constructor-level overrides.

Themes: over-engineering findings concentrate in execution-router.ts (5), sidecar-client.ts (4), reindex.ts (4). Highest-priority registry items: F18, F19, F20, F52, F53, F79.

### simplification

Total: 12 findings (P0 0, P1 5, P2 7).

Top findings:

- P1 F58: Execution-router registerShutdownHooks repetitive signal handling — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:106-124. Extract the signal handler pattern into a helper: function registerShutdownHooks(): void { if (shutdownHooksRegistered) { return; } shutdownHooksRegistered = true; const shutdown = (): void => { void shutdownAllSidecars(); }; process.once('beforeExit', shutdown); const registerSignal = (signal: NodeJS.Signals): void => { process.once(signal, () => { shutdown(); process.kill(process.pid, signal); }); }; registerSignal('SIGINT'); registerSignal('SIGTERM'); } This reduces the function from 19 lines to ~16 lines and eliminates the duplicate signal handling logic. If more signals need to be added (e.g., SIGHUP), they can be added with a single line.
- P1 F25: Sidecar-client 8 single-call helper functions with trivial implementations — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:86-195. Inline `parsePositiveIntegerEnv`, `defaultWorkerPath`, `responseHasId`, `isAllowedEnvKey` into their single call sites. Inline `toErrorMessage` at its 3 call sites (it's a one-liner). Move `sleep`, `signalChildProcessGroup`, `waitForChildExit` into `terminateChild` as local functions since they're only used there. Keep `buildSidecarEnv` as-is since it's exported for tests (already flagged as dead-code P2 in iter 2).
- P1 F91: Sidecar-client embed() nested validation cascade can be consolidated — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:238-270. Extract the validation logic into a helper function and consolidate the checks: function validateEmbeddingResponse(response: SidecarEmbeddingResponse, expectedDim: number, inputCount: number): void { if (response.dimensions !== expectedDim) { throw new Error(`Sidecar embedding dimension mismatch: expected ${expectedDim}, got ${response.dimensions}`); } if (response.vectors.length !== inputCount) { throw new Error(`Sidecar returned ${response.vectors.length} embeddings for ${inputCount} inputs`); } for (const vector of response.vectors) { if (vector.length !== expectedDim) { throw new Error(`Sidecar vector dimension mismatch: expected ${expectedDim}, got ${vector.length}`); } } } async embed(texts: ReadonlyArray<string>, options: SidecarEmbedOptions = {}): Promise<Float32Array[]> { if (texts.length === 0) { return []; } await this.ensureHealthyWorker(); this.lastRequestAt = Date.now(); this.requestCount += 1; this.scheduleIdleEviction(); const response = await this.sendRequest<SidecarEmbeddingResponse>({ type: 'embed', input: [...texts], model: this.name, dimensions: this.dim, inputType: options.inputType ?? 'document', }); validateEmbeddingResponse(response, this.dim, texts.length); return response.vectors.map((vector) => new Float32Array(vector)); } This reduces the method from 33 lines to ~25 lines and separates validation from transformation.
- P1 F57: Sidecar-client terminateChild duplicate signal/exit pattern — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:385-408. Extract the escalation pattern into a helper function: async function terminateWithEscalation(child: ChildProcess, signals: NodeJS.Signals[], timeoutMs: number): Promise<void> { for (const signal of signals) { signalChildProcessGroup(child, signal); const exited = await waitForChildExit(child, timeoutMs); if (exited) return; } } Then simplify `terminateChild` to: this.termination = (async () => { await terminateWithEscalation(child, ['SIGTERM', 'SIGKILL'], DEFAULT_TERMINATION_GRACE_MS); this.cleanupChild(child); await sleep(0); })(); This reduces the method from 24 lines to ~12 lines and eliminates the duplicate pattern.
- P1 F26: Sidecar-worker 4 single-call helper functions with trivial implementations — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:50-103. Inline `getProviderName`, `getModelName`, `getDimensions` directly into `getProvider` (line 141-143). Inline `isStringArray` directly into `parseRequest` (line 120). Keep `parentProcessAlive` (nontrivial logic) and `startParentDeathPolling` (encapsulates lifecycle concern). Keep `toErrorMessage` (used at error boundary, reasonable extraction). Target: ~20 line reduction.

Themes: simplification findings concentrate in sidecar-client.ts (4), reindex.ts (3), ensure-rerank-sidecar.cjs (3). Highest-priority registry items: F25, F26, F57, F58, F91.

### refinement

Total: 22 findings (P0 0, P1 6, P2 16).

Top findings:

- P1 F95: Cached rejected provider promise persists indefinitely in both adapter paths — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:138-149. In both locations, wrap the cached promise: on resolution, return the resolved provider; on rejection, null out the cache and re-throw so the next call retries. For DirectProviderAdapter, also consider adding a `clearCache()` or `reset()` method that evicts the adapter from `directAdapters` on persistent failure. Alternatively, add a jittered retry with exponential backoff at the `getProvider` level.
- P1 F62: handleResponseLine unsafe type assertion bypasses discriminator check — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:490-519. Queue targeted remediation for "handleResponseLine unsafe type assertion bypasses discriminator check" and preserve current behavior with focused tests.
- P1 F30: Inconsistent error-message detail across embedder module boundaries — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:161. Standardize error messages across modules to include `provider:model` (from env vars in worker, from instance fields in client/router). For sidecar-worker, use `process.env.SPECKIT_EMBEDDER_SIDECAR_PROVIDER` and `process.env.SPECKIT_EMBEDDER_SIDECAR_MODEL`. For reindex, include the adapter's name/dim from the `initialJob` context already available in `runJob`.
- P1 F61: resolveDimensions unconditional fallback returns potentially wrong dimensions — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:80-96. Queue targeted remediation for "resolveDimensions unconditional fallback returns potentially wrong dimensions" and preserve current behavior with focused tests.
- P1 F31: resolveExecutionPolicy mixes logging side effect into pure resolver function — .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:57-67. Queue targeted remediation for "resolveExecutionPolicy mixes logging side effect into pure resolver function" and preserve current behavior with focused tests.

Themes: refinement findings concentrate in sidecar-client.ts (8), execution-router.ts (4), reindex.ts (4). Highest-priority registry items: F30, F31, F61, F62, F94, F95.

<!-- /ANCHOR:findings-by-angle -->

<!-- ANCHOR:findings-by-surface -->
## 4. Findings by Surface

### `sidecar-client.ts`

Findings: 32 (P0 1, P1 16, P2 15). The client is the densest risk surface: request construction, stdout parsing, worker lifecycle, env forwarding, and response typing all meet here. Most serious items come from unbounded parsing/batch sizes and a broader API than production currently uses.

Representative findings: F12, F2, F3, F18, F20, F25, F37, F38.

### `sidecar-worker.ts`

Findings: 15 (P0 1, P1 7, P2 7). The worker mirrors several client risks on the stdin side and accumulates all vectors before emitting a response. It also owns parent-death polling, so liveness ambiguity turns into orphan-process and resource-exhaustion risk.

Representative findings: F47, F5, F14, F19, F26, F30, F87, F95.

### `ensure-rerank-sidecar.cjs`

Findings: 22 (P0 1, P1 8, P2 13). The launcher has the sharpest filesystem and local-service findings: token creation, ledger writes, process reuse, health probing, and env propagation. Its Python sibling often has stricter behavior, creating both security issues and drift.

Representative findings: F13, F1, F15, F49, F69, F85, F88, F101.

### `execution-router.ts`

Findings: 15 (P0 0, P1 7, P2 8). The router centralizes adapter selection, but it duplicates provider/backend normalization and caches adapters indefinitely. Findings cluster around lifecycle shutdown, stale credentials, dead readiness APIs, and test-only surfaces.

Representative findings: F6, F31, F52, F53, F58, F61, F74, F8.

### `reindex.ts`

Findings: 16 (P0 0, P1 1, P2 15). Reindex findings are less security-heavy and more about dead branches, dual row representations, cancellation paths, and duplicated write logic. The remediation question is whether cancellation is a real production contract.

Representative findings: F105, F24, F27, F35, F41, F42, F43, F54.

### `schema.ts / registry.ts / index.ts / types.ts`

Findings: 10 (P0 0, P1 0, P2 10). These modules mostly contribute stale public surface: unused barrel exports, repeated type definitions, stale comments, and small helper chains that obscure a simple contract.

Representative findings: F44, F45, F68, F77, F78, F83, F106, F107.

<!-- /ANCHOR:findings-by-surface -->

<!-- ANCHOR:top-themes -->
## 5. Top Themes

### Unbounded resource consumption across IPC and local HTTP boundaries

Angles: security / refinement. Representative findings: F12, F47, F85, F86, F87. Remediation: Add explicit byte, line, body, and batch-size limits at both client and worker boundaries before parsing or allocation.

### Sidecar lifecycle and process ownership semantics are under-specified

Angles: security / drift / over-engineering / refinement. Representative findings: F14, F53, F88, F94, F95. Remediation: Make liveness states explicit, fail closed on ambiguous ownership, and add tests for stale, dead, and malformed child responses.

### JS and Python rerank sidecar implementations drift at the file-safety boundary

Angles: drift / security. Representative findings: F1, F13, F69, F72, F101, F102, F103, F104. Remediation: Promote one canonical ledger/token contract and align temp files, locks, fsync, body caps, and config-hash normalization.

### API surface is over-built for one production caller

Angles: drift / dead-code / over-engineering / simplification. Representative findings: F18, F25, F37, F73, F79. Remediation: Collapse test-only constructor knobs and single-call helpers behind production needs, keeping test seams only where they prove behavior.

### Duplicate type and provider normalization logic invites future drift

Angles: drift / over-engineering / refinement / dead-code. Representative findings: F2, F20, F34, F38, F56, F70. Remediation: Move canonical backend/input-type helpers into shared embeddings and delete local copies after compatibility tests pass.

### Reindex path carries cancellation and representation complexity without production reach

Angles: dead-code / over-engineering / simplification / refinement. Representative findings: F24, F27, F41, F54, F60, F93, F105, F110. Remediation: Replace duplicate job row shapes with SQL aliases, decide whether cancellation is production-supported, then remove unreachable branches.

### Barrel exports and comments expose stale contracts

Angles: dead-code / drift / refinement. Representative findings: F42, F45, F68, F77, F78, F106, F107, F108, F109. Remediation: Prune unused exports or mark them intentionally public, and update comments that describe completed work as future work.
<!-- /ANCHOR:top-themes -->

<!-- ANCHOR:p0-and-critical -->
## 6. P0 + Critical P1 Findings

### P0 Findings

### F12 — Unbounded JSON parsing in sidecar-client stdout handler

- Severity: P0
- Angle: security
- Fingerprint: `security:sidecar-client:unbounded-json-parsing-resource-exhaustion`
- File: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:476-497
- Evidence quote: `private handleStdout(chunk: string): void {`
- Severity rationale: P0 — Unbounded resource consumption from a child process is a critical security vulnerability. A malicious child could exhaust parent memory and cause denial of service.
- Remediation direction: Add a maximum line length limit (e.g., 1MB) to `handleStdout`. If a line exceeds the limit, reject it and terminate the child process. Also add a maximum buffer size limit to prevent unbounded memory growth.

### F13 — Predictable temp file names in ensure-rerank-sidecar ledger writes

- Severity: P0
- Angle: security
- Fingerprint: `security:ensure-rerank-sidecar:predictable-temp-file-names-symlink-attack`
- File: .opencode/bin/lib/ensure-rerank-sidecar.cjs:167-169
- Evidence quote: `const tmp = `${target}.tmp.${process.pid}.${Date.now()}`;`
- Severity rationale: P0 — Predictable temp file names enable symlink attacks that can lead to arbitrary file writes, which is a critical security vulnerability especially when writing to privileged locations.
- Remediation direction: Use `fs.mkstemp` or generate a cryptographically random suffix (e.g., `crypto.randomBytes(16).toString('hex')`) for the temp file name instead of the predictable `process.pid + Date.now()` pattern.

### F47 — Unbounded JSON parsing in sidecar-worker stdin handler

- Severity: P0
- Angle: security
- Fingerprint: `security:sidecar-worker:unbounded-json-parsing-resource-exhaustion`
- File: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:105-132
- Evidence quote: `function parseRequest(line: string): WorkerRequest {`
- Severity rationale: P0 — Unbounded resource consumption from the parent process is a critical security vulnerability. A compromised or buggy parent could exhaust worker memory and cause denial of service.
- Remediation direction: Add a maximum line length limit (e.g., 1MB) before calling `JSON.parse`. If a line exceeds the limit, reject it and exit the worker process. Also add validation for the `input` array length to prevent unbounded array allocation.

### Top 10 P1 Findings

### F86 — SidecarClient.embed() accepts unbounded input array enabling resource exhaustion

- Severity: P1
- Angle: security
- Fingerprint: `security:sidecar-client:unbounded-embed-input-array-resource-exhaustion`
- File: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:238-270,433-473
- Evidence quote: `async embed(texts: ReadonlyArray<string>, options: SidecarEmbedOptions = {}): Promise<Float32Array[]> {`
- Severity rationale: P1 — Denial-of-service vector exploitable through the MCP embedding API. While the MCP server controls its own batch sizes, an improperly configured or buggy caller could trigger this path.
- Remediation direction: Add a maximum batch size limit (e.g., 500 texts) to the `embed()` method. Validate `texts.length` before the copy and worker dispatch, rejecting oversized batches with a clear error.

### F87 — Sidecar-worker has no input array length validation enabling worker memory exhaustion

- Severity: P1
- Angle: security
- Fingerprint: `security:sidecar-worker:unbounded-embed-input-array-worker-resource-exhaustion`
- File: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:105-132,151-175
- Evidence quote: `function parseRequest(line: string): WorkerRequest {`
- Severity rationale: P1 — Worker-side resource exhaustion complements the client-side issue (finding above). Defense-in-depth requires validation at both boundaries.
- Remediation direction: Add a maximum input length (e.g., 500) to `parseRequest`. Alternatively, implement streaming response where vectors are written one at a time rather than accumulated. Match the proposed client-side limit for defense-in-depth.

### F85 — healthPayload in ensure-rerank-sidecar.cjs accumulates HTTP body unbounded

- Severity: P1
- Angle: security
- Fingerprint: `security:ensure-rerank-sidecar:healthpayload-unbounded-body-accumulation`
- File: .opencode/bin/lib/ensure-rerank-sidecar.cjs:36-49
- Evidence quote: `res.on('data', (chunk) => {`
- Severity rationale: P1 — Resource exhaustion from a spoofed local HTTP service is a real but bounded threat requiring local process access. Not P0 because exploitation requires binding to a specific localhost port, which implies existing local code execution.
- Remediation direction: Add a maximum body size limit (e.g., 64KB) to the response accumulation. If `body.length` exceeds the limit, `req.destroy()` and resolve null. Match the Python implementation's 8192-byte read cap.

### F88 — processLiveness in ensure-rerank-sidecar.cjs defaults unknown errors to 'alive'

- Severity: P1
- Angle: security
- Fingerprint: `security:ensure-rerank-sidecar:processliveness-incorrect-default-alive-fallthrough`
- File: .opencode/bin/lib/ensure-rerank-sidecar.cjs:178-187
- Evidence quote: `function processLiveness(pid, processObj) {`
- Severity rationale: P1 — Incorrect liveness detection in a PID-reuse mechanism can lead to the MCP server interacting with stale or wrong processes. While the practical risk from non-ESRCH/non-EPERM errors is low, the lack of explicit handling creates a maintenance hazard and differs from best-practice liveness detection patterns.
- Remediation direction: Add an explicit comment documenting why unknown errors are treated as alive (following the Python implementation's precedent). Consider adding a `process.stderr.write` warning for unexpected error codes to aid debugging. Alternatively, treat unknown errors as a distinct state (e.g., `'unknown'`) and refuse to reuse sidecars in that state.

### F48 — Predictable request IDs enable request hijacking

- Severity: P1
- Angle: security
- Fingerprint: `security:sidecar-client:predictable-request-ids-hijacking-risk`
- File: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:214,443-444
- Evidence quote: `private nextId = 1;`
- Severity rationale: P1 — Predictable request IDs in an IPC protocol create a request hijacking risk. While the current pipe-based IPC mitigates network-based attacks, the predictability is still a security anti-pattern.
- Remediation direction: Use cryptographically random request IDs (e.g., `crypto.randomBytes(8).readBigUInt64BE()`) instead of sequential IDs. If sequential IDs are needed for debugging, use a combination of random prefix + sequential suffix.

### F49 — Environment variable leakage to child processes

- Severity: P1
- Angle: security
- Fingerprint: `security:ensure-rerank-sidecar:env-var-leakage-child-process`
- File: .opencode/bin/lib/ensure-rerank-sidecar.cjs:252-257
- Evidence quote: `env: {`
- Severity rationale: P1 — Leaking sensitive environment variables to child processes is a security violation. While the sidecar may be trusted, unnecessary exposure of secrets increases the attack surface and violates the principle of least privilege.
- Remediation direction: Implement an allowlist pattern similar to sidecar-client's `isAllowedEnvKey` function. Only pass environment variables that the sidecar explicitly needs (e.g., PATH, HOME, TMPDIR, and RERANK_* variables).

### F94 — Sidecar-worker error responses for pre-parse failures use id=0, silently dropped by client

- Severity: P1
- Angle: refinement
- Fingerprint: `refinement:sidecar-worker:error-response-id-zero-dropped-by-client`
- File: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:207-218
- Evidence quote: `void (async () => {`
- Severity rationale: P1 — Error responses from the worker being silently dropped means real failures manifest as timeouts with no diagnostic information. The developer sees "request timed out after 30000ms" instead of "Invalid sidecar request envelope" or "Unknown sidecar request type: X". This directly impedes debugging. The blast radius includes JSON parse failures and protocol violations — both plausible during development and configuration changes.
- Remediation direction: Initialize `requestId` to a sentinel like `-1` and, in the catch block, check if `requestId` is still the sentinel. If so, attempt to parse the raw line for an `id` field before writing the error response. If no `id` can be recovered, skip writing the error response entirely (the client has no pending request to associate it with). Alternatively, parse the `id` from the raw JSON before the full parseRequest for safety.

### F95 — Cached rejected provider promise persists indefinitely in both adapter paths

- Severity: P1
- Angle: refinement
- Fingerprint: `refinement:embedders:cached-rejected-provider-promise-no-recovery`
- File: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:138-149
- Evidence quote: `async function getProvider(request: EmbedRequest): Promise<IEmbeddingProvider> {`
- Severity rationale: P1 — For DirectProviderAdapter, this creates a permanent failure mode for a provider/model pair after a single transient error. The blast radius is every subsequent reindex and embed request for that provider/model. Recovery requires an MCP server restart. For sidecar-worker, the impact is mitigated by client-side health checks and worker restart, but the pattern itself (caching failure promise) is a correctness anti-pattern that should be documented or fixed.
- Remediation direction: In both locations, wrap the cached promise: on resolution, return the resolved provider; on rejection, null out the cache and re-throw so the next call retries. For DirectProviderAdapter, also consider adding a `clearCache()` or `reset()` method that evicts the adapter from `directAdapters` on persistent failure. Alternatively, add a jittered retry with exponential backoff at the `getProvider` level.

### F69 — Missing file locking in JS ledger write vs Python atomic locking

- Severity: P1
- Angle: drift
- Fingerprint: `drift:ensure-rerank-sidecar:missing-file-locking-vs-python`
- File: .opencode/bin/lib/ensure-rerank-sidecar.cjs:164-170
- Evidence quote: `function writeLedger(dir, rows, fsModule) {`
- Severity rationale: P1 — This is a contract violation between two sibling implementations that are supposed to be functionally identical. The missing file locking creates a correctness risk in concurrent scenarios where the JS version can corrupt the ledger state while the Python version remains safe. This drift can lead to different behavior depending on which language implementation is used.
- Remediation direction: Add file locking to the JavaScript ledger write implementation. Either (a) implement a fcntl-style lock file using `fs.openSync` with exclusive flag, or (b) use a library like `proper-lockfile` to provide cross-platform file locking. Match the Python implementation's lock file pattern (`{LEDGER_FILE_NAME}.lock`) and ensure all ledger read/write operations acquire the lock.

### F101 — Health payload body size limit drift between JS and Python implementations

- Severity: P1
- Angle: drift
- Fingerprint: `drift:ensure-rerank-sidecar:health-payload-body-size-limit-drift`
- File: .opencode/bin/lib/ensure-rerank-sidecar.cjs:36-49
- Evidence quote: `res.on('data', (chunk) => {`
- Severity rationale: P1 — This is a contract violation between two sibling implementations that are supposed to be functionally identical. The body size limit creates a correctness risk where the Python version can fail to parse valid health responses that exceed 8192 bytes, while the JavaScript version succeeds. This drift can lead to different behavior depending on which language implementation is used.
- Remediation direction: Either (a) remove the 8192 byte limit from the Python implementation to match the JavaScript behavior, or (b) add a matching size limit to the JavaScript implementation and document the maximum expected response size. Given that health check responses are typically small, removing the limit from Python is the safer choice to prevent future truncation issues.

<!-- /ANCHOR:p0-and-critical -->

<!-- ANCHOR:adversarial-spot-check -->
## 7. Adversarial Spot-Check

I re-read the cited implementation and nearby tests for the five highest-severity findings. No findings were withdrawn or downgraded.

### F12 — Unbounded JSON parsing in sidecar-client stdout handler

- Verdict: Verified
- Re-evaluation: Re-read `sidecar-client.ts:476-497`: `stdoutBuffer += chunk` and `JSON.parse(line)` have no cap. `sidecar-hardening.vitest.ts` tests env filtering and timeout cleanup, not oversized stdout or parse limits. Remediation is safe if it rejects oversized lines and terminates the child.
### F13 — Predictable temp file names in ensure-rerank-sidecar ledger writes

- Verdict: Verified
- Re-evaluation: Re-read `ensure-rerank-sidecar.cjs:164-170`: temp names use `process.pid` plus `Date.now()` and `writeFileSync` does not request exclusive create. Default `mkdirSync(..., 0o700)` reduces exposure for trusted state dirs, but configured or pre-existing shared dirs remain vulnerable. Random temp names plus exclusive create is safe.
### F47 — Unbounded JSON parsing in sidecar-worker stdin handler

- Verdict: Verified
- Re-evaluation: Re-read `sidecar-worker.ts:105-132` and line handling at `201-220`: stdin lines flow directly to `JSON.parse` with no byte or line limit. Tests do not assert oversized stdin rejection. Add a line cap before parsing.
### F86 — SidecarClient.embed() accepts unbounded input array enabling resource exhaustion

- Verdict: Verified
- Re-evaluation: Re-read `sidecar-client.ts:238-270` and `433-473`: `embed()` copies all `texts` into the request and writes a single JSON line. Existing tests call one-item batches and do not prove a maximum. Add a client batch limit before copying.
### F87 — Sidecar-worker has no input array length validation enabling worker memory exhaustion

- Verdict: Verified
- Re-evaluation: Re-read `sidecar-worker.ts:119-175`: `isStringArray` validates type only, then `handleEmbed` pushes every vector and writes one aggregate response. No tests prove a worker-side length limit. Mirror the client cap or stream responses.
<!-- /ANCHOR:adversarial-spot-check -->

<!-- ANCHOR:remediation-plan -->
## 8. Remediation Plan

### Fix sidecar IPC resource limits

- Scope: F12, F47, F86, F87, F94, F99, F100
- Priority: P0/P1
- Suggested packet location: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/002-fix-sidecar-investigation-findings/`
- Estimated effort: medium

### Align rerank sidecar JS/Python file and liveness contracts

- Scope: F1, F13, F15, F69, F72, F85, F88, F101, F102, F103, F104
- Priority: P0/P1
- Suggested packet location: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/002-fix-sidecar-investigation-findings/`
- Estimated effort: large

### Reduce sidecar-client and execution-router production API surface

- Scope: F2, F18, F20, F25, F37, F38, F52, F56, F57, F58, F73, F74, F79
- Priority: P1/P2
- Suggested packet location: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/002-fix-sidecar-investigation-findings/`
- Estimated effort: medium

### Decide and simplify reindex cancellation contract

- Scope: F24, F27, F41, F54, F60, F81, F82, F93, F96, F98, F105, F110
- Priority: P1/P2
- Suggested packet location: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/002-fix-sidecar-investigation-findings/`
- Estimated effort: medium

### Prune stale barrel exports and duplicate type definitions

- Scope: F7, F8, F34, F42, F44, F45, F68, F70, F77, F78, F106, F107, F108, F109
- Priority: P2
- Suggested packet location: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/002-fix-sidecar-investigation-findings/`
- Estimated effort: small

### Tighten env propagation and credential lifecycle

- Scope: F16, F40, F46, F49, F89, F90, F95
- Priority: P1/P2
- Suggested packet location: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/002-fix-sidecar-investigation-findings/`
- Estimated effort: medium
<!-- /ANCHOR:remediation-plan -->

<!-- ANCHOR:risks-and-limitations -->
## 9. Risks & Limitations

This research was static analysis only. It did not cover runtime behavior under load, cross-platform behavior beyond what existing tests assert, measured performance benchmarks, or the full user-runtime side that consumes the sidecar. Skill boundaries were crossed only where evidence pointed to cross-skill sidecar consumers.

Quality risks remain: the registry may over-count the same underlying pattern when it appears in multiple files; cli-devin SWE-1.6 tends to favor surface findings over deep semantic analysis; DeepSeek-v4-pro tested fewer prior-iteration dedup hypotheses because the longer context window absorbed more state. Treat the registry as remediation planning input, not proof that every P2 deserves an isolated patch.
<!-- /ANCHOR:risks-and-limitations -->

<!-- ANCHOR:appendix -->
## 10. Appendix — Full Finding Registry Transcription

| ID | Severity | Angle | Title | File:line | Fingerprint | Suggested fix |
|----|----------|-------|-------|-----------|-------------|---------------|
| F1 | P1 | drift | Config hash default revision drift between JS and Python implementations | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:136` | `drift:ensure-rerank-sidecar:config-hash-default-revision-mismatch` | Align the empty string handling logic between both implementations to treat empty string as "use default" consistently. |
| F2 | P1 | drift | Inconsistent backend kind resolution logic between sidecar-client and execution-router | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:106-117` | `drift:backend-kind-resolution:duplicate-implementation` | Move the canonical `toBackendKind` implementation to `@spec-kit/shared/embeddings/types.js` and have both files import it, removing the duplicate implementations. |
| F3 | P1 | drift | Environment variable naming drift between documentation and implementation | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:229-233` | `drift:env-var-naming:inconsistent-conventions` | Add a comment block documenting the SPECKIT_ environment variable naming convention and list all recognized SPECKIT_ prefixes in one location for maintainability. |
| F4 | P2 | drift | Missing JSDoc comments for public API surface in sidecar-client | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:183-195` | `drift:sidecar-client:missing-jsdoc-public-api` | Add JSDoc comments to all exported functions and class methods documenting parameters, return types, and usage examples. |
| F5 | P1 | dead-code | Unreachable model-name fallback chain in sidecar-worker getModelName | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:54-59` | `dead-code:sidecar-worker:unreachable-model-fallback-chain` | Remove the `HF_EMBEDDINGS_MODEL` and hardcoded default fallbacks. Keep only `requestModel \|\| SPECKIT_EMBEDDER_SIDECAR_MODEL`. If the intent is defense-in-depth, add a comment explaining that the parent always provides these values. |
| F6 | P1 | dead-code | Test-only production export __embedderExecutionRouterTestables | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:247-254` | `dead-code:execution-router:test-harness-exports` | Move test-only state isolation into the test file via a module-level reset pattern (e.g., `vi.resetModules()` or a `createFreshRouter()` factory), or gate the export behind `process.env.NODE_ENV === 'test'`. |
| F7 | P2 | dead-code | Unused export EmbedderSidecarInputType with zero external consumers | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:18` | `dead-code:sidecar-client:unused-embedder-input-type-export` | Remove the `export` keyword, making the type private to the module. If the type is needed externally, document which consumers use it. |
| F8 | P2 | dead-code | Unused type exports EmbedderExecutionPolicy and EmbedderExecutionInputType | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:18-19` | `dead-code:execution-router:unused-policy-type-exports` | Remove the `export` keyword from both types. If they were intended for future public API surface, document that intent with a comment. |
| F9 | P2 | dead-code | buildSidecarEnv exported solely for test consumption | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:183-195` | `dead-code:sidecar-client:test-only-buildsidecarenv-export` | Either make `buildSidecarEnv` private (remove `export`) and test env filtering indirectly through `SidecarClient` behavior, or gate with `process.env.VITEST` / `import.meta.vitest` conditional export. |
| F10 | P2 | dead-code | Unreachable dimension fallback in sidecar-worker getDimensions | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:61-68` | `dead-code:sidecar-worker:unreachable-dimensions-fallback` | Remove the `SPECKIT_EMBEDDER_SIDECAR_DIMENSIONS` env fallback and the `768` default. The `requestDimensions` parameter is always a valid positive integer from the parent. |
| F11 | P2 | dead-code | Unused named exports in ensure-rerank-sidecar.cjs module.exports | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:289-298` | `dead-code:ensure-rerank-sidecar:unused-named-exports` | Export only `ensureRerankSidecar` from the module. Internal helpers can be exposed via the `deps` injection pattern already used for testing, or extracted to a separate module if they need standalone consumption. |
| F12 | P0 | security | Unbounded JSON parsing in sidecar-client stdout handler | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:476-497` | `security:sidecar-client:unbounded-json-parsing-resource-exhaustion` | Add a maximum line length limit (e.g., 1MB) to `handleStdout`. If a line exceeds the limit, reject it and terminate the child process. Also add a maximum buffer size limit to prevent unbounded memory growth. |
| F13 | P0 | security | Predictable temp file names in ensure-rerank-sidecar ledger writes | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:167-169` | `security:ensure-rerank-sidecar:predictable-temp-file-names-symlink-attack` | Use `fs.mkstemp` or generate a cryptographically random suffix (e.g., `crypto.randomBytes(16).toString('hex')`) for the temp file name instead of the predictable `process.pid + Date.now()` pattern. |
| F14 | P1 | security | Incorrect parent liveness detection in sidecar-worker | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:74-85` | `security:sidecar-worker:incorrect-parent-liveness-detection-eperm-bypass` | Change the logic to treat `EPERM` as a distinct state (like the Python implementation does) or as "unknown/dead" rather than conflating it with "alive". The worker should exit if it cannot definitively confirm the parent is alive. |
| F15 | P1 | security | Missing atomic file write in owner token creation | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:117-127` | `security:ensure-rerank-sidecar:non-atomic-owner-token-write-race-condition` | Use a proper atomic write pattern: write to a temp file with random name, then `renameSync` to the target (which is atomic on POSIX). This matches the pattern already used for ledger writes (lines 167-169) and the Python implementation. |
| F16 | P2 | security | Broad SPECKIT_ environment variable prefix allowlist | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:175-181` | `security:sidecar-client:broad-env-prefix-allowlist-injection-risk` | Replace the broad prefix checks with an explicit allowlist of known `SPECKIT_EMBEDDER_*` variable names (e.g., `SPECKIT_EMBEDDER_SIDECAR_PROVIDER`, `SPECKIT_EMBEDDER_SIDECAR_MODEL`, etc.). If a prefix-based allowlist is needed for flexibility, document the security implications and add input validation for specific variable values. |
| F17 | P2 | security | Missing input sanitization in config hash calculation | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:129-141` | `security:ensure-rerank-sidecar:missing-input-sanitization-config-hash` | Normalize environment variable values before hashing: trim whitespace, restrict character sets (e.g., only alphanumeric, hyphens, underscores, slashes for model names), and validate that values match expected patterns. |
| F18 | P1 | over-engineering | SidecarClient constructor accepts 7 optional fields serving only test consumers | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:20-31` | `over-engineering:sidecar-client:optional-config-fields-only-for-tests` | Collapse `SidecarClientOptions` to the 3 required fields plus `backend`. Extend it internally or behind a test-only factory (`createSidecarClientForTest(opts)`) for test injection. If env var overrides are genuinely needed in production, keep only those and remove the constructor-level overrides. |
| F19 | P1 | over-engineering | Sidecar-worker single-caller helper function indirection chain | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:50-149` | `over-engineering:sidecar-worker:single-caller-helper-indirection` | Inline `getProviderName`, `getModelName`, `getDimensions`, and `isStringArray` into their single call sites. Keep `parentProcessAlive` (nontrivial logic), `startParentDeathPolling` (encapsulates lifecycle concern), and `toErrorMessage` (used at error boundary, reasonable extraction). Collapse `getProvider` into `handleEmbed` since it's only called from there. Target: ~30 line reduction. |
| F20 | P1 | over-engineering | Duplicate single-property EmbedOptions interfaces across two files | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:41-43` | `over-engineering:embed-options:duplicate-single-property-interfaces` | If `@spec-kit/shared/embeddings/adapter.js` exports an `EmbedOptions` type, import and use it in both files, removing both local interfaces and their type aliases. If the upstream type doesn't exist, define a single `EmbedOptions` in `adapter.ts` (the local re-export shim) and import it. If the `inputType` parameter is genuinely optional at every call site, consider removing the options object entirely and using a second optional parameter. |
| F21 | P2 | over-engineering | resolvePort function semantically overloaded to parse timeout values | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:21-24,219` | `over-engineering:ensure-rerank-sidecar:resolveport-used-for-timeout` | Queue targeted remediation for "resolvePort function semantically overloaded to parse timeout values" and preserve current behavior with focused tests. |
| F22 | P2 | over-engineering | skipIfDisabled parameter always true in single production call | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:220,230` | `over-engineering:ensure-rerank-sidecar:skipifdisabled-always-true-production` | Queue targeted remediation for "skipIfDisabled parameter always true in single production call" and preserve current behavior with focused tests. |
| F23 | P2 | over-engineering | DirectProviderAdapter 68-line class with single instantiation site and ollama delegation branch | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:130-198,225` | `over-engineering:execution-router:directprovideradapter-single-instantiation` | Queue targeted remediation for "DirectProviderAdapter 68-line class with single instantiation site and ollama delegation branch" and preserve current behavior with focused tests. |
| F24 | P2 | over-engineering | ReindexJob/JobRow dual representation with normalizeJob() field-name converter | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:32-65,123-136` | `over-engineering:reindex:dual-job-row-representation` | Queue targeted remediation for "ReindexJob/JobRow dual representation with normalizeJob() field-name converter" and preserve current behavior with focused tests. |
| F25 | P1 | simplification | Sidecar-client 8 single-call helper functions with trivial implementations | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:86-195` | `simplification:sidecar-client:eight-single-call-helpers` | Inline `parsePositiveIntegerEnv`, `defaultWorkerPath`, `responseHasId`, `isAllowedEnvKey` into their single call sites. Inline `toErrorMessage` at its 3 call sites (it's a one-liner). Move `sleep`, `signalChildProcessGroup`, `waitForChildExit` into `terminateChild` as local functions since they're only used there. Keep `buildSidecarEnv` as-is since it's exported for tests (already flagged as dead-code P2 in iter 2). |
| F26 | P1 | simplification | Sidecar-worker 4 single-call helper functions with trivial implementations | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:50-103` | `simplification:sidecar-worker:four-single-call-helpers` | Inline `getProviderName`, `getModelName`, `getDimensions` directly into `getProvider` (line 141-143). Inline `isStringArray` directly into `parseRequest` (line 120). Keep `parentProcessAlive` (nontrivial logic) and `startParentDeathPolling` (encapsulates lifecycle concern). Keep `toErrorMessage` (used at error boundary, reasonable extraction). Target: ~20 line reduction. |
| F27 | P2 | simplification | Reindex normalizeJob/JobRow dual representation can be eliminated with SQL aliases | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:32-65,123-136,142-164` | `simplification:reindex:dual-job-row-representation-sql-aliases` | Use SQL column aliases in all queries to return camelCase directly: `SELECT id, from_name AS fromName, to_name AS toName, to_dim AS toDim, total, processed, status, started_at AS startedAt, updated_at AS updatedAt, error FROM embedder_jobs WHERE id = ?`. Remove `JobRow` interface and `normalizeJob` function. Change `ReindexJob.error` type to `string \| null` to match the database directly. |
| F28 | P2 | simplification | Ensure-rerank-sidecar deps injection pattern adds complexity for testability | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:30-79,211-217` | `simplification:ensure-rerank-sidecar:deps-injection-complexity` | Remove the deps injection pattern from internal functions (`healthPayload`, `isHealthy`, `waitForHealthy`, `loadOrCreateOwnerToken`, `readLedger`, `writeLedger`, `processLiveness`, `findReusableSidecar`). Have these functions use the native modules directly (`http`, `fs`, `os`, `process`). Use test-specific module mocking in the test file instead of manual injection. Keep the deps pattern only in `ensureRerankSidecar` if needed for integration testing, or remove entirely if tests can mock at the module level. |
| F29 | P2 | simplification | Sidecar-client responseHasId type guard can be inlined into handleResponseLine | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:119-125,490-506` | `simplification:sidecar-client:responsehasid-type-guard-inline` | Inline the type guard check directly into `handleResponseLine`: if (typeof parsed !== 'object' \|\| parsed === null \|\| typeof (parsed as { id?: unknown }).id !== 'number') { return; } Remove the `responseHasId` function entirely. |
| F30 | P1 | refinement | Inconsistent error-message detail across embedder module boundaries | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:161` | `refinement:embedders:inconsistent-error-message-detail` | Standardize error messages across modules to include `provider:model` (from env vars in worker, from instance fields in client/router). For sidecar-worker, use `process.env.SPECKIT_EMBEDDER_SIDECAR_PROVIDER` and `process.env.SPECKIT_EMBEDDER_SIDECAR_MODEL`. For reindex, include the adapter's name/dim from the `initialJob` context already available in `runJob`. |
| F31 | P1 | refinement | resolveExecutionPolicy mixes logging side effect into pure resolver function | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:57-67` | `refinement:execution-router:resolveexecutionpolicy-logging-side-effect` | Queue targeted remediation for "resolveExecutionPolicy mixes logging side effect into pure resolver function" and preserve current behavior with focused tests. |
| F32 | P2 | refinement | SidecarWorkerInfo interface mixes camelCase and snake_case field naming | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:33-39,218-219,281-293` | `refinement:sidecar-client:sidecarworkerinfo-mixed-naming-convention` | Queue targeted remediation for "SidecarWorkerInfo interface mixes camelCase and snake_case field naming" and preserve current behavior with focused tests. |
| F33 | P2 | refinement | Comment section-divider style drift between reindex.ts and other embedder modules | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:1,26,74,101` | `refinement:embedders:comment-divider-style-drift-across-modules` | Choose one divider style and apply it consistently across all five modules. The Unicode box-drawing `─` characters are visually superior (solid line appearance) and used by the majority, so reindex.ts should adopt that style. A single sed/AST reformat pass would fix it. |
| F34 | P2 | refinement | WorkerInputType is third independent definition of 'document' \| 'query' union | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:14` | `refinement:sidecar-worker:third-copy-input-type-union` | Queue targeted remediation for "WorkerInputType is third independent definition of 'document' \| 'query' union" and preserve current behavior with focused tests. |
| F35 | P2 | refinement | Misleading error message 'Embedding batch cardinality mismatch' in reindex write helpers | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:230-231,260-261,382-384` | `refinement:reindex:misleading-cardinality-error-message` | Queue targeted remediation for "Misleading error message 'Embedding batch cardinality mismatch' in reindex write helpers" and preserve current behavior with focused tests. |
| F36 | P2 | refinement | toErrorMessage extraction pattern inconsistently applied across embedder modules | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:127-129` | `refinement:embedders:toerrormessage-inconsistent-extraction` | Queue targeted remediation for "toErrorMessage extraction pattern inconsistently applied across embedder modules" and preserve current behavior with focused tests. |
| F37 | P1 | drift | SidecarClientOptions API surface drift from production usage | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:20-31` | `drift:sidecar-client:api-surface-drift-from-production-usage` | Either (a) remove the 7 optional fields from the public interface and move them to a test-only factory function, or (b) document clearly that these options are test-only and not supported in production. The current drift between interface definition and production usage is misleading. |
| F38 | P1 | drift | toBackendKind function signature drift between sidecar-client and execution-router | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:106-117` | `drift:backend-kind-resolution:function-signature-drift` | Align the function signatures and implementations. Either (a) add the fallback parameter to execution-router and normalize provider in sidecar-client, or (b) remove the fallback parameter from sidecar-client and move the canonical implementation to a shared location as suggested in iteration 1. |
| F39 | P2 | drift | SidecarWorkerInfo mixed naming convention drift from internal implementation | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:33-39,218-219,281-293` | `drift:sidecar-client:sidecarworkerinfo-naming-convention-drift` | Standardize on one naming convention for the entire interface. Choose either all camelCase (matching internal fields) or all snake_case (matching external JSON convention) and apply it consistently. Remove the ad-hoc name translation logic from getWorkerInfo. |
| F40 | P2 | drift | SPECKIT_ environment variable usage drift from documented patterns | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:80,175-181,229-233,343-346` | `drift:sidecar-client:env-var-usage-drift-from-documented-patterns` | Add a centralized comment block or constant documenting all recognized SPECKIT_ environment variables, their prefixes, and their purposes. Group related variables (e.g., all SPECKIT_EMBEDDER_SIDECAR_* variables) and document the naming convention pattern. |
| F41 | P2 | dead-code | cancelJob has zero production callers; only invoked in tests | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:465-479` | `dead-code:reindex:canceljob-zero-production-callers` | Either wire an MCP tool handler that calls `cancelJob`, or gate the export behind `process.env.VITEST` / `import.meta.vitest` conditional. If cancellation is a future feature, add a `// TODO: wire MCP cancel tool` comment and consider gating the export for now. |
| F42 | P2 | dead-code | ACTIVE_REINDEX_STATUSES exported from barrel but zero consumers | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:519` | `dead-code:reindex:active-reindex-statuses-unused-export` | Remove `ACTIVE_REINDEX_STATUSES` from the barrel export in `index.ts`. The `ACTIVE_JOB_STATUSES` constant remains available internally in `reindex.ts`. If external consumers need it later, it can be re-exported at that time. |
| F43 | P2 | dead-code | ReindexRuntimeOptions.autoStart = false path dead in production; only used in tests | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:49-52,423-455` | `dead-code:reindex:autostart-false-dead-production-path` | Two options: (a) Remove `autoStart` from `ReindexRuntimeOptions` and always call `enqueueJob` — tests can use `vi.mock('../embedders/reindex.js', ...)` to intercept `enqueueJob` rather than controlling it through a parameter. (b) Gate the `autoStart` field behind `process.env.VITEST` conditional type narrowing. Option (a) is preferred as it removes the test-only production code path entirely. |
| F44 | P2 | dead-code | listSupportedDimensions zero production callers; only invoked by tests | `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts:111-120` | `dead-code:registry:listsupporteddimensions-test-only` | Either wire `listSupportedDimensions` into the embedder-list handler (augment the response with `dimensions: listSupportedDimensions()`), or gate the export behind test conditionals. If the function is intended for future use, add a `// TODO` comment documenting the planned MCP tool. |
| F45 | P2 | dead-code | OllamaEmbedOptions and OllamaInputType barrel exports never imported | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:43` | `dead-code:index-barrel:ollama-embed-options-types-unused` | Remove `OllamaEmbedOptions` and `OllamaInputType` from the barrel export in `index.ts`. The types remain available internally in `ollama.ts` for the `OllamaAdapter` class. If external consumers eventually need them, they can be added back to the barrel at that time. |
| F46 | P2 | dead-code | MOCK_SIDECAR_ env prefix allowlisting dead in production | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:175-181` | `dead-code:sidecar-client:mock-sidecar-env-prefix-production` | Gate the `MOCK_SIDECAR_` prefix check behind an environment-aware conditional, e.g., `\|\| (process.env.VITEST && key.startsWith('MOCK_SIDECAR_'))`. Alternatively, add `MOCK_SIDECAR_*` vars to the `explicitAllowlist` parameter in test call sites instead of baking the prefix into the production allowlist logic. This removes the dead production code path and narrows the allowlist surface. |
| F47 | P0 | security | Unbounded JSON parsing in sidecar-worker stdin handler | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:105-132` | `security:sidecar-worker:unbounded-json-parsing-resource-exhaustion` | Add a maximum line length limit (e.g., 1MB) before calling `JSON.parse`. If a line exceeds the limit, reject it and exit the worker process. Also add validation for the `input` array length to prevent unbounded array allocation. |
| F48 | P1 | security | Predictable request IDs enable request hijacking | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:214,443-444` | `security:sidecar-client:predictable-request-ids-hijacking-risk` | Use cryptographically random request IDs (e.g., `crypto.randomBytes(8).readBigUInt64BE()`) instead of sequential IDs. If sequential IDs are needed for debugging, use a combination of random prefix + sequential suffix. |
| F49 | P1 | security | Environment variable leakage to child processes | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:252-257` | `security:ensure-rerank-sidecar:env-var-leakage-child-process` | Implement an allowlist pattern similar to sidecar-client's `isAllowedEnvKey` function. Only pass environment variables that the sidecar explicitly needs (e.g., PATH, HOME, TMPDIR, and RERANK_* variables). |
| F50 | P2 | security | Fixed polling interval enables timing attacks | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:93-97` | `security:sidecar-worker:fixed-polling-interval-timing-attack` | Add jitter to the polling interval (e.g., `250 + Math.random() * 50` ms) to make the timing less predictable. Alternatively, use event-based parent death detection (e.g., `process.on('disconnect')` in Node.js IPC) instead of polling. |
| F51 | P2 | security | Unsafe signal handling in shutdown hooks | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:116-123` | `security:execution-router:unsafe-signal-handling-shutdown-hooks` | Remove the `process.kill(process.pid, signal)` calls. Let the default signal handler run after the custom handler completes, or explicitly call `process.exit(0)` if graceful shutdown is complete. If re-sending the signal is intentional, add a guard flag to prevent recursion. |
| F52 | P1 | over-engineering | resolveDimensions 4-level fallback ladder with dead 3rd level | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:80-96` | `over-engineering:execution-router:resolve-dimensions-dead-branch` | Remove the dead conditional (lines 91-93). If profile-match validation is needed, replace with an explicit `console.warn` or throw. Otherwise, collapse to: `const profile = getStartupEmbeddingProfile(); return profile.dim;`. |
| F53 | P1 | over-engineering | Elaborate shutdown hook machinery undermined by fire-and-forget void | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:106-123` | `over-engineering:execution-router:shutdown-hooks-fire-and-forget` | Either (a) remove the signal handlers and `beforeExit` hook entirely, letting the OS clean up child processes (they're already `detached: true` with `unref()`), or (b) make the SIGINT/SIGTERM handlers async: set an exit flag, await `shutdownAllSidecars()`, then call `process.exit()`. The current middle-ground (complex hooks that don't await) is the worst of both worlds. |
| F54 | P2 | over-engineering | getCancellationStatus is a column-subset duplicate of selectJob | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:142-151` | `over-engineering:reindex:getcancellationstatus-duplicates-selectjob` | Replace `getCancellationStatus(db, jobId)` calls with `selectJob(db, jobId)?.status`. Remove the `getCancellationStatus` function. If the `normalizeJob` overhead is genuinely concerning, add a `selectJobStatus(db, jobId)` that shares the same prepared statement base, but only if profiled. |
| F55 | P2 | over-engineering | BaseRequest interface defined but never used as standalone type | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:16-19` | `over-engineering:sidecar-worker:baserequest-unused-standalone` | Inline `id: number` and `type: string` into each of the 3 request interfaces. Remove `BaseRequest`. Net change: +2 lines of property repetition, -3 lines of interface definition. Alternatively, use `BaseRequest` in `parseRequest` as a proper type guard to earn the abstraction. |
| F56 | P2 | over-engineering | Triple redundant normalizeProvider calls in getEmbedderAdapter | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:38-44` | `over-engineering:execution-router:triple-normalizeprovider-calls` | Normalize once at the top of `getEmbedderAdapter`: `const normalized = normalizeProvider(provider)`. Pass `normalized` to `cacheKey`, `shouldUseSidecar`, and the adapter constructors. Update `cacheKey` and `shouldUseSidecar` to accept pre-normalized input (or keep the normalization as a defensive no-op). Net reduction: 2 redundant `.trim().toLowerCase()` calls per adapter creation. |
| F57 | P1 | simplification | Sidecar-client terminateChild duplicate signal/exit pattern | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:385-408` | `simplification:sidecar-client:terminatechild-duplicate-signal-exit-pattern` | Extract the escalation pattern into a helper function: async function terminateWithEscalation(child: ChildProcess, signals: NodeJS.Signals[], timeoutMs: number): Promise<void> { for (const signal of signals) { signalChildProcessGroup(child, signal); const exited = await waitForChildExit(child, timeoutMs); if (exited) return; } } Then simplify `terminateChild` to: this.termination = (async () => { await terminateWithEscalation(child, ['SIGTERM', 'SIGKILL'], DEFAULT_TERMINATION_GRACE_MS); this.cleanupChild(child); await sleep(0); })(); This reduces the method from 24 lines to ~12 lines and eliminates the duplicate pattern. |
| F58 | P1 | simplification | Execution-router registerShutdownHooks repetitive signal handling | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:106-124` | `simplification:execution-router:registershutdownhooks-repetitive-signal-handling` | Extract the signal handler pattern into a helper: function registerShutdownHooks(): void { if (shutdownHooksRegistered) { return; } shutdownHooksRegistered = true; const shutdown = (): void => { void shutdownAllSidecars(); }; process.once('beforeExit', shutdown); const registerSignal = (signal: NodeJS.Signals): void => { process.once(signal, () => { shutdown(); process.kill(process.pid, signal); }); }; registerSignal('SIGINT'); registerSignal('SIGTERM'); } This reduces the function from 19 lines to ~16 lines and eliminates the duplicate signal handling logic. If more signals need to be added (e.g., SIGHUP), they can be added with a single line. |
| F59 | P2 | simplification | Ensure-rerank-sidecar healthPayload repetitive error handling | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:30-58` | `simplification:ensure-rerank-sidecar:healthpayload-repetitive-error-handling` | Consolidate the error handling into a single helper: async function healthPayload(port, timeoutMs, deps = {}) { const httpModule = deps.http ?? http; return new Promise((resolve) => { const req = httpModule.get({ host: '127.0.0.1', port, path: '/health', timeout: timeoutMs }, (res) => { let body = ''; res.setEncoding('utf8'); res.on('data', (chunk) => { body += chunk; }); res.on('end', () => { if (res.statusCode !== 200) { return resolve(null); } try { const parsed = JSON.parse(body); resolve(parsed && typeof parsed === 'object' ? parsed : null); } catch { resolve(null); } }); }); const onError = () => resolve(null); req.on('error', onError); req.on('timeout', () => { req.destroy(); onError(); }); }); } This reduces the function from 29 lines to ~26 lines and consolidates the error handling logic. The `onError` helper makes it clear that all error paths resolve to null. |
| F60 | P2 | simplification | Reindex writeVectors duplicate cardinality check | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:215-238,249-269` | `simplification:reindex:writevectors-duplicate-cardinality-check` | Extract the cardinality check into a helper or move it to the caller: function validateCardinality(rows: MemoryRow[], embeddings: Float32Array[]): void { for (let i = 0; i < rows.length; i += 1) { if (!rows[i] \|\| !embeddings[i]) { throw new Error('Embedding batch cardinality mismatch'); } } } function writeVectorsToShard(...) { // ... validateCardinality(rows, embeddings); writeVectors(shard, tableName, rows, embeddings); if (vecAvailable) { writeVectorsToKnn(shard, rows, embeddings); } } Then remove the check from both `writeVectors` and `writeVectorsToKnn`. This eliminates the duplicate check and centralizes the validation logic. |
| F61 | P1 | refinement | resolveDimensions unconditional fallback returns potentially wrong dimensions | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:80-96` | `refinement:execution-router:resolvedimensions-unconditional-fallback` | Queue targeted remediation for "resolveDimensions unconditional fallback returns potentially wrong dimensions" and preserve current behavior with focused tests. |
| F62 | P1 | refinement | handleResponseLine unsafe type assertion bypasses discriminator check | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:490-519` | `refinement:sidecar-client:handleresponseline-unsafe-type-assertion` | Queue targeted remediation for "handleResponseLine unsafe type assertion bypasses discriminator check" and preserve current behavior with focused tests. |
| F63 | P2 | refinement | DirectProviderAdapter class name misleads — delegates to registry adapter for ollama | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:130-198` | `refinement:execution-router:directprovideradapter-misleading-name` | Queue targeted remediation for "DirectProviderAdapter class name misleads — delegates to registry adapter for ollama" and preserve current behavior with focused tests. |
| F64 | P2 | refinement | DirectProviderAdapter.embed fragile type assertion for ollama delegation path | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:154-158` | `refinement:execution-router:directprovideradapter-fragile-type-assertion` | Queue targeted remediation for "DirectProviderAdapter.embed fragile type assertion for ollama delegation path" and preserve current behavior with focused tests. |
| F65 | P2 | refinement | writeVectorsToShard 60-line function with mixed concerns | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:271-330` | `refinement:reindex:writevectorstoshard-mixed-concerns` | Queue targeted remediation for "writeVectorsToShard 60-line function with mixed concerns" and preserve current behavior with focused tests. |
| F66 | P2 | refinement | openSidecarLogFd returns mixed number \| 'ignore' return type | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:81-95` | `refinement:ensure-rerank-sidecar:openLogFd-mixed-return-type` | Queue targeted remediation for "openSidecarLogFd returns mixed number \| 'ignore' return type" and preserve current behavior with focused tests. |
| F67 | P2 | refinement | ensureRerankSidecar 77-line god function with 7+ distinct concerns | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:211-287` | `refinement:ensure-rerank-sidecar:ensurereranksidecar-god-function` | Queue targeted remediation for "ensureRerankSidecar 77-line god function with 7+ distinct concerns" and preserve current behavior with focused tests. |
| F68 | P2 | refinement | index.ts barrel file stale phase-plan comments describing already-completed work as future | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:4-6` | `refinement:index-barrel:stale-phase-comments` | Queue targeted remediation for "index.ts barrel file stale phase-plan comments describing already-completed work as future" and preserve current behavior with focused tests. |
| F69 | P1 | drift | Missing file locking in JS ledger write vs Python atomic locking | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:164-170` | `drift:ensure-rerank-sidecar:missing-file-locking-vs-python` | Add file locking to the JavaScript ledger write implementation. Either (a) implement a fcntl-style lock file using `fs.openSync` with exclusive flag, or (b) use a library like `proper-lockfile` to provide cross-platform file locking. Match the Python implementation's lock file pattern (`{LEDGER_FILE_NAME}.lock`) and ensure all ledger read/write operations acquire the lock. |
| F70 | P1 | drift | types.ts comment drift from actual implementation | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/types.ts:4` | `drift:types.ts:canonical-location-comment-drift` | Either (a) migrate the canonical `toBackendKind` implementation to `@spec-kit/shared/embeddings/types.js` and update both local files to import it, or (b) update the comment in types.ts to reflect the actual architecture (that the implementation is currently duplicated locally). If the phase 003/006 work is complete, the comment should be updated to reflect the current state rather than the planned state. |
| F71 | P2 | drift | sidecar-worker getProviderName undocumented default value | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:50-52` | `drift:sidecar-worker:getprovidername-undocumented-default` | Add a comment documenting the default value and its rationale. Update any environment variable documentation to include this default. Consider whether 'hf-local' is the correct default or if an error should be raised when the environment variable is not set. |
| F72 | P2 | drift | ensure-rerank-sidecar missing directory fsync vs Python implementation | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:164-170` | `drift:ensure-rerank-sidecar:missing-directory-fsync-vs-python` | Add directory fsync to the JavaScript implementation after the rename operation. Use `fs.fsyncSync` on the directory file descriptor to match the Python implementation's durability guarantees. Alternatively, document that the JS implementation has weaker durability guarantees if the fsync is intentionally omitted for performance reasons. |
| F73 | P1 | dead-code | SidecarClient.ready() has zero production callers | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:272-279` | `dead-code:sidecar-client:ready-zero-production-callers` | Either wire `.ready()` into a production code path (e.g., `embedder-list` handler should also probe local-sidecar providers) or document that `ready()` on SidecarClient is test-only and gate it behind an environment-aware conditional if it must stay. |
| F74 | P1 | dead-code | DirectProviderAdapter.ready() has zero production callers | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:175-185` | `dead-code:execution-router:directprovideradapter-ready-zero-production-callers` | Same options as SidecarClient.ready(): wire into production or gate behind test conditionals. Since `embedder-list.ts` already calls `.ready()` on registry adapters, the cleanest fix is to remove the `ready()` method from the `EmbedderAdapter` interface for classes that are only used through `getEmbedderAdapter()`, or conversely wire `embedder_list` to also report readiness for sidecar-managed providers. |
| F75 | P2 | dead-code | getProviderName dead 'hf-local' default fallback | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:50-52` | `dead-code:sidecar-worker:unreachable-provider-default` | Remove the `\|\| 'hf-local'` fallback. If the env var is somehow unset, the empty string will cause a clear downstream error rather than silently using a wrong provider. |
| F76 | P2 | dead-code | handleEmbed dead '?? "document"' nullish coalescing | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:153` | `dead-code:sidecar-worker:unreachable-inputtype-default` | Remove the `?? 'document'` fallback: `const inputType = request.inputType;`. If defensive intent is valued, add a comment noting that `parseRequest` always populates this field. |
| F77 | P2 | dead-code | OllamaAdapter + error classes in barrel with zero direct consumers | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:37-41` | `dead-code:index-barrel:ollama-adapter-classes-zero-consumers` | Remove lines 37-41 from `index.ts`. The classes remain accessible via direct import from `./adapters/ollama.js` and via the shared package. If external consumers later need them through the barrel, they can be re-added. |
| F78 | P2 | dead-code | NotImplementedError barrel export with zero consumers | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:16` | `dead-code:index-barrel:notimplementederror-zero-consumers` | Either remove `NotImplementedError` from the barrel export, or add a specific `catch` for it in `probeReady` and `embedder_list` to surface a meaningful "unsupported backend" message instead of a generic `false` readiness status. |
| F79 | P1 | over-engineering | terminateChild over-engineered dual-promise lifecycle with sleep(0) hack | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:385-408` | `over-engineering:sidecar-client:terminatechild-dual-promise-lifecycle` | Replace the dual-state pattern with a single `#termination: Promise<void> \| null` and a `#shuttingDown: boolean` that is set/cleared atomically within the termination promise. Remove `sleep(0)` by ensuring `rejectAllPending` resolves synchronously (it already does — the pending map is cleared immediately). The concurrency guard at line 386-389 (await existing termination) can stay, but the try/finally wrapper can be eliminated by having the IIFE set `termination = null` and `shuttingDown = false` itself. Target: ~10 line reduction with one less state variable. |
| F80 | P2 | over-engineering | normalizeProviderForFactory 3-line single-call helper | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:98-104` | `over-engineering:execution-router:normalizeproviderforfactory-single-call` | Inline the api→openai mapping into `DirectProviderAdapter.getProvider()`. Alternatively, fold it into the existing `normalizeProvider` function if the mapping is a general contract (i.e., `api` should always normalize to `openai`). |
| F81 | P2 | over-engineering | yieldToEventLoop wraps setImmediate in a promise called once | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:117-121` | `over-engineering:reindex:yieldtoeventloop-single-call-setimmediate` | Inline `await new Promise(r => setImmediate(r))` at line 390. Remove `yieldToEventLoop()`. 4-line reduction, zero behavioral change. |
| F82 | P2 | over-engineering | setJobStatus constructs SQL dynamically with string interpolation | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:166-189` | `over-engineering:reindex:setjobstatus-dynamic-sql-construction` | Replace with two static prepared statements: one for status-only updates (`SET status, updated_at`) and one with progress fields (`SET status, updated_at, processed, error`). Callers pick the appropriate function. Alternatively, use a single static statement that always sets `processed` and `error` (passing current values for no-change updates), trading one extra write for simplicity. The SQL string interpolation is the primary concern; removing it eliminates a potential injection vector and clarifies the update contract. |
| F83 | P2 | over-engineering | Schema module chain of 4 single-call helpers | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:49-53,70-83,85-95,111-114,116-121` | `over-engineering:schema:single-call-helper-chain` | Inline `normalizeProvider` into `readActiveEmbedderIfValid` (the 4-way comparison reads clearer at the use site). Inline `getDatabaseName` into `resolveAutoSelectLockPath`. Keep `validateDim` (2 callers, safety-critical guard) and `resolveAutoSelectLockPath` (non-trivial path construction logic). `readActivePointerRows` is borderline — it encapsulates a SQL query pattern; consider whether the pattern merits extraction or if the SQL reads more clearly inline. |
| F84 | P2 | over-engineering | sleep() single-call Promise-wrapping-setTimeout helper | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:131-136` | `over-engineering:sidecar-client:sleep-single-call-settimeout-wrapper` | Inline the yield at line 400: `await new Promise(r => setImmediate(r))`. Remove the `sleep()` function. The `unref()` call is redundant for `ms=0`. If a general-purpose sleep utility is desired, move it to a shared utility module where it can serve 3+ callers. |
| F85 | P1 | security | healthPayload in ensure-rerank-sidecar.cjs accumulates HTTP body unbounded | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:36-49` | `security:ensure-rerank-sidecar:healthpayload-unbounded-body-accumulation` | Add a maximum body size limit (e.g., 64KB) to the response accumulation. If `body.length` exceeds the limit, `req.destroy()` and resolve null. Match the Python implementation's 8192-byte read cap. |
| F86 | P1 | security | SidecarClient.embed() accepts unbounded input array enabling resource exhaustion | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:238-270,433-473` | `security:sidecar-client:unbounded-embed-input-array-resource-exhaustion` | Add a maximum batch size limit (e.g., 500 texts) to the `embed()` method. Validate `texts.length` before the copy and worker dispatch, rejecting oversized batches with a clear error. |
| F87 | P1 | security | Sidecar-worker has no input array length validation enabling worker memory exhaustion | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:105-132,151-175` | `security:sidecar-worker:unbounded-embed-input-array-worker-resource-exhaustion` | Add a maximum input length (e.g., 500) to `parseRequest`. Alternatively, implement streaming response where vectors are written one at a time rather than accumulated. Match the proposed client-side limit for defense-in-depth. |
| F88 | P1 | security | processLiveness in ensure-rerank-sidecar.cjs defaults unknown errors to 'alive' | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:178-187` | `security:ensure-rerank-sidecar:processliveness-incorrect-default-alive-fallthrough` | Add an explicit comment documenting why unknown errors are treated as alive (following the Python implementation's precedent). Consider adding a `process.stderr.write` warning for unexpected error codes to aid debugging. Alternatively, treat unknown errors as a distinct state (e.g., `'unknown'`) and refuse to reuse sidecars in that state. |
| F89 | P2 | security | Unvalidated RERANK_SIDECAR_STATE_DIR enables path traversal to arbitrary directories | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:97-100` | `security:ensure-rerank-sidecar:statdir-unvalidated-env-path-traversal-risk` | Validate `RERANK_SIDECAR_STATE_DIR` against an allowlist of known-safe directories (e.g., must be under `$HOME/.cache` or `$TMPDIR`). Alternatively, enforce that the configured path must be an absolute path under a known safe prefix. Both implementations should use consistent resolution (`expanduser` + `resolve`). |
| F90 | P2 | security | Execution router caches adapter instances indefinitely without credential rotation | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:30-31,204-228` | `security:execution-router:stale-credential-caching-no-rotation` | Add an invalidation mechanism: periodically re-read environment variables and recreate adapters when credentials change. Alternatively, add a TTL-based cache and force re-creation after a configurable interval. At minimum, document that credential rotation requires MCP server restart. |
| F91 | P1 | simplification | Sidecar-client embed() nested validation cascade can be consolidated | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:238-270` | `simplification:sidecar-client:embed-nested-validation-cascade` | Extract the validation logic into a helper function and consolidate the checks: function validateEmbeddingResponse(response: SidecarEmbeddingResponse, expectedDim: number, inputCount: number): void { if (response.dimensions !== expectedDim) { throw new Error(`Sidecar embedding dimension mismatch: expected ${expectedDim}, got ${response.dimensions}`); } if (response.vectors.length !== inputCount) { throw new Error(`Sidecar returned ${response.vectors.length} embeddings for ${inputCount} inputs`); } for (const vector of response.vectors) { if (vector.length !== expectedDim) { throw new Error(`Sidecar vector dimension mismatch: expected ${expectedDim}, got ${vector.length}`); } } } async embed(texts: ReadonlyArray<string>, options: SidecarEmbedOptions = {}): Promise<Float32Array[]> { if (texts.length === 0) { return []; } await this.ensureHealthyWorker(); this.lastRequestAt = Date.now(); this.requestCount += 1; this.scheduleIdleEviction(); const response = await this.sendRequest<SidecarEmbeddingResponse>({ type: 'embed', input: [...texts], model: this.name, dimensions: this.dim, inputType: options.inputType ?? 'document', }); validateEmbeddingResponse(response, this.dim, texts.length); return response.vectors.map((vector) => new Float32Array(vector)); } This reduces the method from 33 lines to ~25 lines and separates validation from transformation. |
| F92 | P2 | simplification | Ensure-rerank-sidecar loadOrCreateOwnerToken nested try-catch can be flattened | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:106-127` | `simplification:ensure-rerank-sidecar:loadcreatetoken-nested-try-catch` | Flatten the nested try-catch into a linear sequence: function loadOrCreateOwnerToken(dir, fsModule, processObj) { const explicit = String(processObj.env.RERANK_SIDECAR_OWNER_TOKEN \|\| '').trim(); if (explicit) return explicit; fsModule.mkdirSync(dir, { recursive: true, mode: 0o700 }); const tokenPath = ownerTokenPath(dir); // Try to read existing token try { const existing = fsModule.readFileSync(tokenPath, 'utf8').trim(); if (existing) return existing; } catch (error) { if (error.code !== 'ENOENT') throw error; } // Create new token atomically const token = crypto.randomBytes(24).toString('base64url'); try { fsModule.writeFileSync(tokenPath, `${token}\n`, { mode: 0o600, flag: 'wx' }); return token; } catch (error) { if (error.code !== 'EEXIST') throw error; // Race condition: another process created the token, read it back const existing = fsModule.readFileSync(tokenPath, 'utf8').trim(); if (!existing) throw error; return existing; } } While this looks similar to the original, the key simplification is removing the nesting by using early returns and linear flow. The current implementation has the second try-catch nested inside the first's catch block, which is unnecessary since the second try-catch is independent of the first's success path. |
| F93 | P2 | simplification | Reindex runJob nested cancellation checks can be consolidated | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:343-416` | `simplification:reindex:runjob-nested-cancellation-checks` | Remove the redundant cancellation check after the loop: async function runJob(db: Database.Database, jobId: string): Promise<void> { const initialJob = selectJob(db, jobId); if (!initialJob \|\| initialJob.status === 'completed' \|\| initialJob.status === 'failed' \|\| initialJob.status === 'cancelled') { return; } const manifest = getManifest(initialJob.toName); if (!manifest) { setJobStatus(db, jobId, 'failed', undefined, `UNKNOWN_EMBEDDER: ${initialJob.toName}`); return; } const adapter = getEmbedderAdapter(manifest.backend, initialJob.toName, initialJob.toDim); const targetProfile = new EmbeddingProfile({ provider: manifest.backend, model: manifest.name, dim: manifest.dim, dtype: null, baseUrl: null, }); ensureVecTableForDim(db, initialJob.toDim); const tableName = vecTableNameForDim(initialJob.toDim); const batchSize = getBatchSize(); let processed = initialJob.processed; try { setJobStatus(db, jobId, 'running'); while (processed < initialJob.total) { if (getCancellationStatus(db, jobId) === 'cancelled') { return; } const rows = selectMemoryBatch(db, processed, batchSize); if (rows.length === 0) { break; } const embeddings = await adapter.embed(rows.map(memoryText)); if (embeddings.length !== rows.length) { throw new Error(`Embedder returned ${embeddings.length} embeddings for ${rows.length} memories`); } writeVectors(db, tableName, rows, embeddings); writeVectorsToShard(db, targetProfile, tableName, rows, embeddings); processed += rows.length; setJobStatus(db, jobId, 'running', processed); await yieldToEventLoop(); } // Loop completed normally (not cancelled), proceed to completion const complete = db.transaction(() => { setActiveEmbedder(db, initialJob.toName, initialJob.toDim); setJobStatus(db, jobId, 'completed', initialJob.total); }); complete(); if (getDatabaseDir(db)) { attachActiveVectorShard(db, targetProfile); } } catch (error: unknown) { const message = error instanceof Error ? error.message : String(error); setJobStatus(db, jobId, 'failed', processed, message); logger.error('embedder reindex job failed', { event: 'embedder_reindex_failed', jobId, toName: initialJob.toName, processed, total: initialJob.total, error: message, }); } } This removes the redundant cancellation check at line 393. The loop already checks cancellation at each iteration, so if the loop exits normally, the job was not cancelled. |
| F94 | P1 | refinement | Sidecar-worker error responses for pre-parse failures use id=0, silently dropped by client | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:207-218` | `refinement:sidecar-worker:error-response-id-zero-dropped-by-client` | Initialize `requestId` to a sentinel like `-1` and, in the catch block, check if `requestId` is still the sentinel. If so, attempt to parse the raw line for an `id` field before writing the error response. If no `id` can be recovered, skip writing the error response entirely (the client has no pending request to associate it with). Alternatively, parse the `id` from the raw JSON before the full parseRequest for safety. |
| F95 | P1 | refinement | Cached rejected provider promise persists indefinitely in both adapter paths | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:138-149` | `refinement:embedders:cached-rejected-provider-promise-no-recovery` | In both locations, wrap the cached promise: on resolution, return the resolved provider; on rejection, null out the cache and re-throw so the next call retries. For DirectProviderAdapter, also consider adding a `clearCache()` or `reset()` method that evicts the adapter from `directAdapters` on persistent failure. Alternatively, add a jittered retry with exponential backoff at the `getProvider` level. |
| F96 | P2 | refinement | Manual SQL escaping via string replace instead of parameterized queries in writeVectorsToShard | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:305-306` | `refinement:reindex:write-vector-shard-manual-sql-escaping` | Split the DDL from the data insertion: execute `CREATE TABLE IF NOT EXISTS` and `INSERT OR REPLACE` separately. Use `shard.prepare('INSERT OR REPLACE INTO vec_metadata (key, value) VALUES (?, ?)').run('provider', profile.provider)` for the INSERT statements. Keep `CREATE TABLE` as exec since `tableName` is safe. This eliminates the manual escaping and aligns with the rest of the codebase. |
| F97 | P2 | refinement | Inconsistent dimensions vs dim naming across options interface, response type, and stored field | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:23,55,226,256` | `refinement:sidecar-client:dimensions-vs-dim-naming-inconsistency` | Queue targeted remediation for "Inconsistent dimensions vs dim naming across options interface, response type, and stored field" and preserve current behavior with focused tests. |
| F98 | P2 | refinement | runJob silently exits on cancellation with no log entry | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:371-374,393-394` | `refinement:reindex:runjob-cancellation-silent-exit-no-logging` | Add a `logger.info('embedder reindex job cancelled', { event: 'embedder_reindex_cancelled', jobId, toName: initialJob.toName, processed, total: initialJob.total })` at both cancellation return sites. Keep it at `info` level since cancellation is an intentional operation, not an error. |
| F99 | P2 | refinement | sendRequest resolves pending promise with unsafe value-as-T type assertion | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:457-458` | `refinement:sidecar-client:sendrequest-resolve-unsafe-cast` | Queue targeted remediation for "sendRequest resolves pending promise with unsafe value-as-T type assertion" and preserve current behavior with focused tests. |
| F100 | P2 | refinement | parseRequest uses premature type assertion before runtime validation | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:106` | `refinement:sidecar-worker:parserequest-premature-type-assertion-before-validation` | Change line 106 to: `const parsed: unknown = JSON.parse(line);` (or `JSON.parse(line) as unknown`). Then use explicit type guards: `if (typeof parsed !== 'object' \|\| parsed === null) throw ...`. Extract `const id = (parsed as Record<string, unknown>).id;` only after validation. This makes the validation the single gatekeeper and eliminates the need for subsequent `as` casts. |
| F101 | P1 | drift | Health payload body size limit drift between JS and Python implementations | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:36-49` | `drift:ensure-rerank-sidecar:health-payload-body-size-limit-drift` | Either (a) remove the 8192 byte limit from the Python implementation to match the JavaScript behavior, or (b) add a matching size limit to the JavaScript implementation and document the maximum expected response size. Given that health check responses are typically small, removing the limit from Python is the safer choice to prevent future truncation issues. |
| F102 | P1 | drift | Process liveness error handling drift between JS and Python implementations | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:178-187` | `drift:ensure-rerank-sidecar:process-liveness-error-handling-drift` | Align the error handling logic between both implementations. Either (a) document that both implementations default to 'alive' for any error that is not explicitly ESRCH/EPERM, or (b) expand the JavaScript implementation to handle additional error codes that Python's OSError catch-all would include. The current drift is subtle but can lead to different behavior on edge cases. |
| F103 | P2 | drift | Log file open mode drift between JS and Python implementations | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:89` | `drift:ensure-rerank-sidecar:log-file-open-mode-drift` | Align the file open mode between both implementations. Since the log data is text, both should use text mode ('a' in JS, 'a' in Python) or both should use binary mode with explicit encoding. The current drift is a quality issue that can lead to inconsistent log file behavior across platforms. |
| F104 | P2 | drift | Temp file naming pattern drift between JS and Python implementations | `.opencode/bin/lib/ensure-rerank-sidecar.cjs:167` | `drift:ensure-rerank-sidecar:temp-file-naming-pattern-drift` | Align the temp file naming pattern between both implementations. Either (a) adopt the Python `tempfile.mkstemp` pattern in JavaScript (using a similar library or manual implementation), or (b) document the different naming conventions and their rationale. The current drift is a maintainability issue that makes cross-language debugging harder. |
| F105 | P1 | dead-code | Dead cancellation-polling branches in reindex runJob loop | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:372,393` | `dead-code:reindex:runcancellation-check-branches-unreachable` | Remove both `getCancellationStatus(db, jobId) === 'cancelled'` checks and the `getCancellationStatus` helper. Since `cancelJob` will eventually be wired to an MCP tool (see finding 41 remediation), the checks can be re-added at that time. Until then, they are misleading dead code that incurs per-batch DB overhead. |
| F106 | P2 | dead-code | ActiveEmbedder barrel type export has zero importers | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:25` | `dead-code:index-barrel:activeembedder-type-zero-importers` | Queue targeted remediation for "ActiveEmbedder barrel type export has zero importers" and preserve current behavior with focused tests. |
| F107 | P2 | dead-code | ReindexJobStatus barrel type export has zero importers | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:35` | `dead-code:index-barrel:reindexjobstatus-type-zero-importers` | Queue targeted remediation for "ReindexJobStatus barrel type export has zero importers" and preserve current behavior with focused tests. |
| F108 | P2 | dead-code | StartReindexOptions barrel type export has zero external consumers | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:35` | `dead-code:index-barrel:startreindexoptions-type-zero-external-consumers` | Queue targeted remediation for "StartReindexOptions barrel type export has zero external consumers" and preserve current behavior with focused tests. |
| F109 | P2 | dead-code | EmbedderManifest barrel type export has zero production consumers | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:9` | `dead-code:index-barrel:embeddermanifest-type-zero-production-consumers` | Queue targeted remediation for "EmbedderManifest barrel type export has zero production consumers" and preserve current behavior with focused tests. |
| F110 | P2 | dead-code | writeVectorsToShard null-databaseDir early-return dead in production | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:278-281` | `dead-code:reindex:writevectorstoshard-null-databasedir-early-return-production-dead` | Queue targeted remediation for "writeVectorsToShard null-databaseDir early-return dead in production" and preserve current behavior with focused tests. |
<!-- /ANCHOR:appendix -->

## Commit Handoff

- Suggested commit: `research(010/001): sidecar investigation — 20 iters, 110 findings across 6 angles`
- Changed/created files:
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/015-deep-research-drift-and-simplification/research/research.md`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/015-deep-research-drift-and-simplification/research/deep-research-state.jsonl`
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/015-deep-research-drift-and-simplification/implementation-summary.md`
