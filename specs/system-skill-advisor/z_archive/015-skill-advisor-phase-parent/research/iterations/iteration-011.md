# Iteration 11: Round D Adversarial Verification — Advisor Inferred Candidates (all REFUTED)

## Focus
Round D adversarial verification (default-to-refute) of 3 [INFERRED] Skill Advisor candidates (the galadriel-derived residue) against live code. Read-only.

## Verdicts (newInfoRatio 0.15 — all refuted)
| Candidate | Verdict | Evidence |
|---|---|---|
| SA-cooling-window | **REFUTED** | feedback-calibration.ts:230-237 — pressure feeds READ-ONLY proposals (`shadowOnly/liveWeightsFrozen/autoPromotion:false`), default-off (:142-147), min-samples=8 (:158). No cooling window, but the claimed "immediate threshold movement" risk is already neutralized by stronger non-temporal guardrails. |
| SA-keyword-category-drift-check | **REFUTED** | metadata-loader.ts:108 (`requireString(parsedJson.category)`) + projection.ts:357 — `category` is author-DECLARED metadata, NOT keyword-derived. No derivation surface → no drift to check; guards an impossible condition. |
| SA-scoped-hard-filter-degradation | **REFUTED** | advisor-recommend.ts:167 (`category_hint` = evidence-feature LABEL only) + affordance-normalizer.ts:288 (soft trigger); the only scoped/filter path (advisor-validate.ts:130) scopes outcome-records, not candidates. No hard-scope path drops lanes. |

## Synthesis
**All 3 REFUTED** — the galadriel-for-advisor residue (already low at 0.25 when mined) does not survive verification. The advisor's calibration is already conservatively guarded (read-only proposals, frozen live weights), category is author-declared (no drift surface), and there is no hard-scope degradation path to build on. **Confirms galadriel is fully saturated/non-applicable for the advisor.** The advisor's real net-new remains the trust/promotion gate cluster (Round B iter-7) + the contamination/drift families (iter-8) — NOT the galadriel residue.

## Next Focus
galadriel-advisor residue refuted → drop from synthesis. Advisor value = the C4 promotion-gate (Round C GO) + author-self-boost-guard + attested-baseline-drift (iter-8, still to verify). 
