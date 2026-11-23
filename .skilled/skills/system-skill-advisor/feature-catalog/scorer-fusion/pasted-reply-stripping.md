---
title: "Pasted Reply Stripping"
description: "Removes a recognized pasted reply before lane scoring so the earlier text cannot steer the task's route."
trigger_phrases:
  - "Pasted Reply Stripping"
  - "pasted reply strip"
  - "pasted assistant response"
  - "task marker stripping"
version: 1.0.2.1
---

# Pasted Reply Stripping

## 1. OVERVIEW

The advisor strips a recognized pasted reply before it scores, routes or caches the task text that follows the reply. Every entry point runs the same strip, and the Python fallback keeps a copy of the rule that reads the same shared cases.

---

## 2. HOW IT WORKS

When a prompt starts with a recognized attribution header and includes a `Task:` or `Now:` marker, `stripLeadingPastedReply` keeps the text after its last marker. It repeats the pass until the prompt stops changing. `scoreAdvisorPrompt` calls it before the lane scorer runs. The recommend handler strips once so the cache key and the scorer see the same text. The brief producer strips before it decides whether to fire and which prompt to route. The Claude hook, which DSH, Vibe and Pi run through, strips before it cuts a long prompt and before the route-receipt guard reads it. The crash fallback strips the prompt it hands to the Python advisor. The CLI's typed-command reader strips first, so a command named only in a pasted reply is not offered. The Python advisor's `strip_leading_pasted_reply` applies the same rule before its native bridge call and before its local scorer.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts` | Shared | Recognizes and removes a pasted earlier reply before scoring. |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Shared | Cleans the prompt before building lane scores. |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | Handler | Strips once so the cache key and the scorer read the same text. |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts` | Shared | Strips before the fire decision and the routed prompt. |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Handler | Strips before the prompt cut and before the route-receipt guard. |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Shared | Strips the prompt handed to the Python advisor on the crash path. |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` | CLI | Strips before reading typed commands, so a pasted command is not offered. |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Python fallback | `strip_leading_pasted_reply`, the Python copy of the rule, run before the native bridge call and the local scorer. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-prompt-policy.vitest.ts` | Automated test | Attributed-reply and marker fixtures, plus repeat-pass behavior. |
| `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/pasted-reply-strip-cases.json` | Fixture | Strip cases both runtimes read, so the TypeScript rule and the Python copy cannot drift apart. |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | Automated test | Runs the Python copy over the shared strip cases. |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/route-receipt.vitest.ts` | Automated test | Confirms a pasted follow-up is classified after stripping. |

---

## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scorer-fusion/pasted-reply-stripping.md`

Related references:

- [lane-fusion.md](./lane-fusion.md).
