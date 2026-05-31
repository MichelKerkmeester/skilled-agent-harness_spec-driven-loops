---
title: "Gemini CLI hooks"
description: "Gemini-native lifecycle hooks providing session priming, compact injection, and stop tracking for the Gemini CLI runtime."
trigger_phrases:
  - "gemini cli hooks"
  - "gemini lifecycle hooks"
  - "gemini session priming"
  - "gemini compact injection"
  - "gemini session-prime"
---

# Gemini CLI hooks

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Gemini-native lifecycle hooks providing session priming, compact injection, and stop tracking for the Gemini CLI runtime.

Four Gemini hook scripts mirror the Claude Code hook system: session-prime.ts handles SessionStart events (startup/resume/clear sources) and injects additionalContext via Gemini's hookSpecificOutput contract. compact-inject.ts handles BeforeAgent events as a one-shot compact payload injection after PreCompress caching. compact-cache.ts handles PreCompress events to cache context before compression. session-stop.ts handles SessionEnd/AfterAgent events for token tracking and state persistence. shared.ts provides Gemini-specific stdin/stdout parsing and output formatting. All hooks reuse core logic from the Claude hook shared utilities.

---

## 2. HOW IT WORKS

mcp_server/hooks/gemini/

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/hooks/gemini/session-prime.ts` | Hook | SessionStart handler with startup/resume/clear routing |
| `mcp_server/hooks/gemini/compact-inject.ts` | Hook | BeforeAgent one-shot compact payload injection |
| `mcp_server/hooks/gemini/compact-cache.ts` | Hook | PreCompress context caching |
| `mcp_server/hooks/gemini/session-stop.ts` | Hook | SessionEnd/AfterAgent token tracking |
| `mcp_server/hooks/gemini/shared.ts` | Hook | Gemini stdin/stdout parsing (GeminiHookInput, GeminiHookOutput) |
| `mcp_server/hooks/claude/shared.ts` | Hook | Shared core utilities reused by Gemini hooks |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation/308-gemini-cli-hooks.md`
Related references:
- [307-passive-context-enrichment.md](307-passive-context-enrichment.md) — Passive context enrichment
- [309-context-preservation-metrics.md](309-context-preservation-metrics.md) — Context preservation metrics
