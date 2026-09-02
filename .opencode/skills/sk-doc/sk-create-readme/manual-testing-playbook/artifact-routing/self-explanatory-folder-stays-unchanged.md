---
title: "RMR-002 -- Self-explanatory folder stays unchanged"
description: "This scenario validates leaving a self-explanatory folder without a redundant README when parent documentation already serves its readers."
version: 1.1.0.3
---

# RMR-002 -- Self-explanatory folder stays unchanged

This document captures the negative README-routing contract.

---

## 1. OVERVIEW

This scenario validates the skip boundary for `RMR-002`. It focuses on a folder where parent documentation and inline comments already provide enough orientation.

### Why This Matters

The mode does not add a README to every folder. A redundant page creates another place for facts to drift. The decision tree allows parent documentation when the folder is self-explanatory and no reader is likely to land there.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RMR-002`.

- Objective: leave a self-explanatory folder unchanged when its parent documentation is sufficient.
- Realistic user request: `This small folder already has clear parent documentation and no reader is expected to land here. Should I add another README?`
- Prompt: `This small folder already has clear parent documentation and no reader is expected to land here. Should I add another README?`
- Expected execution process: inspect the folder and parent README, apply the decision tree and decline to author a new README.
- Expected signals: the answer says the folder is self-explanatory, cites the parent documentation and proposes no new file.
- Desired user-visible outcome: the repository avoids a redundant README.
- Pass/fail: PASS if the mode leaves the folder unchanged. FAIL if it creates a README without a reader need or evidence of missing orientation.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `This small folder already has clear parent documentation and no reader is expected to land here. Should I add another README?`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RMR-002 | Self-explanatory folder stays unchanged | Leave a folder without a redundant README | `This small folder already has clear parent documentation and no reader is expected to land here. Should I add another README?` | 1. `agent: Read SKILL.md Section 2 and state the skip branch of the README decision tree` -> 2. `agent: Inspect the target folder and its parent README` -> 3. `agent: State whether a reader is likely to land in the folder` -> 4. `bash: python3 .opencode/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py --repo-root . --validator .opencode/skills/sk-doc/shared/scripts/validate_document.py` | Step 1: the skip branch is stated. Step 2: parent documentation and folder contents are recorded. Step 3: no reader need is found. Step 4: audit output and exit status are captured | The prompt, decision-tree rule, target inventory, parent link and audit transcript | PASS if no README is proposed and the parent documentation is named. FAIL if a redundant README is authored or the answer skips evidence review | 1. Check whether the folder has a real audience. 2. Confirm parent navigation is sufficient. 3. Verify the audit command was run and its output was read |

### Commands

1. `agent: Read SKILL.md Section 2 and state the skip branch of the README decision tree`
2. `agent: Inspect the target folder and its parent README`
3. `agent: State whether a reader is likely to land in the folder`
4. `bash: python3 .opencode/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py --repo-root . --validator .opencode/skills/sk-doc/shared/scripts/validate_document.py`

### Expected

Step 1 identifies the skip branch. Step 2 verifies the parent documentation. Step 3 finds no reader need. Step 4 provides a repository-level audit receipt.

### Evidence

Capture the prompt, decision-tree rule, folder inventory, parent README path and audit output with its exit status.

### Pass / Fail

- **Pass**: the folder remains without a new README and the parent documentation is sufficient.
- **Fail**: the mode creates a README without a reader need or skips the local evidence review.

### Failure Triage

1. Check the target folder purpose.
2. Open the parent README and verify its navigation.
3. Confirm the response names a concrete reason to skip authoring.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory and scenario summary |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | README decision tree and skip branch |
| [`../../references/readme/types-and-voice.md`](../../references/readme/types-and-voice.md) | README audience decision |
| [`../../scripts/audit_readmes.py`](../../scripts/audit_readmes.py) | README inventory check |

---

## 5. SOURCE METADATA

- Group: ARTIFACT ROUTING
- Playbook ID: RMR-002
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `artifact-routing/self-explanatory-folder-stays-unchanged.md`
