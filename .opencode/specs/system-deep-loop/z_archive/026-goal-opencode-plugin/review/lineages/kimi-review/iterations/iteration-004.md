# Iteration 004: Maintainability — Tests, Docs, Dead Code

## Focus
- Dimension: maintainability
- Files reviewed: `.opencode/plugins/mk-goal.js`, `.opencode/commands/goal_opencode.md`, `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`
- Scope: Identify dead code, duplicate fields, doc/test drift, and API inconsistencies.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 3
- New findings: P0=0 P1=0 P2=6
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.35 (6 P2 * 1 = 6; cumulative weighted = 17; 6/17)

## Findings

### P2, Suggestion
- **F012**: `executeGoalAction` default action is dead code, `.opencode/plugins/mk-goal.js:2391`. It maps an unknown `args.action` to `'show'`, but the command router in `goal_opencode.md` only dispatches known actions and treats any other non-empty input as a `set` objective. The fallback is unreachable in production.
- **F013**: Duplicate budget-prefixed status aliases create parser ambiguity, `.opencode/plugins/mk-goal.js:2327-2329`. `goalStateLines` emits both canonical `tokens_used`/`token_budget`/`usage_source` and legacy `budget_tokens_used`/`budget_token_budget`/`budget_usage_source`. The plugin contract in `goal_plugin.md:83-87` already recommends the canonical names.
- **F014**: `executeGoalStatus` lacks the `includeInjectionPreview` option that `executeGoalAction` supports, `.opencode/plugins/mk-goal.js:2441-2453`. This inconsistency means status can never suppress the injection preview, even though the helper exists for other actions.
- **F015**: `goal_plugin.md` verification list is stale, `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:99-111`. It lists seven test files, but the suite now contains ten files including `mk-goal-capabilities.test.cjs`, `mk-goal-continuation.test.cjs`, and `speckit-goal-offer-contract.test.cjs`.
- **F016**: Command budget parsing is implementation-defined by AI instruction, `.opencode/commands/goal_opencode.md:63-66`. The command relies on the executing agent to parse `--budget N` and reject invalid values, rather than a deterministic parser. This makes the contract fragile across models.
- **F017**: `GOAL_ACTIONS` includes later-phase verbs without provenance markers, `.opencode/plugins/mk-goal.js:156`. `history`, `doctor`, `health`, and `resume` were added after the original spec scope but the array carries no comment or deprecation path.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | - | No new spec contradictions |
| checklist_evidence | pass | hard | - | No checklist checked this iteration |
| feature_catalog_code | pass | advisory | goal_plugin.md:99-111 | Test list drift is doc-only |
| playbook_capability | pending | advisory | - | Not exercised |

## Assessment
- New findings ratio: 0.35
- Dimensions addressed: [maintainability]
- Novelty justification: Six new P2 findings on dead code, duplicate output, API inconsistency, and doc drift.

## Ruled Out
- The `__test` export seam is intentionally exposed for unit tests and is not itself a maintainability defect.
- Code style and alignment checks passed in the sampled test run.

## Dead Ends
- Searching for unused imports or unreachable functions beyond the default action found none.

## Recommended Next Focus
Return to correctness for edge cases and error handling: `session.idle` no-sessionID branch, provider retry logic, and budget boundary conditions.

Review verdict: PASS
