---
title: "Implementation Plan: Novel Context-Budget-Fitting Assembler [template:level_2/plan.md]"
description: "Plans a pure post-floor assembler that dedups near-duplicate results and prefers diverse packets within a token budget, default-off, no re-index and no recall change."
trigger_phrases:
  - "context budget assembler"
  - "near duplicate dedup"
  - "diverse packet selection"
  - "context density"
  - "token per relevant row"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/004-novel-research/022-novel-context-budget-assembler"
    last_updated_at: "2026-07-04T17:12:06.511Z"
    last_updated_by: "markdown-agent"
    recent_action: "Drafted phase plan from spec seams"
    next_safe_action: "Write the tasks breakdown"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Novel Context-Budget-Fitting Assembler

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript pure module under the MCP search lib |
| **Framework** | Spec-kit hybrid search pipeline and the vitest suite |
| **Storage** | None new. The assembler reshapes a transient in-memory result set per query |
| **Testing** | vitest unit suite plus validate.sh strict and a flag-off no-op against the live search path |

### Overview
This phase adds a budget-fitting assembler that runs AFTER the confidence floor on the returned set. It dedups near-duplicate results and prefers diverse packets within a token budget so a caller spends its context on distinct information rather than repeated packets. It lands as one pure `context-budget-assembler.ts` module plus one seam edit in `hybrid-search.ts`, default-off behind `SPECKIT_CONTEXT_BUDGET_ASSEMBLER`, with no re-index and no recall change.
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
Post-floor in-memory reshaper behind a feature flag. It never recovers a floor-cut candidate and never mutates a git-tracked document.

### Key Components
- **context-budget-assembler.ts**: Pure module that takes the post-floor result set plus a token budget and returns a re-ordered and possibly thinned set. It computes a near-duplicate signal from the per-result vectors or normalized text already on the rows and prefers a packet not yet represented. It never drops below the `DEFAULT_MIN_RESULTS` floor from `confidence-truncation.ts:35`.
- **hybrid-search.ts**: Hosts the `assembleByBudget` call on the `reranked` set after the `truncateByConfidence` block at `hybrid-search.ts:2073` and before the trace-metadata mapping at `hybrid-search.ts:2078`. It wires the two density metrics into the existing stage trace and degrades to the un-assembled set on any assembler failure, matching the conservative handling at `hybrid-search.ts:2069`.
- **context-budget-assembler.vitest.ts**: Covers dedup, diversity, floor-preservation, the flag-off no-op and the density-metric emission.

### Data Flow
The search path runs retrieval, reranking and the confidence floor as it does today. With the flag set, the post-floor `reranked` set plus a token budget enters `assembleByBudget`. The assembler walks the set in relevance order, drops or down-ranks a result whose similarity to an already-selected result exceeds the threshold, prefers an unrepresented packet at near-equal relevance and stops shaping once the floor count is at risk. It emits token-per-relevant-row and a duplicate rate into the stage trace and returns the re-ordered set. With the flag unset the assembler never runs and the returned set is byte-for-byte the pre-change output.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| truncateByConfidence at hybrid-search.ts:2051 | Shipped confidence floor the assembler must run strictly after | not a consumer, ordering anchor only | `rg -n 'truncateByConfidence' lib/search/hybrid-search.ts` |
| DEFAULT_MIN_RESULTS at confidence-truncation.ts:35 | Floor minimum the assembler must never under-cut | read-only, floor-preservation guard | `rg -n 'DEFAULT_MIN_RESULTS' lib/search/confidence-truncation.ts` |
| reranked mapping at hybrid-search.ts:2078 | Trace-metadata mapping the assembler must precede | not a consumer, insertion boundary | `rg -n 'reranked' lib/search/hybrid-search.ts` |
| collapseAndReassembleChunkResults at mpab-aggregation.ts | Shipped intra-document chunk reassembly | unchanged, runs first so the cross-doc dedup sees collapsed chunks | `rg -n 'collapseAndReassembleChunkResults' lib/scoring/mpab-aggregation.ts` |
| SPECKIT_CONTEXT_BUDGET_ASSEMBLER flag | New default-off gate for the whole step | create, default-off | `rg -n 'SPECKIT_CONTEXT_BUDGET_ASSEMBLER' lib/search` |

Required inventories:
- Same-class producers: `rg -n 'assemble|dedup|diversity' lib/search lib/scoring`.
- Consumers of changed symbols: `rg -n 'SPECKIT_CONTEXT_BUDGET_ASSEMBLER|assembleByBudget|tokenPerRelevantRow' . --glob '*.ts' --glob '*.md'`.
- Matrix axes: flag state (unset, true), set state (empty, at floor, single packet, mixed packets with duplicates), similarity input (vector present, vector absent text fallback), budget state (above floor, below floor).
- Algorithm invariant: the assembler never re-adds a floor-cut candidate and never returns fewer than `DEFAULT_MIN_RESULTS`. With the flag unset the returned set is byte-for-byte equal to the pre-phase result.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the truncation block and floor read at `hybrid-search.ts:2051` and `confidence-truncation.ts:35` to lock the post-floor insertion point and the floor count
- [ ] Confirm the per-result rows carry a vector or normalized text so the near-duplicate signal has an input with no re-embed
- [ ] Decide the similarity threshold and the budget default, see the open questions in spec.md

### Phase 2: Core Implementation
- [ ] Create `context-budget-assembler.ts` as a pure function over the post-floor set and a token budget, returning a re-ordered and possibly thinned set (REQ-002)
- [ ] Implement the near-duplicate collapse that drops or down-ranks a result above the configured similarity threshold against an already-selected result (REQ-003)
- [ ] Implement the floor-preservation guard so the assembled set never falls below `DEFAULT_MIN_RESULTS` (REQ-004)
- [ ] Implement the diversity preference that favors an unrepresented packet at near-equal relevance (REQ-005)
- [ ] Emit token-per-relevant-row and a duplicate rate into the stage trace (REQ-006)
- [ ] Insert the `assembleByBudget` call behind `SPECKIT_CONTEXT_BUDGET_ASSEMBLER` after `hybrid-search.ts:2073` and before `hybrid-search.ts:2078`, with a degrade-to-un-assembled fallback (REQ-001)

### Phase 3: Verification
- [ ] Run the vitest suite for dedup, diversity, floor-preservation and the density metrics (REQ-003, REQ-004, REQ-005, REQ-006)
- [ ] Run the flag-off path and confirm the returned set is byte-for-byte equal to the pre-change output (REQ-001)
- [ ] Confirm the assembler only ever receives the post-floor set and never re-adds a floor-cut candidate (REQ-002)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | dedup, diversity, floor-preservation, empty-set, vector-absent text fallback | vitest |
| Integration | flag-on assemble then flag-off no-op across the search path and the stage-trace metrics | vitest, validate.sh --strict |
| Manual | byte-for-byte equality of the flag-off returned set and the duplicate-rate drop on a planted-duplicate set | node, diff of returned sets |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| confidence-truncation.ts floor | Internal | Green | The assembler has no floor count to preserve and no post-floor insertion point |
| Per-result vectors or normalized text | Internal | Green | The near-duplicate signal falls back to a weaker text overlap with no re-embed |
| 015-prodmode-recall-gate | Internal | Green, not applicable | None. The item is floor-bypassing, improves density not recall and emits no vector rows |
| 026-shared-safe-fix-engine | Internal | Green, not applicable | None. The assembler reshapes a transient set and is never a registered fix class |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The diversity preference drops a genuinely relevant near-duplicate on a tight single-packet query, or the added per-query cost shows on the hot search path.
- **Procedure**: Unset `SPECKIT_CONTEXT_BUDGET_ASSEMBLER` to silence the step at once, then git revert the module and the seam edit. The change writes no data and touches no document so the revert is clean.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Medium | 5-8 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **7-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Unset `SPECKIT_CONTEXT_BUDGET_ASSEMBLER` to disable the assembler at once
2. Git revert the module and the seam edit
3. Run validate.sh strict on this folder to confirm the pre-phase result returns
4. Confirm the flag-off returned set matches the pre-change output

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The phase writes no data and reshapes only a transient per-query result set
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
