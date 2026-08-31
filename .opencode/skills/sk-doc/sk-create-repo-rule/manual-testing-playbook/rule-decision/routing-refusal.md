---
title: "RRD-003 -- Routing refusal"
description: "This scenario validates the routing refusal for `RRD-003`. It focuses on refusing dispatch mechanics under the scope boundary, with the scope statement quoted rather than paraphrased."
stage: routing
version: 1.0.0.0
---

# RRD-003 -- Routing refusal

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RRD-003`.

---

## 1. OVERVIEW

This scenario validates the routing refusal for `RRD-003`. It focuses on refusing dispatch mechanics under the scope boundary, with the scope statement quoted rather than paraphrased.

### Why This Matters

The router declares what the rule set is In and Out for, and Out is not advisory. Which agent, which command, which model, which flags: all of it is owned elsewhere. The failure this prevents is boundary dissolution. The set has widened its scope statement exactly twice, both times deliberately, and a third widening to admit routing would dissolve the distinction the set exists to hold. The scenario also checks a subtler thing: the workflow must quote the scope statement rather than paraphrase it, because a paraphrase is how a boundary gets remembered wrong and then applied wrong.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RRD-003` and confirm the expected signals without contradictory evidence.

- Objective: refuse a routing proposal under the scope boundary test and quote the scope statement that refuses it
- Real user request: `Add a rule about which CLI executor to use for research runs.`
- Prompt: `Add a repo rule covering which CLI executor we should pick for research runs, and which thinking level to set for each one.`
- Expected execution process: the decision tests load, test 1 passes because the content fires on an action, and test 2 refuses it. The proposal is dispatch mechanics, which the scope statement lists as Out. Section 5 maps a test-2 refusal to the always-loaded routing section or the skill its router resolves.
- Expected signals: the reply refuses, names decision test 2, and quotes the Out clause of the scope statement verbatim rather than summarizing it. No new file appears under `repo-rules/` and the scope statement is unchanged.
- Desired user-visible outcome: the user learns the proposal is out of bounds for the rule set, sees the exact wording that puts it out of bounds, and is told which surface owns it.
- Pass/fail: PASS if the refusal names test 2 and quotes the Out clause verbatim; FAIL if a rule is written, the scope statement is widened, or the boundary is described only in paraphrase.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Add a repo rule covering which CLI executor we should pick for research runs, and which thinking level to set for each one.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RRD-003 | Routing refusal | Verify dispatch mechanics are refused by the scope boundary with the scope statement quoted | `Add a repo rule covering which CLI executor we should pick for research runs, and which thinking level to set for each one.` | 1. `agent: Read references/decision-tests.md` -> 2. `agent: Apply test 2 and classify the proposal as routing or posture` -> 3. `bash: sed -n '/## 4. SCOPE OF THIS DOCUMENT/,$p' 'REPO RULES.md'` -> 4. `bash: git diff --stat 'REPO RULES.md'` | Step 2: the proposal is classified as routing. Step 3: the Out clause names dispatch mechanics and is quoted in the reply verbatim. Step 4: empty output | The prompt, the refusal text, the quoted Out clause, the step 3 output, and the step 4 diff | PASS if step 2 refuses by test 2, the reply quotes the Out clause word for word against step 3, and step 4 is empty; FAIL if a rule is written, the scope statement is edited, or the boundary is only paraphrased | 1. Compare the reply's quoted clause against the step 3 output character by character, since a paraphrase means the check ran from memory rather than from the file. 2. Confirm step 4 is empty, because widening the scope statement to admit the request is an escalation for the operator and never a unilateral fix. 3. If the classification came out as posture, re-read the line that separates the two: how to dispatch is owned elsewhere, how to think while dispatching belongs to the set |

### Commands

1. `agent: Read references/decision-tests.md`
2. `agent: Apply test 2 and classify the proposal as routing or posture`
3. `bash: sed -n '/## 4. SCOPE OF THIS DOCUMENT/,$p' 'REPO RULES.md'`
4. `bash: git diff --stat 'REPO RULES.md'`

### Expected

Step 1 loads the tests. Step 2 classifies the proposal as routing, because executor choice and thinking level are dispatch mechanics. Step 3 prints the scope statement, and the Out clause in it is the text the refusal must quote. Step 4 prints nothing, proving the scope statement was not quietly widened to make the request admissible.

### Evidence

Capture the prompt, the refusal text including the quoted clause, the literal step 3 output for comparison, and the step 4 diff. The comparison between the quoted clause and the step 3 output is the point of the scenario, so both must be captured in full rather than summarized.

### Pass / Fail

- **Pass**: the refusal names decision test 2, quotes the Out clause verbatim as it appears in step 3, and leaves the scope statement untouched.
- **Fail**: a rule file is written, the scope statement is edited, or the boundary is described in the reviewer's own words rather than quoted.

### Failure Triage

1. Compare the quoted clause against the step 3 output word for word. A near-quote is the signal that the boundary was recalled rather than read, which is how it drifts.
2. Confirm step 4 is empty. Widening the scope statement is an operator decision and an escalation, never a way to make a refused request pass.
3. If the proposal was classified as posture, re-read the separating line. How to dispatch belongs elsewhere; how to think while dispatching belongs to the set. Executor choice sits on the first side.

### Optional Supplemental Checks

Run a near-miss variant asking for a rule about how carefully to brief a delegated runtime. That is posture and should be admitted by test 2, proving the boundary discriminates rather than refusing everything that mentions delegation.

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
| [`references/decision-tests.md`](../../references/decision-tests.md) | Primary implementation anchor, section 2 |
| [`references/agents-md-integration.md`](../../references/agents-md-integration.md) | The scope-statement check and the escalation boundary |

---

## 5. SOURCE METADATA

- Group: RULE DECISION
- Playbook ID: RRD-003
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `rule-decision/routing-refusal.md`
