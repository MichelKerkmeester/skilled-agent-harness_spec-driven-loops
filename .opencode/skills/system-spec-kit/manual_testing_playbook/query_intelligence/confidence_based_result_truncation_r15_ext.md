---
title: "036 -- Confidence-based result truncation (R15-ext)"
description: "This scenario validates Confidence-based result truncation (R15-ext) for `036`. It focuses on Confirm relevance-cliff cutoff."
audited_post_018: true
version: 3.6.0.15
id: query-intelligence-confidence-based-result-truncation-r15-ext
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 036 -- Confidence-based result truncation (R15-ext)

## 1. OVERVIEW

This scenario validates Confidence-based result truncation (R15-ext) for `036`. It focuses on Confirm relevance-cliff cutoff.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm relevance-cliff cutoff.
- Real user request: `Please validate Confidence-based result truncation (R15-ext) against the documented validation surface and tell me whether the expected signals are present: Results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace.`
- RCAF Prompt: `As a query-intelligence validation operator, validate Confidence-based result truncation (R15-ext) against the documented validation surface. Verify results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Results cut at confidence cliff; >=min-count results always returned; threshold visible in trace; FAIL: No truncation or fewer than min-count results

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, confirm relevance-cliff cutoff against the documented validation surface. Verify results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run long-tail query
2. Inspect cutoff math
3. Verify min-result guarantee

### Expected

Results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace

### Evidence

Preconditions: no separate Preconditions section is present in this scenario file.

Command 1, long-tail query via Spec Memory CLI:

```bash
node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"confidence-based result truncation relevance cliff cutoff threshold minResults long tail irrelevant score gap analysis R15-ext validation surface obscure telemetry medianGap cutoffGap thresholdMultiplier","concepts":["confidence truncation","relevance cliff"],"specFolder":"system-spec-kit","limit":12,"includeConstitutional":false,"includeTrace":true,"profile":"debug","bypassCache":true,"rerank":true,"intent":"find_spec","mode":"deep","retrievalLevel":"auto"}' --format json --timeout-ms 10000
```

Observed output excerpt:

```json
{
  "summary": "Found 5 memories",
  "data": {
    "searchType": "multi-concept",
    "count": 5,
    "pipelineMetadata": {
      "stage1": {
        "candidateCount": 24
      }
    },
    "retrievalTrace": {
      "traceId": "tr_mr3b7uqq_3nhvgd",
      "stages": [
        {
          "stage": "candidate",
          "outputCount": 12,
          "metadata": {
            "channel": "r8-summary-embeddings",
            "summaryHits": 12,
            "preFilterCount": 12
          }
        },
        {
          "stage": "fusion",
          "inputCount": 24,
          "outputCount": 5
        },
        {
          "stage": "filter",
          "inputCount": 5,
          "outputCount": 5,
          "metadata": {
            "stateFiltered": 0,
            "evidenceGapDetected": true,
            "trmEnabled": true,
            "applyStateLimits": false,
            "minState": ""
          }
        }
      ],
      "finalResultCount": 5
    },
    "results": [
      {
        "id": 24117,
        "score": 0.3785132149743096,
        "trace": {
          "budgetTruncated": false,
          "scoreResolution": "intentAdjusted"
        }
      }
    ]
  },
  "hints": [
    "Token budget enforced: 4 of 5 results rendered compact to fit 3500 token budget"
  ]
}
```

The live query output did not include `confidenceTruncation`, `cutoffIndex`, `medianGap`, `cutoffGap`, `thresholdMultiplier`, or `minResultsGuaranteed` in the returned trace.

Command 2, inspect cutoff math against the real implementation:

```bash
node --import ../scripts/node_modules/tsx/dist/loader.mjs -e 'import { truncateByConfidence, DEFAULT_MIN_RESULTS, GAP_THRESHOLD_MULTIPLIER } from "./lib/search/confidence-truncation.ts"; process.env.SPECKIT_CONFIDENCE_TRUNCATION="true"; const results=[[1,0.92],[2,0.90],[3,0.88],[4,0.87],[5,0.22],[6,0.20],[7,0.18],[8,0.16],[9,0.14],[10,0.12],[11,0.10],[12,0.08]].map(([id,score])=>({id,score})); const out=truncateByConfidence(results,{minResults:3}); console.log(JSON.stringify({DEFAULT_MIN_RESULTS,GAP_THRESHOLD_MULTIPLIER,truncated:out.truncated,originalCount:out.originalCount,truncatedCount:out.truncatedCount,cutoffIndex:out.cutoffIndex,medianGap:out.medianGap,cutoffGap:out.cutoffGap,keptIds:out.results.map(r=>r.id),minResultCheck:out.truncatedCount>=3,threshold:GAP_THRESHOLD_MULTIPLIER*out.medianGap}, null, 2));'
```

Observed output:

```json
{
  "DEFAULT_MIN_RESULTS": 10,
  "GAP_THRESHOLD_MULTIPLIER": 2,
  "truncated": true,
  "originalCount": 12,
  "truncatedCount": 4,
  "cutoffIndex": 3,
  "medianGap": 0.020000000000000004,
  "cutoffGap": 0.65,
  "keptIds": [
    1,
    2,
    3,
    4
  ],
  "minResultCheck": true,
  "threshold": 0.04000000000000001
}
```

Command 3, verify min-result guarantee and truncation behavior through the documented test file:

```bash
npx vitest run tests/confidence-truncation.vitest.ts
```

Observed output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  11:36:32
   Duration  145ms (transform 43ms, setup 17ms, import 42ms, tests 7ms, environment 0ms)
```

### Pass / Fail

- **FAIL**: The implementation truncates the synthetic long tail at the confidence cliff and the documented tests pass, but the real long-tail query trace did not expose the required `confidenceTruncation` threshold metadata (`thresholdMultiplier`, `medianGap`, `cutoffGap`, or `minResultsGuaranteed`).

### Failure Triage

Verify cliff detection algorithm → Check min-result guarantee → Inspect confidence score distribution

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [query_intelligence/confidence_based_result_truncation.md](../../feature_catalog/query_intelligence/confidence_based_result_truncation.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 036
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `query_intelligence/confidence_based_result_truncation_r15_ext.md`
