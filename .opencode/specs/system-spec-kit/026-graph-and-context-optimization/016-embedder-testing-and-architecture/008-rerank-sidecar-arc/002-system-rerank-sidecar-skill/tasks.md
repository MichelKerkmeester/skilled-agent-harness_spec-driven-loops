---
title: "Tasks: system-rerank-sidecar skill [template:level_1/tasks.md]"
description: "Task breakdown for the dedicated Qwen reranker HTTP sidecar skill."
trigger_phrases:
  - "002 tasks sidecar skill"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/002-system-rerank-sidecar-skill"
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
| T001 | P0 | `mkdir -p .opencode/skills/system-rerank-sidecar/{scripts,tests}` | `[ ]` | (pending) |
| T002 | P0 | Author `pyproject.toml` pinning fastapi, uvicorn, sentence-transformers, torch to cocoindex-matching versions | `[ ]` | `pip freeze` diff vs cocoindex venv = empty for these |
| T003 | P0 | Author `.env.example` with RERANK_SIDECAR_PORT (8765), RERANK_MODEL_NAME (Qwen/Qwen3-Reranker-0.6B), RERANK_MODEL_REVISION (commit sha), RERANK_LOG_PATH (unset) | `[ ]` | (pending) |
| T004 | P1 | Lookup current Qwen3-Reranker-0.6B HuggingFace revision sha; pin in .env.example + rerank_sidecar.py | `[ ]` | `huggingface_hub.hf_hub_download` log line shows pinned sha |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T005 | P0 | Author `rerank_sidecar.py` with `/health`, `/warmup`, `/rerank` endpoints + `asyncio.Lock` + sigmoid normalization | `[ ]` | (pending) |
| T006 | P0 | Add SIGTERM/SIGINT handler that releases model + drains in-flight requests | `[ ]` | pytest test_sigterm_clean_shutdown passes |
| T007 | P1 | Add structured JSONL request log gated on `RERANK_LOG_PATH` env var | `[ ]` | log file appears when env set; empty when unset |
| T008 | P0 | Author `scripts/install.sh` (create .venv, pip install) | `[ ]` | fresh checkout: install.sh exit 0 |
| T009 | P0 | Author `scripts/start.sh` (activate venv, exec uvicorn) | `[ ]` | start.sh binds port; `curl /health` returns 200 |
| T010 | P1 | Author SKILL.md (HTTP contract, lifecycle, env vars, troubleshooting, RAM budget) | `[ ]` | (pending) |
| T011 | P2 | Author README.md (operator quickstart: install + start + first /rerank curl) | `[ ]` | (pending) |
| T012 | P1 | Author `graph-metadata.json` for skill discovery by advisor | `[ ]` | (pending) |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T013 | P0 | Pytest: `test_health_before_model_load` | `[ ]` | Passes |
| T014 | P0 | Pytest: `test_rerank_basic` — sigmoid bounds + apple > QCD | `[ ]` | Passes |
| T015 | P0 | Pytest: `test_concurrent_requests_serialized` — 5 parallel /rerank | `[ ]` | All complete in strict order |
| T016 | P0 | Pytest: `test_sigterm_clean_shutdown` | `[ ]` | Passes |
| T017 | P0 | Strict validate this packet | `[ ]` | Exit 0 |
| T018 | P1 | Manual smoke: install + start + cold /warmup + warm /rerank curl | `[ ]` | <25s cold, <500ms warm |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All T001-T017 with evidence. T018 nice-to-have (operator smoke). Phase 003 of the arc unblocks once T017 passes.
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
