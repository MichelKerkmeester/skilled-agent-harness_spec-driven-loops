---
title: "SP-003 -- $short runs the quick checklist"
description: "This scenario validates `$short` mode for `SP-003`. It focuses on confirming the quick effort level checks only rows 1, 3, 4 and 6, runs no quick test, and still applies the CLEAR screen."
version: 3.0.0.0
---

# SP-003 -- $short runs the quick checklist

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-003`.

---

## 1. OVERVIEW

This scenario validates `$short` mode for `SP-003`. It confirms that the quick effort level narrows the checklist to four rows, runs no quick test, and leaves the CLEAR screen in place.

### Why This Matters

`$short` is the escape hatch for a prompt that is close to good and needs one fast structural pass. If the quick level quietly checks all ten rows, the operator gets churn they did not ask for; if it drops the CLEAR screen, the operator gets an unmeasured draft. Either way the level stops being worth reaching for.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-003` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `$short` checks only rows 1, 3, 4 and 6, runs no quick test, and still applies the CLEAR screen
- Real user request: `$short tighten my prompt for a weekly team update`
- Prompt: `$short tighten my prompt; check only rows 1, 3, 4 and 6, run no quick test, and apply the CLEAR screen.`
- Expected execution process: sk-prompt reads `$short` as the quick effort level, works only rows 1, 3, 4 and 6, rewrites the prompt once with task, context, constraints and output format, self-checks the draft, scores the CLEAR screen, and reports `Quick test: NOT RUN`.
- Expected signals: Effort: quick; rows 1, 3, 4 and 6 marked; Quick test: NOT RUN; CLEAR screen present.
- Desired user-visible outcome: the prompt first, then the four row marks with reasons, the `Quick test: NOT RUN` line, and a CLEAR score with one reason per dimension.
- Pass/fail: PASS if exactly the four quick rows are checked and CLEAR still runs; FAIL if all ten rows run, the quick test runs, or CLEAR is skipped.

---

## 3. TEST EXECUTION

### Prompt

```
$short tighten my prompt; check only rows 1, 3, 4 and 6, run no quick test, and apply the CLEAR screen.
```

### Commands

1. `sk-prompt: $short tighten my prompt for a weekly team update`
2. `agent: @prompt-improver tighten this prompt for a weekly team update, stay inside the quick level: check rows 1, 3, 4 and 6 only, run no quick test, and still report the CLEAR score.`
3. `bash: rg -n 'rows 1, 3, 4 and 6' .skilled/skills/sk-prompt/references/improvement-checklist.md` (confirms the quick row set)

### Expected

The effort line reads quick. Exactly four rows are marked present, absent or not needed, and they are 1, 3, 4 and 6. The quick test is reported as not run rather than omitted silently. A CLEAR score with a stated reason per dimension follows the prompt.

### Evidence

Capture the delivered prompt, the row marks with their reasons, the `Quick test: NOT RUN` line and the CLEAR breakdown. Compare the marked rows against the quick set that command 3 prints.

### Pass / Fail

- **Pass**: Rows 1, 3, 4 and 6 are the only rows checked; the quick test is reported not run; the CLEAR score is present with reasons.
- **Fail**: All ten rows are checked, a quick test result is reported, or the CLEAR screen is missing.

### Failure Triage

1. Confirm `$short` is the literal first token of the input, ahead of the draft text.
2. Confirm the run reports effort as quick rather than the default standard level.
3. Count the marked rows. A run that marks seven or ten rows has defaulted to the full checklist.
4. Confirm the CLEAR screen was read from `references/patterns-evaluation.md` and scored, not dropped because the pass was short.
5. Re-run the same input without the `$short` prefix and confirm all ten rows appear, isolating the quick level as the difference.

### Optional Supplemental Checks

Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check, or artifact note.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Skill entry point: mode commands and the references each one loads |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/improvement-checklist.md` | Ten-row checklist, effort levels and the quick row set this scenario checks |
| `../../references/patterns-evaluation.md` | Structural screen definitions, including the CLEAR screen the checklist points at |
| `../../ROUTER.md` | Route table that resolves a mode command to its reference set |

---

## 5. SOURCE METADATA

- Group: Mode Detection
- Playbook ID: SP-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mode-detection/short-mode-quick-effort.md`
