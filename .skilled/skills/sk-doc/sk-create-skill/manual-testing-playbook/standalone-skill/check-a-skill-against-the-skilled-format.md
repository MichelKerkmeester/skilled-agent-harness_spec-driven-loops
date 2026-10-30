---
title: "SKL-009 -- Check a skill against the Skilled format"
description: "This scenario validates the read-only skill check for `SKL-009`. It focuses on the deep report rows C1 to C13, the fleet table, the JSON passthrough and the written-nothing boundary."
version: 1.0.1.0
---

# SKL-009 -- Check a skill against the Skilled format

This document captures the operator contract for `SKL-009`.

---

## 1. OVERVIEW

This scenario validates the read-only check target of `/doctor:sk-skill`. It reads one skill, or the whole fleet, against the current Skilled format and reports the distance row by row without writing anything.

### Why This Matters

A conversion is only as good as the reading in front of it. An operator who converts before checking cannot tell a row that was already failing from one the conversion broke, and a row reported as a pass nobody verified hides the same problem. The check has to name each row, name the validator behind it and stay read-only, so the reading can be taken as often as wanted.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKL-009` and inspect the deep, JSON, fleet and hub gap report forms.

- Objective: read one skill, the whole fleet and one mode's gaps against its hub, and confirm nothing was written
- Realistic user request: `How far is invoice-review from the Skilled format? Do not change anything.`
- Prompt: `How far is invoice-review from the Skilled format? Do not change anything.`
- Expected execution process: confirm the scratch skill exists, run the check for that one skill, run it again with `--json`, run the fleet form, run the hub gap report for a shipped mode, compare the tree before and after, and read the status of each row and the exit status of each run.
- Expected signals: the deep report opens with `Skill check: invoice-review (plain)` and prints one line per row `C1` to `C13`, each carrying `PASS`, `FINDING`, `UNKNOWN`, `INFO` or `N/A` and its own label. The `plain` skill reports findings on the format, router and metadata rows and the result line names the count. `--json` prints `mode`, `exitCode`, `findingCount`, `unknownCount` and `rows`, and no table. The fleet form prints `Skill fleet check` and one row per direct child of `.skilled/skills`, then `Roots: <N>; result: PASS|FINDINGS (<N>)`. The hub gap form prints `Hub gap report: <skill> into <hub> (<routingClass>)`, one `H1` to `H11` row with its detail and an `Evidence:` line, then `Rows: 11; ...`, the ungated-rows footer and a `Result:` line. The tree listing is byte-identical before and after. Exit status is 1 for the skill with findings, 0 for a clean skill and 2 when a validator the run needs cannot start.
- Desired user-visible outcome: a per-row reading of the skill's distance from the format, and of the surfaces a mode still needs under its hub, with the repair named for each finding and no file changed.
- Pass/fail: PASS if every row reports a status with its own detail, the JSON carries the same verdict as the text form, each hub gap row names its probe, the exit status matches the report and the tree is unchanged. FAIL if a row is missing, an `UNKNOWN` row is reported as a pass, the JSON disagrees with the text form, or any file changed.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `How far is invoice-review from the Skilled format? Do not change anything.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKL-009 | Check a skill against the Skilled format | Read one skill, the fleet and one mode's hub gaps against the Skilled format without writing | `How far is invoice-review from the Skilled format? Do not change anything.` | 1. `bash: ls .skilled/skills/invoice-review/SKILL.md` -> 2. `bash: node .skilled/commands/doctor/scripts/sk-skill-check.cjs check invoice-review` -> 3. `bash: node .skilled/commands/doctor/scripts/sk-skill-check.cjs check invoice-review --json` -> 4. `bash: node .skilled/commands/doctor/scripts/sk-skill-check.cjs check` -> 5. `bash: node .skilled/commands/doctor/scripts/sk-skill-check.cjs check sk-create-skill --into-hub sk-doc` -> 6. `bash: git -c core.fsmonitor=false status --porcelain .skilled/skills` | Step 1: the scratch skill is present. Step 2: `Skill check: invoice-review (plain)` followed by rows `C1` to `C13` and a `Result:` line, exit 1. Step 3: one JSON document with `mode`, `exitCode`, `findingCount`, `unknownCount` and `rows`, and no table, exit 1. Step 4: `Skill fleet check`, one row per skill root and a `Roots:` count, exit 0 or 1. Step 5: `Hub gap report: sk-create-skill into sk-doc (metadata)`, eleven `H1` to `H11` rows with their `Evidence:` lines, the `Rows: 11;` tally, the ungated-rows footer and `Result: PASS`, exit 0. Step 6: no output for that path | The prompt, the five transcripts with exit statuses, the row statuses, the JSON fields, the hub gap evidence lines and the before-and-after tree listing | PASS if each row carries a status and detail, the JSON agrees with the text form, each hub gap row names its probe, each exit status matches its report and the tree is unchanged. FAIL if a row is missing, `UNKNOWN` is counted as a pass, the two forms disagree, or a file changed | 1. Compare the row count with the `C1` to `C13` list and find the missing one. 2. When a row reads `UNKNOWN`, read its detail for the precondition it names. 3. When a run exits 2, read the `Provision:` line and run the command it names. 4. When a hub gap row reports `FINDING`, read its evidence line and treat the other rows as unmet surfaces rather than as integration. 5. When the tree changed, find the writing step in the run and stop before reading any verdict |

### Commands

1. `bash: ls .skilled/skills/invoice-review/SKILL.md`
2. `bash: node .skilled/commands/doctor/scripts/sk-skill-check.cjs check invoice-review`
3. `bash: node .skilled/commands/doctor/scripts/sk-skill-check.cjs check invoice-review --json`
4. `bash: node .skilled/commands/doctor/scripts/sk-skill-check.cjs check`
5. `bash: node .skilled/commands/doctor/scripts/sk-skill-check.cjs check sk-create-skill --into-hub sk-doc`
6. `bash: git -c core.fsmonitor=false status --porcelain .skilled/skills`

### Expected

Step 1 proves the fixture exists. Step 2 prints the deep report, one line per row, with the repair named for each finding and exit 1. Step 3 proves the JSON form carries the same verdict and nothing else. Step 4 proves the fleet form walks the whole skills root and counts its roots. Step 5 proves the hub gap form reports the eleven surfaces with the probe behind each one and registers nothing. Step 6 proves the reading wrote nothing.

### Evidence

Capture the prompt, every command with its exit status, the row lines with their statuses and details, the `Result:` line, the JSON fields, the fleet `Roots:` count, the hub gap rows with their evidence lines and the before-and-after tree listing.

### Pass / Fail

- **Pass**: all thirteen rows report a status with a detail, the JSON and text forms agree, the hub gap table carries eleven rows with their evidence, each exit status matches its report and the tree is unchanged.
- **Fail**: a row is missing, an `UNKNOWN` row is read as a pass, the JSON disagrees with the text form, a run exits 2 without its cause recorded, or any file changed.

### Failure Triage

1. Count the row lines against the `C1` to `C13` list.
2. Read the detail on each `UNKNOWN` row before judging the skill.
3. Run the `Provision:` command a failing run names, then rerun.
4. Re-read the run for a writing step when the tree changed, and treat the report as unproven until the cause is fixed.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| [`skill-format-check-and-convert.md`](../../../feature-catalog/skill-format-conversion/skill-format-check-and-convert.md) | Catalog entry for the check and convert command |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | The format the rows are read against |
| [`sk-skill.md`](../../../../../commands/doctor/sk-skill.md) | The command router and its target table |
| [`doctor-sk-skill-presentation.txt`](../../../../../commands/doctor/assets/doctor-sk-skill-presentation.txt) | Result tables, the JSON passthrough note and the status line |
| [`sk-skill-check.cjs`](../../../../../commands/doctor/scripts/sk-skill-check.cjs) | The engine behind rows `C1` to `C13` |
| [`sk-skill-check.test.cjs`](../../../../../commands/doctor/scripts/tests/sk-skill-check.test.cjs) | Engine suite, fleet and deep forms, JSON shape and exit statuses |

---

## 5. SOURCE METADATA

- Group: STANDALONE SKILL
- Playbook ID: SKL-009
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `standalone-skill/check-a-skill-against-the-skilled-format.md`
