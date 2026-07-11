---
title: "078 -- Legacy V1 pipeline removal"
description: "This scenario validates Legacy V1 pipeline removal for `078`. It focuses on Confirm V2-only runtime."
audited_post_018: true
version: 3.6.0.16
---

# 078 -- Legacy V1 pipeline removal

## 1. OVERVIEW

This scenario validates Legacy V1 pipeline removal for `078`. It focuses on Confirm V2-only runtime.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm V2-only runtime.
- Real user request: `Please validate Legacy V1 pipeline removal against the documented validation surface and tell me whether the expected signals are present: V1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain.`
- Prompt: `Validate legacy V1 pipeline removal against the documented validation surface and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: V1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if zero V1 pipeline references exist and all queries execute via V2 pipeline exclusively

---

## 3. TEST EXECUTION

### Prompt

```
Validate legacy V1 pipeline removal against the documented validation surface and return pass/fail with cited evidence.
```

### Commands

1. search removed symbols
2. run queries
3. confirm V2-only execution

### Expected

V1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain

### Evidence

Symbol search output:

```text
Found 2 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:
  Line 856: // ShouldApplyPostSearchIntentWeighting, postSearchPipeline) removed in


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:
  Line 292:   // isPipelineV2Enabled() was always true and has been deleted, along with its tests.
```

Validation test command output:

```text
> @spec-kit/mcp-server@1.8.0 test:core
> vitest run tests/hybrid-search.vitest.ts tests/search-flags.vitest.ts


 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

(node:57401) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

 Test Files  2 passed (2)
      Tests  121 passed (121)
   Start at  14:58:03
   Duration  1.02s (transform 368ms, setup 14ms, import 476ms, tests 419ms, environment 0ms)
```

Spec Kit memory runtime status:

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
last_error_code=TIMEOUT
last_duration_ms=2537
bridge_invocations=10
continuity_lookups=9
cache_entries=0
cache_hits=0
cache_misses=9
cache_hit_rate=0
warm_status=skipped
warm_error=TIMEOUT
warm_route=cli
warm_retryable=true
warm_exit_code=none
```

V2 pipeline source evidence:

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts
16: // 4-stage pipeline architecture
17: import { executePipeline } from '../lib/search/pipeline/index.js';
1226:     // V2 pipeline is the only path (legacy V1 removed from the runtime pipeline)
1266:     const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
4: // 4-stage pipeline execution with per-stage error handling and timeouts.
30: import { executeStage1 } from './stage1-candidate-gen.js';
31: import { executeStage2 } from './stage2-fusion.js';
32: import { executeStage3 } from './stage3-rerank.js';
33: import { executeStage4 } from './stage4-filter.js';
```

### Pass / Fail

FAIL

The scenario expected zero V1 pipeline references, but the symbol search found `postSearchPipeline` in `mcp_server/handlers/memory-search.ts` and `isPipelineV2Enabled()` in `mcp_server/tests/pipeline-v2.vitest.ts`; targeted validation tests passed, and source evidence shows `memory-search.ts` calls `executePipeline()`, but the zero-reference pass condition is not met.

### Failure Triage

Search for V1 symbols across all files; check for conditional V1/V2 routing; verify V2 pipeline handles all former V1 query types

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [pipeline-architecture/legacy-v1-pipeline-removal.md](../../feature_catalog/pipeline-architecture/legacy-v1-pipeline-removal.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 078
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline-architecture/legacy-v1-pipeline-removal.md`
