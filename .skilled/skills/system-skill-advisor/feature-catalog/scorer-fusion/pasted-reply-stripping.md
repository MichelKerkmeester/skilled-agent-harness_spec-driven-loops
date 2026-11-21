---
title: "Pasted Reply Stripping"
description: "Removes a recognized pasted reply before lane scoring so the earlier text cannot steer the task's route."
trigger_phrases:
  - "Pasted Reply Stripping"
  - "pasted reply strip"
  - "pasted assistant response"
  - "task marker stripping"
version: 1.0.2.0
---

# Pasted Reply Stripping

## 1. OVERVIEW

The scorer strips a recognized pasted reply before it evaluates the task text that follows the reply.

---

## 2. HOW IT WORKS

When a prompt starts with a recognized attribution header and includes a `Task:` or `Now:` marker, `stripLeadingPastedReply` keeps the text after its last marker. It repeats the pass until the prompt stops changing. `scoreAdvisorPrompt` calls it before the lane scorer runs.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts` | Shared | Recognizes and removes a pasted earlier reply before scoring. |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Shared | Cleans the prompt before building lane scores. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-prompt-policy.vitest.ts` | Automated test | Attributed-reply and marker fixtures, plus repeat-pass behavior. |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/route-receipt.vitest.ts` | Automated test | Confirms a pasted follow-up is classified after stripping. |

---

## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scorer-fusion/pasted-reply-stripping.md`

Related references:

- [lane-fusion.md](./lane-fusion.md).
