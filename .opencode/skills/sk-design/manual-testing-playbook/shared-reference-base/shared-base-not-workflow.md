---
title: "SR-003: Shared Base Is Not a Workflow"
description: "Verify direct shared-base requests do not invoke shared/ as a user workflow."
version: 1.0.0.0
id: SR-003
expected_workflow_mode: UNKNOWN
stage: negative
expected_leaf_resources: []
---

# SR-003: Shared Base Is Not a Workflow

## 1. OVERVIEW

This scenario verifies that the shared reference base is not user-invoked as a mode. It is vocabulary and guidance cited by modes.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator names the shared base directly but provides no concrete design task.

**Exact prompt**:
```text
Use the shared design reference base as the workflow for this task.
```

**Expected mode resolution**: defer for clarification, or select a real mode only after the user provides a concrete interface, foundations, motion, audit, or md-generator task. It must not resolve `shared`.

**Why**:
- `SKILL.md` says the shared reference base itself is not a user workflow.
- `mode-registry.json` lists only five workflow modes: `interface`, `foundations`, `motion`, `audit`, and `md-generator`.
- `hub-router.json` `routerPolicy.outcomes.defer` says unclear or contradictory design intent asks for disambiguation.

**Expected packet loaded**:
- None, unless the orchestrator asks a clarification question and the user supplies a concrete mode.

**Expected shared resources loaded or cited**:
- The AI may cite `shared/anti-slop-principles.md`, `shared/cognitive-laws.md`, or `shared/design-token-vocabulary.md` as reference-base examples, but must not treat them as a workflow packet.

**Expected advisor behavior**: defer or low-confidence `sk-design`. If `sk-design` is invoked, the hub must not invent `workflowMode: shared`.

## 3. TEST EXECUTION

### Preconditions

1. `mode-registry.json` has no `workflowMode: shared`.
2. `SKILL.md` says the shared reference base itself is not a user workflow.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-SR003-advisor.txt`.
2. Invoke the orchestrator with the exact prompt only if advisor behavior allows.
3. Capture whether the AI asks for the concrete design task or incorrectly invents a shared workflow in `/tmp/skd-SR003-response.txt`.

### Pass/Fail Criteria

- **PASS** iff no `shared` workflow mode is invented, no shared folder is treated as a packet, and the AI asks for a concrete design task or maps the next concrete user clarification to one of the five registered modes.
- **FAIL** iff the AI reports `workflowMode: shared`, loads `shared/` as a standalone packet, or claims the shared base is user-invoked.

### Failure Triage

1. If `workflowMode: shared` appears, inspect mode resolution against `mode-registry.json`.
2. If shared resources are loaded as a packet, inspect `SKILL.md` `When NOT to Use` and `Backend` sections.
3. If the AI proceeds without a concrete task, inspect `hub-router.json` `routerPolicy.outcomes.defer`.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/shared/`

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run
