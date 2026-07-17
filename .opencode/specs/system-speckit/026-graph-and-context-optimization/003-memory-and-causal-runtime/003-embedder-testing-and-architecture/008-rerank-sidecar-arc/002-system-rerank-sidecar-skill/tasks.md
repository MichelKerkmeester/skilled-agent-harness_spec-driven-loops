---
title: "Tasks: system-rerank-sidecar skill [template:level_1/tasks.md]"
description: "Task breakdown for the dedicated Qwen reranker HTTP sidecar skill."
trigger_phrases:
  - "002 tasks sidecar skill"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/002-system-rerank-sidecar-skill"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks authored"
    next_safe_action: "Begin Phase A scaffold"
    blockers: []
---
# Tasks: system-rerank-sidecar skill

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- **Status:** `[x]` complete, `[ ]` open, `[!]` blocked
- **P-tag:** P0 (blocker) / P1 (required) / P2 (nice-to-have)
- **Evidence:** file path, test name, or curl output
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | `mkdir -p .opencode/skills/system-rerank-sidecar/{scripts,tests}` | `[x]` | Directories created: `.opencode/skills/system-rerank-sidecar/scripts`, `.opencode/skills/system-rerank-sidecar/tests` |
| T002 | P0 | Author `pyproject.toml` pinning fastapi, uvicorn, sentence-transformers, torch to cocoindex-matching versions | `[x]` | `.opencode/skills/system-rerank-sidecar/pyproject.toml`; pins `sentence-transformers==5.4.1` to match cocoindex, `torch==2.12.0` from the Python 3.11 resolver for that pin |
| T003 | P0 | Author `.env.example` with RERANK_SIDECAR_PORT (8765), RERANK_MODEL_NAME (Qwen/Qwen3-Reranker-0.6B), RERANK_MODEL_REVISION (commit sha), RERANK_LOG_PATH (unset) | `[x]` | `.opencode/skills/system-rerank-sidecar/.env.example` |
| T004 | P1 | Lookup current Qwen3-Reranker-0.6B HuggingFace revision sha; pin in .env.example + rerank_sidecar.py | `[x]` | Cache snapshot exists: `~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B/snapshots/e61197ed45024b0ed8a2d74b80b4d909f1255473`; pinned in `.env.example` and `scripts/rerank_sidecar.py` |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T005 | P0 | Author `rerank_sidecar.py` with `/health`, `/warmup`, `/rerank` endpoints + `asyncio.Lock` + sigmoid normalization | `[x]` | `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` |
| T006 | P0 | Add SIGTERM/SIGINT handler that releases model + drains in-flight requests | `[x]` | `scripts/start.sh` execs uvicorn; FastAPI lifespan shutdown releases `_model`; final evidence from `test_sigterm_clean_shutdown` |
| T007 | P1 | Add structured JSONL request log gated on `RERANK_LOG_PATH` env var | `[x]` | `scripts/rerank_sidecar.py` writes one JSON line only when `RERANK_LOG_PATH` is set; final evidence from manual log smoke |
| T008 | P0 | Author `scripts/install.sh` (create .venv, pip install) | `[x]` | `.opencode/skills/system-rerank-sidecar/scripts/install.sh`; final install exit evidence captured in implementation-summary.md |
| T009 | P0 | Author `scripts/start.sh` (activate venv, exec uvicorn) | `[x]` | `.opencode/skills/system-rerank-sidecar/scripts/start.sh`; final curl evidence captured in implementation-summary.md |
| T010 | P1 | Author SKILL.md (HTTP contract, lifecycle, env vars, troubleshooting, RAM budget) | `[x]` | `.opencode/skills/system-rerank-sidecar/SKILL.md` |
| T011 | P2 | Author README.md (operator quickstart: install + start + first /rerank curl) | `[x]` | `.opencode/skills/system-rerank-sidecar/README.md` |
| T012 | P1 | Author `graph-metadata.json` for skill discovery by advisor | `[x]` | `.opencode/skills/system-rerank-sidecar/graph-metadata.json` |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T013 | P0 | Pytest: `test_health_before_model_load` | `[x]` | `.venv/bin/pytest tests/` => `4 passed in 31.67s`; `test_health_before_model_load` passed |
| T014 | P0 | Pytest: `test_rerank_basic` — sigmoid bounds + apple > QCD | `[x]` | `.venv/bin/pytest tests/` => `4 passed in 31.67s`; smoke `/rerank` returned apple `0.9840936082881853` > QCD `0.0003799845147518645` |
| T015 | P0 | Pytest: `test_concurrent_requests_serialized` — 5 parallel /rerank | `[x]` | `.venv/bin/pytest tests/` => `4 passed in 31.67s`; `test_rerank_concurrent_requests_serialized` passed |
| T016 | P0 | Pytest: `test_sigterm_clean_shutdown` | `[x]` | `.venv/bin/pytest tests/` => `4 passed in 31.67s`; manual smoke `sidecar exit code: 0` |
| T017 | P0 | Strict validate this packet | `[x]` | `validate.sh ... --strict` => `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED` |
| T018 | P1 | Manual smoke: install + start + cold /warmup + warm /rerank curl | `[x]` | `bash scripts/install.sh` exit 0; `/health`, `/warmup`, `/rerank` returned 2xx; local-only smoke observed no HuggingFace HTTP calls; JSONL log rows: 1 |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All T001-T018 completed with evidence. Phase 003 of the arc is unblocked.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` §4 Requirements — REQ-001..REQ-007 mapping to T002..T016
- `plan.md` §3 Architecture — skill layout + rerank_sidecar.py code sketch
- Parent arc `../spec.md` §1 — root purpose
- Sibling phase `../001-flag-routing-fix-for-cross-encoder/` — must land before this is reachable
- Sibling phase `../003-ensure-sidecar-from-launchers/` — the consumer of this sidecar
- Cocoindex reference: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` (the adapter pattern this phase mirrors)
- Cocoindex install reference: `.opencode/skills/mcp-coco-index/scripts/install.sh` (the install.sh pattern this phase mirrors)
<!-- /ANCHOR:cross-refs -->
