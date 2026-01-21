# Verification Checklist: [YOUR_VALUE_HERE: Feature-Name]

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-level2-verbose | v2.0-verbose -->

---

## Verification Protocol

[YOUR_VALUE_HERE: Understand the priority system before verifying items.]

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

**How to mark items:**
- `[ ]` - Not yet verified
- `[x]` - Verified with evidence (add note explaining how verified)
- `[~]` - Deferred (P1/P2 only) - add approval note for P1

[example:
- [x] CHK-010 [P0] Code passes lint/format checks - `npm run lint` passes with 0 errors
- [~] CHK-042 [P2] README updated - deferred, not user-facing feature]

---

## Pre-Implementation

[YOUR_VALUE_HERE: Verify these items before starting implementation. They ensure you have what you need to succeed.]

- [ ] CHK-001 [P0] Requirements documented in spec.md
  [NEEDS CLARIFICATION: Are requirements complete?
    (a) Yes - all requirements in spec.md with acceptance criteria
    (b) Partial - some requirements need clarification (list them)
    (c) No - requirements not yet documented]

- [ ] CHK-002 [P0] Technical approach defined in plan.md
  [NEEDS CLARIFICATION: Is the technical approach clear?
    (a) Yes - architecture and phases documented
    (b) Partial - high-level approach but details TBD
    (c) No - plan.md not yet created]

- [ ] CHK-003 [P1] Dependencies identified and available
  [YOUR_VALUE_HERE: List dependencies and their status]
  [example: Billing API - available, Design mockups - pending]

---

## Code Quality

[YOUR_VALUE_HERE: These items ensure the code meets quality standards.]

- [ ] CHK-010 [P0] Code passes lint/format checks
  [YOUR_VALUE_HERE: What command verifies this? e.g., "npm run lint", "black --check ."]
  [example: Run `npm run lint && npm run format:check` - both must pass with 0 errors]

- [ ] CHK-011 [P0] No console errors or warnings
  [YOUR_VALUE_HERE: What environments to check? Browser console, terminal output?]
  [example: Open browser DevTools, verify no red errors or yellow warnings in Console tab]

- [ ] CHK-012 [P1] Error handling implemented
  [NEEDS CLARIFICATION: What error scenarios are covered?
    (a) Network errors - retry logic, user feedback
    (b) Validation errors - inline form feedback
    (c) Server errors - graceful degradation, error boundary
    (d) All of the above]

- [ ] CHK-013 [P1] Code follows project patterns
  [YOUR_VALUE_HERE: What patterns should be followed?]
  [example: Component structure matches src/components/existing/, hooks in src/hooks/, types in src/types/]

---

## Testing

[YOUR_VALUE_HERE: These items verify the implementation works correctly.]

- [ ] CHK-020 [P0] All acceptance criteria met
  [YOUR_VALUE_HERE: Reference acceptance criteria from spec.md and verify each]
  [example: REQ-001 verified: Dashboard shows daily count. REQ-002 verified: CSV export works.]

- [ ] CHK-021 [P0] Manual testing complete
  [YOUR_VALUE_HERE: What user flows were tested?]
  [NEEDS CLARIFICATION: What test scenarios are required?
    (a) Happy path only - primary user flow
    (b) Happy path + key variations - multiple inputs/states
    (c) Comprehensive - all documented scenarios
    (d) Browser matrix - multiple browsers/devices]

- [ ] CHK-022 [P1] Edge cases tested
  [YOUR_VALUE_HERE: What edge cases were verified? Reference spec.md L2: Edge Cases section]
  [example: Empty state - shows helpful message. Timeout - shows retry. Large data - handles 5000 rows]

- [ ] CHK-023 [P1] Error scenarios validated
  [YOUR_VALUE_HERE: What error scenarios were tested?]
  [example: API down - shows cached data. Network offline - shows error with retry. Invalid input - shows validation]

---

## Security

[YOUR_VALUE_HERE: These items ensure the feature is secure.]

- [ ] CHK-030 [P0] No hardcoded secrets
  [YOUR_VALUE_HERE: Verify no API keys, passwords, tokens in code]
  [example: Grep for common patterns: `grep -r "api_key\|password\|secret\|token" --include="*.ts" src/`]

- [ ] CHK-031 [P0] Input validation implemented
  [YOUR_VALUE_HERE: What user inputs are validated? How?]
  [NEEDS CLARIFICATION: What validation is in place?
    (a) Client-side only - form validation, type checking
    (b) Server-side only - API validates all inputs
    (c) Both client and server - defense in depth
    (d) N/A - no user input in this feature]

- [ ] CHK-032 [P1] Auth/authz working correctly
  [YOUR_VALUE_HERE: Verify authentication and authorization]
  [NEEDS CLARIFICATION: What auth verification is needed?
    (a) Verify unauthenticated access is blocked
    (b) Verify user can only access their own data
    (c) Verify role-based permissions work
    (d) N/A - feature doesn't require auth]

---

## Documentation

[YOUR_VALUE_HERE: These items ensure documentation is complete.]

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
  [YOUR_VALUE_HERE: Verify all spec folder docs reflect final implementation]
  [example: spec.md status updated to "Complete", plan.md phases match actual implementation]

- [ ] CHK-041 [P1] Code comments adequate
  [YOUR_VALUE_HERE: Are complex sections documented?]
  [NEEDS CLARIFICATION: What commenting standard applies?
    (a) JSDoc/docstrings on public APIs
    (b) Inline comments on complex logic
    (c) README in each module
    (d) Minimal - self-documenting code preferred]

- [ ] CHK-042 [P2] README updated (if applicable)
  [YOUR_VALUE_HERE: Does project README need updates?]
  [NEEDS CLARIFICATION: Is README update needed?
    (a) Yes - new feature needs documentation
    (b) No - internal change, no user impact
    (c) Separate doc - feature has its own documentation]

---

## File Organization

[YOUR_VALUE_HERE: These items ensure files are organized correctly.]

- [ ] CHK-050 [P1] Temp files in scratch/ only
  [YOUR_VALUE_HERE: Verify no temp files outside scratch/]
  [example: `ls specs/[spec-folder]/` - no debug files, logs, or test data in root]

- [ ] CHK-051 [P1] scratch/ cleaned before completion
  [YOUR_VALUE_HERE: Remove all temporary files from scratch/]
  [example: `rm -rf specs/[spec-folder]/scratch/*` or verify scratch/ is empty]

- [ ] CHK-052 [P2] Findings saved to memory/
  [YOUR_VALUE_HERE: Important context for future sessions preserved?]
  [NEEDS CLARIFICATION: What should be saved to memory/?
    (a) Key decisions and rationale
    (b) Debugging insights
    (c) Blockers encountered and resolutions
    (d) N/A - no significant context to preserve]

---

## Verification Summary

[YOUR_VALUE_HERE: Fill this in after verification is complete.]

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | [YOUR_VALUE_HERE: count] | [ ]/[YOUR_VALUE_HERE] |
| P1 Items | [YOUR_VALUE_HERE: count] | [ ]/[YOUR_VALUE_HERE] |
| P2 Items | [YOUR_VALUE_HERE: count] | [ ]/[YOUR_VALUE_HERE] |

**Verification Date**: [YOUR_VALUE_HERE: YYYY-MM-DD]

**Verified By**: [YOUR_VALUE_HERE: Name or AI agent identifier]

[example:
| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 7 | 6/7 (1 deferred with approval) |
| P2 Items | 3 | 2/3 (1 deferred) |

**Verification Date**: 2024-01-15

**Verified By**: Claude (AI agent) + manual browser testing]

---

## Deferred Items Log

[YOUR_VALUE_HERE: Document any P1/P2 items that were deferred. P1 requires approval.]

| Item | Priority | Reason | Approval (P1 only) |
|------|----------|--------|-------------------|
| [YOUR_VALUE_HERE: CHK-###] | [P1/P2] | [YOUR_VALUE_HERE: Why deferred] | [YOUR_VALUE_HERE: Who approved, or N/A for P2] |

[example:
| CHK-042 | P2 | README not needed - internal feature | N/A |
| CHK-022 | P1 | Edge case testing deferred - timeline constraint | Approved by @product 2024-01-14 |]

---

<!--
VERBOSE LEVEL 2 TEMPLATE - VERIFICATION CHECKLIST (~250 lines)
- Extended guidance with [YOUR_VALUE_HERE], [NEEDS CLARIFICATION], and [example] patterns
- Level 2: Medium features (100-499 LOC), requires QA validation
- P0 = HARD BLOCKER (must complete)
- P1 = Required (complete OR approved deferral)
- P2 = Optional (can defer with documented reason)
- Mark [x] with evidence when verified
- After completion, summary section provides quick status overview
-->
