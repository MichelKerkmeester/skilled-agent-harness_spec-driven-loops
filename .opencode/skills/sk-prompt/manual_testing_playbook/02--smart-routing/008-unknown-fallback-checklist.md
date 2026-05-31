---
title: "SP-008 -- UNKNOWN_FALLBACK with disambiguation checklist"
description: "This scenario validates zero-keyword fallback for `SP-008`. It focuses on confirming the router defaults to TEXT_ENHANCE and surfaces UNKNOWN_FALLBACK_CHECKLIST."
---

# SP-008 -- UNKNOWN_FALLBACK with disambiguation checklist

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-008`.

---

## 1. OVERVIEW

This scenario validates zero-keyword fallback for `SP-008`. It focuses on confirming that input with zero INTENT_MODEL keyword matches falls back to TEXT_ENHANCE and surfaces the 4-item UNKNOWN_FALLBACK_CHECKLIST before any `@prompt-improver` enhancement proceeds.

### Why This Matters

Operators sometimes paste a draft with no meta-commentary. Without an UNKNOWN_FALLBACK_CHECKLIST surfacing, the router silently defaults the operator into a wrong path. The checklist gives the operator a concrete prompt to clarify intent.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-008` and confirm the expected signals without contradictory evidence.

- Objective: Confirm zero-keyword input routes to UNKNOWN_FALLBACK with checklist
- Real user request: `Here is some text I wrote yesterday. <body of text without meta-commentary>`
- Prompt: `Run sk-prompt on plain prose with no intent keywords; verify it defaults to TEXT_ENHANCE and surfaces UNKNOWN_FALLBACK_CHECKLIST.`
- Expected execution process: sk-prompt scores intents (all zero), enters the unknown-fallback branch, loads the default resource, returns `needs_disambiguation: true` along with the 4-item checklist.
- Expected signals: Default = TEXT_ENHANCE; checklist printed verbatim; disambiguation flag set
- Desired user-visible outcome: Routing trace showing default = TEXT_ENHANCE, plus the 4 checklist items rendered as numbered or bulleted list.
- Pass/fail: PASS if checklist surfaces and intent defaults to TEXT_ENHANCE; FAIL if router proceeds without prompting OR checklist is missing.

---

## 3. TEST EXECUTION

### Prompt

```
Run sk-prompt on plain prose with no intent keywords; verify it defaults to TEXT_ENHANCE and surfaces UNKNOWN_FALLBACK_CHECKLIST.
```

### Commands

1. `sk-prompt: Here is some text I wrote yesterday. <plain prose body, no INTENT_MODEL keywords>`
2. `bash: rg -A 6 'UNKNOWN_FALLBACK_CHECKLIST' .opencode/skills/sk-prompt/SKILL.md` (capture canonical 4-item list)

### Expected

Default intent = TEXT_ENHANCE. Routing trace surfaces all 4 checklist items: enhancement-vs-other-task; framework specifics; scoring vs evaluation; sk-doc/sk-code redirect.

### Evidence

Routing trace + checklist text. Compare against the canonical SKILL.md list.

### Pass / Fail

- **Pass**: Default = TEXT_ENHANCE; all 4 checklist items printed; disambiguation flag set.
- **Fail**: Router proceeds with full enhancement without prompting OR checklist missing or truncated.

### Failure Triage

1. Inspect SKILL.md `UNKNOWN_FALLBACK_CHECKLIST` constant for the canonical 4-item list.
2. Inspect `route_prompt_improver_resources()` for the `scores[primary] == 0` branch.
3. Re-dispatch with one keyword present (for example "improve") and confirm the fallback does NOT trigger.

### Optional Supplemental Checks

Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check, or artifact note.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §2 UNKNOWN_FALLBACK_CHECKLIST |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/depth_framework.md` | DEFAULT_RESOURCE loaded under UNKNOWN_FALLBACK |
| `../../SKILL.md` | §2 route_prompt_improver_resources() pseudocode |

---

## 5. SOURCE METADATA

- Group: Smart Routing
- Playbook ID: SP-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--smart-routing/008-unknown-fallback-checklist.md`
