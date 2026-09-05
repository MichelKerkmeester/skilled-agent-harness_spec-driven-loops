---
title: "Implementation Summary: Chrome proof on two forms, and the two forks"
description: "The agreed static chrome landed on one line form and one bar form, the glow fork closed on an operator decision, and the stroke weight fork is rendered three ways and waiting for an answer."
trigger_phrases:
  - "chart chrome proof summary"
  - "stroke weight sheet"
  - "chart phase 001 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart/009-chart-visual-overhaul/001-visual-proof-and-forks"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Shipped the chrome to both templates and rendered the weight comparison"
    next_safe_action: "Read scratch/forks/stroke-weight.html and fill the ADR-001 disposition"
    blockers:
      - "The weight fork has no answer, so phase 002 cannot roll the series stroke"
      - "AC-004 fails on two ordinal label writes that predate this phase"
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-columns.html"
      - "specs/sk-doc/051-sk-create-chart/009-chart-visual-overhaul/001-visual-proof-and-forks/scratch/forks/stroke-weight.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-001-visual-proof-and-forks"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which stroke weight the operator picks"
      - "Whether AC-004 covers ordinal labels or only measured values"
    answered_questions:
      - "The glow is cut at any layer count"
      - "The tick ink was already muted, so A1b needed no edit"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-visual-proof-and-forks |
| **Completed** | 2026-09-03, on everything except the operator's answer |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two of the twenty chart templates now carry the look the research settled on, and the one change
nobody could settle by argument is rendered three ways on a page the operator reads. Nothing rolled
out. That is the point: a chrome change is a twenty-file change, and finding out afterwards that
the operator dislikes it costs twenty reverts.

### The chrome, on one line form and one bar form

Five agreed rows landed. The grid is dashed at `3 3` and drawn below full strength, because the
rule token is also the card border and a grid at the same weight competes with the frame around it.
Every printed figure moved to a system mono stack with tabular figures, so an axis rung, a value
label and a table cell line up digit under digit. The line form gained a dot per reading and a
surface-ringed dot on the point the headline is about, and its area fill now fades toward the
baseline instead of sitting at a flat tenth.

One row needed no work at all. The tick ink was already muted in both files, and in every other
template that draws a tick. The row was written from the research list rather than from the file,
and the file was already there.

The stroke weight and the glow were the two changes the lineages contradicted each other on. The
glow is cut, on the operator's answer that a delivered chart is often printed and a blur reads as a
smudge. The weight is rendered at 2px, 1px and 0.8px on one sheet and left open.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html` | Modified | Four chrome rows: dashed grid, mono figures, two-weight dots, fading area fill |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-columns.html` | Modified | Two chrome rows: dashed grid and mono figures |
| `decision-record.md` | Created | ADR-001 holds the weight fork open, ADR-002 records the glow as rejected |
| `scratch/forks/stroke-weight.html` | Created | The same readings at three weights, one variable between them |
| `scratch/before/`, `scratch/shots/`, `scratch/validator-*.txt`, `scratch/chrome-before.txt` | Created | Baseline, before images, rendered evidence and the class inventory |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` | Modified | Reconciled against the glow cut and the observed results |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline ran first. `check-corpus.cjs --render` printed `RESULT: PASSED` over 29 files before
anything was edited, so the after-state has a real before to compare against rather than an assumed
one.

Each chrome row is one or two CSS declarations against custom properties that already existed,
which is what keeps the phase 002 rollout affordable. Two changes needed more than a declaration.
The area gradient is bound to the plot rather than to each path's own box, so a series broken by a
gap fades on one ramp instead of restarting per segment, and the fill names its gradient through a
custom property because the corpus colour rule blanks a `url(#...)` reference before it reads the
value and then reports a fill with no colour in it.

Verification ran three ways. The corpus check covers the structure and opens every asset in a
headless browser. The rendered DOM was read directly to confirm the marks exist, counting 28 dots
at one radius and one mark at another. Both templates and the comparison sheet were then screenshot
and looked at, because a check that asserts four elements in a figure region cannot tell a chart
from a mess.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The glow is cut at any layer count | A delivered chart gets printed, and a blur reads as a smudge on paper. Recorded as ADR-002 with both lineage arguments |
| The weight fork is rendered, not chosen | Nine research iterations produced two confident answers pointing in opposite directions, and one of them rested on evidence that is not in the file. Taste about a delivered artifact is settled by looking |
| The contradicting drawing comment stays exactly as written | It is the evidence the fork rests on. Rewriting it now would either pre-empt the choice or destroy the citation |
| The mono face covers figures, not the body | Setting the body to mono would put the headline and the prose in it too. The grouped rule covers ticks, value labels and table numbers, which are the things a reader compares |
| A1b was left alone | The tick ink was already muted. Editing it to satisfy a row would have been a diff with no change in it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-corpus.cjs --render` from the final state | PASS. `RESULT: PASSED`, `Summary: errors: 0`, exit 0, 29 files, 16 rule groups, captured in `scratch/validator-after.txt` |
| Baseline before any edit | PASS. Same command, same result, captured in `scratch/validator-before.txt` |
| `git diff --name-only` over the asset tree | PASS. Exactly `bar-columns.html` and `daily-line.html` |
| Rendered DOM of the line form | PASS. 28 circles at `r=2.5`, one at `r=5`, gradient bound at `y1="20" y2="244"`, 5 grid lines, 10 ticks |
| Rendered DOM of the comparison sheet | PASS. Three variants holding identical element counts, differing only by the weight class |
| Screenshots read as images | PASS. Dashed grid, mono figures, ringed mark and fading fill all visible, and the site codes stayed in the body face |
| `hvr_scan.py` over every document in the folder | PASS. 0 hard blockers on all seven |
| Acceptance criteria | 12 met, 1 superseded, 2 unmet. AC-014 waits on the operator by design, AC-004 fails on a pre-existing gap |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **AC-004 is unmet on two writes that predate this phase.** `daily-line.html:247` and `:265`
   compose a day ordinal directly instead of routing it through the formatter. The mono change is
   CSS only and added no write, so nothing here caused it. The criterion does not distinguish an
   ordinal label from a measured value, so it needs an operator call rather than a quiet pass.

2. **The print question is asked and not answered.** The objection to a hairline is that it thins
   further on paper, and a screen comparison cannot settle that. The sheet says to print it, and
   nothing in this phase can force that to happen.

3. **The weight comparison covers the line form only.** The bar form draws no series stroke, so
   there is nothing to compare there. If the answer should differ per form, that surfaces in phase
   002 rather than here.

4. **The first render run failed on a file this phase never touched.** The browser did not return a
   document for one example file. That file then rendered twice on its own at exit 0 and the re-run
   was clean, which is the transient the spec's edge cases describe. It is worth knowing the check
   can report a false red under load.
<!-- /ANCHOR:limitations -->
