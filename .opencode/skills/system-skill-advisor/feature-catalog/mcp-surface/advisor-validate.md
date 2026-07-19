---
title: "advisor_validate MCP Tool"
description: "Native MCP tool that returns release-gate slices plus explicit threshold semantics and prompt-safe telemetry/outcome rollups."
trigger_phrases:
  - "advisor_validate"
  - "mcp validate tool"
  - "release gate slices"
  - "corpus holdout parity"
version: 0.8.0.15
---

# advisor_validate MCP Tool

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Drive release-readiness decisions from real measurements. Consolidate corpus, holdout, parity, safety and latency slices behind one tool call, while also exposing the threshold contract and prompt-safe telemetry summaries operators need to interpret the run.

## 2. HOW IT WORKS

`handlers/advisor-validate.ts` runs the bundled validation slices and returns the landed public contract:

| Top-Level Field | What It Publishes |
| --- | --- |
| `workspaceRoot` / `skillSlug` | The resolved workspace plus optional skill-scoped validation target. |
| `thresholdSemantics` | Separates aggregate release-gate thresholds from prompt-time routing thresholds. |
| `overallAccuracy` / `perSkill` | Aggregate top-1 results for the active corpus selection. |
| `slices` | Corpus, holdout, parity, safety and latency slice payloads. |
| `telemetry` | Prompt-safe diagnostics and durable outcome rollups. |
| `generatedAt` | Run timestamp for the validation envelope. |

Threshold semantics are explicit so release gating does not get conflated with prompt-time routing:

| Threshold Group | Current Values |
| --- | --- |
| `aggregateValidation` | `fullCorpusTop1=0.75`, `holdoutTop1=0.725`, `perSkillTop1=0.7`, `unknownCountTargetMax=10` |
| `runtimeRouting` | `confidenceThreshold=0.8`, `uncertaintyThreshold=0.35`, `confidenceOnly=false` |

The current baseline slices remain:

| Slice | Target | Measured |
| --- | --- | --- |
| Full corpus top-1 | >= 75% | 80.5% |
| Holdout top-1 | >= 72.5% | 77.5% |
| UNKNOWN | <= 10 | UNKNOWN <= 10 |
| Python-correct parity | 0 regressions | 0 regressions |
| Latency (cache-hit p95) | <= 50 ms | ~6.99 ms |
| Latency (uncached p95) | <= 60 ms | ~11.45 ms |

Telemetry is published as prompt-safe rollups rather than raw prompt content:

| Telemetry Surface | Fields |
| --- | --- |
| `telemetry.diagnostics` | `recordsPath`, `recordsRetained`, `rollingCacheHitRate`, `rollingP95Ms`, `rollingFailOpenRate` |
| `telemetry.outcomes` | `recordsPath`, `recordedThisRun`, `totals` |

`telemetry.outcomes.totals` reports durable outcome counts and `recordedThisRun` reflects any `outcomeEvents` supplied on the validating call.

Default-off feedback calibration is available only when `SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW` is explicitly enabled. In that mode, `advisor_validate` writes bounded JSONL calibration reports from accepted/corrected/ignored outcome records, including proposed-vs-current lane-weight or threshold signals with no automatic promotion. The live recommendation scorer does not read those reports, and byte-identical live scoring is expected with the flag off or on.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-validate.ts` | Handler | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/schemas/advisor-tool-schemas.ts` | Schema | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/feedback-calibration.ts` | Library | default-off shadow calibration reducer and report persistence |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/weights-config.ts` | Library | read-only proposal builder that leaves live defaults unchanged |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-validate.vitest.ts` | Automated test | Validation reference |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/advisor-feedback-calibration.vitest.ts` | Automated test | reducer guardrails and byte-identical live scoring |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/parity/` | Automated test | Python/TS parity harness |
| `Playbook scenario [NC-003](../../manual-testing-playbook/native-mcp-tools/native-validate-slices.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: MCP surface
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `mcp-surface/advisor-validate.md`

Related references:

- [01-advisor-recommend.md](../../feature-catalog/mcp-surface/advisor-recommend.md).
- [`scorer-fusion/ablation.md`](../scorer-fusion/ablation.md).
