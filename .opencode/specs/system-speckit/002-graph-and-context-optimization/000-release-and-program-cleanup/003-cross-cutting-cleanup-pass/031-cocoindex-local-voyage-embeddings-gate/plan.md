---
title: "Implementation Plan: 057 CocoIndex Voyage-Only on Local Machine"
description: "Two-edge-edits + venv-rebuild + data cleanup approach. Per-user config flip selects Voyage; pyproject.toml moves sentence-transformers to optional [local] extra so the fork stays cross-machine compatible; install.sh defaults to [local] but honors COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1."
trigger_phrases:
  - "057 plan"
  - "cocoindex voyage plan"
  - "venv rebuild plan"
  - "optional local extra"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/031-cocoindex-local-voyage-embeddings-gate"
    last_updated_at: "2026-05-10T12:35:00Z"
    last_updated_by: "spec-author"
    recent_action: "Plan authored retroactively; reflects the executed approach"
    next_safe_action: "Verify against checklist; no further plan changes"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/pyproject.toml"
      - ".opencode/skills/mcp-coco-index/scripts/install.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-cocoindex-local-voyage-embeddings-gate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 057 CocoIndex Voyage-Only on Local Machine

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11 (CocoIndex daemon, soft-fork at `mcp_server/`) |
| **Framework** | CocoIndex 1.0.0a33 (Rust core + Python orchestration) + LiteLLM SDK (Voyage routing) |
| **Storage** | LMDB (`cocoindex.db`) + SQLite (`target_sqlite.db`) per indexed project; `~/.cocoindex_code/` for daemon runtime state |
| **Testing** | Manual: `lsof` / `netstat` / `pip list` / `du -sh` post-checks |

### Overview
Two surgical config edits (per-user `global_settings.yml` + fork-level `pyproject.toml`) plus an `install.sh` opt-out env var, followed by a clean `.venv` rebuild and cleanup of stale daemon/index/cache artifacts. The fork's `create_embedder()` factory in `shared.py:46-76` is left untouched — it already supports both providers, and the `litellm` branch reads `VOYAGE_API_KEY` from env automatically.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Daemon (PID 74669) confirmed as running local model via `lsof` (sentence-transformers + torch loaded)
- [x] User confirms: this-machine-only scope, both projects reindex, fork code stays compatible
- [x] `VOYAGE_API_KEY` already set in env (no new secret to wire up)

### Definition of Done
- [x] All P0 requirements verified (REQ-001..005)
- [x] Disk reclaim ≥ 14 GB measured
- [x] New daemon spawn shows zero ML libs in `lsof`, only Voyage TCP connections in `netstat`
- [x] Fork still installs cleanly via `pip install -e ".[local]"` (verified by code-path inspection — opt-in extra works because `cocoindex[litellm]` brings only LiteLLM deps and `sentence-transformers` brings torch transitively)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
**Config-flip + opt-in extra** — no code refactor. The two-branch factory at `mcp_server/cocoindex_code/shared.py:46-76` already routes by `settings.provider` string; we change the string (per-user file), make the local branch's required Python deps optional, and rely on existing imports remaining inert when the deps aren't installed.

### Key Components
- **Per-user config**: `~/.cocoindex_code/global_settings.yml` selects `provider` + `model`. Read by `load_user_settings()` at daemon startup (`daemon.py:643`).
- **Embedder factory**: `create_embedder()` in `shared.py:46-76`. Two branches: `sentence-transformers` (lazy import of local SDK) and `litellm` (lazy import of LiteLLM SDK). Lazy import means a missing local SDK only fails when that branch is selected.
- **Install path**: `scripts/install.sh::install_package()` decides whether to add the `[local]` extra to the editable install target.
- **Fork pyproject**: `mcp_server/pyproject.toml` declares required vs optional dependencies. `[project.optional-dependencies] local = ["sentence-transformers>=2.2.0"]`.

### Data Flow
1. `bash scripts/install.sh` (default) → `pip install -e "mcp_server[local]"` → torch + transformers + sentence-transformers in venv.
2. `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1 bash scripts/install.sh` → `pip install -e "mcp_server"` → no local-LLM stack.
3. Daemon startup → reads `global_settings.yml` → calls `create_embedder()` → routes to LiteLLM or sentence-transformers branch.
4. Embedder receives chunks from the indexer → returns vectors → daemon writes to `target_sqlite.db` + `cocoindex.db`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Config flip (this machine)
- [x] Edit `~/.cocoindex_code/global_settings.yml` to `provider: litellm`, `model: voyage/voyage-code-3`
- [x] Confirm `VOYAGE_API_KEY` is set in env

### Phase 2: Stop & clean
- [x] Kill daemon (SIGTERM, fall back to SIGKILL)
- [x] Delete `daemon.{lock,spawn-lock,pid,sock,log,log.1,log.pre-patch.bak}` from `~/.cocoindex_code/`
- [x] Drop dim-incompatible vector indexes for Public + anobel.com
- [x] Delete cached HuggingFace embedding models (3 directories, ~840 MB)

### Phase 3: Fork + venv (cross-machine compat)
- [x] Move `sentence-transformers>=2.2.0` from `dependencies` to `[project.optional-dependencies] local` in `pyproject.toml`
- [x] Update `install.sh::install_package()` to default to `[local]` and honor `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1`
- [x] Wipe + recreate this machine's `.venv` via `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1 bash scripts/install.sh`

### Phase 4: Verification
- [x] Trigger daemon respawn via MCP search
- [x] Verify Voyage TCP path (`netstat` ESTABLISHED to `136.110.181.169:443`)
- [x] Verify zero ML libs loaded (`lsof | grep -iE 'torch|sentence|transformer|safetensors'` empty)
- [x] Verify venv pip list clean (no torch / transformers / sentence-transformers)
- [x] Confirm disk reclaim totals
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual smoke | New daemon binds socket, accepts MCP search | `mcp__cocoindex_code__search` MCP call |
| Process inspection | No ML libs loaded | `lsof -p <pid> | grep -iE "torch\|sentence\|transformer\|safetensors"` |
| Network verification | Voyage-only egress | `netstat -anv -p tcp | awk '$0 ~ "Python:<pid>"'` then resolve to `api.voyageai.com` |
| Venv inspection | No local-LLM packages | `.venv/bin/pip list | grep -iE "^(torch|transformers|sentence)"` |
| Install dry-run | Fork still installs locally for other users | `pip install -e ".[local]"` (manual on a dev machine if desired) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cocoindex[litellm]==1.0.0a33` | External | Green | Daemon cannot start; no fallback |
| LiteLLM SDK | External (transitive) | Green | Voyage routing impossible; would force fallback to local provider |
| `VOYAGE_API_KEY` | Env | Green | Pre-existing; no rotation needed |
| `tokenizers` (Rust chunker) | External (transitive) | Green | Source-code chunking impossible |
| Voyage AI service | External | Green | Reindex stalls; existing index continues to serve queries |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Voyage API outage that lasts long enough to block development, OR cost concerns from embedding token burn.
- **Procedure**:
  1. Edit `~/.cocoindex_code/global_settings.yml` back to `provider: sentence-transformers`, `model: sentence-transformers/all-MiniLM-L6-v2`.
  2. Reinstall venv with the `[local]` extra: `bash scripts/install.sh` (no env override).
  3. Drop existing 1024-dim Voyage indexes; daemon rebuilds with 384-dim local embeddings.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Config flip)
        |
        v
Phase 2 (Stop & clean)  ──► Phase 4 (Verification)
                              ^
Phase 3 (Fork + venv)  ───────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2, Phase 4 |
| Phase 2 | Phase 1 | Phase 4 |
| Phase 3 | Phase 1 | Phase 4 |
| Phase 4 | Phase 2, Phase 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort | Actual Effort |
|-------|------------|------------------|---------------|
| Phase 1 (Config flip) | Low | 2 min | 2 min |
| Phase 2 (Stop & clean) | Low | 5 min | 5 min |
| Phase 3 (Fork + venv) | Med | 10 min | 8 min |
| Phase 4 (Verification) | Low | 5 min | 6 min |
| **Total** | | **~22 min** | **~21 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created — N/A (vector indexes are derived data, regenerated by reindex)
- [x] Feature flag configured — `COCOINDEX_SKIP_LOCAL_EMBEDDINGS` env var
- [x] Monitoring — `lsof`, `netstat`, `du -sh`, `top` ad-hoc verification

### Rollback Procedure
1. **Immediate**: Revert `~/.cocoindex_code/global_settings.yml` to local-LLM config (manual edit).
2. **Reinstall venv**: `bash scripts/install.sh` (no env override → installs `[local]` extra → torch/transformers/sentence-transformers reappear).
3. **Reindex**: Drop the Voyage-built indexes, let daemon rebuild on local embeddings.
4. **Verify**: Daemon log line `Embedding model: sentence-transformers/all-MiniLM-L6-v2 | device: mps`.

### Data Reversal
- **Has data migrations?** No — vector indexes are derived from source code; no user data lost on either direction.
- **Reversal procedure**: drop `<project>/.cocoindex_code/cocoindex.db` and `target_sqlite.db`; daemon rebuilds.
<!-- /ANCHOR:enhanced-rollback -->
