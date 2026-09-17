---
id: CD-N01
category: intra_routing_recall
stage: negative
title: 'Negative: out of domain'
description: "This scenario validates the negative/out-of-domain control for `CD-N01`. It focuses on confirming a generic report-summarization prompt, which shares zero INTENT_SIGNALS keywords with any mcp-chrome-devtools intent, produces a zero-score UNKNOWN_FALLBACK route rather than a false-positive match."
expected_intent: none
expected_resources: []
blindToRouterKeywords: false
version: 1.0.0.1
---

# CD-N01: Negative: out of domain

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CD-N01`.

---

## 1. OVERVIEW

This scenario validates the negative/out-of-domain control for `CD-N01`. It focuses on confirming that a prompt entirely unrelated to browser debugging -- summarizing a quarterly sales report -- scores zero against every entry in `INTENT_SIGNALS` (`SKILL.md` §2) and falls through the router's zero-score branch to `UNKNOWN_FALLBACK`, not on any Chrome DevTools capability, since this scenario exists to prove the router does not force an out-of-domain prompt into a false-positive route.

### Why This Matters

A router with a broad keyword list can accidentally fire on unrelated language (for example "batch" or "download" appearing in ordinary office language). This negative control is what proves `mcp-chrome-devtools`'s five intents stay scoped to browser-debugging-shaped requests and correctly decline to route a request that belongs to `sk-code` or a general-purpose assistant, not silently attach Chrome DevTools resources to it.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `CD-N01` scores zero across every `INTENT_SIGNALS` entry and resolves no `expected_resources`.

- Objective: confirm the exact prompt matches none of the five `INTENT_SIGNALS` keyword lists and stays at `expected_intent: none`
- Real user request: `Summarise this quarterly sales report into three bullet points.`
- Prompt: `Summarise this quarterly sales report into three bullet points.`

**Exact prompt**:
```text
Summarise this quarterly sales report into three bullet points.
```

- Expected execution process: the router scores the prompt against `INTENT_SIGNALS` (`SKILL.md` §2); no keyword from `CLI`, `MCP`, `INSTALL`, `TROUBLESHOOT`, or `AUTOMATION` appears in the prompt, so the classifier returns an all-zero score vector and the `UNKNOWN_FALLBACK` branch fires instead of a false intent match
- Expected signals: the frontmatter `expected_intent` stays `none` and `expected_resources` stays empty; the negative-control grep in step 3 reports `NOMATCH` for the full keyword alternation
- Desired user-visible outcome: the bundled workflow declines to attach any Chrome DevTools resource to the request and, if surfaced to an orchestrator, reports this as outside the `mcp-chrome-devtools` domain rather than guessing an intent
- Pass/fail: PASS if the prompt scores zero across all five `INTENT_SIGNALS` entries and the frontmatter stays `expected_intent: none`; FAIL if any keyword incidentally matches or an intent is force-assigned

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Summarise this quarterly sales report into three bullet points.`

### Commands

1. `sed -n '1,14p' .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/negative.md`
2. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md`
3. `echo "Summarise this quarterly sales report into three bullet points." | grep -qiE 'bdg|browser-debugger-cli|terminal|cli|command line|command-line|shell|headless|lightweight|token efficient|mcp|code mode|multi-tool|parallel sessions|model context protocol|multiple tools|isolated instances|tool chain|in parallel|install|setup|not installed|command -v bdg|set up|getting started|download|npm install|not found|first time|error|failed|troubleshoot|session issue|keeps dropping|won.t connect|figure out why|work out the cause|hangs|hanging|stuck|crash|crashing|broken|not working|timeout|disconnect|flaky|root cause|ci|pipeline|automation|production|automate|unattended|continuous integration|batch|recurring' && echo MATCH || echo NOMATCH`

### Expected

Step 1 shows `expected_intent: none` in the frontmatter and an empty `expected_resources` list. Step 2 shows the full `INTENT_SIGNALS` block whose five keyword lists this scenario's negative-control grep is built from. Step 3 prints `NOMATCH`, confirming zero `INTENT_MODEL` keyword overlap across all scored intents.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; the `INTENT_SIGNALS` block excerpt and the `NOMATCH` result from the negative-control grep.

### Pass / Fail

- **Pass**: the prompt scores zero across all five `INTENT_SIGNALS` entries (step 3 prints `NOMATCH`) and the frontmatter stays `expected_intent: none`
- **Fail**: the negative-control grep prints `MATCH` for any intent's keyword list, or the frontmatter assigns a non-`none` intent

### Failure Triage

1. If step 3 prints `MATCH`, re-run the same grep restricted to one intent's keyword list at a time to identify exactly which keyword the prompt incidentally contains.
2. Confirm whether the false match is a genuinely ambiguous prompt (rewrite the prompt) or a keyword in `INTENT_SIGNALS` that is too broad (flag it against `SKILL.md` §2 for a keyword-weight review) -- do not silently accept a routed intent for this negative-control scenario.

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
- Playbook ID: CD-N01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/negative.md`
