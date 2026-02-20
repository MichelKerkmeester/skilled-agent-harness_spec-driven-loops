---
description: "ALWAYS/NEVER/ESCALATE rules for implementation, testing/debugging, and verification phases"
---
# Rules

Behavioral constraints for each phase of the development lifecycle.

## Phase 1: Implementation (Universal)

### ALWAYS
- Follow stack patterns from `references/{category}/{stack}/`
- Validate all inputs and external boundaries
- Handle errors with clear, actionable messages
- Keep implementation aligned with existing architecture

### NEVER
- Skip input validation
- Hide failures with silent catch blocks
- Mix conflicting stack patterns in one change
- Leave debug-only code in production paths

### ESCALATE IF
- Required pattern is missing or contradictory
- Security-sensitive behavior is unclear
- Change introduces interface-breaking behavior

## Phase 2: Testing/Debugging (Universal)

### ALWAYS
- Reproduce issue before fixing
- Trace symptoms back to root cause
- Test one meaningful change at a time
- Re-run relevant tests after each fix

### NEVER
- Apply multi-fix batches without isolation
- Patch symptoms only
- Skip post-fix verification
- Continue beyond three failed attempts without reframing

### ESCALATE IF
- Bug cannot be reproduced reliably
- Failure depends on production-only conditions
- Root cause is in third-party dependency internals

## Phase 3: Verification (MANDATORY)

### ALWAYS
- Run stack test/lint/build commands
- Document what was actually verified
- Include known limitations if full verification is not possible

### NEVER
- Claim `works` without command evidence
- Use `should work` as a completion statement
- Skip verification because change appears small

### ESCALATE IF
- Full test suite is unavailable
- Verification requires unavailable environments
- Coverage is insufficient for risk level

## Cross References
- [[how-it-works]] - Phase definitions and workflows
- [[success-criteria]] - Quality gates tied to these rules
- [[integration-points]] - Stack resources and navigation guide