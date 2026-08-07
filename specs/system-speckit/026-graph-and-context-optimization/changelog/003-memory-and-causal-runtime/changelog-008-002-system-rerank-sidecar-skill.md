---
title: "Rerank Sidecar Arc Phase 002: system-rerank-sidecar Skill"
description: "Builds the shared HTTP cross-encoder sidecar skill at .opencode/skills/system-rerank-sidecar/. FastAPI service backed by Qwen3-Reranker-0.6B with sigmoid normalization, asyncio.Lock serialization, three endpoints plus a passing pytest suite."
trigger_phrases:
  - "system-rerank-sidecar skill"
  - "qwen3 reranker sidecar"
  - "fastapi rerank http service"
  - "cross-encoder sidecar phase 002"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-20

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/002-system-rerank-sidecar-skill`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc`

### Summary

After phase 001 unblocked routing to the HTTP cross-encoder path in `cross-encoder.ts`, nothing was answering at `localhost:8765/rerank`. spec-memory fell back to positional scores and both MCPs carried their own copy of Qwen3-Reranker-0.6B at 1.5 GB each.

Phase 002 created `.opencode/skills/system-rerank-sidecar/` as a dedicated shared infrastructure skill whose only output is a runnable Python HTTP service. The service exposes `GET /health`, `POST /warmup`, `POST /rerank`. It serializes `model.predict()` calls behind an `asyncio.Lock` and applies sigmoid normalization at the sidecar boundary so consumers receive scores in `[0,1]` rather than raw Qwen logits. The model revision is pinned to a specific HuggingFace commit sha with `local_files_only=True` so cache misses fail loudly instead of triggering a 1.5 GB download.

All four pytest cases passed. install.sh exited 0. The smoke run confirmed apple scored 0.984 against quantum chromodynamics at 0.0004, validating ranking signal. Phase 003 (launcher integration) was unblocked on completion.

### Added

- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` (NEW): FastAPI sidecar with `GET /health`, `POST /warmup`, `POST /rerank`. Lazy `CrossEncoder` load with `asyncio.Lock` serialization, sigmoid normalization, JSONL request log.
- `.opencode/skills/system-rerank-sidecar/scripts/install.sh` (NEW): venv creator that finds Python 3.11+, installs editable package, then import-checks sentence-transformers, FastAPI, uvicorn
- `.opencode/skills/system-rerank-sidecar/scripts/start.sh` (NEW): loads `.env` then `.env.local`, activates venv, execs uvicorn on `127.0.0.1` with one worker
- `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py` (NEW): pytest suite covering health endpoint, `/rerank` basic case, sigmoid normalization bounds, concurrent-request serialization
- `.opencode/skills/system-rerank-sidecar/SKILL.md` (NEW): HTTP contract, lifecycle, env vars, RAM budget, troubleshooting guide
- `.opencode/skills/system-rerank-sidecar/pyproject.toml` (NEW): pinned deps matching cocoindex versions (fastapi, uvicorn, sentence-transformers 5.4.1, torch 2.12.0)
- `.opencode/skills/system-rerank-sidecar/.env.example` (NEW): operator config surface for `RERANK_SIDECAR_PORT`, `RERANK_MODEL_NAME`, `RERANK_MODEL_REVISION`, `RERANK_LOG_PATH`, `RERANK_DEVICE`
- `.opencode/skills/system-rerank-sidecar/README.md` (NEW): operator quickstart
- `.opencode/skills/system-rerank-sidecar/graph-metadata.json` (NEW): skill metadata for advisor discovery

### Changed

- None.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| `bash scripts/install.sh` | PASS. Exit 0. sentence-transformers, fastapi, uvicorn import checks passed. |
| `.venv/bin/pytest tests/` | PASS. 4 passed in 31.67s. |
| `GET /health` smoke | PASS. 200 returned with `model_loaded: false` before warmup. |
| `POST /warmup` smoke | PASS. Model loaded from local cache snapshot `e61197ed45024b0ed8a2d74b80b4d909f1255473`. |
| `POST /rerank` smoke | PASS. apple score 0.984, QCD score 0.0004. Ranking signal confirmed. Latency 1039ms cold call. |
| py_compile syntax check | PASS. Exit 0 for `rerank_sidecar.py` and `test_rerank_sidecar.py`. |
| `validate.sh --strict` | PASS. Errors 0, Warnings 0. |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` (NEW) | Created FastAPI sidecar with 3 endpoints and asyncio.Lock serialization |
| `.opencode/skills/system-rerank-sidecar/scripts/install.sh` (NEW) | Created venv install script |
| `.opencode/skills/system-rerank-sidecar/scripts/start.sh` (NEW) | Created uvicorn launcher wrapper |
| `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py` (NEW) | Created pytest suite (4 cases) |
| `.opencode/skills/system-rerank-sidecar/SKILL.md` (NEW) | Created HTTP contract and operator docs |
| `.opencode/skills/system-rerank-sidecar/pyproject.toml` (NEW) | Created pinned dependency file |
| `.opencode/skills/system-rerank-sidecar/.env.example` (NEW) | Created operator config template |
| `.opencode/skills/system-rerank-sidecar/README.md` (NEW) | Created operator quickstart |
| `.opencode/skills/system-rerank-sidecar/graph-metadata.json` (NEW) | Created skill advisor metadata |

### Follow-Ups

- Run phase 003 to wire the ensure-sidecar helper into both `mk-spec-memory-launcher.cjs` and `mk-code-index-launcher.cjs` so launchers probe, start, then warm the shared sidecar automatically.
- Run phase 004 A/B benchmark before promoting the sidecar as the default cross-encoder path in spec-memory.
- Consider adding `POST /rerank/batch` for batching multiple query/document pairs in one HTTP call once phase 004 benchmark establishes per-request latency characteristics.
- Verify `pyproject.toml` dep versions remain aligned with cocoindex after any upstream torch or sentence-transformers updates.
