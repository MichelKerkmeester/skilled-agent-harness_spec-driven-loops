# Iteration 2: Safest integration boundary in Claude CLI and Codex CLI

## Focus

Establish the safest display-projection boundary for Claude CLI (MessageDisplay hook vs headless stream-json) and Codex CLI (App Server JSON-RPC vs codex exec), with primary-source evidence.

## Actions Taken

- Read the official Claude Code hooks reference (https://code.claude.com/docs/en/hooks) and extracted the MessageDisplay contract.
- Read the official Codex App Server reference (https://learn.chatgpt.com/docs/app-server).
- Read the repo-local cli-claude-code and cli-codex skill references (cli-reference.md, integration-patterns.md, hook-contract.md).

## Findings

1. **Claude `MessageDisplay` is officially display-only (confirmed)** — Official docs: "MessageDisplay is display-only: the replacement text changes only what is rendered on screen. The transcript and what Claude sees keep the original text, so Claude never sees the replacement." `displayContent` replaces the delta on screen; omit it to display the original. Hooks have no decision control: they can't block the message or change what is stored in the transcript or sent to Claude. [SOURCE: https://code.claude.com/docs/en/hooks]

2. **MessageDisplay event shape (confirmed)** — Fires while assistant message text streams, no matcher support, fires on every text-streaming message (tool-call-only messages don't trigger it). Input includes `message_id` (UUID stable across every batch of the same message; explicitly NOT the API `msg_…` id, so it cannot be correlated with transcript message ids), `index`, `final`, `delta`, `session_id`, `transcript_path`, `cwd`. [SOURCE: https://code.claude.com/docs/en/hooks]

3. **Non-interactive single-call behavior (confirmed)** — "In non-interactive runs, including Agent SDK queries and `claude -p`, MessageDisplay runs once per assistant message instead of once per batch of lines. The single call arrives after the message completes and carries the full message text: `index` is `0`, `final` is `true`, and `delta` holds the entire message." A hook that collects `delta` for each message receives the same total text in both modes. This means the reference's buffer-to-final algorithm is only needed in interactive mode; in `-p` mode the message arrives whole. [SOURCE: https://code.claude.com/docs/en/hooks]

4. **MessageDisplay default timeout is 10s (confirmed)** — The docs state MessageDisplay lowers the command/http/mcp_tool default from 600s to 10s. The reference registers 60s (`hooks/hooks.json:9`); a portable design must keep its LLM client timeout below the configured hook timeout and be prepared for a 10s default if the timeout is not overridden. [SOURCE: https://code.claude.com/docs/en/hooks]

5. **Transcript lag warning (confirmed)** — `transcript_path` "is written asynchronously and may lag the in-memory conversation, so it may not yet include the current turn's most recent messages." For the current turn's final assistant text, the docs recommend `last_assistant_message` on `Stop`/`SubagentStop` instead of reading the transcript. This weakens the reference's transcript-based context extraction (`rewrite.sh:154-155`) in the moment a hook fires. [SOURCE: https://code.claude.com/docs/en/hooks]

6. **`suppressOutput` is a Claude JSON output field, not a renderer (confirmed)** — `suppressOutput: true` hides the hook's stdout from the transcript; it is not a mechanism for replacing rendered assistant output. The only replacement path is `displayContent`. [SOURCE: https://code.claude.com/docs/en/hooks]

7. **Claude headless `stream-json` is a second safe surface (confirmed)** — `claude -p --output-format stream-json` emits newline-delimited JSON for real-time processing (cli-reference.md:162). A client that owns the pipeline (opencode `run` style) can render arbitrary presentation itself because it IS the consumer of the stream; no hook mutation is needed. This is the correct boundary for deep product integration. [SOURCE: file:.opencode/skills/cli-external-orchestration/cli-claude-code/references/cli-reference.md:162]

8. **Codex App Server is the arbitrary-presentation surface (confirmed)** — JSON-RPC 2.0 (stdio default, plus experimental websocket/unix). Lifecycle: `initialize` → `initialized` → `thread/start` → `turn/start` → stream `item/agentMessage/delta`, tool progress, `turn/completed` notifications. Bounded queues reject with `-32001 "Server overloaded; retry later"` when ingress is full. [SOURCE: https://learn.chatgpt.com/docs/app-server]

9. **Codex App Server exposes cancellation and steering (confirmed)** — `turn/interrupt` requests cancellation of an in-flight turn (ends with `status: "interrupted"`); `turn/steer` appends user input to an in-flight turn. `thread/inject_items` appends raw Responses API items to the model-visible history — this mutates model context and MUST NOT be used for display projection. [SOURCE: https://learn.chatgpt.com/docs/app-server]

10. **Codex hooks have no display-replacement event (confirmed)** — Native Codex hooks (SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop) inject context via JSON stdout and can deny tool calls, but none replaces rendered assistant output (hook-contract.md:48-105). The plan's inference that `suppressOutput` is parsed-but-unimplemented for Codex hooks remains unverified in the current primary source; App Server remains the safe arbitrary-presentation surface. [SOURCE: file:.opencode/skills/cli-external-orchestration/cli-codex/references/hook-contract.md]

11. **`codex exec` non-interactive plain-text mode (confirmed)** — `codex exec` runs one-shot tasks to stdout; it has no native JSON output wrapper (integration-patterns.md:115). It is a viable surface only when the caller owns the terminal pipeline, not a display-replacement mechanism. [SOURCE: file:.opencode/skills/cli-external-orchestration/cli-codex/references/integration-patterns.md:115]

## Questions Answered

- Q2 (partial, 2 of 6 CLIs): Claude CLI safest boundary is `MessageDisplay` `displayContent` for presentation-only rewriting (or owning the `stream-json` pipeline for full control); Codex CLI safest boundary is an App Server client consuming `item/agentMessage/delta` and rendering locally, with hooks reserved for context injection.

## Questions Remaining

- Q2: Pi, OpenCode, Devin, Cursor boundaries (iterations 3-4).
- Q3-Q8: unchanged.

## Next Focus

Establish the safest integration boundary for Pi CLI (extension rendering / JSON-RPC) and OpenCode CLI (HTTP server SSE / plugin events).

## Assessment

- newInfoRatio: 0.80
- noveltyJustification: Two CLI surfaces now have primary-source-confirmed boundaries, including new facts (10s default timeout, single-call non-interactive behavior, transcript lag) not present in the phase packet.
- Confidence: High for Claude and Codex App Server (official primary sources). Codex hooks `suppressOutput` status remains inferred/unknown.

## Reflection

What worked: primary-source fetches plus repo-local skill references cross-confirmed each surface.
What failed / ruled out:
- `thread/inject_items` for display projection: mutates model-visible history (confirmed, ruled out).
- Codex hooks as a generic renderer: no display-replacement event exists (confirmed, ruled out).
- `codex exec` for arbitrary presentation: plain-text, no renderer hook (confirmed, ruled out for this role).
Ruled out: none additional.
