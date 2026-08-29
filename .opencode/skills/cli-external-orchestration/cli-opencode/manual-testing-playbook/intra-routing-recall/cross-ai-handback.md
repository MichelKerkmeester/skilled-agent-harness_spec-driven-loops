---
id: CO-R03
category: intra_routing_recall
stage: routing
title: 'Cross-AI handback routing'
description: "This scenario validates the hub's CROSS_AI_HANDBACK intent-routing contract for CO-R03. It confirms the keyword-bearing prompt resolves CROSS_AI_HANDBACK at the documented INTENT_SIGNALS weight and that RESOURCE_MAP bundles the expected resource set."
expected_intent: CROSS_AI_HANDBACK
expected_resources: 
  - references/integration-patterns.md
  - references/opencode-tools.md
version: 1.0.0.0
---

# CO-R03: Cross-AI handback routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CO-R03`.

---

## 1. OVERVIEW

This scenario validates the hub's `CROSS_AI_HANDBACK` intent-routing contract for `CO-R03`. It focuses on confirming the prompt's matching router keywords resolve `CROSS_AI_HANDBACK` at the documented `INTENT_SIGNALS` weight, and that `RESOURCE_MAP["CROSS_AI_HANDBACK"]` bundles `references/integration-patterns.md` and `references/opencode-tools.md`.

### Why This Matters

Routing recall scenarios are how this playbook proves the hub's smart router actually resolves the
documented `INTENT_SIGNALS`/`RESOURCE_MAP` contract in SKILL.md, rather than assuming the router
matches its own documentation. A drift here means an operator prompt silently loads the wrong
reference set or none at all.

---

## 2. SCENARIO CONTRACT

- Objective: confirm SKILL.md's `INTENT_SIGNALS["CROSS_AI_HANDBACK"]` entry matches this scenario's expected_intent, and RESOURCE_MAP["CROSS_AI_HANDBACK"] resolves on disk.
- Stage: `routing`
- Prompt: `Hand back to spec kit and code graph so the memory_search index stays current after this run.`

**Exact prompt**:
```text
Hand back to spec kit and code graph so the memory_search index stays current after this run.
```

- Expected execution process: the hub scores the prompt against every `INTENT_SIGNALS` keyword list and resolves `CROSS_AI_HANDBACK` at its documented weight, then conditional-loads `RESOURCE_MAP["CROSS_AI_HANDBACK"]`.
- Expected signals: SKILL.md's `INTENT_SIGNALS["CROSS_AI_HANDBACK"]` entry exists with its documented weight and keyword list, and `RESOURCE_MAP["CROSS_AI_HANDBACK"]` names `references/integration-patterns.md` and `references/opencode-tools.md`; both resource paths resolve on disk.
- Desired user-visible outcome: the bundled workflow states plainly which intent this prompt resolves and which resources it loaded, before any downstream execution happens.
- Pass/fail: PASS if SKILL.md's `INTENT_SIGNALS["CROSS_AI_HANDBACK"]` and `RESOURCE_MAP["CROSS_AI_HANDBACK"]` entries match this scenario's frontmatter and both resource paths exist; FAIL if either entry has drifted from this scenario's frontmatter, or a resource path does not resolve.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Hand back to spec kit and code graph so the memory_search index stays current after this run.`

### Commands

1. `sed -n '1,15p' .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/intra-routing-recall/cross-ai-handback.md`
2. `grep -n '"CROSS_AI_HANDBACK"' ../../SKILL.md` (confirms the `INTENT_SIGNALS` entry)
3. `grep -A2 'RESOURCE_MAP = {' ../../SKILL.md | grep '"CROSS_AI_HANDBACK"'` (confirms the `RESOURCE_MAP` entry)
4. `test -e .opencode/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md && echo "OK references/integration-patterns.md" || echo "MISS references/integration-patterns.md"`
5. `test -e .opencode/skills/cli-external-orchestration/cli-opencode/references/opencode-tools.md && echo "OK references/opencode-tools.md" || echo "MISS references/opencode-tools.md"`

### Expected

Step 1 shows `expected_intent: CROSS_AI_HANDBACK`. Step 2's output names the `CROSS_AI_HANDBACK` keyword list and weight. Step 3 shows `RESOURCE_MAP["CROSS_AI_HANDBACK"]` naming `references/integration-patterns.md` and `references/opencode-tools.md`. Step 4 prints `OK` for every resource.

### Evidence

Command transcript from every step above; this scenario's frontmatter compared against SKILL.md's
live `INTENT_SIGNALS["CROSS_AI_HANDBACK"]` entry.

### Pass / Fail

- **Pass**: SKILL.md's `INTENT_SIGNALS["CROSS_AI_HANDBACK"]` and `RESOURCE_MAP["CROSS_AI_HANDBACK"]` entries match this scenario's frontmatter, and every resource path resolves.
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
| [SKILL.md](../../SKILL.md) | The `CROSS_AI_HANDBACK` entry in `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CO-R03
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/cross-ai-handback.md`
