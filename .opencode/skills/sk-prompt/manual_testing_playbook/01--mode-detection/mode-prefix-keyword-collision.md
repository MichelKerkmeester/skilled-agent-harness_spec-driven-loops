---
title: "SP-004 -- Mode prefix wins over keyword scoring"
description: "This scenario validates prefix-vs-keyword precedence for `SP-004`. It focuses on confirming an explicit `$` prefix overrides keyword-weighted INTENT_MODEL scoring even when keyword density is high."
---

# SP-004 -- Mode prefix wins over keyword scoring

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-004`.

---

## 1. OVERVIEW

This scenario validates prefix-vs-keyword precedence for `SP-004`. It focuses on confirming that when an explicit mode prefix and conflicting keyword density coexist, the prefix wins before any `@prompt-improver` deep-path interpretation can alter the mode.

### Why This Matters

Without deterministic precedence, operators cannot rely on `$short` to mean 3 rounds when their input also says "improve" or "refine". Ambiguity here breaks the rest of the mode-detection contract.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-004` and confirm the expected signals without contradictory evidence.

- Objective: Confirm explicit prefix overrides keyword-weighted scoring
- Real user request: `$short Please improve and refine and enhance this prompt — make it tight and reusable.`
- Prompt: `$short improve and refine my prompt; verify the prefix overrides keyword scoring, runs 3 DEPTH rounds, and logs the override.`
- Expected execution process: sk-prompt enters STEP 0 mode detection, detects `$short` prefix, marks the input as prefix-resolved, skips INTENT_MODEL keyword scoring, and runs the 3-round D-P-H cycle.
- Expected signals: Mode = `$short`, DEPTH rounds = 3, transparency log notes "prefix detected; keyword scoring suppressed"
- Desired user-visible outcome: Enhanced prompt + transparency report stating "Mode prefix detected: $short; keyword scoring suppressed".
- Pass/fail: PASS if mode is `$short` and keyword scoring is logged as suppressed; FAIL if mode resolves to default (10 rounds) or if keyword-scoring trace runs.

---

## 3. TEST EXECUTION

### Prompt

```
$short improve and refine my prompt; verify the prefix overrides keyword scoring, runs 3 DEPTH rounds, and logs the override.
```

### Commands

1. `sk-prompt: $short Please improve and refine and enhance this prompt — make it tight and reusable.`
2. `bash: rg 'STEP 0' .opencode/skills/sk-prompt/SKILL.md` (confirm prefix detection happens at STEP 0)

### Expected

Mode = `$short`, DEPTH rounds = 3, transparency report contains "prefix detected; keyword scoring suppressed" or equivalent override note.

### Evidence

Capture transparency report. Confirm 3-round phase log. Confirm no INTENT_MODEL score table appears in the trace.

### Pass / Fail

- **Pass**: Mode resolves to `$short`, 3 DEPTH rounds run, override logged.
- **Fail**: Mode resolves to default (10 rounds) or INTENT_MODEL scoring runs alongside the prefix.

### Failure Triage

1. Confirm `$short` is the literal first token (no leading whitespace, exact case).
2. Inspect SKILL.md §2 Phase Detection block: STEP 0 should detect prefix BEFORE STEP 1 keyword scoring.
3. Inspect smart-router pseudocode for prefix-precedence logic.
4. If keyword scoring still runs, file a routing-precedence regression against §2 and SKILL.md.

### Optional Supplemental Checks

Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check, or artifact note.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §2 Phase Detection (STEP 0 prefix), §3 operating-modes |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §2 Smart Router pseudocode (prefix-precedence) |
| `../../references/depth_framework.md` | DEPTH 3-round contract under `$short` |

---

## 5. SOURCE METADATA

- Group: Mode Detection
- Playbook ID: SP-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--mode-detection/mode-prefix-keyword-collision.md`
