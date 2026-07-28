---
title: "Pi Extensions Lib: Claude Hook Adapter"
description: "Pi-specific proxy utilities that spawn the Claude lifecycle-hook dist files for the session-lifecycle extension bridges."
trigger_phrases:
  - "pi extensions lib"
  - "claude hook adapter"
  - "pi lifecycle proxy"
---

# Pi Extensions Lib: Claude Hook Adapter

---

## 1. OVERVIEW

`.pi/extensions/lib/` holds the shared utilities the session-lifecycle extension bridges in the parent directory import. Pi only auto-discovers `*.ts` files at the top of `.pi/extensions/`, so files in this subdirectory are plain modules, never extension factories. Like the extensions themselves, `claude-hook-adapter.ts` here is a relative symlink; the real file lives at `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/lib/claude-hook-adapter.ts`.

The single module here mirrors what `system-spec-kit/mcp-server/hooks/devin/shared.ts` and `hooks/cursor/shared.ts` do for their runtimes: it spawns the Claude lifecycle-hook dist files with a synthesized payload on stdin, so session-prime, session-stop, and user-prompt-submit state semantics stay owned by one lifecycle implementation across all four runtimes.

---

## 2. DIRECTORY TREE

```text
lib/
+-- claude-hook-adapter.ts  # spawnSync proxy + JSON-envelope parser
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `claude-hook-adapter.ts` | `runClaudeHookAdapter()` spawns a named Claude hook dist file with a bounded JSON payload and returns its trimmed stdout, or null on any spawn failure. `extractAdditionalContext()` parses the `{ hookSpecificOutput: { additionalContext } }` envelope emitted by `user-prompt-submit.js` only. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Node built-ins only (`child_process`, `path`). No Pi types, no guard-core modules. |
| Exports | Named exports only. No default export, so Pi's extension loader never mistakes this module for a factory. |
| Ownership | Lifecycle behavior belongs to the dist files under `system-spec-kit/mcp-server/dist/hooks/claude/`. This module owns only process spawning, payload serialization, and output parsing. |
| Fail-open | Every failure path returns null. Callers treat null as "no context available" and continue. |

Main flow:

```text
Session-lifecycle extension (../session-*.ts, ../prompt-advisor.ts)
        |
        v
runClaudeHookAdapter(projectDir, filename, payload, timeoutMs)
        |
        v
spawnSync(node, <dist hook>, payload on stdin, bounded stdio)
        |
        v
Raw stdout text back to the caller (or extractAdditionalContext()
for the one JSON-envelope hook), or null on any failure
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `runClaudeHookAdapter` | Named export | Spawns `session-prime.js`, `session-stop.js`, or `user-prompt-submit.js` with a synthesized payload. |
| `extractAdditionalContext` | Named export | Parses the JSON envelope from `user-prompt-submit.js` stdout. |
| `ClaudeHookPayload` | Named type export | Bounded payload shape accepted by the dist hooks. |

---

## 6. VALIDATION

Run from the repository root. The parent directory's live-session check covers this module transitively, because every session-lifecycle extension imports it at load time.

```bash
pi --offline --approve -p "list your available tools" </dev/null
```

Expected result: the session completes with no extension-load error.

---

## 7. RELATED

- [`../README.md`](../README.md): the full extension surface this module serves
- [`claude-hook-adapter.ts`](claude-hook-adapter.ts)
