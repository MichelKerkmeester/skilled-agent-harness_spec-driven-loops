---
title: "Implementation Plan: advisor packed BM25F lexical shadow helper"
description: "Add a default-off packed BM25F lexical shadow helper for advisor skill fields while preserving the existing live lexical lane byte-for-byte."
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
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/003-advisor-packed-bm25-lexical"
    last_updated_at: "2026-06-10T21:14:49Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed BM25F shadow implementation"
    next_safe_action: "Future promotion requires separate decision"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/bm25.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/bm25-lexical-shadow.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-advisor-packed-bm25-lexical"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: advisor-packed-bm25-lexical

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
| **Language/Stack** | TypeScript (Node) |
| **Framework** | mk_skill_advisor MCP daemon |
| **Storage** | skill-graph.sqlite |
| **Testing** | vitest |

### Overview
The implementation adds a packed BM25F index for advisor skill projections and exposes it only through a default-off shadow wrapper. The current token-overlap lexical lane remains the live scorer path, so existing recommendation scores and order remain unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing: focused BM25, scorer, advisor-validate, typecheck, build
- [x] Docs updated: spec, plan, tasks, implementation summary
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive in-memory shadow scorer helper.

### Key Components
- **Packed BM25F helper**: Builds a term dictionary with typed-array postings over advisor skill fields.
- **Lexical shadow wrapper**: Emits BM25 shadow matches only when `SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW` is enabled.
- **Registry metadata**: Records BM25 as a shadow-only option without adding it to live fusion lanes.

### Data Flow
Projection skills are converted into weighted fields, indexed into packed postings during helper construction, and searched by query terms. Live `scoreAdvisorPrompt` still calls `scoreLexicalLane`, so BM25 output never contributes to live fusion.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lanes/lexical.ts` | Live lexical scorer | Preserve live function; add default-off shadow wrapper | `bm25-lexical-shadow.vitest.ts` live JSON parity |
| `lanes/bm25.ts` | New shadow scorer helper | Create packed BM25F implementation | BM25F and footprint tests |
| `lane-registry.ts` | Lane metadata | Add shadow metadata outside live `SCORER_LANES` | Typecheck and scorer tests |

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
- [x] Existing scorer contracts inspected
- [x] No dependency or package changes required
- [x] Allowed-write scope confirmed

### Phase 2: Core Implementation
- [x] Added `AdvisorPackedBm25Index` with typed-array postings
- [x] Added query-time BM25F field weights over advisor fields
- [x] Added default-off shadow wrapper and registry metadata without live fusion changes

### Phase 3: Verification
- [x] Focused BM25 shadow tests pass
- [x] Scorer and advisor-validate suites pass
- [x] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | BM25F weights, packed footprint, shadow flag behavior | Vitest |
| Integration | Scorer lane registry, scorer corpus, advisor_validate handler shapes | Vitest |
| Manual | Review of out-of-scope handler/fusion constraints | Direct file inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing scorer fusion | Internal | Green | BM25 stays outside live fusion because `fusion.ts` is out of scope |
| `advisor_validate` promotion gate | Internal | Yellow | Future phase must wire BM25 comparison into handler before promotion |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any future attempt to make BM25 live without passing advisor_validate baselines.
- **Procedure**: Keep `SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW` unset; the live scorer ignores BM25 helper output by design.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
