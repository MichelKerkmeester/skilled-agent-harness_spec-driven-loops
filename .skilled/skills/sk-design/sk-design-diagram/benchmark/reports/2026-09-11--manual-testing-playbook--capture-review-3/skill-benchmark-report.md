# Skill Benchmark Report — sk-design-diagram

> Rendered from report.json (do not hand-edit). Scoring: `not-applicable-manual-outcome` · trace mode: `doc`.

**Verdict: FAIL**

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
| Captured at | 2026-09-11T08:11:23.920Z |
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
| CAP-001 | manual | capture-review | — | FAIL: Six judged reads on the settled full-page capture of assets/diagrams/swimlane.html at HEAD 1b57a90d73 (1280x813, scale 1, headless Chrome 153.0.8010.36 through the packet's own render-screenshots.cjs --full-page; the capture is byte-identical to the committed screenshot, as are fresh renders of ten other forms). On swimlane all six reads hold and every defect the second run named there is closed. The FAIL is decided by read 3 run on the second labelled reference illustration this scenario names, assets/diagrams/architecture.html, where three of five arrow-label masks sit on or touch a connector stroke: READ MDX (584,234 60x12) is painted across the horizontal leg of its own connector at y=240 and QUERY (584,298 44x12) across its own at y=304, the stroke in both breaking for the label's width and resuming beyond it; RESP (172,272 32x12) has its top edge exactly on the HTTPS connector at y=272, a stroke that is not even its own, and clears its own dashed return at y=288 by 4.0 units against SKILL.md rule 12's 6-unit minimum. That is the same fault the second run failed swimlane for. Architecture's mask coordinates are unchanged since the library was merged, so it is a long-standing defect both earlier runs missed by judging a single file, not something the fixes broke; HTTPS and SSR there are clean at 8.0 units. Swimlane's own reads, each with what decided it: read 1 PASS, a pairwise pass over every segment of every connector pair finds no intersection and no pair inside 12 units. Read 2 PASS, no box edge carries more than one endpoint so nothing can hide anything, though connector 2 attaches at the bottom-right corner of Open PR and the top-left corner of Review content rather than the edge midpoints L*k/(N+1) gives for N=1. Read 3 PASS, both remaining masks clear their stroke where all three previously sat on it: HANDOFF (452,124 60x12) 8.0 units above its leg, 7.4 to the painted edge, with the whole 40-unit leg drawn and traceable, and REVISE (576,240 52x12) 6.0 units beside its dashed return, 5.4 to the edge, at the floor of the 6-10 band but clear. Read 4 PASS, no connector enters a box that is not one of its endpoints. Read 5 PASS, the accent is on exactly two elements and they are the right two, the Deploy outcome box and the Approve-merge-to-Build critical handoff, with the only other coral marks being the two legend keys that declare them. Read 6 PASS, one artifact changing hands across four owners with a revision loop back up a lane is what a swimlane encodes. Two taste notes recorded, not scored. Capture pairs: the settle pair is byte-identical (same sha256 across a 2229ms interval) and the skin pair differs by eye, apply-diagram-tokens.cjs RESULT PASSED with the light accent moved #eb6c36 to #0f766e, 1187 pixels differing and the Deploy border, the handoff arrow and both legend marks reading teal. Label-mask measurement: 7 arrow-label masks across swimlane and architecture, 0 overflow, confirmed two ways - after correcting a 1px whole-page shift the no-fonts render carries (the h1's fallback serif changes its line box, and the shift was found with magenta fiducials painted into a throwaway copy and read back out of a real capture rather than from a DOM dump), every mask shows zero changed pixels outside its own bounds, and every label's getBBox in the no-fonts render sits strictly inside its mask with at least 5.08 units of horizontal and 0.33 of vertical slack. Uncorrected, that same shift reported 14 to 217 stray pixels on six of seven masks, which is the measurement error this run was told to avoid. Of the second run's five open items, all five are closed but one closed badly: venn now carries the accent on its one focal intersection as type-venn.md requires, but 'Shippable' measures 2.18:1 against the ground it sits on where it was previously white on solid ink, against the palette's own 4.5 textOnPaper gate and a recorded accent departure that licenses the colour as a mark and not as text - the focal label is now the least legible text in a drawing whose other set labels measure 11.0:1, and derivation-gates cannot see it because venn carries no palette block. dp-integration is genuinely fixed: all nine coral connectors are muted, the arrow-accent marker is gone from the file, two boxes keep the accent and the legend declares it once. starter-full is down to one accent element in the drawing from six. The swimlane read-3 fix is real, with two consequences worth naming: the HANDOFF mask now runs 8.5 units under the Open PR box and its first glyph clears that box's border by 1.34 units, about 2 rendered px, so the label reads as glued to the box where at its old y it sat below the box entirely; and DEPLOY TRIGGER was deleted rather than relocated, which closes the symptom but leaves the cause, connector 5's 30-unit leg still drawn on the bottom border of its own source box, turning that stretch of border brown (93,72,75 against 94,97,110). Corpus check RESULT: PASSED, 38 files, 12 families, 0 errors - and it cannot hold this read: short-connector-labels only recognises a mask by a class carrying both 'label' and 'mask', which only 2 of the 38 files use, so swimlane's and architecture's masks are invisible to it. Step 2 is a SKIP inside an otherwise complete run: python3 -c 'import playwright' fails with ModuleNotFoundError: No module named 'playwright'; install with 'pip install playwright' then 'playwright install chromium'. The run continued on the packet's own shared renderer, whose output matches the committed screenshots byte for byte. |

## Methodology / caveats

- Manual playbook outcome; no Lane C dimension scoring applies.
- Scenario count: 1.
