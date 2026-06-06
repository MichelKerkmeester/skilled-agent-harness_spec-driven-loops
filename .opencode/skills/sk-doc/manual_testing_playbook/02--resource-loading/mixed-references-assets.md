---
id: SD-006
category: 02--resource-loading
title: 'README_CREATION intent loads mixed references + assets'
expected_intent: README_CREATION
expected_resources:
  - references/readme_creation.md
  - assets/readme/readme_template.md
expected_token_range_input: 1000-2500
expected_token_range_output: 1500-3000
created: 2026-05-05
---

# SD-006: Mixed References + Assets Resource Loading (README)

## 1. OVERVIEW

This scenario validates README_CREATION mixed resource loading for `SD-006`. It focuses on routing a package README request to both creation guidance and the README template.

### Why This Matters

README creation needs process guidance and a concrete scaffold; either one alone produces a weaker result. This scenario catches partial loads where the router includes only the template or only the reference workflow, which would hide required sections such as configuration and security caveats.

---

## 2. SCENARIO CONTRACT

- Real user request: `Create a README for packages/auth/ covering purpose, install, usage, configuration, and security caveats.`
- Prompt: `Create a README for packages/auth/ covering purpose, install, usage, configuration, and security caveats.`
- Expected intent: `README_CREATION`
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-006 | README_CREATION intent loads mixed references + assets | Verify sk-doc routes the scenario to `README_CREATION` with the expected resources. | `Create a README for packages/auth/ covering purpose, install, usage, configuration, and security caveats.` | Run the setup block below against sk-doc and capture the routing trace. | Intent resolves to `README_CREATION`; loaded resources match `expected_resources`. | CLI transcript with intent, resources, response shape, token counts where applicable. | PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output. | Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt. |


### Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Create a README for packages/auth/ covering purpose, install, usage, configuration, and security caveats.
```

## Expected Behavior

- **Intent picked**: `README_CREATION`
- **Resources loaded**:
  - `references/readme_creation.md` (guidance)
  - `assets/readme/readme_template.md` (scaffold)
- **Outcome**: CLI loads both resources and emits a `README.md` that follows the template's section order and applies the guidance from `readme_creation.md`.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: foreground OK; produces filled scaffold inline.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: compact README; verify section completeness.

## Success Criteria

- intent_picked == `README_CREATION`
- false_positive_resource_load_count <= 1
- response is non-empty and references both expected_resources (template structure + guidance)

## 4. SOURCE METADATA

- Group: Resource Loading
- Playbook ID: SD-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--resource-loading/mixed-references-assets.md`
