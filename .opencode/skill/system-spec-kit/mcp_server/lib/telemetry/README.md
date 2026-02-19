---
title: "Telemetry"
description: "Retrieval telemetry for observability and governance. Records latency, mode selection, fallback triggers, and composite quality scores for retrieval pipeline runs."
trigger_phrases:
  - "retrieval telemetry"
  - "latency metrics"
  - "quality metrics"
importance_tier: "normal"
---

# Telemetry

> Retrieval telemetry for observability and governance. Records latency, mode selection, fallback triggers, and composite quality scores for retrieval pipeline runs.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. RELATED RESOURCES](#5--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The telemetry module provides structured observability for the retrieval pipeline. It records per-stage latency, search mode selection, fallback triggers, and composite quality scores. Telemetry data flows to governance tooling and is used by retrieval handlers to surface pipeline health metrics.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 1 | `retrieval-telemetry.ts` |
| Metric Groups | 4 | LatencyMetrics, ModeMetrics, FallbackMetrics, QualityMetrics |
| Feature Flag | 1 | `SPECKIT_EXTENDED_TELEMETRY` (default: true) |

### Key Features

| Feature | Description |
|---------|-------------|
| **RetrievalTelemetry** | Main interface aggregating all metric groups for a single retrieval run |
| **LatencyMetrics** | Stage-by-stage timing: vector, bm25, graph, fusion, rerank, total |
| **ModeMetrics** | Search mode selection, override flag, and pressure level at time of retrieval |
| **FallbackMetrics** | Fallback trigger detection, reason string, and degraded-mode flag |
| **QualityMetrics** | Composite 0–1 quality score derived from relevance, result count, and latency |
| **Feature Flag** | `SPECKIT_EXTENDED_TELEMETRY` gates extended metric collection (default: enabled) |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
telemetry/
 retrieval-telemetry.ts    # Telemetry interfaces, types, and collection utilities
 README.md                 # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `retrieval-telemetry.ts` | Defines `RetrievalTelemetry`, `LatencyMetrics`, `ModeMetrics`, `FallbackMetrics`, and `QualityMetrics`; exposes collection helpers |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### Feature Flag

| Variable | Default | Purpose |
|----------|---------|---------|
| `SPECKIT_EXTENDED_TELEMETRY` | `true` | Enable extended metric collection (latency breakdown, quality scoring) |

When disabled, only the minimal `RetrievalTelemetry` shell is populated; latency, mode, fallback, and quality sub-metrics are omitted.

### RetrievalTelemetry

**Purpose**: Aggregate all metric groups for one retrieval run.

| Field | Type | Description |
|-------|------|-------------|
| `runId` | `string` | Unique identifier for this retrieval run |
| `timestamp` | `number` | Unix ms when the run started |
| `latency` | `LatencyMetrics` | Per-stage timing breakdown |
| `mode` | `ModeMetrics` | Search mode selection details |
| `fallback` | `FallbackMetrics` | Fallback trigger record |
| `quality` | `QualityMetrics` | Composite quality assessment |

### LatencyMetrics

**Purpose**: Record time spent in each pipeline stage.

| Field | Type | Description |
|-------|------|-------------|
| `vectorMs` | `number` | Vector search duration |
| `bm25Ms` | `number` | BM25 lexical search duration |
| `graphMs` | `number` | Graph traversal duration |
| `fusionMs` | `number` | RRF fusion duration |
| `rerankMs` | `number \| null` | Cross-encoder rerank duration (null if skipped) |
| `totalMs` | `number` | Wall-clock total for the full pipeline |

### ModeMetrics

**Purpose**: Capture which search mode was used and whether it was overridden.

| Field | Type | Description |
|-------|------|-------------|
| `selected` | `string` | Mode chosen for this run (e.g., `hybrid`, `vector-only`, `bm25-only`) |
| `overridden` | `boolean` | Whether the default mode was overridden by caller or pressure policy |
| `pressureLevel` | `number` | Cognitive pressure level at the time of selection (0–1) |

### FallbackMetrics

**Purpose**: Record whether and why the pipeline fell back to a degraded path.

| Field | Type | Description |
|-------|------|-------------|
| `triggered` | `boolean` | Whether any fallback was activated |
| `reason` | `string \| null` | Human-readable reason for fallback (null if not triggered) |
| `degraded` | `boolean` | Whether the run completed in degraded mode |

### QualityMetrics

**Purpose**: Composite quality score for the retrieval run.

| Field | Type | Description |
|-------|------|-------------|
| `score` | `number` | Composite quality score (0–1) |
| `relevanceComponent` | `number` | Contribution from result relevance scores |
| `countComponent` | `number` | Contribution from result count vs. requested limit |
| `latencyComponent` | `number` | Contribution from total latency vs. target threshold |

**Score Interpretation:**

| Range | Meaning |
|-------|---------|
| 0.80–1.00 | High quality |
| 0.60–0.79 | Acceptable |
| 0.40–0.59 | Degraded |
| < 0.40 | Poor — review fallback policy |

<!-- /ANCHOR:features -->

---

## 4. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Collect Telemetry for a Retrieval Run

```typescript
import {
  RetrievalTelemetry,
  LatencyMetrics,
  ModeMetrics,
  FallbackMetrics,
  QualityMetrics,
} from './telemetry/retrieval-telemetry';

const latency: LatencyMetrics = {
  vectorMs: 18,
  bm25Ms: 4,
  graphMs: 11,
  fusionMs: 3,
  rerankMs: null,
  totalMs: 36,
};

const mode: ModeMetrics = {
  selected: 'hybrid',
  overridden: false,
  pressureLevel: 0.2,
};

const fallback: FallbackMetrics = {
  triggered: false,
  reason: null,
  degraded: false,
};

const quality: QualityMetrics = {
  score: 0.87,
  relevanceComponent: 0.90,
  countComponent: 0.85,
  latencyComponent: 0.86,
};

const telemetry: RetrievalTelemetry = {
  runId: 'run-xyz-001',
  timestamp: Date.now(),
  latency,
  mode,
  fallback,
  quality,
};
```

### Example 2: Check Feature Flag Before Extended Collection

```typescript
const extended = process.env.SPECKIT_EXTENDED_TELEMETRY !== 'false';

if (extended) {
  // Collect full latency breakdown and quality score
  telemetry.latency = collectLatencyMetrics(stages);
  telemetry.quality = computeQualityScore(results, requestedLimit, telemetry.latency.totalMs);
} else {
  // Minimal telemetry only — skip latency and quality sub-metrics
  telemetry.latency = null;
  telemetry.quality = null;
}
```

### Common Patterns

| Pattern | When to Use |
|---------|-------------|
| Populate `RetrievalTelemetry` before returning from handler | Every retrieval handler call |
| Check `fallback.triggered` to gate quality alerts | Governance / SLO monitoring |
| Use `quality.score < 0.6` to log degraded-run warnings | Observability dashboards |
| Compare `latency.rerankMs` to `null` | Detect runs where reranking was skipped |

<!-- /ANCHOR:usage-examples -->

---

## 5. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [lib/README.md](../README.md) | Parent library overview |
| [lib/contracts/README.md](../contracts/README.md) | Retrieval pipeline contracts (envelopes, traces) |
| [lib/search/README.md](../search/README.md) | Hybrid search pipeline |
| [lib/cognitive/README.md](../cognitive/README.md) | Cognitive pressure monitoring |

### Related Modules

| Module | Purpose |
|--------|---------|
| `handlers/memory-search.ts` | Primary integration point for telemetry collection |
| `handlers/memory-context.ts` | Secondary integration point for telemetry collection |

<!-- /ANCHOR:related -->

---

**Version**: 1.7.2
**Last Updated**: 2026-02-19
