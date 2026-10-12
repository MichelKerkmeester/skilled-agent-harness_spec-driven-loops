---
title: "CHG-010 -- Skip the release for a component other than skilled"
description: "This scenario validates the release guard for CHG-010. A component changelog written with --release keeps its file, and no tag or GitHub release is created because only the skilled release line publishes."
version: 1.2.0.0
---

# CHG-010 -- Skip the release for a component other than skilled

This document captures the operator contract for the release guard.

## 1. OVERVIEW

This scenario validates the release guard for `CHG-010`. It focuses on the check that runs before any tag or release command.

### Why This Matters

Component versions share the `vX.X.X.X` shape with the repository's release tags. A release step that tagged a component version would publish that component as if it were a Skilled release, and the tag would take a version number the release line may need later.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-010` and confirm the skipped release.

- Objective: confirm that `--release` on a component other than `skilled` keeps the changelog and creates no tag or GitHub release
- Realistic user request: `Write the sk-git changelog and publish it as a release.`
- Prompt: `Walk through the release step for an sk-git changelog written with --release. Before any tag or release command, check which component may publish, and report what the step does for sk-git.`
- Expected execution process: `SKILL.md` section 8 and the `step_7_publish_release` guard in both command YAMLs are read, the guard for a component other than `skilled` is applied and the step reports the skip.
- Expected signals: the response quotes the skip message, sets `release_published` to false and selects no `git tag`, `git push` or `gh release create` command.
- Desired user-visible outcome: the sk-git changelog stays written and nothing is tagged or published.
- Pass/fail: PASS if the release is skipped with its reason and no tag or release command is selected. FAIL if the run tags the component version, pushes a tag or creates a release.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Walk through the release step for an sk-git changelog written with --release. Before any tag or release command, check which component may publish, and report what the step does for sk-git.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-010 | Skip the release for a component other than skilled | Keep the component changelog and skip the tag and the release | `Walk through the release step for an sk-git changelog written with --release. Before any tag or release command, check which component may publish, and report what the step does for sk-git.` | 1. `agent: Read SKILL.md section 8 Release Notes and references/topology-edge-cases.md section 6` -> 2. `bash: rg -n 'primary_component != skilled' .skilled/commands/create/assets/create-changelog-auto.yaml .skilled/commands/create/assets/create-changelog-confirm.yaml` -> 3. `agent: Apply the guard to sk-git, state the skip message and confirm that no tag or release command is selected` | Step 1 states that only the skilled release line publishes. Step 2 finds the guard in both YAMLs. Step 3 quotes the skip message and selects no tag or release command | Exact prompt, rule text, guard lines and exit status, skip message, `release_published` value and the no-command statement | PASS if the release is skipped with its reason and no tag or release command is selected. FAIL if a tag, push or release command is selected or run | 1. Confirm that the component resolved to `sk-git`. 2. Check that the guard comes before every tag and release activity in both YAMLs. 3. Remove any tag, push or release command from the run. |

### Commands

1. `agent: Read SKILL.md section 8 Release Notes and references/topology-edge-cases.md section 6`
2. `bash: rg -n 'primary_component != skilled' .skilled/commands/create/assets/create-changelog-auto.yaml .skilled/commands/create/assets/create-changelog-confirm.yaml`
3. `agent: Apply the guard to sk-git, state the skip message and confirm that no tag or release command is selected`

### Expected

Both command YAMLs carry a guard that runs before any tag command. When `publish_release` is true and the component is not `skilled`, the step reports `Publish Release requested for sk-git, but release tags belong to the skilled release line. Skipping release; the changelog file is already written.`, sets `release_published` to false and continues to the save step. The changelog file stays written, and nothing is tagged or published.

### Evidence

Capture the prompt, the rule text, the guard lines and exit status, the skip message, the `release_published` value and the statement that no tag or release command was selected.

### Pass / Fail

- **Pass**: the release is skipped with its reason and the changelog file stays in place.
- **Fail**: the run tags the component version, pushes a tag or creates a GitHub release.

### Failure Triage

1. Confirm that the component resolved to `sk-git`.
2. Check that the guard comes before every tag and release activity in both YAMLs.
3. Remove any tag, push or release command from the run.

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
| [`SKILL.md`](../../SKILL.md) | Release boundary for the skilled release line |
| [`references/topology-edge-cases.md`](../../references/topology-edge-cases.md) | Release flow and the component guard |
| [`create-changelog-auto.yaml`](../../../../../commands/create/assets/create-changelog-auto.yaml) | Release guard in step 7 |
| [`create-changelog-confirm.yaml`](../../../../../commands/create/assets/create-changelog-confirm.yaml) | Release guard in step 7 |

---

## 5. SOURCE METADATA

- Group: RELEASE LINE
- Playbook ID: CHG-010
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `release-line/skip-release-for-component.md`
