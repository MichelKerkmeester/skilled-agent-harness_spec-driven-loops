# Iteration 012 — refinement (executor: cli-opencode-deepseek-v4-pro)

## Metadata
- Iteration: 12 of 20
- Angle: refinement
- Executor: cli-opencode-deepseek-v4-pro
- Timestamp: 2026-05-22T23:30:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts`
- Cumulative findings before this iter: 60

## Summary
Second refinement pass on the embedder sidecar surface. Focused on type precision (unsafe assertions, imprecise fallback), naming quality (misleading class name), structural clarity (god functions, mixed concerns), return-type semantics, and stale comments. Found 8 novel findings: 2 P1 (unsafe type assertion in response handler, unconditional fallback in resolveDimensions returning potentially wrong dimensions) and 6 P2 (misleading class name, fragile type assertion, super-function with mixed concerns, mixed return type, god function, stale phase-plan comments). All findings are novel — zero overlap with prior refinement iteration (006, findings 30-36) or any other iteration.

## New Findings

### P0 — Blockers
None

### P1 — Required

**Title: `resolveDimensions` unconditional fallback returns potentially wrong dimensions**
- **Fingerprint:** `refinement:execution-router:resolvedimensions-unconditional-fallback`
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
      return profile.dim;
    }
    return profile.dim;  // UNCONDITIONAL — always returns startup profile dim
  }
  ```
- **Reasoning:** The final fallback at line 95 unconditionally returns the startup embedding profile's dimensions, even when the requested provider/model do NOT match the startup profile. If a caller requests `provider: 'voyage'`, `model: 'voyage-3'` (1024 dimensions) and the startup profile is configured for `openai / text-embedding-3-small` (1536 dimensions), the function silently returns 1536 — the wrong dimension. This causes downstream embedding mismatches: the embedder will produce vectors of one dimension while the database schema expects another, leading to broken search results. The preceding `if` check at lines 91-93 confirms the match before returning, but line 95 bypasses that guard entirely. The function should either throw when no match is found (making the caller explicitly provide dimensions) or return a known-safe default with a warning. Finding 52 (over-engineering, iter 10) noted that the 3rd level is "dead" because the 4th level always returns the same value regardless of match — this refinement finding identifies the correctness implication: the unconditional fallback is not just redundant, it's silently incorrect for non-matching providers.
- **Suggested remediation:** Change line 95 from `return profile.dim` to either `throw new Error(...)` requiring explicit dimensions, or log a warning and return a safe default like 768 (the industry minimum). The safest fix: after the startup profile match check fails, throw `new Error(\`Cannot resolve dimensions for ${provider}:${model} — no manifest found and startup profile (${profile.provider}:${profile.model}) does not match\`)`.
- **Severity rationale:** P1 — This produces silently wrong embedding dimensions when provider/model differs from the startup profile without explicit dimension overrides. The blast radius is bounded (requires a non-default provider/model configuration without setting dimensions), but when triggered, the failure mode is silent data corruption (vectors of wrong dimension stored in index, breaking recall). Debugging would require tracing through the fallback chain to discover the dimension mismatch.

**Title: `handleResponseLine` unsafe type assertion bypasses discriminator check**
- **Fingerprint:** `refinement:sidecar-client:handleresponseline-unsafe-type-assertion`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:490-519`
- **Evidence:**
  ```typescript
  private handleResponseLine(line: string): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch (error: unknown) { ... return; }

    if (!responseHasId(parsed)) { return; }        // checks { id: number }

    const pending = this.pending.get(parsed.id);
    if (!pending) { return; }

    this.pending.delete(parsed.id);
    if (pending.timer) { clearRegisteredTimer(pending.timer); }

    const response = parsed as SidecarResponse;     // UNSAFE — no type check
    if (response.type === 'error') {                // only 'error' discriminated
      pending.reject(new Error(response.message));
      return;
    }
    pending.resolve(response);                      // resolves any non-error type
  }
  ```
- **Reasoning:** The function validates that the parsed JSON has an `id: number` via `responseHasId()`, then casts directly to `SidecarResponse` via `parsed as SidecarResponse` at line 513. The only discriminator check is for `'error'` type at line 514. If a malformed or malicious response arrives with a valid `id` but an unknown `type` (e.g., `type: 'bogus'`), it passes through and is resolved as success at line 518. The caller (`sendRequest`) expects a typed `SidecarResponse` — if the resolved value lacks `.vectors` or `.dimensions`, the destructuring in `embed()` at lines 256-268 will throw a runtime TypeError. The unsafe cast also undermines TypeScript's type narrowing: the `parsed` variable retains type `unknown`, but the cast tells the compiler it's fully typed `SidecarResponse` without runtime verification. A proper discriminator check for all three known types (`'embedding'`, `'pong'`, `'error'`) would catch unknown types before they reach the caller. This is distinct from finding 12 (security: unbounded JSON parsing resource exhaustion) which concerns memory/CPU DoS — this is about type-safety and graceful error handling for malformed-but-valid-JSON responses.
- **Suggested remediation:** After the `responseHasId` check, extract `type` from `parsed` as a string, match against known discriminators (`'embedding' | 'pong' | 'error'`), and reject unknown types with an explicit error message. E.g.:
  ```typescript
  const responseType = (parsed as { type?: unknown }).type;
  if (responseType !== 'embedding' && responseType !== 'pong' && responseType !== 'error') {
    pending.reject(new Error(`Unknown sidecar response type: ${String(responseType)}`));
    return;
  }
  const response = parsed as SidecarResponse;
  ```
- **Severity rationale:** P1 — The unsafe cast violates the type-narrowing contract between the sidecar worker and client. While the sidecar worker (our code) will never emit an unknown type, the defense-in-depth principle requires the client to reject malformed responses gracefully rather than passing them to callers that will crash. In a refactoring scenario where the sidecar worker protocol evolves, this missing check would silently swallow invalid new message types.

### P2 — Suggestions

**Title: `DirectProviderAdapter` class name misleads — delegates to registry adapter for ollama**
- **Fingerprint:** `refinement:execution-router:directprovideradapter-misleading-name`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:130-198`
- **Evidence:**
  ```typescript
  class DirectProviderAdapter implements EmbedderAdapter {
    ...
    private readonly registryAdapter: EmbedderAdapter | undefined;

    constructor(private readonly provider: string, model: string, dimensions: number) {
      ...
      this.registryAdapter = normalizeProvider(provider) === 'ollama'
        ? getAdapter(model)           // ollama: delegates to registry
        : undefined;                   // non-ollama: calls factory directly
    }

    async embed(texts, options) {
      if (this.registryAdapter) {
        // DELEGATION path: ollama
        return adapter.embed(texts, options);
      }
      // DIRECT path: sentence-transformers, openai, voyage
      const provider = await this.getProvider();
      ...
    }
  }
  ```
- **Reasoning:** The class name `DirectProviderAdapter` signals "direct provider access," but for ollama backends the `embed()` and `ready()` methods delegate to a registry adapter (`this.registryAdapter`). The naming contradicts the implementation: there are two execution paths (direct factory call vs. registry delegation), and "Direct" describes only one. A developer encountering this class for the first time would reasonably assume all providers are accessed via the factory pattern, only to discover the ollama special case. The misleading name adds cognitive friction during code review and debugging.
- **Suggested remediation:** Rename to `ProviderBackedAdapter` (reflects both paths: provider-backed for direct, registry-backed for ollama) or `EmbedderAdapterImpl`. Alternatively, extract the ollama delegation into a separate `OllamaDelegatingAdapter` class and keep `DirectProviderAdapter` purely for the factory path, eliminating the dual-path ambiguity.
- **Severity rationale:** P2 — Purely a naming/readability issue. The behavior is correct, but the misleading name creates a comprehension hurdle for new readers. Zero functional impact, easy to fix.

**Title: `DirectProviderAdapter.embed` uses fragile type assertion for ollama delegation path**
- **Fingerprint:** `refinement:execution-router:directprovideradapter-fragile-type-assertion`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:154-158`
- **Evidence:**
  ```typescript
  if (this.registryAdapter) {
    const adapter = this.registryAdapter as EmbedderAdapter & {
      embed: (input: ReadonlyArray<string>, opts?: EmbedOptions) => Promise<Float32Array[]>;
    };
    return adapter.embed(texts, options);
  }
  ```
- **Reasoning:** The type assertion widens `EmbedderAdapter` (which already defines `embed()` returning `Promise<Float32Array[]>`) with an intersection that redundantly re-declares `embed()`. This assertion serves no purpose — `EmbedderAdapter.embed()` already has a compatible signature, so `this.registryAdapter.embed(texts, options)` would compile and work identically. The redundant assertion adds visual noise and suggests that `EmbedderAdapter` might not have an `embed` method, which is incorrect. If the registry adapter's interface were to change (e.g., `embed()` gains a third parameter or changes return type), this assertion would silently coerce rather than producing a compile-time error at the call site. The `as` cast also suppresses type-checking on the specific `embed` overload — any signature mismatch would be hidden.
- **Suggested remediation:** Remove the type assertion entirely: `return this.registryAdapter.embed(texts, options);`. The `EmbedderAdapter` interface (at `adapter.ts:10`, re-exported from `@spec-kit/shared`) already guarantees the `embed` method exists with a compatible signature. If a return-type coercion is needed for the ollama-specific adapter, handle it as a post-call transformation rather than a pre-call type assertion.
- **Severity rationale:** P2 — The assertion is currently harmless (the widened type matches the actual interface) but it brittles the code against interface changes and misleads readers about what `EmbedderAdapter` provides. Easy to fix with no behavioral change.

**Title: `writeVectorsToShard` is a 60-line function with mixed concerns**
- **Fingerprint:** `refinement:reindex:writevectorstoshard-mixed-concerns`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:271-330`
- **Evidence:** The function at lines 271-330 performs, in sequence: (1) resolve database directory, (2) open a new shard database connection, (3) set WAL journal mode, (4) conditionally load sqlite-vec extension with fallback, (5) execute 3 CREATE TABLE + 1 INSERT OR REPLACE DDL statements via shard.exec(), (6) conditionally create a virtual table, (7) call writeVectors, (8) conditionally call writeVectorsToKnn, (9) close the shard in a finally block. These are 4 distinct concerns (connection management, schema DDL, extension loading, vector writing) that should be decomposed.
- **Reasoning:** The function violates the single-responsibility principle. Opening a database connection (concern: lifecycle), executing DDL (concern: schema), loading an extension (concern: feature detection), and writing vectors (concern: data) are separate responsibilities. A developer fixing a schema DDL bug must read through connection management and extension loading code. A developer adding error handling for extension loading must navigate past vector writing logic. The 60-line length also exceeds common readability thresholds and makes the function harder to unit test (all concerns are tightly coupled).
- **Suggested remediation:** Extract `prepareVectorShard(shard, profile)` (handles schema + extension loading) and `openVectorShard(db, profile, tableName)` (handles connection + directory resolution). Keep `writeVectorsToShard` focused on the orchestration: `const shard = openVectorShard(db, profile, tableName); try { prepareVectorShard(shard, profile); ... writeVectors(shard, tableName, rows, embeddings); } finally { shard.close(); }`.
- **Severity rationale:** P2 — The function works correctly but structural decomposition would improve testability, readability, and maintainability. Low risk, moderate refactor effort (extracting 2-3 helpers).

**Title: `openSidecarLogFd` returns mixed `number | 'ignore'` return type**
- **Fingerprint:** `refinement:ensure-rerank-sidecar:openLogFd-mixed-return-type`
- **File(s):** `.opencode/bin/lib/ensure-rerank-sidecar.cjs:81-95`
- **Evidence:**
  ```javascript
  function openSidecarLogFd(fsModule, osModule) {
    const candidates = [ ... ];
    for (const cacheDir of candidates) {
      try {
        fsModule.mkdirSync(cacheDir, { recursive: true });
        return fsModule.openSync(path.join(cacheDir, 'sidecar.log'), 'a');  // returns number
      } catch { ... }
    }
    return 'ignore';  // returns string
  }
  ```
  Consumed at line 251:
  ```javascript
  const child = spawnFn('bash', [startScriptPath], {
    stdio: ['ignore', logFd, logFd],  // logFd is number | 'ignore'
  });
  ```
- **Reasoning:** The function name `openSidecarLogFd` promises to return a file descriptor ("Fd"). When it can't open a log file, it returns the string `'ignore'`. This works because Node's `spawn` stdio accepts both `number` (fd) and `'ignore'` (string), but the semantic mismatch is confusing: a function suffixed "Fd" returning a string breaks the caller's mental model. The mixed return type also complicates TypeScript migration (if this file is ever converted) since callers would need to narrow `number | 'ignore'` before using the value. A sentinel approach (return `-1` and check at the call site) or a separate function (`resolveLogStdio()`) would be cleaner.
- **Suggested remediation:** Return `null` or `-1` from `openSidecarLogFd` on failure, and handle the fallback at the call site: `const logFd = openSidecarLogFd(...); const stdio = ['ignore', logFd !== null ? logFd : 'ignore', ...];`. Alternatively, rename to `resolveSidecarLogStdio()` to signal the mixed return.
- **Severity rationale:** P2 — The behavior is correct (Node accepts both values), but the misleading function name and mixed return type create cognitive overhead. Zero functional impact, easy to fix.

**Title: `ensureRerankSidecar` is a 77-line god function with 7+ distinct concerns**
- **Fingerprint:** `refinement:ensure-rerank-sidecar:ensurereranksidecar-god-function`
- **File(s):** `.opencode/bin/lib/ensure-rerank-sidecar.cjs:211-287`
- **Evidence:** The function at lines 211-287 handles, in sequence: (1) dependency injection destructuring (line 212-217), (2) port resolution (line 218), (3) timeout resolution (line 219), (4) cross-encoder disabled check (lines 220-232), (5) owner token creation (line 227), (6) config hash computation (line 228), (7) reusable sidecar lookup (line 234), (8) existing-port health check (lines 239-241), (9) script existence check (lines 243-246), (10) process spawning with log fd (lines 248-268), (11) ledger recording (lines 260-268), (12) warmup wait with timeout (lines 270-274), (13) cleanup on warmup failure (lines 275-283). That's 13 distinct sub-concerns in a single function.
- **Reasoning:** The function is the primary entry point for the rerank sidecar subsystem but packs all decision-making, orchestration, and side effects into one function. To understand how port resolution works, a developer must scroll past owner token logic. To add a new health check condition, a developer must navigate past process spawning code. The function's length (77 lines) and concern density make it a maintenance hazard — any modification risks unintended side effects on unrelated sub-concerns. This is especially problematic in a CJS file without TypeScript type safety to catch refactoring errors.
- **Suggested remediation:** Extract 3 focused helpers: `resolveEnsureConfig(options, deps)` → returns `{ port, timeoutMs, ledgerDir, ownerToken, configHash, ... }`; `tryReuseOrSpawnSidecar(config, deps)` → returns `{ spawned, port, ownerPid, ... }`; `waitForSidecarReady(child, config, deps)` → returns `{ ok, ... }`. Let `ensureRerankSidecar` become a 15-line orchestrator calling these 3 helpers. This mirrors the structure already used in `sidecar-client.ts` (separate `ensureWorker`, `ping`, `restartWorker`).
- **Severity rationale:** P2 — The function works today but its size and concern density directly impede maintenance velocity. The decomposition mirrors patterns already established in the TypeScript sidecar client, making it a low-risk, high-clarity improvement.

**Title: `index.ts` barrel file has stale phase-plan comments describing already-completed work as future**
- **Fingerprint:** `refinement:index-barrel:stale-phase-comments`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts:4-6`
- **Evidence:**
  ```typescript
  // Packet 016/001: re-exports for external consumers.
  // Phase 016/002 will add: ollama adapter, schema helpers, getAdapter().
  // Phase 016/003 will add: MCP tool handlers + reindex orchestrator.
  ```
  All three "future" phases are already implemented in the current barrel:
  - "ollama adapter" → exported at lines 37-43 (`OllamaAdapter`, `OllamaAdapterError`, etc.)
  - "schema helpers, getAdapter()" → exported at lines 12, 19-24
  - "reindex orchestrator" → exported at lines 27-35 (`startReindex`, `cancelJob`, etc.)
- **Reasoning:** The comments describe a planned-but-not-yet-implemented state from a prior packet (016). Every referenced phase has been completed and the exports are live. The stale comments mislead readers about what the barrel currently provides: a developer skimming the header might reasonably conclude the barrel is incomplete and look elsewhere for reindex or ollama exports. This is the "removing comments that lie" refinement tenet — the comments describe an intent that no longer matches reality. The `adapter.ts`, `types.ts`, and `registry.ts` re-export shims similarly have phase-plan comments but those correctly describe "Phase 003/006 of the 016 umbrella moved the contract surface" — only `index.ts` has forward-looking comments that have become stale.
- **Suggested remediation:** Replace lines 4-6 with a single descriptive comment: `// Barrel re-exports for all embedder subsystem consumers (adapters, schema, reindex).` or simply remove the stale phase comments. The descriptive module header at line 1-3 already identifies the file's purpose.
- **Severity rationale:** P2 — Stale comments only mislead, with zero functional impact. A single-line edit with no risk of regression.

## Convergence Signal
- New findings this iter: 8
- Cumulative finding count after iter: 68
- New-findings ratio: 0.118
- Continue / converged signal: `continue` (ratio > 0.10; second refinement pass still yielding substantial novel findings)

## Files Touched (this iter)
- `iterations/iteration-012.md`
- `deltas/iter-012.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
