---
title: "CocoIndex MCP Refresh/Search Split"
description: "Splits implicit MCP refresh from search by flipping the refresh_index default to false and adding a standalone cocoindex_refresh_index tool. All callers that already pass refresh_index=true continue to work unchanged."
trigger_phrases:
  - "cocoindex refresh search split"
  - "cocoindex_refresh_index tool"
  - "refresh_index default false"
  - "mcp search no implicit refresh"
  - "cocoindex mcp refresh split 043"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/043-cocoindex-refresh-split` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

MCP `search` had been defaulting `refresh_index=true`, meaning every ordinary semantic query would trigger a full index refresh inside the same request scope. This made search latency unpredictable and wasted request budget on indexing work that callers had not asked for. Packet 035 identified the timeout risk and packet 041 added the observability hooks needed to measure it.

The patch flipped the `search.refresh_index` default in `server.py` from `true` to `false` and registered a new `cocoindex_refresh_index` MCP tool that calls the existing daemon refresh path without performing a search. Callers that already pass `refresh_index=true` keep the old refresh-before-search path unchanged. All user-facing skill docs, README, tool reference, feature catalog entries, search patterns guide and cross-CLI playbook were updated to reflect the two-tool surface. A three-case pytest suite confirmed the no-refresh default, the explicit refresh-before-search path and the standalone refresh tool.

### Added

- `RefreshIndexResultModel` response model in `server.py` for the new refresh tool
- `cocoindex_refresh_index(paths?: list[str])` MCP tool registered in `server.py` that calls `client.index(project_root)` without searching
- `tests/test_refresh_split.py` covering three behaviors: no-refresh default, explicit refresh-before-search and standalone refresh

### Changed

- `server.py` `search.refresh_index` FastMCP default changed from `true` to `false`
- `server.py` JSON response-size logging generalized to cover both search and refresh result models
- `references/tool_reference.md` updated to document two MCP tools and the new `refresh_index=false` default
- `SKILL.md` updated with agent guidance to call `cocoindex_refresh_index` explicitly after code changes
- `README.md` updated with public usage, FAQ and CLI-to-MCP parameter mapping
- `references/search_patterns.md` updated for the no-refresh search default in multi-query guidance
- `references/cross_cli_playbook.md` updated with cross-runtime best practices for explicit refresh
- `feature_catalog/feature_catalog.md` updated with the two-tool MCP surface summary
- `feature_catalog/02--mcp-server/01-search-tool-contract.md` updated to reflect the new default
- `feature_catalog/02--mcp-server/02-refresh-index-default.md` updated to reflect the explicit refresh contract
- `scripts/common.sh` updated with the revised readiness success message

### Fixed

- MCP `search` no longer implicitly triggers index refresh on every call, bounding search latency to search work only

### Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Python compile (first attempt) | FAIL | `python3 -m compileall -q cocoindex_code` failed because macOS tried to write pyc files outside the writable sandbox scope. |
| Python compile (rerun with prefix) | PASS | `PYTHONPYCACHEPREFIX=/tmp/cocoindex-pycache .venv/bin/python -m compileall -q cocoindex_code` exit 0. |
| Editable build | PASS | `.venv/bin/python -m pip install -e . --no-build-isolation --no-deps` exit 0. |
| Existing pytest suite | PASS | `9 passed, 3 skipped in 3.69s` across `test_observability.py` and `test_e2e_daemon.py`. |
| Refresh split pytest | PASS | `.venv/bin/python -m pytest tests/test_refresh_split.py -v` -> `3 passed in 0.20s`. |
| Strict packet validation | PASS | `validate.sh --strict` exit 0, zero errors, zero warnings. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | Modified | Added `RefreshIndexResultModel`. Flipped `search.refresh_index` default to `false`. Registered `cocoindex_refresh_index`. Generalized JSON response-size logging. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py` | Created (NEW) | Three-case pytest suite covering no-refresh default, explicit refresh-before-search and standalone refresh. |
| `.opencode/skills/mcp-coco-index/references/tool_reference.md` | Modified | Documents two MCP tools and the `refresh_index=false` default. |
| `.opencode/skills/mcp-coco-index/SKILL.md` | Modified | Updates agent guidance for explicit refresh after code changes. |
| `.opencode/skills/mcp-coco-index/README.md` | Modified | Updates public usage, FAQ and CLI/MCP parameter mapping. |
| `.opencode/skills/mcp-coco-index/references/search_patterns.md` | Modified | Updates multi-query guidance for no-refresh default. |
| `.opencode/skills/mcp-coco-index/references/cross_cli_playbook.md` | Modified | Updates cross-runtime best practices for explicit refresh. |
| `.opencode/skills/mcp-coco-index/feature_catalog/feature_catalog.md` | Modified | Updates root MCP feature summary for two-tool surface. |
| `.opencode/skills/mcp-coco-index/feature_catalog/02--mcp-server/01-search-tool-contract.md` | Modified | Updates search contract catalog entry. |
| `.opencode/skills/mcp-coco-index/feature_catalog/02--mcp-server/02-refresh-index-default.md` | Modified | Updates refresh default catalog entry. |
| `.opencode/skills/mcp-coco-index/scripts/common.sh` | Modified | Updates readiness success message. |

### Follow-Ups

- Add path-scoped daemon refresh. The `paths` parameter is currently accepted as a hint and echoed in the response, but the daemon refresh remains project-wide incremental. A follow-on packet would need to extend the `IndexRequest` protocol.
- Add background periodic refresh. A `COCOINDEX_CODE_BACKGROUND_REFRESH=true` flag with interval clamping and scheduler tests was deferred because it was not needed for the contract split.
- Note that stale-index reads are possible after code changes. Operators should call `cocoindex_refresh_index` before a search batch. Passing `search(refresh_index=true)` provides a one-shot refresh-before-search alternative.
