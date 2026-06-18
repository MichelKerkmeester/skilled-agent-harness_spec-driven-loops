# Iteration 20 (Round L): Reverse transfers (027 → 028)

## Focus
Cross-cut: where does 027's SHIPPED discipline fix or de-risk a 028 gap/candidate (the reverse direction)? Read-only.

## Findings (newInfoRatio 0.6)
**FIVE reverse transfers (027 → 028):**
1. **027 fail-closed always-on secret scrubber** at the head of the ingest/parse pipeline (`before-vs-after.md:31,29,523`, CLI-save lane `:503`) → ready-made TEMPLATE for 028's C8 ingest-trust gap (`roadmap.md:124,255`): answers WHERE (ingest head), HOW (fail-closed throw/refuse), WHETHER-to-flag (no — pure protection ships always-on). **HEADLINE.**
2. **027 always-on/default-off DOCTRINE** ("results-affecting → default-off+shadow; pure protections → always-on", `:11,3,37`) → resolves 028's C8 design question (pure protection ⇒ always-on) AND justifies C4-A default-on (`:103,169`).
3. **027 shadow-gated reducers** (signals collected→acted-on behind three-gate/shadow, `:127-147,139,143`) → fix TEMPLATE for 028's newInfoRatio computed-but-dropped (`convergence.cjs:285`; `roadmap.md:254`) AND the Beta scorer exported-never-imported (`004/research.md:18,52`). Identical computed-but-unconsumed shape; graduation recipe = extend output → shadow-emit → ingest behind evidence gate.
4. **027 audit-deny + tombstone-before-delete** (`:29,93,99,523`) → de-risks 028 C3-A edge-retirement (`roadmap.md:215`): the auditable reversible delete substrate already exists.
5. **027 flag-machinery LIVED EXPERIENCE validates 028's deflation** — 027 explicitly refused to count built-behind-flags as value ("a measured bet not yet cashed in… payoff is zero until live evidence", `:302`; promotion blocked pending live data `:115,119,123`) = exactly 028's "0-of-4 clean flips" + "no measured benefit number" (`roadmap.md:206,259`). 027's experience CONFIRMS the deflation.

LEVERAGE H (reframes C8 + the newInfoRatio fix as known patterns, not net-new).

## Most-likely-wrong
The headline de-scoping — that C8 can co-locate at 027's EXISTING scrubber stage. The scrubber sits at the parse-pipeline head; I did not verify that is the SAME site as the bypassed ingest point. If distinct pipelines, 027 transfers the PATTERN (fail-closed, ingest-head, always-on), not a reusable seam. → Round M (M2).

## Next Focus
Round M verifies the C8 scrubber-seam co-location (M2). Reverse transfers are a distinct ledger section (027→028).
