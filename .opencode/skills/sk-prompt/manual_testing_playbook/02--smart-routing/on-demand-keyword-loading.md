---
title: "SP-006 -- ON_DEMAND keyword loads full RESOURCE_MAP"
description: "This scenario validates ON_DEMAND_KEYWORDS for `SP-006`. It focuses on confirming keywords like \"deep dive\", \"all frameworks\", \"format guide\" trigger loading every RESOURCE_MAP entry."
---

# SP-006 -- ON_DEMAND keyword loads full RESOURCE_MAP

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-006`.

---

## 1. OVERVIEW

This scenario validates ON_DEMAND_KEYWORDS for `SP-006`. It focuses on confirming that explicit operator phrasing such as "deep dive", "all frameworks", or "format guide" forces the router to load every RESOURCE_MAP entry before `@prompt-improver` uses the expanded context.

### Why This Matters

Operators sometimes need the full reference set (for example to compare 7 frameworks in one call). Without ON_DEMAND coverage, the router silently truncates context and the operator gets a partial answer with no signal that resources were withheld.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-006` and confirm the expected signals without contradictory evidence.

- Objective: Confirm ON_DEMAND keywords load all RESOURCE_MAP entries
- Real user request: `Give me a deep dive on all frameworks — I want to compare RCAF vs COSTAR vs TIDD-EC for an executive briefing.`
- Prompt: `Run sk-prompt on my deep-dive framework comparison; verify ON_DEMAND loads every RESOURCE_MAP value, not only the scored intent.`
- Expected execution process: sk-prompt scores intents, loads the default resource, then detects the ON_DEMAND keyword and unions every RESOURCE_MAP entry into the loaded set, deduplicated.
- Expected signals: Loaded list includes BOTH `references/depth_framework.md` AND `references/patterns_evaluation.md` regardless of which intent scored higher.
- Desired user-visible outcome: Routing trace listing both reference files, with a note that ON_DEMAND keyword "deep dive" or "all frameworks" was matched.
- Pass/fail: PASS if both reference files appear in the loaded list; FAIL if only one loads.

---

## 3. TEST EXECUTION

### Prompt

```
Run sk-prompt on my deep-dive framework comparison; verify ON_DEMAND loads every RESOURCE_MAP value, not only the scored intent.
```

### Commands

1. `sk-prompt: Give me a deep dive on all frameworks — I want to compare RCAF vs COSTAR vs TIDD-EC for an executive briefing.`
2. `bash: rg 'ON_DEMAND_KEYWORDS' .opencode/skills/sk-prompt/SKILL.md` (verify keyword list still includes "deep dive" and "all frameworks")

### Expected

Routing trace lists both `references/depth_framework.md` and `references/patterns_evaluation.md` even though FRAMEWORK is the higher-scoring intent for this input.

### Evidence

Routing trace; ON_DEMAND keyword match log; full resource list.

### Pass / Fail

- **Pass**: Both references appear in loaded list; ON_DEMAND match logged.
- **Fail**: Only the FRAMEWORK-mapped resource loads (depth_framework.md missing from trace).

### Failure Triage

1. Inspect SKILL.md §2 `ON_DEMAND_KEYWORDS` list; confirm "deep dive" and "all frameworks" still present.
2. Check `route_prompt_improver_resources()` pseudocode for the post-routing ON_DEMAND check.
3. Re-dispatch with a different ON_DEMAND keyword (for example "format guide") and confirm same behavior.

### Optional Supplemental Checks

Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check, or artifact note.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §2 ON_DEMAND_KEYWORDS |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/depth_framework.md` | Always-load on ON_DEMAND |
| `../../references/patterns_evaluation.md` | Always-load on ON_DEMAND |

---

## 5. SOURCE METADATA

- Group: Smart Routing
- Playbook ID: SP-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--smart-routing/on-demand-keyword-loading.md`
