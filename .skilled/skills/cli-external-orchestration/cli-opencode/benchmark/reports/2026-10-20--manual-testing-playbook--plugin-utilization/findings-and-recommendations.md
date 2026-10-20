# Findings And Recommendations

_Derived after the fact from this run's stored record, not written at run time._

> cli-opencode · live · opencode · llmgateway/deepseek-v4.1-flash · high

The seven OpenCode 2 failures share three causes. Each was read from the plugin source and confirmed by a probe plugin that logged every hook call on both versions (`specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook/scratch/live-runs/event-probe-summary.txt`).

## 1. OpenCode 2 renames the shell and subagent tools

- **Behaviors**: `CO-041-V2`, `CO-048-V2`, `CO-049-V2`, `CO-052-V2`
- **Observation**: the bridge in `.opencode/plugins/lib/v2-bridge.js` passes the v2 tool name through unchanged. The shell tool is `shell`, not `bash`, and the subagent tool is `subagent` with argument `agent`, not `task` with `subagent_type`. The plugins return early on their `bash` or `task` checks. The `bash` legs of `system-dist-freshness-guard` and `system-spec-gate` are affected the same way, though their scenarios exercise other legs.
- **Recommendation**: normalize the v2 tool names and arguments in one place, the bridge, so every bridged plugin sees the v1 names.

## 2. `opencode2 run` delivers no `session.created` for its own session

- **Behaviors**: `CO-042-V2`, `CO-045-V2`
- **Observation**: the v2 event stream starts at `integration.updated` and goes to `session.execution.started`. A session created later, such as a subagent's, does get `session.created`.
- **Recommendation**: have the bridge synthesize `session.created` the first time it sees `session.execution.started` for an unseen session.

## 3. The bridged `message.updated` lacks fields `session-relaunch` needs

- **Behaviors**: `CO-046-V2`
- **Observation**: the bridge maps `session.step.ended` to `message.updated` with properties `{ info }` only. The plugin reads `properties.sessionID` and `info.time.completed`, so it never records usage. OpenCode 2 also sends no user `message.updated`, so the handoff-seed path cannot fire.
- **Recommendation**: add `sessionID` at the top level and a completion time to the mapped event, and map the user message.

## Boundary

CI battery run 39442263433 on 2026-10-20 reported every plugin active on OpenCode 2 (receipt in the packet's `battery-receipt.txt`). Registration does not show whether a hook that filters on a tool name or an event ever fires; these live runs do.
