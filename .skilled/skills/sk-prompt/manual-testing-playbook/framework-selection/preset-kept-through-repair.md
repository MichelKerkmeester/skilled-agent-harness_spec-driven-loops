---
title: "SP-022 -- Repair keeps the chosen preset"
description: "This scenario validates preset stability under repair for `SP-022`. It focuses on a user-named preset surviving CLEAR repair cycles, and on the change report naming any switch away from it."
version: 3.0.0.0
---

# SP-022 -- Repair keeps the chosen preset

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-022`.

---

## 1. OVERVIEW

This scenario validates that a preset the operator names is treated as a constraint rather than a suggestion. The operator asks for a compliance checklist prompt improved with TIDD-EC, and the delivered prompt still follows TIDD-EC after any repair cycle that CLEAR forces.

### Why This Matters

A named preset is the operator's own decision about shape. If repair can replace it without saying so, the delivered prompt answers a different request than the one made, and the operator has no signal that their instruction was dropped.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-022` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a user-named preset survives CLEAR repair cycles, and that any change of preset is named in the change report.
- Real user request: `Improve my compliance checklist prompt using TIDD-EC.`
- Prompt: `Improve my compliance checklist prompt using TIDD-EC; keep TIDD-EC as the shape through any repair, and report any switch away from it with the reason.`
- Expected execution process: `@prompt-improver` reads the prompt against the checklist, writes it from TIDD-EC, screens it with CLEAR, repairs the weakest dimension when the score misses 40, and keeps TIDD-EC on every repair.
- Expected signals: TIDD-EC sections present in the delivered prompt; a change report line naming TIDD-EC; either no switch statement at all, or a switch statement naming the preset that replaced it and the reason it did.
- Desired user-visible outcome: A compliance checklist prompt built from TIDD-EC, plus a change report that either confirms the preset was kept or names the preset that replaced it and why.
- Pass/fail: PASS if the named preset is kept through repair or any switch is reported; FAIL if repair silently replaces the user-named preset.

---

## 3. TEST EXECUTION

### Prompt

```
Improve my compliance checklist prompt using TIDD-EC; keep TIDD-EC as the shape through any repair, and report any switch away from it with the reason.
```

### Commands

1. `sk-prompt: Improve my compliance checklist prompt using TIDD-EC.`
2. `agent: @prompt-improver raw_task="Improve a compliance checklist prompt using TIDD-EC and hold that preset through every repair cycle." task_type=improve target_cli=opencode complexity_hint=5 constraints="Keep TIDD-EC through repair; if another preset replaces it, name the switch and its reason in the change report."`
3. `bash: rg -n 'Choosing a Preset|TIDD-EC' .skilled/skills/sk-prompt/references/patterns-evaluation.md`

### Expected

The delivered prompt carries the TIDD-EC shape and the change report names TIDD-EC. Where a repair and the named preset compete, the report states which preset won and why, so the operator can argue with the decision.

### Evidence

Capture the preset the operator named, the preset used to write each repaired draft, the CLEAR score and the repaired dimension for each repair cycle, the preset visible in the delivered prompt, and every change report line that mentions a preset.

### Pass / Fail

- **Pass**: TIDD-EC still shapes the delivered prompt after repair, or the report names the preset that replaced it and the reason for the switch.
- **Fail**: The delivered prompt follows a different preset with no mention of a switch anywhere in the report.

### Failure Triage

1. Inspect `patterns-evaluation.md` section 2 for the rule that a preset the user names outranks the default choice.
2. Inspect `improvement-checklist.md` for the repair limit, the CLEAR screen and the change report headings.
3. Re-run through `@prompt-improver` with `constraints="print the preset used for each repair cycle and the final preset"`.

### Optional Supplemental Checks

Check that a repair made inside TIDD-EC fixes the weak dimension without dropping a TIDD-EC section. Check that a reported switch names the preset that replaced the named one, rather than restating the named preset under a new label.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: `@prompt-improver` preset handling and repair rules |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/patterns-evaluation.md` | Preset catalogue and the Choosing a Preset rules in section 2 |
| `../../references/improvement-checklist.md` | Repair limit, CLEAR screen and change report headings |
| `../../ROUTER.md` | Hub routing entry that sends a prompt-improvement request to this skill |

---

## 5. SOURCE METADATA

- Group: Framework Presets
- Playbook ID: SP-022
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `framework-selection/preset-kept-through-repair.md`
