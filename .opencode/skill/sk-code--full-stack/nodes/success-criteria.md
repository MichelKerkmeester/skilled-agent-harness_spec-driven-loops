---
description: "Completion gates, quality checks, and quick reference for all three development phases"
---
# Success Criteria

Defines what success looks like for each phase and provides the verification quick reference.

## Phase 1: Implementation

Implementation is successful when:
- Code follows stack conventions
- Inputs are validated and failure paths are handled
- New behavior is covered by tests where appropriate
- Build passes for the stack

Quality gates:
- Does this match patterns in stack references?
- Are edge-case and invalid-input paths covered?

## Phase 2: Testing/Debugging

Debugging is successful when:
- Root cause is identified
- Fix addresses cause rather than symptom
- Relevant tests pass after the fix
- Linting and static checks are clean

Quality gates:
- Can root cause be explained clearly?
- Do before/after results prove the fix?

## Phase 3: Verification

Verification is successful when:
- Stack test/lint/build commands pass
- Results are documented in completion message
- Remaining limitations are explicit

Quality gates:
- Which commands were run?
- Were outputs clean?
- Is there enough evidence to claim completion?

## Quick Reference: Universal Workflow

1. Detect stack from marker files
2. Classify intent (implementation/debugging/testing/verification)
3. Load stack resources from `references/{category}/{stack}/`
4. Apply fix/feature with stack patterns
5. Run stack test/lint/build commands
6. Document verification evidence

## Quick Reference: Stack Commands

| Stack        | Test            | Lint                | Build             |
| ------------ | --------------- | ------------------- | ----------------- |
| GO           | `go test ./...` | `golangci-lint run` | `go build ./...`  |
| NODEJS       | `npm test`      | `npx eslint .`      | `npm run build`   |
| REACT        | `npm test`      | `npx eslint .`      | `npm run build`   |
| REACT_NATIVE | `npm test`      | `npx eslint .`      | `npx expo export` |
| SWIFT        | `swift test`    | `swiftlint`         | `swift build`     |

## Verification Checklist (Quick)

```text
[ ] Stack detected from marker files
[ ] Correct standards loaded for stack
[ ] Relevant tests passing
[ ] Linting clean
[ ] Build successful (if applicable)
[ ] Verification evidence documented
```

## Cross References
- [[rules]] - ALWAYS/NEVER/ESCALATE constraints
- [[how-it-works]] - Phase workflows and commands
- [[integration-points]] - Stack resource paths
