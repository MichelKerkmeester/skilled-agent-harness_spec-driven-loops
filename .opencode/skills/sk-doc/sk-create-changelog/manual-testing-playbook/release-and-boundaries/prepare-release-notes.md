---
title: "CHG-006 -- Prepare release notes without inventing release mechanics"
description: "This scenario validates the release-note boundary for CHG-006. The changelog body and full-changelog path are prepared while tags, commits and GitHub release mechanics remain with sk-git."
version: 1.0.0.1
---

# CHG-006 -- Prepare release notes without inventing release mechanics

This document captures the operator contract for the optional release-note path.

## 1. OVERVIEW

This scenario validates the release-note boundary for `CHG-006`. It focuses on what the changelog workflow prepares and what it leaves to `sk-git`.

### Why This Matters

The workflow can prepare a GitHub release-note body from the changelog content and append a full-changelog path. Its sources do not define the exact tag syntax or the exact release command. Inventing those details would turn an authoring result into an unsupported release action.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-006` and confirm the leave-alone boundary.

- Objective: prepare release-note content without performing or inventing Git release mechanics
- Realistic user request: `Prepare the release notes for this changelog, but do not create a tag or publish anything yet.`
- Prompt: `Prepare the release-note body from the generated changelog. Append the full changelog path. Leave tag creation, commits and GitHub publishing to sk-git.`
- Expected execution process: the release-note rules are read, the changelog path is resolved, the body is prepared as-is with the full-changelog line and no unsupported Git command is invented.
- Expected signals: the body is available, the full path is appended and tag, commit and publish mechanics are explicitly deferred to `sk-git`.
- Desired user-visible outcome: release-note content that is safe to hand to the Git workflow.
- Pass/fail: PASS if content is prepared and release mechanics stay out of scope. FAIL if a tag or release command is invented or executed.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Prepare the release-note body from the generated changelog. Append the full changelog path. Leave tag creation, commits and GitHub publishing to sk-git.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-006 | Prepare release notes without inventing release mechanics | Prepare the body and defer Git operations | `Prepare the release-note body from the generated changelog. Append the full changelog path. Leave tag creation, commits and GitHub publishing to sk-git.` | 1. `agent: Read SKILL.md section 8 and references/topology-edge-cases.md section 6` -> 2. `agent: State the known release-note output and the release details that remain unknown` -> 3. `agent: Prepare the body from the changelog and append the full-changelog path` -> 4. `agent: State which Git operations are deferred to sk-git` | Step 1 identifies the optional release path. Step 2 distinguishes the body and path from unknown tag and command details. Step 3 produces content only. Step 4 defers tag, commit and publish operations | Exact prompt, source text, prepared body, full-changelog line, unknown details and deferred-operation statement | PASS if only release-note content is prepared. FAIL if the run invents or executes tag, commit or publish mechanics | 1. Check that the changelog path is resolved first. 2. Remove unsupported command details. 3. Confirm `sk-git` owns release mechanics |

### Commands

1. `agent: Read SKILL.md section 8 and references/topology-edge-cases.md section 6`
2. `agent: State the known release-note output and the release details that remain unknown`
3. `agent: Prepare the body from the changelog and append the full-changelog path`
4. `agent: State which Git operations are deferred to sk-git`

### Expected

The changelog body is used as the release-note body. The body ends with `Full changelog: .opencode/changelog/{component}/v{VERSION}.md`. The exact tag format, `gh release create` command, draft state and packet-local publishing support are not defined by this packet. Git mechanics stay with `sk-git`.

### Evidence

Capture the prompt, source sections, prepared body, appended path, unknown details and deferred-operation statement.

### Pass / Fail

- **Pass**: release-note content is prepared and unsupported Git mechanics are left alone.
- **Fail**: the run invents a tag format, executes a release command or claims a packet-local release is supported without a source rule.

### Failure Triage

1. Confirm the changelog path and version are resolved.
2. Compare the body with the shared release-note rule.
3. Remove any tag, commit or publish action from this workflow.

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
| [`SKILL.md`](../../SKILL.md) | Release-note boundary |
| [`references/topology-edge-cases.md`](../../references/topology-edge-cases.md) | Known release flow and unknown mechanics |
| [`assets/changelog-template.md`](../../assets/changelog-template.md) | Release-note body format |

---

## 5. SOURCE METADATA

- Group: RELEASE AND BOUNDARIES
- Playbook ID: CHG-006
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `release-and-boundaries/prepare-release-notes.md`
