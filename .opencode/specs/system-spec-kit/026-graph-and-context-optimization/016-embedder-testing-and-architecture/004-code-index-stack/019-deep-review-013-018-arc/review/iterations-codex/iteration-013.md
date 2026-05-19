# Codex Iteration 013 — daemon defaults and lifecycle

## Sequential-thinking preflight
- MCP status: unavailable; sequential-thinking calls were cancelled by runtime.
- Focus: sidecar-reported daemon production paths.
- Scope: `settings.py`, `server.py`, `daemon.py`, `config.py`, `registered_embedders.py`.
- Devin coverage: iter 004 checked config/registry consistency, but not daemon settings.
- Adversarial angle: find entrypoints where the nomic promotion does not take effect.
- Evidence plan: cite settings default, first-run settings creation, and daemon embedder construction.

## Cross-reference to devin pass
- Building on devin iter 004: expands default-embedder consistency from config/registry drift into a production entrypoint split.
- Devin finding [001:default embedder consistency] (EXPANDED): config and registry agree, but daemon user settings do not.

## Files reviewed
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py`:115-121
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py`:454-463
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`:840-849
- `.opencode/skills/mcp-coco-index/tests/test_settings.py`:47-51

## Findings

### P1 — fresh daemon settings still default to EmbeddingGemma, bypassing the nomic promotion
**File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py`:115-121
**Evidence**:
```python
def default_user_settings() -> UserSettings:
    return UserSettings(
        embedding=EmbeddingSettings(
            provider="sentence-transformers",
            model="google/embeddinggemma-300m",
        )
    )
```
On first run, `server.py` writes `default_user_settings()` if the user settings file is absent. The daemon then loads user settings and creates the embedder from them, so a fresh daemon-backed install can still use `google/embeddinggemma-300m` while `config.py` and `registered_embedders.py` say the default is `sbert/nomic-ai/CodeRankEmbed`.
**Why it matters**: The nomic promotion is entrypoint-dependent. Benchmark and docs may describe one production default while fresh daemon installs index with another model.
**Suggested fix**: Derive `default_user_settings().embedding.model` from the registered default, with prefix conversion handled once. Update `test_default_user_settings()` to assert the promoted model.
**Dimension(s)**: architecture, correctness, embedder-agnosticism, tests

### P1 — index failures can be reported as successful
**File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`:392-448
**Evidence**:
```python
try:
    await project.update_index(...)
except Exception:
    logger.exception("Indexing failed for %s", project_root)
...
index_task.result()
yield IndexResponse(success=True)
```
`_run_index()` catches and suppresses every exception. `update_index()` then observes a completed task and emits success.
**Why it matters**: Operators can receive a green index response while retrieval is stale or partially updated. That undercuts reproducibility for every benchmark and any post-change verification that trusts `ccc index`.
**Suggested fix**: Let `_run_index()` re-raise after cleanup or store the exception and surface `IndexResponse(success=False, message=...)`.
**Dimension(s)**: correctness, reproducibility, architecture

### P2 — daemon lifetime lock is released immediately after listener creation
**File**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`:285-294
**Evidence**:
```python
"""Patch 11: held by the daemon process for its entire lifetime."""
...
finally:
    if startup_lock_fd is not None:
        startup_lock_fd.close()
```
The docstring promises a lifetime lock, but `_async_daemon_main()` closes it after `Listener(...)`.
**Why it matters**: Duplicate-daemon prevention falls back to PID/socket checks after startup. If the PID file is stale, missing, or overwritten during a restart race, the lock no longer fences sibling daemons.
**Suggested fix**: Keep the fd open until shutdown, or update the contract and add tests for stale PID plus live lock behavior.
**Dimension(s)**: architecture, maintainability, reproducibility

## Dimension coverage delta (codex pass)
- architecture: covered
- correctness: covered
- code-quality: covered
- maintainability: covered
- tests: covered
- documentation: covered
- performance: covered
- embedder-agnosticism: covered
- reranker-agnosticism: covered
- reproducibility: covered

## Convergence signal
New P0 in this iter: 0
New P1 in this iter: 2
New P2 in this iter: 1
