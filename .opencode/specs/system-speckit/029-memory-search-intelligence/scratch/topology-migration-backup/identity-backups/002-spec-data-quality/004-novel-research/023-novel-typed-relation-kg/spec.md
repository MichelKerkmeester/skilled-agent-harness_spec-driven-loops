---
title: "Feature Specification: Novel typed-relation KG auto-extracted [template:level_2/spec.md]"
description: "The save-time LLM typed-relation backfill scaffold ships but is unwired and the deterministic extractor emits structural relation types the causal_edges CHECK constraint rejects, so the typed-relation knowledge graph has no LLM-derived semantic edges and no navigation or provenance surface over them."
trigger_phrases:
  - "typed relation kg"
  - "llm graph backfill"
  - "knowledge graph navigation"
  - "causal edges provenance"
  - "deterministic extractor"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/004-novel-research/023-novel-typed-relation-kg"
    last_updated_at: "2026-07-04T17:12:08.656Z"
    last_updated_by: "markdown-agent"
    recent_action: "Author phase spec from research synthesis section 3"
    next_safe_action: "Generate description.json and graph-metadata.json then plan"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/deterministic-extractor.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Novel typed-relation KG auto-extracted

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
| **Branch** | `023-novel-typed-relation-kg` |
| **Verdict tier** | novel-GO (GO-on-cost as a logic and navigation surface, NOT a ranking lane) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The save-time LLM typed-relation backfill is scaffolded but unwired. `graph-lifecycle.ts:599-605` calls `_scheduleLlmBackfill` behind `SPECKIT_LLM_GRAPH_BACKFILL` for high-value docs, but `registerLlmBackfillFn` (`graph-lifecycle.ts:635`) is never called outside its own module, so the registered callback stays null and the scheduler is a no-op. Separately the deterministic extractor emits four STRUCTURAL relation types (`heading_link`, `alias_link`, `relation_phrase`, `technology_link` at `deterministic-extractor.ts:27-31`) while the `causal_edges.relation` column is CHECK-constrained to six SEMANTIC types (`caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports` at `vector-index-schema.ts:1675-1677` and `:2343-2345`, canonical enum `RELATION_TYPES` at `causal-edges.ts:28-35`). Those structural edges fail the constraint and `createTypedEdges` swallows them via `INSERT OR IGNORE` (`deterministic-extractor.ts:202-206`). The result is a typed-relation knowledge graph with no LLM-derived semantic edges from document prose and no navigation or provenance surface a reader can use.

### Purpose
Wire an LLM typed-relation extractor atop the SHIPPED rule-based extractor so high-value docs gain semantic typed edges, and expose those edges as a navigation and provenance surface rather than a retrieval ranking lane.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new typed-relation extraction module that maps document prose to the six canonical `RELATION_TYPES` semantic relations, called only on high-value docs already gated by the existing `SPECKIT_LLM_GRAPH_BACKFILL` plus `qualityScore` threshold path.
- Registration of the extractor as the `registerLlmBackfillFn` callback at MCP bootstrap, closing the unwired seam at `graph-lifecycle.ts:635`.
- Persistence of LLM-derived edges to `causal_edges` with a distinct `created_by` provenance value (not `graph_lifecycle`, not `manual`) and an `evidence` marker that separates LLM-derived edges from `explicit_only` deterministic edges.
- A read-side navigation and provenance surface that exposes the typed edges of a result node (relation type, target, provenance, strength) without changing the retrieval ranking or the truncation floor.
- A bounded-safety wrapper reusing the existing strength and per-node caps so the LLM layer cannot densify the graph (mirror `MAX_AUTO_STRENGTH` and `MAX_EDGES_PER_NODE` from `relation-backfill.ts`).

### Out of Scope
- Any change to retrieval ranking, fusion, or the 3-result prod floor - this is explicitly a navigation surface not a ranking lane, and the typed-edge graph-boost effect is weak because the edges are sparse-not-absent.
- Auto-summarization rollup nodes or any new node type - already a research NO-GO.
- Loosening the `causal_edges.relation` CHECK constraint - the LLM extractor maps onto the existing six semantic types only.
- Wiring the four structural deterministic edge types into `causal_edges` - that constraint mismatch is recorded as an open question, not fixed here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/llm-relation-extractor.ts` | Create | LLM typed-relation extractor: prompt, bounded parse to `RELATION_TYPES`, strength and per-node caps |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Modify | Persist LLM-derived edges with distinct `created_by` and LLM `evidence` provenance marker |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Call `registerLlmBackfillFn` at bootstrap to wire the extractor into the existing scheduler |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts` | Modify | Add a read-only typed-edge navigation accessor over `causal_edges` for a result node |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Document the extractor under the existing `SPECKIT_LLM_GRAPH_BACKFILL` flag and default-off rollout |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | WHEN a high-value doc is indexed AND `SPECKIT_LLM_GRAPH_BACKFILL` is enabled, the system SHALL invoke the registered LLM relation extractor via the existing scheduler. | `registerLlmBackfillFn` is called once at bootstrap and `_scheduleLlmBackfill` fires the extractor for a doc whose `qualityScore` clears the threshold. Verified by unit test asserting the callback runs. |
| REQ-002 | The extractor SHALL emit only relations in the canonical `RELATION_TYPES` set and SHALL drop any out-of-vocabulary relation before write. | No `causal_edges` insert fails the relation CHECK constraint. A parse fixture with an invalid relation yields zero rows for that relation. |
| REQ-003 | LLM-derived edges SHALL be written with a distinct `created_by` provenance value and an LLM `evidence` marker so they are separable from deterministic `explicit_only` edges and `manual` edges. | A query partitioning `causal_edges` by `created_by` and `evidence` returns LLM edges under the new marker and never mislabels them as deterministic. |
| REQ-004 | The feature SHALL ship default-off and SHALL be a no-op when `SPECKIT_LLM_GRAPH_BACKFILL` is disabled, with zero edges written. | With the flag off, an indexed high-value doc produces zero LLM-derived rows. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | WHEN a search result is assembled, the system SHALL expose a read-only navigation view of that node's typed edges (relation, target, provenance, strength) WITHOUT altering result order. | The navigation accessor returns typed edges for a node and a before-and-after comparison shows identical result ranking and identical truncation-floor behavior. |
| REQ-006 | The extractor SHALL enforce a per-node edge cap and a max-strength cap so it cannot densify the graph beyond the existing deterministic bounds. | Edges per node never exceed the reused `MAX_EDGES_PER_NODE` and no LLM edge exceeds the reused `MAX_AUTO_STRENGTH`. Asserted by unit test. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The unwired `registerLlmBackfillFn` seam at `graph-lifecycle.ts:635` is closed and the scheduler fires the extractor for high-value docs under the flag.
- **SC-002**: LLM-derived typed edges land in `causal_edges` against the six canonical relations with a distinct, queryable provenance, and zero CHECK-constraint failures occur.
- **SC-003**: The typed-edge navigation surface is readable per result node and demonstrably does not move retrieval ranking - the non-retrieval metric this novel item proves is navigation reachability, not recall.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `015-prodmode-recall-gate` | This item is logic-and-navigation, not a retrieval lane, so it does NOT require the C2 prod-mode completeRecall@3 gate. The dependency is recorded only to assert it does not apply. | Keep the surface read-only and ranking-neutral so the C2 gate stays out of scope. If any future change feeds these edges into fusion, it becomes retrieval-class and inherits the C2 gate. |
| Dependency | Existing `SPECKIT_LLM_GRAPH_BACKFILL` flag and `_scheduleLlmBackfill` scheduler | The build reuses the shipped gating path rather than adding a second flag. | Wire through `registerLlmBackfillFn` only. Add no parallel scheduler. |
| Dependency | `RELATION_TYPES` enum at `causal-edges.ts:28-35` and the CHECK constraint | The extractor must map onto exactly these six relations or inserts fail. | Validate every parsed relation against the frozen enum before write and drop the rest. |
| Risk | LLM relation infidelity (a hallucinated edge) | Med - a wrong typed edge could mislead navigation. | Bounded strength and per-node caps, distinct provenance so a reviewer can audit and roll back LLM edges as a class, report-only navigation never auto-acts. |
| Risk | Graph densification from LLM edges | Low - sparse by construction but unbounded LLM output could spike density. | Reuse `MAX_EDGES_PER_NODE` and `MAX_AUTO_STRENGTH` caps from `relation-backfill.ts`. |
| Risk | Weak graph-boost expectation oversold as a ranking win | Med - scope creep toward a ranking lane. | Scope locks this to navigation and provenance. The research records the boost is weak because edges are sparse-not-absent. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Extraction runs async via the existing `setImmediate` fire-and-forget path (`graph-lifecycle.ts:649`) so it adds no latency to the synchronous save.
- **NFR-P02**: The navigation accessor is a single indexed `causal_edges` read per node and reuses the existing `(target_id, relation, source_id)` index at `vector-index-schema.ts:711`.

### Security
- **NFR-S01**: No new trust boundary. The extractor writes only to `causal_edges` inside the existing local DB trust boundary.
- **NFR-S02**: No authored-doc body mutation. The feature writes graph edges only and never touches source markdown.

### Reliability
- **NFR-R01**: A failed or empty LLM extraction is a no-op that logs a warning and writes zero edges, matching the existing `_scheduleLlmBackfill` catch behavior (`graph-lifecycle.ts:652-655`).
- **NFR-R02**: Default-off. Disabling `SPECKIT_LLM_GRAPH_BACKFILL` reverts to the shipped deterministic-only behavior with no migration.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty or whitespace doc is already short-circuited upstream (`graph-lifecycle.ts:532-534`) so the extractor never runs.
- Maximum length: long docs are bounded by the per-node edge cap, not by document size.
- Invalid format: a relation outside the six canonical types is dropped before the insert so no CHECK failure surfaces.

### Error Scenarios
- LLM service failure: the fire-and-forget callback catches, logs, and writes zero edges. The save already committed.
- Duplicate edge: `INSERT OR IGNORE` plus the existing `UNIQUE(source_id, target_id, relation, source_anchor, target_anchor)` constraint dedupes silently.
- Provenance collision: LLM edges use a distinct `created_by` so they never overwrite or masquerade as deterministic or manual edges.

### State Transitions
- Flag flip off then on: turning the flag off stops new LLM edges. Existing LLM edges remain queryable by their distinct provenance and can be deleted as a class.
- Re-index of the same doc: dedup constraint prevents duplicate typed edges across re-indexes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One new module plus four touched files, all inside the existing graph-lifecycle and causal-edges seams |
| Risk | 10/25 | No retrieval-ranking risk, no body mutation, default-off, reuses shipped caps and provenance discipline |
| Research | 6/20 | Seams already verified to file:line in research synthesis section 3 and the build-ready section 4 |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The deterministic extractor emits four STRUCTURAL relation types (`deterministic-extractor.ts:27-31`) that fail the six-type semantic CHECK constraint and are silently swallowed by `INSERT OR IGNORE`. Should those structural edges get their own table, a widened constraint, or remain intentionally dropped? This is recorded as a separate finding and is out of scope here.
- Which model and prompt budget should the extractor use for relation typing, and does it reuse the existing memory-save LLM client or a dedicated bounded call?
- Should the navigation surface render in the MCP search result payload by default when the flag is on, or stay behind a second read-time opt-in?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
