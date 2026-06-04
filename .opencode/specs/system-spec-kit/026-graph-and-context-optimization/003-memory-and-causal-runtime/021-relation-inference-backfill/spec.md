---
title: "Feature Specification: Relation-Inference Backfill"
description: "Packet 019 made memory_causal_stats honest by reporting that relation balancing is NOT auto-backfilled (implemented:false, command:null). This packet builds the real, bounded, safe relation-inference backfill so that stat becomes true: a new lib/causal/relation-backfill.ts infers typed causal edges from strong EXISTING deterministic signals only (spec-document chains + lineage predecessor links), all created_by='auto', default dryRun=true, bounded by limit, wrapped in a transaction, idempotent via upsert, and freshness-correct (invalidates the entity-density cache after writes)."
trigger_phrases:
  - "relation inference backfill"
  - "causal relation auto edges"
  - "memory_causal_stats backfill"
  - "entity density cache invalidation causal"
  - "spec document chain causal edges"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/021-relation-inference-backfill"
    last_updated_at: "2026-06-04T12:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Backfill built; reporter flipped; tests green"
    next_safe_action: "Commit + deploy"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-coverage.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/relation-backfill-unit.vitest.ts"
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "Similarity/contradiction edges are best-effort extensions; the MVP ships the two deterministic signals (spec-doc chains + lineage links) that are fully testable without sqlite-vec."
---
# Feature Specification: Relation-Inference Backfill

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Packet 019 corrected `memory_causal_stats` to honestly report that no command balances relation coverage (`backfillJob.implemented:false`, `command:null`). This packet builds the missing piece: a real, bounded, reversible relation-inference backfill that infers typed causal edges from strong existing signals only, then flips the stat to `implemented:true` with a callable command.

**Key Decisions**: Reuse existing deterministic signals (spec-document chains + lineage predecessor links) instead of inventing a speculative ML/semantic heuristic; wire the entry point onto the existing `memory_causal_stats` handler (no new public MCP tool).

**Critical Dependencies**: `insertEdge` runtime guards (MAX_AUTO_STRENGTH, MAX_EDGES_PER_NODE, window cap); `invalidateEntityDensityCache`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-06-04 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After packet 019, `memory_causal_stats.relationCoverage.backfillJob` honestly reports `implemented:false` / `command:null` because no command actually balances relation coverage — the prior `memory_health({autoRepair})` hint was a no-op. The honest stat is correct but the underlying capability is missing: there is no safe, auditable way to raise typed relation coverage (`caused`/`supports`) without manual `memory_causal_link` calls. The system has strong structural signals (spec-document chains, lineage version links) that already encode causal relationships but are never promoted into the causal graph.

### Purpose
Build a bounded, safe, reversible relation-inference backfill that promotes existing deterministic structural signals into typed `created_by='auto'` causal edges, then make the honest stat true.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `lib/causal/relation-backfill.ts`: `backfillRelationInference(db, { dryRun=true, limit, actor })` mirroring the established `backfillLineageState` shape (scan → infer → dryRun? report : transaction-write → summary).
- Inference from STRONG EXISTING signals only: spec-document chains (reusing the `createSpecDocumentChain` pairing rules) and lineage predecessor→successor `caused` links.
- Flip `relation-coverage.ts` `backfillJob.implemented:true` and set `command` to the real callable entry point.
- Wire the entry point onto `handlers/causal-graph.ts` (`memory_causal_stats({ backfill })`) + the tool input schema.
- Explicit `invalidateEntityDensityCache()` call after committing edges.
- New `tests/relation-backfill-unit.vitest.ts`; update the two existing tests that asserted the old `implemented:false` contract.

### Out of Scope
- Speculative ML/semantic inference. The high-similarity 'supports' neighbor and `contradicts` signals named in the brief are deferred as best-effort extensions because they require sqlite-vec embeddings that are not deterministically reproducible in a unit fixture; the MVP ships the two fully-testable deterministic signals. - keeps the just-recovered production DB safe.
- Changing coverage targets or the 60% link-coverage metric.
- An autonomous/scheduled job. The backfill is invoked explicitly (default dry run).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/causal/relation-backfill.ts` | Create | Bounded relation-inference backfill |
| `mcp_server/lib/causal/relation-coverage.ts` | Modify | Flip implemented:true; set command; honest hint |
| `mcp_server/handlers/causal-graph.ts` | Modify | Wire `backfill` arg into `memory_causal_stats` |
| `mcp_server/schemas/tool-input-schemas.ts` | Modify | Add optional `backfill` to the causal-stats schema |
| `mcp_server/tests/relation-backfill-unit.vitest.ts` | Create | Prove dryRun/guards/freshness/stat-flip |
| `mcp_server/tests/relation-coverage-unit.vitest.ts` | Modify | Assert new implemented:true contract |
| `mcp_server/tests/causal-stats-output.vitest.ts` | Modify | Assert new implemented:true contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `dryRun=true` (the default) writes ZERO edges and returns counts | Test asserts edge count unchanged + non-zero `inferred`/`scanned` |
| REQ-002 | Non-dryRun writes BOUNDED `created_by='auto'` edges respecting all `insertEdge` guards | Test asserts every written edge is auto, strength ≤ MAX_AUTO_STRENGTH, no self-loops; idempotent on re-run |
| REQ-003 | `invalidateEntityDensityCache()` is called after a real (non-dry) run | Test spies the function and asserts it was called for non-dry, NOT for dry |
| REQ-004 | `backfillJob.implemented` is `true` and `command` is non-null once the job is wired | Reporter + handler tests assert implemented:true / command contains `memory_causal_stats` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `lastBackfillAt` becomes a real timestamp after a committed run | Test asserts null before, non-null after a non-dry run |
| REQ-006 | Inference reuses existing deterministic signals only (no new heuristic) | Code review: spec-doc chains + lineage links only; no embedding/ML path in the committed core |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `relation-backfill-unit.vitest.ts` proves dryRun-zero-writes, bounded guard-respecting writes, freshness-cache invalidation, idempotency, and the stat flip.
- **SC-002**: `relation-coverage-unit.vitest.ts` + `causal-stats-output.vitest.ts` assert the new `implemented:true` / non-null-command contract; the broader causal suite stays green.
- **SC-003**: `tsc --noEmit` clean; `memory_causal_stats({ backfill: { dryRun: false } })` callable end-to-end through the MCP tool path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Flooding the just-recovered 9252-doc production DB with auto edges | High | Default `dryRun=true`; bounded `limit` (default 200, max 2000); all writes inherit `insertEdge` MAX_EDGES_PER_NODE + window-cap guards; idempotent upsert |
| Risk | Existing tests asserted `implemented:false`/`command:null` (019 contract) | Broken suite | The two affected tests are updated to the new true contract (they are in this packet's run-list, not keep-green) |
| Risk | Strict tool-input schema rejects the new `backfill` arg | Command not callable | Added optional `backfill` to `memoryCausalStatsSchema` so the command is genuinely callable end-to-end |
| Dependency | `insertEdge` / `insertEdgesBatch` guards | — | Reused unchanged; all auto edges flow through them |
| Dependency | `invalidateEntityDensityCache` | — | Called explicitly after commit (no causal mutation called it before) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A single backfill run scans at most `limit` (default 200, hard-capped 2000) memory rows + the same bound of lineage rows; writes are batched in one transaction.

### Security
- **NFR-S01**: No external input; operates only on the local memory DB. Bounded + dry-run-default prevents accidental mass writes.

### Reliability
- **NFR-R01**: Idempotent — re-runs upsert and insert no duplicate rows. Cold-start safe — returns an empty summary when required tables are absent.

---

## 8. EDGE CASES

### Data Boundaries
- Empty DB / missing tables: returns `{ scanned:0, inferred:0, written:0 }` (no throw).
- Spec folder with <2 linkable documents: produces no chain edges.

### Error Scenarios
- A write transaction failure leaves `written=0` and is swallowed (best-effort), never crashing `memory_causal_stats`.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: 7, LOC: ~430, Systems: causal graph + entity-density + tool schema |
| Risk | 18/25 | Writes to a recovered production DB; mitigated by dry-run-default + bounds |
| Research | 10/20 | Reuse of established backfill + edge-creation patterns |
| Multi-Agent | 0/15 | Single workstream |
| Coordination | 6/15 | Touches 1 out-of-scope schema file to make command callable |
| **Total** | **50/100** | **Level 3** (architecturally significant: new inference subsystem) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Auto-edge flood on production DB | H | L | dry-run default + bounded limit + insertEdge bounds |
| R-002 | Mislabeled relation distribution in summary | M | L | `byRelation` recomputed from committed edges after a real run |

---

## 11. USER STORIES

### US-001: Make the honest stat true (Priority: P0)

**As an** operator running `memory_causal_stats`, **I want** the advertised relation-backfill command to actually create typed edges, **so that** following the hint raises coverage instead of being a no-op.

**Acceptance Criteria**:
1. Given a DB with spec-document chains, When I call `memory_causal_stats({ backfill: { dryRun: false } })`, Then bounded `created_by='auto'` caused/supports edges are created and `backfillJob.implemented` is `true`.

### US-002: Preview before committing (Priority: P1)

**As an** operator on a recovered production DB, **I want** the backfill to default to a dry run, **so that** I can preview candidate edge counts before any write.

**Acceptance Criteria**:
1. Given any DB, When I call the backfill without `dryRun:false`, Then zero edges are written and candidate counts are returned.

---

## 12. OPEN QUESTIONS

Resolved: high-similarity 'supports' neighbors and `contradicts` detection are deferred best-effort extensions (require sqlite-vec embeddings, not deterministically testable in a unit fixture); the MVP ships the two deterministic signals that fully satisfy REQ-001..004.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
