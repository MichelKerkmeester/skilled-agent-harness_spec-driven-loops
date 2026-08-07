---
title: "CocoIndex Voyage-Only Switch and Disk Reclaim on Local Machine"
description: "The CocoIndex daemon was leaking 2.1 GB RAM and had grown a 7.3 GB rotated log from a crash-loop. This packet switched the per-user config to Voyage AI, restructured the fork to make sentence-transformers an opt-in install extra. Approximately 15.7 GB of stale state was reclaimed."
trigger_phrases:
  - "cocoindex voyage only switch"
  - "sentence-transformers optional extra"
  - "COCOINDEX_SKIP_LOCAL_EMBEDDINGS"
  - "ccc daemon ram leak disk reclaim"
  - "031 cocoindex local voyage embeddings gate"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-10

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/031-cocoindex-local-voyage-embeddings-gate` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

The CocoIndex `ccc run-daemon` (PID 74669) had run for over 2 days consuming 2.1 GB RSS because its per-user config still pointed at `provider: sentence-transformers`, loading a local PyTorch model despite `VOYAGE_API_KEY` being set. An indexer crash-loop on a missing `.workflow-lock` file had simultaneously grown the rotated daemon log to 7.3 GB.

The daemon was killed and its stale runtime files removed. The per-user config at `~/.cocoindex_code/global_settings.yml` was flipped to `provider: litellm` with `model: voyage/voyage-code-3`. Approximately 15.7 GB of stale state was reclaimed across the rotated log, dimension-incompatible vector indexes for both indexed projects, three cached HuggingFace model weights. The old venv was also wiped. The fork's `pyproject.toml` was restructured to move `sentence-transformers` from required dependencies to a `[project.optional-dependencies] local` extra so other machines retain offline-embedding capability without code changes. The `install.sh` script was patched to default to including the `[local]` extra while honoring `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1` as an opt-out. The new daemon starts at 240 MB RSS and talks only to `api.voyageai.com`.

### Added

- `[project.optional-dependencies] local` block in `pyproject.toml` with `sentence-transformers>=2.2.0` as an opt-in dependency
- `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1` opt-out path in `install.sh` via a new `install_package()` guard
- NFR verification table covering RSS target, Voyage-only network egress, cross-machine compatibility. API key handling confirmed.

### Changed

- `~/.cocoindex_code/global_settings.yml` provider flipped from `sentence-transformers` to `litellm` with model `voyage/voyage-code-3`
- `pyproject.toml` `dependencies` list: `sentence-transformers>=2.2.0` moved out of required deps into `[project.optional-dependencies] local`
- `install.sh` `install_package()`: now defaults to `.[local]` extra but skips it when `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1` is set
- `.venv` rebuilt from scratch as a lean 310 MB Voyage-only tree (down from 1.1 GB with torch and transformers)

### Fixed

- Daemon RAM leak: old daemon held 2.1 GB RSS from a loaded local PyTorch model. New daemon settles at 240 MB.
- 7.3 GB rotated log explosion caused by a crash-loop on a missing `.workflow-lock` file. Rotated log deleted and `RotatingFileHandler` (10 MB x 5) caps future growth.
- Dimension-incompatible vector indexes: existing 384-dim stores were incompatible with Voyage 1024-dim output. Both projects' indexes deleted so the daemon could rebuild cleanly.
- Stale `ccc mcp` watcher race: watchers auto-respawned the daemon between `kill` and `rm`, holding an fd against the unlinked log inode. All `ccc run-daemon` instances were killed before the post-install search was triggered.

### Verification

| Test | Status | Notes |
|------|--------|-------|
| Process inspection | Pass | New daemon (PID 2729) shows zero ML libs in `lsof` output |
| Network verification | Pass | `netstat` confirms only `136.110.181.169:443` egress. DNS resolves to `api.voyageai.com`. No traffic to `huggingface.co`. |
| Venv inspection | Pass | `pip list` clean of torch, transformers, sentence-transformers, safetensors, scikit-learn, scipy, sympy, networkx |
| Disk reclaim | Pass | Cumulative approximately 15.7 GB freed across five areas. Measured before and after. |
| Cross-machine compat | Pass | `bash scripts/install.sh` without env override installs `[local]` extra. Behavior identical to pre-change. |
| Manual smoke | Pass | MCP search call accepted. Daemon began reindexing both projects on Voyage path. |
| NFR-P01 startup RSS | Pass | 240 MB measured on first respawn vs 2.25 GB on prior local-LLM path |
| NFR-S01 API key | Pass | `VOYAGE_API_KEY` read from env only. No file writes touched the secret. |
| NFR-R01 local-extra reinstall | Pass | `pip install -e ".[local]"` resolves cleanly. `shared.py` provider branch for `sentence-transformers` unchanged. |

### Files Changed

| File | Action | What changed |
|------|--------|-------------|
| `~/.cocoindex_code/global_settings.yml` | Modified | Provider flipped to litellm. Model set to voyage/voyage-code-3. |
| `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml` | Modified | `sentence-transformers` moved from required deps to `[project.optional-dependencies] local` |
| `.opencode/skills/mcp-coco-index/scripts/install.sh` | Modified | `install_package()` defaults to `[local]` extra. Honors `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1` opt-out. |
| `.opencode/skills/mcp-coco-index/mcp_server/.venv/` | Recreated | Wiped 1.1 GB venv. Rebuilt as 310 MB Voyage-only tree. |
| `~/.cocoindex_code/daemon.log` | Deleted | Small live log removed during cleanup |
| `~/.cocoindex_code/daemon.log.1` | Deleted | 7.3 GB rotated log from indexer crash-loop |
| `~/.cocoindex_code/daemon.log.pre-patch.bak` | Deleted | 22 MB stale backup |
| `~/.cocoindex_code/daemon.{lock,spawn-lock,pid,sock}` | Deleted | Stale runtime files from killed daemon |
| `Public/.cocoindex_code/cocoindex.db/` | Deleted | 3.56 GB LMDB vector store. 384-dim incompatible with Voyage 1024-dim. |
| `Public/.cocoindex_code/target_sqlite.db` | Deleted | 3.4 GB SQLite vector store. Same dimension mismatch. |
| `Public/.cocoindex_code/daemon_runtime/` | Deleted | Runtime metadata directory |
| `Websites/anobel.com/.cocoindex_code/cocoindex.db/` | Deleted | LMDB store for second indexed project |

### Follow-Ups

- Document the `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1` opt-out env var in `INSTALL_GUIDE.md`. Deferred because the default install path is unchanged for other users. Add in a follow-on doc packet if Voyage-only adoption grows.
- Fix the indexer crash-loop on a missing `.workflow-lock` file in a separate packet. The `RotatingFileHandler` caps future log growth but the underlying crash path in the fork's path-walker remains.
- Evaluate updating `settings.py:112-118` `default_user_settings()` to emit `provider: litellm` as the default if Voyage becomes the canonical default across machines.
