# Deep Research Dashboard

Lineage: `pi-deepseek` | Session: `fanout-pi-deepseek-1789124400614-oxa15x` | Loop: research
Stop policy: `max-iterations` (cap 4) | Convergence threshold: 0.05 (telemetry only)

## Iteration Table

| Run | Status | Focus | Findings | newInfoRatio | Started |
|-----|--------|-------|----------|--------------|---------|
| 1 | complete | Q1 always-loaded test: Gate 5 load mechanics, read-only turns, communication near-miss | 8 | 1.0 | 2026-09-11T11:20Z |
| 2 | complete | Q2 four-part refusal test and existing-obligations inventory | 7 | 0.85 | 2026-09-11T11:28Z |
| 3 | complete | Q3 restraint test: incident-level failure search | 7 | 0.8 | 2026-09-11T11:36Z |
| 4 | complete | Q4 scope boundary test and fourth-widening determination | 6 | 0.85 | 2026-09-11T11:44Z |

## Question Status

| ID | Question | Status | Answer |
|----|----------|--------|--------|
| KQ-1 | Always-loaded test | answered (iter 1) | Yes for half (A), no for half (B) |
| KQ-2 | Four-part refusal test | answered (iter 2) | Single row, partly carried, anchored, refused |
| KQ-3 | Restraint test | answered (iter 3) | No evidenced failure |
| KQ-4 | Scope boundary test | answered (iter 4) | Out, fourth widening refused |
| KQ-5 | Verdict | answered (synthesis) | AGENTS.md-row |

## Convergence Trend

| Run | newInfoRatio | Running note |
|-----|--------------|--------------|
| 1 | 1.0 | Baseline pass, all findings new |
| 2 | 0.85 | Net-new inventory and condition mapping |
| 3 | 0.8 | Negative search result plus counter-facts |
| 4 | 0.85 | Net-new widening determination |

Average: 0.875. Convergence is telemetry only: `stopPolicy: max-iterations` required all four
iterations, and the loop ran them.

## Dead Ends (do not retry)

- Rule-file home for half (A) via the close-out trigger row: Gate 5 read-only exclusion blocks it.
- Full-satisfaction claim based on the close-out status: item 3 is verification, not an action list.
- Third-widening carve-out as precedent for per-runtime tool naming: the carve-out admits verification, not selection.

## Blocked Stops

None. No blocked-stop event, no stuck recovery, no timeout.

## Graph Convergence

Not applicable: no coverage graph events were recorded in this lineage.

## Next Focus

Complete. Verdict `AGENTS.md-row`, decided by the always-loaded test. Phase 002 owns the shape
decision and the operator question on any §4 widening. The restraint finding (no evidenced
failure) is recorded so the addition is understood as operator-preference-driven.
