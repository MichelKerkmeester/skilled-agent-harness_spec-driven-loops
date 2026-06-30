## Verdict
**AGREE-WITH-CHANGES** — confidence **0.62** — the diagnosis is correct and the downstream mechanism is directionally right, but the phase overestimates GLM's ability to honor a "contract" and underestimates the need for a deterministic renderer.

## What GPT-5.5 got right

- **Root cause**: RC-1/RC-2/RC-3 are genuinely geometry defects, not taste; moving coordinate placement out of GLM is the correct strategy.
- **best-of-3 upstream**: Recomputing skeleton candidates instead of re-prompting GLM for coordinates avoids the instruction-density death spiral (A5/A7 research).
- **Downgrade path**: A hard fallback to linear/stacked after two failures is the right safety valve.
- **Linear-flow negative control**: Keeping strong linear tiles away from the skeleton path is essential to avoid regressions.

## Gaps / risks / errors

1. **"GLM renders from skeleton" is underspecified — and probably unreliable.** The whole premise of RC-1/RC-2/RC-3 is that GLM-5.2 *ignores* spatial constraints in prose. Adding a JSON contract does not eliminate that failure mode; GLM can still emit `position:absolute`, inline `style="..."`, or extra rows. The spec relies on the model obeying a negative constraint ("do not invent coordinates"), which is exactly what it already fails at. **Concrete failure mode**: RC-2 node collisions persist if GLM adds a `transform: translate(...)` to "adjust" the skeleton.

2. **best-of-3 recomputes the same algorithm unless inputs vary.** The spec says "recompute up to 3 skeleton candidates upstream" but does not define what differs between candidates. If compute-skeleton is deterministic, the three outputs are identical. If inputs vary (font size, row caps, diagram region height), the spec must name the parameter sweep; otherwise the loop is theater.

3. **A5 vs A7 title-region conflict is a real blocker, not an open question.** A5 reserves 112px, A7 reserves 104px. Requirements SC-001/REQ-001 depend on this constant. The phase cannot be built without resolving it against production Dutch copy — "open question" status blocks implementation.

4. **Success criteria conflate geometry fixes with total audit score.** SC-001 targets 65-82 (+15-47 pts) but the 41-pt gap is not purely geometry. Even a collision-free diagram can score poorly on palette, typography, iconography, or semantic clarity. A more defensible target is "zero RC-1/RC-2/RC-3 defects in shipped 2D tiles" plus a smaller mean lift.

5. **Prompt cost claim is likely wrong.** The skeleton JSON example is ~800 tokens; complex node/connectors could hit 1500+. NFR-P01 claims −100 to +400 tokens vs. dense layout prose, but no baseline prose length is measured.

6. **10% downgrade rate target may be unachievable.** If production Dutch copy routinely overflows a 104-112px title band, deterministic skeletons will fail often. SC-004 should include a measured threshold rather than a fixed cap.

7. **Shared harness modifications create hidden linear-tile regression.** REQ-007 claims linear tiles bypass the skeleton path, but modifying `gen-tile.mjs` and `_audit.mjs` still touches the shared flow. "Drop ≤ 3 pts" is an assumption, not a verified guard.

8. **Missing renderer architecture.** The spec creates a skeleton-schema but does not commit to *who renders it*. A7's semantic-plan + deterministic renderer is more robust; this phase defers it but claims to implement A7.

## Strongest improvement or alternative

**Replace the "render contract" with a deterministic template renderer.** Do not ask GLM to honor a JSON contract; give it no coordinates to invent. GLM should output only A7's semantic plan (`tile_type`, `nodes`, `edges`, `copy`, `style_tokens`), and a small Node/Browser renderer maps each `tile_type` to a template that consumes the skeleton and writes the HTML/SVG. This structurally eliminates RC-1/RC-2/RC-3 instead of hoping GLM follows a negative rule.

If that is too large for this phase, the minimum viable change is: **ship a deterministic renderer for the five 2D treatments first**, let GLM produce the skeleton JSON, and validate that the rendered output matches the skeleton before any GLM-authored HTML is accepted.

## One thing to test or verify before building this phase

Run a **contract-fidelity probe**: manually create skeleton JSON for 3-5 real failing 2D tiles, prompt GLM-5.2 to render strictly from it, and measure what fraction of outputs contain any invented coordinates, `position:absolute`, transforms, or extra rows. If GLM violates the contract on >20% of tiles, the phase must pivot from a "contract" model to a deterministic renderer.