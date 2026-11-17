---
title: "Devin CLI Dispatch: PreToolUse and PostToolUse Adapters"
description: "Devin CLI PreToolUse and PostToolUse adapters for CLI dispatch, plus a vitest suite that proves only a command the shell runs as a dispatch is logged."
trigger_phrases:
  - "devin dispatch preflight"
  - "devin dispatch audit"
  - "devin exec dispatch lint"
version: 1.0.0.0
---

# Devin CLI Dispatch: PreToolUse and PostToolUse Adapters

---

## 1. OVERVIEW

`.skilled/hooks/cli-dispatch/devin/` holds the Devin pair for the CLI dispatch concern. The preflight runs at `PreToolUse` and denies a dispatch that breaks a `block` hard rule. The audit runs at `PostToolUse` and appends one JSONL line for a completed call that matches a dispatch shape.

Devin loads both from `.devin/hooks.v1.json`. The `PreToolUse` group and the `PostToolUse` group each match `^exec$` and allow 5 seconds. Neither entry carries a fallback command. A start that fails exits 1 with empty stdout and Node's module error on stderr, and no drift line.

Both adapters read the project folder from `payload.cwd` when that field holds a non-blank string. Otherwise they fall back to `DEVIN_PROJECT_DIR` and then the working directory. The preflight reads hard rules from `.skilled/skills/` under that folder. The audit writes `.skilled/logs/cli-dispatch-audit.log` under the repository that holds it.

Each adapter checks its switch before it reads stdin. The preflight calls `isHookEnabled('dispatch-guard')`, which reads `SYSTEM_DISPATCH_GUARD_DISABLED`. The audit calls `isHookEnabled('dispatch')`, which reads `CLI_DISPATCH_AUDIT_DISABLED`, then `isAuditDisabled` on the same variable. Both resolve through `.skilled/hooks/shared/hook-flags.mjs`, so `SYSTEM_HOOKS_DISABLED` is the master switch.

A `block` violation returns `hookSpecificOutput.permissionDecision` set to `deny`, with the skill name and each rule id. A `warn` violation returns `additionalContext` and leaves the permission flow alone. When a command carries both, the deny wins and the advisories are dropped. The audit writes no output, so the completed tool result reaches the model unchanged.

A tool name other than `exec` and a payload that will not parse end in exit 0 with no output. So does an empty command. A thrown error takes the same path, which keeps a bug in either adapter from touching the call.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `dispatch-preflight-lint.mjs` | The `PreToolUse` adapter. It checks `dispatch-guard`, reads the payload, calls `evaluateDispatch` and prints a deny or an advisory. |
| `dispatch-audit-posttooluse.mjs` | The `PostToolUse` adapter. It checks `dispatch`, builds the output text from the tool response and calls `recordDispatch`. |
| `devin-dispatch-audit.test.mjs` | The `vitest` suite for the audit adapter. It sends one dispatch and one heredoc-only command through the adapter against a temp project folder. |

The preflight has no suite of its own, so this test is the folder's only automated check.

---

## 3. VALIDATION

Run the command from the repository root.

```bash
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/cli-dispatch/devin/devin-dispatch-audit.test.mjs
```

Expected result: every test passes and the command exits 0.

The suite builds a temp project folder per case and passes it as `cwd`. It clears the six disable switches it names, then removes the folder. `node --test` cannot run the file, because it imports `vitest`.

---

## 4. RELATED

- [`../README.md`](../README.md): the CLI dispatch concern, with both cores and the runtime coverage table.
- [`../lib/dispatch-rule-checks.mjs`](../lib/dispatch-rule-checks.mjs): the hard-rule engine the preflight calls.
- [`../lib/dispatch-audit.mjs`](../lib/dispatch-audit.mjs): the audit core the post-tool adapter calls.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver behind `isHookEnabled`.
- [`../../../../.devin/hooks.v1.json`](../../../../.devin/hooks.v1.json): the file that registers both adapters.
