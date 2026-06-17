---
title: "Feature Specification: Phase 1: token-budget-truncation-safety [template:level_1/spec.md]"
description: "[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "027/002/017/001-token-budget-truncation-safety"
    last_updated_at: "2026-06-17T08:15:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Shipped Problem 3 token-budget truncation safety; spec superseded by impl-summary"
    next_safe_action: "Orchestrator review + commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/token-budget-skip-and-floor.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-027-002-017-001-token-budget-truncation-safety"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: token-budget-truncation-safety

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-17 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | 002-request-quality-aggregation |
| **Handoff Criteria** | Skip-and-continue + min(limit,3) floor land; search test sweep green; no new failures vs baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the search-and-output-intelligence implementation: token-budget truncation safety (Problem 3 / S1).

**Scope Boundary**: `truncateToBudget` packing behaviour and the dynamic-token-budget weak-query floor in `lib/search/`. No change to the MCP response envelope.

**Dependencies**:
- Existing `progressive-disclosure.ts` and `confidence-truncation.ts` primitives (reused, not modified).

**Deliverables**:
- Skip-and-continue packing so one oversized top hit no longer collapses a populated page to a single result.
- A `min(limit, 3)` detailed-count floor that promotes token-cheap summaries, plus summary-first overflow routing regardless of `includeContent`.
- A `lowSignal` budget flag that floors weak/low-signal queries at `DEFAULT_BUDGET`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The token-budget truncator sorted candidates by score and hard-stopped on the first result that overflowed the budget, so one large top memory starved every smaller fitting result and collapsed a populated search to a single result (5→1). Weak queries, which depend on breadth, were also trimmed below the full budget.

### Purpose
A populated search returns a usable set: oversized hits are skipped not fatal, a minimum detailed count is guaranteed, overflow is surfaced not dropped, and weak queries keep the full budget.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Skip-and-continue packing in `truncateToBudget`.
- `min(limit, 3)` detailed-count floor + summary-first overflow routing.
- `lowSignal` weak-query budget floor in `getDynamicTokenBudget`.

### Out of Scope
- Wiring the `progressive` overflow envelope into the MCP response layer - deferred to a later phase; remainder is preserved, not yet paged.
- Cross-cutting changes to the search response shape - additive `progressive` field only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/hybrid-search.ts` | Modify | Skip-and-continue + floor + summary-first remainder; `limit`/`query` options; `progressive` field; low-signal budget at call site |
| `mcp_server/lib/search/dynamic-token-budget.ts` | Modify | `getDynamicTokenBudget` `lowSignal` floors weak-query budget at `DEFAULT_BUDGET` |
| `mcp_server/tests/token-budget-skip-and-floor.vitest.ts` | Create | Proves skip-and-continue, the ≥3 floor, and small-`limit` capping |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A too-large result must not collapse the page; the truncator skips it and keeps packing | Test: a smaller fitting result still returned when the top hit overflows |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A populated search surfaces at least `min(limit, 3)` results, promoting summaries if needed | Test: ≥3 floor promotes summaries incl. `includeContent=false`; small `limit` caps the floor |
| REQ-003 | Weak / low-signal queries keep the full `DEFAULT_BUDGET` | `getDynamicTokenBudget` floors the budget when `lowSignal` is set |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The headline 5→1 collapse no longer occurs when the top hit is oversized.
- **SC-002**: Search test sweep green with zero new failures vs the captured baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `progressive-disclosure.ts` / `confidence-truncation.ts` primitives | Reuse `buildProgressiveResponse` / `DEFAULT_MIN_RESULTS` | Read-only reuse, no modification |
| Risk | Floor can exceed the strict token budget by ~3 summary entries | Low - intended trade-off | Documented limitation; minimum usable set takes priority |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Shipped; see `implementation-summary.md` for the delivered behaviour, decisions, and verification.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
