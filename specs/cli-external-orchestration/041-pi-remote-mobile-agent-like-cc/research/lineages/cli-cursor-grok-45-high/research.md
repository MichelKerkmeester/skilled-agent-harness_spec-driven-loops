# Claude-app-style mobile client for pi RPC — cli-cursor-grok-45-high lineage research

Detached fan-out lineage `fanout-cli-cursor-grok-45-high-1786341668505-k2xc4h` (executor `cli-cursor` / `cursor-grok-4.5-high`). Four forced-depth iterations on designing a Claude-app-parity mobile web/PWA client driven by `pi --mode rpc`, exposed through a host relay (Tailscale Serve and/or WebSocket bridge). Stop policy: `max-iterations` (convergence treated as telemetry only). Artifact root: `specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/lineages/cli-cursor-grok-45-high`.

## 1. Executive Verdict

Build a **host-local RPC supervisor + WebSocket control plane + optional Tailscale Serve HTTPS front door**, not a direct phone→`pi` pipe and not a print/json-mode adapter. The mobile PWA speaks Claude-app UX; the relay speaks Pi RPC JSONL with LF-strict framing. Session list is **filesystem-owned** (no `list_sessions` RPC command). Streaming, tool cards, and approvals map directly onto `message_update` / `tool_execution_*` / `extension_ui_request`. Push reuses fire-and-forget `notify` (plus high-priority pushes for background approvals). Reconnect is mandatory: Tailscale Serve WebSocket drops are a known risk; recover with `get_state` + `get_entries(since)`.

## 2. Method

Four single-focus iterations against official Pi RPC/JSON docs (pi.dev), local cli-pi contract pin (Pi 0.84.1 live), Tailscale Serve docs, and community Serve WS failure reports. Each iteration wrote evidence-cited findings, ruled-out directions, and JSONL deltas. newInfoRatio trend (telemetry): `1.0 → 0.85 → 0.80 → 0.75`.

## 3. Architecture (recommended)

```text
[Mobile PWA]
    |  WebSocket (auth token / passkey session)
    v
[Relay on host]  -- spawns/supervises -->  [pi --mode rpc]
    ^                                         stdin/stdout JSONL
    |                                         LF-strict framing
[Tailscale Serve HTTPS]  (optional front door on tailnet MagicDNS)
```

**Relay responsibilities**

1. Spawn `pi --mode rpc` with `--session-dir`, `--provider`, `--model`, optional `--name`.
2. Frame JSONL correctly (no Node `readline`; split on `\n` only).
3. Multiplex commands/events to connected PWA clients; enforce single-writer lock per session.
4. Enumerate session-dir for session list; map UI actions to `switch_session` / `new_session` / `fork` / `clone` / `set_session_name`.
5. Bridge `extension_ui_request` ↔ mobile modals / push; answer with `extension_ui_response`.
6. Hold outstanding UI requests across WS reconnect; support command `id` idempotency.

**Ruled out:** `pi --print` / `--mode json` as the interactive session protocol; TUI-only UI hooks for mobile chrome; public Tailscale Funnel as MVP; silent auto-steer on Send while streaming.

## 4. Protocol map (client must implement)

### Commands (control plane)

| Family | Commands |
|--------|----------|
| Prompting | `prompt` (+`images`, `streamingBehavior`), `steer`, `follow_up`, `abort` |
| Session | `new_session`, `switch_session`, `fork`, `clone`, `set_session_name`, `get_entries`, `get_tree`, `get_messages`, `get_state`, `get_session_stats`, `get_fork_messages`, `get_last_assistant_text`, `export_html` |
| Model/thinking | `set_model`, `cycle_model`, `get_available_models`, `set_thinking_level`, `cycle_thinking_level`, `get_available_thinking_levels` |
| Queue/compact/retry/bash | `set_steering_mode`, `set_follow_up_mode`, `compact`, `set_auto_compaction`, `set_auto_retry`, `abort_retry`, `bash`, `abort_bash` |
| Discovery / UI | `get_commands`, `extension_ui_response` |

### Events (render plane)

`agent_start` / `agent_end` / **`agent_settled`** (prefer for idle), `turn_*`, `message_start` / **`message_update` (delta-only)** / `message_end`, `tool_execution_*`, `bash_execution_update`, `queue_update`, `compaction_*`, `auto_retry_*`, `extension_error`, `extension_ui_request`.

Sources: [pi.dev RPC](https://pi.dev/docs/latest/rpc), [pi.dev JSON](https://pi.dev/docs/latest/json), cli-pi `cli-reference.md`.

## 5. Claude-app UX parity matrix

| Claude-app surface | Pi mapping | MVP? |
|--------------------|------------|------|
| Session list | Relay FS enumerate session-dir + metadata; open → `switch_session` | Yes |
| New chat / rename | `new_session` / `set_session_name` | Yes |
| Chat bubbles | Hydrate `get_entries`; live `message_*` | Yes |
| Streaming text/thinking | Assemble `message_update` via `contentIndex`+`delta`; reconcile on `message_end` | Yes |
| Tool activity | `tool_execution_start/update/end` cards by `toolCallId` | Yes |
| Approvals | `extension_ui_request` confirm/select (+ input/editor) | Yes |
| Stop | `abort` (+ `abort_bash` / `abort_retry`) | Yes |
| Interrupt / queue | `steer` / `follow_up` + `queue_update` + steering modes | Yes |
| Push | `notify` → relay → Web Push/ntfy/APNs; also for background approvals | Yes |
| Fork / branch UI | `get_fork_messages` / `fork` / `get_tree` | Later |
| Export / share | `export_html` | Later |
| Cost/context footer | `get_session_stats.contextUsage` | Later |
| Slash palette | `get_commands` | Later |

## 6. Streaming, tools, approvals (detail)

- **Deltas are not cumulative** — maintain client-side buffers; `message_end` is authoritative.
- **Idle = `agent_settled`**, not `agent_end` (retries/compaction/queued continuations may follow).
- **Approvals** are id-correlated blocking dialogs; agent-side `timeout` auto-resolves — client need not race.
- **Composer gating:** disable plain Send while streaming unless user picks Steer/Follow-up; RPC errors if `prompt` lacks `streamingBehavior` mid-stream.

## 7. Push, reconnect, transport

**Push:** Forward `notify` (and background `confirm`/`select`) through the relay. Foreground → toast; background → OS/Web Push with deep link to `sessionId` (+ dialog id).

**Reconnect after WS drop:**

1. Re-auth to relay
2. `get_state`
3. `get_entries({ since: lastSeenEntryId })` (full hydrate if unknown)
4. Resume event stream; reconcile partial bubbles on `message_end`
5. Re-show held `extension_ui_request`s

Persist `lastSeenEntryId` / `leafId` per session in PWA storage.

**Transport default:** Tailscale Serve → local WS relay → RPC, with heartbeat + exponential reconnect. Escape hatch: TCP forward / non-Serve WS if Serve 1001 drops are severe. Funnel out of MVP.

## 8. MVP build plan (research-only recommendation)

| Milestone | Scope | Exit check |
|-----------|-------|------------|
| M1 Relay skeleton | Spawn RPC child, LF framer, single WS client echo of events | Round-trip `get_state` |
| M2 Session list | FS enumerate + switch/new/rename | List matches session-dir; switch loads transcript |
| M3 Chat + stream | Bubbles + delta assembly + abort | Live text stream matches TUI |
| M4 Tools + approvals | Tool cards + confirm/select modals | Extension UI demo round-trips |
| M5 Steer/queue/push | Steer/follow-up UI, queue chip, notify→push stub | Mid-run steer works; background notify delivered |
| M6 Serve + reconnect | Tailscale Serve front door + cursor reconnect drill | Kill WS mid-stream; transcript recovers |

**Verification:** contract tests against recorded RPC fixtures; live `pi --mode rpc` smoke on 0.84.1+; Serve reconnect chaos test.

## 9. Convergence report

| Field | Value |
|-------|-------|
| Stop reason | `maxIterationsReached` |
| Iterations | 4 / 4 |
| Questions answered | 5 / 5 (Q1–Q5) |
| newInfoRatio trend | 1.0 → 0.85 → 0.80 → 0.75 (telemetry; not used to stop) |
| Avg newInfoRatio | 0.85 |

## 10. Open follow-ups (out of lineage)

- Exact on-disk session JSONL header schema dump for list cards.
- Full `assistantMessageEvent.type` enum fixture for this Pi version.
- Concrete push provider choice (Web Push VAPID vs ntfy vs native wrapper).
- Multi-project: one relay multiplexing multiple Pi children.
- Auth model (passkeys / Tailscale identity headers / capability tokens) — deferred security deep-dive.

## 11. References

- https://pi.dev/docs/latest/rpc
- https://pi.dev/docs/latest/json
- `.opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md`
- https://tailscale.com/docs/reference/tailscale-cli/serve
- https://github.com/tailscale/tailscale/issues/18827
- Parent charter (read-only): `specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/deep-research-strategy.md`
- Lineage iterations: `iterations/iteration-001.md` … `iteration-004.md`
