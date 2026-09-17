---
id: MB-N01
category: intra-routing-recall
stage: negative
title: 'Negative: out of domain'
description: "This scenario validates the negative/out-of-domain control for `MB-N01`. It focuses on confirming a generic SQL-optimization prompt, which shares zero INTENT_MODEL keywords with any mcp-mobbin intent, produces a zero-score UNKNOWN_FALLBACK route rather than a false-positive match."
expected_intent: none
expected_resources: []
blindToRouterKeywords: false
version: 1.0.0.1
---

# MB-N01: Negative: out of domain

This document captures the routing-recall contract, execution process, source anchors, and metadata for `MB-N01`.

---

## 1. OVERVIEW

This scenario validates the negative/out-of-domain control for `MB-N01`. It focuses on confirming that a prompt entirely unrelated to Mobbin -- optimizing a SQL query -- scores zero against every entry in `INTENT_MODEL` (`SKILL.md` §2) and falls through the router's zero-score branch to `UNKNOWN_FALLBACK`, not on any Mobbin capability, since this scenario exists to prove the router does not force an out-of-domain prompt into a false-positive route.

### Why This Matters

A router with a broad keyword list can accidentally fire on unrelated language (for example "plan" or "settings" appearing in ordinary database-tuning language). This negative control is what proves `mcp-mobbin`'s six intents stay scoped to Mobbin-shaped research requests and correctly decline to route a request that belongs to `sk-code`, not silently attach Mobbin resources to it.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `MB-N01` scores zero across every `INTENT_MODEL` entry and resolves no `expected_resources`.

- Objective: confirm the exact prompt matches none of the six `INTENT_MODEL` keyword lists and stays at `expected_intent: none`
- Real user request: `Optimize this SQL query so the report loads faster.`
- Prompt: `Optimize this SQL query so the report loads faster.`

**Exact prompt**:
```text
Optimize this SQL query so the report loads faster.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); no keyword from `APPS`, `SCREENS`, `FLOWS`, `ELEMENTS`, `WIRING_AUTH`, or `TROUBLESHOOT` appears in the prompt, so the classifier returns an all-zero score vector and the `UNKNOWN_FALLBACK` branch fires instead of a false intent match
- Expected signals: the frontmatter `expected_intent` stays `none` and `expected_resources` stays empty; the negative-control grep in step 3 reports `NOMATCH` for the full keyword alternation
- Desired user-visible outcome: the bundled workflow declines to attach any Mobbin resource to the request and, if surfaced to an orchestrator, reports this as outside the `mcp-mobbin` domain rather than guessing an intent
- Pass/fail: PASS if the prompt scores zero across all six `INTENT_MODEL` entries and the frontmatter stays `expected_intent: none`; FAIL if any keyword incidentally matches or an intent is force-assigned

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Optimize this SQL query so the report loads faster.`

### Commands

1. `sed -n '1,14p' .opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/intra-routing-recall/negative.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md`
3. `echo "Optimize this SQL query so the report loads faster." | grep -qiE 'app design research|app research|competitor|app comparison|banking apps|category|how do apps|real apps|screen|screen examples|ui pattern|empty state|first open|onboarding screen|component example|screenshot|paywall|settings|dashboard|flow|ux flow|user flow|journey|start to finish|multi-step|progression|forgot password|checkout|signup process|element|bottom sheet|inline validation|component behavior|button state|tab bar|modal|confirmation dialog|wiring|utcp|oauth|mcp-remote|authenticate|pkce|manual|register|token|plan|install|setup|error|failed|401|not working|not resolving|429|rate limit|timeout|unauthorized|denied' && echo MATCH || echo NOMATCH`

### Expected

Step 1 shows `expected_intent: none` in the frontmatter and an empty `expected_resources` list. Step 2 shows the full `INTENT_MODEL` block whose six keyword lists this scenario's negative-control grep is built from. Step 3 prints `NOMATCH`, confirming zero `INTENT_MODEL` keyword overlap across all scored intents.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_MODEL` block excerpt and the `NOMATCH` result from the negative-control grep.

### Pass / Fail

- **Pass**: the prompt scores zero across all six `INTENT_MODEL` entries (step 3 prints `NOMATCH`) and the frontmatter stays `expected_intent: none`
- **Fail**: the negative-control grep prints `MATCH` for any intent's keyword list, or the frontmatter assigns a non-`none` intent

### Failure Triage

1. If step 3 prints `MATCH`, re-run the same grep restricted to one intent's keyword list at a time to identify exactly which keyword the prompt incidentally contains.
2. Confirm whether the false match is a genuinely ambiguous prompt (rewrite the prompt) or a keyword in `INTENT_MODEL` that is too broad (flag it against `SKILL.md` §2 for a keyword-weight review) -- do not silently accept a routed intent for this negative-control scenario.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2 | `INTENT_MODEL`/`INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises |
| [SKILL.md](../../SKILL.md) §1 | Activation triggers this scenario's prompt assumes |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: MB-N01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/negative.md`
