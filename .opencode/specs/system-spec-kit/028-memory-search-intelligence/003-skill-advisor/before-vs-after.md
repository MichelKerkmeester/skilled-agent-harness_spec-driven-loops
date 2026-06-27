# What Changed in the Skill Advisor: The RRF Spine, Lane Health and Default-Off Routing

> The Skill Advisor is the routing-intelligence scorer of packet 028, the component that reads a request and recommends which skill should handle it. Before 028 it fused five lanes with a raw-score weighted sum, counted a dead lane the same as a lane that ran and matched nothing, served cached cosine vectors with no embedder-freshness check and carried no principled guard against a skill scoring its own authored content. The 028 work re-grounded that scorer on a shared fusion spine and a runtime health model, then built a family of ranking and learning seams default-off on top of it. The subsystem became one always-on correctness layer (lane health, embedding freshness and a corrected workspace-root resolver) plus a default-off frontier (the RRF determinism spine, the conflict, query-class and exact-rerank routing refinements, the self-recommendation guard and the shadow-only Beta-posterior learning chain), every gated member waiting on the data or benchmark it names rather than flipped on a structural guess. Eight phase children carry that story, from `001-rrf-determinism-spine` through the newly moved `008-advisor-workspace-root-resolution`.

---

## 1. THE FUSION SPINE AND RUNTIME CORRECTNESS

The core of the scorer: how lanes fuse, how confidence is normalized when a lane is missing and whether the cosine vectors it reads are still fresh.

**Before**

The scorer fused its five lanes (`explicit_author 0.42`, `lexical 0.28`, `graph_causal 0.13`, `derived_generated 0.12` and `semantic_shadow 0.05`) with a raw-score weighted sum, multiplying each lane's score by a weight and adding the results as if a hint-inflated lexical overlap, a `[0.2,1]` cosine and a signed `[-1,1]` graph propagation sat on one axis. There was no RRF anywhere in the advisor, so its order was not comparable with the Memory fuser and its tail was not reproducible under float arithmetic. A lane that ran but returned nothing at runtime, for example `graph_causal` during a skill-graph rebuild, kept its weight in the `liveTotal` confidence denominator while contributing nothing, so every survivor's confidence skewed uniformly downward by the missing lane's weight share. The scorer had no runtime per-lane health signal to tell a degraded-empty lane apart from a lane that ran fine and legitimately matched nothing. The projection the scorer reads stamped `generatedAt = now()` on every load and carried no embedder signature, so the `semantic_shadow` lane silently consumed cosine vectors from a superseded embedder whenever a refresh had not run or only partially ran.

**After**

The runtime lane-health degrade ships always-on (phase `002-runtime-lane-health-degrade`, candidates C5, C5a and AMB). The scorer now classes each lane per call as healthy, runtime-degraded or matched-nothing, elides only the degraded-empty lanes from `liveTotal` while keeping matched-nothing lanes in it, and surfaces the condition through metrics, prompt-safe output and the ambiguity-and-abstention explanation. The all-healthy path is proven byte-identical to the registry-static baseline, and the measured fixture moved confidence from `0.6060` to `0.6189` (a `+0.0129` delta, with the scored row's `liveNormalized` moving `0.1600` to `0.1839`) when `graph_causal` was degraded-empty. The RRF determinism spine ships default-off behind `SPECKIT_ADVISOR_RRF_FUSION` (phase `001-rrf-determinism-spine`, candidate C3 with the byte-stable tiebreak C2 folded in). It imports Memory's `fuseResultsMulti` rather than forking a second RRF, adapts each lane into a fixed-order ranked list, passes an advisor-specific `ADVISOR_RRF_K = 8` below Memory's corpus-tuned default and uses the RRF rank map as the final post-bonus tiebreak. The `graph_causal` conflict-suppression mass is preserved through a positive-and-conflict split with a post-fusion comparator demotion, so the positive-only RRF does not silently drop the `conflicts_with = -0.35` term. The embedding-staleness signal ships as a fail-closed correctness layer (phase `003-embedding-staleness-signal`, candidate SA8). It stamps the embedder signature `(provider, name, dim)` into the stored projection and compares it against the active embedder on load, mirroring `memory_embedding_reconcile`, fails closed on a missing signature, reports only on an unreadable pointer and degrades the `semantic_shadow` lane on a stale verdict instead of serving superseded cosine rows.

**Impact**

A degraded lane no longer inflates the confidence of the survivors, which was the hard P0 of the subsystem. The advisor order is reproducible and comparable with the Memory fuser when the spine is enabled, and the determinism rests on RRF's fixed-order rank sum plus a shared id-and-content-hash tiebreak rather than a fragile float rounding and a locale sort. A projection built under one embedder degrades its semantic lane rather than presenting stale vectors as current.

**Why**

The lane-health degrade and the embedding-staleness signal are corrections to behavior that was wrong, so they ship always-on and fail safe. The RRF spine is ranking-sensitive, so it ships default-off and byte-identical with the flag unset, and its live flip waits on a top-1 and top-3 routing-agreement baseline against the current weighted sum, with `explicit_author` dominance to be confirmed there. The conflict carrier is a runtime no-op until a skill declares a reciprocal conflict, because the live skill graph carries zero `conflicts_with` edges today. The embedding-staleness detection is shipped, but its idempotent-async rebuild leg waits on the durable cursor primitive from Memory `010-consolidation-cursor-clock`, so the read-boundary detection lands first and the stale-triggered rebuild is wired only when that primitive is available.

---

## 2. THE DEFAULT-OFF ROUTING AND PROVENANCE SEAMS

The ranking-adjacent refinements that ride the spine: conflict suppression, query-class weighting, an exact-cosine tiebreak and a guard against the advisor recommending itself.

**Before**

Beyond the weighted sum, the scorer had no query-class routing, no conflict re-rank carrier and no principled guard against a skill scoring its own authored content. Intent reached the scorer only through ad-hoc regexes for confidence and abstention and a hand-maintained per-phrase-and-skill intent-bonus table. The signed `conflicts_with` mass emitted a negative score that had no rank-fusion meaning, so a naive RRF port would drop conflict suppression. The `semantic_shadow` lane already computed exact full-precision cosine over every projected skill but had no way to resolve ties among the fused survivors, only a `0.2` cutoff that suppressed mid-range candidates wholesale. And the one real self-recommendation vector, the advisor recommending itself, was handled by two hardcoded penalties rather than one principled rule.

**After**

The conflict re-rank, query-class routing and exact semantic rerank all ship default-off behind their own flags (phase `005-conflict-rerank-query-routing`, candidates C1, QCR and C6). C1 lifts the `conflicts_with` mass out of the lane sum into a deterministic post-fusion demotion in the sort comparator with its own applied-counter. QCR classifies a query into a small intent class and feeds per-class lane multipliers through the existing weight merge point behind `SPECKIT_ADVISOR_QUERY_CLASS_ROUTING`, additively and never displacing the dominant `explicit_author` lane. C6 re-scores only the fused top-K survivors with full-precision cosine, bypassing the `0.2` cutoff for that subset only, behind `SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK` and the RRF spine. The self-recommendation guard ships default-off behind `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` (phase `006-provenance-drift-observability`, candidate SA-author-self-boost-guard). It generalizes the two hardcoded penalties (`readOnlyExplainerFloor` and `auditRecsAdvisorPenalty`) into one producer-versus-scored-skill rule that fires only on the self-recommendation vector and leaves every other skill's authored-content symmetry intact.

**Impact**

The routing refinements and the self-recommendation guard exist as tested, reversible seams ready for promotion while the live order stays exactly as it is today. With every new flag unset the scorer's behavior is the original weighted-sum fusion, so nothing in this group adds default-on behavior. C1 becomes conflict-safe the moment a reciprocal edge is declared, without re-touching the import, and the self-recommendation guard is proven inert for every skill other than the advisor scoring itself.

**Why**

Each of these is ranking-sensitive, so it ships default-off and byte-identical with the flag unset, and each names the data or benchmark it waits on. The conflict re-rank stays a no-op until a skill declares a reciprocal `conflicts_with` edge, verified at zero live edges with all skill metadata declaring an empty list. Query-class routing waits on a held-out routing-quality benchmark and a calibrated class taxonomy, because the costly error is a misrouted class that demotes the right skill. The exact rerank waits on the RRF spine plus a recall acceptance, since on the weighted-sum survivor set it would re-order a non-deterministic set. The discipline is the one 028 holds everywhere. A ranking-adjacent seam earns a live flip only by improving the served result the reader sees. The prod route guarantees a never-cut-below-3 floor and then trims the longer tail only at a confidence cliff and under a running token budget, so a re-order that lands in that trimmed tail is not reliably served and stays gated until a prod-path measurement confirms it.

---

## 3. THE SHADOW-ONLY LEARNING FRONTIER AND THE FLAG RECKONING

The deepest gate of the subsystem: a feedback loop that learns from outcomes, all of it shadow-only and gated on shared infrastructure the campaign did not yet have.

**Before**

The advisor shipped an end-to-end shadow feedback pipeline, durable outcome capture, a bounded delta estimator and a parallel shadow-weight channel, but the estimator wrote its proposal to a JSONL log that no consumer ever read back, so the loop never closed. The estimator was raw-frequency with a binary `minSamples` cliff, with no Beta prior, posterior or reliability math anywhere in the scorer, so eight all-accepted samples maxed the delta identically to a ten-thousand-sample signal. The advisor captured only whether a recommendation was accepted, never whether the recommended skill's task actually succeeded, so there was no execution-success signal to rank on. Calibration records lived in an ephemeral tmpdir 50-record window, so there was no durable cross-session state to attest a drift baseline against or to persist an enriched skip reason into. And the BM25 shadow lane scored with a query-length-blind logistic midpoint.

**After**

The C4 shadow seam and a shared Beta-posterior primitive were built shadow-only behind `liveWeightsFrozen` (phase `004-c4-shadow-seam-beta-posterior`). An out-of-process promoter reads the estimator's proposal and writes the shadow-weight channel, a shared f64 Beta posterior `(a0+s)/(a0+b0+s+f)` with a cold-start neutral `0.5` replaces the raw-frequency cliff, and the aionforge promotion-gate family lands as two-gate promotion, held-out attestation, decay-driven un-promotion, content-addressed folding and sign-locked asymmetric deltas. The provenance-drift candidates were scoped and held (phase `006-provenance-drift-observability`). SA-attested-baseline-drift-sweep and SA-skip-never-fabricate stay PENDING behind the durable calibration substrate the tmpdir window cannot provide, with the drift sweep designed never to auto-rebaseline and the skip taxonomy designed to name a non-calibratable lane rather than force it to a fabricated score. The outcome-weighted ranking follow-on was built shadow-only (phase `007-outcome-weighted-ranking-followon`, the one genuine external miss from aionforge-procedural). It added a net-new execution-success emitter, a durable skill-outcome store, a shadow re-rank of `similarity x reliability x penalty` with a fresh skill at neutral `0.5`, an idempotent out-of-process ambient-tick and a prove-first query-length-bucketed BM25 calibration, all with the live fused sort proven byte-identical.

**Impact**

The shadow learning loop was closed into a real pipeline and exercised behind frozen weights without ever touching live routing. The Beta primitive is one shared math module with thin per-consumer adapters rather than three forks across the advisor, Deep Loop D2 and the outcome-weighted re-rank. Everything in this group stayed shadow-only or gated, so a bad shadow weight could not corrupt a single live recommendation.

**Why**

Every member here is either ranking-sensitive or unproven on live data, so each ships shadow-only or PENDING and names what it waits on. The C4 live flip is a recorded NO-GO until a micro-benchmark proves the Beta posterior out-earns the `minSamples` cliff, and even a correct posterior has no per-lane signal to tune until lane attribution exists, which is empty in production today. The attested-baseline drift sweep and the skip taxonomy wait on the durable calibration substrate co-owned with Deep Loop, because an attested baseline cannot live in an ephemeral tmpdir. The outcome-weighted ranking was the deepest gate of all, because its reliability posterior had no input until the net-new execution-success emitter accumulated real data. The flag-resolution reckoning that closed the 028 frontier then gave this frontier its verdict. The advisor outcome-weighted rerank stayed within noise on an empty ledger under a fair real-world load, so its code was removed and the phase folder remains as the record of the attempt and its negative result. The shared-infrastructure chain the rest of this group waited on, the durable advisor calibration substrate and the shared Beta posterior, is no longer a 028 dependency now that the flags it fed are gone.

---

## 4. OPERATIONAL CORRECTNESS: ADVISOR WORKSPACE-ROOT RESOLUTION

The newly moved phase: a deterministic root resolver that stops the advisor from scattering state across the repo.

**Before**

The advisor persists its generation state (`skill-graph-generation.json`) under `.opencode/skills/.advisor-state/`. Both the startup scan and the daemon initialization resolved that target with `process.cwd()`. When an advisor run or hook fired with a subdirectory as its working directory, for example the embedded `sk-design-md-generator/tool/`, which is its own npm project, the advisor wrote a `.opencode/skills/.advisor-state/` tree under that subdirectory. The existing `resolveWorkspaceRoot()` had an `import.meta.dirname` candidate with a fixed parent-depth that was wrong at runtime, because the compiled file lives one level deeper under `dist/mcp_server/`, so the function always fell back to `process.cwd()`. The result was 13 stray nested `.advisor-state` directories across the repo, gitignored and so never committed but real disk clutter and a sign of an incorrect root resolution.

**After**

Phase `008-advisor-workspace-root-resolution` rewrites `resolveWorkspaceRoot()` to walk up from the module location to the directory that actually holds `.opencode/skills/system-skill-advisor`, routes both `process.cwd()` write-path call sites through it and removes the pre-existing stray leaves in the main tree. The resolver now returns the repo root whether the module runs from source or from the compiled dist, and the cleanup removes only `.advisor-state` leaves, never a parent `.opencode` that holds other content.

**Impact**

The advisor no longer creates a nested `.opencode` tree when invoked from a subdirectory, the canonical state at the repo root is preserved and the stray nesting is gone. The change is internal to root resolution, so the public tool surface is unchanged and a revert is a single-file git revert.

**Why**

This is an always-on operational correctness fix, not a ranking change, so it lands without a flag or a benchmark gate. The one deploy caveat is that the advisor is a shared daemon, so the running process keeps the old compiled dist until a reconnect or a fresh session activates the rebuilt resolver. The sibling read-path depth in `resolveSkillGraphSourceDir()` does not create nesting and is recorded as a follow-up rather than pulled into scope.

---

## CURRENT STATE

The Skill Advisor subsystem of packet 028 shipped one always-on correctness layer and a default-off frontier on the `system-speckit/028-memory-search-intelligence` branch. The always-on members are corrections to behavior that was wrong or missing: the runtime lane-health degrade, the embedding-staleness detection signal and the workspace-root resolver. The default-off or shadow-only members are the ranking and learning seams: the RRF determinism spine, the conflict, query-class and exact-rerank routing refinements, the self-recommendation guard and the C4 Beta-posterior shadow chain. Each gated member is byte-identical with its flag unset and names the routing-agreement baseline, the held-out routing-quality benchmark, the reciprocal conflict edge or the durable calibration substrate it waits on. The flag-resolution reckoning that closed the 028 frontier then removed the advisor outcome-weighted rerank for staying within noise on an empty ledger, and the shared-infrastructure chain the learning frontier waited on is no longer a 028 dependency now that the flags it fed are gone. The remaining gated seams stay exactly where they are today, live order unchanged, until the evidence each names supports a flip.

---

The 2026-06-27 post-release drift audit + remediation (175 findings converged across packet 028, driven to 100% terminal — 131 fixed-verified, 44 false-positive) corrected residual documentation, config and metadata drift touching this track. The umbrella record is in the [028 before-vs-after.md](../before-vs-after.md) Section 12 and the [013 drift-remediation changelog](../changelog/000-release-cleanup/changelog-000-013-drift-remediation.md).
