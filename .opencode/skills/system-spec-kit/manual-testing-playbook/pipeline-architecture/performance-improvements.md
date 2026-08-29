---
title: "071 -- Performance improvements"
description: "This scenario validates Performance improvements for `071`. It focuses on confirming key perf remediations active, including fallback split, token-estimate caching, and BM25 demotion behavior."
audited_post_018: true
version: 3.6.0.17
id: pipeline-architecture-performance-improvements
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 071 -- Performance improvements

## 1. OVERVIEW

This scenario validates Performance improvements for `071`. It focuses on confirming key perf remediations active, including fallback split, token-estimate caching, and BM25 demotion behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm key perf remediations active.
- Real user request: `Please validate Performance improvements against hybrid-search.ts and tell me whether the expected signals are present: Optimized code paths are active (not bypassed); fallback enrichment is single-pass; token estimation is cached per result; BM25 is opt-in with FTS5 default; BM25 warmup uses incremental maintenance; heavy queries complete within acceptable time; no performance regressions.`
- Prompt: `Validate performance improvements against hybrid-search.ts and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Optimized code paths are active (not bypassed); fallback enrichment is single-pass; token estimation is cached per result; BM25 is opt-in with FTS5 default; BM25 warmup uses incremental maintenance; heavy queries complete within acceptable time; no performance regressions
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if optimized paths are active and the fallback split, token cache, BM25 opt-in/default behavior, and incremental warmup are all visible in code/runtime evidence without regressions

---

## 3. TEST EXECUTION

### Prompt

```
Validate performance improvements against hybrid-search.ts and return pass/fail with cited evidence.
```

### Commands

1. Inspect `hybrid-search.ts` and confirm `executeFallbackPlan()` collects fused tier outputs before `searchWithFallbackTiered()` calls `enrichFusedResults()` once on the final merged set
2. Inspect `truncateToBudget()` and confirm it caches token estimates in a `Map` keyed by canonical result id and uses field-aware `estimateResultTokens()` instead of whole-object serialization
3. Inspect `bm25-index.ts` and confirm `isBm25Enabled()` returns false unless `ENABLE_BM25` is explicitly set to an allowed truthy value
4. Confirm `rebuildFromDatabase()` schedules batched warmup through `syncChangedRows()` instead of performing a synchronous full rebuild
5. Run or review a representative heavy retrieval path and capture timing notes for the post-change code path

### Expected

Optimized code paths are active; fallback enrichment is single-pass; token estimation is cached per result; BM25 stays disabled by default unless explicitly enabled; batched `syncChangedRows()` warmup replaces blocking rebuilds; heavy queries complete within acceptable time; no regressions

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in section 3.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **FAIL**: `bm25-index.ts` returns `true` when `ENABLE_BM25` is unset, contradicting the expected BM25 opt-in/default-disabled behavior; the representative retrieval path also reported degraded readiness even though quick search completed in 2778 ms.

### Failure Triage

Profile the heavy retrieval path; check whether enrichment helpers are re-entered per tier; inspect token-budget estimation for cache misses; verify BM25 enablement and warmup scheduling behavior

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [pipeline-architecture/performance-improvements.md](../../feature-catalog/pipeline-architecture/performance-improvements.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 071
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pipeline-architecture/performance-improvements.md`
