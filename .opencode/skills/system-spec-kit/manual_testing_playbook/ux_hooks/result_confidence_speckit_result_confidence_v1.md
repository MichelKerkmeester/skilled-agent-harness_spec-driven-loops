---
title: "180 -- Result confidence (SPECKIT_RESULT_CONFIDENCE)"
description: "This scenario validates result confidence scoring (SPECKIT_RESULT_CONFIDENCE) for `180`. It focuses on the default-on graduated rollout and verifying per-result calibrated confidence with 3-factor weighting."
version: 3.6.0.17
---

# 180 -- Result confidence (SPECKIT_RESULT_CONFIDENCE)

## 1. OVERVIEW

This scenario validates result confidence scoring (SPECKIT_RESULT_CONFIDENCE) for `180`. It focuses on the default-on graduated rollout and verifying per-result calibrated confidence with 3-factor weighting.

---

## 2. SCENARIO CONTRACT


- Objective: Verify per-result calibrated confidence with 3-factor weighting.
- Real user request: `Please validate Result confidence (SPECKIT_RESULT_CONFIDENCE) against SPECKIT_RESULT_CONFIDENCE and tell me whether the expected signals are present: 3 factors: margin 0.35, channel agreement 0.30, anchor density 0.15; HIGH_THRESHOLD=0.7; LOW_THRESHOLD=0.4; labels: high/medium/low; confidence drivers: large_margin, multi_channel_agreement, anchor_density; requestQuality: good/weak/gap; heuristic only (no LLM).`
- Prompt: `Validate result confidence scoring factors, thresholds, labels, drivers, and requestQuality output.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: 3 factors: margin 0.35, channel agreement 0.30, anchor density 0.15; HIGH_THRESHOLD=0.7; LOW_THRESHOLD=0.4; labels: high/medium/low; confidence drivers: large_margin, multi_channel_agreement, anchor_density; requestQuality: good/weak/gap; heuristic only (no LLM)
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if per-result confidence uses 3-factor heuristic weighting (margin/channel/anchor) blended with a score-prior calibration term, labels match thresholds, and drivers are reported; FAIL if heuristic factors missing, thresholds wrong, labels missing, or LLM called in hot path

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, verify per-result calibrated confidence with 3-factor weighting against SPECKIT_RESULT_CONFIDENCE. Verify per-result confidence score computed; 3 factors weighted correctly; HIGH_THRESHOLD=0.7, LOW_THRESHOLD=0.4; labels assigned: high/medium/low; drivers list per result; requestQuality computed across all results; heuristic only, no LLM. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Confirm `SPECKIT_RESULT_CONFIDENCE` is unset or `true`
2. `memory_search({ query: "well-covered topic with multiple memories" })`
3. Inspect per-result confidence scores and labels
4. Verify 3-factor weights: margin=0.35, channel_agreement=0.30, anchor_density=0.15
5. Check confidence drivers reported per result
6. Verify labels: score >= 0.7 → high, < 0.4 → low, else → medium
7. Confirm requestQuality label (good/weak/gap)

### Expected

Per-result confidence score computed; 3 factors weighted correctly; HIGH_THRESHOLD=0.7, LOW_THRESHOLD=0.4; labels assigned: high/medium/low; drivers list per result; requestQuality computed across all results; heuristic only, no LLM

### Evidence

Test transcript:

```text
$ if [ -z "${SPECKIT_RESULT_CONFIDENCE+x}" ]; then printf 'SPECKIT_RESULT_CONFIDENCE is unset\n'; else printf 'SPECKIT_RESULT_CONFIDENCE=%s\n' "$SPECKIT_RESULT_CONFIDENCE"; fi
SPECKIT_RESULT_CONFIDENCE is unset
```

Native MCP `memory_search({ query: "well-covered topic with multiple memories" })` did not return per-result confidence output. The real observed tool error was:

```json
{
  "summary": "Error: An unexpected error occurred. Please check logs for details.",
  "data": {
    "error": "An unexpected error occurred. Please check logs for details.",
    "code": "E030",
    "details": {
      "tool": "memory_search",
      "issues": [
        "cursor: Too small: expected string to have >=1 characters",
        "concepts: Too small: expected array to have >=2 items"
      ],
      "unknownParameters": [],
      "expectedParameters": [
        "cursor",
        "query",
        "concepts",
        "specFolder",
        "tenantId",
        "userId",
        "agentId",
        "limit",
        "sessionId",
        "enableDedup",
        "tier",
        "contextType",
        "useDecay",
        "includeContiguity",
        "includeConstitutional",
        "enableSessionBoost",
        "enableCausalBoost",
        "includeContent",
        "anchors",
        "min_quality_score",
        "minQualityScore",
        "bypassCache",
        "rerank",
        "applyLengthPenalty",
        "applyStateLimits",
        "minState",
        "intent",
        "autoDetectIntent",
        "trackAccess",
        "includeArchived",
        "mode",
        "retrievalLevel",
        "includeTrace",
        "profile"
      ]
    }
  },
  "hints": [
    "Invalid parameter value provided.",
    "Check parameter type matches expected schema",
    "Review tool documentation for valid parameter values",
    "Ensure strings are properly quoted"
  ],
  "meta": {
    "tool": "memory_search",
    "isError": true,
    "severity": "low"
  }
}
```

Daemon-backed Spec Memory CLI fallback also did not return per-result confidence output. The real observed command output was:

```text
$ node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"well-covered topic with multiple memories"}' --format json --timeout-ms 3000
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
```

Source inspection of `mcp_server/lib/search/confidence-scoring.ts` showed the expected implementation constants and logic are present:

```text
const HIGH_THRESHOLD = 0.7;
const LOW_THRESHOLD = 0.4;
const WEIGHT_MARGIN = 0.35;
const WEIGHT_CHANNEL_AGREEMENT = 0.30;
const WEIGHT_ANCHOR_DENSITY = 0.15;
const WEIGHT_HEURISTIC = 0.45;
const WEIGHT_SCORE_PRIOR = 0.55;
export type ConfidenceLabel = 'high' | 'medium' | 'low';
export type RequestQualityLabel = 'good' | 'weak' | 'gap';
export type ConfidenceDriver =
  | 'large_margin'
  | 'multi_channel_agreement'
  | 'anchor_density';
function toConfidenceLabel(value: number): ConfidenceLabel {
  if (value >= HIGH_THRESHOLD) return 'high';
  if (value >= LOW_THRESHOLD) return 'medium';
  return 'low';
}
const rawValue =
  WEIGHT_MARGIN * marginFactor +
  WEIGHT_CHANNEL_AGREEMENT * channelFactor +
  WEIGHT_ANCHOR_DENSITY * anchorFactor;
const scorePrior = resolveCalibrationScore(result) * WEIGHT_SCORE_PRIOR;
const heuristicValue = rawValue * WEIGHT_HEURISTIC;
const rebalancedValue = Math.max(0, Math.min(1, heuristicValue + scorePrior));
const value = maybeCalibrate(rebalancedValue);
const label = toConfidenceLabel(rebalancedValue);
const drivers: ConfidenceDriver[] = [];
if (margin >= LARGE_MARGIN_THRESHOLD) drivers.push('large_margin');
if (channelCount >= STRONG_CHANNEL_AGREEMENT_MIN) drivers.push('multi_channel_agreement');
if (anchorCount >= 2) drivers.push('anchor_density');
return { requestQuality: { label } };
```

No per-result confidence scores, label assignments, driver lists, or requestQuality output were observed from a successful real `memory_search` run because the required command was blocked before producing search results.

### Pass / Fail

- **Status**: BLOCKED
- **Reason**: `SPECKIT_RESULT_CONFIDENCE` is unset, but the required real `memory_search` result output could not be produced because native MCP rejected the generated request and the CLI fallback reported stale dist artifacts requiring `npm run build`, which would modify files outside the allowed write path.

### Failure Triage

Verify confidence-scoring.ts module loaded → Confirm flag is not forced off → Check factor weights (0.35/0.30/0.15) → Inspect HIGH_THRESHOLD=0.7 and LOW_THRESHOLD=0.4 → Verify driver detection logic → Check requestQuality computation

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [ux_hooks/result_confidence.md](../../feature_catalog/ux_hooks/result_confidence.md)
- Feature flag reference: [feature_flag_reference/1_search_pipeline_features_speckit.md](../../feature_catalog/feature_flag_reference/1_search_pipeline_features_speckit.md)
- Source file: `mcp_server/lib/search/confidence-scoring.ts`

---

## 5. SOURCE METADATA

- Group: UX hooks
- Playbook ID: 180
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `ux_hooks/result_confidence_speckit_result_confidence_v1.md`
- audited_post_018: true
