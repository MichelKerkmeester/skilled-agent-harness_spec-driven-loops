DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 1 of 6

Research Topic: Design a custom Claude-app-style mobile client for the pi coding agent driven by pi --mode rpc (JSONL protocol) exposed through a relay (Tailscale Serve or WebSocket bridge) to a mobile web app/PWA, with Claude-app UX parity: session list, chat bubbles, streaming, tool activity, approvals, push notifications.

Focus Area: Map Pi's RPC lifecycle and define the minimum relay/process architecture.
Stop Policy: max-iterations. Convergence before iteration 6 is telemetry only.

State Files:
- Config: specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/lineages/cli-pi-gpt-56-sol/deep-research-config.json
- State Log: specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/lineages/cli-pi-gpt-56-sol/deep-research-state.jsonl
- Strategy: specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/lineages/cli-pi-gpt-56-sol/deep-research-strategy.md
- Registry: specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/lineages/cli-pi-gpt-56-sol/findings-registry.json
- Iteration output: specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/lineages/cli-pi-gpt-56-sol/iterations/iteration-001.md
- Delta output: specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/lineages/cli-pi-gpt-56-sol/deltas/iter-001.jsonl

Hard constraints:
- Execute exactly one deep-research iteration and remain LEAF-only. Do not dispatch subagents.
- Read config, state log, and strategy before research.
- Perform 3-5 focused research actions using authoritative Pi docs/source and relevant networking/PWA sources.
- Write only the iteration narrative, append exactly one canonical iteration record to the state log, and create the delta file. Do not edit config, strategy, registry, dashboard, or research.md.
- Every finding needs a source citation or explicit inference marker.
- Include route-proof fields: target_agent="deep-research", agent_definition_loaded=true, resolved_route="Resolved route: mode=research target_agent=deep-research", mode="research".
- No write may escape the lineage artifact directory.
