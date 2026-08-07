# Iteration 006: Security Re-Pass (HTTP Boundary + Provider Plumbing)

## Dimension
Security (re-pass after iter-002)

## Files Reviewed
- `.opencode/skills/sk-code-review/references/review_core.md` - Review severity doctrine
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:1-674` - HTTP provider plumbing
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:1-523` - Rerank pipeline stage
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:1-558` - Feature flags
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:1-325` - Confidence scoring
- `.opencode/skills/system-spec-kit/mcp_server/tests/scoring-opt-in.vitest.ts:1-108` - Opt-in tests
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:1-226` - Sidecar HTTP endpoint
- `.opencode/skills/system-rerank-sidecar/scripts/start.sh:1-46` - Sidecar launcher with env scrubbing

## Findings by Severity

### P1 - Missing Authentication on /rerank Endpoint

**ID:** R6-P1-001  
**File:** `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:179-226`  
**Title:** /rerank POST endpoint lacks authentication despite processing sensitive ML inference  
**Evidence:** The `/rerank` endpoint (lines 179-226) accepts POST requests with no authentication mechanism. No API key header, JWT validation, IP whitelist, or shared secret check exists. Any process on the local machine can invoke the endpoint to perform ML inference on arbitrary query-document pairs. While the endpoint is bound to 127.0.0.1 (verified in start.sh:46), there is no defense-in-depth authentication layer.  
**Finding Class:** instance-only  
**Scope Proof:** Grep of `rerank_sidecar.py` shows no authentication middleware, API key validation, or FastAPI dependencies for auth (e.g., `fastapi.security`). The endpoint is a plain `@app.post("/rerank")` with no security decorators.  
**Affected Surface Hints:** ["HTTP endpoint", "rerank API", "authentication"]  
**Recommendation:** Add an optional API key header validation (e.g., `X-Rerank-Secret`) to the /rerank endpoint. Configure via env var `RERANK_API_KEY`. If set, require the header on all /rerank requests. This provides defense-in-depth even with localhost binding.

### P2 - No Rate Limiting on /rerank Endpoint

**ID:** R6-P2-001  
**File:** `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:179-226`  
**Title:** /rerank endpoint lacks rate limiting, enabling local DoS  
**Evidence:** The /rerank endpoint has no rate limiting mechanism. A malicious local process could spam the endpoint with high-frequency requests, consuming CPU/GPU resources and denying service to legitimate consumers (mk-spec-memory, mcp-coco-index). The endpoint processes documents sequentially (line 194) with no throttling.  
**Finding Class:** instance-only  
**Scope Proof:** No rate-limiting dependencies (e.g., `slowapi`, `fastapi-limiter`) in rerank_sidecar.py imports. No in-memory request tracking.  
**Affected Surface Hints:** ["rate limiting", "DoS prevention", "endpoint protection"]  
**Recommendation:** Add in-memory rate limiting using `slowapi` or a simple token bucket. Configure via `RERANK_RATE_LIMIT` (e.g., "100/minute"). Reject requests exceeding the limit with HTTP 429.

### P2 - No Input Size Limits on /rerank Endpoint

**ID:** R6-P2-002  
**File:** `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:179-226`  
**Title:** /rerank endpoint lacks query/document size limits, enabling DoS via large payloads  
**Evidence:** The endpoint validates that documents is non-empty (line 181-182) and top_k is non-negative (line 183-184), but imposes no limits on query length or documents array size. Line 194 creates query-document pairs for ALL documents without capping. A malicious request with 10,000 documents could exhaust memory and cause OOM.  
**Finding Class:** instance-only  
**Scope Proof:** No max length checks on `req.query` or `req.documents` in the rerank function. The FastAPI BaseModel (lines 116-120) has no `max_length` or `constr` constraints.  
**Affected Surface Hints:** ["input validation", "DoS prevention", "payload limits"]  
**Recommendation:** Add Pydantic constraints: `query` max length 10,000 chars, `documents` max length 1000 items. Reject oversized requests with HTTP 400.

### P2 - No CORS Configuration

**ID:** R6-P2-003  
**File:** `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:146`  
**Title:** FastAPI app lacks explicit CORS middleware configuration  
**Evidence:** The FastAPI app initialization (line 146) has no CORS middleware. While localhost binding (127.0.0.1) mitigates cross-origin risks, explicit CORS headers would provide defense-in-depth and prevent accidental exposure if binding changes.  
**Finding Class:** instance-only  
**Scope Proof:** No `CORSMiddleware` in FastAPI constructor or middleware list. No `from fastapi.middleware.cors import CORSMiddleware` import.  
**Affected Surface Hints:** ["CORS", "HTTP headers", "defense-in-depth"]  
**Recommendation:** Add `CORSMiddleware` with strict origin allowlist (e.g., `["http://127.0.0.1:8765", "http://localhost:8765"]`) even if currently localhost-only.

### P2 - HTTP Provider Plumbing Lacks Explicit TLS Verification

**ID:** R6-P2-004  
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:299-311,341-353`  
**Title:** Voyage and Cohere HTTP calls lack explicit TLS certificate verification  
**Evidence:** The `rerankVoyage` (lines 299-311) and `rerankCohere` (lines 341-353) functions use `fetch()` with HTTPS endpoints but do not configure explicit TLS verification options. While Node.js `fetch` validates TLS by default, explicit configuration would be defensive against MITM if the default behavior changes or if running in non-standard environments.  
**Finding Class:** cross-consumer  
**Scope Proof:** Both cloud providers use identical pattern: `fetch(config.endpoint, {...})` with no `agent` or `rejectUnauthorized` options. Local provider (lines 381-390) uses HTTP (localhost), so TLS not applicable.  
**Affected Surface Hints:** ["HTTP security", "TLS verification", "cloud API calls"]  
**Recommendation:** Document that Node.js `fetch` performs default TLS verification. If future needs require custom TLS (e.g., corporate proxy), add explicit `agent: https.Agent({ rejectUnauthorized: true })` option.

## Positive Security Observations

1. **Localhost Binding Enforced**: The sidecar launcher (`start.sh:46`) explicitly binds to `127.0.0.1` via `--host 127.0.0.1`, preventing LAN exposure. This is verified by test RS-021 in the manual testing playbook.

2. **Environment Variable Scrubbing**: The sidecar launcher (`start.sh:24-45`) uses `exec env -i` with an explicit allowlist of only RERANK_* and HF_* variables, preventing parent-shell secret leaks (DR-003-P2-001).

3. **Model Allowlist**: The sidecar implements a model name allowlist (`rerank_sidecar.py:38-44`) via `RERANK_ALLOWED_MODELS`, preventing arbitrary model loading.

4. **Revision Pinning**: The default model revision is pinned (`rerank_sidecar.py:29-32`) and can be overridden per-model via `RERANK_MODEL_REVISIONS`, preventing supply chain attacks.

5. **No Timing Attack Risk in Confidence Scoring**: The conditional penalty branch in `confidence-scoring.ts:256` is not a timing attack risk. `isRerankerExpected()` is a simple env var check with no secret timing leakage. Both branches execute similar arithmetic operations.

6. **Safe Test Mocking**: The test file `scoring-opt-in.vitest.ts` uses safe env var manipulation (lines 17-31) with proper reset/restore, avoiding unsafe mocking patterns.

## Traceability Checks

- **spec_code**: PASS - Security findings align with the spec's opt-in-only closure decision (arc 011/005)
- **checklist_evidence**: PASS - Findings map to security checklist items (auth, rate limiting, input validation)

## Verdict

**CONDITIONAL** (hasAdvisories=true)

One P1 finding (missing authentication on /rerank endpoint) and four P2 findings (rate limiting, input size limits, CORS, TLS verification). The P1 is partially mitigated by localhost binding but represents a missing defense-in-depth layer. All P2 findings are non-blocking security hardening recommendations.

## SCOPE VIOLATIONS

**Delta file write blocked**: Attempted to write `deltas/iter-006.jsonl` but the permission system rejected the write operation. The iteration narrative (`iterations/iteration-006.md`) and state log append (`deep-review-state.jsonl`) were written successfully. The delta file contains the iteration record plus structured finding records. This is a permission system limitation, not a scope violation by the reviewer.

## Next Dimension

Security coverage is now complete (2 passes). The remaining dimensions (correctness, traceability, maintainability) have been covered in prior iterations. Recommend convergence check given:
- All 4 dimensions covered (correctness 2x, security 2x, traceability 1x, maintainability 1x)
- P0=0, P1=4 (3 prior + 1 new), P2=13 (9 prior + 4 new)
- New findings ratio for this iteration: 5/9 = 0.56 (moderate)
- No critical security gaps discovered beyond the P1 auth issue

Consider early convergence if the operator accepts the P1 auth finding as acceptable given localhost binding mitigation.
