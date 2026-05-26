---
title: "Observability Scripts: Smart Router Measurement"
description: "Runtime and static measurement helpers for smart-router resource routing telemetry."
trigger_phrases:
  - "smart router telemetry"
  - "observability scripts"
  - "router measurement"
---

# Observability Scripts: Smart Router Measurement

## 1. OVERVIEW

`scripts/observability/` contains observe-only helpers for measuring skill smart-router behavior. The scripts predict expected resource reads, record live wrapper observations, and turn JSONL telemetry into reports.

Current state:

- Measures advisor top-1 routing and expected resource loads from a labeled corpus.
- Records compliance JSONL without blocking caller execution.
- Aggregates telemetry into markdown summaries for review.

## 2. DIRECTORY TREE

```text
observability/
+-- live-session-wrapper.ts              # Read-tool observation wrapper
+-- smart-router-analyze.ts              # JSONL analyzer and report writer
+-- smart-router-measurement.ts          # Static corpus measurement harness
+-- smart-router-measurement-results.jsonl
`-- smart-router-telemetry.ts            # Compliance record types and JSONL writer
```

## 3. KEY FILES

| File | Role |
|---|---|
| `live-session-wrapper.ts` | Tracks `Read` calls against `.opencode/skills/*` resources for a prompt session. |
| `smart-router-telemetry.ts` | Defines compliance classes, sanitizes records, and appends JSONL telemetry. |
| `smart-router-measurement.ts` | Runs static corpus checks using skill-advisor briefs and predicted route metadata. |
| `smart-router-analyze.ts` | Collapses telemetry rows by prompt and emits class distribution summaries. |

## 4. BOUNDARIES

These helpers are observe-only. Runtime wrappers and measurement scripts may call into telemetry utilities, but telemetry failures must not change the caller's behavior.

## 5. VALIDATION

Run targeted checks from the repository root:

```bash
npm test -- --run smart-router
```

For syntax coverage after edits, run the package TypeScript or test command used by the active system-spec-kit workflow.

## 6. RELATED

- `../config/README.md`
- `../../../system-skill-advisor/mcp_server/`
