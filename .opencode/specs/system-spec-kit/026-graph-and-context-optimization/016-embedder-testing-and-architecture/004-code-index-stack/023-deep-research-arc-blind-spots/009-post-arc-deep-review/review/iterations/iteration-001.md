# Iteration 001 — Restructure Import Correctness

## Hypotheses going in

The post-restructure import sweep (commit ed7dcd0ac) should have converted all short-form imports to sub-dir-qualified imports. Expected:
- Zero remaining `from .X import` short forms where X is a moved module
- Zero stale `from cocoindex_code.X import` absolute imports on test side
- pytest: 222 passed
- ruff: clean

## Files / commands run

### Grep for remaining short-form imports
```bash
grep -rn "from \.\(registry\|client\|protocol\|config\|indexer\|shared\|settings\|project\|path_utils\|search_budget\|observability\|index_metadata\|fusion\|fts_index\|query\|query_expansion\|reranker\|rerankers_jina_v3\|registered_embedders\|schema\)\b" .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/
```

**Result:** 26 matches found in cocoindex_code/ source files (server.py, cli.py, daemon.py, core/client.py, core/project.py, config/settings.py, rerankers/reranker.py, observability/observability.py, embedders/registry.py, retrieval/query.py)

**Analysis:** These are CORRECT relative imports within the restructured subdirectory layout. For example:
- `from .observability.observability import` in server.py (correct: server.py is at top level, importing from subdir)
- `from .config.settings import` in cli.py (correct: cli.py is at top level, importing from config subdir)
- `from .protocol import` in core/client.py (correct: protocol.py is in core/, client.py is in core/)

These are NOT stale short forms—they are the expected relative imports after restructure.

### Grep for stale absolute imports on test side
```bash
grep -rn "from cocoindex_code\.\(reranker\|client\|config\|search_budget\|indexer\|shared\|settings\|protocol\|project\|path_utils\|observability\|index_metadata\|registry\|registered_embedders\|fusion\|fts_index\|query\|query_expansion\|schema\|rerankers_jina_v3\)\b" .opencode/skills/mcp-coco-index/
```

**Result:** 33 matches found, including:

**Top-level tests/ directory (NOT run by standard pytest):**
- `.opencode/skills/mcp-coco-index/tests/test_protocol.py:10:from cocoindex_code.protocol import`
- `.opencode/skills/mcp-coco-index/tests/test_e2e_daemon.py:26:from cocoindex_code.settings import`
- `.opencode/skills/mcp-coco-index/tests/test_daemon.py:26:from cocoindex_code.protocol import`
- `.opencode/skills/mcp-coco-index/tests/test_daemon.py:42:from cocoindex_code.settings import`
- `.opencode/skills/mcp-coco-index/tests/test_daemon.py:64:from cocoindex_code.shared import create_embedder`
- `.opencode/skills/mcp-coco-index/tests/test_backward_compat.py:15:from cocoindex_code.settings import`
- `.opencode/skills/mcp-coco-index/tests/test_config.py:16:from cocoindex_code.config.config import Config`
- `.opencode/skills/mcp-coco-index/tests/test_e2e.py:27:from cocoindex_code.settings import find_parent_with_marker`
- `.opencode/skills/mcp-coco-index/tests/test_client.py:24:from cocoindex_code.protocol import`
- `.opencode/skills/mcp-coco-index/tests/test_client.py:29:from cocoindex_code.settings import`
- `.opencode/skills/mcp-coco-index/tests/test_settings.py:14:from cocoindex_code.config.config import _DEFAULT_MODEL`
- `.opencode/skills/mcp-coco-index/tests/test_settings.py:15:from cocoindex_code.config.settings import`
- `.opencode/skills/mcp-coco-index/tests/test_settings.py:149:from cocoindex_code.settings import _user_settings_from_dict`
- `.opencode/skills/mcp-coco-index/tests/test_settings.py:158:from cocoindex_code.settings import user_settings_path`

**mcp_server/tests/ directory (run by pytest):**
- Multiple files using `from cocoindex_code.config.config import`
- Multiple files using `from cocoindex_code.config.settings import`
- Multiple files using `from cocoindex_code.observability.* import`
- Multiple files using `from cocoindex_code.indexer.* import`

**Documentation:**
- `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md:537:from cocoindex_code.registered_embedders import list_embedders`

### Verification test run
```bash
cd .opencode/skills/mcp-coco-index/mcp_server && .venv/bin/python -m pytest tests/ -q
```

**Result:** 222 passed in 26.03s

```bash
cd .opencode/skills/mcp-coco-index/mcp_server && .venv/bin/ruff check cocoindex_code/ tests/
```

**Result:** All checks passed!

### Test collection analysis
```bash
cd .opencode/skills/mcp-coco-index/mcp_server && .venv/bin/python -m pytest tests/ --collect-only -q
```

**Result:** 222 tests collected from `mcp_server/tests/` directory only. Top-level `tests/` directory is NOT included in test collection.

### Verification that top-level tests fail with stale imports
```bash
cd .opencode/skills/mcp-coco-index && PYTHONPATH=.opencode/skills/mcp-coco-index/mcp_server /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python -m pytest tests/test_protocol.py::test_index_request_serialization -v
```

**Result:** ImportError: No module named 'cocoindex_code.protocol'

### Import sweep commit analysis
```bash
git show ed7dcd0ac --stat
```

**Result:** Commit ed7dcd0ac fixed imports in only 8 files:
- cli.py, daemon.py, server.py (entry files)
- test_rerankers_jina_v3.py, test_search_budget.py (caplog logger strings)
- test_client.py, test_e2e.py, test_e2e_daemon.py (top-level skill tests)

**Missing:** Many other top-level test files with stale imports were NOT fixed:
- test_protocol.py
- test_daemon.py
- test_backward_compat.py
- test_config.py
- test_settings.py

## Findings

### P1 — Top-level tests/ directory has stale imports and is not being run

**Evidence:**
- `.opencode/skills/mcp-coco-index/tests/test_protocol.py:10:from cocoindex_code.protocol import` — protocol is now at `cocoindex_code.core.protocol`
- `.opencode/skills/mcp-coco-index/tests/test_daemon.py:26:from cocoindex_code.protocol import` — stale path
- `.opencode/skills/mcp-coco-index/tests/test_daemon.py:42:from cocoindex_code.settings import` — settings is now at `cocoindex_code.config.settings`
- `.opencode/skills/mcp-coco-index/tests/test_daemon.py:64:from cocoindex_code.shared import create_embedder` — shared is now at `cocoindex_code.core.shared`
- `.opencode/skills/mcp-coco-index/tests/test_backward_compat.py:15:from cocoindex_code.settings import` — stale path
- `.opencode/skills/mcp-coco-index/tests/test_config.py:16:from cocoindex_code.config.config import Config` — this one is actually correct (config.config exists)
- `.opencode/skills/mcp-coco-index/tests/test_e2e.py:27:from cocoindex_code.settings import find_parent_with_marker` — stale path
- `.opencode/skills/mcp-coco-index/tests/test_settings.py:14-15,149,158:from cocoindex_code.config.config/settings import` — these are actually correct (config.config and config.settings exist)
- `.opencode/skills/mcp-coco-index/tests/test_client.py:24,29:from cocoindex_code.protocol/settings import` — stale paths

**Verification:** Running any of these tests results in `ModuleNotFoundError: No module named 'cocoindex_code.protocol'`

**Root cause:** The import sweep commit ed7dcd0ac only fixed 3 top-level test files (test_client.py, test_e2e.py, test_e2e_daemon.py) but missed test_protocol.py, test_daemon.py, test_backward_compat.py. Additionally, pytest only runs mcp_server/tests/ (222 tests), not the top-level tests/ directory, so these stale imports were masked.

**Recommendation:** Either:
1. Update all stale imports in top-level tests/ to use new subdirectory paths, OR
2. Delete the top-level tests/ directory if it's deprecated (mcp_server/tests/ appears to be the canonical test suite), OR
3. Add top-level tests/ to pytest collection if these tests are still needed

**Severity:** P1 — correctness issue. The test suite has a dormant test directory that cannot run. If these tests were ever added back to pytest collection, they would fail. This represents incomplete restructure work.

### P2 — Documentation import path may be stale

**Evidence:**
- `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md:537:from cocoindex_code.registered_embedders import list_embedders`

**Analysis:** registered_embedders is now at `cocoindex_code.embedders.registered_embedders`. Need to verify if this import actually works or if the documentation needs updating.

**Recommendation:** Test the import path in INSTALL_GUIDE.md to verify it works, or update to `from cocoindex_code.embedders.registered_embedders import list_embedders`.

**Severity:** P2 — documentation traceability issue.

### INFO — mcp_server/tests/ uses correct absolute imports

**Evidence:** All files in mcp_server/tests/ use sub-dir-qualified absolute imports like:
- `from cocoindex_code.config.config import Config`
- `from cocoindex_code.config.settings import PROJECT_SETTINGS`
- `from cocoindex_code.observability.index_metadata import`
- `from cocoindex_code.indexer.indexer import write_index_metadata`

**Analysis:** These are correct and match the restructured layout. The import sweep correctly updated the active test suite.

**Severity:** INFO — no action needed.

## Updates to review.md

Iteration 001 completed. Found P1 issue with dormant top-level tests/ directory containing stale imports that were not fixed by the import sweep commit. The active test suite (mcp_server/tests/) is correct and all 222 tests pass.

## NO-EARLY-STOP confirmation

Iteration 1 of 10 complete. Continuing to iteration 2.
