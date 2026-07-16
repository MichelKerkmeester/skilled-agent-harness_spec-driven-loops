---
title: "Implementation Plan: Phase 1: token-budget-truncation-safety"
description: "[2-3 sentences: what this implements and the technical approach]"
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/001-token-budget-truncation-safety"
    last_updated_at: "2026-06-17T08:15:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Shipped Problem 3 token-budget truncation safety; plan superseded by impl-summary"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: token-budget-truncation-safety

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (MCP server) |
| **Framework** | None (Node library code) |
| **Storage** | None |
| **Testing** | Vitest |

### Overview
Surgical edits to two `lib/search/` modules plus a focused new test: skip-and-continue packing, a `min(limit, 3)` floor with summary-first overflow, and a `lowSignal` weak-query budget floor. Reuses existing progressive-disclosure and confidence-truncation primitives. See `implementation-summary.md` for the delivered detail.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Library functions in the search pipeline (no new architecture).

### Key Components
- **`truncateToBudget` (hybrid-search.ts)**: Greedy-but-forgiving packing, floor, summary-first overflow.
- **`getDynamicTokenBudget` (dynamic-token-budget.ts)**: `lowSignal` budget floor for weak queries.

### Data Flow
Search candidates are scored and sorted, then packed by `truncateToBudget` against the budget from `getDynamicTokenBudget`; overflow beyond the floor is routed through `buildProgressiveResponse` and returned on the additive `progressive` field.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `truncateToBudget` (hybrid-search.ts) | Owns packing of scored candidates into the budget | update | New `token-budget-skip-and-floor.vitest.ts` |
| `getDynamicTokenBudget` (dynamic-token-budget.ts) | Resolves the budget | update (additive `lowSignal`) | Existing dynamic-token-budget vitest green |
| `progressive-disclosure.ts` / `confidence-truncation.ts` | Provide reused primitives | unchanged (read-only reuse) | Imported, their vitests still green |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Existing search test suites identified as the verification baseline

### Phase 2: Core Implementation
- [x] Skip-and-continue packing in `truncateToBudget`
- [x] `min(limit, 3)` floor + summary-first overflow routing
- [x] `lowSignal` weak-query budget floor

### Phase 3: Verification
- [x] New `token-budget-skip-and-floor.vitest.ts` passing
- [x] Edge cases handled (no-limit ≥1 fallback, small-limit cap)
- [x] `implementation-summary.md` written
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `truncateToBudget` packing/floor; `getDynamicTokenBudget` low-signal floor | Vitest |
| Regression | Existing search suites (confidence-truncation, token-budget, hybrid-search, progressive-disclosure) | Vitest |
| Manual | None | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `progressive-disclosure.ts` / `confidence-truncation.ts` | Internal | Green | Overflow routing + floor constant unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New search-test failures vs the captured baseline, or a regression in result counts.
- **Procedure**: Revert the two `lib/search/` edits; the change is unconditional (no feature flag) but additive to packing only.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

