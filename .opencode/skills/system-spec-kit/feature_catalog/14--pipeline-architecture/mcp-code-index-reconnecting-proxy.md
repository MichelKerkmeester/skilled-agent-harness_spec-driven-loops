---
title: "MCP code-index reconnecting proxy"
description: "mk-code-index bridges secondary clients through the same reconnecting session proxy as mk-spec-memory, so a code-index owner death reattaches and replays in-flight read queries instead of returning a hard connection-closed error. A generic classify-frame factory drives per-server replay sets while graph-mutating tools are never replayed."
trigger_phrases:
  - "code-index reconnecting proxy"
  - "code-index owner death reattach replay"
  - "createClassifyFrame replay sets"
  - "code_graph read query replay"
  - "connection closed code index recovery"
---

# MCP code-index reconnecting proxy

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

mk-spec-memory already bridges secondary clients through a reconnecting session proxy that reattaches and replays in-flight reads when the owning daemon dies. mk-code-index used to lack that resilience, so a code-index owner death surfaced to bridged clients as a hard connection-closed error.

The reconnecting proxy now drives mk-code-index through the same machinery. When the code-index owner dies, secondary clients reattach to the respawned backend and the proxy replays in-flight read queries, so a recoverable recycle looks like a brief pause instead of a dropped connection. A generic `createClassifyFrame({ replayableToolNames, unsafeToolNames })` factory builds the per-server replay set: read tools replay, while scan, apply, and the verify path that mutates on baseline persistence are never replayed. The default mk-spec-memory classifier is unchanged.

## 2. HOW IT WORKS

### Shared reconnecting proxy

mk-code-index reuses the same launcher session proxy as mk-spec-memory. Secondary clients connect through the proxy, and on an owner death the proxy reattaches to the respawned backend and replays the reads it was holding, rather than tearing the client connection down.

### Generic classify-frame factory

`createClassifyFrame({ replayableToolNames, unsafeToolNames })` is a factory in the session-proxy library. Each server passes its own replay and unsafe tool sets, so one piece of proxy machinery serves both daemons with different safety classifications and the mk-spec-memory classifier stays exactly as it was.

### Code-graph replay set

The code-index replay set covers the read tools `code_graph_query`, `code_graph_context`, `code_graph_status`, `code_graph_classify_query_intent`, and `detect_changes`. These are safe to re-drive across a reattach because they do not change graph state, so replaying them after a recycle returns the same result the caller was waiting for.

### Never-replay mutating tools

`code_graph_scan` and `code_graph_apply` mutate the graph and are listed as unsafe, so the proxy never replays them. `code_graph_verify` is read-mostly but mutates when it persists the gold verification baseline, so it is unsafe too. On a recoverable recycle the client re-drives any of these itself rather than risking a duplicated mutation through replay.

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `.opencode/bin/mk-code-index-launcher.cjs` | Bridges secondary clients through the reconnecting session proxy, declares the code-graph replayable read set and the never-replay scan/apply/verify set, and builds the code-index classify frame |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Defines the generic `createClassifyFrame({ replayableToolNames, unsafeToolNames })` factory that drives per-server replay classification for both mk-code-index and mk-spec-memory |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/launcher-code-index-proxy.vitest.ts` | Automated test | Unit-tests the code-index reattach-and-replay path, the read-tool replay set, and the never-replay classification of scan, apply, and verify |

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `14--pipeline-architecture/mcp-code-index-reconnecting-proxy.md`
Related references:
- [mcp-launcher-front-proxy.md](mcp-launcher-front-proxy.md) — MCP launcher front-proxy (reconnecting session proxy)
