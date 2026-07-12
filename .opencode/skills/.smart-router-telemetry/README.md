---
title: "Smart Router Telemetry"
description: "Runtime compliance records for Smart Router skill and resource routing."
trigger_phrases:
  - "smart router telemetry"
  - "router compliance records"
  - "compliance jsonl"
version: 1.0.0.0
---

# Smart Router Telemetry

> This folder stores observe-only compliance records produced by the Smart Router telemetry script.

---

## 1. OVERVIEW

The Smart Router telemetry implementation in [`smart-router-telemetry.ts`](../system-spec-kit/scripts/observability/smart-router-telemetry.ts) writes routing compliance records to this folder. Measurement and analysis scripts read the records to compare selected skills, predicted routes, allowed resources and observed reads.

No `.opencode/plugins/*.js` entrypoint directly owns this folder. The System Spec Kit observability scripts own its read and write behavior.

The raw runtime data in this folder is git-ignored. Only this `README.md` is tracked, so external users can see the folder and understand its purpose without receiving machine-specific telemetry.

---

## 2. STRUCTURE

```text
.smart-router-telemetry/
+-- README.md
+-- compliance.jsonl
`-- compliance.jsonl.1
```

| Path | Shape and Purpose |
|---|---|
| `README.md` | Tracked documentation for this runtime-state folder. |
| `compliance.jsonl` | Active JSON Lines stream with one routing compliance record per line. |
| `compliance.jsonl.1` | Optional single-generation backup created when the active stream rotates. |

Each `compliance.jsonl` line can contain these fields:

| Field | Type | Purpose |
|---|---|---|
| `promptId` | string | Identifies the measured prompt without storing its raw text. |
| `selectedSkill` | string | Names the skill selected for the prompt. |
| `observedSkill` | string | Optionally records one observed skill or a comma-separated summary. |
| `observedSkills` | string array | Optionally records the complete set of observed skills. |
| `predictedRoute` | string array | Lists predicted routing modes or route labels. |
| `allowedResources` | string array | Lists permitted resources and their optional tier prefixes. |
| `actualReads` | string array | Lists resources observed during execution. |
| `evidenceSource` | string | Optionally identifies `live_wrapper` or `static_prediction` evidence. |
| `complianceClass` | string | Records `always`, `conditional_expected`, `on_demand_expected`, `extra`, `missing_expected` or `unknown_unparsed`. |
| `timestamp` | string | Records an ISO 8601 creation time. |

Example record:

```json
{"promptId":"prompt-1","selectedSkill":"sk-doc","predictedRoute":["README_CREATION"],"allowedResources":["always:references/global/quick_reference.md","conditional:references/specific/readme_creation.md"],"actualReads":["references/specific/readme_creation.md"],"complianceClass":"missing_expected","timestamp":"2026-04-19T17:30:13.337Z"}
```

---

## 3. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| `SPECKIT_SMART_ROUTER_TELEMETRY_PATH` | Not set | Replaces the full telemetry file path. |
| `SPECKIT_SMART_ROUTER_TELEMETRY_DIR` | Not set | Replaces the telemetry directory while retaining the `compliance.jsonl` file name. |
| `SPECKIT_SMART_ROUTER_TELEMETRY_MAX_BYTES` | `1048576` | Sets the active stream size limit before rotation. |

The full-path override takes precedence over the directory override. Without either override, the writer uses `.opencode/skills/.smart-router-telemetry/compliance.jsonl`.

---

## 4. LIFECYCLE

The telemetry writer appends one sanitized JSON object per line. Telemetry failures never change caller behavior.

Before an append would move the active file past its configured size limit, the writer replaces any existing `compliance.jsonl.1` backup and renames the active file to that backup. It then starts a new active stream with the incoming record.

The folder retains only one rotated generation. Operators can delete the active stream and its backup when they no longer need the measurements. The writer recreates the directory and active file on the next recorded event.

---

## 5. RELATED RESOURCES

| Resource | Purpose |
|---|---|
| [`smart-router-telemetry.ts`](../system-spec-kit/scripts/observability/smart-router-telemetry.ts) | Builds, writes, rotates, parses and reads compliance records. |
| [`smart-router-measurement.ts`](../system-spec-kit/scripts/observability/smart-router-measurement.ts) | Reads live compliance telemetry for measurement reports. |
| [`smart-router-analyze.ts`](../system-spec-kit/scripts/observability/smart-router-analyze.ts) | Analyzes the JSON Lines stream. |
