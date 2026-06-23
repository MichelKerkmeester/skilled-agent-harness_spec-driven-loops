---
title: "Live / Stale / Absent / Unavailable Trust State"
description: "Fail-open trust state vocabulary that lets readers interpret freshness without blocking on the daemon."
trigger_phrases:
  - "trust state"
  - "live stale absent unavailable"
  - "freshness vocabulary"
  - "fail open trust"
version: 0.8.0.12
---

# Live / Stale / Absent / Unavailable Trust State

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Give every consumer (native MCP tools, CLI hooks, plugin bridge, Python shim) a single shared vocabulary for describing whether advisor state is current, aged, missing or unreadable, without ever blocking the reader.

## 2. HOW IT WORKS

`lib/freshness/trust-state.ts` classifies state into `live`, `stale`, `absent` or `unavailable`. The semantics are:

| State | Meaning |
| --- | --- |
| `live` | Daemon writer is active and generation is fresh. |
| `stale` | No live writer but a previous snapshot is readable. |
| `absent` | No snapshot exists for the workspace. |
| `unavailable` | Underlying storage is unreadable (corruption, permissions). |

All consumers fail open: a `stale`, `absent` or `unavailable` state never crashes. The caller gets an explicit state and can decide whether to proceed.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/trust-state.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-freshness.vitest.ts` | Automated test | state transitions |
| `Playbook scenarios [NC-002](../../manual_testing_playbook/01--native-mcp-tools/native-status-transitions.md) and [OP-001..OP-003](../../manual_testing_playbook/04--operator-h5/).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Daemon and freshness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--daemon-and-freshness/trust-state.md`

Related references:

- [04-generation.md](./generation.md).
- [06-rebuild-from-source.md](./rebuild-from-source.md).
- [07-cache-invalidation.md](./cache-invalidation.md).
