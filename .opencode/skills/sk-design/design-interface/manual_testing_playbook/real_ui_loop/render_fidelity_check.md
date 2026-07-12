---
title: "ID-009 -- Render fidelity check gated on the quality floor and anti-default critique"
description: "This scenario validates the render fidelity check for `ID-009`. It focuses on confirming the dev-server build's render is judged against the quality floor and the anti-default critique, never claimed from a build that did not actually render."
version: 1.5.0.1
id: ID-009
expected_intent: REAL_UI_LOOP
expected_resources:
  - references/design_process/design_principles.md
  - ../shared/register.md
  - references/design_process/real_ui_loop.md
  - ../shared/sk_code_handoff.md
---

# ID-009 -- Render fidelity check gated on the quality floor and anti-default critique

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-009`.

**Exact prompt**

```
Verify the built UI actually rendered a design that matches the intent, and tell me if it clears our quality bar.
```

---

## 1. OVERVIEW

This scenario validates the render fidelity check for `ID-009`. It focuses on confirming the dev-server build's render is judged against the quality floor and the anti-default critique, never claimed from a build that did not actually render.

### Why This Matters

ID-009 closes the gap between "compiles and is responsive" and "matches intent". The real-UI loop checks the real render: for a dev-server UI the agent controls, an `mcp-chrome-devtools` screenshot of the running build captures what was actually produced, local-first and needing no remote sign-in. The bar is the union of two gates: the render must clear the `ux_quality_reference.md` floor and survive the `design_principles.md` anti-default critique. Two failure modes make this scenario load-bearing. Claiming a finished design from a build that never rendered, or from a file write that produced no visible UI, is wrong, so it is the negative control here. And "looks roughly like the brief" is a weaker bar than the skill already enforces, so a screenshot alone can never claim completion.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-009` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the fidelity check inspects the dev-server build's render and judges it against the quality floor and the anti-default critique, never claiming a design from a build that did not actually render.
- Real user request: `Check whether the built UI actually matches the design intent before we hand it off.`
- Prompt: `Verify the built UI actually rendered a design that matches the intent, and tell me if it clears our quality bar.`
- Expected execution process: Use a dev-server build of the UI under review (for example one produced by a prior ID-008 build). Follow `references/design_process/real_ui_loop.md` Section 5, confirm the build actually renders rather than failing to load, capture an `mcp-chrome-devtools` screenshot of the running build, and judge the render against the `ux_quality_reference.md` floor and the anti-default critique.
- Expected signals: Step 1: the build is confirmed to actually render, not failing to load with no visible UI; Step 2: an `mcp-chrome-devtools` screenshot of the running build is captured; Step 3: the verdict cites both the quality floor and the anti-default critique, not "looks roughly like the brief"
- Desired user-visible outcome: a fidelity verdict over the real render that names the quality-floor result and the anti-default result, with no pixel-diff claim and no design claimed from a build that never rendered.
- Pass/fail: PASS if the verdict judges the dev-server build's render against both gates per `references/design_process/real_ui_loop.md` Section 5; FAIL if completion is claimed from a build that never rendered, from a file write with no visible UI, or from a screenshot alone

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain match-intent language.
2. Confirm the build actually renders so a real render exists to judge.
3. Execute the deterministic steps exactly as written, including the negative control.
4. Compare the produced verdict against `references/design_process/real_ui_loop.md` Section 5 and the two cited gates.
5. Return a concise final verdict that flags any pixel-diff claim or any design claimed from a build that never rendered when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-009 | Render fidelity check gated on the quality floor and anti-default critique | Confirm the fidelity check inspects the dev-server build's render and judges it against the quality floor and the anti-default critique, never claiming a design from a build that did not actually render. | `Verify the built UI actually rendered a design that matches the intent, and tell me if it clears our quality bar.` | bash: rg -n "Mechanism depends on the build surface" references/design_process/real_ui_loop.md -> agent: confirm the dev-server build actually renders rather than failing to load, then capture an mcp-chrome-devtools screenshot of the running build -> agent: judge the render against ux_quality_reference.md and the anti-default critique | Step 1: the build is confirmed to actually render, not failing to load with no visible UI; Step 2: an mcp-chrome-devtools screenshot of the running build is captured; Step 3: the verdict cites both the quality floor and the anti-default critique, not "looks roughly like the brief" | Terminal transcript, the captured screenshot reference, and the two-gate verdict | PASS if the verdict judges the dev-server build's render against both gates per references/design_process/real_ui_loop.md Section 5; FAIL if completion is claimed from a build that never rendered, from a file write with no visible UI, or from a screenshot alone | 1. Re-read references/design_process/real_ui_loop.md Section 5 on the fidelity mechanism and the pass/fail bar; 2. Confirm the build actually rendered before judging; 3. Confirm the verdict cites both ux_quality_reference.md and the design_principles.md anti-default critique |

### Optional Supplemental Checks

If the build fails to load with no visible UI, confirm the protocol's self-heal path: fix the build until it renders, re-capture the screenshot, then re-judge, and keep retries capped at two per Section 5. Keep supplemental evidence separate from the primary verdict. This scenario records SKIP with the missing path if `mcp-chrome-devtools` does not resolve.

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
| `../../references/design_process/real_ui_loop.md` | Section 5 fidelity check: the render mechanism, the two-gate bar, and the no-screenshot-alone caveat |
| `../../references/design_process/ux_quality_reference.md` | The objective quality floor the render must clear |

---

## 5. SOURCE METADATA

- Group: Real-UI Loop
- Playbook ID: ID-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `real-ui-loop/render-fidelity-check.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
