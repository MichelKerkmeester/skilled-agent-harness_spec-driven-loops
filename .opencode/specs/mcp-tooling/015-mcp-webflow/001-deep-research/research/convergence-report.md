# Convergence Report — Webflow MCP 2.0 Phase 1 Research

## Run Configuration

- Stop policy: `max-iterations` (forced depth, no early convergence)
- Convergence mode: off (telemetry only)
- Lineages: `deepseek-max` (cli-pi / deepseek-v4-flash / max) — 5 iterations; `luna-fast` (cli-opencode / openai/gpt-5.6-luna-fast / xhigh) — 5 iterations; `deepseek-v4-flash-max` (cli-pi / deepseek-v4-flash / max) — 5 iterations
- Total productive iterations: 15/15 across 3 lineages (REQ-002 and REQ-003 satisfied as specified: one cli-pi deepseek-v4-flash max lineage and one cli-opencode gpt-5.6-luna-fast xhigh lineage, five valid iterations each)

## Agreement Between Lineages

| Question | deepseek-max | luna-fast | Verdict |
|---|---|---|---|
| Mode classification | transport (leaf under mcp-tooling hub) | transport-first, fail-closed | **Converged** |
| Auth posture | remote OAuth experimental; local token fallback | remote `/mcp` endpoint + OAuth; local stdio repo surface contradicts | **Converged** (luna adds version-surface caveat) |
| Safety model | 5 operation classes; confirmation-gated publish/destructive/deploy | same classes; progressively stronger confirmations | **Converged** |
| Design pairing | Designer-family → sk-design; Data-family transport-only | same | **Converged** |
| Non-production smoke | dedicated test workspace + Starter site; staging subdomain only | staging isolation unresolved as a live capability | **Converged on pattern**; Phase 8 must verify a real test site |

## Residual Divergence

- luna-fast flags the public `webflow/mcp-server` README (`/sse`, no resources) vs hosted docs (`/mcp`) as an **unresolved version-surface contradiction**; deepseek-max's inventory is source-level (per-module actions). Phase 3 must pin the transport version and reconcile the two surfaces before wiring `.utcp_config.json`.

## Stop-Policy Compliance

- Both lineages reached exactly 5 iterations; no early stop; convergence telemetry never truncated the run.
