---
title: "Feature Specification: Novel Context-Budget-Fitting Assembler [template:level_2/spec.md]"
description: "The prod search path returns the post-floor result set with no density discipline so near-duplicate packets and redundant chunks consume the context budget without adding distinct information. This phase adds a budget-fitting assembler that runs AFTER the floor on the returned set, dedups near-duplicates and prefers diverse packets, improving context density and diversity with no re-index and no recall change."
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
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/022-novel-context-budget-assembler"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase spec from research.md novel context-budget-assembler row"
    next_safe_action: "Run generators then author plan.md and tasks.md"
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
# Feature Specification: Novel Context-Budget-Fitting Assembler

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
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
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `022-novel-context-budget-assembler` |
| **Verdict** | novel-GO (GO-on-cost, floor-bypassing, default-off, improves density not recall) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The prod search path returns the post-floor result set with no density discipline. After `truncateByConfidence` runs at `hybrid-search.ts:2051`, the `reranked` set is passed straight through to the trace-metadata mapping at `hybrid-search.ts:2078` and returned, so near-duplicate packets and redundant chunks survive into the caller context unchecked. The pipeline already collapses adjacent same-document chunks via `collapseAndReassembleChunkResults` at `hybrid-search.ts:1757`, but that is structural reassembly within one document and does nothing for cross-document near-duplicates or for diversity. The result is wasted context budget: two packets that say nearly the same thing both occupy slots a more diverse packet could have used, which lowers the distinct-information-per-token a caller receives without changing what was recalled.

### Purpose
Add a budget-fitting assembler that runs AFTER the floor on the returned set, dedups near-duplicate results and prefers diverse packets within a context budget, improving context density and diversity with no re-index and no recall change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A post-floor `assembleByBudget` step in `hybrid-search.ts` that runs on the `reranked` set after the `truncateByConfidence` block at `hybrid-search.ts:2073` and before the trace-metadata mapping at `hybrid-search.ts:2078`, behind `SPECKIT_CONTEXT_BUDGET_ASSEMBLER` default-off.
- A pure `context-budget-assembler.ts` module that takes the post-floor results plus a token budget and returns a re-ordered and possibly thinned set, computing a near-duplicate signal from the already-present per-result vectors or normalized text and a diversity preference over packet identity.
- A near-duplicate collapse that drops or down-ranks a result whose similarity to an already-selected result exceeds a configured threshold, distinct from the intra-document chunk reassembly in `mpab-aggregation.ts` because it operates across documents on the final set.
- A diversity preference that, at equal or near-equal relevance, prefers a result from a packet not yet represented in the assembled set so the budget spans more distinct packets.
- A floor-preservation guard: the assembler never drops a result below the `DEFAULT_MIN_RESULTS` floor count from `confidence-truncation.ts:35`, so it can re-order and dedup but never under-cut the guaranteed minimum.
- Two density metrics emitted into the existing stage trace: token-per-relevant-row and a duplicate rate, measurable on this corpus with no re-index.

### Out of Scope
- Any recall change. The assembler runs after the floor on the already-returned set, so it cannot recover a floor-cut candidate and makes no claim on completeRecall. It is explicitly not a retrieval-class change and is not C2-gated.
- Re-embedding or any re-index work. The near-duplicate signal reuses vectors or text already on the result rows, so there is no embedding coverage dependency.
- Changing the truncation floor at `confidence-truncation.ts`. The floor stays and runs first. The assembler only shapes what survives it.
- Intra-document chunk reassembly. That already ships at `mpab-aggregation.ts` via `collapseAndReassembleChunkResults` and is not re-implemented here.
- Auto-rewriting or mutating any authored body. The assembler reorders and thins a transient result set in memory and never touches a git-tracked document.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/context-budget-assembler.ts` | Create | New pure module that dedups near-duplicates, prefers diverse packets within a token budget, preserves the floor minimum, and reports density metrics |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modify | Insert the `assembleByBudget` call on the post-floor `reranked` set behind the default-off flag, after `hybrid-search.ts:2073` and before `hybrid-search.ts:2078`, and wire the density metrics into the stage trace |
| `.opencode/skills/system-spec-kit/mcp_server/tests/context-budget-assembler.vitest.ts` | Create | Dedup, diversity, floor-preservation, flag-off no-op, and density-metric tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | While `SPECKIT_CONTEXT_BUDGET_ASSEMBLER` is unset or false, the search path MUST return the post-floor set byte-for-byte as it does today. | A test asserts the assembler is never entered with the flag off and the returned set is identical to the pre-change pipeline output. |
| REQ-002 | The assembler MUST run after the floor on the returned set and MUST NOT change recall. | A test asserts the assembler only ever receives the post-`truncateByConfidence` set and never re-adds a candidate that the floor cut. |
| REQ-003 | The assembler MUST drop or down-rank a result whose near-duplicate similarity to an already-selected result exceeds the configured threshold. | A test feeds two near-identical results and asserts only one survives the assembled set while a distinct third result is kept. |
| REQ-004 | The assembler MUST preserve the `DEFAULT_MIN_RESULTS` floor count and never return fewer results than the floor guarantees. | A test feeds a set at the floor size where every result is a near-duplicate and asserts the floor count still survives unmodified. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | At equal or near-equal relevance, the assembler MUST prefer a result from a packet not yet represented in the assembled set. | A test feeds two equally relevant results from different packets and one redundant result from an already-represented packet and asserts the unrepresented packet is preferred. |
| REQ-006 | The assembler MUST emit token-per-relevant-row and a duplicate rate into the stage trace so the density gain is measurable on this corpus with no re-index. | A test asserts both metrics are present in the trace and that the duplicate rate falls when the flag is on against a set with known near-duplicates. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the flag off, the post-floor set and search timing are unchanged and the assembler is dormant.
- **SC-002**: With the flag on against a controlled set carrying known near-duplicates, the duplicate rate falls and token-per-relevant-row improves, the floor minimum count is preserved, and no floor-cut candidate is ever re-added.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `truncateByConfidence` at `hybrid-search.ts:2051` and `DEFAULT_MIN_RESULTS` at `confidence-truncation.ts:35` | The assembler depends on running after the floor and respecting its minimum. | Insert strictly after the truncation block and read `DEFAULT_MIN_RESULTS` as the floor-preservation guard. |
| Dependency | Per-result vectors or normalized text on the post-floor rows | The near-duplicate signal needs an existing similarity input or it falls back to a weaker text overlap. | Reuse the vectors or text already present on the result rows. Fall back to normalized text overlap when a vector is absent, no re-embed. |
| Risk | A diversity preference that hurts a tight single-packet query by dropping a genuinely relevant near-duplicate | Medium | Cap dedup at the configured threshold, preserve the floor count, and prove the duplicate rate falls only on sets with real duplicates while a single-packet set is left intact. |
| Risk | Mistaking intra-document chunk overlap for cross-document duplication | Medium | Run after the shipped `collapseAndReassembleChunkResults` reassembly so intra-document chunks are already collapsed before the cross-document dedup sees them. |
| Risk | Added per-query cost on a hot search path | Low | Gate the whole step behind the default-off flag and bound the pairwise comparison to the small post-floor set so prod pays nothing until enabled. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: With the flag off, zero added cost on the search path.
- **NFR-P02**: With the flag on, the assembler operates only on the small post-floor set so its pairwise comparison stays bounded and does not change the search latency tier.

### Security
- **NFR-S01**: The assembler operates on an in-memory result set inside the existing MCP process and adds no new external surface and no new persistence.

### Reliability
- **NFR-R01**: An assembler failure MUST degrade to returning the un-assembled post-floor set and never break the search response, matching the conservative non-critical handling already used around the truncation block at `hybrid-search.ts:2069`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty result set: the assembler returns the empty set unchanged and emits a zero duplicate rate.
- Set at exactly the floor size: the floor-preservation guard keeps every result even if all are near-duplicates.
- Single packet across the whole set: no diversity preference applies and only over-threshold near-duplicates are thinned, never below the floor.

### Error Scenarios
- Missing per-result vector: fall back to normalized text overlap for the similarity signal with no re-embed.
- Token budget smaller than the floor minimum: the floor wins, the budget never drops a result below the guaranteed minimum.

### State Transitions
- Flag flipped on mid-session: the next query assembles, prior responses are unaffected since the set is transient per query.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One new pure module, one seam edit, one test file, no schema or re-index |
| Risk | 10/25 | No breaking change, default-off, runs after the floor on a transient set, no body mutation, no recall change |
| Research | 7/20 | Post-floor seam and floor minimum grounded to file:line, density metrics fixed by research |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What near-duplicate similarity threshold balances dedup against dropping a genuinely distinct close result, and whether it is fixed or query-tier-aware.
- Whether the token budget is read from a caller-supplied limit or a fixed default when the caller passes none.
- Whether the diversity preference keys on packet identity alone or also on source surface so two packets of different kinds are both kept.
<!-- /ANCHOR:questions -->
