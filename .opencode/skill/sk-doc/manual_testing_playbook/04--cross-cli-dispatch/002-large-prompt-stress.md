---
id: SD-011
category: 04--cross-cli-dispatch
title: 'Large-prompt stress: cli-codex stdin-redirection mitigation'
expected_intent: SKILL_CREATION
expected_resources:
  - references/specific/skill_creation.md
  - assets/skill/skill_md_template.md
  - assets/skill/skill_reference_template.md
expected_token_range_input: 8000-12000
expected_token_range_output: 2000-3000
created: 2026-05-05
---

# SD-011: Large-Prompt Stress (cli-codex stall mitigation)

## Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
sk-doc: I need to create a new sk-skill named sk-graph-traversal that handles graph queries against the spec-kit memory database. Purpose: enable AI agents to discover spec-folder relationships, packet dependencies, and causal chains through structured graph queries. Audience: engineering agents working in OpenCode runtime. Intents the new skill must support: GRAPH_QUERY (read-only graph traversal), GRAPH_TRAVERSAL (multi-hop path resolution), GRAPH_INDEX (build/refresh index), GRAPH_HEALTH (diagnostic queries). Each intent should map to ~3 resource files. Acceptance criteria: SKILL.md with smart router pseudocode, references/ for query patterns, assets/ for query templates, scripts/ for index build automation. Existing reference snippets to cite: ~/MEGA/.../spec-kit-memory/mcp_server/lib/graph/graph-query.ts (current API), ~/MEGA/.../spec-kit-memory/lib/graph/types.ts (canonical types), ~/MEGA/.../system-spec-kit/scripts/spec/graph-validate.sh (existing validator). Output should include: SKILL.md scaffold, smart router INTENT_MODEL with weighted keywords, RESOURCE_MAP wiring 4 intents to 12 conditional resources, references/global/query_patterns.md outline, assets/skill/query_template.md outline, manual_testing_playbook scaffold for all 4 intents. Voice rules from sk-doc HVR apply. Run sk-doc to scaffold the entire package per the v2.2 template contract.
```

(~3000 chars; pushes past cli-codex's inline-prompt stall threshold; stdin-redirection mitigation MUST be exercised for codex variant)

## Expected Behavior

- **Intent picked**: `SKILL_CREATION` (resolves correctly even at scale)
- **Resources loaded**: skill-creation reference + both skill asset templates
- **Outcome**: CLI emits the full skill scaffold without truncation or stall. cli-codex MUST complete via `echo "$prompt" | codex exec -` (foreground + stdin), NOT inline arg.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: MUST use stdin redirection (`echo prompt | codex exec -`); inline-arg form WILL stall above ~2k chars.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: handles large inline prompts; record latency.

## Success Criteria

- intent_picked == `SKILL_CREATION` despite prompt size
- cli-codex completes within 2x baseline latency using stdin redirection
- false_positive_resource_load_count <= 1
- response is non-empty and references at least one of the expected_resources
