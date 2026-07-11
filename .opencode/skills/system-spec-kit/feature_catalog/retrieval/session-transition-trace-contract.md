---
title: "Session transition trace contract"
description: "memory_context emits a spec-shaped sessionTransition envelope only when includeTrace is set, so non-traced callers see no metadata leakage on the response."
trigger_phrases:
  - "session transition trace contract"
  - "sessionTransition envelope"
  - "includeTrace"
  - "trace-gated session metadata"
version: 3.6.0.4
---

# Session transition trace contract

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The session transition trace contract gates a structured `sessionTransition` payload behind `includeTrace`. When a caller opts in, `memory_context` returns ordered transition fields (previous state, current state, confidence, signal sources). When `includeTrace` is absent or false, the field is omitted entirely so non-trace callers cannot rely on or accidentally cache transition metadata.

This contract preserves the existing `memory_context` shape for default callers, gives observability and resume tooling a stable trace surface, and keeps non-trace responses byte-stable across runs by suppressing any top-level transition metadata.

---

## 2. HOW IT WORKS

`memory_context` reads `includeTrace` from its input schema, computes the transition off the most recent session signals, and only mounts it under `trace.sessionTransition` when tracing is requested. The transition fields are filled by the shared session-transition library, which orders `signalSources` deterministically for reproducible traces.

- `trace.sessionTransition.previousState`: derived label for the prior session phase
- `trace.sessionTransition.currentState`: derived label for the active session phase
- `trace.sessionTransition.confidence`: clamped confidence from the resolver
- `trace.sessionTransition.signalSources`: ordered list of contributing signal channels

Without `includeTrace`, the resolver still computes internal state for routing decisions, but the response strips the envelope before serialization so non-trace callers receive a clean payload.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-context.ts` | Handler | Reads `includeTrace`, calls the session-transition resolver, and gates the `sessionTransition` field on trace mode |
| `mcp_server/lib/search/session-transition.ts` | Library | Computes the transition object, orders `signalSources`, and clamps confidence |
| `mcp_server/handlers/memory-search.ts` | Handler | Shares the trace gating convention so transitions never leak through search responses |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/memory-context-session-state.vitest.ts` | Automated test | Trace-only gating, ordering stability, and confidence clamping |
| `mcp_server/tests/memory-context.vitest.ts` | Automated test | Response shape with and without `includeTrace` |

---

## 4. SOURCE METADATA
- Group: Retrieval
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `retrieval/session-transition-trace-contract.md`
Related references:
- [search-api-surface.md](search-api-surface.md) — Search API surface
- [bounded-graph-diagnostics.md](bounded-graph-diagnostics.md) — Bounded graph diagnostics
