---
title: "Cocoindex Dedup from Shared Rerank Sidecar: Arc 008 Phase 006"
description: "HttpSidecarRerankerAdapter added to mcp-coco-index so cocoindex dispatches reranking through the shared system-rerank-sidecar by default. A/B benchmark on 73 probes confirmed hit-rate parity and bounded p95 latency cost. PROMOTE decision applied. Deep-review P1 remediation fixed the dispatch helper default and MCP auto-ensure gate."
trigger_phrases:
  - "cocoindex dedup sidecar"
  - "HttpSidecarRerankerAdapter"
  - "COCOINDEX_RERANK_VIA_SIDECAR"
  - "arc 008 phase 006 changelog"
  - "cocoindex rerank via sidecar promote"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-20

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc`

### Summary

Arc 008 was scoped around deduplication: one shared Qwen sidecar process serving both spec-memory and cocoindex instead of each bundling its own in-process `CrossEncoder`. Phases 001-005 shipped the sidecar, the launcher helpers, and the spec-memory A/B bench, but cocoindex was never actually moved off its bundled loader. Both MCPs continued to ship Qwen separately, duplicating roughly 1.5 GB RAM whenever both ran.

Phase 006 added `HttpSidecarRerankerAdapter` to `mcp-coco-index`, wired `COCOINDEX_RERANK_VIA_SIDECAR` dispatch routing with `true` as the default, and ran a standalone 73-probe A/B benchmark. Hit-rate parity (15/73 arm A vs 15/73 arm B) and a p95 latency delta of only +18 ms cleared all PROMOTE gates. A deep-review iteration (cli-codex gpt-5.5 xhigh, 2 rounds) surfaced two P1 correctness gaps: the dispatch helper read raw env so the default never reached runtime, and the MCP auto-ensure gate checked spec-memory's flag instead of cocoindex's own. Both P1s were patched and re-verified the same day. The arc closed with 232 tests passing and the PROMOTE default active.

### Added

- `HttpSidecarRerankerAdapter` class in `mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` consuming `http://127.0.0.1:8765/rerank` via a cached `httpx.Client` with lazy import
- Fallback chain recording `sidecar_unavailable`, `sidecar_5xx`, `sidecar_<status>`, `sidecar_malformed` in `RetrievalDiagnostics.reranker_fallback_reason`
- `COCOINDEX_RERANK_VIA_SIDECAR` env var parsed by `Config.from_env()` with default `True` after the PROMOTE decision
- 9 new tests in `mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py` using `httpx.MockTransport`
- Standalone benchmark harness `run_ab.py` plus benchmark report and per-arm raw JSON in `benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/runs/`

### Changed

- `get_reranker_adapter()` dispatch updated to route to `HttpSidecarRerankerAdapter` when `COCOINDEX_RERANK_VIA_SIDECAR=true`
- `Config.rerank_via_sidecar: bool` field stored on the config object and propagated through dispatch
- `_rerank_via_sidecar_enabled()` patched to return `True` when env is unset, matching `Config.from_env`'s `_parse_bool_env(..., True)` default
- `cli.py::_ensure_rerank_sidecar_for_mcp` updated to gate by cocoindex's own flag and pass `skip_if_disabled=False` to the helper
- 5 pre-existing dispatch tests in `test_rerank_dispatch.py` and `test_reranker.py` updated to `monkeypatch.setenv("COCOINDEX_RERANK_VIA_SIDECAR", "false")` before asserting bundled-adapter routing
- `mcp-coco-index/SKILL.md` and `INSTALL_GUIDE.md` updated with the new env-var row, dispatch-default callout, and changelog entry 1.2.4
- Arc 008 parent `spec.md` phase-map row 006 added, `graph-metadata.json` `children_ids` extended with `last_active_child_id` repointed to 006

### Fixed

- PROMOTE default never reached runtime dispatch: `_rerank_via_sidecar_enabled()` read raw env where empty string evaluated to `False` while `Config.from_env` parsed it as `True`. Now returns `True` on unset env.
- MCP auto-ensure was gated by spec-memory's `SPECKIT_CROSS_ENCODER` flag instead of cocoindex's `COCOINDEX_RERANK_VIA_SIDECAR`. Cocoindex MCP startup silently skipped sidecar spawn. Fixed by passing `skip_if_disabled=False` and checking the correct flag.

### Verification

| Check | Result |
|-------|--------|
| Strict packet validation (`validate.sh --strict`) | PASSED. Errors: 0, Warnings: 0 |
| pytest full suite (initial) | 231 passed (240 pre-existing + 9 new `HttpSidecar` tests) |
| pytest full suite (post-remediation) | 232 passed (one test split into two assertions) |
| A/B benchmark arm-a-bundled-qwen | hits=15/73, p50=1382ms, p95=1877ms |
| A/B benchmark arm-b-sidecar-qwen | hits=15/73, p50=1413ms, p95=1895ms |
| PROMOTE gate: hit-rate parity | PASS. Delta = 0/73 |
| PROMOTE gate: p95 latency delta | PASS. +18ms vs +500ms tolerance |
| `_rerank_via_sidecar_enabled()` on unset env | `True` (post-remediation smoke) |
| Sidecar auto-spawn (MCP cold start) | PID 47363 spawned. `{"status":"ok","model_loaded":true}` |
| Deep-review P1 findings (DR-002-P1-001, DR-002-P1-002) | Both resolved. Verdict: PASS |

### Files Changed

| File | What changed |
|------|--------------|
| `mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` | `HttpSidecarRerankerAdapter` class added. `get_reranker_adapter()` dispatch updated. `_rerank_via_sidecar_enabled()` patched for env-unset default. |
| `mcp-coco-index/mcp_server/cocoindex_code/config/config.py` | `COCOINDEX_RERANK_VIA_SIDECAR` env var parsing added at line 769. `Config.rerank_via_sidecar: bool` field added. |
| `mcp-coco-index/mcp_server/cocoindex_code/cli.py` | `_ensure_rerank_sidecar_for_mcp` updated to gate by cocoindex's flag with `skip_if_disabled=False`. |
| `mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py` (NEW) | 9 tests via `httpx.MockTransport`: happy path, connection error, 5xx, 4xx, malformed JSON, missing-index payload, short-circuit on fewer than 2 candidates, 2 dispatch-routing tests. |
| `mcp-coco-index/mcp_server/tests/test_rerank_dispatch.py` | 5 pre-existing dispatch tests updated to opt out via `monkeypatch.setenv`. |
| `mcp-coco-index/mcp_server/tests/test_reranker.py` | Pre-existing dispatch tests updated to opt out via `monkeypatch.setenv`. |
| `mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/` (NEW) | `run_ab.py`, `benchmark_report.md`, fixtures, per-arm `runs/` JSON. |
| `mcp-coco-index/SKILL.md` | New env-var row and dispatch-default callout added. |
| `mcp-coco-index/INSTALL_GUIDE.md` | New env-var row, sidecar dependency cross-link, changelog entry 1.2.4 added. |
| `008-rerank-sidecar-arc/spec.md` | Phase-map row 006 added. Arc status re-closed. |
| `008-rerank-sidecar-arc/graph-metadata.json` | `children_ids` extended. `last_active_child_id` repointed to 006. `derived.status` set to `complete`. |

### Follow-Ups

- Investigate absolute hit-rate drift: the same fixture dropped from 30/73 to 15/73 between the original Qwen3 promotion bench and this packet's sweep. Both arms dropped equally so the sidecar is not the cause. Likely source is index drift from the nomic embedder migration and other arc 008 work. Track as a separate `cocoindex-rerank-baseline-drift` packet.
- Run n=3 benchmark sweeps once the baseline drift is understood. The PROMOTE decision rested on a single 73-probe sweep per arm with no confidence intervals computed.
- Document sigmoid score scale implications for operators running with path-class boost enabled. Boost is gated `false` by default for non-BGE adapters but operators who previously enabled it need to supply explicit recalibrated factors.
- Address single-worker sidecar serialization: `asyncio.Lock` on `/rerank` means concurrent cocoindex searches queue at the sidecar. Not exercised in this packet's benchmark.
