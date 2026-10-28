## Code Review Summary

**Files reviewed**: 2 files, 40 lines changed
**Overall assessment**: REQUESTED_CHANGES
**Baseline used**: sk-code (sk-code-review)
**Surface evidence used**: UNKNOWN
**Quality gate evidence**: absent
Rule sources: hub:sk-code/shared/references/universal/code-quality-standards.md, .skilled/skills/sk-code/sk-code-quality/repository/checklists/house.md. Overrides: review.function-length replace from .skilled/skills/sk-code/sk-code-quality/repository/checklists/house.md; floor.documentation none from .skilled/skills/sk-code/sk-code-quality/repository/checklists/house.md; hygiene.issue none from .skilled/skills/sk-code/sk-code-quality/repository/quality.json. Refused: none. Ignored: none. Conflicts: none

## Findings

### P1 - High
1. src/parse.ts:10 Null dereference on an empty body
   - Case: a POST with an empty body throws before validation runs
   - Risk: the handler returns 500 instead of 400

### P2 - Suggestion
2. src/parse.ts:30 Function longer than the repository's 60-line limit
   - Case: parseBody runs 72 lines, past the limit the repository checklist sets in place of the default
   - Risk: harder to change safely

## Removal/Iteration Plan

Nothing to remove.

## Next Steps

1. Guard the empty body at src/parse.ts:10

Not checked: behavior under concurrent writes; no test database was available

Review status: REQUESTED_CHANGES
