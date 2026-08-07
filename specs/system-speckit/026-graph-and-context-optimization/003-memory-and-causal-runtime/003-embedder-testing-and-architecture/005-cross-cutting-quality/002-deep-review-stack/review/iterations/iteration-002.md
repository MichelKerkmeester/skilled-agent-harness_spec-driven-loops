# Iteration 002 — SECURITY

## Dimension
SECURITY: SSRF, command injection, path traversal, prototype pollution, regex DoS, secret leakage, unvalidated input, unsafe deserialization, missing auth on handlers, race conditions, missing rate limits, eval/Function usage, weak/missing input validation in zod schemas.

## Findings

### P0

#### 008 (P0) — SSRF risk: OLLAMA_BASE_URL not validated before HTTP requests
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts:76-78, 185

**Issue:** `getOllamaBaseUrl()` reads `process.env.OLLAMA_BASE_URL` and uses it directly in `fetch()` calls without validating that the URL is localhost-only. An attacker who can control this environment variable (e.g., via shell escape, env-file injection, or compromised parent process) can cause SSRF attacks against internal services.

**Repro:**
1. Set `OLLAMA_BASE_URL=http://internal-service:8080/admin` before starting the MCP server.
2. Trigger any embedder operation that calls Ollama.
3. The adapter sends `POST http://internal-service:8080/admin/api/embeddings` against the attacker-chosen URL.

**Trust boundary:** Environment variable → unbounded HTTP request

**Recommendation:** Validate the URL is one of: `localhost`, `127.0.0.1`, `::1`, or an explicit operator-set allowlist. Reject otherwise with a clear error.

### P1

#### 009 (P1) — SQL clause string interpolation in lexical backfill (duplicate of iter-1 #007 — confirmed P1 from security lens)
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:272-278

**Issue:** `fetchLexicalBackfillRows` constructs SQL WHERE clauses via `tokens.map(() => \`...\`)` string interpolation. Defense currently relies on `queryTokens` at line 81 normalizing to alphanumeric. If that normalizer is ever loosened, SQL injection becomes possible.

**Repro:** Future change to `queryTokens` regex to permit punctuation immediately exposes injection. Current state: safe by construction but fragile.

**Trust boundary:** User query → tokens → SQL clause

**Recommendation:** Use parameterized placeholders (`?` per token) rather than literal interpolation; bind the tokens as parameters in `prepare(...).all(...args)`.

#### 010 (P1) — Missing input validation length cap on handler args
**File:** .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts:53

**Issue:** `handleEmbedderSet` does `args.name.trim()` but does not validate length. An attacker (or a buggy upstream tool call) could send a 10MB string; the trim allocates a second 10MB string, then the schema layer stores it as the active name.

**Repro:**
1. Invoke `embedder_set` MCP tool with `name = "a".repeat(10_000_000)`.
2. The handler trims, attempts DB write. SQLite TEXT column accepts; subsequent reads paginate or thrash.

**Trust boundary:** MCP tool input → handler argument (unvalidated)

**Recommendation:** Add a max-length guard (e.g., 256) and return a structured validation error before any DB I/O.

### P2

#### 011 (P2 — DOWNGRADED from P1) — Race condition concern on runningJobs Set
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:242-250

**Issue:** Devin flagged the `has/add` pair as non-atomic. In Node's single-threaded event loop, the `has` → `add` block at lines 242-246 executes synchronously without yield, so the race is not exploitable from the JS layer. The `.finally(() => runningJobs.delete(jobId))` cleanup is the actual fragility (covered as iter-1 P2 #005).

**Repro:** No realistic JS-layer repro. Worker-thread or NAPI integration could expose it but is not currently in use.

**Recommendation:** Document the JS-event-loop atomicity assumption; if worker-thread integration is added later, switch to a DB-level lock.

#### 012 (P2) — JSON.parse error path may leak backend internals
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts:249, 257, 278 (throwForEmbeddingResponse)

**Issue:** `throwForEmbeddingResponse(response, body)` constructs an error message including the raw `body` from Ollama. If Ollama returns stack traces or internal paths in its error JSON, these surface to the MCP client.

**Trust boundary:** External backend response → MCP client error

**Recommendation:** Sanitize the body to a single-line summary in production; log full body to local log only.

#### 013 (P2) — Missing rate limiting on embedder handlers
**File:** .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts, embedder-set.ts, embedder-status.ts

**Issue:** No rate limiting on the three handlers. A misbehaving client could spam `embedder_set` causing rapid DB writes + reindex churn.

**Trust boundary:** MCP tool calls → handler execution

**Recommendation:** Token-bucket rate limit at the handler layer, or batch debouncing on `embedder_set` specifically (the only state-changing handler).

#### 014 (P2) — Env-var numeric parsers lack upper-bound validation
**File:** .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:102 (getBatchSize), .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts:40 (getReadyTimeoutMs)

**Issue:** Both functions parse env vars without an upper bound. `MK_EMBEDDER_BATCH_SIZE=999999999` allocates a huge buffer; `MK_EMBEDDER_READY_TIMEOUT_MS=999999999` blocks the handler for ~12 days.

**Recommendation:** Clamp values to documented sane ranges (batch 1-2000, timeout 100-60000 ms).

## Gaps for next iter
- TRACEABILITY of the rescue layer (does it log when it rescues vs punts?)
- MAINTAINABILITY of the embedder stack (cross-file naming, duplication)
- Python-side review (config.py, registered_embedders.py)
- Deep pass on the largest in-scope file (stage2-fusion.ts, 1478 LOC)

---

## Bundle Gate Results (loop manager)
- All cited file:line ranges verified to exist (Check 1+2 PASS).
- #008 SSRF: VERIFIED — getOllamaBaseUrl at line 76-78 reads env var without validation.
- #009 SQL: VERIFIED (duplicate of iter-1 #007, kept here as confirmed-from-security-lens).
- #010 length cap: VERIFIED — line 53 trims without length validation.
- #011 race: PARTIALLY-FALSE-POSITIVE — Node event-loop atomicity covers the synchronous has/add block. DOWNGRADED from P1 to P2 with caveat.
- #012 JSON.parse leakage: VERIFIED — throwForEmbeddingResponse at line 278 includes raw body.
- #013 rate limiting: VERIFIED (architectural observation, not a specific line).
- #014 env-var bounds: VERIFIED — getBatchSize at line 102, getReadyTimeoutMs at line 40 lack upper bounds.
