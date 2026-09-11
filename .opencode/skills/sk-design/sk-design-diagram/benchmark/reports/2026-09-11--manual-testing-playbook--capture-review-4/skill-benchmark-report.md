# Skill Benchmark Report — sk-design-diagram

> Rendered from report.json (do not hand-edit). Scoring: `not-applicable-manual-outcome` · trace mode: `doc`.

**Verdict: PASS**

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | — | _not-applicable-manual-outcome_ |
| D1 intra (router) | — | _not-applicable-manual-outcome_ |
| D2 discovery | — | _not-applicable-manual-outcome_ |
| D3 efficiency | — | _not-applicable-manual-outcome_ |
| D4 usefulness | — | _not-applicable-manual-outcome_ |
| D5 connectivity | — | _not-applicable-manual-outcome_ |

## Provenance & execution context

_Repo-relative provenance — this archived report carries no absolute checkout path and stays valid when copied elsewhere._

| Field | Value |
| ----- | ----- |
| Skill root (repo-relative) | `.opencode/skills/sk-design/sk-design-diagram` |
| Captured at | 2026-09-11T08:55:24.613Z |
| Active manifest | `—` · digest `—` |
| Engine resolver | `—` |
| Source report digest | `—` |
| Executor / model | — / — (capture-review) |
| CLI version | — |
| Flag state | `—` |
| Runtime digest | `—` |
| Run revision | — |

## Funnel


## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| CAP-001 | manual | capture-review | — | PASS: PASS. Six judged reads on the settled full-page capture of assets/diagrams/swimlane.html at HEAD ed5f102287 (1280x813, scale 1, headless Google Chrome 153.0.8010.36 through the packet's shared renderer with --full-page; measured height 813 rather than the fixed 900 viewport, so this is a whole page and not a crop). What decided it: read 3 on assets/diagrams/architecture.html, the read that failed the third run, now holds - all five arrow-label masks clear every connector in that file by 8.0 units where three of them previously sat on or touched a stroke. RESP moved y=272 to 296, READ MDX 234 to 248, QUERY 298 to 284; confirmed by re-running the shipped label-mask-clearance family with its floor raised to 8 (no pair reported) and by eye at 6x on crop-resp.png and crop-zone-border.png, where the stroke runs unbroken past each label. Swimlane's own six reads, each with what decided it: read 1 PASS, a pairwise pass over every segment of all six connectors finds no intersection and no pair closer than 46.6 units against a 12-unit floor. Read 2 PASS, no box edge carries more than one endpoint so nothing can hide anything, though connector 2 still attaches at Open PR's bottom-right corner and Review content's top-left corner rather than the edge midpoints L*k/(N+1) gives. Read 3 PASS, HANDOFF [452,124,60x12] clears its leg by 8.0 and REVISE [576,240,52x12] clears its dashed return by 6.0, at the floor of the 6-10 band; both strokes traceable at 8x. Read 4 PASS, no connector enters a box that is not one of its endpoints. Read 5 PASS, exactly two accent elements in the drawing - the Deploy outcome box and the Approve-merge-to-Build handoff - plus the two legend keys that declare them; six occurrences of #eb6c36 in the file account for every mark. Read 6 PASS, one artifact changing hands across four owner lanes with a revision loop is what a swimlane encodes. Two taste notes recorded, not scored. Settle pair byte-identical (same sha256 across 5527ms). Skin pair differs by eye: apply-diagram-tokens.cjs RESULT PASSED moving the light accent #eb6c36 to #6d28d9, 1187 pixels differing, the Deploy border, the handoff arrow and both legend marks reading violet, zero stock accent hex left in the themed copy. Label-mask measurement: 7 arrow-label masks across the two files the scenario names as reference cases, 0 overflow, measured two ways after correcting the 1px whole-page shift the no-fonts render carries (fiducials painted into a throwaway copy and read back out of a real capture, giving y0=159 no-fonts against 160 with-fonts). A negative control proves the measurement is live: uncorrected, the same crops report 3 to 62 stray pixels on five of seven masks, and inside every mask 114 to 246 pixels genuinely changed, so the substitution happened and the clean result is not a comparison of identical regions. All 39 committed screenshots are byte-identical to a fresh full-corpus render, closing the two stale captures the third run found. Judgment on the four-unit floor: keep the number, fix the sentence under it. At the floor the gap reads - dp-integration's KERNEL and HTTPS at 4 units and sequence's five labels at 4 units all show a clean band of paper with the stroke unbroken. But the justification written into both the family and SKILL.md rule 12, that forms scale up about a quarter so four units lands near five pixels, is false for eight of the 38 forms, and wrongest on dp-integration, which is simultaneously the only 1.0x form and one of the forms sitting at the floor, so its four units are four physical pixels. Measured scale runs 1.0x to 1.648x, which means the same number means 4.0px on one form and 6.6px on another; the rule should be stated in rendered pixels or made scale-aware. Judgment on the HANDOFF proximity: a defect worth a finding, and bigger than that one label. The Open PR border's last painted pixel is x=592 and the H's first ink is x=594, one clean paper pixel, 1.2 units, so the word reads as a third line of the node rather than the name of the arrow leaving it; the cause is a 60-unit mask centred on a 40-unit segment overhanging 10 units onto a box the connector attaches to at its corner. A corpus scan finds 13 masks straddling a box or zone border, six of them arrow labels, with two visible outcomes depending on paint order: glued to the box where boxes paint last (swimlane, import-mermaid) or erasing a run of zone border where the zone paints first (architecture READ MDX 28 units and QUERY 12, import-drawio's two HTTPS labels). The fix is a mask-to-box clearance rule using the measurement the widened family already performs. Four findings outside the verdict's scope, none of them a traded defect: import-mermaid.html draws WRITES with no mask rect at all, live getBBox 711.6,308 28.8x10.4 sitting at gap 0 on its own connector's vertical leg, which breaks SKILL.md rule 7 and is invisible to the widened rule because a label with no rect matches neither detection path - so the widening fixed masks that exist and left labels lacking one untested; connector 5's 30-unit leg is still drawn on its own source box's bottom border, measured (93,72,75) against (94,97,110), and architecture does the same twice for 80 units each on the Astro Origin box, which the third run named and nobody fixed; the applicator rewrites hex literals only, so rgba(235,108,54,0.08) survives every palette change and the themed Deploy box ships a violet border round a coral fill, with 75 such literals across 32 of 38 forms; and sequence.html's 20-character label overruns its 96-unit mask by 9 ink pixels under substitution, harmless only because the mask fill there equals the page ground. The venn fix is real: the focal label is #2d3142 at 9.01:1 against the ground it actually sits on, up from 2.18:1, with the accent still marking the intersection as a tint. Step 2 is a SKIP inside an otherwise complete run: python3 -c 'import playwright' fails with ModuleNotFoundError: No module named 'playwright'; install with 'pip install playwright' then 'playwright install chromium'. The run continued on the packet's own shared renderer, whose output matches every committed screenshot byte for byte. |

## Methodology / caveats

- Manual playbook outcome; no Lane C dimension scoring applies.
- Scenario count: 1.
