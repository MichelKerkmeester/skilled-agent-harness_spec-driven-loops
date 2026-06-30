SKILL ROUTING: User directed by “deep research iteration” → deep-research. I’ll fetch the three cited URLs and extract implementation-level mechanisms, then map them directly to the ledger defects and A3 pipeline decision.The three candidate URLs fetched successfully. Self-Refine’s GitHub page confirms the loop mechanics and visual iterative examples, but the fetched README does not itself contain the “+20% avg” number, so I’ll treat that number as user-provided grounding rather than source-confirmed from that URL.# A3 findings

## What The Sources Actually Say

All candidate URLs fetched successfully.

| URL | Concrete technique | Exact mechanism to reuse |
|---|---|---|
| `https://github.com/madaan/self-refine` | Self-Refine uses iterative `Init` → `Feedback` → `Iterate` prompts, including visual examples where GPT-4V writes diagram code and improves it iteratively. | Split generation into three prompt roles: first draft, critique with localized/actionable findings, then refinement from the critique. The project page also points to visual self-refine examples for diagram code. Citation: GitHub README, “Each task has three different types of prompts: Init, Feedback, Iterate” and “Use GPT4-V to write tikz code for diagrams, and improve them iteratively.” |
| `https://docs.z.ai/guides/vlm/glm-4.6v` | GLM-4.6V supports visual web-page iteration, direct screenshot/design input, and visual debugging. | Feed the rendered screenshot back to the model, optionally with circled problem areas and natural-language instructions. Citation: GLM docs, “Pixel-Level Replication” from screenshot/design to HTML/CSS/JS, plus “Visual Debugging: Users can circle an area on a generated page screenshot and give natural language instructions… The model automatically locates and corrects the corresponding code snippet.” |
| `https://arxiv.org/html/2508.03560v1` | LaTCoder replaces monolithic design-to-code with Layout-as-Thought: divide into bounded layout regions, generate per region, assemble, then verify. | Detect rectangular blocks/BBoxes, crop/generate block-wise, assemble by absolute positioning or MLLM-based assembly, then dynamically select via rendered screenshot metrics. Citation: LaTCoder §3, “layout-aware division, block-wise code synthesis, and layout-preserved assembly”; verifier score combines `0.5 * (1 - MAE/255) + 0.5 * CLIP`. |

Additional Self-Refine verification: `https://selfrefine.info` says feedback is actionable and localizes the problem plus gives an instruction to improve; it reports gains from at least 5% to more than 40%, and includes the public +20% average claim.

## How It Maps To This Run's Defects

RC-8 is the direct orchestration miss: 18/45 FIX findings were generated and discarded because the current pipeline stops after generate → gate → audit. Self-Refine and GLM’s visual debugging both support adding a refinement loop instead of discarding those findings.

RC-1 vertical overflow is render-visible and should be round-2 fixable. The failing examples are not semantic failures; they are visible layout-budget failures: `accountbeheer-4` scored 35 with row spillover, `orders-facturen-4` scored 52 with title clipped, `aangepast-assortiment-3` scored 58 with sixth row plus legend collision, and 8 audit rows had `overflow:true`.

RC-2 2D node collisions are also render-visible. `oci-4` scored 58 with the “Verbonden” pill overlapping SAP and truncating “MS V…”, while absolute-position counts were high: `oci-4 = 6`, `accountbeheer-4 = 4`, `goedkeuringssysteem-4 = 4`. This matches LaTCoder’s diagnosis that monolithic MLLMs lose partial layout and struggle with element positions/sizes.

RC-3 title-at-bottom failures are caused by the diagram claiming the whole canvas. `goedkeuringssysteem-4` scored 55 with `title_at_bottom:false`; same failure on `aangepast-assortiment-3` and `orders-facturen-4`. This needs a reserved title zone before generation, not only a prose reminder.

The linear-flow tiles already score 86-94, with SHIP examples like `kwartaalcijfers-2 = 94`, `accountbeheer-5 = 93`, `een-factuur-5 = 93`, `accountbeheer-1 = 92`. The bad band is the 2D-positioned primitive at 35-58. Routing by primitive is therefore more defensible than uniform treatment by index.

## Concrete, Testable Recommendation

Add this pipeline step to `goal-prompt.md` under the method section:

```md
### A3 Render-Feedback + Layout-Primitive Routing

Before generation, classify each treatment by layout primitive:

- `linear-flow`: stacked cards, rows, KPI bands, timelines, or simple left-to-right flows that can be expressed with flex/grid and no coordinate diagram.
- `2d-positioned`: node-link diagrams, hub/spoke, matrices, popovers, maps, branching approval flows, connector lines, overlaid pills, or any layout likely to need absolute x/y placement.

Route by primitive, not by treatment index.

For `linear-flow`:
Use the current Product V4/M2/D6 generation path.
Render the tile.
If any gate returns FIX, run Round-2 Render Feedback.

For `2d-positioned`:
Use a skeleton-first path before code:
1. Reserve fixed tile regions for a 480px tile:
   - Eyebrow zone: top 24-56px.
   - Diagram zone: max y=72-336px.
   - Bottom title zone: y=360-456px, always reserved before diagram layout.
   - No diagram element may enter the bottom title zone.
2. Produce a layout skeleton with BBoxes for every node, pill, connector group, legend, and row.
3. Validate skeleton before code:
   - No bbox overlap except intentional connectors.
   - Min 12px gap between nodes/pills/text blocks.
   - No bbox outside the diagram zone.
   - Max 3 visible matrix/table rows; if more items exist, aggregate into `+N` or a summary chip.
4. Generate code from the validated skeleton.
5. Render the tile.
6. Always run Round-2 Render Feedback for `2d-positioned`.

Round-2 Render Feedback input must include:
- The reference target image/spec.
- The rendered v1 screenshot.
- The v1 code.
- Structured audit findings with `RC-id`, visible evidence, and exact repair instruction.

Round-2 instruction:
"Fix only the named visual gaps. Preserve the concept, palette, copy intent, and bottom-left title rule. Do not add new content. Recompute the layout so cumulative content height fits the 480px tile. Prefer grid/flex constraints over raw absolute coordinates. Re-render mentally against the attached screenshot before returning code."

After Round-2:
Re-render and re-run gates. A tile may SHIP only if overflow is false, title is bottom-left, contrast exits 0, and no named RC-1/RC-2 collision remains visible.
```

Test as the proposed 3-arm experiment on the 18 FIX tiles:

| Arm | Pipeline | Success metric |
|---|---|---|
| A | Current single-shot baseline | Reproduce 27/45 SHIP, 18 FIX |
| B | Uniform Round-2 Render Feedback | Count FIX → SHIP conversions from render-visible repairs |
| C | Routed primitive path | Compare linear current path vs 2D skeleton-first plus mandatory Round-2 |

Primary metrics: SHIP-rate lift, FIX→SHIP conversion count, 2D tile score delta, overflow count, title-at-bottom pass rate, collision findings, contrast exit-0 preservation, wall-clock added per tile.

## Predicted Effect And Cost

Predicted, not confirmed until the 3-arm test runs.

Uniform Round-2 should convert roughly 5-7 of the 18 FIX tiles, moving SHIP from 27/45 = 60% to about 32-34/45 = 71-76%.

Routed skeleton-first plus Round-2 should convert roughly 8-11 of the 18 FIX tiles, moving SHIP to about 35-38/45 = 78-84%. Upside case is 13/18 conversions, which reaches 40/45 = 89%, matching the linear-treatment ceiling hypothesis.

Diagram-vs-linear delta should narrow from roughly 35-58 vs 86-94 to roughly 65-80 vs 86-94 if RC-1 and RC-2 are controlled. The remaining gap will likely be visual polish, connector quality, and glyph/copy discipline.

Contrast exit-0 should not regress if contrast remains a hard post-Round-2 gate. The refiner must not be allowed to SHIP changed colors without re-running contrast.

Cost: subscription GLM cost is effectively $0, so cost is wall-clock. Uniform Round-2 adds one render, one findings prompt, and one GLM dispatch per FIX tile, so budget about one extra GLM latency tail per revised tile: 6-161s plus render/audit overhead. Routed 2D adds a skeleton prepass for 2D tiles, so budget up to two extra GLM latency tails for each 2D FIX tile.

Token cost: exact token count is UNKNOWN without pipeline logs. Practical budget is about 2x generation tokens for Round-2 tiles because the prompt carries v1 code, screenshot/reference attachments, and structured findings.

## Open Questions For The Next Iteration

1. How many of the 18 FIX tiles classify as `2d-positioned` versus `linear-flow` under the primitive router?

2. Does GLM-5.2 support the same visual debugging loop documented for GLM-4.6V, especially attached render plus circled/named gaps?

3. What is the optimal reserved bottom title zone for these 480px bento tiles: 96px, 104px, or 112px?

4. Should MiniMax findings include visual BBoxes, DOM selectors, or both for best GLM repair compliance?

5. Does skeleton-first alone fix most RC-1/RC-2 defects, or is mandatory Round-2 still needed for 2D tiles?