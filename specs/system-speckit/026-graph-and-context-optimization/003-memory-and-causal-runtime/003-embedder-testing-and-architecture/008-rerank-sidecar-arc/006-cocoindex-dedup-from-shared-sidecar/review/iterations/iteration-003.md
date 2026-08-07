# Deep Review Iteration 003 — Security Pass

## Dimension Focus

Security pass over the shared `system-rerank-sidecar` HTTP boundary and CocoIndex's `HttpSidecarRerankerAdapter`: localhost trust, sidecar bind surface, authentication/identity, request payload bounds, error/log leakage, environment inheritance, test isolation, benchmark fixture handling, and docs security claims.

## Files Reviewed

| File | Lines / Areas Reviewed | Result |
|---|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` | `221-351`, `379-408` | Client host is hardcoded to `127.0.0.1` but port is env-controllable; `/rerank` sends raw query text and candidate document contents with no auth header or identity check. Diagnostics record only reason buckets. |
| `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` | `22-29`, `56-70`, `82-153` | FastAPI app exposes unauthenticated `/health`, `/warmup`, and `/rerank`; request model has no explicit extra-field, count, byte, or text-length bounds; only empty-documents and negative-`top_k` checks exist. |
| `.opencode/skills/system-rerank-sidecar/scripts/start.sh` | `14-25` | Sidecar binds `127.0.0.1`, not `0.0.0.0`; `.env` and `.env.local` are sourced before `exec python -m uvicorn`. |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | `49-55`, `67-75`, `80-128` | Health attach trusts any HTTP 200 from `127.0.0.1:<port>/health`; spawned child receives the full parent environment; current local cache log mode is INFO-only (`~/.cache/mk-reranker/sidecar.log` was `0644`). |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | `139-158` | MCP launcher passes `RERANK_SIDECAR_PORT` to the ensure helper but does not establish sidecar identity/auth. Existing P1-002 launcher gate remains separate. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py` | `747-770` | `COCOINDEX_RERANK_VIA_SIDECAR` default is parsed in config, but the runtime dispatch mismatch is already tracked as DR-002-P1-001. No full sidecar URL env exists; only port redirects are available. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability/observability.py` | `37-58` | `RetrievalDiagnostics.reranker_fallback_reason` stores only enumerated buckets, not query text, candidate paths, content, or full URL. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py` | `48-83`, `86-247` | Tests inject `httpx.MockTransport` into each adapter instance and create fresh fallback recorders, so they do not hit a live sidecar or leak fallback state across tests. |
| `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py` | `15-95` | Live sidecar tests cover health, basic rerank, concurrent serialization, and shutdown; they do not exercise auth, oversize payload rejection, or extra-field rejection. |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/run_ab.py` | `29-33`, `69-180` | Fixture path is operator-supplied and read locally, not used for writes or shell interpolation; benchmark subprocess uses argv list and fixed `RUNS_DIR`. No path-traversal finding. |
| `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md` | `170-186`, `212-256` | Security docs correctly state loopback bind, pinned model revision, and env inheritance advisory, but omit local port spoofing/auth and request-size limits. |
| `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md` | `155-201` | Playbook verifies loopback bind and env leak, but lacks scenarios for forged localhost sidecars, unauthenticated direct callers, and payload-bound rejection. |

## Findings by Severity (P0/P1/P2 with claim-adjudication packets)

P0: none.

### DR-003-P1-001 [P1] Localhost sidecar identity is unauthenticated, so a same-host user can spoof or directly consume the rerank channel

- File: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:248`
- Evidence: The adapter creates an `httpx.Client` pointed at `http://127.0.0.1:{self.port}` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:248-250`, where `self.port` comes from `RERANK_SIDECAR_PORT` or default `8765` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:237-239`. It then POSTs the raw `query`, candidate `documents`, and `top_k` to `/rerank` with no token/header/signature at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:294-300`. The real sidecar binds only loopback at `.opencode/skills/system-rerank-sidecar/scripts/start.sh:25`, which prevents LAN exposure, but the FastAPI endpoints define no auth dependency at `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:82-109`. The launcher health probe accepts any HTTP 200 from `/health` at `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:49-55` and attaches without owner/process verification at `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:98-99`. On a multi-user host, an unprivileged local user can bind high port `8765` before the real sidecar and receive query/candidate content or return manipulated scores.
- Finding class: cross-consumer
- Scope proof: The same unauthenticated localhost contract is described as a shared sidecar for both MCP consumers in `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:194-201`; the playbook checks loopback bind at `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:199` but has no forged-sidecar or auth/identity scenario.
- Recommendation: Add a per-session local credential or Unix-domain-socket/owner check and require it on `/health`, `/warmup`, and `/rerank`; make ensure attach verify sidecar identity before treating a port occupant as trusted. At minimum, document the current contract as single-user-loopback only and reject PROMOTE claims for multi-user hosts.

Claim adjudication:

- claim: When sidecar dispatch is enabled, CocoIndex trusts any process answering on `127.0.0.1:<RERANK_SIDECAR_PORT>`, so a same-host user can impersonate the sidecar and read query/candidate payloads or bias rerank scores.
- evidenceRefs: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:237`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:248`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:294`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:82`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:108`, `.opencode/skills/system-rerank-sidecar/scripts/start.sh:25`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:49`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:98`
- counterevidenceSought: A request authentication mechanism, mTLS/signature, bearer token, Unix socket with filesystem permissions, OS-owner validation, or launcher code that proves the listener is the expected sidecar before sending `/rerank` data.
- alternativeExplanation: This may be an intentional single-user laptop trust model; under that narrower deployment, loopback-only binding is a reasonable simplification rather than a remote exposure.
- finalSeverity: P1
- confidence: high
- downgradeTrigger: Downgrade to P2 if the supported deployment is explicitly constrained to single-user hosts and the feature catalog/playbook make that assumption normative, or if a credential/owner-verification mechanism lands.

### DR-003-P1-002 [P1] `/rerank` accepts unbounded local payloads, allowing same-host callers to exhaust sidecar memory/compute

- File: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:56`
- Evidence: `RerankRequest` declares `query: str`, `documents: list[str]`, and optional `top_k` without strict fields or size/count bounds at `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:56-60`. Runtime validation only rejects an empty `documents` list and negative `top_k` at `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:110-113`. The handler then builds one model pair for every document and calls `_model.predict(pairs)` at `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:121-122`. `top_k=10**9` is not itself an OOM path because slicing at `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:126-127` caps output to the document count, but a huge `documents` array or very large strings are accepted before model inference. No request-size, per-document byte, document-count, or request-time guard was found in `rerank_sidecar.py` or `start.sh`.
- Finding class: cross-consumer
- Scope proof: CocoIndex itself bounds configured rerank top-K through `Config.from_env()` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py:755-760` and the adapter caps to candidate length at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:287-290`, so this is not a normal consumer overflow. The exposed HTTP sidecar remains callable directly by any same-host process because DR-003-P1-001 found no auth gate.
- Recommendation: Add explicit request limits: max documents, max query length, max document length/bytes, max total payload bytes, and bounded `top_k`. Return `413`/`422` before model load/inference, and add tests for extra fields, type coercion expectations, oversized documents, excessive document count, and large `top_k`.

Claim adjudication:

- claim: The sidecar's unauthenticated `/rerank` endpoint accepts arbitrarily large local JSON payloads up to server/client defaults and forwards them into model prediction, giving same-host callers a practical resource-exhaustion vector.
- evidenceRefs: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:56`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:110`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:121`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:126`, `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py:48`, `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py:65`
- counterevidenceSought: FastAPI/Uvicorn middleware or fronting proxy that imposes body-size limits, Pydantic `Field` bounds or strict model config, or tests proving oversized arrays/text are rejected before inference.
- alternativeExplanation: The service may rely on trusted first-party consumers to keep payloads small; that explains the missing bounds for normal paths, but not for an unauthenticated localhost HTTP listener on a multi-user host.
- finalSeverity: P1
- confidence: high
- downgradeTrigger: Downgrade to P2 if request authentication lands and the endpoint is no longer reachable by arbitrary same-host users, or if explicit request-size/count limits are added and covered by tests.

### DR-003-P2-001 [P2] Sidecar child process inherits the full parent environment, including unrelated secrets

- File: `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:108`
- Evidence: The Python ensure helper constructs the child environment as `{**os.environ, "RERANK_SIDECAR_PORT": str(resolved_port)}` at `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:107-115`, so any parent `OPENAI_API_KEY`, `VOYAGE_API_KEY`, or unrelated session secret is passed to the uvicorn child even though `rerank_sidecar.py` only needs `RERANK_*`/model settings. `start.sh` also sources `.env` then `.env.local` before exec at `.opencode/skills/system-rerank-sidecar/scripts/start.sh:14-25`. The feature catalog already documents this as an open advisory at `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md:178-180`, and the playbook has an env-leak audit scenario at `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md:201`.
- Finding class: instance-only
- Scope proof: `rg -n "env = \\{\\*\\*os\\.environ|set -a|RERANK_LOG_PATH|OPENAI_API_KEY|VOYAGE_API_KEY" .opencode/skills/system-rerank-sidecar .opencode/skills/mcp-coco-index` found this Python spawn path plus the shell env sourcing, but no allowlist/scrubber before launch.
- Recommendation: Spawn the sidecar with a minimal allowlist (`PATH`, virtualenv needs, `RERANK_*`, model cache/device variables) and explicitly exclude common API key names. Keep the current docs/playbook advisory until the allowlist ships.

Info-only observations:

- Current local cache mode was `drwxr-xr-x ~/.cache/mk-reranker` and `-rw-r--r-- ~/.cache/mk-reranker/sidecar.log`. Per the solo-Mac posture in the prompt, this is INFO, not a P1/P0. The sidecar log path receives stdout/stderr from `ensure_rerank_sidecar.py:107-115`; request bodies are not written there by default.
- The lazy `import httpx` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:244-250` does not create a unique supply-chain boundary. A malicious `PYTHONPATH` can shadow eager imports too; no extra finding beyond normal Python process-environment trust.
- `RetrievalDiagnostics.reranker_fallback_reason` is low-leakage: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability/observability.py:55-58` records only caller-supplied bucket strings such as `sidecar_unavailable`, `sidecar_5xx`, `sidecar_422`, or `sidecar_malformed`.

## Traceability Checks

| Check | Status | Evidence |
|---|---|---|
| HTTP localhost bind | pass-with-caveat | `start.sh:25` binds `127.0.0.1`, not `0.0.0.0`; caveat is missing identity/auth for the loopback listener. |
| Sidecar spoof / local auth | fail | `reranker.py:248-250` trusts a localhost port, `reranker.py:294-300` sends query/documents, `rerank_sidecar.py:82-109` defines no auth dependency, and `ensure_rerank_sidecar.py:49-55` treats any 200 `/health` as healthy. |
| Payload validation | fail | `rerank_sidecar.py:56-60` has unbounded fields; `rerank_sidecar.py:110-113` only checks non-empty docs and non-negative `top_k`; `rerank_sidecar.py:121-122` predicts over all documents. |
| Diagnostics leakage | pass | `observability.py:55-58` stores enum-style reasons only; adapter warning logs may include local connection errors/status codes but not query text or candidate content. |
| Optional request logs | partial | `rerank_sidecar.py:130-145` writes `query`, `doc_count`, `top_k`, latency, and model when `RERANK_LOG_PATH` is set; off by default but docs should call out that queries may be sensitive. |
| Env-var precedence/defaults | partial | `config.py:770` default mismatch remains DR-002-P1-001; host is not env-controllable, but `RERANK_SIDECAR_PORT` can redirect to another local port through `reranker.py:237-239`. |
| Process lifecycle / env inheritance | advisory | `ensure_rerank_sidecar.py:107-115` inherits full env; `feature_catalog.md:178-180` and `manual_testing_playbook.md:201` already document the advisory. |
| Test fixture safety | pass | `test_http_sidecar_adapter.py:48-57` injects `httpx.MockTransport`; fallback recorder instances are per-adapter at `test_http_sidecar_adapter.py:60-83`. |
| Benchmark fixture safety | pass | `run_ab.py:149-155` reads an operator-supplied fixture, but writes only under fixed `RUNS_DIR` at `run_ab.py:33`/`run_ab.py:76-138` and invokes `ccc` via argv list at `run_ab.py:91-98`. |
| Feature catalog/playbook claims | partial | `feature_catalog.md:170-186` covers loopback/pinned revision/env inheritance but not auth/identity or payload bounds; `manual_testing_playbook.md:199-201` covers loopback/env but not forged sidecars or oversize payload rejection. |

Traceability summary: required=10, executed=10, pass=4, partial=4, fail=2, blocked=0, notApplicable=0, gatingFailures=2.

## Verdict

CONDITIONAL. No P0 was found: the sidecar binds loopback only and the reviewed code does not expose a remote listener, RCE path, or diagnostics channel that directly logs candidate content. Two new P1 security findings block multi-user-host confidence: sidecar identity/auth is missing on the localhost trust boundary, and the unauthenticated `/rerank` endpoint has no meaningful payload bounds. One P2 advisory remains for full parent-env inheritance by the sidecar child process.

The prior correctness P1s remain active, so the review-level verdict stays CONDITIONAL.

## Next Dimension

Traceability. Focus on spec/code/default alignment, checklist evidence, feature catalog claims, playbook scenario coverage, and whether the new security findings need explicit requirements or caveats in the packet docs.

Review verdict: CONDITIONAL
