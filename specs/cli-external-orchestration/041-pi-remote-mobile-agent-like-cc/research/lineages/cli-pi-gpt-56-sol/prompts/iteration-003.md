DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 3 of 6
Research Topic: Custom Claude-app-style mobile client for Pi RPC through a secure relay.
Focus Area: Specify and fault-test the reconnect protocol and durable relay schema: stream epochs, bounded replay, `get_entries(since)` cursor mismatch, client mutation idempotency, session switching, child restart, duplicate/gapped deltas, and multi-client approval leases. Prefer evidence from Pi RPC implementation/types and relevant protocol sources; a deterministic thought experiment is acceptable when a live harness would mutate outside the allowed packet.
Stop Policy: max-iterations; convergence before iteration 6 is telemetry only.

Read first: target-local config, state log, strategy, registry, and iterations 1-2 under `specs/cli-external-orchestration/041=pi-remote-mobile-agent-like-cc/research/lineages/cli-pi-gpt-56-sol/`.

Write only:
- iterations/iteration-003.md
- append exactly one canonical iteration record to deep-research-state.jsonl
- deltas/iter-003.jsonl
All relative paths above are under the lineage root.

Hard constraints: one LEAF iteration; no subagents; 3-5 focused actions; cited findings; do not edit config/strategy/registry/dashboard/research.md; no write outside the lineage. Include exact route proof fields: mode="research", target_agent="deep-research", agent_definition_loaded=true, resolved_route="Resolved route: mode=research target_agent=deep-research".
