---
title: "BMR-002 -- Leave an in-flight benchmark in the packet"
description: "This scenario validates the MCP promotion boundary for BMR-002. An unfinished, unstable or unreplayable benchmark remains in the spec packet and is not promoted into a live skill tree."
version: 1.0.0.0
---

# BMR-002 -- Leave an in-flight benchmark in the packet

This document captures the operator contract for declining MCP promotion when the adoption gate is not met.

## 1. OVERVIEW

This scenario validates the negative MCP promotion path for `BMR-002`. It focuses on what `sk-create-benchmark` must leave alone.

### Why This Matters

An in-flight benchmark has no stable conclusion to publish. A single-run signal, missing replay command or unaccepted decision belongs in the source packet until the evidence is ready. Promoting it gives a live skill tree a claim that the owning lane cannot reproduce.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BMR-002` and confirm the expected refusal.

- Objective: leave an in-flight or unreplayable benchmark in its source packet
- Realistic user request: `The bake-off is still running and the fixture changed twice. Can you publish it in the skill folder now?`
- Prompt: `Check whether this benchmark is ready for MCP promotion. If the decision, fixture or replay path is incomplete, leave it in the source packet and explain why.`
- Expected execution process: `SKILL.md` section 1 and the shared pitfalls reference are read, the adoption gate is applied to each missing input then no skill-local benchmark file is proposed.
- Expected signals: the reply names the missing gate input, keeps the result in the packet and states that a stable rerunnable result is required. It does not turn a provisional signal into a winner.
- Desired user-visible outcome: a clear refusal with the next evidence needed before promotion.
- Pass/fail: PASS if the run leaves the result in the packet and names the unmet gate. FAIL if it promotes the result or hides the missing evidence.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Check whether this benchmark is ready for MCP promotion. If the decision, fixture or replay path is incomplete, leave it in the source packet and explain why.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BMR-002 | Leave an in-flight benchmark in the packet | Refuse promotion when the adoption gate is incomplete | `Check whether this benchmark is ready for MCP promotion. If the decision, fixture or replay path is incomplete, leave it in the source packet and explain why.` | 1. `agent: Read SKILL.md section 1 and state when MCP promotion is not allowed` -> 2. `agent: Read references/shared/pitfalls.md and state the single-run rule` -> 3. `agent: Inspect the supplied benchmark notes for an accepted decision, stable fixture and replay command` -> 4. `agent: Return a refusal and list the evidence needed before promotion` | Step 1 names the promotion gate. Step 2 states that a single-run signal stays provisional. Step 3 identifies the missing input. Step 4 leaves the result in the packet and gives a concrete next check | Exact prompt, quoted gate, notes inspected, missing input, refusal and next evidence list | PASS if the result stays in the source packet and the missing gate input is named. FAIL if a promotion folder or winner is proposed without the missing evidence | 1. Check whether the answer called the result provisional. 2. Confirm the source packet remains the storage location. 3. Remove any invented metric or winner |

### Commands

1. `agent: Read SKILL.md section 1 and state when MCP promotion is not allowed`
2. `agent: Read references/shared/pitfalls.md and state the single-run rule`
3. `agent: Inspect the supplied benchmark notes for an accepted decision, stable fixture and replay command`
4. `agent: Return a refusal and list the evidence needed before promotion`

### Expected

The adoption gate is not met when the benchmark is still in progress, the fixture is unstable, the result cannot be replayed or the decision is not accepted. A single-run lead stays provisional. The correct output keeps the evidence in the spec packet and lists the missing acceptance input.

### Evidence

Capture the prompt, the gate and pitfall text, the benchmark notes inspected, the missing input and the refusal.

### Pass / Fail

- **Pass**: the run leaves the benchmark in the source packet and names the missing acceptance input.
- **Fail**: the run promotes an in-flight result, declares a winner from a provisional lead or gives no reason for the refusal.

### Failure Triage

1. Verify that the gate was applied before discussing folder names.
2. Confirm the fixture and replay path are stable.
3. Check that the decision record is accepted.
4. If any item is missing, keep the result in the packet.

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
| [`SKILL.md`](../../SKILL.md) | Promotion gate and refusal boundary |
| [`references/shared/pitfalls.md`](../../references/shared/pitfalls.md) | Single-run and promotion pitfalls |
| [`references/shared/case-studies.md`](../../references/shared/case-studies.md) | Provisional benchmark example |

---

## 5. SOURCE METADATA

- Group: FAMILY ROUTING
- Playbook ID: BMR-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `family-routing/leave-in-flight-benchmark.md`
