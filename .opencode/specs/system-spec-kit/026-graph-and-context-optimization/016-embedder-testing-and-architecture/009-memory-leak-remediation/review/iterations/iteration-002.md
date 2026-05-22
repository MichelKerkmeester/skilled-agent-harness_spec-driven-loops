# Iteration 002 — security

## Metadata
- Iteration: 2 of 10
- Dimension: security
- Timestamp: 2026-05-22T16:47:52Z
- Findings this iter: 6

## Summary
Reviewed the arc 009 lifecycle surfaces with a security focus: rerank sidecar startup/authentication, sidecar process ownership, CocoIndex active-work cancellation retention, and the local lifecycle process helpers. The main issues are local-service trust boundaries that are documented as protected but are not enforced in the launched process, plus two denial-of-service paths where lifecycle state or model loading can be driven without bounded authentication.

## New Findings

### P0 — Blockers
None

### P1 — Required

#### Configured rerank API keys are dropped before uvicorn starts
- **Fingerprint:** `security:rerank-sidecar:start-drops-api-key`
- **File(s):** `.opencode/skills/system-rerank-sidecar/scripts/start.sh:28`, `.opencode/skills/system-rerank-sidecar/scripts/start.sh:38`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:87`
- **Evidence:** `start.sh` executes `env -i` and passes `RERANK_SIDECAR_PORT`, model, revision, allowlist, device, dtype, and log path, but no `RERANK_API_KEY`. The server only enforces the header when `os.environ.get("RERANK_API_KEY", "").strip()` is non-empty.
- **Reasoning:** Operators are told they can set `RERANK_API_KEY` to protect `/rerank`, but the launcher strips that secret before uvicorn imports `rerank_sidecar.py`. The result is fail-open authentication: a configured API key silently becomes unset, and every localhost process can call `/rerank`.
- **Suggested fix:** Add `RERANK_API_KEY` to the explicit `env -i` allowlist, add a startup log that auth is enabled without printing the key, and add a regression that starts through `scripts/start.sh` with `RERANK_API_KEY` set and verifies `/rerank` returns 401 without `X-Rerank-Secret`.

#### Warmup endpoint bypasses rerank auth and rate limiting
- **Fingerprint:** `security:rerank-sidecar:warmup-unauthenticated-model-load`
- **File(s):** `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:209`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:224`
- **Evidence:** `/warmup` is declared as `@app.post("/warmup")` with no dependencies and no `check_rate_limit()`. `/rerank` separately declares `dependencies=[Depends(verify_rerank_secret)]` and calls `check_rate_limit()`.
- **Reasoning:** Even after the API-key propagation bug is fixed, any local process can hit `/warmup` and force the sidecar to load an allowlisted model. In a multi-model setup this can be used as a local memory DoS path, because model loading is the expensive lifecycle transition and the endpoint is neither authenticated nor rate-limited.
- **Suggested fix:** Apply the same `verify_rerank_secret` dependency to `/warmup`, run `check_rate_limit()` there too, and add tests for 401/429 behavior on warmup when `RERANK_API_KEY` and a low `RERANK_RATE_LIMIT_PER_MIN` are configured.

#### Sidecar spawn accepts any localhost health response as ownership proof
- **Fingerprint:** `security:rerank-sidecar:spawn-health-port-race`
- **File(s):** `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:172`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:192`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:201`
- **Evidence:** `ensure_rerank_sidecar()` checks whether the port is healthy before spawn, starts `bash start.sh`, then treats `wait_for_healthy(resolved_port, ...)` as success and writes a ledger row for `proc.pid`. It never checks `proc.poll()` after warmup and the `/health` payload carries no owner token, PID, or config hash.
- **Reasoning:** There is a TOCTOU gap between the initial port probe and the warmup probe. A local process can bind the selected port after the first probe, answer `/health`, and cause the ensure path to return that port while recording the failed child PID in the ledger. Clients may then send rerank queries to the wrong local service.
- **Suggested fix:** Require the health response to include an owner token/config hash generated for this spawn, verify the spawned process is still alive before recording the ledger row, and treat a healthy port with mismatched owner metadata as unknown-owner so a different port is selected.

#### Cancel stale-identity sets grow without a retention cap
- **Fingerprint:** `security:cocoindex-active-work:unbounded-stale-cancel-identities`
- **File(s):** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:44`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:47`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:213`
- **Evidence:** Completed rows are capped through `_completed_order` and `_max_completed_rows = 512`, but evicted identities are copied into `_stale_req_ids` and `_stale_index_ids`. `_remember_stale()` only calls `.add(...)`, and there is no corresponding cap or pruning structure for those sets.
- **Reasoning:** A client that can trigger many unique index IDs can make the registry retain every evicted `req_id` and `index_id` forever. That reintroduces an unbounded process-local memory surface inside the lifecycle code added to remediate leaks.
- **Suggested fix:** Store stale identities in bounded LRU/TTL structures, preferably with the same cap as completed rows or a separate explicit limit, and add a regression that completes more than the cap and asserts stale identity storage remains bounded.

### P2 — Suggestions

#### Optional rerank logging writes raw query text without rotation or redaction
- **Fingerprint:** `security:rerank-sidecar:raw-query-log-retention`
- **File(s):** `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:46`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:251`
- **Evidence:** When `RERANK_LOG_PATH` is set, each `/rerank` call appends JSON including `"query": req.query`; the path is operator-controlled and there is no size cap, rotation, or redaction.
- **Reasoning:** Search/rerank queries often contain pasted code, stack traces, customer identifiers, or secrets. An opt-in debug log is reasonable, but retaining raw query text indefinitely is a secret-handling footgun and can also grow unbounded during repeated benchmark or daemon use.
- **Suggested fix:** Log metadata by default (`doc_count`, `top_k`, latency, model) and gate raw query logging behind an explicit `RERANK_LOG_RAW_QUERIES=true`. Reuse the audit-rotation helper or add sidecar-local rotation/cap settings.

#### Extra allowlisted models can execute local remote-code without revision pins
- **Fingerprint:** `security:rerank-sidecar:trust-remote-code-unpinned-extra-models`
- **File(s):** `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:120`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:125`, `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:140`
- **Evidence:** `_load_model()` always passes `"trust_remote_code": True`. It uses a revision only when `MODEL_REVISIONS.get(model_name)` returns one, while `_resolve_model_name()` permits any name present in `RERANK_ALLOWED_MODELS`.
- **Reasoning:** The default model is pinned, but additional allowlisted models can load the latest local snapshot with `trust_remote_code=True`. That is a supply-chain hardening gap: a local cache update can change executable model code without a corresponding env/config review.
- **Suggested fix:** Require a revision for every allowlisted model when `trust_remote_code=True`, or default `trust_remote_code` to false unless a model-specific opt-in is present. Add startup validation that rejects unpinned non-default models.

## Convergence Signal
- New findings this iter: 6
- Cumulative finding count after iter: 12
- New-findings ratio: 0.50
- Continue / converged signal: `continue`

## Files Touched (this iter)
- `iterations/iteration-002.md`
- `deltas/iter-002.jsonl`
- `deep-review-findings-registry.json`
- `deep-review-state.jsonl`
- `deep-review-dashboard.md`
