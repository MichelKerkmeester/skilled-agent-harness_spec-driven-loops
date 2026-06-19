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
    last_updated_at: "2026-06-20T00:00:00Z"
    recent_action: "Extended the chronological build timeline past commit 30 to cover the schema cluster, the release-cleanup executions, the criterion-4 benchmark run and the packet-030 deletion"
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
> **Where the truth lives.** The superseded 030 Wave-0 packet was deleted at `5ce5130b20`, so its
> done-evidence now lives in the per-track `changelog-00N-root.md` rollups and the before-and-after
> narrative rather than a standalone Wave-0 record. The per-subsystem phase rosters live in each
> track's `changelog-00N-root.md` rollup. The before-and-after narrative is in
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

Epoch two continued  --  the schema cluster, release-cleanup and the benchmark
 4aa6473b3f  docs(028)           refresh before-after + timeline + changelog index (last narrative refresh)
 0cf96409d8  feat(028)           memory 014 mem0-ranking-tweaks (default-off)
 ab405fa052  docs(028)           execute release-cleanup 004 + 005
 03d0b01eb6  feat(028)           advisor 007 outcome-weighted-ranking (default-off shadow)
 04f45c8f7a  docs(028)           execute release-cleanup 008
 03f93fef81  docs(028)           execute release-cleanup 007
 10c5b61493  feat(028)           advisor 004 beta-posterior shadow seam (default-off)
 16ee739b08  feat(028)           memory 007 bitemporal-window schema + 016 agentic-recall (default-off)
 6754d3a133  docs(028)           execute release-cleanup 002
 1c39235e36  feat(028)           code-graph 004 code-edge-bitemporal schema (default-off)
 bb038e19ab  docs(028)           execute release-cleanup 003 (deep-research deferred)
 cb92f2f211  feat(028)           memory 008 edge-presence-currentness schema (default-off)
 725fb19d7b  feat(028)           code-graph 006 edge-governance-vocab schema (default-off)
 df7f733651  docs(028)           execute release-cleanup 009
 a3621ebe33  docs(028)           execute release-cleanup 001
 ed53661043  feat(028)           memory 009 derived-id-provenance schema (default-off)
 5308401d95  feat(028)           memory 011 retention-forgetting + 017 semantic-edge-layer schema (default-off)
 8f8776e329  feat(028)           memory 012 procedural + 018 sleeptime + 020 eval-calibration-ab (default-off)
 818db21c54  docs(028)           execute release-cleanup 006 (deep/agent_router deferred)
 0843d054f7  feat(028)           run the eval-harness benchmark (criterion 4, aligned golden set)
 30958b1b0e  docs(028)           mark criterion 4 resolved (no default-off flag earned a flip)
 5ce5130b20  chore(028)          delete the superseded Wave-0 packet 030
```

> Interleaved house-voice changelog-polish commits (`c415143c10`, `2ad1f7bc88`, `7fddf1cad3`,
> `4e1e205481`) are omitted from this build view. The deep-review report and its remediation
> (`3eca12c05b` onward) are meta-work on top of the build program and sit outside this build sequence.

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

The last wave of the first build epoch: the Memory summary-fusion shadow lane, the Code Graph
seeded-PPR ranking and the Skill Advisor conflict re-rank, query-class routing and exact semantic
rerank, all default-off.

> Across `99bfa4427d` through `657a0f6a3e`, twenty-three implementation phases shipped code. Their
> always-on members are correctness fixes and their ranking-adjacent members ship default-off or
> byte-identical-by-default, matching the Wave-0 discipline. This was not the end of the program: the
> schema cluster and the remaining ranking phases landed after `657a0f6a3e`, as Section D2 records.

---

## D. Documentation and changelog generation

`cd6678a7a9` documented the extended eval and benchmark harness and how it is reached from the command
surface, recording the corpus metric lanes, the coverage gate and the calibration measurement path that
the eval phases added. `b1d6ab80cd` generated the linked per-phase changelogs in the 027 pattern: one
leaf changelog per shipped phase under each track's `changelog/` directory, a per-track
`changelog-00N-root.md` rollup and the packet root `changelog-028-root.md`. The index for that tree is
[`changelog/README.md`](./changelog/README.md).

---

## D2. The schema cluster, the release-cleanup executions and the benchmark

The program continued past the changelog generation. The schema-foundation phases landed as code
behind default-off flags: the Memory bitemporal window and iterative agentic recall at `16ee739b08`,
the Code Graph code-edge bitemporal reads at `1c39235e36`, the Memory edge-presence currentness at
`cb92f2f211`, the Code Graph edge-governance vocabulary at `725fb19d7b`, the Memory derived-id
provenance at `ed53661043`, the retention-forgetting and semantic-edge layer at `5308401d95` and the
procedural-benchmark, sleeptime and eval-calibration safe cores at `8f8776e329`. The mem0-ranking
tweaks at `0cf96409d8` and the advisor outcome-weighted and beta-posterior shadow seams at
`03d0b01eb6` and `10c5b61493` shipped alongside them, all default-off.

The release-cleanup track then executed all nine child phases across `ab405fa052` through `818db21c54`,
with the deep-research SKILL surfaces and the command-router deferred to a concurrent session. Finally
the eval-harness benchmark ran for criterion 4 at `0843d054f7` and resolved at `30958b1b0e`: the
aligned golden set produced channel-level Recall@20 deltas but no default-off flag earned a flip, so
the conservative default-off posture held. `5ce5130b20` then deleted the superseded Wave-0 packet 030.

---

## E. What shipped versus what is gated

The shipped set is recorded above and detailed in [`before-vs-after.md`](./before-vs-after.md). A gated
phase is not an unshipped phase. The schema-foundation and shadow phases below shipped their code and
migrations behind default-off flags, and what stays held is the live promotion or consumer, not the
code. The Memory bitemporal window, derived-id provenance, semantic edge layer and the Code Graph
code-edge bitemporal and edge-governance clusters all shipped their schema and default-off reads, held
back from a live flip until a migration consumer and a benchmark justify it. Needs-benchmark holds the
seeded-PPR tuning, the Q4-C1 magnitudes, the advisor RRF,
query-class and exact-rerank live flips, the reliability-weighted convergence cluster, the eval
calibration A/B promotion and the remaining retention and forgetting promotions. The
shared-infrastructure chain holds the work
waiting on the Memory consolidation-cursor clock, the durable advisor calibration substrate and the
shared Beta posterior. Two roadmap rows are deferred on evidence, the system-kind exclusion and the
idempotency default-on flip, and two are recorded as NO-GO or DEFER-speculative, the lexical-vector seed
union and the as-of-generation hard gate. None of the gated work shipped on a structural guess.
