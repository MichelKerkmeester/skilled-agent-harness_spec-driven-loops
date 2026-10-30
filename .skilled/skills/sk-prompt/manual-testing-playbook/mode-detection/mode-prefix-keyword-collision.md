---
title: "SP-004 -- Mode token wins over keyword scoring"
description: "This scenario validates token-versus-keyword precedence for `SP-004`. It focuses on confirming that a whole `$short` token fixes the mode at quick effort even when the request also says improve and refine, so the keyword scores the router computes never move it to standard or thorough."
version: 3.0.0.0
---

# SP-004 -- Mode token wins over keyword scoring

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-004`.

---

## 1. OVERVIEW

This scenario validates token-versus-keyword precedence for `SP-004`. It focuses on confirming that when a whole mode token and improve-and-refine wording appear in the same request, the token decides the mode and its effort before keyword scoring is consulted.

### Why This Matters

Without deterministic precedence, operators cannot rely on `$short` to mean quick effort when their input also says "improve" or "refine". A router that lets keyword density win turns an explicit mode request into a different level of attention than the operator asked for, and every later mode decision becomes guesswork. Whole-token matching is what makes the mode request safe to combine with ordinary improve wording.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-004` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a whole `$short` token fixes the mode even when the request also says improve and refine, and that keyword scores do not change it.
- Real user request: `$short improve and refine my prompt`
- Prompt: `$short improve and refine my prompt`
- Expected execution process: sk-prompt reads the request, matches `$short` as a whole token, fixes the mode to short with quick effort, and treats the improve and refine wording as task description rather than as a signal that raises effort. Keyword scoring still runs on the request, but its result is not applied to the selected mode.
- Expected signals: Mode = `$short`, effort = quick, and the transparency report shows Mode `$short` and Effort quick, with no thorough-effort step and no quick test.
- Desired user-visible outcome: An improved prompt plus the transparency report showing Mode `$short` and Effort quick, no thorough-effort step, and no quick test.
- Pass/fail: PASS if the mode is `$short` at quick effort. FAIL if keyword scoring moves it to standard or thorough effort.

---

## 3. TEST EXECUTION

### Prompt

```
$short improve and refine my prompt
```

### Commands

1. `sk-prompt: $short improve and refine my prompt`
2. `agent: @prompt-improver "$short improve and refine my prompt" (confirm the whole token fixes mode $short at quick effort, that the improve and refine wording does not raise effort, and that keyword scores do not change the selected mode)`
3. `bash: rg 'detect_command_intent' ../../ROUTER.md` (confirm the intent rule matches whole mode tokens before it applies keyword scoring)

### Expected

Mode = `$short` at quick effort. The transparency report shows Mode `$short` and Effort quick, with no thorough-effort step and no quick test.

### Evidence

Capture the report note that names the mode and its effort. Capture the router output showing the keyword scores the request produced, next to the mode that was actually selected: the scores may be high and the mode must still be `$short` at quick effort. The trace listing the scores is expected; what matters is that they did not decide the mode.

### Pass / Fail

- **Pass**: Mode resolves to `$short` at quick effort, and the transparency report shows Mode `$short` and Effort quick, with no thorough-effort step and no quick test.
- **Fail**: Keyword scoring moves the mode to standard or thorough effort, or the mode resolves to anything other than `$short`.

### Failure Triage

1. Confirm `$short` is present as a whole token: exact spelling, exact case, separated from the remaining words by whitespace.
2. Inspect `detect_command_intent` in `../../ROUTER.md`: the whole-token match should be checked before keyword scoring is applied, not after.
3. Confirm the improve and refine wording is read as task description. Those words describe what the operator wants done to the prompt, not how much effort to spend.
4. If a keyword score still changes the selected mode, treat it as a precedence defect in `detect_command_intent` and report it rather than adjusting the request to work around it.

### Optional Supplemental Checks

Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check, or artifact note.

A useful variant is a request where the whole token sits after the improve wording, such as `improve and refine my prompt $short`. The token must still win, because position in the sentence is not part of the rule.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: the mode table and what each mode selects |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../ROUTER.md` | Router rule `detect_command_intent`: whole-token match and keyword scoring order |
| `../../references/improvement-checklist.md` | Effort levels and what quick effort covers |
| `../../references/patterns-evaluation.md` | CLEAR structure screen and the repair limit |
| `../../SKILL.md` | Mode surface as the skill describes it to callers |

---

## 5. SOURCE METADATA

- Group: Mode Detection
- Playbook ID: SP-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mode-detection/mode-prefix-keyword-collision.md`
