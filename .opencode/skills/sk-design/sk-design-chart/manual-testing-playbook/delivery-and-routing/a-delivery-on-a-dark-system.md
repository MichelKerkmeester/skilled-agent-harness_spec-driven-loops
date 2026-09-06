---
title: "CHT-009 -- A delivery read on a dark system"
description: "This scenario validates the theme behaviour for `CHT-009`. It confirms a delivered chart answers the reader's operating system, that the dark values are readable rather than merely present, and that printing still puts the light palette on paper."
stage: delivery
version: 1.0.0.0
---

# CHT-009 -- A delivery read on a dark system

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CHT-009`.

---

## 1. OVERVIEW

This scenario validates the theme behaviour for `CHT-009`. It confirms a delivered chart answers the reader's operating system, that the dark values are readable rather than merely present, and that printing still puts the light palette on paper.

### Why This Matters

A delivered file is opened in a browser whose operating system has already picked a theme. Every file in this corpus carries a second palette block for the dark case, and the reader never chooses it: there is no control in the file, because a delivered document has nowhere to keep a preference.

Two of the three things that can go wrong here are invisible to the corpus check. It can prove the second block reaches the paint, because it opens each file with the scheme pinned dark and requires a different picture. It cannot say whether the dark values are readable at the size the chart ships, whether two categorical hues that both clear their gate are still easy to tell apart on a near-black ground, or whether the card edge is visible at all. Those are the questions this scenario asks.

The third is the print path, and it is the one an author assumes rather than checks. The media query resolves to light while a page is being printed, so a chart printed from a dark browser goes onto paper the way it always did. That behaviour belongs to the browser rather than to the file, which is exactly why it is worth confirming rather than asserting.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHT-009` and confirm the expected signals without contradictory evidence.

- Objective: confirm a delivery reads on both grounds, that the dark gate line runs alongside the light one, and that printing from a dark browser produces the light palette
- Real user request: `I opened the chart you sent and it is a bright white rectangle in the middle of my dark screen.`
- Prompt: `Send the chart, then prove it answers the theme my machine is already set to, and that it still prints the way it always did.`
- Expected execution process: the corpus check is run in render mode and both palette gate lines are read, one delivery is opened in a real browser with the operating system set to dark and read by eye, the operating system is switched to light and the same file is read again, and the file is printed to PDF from the dark browser.
- Expected signals: the run carries a `palette-source` line and a `palette-source-dark` line, each with a nonzero assertion count and zero failures, and a `dark-render` line reporting one assertion per scanned file with zero failures. The delivery paints a near-black ground with readable text under a dark system, and the same file paints paper under a light one. The printed PDF carries the light values.
- Desired user-visible outcome: the reader opens the file and gets a chart that belongs on their screen, and prints it to get a chart that belongs on paper.
- Pass/fail: PASS when both gate lines report zero failures, both readings are legible, the print carries light values and the deliberate break below fails `dark-render` on its own. FAIL when a gate line is missing or reports zero assertions, when either reading is illegible, when the print carries dark values or when the break passes.

### Preconditions Beyond The Global Set

A desktop browser and an operating system whose colour scheme can be switched. A machine that cannot switch records a `SKIP` naming the unavailable appearance control as the environment blocker, rather than substituting the browser flag for the reading: the flag is what the check already does, and the point of this scenario is the part the check cannot do.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Send the chart, then prove it answers the theme my machine is already set to, and that it still prints the way it always did.`

### Commands

1. `bash: node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --render > before.txt 2>&1`
2. `bash: echo $?`
3. `agent: Set the operating system appearance to dark, open assets/examples/where-the-budget-went.html from a file:// URL and read the card, the four category colours, the card edge and the table`
4. `agent: Set the operating system appearance to light, reload the same file and read it again`
5. `agent: With the appearance set to dark, print the same file to PDF and read the colours on the page`
6. `bash: cp .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html /tmp/keep.html`
7. `agent: In bar-columns.html, change the dark block's media query to "@media (prefers-color-scheme: dark) and (min-width: 99999px)", which leaves every text check satisfied and stops the block ever painting`
8. `bash: node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --render > broken.txt 2>&1`
9. `bash: cp /tmp/keep.html .opencode/skills/sk-design/sk-design-chart/assets/templates/bar-columns.html`
10. `bash: node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --render > after.txt 2>&1`
11. `bash: git status --porcelain .opencode/skills/sk-design/sk-design-chart`

Step 9 restores from the copy taken in step 6 rather than from version control, because a restore from the last commit throws away any uncommitted work in the same file and the run that follows then fails for a reason unrelated to the break.

### Expected

Step 1 gives the baseline: `RESULT: PASSED`, with `palette-source`, `palette-source-dark` and `dark-render` each reporting an assertion count and zero failures. Step 3 shows a near-black ground, a headline and table that read without strain, four category colours that stay distinguishable from each other and a card edge that is visible without competing with the marks. Step 4 shows the same chart on paper-coloured ground, unchanged from what the corpus always painted. Step 5 produces a PDF carrying the light ink, the light rule and the light category colours, with no dark value on the page. Step 8 reports `RESULT: FAILED` on `dark-render` alone, naming `bar-columns.html`. Step 10 returns to `RESULT: PASSED`. Step 11 returns empty output.

### Evidence

Capture both output files, the exit status of each run read separately from its output, the two gate lines verbatim with their assertion counts, the `dark-render` line, a screenshot or written observation of each reading, the colours found in the printed PDF and the failure line from the broken run. Record `git status --porcelain` for the packet path at the end.

A reading recorded as "looks fine" cannot be graded. Write what was read: whether the source line under the card was legible, whether two adjacent category colours were still separable, whether the card edge was findable.

### Pass / Fail

- **Pass**: both gate lines report zero failures with nonzero assertion counts, both readings are legible, the printed page carries light values, the break fails `dark-render` on its own and the packet path is clean at the end.
- **Fail**: a gate line is missing or reports zero assertions, either reading is illegible, the print carries dark values, the break passes or the packet path is left modified.

### Failure Triage

1. A missing `palette-source-dark` line means the run gated one ground rather than two. Read the palette source for its dark fields before reading anything else.
2. A `dark-render` failure on every file at once is the browser rather than the corpus. The check pins the scheme with a browser flag, and a build that ignores the flag reports every file as unchanged.
3. A `dark-render` failure on one file is that file's block. It is present and matches the source, or `palette-block` would have fired first, so the fault is where it sits rather than what it says.
4. A reading that is legible on one machine and not on another is a display question rather than a palette question. Record the display and the ambient light, because the gates are computed and the eye is not.
5. Dark values on a printed page mean the browser resolved the query while printing. That is browser behaviour rather than file behaviour, so record the browser and its version.

### Optional Supplemental Checks

Read one file from each colour system rather than one file overall. The three systems fail differently on a dark ground: `neutral` loses its ranking if two steps converge, `ordered` stops encoding magnitude if its ramp flattens, and `categorical` loses a category if two hues converge. One delivery only exercises one of the three.

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
| [`assets/color/palettes.json`](../../assets/color/palettes.json) | Primary anchor, the dark chrome and the dark values for all three systems |
| [`references/color-system.md`](../../references/color-system.md) | Section 4 on when a hue may be re-chosen, and section 5 on the gates run per theme |
| [`references/template-contract.md`](../../references/template-contract.md) | Section 6 on the second block, and rule 4's two-block ceiling |
| [`assets/examples/where-the-budget-went.html`](../../assets/examples/where-the-budget-went.html) | The categorical delivery this scenario reads |
| [`scripts/check-corpus.cjs`](../../scripts/check-corpus.cjs) | The `palette-source-dark` and `dark-render` checks |
| [`scripts/README.md`](../../scripts/README.md) | The break-and-restore sequences this scenario draws step 7 from |

---

## 5. SOURCE METADATA

- Group: DELIVERY AND ROUTING
- Playbook ID: CHT-009
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `delivery-and-routing/a-delivery-on-a-dark-system.md`
