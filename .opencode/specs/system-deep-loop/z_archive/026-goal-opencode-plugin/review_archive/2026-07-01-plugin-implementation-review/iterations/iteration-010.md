# Deep Review Iteration 010

## Dimension

Maintainability -- PASS B: UX gaps and automation/integration gaps.

## Files Reviewed

- `.opencode/plugins/mk-goal.js:87` -- option/env normalization for goal plugin controls.
- `.opencode/plugins/mk-goal.js:95` -- `MK_GOAL_PLUGIN_DISABLED` maps to `options.enabled`.
- `.opencode/plugins/mk-goal.js:433` -- `MK_GOAL_AUTONOMY` read path.
- `.opencode/plugins/mk-goal.js:835` -- `setGoal` mutation path.
- `.opencode/plugins/mk-goal.js:843` -- same-objective handling.
- `.opencode/plugins/mk-goal.js:847` -- same active/paused objective branch.
- `.opencode/plugins/mk-goal.js:851` -- same-objective update return shape.
- `.opencode/plugins/mk-goal.js:864` -- replacement/new goal branch.
- `.opencode/plugins/mk-goal.js:1250` -- continuation disabled gate.
- `.opencode/plugins/mk-goal.js:1402` -- tool status envelope renderer.
- `.opencode/plugins/mk-goal.js:1412` -- active-goal output fields.
- `.opencode/plugins/mk-goal.js:1454` -- tool action executor lacks disabled-mode guard.
- `.opencode/plugins/mk-goal.js:1620` -- injection transform checks `options.enabled`.
- `.opencode/commands/goal_opencode.md:39` -- command routes show/set/clear/complete/pause to plugin tools.
- `.opencode/commands/goal_opencode.md:63` -- command prints tool result unchanged.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:645` -- goal-plugin env section.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:651` -- `MK_GOAL_PLUGIN_DISABLED` documentation.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:652` -- `MK_GOAL_AUTONOMY` documentation.
- `.opencode/hooks/pre-commit:36` -- installed hook gates only comment hygiene and agent mirror sync.
- `.opencode/scripts/git-hooks/pre-commit:57` -- broader hook gates prompt-card/MCP/tool-ownership drift, not goal command/env drift.
- `.opencode/package.json:1` -- no npm scripts for goal-command or goal-env drift checks.

## Findings by Severity

### P0

None.

### P1

#### DR-010-P1-001 [P1] `MK_GOAL_PLUGIN_DISABLED` documentation overstates the disable boundary

- File: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:651`
- Claim: The documented disable flag says it disables goal injection and goal plugin behavior, but the implementation only uses `options.enabled` to suppress passive injection and autonomous continuation; `mk_goal` tool mutations still execute and can still write goal state.
- Evidence: `ENV_REFERENCE.md:651` documents `MK_GOAL_PLUGIN_DISABLED` as "Disables goal injection and goal plugin behavior". The flag is read into `enabled` at `.opencode/plugins/mk-goal.js:95`, and `maybeContinueGoal` suppresses continuation when disabled at `.opencode/plugins/mk-goal.js:1250`. The chat system transform also returns early when disabled at `.opencode/plugins/mk-goal.js:1620`. However, `executeGoalAction` begins at `.opencode/plugins/mk-goal.js:1454`, derives the action at `.opencode/plugins/mk-goal.js:1455`, and still calls `setGoal`, `clearGoal`, `markGoalStatus`, or `readGoal` at `.opencode/plugins/mk-goal.js:1459-1482` without checking `options.enabled`.
- Counterevidence sought: Checked the live command router and plugin executor for an alternate disabled-mode guard. `.opencode/commands/goal_opencode.md:49-59` routes directly to `mk_goal`/`mk_goal_status`, and the tool executor path has no disabled guard before mutations.
- Alternative explanation: The intended contract might be "disable passive injection/continuation only" while keeping manual goal tools active. If so, the code can be correct, but the env reference remains misleading for operators.
- Final severity: P1, because a documented operator kill switch that does not stop documented plugin behavior can leave state-mutating commands active during troubleshooting or rollback.
- Confidence: 0.89.
- Downgrade trigger: Downgrade to P2 if the product owner clarifies that `MK_GOAL_PLUGIN_DISABLED` intentionally disables only injection/autonomy and documentation is narrowed to that contract.
- Finding class: cross-consumer / config-contract drift.
- Scope proof: Exact grep for `MK_GOAL` shows the env reads in `.opencode/plugins/mk-goal.js:33-35` and `.opencode/plugins/mk-goal.js:88-91`, plus ENV_REFERENCE documentation at `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:651-657`; direct read of executor and transform paths confirms only injection/continuation honor `enabled`.
- Recommendation: Either make `executeGoalAction`/`executeGoalStatus` fail closed when disabled, or rewrite the env reference to explicitly say the flag disables injection and autonomous continuation while leaving manual tool commands available.

### P2

#### DR-010-P2-001 [P2] `/goal set` output does not tell users whether it created, replaced, or merely refreshed a goal

- File: `.opencode/plugins/mk-goal.js:847`
- Evidence: When the same objective is set against an existing active or paused goal, `setGoal` returns an updated current goal at `.opencode/plugins/mk-goal.js:847-862`; when the objective differs, it creates a new goal at `.opencode/plugins/mk-goal.js:864`. Both paths are rendered through the same `STATUS=OK ACTION=set` envelope in `goalStateLines` at `.opencode/plugins/mk-goal.js:1412-1442`, and the command prints that unchanged per `.opencode/commands/goal_opencode.md:63-74`. There is no `created`, `replaced`, `refreshed`, or `previous_goal_id` field.
- Finding class: UX friction / instance-only.
- Scope proof: Direct read of `setGoal`, `goalStateLines`, and the command output contract shows one generic set envelope for same-objective refreshes and replacement creates.
- Recommendation: Add a terse mutation-result field such as `mutation=created|replaced|refreshed` and, for replacement, optionally `previous_goal_id=<id>`.

## Traceability Checks

- `spec_code`: Partial. Live env reads for `MK_GOAL_AUTONOMY` and max-length variables are discoverable in `ENV_REFERENCE.md:651-657` and match the broad code read sites; `MK_GOAL_PLUGIN_DISABLED` wording does not match the full tool behavior boundary.
- `checklist_evidence`: Not applicable. Prior state records these scoped phase folders as Level 1 packets without `checklist.md`.
- `feature_catalog_code`: Duplicate of prior active drift. Current grep still shows stale command references in feature catalogs and playbooks, but DR-008/DR-009 already cover those surfaces; this iteration did not mint a duplicate finding.
- `playbook_capability`: Duplicate of prior active drift. Current grep still shows stale `/goal` and `.opencode/commands/goal.md` references, already covered by DR-008 and DR-009 automation gaps.
- `automation/integration`: No `.github/workflows/*` files were found. Existing pre-commit hooks cover comment hygiene, agent mirror sync, prompt-card sync, MCP mutation-class, and tool ownership, but not command-filename drift, goal env-doc drift, or RICCE metadata drift.
- `code_graph`: Stale. `code_graph_status` reports `freshness=stale`, so this pass used graphless fallback with direct reads, Glob, and exact Grep.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. One new P1 and one new P2 were found. Prior P1s remain active, and the operator guidance says to continue toward the 15-iteration ceiling while P1s are still surfacing.

## Next Dimension

Maintainability remains worth another pass, focused on remediation prioritization and any remaining first-run/runtime-operator feedback gaps not already covered by DR-001 through DR-010.

Review verdict: CONDITIONAL
