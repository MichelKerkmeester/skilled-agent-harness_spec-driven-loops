---
title: "SP-019 -- Default skeleton unless a preset clearly fits"
description: "This scenario validates that an ordinary prompt request is improved from the default component skeleton with no preset applied, and that one of the seven optional presets is named only when its fit is clear."
version: 3.0.0.0
---

# SP-019 -- Default skeleton unless a preset clearly fits

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-019`.

---

## 1. OVERVIEW

An operator asks for a quick project status update prompt to be improved. The improved prompt should come from the default component skeleton: task and outcome, context, constraints, output format, and the other rows of the ten-row checklist. No preset should be scored, ordered or named, because a preset is a named shape a caller opts into when a request clearly matches it, not a shape to be chosen for every request.

### Why This Matters

Scoring presets on every request turns one pass over a prompt into a comparison exercise. RACE, RCAF, COSTAR, CIDI, CRISPE, TIDD-EC and CRAFT are optional starting shapes. When the tool weighs each one to pick a winner, the work grows, the operator reads framework names instead of the prompt, and a plain request receives a shape it never needed. The default skeleton already covers ordinary requests, so the correct behavior is to use it and say that it was used.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-019` and confirm the expected signals without contradictory evidence.

- Objective: Confirm an ordinary request is built from the default skeleton with no preset, and that a preset is applied only when its fit is clear.
- Real user request: `Improve my prompt for a quick project status update.`
- Prompt: `Improve my prompt for a quick project status update.`
- Expected execution process: `@prompt-improver` reads the request against the ten-row checklist, writes the prompt once from the default skeleton, self-checks it against its own success criteria, and delivers it with a change report.
- Expected signals: The delivered prompt follows the default skeleton; the report states that the default skeleton was used; no preset is scored and no preset name appears.
- Desired user-visible outcome: An improved prompt, a one-line note naming the default skeleton, and Added / Changed / Removed / Skipped.
- Pass/fail: PASS if the default skeleton is used and no preset is forced; FAIL if a preset is applied without being named or clearly fitting, or if every preset is scored to pick one.

---

## 3. TEST EXECUTION

### Prompt

```
Improve my prompt for a quick project status update.
```

### Commands

1. `sk-prompt: Improve my prompt for a quick project status update.`
2. `agent: @prompt-improver raw_task="Improve a prompt for a quick project status update." task_type=generation target_cli=opencode effort=standard constraints="Write the prompt from the default component skeleton. Do not score, order or name a preset; name one only if its fit is clear."`
3. `bash: rg -n 'Choosing a Preset' .skilled/skills/sk-prompt/references/patterns-evaluation.md`

### Expected

The delivered prompt carries the default skeleton components the request needs, the note states that the default skeleton was used, and no preset is scored or named.

### Evidence

Capture the delivered prompt, the skeleton note, the change report, and the absence of any preset name or preset comparison.

### Pass / Fail

- **Pass**: Default skeleton used, skeleton stated, no preset scored or named.
- **Fail**: A preset is applied without being named or without a clear fit, or every preset is scored to pick one.

### Failure Triage

1. Inspect the delivered prompt against the ten-row checklist and note which rows are present.
2. Inspect `references/patterns-evaluation.md` section 2, Choosing a Preset, for the rule that guards preset use.
3. Re-run through `@prompt-improver` with `constraints="Use the default skeleton; name a preset only if its fit is clear."`

### Optional Supplemental Checks

Run a request that clearly matches one preset and confirm that the preset is named once, with the reason for the fit.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: default component skeleton and the `@prompt-improver` dispatch contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/improvement-checklist.md` | Ten-row checklist, early exit, effort levels, self-check and change report |
| `../../references/patterns-evaluation.md` | Preset library plus section 2, the rule for when a preset is chosen |
| `../../ROUTER.md` | Mode routing that sends a request down the improvement path |
| `../../SKILL.md` | Default component skeleton and the contract the agent runs under |

---

## 5. SOURCE METADATA

- Group: Framework Presets
- Playbook ID: SP-019
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `framework-selection/default-skeleton-unless-preset-fits.md`
