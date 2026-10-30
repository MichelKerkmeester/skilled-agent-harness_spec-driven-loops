---
title: "SP-021 -- An applied preset is named with its reason"
description: "This scenario validates that skill behavior names the structure it used. It focuses on reporting a preset application, and the reason it fits, in the change report."
version: 3.0.0.0
---

# SP-021 -- An applied preset is named with its reason

This document captures the realistic user test, the expected signals, the execution steps, the source anchors and the metadata for `SP-021`.

---

## 1. OVERVIEW

sk-prompt starts every prompt from one default skeleton. The seven framework names are optional presets: RACE, RCAF, COSTAR, CIDI, CRISPE, TIDD-EC and CRAFT. A preset is applied when the user names it, or when its fit is clear from the task. When one is applied, the change report names it and gives the reason. This scenario tests the reporting half of that rule.

The operator asks for a product-launch announcement aimed at a non-technical audience. That task can be served by the skeleton, or by a preset that adds audience and tone. Either answer passes, as long as the answer says which one it used and why.

### Why This Matters

A preset that shapes a prompt in silence leaves the operator unable to tell a chosen structure from an inherited one. The wording looks deliberate but cannot be argued with, and the next edit has no stated basis to preserve or discard.

Naming the structure with a one-line reason turns a hidden decision into a reviewable one. It also bounds the choice: the reason has to be about this task, so a preset cannot be applied because it is a favorite.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-021` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that when a preset is applied, the change report names it and the reason it fits.
- Real user request: `Improve my product-launch announcement prompt for a non-technical audience.`
- Prompt: `Improve my product-launch announcement prompt for a non-technical audience; state whether the default skeleton or a named preset shaped it, and give the reason for that choice.`
- Expected execution process: `@prompt-improver` checks the prompt once against the ten rows, writes the draft from the default skeleton or from one applied preset, then delivers the prompt with the change report.
- Expected signals: a `Skeleton: default` line, or a preset line such as `Preset: COSTAR` followed by a reason like "adds style, tone and audience".
- Desired user-visible outcome: an improved announcement prompt, followed by a change report that names the structure used and why it fits.
- Pass/fail: PASS if the skeleton or the preset choice is stated with a reason; FAIL if a preset shapes the prompt but is not named.

---

## 3. TEST EXECUTION

### Prompt

```
Improve my product-launch announcement prompt for a non-technical audience; state whether the default skeleton or a named preset shaped it, and give the reason for that choice.
```

### Commands

1. `sk-prompt: Improve my product-launch announcement prompt for a non-technical audience.`
2. `agent: @prompt-improver raw_task="Improve a product-launch announcement prompt for a non-technical audience." task_type=generation target_cli=opencode complexity_hint=5 constraints="State whether the default skeleton or a named preset shaped the prompt, and give one line on why that choice fits the task."`
3. `bash: rg -n "Choosing a Preset|name it in the change report" .skilled/skills/sk-prompt/references/patterns-evaluation.md`

### Expected

The prompt arrives first, then the change report. The report carries a structure line naming the default skeleton or one preset, and a reason tied to this task: an announcement for readers who do not work in the product area. A preset name with no reason is not enough, and neither is a reason with no name.

### Evidence

Capture the delivered prompt, the structure line, the reason given, and the four change report headings. Note whether the reason refers to audience, tone, or another element the task actually needs.

### Pass / Fail

- **Pass**: The default skeleton or the applied preset is named, and the reason is stated in one line.
- **Fail**: A preset changes the prompt's shape while the report names no preset, or names one with no reason.

### Failure Triage

1. Confirm `patterns-evaluation.md` section 2, `Choosing a Preset`, carries the rule that an applied preset is named in the change report.
2. Read the report for a structure line. A bare list of Added and Changed rows with no statement of what shaped the prompt is the common miss.
3. Re-dispatch with `constraints="name the default skeleton or the applied preset, and give the reason in one line"`.

### Optional Supplemental Checks

Confirm no preset was scored against another to justify the pick. A preset is a shape, not a quality gate, so a comparison table in the report is a sign the rule was read as an evaluation.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Source of the delivered skeleton and the change report headings |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/improvement-checklist.md` | One-pass checklist, effort levels, and the delivery and change report rules |
| `../../references/patterns-evaluation.md` | Default skeleton and presets; section 2 `Choosing a Preset` holds the naming rule |
| `../../ROUTER.md` | Mode table deciding which command shape this scenario exercises |
| `../../SKILL.md` | Skill entry point: routing surface and delivery order |

---

## 5. SOURCE METADATA

- Group: Framework Presets
- Playbook ID: SP-021
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `framework-selection/preset-named-in-change-report.md`
