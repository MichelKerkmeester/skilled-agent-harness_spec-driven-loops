---
title: Redesign Intake Classification Scenario
description: Manual scenario verifying greenfield, preserve and overhaul classification before redesign work changes an existing interface.
contextType: reference
version: 1.0.0.0
id: ID-015
expected_intent: REDESIGN_INTAKE
expected_resources:
  - references/design-process/design-principles.md
  - ../shared/register.md
  - references/design-process/redesign-intake.md
---

**Exact prompt**

```
Redesign this account settings page, but do not surprise returning users. Classify the redesign lane before you change the UI.
```

# ID-015 -- Redesign Intake Classification

## Scenario Contract

- Objective: confirm the agent classifies the redesign as greenfield, preserve or overhaul before changing visuals.
- Expected execution process: load `references/design-process/redesign-intake.md`, state the redesign lane, list never-silently-change constraints and ask one focused question when preserve versus overhaul is unclear.
- Expected signals: URLs, nav labels, form fields, legal copy and locked tokens are named as approval-gated when present.
- Desired user-visible outcome: a compact redesign intake that protects existing contracts before any design direction.
- Pass/fail: PASS if the lane and approval-gated items are explicit. FAIL if the agent silently changes URLs, nav labels, form fields, legal copy or locked tokens.

## Evidence

Record the prompt, returned lane, preserve list, approval-needed list and any question asked.

## Source Files

| File | Role |
| --- | --- |
| `../../references/design-process/redesign-intake.md` | Redesign lane and never-silently-change gate |
| `../../SKILL.md` | Router and resource map |
