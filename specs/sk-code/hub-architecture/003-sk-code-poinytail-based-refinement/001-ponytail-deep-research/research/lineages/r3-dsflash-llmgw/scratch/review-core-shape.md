## Code Review Summary

**Files reviewed**: 1 file
**Overall assessment**: REQUEST_CHANGES
**Baseline used**: sk-code

## Findings

### 2 [P1] Missing authorization check
- Case: a request with no session token reaches the write handler
- File: path/to/file.ts:42
- Evidence: Request handling reaches the write path before role validation.
- User impact: any caller can write records without a role check.
- Finding class: cross-consumer
- Scope proof: rg shows the write handler is the only unchecked consumer.
- Recommendation: Enforce the existing permission guard before mutation.

Not checked: nothing material

Review status: REQUESTED_CHANGES
