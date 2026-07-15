# Research Synthesis (lineage dq-governance-rollout): the governance and rollout layer that makes the whole DQ program shippable and safe

<!-- ANCHOR:dq-governance-rollout-index -->
Fan-out lineage `dq-governance-rollout` under packet 003-spec-data-quality. The parent converged on the **truncation law** and a reuse-first program. The four building-block siblings filled it out: `dq-deep` named the keystones A1/B1/B2/B3/C2, `dq-automation-impl` made them build-ready over one shared safe-fix engine, `dq-probe` named the DQI scorer and the bifurcation, `dq-skilldoc-cmd-ctx` named the empty cron tier and the per-surface S/C/X detectors, `dq-novel-oob` named the floor-bypassing novel correctness/adherence program. Every prior lineage answered *what to do* or *how to build one piece*. This lineage answers the last question: *in what order, under what safety rules, measured how, do all of these ship together without breaking the existing corpus.* The unit is a governance design, not a verdict and not a build. The truncation law, the two hard rails, and every prior tiering are inherited as settled and are NOT re-derived — they are the inputs this layer sequences and governs.

## 1. Executive finding: the safety property is the ordering function, and the whole program is one topological sort

The single organizing finding of this lineage is that **the rollout order is not a plan, it is a derivation**. Every prior lineage said "the order is the safety property." Consolidated, that sentence has a precise meaning: the master sequence is the *topological sort of five inviolable dependency edges*, and every governance rule is a constraint on that sort. There is no discretion left once the edges are fixed.

The five edges:

1. **Census before gate** — every detector lands report-only/warn first to measure the real corpus band before any blocking promotion.
2. **Engine before front doors** — the one shared `dq-engine.ts` + frozen `detector-registry.ts` exists before A1/B1/B2 wire into it.
3. **Backfill before error** — no gate flips warn→error before its backfill clears the corpus to zero.
4. **Coverage guard before retrieval trust** — no recall number is trusted while embedding coverage < 100% under the current version (the mixed-vector confound).
5. **C2 before retrieval promotion** — the prod-mode completeRecall@3 gate is built before any retrieval candidate is touched; C2 is the single promotion path.

Three consequences make the governance layer precise:

1. **The program has two disjoint halves on one timeline.** The floor-bypassing reuse-first half (schema/enum/EARS/coherence gates + the scheduled sweep + the safe-fix tier) ships on cost through Phases I–V. The retrieval half is frozen behind C2 in Phase VII and touches nothing until a prod-mode read it does not yet have. The novel correctness/adherence half (Phase VI) is a *third* track that parallelizes with the first because it is entirely report-only/additive — it has no migration dependency.

2. **Every cross-lineage conflict is the same shape, and the census resolves all of them.** The three direct contradictions between siblings (extend-quality-loop vs don't; no-retroactive-automation vs 8-CI-workflows; build-the-wikilink-validator vs already-CI-wired) are all *build-vs-wire* disagreements. The Stage-0 census — counting what already ships before authoring anything — is their common resolver and the spine's first rule.

3. **The two hard rails become two structural invariants plus two workflow boundaries.** RAIL-1 (no body-mutating auto-fix) becomes INV-1: a body-touching fix is *never* `safe` in the frozen registry, and the destructive `quality-loop.ts:463-468` substring-trim stays quarantined to memory-save. RAIL-2 (no retrieval promotion without a prod@3 read) becomes INV-2: every retrieval-class change routes through C2, and a release reviewer reads the prod-mode column or repeats the 028 saturation mistake.

The honest headline: **the program is shippable and safe today for the floor-bypassing and novel-correctness halves, and correctly frozen for the retrieval half. Nothing in it is green-field that the census shows already ships, every stage names its single-step rollback before it runs, every fix is classified by blast radius, every gate migrates warn-before-error, and every tier proves its own metric on its own reader.**

## 2. Deliverable 1 — The unified priority-ordered rollout sequence (17 stages, 7 phases)

Phases I–V ship the floor-bypassing reuse-first half on cost. Phase VI adds the novel correctness/adherence program report-only (parallelizable with III–V). Phase VII builds the measurement (C2) FIRST, then touches the retrieval half.

| Stage | Phase | Keystone / source | Lands as | Rollback |
|---|---|---|---|---|
| S0 baseline census (report-only engine corpus-wide) | I Foundation | A1 / parent Stage 0 | read-only | none |
| S1 `dq-engine.ts` + `detector-registry.ts` + pure scorers + DQI | II Engine | dq-automation-impl §3 | dormant | delete modules |
| S2 sweep the 11 invalid graph files | III On-write+sweep | parent Stage 1 | tracked edits | git revert |
| S3 wire A1 on-write seams (H1/H2/H3) + on-write S/C/X detectors, WARN-only | III | A1 + per-surface | warn | revert hooks |
| S4 `dq-sweep.ts` + `dq-corpus-sweep.yml` (cron + dispatch), REPORT-only | III | B1 (empty cron tier) | report-only CI | delete workflow |
| S5 safe-fix executors + frozen allow-list; local `--apply` safe | IV Safe-fix+doors | B1 | safe-apply local | git revert batch |
| S6 `/doctor data-quality` (DIAGNOSE→APPLY `--confirm`) | IV | B2 | report→safe | drop route |
| S7 backfill (frontmatter/continuity/enum/shape) dry-run→batched apply | V Migration | parent Stage 4 | safe-apply | revert batch |
| S8 flip JSON-schema/enum/shape warn→ERROR; drop legacy bypass | V | A1 / parent Stage 3 | error | revert to warn + restore bypass |
| S9 embedding-drift monitor (FIRST in novel slate; protects C2) | VI Novel | N6a | telemetry-only | flag off |
| S10 cross-doc contradiction + staleness detector (new detector class) | VI | N5a | report-only | disable detector |
| S11 test/example-gen (N6b) + typed-KG (N4a) + assembler (N1a) + freshness/SLA queue (N5b/N7b) + LLM-judge governance (N2a) | VI | dq-novel-oob slate | report-only/additive | per-feature flag / clear queue |
| S12 B3 impression capture (`SPECKIT_RETRIEVAL_GAP_DETECT` default-OFF) | VII Retrieval | B3 | telemetry-only | flag off |
| S13 C2 `spec-corpus-golden.json` + capture `spec-corpus-baseline.json` | VII | C2 | measurement | revert files |
| S14 C2 `run-spec-recall-gate.mjs` (PROMOTION + REGRESSION, prod column only) | VII | C2 | gate live | delete gate |
| S15 B3 `detect-retrieval-gaps.ts` + `refinement_queue`, report-only, edge-tagged | VII | B3 | report-only | clear queue |
| S16 retrieval candidates (prefix C1 / edge-b / fusion / LLM-judge N2b / answerable-qs N3a) default-off, re-index behind coverage guard, promoted via C2 only | VII | C1 / CONDITIONAL tier | default-off | `embedding_context_version` fallback |

**Why this and no other order:** the drift monitor (S9) is the first novel item by a load-bearing dependency — it is the instrument that protects the C2 prod@3 read (S14) from the mixed-vector confound. Phase VI is otherwise independent of IV–V (report-only, no backfill/error edge) and parallelizes. Phase VII is strictly last because every item in it is retrieval-class and frozen behind C2 (INV-2).

## 3. Deliverable 2 — The migration plan for the existing corpus

The corpus is not green-field; it carries 11 invalid graph files, a dormant `legacy_grandfathered` bypass (0 packets), and an asserted-not-counted defect band. Migration is governed by three mechanisms.

**The four-beat per-gate discipline (does not compress).** Every gate moves through: **WARN** (default-off report, never blocks) → **BACKFILL** (dry-run report → batched apply via the `backfill-frontmatter.ts:131-144` contract) → **RE-MEASURE TO ZERO** (re-run the warn report; failing count = 0) → **ERROR** (flip; drop the dormant bypass; a deliberately-corrupted scratch packet now exits 2). BACKFILL sits between WARN and ERROR by dependency edge #3; the four beats do not collapse into one flip.

**Two distinct migrations, not one.** The *doc-gate migration* (schema/enum/shape/frontmatter/continuity) ships on cost via the four-beat above. The *retrieval migration* is a different mechanism entirely: it requires a full re-embed gated on the NET-NEW coverage guard (`embedding_context_version` + a coverage readout; `grep embeddingCoverage|coverageThreshold` is empty per parent N7), plus the dual-cache-key fix folding the strategy version into BOTH the persistent cache PK (`embedding-cache.ts:157`) AND the in-process LRU (`shared/embeddings.ts:309-311`). The retrieval migration is frozen behind that guard + C2.

**The legacy-corpus invariant.** No new hard rule errors before its backfill report reads zero. The legacy corpus predates every rule; a rule that errors before its backfill clears would break unrelated existing packets. The `legacy_grandfathered` bypass stays in place through WARN and BACKFILL and is deleted only at ERROR, after the re-measure confirms 0 packets depend on it.

## 4. Deliverable 3 — The safety and governance model

**The `fixClass` taxonomy (one classification, every detector, frozen in `detector-registry.ts`).** Classification is a property of the FIX, not the detector.
- **safe** = deterministic, length-neutral, metadata-only; auto-applies in local `--apply` / `--confirm`. (HVR swaps, anchor close, enum case-normalize, frontmatter→description trigger propagation.) Never touches an authored body.
- **guarded** = deterministic, higher blast radius; requires `--confirm`. (warn→error flips, backfill batch apply, `/doctor` APPLY.) `--confirm` unlocks the safe tier only.
- **report-only** = body-touching OR LLM-generated OR retrieval-class; never auto-applies, produces a queue item or candidate diff a human commits. (contradiction findings, drift alerts, refinement queue, suggest-only diffs, test-gen, LLM-judge, every retrieval candidate pre-C2.)

**The two structural invariants.** INV-1: a body-touching fix ⇒ never `safe` (the `computeAuthoredDocQuality` wrapper throws on `full-auto`; the destructive loop stays quarantined to memory-save). INV-2: a retrieval-class change ⇒ never promoted without a prod@3 read.

**Per-stage rollback.** Every stage names its single-step undo before it runs (see the §2 table). A stage with no clean single-step rollback is re-scoped until it has one. Every retrieval stage's rollback is an `embedding_context_version` fallback so a bad re-index never strands the corpus.

**Four human-in-the-loop boundaries.** (1) Fully automated: safe-class local `--apply` + CI report generation — **CI never auto-commits** (corpus-wide blast radius). (2) Human-gated: guarded-class via `--confirm`. (3) Always human-authored final: anything touching an authored body produces a candidate; a human writes the commit (RAIL-1 as a workflow boundary). (4) Release-reviewer gate: retrieval promotion — a human reads the prod-mode completeRecall@3 column, never eval@K (RAIL-2 as a review boundary).

**Idempotency + four drift guards.** Idempotency = skip-if-conformant + `content_hash` (`memory-save.ts:546`) + atomic writes (`generate-context.ts:398`) + batched commits, so a sweep re-run on a clean corpus is a no-op. Drift guards: **embedding** (per-chunk `embedding_context_version` + fingerprint, alert on mixed-regime — N6a/S9), **coverage** (refuse to trust recall below threshold), **storage** (read-time `content_hash` recompute — `vector-index-schema.ts:771-785`), **cross-copy** (the triple-copy trigger-vocabulary under the `rule-canary-sync` pattern with a sanctioned-delta allow-list — dq-skilldoc X1).

**The self-guarding registry (closed in the adversarial pass).** A change to `detector-registry.ts` is itself a `guarded`-class change requiring `--confirm` + a re-check of INV-1/INV-2 (no entry may mark a body-touching fix `safe`; no entry may mark a retrieval change auto-promotable). The registry guards itself with the same invariants it enforces, closing the meta-drift gap.

## 5. Deliverable 4 — The measurement plan (how each tier earns its keep)

Governed by **one-reader-one-metric-no-cross-credit**: a win for one reader (R/A/L) is never a win for another, and a high form-only proxy is never a retrieval win.

| Tier | Metric | Earns its keep when |
|---|---|---|
| Write-time / on-write | corpus conformance count → 0 + scratch-packet regression-catch | conformance holds at 0 AND a corrupted scratch packet exits 2 (NOT a retrieval claim) |
| Retroactive / scheduled | escape-class defects the change-triggered tiers structurally miss (path-filter escapes, backfill blind spots, cross-surface coherence) + safe-fix apply rate + idempotency | the first run finds ≥1 defect in each escape class the 8 CI workflows + 5 pre-commit gates did not catch; else downgrade to on-demand |
| Retrieval | prod-mode completeRecall@3 RISE via `run-eval-v2.mjs` dual-mode (eval vs prod on one copy DB) + fidelity delta | a dual-mode read shows prod@3 RISE, not eval@K; external @5/@10/@20 and eval@K are INADMISSIBLE (the K=3 floor hides that band); coverage = 100% under current version first |
| Novel correctness/adherence | each on its own non-retrieval metric (assembler = token-per-relevant-row + dup rate, no re-index; contradiction = precision/recall on graph-nominated pairs; test-gen = an adherence A/B; drift = mixed-regime census) | the named metric improves on its own reader; ranking use of any item (e.g. LLM-judge N2b) inherits the C2 prod@3 gate |

Three open measurements are inherited, NAMED not resolved, so the build does not silently skip them: the A1 on-write write-latency on a large spec; the per-detector corpus-wide failure counts (the Stage-0 census); the contradiction-detector precision/recall.

## 6. Deliverable 5 — The consolidated NO-GO list and anti-patterns

The 18-item NO-GO list (merged from all lineages) is a *derived consequence* of ten generative governance anti-patterns; a future candidate is judged by which anti-pattern it trips.

**The ten anti-patterns:** (1) eval-mode saturation (promote on eval/external @K; the floor hides that band); (2) silent-drop / the 028 trap (write a field with no live consumer); (3) destructive auto-fix (content-removing fix on an authored body); (4) net-negative rollup (a broad-query win that displaces a real specific child on a misclassified narrow query — measure the regression in the same pass); (5) mixed-vector confound (trust recall below full coverage); (6) rebuild-shipped-machinery (re-spec the wikilink validator / a new prod@3 harness / a new scorer / a new decay model — grep first); (7) five-engines (per-surface ad-hoc fix engines that diverge — one engine + one registry); (8) premature-error (flip to error before backfill clears); (9) change-triggered blind spot (rely only on pre-commit + CI path-gates; the scheduled sweep is the only tier catching all three escape classes); (10) proxy-as-truth (a high form score read as a retrieval win; an SLA read as auto-remediable).

**The 18 concrete NO-GOs** (deciding reason → anti-pattern): libSQL/sqlite-vec swap (already shipped); LightRAG merge (premature); quantization tiers (premature); Ed25519 signing (wrong threat model); a new rollup node type / index lane (#7, duplicates the embedded rollup); a second/parallel quality scorer (#7); extending the destructive `runQualityLoop` onto authored docs (#3); auto-rewriting authored bodies (#3, reward-hacks a proxy on the source of truth); auto-summarization rollups (#4); a doc-quality leaderboard service (fold into the B1 report); a score-changing context-budget optimizer (the qualityScore reranker, C2-gated); CI auto-committing fixes (blast radius); post-merge hook as the PRIMARY sweep trigger (per-dev, unenforced); `/doctor memory` or `/memory:manage` as a content-quality tool (#7, index-hygiene axis); `advisor_validate`/`skill_graph_validate` as doc DQI (orthogonal); re-speccing the wikilink validator (#6, already CI-wired); auto-gen `answerable_questions` without a consumer (#2); SLAs that auto-remediate on breach (#3).

The deepest anti-pattern is #1 + #10 together — mistaking a proxy or an off-floor metric for the prod reader's outcome. Every retrieval NO-GO and every CONDITIONAL freeze traces to it; INV-2 (the release-reviewer prod@3 boundary) is its counter.

## 7. Cross-cutting findings

**The order is a derivation, not a plan.** Once the five dependency edges are fixed, the 17-stage sequence is forced. Governance is not "what should we do first" but "what does the safety property permit to come first."

**The program is three tracks, not one.** Floor-bypassing reuse-first (Phases I–V, ships on cost), novel correctness/adherence (Phase VI, report-only, parallel), and retrieval (Phase VII, frozen behind C2). Conflating them was the early error; separating them is what makes the timeline both fast (two tracks ship immediately) and safe (the third is frozen).

**Every conflict was build-vs-wire, and the census resolves them.** The three cross-lineage contradictions, the rebuild-shipped-machinery anti-pattern, and the spine's first rule are the same insight: confirm what ships before authoring anything. The Stage-0 census is simultaneously a measurement, a migration prerequisite, and the conflict resolver.

**The rails survive as mechanism, not exhortation.** RAIL-1 and RAIL-2 are not warnings in a doc; they are INV-1/INV-2 enforced by a frozen registry that guards itself, plus two workflow boundaries (always-human-authored body, release-reviewer prod@3). The adversarial pass confirmed RAIL-2 has no escape path.

## 8. Eliminated alternatives

| Approach | Reason eliminated | Evidence | Iteration |
|---|---|---|---|
| Interleave retrieval stages with floor-bypassing stages | breaks the C2-before-promotion edge; re-creates eval-mode saturation | RAIL-2; parent §1 | 1, 7 |
| Force the report-only novel slate behind the migration | the slate is report-only/additive, no backfill/error dependency, parallelizes | iter 1; iter 7 Attack 1 | 1, 7 |
| Compress warn→error into a single flip | the premature-error trap; the band is asserted-not-counted | parent §4 | 2 |
| Treat the retrieval re-index as part of the doc-gate migration | two migrations, different gates (coverage guard is net-new) | parent N7; iter 2 | 2 |
| Per-detector ad-hoc safe/risky flags | classification is a property of the FIX; one frozen registry | dq-automation-impl iter 2 | 3 |
| `--confirm` unlocking risky / body-touching fixes | `--confirm` gates the safe tier only | dq-automation-impl iter 3 | 3 |
| Let CI auto-commit safe fixes | the boundary is blast-radius-human-reviewed, not fix-safety | iter 7 Attack 3 | 7 |
| Promote retrieval on external @5/@10/@20 or eval@K | the K=3 floor hides that band; read the prod column | parent §3 | 4 |
| Treat the NO-GO list as a static blocklist | it is derived from the 10 anti-patterns | iter 5 | 5 |
| Carry both sides of a cross-lineage conflict | a program that both extends and quarantines the destructive loop is incoherent | iter 6 | 6 |
| Build C2 before the drift monitor | the prod@3 read would be confounded by mixed vectors (load-bearing edge) | parent Stage 5; iter 7 Attack 2 | 7 |
| Any retrieval promotion path skipping C2 | RAIL-2 forecloses it; the assembler bypasses only as a non-retrieval item | iter 7 Attack 6 | 7 |

## 9. Open questions (inherited, named not resolved)

- The A1 on-write write-latency of pure-scorer + non-mutating-reviewer scoring on a large authored spec (005 spec.md is 10.6KB). OPEN; a build-stage timing measurement.
- The per-detector corpus-wide failure counts — the Stage-0 census, every prior lineage's asserted-not-counted band. OPEN; deferred to the build's first measurement.
- The precision/recall of the entailment-based contradiction detector on graph-nominated candidate pairs. OPEN; inherited from dq-novel-oob, deferred to a build.

## 10. Prove-First Caveats

This is a governance and rollout DESIGN, not a build. Nothing here is shipped.

- **Confirmed by reference to settled prior-lineage findings + file:line:** the truncation law (`confidence-truncation.ts:35`), the two-machinery split and the destructive substring-trim (`quality-loop.ts:463-468`), the empty cron tier (8 CI workflows, all `on: pull_request`), the absent coverage guard (parent N7), the dual-mode prod@3 harness (`run-eval-v2.mjs`), the dual-cache-key seam (`embedding-cache.ts:157`, `shared/embeddings.ts:309-311`), the three cross-lineage corrections.
- **The shippable-on-cost claim is honest for two of three tracks:** the floor-bypassing reuse-first half and the novel correctness/adherence half ship on cost and structural soundness (report-only/additive/human-gated, every fix classified, every gate migrated warn-before-error). Their value is conformance, consistency, integrity, adherence, and density — directly enforceable, none of it a retrieval claim.
- **Hypothesis-until-prod-measured:** the entire retrieval half (Phase VII) stays frozen until C2's gate reads a prod-mode completeRecall@3 RISE, never the eval column. The governance layer does not change that gate; it sequences everything else around it and freezes the retrieval half behind it.

## 11. Convergence Report

- **Stop reason:** converged / all_questions_answered (KQ1–KQ7 resolved; all five deliverables complete + the cross-lineage reconciliation; the adversarial pass overturned no deliverable and surfaced one governance gap, now closed).
- **Total iterations:** 7.
- **Questions answered:** 7/7 key questions; 3 open measurements deferred to a build.
- **newInfoRatio trend:** 0.88 → 0.80 → 0.72 → 0.66 → 0.40 → 0.30 → 0.05 (descending; one insight iteration at 6).
- **Quality guards:** source diversity PASS (parent synthesis + four sibling syntheses + file:line on the load-bearing seams: `confidence-truncation.ts`, `quality-loop.ts`, `run-eval-v2.mjs`, `embedding-cache.ts`, `shared/embeddings.ts`, `backfill-frontmatter.ts`, `memory-save.ts`, `generate-context.ts`, `vector-index-schema.ts` — independent sources); focus alignment PASS (every finding is governance/rollout HOW-TO-SHIP, not WHAT or HOW-TO-BUILD-one-piece); no-single-weak-source PASS.

## References

- Parent: `../../research.md` (truncation law, two rails, staged rollout, net-negative caution, coverage guard absent).
- Siblings (the building-block exclusion set this lineage consolidates): `../dq-deep/research.md` (A1/B1/B2/B3/C2 keystones), `../dq-automation-impl/research.md` (build-ready keystones, one engine three front doors, the two-machinery correction), `../dq-probe/research.md` (DQI scorer, the bifurcation), `../dq-skilldoc-cmd-ctx/research.md` (the empty cron tier, per-surface S/C/X detectors, the two prior-lineage corrections), `../dq-novel-oob/research.md` (the floor-bypassing novel correctness/adherence program).
- Load-bearing seams: `confidence-truncation.ts:35`; `quality-loop.ts:392,463-468,573,747`; `run-eval-v2.mjs:5-26,233-238`; `skill_advisor_bench.py:248`; `embedding-cache.ts:157`; `shared/embeddings.ts:309-311`; `backfill-frontmatter.ts:131-144`; `memory-save.ts:546`; `generate-context.ts:398`; `vector-index-schema.ts:771-785`.

(`resource-map.md` not present at init; no coverage gate cited.)
<!-- /ANCHOR:dq-governance-rollout-index -->
