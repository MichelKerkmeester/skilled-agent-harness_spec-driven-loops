---
title: "SP-007 -- AMBIGUITY_DELTA top-2 tiebreaker"
description: "This scenario validates AMBIGUITY_DELTA top-2 selection for `SP-007`. It focuses on confirming both intents load when scores differ by 1 or less."
---

# SP-007 -- AMBIGUITY_DELTA top-2 tiebreaker

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-007`.

---

## 1. OVERVIEW

This scenario validates AMBIGUITY_DELTA top-2 selection for `SP-007`. It focuses on confirming the router loads both top-scoring intents' resources (deduplicated) when their scores are within 1 point of each other, giving `@prompt-improver` both branches of context.

### Why This Matters

When an operator request is genuinely on the boundary between TEXT_ENHANCE and FRAMEWORK, hard-picking one intent silently drops the other's references. The top-2 contract preserves both branches of context for the assistant to draw from.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-007` and confirm the expected signals without contradictory evidence.

- Objective: Confirm AMBIGUITY_DELTA=1 produces top-2 resource union
- Real user request: `Improve this prompt and tell me which framework fits — RCAF or COSTAR.`
- Prompt: `Improve this framework-comparison prompt; verify near-tied TEXT_ENHANCE and FRAMEWORK intents load a deduplicated union of resources.`
- Expected execution process: sk-prompt scores both intents, computes the delta, finds it <= AMBIGUITY_DELTA=1, returns (primary, secondary) tuple, and loads union of RESOURCE_MAP entries with seen-set dedup.
- Expected signals: `references/depth_framework.md` AND `references/patterns_evaluation.md` both in loaded list with no duplicates.
- Desired user-visible outcome: Routing trace listing both intents with their scores, plus the deduplicated resource list.
- Pass/fail: PASS if both intents appear and resources are deduplicated; FAIL if only one intent loads or duplicates appear in the resource list.

---

## 3. TEST EXECUTION

### Prompt

```
Improve this framework-comparison prompt; verify near-tied TEXT_ENHANCE and FRAMEWORK intents load a deduplicated union of resources.
```

### Commands

1. `sk-prompt: Improve this prompt and tell me which framework fits — RCAF or COSTAR.`
2. `bash: rg 'AMBIGUITY_DELTA' .opencode/skills/sk-prompt/SKILL.md` (confirm delta=1)

### Expected

Routing trace lists `(TEXT_ENHANCE, FRAMEWORK)` (or vice versa) with scores within 1 point. Resources loaded: both `references/depth_framework.md` AND `references/patterns_evaluation.md`, no duplicates.

### Evidence

Routing trace with intent scores + resource list with dedup verification.

### Pass / Fail

- **Pass**: Both intents listed; both resources loaded once.
- **Fail**: Only one intent loads, or resource list has duplicates, or delta is calculated incorrectly.

### Failure Triage

1. Inspect SKILL.md `select_intents()` pseudocode: confirm AMBIGUITY_DELTA=1 path returns secondary intent.
2. Re-dispatch with a deliberately polarizing input ("just improve this") to confirm single-intent return works (control case).
3. Inspect `seen` set logic in `route_prompt_improver_resources()` for dedup correctness.

### Optional Supplemental Checks

Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check, or artifact note.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §2 select_intents() pseudocode |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/depth_framework.md` | TEXT_ENHANCE branch resource |
| `../../references/patterns_evaluation.md` | FRAMEWORK branch resource |

---

## 5. SOURCE METADATA

- Group: Smart Routing
- Playbook ID: SP-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--smart-routing/ambiguity-delta-tiebreaker.md`
