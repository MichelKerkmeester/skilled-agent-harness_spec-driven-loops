---
title: "Cursor Dispatch Hooks: Shell Preflight and Multiplexed Proxy"
description: "Cursor adapters that translate its Shell preToolUse payload to the Claude preflight and multiplex postToolUse between the dispatch audit and post-edit quality."
trigger_phrases:
  - "cursor dispatch preflight"
  - "cursor shell preflight"
  - "cursor post tool use proxy"
version: 1.0.0.0
---

# Cursor Dispatch Hooks: Shell Preflight and Multiplexed Proxy

---

## 1. OVERVIEW

`.skilled/hooks/cli-dispatch/cursor/` holds the two Cursor adapters for the dispatch concern. Cursor has no native hard-rule engine, so each adapter translates one event. The `preToolUse` adapter shapes a Claude `Bash` payload and spawns the Claude preflight. It then translates the returned envelope into Cursor's own permission envelope.

The `postToolUse` entry is a shared multiplexed proxy for two concerns. A `Shell` call reaches the dispatch audit, and a `Write` call reaches the post-edit-quality concern.

`.cursor/hooks.json` registers the preflight under `preToolUse` with the `Shell` matcher and a 10-second timeout. It registers the proxy under `postToolUse` by its real path under `system-spec-kit`. This folder's link is for browsing only, because nothing loads through it.

Claude, Codex, Devin and Cursor register a command-hook preflight, while DSH, OpenCode, Vibe and Pi enforce in-process. Only Cursor registers the proxy, and Pi registers its own `post-edit-quality.ts` and `dispatch-audit.ts` instead.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dispatch-preflight-lint.mjs` | The `preToolUse` shim. It spawns the Claude preflight and translates the reply. |
| `post-tool-use.mjs` | A link to the shared `postToolUse` proxy. |

The preflight reads `dispatch-guard` through `isHookEnabled` and approves at once when that concern is off. It renames the tool to `Bash` and spawns `.skilled/hooks/cli-dispatch/claude/dispatch-preflight-lint.mjs` with a 5-second timeout. A deny returns `{permission: 'deny'}` with the agent and user messages, then exits 2. A warn returns `{permission: 'allow', agent_message}` and carries the advisory text. A spawn or parse error approves the call.

`post-tool-use.mjs` is a link to `../../../skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs`, which multiplexes `postToolUse`. A `Shell` call normalizes to `Bash` and parses the stringified `tool_output`. It then spawns the Claude audit adapter. A `Write` call spawns the post-edit-quality adapter. Each branch fails open. A spawn or parse error on one branch never affects the tool call. It leaves the other branch untouched. A failure in `main` writes one `post-tool-use:` line to stderr and then approves.

`SYSTEM_DISPATCH_DISABLED` silences the preflight and the audit branch. `SK_CODE_POST_EDIT_QUALITY_DISABLED` silences the post-edit branch alone.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/shared/hook-stdin-deadline.test.mjs
node --test .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs
```

The first suite holds the Cursor preflight to its stdin deadline. It also pins the normal payload. The second asserts that every runtime with a preflight adapter has it registered.

---

## 4. RELATED

- [`../README.md`](../README.md): the dispatch concern, the shared cores and the full rule list.
- [`../claude/dispatch-preflight-lint.mjs`](../claude/dispatch-preflight-lint.mjs): the Claude preflight this adapter spawns.
- [`../../../skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs`](../../../skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs): the real proxy this folder links to.
