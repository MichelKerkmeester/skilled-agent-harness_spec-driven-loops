---
title: "049 -- 4-stage pipeline refactor (R6)"
description: "This scenario validates 4-stage pipeline refactor (R6) for `049`. It focuses on Confirm stage flow and invariant."
audited_post_018: true
version: 3.6.0.16
id: pipeline-architecture-4-stage-pipeline-refactor-r6
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 049 -- 4-stage pipeline refactor (R6)

## 1. OVERVIEW

This scenario validates 4-stage pipeline refactor (R6) for `049`. It focuses on Confirm stage flow and invariant.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm stage flow and invariant.
- Real user request: `Please validate 4-stage pipeline refactor (R6) against the documented validation surface and tell me whether the expected signals are present: Query traverses all 4 stages in order; stage transitions visible in verbose metadata; stage-4 scores immutable after final stage.`
- Prompt: `Validate 4-stage pipeline refactor (R6) against the documented validation surface and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Query traverses all 4 stages in order; stage transitions visible in verbose metadata; stage-4 scores immutable after final stage
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All 4 stages execute in sequence; stage-4 scores unchanged after completion; FAIL: Stage skipped or stage-4 scores mutated

---

## 3. TEST EXECUTION

### Prompt

```
Validate 4-stage pipeline refactor (R6) against the documented validation surface and return pass/fail with cited evidence.
```

### Commands

1. Run verbose stage metadata
2. inspect stage transitions
3. confirm stage-4 immutability

### Expected

Query traverses all 4 stages in order; stage transitions visible in verbose metadata; stage-4 scores immutable after final stage

### Evidence

User request used:

```text
Please validate 4-stage pipeline refactor (R6) against the documented validation surface and tell me whether the expected signals are present: Query traverses all 4 stages in order; stage transitions visible in verbose metadata; stage-4 scores immutable after final stage.
```

Orchestrator prompt used:

```text
Validate 4-stage pipeline refactor (R6) against the documented validation surface and return pass/fail with cited evidence.
```

Documented validation surface read:

```text
.opencode/skills/system-spec-kit/feature_catalog/pipeline_architecture/4_stage_pipeline_refactor.md
57: | `mcp_server/lib/search/pipeline/orchestrator.ts` | Lib | Pipeline orchestration — dispatches Stage 1-4 in sequence |
58: | `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Stage 1: candidate generation across search channels |
59: | `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Stage 2: fusion and signal integration (session boost, causal boost, co-activation, graph signals, FSRS, intent, feedback) |
60: | `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Lib | Stage 3: MMR diversity reranking and MPAB chunk collapse |
61: | `mcp_server/lib/search/pipeline/stage4-filter.ts` | Lib | Stage 4: filter and annotate with score-immutability invariant (`Stage4ReadonlyRow`, `verifyScoreInvariant()`) |
68: | `mcp_server/tests/pipeline-v2.vitest.ts` | Automated test | V2 pipeline orchestration |
```

Verbose stage metadata command attempted via MCP `memory_search` with `includeTrace:true`:

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

Retry with populated `concepts` and placeholder cursor:

```json
{
  "summary": "Error: Cursor is invalid, expired, or out of scope",
  "data": {
    "error": "Cursor is invalid, expired, or out of scope",
    "code": "E_VALIDATION",
    "details": {
      "parameter": "cursor"
    }
  },
  "hints": [
    "Retry the original search to generate a fresh continuation cursor"
  ],
  "meta": {
    "tool": "memory_search",
    "tokenCount": 120,
    "cacheHit": false,
    "isError": true,
    "severity": "error",
    "tokenBudget": 3500
  }
}
```

Retry with populated server-managed scope fields but ad hoc `sessionId`:

```json
{
  "summary": "Error: sessionId \"manual-playbook-049-r6\" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.",
  "data": {
    "error": "sessionId \"manual-playbook-049-r6\" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.",
    "code": "E_SESSION_SCOPE",
    "details": {
      "requestedSessionId": "manual-playbook-049-r6"
    }
  },
  "hints": [
    "Omit sessionId to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context."
  ],
  "meta": {
    "tool": "memory_search",
    "tokenCount": 212,
    "cacheHit": false,
    "isError": true,
    "severity": "error",
    "tokenBudget": 3500
  }
}
```

MCP quick-search retry after session-scope error:

```text
MCP error -32001: backend recycled; retry
```

Spec memory runtime status after backend recycle:

```text
plugin_id=mk-spec-memory
enabled=true
disabled_reason=none
cache_ttl_ms=5000
max_brief_chars=2400
max_cache_entries=200
runtime_ready=false
node_binary=node
bridge_timeout_ms=3000
cli_timeout_ms=2500
bridge_path=[spec-memory-bridge]
last_bridge_status=skipped
last_error_code=CONNECT_ECONNREFUSED__TMP_MK_SPEC_MEMORY_DAEMON_IPC_SOCK
last_duration_ms=50
bridge_invocations=13
continuity_lookups=11
cache_entries=0
cache_hits=0
cache_misses=11
cache_hit_rate=0
warm_status=skipped
warm_error=CONNECT_ECONNREFUSED__TMP_MK_SPEC_MEMORY_DAEMON_IPC_SOCK
warm_route=warm_probe
warm_retryable=true
warm_exit_code=75
```

Daemon CLI fallback command:

```bash
node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"4-stage pipeline refactor R6 stage transitions stage-4 score immutability","concepts":["4-stage pipeline refactor","stage transitions"],"specFolder":"system-spec-kit","limit":5,"includeConstitutional":false,"includeTrace":true,"profile":"debug","bypassCache":true,"rerank":true,"minState":"ARCHIVED","intent":"understand","retrievalLevel":"auto"}' --format json --timeout-ms 3000 --warm-only
```

Daemon CLI fallback output:

```text
(node:96499) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "status": "error",
  "error": "backend unavailable: connect ECONNREFUSED /tmp/mk-spec-memory/daemon-ipc.sock",
  "exitCode": 75
}
```

Daemon CLI non-warm retry command:

```bash
node .opencode/bin/spec-memory.cjs memory_search --json '{"query":"4-stage pipeline refactor R6 stage transitions stage-4 score immutability","concepts":["4-stage pipeline refactor","stage transitions"],"specFolder":"system-spec-kit","limit":5,"includeConstitutional":false,"includeTrace":true,"profile":"debug","bypassCache":true,"rerank":true,"minState":"ARCHIVED","intent":"understand","retrievalLevel":"auto"}' --format json --timeout-ms 10000
```

Daemon CLI non-warm retry output:

```text
(node:98189) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{
  "status": "error",
  "error": "tools/call timed out",
  "exitCode": 75
}
```

Stage-order and invariant source evidence read from `mcp_server/lib/search/pipeline/orchestrator.ts`:

```text
121: export async function executePipeline(config: PipelineConfig): Promise<PipelineResult> {
126:   // -- Stage 1: Candidate Generation (MANDATORY — no fallback possible) --
150:   // -- Stage 2: Fusion + Signal Integration (falls back to unsorted candidates) --
183:   // -- Stage 3: Rerank + Aggregate (falls back to unranked scored results) --
216:   // -- Stage 4: Filter + Annotate (falls back to unfiltered results) --
334:   return {
336:     metadata: {
337:       stage1: stage1Result.metadata,
338:       stage2: stage2Result.metadata,
339:       stage3: stage3Result.metadata,
340:       stage4: stage4Result.metadata,
341:       timing,
```

Stage-4 immutability source evidence read from `mcp_server/lib/search/pipeline/stage4-filter.ts`:

```text
243:   // -- Step 1: Capture score snapshot (runtime invariant) --
249:   const scoresBefore = captureScoreSnapshot(results);
318:   // -- Step 5: Verify score invariant (defence-in-depth) --
324:   verifyScoreInvariant(scoresBefore, workingResults);
```

Targeted R6 automated test command:

```bash
npx vitest run tests/pipeline-v2.vitest.ts
```

Targeted R6 automated test output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  27 passed (27)
   Start at  14:03:50
   Duration  802ms (transform 555ms, setup 15ms, import 53ms, tests 668ms, environment 0ms)
```

### Pass / Fail

- **BLOCKED**: The required live verbose stage metadata query could not be executed because the Spec Kit Memory backend was unavailable after recycle (`runtime_ready=false`, `CONNECT_ECONNREFUSED__TMP_MK_SPEC_MEMORY_DAEMON_IPC_SOCK`) and both warm-only and non-warm daemon CLI fallbacks returned retryable `exitCode: 75`; source inspection and the targeted R6 test suite support the stage order and stage-4 invariant, but the scenario's Expected live metadata signal was not observable in the current runtime state.

### Failure Triage

Verify stage ordering enforcement → Check verbose metadata emission → Inspect stage-4 immutability guard

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [pipeline_architecture/4_stage_pipeline_refactor.md](../../feature_catalog/pipeline_architecture/4_stage_pipeline_refactor.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 049
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline_architecture/4_stage_pipeline_refactor_r6.md`
