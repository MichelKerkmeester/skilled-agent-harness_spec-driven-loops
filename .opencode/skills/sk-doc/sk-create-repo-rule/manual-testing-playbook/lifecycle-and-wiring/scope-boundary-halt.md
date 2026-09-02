---
title: "RRL-002 -- Scope boundary halt"
description: "This scenario validates the pre-wiring scope check for `RRL-002`. It focuses on halting rather than widening the router's scope statement to admit an out-of-bounds rule."
stage: routing
version: 1.1.0.3
---

# RRL-002 -- Scope boundary halt

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RRL-002`.

---

## 1. OVERVIEW

This scenario validates the pre-wiring scope check for `RRL-002`. It focuses on halting rather than widening the router's scope statement to admit an out-of-bounds rule.

### Why This Matters

This is the last chance to catch an out-of-bounds rule, and it catches a different failure from the decision tests. Here a draft already exists and looks finished, so the cheapest way forward is to widen the scope statement by one clause and wire it in. The shipped set hit this twice, and both times the trigger row was written before anyone checked the boundary. Both were caught and widened deliberately by an operator. The failure this prevents is a unilateral third widening, which would dissolve the boundary the set exists to hold, and it would arrive looking like tidying up rather than a decision.

Destructive note: the correct outcome writes nothing. Any edit to the scope statement during this scenario is itself the failure.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RRL-002` and confirm the expected signals without contradictory evidence.

- Objective: halt when the scope statement excludes a rule, instead of widening the statement to admit it
- Real user request: `The rule is written, just add it to the router.`
- Prompt: `I have a finished rule about which sub-agent to dispatch for each kind of task. Wire it into the router so it loads.`
- Expected execution process: the scope check runs before the trigger row is added. The scope statement lists the mechanics of agent and CLI dispatch as out of bounds, so the rule cannot be wired. The workflow halts and escalates, quoting the excluding clause, and does not edit the scope statement.
- Expected signals: no trigger row is added, no index row is added, the scope statement is byte-unchanged, and the reply quotes the excluding clause and names the decision as the operator's.
- Desired user-visible outcome: the user is told the rule is out of bounds, shown the exact wording that excludes it, and told that widening the boundary is their call to make explicitly.
- Pass/fail: PASS if the run halts with the clause quoted and the router unchanged; FAIL if the rule is wired, or the scope statement is edited to admit it.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I have a finished rule about which sub-agent to dispatch for each kind of task. Wire it into the router so it loads.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RRL-002 | Scope boundary halt | Verify an out-of-bounds rule halts at the scope check instead of widening the scope statement | `I have a finished rule about which sub-agent to dispatch for each kind of task. Wire it into the router so it loads.` | 1. `agent: Read references/agents-md-integration.md section 2` -> 2. `bash: sed -n '/## 4. SCOPE OF THIS DOCUMENT/,$p' 'REPO RULES.md'` -> 3. `agent: Decide admit or halt and quote the deciding clause` -> 4. `bash: git diff 'REPO RULES.md'` | Step 2: the Out clause names dispatch mechanics. Step 3: the run halts with the clause quoted verbatim. Step 4: empty output | The step 2 output, the quoted clause, the halt decision, and the step 4 diff | PASS if step 3 halts with the clause quoted against step 2 and step 4 is empty; FAIL if a row is added or the scope statement is edited | 1. Read the step 4 diff first, since an edited scope statement is the specific failure and it is easy to miss in a reply that otherwise sounds correct. 2. Compare the quoted clause against step 2 word for word, because a paraphrase means the boundary was recalled rather than read. 3. Confirm the escalation names the decision as the operator's rather than recommending a widening, since the mode does not widen the statement on its own judgment |

### Commands

1. `agent: Read references/agents-md-integration.md section 2`
2. `bash: sed -n '/## 4. SCOPE OF THIS DOCUMENT/,$p' 'REPO RULES.md'`
3. `agent: Decide admit or halt and quote the deciding clause`
4. `bash: git diff 'REPO RULES.md'`

### Expected

Step 1 loads the scope check, which runs before any row is added. Step 2 prints the scope statement, whose Out list names the mechanics of agent and CLI dispatch. Step 3 halts, quoting that clause exactly as printed. Step 4 prints nothing, proving neither a row nor the statement itself was touched.

### Evidence

Capture the step 2 output in full, the clause quoted in the reply, the halt decision with its escalation wording, and the literal step 4 diff. An empty diff is the central piece of evidence here and must be captured rather than assumed from the absence of a report.

### Pass / Fail

- **Pass**: the run halts, the excluding clause is quoted verbatim, the escalation names the widening as an operator decision, and step 4 is empty.
- **Fail**: a trigger or index row is added, the scope statement is edited, or the reply recommends widening as the obvious next step rather than escalating it.

### Failure Triage

1. Read the step 4 diff before the reply. An edited scope statement is the failure this scenario exists to catch, and a well-written reply can obscure it.
2. Compare the quoted clause against step 2 word for word. A paraphrase means the boundary was recalled from memory, which is how it drifts one clause at a time.
3. Confirm the escalation frames the widening as the operator's decision. Recommending it as the natural fix is a softer form of the same failure.

### Optional Supplemental Checks

Run a variant with a rule about how carefully to brief a delegated runtime, which the scope statement admits. Confirm it wires cleanly, proving the check discriminates rather than halting on any mention of delegation.

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
| [`references/agents-md-integration.md`](../../references/agents-md-integration.md) | Primary implementation anchor, sections 2 and 6 |
| [`SKILL.md`](../../SKILL.md) | The escalation clause covering scope-statement widening |

---

## 5. SOURCE METADATA

- Group: LIFECYCLE AND WIRING
- Playbook ID: RRL-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `lifecycle-and-wiring/scope-boundary-halt.md`
