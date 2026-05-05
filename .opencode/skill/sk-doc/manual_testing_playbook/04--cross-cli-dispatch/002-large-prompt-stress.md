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

A ~3000-char prompt embedding an entire user request plus the sk-doc invocation. The prompt should include:

- Full skill creation context (purpose, audience, intents, resources)
- Existing reference snippets the new skill must cite
- Acceptance criteria block
- Explicit `sk-doc:` invocation as the final line

The exact length must push past cli-codex's inline-prompt stall threshold (~2k chars empirically) so the stdin-redirection mitigation MUST be exercised for the codex variant.

## Expected Behavior

- **Intent picked**: `SKILL_CREATION` (resolves correctly even at scale)
- **Resources loaded**: skill-creation reference + both skill asset templates
- **Outcome**: CLI emits the full skill scaffold without truncation or stall. cli-codex MUST complete via `echo "$prompt" | codex exec -` (foreground + stdin), NOT inline arg.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: MUST use stdin redirection (`echo prompt | codex exec -`); inline-arg form WILL stall above ~2k chars.
- **cli-copilot (claude-opus-4.7)**: handles large inline prompts natively; record latency.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: handles large inline prompts; record latency.

## Success Criteria

- intent_picked == `SKILL_CREATION` despite prompt size
- cli-codex completes within 2x baseline latency using stdin redirection
- false_positive_resource_load_count <= 1
- response is non-empty and references at least one of the expected_resources
