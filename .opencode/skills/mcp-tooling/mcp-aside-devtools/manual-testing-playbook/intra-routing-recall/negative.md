---
id: AD-N01
category: intra-routing-recall
stage: negative
title: 'Negative: out of domain'
description: "This scenario validates the SKILL.md Smart Router's UNKNOWN_FALLBACK path for `AD-N01`. It confirms an out-of-domain prompt scores zero on every intent and loads no resources, only the disambiguation checklist and a suggested (not loaded) fallback."
expected_intent: none
expected_resources: []
blindToRouterKeywords: false
version: 1.1.0.0
---

# AD-N01: Negative: out of domain

This document captures the routing-recall contract, execution process, source anchors, and metadata for `AD-N01`.

---

## 1. OVERVIEW

This scenario validates that the `mcp-aside-devtools` Smart Router's out-of-domain path resolves to
`UNKNOWN_FALLBACK` on a request that has nothing to do with Aside, browser automation, or Code Mode.
It confirms every `INTENT_SIGNALS` intent scores zero, no resource is loaded, and the router instead
returns the disambiguation checklist plus a suggested (never auto-loaded) default resource, per
`SKILL.md` §2's `route_aside_devtools_resources()`.

### Why This Matters

The router's `DEFAULT_RESOURCE_SEMANTICS = "fallback-only"` design means a zero-score prompt must
never silently inherit a resource — it must ask. This negative control is the one scenario that
proves the router refuses to guess when a request is genuinely out of domain, rather than routing an
unrelated email-drafting request to Aside's CLI/REPL/MCP references.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt scores zero on every `INTENT_SIGNALS` entry under `SKILL.md` §2's
weighted keyword model, and that the router returns `UNKNOWN_FALLBACK` with no resources loaded.

- Objective: confirm the prompt has no keyword overlap with any `INTENT_SIGNALS` entry, so
  `max(scores.values())` stays below the `0.5` gate in `route_aside_devtools_resources()` and the
  router returns the `UNKNOWN_FALLBACK` branch with `resources: []`.
- Real user request: `Draft a two-paragraph welcome email for the new marketing hire starting on Monday.`
- Prompt: `Draft a two-paragraph welcome email for the new marketing hire starting on Monday.`

**Exact prompt**:
```text
Draft a two-paragraph welcome email for the new marketing hire starting on Monday.
```

- Expected execution process: the router scores every intent's keyword set against the lowercased
  prompt; none of `TASK`, `REPL`, `MCP`, `INSTALL`, or `TROUBLESHOOT`'s keywords appear, so every
  score is `0.0`, `max(scores.values() or [0]) < 0.5` is true, and the function returns
  `load_level: "UNKNOWN_FALLBACK"`, `needs_disambiguation: true`, and `resources: []`.
- Expected signals: `SKILL.md` §2's `INTENT_SIGNALS` table shows no keyword from any intent present
  in the prompt; the `UNKNOWN_FALLBACK_CHECKLIST` and `DEFAULT_RESOURCE` (`references/aside-cli-reference.md`,
  suggested only, never loaded) are both defined in `SKILL.md` §2.
- Desired user-visible outcome: the router asks the three disambiguation questions
  (`UNKNOWN_FALLBACK_CHECKLIST`) instead of answering the email-drafting request with Aside guidance,
  and states the suggested fallback without loading it.
- Pass/fail: PASS if no `INTENT_SIGNALS` keyword matches the prompt and `SKILL.md` §2 still defines
  the `UNKNOWN_FALLBACK` branch with a `fallback-only` suggested resource; FAIL if a keyword
  incidentally matches (a false-positive route) or the router loads a resource despite a zero score.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Draft a two-paragraph welcome email for the new marketing hire starting on Monday.`

### Commands

1. `sed -n '1,12p' .opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/negative.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md`
3. `sed -n '/^UNKNOWN_FALLBACK_CHECKLIST = \[/,/^\]/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md`
4. `sed -n '/^    if max(scores.values/,/"resources": loaded,$/p' .opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md`

### Expected

Step 1 shows `expected_intent: none` and `expected_resources: []`. Step 2's output confirms none of
the listed `TASK`/`REPL`/`MCP`/`INSTALL`/`TROUBLESHOOT` keywords appear in the exact prompt text.
Step 3 shows the three-item `UNKNOWN_FALLBACK_CHECKLIST`. Step 4 shows the `< 0.5` gate returning
`load_level: "UNKNOWN_FALLBACK"`, `needs_disambiguation: True`, `suggested_fallback: DEFAULT_RESOURCE`,
and `resources: []` (the empty list this scenario's `expected_resources` matches).

### Evidence

Command transcript from steps 1-4; the `INTENT_SIGNALS` excerpt from step 2 confirmed to have no
overlap with the prompt; the `UNKNOWN_FALLBACK` branch excerpt from step 4 showing `resources: []`.

### Pass / Fail

- **Pass**: no `INTENT_SIGNALS` keyword from any intent matches the exact prompt, and `SKILL.md` §2
  still returns the `UNKNOWN_FALLBACK` branch with an empty `resources` list on a sub-`0.5` score.
- **Fail**: a keyword incidentally matches the prompt (false-positive route), or the `UNKNOWN_FALLBACK`
  branch in `SKILL.md` §2 no longer keeps `resources: []` on a zero score.

### Failure Triage

1. Re-run step 2 and scan every intent's keyword list against the exact prompt text word by word to
   find an accidental overlap.
2. Re-run step 4 and confirm the `0.5` gate and the `resources: []` return value are unchanged.
3. If a new keyword was added to any `INTENT_SIGNALS` entry, confirm it does not incidentally appear
   in generic prose like this scenario's email-drafting prompt.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and §14 routing-recall index |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` §2 | The `INTENT_SIGNALS` table and `UNKNOWN_FALLBACK` branch this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: AD-N01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/negative.md`
