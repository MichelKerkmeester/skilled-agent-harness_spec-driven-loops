---
title: "Claude Code user-prompt-submit Hook"
description: "Claude Code adapter that emits hookSpecificOutput.additionalContext from the native advisor at prompt time."
trigger_phrases:
  - "claude hook"
  - "claude user-prompt-submit"
  - "hookSpecificOutput claude"
  - "claude advisor hook"
---

# Claude Code user-prompt-submit Hook

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Surface skill recommendations in Claude Code sessions at prompt time, without blocking the prompt when the advisor is degraded.

## 2. HOW IT WORKS

`hooks/claude/user-prompt-submit.ts` reads the prompt from stdin, calls the native advisor and returns a JSON envelope with `hookSpecificOutput.additionalContext`. The hook honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and fails open on any daemon-level failure. `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` bounds the native advisor subprocess and the remaining CLI fallback window. Raw prompts never appear in diagnostics. Freshness vocabulary is `live / stale / absent / unavailable`. Status vocabulary is `ok / skipped / degraded / fail_open`.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Implementation | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `Playbook scenario [CL-001](../../manual_testing_playbook/02--cli-hooks-and-plugin/claude-user-prompt-submit.md).` | Manual playbook | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-runtime-parity.vitest.ts` | Automated test | parity across hooks |

## 4. SOURCE METADATA

- Group: Hooks and plugin
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--hooks-and-plugin/claude-hook.md`

Related references:

- [`06--mcp-surface/compat-entrypoint.md`](../06--mcp-surface/compat-entrypoint.md).
