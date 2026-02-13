/**
 * Phase 4: Audit prompt section
 * @module agents/prompt-sections/audit
 */

export function buildAuditSection(): string {
  return `<Phase_4_Audit>
## Phase 4: Audit

**Goal**: Verify implementation against requirements before declaring completion.

### Audit Process

1. **Delegate to goop-verifier**
   \`\`\`
task({
     subagent_type: "general",
     description: "Verify requirements",
     prompt: \`
       Verify implementation against requirements:
       
       Original Requirements:
       [requirements from Phase 1]
       
       Execution Plan:
       [PLAN.md reference]
       
       Files Modified:
       [list of changed files]
       
       Verify:
       1. All requirements are met
       2. Acceptance criteria satisfied
       3. No regressions introduced
       4. Code quality standards met
       5. Security considerations addressed
     \`
   })
   \`\`\`

2. **Review Verification Results**

### Verification Checklist

**Functional Verification:**
- [ ] All requirements from Phase 1 implemented
- [ ] All acceptance criteria met
- [ ] Edge cases handled
- [ ] Error handling in place

**Quality Verification:**
- [ ] Code follows existing patterns
- [ ] No TypeScript errors
- [ ] Tests pass (if applicable)
- [ ] No console.log or debug code

**Security Verification:**
- [ ] Input validation present
- [ ] No hardcoded secrets
- [ ] Auth/authz properly handled
- [ ] No obvious vulnerabilities

**Documentation Verification:**
- [ ] ADL updated with decisions
- [ ] Code comments where needed
- [ ] README updated (if applicable)

### Handling Audit Failures

**If verification fails:**

1. **Minor Issues** (typos, missing edge cases)
   - Fix directly or delegate to executor
   - Re-verify affected areas
   
2. **Moderate Issues** (missing requirements)
   - Return to Phase 3 for targeted fixes
   - Re-audit affected areas
   
3. **Major Issues** (architectural problems)
   - STOP execution
   - Report to user
   - May need to revisit Phase 2

### Audit Report

Generate a summary:
\`\`\`
## Audit Report

### Requirements Coverage
| Requirement | Status | Notes |
|-------------|--------|-------|
| [Req 1]     | ✓      |       |
| [Req 2]     | ✓      |       |

### Quality Metrics
- TypeScript: Clean
- Tests: [N] passing
- Coverage: [X]%

### Issues Found
- [None / List of issues]

### Recommendation
[Ready for confirmation / Needs fixes]
\`\`\`

### Transition to Phase 5

If audit passes:
\`\`\`
"Audit complete. All verifications passed:
- Requirements: ✓
- Quality: ✓
- Security: ✓

Ready for final confirmation?"
\`\`\`

**Wait for user confirmation before completing.**
</Phase_4_Audit>`;
}
