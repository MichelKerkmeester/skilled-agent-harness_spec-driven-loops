---
title: "Codex Dispatch Hooks: Preflight Lint, Audit and Shell-Tool Tests"
description: "Codex CLI PreToolUse and PostToolUse adapters for CLI dispatch, plus a vitest suite that holds both to the old exec and new Bash tool shapes."
trigger_phrases:
  - "codex dispatch preflight"
  - "codex dispatch audit"
  - "codex exec shell tool"
version: 1.0.0.0
---

# Codex Dispatch Hooks: Preflight Lint, Audit and Shell-Tool Tests

---

## 1. OVERVIEW

`hooks/dispatch/codex/` holds the Codex CLI pair for the dispatch concern. Codex names its shell tool `exec` up to 0.15x and `Bash` from 0.160, and the newer PostToolUse response is one string instead of `{stdout, stderr}`. Both adapters accept either name and either response shape.

Codex loads them from the `PreToolUse` and `PostToolUse` matcher groups in `.codex/hooks.json`. The audit tags every record with `runtime: 'codex'`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `dispatch-preflight-lint.mjs` | `PreToolUse` on `exec` or `Bash` | Fast-exits on a non-dispatch command, calls `evaluateDispatch` and denies a `block` violation with the same permission envelope Claude uses. A `warn` violation adds an advisory. | Fails open. Any internal error approves silently and never blocks. |
| `dispatch-audit-posttooluse.mjs` | `PostToolUse` on `exec` or `Bash` | Calls `recordDispatch` with the command, output, session and call ids, and tags the record `runtime: 'codex'`. Observe-only, with no permission decision. | Fails open. A missing payload, a parse error or an audit failure exits 0 with no output. |
| `codex-shell-tool.test.mjs` | `vitest` suite | Runs both adapters under the `exec` and `Bash` names and the object and string response shapes, with a stub `opencode` first on `PATH` that reports a v1 version. | Not applicable. |

---

## 3. RELATED

- [`../README.md`](../README.md): the dispatch concern, the shared cores and the full rule list.
- [`../lib/dispatch-rule-checks.mjs`](../lib/dispatch-rule-checks.mjs): the hard-rule engine the preflight calls.
- [`../lib/dispatch-audit.mjs`](../lib/dispatch-audit.mjs): the audit core the post-tool adapter calls.
- [`../claude/README.md`](../claude/README.md): the Claude sibling pair.
