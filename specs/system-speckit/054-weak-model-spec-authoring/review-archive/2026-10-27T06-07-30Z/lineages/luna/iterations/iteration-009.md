# Review Iteration 9 — Maintainability: phase 004 fill-guidance regression coverage

## Dispatcher

- Session: fanout-luna-1792949481267-fym7sk, generation 1, lineage mode new.
- Focus: compare phase 004's fill-line requirements for core and add-on templates with the lasting regression test and the implementation task evidence.
- Review target: specs/system-speckit/054-weak-model-spec-authoring.
- Route proof: Resolved route: mode=review target_agent=deep-review.
- The lineage steer.md was absent before this iteration.
- This was a static spec, test-source, and task-evidence review. No tests were run.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The fill-guidance regression test omits add-on templates** — .skilled/skills/system-spec-kit/runtime/cli/tests/template-fill-guidance.vitest.ts:5-8,49-67

   - Case: phase 004 requires one fill line under every section in four core and ten add-on templates. The test loops over only four core documents and reads only TEMPLATE_ROOT/core; its 16 cases are four levels multiplied by those four documents.
   - Evidence: add-on fill counts were checked manually in T010, while T011 runs only template-fill-guidance.vitest.ts. The test never loads templates/addons.
   - User impact: a later edit can remove or weaken fill guidance in an add-on template while this regression test remains green.
   - Recommendation: extend the fill-guidance test to cover the add-on templates at their supported levels, or add an equivalent persistent test for those templates.
   - Finding class: addon-fill-guidance-regression.
   - Scope proof: the phase specification includes all ten add-on templates and names a fill-guidance test as an in-scope deliverable.
   - Affected surfaces: optional-document templates, fill-guidance regression coverage, weak-model authoring.

## Clean Checks

- Core template coverage: PASS. The test checks each core document at Levels 1, 2, 3, and 3+ and retains the expected anchor count.
- Add-on implementation evidence: PASS for the recorded run. T010 counted the add-on fill markers and the implementation summary reports 61 fill lines across ten add-ons.
- Regression coverage: GAP confirmed. The recorded test has 16 core-only cases and no add-on template inputs.

## Review Depth and Search Ledger

- Scope class: complex; strict review-depth enforcement.
- Coverage mode: graphless_fallback. Direct reads and targeted searches supplied the evidence.
- Required and covered bug classes: addon_fill_line_coverage; phase004_test_scope_alignment.
- Deferred or blocked classes: none.
- SL-001: addon_fill_line_coverage — finding R9-P2-001. The spec includes ten add-on templates, but the recurring fill test loads only core templates.
- SL-002: phase004_test_scope_alignment — ruled out for the core surface. The 16 test cases cover four levels for each of four core docs, matching the recorded test count.

## Edge Cases

- Task T010's manual add-on counts prove the phase's initial contents, but they do not guard future edits after the task closes.
- The separate example-drift test checks rendered example alignment; it is not a fill-line check over add-on source templates.

## Files Reviewed

- specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance/spec.md:90-95
- specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance/implementation-summary.md:50,54
- specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance/tasks.md:298-303,351
- .skilled/skills/system-spec-kit/runtime/cli/tests/template-fill-guidance.vitest.ts:5-20,49-67
- .skilled/skills/system-spec-kit/runtime/cli/tests/example-drift.vitest.ts

Review verdict: CONDITIONAL