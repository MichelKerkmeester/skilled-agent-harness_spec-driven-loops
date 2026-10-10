## Code Review Summary

**Files reviewed**: 2 files, 40 lines changed
**Overall assessment**: REQUESTED_CHANGES
**Baseline used**: sk-code (sk-code-review)
**Surface evidence used**: UNKNOWN

## Findings

### 1 [P0] Missing authorization check
- Case: a request with no session token reaches the write handler and changes a user record
- File: src/auth.ts:42

### 1 [P1] Null dereference on an empty body
- Case: a POST with an empty body throws before validation runs
- File: src/parse.ts:10

## Next Steps

1. Fix the auth gap at src/auth.ts:42

Not checked: behavior under concurrent writes; no test database was available

Review status: REQUESTED_CHANGES
