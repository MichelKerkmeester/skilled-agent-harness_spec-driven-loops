---
title: "BMR-004 -- Author a Lane C index"
description: "This scenario validates Lane C index authoring for BMR-004. The workflow owns the hub benchmark README and storage convention while the deep-improvement lane owns reports, scoring and rendering."
version: 1.0.0.0
---

# BMR-004 -- Author a Lane C index

This document captures the operator contract for authoring a Lane C benchmark index.

## 1. OVERVIEW

This scenario validates Lane C index authoring for `BMR-004`. It focuses on the storage convention and the renderer boundary.

### Why This Matters

The hub `benchmark/README.md` is a human-maintained index. Lane C run folders and their report pair are machine outputs. Editing a rendered report by hand creates drift that the next run removes. The authoring workflow must know which side of the boundary it owns.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BMR-004` and confirm the expected boundary.

- Objective: author or update a Lane C hub index without hand-writing a report
- Realistic user request: `Add the new skill-benchmark run to the skill's benchmark page and keep the report accurate.`
- Prompt: `Update the Lane C benchmark index for this skill. Add the run-label row and link the storage and scoring authorities. Do not hand-edit the rendered report.`
- Expected execution process: the skill-benchmark storage guide is read, the `benchmark/` tree and `reports/` boundary are identified, the README template is used and the renderer-owned report is left to the harness.
- Expected signals: the run is a sibling under `benchmark/reports/`, `baseline/` stays frozen, `benchmark/README.md` is the authored index and `skill-benchmark-report.md` is renderer-owned.
- Desired user-visible outcome: a current index with a valid run-label row and no report drift.
- Pass/fail: PASS if the index and renderer boundary are explicit. FAIL if the report Markdown is hand-authored or `baseline/` is regenerated.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Update the Lane C benchmark index for this skill. Add the run-label row and link the storage and scoring authorities. Do not hand-edit the rendered report.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BMR-004 | Author a Lane C index | Update the hub index and leave rendered reports to the harness | `Update the Lane C benchmark index for this skill. Add the run-label row and link the storage and scoring authorities. Do not hand-edit the rendered report.` | 1. `agent: Read references/skill-benchmark/skill-benchmark-storage-guide.md sections 2 and 5` -> 2. `agent: Read assets/skill-benchmark/skill-benchmark-readme-template.md` -> 3. `bash: test -d .opencode/skills/sk-code/benchmark` -> 4. `agent: State which files are authored and which files are renderer-owned` | Step 1 names `benchmark/README.md`, `reports/`, frozen `baseline/` and the report boundary. Step 2 supplies the index shape. Step 3 exits 0. Step 4 leaves report Markdown and JSON to the Lane C harness | Exact prompt, guide and template paths, target output and exit status, authored-file list and renderer-owned list | PASS if only the index convention is authored and `baseline/` is preserved. FAIL if a report is hand-edited or a run folder is overwritten | 1. Re-read storage section 5. 2. Confirm the run label follows the date and subject grammar. 3. Check that the scoring contract is linked rather than copied |

### Commands

1. `agent: Read references/skill-benchmark/skill-benchmark-storage-guide.md sections 2 and 5`
2. `agent: Read assets/skill-benchmark/skill-benchmark-readme-template.md`
3. `bash: test -d .opencode/skills/sk-code/benchmark`
4. `agent: State which files are authored and which files are renderer-owned`

### Expected

The authored surface is the hub `benchmark/README.md` index. Each run is a sibling under `benchmark/reports/`. The `baseline/` directory is frozen. The `skill-benchmark-report.md` file is rendered from JSON by deep-improvement. The scoring and operator contracts are cross-linked instead of copied.

### Evidence

Capture the prompt, the storage guide sections, the template path, the target-directory output and exit status and the ownership decision.

### Pass / Fail

- **Pass**: the index is updated within its ownership boundary and the renderer-owned report remains lane-owned.
- **Fail**: the run edits the rendered report, rewrites the frozen baseline or overwrites a sibling run.

### Failure Triage

1. Check whether the proposed edit targets the hub index or a run report.
2. Confirm the report JSON is the machine source for rendered Markdown.
3. Confirm `baseline/` is treated as frozen.
4. Restore the lane boundary before accepting the index change.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| No feature-catalog entry | This mode has no catalog package for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Lane C storage and ownership boundary |
| [`references/skill-benchmark/skill-benchmark-storage-guide.md`](../../references/skill-benchmark/skill-benchmark-storage-guide.md) | Run storage and renderer rules |
| [`assets/skill-benchmark/skill-benchmark-readme-template.md`](../../assets/skill-benchmark/skill-benchmark-readme-template.md) | Hub index scaffold |

---

## 5. SOURCE METADATA

- Group: BENCHMARK FAMILIES
- Playbook ID: BMR-004
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `benchmark-families/author-lane-c-index.md`
