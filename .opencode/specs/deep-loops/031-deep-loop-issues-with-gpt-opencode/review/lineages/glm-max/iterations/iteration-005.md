# Iteration 5: Broaden — benchmark measurement-claim precision (correctness)

## Focus
Broadened angle (correctness). Audit `012-gpt-claude-benchmark/benchmark-results.md` — the load-bearing measurement evidence for the packet's central FIX-5 closure decision (phase 013). Verify the headline gate claims and the failure-bucket arithmetic reconcile internally.

## Scorecard
- Dimensions covered: correctness (deepened)
- Files reviewed: 1 (012/benchmark-results.md)
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.08

## Findings

### P1, Required
(none)

### P2, Suggestion

- **F010**: Benchmark §5 pass-count does not reconcile with its own cell enumeration or the §3 cell table, `012-gpt-claude-benchmark/benchmark-results.md:65-67`
  - §5 "Failure-Classification Summary" states `pass | 7` and enumerates the cells as: "context (both models), research (Claude + GPT Phase-0), review (both models direct), ai-council (both models)". That enumeration is 2+2+2+2 = 8 cells, not 7. Independently, the §3 cell table classifies 8-9 rows as a `pass` variant (context×2, research-Claude, research-GPT-direct refused=pass, research-GPT-Phase0=pass, review-GPT-direct, review-Claude, ai-council×2). The `pass` count (7) matches neither its own enumeration (8) nor the table's pass classifications.
  - Severity P2: the load-bearing headline claims (zero route mismatches, zero Mode-D recurrences, zero missing-artifact — §5 rows 69-71 and §7) are precise and well-evidenced; only the secondary `pass` telemetry count is internally inconsistent. Flagged because this is the critical-path evidence document for the FIX-5 closure.
  - [SOURCE: 012/benchmark-results.md:65-67 (summary) vs :67 enumeration vs :43-54 (cell table)]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | 012/benchmark-results.md:43-84 | Headline gate-relevant claims (0 route-mismatch, 0 Mode-D, 0 missing-artifact) resolve to the real cell-table evidence and honestly separate the 2 timeout_latency cells from correctness failures. |

## Assessment
- New findings ratio: 0.08 (1 net-new P2; very low novelty — the benchmark is unusually honest)
- Dimensions addressed: correctness (deepened on benchmark evidence)
- Novelty justification: The benchmark is exemplary in its honesty — it explicitly calls out what was NOT covered (§6), flags the GPT deep-research-vs-deep-review Command-only enforcement inconsistency as a residual risk rather than smoothing it over (§4, §6), and separates latency from correctness. The single finding is a secondary count that doesn't reconcile.

## Ruled Out
- Benchmark overclaim / false-pass: ruled out — the 2 timeout_latency cells are explicitly reported as "incomplete command-level runs, not confirmed stuck/failure states" and excluded from the gate's "stuck/latency" trigger with clear reasoning (§7). The latency gap (3-10x) is real and honestly corroborates the operator's symptom without being misused as a correctness failure. (iteration 5, evidence: benchmark-results.md:39,48,51,58,73,77-79)
- "Inconsistent Command-only enforcement" as a hidden defect: ruled out as a finding — it is already a documented residual risk in the benchmark itself (§4 bullet 3, §6 last bullet), not an undisclosed gap.

## Dead Ends
- None this iteration.

## Recommended Next Focus
- Audit the phase 002 route-proof validator and phase 008 Mode-D fix at the code/doc level for false-negative coverage, since the benchmark relied on route-proof holding. Then sweep the remaining implemented-phase implementation-summaries (008-011) for completion-metadata drift.

Review verdict: PASS
