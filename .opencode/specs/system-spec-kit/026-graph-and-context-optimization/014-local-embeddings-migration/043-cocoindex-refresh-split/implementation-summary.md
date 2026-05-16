---
title: "Implementation Summary: 042 CocoIndex Refresh/Search Split"
description: "Records the MCP refresh/search split, source changes, verification evidence, and migration steps."
trigger_phrases:
  - "042 implementation summary"
  - "cocoindex refresh split summary"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/043-cocoindex-refresh-split"
    last_updated_at: "2026-05-14T16:45:00Z"
    last_updated_by: "codex"
    recent_action: "Completed MCP refresh/search split"
    next_safe_action: "Call cocoindex_refresh_index before search batches when code changed"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py"
      - ".opencode/skills/mcp-coco-index/references/tool_reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000042"
      session_id: "043-cocoindex-refresh-split"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should a later packet add path-scoped daemon refresh?"
      - "Should a later packet add optional periodic background refresh?"
    answered_questions:
      - "MCP search now defaults refresh_index=false."
      - "Explicit search(refresh_index=true) remains backward-compatible."
      - "CLI defaults are unchanged."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/043-cocoindex-refresh-split` |
| **Started** | 2026-05-14 |
| **Completed** | 2026-05-14 |
| **Level** | 3 |
| **Branch** | main |
| **Status** | PASS |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

CocoIndex MCP search no longer refreshes the index by default. The behavior that used to happen implicitly inside every omitted-argument MCP search is now explicit through `cocoindex_refresh_index`, while callers that already pass `refresh_index=true` keep the old refresh-before-search path.

### Source Changes

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:83` | Modified | Adds `RefreshIndexResultModel` for the new refresh tool response. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:146` | Modified | Changes `search.refresh_index` default from `true` to `false`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:180` | Modified | Preserves explicit refresh-before-search when `refresh_index=true`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:251` | Modified | Registers `cocoindex_refresh_index` and calls `client.index(project_root)` without search. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:335` | Modified | Generalizes JSON response-size logging for both search and refresh result models. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py` | Created | Covers T042-01, T042-02, and T042-03. |
| `.opencode/skills/mcp-coco-index/references/tool_reference.md` | Modified | Documents two MCP tools, default `refresh_index=false`, and explicit refresh. |
| `.opencode/skills/mcp-coco-index/SKILL.md` | Modified | Updates agent guidance to call explicit refresh after code changes. |
| `.opencode/skills/mcp-coco-index/README.md` | Modified | Updates public usage, FAQ, and CLI/MCP parameter mapping. |
| `.opencode/skills/mcp-coco-index/references/search_patterns.md` | Modified | Updates multi-query guidance for no-refresh search default. |
| `.opencode/skills/mcp-coco-index/references/cross_cli_playbook.md` | Modified | Updates cross-runtime best practices. |
| `.opencode/skills/mcp-coco-index/feature_catalog/feature_catalog.md` | Modified | Updates root MCP feature summary. |
| `.opencode/skills/mcp-coco-index/feature_catalog/02--mcp-server/01-search-tool-contract.md` | Modified | Updates search contract catalog entry. |
| `.opencode/skills/mcp-coco-index/feature_catalog/02--mcp-server/02-refresh-index-default.md` | Modified | Updates refresh default catalog entry. |
| `.opencode/skills/mcp-coco-index/scripts/common.sh` | Modified | Updates readiness success message. |

### Behavior Contract

| Scenario | Result |
|----------|--------|
| MCP `search({"query": "..."})` | Searches without refreshing first. |
| MCP `search({"query": "...", "refresh_index": true})` | Refreshes first, then searches. |
| MCP `cocoindex_refresh_index({})` | Refreshes the index without searching. |
| CLI `ccc search "..."` | Unchanged; no refresh unless `--refresh` is passed. |
| CLI `ccc index` | Unchanged; remains the operator refresh path. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The patch stayed at the FastMCP wrapper layer because the existing refresh call was already separable: `server.py` called `client.index(project_root)` before `client.search(...)` only when `refresh_index` was true. No daemon IPC schema change was needed, and no CLI code was modified.

`paths` on `cocoindex_refresh_index` is accepted as a future-compatible hint. The current daemon refresh path remains project-wide incremental indexing, so docs explicitly say paths do not restrict refresh scope yet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Flip only the MCP default | The timeout problem is in MCP request scope; CLI already defaults refresh off unless `--refresh` is passed. |
| Add explicit refresh tool | It lets callers refresh before a search batch without making every search pay the refresh cost. |
| Keep `search(refresh_index=true)` | Existing callers that rely on old behavior keep working. |
| Defer background refresh | A periodic scheduler adds lifecycle and env-clamp complexity that was not needed for the behavior split. |
| Do not add path-scoped daemon protocol | Existing daemon `IndexRequest` only carries `project_root`; changing it would widen the packet beyond the requested split. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Initial prescribed compile | FAIL | `python3 -m compileall -q cocoindex_code` failed because macOS tried to write pyc files under `/Users/michelkerkmeester/Library/Caches/com.apple.python`, outside writable sandbox scope. |
| Python compile rerun | PASS | `PYTHONPYCACHEPREFIX=/tmp/cocoindex-pycache .venv/bin/python -m compileall -q cocoindex_code` exit 0. |
| Editable build | PASS | `.venv/bin/python -m pip install -e . --no-build-isolation --no-deps` exit 0. |
| Requested pytest | PASS | `PYTHONPYCACHEPREFIX=/tmp/cocoindex-pycache .venv/bin/python -m pytest tests/test_observability.py tests/test_e2e_daemon.py -v` -> `9 passed, 3 skipped in 3.69s`. |
| New refresh split pytest | PASS | `.venv/bin/python -m pytest tests/test_refresh_split.py -v` -> `3 passed in 0.20s`. |
| Strict validate | PASS | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/043-cocoindex-refresh-split --strict` -> `RESULT: PASSED`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Path-scoped refresh is not implemented.** `paths` is a contract hint and response echo; current daemon refresh remains project-wide incremental.
2. **Background periodic refresh is deferred.** A follow-on can add `COCOINDEX_CODE_BACKGROUND_REFRESH=true` and interval clamping with scheduler tests.
3. **Stale-index reads are possible.** Operators and agents should call `cocoindex_refresh_index` after code changes or pass `search(refresh_index=true)` when a one-shot refresh-before-search is needed.
4. **Bare `python` is unavailable in this shell.** Verification used `.venv/bin/python` and `python3`; the first `python3` compile also needed `PYTHONPYCACHEPREFIX` because of sandboxed cache writes.
<!-- /ANCHOR:limitations -->
