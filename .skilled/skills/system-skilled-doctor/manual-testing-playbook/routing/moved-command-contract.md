---
title: "SKD-002 -- A moved doctor command keeps its name and behavior"
description: "This scenario validates that the doctor commands this skill took over still pass their contract tests and credit system-skilled-doctor."
catalog_applicable: false
version: 1.0.0.0
---

# SKD-002 -- A moved doctor command keeps its name and behavior

This file is the canonical operator contract for checking that the owned doctor commands kept their behavior.

---

## 1. OVERVIEW

This scenario verifies that the commands credited to this skill still pass their own contract tests and that each one's advisor bridge names this skill.

### Why This Matters

Only the `skill_agent` tag of each command moved. A command that changed behavior along with its owner would break every project that runs it today.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the owned commands keep their behavior under the new owner.
- Real user request: `check that the doctor commands still work after the ownership move`
- Prompt: `check that the doctor commands still work after the ownership move`
- Expected execution process: Run the doctor contract tests, then list the owner of each doctor bridge.
- Expected signals: Step 1 reports zero failures. Step 2 shows `system-skilled-doctor` for install, symlink, update, agents-md, runtime-mirrors, env, setup, helper, speckit and mcp.
- Desired user-visible outcome: The operator sees every owned command pass and credit this skill.
- Pass/fail: PASS if step 1 reports zero failures and step 2 lists the ten commands under this skill. FAIL on any test failure or any owned command credited elsewhere. SKIP when Node cannot run the tests, with the error named.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Run `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs`.
2. Run `grep -m1 -H skill_agent .skilled/commands/doctor/*.md`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-002 | Moved command contract | Prove the owned commands keep their behavior under the new owner. | `check that the doctor commands still work after the ownership move` | 1. `bash: node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` -> 2. `bash: grep -m1 -H skill_agent .skilled/commands/doctor/*.md` | Step 1 reports `fail 0`. Step 2 shows `system-skilled-doctor` for the ten owned commands. | The test summary lines, the grep output and both exit statuses. | PASS if step 1 reports zero failures and step 2 lists the ten commands under this skill. FAIL on any failure or any owned command credited elsewhere. SKIP when Node cannot run, with the error named. | 1. Read the first failing test's assertion. 2. Check whether a contract test still pins the old tag. 3. Escalate with the failing test name and its output. |

### Evidence Review

The test summary carries the behavior claim and the grep carries the ownership claim. Both must hold.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Package policy and scenario index. |
| [Skill contract](../../SKILL.md) | Names the owned commands. |
| `.skilled/commands/doctor/scripts/tests/` | The doctor contract tests. |

---

## 5. SOURCE METADATA

- Group: Routing
- Playbook ID: SKD-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `routing/moved-command-contract.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
