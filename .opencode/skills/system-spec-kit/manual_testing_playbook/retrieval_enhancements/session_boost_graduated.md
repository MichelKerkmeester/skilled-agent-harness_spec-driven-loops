---
title: "146 -- Session attention boost graduated"
description: "Validates that session attention boost amplifies recently-attended results during Stage 2 fusion and respects the combined 0.20 ceiling shared with causal boost."
audited_post_018: true
version: 3.6.0.5
id: retrieval-enhancements-session-boost-graduated
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 146 -- Session attention boost graduated

## 1. OVERVIEW

This scenario validates the graduated default-ON session attention boost. It exercises the 0.15 multiplier applied to recently-attended results during Stage 2 fusion, the combined 0.20 ceiling with causal boost, and the `SPECKIT_SESSION_BOOST` kill-switch.

---

## 2. SCENARIO CONTRACT

- Objective: Verify session boost amplifies results matching active working-memory attention records and respects the combined ceiling with causal boost.
- Real user request: `Please validate session attention boost: prove the multiplier lifts recently-attended results, that the combined ceiling with causal boost is 0.20, and that I can disable the boost via SPECKIT_SESSION_BOOST=false.`
- Prompt: `Validate session attention boost and confirm Stage 2 fusion lifts attended results, respects the 0.20 ceiling, and reverts cleanly on the kill-switch.`
- Expected execution process: Establish session attention, run a search, compare pre- and post-boost ordering, toggle the flag, and assert reversion.
- Expected signals: results matching working_memory attention are lifted in Stage 2 fusion output; combined session+causal score boost never exceeds 0.20; `SPECKIT_SESSION_BOOST=false` removes the boost entirely.
- Desired user-visible outcome: Pass/fail verdict with cited fusion trace and rank evidence.
- Pass/fail: PASS when attended results lift in default-on, the ceiling holds, and the kill-switch reverts behavior. FAIL when attended results do not lift, the ceiling is exceeded, or the kill-switch has no effect.

---

## 3. TEST EXECUTION

### Prompt

```
Validate session attention boost and confirm Stage 2 fusion lifts attended results, respects the 0.20 ceiling, and reverts cleanly on the kill-switch.
```

### Commands

1. Pick a stable session ID `<S>` and two record IDs `<A>` and `<B>` already in `memory_index` where neither dominates the default ranking for a known query `<Q>`.
2. Establish working-memory attention for `<A>` under session `<S>` (via the existing working-memory write surface). Confirm the attention record exists.
3. `memory_search({ query: "<Q>", sessionId: "<S>", limit: 10, includeTrace: true })` and capture the Stage 2 trace with rank positions.
4. Run the same query under a fresh session ID (no attention) and capture rank positions.
5. Assert `<A>` lifts in the attended session compared to the fresh session.
6. Inspect the trace for combined session+causal boost. Assert no result's combined boost exceeds 0.20.
7. Set `SPECKIT_SESSION_BOOST=false` in MCP env, restart, repeat step 3. Assert ordering matches the fresh-session run (no lift).
8. Targeted Vitest: `cd .opencode/skills/system-spec-kit/mcp_server && npm exec -- vitest run tests/stage2-fusion.vitest.ts`.

### Expected

- Attended-session run lifts `<A>` relative to fresh-session run.
- No result's combined session+causal boost exceeds 0.20.
- Flag-off run matches fresh-session ordering.
- Vitest exits 0.

### Evidence

- CLI freshness guard output before using the documented stale-dist override:

  ```text
  @spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
  ```

- Tool surface availability with `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 node .opencode/bin/spec-memory.cjs list-tools --names-only --format text --timeout-ms 5000` included the required tools:

  ```text
  memory_context
  session_resume
  session_bootstrap
  memory_search
  memory_quick_search
  memory_match_triggers
  memory_save
  memory_list
  memory_stats
  memory_health
  session_health
  memory_delete
  memory_update
  memory_validate
  memory_bulk_delete
  memory_retention_sweep
  memory_embedding_reconcile
  checkpoint_create
  checkpoint_list
  checkpoint_restore
  checkpoint_delete
  task_preflight
  task_postflight
  memory_drift_why
  memory_causal_link
  memory_causal_stats
  memory_causal_unlink
  eval_run_ablation
  eval_reporting_dashboard
  memory_index_scan
  memory_index_scan_status
  memory_index_scan_cancel
  memory_get_learning_history
  memory_ingest_start
  memory_ingest_status
  memory_ingest_cancel
  embedder_list
  embedder_set
  embedder_status
  (node:53246) ExperimentalWarning: SQLite is an experimental feature and might change at any time
  (Use `node --trace-warnings ...` to show where the warning was created)
  ```

- Fresh-session / no-session baseline Stage 2 fusion trace from `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"session attention boost Stage 2 fusion","limit":10,"includeTrace":true,"enableDedup":false}' --format json --timeout-ms 30000`:

  ```json
  {
    "summary": "Found 5 memories",
    "data": {
      "count": 5,
      "pipelineMetadata": {
        "stage2": {
          "sessionBoostApplied": "off",
          "causalBoostApplied": "applied",
          "durationMs": 892,
          "graphContribution": {
            "causalBoosted": 1,
            "coActivationBoosted": 0,
            "communityInjected": 0,
            "graphSignalsBoosted": 0,
            "totalGraphInjected": 0,
            "rolloutState": "bounded_runtime"
          }
        }
      },
      "retrievalTrace": {
        "traceId": "tr_mr3ypw8m_07xs5j",
        "stages": [
          {
            "stage": "fusion",
            "timestamp": 1783024449016,
            "inputCount": 32,
            "outputCount": 5,
            "durationMs": 892,
            "metadata": {
              "sessionBoostApplied": "off",
              "causalBoostApplied": "applied",
              "intentWeightsApplied": "off",
              "artifactRoutingApplied": "applied",
              "feedbackSignalsApplied": "off",
              "searchType": "hybrid",
              "isHybrid": true
            }
          }
        ],
        "totalDurationMs": 2178,
        "finalResultCount": 5
      },
      "results": [
        { "id": 8465, "score": 0.5708759039999999, "why_ranked": { "rank": 1, "effectiveScore": 0.5708759039999999 } },
        { "id": 8476, "score": 0.5687711999999999 },
        { "id": 8451, "score": 0.5516674579399217 },
        { "id": 8450, "score": 0.5363441529559421 },
        { "id": 21481, "score": 0.4631696727758689 }
      ],
      "appliedBoosts": {
        "session": { "applied": "off" },
        "causal": { "applied": "applied" }
      }
    }
  }
  ```

- `memory_context` session lifecycle output from `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1 node .opencode/bin/spec-memory.cjs memory_context --json '{"input":"Validate session attention boost Stage 2 fusion","mode":"resume","profile":"resume"}' --format json --timeout-ms 30000`:

  ```json
  {
    "summary": "Context retrieved via resume mode (resume strategy)",
    "meta": {
      "sessionLifecycle": {
        "sessionScope": "ephemeral",
        "requestedSessionId": null,
        "effectiveSessionId": "memory-context:cab980be7cf74ce7",
        "resumed": false,
        "eventCounterStart": 0,
        "resumedContextCount": 0
      }
    }
  }
  ```

- Working-memory attention setup attempt with `sessionId` / `includeCognitive` failed schema validation:

  ```text
  [schema-validation] memory_match_triggers: Invalid arguments for "memory_match_triggers". Unknown parameter(s): sessionId, includeCognitive. Expected parameter names: prompt, specFolder, tenantId, userId, agentId, limit, session_id, turnNumber, include_cognitive. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.
  {
    "status": "error",
    "error": "Invalid arguments for \"memory_match_triggers\". Unknown parameter(s): sessionId, includeCognitive. Expected parameter names: prompt, specFolder, tenantId, userId, agentId, limit, session_id, turnNumber, include_cognitive. Action: remove unknown keys and fix the listed parameter types/values, then retry the same tool call.",
    "exitCode": 64
  }
  ```

- Working-memory attention setup attempt with `session_id: "memory-context:cab980be7cf74ce7"` failed session-scope validation:

  ```json
  {
    "summary": "Error: sessionId \"memory-context:cab980be7cf74ce7\" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.",
    "data": {
      "error": "sessionId \"memory-context:cab980be7cf74ce7\" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.",
      "code": "E_SESSION_SCOPE",
      "details": {
        "requestedSessionId": "memory-context:cab980be7cf74ce7"
      }
    },
    "hints": [
      "Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context."
    ]
  }
  ```

- Working-memory trigger call with no `session_id` did not create a cognitive attention record:

  ```json
  {
    "summary": "Found 10 memories",
    "data": {
      "matchType": "trigger-phrase",
      "count": 10,
      "results": [
        { "memoryId": 7833, "matchedPhrases": ["fusion", "session"], "importanceWeight": 0.8 },
        { "memoryId": 7831, "matchedPhrases": ["fusion", "session"], "importanceWeight": 0.7 },
        { "memoryId": 7835, "matchedPhrases": ["fusion", "session"], "importanceWeight": 0.6 },
        { "memoryId": 7828, "matchedPhrases": ["fusion", "session"], "importanceWeight": 0.5 },
        { "memoryId": 8530, "matchedPhrases": ["session"], "importanceWeight": 0.8 }
      ],
      "cognitive": null,
      "constitutionalCount": 0
    }
  }
  ```

- CLI `--session-id` injection also failed session-scope validation:

  ```json
  {
    "summary": "Error: sessionId \"manual-session-boost-146\" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.",
    "data": {
      "error": "sessionId \"manual-session-boost-146\" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.",
      "code": "E_SESSION_SCOPE",
      "details": {
        "requestedSessionId": "manual-session-boost-146"
      }
    }
  }
  ```

- `session_bootstrap` did not provide a usable attention-session ID:

  ```json
  {
    "status": "ok",
    "data": {
      "health": {
        "status": "ok",
        "details": {
          "sessionAgeMs": 207451,
          "lastToolCallAgoMs": 29,
          "graphFreshness": "error",
          "specFolder": "system-spec-kit",
          "primingStatus": "primed"
        }
      },
      "structuralContext": {
        "status": "missing",
        "summary": "No structural context available — code graph is empty or unavailable"
      }
    }
  }
  ```

- Targeted Vitest output from `cd .opencode/skills/system-spec-kit/mcp_server && npm exec -- vitest run tests/stage2-fusion.vitest.ts`:

  ```text
   RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


   Test Files  1 passed (1)
        Tests  15 passed (15)
     Start at  22:36:00
     Duration  616ms (transform 319ms, setup 14ms, import 29ms, tests 511ms, environment 0ms)
  ```

### Pass / Fail

- **BLOCKED**: The scenario could not establish the required working-memory attention record through the available MCP/CLI surface. The required session ID path failed with `E_SESSION_SCOPE`, no-session trigger matching returned `"cognitive": null`, and the shim reports stale dist unless `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1` is set. Because no attended-session trace could be produced, the attended lift, combined 0.20 ceiling, and flag-off reversion expectations could not be verified. Targeted Vitest did pass: `Test Files  1 passed (1)` and `Tests  15 passed (15)`.

### Failure Triage

Inspect `mcp_server/lib/search/session-boost.ts` for the 0.15 multiplier and ceiling check. Confirm `mcp_server/lib/search/pipeline/stage2-fusion.ts` invokes `applySessionBoost` for the active session. Verify `isSessionBoostEnabled()` reads `SPECKIT_SESSION_BOOST` at request time.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [retrieval_enhancements/session_boost_graduated.md](../../feature_catalog/retrieval_enhancements/session_boost_graduated.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/session-boost.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- Regression tests: `.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Retrieval enhancements
- Playbook ID: 146
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `retrieval_enhancements/session_boost_graduated.md`
