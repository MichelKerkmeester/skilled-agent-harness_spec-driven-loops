---
title: "CHT-001 -- The headline agrees with its own data"
description: "This scenario validates the headline claim for `CHT-001`. It confirms every comparative claim in a card's top line is derived from the data block in the same file rather than accepted because the file renders."
stage: authoring
version: 1.0.0.0
---

# CHT-001 -- The headline agrees with its own data

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CHT-001`.

---

## 1. OVERVIEW

This scenario validates the headline claim for `CHT-001`. It confirms every comparative claim in a card's top line is derived from the data block in the same file rather than accepted because the file renders.

### Why This Matters

The top line of the card is an argument rather than a label. That is the packet's own highest-value writing rule, and it is the rule with no machine behind it.

Three of the eight defects the corpus author caught by eye were headlines that misstated the numbers beneath them. One said a third of the bill where the data said nearly half. Another said a cohort was not slower while its median sat above the cohort it was being compared with. Both files rendered correctly, both passed all fourteen structural checks and both would have shipped a false claim to a reader who trusted the top line and read no further.

Nothing in this packet compares a sentence with the numbers under it, and the contract says so plainly rather than implying otherwise. That gap is permanent, so a second reader is the only control there is. This scenario is that reader, written down.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHT-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm every comparative claim in a headline is re-derived from the data block in the same file, with the arithmetic shown
- Real user request: `Turn these depot pick times into a chart I can put in the board pack.`
- Prompt: `Build a chart from this data and write a headline that says what it shows. Then prove the headline is true from the numbers in the file.`
- Expected execution process: `references/catalog.md` resolves the question to one row, the named form is copied whole, the data block is swapped, the headline is written as a conclusion and the claim is then re-derived from the data block rather than read off the drawing.
- Expected signals: the report restates each headline verbatim, extracts the values the claim depends on and shows the arithmetic. Every comparative word carries a number behind it, which covers more than, half, twice, matches, above and the rest of that family.
- Desired user-visible outcome: the user gets a chart whose top line they can defend from the numbers in front of them.
- Pass/fail: PASS when every claim in the headline is derived from the data block and the derivation is shown. FAIL when a comparative claim has no arithmetic behind it, or when the arithmetic contradicts the claim.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Build a chart from this data and write a headline that says what it shows. Then prove the headline is true from the numbers in the file.`

### Commands

1. `agent: Read references/template-contract.md section 2 for what the headline part has to carry`
2. `bash: node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs`
3. `agent: For each file under assets/examples/, read the headline and the block between the CHART_DATA sentinels`
4. `agent: Derive every comparative claim in the headline from those values and report the claim, the values and the arithmetic`
5. `bash: git status --porcelain .opencode/skills/sk-doc/sk-create-chart`

### Expected

Step 1 loads the four card parts and the rule that a headline states a conclusion. Step 2 reports `RESULT: PASSED` and proves nothing about any claim, which is the point of running it inside this scenario rather than instead of it. Step 3 gives the reader two things per file: a sentence and the numbers it is about. Step 4 is where the scenario lives, and each claim resolves either to arithmetic that supports it or to a finding. Step 5 returns empty output, because reading a file changes nothing.

Two worked cases show the shape. A headline claiming more than half the grant went to frontline staff is supported when the frontline value exceeds the sum of the rest. A headline claiming two categories take more staff time than everything else together is supported when those two values sum above the sum of the remaining four.

### Evidence

Capture the prompt as typed, the corpus-check transcript with its `RESULT:` line and its per-check assertion counts, each headline verbatim, the values pulled from each data block, the arithmetic for each comparative claim and an explicit statement naming any claim that could not be derived. Record `git status --porcelain` for the packet path. A report listing claims with no numbers beside them has restated the headlines rather than checked them.

### Pass / Fail

- **Pass**: every comparative claim in every headline read is derived from that file's data block, and the derivation appears in the report.
- **Fail**: a comparative claim carries no arithmetic, the arithmetic contradicts the claim or the derivation was read off the drawing instead of the data block.

### Failure Triage

1. Check where the numbers came from. A derivation taken from the rendered bars confirms a wrong headline whenever the drawing is also wrong, and the two defects appeared in the same files.
2. Read the claim for hidden comparatives. Words like steadily, still and almost carry an assertion about the data, and a report that only checked the explicit fractions has checked the easy half.
3. Count the files read against the files present. A short list is a walk that stopped early, and it looks identical to a clean result.
4. When the arithmetic and the claim disagree, fix the headline rather than the data. The numbers are the delivery, and rewriting them to rescue a sentence inverts what the chart is for.

### Optional Supplemental Checks

Run the same reading against what colour encodes. One form once drew the current period as the lighter bar while the subtitle called it current, which is the same defect class on a different surface: words that disagree with the picture. Confirm the emphasised mark is the mark the headline is about.

Then run the negative control, which is the evidence that this scenario is needed at all. Copy one delivery to a scratch path outside the packet, edit its headline so it overstates the data and run the corpus check. It reports `RESULT: PASSED`. That silence is exactly what the reader is here to replace.

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
| [`references/template-contract.md`](../../references/template-contract.md) | Primary anchor, section 2 for the card parts and section 9 for what the check does not observe |
| [`references/catalog.md`](../../references/catalog.md) | The lookup the form is chosen from |
| [`assets/examples/`](../../assets/examples) | The six deliveries this scenario reads |
| [`SKILL.md`](../../SKILL.md) | Section 3 step 6 and the success criteria |

---

## 5. SOURCE METADATA

- Group: READING THE CHART
- Playbook ID: CHT-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `reading-the-chart/headline-agrees-with-the-data.md`
