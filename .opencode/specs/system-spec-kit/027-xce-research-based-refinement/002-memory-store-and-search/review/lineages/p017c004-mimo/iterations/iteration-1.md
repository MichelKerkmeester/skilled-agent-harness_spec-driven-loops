Now I have a thorough understanding of the implementation. Let me create all init artifacts and run the iteration.Now running the Correctness iteration. Let me perform the review actions.Now writing the iteration. I found a P1 (scaffold docs block traceability) and several P2 advisories.Now updating state files, strategy, dashboard, and findings registry.Now writing the synthesis — `review-report.md`.All artifacts verified. Output directory contains:

```
p017c004-mimo/
├── deep-review-config.json
├── deep-review-dashboard.md
├── deep-review-findings-registry.json
├── deep-review-state.jsonl
├── deep-review-strategy.md
├── review-report.md
└── iterations/
    └── iteration-001.md
```

**Review summary**: CONDITIONAL verdict. 1 P1 (scaffold spec docs block traceability), 3 P2 advisories (test gap, invariant assertion, cache invalidation). Implementation code is correct — the isotonic PAV algorithm, weight rebalance (0.45/0.55), calibration wiring, and flag gating all work as designed. The single blocking finding is that `spec.md`, `plan.md`, and `tasks.md` remain scaffold placeholders with no actual requirements filled in.

FANOUT_LINEAGE_COMPLETE:p017c004-mimo