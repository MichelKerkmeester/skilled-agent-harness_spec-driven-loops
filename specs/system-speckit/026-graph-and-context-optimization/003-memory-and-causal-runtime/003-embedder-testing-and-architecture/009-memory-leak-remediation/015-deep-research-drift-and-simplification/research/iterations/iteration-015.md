# Iteration 015 — security (executor: cli-opencode-deepseek-v4-pro)

## Metadata
- Iteration: 15 of 20
- Angle: security
- Executor: cli-opencode-deepseek-v4-pro
- Timestamp: 2026-05-23T01:00:00Z
- Files reviewed deepest:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts`
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs`
  - `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`
  - `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts`
- Cumulative findings before this iter: 84

## Summary
Third security pass covering the full sidecar surface (~2,500 LOC across TypeScript, JavaScript, and Python). Focused on resource exhaustion vectors beyond JSON parsing, cross-implementation liveness-detection asymmetry, unvalidated environment-driven path construction, stale credential caching, and input array bounds. Found 6 novel security issues: 0 P0 (all critical surface already mapped in iters 3 and 9), 4 P1 (healthPayload unbounded body, embed input array unbounded on both client and worker, processLiveness default-fallthrough), and 2 P2 (stateDir path traversal via env, stale adapter credential caching). All findings are novel — no overlap with prior security findings.

## New Findings

### P0 — Blockers

None. The critical resource-exhaustion and temp-file-attack surface was fully mapped in iteration 3 (findings 12-13) and iteration 9 (finding 47).

### P1 — Required

**Title: healthPayload in ensure-rerank-sidecar.cjs accumulates HTTP body unbounded**
- **Fingerprint:** `security:ensure-rerank-sidecar:healthpayload-unbounded-body-accumulation`
- **File(s):** `.opencode/bin/lib/ensure-rerank-sidecar.cjs:36-49`
- **Evidence:**
  ```javascript
  async function healthPayload(port, timeoutMs, deps = {}) {
    const httpModule = deps.http ?? http;
    return new Promise((resolve) => {
      const req = httpModule.get({ host: '127.0.0.1', port, path: '/health', timeout: timeoutMs }, (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          body += chunk;  // No size limit
        });
        res.on('end', () => {
          if (res.statusCode !== 200) {
            resolve(null);
            return;
          }
          try {
            const parsed = JSON.parse(body);
            resolve(parsed && typeof parsed === 'object' ? parsed : null);
          } catch {
            resolve(null);
          }
        });
      });
      // ...
    });
  }
  ```
- **Reasoning:** The `healthPayload` function accumulates the HTTP response body into a string using `body += chunk` without any size limit. A malicious process able to bind to the probed port (localhost:8765) could send an extremely large /health response, exhausting the MCP server's memory. The Python implementation (`ensure_rerank_sidecar.py:82`) explicitly limits reads to 8192 bytes: `response.read(8192)`. The JavaScript version has no such limit. While the /health endpoint is expected to return small JSON payloads, a local attacker who binds to the port before the real sidecar starts could cause memory exhaustion in the MCP launcher.
- **Suggested remediation:** Add a maximum body size limit (e.g., 64KB) to the response accumulation. If `body.length` exceeds the limit, `req.destroy()` and resolve null. Match the Python implementation's 8192-byte read cap.
- **Severity rationale:** P1 — Resource exhaustion from a spoofed local HTTP service is a real but bounded threat requiring local process access. Not P0 because exploitation requires binding to a specific localhost port, which implies existing local code execution.

**Title: SidecarClient.embed() accepts unbounded input array enabling resource exhaustion**
- **Fingerprint:** `security:sidecar-client:unbounded-embed-input-array-resource-exhaustion`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:238-270,433-473`
- **Evidence:**
  ```typescript
  async embed(texts: ReadonlyArray<string>, options: SidecarEmbedOptions = {}): Promise<Float32Array[]> {
    if (texts.length === 0) {
      return [];
    }
    await this.ensureHealthyWorker();
    // ...
    const response = await this.sendRequest<SidecarEmbeddingResponse>({
      type: 'embed',
      input: [...texts],  // No size limit on texts array
      model: this.name,
      dimensions: this.dim,
      inputType: options.inputType ?? 'document',
    });
    // ...
    return response.vectors.map((vector) => {
      // ...
      return new Float32Array(vector);
    });
  }
  ```
- **Reasoning:** The `embed()` method accepts an unbounded `texts` array. There is no validation of array length before passing it to the worker via `sendRequest`. If thousands of texts are provided (e.g., through a large batch embedding request), the process creates a large `[...texts]` copy, sends a multi-MB JSON line through stdin to the worker, the worker allocates embeddings for all texts, and returns a multi-MB response. Each vector at 768 dimensions is ~3KB; 100K texts = ~300MB in memory across both processes. This is an orthogonal resource-exhaustion vector from the JSON parse size issue (finding 12) — even valid, well-formed JSON can exhaust memory through legitimate batch size.
- **Suggested remediation:** Add a maximum batch size limit (e.g., 500 texts) to the `embed()` method. Validate `texts.length` before the copy and worker dispatch, rejecting oversized batches with a clear error.
- **Severity rationale:** P1 — Denial-of-service vector exploitable through the MCP embedding API. While the MCP server controls its own batch sizes, an improperly configured or buggy caller could trigger this path.

**Title: Sidecar-worker has no input array length validation enabling worker memory exhaustion**
- **Fingerprint:** `security:sidecar-worker:unbounded-embed-input-array-worker-resource-exhaustion`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:105-132,151-175`
- **Evidence:**
  ```typescript
  function parseRequest(line: string): WorkerRequest {
    // ...
    if (!isStringArray(candidate.input)) {
      throw new Error('Embed request input must be string[]');
    }
    return {
      id: parsed.id,
      type: 'embed',
      input: candidate.input,  // No length validation
      model: typeof candidate.model === 'string' ? candidate.model : '',
      dimensions: typeof candidate.dimensions === 'number' ? candidate.dimensions : 0,
      inputType: candidate.inputType === 'query' ? 'query' : 'document',
    };
  }

  async function handleEmbed(request: EmbedRequest): Promise<void> {
    const provider = await getProvider(request);
    // ...
    const vectors: number[][] = [];
    for (const input of request.input) {  // Processes ALL inputs sequentially
      const embedding = inputType === 'query'
        ? await provider.embedQuery(input)
        : await provider.embedDocument(input);
      if (!embedding) {
        throw new Error('Provider returned null embedding');
      }
      // ...
      vectors.push(Array.from(embedding));
    }
    writeJson({
      id: request.id,
      type: 'embedding',
      vectors,  // Writes all vectors to stdout at once
      dimensions: request.dimensions,
    });
  }
  ```
- **Reasoning:** The worker's `parseRequest` validates that `input` is a `string[]` but imposes no length limit. The `handleEmbed` function processes all texts sequentially and accumulates all embedding vectors into a single array before writing the response. This means the worker must hold all input texts AND all output vectors in memory simultaneously. The `Array.from(embedding)` call creates a JavaScript number array copy of each Float32Array embedding (~6KB for 768 dimensions in JS number format). Combining with the original text strings and the accumulated vectors array, the memory pressure is ~12KB per text. A batch of 100K texts would consume ~1.2GB in the worker alone. The final `JSON.stringify(payload)` and `process.stdout.write` also materialize the entire response as a single JSON string, creating a third copy.
- **Suggested remediation:** Add a maximum input length (e.g., 500) to `parseRequest`. Alternatively, implement streaming response where vectors are written one at a time rather than accumulated. Match the proposed client-side limit for defense-in-depth.
- **Severity rationale:** P1 — Worker-side resource exhaustion complements the client-side issue (finding above). Defense-in-depth requires validation at both boundaries.

**Title: processLiveness in ensure-rerank-sidecar.cjs defaults unknown errors to 'alive'**
- **Fingerprint:** `security:ensure-rerank-sidecar:processliveness-incorrect-default-alive-fallthrough`
- **File(s):** `.opencode/bin/lib/ensure-rerank-sidecar.cjs:178-187`
- **Evidence:**
  ```javascript
  function processLiveness(pid, processObj) {
    try {
      processObj.kill(pid, 0);
      return 'alive';
    } catch (error) {
      if (error.code === 'ESRCH') return 'dead';
      if (error.code === 'EPERM') return 'eperm';
      return 'alive';  // Default: any other error → alive
    }
  }
  ```
- **Reasoning:** The `processLiveness` function defaults to `'alive'` for any error code other than `ESRCH` or `EPERM`. While ESRCH and EPERM cover the common cases for signal-0 probing, other possible error codes from `process.kill` include `EINVAL` (invalid signal number, theoretically impossible for signal 0), `ENOMEM` (kernel memory exhaustion), or `EBADF` (bad file descriptor — possible in edge-case fd exhaustion scenarios). Treating these as `'alive'` means the `findReusableSidecar` function may attempt to reuse a sidecar whose PID is not actually a running process, or worse — belongs to a different process after PID wrap-around. The Python `process_liveness` in `sidecar_ledger.py:150-161` uses an explicit `OSError` catch for `'alive'` on non-ESRCH, non-EPERM errors, which is a deliberate design choice documented in the codebase. The JavaScript version follows the same semantic but the `return 'alive'` default is less explicit about the rationale and more prone to accidental misuse.
- **Suggested remediation:** Add an explicit comment documenting why unknown errors are treated as alive (following the Python implementation's precedent). Consider adding a `process.stderr.write` warning for unexpected error codes to aid debugging. Alternatively, treat unknown errors as a distinct state (e.g., `'unknown'`) and refuse to reuse sidecars in that state.
- **Severity rationale:** P1 — Incorrect liveness detection in a PID-reuse mechanism can lead to the MCP server interacting with stale or wrong processes. While the practical risk from non-ESRCH/non-EPERM errors is low, the lack of explicit handling creates a maintenance hazard and differs from best-practice liveness detection patterns.

### P2 — Suggestions

**Title: Unvalidated RERANK_SIDECAR_STATE_DIR enables path traversal to arbitrary directories**
- **Fingerprint:** `security:ensure-rerank-sidecar:statdir-unvalidated-env-path-traversal-risk`
- **File(s):** `.opencode/bin/lib/ensure-rerank-sidecar.cjs:97-100`, `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py:107-111`
- **Evidence:**
  ```javascript
  // JS
  function stateDir(processObj, osModule) {
    const configured = String(processObj.env.RERANK_SIDECAR_STATE_DIR || '').trim();
    return configured ? path.resolve(configured) : path.join(osModule.homedir(), '.cache', 'mk-reranker');
  }
  ```
  ```python
  # Python
  def default_state_dir() -> Path:
      configured = os.environ.get("RERANK_SIDECAR_STATE_DIR", "").strip()
      if configured:
          return Path(configured).expanduser()
      return Path.home() / ".cache" / "mk-reranker"
  ```
- **Reasoning:** The `RERANK_SIDECAR_STATE_DIR` environment variable controls where the sidecar ledger file (`.sidecar-ledger.json`), owner token file (`.sidecar-owner-token`), and associated lock files are stored. Both implementations accept this value from the environment without validating it against an allowlist of expected directories. While `path.resolve` normalizes `../` sequences, an attacker who can set this variable could point the state directory to any filesystem location (e.g., `/etc`, `/tmp/attacker-controlled`). The code then creates directories (`mkdirSync` with `recursive: true`), writes files, and in the Python case creates lock files via `fcntl.flock`. If pointed at a shared directory like `/tmp`, an attacker could pre-create the lock file and hold it indefinitely, blocking sidecar initialization. The Python `default_state_dir` uses `.expanduser()` but does not call `.resolve()`, leaving the path relative in some cases where `configured` starts with `~`.
- **Suggested remediation:** Validate `RERANK_SIDECAR_STATE_DIR` against an allowlist of known-safe directories (e.g., must be under `$HOME/.cache` or `$TMPDIR`). Alternatively, enforce that the configured path must be an absolute path under a known safe prefix. Both implementations should use consistent resolution (`expanduser` + `resolve`).
- **Severity rationale:** P2 — Requires environment variable control (implies existing process access). The impact is limited to file writes in attacker-chosen directories, not arbitrary code execution. The Python `expanduser` vs `resolve` inconsistency is a secondary cross-implementation drift.

**Title: Execution router caches adapter instances indefinitely without credential rotation**
- **Fingerprint:** `security:execution-router:stale-credential-caching-no-rotation`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:30-31,204-228`
- **Evidence:**
  ```typescript
  const directAdapters = new Map<string, EmbedderAdapter>();
  const sidecarClients = new Map<string, SidecarClient>();

  export function getEmbedderAdapter(provider: string, model: string, dimensionsOverride?: number): EmbedderAdapter {
    const key = cacheKey(provider, model);
    // ...
    if (shouldUseSidecar(provider)) {
      let client = sidecarClients.get(key);
      if (!client) {
        client = new SidecarClient({ ... });
        sidecarClients.set(key, client);
      }
      return client;  // Returns cached instance even after API key rotation
    }
    let adapter = directAdapters.get(key);
    if (!adapter) {
      adapter = new DirectProviderAdapter(normalizeProvider(provider), model, dimensions);
      directAdapters.set(key, adapter);
    }
    return adapter;  // Returns cached instance
  }
  ```
- **Reasoning:** Both `directAdapters` and `sidecarClients` Maps cache adapter instances for the lifetime of the MCP server process. For `DirectProviderAdapter`, the provider promise is lazy-initialized (line 188: `this.providerPromise = createEmbeddingsProvider(...)`) and once resolved, never invalidated. If API credentials change at the environment level (e.g., `OPENAI_API_KEY` rotates), the running MCP server continues using the old adapter with stale credentials. Embedding requests will fail with authentication errors, but more critically, a revoked key remains "in use" from an audit perspective. The `SidecarClient` has the same issue — its constructor captures `options.env ?? process.env` (line 235), and the env snapshot is never refreshed. Long-running MCP servers could use revoked or rotated credentials indefinitely.
- **Suggested remediation:** Add an invalidation mechanism: periodically re-read environment variables and recreate adapters when credentials change. Alternatively, add a TTL-based cache and force re-creation after a configurable interval. At minimum, document that credential rotation requires MCP server restart.
- **Severity rationale:** P2 — Affects long-running production deployments where credential rotation is a security requirement. Does not directly enable exploitation but violates the principle that revoked credentials should stop working. Mitigation (restart) is straightforward.

## Convergence Signal
- New findings this iter: 6
- Cumulative finding count after iter: 90
- New-findings ratio: 0.067
- Continue / converged signal: `converged` (ratio ≤ 0.10 for 2 consecutive security iterations: iter 9 at 0.098, iter 15 at 0.067)

## Files Touched (this iter)
- `iterations/iteration-015.md`
- `deltas/iter-015.jsonl`
- `findings-registry.json`
- `deep-research-state.jsonl`
- `deep-research-dashboard.md`
