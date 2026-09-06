---
title: "CHT-005 -- Colour comes from one source"
description: "This scenario validates the colour system for `CHT-005`. It confirms every palette block still matches the palette source in both directions and that no colour literal appears anywhere outside a palette block."
stage: validation
version: 1.2.0.0
---

# CHT-005 -- Colour comes from one source

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CHT-005`.

---

## 1. OVERVIEW

This scenario validates the colour system for `CHT-005`. It confirms every palette block still matches the palette source in both directions and that no colour literal appears anywhere outside a palette block.

### Why This Matters

The packet holds one file of colour values and every other file refers to them by role. That is what lets three charts in three systems read as one product, and it is what makes a brand restyle a single edit instead of a sweep.

Two failures break it, and neither is visible in a rendered page. A palette block that has drifted from the source renders a perfectly good chart in last month's colours. A hex typed directly into the markup is a second copy that survives the next palette edit and leaves half the file behind. A diff shows both, and a diff is not what anyone runs before shipping a chart.

The `heat-matrix` form is the sharpest case and the reason this scenario carries the matrix family. Its cells come from an ordered ramp, so a single drifted step changes what the reader concludes about which combinations are hot while looking entirely plausible.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHT-005` and confirm the expected signals without contradictory evidence.

- Objective: confirm both colour checks still fail on a real break, and that the corpus passes both from its shipped state
- Real user request: `Restyle these charts to our brand colours.`
- Prompt: `Change the chart palette to our colours, then prove every chart followed and nothing kept an old value.`
- Expected execution process: the palette source is edited rather than any template, the corpus check reports which blocks have drifted and prints the exact block to paste, each template's block is replaced from that output and the check is re-run until it passes.
- Expected signals: the `palette-block` check reports four assertions per scanned file, two per theme, because each file carries a light block and a dark one. The `colour-literals` check reports hundreds of assertions across the corpus, which is the count of places a value could have been hardcoded and was not. Both report zero failures.
- Desired user-visible outcome: the user changes a colour in one place and the whole corpus follows, with a check that says so.
- Pass/fail: PASS when the shipped corpus passes both checks and each break below produces `RESULT: FAILED` on its own named check. FAIL when a break passes, when a check reports zero assertions or when the tree is left modified.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Change the chart palette to our colours, then prove every chart followed and nothing kept an old value.`

### Commands

1. `bash: cp .opencode/skills/sk-design/sk-design-chart/assets/templates/heat-matrix.html keep-matrix.html`
2. `bash: cp .opencode/skills/sk-design/sk-design-chart/assets/color/palette-sheet-neutral.html keep-sheet.html`
3. `bash: node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs > before.txt 2>&1`
4. `bash: echo $?`
5. `agent: Change one hex inside the palette block of assets/templates/heat-matrix.html, leaving the palette source untouched`
6. `bash: node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs > drifted.txt 2>&1`
7. `bash: cp keep-matrix.html .opencode/skills/sk-design/sk-design-chart/assets/templates/heat-matrix.html`
8. `agent: Replace one var(--chart-muted) reference outside the palette block of assets/color/palette-sheet-neutral.html with a literal hex`
9. `bash: node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs > literal.txt 2>&1`
10. `bash: cp keep-sheet.html .opencode/skills/sk-design/sk-design-chart/assets/color/palette-sheet-neutral.html`
11. `agent: Reverse the five .series-N fill mappings in assets/templates/heat-matrix.html so .series-1 takes token 5 and .series-5 takes token 1`
12. `bash: node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs > reversed.txt 2>&1`
13. `bash: cp keep-matrix.html .opencode/skills/sk-design/sk-design-chart/assets/templates/heat-matrix.html`
14. `bash: node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs > after.txt 2>&1`
15. `bash: git status --porcelain .opencode/skills/sk-design/sk-design-chart`

The restores are copies rather than `git checkout --`. That command reverts to the last commit
rather than to the state the operator was working in, so on an uncommitted tree it throws the work
away and the run that follows fails for a reason unrelated to the break being tested.

### Expected

Step 3 gives the baseline: `RESULT: PASSED`, with `palette-block`, `colour-literals` and
`series-mapping` all reporting assertion counts and zero failures. Step 6 reports `RESULT: FAILED`
on `palette-block`, naming the file and printing the exact block that should be there. Step 9
reports `RESULT: FAILED` on `colour-literals`, naming the file and the literal. Step 12 reports
`RESULT: FAILED` on `series-mapping`, twice, naming which class paints which token. Step 14 returns
to `RESULT: PASSED` byte for byte with step 3. Step 15 returns empty output, which is the proof the
three breaks were undone rather than merely reported.

Each break is applied to a passing corpus and restored before the next, so a failure names one
check rather than two.

The third break is the one this scenario exists for and the one it could not make until recently.
The first two change a value. The third changes only which mark receives it, and the file still
carries a block that matches the source and no literal anywhere. The picture stays consistent with
itself, because the legend is drawn from the same classes it reverses, so an operator comparing the
key against the grid sees nothing. Only `series-mapping` sees it.

### Evidence

Capture the prompt as typed, all four output files, the exit status of each run read separately from its output, the check name in each failure line, the failure message printed for the drifted block and a note that the restore returned the tree to clean. Record `git status --porcelain` for the packet path at the end. A run that reports a break without showing the restore has left the corpus modified.

### Pass / Fail

- **Pass**: the baseline and final runs both report `RESULT: PASSED`, each break produces `RESULT: FAILED` on its own named check and the packet path is clean at the end.
- **Fail**: a break passes, a check reports zero assertions, the final run does not match the baseline or the packet path is left modified.

### Failure Triage

1. A break that passes means the check was edited to accept a file it was right to reject, or the break landed inside a region the check ignores. Read which check reported the assertion count for that file.
2. A check reporting zero assertions ran on nothing. That is not a pass, and the scanned file count at the top of the run is where it shows.
3. When the drifted block fails but names the wrong file, the palette block sentinels are duplicated somewhere. The contract allows one block per theme and two at most, and the check names which region it was reading.
4. When the literal is not caught, check whether it sits inside either palette block. A value there is correct and expected, and the check is right to allow it. A colour word inside a comment is also correct and expected: the rule strips comments before it reads a region, because a sentence about a colour is not a colour. A colour word inside a printed sentence is not stripped, and a form whose notice needs one has to name the role instead.
5. When the reversed ramp is not caught, read the `series-mapping` assertion count for that file. A file whose indexed classes were renamed to something the rule does not recognise as indexed drops out of the check silently rather than failing it.
6. When the final run disagrees with the baseline, the restore was partial. Read `git status --porcelain` before concluding anything about the checks.

### Optional Supplemental Checks

Change one value in the palette source itself and run the check. Every template carrying that role fails `palette-block` at once, and the output prints the replacement block for each. That is the restyle workflow running in reverse and it confirms the direction that matters for a brand change. Restore the source afterwards and confirm the packet path is clean.

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
| [`assets/color/palettes.json`](../../assets/color/palettes.json) | Primary anchor, the only place a colour value is defined |
| [`references/color-system.md`](../../references/color-system.md) | The three systems, the role vocabulary and the contrast gates |
| [`references/template-contract.md`](../../references/template-contract.md) | Section 6, which states the palette block is the only place a colour appears |
| [`assets/templates/heat-matrix.html`](../../assets/templates/heat-matrix.html) | The ordered ramp where a drifted step is least visible |
| [`scripts/README.md`](../../scripts/README.md) | The worked break-and-restore sequence this scenario extends |

---

## 5. SOURCE METADATA

- Group: CORPUS INTEGRITY
- Playbook ID: CHT-005
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `corpus-integrity/colour-comes-from-one-source.md`
