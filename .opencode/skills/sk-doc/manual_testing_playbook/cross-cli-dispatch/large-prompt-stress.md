---
id: SD-011
category: cross-cli-dispatch
title: 'Large-prompt stress: cli-opencode stdin-redirection mitigation'
expected_intent: SKILL_CREATION
expected_resources:
  - references/skill_creation.md
  - assets/skill/skill_md_template.md
  - assets/skill/skill_readme_template.md
  - assets/skill/skill_reference_template.md
expected_token_range_input: 8000-12000
expected_token_range_output: 2000-3000
created: 2026-05-05
version: 1.8.0.7
---

# SD-011: Large-Prompt Stress (cli-opencode stall mitigation)

## 1. OVERVIEW

This scenario validates large-prompt SKILL_CREATION dispatch for `SD-011`. It focuses on keeping cli-opencode routing stable when the skill-creation request is long enough to require stdin-redirection mitigation.

### Why This Matters

Large prompts can stall dispatchers, truncate resource traces, or bury the actual intent under implementation details. This scenario catches failures where the CLI wrapper loses the prompt, misses the skill-creation resources, or reports an incomplete trace for a stress-sized request.

---

## 2. SCENARIO CONTRACT

- Real user request: `sk-doc: create a new sk-skill named sk-graph-traversal for graph queries against the spec-kit memory database; include GRAPH_QUERY, GRAPH_TRAVERSAL, GRAPH_INDEX, and GRAPH_HEALTH intents with about three resources each, SKILL.md smart-router pseudocode, RESOURCE_MAP wiring, references/query_patterns.md outline, assets/skill/query_template.md outline, scripts for index automation, manual_testing_playbook coverage for all four intents, and cite the current graph API, canonical graph types, and graph validator snippets.`
- Prompt: `sk-doc: create a new sk-skill named sk-graph-traversal for graph queries against the spec-kit memory database; include GRAPH_QUERY, GRAPH_TRAVERSAL, GRAPH_INDEX, and GRAPH_HEALTH intents with about three resources each, SKILL.md smart-router pseudocode, RESOURCE_MAP wiring, references/query_patterns.md outline, assets/skill/query_template.md outline, scripts for index automation, manual_testing_playbook coverage for all four intents, and cite the current graph API, canonical graph types, and graph validator snippets.`
- Expected intent: `SKILL_CREATION`
- Desired user-visible outcome: The router trace identifies the expected intent, loaded resources, and response shape without executing file changes.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SD-011 | Large-prompt stress: cli-opencode stdin-redirection mitigation | Verify sk-doc routes the scenario to `SKILL_CREATION` with the expected resources. | `sk-doc: create a new sk-skill named sk-graph-traversal for graph queries against the spec-kit memory database; include GRAPH_QUERY, GRAPH_TRAVERSAL, GRAPH_INDEX, and GRAPH_HEALTH intents with about three resources each, SKILL.md smart-router pseudocode, RESOURCE_MAP wiring, references/query_patterns.md outline, assets/skill/query_template.md outline, scripts for index automation, manual_testing_playbook coverage for all four intents, and cite the current graph API, canonical graph types, and graph validator snippets.` | Run the setup block below against sk-doc and capture the routing trace. | Intent resolves to `SKILL_CREATION`; loaded resources match `expected_resources`. | CLI transcript with intent, resources, response shape, token counts where applicable. | PASS when intent/resources/output match the scenario criteria; PARTIAL for tolerated extra resources; FAIL for wrong intent or empty output. | Re-read `SKILL.md` smart-router RESOURCE_MAP and intent keywords, then compare against the routed prompt. |


### Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
sk-doc: create a new sk-skill named sk-graph-traversal for graph queries against the spec-kit memory database; include GRAPH_QUERY, GRAPH_TRAVERSAL, GRAPH_INDEX, and GRAPH_HEALTH intents with about three resources each, SKILL.md smart-router pseudocode, RESOURCE_MAP wiring, references/query_patterns.md outline, assets/skill/query_template.md outline, scripts for index automation, manual_testing_playbook coverage for all four intents, and cite the current graph API, canonical graph types, and graph validator snippets.
```

(~3000 chars; pushes past cli-opencode's inline-prompt stall threshold; stdin-redirection mitigation MUST be exercised for opencode variant)

## Expected Behavior

- **Intent picked**: `SKILL_CREATION` (resolves correctly even at scale)
- **Resources loaded**: skill-creation reference + SKILL.md, skill README and reference templates
- **Outcome**: CLI emits the full skill scaffold without truncation or stall. cli-opencode MUST complete via `echo "$prompt" | opencode run -` (foreground + stdin), NOT inline arg.

## Cross-CLI Variants

- **cli-opencode (gpt-5.5/high/fast)**: MUST use stdin redirection (`echo prompt | opencode run -`); inline-arg form WILL stall above ~2k chars.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: handles large inline prompts; record latency.

## Success Criteria

- intent_picked == `SKILL_CREATION` despite prompt size
- cli-opencode completes within 2x baseline latency using stdin redirection
- false_positive_resource_load_count <= 1
- response is non-empty and references at least one of the expected_resources

## 4. SOURCE METADATA

- Group: Cross-CLI Dispatch
- Playbook ID: SD-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `cross-cli-dispatch/large-prompt-stress.md`
