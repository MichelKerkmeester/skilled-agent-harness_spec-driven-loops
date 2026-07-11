---
title: "096 -- Provenance-rich response envelopes (P0-2)"
description: "This scenario validates Provenance-rich response envelopes (P0-2) for `096`. It focuses on Confirm includeTrace opt-in exposes scores/source/trace."
audited_post_018: true
version: 3.6.0.16
---

# 096 -- Provenance-rich response envelopes (P0-2)

## 1. OVERVIEW

This scenario validates Provenance-rich response envelopes (P0-2) for `096`. It focuses on Confirm includeTrace opt-in exposes scores/source/trace.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm includeTrace opt-in exposes scores/source/trace.
- Real user request: `Please validate Provenance-rich response envelopes (P0-2) against SPECKIT_RESPONSE_TRACE and tell me whether the expected signals are present: Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields.`
- RCAF Prompt: `As a retrieval-enhancement validation operator, validate Provenance-rich response envelopes (P0-2) against SPECKIT_RESPONSE_TRACE. Verify trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if trace objects present when opt-in or env-forced and absent otherwise

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval-enhancement validation operator, validate Provenance-rich response envelopes (P0-2) against SPECKIT_RESPONSE_TRACE. Verify trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. **Precondition:** ensure `SPECKIT_RESPONSE_TRACE` is unset or `false` before running the "absent" assertion (env var forces trace inclusion regardless of arg).
2. `memory_search({query:"test", includeTrace:true})` → verify `scores`, `source`, `trace` objects in response
3. `memory_search({query:"test"})` (no includeTrace, env unset) → verify these objects are absent
4. set `SPECKIT_RESPONSE_TRACE=true` and repeat without arg → verify trace objects appear due to env override
5. inspect score fields: semantic, lexical, fusion, intentAdjusted, composite, rerank, attention

### Expected

Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields

### Evidence

Executed via the daemon-backed CLI fallback because native Spec Memory status reported `runtime_ready=false`, `last_error_code=TIMEOUT`, `warm_exit_code=75`, and `node ".opencode/bin/spec-memory.cjs" --help` returned:

```text
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
```

Used non-writing stale-dist override confirmed by `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 node ".opencode/bin/spec-memory.cjs" list-tools --format text`, which included:

```text
memory_search
```

1. `env -u SPECKIT_RESPONSE_TRACE SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 node ".opencode/bin/spec-memory.cjs" memory_search --json '{"query":"test","includeTrace":true}' --format json --timeout-ms 3000`

Observed output included top-level trace/envelope metadata and result-level `scores`, `source`, and `trace`:

```json
{
  "summary": "Found 10 memories",
  "data": {
    "searchType": "hybrid",
    "count": 10,
    "retrievalTrace": {
      "traceId": "tr_mr3yfipd_vvbgjk",
      "query": "test",
      "intent": "understand",
      "totalDurationMs": 265,
      "finalResultCount": 5
    },
    "results": [
      {
        "id": 28212,
        "score": 0.2009094864,
        "scores": {
          "semantic": null,
          "lexical": null,
          "fusion": 0.2009094864,
          "intentAdjusted": 0.2009094864,
          "composite": 0.2009094864,
          "rerank": null,
          "attention": null
        },
        "source": {
          "file": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/156-agent-loops-improved/008-testing/spec.md",
          "anchorIds": [
            "metadata",
            "phase-context",
            "problem",
            "scope",
            "requirements",
            "success-criteria",
            "risks",
            "questions",
            "phase-map"
          ],
          "lastModified": "2026-07-02T18:46:23.620Z",
          "memoryState": null
        },
        "trace": {
          "channelsUsed": [
            "r8-summary-embeddings",
            "d2-query-surrogates",
            "trigger"
          ],
          "pipelineStages": [
            "candidate",
            "candidate",
            "candidate",
            "fusion",
            "final-rank",
            "filter"
          ],
          "fallbackTier": null,
          "queryComplexity": null,
          "expansionTerms": [],
          "budgetTruncated": false,
          "scoreResolution": "intentAdjusted"
        }
      }
    ],
    "evidenceDigest": "10 results retrieved; avg score 0.60."
  },
  "meta": {
    "tool": "memory_search",
    "latencyMs": 275,
    "cacheHit": false
  }
}
```

2. `env -u SPECKIT_RESPONSE_TRACE SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 node ".opencode/bin/spec-memory.cjs" memory_search --json '{"query":"test"}' --format json --timeout-ms 3000`

Observed output omitted result-level `scores`, `source`, and `trace`; the first result contained `score` and then `trustBadges`, `why`, `preCalibrationValue`, and `confidence`:

```json
{
  "summary": "Found 10 memories",
  "data": {
    "searchType": "hybrid",
    "count": 10,
    "results": [
      {
        "id": 28212,
        "score": 0.2009094864,
        "trustBadges": {
          "confidence": null,
          "extractionAge": "never",
          "lastAccessAge": "never",
          "orphan": true,
          "weightHistoryChanged": false
        },
        "why": {
          "summary": "Ranked first because semantic similarity and high spec quality",
          "topSignals": [
            "semantic_match",
            "validation_quality"
          ]
        },
        "preCalibrationValue": 0.24550021752,
        "confidence": {
          "label": "low",
          "value": 0.086,
          "drivers": [
            "anchor_density"
          ]
        }
      }
    ],
    "evidenceDigest": "10 results retrieved; avg score 0.60."
  },
  "meta": {
    "tool": "memory_search",
    "latencyMs": 263,
    "cacheHit": false
  }
}
```

3. `SPECKIT_RESPONSE_TRACE=true SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 node ".opencode/bin/spec-memory.cjs" memory_search --json '{"query":"test"}' --format json --timeout-ms 3000`

Expected trace objects to appear due to env override, but observed output again omitted result-level `scores`, `source`, and `trace`; it returned the cached non-trace response:

```json
{
  "summary": "Found 10 memories",
  "data": {
    "searchType": "hybrid",
    "count": 10,
    "results": [
      {
        "id": 28212,
        "score": 0.2009094864,
        "trustBadges": {
          "confidence": null,
          "extractionAge": "never",
          "lastAccessAge": "never",
          "orphan": true,
          "weightHistoryChanged": false
        },
        "why": {
          "summary": "Ranked first because semantic similarity and high spec quality",
          "topSignals": [
            "semantic_match",
            "validation_quality"
          ]
        },
        "preCalibrationValue": 0.24550021752,
        "confidence": {
          "label": "low",
          "value": 0.086,
          "drivers": [
            "anchor_density"
          ]
        }
      }
    ],
    "evidenceDigest": "10 results retrieved; avg score 0.60."
  },
  "meta": {
    "tool": "memory_search",
    "latencyMs": 0,
    "cacheHit": true
  }
}
```

### Pass / Fail

- **FAIL**: `includeTrace:true` exposed `scores`, `source`, and `trace`, and the env-unset call omitted them, but `SPECKIT_RESPONSE_TRACE=true` without `includeTrace` did not expose result-level `scores`, `source`, or `trace` and returned `"cacheHit": true`.

### Failure Triage

Check `handlers/memory-search.ts` for includeTrace and env branching

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [retrieval-enhancements/provenance-rich-response-envelopes.md](../../feature_catalog/retrieval-enhancements/provenance-rich-response-envelopes.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 096
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `retrieval-enhancements/provenance-rich-response-envelopes-p0-2.md`
