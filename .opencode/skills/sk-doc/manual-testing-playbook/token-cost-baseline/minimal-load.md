---
id: SD-013
title: 'Floor token cost: minimal-keyword query, 1 reference load'
description: "This scenario validates minimal-load HVR token-cost behavior for SD-013."
stage: routing
expected_intent: sk-create-quality-control
expected_resources:
  - shared/references/hvr-rules.md
expected_workflow_mode: sk-create-quality-control
expected_leaf_resources:
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/hvr-rules.md
version: 1.8.0.6
---

# SD-013: Minimal-Load Token Cost (Floor)

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-013`.

---

## 1. OVERVIEW

This scenario validates minimal-load HVR token-cost behavior for `SD-013`. It focuses on a tiny voice-rule prompt that should load one reference and establish the routing floor.

### Why This Matters

Small prompts are where unnecessary resources are easiest to see and most expensive relative to the task. This scenario catches accidental load-all behavior, asset leakage, and oversized responses that would make low-cost style fixes inefficient.

---

---

## 2. SCENARIO CONTRACT

- Objective: Verify sk-doc routes the scenario to `HVR` with the expected resources.
- Real user request: `Apply HVR to this sentence: The system was designed by us to be modular.`
- Prompt: `Apply HVR to this sentence: The system was designed by us to be modular.`
- Expected signals: Intent resolves to `HVR`; loaded resources match `expected_resources`.
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.
- Pass/fail: PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Apply HVR to this sentence: The system was designed by us to be modular.`

### Commands

```text
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Apply HVR to this sentence: The system was designed by us to be modular.
```

### Expected

Intent resolves to `HVR`; loaded resources match `expected_resources`.

### Evidence

CLI transcript with intent, resources, response shape, token counts where applicable.

### Pass / Fail

- **Pass**: PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output.
- **Fail**: wrong intent or empty output

### Failure Triage

Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt.

### Optional Supplemental Checks

**Expected Behavior**

- **Intent picked**: `HVR`
- **Resources loaded**: `references/hvr-rules.md` only (1 reference + DEFAULT_RESOURCE).
- **Outcome**: CLI rewrites the single sentence in HVR voice and emits minimal supporting output. This establishes the FLOOR token cost per CLI.

**Cross-CLI Variants**

- **cli-opencode (gpt-5.5/high/fast)**: record input/output token counts as floor baseline.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: record input/output token counts as floor baseline.

**Success Criteria**

- intent_picked == `HVR`
- only 1 RESOURCE_MAP resource loaded (+ DEFAULT_RESOURCE)
- per-CLI floor token cost recorded as BASELINE for SD-014 (medium) and SD-015 (max)


---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | The sk-doc router under test |
| `../../sk-create-skill/scripts/validate-playbook-topology.cjs` | Routing-gold contract gate |

---

## 5. SOURCE METADATA

- Group: Token Cost Baseline
- Playbook ID: SD-013
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `token-cost-baseline/minimal-load.md`

