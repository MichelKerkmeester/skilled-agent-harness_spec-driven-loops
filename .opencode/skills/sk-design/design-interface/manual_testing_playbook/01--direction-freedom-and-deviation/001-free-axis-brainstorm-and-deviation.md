---
title: "ID-001 -- Free-axis brainstorm critique and deliberate deviation"
description: "This scenario validates Free-axis brainstorm critique and deliberate deviation for `ID-001`. It focuses on confirming the skill brainstorms a token system, critiques it against the three AI-default clusters, and deviates deliberately."
version: 1.5.0.3
id: ID-001
expected_intent: DESIGN_PRINCIPLES
expected_resources:
  - references/design-process/design_principles.md
  - ../shared/register.md
---

# ID-001 -- Free-axis brainstorm critique and deliberate deviation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-001`.

**Exact prompt**

```
Design a landing page for an artisan letterpress studio; the brand has no fixed colors or fonts yet, so make it feel distinctive rather than generic.
```

---

## 1. OVERVIEW

This scenario validates Free-axis brainstorm critique and deliberate deviation for `ID-001`. It focuses on confirming the skill brainstorms a token system, critiques it against the three AI-default clusters, and deviates deliberately.

### Why This Matters

ID-001 is the core behavior the whole skill exists for. When the brief leaves palette, type, layout, and motion free, the skill must not spend that freedom on one of the three named AI-default looks. If it ships a templated default on a free axis, the skill has failed its single most important promise, and every downstream design task inherits that failure.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-001` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the skill grounds the subject, brainstorms a token system, critiques it against the three AI-default clusters, and deviates deliberately with a stated reason.
- Real user request: `We need a landing page for an artisan letterpress studio and it should not look generic.`
- Prompt: `Design a landing page for an artisan letterpress studio; the brand has no fixed colors or fonts yet, so make it feel distinctive rather than generic.`
- Expected execution process: Load `references/design-process/design_principles.md`, ground the subject, brainstorm a 4-6 hex token system with type and a signature, run the critique against the three default clusters, and revise free axes with a stated reason.
- Expected signals: Step 1: subject, audience, and page job named; Step 2: token system with named hex values, type roles, and a signature; Step 3: explicit critique naming the three default looks and a justified move off them
- Desired user-visible outcome: a grounded design plan whose free axes deviate deliberately from the three AI-default looks, each deviation justified against the brief.
- Pass/fail: PASS if the plan names the three default clusters and states a justified deviation per `references/design-process/design_principles.md` Section 4; FAIL if the plan ships cream-serif-terracotta, near-black-plus-acid-accent, or broadsheet-hairlines on a free axis with no stated reason

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain design-scope language.
2. Confirm the brief leaves the visual axes free before applying deviation guidance.
3. Execute the deterministic steps exactly as written.
4. Compare the produced plan against the cited `interface` reference files.
5. Return a concise final verdict that names any default-look drift when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-001 | Free-axis brainstorm critique and deliberate deviation | Confirm the skill grounds the subject, brainstorms a token system, critiques it against the three AI-default clusters, and deviates deliberately with a stated reason. | `Design a landing page for an artisan letterpress studio; the brand has no fixed colors or fonts yet, so make it feel distinctive rather than generic.` | bash: rg -n "three looks" references/design-process/design_principles.md -> agent: produce the grounded token-system plan with critique -> bash: rg -n "templated default" SKILL.md | Step 1: subject, audience, and page job named; Step 2: token system with named hex values, type roles, and a signature; Step 3: explicit critique naming the three default looks and a justified move off them | Terminal transcript, the design plan text, and the named deviation rationale | PASS if the plan names the three default clusters and states a justified deviation per references/design-process/design_principles.md Section 4; FAIL if a default look ships on a free axis with no stated reason | 1. Re-read references/design-process/design_principles.md Section 4 calibration list; 2. Confirm SKILL.md NEVER rule 1 was loaded; 3. Re-ground the subject and rerun the brainstorm-critique pass |

### Optional Supplemental Checks

If the primary run passes, repeat with a second subject from a different domain to confirm the deviation is brief-specific and not a single canned alternative. Keep supplemental evidence separate from the primary verdict.

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
| `../../SKILL.md` | Routing, phase detection, and the NEVER-ship-a-templated-default rule |
| `../../references/design-process/design_principles.md` | The two-pass brainstorm-critique process and the three AI-default clusters |

---

## 5. SOURCE METADATA

- Group: Direction Freedom And Deviation
- Playbook ID: ID-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--direction-freedom-and-deviation/free-axis-brainstorm-and-deviation.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
