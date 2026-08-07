# Iteration 009: Correctness — Plugin Command Routing

## Focus
- Dimension: correctness
- Files reviewed: `.opencode/commands/goal_opencode.md`, `.opencode/plugins/mk-goal.js`
- Scope: Verify command-to-tool routing, budget parsing, and failure-envelope behavior.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 2
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=1
- New findings ratio: 0.09 (3 P2 * 1 = 3; refined F016 1*1*0.5 = 0.5; total 3.5; cumulative weighted = 33; 3.5/33)

## Findings

### P2, Suggestion
- **F031**: Command budget parsing only handles trailing `--budget N`, `.opencode/commands/goal_opencode.md:63-66`. The instructions explicitly remove a *trailing* `--budget N` suffix. A user who writes `/goal set --budget 100 fix the bug` will have `--budget` parsed as the budget value, fail validation, and never reach the tool. This is a command-routing edge case not covered by the contract.
- **F032**: Command output contract summary line omits `show` from the ACTION list, `.opencode/commands/goal_opencode.md:30-33`. The summary says `ACTION=<set|clear|complete|pause|resume|history|doctor|health|show>` but the prose in the same section treats `show` as the default/empty-args path. The list should include `show` explicitly or clarify it is the default.
- **F033**: Failure envelope normalizes unknown actions to `show`, `.opencode/plugins/mk-goal.js:2380-2388`. `failureLines` maps an unrecognized action to `'show'`. Because the command router should never send an unknown action to the tool, this fallback is defensive but produces a misleading `ACTION=show` in a failure that originated from a different action.

### Refined findings
- **F016-R1**: The AI-driven `--budget` parsing (iteration 004) has a concrete edge case: non-trailing budgets are rejected at command level rather than parsed correctly.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | goal_opencode.md:30-33 vs goal_opencode.md:61-74 | Minor wording inconsistency, no hard contradiction |
| checklist_evidence | pass | hard | - | No checklist checked |
| feature_catalog_code | pass | advisory | - | No drift |
| playbook_capability | pending | advisory | - | Not exercised |

## Assessment
- New findings ratio: 0.09
- Dimensions addressed: [correctness]
- Novelty justification: Three new P2 routing/contract findings and one P2 refinement.

## Ruled Out
- Action routing table is internally consistent between command doc and tool schema.
- `set` with valid objective and trailing budget routes correctly to `mk_goal`.

## Dead Ends
- No evidence that unknown actions can reach the tool in normal command flow.

## Recommended Next Focus
Maintainability (doc/spec drift + polish): final pass over goal_plugin.md, status output fields, and the duplicate alias issue.

Review verdict: PASS
