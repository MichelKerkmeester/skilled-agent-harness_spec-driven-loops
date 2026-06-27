---
title: "Chronological Timeline [system-spec-kit/028-memory-search-intelligence/timeline]"
description: "Chronological build sequence of packet 028 memory-search-intelligence: the flat 030 Wave-0 spearhead, the re-plan into a phased five-track program, the dependency-ordered implementation waves, the eval and benchmark harness extension, the linked per-phase changelog generation, the four-round deep review and its remediation, the flag-resolution reckoning and the TRACK B new-feature research-and-build arc."
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
    last_updated_at: "2026-06-26T00:00:00Z"
    recent_action: "Ran a 20-iteration deep review of the 012 playbook-findings remediation, fixed the live memory-search under-surfacing from 1 result to 6, remediated the P1 backlog per area across code-graph advisor and spec-kit, de-polluted parentChain in 11 description.json and corrected four false 012 doc claims, all landed on the 028 review-branch mainline and pushed"
    next_safe_action: "Resolve the two carry-overs, the degraded local embedding provider whose open retry circuit breaker blocks the parentChain index refresh and the deferred validate.sh global-index-reconciliation preventive"
    completion_pct: 100
---
# 028 Chronological Timeline

> **Sort key:** git commit order on `system-speckit/028-memory-search-intelligence`, oldest to newest.
> This is the literal sequence the work landed in, not the candidate or phase numbering from the specs.
>
> **What this packet did.** It turned a long external memory-system research campaign into shipped
> retrieval intelligence across four subsystems. The work landed in five epochs. The flat 030 Wave-0
> shipped the ship-ready spearhead first. Then the rest of the roadmap was re-planned into a phased
> five-track program under 028 and built in dependency-ordered waves, every shipped change additive,
> reversible and default-safe. A four-round deep review then audited the shipped state. A
> flag-resolution reckoning reopened every default-off flag, kept five default-on on real evidence,
> deleted ten along with their code and was validated across three deep-review rounds, so the closing
> state carries a measured disposition rather than a uniform default-off posture. Finally a TRACK B
> new-feature arc read the ten deletions as a research input, built and kept eval-v2 as the
> measurability gate and built three more features default-off that a fresh-Opus gate held on the
> append-not-displace truncation finding.
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
 30958b1b0e  docs(028)           mark criterion 4 resolved (no flip on this pass, later reopened in Section G)
 5ce5130b20  chore(028)          delete the superseded Wave-0 packet 030

Epoch three  --  the deep review and its remediation (after the build program)
 3eca12c05b  docs(028)           deep-review report (tri-model 40-seat + 10-iteration, 0 P0 / 6 P1)
 0076797859  docs(028)           phase-plan the remediation (006-review-remediation, 4 children)
 885f0c662e  fix(028)            round-1: eval-driver fidelity + criterion-4 re-derived
 642357af0c  fix(028)            round-1: memory schema identity + consolidation lock + retention re-validation
 f3cb9b5a41  fix(028)            round-1: doc accuracy vs committed code
 378ace8459  fix(028)            round-1: benchmark-status em-dash + 003 continuity cleanup
 20f37fb283  docs(028)           round-2: convergence re-review (0 P0 / 4 new P1)
 0e3a224421  fix(028)            round-2: release-cleanup fork + 008 shipped-vs-no-code (doc)
 85cede4363  fix(028)            round-2: eval coverage guard + edge-vector orphan (code)
 228a320de2  docs(028)           round-3: gpt-5.5 xhigh parallel review (0 P0 / 8 P1)
 43be836513  fix(028)            round-3: 2 fail-open governance/retention holes now fail closed
 ed420eeda4  docs(028)           round-3: reconcile leaf-changelog no-code-shipped forks
 221813f404  fix(028)            round-3: 2 default-on gating violations gated / contract restored
 9452523954  docs(028)           round-3: add feature-flags.md (37 env switches)
 669ae88a8d  fix(028)            round-3: ENV_REFERENCE + embedder-degrade test follow-up
 529e0af7bf  docs(028)           round-4: closing note (stale re-report, effectively converged)
 ad8b166e7a  docs(028)           release-cleanup focused review (10 claude2-opus iterations)
```

> Interleaved house-voice changelog-polish commits (`c415143c10`, `2ad1f7bc88`, `7fddf1cad3`,
> `4e1e205481`) are omitted from this build view. The deep-review report and its remediation
> (`3eca12c05b` onward) ran after the build program. They are listed in the Epoch three block above
> and narrated in Section F.

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
aligned golden set produced channel-level Recall@20 deltas but no default-off flag earned a flip on
that pass, so the conservative default-off posture held for the build epoch. That verdict was later
superseded by the flag-resolution reckoning in Section G, which reopened the flags, kept five default-on
on its own evidence and deleted ten along with their code. `5ce5130b20` then deleted the superseded
Wave-0 packet 030.

---

## E. What shipped versus what is gated

The shipped set is recorded above and detailed in [`before-vs-after.md`](./before-vs-after.md). A gated
phase is not an unshipped phase. The schema-foundation and shadow phases below shipped their code and
migrations behind default-off flags, and what stays held is the live promotion or consumer, not the
code. The Memory bitemporal window, derived-id provenance, semantic edge layer and the Code Graph
code-edge bitemporal and edge-governance clusters all shipped their schema and default-off reads, held
back from a live flip until a migration consumer and a benchmark justify it. Needs-benchmark holds the
seeded-PPR tuning, the Q4-C1 magnitudes, the advisor RRF,
query-class and exact-rerank live flips, the eval
calibration A/B promotion and the remaining retention and forgetting promotions. The
shared-infrastructure chain holds the work
waiting on the Memory consolidation-cursor clock, the durable advisor calibration substrate and the
shared Beta posterior. Two roadmap rows are deferred on evidence, the system-kind exclusion and the
idempotency default-on flip, and three are recorded as held-unbuilt NO-GO or DEFER-speculative, the
reliability-weighted convergence cluster, the lexical-vector seed union and the as-of-generation hard
gate. None of the gated work shipped on a structural guess.

This held set describes the state at the close of the build epoch. The keep-off flag reinvestigation in
Section G later reopened it and resolved four of these holds with a live flip: derived-id provenance and
confidence calibration on an unqualified win and retention forgetting and world-summary prelude on a
no-harm guarantee. The rest stay held for the reasons recorded above.

---

## F. The deep review and its remediation

After the build program landed, the packet ran a four-round deep review with a scoped remediation
track, the `006-review-remediation` phase parent and its four children for eval-benchmark fidelity,
memory schema and concurrency, doc accuracy and P2 triage. This sequence sits after the build, not
inside it, and it is the reason the shipped state is audited rather than only asserted.

`3eca12c05b` opened with a tri-model report, forty seats split twenty on gpt-5.5, ten on
deepseek-v4-pro and ten on mimo-v2.5-pro, claude adversarial verification across five dimensions and a
ten-iteration deep-dive on top: zero P0, six P1, not converged. `0076797859` phase-planned the
remediation, then `885f0c662e`, `642357af0c`, `f3cb9b5a41` and `378ace8459` fixed the six round-one
P1, re-deriving the criterion-4 benchmark on a driver that measures the default routed path and closing
a memory content-identity split, a consolidation-lock gap and a doc-accuracy cluster.

`20f37fb283` re-reviewed for convergence and found four new P1 with no blocker. `0e3a224421` and
`85cede4363` closed them, making the eval coverage guard fail closed on an empty relevance set and
fixing an edge-vector orphan-row hole and a release-cleanup status fork.

`228a320de2` ran round three as a single parallel sweep, every lens concurrent and verified on
gpt-5.5-fast at xhigh with no claude seat: zero P0, eight new P1. `43be836513` made a scope-governance
path and a retention sweep fail closed, `221813f404` gated a default-on SingleHop graph-suppression
behind the new default-off `SPECKIT_RETRIEVAL_CLASS_ROUTING` flag and restored the always-included
constitutional contract on the embedder-down path, `ed420eeda4` reconciled the leaf-changelog
no-code-shipped forks, and `9452523954` and `669ae88a8d` added the feature-flags guide, the
ENV_REFERENCE entry and the embedder-degrade test follow-up.

`529e0af7bf` re-ran the sweep a fourth time after the round-three fixes. Eight of nine candidates
returned as real, but every one was a re-report of an exact round-three finding rather than a new
defect, and host inspection confirmed each fix present in the committed code, so the loop closed
effectively converged with eighteen P1 fixed across rounds one through three and zero P0 throughout.
`ad8b166e7a` then ran a ten-seat release-cleanup focused review that read the cleanup tracking docs
themselves, confirmed the work shipped and that [`benchmark-status.md`](./benchmark-status.md) records
nine of nine executed, and flagged the repo-root README rule count for a live recount.

---

## G. The keep-off flag-resolution reckoning and the deep-review validation

The build epoch closed with no default-off flag flipped, so the final arc reopened that verdict and ran
it to a clean decision. Every 028 flag that benchmarked keep-off was first reinvestigated for a path to
useful, then simulated under a fair real-world load with claude2 and gpt-5.5 as the live signal, and
finally given a per-flag keep-or-delete decision behind a fresh-Opus gate. The reckoning ended the
path-to-useful framing. Where the connection to live data was made and the metric still did not move, the
flag was deleted along with its code rather than left dormant. The final tally is keep 5 default-on and
delete 10. The per-flag resolution table lives in
[`keep-off-flag-roadmap.md`](./keep-off-flag-roadmap.md) and the final tally in
[`benchmark-status.md`](./benchmark-status.md), with the full method and 4-layer verification in
[`007-kept-off-flag-resolution/`](./007-kept-off-flag-resolution/).

Five switches earned default-on. The honest framing matters so a release sign-off does not read a safety
flip as a precision win. `SPECKIT_CONFIDENCE_CALIBRATION` kept on an unqualified win, held-out ECE 0.184
to 0.023 across all folds with a shipped isotonic model and a label-decoupling fix that removed the
earlier overfit. `SPECKIT_DERIVED_ID_PROVENANCE` kept on an unqualified win, content-addressed identity
correctness 4 of 4. `SPECKIT_RETENTION_FORGETTING_V1` kept as a safety and no-harm guarantee, it spares
386 keep-set rows the off path would delete with dropRecall delta 0, and its keep and drop labels are
circular, so it is a guardrail and not a precision gain. `SPECKIT_WORLD_SUMMARY_PRELUDE` kept as a
no-displacement grounding aid, it recovers 11 targets with 0 regressions by construction in append
placement and never displaces a baseline row. `SPECKIT_TEMPORAL_EDGES` kept on prod-path displacement
protection, where the +0.083 edge-hop recall is an eval-mode artifact the 3-result prod truncation floor
cuts to a 0.000 delta and the keep rests upstream of truncation on the graph-additive reorder that
protects the prod top-3 from graph-channel displacement, 3 of 12 golden queries with 0 regressions.

Ten switches were deleted along with their code. `SPECKIT_PROCEDURAL_RELIABILITY_RECALL` and its
`SPECKIT_PROCEDURAL_OUTCOME_EMITTER` companion went because the de-rate fix was real but the ledger
stayed empty and the bounded multiplier moves only synthetic near-ties with an eval rankDelta of 0. The
structural keep-offs went because they are recall-inert at K=20: `SPECKIT_SUMMARY_FUSION_LANE`
(displacement-only, -0.036), `SPECKIT_CARDINALITY_PENALTY` (0.0000, cap too small) and
`SPECKIT_SLEEPTIME_CONSOLIDATION` (-1.67pp, dedup hurts recall). `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING`
went negative on the real forward-CALLS graph. The edge family `SPECKIT_SEMANTIC_EDGE_LAYER`,
`SPECKIT_EDGE_VECTOR_INDEX`, `SPECKIT_EDGE_TRIPLET_SEARCH`, `SPECKIT_EDGE_SEMANTIC_DEDUP` and
`SPECKIT_EDGE_SEMANTIC_INVALIDATION` went because the generic relation-template edges carry no pair
identity. `SPECKIT_ADVISOR_OUTCOME_WEIGHTED_RERANK` went because MRR stayed within noise on an empty
ledger, `SPECKIT_BITEMPORAL_RECALL` because it had zero callers, `SPECKIT_EDGE_PRESENCE_CURRENTNESS`
because the integrity pass repairs 0 on the live graph, and `SPECKIT_AGENTIC_RECALL` because the live
reasoner nets zero with regressions at 51s per query despite a +0.344 oracle ceiling and has no consumer.

The within-noise graph-channel harm belongs to the separate pre-028 graph flags `useGraph`,
`SPECKIT_GRAPH_SIGNALS` and `SPECKIT_DEGREE_BOOST`, a noted follow-up out of 028 scope. `SPECKIT_TEMPORAL_EDGES`
is the additive mitigation and is not the source of that harm.

The deep review ran three rounds over this disposition. It caught the delete-env evaluation bug where the
off arm measured the on arm after a flip, so a flipped flag would have scored as a win against itself, and
it established the principle that synthetic, circular or self-recall wins do not earn a keep. The five
kept flags and the ten deletions are the corrected closing state.

---

## H. The TRACK B new-feature research-and-build arc

The reckoning did not end the campaign, it opened the next one. The ten deletions taught the campaign why a
lever fails to move live recall, and those teachings were read as a research input rather than a dead end.
The research found four candidate features that might earn a flip where the deleted ten did not. The arc
then ran research to eval-v2 to build to benchmark to a fresh-Opus hold. The full method lives in
[`008-new-feature-research-build/`](./008-new-feature-research-build/) and the held flags are recorded in
[`feature-flags.md`](./feature-flags.md).

eval-v2 was built first and kept. The old harness had hidden the deleted features behind eval-saturation, so
a new candidate measured on it would repeat the same mistake. eval-v2 is the fix and it earns its keep on its
own merit. It adds three non-self-recall classes so a feature cannot win by recalling the query back to
itself, `thematic_multi_target`, `causal_chain` and `hard_negative`, a completeRecall@K metric at K of 3, 5
and 8 that scores whether the full target set is recovered, and a dual-mode eval-vs-prod fidelity
measurement. The headline it exposed is the eval-saturation itself, eval-mode completeRecall@8 0.212 against
prod-mode 0.036, a +0.176 fidelity gap that had hidden the deleted features.

Three features were then built default-off, benchmarked in prod mode and held by a fresh-Opus gate. None
flips. `SPECKIT_DETERMINISTIC_MULTIHOP` held on a prod completeRecall delta of 0.000, the appended hop-2 docs
land at the tail and prod truncation cuts them. `SPECKIT_LANE_CHAMPION_BACKFILL` held on a 0.000 delta,
structurally redundant with RRF which already absorbs every lane champion. `SPECKIT_TRUE_CITATION_EMITTER`
held on an under-counted positive label, the shadow is clean and produces the corpus's missing negatives but
its positive label depends on the assistant echoing the memory id.

The key architectural finding is the append-not-displace pattern. It is the only non-regressing architecture
the campaign found, and it carries a property that decides the multihop result. It appends to the tail, and
prod confidence-truncation keeps about three results, so the tail-additive content is cut before it reaches
the reader. Tail-additive recall is 0 at prod K by construction, not by defect. Capturing it requires
injecting ahead of the truncation point, which is a displacement decision that trades a baseline row for the
new content, and that decision is deferred. The per-feature next steps follow from this: multihop gets a
scoped truncation-exemption probe on the causal_chain class with displacement accounting, lane-champion
retires its investment as redundant with RRF, and the citation-emitter fixes its positive label with
content-attribution and runs a one-shot offline mining pass before any collection decision.

---

## I. The TRACK C spec-kit data-quality research-and-scaffold arc

The reckoning's successor is not another shipped wave but a researched one. TRACK B closed on the
truncation law, the prod-versus-eval fidelity gap where eval-mode recall does not transfer to the prod
path. TRACK C reads that same law not as a property of one feature but as the gate on a whole class of
work, and asks what data-quality the campaign can win on the write surface the truncation cannot reach.
This epoch is RESEARCH-ONLY and scaffolded. Nothing in it is built and nothing is measured, the proposed
flags are names and not switches and the two proposed benchmarks have not run.

An official multi-lineage deep-research ran first, five lineages across thirty-seven substantive
iterations on opus via claude2, and produced twenty-eight data-quality recommendations every one grounded
in the truncation law. The law it works from is the prod-versus-eval fidelity gap packet 028 already
documents in the [`benchmark-status.md`](./benchmark-status.md) production-truth baseline and
[`before-vs-after.md`](./before-vs-after.md) section 7. The `DEFAULT_MIN_RESULTS=3` constant is a
never-cut-below-three minimum guarantee and not a top-3 cap. Confidence truncation is cliff-conditional and
returns three to twenty, and the real prod-limiting stage is token-budget truncation, so the prod reader
sees a tighter slate than eval without every query collapsing to a three-result floor. That fidelity gap
sorts the whole recommendation set, the direction intact and the magnitude corrected. Retrieval-class
candidates are gated and cannot earn a keep on eval-mode numbers because those gains do not transfer to the
prod path, while adherence, logic and write-time candidates bypass the truncation and can ship on cost.

The keystone recommendation is to extend the live default-on `quality-loop.ts`, the memory-save scorers and
auto-fix that already ship, to the authored spec-doc and metadata-JSON write surface. From there the
program tiers by where each candidate sits against the truncation. Tier A is on-write reuse-first across
`001-a1-extend-quality-loop-authored` through `010-a10-per-surface-gates`, and its decision-unconditional GO
is `004-a4-schema-warn-to-error` which promotes the JSON-schema shape rules from warn to error, a validation
tightening and not a ranking win. That decision is unconditional but the error flip is gated on a backfill
to zero, since a real schema run still fails twenty-four files, sixteen live, against the target shape. The
rest of the tier ships on cost. Tier B is retroactive automation across `011-b1-scheduled-dq-sweep` through
`013-b3-retrieval-feedback-edge`, a standing scheduled DQ sweep with guarded auto-fix, a `/doctor`
data-quality auto-remediation route and a retrieval-learning feedback edge. Tier C is retrieval across
`014-c1-chunk-prefix` through `018-c5-llm-judge-scorer`, all default-off and all gated on the
`015-c2-prodmode-recall-gate` prod-mode recall gate, which reads the @3, @5 and @8 completeRecall columns the
harness already emits plus an order-sensitive NDCG@K with a top1 guard, so a promotion needs a recall rise
and a ranking-quality hold. That gate is the unblocker for the tier and has not run. The novel slate across
`019-novel-contradiction-detection` through `025-novel-per-doc-quality-slas` is seven floor-bypassing
capabilities, cross-doc contradiction detection, embedding-drift monitoring, auto example and test
generation, a context-budget assembler, a typed-relation knowledge graph, a freshness-decay queue and
per-doc quality SLAs, thin and deferred-until-measured rather than flat GO. The infrastructure phases close
it, `026-shared-safe-fix-engine` the one engine the on-write and retroactive front doors share,
`027-retrieval-floor-experiment` the operator-agreed experiment to raise the retrieval budget and measure
whether results four through ten are signal or noise and `028-governance-rollout` the seventeen-stage
rollout with its four-beat migration, safety model and measurement plan. The 027 experiment could un-freeze
the whole Tier-C slate, and like C2 it is proposed not run.

The research then scaffolded all twenty-eight recommendations as Level-2 phase children under
[`005-spec-data-quality/`](./005-spec-data-quality/), each carrying the full doc set of spec, plan, tasks,
checklist and implementation-summary and each marked PLANNED with no code landed. The phase tree runs
`001-a1-extend-quality-loop-authored` through `028-governance-rollout`. Finally the per-phase changelogs
were generated in the 027 pattern, one leaf changelog per phase under
[`changelog/005-spec-data-quality/`](./changelog/005-spec-data-quality/) with the
[`changelog-005-root.md`](./changelog/005-spec-data-quality/changelog-005-root.md) rollup over them.

So TRACK C adds a researched and scaffolded program and not a shipped one. The honest scope is single-digit.
Its buildable-now subset is `004-a4-schema-warn-to-error` the decision-unconditional schema tightening,
`026-shared-safe-fix-engine` the shared engine, `001-a1-extend-quality-loop-authored` the on-write keystone
and `003-a3-enum-constrain-schemas` the producer enum guard. The retrieval tier and the thin novel items are
deferred-until-measured behind a real prod@K read and not scaffolded as ready. No phase was deleted, all
twenty-eight scaffolds are kept by operator intent. It is the successor question the truncation law raised,
carried as far as a plan and no further.

A round-2 deep review then audited the scaffold on 2026-06-22, thirty iterations across six angles run as
parallel opus seats that read the live system-spec-kit code the program grounds in, and returned a
CONDITIONAL verdict. The same session remediated every P0 and P1 and the actionable P2 across the 005 spec
set, all research-only with nothing built and completion still zero. The truncation law moved from cap to
floor and was made consistent across SUMMARY, spec and research. The C2 gate widened from completeRecall@3
to the @3, @5 and @8 columns plus an order-sensitive NDCG@K with a top1 guard. The A4 census was re-sized to
twenty-four failing files, sixteen live, and reframed as decision-unconditional but flip-gated. The 003
producer guard widened to three out-of-enum paths through a dual lenient and strict schema. The
over-scaffolding was reframed honestly with no phase deleted and all twenty-eight scaffolds kept by operator
intent. The report is in
[`005-spec-data-quality/review/review-report-round2.md`](./005-spec-data-quality/review/review-report-round2.md).

On 2026-06-22 the skill-advisor workspace-root resolution work was folded into the skill-advisor subsystem as
phase `003-skill-advisor/008-advisor-workspace-root-resolution`, relocated from its former standalone home
under system-skill-advisor with surgical metadata only and no content change. The same pass added a
category-scoped `before-vs-after.md` inside each of the five subsystem parents, `001-speckit-memory`,
`002-code-graph`, `003-skill-advisor`, `004-deep-loop` and `005-spec-data-quality`, each telling only its own
subsystem story while the packet-root `before-vs-after.md` stays the comprehensive cross-subsystem record.

On 2026-06-23 the data-quality lineage that the 2026-06-21 and 2026-06-22 notes left as a research scaffold then
shipped. Under `001-speckit-memory` the scoring and eval build landed as children 025 through 028, the off-corpus eval
fixture and false-confirm CI gate, the lexical-grounding floor that drove the off-corpus false-confirm rate from 0.833
to 0, the envelope-fidelity enforcement and the four-flag scoring hardening. Under `005-spec-data-quality` the
generated-metadata build landed as children 033 through 038, the identity resolver and merge safety, the
scoped-backfill z-exclusion, the idempotent writes and cache upsert, the metadata validator and status enum, the drift
gate and shared synopsis extractor and the generator hardening. Phase `039-full-repo-json-migration` then ran the
scoped per-folder migration driver over the whole tree, restamping every `description.json` and `graph-metadata.json`
to the new enum-clean, prefixed-path and content-hashed format, z_archive included and z_future excluded by operator
decision, gated on a byte-stable second run, 2049 folders at zero violations and a validate-clean tree. Phase
`040-flag-graduation-benchmark` then ran the earn-or-delete reckoning. Of the thirteen built flags, twelve graduated to
default-ON or enforcing on a measured before-and-after and one, grounding-signal, was deleted with its code as purely
informational. Every phase across the seven tracks now carries a leaf changelog under `changelog/`, and the living flag
record is `feature-flags.md`, `keep-off-flag-roadmap.md` and `benchmark-status.md`.

On 2026-06-23 a test-infrastructure phase, `001-speckit-memory/029-substrate-sandbox-cleanup`, then stopped the substrate stress harness from leaving its `_sandbox/24--local-llm-query-intelligence/` scratch directory at the repo root. The harness now removes the throwaway code-graph DB on every run, a new `--clean` flag drops the whole sandbox for standalone runs, and the vitest runner clears it in `afterAll` once it has read the summary TSV. This is harness hygiene with no change to any served behavior.

On 2026-06-23 a search-quality arc then ran under `005-spec-data-quality` as children 041 through 044, a fix wave followed by three benchmark-gated decisions. The 029 vague-query model benchmark had surfaced six search-quality findings, and `041-search-quality-fixes` landed all six. Its keystone was the one real bug, the graduated evidence-gap verdict cap was dead on the live path because the handler set the banner warning but never the boolean the cap reads, so 041 bridged the Stage-4 signal and the cap fires live, capping an off-corpus query from good to weak with the banner and verdict in agreement where it returned good beside the banner before, verified by a fast-subset rerun at 6 of 6 off-corpus cells capped and 0 good-beside-banner contradictions where the prior failure mode was 19 of 144. The other five fixes were a three-tier citeCorrect metric, an honest retrievalProfileWeightsEnabled envelope field, a resolved score on graph and degree rows, a default-off deterministic-ranking flag and a presentation-contract tightening. Three benchmark-gated decisions followed. `042-deterministic-ranking-benchmark` benchmarked the new deterministic-ranking flag against the real corpus, found flag-ON ranking reproducible at determinism 1.0 but materially divergent from the default on 5 of 12 queries (top-K overlap 0.69, Kendall tau 0.73) because removing wall-clock recency reorders the real-match queries, and returned STAY DEFAULT-OFF since recency is load-bearing and no ground-truth shows the deterministic order is better. Per the operator directive to remove benchmark-rejected stay-off flag code, `SPECKIT_DETERMINISTIC_RANKING` and its gated branches were then deleted (commit `2c43c60172`), reverting to the default recency-on ranking, with the always-on trigger id tie-break kept as the pure-win part, behavior-identical to the prior default. `043-gap-threshold-calibration-benchmark` then tested whether the evidence-gap detector's Z-score threshold of 1.3 was calibrated and found the gap detector measured the wrong thing, the Z-score reads peakedness not relevance, so it over-caps strong tight-cluster queries (should-good false-positive 0.67) and misses flat off-corpus ones (should-gap detection 0.33), no threshold separates them (optimal 0.8 reaching only 0.50), and the verdict was redesign relevance-aware not tune. `044-relevance-aware-evidence-gap` enacted that redesign behind a default-off `SPECKIT_RELEVANCE_AWARE_GAP` flag, replacing the gap decision with the verdict banding's noise-floor-subtracted relevance, `gapDetected = max(0, topRelevance - noiseFloor) < LOW_THRESHOLD`. The first graduation attempt almost shipped a regression, the relevance branch was fed `resolveEffectiveScore` (RRF-magnitude around 0.03) while its band expects absolute cosine, so it flagged every query with the evidence-gap banner, a bug the original 044 benchmark had masked by feeding hand-picked absolute-relevance scores and that a full-handler live dispatch caught. It was fixed by threading the verdict banding signal `resolveCalibrationScore` into the detector through a `relevanceScores` option, fail-closed to the Z-score path when absent, then re-benchmarked through the production `executePipeline` (graph and kubernetes return no-gap, only oauth returns gap) and confirmed by a full-handler live re-verify. `SPECKIT_RELEVANCE_AWARE_GAP` graduated to default-on (commit `7988a6639c`) with zero test collateral, 161 gap and pipeline tests passing. So the arc reads as a fix wave that exposed a deeper detector flaw, two benchmarks that deleted the determinism flag and named the gap detector mis-designed, and a relevance-aware redesign that hit a production-scoring bug the benchmark masked, was caught by a live dispatch, re-validated through the real pipeline and graduated to default-on.

On 2026-06-25 a daemon-skills playbook validation ran every stress suite plus 222 of 471 manual-testing-playbook scenarios across three cli models against the three daemon-backed system skills, scored each run critically rather than trusting its verdict string, and documented fourteen real product findings with remediation plans, recorded as `000-release-cleanup/011-daemon-skills-playbook-validation`. That validation plus the core memory-search re-run surfaced about twenty-two real findings in total, and `000-release-cleanup/012-playbook-findings-remediation` then landed them. gpt-5.5-fast high fixed the findings in eight clusters A through H in an isolated worktree, each cluster verified by a vitest blast-radius sweep plus typecheck plus mutation checks on the risky fixes plus comment hygiene plus alignment drift, then committed one cluster per commit. The seven fix commits are `adbcc65e83` cluster A schema drift (the F11 source_kind select guard and the F12 consumption_log query_hash alignment, 80 passed), `e5b4735c4b` cluster B wiring (five implemented-but-dead memory-search features wired into the runtime, scoring observability, LLM backfill registration, llm-reformulation, query-surrogates and the contextual-tree header, 1165 passed across 47 files), `f0e063eed4` cluster C retrievalLevel honored local, global and auto end to end with the missing strict input-schema field added (155 passed), `cbf4f4d111` cluster D ordering (folder rank primary sort plus a guaranteed top-k slot per active channel, 98 passed), `917ad633a3` cluster E advisor persistence hardening F1 through F6 (routing re-mapped to leaf skills with measured top-1 back to 0.92 to 0.95, a new skill-metadata sanitizer, the validate-scorer, the rollback lifecycle-field cleanup, a non-zero bench exit and the disabled force-native error, 61 passed), `f27945593e` cluster F DB lifecycle (cross-process rebind, db-path standardization and the embedding-retry e2e, 63 passed), and `3291c05389` clusters G and H code-graph write-local refresh plus quality cleanup (the duplicate scope helper, two stale tests, entity dedup normalization and the 7-layer metadata, 421 plus 17 passed). A follow-up test commit `374ca93caa` then added the dedicated B4 surrogate index-time, B5 contextual-tree header and C strict-schema tests, and a migration commit `64d064d868` re-parented the post-phase-6 phases under their relevant parents. Six isolation and harness artifacts were excluded as not bugs. The fixes are verified per cluster and landed on the 028 review-branch mainline, authored in the worktree wt/0008. The validation and the remediation both record their before-and-after in [`before-vs-after.md`](./before-vs-after.md) Section 10.

On 2026-06-26 the 012 playbook-findings remediation underwent a 20-iteration deep review that surfaced 14 P0, 69 P1 and 84 P2, where the 6 distinct P0 were fixed and committed earlier in the session. The operator then fixed the live memory-search under-surfacing the user reported, a query that returned 1 spec folder where many matched, plus the deep-review P1 backlog. The search fix landed in three commits, trigger-lane promotion into the surfaced results plus a display floor of 10 plus compact-overflow materialization plus a z_future exclusion in the folder-discovery listing plus empty-string-filter and retrievalLevel validation guards (`3b39f45e88`), an envelope-level floor that renders budget overflow as compact rows instead of deleting them (`ed523a2850`) and a gap-truncation test alignment to the new floor (`7868e35db6`). Live memory_search went from 1 result to 6, 1 full plus 5 compact, after a dist rebuild and daemon restart. The P1 backlog was then remediated per area with operator verification. Code-graph (6) were all already resolved by the committed gating. Advisor (14) sanitized the derived routing fields trigger_phrases key_topics and entities plus made writeBoundedJsonl an atomic bounded append plus guarded the fire-and-forget hook persists plus preserved rollback lifecycle fields (`ff01f38f6e`). Spec-kit (41) shipped the eval DB-path-by-value plus a BM25 sync guard plus the QUALITY_FLOOR doc honesty (`01ec95899f`) and three deferred fixes the operator re-did with tests after the gpt-5.5 dispatches timed out, storing query surrogates under their own SPECKIT_QUERY_SURROGATES gate (`47014af131`), reconciling re-parent moves so a reorg repoints rows instead of dropping embeddings (`3c8e9c7dec`) and making the retrievalLevel global branch honor the SPECKIT_DUAL_RETRIEVAL kill switch and archived-deny and constitutional injection (`579f9ecda6`). The specs-docs findings de-polluted parentChain in 11 description.json regenerated with the wrong basePath (`f0e803ffc0`) and corrected four false claims across the 012 remediation docs, the merge state and the E5/F5 bench misattribution and the F1c rebind misattribution and the sanitizer scope (`ec7adba84f`). A worthwhile-P2 pass restored the four missing children_ids 041 through 044 on the 005-spec-data-quality phase parent (`267c1468f6`). All commits landed on the 028 review-branch mainline and were pushed. Two pre-existing carry-overs stayed open, a degraded local embedding provider with its retry circuit breaker open that blocked the parentChain index refresh and a deferred validate.sh global-index-reconciliation preventive. This work and its corrections are recorded in [`before-vs-after.md`](./before-vs-after.md) Section 11.

On 2026-06-27 a 50-iteration multi-model drift audit of packet 028 converged 175 findings (6 P0, 91 P1, 78 P2), each an LLM hypothesis carrying file:line evidence, and a remediation pass then drove every one to a terminal state. gpt-5.5-fast high implemented the fixes while opus triaged each finding REAL-or-false-positive against the cited file and re-read the real file after every fix rather than trusting the implementer's self-report. The ledger reached 131 fixed-verified plus 44 false-positive, the false-positives caught before any wasted edit — generic test-fixture model ids in the frozen deep-loop runtime, historically-accurate changelogs, hallucinated references, and by-design states such as review-record packets waiving docs. The fixes spanned six phases: the P0 doctor-route, causal-graph DB-path and codex-pin corrections; the `context-index.sqlite` canonicalization and the 39/9/8 tool-count sweep; the opencode-go gateway purge down to its last straggler, the matrix-adapter default model; the agent and command tool-grant reconciliation across .claude/.opencode/.codex; the graph-metadata path normalization to the repo-relative invariant plus the phase-parent `migrated`/`level` metadata; and the env-var documentation, code/doc drift and CI drift-guard work. A captured baseline confirmed zero regressions — the one failing test was a pre-existing gate-3 case from the deep-loop merge. The drift-remediation packet was then nested under the release-cleanup track as `000/013-drift-remediation`, with the per-finding ledger as its source of truth, and the arc is recorded in [`before-vs-after.md`](./before-vs-after.md) Section 12 and the [013 changelog](./changelog/000-release-cleanup/changelog-000-013-drift-remediation.md).
