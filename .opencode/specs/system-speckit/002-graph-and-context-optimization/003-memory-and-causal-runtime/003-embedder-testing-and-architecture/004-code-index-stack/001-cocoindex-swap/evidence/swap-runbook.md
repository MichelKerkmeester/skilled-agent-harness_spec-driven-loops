# 018/001 — CocoIndex swap operator runbook

> Code is shipped (`8f909d229`). Daemon restart + reindex are operator steps below.

## Pre-restart state (verification)

```bash
# 1. Confirm new default is in config
grep _DEFAULT_MODEL .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py
# Expected: _DEFAULT_MODEL = "sbert/jinaai/jina-embeddings-v2-base-code"

# 2. Confirm tests pass
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python -m pytest \
  .opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py -v
# Expected: 7/7 PASS

# 3. Confirm device auto-detect picks MPS on this machine
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python -c \
  "from cocoindex_code.config import _resolve_device; print(_resolve_device(None))"
# Expected: mps
```

## Daemon-restart step (REQUIRED — operator-driven)

The CocoIndex daemon is long-running and holds the old gemma model in memory.

```bash
# 1. Find daemon PID
ps -eo pid,etime,rss,command | grep -E "cocoindex" | grep -v grep

# 2. Stop daemon (graceful)
# Either restart the MCP server in your editor (preferred), or:
kill <daemon-pid>

# 3. On next CocoIndex query, daemon auto-spawns with new config + downloads jina-code (~280MB first-time)
```

## First-use download

First query after restart will download jina-embeddings-v2-base-code from HuggingFace via sentence-transformers (~280MB to `~/.cache/huggingface/hub/`).

## Reindex step

```bash
# Trigger full reindex (replaces gemma vectors with jina-code vectors)
# Via MCP tool:
mcp__cocoindex_code__cocoindex_refresh_index({})

# Wait ~minutes (repository-size dependent)
# .cocoindex_code/ contents get rebuilt
```

## Smoke tests after reindex

```bash
# 1. CocoIndex semantic search responds
mcp__cocoindex_code__search({query: "embedder adapter interface", num_results: 3})
# Expected: non-empty results

# 2. Code Graph bridge continues to function
mcp__mk_code_index__code_graph_context({symbol: "EmbedderAdapter"})
# Expected: structural context returned (uses CocoIndex bridge under the hood)
```

## Rollback

If jina-code produces worse results than gemma per 018/003 benchmark:

```bash
# Either revert the config change:
git revert 8f909d229

# Or override via env var without code change:
export COCOINDEX_CODE_EMBEDDING_MODEL="sbert/google/embeddinggemma-300m"
# Restart daemon + reindex
```

## Kill switch (force CPU)

If MPS produces unstable results on this machine:

```bash
export COCOINDEX_CODE_DEVICE=cpu
# Restart daemon
```

## Status

| Step | Status |
|---|---|
| Code shipped | ✅ commit `8f909d229` |
| Tests passing | ✅ 35/35 CocoIndex tests, 7/7 new test_config.py |
| Daemon restart | ⏳ operator-driven |
| Reindex | ⏳ post-restart |
| Smoke tests | ⏳ post-reindex |
| 018/003 measurement | ⏳ post-smoke (Phase 5 of session plan) |
