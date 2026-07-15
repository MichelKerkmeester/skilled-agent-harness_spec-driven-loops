---
title: "Feature Specification: system-rerank-sidecar skill"
description: "Create a new dedicated `system-rerank-sidecar` skill at .opencode/skills/ housing a Python HTTP sidecar that serves cross-encoder reranking via Qwen/Qwen3-Reranker-0.6B. Sigmoid-normalized output, asyncio.Lock serialization, /health endpoint, bounded warmup. Independent infrastructure — neither spec-memory nor cocoindex owns it; both probe + attach via HTTP."
trigger_phrases:
  - "system-rerank-sidecar skill"
  - "qwen sidecar python"
  - "fastapi rerank sidecar"
  - "sentence-transformers cross-encoder skill"
  - "002 sidecar skill"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/002-system-rerank-sidecar-skill"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Spec authored from arc plan"
    next_safe_action: "Begin skill scaffold"
    blockers: []
    key_files:
      - ".opencode/skills/system-rerank-sidecar/SKILL.md"
      - ".opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py"
      - ".opencode/skills/system-rerank-sidecar/pyproject.toml"
      - ".opencode/skills/system-rerank-sidecar/.env.example"
---
# Feature Specification: system-rerank-sidecar skill

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

Phase 002 of the 008 rerank-sidecar arc. Build the shared HTTP cross-encoder service that lives in its own skill, with neither MCP owning it.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Predecessor** | `001-flag-routing-fix-for-cross-encoder` |
| **Successor** | `003-ensure-sidecar-from-launchers` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After phase 001 unblocks routing to the HTTP cross-encoder path, there is still nothing answering at `localhost:8765/rerank`. spec-memory falls back to positional scores, cocoindex bundles its own copy of Qwen3-Reranker-0.6B (≈1.5 GB RAM duplication when both MCPs run). The HTTP slot in `cross-encoder.ts:54-62` was designed for a sidecar that doesn't exist yet.

### Purpose

Create `.opencode/skills/system-rerank-sidecar/` as a dedicated skill whose only output is a runnable Python HTTP service. The service:

1. Loads `Qwen/Qwen3-Reranker-0.6B` via `sentence_transformers.CrossEncoder(model_name, trust_remote_code=True)` on first use (lazy, with a `/warmup` endpoint for explicit pre-loading).
2. Exposes `POST /rerank` accepting `{query: str, documents: list[str], top_k?: int}` and returning `{results: [{index: int, relevance_score: float}], model: str, latency_ms: int}`.
3. Exposes `GET /health` returning `{status: "ok", model_loaded: bool, queue_depth: int, uptime_s: float}` for the launcher probe.
4. Serializes `model.predict()` calls behind an `asyncio.Lock` to avoid the sentence-transformers thread-safety hazard.
5. Applies sigmoid to raw cross-encoder scores at the response boundary so consumers never see raw logits like `7.625` or `-11.375` that would collapse to `{1.0, 0.0}` under spec-memory's downstream `[0,1]` clamp.
6. Handles SIGTERM/SIGINT cleanly: drains in-flight requests, releases the model, exits.

The skill is structurally simple: one Python script, one pyproject.toml pinning sentence-transformers + Qwen3 dependencies, SKILL.md documenting the contract, an `.env.example` for port + model overrides, a small `scripts/start.sh` wrapper.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/skills/system-rerank-sidecar/SKILL.md` (~150 LOC documenting the HTTP contract, env vars, lifecycle, model details, troubleshooting)
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` (~80-100 LOC: FastAPI + uvicorn + sentence-transformers wrapper + asyncio.Lock + sigmoid)
- `.opencode/skills/system-rerank-sidecar/scripts/start.sh` (shell wrapper that activates the venv, sets defaults, exec's uvicorn — analogous to mcp-coco-index's `ccc` entrypoint pattern)
- `.opencode/skills/system-rerank-sidecar/pyproject.toml` (deps: fastapi, uvicorn, sentence-transformers, torch — same versions cocoindex pins for consistency)
- `.opencode/skills/system-rerank-sidecar/.env.example` (RERANK_SIDECAR_PORT, RERANK_MODEL_NAME, RERANK_MAX_TOP_K, etc.)
- `.opencode/skills/system-rerank-sidecar/README.md` (operator-facing quickstart)
- `.opencode/skills/system-rerank-sidecar/scripts/install.sh` (bash setup script: creates `.venv`, installs deps; mirrors `mcp-coco-index/scripts/install.sh` pattern)
- `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py` (pytest: /health, /rerank basic, sigmoid normalization assertion, asyncio.Lock serialization, graceful shutdown)

### Out of Scope

- **Launcher integration** — phase 003 wires the ensure-sidecar helper into both `mk-spec-memory-launcher.cjs` and `mk-code-index-launcher.cjs`. This phase just produces a runnable service.
- **Default model promotion** — phase 005 flips `cross-encoder.ts:55` after the phase 004 benchmark. This phase ships the sidecar that serves the model; whether spec-memory uses it as a default is a separate decision.
- **MCP protocol** — the sidecar is plain HTTP, not MCP. It serves internal RPC for two MCPs, not external Claude clients. No `.mcp.json` entry; no MCP tool registration.
- **Cocoindex integration** — phase 003 also handles cocoindex's transition from its bundled Qwen instance to the shared sidecar. This phase just provides the shared endpoint.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-rerank-sidecar/SKILL.md` | Create | HTTP contract + lifecycle docs |
| `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` | Create | FastAPI sidecar |
| `.opencode/skills/system-rerank-sidecar/scripts/start.sh` | Create | Launcher wrapper |
| `.opencode/skills/system-rerank-sidecar/scripts/install.sh` | Create | One-time venv install |
| `.opencode/skills/system-rerank-sidecar/pyproject.toml` | Create | Pinned deps |
| `.opencode/skills/system-rerank-sidecar/.env.example` | Create | Operator config surface |
| `.opencode/skills/system-rerank-sidecar/README.md` | Create | Operator quickstart |
| `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py` | Create | Pytest suite |
| `.opencode/skills/system-rerank-sidecar/graph-metadata.json` | Create | Skill metadata for discovery |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `POST /rerank` returns `{results: [{index, relevance_score}]}` with sigmoid-normalized scores in `[0,1]` | Pytest case asserts all returned scores satisfy `0.0 <= score <= 1.0` for adversarial pairs (high-similarity + high-dissimilarity in same batch) |
| REQ-002 | `GET /health` returns 200 with `{status, model_loaded, queue_depth, uptime_s}` even when the model is still loading | Pytest case hits /health before /rerank; expects `model_loaded=false` until first /rerank or /warmup; never 5xx |
| REQ-003 | Concurrent `/rerank` calls are serialized via `asyncio.Lock` | Pytest case fires N=5 parallel requests; asserts they complete in strictly increasing wall-clock order (no overlap); response order matches send order |
| REQ-004 | Sidecar shuts down cleanly on SIGTERM | Pytest case sends SIGTERM; in-flight request finishes; subsequent requests get connection-refused; process exits with code 0 within 5s |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | First-use model load completes within 20s on a warm machine | `start.sh` invokes `/warmup` after binding port; logs the load duration; CI gate: < 25s with cached model |
| REQ-006 | Pinned model version via HuggingFace revision sha (not just tag) | `rerank_sidecar.py` calls `CrossEncoder(model_name, trust_remote_code=True, revision=PIN)` where PIN is a specific commit hash |
| REQ-007 | `pyproject.toml` matches cocoindex's torch + sentence-transformers versions exactly | `pip freeze` diff between both venvs is empty for these packages |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .opencode/skills/system-rerank-sidecar/scripts/install.sh` exits 0 on a fresh machine and produces a working venv.
- **SC-002**: `bash .opencode/skills/system-rerank-sidecar/scripts/start.sh` binds port 8765 and serves `/health` within 3 seconds (model lazy-loaded on first /rerank).
- **SC-003**: `curl -X POST localhost:8765/rerank -d '{"query":"x","documents":["x","y"]}'` returns sigmoid-normalized scores within 15s on first call (cold), <500ms on warm calls.
- **SC-004**: `pytest tests/test_rerank_sidecar.py` passes all 4 P0 cases.
- **SC-005**: Strict validate exits 0 on this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Qwen3-Reranker model layout requires `trust_remote_code=True`; future Qwen revisions may break the wrapper | Sidecar fails to load model | Pin model `revision=` to a specific commit sha (REQ-006); track upstream releases manually |
| Risk | sentence-transformers + PyTorch combined RAM is ~1.5 GB warm; on a Mac with 16 GB, concurrent cocoindex + spec-memory + code-graph + skill-advisor + reranker may pressure swap | macOS slows; system-rerank-sidecar gets MPS evicted; latency spikes | Document RAM budget in SKILL.md; recommend 32 GB minimum; allow `RERANK_DEVICE=cpu` fallback for low-RAM machines |
| Risk | Port 8765 collision with operator's own service | start.sh fails with EADDRINUSE | Make `RERANK_SIDECAR_PORT` env-configurable; default 8765 (matches spec-memory's expectation) but allow override; document in README |
| Risk | First-use HuggingFace download fails (offline or rate-limited) | Sidecar can't serve | start.sh prints actionable error; offer `RERANK_MODEL_NAME` override to a locally-cached model; document offline-prep workflow |
| Risk | `trust_remote_code=True` is a security surface | Untrusted model could execute arbitrary code | Pin revision sha; document the trust posture in SKILL.md (Qwen models are official, but operators should verify the sha matches the audited upstream) |
| Dependency | sentence-transformers + torch versions need to match cocoindex's pinned set | RAM/binary-cache duplication if mismatched | REQ-007: pin identically; share `~/.cache/huggingface/` so both venvs hit the same model files |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the sidecar support `POST /rerank/batch` for batching multiple `(query, docs)` pairs in one HTTP call? **PROPOSED: not in this phase.** Both spec-memory and cocoindex make one query per memory_search; batching across queries is a future optimization with diminishing return.
- Should the sidecar emit per-request structured logs (JSONL with query, top_k, latency, model)? **PROPOSED: yes**, gated on `RERANK_LOG_PATH` env var (matches cocoindex's `COCOINDEX_RERANK_LOG_PATH` pattern). Operator-opt-in for the evidence trail; default off.
- Should we expose `POST /warmup` distinct from `/health`? **PROPOSED: yes.** `/health` should be cheap (no model load); `/warmup` explicitly loads the model so the first real `/rerank` doesn't pay the 5-10s cold-start tax.
- Path-class boost à la cocoindex's `_apply_path_class_boost`? **DEFERRED.** Cocoindex applies a per-path-class multiplier after rerank; spec-memory has no analogous "path class" concept on memory documents. Skip in phase 002; reconsider only if phase 004 benchmark shows it would help.
<!-- /ANCHOR:questions -->
