# Iteration 5: Angle 5 - Cross-Hub Ambiguity Fixture

## Focus

Specify the labeled prompts and acceptance metrics for ambiguous parent-hub routing.

## Findings

1. 007 added an empirical ambiguity slice over the 25 lowest-margin rows; its frozen top-1 is only 15/25, so parent-hub ambiguity needs a named slice rather than informal spot checks. [SOURCE: .opencode/specs/system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening/implementation-summary.md:63]
2. The baseline output records full-corpus 147/193, holdout 60/78, and ambiguity 15/25; parent-hub prompts should be recaptured under the same ratchet model. [SOURCE: .opencode/specs/system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening/implementation-summary.md:129]
3. Proposed bands: `code_audit_vs_review_loop`, `design_audit_vs_code_audit`, `runtime_vs_workflow`, `one_shot_context_vs_loop`, `advisor_eval_vs_code_review`.
4. Seed prompt examples: `audit this code change for correctness` -> `sk-code`; `run a deep review loop over this spec folder` -> `deep-loop-workflows`; `audit the visual design and accessibility` -> `sk-design`; `inspect coverage-graph executor config` -> `deep-loop-runtime`; `research this once and summarize` -> abstain or context, not deep-loop.
5. Acceptance gate: after metadata cleanup and reindex, `parent_hub_ambiguity_top1` must not regress from its captured baseline; any improvement requires ratchet recapture just like 007.
6. Margin metric: record top-1 margin and `ambiguousWith`; require surviving ambiguous rows to be explicitly allowlisted or converted into prompt-safety abstains.

## Sources Consulted

- `007-eval-hardening/implementation-summary.md`
- `fusion.ts` ambiguity/ranking sections
- parent hub graph metadata

## Assessment

`newInfoRatio: 0.68`

Novelty justification: transformed qualitative hub overlap into a concrete measurement slice.

Confidence: medium-high; labels need human approval before freezing.

## Reflection

Worked: tying new fixture shape to existing ratchet infrastructure.

Failed: relying on aggregate corpus numbers; contested prompt classes need their own slice.

Ruled out: lane-weight tuning before labels.

## Recommended Next Focus

Define the atomic reindex and rebaseline runbook needed after metadata movement.
