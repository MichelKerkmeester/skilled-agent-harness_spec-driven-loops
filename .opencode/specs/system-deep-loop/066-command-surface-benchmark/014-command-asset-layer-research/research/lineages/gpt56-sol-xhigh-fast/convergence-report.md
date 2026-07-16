# Convergence Report

- Stop reason: `maxIterationsReached`
- Stop policy: `max-iterations`
- Iterations completed: 5 / 5
- Questions answered: 5 / 5
- Ratios: `[0.90, 0.90, 0.90, 0.90, 0.90]`
- Rolling average of last three: `0.90` (`0.90 < 0.05` is false)
- Median absolute deviation: `0.00`; noise floor `0.00`; latest ratio remains above floor
- Question coverage: `1.00` (entropy STOP vote)
- Composite STOP score: `0.35`, below the strict `> 0.60` threshold
- Legal-stop gates: passed, but not needed for the hard iteration cap
- Graph gate: not applicable; iteration records carried no graph events
- Source-quality guard: passed; findings cite multiple command families, canon, validators, runtime, and baseline evidence
- Divergence: no pivots; convergence before the cap was telemetry only

The loop stopped at the configured cap, not from declining novelty.
