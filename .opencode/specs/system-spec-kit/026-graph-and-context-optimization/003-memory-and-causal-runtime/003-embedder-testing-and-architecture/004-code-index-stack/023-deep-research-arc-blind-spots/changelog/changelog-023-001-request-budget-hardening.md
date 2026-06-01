---
title: "023-001: Request Budget Hardening for mcp-coco-index"
description: "Central SearchBudget validation shipped across CLI, MCP plus direct query callers. Invalid high-cost requests now fail before embedding, DB lookup or daemon dispatch. Four deep-research findings closed."
trigger_phrases:
  - "023E request budget hardening"
  - "SearchBudgetExceeded mcp-coco-index"
  - "search budget validation coco index"
  - "request cost hardening retrieval stack"
  - "high-offset query fails fast"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/001-request-budget-hardening`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots`

### Summary

The mcp-coco-index retrieval stack had no central guard on request cost. A demonstrated `ccc search "registered_embedders" --path '*' --limit 100 --offset 20000` query took 21.59 seconds because `fetch_k = (limit + offset) * 4` produced unbounded DB work. Full-scan path handling amplified the scan while multi-language KNN fanout multiplied the cost further. Four deep-research findings (FINDING-005-A, FINDING-015-A, FINDING-015-C, FINDING-020-C) documented the risk but no validation existed at any entry point.

A new `search_budget.py` module introduced `SearchBudget`, `SearchBudgetedRequest` plus `SearchBudgetExceeded` with a central `validate_search_budget` function. Six env-backed knobs cover offset, limit, fetch_k, language fanout, path fullscan permission plus a soft timeout. The validator was wired into `query.py`, `server.py` plus `cli.py` so all three entry surfaces share the same guard. The 21.59-second repro now fails fast in 0.746 seconds. Eight new regression tests plus 188 passing tests in the full suite confirm no regressions.

### Added

- `search_budget.py` with `SearchBudget`, `SearchBudgetedRequest`, `SearchBudgetExceeded` plus `validate_search_budget`
- Six env-backed budget knobs: `COCOINDEX_SEARCH_MAX_OFFSET`, `COCOINDEX_SEARCH_MAX_LIMIT`, `COCOINDEX_SEARCH_MAX_FETCH_K`, `COCOINDEX_SEARCH_MAX_LANGUAGES`, `COCOINDEX_SEARCH_PATH_FULLSCAN_ALLOWED`, `COCOINDEX_SEARCH_TIMEOUT_SEC`
- `test_search_budget.py` with 8 regression tests covering offset cap, limit cap, fetch_k clamp, language fanout clamp, path fullscan refusal, forced fullscan opt-in plus pre-DB ordering

### Changed

- `query.py` now calls `validate_search_budget` before embedding or DB lookup. Uses `min((limit + offset) * 4, MAX_FETCH_K)` for clamped fetch_k. Clamps language fanout to `MAX_LANGUAGES`. Skips rerank after soft timeout.
- `server.py` validates MCP search requests via `validate_search_budget` before daemon dispatch. Returns the existing `success=false` error envelope on budget failure.
- `cli.py` validates CLI search requests after argparse and before daemon startup. Surfaces failures as `Search failed: SearchBudgetExceeded(...)` with exit 1.
- `config.py` extended with env parsing for all six budget knobs with documented defaults.

### Fixed

- High-offset queries such as `--offset 20000` bypassed all guards and ran unbounded DB work. The offset cap now raises `SearchBudgetExceeded(budget_field="offset")` before any retrieval.
- CLI and MCP validation were unaligned. Both now share the same central validator.
- `fetch_k` was computed as raw `(limit + offset) * 4` with no ceiling. The clamp prevents pathological candidate counts.
- Global wildcard path filters (`*`, `*.py`) triggered full-index scans without warning. Path fullscan is now refused by default unless `COCOINDEX_SEARCH_PATH_FULLSCAN_ALLOWED=true`.

### Verification

| Check | Command | Result |
|-------|---------|--------|
| Focused budget tests | `.venv/bin/python -m pytest tests/test_search_budget.py -q` | 8 passed in 0.58s |
| Adjacent integration tests | `.venv/bin/python -m pytest tests/test_refresh_split.py tests/test_fts_index.py tests/test_config.py -q` | 47 passed in 4.69s |
| Full pytest suite | `.venv/bin/python -m pytest tests/ -q` | 188 passed in 17.48s |
| Ruff | `.venv/bin/ruff check cocoindex_code/ tests/` | Clean |
| 21.59s repro | `time .venv/bin/ccc search "registered_embedders" --path '*' --limit 100 --offset 20000` | Exits 1 in 0.746s with `SearchBudgetExceeded(field=offset, actual=20000, limit=1000)` |
| Strict packet validation | `validate.sh ... 001-request-budget-hardening --strict` | Passed |
| Findings closed | FINDING-005-A, FINDING-015-A, FINDING-015-C, FINDING-020-C | All closed |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/search_budget.py` | Created (NEW) | Central `SearchBudget`, `SearchBudgetedRequest`, `SearchBudgetExceeded` plus `validate_search_budget`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Modified | Added env-backed budget knobs and defaults for all six parameters. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modified | Budget validation before retrieval work. Clamped `fetch_k`. Language fanout cap. Soft-timeout rerank skip. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | Modified | MCP handler validates via `validate_search_budget` before daemon dispatch. Preserves `success=false` envelope. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | Modified | CLI validates after argparse and before daemon startup. Prints structured failure with exit 1. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_search_budget.py` | Created (NEW) | 8 regression tests for offset cap, limit cap, fetch_k clamp, fanout clamp, fullscan refusal, opt-in plus pre-DB ordering. |

### Follow-Ups

- Soft timeout is cooperative and cannot preempt every SQLite extension operation mid-call. It prevents rerank work after retrieval returns if the elapsed budget is already exceeded, but does not interrupt active DB calls.
- MCP response model remains message-based. Structured fields live on `SearchBudgetExceeded` but the MCP envelope stays `success=false` plus message for protocol compatibility.
- Path fullscan policy covers global wildcards only. Scoped patterns such as `src/*` remain allowed. A future packet could add more granular wildcard matching if required.
