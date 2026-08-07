# Iteration 3: Convergence — ranked approaches, the build-ready recommendation, and the exact regression guard

## Focus
Final iteration. Not new research — synthesis. Take the verified accumulated knowledge from iterations 1-2 (root cause = intent-only cross-surface UNION; H1 surface-nesting = primary structural fix; H2 = weak-signal complement; H3 folds into H4; H4 = intra-surface intent-score ranking, references-only, no count cap; cross-surface overlay must be FULL+unranked; D2 was never 1.0 so the guard floor is the measured baseline) and turn it into the decision-ready deliverable the spec requires:
- RANK H1-H4 against D3-reduction, D1/D2-preservation, cross-surface non-starvation, cost/risk, and drift-guard interaction (REQ-002).
- Recommend ONE primary approach (+ complements) with the precise composed build shape.
- Specify the EXACT regression guard: scenarios, dimensions, baseline floors, drift-guard constraint, target D3 (REQ-003).
- State the honest limits: n=2 D4 signal, the assets-scoring seam, whether D2=1.0 is even reachable, what the BUILD phase must verify live (REQ-004).
- Define the cross-surface non-starvation safeguard concretely: when it fires and what gets appended.

## Actions Taken
1. Read iteration-001.md and iteration-002.md in full — primary input; this synthesis carries forward F1-F16, not new tangents.
2. Read the strategy charter to confirm the deliverable contract (ranked approaches + one recommendation + D1/D2 regression guard + cross-surface non-starvation safeguard).
3. Read the phase `spec.md` to map the recommendation onto REQ-001..004 and SC-001/SC-002. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/011-sk-code-routing-efficiency-remediation/spec.md:98-111]
4. Confirmed the build shape and drift-guard against the live router: the §11 preamble documents the three intentional-lossiness points (surface flattened, no phase boosts, no doc-only anti-signals), and the drift guard `sk-code-router-sync.vitest.ts` fails if any RESOURCE_MAP path is missing on disk, if any routable `references/`/`assets/` doc stops being covered, or if a prose-named full path is absent here. [SOURCE: .opencode/skills/sk-code/references/smart_routing.md:289-297] Confirmed the IMPLEMENTATION union (20 paths spanning webflow/* + opencode/shared/* + 5 assets/opencode/checklists/* + recipes + READMEs). [SOURCE: .opencode/skills/sk-code/references/smart_routing.md:327-349]
5. Confirmed the delta format from the prior `deltas/iter-00N.jsonl` files (one `iteration` line + one `finding` line per conclusion) and that iteration-003 is the next/final record.

## Synthesis & Ranking

The four hypotheses are NOT four independent levers. Iterations 1-2 collapsed them onto a 2-lever frontier: a **structural** lever (H1) and a **dynamic** lever (H4, which absorbs H3). H2 is a separable, lower-leverage complement. The ranking below scores each on the five charter axes.

| Rank | Approach | D3-reduction potential | D1/D2 preservation | Cross-surface non-starvation | Cost / risk | Drift-guard interaction |
|------|----------|------------------------|--------------------|------------------------------|-------------|--------------------------|
| **1** | **H1 surface-nested map** | HIGHEST — removes the cross-surface half of every union; kills 9 of LS-001's 11 wasted webflow/* paths and the opencode/* authoring block from WEBFLOW IMPLEMENTATION (F2/F5) | SAFE for D1 (surface key already correct, surfaceMatch=true 3/3, F4); D2 PRESERVED only if paired with the cross-surface overlay (F6/F15) | REQUIRES the overlay — H1 alone STARVES the secondary surface on mixed tasks (F6) | LOW cost — re-keys an existing, reliable signal; intended behavior the §11 projection already cannot express (F1) | NEUTRAL-to-POSITIVE — every doc must stay reachable under ≥1 (surface,intent) cell; the sync test doubles as a free coverage/D2 guard (iter1 Rec3) |
| **2** | **H4 intra-surface intent-score ranking** (references only, no count cap; absorbs H3) | MEDIUM — the ONLY dynamic lever that moves the *scored* D3 in the stateless replay (F14); tightens the residual within-surface, weak-intent fraction H1 leaves | D1 SAFE; D2 SAFE only if ranking is intra-surface and references-only — a raw-count cap or cross-surface pruning breaches the D2 floor (F10/F15) | MUST NOT touch the cross-surface overlay — overlay is FULL+unranked; H4 ranks only within a single surface's selection (F15) | LOW-MEDIUM — uses `scoreIntents` numeric score / `AMBIGUITY_DELTA`; risk is over-pruning legitimately multi-intent scenarios (SD-001 fires IMPLEMENTATION+ANIMATION, both gold) | NEUTRAL — ranking changes the routed list, not the map's on-disk coverage; sync test unaffected as long as paths stay in the map |
| **3** | **H2 phase-gating** | LOW — attacks only the within-surface, wrong-phase fraction; cannot reclaim the cross-surface waste H1 already removes (F8) | D1 SAFE; D2 RISK if it defers the implementation trio (a hard contract, F7) | N/A | MEDIUM-HIGH — depends on the weakest signal in the router; the §11 projection drops the +5 phase boost entirely and there is no positive "implementation phase" marker (F7) | NEUTRAL | 
| **—** | **H3 lazy/progressive** | NONE independently — no trigger surface in the stateless replay; its only measurable effect is identical to H4's smaller-first-slice and its real cost (extra live round-trip) is invisible to the metric (F13) | — | — | DO NOT build as a separate mechanism | — |

**Why this ranking is forced by the evidence, not preference:**
- D4 ablation localizes the harm: the same union that helps the domain-pattern task (CS-001 0.88 vs 0.78) hurts the routine task (LS-001 0.82 vs 0.95), and the differential is the *cross-surface* half of the union (F3). H1 removes exactly that half; nothing else does.
- The scorer is exact, all-or-nothing per path (F10), and D2 is ALREADY below 1.0 on SD-001 (0.727) and CS-001 (0.60) (F12). That single fact reorders the whole problem: any approach that prunes by count or prunes the cross-surface overlay will breach the measured D2 floor. So the safe levers are surface-nesting (drops *wrong-surface* paths, which are never gold for the detected surface) and intra-surface intent ranking (drops *weak-intent same-surface* paths). Both prune only non-gold paths.
- H3 is not measurable on the benchmark that produces the D3 number (F13), so it cannot be ranked as a distinct deliverable; its measurable core IS H4.

## Recommendation (build-ready)

**Adopt H1 (surface-nested RESOURCE_MAP) as the PRIMARY remediation, with a MANDATORY full+unranked cross-surface overlay, and H4 intra-surface intent-score ranking as the COMPLEMENTARY second lever. Do not implement H3 as a separate mechanism. Defer H2.**

The three pieces compose in a fixed order at route time:

```text
route(prompt, surface, crossSurface):
  1. base   = DEFAULT_RESOURCE                         # surface-agnostic preamble, always loaded (4 paths)
  2. intents = selectIntents(scoreIntents(prompt))     # H4 lever lives here (see step 5)
  3. primary = UNION over intents of RESOURCE_MAP[surface][intent]   # H1: detected surface's slice ONLY
              + UNION over intents of RESOURCE_MAP["UNIVERSAL"][intent]  # surface-agnostic refs stay shared
  4. overlay = (if crossSurface)  UNION over intents of RESOURCE_MAP[secondarySurface][intent]   # FULL, UNRANKED
             + (if MOTION_DEV intent fired)  MOTION_DEV_OVERLAY            # Motion.dev is a peer category, additive
  5. ranked = H4_rank_intra_surface(primary)           # references-only; drop sub-top intents OR tighten AMBIGUITY_DELTA
  6. return base + ranked + overlay                    # overlay is appended AFTER ranking, never ranked
```

Build-shape specifics, all grounded in the prior iterations and the live router:
- **H1 re-key**: `RESOURCE_MAP[intent]` → `RESOURCE_MAP[surface][intent]`, `surface ∈ {WEBFLOW, OPENCODE}`, plus a `RESOURCE_MAP["UNIVERSAL"][intent]` tier for surface-agnostic `references/universal/*` so shared docs are NOT duplicated across every (surface,intent) cell — this keeps the drift-guard coverage check green without combinatorial duplication (iter1 OQ resolved). `DEFAULT_RESOURCE` and the preamble stay surface-agnostic. [SOURCE: .opencode/skills/sk-code/references/smart_routing.md:303-308,327-349]
- **Motion.dev**: stays an ADDITIVE peer overlay (`MOTION_DEV_OVERLAY`), appended only when MOTION_DEV intent fires — it is a peer category, not a surface (iter1 F5).
- **Cross-surface overlay**: FULL secondary-surface intent slice, UNRANKED (F15). This is the line H4 must not cross.
- **H4 ranking**: applies ONLY to `primary` (the single detected surface's selection), references only, NEVER `assets/*`-by-count and NEVER the overlay. Ranking key = intent score from `scoreIntents`; mechanism = drop intents strictly below the top instead of keeping the full `AMBIGUITY_DELTA=1` band, OR tighten the delta — to be swept in the build phase (F14).
- **Assets**: treat all `assets/*` as deferrable — move them out of the first routed slice. This is a clean efficiency win that costs ZERO real recall because no scenario's gold contains an `assets/*` path (F9). It is the lowest-risk component and addresses the largest single block of scored waste (SD-001's IMPLEMENTATION slice alone carries 5 checklists + 1 recipe + 4 READMEs).

How this answers the spec: REQ-002 (preferred approach + recall-vs-efficiency frontier) → H1+H4 with the quantified frontier from F11. REQ-003 → the guard below. REQ-004 → the Honest Limits section. SC-002 → one approach + its tradeoff against the surface-flattening behavior + the D1/D2 guard. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/011-sk-code-routing-efficiency-remediation/spec.md:103-119]

## Regression Guard (REQ-003)

The follow-on BUILD phase MUST gate the router change on ALL of the following, run via the deterministic `router-replay.cjs` + `score-skill-benchmark.cjs` harness over the three positive routing scenarios (RD-002 is EXCLUDED — it is a negative advisor scenario whose D3=0 is the intended suppression signal, F16):

**Scenarios under guard**: SD-001 (WEBFLOW, surface-detection), LS-001 (OPENCODE, language sub-detection), CS-001 (WEBFLOW + Motion.dev peer, cross-stack). RD-002 left untouched.

**Dimensions and baseline FLOORS** (must-not-drop-below; the floors are the MEASURED baseline, NOT 1.0, because D2 was never 1.0 — F12):
- **D2 (resourceRecall) per scenario**: `SD-001 ≥ 0.727`, `LS-001 ≥ 1.0`, `CS-001 ≥ 0.60`. A drop below any of these fails the guard.
- **D1-intra surfaceMatch**: stays `true` on all three (the surface key is already correct; H1 must not change which surface is detected).
- **Cross-surface recall (CS-001 specifically)**: all 4 `motion_dev/*` gold refs + the webflow implementation + `webflow/verification/verification_workflows.md` gold refs remain in the routed set — this is what the FULL+unranked overlay protects. If any are dropped, the overlay was incorrectly ranked/capped.

**Drift-guard constraint** (hard, separate from the replay): `npx vitest run skill-benchmark/tests/sk-code-router-sync.vitest.ts` stays GREEN — every routable `references/`/`assets/` doc must remain reachable under ≥1 (surface,intent) OR the UNIVERSAL cell, and every RESOURCE_MAP path must exist on disk. [SOURCE: .opencode/skills/sk-code/references/smart_routing.md:291] The surface-nested map MUST NOT orphan a doc into zero cells.

**Target (the improvement the guard permits)**: D3 rises from the baseline `{SD-001: 0.40, LS-001: 0.312, CS-001: 0.375}` toward `≥ 0.6` per scenario, achieved WITHOUT any D2 floor breach. The asset-deferral component alone should move SD-001 materially (its waste is asset-heavy).

**Procedure**: (1) snapshot baseline D2/D1/D3 from `live-final/skill-benchmark-report.json`; (2) apply the surface-nested map + asset deferral + intra-surface H4 ranking; (3) re-run the replay; (4) assert the floors above AND green sync test; (5) sweep `AMBIGUITY_DELTA ∈ {0,1}` to confirm H4 ranking does not regress the multi-intent scenarios (SD-001 IMPLEMENTATION+ANIMATION). Ship only if all floors hold and at least one scenario's D3 reaches the target.

## Cross-surface Non-starvation Safeguard (concrete)

**When it fires**: `crossSurface = true` when EITHER (a) the §2 mixed-marker case is detected — a task whose markers/targets touch BOTH surfaces (e.g. a `.opencode/` preview server shipping Webflow animation libs, the exact case §2 precedence is built for, where OPENCODE wins the single-surface pick but the Webflow-animation half is still needed), OR (b) MOTION_DEV intent fires on a WEBFLOW route (the CS-001 class — Motion.dev-on-Webflow cross-stack). [SOURCE: .opencode/skills/sk-code/SKILL.md:112]

**What gets appended**: the FULL, UNRANKED secondary-surface intent slice — `UNION over fired intents of RESOURCE_MAP[secondarySurface][intent]` — plus, on case (b), the `MOTION_DEV_OVERLAY`. It is appended AFTER H4 ranking and is itself NEVER ranked or capped. This is mandatory because CS-001's gold REQUIRES all 4 `motion_dev/*` refs and its D2 baseline is already only 0.60 (F15); a capped overlay would push it below floor and fail the guard. The single-surface lookup (H1) is the default; the overlay is the explicit escape hatch that prevents H1 from trading D3 waste for a D2 recall regression on mixed tasks (F6).

## Honest Limits (REQ-004)

- **D4 signal is n=2, single grader, "approximate" attribution.** The entire "routine task hurts / domain task helps" claim rests on ONE routine scenario (LS-001) and ONE domain scenario (CS-001). [SOURCE: .opencode/specs/.../spec.md:130] The DIRECTION is corroborated mechanistically by the D3 over-routing evidence and the cross-surface composition of the waste (F3), but the MAGNITUDE (0.13 harm / 0.10 help) must not be treated as a stable estimate. The build phase should add a synthetic third routine scenario before claiming the frontier generalizes; until then, D4 is directional only, exactly as the spec risk register requires.
- **The assets-scoring measurement seam is real and shapes the result.** `expectedAssets` is parsed but never merged into the scored gold, so EVERY routed `assets/*` path counts as waste regardless of genuine usefulness (F9). This means the D3 "improvement" from deferring assets is partly a measurement artifact: it improves the SCORED D3 with zero scored-recall cost, but if a checklist/recipe is genuinely useful on a real task, the metric cannot see that value. Recommendation: defer assets for the remediation (lower-risk efficiency win) AND flag the seam as a SEPARATE benchmark-fidelity finding (fold `expectedAssets` into scored gold) — out of THIS remediation's scope but worth a follow-on.
- **D2 = 1.0 is likely NOT reachable without a gold↔map reconciliation pass.** F12 showed SD-001/CS-001 route gold paths that are NOT in the fired intents' RESOURCE_MAP slices (genuine recall misses), and LS-001 hit 1.0 only because a co-selected intent happened to pull two gold paths from IMPLEMENTATION. So the residual recall gap is a gold-authoring-vs-map-coverage mismatch, not something H1/H4 can close. The guard therefore floors at the BASELINE, not 1.0. Whether the gap is a gold error or a map coverage gap can only be resolved by a reconciliation pass in the build phase (OQ below).
- **No post-fix D3 was executed.** This research is charter-bound to "no router edit." The frontier, gold sets, and waste composition are computed from primary data, but the actual post-fix D3 number requires running `routeSkillResources` against a modified map — that is the FIRST thing the build phase must verify live.

## Open Questions (handed to the BUILD phase)
- Run `routeSkillResources` against the surface-nested + reference-only + asset-deferred map and confirm D3 ≥ 0.6 per scenario with no D2 floor breach.
- Sweep `AMBIGUITY_DELTA ∈ {0,1}` (or sub-top-intent drop) on all 3 positive scenarios to confirm H4 ranking does not regress the legitimately multi-intent SD-001 (IMPLEMENTATION+ANIMATION, both gold-bearing).
- Reconcile the playbook gold against the RESOURCE_MAP: are the SD-001/CS-001 recall misses (D2 0.727/0.60) gold-authoring errors or real map coverage gaps? This decides whether D2 can ever reach 1.0 and whether the map needs coverage edits beyond the re-key.
- Decide the asset seam: defer-only (this remediation) vs fold `expectedAssets` into scored gold (separate benchmark-quality packet).

## Convergence note
Converged at iteration 3 of 3 (the planned stop). newInfoRatio for this iteration is low by design (~0.18): it produces no new primary findings — every input was settled in iterations 1-2 — and instead synthesizes F1-F16 into the ranked deliverable, the build-ready composition, the exact guard, and the concrete safeguard. The newInfoRatio sits below the 0.05 *delta* convergence intent in spirit only because this is a synthesis pass whose value is consolidation, not discovery; the simplicity/consolidation bonus applies. All four hypotheses are resolved (H1 primary, H4 complement, H3 folded, H2 deferred), all four REQs are answered, and SC-001/SC-002 are met. Deliverable is decision-ready for the follow-on BUILD phase. No further research iteration is warranted.
