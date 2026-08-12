# Resource Map — cli-cursor-grok-45-high lineage

Evidence-derived resource map for the Claude-app-style pi RPC mobile client research. `resource-map.md` was absent at the parent spec folder at init (`resource_map_present: false`); this file is emitted from lineage deltas at synthesis.

## Documents

| Path | Theme |
|------|-------|
| https://pi.dev/docs/latest/rpc | Official RPC command/event/extension-UI contract |
| https://pi.dev/docs/latest/json | JSON event stream; delta-only `message_update` |
| https://tailscale.com/docs/reference/tailscale-cli/serve | Tailscale Serve HTTPS reverse proxy |
| https://github.com/tailscale/tailscale/issues/18827 | Serve WebSocket drop reports (reconnect design input) |

## Skills / References

| Path | Theme |
|------|-------|
| `.opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md` | Local Print/JSON/RPC trichotomy + flags |
| `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md` | cli-pi executor contract (availability-gated) |

## Specs

| Path | Theme |
|------|-------|
| `specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/deep-research-strategy.md` | Parent charter / Q1–Q10 (read-only) |
| `specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/lineages/cli-cursor-grok-45-high/` | This lineage packet |

## Runtime probes

| Probe | Result |
|-------|--------|
| `command -v pi` | `/Users/michelkerkmeester/.local/bin/pi` |
| `pi --version` | `0.84.1` |

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| cli-cursor-grok-45-high | deltas/iter-001.jsonl |
| cli-cursor-grok-45-high | deltas/iter-002.jsonl |
| cli-cursor-grok-45-high | deltas/iter-003.jsonl |
| cli-cursor-grok-45-high | deltas/iter-004.jsonl |
