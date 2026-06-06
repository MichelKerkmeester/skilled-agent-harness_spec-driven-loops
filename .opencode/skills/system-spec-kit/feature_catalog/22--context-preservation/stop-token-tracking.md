---
title: "Stop hook token tracking"
description: "Stop hook token tracking parses Claude Code transcript JSONL for token usage, calculates cost estimates per model, and stores snapshots."
trigger_phrases:
  - "stop hook token tracking"
  - "Stop hook"
  - "transcript token usage parsing"
  - "token cost estimate per model"
  - "session-end token metrics"
---

# Stop hook token tracking

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Stop hook token tracking parses Claude Code transcript JSONL for token usage, calculates cost estimates per model, and stores snapshots.

The Stop hook runs asynchronously on session end. It reads stdin JSON, parses the transcript file for usage data (input_tokens, output_tokens, cache tokens), calculates USD cost estimates per model (Opus/Sonnet/Haiku), and stores metrics in hook state. Supports incremental parsing via byte offset.

---

## 2. HOW IT WORKS

mcp_server/hooks/claude/session-stop.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `Hook` | Stop hook: parse, estimate, store | mcp_server/hooks/claude/claude-transcript.ts |
| `Hook` | JSONL transcript parser and cost estimator | mcp_server/tests/hook-stop-token-tracking.vitest.ts |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `Transcript parsing, cost estimation, incremental offset` | Automated test | phase 003 |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation/stop-token-tracking.md`
Related references:
- [session-start-priming.md](session-start-priming.md) — SessionStart priming (Claude)
- [cross-runtime-fallback.md](cross-runtime-fallback.md) — Cross-runtime tool fallback
