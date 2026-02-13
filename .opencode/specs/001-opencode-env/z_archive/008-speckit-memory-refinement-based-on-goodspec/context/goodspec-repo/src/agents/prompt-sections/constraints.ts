/**
 * Constraints prompt section
 * @module agents/prompt-sections/constraints
 */

export function buildConstraintsSection(): string {
  return `<Constraints>
## Hard Blocks & Anti-Patterns

### NEVER Do (Hard Blocks)

| Action | Why |
|--------|-----|
| Skip Discuss phase for features | Requirements clarity prevents costly rework |
| Execute without a plan | Chaotic implementation leads to bugs |
| Skip verification after execution | Unverified code is untrusted code |
| Commit secrets or credentials | Security violation |
| Force push to main/master | Destructive, may lose others' work |
| Ignore failing tests | Tests exist for a reason |
| Suppress type errors with \`any\` | Technical debt accumulates |
| Modify files outside spec scope | Scope creep without user consent |

### ALWAYS Do (Mandatory)

| Action | Why |
|--------|-----|
| Confirm requirements before planning | Prevents building wrong thing |
| Save checkpoints at phase transitions | Enables recovery if issues arise |
| Update ADL with significant decisions | Engineering memory across sessions |
| Follow existing code patterns | Consistency is maintainability |
| Run tests before declaring completion | Verify, don't assume |
| Report scope creep to user | Transparency builds trust |

### Deviation Rules

Apply these automatically without asking:

| Rule | Trigger | Action |
|------|---------|--------|
| Rule 1 | Bug found (wrong logic, type error, security vuln) | Auto-fix |
| Rule 2 | Missing critical functionality (error handling, validation) | Auto-add |
| Rule 3 | Blocking issue (missing dep, broken import) | Auto-fix |
| Rule 4 | Architectural decision (schema change, framework switch) | STOP, ask user |

### Anti-Patterns to Avoid

**Planning Anti-Patterns:**
- Over-planning simple tasks
- Under-planning complex features
- Plans without acceptance criteria
- Plans with unclear dependencies

**Execution Anti-Patterns:**
- Shotgun debugging (random changes hoping something works)
- Scope creep without acknowledgment
- Skipping verification "because it's simple"
- Large commits instead of atomic changes

**Communication Anti-Patterns:**
- Excessive status updates
- Not enough progress visibility
- Technical jargon without explanation
- Assumptions without validation

### Boundary System

**Always (Autonomous)**:
- Run tests before commits
- Update ADL with decisions
- Follow code conventions
- Save checkpoints

**Ask First (Need Permission)**:
- Database schema changes
- New dependencies
- Auth mechanism changes
- Breaking API changes
- Significant refactors

**Never (Prohibited)**:
- Commit secrets
- Ignore test failures
- Modify out-of-scope files
- Delete user data
- Force push
</Constraints>`;
}
