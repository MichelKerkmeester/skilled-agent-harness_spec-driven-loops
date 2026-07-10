---
title: "Feature Specification: Cocoindex dedup from shared rerank sidecar"
description: "Replace cocoindex's bundled in-process Qwen reranker (CrossEncoderRerankerAdapter) with HTTP calls to the shared system-rerank-sidecar. Closes arc 008's deduplication intent: one Qwen instance loaded across the workspace, both MCPs consume via HTTP. Includes A/B benchmark vs bundled baseline and decisive PROMOTE-or-HOLD ship."
trigger_phrases:
  - "cocoindex dedup sidecar"
  - "HttpSidecarRerankerAdapter"
  - "cocoindex rerank via sidecar"
  - "COCOINDEX_RERANK_VIA_SIDECAR"
  - "shared rerank deduplication"
  - "arc 008 phase 006"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar"
    last_updated_at: "2026-05-20T18:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Re-opened arc 008 with phase 006 scope: cocoindex dedup"
    next_safe_action: "Implement HttpSidecarRerankerAdapter"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py"
      - ".opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py"
---
# Feature Specification: Cocoindex dedup from shared rerank sidecar

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

Phase 006 of arc 008-rerank-sidecar-arc — re-opens the arc to finish what was originally intended: actually de-duplicate Qwen across spec-memory + cocoindex by moving cocoindex onto the shared sidecar.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Shipped - PROMOTE |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` (re-opened from complete → in_progress) |
| **Predecessor** | `005-promote-qwen-as-default` (HOLD verdict for spec-memory; does NOT apply to cocoindex's dedup decision — cocoindex's own benchmark proves Qwen viable for code chunks) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Arc 008 was scoped around **deduplication** — ship one shared cross-encoder sidecar so both spec-memory and cocoindex stop bundling independent Qwen instances. The arc shipped phases 001-005:

- 001: spec-memory routing fix
- 002: `system-rerank-sidecar` skill (the shared sidecar)
- 003: launcher integration helpers (`.cjs` for spec-memory, `.py` for cocoindex)
- 004: A/B benchmark for spec-memory's promotion decision
- 005: HOLD — spec-memory's `SPECKIT_CROSS_ENCODER` stays default-off

But cocoindex was never actually moved off its bundled Qwen. `mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:137-143` still loads `CrossEncoder(...)` in-process. The shared sidecar runs idle when spec-memory's opt-in flag is off. Both consumers ship Qwen separately — ~1.5 GB RAM duplicated when both MCPs run. The arc's stated intent is unfulfilled.

Critically: the phase 005 HOLD verdict was about **spec-memory's specific load profile** (sustained 250-probe `memory_search` calls timed out the sidecar). It was NOT a verdict on the sidecar's ability to serve cocoindex's code-search load profile. Cocoindex's own benchmark at `mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-expanded/` already proved Qwen handles code chunks at p95 ≤ 2s with the same model. The two decisions were never coupled — we just sequenced them as if they were.

### Purpose

Move cocoindex's reranker dispatch onto the shared HTTP sidecar. After this packet ships:

1. **One Qwen instance** loaded across the workspace (in the sidecar) instead of two (one in cocoindex + one optionally in spec-memory).
2. **Cocoindex consumes via HTTP** at `localhost:8765/rerank` through a new `HttpSidecarRerankerAdapter`, dispatched via `COCOINDEX_RERANK_VIA_SIDECAR` env var.
3. **Resilient fallback** — if the sidecar is unavailable, the existing bundled `CrossEncoderRerankerAdapter` runs in-process as it does today. No production regression.
4. **A/B benchmark on cocoindex's own corpus** — same fixture as `benchmark-2026-05-20-expanded`, with the sidecar arm vs the bundled arm. Decision rule applied; PROMOTE flips default and removes bundled `CrossEncoder` load entirely.

### Why this isn't pre-empted by phase 005 HOLD

- HOLD applies to spec-memory's `SPECKIT_CROSS_ENCODER` default-flip decision, not to cocoindex's adapter dispatch.
- The sidecar's `/rerank` contract is unchanged; this packet just adds a new consumer.
- If cocoindex's benchmark shows the sidecar regresses code-search latency, this packet ships the adapter as opt-in only (parallel to spec-memory's HOLD).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- New `HttpSidecarRerankerAdapter` class in `mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py`
- Update `get_reranker_adapter()` dispatch (lines 235-256) to route to the new adapter when `COCOINDEX_RERANK_VIA_SIDECAR=true`
- Add `COCOINDEX_RERANK_VIA_SIDECAR` env var to `cocoindex_code/config/config.py:746-768` (default `false` initially; PROMOTE flips to `true`)
- Fallback chain: HTTP failures → bundled `CrossEncoderRerankerAdapter` → positional ordering (existing `record_reranker_fallback` diagnostic)
- New test file `tests/test_http_sidecar_adapter.py` with mocked HTTP responses (using `respx` or `pytest-httpx`)
- A/B benchmark using the existing `benchmark-2026-05-20-expanded` fixture; results into a new benchmark subfolder
- PROMOTE path: remove the bundled `CrossEncoder` load + `revision` import in `CrossEncoderRerankerAdapter` (only the HTTP path remains the production code path)
- HOLD path: keep bundled adapter; ship HTTP adapter as opt-in
- Update `mcp-coco-index/SKILL.md` + `INSTALL_GUIDE.md` to document the new env var + the dependency on `system-rerank-sidecar`
- Re-open arc 008 parent: `status: in_progress`, `last_active_child_id: 006-...`, phase-map row 006

### Out of Scope

- **Removing `rerankers_jina_v3.py`** — jina remains an opt-in fallback per existing config
- **Spec-memory promotion re-attempt** — phase 005 HOLD stands. The CPU→MPS device tuning that would change the HOLD verdict is a separate future packet
- **New sidecar features** — the `system-rerank-sidecar` HTTP contract is unchanged
- **Path-class boost recalibration for sigmoid scores** — gated by existing `COCOINDEX_RERANK_PATH_CLASS_BOOST=false` default; operators who want boost on sigmoid must supply explicit factors (documented warning, no code change to the boost logic)
- **Schema/return-shape changes to `QueryResult`** — `pre_rerank_score` and `reranker_score` continue to hold whatever score the adapter returns (sigmoid `[0,1]` from sidecar instead of raw logits from bundled)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` | Modify | Add `HttpSidecarRerankerAdapter` class; update `get_reranker_adapter()` dispatch |
| `mcp-coco-index/mcp_server/cocoindex_code/config/config.py` | Modify | Add `COCOINDEX_RERANK_VIA_SIDECAR` env var parsing (line ~768) |
| `mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py` | Create | Mocked HTTP adapter tests (happy path, fallback chain) |
| `mcp-coco-index/mcp_server/tests/test_reranker.py` | Modify | Add 1-2 dispatch tests for the new env var routing |
| `mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/` | Create | Benchmark folder with sk-doc-compliant report; reuses the expanded fixture |
| `mcp-coco-index/SKILL.md` | Modify | Document `COCOINDEX_RERANK_VIA_SIDECAR` + sidecar dependency |
| `mcp-coco-index/INSTALL_GUIDE.md` | Modify | Same — operator-facing |
| `008-rerank-sidecar-arc/spec.md` (arc parent) | Modify | Phase-map row 006 + re-open status |
| `008-rerank-sidecar-arc/graph-metadata.json` (arc parent) | Modify | `children_ids` + `last_active_child_id` + `derived.status` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `HttpSidecarRerankerAdapter` exists and is dispatched when `COCOINDEX_RERANK_VIA_SIDECAR=true` | `test_dispatch_routes_to_http_when_env_set` passes |
| REQ-002 | HTTP failures fall back to bundled `CrossEncoderRerankerAdapter` | `test_http_5xx_falls_back_to_bundled` + `test_connection_refused_falls_back` pass |
| REQ-003 | Sigmoid scores from sidecar flow through to `QueryResult.reranker_score` unchanged | `test_sigmoid_scores_passed_through` passes; manual smoke shows scores in `[0,1]` |
| REQ-004 | A/B benchmark run completes with results.csv + per-probe.jsonl + sk-doc-compliant report | Benchmark folder exists with all 5 files; `sk-doc validate_document.py` exit 0 on the report |
| REQ-005 | Decision rule applied: ±1 hit AND p95 Δ ≤ +500ms AND no test regressions → PROMOTE; else HOLD | `benchmark_report.md` §8 RECOMMENDATIONS states the verdict |
| REQ-006 | If PROMOTE: bundled `CrossEncoderRerankerAdapter` CLASS is retained as the HTTP-failure fallback (per D-004) but is NOT instantiated eagerly at import time | `get_reranker_adapter` returns `HttpSidecarRerankerAdapter` by default; the bundled adapter only loads its model on first fallback path |
| REQ-007 | Cocoindex SKILL.md + INSTALL_GUIDE.md document the new env var + the sidecar dependency | Doc grep finds `COCOINDEX_RERANK_VIA_SIDECAR` + cross-link to `system-rerank-sidecar` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Arc parent updated to reflect re-open + phase 006 | Phase-map row exists; `last_active_child_id` = 006; `derived.status` = `in_progress` (or `complete` after this packet ships) |
| REQ-009 | Strict-validate this packet AND arc parent exit 0/0 | `bash validate.sh ... --strict` on both |
| REQ-010 | Cocoindex's existing `_ensure_rerank_sidecar_for_mcp` still spawns the sidecar at MCP startup | E2E smoke: cold cocoindex start → sidecar process exists → `ccc search` returns reranked results |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: When `COCOINDEX_RERANK_VIA_SIDECAR=true`, a `ccc search "..."` command returns reranked results where the sidecar's `model_loaded` flag becomes true and the request log (if `RERANK_LOG_PATH` set) shows the call
- **SC-002**: With the sidecar killed (`pkill rerank_sidecar`), cocoindex still returns reranked results via bundled fallback OR positional ordering (graceful degradation)
- **SC-003**: Benchmark `benchmark-2026-05-20-cocoindex-via-sidecar/results.csv` shows sidecar arm within ±1 hit of bundled baseline (30/73)
- **SC-004**: Benchmark p95 Δ ≤ +500ms (HTTP roundtrip cost acceptable)
- **SC-005**: PROMOTE path: bundled `CrossEncoder()` is instantiated lazily (only inside `_load_model()` on first fallback). `grep "CrossEncoder("` returns the call inside `_load_model` only — no eager top-level instantiation. HOLD path identical.
- **SC-006**: All cocoindex tests pass (`test_reranker.py` + `test_rerank_dispatch.py` + `test_http_sidecar_adapter.py`)
- **SC-007**: Strict-validate this packet + arc parent exit 0/0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Sidecar timeout under cocoindex's load profile (like spec-memory phase 004 saw) | Sidecar arm regresses → HOLD path ships, dedup is opt-in only | Benchmark catches it; HOLD path documented; CPU→MPS tuning queued |
| Risk | HTTP roundtrip cost adds significant latency | p95 Δ > +500ms gate fails → HOLD | Connection pooling via `httpx.Client` reused per process; localhost loopback should be sub-millisecond |
| Risk | Sigmoid score change shifts cocoindex's downstream sorting or path-class boost semantics | Order-stable per Explore Agent #2 analysis, but magnitudes differ — path-class boost would multiply normalized scores instead of raw logits | Path-class boost is already gated by `COCOINDEX_RERANK_PATH_CLASS_BOOST=false` default for non-BGE; operators who want boost must re-supply factors. Documented in INSTALL_GUIDE.md |
| Risk | Existing `_apply_path_class_boost` raises a warning when family != "jina_v3" without explicit factors | Warning noise during dispatch but no functional break | The HTTP adapter passes `reranker_family="cross_encoder"` like the existing adapter; same warning behavior |
| Risk | Sidecar's `/rerank` returns a `top_k` larger than cocoindex's expected | Cocoindex's existing logic handles tail truncation | Pass `top_k=len(head)` explicitly so sidecar doesn't over-truncate |
| Risk | Cocoindex's tests assume in-process `CrossEncoder` is monkeypatched | Existing tests need updating | Author new `test_http_sidecar_adapter.py` with `respx`/`pytest-httpx`; existing tests stay unchanged (they test the bundled path, which remains as fallback OR ships removed under PROMOTE) |
| Dependency | `system-rerank-sidecar` (arc 008 phase 002) | Required runtime dep | Already shipped; verified in arc 008 phase 003 smokes |
| Dependency | `_ensure_rerank_sidecar_for_mcp` in cocoindex's `cli.py:139-158` | Required to auto-spawn sidecar at MCP startup | Already shipped in arc 008 phase 003; verified present in this packet's Explore pass |
| Dependency | `httpx` Python dep | Already transitively included via FastAPI in cocoindex's pyproject.toml | Verify; no `requirements*.txt` change expected |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the HTTP adapter use `httpx.AsyncClient` or sync `httpx.Client`? **PROPOSED: sync `httpx.Client`** — cocoindex's `rerank()` is sync (lines 155-207); making it async would propagate up the entire call chain. localhost loopback latency is sub-ms; sync is fine.
- Should we share an `httpx.Client` instance across calls (connection pooling) or create one per call? **PROPOSED: module-level singleton** — same pattern as `_get_adapter()` caching the model. Saves connection setup cost (~1ms per call).
- If the benchmark shows borderline results (e.g. p95 Δ = +600ms — just above the gate), should phase 005 PROMOTE/HOLD logic apply, or is borderline a separate "advisory" verdict? **PROPOSED: strict gate — borderline is HOLD**. Same conservatism as spec-memory phase 005.
- Should the bundled `CrossEncoderRerankerAdapter` class itself be deleted on PROMOTE, or just the load-and-predict path? **PROPOSED: keep the class as a fallback** for when sidecar is unavailable. Just stop instantiating it at import time. The fallback chain stays operational.
- Does the existing `record_reranker_fallback` diagnostic need a new bucket for "sidecar fallback"? **PROPOSED: yes** — emit `"sidecar_unavailable"` reason when HTTP path fails. Operators can filter for this in the JSONL log.
<!-- /ANCHOR:questions -->
