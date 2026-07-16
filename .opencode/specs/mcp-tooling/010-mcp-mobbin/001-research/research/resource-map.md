---
title: "Resource Map — Mobbin MCP fan-out research (consolidated)"
description: "Deduplicated consolidation of the sol and luna lineage resource maps plus glm's cited source inventory."
---

# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

## Summary

- Scope: Mobbin MCP developer surface — tool surface, transport/install, auth model, plan gating, official skills workflows, `mobbin` UTCP manual, `mcp-mobbin` transport-packet inputs, `sk-design` pairing.
- **Consolidation rationale:** two lineages emitted resource maps (`lineages/sol/resource-map.md`, `lineages/luna/resource-map.md`); **glm emitted none** (its map was skipped at init — "resource-map.md was not present at init; the coverage gate was skipped"), so glm's sources were folded in from its `lineages/glm/research.md` §7 source list. Entries below are deduplicated across all three; the "Lineages" column records which lineage(s) used each source.
- Resource status is an evidence snapshot dated 2026-07-16; dynamic MCP schemas require live authenticated discovery (see canonical `research.md` Open Questions).

## External Primary Sources

| Resource | Action | Status | Lineages | Evidence use |
|---|---|---|---|---|
| `https://github.com/mobbin/mobbin-mcp-server` | Analyzed | OK | sol, glm, luna | Official hosted-server registration repo (metadata-only); endpoint and transport |
| `https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/server.json` | Analyzed | OK | sol, glm, luna | Manifest `com.mobbin/mobbin` v1.0.1; `remotes:[{type:streamable-http, url:https://api.mobbin.com/mcp}]` |
| `https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/mcp.json` | Analyzed | OK | sol, glm, luna | Minimal url-only client config (`mcpServers.mobbin.url`) |
| `https://github.com/mobbin/mobbin-mcp-server/blob/main/README.md` | Analyzed | OK | glm, luna | Hosted-endpoint README; confirms repo thinness (no runtime) |
| `https://github.com/mobbin/skills` | Analyzed | OK | sol, glm, luna | Official skills repo (MIT); inventory, prerequisites, `npx skills add mobbin/skills` install |
| `https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md` | Analyzed | OK | sol, glm, luna | `search_screens` contract: inputs, `screens[]`/`failed[]`/inline-image response, workflow, visual analysis |
| `https://docs.mobbin.com/mcp/introduction` | Cited | OK | sol, luna | OAuth no-key setup; Pro/Team/Enterprise plan gate |
| `https://docs.mobbin.com/mcp/build-an-integration` | Cited | OK | sol, luna | DCR (RFC 7591), PKCE S256, `openid`, tokens, OAuth integration contract |
| `https://docs.mobbin.com/mcp/clients/other` | Cited | OK | sol, luna | Streamable HTTP + OAuth client requirements; first-use browser flow |
| `https://docs.mobbin.com/mcp/clients/overview` | Cited | OK | luna | Supported-client context |
| `https://docs.mobbin.com/mcp/disconnect` | Cited | OK | sol, luna | Revocation path (Account Settings → MCP) |
| `https://docs.mobbin.com/overview` | Cited | OK | sol, luna | MCP vs REST API separation |
| `https://docs.mobbin.com/api/quickstart` | Cited | OK | sol, luna | Separate Team/Enterprise REST workspace API-key model |
| `https://docs.mobbin.com/rate-limits` | Cited | OK | sol, luna | 60 req/60 s per user; 429 + `Retry-After` + backoff |
| `https://docs.mobbin.com/mcp` | Analyzed | OK | glm | Separate Mintlify docs-search MCP ("Mobbin Docs"): `search_mobbin_docs`, `query_docs_filesystem_mobbin_docs`, `submit_feedback` — two-server disambiguation |
| `https://mobbin.com/mcp` | Cited | OK | sol | Paid-plan product positioning |
| `https://mobbin.com/pricing` | Cited | OK | sol | Free website limits, paid tiers, Finance+ add-on boundary |
| `https://api.mobbin.com/mcp` | Validated (live probe) | OK | sol, luna | Live 401 Bearer challenge; reachability; protected-resource pointer |
| `https://api.mobbin.com/.well-known/oauth-protected-resource/mcp` | Validated (live probe) | OK | sol, luna | Protected-resource metadata: resource, Supabase authorization server, `openid` |
| `https://ujasntkfphywizsdaapi.supabase.co/auth/v1/.well-known/oauth-authorization-server` | Validated (live probe) | OK | sol | Issuer authorization/token/registration endpoints; PKCE S256 (+`plain` advertised) |
| `https://github.com/geelen/mcp-remote` | Analyzed | OK | sol | Stdio-to-remote adapter: OAuth behavior, HTTP-first/SSE-on-404 strategy, Node 18+ prerequisite, troubleshooting |
| `https://api.github.com/repos/mobbin/mobbin-mcp-server/commits?per_page=1` | Validated | OK | sol | Freshness: HEAD `bbee2a6b...` (2026-06-03) |
| `https://api.github.com/repos/mobbin/skills/commits?per_page=1` | Validated | OK | sol | Freshness: HEAD `96577863...` (2026-05-04) |
| `https://api.github.com/repos/mobbin/skills/contents/skills` | Validated | OK | sol | `skills/` tree contains only `mobbin-search` |

## Local Integration Sources

| Path | Action | Status | Lineages | Evidence use |
|---|---|---|---|---|
| `.utcp_config.json` | Analyzed | OK | sol | Name-keyed manual shape; existing hosted-remote (`mcp-remote`) precedent (line 147) |
| `.opencode/skills/mcp-code-mode/SKILL.md` | Analyzed | OK | sol | Discovery-first flow, callable naming, Code Mode-only execution |
| `.opencode/skills/mcp-code-mode/references/configuration.md` | Analyzed | OK | sol, luna | Manual schema (`stdio`/`sse` shapes) and remote OAuth example |
| `.opencode/skills/mcp-code-mode/references/naming_convention.md` | Analyzed | OK | sol, luna | `{manual}.{manual}_{tool}` convention |
| `.opencode/skills/mcp-code-mode/scripts/validate_config.py` | Analyzed | OK | luna | Current MCP config validation constraints (no direct streamable-http shape) |
| `.opencode/skills/mcp-tooling/SKILL.md` | Analyzed | OK | luna | Cross-hub transport and judgment rule |
| `.opencode/skills/mcp-tooling/mode-registry.json` | Analyzed | OK | luna | Transport/read-only registry pattern; transport-axis + pairing shape |
| `.opencode/skills/mcp-tooling/mcp-figma/SKILL.md` | Analyzed | OK | sol, luna | Read-only external-transport exemplar; discovery discipline |
| `.opencode/skills/mcp-tooling/mcp-figma/references/mcp_wiring.md` | Analyzed | OK | sol | Live-vs-inferred tool-surface labeling pattern |
| `.opencode/skills/mcp-tooling/mcp-figma/assets/utcp_figma_manual.md` | Analyzed | OK | luna | Paste-ready UTCP manual exemplar |
| `.opencode/skills/sk-design/SKILL.md` | Analyzed | OK | sol | Transport-versus-judgment and acceptance boundary |
| `.opencode/skills/sk-design/design-md-generator/SKILL.md` | Analyzed | OK | luna | Design-judgment boundary |
| `.opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/spec.md` | Analyzed | OK | sol | Packet inventory, permission contract, manual asset ownership |
| `.opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/spec.md` | Analyzed | OK | sol | Hub transport registration, cross-hub pairing, manual application |
| Parent `spec.md` + `context/website-link.md` | Cited | OK | glm | Source-link inventory and phase framing |

## Fan-Out / Synthesis Artifacts

| Path | Action | Status | Note |
|---|---|---|---|
| `lineages/sol/resource-map.md` | Consolidated | OK | Source map for sol rows above |
| `lineages/luna/resource-map.md` | Consolidated | OK | Source map for luna rows above |
| `lineages/glm/` (no resource-map.md) | Reconstructed | OK | glm rows folded in from `lineages/glm/research.md` §7 |
| `lineages/{sol,glm,luna}/research.md` | Synthesized | OK | Lineage syntheses merged into canonical `research.md` |
| `lineages/{sol,glm,luna}/iterations/iteration-*.md` | Verified (spot) | OK | Used to adjudicate the `deep`-parameter conflict (glm iter-002:37 vs sol iter-002:17) |
| `deep-research-findings-registry.json` | Cited | OK | Merged 10-finding registry (3 lineages) |
| `fanout-attribution.md` | Cited | OK | Lineage/iteration/convergence attribution |
| `orchestration-summary.json` | Cited | OK | 3/3 first-attempt success; glm timestamp-anomaly note |
| `research.md` (this folder) | Created | OK | Canonical 17-section synthesis with reconciliation ledger |

## Coverage Gaps (union, routed downstream — not filled by inference)

- Authenticated paid-account `tools/list` / `tool_info()` were never run (all lineages).
- A clean Code Mode + current `mcp-remote` OAuth/refresh round trip was not run (sol, luna).
- Exact Free-account denial behavior, per-plan usage caps within eligible tiers, and Finance+ MCP coverage are unpublished (sol, glm).
- Inline-image fidelity through `call_tool_chain` is unverified (glm).
- Whether `deep` is a live schema input is unresolved (glm vs sol conflict).
