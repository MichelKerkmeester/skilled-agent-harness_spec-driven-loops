---
id: SD-010
title: 'Short-prompt baseline: CHANGELOG intent across all 3 CLIs'
description: "This scenario validates CHANGELOG routing across CLI dispatch paths for SD-010."
stage: routing
expected_intent: sk-create-changelog
expected_resources:
  - shared/assets/changelog-template.md
expected_workflow_mode: sk-create-changelog
expected_leaf_resources:
  - workflow_mode: sk-create-changelog
    leaf_resource_id: assets/changelog-template.md
version: 1.8.0.8
---

# SD-010: Short-Prompt Baseline (CHANGELOG)

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-010`.

---

## 1. OVERVIEW

This scenario validates CHANGELOG routing across CLI dispatch paths for `SD-010`. It focuses on a short release-notes prompt that should load changelog guidance and template resources consistently.

### Why This Matters

Short prompts leave little context for the router, so keyword weighting has to do the work. This scenario catches cross-CLI divergence where one runtime misses the changelog intent, loads generic documentation resources, or returns an output shape that cannot support release-note sections.

---

---

## 2. SCENARIO CONTRACT

- Objective: Verify sk-doc routes the scenario to `CHANGELOG` with the expected resources.
- Real user request: `Draft a v2.3.0 changelog with added, changed, fixed, and removed sections.`
- Prompt: `Draft a v2.3.0 changelog with added, changed, fixed, and removed sections.`
- Expected signals: Intent resolves to `CHANGELOG`; loaded resources match `expected_resources`.
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.
- Pass/fail: PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Draft a v2.3.0 changelog with added, changed, fixed, and removed sections.`

### Commands

```text
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Draft a v2.3.0 changelog with added, changed, fixed, and removed sections.
```

### Expected

Intent resolves to `CHANGELOG`; loaded resources match `expected_resources`.

### Evidence

CLI transcript with intent, resources, response shape, token counts where applicable.

### Pass / Fail

- **Pass**: PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output.
- **Fail**: wrong intent or empty output

### Failure Triage

Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt.

### Optional Supplemental Checks

**Expected Behavior**

- **Intent picked**: `CHANGELOG`
- **Resources loaded**:
  - `assets/changelog-template.md`
- **Outcome**: CLI emits a populated changelog skeleton for v2.3.0 with the four standard sections, citing the template.

**Cross-CLI Variants**

- **cli-opencode (gpt-5.5/high/fast)**: foreground baseline; record dispatch latency.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: foreground baseline; record latency.

**Success Criteria**

- intent_picked == `CHANGELOG`
- false_positive_resource_load_count <= 1
- response is non-empty and follows Keep-a-Changelog section structure
- per-CLI latency recorded as the BASELINE for SD-011 (large-prompt) and SD-012 (multi-step) comparisons


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
- Playbook ID: SD-010
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cross-cli-dispatch/short-prompt-baseline.md`

