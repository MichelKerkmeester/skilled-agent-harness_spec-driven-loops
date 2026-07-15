---
title: "Checklist: 023E Request Budget Hardening"
description: "Verification checklist and evidence for mcp-coco-index request-budget hardening."
trigger_phrases:
  - "023E request budget checklist"
  - "SearchBudget verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/001-request-budget-hardening"
    last_updated_at: "2026-05-19T20:10:29Z"
    last_updated_by: "codex"
    recent_action: "Verified checklist evidence"
    next_safe_action: "Main agent may review the diff and commit."
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/001-request-budget-hardening/checklist.md"
    session_dedup:
      fingerprint: "sha256:023e023e023e023e023e023e023e023e023e023e023e023e023e023e023e023e"
      session_id: "023-deep-research-arc-blind-spots/001-request-budget-hardening-codex"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Checklist: 023E Request Budget Hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` lists REQ-001 through REQ-010 and closes findings 005-A, 015-A, 015-C, and 020-C.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` names the central validator, entrypoint wiring, and verification strategy.
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: Local `.venv` provided pytest, ruff, and `ccc` for repro verification.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint checks
  - **Evidence**: `.venv/bin/ruff check cocoindex_code/ tests/` passed clean.
- [x] CHK-011 [P0] Validator runs before expensive work
  - **Evidence**: `test_budget_validator_runs_before_db_hit` asserts invalid offset raises before embedder calls.
- [x] CHK-012 [P1] Error handling implemented
  - **Evidence**: `SearchBudgetExceeded` carries `budget_field`, `actual`, `limit`, and `suggestion`; MCP and CLI convert it into existing failure surfaces.
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: Env parsing uses local config conventions and query tests use existing fake env/db patterns.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met
  - **Evidence**: `tests/test_search_budget.py` covers offset, limit, fetch_k, language fanout, path refusal, forced path opt-in, and pre-DB validation.
- [x] CHK-021 [P0] Full test suite passes
  - **Evidence**: `.venv/bin/python -m pytest tests/ -q` returned `188 passed in 17.48s`.
- [x] CHK-022 [P1] Edge cases tested
  - **Evidence**: Tests cover `offset=20001`, `limit=201`, 9 languages, and `path="*"`.
- [x] CHK-023 [P1] Original repro validated
  - **Evidence**: `time .venv/bin/ccc search "registered_embedders" --path '*' --limit 100 --offset 20000` exited 1 in 0.746s with `SearchBudgetExceeded(field=offset, actual=20000, limit=1000, ...)`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class
  - **Evidence**: Findings 005-A, 015-A, 015-C, and 020-C are class-of-bug request-budget issues closed by central validation.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed
  - **Evidence**: `query.py` fetch_k, path fullscan, and language fanout producers were read and patched.
- [x] CHK-FIX-003 [P0] Consumer inventory completed
  - **Evidence**: CLI, MCP, and direct query surfaces all route through `validate_search_budget`.
- [x] CHK-FIX-004 [P0] Adversarial tests included for path/parser boundaries
  - **Evidence**: Tests cover `path="*"`, forced fullscan opt-in, invalid offset, invalid limit, and pre-DB ordering.
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion
  - **Evidence**: Axes are offset, limit, fetch_k, languages, paths, env override, and entry surface.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed
  - **Evidence**: `test_path_fullscan_allowed_when_forced` exercises env-controlled opt-in.
- [x] CHK-FIX-007 [P1] Evidence pinned to explicit commands
  - **Evidence**: Verification commands and outputs are recorded in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials added
  - **Evidence**: Changes add only env var names and no sensitive values.
- [x] CHK-031 [P0] Input validation implemented
  - **Evidence**: `validate_search_budget` rejects negative and over-budget numeric inputs plus global wildcard paths.
- [x] CHK-032 [P1] Abuse path reduced
  - **Evidence**: Demonstrated high-offset path-filter query now fails before daemon retrieval work.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: All docs name the same files, env vars, tests, and repro result.
- [x] CHK-041 [P1] Implementation summary includes handoff details
  - **Evidence**: `implementation-summary.md` includes files changed, env vars/defaults, repro outcome, findings closed, verification, and Commit Handoff section.
- [x] CHK-042 [P2] Packet metadata created
  - **Evidence**: `description.json` and `graph-metadata.json` added.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files avoided
  - **Evidence**: No scratch or temp files were created for the implementation.
- [x] CHK-051 [P1] Scope boundaries respected
  - **Evidence**: Modified files are limited to the listed source surfaces, new budget test, and this packet folder.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-19
**Verified By**: Codex
<!-- /ANCHOR:summary -->
