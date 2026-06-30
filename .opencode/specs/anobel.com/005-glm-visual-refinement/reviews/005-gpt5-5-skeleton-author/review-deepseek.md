## Verdict
**AGREE-WITH-CHANGES** — confidence 0.73 — The strategy (expensive model solves layout; cheap model renders) is correct, but the proposal overestimates skeleton leverage because RC-3/Rc-4 are instruction-following failures, not spatial, and the scaffold-to-GLM handoff is an untested assumption that could nullify the entire phase.

## What GPT-5.5 got right
- **Role partition**: GPT-5.5 as skeleton author only, never tile code; GLM-5.2 stays renderer. This avoids spending paid tokens on CSS/HTML boilerplate.
- **Cost discipline**: `<=1` call + `<=4200` tokens per tile, batch budget derived from `N_2D`, and linear-tile exclusion (they score 86-94 already).
- **Hard canvas contract**: diagramFrame / titleFrame / coordinate-system spec is concrete and machine-verifiable.
- **Escalation trigger logic**: `trigger_gpt55_if` / `skip_gpt55_if` rules correctly exclude linear primitives and low-item-count tiles.

## Gaps / risks / errors

**GAP-1: No deterministic geometry validator between GPT-5.5 output and compile.** JSON schema validation (REQ-002) only checks shape (`0 <= x <= 1000`), not geometry correctness (bbox overlap, cumulative row height, title-zone encroachment). GPT-5.5 can return a schema-valid skeleton where two nodes collide exactly like RC-2 (oci-4, score 58: 6 `position:absolute` elements, pill overlaps SAP card). A 50-line validator that checks bbox-bbox overlap, cumulative row height ≤ 312px, and title-zone clearance would catch these before GLM ever sees them — and could feed validation errors back for a retry within the 1-call budget, making +3 recovery more achievable.

**GAP-2: The scaffold-to-GLM handoff is an untested assumption (high blast-radius).** The entire phase assumes that a locked HTML/CSS scaffold (`data-layout-id`, `top`, `left`, `width`, `height`) constrains GLM-5.2's rendering. But RC-3 (title-at-bottom failure — goedkeuringssysteem-4 score 55, aangepast-assortiment-3 score 58, orders-facturen-4 score 52) is **exactly** a case where GLM drops explicit constraints. If GLM rewrites absolute-positioned elements ≥30% of the time, GPT-5.5's skeleton is no more useful than the deterministic one — and the phase delivers zero recovery for paid spend. A 5-tile micro-test feeding hand-crafted locked scaffolds to GLM and measuring geometry preservation rate should gate this phase.

**GAP-3: GPT-5.5 addresses only RC-1 and RC-2, not RC-3 or RC-4.** The root-cause ledger has 4 RCs:
- RC-1 (overflow):  ✓ skeleton can fix via cumulative-height computation
- RC-2 (collisions): ✓ skeleton can fix via bbox-overlap avoidance
- RC-3 (title position): ✗ instruction-following, not spatial — GLM drops the "title bottom-left" pin regardless of skeleton quality
- RC-4 (eyebrow ALL-CAPS/wrap/glyph): ✗ text formatting, not spatial — irrelevant to skeleton

If RC-3 and RC-4 failures persist on the 2D holdouts (and the forensic audit shows they appear on 3 of the 5 lowest-scoring tiles), the +3 recovery bar is mathematically constrained: even perfect RC-1/RC-2 fixes can only recover tiles where RC-3/RC-4 weren't the dominant defect. The spec should acknowledge this ceiling.

**GAP-4: The `+3` go/no-go bar conflicts with the research's own prediction.** The research predicts +1 to +3 recovery at confidence 0.78. Setting the go/no-go at the upper bound of the predicted range means the phase rejects itself even at median performance (+2). Given the 0.78 confidence, there's a ~40% chance the true effect is below +3 even if the mechanism works — a Type-II error that discards a working solution. Consider +2 as provisional-accept with a cost-effectiveness gate instead.

**GAP-5: Missing GPT-5.5 API failure/timeout handling.** The plan's rollback section mentions disabling the feature flag, but the in-line path during a batch run is unspecified: what happens when `opencode run` hangs after 30s? The `gen-tile.mjs` main loop needs a timeout + catch that falls through to the deterministic skeleton path without blocking the batch.

## Strongest improvement or alternative

**Add a deterministic geometry validator between GPT-5.5 output and the phase-004 compile step**, plus feed validation failures back for one retry (within the existing 1-call budget since the validator is free). This validator checks: (a) no bbox-bbox overlap exceeding the 16px min-gap, (b) cumulative row/row-gap heights ≤ 312px, (c) no element y+h encroaches into the title guard zone (y > 336), (d) visible row count ≤ 4. If the skeleton fails validation, the error report is appended to the prompt for a second GPT-5.5 attempt before falling through to downgrade-to-linear. This is the single highest-ROI change because it prevents GPT-5.5 geometry errors from cascading through GLM's already-fragile rendering, and costs zero additional paid tokens (the validator is deterministic code).

## One thing to test or verify before building this phase

**Micro-test: Can GLM-5.2 respect a locked HTML/CSS scaffold?** Hand-craft 3 skeleton-compiled scaffolds (one matrix, one node-diagram, one branch) with `data-layout-id`, explicit `top`/`left`/`width`/`height` on every positioned element, and a hard title-zone guard (`y:368-480` reserved). Feed each to GLM-5.2 (3 render passes per scaffold) and measure: (a) % of elements where GLM's output preserves the exact pixel position (±4px tolerance), (b) % of renders where the title stays in the bottom zone, (c) % of renders where no element enters y=336-368. If element-position preservation is <85% or title-zone violation is >20%, this phase is dead on arrival — no amount of GPT-5.5 skeleton quality can overcome an unconstrained renderer.