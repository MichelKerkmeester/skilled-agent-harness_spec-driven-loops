# Observability: Content-Free Telemetry

## 1. OVERVIEW

`observability/` emits lifecycle telemetry that contains counts, durations, reason codes and rotating correlation digests rather than prompts or generated content. It aggregates events, scans canaries and blocks unsafe exports.

Telemetry covers assembly through render and supplies operational release evidence.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `aggregation.ts` | Aggregates lifecycle counters and rates by runtime and tier |
| `correlation.ts` | Creates rotating keyed digests and verifies unlinkability |
| `emitter.ts` | Creates and emits content-free core and assembly telemetry |
| `export.ts` | Builds and inspects bounded telemetry exports |
| `index.ts` | Exposes observability APIs and types |
| `redaction.ts` | Scans export values for redaction canaries |

---

## 3. PUBLIC EXPORTS

`index.ts` exports `createAssemblyTelemetryEvent`, `createCoreTelemetryEvent`, `emitCoreTelemetry`, `aggregateLifecycleEvents`, correlation digest helpers, telemetry export helpers, `REDACTION_CANARIES`, `scanForRedactionCanaries` and `assertNoRedactionCanaryLeak`. It also exports the matching telemetry, aggregation, correlation, export and redaction types.

---

## 4. VALIDATION

```bash
npm test -- test/observability
```

Expected result: aggregation, correlation, export and redaction tests pass.

---

## 5. RELATED

- [Release subsystem](../release/README.md)
- [Source map](../README.md)
