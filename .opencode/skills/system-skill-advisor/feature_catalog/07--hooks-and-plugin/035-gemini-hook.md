---
title: "Gemini CLI user-prompt-submit Hook"
description: "Gemini CLI adapter that emits hookSpecificOutput.additionalContext via the shared advisor envelope."
trigger_phrases:
  - "gemini hook"
  - "gemini user-prompt-submit"
  - "gemini advisor hook"
  - "gemini additionalContext"
---

# Gemini CLI user-prompt-submit Hook

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Integrate the advisor into Gemini CLI sessions without introducing a Gemini-specific routing pipeline.

## 2. HOW IT WORKS

`hooks/gemini/user-prompt-submit.ts` mirrors the Claude hook's envelope, reading prompt stdin and returning `hookSpecificOutput.additionalContext`. It shares failure semantics (fail-open), disable flag handling and privacy rules with the other hooks. Output passes through the same render path (`lib/render.ts`) so text is identical across runtimes (see `lib/normalize-adapter-output.ts`).

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts` | Implementation | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/normalize-adapter-output.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `Playbook scenario [CL-003](../../manual_testing_playbook/02--cli-hooks-and-plugin/011-gemini-user-prompt-submit.md).` | Manual playbook | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-runtime-parity.vitest.ts` | Automated test | runtime-parity checks |

## 4. SOURCE METADATA

- Group: Hooks and plugin
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--hooks-and-plugin/035-gemini-hook.md`

Related references:

- [01-claude-hook.md](./034-claude-hook.md).
- [04-codex-hook.md](./036-codex-hook.md).
- [`06--mcp-surface/028-compat-entrypoint.md`](../06--mcp-surface/028-compat-entrypoint.md).
