---
title: "Improvement Checklist"
description: "One-pass prompt improvement: a ten-row component checklist, an early exit for good prompts, three effort levels, one self-check, an optional quick test and a change report."
trigger_phrases:
  - "improvement checklist"
  - "one pass prompt check"
  - "prompt early exit"
  - "prompt effort level"
  - "prompt quick test"
  - "prompt change report"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Improvement Checklist

One pass over a prompt: read it once against ten rows, write it once from one skeleton, check it once against its own success criteria, then deliver it.

---

## 1. OVERVIEW

sk-prompt improves a prompt in one pass. It checks the prompt once against ten rows, writes the prompt from one component skeleton, checks it once against the stated success criteria, and delivers.

There are no rounds and no phases. The checklist is not a gate that repeats until clean. It is a single reading that decides what the prompt is missing before the prompt is written.

What that shape implies:

- A prompt that already covers the rows is returned early, without a rewrite.
- A prompt that misses rows is written once with those rows included.
- The finished draft is measured against its own success criteria one time.
- Repair is bounded, so an answer always arrives.

Every prompt is checked against the same ten rows in the same order. Checking against one list keeps every prompt in a session shaped alike, which is what makes later comparison possible.

---

## 2. THE CHECKLIST

1. Task and requested outcome.
2. Role or audience, only when it changes the response.
3. Context and source facts the model needs.
4. Constraints, priorities and how conflicts between them resolve.
5. Steps, tools or process, only when the task needs them.
6. Output format, schema and length limits.
7. Examples when they help: at least 1, about 3 typical, at most 5, in `<example>` tags with identical formatting.
8. Success criteria, edge cases or a way to verify the answer.
9. Contradictions, assumptions and missing information.
10. Wording: plain instructions with the reason given; soften CRITICAL and MUST rather than banning capitals.

Mark every row present, absent or not needed, with a one-line reason. A row marked not needed is not added. No prompt has to contain every row.

Some rows carry more weight than their position suggests:

- Row 1 is the only row that is always required. A prompt without a task is not a prompt.
- Row 4 matters because constraints that contradict each other produce an answer that satisfies neither. Name the priority order rather than listing rules that fight.
- Row 7 is the most over-used row. One representative example usually outperforms five decorative ones, and examples that drift in formatting teach the model to drift.
- Row 9 is a place to record what you do not know, not a place to invent an answer. An assumption written down is a fact the operator can correct.
- Row 10 is about tone, not obedience. Instructions in capitals push a model toward literal compliance and away from judgment, so state the reason and lower the volume.

The reasons matter as much as the marks. A mark without a reason is an opinion; a mark with a reason can be argued with.

---

## 3. EARLY EXIT

When every row is present or not needed, return the prompt unchanged, or with the smallest edit the user explicitly asked for. Say that no broader improvement was needed, and name the rows already covered so the judgment is visible.

Do not invent work to justify the pass. A prompt that names its task, supplies its context, states its constraints and fixes its output format is usually complete. Adding a role or a worked example to such a prompt changes the response more often than it improves it.

The early exit also covers the narrow request. A user who asks for one wording change gets that change, plus a note that the rest of the prompt stands. Rewriting around a small request is the most common way a one-pass check turns into unwanted churn.

---

## 4. EFFORT LEVELS

Effort decides how much of the checklist runs and whether the quick test runs. It never decides a hidden count of thinking rounds.

- **Quick** — `$short`. Checks rows 1, 3, 4 and 6: task, context, constraints, output format. Runs no quick test. Suitable when the job is clear and the risk of a wrong answer is low.
- **Standard** — the default, and what `$text`, `$improve`, `$json` and `$yaml` select. Checks all ten rows. Runs the quick test only when a target model is available and the caller wants it.
- **Thorough** — `$refine`. Checks all ten rows and attempts the quick test.
- **None** — `$raw`. Runs no pass. The prompt passes through as written, for a caller that owns its own prompt handling.

Effort changes checklist breadth and whether the quick test runs. Nothing else moves with it.

Choosing effort is about consequence, not about prompt length. A short prompt that drives a schema-validated response deserves thorough attention; a long prompt that produces a casual draft does not.

---

## 5. SELF-CHECK AND QUICK TEST

Self-check the draft once against its success criteria before delivering. Read the draft as the target model would: check the format against the requested format, the constraints against the stated priorities, and the examples against each other for drift. Record what the self-check caught and what it changed.

The quick test runs 2 or 3 representative inputs through the old prompt and the new one when a target model can run them, then compares the outputs. Report what differed. When no model can run the inputs, report `Quick test: NOT RUN` and continue; a skipped test is a stated fact, not a failure.

The test runs locally and depends on no hosted evaluation service. It is evidence, not proof: two or three inputs show direction, not distribution, so a passing comparison narrows doubt rather than closing it.

---

## 6. CLEAR SCREEN

CLEAR stays a short structural screen, defined once in
[patterns-evaluation.md](./patterns-evaluation.md) section 10. Write the reason before each score, so the number follows the argument rather than replacing it.

Pass at 40 of 50. Below that, revise the weakest dimension, up to 3 repair cycles, then deliver the best version with a note saying what remained weak.

A CLEAR score is not proof the prompt works. It measures the presence and shape of components, not the quality of the answer those components produce. Use it to catch a prompt that is structurally hollow, then rely on the self-check and the quick test for the rest.

---

## 7. DELIVERY AND CHANGE REPORT

Deliver first. The prompt comes before any commentary, so it can be copied without hunting for it.

List every default and assumption as a numbered open item after the prompt, never inside it. Defaults inside a prompt read as requirements once the prompt travels, and the operator inherits them without having chosen them.

Ask one question only when there is no prompt and no task to work from, or when two mode commands conflict and only the operator can settle which was meant. Everything else is delivered with a stated assumption.

Preserve the user's guidelines and examples as closely as possible, word for word only when asked. Rewording a guideline the operator wrote changes the instruction they intended.

Warn when the prompt grows past about 3 times the original. Growth that large usually means the check imported material the task never asked for.

End with a change report, one line per heading:

- **Added** — components, constraints or examples that were absent.
- **Changed** — wording, structure or ordering that moved.
- **Removed** — material that contradicted the task or duplicated another row.
- **Skipped** — rows judged not needed, with the reason kept short.

---

## 8. QUICK REFERENCE

- Check once against ten rows; mark each present, absent or not needed with a reason.
- Return good prompts early, unchanged or with the smallest edit asked for.
- Effort sets checklist breadth and the quick test, never thinking rounds: quick, standard, thorough, plus no pass for raw.
- Self-check the draft once against its success criteria; run 2 or 3 representative inputs old versus new, or report the test as not run.
- CLEAR stays a 50-point structural screen, pass at 40, repair up to 3 cycles, and it never proves the prompt works.
- Deliver the prompt first; keep defaults and assumptions in a numbered list after it.
- Ask a question only when there is no prompt and no task, or when two mode commands conflict.
- Close with Added, Changed, Removed, Skipped.
