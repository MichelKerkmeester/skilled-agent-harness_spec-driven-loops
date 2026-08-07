---
title: "Implementation Plan: Phase 4: confidence-calibration-labeled-set"
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
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/004-confidence-calibration-labeled-set"
    last_updated_at: "2026-06-17T09:05:00Z"
    last_updated_by: "implementer"
    recent_action: "Shipped (A) 0.45/0.55 rebalance + (B) flag-gated calibration infra; plan superseded"
    next_safe_action: "Collect labeled live traffic, refit, validate before enabling calibration flag"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/confidence-calibration.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-027-002-017-004-confidence-calibration-labeled-set"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: confidence-calibration-labeled-set

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
| **Language/Stack** | TypeScript (MCP server); proxy seed generator in `.mjs` |
| **Framework** | None (Node library code) |
| **Storage** | JSON labeled-set + model files (under `assets/`) |
| **Testing** | Vitest |

### Overview
Two separated deliverables: (A) a default-ON weight rebalance (0.45/0.55 named constants) so relevance dominates per-result confidence, and (B) flag-gated default-OFF isotonic (PAV) calibration infrastructure plus a corpus-derived proxy seed - machinery only, unvalidated until a real labeled set lands. See `implementation-summary.md` for the delivered detail.
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
Library functions in the search pipeline + a standalone proxy seed generator (no new architecture).

### Key Components
- **`confidence-scoring.ts`**: (A) 0.45/0.55 rebalance; (B) lazy model load + `maybeCalibrate()` hook.
- **`confidence-calibration.ts`**: (B) isotonic `fitCalibration`/`applyCalibration`, labeled-set + model loaders.
- **`search-flags.ts`**: (B) `isConfidenceCalibrationEnabled()` (default-OFF) + model-path getter.

### Data Flow
Per-result `value` is the 0.45/0.55 blend, then mapped through the fitted model only when the flag is ON and a readable model is configured; otherwise the mapping is a no-op and production keeps the rebalance-only value.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `confidence-scoring.ts` `value` computation | Owns per-result confidence | update (A rebalance + B hook) | absolute-relevance + d5 vitests stay green |
| `confidence-calibration.ts` / `search-flags.ts` | New fit/apply + flag | create/update | `confidence-calibration.vitest.ts` |
| `assessRequestQuality` (S2) | Request-level verdict | unchanged (not a consumer) | Left intact; S2 tests still green |

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
- [x] Located the inline 0.6/0.4 blend in `confidence-scoring.ts` and confirmed S2 must stay intact

### Phase 2: Core Implementation
- [x] (A) Rebalance to `WEIGHT_HEURISTIC = 0.45` / `WEIGHT_SCORE_PRIOR = 0.55` named constants (default-ON)
- [x] (B) Isotonic `fitCalibration`/`applyCalibration` + labeled-set + model loaders (confidence-calibration.ts)
- [x] (B) `isConfidenceCalibrationEnabled()` (default-OFF) + lazy model load + `maybeCalibrate()` hook

### Phase 3: Verification
- [x] `confidence-calibration.vitest.ts`: fit/apply math, loader validation, default-OFF wiring guarantee
- [x] Existing absolute-relevance + d5 assertions stayed green under the new band (no expected-value edits)
- [x] `implementation-summary.md` written; proxy seed + demo model generated under `assets/`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Isotonic fit/apply math, loader validation, default-OFF wiring guarantee | Vitest |
| Regression | `absolute-relevance-calibration` + d5/result-confidence assertions | Vitest |
| Manual | None | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `resolveCalibrationScore` (cosine prior) | Internal | Green | Rebalance has no relevance signal to weight up |
| Real labeled traffic (for B) | External | Pending (follow-up) | Calibration stays default-OFF / unvalidated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: (A) confidence band regresses a qualitative contract; (B) the flag is accidentally enabled on the proxy model.
- **Procedure**: Revert the `value` rebalance in `confidence-scoring.ts`; (B) is inert while the flag is OFF, so disabling the flag fully neutralizes it.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

