---
title: "Runtime Lib: MCP Route Guard Core"
description: "Runtime-neutral policy that decides whether a native external MCP call should carry a Code Mode routing advisory."
---

# Runtime Lib: MCP Route Guard Core

---

## 1. OVERVIEW

`runtime/lib/` owns the runtime-neutral mcp-route-guard policy shared by every adapter. It parses a tool name for either Claude's `mcp__<server>__<tool>` shape or OpenCode's bare `<server>_<tool>` shape, normalizes the server token so a manifest manual name and its live connector spelling collide onto the same family id, exempts internal `mk_`-prefixed servers, and checks an mtime-cached `.utcp_config.json` manifest for a matching Code Mode manual. The only two decisions it can return are `allow` and `warn`, and it never touches stdout, stderr, or a permission decision itself, leaving transport to the calling adapter.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `mcp-route-guard.cjs` | Exports `evaluateNativeMcpCall` plus the name-normalization and manifest-loading helpers. Fails open (`allow`) on a missing kill-switch bypass, a missing or unparsable tool name, an unresolvable manifest, or any internal error. |
| `mcp-route-guard.test.cjs` | A dependency-free `node:assert` test runner (no framework) covering table-driven `evaluateNativeMcpCall` decisions, name normalization, manifest fail-open paths, the mtime cache, the broad-mode and kill-switch env flags, and Claude hook stdin integration. |

## 3. CONSUMERS

- `.opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs`
- `.opencode/skills/mcp-code-mode/runtime/hooks/codex/mcp-route-guard.cjs`
- `.opencode/plugins/mk-mcp-route-guard.js` (OpenCode plugin adapter, outside this skill)

## 4. VALIDATION

Run from the repository root:

```bash
node .opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.test.cjs
```

Expected result: `[mcp-route-guard] <passed>/<total> assertions passed` with `passed` equal to the total.

## 5. RELATED

- [`../hooks/claude/README.md`](../hooks/claude/README.md)
- [`../hooks/codex/README.md`](../hooks/codex/README.md)
