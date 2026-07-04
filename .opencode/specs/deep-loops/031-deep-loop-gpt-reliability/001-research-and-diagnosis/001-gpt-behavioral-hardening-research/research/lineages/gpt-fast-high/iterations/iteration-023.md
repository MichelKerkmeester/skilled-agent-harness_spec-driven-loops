# Iteration 23: Benchmark Sample Size and Thresholds

## Focus
KQ6 measurable baseline.

## Findings
- Run each of 4 modes across GPT-5.5-fast/high and Claude baseline at least 3 times to separate one-off provider variance from systematic failure.
- PASS requires 100% route-proof correctness and artifact creation; latency gate can be comparative (GPT median <= 2x Claude median or bounded by an operator-set absolute ceiling).
- FAIL categories should be `env_blocked`, `command_not_loaded`, `route_mismatch`, `missing_artifact`, `stuck_timeout`, and `latency_regression`.

## Sources Consulted
Workflow route-proof fields [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:940-958].

## Assessment
newInfoRatio: 0.18. Adds decision-grade thresholds.

## Reflection
Latency threshold should be reported as policy, not hidden inside prose.

## Recommended Next Focus
Decide plugin placement.
