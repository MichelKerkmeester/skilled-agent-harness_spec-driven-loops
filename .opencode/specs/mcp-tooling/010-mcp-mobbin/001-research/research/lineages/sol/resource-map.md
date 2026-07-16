---
title: "Resource Map — Mobbin MCP transport research"
description: "Evidence-derived resource map for the detached sol lineage."
---

# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

## Summary

- Scope: Mobbin MCP developer surface, official skill workflows, plan gating, Code Mode transport, and `sk-design` pairing.
- Generated from: five mechanically verified iteration deltas.
- Primary external authorities: Mobbin-hosted docs/API, the two official Mobbin GitHub repositories, public OAuth metadata, and the `mcp-remote` maintainer repository.
- Primary local authorities: `.utcp_config.json`, Code Mode contracts, `sk-design`, and the phase 002/003 specifications.
- Resource status is an evidence snapshot dated 2026-07-16; dynamic MCP schemas require live discovery.

## External Primary Sources

| Resource | Action | Status | Evidence use |
|---|---|---|---|
| `https://github.com/mobbin/mobbin-mcp-server` | Analyzed | OK | Official hosted-server registration repository; endpoint and transport |
| `https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/mcp.json` | Analyzed | OK | MCP registry metadata |
| `https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/server.json` | Analyzed | OK | Hosted Streamable HTTP server metadata |
| `https://github.com/mobbin/skills` | Analyzed | OK | Official skill repository and inventory |
| `https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md` | Analyzed | OK | `search_screens` workflow, inputs, output metadata, inline images |
| `https://docs.mobbin.com/mcp/introduction` | Cited | OK | OAuth/no-key setup and paid-plan eligibility |
| `https://docs.mobbin.com/mcp/clients/other` | Cited | OK | Streamable HTTP + OAuth client requirements and first-use browser flow |
| `https://docs.mobbin.com/mcp/build-an-integration` | Cited | OK | DCR, PKCE S256, tokens, and OAuth integration contract |
| `https://docs.mobbin.com/mcp/disconnect` | Cited | OK | Revocable client authorization |
| `https://docs.mobbin.com/overview` | Cited | OK | MCP versus REST API separation |
| `https://docs.mobbin.com/api/quickstart` | Cited | OK | Separate Team/Enterprise REST API key model |
| `https://docs.mobbin.com/rate-limits` | Cited | OK | 60/60 MCP rate, 429, `Retry-After`, backoff |
| `https://mobbin.com/mcp` | Cited | OK | Paid-plan product positioning |
| `https://mobbin.com/pricing` | Cited | OK | Free website limits, paid tiers, Finance+ boundary |
| `https://api.mobbin.com/mcp` | Validated | OK | Live 401 Bearer challenge and reachability |
| `https://api.mobbin.com/.well-known/oauth-protected-resource/mcp` | Validated | OK | Live protected-resource metadata |
| `https://ujasntkfphywizsdaapi.supabase.co/auth/v1/.well-known/oauth-authorization-server` | Validated | OK | Live issuer/endpoints/DCR/PKCE metadata |
| `https://github.com/geelen/mcp-remote` | Analyzed | OK | Stdio-to-remote adapter, OAuth behavior, transport strategy, prerequisites |

## Local Integration Sources

| Path | Action | Status | Evidence use |
|---|---|---|---|
| `.utcp_config.json` | Analyzed | OK | Name-keyed manual shape and existing hosted remote precedent |
| `.opencode/skills/mcp-code-mode/SKILL.md` | Analyzed | OK | Discovery-first flow, callable naming, Code Mode-only execution |
| `.opencode/skills/mcp-code-mode/references/configuration.md` | Analyzed | OK | Manual schema and remote OAuth example |
| `.opencode/skills/mcp-code-mode/references/naming_convention.md` | Analyzed | OK | `{manual}.{manual}_{tool}` convention |
| `.opencode/skills/mcp-tooling/mcp-figma/SKILL.md` | Analyzed | OK | External transport exemplar and discovery discipline |
| `.opencode/skills/mcp-tooling/mcp-figma/references/mcp-wiring.md` | Analyzed | OK | Live-vs-inferred tool-surface labeling pattern |
| `.opencode/skills/sk-design/SKILL.md` | Analyzed | OK | Transport-versus-judgment and acceptance boundary |
| `.opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/spec.md` | Analyzed | OK | Packet inventory, permission contract, manual asset ownership |
| `.opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/spec.md` | Analyzed | OK | Hub transport registration, cross-hub pairing, manual application |

## Lineage Artifacts

| Path | Action | Status | Note |
|---|---|---|---|
| `iterations/iteration-001.md` | Created | OK | Server, transport, OAuth baseline |
| `iterations/iteration-002.md` | Created | OK | Official skill and workflows |
| `iterations/iteration-003.md` | Created | OK | Plans, API split, rate limits |
| `iterations/iteration-004.md` | Created | OK | Code Mode manual and packet architecture |
| `iterations/iteration-005.md` | Created | OK | Protocol/freshness/risk audit |
| `deltas/iter-001.jsonl` … `deltas/iter-005.jsonl` | Validated | OK | Canonical per-iteration deltas |
| `findings-registry.json` | Updated | OK | Five resolved questions and twenty consolidated findings |
| `research.md` | Created | OK | Final authoring and validation contract |

## Coverage Gaps

- Authenticated paid-account `tools/list` and `tool_info` were not run.
- A clean Code Mode + current `mcp-remote` OAuth/refresh round trip was not run.
- Exact Free-account denial behavior and Finance+ result coverage are unpublished.
- These gaps are routed to downstream operator-authorized validation, not filled by inference.
