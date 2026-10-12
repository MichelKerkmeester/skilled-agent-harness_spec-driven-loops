---
title: "CHG-006 -- Prepare release notes without publishing"
description: "This scenario validates the release-note boundary for CHG-006. Without --release, the run prepares the body and the full-changelog line and runs no tag, push or release command."
version: 1.3.0.4
---

# CHG-006 -- Prepare release notes without publishing

This document captures the operator contract for the release-note path when no release was requested.

## 1. OVERVIEW

This scenario validates the release-note boundary for `CHG-006`. It focuses on what a run prepares when it was not asked to publish.

### Why This Matters

The workflow's `step_7_publish_release` tags and publishes a GitHub release, but only when `publish_release` is explicitly true and the component is `skilled`. A run that was not asked to publish must prepare the notes and stop there, because a pushed tag is public and hard to withdraw.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-006` and confirm that nothing is published.

- Objective: prepare release-note content and leave the tag and the release alone when no release was requested
- Realistic user request: `Prepare the release notes for this changelog, but do not create a tag or publish anything yet.`
- Prompt: `Prepare the release-note body from the generated changelog and append the full changelog path. Do not tag or publish anything.`
- Expected execution process: the release-note rules are read, the changelog path is resolved and the body is prepared, with the frontmatter block and the editorial H1 removed and the full-changelog line appended. Step 7 records that no release was requested.
- Expected signals: the body is available, the full path is appended, `publish_release` stays false and no `git tag`, `git push` or `gh release create` command runs. The run names the release mechanics only as what `--release` on a `skilled` entry would trigger.
- Desired user-visible outcome: release-note content ready to publish later.
- Pass/fail: PASS if content is prepared and nothing is tagged, pushed or published. FAIL if a tag, push or release command runs, if the run calls the release mechanics undefined or if it says a component other than `skilled` publishes.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Prepare the release-note body from the generated changelog and append the full changelog path. Do not tag or publish anything.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-006 | Prepare release notes without publishing | Prepare the body and leave the tag and the release alone | `Prepare the release-note body from the generated changelog and append the full changelog path. Do not tag or publish anything.` | 1. `agent: Read SKILL.md section 8 Release Notes and references/topology-edge-cases.md section 6` -> 2. `agent: State the release mechanics step_7_publish_release defines and the two conditions that gate them` -> 3. `agent: Prepare the body from the changelog and append the full-changelog path` -> 4. `bash: git tag --list v{VERSION}` | Step 1 finds the release rule. Step 2 names tag `v{VERSION}`, `git tag -a`, `git push origin` and `gh release create`, gated on an explicit `publish_release` and the `skilled` component. Step 3 produces content only. Step 4 prints nothing | Exact prompt, source text, the named mechanics and gates, prepared body, full-changelog line and the empty tag listing | PASS if only release-note content is prepared and no tag exists for the version. FAIL if a tag, push or release command runs or if the mechanics are called undefined | 1. Check that the changelog path is resolved first. 2. Compare the body with the release-note rule. 3. Confirm `publish_release` was never set and step 7 recorded no request |

### Commands

1. `agent: Read SKILL.md section 8 Release Notes and references/topology-edge-cases.md section 6`
2. `agent: State the release mechanics step_7_publish_release defines and the two conditions that gate them`
3. `agent: Prepare the body from the changelog and append the full-changelog path`
4. `bash: git tag --list v{VERSION}`

### Expected

The body is the changelog content with its frontmatter block and editorial H1 removed, ending with `Full changelog: .skilled/changelog/{component}/v{VERSION}.md`. With no `--release`, `publish_release` stays false, step 7 records `Not requested` and no tag, push or release command runs, so the tag listing prints nothing. The run states that step 7 publishes only for the `skilled` release line on an explicit request, as tag `v{VERSION}` through `git tag -a`, `git push origin` and `gh release create`.

### Evidence

Capture the prompt, source sections, the named mechanics and gates, prepared body, appended path and the tag listing.

### Pass / Fail

- **Pass**: release-note content is prepared and nothing is tagged, pushed or published.
- **Fail**: the run creates or pushes a tag, runs `gh release create`, calls the release mechanics undefined or says a component other than `skilled` publishes.

### Failure Triage

1. Confirm the changelog path and version are resolved.
2. Compare the body with the release-note rule in `SKILL.md` section 8.
3. Confirm `publish_release` was never set and step 7 recorded `Not requested`.

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
| [`SKILL.md`](../../SKILL.md) | Release-note rule and the release step's gates |
| [`references/topology-edge-cases.md`](../../references/topology-edge-cases.md) | The release flow as `step_7_publish_release` defines it |
| [`assets/changelog-template.md`](../../assets/changelog-template.md) | Release-note body format |
| [`create-changelog-auto.yaml`](../../../../../commands/create/assets/create-changelog-auto.yaml) | `step_7_publish_release` |

---

## 5. SOURCE METADATA

- Group: RELEASE AND BOUNDARIES
- Playbook ID: CHG-006
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `release-and-boundaries/prepare-release-notes.md`
