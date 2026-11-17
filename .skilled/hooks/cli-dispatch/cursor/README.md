---
title: "Cursor Dispatch: preToolUse and postToolUse Adapters"
description: "Cursor adapters that translate its Shell preToolUse payload to the Claude preflight and multiplex postToolUse between the dispatch audit and post-edit quality."
trigger_phrases:
  - "cursor dispatch preflight"
  - "cursor shell preflight"
  - "cursor post tool use proxy"
version: 1.0.0.0
---

# Cursor Dispatch: preToolUse and postToolUse Adapters

---

## 1. OVERVIEW

`.skilled/hooks/cli-dispatch/cursor/` holds the Cursor adapters for the dispatch concern. Cursor reaches these checks through command hooks, so each event gets an adapter of its own. `preToolUse` carries the preflight that refuses a dispatch which breaks a blocking hard rule. `postToolUse` carries a proxy that records a completed shell dispatch and runs the post-edit quality checks after a write.

`.cursor/hooks.json` registers the preflight under `preToolUse` with the `Shell` matcher and a 10-second timeout. It registers the proxy under `postToolUse` by its real path, `.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs`, with a 10-second timeout. Nothing loads through the link in this folder, so the link is for browsing only. When an adapter is missing or `node` fails, each entry prints a drift line on stderr and an allow envelope whose `agent_message` asks for a rebuild. A preflight deny exits 2, which trips the same fallback: the entry prints the deny, then the drift line and the allow envelope, and exits 0. Which envelope Cursor acts on is unconfirmed.

The preflight checks the `dispatch-guard` switch before it reads stdin. A disabled concern returns `{permission: 'allow'}` at once. It then reads the command from `tool_input.command`, falls back to `payload.command` and approves when neither holds a string. It takes the project directory from `workspace_roots[0]` or from `process.cwd()`, renames the tool to `Bash` and spawns `.skilled/hooks/cli-dispatch/claude/dispatch-preflight-lint.mjs` with a 5-second timeout.

A deny from the child becomes `{permission: 'deny'}` with the reason in `user_message` and `agent_message`. The adapter then exits 2. An `additionalContext` becomes `{permission: 'allow', agent_message}`. Any other child reply becomes a plain allow.

The proxy parses stdin before it looks at the tool name. A `Write` call checks the `post-edit-quality` switch and spawns `.skilled/hooks/post-edit-quality/claude/post-edit-quality.cjs` with an 8-second timeout, then passes the child's raw stdout back as `agent_message`. That stdout is the Claude adapter's `hookSpecificOutput` JSON envelope, so the findings reach Cursor wrapped in that JSON text. A `Shell` call checks the `dispatch` switch, parses the stringified `tool_output` and spawns `.skilled/hooks/cli-dispatch/claude/dispatch-audit-posttooluse.mjs` with the same timeout. It discards that reply and returns a plain allow.

Both adapters call `isHookEnabled` from the shared resolver, so `SYSTEM_HOOKS_DISABLED=1` is the master switch. Every failure ends in an allow: a stdin parse error, a spawn error, a timeout, non-JSON child output in the preflight or a thrown error. The proxy writes one `post-tool-use:` line to stderr when `main` throws, then allows.

---

## 2. DIRECTORY TREE

The folder is flat, so the table names every file beside this README.

| File | Responsibility |
|---|---|
| `dispatch-preflight-lint.mjs` | The `preToolUse` adapter. It checks the `dispatch-guard` switch, spawns the Claude preflight and translates the reply into Cursor's permission envelope. |
| `post-tool-use.mjs` | A symlink to `../../../skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs`. The real file multiplexes `postToolUse` between the dispatch audit and the post-edit quality checks. |

The proxy reads `tool_name` and approves at once for a name it does not handle. A `Shell` payload keeps the command in `tool_input.command` and the response in `tool_output` as a JSON string with `output` and `exitCode`. The proxy parses that string, so a malformed value still reaches the audit with no stdout and no exit code.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs
```

Expected result: every test passes, with `fail 0` in the summary. One case holds this folder to its registration. It checks that `dispatch-preflight-lint.mjs` exists and that the `dispatch-preflight-lint` binding for Cursor in the hook registry points at it.

---

## 4. RELATED

- [`../README.md`](../README.md): the dispatch concern, the shared cores and the switch index.
- [`../claude/dispatch-preflight-lint.mjs`](../claude/dispatch-preflight-lint.mjs): the Claude preflight this adapter spawns.
- [`../claude/dispatch-audit-posttooluse.mjs`](../claude/dispatch-audit-posttooluse.mjs): the audit the proxy spawns on a shell call.
- [`../../../skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs`](../../../skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs): the real proxy the link points at.
