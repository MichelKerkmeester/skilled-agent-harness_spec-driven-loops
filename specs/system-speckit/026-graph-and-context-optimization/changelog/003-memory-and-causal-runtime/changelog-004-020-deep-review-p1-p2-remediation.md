---
title: "Code Index Stack Phase 020: Deep Review P1/P2 Remediation"
description: "All nine P1 findings and all 31 P2 findings from the 019 combined deep-review of the mcp-coco-index retrieval pipeline were fixed. Changes harden the nomic default, bound unsafe env parsing, surface index failures accurately. Hybrid boosts are scaled to RRF. Operator docs now match shipped behavior."
trigger_phrases:
  - "020 deep review P1 P2 remediation"
  - "mcp-coco-index P1 fixes"
  - "CodeRankEmbed Jina hybrid RRF remediation"
  - "coco-index daemon index failure response"
  - "hybrid boost RRF scaling"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/020-deep-review-p1-p2-remediation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

The 019 combined deep-review (cli-devin plus cli-codex, 19 iterations) returned a FAIL verdict with nine P1 findings and 31 P2 findings across the mcp-coco-index retrieval pipeline. The defects covered a stale fresh-install default that bypassed nomic promotion, rollback docs that named wrong env-var prefixes, unbounded Jina max-doc-chars parsing that could crash on malformed env, an index-failure path that silently returned `success=True`, a smoke harness that unconditionally overwrote the embedder env, overpowering hybrid boosts that swamped empirical RRF calibration. Operator docs still described hybrid and rerank as default-off.

All nine P1 findings were fixed in commit `7eba2a4535` and all 31 P2 findings were fixed in commit `5060f6f031`, both landing on 2026-05-19. Every code change has a targeted regression test. The mcp-coco-index full pytest suite (172 tests) passed. Ruff reported no violations. Strict packet validation exited clean.

### Added

- `tests/test_rerank_matrix_analyze.py` (NEW) regression test that validates the analyzer skips `success=false` and timeout-signature runs.
- `evidence/query-expansion-root-cause-analysis.md` (NEW) packet-local RCA artifact documenting test/doc displacement amplified by FTS5 and dense-fanout expansion.
- ADR-022 in `decision-record.md` recording the hybrid boost scaling rationale and RRF dominance contract.
- ADR-023 appended to the stack-local ADR index documenting the nomic CodeRankEmbed promotion decision.
- Targeted regression tests in `test_settings.py`, `test_config.py`, `test_rerankers_jina_v3.py`, `test_daemon.py`, `test_dedup_mirrors.py` covering each P1 code fix.

### Changed

- `settings.py` `default_user_settings()` now derives the default model from `cocoindex_code.config._DEFAULT_MODEL` instead of a hard-coded stale string.
- `rerankers_jina_v3.py` Jina max-doc-chars env parsing replaced with the bounded `config._parse_int_env()` helper (range 1-50000, fallback 6000 with warning).
- `daemon.py` `_run_index()` re-raises exceptions after logging so the existing failure path yields `IndexResponse(success=False, message=...)`.
- `query.py` hybrid-only path-class shift scaled from `+0.05` to `+0.01` and canonical-resource boost from `+0.10` to `+0.02` to preserve RRF dominance under locked `K=60,V=0.9,F=0.5`.
- README, SKILL and INSTALL guide updated to reflect hybrid ON, rerank ON, Jina v3, nomic CodeRankEmbed with RRF weights `V=0.9/F=0.5/K=60` as the shipped defaults.
- `run-phase2-smoke.sh` embedder export changed from unconditional to `${COCOINDEX_CODE_EMBEDDING_MODEL:-sbert/BAAI/bge-code-v1}` so external overrides are honored.

### Fixed

- Fresh daemon installs defaulted to `google/embeddinggemma-300m` instead of the promoted nomic embedder, causing silent embedder mismatch on new deployments.
- 017 packet rollback docs named `COCOINDEX_RRF_*` env-var prefixes while production reads `COCOINDEX_HYBRID_*`, making operator rollback a no-op.
- Malformed `COCOINDEX_RERANK_JINA_MAX_DOC_CHARS` env crashed the default reranker before the protected model call.
- Index update exceptions were swallowed by a catch-all in `_run_index()` so callers received `IndexResponse(success=True)` even after a hard failure.
- Hybrid-stage additive boosts were 2-5x a typical rank-1 RRF score, overriding empirical calibration and producing incorrect top-1 results in close-ranking cases.
- Benchmark analyzer included `success=false` and timeout-signature runs in its verdict, distorting reranker comparison results.

### Verification

| Check | Result |
|-------|--------|
| `python -m pytest .opencode/skills/mcp-coco-index/tests/test_settings.py -v` | PASS, 20 passed |
| `python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py -v` | PASS, 30 passed |
| `python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_rerankers_jina_v3.py -v` | PASS, 5 passed |
| `python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py -v` | PASS, 14 passed |
| `bash -n .../phase2-bench/run-phase2-smoke.sh` | PASS |
| `python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_rerank_matrix_analyze.py -v` | PASS, 1 passed |
| Static `rg` audit of README, SKILL, INSTALL guide stale defaults | PASS |
| `python -m pytest .opencode/skills/mcp-coco-index/mcp_server/tests/test_dedup_mirrors.py -v` | PASS, 8 passed |
| Full suite `.venv/bin/python -m pytest tests/ -v` from `mcp_server` | PASS, 172 passed |
| `.venv/bin/python -m ruff check cocoindex_code tests/` from `mcp_server` | PASS |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 020-packet --strict` | PASS, 0 errors, 0 warnings |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py` | `default_user_settings()` derives model from `_DEFAULT_MODEL` constant. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py` | Bounded `_parse_int_env()` replaces raw `int()` for Jina max-doc-chars. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | `_run_index()` re-raises after logging to produce structured failure response. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Hybrid-only path-class boost scaled to `0.01`, canonical-resource boost to `0.02`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | JSON env-var byte and item caps, path-prefix rejection, RRF sweep validation. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/path_utils.py` | Centralized `normalize_mirror_prefix()` with malicious-prefix rejection. |
| `.opencode/skills/mcp-coco-index/README.md` | Defaults updated to hybrid ON, rerank ON, Jina v3, nomic, RRF weights. |
| `.opencode/skills/mcp-coco-index/SKILL.md` | Default claims aligned with shipped production config. |
| `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` | Default claims aligned, nomic CodeRankEmbed named as install default. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_rerank_matrix_analyze.py` (NEW) | Regression test for analyzer skipping failed and timeout-signature runs. |
| `020-deep-review-p1-p2-remediation/evidence/query-expansion-root-cause-analysis.md` (NEW) | RCA artifact for query-expansion regression mechanism. |
| `020-deep-review-p1-p2-remediation/decision-record.md` | ADR-022 added for hybrid boost scaling. ADR-023 added for nomic promotion. |

### Follow-Ups

- RRF lock evidence is bge-code-v1 scoped. Future embedders or rerankers need a replay sweep before claiming embedder-agnostic optimality.
- Sequential-thinking MCP was unavailable throughout this packet. Five-point preflight thoughts were recorded inline per batch as a fallback.
- Query expansion RCA is derived from existing rerank-score trace evidence, not a fresh controlled experiment. A fresh experiment is appropriate if opt-in default changes.
