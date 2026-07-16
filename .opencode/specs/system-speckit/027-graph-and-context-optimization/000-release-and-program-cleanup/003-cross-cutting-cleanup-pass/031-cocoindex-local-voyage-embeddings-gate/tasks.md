---
title: "Tasks: 057 CocoIndex Voyage-Only on Local Machine"
description: "Mechanical execution checklist for the live remediation. All tasks were executed in the original session and are marked complete with the actual elapsed timing."
trigger_phrases:
  - "057 tasks"
  - "cocoindex voyage tasks"
  - "venv rebuild tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/031-cocoindex-local-voyage-embeddings-gate"
    last_updated_at: "2026-05-10T12:35:00Z"
    last_updated_by: "spec-author"
    recent_action: "Tasks list authored retroactively; all tasks pre-completed in live session"
    next_safe_action: "None — work shipped; verify checklist"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-cocoindex-local-voyage-embeddings-gate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 057 CocoIndex Voyage-Only on Local Machine

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Config flip on this machine — selects Voyage AI as the embedding provider before any cleanup runs.

- [x] T001 Verify `VOYAGE_API_KEY` is set in env (`env | grep VOYAGE_API_KEY`) [1m]
- [x] T002 Replace `~/.cocoindex_code/global_settings.yml` contents with `provider: litellm`, `model: voyage/voyage-code-3` [1m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Combined "Stop & Clean" plus "Fork + Venv" work — daemon termination, stale-state cleanup, fork edits, and venv rebuild.

### Process termination
- [x] T010 SIGTERM the original leaking daemon (`kill 74669`) and confirm exit [1m]
- [x] T011 Kill any stale `ccc run-daemon` respawned by lingering watchers (`pkill -9 -f "ccc run-daemon"`) [1m]

### Runtime file cleanup
- [x] T012 Delete `~/.cocoindex_code/daemon.{lock,spawn-lock,pid,sock}` [30s]
- [x] T013 Delete `~/.cocoindex_code/daemon.log` (current) [30s]
- [x] T014 Delete `~/.cocoindex_code/daemon.log.1` (7.3 GB rotated log) [30s]
- [x] T015 Delete `~/.cocoindex_code/daemon.log.pre-patch.bak` (22 MB) [30s]

### Vector index drop (both projects)
- [x] T016 [P] Drop `Code_Environment/Public/.cocoindex_code/{cocoindex.db,target_sqlite.db,daemon_runtime}` (~6.5 GB) [1m]
- [x] T017 [P] Drop `Websites/anobel.com/.cocoindex_code/{cocoindex.db,target_sqlite.db}` (~157 MB) [30s]

### HuggingFace cache
- [x] T018 Delete `~/.cache/huggingface/hub/models--sentence-transformers--all-MiniLM-L6-v2` (87 MB) [10s]
- [x] T019 [P] Delete `~/.cache/huggingface/hub/models--facebook--contriever` (418 MB) [10s]
- [x] T020 [P] Delete `~/.cache/huggingface/hub/models--mlx-community--Qwen3-Embedding-0.6B-4bit-DWQ` (335 MB) [10s]

### Fork edits (cross-machine compat)
- [x] T030 Edit `mcp_server/pyproject.toml`: remove `"sentence-transformers>=2.2.0"` from `dependencies` [1m]
- [x] T031 Edit `mcp_server/pyproject.toml`: add `[project.optional-dependencies] local = ["sentence-transformers>=2.2.0"]` block [1m]
- [x] T032 Edit `scripts/install.sh::install_package()`: append `[local]` to install target unless `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1` [2m]

### Venv rebuild (this machine only)
- [x] T033 Kill the daemon spawned during install so the rebuild is clean (`kill <pid>`) [30s]
- [x] T034 `rm -rf mcp_server/.venv` (was 1.1 GB) [30s]
- [x] T035 `COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1 bash scripts/install.sh` (creates fresh venv, installs Voyage-only tree) [3m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Live measurement that the Voyage path is active, the local-LLM stack is gone, and disk + memory pressure dropped.

### Venv inspection
- [x] T040 Confirm venv size dropped from 1.1 GB to 310 MB (`du -sh .venv`) [10s]
- [x] T041 Confirm `pip list` shows no torch / transformers / sentence-transformers / safetensors / scikit-learn / scipy / sympy / networkx [30s]

### Daemon respawn + path inspection
- [x] T042 Kill any pre-respawn daemons (so the next spawn comes from the new venv) [30s]
- [x] T043 Trigger MCP search to auto-spawn fresh daemon (`mcp__cocoindex_code__search`) [10s]
- [x] T044 Confirm new daemon process exists with low RSS (`ps -p <pid> -o rss,command`) [10s]
- [x] T045 Confirm zero ML libs loaded (`lsof -p <pid> | grep -iE "torch|sentence|transformer|safetensors"` empty) [30s]
- [x] T046 Confirm only `tokenizers.abi3.so` present (Rust source-code chunker, expected) [10s]

### Network verification
- [x] T047 Confirm Voyage TCP path (`netstat -anv -p tcp | awk '$0 ~ "Python:<pid>"'` → `136.110.181.169.443`) [30s]
- [x] T048 Confirm DNS: `host api.voyageai.com` resolves to the same IP [10s]

### System pressure
- [x] T049 `top -l 1 | grep PhysMem` confirms free memory recovered, compressor pressure down [30s]
- [x] T050 Total disk reclaim ≥ 14 GB (sum of vector indexes + log + venv + HF cache) [30s]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0/P1 requirements from `spec.md` verified
- [x] No `[B]` blocked tasks
- [x] Daemon confirmed Voyage-only via lsof + netstat + DNS resolution
- [x] Fork remains installable with `[local]` extra for cross-machine compatibility
- [x] Disk reclaim measured and recorded (~15.7 GB cumulative across the session)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
