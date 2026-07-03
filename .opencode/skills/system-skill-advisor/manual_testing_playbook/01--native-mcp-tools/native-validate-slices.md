---
title: "NC-003 Native advisor_validate Slice Bundle"
description: "Manual validation that advisor_validate returns the full prompt-safe native contract: measured slices, threshold semantics, telemetry diagnostics and recorded outcome totals."
trigger_phrases:
  - "nc-003"
  - "native advisor_validate slice bundle"
  - "native advisor_validate"
  - "native"
version: 0.8.0.12
---

# NC-003 Native advisor_validate Slice Bundle

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `advisor_validate` runs the real native validation bundle and surfaces the full 014 public contract rather than returning hard-coded pass values.

---

## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- Corpus and regression fixture files are present.
- Python 3 is available for parity checks.

---

## 3. TEST EXECUTION

1. Call:

```text
advisor_validate({"confirmHeavyRun":true,"skillSlug":null})
```

2. Capture the full response.
3. Confirm the response includes `data.thresholdSemantics` and `data.telemetry` before checking the slice details.
4. Run a focused slice with explicit outcome events so `recordedThisRun` and the totals delta can be checked deterministically:

```text
advisor_validate({
  "confirmHeavyRun":true,
  "skillSlug":"system-spec-kit",
  "outcomeEvents":[
    {"runtime":"opencode","outcome":"accepted","skillId":"system-spec-kit"},
    {"runtime":"opencode","outcome":"corrected","skillId":"system-spec-kit","correctedSkillId":"skill-installer"},
    {"runtime":"opencode","outcome":"ignored","skillId":"system-spec-kit"}
  ]
})
```

5. Compare `data.telemetry.outcomes` from step 4 against the baseline snapshot from step 1. In an isolated workspace, `scope.kind` should flip to `skill`, `scope.skillSlug` should be `system-spec-kit` and `accepted`, `corrected` and `ignored` totals should each increase by exactly 1.

### Expected Signals

- Envelope has `status: "ok"`.
- `data.thresholdSemantics.aggregateValidation` includes `fullCorpusTop1`, `holdoutTop1`, `perSkillTop1` and `unknownCountTargetMax`.
- `data.thresholdSemantics.runtimeRouting` includes the live `confidenceThreshold`, `uncertaintyThreshold` and `confidenceOnly` values used by runtime routing.
- `data.slices.corpus.full_corpus_top1` includes `percentage`, `passed`, `threshold` and `count`.
- `data.slices.corpus.unknown_count.value` is present with `targetMax: 10`.
- `data.slices.holdout.holdout_top1` is present.
- `data.slices.parity.explicit_skill_top1_regression.regressions` is an array.
- `data.slices.safety.adversarial_stuffing_blocked.passed` is present.
- `data.slices.latency.regression_suite_status` includes `p0PassRate`, `failedCount`, `commandBridgeFalsePositiveRate`, `cacheHitP95Ms` and `uncachedP95Ms`.
- `data.telemetry.diagnostics` includes `recordsPath`, `recordsRetained`, `rollingCacheHitRate`, `rollingP95Ms` and `rollingFailOpenRate`.
- The focused step-4 response sets `data.telemetry.outcomes.recordedThisRun` to `3`.
- `data.telemetry.outcomes.scope.kind` is `skill` for the focused call, with `scope.skillSlug: "system-spec-kit"`.
- `data.telemetry.outcomes.totals` includes integer totals for `accepted`, `corrected` and `ignored`. In an isolated workspace those totals increase by exactly `+1` each after the step-4 call.
- Current Phase 027 baseline is 80.5% full corpus, 77.5% holdout, UNKNOWN at or below 10 and zero regressions on Python-correct prompts.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Slice fields missing | JSON path absent | Rebuild and rerun handler tests. |
| Values look fixed across changed fixture input | Repeat after focused `skillSlug` call and compare counts | Treat as hard-coded output defect. |
| Threshold or telemetry sections missing | `data.thresholdSemantics` or `data.telemetry` absent | Treat as public-contract drift and inspect the handler/schema pair before updating docs. |
| Outcome totals do not reflect injected events | `recordedThisRun !== 3` or isolated totals fail to increase by `+1/+1/+1` | Inspect outcome-record persistence and rerun `advisor_validate` handler coverage. |
| Python parity fails | Handler returns regressions for Python-correct prompts | Run the Python regression suite and inspect mismatched IDs. |

---

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/bench/`

---

## 5. SOURCE METADATA

- Group: Native MCP Tools
- Playbook ID: NC-003
- Canonical root source: manual_testing_playbook.md
- Feature file path: 01--native-mcp-tools/native-validate-slices.md

---

## 6. EVIDENCE

Initial native MCP tool call result:

```text
MCP error -32001: backend recycled; retry
```

Retry native MCP tool call result:

```text
MCP error -32001: backend recycled; retry
```

Fallback real backend CLI call used after native MCP backend recycled twice:

```text
node .opencode/bin/skill-advisor.cjs advisor_validate --json '{"confirmHeavyRun":true,"skillSlug":null}' --warm-only --format json --timeout-ms 120000
```

Output:

```json
{
  "status": "ok",
  "data": {
    "workspaceRoot": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
    "skillSlug": null,
    "thresholdSemantics": {
      "aggregateValidation": {
        "fullCorpusTop1": 0.75,
        "holdoutTop1": 0.725,
        "perSkillTop1": 0.7,
        "unknownCountTargetMax": 10
      },
      "runtimeRouting": {
        "confidenceThreshold": 0.8,
        "uncertaintyThreshold": 0.35,
        "confidenceOnly": false
      }
    },
    "overallAccuracy": 0.513,
    "perSkill": [
      {
        "skillId": "mcp-chrome-devtools",
        "status": "pass",
        "matched": 3,
        "total": 3
      },
      {
        "skillId": "sk-code",
        "status": "pass",
        "matched": 13,
        "total": 17
      },
      {
        "skillId": "sk-code-review",
        "status": "pass",
        "matched": 18,
        "total": 20
      },
      {
        "skillId": "sk-deep-research",
        "status": "fail",
        "matched": 0,
        "total": 34
      },
      {
        "skillId": "sk-deep-review",
        "status": "fail",
        "matched": 0,
        "total": 19
      },
      {
        "skillId": "sk-doc",
        "status": "pass",
        "matched": 8,
        "total": 9
      },
      {
        "skillId": "sk-git",
        "status": "pass",
        "matched": 3,
        "total": 3
      },
      {
        "skillId": "sk-prompt",
        "status": "pass",
        "matched": 9,
        "total": 10
      },
      {
        "skillId": "system-code-graph",
        "status": "pass",
        "matched": 4,
        "total": 5
      },
      {
        "skillId": "system-spec-kit",
        "status": "fail",
        "matched": 28,
        "total": 55
      }
    ],
    "slices": {
      "corpus": {
        "full_corpus_top1": {
          "percentage": 0.513,
          "passed": false,
          "threshold": 0.75,
          "count": {
            "passed": 99,
            "total": 193
          }
        },
        "unknown_count": {
          "value": 14,
          "targetMax": 10,
          "passed": false
        },
        "gold_none_false_fire_count": {
          "value": 5,
          "baselineDelta": -5
        }
      },
      "holdout": {
        "holdout_top1": {
          "percentage": 0.425,
          "passed": false,
          "threshold": 0.725,
          "count": {
            "passed": 17,
            "total": 40
          }
        }
      },
      "parity": {
        "explicit_skill_top1_regression": {
          "passed": true,
          "regressions": []
        },
        "ambiguity_slice_stable": {
          "passed": true,
          "top2Within005": true
        },
        "derived_lane_attribution_complete": true
      },
      "safety": {
        "adversarial_stuffing_blocked": {
          "passed": true,
          "fixtureCount": 1
        }
      },
      "latency": {
        "regression_suite_status": {
          "p0PassRate": 1,
          "failedCount": 11,
          "commandBridgeFalsePositiveRate": 0,
          "cacheHitP95Ms": 4.698,
          "uncachedP95Ms": 9.292
        }
      }
    },
    "telemetry": {
      "diagnostics": {
        "recordsPath": "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/speckit-skill-advisor-metrics/a9f078f65abeed95-diagnostics.jsonl",
        "recordsRetained": 0,
        "rollingCacheHitRate": 0,
        "rollingP95Ms": 0,
        "rollingFailOpenRate": 0
      },
      "outcomes": {
        "recordsPath": "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/speckit-skill-advisor-metrics/a9f078f65abeed95-outcomes.jsonl",
        "recordedThisRun": 0,
        "scope": {
          "kind": "workspace",
          "skillSlug": null
        },
        "totals": {
          "accepted": 0,
          "corrected": 0,
          "ignored": 0
        }
      }
    },
    "generatedAt": "2026-07-03T01:50:47.688Z"
  }
}
```

Focused real backend CLI call:

```text
node .opencode/bin/skill-advisor.cjs advisor_validate --json '{"confirmHeavyRun":true,"skillSlug":"system-spec-kit","outcomeEvents":[{"runtime":"opencode","outcome":"accepted","skillId":"system-spec-kit"},{"runtime":"opencode","outcome":"corrected","skillId":"system-spec-kit","correctedSkillId":"skill-installer"},{"runtime":"opencode","outcome":"ignored","skillId":"system-spec-kit"}]}' --warm-only --format json --timeout-ms 120000
```

Output:

```json
{
  "status": "ok",
  "data": {
    "workspaceRoot": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
    "skillSlug": "system-spec-kit",
    "thresholdSemantics": {
      "aggregateValidation": {
        "fullCorpusTop1": 0.75,
        "holdoutTop1": 0.725,
        "perSkillTop1": 0.7,
        "unknownCountTargetMax": 10
      },
      "runtimeRouting": {
        "confidenceThreshold": 0.8,
        "uncertaintyThreshold": 0.35,
        "confidenceOnly": false
      }
    },
    "overallAccuracy": 0.5091,
    "perSkill": [
      {
        "skillId": "system-spec-kit",
        "status": "fail",
        "matched": 28,
        "total": 55
      }
    ],
    "slices": {
      "corpus": {
        "full_corpus_top1": {
          "percentage": 0.5091,
          "passed": false,
          "threshold": 0.75,
          "count": {
            "passed": 28,
            "total": 55
          }
        },
        "unknown_count": {
          "value": 1,
          "targetMax": 10,
          "passed": true
        },
        "gold_none_false_fire_count": {
          "value": 0,
          "baselineDelta": 0
        }
      },
      "holdout": {
        "holdout_top1": {
          "percentage": 0.575,
          "passed": false,
          "threshold": 0.725,
          "count": {
            "passed": 23,
            "total": 40
          }
        }
      },
      "parity": {
        "explicit_skill_top1_regression": {
          "passed": true,
          "regressions": []
        },
        "ambiguity_slice_stable": {
          "passed": true,
          "top2Within005": true
        },
        "derived_lane_attribution_complete": true
      },
      "safety": {
        "adversarial_stuffing_blocked": {
          "passed": true,
          "fixtureCount": 1
        }
      },
      "latency": {
        "regression_suite_status": {
          "p0PassRate": 1,
          "failedCount": 11,
          "commandBridgeFalsePositiveRate": 0,
          "cacheHitP95Ms": 4.298,
          "uncachedP95Ms": 9.801
        }
      }
    },
    "telemetry": {
      "diagnostics": {
        "recordsPath": "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/speckit-skill-advisor-metrics/a9f078f65abeed95-diagnostics.jsonl",
        "recordsRetained": 0,
        "rollingCacheHitRate": 0,
        "rollingP95Ms": 0,
        "rollingFailOpenRate": 0
      },
      "outcomes": {
        "recordsPath": "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/speckit-skill-advisor-metrics/a9f078f65abeed95-outcomes.jsonl",
        "recordedThisRun": 3,
        "scope": {
          "kind": "skill",
          "skillSlug": "system-spec-kit"
        },
        "totals": {
          "accepted": 1,
          "corrected": 1,
          "ignored": 1
        }
      }
    },
    "generatedAt": "2026-07-03T01:51:13.186Z"
  }
}
```

Observed comparison against Expected Signals:

- `status: "ok"` was present in both CLI-backed responses.
- `data.thresholdSemantics.aggregateValidation` included `fullCorpusTop1`, `holdoutTop1`, `perSkillTop1` and `unknownCountTargetMax`.
- `data.thresholdSemantics.runtimeRouting` included `confidenceThreshold`, `uncertaintyThreshold` and `confidenceOnly`.
- `data.slices.corpus.full_corpus_top1` included `percentage`, `passed`, `threshold` and `count`.
- `data.slices.corpus.unknown_count.value` was present with `targetMax: 10`.
- `data.slices.holdout.holdout_top1` was present.
- `data.slices.parity.explicit_skill_top1_regression.regressions` was an array: `[]`.
- `data.slices.safety.adversarial_stuffing_blocked.passed` was present.
- `data.slices.latency.regression_suite_status` included `p0PassRate`, `failedCount`, `commandBridgeFalsePositiveRate`, `cacheHitP95Ms` and `uncachedP95Ms`.
- `data.telemetry.diagnostics` included `recordsPath`, `recordsRetained`, `rollingCacheHitRate`, `rollingP95Ms` and `rollingFailOpenRate`.
- Focused response `data.telemetry.outcomes.recordedThisRun` was `3`.
- Focused response `data.telemetry.outcomes.scope.kind` was `skill` and `scope.skillSlug` was `system-spec-kit`.
- Focused response totals were `accepted: 1`, `corrected: 1`, `ignored: 1`, which increased by `+1/+1/+1` from the baseline snapshot `0/0/0`.
- Current observed baseline was not the Expected Phase 027 baseline: full corpus was `0.513`, holdout was `0.425`, unknown count was `14`, and Python-correct prompt regressions were `[]`.

---

## 7. PASS/FAIL

FAIL: The public contract fields and telemetry behavior were present, but the observed aggregate baseline did not meet the Expected Signals: full corpus was `0.513` instead of 80.5%, holdout was `0.425` instead of 77.5%, and unknown count was `14`, above `targetMax: 10`.
