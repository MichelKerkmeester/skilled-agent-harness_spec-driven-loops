DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 5 of 6
Research Topic: Custom Claude-app-style mobile client for Pi RPC through a secure relay.
Focus Area: Define PWA/mobile behavior and product phasing: iOS/Android web push availability, service-worker and background execution limits, reconnect/settlement notification triggers, metadata-only push payloads, stale approval handling, tailnet + relay onboarding, installability, offline/read-only cache, session list/chat/tool/approval UX, accessibility, and MVP versus later phases. Prefer official Apple/WebKit, MDN/W3C, and Pi sources. Distinguish confirmed platform behavior from inference.
Stop Policy: max-iterations; iteration 6 is still required even if all original questions are answered here. Use iteration 6 for independent architecture validation and gap closure.

Read target-local config, state, strategy, registry, and iterations 1-4 first.
Write only under the lineage root:
- iterations/iteration-005.md
- append exactly one canonical iteration record to deep-research-state.jsonl
- deltas/iter-005.jsonl

Hard constraints: one LEAF iteration; no subagents; 3-5 focused research actions; cite every finding; do not edit config/strategy/registry/dashboard/research.md; no write outside lineage. Include exact route proof fields: mode="research", target_agent="deep-research", agent_definition_loaded=true, resolved_route="Resolved route: mode=research target_agent=deep-research".
