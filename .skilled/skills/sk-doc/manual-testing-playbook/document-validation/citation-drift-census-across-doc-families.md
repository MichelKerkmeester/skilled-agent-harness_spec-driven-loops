---
title: "SD-022 -- Citation drift census across doc families"
description: "This scenario validates the citation drift census across doc families for `SD-022`. It focuses on the skills census printing its family and totals lines ending in the corpus and commit, `--moved` adding only the `cite moved:` lines, and the working tree staying unchanged."
version: 2.3.0.2
---

# SD-022 -- Citation drift census across doc families

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `SD-022`.

---

## 1. OVERVIEW

This scenario validates the citation drift census across doc families for `SD-022`. It focuses on the skills census printing its family and totals lines ending in the corpus and commit, `--moved` adding only the `cite moved:` lines, and the working tree staying unchanged.

### Why This Matters

A citation whose target was renamed is not the same failure as one whose target is gone: the first can be repaired in place from the rename record. `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs --corpus` counts citations per doc family and resolves moved targets through `cite-drift-redirects.json`, and `--moved` prints each moved citation with its new path. The default run makes zero model calls, reads no credential and writes no file, so two runs and a status comparison prove both the listing and the no-write claim.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SD-022` and confirm the expected signals without contradictory evidence.

- Objective: prove the skills census prints one `family skills:` line and a totals line ending `corpus=skills commit=<sha12>` with exit 0, that `--moved` adds one `cite moved:` line per moved citation and nothing else, and that the working tree is unchanged afterwards
- Real user request: `Which skill-doc citations point at files that were only renamed, and where do those files live now? Don't change anything.`
- Prompt: `Run the citation drift census over the skill docs, then again with --moved, and tell me the family totals, which citations moved and where to, and whether the working tree changed.`
- Expected execution process: the orchestrator captures the working-tree status, runs the census with `--corpus skills`, runs it again with `--moved`, diffs the two outputs, captures the status again and compares it with the first capture
- Expected signals: step 2 prints one `skill <skill>: citations=<n> in_range=<n> past_end=<n> moved_in_range=<n> moved_past_end=<n> basename_only=<n> ambiguous=<n> unresolved=<n> dead=<n>` line per skill folder, one `family skills:` line with the same keys plus `refused=<n>`, then a totals line ending `corpus=skills commit=<sha12>`, and ends with `exit=0`. Step 3 prints the same lines plus one `cite moved: skills <doc>:<line> -> <target>:<line> now <new path> (<class>)` line per moved citation, and ends with `exit=0`. Step 4 shows only added `cite moved:` lines, as many as `moved_in_range` plus `moved_past_end` on the totals line. Step 5 prints nothing
- Desired user-visible outcome: the family totals, each moved citation with its new path, and a statement that nothing in the working tree changed
- Pass/fail: PASS if every expected signal appears, both runs end with `exit=0`, step 4 shows only the added `cite moved:` lines and step 5 prints nothing. FAIL if a run exits non-zero, the totals line lacks `corpus=skills commit=<sha12>`, step 4 shows any other difference or step 5 shows a change

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the citation drift census over the skill docs, then again with --moved, and tell me the family totals, which citations moved and where to, and whether the working tree changed.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-022 | Citation drift census across doc families | Print the family and totals lines, list the moved citations with `--moved` and leave the working tree unchanged | `Run the citation drift census over the skill docs, then again with --moved, and tell me the family totals, which citations moved and where to, and whether the working tree changed.` | 1. `bash: git status --porcelain > /tmp/skd-SD-022-before.txt` -> 2. `bash: node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs --corpus skills > /tmp/skd-SD-022-default.txt; code=$?; cat /tmp/skd-SD-022-default.txt; echo "exit=$code"` -> 3. `bash: node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs --corpus skills --moved > /tmp/skd-SD-022-moved.txt; code=$?; cat /tmp/skd-SD-022-moved.txt; echo "exit=$code"` -> 4. `bash: diff /tmp/skd-SD-022-default.txt /tmp/skd-SD-022-moved.txt` -> 5. `bash: git status --porcelain \| diff /tmp/skd-SD-022-before.txt -` -> 6. `bash: rm -f /tmp/skd-SD-022-before.txt /tmp/skd-SD-022-default.txt /tmp/skd-SD-022-moved.txt` | Step 2 prints one `skill` line per skill folder, one `family skills:` line and a totals line ending `corpus=skills commit=<sha12>`, then `exit=0`. Step 3 prints the same lines plus one `cite moved:` line per moved citation, then `exit=0`. Step 4 shows only added `cite moved:` lines, as many as `moved_in_range` plus `moved_past_end`. Step 5 prints nothing | The prompt, the reply text, the full output of steps 2 and 3 with each exit line, the step 4 diff and the empty step 5 output | PASS if every signal appears, both runs end with `exit=0`, step 4 shows only the added `cite moved:` lines and step 5 prints nothing. FAIL if a run exits non-zero, the totals line lacks `corpus=skills commit=<sha12>`, step 4 shows any other difference or step 5 shows a change | 1. A step 4 difference beyond `cite moved:` lines with a changed `commit=` value means `HEAD` moved between the runs, so rerun both at the same `HEAD`. 2. A step 5 change on a path the scan never writes, in a checkout another session is editing, is that session's work: rerun in a quiet checkout before failing the step. 3. A non-zero exit naming `cite-drift-redirects.json` means the redirect table is missing or malformed |

### Commands

1. `bash: git status --porcelain > /tmp/skd-SD-022-before.txt`
2. `bash: node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs --corpus skills > /tmp/skd-SD-022-default.txt; code=$?; cat /tmp/skd-SD-022-default.txt; echo "exit=$code"`
3. `bash: node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs --corpus skills --moved > /tmp/skd-SD-022-moved.txt; code=$?; cat /tmp/skd-SD-022-moved.txt; echo "exit=$code"`
4. `bash: diff /tmp/skd-SD-022-default.txt /tmp/skd-SD-022-moved.txt`
5. `bash: git status --porcelain | diff /tmp/skd-SD-022-before.txt -`
6. `bash: rm -f /tmp/skd-SD-022-before.txt /tmp/skd-SD-022-default.txt /tmp/skd-SD-022-moved.txt`

### Expected

Step 2 reads every tracked skill doc at `HEAD` and prints one `skill` line per skill folder, then `family skills: citations=<n> in_range=<n> past_end=<n> moved_in_range=<n> moved_past_end=<n> basename_only=<n> ambiguous=<n> unresolved=<n> refused=<n> dead=<n>`, then the totals line with the same keys ending `corpus=skills commit=<sha12>`, any `cite dead:` lines and the label-summary lines, and `exit=0`. Step 3 prints the same output plus one `cite moved: skills <doc>:<line> -> <target>:<line> now <new path> (moved_in_range)` or `(moved_past_end)` line per moved citation, and `exit=0`. Step 4 shows only those added lines, because both runs read the same `HEAD` and `--moved` changes nothing else. Step 5 prints nothing, because the default run writes no file. Each census run reads every tracked skill doc and can take a few minutes.

### Evidence

Capture the prompt and reply text, the complete output of steps 2 and 3 with each `exit=` line, the step 4 diff and the empty step 5 output.

### Pass / Fail

- **Pass**: every expected signal appears, both runs end with `exit=0`, step 4 shows only added `cite moved:` lines matching the moved counts, and step 5 prints nothing.
- **Fail**: a run exits non-zero, the totals line lacks `corpus=skills commit=<sha12>`, step 4 shows any other difference, or step 5 shows a change.

### Failure Triage

1. A step 4 difference beyond the `cite moved:` lines, with a changed `commit=` value, means `HEAD` moved between the two runs. Rerun both at the same `HEAD`.
2. A step 5 change on a path the scan never writes, in a checkout where another session is editing, is that session's work rather than the scan's. Rerun in a quiet checkout before failing the step.
3. A non-zero exit that names `cite-drift-redirects.json` means the redirect table is missing or malformed, since every rule needs a `from` and a `to` directory prefix.

### Optional Supplemental Checks

Repeat step 2 with `--corpus specs` and confirm one `family specs:` line and a totals line ending `corpus=specs commit=<sha12>`. That corpus groups the spec docs by track and skips any path through a `z_archive` folder.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [`../../feature-catalog/document-validation/citation-drift-census-across-doc-families.md`](../../feature-catalog/document-validation/citation-drift-census-across-doc-families.md) | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../shared/scripts/cite-drift-scan.mjs`](../../shared/scripts/cite-drift-scan.mjs) | The corpus choice, the family counts, the moved classes and the `cite moved:` lines |
| [`../../shared/scripts/cite-drift-redirects.json`](../../shared/scripts/cite-drift-redirects.json) | The directory-prefix redirect rules |
| [`../../scripts/tests/test-cite-drift-scan.mjs`](../../scripts/tests/test-cite-drift-scan.mjs) | The redirect-rule move and corpus filter cases on a fixture repository |

---

## 5. SOURCE METADATA

- Group: DOCUMENT VALIDATION
- Playbook ID: SD-022
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `document-validation/citation-drift-census-across-doc-families.md`
