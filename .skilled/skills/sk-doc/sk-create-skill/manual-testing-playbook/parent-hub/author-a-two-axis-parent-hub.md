---
title: "SKL-004 -- Author a two-axis parent hub"
description: "This scenario validates parent-hub routing metadata for `SKL-004`. It focuses on one modes array, registry parity and workflow-first surface bundles."
version: 1.2.0.3
---

# SKL-004 -- Author a two-axis parent hub

This document captures the operator contract for `SKL-004`.

---

## 1. OVERVIEW

This scenario validates a parent hub with one workflow packet and one read-only surface packet. It checks the single `modes[]` registry, router signal parity, vocabulary ownership, workflow-first tie-break order and named-hub validation.

### Why This Matters

A parent hub has one advisor identity. Its registry is the source of packet membership. Its router selects the workflow and can attach surface evidence. A second registry array or an orphan signal makes the hub look structured while routing cannot resolve the packet set.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKL-004` and inspect the registry and router as one declaration.

- Objective: author a parent hub whose workflow and surface packet declarations remain in sync
- Realistic user request: `Create a parent hub with one workflow packet and one read-only evidence packet. Keep routing and packet registration consistent.`
- Prompt: `Create a parent hub with one workflow packet and one read-only evidence packet. Keep routing and packet registration consistent.`
- Expected execution process: select `create-skill-parent`, author one `modes[]` array with workflow and surface entries, declare `surface-axis`, author matching `routerSignals` and vocabulary classes, order workflow modes before surfaces and run the named parent-hub check.
- Expected signals: every registry mode has one router signal, every signal class exists, all router resources resolve, `surfaceBundle` appears only with a surface packet and the workflow mode is ordered first.
- Desired user-visible outcome: a parent hub with consistent packet registration and two-axis routing.
- Pass/fail: PASS if registry and router keys match bidirectionally and the named hub check passes. FAIL if a surface packet is placed in a second array, a signal is orphaned or a surface can outrank the workflow.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a parent hub with one workflow packet and one read-only evidence packet. Keep routing and packet registration consistent.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKL-004 | Author a two-axis parent hub | Author a parent hub whose workflow and surface packet declarations remain in sync | `Create a parent hub with one workflow packet and one read-only evidence packet. Keep routing and packet registration consistent.` | 1. `agent: Select create-skill-parent and read the parent-hub registry and router schemas` -> 2. `agent: Author one modes[] array with one workflow and one surface packet` -> 3. `agent: Author routerSignals, vocabularyClasses, surface-axis and workflow-first tieBreak` -> 4. `bash: node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/example-hub` -> 5. `agent: Compare registry workflowMode keys with routerSignals keys` | Step 1: parent workflow is selected. Step 2: both packet kinds are in one array. Step 3: the surface axis and workflow-first order are present. Step 4: the named hub check passes. Step 5: key sets match exactly | The exact prompt, schema notes, registry, router, vocabulary classes, named hub-check output and exit status and key comparison | PASS if the one-array registry and router are consistent and the named hub check passes. FAIL if an orphan signal, second packet array, unresolved resource or surface-first tie-break appears | 1. Read the named hub path in the check output. 2. Compare registry and router key sets in both directions. 3. Inspect `tieBreak` and `surfaceBundle` rules |

### Commands

1. `agent: Select create-skill-parent and read the parent-hub registry and router schemas`
2. `agent: Author one modes[] array with one workflow and one surface packet`
3. `agent: Author routerSignals, vocabularyClasses, surface-axis and workflow-first tieBreak`
4. `bash: node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/example-hub`
5. `agent: Compare registry workflowMode keys with routerSignals keys in both directions`

### Expected

Step 1 identifies the parent-hub path. Step 2 keeps every packet in one registry array. Step 3 creates the matching router declaration and makes the workflow primary. Step 4 validates the named hub. Step 5 confirms bidirectional key equality.

### Evidence

Capture the prompt, registry and router files, vocabulary classes, named hub-check output with exit status, resource paths and the key comparison.

### Pass / Fail

- **Pass**: one `modes[]` array covers both packet kinds, router signals match it, resources resolve and the workflow stays first.
- **Fail**: a second packet array exists, registry and router keys differ, a signal class is missing or the surface packet is primary.

### Failure Triage

1. Verify the parent check received the intended hub path.
2. Compare registry and router keys bidirectionally.
3. Check packet kind, resource paths, tie-break order and surface outcome rules.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Parent-hub creation workflow |
| [`references/parent-skill/parent-skills-nested-packets.md`](../../references/parent-skill/parent-skills-nested-packets.md) | One-array packet and parent identity rules |
| [`references/parent-skill/parent-hub-router-schema.md`](../../references/parent-skill/parent-hub-router-schema.md) | Registry and router parity rules |

---

## 5. SOURCE METADATA

- Group: PARENT HUB
- Playbook ID: SKL-004
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `parent-hub/author-a-two-axis-parent-hub.md`
