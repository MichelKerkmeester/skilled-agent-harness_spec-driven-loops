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

`.skilled/hooks/cli-dispatch/codex/` holds the Codex CLI pair for the dispatch concern. Codex names its shell tool `exec` up to 0.15x and `Bash` from 0.160. The newer PostToolUse response is one string instead of `{stdout, stderr}`. Both adapters accept either name and either response shape.

Codex loads them from the `PreToolUse` and `PostToolUse` matcher groups in `.codex/hooks.json`. Each group matches `exec|Bash` and gives the adapter 5 seconds. No other runtime registers this pair, so Codex is the only host.

The preflight reads the project dir from `payload.cwd` or `CODEX_PROJECT_DIR`. The audit tags every record with `runtime: 'codex'` and appends one JSONL line.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dispatch-preflight-lint.mjs` | The `PreToolUse` adapter. It denies a `block` violation and advises on a `warn` one. |
| `dispatch-audit-posttooluse.mjs` | The `PostToolUse` adapter. It records each dispatch and never decides permission. |
| `codex-shell-tool.test.mjs` | The `vitest` suite. It runs both adapters under both tool names and both response shapes. |

`dispatch-preflight-lint.mjs` exits at once on a tool that is not the Codex shell. It also exits on an empty command and on a payload it cannot parse. Otherwise it calls `evaluateDispatch` with the command and the skills root.

A command with no dispatch shape returns no violation, so the hook approves. A `block` violation returns the same `permissionDecision: 'deny'` envelope Claude uses, with the rule reason. A `warn` violation returns `additionalContext` and leaves the permission flow alone. Any internal error approves silently, so the hook never blocks.

`dispatch-audit-posttooluse.mjs` calls `recordDispatch` with the command, output, session and call ids. It tags the record `runtime: 'codex'` and writes no permission decision. A missing payload, a parse error or an audit failure exits 0 with no output. It also exits early when `CLI_DISPATCH_AUDIT_DISABLED` is `1`.

`codex-shell-tool.test.mjs` puts a stub `opencode` first on `PATH` that reports a v1 version. The stub keeps the lint on the OpenCode 1 rule set on a machine with OpenCode 2. The suite also checks that a non-shell tool and a heredoc-only command are ignored.

---

## 3. VALIDATION

Run from the repository root.

```bash
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/cli-dispatch/codex/codex-shell-tool.test.mjs
```

Expected result: every test passes. `node --test` cannot run the file, because it is a `vitest` suite.

---

## 4. RELATED

- [`../README.md`](../README.md): the dispatch concern, the shared cores and the full rule list.
- [`../lib/dispatch-rule-checks.mjs`](../lib/dispatch-rule-checks.mjs): the hard-rule engine the preflight calls.
- [`../lib/dispatch-audit.mjs`](../lib/dispatch-audit.mjs): the audit core the post-tool adapter calls.
- [`../claude/README.md`](../claude/README.md): the Claude sibling pair.
