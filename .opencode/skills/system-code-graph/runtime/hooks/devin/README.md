---
title: "Devin Hooks: Code Graph Freshness"
description: "Devin CLI PostToolUse hook that keeps the code graph self-healing after an edit."
---

# Devin Hooks

---

## 1. OVERVIEW

`runtime/hooks/devin/` holds the Devin CLI side of the code graph freshness guard, one `PostToolUse(^edit$)` hook that targets the `devin` runtime specifically (its siblings in `runtime/hooks/claude/` and `runtime/hooks/codex/` target the other two CLIs). All three share the same runtime-neutral policy in `runtime/lib/code-graph/freshness-core.cjs`.

**STATUS: DORMANT** - `.devin/hooks.v1.json` is confirmed not consulted at all under `devin -p` (packet-wide finding, see `../../../../system-spec-kit/mcp-server/hooks/devin/README.md`). Built and directly tested against a real file edit; not yet observed firing in a real session.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `code-graph-freshness.cjs` | `PostToolUse(^edit$)` hook: reads `tool_input.file_path` (with `filePath`/`path` fallbacks - Devin's exact field name is unconfirmed), runs it through `freshness-core.evaluateEdit()`, and dispatches a detached warm-only incremental scan on a `scan` decision. |

## 3. BEHAVIOR

Fails open on any missing payload or internal error (`process.exit(0)`), so a bug here never blocks the edit it followed. The primary signal is the shared append-only freshness log, not stdout, and this hook never writes `hookSpecificOutput`.

## 4. RELATED

- [`runtime/hooks/claude/`](../claude/README.md) for the Claude Code counterpart
- [`runtime/hooks/codex/`](../codex/README.md) for the Codex counterpart
- [`runtime/lib/code-graph/`](../../lib/code-graph/README.md) for the shared freshness policy
