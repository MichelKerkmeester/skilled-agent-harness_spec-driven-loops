---
id: SD-006
category: 02--resource-loading
title: 'README_CREATION intent loads mixed references + assets'
expected_intent: README_CREATION
expected_resources:
  - references/specific/readme_creation.md
  - assets/documentation/readme_template.md
expected_token_range_input: 1000-2500
expected_token_range_output: 1500-3000
created: 2026-05-05
---

# SD-006: Mixed References + Assets Resource Loading (README)

## Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Create a README for the new auth subsystem under packages/auth/. Cover
purpose, install, usage, configuration, and security caveats.
```

## Expected Behavior

- **Intent picked**: `README_CREATION`
- **Resources loaded**:
  - `references/specific/readme_creation.md` (guidance)
  - `assets/documentation/readme_template.md` (scaffold)
- **Outcome**: CLI loads both resources and emits a `README.md` that follows the template's section order and applies the guidance from `readme_creation.md`.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: foreground OK; produces filled scaffold inline.
- **cli-copilot (claude-opus-4.7)**: emits a complete README with all required sections.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: compact README; verify section completeness.

## Success Criteria

- intent_picked == `README_CREATION`
- false_positive_resource_load_count <= 1
- response is non-empty and references both expected_resources (template structure + guidance)
