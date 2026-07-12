---
title: "059 -- Memory summary search channel (R8)"
description: "This scenario validates Memory summary search channel (R8) for `059`. It focuses on Confirm scale-gated summary channel."
audited_post_018: true
version: 3.6.0.16
---

# 059 -- Memory summary search channel (R8)

## 1. OVERVIEW

This scenario validates Memory summary search channel (R8) for `059`. It focuses on Confirm scale-gated summary channel.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm scale-gated summary channel.
- Real user request: `Please validate Memory summary search channel (R8) against the documented validation surface and tell me whether the expected signals are present: Summary channel activates only above corpus size threshold; channel contributes to fusion when active; channel is inert below threshold.`
- RCAF Prompt: `As a retrieval-enhancement validation operator, validate Memory summary search channel (R8) against the documented validation surface. Verify summary channel activates only above corpus size threshold; channel contributes to fusion when active; channel is inert below threshold. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Summary channel activates only above corpus size threshold; channel contributes to fusion when active; channel is inert below threshold
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if summary channel activates above threshold and remains inert below it

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval-enhancement validation operator, validate Memory summary search channel (R8) against the documented validation surface. Verify summary channel activates only above corpus size threshold; channel contributes to fusion when active; channel is inert below threshold. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. check corpus size threshold
2. run stage-1
3. verify channel activation rules

### Expected

Summary channel activates only above corpus size threshold; channel contributes to fusion when active; channel is inert below threshold

### Evidence

Command: `npx vitest run tests/memory-summaries.vitest.ts tests/search-flags.vitest.ts tests/rollout-policy.vitest.ts`

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  3 passed (3)
      Tests  71 passed (71)
   Start at  22:26:20
   Duration  302ms (transform 56ms, setup 21ms, import 68ms, tests 24ms, environment 0ms)
```

Command: `sqlite3 "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite" "SELECT 'memory_index_success_count', COUNT(*) FROM memory_index WHERE embedding_status = 'success'; SELECT 'memory_summaries_count', COUNT(*) FROM memory_summaries; SELECT 'scale_gate_gt_5000', CASE WHEN (SELECT COUNT(*) FROM memory_index WHERE embedding_status = 'success') > 5000 THEN 'true' ELSE 'false' END;"`

```text
memory_index_success_count|18831
memory_summaries_count|21067
scale_gate_gt_5000|true
```

Command: `node "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/spec-memory.cjs" memory_search --json '{"query":"memory summary search channel","limit":5}' --format json --timeout-ms 10000`

```text
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
```

MCP status output:

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
last_bridge_status=fail_open
last_error_code=EXIT_69
last_duration_ms=51
bridge_invocations=16
continuity_lookups=15
cache_entries=0
cache_hits=0
cache_misses=15
cache_hit_rate=0
warm_status=fail_open
warm_error=EXIT_69
warm_route=cli
warm_retryable=false
warm_exit_code=69
```

### Pass / Fail

- **BLOCKED**: Targeted unit tests pass and the live corpus is above the 5,000-memory threshold, but the real `memory_search` execution path needed to observe Stage 1 search/channel activation output is blocked because `@spec-kit/mcp-server dist is stale` and the Spec Memory MCP bridge reports `runtime_ready=false`, `warm_error=EXIT_69`, `warm_exit_code=69`; rebuilding would modify files outside the allowed write path.

### Failure Triage

Verify corpus size counting logic; check threshold configuration; inspect channel activation gate in stage-1 pipeline

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [retrieval_enhancements/memory_summary_search_channel.md](../../feature_catalog/retrieval_enhancements/memory_summary_search_channel.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 059
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `retrieval_enhancements/memory_summary_search_channel_r8.md`
