---
title: "MCP code-index reconnecting proxy"
trigger_phrases:
  - "code-index reconnecting proxy"
  - "code-index owner death reattach replay"
  - "createClassifyFrame replay sets"
  - "code_graph read query replay"
  - "connection closed code index recovery"
version: 3.6.0.2
---

# MCP code-index reconnecting proxy

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW



## 2. HOW IT WORKS

### Shared reconnecting proxy


### Generic classify-frame factory

`createClassifyFrame({ replayableToolNames, unsafeToolNames })` is a factory in the session-proxy library. Each server passes its own replay and unsafe tool sets, so one piece of proxy machinery serves both daemons with different safety classifications and the mk-spec-memory classifier stays exactly as it was.

### Code-graph replay set


### Never-replay mutating tools


## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/launcher-code-index-proxy.vitest.ts` | Automated test | Unit-tests the code-index reattach-and-replay path, the read-tool replay set and the never-replay classification of scan, apply and verify |

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `pipeline-architecture/mcp-code-index-reconnecting-proxy.md`
Related references:
- [mcp-launcher-front-proxy.md](../../feature-catalog/pipeline-architecture/mcp-launcher-front-proxy.md) — MCP launcher front-proxy (reconnecting session proxy)
