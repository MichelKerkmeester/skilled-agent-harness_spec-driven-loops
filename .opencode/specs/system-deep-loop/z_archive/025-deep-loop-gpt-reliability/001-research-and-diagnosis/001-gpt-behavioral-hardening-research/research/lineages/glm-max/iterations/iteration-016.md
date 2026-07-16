# Iteration 16: GPT-vs-Claude Benchmark Design (KQ6)

**Focus track:** benchmark | **Status:** complete

## Focus
Design a minimal, repeatable benchmark comparing GPT-5.5 (high/fast) against Claude Sonnet/Opus on latency + first-dispatch correctness across all 4 deep modes, usable now as a baseline and later as a regression gate.

## Findings
- **Reuse the iter-5 decisive smoke AS the benchmark: it already defines per-mode first-dispatch correctness (route-proof fields) + a native/Claude baseline control. The benchmark = run the smoke harness for BOTH GPT and Claude on the same tiny packet, record wall-clock + correctness.** [SOURCE: iter 5; 005-gpt-verification-smoke/verification-smoke.md:42-66; ../001/research.md §7]
- **Latency metric: time from command dispatch to first canonical record written (first-dispatch latency), plus total iteration latency. Captures the role-resolution-overhead mechanism (../001 §3.1) directly.** [SOURCE: ../001-deep-agent-router-and-orchestration/research/research.md §3.1]
- **Correctness metric: route-proof score = fraction of {mode, target_agent, agent_definition_loaded==true, echoed resolved_route} that match the requested mode. Binary gate per mode (all 4 must match) + a continuous score for trend.** [SOURCE: iter 5; 005/verification-smoke.md:42-50]
- **Minimal harness: 4 modes x 2 models x 1 tiny packet = 8 runs; snapshot pre/post state-log counts; record the 2 metrics per run. No new tooling required — existing workflow provenance suffices (../001 §7).** [SOURCE: ../001/research.md §7 (existing provenance suffices)]

## Sources Consulted
- iter 5
- 005-gpt-verification-smoke/verification-smoke.md:42-66
- ../001-deep-agent-router-and-orchestration/research/research.md §3.1,§7

## Assessment
- **newInfoRatio:** 0.62
- **Novelty justification:** Fuses the smoke and benchmark into one 8-run harness with a 2-metric design (latency + route-proof), avoiding new tooling.
- **Confidence:** 0.86
- **Key questions considered:** KQ6
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Reusing the smoke as the benchmark halves the design surface.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
KQ6: how the baseline evolves into a regression gate for any fix this research proposes.
