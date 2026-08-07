# Deep Research Strategy

## Topic

Investigate whether each dark-flag-graduation winner benefits ALL relevant real-world scenarios, not only the labeled benchmark set. For the multihop tail-appends, code-graph staleness repair and bitemporal reads, advisor RRF fusion and conflict-rerank, deep-loop finding dedup and gauges, and the true-citation ledger: where does each genuinely help, where could it hurt or be a no-op, and what scenario classes did the benchmark miss. Triangulate the implementation code, the 007 benchmark evidence, and general retrieval graph and routing principles.

## Research Charter

### Goals
1. Understand each dark-flag winner's implementation, what it actually changes on the production path
2. Triangulate across benchmark evidence, implementation code, and general retrieval/graph principles
3. Identify scenario classes each winner genuinely helps, where it could be a no-op, and where it could hurt
4. Find scenario classes the 007 benchmark missed for each winner
5. Provide a per-flag verdict on whether benchmark victory warrants confidence beyond the labeled set

### Non-Goals
- Flipping production defaults (out of scope, owned by separate decision)
- Re-running benchmarks (we work with existing evidence)
- Implementing fixes or refinements
- Deep code-level auditing of flags not named as winners

### Stop Conditions
- All 5+ dark-flag winners analyzed with scenario-class coverage maps
- Convergence on per-flag verdicts across implementation, benchmark, and theory triangulation
- Max iterations reached

## Known Context

None (fresh research packet)

## Key Questions

1. Which dark flags actually graduated (GRADUATE verdict) in the 007 benchmark?
2. For each graduate: what does the implementation actually change on the production path?
3. For each graduate: what scenario classes did the benchmark test, and what scenario classes are plausible but untested?
4. Where could each graduate be a no-op (e.g., result never reaches reader, truncation cuts before impact)?
5. Where could each graduate actually hurt (e.g., precision cost, latency, destructive data ops)?
6. What general retrieval/graph/routing principles predict scope and limits beyond the benchmark?

## Next Focus

Identify which dark flags from 007 returned GRADUATE verdicts, and read the benchmark evidence for each.

## What Worked

(None yet)

## What Failed

(None yet)

## Exhausted Approaches

(None yet)

## Carried-Forward Open Questions

(None yet)

## What Worked
- Per-cluster deep analysis with triangulation (implementation → benchmark → theory)
- Identification of cross-cutting patterns across clusters
- Benchmark contradiction detection (metric headlines vs underlying data)
- Per-cluster confidence assessment beyond labeled set

## What Failed
(None)

## Exhausted Approaches
(None)

## Convergence

- Max Iterations: 10 (stopped at 4 — questions exhausted)
- Convergence Threshold: 0.05 (newInfoRatio)
- Stop Reason: Maximally answered — all 6 key questions resolved with evidence
- Average newInfoRatio: 0.8375 (0.95 → 0.90 → 0.85 → 0.65)
- All quality gates passed: source diversity ✓, focus alignment ✓, no single weak source ✓
