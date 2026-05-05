---
id: SD-017
category: 01--intent-detection
title: 'INSTALL_GUIDE intent: scaffold an install guide for a new MCP server'
expected_intent: INSTALL_GUIDE
expected_resources:
  - assets/documentation/install_guide_template.md
  - references/specific/install_guide_creation.md
expected_token_range_input: 800-2500
expected_token_range_output: 1500-3500
created: 2026-05-05
---

# SD-017: INSTALL_GUIDE Intent Detection

## Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Create an install guide for the new MCP-Postgres server we're shipping. Cover prerequisites (Node 18+, PostgreSQL 14+), installation via npm + global config wiring, environment-variable configuration (DB_URL, DB_SSL_MODE), verification steps (smoke query + readiness probe), and a troubleshooting section. Follow the standard sk-doc install-guide template structure.
```

## Expected Behavior

- **Intent picked**: `INSTALL_GUIDE`
- **Resources loaded**:
  - `assets/documentation/install_guide_template.md`
  - `references/specific/install_guide_creation.md`
- **Outcome**: CLI loads only the two install-guide-specific resources and produces a structured response describing the install-guide section layout (prerequisites, install, configuration, verification, troubleshooting).

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: medium prompt; expect concise structured output with both resource paths and a section outline.
- **cli-copilot (claude-opus-4.7)**: invoke directly; expect verbose section breakdown — verify no hallucinated "install_rubric.md" or similar fabricated paths.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: invoke directly; expect concise output with both resource paths.

## Success Criteria

- intent_picked == `INSTALL_GUIDE`
- false_positive_resource_load_count <= 1
- response is non-empty and references at least one of the expected_resources
- response mentions canonical install-guide sections (prerequisites, configuration, verification, troubleshooting) — validates intent semantics
