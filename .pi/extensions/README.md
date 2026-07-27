---
title: "Pi Extensions: Guard-Core Bridges"
description: "Pi CLI extension factories that bridge this repo's shared runtime-neutral guard cores into Pi's native lifecycle-event API."
trigger_phrases:
  - "pi extensions"
  - "pi guard bridges"
  - "pi extension factories"
---

# Pi Extensions: Guard-Core Bridges

---

## 1. OVERVIEW

`.pi/extensions/` holds Pi's native TypeScript extension factories for this repository. Pi auto-discovers every `*.ts` file here with no `.pi/settings.json` registration required, and calls each file's default export once at session start with an `ExtensionAPI` handle.

Each file is a thin adapter: it registers a handler against one of Pi's lifecycle events (`pi.on(event, handler)`) and delegates the actual decision to the same shared, runtime-neutral guard-core module `cli-cursor`'s `hooks.json` and `cli-devin`'s `hooks.v1.json` already call. No guard logic is reimplemented here. Every handler wraps its call in try/catch and fails open: a guard-core bug must never block or alter work it only observes.

---

## 2. DIRECTORY TREE

```text
extensions/
+-- spec-gate-enforce.ts        # Blocks a mutation the spec gate denies
+-- spec-gate-classify.ts       # Appends the spec-folder gate question to a user turn
+-- dispatch-preflight-lint.ts  # Blocks or warns on a bash dispatch hard-rule violation
+-- dispatch-audit.ts           # Records a completed bash dispatch to the audit log
+-- post-edit-quality.ts        # Appends post-edit quality findings to an edit/write result
+-- mcp-route-guard.ts          # Attaches route warnings to a native mcp_* tool call
`-- README.md
```

---

## 3. KEY FILES

| File | Pi event | Delegates to |
|---|---|---|
| `spec-gate-enforce.ts` | `tool_call` (bash/write/edit) | `system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` `evaluateMutation()` |
| `spec-gate-classify.ts` | `input` | `system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` `classifyIntent()` |
| `dispatch-preflight-lint.ts` | `tool_call` (bash) | `cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs` `readHardRules()`/`evaluate()` |
| `dispatch-audit.ts` | `tool_result` (bash) | `cli-external-orchestration/cli-opencode/scripts/lib/dispatch-audit.mjs` `recordDispatch()` |
| `post-edit-quality.ts` | `tool_result` (edit/write) | `sk-code/code-quality/scripts/lib/post-edit-router.cjs` `resolveDispatch()`/`runChecks()` |
| `mcp-route-guard.ts` | `tool_call` (`mcp_*`) | `mcp-code-mode/runtime/lib/mcp-route-guard.cjs` `evaluateNativeMcpCall()` |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Each file imports only `ExtensionAPI` (type-only) plus its one shared guard-core module, resolved via a relative `../../.opencode/...` path. |
| Exports | Exactly one default-exported `ExtensionFactory` per file. No named exports. |
| Ownership | Guard decisions belong to the shared `.mjs`/`.cjs` core modules under `.opencode/`. These files own only event registration and the fail-open wrapper. |
| Fail-open | Every handler body is wrapped in try/catch. A caught error returns `undefined` (or `{ action: "continue" }` for `input` handlers), never a block. |

Main flow:

```text
Pi lifecycle event (tool_call / tool_result / input)
        |
        v
This file's pi.on(event, handler)
        |
        v
Dynamic import() of the shared guard-core module
        |
        v
Guard-core decision (allow / block / warn)
        |
        v
Handler returns the decision to Pi, or undefined on any error (fail open)
```

`code-graph-freshness.ts` was removed when `system-code-graph` was decommissioned. The 6 files above are the current, complete set.

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `specGateEnforce` | Default export | Registers the `tool_call` spec-gate enforcement handler. |
| `specGateClassify` | Default export | Registers the `input` spec-gate classification handler. |
| `dispatchPreflightLint` | Default export | Registers the `tool_call` dispatch hard-rule lint handler. |
| `dispatchAudit` | Default export | Registers the `tool_result` dispatch audit-log handler. |
| `postEditQuality` | Default export | Registers the `tool_result` post-edit quality handler. |
| `mcpRouteGuard` | Default export | Registers the `tool_call` MCP route-guard handler. |

---

## 6. VALIDATION

Run from the repository root. A live Pi session that starts without a startup error confirms every extension loaded and parsed correctly. An invalid export fails the whole session.

```bash
pi --offline --approve -p "list your available tools"
```

Expected result: the session completes and lists Pi's available tools, with no extension-load error in the output.

---

## 7. RELATED

- [`../../.opencode/skills/cli-external-orchestration/cli-pi/references/pi-tools.md`](../../.opencode/skills/cli-external-orchestration/cli-pi/references/pi-tools.md): how this extension surface compares to `cli-cursor`'s `hooks.json` and `cli-devin`'s `hooks.v1.json`
- [`../../.opencode/skills/cli-external-orchestration/cli-pi/references/native-skills-and-extensions.md`](../../.opencode/skills/cli-external-orchestration/cli-pi/references/native-skills-and-extensions.md): confirmed-vs-open discovery and lifecycle-event details
- [`../../.opencode/skills/sk-code/code-opencode/SKILL.md`](../../.opencode/skills/sk-code/code-opencode/SKILL.md): TypeScript standards this folder follows
