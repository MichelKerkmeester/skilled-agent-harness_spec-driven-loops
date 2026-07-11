---
id: SD-001
category: intent-detection
title: 'DOC_QUALITY intent: validate documentation quality for a skill'
expected_intent: DOC_QUALITY
expected_resources:
  - references/validation.md
  - create-quality-control/references/workflows.md
  - references/core_standards.md
  - references/evergreen_packet_id_rule.md
expected_token_range_input: 1000-2500
expected_token_range_output: 800-2500
created: 2026-05-05
version: 1.8.0.5
---

# SD-001: DOC_QUALITY Intent Detection

## 1. OVERVIEW

This scenario validates DOC_QUALITY intent detection for `SD-001`. It focuses on routing a documentation-quality request to the expected global validation resources without executing file changes.

### Why This Matters

Documentation validation prompts are broad enough to overlap with creation or optimization workflows. This scenario catches router drift where a quality-audit request loads the wrong resource family, emits an empty trace, or starts changing files during what should be a read-only routing check.

---

## 2. SCENARIO CONTRACT

- Real user request: `Validate documentation quality for skill X and report which sections fail sk-doc standards.`
- Prompt: `Validate documentation quality for skill X and report which sections fail sk-doc standards.`
- Expected intent: `DOC_QUALITY`
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-001 | DOC_QUALITY intent: validate documentation quality for a skill | Verify sk-doc routes the scenario to `DOC_QUALITY` with the expected resources. | `Validate documentation quality for skill X and report which sections fail sk-doc standards.` | Run the setup block below against sk-doc and capture the routing trace. | Intent resolves to `DOC_QUALITY`; loaded resources match `expected_resources`. | CLI transcript with intent, resources, response shape, token counts where applicable. | PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output. | Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt. |


### Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Validate documentation quality for skill X and report which sections fail sk-doc standards.
```

## Expected Behavior

- **Intent picked**: `DOC_QUALITY`
- **Resources loaded**:
  - `references/validation.md`
  - `create-quality-control/references/workflows.md`
  - `references/core_standards.md`
  - `references/evergreen_packet_id_rule.md`
- **Outcome**: CLI loads only the four global references above and produces a non-empty validation-style response (DQI checklist or per-section findings) referencing at least one of those resources.

## Cross-CLI Variants

- **cli-opencode (gpt-5.5/high/fast)**: short prompt fits inline; default foreground dispatch is fine.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: invoke directly; expect concise structured output.

## Success Criteria

- intent_picked == `DOC_QUALITY`
- false_positive_resource_load_count <= 1
- response is non-empty and references at least one of the expected_resources

## 4. SOURCE METADATA

- Group: Intent Detection
- Playbook ID: SD-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `intent-detection/create-quality-control.md`
