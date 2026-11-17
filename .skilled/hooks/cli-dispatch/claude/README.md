---
title: "Claude Dispatch: PreToolUse and PostToolUse Adapters"
description: "Claude Code PreToolUse and PostToolUse adapters that lint a composed CLI dispatch against hard rules and record a scrubbed audit line after it runs."
trigger_phrases:
  - "claude dispatch preflight"
  - "claude dispatch audit"
  - "claude bash dispatch lint"
version: 1.0.0.0
---

# Claude Dispatch: PreToolUse and PostToolUse Adapters

---

## 1. OVERVIEW

`.skilled/hooks/cli-dispatch/claude/` holds the Claude Code adapters for the dispatch concern. The preflight runs at `PreToolUse` and holds every dispatch in a `Bash` command to the hard rules of the skill it names. The audit runs at `PostToolUse` and appends one scrubbed line for a dispatch that already ran.

`.claude/settings.json` registers both. Its `hooks` object names the events `"PreToolUse"` and `"PostToolUse"`, and each group matches `Bash` with a 5-second timeout. When the adapter is missing or `node` fails, each entry prints a drift line on stderr and a context envelope that asks for a rebuild.

Both adapters check their switch before they read stdin. The preflight checks `dispatch-guard`, whose switch is `SYSTEM_DISPATCH_GUARD_DISABLED`. The audit checks `dispatch`, whose switch is `CLI_DISPATCH_AUDIT_DISABLED`. The checks reach the shared resolver through `hook-flags.mjs`, so `SYSTEM_HOOKS_DISABLED` turns off either adapter with the rest of the repository hooks.

Every failure ends in exit 0 with no output. The preflight reads that as an approval and the audit reads it as nothing to write.

The preflight builds `skillsRoot` from `CLAUDE_PROJECT_DIR` or the working directory, then calls `evaluateDispatch` for the command. A `block` violation writes `permissionDecision: 'deny'` with each rule id in the reason. A `warn` violation writes `additionalContext` and leaves the permission decision to the normal flow. A command with no dispatch shape returns before either path.

The audit calls `resolveAuditLogPath` and then `recordDispatch` with the command, the output, the session id, the tool call id and the tool response. It reads the project directory from `payload.cwd`. When that is absent it falls back to `CLAUDE_PROJECT_DIR` and the working directory. The record is tagged `runtime: 'claude'` and lands in `.skilled/logs/cli-dispatch-audit.log` at the repository root. The adapter emits no permission decision at any point.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `dispatch-preflight-lint.mjs` | The `PreToolUse` adapter. It denies a `block` violation and advises on a `warn` one. |
| `dispatch-audit-posttooluse.mjs` | The `PostToolUse` adapter. It records a completed dispatch and never decides permission. |

Both files are entry points. The shared cores they call live in `../lib/`.

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/shared/hook-stdin-deadline.test.mjs
```

Expected result: every test passes and the run ends with `fail 0`.

The suite spawns this folder's adapters with stdin left open, then sends a flagged dispatch through each one.

---

## 4. RELATED

- [`../README.md`](../README.md): the dispatch concern and its switches.
- [`../lib/dispatch-rule-checks.mjs`](../lib/dispatch-rule-checks.mjs): the hard-rule engine the preflight calls.
- [`../lib/dispatch-audit.mjs`](../lib/dispatch-audit.mjs): the audit core the post-tool adapter calls.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver behind both checks.
- [`../../../../.claude/settings.json`](../../../../.claude/settings.json): the file that registers both adapters.
