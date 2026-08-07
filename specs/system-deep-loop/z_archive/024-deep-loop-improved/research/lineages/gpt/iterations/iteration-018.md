# Iteration 18: Review Stop Policy Parity

## Focus

Compare review loop forced-depth handling.

## Findings

- `deep_review_auto.yaml` explicitly extracts `stopPolicy` and says `max-iterations` prevents convergence from stopping before the ceiling. [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:508] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:556] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:557]
- Review's composite convergence section repeats that convergence votes are telemetry under `max-iterations`. [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:579]

## Novelty

newInfoRatio: 0.35. Research should expose this contract with the same clarity.
