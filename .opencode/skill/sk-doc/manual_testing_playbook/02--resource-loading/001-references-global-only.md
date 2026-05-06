---
id: SD-004
category: 02--resource-loading
title: 'HVR intent loads only references/global/hvr_rules.md'
expected_intent: HVR
expected_resources:
  - references/global/hvr_rules.md
expected_token_range_input: 1000-2000
expected_token_range_output: 800-2000
created: 2026-05-05
---

# SD-004: References-Only Resource Loading (HVR)

## Setup

```
DO NOT execute the work below. INSTEAD describe (in your response):
1. Which sk-doc intent the router would select for the input (pick from the 11-intent RESOURCE_MAP: DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG; or UNKNOWN_FALLBACK if no keywords match)
2. Which references/ and assets/ files would be CONDITIONAL-loaded for that intent
3. The response shape sk-doc would return (~3-5 lines describing structure, not actual content)

DO NOT create files, modify any existing files, run /create:* commands, or scaffold skill/agent/command output. Treat this as a routing-trace test only.

INPUT TO ROUTE:
Apply HVR voice rules to the existing implementation-summary.md in
specs/123-example/. Tighten passive voice and rewrite to active high-value
voice; do not change semantics.
```

## Expected Behavior

- **Intent picked**: `HVR`
- **Resources loaded**:
  - `references/global/hvr_rules.md` ONLY
- **Outcome**: CLI loads exactly one reference and emits a rewritten document (or diff) that demonstrably applies HVR voice rules. NO `assets/` resources are loaded.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: foreground OK; codex applies voice rewrites cleanly.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: compact diff output; verify rule citations.

## Success Criteria

- intent_picked == `HVR`
- false_positive_resource_load_count <= 1 (no assets/* loaded)
- response is non-empty and references `references/global/hvr_rules.md`
