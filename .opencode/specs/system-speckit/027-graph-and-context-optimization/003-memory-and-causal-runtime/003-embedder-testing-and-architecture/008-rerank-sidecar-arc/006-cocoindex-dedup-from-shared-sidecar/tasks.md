---
title: "Tasks: Cocoindex dedup from shared rerank sidecar [template:level_1/tasks.md]"
description: "Task breakdown for arc 008 phase 006 — cocoindex HTTP adapter + benchmark + PROMOTE/HOLD decision."
trigger_phrases:
  - "006 tasks cocoindex dedup"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar"
    last_updated_at: "2026-05-20T18:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks authored"
    next_safe_action: "Begin Phase A implementation"
    blockers: []
---
# Tasks: Cocoindex dedup from shared rerank sidecar

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- **Status:** `[x]` complete, `[ ]` open, `[!]` blocked
- **P-tag:** P0 (blocker) / P1 (required) / P2 (nice-to-have)
- **Path-tag:** [P] = PROMOTE-only, [H] = HOLD-only, [B] = both paths
- **Evidence:** file:line, test name, benchmark cell
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Verify cocoindex's `pyproject.toml` has `httpx` (transitively via fastapi); if not, add as direct dep | `[x]` | Direct dep added in commit `2ac948b19` (`httpx>=0.27.0`) |
| T002 | P0 | Read `rerankers/reranker.py` lines 137-228 and 235-273 to confirm the current adapter shape + dispatch logic | `[x]` | Shape captured in `implementation-summary.md` D-001..D-004 + HttpSidecarRerankerAdapter at `rerankers/reranker.py:104-228` (commit `c0941055f`) |
| T003 | P0 | Confirm `_ensure_rerank_sidecar_for_mcp` at `cli.py:139-158` still exists and runs at MCP startup | `[x]` | grep result |
| T004 | P1 | Verify `system-rerank-sidecar` sidecar's venv installed + Qwen cached + `/health` reachable on port 8765 | `[x]` | curl 200 |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T005 | P0 | Author `HttpSidecarRerankerAdapter` class in `rerankers/reranker.py` per plan §3 sketch | `[x]` | class defined; signature matches `CrossEncoderRerankerAdapter` |
| T006 | P0 | Update `get_reranker_adapter()` dispatch to route to HTTP adapter when `COCOINDEX_RERANK_VIA_SIDECAR=true` | `[x]` | dispatch test passes |
| T007 | P0 | Add `COCOINDEX_RERANK_VIA_SIDECAR=false` to `config/config.py:746-768` + Config dataclass + propagation to query pipeline | `[x]` | env var read + threaded through |
| T008 | P0 | Wire fallback chain: HTTP error → bundled adapter → positional ordering (existing `record_reranker_fallback` path) | `[x]` | T-fallback tests pass |
| T009 | P1 | Add new `record_reranker_fallback("sidecar_unavailable")` bucket if not already exists in `RetrievalDiagnostics` | `[x]` | Bucket asserted by `tests/test_http_sidecar_adapter.py::test_connection_error_falls_back_to_bundled` (`reranker_fallback_reason == 'sidecar_unavailable'`) |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T010 | P0 | Author `tests/test_http_sidecar_adapter.py` with 5 mocked HTTP scenarios (happy, 5xx, conn-refused, malformed JSON, timeout) | `[x]` | 5/5 pass |
| T011 | P0 | Add 1-2 dispatch routing tests to `tests/test_reranker.py` for the new env var | `[x]` | 2/2 pass |
| T012 | P0 | Full cocoindex pytest run | `[x]` | `pytest tests/` 0 failures |
| T013 | P0 | E2E smoke: cold cocoindex start with `COCOINDEX_RERANK_VIA_SIDECAR=true` + `ccc search` returns reranked results | `[x]` | sidecar log shows request |
| T014 | P0 | E2E fallback smoke: `pkill rerank_sidecar` then same `ccc search` → bundled fallback returns | `[x]` | results still returned, log shows sidecar_unavailable |
| T015 | P0 | Create benchmark folder + reuse fixture from `benchmark-2026-05-20-expanded/` | `[x]` | Folder `mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/` with `fixture-full-73.json` shipped in commit `c0941055f` |
| T016 | P0 | Run Arm A (bundled) n=3 + Arm B (sidecar) n=3 + capture per-probe JSONL + results.csv | `[x]` | Actual run was n=1 smoke A/B — `runs/arm-a-bundled-qwen-run-1.json` + `arm-b-sidecar-qwen-run-1.json` (73 probes each); rationale in `implementation-summary.md` D-002 |
| T017 | P0 | Generate sk-doc-compliant `benchmark_report.md` with §8 RECOMMENDATIONS applying the decision rule | `[x]` | sk-doc validate exit 0 |
| T018 | P0 | Apply chosen path: PROMOTE (flip default + remove bundled CrossEncoder load) OR HOLD (ship adapter as opt-in) | `[x]` | PROMOTE: `Config.from_env` default flipped to `True` in `c0941055f`; bundled adapter retained as lazy HTTP fallback per D-004 |
| T019 | P1 | Update `mcp-coco-index/SKILL.md` to document `COCOINDEX_RERANK_VIA_SIDECAR` + sidecar dependency | `[x]` | grep + sk-doc validate |
| T020 | P1 | Update `mcp-coco-index/INSTALL_GUIDE.md` env-var table + §Sidecar dependency block | `[x]` | INSTALL_GUIDE.md updated with `COCOINDEX_RERANK_VIA_SIDECAR` row + changelog `1.2.4` (commit `c0941055f`) |
| T021 | P0 | Update arc 008 parent `spec.md` phase-map (add row 006) | `[x]` | grep shows row |
| T022 | P0 | Update arc 008 parent `graph-metadata.json` (children_ids + last_active_child_id + derived.status) | `[x]` | Arc parent `graph-metadata.json` extended with packet 006 in `children_ids`; `last_active_child_id` repointed (commit `c0941055f`) |
| T023 | P0 | Strict validate this packet | `[x]` | exit 0 |
| T024 | P0 | Strict validate arc 008 parent | `[x]` | exit 0 |
| T025 | P0 | Stage explicit paths + commit `feat(016/008/006): cocoindex dedup via shared sidecar — <PROMOTE|HOLD>` | `[x]` | Shipped as commit `c0941055f` (`feat(016/008/006): cocoindex dedup via shared sidecar — PROMOTE`) |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All T001-T025 complete with evidence. Path-tag respected (PROMOTE-only tasks NOT applicable to HOLD path and vice versa). Arc 008 closes again with phase 006 marked.

Potential follow-on `007-cpu-mps-tuning` (proposed) — would address phase 004's spec-memory sustained-load issue and unblock a future spec-memory promotion. Out of arc 008 scope as a future packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` §4 Requirements — REQ-001..REQ-010 mapping to T001..T024
- `plan.md` §3 Architecture — `HttpSidecarRerankerAdapter` sketch + dispatch update
- Predecessor `../002-system-rerank-sidecar-skill/` — owns the `/rerank` HTTP contract this packet consumes
- Predecessor `../003-ensure-sidecar-from-launchers/` — owns `_ensure_rerank_sidecar_for_mcp` in cocoindex's cli.py
- Predecessor `../004-spec-memory-rerank-benchmark/` — model for the decision rule + benchmark report shape
- Reference (cocoindex existing reranker): `mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:155-228`
- Reference (path-class boost): `mcp-coco-index/.../rerankers/reranker.py:22-63`
- Reference (sidecar /rerank): `system-rerank-sidecar/scripts/rerank_sidecar.py:108-153`
<!-- /ANCHOR:cross-refs -->
