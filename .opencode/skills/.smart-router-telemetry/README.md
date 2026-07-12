---
title: "Smart Router Telemetry"
description: "Observe-only compliance records that compare Smart Router resource predictions with observed skill reads."
trigger_phrases:
  - "smart router telemetry"
  - "router compliance records"
  - "compliance jsonl"
version: 1.0.0.2
---

# Smart Router Telemetry

> This folder stores observe-only compliance records produced by the Smart Router telemetry script.

---

## 1. OVERVIEW

The Smart Router telemetry implementation in [`smart-router-telemetry.ts`](../system-spec-kit/scripts/observability/smart-router-telemetry.ts) writes routing compliance records to this folder. The state exists so maintainers can compare a selected skill's predicted resource route with the skill resources actually read during execution. Measurement and analysis scripts use that comparison to report routing readiness, over-load, under-load and on-demand behavior. The records present today come from the static measurement path described in section 4, not from live per-prompt capture.

No `.opencode/plugins/*.js` entrypoint directly owns this folder. A repository search for `.smart-router-telemetry` under `.opencode/plugins/*.js` returns no matches. The System Spec Kit observability scripts own its read and write behavior.

The related [`mk-skill-advisor.js`](../../plugins/mk-skill-advisor.js) plugin performs a different part of the routing lifecycle. It sends each OpenCode prompt to the standalone Skill Advisor bridge, receives an advisor brief and adds that brief to model system context through `experimental.chat.system.transform`. It does not import the telemetry writer or append `compliance.jsonl`.

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

## 4. RELATED SKILL LOGIC

[`system-skill-advisor`](../system-skill-advisor/SKILL.md) provides Gate 2 routing for non-trivial requests. Its runtime flow separates skill selection from skill-local resource loading:

1. The standalone `mk_skill_advisor` MCP scores the prompt and returns recommendations with confidence and uncertainty values.
2. Prompt-time hooks or the OpenCode plugin render recommendations that pass their thresholds as a compact advisor brief.
3. The agent invokes the selected skill. That skill's own Smart Router logic determines which local documentation resources are always required, conditionally relevant or available on demand.
4. A telemetry step records the selected skill and its predicted route for that prompt. Two evidence paths can supply a compliance record: the static measurement harness [`smart-router-measurement.ts`](../system-spec-kit/scripts/observability/smart-router-measurement.ts), which records the predicted route and advisor label, and a live-capture wrapper [`live-session-wrapper.ts`](../system-spec-kit/scripts/observability/live-session-wrapper.ts) designed to observe qualifying `Read` calls and record the resources actually read.
5. Finalization writes one compliance record for the prompt. Analysis tools later aggregate those records by selected skill.

**Current wiring status.** The records in `compliance.jsonl` today come from the static measurement path. The live-capture wrapper is defined but NOT wired into any plugin, hook or CLI entry point, so nothing invokes it during real sessions. Its read matcher also resolves the skill root as `.opencode/skill` rather than `.opencode/skills`, so it cannot match real skill reads even when called. As a result `observedSkill` and `actualReads` stay effectively unpopulated by live capture, and the measurement reports keep live routing readiness blocked until the wrapper is wired and its path matcher is corrected.

The Skill Advisor recommends the skill. It does not decide the selected skill's internal resource route. For `system-skill-advisor` itself, the Smart Router in its `SKILL.md` always loads the runtime tool-id and standalone-MCP references, scores intent domains such as scoring, graph, runtime, config and hooks and then loads matching markdown resources. If no intent reaches its minimum score, it returns an `UNKNOWN_FALLBACK` result with a disambiguation checklist.

When a caller invokes it, the live wrapper can accept a route supplied by that caller. Otherwise it calls `predictSmartRouterRoute` to derive `predictedRoute` and `allowedResources` from the selected skill and prompt. It observes only calls named `Read`. Reads outside the workspace skill root, reads without an active prompt and other tool calls do not enter this stream.

This state therefore measures resource-routing compliance after skill selection. It is not the Skill Advisor daemon's graph database, prompt cache, hook diagnostics or MCP response log. The daemon and hooks produce the recommendation context that precedes skill loading. The observability scripts produce and consume this JSON Lines state.

---

## 5. COMPLIANCE MODEL

The writer sanitizes text values, removes duplicate observed values where the prompt lifecycle merges observations and calculates `complianceClass` before appending the record.

| Class | Meaning in the writer |
|---|---|
| `always` | Every observed resource is allowed and the highest observed tier is the baseline `always` tier. |
| `conditional_expected` | Every observed resource is allowed and at least one observed resource belongs to the conditional tier. |
| `on_demand_expected` | Every observed resource is allowed and at least one observed resource belongs to the on-demand tier. |
| `extra` | An observed resource is not allowed, or an observed skill differs from the selected skill. |
| `missing_expected` | No resource read was observed, or a resource marked with the `expected:` prefix was not read. |
| `unknown_unparsed` | The allowed-resource list is empty or contains an unknown marker or unrecognized tier prefix. |

Allowed resources may use `always:`, `conditional:`, `conditional_expected:`, `on_demand:`, `on_demand_expected:` or `expected:` prefixes. An unprefixed path uses the `always` tier. The `expected:` alias maps to the conditional tier and also marks the resource as required.

`evidenceSource` distinguishes `live_wrapper` observations from `static_prediction` records. The measurement script excludes static predictions when it checks whether live telemetry contains prompts with observed reads.

---

## 6. LIFECYCLE

When invoked, the live wrapper starts an in-memory prompt record, merges observed reads into that record and writes it only when the caller finalizes the prompt. The measurement path, which produces the records present today, writes a complete record in one call. The telemetry writer appends one sanitized JSON object per line. Telemetry failures never change caller behavior.

Before an append would move the active file past its configured size limit, the writer replaces any existing `compliance.jsonl.1` backup and renames the active file to that backup. It then starts a new active stream with the incoming record.

The folder retains only one rotated generation. Operators can delete the active stream and its backup when they no longer need the measurements. The writer recreates the directory and active file on the next recorded event.

The analyzer parses valid records, counts malformed lines as parse errors and collapses multiple rows with the same `promptId` before reporting class distributions. Its per-skill report calculates over-load from `extra`, under-load from `missing_expected` and on-demand trigger rate from the class, route or allowed-resource prefix.

---

## 7. RELATED RESOURCES

| Resource | Purpose |
|---|---|
| [`system-skill-advisor/SKILL.md`](../system-skill-advisor/SKILL.md) | Defines Gate 2 skill selection and the related skill's intent-domain Smart Router. |
| [`mk-skill-advisor.js`](../../plugins/mk-skill-advisor.js) | Injects prompt-time Skill Advisor briefs into OpenCode context without writing this telemetry stream. |
| [`live-session-wrapper.ts`](../system-spec-kit/scripts/observability/live-session-wrapper.ts) | Defines the live-capture flow for active prompts and qualifying skill-resource `Read` calls. Not currently wired into any plugin or hook. |
| [`smart-router-telemetry.ts`](../system-spec-kit/scripts/observability/smart-router-telemetry.ts) | Builds, writes, rotates, parses and reads compliance records. |
| [`smart-router-measurement.ts`](../system-spec-kit/scripts/observability/smart-router-measurement.ts) | Predicts resource routes, writes optional static telemetry and reads the live stream for readiness reporting. |
| [`smart-router-analyze.ts`](../system-spec-kit/scripts/observability/smart-router-analyze.ts) | Aggregates the JSON Lines stream into overall and per-skill compliance reports. |
