---
id: CO-R01
category: intra_routing_recall
stage: routing
title: 'External dispatch routing'
description: "This scenario validates the hub's EXTERNAL_DISPATCH intent-routing contract for CO-R01. It confirms the keyword-bearing prompt resolves EXTERNAL_DISPATCH at the documented INTENT_SIGNALS weight and that RESOURCE_MAP bundles the expected resource set."
expected_intent: EXTERNAL_DISPATCH
expected_resources: 
  - references/cli-reference.md
  - references/integration-patterns.md
version: 1.0.0.0
---

# CO-R01: External dispatch routing

This document captures the routing-recall contract, execution process, source anchors, and metadata for `CO-R01`.

---

## 1. OVERVIEW

This scenario validates the hub's `EXTERNAL_DISPATCH` intent-routing contract for `CO-R01`. It focuses on confirming the prompt's matching router keywords resolve `EXTERNAL_DISPATCH` at the documented `INTENT_SIGNALS` weight, and that `RESOURCE_MAP["EXTERNAL_DISPATCH"]` bundles `references/cli-reference.md` and `references/integration-patterns.md`.

### Why This Matters

Routing recall scenarios are how this playbook proves the hub's smart router actually resolves the
documented `INTENT_SIGNALS`/`RESOURCE_MAP` contract in SKILL.md, rather than assuming the router
matches its own documentation. A drift here means an operator prompt silently loads the wrong
reference set or none at all.

---

## 2. SCENARIO CONTRACT

- Objective: confirm SKILL.md's `INTENT_SIGNALS["EXTERNAL_DISPATCH"]` entry matches this scenario's expected_intent, and RESOURCE_MAP["EXTERNAL_DISPATCH"] resolves on disk.
- Stage: `routing`
- Prompt: `Kick off an opencode run for this whole task on the full plugin runtime so it executes end to end.`

**Exact prompt**:
```text
Kick off an opencode run for this whole task on the full plugin runtime so it executes end to end.
```

- Expected execution process: the hub scores the prompt against every `INTENT_SIGNALS` keyword list and resolves `EXTERNAL_DISPATCH` at its documented weight, then conditional-loads `RESOURCE_MAP["EXTERNAL_DISPATCH"]`.
- Expected signals: SKILL.md's `INTENT_SIGNALS["EXTERNAL_DISPATCH"]` entry exists with its documented weight and keyword list, and `RESOURCE_MAP["EXTERNAL_DISPATCH"]` names `references/cli-reference.md` and `references/integration-patterns.md`; both resource paths resolve on disk.
- Desired user-visible outcome: the bundled workflow states plainly which intent this prompt resolves and which resources it loaded, before any downstream execution happens.
- Pass/fail: PASS if SKILL.md's `INTENT_SIGNALS["EXTERNAL_DISPATCH"]` and `RESOURCE_MAP["EXTERNAL_DISPATCH"]` entries match this scenario's frontmatter and both resource paths exist; FAIL if either entry has drifted from this scenario's frontmatter, or a resource path does not resolve.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Kick off an opencode run for this whole task on the full plugin runtime so it executes end to end.`

### Commands

1. `sed -n '1,15p' .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/intra-routing-recall/external-dispatch.md`
2. `grep -n '"EXTERNAL_DISPATCH"' ../../SKILL.md` (confirms the `INTENT_SIGNALS` entry)
3. `grep -A2 'RESOURCE_MAP = {' ../../SKILL.md | grep '"EXTERNAL_DISPATCH"'` (confirms the `RESOURCE_MAP` entry)
4. `test -e .opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md && echo "OK references/cli-reference.md" || echo "MISS references/cli-reference.md"`
5. `test -e .opencode/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md && echo "OK references/integration-patterns.md" || echo "MISS references/integration-patterns.md"`

### Expected

Step 1 shows `expected_intent: EXTERNAL_DISPATCH`. Step 2's output names the `EXTERNAL_DISPATCH` keyword list and weight. Step 3 shows `RESOURCE_MAP["EXTERNAL_DISPATCH"]` naming `references/cli-reference.md` and `references/integration-patterns.md`. Step 4 prints `OK` for every resource.

### Evidence

Command transcript from every step above; this scenario's frontmatter compared against SKILL.md's
live `INTENT_SIGNALS["EXTERNAL_DISPATCH"]` entry.

### Pass / Fail

- **Pass**: SKILL.md's `INTENT_SIGNALS["EXTERNAL_DISPATCH"]` and `RESOURCE_MAP["EXTERNAL_DISPATCH"]` entries match this scenario's frontmatter, and every resource path resolves.
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
| [SKILL.md](../../SKILL.md) | The `EXTERNAL_DISPATCH` entry in `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario verifies |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: CO-R01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/external-dispatch.md`
