---
title: "Content-free observability"
description: "Emits and aggregates reason-coded lifecycle telemetry without carrying prompts, transcript text, candidates, protected spans, credentials, or provider bodies."
trigger_phrases:
  - "Content-free observability"
  - "privacy-safe projection telemetry"
  - "createTelemetryExport"
  - "redaction canary scanning"
version: 1.0.0.0
---

# Content-free observability (createTelemetryExport)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Emits and aggregates reason-coded lifecycle telemetry without carrying prompts, transcript text, candidates, protected spans, credentials, or provider bodies.

The subsystem records operational state through closed schemas, counts, durations, byte counts, reason codes, runtime identifiers, presentation tiers, and rotating correlation digests. Its export boundary is opt-in and rejects content-shaped fields.

---

## 2. HOW IT WORKS

Emission validates core and assembly lifecycle inputs before calling a supplied sink; malformed or unsafe input is suppressed instead of emitted. Aggregation ignores records outside the telemetry contract and computes counters and rates globally, by runtime, by presentation tier, and by their combination. Correlation identifiers are keyed digests with explicit rotation epochs so identifiers from different epochs cannot be linked by digest reuse.

Export returns an empty disabled result unless the caller explicitly enables it. Enabled export reconstructs only allowlisted aggregate fields rather than serializing caller objects. Inspection recursively scans objects, arrays, binary views, errors, keys, and values for forbidden content fields plus synthetic secret and personal-data canaries, reporting content-free paths and canary ids without reflecting leaked values.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-communication/cli-communication-projection/src/observability/emitter.ts` | Handler | Creates validated reason-coded events and emits or suppresses them. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/observability/aggregation.ts` | Shared | Aggregates lifecycle counts and rates by runtime and tier. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/observability/correlation.ts` | Shared | Creates rotating keyed correlation digests. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/observability/export.ts` | Handler | Applies default-off allowlisted aggregate export and inspection. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/observability/redaction.ts` | Shared | Detects synthetic secret and personal-data canaries. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-communication/cli-communication-projection/test/observability/aggregation.test.ts` | Unit | Verifies counters, rates, and runtime/tier buckets. |
| `.opencode/skills/sk-communication/cli-communication-projection/test/observability/correlation.test.ts` | Unit | Verifies deterministic within-epoch and unlinkable rotated digests. |
| `.opencode/skills/sk-communication/cli-communication-projection/test/observability/export.test.ts` | Unit | Covers opt-in export, schema filtering, and forbidden fields. |
| `.opencode/skills/sk-communication/cli-communication-projection/test/observability/redaction.test.ts` | Unit | Covers canaries across strings, binary values, errors, and keys. |

---

## 4. SOURCE METADATA

- Group: Evaluation And Observability
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `evaluation-and-observability/content-free-observability.md`

Related references:
- [blind-non-inferiority-evaluation.md](blind-non-inferiority-evaluation.md) — Quality evidence kept separate from operational telemetry
