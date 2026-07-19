---
title: "Telemetry"
description: "Retrieval telemetry, scoring observation, trace validation, eval channel tracking, and consumption logging for the MCP server."
trigger_phrases:
  - "retrieval telemetry"
  - "latency metrics"
  - "quality metrics"
  - "scoring observability"
  - "trace schema"
  - "eval channel tracking"
---

# Telemetry

`lib/telemetry/` defines safe observability shapes for retrieval and scoring. Runtime code records bounded telemetry for active requests. Maintenance code samples traces, audits scoring signals, and reviews stored channel contribution data.

## 1. OVERVIEW

Telemetry is an observation layer. It must not decide ranking, mutate memory records, or make recovery choices. Retrieval handlers can rely on stable data shapes even when extended telemetry is disabled.

Runtime role:

- Build `RetrievalTelemetry` shells for handler responses.
- Capture latency, mode, fallback, quality, graph-health, and trace payload fields when enabled.
- Validate trace payloads before exposing them.

Maintenance role:

- Sample scoring observations for cold-start and interference signals.
- Track eval channel contribution for later analysis.
- Inspect stored trace and consumption tables during audits.

## 2. TOPOLOGY

```text
┌────────────────────┐
│ Retrieval handlers │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ RetrievalTelemetry │
└─────────┬──────────┘
          ├──────────────┬──────────────┬──────────────┐
          ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Trace schema │ │ Scoring obs  │ │ Eval channel │ │ Consumption  │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

## 3. KEY FILES

| File | Role |
| --- | --- |
| `retrieval-telemetry.ts` | Runtime type definitions and collection helpers for latency, mode, fallback, quality, architecture, graph-health, adaptive, and trace fields. |
| `trace-schema.ts` | Runtime validation and sanitization for canonical retrieval trace payloads. |
| `scoring-observability.ts` | Sampled SQLite-backed scoring observations for N4 cold-start boost and TM-01 interference scoring. |
| `eval-channel-tracking.ts` | Channel contribution telemetry used by eval and reporting paths. |
| `consumption-logger.ts` | Active consumption event logging surface. `isConsumptionLogEnabled()` delegates to the `SPECKIT_CONSUMPTION_LOG` feature flag. |

## 4. BOUNDARIES

Owns:

- Telemetry data contracts and trace validation.
- Optional sampling for scoring diagnostics.
- Safe, flag-gated behavior for production request paths.

Does not own:

- Retrieval ranking or reranking logic.
- Eval metric formulas.
- Memory DB schema outside telemetry tables.
- Resume or packet continuity order.

## 5. ENTRYPOINTS

| Entrypoint | Caller | Notes |
| --- | --- | --- |
| `createRetrievalTelemetry()` | Retrieval handlers | Returns a stable shell when extended telemetry is off. |
| `sanitizeRetrievalTracePayload()` | Trace-enabled handlers | Strips invalid or extra fields. |
| `isRetrievalTracePayload()` | Tests and runtime guards | Type guard for exact trace shape. |
| `shouldSample()` and `logScoringObservation()` | Scoring paths | Sampling prevents hot-path write volume. |
| `initEvalChannelTracking()` | Eval setup | Prepares channel telemetry storage. |
| `isConsumptionLogEnabled()` | Retrieval handlers and tests | Returns the current `SPECKIT_CONSUMPTION_LOG` feature-flag state. |

### Key Environment Flags

| Variable | Default | Scope |
| --- | --- | --- |
| `SPECKIT_EXTENDED_TELEMETRY` | `false` | Enables detailed retrieval metrics. |
| `SPECKIT_INTERFERENCE_SCORE` | unset | Gates interference scoring observation fields. |
| `SPECKIT_CONSUMPTION_LOG` | `true` | Enables consumption event logging unless rollout policy or an explicit `false`/`0` disables it. |

## 6. VALIDATION

Run focused tests when changing this folder:

```bash
npm test -- mcp-server/tests/telemetry
npm test -- mcp-server/tests/handlers/memory-search
```

Run document validation after README edits:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp-server/lib/telemetry/README.md
```

## 7. RELATED

- `../eval/README.md` documents metric and channel analysis.
- `../search/README.md` documents retrieval flow.
- `../scoring/README.md` documents score composition.

## 8. SCHEMA REFERENCE

Field-level documentation for the telemetry interfaces in `retrieval-telemetry.ts`. The `validateTelemetrySchemaDocsDrift` validator parses these tables; keep field rows in lockstep with the TypeScript types when adding or removing fields.

### LatencyMetrics

| Field | Type |
| --- | --- |
| `totalLatencyMs` | `number` |
| `candidateLatencyMs` | `number` |
| `fusionLatencyMs` | `number` |
| `rerankLatencyMs` | `number` |
| `boostLatencyMs` | `number` |

### ModeMetrics

| Field | Type |
| --- | --- |
| `selectedMode` | `string \| null` |
| `modeOverrideApplied` | `boolean` |
| `pressureLevel` | `string \| null` |
| `tokenUsageRatio` | `number` |

### FallbackMetrics

| Field | Type |
| --- | --- |
| `fallbackTriggered` | `boolean` |
| `fallbackReason` | `string` |
| `degradedModeActive` | `boolean` |

### QualityMetrics

| Field | Type |
| --- | --- |
| `resultCount` | `number` |
| `avgRelevanceScore` | `number` |
| `topResultScore` | `number` |
| `boostImpactDelta` | `number` |
| `extractionCountInSession` | `number` |
| `qualityProxyScore` | `number` |

### ArchitectureMetrics

| Field | Type |
| --- | --- |
| `phase` | `MemoryRoadmapPhase` |
| `capabilities` | `MemoryRoadmapCapabilityFlags` |
| `scopeDimensionsTracked` | `number` |

### GraphHealthMetrics

| Field | Type |
| --- | --- |
| `killSwitchActive` | `boolean` |
| `causalBoosted` | `number` |
| `coActivationBoosted` | `number` |
| `communityInjected` | `number` |
| `graphSignalsBoosted` | `number` |
| `totalGraphInjected` | `number` |

### AdaptiveMetrics

| Field | Type |
| --- | --- |
| `mode` | `'shadow' \| 'promoted' \| 'disabled'` |
| `promotedCount` | `number` |
| `demotedCount` | `number` |
| `bounded` | `boolean` |
| `maxDeltaApplied` | `number` |

### TraceSamplingOptions

| Field | Type |
| --- | --- |
| `limit` | `number` |
| `minGraphInjected` | `number` |
| `killSwitchOnly` | `boolean` |

### SampledTracePayload

| Field | Type |
| --- | --- |
| `timestamp` | `string \| null` |
| `graphHealth` | `GraphHealthMetrics` |
| `tracePayload` | `TelemetryTracePayload` |

### RetrievalTelemetry

| Field | Type |
| --- | --- |
| `enabled` | `boolean` |
| `timestamp` | `string` |
| `latency` | `LatencyMetrics` |
| `mode` | `ModeMetrics` |
| `fallback` | `FallbackMetrics` |
| `quality` | `QualityMetrics` |
| `architecture` | `ArchitectureMetrics` |
| `graphHealth` | `GraphHealthMetrics` |
| `adaptive` | `AdaptiveMetrics` |
| `tracePayload` | `TelemetryTracePayload` |
| `transitionDiagnostics` | `SessionTransitionTrace` |
| `graphWalkDiagnostics` | `GraphWalkDiagnostics` |
| `lifecycleForecastDiagnostics` | `LifecycleForecastDiagnostics` |
