---
title: "Implementation Plan: Phase 5: cosine-topn-reorder"
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
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/005-cosine-topn-reorder"
    last_updated_at: "2026-06-17T09:15:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Shipped cosine-primary top-N head reorder; plan superseded by impl-summary"
    next_safe_action: "Measure precision@1 on a labeled set (research step b) to validate the lift"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/cosine-topn-reorder.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-017/005-cosine-topn-reorder"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the head reorder improve precision@1 in practice? Unmeasured — no labeled set yet."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: cosine-topn-reorder

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
A pure `reorderTopNByCosine` helper stably re-sorts the top-10 survivors by `resolveAbsoluteRelevance`, wired into `enrichFusedResults` right after `truncateToBudget` and gated by a default-ON, reversible flag. Unit-tested in isolation, then verified against the hybrid-search / ranking / pipeline suites. See `implementation-summary.md` for the delivered detail.
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
Library function in the search pipeline (no new architecture).

### Key Components
- **`reorderTopNByCosine` (hybrid-search.ts)**: Stable head reorder by `resolveAbsoluteRelevance`, depth `COSINE_TOPN_REORDER_DEPTH` (10).
- **`isCosineTopnReorderEnabled` (search-flags.ts)**: Default-ON `SPECKIT_COSINE_TOPN_REORDER` gate.

### Data Flow
`enrichFusedResults` runs `truncateToBudget` to fix membership by fused score, then (flag-on, non-eval mode) reorders the top-10 survivors by absolute cosine; the tail beyond 10 keeps RRF order.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `enrichFusedResults` (hybrid-search.ts) | Final ordering of budgeted survivors | update (gated head reorder after `truncateToBudget`) | `cosine-topn-reorder.vitest.ts` |
| `search-flags.ts` | Feature-flag policy | update (`isCosineTopnReorderEnabled`, default-ON) | `hybrid-search-flags` vitest green |
| `tests/hybrid-search.vitest.ts` | Degree-fusion regression assertion | update to cosine-correct order | Suite green incl. updated assertion |
| `resolveAbsoluteRelevance` / fusion math | Provide the cosine signal | unchanged (read-only) | Reorder reads it; fusion untouched |

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
- [x] Identified `enrichFusedResults` / `truncateToBudget` as the final-ordering insertion point

### Phase 2: Core Implementation
- [x] `reorderTopNByCosine` helper + `COSINE_TOPN_REORDER_DEPTH` (hybrid-search.ts)
- [x] Gated reorder applied after `truncateToBudget`; skipped in `evaluationMode`
- [x] `isCosineTopnReorderEnabled()` default-ON flag (search-flags.ts)

### Phase 3: Verification
- [x] `cosine-topn-reorder.vitest.ts` passing (9/9)
- [x] Edge cases: tie stability, head-only scope, lexical fallback, flag reversible
- [x] Degree-fusion regression assertion updated; `implementation-summary.md` written
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `reorderTopNByCosine` (promotion, tie stability, invariants, lexical fallback, flag) | Vitest |
| Regression | hybrid-search, token-budget, adaptive-ranking, pipeline-integration suites | Vitest |
| Manual | None | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `resolveAbsoluteRelevance` (packet-015 scale) | Internal | Green | No absolute cosine signal to reorder by |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Labeled-set measurement shows the reorder harms precision@1, or a head-ordering regression.
- **Procedure**: Set `SPECKIT_COSINE_TOPN_REORDER=false` (instant, no redeploy); the reorder is fully reversible.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

