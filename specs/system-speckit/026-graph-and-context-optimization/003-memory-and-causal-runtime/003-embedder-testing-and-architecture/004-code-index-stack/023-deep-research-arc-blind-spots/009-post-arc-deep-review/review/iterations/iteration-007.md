# Iteration 007 — 023/007 (fixture-calibration) + 023/008 (vec0 deferred)

## Hypotheses going in

023/007 fixture-calibration should have expanded fixture with 73 probes. 023/008 vec0 deferred should capture the 023A3 revert lessons. Expected:
- SOURCE.md documents expanded fixture with 73 probes
- 008 spec.md references 023A3 dimension handling lessons

## Files read

- 023/007-fixture-calibration/spec.md
- 023/008-vec0-migration-fix-deferred/spec.md
- mcp_server/benchmarks/benchmark-2026-05-20-expanded/SOURCE.md

## Findings

### INFO — 023/007 expanded fixture probe count verified (53, not 73)

**Evidence:**
- `mcp_server/benchmarks/benchmark-2026-05-20-expanded/SOURCE.md:9-13` documents fixture composition: 18 original + 15 architecture-invariant + 10 multilingual/code-switched + 5 short-query + 5 long-query = 53 total probes
- `023/007-fixture-calibration/spec.md:123` SC-001 expects "at least 18 original, 15 architecture-invariant, 10 multilingual/code-switched, 5 short, 5 long probes" (sum = 53)
- SOURCE.md confirms path-class coverage across implementation, tests, docs, generated, vendor, and spec-research targets

**Analysis:** The expanded fixture has 53 probes (18+15+10+5+5), not 73 as mentioned in the iteration instruction. The spec.md SC-001 confirms the expected composition matches the SOURCE.md documentation. The 73 figure in the instruction may be an error or refer to a different metric.

**Severity:** INFO — fixture expansion verified (53 probes), instruction's 73 figure appears incorrect.

### INFO — 023/008 does NOT capture 023A3 revert lessons

**Evidence:**
- `023/008-vec0-migration-fix-deferred/spec.md:1-99` is a minimal Level 1 packet that only tracks the deferred follow-up for vec0 migration
- The spec.md problem statement (line 49-51) states: "The 023 arc reserved a follow-up slot for vec0 migration repair, but no implementation scope has been authorized yet"
- There is no mention of 023A3, dimension handling, or revert lessons in the 008 spec.md
- The only open question (line 98) is "Which vec0 migration path should be selected when this deferred follow-up is activated?"

**Analysis:** The 008 packet is a scaffold to preserve the deferred follow-up location under the 023 phase parent. It does not capture or reference 023A3 dimension handling revert lessons. The 023A3 guidance lives in 023/003-upstream-rebase-spike/research/cross-packet-impact.md:29-38, not in 008.

**Severity:** INFO — 008 is correctly scoped as a minimal scaffold for vec0 deferred work; it does not claim to capture 023A3 lessons.

## Updates to review.md

Iteration 007 completed. Verified 023/007 expanded fixture has 53 probes (18 original + 15 architecture-invariant + 10 multilingual + 5 short + 5 long), not 73 as stated in iteration instruction. Verified 023/008 is a minimal scaffold for vec0 deferred work and does not capture 023A3 dimension handling revert lessons (those live in 023/003 cross-packet-impact.md).

## NO-EARLY-STOP confirmation

Iteration 7 of 10 complete. Continuing to iteration 8.
