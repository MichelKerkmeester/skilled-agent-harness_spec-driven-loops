---
title: Deep Research JSONL State Reference
description: Config, iteration, event, lineage, graph, and blocked-stop records for deep-research state logs.
trigger_phrases:
  - "research state jsonl"
  - "research config record"
  - "research iteration records"
  - "research negative knowledge"
  - "research graph events"
  - "research event records"
importance_tier: normal
contextType: implementation
version: 1.14.0.3
---

# Deep Research JSONL State Reference

`deep-research-state.jsonl` is append-only. Each line is one JSON object. The first line is normally the config record, followed by iteration and event records.

---

## 1. OVERVIEW

### Purpose

Define the append-only JSONL records used by deep-research config, iteration, lifecycle, graph, pause, stuck-recovery, and blocked-stop state.

### When to Use

Load this reference when validating state logs, adding event records, reconstructing a packet, or mapping legacy stop labels to current values.

### Core Principle

Raw JSONL is append-only evidence. Reducer-owned files derive from it, but they do not replace it.

---

## 2. CONFIG RECORD

The config record captures the initialized loop contract.

```json
{
  "type": "config",
  "topic": "API response time optimization",
  "maxIterations": 10,
  "convergenceThreshold": 0.05,
  "stuckThreshold": 3,
  "specFolder": "028-auto-deep-research",
  "createdAt": "2026-05-24T00:00:00Z"
}
```

The full config file also stores executor, lineage, reducer, capability matrix, pause sentinel, archive, and file-protection settings.

---

## 3. ITERATION RECORDS

```json
{
  "type": "iteration",
  "run": 1,
  "status": "complete",
  "focus": "Initial broad survey",
  "findingsCount": 5,
  "newInfoRatio": 1.0,
  "noveltyJustification": "First pass; all findings are new to this packet",
  "keyQuestions": ["What causes latency?"],
  "answeredQuestions": ["What causes latency?"],
  "timestamp": "2026-05-24T00:05:00Z",
  "durationMs": 45000
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `type` | Yes | `iteration` |
| `run` | Yes | 1-indexed iteration number |
| `status` | Yes | See status values below |
| `focus` | Yes | Single focus investigated |
| `findingsCount` | Yes | Number of findings reported |
| `newInfoRatio` | Yes | Novelty score used by convergence |
| `noveltyJustification` | Recommended | One-sentence explanation of the ratio |
| `keyQuestions` | Recommended | Questions considered during this iteration |
| `answeredQuestions` | Recommended | Questions answered by evidence |
| `ruledOut` | Optional | Negative knowledge entries |
| `graphEvents` | Optional | Coverage graph mutations |

Status values:

| Status | Meaning |
|--------|---------|
| `complete` | Normal evidence-gathering iteration |
| `timeout` | Time/tool budget exceeded |
| `error` | Tool, parse, or unexpected failure |
| `stuck` | No new information and no clear next direction |
| `insight` | Low ratio but important conceptual breakthrough |
| `thought` | Analytical-only iteration; excluded from stuck and signal math |

---

## 4. CONVERGENCE SIGNAL FIELDS

When the composite algorithm runs, the iteration may include signal values:

```json
{
  "type": "iteration",
  "run": 5,
  "convergenceSignals": {
    "rollingAvg": 0.12,
    "madScore": 0.08,
    "entropyCoverage": 0.71,
    "compositeStop": 0.42
  }
}
```

Signal rules live in `../convergence/convergence_signals.md`.

---

## 5. NEGATIVE KNOWLEDGE

Use `ruledOut` to preserve eliminated approaches.

```json
{
  "type": "iteration",
  "run": 3,
  "status": "complete",
  "ruledOut": [
    {
      "approach": "HTTP/3 multiplexing",
      "reason": "No server-side support in target environment",
      "evidence": "file:docs/protocols.md:42"
    }
  ]
}
```

Ruled-out directions should also appear in strategy and synthesis outputs.

---

## 6. GRAPH EVENTS

`graphEvents` records coverage graph mutations from an iteration.

```json
{
  "type": "iteration",
  "run": 4,
  "graphEvents": [
    {"type": "question", "id": "q-reconnect", "label": "How should reconnect work?"},
    {"type": "finding", "id": "f-backoff", "label": "Exponential backoff is required"},
    {"type": "edge", "from": "f-backoff", "to": "q-reconnect", "relation": "ANSWERS"}
  ]
}
```

Valid node types are `question`, `finding`, `claim`, and `source`; `edge` records connect nodes. IDs must be unique within a single `(specFolder, loopType, sessionId)` namespace. Reusing the same logical ID across independent sessions is allowed because the coverage graph uses a composite key.

---

## 7. EVENT RECORDS

Lifecycle event:

```json
{
  "type": "event",
  "event": "resumed",
  "mode": "research",
  "sessionId": "dr-2026-05-24T00-00-00Z",
  "parentSessionId": "dr-2026-05-24T00-00-00Z",
  "lineageMode": "resume",
  "continuedFromRun": 4,
  "generation": 1,
  "archivedPath": null,
  "timestamp": "2026-05-24T00:00:00Z"
}
```

Blocked stop event:

```json
{
  "type": "event",
  "event": "blocked_stop",
  "mode": "research",
  "run": 7,
  "stopReason": "blockedStop",
  "blockedBy": ["keyQuestionCoverage", "sourceDiversity"],
  "recoveryStrategy": "focus_pivot",
  "timestamp": "2026-05-24T00:00:00Z"
}
```

Pause event:

```json
{
  "type": "event",
  "event": "userPaused",
  "mode": "research",
  "run": 7,
  "stopReason": "userPaused",
  "sentinelPath": "research/.deep-research-pause",
  "timestamp": "2026-05-24T00:00:00Z"
}
```

Stuck recovery event:

```json
{
  "type": "event",
  "event": "stuckRecovery",
  "mode": "research",
  "run": 7,
  "stopReason": "stuckRecovery",
  "fromFocus": "Connection pooling",
  "toFocus": "Transport alternatives",
  "strategy": "try_opposites",
  "timestamp": "2026-05-24T00:00:00Z"
}
```

Idea observation event:

```json
{
  "type": "event",
  "event": "idea_observed",
  "mode": "research",
  "run": 7,
  "ideaId": "idea-cache-stampede",
  "idea": "Investigate cache stampede mitigation as a follow-up focus",
  "category": "ideas",
  "source": "iteration-007.md",
  "timestamp": "2026-05-24T00:00:00Z"
}
```

Leaf agents may append `idea_observed` for promising tangents. They must not append `idea_promoted`; promotion is reducer-owned.

Idea promotion event:

```json
{
  "type": "event",
  "event": "idea_promoted",
  "mode": "research",
  "run": 8,
  "ideaId": "idea-cache-stampede",
  "idea": "Investigate cache stampede mitigation as a follow-up focus",
  "category": "ideas",
  "observationCount": 2,
  "minIdeaObservations": 2,
  "firstObservedRun": 6,
  "lastObservedRun": 7,
  "timestamp": "2026-05-24T00:02:00Z"
}
```

The reducer emits `idea_promoted` once per idea after replay shows `observationCount >= minIdeaObservations`. `minIdeaObservations` defaults to `2` and is clamped to the inclusive range `1..10`.

Rejected idea event:

```json
{
  "type": "event",
  "event": "idea_rejected",
  "mode": "research",
  "run": 7,
  "ideaId": "idea-cache-stampede",
  "idea": "Investigate cache stampede mitigation as a follow-up focus",
  "category": "ideas",
  "reason": "Already rejected by environment evidence",
  "timestamp": "2026-05-24T00:00:00Z"
}
```

`idea_rejected` durably suppresses the matching promoted idea and also enters the reducer-owned rejected-pattern cache. Use `category: "general"` only when the rejection should suppress matching text across next-focus, recovery, and ideas candidates.

Rejected idea removal event:

```json
{
  "type": "event",
  "event": "ideaRejectedRemoved",
  "mode": "research",
  "pattern": "Retry HTTP/3 as the primary latency fix",
  "category": "next-focus",
  "timestamp": "2026-05-24T00:00:00Z"
}
```

Rejected idea reset event:

```json
{
  "type": "event",
  "event": "ideaRejectedReset",
  "mode": "research",
  "reason": "Operator wants previously rejected ideas eligible again",
  "timestamp": "2026-05-24T00:00:00Z"
}
```

The reducer derives a bounded active rejected-pattern cache from these events. `idea_rejected` adds or refreshes one pattern, `ideaRejectedRemoved` removes a single matching pattern or id, and `ideaRejectedReset` clears the active cache. Legacy `ideaRejected`, `ideaRejectedRemoved`, and `ideaRejectedReset` rows remain replayable for existing state logs. The active cache is capped at 100 entries; when more are added, the oldest active entry is evicted and the reducer emits a warning.

Candidate checks compare normalized exact text first, then apply fuzzy matching only when the candidate category is compatible with the rejected category. Omit `category` for a general rejection that can suppress candidates across next-focus, recovery, or ideas surfaces.

Graph convergence event shape lives in `../convergence/convergence_graph.md`.

---

## 8. NORMALIZATION

Emission-time normalization maps legacy labels into canonical `stopReason` values before persistence. The mapping lives in `../convergence/convergence.md`.

Malformed lines are handled by the reducer according to its strict/lenient mode. Fault tolerance and reconstruction are documented in `state_reducer_registry.md`.
