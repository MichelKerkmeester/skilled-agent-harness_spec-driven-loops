---
title: "Tasks: 023E Request Budget Hardening"
description: "Task checklist for implementing mcp-coco-index search request-budget hardening."
trigger_phrases:
  - "023E request budget tasks"
  - "SearchBudget tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/001-request-budget-hardening"
    last_updated_at: "2026-05-19T20:10:29Z"
    last_updated_by: "codex"
    recent_action: "Completed task checklist"
    next_safe_action: "Main agent may review the diff and commit."
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_search_budget.py"
    session_dedup:
      fingerprint: "sha256:023e023e023e023e023e023e023e023e023e023e023e023e023e023e023e023e"
      session_id: "023-deep-research-arc-blind-spots/001-request-budget-hardening-codex"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: 023E Request Budget Hardening

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read `query.py` fanout and fetch_k sites [5m]
- [x] T002 Read `server.py` MCP handler entrypoint [5m]
- [x] T003 Read `cli.py` `ccc search` command path [5m]
- [x] T004 Read `config.py` env parsing patterns and `protocol.py` response shape [5m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Budget Model
- [x] T005 Add budget env defaults to `config.py` [10m]
- [x] T006 Create `search_budget.py` with `SearchBudget`, `SearchBudgetedRequest`, and `SearchBudgetExceeded` [15m]
- [x] T007 Add central `validate_search_budget` logic [10m]

### Wiring
- [x] T008 Wire MCP handler validation in `server.py` [5m]
- [x] T009 Wire CLI validation before daemon dispatch in `cli.py` [5m]
- [x] T010 Wire direct query validation in `query.py` before expensive work [5m]
- [x] T011 Replace raw fetch_k math with budgeted clamp [3m]
- [x] T012 Add soft-timeout rerank skip path [2m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Regression Tests
- [x] T013 Add `test_offset_cap_enforced` [5m]
- [x] T014 Add `test_limit_cap_enforced` [5m]
- [x] T015 Add `test_fetch_k_clamped` [10m]
- [x] T016 Add `test_language_fanout_capped` [5m]
- [x] T017 Add `test_path_fullscan_refused_by_default` [5m]
- [x] T018 Add `test_path_fullscan_allowed_when_forced` [5m]
- [x] T019 Add `test_budget_validator_runs_before_db_hit` [10m]

### Verification Commands
- [x] T020 Run focused budget tests [5m]
- [x] T021 Run adjacent server/query/config tests [5m]
- [x] T022 Run full mcp-coco-index pytest suite [20m]
- [x] T023 Run ruff for `cocoindex_code/` and `tests/` [5m]
- [x] T024 Run original high-offset repro and record outcome [5m]
- [x] T025 Write packet docs and metadata [20m]
- [x] T026 Run strict spec validation [5m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `pytest tests/ -q` passes with 188 tests
- [x] `ruff check cocoindex_code/ tests/` passes clean
- [x] 21.59s repro fails fast with `SearchBudgetExceeded`
- [x] `validate.sh ... --strict` passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
