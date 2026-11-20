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

`.pi/extensions/` is where Pi finds the hook adapters this repository registers. Pi scans the top-level `*.ts` files in the folder and calls each file's default export with an `ExtensionAPI` handle. Nothing here needs a line in the `extensions` list of [`.pi/settings.json`](../settings.json).

All 22 entries are plain files that `sync-hook-registrations.cjs` renders from one template. Each imports its adapter inside an async factory and hands Pi to it. The adapter holds the handlers, so a behavior change belongs in the adapter or in the core it calls, and a change to the entry belongs in the template. When the import fails, because the Skilled checkout is missing or out of date, the entry turns its hook off. Pi then shows one notice for the session that names every such entry and the first error, in place of one load error per entry. An adapter that throws while it registers is not caught, so Pi still reports it as a load error. The folder holds one symlink, `lib/claude-hook-adapter.ts`, and Pi never loads it as an entry. The two session bridges import the same adapter at its real path under `.skilled/`, so the link is there for browsing only.

The adapters live with the concern that owns them. The guard adapters sit under `.skilled/hooks/<concern>/pi/`, and the rest sit in a `pi/` folder under the skill that owns them. The shared cores and the link folders are indexed in the [hook library README](../../.skilled/hooks/README.md).

Most adapters are thin. `goal-context.ts` also registers the `goal-pi` command, so goal state can be read and changed from the prompt. `prompt-advisor.ts` calls the compiled advisor module in process, because Pi waits for `input` handlers and a spawned hook would stall every prompt. `session-compact-context.ts` ports the recovery chain for the same in-process reason, and its `session_compact` event already carries the summary a spawned hook would have to rebuild.

The rule every entry follows: a handler that throws returns `undefined` and the call proceeds. `git-message-gate` is the exception: when the sk-git rulebook exists but cannot be read, it refuses the command. Six entries can refuse a call, and each one is named in section 5.

Two local packages sit beside the entries. `pi-cache-optimizer/` and `pi-fast-mode-w-subagent-support/` are full plugins with their own code and README. Pi loads each one through the `packages` list in [`.pi/settings.json`](../settings.json), not through the folder scan.

---

## 2. ARCHITECTURE

```text
Pi event (input, tool_call, tool_result, session_start, ...)
        |
        v
.pi/extensions/<entry>.ts          rendered entry, imports the adapter
        |
        v
.skilled/.../pi/<adapter>.ts       registers pi.on(event, handler)
        |
        +--> shared guard core under .skilled/hooks/     allow, block or warn
        |
        +--> Claude hook dist file, spawned with stdin   text or JSON envelope
        |
        +--> in-process work (command, port, ctx.exec)
        |
        v
undefined (fail open), { block, reason }, an appended block or pi.sendMessage()
```

Dependency direction: entry, then adapter, then core. An adapter never imports another concern's adapter, and no entry imports anything but its one target.

The folder has two chains. A guard chain builds a payload and asks a shared core, which returns the decision. A lifecycle chain either spawns a Claude hook dist file through `lib/claude-hook-adapter.ts` or runs the equivalent work in process. The core or the dist file owns the policy in every case.

---

## 3. DIRECTORY TREE

```text
extensions/
+-- README.md                      # this file
+-- spec-gate-enforce.ts           # Refuses a mutation the spec gate denies
+-- spec-gate-classify.ts          # Opens the gate and asks nothing
+-- dispatch-preflight-lint.ts     # Blocks or warns on a dispatch hard-rule breach
+-- dispatch-audit.ts              # Records a completed dispatch
+-- post-edit-quality.ts           # Appends post-edit findings and a stale-dist banner
+-- completion-evidence.ts         # Queues an unevidenced claim onto the next prompt
+-- classifier-injection-screen.ts # Appends the injection-screen advisory
+-- decision-capture.ts            # Queues each answer and counts what is pending
+-- ask-surface-guard.ts           # Sends a prose option menu back to be asked properly
+-- mcp-route-guard.ts             # Returns MCP route warnings on the call
+-- env-secret-guard.ts            # Refuses dotenv access and cleans up after a write
+-- overlay-guard.ts               # Refuses a write to an overlay-owned file
+-- task-dispatch-guard.ts         # Returns the dispatch-guard text for a subagent call
+-- session-start-context.ts       # Bridges session-prime context
+-- session-start-advisories.ts    # Runs the startup advisory checks
+-- session-stop-context.ts        # Runs the quit autosave and state cleanup
+-- session-handover.ts            # Nudges a handover and arms the relaunch record
+-- session-compact-context.ts     # Rehydrates continuity after a compaction
+-- prompt-advisor.ts              # Appends the advisor brief to the visible prompt
+-- goal-context.ts                # Injects the goal brief and registers goal-pi
+-- git-preflight-advisory.ts      # Appends sk-git advisories to a git command
+-- git-message-gate.ts            # Refuses a message or branch that breaks the templates
+-- lib/
|   +-- claude-hook-adapter.ts    # Symlink to the Pi spawn proxy
|   `-- README.md                  # The adapter's own README
+-- pi-cache-optimizer/            # Local package, loaded from settings
`-- pi-fast-mode-w-subagent-support/   # Local package, loaded from settings
```

---

## 4. ENTRY MAP

| Entry | Event | Real file or core | Effect |
|---|---|---|---|
| `spec-gate-enforce.ts` | `tool_call` on `bash`, `write` and `edit` | `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | The first `write` or `edit` opens the A/B/C/D dialog when a UI is attached. A denied call returns `{ block: true, reason }`. |
| `spec-gate-classify.ts` | `input` | `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Opens the gate on a write-intent turn and asks nothing. With no UI it appends the one-shot deferral instruction to the prompt. |
| `dispatch-preflight-lint.ts` | `input`, `tool_call` on `bash` | `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` | Blocks a dispatch that breaks a hard rule in the target skill's `SKILL.md`, and returns a warning as a `reason` when the rule only warns. |
| `dispatch-audit.ts` | `tool_result` on `bash` | `.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs` | Writes a redacted record of a completed dispatch to the shared audit log and leaves the result alone. |
| `post-edit-quality.ts` | `tool_result` on `edit` and `write` | `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | Appends the routed checks' findings and a stale-dist banner to the tool result. |
| `completion-evidence.ts` | `turn_end` | `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs` | Holds a claim that lacks evidence and sends it as context with the next prompt. Never blocks. |
| `classifier-injection-screen.ts` | `tool_result` on `fetch_content` | `.skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs` | Appends one advisory block when fetched text reads like instructions aimed at the agent. |
| `decision-capture.ts` | `tool_result` on `question` and `ask_user_question`, `turn_end` | `.skilled/hooks/decision-capture/bin/sweep-pi.mjs`, `.skilled/hooks/decision-capture/lib/capture-core.mjs` | Queues each answer for the decision record. At the end of an interactive turn it notifies the number of answers still pending. |
| `ask-surface-guard.ts` | `agent_end` | `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs` | When a run ends in a typed option menu and no question tool ran, starts one follow-up turn that asks through it. Requires a UI. |
| `mcp-route-guard.ts` | `tool_call` on `mcp_*` | `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs` | Returns the route warnings as a `reason` on the call. |
| `env-secret-guard.ts` | `tool_call`, `tool_result` | `.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs`, `.skilled/hooks/env-secret-guard/lib/env-secret-watch.cjs` | Refuses a call that would touch a dotenv file. It also undoes a dotenv write and redacts a dotenv value out of the result. |
| `overlay-guard.ts` | `tool_call` on `edit` and `write` | `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs` | Refuses a write to a file a vendored tree's overlay owns. |
| `task-dispatch-guard.ts` | `tool_call` on `subagent` | `.skilled/hooks/subagent-dispatch-guard/lib/subagent-dispatch-guard.cjs` | Returns the guard's text as a `reason` and always lets the call run. Direct `subagent` calls only. |
| `session-start-context.ts` | `session_start` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js` through `lib/claude-hook-adapter.ts` | Adds the session-prime context to model context with `display: false`. |
| `session-start-advisories.ts` | `session_start` on `startup` and `new` | six checks under `.skilled/bin/` and `.skilled/skills/sk-code/sk-code-quality/scripts/` | Runs each check through `ctx.exec()` and shows a warning through the UI. Silent in print mode. |
| `session-stop-context.ts` | `session_shutdown` with reason `quit` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-stop.js` through `lib/claude-hook-adapter.ts` | Runs the autosave and state cleanup. Adds no context. |
| `session-handover.ts` | `message_end`, `before_agent_start`, `turn_end`, `agent_end`, `agent_settled`, `agent_start`, `tool_call`, `session_compact` | `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Nudges a handover near the context limit, steers a held nudge into a running loop, refuses a question dialog while the record can be armed and arms the record. |
| `session-compact-context.ts` | `session_compact` | in-process port that reads `.skilled/skills/system-spec-kit/runtime/dist/lib/spec/packet-purpose.js` | Adds the compaction summary and the packet purpose to model context with `display: false`, followed by the active spec folder. |
| `prompt-advisor.ts` | `input`, with a reset on `session_start` and `session_compact` | `.skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js` | Appends the advisor brief to the visible prompt on the first turn and after a boundary. A proven same-content repeat is left untouched. |
| `goal-context.ts` | `input`, `session_start`, `turn_end`, and the `goal-pi` command | `.skilled/hooks/goal/lib/goal-core.cjs` | Appends the goal brief to the visible prompt and restores it at session start. The verify nudge waits for the next prompt. |
| `git-preflight-advisory.ts` | `tool_call` and `tool_result` on `bash` | `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` with `.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs` and `git-context.mjs` | Appends sk-git advisories to a completed `git` command. Queued at the call, delivered on the result. |
| `git-message-gate.ts` | `tool_call` on `bash` | `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | Refuses a commit message, PR description or branch name that breaks the sk-git templates. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | An adapter imports Pi's types from the `@earendil-works/pi-coding-agent` package and its own core by relative path. The git advisory also imports the cli-dispatch rule checks. It never reaches into another concern's adapter. |
| Ownership | A guard decision belongs to the core under `.skilled/hooks/`. A lifecycle decision belongs to the Claude dist file, or to the ported chain in `session-compact-context.ts`. An adapter owns the registration and the fail-open wrapper. |
| Failure | Every handler body is wrapped in try/catch. A throw returns `undefined` and the call proceeds, except in `git-message-gate.ts`, which blocks when the sk-git rulebook exists but cannot be read. `spec-gate-classify.ts` returns `{ action: "continue" }`. `env-secret-guard.ts` also writes the error to stderr, so a broken core cannot leave calls unguarded in silence. |
| Refusals | Six entries can refuse a call: `spec-gate-enforce.ts`, `dispatch-preflight-lint.ts`, `env-secret-guard.ts`, `overlay-guard.ts`, `git-message-gate.ts` and the `tool_call` handler in `session-handover.ts`. Every other entry advises, records or injects. |
| Delivery | An `input` transform and an appended tool-result block reach the model. `pi.sendMessage` with `display: false` keeps text out of the visible chat. Pi's agent core keeps a `tool_call` return only for `block`, so a bare `reason` changes nothing on its own. |

The last rule matters for every advisory that never blocks. `mcp-route-guard.ts` and `task-dispatch-guard.ts` return a `reason` without a `block`, and the warn path in `dispatch-preflight-lint.ts` does the same, so that text never reaches the model. The call still runs. The other advisory entries deliver their text on a channel Pi reads, such as an appended tool result or `sendMessage`.

`git-message-gate.ts` has no kill switch, by design. No surface offers a bypass for its rules. `prompt-advisor.ts` reads no switch of its own, and a proven repeat is suppressed through `SPECKIT_PI_DIRECTIVE_DEDUP` instead.

---

## 6. CONFIGURATION

Most switches below resolve through `.skilled/hooks/shared/hook-flags.cjs`.

| Switch | Effect |
|---|---|
| `SYSTEM_HOOKS_DISABLED=1` | Master off switch for every adapter that reads a hook flag. |
| `SYSTEM_ASK_SURFACE_DISABLED=1` | Stops the follow-up turn. |
| `SYSTEM_INJECTION_SCREEN_DISABLED=1` | Stops the fetch advisory. |
| `SYSTEM_DECISION_CAPTURE_DISABLED=1` | Stops the decision queue and the pending count. |
| `CLI_DISPATCH_AUDIT_DISABLED=1` | Stops the dispatch audit record. |
| `SYSTEM_DISPATCH_GUARD_DISABLED=1` | Stops the dispatch lint. |
| `SYSTEM_ENV_SECRET_GUARD_DISABLED=1` | Stops the dotenv guard. |
| `SYSTEM_OVERLAY_GUARD_DISABLED=1` | Stops the overlay guard. |
| `SYSTEM_TASK_DISPATCH_DISABLED=1` | Stops the dispatch advisory. |
| `MCP_ROUTE_GUARD_DISABLED=1` | Stops the MCP route warnings. |
| `SYSTEM_COMPLETION_DISABLED=1` | Stops the completion advisory. |
| `SK_CODE_POST_EDIT_QUALITY_DISABLED=1` | Stops the post-edit findings. |
| `SYSTEM_SESSION_LIFECYCLE_DISABLED=1` | Stops every session-lifecycle adapter. |
| `SYSTEM_SPEC_GATE_ENFORCE=1` | Read by the spec-gate core. Turns an open gate into a block on `write` and `edit`. |
| `OPENCODE_GOAL_DISABLED=1` | Stops the goal handlers. |
| `SYSTEM_SESSION_HANDOVER_ENABLED=1` | Turns the handover on. The global name works for every runtime. It ships off for Pi. |
| `SYSTEM_SESSION_HANDOVER_PI_ENABLED=1` | Turns the handover on for Pi alone. It answers before the global name. |
| `SYSTEM_SESSION_HANDOVER_DISABLED=1` | Turns the handover off. |
| `SK_GIT_PREFLIGHT_DISABLED=1` | Stops the git advisories. |
| `SKGIT_ADVISORY=0` | Read by the sk-git advisory. Silences it without disabling the entry. |
| `SKGIT_ADVISORY_SKIP=<rule-id>` | Read by the sk-git advisory. Silences one advisory id, or the ids that extend it with a dash. |
| `SPECKIT_PI_DIRECTIVE_DEDUP=0` | Restores the full advisor brief on every turn. |

The `packages` list in `.pi/settings.json` is the other setting this folder depends on. It names the two local packages by folder, and Pi loads the `pi.extensions` entry of each `package.json` from there.

---

## 7. VALIDATION

Run from the repository root. The first command covers the goal entry and its command.

```bash
node --test .skilled/hooks/goal/pi/goal-pi.test.mjs
```

Expected result: `pass 29` and `fail 0`, with exit code 0.

The second command runs five of the Pi suites that sit under `.skilled/hooks/`, where the hooks config collects them.

```bash
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts \
  .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.test.ts \
  .skilled/hooks/classifier-injection-screen/pi/classifier-injection-screen.test.ts \
  .skilled/hooks/decision-capture/pi/decision-capture.test.ts \
  .skilled/hooks/cli-dispatch/pi/dispatch-preflight-lint.test.ts \
  .skilled/hooks/cli-dispatch/pi/directive-dedup.test.ts
```

Expected result: `Test Files 5 passed (5)` and `Tests 295 passed (295)`.

The third command proves that every entry still resolves. It reads the hook registry, compares the Pi bindings with this folder and checks that each entry matches the rendered template and names an existing adapter. Without `--check` it rewrites a drifted entry, an older one-line re-export included.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
```

Expected result: `[hook-registration-sync] PASS: 4 registration files match the 36-hook registry; 22 Pi extensions resolve.` with exit code 0.

---

## 8. RELATED

- [Pi settings](../settings.json): the `packages` list and the empty `extensions` list.
- [The Pi extension sync manifest](../SYNC.md): what in this folder is generated, linked or authored.
- [The lib adapter README](lib/README.md): the spawn proxy the two session bridges import.
- [The hook library README](../../.skilled/hooks/README.md): the shared cores and the coverage matrix.
- [The injection contract](../../.skilled/hooks/injection-contract.md): what each bridge injects and how visible it is per runtime.
- [The spec-kit Pi hook README](../../.skilled/skills/system-spec-kit/runtime/hooks/pi/README.md): the adapters for the gate and the session.
- [The sk-git Pi hook README](../../.skilled/skills/sk-git/scripts/hooks/pi/README.md): the message gate and the git advisory.
- [The cache optimizer README](pi-cache-optimizer/README.md): the local cache package.
- [The fast mode README](pi-fast-mode-w-subagent-support/README.md): the local fast-mode package.
- [The Pi runtime reference](../../.skilled/skills/cli-external-orchestration/cli-pi/references/native-skills-and-extensions.md): discovery details for this extension surface.
