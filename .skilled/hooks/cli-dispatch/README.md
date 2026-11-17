---
title: "Dispatch Hooks: CLI Dispatch Preflight + Audit"
description: "Checks CLI dispatches against skill hard rules and records completed calls that match a dispatch shape for Claude, Codex, Cursor, Devin, OpenCode, Pi and DSH. Vibe runs the preflight only."
trigger_phrases:
  - "dispatch preflight lint"
  - "dispatch audit trail"
  - "hard rules engine"
  - "opencode dispatch audit"
  - "opencode dispatch preflight"
  - "cli dispatch audit plugin"
---

# Dispatch Hooks: CLI Dispatch Preflight + Audit

---

## 1. OVERVIEW

`cli-dispatch/` checks composed CLI commands against each target skill's `hard-rules.json` before execution. Audit adapters record completed calls that match a dispatch shape in `.skilled/logs/cli-dispatch-audit.log`.

Claude, Codex, Cursor, Devin, OpenCode, Pi and DSH run both adapters. Vibe runs preflight only. Every preflight uses [the hard-rule core](./lib/dispatch-rule-checks.mjs). Audit adapters use [the audit core](./lib/dispatch-audit.mjs).

The preflight key is `dispatch-guard` and its switch is `SYSTEM_DISPATCH_GUARD_DISABLED`. The audit key is `dispatch` and its switch is `CLI_DISPATCH_AUDIT_DISABLED`. `SYSTEM_DISPATCH_DISABLED` disables both concerns. `SYSTEM_HOOKS_DISABLED` disables both with every other repo hook.

---

## 2. HOW IT WORKS

`evaluateDispatch(command, skillsRoot)` resolves each dispatch in a command and reads that skill's `hard-rules.json`. It calls `evaluate` for each rule set and returns its violations in command order. A `block` or `error` severity denies the call. Other severities become advisories.

Pi's `shouldDenyPiDispatch` checks whether the user request authorizes the named executor before the shared rules run.
The preflight also captures interactive or RPC text on `input` for that check.

`recordDispatch` identifies the dispatch shape, collects metadata and builds one JSONL record. The audit core scrubs and truncates the command, model and target fields before it appends the record to `.skilled/logs/cli-dispatch-audit.log`. A failed audit returns `false` and leaves the completed call alone.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `PreToolUse` and `PostToolUse` on `Bash` | `claude/dispatch-preflight-lint.mjs`<br>`claude/dispatch-audit-posttooluse.mjs` | `.skilled/hooks/cli-dispatch/claude/dispatch-preflight-lint.mjs`<br>`.skilled/hooks/cli-dispatch/claude/dispatch-audit-posttooluse.mjs` | A block reason or advisory. The audit writes no tool output. |
| Codex | `PreToolUse` and `PostToolUse` on `exec|Bash` | `codex/dispatch-preflight-lint.mjs`<br>`codex/dispatch-audit-posttooluse.mjs` | `.skilled/hooks/cli-dispatch/codex/dispatch-preflight-lint.mjs`<br>`.skilled/hooks/cli-dispatch/codex/dispatch-audit-posttooluse.mjs` | A block reason or advisory. The audit writes no tool output. |
| Cursor | `preToolUse` on `Shell` and `postToolUse` | `cursor/dispatch-preflight-lint.mjs`<br>`cursor/post-tool-use.mjs` | `.skilled/hooks/cli-dispatch/cursor/dispatch-preflight-lint.mjs`<br>`.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs` | An allow or deny envelope. The post-tool proxy returns allow after it runs the audit. |
| Devin | `PreToolUse` and `PostToolUse` on `^exec$` | `devin/dispatch-preflight-lint.mjs`<br>`devin/dispatch-audit-posttooluse.mjs` | `.skilled/hooks/cli-dispatch/devin/dispatch-preflight-lint.mjs`<br>`.skilled/hooks/cli-dispatch/devin/dispatch-audit-posttooluse.mjs` | A block reason or advisory. The audit writes no tool output. |
| OpenCode | `tool.execute.before` and `tool.execute.after` on `bash` | `opencode/cli-dispatch-audit.js` | `.opencode/plugins/cli-dispatch-audit.js` | Throws the block reason or records the completed call. |
| Pi | `tool_call` preflight and `tool_result` audit | `pi/dispatch-preflight-lint.ts`<br>`pi/dispatch-audit.ts` | `.skilled/hooks/cli-dispatch/pi/dispatch-preflight-lint.ts`<br>`.skilled/hooks/cli-dispatch/pi/dispatch-audit.ts` | A block reason or advisory. The audit writes no tool output. |
| DSH | `tools/pre-execute` and `tools/post-execute` on `bash` | `dsh/dispatch-preflight-lint.mjs`<br>`dsh/dispatch-audit.mjs` | `.skilled/hooks/cli-dispatch/dsh/dispatch-preflight-lint.mjs`<br>`.skilled/hooks/cli-dispatch/dsh/dispatch-audit.mjs` | A deny result or logger warning. The audit leaves the result unchanged. |
| Vibe | `pre_tool` matching `re:bash|process_start|process_write` | `vibe/dispatch-preflight.mjs` | `.vibe/plugins/repo-guards/dispatch-preflight.mjs` | A refusal for blocking rules. Advisories go to stderr. There is no audit adapter. |

Claude registers both adapters in `.claude/settings.json` on `PreToolUse` and `PostToolUse` with a `Bash` matcher and 5-second timeouts. Codex registers both in `.codex/hooks.json` on the same events with matcher `exec|Bash` and 5-second timeouts.

Cursor registers preflight in `.cursor/hooks.json` under `preToolUse` with matcher `Shell` and a 10-second timeout. The same file runs the post-tool proxy under `postToolUse` with a 10-second timeout. Devin registers both in `.devin/hooks.v1.json` under `PreToolUse` and `PostToolUse` for `^exec$` with 5-second timeouts.

OpenCode loads the plugin from the flat `.opencode/plugins/*.js` glob. Pi discovers `.pi/extensions/dispatch-preflight-lint.ts` and `.pi/extensions/dispatch-audit.ts`. Each entry re-exports its matching file under `pi/`.

The DSH bundle at `.dsh/plugins/repo-guards/index.mjs` registers both adapters through links under `.dsh/plugins/repo-guards/adapters/`. Vibe registers `dispatch-preflight` in `.vibe/hooks.toml` as strict `pre_tool` with matcher `re:bash|process_start|process_write`.

Claude and Codex allow the call when preflight parsing or checks fail. Devin does the same. Cursor allows the call if its Claude child fails. OpenCode catches guard errors and does not block. Pi leaves the call alone if linting throws. DSH denies when its rule core throws. Audit adapters run after the tool result and leave that result unchanged.

---

## 4. DIRECTORY TREE

```text
cli-dispatch/
+-- lib/
+-- claude/
+-- codex/
+-- cursor/
+-- devin/
+-- opencode/
+-- pi/
+-- dsh/
+-- vibe/
`-- tests/
```

The runtime folders hold adapter code or an index entry to its real file. The shared cores live in `lib/`.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| [Hard-rule core](./lib/dispatch-rule-checks.mjs) | Resolves dispatches and evaluates each skill's hard rules. |
| [Audit core](./lib/dispatch-audit.mjs) | Builds scrubbed JSONL records and appends them to the audit log. |
| [Hook flag resolver](../shared/hook-flags.cjs) | Resolves the concern switches and master switch. |
| [Hooks index](../README.md) | Lists the runtime coverage matrix and switch index. |
| [Claude settings](../../../.claude/settings.json) | Registers Claude hook commands. |
| [Codex hooks](../../../.codex/hooks.json) | Registers Codex hook commands. |
| [Cursor hooks](../../../.cursor/hooks.json) | Registers Cursor hook commands. |
| [Devin hooks](../../../.devin/hooks.v1.json) | Registers Devin hook commands. |
| [OpenCode plugin](../../../.opencode/plugins/cli-dispatch-audit.js) | Holds the OpenCode preflight and audit handlers. |
| [Pi extension entries](../../../.pi/extensions/dispatch-preflight-lint.ts) and [audit entry](../../../.pi/extensions/dispatch-audit.ts) | Re-export the Pi adapters in this folder. |
| [DSH guard bundle](../../../.dsh/plugins/repo-guards/index.mjs) | Registers the DSH adapters. |
| [Vibe hook settings](../../../.vibe/hooks.toml) | Registers the Vibe preflight. |

---

## 6. CONFIGURATION

Both concerns are enabled by default. The resolver treats `1`, `true`, `yes` or `on` as true in any case. Environment values take precedence over `.skilled/hooks/hook-flags.env`.

| Switch | Effect |
|---|---|
| `SYSTEM_DISPATCH_GUARD_DISABLED=1` | Disables preflight checks. |
| `CLI_DISPATCH_AUDIT_DISABLED=1` | Disables audit records. |
| `SYSTEM_DISPATCH_DISABLED=1` | Disables both dispatch concerns. |
| `SYSTEM_HOOKS_DISABLED=1` | Disables every repository hook. |

---

## 7. VALIDATION

The hard-rule suite is [hard-rule tests](./lib/dispatch-rule-checks.test.mjs). The audit suite is [audit tests](./lib/dispatch-audit.test.mjs).

Run the smoke test from the repository root.

```bash
SYSTEM_DISPATCH_GUARD_DISABLED=1 node .skilled/hooks/cli-dispatch/claude/dispatch-preflight-lint.mjs < /dev/null
```

Expected result: no output on stdout or stderr and exit status 0.

---

## 8. RELATED

- [Hooks index](../README.md): the runtime coverage matrix and switch index.
- [Shared hook helpers](../shared/README.md): the switch resolver used by adapters.
- [OpenCode plugin index](../../../.opencode/plugins/README.md): the plugin discovery folder.
- [Pi extension index](../../../.pi/extensions/README.md): the extension entries that re-export adapters.
- [DSH bundle entry](../../../.dsh/plugins/repo-guards/index.mjs): the bundle that registers its adapter links.
