# DeepPi Crossover Benchmark Protocol

This document defines the later crossover benchmark. It is design-only for this phase and has not been run.

## Preconditions

The benchmark may run only when both conditions hold:

1. Phase 001 (`correctness-floor`) is landed and verified green. This condition is satisfied: the baseline is 9 test files and 66 tests passing, with the DeepSeek ownership file present.
2. Phase 003's `benchmark:live` packaging path is fixed and verified. This condition is not yet satisfied, so the crossover benchmark remains blocked.

## Comparison conditions

Use the same Pi binary, model, provider, API key, repository checkout, session transcript, and machine for both conditions.

- Enabled: the direct DeepSeek model runs with the DeepPi extension loaded and its eligible hooks active.
- Disabled: the same direct DeepSeek model and transcript run without the DeepPi extension loaded.
- Control: run an unsupported-provider or unsupported-model control to confirm that the enabled condition does not alter unrelated traffic.

The enabled and disabled runs must start from equivalent fresh sessions. Record model id, provider, Pi version, Node version, extension revision, operating-system version, and context length before each run.

## Repetition and randomization

Run at least 30 paired repetitions per condition after one warm-up repetition. Pair runs by a fixed transcript and randomize whether the enabled or disabled condition runs first for each pair using a recorded seed. Keep the transcript order fixed within a pair, and alternate model variants only between complete pairs.

Measure wall-clock duration, provider-request count, input/cache-read/cache-write/output tokens, retry count, tool-call failures, and final task success. Report median, p90, and p95 for paired deltas; retain every raw repetition so outliers can be inspected.

## Confounders and exclusions

- Provider queueing, rate limits, transient API errors, and network jitter can dominate latency; record them and exclude only with a documented, predeclared rule.
- Model nondeterminism can change tool paths and token counts; use a fixed seed where the provider supports one and compare task-success strata separately.
- Session warm-up, JIT compilation, garbage collection, background processes, CPU frequency scaling, and thermal throttling affect local measurements.
- Context compaction, model switching, retries, and cache state must be recorded because they change the measured prefix and economics.
- Do not mix benchmark output with assertion-suite timings. The standalone harness measures local clone/digest work; this protocol measures end-to-end behavior.

## Stop rule

Do not publish a crossover conclusion if either precondition is false, if the paired runs are not comparable, or if the disabled control changes behavior. Preserve the raw data and report the reason for stopping.
