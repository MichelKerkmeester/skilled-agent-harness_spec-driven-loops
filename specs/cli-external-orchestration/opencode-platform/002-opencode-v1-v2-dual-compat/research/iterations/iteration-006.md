# Iteration 6 — A4b: v2 event and session contract ground truth

## Focus

Settle iteration 4's open P0s about the v2 event and session contract from **primary** sources rather than from the one reference plugin. Target: `scratch/cli-help/v2-openapi.json` starting at `/api/event`, plus the real `@opencode/plugin` 2.0.32 declarations in `scratch/a2-v2pkg/package/dist/promise/`. Five questions: (1) every v2 event `type` and its `data` fields; (2) whether idle and compaction signals replace v1's `session.idle` and `session.compacted`; (3) the v2 names for `permission.asked`, `question.*` and `message.part.updated`; (4) the real 2.0.32 signatures for the message-read methods the two gate plugins need, the `execute.after` payload, and the `context` hook event; (5) whether v2 tolerates an extra key on a plugin definition.

## Actions Taken

1. Enumerated all 119 documented paths and all 293 `components.schemas` entries in `scratch/cli-help/v2-openapi.json`, then read the `/api/event` operation end to end.
2. Resolved the `/api/event` response schema and followed its single `$ref` to `V2EventEncoded`.
3. Grepped the same spec for every quoted dotted literal matching a plausible event or RPC namespace, across 36 namespace prefixes, to test whether any event-type enum is published anywhere in the contract.
4. Read the real 2.0.32 declarations for the domains this port depends on: `session.d.ts` (145 lines, in full), `tool.d.ts` (in full), `plugin.d.ts` (in full), `event.d.ts`, `index.d.ts`, and the package manifest.
5. Verified what the two message-reading repo consumers actually call, by reading `.skilled/plugins/system-spec-gate.js:88`–`94` and `.skilled/plugins/system-completion-sentinel.js:76`–`82`.

## Findings

### F1 (P0) — 2.0.32 has no message-read method and no `client` on the context; both gate plugins degrade silently

`SessionDomain` is a closed pick, not an open client:

```ts
export type SessionDomain = Pick<SessionApi, "create" | "get" | "remove" | "switchAgent" | "switchModel" | "prompt" | "generate" | "command" | "compact" | "synthetic" | "interrupt" | "update" | "move" | "wait" | "context"> & { readonly hook: ModelHooks<SessionHooks>; };
```

[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/session.d.ts:145]

Sixteen methods, and no message-read among them. Worse, the v1 surface the fleet actually uses is not there at all: the 2.0.32 `Context` lists 27 typed domains and **none is named `client`** [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts:25].

Both consumers call exactly that v1 shape:

- `const result = await ctx?.client?.session?.messages?.({ path: { id: sessionID }, query: { directory: projectDir, limit: 20 } })` [SOURCE: .skilled/plugins/system-spec-gate.js:90]
- `if (!client || !client.session || typeof client.session.messages !== 'function') return null;` then `client.session.messages({ path: { id: sessionID }, query: { limit: MESSAGE_FETCH_LIMIT } })` [SOURCE: .skilled/plugins/system-completion-sentinel.js:77] [SOURCE: .skilled/plugins/system-completion-sentinel.js:79]

The failure mode is the dangerous one. Both call sites are written defensively — optional chaining on one, an explicit function check on the other — so on v2 they do not throw, do not warn, and do not log. `fetchLastUserPromptViaClient` returns `null`, which by its own contract means "no prompt found, i.e. the gate stays closed (allow)" [SOURCE: .skilled/plugins/system-spec-gate.js:81]. `resolveLastAssistantText` returns `null` and "the caller no-ops" [SOURCE: .skilled/plugins/system-completion-sentinel.js:66]. So a naive port leaves the spec gate permanently open and the completion sentinel permanently silent, with **zero observable signal that anything is wrong**. Any version-aware port must convert these defensive guards into positive capability assertions, because the existing guards are precisely what hides the break.

The only contract-level way a v2 plugin ever sees message history is the `context` hook (F3), which fires per model request rather than on demand. So the port shape is a cache populated from `session.hook("context", …)` and read synchronously thereafter — not a drop-in method swap.

### F2 (P0) — The exact 2.0.32 `execute.after` payload, and it is a tool hook, not a session hook

```ts
readonly "execute.after": {
    readonly tool: string;
    readonly sessionID: Session.ID;
    readonly agent: Agent.ID;
    readonly messageID: SessionMessage.ID;
    readonly id: Tool.CallID;
    readonly input: unknown;
} & ({ readonly status: "completed"; result: Tool.Result; } | { readonly status: "error"; error: Tool.Error; });
```

[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/tool.d.ts:38]

This settles iteration 3's open question "does it still expose the tool result body, and under which key": yes, under `result: Tool.Result`, discriminated from `error: Tool.Error` by the `status` tag `"completed" | "error"`. `input` is `unknown`, so a port must narrow it per tool. `tool` is a bare `string`, not an object, so the name lookup the fleet does from a v1 tool object does not translate directly.

It also corrects a naming error carried since iteration 3: this hook is registered on `ctx.tool.hook(...)` — `readonly hook: Hooks<ToolHooks>` lives on `ToolDomain` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/tool.d.ts:60], and the session's own `SessionHooks` set contains no `execute.after` at all. `ctx.session.hook("execute.after")` does not exist.

### F3 (P0) — The `context` hook event is `SessionContext`, `system` is mutable, and it is the only message-history door

`SessionContext extends SessionRequest`, so its fields are `sessionID`, `model: Model.Ref`, `system: Array<SystemPart>`, `messages: Array<Message>` and `options: SessionRequestOptions` — deliberately **not** `readonly`, so the object is the plugin's to mutate — plus `agent: Agent.ID` and `tools: Record<string, { description: string; input: JsonSchema }>` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/session.d.ts:29]. The `system` block type the brief asked about is `SystemPart`, imported from `@opencode/ai` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/session.d.ts:3].

Two consequences. The v1 pattern of injecting context by re-prompting collapses into rewriting `context.system` in place, which is strictly cheaper and race-free. And because `SessionContext` is the only structure carrying `messages`, it is both the message-read substitute from F1 and the injection point for skill-advisor — one hook now serves two jobs that were two different v1 mechanisms.

### F4 (P0) — Compaction is a hook in v2, not an event; `session.idle` has no contract-level peer

`SessionHooks` includes `compaction: SessionCompaction`, and `SessionCompaction extends SessionContext` adds `result?: SessionCompactionResult`, documented as "Set to use this compaction and skip the model request" [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/session.d.ts:42]. `SessionRequestKind` corroborates the taxonomy as `"primary" | "compaction" | "title" | "generate"`.

So the answer to iteration 4's question "does v2 emit any compaction event at all, and what should replace `session.compacted`" is: **there is no compaction-completed event**, but there is a compaction *interception* hook that runs before the request and can supply the summary itself. For skill-advisor's context re-injection this is a better primitive than the v1 event it replaces — mutate `context.system` on the compaction request instead of re-arming afterwards. For spec-gate's re-arm there is no peer at all, because a pre-request hook cannot fire after the fact.

For idle there is no event either; the closest contract primitives are the `wait` method on `SessionDomain` (`session.wait`, `POST /api/experimental/session/{sessionID}/wait`) and, empirically from iteration 4, the `session.execution.*` family. Iteration 4's derivation via `session.execution.succeeded|failed|interrupted` therefore remains the only *push* candidate, and it stays unconfirmed against 2.0.32 at runtime. `system-completion-sentinel`, whose entire behaviour hangs on `session.idle`, has no contract-level replacement — this stays a P0 open item until observed empirically.

### F5 (P1) — The contract types no event names, and declares the stream lossy by design

`/api/event` (`operationId: event.subscribe`) returns `text/event-stream` whose message schema is `{ id: string | null, event: string, data: V2EventEncoded }` with `additionalProperties: false`, and `V2EventEncoded` resolves to nothing more than `{ "type": "string", "contentMediaType": "application/json" }` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-openapi.json:1].

The grep across 36 event-ish namespace prefixes returned only RPC method identifiers (`session.prompt`, `tool.use`, `session.compact`, `plugin.check`, …) — i.e. the plugin-RPC channel the operation description mentions — and **not one native event type name**. There is no event enum anywhere in the 293 schemas.

Two conclusions. First, focus questions (1) and (3) are **not answerable from the contract**: the v2 event vocabulary is deliberately opaque, so any v1→v2 event map must come from runtime observation, and the v1 `permission.asked` / `question.*` / `message.part.updated` renames stay observation-only for now. Second, and load-bearing for design: the operation description states the stream is "Volatile by contract: a slow consumer overflows and fails the stream, and events during disconnection are missed." A dual-version plugin therefore cannot treat an event as a ledger entry — every consumer must be idempotent and reconcilable from state, which is a stronger requirement than the fleet's current v1 code meets.

### F6 (P1) — `Plugin` is `{id, setup}`, and 2.0.32's `Context` has no `client`, `tui`, `ui`, `data`, `attention` or `renderer`

```ts
export interface Plugin { readonly id: string; readonly setup: (context: Context) => Promise<Cleanup | void> | Cleanup | void; }
export declare function define(plugin: Plugin): Plugin;
```

[SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts:56] [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts:60]

Keys beyond `id`/`setup` are rejected only by TypeScript's excess-property check on object literals, so runtime tolerance is **UNVERIFIED** — `Plugin.define` is a plain declaration with no runtime validator visible in the `.d.ts`. Iteration 1's accepted `{id, setup, server}` probe still stands as the empirical answer; the `__test` variant was not re-probed this iteration (see SCOPE VIOLATIONS), and `/api/plugin/check` (`operationId: plugin.check`) is the documented route that would settle it without a custom probe directory.

Critically, and contrary to iteration 3's note: **`Context` has no `tui` and no `ui` key** [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts:25]. Its 27 keys are `app`, `location`, `options`, `agent`, `aisdk`, `command`, `credential`, `event`, `experimental`, `integration`, `mcp`, `model`, `generate`, `permission`, `plugin`, `provider`, `reference`, `rpc`, `session`, `shell`, `skill`, `storage`, `tool`, `vcs`, `websearch`, `worktree`. `ctx.tui` is therefore closed as a dead end, confirming iteration 4's F7 conclusion from the opposite direction: toast rendering is reachable only through the separate `./tui` export, never from a server plugin. `EventDomain` likewise is only `Pick<EventApi, "subscribe">` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/event.d.ts:4], so the `ctx.data`, `ctx.attention` and `ctx.renderer` surfaces iteration 4 saw in the docs are TUI-context-only.

### F7 (P2) — Seven v2 capabilities have no v1 peer and must be treated as optional, not parity

Beyond the ported domains, 2.0.32 adds `plugin: Pick<PluginApi, "list">`, `rpc`, `storage`, `worktree`, `vcs`, `reference`, `generate`, and `experimental.terminal: Pick<OpenCodeClient["experimental"]["persistentPty"], "read">` [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts:42]. A shared module that reaches for any of these must branch on presence, since v1 has no counterpart for them at all — the mirror image of F1's v1-only `client`.

## Questions Answered

Scope questions from the iteration brief:

1. **Every v2 event `type` and its `data` fields** — **NOT ENUMERABLE from the contract** (F5). `data` is an opaque `V2EventEncoded` JSON string; no event name appears in 293 schemas.
2. **Idle and compaction replacements** — **answered.** No idle event and no compaction event exist in the contract; compaction is a pre-request *hook* with a settable `result`, and idle's only push candidate remains the unconfirmed `session.execution.*` derivation (F4).
3. **v1 `permission.asked` / `question.*` / `message.part.updated` → v2 names** — **NOT ANSWERABLE from the contract** (F5); remains observation-only.
4. **Real 2.0.32 signatures** — **answered.** No `session` message-read method exists and `Context` has no `client` (F1); `execute.after` payload fixed exactly (F2); `context` hook event is `SessionContext` with a mutable `system: SystemPart[]` (F3).
5. **Does v2 tolerate an extra `__test` key** — **not probed this iteration** (SCOPE VIOLATIONS). Contract evidence narrows it: `define` is type-level only, and `plugin.check` is the sanctioned settlement route.

No strategy key question is fully closed by this iteration; it converts four P0 unknowns into precise, citable shapes and removes one plausible-looking dead end (`ctx.tui`).

## Questions Remaining

- `session.idle`: is `session.execution.*` emitted by 2.0.32 at all, and is `session.wait` usable as a completion signal for `system-completion-sentinel`? (P0, runtime-only)
- Does the event stream carry the native event names at all, or is it RPC-frames only? Needs a live `GET /api/event` capture. (P0)
- Does v2's loader accept extra top-level keys on the definition? Settle via `plugin.check` rather than a custom probe dir. (P0)
- Is `ctx.session.hook("context")` invoked for compaction and title requests too (`SessionRequestKind`), and can appending to `system` there replace skill-advisor's re-injection on all four kinds? (P1)
- `SystemPart` shape — read from `@opencode/ai`, not yet read. Blocks writing any `context` mutation. (P1)
- Which of the 16 plugins can reach a message cache populated from `context` early enough to matter, given that `context` fires only at request time? (P1)
- Carried forward unchanged: v1/v2 `plugin` vs `plugins` config keys; `.opencode/plugins/` discovery unions; flat-file loading on v2; `sk-vision.js` symlink following; `run --format json` schema; `ORCA_OPENCODE_PLUGIN_API` host-derived replacement; the `Reload` mixin.

## Next Focus

**A4c — empirical v2 event capture.** Three of this iteration's remaining P0s are unanswerable from documents and need one live measurement: subscribe to `/api/event` on a 2.0.32 instance, drive one prompt through a throwaway project, and record the raw frame sequence. That single capture would settle the idle question (F4), the event-name inventory (F5), the RPC-versus-native framing question, and the `permission`/`question` renames in one pass — it is the highest-leverage remaining action in the A4 track.

Note that the reducer-owned strategy section 11 already points at **A5** (agent frontmatter). Both are queued; A4c is cheaper and now blocks more open P0s.

## SCOPE VIOLATIONS

Two planned actions from the iteration brief were **not executed** because each required creating files outside the allowed-write list (only `iterations/iteration-006.md`, `deltas/iter-006.jsonl`, and the append gateway are writable):

1. **The `__test` plugin-definition probe.** The brief asked to write a probe plugin into `scratch/` and read the plugin's `state` back from `opencode2 api GET /api/plugin?location[directory]=…`. Creating that probe directory is an out-of-scope write, so it was skipped. Not executed, not approximated.
2. **The `opencode2 api GET "/api/plugin"` call itself.** It requires the same non-existent probe directory as its `location[directory]` argument, so no meaningful call was possible.

Substitute evidence used instead, both read-only: the real `plugin.d.ts` declaration showing `define` is type-level only (F6), and the presence of `plugin.check` in the contract as the sanctioned settlement route. The `__test` question therefore stays open and is carried forward rather than silently marked resolved.
