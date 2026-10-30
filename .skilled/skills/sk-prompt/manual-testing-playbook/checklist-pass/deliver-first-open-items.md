---
title: "SP-012 -- Deliver first with numbered open items"
description: "This scenario validates delivery ordering for `SP-012`. It focuses on confirming that a request with soft gaps receives the improved prompt in the same reply, with every default listed afterwards as a numbered open item and no question asked first."
version: 3.0.0.0
---

# SP-012 -- Deliver first with numbered open items

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-012`.

---

## 1. OVERVIEW

This scenario validates that the improved prompt is delivered before any commentary. The operator asks for an improved prompt to summarise support tickets, leaving the format and audience unstated, and verifies that `@prompt-improver` answers with the improved prompt in that same reply and lists the gaps as numbered open items after it.

### Why This Matters

A request with soft gaps invites a question first, and that question costs the operator a second round trip for information the assistant could have defaulted and named. Putting the defaults inside the prompt is the opposite failure: the prompt travels with requirements the operator never chose. Delivering first and listing the open items after it keeps the reply usable immediately and keeps every guess visible and correctable.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-012` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a request with soft gaps gets the improved prompt in the same reply, with every default listed afterwards as a numbered open item and no question asked first.
- Real user request: `Improve this prompt for summarising support tickets.`
- Prompt: `Improve this prompt for summarising support tickets.`
- Expected execution process: `@prompt-improver` delivers the improved prompt as the first body of the reply, then appends the numbered open items for the defaults it chose.
- Expected signals: The improved prompt appears before any prose; defaults such as format and audience appear after it as numbered open items; no clarifying question precedes the prompt; no assumption sits inside the prompt.
- Desired user-visible outcome: One reply holding the improved prompt, followed by a numbered list naming each default such as the output format and the intended audience.
- Pass/fail: PASS if the prompt is delivered first with numbered open items; FAIL if the reply asks a question first or hides an assumption inside the prompt.

---

## 3. TEST EXECUTION

### Prompt

```
Improve this prompt for summarising support tickets.
```

### Commands

1. `sk-prompt: Improve this prompt for summarising support tickets.`
2. `agent: @prompt-improver raw_task="Improve a prompt for summarising support tickets. The request leaves format and audience unstated." task_type=generation target_cli=opencode complexity_hint=4 constraints="Deliver the improved prompt first. List every default and assumption as a numbered open item after it. Do not ask a question before the prompt."`
3. `bash: rg 'Deliver first|numbered open item|Ask one question only' .skilled/skills/sk-prompt/references/improvement-checklist.md`

### Expected

The reply opens with the improved prompt for summarising support tickets. A numbered list of open items follows it, naming each default the assistant chose, such as the output format and the intended audience. No question appears before the prompt.

### Evidence

Capture the reply in order: the improved prompt body first, then the numbered open items, and note that no clarifying question preceded the prompt.

### Pass / Fail

- **Pass**: The improved prompt is the first block of the reply, and every default it relies on appears afterwards as a numbered open item with no assumption left inside the prompt.
- **Fail**: The reply asks a clarifying question before delivering a prompt, or a chosen default is written into the prompt instead of the numbered list.

### Failure Triage

1. Inspect `../../references/improvement-checklist.md` section 7 for the delivery order and the open-item rule.
2. Inspect `../../SKILL.md` section 7 for the `@prompt-improver` contract on when a question is permitted.
3. Re-dispatch to `@prompt-improver` with `constraints="deliver the prompt before any commentary and put every default in the numbered open items"`.

### Optional Supplemental Checks

Verify that the open items are numbered rather than bulleted, and that each item names the default it records rather than restating the prompt.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: section 7 permission for asking a question, and the delivery order |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/improvement-checklist.md` | Section 7 delivery order: prompt first, defaults as numbered open items after it |
| `../../SKILL.md` | Section 7 contract describing when `@prompt-improver` may ask a question instead of delivering |

---

## 5. SOURCE METADATA

- Group: Checklist Pass
- Playbook ID: SP-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `checklist-pass/deliver-first-open-items.md`
