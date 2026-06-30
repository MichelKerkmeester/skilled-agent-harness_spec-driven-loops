## Verdict
**AGREE-WITH-CHANGES** — confidence **0.60**. The core insight (two layout classes need different treatment) is directionally correct, but the spec treats a *correlate* as the *cause* and hard-codes designer intent instead of model behavior.

## What GPT-5.5 got right
- The 41-point gap is real and actionable; routing *before* generation is the right insertion point.
- A deterministic, auditable `treatment -> primitive` map is a clean, reviewable artifact.
- The `(d)` proof correctly shows that route-by-index would be wrong.

## Gaps / risks / errors
- **Correlation ≠ causation.** RC-1 overflow also hits linear-flow tiles (`een-factuur-1` 88, `favorieten-3` 78, `goedkeuringssysteem-1` 62/3 66). Routing by primitive won't catch those. The real root cause is missing spatial contract (title zone, max rows, safe area), not the primitive label.
- **Donut misclassified as `linear-flow`.** A radial donut/ring is not a linear-flow primitive. It scored 88 because *this one* rendered well, not because donuts are structurally linear. This weakens REQ-003.
- **Map encodes intent, not GLM output.** `concepts.md` says what the tile *should* look like; GLM may render a "list" with absolute positioning and overflow. The classifier has no runtime signal (`position:absolute` count, bbox overlap, overflow) so it can match labels perfectly while still missing failures.
- **Mandatory Round-2 for all 2D is unvalidated cost.** No evidence skeleton-first fixes RC-1, RC-3, or RC-4; it mainly targets RC-2. The phase assumes ~41 points of recovery without a measurement.
- **Repair policies are inert without Phase 001.** The `failure-only` linear path cannot fire until the gate lands, so this phase ships a branch whose main policy is untestable.

## Strongest improvement or alternative
Add a **runtime override**: use the static map as a prior, but after generation let the Phase 001 gate re-route any tile that actually overflows/overlaps/title-fails. Better still, route by a lightweight pre-generation complexity predictor (element count, estimated absolute-position count, row count) instead of a 45-row lookup, so re-briefs don't silently break the map.

## One thing to test or verify before building this phase
Run the Phase 001 gate on all 45 tiles and check whether the 10 manually-labeled 2D tiles are the *only* ones with overflow/overlap/title-zone failures. If any of the 35 "linear-flow" tiles also fail, the primitive classifier will miss real defects and the 10/35 split is the wrong optimization target.