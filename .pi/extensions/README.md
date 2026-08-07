---
title: "Pi Extensions: Guard-Core Bridges"
description: "Pi CLI extension factories that bridge this repo's shared guard cores and Claude lifecycle hooks into Pi's native lifecycle-event API."
trigger_phrases:
  - "pi extensions"
  - "pi guard bridges"
  - "pi extension factories"
---

# Pi Extensions: Guard-Core Bridges

---

## 1. OVERVIEW

`.pi/extensions/` is Pi's discovery mirror for this repository's hook extensions. Pi auto-discovers every `*.ts` entry here with no `.pi/settings.json` registration required, and calls each file's default export once at session start with an `ExtensionAPI` handle. Every `*.ts` entry is a **relative symlink** to the real file in its owner's tree (probe-verified: Pi's loader accepts symlinks and resolves each extension's relative imports against the symlink path, so imports stay written for this folder as base). The real files live with their owners:

| Symlink here | Real file |
|---|---|
| `dispatch-preflight-lint.ts`, `dispatch-audit.ts` | `.opencode/hooks/dispatch/pi/` |
| `mcp-route-guard.ts` | `.opencode/hooks/mcp-route-guard/pi/` |
| `post-edit-quality.ts` | `.opencode/hooks/post-edit-quality/pi/` |
| `spec-gate-{classify,enforce}.ts`, `session-{start,stop,compact}-context.ts`, `session-start-advisories.ts` | `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/` |
| `lib/claude-hook-adapter.ts` | `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/lib/` |
| `prompt-advisor.ts` | `.opencode/skills/system-skill-advisor/hooks/pi/` |
| `git-preflight-advisory.ts` | `.opencode/skills/sk-git/scripts/hooks/pi/` |

Each file is a thin adapter: it registers a handler against one of Pi's lifecycle events (`pi.on(event, handler)`). The 6 tool_call/tool_result/input adapters delegate to the same shared, runtime-neutral guard-core modules `cli-cursor`'s `hooks.json` and `cli-devin`'s `hooks.v1.json` already call. Four of the five session-lifecycle adapters (`session-start-context.ts`, `session-start-advisories.ts`, `session-stop-context.ts`, `session-compact-context.ts`) proxy into the Claude lifecycle-hook dist files under `system-spec-kit/mcp-server/dist/hooks/claude/` via `lib/claude-hook-adapter.ts` -- the same lifecycle owner devin and cursor already proxy into via their own runtime-specific `spawnSync` adapters, so state and transcript semantics never drift across runtimes. `prompt-advisor.ts` is the exception: it imports the compiled advisor lifecycle module (`system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js`) directly and calls `handleClaudeUserPromptSubmit()` in-process, because Pi awaits `input` handlers before agent processing begins and the old two-process `spawnSync` bridge blocked every send. No guard or lifecycle logic is reimplemented here. Every handler wraps its call in try/catch and fails open: a guard-core or lifecycle-bridge bug must never block or alter work it only observes.

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
+-- session-start-context.ts    # Bridges session-prime's SessionStart context into the session
+-- session-start-advisories.ts # Runs the 4 warn-only SessionStart CLI checks devin/cursor wire in
+-- session-stop-context.ts     # Bridges session-stop's autosave/state-cleanup on quit
+-- prompt-advisor.ts           # Bridges the skill-advisor's UserPromptSubmit recommendation (in-process)
+-- session-compact-context.ts  # Rehydrates spec-folder continuity after a compaction
+-- git-preflight-advisory.ts   # Warn-only git-outcome advisories on bash git commands
+-- lib/
|   `-- claude-hook-adapter.ts  # Pi-specific spawnSync proxy into the Claude lifecycle-hook dist files
`-- README.md                   # (this file and lib/README.md are the only real files here; all *.ts are symlinks)
```

---

## 3. KEY FILES

| File | Pi event | Delegates to |
|---|---|---|
| `spec-gate-enforce.ts` | `tool_call` (bash/write/edit) | `system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs` `evaluateMutation()` |
| `spec-gate-classify.ts` | `input` | `system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs` `classifyIntent()` |
| `dispatch-preflight-lint.ts` | `tool_call` (bash) | `.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs` `readHardRules()`/`evaluate()` |
| `dispatch-audit.ts` | `tool_result` (bash) | `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` `recordDispatch()` |
| `post-edit-quality.ts` | `tool_result` (edit/write) | `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs` `resolveDispatch()`/`runChecks()` |
| `mcp-route-guard.ts` | `tool_call` (`mcp_*`) | `.opencode/hooks/mcp-route-guard/lib/mcp-route-guard.cjs` `evaluateNativeMcpCall()` |
| `session-start-context.ts` | `session_start` | `system-spec-kit/mcp-server/dist/hooks/claude/session-prime.js` (via `lib/claude-hook-adapter.ts`) |
| `session-start-advisories.ts` | `session_start` | `worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh --all`, `install-codex-hooks.mjs --check` (direct `ctx.exec()`) |
| `session-stop-context.ts` | `session_shutdown` (reason `quit`) | `system-spec-kit/mcp-server/dist/hooks/claude/session-stop.js` (via `lib/claude-hook-adapter.ts`) |
| `prompt-advisor.ts` | `input` | `system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js` `handleClaudeUserPromptSubmit()` (in-process dynamic import) |
| `session-compact-context.ts` | `session_compact` | Native port of `mcp-server/hooks/devin/post-compaction.cjs`'s recovery chain (shared tmpdir state file + `spec-memory.cjs` CLI fallback) |

Paths without a leading `.opencode/` are relative to `.opencode/skills/`. The four `.opencode/hooks/` cores are the fully-portable guard cores relocated out of their owning skill; see [`../../.opencode/hooks/README.md`](../../.opencode/hooks/README.md) for why those four moved and the rest did not.

---

## 3A. CONFIRMED NON-GAPS

Two devin/cursor hooks have no Pi equivalent because Pi's own architecture does not have the gap they close, not because they were skipped:

| Hook | Why it does not apply to Pi |
|---|---|
| `permission-request-policy.mjs` (devin) | Composes the same `spec-gate-core.isExemptTargetPath` and `dispatch-rule-checks.evaluate` cores `spec-gate-enforce.ts` and `dispatch-preflight-lint.ts` already call at `tool_call` time. Pi's real, type-confirmed event API (`dist/core/extensions/types.d.ts`) has no separate approval-gate event distinct from the block-capable `tool_call` -- the functional intent is already covered at the same decision point. |
| `spec-gate-prebind.mjs` (cursor) | Exists only because Cursor does not deliver its prompt-classification event under the CLI, so SessionStart is the only place to establish gate state before the mutation guard runs. Pi's `input` event genuinely is that classification point (already bridged by `spec-gate-classify.ts`), so Pi never had the limitation this hook works around. |

`task-dispatch-guard` and `completion-evidence-stop.cjs` remain deliberately deferred, unchanged from the original hook-extension-layer phase.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Each file imports only `ExtensionAPI` (type-only) plus its one shared guard-core module (dynamic `import()`) or `lib/claude-hook-adapter.ts` (static import), resolved via a relative path. |
| Exports | Exactly one default-exported `ExtensionFactory` per file. No named exports. |
| Ownership | Guard decisions belong to the shared `.mjs`/`.cjs` core modules under `.opencode/`. Session-lifecycle decisions belong to the Claude hook dist files under `system-spec-kit/mcp-server/dist/hooks/claude/`. These files own only event registration, payload construction, and the fail-open wrapper. |
| Fail-open | Every handler body is wrapped in try/catch. A caught error returns `undefined` (`prompt-advisor.ts`, all others) or `{ action: "continue" }` (`spec-gate-classify.ts` only) for `input` handlers, never a block. |
| Output shape | `session-prime.js` writes plain text to stdout. `session-stop.js` writes nothing (side effects only, no top-level stdout emission). `user-prompt-submit.js` writes a `{ hookSpecificOutput: { additionalContext } }` JSON envelope. `lib/claude-hook-adapter.ts`'s `extractAdditionalContext()` only applies to the last one. `session-start-context.ts` uses `session-prime.js`'s raw stdout text directly. `prompt-advisor.ts` reads the same envelope from the in-process return value instead of spawned stdout. |

Two main flows:

```text
Guard-core adapters (tool_call / tool_result / input):
Pi lifecycle event -> pi.on(event, handler) -> dynamic import() of the shared guard-core
  module -> guard-core decision (allow / block / warn) -> handler returns the decision,
  or undefined on any error (fail open)

Session-lifecycle adapters (session_start / session_shutdown / session_compact; input is the exception):
Pi lifecycle event -> pi.on(event, handler) -> lib/claude-hook-adapter.ts spawns the
  matching Claude hook dist file with a synthesized payload on stdin -> raw text or
  JSON envelope read back -> pi.sendMessage() (or ctx.exec()/ctx.ui.notify() for the
  plain CLI checks), or undefined on any error (fail open)

In-process advisor (input, the exception):
Pi input event -> pi.on("input", handler) -> dynamic import of the compiled advisor
  hook module -> handleClaudeUserPromptSubmit(payload) -> envelope read from the
  return value -> { action: "transform" } with the additionalContext appended, or
  undefined on any error (fail open). No adapter/shim subprocess on this path — the advisor's own bounded python subprocess still runs on cache misses.
```


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
| `sessionStartContext` | Default export | Registers the `session_start` session-prime context bridge. |
| `sessionStartAdvisories` | Default export | Registers the `session_start` warn-only CLI check sweep. |
| `sessionStopContext` | Default export | Registers the `session_shutdown` autosave/state-cleanup bridge. |
| `promptAdvisor` | Default export | Registers the `input` skill-advisor recommendation bridge. |
| `sessionCompactContext` | Default export | Registers the `session_compact` spec-folder continuity rehydration. |
| `runClaudeHookAdapter`, `extractAdditionalContext` | Named exports | `lib/claude-hook-adapter.ts`'s spawnSync proxy and JSON-envelope parser, imported by the session-lifecycle adapters (session-start/stop); `prompt-advisor.ts` no longer uses it. |

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
- [`../../.opencode/skills/sk-code/sk-code-opencode/SKILL.md`](../../.opencode/skills/sk-code/sk-code-opencode/SKILL.md): TypeScript standards this folder follows
- [`../../.opencode/hooks/injection-contract.md`](../../.opencode/hooks/injection-contract.md): what each bridged hook actually injects, the visibility difference between Pi's `[MSG]` chat-transform bridges and every other runtime's `[SYS]` model-only channel, and how to inspect injected content per runtime
