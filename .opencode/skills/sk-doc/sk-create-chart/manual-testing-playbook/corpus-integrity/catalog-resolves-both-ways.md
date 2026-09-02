---
title: "CHT-006 -- The index resolves in both directions"
description: "This scenario validates the chart lookup for `CHT-006`. It confirms every catalog row reaches a file that identifies itself with the same id, and that every chart form on disk appears in the catalog."
stage: validation
version: 1.0.0.0
---

# CHT-006 -- The index resolves in both directions

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CHT-006`.

---

## 1. OVERVIEW

This scenario validates the chart lookup for `CHT-006`. It confirms every catalog row reaches a file that identifies itself with the same id, and that every chart form on disk appears in the catalog.

### Why This Matters

The lookup is the first thing the workflow reads and the only sanctioned way to pick a form. A row that names a file which is not there sends an author to a dead end, and the sanctioned response to a dead end is to write a chart freehand, which is the outcome the template-first rule exists to prevent.

The reverse direction is quieter and costs more over time. A form on disk with no row is a chart nobody can find, so the next author writes a second one for the same question and the corpus grows two answers where it needs one.

An index checked in one direction rots on the first rename. This one is parsed between sentinels and resolved both ways, matching columns by header name rather than by position, so a reordered table still checks and a renamed file fails loudly with a message about the rename.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHT-006` and confirm the expected signals without contradictory evidence.

- Objective: confirm the `catalog` check resolves the index in both directions and fails on each direction separately
- Real user request: `We keep getting asked for a chart the catalogue does not cover. Add one and wire it in.`
- Prompt: `Add a chart form for a question the lookup does not answer yet, and prove the lookup reaches it and knows about it.`
- Expected execution process: the template is authored against the contract at `assets/templates/<id>.html`, one row is added with the same id and the check is run. Adding the file before the row and the row before the file each produce a named failure on the way through.
- Expected signals: the `catalog` check reports an assertion count above the number of rows, because it asserts in both directions. Zero failures from the shipped state. Each deliberate break names the side that is wrong.
- Desired user-visible outcome: a reader can pick a row and be certain it opens a file that draws.
- Pass/fail: PASS when the shipped corpus passes the check and both breaks produce `RESULT: FAILED` naming the correct side. FAIL when either break passes, or when the check reports fewer assertions than the corpus has rows.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Add a chart form for a question the lookup does not answer yet, and prove the lookup reaches it and knows about it.`

### Commands

1. `bash: node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs > before.txt 2>&1`
2. `agent: Add one row to the table between the CHART_CATALOG sentinels in references/catalog.md naming a file that does not exist`
3. `bash: node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs > phantom-row.txt 2>&1`
4. `bash: git checkout -- .opencode/skills/sk-doc/sk-create-chart/references/catalog.md`
5. `agent: Copy assets/templates/scatter.html to assets/templates/orphan-form.html and change its identity tag to orphan-form`
6. `bash: node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs > orphan-file.txt 2>&1`
7. `bash: rm .opencode/skills/sk-doc/sk-create-chart/assets/templates/orphan-form.html`
8. `bash: node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs > after.txt 2>&1`
9. `bash: git status --porcelain .opencode/skills/sk-doc/sk-create-chart`

### Expected

Step 1 gives the baseline with `catalog` reporting its assertion count and zero failures. Step 3 reports `RESULT: FAILED` on `catalog`, naming the row whose file is not on disk. Step 6 reports `RESULT: FAILED` on `catalog`, naming the form that carries no row, and the scanned file count rises by one, which is the second half of the evidence. Step 8 returns to the baseline. Step 9 returns empty output.

The copied form is a real file rather than an empty one on purpose. An empty file would fail several other checks first and the run would never reach the index question.

### Evidence

Capture the prompt as typed, all four output files, the exit status of each run read separately, the `catalog` assertion count from each run, the failure message from each break naming which side is wrong, the scanned file count before and during the orphan break and the clean `git status --porcelain` at the end.

### Pass / Fail

- **Pass**: the baseline and final runs match, the phantom row fails naming the unreachable file, the orphan form fails naming the missing row and the packet path is clean at the end.
- **Fail**: either break passes, a break names the wrong side, the assertion count does not exceed the row count or the packet path is left modified.

### Failure Triage

1. When the phantom row passes, check that the row landed between the sentinels. Prose outside them is never asserted on, so a row added below the closing sentinel is invisible to the check and to the reader.
2. When the orphan form passes, check the identity tag. The check matches a file to a row by the id the file declares, so a copy that kept the original id looks like a duplicate of an indexed form rather than an orphan.
3. When the assertion count does not move between runs, the catalog table was not parsed at all. A changed header name breaks column matching, and the check reads columns by name.
4. When several checks fail at once on the copied file, the copy is malformed rather than orphaned. Fix the copy before drawing a conclusion about the index.
5. When the final run disagrees with the baseline, the removal was partial. Read `git status --porcelain` first.

### Optional Supplemental Checks

Rename one shipped form and its row together, run the check, then rename only the file and run again. The paired rename passes and the unpaired one fails naming the rename, which is the behavior the two-way resolution exists for. Restore both and confirm the packet path is clean.

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
| [`references/catalog.md`](../../references/catalog.md) | Primary anchor, the sentinel-marked table and its column contract |
| [`scripts/check-corpus.cjs`](../../scripts/check-corpus.cjs) | The `catalog` and `identity` checks |
| [`references/template-contract.md`](../../references/template-contract.md) | Section 7, the ordered steps for adding a form and its row |

---

## 5. SOURCE METADATA

- Group: CORPUS INTEGRITY
- Playbook ID: CHT-006
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `corpus-integrity/catalog-resolves-both-ways.md`
