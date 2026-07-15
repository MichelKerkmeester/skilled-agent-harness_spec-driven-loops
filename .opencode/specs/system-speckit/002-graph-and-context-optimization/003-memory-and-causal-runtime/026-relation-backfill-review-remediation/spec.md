---
title: "Feature Specification: Relation-Backfill Review Remediation"
description: "Deep review of the relation-inference backfill found a data-integrity defect plus correctness/honesty/maintainability findings. The supersession 'contradicts' collector emits the SAME directed pair as the lineage 'caused' collector, so committing contradicts triggers contradiction-detection to silently invalidate the just-created valid 'caused' edge (and could invalidate a pre-existing manual edge). This packet adds a relation-agnostic conflict guard, makes the inner backfill schema strict, makes written/byRelation honest on re-runs, and cleans up maintainability debt."
trigger_phrases:
  - "relation backfill review remediation"
  - "supersession contradicts caused invalidation"
  - "hasConflictingValidEdge backfill guard"
  - "backfill skippedConflicting"
  - "relation backfill honest written count"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/026-relation-backfill-review-remediation"
    last_updated_at: "2026-06-04T14:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixed SEC-001 conflict guard + COR-001/002 + P2s; tsc + 179 tests green"
    next_safe_action: "Strict-validate packet; commit + deploy stay user-gated"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/relation-backfill-conflict.vitest.ts"
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "The conflict guard is relation-agnostic (reuses relationsConflict) so it protects manual + auto edges for any conflicting relation, not just the lineage/supersession pair that surfaced the defect."
---
# Feature Specification: Relation-Backfill Review Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

A deep review of the relation-inference backfill subsystem surfaced a confirmed data-integrity defect: the supersession `contradicts` collector and the lineage `caused` collector emit the SAME directed pair (lineage is reciprocal — predecessor and superseded_by point at each other). In a committed run with `contradicts:true`, the `caused` edge inserts first, then the `contradicts` edge triggers contradiction-detection, which silently sets `invalid_at` on the just-created valid `caused` edge — mislabeling an evolution as a contradiction and corrupting traversal. This packet adds a relation-agnostic conflict guard, fixes three lesser findings (strict inner schema, honest write counting, handler hint), and clears five maintainability P2s.

**Key Decisions**: Suppress backfill auto edges whose pair already carries a VALID conflicting edge (reusing the shared `relationsConflict` rules) instead of letting contradiction-detection invalidate established edges; report written/byRelation from the committed valid-auto-edge DELTA rather than upsert counts.

**Critical Dependencies**: `relationsConflict` (contradiction-detection), `insertEdgesBatch`/`insertEdge` guards, the temporal `invalid_at` lifecycle column.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-04 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`collectSupersessionEdges` emits `contradicts` for predecessor->successor, and `collectLineageEdges` emits `caused` for the SAME directed pair because lineage is reciprocal (`A.superseded_by=B` AND `B.predecessor=A`). In a non-dry run with `contradicts:true`, the `caused` edge inserts first, then the `contradicts` edge runs `detectContradictions`, which calls `invalidateEdge` and silently sets `invalid_at` on the just-created valid `caused` edge — and would do the same to a pre-existing manual or higher-strength edge on that pair. `countWrittenByRelation` did not filter `invalid_at`, so the summary mis-reported. Secondary findings: the inner `backfill` schema was not strict (typo'd keys silently dropped); `written`/`byRelation` over-reported upserts on re-run as if freshly written; and several maintainability snags (unused import, dead no-op loop, magic literals, duplicated write blocks).

### Purpose
Protect every existing valid edge (manual + auto) from being invalidated by a lower-value backfill auto edge, and make the backfill summary honest and the module maintainable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Relation-agnostic conflict guard: before inserting conflict-prone backfill auto edges, skip any whose (source,target) pair already has a VALID edge with a conflicting relation (per `relationsConflict`), observing edges inserted earlier in the SAME transaction.
- New summary field `skippedConflicting`; skipped edges are NOT counted as written.
- Make the inner `backfill` object schema reject unknown keys (built via `getSchema`).
- Honest `written`/`byRelation`: report the committed valid-auto-edge DELTA, not upsert counts.
- Handler hint wording no longer over-claims; surfaces `skippedConflicting`.
- Maintainability cleanups (M-004-1..5): drop unused import, remove dead no-op loop, name the spec-chain strength literals, extract a single insert helper, add the byRelation-equals-SQL test.
- New `tests/relation-backfill-conflict.vitest.ts`.

### Out of Scope
- Changing the canonical `contradicts` direction/labeling or the contradiction-detection rules themselves — the labeling is intentional; we suppress the backfill emission, not the detector. (See decision-record ADR-001.)
- New collectors or coverage-target changes.
- Committing/rebuilding dist/recycling the daemon — left user-gated per the brief.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/causal/relation-backfill.ts` | Modify | Conflict guard, honest counting, P2 cleanups |
| `mcp_server/lib/graph/contradiction-detection.ts` | Modify | Export `relationsConflict` for reuse |
| `mcp_server/schemas/tool-input-schemas.ts` | Modify | Strict inner `backfill` object |
| `mcp_server/handlers/causal-graph.ts` | Modify | Honest hint wording + skippedConflicting note |
| `mcp_server/tests/relation-backfill-conflict.vitest.ts` | Create | Conflict-guard + honesty + strict-schema regressions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A backfill auto edge that conflicts with an existing VALID edge on the same pair is SKIPPED, not inserted | Reciprocal-lineage test: `caused` 20->21 has `invalid_at IS NULL`; the conflicting `contradicts` is not inserted |
| REQ-002 | The conflict guard protects PRE-EXISTING manual/higher-strength edges, for ANY conflicting relation | Manual-edge test: a manual `caused` survives a backfill `contradicts` candidate; auto `contradicts` skipped |
| REQ-003 | `skippedConflicting` is surfaced and skipped edges are not counted as written | Both conflict tests assert `skippedConflicting >= 1`; `written` excludes them |
| REQ-004 | The inner `backfill` schema rejects unknown keys | Test: `{ backfill: { contradict: true } }` throws `ToolSchemaValidationError`; valid keys still pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `written`/`byRelation` count only newly-inserted valid edges (honest on re-run) | Test: `written===0` on a second committed run; `byRelation` empty on the no-op re-run |
| REQ-006 | `byRelation` equals the live valid-auto-edge distribution after a committed run | Test: `result.byRelation` deep-equals `SELECT relation,COUNT(*) ... created_by='auto' AND invalid_at IS NULL GROUP BY relation` |
| REQ-007 | Maintainability P2s resolved without behavior change | Code review: unused import gone, dead loop gone, named strength constants, single insert helper; suites stay green |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `relation-backfill-conflict.vitest.ts` proves the reciprocal-lineage caused-survives case, the manual-edge-survives case, honest re-run counting, the byRelation-equals-SQL invariant, and the strict-inner-schema rejection.
- **SC-002**: `tsc --noEmit` clean; the full causal/backfill/schema suite (9 files) stays green.
- **SC-003**: A committed backfill with `contradicts:true` on reciprocal lineage no longer invalidates the `caused` edge and reports the conflicting `contradicts` under `skippedConflicting`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Conflict guard accidentally suppresses a legitimate auto edge | Lost coverage | Guard only fires when a VALID conflicting-relation edge already exists on the exact pair; reuses the same `relationsConflict` rules the detector uses |
| Risk | Delta-based counting under-reports when a guard skips an edge | Honest by design | Skipped edges are reported separately as `skippedConflicting`; `written` = newly-valid auto-edge delta |
| Risk | Temporal column absent (older DB) | Guard/count degrade | Both helpers are column-aware: they fall back to a no-temporal query when `invalid_at` is missing |
| Dependency | `relationsConflict` | — | Newly exported from contradiction-detection; single source of conflict rules |
| Dependency | `insertEdgesBatch`/`insertEdge` guards | — | Reused unchanged; all auto edges still flow through them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The conflict guard adds one indexed `causal_edges` lookup per conflict-prone candidate, bounded by `limit`; the before/after valid-auto-edge counts are two grouped aggregates per committed run.

### Security
- **NFR-S01**: No external input; operates only on the local memory DB. Strict inner schema closes a silent typo-acceptance gap.

### Reliability
- **NFR-R01**: Idempotent — a re-run upserts and reports `written=0`. Data-integrity preserved: no committed run silently invalidates a pre-existing valid edge.

---

## 8. EDGE CASES

### Data Boundaries
- DB without the temporal `invalid_at` column: the guard and counters use the no-temporal query variant; no throw.
- A pair with both a similarity `supports` and a supersession `contradicts` candidate: the first-inserted (`supports`) wins; the conflicting `contradicts` is skipped (deterministic by insert order).

### Error Scenarios
- A conflict-check query failure fails open (returns false) so the backfill never crashes `memory_causal_stats`.
- A write-transaction failure leaves the DB unchanged and `written=0`.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 5, LOC: ~210 net, Systems: causal backfill + contradiction-detection + tool schema |
| Risk | 16/25 | Data-integrity defect on a recovered production DB; mitigated by relation-agnostic guard + tests |
| Research | 8/20 | Repro confirmed; reuses established conflict rules + edge-creation patterns |
| Multi-Agent | 0/15 | Single workstream |
| Coordination | 4/15 | Touches contradiction-detection only to export an existing helper |
| **Total** | **42/100** | **Level 3** (data-integrity remediation in a shared inference subsystem) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Backfill silently invalidates a valid (manual/auto) edge | H | M (was occurring) | Relation-agnostic conflict guard skips the conflicting auto edge entirely |
| R-002 | Summary over-reports written edges on re-run | M | H (was occurring) | written/byRelation derived from committed valid-auto-edge delta |
| R-003 | Typo'd opt-in key silently ignored | L | M | Strict inner schema rejects unknown keys |

---

## 11. USER STORIES

### US-001: Protect established edges (Priority: P0)

**As an** operator running the backfill with `contradicts:true`, **I want** the backfill to never invalidate an existing valid edge, **so that** a recorded evolution (`caused`) is not silently relabeled as a contradiction and traversal stays correct.

**Acceptance Criteria**:
1. Given a reciprocal lineage pair, When I run `{ dryRun:false, contradicts:true }`, Then the `caused` edge stays valid, the conflicting `contradicts` is skipped, and `skippedConflicting >= 1`.

### US-002: Trust the summary (Priority: P1)

**As an** operator re-running the backfill, **I want** `written` to count only newly-inserted edges, **so that** the summary doesn't over-claim work that was already done.

**Acceptance Criteria**:
1. Given a DB already backfilled, When I run a second committed backfill, Then `written === 0`.

---

## 12. OPEN QUESTIONS

Resolved: the canonical `contradicts` direction (predecessor contradicts successor) is intentional and unchanged; the remediation suppresses the backfill EMISSION when a conflicting valid edge exists rather than altering the detector or the labeling. See decision-record ADR-001.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- Predecessor: packet 021 (built the backfill) and packet 023 (added the similarity/contradicts collectors).
