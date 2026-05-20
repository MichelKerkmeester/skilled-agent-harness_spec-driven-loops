---
title: "Implementation Summary: 023E Request Budget Hardening"
description: "Implemented central SearchBudget validation for mcp-coco-index search requests and verified the 21.59s high-offset repro now fails fast."
trigger_phrases:
  - "023E request budget implementation summary"
  - "SearchBudgetExceeded implementation"
  - "mcp-coco-index request budget hardening"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/001-request-budget-hardening"
    last_updated_at: "2026-05-19T20:10:29Z"
    last_updated_by: "codex"
    recent_action: "Implemented SearchBudget hardening"
    next_safe_action: "Main agent may review the diff and commit."
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/search_budget.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_search_budget.py"
    session_dedup:
      fingerprint: "sha256:023e023e023e023e023e023e023e023e023e023e023e023e023e023e023e023e"
      session_id: "023-deep-research-arc-blind-spots/001-request-budget-hardening-codex"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary: 023E Request Budget Hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/001-request-budget-hardening/` |
| **Completed** | 2026-05-19 |
| **Level** | 2 |
| **Findings Closed** | 005-A, 015-A, 015-C, 020-C |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented central request-budget hardening for the mcp-coco-index retrieval stack. Invalid high-cost requests now fail before embedding, DB lookup, or daemon search dispatch; valid requests use clamped fetch and language fanout bounds.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/search_budget.py` | Created | Central `SearchBudget`, `SearchBudgetedRequest`, `SearchBudgetExceeded`, and validator. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Modified | Added env-backed budget knobs and defaults. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modified | Validates before expensive work, uses clamped `fetch_k`, clamps language fanout, and skips rerank after soft timeout. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | Modified | Validates MCP search requests before daemon dispatch and returns existing `success=false` error shape. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | Modified | Validates CLI search requests before daemon startup/search dispatch. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/tests/test_search_budget.py` | Created | Regression tests for all requested budget cases. |
| `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/001-request-budget-hardening/` | Created | Level 2 packet docs and metadata. |

### Env Vars Added

| Env Var | Default | Behavior |
|---------|---------|----------|
| `COCOINDEX_SEARCH_MAX_OFFSET` | `1000` | Refuses larger offsets. |
| `COCOINDEX_SEARCH_MAX_LIMIT` | `200` | Refuses larger limits. |
| `COCOINDEX_SEARCH_MAX_FETCH_K` | `4000` | Clamps `(limit + offset) * 4`. |
| `COCOINDEX_SEARCH_MAX_LANGUAGES` | `8` | Clamps multi-language KNN fanout. |
| `COCOINDEX_SEARCH_PATH_FULLSCAN_ALLOWED` | `false` | Refuses global wildcard path fullscans like `*` unless true. |
| `COCOINDEX_SEARCH_TIMEOUT_SEC` | `10` | Soft deadline; logs and skips rerank if exceeded after retrieval returns. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery stayed inside the requested mcp-coco-index search surfaces. The implementation first added the budget model, then wired MCP, CLI, and direct query callers through the same validator, then verified behavior with focused tests, adjacent integration tests, the full suite, ruff, and the original high-offset repro.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| New `search_budget.py` module | Keeps request budget logic central and reusable across CLI, MCP, and direct query callers. |
| Validate in `query_codebase` as well as entry surfaces | Direct daemon or unit callers still get pre-embedder/pre-DB protection. |
| Clamp `fetch_k` instead of raising on fetch product | Default `limit=200` and `offset=1000` would otherwise exceed `4000`; the packet explicitly required a clamp. |
| Refuse only global wildcard path patterns by default | Preserves scoped path filters such as `src/*` while blocking the demonstrated `--path '*'` fullscan. |
| Preserve MCP/CLI error shapes | Avoids protocol churn while `SearchBudgetExceeded` still carries structured fields in code. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Focused budget tests | `.venv/bin/python -m pytest tests/test_search_budget.py -q` | `8 passed in 0.58s` |
| Adjacent integration tests | `.venv/bin/python -m pytest tests/test_refresh_split.py tests/test_fts_index.py tests/test_config.py -q` | `47 passed in 4.69s` |
| Full pytest suite | `.venv/bin/python -m pytest tests/ -q` | `188 passed in 17.48s` |
| Ruff | `.venv/bin/ruff check cocoindex_code/ tests/` | Clean |
| 21.59s repro | `time .venv/bin/ccc search "registered_embedders" --path '*' --limit 100 --offset 20000` | PASS_FAST: exited 1 in 0.746s with `SearchBudgetExceeded(field=offset, actual=20000, limit=1000, ...)` |
| Strict spec validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/001-request-budget-hardening --strict` | Passed |

### Findings Closed

| Finding | Closure Evidence |
|---------|------------------|
| HIGH FINDING-005-A | `fetch_k` is clamped, language fanout is capped, and global wildcard path fullscans are refused by default. |
| HIGH FINDING-015-A | Demonstrated high-offset repro now fails fast in 0.746s before retrieval work. |
| MED FINDING-015-C | CLI and MCP both use `validate_search_budget`; CLI now has central `limit` and `offset` caps. |
| HIGH FINDING-020-C | Request-cost bug is bounded before work begins, reducing the compound risk with weak observability. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | Invalid high-offset request fails before DB work | `test_budget_validator_runs_before_db_hit` and repro pass | Pass |
| NFR-P02 | `fetch_k` hard ceiling | `test_fetch_k_clamped` observes `4000` instead of raw `4800` | Pass |
| NFR-P03 | Language fanout default cap | `test_language_fanout_capped` clamps 9 to 8 | Pass |
| NFR-R01 | CLI/MCP validator parity | Both surfaces import and call `validate_search_budget` | Pass |
| NFR-O01 | Structured operator error | `SearchBudgetExceeded.as_dict()` tested | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Soft timeout is cooperative** - It cannot preempt every SQLite extension operation mid-call; it prevents rerank work after retrieval if the elapsed budget is already exceeded.
2. **MCP response model remains message-based** - Structured fields live on `SearchBudgetExceeded`, but the MCP envelope stays `success=false` plus `message` for compatibility.
3. **Path fullscan policy is scoped** - `*`, `*.py`, and similar global wildcards are refused; scoped patterns like `src/*` remain allowed.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Protocol change if needed | No protocol change | Existing `SearchResultModel` shape was preserved. |
| Optional repro if daemon running | Repro run without needing daemon dispatch | CLI validation now fails before daemon startup/search dispatch. |
| `fetch_k` as hard ceiling | Implemented as clamp | Required by packet and avoids rejecting valid default max offset/limit combination. |
<!-- /ANCHOR:deviations -->

---

## Commit Handoff

Main agent should commit the following paths:

- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/search_budget.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py`
- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_search_budget.py`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/001-request-budget-hardening/`
