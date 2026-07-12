---
title: "ID-014 -- Brief read into the variance, motion, and density dials"
description: "This scenario validates the brief-to-dials Design Read intake for `ID-014`. It focuses on confirming a brief is read into the three working dials after the register posture is set, that the one-line Design Read states the values, and that the dials stay an internal calibration the agent sets, never a style chooser surfaced to the user."
contextType: reference
version: 1.0.0.0
id: ID-014
expected_intent: REGISTER_DIALS
expected_resources:
  - references/design_process/design_principles.md
  - ../shared/register.md
  - references/design_process/brief_to_dials.md
---

# ID-014 -- Brief read into the variance, motion, and density dials

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-014`.

**Exact prompt**

```
Read this premium cookware landing brief into the variance, motion, and density dials and state your one-line Design Read before you design.
```

---

## 1. OVERVIEW

This scenario validates the brief-to-dials Design Read intake for `ID-014`. It focuses on confirming a brief is read into the three working dials of variance, motion, and density after the register posture is set, that the one-line Design Read states the values, and that the dials stay an internal calibration the agent sets rather than a style chooser surfaced to the user.

### Why This Matters

ID-014 is the intake that gives the aesthetic direction a calibrated starting point instead of a silent middle-of-the-road default. The model tends to ignore the loudness, kinetics, and packing signals in a brief and reach for one flat center, so the Design Read forces those signals into stated values. The posture decision comes first and lives in the shared register, so this intake defers the Brand-vs-Product call and works the three dials within it. The most important guard is the negative control: the dials are the agent's internal read of the brief, never a pick-a-vibe axis or a reusable preset surfaced to the user, because the moment they become a menu the intake has become the templated default the skill exists to resist. The dials also never license a broken layout, the mechanical gate holds at every dial value.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-014` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a brief is read into the variance, motion, and density dials per `references/design_process/brief_to_dials.md` after the register posture is set, the one-line Design Read states the subject, posture, and dial values, and the dials are never surfaced to the user as a chooser or a reusable preset.
- Real user request: `Here is the brief for a premium consumer cookware landing page, read it before you start designing so the direction is not generic.`
- Prompt: `Read this premium cookware landing brief into the variance, motion, and density dials and state your one-line Design Read before you design.`
- Expected execution process: Set the register posture first from `../shared/register.md`, then load `references/design_process/brief_to_dials.md` and run the Design Read intake, capturing the subject, audience, and the page's one job, any pinned axes, and any existing system. Map the brief's own language to dial values using the inference table and the use-case presets, then state a one-line Design Read that names the subject, the posture, and the variance, motion, and density values. Confirm the dials drive downstream layout, motion, and density choices and are never surfaced to the user as choosable knobs.
- Expected signals: Step 1: the register posture is set first, then the Design Read captures the subject, audience, and the page's one job; Step 2: the brief is mapped to variance, motion, and density values stated in a one-line Design Read; Step 3: the dials are kept as an internal calibration, with no chooser or reusable preset surfaced to the user
- Desired user-visible outcome: a one-line Design Read that names the subject, the posture, and the three dial values, with the dials used as internal calibration and never offered to the user as a style menu.
- Pass/fail: PASS if the posture is set first, the brief is read into stated variance, motion, and density values in a one-line Design Read, and the dials stay internal per `references/design_process/brief_to_dials.md`; FAIL if the dials are surfaced as a chooser or pick-a-vibe axis, the posture is skipped, or a flat center is used with no read of the brief

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain intake language.
2. Confirm the register posture is set before any dial is read, since the posture gates the dial centers.
3. Execute the deterministic steps exactly as written, mapping the brief's own language to values.
4. Compare the produced Design Read against the inference table and the use-case presets in `brief_to_dials.md`.
5. Return a concise final verdict that names any surfaced chooser or any skipped posture when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-014 | Brief read into the variance, motion, and density dials | Confirm a brief is read into the variance, motion, and density dials per references/design_process/brief_to_dials.md after the register posture is set, the one-line Design Read states the subject, posture, and dial values, and the dials are never surfaced to the user as a chooser or a reusable preset. | `Read this premium cookware landing brief into the variance, motion, and density dials and state your one-line Design Read before you design.` | bash: rg -n "intake, not a chooser" references/design_process/brief_to_dials.md -> agent: set the register posture, run the Design Read, and state the one-line read with the three dial values -> bash: rg -n "brief_to_dials" SKILL.md | Step 1: the register posture is set first, then the Design Read captures the subject, audience, and the page's one job; Step 2: the brief is mapped to variance, motion, and density values stated in a one-line Design Read; Step 3: the dials are kept as an internal calibration, with no chooser or reusable preset surfaced to the user | Terminal transcript, the one-line Design Read with the three dial values, and confirmation that no chooser or preset was surfaced | PASS if the posture is set first, the brief is read into stated variance, motion, and density values in a one-line Design Read, and the dials stay internal per references/design_process/brief_to_dials.md; FAIL if the dials are surfaced as a chooser or pick-a-vibe axis, the posture is skipped, or a flat center is used with no read of the brief | 1. Re-read references/design_process/brief_to_dials.md Sections 2 through 6; 2. Confirm ../shared/register.md set the posture before the dials were read; 3. Re-run the Design Read, mapping the brief language to values and stating the one-line read |

### Optional Supplemental Checks

If the primary run passes, repeat with a genuinely ambiguous brief and confirm the intake asks one focused question rather than averaging across a wide gap, and repeat with a redesign brief to confirm the dials read from the existing feel rather than a fixed center. Confirm a contradictory signal such as a playful public-sector brief is resolved with one question rather than flattened to a middle value. Keep supplemental evidence separate from the primary verdict.

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
| `../../references/design_process/brief_to_dials.md` | The Design Read intake: the three dials, the inference table, the use-case presets, and the no-chooser guard |
| `../../shared/register.md` | The Brand-vs-Product posture set first, which gates the dial centers |
| `../../SKILL.md` | Section 2 loads the intake at the first step of any design task, and Section 5 lists it as a core reference |

---

## 5. SOURCE METADATA

- Group: Brief-To-Dials Intake
- Playbook ID: ID-014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `brief-to-dials-intake/brief-read-into-dials.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
