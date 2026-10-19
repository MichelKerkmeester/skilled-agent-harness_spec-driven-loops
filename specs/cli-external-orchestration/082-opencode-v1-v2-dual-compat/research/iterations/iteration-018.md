# Iteration 018 — A3b: v2 port specs for the five hard plugins

**Focus.** Write an implementable v2 `setup(ctx)` design for the five plugins that cannot be ported by
renaming hooks, and settle the five open P0s. Evidence is the vendored 2.0.32 type pack at
`specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/`
and the 2.0.32 OpenAPI document at
`specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-openapi.json`.

## Actions Taken

1. Read the full 2.0.32 plugin type pack: `plugin.d.ts`, `session.d.ts`, `tool.d.ts`, `event.d.ts`,
   `registration.d.ts`, `rpc.d.ts`, `shell.d.ts`, `app.d.ts`, `options.d.ts`, `command.d.ts`,
   `skill.d.ts`, `index.d.ts`.
2. Read the v1 trigger surfaces of all five plugins (default export, hook keys, event types, client calls).
3. Followed the `$ref` chain of `GET /api/session/{sessionID}/message` in the 2.0.32 OpenAPI document.
4. Enumerated the v2 HTTP surface for `prompt`, `command`, `tui`/toast, `event` and `rpc`.

## Findings

### F1 — The v2 plugin context has no `client` field, and `SessionDomain` omits `messages` (P0)

The 2.0.32 `Context` interface exposes `app`, `location`, `options`, and 18 domains — there is **no
`client` and no `tui`** [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts:25].
`SessionDomain` is a closed `Pick` of sixteen `SessionApi` methods —
`create | get | remove | switchAgent | switchModel | prompt | generate | command | compact | synthetic |
interrupt | update | move | wait | context` — plus `hook` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/session.d.ts:143].
`messages` is **not** in that list. So the v1 call `ctx.client.session.messages(...)` used by the
sentinel [SOURCE: .opencode/plugins/system-completion-sentinel.js:79] and the spec gate
[SOURCE: .opencode/plugins/system-spec-gate.js:90] has no typed v2 equivalent at all — this is not a
signature change, it is a missing capability. The `GET /api/session/{sessionID}/message` route exists on
the wire, so the gap is the plugin-facing binding, not the server.

### F2 — P0 (1) settled: the v2 message list carries no `parts`

`GET /api/session/{sessionID}/message` → `200` → `$ref: #/components/schemas/SessionMessagesResponse`,
whose `data` is `{"type":"array","items":{"$ref":"#/components/schemas/Session.Message.Info"}}` plus a
`cursor` object. `Session.Message.Info` is an `anyOf` of eleven variants — `AgentSelected`,
ModelSelected`, `LocationSwitched`, `User`, `Synthetic`, `System`, `Skill`, `Shell`, `Assistant`,
`Compaction`, `Idle` — and **not one of them defines `parts`**. Assistant text lives at
`content: Array<{type:"text", text, state} | {type:"tool", ...} | {type:"reasoning", ...}>`
(`Session.Message.Assistant` keys: `id, metadata, time, type, agent, model, content, snapshot, finish,
rawFinish, providerState, cost, tokens, error, retry`); user text lives directly at `Session.Message.User.text`.
There is also **no `info` wrapper** — the v1 `{info, parts}` tuple is gone.
Evidence: `v2-openapi.json` `#/paths/~1api~1session~1{sessionID}~1message/get/responses/200`,
`#/components/schemas/SessionMessagesResponse`, `#/components/schemas/Session.Message.Info`,
`#/components/schemas/Session.Message.Assistant`, `#/components/schemas/Session.Message.User`.

Consequence for `system-completion-sentinel`: `textFromAssistantEntry` reading `entry?.parts`
[SOURCE: .opencode/plugins/system-completion-sentinel.js:56] and the `entry.info.role` test at
[SOURCE: .opencode/plugins/system-completion-sentinel.js:88] both silently yield `null` on v2, so the
plugin fails open forever. The port is: reverse-scan `data`, keep `type === "assistant"`, filter
`content` for `type === "text"`, join `.text`. The same `parts` assumption in the spec gate at
[SOURCE: .opencode/plugins/system-spec-gate.js:102] is replaced outright by F6.

### F3 — P0 (2) settled: `promptAsync` is `ctx.session.prompt` → `POST /api/session/{sessionID}/prompt`, and it returns before the turn

`prompt` **is** in the `SessionDomain` pick [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/session.d.ts:143].
The route `POST /api/session/{sessionID}/prompt` takes `{id?, text, files?, agents?, skills?, metadata?, ...}`
and returns `200` → `{data: $ref Session.Inbox.User}`. The delivery type is
`SessionInbox.Delivery = "steer" | "queue"`, and it is a *mutable* field on the session `prompt` hook
(`delivery: SessionInbox.Delivery`) [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/session.d.ts:18].
The response being an **inbox item** rather than an assistant message is the proof:
the call enqueues into the session inbox and returns, so it has `promptAsync` semantics, not
`prompt`-and-wait semantics. `opencode-goal`'s continuation gate at
[SOURCE: .opencode/plugins/opencode-goal.js:2697] keeps working if it is rewritten as
`await ctx.session.prompt({sessionID, text, delivery:"queue"})`; the surrounding deadline/abort logic
must be re-derived, because `ctx.session.prompt` does not accept the v1 `{path, body}` envelope.

### F4 — P0 (3) settled: there is no typed toast on v2

Four independent surfaces agree: (a) `Context` has no `tui` member
[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts:25];
(b) `EventDomain` is `Pick<EventApi,"subscribe">` — subscribe only, **no emit**
[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/event.d.ts:2];
(c) the OpenAPI document has no `/api/tui*` path and no `Tui`/`Toast` schema — the only related routes
are `/api/plugin`, `/api/plugin/check`, `/api/plugin/update`, `/api/rpc/{rpcID}/{method}`, `/api/event`;
(d) `RpcRegistration.events.emit` exists only for a definition the plugin itself registered
[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/rpc.d.ts:13].
The v1 call `input.client?.tui?.showToast` [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/plugin.ts:45]
therefore has no direct v2 port. Residual workaround, unproven: `ctx.rpc` is a full `RpcApi`
[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/rpc.d.ts:17],
so a host-registered `tui` RPC id reachable through `POST /api/rpc/{rpcID}/{method}` is the only
remaining channel; the method vocabulary is still unread. Cheap v2 port today: drop the toast and log.

### F5 — P0 (4) settled: the spec gate reads the prompt from `session.hook("prompt")`

`SessionHooks.prompt: SessionPrompt` carries `{sessionID, messageID, prompt: PromptInput.Prompt,
metadata?, delivery}` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/session.d.ts:13],
which is the real, typed user-prompt surface. That replaces both v1 workarounds at once: the
`experimental.chat.system.transform` input has no prompt field (the plugin's own comment says so at
[SOURCE: .opencode/plugins/system-spec-gate.js:73]) and the `ctx.client.session.messages` fallback.
Injection moves to `SessionHooks.context: SessionContext`, which gives `{sessionID, model, system:
Array<SystemPart>, messages: Array<Message>, options, agent, tools}`
[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/session.d.ts:29] —
so the v1 `output.system.push(...)` at [SOURCE: .opencode/plugins/system-spec-gate.js:240] becomes a
`system.push(...)`. Reading *and* writing in one hook removes the cross-hook session-key coupling that
`sessionIdFrom` exists to protect [SOURCE: .opencode/plugins/system-spec-gate.js:66].
Kind discrimination is NOT in `context`; it is a separate hook, `SessionModelRequest.kind:
SessionRequestKind = "primary"|"compaction"|"title"|"generate"`
[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/session.d.ts:56],
so "which request is this?" needs a second registration when it matters.

### F6 — P0 (5) settled: lifecycle is `setup`'s Cleanup plus per-hook `dispose`; the `Reload` mixin is gone

`Plugin.setup: (context) => Promise<Cleanup | void> | Cleanup | void` with
`Cleanup = () => Promise<void> | void` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts:55].
Every `hook()` and `transform()` returns `Promise<Registration>` and `Registration` is exactly
`{dispose(): Promise<void>}` — the 2.0.32 `registration.d.ts` has **no `Reload` interface**, closing a
carried P2 [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/registration.d.ts:1].
Reload is expressed per domain instead: `tool.reload()`, `command.reload()`, `skill.reload()`
[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/tool.d.ts:53].
Design rule: all module-level caches (`goalBriefCache`, `state.advisorCache`, `messageIdentity`,
`runtimeState`) must be *created inside* `setup` and reset in the returned Cleanup, and each captured
`Registration` should be disposed there too. The v1 `server.instance.disposed` / `global.disposed`
event pair that `system-skill-advisor` uses today
[SOURCE: .opencode/plugins/system-skill-advisor.js:1441] has no v2 replacement — Cleanup *is* the signal.

### F7 — `command.execute.before` has no v2 hook; `command.transform` + `execute` is the replacement

`CommandDomain` is `Pick<CommandApi,"list"> & {transform, reload}` — there is no `hook`
[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/command.d.ts:17].
The equivalent of intercepting a command is to *own* it: `transform(editor => editor.add({name,
description?, execute(input)}))` where `CommandInvocation = {sessionID, prompt: PromptInput.Prompt,
delivery}` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/command.d.ts:5].
This is a **semantic change** for `sk-vision`: v1 fires `"command.execute.before"`
[SOURCE: .skilled/skills/sk-vision/vision-runtime/src/plugin.ts:38] for commands it does not own; on v2 it
must register the vision command itself, so a user-defined command of the same name would collide
instead of being observed. A pure-observer port can instead hook `session.hook("prompt")` and inspect the
prompt parts, at the cost of no longer knowing whether the input matched a command.

### F8 — Uniform dual-shape export: the defect is narrower than assumed, but still unvalidated

`export interface Plugin { readonly id: string; readonly setup: (context: Context) => Promise<Cleanup|void>|Cleanup|void }`
[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts:56]
means a v2 definition needs exactly two properties. All five plugins export a bare async function
v1 consumes, e.g. [SOURCE: .opencode/plugins/system-completion-sentinel.js:119],
[SOURCE: .opencode/plugins/system-spec-gate.js:168],
[SOURCE: .opencode/plugins/system-skill-advisor.js:935],
[SOURCE: .opencode/plugins/opencode-goal.js:3187],
[SOURCE: .skilled/skills/sk-vision/vision-runtime/src/plugin.ts:62]. The uniform template is therefore
`export default Object.assign(v1Factory, { id, setup })`: callable for v1, `id`/`setup`-bearing for v2.
Whether the v2 loader validates structurally (reads the two keys) or by an exhaustive shape test that
rejects a callable-with-extras is still unproven; `POST /api/plugin/check` is the one call that settles
it, and it remains open. The v1 test surfaces hanging off the default export
(`MkCompletionSentinelPlugin.__test`, `MkSpecGatePlugin.__test`) are compatible with this shape.

### F9 — Options arrive differently, and `ctx.app.version` is the host discriminator

v1 plugins take `(ctx, rawOptions)` — `opencode-goal` relies on it at
[SOURCE: .opencode/plugins/opencode-goal.js:3187]. v2's `setup` receives one `Context`; per-plugin
options are `context.options: PluginOptions = Readonly<Record<string, any>>`
[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts:28]
and `context.app: {name, version, channel}`
[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/app.d.ts:1].
`ctx.app.version` is a real host-derived signal, which weakens the case for the env-gated
`ORCA_OPENCODE_PLUGIN_API` selector: the v2 leg can branch on its own version at `setup` time instead.

### F10 — Tool registration becomes a transform (P2, blocks `system-skill-advisor`'s one tool)

v1 registers tools as an object literal [SOURCE: .opencode/plugins/system-skill-advisor.js:1448]. v2 has
`tool.transform: Transform<ToolEditor>` and `ToolEditor.add<Input, Output>(tool: Info)`, with
`Info.execute(input, context: ToolContext)` where `ToolContext = {signal, progress, ...Tool.Context}`
[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/tool.d.ts:9].
So the port is `ctx.tool.transform(editor => editor.add({...}))`. `Info.Input` is constrained to
`Tool.ValueSchema<any>` from `@opencode/schema/tool`, which is **not vendored** in this pack — whether a
v1 zod-or-JSON-schema `args` passes that constraint is still unresolved (carried A10-Q4).

## Per-plugin v1 → v2 table

| Plugin | v1 trigger | v2 trigger | API calls | Remaining gap / workaround |
|---|---|---|---|---|
| `system-completion-sentinel.js` | `event` hook, `session.created` + `session.idle` [SOURCE: .opencode/plugins/system-completion-sentinel.js:124] | `ctx.event.subscribe` filtered to `session.idle` / `session.created` | none on v2: no `messages` [F1]; assistant text must be cached from `message.updated` payloads, or read `entry.content[].text` if a message list is ever bound [F2] | **Gap:** no typed message read at idle. Workaround: per-session assistant-text cache fed by the event stream; fails open exactly as today |
| `system-skill-advisor.js` | `event` (created/resumed/compacted/deleted/disposed), `experimental.chat.system.transform`, `tool` [SOURCE: .opencode/plugins/system-skill-advisor.js:1382] | `ctx.event.subscribe`; `ctx.session.hook("context")`; `ctx.tool.transform` | `ctx.tool.transform(e => e.add({...}))` [F10] | **Gap:** `compacted` has no v2 counterpart proven (carried); use `session.hook("context")` + `SessionModelRequest.kind === "compaction"` to re-inject. Disposal via Cleanup replaces `global.disposed` [F6] |
| `system-spec-gate.js` | `event` + `experimental.chat.system.transform` + `tool.execute.before` [SOURCE: .opencode/plugins/system-spec-gate.js:204] | `ctx.event.subscribe`; `ctx.session.hook("prompt")` (read); `ctx.session.hook("context")` (inject); `ctx.tool.hook("execute.before")` (deny) | `input.system: SystemPart[]`; `output.args` equivalent is `input.input` (mutable) [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/tool.d.ts:30] | **Closed:** prompt read and injection both have direct ports [F5]. Deny is still a throw in `execute.before` |
| `opencode-goal.js` | `event` (created/status/idle/deleted/message.updated) + `experimental.chat.system.transform` [SOURCE: .opencode/plugins/opencode-goal.js:3311] | same event names via `ctx.event.subscribe`; `ctx.session.hook("context")` | `ctx.session.prompt({sessionID, text, delivery:"queue"})` ≈ `POST /api/session/{sessionID}/prompt` → `Session.Inbox.User` [F3] | **Gap:** the v1 deadline/abort wrapper around `promptAsync.call` [SOURCE: .opencode/plugins/opencode-goal.js:2697] must be rebuilt; `session.status` must be re-confirmed on v2 |
| `sk-vision` | `command.execute.before` + `client.tui.showToast` [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/plugin.ts:38] | `ctx.command.transform(e => e.add({name, execute}))` — owns the command instead of observing it [F7] | no toast: no `ctx.tui`, no `/api/tui`, no emit on `ctx.event` [F4] | **Gap (irreducible today):** toast. Workaround: drop it, or reach a host `tui` RPC id via `ctx.rpc` (method vocabulary unread) |

## Questions Answered

- P0 (1) does the v2 message list include `parts`? **No.** `Session.Message.Info` has no `parts`; assistant text is `content[].text`, user text is `text`, and there is no `info` wrapper. (F2)
- P0 (2) `promptAsync` equivalent? **`ctx.session.prompt` → `POST /api/session/{sessionID}/prompt`**, returning `Session.Inbox.User`; `SessionInbox.Delivery = steer|queue` proves enqueue-and-return. (F3)
- P0 (3) toast on v2? **Neither route exists as typed API.** No `ctx.tui`, no `/api/tui`, subscribe-only `ctx.event`. (F4)
- P0 (4) how the spec gate reads the latest prompt? **`ctx.session.hook("prompt")`** with `SessionPrompt.prompt`; injection on `ctx.session.hook("context")`. (F5)
- P0 (5) where module state resets? **In `setup`'s returned `Cleanup`**, plus each `Registration.dispose()`; the `Reload` mixin no longer exists. (F6)
- Carried P2: does 2.0.32 still ship `Reload`? **No.** (F6)

## Questions Remaining

- Does `POST /api/plugin/check` accept `Object.assign(fn, {id, setup})`, or reject a callable with extra keys? (P0 for the uniform template)
- Is there any plugin-facing way to read session messages on 2.0.32 — a `SessionApi` method not in the `SessionDomain` pick, or a `ctx.rpc` method? (P0 for the sentinel and sk-vision transcript reads)
- What is `Tool.ValueSchema` — zod raw shape or JSON Schema? Decides whether one `args` definition serves both hosts. (P1)
- Does `SessionHooks.context` fire for `kind === "compaction"` and `"title"`, and does a push to `system` survive into the provider request? (P1, now the only injection route for two plugins)
- Does the v2 event stream actually deliver `session.idle`, `session.compacted`, `session.status` and `message.updated` to `ctx.event.subscribe`? (P0, runtime-only)
- What is the `tui` RPC id and method set behind `POST /api/rpc/{rpcID}/{method}`? (P1, the only surviving toast channel)
- `Location.Info` field names — which one replaces `ctx.directory`? (P2)

## Next Focus

A4: the remaining 11 plugins (the mechanical ports), plus consolidating A3b's per-plugin table into the
migration guide. The `plugin.check` probe and a live `ctx.event.subscribe` capture are the two cheapest
settlements and should be batched together.
