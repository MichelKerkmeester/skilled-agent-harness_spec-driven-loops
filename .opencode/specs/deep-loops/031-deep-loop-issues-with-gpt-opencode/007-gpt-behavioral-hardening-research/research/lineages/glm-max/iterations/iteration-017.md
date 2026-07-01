# Iteration 17: Baseline -> Regression Gate Evolution (KQ6)

**Focus track:** benchmark | **Status:** complete

## Focus
Specify how the baseline benchmark becomes a regression gate for the KQ4/KQ5 fixes and FIX-5, and what thresholds trigger action.

## Findings
- **Baseline phase (now): record GPT-vs-Claude on the CURRENT (post-002-004) codebase. Expected: GPT correctness < Claude (route-proof gaps) and GPT latency > Claude (role-resolution overhead). This establishes the "before" numbers that no GPT-vs-Claude wall-clock log currently exists for (../001 §9).** [SOURCE: ../001/research.md §9; iter 16]
- **Regression gate (after KQ4/KQ5 land): re-run the same 8 runs; PASS requires GPT route-proof score == Claude route-proof score (all 4 modes match) AND GPT first-dispatch latency within an acceptable ratio of Claude. The gate is the KQ1 smoke correctness criteria applied to both models.** [SOURCE: iter 5; iter 16]
- **FIX-5 trigger integration: if, after KQ4/KQ5, GPT still produces schema-valid route-mismatched artifacts (route-proof < 4/4 while Claude = 4/4), that is the KQ9/FIX-5 unpark signal — the benchmark makes it observable and measured, not inferred.** [SOURCE: iter 5; 006/decision-record.md:20-22; ../001/research.md §5]
- **KQ6 ANSWER: a 8-run, 2-metric benchmark reusable as baseline now and regression gate after fixes; no new tooling; integrates the FIX-5 trigger directly. Residual risk: thresholds (latency ratio) need calibration from the baseline run.** [SOURCE: iter 16 + this iteration]

## Sources Consulted
- ../001-deep-agent-router-and-orchestration/research/research.md §5,§7,§9
- iter 5
- iter 16
- 006-host-hard-identity-fix5/decision-record.md:20-22

## Assessment
- **newInfoRatio:** 0.50
- **Novelty justification:** Turns the benchmark into a regression gate that doubles as the FIX-5 trigger observability, closing the measurement gap from ../001 §9.
- **Confidence:** 0.85
- **Key questions considered:** KQ6
- **Questions closed this iteration:** KQ6

## Reflection
**What worked:**
- Wiring the FIX-5 trigger into the regression gate makes the benchmark load-bearing, not decorative.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
KQ7: enumerate which other commands/skills should adopt the literal-safe pattern from deep.md.
