---
title: Restraint Gate Scenario
description: Manual scenario verifying the frequency gate, the keyboard rule, the purpose test and register coupling run before any timing choice.
trigger_phrases:
  - "test restraint gate"
  - "should this animate scenario"
  - "animation decision test"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: MOTION_DECISION
expected_resources:
  - references/motion/corpus-map.md
  - ../shared/register.md
  - references/motion/animation-decision-framework.md
---

# MOTION-DECISION-001 | Restraint Gate

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MOTION-DECISION-001`.

**Exact prompt**

```text
We want to add animation everywhere in our dashboard, including the command palette and every hover. Make it feel polished.
```

---

## 1. OVERVIEW

This scenario validates the restraint gate: frequency, then input, then purpose, then register — run in order and stopped at the first no, before any timing choice is made. It is the negative control against "animate everything to feel polished."

### Why This Matters

Motion added everywhere makes an interface slower, not more polished — command palettes and high-frequency hovers are where it hurts most. Running the gate in order and stopping at the first no is what keeps a "make it feel premium" request from degrading the product surface.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm an animate-everything request is met with the restraint gate run in order, refusing motion on keyboard-driven and high-frequency paths, and confirmed against the Product motion-budget dial.
- Real user request: `We want the dashboard to feel more polished — can we add animation everywhere, including the command palette and all the hovers?`
- Prompt: `We want to add animation everywhere in our dashboard, including the command palette and every hover. Make it feel polished.`
- Expected execution process: Route to `interface` (the temporal/motion task lane); load `../../../shared/register.md` for the motion-budget dial and `../../references/motion/animation-decision-framework.md` for the restraint gate; run the gate in order and stop at the first no — frequency, then input, then purpose, then register; treat the unlabeled internal dashboard as a Product surface and trim by default.
- Expected signals: The gate is run in the stated order and stops at the first no; the command palette and keyboard-driven actions keep instant open and close; high-frequency hovers lose movement in favor of a near-instant color or background change; each surviving interaction carries one named purpose; the choice is confirmed against the Product dial.
- Desired user-visible outcome: A dashboard that feels polished because motion was removed from the paths where it costs speed, not added uniformly.
- Pass/fail: PASS if the gate runs in order, keyboard and high-frequency paths keep motion off, surviving motion has one named purpose, and the Product dial is honored; FAIL if motion is granted on the command palette or keyboard actions, high-frequency hovers keep movement, "looks cool" is accepted outside the rare or first-time tier, or a Brand entrance is granted on a Product surface.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Route to `interface` (the temporal/motion task lane).
2. Load `../shared/register.md` for the motion-budget dial and `references/motion/animation-decision-framework.md` for the restraint gate.
3. Run the gate in order and stop at the first no: frequency, then input, then purpose, then register.
4. Treat the unlabeled internal dashboard as a Product surface and trim by default.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MOTION-DECISION-001 | Restraint gate | Confirm the frequency, input, purpose, and register gate runs in order and refuses motion on keyboard and high-frequency paths | `We want to add animation everywhere in our dashboard, including the command palette and every hover. Make it feel polished.` | bash: rg -n "frequency" ../../references/motion/animation-decision-framework.md -> bash: rg -n "register" ../../../shared/register.md -> agent: run the restraint gate over the request | Step 1: the four gate stages found in order; Step 2: Product motion-budget dial found; Step 3: output stops at the first no and refuses command-palette and high-frequency motion | Terminal transcript, the gate walk with the stage that returned no, the surviving motion list with purposes, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any bullet is contradicted, most critically motion granted on the command palette or a Brand entrance on a Product surface | 1. Re-read `../../references/motion/animation-decision-framework.md` for the gate order; 2. Confirm the surface was classified Product rather than Brand; 3. Re-run and confirm each surviving interaction names exactly one purpose |

### Pass Criteria

- Refuses motion on the command palette and any keyboard-driven action, keeping open and close instant.
- Removes or hard-reduces motion on high-frequency hovers, dropping movement for a near-instant color or background change.
- Names one purpose for any interaction that keeps motion and rejects looks-cool outside the rare or first-time tier.
- Confirms the choice against the Product motion-budget dial rather than granting a Brand entrance.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and motion resource map |
| `../../references/motion/corpus-map.md` | Motion corpus entry point |
| `../../references/motion/animation-decision-framework.md` | The restraint gate: frequency, input, purpose, register |
| `../../../shared/register.md` | Register posture and the Product motion-budget dial |

---

## 5. SOURCE METADATA

- Group: Decision
- Playbook ID: MOTION-DECISION-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `decision/restraint-gate.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
