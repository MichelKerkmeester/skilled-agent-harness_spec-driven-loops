---
title: "Tasks: Phase 8: causal-graph-hygiene-and-entity-linker-noise"
description: "Task breakdown: baselines and 🟡 confirmations first, then seven fix clusters (ADR-001 disposition, ratchet, absorbed P1-2/P1-4, causal-links, linker parity, community/signals, surrogates), then gates."
trigger_phrases:
  - "causal graph hygiene tasks"
  - "entity linker noise tasks"
  - "edge ratchet fix tasks"
  - "cooccurrence migration tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/008-causal-graph-hygiene-and-entity-linker-noise"
    last_updated_at: "2026-07-04T14:09:12.826Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All tasks complete; 13 REQs shipped, 2 live migrations applied, 225 tests green"
    next_safe_action: "Phase 009 learning-feedback-loop-repair"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-016-008-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: causal-graph-hygiene-and-entity-linker-noise

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Finding references use report §3 numbering (#N), ledger tags (L#, Agent letter + priority), and the absorbed 028/006/002 IDs (P1-2, P1-4). Citations live HERE, never in code comments (comment-hygiene HARD BLOCK).
<!-- /ANCHOR:notation -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [x] Baselines from T001-T003 captured and stored before any code change
- [x] The cluster's 🟡 findings confirmed against current code (finding-is-a-hypothesis)
- [x] Dependent ADR status checked (Proposed vs Accepted) before landing code that assumes it

### Execution Rules

| Rule | Meaning |
|------|---------|
| TASK-SEQ | Execute clusters in plan.md dependency order; Phase 1 gates every cluster |
| TASK-SCOPE | Touch only files listed in spec.md Files to Change; no adjacent cleanup |
| TASK-EVIDENCE | Every completed task cites its test/probe output in checklist.md, pinned to a SHA |

### Status Reporting Format

`T### STATUS: [DONE | IN-PROGRESS | BLOCKED] - <one-line evidence pointer>`

### Blocked Task Protocol

Mark the task `[B]` with the blocker named inline, add it to the continuity blockers list, and stop the cluster instead of working around a failed gate. Escalate with conflicting facts if implementation evidence contradicts this spec (logic-sync).

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture vitest baseline: full suite run, store pass/fail counts and failing-test list as the regression gate (mcp_server/)
- [x] T002 [P] Capture data baselines on the live DB (read-only): relation histogram (`SELECT relation, created_by, ROUND(strength,2), COUNT(*) FROM causal_edges GROUP BY 1,2,3`), strength distribution, `entity_catalog`=61,638 / `memory_entities`=561,785 / placeholder-title surrogate=7,108 counts (🟢 L8 refresh; live re-measure 2026-07-03: 33,476 edges, 31,536 `supports`@0.7 `created_by='entity_linker'`, derived_id NULL on 32,465)
- [x] T003 [P] Prepare a production DB copy for migration dry-runs (scratch/, never committed)
- [x] T004 🟡 confirm-before-fix: recomputeLocal ratchet - quote current `MIN(1.0, strength + ...)` behavior and its onWrite call sites (report #19; mcp_server/lib/search/graph-lifecycle.ts:309-323)
- [x] T005 [P] 🟡 confirm-before-fix: causal-links `blocks`→reversed-`enabled` mapping and fuzzy-LIKE fallback reach (Agent H P2; mcp_server/handlers/causal-links-processor.ts:67,290)
- [x] T006 [P] 🟡 confirm-before-fix: entity-linker incremental-vs-full normalization mismatch, degree-cache staleness on createEntityLinks, reversed A→B/B→A dup pairs, density guard counting pseudo-edges, catalog LIMIT 500 without ORDER BY, per-memory error full-corpus fallback (Agent D P2/contract; mcp_server/lib/search/entity-linker.ts)
- [x] T007 [P] 🟡 confirm-before-fix: community rebuild frozen at checkpoint-restore, fingerprint sum-collision, cache not reset on DB rebind, phantom injected member ids; graph-signals exact now-7d momentum + memoryId-only cache keys (Agent D P2, Agent C P2; mcp_server/lib/graph/community-detection.ts, mcp_server/lib/graph/graph-signals.ts)
- [x] T008 Read the absorbed contract, then CONFIRM both fixes are already in live code: P1-2 (the v40 backfill already hashes `DEFAULT_DERIVED_CAUSAL_EDGE_RULE_VERSION` at vector-index-schema.ts:1119-1129, matching the live default at causal-edges.ts:125; content-id.ts:28 = `causal-edge:v1`; twin-identity test at tests/derived-id-provenance.vitest.ts) and P1-4 (the read-only scan already runs before BEGIN IMMEDIATE at consolidation.ts:574-578; `runSemanticEdgeEmbeddingPass`/`embedEdgeText` do not exist tree-wide; the old :684/:701 cite exceeds the 634-line file). Record that both code defects are already gone — only the P1-2 backfill and the P1-4 test remain (../../006-review-remediation/002-memory-schema-and-concurrency/spec.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Cluster A - ADR-001 co-occurrence disposition (REQ-001, 🟢 L8)

- [x] T009 Consumer inventory: rg every reader of `'supports'`/`RELATION_TYPES.SUPPORTS`/`created_by='entity_linker'` provenance and of the strength band across mcp_server; record update/unchanged/not-a-consumer per surface in ADR-001 (plan.md FIX ADDENDUM commands)
- [x] T010 Dry-run on the DB copy: down-weight the ~31,536 `created_by='entity_linker'` `'supports'`@0.7 edges per ADR-001 (strength UPDATE only — relocation to `entity_cooccurrence` is blocked by the CHECK constraint and would force a full table rebuild); capture before/after strength counts; ratify or flip ADR-001 on the evidence (mcp_server/lib/search/vector-index-schema.ts)
- [x] T011 Land the write-side change: entity-linker inserts write `relation='supports'` at the ratified low strength (not 0.7); causal boost/traversal/density guard exclude `created_by='entity_linker'` edges by default with an explicit opt-in (mcp_server/lib/search/entity-linker.ts:865)
- [x] T012 Ship the forward + reverse strength-UPDATE migration pair, provenance-scoped, batched and idempotent (no schema change) (mcp_server/lib/search/vector-index-schema.ts)

### Cluster B - graph-lifecycle (REQ-002, REQ-012 partial; report #19, Agent D P2)

- [x] T013 Replace the additive `MIN(1.0, strength + degreeBoost)` ratchet: recompute the relation prior each save and combine it idempotently with the current degree (or move the degree term to its own column) so strength never accumulates and never collapses to a degree-only value; keep typed-degree weights consistent; skip onWrite recompute when `inserted == 0` (mcp_server/lib/search/graph-lifecycle.ts:309-323)
- [x] T014 [P] Filter pseudo-node ids (`heading:`/`alias:`/`concept:`) out of `estimateComponentSize` and `recomputeLocal` traversal; drain the dirty set when no refresh fn is registered (mcp_server/lib/search/graph-lifecycle.ts)
- [x] T015 [P] Generate surrogates with the real document title instead of `Memory ${id}` (mcp_server/lib/search/graph-lifecycle.ts:532)

### Cluster C - absorbed 028/006/002, verify-first (REQ-003, REQ-004; P1-2, P1-4)

- [x] T016 P1-2 verify-then-backfill: confirm the v40 backfill already hashes the live default (vector-index-schema.ts:1119-1129 == causal-edges.ts:125, content-id.ts:28) and the twin-identity test passes; then run the idempotent `WHERE derived_id IS NULL` backfill on the 32,465 NULL rows so backfilled and live twins collapse under the partial UNIQUE index (mcp_server/lib/search/vector-index-schema.ts)
- [x] T017 P1-4 verify-then-test: confirm the read-only scan already runs before `BEGIN IMMEDIATE` (consolidation.ts:574-578) and that no embedding call runs under the lock (no `embedEdgeText` symbol exists tree-wide); add a concurrency/interleaving test asserting the immediate lock scope covers only the Hebbian write phase (mcp_server/lib/storage/consolidation.ts, mcp_server/tests/)

### Cluster D - honest edge inference: causal-links-processor + session-trace (REQ-005, REQ-013; Agent H P2, routed silent-drop)

- [x] T018 Fix `blocks` polarity: stop storing reversed `enabled`; map to `contradicts` (CHECK-legal; a first-class `blocks` relation would need the CHECK table rebuild) (mcp_server/handlers/causal-links-processor.ts:67)
- [x] T019 Replace the fuzzy-LIKE fallback with unresolved-with-suggestion (no edge written); add liveness/parent filters to numeric ref resolution (mcp_server/handlers/causal-links-processor.ts:290)
- [x] T032 [P] Session-trace causal reducer (routed silent-drop; REQ-013): require ≥2 distinct-session co-occurrences before inferring an edge and exclude same-query co-retrieved sources in `selectPriorSearchSources` (today it infers from a single co-occurrence and prefers same-query sources; flag `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE` default OFF) (mcp_server/lib/feedback/session-trace-causal-reducer.ts)

### Cluster E - entity-linker parity and hygiene (REQ-006..REQ-009; Agent D P2/refinement/contract)

- [x] T020 Normalize incremental matching identically to the full run (case/normalization parity) (mcp_server/lib/search/entity-linker.ts)
- [x] T021 [P] Invalidate the degree cache in `createEntityLinks`; canonicalize pair order so A→B/B→A dedup to one edge (mcp_server/lib/search/entity-linker.ts)
- [x] T022 [P] Density guard counts numeric-endpoint (memory↔memory) edges only (mcp_server/lib/search/entity-linker.ts)
- [x] T023 [P] Add ORDER BY to the LIMIT 500 catalog read; implement a pruning path for `entity_catalog`/`memory_entities` wired to the maintenance surface (mcp_server/lib/search/entity-linker.ts)
- [x] T024 Contain per-memory linking errors: log-and-skip, never escalate to a full-corpus run inside the save path (mcp_server/lib/search/entity-linker.ts)

### Cluster F - community lifecycle + graph-signals (REQ-011, REQ-012; Agent D P2, Agent C P2)

- [x] T025 Community lifecycle: rebuild cadence beyond checkpoint-restore, stable community IDs across rebuilds, fingerprint sum-collision fix, cache reset on DB rebind, filter phantom member ids for deleted memories; apply ADR-002 naming outcome (mcp_server/lib/graph/community-detection.ts)
- [x] T026 [P] Graph-signals: nearest-snapshot momentum lookup; cache keys include DB identity (mcp_server/lib/graph/graph-signals.ts)

### Cluster G - ADR-003 surrogate regeneration (REQ-010)

- [x] T027 Regenerate the 7,108 placeholder-title surrogate rows per the ratified ADR-003 strategy, batched through the async queue; fix alias dup provenance (mcp_server/lib/search/graph-lifecycle.ts, migration/maintenance path)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T028 Vitest full-suite re-run against the T001 baseline: zero new failures; new unit/integration tests green (adversarial matrix rows from plan.md FIX ADDENDUM)
- [x] T029 [P] Post-migration probes on the DB copy, then production: relation histogram sane (SC-001), N no-op saves leave strengths byte-identical (SC-002), twin `derived_id` identity (SC-003), no `BEGIN IMMEDIATE` across embedding (SC-004); paste evidence into checklist.md
- [x] T030 [P] Ratify ADR-001/002/003 with dry-run evidence; update decision-record.md statuses to Accepted
- [x] T031 Reconcile docs: checklist P0/P1 items evidenced, spec status updated, implementation-summary.md written; run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` to exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (T029 probes evidenced in checklist.md)
- [x] REQ-001..REQ-002 (P0) complete; REQ-003..REQ-013 (P1, incl. verify-first P1-2/P1-4 and the session-trace reducer) complete or user-approved deferral
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (requirements REQ-001..REQ-012, success criteria SC-001..SC-006)
- **Plan**: See `plan.md` (FIX ADDENDUM surfaces, cluster dependency graph)
- **Decisions**: See `decision-record.md` (ADR-001/002/003)
- **Research**: `../research/deep-dive-report.md`, `../research/findings-ledger.md`, `../research/phase-decomposition.md` (§008)
- **Absorbed contract**: `../../006-review-remediation/002-memory-schema-and-concurrency/` (P1-2, P1-4; Phase 013 re-points it)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE
- Task tracking with finding-ID citations
- 3 phases: Setup (verify-first), Implementation (clusters A-G), Verification
-->
