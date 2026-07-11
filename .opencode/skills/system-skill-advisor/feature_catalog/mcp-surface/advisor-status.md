---
title: "advisor_status MCP Tool"
description: "Diagnostic-only native MCP tool that reports advisor freshness, generation, trust state, skillCount, lastScanAt, lane weights and opt-in semantic-lane health without rebuilding stale state."
trigger_phrases:
  - "advisor_status"
  - "mcp status tool"
  - "advisor freshness status"
  - "trust state status"
  - "semanticLaneHealth"
version: 0.8.0.15
---

# advisor_status MCP Tool

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Give operators and runtimes a single diagnostic read that summarizes whether advisor state is healthy enough to trust for routing.

## 2. HOW IT WORKS

`handlers/advisor-status.ts` returns `freshness`, `generation`, `trustState` (with `state` and optional `reason`), `skillCount`, `lastScanAt` and `laneWeights` (the canonical 5-lane configuration). Freshness vocabulary is `live / stale / absent / unavailable`. The call is fail-open: even when the daemon is absent, status returns a well-formed envelope describing the shortfall.

When callers pass `includeSemanticHealth` or `debug`, the status envelope also includes `semanticLaneHealth`. That opt-in diagnostic reports active embedder identity, vector coverage, dimension mismatch state, last vector refresh timestamp, disabled reason and whether the semantic lane is enabled. The semantic-shadow lane records degraded-vector reasons such as database absence, adapter unavailability, dimension mismatch, prompt embedding failure, skill-vector load failure and empty vector coverage.

`readAdvisorStatus()` is strictly diagnostic. It reports stale, absent or unavailable advisor state and does not repair it. Operators should call `advisor_rebuild` when status reports stale state or when a forced rebuild is needed.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts:89-197` | Handler | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts` | Schema | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/trust-state.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` | Library | semantic-lane disabled-reason source |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-rebuild.ts:46-51` | Handler | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-status.vitest.ts` | Automated test | compact status, semantic health fields and degraded-vector reason coverage |
| `Playbook scenario [NC-002](../../manual_testing_playbook/native-mcp-tools/native-status-transitions.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: MCP surface
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `mcp-surface/advisor-status.md`

Related references:

- [01-advisor-recommend.md](./advisor-recommend.md).
- [05-advisor-rebuild.md](./advisor-rebuild.md).
- [`daemon-and-freshness/trust-state.md`](../daemon-and-freshness/trust-state.md).
- [`scorer-fusion/weights-config.md`](../scorer-fusion/weights-config.md).
