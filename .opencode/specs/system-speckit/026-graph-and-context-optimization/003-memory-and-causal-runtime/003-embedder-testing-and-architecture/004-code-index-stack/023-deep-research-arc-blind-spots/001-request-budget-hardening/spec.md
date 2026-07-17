---
title: "Spec: 023E Request Budget Hardening"
description: "Harden mcp-coco-index search requests with central budget validation for offset, limit, fetch_k, language fanout, path fullscan patterns, and soft search deadline behavior."
trigger_phrases:
  - "023E request budget hardening"
  - "mcp-coco-index search budget"
  - "SearchBudgetExceeded"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/001-request-budget-hardening"
    last_updated_at: "2026-05-19T20:10:29Z"
    last_updated_by: "codex"
    recent_action: "Implemented request-budget hardening"
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
    answered_questions:
      - "Gate 3 spec folder was pre-bound by the operator as phase folder E."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Spec: 023E Request Budget Hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-19 |
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/001-request-budget-hardening/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
mcp-coco-index search cost scaled unexpectedly with `offset`, `limit`, path filters, and multi-language requests. A demonstrated high-offset path-filtered query, `ccc search "registered_embedders" --path '*' --limit 100 --offset 20000`, took 21.59s after deduping 56,512 aliases. The root cause was unbounded request math: `fetch_k = (limit + offset) * 4`, full-scan path handling, and per-language KNN fanout.

### Purpose
Add central request-budget validation before expensive retrieval work begins so pathological requests fail fast or clamp bounded fanout. The hardening closes FINDING-005-A, FINDING-015-A, FINDING-015-C, and FINDING-020-C without touching observability counters or unrelated retrieval components.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Central `SearchBudget` validation for search request cost.
- Env-configurable caps for offset, limit, fetch_k, language fanout, path fullscan patterns, and soft timeout.
- MCP search validation at handler entry.
- CLI `ccc search` validation after argparse and before daemon dispatch.
- Direct `query_codebase` validation before index existence, context lookup, embedding, or DB lookup.
- Regression tests for caps, fetch_k clamp, language fanout clamp, path fullscan refusal, forced fullscan opt-in, and pre-DB validation ordering.
- Level 2 packet documentation and strict validation.

### Out of Scope
- Observability counters and telemetry schema changes owned by 023C.
- Embedder, reranker, chunker, indexer, and daemon refactors.
- Upstream rebase work owned by 023F.
- Git commit creation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/search_budget.py` | Create | Central budget dataclasses, validator, and `SearchBudgetExceeded`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Modify | Add env-backed budget knobs and defaults. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modify | Validate before work, use clamped fetch_k, clamp language fanout, and skip rerank after soft timeout. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | Modify | Validate MCP search requests before daemon dispatch. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | Modify | Validate CLI search requests before daemon startup/search dispatch. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_search_budget.py` | Create | Regression tests for request-budget behavior. |
| `.opencode/specs/.../023-deep-research-arc-blind-spots/001-request-budget-hardening/*` | Create | Level 2 packet docs and metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Bound search offsets centrally. | `offset > COCOINDEX_SEARCH_MAX_OFFSET` raises `SearchBudgetExceeded(budget_field="offset")`. |
| REQ-002 | Bound search limits centrally. | `limit > COCOINDEX_SEARCH_MAX_LIMIT` raises `SearchBudgetExceeded(budget_field="limit")`. |
| REQ-003 | Bound fetch_k cost. | Query execution uses `min((limit + offset) * 4, COCOINDEX_SEARCH_MAX_FETCH_K)`. |
| REQ-004 | Refuse global wildcard path full scans by default. | `path="*"` raises unless `COCOINDEX_SEARCH_PATH_FULLSCAN_ALLOWED=true`. |
| REQ-005 | Validate before expensive work. | Invalid budget raises before embedding, DB context lookup, or daemon search dispatch. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Cap multi-language fanout. | More than `COCOINDEX_SEARCH_MAX_LANGUAGES` languages are clamped and warn. |
| REQ-007 | Keep CLI and MCP validation aligned. | Both surfaces call the same validator and expose the same failure class/message. |
| REQ-008 | Add env-backed budget knobs. | Six new env vars exist with documented defaults. |
| REQ-009 | Add regression coverage. | New tests cover all requested budget cases. |
| REQ-010 | Preserve existing response shape. | MCP failures still return `success=false` with a message; CLI prints the existing `Search failed:` form. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 21.59s repro fails fast with `SearchBudgetExceeded`.
- **SC-002**: Full mcp-coco-index pytest suite passes with at least 172 tests.
- **SC-003**: Ruff passes for `cocoindex_code/` and `tests/`.
- **SC-004**: Strict spec validation passes for this packet.
- **SC-005**: Findings 005-A, 015-A, 015-C, and 020-C are closed by scoped implementation evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing broad path wildcard workflows may fail. | Operators using `--path '*'` now get a refusal. | Provide `COCOINDEX_SEARCH_PATH_FULLSCAN_ALLOWED=true` escape hatch. |
| Risk | Default offset cap may surprise deep pagination users. | Queries beyond offset 1000 fail. | Error message suggests narrowing filters or deliberate env override. |
| Risk | Soft timeout cannot interrupt every SQLite extension operation. | Very long DB calls may still run until SQLite returns. | Validator prevents the demonstrated high-cost request before DB work; timeout skips rerank once control returns. |
| Dependency | Existing daemon response envelope. | Structured fields cannot be added without protocol changes. | Preserve `success=false`/message shape and expose structured fields on the exception class. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Invalid high-offset requests fail before embedding or DB lookup.
- **NFR-P02**: Fetch candidate count never exceeds `COCOINDEX_SEARCH_MAX_FETCH_K`.
- **NFR-P03**: Multi-language KNN fanout defaults to at most 8 languages.

### Reliability
- **NFR-R01**: CLI and MCP validation use the same central logic.
- **NFR-R02**: Env parsing falls back safely for malformed budget knobs.

### Operability
- **NFR-O01**: Error messages name the exceeded field, actual value, configured limit, and next action.
- **NFR-O02**: Fullscan wildcard escape hatch is explicit and env-controlled.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Offset 20001**: Refused as `budget_field="offset"`.
- **Limit 201**: Refused as `budget_field="limit"`.
- **Limit 200 and offset 1000**: Accepted, but `fetch_k` clamps to 4000.
- **Nine languages**: Clamped to the first eight with a warning.
- **Path `*`**: Refused by default; allowed only when fullscan override is true.

### Error Scenarios
- **Malformed env int/float/bool**: Budget parser logs a warning and falls back to defaults.
- **Negative limit/offset**: Validator raises `SearchBudgetExceeded`.
- **MCP budget failure**: Returns `success=false`, `reqId`, and message.
- **CLI budget failure**: Prints `Search failed: SearchBudgetExceeded(...)` and exits 1.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should future work add structured MCP error fields to `SearchResultModel`? **Resolved for 023E: out of scope to preserve the current response shape.**
- Should all path filters require explicit fullscan opt-in? **Resolved for 023E: only global wildcard patterns are refused by default.**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Scope | Medium | Touches five production surfaces and one new test file. |
| Risk | Medium | Search request validation changes CLI and MCP behavior for pathological inputs. |
| Verification | Medium | Requires unit, integration, full suite, repro, ruff, and strict packet validation. |
| Documentation | Low | Level 2 packet docs cover the changed behavior and handoff. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:related-docs -->
