# Deviation Rules

GoopSpec uses a 4-rule deviation system to handle unexpected situations during execution. These rules determine when the agent can auto-fix issues vs when to stop and ask the user.

## Rule 1: Bug Fixes (Auto-Fix)

**Trigger:** Wrong logic, type errors, runtime errors, security vulnerabilities in existing code.

**Action:** Fix immediately without asking.

**Examples:**
- Type mismatch causing compilation error
- Null pointer dereference
- SQL injection vulnerability
- Off-by-one errors
- Missing error handling causing crashes

**Rationale:** Bugs are unambiguously wrong. Fixing them improves quality without changing intent.

## Rule 2: Missing Critical Functionality (Auto-Fix)

**Trigger:** Implementation lacks essential error handling, validation, or security checks that any professional implementation would include.

**Action:** Add the missing functionality without asking.

**Examples:**
- Missing input validation on user data
- Missing authentication checks on protected routes
- Missing error boundaries in React components
- Missing transaction rollback on failure
- Missing rate limiting on API endpoints

**Rationale:** These are implicit requirements that experienced developers always include.

## Rule 3: Blocking Issues (Auto-Fix)

**Trigger:** Missing dependencies, broken imports, configuration errors, environment issues that prevent execution.

**Action:** Fix to unblock progress without asking.

**Examples:**
- Missing npm package in dependencies
- Broken import path
- Missing environment variable with obvious default
- TypeScript config preventing compilation
- Missing build script

**Rationale:** These are technical blockers, not design decisions.

## Rule 4: Architectural Decisions (STOP and Ask)

**Trigger:** Schema changes, framework switches, new technology introduction, significant structural changes.

**Action:** STOP execution and ask the user for a decision.

**Examples:**
- Database schema modification
- Switching from REST to GraphQL
- Adding a new major dependency (ORM, state management)
- Changing authentication mechanism
- Restructuring project layout
- Changing data models

**Rationale:** These decisions have long-term consequences and require human judgment.

## Deviation Log

When a deviation occurs, log it to the ADL (Automated Decision Log) with:
- Rule number triggered
- Description of the issue
- Action taken (auto-fix or user decision)
- Files modified
- Commit hash (if applicable)

## Implementation Notes

1. **Confidence threshold:** If uncertain which rule applies, default to Rule 4 (ask user).
2. **Scope check:** Deviations should not modify files outside the active spec scope.
3. **Commit atomically:** Each deviation fix should be a separate atomic commit.
4. **Document rationale:** Always explain WHY in the commit message and ADL entry.
