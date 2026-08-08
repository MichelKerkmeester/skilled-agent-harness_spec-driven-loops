# DeepPi Implementation Modules

---

## 1. OVERVIEW

Implementation modules for the DeepPi extension. Each module owns one responsibility: model eligibility, hash-anchored editing, prefix stability, statistics persistence, retry economy, usage telemetry, or shared utilities. All modules are imported by the entry point `../deeppi.ts`.

---

## 2. KEY FILES

| File | Role |
| --- | --- |
| `eligibility.ts` | Model eligibility predicates. Exports `DEEPPI_MODEL_IDS` (`["deepseek-v4-flash", "deepseek-v4-pro"]`), `DeepPiModelId`, `DeepPiModel`, the `isDeepPiModel` type guard, and `withEditLinesActive` which adds or removes the `edit_lines` tool from the active tool list. |
| `hashlines.ts` | Hash-anchored editing module. Exports `HashEdit`, `atomicWriteFile` (compare-and-swap atomic write with symlink rejection and post-rename verification), `editLinesSchema` (JSON Schema for the `edit_lines` tool), `HashlineStats`, `registerHashlines` (registers the `tool_result` annotation hook and the `edit_lines` tool), `detectConfusedEditArgs`, `validateEdits`, `applyEditsToLines`, and `buildEditSummary`. |
| `stability.ts` | Prefix stability tracking. Exports `TimestampState`, `stabilizeMessages` (prunes thinking blocks from plain assistant turns), `freezeSessionTimestamps`, `PrefixChurnReason`, `PrefixShape`, `sortProviderTools`, `capturePrefixShape`, `classifyPrefixChurn`, `StabilityState`, `createStabilityState`, and `registerStabilityHooks` (registers `context`, `before_agent_start`, and `before_provider_request` hooks). |
| `stats.ts` | Persistent, versioned JSON statistics with per-session and cumulative-daily totals. Exports `DEEP_PI_STATS_SCHEMA_VERSION`, `DEEP_PI_STATS_FILENAME`, `DEEP_PI_REPORT_FILENAME`, `SessionStats`, `DailyStats`, `DeepPiStatsDocument`, `StatsUnreadableReason`, `StatsReadResult`, `PreparedStatsUpdate`, `StatsUnreadableError`, `readStatsFile`, `withCrossProcessLock`, `prepareStatsUpdate`, `commitStatsUpdate`, `updateStatsForSession`, `statsPath`, `reportSnapshotPath`, and `writeJsonSnapshot`. Uses an atomic write helper and a cross-process advisory file lock. |
| `stormbreaker.ts` | Batch-aware retry economy. Exports `ExpectedToolCall`, `ToolOutcome`, `StormDecision`, `StormBreakerState`, `createStormBreakerState`, `resetStormBreaker`, `startToolBatch`, `recordToolOutcome`, `toolCallsFromMessage`, and `registerStormBreaker` (registers `message_end` and `tool_result` hooks). Injects a guard on the third equivalent all-failed batch and aborts on the fourth. |
| `telemetry.ts` | Usage telemetry and report rendering. Exports `PiUsage`, `PricedModel`, `ModelTotals`, `TelemetryState`, `createTelemetryState`, `recordUsage`, `cacheHitRate`, `footerText`, `ReportInput`, `DEEP_PI_REPORT_SCHEMA_VERSION`, `DeepPiReportCounters`, `DeepPiReport`, `buildDeepPiReport`, `renderDeepPiReport`, `formatDeepPiReport`, `resetTelemetry`, and `registerTelemetryHooks` (registers the `message_end` hook). Splits reporting into build, render, and transport layers. |
| `utils.ts` | Shared utilities. Exports `lineHash` (SHA-256 truncated to 32 bits / 8 hex chars on trailing-whitespace-trimmed content), `annotateLine`, `isAnnotated`, `annotateContent`, `extractErrorText`, `errorSignature`, `enhanceError`, and `matchesModelPattern`. |

---

## 3. BOUNDARIES

- `eligibility.ts` has no imports from other `deeppi/` modules.
- `utils.ts` imports only from `node:crypto`.
- `hashlines.ts` imports from `utils.ts` and `@earendil-works/pi-coding-agent`.
- `stability.ts` imports from `eligibility.ts` and `@earendil-works/pi-coding-agent`.
- `stats.ts` imports from `eligibility.ts`, `hashlines.ts`, and `telemetry.ts`.
- `stormbreaker.ts` imports from `utils.ts` and `@earendil-works/pi-coding-agent`.
- `telemetry.ts` imports from `eligibility.ts` and `stability.ts`.
- No module imports from `pi-cache-optimizer` or `shared/`.

---

## 4. RELATED

- [extensions/ README](../README.md)
- [deep-pi README](../../README.md)
- [Changes from Upstream](../../CHANGES-FROM-UPSTREAM.md)
