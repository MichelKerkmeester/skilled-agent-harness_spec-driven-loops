---
title: "Implementation Plan: Phase 4: embedding-coverage-and-vector-shard-consistency"
description: "Repair embedding coverage and vector shard-write consistency: drain the pending backlog through the active shard, reconcile success-without-vector rows, backfill model provenance, fix scan-lifecycle races, and execute the ADR-001 chunking decision with the safe-swap P0 fixed either way."
trigger_phrases:
  - "embedding coverage repair"
  - "vector shard consistency"
  - "pending vectors drain"
  - "retry manager drain"
  - "embedding reconcile plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/004-embedding-coverage-and-vector-shard-consistency"
    last_updated_at: "2026-07-04T17:51:11.401Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 implementation plan from deep-dive sources"
    next_safe_action: "Execute Phase 1 baseline + verify-first tasks before touching code"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-016-004-embedding-coverage"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: embedding-coverage-and-vector-shard-consistency

<!-- SPECKIT_LEVEL: 3 -->
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
| **Language/Stack** | TypeScript (Node), MCP server `mk-spec-memory` |
| **Framework** | better-sqlite3 + sqlite-vec vector shards (`vec_memories`, active `vec_<dim>`) |
| **Storage** | SQLite packet DB (~1.3GB, 33,101 memory_index rows) |
| **Testing** | vitest (mcp_server suites), read-only SQL probes for live counts |

### Overview
Four fix batteries, executed verify-first: (A) drain and reconcile (active-shard write #16, reconcile run + schedule, drain-rate scaling, retry@max rescue), (B) provenance and identity (spelling normalization, 27,706-row backfill, query-time embedder assertion, 'auto' sentinel), (C) chunking (safe-swap P0 #3 fix unconditionally, then ADR-001 activation-or-policy), and (D) scan lifecycle (pendingVectors undercount, scope-blind coalescing, cancel-cooldown, heartbeat lease). Live numbers are captured before and after every battery; behavior-changing chunking activation ships flag-gated per program cross-cutting rules.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md §2-3)
- [ ] Success criteria measurable (spec.md §5, decomposition §004 gates)
- [ ] Dependencies identified (program order 011/001-003; embedder endpoint)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..REQ-013)
- [ ] Tests passing: vitest whole gate re-run vs T002 baseline, delta reported
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record synchronized; ADR-001 Accepted)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Repair batteries over an existing layered MCP server (handlers -> lib) plus one write migration; no new architecture.

### Key Components
- **retry-manager (`mcp_server/lib/providers/retry-manager.ts`)**: async embedding drain; gains active-shard write (:747-765), text parity, adaptive rate, dead-end rescue.
- **embedding-reconcile (`mcp_server/lib/embedders/embedding-reconcile.ts`)**: success-vs-vector reconciliation; gains a scheduled cadence + /memory:manage entry point.
- **chunking-orchestrator (`mcp_server/handlers/chunking-orchestrator.ts`)** + **vector-index-store (`mcp_server/lib/search/vector-index-store.ts`)**: safe-swap staging/finalize (:488-553) and dedup lookup (:1857-1873); the P0 fix.
- **vector-index-mutations (`mcp_server/lib/search/vector-index-mutations.ts`)**: owns `writeActiveVectorPayload`, the write path the drain must reuse.
- **Provenance migration (new)**: embedding_model spelling normalization + backfill from shard provenance, logging before-values.
- **Scan lifecycle (coalescing/cooldown/lease modules, located in T007)**: scope-aware coalescing and lease correctness.

### Data Flow
Save/scan enqueues embedding work -> retry-manager drains pending rows -> embeds (same weighted text as sync path) -> writes BOTH `vec_memories` and the active `vec_<dim>` shard -> health consistency + shard-repair sentinel read the same shard the writes target -> query path asserts embedder identity against stored `embedding_model` before scoring.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| retry-manager drain writer (producer) | Writes drained vectors to `vec_memories` only (#16) | update: route through `writeActiveVectorPayload` | vitest parity test both shards; rg inventory of vector-write call sites |
| Sync save embed path (same-class producer) | Writes active shard correctly; source of the weighted-text contract | unchanged, but its text projection becomes the shared contract | rg for embed-text builders; byte-parity test sync vs drain (REQ-007) |
| Embedding cache (shared helper) | Keyed without the text projection; poisonable across paths | update: cache key includes embedded-text identity | cache-key unit test; poisoning regression test |
| chunking-orchestrator finalize (producer) | Bulk-deletes oldChildIds captured post-staging (#3) | update: append-only staging or oldChildIds = old minus new | un-skipped update-path tests; adversarial re-save test |
| vector-index-store get_by_folder_and_path (helper) | Dedup lookup without parent filter feeds the self-delete (ledger L9) | update: parent-aware lookup | unit test on chunk-parent collision |
| Health consistency check (consumer) | Detects success-without-vector (found the 367) | unchanged; used as SC-001 evidence | run before/after reconcile; counts reconcile to 0 |
| Shard-repair sentinel for 'auto' embedder (consumer/status) | Counts `vec_<dim>` while writes go to `vec_memories`; never clears | update: count the write-target shard (REQ-010) | sentinel clears in integration test after repair |
| stats pendingVectors (consumer/status) | Undercounts updated files (REQ-012) | update | undercount regression test |
| Scan coalescing/cooldown/lease (policy) | Scope-blind coalescing; cancel arms cooldown; heartbeat resurrects lease | update (REQ-011) | three adversarial lifecycle tests |
| Stale-delete loop in scan handler (producer/status) | Parent delete cascades chunk children; per-child re-delete returns false and inflates `failed` | update: delete children before parents (DESC) or treat already-gone rows as success (REQ-013) | parent+children stale-delete test asserts failed==0 for cascade-removed rows |
| memory_search query path (consumer) | Scores stored vectors without embedder-identity assertion | update: assert identity, exclude/re-queue on mismatch (REQ-009) | mismatch-handling test with telemetry assertion |
| /memory:manage + maintenance docs (docs) | No reconcile cadence documented (never run) | update: wiring + doc rows | doc diff; command exercises reconcile |
| Phase-012 envelope/presentation surfaces (not a consumer) | Presentation only; no shard semantics | not a consumer | scope note; no changes here |

Required inventories:
- Same-class producers: `rg -n 'vec_memories|writeActiveVectorPayload|vec_' .opencode/skills/system-spec-kit/mcp_server/lib .opencode/skills/system-spec-kit/mcp_server/handlers --glob '*.ts'` to enumerate every vector-write site before changing the drain.
- Consumers of changed symbols: `rg -n 'writeActiveVectorPayload|embedding_model|pendingVectors|indexChunkedMemoryFile' .opencode/skills/system-spec-kit --glob '*.ts' --glob '*.md'` (docs included; command docs must not drift, per phase 012 scope boundary).
- Matrix axes: embed path {sync, drain, reconcile} x shard {vec_memories, active vec_<dim>} x row state {pending, retry, retry@max, failed, success-no-vector} - rows for each transition the fixes touch, enumerated in T024/T027 before completion.
- Algorithm invariant: after any successful embed write, the row is queryable via the active shard AND its `embedding_model` matches the embedder that produced it; adversarial cases: re-save during drain, model swap mid-backlog, chunked-parent re-save, cancelled scan mid-drain.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Baseline capture: live SQL counts (embedding_status split, 367 desync, 27,706 empty attribution, spelling counts) snapshotted to scratch/
- [ ] vitest whole-gate baseline for mcp_server captured (baseline-before-delta rule)
- [ ] Verify-first battery: confirm all agent-verified (🟡) findings against code before fixing (T003-T008); ADR-001 spike data gathered (T009)

### Phase 2: Core Implementation
- [ ] Battery C1: safe-swap self-delete fix + un-skipped update-path tests (REQ-001)
- [ ] Battery A: active-shard drain write, text parity + cache key, drain scaling, retry@max rescue, reconcile run + schedule (REQ-002/003/004/006/007)
- [ ] Battery B: provenance migration + query-time identity assertion + 'auto' sentinel (REQ-008/009/010)
- [ ] Battery D: scan lifecycle fixes + pendingVectors undercount + stale-delete cascade double-count (REQ-011/012/013)
- [ ] Battery C2: execute ADR-001 accepted option (scan-path chunking flag-gated, or policy documentation) (REQ-005)

### Phase 3: Verification
- [ ] Whole vitest gate re-run vs baseline; delta reported
- [ ] Live counts re-measured against SC-001..SC-004; drain throughput window measured (SC-002)
- [ ] Docs synchronized, checklist evidence filled, validate.sh --strict exit 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | retry-manager active-shard write; embed-text parity + cache key; chunking safe-swap update path (un-skip existing skipped tests); coalescing/cooldown/lease; pendingVectors count | vitest |
| Integration | reconcile run on a DB copy then live; drain throughput observation window; provenance migration dry-run diff; embedder identity mismatch handling | vitest + node scripts on DB copy |
| Manual | SQL parity counts (success vs vector rows); tail-of-193KB-doc query (SC-003, Option A); /memory:manage reconcile entry point | sqlite3 read-only probes, MCP tool calls |

Baseline-before-delta: capture the FULL vitest gate and the live SQL counts before Phase 2 begins; re-run the whole gate after; report the numeric delta (program cross-cutting rule).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 011, 001-003 land first (program order) | Internal | Yellow (in flight) | Drain embeds dead/duplicate rows; the "scope drain to 002's active predicate" fallback is only partial because that predicate itself needs 002 landed (mildly circular) |
| Embedder endpoint (nomic) for ~14k embeddings | External | Green | Backlog cannot drain; resumable queue waits |
| sqlite-vec active shard schema (`vec_<dim>`) | Internal | Green | REQ-002 write path has no target |
| Phase 002 shared active-row predicate | Internal | Yellow | Reconcile/drain may prioritize archived rows; acceptable, wasteful |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: SC-001 parity regresses, drain overloads the embedder/event loop, chunking activation degrades scan latency, or the provenance migration miscounts in dry-run.
- **Procedure**: git revert the phase commits; restore the packet DB from the pre-migration backup (the provenance backfill and spelling normalization are the only destructive writes); disable the scan-path chunking flag; restore drain-rate config defaults.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline + Verify-first) ──► Battery C1 (safe-swap P0) ──► Battery C2 (ADR-001 option)
                                  ├──► Battery A (drain/reconcile) ──► Battery B (provenance/identity)
                                  └──► Battery D (scan lifecycle)   ──► Phase 3 (Verify gates)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 baseline + verify-first | None | All batteries |
| Battery C1 (REQ-001) | Phase 1 | Battery C2 |
| Battery A (REQ-002/003/004/006/007) | Phase 1 | Battery B, Phase 3 |
| Battery B (REQ-008/009/010) | Battery A landed (new writes attribute correctly) | Phase 3 |
| Battery D (REQ-011/012/013) | Phase 1 | Phase 3 |
| Battery C2 (REQ-005) | C1 + ADR-001 Accepted | Phase 3 |
| Phase 3 verification | All batteries | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 baseline + verify-first | Med | 3-5 hours |
| Battery A (drain/reconcile) | High | 5-7 hours |
| Battery B (provenance/identity) | Med | 3-5 hours |
| Battery C (safe-swap + ADR execution) | Med-High | 4-6 hours |
| Battery D (scan lifecycle) | Med | 2-3 hours |
| Phase 3 verification | Med | 3-4 hours |
| **Total** | | **20-30 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Packet DB backup created before the provenance migration and before the first reconcile write
- [ ] Scan-path chunking behind a feature flag (Option A only)
- [ ] Drain-rate config change isolated in one revertible commit

### Rollback Procedure
1. Disable the scan-path chunking flag (Option A only); drain returns to prior rate via config revert.
2. git revert the battery commits (each battery lands as a separable commit).
3. Restore the packet DB backup if the provenance migration or reconcile wrote bad rows.
4. Re-run the health consistency check and the T001 SQL snapshot to confirm the pre-phase state.

### Data Reversal
- **Has data migrations?** Yes: embedding_model spelling normalization + 27,706-row backfill; reconcile writes missing vectors.
- **Reversal procedure**: restore the pre-migration DB backup, or apply the inverse UPDATE from the migration's before-value log (the migration must record affected row ids + prior values before writing).
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Phase 1         │────►│  Battery A       │────►│  Battery B       │
│  Baseline +      │     │  Drain/Reconcile │     │  Provenance/ID   │
│  Verify-first    │     └──────────────────┘     └────────┬─────────┘
└───────┬──────────┘                                       │
        ├──────────────►┌──────────────────┐               ▼
        │               │  Battery C1→C2   │      ┌──────────────────┐
        │               │  Safe-swap + ADR │─────►│  Phase 3         │
        │               └──────────────────┘      │  Gates + Delta   │
        └──────────────►┌──────────────────┐─────►│  Report          │
                        │  Battery D       │      └──────────────────┘
                        │  Scan lifecycle  │
                        └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 (baseline + verify-first + spike) | None | Confirmed findings, baseline numbers, ADR evidence | A, B, C, D |
| Battery A (drain/reconcile) | Phase 1 | Active-shard drain, reconcile cadence, scaled rate | B, Phase 3 |
| Battery B (provenance/identity) | A | Canonical attribution, query-time assertion | Phase 3 |
| Battery C (safe-swap then ADR option) | Phase 1; C2 also needs ADR-001 Accepted | Safe update path; chunked scan or documented policy | Phase 3 |
| Battery D (scan lifecycle) | Phase 1 | Honest scoped scans, correct cooldown/lease | Phase 3 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 verify-first (#16, shard writes, F P2 battery)** - 3-5h - CRITICAL
2. **Battery A drain/reconcile (REQ-002/003/004)** - 5-7h - CRITICAL
3. **Battery B provenance backfill + identity assertion (REQ-008/009)** - 3-5h - CRITICAL
4. **Phase 3 gate re-measurement (SC-001/SC-002/SC-004)** - 3-4h - CRITICAL

**Total Critical Path**: 14-21 hours

**Parallel Opportunities**:
- Battery C1 (safe-swap fix) and Battery D (scan lifecycle) can run parallel to Battery A.
- The ADR-001 spike (T009) runs during Phase 1, parallel to the verify-first battery.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline + verify-first complete | All 🟡 findings confirmed or downgraded with evidence; ADR-001 spike data captured | End of Phase 1 |
| M2 | P0 batteries landed | Safe-swap fixed, drain writes active shard, reconcile run (367 -> 0), backlog draining at scaled rate | Mid Phase 2 |
| M3 | Gates green | SC-001..SC-005 evidenced, ADR-001 Accepted, whole-gate delta reported, validate.sh --strict exit 0 | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Scan-path chunking vs documented single-vector truncation policy

**Status**: Proposed (canonical record: `decision-record.md` ADR-001)

**Context**: Chunking machinery exists but only `memory-save.ts:2511` calls it; the scan path that produced 99.96% of the corpus never chunks, leaving 39 docs >50KB (max 193KB) as single truncated vectors, and the safe-swap update path carries a verified P0 self-delete (report §3 #3).

**Decision**: Fix the safe-swap self-delete unconditionally first; then activate scan-path chunking flag-gated for over-threshold docs only if the Phase 1 spike shows acceptable scan cost, otherwise document the single-vector truncation policy with explicit FTS-only tail coverage.

**Consequences**:
- Either branch closes SC-003 honestly; the P0 stops being a landmine for any future chunking use.
- Option A adds chunk-row growth and scan-latency cost that must be measured before acceptance.

**Alternatives Rejected**:
- Leave chunking dormant and undocumented: keeps 39 docs silently truncated and the P0 latent; fails the decomposition gate.

Canonical ADR analysis (alternatives table, Five Checks, rollback) lives in `decision-record.md`.

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
