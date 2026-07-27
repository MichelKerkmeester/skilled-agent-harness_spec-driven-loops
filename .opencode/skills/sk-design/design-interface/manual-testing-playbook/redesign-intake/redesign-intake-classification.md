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

# ID-015 -- Redesign Intake Classification

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-015`.

**Exact prompt**

```text
Redesign this account settings page, but do not surprise returning users. Classify the redesign lane before you change the UI.
```

---

## 1. OVERVIEW

This scenario validates `design-interface/SKILL.md` redesign intake: classifying the work as greenfield, preserve, or overhaul before any visual change, and naming every approval-gated item that must not change silently.

### Why This Matters

A redesign that changes URLs, nav labels, form fields, legal copy, or locked tokens without approval breaks returning users, muscle memory, and sometimes compliance. Classifying the lane first is what separates a redesign from an unannounced migration.

---

## 2. SCENARIO CONTRACT

- Objective: confirm the agent classifies the redesign as greenfield, preserve or overhaul before changing visuals.
- Real user request: `We want to redesign the account settings page, but returning users shouldn't feel lost. Work out what we're allowed to change first.`
- Prompt: `Redesign this account settings page, but do not surprise returning users. Classify the redesign lane before you change the UI.`
- Expected execution process: load `references/design-process/redesign-intake.md`, state the redesign lane, list never-silently-change constraints and ask one focused question when preserve versus overhaul is unclear.
- Expected signals: URLs, nav labels, form fields, legal copy and locked tokens are named as approval-gated when present.
- Desired user-visible outcome: a compact redesign intake that protects existing contracts before any design direction.
- Pass/fail: PASS if the lane and approval-gated items are explicit. FAIL if the agent silently changes URLs, nav labels, form fields, legal copy or locked tokens.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Load `references/design-process/redesign-intake.md` and set the register from `../shared/register.md`.
2. Classify the request into exactly one lane: greenfield, preserve, or overhaul.
3. List the never-silently-change constraints present on the surface: URLs, nav labels, form fields, legal copy, and locked tokens.
4. Ask one focused question when preserve versus overhaul is genuinely unclear, rather than assuming the wider lane.
5. Return the intake before proposing any visual direction.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-015 | Redesign intake classification | Confirm the redesign lane and approval-gated items are stated before any visual change | `Redesign this account settings page, but do not surprise returning users. Classify the redesign lane before you change the UI.` | bash: rg -n "greenfield" ../../references/design-process/redesign-intake.md -> bash: rg -n "register" ../../../shared/register.md -> agent: return the redesign intake before any visual direction | Step 1: the three redesign lanes found; Step 2: register posture found; Step 3: output names exactly one lane and lists the approval-gated items | Record the prompt, returned lane, preserve list, approval-needed list and any question asked | PASS if the lane and approval-gated items are explicit; FAIL if the agent silently changes URLs, nav labels, form fields, legal copy or locked tokens | 1. Re-read `../../references/design-process/redesign-intake.md` for the lane definitions and the never-silently-change list; 2. Confirm exactly one lane was chosen; 3. Re-run on a surface carrying legal copy and confirm it is flagged approval-gated |

### Evidence

Record the prompt, returned lane, preserve list, approval-needed list and any question asked.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/design-process/redesign-intake.md` | Redesign lane and never-silently-change gate |
| `../../references/design-process/design-principles.md` | Design principles governing the redesign direction |
| `../../SKILL.md` | Router and resource map |
| `../../../shared/register.md` | Register posture set before the redesign direction |

---

## 5. SOURCE METADATA

- Group: Redesign Intake
- Playbook ID: ID-015
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `redesign-intake/redesign-intake-classification.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
