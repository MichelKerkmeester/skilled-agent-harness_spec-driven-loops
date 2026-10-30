---
title: "SP-013 -- Contradiction check resolves clashing rules"
description: "This scenario validates the contradiction row for `SP-013`. It focuses on naming two rules that fight and resolving them with a stated priority order."
version: 3.0.0.0
---

# SP-013 -- Contradiction check resolves clashing rules

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-013`.

---

## 1. OVERVIEW

This scenario validates that the contradiction row catches two instructions that cannot both be satisfied. The operator asks for a prompt that is extremely brief and fully detailed at the same time, and verifies that `@prompt-improver` names the clash and resolves it by stating which rule wins and when. The failure it guards against is a rewrite that keeps both rules or quietly drops one.

### Why This Matters

A prompt holding contradictory rules produces an answer that satisfies neither. The model splits the difference, and the operator receives something that is neither brief nor detailed. Naming the clash and stating a priority order turns an impossible pair into one decision the model can follow, and the change report keeps that decision visible.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-013` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the checklist's contradiction row catches two rules that fight and resolves them with a stated priority.
- Real user request: `Improve this prompt: be extremely brief, and also explain every step in full detail.`
- Prompt: `Improve this prompt: be extremely brief, and also explain every step in full detail; name the clash and state which rule wins.`
- Expected execution process: `@prompt-improver` marks the contradiction row, names the brevity-versus-detail clash, and rewrites the prompt so one rule wins under a stated condition.
- Expected signals: The contradiction row is marked and reasoned; the improved prompt states which rule wins and when; the change report lists the resolution under Changed or Removed.
- Desired user-visible outcome: An improved prompt whose priority clause decides real cases, with the resolution named in the change report.
- Pass/fail: PASS if the clash is named and resolved with a priority; FAIL if both rules survive unresolved or one is silently dropped.

---

## 3. TEST EXECUTION

### Prompt

```
Improve this prompt: be extremely brief, and also explain every step in full detail; name the clash and state which rule wins.
```

### Commands

1. `sk-prompt: Improve this prompt: be extremely brief, and also explain every step in full detail.`
2. `agent: @prompt-improver raw_task="Improve a prompt that asks for extreme brevity and full step detail at once." task_type=improvement target_cli=opencode complexity_hint=5 constraints="Mark the contradiction row, name the clash, and state which rule wins and under what condition."`
3. `bash: rg 'Contradictions, assumptions and missing information|Name the priority order' .skilled/skills/sk-prompt/references/improvement-checklist.md`

### Expected

The checklist marks the contradiction row present because the prompt really does state a clash, not because the row was assumed. The improved prompt keeps one length rule and one detail rule bound to a condition, so the model knows which applies in which case. The change report carries a line naming the resolution.

### Evidence

Capture the contradiction row mark with its one-line reason, the clause in the improved prompt that states the priority, and the change report line that records it.

### Pass / Fail

- **Pass**: The clash is named and resolved with a stated priority, and the change report lists the resolution.
- **Fail**: Both rules survive unresolved, one rule is silently dropped with no stated reason, or the contradiction row goes unmarked.

### Failure Triage

1. Check the contradiction row in `improvement-checklist.md` section 2 against the draft; a mark reading present with no clash named means the mark is wrong.
2. Check whether the improved prompt carries both rules with no priority clause, which means the rewrite copied the clash instead of resolving it.
3. Re-run through `@prompt-improver` with `constraints="state which rule wins and when; do not drop a rule without recording why"`.

### Optional Supplemental Checks

Verify the priority clause is specific enough to decide a real case, for example a length ceiling on the answer body while full detail applies to one step at a time, rather than a vague balance statement.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §3 pipeline and §7 `@prompt-improver` contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/improvement-checklist.md` | Contradiction row, its priority-order guidance, and the change report headings |
| `../../SKILL.md` | Pipeline order that decides when the checklist runs and how the result is delivered |

---

## 5. SOURCE METADATA

- Group: Checklist Pass
- Playbook ID: SP-013
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `checklist-pass/clashing-rules-resolved.md`
