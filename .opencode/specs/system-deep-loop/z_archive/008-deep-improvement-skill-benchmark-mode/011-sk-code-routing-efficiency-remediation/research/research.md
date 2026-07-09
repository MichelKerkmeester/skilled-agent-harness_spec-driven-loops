# Deep Research — sk-code Routing-Efficiency & Usefulness Remediation

> **Round 1** (§§1–11): synthesized from 3 native-Opus `@deep-research` iterations (converged at the planned stop). Recommended H1 surface-nesting + cross-surface overlay + H4 intra-surface ranking + asset deferral — all **shipped in phase 012**. Source: `iterations/iteration-00{1,2,3}.md`, `deltas/iter-00{1,2,3}.jsonl`.
> **Round 2** (§12): a post-012 follow-on — 5 iterations dispatched to **gpt-5.5-fast (variant high)** via cli-opencode, asking what is *left* to improve D3/D4 given 012's levers already ship. Source: `iterations/iteration-00{4..8}.md`, `deltas/iter-00{4..8}.jsonl`. Did **not** converge (newInfoRatio 0.86→0.48 at the planned max-5 stop) — the post-remediation D3/D4 space is richer than round-1's.

## 1. Question

How can `sk-code` load a tighter, task-appropriate resource slice that cuts **D3 over-routing** (live 42; routed ~16-20 vs gold ~5-8) and lifts **D4 routine-task usefulness** (≈49, task-dependent) **without regressing D1 routing or D2 discovery**?

## 2. Convergence Report

| Iteration | Focus | newInfoRatio | Outcome |
|---|---|---|---|
| 1 | Root cause + structural H1/H2 | 0.70 | Root cause isolated; H1 = primary structural fix |
| 2 | Dynamic H3/H4 + quantified frontier | 0.62 | H3 folds into H4; D2 was never 1.0; frontier quantified |
| 3 | Synthesis + recommendation + guard | 0.18 | Ranked deliverable; converged |

Stop reason: **converged at the planned iteration 3** (all 4 hypotheses resolved, all 4 REQs answered).

## 3. Root Cause (verified)

The `RESOURCE_MAP` keys on **intent only**; each intent value is a flat list that **unions Webflow + Motion.dev + OpenCode + universal** resources under one key. The §11 preamble documents this as intentional lossiness ("Surface is flattened … a replay that sees prompt text alone will over-route relative to a single surface"). The waste is therefore the **cross-surface half of every union**, concentrated in the 20-path `IMPLEMENTATION` and 21-path `LANGUAGE_STANDARDS` keys — not a routing-accuracy defect (surface detection is correct on 3/3 live scenarios, `surfaceMatch=true`).

D4 localizes the harm mechanistically: the same union that *helps* the domain-pattern task (CS-001 0.88 vs 0.78) *hurts* the routine task (LS-001 0.82 vs 0.95). The differential is the cross-surface contamination, not raw volume.

## 4. Quantified Frontier (recovered gold sets)

| Scenario | Surface | Gold refs | Routed | Wasted | D3 | D2 (baseline) |
|---|---|---|---|---|---|---|
| LS-001 | OPENCODE | 5 | 16 | 11 | 0.312 | **1.0** |
| SD-001 | WEBFLOW | ~11 | 20 | 12 | 0.40 | **0.727** |
| CS-001 | WEBFLOW+Motion | ~11 | 16 | 10 | 0.375 | **0.60** |

**Load-bearing fact:** D2 recall was **never 1.0** on SD-001/CS-001 — the union over-routes *and* under-recalls simultaneously. So the regression guard floor is the **measured baseline**, not 1.0. Also: `assets/*` paths are parsed (`expectedAssets`) but **never merged into scored gold**, so every routed `assets/*` counts as waste regardless of real usefulness (a measurement seam, not a routing defect).

## 5. Ranked Approaches

| Rank | Approach | D3↓ | D1/D2 safe? | Cost/risk |
|---|---|---|---|---|
| **1** | **H1 — surface-nested RESOURCE_MAP** | Highest (removes cross-surface half) | D1 safe; D2 safe **only with the cross-surface overlay** | Low — re-keys an already-reliable signal |
| **2** | **H4 — intra-surface intent-score ranking** (references only, no count cap; absorbs H3) | Medium (only dynamic lever that moves *scored* D3) | Safe only if intra-surface + references-only | Low-med |
| 3 | H2 — phase-gating | Low (within-surface, wrong-phase only) | D2 risk (implementation trio is a hard contract) | Med-high (weakest signal; projection drops the +5 phase boost) |
| — | H3 — lazy/progressive | None independently (no replay trigger; cost invisible to metric) | — | Do **not** build separately |

## 6. Recommendation (build-ready)

**Primary: H1 surface-nested map + a MANDATORY full, unranked cross-surface overlay. Complementary: H4 intra-surface intent-score ranking. Do not build H3 separately. Defer H2.**

Composition at route time (fixed order):

```text
route(prompt, surface, crossSurface):
  1. base    = DEFAULT_RESOURCE                                   # surface-agnostic preamble, always loaded
  2. intents = selectIntents(scoreIntents(prompt))                # H4 lever lives here
  3. primary = ∪ RESOURCE_MAP[surface][intent]                    # H1: detected surface slice ONLY
             + ∪ RESOURCE_MAP["UNIVERSAL"][intent]                # shared refs stay in a UNIVERSAL tier (no duplication)
  4. overlay = if crossSurface: ∪ RESOURCE_MAP[secondarySurface][intent]   # FULL, UNRANKED
             + if MOTION_DEV intent: MOTION_DEV_OVERLAY           # Motion.dev = peer category, additive
  5. ranked  = H4_rank_intra_surface(primary)                     # references only; drop sub-top intents / tighten AMBIGUITY_DELTA
  6. return base + ranked + overlay                               # overlay appended AFTER ranking, never ranked
```

- **H1 re-key**: `RESOURCE_MAP[intent]` → `RESOURCE_MAP[surface][intent]` (`WEBFLOW`/`OPENCODE`) + a `UNIVERSAL` tier for `references/universal/*` so shared docs aren't duplicated across cells (keeps the drift-guard coverage check green without combinatorial blow-up).
- **Asset deferral** (lowest-risk, highest single win): move all `assets/*` out of the first routed slice — zero scored-recall cost (no gold contains `assets/*`), removes SD-001's 5 checklists + recipe + 4 READMEs of pure scored-waste.
- **H4**: ranks only the single-surface `primary`, references only; never the overlay, never a raw-count cap (recall is exact/all-or-nothing).

## 7. Regression Guard (REQ-003) — for the follow-on BUILD phase

Run the deterministic `router-replay.cjs` + `score-skill-benchmark.cjs` harness over the **3 positive routing scenarios** (RD-002 excluded — negative advisor scenario, D3=0 is intended suppression). Gate the router change on ALL of:

- **D2 per-scenario ≥ measured floor**: `SD-001 ≥ 0.727`, `LS-001 ≥ 1.0`, `CS-001 ≥ 0.60` (NOT 1.0 — it was never 1.0).
- **D1-intra `surfaceMatch` stays `true`** on all three.
- **CS-001 cross-surface recall**: all 4 `motion_dev/*` + the webflow implementation/verification gold refs remain routed (proves the overlay is full+unranked).
- **Drift guard green**: `sk-code-router-sync.vitest.ts` — every routable `references/`/`assets/` doc reachable under ≥1 `(surface,intent)` or the `UNIVERSAL` cell; no orphaned doc.
- **Target**: D3 rises from `{0.40, 0.312, 0.375}` toward `≥ 0.6` per scenario with no D2 floor breach.
- **Sweep**: `AMBIGUITY_DELTA ∈ {0,1}` to confirm H4 ranking doesn't regress the legitimately multi-intent SD-001 (IMPLEMENTATION + ANIMATION, both gold-bearing).

## 8. Cross-surface Non-starvation Safeguard

`crossSurface=true` fires when (a) the §2 mixed-marker case is detected (a task touching both surfaces, e.g. a `.opencode/` preview server shipping Webflow animation libs — OPENCODE wins the single pick but the Webflow half is still needed), OR (b) MOTION_DEV intent fires on a WEBFLOW route (the CS-001 class). On fire, append the **FULL, UNRANKED** secondary-surface intent slice (+ `MOTION_DEV_OVERLAY` on case b), after H4 ranking. Mandatory because CS-001's gold needs all 4 `motion_dev/*` refs and its D2 baseline is already only 0.60 — a capped overlay would breach the floor.

## 9. Honest Limits (REQ-004)

- **D4 is n=2, single grader, "approximate."** The "routine hurts / domain helps" claim rests on one scenario each. The *direction* is corroborated by the D3 cross-surface-waste evidence; the *magnitude* (0.13 / 0.10) is not a stable estimate. BUILD phase should add a synthetic third routine scenario before generalizing.
- **Assets-scoring seam is real.** Deferring assets improves *scored* D3 at zero scored-recall cost, but the metric can't see a genuinely-useful checklist's value. Defer for the remediation; flag "fold `expectedAssets` into scored gold" as a separate benchmark-fidelity follow-on.
- **D2 = 1.0 likely unreachable without a gold↔map reconciliation.** SD-001/CS-001 route gold paths absent from the fired intents' map slices (genuine recall misses) — a gold-authoring-vs-map-coverage mismatch H1/H4 can't close. Hence the baseline-floor guard.
- **No post-fix D3 was executed** (research is charter-bound to no router edit). The actual post-fix number is the first thing the BUILD phase must verify live.

## 10. Handoff to the BUILD phase (open questions)

1. Run `routeSkillResources` against the surface-nested + reference-only + asset-deferred map; confirm D3 ≥ 0.6 with no D2 floor breach.
2. Sweep `AMBIGUITY_DELTA ∈ {0,1}` on all 3 positive scenarios.
3. Reconcile playbook gold ↔ RESOURCE_MAP: are the SD-001/CS-001 recall misses gold errors or map coverage gaps?
4. Decide the asset seam: defer-only (this remediation) vs fold `expectedAssets` into scored gold (separate packet).

<!-- ANCHOR:findings -->
## 11. Sources

Findings across `iteration-001.md`, `iteration-002.md`, and `iteration-003.md` cite these:

`sk-code/references/smart_routing.md` (§2 scoring, §3 tiers, §11 router + drift-guard note), `sk-code/SKILL.md` §2 (surface/phase detection), `sk-code/references/stack_detection.md`, `sk-code/references/phase_detection.md`, `sk-code/benchmark/live-final/skill-benchmark-report.json`, `sk-code/benchmark/live-final/d4-ablation.json`, `sk-code/manual_testing_playbook/01--surface-detection/webflow-detection.md`, `sk-code/manual_testing_playbook/07--cross-stack-routing/webflow-plus-motion-dev.md`, `deep-improvement/scripts/skill-benchmark/router-replay.cjs`, `deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`.
<!-- /ANCHOR:findings -->

---

# Round 2 — Post-012 Follow-on (gpt-5.5-fast, variant high)

## 12. The question, reframed

Round 1 asked *how to cut D3 / lift D4*; 012 shipped its answer (surface-nesting + cross-surface overlay + OpenCode language sub-slice + asset deferral), moving **router D3 19→33** and **live D3 42→50, D2 87→95, aggregate 71→79**. Round 2 asked the harder follow-on: **what is left, and how much of the remaining "gap" is the skill versus the benchmark instrument?** Five gpt-5.5 iterations, each grounded in real `file:line` evidence, converge on one uncomfortable headline:

> **Most of the remaining D3/D4 "gap" is a measurement problem, not a routing problem.** The live D3 gain is real but *bounded and partly unmeasured*; the asset-deferral slice of it is an artifact; and **D4 = 49 does not measure routine-task usefulness at all.** Before chasing more score, fix the instrument.

### 12.1 Real vs artifact — the load-bearing verdict

| Reported signal | Verdict | Evidence |
|---|---|---|
| Live D3 42→50 (stated-route efficiency) | **REAL** — H1 + language slicing genuinely route fewer/tighter paths (SD-001 20→16 routed, CS-001 wasted 10→5) | f-i8-01, f-i8-02 (`live-{final,remediated}/…json`) |
| Asset-deferral's share of the D3 gain | **ARTIFACT** — folding `expectedAssets` into gold moves D2 by **−9.55 pts** but D3 by **0.0000**, because the router filters every `assets/*` *before* D3 is computed | f-i4-02, f-i4-03 (`router-replay.cjs:241-243`, `score-skill-benchmark.cjs:102-118`) |
| Live D3 as a *cost* metric | **PARTLY UNKNOWN** — D3 scores the model's *stated* route, while its *observed* reads still include broad `references/**`/`assets/**` globs that D3 never counts | f-i6-04, f-i7-05, f-i8-03 (`live-executor.cjs:149-168`) |
| **D4 ≈ 49 (routine usefulness)** | **ARTIFACT for this question** — it is pre-remediation, n=2, **graded by a *hallucination* grader** whose own prompt says "do not score correctness/paths/planning", and post-012 D4 is hard-coded `null`/`unscored-mode-a` in every aggregate | f-i6-01, f-i6-02, f-i8-06, f-i8-09 (`d4-ablation.cjs:35-52`, `system-grader.md:3-4,22-41`, `score-skill-benchmark.cjs:254-264`) |

**Implication:** post-012 routine-task usefulness is genuinely **UNKNOWN**, not 49. Any further D3 tuning that is not paired with a real usefulness check can improve the score while silently hurting routine work.

## 13. Real D3 levers that remain (ranked)

| Rank | Lever | What it fixes | D3 effect | D1/D2 effect | Real or artifact |
|---|---|---|---|---|---|
| **1** | **Intent-signal coverage (gold↔map reconciliation)** | SD-001 misses `observer_patterns.md`/`webflow_patterns.md` because `gate`/`gated`/`IntersectionObserver`/`smooth-scroll` don't fire `IMPLEMENTATION`; CS-001's `Motion CDN`/`in-view`/`snippet` don't fire `MOTION_DEV` | may *lower* D3 (more routed) | **raises D2** (the actual bottleneck) | **REAL** behavior fix |
| **2** | **Live routing-discipline guard** | the model reads broad `references/**`/`assets/**` globs after sk-code loads — real token/tool cost D3 doesn't even score | real cost ↓ (unscored today) | none if exact-files-from-stated-route | **REAL**, needs a cost-aware metric to see it |
| 3 | **Webflow concern overlay** (`implementation`/`performance`/`verification`/`accessibility`/`motion`) | residual within-surface waste (Webflow has no sub-slice, unlike OpenCode's language slice) | small on SD-001 (already D3 0.833) | D2-safety conflict with the implementation-trio contract | partial; **not** a phase gate |
| — | **H2 phase-gating** | — | **not measurable** — the machine router declares "No phase boosts"; needs new machine state first | — | do **not** build as specified |

**Key reorientation (f-i7-04, f-i7-02):** SD-001's deterministic D3 is *already* 0.833 (1 wasted of 6) — its failing stage is **`discovered` (D2 0.4545)**, not efficiency. The remaining sk-code bottleneck on the canonical scenarios is **recall/coverage, not over-routing.** CS-006/CS-007 (perf/accessibility cross-stack) are the same story: low D2 from missing concern-intent mapping, not wrong-phase slicing.

## 14. Measurement-fidelity fixes (prerequisites — do these *before* chasing score)

1. **Prompt-source reconciliation (f-i5-01, f-i5-03).** The parser uses CS-001's *per-feature* prompt ("Motion CDN… in-view snippet") which fires no `MOTION_DEV`, while the *root-table* prompt ("motion.dev animations") does. Aligning them lifts CS-001 D2 0.20→~0.50, D3 0.286→~0.417 — **report this as benchmark cleanup, not a router win.**
2. **Deferred-asset lane (f-i4-09).** Score `expectedAssets` separately as `assetRecall` / `D4_asset_support`; do **not** fold assets into D3 (the router contract intentionally defers them). This stops asset deferral from reading as a pure D3 win.
3. **Observed-cost D3 variant (f-i7-03, f-i8-03).** Add a metric scoring actual read/glob breadth + time-to-first-expected-source from live tool events, distinct from stated-route D3.
4. **Prose↔logic contradiction (f-i5-06, f-i7-03).** `smart_routing.md` prose mandates the Webflow implementation-trio for *any* Webflow surface; route-time logic loads only matched intents. Reconcile: either always-load (accept D3 cost) or relax the prose/gold.

## 15. The D4-R instrument — the real answer to "improve D4"

You cannot *improve* D4 until you *measure* it. The build-ready design (f-i6-06, f-i8-13):

- **Prompt shape:** no-write, "produce a minimal patch plan / unified diff + the verification commands" — **not** the current routing-analysis JSON.
- **Score 4 axes:** task-action correctness · verification fit · contamination (no irrelevant cross-surface/-language advice) · hallucinated symbol/path risk.
- **Keep two numbers separate:** existing `D4_hallucination_delta` **and** new `D4_task_outcome_delta` — never collapse them (f-i8-05).
- **Integrate into the aggregator** (today `runD4Ablation` is never called by `run-skill-benchmark.cjs`; D4 is hard-coded null — f-i8-09).
- **Corpus already exists (f-i6-05, f-i8-11):** LS-001/002/003/004 + SD-002 are authored routine scenarios → n=2 becomes n=5 with no synthetic corpus. *Caveat (f-i6-07):* adding LS-002 moves D4 49→~49.5 — the gain is **honesty/stability, not a score bump.**
- **Real-gain criterion:** skill-on must improve task-action correctness *or* verification fit vs skill-off **without** increasing broad observed discovery.

## 16. Updated recommendation & sequencing

The post-012 work splits into a **fidelity track** (must precede any score claim) and a **behavior track**:

1. **Fidelity first:** prompt-source reconciliation (§14.1) + deferred-asset lane (§14.2) + integrate D4-R with the two-number split (§15). Outcome: honest, comparable D2/D3 and a *real* D4.
2. **Then behavior:** add the SD-001/CS-001 intent synonyms (§13.1) — accept the D3↔D2 tradeoff consciously, guarded by the round-1 D2 floors. This is the only lever that moves the true bottleneck (recall).
3. **Optional:** the live routing-discipline guard (§13.2) + observed-cost D3 (§14.3) if real exploration cost matters to the program.
4. **Defer/drop:** H2 phase-gating as specified (unmeasurable); a Webflow concern overlay only if §13.1 proves insufficient.

## 17. Honest limits (round 2)

- **Round 2 did not converge** (newInfoRatio 0.48 at iter 8). The fidelity/usefulness seam has more depth than 5 iterations covered — a further round (or the D4-R build itself) would surface more.
- **Exact live D3 artifact magnitude is UNKNOWN** — stored reports keep only trimmed `responseHead` + observed reads, not the full stated `assets` array (f-i4-06, f-i5-08).
- **All round-2 conclusions are static analysis** of the router/scorer/playbook code and the *existing* report artifacts — no new benchmark was executed. The D4-R lift is a *design*, not a measured result; the first thing its build phase must do is run it.
- These are **benchmark/skill-fidelity findings**, several of which live in `deep-improvement`'s scorer, not in `sk-code` — implementing them is partly a benchmark change, not only a skill change.

<!-- ANCHOR:findings-r2 -->
## 18. Round-2 sources

gpt-5.5 iterations 4–8 cite, beyond the round-1 set: `deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`, `…/live-executor.cjs`, `…/d4-ablation.cjs`, `…/run-skill-benchmark.cjs`, `…/browser-executor.cjs`, `deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader.md`, `deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs`, `sk-code/benchmark/{router-final,live-remediated}/skill-benchmark-report.json`, `sk-code/manual_testing_playbook/manual_testing_playbook.md`, and the `02--language-sub-detection/00{4,5,6,7}-*.md` + `07--cross-stack-routing/0{18,23,24}-*.md` scenario gold.
<!-- /ANCHOR:findings-r2 -->
