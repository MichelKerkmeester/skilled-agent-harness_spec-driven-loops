# Iteration 37 (Round N adversarial): peck ≈ adversarial-verify convergence — HOLDS

## Focus
Adversarially verify the M10 "same anti-pattern" framing (peck fingerprint-never-recomputed ≈ 028 newInfoRatio-never-ingested). Read-only.

## Findings (newInfoRatio 0.5)
**VERDICT: SAME-ANTI-PATTERN HOLDS (with residuals).** The shared load-bearing defect is a decision-informing self-assessment that is computed/stored AND named in the decision's own rationale, yet never wired into the decision logic.
- 027: completion verdict "bound neither to a content fingerprint nor a clean working tree" (`006-peck-verification-discipline/spec.md:75`).
- 028: `convergence.cjs:285` literally promises "STOP is allowed pending newInfoRatio agreement," yet `computeCompositeScore` (`:107-141`) + the decision (`:378-381`) never read it. The "stated-intent-of-consumption-never-wired" parallel defeats the coincidence reading.
- 027's warn→error flag rollout (`SPECKIT_COMPLETION_FRESHNESS`, `:120-121`) is the transferable fix template. LEVERAGE M.

## Residuals / corrections
- **Dormancy is weaker than claimed:** newInfoRatio IS consumed by the deep-research PROSE loop protocol (`loop_protocol.md:161,277`) — so it's dormant in the *structured* convergence module, not system-wide (the fingerprint is consumed-by-no-path; imperfect match).
- **CITATION FIX:** iter-020's "shadow-gated reducers spec.md:127-147" is wrong — `:127-147` is the Out-of-Scope/Files tables; the actual shadow mechanism is the warn→error rollout at `:120-121`. Correct in the ledger.
- 027 carries a second defect (staleness/never-recomputed) with NO 028 analog (newInfoRatio is freshly computed each iter) — the shared abstraction is strictly the non-consumption sub-defect.

## Next Focus
Reverse-transfer #3/#6 holds as the non-consumption sub-defect with the corrected citation. Methodological convergence (027 peck ≈ 028 adversarial-verify) stands.
