---
title: "RRL-001 -- Router bootstrap"
description: "This scenario validates the router prerequisite for `RRL-001`. It focuses on emitting the router into a repository that has none, before any rule is written."
stage: routing
version: 1.1.0.3
---

# RRL-001 -- Router bootstrap

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RRL-001`.

---

## 1. OVERVIEW

This scenario validates the router prerequisite for `RRL-001`. It focuses on emitting the router into a repository that has none, before any rule is written.

### Why This Matters

No router means no rule can load, whatever else is true about the rule. A rule written into a repository with no router is a file nothing reads, and it looks exactly like working coverage from the outside. The ordering is the whole test: the router is a prerequisite rather than a deliverable, so it must be emitted first and it must be reported honestly as something nobody asked for.

Destructive note: this scenario writes two files into a target repository. Run it against a scratch repository or revert both files afterwards.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RRL-001` and confirm the expected signals without contradictory evidence.

- Objective: emit the router before the rule when the target repository has no rule router
- Real user request: `This repo has no rules set up at all. Add a rule about not deleting migrations without a rollback.`
- Prompt: `This repository has no rules set up yet. Add a repo rule saying nobody deletes a database migration without a written rollback first.`
- Expected execution process: the decision tests run and admit the proposal. Before the rule is written, the target repository is checked for a rule router and none is found, so the router is emitted from the router template first. The rule is then written and wired into the router that now exists.
- Expected signals: the router file exists before the rule file, both exist at the end, the rule appears in the router as both a trigger row and an index row, and the reply names the router as a prerequisite rather than presenting it as part of the request.
- Desired user-visible outcome: the user gets the rule they asked for and a working router that makes it loadable, with the extra file explained rather than silently added.
- Pass/fail: PASS if the router exists before the rule and both wiring rows are present; FAIL if the rule is written first, or the router is emitted without the rule being wired into it.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `This repository has no rules set up yet. Add a repo rule saying nobody deletes a database migration without a written rollback first.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RRL-001 | Router bootstrap | Verify the router is emitted before the rule when the target repository has none | `This repository has no rules set up yet. Add a repo rule saying nobody deletes a database migration without a written rollback first.` | 1. `bash: test -f 'REPO RULES.md'` -> 2. `agent: Emit the router from assets/repo-rules-router-template.md` -> 3. `agent: Write the rule and add its trigger row and index row` -> 4. `bash: git log --reverse --diff-filter=A --format=%h --name-only -- 'REPO RULES.md' repo-rules/` | Step 1: the router is absent. Step 2: the router exists. Step 3: the rule exists with both rows. Step 4: the router was added before the rule | The step 1 result, both file paths, the two router rows, and the step 4 ordering | PASS if step 1 shows the router absent, step 4 shows the router added before the rule, and both rows are present; FAIL if the rule was written first or either row is missing | 1. Check the step 4 ordering first, since the whole scenario is about sequence and a correct final state can still come from a wrong order. 2. Confirm both rows were added, because a rule with a file and no trigger row cannot load and a trigger row with no file is worse. 3. Confirm the reply described the router as a prerequisite, since presenting an unrequested file as part of the ask is the reporting failure this scenario also guards |

### Commands

1. `bash: test -f 'REPO RULES.md'`
2. `agent: Emit the router from assets/repo-rules-router-template.md`
3. `agent: Write the rule file and add its trigger row and index row to the router`
4. `bash: git log --reverse --diff-filter=A --format=%h --name-only -- 'REPO RULES.md' repo-rules/`

### Expected

Step 1 fails, proving the router is genuinely absent rather than assumed absent. Step 2 creates the router from the template. Step 3 creates the rule and adds one trigger row and one index row. Step 4 shows the router added in the same change as or before the rule, never after. The reply names the router as a prerequisite that nobody asked for.

### Evidence

Capture the step 1 exit status, the paths of both created files, the two rows added to the router quoted in full, and the step 4 output showing the order files were added. The ordering evidence is the point of the scenario and cannot be reconstructed from the final state.

### Pass / Fail

- **Pass**: the router was absent at step 1, the router was created before or with the rule, both rows are present, and the reply explains the router as a prerequisite.
- **Fail**: the rule was written before the router existed, either wiring row is missing, or the extra file is presented as part of the original request.

### Failure Triage

1. Read the step 4 ordering before anything else. A correct final state reached in the wrong order still fails, because the intermediate state was a rule nothing could load.
2. Confirm both rows exist. A file with no trigger row is inert; a trigger row with no file looks like coverage and is the worse of the two failures.
3. Confirm the reply framed the router as a prerequisite. Emitting it silently leaves the user with a file they did not ask for and cannot account for.

### Optional Supplemental Checks

Run the same prompt against a repository that already has a router and confirm no second router is emitted. That proves the check is conditional rather than an unconditional step in the sequence.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| No feature-catalog entry | This packet ships no `feature-catalog/`, so no catalog cross-reference exists for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`references/agents-md-integration.md`](../../references/agents-md-integration.md) | Primary implementation anchor, sections 3 and 7 |
| [`assets/repo-rules-router-template.md`](../../assets/repo-rules-router-template.md) | The router the prerequisite emits |

---

## 5. SOURCE METADATA

- Group: LIFECYCLE AND WIRING
- Playbook ID: RRL-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `lifecycle-and-wiring/router-bootstrap.md`
