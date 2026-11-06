---
title: "SKD-001 -- An integration request routes to system-skilled-doctor"
description: "This scenario validates that a request to put Skilled into a project ranks system-skilled-doctor first in the skill advisor."
catalog_applicable: false
version: 1.0.0.0
---

# SKD-001 -- An integration request routes to system-skilled-doctor

This file is the canonical operator contract for routing a Skilled integration request to this skill.

---

## 1. OVERVIEW

This scenario verifies that the advisor ranks `system-skilled-doctor` first for a request to put Skilled into a project.

### Why This Matters

Before this skill existed, the same request was credited to `system-spec-kit`, a spec-folder skill whose purpose does not cover installing Skilled.

---

## 2. SCENARIO CONTRACT

- Objective: Prove an integration request ranks this skill first.
- Real user request: `put Skilled into my project repo`
- Prompt: `put Skilled into my project repo`
- Expected execution process: Run the advisor once on the prompt and read the first recommendation.
- Expected signals: The command exits zero and its first recommendation names `system-skilled-doctor`.
- Desired user-visible outcome: The operator is pointed at the doctor commands that install Skilled.
- Pass/fail: PASS if the first recommendation is `system-skilled-doctor`. FAIL if another skill ranks first or the list is empty. SKIP when the advisor cannot start, with its error named as the blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Run `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"put Skilled into my project repo"}' --format json`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-001 | Integration request routing | Prove an integration request ranks this skill first. | `put Skilled into my project repo` | 1. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"put Skilled into my project repo"}' --format json` | Exit zero, and the first recommendation names `system-skilled-doctor`. | The JSON output and its exit status. | PASS if `system-skilled-doctor` ranks first. FAIL if another skill ranks first or the list is empty. SKIP when the advisor cannot start, with its error named. | 1. Run `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted` and retry once. 2. Check the skill's `graph-metadata.json` intent signals. 3. Escalate with the JSON output. |

### Evidence Review

The first recommendation is the load-bearing signal. A lower rank for this skill is a FAIL even when it appears in the list.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Package policy and scenario index. |
| [Skill contract](../../SKILL.md) | Names the owned commands and the activation triggers. |
| [Graph metadata](../../graph-metadata.json) | Holds the intent signals the advisor scores. |

---

## 5. SOURCE METADATA

- Group: Routing
- Playbook ID: SKD-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `routing/integration-request-routing.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
