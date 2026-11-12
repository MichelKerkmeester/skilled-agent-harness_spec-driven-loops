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

`.pi/extensions/` is Pi's discovery mirror for this repository's hook extensions. Pi auto-discovers every `*.ts` entry here with no `.pi/settings.json` registration required, and calls each file's default export once at session start with an `ExtensionAPI` handle. Every `*.ts` entry is a **one-line file that re-exports the real adapter** in its owner's tree; Pi discovers the adapter through that entry, so it loads from its real folder and its imports are relative to that folder. The real files live with their owners:

| Entry here | Real file |
|---|---|
| `dispatch-preflight-lint.ts`, `dispatch-audit.ts` | `.skilled/hooks/dispatch/pi/` |
| `task-dispatch-guard.ts` | `.skilled/hooks/task-dispatch/pi/` |
| `mcp-route-guard.ts` | `.skilled/hooks/mcp-route-guard/pi/` |
| `env-secret-guard.ts` | `.skilled/hooks/env-secret-guard/pi/` |
| `post-edit-quality.ts` | `.skilled/hooks/post-edit-quality/pi/` |
| `classifier-injection-screen.ts` | `.skilled/hooks/classifier-injection-screen/pi/` |
| `decision-capture.ts` | `.skilled/hooks/decision-capture/pi/` |
| `ask-surface-guard.ts` | `.skilled/hooks/ask-surface-guard/pi/` |
| `overlay-guard.ts` | `.skilled/hooks/overlay-guard/pi/` |
| `session-relaunch.ts` | `.skilled/hooks/session-relaunch/pi/` |
| `spec-gate-{classify,enforce}.ts`, `session-{start,stop,compact}-context.ts`, `session-start-advisories.ts`, `completion-evidence.ts` | `.skilled/skills/system-spec-kit/runtime/hooks/pi/` |
| `lib/claude-hook-adapter.ts` (not an entry: a symlink) | `.skilled/skills/system-spec-kit/runtime/hooks/pi/lib/` |
| `prompt-advisor.ts` | `.skilled/skills/system-skill-advisor/hooks/pi/` |
| `git-preflight-advisory.ts`, `git-message-gate.ts` | `.skilled/skills/sk-git/scripts/hooks/pi/` |
| `goal-context.ts` | `.skilled/hooks/goal/pi/goal-context.ts` |

Each file is a thin adapter: it registers a handler against one of Pi's lifecycle events (`pi.on(event, handler)`). `goal-context.ts` is the one exception to the adapter shape: it registers a command as well as lifecycle handlers, because Pi is the only runtime here where the goal surface is both an injection and a management command in the same extension. The 15 tool_call/tool_result/input adapters delegate to shared, runtime-neutral core modules under `.skilled/` that the sibling runtimes' bridges under the same concern folders also import, except `prompt-advisor.ts` below. Two of the five session-lifecycle adapters (`session-start-context.ts`, `session-stop-context.ts`) proxy into the Claude lifecycle-hook dist files under `system-spec-kit/runtime/dist/hooks/claude/` via `lib/claude-hook-adapter.ts` -- the same lifecycle owner devin and cursor already proxy into via their own runtime-specific `spawnSync` adapters, so state and transcript semantics never drift across runtimes. The other three do their own work in-process: `session-start-advisories.ts` runs the repository's own checks through `ctx.exec()`, `session-compact-context.ts` is a native port of the devin post-compaction recovery chain, and `session-relaunch.ts` calls its own shared relaunch core. `prompt-advisor.ts` is the exception: it imports the compiled advisor lifecycle module (`system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js`) directly and calls `handleClaudeUserPromptSubmit()` in-process, because Pi awaits `input` handlers before agent processing begins and the old two-process `spawnSync` bridge blocked every send. Its visible contribution is lifecycle-deduped: the advisor brief and Pi dispatch reminder render in full on the first message and after `session_start`/`session_compact`, while a proven same-content repeat returns no transform and leaves the raw turn byte-identical (`SPECKIT_PI_DIRECTIVE_DEDUP`, default ON; `0`/`false`/`off` restores always-full). The separate tool-call preflight still enforces dispatch authorization on every turn. Every handler wraps its call in try/catch and fails open: a guard-core or lifecycle-bridge bug must never block or alter work it only observes. `git-message-gate.ts` is the one deliberate blocker beside the dispatch preflight: it returns `{ block: true, reason }` when the shared sk-git gate refuses a commit message, PR description or branch name, and it fails open only when the gate itself cannot load.

---

## 2. DIRECTORY TREE

```text
extensions/
+-- spec-gate-enforce.ts        # Blocks a mutation the spec gate denies
+-- spec-gate-classify.ts       # Opens the gate silently; appends the one-shot deferral instruction when no dialog UI is attached
+-- dispatch-preflight-lint.ts  # Blocks or warns on a bash dispatch hard-rule violation
+-- dispatch-audit.ts           # Records a completed bash dispatch to the audit log
+-- post-edit-quality.ts        # Appends post-edit quality findings to an edit/write result
+-- completion-evidence.ts      # Queues the completion-evidence sentinel advisory onto the next turn when a claim lacks evidence
+-- classifier-injection-screen.ts  # Appends the Jev injection-screen advisory to a fetch_content result
+-- decision-capture.ts         # Queues each answered question for the decision record; shows the pending count at turn end
+-- ask-surface-guard.ts        # Sends a prose option menu back as a follow-up so it is asked through the question tool
+-- mcp-route-guard.ts          # Attaches route warnings to a native mcp_* tool call
+-- env-secret-guard.ts         # Blocks a read, write, edit, grep, bash or powershell call that would expose a dotenv file, then undoes a dotenv write and redacts a dotenv value from the result
+-- overlay-guard.ts            # Blocks an edit or write to a file a vendored tree's overlay owns
+-- task-dispatch-guard.ts      # Returns the dispatch-guard text for a direct subagent call (advisory)
+-- session-start-context.ts    # Bridges session-prime's SessionStart context into the session
+-- session-start-advisories.ts # Runs the SessionStart advisory checks devin/cursor wire in
+-- session-stop-context.ts     # Bridges session-stop's autosave/state-cleanup on quit
+-- prompt-advisor.ts           # Bridges the skill-advisor's UserPromptSubmit recommendation (in-process)
+-- session-relaunch.ts         # Nudges a context-limit handoff and arms the relaunch record
+-- session-compact-context.ts  # Rehydrates spec-folder continuity after a compaction
+-- goal-context.ts             # Injects the bound goal each turn and registers the `goal-pi` management command
+-- git-preflight-advisory.ts   # Warn-only git-outcome advisories on bash git commands
+-- git-message-gate.ts         # Blocks a commit message, PR description or branch name that breaks the sk-git templates
+-- lib/
|   `-- claude-hook-adapter.ts  # Pi-specific spawnSync proxy into the Claude lifecycle-hook dist files
`-- README.md                   # (this file, lib/README.md and every *.ts entry are real files; only lib/claude-hook-adapter.ts is a symlink)
```

---

## 3. KEY FILES

| File | Pi event | Delegates to |
|---|---|---|
| `spec-gate-enforce.ts` | `tool_call` (bash/write/edit) | `system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` `evaluateMutation()` |
| `spec-gate-classify.ts` | `input` | `system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` `classifyIntent()` |
| `dispatch-preflight-lint.ts` | `tool_call` (bash) | `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` `readHardRules()`/`evaluate()` |
| `dispatch-audit.ts` | `tool_result` (bash) | `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` `recordDispatch()` |
| `post-edit-quality.ts` | `tool_result` (edit/write) | `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` `resolveDispatch()`/`runChecks()` |
| `completion-evidence.ts` | `turn_end` | `system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs` `detectCompletionClaim()`/`resolveSpecFolderFromText()`/`evaluateCompletionEvidence()`; a completion claim the sentinel cannot evidence becomes a `nextTurn` advisory message, never a block |
| `env-secret-guard.ts` | `tool_call` (read/write/edit/grep/bash/powershell), `tool_result` (a dotenv write after a shell call; a leaked value from any tool) | `.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs` `evaluateToolCall()`; returns `{ block: true, reason }` on a dotenv file, and `.skilled/hooks/env-secret-guard/lib/env-secret-watch.cjs` `snapshotDotenv()` records dotenv files before a shell call. `reviewToolResult()` then undoes a dotenv write it recorded first and redacts a dotenv value out of the result, appending the reason as a message |
| `mcp-route-guard.ts` | `tool_call` (`mcp_*`) | `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs` `evaluateNativeMcpCall()` |
| `overlay-guard.ts` | `tool_call` (edit/write) | `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs` `fileFieldPath()`/`evaluateWrite()`; returns `{ block: true, reason }` when a vendored tree's overlay owns the target file |
| `classifier-injection-screen.ts` | `tool_result` (`fetch_content`) | `.skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs` `fetchedText()`/`screenAdvisory()`; appends the advisory to the tool result |
| `decision-capture.ts` | `tool_result` (`ask_user_question`, `question`), `turn_end` | `.skilled/hooks/decision-capture/bin/sweep-pi.mjs` `recoveredRecords()` and `.skilled/hooks/decision-capture/lib/capture-core.mjs` `appendRecords()`/`takeNudge()`; never changes a tool result |
| `ask-surface-guard.ts` | `agent_end` | `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs` `evaluateTurn()`/`markTurn()`/`repromptFor()`; starts one more turn that asks through the question tool in place of a prose option menu, and only when a UI is attached |
| `task-dispatch-guard.ts` | `tool_call` (`subagent`) | `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs` `evaluateDispatch()`; returns the guard's text as an advisory (`~ partial`: direct calls only) |
| `session-start-context.ts` | `session_start` | `system-spec-kit/runtime/dist/hooks/claude/session-prime.js` (via `lib/claude-hook-adapter.ts`) |
| `session-start-advisories.ts` | `session_start` | `worktree-guard.sh`, `check-git-hooks.sh`, `git-primary-reconcile.sh`, `git-live-follow.sh --start`, `check-dist-staleness.sh --all`, `install-codex-hooks.mjs --check` (direct `ctx.exec()`, each gated by its own concern) |
| `session-stop-context.ts` | `session_shutdown` (reason `quit`) | `system-spec-kit/runtime/dist/hooks/claude/session-stop.js` (via `lib/claude-hook-adapter.ts`) |
| `prompt-advisor.ts` | `input` | `system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js` `handleClaudeUserPromptSubmit()` (in-process dynamic import); full first + boundaries, no transform on proven repeats (`SPECKIT_PI_DIRECTIVE_DEDUP`) |
| `session-relaunch.ts` | `message_end`, `before_agent_start`, `agent_start`, `agent_end`, `agent_settled`, `session_compact` | `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` `readRelaunchFile()`/`armableRecord()`/`arm()`, with `context-usage.cjs`, `nudge.cjs` and `withdraw.cjs`; ships off until `SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED` is truthy |
| `session-compact-context.ts` | `session_compact` | Native port of `system-spec-kit/runtime/hooks/devin/post-compaction.cjs`'s recovery chain (shared tmpdir state file) |
| `goal-context.ts` | `input`, `session_start`, `turn_end`, and the `goal-pi` command | `.skilled/hooks/goal/lib/goal-core.cjs` `readGoalRecord()`/`renderGoalBrief()`/`verifyGoalHeuristic()`; the `turn_end` nudge uses `deliverAs: "nextTurn"` and never re-queues, steers or blocks a turn |
| `git-preflight-advisory.ts` | `tool_call` (bash `git`), `tool_result` (bash) | `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` `readHardRules()`/`evaluate()` with `sk-git/scripts/lib/git-rule-checks.mjs` and `git-context.mjs`; the advisory is queued at `tool_call` and appended at `tool_result`, because Pi reads a `tool_call` return only for `.block` |
| `git-message-gate.ts` | `tool_call` (bash) | `sk-git/scripts/hooks/git-message-gate.mjs` `evaluateCommand()`; returns `{ block: true, reason }` when a commit message, PR description or branch name breaks the templates; no kill switch, by design |

Paths without a leading `.skilled/` are relative to `.skilled/skills/`. The four `.skilled/hooks/` cores are the fully-portable guard cores relocated out of their owning skill; see [`../../.skilled/hooks/README.md`](../../.skilled/hooks/README.md) for why those four moved and the rest did not.

---

## 3A. CONFIRMED NON-GAPS

Two devin/cursor hooks have no Pi equivalent because Pi's own architecture does not have the gap they close, not because they were skipped:

| Hook | Why it does not apply to Pi |
|---|---|
| `permission-request-policy.mjs` (devin) | Composes the same `spec-gate-core.isExemptTargetPath` and `dispatch-rule-checks.evaluate` cores `spec-gate-enforce.ts` and `dispatch-preflight-lint.ts` already call at `tool_call` time. Pi's real, type-confirmed event API (`dist/core/extensions/types.d.ts`) has no separate approval-gate event distinct from the block-capable `tool_call` -- the functional intent is already covered at the same decision point. |
| `spec-gate-prebind.mjs` (cursor) | Exists only because Cursor does not deliver its prompt-classification event under the CLI, so SessionStart is the only place to establish gate state before the mutation guard runs. Pi's `input` event genuinely is that classification point (already bridged by `spec-gate-classify.ts`), so Pi never had the limitation this hook works around. |

`completion-evidence-stop.cjs` remains deliberately deferred, unchanged from the original hook-extension-layer phase. The `task-dispatch-guard` is wired as an advisory `tool_call` guard: it matches the native `subagent` tool and is `~ partial` — direct `subagent` calls only, workflow-nested (`runs.run`) dispatches are not covered.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Each file imports only `ExtensionAPI` (type-only) plus its one shared guard-core module (dynamic `import()`) or `lib/claude-hook-adapter.ts` (static import), resolved via a relative path. Each entry is a one-line re-export, so Pi 1.5.0 and Pi 1.5.2 both load the adapter from its real folder. |
| Exports | Exactly one default-exported `ExtensionFactory` per file. No named exports. |
| Ownership | Guard decisions belong to the shared `.mjs`/`.cjs` core modules under `.skilled/`. Session-lifecycle decisions belong to the Claude hook dist files under `system-spec-kit/runtime/dist/hooks/claude/`. These files own only event registration, payload construction, and the fail-open wrapper. |
| Fail-open | Every handler body is wrapped in try/catch. A caught error returns `undefined` (`prompt-advisor.ts`, all others) or `{ action: "continue" }` (`spec-gate-classify.ts` only) for `input` handlers, never a block. |
| Output shape | `session-prime.js` writes plain text to stdout. `session-stop.js` writes nothing (side effects only, no top-level stdout emission). `user-prompt-submit.js` writes a `{ hookSpecificOutput: { additionalContext } }` JSON envelope. `lib/claude-hook-adapter.ts`'s `extractAdditionalContext()` only applies to the last one. `session-start-context.ts` uses `session-prime.js`'s raw stdout text directly. `prompt-advisor.ts` reads the same envelope from the in-process return value instead of spawned stdout. |

Two main flows:

```text
Guard-core adapters (tool_call / tool_result / input):
Pi lifecycle event -> pi.on(event, handler) -> dynamic import() of the shared guard-core
  module -> guard-core decision (allow / block / warn) -> handler returns the decision,
  or undefined on any error (fail open)

Session-lifecycle adapters that spawn a Claude hook (session_start / session_shutdown only;
  the other session adapters -- advisories, compaction, relaunch -- run in-process):
Pi lifecycle event -> pi.on(event, handler) -> lib/claude-hook-adapter.ts spawns the
  matching Claude hook dist file with a synthesized payload on stdin -> raw text or
  JSON envelope read back -> pi.sendMessage() (or ctx.exec()/ctx.ui.notify() for the
  plain CLI checks), or undefined on any error (fail open)

In-process advisor (input, the exception):
Pi input event -> pi.on("input", handler) -> dynamic import of the compiled advisor
  hook module -> handleClaudeUserPromptSubmit(payload) -> envelope read from the
  return value -> { action: "transform" } with the complete advisor and dispatch
  contribution on first/boundary delivery, or undefined for a proven repeat or
  any error. No adapter/shim subprocess runs on this path — the advisor's own
  bounded python subprocess still runs on cache misses.
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
| `envSecretGuard` | Default export | Registers the `tool_call` dotenv block and the `tool_result` pass that undoes a dotenv write and redacts its value. |
| `mcpRouteGuard` | Default export | Registers the `tool_call` MCP route-guard handler. |
| `overlayGuard` | Default export | Registers the `tool_call` guard that blocks an edit or write to a file a vendored tree's overlay owns. |
| `classifierInjectionScreen` | Default export | Registers the `tool_result` injection-screen handler for `fetch_content`. |
| `taskDispatchGuard` | Default export | Registers the advisory `tool_call` dispatch guard for `subagent`. |
| `decisionCapture` | Default export | Registers the `tool_result` capture of answered questions for the decision record and the `turn_end` pending-count notice. |
| `completionEvidence` | Default export | Registers the `turn_end` advisory that queues a claim lacking evidence onto the next turn. |
| `askSurfaceGuard` | Default export | Registers the `agent_end` guard that sends a prose option menu back as a follow-up asked through the question tool. |
| `sessionStartContext` | Default export | Registers the `session_start` session-prime context bridge. |
| `sessionStartAdvisories` | Default export | Registers the `session_start` advisory-check sweep. |
| `sessionStopContext` | Default export | Registers the `session_shutdown` autosave/state-cleanup bridge. |
| `sessionRelaunch` | Default export | Registers the `message_end`, `before_agent_start`, `agent_start`, `agent_end`, `agent_settled` and `session_compact` handlers that nudge a context-limit handoff and arm the relaunch record. |
| `promptAdvisor` | Default export | Registers the `input` skill-advisor recommendation bridge. |
| `sessionCompactContext` | Default export | Registers the `session_compact` spec-folder continuity rehydration. |
| `goalContext` | Default export | Registers the `input`, `session_start` and `turn_end` goal injection handlers plus the `goal-pi` management command. |
| `gitPreflightAdvisory` | Default export | Registers the `tool_call` git advisory queued on a bash `git` command and appended at `tool_result`. |
| `gitMessageGate` | Default export | Registers the `tool_call` gate that blocks a commit message, PR description or branch name that breaks the sk-git templates. |
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

- [`../../.skilled/skills/cli-external-orchestration/cli-pi/references/pi-tools.md`](../../.skilled/skills/cli-external-orchestration/cli-pi/references/pi-tools.md): how this extension surface compares to `cli-cursor`'s `hooks.json` and `cli-devin`'s `hooks.v1.json`
- [`../../.skilled/skills/cli-external-orchestration/cli-pi/references/native-skills-and-extensions.md`](../../.skilled/skills/cli-external-orchestration/cli-pi/references/native-skills-and-extensions.md): confirmed-vs-open discovery and lifecycle-event details
- [`../../.skilled/skills/sk-code/sk-code-skilled/SKILL.md`](../../.skilled/skills/sk-code/sk-code-skilled/SKILL.md): TypeScript standards this folder follows
- [`../../.skilled/hooks/injection-contract.md`](../../.skilled/hooks/injection-contract.md): what each bridged hook actually injects, the visibility difference between Pi's `[MSG]` chat-transform bridges and every other runtime's `[SYS]` model-only channel, and how to inspect injected content per runtime
