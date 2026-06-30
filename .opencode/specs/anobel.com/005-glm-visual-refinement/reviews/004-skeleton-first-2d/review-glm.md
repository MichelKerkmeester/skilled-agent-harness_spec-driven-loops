## Verdict
**AGREE-WITH-CHANGES** — confidence 0.72 — The root-cause diagnosis and the "geometry belongs upstream, GLM is a renderer" thesis are correct and well-evidenced, but the plan treats the central untested assumption (that GLM will *obey* a deterministic skeleton) as near-certain, mis-specifies best-of-3, and front-loads 11-20h of build before the cheapest possible falsification test.

## What GPT-5.5 got right
- **Root-cause framing is airtight.** RC-1/RC-2/RC-3 are correctly classified as hard-fact geometry defects (overflow, collision, title-at-bottom), not taste — and they map cleanly to deterministic checks. Demoting GLM to a renderer is the right inversion.
- **best-of-3 is correctly placed *after* first verifier failure, not always-on** (AdaCoder-style adaptive escalation). This avoids 3× prompt cost on the easy majority.
- **Downgrade-to-linear as a total escape** (NFR-R02: "any tile that fails 2D twice always resolves") is the correct safety property — no crowded-geometry retry loop.
- **RC coverage is honest**: the spec explicitly says this phase closes RC-1/RC-2/RC-3 and does *not* claim to fix the refinement-tier defects. Good scope discipline.
- **Arm switch (`A5_ARM=control`) + rollback** is wired in, not bolted on.

## Gaps / risks / errors

1. **The crux assumption is untested and mis-rated.** R-003 ("GLM ignores the contract") is rated Likelihood **Low** with zero evidence. The entire ROI rests on GLM faithfully transcribing skeleton coordinates. IFScale / instruction-density literature says long constraint lists are exactly where models drift. If non-compliance is even ~15-20%, best-of-3 fires constantly, costs balloon past the −100..+400 token claim, and the premise ("skeleton replaces layout prose") inverts — you end up shipping skeleton JSON *plus* policing prose. **This likelihood rating is the single weakest claim in the doc.**

2. **best-of-3 is under-specified to the point of being non-algorithmic.** `compute-skeleton` is deterministic on fixed inputs (same Dutch copy, same 480×480). What varies across the 3 candidates? Row caps? Layout mode (hub-spoke vs matrix-3)? Font size? Node collapse ("+N more")? The plan is silent. As written, "recompute 3 candidates" is either trivially identical (pure waste, ~3× skeleton cost on every FAIL#1) or relies on unstated variation heuristics. This is a design hole, not an implementation detail.

3. **SC-004 (<10% downgrade rate) is a tunable, gameable metric — and it's misaligned with the goal.** Downgrade rate is directly controllable by loosening skeleton budgets. Loose budgets → low downgrade → sparse/ugly 2D tiles that still "pass." The guard should be **mean blind-audit score on shipped 2D tiles** (which SC-001 nominally is, but only if downgraded tiles are excluded from the 2D holdout — which creates survivorship bias the spec doesn't address). Either include downgrades in the 2D denominator or replace SC-004 with a shipped-quality floor.

4. **Canvas dimension inconsistency is a hard blocker.** User spec says **560×480** tiles; skeleton uses **480×480**. If 560 is the true outer canvas, every coordinate, region, and constraint constant in A5/A7 is wrong. The spec never reconciles this. Resolve before schema freeze — not as an open question.

5. **The 104px vs 112px title question is blocking, not deferred.** It changes `diagram_max_y` (320 vs 328), which ripples into every node placement, row cap, and AABB check. Listing it under "Open Questions" alongside soft items understates it — it's a schema constant that must be locked *before* `skeleton-schema.json` freeze (Milestone M1). Resolve against measured production Dutch copy in Phase 1, not Phase 3.

6. **"Measure Dutch copy before prompting GLM" is under-specified and quietly hard.** Pixel width of a string requires fixed font-family / size / weight / line-height — but the schema lets GLM pick "variant" and the renderer emits inline styles. If typography isn't pinned in the skeleton, copy measurement is a guess and the title-reservation math is unreliable (R-001, rated H/M, is correctly feared but its cause is in this gap, not just "prod fonts differ"). **The schema must own typography per text region**, not just geometry.

7. **No baseline-capture step.** SC-001 compares against a "35-58 baseline" scored under the *old* audit. The new verifier adds 6 geometry fields; pass/fail thresholds shift. Without re-baselining the old outputs through the *new* verifier, the +15pt delta is apples-to-oranges. The plan's Phase 3 skips straight to "confirm SC-001..SC-005." Insert a Phase-0 baseline capture.

8. **REQ-007 "linear untouched" is weaker than the mechanism guarantees.** Linear tiles bypass `compute-skeleton`, but the plan modifies the *shared* ship-gate (`_audit.mjs`). Additive fields can still flip a borderline linear tile's pass/fail if thresholds are reused. Specify: linear SHIP decision is byte-identical pre/post (additive fields only, no threshold reuse).

9. **Downgrade target list is internally inconsistent on whether compact-matrix is a terminal escape.** A7's `linearized` is terminal-linear; A5/downgrade.mjs lists "compact-matrix," which is still 2D-positioned and would re-enter the skeleton path. If compact-matrix reruns the skeleton, "downgrade" isn't an escape — it's a reshuffle. Pin the fallback chain to *genuinely linear* primitives (table / stacked-rows / list) only.

10. **Effort estimate is optimistic ~1.5-2×.** 8-14h for skeleton math (connector routing around labels, AABB gaps, legend row-cap variants) + render contract + best-of-3 variation logic + downgrade + a 6-field browser verifier extension is light. Schedule slip will compress Phase 3 verification — the part that actually proves the lift.

11. **Connector-anchor 4px tolerance is arbitrary and uncalibrated.** Subpixel rounding, SVG path stroke width, and Dutch diacritics can each consume pixels. An uncalibrated 4px threshold will either false-fail (→ spurious best-of-3 → spurious downgrade) or false-pass. Calibrate against measured render variance before locking REQ-002/edge-case spec.

## Strongest improvement / alternative

**Insert a Phase-0 "GLM-obeys-contract pilot" before any module work — hand-author skeletons for 2-3 sentinel tiles (e.g. `accountbeheer-4 matrix`, `oci-4 node`) and measure GLM-5.2's transcription fidelity under the render contract.** Cost: ~2-3h. Return: a measured non-compliance rate that either (a) validates R-003's "Low" rating and de-risks the whole 11-20h build, or (b) exposes that GLM ignores coordinates >15% of the time, in which case the deterministic skeleton alone is insufficient and you should sequence 005 (GPT-5.5 author) *before* — or alongside — 004, or reconsider whether a pure deterministic renderer (no GLM in the 2D path at all) is cheaper than a skeleton + policing + best-of-3 + downgrade stack. This is the single cheapest experiment that can falsify the program's central premise, and its absence is the plan's biggest methodological gap.

## One thing to test before building this phase
**Run the Phase-0 pilot above and report GLM-5.2's coordinate-compliance rate on hand-authored skeletons for 3 sentinel 2D tiles.** If compliance is <85%, the deterministic-skeleton-only thesis is in trouble and 004's scope/sequencing must change before you write `compute-skeleton.mjs`.