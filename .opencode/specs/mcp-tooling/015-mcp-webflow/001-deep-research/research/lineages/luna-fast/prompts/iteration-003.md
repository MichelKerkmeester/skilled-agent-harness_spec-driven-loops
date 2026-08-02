DEEP-RESEARCH

Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

STATE SUMMARY
Segment: 1 | Iteration: 3 of 5
Questions: 2/5 partially answered | Last focus: official server surface and transport (0.90, insight)
Stop policy: max-iterations | Convergence mode: off; convergence is telemetry only
Next focus: Official authentication, scopes, roles, and non-production test target.

Research topic: Webflow MCP 2.0 features (https://webflow.com/blog/mcp-2-features), followed by official Webflow MCP, developer, API, authentication, and changelog documentation

Investigate one focus only: Webflow authentication and authorization for MCP and the underlying APIs. Use official Webflow MCP setup/auth docs and official developer API references to map remote OAuth, local WEBFLOW_TOKEN modes, site/workspace/OAuth token differences, scopes, role requirements, token storage/secret-handling guidance, and any documented non-production or staging boundary. Preserve contradictions between current deployed docs and the public repository. Do not research rate limits or integration design beyond auth implications; do not use any actual credentials or call Webflow MCP tools.

State files:
- Config: .opencode/specs/mcp-tooling/015-mcp-webflow/001-deep-research/research/lineages/luna-fast/deep-research-config.json
- State: .opencode/specs/mcp-tooling/015-mcp-webflow/001-deep-research/research/lineages/luna-fast/deep-research-state.jsonl
- Strategy: .opencode/specs/mcp-tooling/015-mcp-webflow/001-deep-research/research/lineages/luna-fast/deep-research-strategy.md
- Registry: .opencode/specs/mcp-tooling/015-mcp-webflow/001-deep-research/research/lineages/luna-fast/findings-registry.json
- Iteration output: .opencode/specs/mcp-tooling/015-mcp-webflow/001-deep-research/research/lineages/luna-fast/iterations/iteration-003.md
- Delta output: .opencode/specs/mcp-tooling/015-mcp-webflow/001-deep-research/research/lineages/luna-fast/deltas/iter-003.jsonl

Allowed writes: only the two iteration outputs above and, if progressiveSynthesis is enabled, the packet-local research.md. Do not edit config, strategy, registry, dashboard, spec.md, hub files, or any path outside the lineage directory. Do not dispatch sub-agents. Every finding must cite [SOURCE: url] or [INFERENCE: ...]. Include ruled-out directions, secret-safety notes, and the next focus.
