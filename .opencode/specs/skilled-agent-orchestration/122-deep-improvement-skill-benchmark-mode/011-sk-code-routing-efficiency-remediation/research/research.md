# Deep Research — sk-code Routing-Efficiency & Usefulness Remediation

> Synthesized from 3 native-Opus `@deep-research` iterations (converged at the planned stop). Source iterations: `iterations/iteration-00{1,2,3}.md`. Canonical findings ledger: `deltas/iter-00{1,2,3}.jsonl`.

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

## 11. Sources

`sk-code/references/smart_routing.md` (§2 scoring, §3 tiers, §11 router + drift-guard note), `sk-code/SKILL.md` §2 (surface/phase detection), `sk-code/references/{stack_detection,phase_detection}.md`, `sk-code/benchmark/live-final/{skill-benchmark-report.json,d4-ablation.json}`, `sk-code/manual_testing_playbook/{01--surface-detection/001,02--language-sub-detection/004,07--cross-stack-routing/018}`, `deep-improvement/scripts/skill-benchmark/{router-replay,score-skill-benchmark,load-playbook-scenarios}.cjs`.
