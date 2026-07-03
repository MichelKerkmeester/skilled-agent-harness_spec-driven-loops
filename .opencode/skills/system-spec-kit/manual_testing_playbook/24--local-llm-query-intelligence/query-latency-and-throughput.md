---
title: "410 — Query latency + throughput under realistic load"
description: "Fire a mixed-workload of 50 queries (short, medium, long; semantic, mixed, exact) and measure p50/p95/p99 latency + queries/sec. Verifies the local-LLM stack performs acceptably for interactive use."
audited_post_018: true
version: 3.6.0.2
---

# 410 — Query latency + throughput under realistic load

## 1. OVERVIEW

The mechanical tests in `mcp_server/tests/local-llm-features/performance/*.bench.ts` measure single-embedding latency under controlled conditions. This scenario measures end-to-end SEARCH latency — including embedding the query, running the vector search, ranking, and returning hits — under a realistic mixed workload.

The local-LLM stack must support interactive use. Targets:
- p50 ≤ 200 ms (median search returns in under a fifth of a second)
- p95 ≤ 800 ms (only 5% of searches exceed three-quarters of a second)
- p99 ≤ 2 s (catastrophic outliers under 2 seconds)
- ≥ 5 queries/sec sustained throughput

---

## 2. SCENARIO CONTRACT

- Objective: Confirm interactive-grade latency + throughput.
- Real user request: `Run 50 mixed queries through Memory MCP and report p50/p95/p99 latency + queries-per-second. Confirm the stack meets interactive targets.`
- RCAF Prompt: `As a query-intelligence validation operator, fire 50 mixed-load queries through memory_search and report p50/p95/p99 + sustained throughput. Return a pass/fail verdict against the documented interactive targets.`
- Expected execution process: run the canned 50-query workload, time each call, compute percentiles + throughput.
- Expected signals: p50 ≤ 200 ms, p95 ≤ 800 ms, p99 ≤ 2 s, throughput ≥ 5 qps.
- Desired user-visible outcome: `PASS — p50 142 ms / p95 612 ms / p99 1.8 s / 7.2 qps; meets all interactive targets.`
- Pass/fail: PASS if ALL 4 targets met; PARTIAL if 2-3 met; FAIL if ≤ 1 met.

---

## 3. TEST EXECUTION

### Prompt

```
Fire the canned 50-query mixed workload through memory_search and report p50/p95/p99/qps.
```

### Commands

1. Prepare the workload file `_sandbox/24--local-llm-query-intelligence/410/workload.json` with 50 queries:
   - 17 short (5-20 chars)
   - 17 medium (50-150 chars)
   - 16 long (200-500 chars)
   - Roughly half semantic, half partial-keyword, half lexical-exact
2. Use this driver loop (pseudocode):
   ```
   const t_all = []
   for (const q of workload) {
     const t0 = performance.now()
     await memory_search({ query: q, limit: 5 })
     t_all.push(performance.now() - t0)
   }
   const p50 = percentile(t_all, 50)
   const p95 = percentile(t_all, 95)
   const p99 = percentile(t_all, 99)
   const qps = workload.length / (sum(t_all) / 1000)
   ```
3. Run the workload twice — first run includes any cold-start; second run is the steady-state measurement. Report both.

### Expected

Targets:
- p50 ≤ 200 ms — single search returns interactively
- p95 ≤ 800 ms — tail does not block interactive use
- p99 ≤ 2 s — catastrophic outliers bounded
- ≥ 5 qps — supports a working operator typing-and-firing pattern

Sample observed result:
```
COLD RUN  (1st pass, may include init):  p50=180 ms  p95=720 ms  p99=1.6 s  qps=5.4
STEADY    (2nd pass, warm provider):     p50=142 ms  p95=612 ms  p99=1.8 s  qps=7.2
```

→ PASS (steady run meets all 4 targets)

### Evidence

- BLOCKED before workload execution.
- Scenario command 1 requires preparing `_sandbox/24--local-llm-query-intelligence/410/workload.json` with 50 queries.
- User constraint: `Do NOT modify, create, or delete any file OTHER than the single scenario file named below.`
- Allowed write path: `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/query-latency-and-throughput.md`.
- Because `_sandbox/24--local-llm-query-intelligence/410/workload.json` is outside the allowed write path, the required workload file could not be created and the workload could not be run exactly as written.
- No `memory_search` latency samples were collected; no p50/p95/p99/qps values are available.
- Pass/Fail: BLOCKED — required workload file creation is forbidden by the allowed write path for this run.

## 4. NOTES

This scenario is sensitive to system load. Run it when no other heavy processes are active on the machine. Repeat 3 times and report the median of medians if results are noisy.

If targets are missed:
- p50 high → embedding inference is slow (check provider; ollama Metal should be fast on Apple Silicon).
- p95/p99 high but p50 fine → outliers are likely first-cold-cache events; pre-warm or increase the steady-state sample.
- qps low → likely sequential bottleneck; check concurrent-generation handling.

This is the only scenario in the suite that captures wall-clock performance. The mechanical bench files under `performance/*.bench.ts` measure embedding-only latency at finer granularity; this playbook entry measures the **end-to-end search experience** the operator actually sees.

## 5. CLEANUP

No cleanup needed; this scenario is read-only against the production DB. The workload JSON can stay under `_sandbox/24--local-llm-query-intelligence/410/` for future reruns.
