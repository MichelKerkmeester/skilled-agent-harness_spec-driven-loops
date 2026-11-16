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

`.skilled/hooks/cli-dispatch/devin/` holds the Devin CLI pair for the dispatch concern. Devin loads both adapters from the `PreToolUse` and `PostToolUse` groups in `.devin/hooks.v1.json`. Each group matches `^exec$` and gives the adapter 5 seconds.

The preflight evaluates a dispatch skill's hard rules before the command spawns. The audit records a completed dispatch and tags the record `runtime: 'devin'`. Both read the project dir from `payload.cwd`, and a whitespace-only `cwd` counts as absent. Both fall back to `DEVIN_PROJECT_DIR` and then to the process working directory.

No other runtime registers this pair, so Devin is the only host.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dispatch-preflight-lint.mjs` | The `PreToolUse` adapter. It denies a `block` violation and advises on a `warn` one. |
| `dispatch-audit-posttooluse.mjs` | The `PostToolUse` adapter. It records each dispatch and never decides permission. |
| `devin-dispatch-audit.test.mjs` | The `vitest` suite. It proves a real dispatch is logged and heredoc data is not. |

`dispatch-preflight-lint.mjs` exits at once when the `dispatch-guard` concern is off. It also exits on a tool that is not `exec`. It exits on an empty command and on a payload it cannot parse. Otherwise it calls `evaluateDispatch` with the command and the skills root.

A command with no dispatch shape returns no violation, so the hook approves. A `block` violation returns `permissionDecision: 'deny'` with the reason the rule gives. A `warn` violation returns `additionalContext` and leaves the permission flow alone. Any internal error approves silently, so the hook never blocks.

`dispatch-audit-posttooluse.mjs` calls `recordDispatch` with the command, output, session and call ids. It tags the record `runtime: 'devin'` and writes no permission decision. A missing payload, a parse error or an audit failure exits 0 with no output. It also exits early when `CLI_DISPATCH_AUDIT_DISABLED` is `1`.

`devin-dispatch-audit.test.mjs` runs the audit adapter against a temp project dir. One case sends `opencode run` through the `exec` tool and expects one log line tagged `devin`. The other writes the same command into heredoc data and expects no log file.

---

## 3. VALIDATION

Run from the repository root.

```bash
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/cli-dispatch/devin/devin-dispatch-audit.test.mjs
```

Expected result: every test passes. `node --test` cannot run the file, because it is a `vitest` suite.

---

## 4. RELATED

- [`../README.md`](../README.md): the dispatch concern, the shared cores and the full rule list.
- [`../lib/dispatch-rule-checks.mjs`](../lib/dispatch-rule-checks.mjs): the hard-rule engine the preflight calls.
- [`../lib/dispatch-audit.mjs`](../lib/dispatch-audit.mjs): the audit core the post-tool adapter calls.
- [`../codex/README.md`](../codex/README.md): the Codex sibling pair.
