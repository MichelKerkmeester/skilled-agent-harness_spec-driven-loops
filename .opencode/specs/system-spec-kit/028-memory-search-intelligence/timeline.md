---
title: "Chronological Timeline [system-spec-kit/028-memory-search-intelligence/timeline]"
description: "Chronological build sequence of packet 028 memory-search-intelligence: the flat 030 Wave-0 spearhead, the re-plan into a phased five-track program, the dependency-ordered implementation waves, the eval and benchmark harness extension and the linked per-phase changelog generation."
trigger_phrases:
  - "028 timeline"
  - "028 build sequence"
  - "028 commit order"
  - "memory search intelligence chronology"
  - "which 028 phase shipped when"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence"
    last_updated_at: "2026-06-19T00:00:00Z"
    recent_action: "Refreshed the chronological build timeline to cover the full 028 program"
    next_safe_action: "Use this file to trace what shipped when and in which commit across the four subsystems"
    completion_pct: 100
---
# 028 Chronological Timeline

> **Sort key:** git commit order on `system-speckit/028-memory-search-intelligence`, oldest to newest.
> This is the literal sequence the work landed in, not the candidate or phase numbering from the specs.
>
> **What this packet did.** It turned a long external memory-system research campaign into shipped
> retrieval intelligence across four subsystems. The work landed in two epochs. The flat 030 Wave-0
> shipped the ship-ready spearhead first. Then the rest of the roadmap was re-planned into a phased
> five-track program under 028 and built in dependency-ordered waves, every shipped change additive,
> reversible and default-safe, none with a measured benefit number.
>
> **Where the truth lives.** The 030 Wave-0 done-evidence is recorded under
> the Wave-0 implementation record. The per-subsystem phase rosters live in each track's
> `changelog-00N-root.md` rollup. The before-and-after narrative is in
> [`before-vs-after.md`](./before-vs-after.md). The dependency order is in
> [`implementation-schedule.md`](./implementation-schedule.md).

---

## 0. The two epochs

```
Epoch one  --  the flat 030 Wave-0 spearhead
 738e118751  fix(deep-research)  reducer anchor markers (foundation)
 484b77b589  feat(memory-search) graceful embedder degrade
 bec0eed27f  feat(memory-search) ANN + RRF deterministic tiebreaks
 e1c6a3c793  feat(memory)        constitutional CAS guard + enrichment gauges + skip-closed sweep
 1c065566fa  docs(030)           reconcile status (candidate 11 dropped)
 65cfcea513  feat(memory-search) RRF bonus-denominator option + rank-time decay clock
 18c8582e33  refactor(memory)    centralized content-id module
 46812f12a8  feat(deep-loop)     merge order + pool gauges + graceful self-stop
 e21caf5de6  feat(code-graph)    RRF-additive rank-time trust
 ab5459fb6d  docs(030)           full-scope Wave-0 implementation record docs + closeout

Bridge  --  Wave-0 cleanup on the 028 branch
 9afbf97b75  docs(030)           027-style Wave-0 changelog/before-after/timeline + README alignment
 1b87f90411  test(memory)        stress the graceful embedder-degrade path under a recall flood
 019580f298  docs+fix(028)       align stale code READMEs + strip pre-existing artifact-ID comments
 e7ff843e1c  chore(028)          commit drifted spec-description metadata

Epoch two  --  the phased 028 program
 52e3060752  docs(028)           re-plan implementation as phased children inside 028
 7db9013386  fix(028)            correct re-plan structure to a single-numbered four-phase tree
 a08f371e58  docs(028)           add the dependency-ordered build schedule
 99bfa4427d  feat(028)           first wave: render escaper, generation watermark, lane-health, continuity
 b18c077311  feat(028)           wave two: doc-symbol lane, enrichment lag gauge
 7e32c14d5d  feat(028)           residual-correctness (absolute-relevance avg + maintenance TTL)
 d210947626  feat(028)           gate-zero embedding-coverage guard + coverage finding
 cfcc0cd5b5  feat(028)           eval-harness extension (corpus metric lanes)
 c1f2466811  feat(028)           code-graph edge-staleness + deep-loop fanout-failure-recovery
 47ed46dbdb  docs(028)           scaffold the release-cleanup phase parent (nine doc-surface children)
 ce858fa165  feat(028)           skill-advisor RRF determinism spine (default-off)
 f038ff140e  feat(028)           class-routing, walk-order determinism, embedding-staleness, stop-corroboration
 fd30af2cb6  feat(028)           redteam-probe, parser-resilience, provenance-drift, fanout-determinism
 657a0f6a3e  feat(028)           summary-fusion, seeded-PPR, conflict-rerank (all default-off)
 cd6678a7a9  docs(028)           document the extended eval/benchmark harness + command access
 b1d6ab80cd  docs(028)           generate the linked per-phase changelogs
```

---

## A. Epoch one: the flat 030 Wave-0 spearhead

The packet opened by shipping the ship-ready candidates the broadening pass confirmed were additive,
reversible and safe without a schema migration or a measured baseline. Eleven of thirteen candidates
landed as scoped commits from `738e118751` through `ab5459fb6d`. The reducer anchor fix came first as
the foundation, then graceful embedder degrade, the ANN and RRF deterministic tiebreaks, the
constitutional CAS guard with the enrichment gauges and skip-closed sweep, the RRF bonus and decay
knobs, the centralized content-id module, the Deep Loop merge order with pool gauges and graceful
self-stop and the Code Graph RRF-additive trust blend.

Two candidates dropped mid-sequence once their evidence came in. The system-kind recall exclusion was
pulled inside `e1c6a3c793` and recorded by `1c065566fa` after a live-database review found
`source_kind='system'` is 9,592 canonical spec-docs including 29 constitutional rules rather than
substrate noise. The idempotency default-on flip never committed at all because it broke eleven
update-path tests. The full Wave-0 chronology and verification live in
the Wave-0 implementation record.

A short bridge followed on the 028 branch. `9afbf97b75` authored the 027-style Wave-0 changelog and
before-after and timeline, `1b87f90411` stressed the embedder-degrade path under a recall flood,
`019580f298` aligned stale code READMEs and stripped pre-existing artifact-ID comments and `e7ff843e1c`
committed drifted spec-description metadata.

---

## B. The re-plan into a phased 028

`52e3060752` re-planned the rest of the roadmap. Instead of one more flat wave, the remaining
candidates became phased children under 028, organized into five tracks: Spec-Kit Memory MCP, Code
Graph, Skill Advisor, Deep Loop and a release-cleanup track. `7db9013386` corrected the structure into a
single-numbered four-subsystem tree, and `a08f371e58` added the dependency-ordered build schedule that
reads every implementation child spec and plan and orders the phases into tiers by what each one
depends on. That schedule named the recommended first wave: run gate-zero first and start the
low-dependency correctness work in parallel.

---

## C. The implementation waves

The build then ran in dependency order, one phase group per commit, each following the same loop: read
the seam, implement against it, add focused tests, run typecheck and the touched suite and reconcile the
packet docs.

### 1. `99bfa4427d` first wave

Four low-dependency phases landed together: the Memory recall-to-render trust escaper, the Code Graph
generation watermark, the Skill Advisor runtime lane-health degrade and the Deep Loop continuity
threading. This wave closed the highest-risk trust boundary and the hard advisor P0 in one pass.

### 2. `b18c077311` wave two

The Code Graph doc-symbol lane and the Memory enrichment lag gauge. The doc lane became queryable
heading and config-key nodes, and the enrichment health block gained an oldest-pending lag beside the
shipped pending and failed gauges.

### 3. `7e32c14d5d` residual correctness

The two always-on Memory correctness residuals: routing the search-score average through the calibrated
absolute-relevance scale and deriving the maintenance-marker TTL from the owner-lease constants.

### 4. `d210947626` gate-zero

The corpus-reindex embedding-coverage guard at the ablation pre-flight, fail-closed below full coverage
of the unique golden parent IDs. This is the gate the whole recall-measurement chain depends on, so it
landed before the harness that consumes it.

### 5. `cfcc0cd5b5` eval-harness extension

The single-pass diagnostic emit, the three-way label tagging and the three corpus metric lanes for
gate-verdict confusion, calibration and cold-tier precision. The per-class promotion gate was left
pending behind its benchmark.

### 6. `c1f2466811` edge-staleness and fanout-failure-recovery

Two phases across two subsystems: the Code Graph dependency-transitivity correctness fix with the
additive SUPERSEDES rename-lineage edge, and the Deep Loop fanout failure recovery with its bounded
failure class, transient and fatal classifier, durable retry budget and resume gate.

### 7. `47ed46dbdb` release-cleanup scaffold

The fifth track landed as a phase-parent scaffold with nine documentation-surface child phases, all
PENDING, defining cleanup scope only.

### 8. `ce858fa165` advisor RRF spine

The Skill Advisor RRF determinism spine, default-off behind its flag, importing the Memory fuser rather
than forking RRF.

### 9. `f038ff140e` four phases

The Memory retrieval-class routing, the Code Graph walk-order determinism, the Skill Advisor
embedding-staleness signal and the Deep Loop stop-input corroboration.

### 10. `fd30af2cb6` four phases

The Memory red-team probe gate, the Code Graph parser resilience, the Skill Advisor
provenance self-boost guard and the Deep Loop fanout determinism Wave-1 tail.

### 11. `657a0f6a3e` three default-off phases

The last code wave: the Memory summary-fusion shadow lane, the Code Graph seeded-PPR ranking and the
Skill Advisor conflict re-rank, query-class routing and exact semantic rerank, all default-off.

> Across `99bfa4427d` through `657a0f6a3e`, twenty-three implementation phases shipped code. Their
> always-on members are correctness fixes and their ranking-adjacent members ship default-off or
> byte-identical-by-default, matching the Wave-0 discipline.

---

## D. Documentation and changelog generation

`cd6678a7a9` documented the extended eval and benchmark harness and how it is reached from the command
surface, recording the corpus metric lanes, the coverage gate and the calibration measurement path that
the eval phases added. `b1d6ab80cd` generated the linked per-phase changelogs in the 027 pattern: one
leaf changelog per shipped phase under each track's `changelog/` directory, a per-track
`changelog-00N-root.md` rollup and the packet root `changelog-028-root.md`. The index for that tree is
[`changelog/README.md`](./changelog/README.md).

---

## E. What shipped versus what is gated

The shipped set is recorded above and detailed in [`before-vs-after.md`](./before-vs-after.md). The
gated set resolves into three gate classes. Schema-migration holds the Memory bitemporal window,
derived-id provenance, semantic edge layer and the Code Graph code-edge bitemporal and edge-governance
clusters. Needs-benchmark holds the seeded-PPR tuning, the Q4-C1 magnitudes, the advisor RRF,
query-class and exact-rerank live flips, the reliability-weighted convergence cluster, the eval
calibration A/B and the retention and forgetting work. The shared-infrastructure chain holds the work
waiting on the Memory consolidation-cursor clock, the durable advisor calibration substrate and the
shared Beta posterior. Two roadmap rows are deferred on evidence, the system-kind exclusion and the
idempotency default-on flip, and two are recorded as NO-GO or DEFER-speculative, the lexical-vector seed
union and the as-of-generation hard gate. None of the gated work shipped on a structural guess.
