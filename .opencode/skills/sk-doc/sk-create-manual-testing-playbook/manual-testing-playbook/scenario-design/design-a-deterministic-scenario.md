---
title: "MTP-006 -- Design a deterministic scenario"
description: "This scenario validates scenario design rules for `MTP-006`. It focuses on deterministic execution, prompt quality, voice selection, verdicts and prompt synchronization."
version: 1.0.0.3
---

# MTP-006 -- Design a deterministic scenario

This document captures the operator contract for `MTP-006`.

---

## 1. OVERVIEW

This scenario validates section 6 of the manual testing playbook authoring mode. It checks deterministic prompts and commands, observable signals, evidence, binary verdicts, voice choice and synchronized prompt fields.

### Why This Matters

Section 6 decides whether another operator can run and review a scenario. A vague prompt or mismatched summary can leave one scenario with different contracts.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MTP-006` and compare every expected signal with the scenario files.

- Objective: review a scenario against the deterministic design rules in section 6
- Realistic user request: `Review this draft scenario for deterministic steps, prompt quality, voice choice and synchronized prompt fields. Return PASS, FAIL or SKIP with a reason.`
- Prompt: `Review this draft scenario for deterministic steps, prompt quality, voice choice and synchronized prompt fields. Return PASS, FAIL or SKIP with a reason.`
- Expected execution process: read section 6, inspect the scenario contract, execution table and root summary, compare the prompt fields, then record one allowed verdict with evidence. Use SKIP only when a named sandbox or runtime blocker prevents the check.
- Expected signals: the review checks exact prompts and commands, observable signals, evidence, binary verdict criteria, natural-human or RCAF voice choice and matching prompt text across all required fields.
- Desired user-visible outcome: a review that states whether the scenario follows section 6 and names each mismatch if it does not.
- Pass/fail: PASS if every section 6 rule is checked, the prompt voice matches the actor, prompt text is synchronized and the result uses an allowed verdict. FAIL if a check is omitted, a prompt is vague, voice choice is wrong or prompt text differs.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this draft scenario for deterministic steps, prompt quality, voice choice and synchronized prompt fields. Return PASS, FAIL or SKIP with a reason.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MTP-006 | Design a deterministic scenario | Review section 6 rules for scenario quality and prompt synchronization | `Review this draft scenario for deterministic steps, prompt quality, voice choice and synchronized prompt fields. Return PASS, FAIL or SKIP with a reason.` | 1. `agent: Read section 6 of .opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` -> 2. `agent: Compare the Prompt field, the ### Prompt field, the Exact Prompt cell and the root summary` -> 3. `agent: Check exact commands, expected signals, evidence, pass/fail criteria and failure triage` -> 4. `agent: Return PASS, FAIL or SKIP with a specific reason and cite each mismatch` | Step 1: section 6 rules are identified. Step 2: every prompt field has the same text. Step 3: deterministic execution and evidence fields are present. Step 4: the voice choice matches the actor and the result uses PASS, FAIL or SKIP | The exact prompt, the compared contract fields, the root summary, the scenario table, the section 6 rules and the final verdict with its reason | PASS if all section 6 checks agree and the prompt fields match. FAIL if any required check is missing or the fields disagree. SKIP only with a named sandbox or runtime blocker | 1. Re-read section 6 and list the rule that failed. 2. Compare each prompt field character by character. 3. Check that the voice choice matches the actor before rerunning the review |

### Commands

1. `agent: Read section 6 of .opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md`
2. `agent: Compare the Prompt field, the ### Prompt field, the Exact Prompt cell and the root summary`
3. `agent: Check exact commands, expected signals, evidence, pass/fail criteria and failure triage`
4. `agent: Return PASS, FAIL or SKIP with a specific reason and cite each mismatch`

### Expected

Step 1 identifies determinism, prompt quality, voice choice and prompt synchronization rules. Step 2 confirms that the contract, table and root summary use one prompt. Step 3 confirms exact commands, expected signals, evidence, pass/fail criteria and failure triage. Step 4 records a verdict with a reason.

### Evidence

Capture the exact prompt, the section 6 rule list, the compared prompt fields, the root summary, the final verdict and its reason.

### Pass / Fail

- **Pass**: every section 6 rule is checked, the prompt voice fits the actor and the contract, table and root summary use matching prompt text.
- **Fail**: a rule is skipped, a prompt is vague, the voice does not fit the actor or any prompt field differs.

### Failure Triage

1. Map the failed signal to the matching rule in section 6.
2. Compare the scenario contract, execution table and root summary.
3. Re-run the review after the mismatch and its evidence are clear.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Section 6 scenario design rules |
| [`assets/manual-testing-playbook-snippet-template.md`](../../assets/manual-testing-playbook-snippet-template.md) | Scenario structure and prompt fields |
| [`scripts/validate-playbook-package.cjs`](../../scripts/validate-playbook-package.cjs) | Operator-scenario contract validator |

---

## 5. SOURCE METADATA

- Group: SCENARIO DESIGN
- Playbook ID: MTP-006
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `scenario-design/design-a-deterministic-scenario.md`
