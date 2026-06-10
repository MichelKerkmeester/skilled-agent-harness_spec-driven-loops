---
title: "Tool IDs Reference"
description: "Reference for all 9 public and 1 internal system-skill-advisor MCP tool IDs with namespaces, purposes, input or output schemas and usage signals."
trigger_phrases:
  - "advisor tool ids"
  - "skill graph tool ids"
  - "mk skill advisor tools"
  - "tool namespace convention"
---

# Tool IDs Reference

Reference for all 9 public and 1 internal system-skill-advisor MCP tool IDs with namespaces, purposes, input or output schemas and usage signals.

---

## 1. OVERVIEW

### Purpose

Lists the stable public and internal `system-skill-advisor` MCP tool IDs with namespaces, purposes and schema signals.

### When to Use

- Confirming the exact advisor or skill graph tool id to call.
- Updating routing docs, hooks or compatibility shims.
- Reviewing whether a proposed rename would break public contracts.

### Core Principle

The standalone server namespace may frame calls, but the per-tool ids are the compatibility contract.

### Key Sources

- `mcp_server/tools/index.ts`
- `mcp_server/tools/skill-graph-tools.ts`
- [`legacy_tool_bridge.md`](./legacy_tool_bridge.md)

---

## 2. ADVISOR TOOLS

| Tool | Purpose | Key Input | Output Shape Signal |
|---|---|---|---|
| `advisor_recommend` | Recommend skills for a prompt using the native scorer. Returns prompt-safe recommendations, lane attribution, lifecycle redirects, cache state, freshness and trust. | `prompt`, optional `options.topK`, `options.includeAttribution` | `recommendations[]`, `freshness`, `trustState`, `cache`, `_shadow` |
| `advisor_rebuild` | Rebuild the native advisor skill graph from checked-in metadata. Use when `advisor_status` reports stale or absent. | `force`, optional `workspaceRoot` | `rebuilt`, `skipped`, `reason`, generation deltas, `skillCount`, `diagnostics` |
| `advisor_status` | Report advisor freshness, skill-graph generation, trust state, lane weights and daemon availability without exposing prompt content. | `workspaceRoot`, optional `maxMetadataFiles` | `freshness`, `generation`, `trustState`, lane weights, daemon info, `errors` |
| `advisor_validate` | Run the native advisor regression bundle. Requires `confirmHeavyRun=true` because it executes heavier validation work. | `confirmHeavyRun`, optional `skillSlug`, optional `outcomeEvents[]` | `overallAccuracy`, `perSkill[]`, slices for corpus, holdout, parity, safety, latency, `telemetry`, `generatedAt` |

---

## 3. SKILL GRAPH TOOLS

| Tool | Purpose | Key Input | Output Shape Signal |
|---|---|---|---|
| `skill_graph_scan` | Index or re-index all `.opencode/skills/*/graph-metadata.json` files into `skill-graph.sqlite` using the hash-aware SQLite indexer. | optional `skillsRoot` (default `.opencode/skills`) | `scanResult`, `embeddings`, `sourceSignature` |
| `skill_graph_query` | Query the SQLite-backed skill graph using structural relationship traversals. Supports `depends_on`, `dependents`, `enhances`, `enhanced_by`, `family_members`, `conflicts`, `transitive_path`, `hub_skills`, `orphans` and `subgraph`. | `queryType` plus query-specific arguments | varies by `queryType` (`relationships[]`, `members[]`, `path[]`, `skills[]`, `graph{}`) |
| `skill_graph_status` | Report skill graph health from the live SQLite database. | (none) | `totalSkills`, `totalEdges`, `lastIndexedAt`, `families`, `categories`, `schemaVersions`, `staleness`, `validation`, `dbStatus` |
| `skill_graph_validate` | Validate the live skill graph for schema-version drift, broken edges, weight-band violations, reciprocal symmetry and dependency cycles. | (none) | `isValid`, `errorCount`, `warningCount`, `checkedNodes`, `checkedEdges`, `errors[]`, `warnings[]` |
| `skill_graph_propagate_enhances` | Detect, report and optionally apply missing inbound `edges.enhances[]` declarations across skills. Default mode is `report` (no writes). | optional `skillsRoot`, `mode`, `minConfidence`, `applyCandidateIds[]`, `applyAllHighConfidence`, `dryRun` | `candidates{detected[], proposed[], applied[]}`, `confidenceScores{}`, `dryRun`, `warnings[]` |

---

## 4. INTERNAL TOOLS

| Tool | Purpose | Access Gate |
|---|---|---|
| `skill_graph_propagate_enhances` | Internal authoring helper for missing `enhances` edges. See [propagate_enhances.md](../graph/propagate_enhances.md). | `requireTrustedCaller` plus workspace-escape guard |

The tool ships in the skill-graph tool set and appears in Section 3 for completeness. Section 4 documents its access gates. Untrusted callers are rejected before detection runs.

---

## 5. MCP NAMESPACE CONVENTION

All tools follow the pattern `mcp__mk_skill_advisor__<tool_name>` where `<tool_name>` matches the descriptor's `name` field in snake_case.

Worked examples:

- `advisor_recommend` is reachable as `mcp__mk_skill_advisor__advisor_recommend`.
- `skill_graph_query` is reachable as `mcp__mk_skill_advisor__skill_graph_query`.
- `skill_graph_propagate_enhances` is reachable as `mcp__mk_skill_advisor__skill_graph_propagate_enhances`.

Stable IDs survive migrations. The MCP server namespace may rename across packets, but the per-tool IDs do not change. See [legacy_tool_bridge.md](./legacy_tool_bridge.md) for the bridge policy.

The same public tool ids are also invocable through the daemon-backed CLI shim `.opencode/bin/skill-advisor.cjs` (for example `skill-advisor advisor_status --workspace-root "$PWD" --format json`), which accepts snake_case, kebab-case, and camelCase aliases. The CLI is an additive dual-stack fallback over the same warm daemon: `--warm-only` probes the daemon socket without cold-spawning, exit `75` signals retryable daemon/IPC unavailability, and the mutation tools (`advisor_rebuild`, `skill_graph_scan`, apply-mode `skill_graph_propagate_enhances`) additionally require `--trusted`.

---

## 6. SCHEMA INDEX

| Tool | Input Schema | Output Shape |
|---|---|---|
| `advisor_recommend` | `AdvisorRecommendInputSchema` | `AdvisorRecommendOutputSchema` |
| `advisor_rebuild` | `AdvisorRebuildInputSchema` | `AdvisorRebuildOutputSchema` |
| `advisor_status` | `AdvisorStatusInputSchema` | `AdvisorStatusOutputSchema` |
| `advisor_validate` | `AdvisorValidateInputSchema` | `AdvisorValidateOutputSchema` |
| `skill_graph_scan` | `ScanArgs` (inline interface) | `HandlerResponse` envelope |
| `skill_graph_query` | `QueryArgs` (inline interface) | `HandlerResponse` envelope |
| `skill_graph_status` | (none) | `HandlerResponse` envelope |
| `skill_graph_validate` | (none) | `HandlerResponse` envelope |
| `skill_graph_propagate_enhances` | `PropagateEnhancesArgs` (inline interface) | `HandlerResponse` envelope |

Advisor tools use Zod schemas under `mcp_server/schemas/`. Skill-graph tools use inline TypeScript interfaces and wrap responses in the shared `HandlerResponse` envelope.
