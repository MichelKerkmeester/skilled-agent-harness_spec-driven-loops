# Review Iteration 10 — Maintainability: phase 005 authoring routes and sync guard

## Dispatcher

- Session: fanout-luna-1792949481267-fym7sk, generation 1, lineage mode new.
- Focus: trace the four current authoring intents through the router and verify that the sync guard positively protects the checklist's filled-example route.
- Review target: specs/system-speckit/054-weak-model-spec-authoring.
- Route proof: Resolved route: mode=review target_agent=deep-review.
- The lineage steer.md was absent before this iteration.
- This was a static router, guard, checklist, and test review. No guard or tests were run.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The checklist sync guard does not require a valid example route** — .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:109-114

   - Case: the guard's checklist check fails only when one exact obsolete templates-root sentence is present. If the rendered-example instruction is deleted or changed to another invalid destination, the check takes its PASS branch.
   - Evidence: the current checklist has a positive rendered-example route at line 36, but the guard does not search for it. Its Vitest wrapper only runs the guard and expects CARD SYNC OK.
   - User impact: a future checklist edit can remove the example guidance without failing the phase's card-sync regression check.
   - Recommendation: assert the required rendered-example route or a defined set of valid destinations, with a test that proves both a missing route and the old gated-root route fail.
   - Finding class: checklist-example-route-assertion.
   - Scope proof: phase 005 says one command must catch drift among the card, router, inventory, and checklist so later edits cannot quietly undo the route.
   - Affected surfaces: spec-folder checklist, card-sync guard, guard regression test.

## Clean Checks

- Authoring intents: PASS. PLAN, IMPLEMENT, INTAKE, and TEMPLATE_AUTHORING each list the authoring card in the current skill router, and the guard has a corresponding intent check.
- Current checklist route: PASS. The checklist sends readers to a rendered example or a fresh create.sh scaffold and warns against copying the gated template source.
- Guard coverage: GAP confirmed. The guard only rejects one exact stale sentence and does not require the current positive route.

## Review Depth and Search Ledger

- Scope class: complex; strict review-depth enforcement.
- Coverage mode: graphless_fallback. Direct reads and exact searches supplied the evidence.
- Required and covered bug classes: all_authoring_intents_load_card; checklist_example_route_assertion; guard_wrapper_scope.
- Deferred or blocked classes: none.
- SL-001: all_authoring_intents_load_card — ruled out. The current router contains the card in all four authoring intent lists.
- SL-002: checklist_example_route_assertion — finding R10-P2-001. The checklist is correct today, but the guard only blocks one exact obsolete sentence and has no positive assertion.
- SL-003: guard_wrapper_scope — ruled out as a runner mismatch. The wrapper runs the guard and checks CARD SYNC OK; it inherits the guard's narrow checklist assertion.

## Edge Cases

- The current checklist route is correct. The finding concerns what the guard will accept after a future edit.
- The guard's other checks cover card existence and length, four intent loads, on-demand guide placement, and leaf inventory entries.

## Files Reviewed

- specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/spec.md:234-238
- specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/acceptance-criteria.md:55-59
- .skilled/skills/system-spec-kit/SKILL.md:173-176,191-196,232-235,270-273
- .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:65-85,109-114
- .skilled/skills/system-spec-kit/runtime/cli/tests/card-sync.vitest.ts:11-14
- .skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md:35-36

Review verdict: CONDITIONAL