---
title: "Codex CLI SessionStart and UserPromptSubmit Hooks"
description: "Codex CLI adapters using native SessionStart startup context and UserPromptSubmit advisor brief injection, with a prompt-wrapper fallback for older deployments."
trigger_phrases:
  - "codex hook"
  - "codex user-prompt-submit"
  - "codex prompt-wrapper"
  - "codex advisor hook"
---

# Codex CLI SessionStart and UserPromptSubmit Hooks

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Support Codex CLI sessions with native startup-context and prompt-time advisor injection when `[features].codex_hooks = true` is enabled. Older deployments, missing hook configs or restricted hosts can still use the prompt-wrapper fallback for the advisor path.

## 2. HOW IT WORKS

`hooks/codex/session-start.ts` handles native `SessionStart` startup, resume and clear events and returns `hookSpecificOutput.additionalContext`. `hooks/codex/user-prompt-submit.ts` handles native `UserPromptSubmit` advisor briefs. User-level `~/.codex/hooks.json` registers the compiled `SessionStart` and `UserPromptSubmit` entries alongside Superset `notify.sh` and `~/.codex/config.toml` must enable `codex_hooks = true`. `hooks/codex/prompt-wrapper.ts` remains the fallback prompt-wrapper path for Codex deployments that do not expose the hook surface. `.codex/policy.json` ships the Bash denylist. The native prompt hook and wrapper share failure semantics and the global disable flag.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts` | Implementation | Source reference |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` | Implementation | Source reference |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts` | Implementation | Source reference |
| `~/.codex/hooks.json` | Implementation | Source reference |
| `~/.codex/config.toml` | Implementation | Source reference |
| `.codex/policy.json` | Implementation | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `Playbook scenario [CL-004](../../manual_testing_playbook/02--cli-hooks-and-plugin/codex-hook-and-wrapper.md).` | Manual playbook | Source reference |
| `tests/codex-session-start-hook.vitest.ts` | Automated test | Validation reference |
| `tests/codex-user-prompt-submit-hook.vitest.ts` | Automated test | Validation reference |

## 4. SOURCE METADATA

- Group: Hooks and plugin
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--hooks-and-plugin/codex-hook.md`

Related references:

- [01-claude-hook.md](./claude-hook.md).
- [03-gemini-hook.md](./gemini-hook.md).
