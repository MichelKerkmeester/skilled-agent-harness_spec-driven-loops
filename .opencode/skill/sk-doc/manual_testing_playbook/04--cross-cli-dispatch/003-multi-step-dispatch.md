---
id: SD-012
category: 04--cross-cli-dispatch
title: 'Multi-step dispatch: 3 sequential sk-doc invocations'
expected_intent: SKILL_CREATION → DOC_QUALITY → CHANGELOG
expected_resources:
  - references/specific/skill_creation.md
  - assets/skill/skill_md_template.md
  - references/global/validation.md
  - references/global/core_standards.md
  - references/specific/changelog.md
  - assets/documentation/changelog_template.md
expected_token_range_input: 2000-5000
expected_token_range_output: 3000-6000
created: 2026-05-05
---

# SD-012: Multi-Step Dispatch Stability

## Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for EACH of the 3 inputs in sequence (pick from RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG)
2. Which references/ and assets/ files each invocation's intent would CONDITIONAL-load
3. Whether the router is expected to maintain session-context (e.g. skill name 'sk-foo' carried across turns) and how that affects intent stability

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Trace routing across all 3 turns sequentially in your response.

INPUTS TO ROUTE (3 turns, sequential):
Turn 1: Create a sk-skill named sk-foo with two intents: search and index.
Turn 2: Add validation rules to sk-foo: every reference must have a frontmatter id.
Turn 3: Generate a changelog entry for sk-foo v0.1.0.
```

## Expected Behavior

- **Intents picked (in order)**: `SKILL_CREATION` → `DOC_QUALITY` (validation rules) → `CHANGELOG`
- **Resources loaded**: each invocation loads its intent's resources independently; no cross-contamination.
- **Outcome**: Router stays stable across the 3 dispatches. Session context (skill name `sk-foo`) is preserved across turns. Each output is correct for its intent and references the right resources.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: foreground 3-step; verify session-id reuse.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: session-scoped state; verify no stale resource bleed.

## Success Criteria

- each turn's intent matches the expected order (SKILL_CREATION, DOC_QUALITY, CHANGELOG)
- no resources from a previous turn leak into the next turn's load set (false_positive_resource_load_count <= 1 per turn)
- final changelog entry references `sk-foo v0.1.0` (proves session-context persistence)
