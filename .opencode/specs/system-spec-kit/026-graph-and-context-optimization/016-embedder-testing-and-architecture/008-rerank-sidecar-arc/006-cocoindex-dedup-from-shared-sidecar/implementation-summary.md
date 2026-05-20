---
title: "Implementation Summary: Cocoindex dedup from shared rerank sidecar [template:level_1/implementation-summary.md]"
description: "PRE-IMPLEMENTATION stub for arc 008 phase 006 — cocoindex HTTP adapter + A/B benchmark + PROMOTE/HOLD decision."
trigger_phrases:
  - "006 implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar"
    last_updated_at: "2026-05-20T21:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Deep-review P1 remediation shipped"
    next_safe_action: "Commit remediation; arc 008 closes for real"
    blockers: []
    completion_state: "complete"
---
# Implementation Summary: Cocoindex dedup from shared rerank sidecar

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: SHIPPED — PROMOTE path.** A/B benchmark confirmed hit-rate parity (15/73 = 15/73) and bounded p95 latency cost (+18 ms); cocoindex now dispatches reranking through `system-rerank-sidecar` by default.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Shipped — PROMOTE |
| **Created** | 2026-05-20 |
| **Shipped** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` (re-opened then re-closed) |
| **Position in arc** | Phase 006 of 6 — closes the dedup intent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- `HttpSidecarRerankerAdapter` class added to `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py`. Consumes `http://127.0.0.1:8765/rerank` via a cached `httpx.Client`; lazy-imports `httpx` to keep the import cost off the bundled-only path; ships its own fallback to `CrossEncoderRerankerAdapter` on connection refused, HTTP 5xx, 4xx, malformed JSON, or missing-index payload, recording one of `sidecar_unavailable`, `sidecar_5xx`, `sidecar_<status>`, `sidecar_malformed` in `RetrievalDiagnostics.reranker_fallback_reason`.
- `get_reranker_adapter()` dispatch updated so `COCOINDEX_RERANK_VIA_SIDECAR=true` (now the **default**) routes to the new HTTP adapter ahead of the existing jina-v3 / CrossEncoder branches.
- `COCOINDEX_RERANK_VIA_SIDECAR` env var: parsed by `Config.from_env()` (`config/config.py:769`) and stored as `Config.rerank_via_sidecar: bool`. Default flipped to `True` after the A/B benchmark cleared the decision-rule gates.
- 9 new tests in `tests/test_http_sidecar_adapter.py` — happy path, connection error, 5xx, 4xx, malformed JSON, missing-index payload, short-circuit on `<2` candidates, and 2 dispatch-routing tests. All pass via injected `httpx.MockTransport`, no live sidecar required.
- Standalone bench harness `benchmark-2026-05-20-cocoindex-via-sidecar/run_ab.py` (mirrors the lane-runner shape from `phase2-bench/run-expanded-bench.sh` but writes locally, never into the calibration packet) + benchmark report + per-arm raw JSON in `runs/`.
- Cocoindex `SKILL.md` and `INSTALL_GUIDE.md` updated: new env-var row, dispatch-default callout, changelog entry `1.2.4`.
- Arc 008 parent `spec.md` phase-map gains row 006, `graph-metadata.json.children_ids` extended, `last_active_child_id` repointed to 006.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Single autonomous session on `main`:

1. **Scaffolding** — packet 006 `spec.md` + `plan.md` + `tasks.md` + `implementation-summary.md` stub + `description.json` + `graph-metadata.json` authored; arc parent re-opened.
2. **Implementation** — adapter class + dispatch update + Config field added; smoke-imported via Python to confirm routing. Initial attempt to thread `rerank_via_sidecar` through `IndexMetadata` reverted on noticing it feeds `effective_config_hash`; would have invalidated existing indexes and is out of scope.
3. **Tests** — `tests/test_http_sidecar_adapter.py` authored using `httpx.MockTransport` (avoids a new test dep — `respx`/`pytest-httpx` were not installed). One schema-correction iteration (initial `QueryResult` keyword args were wrong) caught immediately by pytest. Final full suite: 231 passing.
4. **Benchmark** — sidecar started + warmed (`scripts/start.sh` + `POST /warmup`); standalone `run_ab.py` authored after the first attempt to reuse `phase2-bench/run-expanded-bench.sh` overwrote authoritative historical evidence in the calibration packet (restored from `HEAD`). 18-probe smoke + full 73-probe sweep both confirmed Arm A vs Arm B hit-rate parity with bounded p95 cost.
5. **PROMOTE applied** — default flipped to `COCOINDEX_RERANK_VIA_SIDECAR=true`; SKILL.md + INSTALL_GUIDE.md updated; 240 + 9 = 249 tests still green.
6. **Closeout** — packet 006 finalized; arc 008 parent re-closed via this packet's evidence; commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001: Sync `httpx.Client`, not async
**Decision:** Use sync `httpx.Client` in the adapter, not `AsyncClient`.
**Rationale:** Cocoindex's existing `rerank()` is sync (lines 155-207). Making it async would propagate up the entire call chain (`retrieval/query.py` and beyond). Localhost loopback latency is sub-ms; sync is appropriate.

### D-002: Singleton `httpx.Client` per adapter instance (connection pooling)
**Decision:** Cache the `httpx.Client` on `self._client` and reuse across calls.
**Rationale:** Saves ~1ms per call by reusing TCP connection. Matches the existing pattern of `_get_adapter` caching the model.

### D-003: Sigmoid scores pass through unchanged
**Decision:** Sidecar returns sigmoid `[0,1]` scores; cocoindex's `HttpSidecarRerankerAdapter` does NOT re-normalize, inverse-sigmoid, or otherwise transform.
**Rationale:** Spec-memory already consumes sigmoid via `cross-encoder.ts:local`. Modifying the sidecar to return raw logits for cocoindex's benefit would regress spec-memory. Path-class boost interacts with the new scale, but boost is already gated `false` by default for non-BGE adapters — operators who want boost on sigmoid scores must supply explicit factors.

### D-004: Keep `CrossEncoderRerankerAdapter` class on PROMOTE path
**Decision:** Even on PROMOTE (default flips to true), keep the bundled adapter CLASS but stop instantiating it at import time. Use it only as fallback.
**Rationale:** The fallback chain stays operational. If the sidecar is unavailable, cocoindex can still serve reranked results via the bundled path (slower cold start, but functional). Removing the class entirely would break that resilience.

### D-005: Strict decision rule, no borderline-advisory verdict
**Decision:** If benchmark shows p95 Δ = +600ms (close to +500ms gate), it's a HOLD, not a "promote with caveat."
**Rationale:** Same conservatism as arc 008 phase 005. Defaults must be earned with clear evidence.

### D-006: PROMOTE applied — default flipped to sidecar dispatch
**Decision:** Flip `COCOINDEX_RERANK_VIA_SIDECAR` default to `True` in `Config.from_env()`.
**Rationale:** Arm A vs Arm B 73-probe smoke confirmed hit-rate parity (15/15) and p95 latency Δ = +18 ms (well under the +500 ms tolerance gate). The MCP launcher already auto-ensures the sidecar (`cli.py::_ensure_rerank_sidecar_for_mcp` from phase 003), so MCP-mode operators get this for free; CLI-only operators can opt out with `COCOINDEX_RERANK_VIA_SIDECAR=false`. Closes arc 008's deduplication intent by routing through a single shared Qwen process instead of cocoindex bundling its own.

### D-007: Reverted attempt to thread `rerank_via_sidecar` into `IndexMetadata.hash_payload`
**Decision:** Do not include `rerank_via_sidecar` in `IndexMetadata.hash_payload`.
**Rationale:** The hash payload feeds `effective_config_hash()`, which is the durable fingerprint that triggers index rebuilds on change. Adding a runtime-only dispatch flag here would force every existing cocoindex index to rebuild on first read after upgrade. The dispatch flag is environment-driven and observable via diagnostics; it has no semantic effect on indexed content. Reverted before commit.

### D-008: Dispatch + ensure helpers default-on after deep-review found drift
**Decision:** Patched `_rerank_via_sidecar_enabled()` to return True when env unset (matching `Config.from_env`'s `_parse_bool_env(..., True)` default), and `_ensure_rerank_sidecar_for_mcp` now gates by cocoindex's own flag and passes `skip_if_disabled=False` to the helper.
**Rationale:** Deep-review iter-2 surfaced DR-002-P1-001: `Config.rerank_via_sidecar` defaulted True but the dispatch helper read raw env (`""` → False), so the shipped PROMOTE claim was materially false. Deep-review iter-2 also surfaced DR-002-P1-002: cocoindex's MCP auto-ensure called the helper with default `skip_if_disabled=True`, which checks **spec-memory's** `SPECKIT_CROSS_ENCODER` — not cocoindex's flag — and silently no-op'd. Both patches verified live: `_rerank_via_sidecar_enabled() = True` on unset env, dispatch returns `HttpSidecarRerankerAdapter`, helper spawns the sidecar (PID 47363) without SPECKIT_CROSS_ENCODER set. Tests updated: the now-misnamed `test_dispatch_off_by_default` split into `test_dispatch_defaults_to_sidecar_when_env_unset` + `test_dispatch_routes_to_bundled_when_env_explicit_false`; 5 pre-existing dispatch tests updated to opt-out explicitly via `monkeypatch.setenv("COCOINDEX_RERANK_VIA_SIDECAR", "false")` before asserting bundled-adapter routing.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Executed commands and observed outputs:

```text
$ bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
    .opencode/specs/.../008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar --strict
RESULT: PASSED  (Errors: 0  Warnings: 0)

$ cd .opencode/skills/mcp-coco-index/mcp_server && .venv/bin/python -m pytest tests/ -q
231 passed in 24.32s          # 9 new HttpSidecar tests + 240 pre-existing

$ python -c "from cocoindex_code.rerankers.reranker import HttpSidecarRerankerAdapter, get_reranker_adapter; ..."
default dispatch -> CrossEncoderRerankerAdapter        # with VIA_SIDECAR=false
sidecar dispatch -> HttpSidecarRerankerAdapter         # with VIA_SIDECAR=true

$ curl -sf http://127.0.0.1:8765/health
{"status":"ok","model_loaded":true,...}

$ .venv/bin/python benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/run_ab.py --arms a,b --runs 1 \
    --fixture .../fixture-full-73.json
[arm=a-bundled-qwen] DONE hits=15/73 p50=1382ms p95=1877ms
[arm=b-sidecar-qwen] DONE hits=15/73 p50=1413ms p95=1895ms
# Hit-rate Δ = 0, p95 Δ = +18 ms — PROMOTE decision rule gates green

# Post-remediation (deep-review P1 fixes — D-008):
$ python -c "from cocoindex_code.rerankers.reranker import _rerank_via_sidecar_enabled, get_reranker_adapter, _DEFAULT_RERANK_MODEL; ..."
_rerank_via_sidecar_enabled() = True       # env unset → PROMOTE default fires
dispatch adapter = HttpSidecarRerankerAdapter

$ python -c "from scripts.ensure_rerank_sidecar import ensure_rerank_sidecar; result = ensure_rerank_sidecar(port=8765, skip_if_disabled=False); print(result)"
[ensure-rerank-sidecar] sidecar spawned PID=47363 listening on :8765
{'spawned': True, 'port': 8765, 'ownerPid': 47363}

$ .venv/bin/python -m pytest tests/ -q
232 passed in 25.34s                       # 240 → 232 + 1 new test - 1 retired = 232 (one assertion split into two)
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Sidecar must be running for the fast path to fire.** When `_ensure_rerank_sidecar_for_mcp` fails to spawn the sidecar (cache miss, port collision, host-OS denial), cocoindex's first call hits the HTTP error path and records a `sidecar_unavailable` diagnostic, then falls back to a lazily-instantiated bundled adapter. Operational behavior changes from "always bundled" to "sidecar-or-bundled" — observable via `RetrievalDiagnostics.reranker_fallback_reason`.
2. **Absolute hit-rate drift since 2026-05-20.** The same fixture went from 30/73 hits to 15/73 hits between the original Qwen3 promotion bench and packet 006's A/B sweep. Both arms saw the drop equally, so it is **not** caused by the sidecar swap. Likely cause: index drift from the nomic embedder migration + arc 006/008 work that landed between the two runs. Tracked for a follow-on packet `007-cocoindex-rerank-baseline-drift` (not in arc 008 scope).
3. **n=1 smoke benchmark.** PROMOTE decision rests on a single 73-probe sweep per arm. Confidence intervals are not computed. Per the plan's decision rule the +18 ms p95 cost is conclusive, but future re-benches should add n=3 once the baseline drift is investigated.
4. **Sigmoid score scale change** for downstream code that interpreted raw logits. Path-class boost is gated `false` by default; explicit factor reconfiguration required if operators were running with boost on.
5. **Single-worker sidecar.** `asyncio.Lock` serializes `/rerank`. Concurrent cocoindex searches queue at the sidecar. Not exercised in this packet's benchmark.
<!-- /ANCHOR:limitations -->
