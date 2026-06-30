## Verdict
**AGREE-WITH-CHANGES** — confidence 0.70 — the routing decision is real, but this phase ships a metadata layer for later phases, not a measurable fix; the success criteria test label fidelity, not score improvement.

## What GPT-5.5 got right
- The 41-point gap is real and bimodal (2D range 35-58, linear range 86-94, zero overlap in the cited extremes) — routing by primitive is a defensible design decision.
- The `(d)`-proof rationale is correctly argued: the route key must be the **layout primitive**, not the treatment index letter. `aangepast-assortiment-4` is a single-ring KPI, not a 2D diagram, and locking the route to the letter would have been a real bug.
- Decoupling routing from the actual fix (skeleton service in 004, GPT-5.5 author in 005, MiniMax adapter in 003) is sound: each phase has one job.
- Using `concepts.md §2` as the source of truth and annotating each map cell with its source form is the right hygiene for a manually transcribed lookup.

## Gaps / risks / errors

1. **Phase ships metadata, not a fix.** Both `failure-only` and `mandatory-round-2` policies are inert until phase 001's gate is live. The only runtime effect of THIS phase landing alone is emitting `skeletonFirst=true` for 10 tiles — the actual skeleton doesn't exist yet. If 001/004 slip, this phase produces nothing useful and the spec doesn't acknowledge that.

2. **Success criteria measure consistency, not improvement.** SC-001 ("10/35 split matches") and SC-002 ("`(d)` proof holds") both test that the label matches the *prior* manual labels — i.e. they test transcription fidelity to `iter-r3-A3.md`, not whether routing closes the gap. The 41-point claim is the load-bearing hypothesis and is not in the gate.

3. **The `aangepast-assortiment-4` (donut) = `linear-flow` label is suspect.** A donut is **radial**, not linear. The justification ("single stat ring, not a complex 2D diagram") conflates *complexity* with *layout primitive*. If the primitive is "what CSS shape is this?", a donut is its own category. Score=88 may be a property of donut-specific prompt strength, not of being in the linear bucket. Risk: a future 2-ring or 3-ring KPI donut gets routed to `linear-flow` and inherits a different failure mode than the spec's "primitive" model predicts.

4. **The taxonomy is binary, but the failure modes aren't.** `RC-1` (vertical overflow) hits BOTH primitives: `favorieten-3` at 78 SHIP and `goedkeuringssysteem-1` at 62 are overflow cases on tiles the spec labels `linear-flow` (or does it? — `favorieten-3` is not in the explicit 10-tile list, but its 78 score is *below* the linear cluster's 86 floor and *above* the 2D ceiling of 58 — it sits in a no-man's-land the spec doesn't address). `RC-2` (node collision) is 2D-only. `RC-3` (title-at-bottom) is mixed. The binary primitive can't cleanly route these.

5. **The 10/35 split is presented as frozen ground truth, but the labels in `iter-r3-A3.md` were authored after seeing the scores.** Risk of post-hoc rationalization: the 10 lowest-scoring tiles were called "2D" because they failed, not because `concepts.md §2` independently said so. The spec should show the **agreement** between the score-bucket assignment and the `concepts.md` wording as a separate audit, not assert it as frozen.

6. **Manual transcription error is unguarded.** 45 entries, hand-keyed from `concepts.md §2` with no automated check. One wrong cell → silent misclassification. There is no test that runs the model and verifies the labeled primitive matches the rendered layout. Without that, the map is a trust-me artifact.

7. **The `failure-only` linear policy is dead-code-shaped.** Linear tiles score 86-94 already. The gate FIX rate on those is presumably low. The policy exists for completeness, but its actual firing rate is unestimated — if it never fires in the 45-tile corpus, the linear branch is just the original pipeline with a comment.

8. **Borderline entries are punted.** `aangepast-assortiment-2` ("funnel/scope"), `favorieten-2` ("folder tree"), and `favorieten-3` (78 SHIP, overflow) are listed in `RC-1`/`open_questions` but not resolved. The "curated per-tile primitive" decision is just deferred to a human, with no rule for new concepts that arrive after the program ends.

9. **The plan's "manual run of `gen-tile.mjs` printing the resolved `{ primitive, route }` per tile without calling the API" is a smoke test, not verification.** It confirms the lookup returns a value; it does not confirm the routing decision is correct against the rendered output.

## Strongest improvement or alternative

**Add SC-003: a 5-tile pilot that measures whether routing actually moves the score.** Pick 5 of the 10 labeled `2d-positioned` tiles. Run them twice — once through the current single-pipeline baseline, once through the routed path with a *hand-stubbed* skeleton (one node per tile at the canonical bbox, no real geometry) plus one mandatory Round-2. Compare the SHIP scores. If the routed path doesn't move at least 3 of 5 tiles by ≥10 points, the routing hypothesis is wrong and the rest of phases 003-005 are building on a false premise. This costs ~5 GLM calls and turns this phase from a metadata exercise into a falsifiable claim. If SC-003 passes, you have evidence to build phase 004 on; if it fails, you discover it now, not after phases 003-005 ship.

Alternative cut: **merge this phase into phase 001 (gate).** The classifier output is consumed by the gate (failure-only vs mandatory-round-2). Putting both in one phase avoids the "phase 002 is metadata-only waiting for 001" smell and reduces inter-phase integration risk by one boundary.

## One thing to test or verify before building this phase

**Independent primitive labeling audit.** Take 5 random tiles (not the 5 lowest-scoring 2D ones, not the 5 highest-scoring linear ones — pick from the middle of the 45-tile distribution). Without seeing the score, have a second human label each as `linear-flow` or `2d-positioned` from `concepts.md §2` alone. Compare against the spec's frozen labels. If agreement is <100%, the labels are not as `concepts.md`-grounded as the spec claims — they're partially score-driven — and the map's claim to be a "general principle" is weaker than presented. This audit takes 20 minutes and pre-empts the strongest critique of the program: that 2D is just a label for "tiles that already failed."