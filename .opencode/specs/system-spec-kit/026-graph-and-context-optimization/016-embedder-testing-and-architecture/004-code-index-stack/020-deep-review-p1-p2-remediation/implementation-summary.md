---
title: "Implementation Summary: 020 Deep Review P1/P2 Remediation"
description: "All nine 019 P1 findings were remediated with scoped fixes, regression coverage, operator-doc alignment, and packet-local decision evidence."
trigger_phrases:
  - "020 P1 remediation implementation summary"
  - "mcp-coco-index P1 fixes"
  - "CodeRankEmbed Jina hybrid remediation evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/020-deep-review-p1-p2-remediation"
    last_updated_at: "2026-05-19T18:17:10Z"
    last_updated_by: "codex"
    recent_action: "All P1 sections documented and final validation passed."
    next_safe_action: "Main agent may review the diff and commit."
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests"
    session_dedup:
      fingerprint: "sha256:0204020402040204020402040204020402040204020402040204020402040204"
      session_id: "020-p1-remediation-codex"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: 020 Deep Review P1/P2 Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/020-deep-review-p1-p2-remediation/` |
| **Completed** | 2026-05-19 |
| **Level** | 2 |
| **P1 Findings Fixed** | 9/9 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All nine 019 P1 findings were remediated without broad refactors. The changes make fresh installs use the promoted nomic embedder, harden default Jina reranking against malformed env, report index failures accurately, keep hybrid boosts subordinate to calibrated RRF, and clean up the evidence and operator docs that guide future rollbacks and benchmarks.

### P1-A: Fresh daemon settings default to Nomic

- **Defect**: `default_user_settings()` wrote `google/embeddinggemma-300m`, bypassing the promoted `_DEFAULT_MODEL` for fresh daemon installs.
- **Fix**: `default_user_settings()` now derives its model from `cocoindex_code.config._DEFAULT_MODEL`.
- **Files changed**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py`; `.opencode/skills/mcp-coco-index/tests/test_settings.py`.
- **Tests**: `20 passed` via `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python -m pytest .opencode/skills/mcp-coco-index/tests/test_settings.py -v`.
- **Evidence**: Source confirmation at `settings.py:115-121`; regression assertion now checks the settings model equals `_DEFAULT_MODEL` from `config.py`.

### P1-B: RRF rollback env names match production

- **Defect**: The 017 packet docs still described `COCOINDEX_RRF_*` rollback/default env vars while production reads `COCOINDEX_HYBRID_*`.
- **Fix**: Updated the stale 017 packet docs to the production env-var names and added a doc-code alignment test for ADR-020.
- **Files changed**: `.opencode/specs/.../017-hybrid-fusion-empirical-recalibration/spec.md`; `plan.md`; `tasks.md`; `implementation-summary.md`; `description.json`; `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py`.
- **Tests**: `30 passed` via `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py -v`.
- **Evidence**: Source confirmation at `config.py:561-578` showed production uses `COCOINDEX_HYBRID_VECTOR_WEIGHT`, `COCOINDEX_HYBRID_FTS5_WEIGHT`, and `COCOINDEX_HYBRID_RRF_K`; ADR-020 already matched, and the 017 packet docs now match too.

### P1-C: Jina max-doc-chars env parsing is bounded

- **Defect**: `JinaRerankerAdapter.rerank()` parsed `COCOINDEX_RERANK_JINA_MAX_DOC_CHARS` with raw `int()`, so malformed env could crash before the protected model call.
- **Fix**: Reused `config._parse_int_env()` with bounds `1..50000`, falling back to `6000` with a warning.
- **Files changed**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py`; `.opencode/skills/mcp-coco-index/mcp_server/tests/test_rerankers_jina_v3.py`.
- **Tests**: `5 passed` via `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_rerankers_jina_v3.py -v`.
- **Evidence**: Source confirmation at `rerankers_jina_v3.py:145-153`; regression test sets `COCOINDEX_RERANK_JINA_MAX_DOC_CHARS=bad`, observes warning, and still gets reranked output.

### P1-D: Index failures return failure responses

- **Defect**: `_run_index()` logged and suppressed `project.update_index()` exceptions, letting `update_index()` emit `IndexResponse(success=True)`.
- **Fix**: `_run_index()` now re-raises after logging so the existing `index_task.result()` failure path yields `IndexResponse(success=False, message=...)`.
- **Files changed**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`; `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py`.
- **Tests**: `14 passed` via `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py -v`.
- **Evidence**: Source confirmation at `daemon.py:392-448`; regression test injects `RuntimeError("boom")` from `project.update_index()` and asserts terminal `IndexResponse(success=False, message="boom")`.

### P1-E: Phase 2 smoke harness honors embedder override

- **Defect**: `run-phase2-smoke.sh` unconditionally exported `COCOINDEX_CODE_EMBEDDING_MODEL=sbert/BAAI/bge-code-v1`, contradicting the nomic reproduction instructions.
- **Fix**: The harness now uses `${COCOINDEX_CODE_EMBEDDING_MODEL:-sbert/BAAI/bge-code-v1}` and the benchmark report shows the required nomic env-prefix invocation.
- **Files changed**: `.opencode/specs/.../011-rerank-model-fit-investigation/research/phase2-bench/run-phase2-smoke.sh`; `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md`.
- **Tests**: `bash -n .opencode/specs/.../phase2-bench/run-phase2-smoke.sh` passed.
- **Evidence**: Source confirmation at `run-phase2-smoke.sh:56-59`; static check shows the script default is overridable and the report includes `COCOINDEX_CODE_EMBEDDING_MODEL=sbert/nomic-ai/CodeRankEmbed`.

### P1-F: Rerank matrix analyzer skips failed runs

- **Defect**: `rerank-matrix-analyze.py` loaded every `lane*-iter*.json` file, allowing `success=false` or timeout-signature runs to affect the verdict.
- **Fix**: The loader now excludes `success=false` and `hit_rate=0.0` with `latency_ms.mean > 25000`, and the rendered report lists skipped runs in a warning section.
- **Files changed**: `.opencode/specs/.../011-rerank-model-fit-investigation/research/phase2-bench/rerank-matrix-analyze.py`; `.opencode/skills/mcp-coco-index/mcp_server/tests/test_rerank_matrix_analyze.py`.
- **Tests**: `1 passed` via `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_rerank_matrix_analyze.py -v`.
- **Evidence**: Source confirmation at `rerank-matrix-analyze.py:57-66`; regression test feeds valid, `success=false`, and 32-second zero-hit JSONs and asserts only the valid lane appears in the verdict.

### P1-G: Operator docs match shipped defaults

- **Defect**: User-facing docs still described hybrid/rerank as default-off and named obsolete GTE/BGE/EmbeddingGemma defaults.
- **Fix**: Updated README, SKILL, and INSTALL guide default claims to hybrid ON, rerank ON, Jina v3 reranker, nomic CodeRankEmbed embedder, and RRF weights `V=0.9/F=0.5/K=60`.
- **Files changed**: `.opencode/skills/mcp-coco-index/README.md`; `.opencode/skills/mcp-coco-index/SKILL.md`; `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md`.
- **Tests**: Static `rg` audit passed with no stale default-off/GTE/BGE/EmbeddingGemma default claims in the three user-facing docs.
- **Evidence**: Source confirmation at `README.md:69-91`, `SKILL.md:18`, and `INSTALL_GUIDE.md:101,339-362,998-1000`; docs now name the same defaults as `config.py`.

### P1-H: Hybrid boosts are scaled to RRF

- **Defect**: Hybrid-stage path and canonical additive boosts (`+0.05`, `+0.10`) were larger than a typical rank-1 two-lane RRF score under `K=60,V=0.9,F=0.5`.
- **Fix**: Scaled hybrid-only path-class shifts to `0.01` and canonical-resource boost to `0.02`; vector-only scoring remains unchanged.
- **Files changed**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py`; `.opencode/skills/mcp-coco-index/mcp_server/tests/test_dedup_mirrors.py`; `.opencode/specs/.../020-deep-review-p1-p2-remediation/decision-record.md`.
- **Tests**: `8 passed` via `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_dedup_mirrors.py -v`.
- **Evidence**: Source confirmation at `query.py:473-487`; regression test proves a strong RRF lead remains top-1 even when the lower-RRF item has implementation and canonical-resource boosts.

### P1-I: Query expansion regression has RCA

- **Defect**: Query expansion shipped opt-in after a corrected-fixture regression without an explicit root-cause analysis artifact.
- **Fix**: Added packet-local RCA evidence and appended ADR-019 with the likely mechanism: test/doc displacement amplified by broad FTS5 and dense fanout expansion.
- **Files changed**: `.opencode/specs/.../020-deep-review-p1-p2-remediation/evidence/query-expansion-root-cause-analysis.md`; `.opencode/specs/.../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md`.
- **Tests**: `15 passed` via `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_query_expansion.py -v`.
- **Evidence**: Source confirmation at `query_expansion.py:187-198,243-249` and ADR-019; RCA cites rerank-score traces where docs/tests enter ahead of expected implementation targets.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each P1 started with source confirmation and a five-point preflight because the sequential-thinking MCP was unavailable. Code changes stayed in the cited files where possible, tests were added beside existing matching tests, and evidence/docs changes were kept in the relevant historical packet or this 020 packet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep production RRF env names and update stale docs. | Production already used the correct `COCOINDEX_HYBRID_*` names, and ADR-020 matched. Adding aliases would increase config surface without fixing the stale source of operator confusion. |
| Re-raise `_run_index()` failures. | Existing `update_index()` already had a task-result exception path that emits `success=False`; re-raising is the smallest fix that uses that contract. |
| Scale hybrid boosts instead of replacing them with multipliers. | Scaling additive boosts has the fewest downstream effects and preserves current close-tie behavior while restoring RRF dominance. |
| Defer deeper query-expansion experiment and document RCA from existing evidence. | Query expansion is opt-in and disabled by default; the fastest P1-safe remediation was an explicit root-cause artifact tied to existing rerank-score traces. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python -m pytest .opencode/skills/mcp-coco-index/tests/test_settings.py -v` | PASS, 20 passed |
| `python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py -v` | PASS, 30 passed |
| `python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_rerankers_jina_v3.py -v` | PASS, 5 passed |
| `python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py -v` | PASS, 14 passed |
| `bash -n .opencode/specs/.../phase2-bench/run-phase2-smoke.sh` | PASS |
| `python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_rerank_matrix_analyze.py -v` | PASS, 1 passed |
| Static `rg` audit of README, SKILL, INSTALL guide stale defaults | PASS |
| `python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_dedup_mirrors.py -v` | PASS, 8 passed |
| `python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_query_expansion.py -v` | PASS, 15 passed |
| `.venv/bin/python -m pytest tests/ -v` from `mcp_server` | PASS, 152 passed |
| `.venv/bin/python -m ruff check cocoindex_code tests/` from `mcp_server` | PASS |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <020-packet> --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Sequential-thinking MCP unavailable.** Every MCP call was cancelled, so the required five thoughts were recorded inline as fallback preflights.
2. **Query expansion RCA is evidence-based, not a fresh experiment.** This matches the operator's accepted punt path because query expansion is already opt-in and default-false.
<!-- /ANCHOR:limitations -->
