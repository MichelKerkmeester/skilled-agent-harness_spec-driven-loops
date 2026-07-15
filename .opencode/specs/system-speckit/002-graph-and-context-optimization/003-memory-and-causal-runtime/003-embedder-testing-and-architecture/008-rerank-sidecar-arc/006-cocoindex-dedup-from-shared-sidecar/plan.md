---
title: "Implementation Plan: Cocoindex dedup from shared rerank sidecar [template:level_1/plan.md]"
description: "Three-phase plan: adapter implementation + dispatch wiring + tests + A/B benchmark + PROMOTE/HOLD decision."
trigger_phrases:
  - "006 plan cocoindex dedup"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar"
    last_updated_at: "2026-05-20T18:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored"
    next_safe_action: "Begin Phase A adapter implementation"
    blockers: []
---
# Implementation Plan: Cocoindex dedup from shared rerank sidecar

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Phase | What | Status |
|-------|------|--------|
| **A** | Implement `HttpSidecarRerankerAdapter` + env-var dispatch + fallback chain | Planned |
| **B** | Author HTTP-mocked tests (`respx` or `pytest-httpx`) | Planned |
| **C** | A/B benchmark via existing cocoindex fixture; apply decision rule | Planned |
| **D** | PROMOTE path: flip default + remove bundled `CrossEncoder` load; OR HOLD path: ship adapter as opt-in | Planned |
| **E** | Update cocoindex SKILL.md + INSTALL_GUIDE.md; update arc parent; commit | Planned |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

1. Strict validate exits 0 on this packet AND arc parent.
2. All cocoindex tests pass (`test_reranker.py` + `test_rerank_dispatch.py` + new `test_http_sidecar_adapter.py`).
3. E2E smoke: `COCOINDEX_RERANK_VIA_SIDECAR=true ccc search "..."` returns reranked results with sidecar's request log showing the call.
4. Benchmark report follows sk-doc 10-section template; sk-doc `validate_document.py` exit 0.
5. PROMOTE path: `grep "CrossEncoder(" mcp-coco-index/.../reranker.py` returns 0 production hits (test fakes don't count).
6. Decision rule applied verbatim in §8 RECOMMENDATIONS of the benchmark report.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### `HttpSidecarRerankerAdapter` shape

Mirrors the existing `CrossEncoderRerankerAdapter` interface so dispatch is drop-in:

```python
class HttpSidecarRerankerAdapter:
    """HTTP client adapter routing rerank to the shared system-rerank-sidecar."""

    def __init__(self, model_name: str = _DEFAULT_RERANK_MODEL, port: int | None = None) -> None:
        self.model_name = model_name
        self.port = port or int(os.environ.get("RERANK_SIDECAR_PORT", "8765"))
        self._client: httpx.Client | None = None
        self._fallback_adapter: CrossEncoderRerankerAdapter | None = None

    def _get_client(self) -> httpx.Client:
        if self._client is None:
            self._client = httpx.Client(timeout=30.0, base_url=f"http://127.0.0.1:{self.port}")
        return self._client

    def _get_fallback(self) -> CrossEncoderRerankerAdapter:
        if self._fallback_adapter is None:
            self._fallback_adapter = CrossEncoderRerankerAdapter(model_name=self.model_name)
        return self._fallback_adapter

    def rerank(
        self,
        query: str,
        candidates: list[QueryResult],
        top_k: int,
        *,
        diagnostics: RetrievalDiagnostics | None = None,
    ) -> list[QueryResult]:
        if len(candidates) < 2:
            return candidates
        rerank_count = max(1, min(top_k, len(candidates)))
        head = candidates[:rerank_count]
        tail = candidates[rerank_count:]
        documents = [c.content for c in head]

        try:
            response = self._get_client().post("/rerank", json={
                "query": query,
                "documents": documents,
                "top_k": len(documents),
            })
            response.raise_for_status()
            data = response.json()
            # Sidecar returns sigmoid scores in [0,1]
            score_by_index = {item["index"]: float(item["relevance_score"]) for item in data["results"]}
            scores = [score_by_index[i] for i in range(len(head))]
        except (httpx.HTTPError, KeyError, ValueError) as exc:
            logger.warning("Sidecar rerank failed (%s); falling back to bundled adapter", exc)
            if diagnostics is not None:
                diagnostics.record_reranker_fallback("sidecar_unavailable")
            return self._get_fallback().rerank(query, candidates, top_k, diagnostics=diagnostics)

        scores = _apply_path_class_boost(scores, head, reranker_family="cross_encoder")
        _maybe_log_scores(query, head, scores)

        reranked_head = [
            replace(
                candidate,
                score=reranker_score,
                pre_rerank_score=candidate.score,
                reranker_score=reranker_score,
                rankingSignals=[*candidate.rankingSignals, "cross_encoder_rerank", "via_sidecar"],
            )
            for candidate, reranker_score in zip(head, scores, strict=True)
        ]
        reranked_head.sort(key=lambda result: result.reranker_score or float("-inf"), reverse=True)
        return reranked_head + tail
```

### Dispatch update in `get_reranker_adapter()`

```python
def get_reranker_adapter(model_name: str | None = None) -> RerankerAdapter:
    name = (model_name or _DEFAULT_RERANK_MODEL).strip()

    # NEW: route to HTTP sidecar when opted in
    if _parse_bool_env("COCOINDEX_RERANK_VIA_SIDECAR", False):
        cached = _ADAPTERS.get(f"http_sidecar:{name}")
        if cached is None:
            cached = HttpSidecarRerankerAdapter(model_name=name)
            _ADAPTERS[f"http_sidecar:{name}"] = cached
        return cached

    # existing dispatch unchanged below
    ...
```

### Config addition (`config.py`)

Append after the existing rerank vars (line ~768):

```python
RERANK_VIA_SIDECAR = _parse_bool_env("COCOINDEX_RERANK_VIA_SIDECAR", False)
```

Wire through to the Config dataclass + propagation to query pipeline (existing pattern for `rerank_enabled`).

### Fallback chain (resilience semantics)

1. Sidecar healthy + HTTP 200 → use sidecar scores (sigmoid)
2. Sidecar connection refused / HTTP 5xx / timeout / malformed JSON → log warning, route to bundled `CrossEncoderRerankerAdapter` for THIS call (sidecar might recover for next call)
3. Bundled adapter also fails (model load fails) → existing `record_reranker_fallback("model_load_failed")` → positional ordering
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Implementation
- Author `HttpSidecarRerankerAdapter` class in `rerankers/reranker.py`
- Update `get_reranker_adapter()` dispatch
- Add `COCOINDEX_RERANK_VIA_SIDECAR` to `config.py` + Config dataclass + propagation
- Verify `httpx` is a dep (likely transitive via fastapi; confirm in `pyproject.toml`)

### Phase B — Tests
- Author `tests/test_http_sidecar_adapter.py`:
  - `test_http_sidecar_happy_path` — mocked HTTP 200 with realistic sigmoid response, scores flow through
  - `test_http_sidecar_5xx_falls_back_to_bundled` — mocked HTTP 500, verify bundled adapter used (mock both)
  - `test_http_sidecar_connection_refused_falls_back` — mocked `httpx.ConnectError`, verify fallback
  - `test_http_sidecar_malformed_json_falls_back` — mocked HTTP 200 but bad JSON
  - `test_http_sidecar_timeout_falls_back` — mocked `httpx.TimeoutException`
  - `test_dispatch_routes_to_http_when_env_set` — `COCOINDEX_RERANK_VIA_SIDECAR=true` → returns HttpSidecarRerankerAdapter
- Add 1-2 cases in existing `test_reranker.py` for dispatch routing
- Use `respx` (lightweight) or `pytest-httpx` for HTTP mocking
- `cd .opencode/skills/mcp-coco-index/mcp_server && .venv/bin/pytest tests/test_reranker.py tests/test_rerank_dispatch.py tests/test_http_sidecar_adapter.py` → all pass

### Phase C — Benchmark
- Create benchmark folder: `mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/`
- Reuse fixture from `benchmark-2026-05-20-expanded/` (or its successor — verify the latest at run time)
- Arm A: bundled adapter (current default) — should match `benchmark-2026-05-20-expanded`'s baseline closely (this is the regression baseline)
- Arm B: HTTP sidecar adapter (`COCOINDEX_RERANK_VIA_SIDECAR=true`)
- Spawn sidecar via `system-rerank-sidecar/scripts/start.sh` before Arm B; verify `/health` 200 + `/warmup` complete before bench start
- Run both arms n=3 (cocoindex's existing pattern); capture per-probe JSONL + results.csv
- Generate `benchmark_report.md` per sk-doc 10-section template
- Apply decision rule in §8 RECOMMENDATIONS

### Phase D — PROMOTE or HOLD path
**If PROMOTE** (passes all 3 gates):
- Flip `COCOINDEX_RERANK_VIA_SIDECAR` default to `True`
- Remove `_load_model()` body in `CrossEncoderRerankerAdapter` OR remove the class's `_model` field — leaving only HTTP path as production. Keep class as fallback shell for test-mocked use only.
- Update INSTALL_GUIDE.md to note the change

**If HOLD** (any gate fails):
- Default stays `False`
- Bundled adapter remains the production path
- INSTALL_GUIDE.md documents the opt-in toggle + the benchmark verdict explaining why

### Phase E — Arc + docs + commit
- Update `mcp-coco-index/SKILL.md` to add `COCOINDEX_RERANK_VIA_SIDECAR` to the env-var section + a §Consumers/dependencies block referencing `system-rerank-sidecar`
- Update `mcp-coco-index/INSTALL_GUIDE.md` env-var table + a §Sidecar dependency block
- Update arc 008 parent: phase-map row 006 + `last_active_child_id` + `derived.status` (in_progress during execution; complete on ship)
- Strict-validate this packet AND arc parent
- Stage explicit paths + commit
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What | Expected |
|------|------|----------|
| Pytest happy path | HTTP 200 → scores in [0,1] flow through | All scores normalized; rankingSignals includes "via_sidecar" |
| Pytest fallback 5xx | HTTP 500 → bundled adapter used | Diagnostics record sidecar_unavailable; bundled scores returned |
| Pytest fallback connection refused | `httpx.ConnectError` → bundled | Same |
| Pytest fallback malformed JSON | HTTP 200 but bad body → bundled | Same |
| Pytest dispatch routing | `COCOINDEX_RERANK_VIA_SIDECAR=true` env → `HttpSidecarRerankerAdapter` returned | Cached singleton |
| E2E smoke | `COCOINDEX_RERANK_VIA_SIDECAR=true ccc search "test"` | Returns results; sidecar log shows request |
| E2E fallback smoke | Same with `pkill rerank_sidecar` first | Returns results via bundled fallback OR positional |
| Benchmark | n=3 per arm on cocoindex's fixture | Sidecar arm within ±1 hit; p95 Δ ≤ +500ms |
| Strict validate | This packet + arc parent | Both 0/0 PASSED |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Upstream**: arc 008 phases 001-003 — sidecar exists, `/rerank` HTTP contract stable, cocoindex's `_ensure_rerank_sidecar_for_mcp` already wires lifecycle
- **Sideways**: cocoindex's existing `_apply_path_class_boost` (works on any score family; family flag controls behavior)
- **Downstream**: feature catalog + manual testing playbook (separate task) — these can now describe the real cocoindex-uses-sidecar flow instead of vaporware
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Surface | How to roll back |
|---------|------------------|
| `rerankers/reranker.py` changes | `git checkout HEAD~1 -- mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` |
| `config.py` env-var addition | `git checkout HEAD~1 -- mcp-coco-index/mcp_server/cocoindex_code/config/config.py` |
| Benchmark folder | `rm -rf mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/` |
| SKILL.md / INSTALL_GUIDE.md | `git checkout HEAD~1 -- ...` |
| Arc 008 parent | Restore prior `last_active_child_id` + `derived.status: complete`; remove phase-map row 006 |
| Packet folder | `rm -rf .opencode/specs/.../008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/` |

After full rollback: cocoindex returns to bundled in-process Qwen (current state pre-006); sidecar continues to run (started by `_ensure_rerank_sidecar_for_mcp`) but is consumed only by spec-memory under opt-in.
<!-- /ANCHOR:rollback -->
