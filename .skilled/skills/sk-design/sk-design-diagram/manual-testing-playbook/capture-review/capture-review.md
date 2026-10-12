---
title: "CAP-001 -- Capture review of the rendered corpus"
description: "This scenario validates the judged capture review for `CAP-001`: the six reads a reader answers from a rendered capture, the skin-pinned and settled capture pairs, the font-substitution label-mask measurement, and the threshold that graduates a read into the corpus checker."
version: 1.1.0.0
---

# CAP-001 -- Capture review of the rendered corpus

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CAP-001`.

---

## 1. OVERVIEW

This scenario validates the judged capture review for `CAP-001`. It focuses on the six reads a reader answers from a rendered capture, the skin-pinned and settled capture pairs, the font-substitution label-mask measurement, and the graduation threshold that moves a read out of the eye and into the corpus checker.

### Why This Matters

The corpus checker holds every rule a regex over an SVG can hold, and its own header names what it does not:

> - pairwise connector geometry (overlap, the attach fan, the visible label gap, a route behind a box) needs a 2D pass over parsed paths, not a regex; until one exists the eye holds it
> - focal balance, type fit, the remove test and taste are judgments

Those two bullets are this scenario. The first names four faults that live in the relationship between strokes and boxes — a shared stroke path, an attach fan that collapsed, a label sitting on its line, a route hidden behind a box — rather than in any single tag. The second names the reads that have no mechanical form at all. The header's closing line, that those live in the capture review and that a judgment which becomes computable moves in and is logged, is the contract this scenario runs under and the reason the root playbook carries a graduation log.

A capture is the only artifact that can answer these reads. A file can hold a rounded elbow, an opaque mask rect, and a fanned attach point and still draw a fault, because the drawn result depends on what the renderer did with the text: a substituted font moves a label's metrics, and a mask sized for Geist Mono no longer covers the glyphs it was drawn around. That is also why a green corpus run is a precondition here rather than a substitute — a green run means everything the regex could hold held, and leaves these reads exactly where they were.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CAP-001` and confirm the expected signals without contradictory evidence.

- Objective: verify a rendered capture of a corpus illustration against the six judged reads, on a capture pair that proves the skin reached the paint and a settle pair that proves the drawing had stopped moving
- Real user request: `Here's the render of the diagram that's going into our docs — tell me what a person actually sees wrong with it before we publish.`
- Prompt: `Capture assets/diagrams/swimlane.html at scale 1 and review the settled capture at the eye: answer the six judged reads, report each with its reason, take the skin-pinned capture beside the stock one, compare the two captures of the settle pair, and measure every arrow-label mask in the no-fonts render against the with-fonts render. Persist the outcome.`
- Expected execution process: the agent renders the corpus file through the local browser at scale 1 so a mask rect's coordinates land on the pixels it names, captures it twice with a settle interval between and reviews the second, re-themes the same file through the applicator from a token source whose accent differs and captures the themed copy, answers the six reads from the settled capture, then runs the label-mask measurement on the with-fonts and no-fonts renders and persists the outcome.
- Expected signals: three captures of the one file (stock, skin-pinned, settled); the skin pair differs by eye in paper, ink, or accent; the settle pair matches; all six reads answered with the reason that decided them; two taste notes recorded but not scored; no arrow-label mask shows ink outside its own bounds in the no-fonts render; the outcome persisted with a reason on any `SKIP`.
- Desired user-visible outcome: an operator-readable verdict on whether the diagram is clean to the eye, backed by the captures that show why.
- Pass/fail: PASS if all six reads hold on the settled capture, the skin pair differs by eye in paper, ink, or accent, the two captures of the settle pair match, and no label mask overflows in the no-fonts render; FAIL if any read fails, the skin pair reads the same, the settle pair differs, a mask overflows, or the outcome is persisted with an empty reason; `SKIP` only when a named blocker stops the render.

### The Six Judged Reads

Each read is a yes/no question a reader answers looking at the settled capture, with no other input and no measurement. Reads 1 and 4 ask for a fault, so a yes there is a failure; the rest ask for the rule, so a no is a failure.

1. **Connector overlap** — do any two connectors share a stroke or cross without a hop? A crossing is legal only on the bridge/hop primitive, where the less important route carries the arc and the more important one runs uninterrupted; two routes drawn on the same stroke path are never legal, and two that naturally want to overlap are offset by at least 12px instead so each stays traceable on its own.
2. **Attach fan** — do connectors entering the same box edge sit at least 12px apart? The packet places attach point `k` of `N` at `L * k / (N + 1)` along the edge; the read asks whether the drawn points are distinct and far enough apart that no arrow hides another.
3. **Visible gap** — does every arrow label sit 6–10px clear of its line with an opaque mask? The mask is what stops the connector bleeding through the text, and the gap is what keeps the route readable where the mask covers it; a mask touching or overlapping the stroke fails the read even when the label is legible.
4. **Behind-box** — does any connector pass behind a box that is not its source or target without being dashed? The unavoidable-intervening-box exception is the only case that may pass behind a third box, and it keeps the stroke dashed, the label at the visible end, and every arrowhead off the intervening box's edge.
5. **Focal balance** — is the accent on one or two elements that deserve it? Accent on four things means nothing was decided focal; the read is whether the one or two elements a reader should look at first are the ones carrying it.
6. **Type fit** — is this the right diagram type for the question the title asks? A correct render of the wrong type passes every mechanical rule in the packet and still fails the reader, which is why the read is asked against the question rather than against the drawing.

### The Two Taste Notes

Two further observations are recorded from the same captures and are explicitly non-blocking. Neither is computable, and the packet never gates on taste without naming the change it would want:

- **The remove test** — what could be deleted: a node that always travels with another, an arrow whose relationship the layout already makes obvious, a label that colour or shape already signals.
- **Density** — does it need a guide to read: past nine nodes and twelve arrows the drawing stops reading as one shape, and the target register is dense enough to be complete without needing an explanation beside it.

### The Capture Pairs

**The skin-pinned third capture.** Alongside the stock capture, the applicator re-themes the same file from a token source that moves the accent, the themed copy is rendered, and the reader confirms the two pictures differ by eye in paper, ink, or accent. A pair that reads the same means the skin did not reach the paint — the stock capture is then evidence that the file renders, not that it renders in the project's skin — so the pair is what separates a themed drawing from a hand-painted one, where a literal survives a palette change untouched. The applicator holds every painted value to its skin's contrast gates and refuses to write into the stock examples, so the themed copies land in a scratch directory and a gate failure is a `FAIL` of the applicator rather than a `SKIP` of the review.

**The settled double capture.** Each file is captured twice with a settle interval between the two, and the pair is compared. A difference means the drawing was still moving — an animation caught mid-cycle, or a font that arrived late and re-flowed the text — and the second capture is the one reviewed, because it is the frame the reader will actually see. The pair matching is what licenses every read: an answer taken on a moving drawing describes a frame, not the file.

**A capture reads the whole page.** The shared renderer takes `--full-page`, which measures a page
before shooting it and captures at that height; without the flag it shoots a fixed viewport and
everything below is silently gone. Eleven of the library's forms are taller than that fixed height,
and the crop is not a cosmetic loss: it once hid a legend row drawn outside its canvas and a caption
contradicted by its own drawing from a reviewer working off the committed images, which is exactly
the failure this review exists to catch. Shoot with the flag, and if a capture's height is a round
number matching the viewport rather than the drawing, you are reading a crop.

There is a measurement trap under it. This browser subtracts its chrome from the layout viewport when
dumping the DOM but not when screenshotting, so a probe and a capture requested at the same window
size can place the same element about thirty pixels apart on a centred page. A crop taken from
probe coordinates will therefore show the wrong region and look like a defect. Probe at the height
you will capture at, and assert the two agree before trusting any coordinate you measured.

### The Font-Substitution Label-Mask Measurement

A label's mask is sized to the font the page asked for. When the page cannot fetch that font, the browser substitutes one whose glyphs are wider or taller, and a mask that covered the label a moment ago no longer does — the connector bleeds back through the text, which is the exact fault the opaque mask exists to prevent. The measurement is:

1. Render the page twice at scale 1: once with the web fonts, once with remote fonts disabled (the two font hosts the packet may fetch are blocked, or the browser is launched with remote fonts disabled).
2. Crop every arrow-label mask rect from both renders with a margin around the rect, so any spill outside the mask is inside the crop.
3. Ink pixels outside the mask's own bounds in the no-fonts render, where the with-fonts render had none, are overflow.
4. Fail threshold: any mask with overflow.

The reference case is the illustrations whose connectors carry labels — `assets/diagrams/swimlane.html` and `assets/diagrams/architecture.html` — because those files carry the opaque `fill="#f5f5f5"` mask rects the measurement crops. A file whose connectors are unlabelled has no mask to measure and is excluded rather than reported clean on it: `assets/diagrams/high-level.html` draws every edge without a label, so its box-mask rects are not label masks and must not be counted as ones.

### The Graduation Threshold

Overlap and the attach fan may leave the judged column only when a 2D pass over parsed path geometry computes segment intersections and per-edge attach spacing for every connector in every corpus file with zero false positives on the current corpus. Those two graduate first because both are pure geometry between connectors: two segments either intersect or they do not, and two attach points sit a measurable distance apart along one edge, with no question of which thing is which. The visible gap and the behind-box read stay judged until the same pass can also pair a mask rect with the line it belongs to and say which boxes a connector has as its endpoints; until those pairings are computed rather than read, the pass would grade a rule it cannot see. Each move is logged in the root playbook's graduation log, and it runs one way: once a family holds a read, the read never returns to the eye.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Capture assets/diagrams/swimlane.html at scale 1 and review the settled capture at the eye: answer the six judged reads, report each with its reason, take the skin-pinned capture beside the stock one, compare the two captures of the settle pair, and measure every arrow-label mask in the no-fonts render against the with-fonts render. Persist the outcome.`

### Commands

1. `bash: node scripts/check-diagram-corpus.cjs` (the green corpus run the review sits beside; read for `RESULT: PASSED`, not the exit code alone)
2. `bash: python -c "import playwright"` (verify the renderer; if the import fails, surface the exact install instruction, record a `SKIP` naming the missing browser, and stop)
3. `agent: Render assets/diagrams/swimlane.html at scale 1 and capture the diagram node, so every mask rect's coordinates land on the pixels it names`
4. `agent: Wait out the settle interval, capture the same file a second time, compare the two captures, and review the second`
5. `bash: node scripts/apply-diagram-tokens.cjs --source <palette.json> --out <scratch-dir> --forms swimlane` (the token source must move the accent and clear its skin's gates; the applicator refuses to write into the stock library)
6. `agent: Capture the themed copy and compare it against the stock capture by eye — paper, ink, or accent must differ`
7. `agent: Render the file once with web fonts and once with remote fonts disabled; crop every arrow-label mask rect from both renders with a margin; compare the crops and report ink outside a mask's own bounds`
8. `agent: Answer the six judged reads on the settled capture, each with the reason that decided it, then record the two taste notes`
9. `bash: node the retired scenario-persistence wrapper --scenario CAP-001 --variant capture-review --verdict <PASS|FAIL|SKIP> --reason "<reason>" --evidence <comma-paths>`

### Expected

Step 1 either confirms the corpus is clean or the review stops there, because a read taken beside a failing corpus describes a file the checker already refused. Step 3 writes the stock capture, and the two captures of step 4 must be identical — a difference names a drawing that was still moving, not a fault. Step 5 writes the themed copy outside the stock examples, since the shipped templates and examples are immutable, and a contrast gate there fails the applicator without failing the drawing. Step 6 either shows two visibly different pictures or shows that the skin never reached the paint. Step 7 reports zero overflow for every crop and names the mask for any that spilled. Step 8 leaves six answers with reasons and two notes that never enter the verdict. Step 9 persists the outcome with its reason and evidence.

### Evidence

Capture the corpus run output, the stock, skin-pinned, and both settled captures with their paths, the with-fonts and no-fonts renders with every mask rect's bounds and its crop, the six read answers with their reasons, the two taste notes, the applicator run's gate output, the verdict, and the run folder the outcome was persisted to.

### Pass / Fail

- **Pass**: all six reads hold on the settled capture, the skin pair differs by eye, the settle pair matches, no arrow-label mask overflows in the no-fonts render, and no answer is recorded without its reason.
- **Fail**: any read fails, the skin pair reads the same, the settle pair differs, a mask overflows, an answer is recorded without its reason, or the applicator's gates reject the token source so no skin-pinned capture exists.
- **SKIP**: only when a named blocker stops the render — e.g. no local browser or Playwright package for the capture; the surfaced install instruction is recorded as the reason, and a `SKIP` with an empty reason is a failed run.

### Failure Triage

1. Confirm every capture is of the file under review and at the same scale: a themed copy judged against a stock capture, or two captures at different scales, makes each read meaningless before the first answer.
2. If a geometry read fails, the fault is in the drawing rather than the capture — re-layout the offending connector, re-render, and rerun the corpus check so the delivered file and the reviewed file stay the same file.
3. If the skin pair reads the same, compare the two files' paint before questioning the capture: a themed copy still carrying the stock hex means the token source did not move the accent, while an unchanged picture from a moved palette means the drawing paints a literal where it should resolve a role.
4. If the settle pair differs, name what moved — an animation caught mid-cycle and a font that arrived late both change the drawing between two captures — and answer the reads only on the settled frame.
5. If a mask overflows without fonts, fix the mask or the font rather than the capture: widen the mask rect while keeping the 6–10px gap, or confirm the file asks for a font the reader will actually receive.

### Optional Supplemental Checks

Run the same six reads on a second labelled illustration such as `assets/diagrams/architecture.html`, where two connectors enter one box edge and a dashed return runs against the flow, to confirm the reads hold where routes crowd. Then theme a labelled illustration into the dark skin and repeat the mask measurement: the mask fill follows the skin's `paper` role, so a mask that kept the light value leaves a pale patch behind every label and the overflow crop is where it shows.

---

## 4. REFERENCES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page, scenario summary, and the graduation log this scenario's threshold feeds |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `scripts/check-diagram-corpus.cjs` | Names the items a regex cannot hold and owns the families a judged read graduates into |
| `scripts/apply-diagram-tokens.cjs` | Re-themes a corpus file from a token source for the skin-pinned capture, gated against the skin's contrast thresholds |
| `references/import-export/export.md` | The render-and-screenshot procedure the capture reuses |
| `references/foundations/style-guide.md` | Token roles the reads resolve against, including the mask fill |
| `assets/diagrams/` | The corpus being captured; the labelled illustrations carry the mask rects the measurement crops |
| `SKILL.md` (RULES + SUCCESS CRITERIA) | The connector rules and taste-gate checklist the reads answer to |

---

## 5. SOURCE METADATA

- Group: CAPTURE REVIEW
- Playbook ID: CAP-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `capture-review/capture-review.md`
