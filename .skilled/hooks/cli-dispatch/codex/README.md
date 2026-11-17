---
title: "Codex Dispatch: PreToolUse and PostToolUse Adapters"
description: "Codex CLI PreToolUse and PostToolUse adapters for CLI dispatch, plus a vitest suite that holds both to the old exec and new Bash tool shapes."
trigger_phrases:
  - "codex dispatch preflight"
  - "codex dispatch audit"
  - "codex exec shell tool"
version: 1.0.0.0
---

# Codex Dispatch: PreToolUse and PostToolUse Adapters

---

## 1. OVERVIEW

`.skilled/hooks/cli-dispatch/codex/` holds the Codex adapters for the dispatch concern. `dispatch-preflight-lint.mjs` runs at `PreToolUse` and checks every dispatch in a command against the hard rules of the skill it targets, then denies a `block` violation. `dispatch-audit-posttooluse.mjs` runs at `PostToolUse` and appends one JSONL line for a completed call that matches a dispatch shape.

Codex registers both in `.codex/hooks.json`. Each event has a matcher group for `exec|Bash` with a 5-second timeout. The matcher names both tools because Codex called its shell tool `exec` up to 0.15x and `Bash` from 0.160. The later PostToolUse payload returns the output as one string instead of `{stdout, stderr}`. Both adapters accept either tool name. The audit also accepts either response shape. The command wrapper prints a drift notice and an `additionalContext` message if an adapter cannot run at all.

Both adapters check their switch before they read anything, then parse the stdin payload. They return at once on a tool name that is not the Codex shell. An empty command or a payload that will not parse also exits without output. The preflight takes the project directory from `payload.cwd`. When that field is absent it uses `CODEX_PROJECT_DIR`. If neither is set it uses the process working directory. It then calls `evaluateDispatch` with the command and the `.skilled/skills` root under that directory.

The preflight checks the `dispatch-guard` concern, whose switch is `SYSTEM_DISPATCH_GUARD_DISABLED`. The audit checks the `dispatch` concern, whose switch is `CLI_DISPATCH_AUDIT_DISABLED`. It reads that variable a second time through `isAuditDisabled` in the audit core. `SYSTEM_HOOKS_DISABLED` is the master switch, because both adapters reach the shared resolver in `.skilled/hooks/shared/hook-flags.mjs`. The audit appends to `.skilled/logs/cli-dispatch-audit.log` under the repository root.

Every failure ends the same way. A parse error or an internal exception exits 0 with no output. For the preflight that means Codex keeps its normal permission flow and the call goes ahead. The audit leaves the completed call untouched, because it never writes a permission decision.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `dispatch-preflight-lint.mjs` | The `PreToolUse` adapter. It denies a `block` violation and advises on a `warn` one. |
| `dispatch-audit-posttooluse.mjs` | The `PostToolUse` adapter. It records each dispatch and never sets a permission decision. |
| `codex-shell-tool.test.mjs` | The `vitest` suite. It runs both adapters under both tool names, and the audit under both response shapes. |

---

## 3. VALIDATION

Run from the repository root.

```bash
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/cli-dispatch/codex/codex-shell-tool.test.mjs
```

Expected result: every test passes and the command exits 0. `node --test` cannot run the file, because it is a `vitest` suite.

---

## 4. RELATED

- [`../README.md`](../README.md): the dispatch concern and the shared cores.
- [`../lib/dispatch-rule-checks.mjs`](../lib/dispatch-rule-checks.mjs): the hard-rule core the preflight calls.
- [`../lib/dispatch-audit.mjs`](../lib/dispatch-audit.mjs): the audit core the post-tool adapter calls.
- [`../../shared/README.md`](../../shared/README.md): the switch resolver both adapters call.
- [`../claude/README.md`](../claude/README.md): the Claude sibling adapters.
- [`../../../../.codex/hooks.json`](../../../../.codex/hooks.json): the file that registers both adapters.
