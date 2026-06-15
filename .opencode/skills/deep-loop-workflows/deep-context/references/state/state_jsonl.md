---
title: Deep Context JSONL State Reference
description: Config, iteration, event, and lifecycle records for the deep-context state log.
trigger_phrases:
  - "deep-context state jsonl"
  - "sweep settled event"
  - "frontier seeded record"
  - "context loop event records"
  - "context config record"
importance_tier: normal
contextType: implementation
---

# Deep Context JSONL State Reference

`deep-context-state.jsonl` is append-only. Each line is one JSON object: the first line is the config record, followed by iteration and event records emitted across the parallel-sweep loop.

---

## 1. OVERVIEW

### Purpose

Define the append-only JSONL records the host writes to `deep-context-state.jsonl`: the config record, per-sweep iteration records, and the lifecycle/event sub-types (frontier seeding, sweep settlement, graph convergence, blocked stop, pause, stuck recovery, lock release, synthesis complete).

### When to Use

Load this reference when validating the state log, adding an event record, or reconstructing a packet from raw state after a partial run.

### Core Principle

Raw JSONL is append-only evidence. The reducer-owned registry and dashboard derive from it; they do not replace it.

### Key Sources

- `.opencode/commands/deep/assets/deep_context_auto.yaml` — every `append_jsonl` / `append_to_jsonl` / `append_iteration_jsonl` record (the authoritative JSON shapes).
- `.opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` — how the reducer consumes these records (`parseJsonlDetailed`, the `type === 'iteration'` / `type === 'event'` split).

---

## 2. CONFIG RECORD

The first line is the config record, written at init alongside the full `deep-context-config.json`.

```json
{
  "type": "config",
  "scope": "rate-limit middleware",
  "loopType": "context",
  "maxIterations": 8,
  "convergenceThreshold": 0.10,
  "relevanceGate": 0.55,
  "agreementMin": 2,
  "fanout": { "mode": "by-model-shared-scope", "concurrency": 4 },
  "createdAt": "2026-06-07T00:00:00Z",
  "specFolder": "042-rate-limit"
}
```

The full config file additionally stores the executor pool, reducer settings, report paths, and lineage. See `../../assets/deep_context_config.json`.

---

## 3. ITERATION RECORDS

One iteration record is appended by the host after each parallel sweep is merged.

```json
{
  "type": "iteration",
  "run": 1,
  "mode": "context",
  "status": "evidence",
  "focus": "rate-limit middleware entry points",
  "findingsCount": 12,
  "newAgreementEligible": 7,
  "agreementEligible": 7,
  "sliceCoverage": 0.62,
  "reuseCatalogCoverage": 0.40,
  "agreementRate": 0.58,
  "relevanceFloor": 0.80,
  "dependencyCompleteness": 0.50,
  "contradictions": 1,
  "seatsSucceeded": 4,
  "durationMs": 45000,
  "timestamp": "2026-06-07T00:05:00Z",
  "sessionId": "dc-2026-06-07T00-00-00Z",
  "generation": 1
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `type` | Yes | `iteration` |
| `run` | Yes | 1-indexed sweep number |
| `mode` | Yes | `context` |
| `status` | Yes | See status values below |
| `focus` | Yes | The single SHARED focus all seats swept this iteration |
| `findingsCount` | Yes | Merged deduped-unit count |
| `newAgreementEligible` | Yes | Agreement-eligible units NEW this iteration; the per-iteration progress signal |
| `agreementEligible` | Yes | Cumulative agreement-eligible count |
| `sliceCoverage` | Recommended | Fraction of frontier slices with a `COVERED_BY` edge |
| `reuseCatalogCoverage` | Recommended | Reuse-catalog coverage signal |
| `agreementRate` | Recommended | Agreement-eligible / gated finding-kind units |
| `relevanceFloor` | Recommended | Gated / total units (relevance-gate pass rate) |
| `dependencyCompleteness` | Recommended | Dependency-subgraph completeness signal |
| `contradictions` | Optional | Count of `CONTRADICTS` pairs surfaced this iteration |
| `seatsSucceeded` | Optional | Count of seats that returned parseable findings |
| `durationMs` | Optional | Sweep wall-clock duration |

Status values:

| Status | Meaning |
|--------|---------|
| `evidence` | Normal merged parallel sweep |
| `error` | Surviving-seat merge after dispatch failures, or the terminal partial-synthesis path |

The convergence signals (`sliceCoverage`, `reuseCatalogCoverage`, `agreementRate`, `relevanceFloor`, `dependencyCompleteness`) feed the stop contract. See `../convergence/convergence.md`.

---

## 4. EVENT RECORDS

Event records share `{"type":"event","event":"<name>","mode":"context", ...}`. They carry `sessionId` and `generation` from `config.lineage` for traceability.

### Lifecycle: resumed / restarted

Auto-resume continues the same lineage (sessionId and generation unchanged, no archive):

```json
{
  "type": "event",
  "event": "resumed",
  "mode": "context",
  "sessionId": "dc-2026-06-07T00-00-00Z",
  "parentSessionId": "dc-2026-06-07T00-00-00Z",
  "lineageMode": "resume",
  "continuedFromRun": 4,
  "generation": 1,
  "archivedPath": null,
  "timestamp": "2026-06-07T00:00:00Z"
}
```

Restart archives the prior packet and starts a new lineage segment with a fresh sessionId and `generation + 1`:

```json
{
  "type": "event",
  "event": "restarted",
  "mode": "context",
  "sessionId": "dc-2026-06-07T01-00-00Z",
  "parentSessionId": "dc-2026-06-07T00-00-00Z",
  "lineageMode": "restart",
  "generation": 2,
  "archivedPath": "context_archive/2026-06-07T00-00-00Z",
  "timestamp": "2026-06-07T01:00:00Z"
}
```

### frontier_seeded

Emitted once at init after the SLICE frontier is seeded (never a whole-repo sweep):

```json
{
  "type": "event",
  "event": "frontier_seeded",
  "mode": "context",
  "source": "code_graph",
  "sliceCount": "9",
  "timestamp": "2026-06-07T00:01:00Z"
}
```

`source` is `code_graph` or `glob_grep_fallback` (when the code graph is stale or unavailable).

### sweep_settled

Emitted after the barrier-join when all seats have returned, recording per-seat dispatch outcome (graceful degradation: a failed seat does not abort the sweep):

```json
{
  "type": "event",
  "event": "sweep_settled",
  "mode": "context",
  "run": 1,
  "focusSliceCount": "5",
  "seatsSucceeded": ["native-a", "native-b", "mimo", "gpt"],
  "seatsFailed": ["deepseek"],
  "timestamp": "2026-06-07T00:05:00Z",
  "sessionId": "dc-2026-06-07T00-00-00Z",
  "generation": 1
}
```

### graph_convergence

Emitted after each coverage-graph convergence evaluation, persisting the decision snapshot:

```json
{
  "type": "event",
  "event": "graph_convergence",
  "mode": "context",
  "run": 3,
  "decision": "STOP_BLOCKED",
  "signals": { "sliceCoverage": 0.62, "agreementRate": 0.48, "relevanceFloor": 0.80 },
  "blockers": ["agreementRate<0.50"],
  "timestamp": "2026-06-07T00:15:00Z",
  "sessionId": "dc-2026-06-07T00-00-00Z",
  "generation": 1
}
```

`decision` is `CONTINUE | STOP_ALLOWED | STOP_BLOCKED`. The reducer rolls up the latest `graph_convergence` event into the registry's graph fields (`buildGraphConvergenceRollup`). Signal semantics live in `../convergence/convergence.md`.

### blocked_stop

A first-class record when convergence returns blocked; the loop then continues with a recovery focus:

```json
{
  "type": "event",
  "event": "blocked_stop",
  "mode": "context",
  "run": 3,
  "blockedBy": ["agreementRate<0.50", "sliceCoverage<0.70"],
  "signals": { "agreementRate": 0.48, "sliceCoverage": 0.62 },
  "recoveryStrategy": "Sweep uncovered slices; raise agreement before stopping.",
  "timestamp": "2026-06-07T00:15:00Z",
  "sessionId": "dc-2026-06-07T00-00-00Z",
  "generation": 1
}
```

### userPaused

Emitted when the pause sentinel is detected before a sweep; the loop halts until the sentinel is deleted:

```json
{
  "type": "event",
  "event": "userPaused",
  "mode": "context",
  "run": 3,
  "stopReason": "userPaused",
  "sentinelPath": "context/.deep-context-pause",
  "timestamp": "2026-06-07T00:12:00Z",
  "sessionId": "dc-2026-06-07T00-00-00Z",
  "generation": 1
}
```

### stuckRecovery

Emitted when successive low-progress sweeps trip the stuck threshold; the host widens the focus and continues:

```json
{
  "type": "event",
  "event": "stuckRecovery",
  "mode": "context",
  "run": 4,
  "stopReason": "stuckRecovery",
  "fromIteration": 4,
  "outcome": "recovered",
  "timestamp": "2026-06-07T00:20:00Z",
  "sessionId": "dc-2026-06-07T00-00-00Z",
  "generation": 1
}
```

### lock_released

Emitted when the single-writer advisory lock is released (e.g. at the save phase):

```json
{
  "type": "event",
  "event": "lock_released",
  "path": "context/.deep-context.lock",
  "releasePhase": "save",
  "timestamp": "2026-06-07T00:30:00Z"
}
```

### synthesis_complete

The terminal record; authoritative for `COMPLETE` status when present:

```json
{
  "type": "event",
  "event": "synthesis_complete",
  "mode": "context",
  "totalIterations": 4,
  "stopReason": "converged",
  "timestamp": "2026-06-07T00:30:00Z"
}
```

---

## 5. LIFECYCLE NORMALIZATION

Pause and recovery lifecycle events normalize their `stopReason` to the frozen enum at emission time:

```text
converged | maxIterationsReached | blockedStop | stuckRecovery | error | manualStop | userPaused
```

Malformed lines are handled by the reducer, not by re-writing the log: `parseJsonlDetailed` reports each corrupt line (line number, length, short content hash, error) rather than silently dropping it, and a crash-truncated tail is repaired before read. Fault tolerance and reconstruction are documented in `state_reducer_registry.md`.
