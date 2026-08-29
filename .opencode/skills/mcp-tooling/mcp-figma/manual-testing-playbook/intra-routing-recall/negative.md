---
id: FG-N01
category: intra_routing_recall
stage: negative
title: 'Negative: out of domain'
description: "This scenario validates the negative/out-of-domain control for `FG-N01`. It focuses on confirming a generic Python-refactor prompt, which shares zero INTENT_MODEL keywords with any mcp-figma intent, produces a zero-score UNKNOWN_FALLBACK route rather than a false-positive match."
expected_intent: none
expected_resources: []
blindToRouterKeywords: false
version: 1.0.0.1
---

# FG-N01: Negative: out of domain

This document captures the routing-recall contract, execution process, source anchors, and metadata for `FG-N01`.

---

## 1. OVERVIEW

This scenario validates the negative/out-of-domain control for `FG-N01`. It focuses on confirming that a prompt entirely unrelated to Figma -- refactoring a Python function -- scores zero against every entry in `INTENT_MODEL` (`SKILL.md` §2) and falls through `classify_intents`'s zero-score branch to `UNKNOWN_FALLBACK`, not on any Figma capability, since this scenario exists to prove the router does not force an out-of-domain prompt into a false-positive route.

### Why This Matters

A router with a broad keyword list can accidentally fire on unrelated language (for example "style" or "import" appearing in ordinary code-refactor language). This negative control is what proves `mcp-figma`'s six intents stay scoped to Figma-shaped requests and correctly decline to route a request that belongs to `sk-code`, not silently attach Figma resources to it.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `FG-N01` scores zero across every `INTENT_MODEL` entry and resolves no `expected_resources`.

- Objective: confirm the exact prompt matches none of the six `INTENT_MODEL` keyword lists and stays at `expected_intent: none`
- Real user request: `Refactor this Python function to run more efficiently.`
- Prompt: `Refactor this Python function to run more efficiently.`

**Exact prompt**:
```text
Refactor this Python function to run more efficiently.
```

- Expected execution process: the router scores the prompt against `INTENT_MODEL` (`SKILL.md` §2); no keyword from `CREATE_RENDER`, `DESIGN_SYSTEM_TOKENS`, `INSPECT_EXPORT`, `CONNECT_SETUP_DAEMON`, `MCP_CONTEXT`, or `TROUBLESHOOT` appears in the prompt, so `classify_intents` returns an all-zero score vector and the `UNKNOWN_FALLBACK` branch fires instead of a false intent match
- Expected signals: the frontmatter `expected_intent` stays `none` and `expected_resources` stays empty; the negative-control grep in step 3 reports `NOMATCH` for the full keyword alternation
- Desired user-visible outcome: the bundled workflow declines to attach any Figma resource to the request and, if surfaced to an orchestrator, reports this as outside the `mcp-figma` domain rather than guessing an intent
- Pass/fail: PASS if the prompt scores zero across all six `INTENT_MODEL` entries and the frontmatter stays `expected_intent: none`; FAIL if any keyword incidentally matches or an intent is force-assigned

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Refactor this Python function to run more efficiently.`

### Commands

1. `sed -n '1,14p' .opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/negative.md`
2. `sed -n '/^INTENT_MODEL = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-figma/SKILL.md`
3. `echo "Refactor this Python function to run more efficiently." | grep -qiE 'create|render|frame|component|icon|layout|import|build|draw|mockup|wireframe|prototype|artboard|button|generate|sketch|card|token|variable|var:|collection|shadcn|design system|theme|palette|style|swatch|typography|spacing|tailwind|primitive|inspect|extract|export|screenshot|design\.md|a11y|audit|accessibility|contrast|snapshot|properties|svg|png|storybook|jsx|download|capture|connect|safe|patch|unpatch|daemon|diagnose|reconnect|setup|set up|install|bridge|plugin|restart|health|mcp|code mode|design context|figma-developer-mcp|pull|framelink|utcp|get_design_context|error|failed|not connected|binary not found|unauthorized|broken|not working|doesn.t work|won.t connect|not responding|unresponsive|crash|timeout|conflict|stuck|permission denied' && echo MATCH || echo NOMATCH`

### Expected

Step 1 shows `expected_intent: none` in the frontmatter and an empty `expected_resources` list. Step 2 shows the full `INTENT_MODEL` block whose six keyword lists this scenario's negative-control grep is built from. Step 3 prints `NOMATCH`, confirming zero `INTENT_MODEL` keyword overlap across all six intents.

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
- Playbook ID: FG-N01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/negative.md`
