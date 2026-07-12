---
title: "ID-006 -- Documentation task routes away to sk-doc"
description: "This scenario validates Documentation task routes away to sk-doc for `ID-006`. It focuses on confirming a prose or documentation task with no interface surface routes to sk-doc instead of producing a design plan."
version: 1.5.0.2
id: ID-006
expected_intent: DESIGN_PRINCIPLES
expected_resources:
  - references/design_process/design_principles.md
  - ../shared/register.md
---

# ID-006 -- Documentation task routes away to sk-doc

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-006`.

**Exact prompt**

```
Write the README for this CLI tool: install steps, usage examples, and a troubleshooting section.
```

---

## 1. OVERVIEW

This scenario validates Documentation task routes away to sk-doc for `ID-006`. It focuses on confirming a prose or documentation task with no interface surface routes to `sk-doc` instead of producing a design plan.

### Why This Matters

ID-006 is the second abstention guard, covering the documentation boundary. Writing a README is prose work, not interface work, and the skill must recognize that and hand off to `sk-doc`. If it instead reaches for palette and typography on a docs task, its activation is misfiring. This scenario pairs with ID-005 to prove the skill abstains cleanly on both non-visual boundaries.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-006` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a documentation or prose task with no interface surface routes to `sk-doc` and produces no design token system.
- Real user request: `Write the README for my CLI tool with install, usage, and troubleshooting sections.`
- Prompt: `Write the README for this CLI tool: install steps, usage examples, and a troubleshooting section.`
- Expected execution process: Detect that the task is documentation, not interface, per `SKILL.md` When NOT to Use, decline to produce a design plan, and route the task to `sk-doc`.
- Expected signals: Step 1: the task is classified as documentation with no interface surface; Step 2: a routing decision to `sk-doc` is stated; Step 3: no palette, type, or layout plan is produced
- Desired user-visible outcome: a clear routing decision that this is documentation work for `sk-doc`, with no design token system produced.
- Pass/fail: PASS if the task routes to `sk-doc` with no design plan per `SKILL.md` When NOT to Use; FAIL if the skill produces a token system, palette, or layout for the documentation task

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain scope language.
2. Confirm the task is prose or documentation with no interface surface before engaging the design skill.
3. Execute the deterministic steps exactly as written.
4. Compare the produced decision against the cited `SKILL.md` routing rules.
5. Return a concise final verdict that flags any unwanted design output when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-006 | Documentation task routes away to sk-doc | Confirm a documentation or prose task with no interface surface routes to sk-doc and produces no design token system. | `Write the README for this CLI tool: install steps, usage examples, and a troubleshooting section.` | bash: rg -n "documentation or prose, not interface" SKILL.md -> agent: classify the task and decide routing -> route: -> sk-doc | Step 1: the task is classified as documentation with no interface surface; Step 2: a routing decision to sk-doc is stated; Step 3: no palette, type, or layout plan is produced | Terminal transcript, the routing decision text, and confirmation no design plan was produced | PASS if the task routes to sk-doc with no design plan per SKILL.md When NOT to Use; FAIL if the skill produces a token system, palette, or layout for the documentation task | 1. Re-read SKILL.md Section 1 When NOT to Use; 2. Confirm sk-doc resolves under .opencode/skills/; 3. Re-classify the task and reroute without producing a design plan |

### Optional Supplemental Checks

If the primary run passes, repeat with a request that asks to "make the docs look nice" to confirm the skill still routes the writing work to `sk-doc` rather than treating cosmetic prose phrasing as an interface task. Keep supplemental evidence separate from the primary verdict.

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
| `../../SKILL.md` | Section 1 When NOT to Use routing documentation work to sk-doc |
| `../../references/design_process/design_principles.md` | Confirms the skill scope is interface look, not prose authoring |

---

## 5. SOURCE METADATA

- Group: Abstention And Routing
- Playbook ID: ID-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `abstention-and-routing/docs-task-routes-to-sk-doc.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
