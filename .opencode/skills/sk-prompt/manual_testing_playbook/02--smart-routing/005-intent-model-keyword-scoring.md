---
title: "SP-005 -- INTENT_MODEL keyword scoring routes between TEXT_ENHANCE and FRAMEWORK"
description: "This scenario validates INTENT_MODEL routing for `SP-005`. It focuses on confirming weighted keyword scoring picks TEXT_ENHANCE for improve-heavy input and FRAMEWORK for framework-named input."
---

# SP-005 -- INTENT_MODEL keyword scoring routes between TEXT_ENHANCE and FRAMEWORK

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-005`.

---

## 1. OVERVIEW

This scenario validates INTENT_MODEL routing for `SP-005`. It focuses on confirming the smart router scores keywords with weights, picks TEXT_ENHANCE when "improve / enhance / refine" dominate, picks FRAMEWORK when "rcaf / costar / tidd-ec / scoring" dominate, and preserves that routing before any `@prompt-improver` handoff.

### Why This Matters

Without correct intent scoring, the wrong RESOURCE_MAP loads and the operator either gets framework deep-dives for a simple polish request, or no framework guidance for an explicit framework ask. Keyword scoring is the primary fallback when no `$` prefix is present.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-005` and confirm the expected signals without contradictory evidence.

- Objective: Confirm INTENT_MODEL scoring routes correctly between TEXT_ENHANCE and FRAMEWORK
- Real user request (input A): `Please improve and refine this prompt for a customer-support email — enhance the tone.`
- Real user request (input B): `Which framework should I apply here? COSTAR or TIDD-EC? Score both and tell me.`
- Prompt: `Score these two sk-prompt inputs through INTENT_MODEL; verify TEXT_ENHANCE and FRAMEWORK routing load the expected resources.`
- Expected execution process: sk-prompt scores each input against INTENT_MODEL keyword weights (improve=4, enhance=4, prompt=3, text=3, refine=4 for TEXT_ENHANCE; framework=4, rcaf=5, costar=5, tidd-ec=5, scoring=3 for FRAMEWORK), selects the top-scoring intent, loads the matching RESOURCE_MAP entry.
- Expected signals: Input A intent = TEXT_ENHANCE, input B intent = FRAMEWORK; resource lists match RESOURCE_MAP
- Desired user-visible outcome: Two routing traces, one per input, naming the picked intent and the loaded resource list.
- Pass/fail: PASS if both inputs resolve to the expected intent and the resource lists match RESOURCE_MAP; FAIL if either intent is wrong or extra resources load above tolerance.

---

## 3. TEST EXECUTION

### Prompt

```
Score these two sk-prompt inputs through INTENT_MODEL; verify TEXT_ENHANCE and FRAMEWORK routing load the expected resources.
```

### Commands

1. `sk-prompt: Please improve and refine this prompt for a customer-support email — enhance the tone.`
2. `sk-prompt: Which framework should I apply here? COSTAR or TIDD-EC? Score both and tell me.`
3. `bash: rg -A 12 'INTENT_MODEL' .opencode/skills/sk-prompt/SKILL.md` (verify keyword weights still match)

### Expected

Input A: intent = TEXT_ENHANCE, resources include `references/depth_framework.md` + `references/patterns_evaluation.md`. Input B: intent = FRAMEWORK, resources include `references/patterns_evaluation.md`.

### Evidence

Routing trace per input. Capture intent name + resource list per call.

### Pass / Fail

- **Pass**: Both intents picked correctly with matching resource lists.
- **Fail**: Wrong intent on either input, or resource list does not match RESOURCE_MAP.

### Failure Triage

1. Inspect SKILL.md §2 INTENT_MODEL keyword weights; compare to the per-input scoring trace.
2. Re-dispatch each input with the keyword density doubled, see if scoring changes.
3. Confirm RESOURCE_MAP entries still resolve on disk (`bash: ls .opencode/skills/sk-prompt/references/`).

### Optional Supplemental Checks

Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check, or artifact note.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §2 INTENT_MODEL + RESOURCE_MAP |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/depth_framework.md` | TEXT_ENHANCE conditional load |
| `../../references/patterns_evaluation.md` | FRAMEWORK conditional load |

---

## 5. SOURCE METADATA

- Group: Smart Routing
- Playbook ID: SP-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--smart-routing/005-intent-model-keyword-scoring.md`
