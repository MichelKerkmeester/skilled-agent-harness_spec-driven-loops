---
title: "ORCA-001 -- Advisor routes an Orca-qualified request"
description: "This scenario validates that an Orca-qualified worktree handoff request routes to cli-orca ahead of any generic git skill."
catalog_applicable: true
version: 1.0.0.0
---

# ORCA-001 -- Advisor routes an Orca-qualified request

This file is the canonical operator contract for Orca-qualified routing into `cli-orca`.

---

## 1. OVERVIEW

This scenario verifies that the skill advisor recognizes an Orca-qualified worktree handoff request and returns `cli-orca` as the first recommendation, ahead of any generic git skill.

### Why This Matters

Orca-managed worktrees carry Orca state that a generic git worktree workflow does not know about. If the request routes to a generic git skill, the Orca source of truth is lost, the managed worktree contract is skipped and a later command may target the wrong surface.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm that an Orca-qualified worktree handoff request routes to `cli-orca` first, ahead of any generic git skill.
- Real user request: `orca worktree handoff to another agent through the Orca CLI`
- Prompt: `orca worktree handoff to another agent through the Orca CLI`
- Expected execution process: Run the advisor entry point from the repository root and inspect the ordered JSON recommendations array.
- Expected signals: Exit status is zero, and the JSON recommendations array names `cli-orca` as the first recommendation ahead of any generic git skill.
- Desired user-visible outcome: A concise verdict that names the selected skill and states that the Orca route outranked the generic git route.
- Pass/fail: PASS if every expected signal is present. FAIL if `cli-orca` is absent, another skill ranks first, or a generic git skill outranks it. SKIP only when the advisor runtime cannot run at all, and record that blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. From the repository root, run `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "orca worktree handoff to another agent through the Orca CLI" --format json`.
2. Record the process exit status and the complete JSON recommendations array.
3. Inspect the recommendations array for the first `skillId` entry.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ORCA-001 | Advisor routes an Orca-qualified request | Prove the advisor routes an Orca-qualified worktree handoff request to cli-orca. | `orca worktree handoff to another agent through the Orca CLI` | 1. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "orca worktree handoff to another agent through the Orca CLI" --format json` -> 2. Capture exit status and the recommendations array -> 3. Inspect the first `skillId`. | Exit zero, and the recommendations array names `cli-orca` first, ahead of any generic git skill. | Command transcript, exit status and the ordered recommendations array. | PASS if all signals match. FAIL if `cli-orca` is absent, another skill ranks first, or a generic git skill outranks it. SKIP only when the advisor runtime cannot run at all. | 1. Run the entry point with `--help` to confirm the subcommand. 2. Check the advisor freshness state in the JSON. 3. Compare the prompt with the activation triggers in the [root playbook](../manual-testing-playbook.md). 4. Rerun after restoring the advisor runtime. |

### Evidence Review

Do not treat a non-empty recommendation list alone as success. `cli-orca` must be the first recommendation, and a generic git skill appearing ahead of it is a FAIL because the Orca source of truth would be skipped.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Orca-qualified vocabulary catalog entry](../../feature-catalog/routing/orca-qualified-vocabulary.md) | The routing vocabulary this prompt exercises. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-orca router contract](../../SKILL.md) | Activation triggers and routing contract. |
| [Advisor entry point](../../../system-skill-advisor/runtime/scripts/skill_advisor.py) | The advisor surface the entry point wraps. |

---

## 5. SOURCE METADATA

- Group: Routing
- Playbook ID: ORCA-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `routing/orca-positive-route.md`
- Catalog entry: `routing/orca-qualified-vocabulary.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
