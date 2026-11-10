## Code Review Summary

**Files reviewed**: 1 file
**Overall assessment**: REQUEST_CHANGES

## Findings

### P1 - High
2. [path/to/file.ts:42] Missing authorization check
   - Case: a request with no session token reaches the write handler
   - Recommended fix: Enforce the guard.

Not checked: nothing material

Review status: REQUESTED_CHANGES
