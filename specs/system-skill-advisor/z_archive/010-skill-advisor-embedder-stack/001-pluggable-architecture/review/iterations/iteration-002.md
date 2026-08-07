# Iter 002 — security — Post-impl review of ed5eb0e56

## 1. SCOPE READ

5 scope files (security-focused per iter spec):

- `lib/embedders/schema.ts` (121 lines) — `setActiveEmbedder` input validation + `vecTableNameForDim` SQL construction
- `lib/embedders/adapters/ollama.ts` (266 lines) — URL handling, model-name handling, JSON parsing
- `lib/embedders/registry.ts` (107 lines) — registry as input boundary (MANIFESTS hard-coded)
- `lib/skill-graph/skill-graph-db.ts` (lines 184-271, 838-911) — `vecTableNameForDim` interpolation into `CREATE TABLE` SQL
- `lib/scorer/lanes/semantic-shadow.ts` (171 lines) — prompt-as-input boundary via `withSemanticShadowPromptEmbedding`

**Prior iter-1 findings:** P0: 0, P1: 0, P2: 0 (correctness review)

## 2. ATTACKER MODEL CLAIMS

1. schema.ts: Attacker controls `name`/`dim` only via internal/test code (not MCP-exposed) → lands at DB `vec_metadata` table → blast radius: unknown embedder name causes `getAdapter()` to return undefined, no injection
2. skill-graph-db.ts: Attacker controls `dim` only via validated active embedder pointer → lands at `CREATE TABLE vec_${dim}` raw interpolation → blast radius: SQL injection blocked by `validateDim` (positive integer check)
3. ollama.ts: Attacker controls `OLLAMA_BASE_URL` via environment variable → lands at `fetch(`${this.baseUrl}/api/tags`)` → blast radius: SSRF to arbitrary endpoint if attacker has env control
4. ollama.ts: Attacker cannot control model name → hard-coded in MANIFESTS array (registry.ts:13-63) → blast radius: none
5. ollama.ts: Attacker controls Ollama HTTP response (malicious Ollama server) → lands at `readJson()` → blast radius: parsing errors caught silently, strict type checks in `parseEmbeddingRows`/`parseOllamaTagNames` prevent unsafe use
6. semantic-shadow.ts: Attacker controls `prompt` via MCP tool `advisor_recommend` → lands at `adapter.embed([prompt])` → blast radius: OOM mitigated by dual limits (MCP maxLength 10,000 + adapter maxInputChars)

## 3. PER-ANGLE VERDICT

1. **setActiveEmbedder name validation**: CLEAN — Function not exposed as MCP tool (only internal/test usage per grep results). No registry whitelist check, but attacker cannot reach it from external input. Downstream `getAdapter()` returns `undefined` for unknown names (registry.ts:86-88), causing graceful failure not injection.

2. **SQL construction vecTableNameForDim**: CLEAN — `validateDim` enforces `Number.isInteger(dim) && dim > 0` (schema.ts:27-29), preventing SQL injection. All callers use either hardcoded dims (skill-graph-db.ts:240-241: 768, 1024) or validated user input via `setActiveEmbedder`. Raw interpolation at schema.ts:72, skill-graph-db.ts:848, 854 is safe given integer-only constraint.

3. **Ollama URL env**: P2 (defense-in-depth) — `getOllamaBaseUrl()` reads `OLLAMA_BASE_URL` env var with no validation (ollama.ts:54-56). Attacker with env control could set `http://attacker:1234` or `file://` path, causing SSRF or local file access. Blast radius: requires env var control (already privileged), results in `OllamaBackendUnreachableError` or data exfiltration if attacker also controls network. Mitigation: add URL scheme validation (allow only `http://` or `https://`).

4. **Ollama model name**: CLEAN — Model name sourced from hard-coded MANIFESTS array (registry.ts:13-63). `getManifestModelName()` uses `manifest.ollamaName || manifest.name` (ollama.ts:58-60), but manifest is never user-controlled. No path for attacker to override.

5. **JSON parsing**: CLEAN — `readJson()` catches errors silently and returns `null` (ollama.ts:76-82). Output flows to `parseEmbeddingRows()` and `parseOllamaTagNames()`, both with strict type guards (`isNumberArray`, array checks, string checks). No shell execution or file write downstream from parsed JSON.

6. **Prompt boundary**: CLEAN — MCP tool `advisor_recommend` enforces `maxLength: 10_000` on prompt (advisor-recommend.ts:13). Adapter additionally truncates via `maxInputChars` (ollama.ts:200-212). Defense-in-depth prevents OOM from large prompts.

## 4. FINDINGS

### P0 (security-critical; exploitable)

**None.**

### P1 (security-relevant; needs hardening)

**None.**

### P2 (defense-in-depth nice-to-have)

**P2-001: OLLAMA_BASE_URL lacks scheme validation**

- **Location**: `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts:54-56`
- **Issue**: `getOllamaBaseUrl()` reads `OLLAMA_BASE_URL` env var without validating URL scheme. Attacker with environment variable control could set arbitrary URLs (`http://attacker:1234`, `file:///etc/passwd`, etc.).
- **Reproduction**:
  1. Attacker sets `OLLAMA_BASE_URL=http://evil-server:1234`
  2. `OllamaAdapter.ready()` calls `fetch(`${this.baseUrl}/api/tags`)` (ollama.ts:182)
  3. Request sent to attacker-controlled endpoint (SSRF)
- **Blast radius**: Requires env var control (privileged position). Results in failed requests or data exfiltration if attacker also controls network. No direct code execution.
- **Mitigation**: Add URL scheme validation to allow only `http://` or `https://`:
  ```typescript
  function getOllamaBaseUrl(): string {
    const url = (process.env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_BASE_URL).replace(/\/+$/, '');
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error(`OLLAMA_BASE_URL must use http:// or https:// scheme, got: ${url}`);
    }
    return url;
  }
  ```

## 5. FINDINGS COUNTS

- P0: 0 (new); P1: 0 (new); P2: 1 (new)
- Running P0: 0; P1: 0; P2: 1 (cumulative across iter 1-2)

## 6. GAPS FOR NEXT ITER

- Not covered in this security iter: Authentication/authorization boundaries for MCP tool callers (caller-context.ts), potential timing attacks in cosine similarity calculations, side-channel leaks via error messages, dependency vulnerability review (better-sqlite3, @modelcontextprotocol/sdk, fetch implementation).
- setActiveEmbedder exposure analysis: Confirmed not MCP-exposed, but future tooling could expose it — recommend explicit security review if adding embedder-switching tool.

## 7. NEXT ITER RECOMMENDATION

Next iter dimension: **performance**. Focus on:
- Embedding batch size limits and memory usage (ollama.ts:163-177)
- DB query performance for `loadSkillEmbeddings` with large skill sets (skill-graph-db.ts:838-910)
- Cosine similarity computation complexity (semantic-shadow.ts:19-41)
- Vector table index effectiveness (schema.ts:79-80, skill-graph-db.ts:268-269)
