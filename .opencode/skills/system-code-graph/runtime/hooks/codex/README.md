---
title: "Codex Hooks: Code Graph Freshness"
description: "Codex CLI PostToolUse hook that keeps the code graph self-healing after apply_patch or edit."
---

# Codex Hooks

---

## 1. OVERVIEW

`runtime/hooks/codex/` holds the Codex CLI side of the code graph freshness guard, one PostToolUse hook that targets the `codex` runtime specifically (its sibling in `runtime/hooks/claude/` targets Claude Code). Both share the same runtime-neutral policy in `runtime/lib/code-graph/freshness-core.cjs`, and this one adds the Codex-specific parsing that Claude's hook does not need.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `code-graph-freshness.cjs` | PostToolUse hook for `apply_patch`/`edit`: extracts the touched file path from a patch body's `*** Add/Update/Delete File:` header when `tool_input.file_path` is absent, then runs it through `freshness-core.evaluateEdit()` and dispatches a detached warm-only incremental scan on a `scan` decision |

## 3. BEHAVIOR

Codex's `apply_patch` carries the target path inside the patch text rather than a dedicated `file_path` field, so `filePathFrom()` parses the `*** Add/Update/Delete File:` (or `*** Move to:`) header and resolves it against `CODEX_PROJECT_DIR` when the parsed path is relative. Fails open on any missing payload or internal error (`process.exit(0)`), so a bug here never blocks the edit it followed. The primary signal is the shared append-only freshness log, not stdout, and this hook never writes `hookSpecificOutput`.

## 4. RELATED

- [`runtime/hooks/claude/`](../claude/README.md) for the Claude Code counterpart
- [`runtime/lib/code-graph/`](../../lib/code-graph/README.md) for the shared freshness policy
