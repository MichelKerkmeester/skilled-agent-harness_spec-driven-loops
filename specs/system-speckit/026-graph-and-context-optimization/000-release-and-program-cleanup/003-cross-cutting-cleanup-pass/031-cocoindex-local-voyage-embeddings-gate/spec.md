---
title: "Feature Specification: 057 CocoIndex Voyage-Only on Local Machine"
description: "Daemon was leaking 2.1 GB RAM running an unwanted local sentence-transformers model and had filled rotated logs to 7.3 GB; switch this machine to Voyage-only via per-user config + make the local-LLM stack an opt-in install extra so the fork stays cross-machine compatible."
trigger_phrases:
  - "031-cocoindex-local-voyage-embeddings-gate"
  - "cocoindex voyage local llm"
  - "ccc run-daemon ram leak"
  - "daemon.log.1 7.3GB"
  - "sentence-transformers optional extra"
  - "COCOINDEX_SKIP_LOCAL_EMBEDDINGS"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/031-cocoindex-local-voyage-embeddings-gate"
    last_updated_at: "2026-05-10T12:35:00Z"
    last_updated_by: "spec-author"
    recent_action: "Retroactive Level 2 spec authoring after live remediation"
    next_safe_action: "Validate and commit; no further code changes required"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/pyproject.toml"
      - ".opencode/skills/mcp-coco-index/scripts/install.sh"
      - ".opencode/skills/mcp-coco-index/mcp_server/.venv"
      - "~/.cocoindex_code/global_settings.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-cocoindex-local-voyage-embeddings-gate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Strip local-LLM code from fork or keep as option? -> Keep as option, opt-in install extra"
      - "Reindex one project or both? -> Both (Public + anobel.com)"
---
# Feature Specification: 057 CocoIndex Voyage-Only on Local Machine

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-10 |
| **Branch** | `main` (no feature branch per project policy) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The CocoIndex `ccc run-daemon` (PID 74669, 2d 15h uptime) was holding 2.1 GB RSS, spiking CPU to 124%, and indirectly contributing to a memory-saturated Mac (free 73 MB, compressor 26 GB, load 10+). Investigation found two independent root causes: (1) the per-user config at `~/.cocoindex_code/global_settings.yml` selected `provider: sentence-transformers` which eagerly loaded a local PyTorch model and weights despite `VOYAGE_API_KEY` being set, and (2) an indexer crash-loop on a missing `.workflow-lock` file had filled the rotated daemon log to 7.3 GB.

### Purpose
Make this machine Voyage-only by config — no local LLMs installed, no torch/transformers/sentence-transformers in the venv, no HuggingFace model weights cached — while keeping the fork's source code 100% compatible with the local-LLM path so other machines still get an out-of-the-box offline experience.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Switch `~/.cocoindex_code/global_settings.yml` to `provider: litellm` + `model: voyage/voyage-code-3`.
- Stop the running daemon and clean up stale runtime files + the 7.3 GB rotated log.
- Drop dimension-incompatible vector indexes for both indexed projects (Public, anobel.com) so the fresh daemon can rebuild on Voyage's 1024-dim embeddings.
- Delete cached HuggingFace local-embedding model weights from `~/.cache/huggingface/hub/`.
- Move `sentence-transformers>=2.2.0` from required `dependencies` to `[project.optional-dependencies] local` in `pyproject.toml`.
- Update `scripts/install.sh` so `bash install.sh` keeps the `[local]` extra ON by default (other-user behavior unchanged) but honors `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1` to opt out.
- Wipe + recreate this machine's `.venv` with the opt-out so torch/transformers/sentence-transformers/scikit-learn/scipy/sympy/networkx are all gone.
- Verify the new daemon talks only to `api.voyageai.com` and has zero ML libs loaded.

### Out of Scope
- **Indexer crash-loop on missing `.workflow-lock`** — the original log-explosion trigger. Belongs in a separate packet that touches the fork's path-walker code and adds defense-in-depth even though the log rotation cap is already implemented.
- **Memory Meter 3 / QSpace cleanup** — unrelated CPU/RAM hogs surfaced during the same investigation.
- **Forking the upstream `cocoindex` package** — torch arrives transitively through `cocoindex[litellm]==1.0.0a33` only via `sentence-transformers`; with that gone the upstream package adds no ML deps.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `~/.cocoindex_code/global_settings.yml` | Modify | Per-user embedding config flipped to Voyage |
| `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml` | Modify | `sentence-transformers` moved from required to optional `[local]` extra |
| `.opencode/skills/mcp-coco-index/scripts/install.sh` | Modify | `install_package()` defaults to `[local]`, opt-out via `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1` |
| `.opencode/skills/mcp-coco-index/mcp_server/.venv/` | Recreate | Wiped + reinstalled without `[local]` (lean Voyage-only tree) |
| `~/.cocoindex_code/daemon.log{,.1}` | Delete | 7.3 GB rotated log + small live log |
| `~/.cocoindex_code/daemon.{lock,spawn-lock,pid,sock}` | Delete | Stale runtime files from killed daemon |
| `Public/.cocoindex_code/{cocoindex.db,target_sqlite.db,daemon_runtime}` | Delete | Dim-incompatible vector indexes |
| `Websites/anobel.com/.cocoindex_code/{cocoindex.db,target_sqlite.db}` | Delete | Same as above |
| `~/.cache/huggingface/hub/models--*` | Delete | 3 cached local embedding models (~840 MB) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Daemon must use Voyage AI for all embedding requests on this machine | `lsof -p <daemon> -i` shows only ESTABLISHED HTTPS to `api.voyageai.com` (`136.110.181.169`); no traffic to `huggingface.co` |
| REQ-002 | No local-LLM Python packages installed on this machine | `pip list` in the venv shows no `torch`, `transformers`, `sentence-transformers`, `safetensors`, `scikit-learn`, `scipy`, `sympy`, `networkx` |
| REQ-003 | No HuggingFace local model weights on this machine | `~/.cache/huggingface/hub/` contains no `models--*` directories |
| REQ-004 | Fork source code remains compatible with local LLMs for other users | `pip install -e ".[local]"` reinstalls sentence-transformers cleanly; `shared.py` `create_embedder()` branch for `provider: sentence-transformers` unchanged |
| REQ-005 | Other users running default `bash scripts/install.sh` get unchanged behavior | Default code path keeps `[local]` extra; only `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1` skips it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Reclaim disk previously held by indexes + log + venv + HF cache | `du -sh` confirms ≥ 14 GB across the four affected directories before vs after |
| REQ-007 | Memory pressure on this Mac drops materially after kill | `top -l 1` PhysMem free goes from <100 MB to >1 GB and compressor drops by ≥ 5 GB |
| REQ-008 | Both indexed projects (Public + anobel.com) reindex cleanly on next search | Daemon spawns automatically and rebuilds vector store using Voyage 1024-dim embeddings without dimension errors |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After daemon restart, RSS settles below 800 MB once both projects finish reindexing (vs prior 2.1 GB ceiling on local-LLM path).
- **SC-002**: Outbound network from the daemon resolves only to `api.voyageai.com` (Voyage-only). No HuggingFace, no Ollama, no OpenAI, no MLX endpoints.
- **SC-003**: Other contributors who clone fresh and run `bash scripts/install.sh` see no behavior change — local LLMs still install by default; the `[local]` extra is the install path.
- **SC-004**: A future `pip install -e ".[local]"` against the fork installs sentence-transformers + transitive torch/transformers without errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Voyage AI API quota | Reindex consumes embedding tokens | User has `VOYAGE_API_KEY` set; one-time cost amortized over future searches |
| Dependency | LiteLLM `voyage/...` model routing | Wrong provider string would silently fail | Verified by live ESTABLISHED HTTPS to `api.voyageai.com` post-restart |
| Risk | Reindex time | Both projects need to rebuild from scratch | Asynchronous; first searches return partial results; daemon handles backfill |
| Risk | Default install behavior change for fresh clones | Other users could end up Voyage-only by accident | `install.sh` default keeps `[local]` extra ON; only opt-out flag changes behavior |
| Risk | Stale `ccc mcp` watchers re-spawning the daemon mid-cleanup | Could re-create the unwanted log file | Killed all watchers + verified clean state before triggering MCP search |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: New-daemon startup RSS < 300 MB (no PyTorch warm-up) — measured 240 MB on first spawn vs 2.25 GB on the old local-LLM path.
- **NFR-P02**: Voyage embedding round-trip completes per chunk batch within typical Voyage SLAs; no local CPU-intensive forward pass.

### Security
- **NFR-S01**: `VOYAGE_API_KEY` read from env, never logged or committed.
- **NFR-S02**: No outbound traffic to model-download CDNs (HuggingFace) once local-LLM stack is removed.

### Reliability
- **NFR-R01**: Cross-machine compatibility preserved — `pip install -e ".[local]"` remains a one-liner for users who want offline embeddings.
- **NFR-R02**: `install.sh` exposes a documented opt-out env var; default behavior unchanged.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Existing 384-dim vector index vs new 1024-dim Voyage embeddings**: incompatible — daemon would refuse to write. Mitigation: drop `cocoindex.db` + `target_sqlite.db` for both projects before respawn; daemon rebuilds clean.
- **HuggingFace cache contains models we never used** (facebook/contriever, mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ): user wants no local LLMs, so these are deleted too even though they were beyond the original investigation scope.

### Error Scenarios
- **Stale daemon respawned by an old `ccc mcp` watcher between kill and rm**: log fd held against an unlinked inode. Functionally fine; visible by `lsof` not `ls`. Resolved by killing all `ccc run-daemon` instances and respawning fresh after the install completed.
- **`pip install --no-build-isolation` fails to resolve deps**: install.sh has a built-in `--no-deps` retry path (existing behavior, unchanged).

### Concurrent Operations
- **Two daemons trying to bind the same socket**: prevented by existing patches (Patch 8 sibling-PID check, Patch 11 split lock files) — unchanged by this packet.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 3 file edits, 1 venv recreate, ~10 file/dir deletes; ~20 LOC code change |
| Risk | 12/25 | Touches user-facing install path + deletes large data; reversible by reinstall |
| Research | 6/20 | Live triage already complete; root cause identified before edits started |
| **Total** | **26/70** | **Level 2** (verification-focused, no architecture decisions to formalize) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- (Resolved) Should we strip local-LLM code from the fork? **→ NO. Keep as option. Move `sentence-transformers` to optional `[local]` extra; preserve `shared.py` branch.**
- (Resolved) Reindex anobel.com too? **→ YES, both projects.**
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
