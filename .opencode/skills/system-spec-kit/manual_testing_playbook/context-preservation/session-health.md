---
title: "262 -- Session health reports ok/warning/stale status"
description: "This scenario validates Session health tool for 262. It focuses on verifying session_health returns correct status thresholds and quality score."
audited_post_018: true
version: 3.6.0.13
---

# 262 -- Session health reports ok/warning/stale status

## 1. OVERVIEW

This scenario validates Session health tool (session_health).

---

## 2. SCENARIO CONTRACT


- Objective: Verify that session_health correctly computes session status based on time thresholds: ok (last tool call within 15 minutes), warning (within 60 minutes), stale (beyond 60 minutes or session older than 24 hours); Response must include structured details (sessionAgeMs, lastToolCallAgoMs, graphFreshness, specFolder, primingStatus), a QualityScore with 4 factors (recency, recovery, graphFreshness, continuity), and actionable hints.
- Real user request: `Please validate Session health reports ok/warning/stale status against session_health({}) and tell me whether the expected signals are present: status === 'ok' when called shortly after another tool call; All detail fields present with numeric values for age/time fields; graphFreshness is one of: fresh, stale, empty, error; qualityScore.level is 'healthy' for a fresh session; qualityScore.factors has all 4 keys with values 0.0-1.0.`
- Prompt: `Validate session_health reports ok, warning, and stale session states correctly.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: status === 'ok' when called shortly after another tool call; All detail fields present with numeric values for age/time fields; graphFreshness is one of: fresh, stale, empty, error; qualityScore.level is 'healthy' for a fresh session; qualityScore.factors has all 4 keys with values 0.0-1.0
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Status correct for timing, all detail fields present, quality score computed with valid factors; FAIL: Wrong status for timing, missing detail fields, or quality score factors missing/out of range

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate Fresh session returns status=ok with healthy quality against session_health({}). Verify status === 'ok', qualityScore.level === 'healthy', recency factor close to 1.0. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `session_health({})` immediately after `memory_stats({})`

### Expected

status === 'ok', qualityScore.level === 'healthy', recency factor close to 1.0

### Evidence

Command sequence executed:

1. `memory_stats({"folderRanking":"count","excludePatterns":[],"includeScores":false,"includeArchived":false,"limit":10})`
2. `session_health({})`

Preceding `memory_stats` response excerpt:

```json
{
  "summary": "Memory system: 32864 memories across 3819 folders",
  "data": {
    "totalMemories": 32864,
    "totalSpecFolders": 3819,
    "lastIndexedAt": "2026-07-03T00:20:12.267Z"
  },
  "meta": {
    "tool": "memory_stats",
    "latencyMs": 43,
    "cacheHit": false
  }
}
```

`session_health({})` response excerpt:

```json
{
  "status": "ok",
  "data": {
    "status": "ok",
    "details": {
      "sessionAgeMs": 75921,
      "lastToolCallAgoMs": 6823,
      "graphFreshness": "error",
      "specFolder": ".opencode/specs/system-speckit/031-manual-playbook-execution-sweep",
      "primingStatus": "primed"
    },
    "qualityScore": {
      "level": "healthy",
      "score": 0.6,
      "factors": {
        "recency": 1,
        "recovery": 0,
        "graphFreshness": 0,
        "continuity": 1
      }
    }
  },
  "meta": {
    "tokenBudget": 1000,
    "tokenCount": 1452
  }
}
```

### Pass / Fail

- **PASS**: `status` is `"ok"`, `qualityScore.level` is `"healthy"`, and `qualityScore.factors.recency` is `1`.

### Failure Triage

Check FIFTEEN_MINUTES_MS threshold and recency decay in context-metrics.ts

---

### Prompt

```
As a context-and-code-graph validation operator, validate Detail fields and graph freshness against session_health({}). Verify sessionAgeMs > 0, lastToolCallAgoMs >= 0, graphFreshness in [fresh, stale, empty, error], primingStatus in [primed, not_primed]. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `session_health({})`

### Expected

sessionAgeMs > 0, lastToolCallAgoMs >= 0, graphFreshness in [fresh, stale, empty, error], primingStatus in [primed, not_primed]

### Evidence

Command executed: `session_health({})`

Response fields and values:

```json
{
  "status": "ok",
  "data": {
    "status": "ok",
    "details": {
      "sessionAgeMs": 86910,
      "lastToolCallAgoMs": 17812,
      "graphFreshness": "error",
      "specFolder": ".opencode/specs/system-speckit/031-manual-playbook-execution-sweep",
      "primingStatus": "primed"
    },
    "qualityScore": {
      "level": "healthy",
      "score": 0.6,
      "factors": {
        "recency": 1,
        "recovery": 0,
        "graphFreshness": 0,
        "continuity": 1
      }
    }
  }
}
```

### Pass / Fail

- **PASS**: `sessionAgeMs` is `86910`, `lastToolCallAgoMs` is `17812`, `graphFreshness` is `"error"`, and `primingStatus` is `"primed"`.

### Failure Triage

Check getCodeGraphStatusSnapshot() and getSessionTimestamps()

---

### Prompt

```
As a context-and-code-graph validation operator, validate Quality score 4-factor breakdown against session_health({}). Verify qualityScore.factors has recency, recovery, graphFreshness, continuity each 0.0-1.0. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `session_health({})`

### Expected

qualityScore.factors has recency, recovery, graphFreshness, continuity each 0.0-1.0

### Evidence

Command executed: `session_health({})`

Factor values in response:

```json
{
  "qualityScore": {
    "level": "healthy",
    "score": 0.8,
    "factors": {
      "recency": 1,
      "recovery": 1,
      "graphFreshness": 0,
      "continuity": 1
    }
  }
}
```

### Pass / Fail

- **PASS**: all 4 factors were present and within `[0.0, 1.0]`: `recency=1`, `recovery=1`, `graphFreshness=0`, `continuity=1`.

### Failure Triage

Check computeQualityScore() in context-metrics.ts

---

### Prompt

```
As a context-and-code-graph validation operator, validate session_health excluded from idle timer against memory_stats({}). Verify lastToolCallAgoMs continues increasing from the last non-health tool call instead of resetting on session_health. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `memory_stats({})`, wait, call `session_health({})`, wait again, call `session_health({})` a second time

### Expected

lastToolCallAgoMs` continues increasing from the last non-health tool call instead of resetting on `session_health

### Evidence

Command sequence executed:

1. `memory_stats({"folderRanking":"count","excludePatterns":[],"includeScores":false,"includeArchived":false,"limit":10})`
2. `sleep 2`
3. `session_health({})`
4. `sleep 2`
5. `session_health({})`

Preceding `memory_stats` response excerpt:

```json
{
  "summary": "Memory system: 32874 memories across 3819 folders",
  "data": {
    "totalMemories": 32874,
    "totalSpecFolders": 3819,
    "lastIndexedAt": "2026-07-03T00:21:03.557Z"
  },
  "meta": {
    "tool": "memory_stats",
    "latencyMs": 42,
    "cacheHit": false
  }
}
```

First `session_health({})` response excerpt:

```json
{
  "status": "ok",
  "data": {
    "details": {
      "sessionAgeMs": 115979,
      "lastToolCallAgoMs": 4956,
      "graphFreshness": "error",
      "specFolder": ".opencode/specs/system-speckit/031-manual-playbook-execution-sweep",
      "primingStatus": "primed"
    },
    "qualityScore": {
      "level": "healthy",
      "score": 0.8,
      "factors": {
        "recency": 1,
        "recovery": 1,
        "graphFreshness": 0,
        "continuity": 1
      }
    }
  }
}
```

Second `session_health({})` response excerpt:

```json
{
  "status": "ok",
  "data": {
    "details": {
      "sessionAgeMs": 127797,
      "lastToolCallAgoMs": 8470,
      "graphFreshness": "error",
      "specFolder": ".opencode/specs/system-speckit/031-manual-playbook-execution-sweep",
      "primingStatus": "primed"
    },
    "qualityScore": {
      "level": "healthy",
      "score": 0.8,
      "factors": {
        "recency": 1,
        "recovery": 1,
        "graphFreshness": 0,
        "continuity": 1
      }
    }
  }
}
```

### Pass / Fail

- **PASS**: `lastToolCallAgoMs` increased from `4956` to `8470` across two `session_health({})` calls, so the health check did not reset the idle timer.

### Failure Triage

Check `hooks/memory-surface.ts` `recordToolCall()` usage and confirm `session_health` reads timestamps without mutating them

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [context-preservation/session-health-tool.md](../../feature_catalog/context-preservation/session-health-tool.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 262
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `context-preservation/session-health.md`
