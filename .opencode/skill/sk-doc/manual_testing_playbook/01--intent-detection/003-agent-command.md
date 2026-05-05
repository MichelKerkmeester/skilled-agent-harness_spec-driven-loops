---
id: SD-003
category: 01--intent-detection
title: 'AGENT_COMMAND intent: author paired @agent and /create command'
expected_intent: AGENT_COMMAND
expected_resources:
  - references/specific/agent_creation.md
  - assets/agent_template.md
  - assets/command_template.md
expected_token_range_input: 1000-2500
expected_token_range_output: 1500-3000
created: 2026-05-05
---

# SD-003: AGENT_COMMAND Intent Detection

## Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Author a new @analyze agent and a paired /create:analyze command. Use our
standard agent and command templates and wire the command to dispatch the agent.
```

## Expected Behavior

- **Intent picked**: `AGENT_COMMAND`
- **Resources loaded**:
  - `references/specific/agent_creation.md`
  - `assets/agent_template.md`
  - `assets/command_template.md`
- **Outcome**: CLI loads agent-creation reference + both templates and produces two file scaffolds (`@analyze` agent definition and `/create:analyze` command) with the dispatch wiring described in `agent_creation.md`.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: dispatches in a single foreground turn; inlines both files.
- **cli-copilot (claude-opus-4.7)**: emits two complete file blocks; expect frontmatter on both.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: produces compact output; verify wiring stanza is present.

## Success Criteria

- intent_picked == `AGENT_COMMAND`
- false_positive_resource_load_count <= 1
- response is non-empty and references at least one of the expected_resources
