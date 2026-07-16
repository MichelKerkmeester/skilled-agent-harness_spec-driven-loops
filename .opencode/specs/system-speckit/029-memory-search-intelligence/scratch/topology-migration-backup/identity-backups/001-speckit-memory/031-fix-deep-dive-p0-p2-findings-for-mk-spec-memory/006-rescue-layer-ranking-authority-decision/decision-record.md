---
title: "Decision Record: Phase 6: Rescue-Layer Ranking Authority Decision"
description: "Three linked decisions: eval-production parity as a prerequisite (ADR-001), the rescue-layer ranking authority choice between lexical dominance as contract, bounded additive rescue, or floor-below-threshold (ADR-002, the phase centerpiece), and the signal-ordering contract test plus dead-battery disposition (ADR-003)."
trigger_phrases:
  - "rescue layer ranking authority"
  - "lexical grounding dominance"
  - "eval production parity"
  - "bounded additive rescue"
  - "rescue floor threshold"
  - "signal ordering contract"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/006-rescue-layer-ranking-authority-decision"
    last_updated_at: "2026-07-04T17:51:13.246Z"
    last_updated_by: "implementation-session"
    recent_action: "Recorded A/B/C benchmark; operator deferred ADR-002 (ship parity harness, re-benchmark clean)"
    next_safe_action: "Re-benchmark ADR-002 after vectors reconciled + eval ground truth refreshed"
    blockers:
      - "ADR-002 remains Proposed by operator instruction"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-006-rescue-layer-ranking-authority-decision"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 6: rescue-layer-ranking-authority-decision

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Eval-Production Parity Before Any Ranking Decision

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (operator), deep-dive remediation program |

---

<!-- ANCHOR:adr-001-context -->
### Context

We cannot decide the rescue layer's authority with the current eval harness, because the harness does not measure production. `handlers/eval-reporting.ts` exercises the legacy `hybridSearch()` monolith, which carries its own co-activation and truncation behavior, while production runs `executePipeline` (ledger Agent C contract note: "eval metrics != production executePipeline composition"). Two further defects make eval runs unsafe. First, `withAblationDb` (`eval-reporting.ts:150-189`) swaps the GLOBAL `vectorIndex` DB (`vectorIndex.closeDb()` then `vectorIndex.initializeDb(overrideDbPath)`), and `rebindDatabaseConsumers` reinitializes `hybridSearch` with the module-level `graphSearchFnRef` (`db-state.ts:102`, `:166`) instead of rebuilding the graph fn for the swapped connection, so after restore `graphSearchFn` stays closed over the old, now-closed startup connection, breaking the graph lane until restart; and because the swap is process-global, any concurrent production search reads the eval DB (ledger Agent G P1, report §3 #25). Routing eval through the production `executePipeline` makes this cross-read worse, not better, so parity requires an explicit isolation mechanism, not just a rebind. Second, the eval DB path resolves against cwd, so runs from different directories measure different databases (phase-decomposition §006, G contract).

### Constraints

- Any ADR-002 verdict must come from numbers produced by the production composition, including production truncation (render floor K=3, the truncation law from the prior data-quality work: candidates below rank 3 are never seen).
- The legacy monolith keeps other production consumers; this phase must not rewrite it, only stop the eval harness from using it (monolith bug fixes belong to phases 007/010).
- The ablation channel toggles (`ALL_CHANNELS` = vector/bm25/fts5/graph/trigger, `lib/eval/ablation-framework.ts:84-87`, currently mapped by `toHybridSearchFlags` onto the legacy hybrid path) must map onto `executePipeline`'s channel-enable config, or routing through the pipeline silently loses per-channel ablation.
- The global `vectorIndex` DB swap must be serialized against production searches (mutex/quiesce): no production search may run during the swap-and-restore window, and the swapped connection must rebuild its own `graphSearchFn`.
- Pre-parity eval history becomes incomparable; dashboards must not mix eras.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Route eval-reporting and ablation through `executePipeline` with prod-mode configuration (mapping the `ALL_CHANNELS` ablation toggles onto the pipeline's channel-enable config), make `rebindDatabaseConsumers` rebuild `graphSearchFn` per-connection via `createUnifiedGraphSearchFn(newDb)` rather than reusing the module-level `graphSearchFnRef`, guard the global `vectorIndex` DB swap with a mutex/quiesce so no production search runs against the eval DB during the swap window, and resolve the eval DB path against the package root instead of cwd.

**How it works**: The eval harness calls the same public pipeline entry point production uses, with the same channel composition, co-activation, and truncation; the ablation channel set is expressed as pipeline channel-enable config rather than legacy hybrid flags. A parity assertion test proves eval and production produce identical composition for the same query and stays in the vitest gate permanently. The ablation round-trip test proves the graph channel serves the restored production DB after a swap, and a concurrent-search case proves the quiesce prevents any eval-DB read.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Route eval through executePipeline (chosen)** | One composition, one truth; every future eval measures production; smallest honest fix | Pre-parity history invalidated; harness config must mirror prod defaults | 9/10 |
| Patch the monolith to mimic the pipeline | No harness rewiring | Two implementations drift forever; divergence is the root cause, mimicry preserves it | 2/10 |
| Build a bespoke third harness | Freedom to design ideal metrics | A third composition to keep honest; maximal drift surface | 1/10 |
| Decide ADR-002 without measurement | Fast | Violates the program's evidence rules; the decision would be folklore | 0/10 |

**Why this one**: The divergence between eval and production is itself a root-cause finding; any option that keeps two compositions alive re-creates the bug class.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- ADR-002 becomes decidable: benchmark deltas are production deltas.
- Ablation runs stop corrupting the live process (no closed-connection graph lane, no cross-reads of the eval DB).
- Eval results reproduce regardless of invocation directory.

**What it costs**:
- Historical eval numbers become legacy artifacts. Mitigation: label them pre-parity and never compare across the boundary.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Harness config drifts from prod defaults again | M | Parity assertion test in the permanent gate fails on drift |
| Restore ordering still races concurrent searches | M | Global-swap window guarded by a mutex/quiesce (no production search during swap); round-trip test includes a concurrent-query case that must observe zero eval-DB reads (spec.md §8) |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Report §7 Wave 2 item 11: eval must measure production before ranking decisions; ADR-002 is blocked without it |
| 2 | **Beyond Local Maxima?** | PASS | Four alternatives weighed, including keeping the monolith and skipping measurement |
| 3 | **Sufficient?** | PASS | Routing plus two bug fixes plus one permanent test; no new abstractions |
| 4 | **Fits Goal?** | PASS | Direct prerequisite of the phase centerpiece (ADR-002) and of phase 007's before/after evals |
| 5 | **Open Horizons?** | PASS | Every future eval, ablation, and benchmark inherits the parity guarantee |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `handlers/eval-reporting.ts`: pipeline routing with `ALL_CHANNELS`->pipeline channel-config mapping, prod-mode truncation, a mutex/quiesce around the global DB swap, root-anchored DB path (tasks T009, T011).
- `core/db-state.ts`: `rebindDatabaseConsumers` rebuilds `graphSearchFn` per-connection via `createUnifiedGraphSearchFn` on restore, not the module-level `graphSearchFnRef` (task T010).
- Tests: parity assertion (incl. channel-mapping), ablation round-trip with a concurrent-search isolation case, two-cwd path resolution (task T012).

**How to roll back**: `git revert` the routing commit; the parity assertion test is removed in the same revert so the gate never asserts an unshipped contract. The rebind and path fixes are plain bug fixes and stay.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Rescue-Layer Ranking Authority (Option A vs B vs C)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (benchmark complete; recommendation recorded; not flipped to Accepted per operator instruction) |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (operator); evidence: A/B/C benchmark on the ADR-001 parity harness |

---

<!-- ANCHOR:adr-002-context -->
### Context

Retrieval-rescue overwrites the final score of every candidate with `0.03*base + 0.78*lexicalOverlap` (`retrieval-rescue.ts:210`, applied at `stage2-fusion.ts:1425`, default ON). The 0.03 coefficient caps the entire upstream stack at 3.7% of blended score mass (0.03 of 0.81 total weight), so 13 documented signal steps (learned trigger boosts of +0.7 arrive as at most 0.021, negative demotions of x0.3, graph, recency, co-activation) are computed, logged in telemetry as applied, and then discarded (report Chain D "signal theater"; ledger Agent G P1). Only the validation multiplier at `stage2-fusion.ts:1470` runs after rescue and survives.

This is NOT a plain bug. The overwrite is deliberate 026 lexical-grounding-floor lineage, and existing tests encode it as intended behavior. The tension: stage2's own architecture doc (`stage2-fusion.ts:21` "SIGNAL APPLICATION ORDER (must not be reordered, 13 steps)" and `:1011`) still presents the upstream stack as the ranking authority, telemetry reports signals as applied, and downstream phases (007 bug battery, 009 learning loop, 010 performance) cannot be evaluated while the system's real ranking function is undocumented. Meanwhile the composite five-factor ranking surface (`applyCompositeScoring`/`calculateCompositeScore`) is dead (no production ranking caller), yet the interference recompute it belongs to still runs O(folder^2) Jaccard on every folder write (`vector-index-store.ts` `refresh_interference_scores_for_folder` -> `computeInterferenceScoresBatch`) to feed an `interference_score` column ranking never applies (`memory-search.ts:711` hardcodes `interferenceApplied:false`) (report §3 #15, ledger Agent C P1), a write-path cost only justifiable if the upstream stack becomes real.

We must choose one of three contracts and make code, tests, telemetry, and docs agree with it.

### Constraints

- Metric honesty: the benchmark scores prod-mode completeRecall@3 honoring the truncation law (production render floor K=3; a hit at rank 4 does not exist for the user), but completeRecall@3 alone cannot separate the variants: with the render floor at K=3 and typically <=3 gold docs per query it saturates at 1.0 for all three options. MRR and rank-position deltas are therefore primary discrimination metrics, not secondary color.
- The 026 lineage is load-bearing: rescue was built to ground vector drift with lexical evidence; whichever option wins must not silently resurrect the failure class 026 fixed. The fixed query set includes 026-class queries.
- Program cross-cutting rule: behavior-changing ranking work ships flag-gated because this decision requires A/B; production defaults change only after Accepted.
- Benchmark validity depends on corpus repair (phases 001-005) landing first; results record corpus snapshot stats.
- Latency is recorded per variant but is NOT a decision gate (rescue's ~1.2s stage2 cost belongs to phase 010).
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We recommend**: Option A, lexical dominance as the documented contract. The compact read-only production-pipeline benchmark favored the current overwrite mode over both B and C on the fixed query axes available in this live index snapshot. ADR-002 remains Proposed until the operator accepts the recommendation.

**How it works**: Variants B and C ship behind flags with defaults unchanged (task T013). The benchmark (task T014) runs all three on identical corpus and query set. Because completeRecall@3 saturates at the K=3 render floor, the gates decide on MRR and mean rank-position deltas first, with completeRecall@3 held as a no-regression floor (a variant may not drop completeRecall@3 below Option A on any class):

1. **Gate B**: If Option B's MRR and mean rank-position improve over Option A on the aggregate set with no completeRecall@3 regression on any query class (beyond the one-query noise floor), choose B: the upstream stack becomes real.
2. **Gate C**: If Option B wins on aggregate MRR/rank-position but regresses MRR or completeRecall@3 on the 026-class or exact-token classes, choose C: the lexical floor keeps the 026 guarantee below the threshold while base ranking rules above it.
3. **Gate A**: If Option A's MRR and rank-position are greater than or equal to both B and C across classes (no variant beats it beyond the noise floor), choose A: declare lexical dominance the contract, then delete or no-op the neutered upstream steps and their write-path costs honestly.
4. **Tie policy**: At statistically indistinguishable MRR and rank-position (and equal completeRecall@3), the simplest honest system wins: A (fewest live moving parts) over C over B.

The record does not flip from Proposed to Accepted in this pass because the operator explicitly requested a recommendation only. If the recommendation is accepted later, Gate A is the satisfied gate.

### Benchmark Evidence And Recommendation

**Run context**: 2026-07-03, read-only against a temporary backup of `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` plus its active vector shard `context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite`. The benchmark used production `executePipeline`, `SPECKIT_RERANK_LAYER=true`, `forceAllChannels=true`, `evaluationMode=true`, K=3 for the render-floor metric, and a limit of 20 for MRR/first-rank measurement.

**Fixed query axes**: resume-style, packet-status, verbose-conceptual, exact-token, and 026-class lineage query. Gold selectors matched the expected phase folder (`006-rescue-layer-ranking-authority-decision`) or the 026 lineage folder (`004-spec-memory-embedder-bake-off`).

| Variant | Mode | completeRecall@3 | Delta vs A | MRR | Delta vs A | Mean First Gold Rank | Delta vs A | Wall Time |
|---------|------|------------------|------------|-----|------------|----------------------|------------|-----------|
| A | current overwrite | 0.400000 | 0.000000 | 0.400000 | 0.000000 | 13.000000 | 0.000000 | 8193 ms |
| B | additive fold-in | 0.200000 | -0.200000 | 0.200000 | -0.200000 | 17.000000 | +4.000000 | 7410 ms |
| C | floor threshold | 0.200000 | -0.200000 | 0.200000 | -0.200000 | 17.000000 | +4.000000 | 7324 ms |

**Recommendation**: Choose A if/when ADR-002 is accepted. A satisfied Gate A: both alternatives lost on completeRecall@3 and MRR, and both pushed the mean first-gold rank four positions later. B and C did preserve the 026-class query at rank 1, but they collapsed the phase-local conceptual hit that A retrieved at rank 1.

**Caveats**: The official eval/ablation ground-truth run is blocked by stale relevance IDs (`missing relevances=142 across 128 IDs`). This compact benchmark is therefore a decision-support run over folder selectors, not a replacement for the repaired official eval corpus. The run also surfaced existing live-index schema warnings (`no such column: memory_state`, `no such table: community_members`) during Stage 2 community hydration; those were non-fatal and appeared on all variants.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A: Lexical dominance as contract** | Honors 026 intent exactly; simplest runtime (13 neutered steps deleted or no-opped); deletes the dead composite five-factor ranking surface and the O(folder^2) interference write tax outright (attention-decay's `activateMemory` stays; only its dependency on the deleted ranking surface is severed); docs become trivially true | Learned feedback, graph, recency, and co-activation can never influence ranking; phase 009's learning loop has no ranking outlet; conceptual zero-overlap queries rank by 0.03*base alone | recommended: 9/10 |
| B: Bounded additive delta / injected-rows-only | 13-step stack becomes real; learned boosts and demotions actually rank; rescue still grounds injected rows; telemetry stops lying by construction | Regressed completeRecall@3 and MRR by -0.2 in the compact benchmark; highest machinery cost; upstream stack inherits phase 007's unfixed bugs until that phase lands | measured: 4/10 |
| C: Floor only below base-score threshold | Preserves the 026 guarantee where vector evidence is weak; restores upstream authority where evidence is strong; bounded blast radius | Matched B's regression in the compact benchmark; threshold is a new tunable with drift risk; two ranking regimes to document and test | measured: 4/10 |
| Status quo (undocumented overwrite) | No work | Docs, tests, and telemetry disagree with runtime; every downstream ranking phase builds on sand; rejected without benchmark | 0/10 |

**Why this one**: Scoring A, B, and C without the parity benchmark would repeat the exact failure mode this phase exists to end: ranking beliefs unbacked by production measurement. The gates pre-commit the interpretation so the numbers cannot be argued into a preferred outcome after the fact.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- One documented ranking authority; stage2 docs, tests, and telemetry made truthful under any gate outcome.
- Downstream phases get a stable target: 007 fixes bugs in signals that provably matter (or skips signals that provably do not), 009 knows whether learning has a ranking outlet, 010 optimizes a contract instead of an accident.
- The write path stops paying for signals nothing reads (per ADR-003 disposition).

**What it costs**:
- A real benchmark cycle before any ranking work proceeds. Mitigation: fixed query set and flags make re-runs cheap (NFR-P01 target under 30 minutes).
- Under B or C, the 026 protection weakens or narrows. Mitigation: 026-class queries in the fixed set gate the choice; flag rollback restores Option A behavior instantly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Benchmark run before corpus repair completes, deltas measure rot | H | Sequence after phases 001-005; corpus snapshot stats recorded with results (R-001) |
| Option B/C re-introduces the 026 vector-drift failure class | H | Gate C exists for exactly this signature; flag-gated rollout; instant flag rollback |
| Gates produce a split verdict across classes not covered above | M | Record the split, choose the gate whose losing classes have the lowest query volume, and document the residual as an explicit doc note (REQ-010) |
| completeRecall@3 render-floor-saturates and cannot discriminate A/B/C | H | MRR and rank-position deltas are the primary gate metrics; this addresses metric POWER (a saturated metric), which is distinct from the query-set-SIZE risk below (a small sample). Fixing one does not fix the other |
| Fixed query set too small to separate variants | M | Gold labels pinned before implementation (T003); expand set and re-run rather than lower the bar |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Report §7: "Everything else in ranking is noise until this is decided"; phase-decomposition names 006 the decision that gates all ranking work |
| 2 | **Beyond Local Maxima?** | PASS | Three live options plus status quo framed; the dispatch-added Option C exists precisely because A and B are both local maxima for different query classes |
| 3 | **Sufficient?** | PASS | Flag-gated variants plus one fixed-set benchmark; no new ranking framework, no reranker, no learned combiner |
| 4 | **Fits Goal?** | PASS | Directly on the program's critical path (execution order places 006 before the 007-010 ranking batteries) |
| 5 | **Open Horizons?** | PASS | The gate structure and parity harness outlive the decision; future signal proposals must beat the accepted contract on the same harness |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `lib/search/rerank/retrieval-rescue.ts`: blend semantics per the accepted option (A: unchanged plus doc note; B: bounded additive delta and/or injected-rows-only; C: floor below threshold).
- `lib/search/pipeline/stage2-fusion.ts`: apply-site semantics at :1425 per the accepted option; the surviving-signal set matches the contract.
- Search flags: variant gating for the benchmark; after acceptance, defaults set to the winner and losing flags removed or documented.
- Rescue-dominance tests: updated to assert the accepted contract (no test may keep asserting a rejected option).
- This record: measured per-variant table appended and Gate A recommendation named; status remains Proposed until the operator accepts the recommendation.

**How to roll back**: Flip the variant flag back to Option A behavior (the current default) with no code change; revert the acceptance commit; return this ADR to Proposed with the failure evidence appended; the ADR-003 contract test reverts in the same commit so the gate matches shipped behavior.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Signal-Ordering Contract as a Test + Dead-Battery Disposition

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (contract-test requirement unconditional; battery disposition branch follows the ADR-002 outcome) |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (operator), deep-dive remediation program |

---

<!-- ANCHOR:adr-003-context -->
### Context

Stage2 drifted into signal theater once already: the 13-step header says "must not be reordered" while runtime authority lives at the rescue apply site, and telemetry reports signals as applied that the blend then discards. Nothing structural prevents the next contributor from adding step 14 on the discarded side. Separately, `composite-scoring.ts`'s five-factor RANKING surface (`applyCompositeScoring`/`calculateCompositeScore`) has zero production callers and is dead; but the module is NOT wholly dead: `attention-decay.ts` imports its sub-factor helpers (`calculateFiveFactorScore`, `calculateTemporalScore`, and siblings, `attention-decay.ts:25-34`) and `attention-decay.ts` is itself LIVE on the Gate-1 hot path (`memory-triggers.ts:626` calls `attentionDecay.activateMemory`). Likewise `interference-scoring.ts` is NOT callerless: `computeInterferenceScoresBatch` runs on the write path (`vector-index-store.ts` `refresh_interference_scores_for_folder`, reached from `vector-index-mutations.ts` on insert/update) as an O(folder^2) Jaccard recompute feeding an `interference_score` column ranking never applies (`memory-search.ts:711` hardcodes `interferenceApplied:false`) (report §3 #15; ledger Agent C P1). So the dead surface is the composite five-factor RANKING functions plus the interference write-path COMPUTE, not the three modules wholesale.

### Constraints

- The contract test must assert the ACCEPTED contract from ADR-002, whichever option wins; it is parameterized by the decision, not hardcoded to today's behavior.
- Comment-hygiene HARD BLOCK: the encoded contract carries the durable WHY, never finding IDs or packet numbers, in code.
- Phases 009 (learning loop) and 010 (write-path performance) have adjacent expectations; deletion requires a cross-check against the decomposition map first.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Encode the signal-ordering contract as a permanent vitest-gate test (any ranking-relevant step runs after the rescue apply site or is folded into the accepted blend, with a documented tie policy), align the stage2 header (`stage2-fusion.ts:21`, `:1011`) and `lib/search/pipeline/README.md` with the accepted contract, and disposition the dead surface per the ADR-002 outcome: under Option A the composite five-factor ranking surface (`applyCompositeScoring`/`calculateCompositeScore`) and the interference write-path compute (`vector-index-store.ts` `refresh_interference_scores_for_folder` -> `computeInterferenceScoresBatch`) are deleted, while `attention-decay.ts` and its `activateMemory` export survive intact (only its import of the deleted composite ranking surface is severed, keeping the Gate-1 trigger path working); under B or C each surface is either wired into the live contract with a real consumer or deleted on the same terms, with the choice and reason recorded here.

**How it works**: The test derives the set of ranking-relevant steps from the accepted contract and fails when a step's output cannot influence final order and carries no explicit doc note (REQ-010). Doc alignment lands in the same commit as the accepted semantics so doc and behavior cannot diverge within the phase. The disposition is a separate commit for clean revert, and any Option-A delete is verified to leave `attentionDecay.activateMemory` importable so `memory-triggers.ts:626` keeps working.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Contract test + doc alignment + gated disposition (chosen)** | Structural guarantee against theater recurrence; write tax ends; docs provably true | One more permanent gate test to maintain | 9/10 |
| Doc alignment only, no test | Cheap | The doc drifted once already with no alarm; guarantees nothing | 3/10 |
| Delete the battery immediately, before ADR-002 | Stops the O(folder^2) tax now | Pre-judges Option B (which might wire composite scoring); a naive wholesale delete of attention-decay/composite would break the Gate-1 trigger path (`memory-triggers.ts:626`); risks colliding with phase 009/010 expectations | 4/10 |
| Wire the battery unconditionally | Signals stop being dead | Adds ranking machinery before the authority decision; exactly backwards | 1/10 |

**Why this one**: A test is the only mechanism in this codebase that has actually prevented regressions; the disposition must follow the authority decision or it becomes a new source of theater.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Signal theater becomes a test failure instead of a deep-dive finding.
- Every write stops paying O(folder^2) for an unread column (measured delta recorded under CHK-112 when deleted).
- Future signal work has a named, enforced insertion point.

**What it costs**:
- The contract test must be updated whenever the contract legitimately changes. Mitigation: that is the point; contract changes should be loud and land through an ADR.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Test overfits to implementation internals instead of ordering invariants | M | Assert observable ordering outcomes and doc-note presence, not private call sequences (spec.md R-005) |
| Battery deletion breaks a phase 009/010 assumption | M | Cross-check phase-decomposition before delete (T018); disposition and pointers recorded here |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase success gate: "no signal computed-but-discarded without an explicit doc note"; the drift already happened once |
| 2 | **Beyond Local Maxima?** | PASS | Doc-only, delete-now, and wire-all alternatives weighed and rejected with reasons |
| 3 | **Sufficient?** | PASS | One test, one doc pass, one gated disposition; no new framework |
| 4 | **Fits Goal?** | PASS | Completes the phase deliverables (REQ-006/007/008/010) and hardens ADR-002's outcome |
| 5 | **Open Horizons?** | PASS | The contract test is the durable enforcement surface for all future ranking phases |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- New contract test in the mcp_server vitest gate (task T016).
- `stage2-fusion.ts` header rewrite (:21, :1011) and `pipeline/README.md` update (task T017).
- Composite five-factor ranking surface and interference write-path compute (`vector-index-store.ts` refresh) wired or deleted per gate outcome; `attention-decay.ts`/`activateMemory` preserved and its composite import severed cleanly (task T018).

**How to roll back**: Revert the disposition commit independently (ranking surface and write tax return, documented as accepted cost); revert the doc/test commit together so the gate never asserts a contract the code does not ship.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
