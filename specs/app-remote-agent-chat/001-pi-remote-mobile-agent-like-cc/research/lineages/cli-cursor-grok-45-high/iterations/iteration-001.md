# Iteration 1: RPC protocol surface + relay/transport architecture

## Focus

Inventory the `pi --mode rpc` command/event/framing contract a mobile client must speak, and compare Tailscale Serve versus a dedicated WebSocket bridge as the relay transport for a mobile PWA.

## Findings

1. **RPC is a persistent duplex JSONL protocol, not print/json one-shot.** Commands are newline-delimited JSON on stdin; responses (`type:"response"`) and agent events stream on stdout. Official docs require splitting records on LF only and stripping optional trailing CR — Node `readline` is explicitly non-compliant because it also splits on U+2028/U+2029. [SOURCE: https://pi.dev/docs/latest/rpc] [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:179-187]

2. **Minimum client command surface for Claude-app-like control.** Prompting: `prompt` (optional `images`, required `streamingBehavior` when already streaming: `steer`|`followUp`), `steer`, `follow_up`, `abort`. Session lifecycle: `new_session`, `switch_session`, `fork`, `clone`, `set_session_name`, `get_entries` (with `since` cursor), `get_tree`, `get_messages`, `get_state`, `get_session_stats`, `get_fork_messages`, `get_last_assistant_text`, `export_html`. Model/thinking: `set_model`, `cycle_model`, `get_available_models`, `set_thinking_level`, `cycle_thinking_level`, `get_available_thinking_levels`. Queue/compaction/retry/bash: `set_steering_mode`, `set_follow_up_mode`, `compact`, `set_auto_compaction`, `set_auto_retry`, `abort_retry`, `bash`, `abort_bash`. Discovery: `get_commands`. Approvals: `extension_ui_response` matching outbound `extension_ui_request` ids. [SOURCE: https://pi.dev/docs/latest/rpc]

3. **Event stream maps 1:1 to chat/tool/status UI.** Core events: `agent_start`/`agent_end`/`agent_settled`, `turn_start`/`turn_end`, `message_start`/`message_update`/`message_end`, `tool_execution_start`/`update`/`end`, `bash_execution_update`, `queue_update`, `compaction_*`, `auto_retry_*`, `extension_error`, plus `extension_ui_request` for dialogs/notify. JSON mode documents the same agent event family and notes `message_update` is delta-only (no cumulative message / no `partial`) — assemble via `contentIndex`+`delta`. Prefer `agent_settled` over `agent_end` as "turn fully idle" for enabling the composer. [SOURCE: https://pi.dev/docs/latest/rpc] [SOURCE: https://pi.dev/docs/latest/json]

4. **RPC has no `list_sessions` command — session list UX is filesystem-owned.** Session identity comes from `get_state.sessionId` / `sessionFile` / `sessionName`, CLI `--session-dir` / `--session-id` / `--name`, and `switch_session` by path. A Claude-app-style session list therefore requires the relay to enumerate the configured session directory (plus metadata from session JSONL headers / `set_session_name`) and expose a list API to the PWA; the mobile client then calls `switch_session` / `new_session` / `fork` / `clone` through RPC. [SOURCE: https://pi.dev/docs/latest/rpc] [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:85-92]

5. **Recommended topology: host-local RPC supervisor + WebSocket control plane + optional Tailscale Serve front door.** Spawn `pi --mode rpc` (optionally with `--session-dir`, `--provider`, `--model`, `--name`) on the host; a Node/TS relay owns the child process, performs LF-safe framing, multiplexes commands/events over WebSocket to the PWA, and answers `extension_ui_request` round-trips. Expose the relay over the tailnet via `tailscale serve` HTTPS reverse proxy to `http://127.0.0.1:<relay>` for auto-TLS MagicDNS access from phone. Treat Tailscale Serve WebSocket idle drops (reported close code 1001 / upgrade regressions in community reports) as an expected failure mode and design reconnect around `get_entries`/`since` + `get_state`. Alternative: Tailscale TCP forward or a dedicated WS bridge without L7 Serve if Serve WS proves unstable on the operator's version. [SOURCE: https://tailscale.com/docs/reference/tailscale-cli/serve] [SOURCE: https://github.com/tailscale/tailscale/issues/18827] [SOURCE: https://pi.dev/docs/latest/rpc]

## Sources Consulted

- https://pi.dev/docs/latest/rpc
- https://pi.dev/docs/latest/json
- `.opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md`
- https://tailscale.com/docs/reference/tailscale-cli/serve
- https://github.com/tailscale/tailscale/issues/18827
- Parent strategy (read-only): `specs/cli-external-orchestration/001-pi-remote-mobile-agent-like-cc/research/deep-research-strategy.md`
- Live `pi --version` → 0.84.1

## Assessment

- **newInfoRatio:** 1.0
- **Novelty justification:** First lineage pass; protocol inventory, missing list_sessions gap, framing pitfall, and Serve+WS topology are new to this packet.
- **Confidence:** High on protocol surface (official docs); medium on Serve WS reliability (community reports, version-sensitive).

## Reflection

### What worked
- Anchoring on official RPC docs plus local cli-pi trichotomy avoided conflating `--mode json` (one-shot stream) with RPC (persistent control).
- Explicit framing constraint (no Node readline) is load-bearing for a correct relay.

### What failed / ruled out
- **Ruled out:** Using `pi --print` / `--mode json` as the interactive mobile session protocol — print returns only the final message; JSON is a one-shot event dump without the command/response control plane. [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:26-32]

### Open questions carried forward
- Exact session-directory on-disk schema for building the session list without opening every file fully.
- Whether Funnel (public) vs Serve (tailnet-only) is ever appropriate (security angle deferred).

## Recommended Next Focus

Iteration 002: Claude-app UX parity mapping — session list, chat bubbles, tool activity cards, and approval dialogs — onto RPC session commands + extension UI sub-protocol.
