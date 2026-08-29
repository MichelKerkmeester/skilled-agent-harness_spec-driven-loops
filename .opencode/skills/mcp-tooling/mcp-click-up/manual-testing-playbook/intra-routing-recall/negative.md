---
id: CU-N01
category: intra_routing_recall
stage: negative
title: 'Negative — out of domain'
description: "This scenario validates the SKILL.md Smart Router's UNKNOWN_FALLBACK path for `CU-N01`. It confirms an out-of-domain prompt scores zero on every intent and loads no resources, only the disambiguation checklist and a suggested (not loaded) fallback."
expected_intent: none
expected_resources: []
version: 1.1.0.0
---

# CU-N01: Negative — out of domain

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CU-N01`.

---

## 1. OVERVIEW

This scenario validates that the `mcp-click-up` Smart Router's out-of-domain path resolves to
`UNKNOWN_FALLBACK` on a request that has nothing to do with ClickUp tasks, `cupt`, or the ClickUp
MCP. It confirms every `INTENT_SIGNALS` intent scores zero, no resource is loaded, and the router
instead returns the disambiguation checklist plus a suggested (never auto-loaded) default resource,
per `SKILL.md` §2's `route_clickup_resources()`.

### Why This Matters

The router's `DEFAULT_RESOURCE_SEMANTICS = "fallback-only"` design means a zero-score prompt must
never silently inherit a resource — it must ask. This negative control is the one scenario that
proves the router refuses to guess when a request is genuinely out of domain, rather than routing an
unrelated code-refactoring request to ClickUp's CLI/MCP references.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt scores zero on every `INTENT_SIGNALS` entry under `SKILL.md` §2's
weighted keyword model, and that the router returns `UNKNOWN_FALLBACK` with no resources loaded.

- Objective: confirm the prompt has no keyword overlap with any `INTENT_SIGNALS` entry, so `scores`
  stays empty in `route_clickup_resources()` and the router returns the `UNKNOWN_FALLBACK` branch
  with `resources: []`.
- Real user request: `Refactor this Python function to use async and await, then add unit tests for the database layer.`
- Prompt: `Refactor this Python function to use async and await, then add unit tests for the database layer.`

**Exact prompt**:
```text
Refactor this Python function to use async and await, then add unit tests for the database layer.
```

- Negative anchor: the router must not activate any intent or load any reference for an unrelated
  code task.
- Expected execution process: the router scores every intent's keyword set against the lowercased
  prompt; none of `CUPT_DAILY`, `MCP_ADVANCED`, `INSTALL`, or `TROUBLESHOOT`'s keywords appear, so
  `scores` stays empty (`if not scores:`), and the function returns `load_level: "UNKNOWN_FALLBACK"`,
  `needs_disambiguation: true`, and `resources: []`.
- Expected signals: `SKILL.md` §2's `INTENT_SIGNALS` table shows no keyword from any intent present
  in the prompt; the `UNKNOWN_FALLBACK_CHECKLIST` and `DEFAULT_RESOURCE`
  (`references/cupt-commands.md`, suggested only, never loaded) are both defined in `SKILL.md` §2.
- Desired user-visible outcome: the router asks the disambiguation questions
  (`UNKNOWN_FALLBACK_CHECKLIST`) instead of answering the refactor request with ClickUp guidance, and
  states the suggested fallback without loading it.
- Pass/fail: PASS if no `INTENT_SIGNALS` keyword matches the prompt and `SKILL.md` §2 still defines
  the `UNKNOWN_FALLBACK` branch with a `fallback-only` suggested resource; FAIL if a keyword
  incidentally matches (a false-positive route) or the router loads a resource despite an empty
  `scores` dict.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Refactor this Python function to use async and await, then add unit tests for the database layer.`

### Commands

1. `sed -n '1,10p' .opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/negative.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md`
3. `sed -n '/^UNKNOWN_FALLBACK_CHECKLIST = \[/,/^\]/p' .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md`
4. `sed -n '/if not scores:/,/"resources": loaded,$/p' .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md`

### Expected

Step 1 shows `expected_intent: none` and `expected_resources: []`. Step 2's output confirms none of
the listed `CUPT_DAILY`/`MCP_ADVANCED`/`INSTALL`/`TROUBLESHOOT` keywords appear in the exact prompt
text. Step 3 shows the four-item `UNKNOWN_FALLBACK_CHECKLIST`. Step 4 shows the `if not scores:`
branch returning `load_level: "UNKNOWN_FALLBACK"`, `needs_disambiguation: True`,
`suggested_fallback: DEFAULT_RESOURCE`, and `resources: []` (the empty list this scenario's
`expected_resources` matches).

### Evidence

Command transcript from steps 1-4; the `INTENT_SIGNALS` excerpt from step 2 confirmed to have no
overlap with the prompt; the `UNKNOWN_FALLBACK` branch excerpt from step 4 showing `resources: []`.

### Pass / Fail

- **Pass**: no `INTENT_SIGNALS` keyword from any intent matches the exact prompt, and `SKILL.md` §2
  still returns the `UNKNOWN_FALLBACK` branch with an empty `resources` list on an empty `scores`
  dict.
- **Fail**: a keyword incidentally matches the prompt (false-positive route), or the
  `UNKNOWN_FALLBACK` branch in `SKILL.md` §2 no longer keeps `resources: []` on an empty score.

### Failure Triage

1. Re-run step 2 and scan every intent's keyword list against the exact prompt text word by word to
   find an accidental overlap.
2. Re-run step 4 and confirm the `if not scores:` gate and the `resources: []` return value are
   unchanged.
3. If a new keyword was added to any `INTENT_SIGNALS` entry, confirm it does not incidentally appear
   in generic prose like this scenario's code-refactoring prompt.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and §16 routing-recall index |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §2 | The `INTENT_SIGNALS` table and `UNKNOWN_FALLBACK` branch this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CU-N01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/negative.md`
