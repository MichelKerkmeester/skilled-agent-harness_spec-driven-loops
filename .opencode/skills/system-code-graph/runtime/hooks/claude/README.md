---
title: "Claude Hooks: Code Graph Freshness"
description: "Claude Code PostToolUse hook that keeps the code graph self-healing after a Write or Edit."
---

# Claude Hooks

---

## 1. OVERVIEW

`runtime/hooks/claude/` holds the Claude Code side of the code graph freshness guard, one PostToolUse hook that targets the `claude` runtime specifically (its sibling in `runtime/hooks/codex/` targets Codex CLI). Both read the same JSON payload shape from stdin and share the runtime-neutral policy in `runtime/lib/code-graph/freshness-core.cjs`, but each parses its own runtime's tool-call fields and file-path conventions.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `code-graph-freshness.cjs` | PostToolUse hook for `Write`/`Edit`: reads the tool payload and runs it through `freshness-core.evaluateEdit()`, then on a `scan` decision fire-and-forget dispatches a detached warm-only incremental `code_graph_scan` |

## 3. BEHAVIOR

Runs co-resident with sk-code's `claude-posttooluse.sh` in the same PostToolUse Write/Edit block, order-independently. Fails open on any missing payload or internal error (`process.exit(0)`), so a bug here never blocks the edit it followed. The primary signal is the shared append-only freshness log, not stdout, and this hook never writes `hookSpecificOutput`.

## 4. RELATED

- [`runtime/hooks/codex/`](../codex/README.md) for the Codex CLI counterpart
- [`runtime/lib/code-graph/`](../../lib/code-graph/README.md) for the shared freshness policy
- [`.opencode/plugins/mk-code-graph-freshness.js`](../../../../../plugins/mk-code-graph-freshness.js) for the OpenCode plugin sibling
