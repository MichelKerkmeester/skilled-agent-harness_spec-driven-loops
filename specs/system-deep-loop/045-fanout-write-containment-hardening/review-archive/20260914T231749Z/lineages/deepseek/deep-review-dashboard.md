# Deep Review Dashboard — lineage deepseek

**Status:** complete (stop policy: max-iterations) — **Verdict: FAIL**

| Field | Value |
|-------|-------|
| Session | `fanout-deepseek-1789404700951-8xtlnk` |
| Target | `specs/system-deep-loop/045-fanout-write-containment-hardening` |
| Change set | `5340e39233..63b633c62f` (8 commits) |
| Executor | `cli-pi`, model `deepseek-v4.1-flash`, label `deepseek` |
| Iterations | 5 of 5 |
| Stop reason | `maxIterationsReached` |
| Active findings | P0=1, P1=3, P2=20 (24 total) |
| Dimensions covered | correctness, security, traceability, maintainability, completeness |

> Source of truth is `deep-review-state.jsonl`. This dashboard is a rendered projection; where the two disagree, the JSONL wins.

## Iterations

| # | Focus | Verdict | New findings | Notes |
|---|-------|---------|--------------|-------|
| 1 | correctness | PASS | 4 P2 | Detection and cost defects in the guard and runner |
| 2 | security | CONDITIONAL | 1 P1, 3 P2 | Baseline restore symlink write; quarantine destination; content exposure; silent config drop |
| 3 | traceability | FAIL | 1 P0, 2 P1, 7 P2 | Spec/closure-gate/migration contradictions after the worktree removal |
| 4 | maintainability | PASS | 5 P2 | Duplicated caller envelope, undrained diagnostics, ADR and catalog drift |
| 5 | completeness | PASS | 1 P2 | Registry-empty check misfires for review; remaining phases verified clean |

## Finding Registry

Full entries with evidence, recommendations and scope proofs: `deep-review-findings-registry.json` (24 open, 0 resolved).

| Severity | IDs |
|----------|-----|
| P0 | F-009 |
| P1 | F-005, F-010, F-017 |
| P2 | F-001..F-004, F-006..F-008, F-011..F-016, F-018..F-024 |

## Dimension Coverage

| Dimension | Iteration | Findings |
|-----------|-----------|----------|
| correctness | 1 | 4 |
| security | 2 | 4 |
| traceability | 3 | 10 |
| maintainability | 4 | 5 |
| completeness | 5 | 1 |

## Convergence Telemetry

| Metric | Value |
|--------|-------|
| New-findings ratios | 0.62, 0.55, 0.55, 0.71, 0.25 |
| Trajectory | diverging (1-4) → converging (5) |
| Convergence threshold | 0.1 (mode off; telemetry only) |
| Refined findings | 0 |

## Cross-Reference Status

| Protocol | Status |
|----------|--------|
| spec_code (hard) | fail |
| checklist_evidence (hard) | not applicable (no `checklist.md`) |
| feature_catalog_code (overlay) | partial |
| playbook_capability (overlay) | pass |

## Artifacts

- `iterations/iteration-001.md` … `iteration-005.md` (write-once)
- `deltas/iter-001.jsonl` … `iter-005.jsonl`
- `deep-review-findings-registry.json`
- `review-report.md`
- `deep-review-strategy.md`
- `deep-review-config.json` (immutable)
- `resource-map.md` — not applicable (`resource_map_present: false`)
