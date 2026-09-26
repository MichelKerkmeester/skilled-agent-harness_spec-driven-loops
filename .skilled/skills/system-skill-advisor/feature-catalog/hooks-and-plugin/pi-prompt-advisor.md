---
title: "Pi Prompt Advisor Extension"
description: "Pi extension that calls the compiled Claude user-prompt-submit hook in-process and appends the advisor context to each user prompt under a deadline."
trigger_phrases:
  - "pi prompt advisor"
  - "pi prompt advisor extension"
  - "pi advisor extension"
  - "SPECKIT_PI_ADVISOR_DEBUG"
version: 0.1.0.0
---

# Pi Prompt Advisor Extension

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A Pi extension that surfaces the skill advisor's brief at prompt time in-process, without spawning the advisor as a subprocess.

`hooks/pi/prompt-advisor.ts` is the real file behind the `.pi/extensions/prompt-advisor.ts` symlink. Pi awaits input handlers before agent processing, so the extension calls the shared advisor lifecycle module directly and appends the returned context below the user's prompt text.

---

## 2. HOW IT WORKS

The extension registers a Pi `input` handler that calls `handleClaudeUserPromptSubmit` from the compiled Claude `user-prompt-submit` hook with `runtime: 'pi'`. The handler loads that hook with dynamic `import()`, trying `ADVISOR_HOOK_MODULE` first and falling back to `ADVISOR_HOOK_FALLBACK_MODULE` when the first specifier does not resolve. The primary specifier is written for the `.pi/extensions/` symlink base and the fallback for the skill's `hooks/pi/` source directory, so the compiled hook resolves from either load location.

The in-process call races a timer set to the advisor budget plus `PI_ADVISOR_DEADLINE_MARGIN_MS` (300 ms). The budget is `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` or 2500 ms when that variable holds no number. A call that hangs past the deadline delivers `renderAdvisorFallbackDirective()` output instead of the advisor context.

With `SPECKIT_PI_ADVISOR_DEBUG` set to `1` or `true`, the handler classifies the turn in an `[advisor-debug]` line. A fallback brief is labeled `fallback(outage)`, `fallback(no-match)`, `fallback(skipped)` or `fallback(headless)` and a routed brief is labeled `head(<freshness>)`. Diagnostics carry the runtime label `pi`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Implementation | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/prompt-advisor.vitest.ts` | Automated test | dist specifier resolution, deadline, debug labels |

---

## 4. SOURCE METADATA

- Group: Hooks and plugin
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `hooks-and-plugin/pi-prompt-advisor.md`

Related references:

- [`hooks-and-plugin/claude-hook.md`](../../feature-catalog/hooks-and-plugin/claude-hook.md).
