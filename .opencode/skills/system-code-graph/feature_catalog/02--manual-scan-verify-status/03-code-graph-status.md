---
title: "code_graph_status"
description: "Diagnostic-only health probe that reads readiness, graph counts, parser health, edge drift and gold verification trust without mutating graph state."
trigger_phrases:
  - "code_graph_status"
  - "system-code-graph feature catalog"
importance_tier: "important"
---

# code_graph_status

## 1. OVERVIEW

`code_graph_status` reports graph health and readiness. It uses a read-only readiness snapshot so status calls do not repair stale state.

## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Manual diagnostic MCP call. Startup/resume surfaces may include status-like structural summaries, but this handler itself runs only when requested.

### Class

manual diagnostic. Diagnostic freshness tools detect state. Explicit repair paths rebuild or scan.

### Caveats / Fallback

Status can recommend `rg` or `code_graph_scan`. It does not perform either. Treat stale status as an operator prompt, not repair proof.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:158-180` | Handler | reads the readiness snapshot before stats |
| `.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:181-212` | Handler | returns a degraded envelope when stats are unavailable |
| `.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:214-260` | Handler | assembles the successful status payload |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:72-76` | Schema | defines the public schema |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/02--manual-scan-verify-status/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

## 4. SOURCE METADATA

- Group: Manual scan verify status
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--manual-scan-verify-status/03-code-graph-status.md`

Related references:

- [01-code-graph-scan.md](./01-code-graph-scan.md)
- [../01--read-path-freshness/01-ensure-code-graph-ready.md](../01--read-path-freshness/01-ensure-code-graph-ready.md)
- [../../manual_testing_playbook/02--manual-scan-verify-status/006-code-graph-status-readonly.md](../../manual_testing_playbook/02--manual-scan-verify-status/006-code-graph-status-readonly.md)
