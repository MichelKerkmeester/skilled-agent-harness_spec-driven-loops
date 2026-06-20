# What Changed in Memory Search Intelligence: The Full 028 Program

> Packet 028 turned a long external-memory research campaign into shipped retrieval intelligence across four internal subsystems. The flat 030 Wave-0 landed eleven candidates first. Then 028 re-planned the rest of the roadmap into a phased program of five tracks holding forty-two implementation child phases and built thirty-seven of them on top of that Wave-0 substrate, every shipped change additive, reversible and default-safe, including a default-off schema cluster whose migrations and reads landed behind flags. Work that needs a measured benchmark, a live consumer or a live-data signal it does not yet have stays gated on purpose rather than unshipped. The criterion-4 benchmark has since run, and a follow-on per-flag pass promoted four flags to default-ON: two on an unqualified win (derived-id provenance correctness and a held-out confidence-calibration gain, the latter on a pre-028 switch) and two on a no-harm guarantee (the retention-forgetting safety layer and the world-summary prelude, which add protection and grounding without displacing a real result). The rest hold default-off, including the procedural reliability multiplier whose de-rate bug was fixed as a committed correctness change but which moves only synthetic near-ties, so it does not earn the flip. A four-round deep review and a scoped remediation track then audited the shipped state, fixing eighteen required-tier findings across the rounds with zero blockers, and the loop closed effectively converged.

---

## THE UNIFYING PRINCIPLE

028 is the planning and implementation record that turns external memory-system research into improvements for the four internal retrieval subsystems. The research mined external systems and produced a ranked roadmap of candidate seams for Memory MCP recall, Code Graph structure, the Skill Advisor scorer and the Deep Loop runtime. It carried one honest caveat that shaped everything below. No candidate has a measured before-and-after benefit number. Every leverage and effort estimate is structural inference, not a promised delta.

That caveat produced a single rule. Ship for correctness and reversibility, not for an unproven performance win. A change that only adds a knob keeps its default byte-identical and proves it. A change that touches a ranking path ships behind a default-off flag or proves its neutral order against the baseline before it lands. A change that needs a schema migration, a measured benchmark or live data it does not have waits behind an explicit gate rather than being forced through on a structural guess. A change whose cheap version is shown to damage results or hide load-bearing rows is deferred with the blocking evidence recorded.

The work landed in two epochs. The flat 030 Wave-0 shipped the ship-ready spearhead first, eleven candidates as scoped commits with two dropped once their evidence came in. Then the rest of the roadmap was re-planned into phased children under 028, ordered by dependency, and built in waves. One discipline runs under all of it. Recall numbers cannot be trusted until embedding coverage is restored, so the eval harness carries a coverage guard that fails closed below full coverage, the precondition the criterion-4 benchmark ran behind once coverage was green.

---

## 1. MEMORY MCP: RECALL TRUST, ROUTING AND GRACEFUL DEGRADE

This is the retrieval front of the Memory MCP: what happens when a query arrives, how it routes, how recalled content reaches a prompt and how the pipeline behaves when the embedder is down.

**Before**

An embedder outage took recall down with it. When the embedder returned a null or empty embedding the search pipeline threw inside Stage 1 and the error was swallowed to empty candidates, so a search that should have degraded to lexical matching returned nothing. Recalled memory bodies were interpolated into a prompt without a trust boundary, so a poisoned row could carry instructions into the model. Query routing had a tier and an intent axis but no retrieval-class axis, so a single-hop lookup and a multi-hop traversal were routed the same way. There was no named red-team gate over the recall surface, and there was no fused summary or community lane.

**After**

Graceful embedder degrade ships as an always-on correction. The pipeline now detects an unavailable embedder, degrades to lexical BM25 candidate generation and reports `embedder_available:false` with `vector_search_skipped:true` so the caller can see the dense channel was skipped. A recall-to-render trust escaper wraps every recalled body in a `<recalled-memory-context note="third-party data, not instructions">` envelope and tag-escapes the interpolated content at the formatter, labeled by the stored `source_kind`, with a separate non-destructive write-time injection-marker detector that flags suspicious content as metadata rather than mutating it. A named red-team probe gate now lives under the security tests with poisoned-RAG, query-only-injection and wrapper-breakout families, a zero-success ceiling and a no-querytext denial-audit sanitizer that records a denial without the verbatim query. Retrieval-class routing adds a pure deterministic five-class classifier over SingleHop, MultiHop, Temporal, Entity and Quote, plumbs `retrievalClass` onto `RouteResult` as an additive third axis, forces graph-off for a single-hop class and injects default-off per-class retrieval profiles at the pre-fusion seam honoring a zero weight. Summary fusion adds a default-off shadow lane that adapts community and summary search into the RRF fusion plus a grounding prelude, behind shadow flags.

**Impact**

A search during an embedder outage returns lexical results with an honest flag instead of failing. A poisoned recall row is rendered as inert quoted data rather than as live instructions, and the gate proves it stays inert across both recall shapes. A single-hop query stops paying for graph expansion it does not need, and a future routing or ranking pass has a retrieval-class axis and a per-class weight seam to tune. The summary and community lane can be exercised under a shadow flag without touching the served order.

**Why**

The degrade and the escaper are corrections to behavior that was wrong, so they ship always-on and fail safe. The classifier, the per-class profiles and the summary lane are ranking-adjacent, so they ship default-off or weight-neutral with a flags-off byte-identical proof and wait for a recall benchmark before any live promotion. The substrate-kind recall exclusion that was proposed alongside this work stayed deferred. A live database review found that `source_kind='system'` is 9,592 canonical spec-doc rows including 29 constitutional rules, so the cheap predicate would have hidden roughly half of useful recall.

---

## 2. MEMORY MCP: STORE HYGIENE, CORRECTNESS RESIDUALS AND THE EVAL HARNESS

This is the store and measurement back of the Memory MCP: content identity, background enrichment visibility, two correctness residuals and the eval harness that any trustworthy recall claim has to run through.

**Before**

The SHA-256 content-hashing logic lived in two inline copies that could drift apart. The constitutional edit path had no guard against an edit removing a row's own protection and no compare-and-set precondition. The background-enrichment backlog was silent, so an operator could not see how many jobs were pending or failed or how old the oldest one was. The search-score average read RRF-scale magnitudes for semantic rows rather than the calibrated absolute scale, and the maintenance-marker TTL was a bare constant unmoored from the owner-lease reclaim window. The eval harness reported twelve ranking metrics but had no corpus-level gate-verdict, calibration or cold-tier lanes, and nothing stopped a recall benchmark from running against a half-indexed corpus.

**After**

Content identity is centralized into one `lib/content-id.ts` module with `hashContentBody` and `hashCanonicalJson`, parity-proven byte-identical to the prior inline outputs. The constitutional edit path now carries a non-self-edit assertion and an optional `expectedHash` compare-and-set, so an edit that would strip protection is rejected and a stale-read overwrite is rejected when the caller opts in. Background enrichment now surfaces pending and failed gauges off the existing aggregation plus an oldest-pending lag, all read-side with neutral degrade when the column is absent. The residual-correctness phase routes the search score through the calibrated absolute-relevance cosine scale for semantic rows with an effective-score fallback for lexical-only rows, where the fixed fixture moves from 0.032 to 0.715, and it derives the maintenance-marker TTL of 180000 from the owner-lease constants with the stale-reclaim margin documented. The eval harness extension adds single-pass diagnostic capture, three-way label tagging and three corpus metric lanes covering gate-verdict confusion with precision, recall and F1, calibration with ECE, Brier and reliability bins and a cold-appearance-rate with cold-precision. The corpus-reindex gate-zero phase adds an embedding-coverage guard at the ablation pre-flight that requires full coverage of the unique golden parent IDs, where each needs both a success embedding status and a vector row, and fails closed with a remediation message.

**Impact**

There is one source of truth for content identity, so a future dedup or idempotency feature builds on one primitive. A governance maintainer cannot accidentally strip constitutional protection. An operator can watch the enrichment backlog drain. The recall-confidence average now reads the calibrated scale by design, and the maintenance marker can no longer be reclaimed under the owner-lease window. Most of all, a recall benchmark now refuses to run against a corpus that is not fully embedded, which is the precondition that makes every downstream recall, calibration and cold-tier number trustworthy.

**Why**

The content-id module, the CAS guard and the gauges are additive or fail-closed, so they ship without claiming any relevance change. The two residuals are always-on correctness fixes that change confidence magnitudes by design, schema-free and reversible. The eval lanes are opt-in and the coverage guard is the gate the whole measurement chain depends on, so it ships first. The idempotency-receipts default-on flip that was proposed here stayed deferred because flipping it broke eleven update-path tests, and the per-class promotion gate that the new label lanes feed stayed pending behind the same benchmark discipline.

---

## 3. CODE GRAPH: DETERMINISM, FRESHNESS, PARSER RESILIENCE AND STRUCTURAL RANKING

The Code Graph picked up a rank-time trust signal in Wave-0 and then six phased correctness and capability adds, every one additive against a confirmed seam.

**Before**

The impact context ranked callers and callees by raw database row order and ignored the confidence and evidence-class metadata already carried on edges. Freshness carried no monotonic generation counter. A refactored dependency's reverse-dependents were not re-derived in the same scan, so a kind-flip rename left a stale import edge pointing at a dead symbol id. The parser skip-list was permanent-skip with no retry axis, so a transient WASM out-of-memory failure skipped a file forever. The doc lane was a write-only content-hash that answered no questions, and there was no personalized-PageRank primitive for impact ranking.

**After**

The Wave-0 trust blend folds confidence and evidence class into ranking as an RRF-additive term, `rankScore = 1/(60+index+1) + clamp(confidence)*evidenceClassFactor`, so a neutral edge stays byte-identical to the rowid baseline. The walk-order phase makes `rankContextEdges` derive a content-derived stable key from the related content hash, related symbol id, file or fully-qualified name, edge type and endpoints, then assigns baseline rank and equal-score ties from that key so impact, dependency and outline output are reproducible across scan rebuilds. The generation watermark stores a monotonic counter in the existing metadata table, bumps it from the scan-promotable finalize path and surfaces it as an additive freshness field. The edge-staleness phase re-derives a refactored dependency's reverse-dependents in the same scan before persist and emits an additive SUPERSEDES rename-lineage edge keyed on the content hash, reusing the tombstone machinery with the schema version unchanged at 5 and the absent-edge path byte-identical. Parser resilience splits the skip-list into a transient and fatal retry axis, where a transient file stays eligible until its durable attempt count reaches a default of five and a fatal or ambiguous file is skipped fail-closed. The doc-symbol lane turns markdown headings into queryable heading nodes nested by level and turns config keys across json, jsonc, yaml, yml and toml into key nodes, all with deterministic ids stable across rescans from a local regex and key walk with no LLM and no network, plus a launcher lease-churn classifier routed through a no-op-default sink. Seeded PPR adds a bounded personalized-PageRank primitive behind `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING`, reusing the Memory weighted-walk substrate through a code-graph edge adapter rather than forking a second walk engine, class-gated to impact and multi-hop with an undirected projection and reliability folded into transition weights.

**Impact**

The impact ranker can lift trusted edges without disturbing peers that carry no trust signal, and its order is reproducible across scans. Freshness now carries a comparable generation number. A kind-flip rename no longer strands a stale import edge, and rename lineage is preserved. A transiently failing file gets bounded retries instead of a permanent skip. Markdown and config documents become queryable structure instead of opaque hashes. The impact path has a real PPR primitive available the moment its benchmark clears.

**Why**

The trust blend, the deterministic order, the generation counter, the edge-staleness fix, the parser retry and the doc lane are additive or neutral-order-preserving, so they ship with their default behavior unchanged and proven. PPR ships default-off because its ranking quality and its damping, cap and decay values need a code-graph retrieval benchmark that does not exist campaign-wide. The cost-bearing default-on flip of the edge-staleness repair waits on a fan-in re-parse benchmark on a hot high-importer file. The dual-channel fuser adapter, the code-edge bitemporal cluster, the closed-vocabulary edge governance and the as-of-generation hard gate stayed gated behind isolation, schema-migration and named-consumer decisions, and the lexical-vector seed union was recorded as a NO-GO because its vector half does not exist.

---

## 4. SKILL ADVISOR: THE RRF SPINE, LANE HEALTH AND DEFAULT-OFF ROUTING

The Skill Advisor scorer gained one always-on health correction and a family of default-off ranking seams that ride a shared fusion spine.

**Before**

The scorer combined its lanes with a weighted sum and had no shared RRF spine, so its order was not comparable with the Memory fuser and its tail was not reproducible. A lane that ran but degraded was counted the same as a lane that ran and matched nothing, so a dead lane over-credited the confidence denominator and inflated abstention confidence. The SQLite projection carried no embedding-staleness verdict, so a projection built under one embedder could serve superseded cosine rows as fresh under another. There was no query-class routing, no conflict re-rank carrier and no guard against a skill scoring its own authored content.

**After**

Runtime lane-health degrade ships always-on. The scorer now classes each lane healthy, runtime-degraded or matched-nothing, elides only the degraded-empty lanes from the confidence denominator while keeping matched-nothing lanes in it, and surfaces the condition through metrics, prompt-safe output, warnings and the abstention explanation, with the all-healthy case proven byte-identical. The RRF determinism spine ships default-off behind `SPECKIT_ADVISOR_RRF_FUSION`, importing the Memory `fuseResultsMulti` rather than forking RRF, adapting each lane into a fixed-order ranked list, passing an advisor-specific k of 8 and using the RRF rank map as the final post-bonus tiebreak, with the graph-causal conflict suppression preserved through a combined, positive and conflict split and a post-fusion comparator demotion. The embedding-staleness signal computes a signature and a staleness verdict from the persisted vector model rows against the active embedder pointer, fails closed on a missing signature, reports only on an unreadable pointer and degrades the semantic shadow lane on a stale verdict instead of serving stale cosine rows. The conflict re-rank, query-class routing and exact semantic rerank all ship default-off behind their own flags, keeping conflict mass out of the lane sum, computing class-to-lane multipliers and reordering only within a bounded window over the fused top-K. A self-recommendation guard ships default-off, generalizing two hardcoded penalties into one producer-versus-scored-skill guard that fires only on the self-recommendation vector and leaves every other skill's authored-content symmetry intact.

**Impact**

A degraded lane no longer inflates the confidence of the survivors, which was the hard P0 of the subsystem. The advisor order is now reproducible and comparable with the Memory fuser when the spine is enabled. A stale projection degrades its semantic lane rather than serving superseded vectors as current. The routing refinements and the self-recommendation guard exist as tested seams ready for promotion, while the live order stays exactly as it is today.

**Why**

The lane-health fix is a correctness property, so it ships always-on. Everything else here is ranking-sensitive, so it ships default-off and byte-identical with the flag unset, and each path names the data or benchmark it waits on. The RRF live flip waits on a routing-agreement baseline. The conflict re-rank is a runtime no-op until a skill declares a reciprocal conflict, since the live graph carries zero conflict edges today. Query-class routing waits on a held-out routing-quality benchmark, and the exact rerank waits on the spine plus a recall acceptance. The embedding-staleness rebuild leg, the attested-baseline drift sweep, the skip-never-fabricate enum, the Beta-posterior promoter and outcome-weighted ranking all wait on shared infrastructure, the durable calibration substrate and the shared Beta posterior that the ephemeral tmpdir window cannot provide.

---

## 5. DEEP LOOP: FANOUT DETERMINISM, FAILURE RECOVERY AND CONTINUITY

The Deep Loop runtime fixed a reducer crash in Wave-0 and then hardened its fanout merge, its failure handling, its self-stop corroboration and its cross-iteration continuity.

**Before**

A freshly copied deep-research strategy template carried none of the anchor markers the reducer keys on, so the first reduce after iteration one threw and the loop could not advance. The fanout merge deduplicated but had no total order, so equally-ranked lineages could merge differently across runs. The pool exposed no lag, pending or failed gauges, and an interrupted run left no partial summary. A failed lineage carried no failure class and got no retry. The STOP decision trusted a self-reported novelty ratio it never verified. Next Focus and the carried-forward open questions were not threaded across iterations.

**After**

The reducer anchor fix added the seven required marker pairs to the strategy template so a fresh run reduces cleanly. The fanout determinism work shipped a content-then-id total comparator on the merge, read-derived lag, pending and failed gauges with no new state and a stopped partial summary on SIGINT or SIGTERM with an empty tick treated as valid convergence, then added a Wave-1 tail of arrival-order property tests asserting byte-identical merged registries across lineage permutations and a default-off near-duplicate body-content dedup. Failure recovery adds a bounded failure class over timeout, exit and salvage-miss, a transient-versus-fatal classifier that defaults unknown to fatal so a misclassification cannot loop, single-lineage re-dispatch up to a durable retry budget read from the orchestration log so a crash gets no fresh budget, a per-class rollup with proven count-correctness and a resume gate that refuses a missing or corrupt state file instead of silently fresh-initializing. Stop-input corroboration measures graph novelty from the state the loop already loads and blocks a STOP when a self-report claims low novelty but the graph disproves it, where an absent report is byte-identical, plus a configurable lag-ceiling tripwire metered against the shipped lag gauge and keep-both marking on divergent same-id findings. Continuity threading computes a self-owned carried-forward open-questions block from existing iteration records with no model call and derives Next Focus from that thread or the latest finding before falling back to the first strategy question or the terminal sentinel, with blocked-stop precedence preserved and no new convergence primitive added.

**Impact**

A fresh deep-research run no longer crashes the reducer. A fanout merge produces the same order every time and can collapse restated findings when a caller opts in. A failed lineage is classified, retried within a durable budget and never miscounted as a success or a permanent failure. A STOP can no longer be gamed by a self-report that the graph contradicts. A run carries its open questions and its next focus forward across iterations.

**Why**

The anchor fix, the determinism comparator, the gauges, the graceful self-stop, the failure classification and the continuity threading are additive or pure corrections, so they ship always-on and verified. The near-duplicate dedup changes merge membership, so it stays default-off until a caller opts in. The reliability-weighted convergence cluster was recorded NO-GO and held unbuilt as a design of record, because no writer populates the reliability metadata today so every input collapses to the prior mean and the weighting layer would have nothing to weight, and it waits on the benchmark tier supplying a per-execution success signal. The auto-redispatch leg of failure recovery stayed lease and heartbeat gated, so the shipped scope is detect and marker only.

---

## 6. RELEASE READINESS AND THE GATED FRONTIER

The fifth track and the gates that hold the rest of the roadmap.

**Before**

There was no documentation-cleanup plan for the pre-release surfaces, and the unshipped roadmap candidates had no single place that named why each one was held back.

**After**

The release-cleanup track is a phase-parent with nine documentation-surface child phases covering code READMEs, skill and repo READMEs, skill references and assets and SKILL files, feature catalogs, manual testing playbooks, commands, agent definitions, AGENTS and runtime routing and changelogs, constitutional rules and templates. All nine have since executed their cleanup, with the deep-research SKILL surfaces and the command-router deferred to a concurrent session that owns those files. The gated frontier across the four subsystems resolves into three gate classes, and a gated phase is shipped-behind-a-flag, not unshipped. The schema-migration phases shipped their migrations and default-off reads: the bitemporal window, the semantic edge layer, the code-edge bitemporal cluster and the closed-vocabulary edge governance all carry landed schema held back from a live flip until a consumer and a benchmark justify it. Derived-id provenance shipped on the same schema-migration pattern but has since earned its default-ON flip on a 4/4 correctness pass, and the retention-forgetting safety layer flipped on as a no-harm guardrail. Needs-benchmark still holds PPR tuning, the Q4-C1 boost magnitudes, the advisor RRF, query-class and exact-rerank live flips, eval calibration A/B, and the procedural reliability multiplier whose de-rate fix is committed but whose flip waits on a near-tie benchmark. The shared-infrastructure chain holds the work that waits on the Memory consolidation-cursor clock that both the advisor rebuild and sleeptime consolidation depend on, the durable advisor calibration substrate and the shared Beta posterior.

**Impact**

Pre-release documentation cleanup has a sequenced home, and every gated candidate names its gate and its unblock condition rather than reading as incomplete in-flight work.

**Why**

Documentation cleanup is its own pass and ran after the build program, so the track moved from a planning scaffold to executed cleanup. The gates are the unifying principle applied to the roadmap's tail. A change that needs a schema migration, a measured benchmark or a live-data signal it does not have waits until the evidence supports it, with two explicit decisions recorded as deferrals on evidence, the system-kind exclusion and the idempotency default-on flip, and three recorded as held-unbuilt NO-GO or DEFER-speculative, the reliability-weighted convergence cluster, the lexical-vector seed union and the as-of-generation hard gate.

---

## 7. THE DEEP REVIEW AND ITS REMEDIATION

The shipped state was audited, not just asserted. After the build program landed, the packet went through a four-round deep review and a scoped remediation track, the sixth track under 028. The `006-review-remediation` phase parent carries four children for eval-benchmark fidelity, memory schema and concurrency, doc accuracy and P2 triage.

**Before**

The build program had shipped, but no independent pass had stress-tested the shipped code against its own claims. The criterion-4 per-flag benchmark measured every flag on a forced all-channels path rather than the default routed path, so a flag could read neutral in the harness while moving real default behavior. Several defensive branches were untested, and a few governance and retention guards failed open on a malformed input or a legacy schema. Two default-on routing and recall paths had drifted from their pre-028 baseline, and a band of per-phase changelogs still claimed no code shipped while their rollups and the git history said otherwise.

**After**

Four review rounds ran to convergence. Round one fanned out forty seats across three models, twenty on gpt-5.5, ten on deepseek-v4-pro and ten on mimo-v2.5-pro, with a claude adversarial verify pass over five dimensions covering correctness, schema-migration safety, test coverage, default-off gating and injection-and-data-integrity, then layered a ten-iteration lens-scoped deep-dive on top. It found zero P0 and six P1 and did not converge. The remediation re-derived the criterion-4 benchmark on a corrected driver that measures the default routed path, closed a memory content-identity split, tightened the consolidation lock, re-validated retention and reconciled a cluster of doc claims against the committed code. Round two re-reviewed for convergence, found zero P0 and four new P1, then made the eval coverage guard fail closed on an empty relevance set, closed an edge-vector orphan-row hole and corrected a release-cleanup status fork. Round three ran every lens concurrently and verified each candidate on gpt-5.5-fast at xhigh with no claude seat in the loop, found zero P0 and eight new P1, then fixed all eight. Two fail-open holes now fail closed, a scope-governance path that coerced a malformed retention deadline to null and dropped it silently, and a retention sweep that deleted rows whose tier and pin columns were absent on a legacy schema. Two default-on gating violations now hold the baseline, a SingleHop graph-suppression early return in the query router gated behind the new default-off `SPECKIT_RETRIEVAL_CLASS_ROUTING` flag and registered in flag-ceiling, and a stage-1 constitutional-injection guard that now always surfaces constitutional rows on the embedder-down lexical-fallback path so the always-included contract holds when vector search is skipped. The remaining four were leaf changelogs reconciled to their shipped-default-off commits. This round also added the plain-language feature-flags guide at the packet root and documented the new flag in ENV_REFERENCE. Round four re-ran the parallel sweep after the round-three fixes, returned eight of nine candidates as real but every one a re-report of an exact round-three finding rather than a new defect, since a same-model verifier re-reading only the flagged line missed the fix that landed one line away, and host inspection confirmed each fix present in the committed code.

**Impact**

The eighteen required-tier findings across rounds one through three are all fixed and committed, zero P0 surfaced in any round and the loop closed effectively converged. The packet's own benchmark evidence is now measured on the path production serves, the governance and retention guards fail closed, the two default-on drifts are back to byte-identical baseline behind a default-off flag and an always-included contract, and the per-phase changelogs match the shipped reality. A separate ten-seat release-cleanup focused review then read the release-cleanup tracking docs themselves and confirmed the cleanup work shipped and that `benchmark-status.md` records nine of nine executed. It also flagged the repo-root README `validate.sh` rule count for a live recount, which this pass corrects against the validator registry.

**Why**

A release sign-off reads the audit first. The review ran adversarially and across diverse model lenses precisely so that a plausible-but-wrong claim could not survive, and it kept re-running until a round surfaced no genuinely new defect. The fixes hold the same discipline as the build. A correctness or fail-closed gap ships as an always-on correction, a default-on drift is gated back to baseline behind a default-off flag and a doc fork is reconciled to what git and the code actually say.

---

## CURRENT STATE

The packet shipped in two epochs on the `system-speckit/028-memory-search-intelligence` branch. The flat 030 Wave-0 landed eleven candidates as scoped commits from `738e118751` through `ab5459fb6d`, with two candidates dropped on evidence. The phased 028 program then re-planned the rest of the roadmap into five tracks at `52e3060752`, added a dependency-ordered build schedule at `a08f371e58` and built twenty-three implementation phases across the commits from `99bfa4427d` through `657a0f6a3e`, before documenting the extended eval and benchmark harness at `cd6678a7a9` and generating the linked per-phase changelogs at `b1d6ab80cd`. The program then continued past that refresh: the default-off schema cluster landed across `16ee739b08` through `8f8776e329` (bitemporal window, code-edge bitemporal, edge-presence currentness, edge-governance vocabulary, derived-id provenance, retention-forgetting, semantic-edge layer, procedural, sleeptime and eval-calibration), the release-cleanup track executed all nine children across `ab405fa052` through `818db21c54`, the criterion-4 eval-harness benchmark ran and resolved at `0843d054f7` and `30958b1b0e`, and the superseded Wave-0 packet 030 was deleted at `5ce5130b20`. The packet then went through its four-round deep review and remediation, from the tri-model report at `3eca12c05b` and the remediation phase-plan at `0076797859` through the round-three governance and gating fixes at `43be836513` and `221813f404` and the round-four closing note at `529e0af7bf`, with a final release-cleanup focused review at `ad8b166e7a`. Section 7 records that arc.

Every shipped change is additive and reversible. The always-on members are corrections to behavior that was wrong or missing: graceful embedder degrade, the recall escaper and red-team gate, the lane-health degrade, the gate-zero coverage guard, the deterministic orders across Memory, Code Graph and Deep Loop, the generation watermark, the enrichment gauges, the two correctness residuals, the edge-staleness repair, the parser retry axis, the doc-symbol lane, the fanout failure recovery, the stop corroboration and the continuity threading. The default-off or byte-identical-by-default members are the ranking-adjacent scaffolds: the retrieval-class profiles, the summary-fusion lane, seeded PPR, the advisor RRF spine, the conflict, query-class and exact-rerank routing seams, the self-recommendation guard and the near-duplicate dedup. The four subsystem parents, the release-cleanup parent and the review-remediation parent all pass `validate.sh --strict` with zero errors and zero warnings.

Three residuals are honest and deliberate. The criterion-4 benchmark has run and produced channel-level recall deltas, and a follow-on per-flag pass earned four default-ON flips: two unqualified wins (derived-id provenance correctness and a held-out confidence-calibration gain) and two no-harm guarantees (the retention-forgetting safety layer and the world-summary prelude, neither a precision number - the retention keep/drop labels are circular and the prelude's recall lift is partly a self-recall plus an append-by-construction artifact). The rest hold default-off, the procedural reliability multiplier kept its committed de-rate fix but reverted to off because it moves only synthetic near-ties with zero real-data effect. For the still-off candidates, neutral order and reversibility remain the ship gates with every magnitude a tuning follow-up. Recall, calibration and cold-tier claims depend on gate-zero coverage being green first, which is exactly why the coverage guard ships fail-closed. The live-database validation that the substrate-kind exclusion needs was unavailable in the workspace, so that filter and the live promotions across the schema-migration and benchmark frontier wait with their evidence and their unblock conditions recorded rather than flipped on a guess.
