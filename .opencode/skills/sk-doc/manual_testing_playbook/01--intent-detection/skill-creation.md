---
id: SD-002
category: 01--intent-detection
title: 'SKILL_CREATION intent: author a new sk-skill'
expected_intent: SKILL_CREATION
expected_resources:
  - references/skill_creation.md
  - assets/skill/skill_md_template.md
  - assets/skill/skill_readme_template.md
  - assets/skill/skill_reference_template.md
expected_token_range_input: 1000-2500
expected_token_range_output: 1500-3000
created: 2026-05-05
version: 1.8.0.6
---

# SD-002: SKILL_CREATION Intent Detection

## 1. OVERVIEW

This scenario validates SKILL_CREATION intent detection for `SD-002`. It focuses on routing a new-skill scaffolding request to the skill-creation guide and starter templates without creating files.

### Why This Matters

Skill creation prompts can look like generic documentation work if the router underweights scaffold language. This scenario catches failures where the assistant misses the skill-specific resources, omits template guidance, or begins generating artifacts during a trace-only test.

---

## 2. SCENARIO CONTRACT

- Real user request: `Help me create a graph-rag sk-skill with SKILL.md and starter reference scaffolds.`
- Prompt: `Help me create a graph-rag sk-skill with SKILL.md and starter reference scaffolds.`
- Expected intent: `SKILL_CREATION`
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-002 | SKILL_CREATION intent: author a new sk-skill | Verify sk-doc routes the scenario to `SKILL_CREATION` with the expected resources. | `Help me create a graph-rag sk-skill with SKILL.md and starter reference scaffolds.` | Run the setup block below against sk-doc and capture the routing trace. | Intent resolves to `SKILL_CREATION`; loaded resources match `expected_resources`. | CLI transcript with intent, resources, response shape, token counts where applicable. | PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output. | Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt. |


### Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Help me create a graph-rag sk-skill with SKILL.md and starter reference scaffolds.
```

## Expected Behavior

- **Intent picked**: `SKILL_CREATION`
- **Resources loaded**:
  - `references/skill_creation.md`
  - `assets/skill/skill_md_template.md`
  - `assets/skill/skill_readme_template.md`
  - `assets/skill/skill_reference_template.md`
- **Outcome**: CLI loads the skill-creation reference plus the SKILL.md, skill README and reference templates, then produces a populated `SKILL.md` skeleton, optional README skeleton and reference-doc skeleton citing the loaded templates.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: foreground OK; codex tends to inline both templates verbatim.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: may shorten template prose; verify both files still emitted.

## Success Criteria

- intent_picked == `SKILL_CREATION`
- false_positive_resource_load_count <= 1
- response is non-empty and references at least one of the expected_resources

## 4. SOURCE METADATA

- Group: Intent Detection
- Playbook ID: SD-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--intent-detection/skill-creation.md`
