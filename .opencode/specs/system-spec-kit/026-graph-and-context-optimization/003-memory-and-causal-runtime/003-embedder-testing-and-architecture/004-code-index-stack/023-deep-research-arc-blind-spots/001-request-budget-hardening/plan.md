---
title: "Plan: 023E Request Budget Hardening"
description: "Implementation plan for central mcp-coco-index request-budget validation across query, MCP, and CLI search surfaces."
trigger_phrases:
  - "023E request budget plan"
  - "SearchBudget plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/001-request-budget-hardening"
    last_updated_at: "2026-05-19T20:10:29Z"
    last_updated_by: "codex"
    recent_action: "Planned request-budget hardening"
    next_safe_action: "Main agent may review the diff and commit."
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/search_budget.py"
    session_dedup:
      fingerprint: "sha256:023e023e023e023e023e023e023e023e023e023e023e023e023e023e023e023e"
      session_id: "023-deep-research-arc-blind-spots/001-request-budget-hardening-codex"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Plan: 023E Request Budget Hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11+ |
| **Surface** | `.opencode/skills/mcp-coco-index/mcp_server` |
| **Runtime Paths** | Typer CLI, FastMCP server, daemon-backed query execution |
| **Testing** | pytest and ruff |

### Overview
The implementation adds a central `SearchBudget` validator and routes all search entrypoints through it before expensive work begins. The validator refuses out-of-range offset/limit values, refuses global wildcard path fullscans by default, clamps multi-language fanout, and produces the clamped `fetch_k` used by `query.py`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate 3 folder pre-bound by operator.
- [x] Relevant code surfaces read before edits.
- [x] Root cause identified at `query.py` fetch_k, path fullscan, and language fanout sites.
- [x] 023C observability surface treated as out of scope.

### Definition of Done
- [x] Central validator added.
- [x] MCP and CLI surfaces validate before dispatch.
- [x] Direct query execution validates before embedding/DB work.
- [x] Regression tests added.
- [x] Full pytest and ruff verification passed.
- [x] Strict spec validation passed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Central validation module with small immutable dataclasses.

### Key Components
- **SearchBudget**: Runtime cap values, derived from config or env.
- **SearchBudgetedRequest**: Normalized request values passed downstream.
- **SearchBudgetExceeded**: Structured error with `budget_field`, `actual`, `limit`, and `suggestion`.
- **validate_search_budget**: Single validator used by query, MCP, and CLI.

### Data Flow
1. CLI/MCP receives user search args.
2. Entry surface normalizes optional lists and calls `validate_search_budget`.
3. Invalid requests return existing failure envelopes before daemon search dispatch.
4. Valid requests pass normalized languages/paths downstream.
5. `query_codebase` validates again for direct callers before index existence checks, context lookup, embedding, or DB work.
6. `query.py` uses `budgeted.fetch_k` instead of raw `(limit + offset) * 4`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `query.py`, `server.py`, `cli.py`, `config.py`, and `protocol.py`.
- [x] Identify path fullscan and language fanout branches.
- [x] Identify `fetch_k` formula as the immediate math root cause.

### Phase 2: Implementation
- [x] Add env-backed budget defaults to `config.py`.
- [x] Add `search_budget.py` with central validator and error class.
- [x] Wire MCP handler validation.
- [x] Wire CLI validation before daemon startup/search dispatch.
- [x] Wire direct `query_codebase` validation before expensive work.
- [x] Clamp `fetch_k` and language fanout.
- [x] Refuse global wildcard path fullscans by default.

### Phase 3: Verification
- [x] Add `tests/test_search_budget.py`.
- [x] Run targeted budget tests.
- [x] Run adjacent query/server/config tests.
- [x] Run full pytest suite.
- [x] Run ruff.
- [x] Run optional high-offset repro.
- [x] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Validator caps, structured errors, env opt-in | pytest |
| Query integration | Clamped fetch_k and pre-embedder ordering | pytest with monkeypatch fakes |
| Surface integration | Adjacent MCP/query/config behavior | pytest |
| Static quality | Python lint | ruff |
| Packet validation | Spec folder contract | `validate.sh --strict` |
| Repro | Original 21.59s command fails fast | `time .venv/bin/ccc search ...` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing `Config.from_env()` parser helpers | Internal | Green | Budget knobs need safe env parsing. |
| Existing CLI daemon client | Internal | Green | CLI must still dispatch valid searches. |
| Existing MCP `SearchResultModel` | Internal | Green | Error shape must stay compatible. |
| pytest venv | Tooling | Green | Regression suite requires local venv. |
| ruff venv | Tooling | Green | Static verification requires local venv. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Budget validator rejects expected production search traffic or breaks CLI/MCP dispatch.
- **Procedure**: Revert changes to `search_budget.py`, `config.py`, `query.py`, `server.py`, `cli.py`, and `tests/test_search_budget.py`.
- **Verification after rollback**: Run `pytest tests/ -q` and `ruff check cocoindex_code/ tests/`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Operator packet scope | Implementation |
| Implementation | Source reads | Verification |
| Verification | Implementation | Completion |
| Documentation | Verification evidence | Strict validation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|-------|------------|---------------|
| Setup and source read | Low | 20 minutes |
| Budget implementation | Medium | 55 minutes |
| Regression tests | Medium | 35 minutes |
| Verification and repro | Low | 25 minutes |
| Packet docs | Low | 30 minutes |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-merge Checklist
- [x] Full pytest suite passed.
- [x] Ruff passed.
- [x] High-offset repro fails fast.
- [x] Packet strict validation passed.

### Data Reversal
- **Has data migrations?** No.
- **Runtime state impact**: None; budget defaults are process env/config only.
<!-- /ANCHOR:enhanced-rollback -->
