---
title: "Task Breakdown: Code-Graph Seeded-PPR Impact Ranking (Q3-C1 cluster)"
description: "Per-candidate task breakdown for the net-new Code Graph seeded-PPR impact-ranking cluster — every BUILD candidate is PENDING (PPR is UNBUILT, grep-confirmed; none shipped in 030). The active tasks this phase are the plan-time confirmations (PPR-unbuilt, 027-substrate-exists, Q4-C1-shipped-out-of-cluster); all implementation tasks are gated behind the Q3-C1 PPR core landing first; lexical-vector-seed-union is CUT (NO-GO)."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/005-seeded-ppr-ranking"
    last_updated_at: "2026-06-19T08:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author seeded-PPR task breakdown from 028/002 research"
    next_safe_action: "Confirm 027 collectWeightedWalk reuse, then build bounded PPR core"
    blockers:
      - "Refinements (class-gate, undirected, Q4-C2) blocked on the Q3-C1 PPR core"
      - "Ranking-quality claim + parameter values blocked on a code-graph retrieval benchmark"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-005-seeded-ppr-ranking-replan"
      parent_session_id: null
    completion_pct: 0
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

**Candidate status legend**: the 4 BUILD candidates (`Q3-C1`, `Q3-C1-seeded-PPR`, `CG-class-gated-expansion`, `CG-undirected-projection`, `Q4-C2`) = **PENDING (net-new BUILD, gated)**. PPR is **UNBUILT** — `rg pagerank|personaliz|teleport|damping|ppr|random-walk` over the live `system-code-graph/mcp_server/` returns ZERO hits (re-confirmed at plan time). None shipped in 030 (030 §3 Out of Scope + §14: Code Graph shipped Q4-C1 trust blend only, commit `e21caf5de6`; Q3-C1 seeded PPR explicitly listed Wave-2 Out of Scope / NO-GO). `CG-lexical-vector-seed-union` = **CUT (NO-GO)** — the code-graph deliberately disowned its semantic/vector backend; recorded so nothing is silently dropped, not deferred. The refinements (class-gate, undirected, Q4-C2) are `[B]` Blocked on the Q3-C1 PPR core landing first (iter-14: they "refine a non-existent feature"); the ranking-quality claim + parameter VALUES are blocked on a code-graph retrieval benchmark that does not exist campaign-wide.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Plan-time confirmations + the 027-reuse gate — the active work this phase.

- [x] T001 Confirm PPR is UNBUILT before building: `rg -niE 'pagerank|personaliz|teleport|damping|\bppr\b|random.?walk' .opencode/skills/system-code-graph/mcp_server` returns ZERO hits (spec §2; re-grepped at plan time) — establishes this is a net-new build, not a wiring of a dormant helper
- [x] T002 Confirm 027's reuse target EXISTS: `collectWeightedWalk`/`collectCausalWeightedNeighbors` present in `system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts` (the weighted-walk substrate PPR drives; plan.md §3, ADR-001)
- [x] T003 Correct the roadmap caveat: the "old PageRank helper never wired" line does NOT hold against the live tree — there is NO PageRank helper in either MCP (`rg pagerank` empty in both `lib/graph/`); the real reuse target is the weighted-walk substrate, not a dormant helper (spec §2 plan-time correction)
- [x] T004 Confirm the out-of-cluster sibling: Q4-C1 RRF-additive trust blend SHIPPED in Wave-0 (commit `e21caf5de6`, `code-graph-context.ts:350-356`); Q4-C2 here REUSES its `reliability` factor as a transition weight, it does not re-implement the blend (spec §3 Out of Scope)
- [ ] T005 Reuse-confirmation gate: read the `collectWeightedWalk`/`collectCausalWeightedNeighbors` signatures and confirm the node/edge shapes are reusable from the code-graph context path, or define the minimal adapter — the gate FAILS CLOSED (Q3-C1 blocked + escalated, NOT silently forked) if not reusable (REQ-001; spec §8 Error Scenarios; ADR-001)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Net-new BUILD — the Q3-C1 PPR core lands first, then its refinements.

### Candidate: Q3-C1 + Q3-C1-seeded-PPR (the net-new ranking core, L→M / L) — PENDING (gated: 027-reuse + needs-benchmark)
- [ ] T010 [B] Build the bounded PPR primitive: seed vector on the subject symbol(s), teleport weighted by static edge weights (`config-defaults.ts:45-59`) × `metadata.confidence`, power-method with a hard iteration cap, best-first ordering by PPR score (`code-graph-context.ts`, new primitive) — BLOCKED on T005 reuse gate (REQ-001)
- [ ] T011 [B] Spread PPR mass over 027's REUSED `collectWeightedWalk` traversal — do NOT author a second graph-walk engine (`system-spec-kit/.../lib/graph/bfs-traversal.ts`, consume only) — BLOCKED on T005 (REQ-001; ADR-001)
- [ ] T012 [B] Replace the flat DB-order impact enumeration with PPR-score ordering (`code-graph-context.ts:668-676`); a budget cut returns the best PPR-ranked prefix, never arbitrary DB order — BLOCKED on T010 (REQ-001)
- [ ] T013 [B] Bound PPR inside the existing 400ms `expandAnchor` budget (`code-graph-context.ts:401-403`, `budgetMs=400`); the iteration cap is the hard guard — BLOCKED on T010 (REQ-002)
- [ ] T014 [B] Intersect the PPR-reached set with the current edge set; degrade to physical-edge-presence because `invalid_at`/`valid_at` do NOT exist on `code_edges` today (Q1-C1 DEFER-speculative, separate sub-phase); wire `invalid_at IS NULL` ONLY once Q1-C1 lands — BLOCKED on T012 (REQ-006)

### Candidate: CG-class-gated-expansion (the precision gate, H / M) — PENDING (gated: needs new taxonomy + Q3-C1 core)
- [ ] T020 [B] Add a SingleHop/MultiHop/Entity query-class taxonomy to `query-intent-classifier.ts` — the live classifier emits only `QueryIntent='structural'` and disowned its semantic backend (`:6,:82-92`), so the taxonomy must be built (REQ-003) — BLOCKED on T010 (refines the unbuilt core)
- [ ] T021 [B] Gate PPR/expansion ON for impact/multi-hop modes, OFF for the single-hop neighborhood/outline default (the aionforge precision lesson, `retrieval.md:108-118`); an ambiguous/neutral class ⇒ PPR-OFF (fail-safe toward precision) — BLOCKED on T020 (REQ-003; spec §8)
- [ ] T022 [B] [P] The single-hop path short-circuits BEFORE any walk (zero PPR cost; cheap default byte-identical to today) — BLOCKED on T021 (NFR-P02)

### Candidate: CG-undirected-projection (the directionality fix, M / S) — PENDING (gated: needs-benchmark + Q3-C1 core)
- [ ] T030 [B] Project the PPR graph UNDIRECTED so seed mass reaches callers (a directed PPR seeded on a leaf symbol under-reaches its blast radius — mass sinks) (`code-graph-context.ts:512`/`:668-676`) — BLOCKED on T010 (REQ-004)
- [ ] T031 [B] [P] Preserve the directed reverse-edge semantics for the NON-PPR flat walk (the undirected projection is PPR-path-only) — BLOCKED on T030 (REQ-004; spec §6 NFR-R01)

### Candidate: Q4-C2 multi-hop reliability decay (M / M) — PENDING (gated: needs Q3-C1 core)
- [ ] T040 [B] Reuse the rank-time `reliability = clamp(metadata.confidence) × evidenceClassFactor` factor (already plumbed at `code-graph-context.ts:350-356`, Q4-C1) as the per-edge PPR transition weight so an INFERRED 2-hop path ranks below an OBSERVED 1-hop path — BLOCKED on T010 (REQ-005)
- [ ] T041 [B] [P] Neutral default: an edge with no trust metadata keeps its structural transition weight (`reliability` defaults to `1.0`/`null`-safe) — no demotion from absent metadata — BLOCKED on T040 (spec §8 Data Boundaries)

### Candidate: CG-lexical-vector-seed-union — CUT (NO-GO)
- [ ] T050 Record CG-lexical-vector-seed-union as CUT / NO-GO in decision-record.md (ADR-003): the lexical seed half exists (disabled fallback) but the VECTOR half does NOT — the code-graph module explicitly disowned its semantic backend (`seed-resolver.ts`; `query-intent-classifier.ts:82-92`); a vector-seed union is a scope violation, NOT a deferred gap (REQ-007; iter-14 NO-GO)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Blocked on the Phase 2 builds; the doc-validation gate is active this phase.

- [ ] T060 [B] Property test: PPR always terminates by the iteration cap, inside the 400ms budget; a budget cut returns the best PPR-ranked prefix (never loops, never blows the budget) (REQ-002; SC-003)
- [ ] T061 [B] Property test: gate totality — every query routes to PPR-ON or PPR-OFF; an ambiguous class ⇒ PPR-OFF (REQ-003; SC-002)
- [ ] T062 [B] Regression test: single-hop neighborhood/outline output is BYTE-IDENTICAL to the captured baseline (the mode-gate guarantee) (REQ-003; NFR-P02; SC-002)
- [ ] T063 [B] Unit test: undirected projection — a leaf seed reaches its blast-radius callers (REQ-004; SC-001)
- [ ] T064 [B] Unit test: Q4-C2 decay — an INFERRED 2-hop path ranks below an OBSERVED 1-hop path via the reused `reliability` factor (REQ-005; US-004)
- [ ] T065 [B] Reuse-confirmation assertion: the spread runs over 027's `collectWeightedWalk` (no second walker authored) (REQ-001; SC-001)
- [ ] T066 [B] Record the benchmark caveat: PPR ranking QUALITY + the damping/cap/decay parameter VALUES are gated on a code-graph retrieval benchmark that does not exist campaign-wide; the mechanism ships with safe defaults, the quality claim does not (spec §2; ADR-002; SC-004)
- [ ] T067 [B] Typecheck + build + existing code-graph suite green; per-candidate adversarial review
- [ ] T068 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exit 0 (active this phase — validates the gated docs)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Plan-time confirmations recorded (Phase 1 active: PPR-unbuilt, 027-substrate-exists, roadmap-caveat-corrected, Q4-C1-shipped-out-of-cluster); all BUILD candidates marked PENDING with their gate
- [ ] `validate.sh --strict` passes on this folder (T068)
- [ ] No refinement task (class-gate / undirected / Q4-C2) started before the Q3-C1 PPR core lands (they refine a non-existent feature otherwise)
- [ ] CG-lexical-vector-seed-union recorded CUT / NO-GO (T050) — nothing silently dropped
- [ ] (IF built) all `[B]` tasks unblocked in dependency order; PPR termination + gate-totality property tests green; single-hop byte-identity regression green; benchmark caveat recorded (T066)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research**: `../research/research.md` (Internal Baseline + iter-2 findings 12-14, iter-3 Q4-C2, iter-8 undirected-projection, iter-14 PPR-unbuilt + NO-GO); `../../research/roadmap.md` (§3 Query-Class Routing + BROADENING §2); `../../research/synthesis/{01-go-candidates.md, 03-corrections-caveats-and-residuals.md, 04-sibling-and-cross-cutting.md}`
- **Shipped evidence**: `../../../030-memory-search-intelligence-impl/spec.md` §3 Out of Scope + §14 (Code Graph shipped Q4-C1 trust blend only `e21caf5de6`; Q3-C1 seeded PPR explicitly Wave-2 Out of Scope / NO-GO)
- **Reused substrate (consumed, not modified)**: 027 Memory MCP `lib/graph/bfs-traversal.ts` `collectWeightedWalk`/`collectCausalWeightedNeighbors`
- **Sibling (consumed)**: `../001-determinism-walk-order/` (Q4-C1 `reliability` factor that Q4-C2 reuses)
<!-- /ANCHOR:cross-refs -->
