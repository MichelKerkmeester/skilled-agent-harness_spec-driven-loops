## Code Review Summary

**Files reviewed**: 2 files, 40 lines changed
**Overall assessment**: REQUESTED_CHANGES
**Baseline used**: sk-code (sk-code-review)
**Surface evidence used**: UNKNOWN

## Findings

### P0 - Critical
1. src/auth.ts:42 Missing authorization check
   - Case: a request with no session token reaches the write path and changes a user record
   - Risk: unauthenticated write path

### P1 - High
2. src/parse.ts:10 Null dereference on an empty body
   - Case: a POST with an empty body throws before validation runs
   - Risk: the handler returns 500 instead of 400

## Removal/Iteration Plan

Nothing to remove.

## Next Steps

1. Fix the auth gap at src/auth.ts:42

Not checked: behavior under concurrent writes; no test database was available

Review status: REQUESTED_CHANGES
