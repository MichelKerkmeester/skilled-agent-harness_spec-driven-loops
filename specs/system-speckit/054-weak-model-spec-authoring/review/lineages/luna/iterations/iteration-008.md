# Review Iteration 8 — Correctness and traceability: phase 009 anchor enforcement

## Dispatcher

- Session: fanout-luna-1792949481267-fym7sk, generation 1, lineage mode new.
- Focus: inspect whether strict validation enforces required task anchors, and whether the deciding benchmark score follows its documented M3 procedure.
- Review target: specs/system-speckit/054-weak-model-spec-authoring.
- Route proof: Resolved route: mode=review target_agent=deep-review.
- The lineage steer.md was absent before this iteration.
- This was a static contract, implementation-description, and recorded-run review. No validators or tests were run.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Strict validation can pass with a required task anchor missing** — .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:100-109

   - Case: ANCHORS_VALID checks whether anchor markers are structurally well formed, but it does not require every template-contract anchor to be present. The phase records a fresh benchmark run deleting the required fix-completeness section while strict validation still passed.
   - Evidence: the tasks contract lists fix-completeness as required; the run's separate scorer counted that missing anchor, and the phase goal says strict validation passed without the section. The goal records this validator gap as an open follow-up.
   - User impact: a packet can receive RESULT: PASSED while a mandatory task section is absent. The corrected fill note reduces the chance of deletion but leaves the strict gate unable to catch it.
   - Recommendation: give required-anchor presence enforcement its own scoped validator follow-up and assert strict fails when a required anchor is absent.
   - Finding class: required-anchor-presence.
   - Scope proof: phase 009 explicitly excludes validator changes; its goal records this as an open follow-up rather than a completed fix.
   - Affected surfaces: strict packet validation, tasks.md template, benchmark completeness check.

### P2 Findings

1. **The deciding anchor-score rule is missing from the benchmark recipe** — specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/plan.md:75

   - Case: the plan defines M3 as the raw shortfall against anchors-v2.3.txt, and T006 computes that raw count. The later deciding sets use justified-anchors.sh, which exempts some optional task anchors under a contract-based rule. The goal records the new rule, but plan.md, tasks.md, and acceptance-criteria.md do not reference the helper or its scoring procedure.
   - Evidence: M3 and T006 retain the raw-count recipe; goal.md records the operator-approved rule and the helper; criteria.txt records C5 using the adjusted scores.
   - User impact: rerunning the benchmark from the packet's documented recipe will not reproduce the adjusted scores for a run that omits an optional task anchor, making historical set comparisons harder to audit.
   - Recommendation: link the approved scoring rule and helper from the benchmark metric and T006, or explicitly limit the helper to supplemental diagnostics.
   - Finding class: benchmark-metric-procedure-alignment.
   - Scope proof: the changed rule is documented in the phase goal and scratch helper, while the plan and task recipe remain unchanged.
   - Affected surfaces: M3 definition, T006 scoring procedure, C5 evidence.

## Clean Checks

- C5 closeout status: PASS. The fourth final set records zero missing anchors across all three runs; criteria.txt records C5 PASS, and the acceptance rows and implementation summary say Complete. Earlier C5 failures remain labeled as history, so the prior status conflict is resolved by later evidence.
- Required-anchor gate: GAP confirmed. The contract marks fix-completeness as required, the fresh-set scorer counts it as missing in run 1, and the phase records strict validation passing without that section.
- Metric procedure: mismatch confirmed. The plan and task instructions retain the raw count; the later helper applies the optional-anchor rule.

## Review Depth and Search Ledger

- Scope class: complex; strict review-depth enforcement.
- Coverage mode: graphless_fallback. Direct reads and recorded run evidence supplied the evidence.
- Required and covered bug classes: required_anchor_presence_gate; anchor_metric_procedure_alignment; c5_closeout_status_consistency.
- Deferred or blocked classes: none.
- SL-001: required_anchor_presence_gate — finding R8-P1-001. The validator contract checks marker structure and the recorded run omitted a required section while strict passed.
- SL-002: anchor_metric_procedure_alignment — finding R8-P2-001. The frozen metric/task recipe and later helper use different scoring rules.
- SL-003: c5_closeout_status_consistency — ruled out. Later phase records show the fourth set passed and the earlier failures are retained as history.

## Edge Cases

- The optional-anchor rule does not change the deciding fourth set's recorded missing-anchor values, which are zero under both the raw and adjusted checks. The procedure mismatch affects reproducibility for sets with optional task-anchor omissions.
- The validator gap is documented as outside phase 009's change scope. The template guidance was corrected, but the validator follow-up remains open.

## Files Reviewed

- specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/spec.md:53
- .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:100-109
- .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl:165-176
- specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/goal.md:155,164-168,170-179
- specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/plan.md:71-76
- specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/tasks.md:128-142
- specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/tools/justified-anchors.sh:1-18
- specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/closeout/contract-3-tasks.json:119-155
- specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh/rule-scores.txt:1-3
- specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh/diagnostic.txt:1-3
- specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/amend3/fresh2/delta.json
- specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/scratch/closeout/criteria.txt:5-8
- specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/acceptance-criteria.md:63-68
- specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/implementation-summary.md:40,66-68,128

Review verdict: CONDITIONAL