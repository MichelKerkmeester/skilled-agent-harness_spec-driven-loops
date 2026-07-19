---
title: "PreCompact hook context caching"
description: "PreCompact hook precomputes critical context before Claude Code compaction and caches to temp file for later injection."
trigger_phrases:
  - "precompact hook context caching"
  - "PreCompact hook"
  - "pre-compaction context cache"
  - "compaction context precompute"
  - "hook state caching before compaction"
version: 3.6.0.7
---

# PreCompact hook context caching

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

PreCompact hook precomputes critical context before Claude Code compaction and caches to temp file for later injection.

When a long conversation is about to be compressed, this hook reads the transcript tail, extracts active file paths and topics, builds a compact context payload within the 4000-token budget, and caches it in hook state for the SessionStart hook to pick up after compaction completes.

---

## 2. HOW IT WORKS

The PreCompact hook runs as an external Node.js process triggered by Claude Code. It reads stdin JSON (session_id, transcript_path, trigger), tails the last 50 lines of the transcript JSONL, extracts file paths and spec folder references, builds a context string, truncates to COMPACTION_TOKEN_BUDGET (4000 tokens), and stores the payload in hook state at `${tmpdir}/speckit-claude-hooks/<project-hash>/<session-id>.json`. Stdout is NOT injected on PreCompact events — caching only.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/hooks/claude/compact-inject.ts` | Hook | PreCompact precompute and cache |
| `mcp-server/hooks/claude/shared.ts` | Hook | Stdin parsing, output formatting, timeout, logging |
| `mcp-server/hooks/claude/hook-state.ts` | Hook | Per-session state management |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/hook-precompact.vitest.ts` | Automated test | Context caching, budget enforcement, transcript extraction |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `context-preservation/precompact-hook.md`
Related references:
- [category-overview.md](../../feature-catalog/context-preservation/category-overview.md) — Context preservation and code graph
- [session-start-priming.md](../../feature-catalog/context-preservation/session-start-priming.md) — SessionStart priming (Claude)
