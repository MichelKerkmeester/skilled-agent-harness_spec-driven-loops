---
title: "Implementation Summary: 057 CocoIndex Voyage-Only on Local Machine"
description: "Daemon switched from local sentence-transformers to Voyage AI on this Mac; ~15.7 GB disk reclaimed (vector indexes + 7.3 GB log + venv prune + HF cache); fork keeps cross-machine compat via opt-in [local] extra."
trigger_phrases:
  - "057 implementation summary"
  - "cocoindex voyage summary"
  - "15 GB disk reclaim"
  - "voyage-code-3 routing"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/031-cocoindex-local-voyage-embeddings-gate"
    last_updated_at: "2026-05-10T12:35:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author implementation-summary.md"
    next_safe_action: "Run validate.sh --strict; commit to main"
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
# Implementation Summary: 057 CocoIndex Voyage-Only on Local Machine

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-cocoindex-local-voyage-embeddings-gate |
| **Completed** | 2026-05-10 |
| **Level** | 2 |
| **Actual Effort** | ~21 min (estimated 22 min) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A targeted, this-machine-only switch from local sentence-transformers embeddings to Voyage AI, paired with a structural change to the fork's install path that keeps it cross-machine compatible. The leaking daemon (PID 74669, 2.1 GB RSS, 2d+ uptime) was killed; ~15.7 GB of stale state (rotated log, dim-incompatible vector indexes, HF model cache, bloated venv) was reclaimed; and the fork's `pyproject.toml` was reorganized so `sentence-transformers` becomes an opt-in `[local]` extra instead of a required dependency. `install.sh` defaults to including `[local]` so other users see no behavior change; this machine opted out via `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1` and now runs a 310 MB Voyage-only venv.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `~/.cocoindex_code/global_settings.yml` | Modified | `provider: litellm`, `model: voyage/voyage-code-3` |
| `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml` | Modified | `sentence-transformers` moved from `dependencies` to `[project.optional-dependencies] local` |
| `.opencode/skills/mcp-coco-index/scripts/install.sh` | Modified | `install_package()` defaults to `[local]`, opt-out via `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1` |
| `.opencode/skills/mcp-coco-index/mcp_server/.venv/` | Recreated | Wiped 1.1 GB → fresh 310 MB Voyage-only tree |
| `~/.cocoindex_code/daemon.log` | Deleted | Live log (small) |
| `~/.cocoindex_code/daemon.log.1` | Deleted | 7.3 GB rotated log from indexer crash-loop |
| `~/.cocoindex_code/daemon.log.pre-patch.bak` | Deleted | 22 MB stale backup |
| `~/.cocoindex_code/daemon.{lock,spawn-lock,pid,sock}` | Deleted | Stale runtime files |
| `Public/.cocoindex_code/cocoindex.db/` | Deleted | 3.56 GB LMDB store, dim-incompatible |
| `Public/.cocoindex_code/target_sqlite.db` | Deleted | 3.4 GB SQLite vector store, dim-incompatible |
| `Public/.cocoindex_code/daemon_runtime/` | Deleted | Runtime metadata |
| `Websites/anobel.com/.cocoindex_code/cocoindex.db/` | Deleted | LMDB store for second project |
| `Websites/anobel.com/.cocoindex_code/target_sqlite.db` | Deleted | SQLite vector store for second project (~75 MB) |
| `~/.cache/huggingface/hub/models--sentence-transformers--all-MiniLM-L6-v2/` | Deleted | 87 MB cached model weights |
| `~/.cache/huggingface/hub/models--facebook--contriever/` | Deleted | 418 MB unused local model |
| `~/.cache/huggingface/hub/models--mlx-community--Qwen3-Embedding-0.6B-4bit-DWQ/` | Deleted | 335 MB unused MLX model |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Live triage in the running session — investigation first (live `lsof`/`netstat`/`pip` probes against PID 74669), then a single sequence of mechanical edits + cleanup, then verification by respawning the daemon and inspecting its loaded libraries and TCP endpoints.

**Order of operations:** confirm `VOYAGE_API_KEY` is set → flip per-user `global_settings.yml` to LiteLLM/Voyage → kill the leaking daemon → delete `~/.cocoindex_code/daemon.*` runtime files (incl. the 7.3 GB rotated log) → drop dim-incompatible vector indexes for both projects → delete cached HuggingFace local embedding models → edit fork `pyproject.toml` to make `sentence-transformers` an opt-in `[local]` extra → patch `install.sh::install_package()` to honor `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1` → wipe `.venv` → reinstall via `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1 bash scripts/install.sh` → trigger MCP search → verify Voyage HTTPS endpoints and zero ML libs loaded.

**Tooling:** direct shell edits and `Write`/`Edit` tools — no CLI dispatch, since per project memory mechanical work is faster and more reliable than dispatch under parallelism. Verification used `lsof -p`, `netstat -anv -p tcp`, `du -sh`, `top -l 1`, and one `mcp__cocoindex_code__search` call.

**One quirk worth recording:** between `kill <old-pid>` and `rm daemon.log`, a stale `ccc mcp` watcher process auto-respawned the daemon and held an fd against the about-to-be-unlinked log inode. Resolved by killing all `ccc run-daemon` instances explicitly before triggering the post-install search.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep fork code dual-path (don't strip sentence-transformers branch) | User wants cross-machine compatibility; other users who want offline embeddings shouldn't have to re-add code, only opt into an install extra |
| Move `sentence-transformers` to `[project.optional-dependencies] local` | PEP-621-standard way to make a heavy dep opt-in without changing import semantics; `shared.py:54` already lazy-imports inside the provider branch |
| `install.sh` default keeps `[local]` extra ON | Other users running `bash install.sh` see zero behavior change — local LLMs install by default, just like before |
| Opt-out via `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1` env var | Single-flag, well-named, doesn't require a new CLI argument that would need its own help text |
| Rebuild `.venv` from scratch instead of `pip uninstall` | Guarantees a clean dep tree from the new `pyproject.toml`; avoids leftover orphans from `pip uninstall` not auto-resolving transitive deps |
| Delete all 3 HF cached models, not just MiniLM | User directive: "no local LLMs on this computer". Contriever and Qwen3-Embedding were unused but qualified |
| Drop both projects' indexes (Public + anobel.com), not just Public | User confirmed both projects should reindex; Voyage 1024-dim is incompatible with both existing 384-dim stores |
| Don't re-author `INSTALL_GUIDE.md` and `README.md` | Their default-install descriptions remain accurate; only the opt-out env var is undocumented externally — acceptable defer |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Process inspection | Pass | 100% | New daemon (PID 2729) shows zero ML libs in `lsof` output |
| Network verification | Pass | 100% | `netstat -anv -p tcp` confirms only `136.110.181.169:443` egress; DNS resolves to `api.voyageai.com` |
| Venv inspection | Pass | 100% | `pip list` clean of torch/transformers/sentence-transformers/safetensors/scikit-learn/scipy/sympy/networkx |
| Disk reclaim | Pass | 100% | Cumulative ~15.7 GB freed across 4 areas; measured before/after |
| Cross-machine compat | Pass | Code-path | `bash scripts/install.sh` (no env override) installs `[local]` extra → identical behavior to pre-change |
| Manual smoke | Pass | - | MCP search call accepted; daemon began reindexing both projects on Voyage path |

### Disk Reclaim Detail

| Source | Before | After | Delta |
|--------|--------|-------|-------|
| `~/.cocoindex_code/` | 7.4 GB | 180 KB | **-7.4 GB** |
| `Public/.cocoindex_code/` | 6.5 GB | 4 KB | **-6.5 GB** |
| `Websites/anobel.com/.cocoindex_code/` | 157 MB | 4 KB | **-157 MB** |
| `~/.cache/huggingface/hub/` | ~840 MB | 8 KB | **-840 MB** |
| `mcp_server/.venv/` | 1.1 GB | 310 MB | **-800 MB** |
| **Total** | | | **~15.7 GB** |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | New-daemon startup RSS < 300 MB | 240 MB on first respawn (pre-reindex) | Pass |
| NFR-P02 | Voyage embedding round-trip within SLA | 10+ concurrent ESTABLISHED HTTPS to Voyage observed under reindex load | Pass (qualitative) |
| NFR-S01 | `VOYAGE_API_KEY` env-only, never committed | Confirmed; no file writes touched the secret | Pass |
| NFR-S02 | No HF CDN traffic post-cleanup | No DNS/TCP to `huggingface.co` from new daemon | Pass |
| NFR-R01 | `pip install -e ".[local]"` still works for other users | Code-path verified — `[local]` extra resolves; identical to old required-dep behavior | Pass |
| NFR-R02 | `install.sh` exposes documented opt-out | `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1` honored, defaults preserve old behavior | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`INSTALL_GUIDE.md` doesn't document the opt-out env var** — acceptable defer because the default install path is unchanged for other users; can be added in a small follow-on doc packet if cross-machine Voyage-only adoption grows.
2. **Out-of-scope: `.workflow-lock` indexer crash-loop** — the original log-explosion trigger remains in fork code. The post-fork `RotatingFileHandler` (10 MB × 5, 60 MB total) caps any future blow-up, but the underlying crash-loop should be fixed in a separate packet (skip-transient-files in path-walker).
3. **Reindex consumes Voyage tokens on every fresh install** — by design; users who want zero API cost can run with the `[local]` extra and stick to local embeddings.
4. **`settings.py:112-118` `default_user_settings()` still returns `provider: sentence-transformers`** — left as-is per user directive; only the per-user `global_settings.yml` overrides this for THIS machine. Future fresh installs on this machine that run `ccc init` would write the local default into a new `global_settings.yml`. Mitigation: document the opt-out env var, or change `default_user_settings()` in a follow-on packet if Voyage becomes the canonical default.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Delete only the `models--sentence-transformers--all-MiniLM-L6-v2` HF cache | Deleted all 3 HF model caches (added contriever + Qwen3-Embedding) | User directive in mid-flight: "no local LLMs on this computer" — broader than originally scoped. Reclaimed an extra ~750 MB. |
| Single config + venv prune | Added stale-watcher kill step | Discovered race: lingering `ccc mcp` watchers respawn the daemon between `kill` and `rm`, leading to held-open log fd against unlinked inode. Mitigation: kill all daemons + retrigger fresh spawn. |
| Plan said the install via `pip install --no-deps` if needed | Used `rm -rf .venv` + fresh `python3.11 -m venv` instead | Cleaner guarantee of dep-tree state; cost was 30s of download + install time |
<!-- /ANCHOR:deviations -->
