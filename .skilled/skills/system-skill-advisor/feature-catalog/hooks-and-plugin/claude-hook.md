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

---

## 2. HOW IT WORKS

### Core Behavior

`hooks/claude/user-prompt-submit.ts` reads the prompt from stdin, calls the native advisor and returns a JSON envelope with `hookSpecificOutput.additionalContext`. The hook honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and fails open on any daemon-level failure. As a default-off, fail-open shadow it also records post-emission advisor-policy delivery (`observeEmittedAdvisorPolicy`) — an observed receipt with `lifecycleEpoch >= 1` — as the final step before returning, leaving the emitted envelope byte-identical. Freshness vocabulary is `live / stale / absent / unavailable`. Status vocabulary is `ok / skipped / degraded / fail_open`.

Before any CLI spawn the hook runs the casual-prompt gate. `/help`, short acknowledgements and prompts below the length threshold return `skipped` without spawning the CLI. The CLI request sends `includeCompiledRoute: false`, so no compiled-route child process starts.

### Fallback And Repeats

When no brief is available the hook emits a fallback that opens with one status line and then the directives block. The status line takes one of three forms. For an outage the line is `Advisor: outage (<label>); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json` and the label is `absent`, `degraded` or `fail_open`. When no skill matched the line is `Advisor: no skill matched.` When the prompt gate skips the prompt the line is `Advisor: prompt skipped.`

Directive-lifecycle dedup treats that fallback like a brief. In a known, confirmed session the first no-route turn gets the whole text and later turns get the status line alone. Unknown sessions, the dedup kill switch and thrown errors still get the whole text.

### Timeouts

`SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` bounds the native advisor subprocess and the remaining CLI fallback window. The CLI budget for the hook defaults to 2500 ms. When the variable is unset or blank the Claude shim in system-spec-kit sets it to 2200 ms for the hook it spawns. The shim kills the hook at 2500 ms and the hook needs time to print its fallback. An operator-set value passes through unchanged, so a value above about 2200 ms lets the shim kill the hook first and the turn gets `{}`.

### Diagnostics

Hook diagnostics are prompt-safe rollups handled by `lib/metrics.ts`. The `spec_kit.<group>.<metric_name>` instrumentation namespace emits only when `SPECKIT_METRICS_ENABLED=true`. Default off is no emission and is byte-identical to the pre-instrumentation surface. Alert thresholds for the rolling cache-hit p95 are read from the environment with conservative defaults: `SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_WARN_MS` (default 75) and `SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_PAGE_MS` (default 150). Both flags are forwarded to the daemon child through the launcher `CHILD_ENV_ALLOWLIST` so the same thresholds reach every runtime.

Each record carries `runtime`, taken from `SPECKIT_RUNTIME` when it names a known runtime and `claude` otherwise. Records carry optional `emittedBytes` and `directivesSuppressed`. The hook writes records only when `SKILL_ADVISOR_DEBUG` is set. Raw prompts never appear in diagnostics. Before exiting, the hook waits up to 100 ms for pending diagnostic writes.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Implementation | Source reference |
| `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts` | Library | `SPECKIT_METRICS_ENABLED` emission gate and `getAdvisorHookAlertThresholds()` cache-hit p95 threshold flags |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | Library | fallback status line and directives block |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `Playbook scenario [CL-001](../../manual-testing-playbook/cli-hooks-and-plugin/claude-user-prompt-submit.md).` | Manual playbook | Source reference |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/runtime-parity.vitest.ts` | Automated test | parity across hooks |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Automated test | prompt gate, fallback status lines, repeats, runtime and bytes, diagnostic flush |
| `.skilled/skills/system-spec-kit/runtime/tests/user-prompt-submit-shim.vitest.ts` | Automated test | shim child budget |

---

## 4. SOURCE METADATA

- Group: Hooks and plugin
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `hooks-and-plugin/claude-hook.md`

Related references:

- [`cli-surface/compat-entrypoint.md`](../../feature-catalog/cli-surface/compat-entrypoint.md).
