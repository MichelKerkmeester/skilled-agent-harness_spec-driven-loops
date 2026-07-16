# Iteration 008: Maintainability — Naming, Exports, Test Architecture

## Focus
- Dimension: maintainability
- Files reviewed: `.opencode/plugins/tests/mk-goal-export-contract.test.cjs`, `.opencode/plugins/tests/`, `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`, `.opencode/plugins/mk-goal.js`
- Scope: Inspect test architecture, export contract, and naming conventions.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.13 (4 P2 * 1 = 4; cumulative weighted = 29; 4/29)

## Findings

### P2, Suggestion
- **F027**: `__test` seam list is duplicated, `.opencode/plugins/tests/mk-goal-export-contract.test.cjs:28-48`. The export-contract test hard-codes the expected `__test` keys. Adding or removing a test seam requires editing both `mk-goal.js:2637-2655` and the test file; there is no single source of truth.
- **F028**: `speckit-goal-offer-contract.test.cjs` is not matched by the documented test glob, `.opencode/plugins/tests/`. The verification section in `goal_plugin.md` and the phase 016 scope cite `.opencode/plugins/tests/mk-goal-*.test.cjs`, which excludes `speckit-goal-offer-contract.test.cjs`.
- **F029**: Verification commands use per-file `node` invocation instead of the `node --test` runner, `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:99-111`. The test files use `node:test` subtests; running them individually still works but loses the runner's aggregated output and is not what the test architecture restructure phase (018) targets.
- **F030**: `GoalError` codes are string literals without a centralized enum, `.opencode/plugins/mk-goal.js:166-173`. Codes such as `MISSING_SESSION_ID`, `INVALID_OBJECTIVE`, and `PLUGIN_DISABLED` appear inline across the file, making rename/refactor error-prone.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | - | No new contradictions |
| checklist_evidence | pass | hard | - | No checklist checked |
| feature_catalog_code | pass | advisory | - | No drift |
| playbook_capability | pending | advisory | - | Not exercised |

## Assessment
- New findings ratio: 0.13
- Dimensions addressed: [maintainability]
- Novelty justification: Four new P2 findings on test architecture and naming.

## Ruled Out
- The `node:test` subtest migration itself is explicitly out of scope for phase 016 and tracked in phase 018.
- The `__test` seam is an intentional testing surface, not a security exposure.

## Dead Ends
- Searching for circular imports between test helpers and the plugin found none.

## Recommended Next Focus
Correctness (plugin command routing): verify command-to-tool mapping, budget parsing edge cases, and error-code propagation.

Review verdict: PASS
