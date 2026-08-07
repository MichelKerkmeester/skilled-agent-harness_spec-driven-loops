# Iteration 010: Maintainability — Doc/Spec Drift + Polish

## Focus
- Dimension: maintainability
- Files reviewed: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`, `.opencode/commands/goal_opencode.md`, `.opencode/plugins/mk-goal.js`
- Scope: Final polish pass on documentation completeness and constant clarity.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 3
- New findings: P0=0 P1=0 P2=4
- Refined findings: P0=0 P1=0 P2=1
- New findings ratio: 0.11 (4 P2 * 1 = 4; refined 1*1*0.5 = 0.5; total 4.5; cumulative weighted = 37; 4.5/37)

## Findings

### P2, Suggestion
- **F034**: `goal_plugin.md` output field table omits several emitted fields, `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:64-78`. `goalStateLines` emits `blocked_by_prompt`, `continuation_suppressed`, `continuation_attempts`, and `continuation_suppressed_reason`, none of which appear in the documented output field table.
- **F035**: `goal_opencode.md` output summary omits the `mutation=` field, `.opencode/commands/goal_opencode.md:49`. The field is described in prose (`goal_opencode.md:49`) but not in the envelope summary at `goal_opencode.md:30-33` or `goal_opencode.md:80-84`.
- **F036**: `PROMPT_OVERHEAD_CHARS` is a magic constant without derivation, `.opencode/plugins/mk-goal.js:38`. The value `1900` determines the objective budget inside `buildEnhancedGoalPrompt` but has no comment explaining how it was chosen.
- **F037**: `maxAutoTurns` clamping to the env value is undocumented, `.opencode/plugins/mk-goal.js:2015`. `reserveContinuationTurn` clamps `current.maxAutoTurns` to the current env cap, but `goal_plugin.md:45-62` describes `MK_GOAL_MAX_AUTO_TURNS` only as the default for new goals.

### Refined findings
- **F013-R1**: Duplicate budget-prefixed aliases remain in the final status output. The canonical `tokens_used`/`token_budget`/`usage_source` fields are emitted alongside the legacy `budget_*` aliases, increasing parser surface area.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | - | No new contradictions |
| checklist_evidence | pass | hard | - | No checklist checked |
| feature_catalog_code | pass | advisory | - | No drift |
| playbook_capability | pending | advisory | - | Not exercised |

## Assessment
- New findings ratio: 0.11
- Dimensions addressed: [maintainability]
- Novelty justification: Four new P2 doc/constant findings and one P2 refinement.

## Ruled Out
- No new dead code or unreachable branches detected beyond prior findings.
- No new spec contradictions.

## Dead Ends
- Searching for undocumented environment variables beyond those in the contract table found none.

## Recommended Next Focus
Synthesis: compile findings, deduplicate, and produce the final review report.

Review verdict: PASS
