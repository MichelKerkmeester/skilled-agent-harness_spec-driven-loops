---
title: "Implementation Summary: Chart review remediation"
description: "What a fresh review of the chart skill found, what was fixed, and how the five checker holes it left recorded were later closed."
trigger_phrases:
  - "chart remediation summary"
  - "chart review results"
  - "black cell defect"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/010-chart-review-remediation"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed the five recorded checker holes and re-ran the gate"
    next_safe_action: "None open"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - "scratch/negative-controls.txt"
      - "scratch/checker-holes-closed.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-054-chart-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A reversed ramp is now caught by a rule rather than by a reader"
      - "Every recorded hole took a parser rather than a wider pattern, and none of the twenty-one forms started failing"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | sk-design/018-sk-design-parent-v2/001-sk-create-chart/010-chart-review-remediation |
| **Status** | Complete |
| **Delivery** | Thirty-four files in the chart skill. The corpus check passes from the final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The overhaul closed with every gate green, and a fresh review then found defects those gates
could not see. This packet fixes them.

The worst inverted a reading rather than blurring one. A cell holding a zero painted pure black,
darker than the maximum in the same grid, while the legend said the opposite. The cause was
arithmetic: a value is reduced by one before scaling, which sends a zero below the floor, and the
clamp guarded only the top. The band ran past the last defined fill and the browser fell back to
black. The delivery built from that form carried the same function, and a delivery is the file
someone edits.

Data past a form's stated ceiling failed the same way, because a class past the palette's
capacity has no fill either. Five forms now take a defined fill and print a notice naming the
count, following the two that already did.

Eight of twenty-seven headlines were false against their own data and are rewritten. The one the
review caught claimed a stage held a request longer than the three after it combined, where the
block says eighteen against twenty.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each defect was reproduced before it was fixed, rather than taken on the report's word.

The order was set by what a reader would see. Fixing the arithmetic first let the capacity work
assume every finite value already lands on a defined class, so its notice is about a shape the
form cannot draw rather than a colour it cannot find.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

A zero takes an explicit empty class rather than the palest step, matching the one ramp form that
already made that choice. A zero is a reading, and a reading of none is worth showing as none.

The mapping rule asserts that an indexed class carries the token of its own index. That is the
narrowest statement that catches the failure, which is a ramp reversed inside a file while the
legend, drawn from the same classes, reverses with it. The picture stays consistent with itself
and stops being consistent with the data, which is why no earlier rule saw it.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Seven mutations are kept with their output, each run twice: once with the new rule wired and once
with it unwired as the control. Without the control a passing rule proves only that the fixture
is quiet.

The later pass that closed the recorded holes kept eleven more the same way, in
`scratch/checker-holes-closed.txt`. Each new assertion has its own control rather than sharing
one, because a check written in the same pass as the thing it checks inherits the problem it was
built to fix unless every assertion is asked separately. One of the eleven is the corner the
radius rule always caught, kept so that widening the rule could be shown not to have dropped it.

The corpus check passes from the final state and was run again, because a browser open can die
transiently and one red run is not a result. It went from 3,113 assertions to 3,231 without the
browser, and 3,351 with it, at zero failures both times.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The five holes this packet recorded are closed. What closed each one was the different parser
that recording them said it would need, and the reason for recording them rather than reaching
for a wider pattern held: not one of the twenty-one shipped forms started failing.

`motion` now matches each animating selector against the guard rules, by family, so a second
animation cannot inherit the answer given to the first. `no-external` reads the target of every
`url()`, so a font declared as a property inside an at-rule is a remote dependency the same way
one declared as an attribute is. `accessibility` reads the table attribute off an element the way
its own `svg` half already did, so a word in a comment no longer stands in for a table.
`colour-literals` reads what a colour-bearing property is handed, in all three syntaxes that
bypass a declaration, instead of asking whether the value is one of thirty-six words somebody
thought to list. `radius` reads the value at the call in either spelling of the key, so a corner
bound to a name is the same typed corner it was before it got the name.

Four of the five were recorded here. The fifth is the one this packet believed it had closed: the
colour rule learned to treat a quote as a word boundary, which caught `red` set from the drawing
code and nothing outside the list beside it. A list of words only ever knows the words somebody
thought of, which is why the rule reads the property now.

What is left is narrower and none of it is a file passing while it is wrong. The motion rule
matches guard selectors as text, so a guard written with an equivalent but differently spelled
selector reads as absent, which costs a false failure rather than a false pass. The radius rule
leaves a computed value alone, so a corner the file computes to a constant passes, because an
expression is how the one form with a genuinely per-mark corner writes it. The colour rule judges
only complete string literals, because the proof sheets build a palette reference by joining
`'var('` to a property name and reading the first piece as the whole value would fail three
correct files. Each is stated in the checker's own `scripts/README.md`, beside the rule it
belongs to.

One thing this pass did not touch. `references/template-contract.md` says the check enforces the
no-remote rule "by failing any remote `src` or `href`, any `@import` and any `fetch`,
`XMLHttpRequest` or dynamic `import`". That sentence is now an understatement rather than an
error: the rule also fails a `url()` naming anything outside this document. The contract is owned
elsewhere, so the correction is named here rather than made.
<!-- /ANCHOR:limitations -->
