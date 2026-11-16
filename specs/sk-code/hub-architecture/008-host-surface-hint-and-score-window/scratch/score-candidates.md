# Surface score candidates

Measured on 2026-11-16 against the HEAD router with `node scratch/measure-candidates.cjs .` from the repository root. Exit status 0. The raw output is `scratch/score-candidates.raw.txt`.

- **Count once**: a surface scores its `weight` once however many of its phrases match. Workflow modes keep the count.
- **Two windows**: every mode keeps the count. Workflow modes and surfaces are each kept within `ambiguityDelta` of their own top score.

## Chosen candidate

Two windows. The measurement gave no rule that picks one, so the operator chose on 2026-11-16, knowing the costs in the table below. A later probe found that a prompt matching all five modes builds a route the policy has no rule for, so serving falls back to legacy routing. That fallback follows from the cap of four modes the operator chose on 2026-11-13, and the operator kept the cap on 2026-11-16.

| Candidate | What it fixes | What it breaks |
|-----------|---------------|----------------|
| Count once | Keeps the review mode for `review the dark mode toggle and focus trap`. Keeps a second surface beside a surface with several phrases | REQ-004: the existing test `a workflow mode stays first with the shipped surface` fails (`fail 1` of 15). REQ-003: the case `visual-review-bundle` loses `sk-code-frontend` |
| Two windows | Keeps the review mode for `review the dark mode toggle and focus trap`. Changes no case in `canary-cases.v1.json` | The in-scope clause "cannot drop a second surface". A surface with three phrases still drops a host surface or SKILLED with one. It also adds `sk-code-ci` to the playbook scenario CB-CR-007, whose file declares `route_shape: single` |

## Changed routes, case file (12 cases)

| Case | Shipped | Count once | Two windows |
|------|---------|------------|-------------|
| `visual-review-bundle` (`design review findings`, review=8 frontend=8) | review, frontend | review | review, frontend |

No other case changes under either candidate.

## Changed routes, wider corpus

| Source | Prompt | Scores | Shipped | Count once | Two windows |
|--------|--------|--------|---------|------------|-------------|
| playbook CB-CR-007 | `run the quality gate on my edited .github/workflows/ci.yml` | quality=8 ci=4 | quality | quality | quality, ci |
| probe | `review the dark mode toggle and focus trap` | review=4 frontend=12 | frontend | review, frontend | review, frontend |
| hint test | `pr review opencode typescript` | review=8 skilled=8 | review, skilled | review | review, skilled |
| hub, second surface | `review the typescript dark mode toggle and focus trap` | review=4 skilled=4 frontend=12 | frontend | review, frontend, skilled | review, frontend |
| host hub with a webflow surface | `review the webflow dark mode toggle and focus trap` | review=4 frontend=12 webflow=4 | frontend | review, frontend, webflow | review, frontend |
| host hub with a webflow surface | `fix the webflow dark mode toggle and focus trap` | frontend=12 webflow=4 | frontend | frontend, webflow | frontend |

Totals over the 32-prompt corpus: count once changes 3 routes, two windows changes 2. The three second-surface rows are extra.

## Count once against the hint tests

A one-line count-once prototype of `scoreModes` was run against `compiled-route-surface-hint.test.cjs` and reverted. It printed `tests 15`, `pass 14`, `fail 1`. The failing test was `a workflow mode stays first with the shipped surface`.

## A routing-model field for shared-evidence surfaces

No caller fails without one. Neither candidate reads such a field, and `surfaceDetection.specific` holds one surface upstream. No field was added.

## What would settle it

The operator picks one, or names a third score. Two options seen in the numbers:

1. Count once, and accept that a workflow mode with several phrases can drop a one-phrase surface. Rewrite the test and the case listed above.
2. Two windows, and accept that a surface with several phrases still drops a second surface. Change CB-CR-007 to a bundle.
