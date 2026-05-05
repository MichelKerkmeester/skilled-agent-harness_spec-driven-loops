---
id: SD-002
category: 01--intent-detection
title: 'SKILL_CREATION intent: author a new sk-skill'
expected_intent: SKILL_CREATION
expected_resources:
  - references/specific/skill_creation.md
  - assets/skill/skill_md_template.md
  - assets/skill/skill_reference_template.md
expected_token_range_input: 1000-2500
expected_token_range_output: 1500-3000
created: 2026-05-05
---

# SD-002: SKILL_CREATION Intent Detection

## Setup

```
Help me create a new sk-skill for graph-rag. I need the SKILL.md scaffold and
a starter reference file that follows our conventions.
```

## Expected Behavior

- **Intent picked**: `SKILL_CREATION`
- **Resources loaded**:
  - `references/specific/skill_creation.md`
  - `assets/skill/skill_md_template.md`
  - `assets/skill/skill_reference_template.md`
- **Outcome**: CLI loads the skill-creation reference plus both skill-asset templates and produces a populated `SKILL.md` skeleton plus a reference-doc skeleton, both citing the loaded templates.

## Cross-CLI Variants

- **cli-codex (gpt-5.5/high/fast)**: foreground OK; codex tends to inline both templates verbatim.
- **cli-copilot (claude-opus-4.7)**: produces full file output with section anchors; expect 2-file response.
- **cli-opencode (opencode-go/deepseek-v4-pro)**: may shorten template prose; verify both files still emitted.

## Success Criteria

- intent_picked == `SKILL_CREATION`
- false_positive_resource_load_count <= 1
- response is non-empty and references at least one of the expected_resources
