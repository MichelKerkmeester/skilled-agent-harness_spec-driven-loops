# Iteration 2: RPC command/event mapping to mobile UI surfaces

## Focus
Produce the exact contract mapping every RPC command and event type to a concrete mobile UI surface (session list, chat bubbles, streaming assembly, tool activity panel, approval dialogs, status/fire-and-forget), and compare against Claude mobile / Remote Control UX as the parity baseline.

## Findings
1. **High — the RPC command surface maps cleanly onto a Claude-app-style command palette and composer.** `prompt` (with `streamingBehavior: steer|followUp` for queuing during streaming), `steer`, `follow_up`, `abort`, `abort_retry`, `abort_bash`, `compact`, `set_auto_compaction`, `set_auto_retry`, `set_model`/`cycle_model`, `set_thinking_level`/`cycle_thinking_level`, and `set_steering_mode`/`set_follow_up_mode` form the control plane: send message, steer in-flight run, queue follow-up, stop, retry controls, compaction toggle, model selector, thinking level. `get_commands` returns extension commands, prompt templates, and skills (with `source`, `location`, `path`) that can be invoked via `/name` — this is the mobile command/actions menu; TUI-only built-ins (`/settings`, `/hotkeys`) are excluded and must not be surfaced. [SOURCE: rpc.md:39-162] [SOURCE: rpc.md:217-373] [SOURCE: rpc.md:791-832]
2. **High — chat bubbles assemble from `get_messages`/`get_entries` (history) plus the live stream; four message roles render distinctly.** `UserMessage` (text or content blocks incl. images), `AssistantMessage` (text/thinking/toolCall blocks, `stopReason` incl. `toolUse`/`error`/`aborted`), `ToolResultMessage` (correlated by `toolCallId`), and `BashExecutionMessage` (from the direct `bash` command, converted into the LLM context on the next prompt). `message_update` deltas stream by `contentIndex` (text/thinking/toolcall), and `message_end.message` is authoritative. [SOURCE: rpc.md:1360-1471]
3. **High — direct `bash` is a privileged terminal surface, not an ordinary LLM tool card.** The `bash` command executes immediately (arbitrary shell), streams `bash_execution_update` chunks correlated by `id`, returns final output/exitCode/`cancelled`/`truncated` (+ `fullOutputPath` when truncated), and `abort_bash` cancels it. Because it bypasses the LLM tool path entirely, the relay must treat it as privileged: explicit per-action authorization (same approval channel as extension dialogs) plus audit, or omit it from the MVP. `get_session_stats` (usage/cost) plus `usage` objects on assistant/tool messages give a token/cost dashboard. [SOURCE: rpc.md:456-574]
4. **Medium — the session list must be relay-built from `--session-dir` scanning plus `get_entries`/`get_tree` metadata; the entry tree supports fork/clone UX.** `new_session` (optionally with `parentSession`), `switch_session`, `fork` (from a `get_fork_messages` entry), `clone`, `get_tree`, `set_session_name`, and `get_entries(since)` give the mobile app: new chat, open recent session, fork from a past message, branch tree view, rename, and sync-by-cursor. Claude-style session cards need title (session name or first user message), timestamp, and message count — `get_state` provides `sessionName`/`messageCount`/`sessionFile`. [SOURCE: rpc.md:137-162] [SOURCE: rpc.md:574-772]
5. **High — the approval surface is the Extension UI sub-protocol, and parity evidence shows decision-ready approval cards are the differentiator.** Dialogs (`select`, `confirm`, `input`, `editor`) are `extension_ui_request`/`extension_ui_response` exchanges with matching `id`; `notify`/`setStatus`/`setWidget`/`setTitle`/`set_editor_text` are fire-and-forget status channels. Claude's own Remote Control shows approval-fatigue evidence (93% of permission prompts approved) and pushes when a decision is needed; its mobile permission UX is mode-based (Manual / acceptEdits / Plan) with a known gap: host-side `--dangerously-skip-permissions` is not reflected in the app. Design implication for Pi: the relay must (a) mirror the host's effective permission mode, (b) render dialogs as expandable decision cards (risk label, full payload, approve/reject/cancel), and (c) never infer approvals from tool events. The relay reports and enforces the extension/relay policy as the permission surface — Pi has no native permission-mode flag to mirror, unlike Claude Code. [SOURCE: rpc.md:1144-1360] [SOURCE: https://code.claude.com/docs/en/remote-control] [SOURCE: https://code.claude.com/docs/en/permission-modes] [SOURCE: https://github.com/anthropics/claude-code/issues/29214]
6. **Medium — Claude-app UX parity has a concrete reference model: chat-as-control-plane, streaming shells, full-width cards, progressive disclosure.** Claude's own design guidance: keep chat the control plane with embedded interactive UI; render a result shell immediately and stream content into it (no blank waits; indeterminate → determinate progress; Stop/Cancel where safe); full-width, touchable cards with ~44pt targets; structured tappable inputs (select/multi-select) at the bottom of chat with a text fallback; artifacts as persistent companions with version/edit affordances. Pi mapping: assistant thinking blocks → collapsible "thinking" chips; tool calls → expandable tool cards with streaming output; extension `notify` → transient toast; `setStatus` → footer status line. [SOURCE: https://claude.com/docs/connectors/building/mcp-apps/design-guidelines] [SOURCE: https://developer.apple.com/design/human-interface-guidelines/loading] [SOURCE: https://support.claude.com/en/articles/13641943-visual-and-interactive-content]

## Questions Answered
- Which Pi RPC commands and events map to session lists, streaming chat, tool activity, and approvals? (complete mapping with parity model)

## Questions Remaining
- What state model and reconnection protocol prevent duplicated prompts, lost deltas, or stale approvals? (iteration 3)
- Which security and network exposure model is safe for a coding agent with workspace tool authority? (iteration 4)
- How should PWA notifications, background limits, and Claude-style mobile UX be implemented and phased? (iteration 5)

## Ruled Out
- **Surfacing TUI-only commands in the mobile menu:** `/settings`, `/hotkeys` etc. are interactive-mode-only and would not execute via `prompt`. [SOURCE: rpc.md:791-832]
- **Treating `tool_execution_start` as an approval request:** tool events report activity; approvals are exclusively the extension-UI dialog protocol. [SOURCE: rpc.md:972-1015] [SOURCE: rpc.md:1144-1160]
- **Copying Claude Remote Control's mode model verbatim:** Pi has no equivalent permission-mode flag; the relay must mirror Pi's actual tool policy surface (extension-gated approval), not a mode selector the host does not enforce. [SOURCE: https://code.claude.com/docs/en/permission-modes]

## Dead Ends
- No command/event surface is exhausted; `get_tree`/`fork` UX depth and `queue_update` rendering remain partially open.
- A live end-to-end transcript (real Pi child + browser client) remains unverified in this environment.

## Edge Cases
- Contradictory evidence: none within Pi docs; Claude Remote Control's mode selector vs host `--dangerously-skip-permissions` gap is a documented third-party bug worth mirroring as a risk.
- Missing dependencies: session-list metadata requires relay-side `--session-dir` scanning (no native list command).
- Ambiguous input: "approvals" interpreted as extension-UI dialogs plus host tool policy, per the RPC contract.

## Sources Consulted
- [SOURCE: rpc.md:39-162, 217-373, 456-574, 574-772, 791-832, 1360-1471]
- [SOURCE: rpc.md:972-1015, 1144-1360]
- [SOURCE: https://code.claude.com/docs/en/remote-control]
- [SOURCE: https://code.claude.com/docs/en/permission-modes]
- [SOURCE: https://github.com/anthropics/claude-code/issues/29214]
- [SOURCE: https://claude.com/docs/connectors/building/mcp-apps/design-guidelines]
- [SOURCE: https://developer.apple.com/design/human-interface-guidelines/loading]

## Assessment
- New information ratio: 0.85 (5 of 6 findings new; finding 6 partially overlaps the parity theme introduced via Remote Control sources in finding 5)
- Questions addressed: 1 of 5 remaining key questions (UI mapping), answered.
- Confidence: high on the command/event mapping (primary docs); medium on Claude mobile UX generalizations (vendor docs, secondary).

## Reflection
What worked: the command/type sections of the RPC doc are enumerable, so the mapping table fell out mechanically; Claude Remote Control docs provided a direct parity benchmark including approval-fatigue data.
What failed: no live transcript; queue-update rendering details not yet verified against the queue modes doc section.
What was ruled out: TUI-only commands in the mobile menu; tool events as approval signals; verbatim Remote Control mode model.

## Recommended Next Focus
Design the disconnect-safe state model: relay event sequencing, client mutation ledger with idempotent prompt submission, replay/reconciliation protocol (lastEventSeq + get_entries(since)), crash windows for the Pi child, approval lease/dedup semantics, and the durable relay schema (session catalog, approval map, ledger).
