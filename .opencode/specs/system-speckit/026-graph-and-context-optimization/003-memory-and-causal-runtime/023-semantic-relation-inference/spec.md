---
title: "Feature Specification: Semantic Relation Inference (similarity + contradicts collectors)"
description: "Packet 021 shipped the bounded relation-inference backfill with two deterministic collectors (spec-document chains + lineage 'caused' links) and explicitly deferred the similarity 'supports' and 'contradicts' signals. This packet adds those two as OPT-IN collectors to backfillRelationInference: a similarity 'supports' collector that reads ONLY the pre-computed memory_index.related_memories column (no live vec scan, no O(n^2)) and a 'contradicts' collector driven by structural memory_lineage.superseded_by_memory_id. Both default false and inherit the existing dryRun-default, bounded, created_by='auto' safety posture."
trigger_phrases:
  - "semantic relation inference"
  - "similarity supports causal edges"
  - "contradicts supersession causal edges"
  - "related_memories backfill collector"
  - "opt-in relation backfill collectors"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/023-semantic-relation-inference"
    last_updated_at: "2026-06-04T13:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Two opt-in collectors added; tests + tsc green"
    next_safe_action: "Commit + deploy"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-coverage.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tools/types.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/relation-backfill-similarity.vitest.ts"
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Cached related_memories column is read instead of a live vector_search so the similarity collector is deterministic + unit-testable without sqlite-vec."
      - "Contradicts is driven by structural supersession, not embedding similarity, to avoid severe semantic false-positive risk."
---
# Feature Specification: Semantic Relation Inference

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Packet 021 built the bounded relation-inference backfill (`backfillRelationInference`) with two deterministic collectors and explicitly deferred the similarity `supports` and `contradicts` signals as best-effort extensions. This packet ships those two as OPT-IN collectors that reuse the same safety envelope: `dryRun` default true, bounded by `limit`, every edge `created_by='auto'` so it inherits `insertEdge`'s runtime guards.

**Key Decisions**: The similarity collector reads ONLY the pre-computed `memory_index.related_memories` column (no live `vector_search`/sqlite-vec scan, no O(n^2) all-pairs work) so it is deterministic and testable. The `contradicts` collector is driven by structural `memory_lineage.superseded_by_memory_id`, never embedding similarity, to avoid semantic false positives.

**Critical Dependencies**: `insertEdge` runtime guards (MAX_AUTO_STRENGTH, MAX_EDGES_PER_NODE, window cap); the existing transaction + `invalidateEntityDensityCache` flow in `backfillRelationInference`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Shipped |
| **Created** | 2026-06-04 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 021's backfill only promotes two structural signals (spec-document chains + lineage predecessor links) into typed edges. The `supports` and `contradicts` relations therefore stay under-covered: there is no path to grow `supports` from pre-computed semantic neighbours and no path to record structural supersession as a typed `contradicts` edge. Both signals already exist in the DB — `memory_index.related_memories` (cached cosine neighbours written by `link_related_on_save`) and `memory_lineage.superseded_by_memory_id` — but neither is promoted into the causal graph.

### Purpose
Add the two deferred collectors as OPT-IN extensions to the existing backfill so an operator can grow `supports` and `contradicts` coverage from existing deterministic data, without a live vector scan and without any semantic guesswork for contradictions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New similarity `supports` collector in `relation-backfill.ts`, gated by `options.similarity` (default false): reads `memory_index.related_memories`, keeps neighbours with `similarity >= threshold` (default 75, configurable 1-100 via `options.similarityThreshold`), takes top K<=5, excludes self + pairs already produced by the spec-chain collector, emits `supports` at strength ~0.35.
- New `contradicts` collector, gated by `options.contradicts` (default false): emits predecessor `contradicts` successor from `memory_lineage.superseded_by_memory_id` at strength ~0.3.
- Both run INSIDE the existing transaction and reuse the existing `insertEdgesBatch` + `createdBy='auto'` path; no new invalidation call (entity-density is already invalidated after commit).
- Wiring (4 additive/optional sites): tool-input schema, `tools/types.ts`, handler interface + pass-through, `BackfillRelationInferenceOptions`.
- Update the honest hint in `relation-coverage.ts` to advertise the opt-in collectors.
- New `tests/relation-backfill-similarity.vitest.ts`.

### Out of Scope
- Any live `vector_search`/sqlite-vec scan or O(n^2) all-pairs similarity computation.
- Deriving `contradicts` from embedding similarity (severe false-positive risk).
- Calling `detectContradictions` to find candidates — it is an insert-time guard, not a candidate source.
- Changing coverage targets, the existing two collectors, or the link-coverage metric.
- Making the collectors on-by-default or autonomous/scheduled.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/causal/relation-backfill.ts` | Modify | Add two opt-in collectors + options + gating |
| `mcp_server/lib/causal/relation-coverage.ts` | Modify | Update honest hint to advertise opt-in collectors |
| `mcp_server/handlers/causal-graph.ts` | Modify | Thread similarity/contradicts/similarityThreshold |
| `mcp_server/schemas/tool-input-schemas.ts` | Modify | Add similarity/contradicts/similarityThreshold to backfill object |
| `mcp_server/tools/types.ts` | Modify | Extend CausalStatsArgs.backfill |
| `mcp_server/tests/relation-backfill-similarity.vitest.ts` | Create | Prove opt-in/dry/bounded/idempotent/no-op contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both collectors are OPT-IN (default false) | Non-dry run with neither flag writes no similarity/contradicts edges |
| REQ-002 | `dryRun=true` writes ZERO even with both collectors on | Test asserts edge count unchanged + non-zero candidate `byRelation` |
| REQ-003 | Similarity collector reads ONLY cached `related_memories`; bounded by threshold>=75, K<=5, strength<=0.5, `created_by='auto'` | Test asserts threshold filtering, top-K clamp, auto + strength bound |
| REQ-004 | Contradicts collector emits predecessor->successor from supersession | Test asserts a single `contradicts` edge `20`->`21`, auto, strength<=0.5 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Idempotent re-run leaves edge count unchanged | Test runs both collectors twice; count stable |
| REQ-006 | Graceful no-op when `related_memories` is empty/absent/unparseable | Test asserts no throw + zero `supports` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `relation-backfill-similarity.vitest.ts` proves opt-in default-off, dry-run-zero-writes, bounded similarity writes (threshold/K/strength), contradicts-from-supersession, idempotency, and graceful no-op.
- **SC-002**: The keep-green suite (`relation-backfill-unit`, `relation-coverage-unit`, `causal-stats-output`, `causal-edges-unit`, `handler-causal-graph`, `mcp-input-validation`) stays green.
- **SC-003**: `tsc --noEmit` clean; `memory_causal_stats({ backfill: { dryRun:false, similarity:true, contradicts:true } })` callable end-to-end.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Auto-edge flood on the recovered ~9258-edge production DB | High | Both collectors OPT-IN; `dryRun` default true; bounded `limit`; all writes inherit `insertEdge` MAX_EDGES_PER_NODE + window cap; idempotent upsert |
| Risk | Semantic false-positive `contradicts` edges | High | `contradicts` is driven by structural supersession only, never embedding similarity |
| Risk | A live vec scan would be non-deterministic / untestable | Medium | The similarity collector reads only the pre-computed `related_memories` column |
| Dependency | `insertEdge`/`insertEdgesBatch` guards | — | Reused unchanged; all auto edges flow through them |
| Dependency | Existing transaction + entity-density invalidation in `backfillRelationInference` | — | Collectors run inside it; no extra invalidate needed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The similarity scan reads at most `limit` rows of the cached `related_memories` column; each row yields at most K=5 edges. No live vector search and no all-pairs comparison.

### Security
- **NFR-S01**: No external input; operates only on the local memory DB. Opt-in + dry-run-default + bounds prevent accidental mass writes.

### Reliability
- **NFR-R01**: Idempotent re-runs upsert with no duplicate rows. Cold-start safe — missing `related_memories` column or `memory_lineage`/`superseded_by_memory_id` yields a graceful no-op (never throws).

---

## 8. EDGE CASES

### Data Boundaries
- `related_memories` absent column / empty / unparseable JSON: zero `supports` edges, no throw.
- A neighbour referencing self: excluded (also caught by `insertEdge` self-loop guard).
- A pair already produced by the spec-chain collector: excluded by the similarity collector (unordered pair key).

### Error Scenarios
- A write transaction failure leaves `written=0` and is swallowed (best-effort), never crashing `memory_causal_stats`.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 6, LOC: ~285 impl + ~275 test, Systems: causal graph + tool schema |
| Risk | 16/25 | Writes to a recovered production DB; mitigated by opt-in + dry-run-default + bounds |
| Research | 8/20 | Reuse of the established 021 backfill pattern + cached-column read |
| Multi-Agent | 0/15 | Single workstream |
| Coordination | 6/15 | Touches the tool schema + types to make the options callable |
| **Total** | **44/100** | **Level 3** (extends an inference subsystem; ≥500 LOC with tests) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Auto-edge flood on production DB | H | L | opt-in + dry-run default + bounded limit + insertEdge bounds |
| R-002 | False-positive contradicts from semantics | H | L | structural supersession only; no embedding path |

---

## 11. USER STORIES

### US-001: Grow supports coverage from cached neighbours (Priority: P0)

**As an** operator running `memory_causal_stats`, **I want** to opt into a similarity `supports` collector, **so that** pre-computed cosine neighbours become typed `supports` edges without a live vector scan.

**Acceptance Criteria**:
1. Given a DB with `related_memories` populated, When I call `memory_causal_stats({ backfill: { dryRun:false, similarity:true } })`, Then bounded `created_by='auto'` `supports` edges are created respecting threshold>=75 and K<=5.

### US-002: Record supersession as contradicts (Priority: P1)

**As an** operator, **I want** to opt into a `contradicts` collector driven by structural supersession, **so that** superseded predecessors are typed as `contradicts` their successor without semantic guesswork.

**Acceptance Criteria**:
1. Given a DB with `memory_lineage.superseded_by_memory_id` set, When I call the backfill with `contradicts:true` and `dryRun:false`, Then a predecessor->successor `contradicts` edge is created.

---

## 12. OPEN QUESTIONS

Resolved: the cached `related_memories` column is read instead of a live `vector_search` so the similarity collector is deterministic and unit-testable; `contradicts` is driven by structural supersession rather than embedding similarity to avoid false positives.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
