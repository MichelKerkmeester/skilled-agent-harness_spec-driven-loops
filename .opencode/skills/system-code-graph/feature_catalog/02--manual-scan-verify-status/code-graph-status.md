---
title: "code_graph_status"
description: "Diagnostic-only health probe that reads readiness, graph counts, parser health, tombstone audit status, edge drift and gold verification trust without mutating graph state."
trigger_phrases:
  - "code_graph_status"
  - "system-code-graph feature catalog"
importance_tier: "important"
version: 1.2.0.15
---

# code_graph_status

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`code_graph_status` reports graph health and readiness. It uses a read-only readiness snapshot so status calls do not repair stale state.

## 2. HOW IT WORKS

### Trigger / Auto-Fire Path

Manual diagnostic MCP call. Startup/resume surfaces may include status-like structural summaries, but this handler itself runs only when requested.

When tombstone auditing is enabled with `SPECKIT_CODE_GRAPH_TOMBSTONES=true`, status includes retained deletion lineage from the graph stats summary: counts by kind and reason plus recent retained tombstones. With the flag unset, the audit remains default-off and live graph queries continue to read only active nodes and edges. The retained set is bounded by `SPECKIT_CODE_GRAPH_TOMBSTONE_LIMIT`, default 100: every tombstone-recording write prunes the table to the most recent rows by deletion time, so a flat retention of 100 entries survives unless the operator raises the cap. The limit is clamped to a maximum of 10000, and a non-positive or unparseable value falls back to the default of 100.

The successful status payload includes `data.activeScope` with structured `includeGlobs` and `excludeGlobs` arrays alongside the scope label. When either list narrows the scan, the label appends `narrowed by includeGlobs: ...` and/or `excludeGlobs: ...` so callers can see restricted coverage without parsing the fingerprint.

### Class

manual diagnostic. Diagnostic freshness tools detect state. Explicit repair paths rebuild or scan.

### Caveats / Fallback

Status can recommend `rg` or `code_graph_scan`. It does not perform either. Treat stale status as an operator prompt, not repair proof.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:212-248` | Handler | reads the readiness and scope snapshot before stats |
| `.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:250-298` | Handler | returns a degraded envelope when stats are unavailable |
| `.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:340-366` | Handler | assembles the successful status payload, including structured active-scope globs |
| `.opencode/skills/system-code-graph/mcp_server/lib/index-scope-policy.ts:175-196` | Library | builds scope labels that call out glob narrowing |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Library | flag-gated tombstone schema, retention pruning bounded by `SPECKIT_CODE_GRAPH_TOMBSTONE_LIMIT` (default 100, clamped to 10000) and stats summary |
| `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts` | Handler | includes explicit cleanup reasons and scan tombstone summary |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:66-70` | Schema | defines the public schema |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/02--manual-scan-verify-status/` | Manual Playbook | Operator-facing manual scenarios for this feature category |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts` | Automated test | default-off behavior, enabled lineage, retention pruning and query isolation |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts` | Automated test | explicit deletion reasons |

## 4. SOURCE METADATA

- Group: Manual scan verify status
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--manual-scan-verify-status/code-graph-status.md`

Related references:

- [01-code-graph-scan.md](./code-graph-scan.md)
- [../01--read-path-freshness/ensure-code-graph-ready.md](../01--read-path-freshness/ensure-code-graph-ready.md)
- [../../manual_testing_playbook/02--manual-scan-verify-status/code-graph-status-readonly.md](../../manual_testing_playbook/02--manual-scan-verify-status/code-graph-status-readonly.md)
