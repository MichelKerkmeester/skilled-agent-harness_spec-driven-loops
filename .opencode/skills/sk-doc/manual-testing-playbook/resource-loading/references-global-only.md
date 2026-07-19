---
id: SD-004
category: resource_loading
title: 'HVR intent loads only references/hvr-rules.md'
expected_intent: create-quality-control
expected_resources:
  - shared/references/hvr-rules.md
expected_workflow_mode: create-quality-control
expected_leaf_resources:
  - workflow_mode: create-quality-control
    leaf_resource_id: references/hvr-rules.md
expected_token_range_input: 1000-2000
expected_token_range_output: 800-2000
created: 2026-05-05
version: 1.8.0.6
---

# SD-004: References-Only Resource Loading (HVR)

## 1. OVERVIEW

This scenario validates HVR references-only resource loading for `SD-004`. It focuses on routing a voice-rule edit request to `references/hvr-rules.md` without loading unrelated templates or assets.

### Why This Matters

HVR requests should stay narrow because voice rewrites do not need creation scaffolds, flowchart assets, or install templates. This scenario catches token bloat and false-positive resource loading that would make the router less predictable for small style-only tasks.

---

## 2. SCENARIO CONTRACT

- Real user request: `Apply HVR voice rules to specs/123-example/implementation-summary.md without changing semantics.`
- Prompt: `Apply HVR voice rules to specs/123-example/implementation-summary.md without changing semantics.`
- Expected intent: `HVR`
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-004 | HVR intent loads only references/hvr-rules.md | Verify sk-doc routes the scenario to `HVR` with the expected resources. | `Apply HVR voice rules to specs/123-example/implementation-summary.md without changing semantics.` | Run the setup block below against sk-doc and capture the routing trace. | Intent resolves to `HVR`; loaded resources match `expected_resources`. | CLI transcript with intent, resources, response shape, token counts where applicable. | PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output. | Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt. |


### Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Apply HVR voice rules to specs/123-example/implementation-summary.md without changing semantics.
```

## Expected Behavior

- **Intent picked**: `HVR`
- **Resources loaded**:
  - `references/hvr-rules.md` ONLY
- **Outcome**: CLI loads exactly one reference and emits a rewritten document (or diff) that demonstrably applies HVR voice rules. NO `assets/` resources are loaded.

## Cross-CLI Variants

- **cli-opencode (gpt-5.5/high/fast)**: foreground OK; opencode applies voice rewrites cleanly.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: compact diff output; verify rule citations.

## Success Criteria

- intent_picked == `HVR`
- false_positive_resource_load_count <= 1 (no assets/* loaded)
- response is non-empty and references `references/hvr-rules.md`

## 4. SOURCE METADATA

- Group: Resource Loading
- Playbook ID: SD-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `resource-loading/references-global-only.md`
