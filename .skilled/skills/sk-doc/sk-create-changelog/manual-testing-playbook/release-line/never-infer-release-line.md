---
title: "CHG-009 -- Never infer the release line from a changed path"
description: "This scenario validates path-segment matching for CHG-009. Changed files under a skill resolve to that skill's folder and never to the skilled release line, even though every path starts with .skilled/."
version: 1.2.0.0
---

# CHG-009 -- Never infer the release line from a changed path

This document captures the operator contract for component auto-detection next to the release line.

## 1. OVERVIEW

This scenario validates component auto-detection for `CHG-009`. It focuses on whole path-segment matching and on the rule that a path never selects the release line.

### Why This Matters

Every tracked source path in this repository starts with `.skilled/`, and one component folder is named `skilled`. A substring match would send every change to the release line. The workflow matches whole path segments and resolves `skilled` only from an explicit component hint.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-009` and confirm the resolved component.

- Objective: resolve changed files under `.skilled/skills/sk-git/` to `sk-git`, never to `skilled`
- Realistic user request: `Write a changelog for my recent changes.`
- Prompt: `Create a global changelog from these changed files, with no component hint: .skilled/skills/sk-git/SKILL.md and .skilled/skills/sk-git/references/finish-workflows.md. Resolve the component by whole path segment and say why the skilled folder is not selected.`
- Expected execution process: `SKILL.md` section 6 is read for rules 2 and 8, the folders are listed, each path is split into segments, the segment `sk-git` matches its folder exactly and `.skilled` is not read as `skilled`.
- Expected signals: the component is `sk-git`, the target folder is `.skilled/changelog/sk-git/` and the response cites the rule that a changed path never selects `skilled`.
- Desired user-visible outcome: the entry lands in the owning skill's changelog.
- Pass/fail: PASS if the component is `sk-git` and the rule is cited. FAIL if the component is `skilled` or the match relied on a substring.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a global changelog from these changed files, with no component hint: .skilled/skills/sk-git/SKILL.md and .skilled/skills/sk-git/references/finish-workflows.md. Resolve the component by whole path segment and say why the skilled folder is not selected.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-009 | Never infer the release line from a changed path | Resolve a skill's changed files to that skill, never to skilled | `Create a global changelog from these changed files, with no component hint: .skilled/skills/sk-git/SKILL.md and .skilled/skills/sk-git/references/finish-workflows.md. Resolve the component by whole path segment and say why the skilled folder is not selected.` | 1. `agent: Read SKILL.md section 6 rules 2 and 8` -> 2. `bash: ls -d .skilled/changelog/*/` -> 3. `agent: Split each changed path into segments and match them against the folder names` -> 4. `agent: State the resolved component, the target folder and why skilled is not selected` | Step 1 states the whole-segment rule and the release-line rule. Step 2 lists both `sk-git/` and `skilled/`. Step 3 matches the segment `sk-git`. Step 4 names `sk-git` and cites rule 8 | Exact prompt, rule text, folder listing and exit status, segment comparison, resolved component and the cited rule | PASS if the component is `sk-git` and rule 8 is cited. FAIL if the component is `skilled` or a substring match decided it | 1. Recheck the segment split. 2. Compare whole segments, never substrings. 3. Confirm that no hint named `skilled`. |

### Commands

1. `agent: Read SKILL.md section 6 rules 2 and 8`
2. `bash: ls -d .skilled/changelog/*/`
3. `agent: Split each changed path into segments and match them against the folder names`
4. `agent: State the resolved component, the target folder and why skilled is not selected`

### Expected

Both paths contain the segment `sk-git`, which matches the `sk-git` folder exactly. Their first segment is `.skilled`, which is not the folder name `skilled`, and rule 8 forbids selecting `skilled` from any path. The component is `sk-git` and the target folder is `.skilled/changelog/sk-git/`.

### Evidence

Capture the prompt, the rule text, the folder listing and exit status, the segment comparison, the resolved component and the cited rule.

### Pass / Fail

- **Pass**: the changed files resolve to `sk-git` by whole path segment.
- **Fail**: the run selects `skilled`, or any other folder, from a substring of a path.

### Failure Triage

1. Recheck the segment split.
2. Compare whole segments, never substrings.
3. Confirm that no hint named `skilled`.

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
| [`SKILL.md`](../../SKILL.md) | Path-segment matching and the release-line rule |
| [`create-changelog-auto.yaml`](../../../../../commands/create/assets/create-changelog-auto.yaml) | Component detection strategy |
| [`references/topology-edge-cases.md`](../../references/topology-edge-cases.md) | Plain component folders and the release line |

---

## 5. SOURCE METADATA

- Group: RELEASE LINE
- Playbook ID: CHG-009
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `release-line/never-infer-release-line.md`
