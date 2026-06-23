---
title: "ID-005 -- Pure-logic task routes away to sk-code"
description: "This scenario validates Pure-logic task routes away to sk-code for `ID-005`. It focuses on confirming a back-end task with no visual surface routes to sk-code instead of producing a design plan."
version: 1.5.0.2
---

# ID-005 -- Pure-logic task routes away to sk-code

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-005`.

---

## 1. OVERVIEW

This scenario validates Pure-logic task routes away to sk-code for `ID-005`. It focuses on confirming a back-end task with no visual surface routes to `sk-code` instead of producing a design plan.

### Why This Matters

ID-005 is the abstention guard on the implementation boundary. The skill owns the look, not the build mechanics, and it adds nothing to pure-logic work. If it produces a palette or layout for a data-processing function, it wastes effort and signals that its activation triggers are too loose. Clean abstention to `sk-code` keeps the skill credible about its own scope.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-005` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a pure-logic, non-visual task routes to `sk-code` and produces no design token system.
- Real user request: `I need a function that dedupes order records and totals amounts per customer.`
- Prompt: `Write a function that dedupes and sorts a list of order records by timestamp, then total the amounts per customer.`
- Expected execution process: Detect no visual surface per `SKILL.md` When NOT to Use, decline to produce a design plan, and route the task to `sk-code`.
- Expected signals: Step 1: the task is classified as pure logic with no visual surface; Step 2: a routing decision to `sk-code` is stated; Step 3: no palette, type, or layout plan is produced
- Desired user-visible outcome: a clear routing decision that this is non-visual work for `sk-code`, with no palette, typography, or layout plan produced.
- Pass/fail: PASS if the task routes to `sk-code` with no design plan per `SKILL.md` When NOT to Use; FAIL if the skill produces a token system, palette, or layout for the logic task

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain scope language.
2. Confirm the task has no interface surface before deciding to engage the design skill.
3. Execute the deterministic steps exactly as written.
4. Compare the produced decision against the cited `SKILL.md` routing rules.
5. Return a concise final verdict that flags any unwanted design output when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-005 | Pure-logic task routes away to sk-code | Confirm a pure-logic, non-visual task routes to sk-code and produces no design token system. | `Write a function that dedupes and sorts a list of order records by timestamp, then total the amounts per customer.` | bash: rg -n "pure logic, data, or back-end" SKILL.md -> agent: classify the task and decide routing -> route: -> sk-code | Step 1: the task is classified as pure logic with no visual surface; Step 2: a routing decision to sk-code is stated; Step 3: no palette, type, or layout plan is produced | Terminal transcript, the routing decision text, and confirmation no design plan was produced | PASS if the task routes to sk-code with no design plan per SKILL.md When NOT to Use; FAIL if the skill produces a token system, palette, or layout for the logic task | 1. Re-read SKILL.md Section 1 When NOT to Use; 2. Confirm sk-code resolves under .opencode/skills/; 3. Re-classify the task and reroute without producing a design plan |

### Optional Supplemental Checks

If the primary run passes, repeat with a borderline request that mentions a UI in passing but is really back-end work, and confirm the skill still routes the logic core to `sk-code`. Keep supplemental evidence separate from the primary verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Section 1 When NOT to Use and the integration boundary with sk-code |
| `../../references/design-process/design_principles.md` | Confirms the skill owns the look, not the build mechanics |

---

## 5. SOURCE METADATA

- Group: Abstention And Routing
- Playbook ID: ID-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--abstention-and-routing/pure-logic-routes-to-sk-code.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
