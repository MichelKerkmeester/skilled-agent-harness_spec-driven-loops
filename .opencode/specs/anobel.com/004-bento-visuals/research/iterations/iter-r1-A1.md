SKILL ROUTING: User directed → deep-research. I’ll run this as a read-only research iteration and fetch each listed source URL before synthesizing the contract change.The checked deep-research workflow is stateful and command-owned; this request is read-only and asks for a single returned markdown iteration, so I’m not creating research packet files. I’m fetching the three candidate sources directly and will keep the output citation-grounded.# A1 findings
## What the sources actually say
https://arxiv.org/html/2508.03560v1  
Technique: reduce layout burden by decomposing layout into bounded regions, then assemble with layout-preserving rules. LaTCoder divides designs into rectangular blocks with recorded bounding boxes, generates code block-by-block, then assembles using either absolute positioning or MLLM-based assembly plus a verifier. Mechanism: smaller bounded regions reduce the model’s need to infer global cumulative layout; recorded BBoxes preserve size/position; verifier uses screenshot similarity, MAE and CLIP. It reports large gains on complex layouts, including DeepSeek-VL2 CC-HARD TreeBLEU +66.67%, Visual Score +12.5%, MAE -38.53%. It also notes direct prompting loses layout even when told “always get the layout right.”

https://arxiv.org/html/2507.11538v1  
Technique: keep hard constraints few, early, explicit, and mechanically checkable. IFScale shows instruction following degrades as instruction density rises, with exponential/linear/threshold decay patterns, primacy effects favoring earlier instructions, and omission becoming the dominant failure mode under load. Mechanism: models drop constraints rather than partially apply them; placing critical constraints early helps until saturation. For this run, the implication is not “add more prose,” but “replace diffuse prose with a short invariant block and deterministic audit checklist.”

https://www.designersforest.com/dear-llm-heres-how-my-design-system-works/  
Technique: give the model structured design-system context, semantic tokens, layout intent, and “rules files” instead of relying on screenshot/prose interpretation. Mechanism: use Auto Layout by default, absolute positioning sparingly, semantic purpose-based tokens instead of primitive color names, annotations for behavior/accessibility, and split work into consumable bites because agents “choke” on too much context. This directly supports constraining bento tiles to flex/grid primitives and tokenized text-on-dark colors.

## How it maps to THIS run’s defects
RC-1 overflow is the direct match to LaTCoder’s finding that monolithic generation loses partial layout information. Your worst failures are cumulative-height failures: accountbeheer-4 at 35, orders-facturen-4 at 52, aangepast-assortiment-3 at 58, with `overflow:true` in 8 audit rows. A bounded safe-zone contract attacks the same mechanism: make the model allocate a panel region and reserved title band before drawing content.

RC-2 2D collisions match both LaTCoder and DesignersForest: absolute positioning can preserve positions when externally computed, but LLM-generated numeric coordinates cause collisions when no solver/verifier exists. For this prompt-only path, the correct move is to forbid absolute positioning for multi-node diagrams and force linear/flex/grid primitives unless the item is a badge/overlay.

RC-3 title-at-bottom failures are instruction-density failures. IFScale predicts omitted constraints under load, especially when the constraint is buried in prose. The bottom-title rule must become an early, named invariant with fixed reserved pixels.

RC-4 uppercase/glyph failures are also dropped-prose failures. Literal pre-cased eyebrow strings and a ban on `text-transform` are cheaper and more checkable than saying “Title case, NOT uppercase” in prose.

RC-5 contrast failures map to semantic tokens. The bad pairs, #4e4e4e-on-navy at 1.51:1 and #8591b3-as-text at 3.14:1, should be replaced by a required neutral-on-dark pair so the model does not invent gray text on navy.

## Concrete, testable recommendation
Replace the diffuse layout/style prose in `goal-prompt.md` with this early contract block:

```md
## HARD LAYOUT SAFE-ZONE CONTRACT

Canvas: each bento tile is exactly 480px high.

Vertical regions:
- Outer padding: 24px top, 24px left/right, 24px bottom.
- Bottom title band: reserve 104px at the bottom. Nothing may enter this band except the tile title and description.
- Visual panel max height: 304px. The panel must end at or above y=352.
- Gap between visual panel and title band: minimum 20px.

Layout primitive:
- Default to normal document flow: flex, grid, gap, padding.
- Do not use `position:absolute` for rows, cards, nodes, labels, arrows, legends, matrices, or flow diagrams.
- `position:absolute` is allowed only for a decorative dot, badge, or glow that does not contain text and cannot overlap text.
- If a diagram needs more than 3 nodes, 4 rows, or 2 branches, convert it to a compact linear-flow or stacked-list primitive.

Max content per primitive:
- Matrix/table: max 3 rows plus header.
- Approval/branch flow: max 3 cards total.
- Integration flow: max 3 nodes total.
- Legend: max 2 items, inline, inside the visual panel.
- CTA buttons: max 2, inside the visual panel.

Text and case:
- Use the eyebrow text exactly as provided, already pre-cased: "{EYEBROW_TEXT}".
- Do not use `text-transform: uppercase`.
- Do not substitute glyphs for required symbols. If unsure, use plain text.

Text-on-dark tokens:
- On navy/dark panels, body text must use `#E7ECF7`.
- Muted text on navy/dark panels must use `#B8C2D6`.
- Do not use `#4e4e4e`, `#666`, `#777`, `#8591b3`, or opacity-reduced gray as readable text on navy/dark backgrounds.

Z-order:
- Text is always above decorative shapes.
- Eyebrow, title, description, and CTA text must not be overlapped by any panel, card, node, badge, glow, or connector.

Before returning code, check these adversarial cases:
- 4 matrix rows: reduce to 3 rows or shrink row height so the panel stays within 304px.
- 6 matrix rows plus legend: collapse to top 3 rows plus “+N”.
- Bottom title: title and description remain fully visible inside the reserved 104px band.
- Flow with SAP/catalog/connection pill: no node, pill, or label overlaps another.
- Branch approval diagram: cards do not touch rounded tile edges.
- Eyebrow: Title-case literal text, one line, no `text-transform`.
- Navy panel text: contrast-safe token pair only.
- No clipped CTA, legend, final row, or title.
```

Implementation note: pass `{EYEBROW_TEXT}` as a literal per tile, e.g. `Vloot-functie`, not as an instruction to transform case.

## Predicted effect + cost
Predicted SHIP effect: likely +4 to +8 tiles on the current 45-tile register if the failures are concentrated in the 8 RC-1 and 3 RC-3 cases. Baseline is 27/45 = 60%; a conservative lift to 31-35/45 = 69-78% is plausible if overflow/title/case/contrast gates become mostly clean.

Predicted RC-specific effect:
- Overflow `overflow:true`: expected 8 rows down to 2-4, because the visual panel now has a numeric 304px cap and the title band is reserved.
- `title_at_bottom:true`: expected 3 known failures to recover unless GLM ignores the whole safe-zone block.
- `text-transform:uppercase`: expected grep count to reach 0 because the rule is literal and checkable.
- Contrast exit-0: expected pass for enumerated navy text pairs if generation uses the two required tokens.
- Diagram-vs-linear delta: should narrow by forcing high-risk 2D diagrams into stacked/linear primitives; do not expect it to fully close without a post-render overlap gate.

Cost:
- Prompt cost: roughly 220-300 added tokens if inserted once and replacing existing prose; avoid adding it on top of the old dense contract.
- Latency: negligible versus image/code generation, but IFScale argues against growing beyond this. Keep the hard invariant block under about 12-15 bullets/checks.

## Open questions for the next iteration
1. Which of the 8 RC-1 tiles still need diagram-specific primitive rewrites after the safe-zone block?
2. Does GLM-5.2 obey numeric caps better when expressed as CSS variables instead of prose?
3. Is `max 3 rows` too destructive for maritime-B2B credibility, or should overflow rows become a “+N vessels/orders” summary row?
4. Should the pipeline add a deterministic post-render bounding-box overlap gate for RC-2, since prompt-only collision prevention is weaker than verification?
5. What is the smallest adversarial checklist that preserves gains before the IFScale instruction-density cliff?