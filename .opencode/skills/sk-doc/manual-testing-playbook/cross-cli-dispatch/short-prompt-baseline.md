---
id: SD-010
category: cross_cli_dispatch
title: 'Short-prompt baseline: CHANGELOG intent across all 3 CLIs'
expected_intent: create-changelog
expected_resources:
  - shared/assets/changelog-template.md
expected_workflow_mode: create-changelog
expected_leaf_resources:
  - workflow_mode: create-changelog
    leaf_resource_id: assets/changelog-template.md
expected_token_range_input: 200-800
expected_token_range_output: 800-2000
created: 2026-05-05
version: 1.8.0.8
---

# SD-010: Short-Prompt Baseline (CHANGELOG)

## 1. OVERVIEW

This scenario validates CHANGELOG routing across CLI dispatch paths for `SD-010`. It focuses on a short release-notes prompt that should load changelog guidance and template resources consistently.

### Why This Matters

Short prompts leave little context for the router, so keyword weighting has to do the work. This scenario catches cross-CLI divergence where one runtime misses the changelog intent, loads generic documentation resources, or returns an output shape that cannot support release-note sections.

---

## 2. SCENARIO CONTRACT

- Real user request: `Draft a v2.3.0 changelog with added, changed, fixed, and removed sections.`
- Prompt: `Draft a v2.3.0 changelog with added, changed, fixed, and removed sections.`
- Expected intent: `CHANGELOG`
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-010 | Short-prompt baseline: CHANGELOG intent across all 3 CLIs | Verify sk-doc routes the scenario to `CHANGELOG` with the expected resources. | `Draft a v2.3.0 changelog with added, changed, fixed, and removed sections.` | Run the setup block below against sk-doc and capture the routing trace. | Intent resolves to `CHANGELOG`; loaded resources match `expected_resources`. | CLI transcript with intent, resources, response shape, token counts where applicable. | PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output. | Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt. |


### Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Draft a v2.3.0 changelog with added, changed, fixed, and removed sections.
```

(~200 chars; baseline-latency probe)

## Expected Behavior

- **Intent picked**: `CHANGELOG`
- **Resources loaded**:
  - `assets/changelog-template.md`
- **Outcome**: CLI emits a populated changelog skeleton for v2.3.0 with the four standard sections, citing the template.

## Cross-CLI Variants

- **cli-opencode (gpt-5.5/high/fast)**: foreground baseline; record dispatch latency.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: foreground baseline; record latency.

## Success Criteria

- intent_picked == `CHANGELOG`
- false_positive_resource_load_count <= 1
- response is non-empty and follows Keep-a-Changelog section structure
- per-CLI latency recorded as the BASELINE for SD-011 (large-prompt) and SD-012 (multi-step) comparisons

## 4. SOURCE METADATA

- Group: Cross-CLI Dispatch
- Playbook ID: SD-010
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cross-cli-dispatch/short-prompt-baseline.md`
