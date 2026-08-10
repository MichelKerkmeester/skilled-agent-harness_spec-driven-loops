DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 4 of 6
Research Topic: Custom Claude-app-style mobile client for Pi RPC through a secure relay.
Focus Area: Define the safe security/network-exposure model for a coding agent with workspace tool authority. Compare tailnet-only Tailscale Serve with a custom authenticated WSS bridge; cover device/user identity, authorization, Origin and CSRF-like WebSocket protections, TLS, session/workspace isolation, secret redaction, queue/rate limits, audit retention, approval-extension trust, and failure modes. Do not recommend public exposure by default.
Stop Policy: max-iterations; convergence before iteration 6 is telemetry only.

Read target-local config, state, strategy, registry, and iterations 1-3 first.
Write only under the lineage root:
- iterations/iteration-004.md
- append exactly one canonical iteration record to deep-research-state.jsonl
- deltas/iter-004.jsonl

Hard constraints: one LEAF iteration, no subagents, 3-5 focused research actions, prefer primary/official sources and version-matched Pi evidence, cite every finding, do not edit config/strategy/registry/dashboard/research.md, no write outside lineage. Include exact route proof: mode="research", target_agent="deep-research", agent_definition_loaded=true, resolved_route="Resolved route: mode=research target_agent=deep-research".
