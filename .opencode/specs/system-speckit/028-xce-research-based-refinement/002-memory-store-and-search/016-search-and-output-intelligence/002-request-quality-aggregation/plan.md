---
title: "Implementation Plan: Phase 2: request-quality-aggregation"
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
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/002-request-quality-aggregation"
    last_updated_at: "2026-06-17T08:30:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Shipped top-dominant + margin-aware request-quality verdict; plan superseded"
    next_safe_action: "Rebuild mcp_server dist so the runtime picks up the source change"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/request-quality-aggregation.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-017-002-request-quality-aggregation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: request-quality-aggregation

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
Rewrite the `assessRequestQuality` verdict as a disjunction that respects a dominant top hit and an absolute top-margin, and cap `qualityRatio` at the ranking head so recall expansion stops fighting the quality verdict. Ordering is untouched. See `implementation-summary.md` for the delivered detail.
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
- **`assessRequestQuality` (confidence-scoring.ts)**: Top-dominant + margin-aware "good" disjunction; head-capped quality ratio.
- **`computeMargin` / `resolveCalibrationScore`**: Reused to compute `topMargin` against the cosine-calibrated score.

### Data Flow
After results are scored and ordered, `assessRequestQuality` reads `topScore`, `topMargin` (result[0] vs result[1]), and `qualityRatio` over the head to emit the request-level verdict; ordering is unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `assessRequestQuality` (confidence-scoring.ts) | Owns the request-level quality verdict | update (disjunction + head-capped ratio) | New `request-quality-aggregation.vitest.ts` |
| `resolveEffectiveScore` / `resolveAbsoluteRelevance` (ordering) | Own result ordering | unchanged (not a consumer of the verdict) | Ordering tests still green; no edit |

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
- [x] Identified the existing `assessRequestQuality` gate and the `computeMargin` helper to reuse

### Phase 2: Core Implementation
- [x] Top-dominant `good` (`topScore >= 0.8`) branch
- [x] Margin-aware `good` (`topScore >= 0.7` AND (`qualityRatio >= 0.6` OR `topMargin >= 0.15`))
- [x] Cap `qualityRatio` at `min(N, QUALITY_RATIO_HEAD=5)`

### Phase 3: Verification
- [x] New `request-quality-aggregation.vitest.ts` covers good-via-margin, top-dominant, recall-no-depress
- [x] Edge cases: weak / gap verdicts preserved
- [x] `implementation-summary.md` written
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `assessRequestQuality` verdict (margin, top-dominant, head-cap, weak/gap) | Vitest |
| Regression | Existing confidence-scoring / absolute-relevance suites | Vitest |
| Manual | None | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `computeMargin` / `resolveCalibrationScore` | Internal | Green | Margin path cannot compute `topMargin` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Over-citing a weak set, or a regression in the existing confidence-scoring suites.
- **Procedure**: Revert the `assessRequestQuality` edit in `confidence-scoring.ts`; the change is confined to the verdict function.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

