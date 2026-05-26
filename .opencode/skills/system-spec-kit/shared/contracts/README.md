---
title: "Contracts"
description: "Typed retrieval trace and response envelope contracts for shared retrieval code."
trigger_phrases:
  - "retrieval trace"
  - "context envelope"
  - "degraded mode contract"
---

# Contracts

---

## 1. OVERVIEW

`contracts/` owns typed data shapes for retrieval tracing and degraded-mode reporting. The folder is intentionally small so retrieval code can share trace metadata without importing handlers or response adapters.

Current state:

- `RetrievalTrace` records stage timing, counts and final result count.
- `DegradedModeContract` records fallback behavior and confidence impact.
- `ContextEnvelope<T>` wraps data with trace, metadata and optional degraded-mode details.
- Factory functions create and update these shapes with predictable defaults.

---

## 2. PACKAGE TOPOLOGY

```text
contracts/
+-- retrieval-trace.ts     # Trace, envelope and degraded-mode contracts
`-- README.md
```

Allowed dependency direction:

```text
retrieval callers -> contracts/retrieval-trace.ts
contracts/retrieval-trace.ts -> local helpers only
```

Disallowed dependency direction:

```text
contracts/* -> MCP handlers
contracts/* -> response adapters
contracts/* -> algorithm modules
contracts/* -> storage modules
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `retrieval-trace.ts` | Defines trace stages, trace entries, envelopes, degraded-mode data and factory functions. |

---

## 4. STABLE API

| Export | Kind | Contract |
|---|---|---|
| `RetrievalStage` | Type | One of `candidate`, `filter`, `fusion`, `rerank`, `fallback` or `final-rank`. |
| `TraceEntry` | Interface | One trace stage with timestamp, counts, duration and optional metadata. |
| `RetrievalTrace` | Interface | Full trace for one query, including stages and final result count. |
| `DegradedModeContract` | Interface | Failure mode, fallback mode, confidence impact, retry guidance and affected stages. |
| `ContextEnvelope<T>` | Interface | Generic response wrapper with `data`, `trace`, `metadata` and optional `degradedMode`. |
| `createTrace(query, sessionId, intent)` | Function | Creates an empty trace with generated `traceId`. |
| `addTraceEntry(trace, stage, in, out, ms, meta)` | Function | Adds one stage to a trace and updates totals. |
| `createEnvelope(data, trace, degraded, version)` | Function | Wraps data with trace metadata. |
| `createDegradedContract(failure, fallback, confidence, retry, stages)` | Function | Builds a degraded-mode record and clamps confidence impact. |

Treat these shapes as shared contracts. Add fields only when every caller can tolerate the extra data.

---

## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | Keep this folder free of runtime package imports. |
| Exports | Export typed contracts and small constructors only. |
| State | Do not store trace state outside values passed by callers. |
| Mutation | `addTraceEntry` mutates the trace passed to it and returns the same object. |
| Ownership | Response rendering belongs to callers, not this folder. |

Main flow:

```text
retrieval caller
  -> createTrace
  -> addTraceEntry per stage
  -> createDegradedContract when fallback runs
  -> createEnvelope for typed transport
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `retrieval-trace.ts` | Module | Complete public surface for retrieval contracts. |
| `createTrace` | Function | Starts trace collection. |
| `addTraceEntry` | Function | Records one retrieval stage. |
| `createEnvelope` | Function | Produces a typed envelope for callers. |
| `createDegradedContract` | Function | Records fallback behavior. |

---

## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/shared/contracts/README.md
```

Expected result: the validator exits with code `0`.

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../algorithms/README.md`](../algorithms/README.md)
- [`../types.ts`](../types.ts)
