---
id: CC-N01
category: intra_routing_recall
stage: negative
title: 'Negative — out of domain'
description: "This scenario validates the hub's UNKNOWN_FALLBACK path for CC-N01: an out-of-domain prompt must score zero against every INTENT_SIGNALS entry and route to the documented UNKNOWN_FALLBACK_CHECKLIST instead of guessing an intent."
expected_intent: none
expected_resources: []
version: 1.0.0.0
---

# CC-N01: Negative — out of domain

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CC-N01`.

---

## 1. OVERVIEW

This scenario validates the hub's `UNKNOWN_FALLBACK` path for `CC-N01`. It focuses on confirming that a prompt entirely outside this skill's cross-AI CLI-delegation domain scores zero against every `INTENT_SIGNALS` entry in SKILL.md, so the router returns `UNKNOWN_FALLBACK` with the documented `UNKNOWN_FALLBACK_CHECKLIST` rather than guessing an intent or loading an unrelated resource.

### Why This Matters

Negative control scenarios are how this playbook proves the hub's smart router actually resolves the
documented `INTENT_SIGNALS`/`RESOURCE_MAP` contract in SKILL.md, rather than assuming the router
matches its own documentation. A drift here means an operator prompt silently loads the wrong
reference set or none at all.

---

## 2. SCENARIO CONTRACT

- Objective: confirm SKILL.md's `UNKNOWN_FALLBACK_CHECKLIST` entry exists and the documented zero-score rule routes to UNKNOWN_FALLBACK.
- Stage: `negative` — T3 (negative — prompt is outside this skill's cross-AI CLI-delegation domain; the in-skill router must select no intent and route no resource)
- Prompt: `What's a good watering schedule for tomato seedlings on a sunny balcony?`

**Exact prompt**:
```text
What's a good watering schedule for tomato seedlings on a sunny balcony?
```

- Expected execution process: the hub scores the prompt against every `INTENT_SIGNALS` keyword list, finds no match, and returns `UNKNOWN_FALLBACK` with `UNKNOWN_FALLBACK_CHECKLIST`.
- Expected signals: SKILL.md defines `UNKNOWN_FALLBACK_CHECKLIST` and states that a max intent score of `0` returns `UNKNOWN_FALLBACK`; no `RESOURCE_MAP` entry is loaded for this prompt.
- Desired user-visible outcome: the bundled workflow states plainly which intent this prompt resolves (none) and surfaces the disambiguation checklist, before any downstream execution happens.
- Pass/fail: PASS if SKILL.md's `UNKNOWN_FALLBACK_CHECKLIST` exists and the documented zero-score rule routes to `UNKNOWN_FALLBACK`; FAIL if the prompt is found to score above zero against any `INTENT_SIGNALS` entry, or if `UNKNOWN_FALLBACK_CHECKLIST` is missing from SKILL.md.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `What's a good watering schedule for tomato seedlings on a sunny balcony?`

### Commands

1. `sed -n '1,15p' .opencode/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/intra-routing-recall/negative.md`
2. `grep -n "UNKNOWN_FALLBACK_CHECKLIST\|max score is 0" ../../SKILL.md`


### Expected

Step 1 shows `expected_intent: none`. Step 2's output shows the `UNKNOWN_FALLBACK_CHECKLIST` definition and the zero-score `UNKNOWN_FALLBACK` rule.

### Evidence

Command transcript from every step above; this scenario's frontmatter compared against SKILL.md's
live `UNKNOWN_FALLBACK_CHECKLIST` entry.

### Pass / Fail

- **Pass**: SKILL.md defines `UNKNOWN_FALLBACK_CHECKLIST` and the documented zero-score rule, and no `INTENT_SIGNALS` entry matches this prompt.
- **Fail**: this prompt is found to score above zero against any `INTENT_SIGNALS` entry, or `UNKNOWN_FALLBACK_CHECKLIST` is missing from SKILL.md.

### Failure Triage

1. Re-run the SKILL.md greps above and diff the current entry against this scenario's frontmatter to
   see exactly which keyword, weight, or resource moved.
2. Re-run the `test -e` checks and confirm whether a resource file was renamed or removed.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | The `UNKNOWN_FALLBACK_CHECKLIST` entry in `UNKNOWN_FALLBACK_CHECKLIST` this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CC-N01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/negative.md`
