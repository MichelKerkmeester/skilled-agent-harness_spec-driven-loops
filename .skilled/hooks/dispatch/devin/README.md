---
title: "Devin Dispatch Hooks: Preflight Lint, Audit and Audit Tests"
description: "Devin CLI PreToolUse and PostToolUse adapters for CLI dispatch, plus a vitest suite that proves only a command the shell runs as a dispatch is logged."
trigger_phrases:
  - "devin dispatch preflight"
  - "devin dispatch audit"
  - "devin exec dispatch lint"
version: 1.0.0.0
---

# Devin Dispatch Hooks: Preflight Lint, Audit and Audit Tests

---

## 1. OVERVIEW

`hooks/dispatch/devin/` holds the Devin CLI pair for the dispatch concern. Devin runs these hooks from the `PreToolUse` and `PostToolUse` matcher groups in `.devin/hooks.v1.json`, both on the `exec` tool. The preflight evaluates hard rules before the command spawns, and the audit records a completed dispatch tagged `runtime: 'devin'`.

A whitespace-only `cwd` is treated as absent, and the adapter falls back to `DEVIN_PROJECT_DIR`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `dispatch-preflight-lint.mjs` | `PreToolUse` on `exec` | Fast-exits on a non-dispatch command, calls `evaluateDispatch` and denies a `block` violation with the rule's reason. A `warn` violation adds an advisory. | Fails open. Any internal error approves silently and never blocks. |
| `dispatch-audit-posttooluse.mjs` | `PostToolUse` on `exec` | Calls `recordDispatch` with the command, output and session metadata and tags the record `runtime: 'devin'`. Observe-only, with no permission decision. | Fails open. A missing payload, a parse error or an audit failure exits 0 with no output. |
| `devin-dispatch-audit.test.mjs` | `vitest` suite | Checks that a command the shell actually runs as a dispatch is logged and that a dispatch written into heredoc data is not. | Not applicable. |

---

## 3. RELATED

- [`../README.md`](../README.md): the dispatch concern, the shared cores and the full rule list.
- [`../lib/dispatch-rule-checks.mjs`](../lib/dispatch-rule-checks.mjs): the hard-rule engine the preflight calls.
- [`../lib/dispatch-audit.mjs`](../lib/dispatch-audit.mjs): the audit core the post-tool adapter calls.
- [`../codex/README.md`](../codex/README.md): the Codex sibling pair.
