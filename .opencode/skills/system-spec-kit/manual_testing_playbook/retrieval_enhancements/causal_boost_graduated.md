---
title: "147 -- Causal graph boost graduated"
description: "Validates the causal graph traversal boost: weighted 2-hop CTE walk, relation-type multipliers, hop decay, and the SPECKIT_CAUSAL_BOOST kill-switch."
audited_post_018: true
version: 3.6.0.5
---

# 147 -- Causal graph boost graduated

## 1. OVERVIEW

This scenario validates the graduated default-ON causal graph boost. It exercises the top-25%-as-seed selection, weighted 2-hop traversal, relation multipliers, per-hop cap of 0.05, combined ceiling of 0.20 with session boost, and the kill-switch.

---

## 2. SCENARIO CONTRACT

- Objective: Verify causal boost amplifies results connected to top-ranked seeds via the weighted CTE walk and respects relation multipliers, hop decay, and the combined ceiling.
- Real user request: `Please validate causal graph boost: prove top-ranked seeds drive a 2-hop walk, relation types apply the documented multipliers, the per-hop cap is 0.05, and SPECKIT_CAUSAL_BOOST=false reverts behavior.`
- Prompt: `Validate causal boost and confirm top-25% seeds drive a 2-hop walk with relation multipliers and hop decay.`
- Expected execution process: Set up causal edges with known relation types, run a search, inspect the Stage 2 trace for the walk path and applied bonus, toggle the kill-switch, and assert reversion.
- Expected signals: top-25% of fused results (max 5) become seeds; 2-hop walk follows `causal_edges` with `supersedes` (1.5), `contradicts` (0.8), `caused`/`enabled`/`derived_from`/`supports` (1.0) multipliers; per-hop boost capped at 0.05; combined session+causal boost capped at 0.20; `SPECKIT_CAUSAL_BOOST=false` removes the boost entirely.
- Desired user-visible outcome: Pass/fail verdict with cited trace evidence.
- Pass/fail: PASS when seed selection, walk path, multipliers, and ceilings match the documented behavior. FAIL when seeds are wrong, multipliers differ, caps are exceeded, or the kill-switch has no effect.

---

## 3. TEST EXECUTION

### Prompt

```
Validate causal boost and confirm top-25% seeds drive a 2-hop walk with relation multipliers and hop decay.
```

### Commands

1. Pick three stable record IDs `<A>`, `<B>`, `<C>` already in `memory_index`. `<A>` should be a strong text/embedding match for a known query `<Q>`. `<B>` and `<C>` should not match `<Q>` directly.
2. `memory_causal_link({ sourceId: "<A>", targetId: "<B>", relation: "supersedes", strength: 0.7 })`
3. `memory_causal_link({ sourceId: "<B>", targetId: "<C>", relation: "supports", strength: 0.6 })`
4. `memory_search({ query: "<Q>", enableCausalBoost: true, includeTrace: true, limit: 10 })` and capture the Stage 2 trace.
5. Assert `<A>` is in the top 25% seed set. Assert `<B>` surfaces with a boost greater than `<C>` because of the `supersedes` 1.5 multiplier on hop 1.
6. Assert `<C>` is also boosted but with a smaller magnitude (hop 2 decay) and the combined boost on any result does not exceed 0.20.
7. Set `SPECKIT_CAUSAL_BOOST=false` in MCP env, restart, repeat step 4. Assert `<B>` and `<C>` no longer surface as boosted.
8. Cleanup: `memory_causal_unlink({ sourceId: "<A>", targetId: "<B>", relation: "supersedes" })` and `memory_causal_unlink({ sourceId: "<B>", targetId: "<C>", relation: "supports" })`.
9. Targeted Vitest: `cd .opencode/skills/system-spec-kit/mcp_server && npm exec -- vitest run tests/causal-boost.vitest.ts tests/stage2-fusion.vitest.ts`.

### Expected

- Top 25% seeds selected correctly (max 5).
- 2-hop walk follows the documented relation multipliers.
- Per-hop boost capped at 0.05; combined session+causal capped at 0.20.
- Flag-off run does not boost `<B>` or `<C>`.
- Both Vitest suites exit 0.

### Evidence

- Records selected:
  - `<Q>`: `causal boost graduated top 25 seeds relation multipliers hop decay`
  - `<A>`: `9289` from baseline `memory_search`, rank 1, title `Feature Specification: Relation-Inference Backfill`, score `0.33124379981821117`
  - `<B>`: `38649` from `memory_list`, title `Implementation Summary: Phase 9: filename-residual-cleanup`
  - `<C>`: `38647` from `memory_list`, title `Phase Parent: Deep-Loop Behavioral Benchmarks`
- Baseline `memory_search` via daemon CLI rejected direct MCP wrapper empty-option calls first:

```text
Error: An unexpected error occurred. Please check logs for details.
issues:
  cursor: Too small: expected string to have >=1 characters
  concepts: Too small: expected array to have >=2 items
```

- Baseline daemon CLI `memory_search` output used to select `<A>`:

```json
{
  "summary": "Found 5 memories",
  "pipelineMetadata": {
    "stage2": {
      "sessionBoostApplied": "off",
      "causalBoostApplied": "off",
      "graphContribution": {
        "killSwitchActive": false,
        "causalBoosted": 0,
        "coActivationBoosted": 1,
        "communityInjected": 0,
        "graphSignalsBoosted": 0,
        "totalGraphInjected": 0,
        "rolloutState": "bounded_runtime"
      }
    }
  },
  "results": [
    {
      "id": 9289,
      "title": "Feature Specification: Relation-Inference Backfill",
      "score": 0.33124379981821117
    }
  ]
}
```

- `memory_causal_link` outputs for temporary test edges:

```text
Created causal link: 9289 --[supersedes]--> 38649
data.edge: 46663

Created causal link: 38649 --[supports]--> 38647
data.edge: 46664
```

- Default-on `memory_search({ enableCausalBoost: true, includeTrace: true, limit: 10 })` via daemon CLI with edges present did not apply causal boost:

```json
{
  "summary": "Found 5 memories",
  "pipelineMetadata": {
    "stage1": {
      "candidateCount": 20
    },
    "stage2": {
      "sessionBoostApplied": "off",
      "causalBoostApplied": "off",
      "graphContribution": {
        "killSwitchActive": false,
        "causalBoosted": 0,
        "coActivationBoosted": 1,
        "communityInjected": 0,
        "graphSignalsBoosted": 0,
        "totalGraphInjected": 0,
        "rolloutState": "bounded_runtime"
      }
    }
  },
  "retrievalTrace": {
    "traceId": "tr_mr3kf3x6_rq897k",
    "stages": [
      {
        "stage": "fusion",
        "metadata": {
          "sessionBoostApplied": "off",
          "causalBoostApplied": "off",
          "graphContribution": {
            "killSwitchActive": false,
            "causalBoosted": 0,
            "coActivationBoosted": 1,
            "communityInjected": 0,
            "graphSignalsBoosted": 0,
            "totalGraphInjected": 0,
            "rolloutState": "bounded_runtime"
          }
        }
      }
    ],
    "finalResultCount": 5
  },
  "progressiveDisclosure": {
    "results": [
      { "resultId": "9289" },
      { "resultId": "9263" },
      { "resultId": "6050" },
      { "resultId": "6043" },
      { "resultId": "20848" }
    ]
  },
  "appliedBoosts": {
    "session": { "applied": "off" },
    "causal": { "applied": "off" }
  }
}
```

- Explicit `SPECKIT_CAUSAL_BOOST=true` daemon CLI rerun also did not apply causal boost:

```json
{
  "pipelineMetadata": {
    "stage2": {
      "sessionBoostApplied": "off",
      "causalBoostApplied": "off",
      "graphContribution": {
        "killSwitchActive": false,
        "causalBoosted": 0,
        "coActivationBoosted": 1,
        "communityInjected": 0,
        "graphSignalsBoosted": 0,
        "totalGraphInjected": 0,
        "rolloutState": "bounded_runtime"
      }
    }
  },
  "retrievalTrace": {
    "traceId": "tr_mr3kfkf2_bqg4vi",
    "finalResultCount": 5
  },
  "appliedBoosts": {
    "session": { "applied": "off" },
    "causal": { "applied": "off" }
  }
}
```

- Flag-off `SPECKIT_CAUSAL_BOOST=false` daemon CLI rerun:

```json
{
  "pipelineMetadata": {
    "stage2": {
      "sessionBoostApplied": "off",
      "causalBoostApplied": "off",
      "graphContribution": {
        "killSwitchActive": false,
        "causalBoosted": 0,
        "coActivationBoosted": 1,
        "communityInjected": 0,
        "graphSignalsBoosted": 0,
        "totalGraphInjected": 0,
        "rolloutState": "bounded_runtime"
      }
    }
  },
  "retrievalTrace": {
    "traceId": "tr_mr3kg6ll_sipnh0",
    "finalResultCount": 5
  },
  "appliedBoosts": {
    "session": { "applied": "off" },
    "causal": { "applied": "off" }
  }
}
```

- `causal_edges` relationship dump via `memory_drift_why` before cleanup:

```json
{
  "memoryId": "38649",
  "allEdges": [
    {
      "id": 46663,
      "from": "9289",
      "to": "38649",
      "relation": "supersedes",
      "strength": 1,
      "depth": 1,
      "direction": "incoming"
    },
    {
      "id": 46664,
      "from": "38649",
      "to": "38647",
      "relation": "supports",
      "strength": 0.6,
      "depth": 1,
      "direction": "outgoing"
    }
  ]
}
```

```json
{
  "memoryId": "38647",
  "allEdges": [
    {
      "id": 46664,
      "from": "38649",
      "to": "38647",
      "relation": "supports",
      "strength": 0.6,
      "depth": 1,
      "direction": "incoming"
    },
    {
      "id": 46663,
      "from": "9289",
      "to": "38649",
      "relation": "supersedes",
      "strength": 0.63,
      "depth": 2,
      "direction": "incoming"
    }
  ]
}
```

- Cleanup outputs:

```text
Deleted causal edge 46663
data.deleted: true

Deleted causal edge 46664
data.deleted: true
```

- Targeted Vitest summary for `npm exec -- vitest run tests/causal-boost.vitest.ts tests/stage2-fusion.vitest.ts`:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  2 passed (2)
      Tests  21 passed (21)
   Start at  15:55:19
   Duration  991ms (transform 469ms, setup 17ms, import 166ms, tests 670ms, environment 0ms)
```

### Pass / Fail

- **FAIL**: The required Vitest suites exited 0, and the temporary causal edges were created and cleaned up, but the live default-on `memory_search` trace did not apply the causal boost at all (`causalBoostApplied: "off"`, `causalBoosted: 0`), so `<B>` and `<C>` did not surface as boosted and the scenario's seed/walk/multiplier/cap expectations were not observable.

### Failure Triage

Inspect `mcp_server/lib/search/causal-boost.ts` for the seed selection, weighted CTE, relation multipliers, and ceilings. Verify `mcp_server/lib/search/pipeline/stage2-fusion.ts` invokes the boost after RRF. Confirm `isCausalBoostEnabled()` reads `SPECKIT_CAUSAL_BOOST` at request time.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [retrieval_enhancements/causal_boost_graduated.md](../../feature_catalog/retrieval_enhancements/causal_boost_graduated.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- Regression tests: `.opencode/skills/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts`, `.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Retrieval enhancements
- Playbook ID: 147
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `retrieval_enhancements/causal_boost_graduated.md`
