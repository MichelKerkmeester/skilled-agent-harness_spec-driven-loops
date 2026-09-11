---
title: "Tool IDs Reference"
description: "Reference for the nine stable system-skill-advisor command ids with purposes, input or output schemas and usage signals."
trigger_phrases:
  - "advisor tool ids"
  - "skill graph tool ids"
  - "mk skill advisor tools"
  - "tool namespace convention"
importance_tier: "normal"
contextType: "implementation"
version: 0.8.0.6
---

# Tool IDs Reference

Reference for the nine stable system-skill-advisor command ids with purposes, input or output schemas and usage signals.

---

## 1. OVERVIEW

### Purpose

Lists the nine stable `system-skill-advisor` command ids with purposes and schema signals. The count matches the live CLI command manifest and its parity suite; the trust-gated propagation helper is already included in Section 3.

### When to Use

- Confirming the exact advisor or skill graph command id to call.
- Updating routing docs, hooks or compatibility shims.
- Reviewing whether a proposed rename would break public contracts.

### Core Principle

The CLI is the only front door, and the per-command ids are the compatibility contract.

### Key Sources

- `runtime/tools/index.ts`
- `runtime/tools/skill-graph-tools.ts`
- [`legacy-tool-bridge.md`](./legacy-tool-bridge.md)

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

## 4. TRUST GATES

| Tool | Purpose | Access Gate |
|---|---|---|
`skill_graph_propagate_enhances` is an authoring helper with a trusted-caller gate, but it is already counted once in Section 3. See [propagate-enhances.md](../graph/propagate-enhances.md) for its access contract.

Untrusted callers are rejected before detection runs. No separate internal-tool count is published.

---

## 5. CLI INVOCATION CONVENTION

Every id is invoked through the single CLI front door:

```bash
node .opencode/bin/skill-advisor.cjs <command> --format json
```

Worked examples:

- `advisor_recommend` is invoked as `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json`.
- `skill_graph_query` is invoked as `node .opencode/bin/skill-advisor.cjs skill_graph_query --json '{"queryType":"hub_skills"}' --format json`.
- `skill_graph_propagate_enhances` is invoked as `node .opencode/bin/skill-advisor.cjs skill_graph_propagate_enhances --format json`; apply writes add `--trusted`.

Stable ids survive migrations: the invocation form is frozen and the per-command ids do not change.

The CLI accepts snake_case, kebab-case and camelCase aliases. Calls are sent untrusted by default, and the mutation commands (`advisor_rebuild`, `skill_graph_scan`, apply-mode `skill_graph_propagate_enhances`) additionally require `--trusted` or `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1`. `--warm-only` probes the daemon socket without cold-spawning. Exit `75` signals retryable daemon/IPC unavailability; the CLI answers from the local Python scorer with a degraded result when the daemon stays unreachable. The retired bridge policy is recorded in [legacy-tool-bridge.md](./legacy-tool-bridge.md).

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

Advisor tools use Zod schemas under `runtime/schemas/`. Skill-graph tools use inline TypeScript interfaces and wrap responses in the shared `HandlerResponse` envelope.
