# Iteration 4: Devin CLI + Cursor CLI boundaries and the normalized event/message model

## Focus

Establish the safest display-projection boundary for Devin CLI (`devin acp`) and Cursor CLI (`agent acp` / hooks), then define the normalized event and message model that preserves canonical transcript, model context, tool events, and streaming across all six runtimes.

## Actions Taken

- Read the official Devin CLI commands reference (https://docs.devin.ai/cli/reference/commands), specifically the `devin acp` contract.
- Read the official Cursor CLI ACP reference (https://cursor.com/docs/cli/acp), including session flow, `session/update` notifications, and extension methods.
- Read repo-local cli-devin cli-reference.md and cli-cursor hook-contract.md.

## Findings

1. **`devin acp` is a first-class ACP server (confirmed)** — "Run Devin as an Agent Client Protocol (ACP) server over stdio... it speaks JSON-RPC over stdin/stdout and is not meant to be run interactively," invoked by ACP-aware editors/IDEs (Windsurf, Zed). Credentials from `WINDSURF_API_KEY` or stored `devin auth login`; accepts runtime credentials via the ACP `authenticate` request. The server advertises its full slash-command set over the protocol. [SOURCE: https://docs.devin.ai/cli/reference/commands]

2. **Devin `--export` provides ATIF conversation export (confirmed)** — `devin --export [PATH]` exports the conversation to a file after each turn in ATIF format. This is a canonical transcript-adjacent artifact, not a display surface; the ACP stream is the presentation path. [SOURCE: https://docs.devin.ai/cli/reference/commands]

3. **Cursor `agent acp` streams `session/update` with agent_message_chunk (confirmed)** — "Handle `session/update` notifications while the model streams output." The minimal client example reads `update.sessionUpdate === "agent_message_chunk"` and prints `update.content.text`. Transport is stdio JSON-RPC 2.0, newline-delimited. [SOURCE: https://cursor.com/docs/cli/acp]

4. **Cursor ACP has cancellation and permission surfaces (confirmed)** — Flow: `initialize` → `authenticate` (methodId `cursor_login`) → `session/new` (or `session/load`) → `session/prompt` → handle `session/update` → respond to `session/request_permission` (allow-once / allow-always / reject-once) → optionally `session/cancel`. Modes: `agent`, `plan`, `ask`. [SOURCE: https://cursor.com/docs/cli/acp]

5. **Cursor ACP extension methods (confirmed)** — Blocking: `cursor/ask_question`, `cursor/create_plan`. Notifications: `cursor/update_todos`, `cursor/task`, `cursor/generate_image`. These are client UX events that a projection client may display; none of them mutate canonical model context. [SOURCE: https://cursor.com/docs/cli/acp]

6. **Cursor CLI hooks are the editor's hooks, not a renderer (confirmed)** — Cursor CLI reads the same `hooks.json` as the Cursor editor; documented agent events include `sessionStart`, `sessionEnd`, `preToolUse`, `postToolUse`, `stop`, `afterAgentResponse`, `afterAgentThought`, etc. The response envelope is `{permission: allow|deny|ask, user_message, agent_message}` — a decision/notice surface, not assistant-output replacement. Live probing confirmed CLI delivery of `sessionStart`, `sessionEnd`, `preToolUse`, `postToolUse`, `beforeMCPExecution`, but NOT `beforeSubmitPrompt` under the tested build. [SOURCE: file:.opencode/skills/cli-external-orchestration/cli-cursor/references/hook-contract.md]

7. **Cursor CLI ACP and Devin ACP share the same protocol family (confirmed)** — Both are ACP stdio JSON-RPC servers exposing `session/update`-style streaming. This gives the portable design one shared client adapter family (ACP) for Devin, Cursor, and — with `opencode acp` — OpenCode. ACP is the strongest cross-runtime arbitrary-presentation boundary identified so far. [SOURCE: https://cursor.com/docs/cli/acp + https://docs.devin.ai/cli/reference/commands + cli-opencode cli-reference.md:75]

8. **No six-CLI runtime has a documented assistant-output replacement hook except Claude (MessageDisplay) and Pi (message_end/renderers) (confirmed)** — Claude: `displayContent` (display-only, confirmed). Pi: `message_end {message}` replacement + `renderCall`/`renderResult` (confirmed). Codex: none (App Server required). OpenCode: none (server/SSE required). Devin: none (ACP required). Cursor: none (ACP required). This establishes the boundary taxonomy: native-replacement runtimes (Claude, Pi) vs pipeline-owner runtimes (Codex, OpenCode, Devin, Cursor).

9. **Normalized event model requirements (inferred, from confirmed surfaces)** — All six streams can be normalized to a common envelope: `{runtime, sessionId, messageId, eventType (chunk|final|tool_call|tool_result|status|completion|notice), index, final, delta, parts[], createdAt, sequence}`. Key observations: Claude `message_id` is NOT the transcript msg id (iteration 2); Codex streams `item/agentMessage/delta` + `turn/completed` (iteration 2); Pi streams `message_start/update/end` (iteration 3); OpenCode messages are `{info, parts}` (iteration 3); Cursor streams `agent_message_chunk` text (this iteration); Devin ACP streams session/update (confirmed surface, exact chunk schema to be probed). A normalized model MUST carry enough provenance (runtime + stable message id + sequence + final flag) to reconstruct and display-validate without relying on transcript correlation.

10. **Canonical-state preservation rule (inferred, grounded in all confirmed surfaces)** — The normalized model is a projection input, never a write-back. The only sanctioned write surfaces are the confirmed display-only channels: Claude `displayContent`, Pi `message_end` replacement / renderers. All other runtimes render via the owning client (server/SSE, App Server, ACP). `session/update` style events are consumed, never echoed as model messages. Tool events are observed for display ordering but never mutated (Pi `tool_call`/`tool_result` mutation ruled out in iteration 3).

11. **Buffer/assembler keying (inferred, grounded)** — Stable identity must come from runtime-provided message ids (Claude `message_id`, Codex item ids, Pi message ids, OpenCode message info.id, Cursor session/update) hashed to opaque local keys — NOT raw ids in filesystem paths (iteration 1 ruling). Ordering is by `index`/sequence where provided (Claude, Pi) and by arrival+completion events otherwise (Codex `turn/completed`, Cursor session/update stream).

## Questions Answered

- Q2 (6/6 CLIs): Devin CLI — ACP client consuming `session/update` (confirmed); Cursor CLI — ACP client consuming `agent_message_chunk` (confirmed), hooks are decision/notice only, not renderer replacement.
- Q3 (partial): Normalized event/message model shape defined from confirmed surfaces; exact per-runtime chunk schemas for Devin/OpenCode/Codex remain to be probed.

## Questions Remaining

- Q3: Schema conformance of the normalized envelope across all six (deferred to implementation probes).
- Q4: Streaming/buffering/ordering/concurrency/cancellation/retry semantics (iteration 5 or 6 focus).
- Q5-Q8: unchanged.

## Next Focus

Provider model: OpenCode Go DeepSeek V4 Flash compatibility (OpenAI-compatible Chat Completions), Ollama and llama.cpp local support, provider record fields, privacy-aware local-vs-hosted routing, and streaming/retry semantics.

## Assessment

- newInfoRatio: 0.65
- noveltyJustification: Two remaining CLI surfaces confirmed (Devin + Cursor ACP), the six-CLI boundary taxonomy was established, and the normalized envelope took concrete shape.
- Confidence: High for Devin/Cursor ACP (official primary sources). Normalized-model details are inferred from confirmed surfaces and labeled as such.

## Reflection

What worked: ACP is a shared protocol family across Devin/Cursor/OpenCode — a strong architectural win discovered via primary sources.
What failed / ruled out:
- Cursor hooks as renderer replacement: envelope is `permission`/`user_message`/`agent_message` only (confirmed, ruled out).
- Cursor `beforeSubmitPrompt` reliance: not delivered under tested build (confirmed, ruled out for projection).
Ruled out: none additional.
