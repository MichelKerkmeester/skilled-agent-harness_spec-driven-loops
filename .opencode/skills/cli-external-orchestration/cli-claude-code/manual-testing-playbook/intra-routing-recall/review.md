---
id: CC-R04
category: intra_routing_recall
stage: routing
title: 'Review routing'
description: "This scenario validates the hub's REVIEW intent-routing contract for CC-R04. It confirms the keyword-bearing prompt resolves REVIEW at the documented INTENT_SIGNALS weight and that RESOURCE_MAP bundles the expected resource set."
expected_intent: REVIEW
expected_resources: 
  - references/integration-patterns.md
  - references/agent-delegation.md
version: 1.0.0.0
---

# CC-R04: Review routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CC-R04`.

---

## 1. OVERVIEW

This scenario validates the hub's `REVIEW` intent-routing contract for `CC-R04`. It focuses on confirming the prompt's matching router keywords resolve `REVIEW` at the documented `INTENT_SIGNALS` weight, and that `RESOURCE_MAP["REVIEW"]` bundles `references/integration-patterns.md` and `references/agent-delegation.md`. T1 (in-skill recall — prompt carries the intent's router keywords)

### Why This Matters

Routing recall scenarios are how this playbook proves the hub's smart router actually resolves the
documented `INTENT_SIGNALS`/`RESOURCE_MAP` contract in SKILL.md, rather than assuming the router
matches its own documentation. A drift here means an operator prompt silently loads the wrong
reference set or none at all.

---

## 2. SCENARIO CONTRACT

- Objective: confirm SKILL.md's `INTENT_SIGNALS["REVIEW"]` entry matches this scenario's expected_intent, and RESOURCE_MAP["REVIEW"] resolves on disk.
- Stage: `routing` — T1 (in-skill recall — prompt carries the intent's router keywords)
- Prompt: `Get a second opinion from Claude: audit this login handler for security holes and give a quality verdict.`

**Exact prompt**:
```text
Get a second opinion from Claude: audit this login handler for security holes and give a quality verdict.
```

- Expected execution process: the hub scores the prompt against every `INTENT_SIGNALS` keyword list and resolves `REVIEW` at its documented weight, then conditional-loads `RESOURCE_MAP["REVIEW"]`.
- Expected signals: SKILL.md's `INTENT_SIGNALS["REVIEW"]` entry exists with its documented weight and keyword list, and `RESOURCE_MAP["REVIEW"]` names `references/integration-patterns.md` and `references/agent-delegation.md`; both resource paths resolve on disk.
- Desired user-visible outcome: the bundled workflow states plainly which intent this prompt resolves and which resources it loaded, before any downstream execution happens.
- Pass/fail: PASS if SKILL.md's `INTENT_SIGNALS["REVIEW"]` and `RESOURCE_MAP["REVIEW"]` entries match this scenario's frontmatter and both resource paths exist; FAIL if either entry has drifted from this scenario's frontmatter, or a resource path does not resolve.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Get a second opinion from Claude: audit this login handler for security holes and give a quality verdict.`

### Commands

1. `sed -n '1,15p' .opencode/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/intra-routing-recall/review.md`
2. `grep -n '"REVIEW"' ../../SKILL.md` (confirms the `INTENT_SIGNALS` entry)
3. `grep -A2 'RESOURCE_MAP = {' ../../SKILL.md | grep '"REVIEW"'` (confirms the `RESOURCE_MAP` entry)
4. `test -e .opencode/skills/cli-external-orchestration/cli-claude-code/references/integration-patterns.md && echo "OK references/integration-patterns.md" || echo "MISS references/integration-patterns.md"`
5. `test -e .opencode/skills/cli-external-orchestration/cli-claude-code/references/agent-delegation.md && echo "OK references/agent-delegation.md" || echo "MISS references/agent-delegation.md"`

### Expected

Step 1 shows `expected_intent: REVIEW`. Step 2's output names the `REVIEW` keyword list and weight. Step 3 shows `RESOURCE_MAP["REVIEW"]` naming `references/integration-patterns.md` and `references/agent-delegation.md`. Step 4 prints `OK` for every resource.

### Evidence

Command transcript from every step above; this scenario's frontmatter compared against SKILL.md's
live `INTENT_SIGNALS["REVIEW"]` entry.

### Pass / Fail

- **Pass**: SKILL.md's `INTENT_SIGNALS["REVIEW"]` and `RESOURCE_MAP["REVIEW"]` entries match this scenario's frontmatter, and every resource path resolves.
- **Fail**: the keyword/weight entry or the resource mapping has drifted from this scenario's frontmatter, or a resource path does not resolve.

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
| [SKILL.md](../../SKILL.md) | The `REVIEW` entry in `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CC-R04
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/review.md`
