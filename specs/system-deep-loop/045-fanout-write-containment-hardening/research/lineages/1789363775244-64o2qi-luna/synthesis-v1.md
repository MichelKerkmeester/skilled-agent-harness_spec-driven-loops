---
title: "Deep Research Synthesis Snapshot — Lower-Cost Exact Fan-Out Isolation"
generation: 1
---

# Synthesis Snapshot

## Terminal result

- Stop reason: `maxIterationsReached`
- Iterations: 3
- Questions answered: 5/5
- Convergence mode: `off`
- Average new-info ratio: 0.8433 from 0.91, 0.84, and 0.78

## Decision

Measure sparse plus blobless partial data inside registered per-lineage Git worktrees first. It is the lowest-risk exact optimization because it reduces materialization while retaining private worktree/index/status boundaries and Git-managed move/repair semantics. Shallow and reference/shared modes are secondary history/object choices, not checkout-cost solutions.

Private-upper COW or sandbox views may reduce disk further, but only with private mutable upper/work and Git admin/index state plus a new merged-root path seam that covers child processes, realpaths, containment, and churn. A single checkout with environment-only write redirection is not exact under the current runtime.

## Measured baseline

The packet records 16.5 seconds without worktrees versus 149.7 seconds with worktrees for six lanes at concurrency 3, and 1.6 GB of checked-out files per tree with a shared object store [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:98-110]. Alternative setup and disk deltas remain unmeasured.

See [research.md](research.md) for the full decision matrix, eliminated alternatives, relocation analysis, evidence labels, and acceptance plan.
