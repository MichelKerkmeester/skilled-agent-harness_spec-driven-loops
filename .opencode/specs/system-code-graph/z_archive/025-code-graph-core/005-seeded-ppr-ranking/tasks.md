---
title: "Task Breakdown: Code-Graph Seeded-PPR Impact Ranking (Q3-C1 cluster)"
description: "Per-candidate task breakdown for the Code Graph seeded-PPR impact-ranking cluster. Q3-C1 bounded PPR, the query-class gate, undirected projection and Q4-C2 transition decay are implemented behind the default-off SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING flag. Benchmark-quality/tuning and invalid_at current-set semantics remain gated. lexical-vector-seed-union is CUT."
trigger_phrases:
  - "seeded ppr impact ranking tasks"
  - "q3-c1 cluster tasks"
  - "code graph personalized pagerank tasks"
  - "class gated expansion taxonomy tasks"
  - "027 weighted walk reuse tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/025-code-graph-core/005-seeded-ppr-ranking"
    last_updated_at: "2026-06-19T08:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented seeded-PPR mechanism default-off and updated task evidence"
    next_safe_action: "Run strict validation and keep default enablement blocked on a retrieval benchmark"
    blockers:
      - "Ranking-quality claim + parameter values blocked on a code-graph retrieval benchmark"
      - "invalid_at current-set semantics blocked on a separate schema migration"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-005-seeded-ppr-ranking-replan"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Code-Graph Seeded-PPR Impact Ranking (Q3-C1 cluster)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

**Candidate status legend**: the mechanism candidates (`Q3-C1`, `Q3-C1-seeded-PPR`, `CG-class-gated-expansion`, `CG-undirected-projection`, `Q4-C2`) are **DONE behind a default-off flag**. Ranking-quality benefit and parameter VALUES are **PENDING** on a code-graph retrieval benchmark. `invalid_at` current-set semantics are **PENDING** on a separate schema migration. `CG-lexical-vector-seed-union` is **CUT (NO-GO)**, the code-graph deliberately disowned its semantic/vector backend.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Plan-time confirmations + the 027-reuse gate, the active work this phase.

- [x] T001 Confirm PPR is UNBUILT before building: `rg -niE 'pagerank|personaliz|teleport|damping|\bppr\b|random.?walk' .opencode/skills/system-code-graph/mcp_server` returns ZERO hits (spec §2, re-grepped at plan time), establishing this is a net-new build, not a wiring of a dormant helper
- [x] T002 Confirm 027's reuse target EXISTS: `collectWeightedWalk`/`collectCausalWeightedNeighbors` present in `system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts` (the weighted-walk substrate PPR drives, plan.md §3, ADR-001)
- [x] T003 Correct the roadmap caveat: the "old PageRank helper never wired" line does NOT hold against the live tree, there is NO PageRank helper in either MCP (`rg pagerank` empty in both `lib/graph/`). The real reuse target is the weighted-walk substrate, not a dormant helper (spec §2 plan-time correction)
- [x] T004 Confirm the out-of-cluster sibling: Q4-C1 RRF-additive trust blend SHIPPED in Wave-0 (commit `e21caf5de6`, `code-graph-context.ts:350-356`). Q4-C2 here REUSES its `reliability` factor as a transition weight, it does not re-implement the blend (spec §3 Out of Scope)
- [x] T005 Reuse-confirmation gate: `collectWeightedWalk` accepts generic string/number nodes plus a caller-provided weighted edge reader. Code-graph consumes the built Memory artifact with a code-graph edge adapter, no Memory source edits and no forked traversal helper
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Net-new BUILD, the Q3-C1 PPR core lands first, then its refinements.

### Candidate: Q3-C1 + Q3-C1-seeded-PPR (the net-new ranking core, L→M / L), DONE mechanism, default-off, benchmark tuning pending
- [x] T010 Build the bounded PPR primitive: `computeBoundedPersonalizedPageRank` seeds subject symbols, uses weighted transitions, hard-caps iterations and returns best-so-far scores under the cap
- [x] T011 Spread PPR mass over 027's REUSED `collectWeightedWalk` traversal via the Memory MCP built artifact, no second graph-walk engine authored
- [x] T012 Wire the impact path to PPR-score ordering when `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING=true`. With the flag off, the flat path remains byte-identical
- [x] T013 Bound PPR inside the existing impact deadline using a fixed iteration cap plus deadline checks. Budget cuts return already sorted PPR prefixes
- [x] T014 Intersect the PPR-reached set with physically present `code_edges`. The `invalid_at IS NULL` upgrade remains PENDING because it requires the separate temporal-edge schema migration

### Candidate: CG-class-gated-expansion (the precision gate, H / M), DONE
- [x] T020 Add a SingleHop/MultiHop/Entity/ambiguous query-class taxonomy to `query-intent-classifier.ts`
- [x] T021 Gate PPR/expansion ON for impact/multi-hop modes, OFF for single-hop neighborhood/outline. Ambiguous class fails PPR-OFF
- [x] T022 [P] The single-hop path short-circuits before any PPR walk. A regression test covers flag-enabled neighborhood behavior

### Candidate: CG-undirected-projection (the directionality fix, M / S), DONE mechanism, benchmark quality pending
- [x] T030 Project the flagged PPR working graph undirected so seed mass reaches callers. Projection quality remains benchmark-gated while the flag is default-off
- [x] T031 [P] Preserve the directed reverse-edge semantics for the non-PPR flat walk. Undirected projection is PPR-path-only

### Candidate: Q4-C2 multi-hop reliability decay (M / M), DONE mechanism, calibration pending
- [x] T040 Reuse confidence/evidence reliability in PPR transition weights so an INFERRED 2-hop path ranks below an OBSERVED 1-hop path in deterministic tests
- [x] T041 [P] Neutral default: an edge with no trust metadata keeps its structural transition weight, no demotion from absent metadata

### Candidate: CG-lexical-vector-seed-union, CUT (NO-GO)
- [x] T050 Record CG-lexical-vector-seed-union as CUT / NO-GO in decision-record.md: the vector half does not exist and adding it remains a scope violation, not deferred work
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Phase 2 builds are implemented behind a default-off flag. Benchmark-quality and schema-migration claims stay pending.

- [x] T060 Property test: PPR always terminates by the iteration cap, `code-graph-seeded-ppr-ranking.vitest.ts`
- [x] T061 Property test: gate totality, every query routes PPR-ON or PPR-OFF, ambiguous class ⇒ PPR-OFF, `query-intent-classifier.vitest.ts`
- [x] T062 Regression test: single-hop neighborhood/outline output stays on the flat path when the flag is enabled. Broad suite confirms default flag-off behavior
- [x] T063 Unit test: undirected projection lets a flagged PPR impact query return multi-hop callers
- [x] T064 Unit test: Q4-C2 decay ranks an INFERRED 2-hop path below an OBSERVED 1-hop path
- [x] T065 Reuse-confirmation assertion: the spread runs over 027's `collectWeightedWalk` built artifact, no second traversal helper added
- [x] T066 Record the benchmark caveat: PPR ranking QUALITY + damping/cap/decay parameter VALUES are gated on a code-graph retrieval benchmark. The mechanism ships default-off
- [x] T067 Typecheck + broad related code-graph suite green
- [x] T068 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exit 0 (0 errors, 0 warnings)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Plan-time confirmations recorded and updated after implementation. BUILD candidates marked DONE mechanism/default-off with benchmark gates where applicable
- [x] `validate.sh --strict` passes on this folder (T068)
- [x] Refinement tasks started only after Q3-C1 core landed in the same patch
- [x] CG-lexical-vector-seed-union recorded CUT / NO-GO (T050), nothing silently dropped
- [x] All build tasks unblocked in dependency order, PPR termination + gate-totality property tests green, single-hop gate regression green, benchmark caveat recorded (T066)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research**: `../research/research.md` (Internal Baseline + iter-2 findings 12-14, iter-3 Q4-C2, iter-8 undirected-projection, iter-14 PPR-unbuilt + NO-GO). Plus `../../research/roadmap.md` (§3 Query-Class Routing + BROADENING §2) and `../../research/synthesis/{01-go-candidates.md, 03-corrections-caveats-and-residuals.md, 04-sibling-and-cross-cutting.md}`
- **Shipped evidence**: Wave-0 record (Code Graph shipped Q4-C1 trust blend only `e21caf5de6`, and Q3-C1 seeded PPR was explicitly Wave-2 Out of Scope / NO-GO)
- **Reused substrate (consumed, not modified)**: 027 Memory MCP `lib/graph/bfs-traversal.ts` `collectWeightedWalk`/`collectCausalWeightedNeighbors`
- **Sibling (consumed)**: `../001-determinism-walk-order/` (Q4-C1 `reliability` factor that Q4-C2 reuses)
<!-- /ANCHOR:cross-refs -->
