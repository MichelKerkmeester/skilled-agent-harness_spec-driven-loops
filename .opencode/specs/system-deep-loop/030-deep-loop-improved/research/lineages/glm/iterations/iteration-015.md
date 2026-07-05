# Iteration 015 — NEW: stopPolicy=max-iterations Reachability & First-Class Flag Status

**Focus:** Is stopPolicy=max-iterations a documented first-class operator flag, or only internal?
**Angle:** Trace the flag through normalizeStopPolicy, CLI args, YAML placeholders, and command docs.

## Findings

**Reachability (confirmed wired):**
- `fanout-run.cjs:147-150`: `normalizeStopPolicy` accepts `'convergence' | 'max-iterations'`, throws otherwise.
- `fanout-run.cjs:1153`: `const stopPolicy = normalizeStopPolicy(args.stopPolicy)` — parsed from `--stop-policy` CLI arg.
- `fanout-run.cjs:782-786`: the dispatch prompt stop-clause is generated conditionally: for `max-iterations` it emits "until config.maxIterations is reached; treat convergence before that as telemetry only."
- `deep_review_auto.yaml:36`: documents `stop_policy: "[convergence|max-iterations]"` and lines 557/579 implement the anti-convergence override (convergence votes become telemetry under max-iterations).
- `deep_research_auto.yaml`: carries `{stop_policy}` placeholder at lines 181, 390, 410.

**First-class flag status (PARTIAL):**
- It IS documented in the review YAML config-docs block (line 36).
- It IS NOT prominently surfaced in the operator-facing command docs (`/deep:research`, `/deep:review`) — it lives as a JSON config field and a `--stop-policy` fanout CLI arg, not as a headline `:auto`/`:confirm` mode flag.
- Round 1's research converged early precisely because stopPolicy was the DEFAULT `convergence`; the operator had to pass it via internal fanout JSON config to force depth. This round's prompt explicitly states the operator reached it via `config.stopPolicy` override, confirming it is reachable but NOT a first-class surface.

**Verdict:** structurally wired and correct, but operator-discoverability is low. Recommendation: surface `--stop-policy=max-iterations` (and `--max-iterations=N`) as first-class flags in `/deep:research` and `/deep:review` command help, not just internal fanout config.

## Evidence
[SOURCE: fanout-run.cjs:147-150,782-786,1153]
[SOURCE: deep_review_auto.yaml:36,557,579]

## newInfoRatio: 0.85 (new: precise reachability map + discoverability gap diagnosis)
