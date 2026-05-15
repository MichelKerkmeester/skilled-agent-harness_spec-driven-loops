Framework: BUILD

# Iter 040 — Track 10 (resource-map structure) — sample-query proof points

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Prove the proposed restructure improves historic recall via 3-5 sample-query proof points. For each query, show the current lookup path vs the proposed lookup path.

**Steps:**

1. Read iter 035-039.
2. Author 3-5 representative queries: "how was X done in 026" where X is something the framework / codebase actually touches (e.g., "how was the hook parity testing built", "how was the cli-devin deep-loop iter contract designed", "where is the code-graph extraction history").
3. For each query, trace the CURRENT lookup path: which 026 child gets opened first, what's the search hop count to reach the right packet.
4. For each query, trace the PROPOSED lookup path: which proposed phase gets opened first, what's the search hop count.
5. Quantify improvement (hops saved, hit rate of first-pick).

**Acceptance criteria per step:**

- 3-5 queries authored, each grounded in real recent work
- Current path + hop count per query
- Proposed path + hop count per query
- Quantified improvement
- JSONL row appended

**Stop condition:** Emit iteration-040.md then exit.

**Verification:** Sample queries with hops counted. JSONL row appended.

## Research Question (scoped)

For the proposed restructure:

1. 3-5 representative search queries?
2. Current vs proposed lookup paths?
3. Quantified recall improvement?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-040.md`

**Required heading structure:**

```
# Iter 040 — Track 10: sample-query proof points

## Question / Evidence / Findings
### Sample queries
| Query | Current path | Current hops | Proposed path | Proposed hops | Savings |
### Aggregate
- Total hops saved across 3-5 queries: <int>
- First-pick correctness improvement: <percent>
### Conclusion
- Proposed restructure improves recall by <verbal summary>
## Gaps / JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=10, iter_id="040", status="final".

## Context

Track 10 closes here. This is the FINAL iter. The next phase is synthesis: a single cli-devin SWE-1.6 dispatch with the synthesis recipe that reads iter 001-040 and emits `research/research.md`.
