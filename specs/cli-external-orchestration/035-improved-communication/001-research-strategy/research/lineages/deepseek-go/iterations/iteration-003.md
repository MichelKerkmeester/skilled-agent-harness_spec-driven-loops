# Iteration 3: Safest integration boundary in Pi CLI and OpenCode CLI

## Focus

Establish the safest display-projection boundary for Pi CLI (extension rendering vs JSON/RPC) and OpenCode CLI (HTTP server SSE vs plugin events), with primary-source evidence.

## Actions Taken

- Read Pi extension documentation (https://pi.dev/docs/latest/extensions) and extracted renderer, event, and mode facts.
- Read OpenCode server documentation (https://opencode.ai/docs/server/) and extracted the HTTP/SSE/OpenAPI surface.
- Read repo-local cli-pi native-skills-and-extensions.md and cli-opencode cli-reference.md.

## Findings

1. **Pi extension API is a live-confirmed renderer surface (confirmed)** — Pi auto-discovers `.pi/extensions/*.ts` and `~/.pi/agent/extensions/*.ts` (project-local after trust; global always), and extension factories call `pi.on(event, handler)`, `pi.registerTool()`, `pi.registerCommand()`, etc. Custom rendering is documented via `pi.registerMessageRenderer(customType, renderer)`, `pi.registerMarkdownTransformer(transformer)`, `pi.registerEntryRenderer(customType, renderer)`. Tools can provide `renderCall(args, theme, context)` and `renderResult(result, options, theme, context)` returning TUI `Component`s; if a slot renderer is omitted, the built-in renderer is used. [SOURCE: https://pi.dev/docs/latest/extensions]

2. **Pi `message_end` can replace a finalized assistant message (confirmed)** — "`message_end` handlers can return `{ message }` to replace the finalized message. The replacement must keep the same `role`." This is a native whole-message replacement surface that parallels Claude's `displayContent`. [SOURCE: https://pi.dev/docs/latest/extensions]

3. **Pi message streaming events (confirmed)** — `message_start`, `message_update` (assistant streaming updates, with `assistantMessageEvent` token-by-token stream), and `message_end` fire for message lifecycle. Parallel tool mode emits `tool_execution_start` in assistant source order, `tool_execution_update` may interleave, `tool_execution_end` in completion order, and final toolResult message events later in assistant source order. [SOURCE: https://pi.dev/docs/latest/extensions]

4. **Pi tool events are mutation-capable (confirmed)** — `tool_call` can block (`{block:true, reason?, terminate?}`) and its `event.input` is mutable; `tool_result` can modify `content`, `details`, `isError`, `usage` via chained middleware. This means Pi extensions can alter what the model sees — a semantic-mutation surface that display projection must NOT use. [SOURCE: https://pi.dev/docs/latest/extensions]

5. **Pi has JSON event-stream mode and RPC mode (confirmed)** — Pi exposes `--mode json` (JSON event stream), RPC mode, SDK, and `ctx.mode` ∈ `"tui" | "rpc" | "json" | "print"`. RPC mode surfaces commands via `get_commands` (repo-local confirmation, phases 012/013). A client that owns the pipeline (json/rpc mode) can render arbitrary presentation because it IS the consumer. [SOURCE: https://pi.dev/docs/latest/extensions + file:.opencode/skills/cli-external-orchestration/cli-pi/references/native-skills-and-extensions.md:63]

6. **Pi extension fail-closed startup (confirmed)** — an invalid extension export fails the whole session at startup; the six real guard extensions fail open internally (try/catch). An invalid extension is fail-closed at startup, distinct from the internal fail-open discipline. [SOURCE: file:.opencode/skills/cli-external-orchestration/cli-pi/references/native-skills-and-extensions.md:71-73]

7. **OpenCode server is a full HTTP/OpenAPI surface (confirmed)** — `opencode serve` exposes an OpenAPI 3.1 spec at `/doc`, plus `GET /global/event` (SSE global events) and `GET /event` (SSE stream; first event `server.connected`, then bus events). Session APIs: create/list/get, `POST /session/:id/message` (returns `{info: Message, parts: Part[]}`), `POST /session/:id/prompt_async` (204 no-wait), `POST /session/:id/abort`, `POST /session/:id/fork`, `POST /session/:id/revert`. Basic auth via `OPENCODE_SERVER_PASSWORD`. [SOURCE: https://opencode.ai/docs/server/]

8. **OpenCode event model preserves parts (confirmed)** — messages are `{info, parts}` where parts are the displayable/structured segments. A server/SDK client consumes message parts and renders them locally — the safest arbitrary-presentation boundary. The TUI itself is "a client that talks to the server," so owning the server stream is a first-class architecture. [SOURCE: https://opencode.ai/docs/server/]

9. **OpenCode ACP server exists (confirmed)** — `opencode acp` starts an Agent Client Protocol server (cli-reference.md:75), a specialized integration path distinct from the HTTP server. ACP provides a shared client pattern usable across OpenCode, Devin, and Cursor. [SOURCE: file:.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:75]

10. **OpenCode plugin events observe but do not document renderer replacement (inferred)** — plugin hooks (e.g. session lifecycle) observe messages but the server/SSE docs do not document a display-replacement output for assistant messages. The plan's inference that plugins "observe messages but do not document a generic safe renderer replacement" stands; plugins are not the projection surface. [SOURCE: file:.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md + https://opencode.ai/docs/server/]

11. **Pi renderers are the only documented native "generic renderer override" across the six CLIs (confirmed)** — `renderCall`/`renderResult` separate tool execution from display, and `registerMessageRenderer`/`registerEntryRenderer` control custom message/entry appearance in the TUI. This is the reference's native `MessageDisplay` analogue. [SOURCE: https://pi.dev/docs/latest/extensions]

## Questions Answered

- Q2 (4/6 CLIs): Pi CLI — native extension renderers (`renderCall`/`renderResult`, `message_end` replacement, `registerMessageRenderer`) for presentation, or own the `--mode json`/RPC pipeline; OpenCode CLI — server/SDK/ACP client consuming `/event` SSE and message `parts` for local rendering; plugin events are observational only.

## Questions Remaining

- Q2: Devin and Cursor boundaries (iteration 4).
- Q3-Q8: unchanged.

## Next Focus

Establish the safest boundary for Devin CLI (`devin acp`) and Cursor CLI (`agent acp` / `afterAgentResponse`), then define the normalized event/message model that preserves canonical state across all six.

## Assessment

- newInfoRatio: 0.72
- noveltyJustification: Two more CLI surfaces confirmed, including Pi's unique native renderer override and OpenCode's server/SSE/parts model, neither of which the phase packet fully detailed.
- Confidence: High for Pi extension API and OpenCode server (official primary sources). OpenCode plugin renderer-replacement remains inferred.

## Reflection

What worked: fetched primary docs plus repo-local live-confirmation notes (Pi extensions, 2026-07-28) cross-confirmed surfaces.
What failed / ruled out:
- Pi `tool_call`/`tool_result` mutation for projection: changes model-visible inputs/results (confirmed, ruled out).
- OpenCode plugin hooks as renderer replacement: not documented (inferred, ruled out).
- `thread/inject_items` style semantic mutation: already ruled out in iteration 2.
Ruled out: none additional.
