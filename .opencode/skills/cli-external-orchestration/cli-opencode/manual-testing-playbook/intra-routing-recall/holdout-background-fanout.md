---
id: CO-H02
category: intra_routing_recall
stage: holdout
title: 'Blind holdout: background fan-out sessions'
description: "This scenario validates the hub's PARALLEL_DETACHED generalization contract for CO-H02. It confirms the paraphrased prompt resolves PARALLEL_DETACHED at the documented INTENT_SIGNALS weight and that RESOURCE_MAP bundles the expected resource set."
expected_intent: PARALLEL_DETACHED
expected_resources: 
  - references/integration-patterns.md
  - assets/prompt-templates.md
blindToRouterKeywords: true
version: 1.0.0.0
---

# CO-H02: Blind holdout: background fan-out sessions

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CO-H02`.

---

## 1. OVERVIEW

This scenario validates the hub's `PARALLEL_DETACHED` generalization contract for `CO-H02`. It focuses on confirming the paraphrased, keyword-free resolve `PARALLEL_DETACHED` at the documented `INTENT_SIGNALS` weight, and that `RESOURCE_MAP["PARALLEL_DETACHED"]` bundles `references/integration-patterns.md` and `assets/prompt-templates.md`. This is a blind holdout: the exact prompt intentionally names no literal router keyword, intent key, skill id, or resource basename, so a PASS here proves generalization beyond keyword matching rather than string recall.

### Why This Matters

Blind holdout scenarios are how this playbook proves the hub's smart router actually resolves the
documented `INTENT_SIGNALS`/`RESOURCE_MAP` contract in SKILL.md, rather than assuming the router
matches its own documentation. A drift here means an operator prompt silently loads the wrong
reference set or none at all.

---

## 2. SCENARIO CONTRACT

- Objective: confirm SKILL.md's `INTENT_SIGNALS["PARALLEL_DETACHED"]` entry matches this scenario's expected_intent, and RESOURCE_MAP["PARALLEL_DETACHED"] resolves on disk.
- Stage: `holdout`
- Prompt: `Fire off three background coding jobs on a remote box so they each explore a different fix at the same time, and give me a link to watch every one of them.`

**Exact prompt**:
```text
Fire off three background coding jobs on a remote box so they each explore a different fix at the same time, and give me a link to watch every one of them.
```

- Expected execution process: the hub scores the prompt against every `INTENT_SIGNALS` keyword list and resolves `PARALLEL_DETACHED` at its documented weight, then conditional-loads `RESOURCE_MAP["PARALLEL_DETACHED"]`.
- Expected signals: SKILL.md's `INTENT_SIGNALS["PARALLEL_DETACHED"]` entry exists with its documented weight and keyword list, and `RESOURCE_MAP["PARALLEL_DETACHED"]` names `references/integration-patterns.md` and `assets/prompt-templates.md`; both resource paths resolve on disk.
- Desired user-visible outcome: the bundled workflow states plainly which intent this prompt resolves and which resources it loaded, before any downstream execution happens.
- Pass/fail: PASS if SKILL.md's `INTENT_SIGNALS["PARALLEL_DETACHED"]` and `RESOURCE_MAP["PARALLEL_DETACHED"]` entries match this scenario's frontmatter and both resource paths exist; FAIL if either entry has drifted from this scenario's frontmatter, or a resource path does not resolve.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Fire off three background coding jobs on a remote box so they each explore a different fix at the same time, and give me a link to watch every one of them.`

### Commands

1. `sed -n '1,15p' .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/intra-routing-recall/holdout-background-fanout.md`
2. `grep -n '"PARALLEL_DETACHED"' ../../SKILL.md` (confirms the `INTENT_SIGNALS` entry)
3. `grep -A2 'RESOURCE_MAP = {' ../../SKILL.md | grep '"PARALLEL_DETACHED"'` (confirms the `RESOURCE_MAP` entry)
4. `test -e .opencode/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md && echo "OK references/integration-patterns.md" || echo "MISS references/integration-patterns.md"`
5. `test -e .opencode/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md && echo "OK assets/prompt-templates.md" || echo "MISS assets/prompt-templates.md"`

### Expected

Step 1 shows `expected_intent: PARALLEL_DETACHED`. Step 2's output names the `PARALLEL_DETACHED` keyword list and weight. Step 3 shows `RESOURCE_MAP["PARALLEL_DETACHED"]` naming `references/integration-patterns.md` and `assets/prompt-templates.md`. Step 4 prints `OK` for every resource.

### Evidence

Command transcript from every step above; this scenario's frontmatter compared against SKILL.md's
live `INTENT_SIGNALS["PARALLEL_DETACHED"]` entry.

### Pass / Fail

- **Pass**: SKILL.md's `INTENT_SIGNALS["PARALLEL_DETACHED"]` and `RESOURCE_MAP["PARALLEL_DETACHED"]` entries match this scenario's frontmatter, and every resource path resolves.
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
| [SKILL.md](../../SKILL.md) | The `PARALLEL_DETACHED` entry in `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CO-H02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/holdout-background-fanout.md`
