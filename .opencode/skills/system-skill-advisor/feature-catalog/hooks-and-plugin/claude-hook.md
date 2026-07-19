---
title: "Claude Code user-prompt-submit Hook"
description: "Claude Code adapter that emits hookSpecificOutput.additionalContext from the native advisor at prompt time."
trigger_phrases:
  - "claude hook"
  - "claude user-prompt-submit"
  - "hookSpecificOutput claude"
  - "claude advisor hook"
version: 0.8.0.17
---

# Claude Code user-prompt-submit Hook

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Surface skill recommendations in Claude Code sessions at prompt time, without blocking the prompt when the advisor is degraded.

## 2. HOW IT WORKS

`hooks/claude/user-prompt-submit.ts` reads the prompt from stdin, calls the native advisor and returns a JSON envelope with `hookSpecificOutput.additionalContext`. The hook honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and fails open on any daemon-level failure. `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` bounds the native advisor subprocess and the remaining CLI fallback window. Raw prompts never appear in diagnostics. Freshness vocabulary is `live / stale / absent / unavailable`. Status vocabulary is `ok / skipped / degraded / fail_open`.

Hook diagnostics are prompt-safe rollups handled by `lib/metrics.ts`. The `spec_kit.<group>.<metric_name>` instrumentation namespace emits only when `SPECKIT_METRICS_ENABLED=true`. Default off is no emission and is byte-identical to the pre-instrumentation surface. Alert thresholds for the rolling cache-hit p95 are read from the environment with conservative defaults: `SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_WARN_MS` (default 75) and `SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_PAGE_MS` (default 150). Both flags are forwarded to the daemon child through the launcher `CHILD_ENV_ALLOWLIST` and the plugin bridge env allowlist so the same thresholds reach every runtime.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Implementation | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/metrics.ts` | Library | `SPECKIT_METRICS_ENABLED` emission gate and `getAdvisorHookAlertThresholds()` cache-hit p95 threshold flags |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `Playbook scenario [CL-001](../../manual-testing-playbook/cli-hooks-and-plugin/claude-user-prompt-submit.md).` | Manual playbook | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-runtime-parity.vitest.ts` | Automated test | parity across hooks |

## 4. SOURCE METADATA

- Group: Hooks and plugin
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `hooks-and-plugin/claude-hook.md`

Related references:

- [`mcp-surface/compat-entrypoint.md`](../../feature-catalog/mcp-surface/compat-entrypoint.md).
