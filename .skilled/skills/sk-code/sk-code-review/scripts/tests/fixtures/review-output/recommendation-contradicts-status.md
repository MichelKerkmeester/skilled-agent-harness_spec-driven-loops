## PR Review: Guard the empty request body

**Recommendation**: APPROVED
**Advisory score**: 74/100 (advisory only, never the verdict)
**Overall assessment**: REQUESTED_CHANGES
**Files reviewed**: 2 files, 40 lines changed
**Baseline used**: sk-code (sk-code-review)
**Surface evidence used**: UNKNOWN
**Quality gate evidence**: absent
Rule sources: none

## Findings

### P1 - High
1. src/parse.ts:10 Null dereference on an empty body
   - Case: a POST with an empty body throws before validation runs
   - Risk: the handler returns 500 instead of 400
   - Recommendation: approve the change once the guard lands

### P2 - Suggestion
2. src/parse.ts:30 Magic number for the size limit
   - Case: the 1048576 literal hides the limit's unit and reason
   - Risk: a later edit changes the limit without noticing its meaning

## Removal/Iteration Plan

Nothing to remove.

## Next Steps

1. Guard the empty body at src/parse.ts:10

Not checked: behavior under concurrent writes; no test database was available

Review status: REQUESTED_CHANGES
