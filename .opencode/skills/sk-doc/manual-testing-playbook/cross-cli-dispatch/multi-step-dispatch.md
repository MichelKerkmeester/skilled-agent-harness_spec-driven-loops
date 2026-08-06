---
id: SD-012
title: 'Multi-step dispatch: 3 sequential sk-doc invocations'
description: "This scenario validates multi-step sk-doc dispatch stability for SD-012."
stage: routing
expected_intent: sk-create-skill → sk-create-quality-control → sk-create-changelog
expected_resources:
  - sk-create-skill/references/skill/creation-workflow.md
  - sk-create-skill/assets/skill/skill-md-template.md
  - sk-create-skill/assets/skill/skill-readme-template.md
  - sk-create-skill/assets/skill/skill-reference-template.md
  - shared/references/validation.md
  - sk-create-quality-control/references/workflows.md
  - shared/references/core-standards.md
  - shared/references/evergreen-packet-id-rule.md
  - shared/assets/changelog-template.md
expected_workflow_mode: sk-create-skill → sk-create-quality-control → sk-create-changelog
expected_leaf_resources:
  - workflow_mode: sk-create-skill
    leaf_resource_id: references/skill/creation-workflow.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-md-template.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-readme-template.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-reference-template.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/validation.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/workflows.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/core-standards.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/evergreen-packet-id-rule.md
  - workflow_mode: sk-create-changelog
    leaf_resource_id: assets/changelog-template.md
version: 1.8.0.8
---

# SD-012: Multi-Step Dispatch Stability

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-012`.

---

## 1. OVERVIEW

This scenario validates multi-step sk-doc dispatch stability for `SD-012`. It focuses on three sequential routing turns that should resolve to skill creation, document quality, and changelog generation in order.

### Why This Matters

Sequential dispatch can leak context from one turn into the next or reset too aggressively between invocations. This scenario catches order instability, stale resource carryover, and missing session context such as the skill name that later turns depend on.

---

---

## 2. SCENARIO CONTRACT

- Objective: Verify sk-doc routes the scenario to `SKILL_CREATION → DOC_QUALITY → CHANGELOG` with the expected resources.
- Real user request: `Trace routing for three sequential sk-doc turns: create sk-foo, add validation rules, then generate a v0.1.0 changelog.`
- Prompt: `Trace routing for three sequential sk-doc turns: create sk-foo, add validation rules, then generate a v0.1.0 changelog.`
- Expected signals: Intent resolves to `SKILL_CREATION → DOC_QUALITY → CHANGELOG`; loaded resources match `expected_resources`.
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.
- Pass/fail: PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Trace routing for three sequential sk-doc turns: create sk-foo, add validation rules, then generate a v0.1.0 changelog.`

### Commands

```text
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for EACH of the 3 inputs in sequence (pick from RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG)
2. Which references/ and assets/ files each invocation's intent would CONDITIONAL-load
3. Whether the router is expected to maintain session-context (e.g. skill name 'sk-foo' carried across turns) and how that affects intent stability

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Trace routing across all 3 turns sequentially in your response.

INPUTS TO ROUTE (3 turns, sequential):
Trace routing for three sequential sk-doc turns: create sk-foo, add validation rules, then generate a v0.1.0 changelog.
```

### Expected

Intent resolves to `SKILL_CREATION → DOC_QUALITY → CHANGELOG`; loaded resources match `expected_resources`.

### Evidence

CLI transcript with intent, resources, response shape, token counts where applicable.

### Pass / Fail

- **Pass**: PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output.
- **Fail**: wrong intent or empty output

### Failure Triage

Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt.

### Optional Supplemental Checks

**Expected Behavior**

- **Intents picked (in order)**: `SKILL_CREATION` → `DOC_QUALITY` (validation rules) → `CHANGELOG`
- **Resources loaded**: each invocation loads its intent's resources independently; no cross-contamination.
- **Outcome**: Router stays stable across the 3 dispatches. Session context (skill name `sk-foo`) is preserved across turns. Each output is correct for its intent and references the right resources.

**Cross-CLI Variants**

- **cli-opencode (gpt-5.5/high/fast)**: foreground 3-step; verify session-id reuse.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: session-scoped state; verify no stale resource bleed.

**Success Criteria**

- each turn's intent matches the expected order (SKILL_CREATION, DOC_QUALITY, CHANGELOG)
- no resources from a previous turn leak into the next turn's load set (false_positive_resource_load_count <= 1 per turn)
- final changelog entry references `sk-foo v0.1.0` (proves session-context persistence)


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

- Group: Cross Cli Dispatch
- Playbook ID: SD-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cross-cli-dispatch/multi-step-dispatch.md`

