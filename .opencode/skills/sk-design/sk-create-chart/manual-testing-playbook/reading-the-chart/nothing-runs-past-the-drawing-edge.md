---
title: "CHT-003 -- Nothing runs past the drawing edge"
description: "This scenario validates text placement for `CHT-003`. It confirms no label, tick or axis name is clipped by the plot boundary, pushed outside the card or drawn on top of another."
stage: rendering
version: 1.0.0.0
---

# CHT-003 -- Nothing runs past the drawing edge

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CHT-003`.

---

## 1. OVERVIEW

This scenario validates text placement for `CHT-003`. It confirms no label, tick or axis name is clipped by the plot boundary, pushed outside the card or drawn on top of another.

### Why This Matters

Five of the eight defects found by eye were text in the wrong place. A value label ran past the edge of the bar area. A group label ran off the right side of a hierarchy. An end tick was centred on the plot boundary and lost half of itself. An axis name sat under the chart as a sentence and was clipped by the card. Two axis names on adjacent scales overlapped into an unreadable smear.

Every one of those files passed every check, including the render pass, because the elements exist. A clipped label is a present element with the wrong coordinates, and counting elements cannot tell the difference. Text overflow is also the defect most sensitive to data: a longer category name or a wider number moves the boundary, so a form that is clean on demo data can clip on a user's.

This is the scenario that needs a real browser. It cannot be graded from markup.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHT-003` and confirm the expected signals without contradictory evidence.

- Objective: confirm every piece of text a chart draws is fully visible, inside its card and not overlapping other text
- Real user request: `Make me this chart, then open it and tell me if anything is cut off. The last one had a label hanging off the side.`
- Prompt: `Open each of these chart files in a browser and report every piece of text that is clipped, overflowing its card or overlapping another label.`
- Expected execution process: each named file is opened from a `file://` URL in a real browser, the rendered page is read at the delivered width and each text element is checked against three questions: is any of it outside the drawing area, is any of it outside the card, and does any of it collide with other text.
- Expected signals: a per-file report naming every text element that fails one of the three questions, or stating that none did. The first and last tick on any axis are named explicitly, because an end tick centred on the boundary is the most common of the five.
- Desired user-visible outcome: every word the chart draws is readable in the file the recipient opens.
- Pass/fail: PASS when every file read is free of clipped, overflowing and colliding text and the report names what was checked. FAIL when any text is cut, sits outside the card or overlaps or when the report gives a verdict with no per-file observations behind it.

### Preconditions

This scenario needs a desktop browser that can render a page and show it. A machine with no display cannot execute it and records a `SKIP` naming the unavailable display as the environment blocker, rather than a pass.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Open each of these chart files in a browser and report every piece of text that is clipped, overflowing its card or overlapping another label.`

### Commands

1. `agent: Open assets/templates/bar-rows.html from a file:// URL and read the value label on the longest bar`
2. `agent: Open assets/templates/treemap.html and read the label on the rightmost group`
3. `agent: Open assets/templates/daily-line.html and read the first and last tick labels on the time axis`
4. `agent: Open assets/templates/scatter.html and assets/templates/parallel-axes.html and read every axis name`
5. `agent: Report per file which text elements are fully visible and which are not`
6. `bash: git status --porcelain .opencode/skills/sk-design/sk-create-chart`

### Expected

Step 1 shows the longest bar's value label sitting inside the drawing area rather than past its edge. Step 2 shows the rightmost group's label anchored so it turns back into the card instead of running off it. Step 3 shows both end ticks fully drawn, which means the first and last are anchored to their ends rather than centred on the boundary. Step 4 shows each axis name readable and separate from its neighbour. Step 5 produces the per-file record that makes the verdict checkable. Step 6 returns empty output, because opening a file changes nothing.

Those five files are named because each one carried a different form of this defect. The other forms get the same three questions on any run that has time for them.

### Evidence

Capture the prompt as typed, the browser and the window width used, a per-file list of the text elements checked with a verdict on each and a description of any element that failed and how it failed. A screenshot is useful and does not replace the list, because a screenshot of a clipped label looks like a screenshot. Record `git status --porcelain` for the packet path.

### Pass / Fail

- **Pass**: every text element checked is fully visible, inside its card and clear of other text and the report names the elements rather than the files.
- **Fail**: any text is clipped, overflows its card or overlaps another element or the report gives a verdict without naming what was looked at.

### Failure Triage

1. Check the window width first. A card at a narrow viewport clips text that is clean at the delivered width, and that is a different finding from a label anchored wrongly.
2. For a clipped end tick, read the anchor of the first and last tick separately from the middle ones. Centring is correct in the middle of an axis and wrong at both ends.
3. For a label past a bar or a cell, check whether the drawing area was sized without room for a label drawn outside it. The label position is usually correct and the plot is too wide.
4. For overlapping axis names, check whether staggering them collides with something else. A stagger that solves an overlap by moving text under a legend has traded one defect for another.
5. Re-check with a longer category name than the demo data carries. A form clean on short labels is not a form that is clean.

### Optional Supplemental Checks

Copy one form to a scratch path outside the packet, replace one category name with a much longer one and open the copy. Text that moves outside the card shows the form's headroom is a property of the demo data rather than of the drawing code, which is worth recording as a finding even when the shipped file is clean.

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
| [`assets/templates/bar-rows.html`](../../assets/templates/bar-rows.html) | A value label drawn outside the bar area |
| [`assets/templates/treemap.html`](../../assets/templates/treemap.html) | A group label that has to flip its anchor near the right edge |
| [`assets/templates/daily-line.html`](../../assets/templates/daily-line.html) | End ticks anchored to their ends rather than centred |
| [`assets/templates/scatter.html`](../../assets/templates/scatter.html) | A rotated axis name on the vertical scale |
| [`assets/templates/parallel-axes.html`](../../assets/templates/parallel-axes.html) | Staggered axis names across adjacent scales |

---

## 5. SOURCE METADATA

- Group: READING THE CHART
- Playbook ID: CHT-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `reading-the-chart/nothing-runs-past-the-drawing-edge.md`
