---
title: "CHT-002 -- The axis ladder fits the tallest mark"
description: "This scenario validates the value axis for `CHT-002`. It confirms the top gridline sits close above the largest value, so the tallest mark fills the plot instead of half of it."
stage: rendering
version: 1.0.0.0
---

# CHT-002 -- The axis ladder fits the tallest mark

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CHT-002`.

---

## 1. OVERVIEW

This scenario validates the value axis for `CHT-002`. It confirms the top gridline sits close above the largest value, so the tallest mark fills the plot instead of half of it.

### Why This Matters

A value axis picks its top tick from a ladder of round steps. A coarse ladder offers one, two, five and ten, so a peak landing just above the five rung is rounded to ten and the whole chart is drawn at half height. The data looks flat. Nobody who reads the chart can tell, because a squashed chart and a genuinely flat one are the same picture.

Three forms in this corpus carried that defect before it was found by eye, across two families. Every one of them passed all fourteen structural checks while doing it, and the render pass would have passed them too, because the marks were there and they were the wrong size rather than absent.

The fix was a finer ladder, and the property to hold is arithmetic rather than aesthetic: the top tick sits no more than about a third above the largest value, so the tallest mark fills at least about three quarters of the plot.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHT-002` and confirm the expected signals without contradictory evidence.

- Objective: confirm the top gridline of every value axis sits close above the largest value in that chart's data
- Real user request: `This chart looks wrong. Everything is squashed into the bottom half and I cannot see the difference between the middle bars.`
- Prompt: `Open this chart, read its top gridline and its largest value and tell me whether the axis is wasting the plot.`
- Expected execution process: the form file is opened from a `file://` URL, the top tick label is read from the rendered page, the largest value is read from the block between the `CHART_DATA` sentinels and the ratio between them is computed rather than judged by eye.
- Expected signals: the top tick value and the peak value are both reported as numbers. Their ratio is at most about one and a third. The tallest mark is visibly the tallest and reaches most of the way up the plot.
- Desired user-visible outcome: the reader sees the shape of the data instead of the shape of the axis.
- Pass/fail: PASS when every value axis read has a top tick within about a third of its peak. FAIL when a top tick is at or above twice the peak, or when the ratio was asserted without the two numbers behind it.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Open this chart, read its top gridline and its largest value and tell me whether the axis is wasting the plot.`

### Commands

1. `agent: Read the block between the CHART_DATA sentinels in assets/templates/bar-columns.html and record the largest value`
2. `agent: Open the same file from a file:// URL and read the top gridline label`
3. `agent: Compute the ratio of top tick to peak and report both numbers`
4. `agent: Repeat for assets/templates/grouped-bars.html and assets/templates/daily-line.html`
5. `bash: git status --porcelain .opencode/skills/sk-design/sk-create-chart`

### Expected

Step 1 gives the peak as a number taken from the data rather than from the drawing. Step 2 gives the top tick as it is actually labelled on the page, which is the value the reader sees. Step 3 produces a ratio at or under about one and a third on each of the three forms, and the tallest mark occupies most of the plot height. Step 4 repeats it across a comparison form with one series, a comparison form with two and a time form, which is where the defect appeared. Step 5 returns empty output, because every step reads.

A ratio of two is the defect. It means the ladder rounded the peak up to the next rung and left the top half of the plot empty.

### Evidence

Capture the prompt as typed, the peak value and its source line per file, the top tick label per file as read from the rendered page, the computed ratio per file and a note on whether the tallest mark visibly reaches most of the plot. Record `git status --porcelain` for the packet path. A ratio quoted without both numbers cannot be checked by the next reader.

### Pass / Fail

- **Pass**: each value axis read has a top tick within about a third of that chart's peak, and both numbers appear in the report.
- **Fail**: any top tick sits at or above twice its peak, the ratio was asserted without its two numbers or the peak was read off the drawing rather than out of the data block.

### Failure Triage

1. Read the ladder in the drawing code. A ladder offering only one, two, five and ten is the cause, and it produces this defect on any dataset whose scaled peak lands just above a rung.
2. Confirm the peak came from the data block. A peak read off the chart is the same measurement twice and cannot disagree with the axis.
3. Check the tick count. A ladder is applied to the peak divided by the number of intervals, so a change in tick count moves the result without any change to the ladder.
4. Check the axis starts at zero before concluding the marks are the right size. A truncated baseline produces the opposite defect of exaggerated differences, and neither is caught by any check here.

### Optional Supplemental Checks

Copy a form to a scratch path outside the packet, raise its largest value by a few percent so the scaled peak crosses a rung and open the copy. The top tick jumps to the next rung and every mark shrinks. That is the defect reproduced on demand, and it shows the property is a function of the data rather than of the file.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| No feature-catalog entry | This packet ships no `feature-catalog/`, so no cross-reference exists for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`assets/templates/bar-columns.html`](../../assets/templates/bar-columns.html) | Primary anchor, the ladder and the tick count live in its drawing code |
| [`assets/templates/grouped-bars.html`](../../assets/templates/grouped-bars.html) | The same ladder across two series |
| [`assets/templates/daily-line.html`](../../assets/templates/daily-line.html) | The same ladder on a time axis |
| [`references/template-contract.md`](../../references/template-contract.md) | Section 9, which states that the check does not know whether the bars are the right height |

---

## 5. SOURCE METADATA

- Group: READING THE CHART
- Playbook ID: CHT-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `reading-the-chart/axis-ladder-fits-the-tallest-mark.md`
