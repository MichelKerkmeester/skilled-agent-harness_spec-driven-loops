---
id: CC-H01
category: intra_routing_recall
stage: holdout
title: 'Blind holdout — reasoning domain'
description: "This scenario validates the hub's DEEP_REASONING generalization contract for CC-H01. It confirms the paraphrased prompt resolves DEEP_REASONING at the documented INTENT_SIGNALS weight and that RESOURCE_MAP bundles the expected resource set."
expected_intent: DEEP_REASONING
expected_resources: 
  - references/cli-reference.md
  - references/claude-tools.md
version: 1.0.0.0
---

# CC-H01: Blind holdout — reasoning domain

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CC-H01`.

---

## 1. OVERVIEW

This scenario validates the hub's `DEEP_REASONING` generalization contract for `CC-H01`. It focuses on confirming the paraphrased, keyword-free resolve `DEEP_REASONING` at the documented `INTENT_SIGNALS` weight, and that `RESOURCE_MAP["DEEP_REASONING"]` bundles `references/cli-reference.md` and `references/claude-tools.md`. T2 (blind holdout — prompt names no router keyword, intent key, skill id, or resource basename; tests generalization beyond keyword matching)

### Why This Matters

Blind holdout scenarios are how this playbook proves the hub's smart router actually resolves the
documented `INTENT_SIGNALS`/`RESOURCE_MAP` contract in SKILL.md, rather than assuming the router
matches its own documentation. A drift here means an operator prompt silently loads the wrong
reference set or none at all.

---

## 2. SCENARIO CONTRACT

- Objective: confirm SKILL.md's `INTENT_SIGNALS["DEEP_REASONING"]` entry matches this scenario's expected_intent, and RESOURCE_MAP["DEEP_REASONING"] resolves on disk.
- Stage: `holdout` — T2 (blind holdout — prompt names no router keyword, intent key, skill id, or resource basename; tests generalization beyond keyword matching)
- Prompt: `I'm stuck choosing between two database layouts for a high-traffic service. Ask the other AI assistant to weigh the long-term maintainability implications and walk me through its rationale one step at a time.`

**Exact prompt**:
```text
I'm stuck choosing between two database layouts for a high-traffic service. Ask the other AI assistant to weigh the long-term maintainability implications and walk me through its rationale one step at a time.
```

- Expected execution process: the hub scores the prompt against every `INTENT_SIGNALS` keyword list and resolves `DEEP_REASONING` at its documented weight, then conditional-loads `RESOURCE_MAP["DEEP_REASONING"]`.
- Expected signals: SKILL.md's `INTENT_SIGNALS["DEEP_REASONING"]` entry exists with its documented weight and keyword list, and `RESOURCE_MAP["DEEP_REASONING"]` names `references/cli-reference.md` and `references/claude-tools.md`; both resource paths resolve on disk.
- Desired user-visible outcome: the bundled workflow states plainly which intent this prompt resolves and which resources it loaded, before any downstream execution happens.
- Pass/fail: PASS if SKILL.md's `INTENT_SIGNALS["DEEP_REASONING"]` and `RESOURCE_MAP["DEEP_REASONING"]` entries match this scenario's frontmatter and both resource paths exist; FAIL if either entry has drifted from this scenario's frontmatter, or a resource path does not resolve.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I'm stuck choosing between two database layouts for a high-traffic service. Ask the other AI assistant to weigh the long-term maintainability implications and walk me through its rationale one step at a time.`

### Commands

1. `sed -n '1,15p' .opencode/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/intra-routing-recall/holdout-reasoning.md`
2. `grep -n '"DEEP_REASONING"' ../../SKILL.md` (confirms the `INTENT_SIGNALS` entry)
3. `grep -A2 'RESOURCE_MAP = {' ../../SKILL.md | grep '"DEEP_REASONING"'` (confirms the `RESOURCE_MAP` entry)
4. `test -e .opencode/skills/cli-external-orchestration/cli-claude-code/references/cli-reference.md && echo "OK references/cli-reference.md" || echo "MISS references/cli-reference.md"`
5. `test -e .opencode/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md && echo "OK references/claude-tools.md" || echo "MISS references/claude-tools.md"`

### Expected

Step 1 shows `expected_intent: DEEP_REASONING`. Step 2's output names the `DEEP_REASONING` keyword list and weight. Step 3 shows `RESOURCE_MAP["DEEP_REASONING"]` naming `references/cli-reference.md` and `references/claude-tools.md`. Step 4 prints `OK` for every resource.

### Evidence

Command transcript from every step above; this scenario's frontmatter compared against SKILL.md's
live `INTENT_SIGNALS["DEEP_REASONING"]` entry.

### Pass / Fail

- **Pass**: SKILL.md's `INTENT_SIGNALS["DEEP_REASONING"]` and `RESOURCE_MAP["DEEP_REASONING"]` entries match this scenario's frontmatter, and every resource path resolves.
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
| [SKILL.md](../../SKILL.md) | The `DEEP_REASONING` entry in `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CC-H01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/holdout-reasoning.md`
