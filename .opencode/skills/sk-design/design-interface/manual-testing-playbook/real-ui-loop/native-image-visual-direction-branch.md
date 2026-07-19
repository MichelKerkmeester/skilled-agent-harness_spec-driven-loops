---
title: "ID-017 -- Guarded native-image visual-direction branch"
description: "This scenario validates the guarded native-image visual-direction branch for `ID-017`. It focuses on confirming net-new, ambiguous, or image-led work can branch into brief-specific visual directions only when native image generation is available, with palette confirmation, 1-3 mock directions, critique, approval before code, and no reusable preset menu."
version: 1.0.0.0
id: ID-017
expected_intent: REAL_UI_LOOP
expected_resources:
  - references/design-process/design-principles.md
  - ../shared/register.md
  - references/design-process/real-ui-loop.md
---

# ID-017 -- Guarded native-image visual-direction branch

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-017`.

**Exact prompt**

```
This is a net-new image-led landing page. Use native image generation to explore the visual direction before writing code.
```

---

## 1. OVERVIEW

This scenario validates the guarded native-image visual-direction branch for `ID-017`. It focuses on confirming that the real-UI loop may use native image generation only when the work is net-new, ambiguous, or image-led, the target is mid-fidelity or higher, and image generation is available. The branch confirms the palette first, produces 1-3 brief-specific mock directions, critiques each against AI-default looks, gets approval before code, and inventories the approved ingredients before implementation continues.

### Why This Matters

ID-017 prevents two opposite failures. Without the branch, an image-led surface can jump straight into code while the visual direction is still guesswork. With an unguarded branch, the skill can degrade into a preset gallery or image generator. The contract keeps image generation as a direction-setting tool for the narrow cases where it earns its cost, and the approval gate prevents unapproved mock output from silently becoming implementation.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-017` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the native-image visual-direction branch runs only under guarded conditions, confirms palette before generation, produces 1-3 brief-specific mock directions, critiques them, gets approval before code, and then inventories the approved ingredients.
- Real user request: `This project is image-led and the look is not pinned yet; explore a few visual directions before implementing.`
- Prompt: `This is a net-new image-led landing page. Use native image generation to explore the visual direction before writing code.`
- Expected execution process: Load `references/design-process/real-ui-loop.md`. Confirm the work is net-new, ambiguous, or image-led; target fidelity is mid-fidelity or higher; and native image generation is available. Ask the Step-A direction questions, confirm a 4-6 value palette before generation, produce 1-3 brief-specific mock directions with layout, typography, palette, image role, and one signature move, critique each against AI-default looks, get approval before code, and inventory the approved palette, type choices, layout grammar, image assets, reusable components or tokens, motion budget, and open risks.
- Expected signals: Step 1: the guarded conditions are explicitly checked before generation; Step 2: palette is confirmed before mock directions; Step 3: 1-3 mock directions are brief-specific and critiqued; Step 4: implementation waits for approval; Step 5: approved ingredients are inventoried before code.
- Desired user-visible outcome: a compact visual-direction packet with guarded-condition proof, palette, 1-3 mock directions, critique, approval request, and no implementation started from an unapproved image direction.
- Pass/fail: PASS if the branch runs only under the guarded conditions in `references/design-process/real-ui-loop.md`, confirms palette before generation, gets approval before code, and never offers reusable styles or a preset gallery; FAIL if image generation runs for pinned or low-fidelity work, if code starts before approval, or if the directions are reusable palettes rather than subject-grounded mock directions.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the request in plain visual-direction language.
2. Confirm the guarded conditions and record SKIP if native image generation is unavailable.
3. Execute the deterministic steps exactly as written, including the approval-before-code negative control.
4. Compare the produced output against `references/design-process/real-ui-loop.md` Section 2A.
5. Return a concise final verdict that flags any unguarded generation, preset menu, or pre-approval implementation.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-017 | Guarded native-image visual-direction branch | Confirm the native-image branch runs only for net-new, ambiguous, or image-led mid-fidelity work when image generation is available, then confirms palette, creates 1-3 mock directions, critiques them, and waits for approval before code | `This is a net-new image-led landing page. Use native image generation to explore the visual direction before writing code.` | bash: rg -n "Native-Image Visual-Direction Branch" references/design-process/real-ui-loop.md -> agent: check guarded conditions and palette -> agent: produce 1-3 brief-specific mock directions with critique -> agent: request approval before code and inventory approved ingredients only after approval | Step 1: guarded conditions are checked before generation. Step 2: palette is confirmed in 4-6 values before generation. Step 3: 1-3 directions are brief-specific and include layout, typography, palette, image role, and one signature move. Step 4: approval is requested before code. Step 5: no style-preset or reusable palette menu is offered | Terminal transcript, guarded-condition proof, palette, generated or image-led direction notes, critique text, approval request, and ingredient inventory when approved | PASS if the branch is guarded, palette precedes generation, directions are subject-grounded, approval blocks code, and no preset menu appears; FAIL if generation runs when pinned, low-fidelity, or unavailable; if implementation starts before approval; or if the directions are reusable style presets | 1. Re-read references/design-process/real-ui-loop.md Section 2A. 2. Confirm image generation availability and target fidelity. 3. Re-run with the guarded-condition check first. 4. If work is pinned, low-fidelity, or image generation is unavailable, record SKIP or use the optional direction gate without native-image mocks |

### Optional Supplemental Checks

Run a negative-control prompt where the brief pins the palette and type, or where the target is a low-fidelity wireframe. Confirm the branch does not generate mock directions and instead uses the normal real-UI loop or optional direction gate. Keep supplemental evidence separate from the primary verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../references/design-process/real-ui-loop.md` | Section 2A guarded native-image visual-direction branch |
| `../../references/design-process/design-principles.md` | The anti-default critique used to judge each direction |

---

## 5. SOURCE METADATA

- Group: Real-UI Loop
- Playbook ID: ID-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `real-ui-loop/native-image-visual-direction-branch.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
