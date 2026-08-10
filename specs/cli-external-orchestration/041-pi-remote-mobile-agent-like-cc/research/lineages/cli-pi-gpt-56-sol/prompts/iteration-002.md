DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 2 of 6
Research Topic: Custom Claude-app-style mobile client for Pi RPC through a secure relay.
Focus Area: Map Pi RPC commands and events to a Claude-style mobile UI state machine. Define ordering, idempotency, streamed-message assembly, tool cards, session-list sourcing, and approval invariants.
Stop Policy: max-iterations; convergence before iteration 6 is telemetry only.

Read first:
- specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/lineages/cli-pi-gpt-56-sol/deep-research-config.json
- specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/lineages/cli-pi-gpt-56-sol/deep-research-state.jsonl
- specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/lineages/cli-pi-gpt-56-sol/deep-research-strategy.md
- specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/lineages/cli-pi-gpt-56-sol/findings-registry.json

Write only:
- specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/lineages/cli-pi-gpt-56-sol/iterations/iteration-002.md
- append exactly one canonical iteration record to specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/lineages/cli-pi-gpt-56-sol/deep-research-state.jsonl
- specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/lineages/cli-pi-gpt-56-sol/deltas/iter-002.jsonl

Hard constraints: one LEAF iteration; no subagents; 3-5 focused research actions; authoritative Pi docs/source plus relevant platform docs; every finding cited; do not edit config/strategy/registry/dashboard/research.md; no write outside lineage dir. Include route proof exactly: mode="research", target_agent="deep-research", agent_definition_loaded=true, resolved_route="Resolved route: mode=research target_agent=deep-research".
