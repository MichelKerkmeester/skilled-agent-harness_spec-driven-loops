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
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/006-rescue-layer-ranking-authority-decision"
    last_updated_at: "2026-07-03T12:00:00Z"
    last_updated_by: "planning-session"
    recent_action: "Framed ADR-001/002/003 with options, decision gates, and benchmark plan"
    next_safe_action: "Run verify-first tasks, then Part 1 parity, before executing the ADR-002 benchmark"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-006-rescue-layer-ranking-authority-decision"
      parent_session_id: null
    completion_pct: 0
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

We cannot decide the rescue layer's authority with the current eval harness, because the harness does not measure production. `handlers/eval-reporting.ts` exercises the legacy `hybridSearch()` monolith, which carries its own co-activation and truncation behavior, while production runs `executePipeline` (ledger Agent C contract note: "eval metrics != production executePipeline composition"). Two further defects make eval runs unsafe: the ablation DB swap at `eval-reporting.ts:138` restores the production DB but leaves `graphSearchFn` closed over the old, now-closed startup connection because `rebindDatabaseConsumers` reuses the stale reference, breaking the graph lane until restart and letting concurrent searches hit the eval DB (ledger Agent G P1, report §3 #25); and the eval DB path resolves against cwd, so runs from different directories measure different databases (phase-decomposition §006, G contract).

### Constraints

- Any ADR-002 verdict must come from numbers produced by the production composition, including production truncation (render floor K=3, the truncation law from the prior data-quality work: candidates below rank 3 are never seen).
- The legacy monolith keeps other production consumers; this phase must not rewrite it, only stop the eval harness from using it (monolith bug fixes belong to phases 007/010).
- Pre-parity eval history becomes incomparable; dashboards must not mix eras.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Route eval-reporting and ablation through `executePipeline` with prod-mode configuration, fix the restore rebind so every consumer including `graphSearchFn` binds to the restored connection, and resolve the eval DB path against the package root instead of cwd.

**How it works**: The eval harness calls the same public pipeline entry point production uses, with the same channel composition, co-activation, and truncation. A parity assertion test proves eval and production produce identical composition for the same query and stays in the vitest gate permanently. The ablation round-trip test proves the graph channel serves the restored production DB after a swap.
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
| Restore ordering still races concurrent searches | M | Round-trip test includes a concurrent-query case (spec.md §8) |
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
- `handlers/eval-reporting.ts`: pipeline routing, prod-mode truncation, root-anchored DB path (tasks T009, T011).
- `core/db-state.ts`: `rebindDatabaseConsumers` rebuilds the graph-channel binding on restore (task T010).
- Tests: parity assertion, ablation round-trip, two-cwd path resolution (task T012).

**How to roll back**: `git revert` the routing commit; the parity assertion test is removed in the same revert so the gate never asserts an unshipped contract. The rebind and path fixes are plain bug fixes and stay.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Rescue-Layer Ranking Authority (Option A vs B vs C)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (flips to Accepted with measured deltas from task T014; decision gates below select the winner) |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (operator); evidence: A/B/C benchmark on the ADR-001 parity harness |

---

<!-- ANCHOR:adr-002-context -->
### Context

Retrieval-rescue overwrites the final score of every candidate with `0.03*base + 0.78*lexicalOverlap` (`retrieval-rescue.ts:210`, applied at `stage2-fusion.ts:1425`, default ON). The 0.03 coefficient caps the entire upstream stack at 3.7% of blended score mass (0.03 of 0.81 total weight), so 13 documented signal steps (learned trigger boosts of +0.7 arrive as at most 0.021, negative demotions of x0.3, graph, recency, co-activation) are computed, logged in telemetry as applied, and then discarded (report Chain D "signal theater"; ledger Agent G P1). Only the validation multiplier at `stage2-fusion.ts:1470` runs after rescue and survives.

This is NOT a plain bug. The overwrite is deliberate 026 lexical-grounding-floor lineage, and existing tests encode it as intended behavior. The tension: stage2's own architecture doc (`stage2-fusion.ts:21` "SIGNAL APPLICATION ORDER (must not be reordered, 13 steps)" and `:1011`) still presents the upstream stack as the ranking authority, telemetry reports signals as applied, and downstream phases (007 bug battery, 009 learning loop, 010 performance) cannot be evaluated while the system's real ranking function is undocumented. Meanwhile a dead composite/interference battery burns O(folder^2) per write feeding a column nothing reads (report §3 #15, ledger Agent C P1), a cost only justifiable if the upstream stack becomes real.

We must choose one of three contracts and make code, tests, telemetry, and docs agree with it.

### Constraints

- Metric honesty: the benchmark scores prod-mode completeRecall@3, honoring the truncation law (production render floor K=3; a hit at rank 4 does not exist for the user).
- The 026 lineage is load-bearing: rescue was built to ground vector drift with lexical evidence; whichever option wins must not silently resurrect the failure class 026 fixed. The fixed query set includes 026-class queries.
- Program cross-cutting rule: behavior-changing ranking work ships flag-gated because this decision requires A/B; production defaults change only after Accepted.
- Benchmark validity depends on corpus repair (phases 001-005) landing first; results record corpus snapshot stats.
- Latency is recorded per variant but is NOT a decision gate (rescue's ~1.2s stage2 cost belongs to phase 010).
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: To bind the choice to measured evidence: the decision gates below select among Option A (lexical dominance IS the contract), Option B (rescue demoted to a bounded additive delta and/or injected-rows-only), and Option C (rescue as a floor only below a base-score threshold), using per-variant prod-mode completeRecall@3 deltas from the fixed query set on the parity harness.

**How it works**: Variants B and C ship behind flags with defaults unchanged (task T013). The benchmark (task T014) runs all three on identical corpus and query set. The gates:

1. **Gate B**: If Option B's completeRecall@3 is greater than or equal to Option A's on EVERY query class (no class drops beyond the noise floor of one query), choose B: the upstream stack becomes real.
2. **Gate C**: If Option B wins overall but regresses the 026-class or exact-token classes, choose C: the lexical floor keeps the 026 guarantee below the threshold while base ranking rules above it.
3. **Gate A**: If Option A is greater than or equal to both B and C across classes, choose A: declare lexical dominance the contract, then delete or no-op the neutered upstream steps and their write-path costs honestly.
4. **Tie policy**: At equal measured recall, the simplest honest system wins: A (fewest live moving parts) over C over B.

The record flips from Proposed to Accepted by appending the measured per-variant table and naming the satisfied gate (task T015).
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A: Lexical dominance as contract** | Honors 026 intent exactly; simplest runtime (13 neutered steps deleted or no-opped); kills the dead battery and its O(folder^2) write tax outright; docs become trivially true | Learned feedback, graph, recency, and co-activation can never influence ranking; phase 009's learning loop has no ranking outlet; conceptual zero-overlap queries rank by 0.03*base alone | pending benchmark |
| B: Bounded additive delta / injected-rows-only | 13-step stack becomes real; learned boosts and demotions actually rank; rescue still grounds injected rows; telemetry stops lying by construction | Highest regression risk for the 026 failure class; most machinery to keep honest; upstream stack inherits phase 007's unfixed bugs until that phase lands | pending benchmark |
| C: Floor only below base-score threshold | Preserves the 026 guarantee where vector evidence is weak; restores upstream authority where evidence is strong; bounded blast radius | Threshold is a new tunable with its own drift risk; two ranking regimes to document and test; boundary behavior needs its own edge cases | pending benchmark |
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
- This record: measured per-variant table appended, satisfied gate named, status flipped to Accepted.

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

Stage2 drifted into signal theater once already: the 13-step header says "must not be reordered" while runtime authority lives at the rescue apply site, and telemetry reports signals as applied that the blend then discards. Nothing structural prevents the next contributor from adding step 14 on the discarded side. Separately, `composite-scoring.ts` and `interference-scoring.ts` have zero production callers (their only importer, `attention-decay.ts`, is itself dead), `memory-search.ts:711` hardcodes `interferenceApplied:false`, and the interference recompute runs O(folder^2) Jaccard inside every insert/update transaction to feed a column nothing reads (report §3 #15; ledger Agent C P1).

### Constraints

- The contract test must assert the ACCEPTED contract from ADR-002, whichever option wins; it is parameterized by the decision, not hardcoded to today's behavior.
- Comment-hygiene HARD BLOCK: the encoded contract carries the durable WHY, never finding IDs or packet numbers, in code.
- Phases 009 (learning loop) and 010 (write-path performance) have adjacent expectations; deletion requires a cross-check against the decomposition map first.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Encode the signal-ordering contract as a permanent vitest-gate test (any ranking-relevant step runs after the rescue apply site or is folded into the accepted blend, with a documented tie policy), align the stage2 header (`stage2-fusion.ts:21`, `:1011`) and `lib/search/pipeline/README.md` with the accepted contract, and disposition the dead battery per the ADR-002 outcome: under Option A the battery and its write-path refresh are deleted; under B or C each module is either wired into the live contract with a real consumer or deleted, with the choice and reason recorded here.

**How it works**: The test derives the set of ranking-relevant steps from the accepted contract and fails when a step's output cannot influence final order and carries no explicit doc note (REQ-010). Doc alignment lands in the same commit as the accepted semantics so doc and behavior cannot diverge within the phase. The battery disposition is a separate commit for clean revert.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Contract test + doc alignment + gated disposition (chosen)** | Structural guarantee against theater recurrence; write tax ends; docs provably true | One more permanent gate test to maintain | 9/10 |
| Doc alignment only, no test | Cheap | The doc drifted once already with no alarm; guarantees nothing | 3/10 |
| Delete the battery immediately, before ADR-002 | Stops the O(folder^2) tax now | Pre-judges Option B (which might wire composite scoring); risks colliding with phase 009/010 expectations | 4/10 |
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
- Battery modules wired or deleted per gate outcome, including the write-path interference refresh (task T018).

**How to roll back**: Revert the disposition commit independently (battery returns, write tax returns, documented as accepted cost); revert the doc/test commit together so the gate never asserts a contract the code does not ship.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
