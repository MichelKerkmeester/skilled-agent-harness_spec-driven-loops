---
title: "Implementation Plan: Phase 3: generic-query-deep-routing"
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
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/003-generic-query-deep-routing"
    last_updated_at: "2026-06-17T08:48:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Shipped generic-query deep routing; plan superseded by impl-summary"
    next_safe_action: "Tune LOW_SIGNAL_STOPWORD_RATIO against real memory_search traffic"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-expander.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/recovery-payload.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/generic-query-deep-routing.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-027-002-017-003"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Optimal LOW_SIGNAL_STOPWORD_RATIO threshold under real traffic"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: generic-query-deep-routing

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
Escalate low-signal short queries to the `complex`/`low` tier so channel selection and both expansion guards turn on, append `expandQuery` synonym variants to the recovery suggestions, and enrich the domain synonym map - all without adding any LLM call. See `implementation-summary.md` for the delivered detail.
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
- **`query-classifier.ts`**: `isLowSignalShortQuery` + escalation to `complex`/`low`; lights up `lowSignalQuery`.
- **`query-expander.ts`**: enriched `DOMAIN_VOCABULARY_MAP`.
- **`recovery-payload.ts`**: `generateSuggestedQueries` appends `expandQuery` variants.

### Data Flow
The classifier escalates a low-signal short query before channel selection; channel selection + both expansion guards key off the tier, so all five channels and expansion turn on. The recovery path then appends synonym variants to `suggestedQueries`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `query-classifier.ts` | Owns tier + channel/expansion routing | update (escalation) | New `generic-query-deep-routing.vitest.ts` |
| `query-expander.ts` / `recovery-payload.ts` | Synonyms + recovery suggestions | update (map + append) | Recovery-suggestion test |
| `query-plan.ts` / `hyde.ts` | Telemetry-only / deep-mode LLM gate | unchanged (not a consumer / out of write set) | Left untouched; cost-control test |

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
- [x] Confirmed channel selection + both expansion guards key off the classifier tier

### Phase 2: Core Implementation
- [x] `isLowSignalShortQuery` + escalation to `complex`/`low` with `LOW_SIGNAL_STOPWORD_RATIO` (query-classifier.ts)
- [x] Append `expandQuery` synonym variants to `suggestedQueries`, capped at three (recovery-payload.ts)
- [x] Enrich `DOMAIN_VOCABULARY_MAP` with five memory-system terms (query-expander.ts)

### Phase 3: Verification
- [x] New `generic-query-deep-routing.vitest.ts` pins escalation + cost-control + recovery
- [x] Edge cases: confident short query stays on the fast path; no LLM call added
- [x] `implementation-summary.md` written
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Escalation, cost-control (no LLM call), recovery-suggestion append | Vitest |
| Regression | Existing classifier / expander / recovery suites | Vitest |
| Manual | None | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `expandQuery` shared expander | Internal | Green | Recovery suggestions cannot append synonym variants |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Escalation introduces an unexpected LLM cost, or over-escalates confident short queries.
- **Procedure**: Revert the classifier escalation in `query-classifier.ts`; the expander/recovery additions are independent and additive.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

