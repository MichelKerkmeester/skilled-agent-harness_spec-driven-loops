---
title: "code_graph_scan"
description: "Manual maintenance tool that scans workspace files, indexes structural nodes/edges and optionally runs the gold-query verifier after explicit full scans."
trigger_phrases:
  - "code_graph_scan"
  - "system-code-graph feature catalog"
importance_tier: "important"
version: 1.2.0.11
---

# code_graph_scan

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`code_graph_scan` is the explicit refresh path for the structural graph. It supports incremental scans, full scans, Git HEAD full-reindex promotion, detector provenance summaries, edge enrichment summaries and optional gold-battery verification.

## 2. HOW IT WORKS

### Trigger / Auto-Fire Path

Manual MCP maintenance call. Read paths may recommend it, but they do not run a broad full scan.

### Class

manual. `code_graph_scan`, verify, status and doctor commands remain the manual control plane.

### Caveats / Fallback

Run full scans in a disposable workspace for destructive exclude/prune checks. `verify:true` only runs after `incremental:false`.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:177-230` | Handler | resolves scan arguments and executes `indexFiles()` |
| `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:241-278` | Handler | prunes removed files and persists indexed results |
| `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:307-360` | Handler | returns scan counts, readiness, provenance and verification fields |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:19-48` | Schema | defines the public schema |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/02--manual-scan-verify-status/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

## 4. SOURCE METADATA

- Group: Manual scan verify status
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--manual-scan-verify-status/code-graph-scan.md`

Related references:

- [02-code-graph-verify.md](./code-graph-verify.md)
- [03-code-graph-status.md](./code-graph-status.md)
- [../../manual_testing_playbook/02--manual-scan-verify-status/code-graph-scan-incremental.md](../../manual_testing_playbook/02--manual-scan-verify-status/code-graph-scan-incremental.md)
